module.exports = function (t, E) {

  /* ---------------- 23. INPUT-FORMAT INDEPENDENCE (separators never change meaning) ---------------- */
  const G23 = '23 Separator independence (opening lines)';
  // Section 89: these must all resolve to the same account/amount when part of a genuine opening list.
  const OPEN3 = 'Cash ₹50,000\nBuilding {SEP}\nDebtors ₹10,000';
  const wantOpen3 = amt => `Dr Cash 50000; Dr Building ${amt}; Dr Debtors 10000; Cr Capital ${50000 + amt + 10000}`;
  [['₹10,000', 10000], [': ₹10,000', 10000], [' : ₹10,000', 10000], ['- ₹10,000', 10000], ['= ₹10,000', 10000], ['— ₹10,000', 10000], ['= 10000', 10000], ['worth ₹10,000', 10000], ['valued at ₹10,000', 10000], ['costing ₹10,000', 10000]]
    .forEach(([sep, amt]) => t(G23, `Building "${sep}"`, OPEN3.replace('{SEP}', sep), wantOpen3(amt)));
  t(G23, 'Cash worth ₹ as one of several opening items', 'Cash worth ₹5,00,000\nFurniture ₹20,000\nDebtors ₹5,000', 'Dr Cash 500000; Dr Furniture 20000; Dr Debtors 5000; Cr Capital 525000');

  /* ---------------- 24. MULTI-LINE / HEADED OPENING ENTRIES ---------------- */
  const G24 = '24 Multi-line & headed opening entries';
  const OPEN7 = 'Dr Cash 500000; Dr Goods (Stock) 200000; Dr Building 800000; Dr Debtors 20000; Dr Machinery 100000; Cr Creditors 25000; Cr Bank Loan 40000; Cr Capital 1555000';
  t(G24, 'REQUIRED — date-prefixed first line, comma list, then one item per line', 'April 1: Cash ₹5,00,000, Stock of Goods ₹2,00,000\nBuilding ₹8,00,000\nDebtors ₹20,000\nMachinery ₹1,00,000\nCreditors ₹25,000\nBank Loan ₹40,000', OPEN7);
  t(G24, 'REQUIRED — date on its own line, then colon-separated items', 'April 1:\nCash: ₹5,00,000\nStock of Goods: ₹2,00,000\nBuilding: ₹8,00,000\nDebtors: ₹20,000\nMachinery: ₹1,00,000\nCreditors: ₹25,000\nBank Loan: ₹40,000', OPEN7);
  t(G24, 'one item per line, no date, no header', 'Cash ₹5,00,000\nStock of Goods ₹2,00,000\nBuilding ₹8,00,000\nDebtors ₹20,000\nMachinery ₹1,00,000\nCreditors ₹25,000\nBank Loan ₹40,000', OPEN7);
  t(G24, 'colon items where "Debtors:"/"Creditors:" are ITEMS, not section headers', 'Debtors: ₹20,000\nCreditors: ₹25,000\nCash: ₹90,000', 'Dr Debtors 20000; Dr Cash 90000; Cr Creditors 25000; Cr Capital 85000');
  t(G24, 'genuine "Debtors:" / "Creditors:" section headers (named parties) still work', 'Assets: Cash ₹50,000, Stock ₹30,000\nLiabilities: Creditors ₹20,000', 'Dr Cash 50000; Dr Goods (Stock) 30000; Cr Creditors 20000; Cr Capital 60000');
  t(G24, 'dashes as opening-line separators throughout', 'Cash - ₹40,000\nFurniture - ₹10,000\nCreditors - ₹5,000', 'Dr Cash 40000; Dr Furniture 10000; Cr Creditors 5000; Cr Capital 45000');
  t(G24, 'em-dash separators throughout', 'Cash — ₹40,000\nFurniture — ₹10,000\nDebtors — ₹5,000', 'Dr Cash 40000; Dr Furniture 10000; Dr Debtors 5000; Cr Capital 55000');
  t(G24, 'name-map: "stock of goods"/"goods"/"inventory" all mean Stock', 'Cash ₹10,000\nGoods ₹5,000\nInventory ₹3,000', 'Dr Cash 10000; Dr Goods (Stock) 8000; Cr Capital 18000');
  t(G24, 'name-map: "current account" means Bank in an opening list', 'Current Account ₹40,000\nFurniture ₹10,000\nDebtors ₹5,000', 'Dr Bank 40000; Dr Furniture 10000; Dr Debtors 5000; Cr Capital 55000');
  t(G24, 'name-map: "bank loan"/"loan from bank" both mean Bank Loan', 'Cash ₹60,000\nFurniture ₹10,000\nLoan from Bank ₹20,000', 'Dr Cash 60000; Dr Furniture 10000; Cr Bank Loan 20000; Cr Capital 50000');
  t(G24, 'name-map: "plant and machinery"/"machine" both mean Machinery', 'Cash ₹40,000\nPlant and Machinery ₹30,000\nDebtors ₹5,000', 'Dr Cash 40000; Dr Machinery 30000; Dr Debtors 5000; Cr Capital 75000');

  /* ---------------- 25. CAPITAL-INTRODUCTION WORDING (section 5) ---------------- */
  const G25 = '25 Capital introduction — wider vocabulary';
  t(G25, 'Business opened with (verb "opened")', 'Business opened with cash ₹50,000 and stock ₹20,000.', 'Dr Cash 50000; Dr Goods (Stock) 20000; Cr Capital 70000');
  t(G25, 'commenced operations (context "operations")', 'The proprietor commenced operations with cash ₹1,00,000.', 'Dr Cash 100000; Cr Capital 100000');
  t(G25, 'Business was launched with (compound)', 'Business was launched with ₹1,00,000 cash and ₹40,000 stock.', 'Dr Cash 100000; Dr Goods (Stock) 40000; Cr Capital 140000');
  t(G25, 'single-item "opened business with"', 'Opened business with cash ₹75,000.', 'Dr Cash 75000; Cr Capital 75000');
  t(G25, 'operations started (single item)', 'Operations started with cash ₹30,000.', 'Dr Cash 30000; Cr Capital 30000');

  /* ---------------- 26. VERB SYNONYMS FOR PAYMENT ---------------- */
  const G26 = '26 "settled"/"cleared" understood as paid';
  t(G26, 'settled through bank (no "account"/"full" phrase)', 'Rent amounting to ₹10,000 was settled through bank.', 'Dr Rent 10000; Cr Bank 10000');
  t(G26, 'cleared in cash', 'Electricity bill of ₹1,500 was cleared in cash.', 'Dr Electricity Charges 1500; Cr Cash 1500');
  t(G26, '"X settled his account by paying" — X is the debtor paying us, discount allowed to X', 'Ramesh settled his account by paying ₹9,700 against ₹10,000.', 'Dr Cash 9700; Dr Discount Allowed 300; Cr Ramesh 10000');
  t(G26, 'amount stated before the account, "was paid towards"', 'The amount of ₹10,000 was paid towards rent.', 'Dr Rent 10000; Cr Cash 10000');
  t(G26, '"amounting to" connector', 'Salary amounting to ₹8,000 was paid in cash.', 'Dr Salary 8000; Cr Cash 8000');

  /* ---------------- 27. PAYMENT MODE ALIASES (section 16) ---------------- */
  const G27 = '27 Digital / account-based payment modes';
  t(G27, 'UPI counted as bank', 'Paid rent through UPI ₹2,000.', 'Dr Rent 2000; Cr Bank 2000');
  t(G27, 'NEFT counted as bank', 'Paid electricity bill ₹3,000 by NEFT.', 'Dr Electricity Charges 3000; Cr Bank 3000');
  t(G27, 'RTGS counted as bank', 'Paid rent ₹15,000 through RTGS.', 'Dr Rent 15000; Cr Bank 15000');
  t(G27, 'online transfer counted as bank', 'Paid insurance premium ₹4,000 by online transfer.', 'Dr Insurance Premium 4000; Cr Bank 4000');
  t(G27, 'cash deposited into a "current account" (no literal word "bank")', 'Cash deposited in current account ₹10,000.', 'Dr Bank 10000; Cr Cash 10000');
  t(G27, 'opened a current account with cash', 'Opened a current account with cash ₹20,000.', 'Dr Bank 20000; Cr Cash 20000');

  /* ---------------- 28. INSOLVENCY — DIVIDEND IN THE RUPEE (section 27/40) ---------------- */
  const G28 = '28 Insolvency — paise-in-the-rupee dividend';
  t(G28, 'REQUIRED — "X paise in a rupee" is a rate, not an amount', 'Debtor owing ₹10,000 became insolvent; dividend of 60 paise in a rupee received.', 'Dr Cash 6000; Dr Bad Debts 4000; Cr Debtors 10000');
  t(G28, '"paise per rupee" wording, cash stated explicitly', 'Debtor of ₹8,000 became insolvent; 70 paise in the rupee received in cash.', 'Dr Cash 5600; Dr Bad Debts 2400; Cr Debtors 8000');
  t(G28, '"a debtor of ₹X" phrasing (not just "owing")', 'A debtor of ₹5,000 became insolvent; dividend of 40 paise in the rupee received.', 'Dr Cash 2000; Dr Bad Debts 3000; Cr Debtors 5000');
  t(G28, 'paise is never read as a money amount on its own', 'Debtor owing ₹4,000 became insolvent; dividend of 25 paise in a rupee received by cheque.', 'Dr Bank 1000; Dr Bad Debts 3000; Cr Debtors 4000');

  /* ---------------- 29. INTEREST ON CAPITAL / DRAWINGS (section 31) ---------------- */
  const G29 = '29 Interest on Capital and Interest on Drawings';
  t(G29, 'Interest on Capital alone', 'Interest on Capital @5%; Capital ₹2,00,000.', 'Dr Interest on Capital 10000; Cr Capital 10000');
  t(G29, 'Interest on Drawings alone, with a period', 'Interest on Drawings @8% for 6 months; Drawings ₹10,000.', 'Dr Drawings 400; Cr Interest on Drawings 400');
  t(G29, 'REQUIRED — both stated together in one sentence, different bases', 'Interest on Capital @6% p.a. and Interest on Drawings @10% p.a.; Capital ₹1,00,000; Drawings for the month ₹12,000.', 'Dr Interest on Capital 6000; Cr Capital 6000; Dr Drawings 1200; Cr Interest on Drawings 1200');
  t(G29, 'capital figure taken from the ledger when not restated', ['Started business with cash ₹1,00,000.', 'Interest on Capital @6% p.a.'], [null, 'Dr Interest on Capital 6000; Cr Capital 6000']);
  t(G29, 'no rate stated → UNCERTAIN, not invented', 'Interest on Capital; Capital ₹1,00,000.', { s: 'UNCERTAIN' });
  t(G29, 'no capital figure and none recorded → UNCERTAIN', 'Interest on Capital @6% p.a.', { s: 'UNCERTAIN' });

  /* ---------------- 30. INSTRUCTION / ASSUMPTION LINES ARE NOT TRANSACTIONS (sections 50-51) ---------------- */
  const G30 = '30 Instruction and assumption lines';
  t(G30, 'REQUIRED — "Prepare Journal Entries for the following transactions:"', 'Prepare Journal Entries for the following transactions:', { s: 'NO_ENTRY_REQUIRED' });
  t(G30, '"Pass the necessary journal entries…"', 'Pass the necessary journal entries in the books of the business.', { s: 'NO_ENTRY_REQUIRED' });
  t(G30, '"Journalize the following transactions…"', 'Journalize the following transactions in the books of a trader.', { s: 'NO_ENTRY_REQUIRED' });
  t(G30, '"From the following particulars, prepare a Trial Balance."', 'From the following particulars, prepare a Trial Balance.', { s: 'NO_ENTRY_REQUIRED' });
  t(G30, 'REQUIRED — a stated assumption does not become a phantom entry', 'Assume total drawings for the month are ₹12,000 for calculation purposes.', { s: 'NO_ENTRY_REQUIRED' });
  t(G30, 'an ordinary transaction is unaffected by the instruction gate', 'Paid rent ₹5,000 in cash.', 'Dr Rent 5000; Cr Cash 5000');

  /* ---------------- 31. GENUINE OPENING-ITEM FALSE-POSITIVE GUARDS (still hold) ---------------- */
  const G31 = '31 Opening detector still declines ordinary sentences';
  t(G31, 'a single bare "Building ₹10,000" alone is not enough context', 'Building ₹10,000', { s: 'INVALID' });
  t(G31, 'a normal payment sentence is never mistaken for an opening item', 'Paid ₹10,000 for building repairs.', { s: 'VALID' });
  t(G31, 'dates inside a genuine opening block are never read as money', 'Cash ₹5,00,000\nStock of Goods ₹2,00,000\nBuilding ₹8,00,000', 'Dr Cash 500000; Dr Goods (Stock) 200000; Dr Building 800000; Cr Capital 1500000');
};
