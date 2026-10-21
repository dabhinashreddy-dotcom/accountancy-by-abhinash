module.exports = function (t, E) {
  const FURN20 = 'Purchased furniture ₹20,000 for cash.';

  /* ---------------- 7. BILLS ---------------- */
  const G7 = '07 Bills of exchange';
  t(G7, 'accepted a bill drawn by creditor', 'Accepted a bill for ₹25,000 drawn by Mohan.', 'Dr Mohan 25000; Cr Bills Payable 25000');
  t(G7, 'drew a bill on debtor (accepted)', 'Drew a bill on Ravi for ₹30,000, which he accepted.', 'Dr Bills Receivable 30000; Cr Ravi 30000');
  t(G7, 'received a bill receivable', 'Received a bill receivable from Ravi ₹30,000.', 'Dr Bills Receivable 30000; Cr Ravi 30000');
  const brSeq = ['Drew a bill on Ravi for ₹30,000, which he accepted.', "Discounted Ravi's bill with the bank; received ₹29,000.", "Ravi's bill was dishonoured.", 'Paid ₹500 noting charges on the dishonoured bill by bank.'];
  t(G7, 'lifecycle: draw → discount → dishonour → noting charges', brSeq, [
    'Dr Bills Receivable 30000; Cr Ravi 30000',
    'Dr Bank 29000; Dr Discount on Bills Receivable 1000; Cr Bills Receivable 30000',
    'Dr Ravi 30000; Cr Bank 30000',                               // bill had been discounted → the bank is debited back
    'Dr Ravi 500; Cr Bank 500']);                                 // noting charges found through the bill context
  t(G7, 'dishonour of an UNdiscounted bill hits Bills Receivable', ['Drew a bill on Ravi for ₹30,000, which he accepted.', "Ravi's bill was dishonoured."], [null, 'Dr Ravi 30000; Cr Bills Receivable 30000']);
  t(G7, 'dishonour + noting charges in one sentence', "Ravi's bill of ₹30,000 was dishonoured; noting charges ₹500 paid by bank.", 'Dr Ravi 30500; Cr Bills Receivable 30000; Cr Bank 500');
  t(G7, 'renewal of bill receivable with interest', ['Drew a bill on Ravi for ₹30,000, which he accepted.', "Ravi's bill was renewed with interest ₹500."], [null, 'Dr Bills Receivable 30500; Cr Bills Receivable 30000; Cr Interest Received 500']);
  t(G7, 'renewal of bill payable with interest', ['Accepted a bill for ₹25,000 drawn by Mohan.', 'Our bill payable to Mohan was renewed with interest ₹300.'], [null, 'Dr Bills Payable 25000; Dr Interest Paid 300; Cr Bills Payable 25300']);
  t(G7, 'renewal with nothing known → UNCERTAIN', 'Bill was renewed with interest ₹500.', { s: 'UNCERTAIN' });
  t(G7, 'bill payable paid on maturity', 'Bill payable of ₹25,000 was paid on maturity by bank.', 'Dr Bills Payable 25000; Cr Bank 25000');
  t(G7, 'bill receivable honoured on maturity', 'Bill receivable of ₹30,000 was honoured on maturity and the amount received by bank.', 'Dr Bank 30000; Cr Bills Receivable 30000');
  t(G7, 'maturity amount taken from the bill register', ['Accepted a bill for ₹25,000 drawn by Mohan.', 'The bill payable was paid on maturity by cheque.'], [null, 'Dr Bills Payable 25000; Cr Bank 25000']);
  t(G7, 'renewal charges are an expense, not a renewal', 'Paid renewal charges on a bill payable ₹500.', 'Dr Renewal Charges 500; Cr Cash 500');
  t(G7, 'bill received and discounted together', 'Received a bill receivable from a debtor and discounted it with the bank ₹12,000.', 'Dr Bank 12000; Cr Debtors 12000');
  t(G7, 'discount computed from rate + period', ['Drew a bill on Ravi for ₹60,000, which he accepted.', 'Discounted the bill with the bank at 12% p.a. for 3 months.'], [null, 'Dr Bank 58200; Dr Discount on Bills Receivable 1800; Cr Bills Receivable 60000']);

  /* ---------------- 8. CHEQUES & BANK DIRECT ---------------- */
  const G8 = '08 Cheques & bank direct';
  t(G8, 'cheque received', 'Received a cheque from Ram ₹8,000.', 'Dr Cheques in Hand 8000; Cr Ram 8000');
  t(G8, 'cheque deposited (amount from state)', ['Received a cheque from Ram ₹8,000.', 'Deposited the cheque into bank.'], [null, 'Dr Bank 8000; Cr Cheques in Hand 8000']);
  t(G8, 'bank directly credited interest', 'Bank directly credited interest ₹2,500.', 'Dr Bank 2500; Cr Interest Received 2500');
  t(G8, 'bank charges debited directly', 'Bank charges ₹800 were debited directly by the bank.', 'Dr Bank Charges 800; Cr Bank 800');
  t(G8, '"deducted" instead of "debited"', 'Bank deducted collection charges ₹500 directly from the account.', 'Dr Bank Charges 500; Cr Bank 500');
  t(G8, 'cheque issued', 'Issued a cheque to Suresh ₹12,000.', 'Dr Suresh 12000; Cr Bank 12000');
  t(G8, 'bank allowed interest', 'Bank allowed interest ₹1,000.', 'Dr Bank 1000; Cr Interest Received 1000');
  t(G8, 'payment mode must match wording', 'Paid rent ₹5,000 by cheque.', 'Dr Rent 5000; Cr Bank 5000');

  /* ---------------- 9. LOANS ---------------- */
  const G9 = '09 Loans & interest';
  t(G9, 'bank loan credited to bank', 'Took a bank loan of ₹1,00,000 directly credited to bank.', 'Dr Bank 100000; Cr Bank Loan 100000');
  t(G9, 'interest on working-capital loan', 'Paid interest on working-capital loan ₹6,000 by bank.', 'Dr Interest on Loan 6000; Cr Bank 6000');
  t(G9, 'repayment uses the SAME loan account', ['Took a bank loan of ₹1,00,000 directly credited to bank.', 'Repaid loan ₹20,000 by cheque.'], [null, 'Dr Bank Loan 20000; Cr Bank 20000']);
  t(G9, 'loan from a person', 'Took a loan from Suresh ₹20,000 in cash.', 'Dr Cash 20000; Cr Loan from Suresh 20000');
  t(G9, 'loan given', 'Gave a loan to Ramesh ₹15,000 by cheque.', 'Dr Loan to Ramesh 15000; Cr Bank 15000');
  t(G9, 'term loan interest', 'Paid interest on term loan ₹4,000 by cheque.', 'Dr Interest on Loan 4000; Cr Bank 4000');

  /* ---------------- 10. OUTSTANDING / PREPAID / ACCRUED / ADVANCE ---------------- */
  const G10 = '10 Outstanding, prepaid, accrued, advance';
  t(G10, 'salary partly paid, partly outstanding', 'Paid salaries ₹25,000; ₹5,000 remained outstanding.', 'Dr Salary 30000; Cr Cash 25000; Cr Outstanding Salary 5000');
  t(G10, 'later settlement reduces the liability', ['Paid salaries ₹25,000; ₹5,000 remained outstanding.', 'Paid the outstanding salary ₹5,000.'], [null, 'Dr Outstanding Salary 5000; Cr Cash 5000']);
  t(G10, 'outstanding rent', 'Rent ₹3,000 is outstanding.', 'Dr Rent 3000; Cr Outstanding Rent 3000');
  t(G10, 'outstanding wages', 'Wages ₹2,000 outstanding.', 'Dr Wages 2000; Cr Outstanding Wages 2000');
  t(G10, 'prepaid insurance', 'Insurance ₹2,000 paid in advance.', 'Dr Prepaid Insurance Premium 2000; Cr Cash 2000');
  t(G10, 'accrued commission', 'Commission income ₹3,000 was earned but not received.', 'Dr Accrued Commission 3000; Cr Commission Received 3000');
  t(G10, 'income received in advance', 'Received subscription ₹15,000 in advance for next year.', 'Dr Cash 15000; Cr Subscription Received in Advance 15000');
  t(G10, 'insurance includes next-year part', 'Insurance paid ₹18,000 includes ₹6,000 relating to next accounting year.', 'Dr Insurance Premium 12000; Dr Prepaid Insurance Premium 6000; Cr Cash 18000');
  t(G10, 'rent includes next-year part (bank)', 'Rent paid ₹12,000 by cheque includes ₹3,000 relating to next year.', 'Dr Rent 9000; Dr Prepaid Rent 3000; Cr Bank 12000');
  t(G10, 'income split current / advance', 'Received annual maintenance subscription ₹24,000, of which ₹6,000 relates to next year.', 'Dr Cash 24000; Cr Subscription Received 18000; Cr Subscription Received in Advance 6000');
  t(G10, 'accrued interest', 'Interest of ₹1,000 accrued but not received.', 'Dr Accrued Interest 1000; Cr Interest Received 1000');

  /* ---------------- 11. PERSONAL vs BUSINESS ---------------- */
  const G11 = '11 Personal vs business';
  t(G11, 'personal income tax from business bank', "Paid proprietor's personal income-tax ₹7,000 from business bank account.", 'Dr Drawings 7000; Cr Bank 7000');
  t(G11, 'personal school fees from business cash', 'Paid personal school fees from business cash ₹5,000.', 'Dr Drawings 5000; Cr Cash 5000');
  t(G11, 'household electricity from business bank', 'Paid household electricity bill ₹1,200 from business bank.', 'Dr Drawings 1200; Cr Bank 1200');
  t(G11, 'personal tax from personal funds → no entry', 'Proprietor paid income tax from personal funds ₹4,000.', { s: 'NO_ENTRY_REQUIRED' });
  t(G11, 'cash withdrawn for personal use', 'The proprietor took business cash for personal expenses ₹6,000.', 'Dr Drawings 6000; Cr Cash 6000');
  t(G11, 'goods for personal use', 'Withdrew goods for personal use ₹3,000.', 'Dr Drawings 3000; Cr Purchases 3000');
  t(G11, 'BUSINESS expense paid personally → capital', 'The proprietor paid the business electricity bill from his personal account ₹3,000.', 'Dr Electricity Charges 3000; Cr Capital 3000');
  t(G11, "proprietor's life insurance", "Paid life insurance premium of the proprietor ₹8,000 by bank.", 'Dr Drawings 8000; Cr Bank 8000');

  /* ---------------- 12. ASSETS, DEPRECIATION, DISPOSAL ---------------- */
  const G12 = '12 Fixed assets & depreciation';
  const dep = 'Dr Depreciation 166.67; Cr Furniture 166.67';
  t(G12, 'TEST C — rate for 1 month', ['Apr 01: Commenced business with Cash ₹1,00,000, Goods ₹40,000, and Furniture ₹20,000.', 'Apr 30: Charge depreciation on furniture @ 10% p.a. for 1 month.'], [null, dep]);
  t(G12, 'TEST D — explicit amount', ['Apr 01: Commenced business with Cash ₹1,00,000, Goods ₹40,000, and Furniture ₹20,000.', 'Apr 30: Charge depreciation on furniture ₹200.'], [null, 'Dr Depreciation 200; Cr Furniture 200']);
  t(G12, 'TEST E — rate AND explicit amount → explicit wins', ['Apr 01: Commenced business with Cash ₹1,00,000, Goods ₹40,000, and Furniture ₹20,000.', 'Apr 30: Charge depreciation on furniture @10% p.a. for 1 month; depreciation amount is ₹200.'], [null, 'Dr Depreciation 200; Cr Furniture 200']);
  t(G12, '6 months', [FURN20, 'Charge depreciation on furniture @10% p.a. for 6 months.'], [null, 'Dr Depreciation 1000; Cr Furniture 1000']);
  t(G12, '12 months', [FURN20, 'Furniture is depreciated at 10% for 12 months.'], [null, 'Dr Depreciation 2000; Cr Furniture 2000']);
  t(G12, 'unseen: costing … depreciated for one month', 'Furniture costing ₹20,000 is depreciated at 10% for one month.', dep);
  t(G12, 'unseen: depreciation amounted to', 'Depreciation charged on furniture amounted to ₹200.', 'Dr Depreciation 200; Cr Furniture 200');
  t(G12, 'WDV year 1 then year 2 (book value, not cost)', ['Purchased furniture ₹1,00,000 for cash.', 'Charge depreciation on furniture @20% WDV for year 1.', 'Charge depreciation on furniture @20% WDV for year 2.'], [null, 'Dr Depreciation 20000; Cr Furniture 20000', 'Dr Depreciation 16000; Cr Furniture 16000']);
  t(G12, 'WDV year 2 stated standalone', 'Furniture ₹1,00,000 depreciation @20% WDV year 2.', 'Dr Depreciation 16000; Cr Furniture 16000');
  t(G12, 'WDV two years in one sentence', 'Furniture ₹1,00,000 depreciated at 20% WDV for 2 years.', 'Dr Depreciation 36000; Cr Furniture 36000');
  t(G12, 'SLM three years', 'Machinery costing ₹2,00,000 depreciated at 10% SLM for 3 years.', 'Dr Depreciation 60000; Cr Machinery 60000');
  t(G12, 'part-year from purchase date (1 July → 9/12)', 'Vehicle purchased for ₹4,00,000 on 1 July. Depreciation 10% SLM. Year end 31 March.', 'Dr Depreciation 30000; Cr Vehicle 30000');
  t(G12, 'part-year from the asset register', ['Purchased vehicle for ₹4,00,000 on 1 July.', 'Charge depreciation on vehicle @10% SLM for the year.'], [null, 'Dr Depreciation 30000; Cr Vehicle 30000']);
  t(G12, 'depreciation knows the OPENING asset', ['Cash ₹60,000; Bank ₹90,000; Stock ₹1,20,000; Furniture ₹40,000; Machinery ₹1,00,000; Debtors ₹70,000; Creditors ₹50,000; Bank Loan ₹40,000', 'Depreciate machinery at 10%.'],
    [ 'Dr Cash 60000; Dr Bank 90000; Dr Goods (Stock) 120000; Dr Furniture 40000; Dr Machinery 100000; Dr Debtors 70000; Cr Creditors 50000; Cr Bank Loan 40000; Cr Capital 390000',
      'Dr Depreciation 10000; Cr Machinery 10000']);
  t(G12, 'rate but unknown cost → UNCERTAIN', 'Charge depreciation on furniture @10% p.a. for 1 month.', { s: 'UNCERTAIN', has: 'cost' });
  t(G12, 'no asset named → UNCERTAIN', 'Charge depreciation ₹500.', { s: 'UNCERTAIN' });
  t(G12, 'two assets, none named → UNCERTAIN', [FURN20, 'Purchased machinery ₹50,000 for cash.', 'Charge depreciation @10%.'], [null, null, { s: 'UNCERTAIN', has: 'which asset' }]);
  t(G12, 'depreciation above book value → INVALID', [FURN20, 'Charge depreciation on furniture ₹25,000.'], [null, { s: 'INVALID' }]);
  t(G12, 'capitalised installation', 'Paid installation charges on machinery ₹4,000.', 'Dr Machinery 4000; Cr Cash 4000');
  t(G12, 'repairs are revenue, not capital', 'Paid repairs on machinery ₹3,000.', 'Dr Repairs 3000; Cr Cash 3000');
  t(G12, 'disposal with cost + accumulated depreciation', 'Sold machinery for ₹1,50,000; cost ₹2,00,000; accumulated depreciation ₹80,000.', 'Dr Cash 150000; Dr Accumulated Depreciation 80000; Cr Machinery 200000; Cr Profit on Sale of Machinery 30000');
  t(G12, 'disposal at a loss (book value stated)', 'Sold old computer at a loss of ₹1,500; book value was ₹18,500.', 'Dr Cash 17000; Dr Loss on Sale of Computer 1500; Cr Computer 18500');
  t(G12, 'disposal at a profit', 'Sold furniture at a profit of ₹2,000; book value ₹10,000.', 'Dr Cash 12000; Cr Furniture 10000; Cr Profit on Sale of Furniture 2000');
  t(G12, 'disposal uses the register book value', [FURN20, 'Furniture is depreciated at 10% for 12 months.', 'Sold furniture for ₹15,000.'], [null, null, 'Dr Cash 15000; Dr Loss on Sale of Furniture 3000; Cr Furniture 18000']);
  t(G12, 'disposal on credit', 'Sold machinery on credit to Ram for ₹60,000; book value ₹50,000.', 'Dr Ram 60000; Cr Machinery 50000; Cr Profit on Sale of Machinery 10000');
  t(G12, 'disposal: inconsistent figures → INVALID', 'Sold furniture at a profit of ₹5,000; book value ₹10,000; sold for ₹12,000.', { s: 'INVALID' });

  /* ---------------- 13. BAD DEBTS & PROVISIONS ---------------- */
  const G13 = '13 Bad debts & provisions';
  t(G13, 'bad debts then provision on ADJUSTED debtors', 'Debtors ₹1,00,000; bad debts ₹5,000; create provision at 5%.', 'Dr Bad Debts 5000; Cr Debtors 5000; Dr Profit & Loss 4750; Cr Provision for Doubtful Debts 4750');
  t(G13, 'direct write-off of a named debtor', 'Wrote off ₹3,000 as bad debt from Ram.', 'Dr Bad Debts 3000; Cr Ram 3000');
  t(G13, 'provision for discount on creditors', 'Creditors ₹80,000; create provision for discount on creditors at 2%.', 'Dr Provision for Discount on Creditors 1600; Cr Profit & Loss 1600');
  t(G13, 'existing + new provision → increase only', 'Provision for doubtful debts existing ₹2,000; new provision required ₹3,000.', 'Dr Profit & Loss 1000; Cr Provision for Doubtful Debts 1000');
  t(G13, 'existing + new provision → decrease', 'Provision for doubtful debts existing ₹5,000; new provision required ₹3,000.', 'Dr Provision for Doubtful Debts 2000; Cr Profit & Loss 2000');
  t(G13, 'bad debts + doubtful + discount provision (order of adjustments)', 'Debtors ₹1,00,000; bad debts ₹5,000; provision for doubtful debts 5%; provision for discount on debtors 2%.',
    'Dr Bad Debts 5000; Cr Debtors 5000; Dr Profit & Loss 6555; Cr Provision for Doubtful Debts 4750; Cr Provision for Discount on Debtors 1805');
  t(G13, 'further bad debts before provision', 'Debtors ₹1,00,000. Further bad debts ₹4,000. Maintain provision for doubtful debts at 5%.', 'Dr Bad Debts 4000; Cr Debtors 4000; Dr Profit & Loss 4800; Cr Provision for Doubtful Debts 4800');
  t(G13, 'provision uses the LEDGER existing provision', ['Debtors ₹1,00,000; create provision for doubtful debts at 5%.', 'Debtors ₹1,00,000; bad debts ₹5,000; create provision at 5%.'],
    [null, 'Dr Bad Debts 5000; Cr Debtors 5000; Dr Provision for Doubtful Debts 250; Cr Profit & Loss 250']);
  t(G13, 'insolvent debtor uses recorded balance', ['Sold goods to Ram ₹50,000 on credit.', 'Ram was declared insolvent; received ₹20,000 in full settlement.'], [null, 'Dr Cash 20000; Dr Bad Debts 30000; Cr Ram 50000']);
  t(G13, 'insolvent: both figures stated', 'Ram, owing ₹30,000, was declared insolvent; received ₹12,000 in final settlement.', 'Dr Cash 12000; Dr Bad Debts 18000; Cr Ram 30000');
  t(G13, 'bad debts recovered', 'Bad debts recovered ₹2,000 in cash.', 'Dr Cash 2000; Cr Bad Debts Recovered 2000');
  t(G13, "manager's commission BEFORE charging", "Manager is entitled to a commission of 5% on net profit before charging such commission. Net profit ₹1,00,000.", "Dr Manager's Commission 5000; Cr Outstanding Manager's Commission 5000");
  t(G13, "manager's commission AFTER charging", "Manager is entitled to a commission of 5% on net profit after charging such commission. Net profit ₹1,00,000.", "Dr Manager's Commission 4761.9; Cr Outstanding Manager's Commission 4761.9");

  /* ---------------- 14. ABNORMAL LOSS & INSURANCE ---------------- */
  const G14 = '14 Abnormal loss & insurance';
  t(G14, 'fire loss', 'Goods lost by fire ₹15,000.', 'Dr Loss by Fire/Theft 15000; Cr Purchases 15000');
  t(G14, 'lost in transit (no fire/theft word)', 'Goods worth ₹9,000 were lost in transit.', 'Dr Loss by Fire/Theft 9000; Cr Purchases 9000');
  t(G14, 'theft', 'Goods worth ₹5,000 were stolen.', 'Dr Loss by Fire/Theft 5000; Cr Purchases 5000');
  t(G14, 'flood + claim amount stated (no % demanded)', 'Goods lost by flood ₹20,000; insurance company admitted claim of ₹12,000.', 'Dr Insurance Claim 12000; Dr Loss by Fire/Theft 8000; Cr Purchases 20000');
  t(G14, 'fire + claim as a %', 'Goods worth ₹10,000 were destroyed by fire; insurance company admitted 60% of the claim.', 'Dr Insurance Claim 6000; Dr Loss by Fire/Theft 4000; Cr Purchases 10000');
  t(G14, 'fire → admitted → received (state carried)', ['Goods lost by fire ₹15,000.', 'Insurance company admitted claim ₹9,000.', 'Received insurance claim by bank ₹9,000.'],
    ['Dr Loss by Fire/Theft 15000; Cr Purchases 15000', 'Dr Insurance Claim 9000; Cr Loss by Fire/Theft 9000', 'Dr Bank 9000; Cr Insurance Claim 9000']);
  t(G14, 'flood → admitted → received', ['Goods lost by flood ₹20,000.', 'Insurance company admitted claim ₹12,000.', 'Received the insurance claim by cheque ₹12,000.'],
    ['Dr Loss by Fire/Theft 20000; Cr Purchases 20000', 'Dr Insurance Claim 12000; Cr Loss by Fire/Theft 12000', 'Dr Bank 12000; Cr Insurance Claim 12000']);
  t(G14, 'claim admitted as % of the RECORDED loss', ['Goods lost by fire ₹15,000.', 'Insurance company admitted 60% of the loss.'], [null, 'Dr Insurance Claim 9000; Cr Loss by Fire/Theft 9000']);
  t(G14, 'claim above the recorded loss → INVALID', ['Goods lost by fire ₹15,000.', 'Insurance company admitted claim ₹20,000.'], [null, { s: 'INVALID' }]);
  t(G14, 'claim received above the admitted claim → INVALID', ['Goods lost by fire ₹15,000.', 'Insurance company admitted claim ₹9,000.', 'Received the insurance claim of ₹9,500 by bank.'], [null, null, { s: 'INVALID' }]);
  t(G14, 'claim larger than loss in one sentence → INVALID', 'Goods worth ₹5,000 were destroyed by fire; insurance company admitted claim ₹8,000.', { s: 'INVALID' });
  t(G14, 'claim rejected → no entry', 'Insurance company rejected the claim.', { s: 'NO_ENTRY_REQUIRED' });
  t(G14, 'free samples', 'Goods costing ₹3,000 were given as free samples.', 'Dr Free Samples 3000; Cr Purchases 3000');
  t(G14, 'staff gifts', 'Goods worth ₹3,000 were given as festival gifts to staff.', 'Dr Staff Welfare Expenses 3000; Cr Purchases 3000');
  t(G14, 'charity', 'Goods worth ₹2,000 were donated to charity.', 'Dr Charity/Donation 2000; Cr Purchases 2000');
  t(G14, 'office use', 'Goods worth ₹1,500 were used for office purposes.', 'Dr Office Expenses 1500; Cr Purchases 1500');

  /* ---------------- 15. OPENING ENTRIES ---------------- */
  const G15 = '15 Opening entries';
  t(G15, 'bare list opening', 'Cash ₹60,000; Bank ₹90,000; Stock ₹1,20,000; Furniture ₹40,000; Machinery ₹1,00,000; Debtors ₹70,000; Creditors ₹50,000; Bank Loan ₹40,000',
    'Dr Cash 60000; Dr Bank 90000; Dr Goods (Stock) 120000; Dr Furniture 40000; Dr Machinery 100000; Dr Debtors 70000; Cr Creditors 50000; Cr Bank Loan 40000; Cr Capital 390000');
  t(G15, 'headed opening', 'Assets: Cash ₹50,000, Stock ₹30,000; Liabilities: Creditors ₹20,000', 'Dr Cash 50000; Dr Goods (Stock) 30000; Cr Creditors 20000; Cr Capital 60000');
  t(G15, 'opening debtor state usable later', ['Cash ₹60,000; Stock ₹1,20,000; Debtors ₹70,000; Creditors ₹50,000', 'Received ₹20,000 from the debtor.'], [null, 'Dr Cash 20000; Cr Debtors 20000']);

  /* ---------------- 16. SAFE FAILURE ---------------- */
  const G16 = '16 Safe failure (UNCERTAIN / INVALID / NO ENTRY)';
  t(G16, 'cash by cheque → contradiction', 'Paid cash by cheque ₹5,000.', { s: 'INVALID', has: 'contradictory' });
  t(G16, 'received but paid in settlement → contradiction', 'Received ₹20,000 but paid ₹30,000 in full settlement.', { s: 'INVALID', has: 'contradictory' });
  t(G16, 'on credit AND for cash → contradiction', 'Purchased goods on credit for cash ₹5,000.', { s: 'INVALID' });
  t(G16, 'error correction without details', 'Corrected an error relating to purchase of furniture.', { s: 'UNCERTAIN' });
  t(G16, 'asset exchange without values', 'A fixed asset was exchanged for another fixed asset.', { s: 'UNCERTAIN' });
  t(G16, 'no amount', 'Sold goods.', { s: 'INVALID' });
  t(G16, 'gibberish', 'Hello there how are you', { s: 'INVALID' });
  t(G16, 'amount without an account', 'Paid ₹5,000.', { s: 'INVALID' });
  t(G16, 'two amounts, cost vs depreciation unclear', 'Depreciation on furniture ₹5,000 and ₹3,000 at 10%.', { s: 'UNCERTAIN' });

  /* ---------------- 21. UNSEEN PARAPHRASES (none of these are in the practice bank) ---------------- */
  const G21 = '21 Unseen paraphrases';
  t(G21, 'credit + cheque + "the rest on credit"', 'Purchased goods worth ₹50,000 from Ramesh, paying ₹20,000 by cheque and the rest on credit.', 'Dr Purchases 50000; Cr Bank 20000; Cr Ramesh 30000');
  t(G21, 'firm paid … as salary and … as rent', 'The firm paid ₹6,000 as salary and ₹1,500 as rent by cheque.', 'Dr Salary 6000; Dr Rent 1500; Cr Bank 7500');
  t(G21, 'received … as commission and … as interest', 'Received ₹10,000 as commission and ₹2,000 as interest by bank.', 'Dr Bank 12000; Cr Commission Received 10000; Cr Interest Received 2000');
  t(G21, 'capital: "worth of goods"', 'Commenced business with ₹2,00,000 cash and ₹50,000 worth of goods.', 'Dr Cash 200000; Dr Goods (Stock) 50000; Cr Capital 250000');
  t(G21, 'capital: "a computer worth"', 'Started business with cash of ₹80,000 and a computer worth ₹30,000.', 'Dr Cash 80000; Dr Computer 30000; Cr Capital 110000');
  t(G21, 'capital: introduced … as capital', 'Introduced cash ₹50,000 and furniture ₹10,000 as capital.', 'Dr Cash 50000; Dr Furniture 10000; Cr Capital 60000');
  t(G21, 'the DEBTOR paid (direction from subject)', 'Ram paid ₹9,000 in full settlement of his ₹10,000 balance.', 'Dr Cash 9000; Dr Discount Allowed 1000; Cr Ram 10000');
  t(G21, 'discount stated as "was allowed"', 'Paid Suresh ₹4,800 in cash and was allowed a discount of ₹200, settling ₹5,000.', 'Dr Suresh 5000; Cr Cash 4800; Cr Discount Received 200');
  t(G21, 'GST-inclusive credit purchase', 'Purchased goods ₹1,00,000 including GST 18% on credit from Mohan.', 'Dr Purchases 84745.76; Dr Input CGST 7627.12; Dr Input SGST 7627.12; Cr Mohan 100000');
  t(G21, 'GST-inclusive credit sale', 'Sold goods to Rohan for ₹1,18,000 including GST at 18% on credit.', 'Dr Rohan 118000; Cr Sales 100000; Cr Output CGST 9000; Cr Output SGST 9000');
  t(G21, 'depreciation: months + cost in one sentence', 'Charge depreciation on machinery @ 15% p.a. for 8 months; machinery cost ₹1,20,000.', 'Dr Depreciation 12000; Cr Machinery 12000');
  t(G21, 'depreciation: WDV given as a book value', 'Written down value of machinery ₹80,000; depreciate at 10% WDV.', 'Dr Depreciation 8000; Cr Machinery 8000');
  t(G21, 'depreciation: "provided … on computer"', 'Provided depreciation of ₹500 on computer.', 'Dr Depreciation 500; Cr Computer 500');
  t(G21, 'disposal: book value in brackets', 'Sold furniture (book value ₹8,000) for ₹9,500.', 'Dr Cash 9500; Cr Furniture 8000; Cr Profit on Sale of Furniture 1500');
  t(G21, 'disposal: passive with cost and accumulated depreciation', 'Machinery costing ₹1,00,000 with accumulated depreciation ₹40,000 was sold for ₹50,000.', 'Dr Cash 50000; Dr Accumulated Depreciation 40000; Dr Loss on Sale of Machinery 10000; Cr Machinery 100000');
  t(G21, 'disposal with no book value known → not guessed', 'Sold old furniture for ₹4,000 in cash.', { s: 'UNCERTAIN' });
  t(G21, 'prepaid: "of which … is prepaid"', 'Insurance premium ₹6,000 paid, of which ₹1,500 is prepaid.', 'Dr Insurance Premium 4500; Dr Prepaid Insurance Premium 1500; Cr Cash 6000');
  t(G21, 'prepaid from dates (12 months from 1 October)', 'Rent ₹6,000 paid for 12 months from 1 October; year ends 31 March.', 'Dr Rent 3000; Dr Prepaid Rent 3000; Cr Cash 6000');
  t(G21, 'advance income from dates', 'Received ₹6,000 rent for 12 months from 1 October; year ends 31 March.', 'Dr Cash 6000; Cr Rent Received 3000; Cr Rent Received in Advance 3000');
  t(G21, 'prepaid from dates (9/12 unexpired)', 'Insurance ₹12,000 paid for 12 months from 1 January; year ends 31 March.', 'Dr Insurance Premium 3000; Dr Prepaid Insurance Premium 9000; Cr Cash 12000');
  t(G21, 'accident loss', 'Goods of ₹4,000 were destroyed in an accident.', 'Dr Loss by Fire/Theft 4000; Cr Purchases 4000');
  t(G21, 'loan repaid (passive wording)', 'The bank loan ₹50,000 was repaid by cheque.', 'Dr Bank Loan 50000; Cr Bank 50000');
  t(G21, 'payment for an EARLIER purchase is a creditor payment', 'Paid ₹2,500 to Ram for goods purchased earlier.', 'Dr Ram 2500; Cr Cash 2500');
  t(G21, 'receipt for an EARLIER sale is a debtor receipt', 'Received ₹2,500 from Ram for goods sold earlier.', 'Dr Cash 2500; Cr Ram 2500');
  t(G21, 'goods + asset on credit', 'Purchased goods ₹10,000 and furniture ₹5,000 on credit from Mohan.', 'Dr Purchases 10000; Dr Furniture 5000; Cr Mohan 15000');
  t(G21, 'mixed credit + cash keeps each part separate', 'Purchased goods ₹90,000 on credit from Mohan; freight ₹4,000 paid in cash.', 'Dr Purchases 90000; Dr Carriage Inwards 4000; Cr Cash 4000; Cr Mohan 90000');
  t(G21, 'dividend + interest in cash', 'Received dividend ₹3,000 and interest ₹1,000 in cash.', 'Dr Cash 4000; Cr Dividend Received 3000; Cr Interest Received 1000');
  t(G21, 'salary partly outstanding (different wording)', 'Paid salaries ₹5,000; ₹1,000 salary is still outstanding.', 'Dr Salary 6000; Cr Cash 5000; Cr Outstanding Salary 1000');
  t(G21, 'bank credited interest and debited charges', 'Bank credited interest ₹600 and debited charges ₹200.', 'Dr Bank 400; Dr Bank Charges 200; Cr Interest Received 600');

  /* ---------------- 22. CHEQUE LIFECYCLE, VERB VARIETY, DATES WITH YEARS ---------------- */
  const G22 = '22 Cheques, verbs, dates with years';
  const chq = 'Received a cheque from Ram ₹8,000.';
  t(G22, 'dishonour of a cheque still in hand', [chq, "Ram's cheque was dishonoured."], [null, 'Dr Ram 8000; Cr Cheques in Hand 8000']);
  t(G22, 'dishonour of a DEPOSITED cheque hits the bank', [chq, 'Deposited the cheque into bank.', "Ram's cheque was dishonoured."], [null, 'Dr Bank 8000; Cr Cheques in Hand 8000', 'Dr Ram 8000; Cr Bank 8000']);
  t(G22, 'endorsed cheque → the endorsee is debited, cheques-in-hand credited', [chq, 'Endorsed the cheque of Ram to Suresh.'], [null, 'Dr Suresh 8000; Cr Cheques in Hand 8000']);
  t(G22, 'sent for collection → collected', [chq, 'Sent the cheque to bank for collection.', 'The cheque was collected by the bank.'], [null, 'Dr Cheques Sent for Collection 8000; Cr Cheques in Hand 8000', 'Dr Bank 8000; Cr Cheques Sent for Collection 8000']);
  t(G22, 'dishonour with no cheque on record → UNCERTAIN', "Ram's cheque was dishonoured.", { s: 'UNCERTAIN' });
  t(G22, 'verb: remitted … towards', 'Remitted ₹4,000 towards rent and ₹1,000 towards insurance by bank.', 'Dr Rent 4000; Dr Insurance Premium 1000; Cr Bank 5000');
  t(G22, 'verb: cleared', 'Cleared salary ₹6,000 and wages ₹2,000 in cash.', 'Dr Salary 6000; Dr Wages 2000; Cr Cash 8000');
  t(G22, 'verb: acquired', 'Acquired machinery for ₹80,000 by cheque.', 'Dr Machinery 80000; Cr Bank 80000');
  t(G22, 'verb: collected (from debtor)', 'Collected ₹15,000 from Ram.', 'Dr Cash 15000; Cr Ram 15000');
  t(G22, 'verb: collected (income)', 'Collected rent ₹2,000 and interest ₹500 in cash.', 'Dr Cash 2500; Cr Rent Received 2000; Cr Interest Received 500');
  t(G22, 'verb: reimbursed', 'Reimbursed travelling expenses ₹1,200 in cash.', 'Dr Travelling Expenses 1200; Cr Cash 1200');
  t(G22, 'settled X\'s account by paying', "Settled Mohan's account by paying ₹9,700 by cheque against ₹10,000.", 'Dr Mohan 10000; Cr Bank 9700; Cr Discount Received 300');
  t(G22, 'date with a year is not money', 'Started business with cash ₹50,000 and stock ₹20,000 on 1 April 2026.', 'Dr Cash 50000; Dr Goods (Stock) 20000; Cr Capital 70000');
  t(G22, 'date "April 1, 2026" is not money', 'April 1, 2026: Paid rent ₹5,000.', 'Dr Rent 5000; Cr Cash 5000');
  t(G22, 'mixed modes per item are not guessed', 'Paid rent ₹2,000, wages ₹1,000 by cash and electricity ₹500 by cheque.', { s: 'UNCERTAIN' });
};
