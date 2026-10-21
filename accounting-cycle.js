/* ============================================================
   ACCOUNTING CYCLE ENGINE — draft / test harness
   ============================================================ */

function acRound2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }
function acFmt(n) {
  if (n === null || n === undefined || isNaN(n)) return "0";
  const r = acRound2(n);
  return r % 1 === 0 ? r.toLocaleString("en-IN") : r.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ---------- DATE RECOGNITION ----------
   Dates (1-Apr, 01/04/2026, 1st April, etc.) must never leak into amount
   extraction — "1-Apr" has no business becoming ₹1. Every date pattern is
   stripped out before acExtractAmounts ever looks at the text. */
const AC_MONTH_RE = "(jan(uary)?|feb(ruary)?|mar(ch)?|apr(il)?|may|jun(e)?|jul(y)?|aug(ust)?|sep(t|tember)?|oct(ober)?|nov(ember)?|dec(ember)?)";
const AC_DATE_RE = new RegExp(
  "\\b\\d{1,2}(st|nd|rd|th)?[\\s\\-/.]{1,2}" + AC_MONTH_RE + "\\b(?:,?\\s+(?:19|20)\\d{2}\\b)?" +          // 1-Apr, 01 April, 1st April, 1 April 2026
  "|\\b" + AC_MONTH_RE + "[\\s\\-/.]{1,2}\\d{1,2}(st|nd|rd|th)?\\b(?:,?\\s+(?:19|20)\\d{2}\\b)?" +          // Apr 1, April 1st, April 1, 2026
  "|\\b\\d{1,2}[\\-/.]\\d{1,2}[\\-/.]\\d{2,4}\\b" +                            // 01/04/2026, 1-4-2026, 1.4.2026
  "|\\b\\d{1,2}[\\-/]\\d{1,2}\\b(?!\\d)",                                      // 1/4 (day/month, no year)
  "gi"
);
function acExtractDate(text) {
  const re = new RegExp(AC_DATE_RE.source, "gi");
  const m = re.exec(text);
  return m ? m[0].trim() : null;
}
function acStripDates(text) {
  return text.replace(new RegExp(AC_DATE_RE.source, "gi"), " ");
}
const AC_MONTH_NAMES = { jan: "January", feb: "February", mar: "March", apr: "April", may: "May", jun: "June", jul: "July", aug: "August", sep: "September", oct: "October", nov: "November", dec: "December" };
const AC_MONTH_LIST = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
// Turns whatever date form was actually typed ("1-Apr", "01/04/2026",
// "1st April") into a consistent "Month Day[, Year]" display — never
// inventing a year that wasn't stated.
function acNormalizeDate(raw) {
  const s = raw.trim();
  let m = /^(\d{1,2})(?:st|nd|rd|th)?[\s\-/.]{1,2}([a-z]+)/i.exec(s);
  if (m) {
    const key = m[2].slice(0, 3).toLowerCase();
    if (AC_MONTH_NAMES[key]) return `${AC_MONTH_NAMES[key]} ${parseInt(m[1], 10)}`;
  }
  m = /^([a-z]+)[\s\-/.]{1,2}(\d{1,2})/i.exec(s);
  if (m) {
    const key = m[1].slice(0, 3).toLowerCase();
    if (AC_MONTH_NAMES[key]) return `${AC_MONTH_NAMES[key]} ${parseInt(m[2], 10)}`;
  }
  m = /^(\d{1,2})[\-/.](\d{1,2})[\-/.](\d{2,4})$/.exec(s);
  if (m) {
    const day = parseInt(m[1], 10), monNum = parseInt(m[2], 10);
    const monName = AC_MONTH_LIST[monNum - 1];
    let year = m[3]; if (year.length === 2) year = "20" + year;
    if (monName) return `${monName} ${day}, ${year}`;
  }
  m = /^(\d{1,2})[\-/](\d{1,2})$/.exec(s);
  if (m) {
    const day = parseInt(m[1], 10), monNum = parseInt(m[2], 10);
    const monName = AC_MONTH_LIST[monNum - 1];
    if (monName) return `${monName} ${day}`;
  }
  return s;
}

/* ---------- SIGNAL EXTRACTION ---------- */

// Find every "N%" token together with a short window of text around it,
// so the caller can decide *which* percentage (GST / trade discount /
// cash discount / profit / depreciation / interest / claim) it is from
// context words, rather than assuming positional order.
function acExtractPercents(text) {
  const clean = acStripDates(text);
  const out = [];
  const re = /([\d]+(?:\.\d+)?)\s*%/g;
  let m;
  while ((m = re.exec(clean))) {
    const value = parseFloat(m[1]);
    const start = Math.max(0, m.index - 28);
    const end = Math.min(clean.length, m.index + m[0].length + 12);
    out.push({ value, window: clean.slice(start, end).toLowerCase(), index: m.index });
  }
  return out;
}

function acPercentFor(percents, keywords) {
  for (const p of percents) {
    if (keywords.some(k => p.window.includes(k))) return p.value;
  }
  return 0;
}

// Like acPercentFor but for plain amounts — picks whichever extracted
// amount sits closest to one of the given keywords, so a sentence with
// two figures (e.g. "existing provision ₹2,000 ... new provision
// ₹3,000") can tell them apart by proximity rather than raw order.
function acAmountNear(text, amounts, keywords) {
  const i = acAmountNearIndex(text, amounts, keywords);
  return i === null ? null : amounts[i].value;
}
// Which amount sits nearest the given keywords — returns its INDEX (so the caller can tell
// WHICH of the sentence's figures was meant, not just its value) or null.
function acAmountNearIndex(text, amounts, keywords) {
  const lower = text.toLowerCase();
  let best = null, bestDist = Infinity;
  keywords.forEach(k => {
    const idx = lower.indexOf(k);
    if (idx === -1) return;
    const kwEnd = idx + k.length;
    amounts.forEach((a, ai) => {
      // Strongly prefer an amount that follows the keyword (its natural
      // position — "new provision required ₹3,000") over one that
      // merely happens to sit fewer characters away in an earlier
      // sentence ("...was ₹2,000. New provision...").
      const dist = a.index >= kwEnd ? (a.index - kwEnd) : (idx - a.index) + 100000;
      if (dist < bestDist) { bestDist = dist; best = ai; }
    });
  });
  return best;
}

// Money amounts: ₹ / Rs prefixed, or bare Indian-grouped numbers of at
// least 3 digits. Percentage tokens are stripped first so "18%" never
// gets mistaken for an amount.
function acStripDurations(text) {
  // "after 15 days" / "in 3 months" / "within 2 years" is a time period,
  // never a monetary amount — without this, "balance after 15 days on
  // credit" was extracting ₹15 as a second transaction amount.
  return text.replace(/\b\d+\s*(days?|d\.|months?|mos?\.|years?|yrs?\.|weeks?|wks?\.)\b/gi, " ");
}
// Same-length masking: every token that is NOT money (dates, durations,
// quantities, percentages, bare years) is blanked out with spaces of the
// SAME length, so amount positions stay valid against the original text
// (the old approach shortened the string, which silently shifted every
// index used for proximity matching whenever a date or % was present).
function acMaskNonMoney(text) {
  const blank = m => " ".repeat(m.length);
  let s = text;
  s = s.replace(new RegExp(AC_DATE_RE.source, "gi"), blank);
  s = s.replace(/\b\d+\s*(?:days?|d\.|months?|mos?\.|years?|yrs?\.|weeks?|wks?\.)\b/gi, blank);
  s = s.replace(/\b\d+(?:\.\d+)?\s*(?:units?|pcs|pieces?|kgs?|kilograms?|quintals?|tonnes?|tons?|litres?|liters?|metres?|meters?|dozens?|nos\.?|items?|packets?|cartons?|boxes|paise)\b/gi, blank);
  s = s.replace(/\d+(?:\.\d+)?\s*%/g, blank);
  s = s.replace(/\b(?:year|yr|month|quarter|week|day|no\.?|number|sr\.?|para|item|line|q)\s*[-#]?\s*\d{1,2}\b(?!\s*(?:,\d|\d))/gi, blank);   // "year 2", "No. 5" are labels, not money
  s = s.replace(/\b\d{1,2}(?:st|nd|rd|th)\s+(?:year|month|quarter|week|day)\b/gi, blank);
  s = s.replace(/\b(?:year|fy|f\.y\.|in|during|financial year)\s+(?:19|20)\d{2}(?:\s*[-–\/]\s*(?:19|20)?\d{2})?\b/gi, blank);
  return s;
}
// Money amounts: ₹ / Rs prefixed, or bare numbers; Indian grouping
// (1,00,000), plain digits, and "1 lakh" / "1.5 lakh" / "2 crore" forms.
function acExtractAmounts(text) {
  const masked = acMaskNonMoney(text);
  const re = /(?:₹|rs\.?\s*|inr\s*)?(\d+(?:,\d+)*(?:\.\d+)?)(?:\s*(lakhs?|lacs?|crores?)\b)?/gi;
  const out = [];
  let m;
  while ((m = re.exec(masked))) {
    let num = parseFloat(m[1].replace(/,/g, ""));
    if (isNaN(num)) continue;
    const unit = (m[2] || "").toLowerCase();
    if (unit.startsWith("lakh") || unit.startsWith("lac")) num = acRound2(num * 100000);
    else if (unit.startsWith("crore")) num = acRound2(num * 10000000);
    if (num < 1) continue; // ignore stray "0"/fractions
    out.push({ value: num, index: m.index, end: m.index + m[0].length, hasCurrency: /^(?:₹|rs|inr)/i.test(m[0]) });
  }
  return out;
}

const AC_STOPWORDS = new Set(["Cash","Bank","Rent","Salary","Sold","Paid","Received","Purchased","Goods","Credit","The","A","An","Furniture",
  "Machinery","Loan","Interest","Discount","Depreciation","Insurance","Started","Business","Old","Book","Value","Full","Settlement","Bill",
  "Balance","Bought","Cheque","Advance","Later","Compensation","Amount","Commission","Payment","Official","Receiver","Computer","Building",
  "Deposited","Withdrew","Issued","Given","Introduced","Sent","Supplied","Placed","Charged","Made","Returned","Gave","Took","Transferred",
  "GST","CGST","SGST","IGST","Fire","Theft","Charity","Donation","Wages","Carriage","Freight","Electricity","Stationery","Printing",
  "Advertisement","Vehicle","Land","Stock","Investment","Drawings","Capital","Debtor","Creditor","Provision","Bad","Debts","Recovered",
  "Outstanding","Prepaid","Accrued","Opened","Account","Personal","Use","Rs","Claim","Admitted","Commenced","Introduced","Total",
  "Recovered","Wrote","Written","Off","Him","Her","Them","Their","His","Its","Repaid","Dishonoured","Dishonored","Insolvent","Marked",
  "Further","Bill","Bills","Payable","Receivable","Renewed","Renewal","Maturity","Maintain","Provision","Remaining","Discounted","Interest",
  "Trade","Installation","Charges","Welfare","Employees","Office","Purposes","Free","Samples","Distributed","Destroyed","Stolen",
  "Company","Prepare","Opening","Following","Beginning","Year","Assets","Liabilities","Repairs","Allowed","Settled","Sales","Purchases","Salaries","Rents","Commissions","Repairs","Inventory","Proprietor","Owner","Customer","Supplier","Noting","Household","School","Fees","Tax","Income","Festival","Staff","Transit","Flood","Accident","Damaged","Bills","Drawn","Accepted","Drew","Discounted","Renewed","Working","Capital","Collected","Reimbursed","Remitted","Cleared","Realised","Realized","Acquired","Met","Endorsed","Sent","Cheques","Cheque","Deposited","Withdrawn","Bounced","Retired","Honoured","Honored","Matured","Provided","Depreciated","Depreciate","Depreciation","Charge","Charged","Written","Purchased","Bought","Sold","Introduced","Started"]);
function acIsMonthWord(w) {
  const lw = w.toLowerCase();
  return AC_MONTH_NAMES.hasOwnProperty(lw) || AC_MONTH_LIST.some(m => m.toLowerCase() === lw);
}
function acExtractParty(text) {
  // Strip dates first — "6-Apr: Paid Ram..." was otherwise picking up
  // "Apr" as the party name (it's capitalised and not a stopword), which
  // silently broke every date-prefixed transaction involving a party.
  const cleaned = acStripDates(text);
  const words = cleaned.replace(/[₹,]/g, " ").split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    const w = words[i].replace(/['’]s\b/g, "").replace(/[^a-zA-Z]/g, "");
    if (w.length > 2 && /^[A-Z]/.test(w) && !AC_STOPWORDS.has(w) && !acIsMonthWord(w)) {
      const w2 = (words[i + 1] || "").replace(/['’]s\b/g, "").replace(/[^a-zA-Z]/g, "");
      if (w2.length > 2 && /^[A-Z]/.test(w2) && !AC_STOPWORDS.has(w2) && !acIsMonthWord(w2)) return w + " " + w2;
      return w;
    }
  }
  return null;
}

function acHasAny(text, list) { return list.some(k => text.includes(k)); }

const AC_ASSET_WORDS = [
  ["furniture", "Furniture"], ["machinery", "Machinery"], ["plant", "Plant"], ["building", "Building"],
  ["computer", "Computer"], ["laptop", "Computer"], ["vehicle", "Vehicle"], ["motor car", "Vehicle"], ["car", "Vehicle"],
  ["land", "Land"], ["investment", "Investment"], ["goodwill", "Goodwill"],
  ["office equipment", "Office Equipment"], ["equipment", "Equipment"]
];
const AC_EXPENSE_WORDS = [
  ["salary", "Salary"], ["salaries", "Salary"], ["wages", "Wages"], ["rent", "Rent"], ["electricity", "Electricity Charges"],
  ["telephone", "Telephone Charges"], ["printing", "Printing & Stationery"], ["stationery", "Printing & Stationery"],
  ["advertisement", "Advertisement"], ["advertising", "Advertisement"], ["publicity", "Advertisement"], ["fire insurance premium", "Insurance Premium"], ["insurance premium", "Insurance Premium"], ["insurance", "Insurance Premium"],
  ["carriage inward", "Carriage Inwards"], ["carriage outward", "Carriage Outwards"], ["carriage", "Carriage"],
  ["freight", "Freight"], ["repair", "Repairs"], ["postage", "Postage & Courier"], ["conveyance", "Conveyance"],
  ["travelling", "Travelling Expenses"], ["legal charges", "Legal Charges"], ["audit fee", "Audit Fee"],
  ["general expenses", "General Expenses"], ["miscellaneous expenses", "Miscellaneous Expenses"], ["donation", "Donation"],
  ["charity", "Charity"], ["interest on loan", "Interest on Loan"], ["bank service charges", "Bank Charges"], ["collection charges", "Bank Charges"], ["bank charges", "Bank Charges"],
  ["renewal charges", "Renewal Charges"], ["commission", "Commission Paid"],
  ["municipal tax", "Municipal Tax"], ["property tax", "Property Tax"], ["road tax", "Vehicle Registration & Road Tax"],
  ["vehicle registration", "Vehicle Registration & Road Tax"], ["vehicle servicing", "Vehicle Running & Maintenance"],
  ["vehicle repair", "Vehicle Running & Maintenance"], ["vehicle running", "Vehicle Running & Maintenance"],
  ["internet", "Internet & Broadband Expenses"], ["broadband", "Internet & Broadband Expenses"],
  ["provident fund", "Staff Provident Fund Contribution"],
  ["office expenses", "Office Expenses"], ["loading charges", "Loading Charges"], ["unloading charges", "Unloading Charges"],
  ["delivery charges", "Delivery Charges"], ["cartage", "Cartage"], ["water charges", "Water Charges"],
  ["cleaning charges", "Cleaning Charges"], ["packing charges", "Packing Charges"], ["octroi", "Octroi"],
  ["import duty", "Import Duty"], ["custom duty", "Custom Duty"], ["entertainment expenses", "Entertainment Expenses"]
];
const AC_INCOME_WORDS = [
  ["commission received", "Commission Received"], ["commission", "Commission Received"],
  ["interest received", "Interest Received"], ["interest", "Interest Received"],
  ["rent received", "Rent Received"], ["rent", "Rent Received"],
  ["dividend received", "Dividend Received"], ["dividend", "Dividend Received"], ["discount received", "Discount Received"],
  ["subscription received", "Subscription Received"], ["subscription", "Subscription Received"]
];

function acFindLabel(text, dict) {
  for (const [kw, label] of dict) {
    // Plural-tolerant: "repair" also matches "repairs", "salary" -> "salaries" is listed separately.
    const re = new RegExp("\\b" + kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?:s|es)?\\b");
    if (re.test(text)) return label;
  }
  return null;
}

// Business name / opening-balance line normalisation for the "opening
// journal entry" pattern (a comma-separated list of assets & liabilities,
// not a single-transaction sentence — handled entirely separately from
// the main rule chain below).
const AC_OPENING_LIABILITY_KEYWORDS = ["creditor", "loan", "overdraft", "payable", "outstanding", "provision for doubtful", "provision for bad", "provision for depreciation", "accumulated depreciation", "income received in advance"];
const AC_OPENING_NAME_MAP = {
  "cash": "Cash", "cash in hand": "Cash", "cash balance": "Cash", "cash on hand": "Cash",
  "bank balance": "Bank", "bank": "Bank", "cash at bank": "Bank", "balance at bank": "Bank",
  "current account": "Bank", "savings account": "Bank", "bank account": "Bank",
  "bank overdraft": "Bank Overdraft", "overdraft": "Bank Overdraft",
  "stock": "Stock", "closing stock": "Stock", "opening stock": "Stock", "stock of goods": "Stock",
  "goods stock": "Stock", "goods": "Stock", "inventory": "Stock", "stock in trade": "Stock",
  "furniture": "Furniture", "furniture and fixtures": "Furniture", "furniture fixtures": "Furniture",
  "debtors": "Debtors", "sundry debtors": "Debtors", "creditors": "Creditors", "sundry creditors": "Creditors",
  "loan": "Loan", "bank loan": "Bank Loan", "loan from bank": "Bank Loan", "bank borrowing": "Bank Loan",
  "term loan": "Bank Loan", "working capital loan": "Bank Loan",
  "machinery": "Machinery", "plant and machinery": "Machinery", "machine": "Machinery", "plant": "Plant",
  "building": "Building", "office building": "Building", "premises": "Building", "land": "Land",
  "investment": "Investment", "investments": "Investment", "equipment": "Equipment", "office equipment": "Office Equipment",
  "goodwill": "Goodwill", "computer": "Computer", "computers": "Computer", "vehicle": "Vehicle", "motor vehicle": "Vehicle",
  "bills receivable": "Bills Receivable", "bill receivable": "Bills Receivable",
  "bills payable": "Bills Payable", "bill payable": "Bills Payable",
  "accumulated depreciation": "Accumulated Depreciation", "provision for depreciation": "Accumulated Depreciation",
  "provision for doubtful debts": "Provision for Doubtful Debts", "provision for bad debts": "Provision for Doubtful Debts",
  "provision for discount on debtors": "Provision for Discount on Debtors", "provision for discount on creditors": "Provision for Discount on Creditors",
  "outstanding expenses": "Outstanding Expenses", "outstanding salary": "Outstanding Salary", "outstanding rent": "Outstanding Rent",
  "income received in advance": "Income Received in Advance", "prepaid expenses": "Prepaid Expenses"
};
// Section headers ("Assets:", "Liabilities:", "Debtors:", "Creditors:",
// "Capital:") that a textbook opening-balances paragraph is built from.
// Recognising these directly — rather than requiring the phrase "opening
// entry" to appear literally — is what lets a question phrased purely as
// "Assets: ...; Liabilities: ...;" (with no such phrase at all) still be
// understood as opening balances instead of failing as an ordinary,
// unparseable transaction line.
const AC_OPENING_HEADER_RE = /\b(assets|liabilities|debtors|sundry debtors|creditors|sundry creditors|capital)\s*:/gi;
// A plain list of "AccountName ₹Amount" lines — no verbs, no sentence
// structure — with no "Assets:"/"Liabilities:" headers and no "opening
// entry" phrase anywhere, e.g. a student just typing:
//   Cash ₹40,000
//   Bank ₹60,000
//   Creditors ₹35,000
// This is still unambiguously an opening-balances list; the only
// question is whether each line is a bare "name + amount" and there are
// enough of them that it can't reasonably be anything else.
const AC_BARE_OPENING_LINE_RE = /^[A-Za-z][A-Za-z &.'/]*\s+(?:₹|rs\.?|inr)?\s*[\d,]+(?:\.\d+)?\s*\.?\s*$/i;
// A colon, "=", or a standalone dash/en-dash/em-dash is just a formatting separator between an
// account name and its amount ("Building: ₹10,000", "Building = 10000", "Building — ₹10,000"), and
// "worth"/"valued at"/"costing"/"amounting to" are the same kind of connector in ordinary English —
// none of them carry accounting meaning of their own, so both the bare-line CHECK and the actual
// account/amount EXTRACTION run against text with these connectors collapsed to plain whitespace.
// This is the one place that needs to understand the separator; nothing downstream has to.
function acNormalizeOpeningSeparators(s) {
  return String(s)
    .replace(/\s*(?:valued\s+at|amounting\s+to|costing|worth\s+of|worth)\s*/gi, " ")
    .replace(/\s*[:=]\s*/g, " ")
    .replace(/\s+[-\u2010-\u2015]\s+/g, " ")   // a dash used as a separator (surrounded by spaces) — never a hyphen inside a word
    .replace(/\s+of\s+(?=(?:₹|rs\.?|inr\b|\d))/gi, " ")
    .replace(/[()]/g, " ")
    .replace(/\s+/g, " ").trim();
}
// Excludes ordinary transaction sentences that happen to also fit the
// bare "words + trailing amount" shape (e.g. "Paid rent ₹5,000") — an
// opening-balance line is just an account name, never a verb-led
// sentence, so any of these words disqualifies it.
const AC_TRANSACTION_VERB_RE = /\b(paid|pay|sold|purchased|bought|received|receive|deposited|withdrew|withdrawn|withdraw|returned|allowed|charged|settled|started|commenced|introduced|issued|given|transferred|wrote|written|took|taken|spent|donated|distributed|destroyed|lost|damaged|insured|posted)\b/i;
function acSplitOpeningSegments(s) {
  return String(s).split(/;|\n|,\s*(?=[A-Za-z])/).map(x => x.trim()).filter(Boolean);
}
function acIsBareOpeningLine(s) {
  const n = acNormalizeOpeningSeparators(acStripDates(s).replace(/^\s*[:=]\s*|^\s*[-\u2010-\u2015]\s*/, ""));
  return AC_BARE_OPENING_LINE_RE.test(n) && !AC_TRANSACTION_VERB_RE.test(n);
}
function acLooksLikeBareOpeningList(rawText) {
  const segments = acSplitOpeningSegments(rawText);
  if (segments.length < 3) return false;
  // A leading date segment ("1-Apr") is fine and doesn't count against
  // the "every segment must be an account line" check — it carries no
  // amount, so the item-extraction step further down just skips it.
  const accountSegments = segments.filter(s => !acIsDateOnlyLine(s));
  if (accountSegments.length < 3) return false;
  return accountSegments.every(s => acIsBareOpeningLine(s));
}
// Matches a line that's ONLY a date (optionally with a trailing colon),
// e.g. "1-Apr:", "1-Apr", "On 1 April:" — used so a date line that
// precedes an opening-balance list gets folded into the entry instead
// of standing alone as its own unparseable "transaction".
function acIsDateOnlyLine(s) {
  const stripped = s.replace(/^on\s+/i, "").replace(/[:\-–]\s*$/, "").trim();
  const found = acExtractDate(stripped);
  return found !== null && found === stripped;
}
function acParseOpeningEntry(rawText, idx) {
  const hasHeader = new RegExp(AC_OPENING_HEADER_RE.source, "i").test(rawText);
  const hasTriggerPhrase = /opening journal entry|opening entry|assets and liabilities at the beginning/i.test(rawText);
  const isBareList = acLooksLikeBareOpeningList(rawText);
  if (!hasHeader && !hasTriggerPhrase && !isBareList) return null;

  const cleaned = rawText.replace(/^.*?(?:beginning of the year|as follows)\s*:?\s*/i, "");

  // Split the text into section chunks on each recognised header, so
  // every item is classified by the heading that actually introduced it
  // (an item like "Ashok ₹13,500" carries no liability keyword of its
  // own — it only reads as a liability because it sits under
  // "Liabilities: Creditors:").
  const headerMatches = [...cleaned.matchAll(AC_OPENING_HEADER_RE)].filter(mm => {
    if (mm[1].toLowerCase() === "capital") return true;
    const after = cleaned.slice(mm.index + mm[0].length);
    return !/^\s*(?:₹|rs\.?|inr\b|\d)/i.test(after);
  });
  const parts = [];
  if (!headerMatches.length) {
    parts.push({ header: "assets", text: cleaned });
  } else {
    if (headerMatches[0].index > 0) {
      const lead = cleaned.slice(0, headerMatches[0].index).trim();
      if (lead) parts.push({ header: "assets", text: lead });
    }
    headerMatches.forEach((mm, i) => {
      const start = mm.index + mm[0].length;
      const end = i + 1 < headerMatches.length ? headerMatches[i + 1].index : cleaned.length;
      parts.push({ header: mm[1].toLowerCase(), text: cleaned.slice(start, end) });
    });
  }

  const items = [];
  let explicitCapital = null;
  parts.forEach(p => {
    if (p.header === "capital") {
      const numMatch = p.text.match(/([\d][\d,]*(?:\.\d+)?)/);
      if (numMatch) explicitCapital = parseFloat(numMatch[1].replace(/,/g, ""));
      return;
    }
    const isLiabSection = /^(liabilit|creditor)/.test(p.header);
    const ptext = acNormalizeOpeningSeparators(acStripDates(p.text));
    const re = /([A-Za-z][A-Za-z ]*?)\s+(?:₹|rs\.?|inr\b)?\s*([\d,]+(?:\.\d+)?)(?!\s*%)/gi;
    let im;
    while ((im = re.exec(ptext))) {
      let label = im[1].trim().replace(/^(and|of)\s+/i, "").trim().toLowerCase();
      const amount = parseFloat(im[2].replace(/,/g, ""));
      if (!label || isNaN(amount)) continue;
      // "Capital ₹90,000" written inline in a bare list is the STATED capital,
      // not an asset — reading it as one debited Capital and then credited a
      // second, derived Capital for the same figure.
      if (/^(capital|total capital|capital account)( \(capital\))?$/.test(label)) {
        if (explicitCapital === null) explicitCapital = amount;
        continue;
      }
      items.push({ label, amount, isLiabSection });
    }
  });
  if (items.length < 2) return null; // not actually this pattern — fall through to normal parsing

  const lines = [];
  let totalAssets = 0, totalLiabs = 0;
  items.forEach(it => {
    const name = AC_OPENING_NAME_MAP[it.label] || (it.label.charAt(0).toUpperCase() + it.label.slice(1));
    const isLiab = it.isLiabSection || AC_OPENING_LIABILITY_KEYWORDS.some(k => it.label.includes(k));
    if (isLiab) { lines.push({ account: name + " A/c", cr: it.amount }); totalLiabs = acRound2(totalLiabs + it.amount); }
    else { lines.push({ account: name + " A/c", dr: it.amount }); totalAssets = acRound2(totalAssets + it.amount); }
  });

  // Capital = Assets − Liabilities, auto-calculated — unless the question
  // already gives a capital figure that's consistent with that
  // arithmetic, in which case the stated figure is used as-is rather
  // than silently recomputing over it.
  const derivedCapital = acRound2(totalAssets - totalLiabs);
  // A capital figure the question states outright must be used as-is ONLY when it
  // agrees with the accounting equation; if it does not, one of the stated balances
  // is wrong and guessing would hide it — refuse instead and say why.
  if (explicitCapital !== null && Math.abs(explicitCapital - derivedCapital) >= 0.5) {
    return { ok: false, status: "UNCERTAIN", reason: `The stated capital (${acFmtR(explicitCapital)}) does not equal assets − liabilities (${acFmtR(derivedCapital)}), so one of the balances in this opening entry is inconsistent — please check the figures.` };
  }
  const capital = explicitCapital !== null ? explicitCapital : derivedCapital;
  if (capital >= 0) lines.push({ account: "Capital A/c", cr: capital });
  else lines.push({ account: "Capital A/c", dr: -capital });

  return { ok: true, index: idx, text: rawText, lines, narration: "Opening entry", tag: "opening" };
}

// A textbook opening-balances paragraph is sometimes typed as several
// separate lines (one for Assets, one for Debtors, one for
// Liabilities/Creditors) rather than one block. Each such line is
// meaningless as a standalone transaction, so consecutive lines that
// each start with a recognised opening-balance header are merged into a
// single combined line before per-line parsing — this is purely about
// grouping the *input*; acParseOpeningEntry above still does all the
// actual accounting.
// A line is "all bare items" if every semicolon-separated piece of it
// looks like a plain "AccountName ₹Amount" — this is what lets a line
// like "Cash ₹60,000; Bank ₹90,000; Stock ₹1,20,000;" (several items
// packed onto one line, as students often paste them) be recognised,
// not just one bare item per line.
function acAllBareItems(s) {
  const segs = acSplitOpeningSegments(s);
  if (!segs.length) return false;
  return segs.every(x => acIsBareOpeningLine(x));
}
function acCountItems(s) {
  return acSplitOpeningSegments(s).length;
}
// A "leader" line carries no account/amount data of its own — just a
// date and/or the phrase "Opening balances:" — e.g. "1-Apr: Opening
// balances:". It gets folded into whatever opening-balance content
// follows rather than standing alone as its own empty transaction.
function acIsLeaderLine(s) {
  const withoutDate = acStripDates(s).replace(/[:\-–]/g, " ").trim();
  const hasDate = acExtractDate(s) !== null;
  const isJustOpeningPhrase = /^(on\s+)?(opening\s+(balances?|entry|journal entry))?$/i.test(withoutDate);
  return isJustOpeningPhrase && (hasDate || /opening/i.test(s));
}
// "Debtors:" / "Creditors:" genuinely INTRODUCE A LIST only when what follows the colon is not
// itself already an amount — "Debtors: Ram ₹5,000, Shyam ₹3,000" is a heading, but "Debtors: ₹20,000"
// is just that one item using a colon as its separator (the same account/amount pair "Debtors
// ₹20,000" would be), and must not swallow the unrelated lines that happen to follow it.
function acIsGenuineOpeningHeaderLine(s) {
  const m = /^\s*(assets|liabilities|debtors|sundry debtors|creditors|sundry creditors)\s*:\s*([\s\S]*)$/i.exec(s);
  if (!m) return false;
  return !/^\s*(?:₹|rs\.?|inr\b|\d)/i.test(m[2]);
}
// Is this accumulated group already a COMPLETE opening entry (debits = credits)?
// Once it balances, the list is closed: the next "Account ₹Amount" line is a
// separate transaction and must never be swallowed into the opening journal.
function acOpeningBalanced(s) {
  try {
    const e = acParseOpeningEntry(s, 1);
    if (!e || !e.lines || !e.lines.length) return false;
    const dr = e.lines.reduce((t, l) => t + (l.dr || 0), 0);
    const cr = e.lines.reduce((t, l) => t + (l.cr || 0), 0);
    return Math.abs(dr - cr) < 0.01;
  } catch (e2) { return false; }
}
function acMergeOpeningBalanceLines(rawLines) {
  const headerStartRe = { test: acIsGenuineOpeningHeaderLine };
  const out = [];
  let i = 0;
  while (i < rawLines.length) {
    let datePrefix = "";
    let startIdx = i;
    if (acIsLeaderLine(rawLines[i]) && i + 1 < rawLines.length && (headerStartRe.test(rawLines[i + 1]) || acAllBareItems(rawLines[i + 1]))) {
      const d = acExtractDate(rawLines[i]);
      datePrefix = (d ? d : "") + "; ";
      startIdx = i + 1;
    }
    if (headerStartRe.test(rawLines[startIdx])) {
      const group = [rawLines[startIdx]];
      let j = startIdx + 1;
      while (j < rawLines.length && headerStartRe.test(rawLines[j])) { group.push(rawLines[j]); j++; }
      out.push(datePrefix + group.join("; "));
      i = j;
    } else if (acAllBareItems(rawLines[startIdx])) {
      // A run of lines that are each entirely made of "AccountName
      // ₹Amount" items (one item per line, or several packed onto one
      // line) — merge the whole run into a single opening entry once
      // there are at least 3 items total.
      const group = [rawLines[startIdx]];
      let itemCount = acCountItems(rawLines[startIdx]);
      let j = startIdx + 1;
      // merge only while the entry is still open; a balanced group is FINISHED
      while (j < rawLines.length && acAllBareItems(rawLines[j]) && !(itemCount >= 3 && acOpeningBalanced(group.join("; ")))) { group.push(rawLines[j]); itemCount += acCountItems(rawLines[j]); j++; }
      if (itemCount >= 3) {
        out.push(datePrefix + group.join("; "));
        i = j;
      } else {
        out.push(rawLines[i]);
        i++;
      }
    } else {
      out.push(rawLines[i]);
      i++;
    }
  }
  return out;
}

// Repaying a loan debits the SAME loan account that received it (identity, not wording).
function acPickLoanAccount(text, state) {
  const b = (state && state.balances) || {};
  if ((b.bank_loan || 0) < -0.005 && !((b.loan || 0) < -0.005)) return "Bank Loan A/c";
  if ((b.loan || 0) < -0.005 && !((b.bank_loan || 0) < -0.005)) return "Loan A/c";
  return /\bbank\b|term loan|working[- ]capital/.test(text) ? "Bank Loan A/c" : "Loan A/c";
}
/* ---------- ONE-LINE PARSER (legacy rule chain — now the fallback interpreter) ---------- */
// ctx (optional) carries state across the transactions in one run — the
// only cases that need it are ones later lines rely on without repeating
// a figure (e.g. "Deposited the cheque into bank." after an earlier
// "received a cheque ... ₹X" line).
function acLegacyParse(rawText, idx, ctx) {
  const original = rawText.trim();
  if (!original) return null;

  ctx = ctx || {};
  ctx.assetBook = ctx.assetBook || {};
  // A date stated on this line becomes "the current date" for any
  // following undated lines too, the same way a real journal only
  // writes a new date when it actually changes.
  const foundDate = acExtractDate(original);
  if (foundDate) ctx.lastDate = acNormalizeDate(foundDate);
  const date = ctx.lastDate || null;

  const openingResult = acParseOpeningEntry(original, idx);
  if (openingResult) { openingResult.date = date; return openingResult; }
  let text = " " + original.toLowerCase() + " ";
  text = text.replace(/\brs\.?\s*(?=[\d₹])/g, "₹").replace(/\binr\b/g, "₹");
  text = text.replace(/interest on (?:the |a |our )?(?:[a-z\-]+ ){0,3}?loan/g, "interest on loan");
  // everyday synonyms the rule chain was never taught (kept narrow so "cheque collected by the bank" is untouched)
  text = text.replace(/\bcollected\b(?=\s+(?:₹|rs\b|\d|(?:rent|interest|commission|dividend|cash|amount|dues)\b))/g, "received").replace(/\b(?:realised|realized)\b(?=\s+(?:₹|\d))/g, "received").replace(/\b(?:reimbursed|remitted)\b/g, "paid");

  const percents = acExtractPercents(text);
  const amounts = acExtractAmounts(text);
  let party = acExtractParty(original);
  let partyFromContext = false;
  // Contextual resolution: "Allowed her discount ₹500" or "Later paid
  // ₹42,750 in full settlement" (no name, no pronoun at all) both refer
  // back to whoever the previous transaction was about — a very common
  // exam-question convention where a follow-up settlement line doesn't
  // re-name the party. ctx.lastParty is only ever set from a party this
  // engine genuinely just transacted with, never guessed, so this stays
  // safe even without a pronoun to trigger on.
  if (!party && ctx.lastParty && (/\b(her|his|their|him|them)\b/.test(text) || /full settlement|final settlement|\bsettled\b|in settlement/.test(text))) {
    party = ctx.lastParty;
    partyFromContext = true;
  }

  const isGstInclusive = /including gst|inclusive of gst|gst inclusive|incl\.?\s*gst|gst incl\.?/.test(text);
  // Head-specific lookup first ("CGST 6% and SGST 9%" must not give both heads the first % found).
  const cgstPctExplicit = acHeadRate(text, "cgst") || acPercentFor(percents, ["cgst"]);
  const sgstPctExplicit = acHeadRate(text, "sgst") || acPercentFor(percents, ["sgst"]);
  const igstPctExplicit = acHeadRate(text, "igst") || acPercentFor(percents, ["igst"]);
  const gstPct = acHeadRate(text, "gst") || acPercentFor(percents, ["gst"]);
  const isIGST = text.includes("igst") || text.includes("inter-state") || text.includes("interstate") || text.includes("outside the state") || text.includes("other state");
  const tradeDiscPct = acPercentFor(percents, ["trade discount", "trade disc"]);
  const cashDiscPct = acPercentFor(percents, ["cash discount", "cash disc"]);
  const depPct = acPercentFor(percents, ["depreciat", "written down", "wdv"]);
  const claimPct = acPercentFor(percents, ["claim", "admitted", "accepted by insurance", "insurance company admitted"]);
  const provPct = acPercentFor(percents, ["provision", "doubtful"]);

  // Mode: an explicit "in cash/by cash/for cash", "cheque", or "credit"
  // phrase wins over a bare mention of "bank" — a sentence can say
  // "loan from the bank in cash" where "bank" is naming the lender, not
  // the mode, so the more specific phrasing must take priority.
  const mode =
    /\bon credit\b|\bcredit\b/.test(text) ? "credit" :
    /\bcheque\b|\bchq\b/.test(text) ? "cheque" :
    /\bin cash\b|\bby cash\b|\bfor cash\b/.test(text) ? "cash" :
    /\bbank\b|\bneft\b|\brtgs\b|\bupi\b|\bimps\b|online transfer|bank transfer|demand draft|\bdd\b|current account|savings account/.test(text) ? "bank" :
    /\bcash\b/.test(text) ? "cash" :
    (party ? "credit" : "cash");

  const isBadDebtRecovered = /recovered/.test(text) && /(bad debt|written off|wrote off)/.test(text) && !/could not|unable to|not recoverable|declared insolvent/.test(text);
  const isInsolvent = /insolvent/.test(text);
  const partyReturned = party && new RegExp("\\b" + party.toLowerCase().split(" ")[0] + "\\s+returned").test(text);

  const flags = {
    isReturn: /\breturn/.test(text),
    isPurchaseReturn: /\breturn/.test(text) && (/return(ed)?\b[\s\S]{0,40}\bto\s+(?!₹|rs\.?\s*\d|\d)/.test(text) || /purchase return/.test(text) || /returned.*(supplier|creditor)/.test(text) || (/return/.test(text) && /purchas/.test(text))),
    isSalesReturn: /\breturn/.test(text) && (/return(ed)?\b[\s\S]{0,40}\bby\b/.test(text) || /sales return/.test(text) || /returned.*(customer|debtor)/.test(text) || partyReturned || (/return/.test(text) && !/purchas/.test(text) && !/return(ed)?\b[\s\S]{0,40}\bto\s+(?!₹|rs\.?\s*\d|\d)/.test(text) && /sold|sale|customer|debtor/.test(text))),
    isManagersCommission: /manager/.test(text) && /commission/.test(text),
    isGstSetOff: /set.?off|adjust(ed|ing)?\s+(the\s+)?(input|output)?\s*gst/.test(text) && /gst/.test(text),
    isGstLiabilityPayment: /gst/.test(text) && /liabilit/.test(text) && /\bpaid\b|\bpay\b/.test(text),
    isProvisionDiscountCreditors: /provision for discount on creditors/.test(text),
    isFireTheft: (/\bfire\b|\btheft\b|\bstolen\b|\bburgl|\baccident\b|\bgoods lost\b|\bflood\b|\bin transit\b|\bgoods\b[\s\S]{0,40}\b(?:were |was |got )?(?:lost|destroyed|damaged|spoiled|washed away)\b/.test(text)) && !/premium/.test(text),
    isCharity: /\bcharity\b|\bdonat/.test(text) && /goods/.test(text),
    isFreeSamples: (/free sample|free gift|\bsamples?\b|market research/.test(text)) && /goods/.test(text),
    isStaffWelfare: (/welfare|staff gift|canteen/.test(text) || (/distributed/.test(text) && /employees/.test(text)) || (/\bgifts?\b/.test(text) && /\b(staff|employees|workers)\b/.test(text))) && /goods/.test(text),
    isOfficeUse: /(office purpose|for office use|used for office)/.test(text) && /goods/.test(text),
    isDrawingsGoods: /goods.*(personal use|own use|personal purpose|drawings)|withdrew goods|goods withdrawn/.test(text),
    // Broad enough to catch "for the proprietor's personal use" / "for
    // his own personal expenses" etc — not just the narrower "for
    // personal use" phrased with nothing in between — since a
    // possessive noun between "for" and "personal/own/private" is
    // common exam phrasing and must not fall through undetected.
    isDrawingsCash: /(withdrew|drew|took)\b[\s\S]{0,40}\b(personal|own|private)\b[\s\S]{0,15}\b(use|expenses?|purposes?)\b|cash withdrawn for personal|drawings/.test(text) && !/goods/.test(text),
    isBadDebtRecovered,
    isBadDebt: (/written off|wrote off|could not be recovered|unable to recover|irrecoverable|insolvent|became (a )?bad debt|is a bad debt|as bad debt/.test(text) || (/\bbad debts?\b/.test(text) && /\d/.test(text))) && !isBadDebtRecovered && !isInsolvent,
    isInsolvent,
    isProvisionDD: /provision for doubtful debts|provision for bad/.test(text),
    isProvisionDiscount: /provision for discount/.test(text) && !/provision for discount on creditors/.test(text),
    isDepreciation: /depreciat/.test(text) && !(/\bsold\b/.test(text) && /(furniture|machinery|plant|computer|building|vehicle|land|investment|goodwill|equipment|\basset\b|car)/.test(text)),
    isSettlingOutstanding: /outstanding/.test(text) && (/\bpaid\b|\bpay\b/.test(text)) && !(/remain(ed|s|ing)?\s+(as\s+)?outstanding|still\s+outstanding|outstanding\s+balance\s+of|(unpaid|balance)\s+of\s+(this|the|₹|rs)/.test(text)) && (amounts.length === 1),
    // "Salary ₹20,000; ₹3,000 is still outstanding" is an ADJUSTMENT line with no payment in it.
    // The split still has to be recognised, else the whole ₹3,000 falls out of the entry as UNCERTAIN.
    isPartialOutstanding: (amounts.length >= 2 && /outstanding|unpaid/.test(text)) && !/\bpaid\b|\bpay\b/.test(text),
    isOutstanding: /outstanding|unpaid|due but not paid|yet to be paid/.test(text),
    isPrepaid: /prepaid/.test(text) || (/in advance/.test(text) && /\bpaid\b|\bpay\b/.test(text)),
    isAccruedIncome: /accrued|earned[\s\S]{0,15}\bnot\b[\s\S]{0,10}received|due[\s\S]{0,15}\bnot\b[\s\S]{0,10}received|became due/.test(text),
    isIncomeAdvance: /received in advance|advance received/.test(text) || (/in advance/.test(text) && /\breceived\b|\breceive\b/.test(text)),
    isContraDeposit: (/deposited.*(bank|into bank|current account|savings account)/.test(text) && /\bbank\b|current account|savings account/.test(text) && !/cheque/.test(text)) || (/\b(?:paid|transferred)\b.*(into|to|in) (the |a |his |her |our )?(bank|current account|savings account)/.test(text) && /\bcash\b/.test(text) && !/cheque/.test(text)),
    isContraWithdrawBank: /withdr\w*[\s\S]{0,25}bank|bank[\s\S]{0,15}withdr\w*/.test(text) && !/personal|own use|private use|for himself|for herself|\bdrawings\b/.test(text),
    isOpenedBank: /opened a?\s*(bank|current|savings) account/.test(text),
    isCapitalIntro: /commenced business|business commenced|started business|business started|started (his|her|the)? ?business|business (was )?started|business (was )?(opened|launched)|opened business|launched business|commenced operations|operations (was |were )?commenced|started operations|operations (was |were )?started|introduced.*capital|capital introduced|brought in.*capital/.test(text),
    isAdditionalCapital: /additional capital|further capital|\bas capital\b|towards capital|capital (?:was |is )?(?:introduced|brought in|contributed|invested)|(?:introduced|invested|contributed|brought in)[^.;]{0,30}\bcapital\b/.test(text),
    isInterestOnCapital: /interest on capital/.test(text),
    isInterestOnDrawings: /interest on drawings/.test(text),
    isBankInterestAllowed: /bank allowed interest|interest allowed by bank|bank credited interest/.test(text) && !(/charges?\b/.test(text) && /deduct|debit/.test(text)),
    isLoanTaken: /loan (taken|obtained|borrowed)|took (a )?(bank |cash |term |short-term |long-term )?loan|borrowed.*loan|loan from|availed (a |the )?loan/.test(text) && !/repaid|repayment/.test(text),
    isLoanGiven: /loan given|granted a loan|loan to\b|advanced a loan|gave a loan/.test(text),
    isLoanRepaymentReceived: /received/.test(text) && /repayment/.test(text) && /loan/.test(text),
    isLoanRepaid: /repaid.*loan|loan repaid|repayment of (a |the )?loan|\bloan\b[\s\S]{0,40}\b(?:was |were |is )?(?:repaid|paid off|cleared|settled)\b/.test(text),
    isFullSettlement: /full settlement|in full settlement|settled?\s+(his|her|their|the)?\s*account|final settlement/.test(text),
    isAssetSale: /\bsold\b/.test(text) && /(furniture|machinery|plant|computer|building|vehicle|land|investment|goodwill|equipment|\basset\b|car)/.test(text),
    isInstallationCapitalize: /installation|legal charges|brokerage|registration charges|stamp duty/.test(text),
    isClaimAdmitted: /admitted (a )?claim|claim (was |is )?admitted/.test(text),
    isClaimReceived: /received the insurance claim|insurance claim received|received.*claim.*(cheque|cash|bank)/.test(text),
    isClaimRejected: /claim.*rejected|rejected.*claim/.test(text),
    isPartialClaim: /insurance claim/.test(text) && /goods lost/.test(text),
    isDishonoured: /dishonour|dishonor/.test(text),
    isChequeReceived: /cheque/.test(text) && /received/.test(text) && /from/.test(text) && !/dishonour|dishonor/.test(text) && !/full settlement|final settlement/.test(text),
    isBankInterestAndCharges: /\bbank\b/.test(text) && /interest/.test(text) && /charges?\b/.test(text) && /credit|allowed/.test(text) && /deduct|debit/.test(text),
    // "Bank directly credited interest..." / "Bank charges were debited
    // directly by the bank" — the money movement happens inside the
    // bank statement itself, with no cash/cheque changing hands, so
    // these need their own recognition distinct from an ordinary
    // "paid"/"received" transaction.
    isBankDirectCredit: /\bbank\b/.test(text) && /directly/.test(text) && /credit/.test(text) && !/charges?\b/.test(text) && !/\bloan\b/.test(text),
    isBankDirectDebit: /\bbank\b/.test(text) && (/directly/.test(text) && /debit|deduct/.test(text) || (/charges?\b/.test(text) && /\bdebited\b|\bdeducted\b/.test(text))),
    isChequeDeposited: /deposited/.test(text) && /cheque/.test(text) && /bank/.test(text),
    isChequeIssued: /issued (a |the )?cheque/.test(text) && /\bto\b/.test(text),
    isDebtorDepositedBank: /debtor/.test(text) && /deposited/.test(text) && /bank/.test(text),
    isChequeEndorsed: /endorsed/.test(text) && /cheque/.test(text),
    isChequeSentForCollection: /sent (a |the )?cheque/.test(text) && /collection/.test(text) && !/collected/.test(text),
    isChequeCollected: /collected/.test(text) && /collection/.test(text),
    isSettlementOfEarlier: /(?:for|against|towards)\s+(?:the\s+)?goods\s+(?:purchased|bought|sold|supplied)\s+(?:earlier|previously|before|last\s+\w+)|goods\s+(?:purchased|sold|supplied)\s+earlier|earlier\s+(?:purchase|sale)s?/.test(text),
    isGift: /gift/.test(text) && /received/.test(text),
    isGoodsSentApproval: /sent on approval/.test(text) && !/accepted/.test(text) && !/returned/.test(text),
    isGoodsApprovalAccepted: /approval/.test(text) && /accepted/.test(text),
    isGoodsApprovalReturned: /approval/.test(text) && /returned/.test(text),
    isAdvancePaidSupplier: /\bpaid\b/.test(text) && /advance/.test(text) && /supplier/.test(text) && !/against/.test(text),
    isAdvanceReceivedCustomer: /received/.test(text) && /advance/.test(text) && /customer/.test(text) && !/against/.test(text),
    isGoodsAgainstAdvancePaid: /goods/.test(text) && /supplier/.test(text) && /advance/.test(text) && /against/.test(text),
    isGoodsAgainstAdvanceReceived: /goods/.test(text) && /customer/.test(text) && /advance/.test(text) && /against/.test(text),
    isBillReceivableReceived: /bill receivable/.test(text) && /received/.test(text) && !/dishonour|dishonor/.test(text),
    isBillPayableAccepted: /bill payable/.test(text) && /accepted/.test(text),
    isBillReceivableDishonoured: /bill receivable/.test(text) && /dishonour|dishonor/.test(text),
    isBillPayablePaid: /bill payable/.test(text) && (/\bpaid\b/.test(text) || /maturity/.test(text)) && !/accepted/.test(text) && !/charges/.test(text) && !/renewal/.test(text),
    isBillDiscounted: /bill receivable/.test(text) && /discount/.test(text) && /received/.test(text) && /bank/.test(text),
    isDiscountedBillDishonoured: /discounted bill/.test(text) && /dishonour|dishonor/.test(text),
    isRebateByCreditor: /creditor/.test(text) && /rebate/.test(text),
    isRebateToCustomer: /customer/.test(text) && /rebate/.test(text),
    isExpensePaidPersonally: /(proprietor|owner)/.test(text) && /(personally|personal account|personal fund)/.test(text) && /paid/.test(text) && !/income[\s-]tax/.test(text),
    // An item that is inherently the *proprietor's own* — their life
    // insurance, personal school fees, personal shopping — paid for out
    // of business cash is a withdrawal of business funds for personal
    // use (Drawings), never a business expense, even though the item
    // itself (e.g. "insurance premium") would otherwise map to a normal
    // expense account.
    isProprietorPersonalItem: /(life insurance|insurance premium|\binsurance\b|school fees|tuition fees|college fees|household expenses|personal expenses|personal shopping|medical expenses|medical bills)/.test(text)
      && /(of the proprietor|of the owner|proprietor'?s|owner'?s|for the proprietor|for the owner|for himself|for herself)/.test(text)
      && !/income[\s-]tax/.test(text),
    isMiscIncomeSale: /\bsold\b/.test(text) && /(old newspapers?|newspapers?|scrap|waste paper|empty (bags|bottles|cartons|tins)|packing material)/.test(text),
    isIncomeTaxFromPersonal: /income[\s-]tax/.test(text) && /(personal account|personal fund)/.test(text),
    isIncomeTaxFromBusiness: /income[\s-]tax/.test(text) && /\bpaid\b/.test(text) && !/(personal account|personal fund)/.test(text)
  };

  const isGoods = /\bgoods\b/.test(text);
  // Bare "cash sales"/"credit purchases" style shorthand — common exam
  // phrasing that names no "goods" at all — is still an ordinary goods
  // transaction, not an ambiguous one.
  // Broad enough to catch "purchased"/"bought"/"sold" as verbs too, not
  // just the bare "sales"/"purchases" nouns — "Purchased from Ram
  // ₹50,000..." has neither "goods" nor the noun form "purchases", but
  // is unambiguously a goods purchase.
  const isBareSaleOrPurchase = /\bpurchas\w*\b|\bbought\b|\bsold\b|\bsales?\b/.test(text) && !/purchases? return|sales? return/.test(text);
  const assetLabel = acFindLabel(text, AC_ASSET_WORDS);
  const expenseLabel = acFindLabel(text, AC_EXPENSE_WORDS);
  const incomeLabel = acFindLabel(text, AC_INCOME_WORDS);

  const amt = amounts.length ? amounts[0].value : null;
  const amt2 = amounts.length > 1 ? amounts[1].value : null;
  // A percentage of the total described as what was "paid"/"received" —
  // computed early since several of the flags below need it to decide
  // whether a split payment/receipt was expressed as a percentage
  // rather than (or in addition to) an absolute rupee figure.
  // Deliberately tight: only matches "paid 50%" / "received 40%" where
  // the percentage directly follows the verb — NOT the loose
  // nearest-percent search used elsewhere, because a sentence can
  // legitimately have an unrelated percentage (a GST rate, a trade
  // discount) sitting close to the word "paid" without being the
  // portion paid (e.g. "...GST 18%, paid ₹50,000 by bank..." must not
  // read "18%" as the paid portion just because "paid" follows nearby).
  const partialPortionMatch = /\b(?:paid|received)\s+(\d+(?:\.\d+)?)\s*%/i.exec(text);
  const partialPortionPct = partialPortionMatch ? parseFloat(partialPortionMatch[1]) : 0;
  // "...paid ₹50,000 by bank and the balance on credit" — the second
  // extracted amount is the portion actually paid now; the rest of the
  // total stays with the party as a credit balance, split across two
  // credit lines instead of dumping the whole amount onto one account.
  const remainderIsBillPayable = /\bpaid\b/.test(text) && /(balance|remaining|rest|difference)/.test(text) && /\b(accepted|drew|drawn)\b[\s\S]{0,20}\bbill\b|\bbill\b[\s\S]{0,20}\bfor\b[\s\S]{0,15}(balance|remaining|rest)/.test(text);
  const remainderIsBillReceivable = /received\b/.test(text) && /(balance|remaining|rest|difference)/.test(text) && /\b(accepted|drew|drawn)\b[\s\S]{0,20}\bbill\b|\bbill\b[\s\S]{0,20}\bfor\b[\s\S]{0,15}(balance|remaining|rest)/.test(text);
  const remainderIsDeferred = /\bpaid\b/.test(text) && /(balance|remaining|rest|difference)/.test(text) && /(pay|paid|settl\w*)[\s\S]{0,15}\blater\b|agreed to pay|to be paid later/.test(text);
  const remainderIsDeferredReceipt = /received\b/.test(text) && /(balance|remaining|rest|difference)/.test(text) && /(pay|paid|receiv\w*|settl\w*)[\s\S]{0,15}\blater\b|agreed to (pay|receive)|to be (paid|received) later/.test(text);
  const isSplitPayment = /\bpaid\b/.test(text) && /(balance|remaining|rest|difference)/.test(text) && (/credit/.test(text) || remainderIsBillPayable || remainderIsDeferred) && (amt2 !== null || (partialPortionPct > 0 && partialPortionPct < 100));
  const isSplitReceipt = /received\b/.test(text) && /(balance|remaining|rest|difference)/.test(text) && (/credit/.test(text) || remainderIsBillReceivable || remainderIsDeferredReceipt) && (amt2 !== null || (partialPortionPct > 0 && partialPortionPct < 100));
  const splitRemainderAccPurchase = remainderIsBillPayable ? "Bills Payable A/c" : (party ? party + " A/c" : "Creditors A/c");
  const splitRemainderAccSale = remainderIsBillReceivable ? "Bills Receivable A/c" : (party ? party + " A/c" : "Debtors A/c");
  // For a split payment/receipt, the sentence often legitimately contains
  // both "bank" (how the paid portion moved) AND "credit" (describing the
  // unpaid remainder) — the general `mode` variable above prioritises
  // "credit" in that case, so the paid portion's own cash/bank mode is
  // detected separately, scoped to just the "paid ... by ..." phrase.
  const splitPaidAcc = /paid\b[\s\S]{0,20}\b(bank|cheque|chq)\b/.test(text) ? "Bank A/c" : "Cash A/c";
  const splitReceivedAcc = /received\b[\s\S]{0,20}\b(bank|cheque|chq)\b/.test(text) ? "Bank A/c" : "Cash A/c";
  // "...12% trade discount. Paid 40% immediately and received 6% cash
  // discount on that portion." — a percentage of the (already
  // trade-discounted) net amount is paid now, with cash discount on
  // just that paid slice; the rest stays owed to the party. This is a
  // distinct pattern from isSplitPayment above, which uses an absolute
  // rupee figure and no cash discount on the partial.
  const isPartialPortionWithCashDisc = partialPortionPct > 0 && partialPortionPct < 100 && cashDiscPct > 0;
  const isTwoWaySplitPay = amt2 !== null && /\bpaid\b/.test(text) && /\bbank\b/.test(text) && /\bcash\b/.test(text) && !/full settlement|final settlement|discount/.test(text);

  /* ---------- General payment-split engine ----------------------
     Used by BOTH fixed-asset and goods purchases so the same
     transaction shape ("paid p% cash, q% bank/cheque, balance on
     credit", with or without trade/cash discount) resolves correctly
     for any asset, amount, percentage, or payment-method combination
     instead of only a fixed set of sample wordings.

     Percentages already claimed by trade discount / cash discount
     (matched by object identity, not value, so a coincidental equal
     value never causes a false exclusion) are excluded first, so a
     "10% trade discount" mentioned earlier in the sentence never gets
     misread as a cash/bank payment percentage just because the word
     "discount" sits inside its lookup window.
     ------------------------------------------------------------ */
  const tradeDiscObj = percents.find(p => ["trade discount", "trade disc"].some(k => p.window.includes(k))) || null;
  const cashDiscObj = percents.find(p => ["cash discount", "cash disc"].some(k => p.window.includes(k))) || null;
  // A payment percentage's mode word often sits well past the fixed
  // ±28/+12-char window used for GST/discount-rate lookups — "50%
  // immediately by cash" puts "cash" ~20 chars after the "%" sign. So
  // each percent here gets its own forward-scanning window instead,
  // bounded by wherever the NEXT percent in the sentence starts (so a
  // dual "40% by cheque, 30% by cash" never bleeds into each other's
  // clause), capped at 60 chars for a lone percent.
  function acForwardModeKeyword(p, keywords) {
    const i = percents.indexOf(p);
    const nextIdx = i >= 0 && i + 1 < percents.length ? percents[i + 1].index : text.length;
    const windowEnd = Math.min(nextIdx, p.index + 60, text.length);
    let fwd = text.slice(p.index, windowEnd).toLowerCase();
    // "the balance" starts a new clause describing the REMAINDER's mode
    // (handled separately via balanceMode below) — never part of what
    // this specific percent itself was paid in, so it must not leak a
    // false cash/bank match onto this percent (e.g. "50% by cash and
    // balance by cheque" must not also read this same 50% as a bank %).
    const balanceIdx = fwd.indexOf("balance");
    if (balanceIdx !== -1) fwd = fwd.slice(0, balanceIdx);
    return keywords.some(k => fwd.includes(k));
  }
  const splitCashPct = (percents.find(p => p !== tradeDiscObj && p !== cashDiscObj && !p.window.includes("gst") && acForwardModeKeyword(p, ["cash"])) || { value: 0 }).value;
  const splitBankPct = (percents.find(p => p !== tradeDiscObj && p !== cashDiscObj && !p.window.includes("gst") && acForwardModeKeyword(p, ["bank", "cheque", "chq"])) || { value: 0 }).value;
  // "Balance on credit" / "balance after 15 days" / "balance after one
  // month" (Rule 6) all mean the remainder is a creditor/debtor balance.
  // "Balance by cheque"/"balance by bank"/"balance in cash" instead mean
  // the *remainder* — not a further percentage — is settled immediately
  // through that specific mode, with no credit portion at all.
  const balanceModeMatch = /balance[\s\S]{0,25}?\b(on credit|after|by cheque|by chq|through bank|by bank|in cash|by cash|credit)\b/.exec(text);
  const balanceMode = balanceModeMatch
    ? (/cheque|chq|bank/.test(balanceModeMatch[1]) ? "bank" : /in cash|by cash/.test(balanceModeMatch[1]) ? "cash" : "credit")
    : null;
  // Returns null when no cash/bank payment percentage was stated at all,
  // so callers keep their existing single full-mode / full-credit
  // handling for those (unchanged) cases. Only engages once at least one
  // explicit cash%/bank% is present in the sentence.
  function acSplitPaymentPortions(total) {
    if (splitCashPct <= 0 && splitBankPct <= 0) return null;
    let cashAmt = acRound2(total * splitCashPct / 100);
    let bankAmt = acRound2(total * splitBankPct / 100);
    let creditAmt = 0;
    const explicitSum = splitCashPct + splitBankPct;
    if (explicitSum < 100) {
      const remainder = acRound2(total - cashAmt - bankAmt);
      if (balanceMode === "bank") bankAmt = acRound2(bankAmt + remainder);
      else if (balanceMode === "cash") cashAmt = acRound2(cashAmt + remainder);
      else creditAmt = remainder; // default: a stated remainder with no other mode named is a credit balance
    }
    return { cashAmt, bankAmt, creditAmt };
  }

  const lines = [];
  let narration = original;
  let tag = "unclassified";

  function bothSidesOk() {
    const dr = acRound2(lines.reduce((s, l) => s + (l.dr || 0), 0));
    const cr = acRound2(lines.reduce((s, l) => s + (l.cr || 0), 0));
    return Math.abs(dr - cr) < 0.01;
  }

  function gstSplitLines(baseAmount, forPurchase) {
    // "₹11,800 including GST @18%" — the stated figure already contains
    // GST, so it must be backed out to the taxable value first rather
    // than adding GST on top of it a second time.
    let workingBase = baseAmount;
    if (isGstInclusive) {
      const inclusiveRate = isIGST ? (igstPctExplicit || gstPct)
        : (cgstPctExplicit > 0 || sgstPctExplicit > 0) ? (cgstPctExplicit || sgstPctExplicit) + (sgstPctExplicit || cgstPctExplicit)
        : gstPct;
      if (inclusiveRate) workingBase = acRound2(baseAmount / (1 + inclusiveRate / 100));
    }
    if (isIGST) {
      const pct = igstPctExplicit || gstPct;
      if (!pct) return { total: baseAmount, gstLines: [] };
      const gstAmt = isGstInclusive ? acRound2(baseAmount - workingBase) : acRound2(workingBase * pct / 100);
      return { total: isGstInclusive ? baseAmount : acRound2(workingBase + gstAmt), gstLines: [{ account: forPurchase ? "Input IGST A/c" : "Output IGST A/c", amount: gstAmt }], taxableValue: workingBase };
    }
    if (cgstPctExplicit > 0 || sgstPctExplicit > 0 || (isGstInclusive && gstPct)) {
      // CGST and SGST were each stated as their own explicit rate (e.g.
      // "CGST 9% and SGST 9%") — apply each directly. This must never be
      // halved again on top of an already-per-side rate, which was the
      // earlier bug: a bare combined "GST 18%" gets split in half below,
      // but two explicitly-separate 9% rates are not a combined rate.
      const cPct = cgstPctExplicit || acRound2(gstPct / 2);
      const sPct = sgstPctExplicit || acRound2(gstPct / 2);
      const cAmt = acRound2(workingBase * cPct / 100);
      const sAmt = acRound2(workingBase * sPct / 100);
      return { total: isGstInclusive ? baseAmount : acRound2(workingBase + cAmt + sAmt), gstLines: [
        { account: forPurchase ? "Input CGST A/c" : "Output CGST A/c", amount: cAmt },
        { account: forPurchase ? "Input SGST A/c" : "Output SGST A/c", amount: sAmt }
      ], taxableValue: workingBase };
    }
    if (!gstPct) return { total: baseAmount, gstLines: [] };
    const gstAmt = acRound2(workingBase * gstPct / 100);
    const half = acRound2(gstAmt / 2);
    return { total: acRound2(workingBase + gstAmt), gstLines: [
      { account: forPurchase ? "Input CGST A/c" : "Output CGST A/c", amount: half },
      { account: forPurchase ? "Input SGST A/c" : "Output SGST A/c", amount: acRound2(gstAmt - half) }
    ], taxableValue: workingBase };
  }

  const cashOrBank = (mode === "bank" || mode === "cheque") ? "Bank A/c" : "Cash A/c";
  const paidToTargetHasTo = /paid\b[\s\S]{0,25}\bto\b/.test(text) || (/issued\b[\s\S]{0,15}\bcheque\b[\s\S]{0,15}\bto\b/.test(text));
  const paidPartyDirect = party && new RegExp("\\bpaid\\b[\\s\\S]{0,15}\\b" + party.toLowerCase().split(" ")[0] + "\\b").test(text);
  // "Anas settled his account by cheque" — Anas is the grammatical
  // subject of "settled"/"paid", meaning Anas is the one paying the
  // business (a debtor receipt), the mirror image of "Paid to Ashok..."
  // where the business is doing the paying (a creditor payment). This is
  // what lets the two be told apart without needing "received...from".
  const partySettledSelf = party && new RegExp("^\\s*" + party.split(" ")[0] + "\\s+(settled|paid|has paid|has settled)\\b", "i").test(original);

  // ---- RULE MATCHING (ordered — most specific first) ----

  if (flags.isCapitalIntro && amt !== null) {
    tag = "capital";
    // Try to match every known asset-type word actually present in the
    // sentence to its own nearest amount — not just the first two
    // numbers found — so "cash X, stock Y, and machinery Z" keeps all
    // three straight instead of losing one and mislabeling another.
    const CAPITAL_ASSET_SYNONYMS = [
      ["cash", "Cash"], ["bank", "Bank"], ["stock", "Stock"], ["goods", "Goods (Stock)"],
      ["furniture", "Furniture"], ["machinery", "Machinery"], ["plant", "Plant"], ["building", "Building"],
      ["land", "Land"], ["vehicle", "Vehicle"], ["computer", "Computer"], ["equipment", "Equipment"],
      ["investment", "Investment"], ["goodwill", "Goodwill"],
      // current assets a proprietor can equally bring in — previously DROPPED, which made
      // "Started business with cash ₹40,000 and debtors ₹10,000" lose the debtors entirely
      ["bills receivable", "Bills Receivable"], ["debtors", "Debtors"], ["sundry debtors", "Debtors"]
    ];
    // not depreciable fixed assets — never entered into the depreciation book
    const CAPITAL_CURRENT = new Set(["Cash", "Bank", "Debtors", "Bills Receivable"]);
    const CAPITAL_LIABS = [["bills payable", "Bills Payable"], ["sundry creditors", "Creditors"], ["creditors", "Creditors"]];
    const seenLabels = new Set(), seenAmounts = new Set();
    const multiItems = [];
    CAPITAL_ASSET_SYNONYMS.forEach(([kw, label]) => {
      if (!new RegExp("\\b" + kw + "\\b").test(text)) return;
      const near = acAmountNear(text, amounts, [kw]);
      if (near === null || seenLabels.has(label) || seenAmounts.has(near)) return;
      seenLabels.add(label); seenAmounts.add(near);
      multiItems.push({ label, amount: near });
    });
    let capitalTotal = 0;
    if (multiItems.length >= 2) {
      multiItems.forEach(it => {
        lines.push({ account: it.label + " A/c", dr: it.amount });
        capitalTotal += it.amount;
        if (!CAPITAL_CURRENT.has(it.label)) ctx.assetBook[it.label] = (ctx.assetBook[it.label] || 0) + it.amount;
      });
    } else if (assetLabel && !/\bcash\b|\bbank\b/.test(text)) {
      lines.push({ account: assetLabel + " A/c", dr: amt });
      capitalTotal += amt;
      if (!CAPITAL_CURRENT.has(assetLabel)) ctx.assetBook[assetLabel] = (ctx.assetBook[assetLabel] || 0) + amt;
    } else {
      lines.push({ account: cashOrBank, dr: amt });
      capitalTotal += amt;
      if (amt2 !== null && isGoods) { lines.push({ account: "Goods (Stock) A/c", dr: amt2 }); capitalTotal += amt2; }
      else if (amt2 !== null && assetLabel) { lines.push({ account: assetLabel + " A/c", dr: amt2 }); capitalTotal += amt2; if (!CAPITAL_CURRENT.has(assetLabel)) ctx.assetBook[assetLabel] = (ctx.assetBook[assetLabel] || 0) + amt2; }
    }
    // liabilities the proprietor also brought with the business reduce the capital employed
    // ("Started business with cash ₹50,000 and creditors ₹8,000" → capital ₹42,000)
    let liabTotal = 0;
    CAPITAL_LIABS.forEach(([kw, label]) => {
      if (!new RegExp("\\b" + kw + "\\b").test(text)) return;
      const near = acAmountNear(text, amounts, [kw]);
      if (near === null || seenAmounts.has(near)) return;
      seenAmounts.add(near); lines.push({ account: label + " A/c", cr: near }); liabTotal += near;
    });
    lines.push({ account: "Capital A/c", cr: acRound2(capitalTotal - liabTotal) });
  }

  else if (flags.isGift && amt !== null) {
    tag = "capital";
    if (assetLabel) lines.push({ account: assetLabel + " A/c", dr: amt });
    else lines.push({ account: "Purchases A/c", dr: amt });
    lines.push({ account: "Capital A/c", cr: amt });
  }

  else if (flags.isChequeEndorsed && amt !== null) {
    tag = "debtor";
    const m = original.match(/from\s+([A-Z][a-zA-Z]*)\s+to\s+([A-Z][a-zA-Z]*)/);
    const fromParty = m ? m[1] : "Debtors";
    const toParty = m ? m[2] : "Creditors";
    lines.push({ account: toParty + " A/c", dr: amt });
    lines.push({ account: fromParty + " A/c", cr: amt });
  }

  else if (flags.isChequeSentForCollection && amt !== null) {
    tag = "debtor";
    const acctName = party || "Debtors";
    lines.push({ account: "Cheques Sent for Collection A/c", dr: amt });
    lines.push({ account: acctName + " A/c", cr: amt });
  }

  else if (flags.isChequeCollected && amt !== null) {
    tag = "contra";
    lines.push({ account: "Bank A/c", dr: amt });
    lines.push({ account: "Cheques Sent for Collection A/c", cr: amt });
  }

  else if (flags.isDebtorDepositedBank && amt !== null) {
    tag = "debtor";
    const acctName = party || "Debtors";
    lines.push({ account: "Bank A/c", dr: amt });
    lines.push({ account: acctName + " A/c", cr: amt });
  }

  else if (flags.isRebateByCreditor && amt !== null) {
    tag = "creditor";
    const acctName = party || "Creditors";
    lines.push({ account: acctName + " A/c", dr: amt });
    lines.push({ account: "Discount Received A/c", cr: amt });
  }

  else if (flags.isRebateToCustomer && amt !== null) {
    tag = "debtor";
    const acctName = party || "Debtors";
    lines.push({ account: "Discount Allowed A/c", dr: amt });
    lines.push({ account: acctName + " A/c", cr: amt });
  }

  else if (flags.isLoanRepaymentReceived && amt !== null) {
    tag = "loan";
    const borrower = party ? party : "";
    lines.push({ account: cashOrBank, dr: amt });
    lines.push({ account: borrower ? "Loan to " + borrower + " A/c" : "Loan A/c", cr: amt });
  }

  else if (flags.isProprietorPersonalItem && amt !== null) {
    tag = "drawings";
    lines.push({ account: "Drawings A/c", dr: amt });
    lines.push({ account: cashOrBank, cr: amt });
  }

  else if (flags.isExpensePaidPersonally && amt !== null) {
    tag = "expense";
    lines.push({ account: (expenseLabel || "General Expenses") + " A/c", dr: amt });
    lines.push({ account: "Capital A/c", cr: amt });
  }

  else if (flags.isIncomeTaxFromPersonal) {
    return { ok: false, index: idx, text: original, reason: "Income tax paid by the proprietor from personal funds does not affect the business books — no journal entry required." };
  }

  else if (flags.isIncomeTaxFromBusiness && amt !== null) {
    tag = "drawings";
    lines.push({ account: "Drawings A/c", dr: amt });
    lines.push({ account: cashOrBank, cr: amt });
  }

  else if (flags.isAdditionalCapital && amt !== null) {
    tag = "capital";
    lines.push({ account: cashOrBank, dr: amt });
    lines.push({ account: "Capital A/c", cr: amt });
  }

  else if (flags.isOpenedBank && amt !== null) {
    tag = "contra";
    lines.push({ account: "Bank A/c", dr: amt });
    lines.push({ account: "Cash A/c", cr: amt });
  }

  else if (flags.isContraDeposit && amt !== null) {
    tag = "contra";
    lines.push({ account: "Bank A/c", dr: amt });
    lines.push({ account: "Cash A/c", cr: amt });
  }

  else if (flags.isContraWithdrawBank && amt !== null) {
    tag = "contra";
    lines.push({ account: "Cash A/c", dr: amt });
    lines.push({ account: "Bank A/c", cr: amt });
  }

  else if (flags.isLoanRepaid && amt !== null) {
    tag = "loan";
    lines.push({ account: party && /loan from/.test(text) ? "Loan from " + party + " A/c" : acPickLoanAccount(text, ctx), dr: amt });
    lines.push({ account: cashOrBank, cr: amt });
  }

  else if (flags.isDrawingsCash && amt !== null) {
    tag = "drawings";
    lines.push({ account: "Drawings A/c", dr: amt });
    lines.push({ account: cashOrBank, cr: amt });
  }

  else if (flags.isDrawingsGoods && amt !== null) {
    tag = "drawings";
    lines.push({ account: "Drawings A/c", dr: amt });
    lines.push({ account: "Purchases A/c", cr: amt });
  }

  else if (flags.isInterestOnCapital && amt !== null) {
    tag = "adjustment";
    lines.push({ account: "Interest on Capital A/c", dr: amt });
    lines.push({ account: "Capital A/c", cr: amt });
  }

  else if (flags.isInterestOnDrawings && amt !== null) {
    tag = "adjustment";
    lines.push({ account: "Capital A/c", dr: amt });
    lines.push({ account: "Interest on Drawings A/c", cr: amt });
  }

  else if (flags.isBankInterestAllowed && amt !== null) {
    tag = "income";
    lines.push({ account: "Bank A/c", dr: amt });
    lines.push({ account: "Interest Received A/c", cr: amt });
  }

  else if (flags.isBankInterestAndCharges && amounts.length > 1) {
    tag = "income";
    const interestAmt = acAmountNear(text, amounts, ["interest"]);
    const chargesAmt = acAmountNear(text, amounts, ["charge"]);
    if (interestAmt !== null && chargesAmt !== null && interestAmt !== chargesAmt) {
      const net = acRound2(interestAmt - chargesAmt);
      if (net > 0) lines.push({ account: "Bank A/c", dr: net });
      else if (net < 0) lines.push({ account: "Bank A/c", cr: -net });
      lines.push({ account: "Bank Charges A/c", dr: chargesAmt });
      lines.push({ account: "Interest Received A/c", cr: interestAmt });
      narration += ` (bank credited interest ₹${acFmt(interestAmt)} and separately deducted charges ₹${acFmt(chargesAmt)} — both bank-statement components are recorded, not just the net movement)`;
    } else {
      return { ok: false, index: idx, text: original, reason: "Bank credited interest and deducted charges, but couldn't confidently tell the two amounts apart — please state each amount clearly (e.g. 'interest ₹X ... charges ₹Y')." };
    }
  }

  else if (flags.isPartialOutstanding && amt !== null && amt2 !== null && expenseLabel) {
    tag = "adjustment";
    // "Salary ₹20,000; ₹3,000 is still outstanding" → the whole sentence describes ONE period,
    // so the larger figure is the total expense and the smaller the unpaid remainder.
    const total = Math.max(amt, amt2), unpaid = Math.min(amt, amt2);
    const paidNow = acRound2(total - unpaid);
    lines.push({ account: expenseLabel + " A/c", dr: total });
    if (paidNow > 0) lines.push({ account: cashOrBank, cr: paidNow });
    lines.push({ account: "Outstanding " + expenseLabel + " A/c", cr: unpaid });
    narration += ` (total ${expenseLabel.toLowerCase()} ₹${acFmt(total)} = ₹${acFmt(paidNow)} paid now + ₹${acFmt(unpaid)} still outstanding)`;
  }

  // "Paid salary ₹20,000, ₹3,000 outstanding" — the FIRST figure is what left the business,
  // the second is the unpaid remainder on top of it, so the expense is the sum of both.
  else if (flags.isSettlingOutstanding && expenseLabel && !acAmountNear(text, amounts, ["outstanding"]) && amt !== null && amt2 !== null && amt2 < amt && !/settle/i.test(text)) {
    tag = "adjustment";
    const total = acRound2(amt + amt2);
    lines.push({ account: expenseLabel + " A/c", dr: total });
    lines.push({ account: cashOrBank, cr: amt });
    lines.push({ account: "Outstanding " + expenseLabel + " A/c", cr: amt2 });
    narration += ` (total ${expenseLabel.toLowerCase()} ₹${acFmt(total)} = ₹${acFmt(amt)} paid now + ₹${acFmt(amt2)} still outstanding)`;
  }

  else if (flags.isSettlingOutstanding && amt !== null && expenseLabel) {
    tag = "adjustment";
    lines.push({ account: "Outstanding " + expenseLabel + " A/c", dr: amt });
    lines.push({ account: cashOrBank, cr: amt });
  }

  else if (flags.isInstallationCapitalize && amt !== null && assetLabel) {
    tag = "asset";
    lines.push({ account: assetLabel + " A/c", dr: amt });
    lines.push({ account: cashOrBank, cr: amt });
    ctx.assetBook[assetLabel] = (ctx.assetBook[assetLabel] || 0) + amt;
  }

  else if (flags.isCharity && amt !== null) {
    tag = "goods";
    lines.push({ account: "Charity/Donation A/c", dr: amt });
    lines.push({ account: "Purchases A/c", cr: amt });
  }

  else if (flags.isFreeSamples && amt !== null) {
    tag = "goods";
    lines.push({ account: "Free Samples A/c", dr: amt });
    lines.push({ account: "Purchases A/c", cr: amt });
  }

  else if (flags.isStaffWelfare && amt !== null) {
    tag = "goods";
    lines.push({ account: "Staff Welfare Expenses A/c", dr: amt });
    lines.push({ account: "Purchases A/c", cr: amt });
  }

  else if (flags.isOfficeUse && amt !== null) {
    tag = "goods";
    lines.push({ account: "Office Expenses A/c", dr: amt });
    lines.push({ account: "Purchases A/c", cr: amt });
  }

  else if (flags.isClaimAdmitted && amt !== null) {
    tag = "loss";
    lines.push({ account: "Insurance Claim A/c", dr: amt });
    lines.push({ account: "Loss by Fire/Theft A/c", cr: amt });
  }

  else if (flags.isClaimReceived && amt !== null) {
    tag = "loss";
    lines.push({ account: cashOrBank, dr: amt });
    lines.push({ account: "Insurance Claim A/c", cr: amt });
  }

  else if (flags.isPartialClaim && amt !== null && amt2 !== null) {
    tag = "loss";
    const claimAmt = Math.min(amt, amt2), totalLoss = Math.max(amt, amt2);
    const uninsuredLoss = acRound2(totalLoss - claimAmt);
    lines.push({ account: cashOrBank, dr: claimAmt });
    if (uninsuredLoss > 0) lines.push({ account: "Loss by Fire/Theft A/c", dr: uninsuredLoss });
    lines.push({ account: "Purchases A/c", cr: totalLoss });
  }

  else if (flags.isFireTheft && amt !== null) {
    tag = "loss";
    if (claimPct > 0) {
      const claimAmt = acRound2(amt * claimPct / 100);
      const lossAmt = acRound2(amt - claimAmt);
      lines.push({ account: "Insurance Claim A/c", dr: claimAmt });
      lines.push({ account: "Loss by Fire/Theft A/c", dr: lossAmt });
      lines.push({ account: "Purchases A/c", cr: amt });
    } else if (/no claim|not admitted|rejected|no insurance/.test(text)) {
      lines.push({ account: "Loss by Fire/Theft A/c", dr: amt });
      lines.push({ account: "Purchases A/c", cr: amt });
    } else if (/insur/.test(text)) {
      return { ok: false, index: idx, text: original, reason: "Goods lost by fire/theft — insurance is mentioned but the % of claim admitted isn't stated." };
    } else {
      // no insurance mentioned at all -> straightforward uninsured loss
      lines.push({ account: "Loss by Fire/Theft A/c", dr: amt });
      lines.push({ account: "Purchases A/c", cr: amt });
    }
  }

  else if (flags.isGoodsSentApproval && amt !== null) {
    tag = "goods";
    lines.push({ account: "Goods sent on Approval A/c", dr: amt });
    lines.push({ account: "Purchases A/c", cr: amt });
  }

  else if (flags.isGoodsApprovalAccepted && amt !== null) {
    tag = "goods";
    const acctName = party || "Debtors";
    lines.push({ account: acctName + " A/c", dr: amt });
    lines.push({ account: "Sales A/c", cr: amt });
    lines.push({ account: "Purchases A/c", dr: amt });
    lines.push({ account: "Goods sent on Approval A/c", cr: amt });
  }

  else if (flags.isGoodsApprovalReturned && amt !== null) {
    tag = "goods";
    lines.push({ account: "Purchases A/c", dr: amt });
    lines.push({ account: "Goods sent on Approval A/c", cr: amt });
  }

  else if (flags.isAdvancePaidSupplier && amt !== null) {
    tag = "creditor";
    lines.push({ account: "Advance to Supplier A/c", dr: amt });
    lines.push({ account: cashOrBank, cr: amt });
  }

  else if (flags.isAdvanceReceivedCustomer && amt !== null) {
    tag = "debtor";
    lines.push({ account: cashOrBank, dr: amt });
    lines.push({ account: "Advance from Customer A/c", cr: amt });
  }

  else if (flags.isGoodsAgainstAdvancePaid && amt !== null) {
    tag = "goods";
    lines.push({ account: "Purchases A/c", dr: amt });
    lines.push({ account: "Advance to Supplier A/c", cr: amt });
  }

  else if (flags.isGoodsAgainstAdvanceReceived && amt !== null) {
    tag = "goods";
    lines.push({ account: "Advance from Customer A/c", dr: amt });
    lines.push({ account: "Sales A/c", cr: amt });
  }

  else if (!amt && cashDiscPct > 0 && isGoods) {
    return { ok: false, index: idx, text: original, reason: "Cash discount given only as a % — state the base amount so the discount can be computed." };
  }

  else if (flags.isPurchaseReturn && amt !== null) {
    tag = "goods";
    const { total, gstLines, taxableValue } = gstSplitLines(amt, true);
    const retNet = taxableValue !== undefined ? taxableValue : amt;   // GST-inclusive → back-calculate the taxable value
    const partyAcc = party ? party + " A/c" : "Creditors A/c";
    lines.push({ account: partyAcc, dr: total });
    lines.push({ account: "Purchase Returns A/c", cr: retNet });
    gstLines.forEach(g => lines.push({ account: g.account, cr: g.amount }));
  }

  else if (flags.isSalesReturn && amt !== null) {
    tag = "goods";
    const { total, gstLines, taxableValue } = gstSplitLines(amt, false);
    const retNet = taxableValue !== undefined ? taxableValue : amt;   // GST-inclusive → back-calculate the taxable value
    const partyAcc = party ? party + " A/c" : "Debtors A/c";
    lines.push({ account: "Sales Returns A/c", dr: retNet });
    gstLines.forEach(g => lines.push({ account: g.account, dr: g.amount }));
    lines.push({ account: partyAcc, cr: total });
  }

  else if (flags.isBillDiscounted && amt !== null) {
    tag = "debtor";
    const acctName = party || "Debtors";
    lines.push({ account: "Bank A/c", dr: amt });
    lines.push({ account: acctName + " A/c", cr: amt });
  }

  else if (flags.isDiscountedBillDishonoured && amt !== null) {
    tag = "debtor";
    const acctName = party || "Debtors";
    lines.push({ account: acctName + " A/c", dr: amt });
    lines.push({ account: "Bank A/c", cr: amt });
  }

  else if (flags.isBillReceivableDishonoured && amt !== null) {
    tag = "debtor";
    const acctName = party || "Debtors";
    lines.push({ account: acctName + " A/c", dr: amt });
    lines.push({ account: "Bills Receivable A/c", cr: amt });
  }

  else if (flags.isBillReceivableReceived && amt !== null) {
    tag = "debtor";
    const acctName = party || "Debtors";
    lines.push({ account: "Bills Receivable A/c", dr: amt });
    lines.push({ account: acctName + " A/c", cr: amt });
  }

  else if (flags.isBillPayableAccepted && amt !== null) {
    tag = "creditor";
    const acctName = party || "Creditors";
    lines.push({ account: acctName + " A/c", dr: amt });
    lines.push({ account: "Bills Payable A/c", cr: amt });
  }

  else if (flags.isBillPayablePaid && amt !== null) {
    tag = "creditor";
    lines.push({ account: "Bills Payable A/c", dr: amt });
    lines.push({ account: cashOrBank, cr: amt });
  }

  else if (flags.isDishonoured && amt !== null) {
    tag = "debtor";
    const acctName = party || "Debtors";
    lines.push({ account: acctName + " A/c", dr: amt });
    lines.push({ account: "Bank A/c", cr: amt });
  }

  else if (flags.isChequeReceived && amt !== null) {
    tag = "debtor";
    const acctName = party || "Debtors";
    lines.push({ account: "Cheques in Hand A/c", dr: amt });
    lines.push({ account: acctName + " A/c", cr: amt });
    ctx.lastChequeAmount = amt;
  }

  else if (flags.isChequeDeposited) {
    const depositAmt = amt !== null ? amt : ctx.lastChequeAmount;
    if (depositAmt == null) {
      return { ok: false, index: idx, text: original, reason: "No amount given, and there's no earlier 'received a cheque' transaction to take the amount from." };
    }
    tag = "contra";
    lines.push({ account: "Bank A/c", dr: depositAmt });
    lines.push({ account: "Cheques in Hand A/c", cr: depositAmt });
  }

  else if (flags.isInsolvent && amt !== null) {
    tag = "debtor";
    const acctName = party || "Debtors";
    const a2 = amt2 !== null ? amt2 : 0;
    const recovered = Math.min(amt, a2 || amt);
    const owed = Math.max(amt, a2 || amt);
    const badPortion = acRound2(owed - recovered);
    lines.push({ account: cashOrBank, dr: recovered });
    if (badPortion > 0) lines.push({ account: "Bad Debts A/c", dr: badPortion });
    lines.push({ account: acctName + " A/c", cr: owed });
  }

  else if (flags.isBadDebtRecovered && amt !== null) {
    tag = "debtor";
    lines.push({ account: cashOrBank, dr: amt });
    lines.push({ account: "Bad Debts Recovered A/c", cr: amt });
  }

  else if (flags.isGstLiabilityPayment && amt !== null) {
    tag = "adjustment";
    lines.push({ account: "GST Payable A/c", dr: amt });
    lines.push({ account: cashOrBank, cr: amt });
  }

  else if (flags.isGstSetOff) {
    tag = "adjustment";
    const statedInput = acAmountNear(text, amounts, ["input gst", "input"]);
    const statedOutput = acAmountNear(text, amounts, ["output gst", "output"]);
    if (statedInput !== null && statedOutput !== null && statedInput !== statedOutput) {
      // The question gives Input/Output GST directly (not split by head)
      // — use those stated figures rather than whatever's been tracked
      // from earlier transactions, since an explicit figure in the
      // question always takes priority over an inferred one.
      const setoff = Math.min(statedInput, statedOutput);
      lines.push({ account: "Output GST A/c", dr: setoff });
      lines.push({ account: "Input GST A/c", cr: setoff });
      const remainder = acRound2(statedOutput - statedInput);
      if (remainder > 0) narration += ` (Input GST ₹${acFmt(statedInput)} fully set off; GST payable ₹${acFmt(remainder)} remains)`;
      else if (remainder < 0) narration += ` (Output GST ₹${acFmt(statedOutput)} fully set off; Input GST ₹${acFmt(-remainder)} carried forward)`;
      else narration += " (Input and Output GST fully set off against each other)";
    } else {
      const g = ctx.gstBalances || { inputCGST: 0, inputSGST: 0, inputIGST: 0, outputCGST: 0, outputSGST: 0, outputIGST: 0 };
      const setOffLines = [];
      ["CGST", "SGST", "IGST"].forEach(head => {
        const inp = g["input" + head] || 0, out = g["output" + head] || 0;
        const setoff = Math.min(inp, out);
        if (setoff > 0) {
          setOffLines.push({ account: "Output " + head + " A/c", dr: setoff });
          setOffLines.push({ account: "Input " + head + " A/c", cr: setoff });
        }
      });
      if (!setOffLines.length) {
        return { ok: false, index: idx, text: original, reason: "GST set-off — no Input/Output GST balances have been recorded yet from earlier transactions (or stated directly in this question) to set off against each other." };
      }
      lines.push(...setOffLines);
      narration += " (GST set-off applied within each tax head — CGST against CGST, SGST against SGST, IGST against IGST; assumes no cross-head utilization, since that depends on rules the question would need to state)";
    }
  }

  else if (flags.isBankDirectCredit && amt !== null) {
    tag = "income";
    // "Interest received" is the sensible default when the sentence
    // doesn't name a specific income type — incomeLabel picks the exact
    // one (interest/commission/rent/dividend) when it's stated.
    const acc = incomeLabel || "Interest Received";
    lines.push({ account: "Bank A/c", dr: amt });
    lines.push({ account: acc + (acc.endsWith("A/c") ? "" : " A/c"), cr: amt });
  }

  else if (flags.isBankDirectDebit && amt !== null) {
    tag = "expense";
    const acc = expenseLabel || "Bank Charges";
    lines.push({ account: acc + (acc.endsWith("A/c") ? "" : " A/c"), dr: amt });
    lines.push({ account: "Bank A/c", cr: amt });
  }

  else if (flags.isManagersCommission && amt !== null) {
    tag = "adjustment";
    const rate = acPercentFor(percents, ["commission", "manager"]);
    if (!rate) {
      return { ok: false, index: idx, text: original, reason: "Manager's commission — state the commission rate (%) as well as the net profit figure." };
    }
    const before = /before charging|before commission/.test(text);
    const after = /after charging|after commission/.test(text);
    if (!before && !after) {
      return { ok: false, index: idx, text: original, reason: "Manager's commission — please state whether it's calculated before or after charging such commission; the formula differs (before: Profit × Rate / 100, after: Profit × Rate / (100 + Rate))." };
    }
    const commission = before ? acRound2(amt * rate / 100) : acRound2(amt * rate / (100 + rate));
    narration += ` (${before ? "before" : "after"} charging commission: ₹${acFmt(amt)} × ${rate}${before ? "" : " / (100 + " + rate + ")"}% = ₹${acFmt(commission)})`;
    lines.push({ account: "Manager's Commission A/c", dr: commission });
    lines.push({ account: "Outstanding Manager's Commission A/c", cr: commission });
  }

  else if (flags.isBadDebt && /provision/.test(text) && !/discount/.test(text) && percents.length > 0 && amt !== null) {
    // A compound adjustment stating debtors, a bad-debts write-off, AND
    // a provision requirement together — the provision must be
    // calculated on debtors *after* deducting the bad debts just
    // written off, never on the raw debtors total.
    tag = "adjustment";
    const partyAcc = party ? party + " A/c" : "Debtors A/c";
    const debtorsFig = acAmountNear(text, amounts, ["debtors", "sundry debtors"]);
    const badDebtFig = acAmountNear(text, amounts, ["bad debts", "bad debt"]);
    const provPct = acPercentFor(percents, ["provision"]);
    if (debtorsFig === null || badDebtFig === null || !provPct) {
      return { ok: false, index: idx, text: original, reason: "Bad debts + provision — please state the debtors total, the bad debts amount, and the provision percentage so the adjusted provision can be calculated." };
    }
    const netDebtors = acRound2(debtorsFig - badDebtFig);
    const provision = acRound2(netDebtors * provPct / 100);
    lines.push({ account: "Bad Debts A/c", dr: badDebtFig });
    lines.push({ account: partyAcc, cr: badDebtFig });
    lines.push({ account: "Profit & Loss A/c", dr: provision });
    lines.push({ account: "Provision for Doubtful Debts A/c", cr: provision });
    narration += ` (debtors ₹${acFmt(debtorsFig)} − bad debts ₹${acFmt(badDebtFig)} = ₹${acFmt(netDebtors)}; provision at ${provPct}% = ₹${acFmt(provision)})`;
  }

  else if (flags.isBadDebt && amt !== null) {
    tag = "debtor";
    const partyAcc = party ? party + " A/c" : "Debtors A/c";
    // When the sentence also states a separate debtors/receivable total
    // (e.g. "Debtors ₹1,00,000. Bad debts ₹5,000 written off."), `amt`
    // being the *first* number in the sentence would grab the debtors
    // total rather than the actual bad-debts figure — so look for the
    // figure specifically tied to "bad debt(s)" first.
    const badDebtFig = acAmountNear(text, amounts, ["bad debts", "bad debt"]);
    const writeOff = badDebtFig !== null ? badDebtFig : amt;
    lines.push({ account: "Bad Debts A/c", dr: writeOff });
    lines.push({ account: partyAcc, cr: writeOff });
  }

  else if (flags.isProvisionDD && amt !== null) {
    tag = "adjustment";
    const oldProv = acAmountNear(text, amounts, ["existing provision", "old provision", "previous provision", "existing", "old", "previous"]);
    const newProv = acAmountNear(text, amounts, ["new provision", "required provision", "to be maintained", "provide for", "new", "required"]);
    if (oldProv !== null && newProv !== null && oldProv !== newProv) {
      // Only the *change* in provision is charged/released — never the
      // full new figure on top of an existing one.
      const diff = acRound2(newProv - oldProv);
      if (diff > 0) {
        lines.push({ account: "Profit & Loss A/c", dr: diff });
        lines.push({ account: "Provision for Doubtful Debts A/c", cr: diff });
      } else {
        lines.push({ account: "Provision for Doubtful Debts A/c", dr: -diff });
        lines.push({ account: "Profit & Loss A/c", cr: -diff });
      }
      narration += ` (existing provision ₹${acFmt(oldProv)}, new provision required ₹${acFmt(newProv)}; ${diff > 0 ? "increase" : "decrease"} of ₹${acFmt(Math.abs(diff))} adjusted)`;
    } else {
      lines.push({ account: "Profit & Loss A/c", dr: amt });
      lines.push({ account: "Provision for Doubtful Debts A/c", cr: amt });
    }
  }

  else if (flags.isProvisionDiscountCreditors && amt !== null) {
    tag = "adjustment";
    // The mirror image of Provision for Discount on Debtors: this is an
    // anticipated gain (a discount the business itself expects to
    // receive from creditors), so it's credited to Profit & Loss, not
    // debited like the debtor-side provision.
    lines.push({ account: "Provision for Discount on Creditors A/c", dr: amt });
    lines.push({ account: "Profit & Loss A/c", cr: amt });
  }

  else if (flags.isProvisionDiscount && amt !== null) {
    tag = "adjustment";
    lines.push({ account: "Profit & Loss A/c", dr: amt });
    lines.push({ account: "Provision for Discount on Debtors A/c", cr: amt });
  }

  else if (flags.isDepreciation && (amt !== null || (depPct && assetLabel))) {
    tag = "adjustment";
    const asset = assetLabel || "Asset";
    let depAmt = null;
    if (depPct && amt !== null) {
      // A rate was given alongside a figure — that figure is always the
      // asset's cost/book value the rate applies to, never the
      // depreciation amount itself. This is the single most dangerous
      // mistake this branch can make (treating ₹2,00,000 cost at 10% as
      // ₹2,00,000 depreciation), so it's checked first.
      depAmt = acRound2(amt * depPct / 100);
      narration += ` (₹${acFmt(amt)} × ${depPct}% = ₹${acFmt(depAmt)})`;
    } else if (depPct && assetLabel && ctx.assetBook[assetLabel] !== undefined && ctx.assetBook[assetLabel] > 0) {
      // No figure in this sentence at all — fall back to this asset's
      // tracked book value from an earlier purchase/depreciation entry.
      const base = ctx.assetBook[assetLabel];
      depAmt = acRound2(base * depPct / 100);
      narration += ` (₹${acFmt(base)} × ${depPct}% = ₹${acFmt(depAmt)}, based on the tracked book value)`;
    } else if (amt !== null) {
      // A flat rupee depreciation figure was given directly, with no rate.
      depAmt = amt;
    }
    if (depAmt === null) return { ok: false, index: idx, text: original, reason: "Depreciation given only as a % — state the asset's book value/cost so the amount can be computed." };
    lines.push({ account: "Depreciation A/c", dr: depAmt });
    lines.push({ account: asset + " A/c", cr: depAmt });
    if (assetLabel) ctx.assetBook[assetLabel] = (ctx.assetBook[assetLabel] || 0) - depAmt;
  }

  else if (flags.isPrepaid && amt !== null && expenseLabel) {
    tag = "adjustment";
    lines.push({ account: "Prepaid " + expenseLabel + " A/c", dr: amt });
    lines.push({ account: cashOrBank, cr: amt });
  }

  else if (flags.isAccruedIncome && amt !== null) {
    tag = "adjustment";
    const base = incomeLabel ? incomeLabel.replace(/ Received$/, "") : (/income/.test(text) ? "Income" : null);
    if (!base) return { ok: false, index: idx, text: original, reason: "Accrued income — couldn't tell which income this is (commission/interest/rent/etc.)." };
    lines.push({ account: "Accrued " + base + " A/c", dr: amt });
    lines.push({ account: base + " Received A/c", cr: amt });
  }

  else if (flags.isIncomeAdvance && amt !== null) {
    tag = "adjustment";
    const base = incomeLabel ? incomeLabel.replace(/ Received$/, "") : (/income/.test(text) ? "Income" : null);
    if (!base) return { ok: false, index: idx, text: original, reason: "Income received in advance — couldn't tell which income this is." };
    lines.push({ account: cashOrBank, dr: amt });
    lines.push({ account: base + " Received in Advance A/c", cr: amt });
  }

  else if (flags.isOutstanding && !flags.isPartialOutstanding && amt !== null && expenseLabel) {
    tag = "adjustment";
    // "Paid salary ₹20,000, ₹3,000 outstanding" — the FIRST figure is what left the business,
    // the second is the unpaid remainder on top of it, so the expense is the sum of both.
    if (amt2 !== null && amt2 < amt && !/settle/i.test(text)) {
      const total = acRound2(amt + amt2);
      lines.push({ account: expenseLabel + " A/c", dr: total });
      lines.push({ account: cashOrBank, cr: amt });
      lines.push({ account: "Outstanding " + expenseLabel + " A/c", cr: amt2 });
      narration += ` (total ${expenseLabel.toLowerCase()} ₹${acFmt(total)} = ₹${acFmt(amt)} paid now + ₹${acFmt(amt2)} still outstanding)`;
    } else {
      lines.push({ account: expenseLabel + " A/c", dr: amt });
      lines.push({ account: "Outstanding " + expenseLabel + " A/c", cr: amt });
    }
  }

  else if (flags.isLoanTaken && amt !== null) {
    tag = "loan";
    const lender = party ? party : "";
    lines.push({ account: cashOrBank, dr: amt });
    lines.push({ account: lender ? "Loan from " + lender + " A/c" : (/\bbank\b|term loan|working[- ]capital/.test(text) ? "Bank Loan A/c" : "Loan A/c"), cr: amt });
  }

  else if (flags.isLoanGiven && amt !== null) {
    tag = "loan";
    const borrower = party ? party : "";
    lines.push({ account: borrower ? "Loan to " + borrower + " A/c" : "Loan A/c", dr: amt });
    lines.push({ account: cashOrBank, cr: amt });
  }

  else if (assetLabel && amt !== null && /purchas|bought|acquir/.test(text)) {
    // Fixed-asset purchase — ALWAYS debits the specific asset account
    // (never Purchases A/c, per Rule 9), and generalizes to any mix of
    // cash %, bank/cheque %, trade discount, cash discount, and a
    // credit balance via the shared split engine above, rather than
    // only the handful of exact sample wordings.
    tag = "asset";
    let netAmt = amt;
    if (tradeDiscPct > 0) {
      netAmt = acRound2(amt * (1 - tradeDiscPct / 100));
      narration += ` (marked price ₹${acFmt(amt)} less ${tradeDiscPct}% trade discount = ₹${acFmt(netAmt)})`;
    }
    const { total, gstLines, taxableValue } = gstSplitLines(netAmt, true);
    const assetAmt = taxableValue !== undefined ? taxableValue : netAmt;
    lines.push({ account: assetLabel + " A/c", dr: assetAmt });
    gstLines.forEach(g => lines.push({ account: g.account, dr: g.amount }));

    // Rule 10: every credit portion gets a named supplier/creditor
    // ledger — the stated party if one was given, otherwise a clearly
    // labelled account for this specific asset (e.g. "Furniture
    // Supplier/Creditor A/c"), never a bare generic "Creditors A/c".
    const defaultSupplierAcc = (party ? party : `${assetLabel} Supplier/Creditor`) + " A/c";
    const split = acSplitPaymentPortions(total);
    if (split) {
      let { cashAmt, bankAmt, creditAmt } = split;
      let discAmt = 0;
      if (cashDiscPct > 0) {
        // Cash discount applies only to the portion settled immediately
        // (cash + bank), never to what remains on credit.
        const discCash = acRound2(cashAmt * cashDiscPct / 100);
        const discBank = acRound2(bankAmt * cashDiscPct / 100);
        discAmt = acRound2(discCash + discBank);
        cashAmt = acRound2(cashAmt - discCash);
        bankAmt = acRound2(bankAmt - discBank);
      }
      if (cashAmt > 0.5) lines.push({ account: "Cash A/c", cr: cashAmt });
      if (bankAmt > 0.5) lines.push({ account: "Bank A/c", cr: bankAmt });
      if (discAmt > 0.5) lines.push({ account: "Discount Received A/c", cr: discAmt });
      if (creditAmt > 0.5) lines.push({ account: defaultSupplierAcc, cr: creditAmt });
      narration += ` (cash ₹${acFmt(split.cashAmt)}, bank ₹${acFmt(split.bankAmt)}${discAmt > 0.5 ? `, less ${cashDiscPct}% cash discount ₹${acFmt(discAmt)}` : ""}${creditAmt > 0.5 ? `, ₹${acFmt(creditAmt)} on credit` : ""})`;
    } else {
      const acc = mode === "credit" ? defaultSupplierAcc : cashOrBank;
      lines.push({ account: acc, cr: total });
    }
    ctx.assetBook[assetLabel] = (ctx.assetBook[assetLabel] || 0) + assetAmt;
  }

  else if (flags.isAssetSale && amt !== null && assetLabel) {
    tag = "asset";
    const saleAcc = mode === "credit" ? (party ? party + " A/c" : "Debtors A/c") : cashOrBank;
    const costFig = acAmountNear(text, amounts, ["original cost", "cost"]);
    const accDepFig = acAmountNear(text, amounts, ["accumulated depreciation", "depreciation"]);
    const saleFig = acAmountNear(text, amounts, ["sold for", "sale price", "sold at", "for ₹", "for rs"]);
    if (costFig !== null && accDepFig !== null && saleFig !== null && costFig !== accDepFig && costFig !== saleFig && accDepFig !== saleFig) {
      // All three figures stated explicitly: cost, accumulated
      // depreciation, and sale price — the full disposal calculation,
      // rather than assuming the first number found is the book value.
      const bookValue = acRound2(costFig - accDepFig);
      const diff = acRound2(saleFig - bookValue);
      lines.push({ account: saleAcc, dr: saleFig });
      lines.push({ account: "Accumulated Depreciation A/c", dr: accDepFig });
      lines.push({ account: assetLabel + " A/c", cr: costFig });
      if (diff >= 0) lines.push({ account: "Profit on Sale of " + assetLabel + " A/c", cr: diff });
      else lines.push({ account: "Loss on Sale of " + assetLabel + " A/c", dr: -diff });
      narration += ` (cost ₹${acFmt(costFig)} − accumulated depreciation ₹${acFmt(accDepFig)} = book value ₹${acFmt(bookValue)}; sold for ₹${acFmt(saleFig)})`;
      ctx.assetBook[assetLabel] = 0;
    } else if (amt2 !== null) {
      const bookValue = amt, salePrice = amt2;
      const diff = acRound2(salePrice - bookValue);
      lines.push({ account: saleAcc, dr: salePrice });
      lines.push({ account: assetLabel + " A/c", cr: bookValue });
      if (diff >= 0) lines.push({ account: "Profit on Sale of " + assetLabel + " A/c", cr: diff });
      else lines.push({ account: "Loss on Sale of " + assetLabel + " A/c", dr: -diff });
      ctx.assetBook[assetLabel] = (ctx.assetBook[assetLabel] || 0) - bookValue;
    } else if (/profit of|loss of/.test(text)) {
      const tracked = ctx.assetBook[assetLabel];
      if (tracked !== undefined && tracked > 0) {
        const isProfit = /profit of/.test(text);
        const bookValue = tracked;
        const salePrice = isProfit ? acRound2(bookValue + amt) : acRound2(bookValue - amt);
        lines.push({ account: saleAcc, dr: salePrice });
        lines.push({ account: assetLabel + " A/c", cr: bookValue });
        if (isProfit) lines.push({ account: "Profit on Sale of " + assetLabel + " A/c", cr: amt });
        else lines.push({ account: "Loss on Sale of " + assetLabel + " A/c", dr: amt });
        ctx.assetBook[assetLabel] = 0;
      } else {
        return { ok: false, index: idx, text: original, reason: `Sale of ${assetLabel} at a stated profit/loss alone isn't enough to post a balanced entry unless the asset's book value is already known from an earlier transaction in this sequence — please also state either the book value or the sale price.` };
      }
    } else {
      // Single sale-price figure only, with no book value/profit/loss
      // restated in this sentence — use this asset's tracked book value
      // (built up across its purchase transaction and any depreciation
      // charged since), so profit/loss on disposal is never silently
      // skipped just because the question didn't repeat the figure.
      const tracked = ctx.assetBook[assetLabel];
      if (tracked !== undefined && tracked > 0) {
        const bookValue = tracked, salePrice = amt;
        const diff = acRound2(salePrice - bookValue);
        lines.push({ account: saleAcc, dr: salePrice });
        lines.push({ account: assetLabel + " A/c", cr: bookValue });
        if (diff > 0) lines.push({ account: "Profit on Sale of " + assetLabel + " A/c", cr: diff });
        else if (diff < 0) lines.push({ account: "Loss on Sale of " + assetLabel + " A/c", dr: -diff });
        narration += ` (book value ₹${acFmt(bookValue)} tracked from earlier purchase/depreciation entries, sold for ₹${acFmt(salePrice)})`;
        ctx.assetBook[assetLabel] = 0;
      } else {
        // No tracked book value at all (asset was never purchased in this
        // sequence, or under a different label) — the stated figure is
        // the only information available, so it's booked directly with
        // no invented profit/loss.
        lines.push({ account: saleAcc, dr: amt });
        lines.push({ account: assetLabel + " A/c", cr: amt });
        ctx.assetBook[assetLabel] = (ctx.assetBook[assetLabel] || 0) - amt;
      }
    }
  }

  else if (flags.isMiscIncomeSale && amt !== null) {
    tag = "income";
    lines.push({ account: cashOrBank, dr: amt });
    lines.push({ account: "Sale of Old Newspapers/Miscellaneous Income A/c", cr: amt });
  }

  else if (expenseLabel && amt !== null && /\bpaid\b|\bpay\b|\bpaying\b|\bsettled\b|\bcleared\b|purchased|bought|charged/.test(text)
    && !(/^(freight|cartage|carriage)/i.test(expenseLabel) && /\bgoods\b/.test(text) && /purchas|bought|\bsold\b|\bsale\b/.test(text))) {
    tag = "expense";
    const { total, gstLines, taxableValue } = gstSplitLines(amt, true);
    const expenseAmt = taxableValue !== undefined ? taxableValue : amt;
    const acc = mode === "credit" ? (party ? party + " A/c" : "Creditors A/c") : cashOrBank;
    lines.push({ account: expenseLabel + " A/c", dr: expenseAmt });
    gstLines.forEach(g => lines.push({ account: g.account, dr: g.amount }));
    lines.push({ account: acc, cr: total });
  }

  else if (incomeLabel && amt !== null && /received|receive\b/.test(text)) {
    tag = "income";
    lines.push({ account: cashOrBank, dr: amt });
    lines.push({ account: incomeLabel + " A/c", cr: amt });
  }

  else if ((isGoods || isBareSaleOrPurchase) && amt !== null && /purchas|bought/.test(text) && !flags.isSettlementOfEarlier) {
    tag = "goods";
    let netAmt = amt;
    if (tradeDiscPct > 0) {
      netAmt = acRound2(amt * (1 - tradeDiscPct / 100));
      narration += ` (marked price ₹${acFmt(amt)} less ${tradeDiscPct}% trade discount = ₹${acFmt(netAmt)}; trade discount isn't journalised separately)`;
    }
    const { total, gstLines, taxableValue } = gstSplitLines(netAmt, true);
    const netForBooks = taxableValue !== undefined ? taxableValue : netAmt;
    lines.push({ account: "Purchases A/c", dr: netForBooks });
    gstLines.forEach(g => lines.push({ account: g.account, dr: g.amount }));

    // Freight/cartage paid to bring the goods in is a SEPARATE cost from
    // the price of the goods themselves — it must be added as its own
    // line (Carriage Inward), not substituted for Purchases, and its
    // payment (almost always cash, even when the goods themselves are
    // on credit) is settled independently of however the goods purchase
    // itself is settled.
    let freightAmt = null;
    if (/freight|cartage|\bcarriage\b/.test(text) && amounts.length > 1) {
      const nearFreight = acAmountNear(text, amounts, ["freight", "cartage", "carriage"]);
      if (nearFreight !== null && nearFreight !== amt) freightAmt = nearFreight;
    }
    if (freightAmt !== null) {
      lines.push({ account: "Carriage Inward A/c", dr: freightAmt });
      const freightWindow = text.slice(Math.max(0, text.search(/freight|cartage|\bcarriage\b/)), text.search(/freight|cartage|\bcarriage\b/) + 40);
      const freightAcc = /\bcheque\b|\bchq\b/.test(freightWindow) ? "Bank A/c" : /\bbank\b/.test(freightWindow) ? "Bank A/c" : "Cash A/c";
      lines.push({ account: freightAcc, cr: freightAmt });
      narration += ` (freight/cartage of ₹${acFmt(freightAmt)} on the purchase, paid separately)`;
    }
    const generalGoodsSplit = acSplitPaymentPortions(total);
    if (isPartialPortionWithCashDisc) {
      const paidPortion = acRound2(total * partialPortionPct / 100);
      const discOnPaid = acRound2(paidPortion * cashDiscPct / 100);
      const actualCash = acRound2(paidPortion - discOnPaid);
      const remainder = acRound2(total - paidPortion);
      lines.push({ account: splitPaidAcc, cr: actualCash });
      lines.push({ account: "Discount Received A/c", cr: discOnPaid });
      if (remainder > 0.5) lines.push({ account: party ? party + " A/c" : "Creditors A/c", cr: remainder });
      narration += ` (${partialPortionPct}% of ₹${acFmt(total)} = ₹${acFmt(paidPortion)} paid now, less ${cashDiscPct}% cash discount ₹${acFmt(discOnPaid)} = ₹${acFmt(actualCash)} actually paid; ₹${acFmt(remainder)} remains owed)`;
    } else if (isSplitPayment && (amt2 !== null || (partialPortionPct > 0 && partialPortionPct < 100)) && balanceMode !== "bank" && balanceMode !== "cash" && !(splitCashPct > 0 && splitBankPct > 0)) {
      // Prefer an explicit percentage of the total over a stray second
      // amount — "paid 50%... balance after 15 days on credit" has no
      // rupee figure for the paid portion at all, only a percentage.
      const paidNow = (partialPortionPct > 0 && partialPortionPct < 100) ? acRound2(total * partialPortionPct / 100) : amt2;
      const creditPortion = acRound2(total - paidNow);
      lines.push({ account: splitPaidAcc, cr: paidNow });
      lines.push({ account: splitRemainderAccPurchase, cr: creditPortion });
      narration += ` (₹${acFmt(paidNow)} paid now, ₹${acFmt(creditPortion)} remains ${remainderIsBillPayable ? "as a bill payable" : "on credit"})`;
    } else if (generalGoodsSplit && (splitCashPct > 0 || splitBankPct > 0)) {
      // General case: a cash % AND a bank/cheque % both stated together
      // (e.g. "40% by cheque, 30% by cash, balance on credit"), or a
      // single stated % whose remainder is explicitly settled in a
      // different mode (e.g. "50% by cash and balance by cheque") rather
      // than left on credit — neither of which the two narrower cases
      // above cover, since both require the remainder to be a credit
      // balance with only one payment mode named.
      let { cashAmt, bankAmt, creditAmt } = generalGoodsSplit;
      let discAmt = 0;
      if (cashDiscPct > 0) {
        const discCash = acRound2(cashAmt * cashDiscPct / 100);
        const discBank = acRound2(bankAmt * cashDiscPct / 100);
        discAmt = acRound2(discCash + discBank);
        cashAmt = acRound2(cashAmt - discCash);
        bankAmt = acRound2(bankAmt - discBank);
      }
      if (cashAmt > 0.5) lines.push({ account: "Cash A/c", cr: cashAmt });
      if (bankAmt > 0.5) lines.push({ account: "Bank A/c", cr: bankAmt });
      if (discAmt > 0.5) lines.push({ account: "Discount Received A/c", cr: discAmt });
      if (creditAmt > 0.5) lines.push({ account: party ? party + " A/c" : "Creditors A/c", cr: creditAmt });
      narration += ` (cash ₹${acFmt(generalGoodsSplit.cashAmt)}, bank ₹${acFmt(generalGoodsSplit.bankAmt)}${discAmt > 0.5 ? `, less ${cashDiscPct}% cash discount ₹${acFmt(discAmt)}` : ""}${creditAmt > 0.5 ? `, ₹${acFmt(creditAmt)} on credit` : ""})`;
    } else if (cashDiscPct > 0 && mode !== "credit") {
      // Trade discount (already excluded above, before the entry is even
      // built) and cash discount are independent and can both apply to
      // the same purchase — trade discount lowers the recorded price;
      // cash discount is a separate account on the immediate payment.
      const acc = cashOrBank;
      const discAmt = acRound2(total * cashDiscPct / 100);
      const netPay = acRound2(total - discAmt);
      lines.push({ account: acc, cr: netPay });
      lines.push({ account: "Discount Received A/c", cr: discAmt });
      narration += ` (cash discount ${cashDiscPct}% on ₹${acFmt(total)} = ₹${acFmt(discAmt)})`;
    } else {
      const acc = mode === "credit" ? (party ? party + " A/c" : "Creditors A/c") : cashOrBank;
      lines.push({ account: acc, cr: total });
    }
  }

  else if ((isGoods || isBareSaleOrPurchase) && amt !== null && /sold|sales? of goods|\bsales?\b/.test(text) && !flags.isSettlementOfEarlier) {
    tag = "goods";
    let netAmt = amt;
    if (tradeDiscPct > 0) {
      netAmt = acRound2(amt * (1 - tradeDiscPct / 100));
      narration += ` (marked price ₹${acFmt(amt)} less ${tradeDiscPct}% trade discount = ₹${acFmt(netAmt)}; trade discount isn't journalised separately)`;
    }
    const { total, gstLines, taxableValue } = gstSplitLines(netAmt, false);
    const netForBooks = taxableValue !== undefined ? taxableValue : netAmt;

    // Freight CHARGED TO the customer is recovered from them, not an
    // expense of the sale — it increases what the customer owes, and is
    // credited to its own recovery/income account rather than reducing
    // Sales or being treated as a cost the seller bears.
    let freightRecovered = null;
    if (/freight|cartage|\bcarriage\b/.test(text) && /charg(e|ed)|recover|added/.test(text) && amounts.length > 1) {
      const nearFreight = acAmountNear(text, amounts, ["freight", "cartage", "carriage"]);
      if (nearFreight !== null && nearFreight !== amt) freightRecovered = nearFreight;
    }
    const totalWithFreight = freightRecovered !== null ? acRound2(total + freightRecovered) : total;

    if (isPartialPortionWithCashDisc) {
      const receivedPortion = acRound2(totalWithFreight * partialPortionPct / 100);
      const discOnReceived = acRound2(receivedPortion * cashDiscPct / 100);
      const actualCash = acRound2(receivedPortion - discOnReceived);
      const remainder = acRound2(total - receivedPortion);
      lines.push({ account: splitReceivedAcc, dr: actualCash });
      lines.push({ account: "Discount Allowed A/c", dr: discOnReceived });
      if (remainder > 0.5) lines.push({ account: party ? party + " A/c" : "Debtors A/c", dr: remainder });
      narration += ` (${partialPortionPct}% of ₹${acFmt(total)} = ₹${acFmt(receivedPortion)} received now, less ${cashDiscPct}% cash discount ₹${acFmt(discOnReceived)} = ₹${acFmt(actualCash)} actually received; ₹${acFmt(remainder)} remains owed)`;
    } else if (isSplitReceipt && (amt2 !== null || (partialPortionPct > 0 && partialPortionPct < 100))) {
      const receivedNow = (partialPortionPct > 0 && partialPortionPct < 100) ? acRound2(total * partialPortionPct / 100) : amt2;
      const creditPortion = acRound2(total - receivedNow);
      lines.push({ account: splitReceivedAcc, dr: receivedNow });
      lines.push({ account: splitRemainderAccSale, dr: creditPortion });
      narration += ` (₹${acFmt(receivedNow)} received now, ₹${acFmt(creditPortion)} remains ${remainderIsBillReceivable ? "as a bill receivable" : "on credit"})`;
    } else if (cashDiscPct > 0 && mode !== "credit") {
      const discAmt = acRound2(total * cashDiscPct / 100);
      const netReceipt = acRound2(total - discAmt);
      lines.push({ account: cashOrBank, dr: netReceipt });
      lines.push({ account: "Discount Allowed A/c", dr: discAmt });
      narration += ` (cash discount ${cashDiscPct}% on ₹${acFmt(total)} = ₹${acFmt(discAmt)})`;
    } else {
      const acc = mode === "credit" ? (party ? party + " A/c" : "Debtors A/c") : cashOrBank;
      lines.push({ account: acc, dr: totalWithFreight });
    }
    lines.push({ account: "Sales A/c", cr: netForBooks });
    gstLines.forEach(g => lines.push({ account: g.account, cr: g.amount }));
    if (freightRecovered !== null) {
      lines.push({ account: "Freight Recovered A/c", cr: freightRecovered });
      narration += ` (freight of ₹${acFmt(freightRecovered)} charged to and recovered from the customer)`;
    }
  }

  else if ((party || /\bdebtors?\b/.test(text)) && amt !== null && (/received\b[\s\S]{0,25}\bfrom\b/.test(text) || partySettledSelf || (partyFromContext && /\breceived\b/.test(text) && /settlement/.test(text)))) {
    tag = "debtor";
    const acctName = party || "Debtors";
    let recv = amt, disc = 0;
    const dueFromCtx = party && ctx.partyBalances ? ctx.partyBalances[party.toLowerCase()] : null;
    if (amt2 !== null && flags.isFullSettlement) {
      const settle = Math.min(amt, amt2), gross = Math.max(amt, amt2);
      disc = acRound2(gross - settle); recv = settle;
    } else if (flags.isFullSettlement && dueFromCtx != null && dueFromCtx > amt) {
      // No explicit "of ₹X" figure was given in THIS line — use the
      // amount this party is actually known to owe, from their running
      // balance built up over the preceding transactions, so the
      // discount is never silently dropped.
      disc = acRound2(dueFromCtx - amt); recv = amt;
    } else if (amt2 !== null && /discount/.test(text)) {
      disc = amt2; recv = amt;
    } else if (cashDiscPct > 0) {
      disc = acRound2(amt * cashDiscPct / 100); recv = acRound2(amt - disc);
    }
    lines.push({ account: cashOrBank, dr: recv });
    if (disc > 0) lines.push({ account: "Discount Allowed A/c", dr: disc });
    lines.push({ account: acctName + " A/c", cr: acRound2(recv + disc) });
  }

  else if ((party || /\bcreditors?\b/.test(text)) && amt !== null && (paidToTargetHasTo || paidPartyDirect || isTwoWaySplitPay || (partyFromContext && /\bpaid\b/.test(text) && /settlement/.test(text)))) {
    tag = "creditor";
    const acctName = party || "Creditors";
    // "Paid ₹60,000 by bank and ₹10,000 in cash to settle a creditor of
    // ₹70,000" — two payment amounts, in two different modes, both
    // paid now (no discount, no remaining credit) — distinct from the
    // "paid X, balance on credit" split handled elsewhere.
    if (isTwoWaySplitPay) {
      // "₹60,000 by bank" / "₹10,000 in cash" — the amount directly
      // precedes its mode here, the reverse of "sold for ₹X", so this
      // needs its own tight regex rather than generic nearest-amount
      // matching (which would grab the wrong neighbour).
      const bankMatch = /([\d][\d,]*(?:\.\d+)?)\s*(?:by\s*)?bank/i.exec(text) || /bank[\s\S]{0,15}?([\d][\d,]*(?:\.\d+)?)/i.exec(text);
      const cashMatch = /([\d][\d,]*(?:\.\d+)?)\s*(?:in\s*)?cash/i.exec(text) || /cash[\s\S]{0,15}?([\d][\d,]*(?:\.\d+)?)/i.exec(text);
      const bankAmt = bankMatch ? parseFloat(bankMatch[1].replace(/,/g, "")) : null;
      const cashAmt = cashMatch ? parseFloat(cashMatch[1].replace(/,/g, "")) : null;
      const total = amounts.length > 2 ? amounts[2].value : acRound2((bankAmt || 0) + (cashAmt || 0));
      lines.push({ account: acctName + " A/c", dr: total });
      if (bankAmt) lines.push({ account: "Bank A/c", cr: bankAmt });
      if (cashAmt) lines.push({ account: "Cash A/c", cr: cashAmt });
    } else {
      let paid = amt, disc = 0;
      const dueFromCtxCr = party && ctx.partyBalances ? -(ctx.partyBalances[party.toLowerCase()] || 0) : null;
      if (amt2 !== null && flags.isFullSettlement) {
        const settle = Math.min(amt, amt2), gross = Math.max(amt, amt2);
        disc = acRound2(gross - settle); paid = settle;
      } else if (flags.isFullSettlement && dueFromCtxCr != null && dueFromCtxCr > amt) {
        disc = acRound2(dueFromCtxCr - amt); paid = amt;
      } else if (amt2 !== null && /discount/.test(text)) {
        disc = amt2; paid = amt;
      } else if (cashDiscPct > 0) {
        disc = acRound2(amt * cashDiscPct / 100); paid = acRound2(amt - disc);
      }
      lines.push({ account: acctName + " A/c", dr: acRound2(paid + disc) });
      lines.push({ account: cashOrBank, cr: paid });
      if (disc > 0) lines.push({ account: "Discount Received A/c", cr: disc });
    }
  }

  // "Ram owed ₹60,000. He paid ₹57,000 by cheque and received ₹3,000
  // discount in full settlement." — a narrative combining the amount
  // owed, the amount paid, and the discount as three separate explicit
  // figures, rather than "in full settlement of ₹X" or a tracked
  // balance. Handled before the generic standalone-discount branches
  // below, which would otherwise grab the wrong one of these numbers.
  else if (party && amt !== null && /\bowed\b/.test(text) && /\bpaid\b/.test(text) && /discount/.test(text)) {
    const owed = acAmountNear(text, amounts, ["owed"]);
    const paidFig = acAmountNear(text, amounts, ["paid"]);
    const discFig = acAmountNear(text, amounts, ["discount"]);
    if (owed === null || paidFig === null || discFig === null) {
      return { ok: false, index: idx, text: original, reason: "Please state the amount owed, the amount actually paid, and the discount separately so the entry can be split correctly." };
    }
    tag = "debtor";
    const payAcc = /\b(bank|cheque|chq)\b/.test(text) ? "Bank A/c" : "Cash A/c";
    lines.push({ account: payAcc, dr: paidFig });
    lines.push({ account: "Discount Allowed A/c", dr: discFig });
    lines.push({ account: party + " A/c", cr: owed });
  }

  // Standalone "Allowed her discount ₹500" / "Received discount ₹300
  // from him" lines — a follow-up to a preceding transaction with the
  // same party (resolved above via ctx.lastParty), rather than a
  // discount folded into the same sentence as the receipt/payment.
  else if (party && amt !== null && (/allow(ed|s)?\b[\s\S]{0,20}discount|discount[\s\S]{0,10}allow/.test(text)) && !/trade discount/.test(text)) {
    tag = "debtor";
    const discFig = acAmountNear(text, amounts, ["discount"]) ?? amt;
    lines.push({ account: "Discount Allowed A/c", dr: discFig });
    lines.push({ account: party + " A/c", cr: discFig });
  }

  else if (party && amt !== null && (/(received|receive)\b[\s\S]{0,20}discount|discount[\s\S]{0,10}(received|receive)\b/.test(text)) && !/trade discount/.test(text) && !/cash discount/.test(text)) {
    tag = "creditor";
    const discFig = acAmountNear(text, amounts, ["discount"]) ?? amt;
    lines.push({ account: party + " A/c", dr: discFig });
    lines.push({ account: "Discount Received A/c", cr: discFig });
  }

  // A bare adjustment line "Discount allowed ₹1,000." (no party named, no receipt in the
  // same sentence): it is a final-accounts write-off against the debtors, not an error.
  else if (!party && amt !== null && /discount allowed/.test(text) && !/trade discount|cash discount|received|receive/.test(text)) {
    tag = "debtor";
    const discFig = acAmountNear(text, amounts, ["discount allowed", "discount"]) ?? amt;
    lines.push({ account: "Discount Allowed A/c", dr: discFig });
    lines.push({ account: "Debtors A/c", cr: discFig });
  }

  if (!lines.length) {
    if (/correct(ed|ing)?\s+(an\s+)?error/.test(text)) {
      return { ok: false, index: idx, text: original, reason: "Correcting an error needs the specifics of what was wrongly recorded (which account, which amount) so the rectifying entry can be worked out — please state the original wrong entry." };
    }
    if (/closing adjustment entry/.test(text)) {
      return { ok: false, index: idx, text: original, reason: "Closing adjustments (outstanding/prepaid expenses, accrued/advance income) need to be entered individually with their amounts — see the outstanding, prepaid, accrued, and advance-income transactions already in this list." };
    }
    if (/exchanged for another/.test(text)) {
      return { ok: false, index: idx, text: original, reason: "An asset-for-asset exchange needs the value of the asset given up (and the new asset's value, if different) to post a balanced entry." };
    }
    if (/partly for cash and partly on credit|partly.*cash.*partly.*credit/.test(text)) {
      return { ok: false, index: idx, text: original, reason: "State how much was paid in cash/by cheque and how much was on credit so the entry can be split correctly." };
    }
    return { ok: false, index: idx, text: original, reason: "Couldn't confidently identify the accounts involved — try stating the item/party, the amount, and cash/bank/credit explicitly." };
  }
  if (!bothSidesOk()) {
    return { ok: false, index: idx, text: original, reason: "Internal check failed: debit and credit did not balance for this line." };
  }
  // Remember the party this transaction was about, so a later line that
  // only says "her"/"his"/"their" without naming anyone can still be
  // resolved correctly. Also update their running balance (+ve = they
  // owe the business, -ve = the business owes them) so a later "in full
  // settlement" line with no explicit due-amount of its own can still
  // work out the correct discount instead of silently dropping it.
  if (party && lines.some(l => l.account === party + " A/c")) {
    ctx.lastParty = party;
    ctx.partyBalances = ctx.partyBalances || {};
    const key = party.toLowerCase();
    const drSum = lines.filter(l => l.account === party + " A/c").reduce((s, l) => s + (l.dr || 0), 0);
    const crSum = lines.filter(l => l.account === party + " A/c").reduce((s, l) => s + (l.cr || 0), 0);
    ctx.partyBalances[key] = acRound2((ctx.partyBalances[key] || 0) + drSum - crSum);
  }
  // Track running Input/Output GST balances by head, so a later GST
  // set-off line has real recorded balances to work from instead of
  // needing every transaction re-stated.
  ctx.gstBalances = ctx.gstBalances || { inputCGST: 0, inputSGST: 0, inputIGST: 0, outputCGST: 0, outputSGST: 0, outputIGST: 0 };
  lines.forEach(l => {
    const m = /^(Input|Output) (CGST|SGST|IGST) A\/c$/.exec(l.account);
    if (!m) return;
    const key = m[1].toLowerCase() + m[2]; // e.g. "inputCGST"
    const delta = m[1] === "Input" ? (l.dr || 0) - (l.cr || 0) : (l.cr || 0) - (l.dr || 0);
    ctx.gstBalances[key] = acRound2((ctx.gstBalances[key] || 0) + delta);
  });
  // Consolidate duplicate (account, side) lines that different parts of
  // this function may have pushed independently — e.g. a main purchase
  // settled in cash plus a separate freight amount also paid in cash
  // should appear as one combined "Cash A/c" credit, not two. Never
  // merges a debit with a credit on the same account (that's a genuine,
  // separate accounting fact, not a duplicate).
  if (lines.length > 1) {
    const merged = [];
    const seenAt = {};
    lines.forEach(l => {
      const key = l.account + "|" + (l.dr ? "dr" : "cr");
      if (seenAt[key] !== undefined) {
        const target = merged[seenAt[key]];
        if (l.dr) target.dr = acRound2((target.dr || 0) + l.dr);
        if (l.cr) target.cr = acRound2((target.cr || 0) + l.cr);
      } else {
        seenAt[key] = merged.length;
        merged.push({ ...l });
      }
    });
    lines.length = 0;
    lines.push(...merged);
  }

  // Running Cash/Bank balances — lets the engine flag (never block) a
  // transaction that would take Cash negative, since unlike Bank, a
  // cash account genuinely cannot run below zero.
  ctx.cashBalance = ctx.cashBalance === undefined ? 0 : ctx.cashBalance;
  ctx.bankBalance = ctx.bankBalance === undefined ? 0 : ctx.bankBalance;
  let warning = null;
  lines.forEach(l => {
    if (l.account === "Cash A/c") ctx.cashBalance = acRound2(ctx.cashBalance + (l.dr || 0) - (l.cr || 0));
    if (l.account === "Bank A/c") ctx.bankBalance = acRound2(ctx.bankBalance + (l.dr || 0) - (l.cr || 0));
  });
  if (ctx.cashBalance < -0.01) {
    warning = `This leaves Cash at a negative balance (₹${acFmt(ctx.cashBalance)}), which isn't possible — a cash account can't go below zero the way a bank account can with an overdraft. Please check the cash figures in this transaction and the ones before it.`;
  }
  return { ok: true, index: idx, text: original, lines, narration, tag, warning, date };
}


/* ============================================================
   ACCOUNTING ENGINE v2 — one pipeline, one accounting truth
   ------------------------------------------------------------
   text → UNDERSTAND (interpreters) → normalised event
        → VALIDATE (balance + semantic coverage + context)
        → COMMIT (state is derived from the validated journal lines)
        → Journal → Ledger → Trial Balance → Final Accounts

   Every interpreter (the new structured ones below AND the original
   rule chain, kept as acLegacyParse) mutates only a STAGED clone of the
   state. State is committed once, from the validated lines, so an
   invalid/uncertain transaction can never leak into a later one.
   ============================================================ */

/* ---------- A1. ACCOUNT REGISTRY (identity + metadata) ---------- */
// category → how the account behaves in the statements.
const AC_CAT = {
  cash:            { nature: "asset",     normal: "dr", stmt: "bs" },
  bank:            { nature: "asset",     normal: "dr", stmt: "bs" },
  bank_od:         { nature: "liability", normal: "cr", stmt: "bs" },
  stock:           { nature: "asset",     normal: "dr", stmt: "stock" },
  asset_fixed:     { nature: "asset",     normal: "dr", stmt: "bs" },
  asset_current:   { nature: "asset",     normal: "dr", stmt: "bs" },
  debtors:         { nature: "asset",     normal: "dr", stmt: "bs" },
  bills_receivable:{ nature: "asset",     normal: "dr", stmt: "bs" },
  cheque:          { nature: "asset",     normal: "dr", stmt: "bs" },
  prepaid:         { nature: "asset",     normal: "dr", stmt: "bs" },
  accrued_income:  { nature: "asset",     normal: "dr", stmt: "bs" },
  claim_receivable:{ nature: "asset",     normal: "dr", stmt: "bs" },
  advance_asset:   { nature: "asset",     normal: "dr", stmt: "bs" },
  creditors:       { nature: "liability", normal: "cr", stmt: "bs" },
  bills_payable:   { nature: "liability", normal: "cr", stmt: "bs" },
  loan_liab:       { nature: "liability", normal: "cr", stmt: "bs" },
  loan_asset:      { nature: "asset",     normal: "dr", stmt: "bs" },
  loan_generic:    { nature: "either",    normal: "cr", stmt: "bs" },
  outstanding:     { nature: "liability", normal: "cr", stmt: "bs" },
  advance_income:  { nature: "liability", normal: "cr", stmt: "bs" },
  advance_liab:    { nature: "liability", normal: "cr", stmt: "bs" },
  gst_payable:     { nature: "liability", normal: "cr", stmt: "gst" },
  gst_input:       { nature: "asset",     normal: "dr", stmt: "gst" },
  gst_output:      { nature: "liability", normal: "cr", stmt: "gst" },
  capital:         { nature: "capital",   normal: "cr", stmt: "capital" },
  drawings:        { nature: "capital",   normal: "dr", stmt: "capital" },
  purchases:       { nature: "expense",   normal: "dr", stmt: "trading" },
  sales:           { nature: "income",    normal: "cr", stmt: "trading" },
  purchase_returns:{ nature: "contra",    normal: "cr", stmt: "trading" },
  sales_returns:   { nature: "contra",    normal: "dr", stmt: "trading" },
  direct_exp:      { nature: "expense",   normal: "dr", stmt: "trading" },
  direct_inc:      { nature: "income",    normal: "cr", stmt: "trading" },
  indirect_exp:    { nature: "expense",   normal: "dr", stmt: "pl" },
  indirect_inc:    { nature: "income",    normal: "cr", stmt: "pl" },
  abnormal_loss:   { nature: "expense",   normal: "dr", stmt: "pl" },
  disposal_gain:   { nature: "income",    normal: "cr", stmt: "pl" },
  disposal_loss:   { nature: "expense",   normal: "dr", stmt: "pl" },
  prov_dd:         { nature: "contra",    normal: "cr", stmt: "prov" },
  prov_disc_dr:    { nature: "contra",    normal: "cr", stmt: "prov" },
  prov_disc_cr:    { nature: "contra",    normal: "dr", stmt: "prov" },
  contra_asset:    { nature: "contra",    normal: "cr", stmt: "bs" },
  pl_transfer:     { nature: "adjustment",normal: "dr", stmt: "plx" },
  personal:        { nature: "personal",  normal: "dr", stmt: "bs" }
};

// Direct expenses (Trading Account). Everything else expense-like is indirect (P&L).
const AC_DIRECT_EXP = ["Wages", "Carriage Inwards", "Freight", "Import Duty", "Custom Duty", "Octroi", "Factory Rent", "Fuel & Power", "Cartage"];

// [canonical name, category, extra aliases]. Aliases are compared after acAccKey().
const AC_REGISTRY_DEF = [
  ["Cash", "cash", ["cash in hand", "cash balance", "cash on hand"]],
  ["Bank", "bank", ["bank balance", "cash at bank", "balance at bank", "bank current"]],
  ["Bank Overdraft", "bank_od", ["overdraft", "bank od"]],
  ["Cheques in Hand", "cheque", ["cheque in hand", "cheques on hand"]],
  ["Cheques Sent for Collection", "cheque", []],
  ["Goods (Stock)", "stock", ["stock", "closing stock", "opening stock", "stock in trade", "inventory", "goods", "goods stock", "stock of goods", "stock goods"]],
  ["Purchases", "purchases", ["purchase", "goods purchased"]],
  ["Purchase Returns", "purchase_returns", ["purchases returns", "purchase return", "purchases return", "returns outward"]],
  ["Sales", "sales", ["sale"]],
  ["Sales Returns", "sales_returns", ["sale returns", "sales return", "sale return", "returns inward"]],
  ["Capital", "capital", ["proprietor capital", "owner capital", "capital account"]],
  ["Drawings", "drawings", ["drawing", "proprietor drawings"]],
  ["Debtors", "debtors", ["sundry debtors", "debtor", "trade receivables", "accounts receivable"]],
  ["Creditors", "creditors", ["sundry creditors", "creditor", "trade payables", "accounts payable"]],
  ["Bills Receivable", "bills_receivable", ["bill receivable", "bills receivables"]],
  ["Bills Payable", "bills_payable", ["bill payable"]],
  ["Loan", "loan_generic", []],
  ["Bank Loan", "loan_liab", ["loan from bank", "term loan", "working capital loan"]],
  ["Furniture", "asset_fixed", ["furniture and fixtures", "furniture fixtures", "furnitures"]],
  ["Machinery", "asset_fixed", ["plant and machinery", "machineries"]],
  ["Plant", "asset_fixed", []],
  ["Building", "asset_fixed", ["buildings"]],
  ["Computer", "asset_fixed", ["computers", "laptop", "computer equipment"]],
  ["Vehicle", "asset_fixed", ["vehicles", "motor car", "motor vehicle", "motor vehicles", "car"]],
  ["Land", "asset_fixed", []],
  ["Equipment", "asset_fixed", ["equipments"]],
  ["Office Equipment", "asset_fixed", ["office equipments"]],
  ["Investment", "asset_fixed", ["investments"]],
  ["Goodwill", "asset_fixed", []],
  ["Accumulated Depreciation", "contra_asset", []],
  ["Insurance Claim", "claim_receivable", ["insurance claim receivable", "claim receivable"]],
  ["Advance to Supplier", "advance_asset", []],
  ["Goods sent on Approval", "advance_asset", []],
  ["Advance from Customer", "advance_liab", []],
  ["GST Payable", "gst_payable", []],
  ["Discount Allowed", "indirect_exp", []],
  ["Discount Received", "indirect_inc", []],
  ["Discount on Bills Receivable", "indirect_exp", ["bill discounting charges", "discount on bills"]],
  ["Bad Debts", "indirect_exp", ["bad debt"]],
  ["Bad Debts Recovered", "indirect_inc", ["bad debt recovered"]],
  ["Depreciation", "indirect_exp", []],
  ["Loss by Fire/Theft", "abnormal_loss", ["loss by fire theft", "loss by fire", "loss by theft", "abnormal loss", "loss of goods", "loss of goods in transit"]],
  ["Interest on Capital", "indirect_exp", []],
  ["Interest on Drawings", "indirect_inc", []],
  ["Manager's Commission", "indirect_exp", ["managers commission", "manager commission"]],
  ["Free Samples", "indirect_exp", []],
  ["Staff Welfare Expenses", "indirect_exp", ["staff welfare", "staff welfare expense"]],
  ["Freight Recovered", "indirect_inc", []],
  ["Sale of Old Newspapers/Miscellaneous Income", "indirect_inc", ["miscellaneous income", "sale of old newspapers miscellaneous income"]],
  ["Provision for Doubtful Debts", "prov_dd", ["provision for bad debts", "provision for bad and doubtful debts"]],
  ["Provision for Discount on Debtors", "prov_disc_dr", []],
  ["Provision for Discount on Creditors", "prov_disc_cr", []],
  ["Profit & Loss", "pl_transfer", ["profit and loss", "profit loss"]]
];
// Aliases for names built by the vocabulary tables further up the file.
const AC_EXTRA_EXPENSE_ALIASES = {
  "Salary": ["salaries", "salary and wages"],
  "Insurance Premium": ["insurance", "premium", "insurance expense"],
  "Electricity Charges": ["electricity", "electricity expenses", "electricity bill", "electricity charge"],
  "Telephone Charges": ["telephone", "telephone expenses", "telephone bill"],
  "Printing & Stationery": ["stationery", "printing and stationery", "printing"],
  "Repairs": ["repair", "repairs and maintenance"],
  "Carriage Inwards": ["carriage inward", "freight inward", "cartage inward", "carriage on purchases"],
  "Carriage Outwards": ["carriage outward", "freight outward", "cartage outward", "carriage on sales"],
  "Charity/Donation": ["donation", "donations", "charity", "charity donation"],
  "Interest on Loan": ["loan interest", "interest on bank loan", "interest on term loan", "interest on working capital loan"],
  "Bank Charges": ["bank service charges", "collection charges", "bank collection charges"],
  "Advertisement": ["advertising", "advertisement expenses"],
  "Audit Fee": ["audit fees"]
};

// Normalise any spelling of an account name to a comparison key.
function acAccKey(name) {
  return String(name || "").toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\ba\s*\/\s*c\b/g, " ")
    .replace(/\b(?:account|acct|a c)\b/g, " ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ").trim();
}
const AC_REGISTRY = {};   // key → {id, name, category}
function acRegister(name, category, aliases) {
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  const entry = { id, name, category };
  AC_REGISTRY[acAccKey(name)] = entry;
  (aliases || []).forEach(a => { AC_REGISTRY[acAccKey(a)] = entry; });
  return entry;
}
AC_REGISTRY_DEF.forEach(([n, c, a]) => acRegister(n, c, a));
// Every account the vocabulary tables can produce is registered with a proper category.
AC_EXPENSE_WORDS.forEach(([, label]) => {
  if (AC_REGISTRY[acAccKey(label)]) return;
  acRegister(label, AC_DIRECT_EXP.includes(label) ? "direct_exp" : "indirect_exp", AC_EXTRA_EXPENSE_ALIASES[label] || []);
});
Object.keys(AC_EXTRA_EXPENSE_ALIASES).forEach(label => {
  const e = AC_REGISTRY[acAccKey(label)];
  if (!e) { acRegister(label, AC_DIRECT_EXP.includes(label) ? "direct_exp" : "indirect_exp", AC_EXTRA_EXPENSE_ALIASES[label]); return; }
  AC_EXTRA_EXPENSE_ALIASES[label].forEach(a => { AC_REGISTRY[acAccKey(a)] = e; });
});
["Wages", "Freight", "Import Duty", "Custom Duty", "Octroi", "Cartage", "Factory Rent", "Fuel & Power"].forEach(n => {
  if (!AC_REGISTRY[acAccKey(n)]) acRegister(n, "direct_exp", []);
});
AC_INCOME_WORDS.forEach(([, label]) => {
  if (!AC_REGISTRY[acAccKey(label)]) acRegister(label, "indirect_inc", []);
});
["Interest Paid", "Carriage", "Noting Charges", "Discount on Bills Payable"].forEach(n => { if (!AC_REGISTRY[acAccKey(n)]) acRegister(n, "indirect_exp", []); });

function acTitleCase(s) { return s.replace(/\b([a-z])([a-z']*)/gi, (m, a, b) => a.toUpperCase() + b.toLowerCase()); }

// Canonical *display* name (always "X A/c") + identity for any account string.
// Dynamic families (Prepaid X, Outstanding X, Accrued X, X Received in Advance,
// Loan from/to X, Profit/Loss on Sale of X, Input/Output CGST…) normalise their
// inner name through the same registry, so wording variants never fork an account.
function acResolveAccount(rawName) {
  const stripped = String(rawName || "").replace(/\s*\ba\s*\/\s*c\b\.?\s*$/i, "").replace(/\s+account\s*$/i, "").trim();
  const key = acAccKey(stripped);
  if (AC_REGISTRY[key]) { const e = AC_REGISTRY[key]; return { id: e.id, name: e.name, display: e.name + " A/c", category: e.category }; }
  let m;
  const inner = (n) => { const r = acResolveAccount(n); return r.name; };
  if ((m = /^(prepaid|outstanding|accrued|unearned|advance)\s+(.+)$/i.exec(stripped)) && !/^advance (to|from)\b/i.test(stripped)) {
    const base = inner(m[2]); const kind = m[1].toLowerCase();
    const nm = (kind === "prepaid" ? "Prepaid " : kind === "outstanding" ? "Outstanding " : kind === "accrued" ? "Accrued " : kind === "unearned" ? "Unearned " : "Advance ") + base;
    const cat = kind === "prepaid" ? "prepaid" : kind === "accrued" ? "accrued_income" : kind === "outstanding" ? "outstanding" : "advance_income";
    return { id: nm.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""), name: nm, display: nm + " A/c", category: cat };
  }
  if ((m = /^(.+?)\s+(?:received\s+)?in\s+advance$/i.exec(stripped))) {
    const base = inner(m[1]).replace(/ Received$/, "");
    const nm = base + " Received in Advance";
    return { id: nm.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""), name: nm, display: nm + " A/c", category: "advance_income" };
  }
  if ((m = /^(input|output)\s+(cgst|sgst|igst|gst)$/i.exec(stripped))) {
    const nm = acTitleCase(m[1]) + " " + m[2].toUpperCase();
    return { id: nm.toLowerCase().replace(/ /g, "_"), name: nm, display: nm + " A/c", category: m[1].toLowerCase() === "input" ? "gst_input" : "gst_output" };
  }
  if ((m = /^loan from\s+(.+)$/i.exec(stripped))) { const nm = "Loan from " + acTitleCase(m[1]); return { id: "loan_from_" + acAccKey(m[1]).replace(/ /g, "_"), name: nm, display: nm + " A/c", category: "loan_liab" }; }
  if ((m = /^loan to\s+(.+)$/i.exec(stripped))) { const nm = "Loan to " + acTitleCase(m[1]); return { id: "loan_to_" + acAccKey(m[1]).replace(/ /g, "_"), name: nm, display: nm + " A/c", category: "loan_asset" }; }
  if ((m = /^profit on sale of\s+(.+)$/i.exec(stripped))) { const nm = "Profit on Sale of " + inner(m[1]); return { id: "profit_on_sale_of_" + acAccKey(m[1]).replace(/ /g, "_"), name: nm, display: nm + " A/c", category: "disposal_gain" }; }
  if ((m = /^loss on sale of\s+(.+)$/i.exec(stripped))) { const nm = "Loss on Sale of " + inner(m[1]); return { id: "loss_on_sale_of_" + acAccKey(m[1]).replace(/ /g, "_"), name: nm, display: nm + " A/c", category: "disposal_loss" }; }
  if (/^[a-z ]+ supplier\/creditor$/i.test(stripped)) { const nm = acTitleCase(stripped); return { id: acAccKey(nm).replace(/ /g, "_"), name: nm, display: nm + " A/c", category: "creditors" }; }
  // Anything else is a personal (party) account — identity is case-insensitive.
  const nm = acTitleCase(stripped);
  return { id: "party:" + key, name: nm, display: nm + " A/c", category: "personal" };
}
function acCanonAccount(name) { return acResolveAccount(name).display; }
function acAccountMeta(name) {
  const r = acResolveAccount(name);
  const cat = AC_CAT[r.category] || AC_CAT.personal;
  return { id: r.id, name: r.name, display: r.display, category: r.category, nature: cat.nature, normalBalance: cat.normal, statement: cat.stmt,
    finalAccountCategory: r.category };
}
const AC_GST_KEYS = ["inputCGST", "inputSGST", "inputIGST", "outputCGST", "outputSGST", "outputIGST"];

/* ---------- A2. STATE MODEL ---------- */
function acNewState() {
  return {
    lastDate: null, lastParty: null, lastChequeAmount: null,
    partyBalances: {}, gstBalances: { inputCGST: 0, inputSGST: 0, inputIGST: 0, outputCGST: 0, outputSGST: 0, outputIGST: 0 },
    cashBalance: 0, bankBalance: 0, assetBook: {},
    assets: {},          // asset register:  label → {label, cost, accDep, bookValue, method, rate, acquired[], depCharges[]}
    bills: [],           // bill register:   {type:'BR'|'BP', party, amount, status}
    loss: { gross: 0, claimAdmitted: 0, claimReceived: 0 },
    cheques: [],         // cheque register: {party, amount, status:'inHand'|'deposited'|'sent'|'collected'|'endorsed'|'dishonoured'}
    balances: {}         // accountId → signed running balance (Dr +, Cr −)
  };
}
// ctx objects handed in by callers (tutor-engine passes {}) are upgraded in place.
function acEnsureState(ctx) {
  const base = acNewState();
  Object.keys(base).forEach(k => { if (ctx[k] === undefined) ctx[k] = base[k]; });
  if (ctx.lastChequeAmount === undefined) ctx.lastChequeAmount = null;
  return ctx;
}
function acCloneState(st) { return JSON.parse(JSON.stringify(st)); }

/* ---------- B1. SEMANTIC TEXT TOOLS (shared by every interpreter) ---------- */

const AC_MONTH_IDX = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
const AC_DAYS_IN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// Vocabulary of "item words" — built from the SAME dictionaries the rule chain
// uses (AC_EXPENSE_WORDS / AC_INCOME_WORDS / AC_ASSET_WORDS), so there is one
// vocabulary, not two.
const AC_TERMS = {};
function acAddTerm(k, patch) { AC_TERMS[k] = Object.assign(AC_TERMS[k] || {}, patch); }
AC_EXPENSE_WORDS.forEach(([k, label]) => acAddTerm(k, { out: label }));
AC_INCOME_WORDS.forEach(([k, label]) => { if (!/ (received)$/.test(k)) acAddTerm(k, { inc: label }); });
AC_ASSET_WORDS.forEach(([k, label]) => acAddTerm(k, { asset: label }));
[["plant and machinery", "Machinery"], ["furniture and fixtures", "Furniture"], ["office furniture", "Furniture"], ["motor vehicle", "Vehicle"], ["computers", "Computer"]]
  .forEach(([k, label]) => acAddTerm(k, { asset: label }));
acAddTerm("interest", { out: "Interest Paid" });
["installation charges", "installation cost", "installation", "erection charges", "freight on machinery", "carriage on machinery", "brokerage", "registration charges", "stamp duty"].forEach(k => acAddTerm(k, { cap: true }));
acAddTerm("commission", {});
["goods", "stock", "inventory", "merchandise", "stock in trade"].forEach(k => acAddTerm(k, { goods: true }));
["cash", "bank"].forEach(k => acAddTerm(k, { money: k === "cash" ? "Cash" : "Bank" }));
acAddTerm("salaries", { out: "Salary" });
["advertising", "audit fees", "postage", "labour"].forEach(k => { if (!AC_TERMS[k]) acAddTerm(k, { out: k === "advertising" ? "Advertisement" : k === "audit fees" ? "Audit Fee" : k === "postage" ? "Postage & Courier" : "Wages" }); });
// "X received" income phrases are handled by the plain word + direction.
const AC_TERM_KEYS = Object.keys(AC_TERMS).sort((a, b) => b.length - a.length);
const AC_TERM_RE = new RegExp("\\b(" + AC_TERM_KEYS.map(k => k.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&").replace(/ /g, "\\s+")).join("|") + ")(?:s|es)?\\b", "gi");

function acDirection(text) {
  const introVerb = /\b(commenc\w*|start(?:ed|s|ing)?|open(?:ed|s|ing)?|began|begun|launch\w*|introduc\w*|brought in|invested|set up)\b/.test(text);
  const introCtx = /\b(business|capital|firm|operations?)\b/.test(text);
  const payVerb = /\b(paid|pay|paying|settled|cleared|remitted|incurred|spent|purchas\w*|bought|acquir\w*)\b/.test(text);
  const recVerb = /\b(received|receive|collected|earned|realis\w*|got)\b/.test(text);
  if (introVerb && introCtx && !payVerb && !recVerb) return "intro";
  if (payVerb && recVerb) return "mixed";
  if (payVerb) return "out";
  if (recVerb) return "in";
  return null;
}

// Payment mode: a SEPARATE role from the items being paid for.
function acPaymentMode(text) {
  const cash = /\b(?:in|by|through|for|with|from)\s+(?:the\s+|business\s+)?cash\b|\bpaid\s+cash\b|\bcash\s+(?:payment|purchase|sale)s?\b|\bcash\s*[.;]?\s*$/.test(text.trimEnd() + " ");
  const bank = /\b(?:by|through|via|from|with)\s+(?:the\s+|a\s+|business\s+|his\s+|our\s+)?(?:bank|cheque|chq|neft|rtgs|upi|online|bank transfer|demand draft)\b/.test(text) || (/\bcheque\b|\bchq\b/.test(text) && !/cheque\s+(?:received|deposited|dishonour)/.test(text));
  const credit = /\bon credit\b|\bcredit\s+(?:purchase|sale)\b|\bcredit\b/.test(text);
  const contradictory = /\bcash\b[\s\w]{0,12}\b(?:by|through|via)\s+(?:cheque|chq|bank)\b|\b(?:by|through|via)\s+cheque\b[\s\w]{0,12}\bin\s+cash\b/.test(text);
  return { cash, bank, credit, contradictory, mode: contradictory ? null : (cash && !bank) ? "cash" : (bank && !cash) ? "bank" : (cash && bank) ? "mixed" : credit ? "credit" : null };
}

function acStripAnchors(s) { return s.replace(/\s+/g, " ").trim(); }

// Party (person/firm) detection that never confuses vocabulary words ("Salaries", "Rent") with a name.
function acIsVocabWord(w) {
  const lw = w.toLowerCase();
  if (AC_STOPWORDS.has(w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) || acIsMonthWord(w)) return true;
  if (AC_REGISTRY[acAccKey(lw)] || AC_TERMS[lw] || AC_TERMS[lw.replace(/s$/, "")] || AC_TERMS[lw.replace(/(es)$/, "")]) return true;
  return /^(collected|reimbursed|remitted|cleared|realised|realized|acquired|endorsed|sent|cheques?|deposited|bounced|matured|retired|salaries|commission|repairs|purchase|sale|inventory|proprietor|owner|customer|supplier|debtor|creditor|the|on|of|to|from|by|apr|paid|received|sold|bought|charge|depreciation|gst|cgst|sgst|igst|bill|bills|noting|discount|business|firm|company|bank|cash|cheque|goods)$/.test(lw);
}
function acFindParty(original) {
  const cleaned = acStripDates(original).replace(/₹/g, " ").replace(/(?<=\d),(?=\d)/g, "");
  const tryRe = (re) => { const m = re.exec(cleaned); if (!m) return null; const w = m[1].split(/\s+/).filter(x => !acIsVocabWord(x)); return w.length ? w.join(" ") : null; };
  return tryRe(/\b(?:from|to|by|on|with|drawn by|drawn on|accepted by|of)\s+(?:Mr\.?\s+|Mrs\.?\s+|M\/s\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/) ||
    tryRe(/\b([A-Z][a-z]+)['’]s\s+(?:bill|account|cheque|balance|dues?)/) ||
    tryRe(/\b(?:Paid|Received|Settled|Pay|Cleared)\s+(?:the\s+|to\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/) ||
    tryRe(/\b([A-Z][a-z]+)\s+(?:immediately\s+|promptly\s+|then\s+|later\s+|now\s+|soon\s+)?(?:settled|paid|has paid|has settled|accepted|returned|allowed)\b/) ||
    tryRe(/\b(?:a\s+)?(?:debtor|creditor|customer|supplier),\s*([A-Z][a-z]+)\s*,/) ||
    tryRe(/\b([A-Z][a-z]+),?\s+(?:owing|who owed|whose|was declared|became|a debtor|declared|is insolvent|was insolvent)\b/) || null;
}

// Tag every amount with a role by the cue words sitting just before/after it in its own clause.
// roleDefs: [{ role, before: [RegExp], after: [RegExp] }]; first match wins.
function acTagAmounts(cx, roleDefs) {
  const s = cx.text;
  return cx.amounts.map((a, i) => {
    // clause bounds: nearest ; or . or — around the amount (commas are NOT clause bounds here, they separate list items).
    let cs = Math.max(s.lastIndexOf(";", a.index), s.lastIndexOf(". ", a.index), s.lastIndexOf(":", a.index));
    cs = cs < 0 ? 0 : cs + 1;
    const nextBounds = [s.indexOf(";", a.end), s.indexOf(". ", a.end)].filter(x => x >= 0);
    const ce = nextBounds.length ? Math.min(...nextBounds) : s.length;
    const before = s.slice(Math.max(cs, a.index - 60), a.index);
    const after = s.slice(a.end, Math.min(ce, a.end + 45));
    let role = null;
    for (const d of roleDefs) {
      if ((d.before || []).some(re => re.test(before)) || (d.after || []).some(re => re.test(after))) { role = d.role; break; }
    }
    return { ...a, i, role, before, after };
  });
}

// Split the sentence into one fragment per amount — the boundary between two
// consecutive amounts is the first list separator after the earlier amount / the
// last separator before the later one — then resolve the account each amount
// belongs to *within its own fragment* (nearest known item word, before or after).
// Never positional: amount k is not "the k-th account".
function acSeparatorsBetween(s, from, to) {
  const seg = s.slice(from, to);
  const seps = [];
  const re = /(?:(?<!\d),|,(?!\d)|;|\band\b|&|\bplus\b|\balong with\b|\bas well as\b)/g;
  let m;
  while ((m = re.exec(seg))) seps.push({ start: from + m.index, end: from + m.index + m[0].length });
  return seps;
}
function acParseItems(cx, allowed) {
  const s = cx.text, A = cx.amounts, items = [], unresolved = [];
  A.forEach((a, k) => {
    const prevEnd = k === 0 ? 0 : A[k - 1].end;
    const nextStart = k === A.length - 1 ? s.length : A[k + 1].index;
    const leftSeps = acSeparatorsBetween(s, prevEnd, a.index);
    const rightSeps = acSeparatorsBetween(s, a.end, nextStart);
    const L = (k === 0 || !leftSeps.length) ? (k === 0 ? 0 : prevEnd) : leftSeps[leftSeps.length - 1].end;
    const R = (k === A.length - 1 || !rightSeps.length) ? (k === A.length - 1 ? s.length : nextStart) : rightSeps[0].start;
    const pre = s.slice(L, a.index), post = s.slice(a.end, R);
    const find = (seg, base) => {
      const out = []; const re = new RegExp(AC_TERM_RE.source, "gi"); let m;
      while ((m = re.exec(seg))) {
        const key = m[1].toLowerCase().replace(/\s+/g, " ");
        const term = AC_TERMS[key] || AC_TERMS[key.replace(/(?:s|es)$/, "")];
        if (!term) continue;
        // a payment-mode word ("in cash", "by bank") is never an item in out/in direction
        const before = seg.slice(Math.max(0, m.index - 14), m.index);
        if (term.money && !allowed.money) continue;
        if (term.money && /\b(?:in|by|through|via|from|for)\s+(?:the\s+|business\s+)?$/.test(before) && allowed.money !== "force") continue;
        out.push({ key, term, at: base + m.index, len: m[0].length });
      }
      return out;
    };
    const preT = find(pre, L), postT = find(post, a.end);
    // items must be adjacent-ish: pre term within ~40 chars, post term within ~30 chars, no verb-clause between.
    const preC = preT.filter(t => (a.index - (t.at + t.len)) <= 40 && !/[.:]/.test(s.slice(t.at + t.len, a.index)));
    const postC = postT.filter(t => (t.at - a.end) <= 30);
    const distinct = new Set([...preC, ...postC].map(t => JSON.stringify(t.term)));
    if (distinct.size === 0) { unresolved.push({ amount: a.value, fragment: acStripAnchors(s.slice(L, R)), why: "no account word found for this amount" }); return; }
    if (distinct.size > 1) {
      // two different account words share one amount ("salary and rent ₹7,000") → cannot split
      unresolved.push({ amount: a.value, fragment: acStripAnchors(s.slice(L, R)), why: "more than one account word share this amount" }); return;
    }
    const pick = preC.length ? preC[preC.length - 1] : postC[0];
    const dPre = preC.length ? a.index - (preC[preC.length - 1].at + preC[preC.length - 1].len) : Infinity;
    const dPost = postC.length ? postC[0].at - a.end : Infinity;
    const chosen = dPre <= dPost ? preC[preC.length - 1] : postC[0];
    items.push({ amount: a.value, term: (chosen || pick).term, key: (chosen || pick).key, clause: acStripAnchors(s.slice(L, R)), amountIndex: a.index });
  });
  return { items, unresolved };
}

/* ---------- B2. GST CALCULATION (one helper for purchases, sales, returns, expenses) ---------- */
function acGstMentioned(cx) { return /\b(gst|cgst|sgst|igst)\b/.test(cx.text) && (acHeadRate(cx.text, "gst") || acHeadRate(cx.text, "cgst") || acHeadRate(cx.text, "sgst") || acHeadRate(cx.text, "igst")) > 0; }
function acHeadRate(t, head) {
  const h = head === "gst" ? "(?<![cis])gst" : head;
  let m = new RegExp("\\b" + h + "\\b\\s*(?:@|at|of|rate of|:)?\\s*(\\d+(?:\\.\\d+)?)\\s*%").exec(t);
  if (m) return parseFloat(m[1]);
  m = new RegExp("(\\d+(?:\\.\\d+)?)\\s*%\\s*(?:of\\s+)?" + h + "\\b").exec(t);
  return m ? parseFloat(m[1]) : 0;
}
function acGstCompute(cx, base, forPurchase) {
  const P = cx.percents, t = cx.text;
  const rate = k => acHeadRate(t, k) || 0;
  const cg = rate("cgst"), sg = rate("sgst"), ig = rate("igst"), g = rate("gst");
  const inclusive = /including gst|inclusive of (?:the )?gst|gst inclusive|incl\.?\s*gst|gst incl\.?|inclusive of (?:cgst|sgst|igst)|including (?:cgst|sgst|igst)|inclusive of tax|including tax/.test(t);
  const isIGST = /igst|inter-?state|outside the state|other state/.test(t);
  let heads = [];
  if (isIGST) { const r = ig || g; if (r) heads = [["IGST", r]]; }
  else if (cg || sg) heads = [["CGST", cg || sg], ["SGST", sg || cg]];
  else if (g) heads = [["CGST", acRound2(g / 2)], ["SGST", acRound2(g / 2)]];
  if (!heads.length) return { taxable: base, total: base, lines: [], rate: 0, inclusive, gst: false };
  const R = heads.reduce((s, h) => s + h[1], 0);
  const taxable = inclusive ? acRound2(base / (1 + R / 100)) : base;
  const lines = heads.map(([h, r]) => ({ head: h, rate: r, amount: acRound2(taxable * r / 100), account: (forPurchase ? "Input " : "Output ") + h + " A/c" }));
  const taxSum = lines.reduce((s, l) => s + l.amount, 0);
  if (inclusive) { const diff = acRound2(base - taxable - taxSum); if (Math.abs(diff) > 0 && Math.abs(diff) < 0.05) lines[lines.length - 1].amount = acRound2(lines[lines.length - 1].amount + diff); }
  const total = inclusive ? base : acRound2(taxable + lines.reduce((s, l) => s + l.amount, 0));
  return { taxable, total, lines, rate: R, inclusive, gst: true };
}

/* ---------- B3. LINE / EVENT HELPERS ---------- */
function acAddLine(lines, account, side, amount) {
  amount = acRound2(amount);
  if (!(amount > 0)) return;
  const canon = acCanonAccount(account);
  const ex = lines.find(l => l.account === canon && l[side] !== undefined);
  if (ex) ex[side] = acRound2(ex[side] + amount); else lines.push({ account: canon, [side]: amount });
}
function acSum(lines, side) { return acRound2(lines.reduce((s, l) => s + (l[side] || 0), 0)); }
function acBalancedLines(lines) { return Math.abs(acSum(lines, "dr") - acSum(lines, "cr")) < 0.01; }
function acCashBankAcc(pm) { return pm.mode === "bank" ? "Bank A/c" : "Cash A/c"; }

/* ---------- C1. STRUCTURED INTERPRETERS ----------
   Each takes the shared context `cx` and returns
     null                       → not my kind of sentence (next interpreter)
     { status, reason }         → recognised, but INVALID / UNCERTAIN / NO_ENTRY_REQUIRED
     { lines, narration, ... }  → a normalised accounting event
   They read committed state through cx.state (a staged clone) and never write it. */

function acMakeCx(original, state, date) {
  let text = " " + original.toLowerCase() + " ";
  text = text.replace(/\brs\.?\s*(?=[\d₹])/g, "₹").replace(/\binr\b/g, "₹");
  text = text.replace(/interest on (?:the |a |our )?(?:[a-z\-]+ ){0,3}?loan/g, "interest on loan");
  const cx = { original, text, date, state, amounts: acExtractAmounts(text), percents: acExtractPercents(text) };
  cx.party = acFindParty(original);
  cx.partyFromContext = false;
  if (!cx.party && state.lastParty && (/\b(her|his|their|him|them)\b/.test(text) || /full settlement|final settlement|\bsettled\b|in settlement/.test(text))) { cx.party = state.lastParty; cx.partyFromContext = true; }
  cx.pm = acPaymentMode(text);
  cx.dir = acDirection(text);
  return cx;
}
const acFmtR = n => "₹" + acFmt(n);
const AC_NUMW = { a: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };
const AC_NUMW_RE = "(?:\\d+(?:\\.\\d+)?|a|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)";
function acNum(w) { return AC_NUMW[w] !== undefined ? AC_NUMW[w] : parseFloat(w); }

function acFindContradiction(cx) {
  const t = cx.text;
  if (cx.pm.contradictory) return "The payment mode is contradictory (cash and cheque/bank are both named for the same payment). Please state one mode.";
  const clashing = t.split(/[;.]/).some(cl => !/\b(?:balance|remaining|rest|partly|part|and)\b/.test(cl) && /\bon credit\b/.test(cl) && /\b(?:for|in|by)\s+cash\b/.test(cl));
  if (clashing) return "The transaction is stated as both on credit and for cash — please state which it was.";
  const rec = /\breceived\s+₹\s*[\d,]+(?:\.\d+)?(?!\s*(?:as\s+)?(?:discount|rebate|interest|commission))/.exec(t), pay = /\bpaid\s+₹\s*[\d,]+/.exec(t);
  if (rec && pay && /\bbut\b|\bhowever\b/.test(t) && /settle/.test(t)) return "Money is described as both received and paid in the same settlement — the direction is contradictory. Please restate the transaction.";
  return null;
}

/* ---- I1. COMPOUND (multi-item) transactions ---- */
function acInterpCompound(cx) {
  const t = cx.text;
  if (cx.amounts.length < 2 || !cx.dir || cx.dir === "mixed") return null;
  if (/manager/.test(t)) return null;
  if (/\bon credit\b/.test(t) && (cx.pm.cash || cx.pm.bank)) return null;   // credit + immediate payment = split settlement, not a simple list
  if (/discount|\bgst\b|cgst|sgst|igst|%|\breturn|\bbalance\b|remaining|\brest\b|outstanding|unpaid|prepaid|in advance|\badvance\b|\bbills?\b|depreciat|\bloss\b|\blost\b|claim|provision|\bsold\b|\bsales?\b|accrued|dishonou?r|insolvent|bad debt|\bloans?\b|drawings|personal|settle|debtors?|creditors?|includes?|inclusive|relat(?:es|ing) to|\bof which\b|\bpartly\b|\bcheque\b.*\bdeposit/.test(t)) return null;
  if (cx.party && cx.dir !== "intro" && !(cx.pm.credit && cx.dir === "out")) return null;
  if (cx.pm.credit && cx.dir !== "out") return null;
  if (new Set(acTagAmounts(cx, AC_MODE_ROLES).filter(a => a.role).map(a => a.role)).size >= 2) return null;   // "₹20,000 cash, ₹40,000 by cheque" = split settlement, not a list of items
  const dir = cx.dir;
  const parsed = acParseItems(cx, { money: dir === "intro" });
  let { items, unresolved } = parsed;
  let statedCapital = null;
  if (dir === "intro") {
    const cap = unresolved.filter(u => /\bcapital\b/.test(u.fragment));
    if (cap.length) { statedCapital = cap[0].amount; unresolved = unresolved.filter(u => !cap.includes(u)); }
  }
  if (!items.length) return null;
  const hasGoodsPurchase = dir === "out" && items.some(i => i.term.goods);
  const resolved = [], bad = [];
  items.forEach(it => {
    let acct = null;
    if (dir === "intro") acct = it.term.money || (it.term.goods ? "Goods (Stock)" : it.term.asset || null);
    else if (dir === "out") {
      if (it.term.cap) {   // capital expenditure: cost of bringing the asset into use is added to that asset
        const assets = [...new Set(items.filter(x => x.term.asset).map(x => x.term.asset))];
        acct = assets.length === 1 ? assets[0] : null;
      } else acct = it.term.goods ? "Purchases" : it.term.asset || it.term.out || null;
      if (acct && /^(Cartage|Carriage|Freight)$/.test(acct) && hasGoodsPurchase) acct = "Carriage Inwards";
    } else if (dir === "in") acct = it.term.inc || null;
    if (!acct) bad.push({ amount: it.amount, fragment: it.clause, why: `"${it.key}" is not a valid account for this kind of transaction` });
    else resolved.push({ ...it, account: acct });
  });
  const problems = unresolved.concat(bad);
  if (problems.length) {
    return { status: "INVALID", reason: "This transaction contains multiple amounts, but the engine could not confidently determine which amount belongs to which account (" + problems.map(p => `${acFmtR(p.amount)}: ${p.why}`).join("; ") + ").", identified: resolved.map(r => ({ account: r.account, amount: r.amount })) };
  }
  if (cx.pm.contradictory) return { status: "INVALID", reason: acFindContradiction(cx) };
  if (dir !== "intro" && cx.pm.mode === "mixed") return { status: "UNCERTAIN", reason: "Both cash and bank/cheque are mentioned for a list of items — state which amount was paid by which mode." };
  const lines = [], components = [], assumptions = [];
  const total = acRound2(resolved.reduce((s, r) => s + r.amount, 0));
  let tag = "compound";
  if (dir === "intro") {
    resolved.forEach(r => { acAddLine(lines, r.account, "dr", r.amount); components.push({ account: r.account, side: "dr", amount: r.amount, role: "asset introduced", sourceClause: r.clause, confidence: 1 }); });
    acAddLine(lines, "Capital", "cr", total);
    components.push({ account: "Capital", side: "cr", amount: total, role: "capital", sourceClause: "", confidence: 1 });
    if (statedCapital !== null && Math.abs(statedCapital - total) > 0.01) return { status: "UNCERTAIN", reason: `The stated capital ${acFmtR(statedCapital)} does not equal the sum of the items introduced (${acFmtR(total)}).` };
    tag = "capital";
  } else {
    const settle = cx.pm.mode === "credit" ? (cx.party || "Creditors") : cx.pm.mode === "bank" ? "Bank" : "Cash";
    if (!cx.pm.mode) assumptions.push("No payment mode stated — cash assumed.");
    if (cx.pm.mode === "credit" && !cx.party) assumptions.push("Supplier not named — Creditors A/c used.");
    if (dir === "out") {
      resolved.forEach(r => { acAddLine(lines, r.account, "dr", r.amount); components.push({ account: r.account, side: "dr", amount: r.amount, role: "item", sourceClause: r.clause, confidence: 1 }); });
      acAddLine(lines, settle, "cr", total);
      components.push({ account: settle, side: "cr", amount: total, role: "settlement", sourceClause: "", confidence: 1 });
      tag = resolved.some(r => AC_REGISTRY[acAccKey(r.account)] && AC_REGISTRY[acAccKey(r.account)].category === "asset_fixed") ? "asset" : "expense";
    } else {
      acAddLine(lines, settle, "dr", total);
      components.push({ account: settle, side: "dr", amount: total, role: "settlement", sourceClause: "", confidence: 1 });
      resolved.forEach(r => { acAddLine(lines, r.account, "cr", r.amount); components.push({ account: r.account, side: "cr", amount: r.amount, role: "item", sourceClause: r.clause, confidence: 1 }); });
      tag = "income";
    }
  }
  return { lines, narration: cx.original, tag, components, assumptions, calcs: [{ kind: "sum", inputs: resolved.map(r => r.amount), result: total }], confidence: 0.95, interpreter: "compound", settlement: { mode: cx.pm.mode || (dir === "intro" ? null : "cash") } };
}

/* ---- I2. SETTLEMENT + DISCOUNT (both directions) ---- */
const AC_SETTLE_ROLES = [
  { role: "due", before: [/(?:settlement of|final settlement of|balance of|dues? of|account of|amount of|owed|owing|outstanding of|against|total of|payable of|amount due|was due|due was|dues were)\s*$/], after: [/^\s*(?:was |were )?(?:due|owed|outstanding|payable)\b/] },
  { role: "disc", before: [/(?:discount|rebate|deduction|allowance)(?: of| allowed| received| given)?\s*$/, /\b(?:allowed|allowing|availed|got)\s+(?:a\s+)?$/], after: [/^\s*(?:as\s+)?(?:cash\s+)?(?:discount|rebate|deduction|allowance)\b/] },
  { role: "cash", before: [/(?:paid|pay|received|remitted|payment of|cheque (?:for|of)|settled (?:by paying|with))\s+(?:(?:to|from)\s+)?(?:[a-z']+\s+){0,2}$/], after: [/^\s*(?:by|through|in|via)\s+(?:cash|cheque|chq|bank)/] }
];
function acInterpSettlement(cx) {
  const t = cx.text;
  if (!/full settlement|final settlement|full and final|in settlement|on settlement|settled (?:his|her|their|the)? ?account|settled\s+(?:[a-z]+['’]s\s+)(?:the\s+)?account|cleared (?:his|her|their|the)? ?account|settlement of/.test(t)) return null;
  if (cx.amounts.length < 2) return null;
  if (/\bbills?\b|provision|insolvent|bad debt|trade discount|\bgst\b|\bgoods\b.*\b(?:sold|purchas)/.test(t)) return null;
  const tagged = acTagAmounts(cx, AC_SETTLE_ROLES);
  const by = r => tagged.filter(x => x.role === r);
  let due = by("due")[0], disc = by("disc")[0], cashT = by("cash");
  const untagged = tagged.filter(x => !x.role);
  // direction
  let dir = null;
  const partySettledSelf = /^\s*[A-Z][a-z]+\s+(?:settled|paid|has paid|has settled)\b/.test(cx.original.replace(/^[^:]*:\s*/, ""));
  const tagDirs = cashT.map(c => /\b(?:received|collected|realis\w*)\b/.test(c.before) ? "in" : /\b(?:paid|pay|paying|remitted|cleared)\b/.test(c.before) ? "out" : null);
  if (new Set(tagDirs.filter(Boolean)).size > 1) return { status: "INVALID", reason: "Money is described as both received and paid in the same settlement — the direction is contradictory. Please restate the transaction." };
  if (partySettledSelf) dir = "in";                       // "Ram paid ₹9,000 …" — the party is the payer
  else if (tagDirs.some(Boolean)) dir = tagDirs.find(Boolean);
  else if (/\b(?:paid|pay|paying|remitted|cleared)\b/.test(t) && !/received[^.;]*\bfrom\b/.test(t)) dir = "out";
  else if (/^\s*(?:[a-z]+ \d{1,2}:\s*)?settled\b/.test(t) && !/\breceived\b/.test(t)) dir = "out";      // "Settled Mohan's account …" — the business is settling
  else if (/\breceived|collected|settled/.test(t)) dir = "in";
  // No payment verb at all ("A debtor owing ₹20,000 was allowed a discount … on settlement") — the
  // party's stated ROLE settles it: a debtor pays us, a creditor is paid by us.
  else if (/\bdebtor\b/.test(t) && !/\bcreditor\b/.test(t)) dir = "in";
  else if (/\bcreditor\b/.test(t) && !/\bdebtor\b/.test(t)) dir = "out";
  if (!dir) return null;
  let D = due ? due.value : null, C = cashT.length ? cashT[0].value : null, X = disc ? disc.value : null;
  const spare = untagged.map(u => u.value);
  if (D === null && C === null && spare.length >= 2) { D = Math.max(...spare); C = Math.min(...spare); }
  else if (D === null && C === null && X !== null && spare.length === 1) { D = spare[0]; }
  else if (D === null && spare.length === 1 && C !== null && X === null) { D = spare[0]; }
  else if (C === null && spare.length === 1 && D !== null && X === null) { C = spare[0]; }
  if (D === null && C !== null && X !== null) D = acRound2(C + X);
  if (C === null && D !== null && X !== null) C = acRound2(D - X);
  if (X === null && D !== null && C !== null) X = acRound2(D - C);
  if (D === null || C === null || X === null) return { status: "UNCERTAIN", reason: "Settlement — could not work out the balance due, the amount paid and the discount from the figures given. State at least two of them." };
  if (Math.abs(D - (C + X)) > 0.011) return { status: "INVALID", reason: `The settlement figures do not add up: ${acFmtR(C)} paid + ${acFmtR(X)} discount ≠ ${acFmtR(D)} due.` };
  if (X < 0 || C < 0 || D <= 0) return { status: "INVALID", reason: "The settlement amount is larger than the balance due, which is not a discount." };
  const party = cx.party;
  const pm = cx.pm; const money = pm.mode === "bank" ? "Bank" : "Cash";
  const lines = []; const assumptions = [];
  if (!pm.mode) assumptions.push("No payment mode stated — cash assumed.");
  if (!party) assumptions.push(dir === "out" ? "Party not named — Creditors A/c used." : "Party not named — Debtors A/c used.");
  const pAcc = party ? party : (dir === "out" ? "Creditors" : "Debtors");
  if (dir === "out") { acAddLine(lines, pAcc, "dr", D); acAddLine(lines, money, "cr", C); acAddLine(lines, "Discount Received", "cr", X); }
  else { acAddLine(lines, money, "dr", C); acAddLine(lines, "Discount Allowed", "dr", X); acAddLine(lines, pAcc, "cr", D); }
  return { lines, narration: cx.original + ` (${acFmtR(D)} due − ${acFmtR(C)} ${dir === "out" ? "paid" : "received"} = ${acFmtR(X)} discount ${dir === "out" ? "received" : "allowed"})`, tag: dir === "out" ? "creditor" : "debtor",
    party, assumptions, calcs: [{ kind: "settlement", original: D, payment: C, discount: X, inputs: [D, C, X], result: X }], confidence: 0.95, interpreter: "settlement",
    components: lines.map(l => ({ account: l.account, side: l.dr !== undefined ? "dr" : "cr", amount: l.dr !== undefined ? l.dr : l.cr, role: "settlement", sourceClause: "", confidence: 1 })) };
}

/* ---- I3. DEPRECIATION (asset register aware) ---- */
const AC_DEP_ROLES = [
  { role: "dep", before: [/depreciation\s+(?:amount|expense|charge|charged|for the (?:month|year|period))?\s*(?:is|was|of|amounting to|amounted to|at|for|as|:|=|being)\s*$/, /depreciation\s+(?:amount|expense)\s*$/, /depreciation\s+(?:charged\s+)?(?:on|of|for)\s+(?:the\s+)?[a-z& ]{1,25}?\s+(?:amount(?:ing|ed)?\s+(?:to)?|is|was|being)\s*$/], after: [/^\s*(?:as|towards|being)\s+depreciation/] },
  { role: "cost", before: [/(?:cost(?:ing)?|purchased (?:for|at)|bought (?:for|at)|acquired (?:for|at)|worth|valued at|valued|value of|original cost of|book value of|written down value of|wdv of|stands at|costs?)\s*(?:of|is|was|at)?\s*$/], after: [/^\s*(?:as\s+)?(?:original cost|cost|book value)\b/] }
];
function acAssetLabelsIn(t) {
  const out = []; const re = new RegExp(AC_TERM_RE.source, "gi"); let m;
  while ((m = re.exec(t))) { const key = m[1].toLowerCase().replace(/\s+/g, " "); const term = AC_TERMS[key] || AC_TERMS[key.replace(/(?:s|es)$/, "")]; if (term && term.asset && !out.includes(term.asset)) out.push(term.asset); }
  return out;
}
function acParsePeriod(t) {
  let m;
  if ((m = new RegExp("(" + AC_NUMW_RE + ")\\s*[- ]?\\s*months?\\b").exec(t))) { const n = acNum(m[1]); return { years: n / 12, months: n, label: n + " month" + (n === 1 ? "" : "s"), explicit: true }; }
  if (/\bhalf[- ]?year(?:ly)?\b|six[- ]month/.test(t)) return { years: 0.5, months: 6, label: "6 months", explicit: true };
  if (/\bquarter(?:ly)?\b/.test(t)) return { years: 0.25, months: 3, label: "3 months", explicit: true };
  if ((m = /\b(?:year|yr)\s*(\d+)\b|\b(second|third|fourth|fifth|2nd|3rd|4th|5th)\s+year\b/.exec(t))) {
    const map = { second: 2, third: 3, fourth: 4, fifth: 5, "2nd": 2, "3rd": 3, "4th": 4, "5th": 5 };
    const idx = m[1] ? parseInt(m[1], 10) : map[m[2]];
    return { years: 1, yearIndex: idx, label: "year " + idx, explicit: true };
  }
  if ((m = new RegExp("(" + AC_NUMW_RE + ")\\s*[- ]?\\s*years?\\b").exec(t))) { const n = acNum(m[1]); return { years: n, label: n + " year" + (n === 1 ? "" : "s"), explicit: true }; }
  if (/\bfor the year\b|\bannual(?:ly)?\b|\bfull year\b|\bfor a year\b|\bper annum\b|\bp\.?\s?a\.?\b/.test(t)) return { years: 1, label: "1 year", explicit: false };
  return null;
}
function acMonthsFromDate(dateStr) {
  // "July 1" → months of use up to 31 March (Indian financial year).
  const m = /^([A-Za-z]+)\s+(\d{1,2})/.exec(dateStr || ""); if (!m) return null;
  const mi = AC_MONTH_IDX[m[1].slice(0, 3).toLowerCase()]; if (mi === undefined) return null;
  const fiscal = (mi + 9) % 12; const day = parseInt(m[2], 10), dim = AC_DAYS_IN[mi];
  return acRound2(12 - fiscal - (day - 1) / dim);
}
function acPurchaseDateIn(original) {
  const re = new RegExp("(?:purchased|bought|acquired|installed|commissioned|put to use)[^.;]*?\\b(?:on|from|w\\.e\\.f\\.?)\\s+(" + AC_DATE_RE.source + ")", "i");
  const m = re.exec(original); return m ? acNormalizeDate(m[1]) : null;
}
function acInterpDepreciation(cx) {
  const t = cx.text;
  if (!/\bdepreciat\w*/.test(t)) return null;
  if (/\b(?:sold|sale of|disposed|discarded|scrapped)\b/.test(t)) return null;
  if (/\bprovision for depreciation\b/.test(t)) return null;
  const labels = acAssetLabelsIn(t);
  const reg = cx.state.assets;
  let label = labels.length === 1 ? labels[0] : null;
  const assumptions = [], warnings = [];
  if (!label && labels.length > 1) return { status: "UNCERTAIN", reason: "Depreciation names more than one asset (" + labels.join(", ") + ") — give one depreciation entry per asset." };
  if (!label) {
    const known = Object.keys(reg);
    if (known.length === 1) { label = known[0]; assumptions.push(`Asset not named — the only recorded asset (${label}) was used.`); }
    else return { status: "UNCERTAIN", reason: known.length ? "Depreciation — which asset? Several assets are recorded (" + known.join(", ") + "); name the one being depreciated." : "Depreciation — no asset is named and none has been recorded yet." };
  }
  // rate
  let rate = 0;
  const rp = cx.percents.find(p => /depreciat|p\.?a\.?|per annum|annum|wdv|slm|written|straight|rate|@/.test(p.window));
  if (rp) rate = rp.value; else if (cx.percents.length === 1) rate = cx.percents[0].value;
  const wdv = /written down|wdv|diminishing|reducing balance/.test(t);
  const slm = /straight[- ]line|\bslm\b|fixed instal|original cost/.test(t);
  if (wdv && slm) return { status: "INVALID", reason: "Both straight-line and written-down-value methods are named — depreciation method is contradictory." };
  const method = wdv ? "WDV" : "SLM";
  const tagged = acTagAmounts(cx, AC_DEP_ROLES);
  const depTagged = tagged.filter(x => x.role === "dep"), costTagged = tagged.filter(x => x.role === "cost"), plain = tagged.filter(x => !x.role);
  if (depTagged.length > 1) return { status: "INVALID", reason: "More than one depreciation amount is stated — contradictory." };
  const calcs = []; let amount = null, note = "";
  const asset = reg[label];
  const period = acParsePeriod(t);
  if (depTagged.length || (!rate && plain.length === 1 && !costTagged.length)) {
    amount = depTagged.length ? depTagged[0].value : plain[0].value;
    note = ` (depreciation stated directly as ${acFmtR(amount)}${rate ? "; the rate was not applied" : ""})`;
    calcs.push({ kind: "depreciation", asset: label, explicit: true, inputs: [amount], result: amount, formula: "explicit amount" });
  } else {
    if (!rate) return { status: "UNCERTAIN", reason: "Depreciation — state either the depreciation amount or the rate (%)." };
    if (plain.length + costTagged.length > 1) return { status: "UNCERTAIN", reason: "Depreciation — more than one amount is given and it is unclear which is the asset cost and which (if any) is the depreciation." };
    let base = costTagged.length ? costTagged[0].value : plain.length ? plain[0].value : null;
    let yrs = period ? period.years : 1;
    let plabel = period ? period.label : "1 year";
    let periodAssumption = !period;
    if (base === null) {
      if (!asset || !(asset.cost > 0)) return { status: "UNCERTAIN", reason: `Depreciation on ${label} at ${rate}% — the cost of ${label} is not known. State its cost, or record its purchase/opening balance first.` };
      base = method === "WDV" ? asset.bookValue : asset.cost;
      if (method === "WDV" && !(base > 0)) return { status: "INVALID", reason: `${label} has no remaining book value to depreciate.` };
    } else if (asset && asset.cost > 0 && Math.abs(base - (method === "WDV" ? asset.bookValue : asset.cost)) > 0.01) {
      warnings.push(`Stated base ${acFmtR(base)} differs from the recorded ${method === "WDV" ? "book value" : "cost"} of ${label} (${acFmtR(method === "WDV" ? asset.bookValue : asset.cost)}); the stated figure was used.`);
    }
    // part-year from purchase date (sentence or register)
    if (!period || !period.explicit) {
      const pd = acPurchaseDateIn(cx.original) || (asset && asset.acquired && asset.acquired.length ? asset.acquired[asset.acquired.length - 1] : null);
      const pdInSentence = !!acPurchaseDateIn(cx.original);
      if (pd && (pdInSentence || /year[- ]?end|31(?:st)? march|for the year|financial year|annual/.test(t))) {
        const mo = acMonthsFromDate(pd);
        if (mo !== null && mo < 12) { yrs = mo / 12; plabel = `${acRound2(mo)} months (${pd} to 31 March)`; periodAssumption = false; assumptions.push(`Part-year depreciation from the purchase date (${pd}) to the year end (31 March).`); }
      }
    }
    if (periodAssumption) assumptions.push("No period stated — a full year's depreciation was charged.");
    let factor = yrs, formula;
    if (method === "SLM") { amount = acRound2(base * rate / 100 * yrs); formula = `${acFmtR(base)} × ${rate}% × ${plabel}`; }
    else {
      if (period && period.yearIndex > 1 && !(asset && asset.accDep > 0)) { base = acRound2(base * Math.pow(1 - rate / 100, period.yearIndex - 1)); formula = `opening book value of year ${period.yearIndex} = ${acFmtR(base)}; × ${rate}%`; amount = acRound2(base * rate / 100); }
      else if (yrs > 1 && Number.isInteger(yrs)) { amount = acRound2(base * (1 - Math.pow(1 - rate / 100, yrs))); formula = `${acFmtR(base)} × (1 − (1 − ${rate}%)^${yrs})`; }
      else { amount = acRound2(base * rate / 100 * yrs); formula = `${acFmtR(base)} × ${rate}%` + (yrs !== 1 ? ` × ${plabel}` : ""); }
    }
    note = ` (${formula} = ${acFmtR(amount)}${method === "WDV" ? ", WDV" : ", SLM"})`;
    calcs.push({ kind: "depreciation", asset: label, base, rate, method, period: plabel, formula, inputs: [base], result: amount });
  }
  if (!(amount > 0)) return { status: "INVALID", reason: "The depreciation amount works out to zero." };
  if (asset && asset.bookValue > 0 && amount > asset.bookValue + 0.01) return { status: "INVALID", reason: `Depreciation ${acFmtR(amount)} is more than the recorded book value of ${label} (${acFmtR(asset.bookValue)}).` };
  if (!asset) warnings.push(`No earlier purchase or opening balance of ${label} is recorded in this run.`);
  const lines = []; acAddLine(lines, "Depreciation", "dr", amount); acAddLine(lines, label, "cr", amount);
  return { lines, narration: cx.original + note, tag: "adjustment", assumptions, warnings, calcs, confidence: 0.95, interpreter: "depreciation",
    stateOps: { dep: { label, amount, method, rate } },
    components: [{ account: "Depreciation", side: "dr", amount, role: "depreciation", sourceClause: "", confidence: 1 }, { account: label, side: "cr", amount, role: "asset", sourceClause: "", confidence: 1 }] };
}

/* ---- I4. ASSET DISPOSAL (cost / accumulated depreciation / book value / sale / profit-loss) ---- */
const AC_DISP_ROLES = [
  { role: "loss", before: [/(?:loss|loss on (?:the )?sale|at a loss of|loss (?:of|was|is|amounting to))\s*(?:of|was|is|amounting to)?\s*$/] },
  { role: "profit", before: [/(?:profit|gain|profit on (?:the )?sale|at a profit of|profit (?:of|was|is|amounting to))\s*(?:of|was|is|amounting to)?\s*$/] },
  { role: "accdep", before: [/(?:accumulated depreciation|depreciation(?: charged| provided| written off)?(?: so far| till date| to date| till now)?)(?:\s+(?:of|was|is|amounting to))?\s*$/] },
  { role: "book", before: [/(?:book value|carrying (?:value|amount)|written down value|wdv)(?:\s+(?:of|was|is|stood at))?\s*$/], after: [/^\s*(?:was |is )?(?:the )?book value/] },
  { role: "cost", before: [/(?:original cost|cost(?:ing)?|purchased (?:for|at)|bought (?:for|at)|acquired (?:for|at))(?:\s+(?:of|was|is))?\s*$/] },
  { role: "sale", before: [/(?:sold(?:\s+[\w']+){0,4}?\s+(?:for|at)|sale (?:price|proceeds|value|consideration)(?:\s+(?:is|was|of))?|realis(?:ed|ing)|for a (?:sum|consideration) of|fetched|received)\s*$/] }
];
function acInterpDisposal(cx) {
  const t = cx.text;
  if (!/\b(?:sold|sale of|disposed of|discarded)\b/.test(t)) return null;
  const labels = acAssetLabelsIn(t.replace(/\bgoods\b.*?\b(?:sold)\b/, " "));
  if (!labels.length || /\bgoods\b.*\bsold\b|\bsold\b.*\bgoods\b/.test(t)) return null;
  if (labels.length > 1) return { status: "UNCERTAIN", reason: "Sale names more than one asset (" + labels.join(", ") + ") — enter one disposal per asset." };
  const label = labels[0];
  const tagged = acTagAmounts(cx, AC_DISP_ROLES);
  const get = r => { const x = tagged.filter(a => a.role === r); return x.length ? x[0].value : null; };
  if (["loss", "profit", "accdep", "book", "cost", "sale"].some(r => tagged.filter(a => a.role === r).length > 1)) return { status: "INVALID", reason: "The same figure (cost / sale price / book value …) is stated more than once with different values." };
  let C = get("cost"), D = get("accdep"), B = get("book"), S = get("sale"), L = get("loss"), P = get("profit");
  const plain = tagged.filter(a => !a.role).map(a => a.value);
  if (S === null && plain.length && (L !== null || P !== null || B !== null || C !== null)) { /* a stray plain amount after a role-tagged one */ }
  if (S === null && B === null && C === null && plain.length === 1 && L === null && P === null) S = plain[0];
  else if (S === null && plain.length >= 1 && B === null && L === null && P === null && C === null) { S = plain[plain.length - 1]; B = plain.length > 1 ? plain[0] : null; }
  else if (S === null && plain.length === 1 && (B !== null || L !== null || P !== null)) S = L !== null || P !== null ? (B !== null ? null : plain[0]) : plain[0];
  const reg = cx.state.assets[label];
  const calcs = []; let changed = true, guard = 0;
  if (C !== null && D !== null && B === null) B = acRound2(C - D);
  if (B === null && reg && reg.cost > 0 && C === null && D === null && (S !== null || L !== null || P !== null)) { B = acRound2(reg.bookValue); }
  while (changed && guard++ < 6) {
    changed = false;
    if (B === null && C !== null && D !== null) { B = acRound2(C - D); changed = true; }
    if (D === null && C !== null && B !== null) { D = acRound2(C - B); changed = true; }
    if (C === null && D !== null && B !== null) { C = acRound2(D + B); changed = true; }
    if (S !== null && B !== null && L === null && P === null) { const d = acRound2(S - B); if (d >= 0) P = d; else L = -d; changed = true; }
    if (S === null && B !== null && (L !== null || P !== null)) { S = acRound2(B + (P || 0) - (L || 0)); changed = true; }
    if (B === null && S !== null && (L !== null || P !== null)) { B = acRound2(S - (P || 0) + (L || 0)); changed = true; }
  }
  if (S === null || B === null) return { status: "UNCERTAIN", reason: `Sale of ${label} — the sale price and the book value (or cost and accumulated depreciation) are needed to compute the profit/loss; state them or record the asset first.` };
  const pl = acRound2(S - B);
  if ((P !== null && Math.abs(P - Math.max(pl, 0)) > 0.011) || (L !== null && Math.abs(L - Math.max(-pl, 0)) > 0.011)) return { status: "INVALID", reason: `The figures are inconsistent: sale ${acFmtR(S)} against book value ${acFmtR(B)} gives a ${pl >= 0 ? "profit" : "loss"} of ${acFmtR(Math.abs(pl))}, not what the sentence states.` };
  const pm = cx.pm; const party = cx.party;
  const proceedsAcc = (pm.credit && party) ? party : pm.mode === "bank" ? "Bank" : (pm.credit ? "Debtors" : "Cash");
  const assumptions = []; if (!pm.mode) assumptions.push("No payment mode stated — cash assumed.");
  const lines = [];
  acAddLine(lines, proceedsAcc, "dr", S);
  const useAccDep = C !== null && D !== null && D > 0 && get("cost") !== null && get("accdep") !== null;
  if (useAccDep) { acAddLine(lines, "Accumulated Depreciation", "dr", D); acAddLine(lines, label, "cr", C); }
  else acAddLine(lines, label, "cr", B);
  if (pl > 0) acAddLine(lines, "Profit on Sale of " + label, "cr", pl);
  else if (pl < 0) acAddLine(lines, "Loss on Sale of " + label, "dr", -pl);
  if (!acBalancedLines(lines)) return { status: "INVALID", reason: "The disposal figures do not balance." };
  calcs.push({ kind: "disposal", asset: label, cost: C, accDep: D, bookValue: B, sale: S, profitLoss: pl, inputs: [C, D, B, S, L, P].filter(x => x !== null), result: pl });
  const warnings = [];
  if (reg && reg.bookValue > 0 && Math.abs(reg.bookValue - B) > 0.01 && reg.bookValue < B - 0.01) warnings.push(`Stated book value ${acFmtR(B)} is higher than the recorded book value of ${label} (${acFmtR(reg.bookValue)}).`);
  return { lines, narration: cx.original + ` (book value ${acFmtR(B)}${C !== null && D !== null ? " = cost " + acFmtR(C) + " − accumulated depreciation " + acFmtR(D) : ""}; sale ${acFmtR(S)} → ${pl >= 0 ? "profit" : "loss"} ${acFmtR(Math.abs(pl))})`, tag: "asset", assumptions, warnings, calcs, confidence: 0.95, interpreter: "disposal",
    stateOps: { dispose: { label, cost: useAccDep ? C : null, accDep: useAccDep ? D : null, book: B } },
    components: lines.map(l => ({ account: l.account, side: l.dr !== undefined ? "dr" : "cr", amount: l.dr !== undefined ? l.dr : l.cr, role: "disposal", sourceClause: "", confidence: 1 })) };
}

/* ---- I4b. CHEQUE LIFECYCLE (received → in hand → deposited / sent for collection / endorsed → dishonoured) ---- */
function acLastCheque(state, party, statuses) {
  for (let i = state.cheques.length - 1; i >= 0; i--) { const c = state.cheques[i]; if ((!party || (c.party || "").toLowerCase() === party.toLowerCase()) && (!statuses || statuses.includes(c.status))) return c; }
  return null;
}
function acInterpCheque(cx) {
  const t = cx.text;
  if (!/\bcheques?\b|\bchq\b/.test(t)) return null;
  const isDis = acIsDishonourEvent(t), isEnd = /endors/.test(t), isSend = /sent[^.;]*cheque[^.;]*collection|cheque[^.;]*sent[^.;]*collection|sent[^.;]*for collection/.test(t) && !/collected/.test(t), isColl = /collected|cleared by the bank|realised/.test(t) && /collection|bank/.test(t) && !isSend;
  if (!(isDis || isEnd || isSend || isColl) || /\bbills?\b/.test(t)) return null;
  const st = cx.state, plain = cx.amounts.map(a => a.value);
  if (plain.length > 1) return null;
  let party = cx.party;
  let ch = null;
  const want = isDis ? ["inHand", "deposited", "sent"] : isEnd ? ["inHand"] : isSend ? ["inHand"] : ["sent"];
  ch = acLastCheque(st, party, want) || (!party ? acLastCheque(st, null, want) : null);
  const amt = plain.length ? plain[0] : (ch ? ch.amount : null);
  if (amt === null) return { status: "UNCERTAIN", reason: "Which cheque? No amount is stated and no earlier cheque is recorded in this run." };
  if (plain.length && ch && Math.abs(ch.amount - amt) > 0.011) return null;   // a different cheque from the recorded one → let the rule chain read the sentence
  if (!ch && plain.length) return null;                                         // nothing recorded → the original rule chain's single-line reading
  party = party || ch.party;
  const lines = [], assumptions = [];
  if (plain.length === 0) assumptions.push(`Cheque of ${acFmtR(amt)}${ch && ch.party ? " from " + ch.party : ""} taken from the cheque register.`);
  if (isDis) {
    const cr = ch.status === "deposited" ? "Bank" : ch.status === "sent" ? "Cheques Sent for Collection" : "Cheques in Hand";
    acAddLine(lines, party || "Debtors", "dr", amt); acAddLine(lines, cr, "cr", amt);
    return { lines, narration: cx.original, tag: "debtor", party, assumptions, cheque: { op: "dishonour", ref: ch, amount: amt }, confidence: 0.9, interpreter: "cheque", calcs: [], components: acLegacyAccountToComponents(lines) };
  }
  if (isEnd) {
    const m = /(?:to|in favour of)\s+([A-Z][a-z]+)/.exec(cx.original); const to = m && !acIsVocabWord(m[1]) ? m[1] : null;
    if (!to) return { status: "UNCERTAIN", reason: "Cheque endorsed — to whom? Name the person it was endorsed to." };
    acAddLine(lines, to, "dr", amt); acAddLine(lines, "Cheques in Hand", "cr", amt);
    return { lines, narration: cx.original, tag: "creditor", party: to, assumptions, cheque: { op: "endorse", ref: ch, amount: amt }, confidence: 0.9, interpreter: "cheque", calcs: [], components: acLegacyAccountToComponents(lines) };
  }
  if (isSend) { acAddLine(lines, "Cheques Sent for Collection", "dr", amt); acAddLine(lines, "Cheques in Hand", "cr", amt); return { lines, narration: cx.original, tag: "contra", assumptions, cheque: { op: "send", ref: ch, amount: amt }, confidence: 0.9, interpreter: "cheque", calcs: [], components: acLegacyAccountToComponents(lines) }; }
  acAddLine(lines, "Bank", "dr", amt); acAddLine(lines, "Cheques Sent for Collection", "cr", amt);
  return { lines, narration: cx.original, tag: "contra", assumptions, cheque: { op: "collect", ref: ch, amount: amt }, confidence: 0.9, interpreter: "cheque", calcs: [], components: acLegacyAccountToComponents(lines) };
}

/* ---- I5. BILLS OF EXCHANGE — natural wording, lifecycle-aware ---- */
const AC_BILL_ROLES = [
  { role: "interest", before: [/interest(?:\s+(?:of|amounting to|was|is))?\s*$/], after: [/^\s*(?:as\s+)?interest\b/] },
  { role: "noting", before: [/noting\s+charges?(?:\s+(?:of|amounting to|were|was|is))?\s*$/], after: [/^\s*(?:as\s+)?noting\s+charges?/] },
  { role: "newbill", before: [/new\s+bill\s+(?:of|for)\s*$/] },
  { role: "proceeds", before: [/(?:received|net proceeds|proceeds of|discounted (?:for|at)|credited)\s*$/], after: [/^\s*(?:as\s+)?(?:net\s+)?proceeds/] },
  { role: "discchg", before: [/discount(?:ing)?\s+(?:charges?|of)\s*$/, /discount\s+charged\s*$/] },
  { role: "bill", before: [/bills?\s+(?:of|for)\s*$/, /(?:of|for)\s+(?:the\s+)?bill\s+(?:of|for)?\s*$/] }
];
function acLastBill(state, type, party, statuses) {
  for (let i = state.bills.length - 1; i >= 0; i--) {
    const b = state.bills[i];
    if ((!type || b.type === type) && (!party || (b.party || "").toLowerCase() === party.toLowerCase()) && (!statuses || statuses.includes(b.status))) return b;
  }
  return null;
}
function acIsDishonourEvent(t) { return /\b(?:was|were|has been|have been|got|stands?)\s+dishonou?red\b|dishonou?red\s+(?:on|at)\s+maturity|\bbounced\b|\b(?:not|never)\s+honou?red\b/.test(t); }
function acInterpBills(cx) {
  const t = cx.text;
  if (!/\bbills?\b|\bhundi\b|\bnoting charges\b/.test(t)) return null;
  if (/\bpurchas|\bbought\b|\bsold\b|\bsales?\b|\bgoods\b|\bfurniture\b/.test(t) && !/dishonou?r|renew|discount/.test(t)) return null; // goods + bill: split-settlement / legacy
  const st = cx.state, party = cx.party;
  const tagged = acTagAmounts(cx, AC_BILL_ROLES);
  const get = r => { const x = tagged.filter(a => a.role === r); return x.length ? x[0].value : null; };
  const plain = tagged.filter(a => !a.role).map(a => a.value);
  const pm = cx.pm, money = pm.mode === "bank" ? "Bank" : "Cash";
  const assumptions = [], warnings = [];
  const mk = (lines, tag, extra) => Object.assign({ lines, narration: cx.original, tag, assumptions, warnings, confidence: 0.9, interpreter: "bills", calcs: [], components: lines.map(l => ({ account: l.account, side: l.dr !== undefined ? "dr" : "cr", amount: l.dr !== undefined ? l.dr : l.cr, role: "bill", sourceClause: "", confidence: 1 })) }, extra || {});
  const isReceivable = /receivable|\bdrew\b|drawn (?:on|upon)|which (?:he|she|they) accepted|[a-z]+['’]s bill|(?:his|her|their) bill|\bdebtor|customer/.test(t) && !/payable|drawn by|our (?:bill|acceptance)/.test(t);
  const isPayable = /payable|drawn by|our (?:bill|acceptance)|\bcreditor|supplier|accepted (?:a |the )?bill/.test(t) && !/receivable|which (?:he|she|they) accepted|customer|debtor/.test(t);

  if (/renewal charges/.test(t)) return null;   // an ordinary expense, not the renewal of a bill
  if (/commenced|started business|business (was )?(started|commenced|opened|launched)|introduced.*capital|capital introduced/i.test(t)) return null;   // "…and bills receivable ₹10,000" is an ASSET BRING-IN, not a bill event
  const groupParty = (type) => { assumptions.push(`Party not named — ${type === "BP" ? "Creditors" : "Debtors"} A/c used.`); return type === "BP" ? "Creditors" : "Debtors"; };

  // --- endorsement of a (debtor's) bill to a creditor, in settlement of a different balance ---
  // ("A debtor's bill for ₹10,000 previously received was endorsed to a creditor, Suresh, in
  // full settlement of his ₹10,500 account.") — the difference between the bill's face value and
  // the balance it settles is discount received; no "Bills Receivable A/c" wording is required.
  if (/endors/.test(t) && !/renew/.test(t)) {
    const endTagged = acTagAmounts(cx, [
      { role: "bill", before: [/bills?\s+(?:of|for)\s*$/, /(?:of|for)\s+(?:the\s+)?bill\s+(?:of|for)?\s*$/] },
      { role: "settleAmt", before: [/(?:in\s+)?(?:full\s+)?settlement\s+of\s+(?:his|her|their|the)?\s*$/, /\baccount\s+of\s*$/] }
    ]);
    let B = (endTagged.find(x => x.role === "bill") || {}).value ?? null;
    let D = (endTagged.find(x => x.role === "settleAmt") || {}).value ?? null;
    const plainEnd = endTagged.filter(x => !x.role).map(x => x.value);
    if (B === null && plainEnd.length) B = plainEnd[0];
    if (D === null && plainEnd.length > 1) D = plainEnd[1];
    if (B === null || D === null) return { status: "UNCERTAIN", reason: "Bill endorsement — the bill's face value and the balance it settles are both needed to work out the discount." };
    const toParty = party || groupParty("BP");
    const disc = acRound2(D - B);
    if (disc < -0.01) return { status: "INVALID", reason: `The bill (${acFmtR(B)}) is larger than the balance it is said to settle (${acFmtR(D)}).` };
    const lines = []; acAddLine(lines, toParty, "dr", D); acAddLine(lines, "Bills Receivable", "cr", B);
    if (disc > 0.004) acAddLine(lines, "Discount Received", "cr", disc);
    return mk(lines, "bill", { party: toParty, bill: { op: "settle", type: "BR", party: null, amount: B }, calcs: [{ kind: "bill endorsement", inputs: [B, D], result: disc }] });
  }
  // --- renewal ---
  if (/\brenew/.test(t)) {
    const type = isPayable ? "BP" : isReceivable ? "BR" : (party && (acLastBill(st, null, party, ["open", "dishonoured"]) || {}).type) || null;
    if (!type) return { status: "UNCERTAIN", reason: "Renewal of a bill — could not tell whether it is a bill receivable or a bill payable, or whose bill it is." };
    let X = get("bill"), i = get("interest");
    if (X === null && i !== null && plain.length === 1) X = plain[0];
    if (X === null && i === null && plain.length >= 2) { X = Math.max(...plain); i = Math.min(...plain); }
    if (X === null && i !== null) { const b = acLastBill(st, type, party, ["open", "dishonoured"]); if (b) { X = b.amount; assumptions.push(`Old bill amount ${acFmtR(X)} taken from the recorded bill${b.party ? " of " + b.party : ""}.`); } }
    if (X === null) return { status: "UNCERTAIN", reason: "Renewal of a bill — the amount of the old bill is not stated and no earlier bill is recorded." };
    if (i === null) return { status: "UNCERTAIN", reason: "Renewal of a bill — state the interest (or say there is none) so the new bill's amount can be worked out." };
    const paidNow = pm.mode && /interest[^.;]{0,30}\b(?:paid|received)\b|\b(?:paid|received)\b[^.;]{0,30}interest/.test(t);
    const lines = [];
    if (type === "BR") {
      if (paidNow) return { status: "UNCERTAIN", reason: "Interest settled in cash on renewal — please post the renewal and the interest receipt as separate lines." };
      acAddLine(lines, "Bills Receivable", "dr", acRound2(X + i)); acAddLine(lines, "Bills Receivable", "cr", X); acAddLine(lines, "Interest Received", "cr", i);
    } else {
      acAddLine(lines, "Bills Payable", "dr", X); acAddLine(lines, "Interest Paid", "dr", i); acAddLine(lines, "Bills Payable", "cr", acRound2(X + i));
    }
    assumptions.push(`Old bill of ${acFmtR(X)} cancelled; new bill drawn for ${acFmtR(X)} + interest ${acFmtR(i)} = ${acFmtR(X + i)}.`);
    return mk(lines, "bill", { narration: cx.original + ` (old bill ${acFmtR(X)} cancelled; new bill ${acFmtR(X + i)} incl. interest ${acFmtR(i)})`, party, bill: { op: "renew", type, party: party || (acLastBill(st, type, null, ["open", "dishonoured"]) || {}).party || null, amount: X, newAmount: acRound2(X + i) }, calcs: [{ kind: "renewal", inputs: [X, i], result: acRound2(X + i) }] });
  }
  // --- dishonour / noting charges ---
  if (acIsDishonourEvent(t) || /noting charges/.test(t)) {
    const noting = get("noting");
    let bill = get("bill");
    if (bill === null && plain.length) bill = plain[0];
    if (noting === null && /noting charges/.test(t) && plain.length === 1 && bill === plain[0] && !/dishonou?red[^.;]*bill of|bill of/.test(t)) { noting = bill; bill = null; }
    const dishonourVerb = /\bwas dishonou?red\b|\bdishonou?red\b(?! bill)|\bbounced\b|\bnot honou?red\b/.test(t) && !/on the dishonou?red bill|of the dishonou?red bill/.test(t);
    const isOurs = isPayable && !isReceivable && dishonourVerb;
    const disc = /discounted/.test(t);
    let p = party;
    if (!p) { const b = acLastBill(st, null, null, dishonourVerb ? ["open", "discounted"] : ["dishonoured", "open", "discounted"]); if (b) p = b.party; }
    if (!p && !isOurs) p = groupParty("BR");
    const lines = [];
    if (isOurs) { // our own acceptance dishonoured
      if (bill === null) return { status: "UNCERTAIN", reason: "Dishonour of our acceptance — state the bill amount." };
      lines.push({ account: "Bills Payable A/c", dr: bill }, { account: (p || "Creditors") + " A/c", cr: bill });
      return mk(lines, "bill", { party: p, bill: { op: "dishonour", type: "BP", party: p, amount: bill } });
    }
    let regBill = acLastBill(st, "BR", p, ["open", "discounted"]);
    if (bill === null && dishonourVerb) { if (regBill) { bill = regBill.amount; assumptions.push(`Bill amount ${acFmtR(bill)} taken from the recorded bill of ${p}.`); } else return { status: "UNCERTAIN", reason: "Dishonoured bill — the bill amount is not stated and no earlier bill of this party is recorded." }; }
    const wasDiscounted = disc || (regBill && regBill.status === "discounted");
    const credit = wasDiscounted ? "Bank" : "Bills Receivable";
    if (dishonourVerb && !disc && !regBill) assumptions.push("Bill assumed not to have been discounted earlier (credited to Bills Receivable).");
    if (bill !== null && dishonourVerb) { acAddLine(lines, p, "dr", acRound2(bill + (noting || 0))); acAddLine(lines, credit, "cr", bill); }
    if (noting !== null) {
      const nm = /\bbank\b|cheque/.test(t) && !/discounted[^.;]*\bbank\b/.test(t) ? "Bank" : pm.mode === "bank" ? "Bank" : "Cash";
      if (bill !== null && dishonourVerb) acAddLine(lines, nm, "cr", noting);
      else { acAddLine(lines, p, "dr", noting); acAddLine(lines, nm, "cr", noting); }
    }
    if (!lines.length) return { status: "UNCERTAIN", reason: "Dishonoured bill — amounts could not be identified." };
    return mk(lines, "bill", { party: p, assumptions, bill: dishonourVerb ? { op: "dishonour", type: "BR", party: p, amount: bill } : { op: "note", party: p } });
  }
  // --- discounting ---
  if (/discount(?:ed|ing)?\b/.test(t) && /\bbank\b|\bdiscounted\b/.test(t) && !/trade discount|cash discount/.test(t)) {
    let B = get("bill"), Pn = get("proceeds"), Dc = get("discchg");
    if (B === null && Pn === null && plain.length >= 2) { B = Math.max(...plain); Pn = Math.min(...plain); }
    else if (B === null && plain.length) B = plain.find(x => x !== Pn && x !== Dc) ?? null;
    if (B !== null && Pn !== null && Dc === null) Dc = acRound2(B - Pn);
    const rate = cx.percents.length ? cx.percents[0].value : 0;
    if (B === null && Pn === null && rate) { const b0 = acLastBill(st, "BR", party, ["open"]); if (b0) { B = b0.amount; assumptions.push(`Bill amount ${acFmtR(B)} taken from the recorded bill.`); } }
    if (B !== null && Pn === null && Dc === null && rate) {
      const pr = acParsePeriod(t.replace(/\bp\.?a\.?\b/g, "")); const yrs = pr ? pr.years : null;
      if (yrs === null) return { status: "UNCERTAIN", reason: "Bill discounted at a rate — state the unexpired period (e.g. 'for 2 months') so the discount can be calculated." };
      Dc = acRound2(B * rate / 100 * yrs); Pn = acRound2(B - Dc);
    }
    if (B !== null && Pn === null && Dc === null && !rate) {
      // no discount charges stated: assume none (net proceeds = face value)
      const together = /received[^.;]*\bbill[^.;]*\b(?:and|then)\s+(?:immediately\s+)?discounted/.test(t);
      assumptions.push("No discount charges stated — bank proceeds taken equal to the face value of the bill.");
      const lines = []; acAddLine(lines, "Bank", "dr", B);
      if (together) { acAddLine(lines, party || groupParty("BR"), "cr", B); return mk(lines, "bill", { narration: cx.original, party, bill: { op: "draw", type: "BR", party, amount: B } }); }
      acAddLine(lines, "Bills Receivable", "cr", B);
      return mk(lines, "bill", { party, bill: { op: "discount", type: "BR", party, amount: B } });
    }
    if (B === null || Pn === null) { const b = acLastBill(st, "BR", party, ["open"]); if (b && B === null) { B = b.amount; assumptions.push(`Bill amount ${acFmtR(B)} taken from the recorded bill.`); if (Pn !== null) Dc = acRound2(B - Pn); } }
    if (B === null || Pn === null || Dc === null) return { status: "UNCERTAIN", reason: "Bill discounted with the bank — state the bill amount and either the amount received or the discount charged." };
    if (Dc < 0 || Pn > B) return { status: "INVALID", reason: "The amount received on discounting cannot exceed the face value of the bill." };
    const lines = []; acAddLine(lines, "Bank", "dr", Pn); acAddLine(lines, "Discount on Bills Receivable", "dr", Dc); acAddLine(lines, "Bills Receivable", "cr", B);
    return mk(lines, "bill", { narration: cx.original + ` (bill ${acFmtR(B)} − discount ${acFmtR(Dc)} = ${acFmtR(Pn)} received)`, party, bill: { op: "discount", type: "BR", party, amount: B }, calcs: [{ kind: "bill discount", inputs: [B, Pn, Dc], result: Dc }] });
  }
  // --- maturity: paid (BP) / honoured & collected (BR) ---
  if (/matur|honou?red|retire|due date/.test(t) && !/dishonou?r/.test(t)) {
    const paying = /\bpaid\b|\bpay\b|retired|met\b/.test(t) && !/received|collected|realis/.test(t);
    const type = /payable/.test(t) ? "BP" : /receivable/.test(t) ? "BR" : paying ? "BP" : "BR";
    let amt = plain.length ? plain[0] : get("bill");
    if (amt === null) { const b = acLastBill(st, type, party, ["open"]); if (b) { amt = b.amount; assumptions.push(`Bill amount ${acFmtR(amt)} taken from the recorded bill.`); } else return { status: "UNCERTAIN", reason: "Bill matured — the amount is not stated and no earlier bill is recorded." }; }
    const lines = [];
    if (type === "BP") { acAddLine(lines, "Bills Payable", "dr", amt); acAddLine(lines, money, "cr", amt); }
    else { acAddLine(lines, money, "dr", amt); acAddLine(lines, "Bills Receivable", "cr", amt); }
    if (!pm.mode) assumptions.push("No payment mode stated — cash assumed.");
    return mk(lines, "bill", { party, bill: { op: "settle", type, party, amount: amt } });
  }
  // --- drawing / acceptance ---
  const amt = get("bill") !== null ? get("bill") : plain.length === 1 ? plain[0] : null;
  if (amt === null) return plain.length > 1 ? { status: "UNCERTAIN", reason: "A bill is mentioned with several amounts — state which amount is the bill." } : null;
  if (/\bdrew\b|drawn (?:on|upon)|which (?:he|she|they) accepted|accepted by|(?:[A-Z][a-z]+) accepted/.test(cx.original) && !/drawn by/.test(t)) {
    const pty = party || groupParty("BR");
    const lines = []; acAddLine(lines, "Bills Receivable", "dr", amt); acAddLine(lines, pty, "cr", amt);
    return mk(lines, "bill", { party, bill: { op: "draw", type: "BR", party, amount: amt } });
  }
  if (/accepted|acceptance|drawn by|in favour of/.test(t) && !/receivable/.test(t)) {
    const pty = party || groupParty("BP");
    const lines = []; acAddLine(lines, pty, "dr", amt); acAddLine(lines, "Bills Payable", "cr", amt);
    return mk(lines, "bill", { party, bill: { op: "accept", type: "BP", party, amount: amt } });
  }
  if (/receivable/.test(t) && /received|receive/.test(t)) {
    const pty = party || groupParty("BR");
    const lines = []; acAddLine(lines, "Bills Receivable", "dr", amt); acAddLine(lines, pty, "cr", amt);
    return mk(lines, "bill", { party, bill: { op: "draw", type: "BR", party, amount: amt } });
  }
  return null;
}

/* ---- I6. MULTI-MODE SPLIT PAYMENT (cash + bank + bill + credit) ---- */
/* ---- I15. PURPOSE-SPLIT COMPOUND EVENTS (sections 2-4) ----
   One shared action — a bank withdrawal, a single cheque payment, goods given away — split
   across several amounts by what each amount is FOR, not by a plain vocabulary word sitting
   next to it. "(the proprietor's) personal …" is always Drawings; "office …" resolves to
   whatever the office amount is actually for; "free samples" / "charity or donation" /
   "staff welfare or staff gifts" are goods given away, credited to Purchases. */
const AC_PURPOSE_ROLES = [
  { role: "drawings", before: [/(?:the\s+)?proprietor'?s?\s+personal\s+[a-z]*\s*$/, /\bpersonal\s+[a-z]*\s*$/, /\bown\s+use\s*$/, /\bhousehold\s+[a-z]*\s*$/], after: [/^\s*for\s+(?:the\s+)?(?:proprietor'?s?\s+)?personal\s+(?:use|expenses?)?/] },
  { role: "office", before: [/\boffice\s+[a-z]*\s*$/, /\bbusiness\s+[a-z]*\s*$/], after: [/^\s*for\s+office\s+(?:use|expenses?)?/] },
  { role: "samples", before: [/\bas\s+free\s+samples?\s*$/, /free\s+samples?\s*$/], after: [/^\s*(?:was|were)?\s*distributed\s+as\s+free\s+samples?/, /^\s*as\s+free\s+samples?/] },
  { role: "charity", before: [/\bas\s+charity\s*$/, /\bcharity\s*$/, /\bdonat(?:ed|ion)\s*$/], after: [/^\s*(?:was|were)?\s*given\s+away\s+as\s+charity/, /^\s*(?:was|were)?\s*donated/, /^\s*as\s+charity/] },
  { role: "staffwelfare", before: [/\bstaff\s+(?:welfare|gifts?)\s*$/], after: [/^\s*(?:was|were)?\s*(?:distributed|given)\s+(?:to|as)\s+staff/] }
];
function acStripPurposeWord(s) { return s.replace(/\b(?:the\s+)?proprietor'?s?\s+personal\b|\bpersonal\b|\boffice\b|\bbusiness\b/gi, "").trim(); }
function acInterpPurposeSplit(cx) {
  const t = cx.text;
  const isWithdrawal = /\bwithdrew\b|\bwithdrawn\b|\bwithdrawal\b/.test(t) && /\bbank\b/.test(t);
  const isGoodsGiven = /\bgoods\b/.test(t) && (/\bdistribut/.test(t) || /\bgiven\s+away|\bgave\s+away/.test(t) || /\bdonated\b/.test(t));
  const hasPersonalOffice = /\bpersonal\b/.test(t) && /\boffice\b|\bbusiness\b/.test(t);
  if (!isWithdrawal && !isGoodsGiven && !hasPersonalOffice) return null;
  if (cx.amounts.length < 2) return null;
  const tagged = acTagAmounts(cx, AC_PURPOSE_ROLES);
  if (tagged.some(x => !x.role)) return null;   // every amount must carry a purpose we recognise, or leave this to another interpreter
  const lines = [], assumptions = [];
  const pm = cx.pm; const money = pm.mode === "bank" ? "Bank" : "Cash";
  if (isWithdrawal) {
    // ONE bank withdrawal, several destinations.
    let total = 0;
    tagged.forEach(x => {
      total += x.value;
      if (x.role === "drawings") acAddLine(lines, "Drawings", "dr", x.value);
      else if (x.role === "office") acAddLine(lines, "Cash", "dr", x.value);
      else return;
    });
    if (!lines.length) return null;
    acAddLine(lines, "Bank", "cr", total);
    return { lines, narration: cx.original, tag: "drawings", assumptions, calcs: [{ kind: "purpose split", inputs: tagged.map(x => x.value), result: total }], confidence: 0.9, interpreter: "purpose-split",
      components: lines.map(l => ({ account: l.account, side: l.dr !== undefined ? "dr" : "cr", amount: l.dr !== undefined ? l.dr : l.cr, role: "withdrawal", sourceClause: "", confidence: 1 })) };
  }
  if (isGoodsGiven) {
    let total = 0;
    tagged.forEach(x => {
      total += x.value;
      const acct = x.role === "samples" ? "Free Samples" : x.role === "charity" ? "Charity/Donation" : x.role === "staffwelfare" ? "Staff Welfare Expenses" : null;
      if (acct) acAddLine(lines, acct, "dr", x.value);
    });
    if (!lines.length) return null;
    acAddLine(lines, "Purchases", "cr", total);
    return { lines, narration: cx.original, tag: "adjustment", assumptions, calcs: [{ kind: "purpose split", inputs: tagged.map(x => x.value), result: total }], confidence: 0.9, interpreter: "purpose-split",
      components: lines.map(l => ({ account: l.account, side: l.dr !== undefined ? "dr" : "cr", amount: l.dr !== undefined ? l.dr : l.cr, role: "goods given away", sourceClause: "", confidence: 1 })) };
  }
  // Personal + office compound payment ("Paid ₹4,000 for the proprietor's personal Income Tax
  // and ₹6,000 for office Insurance Charges by cheque.") — the "office" figure still needs its
  // real expense account resolved from the words that actually describe it.
  if (!pm.mode) assumptions.push("No payment mode stated — cash assumed.");
  let total = 0, ok = true;
  tagged.forEach(x => {
    total += x.value;
    if (x.role === "drawings") { acAddLine(lines, "Drawings", "dr", x.value); return; }
    if (x.role === "office") {
      const clause = acStripPurposeWord(x.before + " " + x.after);
      const re = new RegExp(AC_TERM_RE.source, "gi"); let m2, acct = null;
      while ((m2 = re.exec(clause))) { const key = m2[1].toLowerCase().replace(/\s+/g, " "); const term = AC_TERMS[key] || AC_TERMS[key.replace(/(?:s|es)$/, "")]; if (term && term.out) { acct = term.out; break; } }
      if (!acct) { ok = false; return; }
      acAddLine(lines, acct, "dr", x.value);
    }
  });
  if (!ok || !lines.length) return { status: "UNCERTAIN", reason: "Could not identify what the office/business portion of this payment was actually for." };
  acAddLine(lines, money, "cr", total);
  return { lines, narration: cx.original, tag: "compound", assumptions, calcs: [{ kind: "purpose split", inputs: tagged.map(x => x.value), result: total }], confidence: 0.9, interpreter: "purpose-split",
    components: lines.map(l => ({ account: l.account, side: l.dr !== undefined ? "dr" : "cr", amount: l.dr !== undefined ? l.dr : l.cr, role: "personal/business", sourceClause: "", confidence: 1 })) };
}

const AC_MODE_ROLES = [
  { role: "cash", after: [/^\s*(?:in |by |through |via )?cash\b/], before: [/\bcash\s*(?:of|worth|amounting to|:|-)?\s*$/] },
  { role: "bank", after: [/^\s*(?:in |by |through |via |from )?(?:cheque|chq|bank|neft|rtgs|upi)\b/], before: [/(?:cheque|bank)\s*(?:of|for|worth|:|-)?\s*$/] },
  { role: "bill", after: [/^\s*(?:by |through |via |as |in )?(?:a )?bills?\b/], before: [/\bbills?\s+(?:for|of)\s*$/] },
  { role: "credit", after: [/^\s*(?:on |as |by )?credit\b/] }
];
function acInterpSplit(cx) {
  const t = cx.text;
  if (!/\b(?:purchas\w*|bought|sold|sale)\b/.test(t) || /%|\bgst\b|cgst|sgst|igst|discount|\breturn/.test(t)) return null;
  const tagged = acTagAmounts(cx, AC_MODE_ROLES);
  const modeAmts = tagged.filter(a => a.role), totals = tagged.filter(a => !a.role);
  const balMatch = /(?:balance|remaining|rest|difference)[^.;]{0,30}?\b(bills?|credit|cheque|chq|bank|cash|later)\b|\b(accepted a bill|bill)\b[^.;]{0,20}\b(?:for )?(?:the )?(?:balance|remaining|rest)/.exec(t);
  const balKind = balMatch ? (/bill/.test(balMatch[0]) ? "bill" : /cheque|chq|bank/.test(balMatch[1] || "") ? "bank" : /cash/.test(balMatch[1] || "") ? "cash" : "credit") : null;
  if (modeAmts.length + (balKind ? 1 : 0) < 2 || (modeAmts.length < 1)) return null;
  if (modeAmts.length === 1 && !balKind) return null;
  if (totals.length > 1) return { status: "UNCERTAIN", reason: "Purchase/sale with several payment modes — more than one amount could be the total; state the total once." };
  const isSale = /\bsold\b|\bsales?\b/.test(t) && !/\bpurchas|\bbought/.test(t);
  const labels = acAssetLabelsIn(t);
  let T = totals.length ? totals[0].value : null;
  const paid = { cash: 0, bank: 0, bill: 0, credit: 0 };
  modeAmts.forEach(m => { paid[m.role] = acRound2(paid[m.role] + m.value); });
  const explicit = acRound2(paid.cash + paid.bank + paid.bill + paid.credit);
  if (T === null) { if (balKind) return { status: "UNCERTAIN", reason: "The total value is not stated, so the balance cannot be worked out." }; T = explicit; }
  if (explicit > T + 0.01) return { status: "INVALID", reason: `The amounts paid by each mode (${acFmtR(explicit)}) exceed the total ${acFmtR(T)}.` };
  const bal = acRound2(T - explicit);
  if (balKind) { if (bal <= 0.01) return { status: "INVALID", reason: "A balance is mentioned but nothing remains after the amounts stated." }; paid[balKind === "later" ? "credit" : balKind] = acRound2(paid[balKind === "later" ? "credit" : balKind] + bal); }
  else if (bal > 0.01) return { status: "UNCERTAIN", reason: `${acFmtR(bal)} of the ${acFmtR(T)} is unaccounted for — state how the balance was settled.` };
  const party = cx.party, lines = [], assumptions = [];
  const itemAcc = isSale ? "Sales" : (labels.length ? labels[0] : "Purchases");
  if (isSale) {
    if (paid.cash) acAddLine(lines, "Cash", "dr", paid.cash);
    if (paid.bank) acAddLine(lines, "Bank", "dr", paid.bank);
    if (paid.bill) acAddLine(lines, "Bills Receivable", "dr", paid.bill);
    if (paid.credit) acAddLine(lines, party || "Debtors", "dr", paid.credit);
    acAddLine(lines, "Sales", "cr", T);
  } else {
    acAddLine(lines, itemAcc, "dr", T);
    if (paid.cash) acAddLine(lines, "Cash", "cr", paid.cash);
    if (paid.bank) acAddLine(lines, "Bank", "cr", paid.bank);
    if (paid.bill) acAddLine(lines, "Bills Payable", "cr", paid.bill);
    if (paid.credit) acAddLine(lines, party || (labels.length ? labels[0] + " Supplier/Creditor" : "Creditors"), "cr", paid.credit);
  }
  if (!party && paid.credit) assumptions.push("Party not named — a generic creditor/debtor account is used.");
  const parts = ["cash", "bank", "bill", "credit"].filter(k => paid[k]).map(k => `${k} ${acFmtR(paid[k])}`).join(", ");
  return { lines, narration: cx.original + ` (total ${acFmtR(T)}: ${parts})`, tag: labels.length && !isSale ? "asset" : "goods", party, assumptions, calcs: [{ kind: "split", inputs: [T, ...modeAmts.map(m => m.value)], result: T }], confidence: 0.95, interpreter: "split",
    components: lines.map(l => ({ account: l.account, side: l.dr !== undefined ? "dr" : "cr", amount: l.dr !== undefined ? l.dr : l.cr, role: "split", sourceClause: "", confidence: 1 })) };
}

/* ---- I7. GST SET-OFF / GST PAYMENT against the ACTUAL accumulated balances ---- */
function acInterpGst(cx) {
  const t = cx.text;
  const isSetOff = /set.?off|adjust(?:ed|ing)?\s+(?:the\s+)?(?:input|output)?\s*gst/.test(t) && /gst/.test(t);
  const isPay = /gst/.test(t) && /liabilit|\bpayable\b|\bdeposited\b|\bremitted\b/.test(t) && /\bpaid\b|\bpay\b|deposit|remit/.test(t) && !isSetOff && !/purchas|sold|goods/.test(t);
  if (!isSetOff && !isPay) return null;
  const g = Object.assign({ inputCGST: 0, inputSGST: 0, inputIGST: 0, outputCGST: 0, outputSGST: 0, outputIGST: 0 }, cx.state.gstBalances);
  const totalIn = acRound2(g.inputCGST + g.inputSGST + g.inputIGST), totalOut = acRound2(g.outputCGST + g.outputSGST + g.outputIGST);
  const lines = []; const assumptions = [], warnings = [];
  const statedIn = acAmountNear(cx.text, cx.amounts, ["input gst", "input"]), statedOut = acAmountNear(cx.text, cx.amounts, ["output gst", "output"]);
  if (isSetOff) {
    if (statedIn !== null && statedOut !== null && totalIn + totalOut === 0) return null; // question states the figures itself → rule chain handles (Input GST / Output GST)
    if (statedIn !== null && statedOut !== null && (statedIn > totalIn + 0.01 || statedOut > totalOut + 0.01) && totalIn + totalOut > 0) return { status: "INVALID", reason: `The stated Input GST ${acFmtR(statedIn)} / Output GST ${acFmtR(statedOut)} exceed the balances actually recorded (Input ${acFmtR(totalIn)}, Output ${acFmtR(totalOut)}).` };
    if (totalIn <= 0 || totalOut <= 0) return { status: "INVALID", reason: totalIn + totalOut === 0 ? "GST set-off — no Input or Output GST balance has been recorded yet, so there is nothing to set off." : (totalIn <= 0 ? "GST set-off — there is no Input GST credit available." : "GST set-off — there is no Output GST liability to set off against.") };
    const av = { ...g }; const use = [];
    const take = (inH, outH) => { const x = Math.min(av["input" + inH], av["output" + outH]); if (x > 0.004) { av["input" + inH] = acRound2(av["input" + inH] - x); av["output" + outH] = acRound2(av["output" + outH] - x); use.push([inH, outH, acRound2(x)]); } };
    take("IGST", "IGST"); take("IGST", "CGST"); take("IGST", "SGST");
    take("CGST", "CGST"); take("CGST", "IGST");
    take("SGST", "SGST"); take("SGST", "IGST");
    if (!use.length) return { status: "INVALID", reason: "GST set-off — the available Input and Output GST heads cannot be set off against each other (CGST cannot be set off against SGST)." };
    use.forEach(([i, o, x]) => { acAddLine(lines, "Output " + o, "dr", x); acAddLine(lines, "Input " + i, "cr", x); });
    const remOut = acRound2(av.outputCGST + av.outputSGST + av.outputIGST), remIn = acRound2(av.inputCGST + av.inputSGST + av.inputIGST);
    return { lines, narration: cx.original + ` (set-off ${acFmtR(acRound2(use.reduce((s, u) => s + u[2], 0)))}; GST payable remaining ${acFmtR(remOut)}; unused Input GST ${acFmtR(remIn)})`, tag: "adjustment", assumptions, warnings,
      calcs: [{ kind: "gst set-off", inputs: [totalIn, totalOut], result: acRound2(use.reduce((s, u) => s + u[2], 0)), remainingLiability: remOut, remainingCredit: remIn }], confidence: 0.95, interpreter: "gst-setoff",
      components: lines.map(l => ({ account: l.account, side: l.dr !== undefined ? "dr" : "cr", amount: l.dr !== undefined ? l.dr : l.cr, role: "gst set-off", sourceClause: "", confidence: 1 })) };
  }
  // GST payment
  if (totalOut <= 0) return null; // nothing recorded → rule chain (GST Payable A/c) as stated in the question
  const amt = cx.amounts.length ? cx.amounts[0].value : totalOut;
  if (amt > totalOut + 0.01) return { status: "INVALID", reason: `GST payment ${acFmtR(amt)} exceeds the recorded GST liability of ${acFmtR(totalOut)}.` };
  const money = cx.pm.mode === "bank" ? "Bank" : "Cash"; if (!cx.pm.mode) assumptions.push("No payment mode stated — cash assumed.");
  let left = amt; ["CGST", "SGST", "IGST"].forEach((h, i, arr) => { const bal = g["output" + h]; if (bal > 0 && left > 0) { const x = Math.min(bal, left); acAddLine(lines, "Output " + h, "dr", x); left = acRound2(left - x); } });
  acAddLine(lines, money, "cr", amt);
  return { lines, narration: cx.original, tag: "adjustment", assumptions, warnings, calcs: [{ kind: "gst payment", inputs: [totalOut, amt], result: amt }], confidence: 0.9, interpreter: "gst-payment",
    components: lines.map(l => ({ account: l.account, side: l.dr !== undefined ? "dr" : "cr", amount: l.dr !== undefined ? l.dr : l.cr, role: "gst payment", sourceClause: "", confidence: 1 })) };
}

/* ---- I8. ABNORMAL LOSS + INSURANCE (state-aware) ---- */
const AC_LOSS_ROLES = [
  { role: "claim", before: [/(?:claim(?:\s+(?:of|for|admitted|amounting to))?|admitted(?:\s+(?:a\s+)?(?:claim\s+)?(?:of|for)?)?|insurance (?:company|co\.?) (?:admitted|paid|accepted|agreed to pay)|insurer (?:admitted|paid|accepted))\s*$/], after: [/^\s*(?:was |were )?(?:admitted|accepted|claimed)\b/, /^\s*(?:as\s+)?(?:insurance )?claim/] },
  { role: "loss", before: [/(?:lost|destroyed|damaged|stolen|burnt|loss(?: of| was)?|worth|valued at|goods)\s*(?:by fire|due to fire|in transit|in (?:the )?(?:flood|accident|theft))?\s*(?:worth|of|for|valued at)?\s*$/] }
];
function acInterpLoss(cx) {
  const t = cx.text;
  const lossEvent = (/\bfire\b|\btheft\b|\bstolen\b|\bburgl|\baccident\b|\bflood\b|\bin transit\b|\bdestroyed\b|\bdamaged\b|\bspoiled\b|\bwashed away\b/.test(t) || /\bgoods\b[^.;]{0,40}\b(?:were |was |got )?lost\b|\blost\b[^.;]{0,15}\bgoods\b/.test(t)) && !/premium/.test(t);
  const claimOnly = /insurance (?:company|co\.?)|insurer|\bclaim\b/.test(t) && /admitted|accepted|agreed|received|paid|rejected/.test(t);
  if (!lossEvent && !claimOnly) return null;
  const st = cx.state.loss, lines = [], assumptions = [], warnings = [];
  const tagged = acTagAmounts(cx, AC_LOSS_ROLES);
  const claimAmt = (() => { const c = tagged.filter(a => a.role === "claim"); return c.length ? c[0].value : null; })();
  const pctClaim = cx.percents.length ? cx.percents[0].value : 0;
  const plain = tagged.filter(a => a.role !== "claim").map(a => a.value);
  const money = cx.pm.mode === "bank" ? "Bank" : "Cash";
  const receiving = /\breceived\b|\bcollected\b/.test(t) && /claim/.test(t) && !/admitted/.test(t);
  const rejected = /rejected|not admitted|no claim|repudiat/.test(t);
  // --- claim-only sentences that lean on the recorded loss ---
  if (!lossEvent || (claimOnly && !(/goods/.test(t) && plain.length))) {
    const openClaim = acRound2(st.claimAdmitted - st.claimReceived), openLoss = acRound2(st.gross - st.claimAdmitted);
    if (rejected) return { status: "NO_ENTRY_REQUIRED", reason: "The insurance claim was rejected — the loss already recorded stays as an uninsured loss; no further entry is needed." };
    if (receiving) {
      let a = claimAmt !== null ? claimAmt : (plain.length ? plain[0] : null);
      if (a === null) { if (openClaim > 0) { a = openClaim; assumptions.push(`Amount taken as the claim admitted and still outstanding (${acFmtR(a)}).`); } else return { status: "UNCERTAIN", reason: "Insurance claim received — no amount is stated and no claim has been recorded as admitted." }; }
      if (st.claimAdmitted > 0 && a > openClaim + 0.01) return { status: "INVALID", reason: `The amount received ${acFmtR(a)} exceeds the insurance claim outstanding ${acFmtR(openClaim)}.` };
      acAddLine(lines, money, "dr", a); acAddLine(lines, "Insurance Claim", "cr", a);
      return { lines, narration: cx.original, tag: "loss", assumptions, warnings, calcs: [{ kind: "claim received", inputs: [a], result: a }], confidence: 0.9, interpreter: "loss", components: lines.map(l => ({ account: l.account, side: l.dr !== undefined ? "dr" : "cr", amount: l.dr !== undefined ? l.dr : l.cr, role: "claim", sourceClause: "", confidence: 1 })) };
    }
    let a = claimAmt !== null ? claimAmt : (plain.length === 1 && !pctClaim ? plain[0] : null);
    if (a === null && pctClaim) { if (openLoss <= 0) return { status: "UNCERTAIN", reason: "Claim admitted as a percentage — no loss has been recorded earlier to apply the percentage to." }; a = acRound2(openLoss * pctClaim / 100); assumptions.push(`${pctClaim}% applied to the recorded uninsured loss ${acFmtR(openLoss)}.`); }
    if (a === null) return { status: "UNCERTAIN", reason: "Insurance claim admitted — state the amount (or a % with the loss recorded earlier)." };
    if (st.gross > 0 && a > openLoss + 0.01) return { status: "INVALID", reason: `The claim admitted ${acFmtR(a)} exceeds the loss recorded (${acFmtR(openLoss)} not yet claimed).` };
    if (!(st.gross > 0)) warnings.push("No loss has been recorded earlier in this run for this claim.");
    acAddLine(lines, "Insurance Claim", "dr", a); acAddLine(lines, "Loss by Fire/Theft", "cr", a);
    return { lines, narration: cx.original + (st.gross > 0 ? ` (uninsured loss remaining ${acFmtR(acRound2(openLoss - a))})` : ""), tag: "loss", assumptions, warnings, calcs: [{ kind: "claim admitted", inputs: [a], result: a }], confidence: 0.9, interpreter: "loss", components: lines.map(l => ({ account: l.account, side: l.dr !== undefined ? "dr" : "cr", amount: l.dr !== undefined ? l.dr : l.cr, role: "claim", sourceClause: "", confidence: 1 })) };
  }
  // --- the loss itself (with or without an admitted claim in the same sentence) ---
  if (!plain.length) return null;
  if (plain.length > 1 && claimAmt === null) return { status: "UNCERTAIN", reason: "Loss of goods — several amounts are stated and it is unclear which is the loss and which the insurance claim." };
  const L = plain[0];
  let C = claimAmt !== null ? claimAmt : (pctClaim ? acRound2(L * pctClaim / 100) : 0);
  if (claimAmt === null && !pctClaim && /insur/.test(t) && !/no claim|not admitted|rejected|no insurance|uninsured|not insured/.test(t)) return null; // insurance mentioned, amount pending → rule chain asks for %
  if (C > L + 0.01) return { status: "INVALID", reason: `The insurance claim ${acFmtR(C)} is larger than the loss ${acFmtR(L)}.` };
  const cause = /\bfire\b/.test(t) ? "fire" : /\bflood\b/.test(t) ? "flood" : /\btheft|stolen|burgl/.test(t) ? "theft" : /transit/.test(t) ? "loss in transit" : /accident/.test(t) ? "accident" : "loss";
  const claimReceivedNow = receiving && C > 0;
  if (C > 0) acAddLine(lines, claimReceivedNow ? money : "Insurance Claim", "dr", C);
  if (L - C > 0.004) acAddLine(lines, "Loss by Fire/Theft", "dr", acRound2(L - C));
  acAddLine(lines, "Purchases", "cr", L);
  return { lines, narration: cx.original + ` (${cause}: loss ${acFmtR(L)}${C > 0 ? `, claim admitted ${acFmtR(C)}, uninsured loss ${acFmtR(acRound2(L - C))}` : ", uninsured"})`, tag: "loss", assumptions, warnings, calcs: [{ kind: "loss", inputs: [L, C], result: acRound2(L - C) }], confidence: 0.9, interpreter: "loss",
    components: lines.map(l => ({ account: l.account, side: l.dr !== undefined ? "dr" : "cr", amount: l.dr !== undefined ? l.dr : l.cr, role: "loss", sourceClause: "", confidence: 1 })) };
}

/* ---- I9. EXPENSE / INCOME PARTLY RELATING TO THE NEXT PERIOD ---- */
// "Rent ₹6,000 paid for 12 months from 1 October; year ends 31 March" — the unexpired part is worked out from the dates.
function acPeriodByDate(cx) {
  const t = cx.text;
  const m = new RegExp("\\bfor\\s+(" + AC_NUMW_RE + ")\\s+months?\\s+(?:from|starting|commencing(?:\\s+on|\\s+from)?|beginning)\\s+(" + AC_DATE_RE.source + "|[a-z]+\\s+\\d{1,2}|\\d{1,2}\\s+[a-z]+)", "i").exec(t);
  if (!m || cx.amounts.length !== 1 || !cx.dir || cx.dir === "mixed" || cx.dir === "intro") return null;
  const N = acNum(m[1]); const start = acNormalizeDate(m[2]); const sm = /^([A-Za-z]+)\s+(\d{1,2})/.exec(start);
  if (!sm || !(sm[1].slice(0, 3).toLowerCase() in AC_MONTH_IDX)) return null;
  const startM = AC_MONTH_IDX[sm[1].slice(0, 3).toLowerCase()], day = parseInt(sm[2], 10);
  const ye = /(?:year|accounting year|financial year|books?)\s*(?:ends?|ended|ending|closes?|closing)\s*(?:on\s*)?(?:the\s*)?(?:\d{1,2}(?:st|nd|rd|th)?\s+)?([a-z]+)/.exec(t);
  const endM = ye && (ye[1].slice(0, 3) in AC_MONTH_IDX) ? AC_MONTH_IDX[ye[1].slice(0, 3)] : 2;
  const assumptions = []; if (!ye) assumptions.push("Year end taken as 31 March.");
  const toEnd = acRound2(((endM - startM + 12) % 12) + 1 - (day - 1) / AC_DAYS_IN[startM]);
  if (N <= toEnd + 0.001) return null;   // wholly within the year — an ordinary expense/income
  const T = cx.amounts[0].value, prepaid = acRound2(T * (N - toEnd) / N), current = acRound2(T - prepaid);
  const items = acParseItems(cx, { money: false }).items; const term = items.length ? items[0].term : null;
  if (!term) return { status: "UNCERTAIN", reason: "Part of this payment/receipt relates to the next period, but the expense/income type could not be identified." };
  const money = cx.pm.mode === "bank" ? "Bank" : "Cash"; if (!cx.pm.mode) assumptions.push("No payment mode stated — cash assumed.");
  const lines = [];
  if (cx.dir === "out") { if (!term.out) return null; acAddLine(lines, term.out, "dr", current); acAddLine(lines, "Prepaid " + term.out, "dr", prepaid); acAddLine(lines, money, "cr", T); }
  else { if (!term.inc) return null; acAddLine(lines, money, "dr", T); acAddLine(lines, term.inc, "cr", current); acAddLine(lines, term.inc.replace(/ Received$/, "") + " Received in Advance", "cr", prepaid); }
  return { lines, narration: cx.original + ` (${N} months from ${start}; ${acRound2(toEnd)} months fall in this year → current ${acFmtR(current)}, next year ${acFmtR(prepaid)})`, tag: "adjustment", assumptions, calcs: [{ kind: "period split", inputs: [T, N, toEnd], result: prepaid, formula: `${acFmtR(T)} × ${acRound2(N - toEnd)}/${N}` }], confidence: 0.9, interpreter: "period-split",
    components: lines.map(l => ({ account: l.account, side: l.dr !== undefined ? "dr" : "cr", amount: l.dr !== undefined ? l.dr : l.cr, role: "period split", sourceClause: "", confidence: 1 })) };
}
function acInterpPeriodSplit(cx) {
  const t = cx.text;
  const byDate = acPeriodByDate(cx);
  if (byDate) return byDate;
  if (!/\b(?:includes?|including|of which|out of which|which includes)\b/.test(t)
      && !/\b(?:is|are|was|were|still)\s+(?:fully\s+|wholly\s+)?(?:prepaid|unexpired|in advance)\b/.test(t)
      && !/[,;]\s*(?:₹|rs\.?\s*)?[\d,]+(?:\.\d+)?\s*(?:is\s+|are\s+)?(?:still\s+)?(?:prepaid|unexpired|in advance)\b/.test(t)) return null;
  if (!( /\b(?:next|following|subsequent|coming)\s+(?:accounting\s+)?(?:year|period|month|quarter)\b|\brelat(?:es|ing) to next\b|\bprepaid\b|\bin advance\b|\bunexpired\b|\badvance\b/.test(t) )) return null;
  if (cx.amounts.length !== 2 || !cx.dir || cx.dir === "mixed" || cx.dir === "intro") return null;
  const [a, b] = cx.amounts;
  const T = Math.max(a.value, b.value), P = Math.min(a.value, b.value);
  if (T === P) return { status: "INVALID", reason: "The amount relating to the next period equals the whole amount — state the split clearly." };
  const before = cx.text.slice(0, cx.amounts[0].index);
  const items = acParseItems({ ...cx, amounts: [cx.amounts[0]] }, { money: false }).items;
  const term = items.length ? items[0].term : null;
  if (!term) return { status: "UNCERTAIN", reason: "Part of the amount relates to the next period, but the expense/income type (insurance, rent, subscription …) could not be identified." };
  const money = cx.pm.mode === "bank" ? "Bank" : "Cash"; const assumptions = []; if (!cx.pm.mode) assumptions.push("No payment mode stated — cash assumed.");
  const lines = [];
  if (cx.dir === "out") {
    const exp = term.out; if (!exp) return { status: "UNCERTAIN", reason: "Could not identify which expense this is." };
    acAddLine(lines, exp, "dr", acRound2(T - P)); acAddLine(lines, "Prepaid " + exp, "dr", P); acAddLine(lines, money, "cr", T);
  } else {
    const inc = term.inc; if (!inc) return { status: "UNCERTAIN", reason: "Could not identify which income this is." };
    acAddLine(lines, money, "dr", T); acAddLine(lines, inc, "cr", acRound2(T - P)); acAddLine(lines, inc.replace(/ Received$/, "") + " Received in Advance", "cr", P);
  }
  return { lines, narration: cx.original + ` (current year ${acFmtR(T - P)}, next year ${acFmtR(P)})`, tag: "adjustment", assumptions, calcs: [{ kind: "period split", inputs: [T, P], result: acRound2(T - P) }], confidence: 0.9, interpreter: "period-split",
    components: lines.map(l => ({ account: l.account, side: l.dr !== undefined ? "dr" : "cr", amount: l.dr !== undefined ? l.dr : l.cr, role: "period split", sourceClause: "", confidence: 1 })) };
}

/* ---- I10. PROPRIETOR'S PERSONAL vs BUSINESS ---- */
function acInterpPersonal(cx) {
  const t = cx.text;
  if (/\bgoods\b|\bwithdrew\b|\bwithdrawn\b|\bloan\b/.test(t)) return null;
  const personalMark = /\b(personal|household|domestic|private|family|residential|residence|home)\b|\b(?:proprietor|owner)['’]?s?\b|\bhis own\b|\bher own\b|\b(?:son|daughter|wife|husband|children)['’]?s?\b/.test(t);
  const personalItem = /\b(school fees?|tuition|college fees?|wedding|marriage|holiday|vacation|grocer\w*|medical|life insurance|\blic\b|club|income[\s-]tax|electricity|telephone|rent|shopping|bills?)\b/.test(t);
  if (!/\b(paid|pay|spent|settled)\b/.test(t) || !personalMark || !personalItem) return null;
  if (cx.amounts.length !== 1) return null;
  const fromPersonalFunds = /\b(?:personal|own)\s+(?:funds?|account|savings|pocket|money)\b|\bfrom (?:his|her|the proprietor'?s|the owner'?s) (?:personal|own)\b|\bout of (?:his|her) own\b/.test(t);
  if (fromPersonalFunds && /\b(?:business|firm|shop|office)\b/.test(t.replace(/from (?:the )?business (?:cash|bank)/g, ""))) return null;   // a BUSINESS expense paid personally → Dr expense / Cr Capital (rule chain)
  if (fromPersonalFunds) return { status: "NO_ENTRY_REQUIRED", reason: "Paid by the proprietor from personal funds — it does not affect the business books, so no journal entry is required." };
  if (/\bpaid personally\b|\bproprietor paid\b.*\bpersonally\b/.test(t)) return null;
  const money = cx.pm.mode === "bank" ? "Bank" : "Cash"; const assumptions = []; if (!cx.pm.mode) assumptions.push("No payment mode stated — cash assumed.");
  const lines = []; acAddLine(lines, "Drawings", "dr", cx.amounts[0].value); acAddLine(lines, money, "cr", cx.amounts[0].value);
  return { lines, narration: cx.original + " (proprietor's personal expense → Drawings)", tag: "drawings", assumptions, calcs: [], confidence: 0.9, interpreter: "personal",
    components: [{ account: "Drawings", side: "dr", amount: cx.amounts[0].value, role: "personal", sourceClause: "", confidence: 1 }, { account: money, side: "cr", amount: cx.amounts[0].value, role: "settlement", sourceClause: "", confidence: 1 }] };
}


/* ---- I11. BAD DEBTS + PROVISIONS (doubtful debts, discount on debtors, discount on creditors) ---- */
function acRateAfter(t, reSrc) { const m = new RegExp("(?:" + reSrc + ")[^.;%]{0,45}?(\\d+(?:\\.\\d+)?)\\s*%").exec(t); return m ? parseFloat(m[1]) : 0; }
function acRateBefore(t, reSrc) { const m = new RegExp("(\\d+(?:\\.\\d+)?)\\s*%\\s*(?:on\\s+|as\\s+)?(?:" + reSrc + ")").exec(t); return m ? parseFloat(m[1]) : 0; }
/* ---- I13. INTEREST ON CAPITAL + INTEREST ON DRAWINGS (section 31) ----
   Two independent adjusting entries that a question often states together in one sentence.
   Each is computed only from what is actually given (a stated capital/drawings figure, the
   ledger's own Capital balance, or a stated debtor-style base) — never invented — and each
   uses the period actually stated (a full year if none is given, with that said as an
   assumption). Both may appear in the same input line as two independent Dr/Cr pairs; since
   each pair balances on its own, the combined four-line entry still satisfies Dr = Cr overall. */
function acInterpCapitalDrawingsInterest(cx) {
  const t = cx.text;
  const hasCap = /interest\s+on\s+capital/.test(t), hasDraw = /interest\s+on\s+drawings?/.test(t);
  if (!hasCap && !hasDraw) return null;
  const lines = [], assumptions = [], warnings = [], calcs = [];
  const period = acParsePeriod(t);
  const yrs = period ? period.years : 1;
  if (!period) assumptions.push("No period stated — a full year's interest was calculated.");
  else if (!period.explicit) assumptions.push("No period stated — a full year's interest was calculated.");
  const rateFor = kw => acPercentFor(cx.percents, [kw]) || (cx.percents.length === 1 && (hasCap !== hasDraw) ? cx.percents[0].value : 0);
  if (hasCap) {
    const rate = acPercentFor(cx.percents, ["capital"]) || (hasCap && !hasDraw && cx.percents.length ? cx.percents[0].value : 0);
    if (!rate) return { status: "UNCERTAIN", reason: "Interest on Capital — the rate (%) is not clear." };
    let base = acBaseFigureFor(cx.original, "capital");
    if (base === null && cx.state.balances && cx.state.balances.capital < -0.005) { base = -cx.state.balances.capital; assumptions.push(`Capital ${acFmtR(base)} taken from the ledger.`); }
    if (base === null) return { status: "UNCERTAIN", reason: "Interest on Capital — the capital figure is not stated and no Capital balance has been recorded yet." };
    const amount = acRound2(base * rate / 100 * yrs);
    if (amount > 0) { acAddLine(lines, "Interest on Capital", "dr", amount); acAddLine(lines, "Capital", "cr", amount); }
    calcs.push({ kind: "interest on capital", base, rate, period: yrs, inputs: [base], result: amount, formula: `${acFmtR(base)} × ${rate}%${yrs !== 1 ? ` × ${acRound2(yrs)} yr` : ""}` });
  }
  if (hasDraw) {
    const rate = acPercentFor(cx.percents, ["drawings"]) || (hasDraw && !hasCap && cx.percents.length ? cx.percents[0].value : 0);
    if (!rate) return { status: "UNCERTAIN", reason: "Interest on Drawings — the rate (%) is not clear." };
    let base = acBaseFigureFor(cx.original, "drawings");
    if (base === null && cx.state.balances && cx.state.balances.drawings > 0.005) { base = cx.state.balances.drawings; assumptions.push(`Drawings ${acFmtR(base)} taken from the ledger.`); }
    if (base === null) return { status: "UNCERTAIN", reason: "Interest on Drawings — the drawings figure is not stated and no Drawings balance has been recorded yet." };
    const amount = acRound2(base * rate / 100 * yrs);
    if (!period || !period.explicit) warnings.push("Interest on Drawings was calculated on the full drawings figure for the period used — if the drawings were actually spread through the year, use whichever averaging method (e.g. 6 months) the question specifies instead.");
    if (amount > 0) { acAddLine(lines, "Drawings", "dr", amount); acAddLine(lines, "Interest on Drawings", "cr", amount); }
    calcs.push({ kind: "interest on drawings", base, rate, period: yrs, inputs: [base], result: amount, formula: `${acFmtR(base)} × ${rate}%${yrs !== 1 ? ` × ${acRound2(yrs)} yr` : ""}` });
  }
  if (!lines.length) return { status: "UNCERTAIN", reason: "Could not calculate interest on capital/drawings from the figures given." };
  return { lines, narration: cx.original + " (" + calcs.map(c => c.formula + " = " + acFmtR(c.result)).join("; ") + ")", tag: "adjustment", assumptions, warnings, calcs, confidence: 0.9, interpreter: "capital-drawings-interest",
    components: lines.map(l => ({ account: l.account, side: l.dr !== undefined ? "dr" : "cr", amount: l.dr !== undefined ? l.dr : l.cr, role: "interest", sourceClause: "", confidence: 1 })) };
}

/* ---- I14. RECTIFICATION OF A WRONGLY POSTED ENTRY (section 7-8) ----
   "₹2,500 spent on repairs of machinery had been debited to Machinery Account" is not a new
   purchase or expense — it is a correction: the wrong account is named explicitly, and the
   correct account is read from what the amount was actually for/received as. If the original
   wrong entry had already recorded the real cash movement (a wrong CREDIT for money already
   received), the rectification swaps only the two non-cash accounts, never re-recording cash. */
function acInterpRectification(cx) {
  const orig = cx.original;
  const wm = /(?:had been|was|were|has been)\s+(?:wrongly\s+|incorrectly\s+)?(debited|credited)\s+to\s+(?:the\s+)?([A-Za-z][A-Za-z &]*?)\s*(?:a\/c\.?|account)?\s*[.;]?\s*$/i.exec(orig.trim());
  if (!wm) return null;
  if (cx.amounts.length !== 1) return { status: "UNCERTAIN", reason: "Rectification — exactly one amount is expected; state the amount that was wrongly posted." };
  const amount = cx.amounts[0].value;
  const wrongSide = wm[1].toLowerCase();
  const wrongAccount = acCanonAccount(wm[2].trim());
  const before = orig.slice(0, wm.index);
  let correctRaw = null, correctIsIncome = false, cm;
  if ((cm = /(?:received|earned)\s+as\s+([a-z][a-z ]*?)\s*$/i.exec(before))) { correctIsIncome = true; correctRaw = cm[1].trim(); }
  else if ((cm = /(?:spent|incurred)\s+on\s+([a-z][a-z ]*?)\s+of\s+[a-z]/i.exec(before))) { correctRaw = cm[1].trim(); }
  else if ((cm = /(?:spent|incurred|paid)\s+(?:on|for|towards)\s+([a-z][a-z ]*?)\s*$/i.exec(before))) { correctRaw = cm[1].trim(); }
  if (!correctRaw) return { status: "UNCERTAIN", reason: "Rectification — the sentence names the wrongly-posted account, but not clearly what the amount was actually for." };
  const key = correctRaw.toLowerCase();
  const term = AC_TERMS[key] || AC_TERMS[key.replace(/(?:s|es)$/, "")];
  const resolvedCorrect = correctIsIncome ? (term && term.inc) : (term && term.out) || null;
  const correctAccount = resolvedCorrect ? acCanonAccount(resolvedCorrect) : acCanonAccount(correctRaw);
  if (correctAccount === wrongAccount) return { status: "INVALID", reason: "The correct account and the wrongly-posted account appear to be the same — nothing to rectify." };
  const lines = [];
  if (wrongSide === "credited") { acAddLine(lines, wrongAccount, "dr", amount); acAddLine(lines, correctAccount, "cr", amount); }
  else { acAddLine(lines, correctAccount, "dr", amount); acAddLine(lines, wrongAccount, "cr", amount); }
  return { lines, narration: cx.original + ` (rectification: should have been ${wrongSide === "credited" ? "credited to" : "debited to"} ${correctAccount}, not ${wrongAccount})`, tag: "rectification", assumptions: [], warnings: [], calcs: [], confidence: 0.85, interpreter: "rectification",
    components: lines.map(l => ({ account: l.account, side: l.dr !== undefined ? "dr" : "cr", amount: l.dr !== undefined ? l.dr : l.cr, role: "rectification", sourceClause: "", confidence: 1 })) };
}

/* ---- I16. A NAMED PARTY PAYING US (not the other way round) ----
   "Ravi immediately paid ₹5,000 … towards the amount due on the dishonoured bill." — the
   sentence's own subject is the one handing over money, so this is always a receipt, set
   against whatever balance the business already carries for that party (a dishonoured bill,
   an ordinary credit sale, or anything else that left them owing money). */
function acInterpPartyPays(cx) {
  const t = cx.text;
  if (!cx.party) return null;
  const subjectPays = new RegExp("^\\s*(?:[a-z]+\\s+\\d{1,2}\\s*[:—-]\\s*)?" + cx.party.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b\\s+(?:immediately\\s+|promptly\\s+|then\\s+|later\\s+|now\\s+|soon\\s+)?(?:paid|pay|remitted)\\b", "i");
  if (!subjectPays.test(t)) return null;
  if (/\bon credit\b|\bsold\b|\bpurchas|\bfull settlement|final settlement|discount/.test(t)) return null;
  if (cx.amounts.length !== 1) return null;
  const amt = cx.amounts[0].value;
  const money = cx.pm.mode === "bank" ? "Bank" : "Cash";
  const assumptions = []; if (!cx.pm.mode) assumptions.push("No payment mode stated — cash assumed.");
  const lines = []; acAddLine(lines, money, "dr", amt); acAddLine(lines, cx.party, "cr", amt);
  return { lines, narration: cx.original, tag: "debtor", party: cx.party, assumptions, calcs: [], confidence: 0.85, interpreter: "party-pays",
    components: lines.map(l => ({ account: l.account, side: l.dr !== undefined ? "dr" : "cr", amount: l.dr !== undefined ? l.dr : l.cr, role: "receipt", sourceClause: "", confidence: 1 })) };
}

/* ---- I17. REMAINING FIRE/THEFT LOSS, WRITTEN OFF (section 14) ----
   Once a loss has been recorded and (if any) a claim admitted, the ledger's "Loss by
   Fire/Theft" balance already IS the uninsured remainder — "written off" means transferring
   that balance to Profit & Loss, using the recorded state rather than asking the student to
   restate a number the books already contain. */
function acInterpRemainingLossWrittenOff(cx) {
  const t = cx.text;
  if (!/\bremaining\b/.test(t) || !/\bloss\b/.test(t) || !/written\s+off/.test(t)) return null;
  if (!/fire|theft|flood|transit|accident/.test(t) && !/state.loss/.test(t)) { /* still allow a bare "the remaining loss" reference */ }
  const remaining = acRound2(cx.state.loss.gross - cx.state.loss.claimAdmitted);
  if (!(remaining > 0.004)) return { status: "UNCERTAIN", reason: "No uninsured fire/theft loss has been recorded in this run to write off." };
  const stated = cx.amounts.length === 1 ? cx.amounts[0].value : null;
  if (stated !== null && Math.abs(stated - remaining) > 0.5) return { status: "INVALID", reason: `The stated amount ${acFmtR(stated)} does not match the uninsured loss actually recorded (${acFmtR(remaining)}).` };
  const amount = stated !== null ? stated : remaining;
  const lines = []; acAddLine(lines, "Profit & Loss", "dr", amount); acAddLine(lines, "Loss by Fire/Theft", "cr", amount);
  return { lines, narration: cx.original + ` (uninsured loss of ${acFmtR(amount)} taken from the recorded fire/theft loss)`, tag: "adjustment", assumptions: [], calcs: [{ kind: "remaining loss written off", inputs: [amount], result: amount }], confidence: 0.85, interpreter: "loss-writeoff",
    components: lines.map(l => ({ account: l.account, side: l.dr !== undefined ? "dr" : "cr", amount: l.dr !== undefined ? l.dr : l.cr, role: "loss written off", sourceClause: "", confidence: 1 })) };
}

/* ---- I18. PARTIAL PAYMENT AGAINST DUES, WITH A DISCOUNT RATE ON THAT PAYMENT (Problem A) ----
   "Sumit paid ₹20,000 against his dues by cheque, and [the business] allowed him a 2% cash
   discount on this specific partial payment." The discount rate applies to the STATED payment,
   not to any other balance; the debtor's account is cleared by the full ₹20,000, and what
   actually arrives in the bank is that amount less the discount. */
function acInterpPartialPaymentWithRateDiscount(cx) {
  const t = cx.text;
  if (!cx.party || !/\bdiscount\b/.test(t) || !cx.percents.length) return null;
  if (!/\bpaid\b.*\bagainst\b.*\bdues?\b|\bpartial\s+payment\b/.test(t)) return null;
  if (cx.amounts.length !== 1) return null;
  const subjectPays = new RegExp("^\\s*(?:[a-z]+\\s+\\d{1,2}\\s*[:—-]\\s*)?" + cx.party.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b\\s+(?:immediately\\s+|promptly\\s+)?paid\\b", "i");
  if (!subjectPays.test(t)) return null;
  const rate = cx.percents[0].value, gross = cx.amounts[0].value;
  const discount = acRound2(gross * rate / 100), net = acRound2(gross - discount);
  const money = cx.pm.mode === "bank" ? "Bank" : "Cash";
  const assumptions = []; if (!cx.pm.mode) assumptions.push("No payment mode stated — cash assumed.");
  const lines = []; acAddLine(lines, money, "dr", net); acAddLine(lines, "Discount Allowed", "dr", discount); acAddLine(lines, cx.party, "cr", gross);
  return { lines, narration: cx.original + ` (${rate}% of ${acFmtR(gross)} = ${acFmtR(discount)} discount; ${acFmtR(net)} received)`, tag: "debtor", party: cx.party, assumptions, calcs: [{ kind: "partial payment discount", inputs: [gross, rate], result: discount, formula: `${acFmtR(gross)} × ${rate}%` }], confidence: 0.85, interpreter: "partial-payment-discount",
    components: lines.map(l => ({ account: l.account, side: l.dr !== undefined ? "dr" : "cr", amount: l.dr !== undefined ? l.dr : l.cr, role: "settlement", sourceClause: "", confidence: 1 })) };
}

function acInterpProvision(cx) {
  const t = cx.text, st = cx.state, bal = k => (st.balances && st.balances[k]) || 0;
  if (!/provision|reserve for/.test(t) || !cx.percents.length || /manager|depreciat|claim/.test(t)) return null;
  const discCred = /provision for discount on creditors|discount on creditors|discount from creditors|discount receivable from creditors/.test(t);
  const discDeb = /provision for discount on debtors|discount on debtors|discount on (?:the )?(?:good )?debtors|provision for discount/.test(t) && !discCred;
  const hasDD = /provision for (?:bad and )?doubtful debts|provision for bad debts|reserve for bad|provision (?:at|of|@)\s*\d|\d+\s*%\s*provision(?! for discount)|create (?:a )?provision(?! for discount)|maintain (?:a )?provision(?! for discount)/.test(t) && !discCred && !/provision for discount\b[^.;]*\b(?:only|alone)/.test(t);
  const lines = [], assumptions = [], warnings = [], calcs = [];
  const A = (k) => acAmountNear(t, cx.amounts, k);
  const plAcc = "Profit & Loss";
  const adjust = (provAcc, existing, required, gainSide) => {
    const diff = acRound2(required - existing);
    if (Math.abs(diff) < 0.005) return diff;
    // gainSide = provision on creditors (debit-balance account): increase → Dr provision / Cr P&L
    if (!gainSide) { if (diff > 0) { acAddLine(lines, plAcc, "dr", diff); acAddLine(lines, provAcc, "cr", diff); } else { acAddLine(lines, provAcc, "dr", -diff); acAddLine(lines, plAcc, "cr", -diff); } }
    else { if (diff > 0) { acAddLine(lines, provAcc, "dr", diff); acAddLine(lines, plAcc, "cr", diff); } else { acAddLine(lines, plAcc, "dr", -diff); acAddLine(lines, provAcc, "cr", -diff); } }
    return diff;
  };
  if (discCred) {
    const rate = acRateAfter(t, "discount on creditors|discount from creditors|provision for discount on creditors") || acRateBefore(t, "provision|discount") || cx.percents[0].value;
    let base = A(["creditors", "sundry creditors"]);
    if (base === null) { base = -bal("creditors"); if (base > 0) assumptions.push(`Creditors balance ${acFmtR(base)} taken from the ledger.`); else return { status: "UNCERTAIN", reason: "Provision for discount on creditors — state the creditors figure." }; }
    const req = acRound2(base * rate / 100), existing = bal("provision_for_discount_on_creditors");
    const stated = A(["existing provision", "old provision", "already"]); const ex = stated !== null ? stated : existing;
    adjust("Provision for Discount on Creditors", ex, req, true);
    calcs.push({ kind: "provision", inputs: [base, ex], base, rate, result: req, formula: `${acFmtR(base)} × ${rate}%` });
    if (!lines.length) return { status: "NO_ENTRY_REQUIRED", reason: "The provision already equals the required amount — no entry is needed." };
    return { lines, narration: cx.original + ` (${acFmtR(base)} × ${rate}% = ${acFmtR(req)}${ex ? "; existing " + acFmtR(ex) : ""})`, tag: "adjustment", assumptions, warnings, calcs, confidence: 0.9, interpreter: "provision",
      components: lines.map(l => ({ account: l.account, side: l.dr !== undefined ? "dr" : "cr", amount: l.dr !== undefined ? l.dr : l.cr, role: "provision", sourceClause: "", confidence: 1 })) };
  }
  if (!hasDD && !discDeb) return null;
  let D = A(["debtors", "sundry debtors"]);
  const hasBad = /bad debts?|written off|irrecoverable/.test(t);
  let B = hasBad ? A(["further bad debts", "bad debts", "bad debt", "written off"]) : 0;
  if (hasBad && (B === null || B === D)) return { status: "UNCERTAIN", reason: "Bad debts and provision — state the debtors total, the bad debts amount and the provision rate so the provision can be calculated on the adjusted debtors." };
  if (D === null) { D = bal("debtors"); if (D > 0) assumptions.push(`Debtors ${acFmtR(D)} taken from the ledger.`); else return { status: "UNCERTAIN", reason: "Provision on debtors — state the debtors figure (or record the debtors first)." }; }
  const party = cx.party;
  if (B > 0) { acAddLine(lines, "Bad Debts", "dr", B); acAddLine(lines, party || "Debtors", "cr", B); }
  const adjusted = acRound2(D - (B || 0));
  const parts = [`debtors ${acFmtR(D)}${B ? " − bad debts " + acFmtR(B) + " = " + acFmtR(adjusted) : ""}`];
  let newDD = 0;
  if (hasDD) {
    const p = acRateAfter(t, "provision for (?:bad and )?doubtful debts|provision for bad debts|reserve for bad debts|provision|reserve") || acRateBefore(t, "provision(?! for discount)|reserve") || 0;
    if (!p) return { status: "UNCERTAIN", reason: "Provision for doubtful debts — the rate (%) is not clear." };
    newDD = acRound2(adjusted * p / 100);
    const statedEx = A(["existing provision", "old provision", "opening provision", "already"]);
    const ex = statedEx !== null && statedEx !== D && statedEx !== B ? statedEx : -bal("provision_for_doubtful_debts");
    const diff = adjust("Provision for Doubtful Debts", ex, newDD, false);
    parts.push(`provision ${p}% = ${acFmtR(newDD)}${ex ? " (existing " + acFmtR(ex) + " → " + (diff >= 0 ? "increase " : "decrease ") + acFmtR(Math.abs(diff)) + ")" : ""}`);
    calcs.push({ kind: "provision", inputs: [D, B || 0, ex], base: adjusted, rate: p, result: newDD, formula: `(${acFmtR(D)} − ${acFmtR(B || 0)}) × ${p}%` });
  }
  if (discDeb) {
    const d = acRateAfter(t, "provision for discount on debtors|discount on debtors|provision for discount|discount") || acRateBefore(t, "discount") || 0;
    if (!d) return { status: "UNCERTAIN", reason: "Provision for discount on debtors — the rate (%) is not clear." };
    const base2 = acRound2(adjusted - newDD);   // after bad debts AND the doubtful-debts provision
    const req = acRound2(base2 * d / 100);
    const ex = -bal("provision_for_discount_on_debtors");
    adjust("Provision for Discount on Debtors", ex, req, false);
    parts.push(`discount provision ${d}% on ${acFmtR(base2)} = ${acFmtR(req)}`);
    calcs.push({ kind: "provision", inputs: [adjusted, newDD, ex], base: base2, rate: d, result: req, formula: `(${acFmtR(adjusted)} − ${acFmtR(newDD)}) × ${d}%` });
  }
  if (!lines.length) return { status: "NO_ENTRY_REQUIRED", reason: "The provision already equals the required amount — no entry is needed." };
  return { lines, narration: cx.original + ` (${parts.join("; ")})`, tag: "adjustment", assumptions, warnings, calcs, confidence: 0.9, interpreter: "provision", party,
    components: lines.map(l => ({ account: l.account, side: l.dr !== undefined ? "dr" : "cr", amount: l.dr !== undefined ? l.dr : l.cr, role: "provision", sourceClause: "", confidence: 1 })) };
}

/* ---- I12. INSOLVENT DEBTOR (uses the recorded balance when the sentence omits it) ---- */
// "60 paise in a rupee" / "60 paise per rupee" is a dividend RATE (60%), not a money amount — the
// "60" is already masked out of cx.amounts (see acMaskNonMoney), so it has to be read from the
// original sentence directly, exactly like a written-out "60%" would be for any other calculation.
// The base figure for "Capital ₹1,00,000" / "Drawings for the month ₹12,000" — deliberately NOT
// the generic nearest-amount lookup, because "Interest on Capital @6%" and "Interest on Drawings
// @10%" both mention the very same word right next to a PERCENTAGE, which would otherwise be
// (wrongly) treated as the nearest match to whichever figure appears later in the sentence.
function acBaseFigureFor(text, word) {
  const re = new RegExp("(?<!on\\s)\\b" + word + "\\b[^.;]{0,30}?(?:₹|rs\\.?|inr\\b)?\\s*([\\d,]+(?:\\.\\d+)?)\\b(?!\\s*%)", "i");
  const m = re.exec(text);
  return m ? parseFloat(m[1].replace(/,/g, "")) : null;
}
function acPaiseDividendRate(text) {
  const m = /(\d+(?:\.\d+)?)\s*paise\s+(?:in|per)\s+(?:a|the|1|one)?\s*rupee/i.exec(text);
  return m ? parseFloat(m[1]) : 0;
}
function acInterpInsolvency(cx) {
  const t = cx.text;
  if (!/insolvent|bankrupt/.test(t) || /recovered[^.;]*bad debt|bad debt[^.;]*recovered/.test(t)) return null;
  const party = cx.party; const st = cx.state;
  const paiseRate = acPaiseDividendRate(cx.original);
  const tagged = acTagAmounts(cx, [
    { role: "rec", before: [/(?:received|recovered|paid|realised|dividend of|settlement of)\s*(?:only\s+)?$/], after: [/^\s*(?:was |were )?(?:received|recovered|paid)/] },
    { role: "owed", before: [/(?:owed|owing|due|balance of|dues of|debt of|was due|account of|amount of|debtor for|debtor of|a debtor of|owes)\s*(?:us\s+)?$/], after: [/^\s*(?:was |were )?(?:due|owed|outstanding)\b/] }]);
  let owed = (tagged.find(a => a.role === "owed") || {}).value ?? null, rec = (tagged.find(a => a.role === "rec") || {}).value ?? null;
  const plain = tagged.filter(a => !a.role).map(a => a.value);
  const pct = paiseRate || (cx.percents.length ? cx.percents[0].value : 0);
  if (owed === null && rec === null && plain.length >= 2) { owed = Math.max(...plain); rec = Math.min(...plain); }
  else if (owed === null && plain.length === 1 && rec !== null) owed = plain[0];
  else if (owed === null && plain.length === 1 && rec === null && !pct && !/received|recovered|paid|settlement/.test(t)) owed = plain[0];
  else if (rec === null && plain.length === 1 && owed !== null) rec = plain[0];
  const assumptions = [];
  if (owed === null && party) { const b = st.partyBalances[party.toLowerCase()]; if (b > 0) { owed = b; assumptions.push(`Amount due ${acFmtR(b)} taken from ${party}'s recorded balance.`); } }
  if (owed === null && !party) { const d = -0; }
  if (owed === null) return { status: "UNCERTAIN", reason: "Insolvent debtor — the amount that was due is not stated and no earlier balance of this debtor is recorded." };
  if (rec === null && pct) { rec = acRound2(owed * pct / 100); if (paiseRate) assumptions.push(`Dividend of ${paiseRate} paise in the rupee = ${paiseRate}% of the amount due.`); }
  rec = rec === null ? 0 : rec;
  if (rec > owed + 0.01) return { status: "INVALID", reason: "The amount recovered is more than the amount due." };
  const bad = acRound2(owed - rec), money = cx.pm.mode === "bank" ? "Bank" : "Cash";
  const lines = []; if (rec > 0) acAddLine(lines, money, "dr", rec); if (bad > 0) acAddLine(lines, "Bad Debts", "dr", bad); acAddLine(lines, party || "Debtors", "cr", owed);
  if (rec > 0 && !cx.pm.mode) assumptions.push("No payment mode stated — cash assumed.");
  return { lines, narration: cx.original + ` (due ${acFmtR(owed)}, recovered ${acFmtR(rec)}, bad debt ${acFmtR(bad)})`, tag: "debtor", party, assumptions, calcs: [{ kind: "insolvency", inputs: [owed, rec], result: bad }], confidence: 0.9, interpreter: "insolvency",
    components: lines.map(l => ({ account: l.account, side: l.dr !== undefined ? "dr" : "cr", amount: l.dr !== undefined ? l.dr : l.cr, role: "insolvency", sourceClause: "", confidence: 1 })) };
}

/* ---------- C2. UNDERSTAND → VALIDATE → COMMIT ---------- */

function acClassifyLegacyFailure(reason) {
  if (/no journal entry required|does not affect the business books/i.test(reason)) return "NO_ENTRY_REQUIRED";
  if (/Couldn't confidently identify|Internal check failed/i.test(reason)) return "INVALID";
  return "UNCERTAIN";
}
function acLegacyAccountToComponents(lines) {
  return lines.map(l => ({ account: l.account, side: l.dr !== undefined ? "dr" : "cr", amount: l.dr !== undefined ? l.dr : l.cr, role: "line", sourceClause: "", confidence: 0.8 }));
}
// Stage 1 — understand the whole sentence once.
// Section 50/51 — instruction lines ("Prepare Journal Entries for the following
// transactions:") and stated calculation assumptions ("Assume total drawings for the
// month are ₹12,000 for calculation purposes.") describe the QUESTION, not an event in the
// business's books. Recognising them here — before any interpreter gets a chance to read a
// number in them as a real transaction — is what keeps the calculation-data described in
// section 51 from turning into a phantom Drawings/Cash entry.
const AC_INSTRUCTION_LINE_RE = /^\s*(?:prepare|pass|record|journalise|journalize|show|give|draft|write|post)\b[^.;]{0,80}\b(?:journal(?:\s+entr(?:y|ies))?|ledger|trial\s+balance|final\s+accounts?|entr(?:y|ies))\b[^.;]{0,60}:?\s*$|^\s*(?:from the following|for the following|the following (?:transactions|information|particulars))[^.;]*:?\s*$|^\s*journalise\s+the\s+following[^.;]*:?\s*$|^\s*journalize\s+the\s+following[^.;]*:?\s*$/i;
function acIsInstructionLine(text) { return AC_INSTRUCTION_LINE_RE.test(text.trim().replace(/\.\s*$/, "")); }
function acIsAssumptionLine(text) { return /^\s*assum(?:e|ing|ption)\b/i.test(text.trim()) || /\bfor\s+calculation\s+purposes\b|\bassumed\s+for\s+calculation\b/i.test(text); }
// A section title ("Transfer / Adjustment Entries", "Additional Information") — never has a number,
// never has a verb, and reads as a label rather than a sentence.
const AC_HEADING_LINE_RE = /^\s*[A-Za-z][A-Za-z&\/'\s]{0,60}\s*:?\s*$/;
function acIsHeadingLine(text) {
  const s = text.trim();
  if (!s || /\d/.test(s) || /[.!?]$/.test(s)) return false;
  if (!AC_HEADING_LINE_RE.test(s)) return false;
  if (AC_TRANSACTION_VERB_RE.test(s)) return false;
  return /\b(entries|entry|adjustments?|transfer|particulars|workings?|notes?|balances?|information|transactions?|accounts?|ledger|journal|summary|additional)\b/i.test(s);
}

// A line that is ONLY a closing-stock figure — no sale, purchase, loss or other transaction
// mixed in with it. Anything else falls through to the normal interpreters untouched.
function acInterpClosingStock(cx) {
  const t = cx.text.trim().replace(/[.。]\s*$/, "");
  if (!/\b(closing stock|closing inventory|stock at the end|inventory at the end|value of closing stock)\b/.test(t)) return null;
  if (cx.amounts.length === 0 || cx.pm.cash || cx.pm.bank || cx.pm.credit) return null;
  if (/\b(sold|sale|purchas|bought|destr|lost|fire|theft|depreciat|adjust|provide|provision|outstanding| prepaid|accrued|return|allowance)\b/.test(t)) return null;
  return {
    ok: false, status: "NO_ENTRY_REQUIRED",
    reason: "Closing stock is not a journal transaction — it is used directly when preparing the Trading and Profit & Loss Account and the Balance Sheet, so it is entered as the cycle's closing-stock figure rather than as an entry.",
    narration: cx.original, tag: "no-entry", interpreter: "closing-stock", assumptions: [], warnings: [], calcs: [], components: [], confidence: 1
  };
}
function acUnderstand(original, idx, staged, date) {
  if (acIsInstructionLine(original)) return { status: "NO_ENTRY_REQUIRED", reason: "This is an instruction describing what to prepare, not a transaction — it does not affect the business's books." };
  if (acIsAssumptionLine(original)) return { status: "NO_ENTRY_REQUIRED", reason: "This states a figure to be used in a later calculation, not a transaction on its own — it does not create a journal entry by itself." };
  if (acIsHeadingLine(original)) return { status: "NO_ENTRY_REQUIRED", reason: "This reads as a heading or section title, not a transaction — it does not affect the business's books." };
  // Closing stock is not a transaction — it is a figure the Final Accounts are built from, and the
  // engine takes it as acRunCycle's own parameter. Reporting it as INVALID told students their
  // perfectly correct adjusting figure was wrong.
  const opening = acParseOpeningEntry(original, idx);
  if (opening && opening.ok === false) return { status: opening.status || "UNCERTAIN", reason: opening.reason, cx: null };
  if (opening) return { lines: opening.lines, narration: "Opening entry", tag: "opening", interpreter: "opening", assumptions: [], warnings: [], calcs: [], components: acLegacyAccountToComponents(opening.lines), confidence: 1 };
  const cx = acMakeCx(original, staged, date);
  const contra = acFindContradiction(cx);
  if (contra) return { status: "INVALID", reason: contra, cx };
  // A lone "Closing stock ₹25,000." line is not a transaction: closing stock is a FIGURE the
  // Trading & P/L and Balance Sheet are built from, and the engine takes it as acRunCycle's own
  // parameter. Reported as INVALID it told students their correct adjusting figure was wrong.
  // Placed after the interpreters so "…; closing stock ₹12,000." still posts the sale itself.
  const chain = [acInterpRectification, acInterpPurposeSplit, acInterpCompound, acInterpGst, acInterpPartialPaymentWithRateDiscount, acInterpSettlement, acInterpCheque, acInterpBills, acInterpPartyPays, acInterpRemainingLossWrittenOff, acInterpSplit, acInterpCapitalDrawingsInterest, acInterpProvision, acInterpInsolvency, acInterpDepreciation, acInterpDisposal, acInterpLoss, acInterpPeriodSplit, acInterpPersonal, acInterpClosingStock];
  for (const fn of chain) {
    const r = fn(cx);
    if (r) { r.cx = cx; return r; }
  }
  // Fallback interpreter: the original rule chain (single-event sentences). It only
  // ever mutates the STAGED state; nothing it does is kept unless validation passes.
  const r = acLegacyParse(original, idx, staged);
  if (r && r.ok) return { lines: r.lines, narration: r.narration, tag: r.tag, warnings: [], assumptions: [], calcs: [], components: acLegacyAccountToComponents(r.lines), confidence: 0.8, interpreter: "rule-chain", cx };
  return { status: acClassifyLegacyFailure(r ? r.reason : ""), reason: r ? r.reason : "Could not read this transaction.", cx, interpreter: "rule-chain" };
}

// Canonical, identity-carrying journal lines (one account = one id everywhere).
function acCanonLines(lines) {
  const out = [];
  lines.forEach(l => {
    const meta = acAccountMeta(l.account);
    const side = l.dr !== undefined ? "dr" : "cr";
    const amount = acRound2(l[side]);
    if (!(amount > 0)) return;
    out.push({ account: meta.display, accountId: meta.id, category: meta.category, [side]: amount });
  });
  // merge same (account, side) — never a Dr with a Cr
  const merged = [];
  out.forEach(l => {
    const side = l.dr !== undefined ? "dr" : "cr";
    const ex = merged.find(m => m.accountId === l.accountId && m[side] !== undefined);
    if (ex) ex[side] = acRound2(ex[side] + l[side]); else merged.push({ ...l });
  });
  return merged;
}

/* --- Stage 3: validation --- */
function acSubsetSum(arr, target, i = 0, sum = 0, used = 0) {
  if (Math.abs(sum - target) < 0.011 && used >= 2) return true;
  if (i >= arr.length || sum > target + 0.011) return false;
  return acSubsetSum(arr, target, i + 1, sum + arr[i], used + 1) || acSubsetSum(arr, target, i + 1, sum, used);
}
function acAmountExplained(a, lines, cx, ev) {
  const near = (x, y) => Math.abs(x - y) < 0.011;
  const vals = lines.map(l => l.dr !== undefined ? l.dr : l.cr);
  if (vals.some(v => near(v, a))) return true;
  for (const side of ["dr", "cr"]) { const arr = lines.filter(l => l[side] !== undefined).map(l => l[side]); if (arr.length <= 14 && acSubsetSum(arr, a)) return true; }
  for (let i = 0; i < vals.length; i++) for (let j = 0; j < vals.length; j++) if (i !== j && near(Math.abs(vals[i] - vals[j]), a)) return true;
  if ((ev.calcs || []).some(c => (c.inputs || []).some(x => x !== null && near(x, a)))) return true;
  const added = ev.narration && cx ? ev.narration.slice(cx.original.length) : "";
  if (added && (added.includes(acFmt(a)) || added.includes(String(a)))) return true;
  const ps = cx ? cx.percents.map(p => p.value) : [];
  const cand = [];
  ps.forEach(p => { cand.push(a * p / 100, a * (1 - p / 100), a / (1 + p / 100), a - a / (1 + p / 100), a * (1 + p / 100), a * p / (100 + p)); });
  ps.forEach(p => ps.forEach(q => { if (p !== q) cand.push(a * (1 - p / 100) * (1 - q / 100), a * (1 - p / 100) * q / 100); }));
  if (cand.some(c => vals.some(v => near(c, v)))) return true;
  // a base amount whose percentage-derived value (or a further percentage of it) appears in the entry
  for (const c of cand) for (const q of ps) if (vals.some(v => near(c * q / 100, v) || near(c * (1 - q / 100), v))) return true;
  return false;
}
function acHasAccount(lines, re) { return lines.some(l => re.test(l.account)); }
function acValidate(ev, lines, cx, state) {
  const warnings = (ev.warnings || []).slice();
  if (!lines.length) return { status: "INVALID", reason: "No journal lines were produced.", warnings };
  const dr = acSum(lines, "dr"), cr = acSum(lines, "cr");
  if (Math.abs(dr - cr) >= 0.01) return { status: "INVALID", reason: `Debit (${acFmtR(dr)}) and credit (${acFmtR(cr)}) do not balance for this transaction.`, warnings };
  if (!cx) return { status: "VALID", warnings };
  const t = cx.text;
  // role sanity: a pure payment must never debit an income account (e.g. "Paid commission" ≠ Commission Received)
  if (/\bpaid\b|\bpay\b/.test(t) && !/\breceived|refund|return|reversal|allowed|discount|recovered|rebate|claim|reimburs/.test(t)) {
    const bad = lines.find(l => l.dr !== undefined && ["indirect_inc", "direct_inc", "sales", "disposal_gain"].includes(l.category) && l.category !== "sales");
    if (bad) return { status: "INVALID", reason: `The verb "paid" makes this an expense/payment, but the entry debits an income account (${bad.account}).`, warnings };
  }
  // payment mode must match the wording (Payment is a separate role from the items)
  if (!/endors|deposit|withdr|opened|contra/.test(t)) {
    const cashWord = cx.pm.cash && !cx.pm.bank && !cx.pm.credit, bankWord = cx.pm.bank && !cx.pm.cash && !cx.pm.credit;
    if (cashWord && !acHasAccount(lines, /^Cash A\/c$/)) return { status: "UNCERTAIN", reason: "The sentence says the payment was in cash, but the entry has no Cash account — the payment mode could not be matched.", warnings };
    if (bankWord && !acHasAccount(lines, /^(?:Bank|Cheques? (?:in Hand|Sent for Collection)|Bills? (?:Receivable|Payable)|Bank Overdraft|Bank Loan)/)) return { status: "UNCERTAIN", reason: "The sentence says the payment was by cheque/bank, but the entry has no Bank account — the payment mode could not be matched.", warnings };
  }
  // semantic coverage: every material amount must be represented (Dr = Cr alone is NOT proof of understanding)
  if (ev.tag !== "opening") {
    const missing = cx.amounts.map(a => a.value).filter((v, i, arr) => arr.indexOf(v) === i).filter(v => !acAmountExplained(v, lines, cx, ev));
    if (missing.length) return { status: "UNCERTAIN", reason: `The amount${missing.length > 1 ? "s" : ""} ${missing.map(acFmtR).join(", ")} in the sentence ${missing.length > 1 ? "are" : "is"} not represented in the journal entry the engine produced, so the entry may be incomplete or wrong.`, warnings };
  }
  return { status: "VALID", warnings };
}

/* --- Stage 4: commit — state is DERIVED from the validated lines (one accounting truth) --- */
function acEnsureAsset(state, label) {
  if (!state.assets[label]) state.assets[label] = { label, cost: 0, accDep: 0, bookValue: 0, method: null, rate: null, acquired: [], depCharges: [] };
  return state.assets[label];
}
function acCommit(state, ev, lines, date) {
  const changes = [];
  const touch = (name, delta) => changes.push({ type: "balance", account: name, delta });
  lines.forEach(l => {
    const d = (l.dr || 0) - (l.cr || 0);
    state.balances[l.accountId] = acRound2((state.balances[l.accountId] || 0) + d);
    touch(l.account, d);
    if (l.accountId === "cash") state.cashBalance = acRound2(state.cashBalance + d);
    if (l.accountId === "bank") state.bankBalance = acRound2(state.bankBalance + d);
    if (l.category === "personal") { const key = l.account.replace(/ A\/c$/, "").toLowerCase(); state.partyBalances[key] = acRound2((state.partyBalances[key] || 0) + d); }
    const gm = /^(input|output) (cgst|sgst|igst)$/i.exec(l.account.replace(/ A\/c$/, ""));
    if (gm) { const k = gm[1].toLowerCase() + gm[2].toUpperCase(); state.gstBalances[k] = acRound2((state.gstBalances[k] || 0) + (gm[1].toLowerCase() === "input" ? d : -d)); }
    if (l.accountId === "cheques_in_hand" && l.dr) state.lastChequeAmount = l.dr;
  });
  const personal = lines.find(l => l.category === "personal");
  if (personal) state.lastParty = personal.account.replace(/ A\/c$/, "");
  else if (ev.party) state.lastParty = ev.party;
  // asset register
  const depLine = lines.find(l => l.accountId === "depreciation" && l.dr);
  lines.filter(l => l.category === "asset_fixed").forEach(l => {
    const a = acEnsureAsset(state, l.account.replace(/ A\/c$/, ""));
    if (l.dr) { a.cost = acRound2(a.cost + l.dr); a.bookValue = acRound2(a.bookValue + l.dr); a.acquired.push(date || null); changes.push({ type: "asset+", asset: a.label, amount: l.dr }); }
    else if (l.cr) {
      if (ev.stateOps && ev.stateOps.dep && ev.stateOps.dep.label === a.label) {
        const d = ev.stateOps.dep; a.accDep = acRound2(a.accDep + d.amount); a.bookValue = acRound2(a.cost - a.accDep); a.method = d.method; a.rate = d.rate; a.depCharges.push(d.amount);
        changes.push({ type: "asset-dep", asset: a.label, amount: d.amount });
      } else if (depLine && !ev.stateOps) { a.accDep = acRound2(a.accDep + l.cr); a.bookValue = acRound2(a.cost - a.accDep); a.depCharges.push(l.cr); changes.push({ type: "asset-dep", asset: a.label, amount: l.cr }); }
      else {
        // disposal
        const accDepLine = lines.find(x => x.accountId === "accumulated_depreciation" && x.dr);
        if (accDepLine && ev.stateOps && ev.stateOps.dispose && ev.stateOps.dispose.cost) { a.cost = acRound2(a.cost - l.cr); a.accDep = Math.max(0, acRound2(a.accDep - accDepLine.dr)); a.bookValue = acRound2(a.cost - a.accDep); }
        else if (l.cr >= a.bookValue - 0.01) { a.cost = 0; a.accDep = 0; a.bookValue = 0; }
        else { const f = l.cr / a.bookValue; a.cost = acRound2(a.cost * (1 - f)); a.accDep = acRound2(a.accDep * (1 - f)); a.bookValue = acRound2(a.cost - a.accDep); }
        changes.push({ type: "asset-", asset: a.label, amount: l.cr });
        if (a.cost <= 0.004) delete state.assets[a.label];
      }
    }
  });
  Object.values(state.assets).forEach(a => { state.assetBook[a.label] = a.bookValue; });
  Object.keys(state.assetBook).forEach(k => { if (!state.assets[k]) state.assetBook[k] = 0; });
  // loss & insurance
  if (ev.tag === "loss") {
    const p = lines.find(l => l.accountId === "purchases" && l.cr); if (p) state.loss.gross = acRound2(state.loss.gross + p.cr);
  }
  lines.forEach(l => {
    if (l.accountId === "insurance_claim") { if (l.dr) state.loss.claimAdmitted = acRound2(state.loss.claimAdmitted + l.dr); if (l.cr) state.loss.claimReceived = acRound2(state.loss.claimReceived + l.cr); }
  });
  // cheque register (derived from the validated lines / the interpreter's op)
  const chq = ev.cheque;
  if (chq && chq.ref) {
    const c = acLastCheque(state, chq.ref.party, [chq.ref.status]);
    if (c) c.status = chq.op === "dishonour" ? "dishonoured" : chq.op === "endorse" ? "endorsed" : chq.op === "send" ? "sent" : "collected";
    changes.push({ type: "cheque", op: chq.op, amount: chq.amount });
  } else {
    const chDr = lines.find(l => l.accountId === "cheques_in_hand" && l.dr);
    if (chDr && personal) { state.cheques.push({ party: personal.account.replace(/ A\/c$/, ""), amount: chDr.dr, status: "inHand" }); changes.push({ type: "cheque", op: "receive", amount: chDr.dr }); }
    const dep = lines.find(l => l.accountId === "cheques_in_hand" && l.cr), bankDr = lines.find(l => l.accountId === "bank" && l.dr);
    if (dep && bankDr) { const c = state.cheques.slice().reverse().find(x => x.status === "inHand" && Math.abs(x.amount - dep.cr) < 0.011); if (c) c.status = "deposited"; }
  }
  // bills
  const b = ev.bill;
  if (b) {
    if (b.op === "draw" || b.op === "accept") state.bills.push({ type: b.type, party: b.party || null, amount: b.amount, status: "open" });
    else {
      const bill = acLastBill(state, b.type, b.party, b.op === "settle" ? ["open"] : b.op === "discount" ? ["open"] : ["open", "discounted", "dishonoured"]);
      if (bill) bill.status = b.op === "discount" ? "discounted" : b.op === "dishonour" ? "dishonoured" : b.op === "renew" ? "renewed" : b.op === "settle" ? "settled" : bill.status;
      if (b.op === "renew") state.bills.push({ type: b.type, party: b.party || null, amount: b.newAmount, status: "open" });
    }
    changes.push({ type: "bill", op: b.op, bill: b });
  } else {
    const brDr = lines.find(l => l.accountId === "bills_receivable" && l.dr), bpCr = lines.find(l => l.accountId === "bills_payable" && l.cr);
    if (brDr && (lines.some(l => l.category === "personal" && l.cr) || ev.interpreter === "rule-chain")) state.bills.push({ type: "BR", party: personal ? personal.account.replace(/ A\/c$/, "") : null, amount: brDr.dr, status: "open" });
    if (bpCr) state.bills.push({ type: "BP", party: personal ? personal.account.replace(/ A\/c$/, "") : null, amount: bpCr.cr, status: "open" });
  }
  return changes;
}

// Public entry point — signature unchanged (tutor-engine.js and the UI both call this).
function acParseTransaction(rawText, idx, ctx) {
  const original = (rawText || "").trim();
  if (!original) return null;
  ctx = ctx || {};
  acEnsureState(ctx);
  const foundDate = acExtractDate(original);
  if (foundDate) ctx.lastDate = acNormalizeDate(foundDate);   // a date written in the input is input structure, not accounting state
  const date = ctx.lastDate || null;
  const staged = acCloneState(ctx);                            // everything below mutates ONLY this clone
  let ev;
  try { ev = acUnderstand(original, idx, staged, date); }
  catch (e) { ev = { status: "INVALID", reason: "Internal error while reading this transaction (" + e.message + ")." }; }
  const base = { index: idx, text: original, date };
  if (ev.status && ev.status !== "VALID" && !ev.lines) {
    return Object.assign(base, { ok: false, status: ev.status, reason: ev.reason, warnings: [], assumptions: [], calcs: [], components: [], identifiedAccounts: (ev.identified || []).map(x => x.account), identifiedAmounts: (ev.identified || []).map(x => x.amount), stateChanges: [], confidence: 0 });
  }
  const lines = acCanonLines(ev.lines || []);
  const v = acValidate(ev, lines, ev.cx, ctx);
  const result = Object.assign(base, {
    status: v.status, ok: v.status === "VALID", lines: lines.map(l => ({ ...l })), narration: ev.narration || original, tag: ev.tag || "unclassified",
    warnings: v.warnings, warning: v.warnings[0] || null, assumptions: ev.assumptions || [], calcs: ev.calcs || [], components: ev.components || [],
    confidence: v.status === "VALID" ? (ev.confidence || 0.8) : 0.3, interpreter: ev.interpreter || "unknown",
    identifiedAccounts: lines.map(l => l.account), identifiedAmounts: lines.map(l => l.dr !== undefined ? l.dr : l.cr), stateChanges: [], party: ev.party || null
  });
  if (v.status === "VALID") {
    // negative-cash advisory (never blocks): computed from the committed balance + this entry
    const cashDelta = lines.filter(l => l.accountId === "cash").reduce((s, l) => s + (l.dr || 0) - (l.cr || 0), 0);
    if (ctx.cashBalance + cashDelta < -0.01) { const w = `This leaves Cash at a negative balance (₹${acFmt(ctx.cashBalance + cashDelta)}), which isn't possible — a cash account can't go below zero the way a bank account can with an overdraft. Please check the cash figures in this transaction and the ones before it.`; result.warnings.push(w); result.warning = result.warning || w; }
    result.stateChanges = acCommit(ctx, ev, lines, date);
  } else {
    result.reason = v.reason;
    result.proposedLines = result.lines; delete result.lines;
  }
  return result;
}

/* ---------- C3. PIPELINE DRIVER (used by the UI and by tests) ---------- */
function acLineDateKey(dateStr) {
  const m = /^([A-Za-z]+)\s+(\d{1,2})(?:,\s*(\d{4}))?/.exec(dateStr || ""); if (!m) return null;
  const mi = AC_MONTH_IDX[m[1].slice(0, 3).toLowerCase()]; if (mi === undefined) return null;
  return (m[3] ? parseInt(m[3], 10) : 0) * 10000 + ((mi + 9) % 12) * 100 + parseInt(m[2], 10);   // Indian financial year: Apr → Mar
}
// Process in chronological order (stable: identical dates keep input order; undated lines
// inherit the date of the line above them and travel with it).
function acChronological(rawLines) {
  let last = null; let anyDate = false;
  const rows = rawLines.map((line, i) => {
    const d = acExtractDate(line); if (d) { last = acNormalizeDate(d); anyDate = true; }
    return { line, index: i + 1, key: last ? acLineDateKey(last) : null, pos: i };
  });
  if (!anyDate) return rows;
  rows.forEach(r => { if (r.key === null) r.key = -1; });
  return rows.slice().sort((a, b) => a.key - b.key || a.pos - b.pos);
}
function acRunCycle(rawText, closingStock) {
  const cleaned = String(rawText || "").split(/\r?\n/).map(l => l.replace(/^\s*\d+[\.\)]\s*/, "").trim()).filter(Boolean);
  const rawLines = acMergeOpeningBalanceLines(cleaned);
  const ordered = acChronological(rawLines);
  const ctx = {}; const results = [];
  ordered.forEach(o => { const r = acParseTransaction(o.line, o.index, ctx); if (r) results.push(r); });
  const parsed = results.filter(r => r.status === "VALID");
  const needsReview = results.filter(r => r.status === "UNCERTAIN" || r.status === "INVALID");
  const noEntry = results.filter(r => r.status === "NO_ENTRY_REQUIRED");
  const journalLines = [];
  parsed.forEach(r => { acAttachParticulars(r.lines).forEach(l => journalLines.push({ account: l.account, accountId: l.accountId, category: l.category, dr: l.dr, cr: l.cr, txnIndex: r.index, particulars: l.particulars, date: r.date })); });
  const ledgers = acBuildLedgers(journalLines);
  const tb = acBuildTrialBalance(ledgers, journalLines, needsReview.length);
  const fa = acBuildFinalAccounts(ledgers, closingStock || 0);
  return { rawLines, results, parsed, failures: needsReview.concat(noEntry), needsReview, noEntry, journalLines, ledgers, tb, fa, closingStock: closingStock || 0, state: ctx,
    summary: { total: results.length, processed: parsed.length, needsReview: needsReview.length, noEntry: noEntry.length }, incomplete: needsReview.length > 0 };
}
/* ---------- LEDGER / TRIAL BALANCE ---------- */

// Attaches proper ledger "particulars" to each line of a single journal
// entry — the counter account name (e.g. "Cash A/c") for a simple 2-line
// entry, or "Sundries" for a compound entry with more than one line on
// the other side. This is what the Ledger tab shows instead of a bare
// transaction number.
function acAttachParticulars(rLines) {
  const drAccounts = rLines.filter(l => l.dr !== undefined).map(l => l.account);
  const crAccounts = rLines.filter(l => l.cr !== undefined).map(l => l.account);
  return rLines.map(l => {
    if (l.dr !== undefined) return { ...l, particulars: crAccounts.length === 1 ? crAccounts[0] : "Sundries" };
    return { ...l, particulars: drAccounts.length === 1 ? drAccounts[0] : "Sundries" };
  });
}

// Ledger = pure aggregation of the (validated) Journal, keyed by the stable account identity.
function acBuildLedgers(journalLines) {
  const ledgers = {}; // canonical display name -> { id, name, dr: [], cr: [], totalDr, totalCr }
  journalLines.forEach(l => {
    const meta = acAccountMeta(l.account);
    const key = meta.display;
    if (!ledgers[key]) ledgers[key] = { name: key, id: meta.id, category: meta.category, dr: [], cr: [], totalDr: 0, totalCr: 0 };
    const led = ledgers[key];
    if (l.dr) { led.dr.push({ amount: l.dr, txnIndex: l.txnIndex, particulars: l.particulars, date: l.date }); led.totalDr = acRound2(led.totalDr + l.dr); }
    if (l.cr) { led.cr.push({ amount: l.cr, txnIndex: l.txnIndex, particulars: l.particulars, date: l.date }); led.totalCr = acRound2(led.totalCr + l.cr); }
  });
  Object.values(ledgers).forEach(led => {
    led.balance = acRound2(led.totalDr - led.totalCr);
    led.balanceSide = led.balance > 0 ? "dr" : led.balance < 0 ? "cr" : "nil";
  });
  return ledgers;
}

// Trial Balance = pure aggregation of the Ledger, plus integrity checks against the Journal.
function acBuildTrialBalance(ledgers, journalLines, excludedCount) {
  const rows = Object.values(ledgers)
    .filter(l => Math.abs(l.balance) > 0.004)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(l => ({ account: l.name, accountId: l.id, debit: l.balance > 0 ? Math.abs(l.balance) : 0, credit: l.balance < 0 ? Math.abs(l.balance) : 0 }));
  const totalDebit = acRound2(rows.reduce((s, r) => s + r.debit, 0));
  const totalCredit = acRound2(rows.reduce((s, r) => s + r.credit, 0));
  const tb = { rows, totalDebit, totalCredit, balanced: Math.abs(totalDebit - totalCredit) < 0.02 };
  if (journalLines) {
    const jd = acRound2(journalLines.reduce((s, l) => s + (l.dr || 0), 0)), jc = acRound2(journalLines.reduce((s, l) => s + (l.cr || 0), 0));
    const ld = acRound2(Object.values(ledgers).reduce((s, l) => s + l.totalDr, 0)), lc = acRound2(Object.values(ledgers).reduce((s, l) => s + l.totalCr, 0));
    const ids = Object.values(ledgers).map(l => l.id);
    tb.checks = {
      journalDebit: jd, journalCredit: jc, journalBalanced: Math.abs(jd - jc) < 0.02,
      ledgerMatchesJournal: Math.abs(jd - ld) < 0.02 && Math.abs(jc - lc) < 0.02,
      noDuplicateAccounts: new Set(ids).size === ids.length,
      excludedTransactions: excludedCount || 0
    };
    tb.checks.ok = tb.checks.journalBalanced && tb.checks.ledgerMatchesJournal && tb.checks.noDuplicateAccounts;
  }
  return tb;
}

/* ---------- FINAL ACCOUNTS — classified by ACCOUNT METADATA, not by display strings ---------- */
function acBuildFinalAccounts(ledgers, closingStock) {
  const trading = { dr: [], cr: [] }, pl = { dr: [], cr: [] };
  const bsAssets = [], bsLiabilities = [], warnings = [];
  let capitalBalance = 0, drawingsBalance = 0;
  let purchases = 0, purchaseReturns = 0, sales = 0, salesReturns = 0, stockBal = 0;
  let provDD = 0, provDisc = 0, provCreditors = 0, inputGST = 0, outputGST = 0;
  const label = led => led.name.replace(/ A\/c$/, "");
  const plGroups = {};   // "Profit & Loss A/c" entries grouped by their counter-account
  const list = Object.values(ledgers).map(l => ({ l, m: acAccountMeta(l.name) }));

  list.forEach(({ l, m }) => {
    const bal = l.balance, abs = acRound2(Math.abs(bal));
    if (abs < 0.005) return;
    const asAsset = (lab, note) => bsAssets.push({ label: lab || label(l), amount: abs });
    const asLiab = (lab) => bsLiabilities.push({ label: lab || label(l), amount: abs });
    const bySide = (lab, drText, crText) => { if (bal > 0) bsAssets.push({ label: drText ? lab + drText : lab, amount: abs }); else bsLiabilities.push({ label: crText ? lab + crText : lab, amount: abs }); };
    switch (m.category) {
      case "purchases": purchases = acRound2(purchases + bal); break;
      case "purchase_returns": purchaseReturns = acRound2(purchaseReturns - bal); break;
      case "sales": sales = acRound2(sales - bal); break;
      case "sales_returns": salesReturns = acRound2(salesReturns + bal); break;
      case "direct_exp": if (bal > 0) trading.dr.push({ label: label(l), amount: abs }); else trading.cr.push({ label: label(l), amount: abs }); break;
      case "direct_inc": if (bal < 0) trading.cr.push({ label: label(l), amount: abs }); else trading.dr.push({ label: label(l), amount: abs }); break;
      case "indirect_exp": case "abnormal_loss": case "disposal_loss": if (bal > 0) pl.dr.push({ label: label(l), amount: abs }); else pl.cr.push({ label: label(l), amount: abs }); break;
      case "indirect_inc": case "disposal_gain": if (bal < 0) pl.cr.push({ label: label(l), amount: abs }); else pl.dr.push({ label: label(l), amount: abs }); break;
      case "pl_transfer": {
        // A "Profit & Loss A/c" leg is labelled by its counter account. In a compound entry the
        // counter is looked up among the SAME transaction's other legs (equal amount, opposite side).
        const counterOf = (e, side) => {
          if (e.particulars !== "Sundries") return e.particulars.replace(/ A\/c$/, "");
          const opp = side === "dr" ? "cr" : "dr";
          const hits = list.filter(x => x.l !== l && x.m.category !== "pl_transfer" && x.l[opp].some(z => z.txnIndex === e.txnIndex && Math.abs(z.amount - e.amount) < 0.011));
          return hits.length === 1 ? hits[0].l.name.replace(/ A\/c$/, "") : "Adjustments (sundries)";
        };
        l.dr.forEach(e => { const k = counterOf(e, "dr"); plGroups[k] = acRound2((plGroups[k] || 0) + e.amount); });
        l.cr.forEach(e => { const k = counterOf(e, "cr"); plGroups[k] = acRound2((plGroups[k] || 0) - e.amount); });
        break;
      }
      case "stock": stockBal = acRound2(stockBal + bal); break;
      case "capital": capitalBalance = acRound2(capitalBalance - bal); break;
      case "drawings": drawingsBalance = acRound2(drawingsBalance + bal); break;
      case "prov_dd": provDD = acRound2(provDD - bal); break;
      case "prov_disc_dr": provDisc = acRound2(provDisc - bal); break;
      case "prov_disc_cr": provCreditors = acRound2(provCreditors + bal); break;
      case "gst_input": inputGST = acRound2(inputGST + bal); break;
      case "gst_output": case "gst_payable": outputGST = acRound2(outputGST - bal); break;
      case "cash": case "cheque": case "asset_fixed": case "asset_current": case "prepaid": case "accrued_income": case "loan_asset": bsAssets.push({ label: label(l), amount: abs }); if (bal < 0) { bsAssets.pop(); bsLiabilities.push({ label: label(l) + " (credit balance)", amount: abs }); } break;
      case "claim_receivable": if (bal > 0) bsAssets.push({ label: "Insurance Claim Receivable", amount: abs }); else bsLiabilities.push({ label: "Insurance Claim (credit balance)", amount: abs }); break;
      case "bank": if (bal < 0) bsLiabilities.push({ label: "Bank Overdraft", amount: abs }); else bsAssets.push({ label: "Bank", amount: abs }); break;
      case "bank_od": if (bal < 0) asLiab(); else bsAssets.push({ label: label(l) + " (debit balance)", amount: abs }); break;
      case "advance_asset": if (bal >= 0) asAsset(); else bsLiabilities.push({ label: label(l) + " (credit balance)", amount: abs }); break;
      case "advance_liab": if (bal <= 0) asLiab(); else bsAssets.push({ label: label(l) + " (debit balance)", amount: abs }); break;
      case "debtors": bySide("Debtors", "", " (credit balance / advances)"); break;
      case "creditors": if (bal < 0) bsLiabilities.push({ label: label(l), amount: abs }); else bsAssets.push({ label: label(l) + " (debit balance / advances)", amount: abs }); break;
      case "bills_receivable": bySide("Bills Receivable", "", " (credit balance)"); break;
      case "bills_payable": if (bal < 0) asLiab(); else bsAssets.push({ label: "Bills Payable (debit balance)", amount: abs }); break;
      case "loan_liab": case "loan_generic": if (bal < 0) asLiab(); else bsAssets.push({ label: label(l), amount: abs }); break;
      case "outstanding": case "advance_income": if (bal < 0) asLiab(); else bsAssets.push({ label: label(l) + " (debit balance)", amount: abs }); break;
      case "contra_asset": if (bal < 0) bsAssets.push({ label: "Less: " + label(l), amount: -abs }); else bsAssets.push({ label: label(l), amount: abs }); break;
      case "personal": if (bal > 0) bsAssets.push({ label: label(l) + " (Sundry Debtor)", amount: abs }); else bsLiabilities.push({ label: label(l) + " (Sundry Creditor)", amount: abs }); break;
      default:
        warnings.push(`${label(l)} could not be classified.`);
        if (bal > 0) bsAssets.push({ label: label(l) + " (unclassified)", amount: abs }); else bsLiabilities.push({ label: label(l) + " (unclassified)", amount: abs });
    }
  });

  // ---- Trading Account ----
  purchases = acRound2(purchases - purchaseReturns);
  // Stock ledger: when a closing stock is supplied, the ledger stock is the OPENING stock (never counted twice).
  let closingStockNote = "none";
  if (closingStock > 0 && stockBal > 0) { trading.dr.unshift({ label: "Opening Stock", amount: stockBal }); closingStockNote = "opening stock taken from the ledger; closing stock supplied separately"; }
  else if (closingStock > 0) closingStockNote = "closing stock supplied separately";
  else if (stockBal > 0) closingStockNote = "stock in the ledger treated as the closing stock (no separate closing stock entered)";
  const purchLabel = purchases >= 0 ? "Purchases (net of returns)" : "Purchases (net of returns)";
  const tdr = trading.dr.slice();
  if (purchases) { const ix = tdr.filter(x => x.label === "Opening Stock").length; tdr.splice(ix, 0, { label: purchLabel, amount: purchases }); }
  trading.dr = tdr;
  sales = acRound2(sales - salesReturns);
  if (sales) trading.cr.unshift({ label: "Sales (net of returns)", amount: sales });
  if (closingStock > 0) trading.cr.push({ label: "Closing Stock", amount: closingStock });
  const totalTradingDr = acRound2(trading.dr.reduce((s, r) => s + r.amount, 0));
  const totalTradingCr = acRound2(trading.cr.reduce((s, r) => s + r.amount, 0));
  const grossProfit = acRound2(totalTradingCr - totalTradingDr);

  // ---- Profit & Loss Account ----
  Object.keys(plGroups).forEach(k => { const v = plGroups[k]; if (Math.abs(v) < 0.005) return; if (v > 0) pl.dr.push({ label: k, amount: v }); else pl.cr.push({ label: k, amount: -v }); });
  if (grossProfit >= 0) pl.cr.unshift({ label: "Gross Profit b/d", amount: grossProfit });
  else pl.dr.unshift({ label: "Gross Loss b/d", amount: -grossProfit });
  const totalPlDr = acRound2(pl.dr.reduce((s, r) => s + r.amount, 0));
  const totalPlCr = acRound2(pl.cr.reduce((s, r) => s + r.amount, 0));
  const netProfit = acRound2(totalPlCr - totalPlDr);

  // ---- Balance Sheet ----
  if (closingStock > 0) bsAssets.push({ label: "Closing Stock", amount: closingStock });
  else if (stockBal > 0) bsAssets.push({ label: "Stock", amount: stockBal });
  else if (stockBal < 0) bsLiabilities.push({ label: "Stock (credit balance)", amount: -stockBal });
  if (provDD > 0) bsAssets.push({ label: "Less: Provision for Doubtful Debts", amount: -provDD });
  if (provDisc > 0) bsAssets.push({ label: "Less: Provision for Discount on Debtors", amount: -provDisc });
  if (provCreditors > 0) bsLiabilities.push({ label: "Less: Provision for Discount on Creditors", amount: -provCreditors });
  const netGST = acRound2(inputGST - outputGST);
  if (netGST > 0) bsAssets.push({ label: "GST Input Credit (net)", amount: netGST });
  if (netGST < 0) bsLiabilities.push({ label: "GST Payable (net)", amount: -netGST });
  const closingCapital = acRound2(capitalBalance + netProfit - Math.abs(drawingsBalance));
  bsLiabilities.unshift({ label: "Capital (closing)", amount: closingCapital, isCapital: true });
  const totalAssets = acRound2(bsAssets.reduce((s, r) => s + r.amount, 0));
  const totalLiabilities = acRound2(bsLiabilities.reduce((s, r) => s + r.amount, 0));
  return {
    trading: { dr: trading.dr, cr: trading.cr, totalDr: totalTradingDr, totalCr: totalTradingCr, grossProfit },
    pl: { dr: pl.dr, cr: pl.cr, totalDr: totalPlDr, totalCr: totalPlCr, netProfit },
    bs: { assets: bsAssets, liabilities: bsLiabilities, totalAssets, totalLiabilities, balanced: Math.abs(totalAssets - totalLiabilities) < 0.5 },
    capitalOpeningPlusAdj: capitalBalance, drawingsBalance,
    capitalBreakdown: { capitalAccount: capitalBalance, netProfit, drawings: Math.abs(drawingsBalance), closing: closingCapital },
    closingStockTreatment: closingStockNote, warnings
  };
}


/* ============================================================
   UI — renderAccountingCycle(root)
   New bottom-nav tab. Fully separate from the Journal Entry
   Generator (chapter 3) — does not touch its code, data, or DOM.
   ============================================================ */

const AC_EXAMPLE_SET = `Business commenced with cash ₹1,00,000.
Purchased goods for cash ₹50,000.
Sold goods to Ram on credit ₹60,000.
Opened a bank account and deposited ₹40,000.
Purchased furniture by cheque ₹25,000.
Paid salary ₹8,000.
Received ₹20,000 from Ram.
Paid ₹15,000 to Suresh by cheque.`;

// 74-transaction practice bank — covers capital (cash & asset), contra,
// goods (cash/credit/returns/trade discount), drawings, the full expense
// and income list, cheques-in-hand & dishonour, bank overdraft/interest,
// loans, all the outstanding/prepaid/accrued/advance adjustments, goods
// given away (charity/samples/staff welfare/office use), fire & theft
// losses with insurance claims, insolvency, bad debts & recovery,
// depreciation, asset purchase/sale/installation, and a multi-item
// opening journal entry — added exactly once, in the order supplied.
const AC_PRACTICE_BANK_74 = [
"Started business with cash ₹1,00,000.",
"Introduced furniture worth ₹20,000 as capital.",
"Deposited cash into bank ₹40,000.",
"Purchased goods for cash ₹25,000.",
"Purchased goods from Ramesh on credit ₹30,000.",
"Purchased furniture for cash ₹12,000.",
"Purchased machinery by cheque ₹50,000.",
"Paid carriage inward ₹2,000.",
"Sold goods for cash ₹35,000.",
"Sold goods to Suresh on credit ₹28,000.",
"Returned goods to Ramesh worth ₹5,000.",
"Suresh returned goods worth ₹3,000.",
"Paid rent in cash ₹6,000.",
"Paid salary by cheque ₹8,000.",
"Paid wages ₹4,000.",
"Paid insurance premium ₹3,000.",
"Paid advertisement expenses ₹5,000.",
"Paid electricity charges ₹2,500.",
"Paid repairs ₹1,500.",
"Paid commission ₹2,000.",
"Received commission in cash ₹3,000.",
"Paid carriage outward ₹1,000.",
"Withdrew cash from bank for office use ₹10,000.",
"Withdrew cash from bank for personal use ₹5,000.",
"Withdrew goods worth ₹4,000 for personal use.",
"Received cash from Suresh ₹24,000 and allowed him discount ₹1,000.",
"Paid Ramesh ₹24,000 in full settlement of his account of ₹25,000.",
"Received a cheque from a debtor ₹15,000.",
"Deposited the cheque into bank.",
"A cheque received from a debtor was dishonoured ₹15,000.",
"Paid bank charges ₹500.",
"Bank allowed interest ₹1,000.",
"Took a loan from the bank in cash ₹40,000.",
"Repaid bank loan by cheque ₹10,000.",
"Paid interest on loan ₹2,000.",
"Interest on loan outstanding ₹1,000.",
"Salary outstanding ₹3,000.",
"Paid the outstanding salary ₹3,000.",
"Rent outstanding ₹2,000.",
"Paid outstanding rent ₹2,000.",
"Paid rent in advance ₹4,000.",
"Commission accrued but not received ₹2,500.",
"Received income in advance ₹3,000.",
"Goods worth ₹2,000 were given as charity.",
"Goods worth ₹3,000 were distributed as free samples.",
"Goods worth ₹1,500 were given to employees as welfare benefits.",
"Goods worth ₹2,500 were used for office purposes.",
"Goods worth ₹6,000 were destroyed by fire.",
"Goods worth ₹8,000 were stolen from the business.",
"The insurance company admitted a claim of ₹4,000 for goods destroyed by fire.",
"Received the insurance claim by cheque ₹4,000.",
"A debtor owing ₹5,000 became insolvent and paid only ₹3,000.",
"A debtor owing ₹2,000 became a bad debt.",
"Received bad debts recovered ₹1,500.",
"Charged depreciation on furniture ₹2,000.",
"Charged depreciation on machinery ₹5,000.",
"Sold furniture for cash ₹8,000.",
"Sold machinery at a profit of ₹3,000.",
"Purchased a computer for cash ₹12,000.",
"Sold a computer at a loss of ₹2,000.",
"Paid installation charges on machinery ₹4,000.",
"Paid wages for installation of machinery ₹2,000.",
"Paid repairs on machinery ₹3,000.",
"Purchased a computer on credit from ABC Traders ₹35,000.",
"Purchased stationery for cash ₹2,000.",
"Paid telephone expenses ₹1,500.",
"Paid travelling expenses ₹2,500.",
"Received rent in cash ₹5,000.",
"Received interest in cash ₹2,000.",
"Paid donation in cash ₹1,000.",
"Received cash from a debtor ₹10,000.",
"Paid cash to a creditor ₹7,000.",
"Purchased goods after receiving trade discount of 10% on goods marked at ₹20,000.",
"Sold goods after allowing trade discount of 10% on goods marked at ₹30,000.",
"The following were the assets and liabilities at the beginning of the year: cash ₹20,000, bank balance ₹30,000, stock ₹40,000, furniture ₹15,000, debtors ₹25,000, creditors ₹20,000, and loan ₹10,000. Prepare the opening journal entry.",
"Purchased goods by cheque ₹15,000.",
"Sold goods and received a cheque immediately ₹20,000.",
"Purchased stationery on credit from Mohan ₹3,000.",
"Sold an old computer to Ravi on credit for ₹10,000.",
"Received a cheque from Suresh but kept it in the office ₹8,000.",
"Deposited the cheque received from Suresh into the bank ₹8,000.",
"Issued a cheque to Ramesh ₹12,000, but the cheque has not yet been presented for payment.",
"Endorsed a cheque received from Suresh to Ramesh ₹6,000.",
"Sent a cheque to the bank for collection ₹5,000.",
"The bank collected the cheque sent for collection ₹5,000.",
"The bank charged collection charges ₹200.",
"Received cash directly from a debtor ₹7,000.",
"A debtor directly deposited ₹10,000 into the business bank account.",
"Paid cash directly into the bank ₹15,000.",
"Paid business expenses personally by the proprietor ₹2,000.",
"The proprietor paid the business electricity bill from his personal account ₹3,000.",
"Allowed interest on capital ₹2,000.",
"Charged interest on drawings ₹1,000.",
"Received interest on investment ₹2,500.",
"Interest on investment accrued but was not received ₹1,000.",
"Paid advance to a supplier for goods ₹5,000.",
"Received advance from a customer for goods ₹8,000.",
"Received goods from the supplier against the advance paid ₹5,000.",
"Supplied goods to the customer against the advance received ₹8,000.",
"Gave a loan to Mohan in cash ₹10,000.",
"Gave a loan to Ravi by cheque ₹20,000.",
"Received repayment of a loan from Mohan ₹6,000.",
"Received interest on loan given ₹1,000.",
"Interest on loan given became due but was not received ₹1,500.",
"Purchased goodwill for cash ₹20,000.",
"Purchased goodwill on credit from Raj ₹30,000.",
"Sold goodwill for cash ₹25,000.",
"Purchased a building by cheque ₹2,00,000.",
"Paid legal charges for purchase of building ₹5,000.",
"Paid brokerage on purchase of building ₹3,000.",
"Received goods as a gift worth ₹5,000.",
"Received furniture as a gift worth ₹10,000.",
"Goods worth ₹2,000 were distributed among employees.",
"Goods worth ₹3,000 were used for personal purposes by the proprietor.",
"Goods worth ₹4,000 were given to a customer as a free gift.",
"Goods worth ₹5,000 were sent on approval to a customer.",
"Goods sent on approval were accepted by the customer for ₹5,000.",
"Goods worth ₹2,000 were returned by the customer before approval.",
"A bill receivable was received from a debtor for ₹10,000.",
"A bill payable was accepted in favour of a creditor for ₹15,000.",
"The bill receivable was dishonoured ₹10,000.",
"The bill payable was paid on maturity ₹15,000.",
"Paid renewal charges on a bill payable ₹500.",
"Received a bill receivable from a debtor and discounted it with the bank ₹12,000.",
"The discounted bill was dishonoured ₹12,000.",
"A creditor allowed a rebate of ₹1,000.",
"A customer received a rebate of ₹800.",
"Purchased goods at a cash discount of 5%.",
"Sold goods at a cash discount of 5%.",
"Rent received in advance ₹4,000.",
"Salary paid in advance ₹3,000.",
"Commission received in advance ₹2,000.",
"Commission outstanding ₹1,500.",
"Interest received in advance ₹2,000.",
"Created a provision for doubtful debts ₹3,000.",
"An amount previously written off as bad debt was recovered ₹2,000.",
"Wrote off further bad debts ₹1,000.",
"Goods lost due to an accident ₹7,000.",
"Insurance claim for goods lost was rejected by the insurance company.",
"Received partial insurance claim ₹3,000 against goods lost ₹6,000.",
"A fixed asset was exchanged for another fixed asset.",
"Purchased machinery partly for cash and partly on credit.",
"Sold machinery partly for cash and partly on credit.",
"Paid commission to an agent by cheque ₹2,500.",
"Received commission through bank ₹3,500.",
"Paid income tax from the proprietor's personal account ₹4,000.",
"Paid income tax from business cash ₹4,000.",
"The proprietor took business cash for personal expenses ₹6,000.",
"The proprietor introduced a private vehicle into the business as capital ₹1,50,000.",
"Corrected an error relating to the purchase of furniture.",
"Passed the closing adjustment entry for outstanding expenses, prepaid expenses, accrued income, and income received in advance."
];

function acEl(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }

function renderAccountingCycle(root) {
  root.appendChild(acEl("div", "hero", `
    <span class="hero-eyebrow">New</span>
    <h1>Accounting Cycle</h1>
    <p>Enter one or many transactions — the engine reads each one, works out which accounts are affected using accounting rules (not a lookup table), and builds the complete cycle: Journal → Ledger → Trial Balance → Final Accounts.</p>
  `));

  const inputCard = acEl("div", "card-solid", "");
  inputCard.style.padding = "26px";
  inputCard.innerHTML = `
    <div class="field-group">
      <label>Transactions — one per line</label>
      <textarea id="acInput" class="field-input" style="min-height:220px; font-family:var(--font-body); resize:vertical; line-height:1.7;" placeholder="Type or paste transactions, one per line...">${AC_EXAMPLE_SET}</textarea>
    </div>
    <div class="field-group" style="max-width:260px;">
      <label>Closing Stock, if any (₹) — optional</label>
      <input type="number" id="acClosingStock" class="field-input" placeholder="e.g. 12000" min="0" step="0.01">
    </div>
    <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
      <button class="btn-primary ripple-surface" id="acGenerateBtn"><i data-lucide="wand-2"></i> Generate Accounting Cycle</button>
      <button class="chip" id="acClearBtn">Clear</button>
      <span style="font-size:0.78rem; color:var(--ink-faint);">Supports GST, trade &amp; cash discount, bad debts, provisions, depreciation, and more.</span>
    </div>
  `;
  root.appendChild(inputCard);

  const warnBox = acEl("div", "");
  warnBox.style.marginTop = "16px";
  root.appendChild(warnBox);

  const tabBar = acEl("div", "");
  tabBar.style.cssText = "display:flex; gap:8px; flex-wrap:wrap; margin:22px 0 18px;";
  tabBar.hidden = true;
  const TABS = ["Transactions", "Journal", "Ledger", "Trial Balance", "Final Accounts"];
  TABS.forEach((t, i) => {
    const chip = acEl("button", `chip ${i === 0 ? "active" : ""}`, t);
    chip.dataset.tab = t;
    tabBar.appendChild(chip);
  });
  root.appendChild(tabBar);

  const outPanel = acEl("div", "");
  root.appendChild(outPanel);

  const disclaimerBox = acEl("div", "");
  disclaimerBox.hidden = true;
  disclaimerBox.style.cssText = "margin-top:16px; font-size:0.82rem; color:var(--ink-faint); line-height:1.6;";
  disclaimerBox.innerHTML = `⚠️ All answers given by the Accounting Cycle Generator may not always be correct. Please verify the answers before using them.`;
  root.appendChild(disclaimerBox);

  let lastResult = null;

  function showTab(name) {
    $all(".chip", tabBar).forEach(c => c.classList.toggle("active", c.dataset.tab === name));
    outPanel.innerHTML = "";
    if (!lastResult) return;
    if (name === "Transactions") acRenderTransactionsTab(outPanel, lastResult);
    if (name === "Journal") acRenderJournalTab(outPanel, lastResult);
    if (name === "Ledger") acRenderLedgerTab(outPanel, lastResult);
    if (name === "Trial Balance") acRenderTrialBalanceTab(outPanel, lastResult);
    if (name === "Final Accounts") acRenderFinalAccountsTab(outPanel, lastResult);
    icons();
  }
  tabBar.addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (chip) showTab(chip.dataset.tab);
  });

  $("#acClearBtn", inputCard).addEventListener("click", () => {
    $("#acInput", inputCard).value = "";
    $("#acInput", inputCard).focus();
  });

  // Typing (or changing) the closing stock figure after already
  // generating once must actually update Final Accounts — previously it
  // only took effect if "Generate" was clicked again, so entering it
  // afterwards and just switching to the Final Accounts tab silently
  // showed stale (often zero) closing stock.
  $("#acClosingStock", inputCard).addEventListener("input", () => {
    if (!lastResult) return; // nothing generated yet — Generate will pick this up
    const closingStock = parseFloat(($("#acClosingStock", inputCard).value || "").replace(/[₹,\s]/g, "")) || 0;
    lastResult.closingStock = closingStock;
    lastResult.fa = acBuildFinalAccounts(lastResult.ledgers, closingStock);
    const activeTab = $(".chip.active", tabBar);
    if (activeTab && activeTab.dataset.tab === "Final Accounts") showTab("Final Accounts");
  });

  $("#acGenerateBtn", inputCard).addEventListener("click", () => {
    const raw = $("#acInput", inputCard).value;
    const closingStock = parseFloat(($("#acClosingStock", inputCard).value || "").replace(/[₹,\s]/g, "")) || 0;
    if (!raw.trim()) {
      warnBox.innerHTML = `<div class="reveal-block" style="background:var(--flag-soft); border-left-color:var(--flag);"><p style="font-size:0.87rem;">Enter at least one transaction.</p></div>`;
      playErrorSound();
      return;
    }
    // One pipeline: understand → validate → commit → Journal → Ledger → Trial Balance → Final Accounts.
    lastResult = acRunCycle(raw, closingStock);
    warnBox.innerHTML = acSummaryBanner(lastResult);
    icons();
    tabBar.hidden = false;
    disclaimerBox.hidden = false;
    showTab("Transactions");
    const n = lastResult.summary.processed;
    if (n) { toast(lastResult.incomplete ? `${n} transaction${n > 1 ? "s" : ""} processed — ${lastResult.summary.needsReview} need${lastResult.summary.needsReview === 1 ? "s" : ""} review.` : `Generated the cycle for ${n} transaction${n > 1 ? "s" : ""}.`, lastResult.incomplete ? "error" : "success", lastResult.incomplete ? "alert-circle" : "check-circle"); if (!lastResult.incomplete) playSuccessSound(); else playErrorSound(); }
    else playErrorSound();
  });
}

/* ---------- status presentation (VALID / UNCERTAIN / INVALID / NO ENTRY) ---------- */
const AC_STATUS_UI = {
  VALID:             { label: "VALID",    color: "var(--c-eq)",     icon: "check-circle" },
  UNCERTAIN:         { label: "UNCERTAIN", color: "#b8863b",        icon: "alert-circle" },
  INVALID:           { label: "INVALID",  color: "var(--flag)",     icon: "x-circle" },
  NO_ENTRY_REQUIRED: { label: "NO ENTRY", color: "var(--ink-faint)", icon: "minus-circle" }
};
function acStatusBadge(status) {
  const u = AC_STATUS_UI[status] || AC_STATUS_UI.INVALID;
  return `<span style="display:inline-flex; align-items:center; gap:3px; font-size:0.66rem; font-weight:700; letter-spacing:0.04em; color:${u.color}; border:1px solid ${u.color}; border-radius:999px; padding:1px 7px; margin-left:6px; vertical-align:1px;"><i data-lucide="${u.icon}" style="width:11px;height:11px;"></i>${u.label}</span>`;
}
function acSummaryBanner(res) {
  const s = res.summary;
  const counts = `<p style="font-size:0.85rem; margin:0 0 6px;"><b>Processed:</b> ${s.processed} &nbsp;·&nbsp; <b>Needs review:</b> ${s.needsReview}${s.noEntry ? ` &nbsp;·&nbsp; <b>No entry required:</b> ${s.noEntry}` : ""}</p>`;
  if (!res.incomplete && !s.noEntry) return "";
  let html = "";
  if (res.incomplete) {
    html += `<div class="reveal-block" style="background:var(--flag-soft); border-left-color:var(--flag);">
      <h4><i data-lucide="alert-triangle" style="width:14px;height:14px;vertical-align:-2px;"></i> Accounting Cycle incomplete — ${s.needsReview} transaction${s.needsReview > 1 ? "s" : ""} require${s.needsReview === 1 ? "s" : ""} correction</h4>
      ${counts}
      <p style="font-size:0.82rem; margin:0 0 6px;">The Journal, Ledger, Trial Balance and Final Accounts are built <b>only from the ${s.processed} validated transaction${s.processed === 1 ? "" : "s"}</b> and are not complete until these are fixed.</p>
      <ol>${res.needsReview.map(f => `<li><b>Line ${f.index}</b>${acStatusBadge(f.status)}: "${escapeHtml(f.text)}" — ${escapeHtml(f.reason)}</li>`).join("")}</ol>
    </div>`;
  }
  if (s.noEntry) {
    html += `<div class="reveal-block" style="margin-top:10px;"><h4><i data-lucide="minus-circle" style="width:14px;height:14px;vertical-align:-2px;"></i> No journal entry required</h4>
      ${res.incomplete ? "" : counts}
      <ul>${res.noEntry.map(f => `<li><b>Line ${f.index}:</b> "${escapeHtml(f.text)}" — ${escapeHtml(f.reason)}</li>`).join("")}</ul></div>`;
  }
  return html;
}
function acIncompleteNote(res) {
  if (!res.incomplete) return "";
  return `<div class="reveal-block" style="background:var(--flag-soft); border-left-color:var(--flag); margin-bottom:14px;"><p style="font-size:0.84rem; margin:0;"><b>Incomplete:</b> ${res.summary.needsReview} transaction${res.summary.needsReview > 1 ? "s were" : " was"} not validated and ${res.summary.needsReview > 1 ? "are" : "is"} excluded below. These figures are based only on the ${res.summary.processed} validated transaction${res.summary.processed === 1 ? "" : "s"} and must not be treated as final.</p></div>`;
}

function acRenderTransactionsTab(panel, res) {
  panel.appendChild(sectionTitle("Transactions entered"));
  const card = acEl("div", "card-solid", "");
  card.style.padding = "22px";
  const fmtLines = ls => (ls || []).map(l => (l.dr !== undefined ? `${escapeHtml(l.account)} Dr ₹${acFmt(l.dr)}` : `&nbsp;&nbsp;To ${escapeHtml(l.account)} ₹${acFmt(l.cr)}`)).join("<br>");
  const rows = res.rawLines.map((line, i) => {
    const r = res.results.find(x => x.index === i + 1);
    const status = r ? r.status : "INVALID";
    const ui = AC_STATUS_UI[status] || AC_STATUS_UI.INVALID;
    const color = status === "VALID" ? "" : `color:${ui.color};`;
    let extra = "";
    if (r && status !== "VALID") extra += `<div style="font-size:0.78rem; margin-top:3px;">${escapeHtml(r.reason || "")}</div>`;
    if (r && status === "UNCERTAIN" && r.proposedLines && r.proposedLines.length) extra += `<div style="font-size:0.74rem; margin-top:4px; padding:6px 9px; background:var(--paper-raised); border-radius:6px; color:var(--ink-faint);"><i>Entry the engine would have posted (not used in the books):</i><br>${fmtLines(r.proposedLines)}</div>`;
    if (r && r.warnings && r.warnings.length && status === "VALID") extra += r.warnings.map(w => `<div style="font-size:0.76rem; color:#b8863b; margin-top:2px;">⚠ ${escapeHtml(w)}</div>`).join("");
    if (r && r.assumptions && r.assumptions.length) extra += `<div style="font-size:0.74rem; color:var(--ink-faint); margin-top:2px;">Assumed: ${r.assumptions.map(escapeHtml).join(" ")}</div>`;
    return `<li style="margin-bottom:12px; font-size:0.88rem; ${color}">
      <span class="tnum" style="color:var(--ink-faint); margin-right:6px;">${i + 1}.</span>${escapeHtml(line)}${acStatusBadge(status)}
      ${extra}
    </li>`;
  }).join("");
  card.innerHTML = `<ul style="list-style:none; padding-left:0; margin:0;">${rows}</ul>`;
  panel.appendChild(card);
}

function acRenderJournalTab(panel, res) {
  panel.appendChild(sectionTitle("Journal"));
  if (res.incomplete) panel.appendChild(acEl("div", "", acIncompleteNote(res)));
  if (!res.parsed.length) { panel.appendChild(acEl("p", "", "No transactions could be journalised.")); return; }
  const card = acEl("div", "card-solid", "");
  card.style.padding = "22px";
  const scroll = acEl("div", "table-scroll");
  let rows = "";
  res.parsed.forEach(r => {
    r.lines.forEach((l, i) => {
      const isFirst = i === 0;
      rows += `<tr>
        <td class="tnum" style="white-space:nowrap; color:var(--ink-faint); font-size:0.82rem; vertical-align:top;">${isFirst && r.date ? escapeHtml(r.date) : ""}</td>
        <td style="font-family:var(--font-body); ${l.cr !== undefined ? "padding-left:26px;" : ""}">${isFirst ? `<span class="tnum" style="color:var(--ink-faint); margin-right:8px;">${r.index}.</span>` : ""}${l.dr !== undefined ? l.account + " Dr." : "-" + l.account}</td>
        <td class="tnum" style="text-align:right;">${l.dr !== undefined ? acFmt(l.dr) : ""}</td>
        <td class="tnum" style="text-align:right;">${l.cr !== undefined ? acFmt(l.cr) : ""}</td>
      </tr>`;
    });
    rows += `<tr><td></td><td colspan="3" style="font-size:0.78rem; color:var(--ink-faint); font-style:italic; padding-bottom:14px; border-bottom:1px dashed var(--line);">(${escapeHtml(r.narration)})</td></tr>`;
  });
  scroll.innerHTML = `<table class="ledger-table"><thead><tr><th>Date</th><th>Account Name</th><th>Debit (₹)</th><th>Credit (₹)</th></tr></thead><tbody>${rows}</tbody></table>`;
  card.appendChild(scroll);
  panel.appendChild(card);
}

function acRenderLedgerTab(panel, res) {
  panel.appendChild(sectionTitle("Ledger — T-accounts"));
  const grid = acEl("div", "");
  grid.style.cssText = "display:grid; grid-template-columns:repeat(auto-fit, minmax(460px, 1fr)); gap:16px;";
  Object.values(res.ledgers).sort((a, b) => a.name.localeCompare(b.name)).forEach(led => {
    const card = acEl("div", "card-solid", "");
    card.style.padding = "18px";
    const maxRows = Math.max(led.dr.length, led.cr.length, 1);
    let rows = "";
    for (let i = 0; i < maxRows; i++) {
      const d = led.dr[i], c = led.cr[i];
      const dLabel = d ? (d.particulars === "Sundries" ? "To Sundries" : "To " + escapeHtml(d.particulars)) : "";
      const cLabel = c ? (c.particulars === "Sundries" ? "By Sundries" : "By " + escapeHtml(c.particulars)) : "";
      rows += `<tr>
        <td style="border:1px solid var(--line); padding:5px 7px; font-size:0.72rem; color:var(--ink-faint); white-space:nowrap;">${d && d.date ? escapeHtml(d.date) : ""}</td>
        <td style="border:1px solid var(--line); padding:5px 7px; font-size:0.8rem;">${dLabel}</td>
        <td style="border:1px solid var(--line); padding:5px 7px; font-size:0.7rem;"></td>
        <td class="tnum" style="border:1px solid var(--line); padding:5px 7px; font-size:0.8rem; text-align:right;">${d ? acFmt(d.amount) : ""}</td>
        <td style="border:1px solid var(--line); padding:5px 7px; font-size:0.72rem; color:var(--ink-faint); white-space:nowrap;">${c && c.date ? escapeHtml(c.date) : ""}</td>
        <td style="border:1px solid var(--line); padding:5px 7px; font-size:0.8rem;">${cLabel}</td>
        <td style="border:1px solid var(--line); padding:5px 7px; font-size:0.7rem;"></td>
        <td class="tnum" style="border:1px solid var(--line); padding:5px 7px; font-size:0.8rem; text-align:right;">${c ? acFmt(c.amount) : ""}</td>
      </tr>`;
    }
    const balSide = led.balanceSide === "dr" ? "By Balance c/d" : led.balanceSide === "cr" ? "To Balance c/d" : "";
    const grandTotal = acFmt(Math.max(led.totalDr, led.totalCr, Math.abs(led.balance)));
    const thStyle = "border:1px solid var(--line-strong); background:var(--c-ac-soft); color:var(--c-ac); padding:4px 6px; font-size:0.64rem; font-weight:600;";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; font-weight:700; font-family:var(--font-mono); font-size:0.85rem; margin-bottom:8px;">
        <span>Dr.</span><span>${escapeHtml(led.name)}</span><span>Cr.</span>
      </div>
      <table style="width:100%; border-collapse:collapse;">
        <tr>
          <th style="${thStyle}">Date</th><th style="${thStyle}">Particulars</th><th style="${thStyle}">J.F.</th><th style="${thStyle}">Amount</th>
          <th style="${thStyle}">Date</th><th style="${thStyle}">Particulars</th><th style="${thStyle}">J.F.</th><th style="${thStyle}">Amount</th>
        </tr>
        ${rows}
        <tr style="font-weight:700;">
          <td style="border:1px solid var(--line-strong); padding:5px 7px;"></td>
          <td style="border:1px solid var(--line-strong); padding:5px 7px; font-size:0.78rem;">${led.balanceSide === "cr" ? balSide : ""}</td>
          <td style="border:1px solid var(--line-strong); padding:5px 7px;"></td>
          <td class="tnum" style="border:1px solid var(--line-strong); padding:5px 7px; font-size:0.78rem; text-align:right;">${led.balanceSide === "cr" ? acFmt(Math.abs(led.balance)) : ""}</td>
          <td style="border:1px solid var(--line-strong); padding:5px 7px;"></td>
          <td style="border:1px solid var(--line-strong); padding:5px 7px; font-size:0.78rem;">${led.balanceSide === "dr" ? balSide : ""}</td>
          <td style="border:1px solid var(--line-strong); padding:5px 7px;"></td>
          <td class="tnum" style="border:1px solid var(--line-strong); padding:5px 7px; font-size:0.78rem; text-align:right;">${led.balanceSide === "dr" ? acFmt(Math.abs(led.balance)) : ""}</td>
        </tr>
        <tr style="font-weight:700; background:var(--paper-raised);">
          <td colspan="4" style="border:1px solid var(--line-strong); padding:5px 7px; font-size:0.8rem; text-align:right;">${grandTotal}</td>
          <td colspan="4" style="border:1px solid var(--line-strong); padding:5px 7px; font-size:0.8rem; text-align:right;">${grandTotal}</td>
        </tr>
      </table>`;
    grid.appendChild(card);
  });
  panel.appendChild(grid);
}

function acRenderTrialBalanceTab(panel, res) {
  panel.appendChild(sectionTitle("Trial Balance"));
  if (res.incomplete) panel.appendChild(acEl("div", "", acIncompleteNote(res)));
  const card = acEl("div", "card-solid", "");
  card.style.padding = "22px";
  const rows = res.tb.rows.map(r => `<tr>
    <td>${escapeHtml(r.account)}</td>
    <td class="tnum" style="text-align:right;">${r.debit ? acFmt(r.debit) : ""}</td>
    <td class="tnum" style="text-align:right;">${r.credit ? acFmt(r.credit) : ""}</td>
  </tr>`).join("");
  card.innerHTML = `
    <div class="table-scroll">
      <table class="ledger-table">
        <thead><tr><th>Account</th><th>Debit (₹)</th><th>Credit (₹)</th></tr></thead>
        <tbody>${rows}
          <tr style="font-weight:700; border-top:2px solid var(--line-strong);">
            <td>Total</td>
            <td class="tnum" style="text-align:right;">${acFmt(res.tb.totalDebit)}</td>
            <td class="tnum" style="text-align:right;">${acFmt(res.tb.totalCredit)}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p style="margin-top:14px; font-size:0.85rem; ${res.tb.balanced ? "color:var(--c-eq);" : "color:var(--flag);"}">
      <i data-lucide="${res.tb.balanced ? "check-circle" : "alert-triangle"}" style="width:15px;height:15px;vertical-align:-3px;"></i>
      ${res.tb.balanced ? "Total Debit equals Total Credit." : "Debit and Credit totals do not match — please review the transactions."}
    </p>
    <p style="margin-top:4px; font-size:0.78rem; color:var(--ink-faint);">A balanced Trial Balance only proves arithmetic consistency — it does not prove that every transaction was interpreted correctly. ${res.tb.checks ? (res.tb.checks.ok ? "Every validated Journal line is included in the Ledger and no account is duplicated." : "Integrity check failed: the Ledger does not match the Journal.") : ""}</p>`;
  panel.appendChild(card);
}

function acFinalAccountsTable(title, dr, cr, totalDr, totalCr) {
  const maxRows = Math.max(dr.length, cr.length, 1);
  let rows = "";
  for (let i = 0; i < maxRows; i++) {
    const d = dr[i], c = cr[i];
    rows += `<tr>
      <td style="border:1px solid var(--line); padding:8px;">${d ? escapeHtml(d.label) : ""}</td>
      <td class="tnum" style="border:1px solid var(--line); padding:8px; text-align:right;">${d ? acFmt(d.amount) : ""}</td>
      <td style="border:1px solid var(--line); padding:8px;">${c ? escapeHtml(c.label) : ""}</td>
      <td class="tnum" style="border:1px solid var(--line); padding:8px; text-align:right;">${c ? acFmt(c.amount) : ""}</td>
    </tr>`;
  }
  return `
    <h4 style="margin:22px 0 10px;">${title}</h4>
    <div class="table-scroll">
      <table style="width:100%; border-collapse:collapse; min-width:520px;">
        ${rows}
        <tr style="font-weight:700;">
          <td style="border:1px solid var(--line-strong); padding:8px;">Total</td>
          <td class="tnum" style="border:1px solid var(--line-strong); padding:8px; text-align:right;">${acFmt(totalDr)}</td>
          <td style="border:1px solid var(--line-strong); padding:8px;">Total</td>
          <td class="tnum" style="border:1px solid var(--line-strong); padding:8px; text-align:right;">${acFmt(totalCr)}</td>
        </tr>
      </table>
    </div>`;
}

function acRenderFinalAccountsTab(panel, res) {
  panel.appendChild(sectionTitle("Final Accounts"));
  if (res.incomplete) panel.appendChild(acEl("div", "", acIncompleteNote(res)));
  const fa = res.fa;
  const card = acEl("div", "card-solid", "");
  card.style.padding = "22px";

  const tDr = fa.trading.dr.slice();
  const tCr = fa.trading.cr.slice();
  if (fa.trading.grossProfit >= 0) tDr.push({ label: "Gross Profit c/d", amount: fa.trading.grossProfit });
  else tCr.push({ label: "Gross Loss c/d", amount: -fa.trading.grossProfit });
  const tTotal = Math.max(fa.trading.totalDr, fa.trading.totalCr);
  let html = fa.trading.totalDr || fa.trading.totalCr ? acFinalAccountsTable("Trading Account", tDr, tCr, tTotal, tTotal) : `<p style="font-size:0.85rem; color:var(--ink-faint);">No trading (goods purchase/sale) activity — Trading Account not applicable.</p>`;

  const pDr = fa.pl.dr.slice();
  const pCr = fa.pl.cr.slice();
  if (fa.pl.netProfit >= 0) pDr.push({ label: "Net Profit transferred to Capital A/c", amount: fa.pl.netProfit });
  else pCr.push({ label: "Net Loss transferred to Capital A/c", amount: -fa.pl.netProfit });
  const pTotal = Math.max(fa.pl.totalDr, fa.pl.totalCr);
  html += acFinalAccountsTable("Profit &amp; Loss Account", pDr, pCr, pTotal, pTotal);

  html += `<h4 style="margin:22px 0 10px;">Balance Sheet</h4>
    <div class="table-scroll">
      <table style="width:100%; border-collapse:collapse; min-width:520px;">
        <tr><th colspan="2" style="border:1px solid var(--line-strong); background:var(--c-ac-soft); color:var(--c-ac); padding:8px; text-align:left;">Liabilities</th><th colspan="2" style="border:1px solid var(--line-strong); background:var(--c-ac-soft); color:var(--c-ac); padding:8px; text-align:left;">Assets</th></tr>`;
  const maxRows2 = Math.max(fa.bs.liabilities.length, fa.bs.assets.length, 1);
  for (let i = 0; i < maxRows2; i++) {
    const l = fa.bs.liabilities[i], a = fa.bs.assets[i];
    html += `<tr>
      <td style="border:1px solid var(--line); padding:8px; ${l && l.isCapital ? "font-weight:600;" : ""}">${l ? escapeHtml(l.label) : ""}</td>
      <td class="tnum" style="border:1px solid var(--line); padding:8px; text-align:right;">${l ? acFmt(l.amount) : ""}</td>
      <td style="border:1px solid var(--line); padding:8px; ${a && a.amount < 0 ? "color:var(--ink-faint); font-style:italic;" : ""}">${a ? escapeHtml(a.label) : ""}</td>
      <td class="tnum" style="border:1px solid var(--line); padding:8px; text-align:right;">${a ? acFmt(a.amount) : ""}</td>
    </tr>`;
  }
  html += `<tr style="font-weight:700;">
      <td style="border:1px solid var(--line-strong); padding:8px;">Total</td>
      <td class="tnum" style="border:1px solid var(--line-strong); padding:8px; text-align:right;">${acFmt(fa.bs.totalLiabilities)}</td>
      <td style="border:1px solid var(--line-strong); padding:8px;">Total</td>
      <td class="tnum" style="border:1px solid var(--line-strong); padding:8px; text-align:right;">${acFmt(fa.bs.totalAssets)}</td>
    </tr>
  </table></div>
  <p style="margin-top:14px; font-size:0.85rem; ${fa.bs.balanced ? "color:var(--c-eq);" : "color:var(--flag);"}">
    <i data-lucide="${fa.bs.balanced ? "check-circle" : "alert-triangle"}" style="width:15px;height:15px;vertical-align:-3px;"></i>
    ${fa.bs.balanced ? "Balance Sheet is balanced." : "Balance Sheet does not balance — please review the transactions and closing stock entered."}
  </p>`;

  card.innerHTML = html;
  panel.appendChild(card);
}
