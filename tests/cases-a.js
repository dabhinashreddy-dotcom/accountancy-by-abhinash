module.exports = function (t, E) {

  /* ---------------- 1. SIMPLE TRANSACTIONS ---------------- */
  const G1 = '01 Simple transactions';
  t(G1, 'commence with cash', 'Started business with cash ₹1,00,000.', 'Dr Cash 100000; Cr Capital 100000');
  t(G1, 'cash purchase', 'Purchased goods for cash ₹25,000.', 'Dr Purchases 25000; Cr Cash 25000');
  t(G1, 'credit purchase', 'Purchased goods from Ramesh on credit ₹30,000.', 'Dr Purchases 30000; Cr Ramesh 30000');
  t(G1, 'cash sale', 'Sold goods for cash ₹35,000.', 'Dr Cash 35000; Cr Sales 35000');
  t(G1, 'credit sale', 'Sold goods to Suresh on credit ₹28,000.', 'Dr Suresh 28000; Cr Sales 28000');
  t(G1, 'pay rent', 'Paid rent ₹5,000.', 'Dr Rent 5000; Cr Cash 5000');
  t(G1, 'receive commission', 'Received commission ₹2,000.', 'Dr Cash 2000; Cr Commission Received 2000');
  t(G1, 'deposit cash into bank', 'Deposited cash into bank ₹40,000.', 'Dr Bank 40000; Cr Cash 40000');
  t(G1, 'withdraw cash from bank', 'Withdrew cash from bank ₹10,000.', 'Dr Cash 10000; Cr Bank 10000');
  t(G1, 'drawings in cash', 'Proprietor withdrew cash for personal use ₹6,000.', 'Dr Drawings 6000; Cr Cash 6000');
  t(G1, 'furniture for cash', 'Purchased furniture for cash ₹12,000.', 'Dr Furniture 12000; Cr Cash 12000');
  t(G1, 'machinery by cheque', 'Purchased machinery by cheque ₹50,000.', 'Dr Machinery 50000; Cr Bank 50000');
  t(G1, 'carriage inward', 'Paid carriage inward ₹2,000.', 'Dr Carriage Inwards 2000; Cr Cash 2000');
  t(G1, 'interest by cheque', 'Received interest ₹1,500 by cheque.', 'Dr Bank 1500; Cr Interest Received 1500');
  t(G1, 'additional capital', 'Introduced additional capital ₹50,000 in cash.', 'Dr Cash 50000; Cr Capital 50000');
  t(G1, 'capital received (paraphrase)', 'Received ₹50,000 as capital in cash.', 'Dr Cash 50000; Cr Capital 50000');
  t(G1, 'electricity by bank', 'Paid electricity bill ₹1,200 by bank.', 'Dr Electricity Charges 1200; Cr Bank 1200');
  t(G1, 'pay creditor by cheque', 'Paid ₹15,000 to Suresh by cheque.', 'Dr Suresh 15000; Cr Bank 15000');
  t(G1, 'receive from debtor', 'Received ₹20,000 from Ram.', 'Dr Cash 20000; Cr Ram 20000');
  t(G1, 'purchase return', 'Returned goods to Ramesh ₹2,000.', 'Dr Ramesh 2000; Cr Purchase Returns 2000');
  t(G1, 'paid repairs (plural word)', 'Paid repairs ₹1,500.', 'Dr Repairs 1500; Cr Cash 1500');
  t(G1, 'stationery', 'Paid stationery ₹800 in cash.', 'Dr Printing & Stationery 800; Cr Cash 800');

  /* ---------------- 2. COMPOUND TRANSACTIONS (multi-amount) ---------------- */
  const G2 = '02 Compound / multi-amount';
  const capA = 'Dr Cash 100000; Dr Goods (Stock) 40000; Dr Furniture 20000; Cr Capital 160000';
  t(G2, 'TEST A — multi-asset capital', 'Apr 01: Commenced business with Cash ₹1,00,000, Goods ₹40,000, and Furniture ₹20,000.', capA);
  const payB = 'Dr Salary 5000; Dr Rent 2000; Dr Commission Paid 1000; Cr Cash 8000';
  t(G2, 'TEST B — compound expense payment', 'Apr 25: Paid Salaries ₹5,000, Rent ₹2,000, and Commission ₹1,000 in cash.', payB);
  t(G2, 'wording: paid salary, rent and commission in cash', 'Paid salary ₹5,000, rent ₹2,000 and commission ₹1,000 in cash.', payB);
  t(G2, 'wording: "of" + "through cash"', 'Paid salaries of ₹5,000, rent of ₹2,000 and commission of ₹1,000 through cash.', payB);
  t(G2, 'wording: passive voice', 'Salary ₹5,000, rent ₹2,000 and commission ₹1,000 were paid in cash.', payB);
  t(G2, 'wording: amount before account', 'Paid ₹5,000 salary, ₹2,000 rent and ₹1,000 commission by cash.', payB);
  t(G2, 'wording: "for" / "as"', 'Paid ₹5,000 for salaries, ₹2,000 for rent and ₹1,000 as commission in cash.', payB);
  t(G2, 'wording: unformatted numbers', 'Paid salary 5000, rent 2000 and commission 1000 in cash.', payB);
  t(G2, 'by bank', 'Paid salary ₹5,000, rent ₹2,000 and electricity ₹1,500 by bank.', 'Dr Salary 5000; Dr Rent 2000; Dr Electricity Charges 1500; Cr Bank 8500');
  t(G2, 'by cheque', 'Paid wages ₹4,000, rent ₹3,000 and insurance ₹2,000 by cheque.', 'Dr Wages 4000; Dr Rent 3000; Dr Insurance Premium 2000; Cr Bank 9000');
  t(G2, 'four items', 'Paid salaries ₹5,000, rent ₹2,000, commission ₹1,000 and electricity ₹1,500 in cash.', 'Dr Salary 5000; Dr Rent 2000; Dr Commission Paid 1000; Dr Electricity Charges 1500; Cr Cash 9500');
  t(G2, 'asset + expense', 'Purchased furniture ₹20,000 and stationery ₹2,000 for cash.', 'Dr Furniture 20000; Dr Printing & Stationery 2000; Cr Cash 22000');
  t(G2, 'capital: stock instead of goods', 'Started business with cash ₹1,00,000, stock ₹40,000 and furniture ₹20,000.', capA);
  t(G2, 'capital: four assets', 'Started business with cash ₹1,00,000, machinery ₹50,000, stock ₹30,000 and furniture ₹20,000.', 'Dr Cash 100000; Dr Machinery 50000; Dr Goods (Stock) 30000; Dr Furniture 20000; Cr Capital 200000');
  t(G2, 'capital: "amount then item" (unseen paraphrase)', 'Business was launched with ₹1 lakh cash, ₹40,000 inventory and ₹20,000 furniture.', capA);
  t(G2, 'capital: bank + furniture', 'Commenced business with Bank ₹50,000 and Furniture ₹10,000.', 'Dr Bank 50000; Dr Furniture 10000; Cr Capital 60000');
  t(G2, 'capital: stated capital agrees', 'Started business with cash ₹80,000 and goods ₹20,000; capital ₹1,00,000.', 'Dr Cash 80000; Dr Goods (Stock) 20000; Cr Capital 100000');
  t(G2, 'capital: stated capital disagrees → UNCERTAIN', 'Started business with cash ₹80,000 and goods ₹20,000; capital ₹90,000.', { s: 'UNCERTAIN' });
  t(G2, 'receipts: rent + commission by cheque', 'Received rent ₹5,000 and commission ₹2,000 by cheque.', 'Dr Bank 7000; Cr Rent Received 5000; Cr Commission Received 2000');
  t(G2, 'receipts: three incomes in cash', 'Received interest ₹1,000, commission ₹3,000 and rent ₹4,000 in cash.', 'Dr Cash 8000; Cr Interest Received 1000; Cr Commission Received 3000; Cr Rent Received 4000');
  t(G2, 'no mode stated → cash (assumption)', 'Paid salary ₹5,000 and rent ₹2,000.', { s: 'VALID', has: 'cash assumed' });
  t(G2, 'electricity + telephone by bank', 'Paid electricity ₹1,200 and telephone ₹800 by bank.', 'Dr Electricity Charges 1200; Dr Telephone Charges 800; Cr Bank 2000');
  t(G2, 'goods + cartage', 'Purchased goods ₹25,000 and paid cartage ₹1,500 in cash.', 'Dr Purchases 25000; Dr Carriage Inwards 1500; Cr Cash 26500');
  t(G2, 'asset + installation capitalised', 'Purchased machinery ₹50,000 and paid installation charges ₹5,000 in cash.', 'Dr Machinery 55000; Cr Cash 55000');
  t(G2, 'unresolved amount → INVALID (no silent drop)', 'Paid salary ₹5,000 and ₹2,000 in cash.', { s: 'INVALID', has: 'which amount belongs' });
  t(G2, 'amount for a party + amount for an item → UNCERTAIN', 'Paid ₹5,000 to Ramesh and ₹2,000 for stationery.', { s: 'UNCERTAIN' });
  t(G2, 'two accounts sharing one amount → not posted', 'Paid salary and rent ₹7,000 and ₹1,000 in cash.', { s: 'UNCERTAIN' });
  t(G2, 'commission is an EXPENSE when paid', 'Paid commission ₹1,000 in cash.', 'Dr Commission Paid 1000; Cr Cash 1000');
  t(G2, 'unseen: "for … and … in cash"', 'Paid ₹9,000 for salaries and ₹3,000 for rent in cash.', 'Dr Salary 9000; Dr Rent 3000; Cr Cash 12000');
  t(G2, 'unseen: mixed noun order', 'Paid rent of ₹3,000, wages of ₹6,000 and postage of ₹400 by cheque.', 'Dr Rent 3000; Dr Wages 6000; Dr Postage & Courier 400; Cr Bank 9400');

  /* ---------------- 3. DATES / NUMBERS NEVER BECOME MONEY ---------------- */
  const G3 = '03 Dates, durations, number formats';
  t(G3, '1-Apr prefix', '1-Apr: Paid rent ₹5,000.', 'Dr Rent 5000; Cr Cash 5000');
  t(G3, '01/04/2026 prefix', '01/04/2026 Paid rent ₹5,000 in cash.', 'Dr Rent 5000; Cr Cash 5000');
  t(G3, '1st April', '1st April Paid rent ₹5,000.', 'Dr Rent 5000; Cr Cash 5000');
  t(G3, 'April 1:', 'April 1: Paid rent ₹5,000.', 'Dr Rent 5000; Cr Cash 5000');
  t(G3, '1/4:', '1/4: Paid rent ₹5,000.', 'Dr Rent 5000; Cr Cash 5000');
  t(G3, 'duration is not money', 'Paid rent ₹5,000 for 3 months in cash.', 'Dr Rent 5000; Cr Cash 5000');
  t(G3, 'year is not money', 'Paid rent 5000 for the year 2026.', 'Dr Rent 5000; Cr Cash 5000');
  t(G3, 'quantity is not money', 'Sold 10 units of goods for ₹5,000 cash.', 'Dr Cash 5000; Cr Sales 5000');
  t(G3, '₹100000', 'Paid rent ₹100000 in cash.', 'Dr Rent 100000; Cr Cash 100000');
  t(G3, 'plain 100000', 'Paid rent 100000 in cash.', 'Dr Rent 100000; Cr Cash 100000');
  t(G3, 'Indian grouping', 'Paid rent ₹1,00,000 in cash.', 'Dr Rent 100000; Cr Cash 100000');
  t(G3, '₹1 lakh', 'Paid rent ₹1 lakh in cash.', 'Dr Rent 100000; Cr Cash 100000');
  t(G3, '1.5 lakh', 'Paid rent ₹1.5 lakh in cash.', 'Dr Rent 150000; Cr Cash 150000');
  t(G3, '2 lakh (no ₹)', 'Paid rent 2 lakh by bank.', 'Dr Rent 200000; Cr Bank 200000');
  t(G3, '₹2 crore', 'Purchased land for ₹2 crore by cheque.', 'Dr Land 20000000; Cr Bank 20000000');
  t(G3, 'Rs. prefix', 'Paid rent Rs. 5,000 in cash.', 'Dr Rent 5000; Cr Cash 5000');
  t(G3, 'date + compound', '1-Apr: Paid salary ₹5,000 and rent ₹2,000 in cash.', 'Dr Salary 5000; Dr Rent 2000; Cr Cash 7000');
  t(G3, '"year 2" is a label, not money', 'Furniture ₹1,00,000 depreciation @20% WDV year 2.', 'Dr Depreciation 16000; Cr Furniture 16000');

  /* ---------------- 4. SETTLEMENT + DISCOUNT ---------------- */
  const G4 = '04 Settlement & discount';
  t(G4, 'REQUIRED — pay Ramesh (discount received)', 'Paid Ramesh ₹23,500 by cheque and received ₹1,500 discount in full settlement of ₹25,000.', 'Dr Ramesh 25000; Cr Bank 23500; Cr Discount Received 1500');
  t(G4, 'REQUIRED — receive from Shyam (discount allowed)', 'Received ₹28,500 by cheque from Shyam in full settlement of ₹30,000.', 'Dr Bank 28500; Dr Discount Allowed 1500; Cr Shyam 30000');
  t(G4, 'pay in cash, two amounts', 'Paid Suresh ₹9,500 in cash in full settlement of ₹10,000.', 'Dr Suresh 10000; Cr Cash 9500; Cr Discount Received 500');
  t(G4, 'receive in cash', 'Received ₹4,750 in cash from Ram in full settlement of ₹5,000.', 'Dr Cash 4750; Dr Discount Allowed 250; Cr Ram 5000');
  t(G4, '"final settlement of his account"', 'Paid Ramesh ₹24,000 by cheque in final settlement of his account of ₹25,000.', 'Dr Ramesh 25000; Cr Bank 24000; Cr Discount Received 1000');
  t(G4, 'party settled his own account', 'Shyam settled his account of ₹30,000 by paying ₹28,500 by cheque.', 'Dr Bank 28500; Dr Discount Allowed 1500; Cr Shyam 30000');
  t(G4, 'paid to Mohan by bank', 'Paid ₹19,500 to Mohan in full settlement of ₹20,000 by bank.', 'Dr Mohan 20000; Cr Bank 19500; Cr Discount Received 500');
  t(G4, 'discount amount stated explicitly', 'Paid Ramesh ₹23,500 by cheque; discount received ₹1,500 in full settlement of ₹25,000.', 'Dr Ramesh 25000; Cr Bank 23500; Cr Discount Received 1500');
  t(G4, 'party from previous transaction', ['Sold goods to Ram on credit ₹30,000.', 'Received ₹29,000 by cheque in full settlement.'], [null, 'Dr Bank 29000; Dr Discount Allowed 1000; Cr Ram 30000']);
  t(G4, 'payment above balance → INVALID', 'Paid Ramesh ₹26,000 in full settlement of ₹25,000.', { s: 'INVALID' });
  t(G4, 'figures do not add up → INVALID', 'Paid Ramesh ₹23,500 and received ₹2,000 discount in full settlement of ₹25,000.', { s: 'INVALID', has: 'do not add up' });
  t(G4, 'direction flips with paid/received', 'Paid ₹4,500 to Hari in full settlement of ₹5,000.', 'Dr Hari 5000; Cr Cash 4500; Cr Discount Received 500');
  t(G4, 'direction flips (received)', 'Received ₹4,500 from Hari in full settlement of ₹5,000.', 'Dr Cash 4500; Dr Discount Allowed 500; Cr Hari 5000');

  /* ---------------- 5. GST ---------------- */
  const G5 = '05 GST';
  t(G5, 'REQUIRED — CGST+SGST purchase', 'Purchased goods ₹40,000 plus CGST 9% and SGST 9% for cash.', 'Dr Purchases 40000; Dr Input CGST 3600; Dr Input SGST 3600; Cr Cash 47200');
  t(G5, 'REQUIRED — IGST purchase', 'Purchased goods ₹75,000 plus IGST 18% by cheque.', 'Dr Purchases 75000; Dr Input IGST 13500; Cr Bank 88500');
  t(G5, 'REQUIRED — GST-inclusive purchase', 'Purchased goods ₹44,000 inclusive of GST 10% for cash.', 'Dr Purchases 40000; Dr Input CGST 2000; Dr Input SGST 2000; Cr Cash 44000');
  t(G5, 'GST-inclusive sale', 'Sold goods ₹59,000 including GST 18% for cash.', 'Dr Cash 59000; Cr Sales 50000; Cr Output CGST 4500; Cr Output SGST 4500');
  t(G5, 'REQUIRED — sales return incl. GST', 'Customer returned goods worth ₹7,080 including GST 18%.', 'Dr Sales Returns 6000; Dr Output CGST 540; Dr Output SGST 540; Cr Debtors 7080');
  t(G5, 'purchase return incl. GST', 'Returned goods worth ₹11,800 including GST 18% to Ramesh.', 'Dr Ramesh 11800; Cr Purchase Returns 10000; Cr Input CGST 900; Cr Input SGST 900');
  t(G5, 'purchase return excl. GST', 'Returned goods worth ₹10,000 plus GST 18% to Ramesh.', 'Dr Ramesh 11800; Cr Purchase Returns 10000; Cr Input CGST 900; Cr Input SGST 900');
  t(G5, 'sale plus GST', 'Sold goods ₹50,000 plus GST 18% for cash.', 'Dr Cash 59000; Cr Sales 50000; Cr Output CGST 4500; Cr Output SGST 4500');
  t(G5, 'IGST sale on credit', 'Sold goods ₹50,000 plus IGST 12% on credit to Rohan.', 'Dr Rohan 56000; Cr Sales 50000; Cr Output IGST 6000');
  t(G5, 'GST on an expense', 'Paid rent ₹10,000 plus GST 18% by bank.', 'Dr Rent 10000; Dr Input CGST 900; Dr Input SGST 900; Cr Bank 11800');
  const gstSeq = ['Purchased goods ₹40,000 plus CGST 9% and SGST 9% for cash.', 'Sold goods ₹80,000 plus CGST 9% and SGST 9% for cash.'];
  t(G5, 'set-off uses ACTUAL balances', gstSeq.concat('Set off input GST against output GST.'), [null, null, 'Dr Output CGST 3600; Dr Output SGST 3600; Cr Input CGST 3600; Cr Input SGST 3600']);
  t(G5, 'set-off with no balances → INVALID', 'Set off input GST against output GST.', { s: 'INVALID' });
  t(G5, 'pay remaining GST liability', gstSeq.concat('Set off input GST against output GST.', 'Paid GST liability ₹7,200 by bank.'), [null, null, null, 'Dr Output CGST 3600; Dr Output SGST 3600; Cr Bank 7200']);
  t(G5, 'GST payment above liability → INVALID', gstSeq.concat('Set off input GST against output GST.', 'Paid GST liability ₹9,000 by bank.'), [null, null, null, { s: 'INVALID' }]);
  t(G5, 'IGST credit set off against CGST then SGST', ['Purchased goods ₹50,000 plus IGST 18% for cash.', 'Sold goods ₹40,000 plus CGST 9% and SGST 9% for cash.', 'Set off GST.'], [null, null, 'Dr Output CGST 3600; Dr Output SGST 3600; Cr Input IGST 7200']);
  t(G5, 'set-off never exceeds availability', ['Purchased goods ₹10,000 plus CGST 9% and SGST 9% for cash.', 'Sold goods ₹80,000 plus CGST 9% and SGST 9% for cash.', 'Set off GST.'], [null, null, 'Dr Output CGST 900; Dr Output SGST 900; Cr Input CGST 900; Cr Input SGST 900']);
  t(G5, 'asymmetric CGST/SGST rates', 'Purchased goods ₹10,000 plus CGST 6% and SGST 9% for cash.', 'Dr Purchases 10000; Dr Input CGST 600; Dr Input SGST 900; Cr Cash 11500');

  /* ---------------- 6. SPLIT PAYMENTS ---------------- */
  const G6 = '06 Split payments (cash/bank/bill/credit)';
  t(G6, 'REQUIRED — cash + bill (purchase)', 'Purchased goods ₹80,000; paid ₹30,000 immediately and accepted a bill for the balance.', 'Dr Purchases 80000; Cr Cash 30000; Cr Bills Payable 50000');
  t(G6, 'REQUIRED — cash + cheque + bill', 'Purchased goods ₹80,000; paid ₹20,000 cash, ₹30,000 by cheque and accepted a bill for the balance.', 'Dr Purchases 80000; Cr Cash 20000; Cr Bank 30000; Cr Bills Payable 30000');
  t(G6, 'REQUIRED — credit purchase + freight', 'Purchased goods ₹90,000 on credit from Mohan; freight ₹4,000 paid in cash.', 'Dr Purchases 90000; Dr Carriage Inwards 4000; Cr Cash 4000; Cr Mohan 90000');
  t(G6, 'REQUIRED — cartage', 'Purchased goods for ₹25,000 and paid cartage ₹1,500 in cash.', 'Dr Purchases 25000; Dr Carriage Inwards 1500; Cr Cash 26500');
  t(G6, 'REQUIRED — trade discount + 40% now', 'Purchased goods ₹50,000 less 10% trade discount; paid 40% immediately and agreed to pay the balance later.', 'Dr Purchases 45000; Cr Cash 18000; Cr Creditors 27000');
  t(G6, 'REQUIRED — sale on credit + freight charged', 'Sold goods ₹90,000 on credit to Rohan; charged freight ₹3,000 to the customer.', 'Dr Rohan 93000; Cr Sales 90000; Cr Freight Recovered 3000');
  t(G6, 'REQUIRED — sale: cash + bill', 'Sold goods ₹80,000 to Rohan; received ₹30,000 immediately and accepted a bill for the balance.', 'Dr Cash 30000; Dr Bills Receivable 50000; Cr Sales 80000');
  t(G6, 'REQUIRED — trade + partial + cash discount', 'Sold goods ₹1,00,000 less 10% trade discount to Sita; received 60% immediately and 5% cash discount on the amount received.', 'Dr Cash 51300; Dr Discount Allowed 2700; Dr Sita 36000; Cr Sales 90000');
  t(G6, 'sale: cash + cheque + credit', 'Sold goods ₹80,000 to Rohan; received ₹20,000 in cash, ₹30,000 by cheque and the balance on credit.', 'Dr Cash 20000; Dr Bank 30000; Dr Rohan 30000; Cr Sales 80000');
  t(G6, 'purchase: cash + cheque only', 'Purchased goods ₹60,000; paid ₹20,000 by cash and ₹40,000 by cheque.', 'Dr Purchases 60000; Cr Cash 20000; Cr Bank 40000');
  t(G6, 'modes exceed total → INVALID', 'Purchased goods ₹50,000; paid ₹40,000 cash and ₹30,000 by cheque.', { s: 'INVALID' });
  t(G6, 'unaccounted balance → UNCERTAIN', 'Purchased goods ₹50,000; paid ₹20,000 cash and ₹10,000 by cheque.', { s: 'UNCERTAIN', has: 'unaccounted' });
  t(G6, 'asset: cash + cheque + credit', 'Purchased furniture ₹50,000; paid ₹10,000 cash, ₹20,000 by cheque and the balance on credit.', 'Dr Furniture 50000; Cr Cash 10000; Cr Bank 20000; Cr Furniture Supplier/Creditor 20000');
  t(G6, 'no creditor when balance became a bill', 'Purchased goods ₹80,000; paid ₹30,000 in cash and accepted a bill for ₹50,000.', 'Dr Purchases 80000; Cr Cash 30000; Cr Bills Payable 50000');
};
