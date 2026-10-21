module.exports = function (t, E) {

  /* ---------------- 32. THE 14 REQUIRED BENCHMARK PROBLEMS (A-N) ---------------- */
  const G32 = '32 Benchmarks A-N (semantic reasoning)';
  t(G32, 'A — partial payment against dues, discount rate on THAT payment',
    ['Sold goods to Sumit on credit ₹50,000.', 'April 17: Sumit paid ₹20,000 against his dues by cheque, and Rohan Traders allowed him a 2% Cash Discount on this specific partial payment.'],
    [null, 'Dr Bank 19600; Dr Discount Allowed 400; Cr Sumit 20000']);
  t(G32, 'B — one bank withdrawal, two destinations (personal + office)',
    "April 21: Withdrew from the bank: Cash ₹10,000 for the proprietor's personal use and ₹5,000 for office use.",
    'Dr Drawings 10000; Dr Cash 5000; Cr Bank 15000');
  t(G32, 'C — one cheque payment, personal tax + office insurance',
    "April 23: Paid ₹4,000 for the proprietor's personal Income Tax and ₹6,000 for office Insurance Charges by cheque.",
    'Dr Drawings 4000; Dr Insurance Premium 6000; Cr Bank 10000');
  t(G32, 'D — two goods-given-away components in one sentence',
    'April 27: Goods costing ₹6,000 were distributed as free samples, and goods costing ₹3,000 were given away as charity.',
    'Dr Free Samples 6000; Dr Charity/Donation 3000; Cr Purchases 9000');
  t(G32, 'E — implied settlement default (debtor, no payment mode stated)',
    'A debtor owing ₹20,000 was allowed a discount of ₹1,000 on settlement.',
    { entry: 'Dr Cash 19000; Dr Discount Allowed 1000; Cr Debtors 20000', has: 'cash assumed' });
  t(G32, 'F — implied settlement default (creditor, no payment mode stated)',
    'A creditor of ₹15,000 allowed a discount of ₹1,500 on settlement.',
    { entry: 'Dr Creditors 15000; Cr Cash 13500; Cr Discount Received 1500', has: 'cash assumed' });
  t(G32, 'G — rectification: repairs wrongly debited to Machinery',
    '₹2,500 spent on repairs of machinery had been debited to Machinery Account.',
    'Dr Repairs 2500; Cr Machinery 2500');
  t(G32, 'H — rectification: commission wrongly credited to Sales (no re-recorded receipt)',
    '₹4,000 received as commission had been credited to Sales Account.',
    'Dr Sales 4000; Cr Commission Received 4000');
  t(G32, 'I — a bare heading is not a transaction', 'Transfer / Adjustment Entries', { s: 'NO_ENTRY_REQUIRED' });
  t(G32, 'J — bill endorsed to a named creditor in full settlement of a different balance',
    ['Sold goods to a debtor on credit ₹10,500.', 'A debtor\'s bill for ₹10,000 previously received was endorsed to a creditor, Suresh, in full settlement of his ₹10,500 account.'],
    [null, 'Dr Suresh 10500; Cr Bills Receivable 10000; Cr Discount Received 500']);
  t(G32, 'K — bill dishonoured on maturity with noting charges',
    ['Received a bill receivable from Ravi ₹15,000.', "May 26 — Ravi's bill was dishonoured on maturity; bank charged ₹500 as noting charges."],
    [null, 'Dr Ravi 15500; Cr Bills Receivable 15000; Cr Bank 500']);
  t(G32, 'L — payment after dishonour uses the resulting debtor balance, not a fresh dishonour',
    ['Received a bill receivable from Ravi ₹15,000.', "May 26 — Ravi's bill was dishonoured on maturity; bank charged ₹500 as noting charges.", 'May 27 — Ravi immediately paid ₹5,000 in cash towards the amount due on the dishonoured bill.'],
    [null, null, 'Dr Cash 5000; Cr Ravi 5000']);
  t(G32, 'M — "advertising expenses" recognized (not just "advertisement")',
    'April 29 — Paid advertising expenses ₹4,000 by cheque.', 'Dr Advertisement 4000; Cr Bank 4000');
  t(G32, 'N — remaining fire loss written off, amount taken from recorded state',
    ['Goods lost by fire ₹10,000.', 'Insurance company admitted claim ₹6,000.', 'May 9 — The remaining loss of goods destroyed by fire was written off.'],
    [null, null, 'Dr Profit & Loss 4000; Cr Loss by Fire/Theft 4000']);

  /* ---------------- 33. GENERALIZATIONS BEYOND THE EXACT BENCHMARK WORDING ---------------- */
  const G33 = '33 Generalizing beyond the benchmark wording';
  t(G33, 'purpose split: three destinations from one withdrawal', 'Withdrew from the bank: ₹8,000 for personal use and ₹2,000 for office use.', 'Dr Drawings 8000; Dr Cash 2000; Cr Bank 10000');
  t(G33, 'purpose split: personal + office wording reversed', 'Withdrew from bank ₹3,000 for office use and ₹7,000 for the proprietor\'s personal use.', 'Dr Cash 3000; Dr Drawings 7000; Cr Bank 10000');
  t(G33, 'personal/business compound: different expense word', 'Paid ₹2,000 for the proprietor\'s personal expenses and ₹5,000 for office Rent by cheque.', 'Dr Drawings 2000; Dr Rent 5000; Cr Bank 7000');
  t(G33, 'goods given away: staff welfare + charity', 'Goods costing ₹1,000 were distributed to staff as staff welfare, and goods costing ₹500 were given away as charity.', 'Dr Staff Welfare Expenses 1000; Dr Charity/Donation 500; Cr Purchases 1500');
  t(G33, 'implied settlement default: debtor wording with "his account"', 'A debtor with a balance of ₹8,000 was allowed a discount of ₹300 on settlement.', { entry: 'Dr Cash 7700; Dr Discount Allowed 300; Cr Debtors 8000' });
  t(G33, 'implied settlement default: creditor, different amounts', 'A creditor of ₹9,000 allowed a discount of ₹400 on settlement.', 'Dr Creditors 9000; Cr Cash 8600; Cr Discount Received 400');
  t(G33, 'rectification: wrongly credited, different accounts', '₹1,500 received as rent had been credited to Commission Received Account.', 'Dr Commission Received 1500; Cr Rent Received 1500');
  t(G33, 'rectification: incorrectly debited wording', '₹800 spent on stationery had been incorrectly debited to Furniture Account.', 'Dr Printing & Stationery 800; Cr Furniture 800');
  t(G33, 'heading: "Additional Information" alone', 'Additional Information', { s: 'NO_ENTRY_REQUIRED' });
  t(G33, 'heading: "Adjustments" alone', 'Adjustments', { s: 'NO_ENTRY_REQUIRED' });
  t(G33, 'a genuine transaction with a heading-like word is not swallowed', 'Paid ₹500 for ledger printing charges in cash.', 'Dr Printing & Stationery 500; Cr Cash 500');
  t(G33, 'party pays us: a different name and a different context (ordinary credit sale)', ['Sold goods to Mohit on credit ₹7,000.', 'Mohit paid ₹3,000 in cash towards his account.'], [null, 'Dr Cash 3000; Cr Mohit 3000']);
  t(G33, 'remaining fire loss: flood wording, explicit matching amount accepted', ['Goods lost by flood ₹20,000.', 'Insurance company admitted claim ₹15,000.', 'The remaining loss was written off — ₹5,000.'], [null, null, 'Dr Profit & Loss 5000; Cr Loss by Fire/Theft 5000']);
  t(G33, 'remaining fire loss: no admitted claim yet still resolves from the gross loss', ['Goods lost by fire ₹6,000.', 'The remaining loss of goods destroyed by fire was written off.'], [null, 'Dr Profit & Loss 6000; Cr Loss by Fire/Theft 6000']);
  t(G33, 'advertising synonym: publicity expenses', 'Paid publicity expenses ₹2,500 in cash.', 'Dr Advertisement 2500; Cr Cash 2500');

  /* ---------------- 34. SAFETY: THESE SHOULD NOT MISFIRE INTO THE NEW INTERPRETERS ---------------- */
  const G34 = '34 New interpreters do not overreach';
  t(G34, 'an ordinary two-item compound payment is unaffected by the purpose-split interpreter', 'Paid salary ₹5,000 and rent ₹2,000 in cash.', 'Dr Salary 5000; Dr Rent 2000; Cr Cash 7000');
  t(G34, 'a normal bill dishonour still works after the precise-gate change', ['Drew a bill on Ravi for ₹30,000, which he accepted.', "Ravi's bill was dishonoured."], [null, 'Dr Ravi 30000; Cr Bills Receivable 30000']);
  t(G34, 'a normal settlement-with-discount sentence still works after the direction-inference addition', 'Paid Ramesh ₹23,500 by cheque and received ₹1,500 discount in full settlement of ₹25,000.', 'Dr Ramesh 25000; Cr Bank 23500; Cr Discount Received 1500');
  t(G34, 'a plain purchase mentioning "debited" in the ordinary sense is not treated as a rectification', 'Purchases account was debited with goods bought for cash ₹5,000.', { s: 'VALID' });
  t(G34, 'discount + percentage in a normal sale is not hijacked by the partial-payment interpreter', 'Sold goods ₹1,00,000 less 10% trade discount to Sita; received 60% immediately and 5% cash discount on the amount received.', 'Dr Cash 51300; Dr Discount Allowed 2700; Dr Sita 36000; Cr Sales 90000');
  t(G34, '"paid" sentence with no named party is unaffected by acInterpPartyPays', 'Paid rent ₹5,000 in cash.', 'Dr Rent 5000; Cr Cash 5000');

  /* ---------------- 35. REGRESSIONS FOUND BY THE V80 INDEPENDENT PROBE ---------------- */
  const G35 = '35 v80 probe regressions';
  // capital introduction with a CURRENT asset (previously DROPPED from the entry)
  t(G35, 'capital intro: debtors are not lost', 'Started business with cash ₹40,000 and debtors ₹10,000.', 'Dr Cash 40000; Dr Debtors 10000; Cr Capital 50000');
  t(G35, 'capital intro: cash + debtors + fixed asset, all three kept', 'Started business with cash ₹40,000, debtors ₹10,000 and furniture ₹5,000.', 'Dr Cash 40000; Dr Debtors 10000; Dr Furniture 5000; Cr Capital 55000');
  t(G35, 'capital intro: bills receivable is an asset, not a bill event', 'Commenced business with cash ₹30,000 and bills receivable ₹10,000.', 'Dr Cash 30000; Dr Bills Receivable 10000; Cr Capital 40000');
  // capital introduction carrying a LIABILITY reduces capital
  t(G35, 'capital intro: creditors brought along reduce capital', 'Started business with cash ₹50,000; creditors ₹8,000.', 'Dr Cash 50000; Cr Creditors 8000; Cr Capital 42000');
  t(G35, 'capital intro: same with "and" instead of ";"', 'Started business with cash ₹50,000 and creditors ₹8,000.', 'Dr Cash 50000; Cr Creditors 8000; Cr Capital 42000');
  // bare final-accounts adjustments (previously INVALID)
  t(G35, 'bare bad debts line writes off against the debtors', 'Bad debts ₹6,000.', 'Dr Bad Debts 6000; Cr Debtors 6000');
  t(G35, 'bare bad debts with "of" wording', 'Bad debts of ₹6,000.', 'Dr Bad Debts 6000; Cr Debtors 6000');
  t(G35, 'bare bad debts against a named debtor', 'Bad debts ₹6,000 from Ram.', 'Dr Bad Debts 6000; Cr Ram 6000');
  t(G35, 'bare discount allowed line credits the debtors', 'Discount allowed ₹1,000.', 'Dr Discount Allowed 1000; Cr Debtors 1000');
  t(G35, 'bare discount allowed against a named debtor', 'Discount allowed ₹1,000 from Ram.', 'Dr Discount Allowed 1000; Cr Ram 1000');
  // prepaid split without the word "of which"
  t(G35, 'prepaid split after a semicolon', 'Paid insurance ₹12,000 in cash; ₹2,000 is prepaid.', 'Dr Insurance Premium 10000; Dr Prepaid Insurance Premium 2000; Cr Cash 12000');
  t(G35, 'prepaid split after a semicolon, terse wording', 'Paid rent ₹10,000 in cash; ₹1,500 prepaid.', 'Dr Rent 8500; Dr Prepaid Rent 1500; Cr Cash 10000');
  t(G35, 'prepaid split joined with "and"', 'Paid rent ₹10,000 in cash and ₹1,500 is prepaid.', 'Dr Rent 8500; Dr Prepaid Rent 1500; Cr Cash 10000');
  // a balanced opening list must not swallow the transaction that follows it
  t(G35, 'a transaction after a complete opening list stays its own transaction',
    ['Cash ₹50,000; Debtors ₹1,00,000; Stock ₹30,000; Capital ₹1,80,000', 'Bad debts ₹6,000.', 'Create provision for doubtful debts at 5% of remaining debtors.'],
    ['Dr Cash 50000; Dr Debtors 100000; Dr Goods (Stock) 30000; Cr Capital 180000', 'Dr Bad Debts 6000; Cr Debtors 6000', 'Dr Profit & Loss 4700; Cr Provision for Doubtful Debts 4700']);
  t(G35, 'a payment after a balanced opening list is still a payment',
    ['Cash ₹40,000; Bank ₹25,000; Debtors ₹30,000; Creditors ₹20,000; Stock ₹15,000; Capital ₹90,000', 'Paid salary ₹5,000 in cash.'],
    [null, 'Dr Salary 5000; Cr Cash 5000']);
  // and an OPEN (unbalanced) list still merges across lines
  t(G35, 'an incomplete opening list still merges its following lines',
    ['Cash ₹50,000; Debtors ₹30,000', 'Furniture ₹20,000; Creditors ₹10,000; Capital ₹90,000'],
    'Dr Cash 50000; Dr Debtors 30000; Dr Furniture 20000; Cr Creditors 10000; Cr Capital 90000');
  // "Capital ₹X" written inline is the stated capital, never an asset of its own
  t(G35, 'inline capital in an opening list is used once, not debited AND credited',
    'Cash ₹50,000; Debtors ₹30,000; Furniture ₹20,000; Creditors ₹10,000; Capital ₹90,000',
    'Dr Cash 50000; Dr Debtors 30000; Dr Furniture 20000; Cr Creditors 10000; Cr Capital 90000');
  t(G35, 'an opening list whose stated capital contradicts its balances is refused, not guessed',
    'Cash ₹50,000; Debtors ₹30,000; Furniture ₹20,000; Creditors ₹10,000; Capital ₹95,000',
    { s: 'UNCERTAIN', has: 'does not equal assets' });

  /* ---------------- 36. OUTSTANDING / PREPAID SPLITS AND CLOSING STOCK (second probe pass) ---------------- */
  const G36 = '36 outstanding splits & closing stock';
  // "Salary ₹20,000; ₹3,000 is still outstanding" has NO payment verb, so the earlier
  // `!paid` guard left the whole ₹3,000 unrepresented and the entry came back UNCERTAIN.
  t(G36, 'bare outstanding split: the total is the larger figure',
    'Salary ₹20,000; ₹3,000 is still outstanding.',
    'Dr Salary 20000; Cr Cash 17000; Cr Outstanding Salary 3000');
  t(G36, 'bare outstanding split, rent', 'Rent ₹10,000; ₹2,000 is still outstanding.',
    'Dr Rent 10000; Cr Cash 8000; Cr Outstanding Rent 2000');
  t(G36, 'outstanding split without the word "still"', 'Salary ₹20,000; ₹3,000 outstanding.',
    'Dr Salary 20000; Cr Cash 17000; Cr Outstanding Salary 3000');
  // "Paid salary ₹20,000, ₹3,000 outstanding" — the FIRST figure is the cash paid, so the
  // expense is the SUM. Previously the whole ₹20,000 was credited to the outstanding account.
  t(G36, 'paid + outstanding: the expense is the sum, not the first figure',
    'Paid salary ₹20,000, ₹3,000 outstanding.',
    'Dr Salary 23000; Cr Cash 20000; Cr Outstanding Salary 3000');
  t(G36, 'paid + outstanding, rent', 'Paid rent ₹10,000, ₹2,000 outstanding.',
    'Dr Rent 12000; Cr Cash 10000; Cr Outstanding Rent 2000');
  // a lone "Outstanding salary ₹20,000" is still the plain adjustment entry, not a split
  t(G36, 'a single outstanding figure is still the plain adjustment entry',
    'Salary ₹20,000 outstanding.',
    'Dr Salary 20000; Cr Outstanding Salary 20000');
  // "Paid carriage ₹1,000 in cash." must never be caught by the outstanding branch
  t(G36, 'an ordinary payment is untouched by the outstanding branch',
    'Paid carriage ₹1,000 in cash.',
    'Dr Carriage 1000; Cr Cash 1000');
  // Closing stock is a FINAL ACCOUNTS figure (acRunCycle's own parameter), not a transaction.
  t(G36, 'lone closing stock line is a figure, not a failed transaction',
    'Closing stock ₹25,000.',
    { s: 'NO_ENTRY_REQUIRED', has: 'not a journal transaction' });
  t(G36, 'closing stock worded as a sentence', 'Closing stock was ₹25,000 at the year end.',
    { s: 'NO_ENTRY_REQUIRED', has: 'not a journal transaction' });
  t(G36, 'closing stock after a sale still posts the sale',
    'Sold goods ₹25,000 on credit to Shyam; closing stock ₹12,000.',
    { s: 'UNCERTAIN' });
  t(G36, 'an ordinary purchase is untouched by the closing-stock rule',
    'Purchased goods ₹25,000 on credit from Ram.',
    'Dr Purchases 25000; Cr Ram 25000');
};
