/* ============================================================
   EXPANDED EXAM BANK — Group 07 (Trial Balance + Depreciation)
   Authored for the CBSE Class 11 Accountancy (055) syllabus.
   Generated source fragment; concatenated into questions-expanded.js.
   ============================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.EXAM_Q_GROUP07 = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  return [
    /* ----------------------------------------------------------
       CHAPTER 13 — TRIAL BALANCE (tb)
       ---------------------------------------------------------- */
    {
      id: "x-tb-0001", chapter: "tb", topic: "Classification of Accounts",
      type: "mcq", difficulty: "Easy", marks: 1,
      q: "Carriage Outward A/c will appear in the Trial Balance as:",
      options: ["A debit balance, because it is an expense of the business",
        "A credit balance, because it is an income of the business",
        "It does not appear in a Trial Balance at all",
        "A credit balance, because it reduces sales"],
      answerIndex: 0,
      explanation: "Carriage Outward is the expense incurred on sending goods to customers. Expenses are nominal accounts with debit balances, so Carriage Outward A/c goes into the Debit column of the Trial Balance.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0002", chapter: "tb", topic: "Classification of Accounts",
      type: "mcq", difficulty: "Easy", marks: 1,
      q: "Interest on Capital A/c is shown in the Trial Balance as:",
      options: ["A credit balance, because capital itself shows a credit balance",
        "A debit balance, because it is an expense for the business",
        "It is never shown in a Trial Balance",
        "A debit balance only when the interest is actually paid"],
      answerIndex: 1,
      explanation: "Interest on Capital is charged by the owner on the capital invested, so it reduces the profit of the business — an expense, and therefore a debit balance. It is the opposite of Interest on Drawings, which is an income for the business and shows a credit balance.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0003", chapter: "tb", topic: "Classification of Accounts",
      type: "mcq", difficulty: "Medium", marks: 1,
      q: "A loan of ₹25,000 given to another business is shown in the Trial Balance as:",
      options: ["A credit balance, because it is a loan",
        "It does not appear in a Trial Balance",
        "A debit balance, because it is an amount recoverable by the business",
        "A debit balance only in the year in which the loan is given"],
      answerIndex: 2,
      explanation: "A loan given (advanced) is money that others owe to the business, i.e. an asset. Assets carry debit balances, so it appears in the Debit column. A loan taken, on the other hand, is a liability and would appear in the Credit column.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0004", chapter: "tb", topic: "Debit and Credit Balances",
      type: "mcq", difficulty: "Easy", marks: 1,
      q: "The bank column of the Cash Book shows an overdraft of ₹18,000. How will this appear in the Trial Balance?",
      options: ["As a debit balance of ₹18,000, because it is a bank balance",
        "As a credit balance of ₹18,000, because it is an amount the business owes the bank",
        "It will not appear in the Trial Balance",
        "As a debit balance of ₹18,000, but only if the bank confirms it"],
      answerIndex: 1,
      explanation: "A bank overdraft means the business has withdrawn more than it deposited — it is a liability. Liabilities carry credit balances, so an overdraft of ₹18,000 appears in the Credit column, the opposite of a positive bank balance.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0005", chapter: "tb", topic: "Errors Affecting Trial Balance",
      type: "mcq", difficulty: "Medium", marks: 1,
      q: "Which of these errors will cause a Trial Balance to disagree?",
      options: ["Repairs of ₹2,000 on the delivery van debited to Motor Vehicles A/c",
        "A cash sale of ₹1,500 completely left out of the books",
        "Two equal errors of ₹300 each that exactly cancel each other's effect",
        "The total of the Salaries A/c being written ₹700 more than it should be"],
      answerIndex: 3,
      explanation: "Only a one-sided error disturbs the totals. Overcasting the Salaries A/c makes the Debit column ₹700 heavier, so the Trial Balance disagrees. The error of principle, the complete omission and the pair of equal errors (compensating errors) leave both totals equally affected.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0006", chapter: "tb", topic: "Errors Not Affecting Trial Balance",
      type: "mcq", difficulty: "Medium", marks: 1,
      q: "Which of these errors will NOT be revealed by a Trial Balance that agrees?",
      options: ["A debit balance of ₹1,200 written in the credit column of the list",
        "The Machinery A/c balance being undercast by ₹600",
        "A purchase of goods worth ₹5,000 not being entered in the Journal at all",
        "₹800 written as ₹80 while copying a balance into the Trial Balance"],
      answerIndex: 2,
      explanation: "A transaction that is never recorded anywhere affects neither the debit nor the credit side, so the totals stay equal and the Trial Balance still agrees. The other three are one-sided mistakes that make the two columns differ.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0007", chapter: "tb", topic: "Suspense Account",
      type: "mcq", difficulty: "Medium", marks: 1,
      q: "A Trial Balance shows Total Debit ₹96,300 and Total Credit ₹95,500. Where will the difference be shown so that the Trial Balance agrees?",
      options: ["In the credit column as Suspense A/c ₹800",
        "In the debit column as Suspense A/c ₹800",
        "In the credit column as Suspense A/c ₹1,600",
        "In the debit column as Suspense A/c ₹1,600"],
      answerIndex: 0,
      explanation: "Difference = ₹96,300 − ₹95,500 = ₹800. The debit column is heavier, so the credit column is short by ₹800. The difference is therefore entered in the credit column as Suspense A/c ₹800, and both columns then total ₹96,300.",
      tags: ["competency"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0008", chapter: "tb", topic: "Suspense Account",
      type: "mcq", difficulty: "Hard", marks: 1,
      q: "A difference of ₹1,200 was shown in the debit column of the Trial Balance as Suspense A/c. On checking, it was found that the balance of Bank Overdraft A/c (₹1,200) had been left out of the Trial Balance. Which entry will close the Suspense A/c?",
      options: ["Bank Overdraft A/c Dr. ₹1,200; To Suspense A/c ₹1,200",
        "Suspense A/c Dr. ₹1,200; To Bank Overdraft A/c ₹1,200",
        "Suspense A/c Dr. ₹1,200; To Cash A/c ₹1,200",
        "No entry is needed, because the Trial Balance already agreed"],
      answerIndex: 1,
      explanation: "The Bank Overdraft is a credit balance, so leaving it out made the credit column short and forced the suspense of ₹1,200 into the debit column. To show the overdraft and remove the suspense the entry is Suspense A/c Dr. ₹1,200; To Bank Overdraft A/c ₹1,200 — after this the Suspense A/c stands at nil.",
      tags: ["competency"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0009", chapter: "tb", topic: "Suspense Account",
      type: "mcq", difficulty: "Easy", marks: 1,
      q: "After every difference has been located and corrected, the balance of the Suspense Account will be:",
      options: ["Nil", "Equal to the difference first shown", "Always a debit balance", "Always a credit balance"],
      answerIndex: 0,
      explanation: "The Suspense A/c is opened only to make the two columns agree while the error is still unknown. Every correction debits or credits it until the whole amount is used up, so once all the differences are traced its balance is nil.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0010", chapter: "tb", topic: "Suspense Account",
      type: "mcq", difficulty: "Medium", marks: 1,
      q: "Which of these errors would have created a Suspense Account in the first place?",
      options: ["A cash transaction of ₹700 not being recorded at all",
        "The debit balance of Insurance A/c ₹1,000 being omitted from the Trial Balance",
        "Furniture purchased for ₹9,000 debited to Purchases A/c",
        "₹500 paid to one creditor being debited to another creditor of the same class"],
      answerIndex: 1,
      explanation: "A suspense account arises only from a one-sided error. Omitting a debit balance of ₹1,000 makes the debit column short by ₹1,000, so the difference had to be parked in a Suspense A/c. Complete omission, error of principle and posting to the wrong person of the same class keep both sides equally affected.",
      tags: ["competency"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0011", chapter: "tb", topic: "Classification of Accounts",
      type: "mcq", difficulty: "Easy", marks: 1,
      q: "Rent Paid A/c is a ________ account and its balance is shown in the ________ column of the Trial Balance.",
      options: ["nominal; debit", "real; credit", "personal; debit", "nominal; credit"],
      answerIndex: 0,
      explanation: "Rent Paid is an expense, and all expense accounts are nominal accounts. Nominal accounts that represent expenses carry debit balances, so Rent Paid A/c goes into the Debit column of the Trial Balance.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0012", chapter: "tb", topic: "Errors of Principle",
      type: "mcq", difficulty: "Medium", marks: 1,
      q: "₹1,500 spent on the repairs of the delivery van was debited to Motor Vehicles A/c. This error is:",
      options: ["An error of commission, and the Trial Balance will disagree",
        "An error of principle, and the Trial Balance will still agree",
        "An error of omission, and the Trial Balance will disagree",
        "A compensating error, and the Trial Balance will still agree"],
      answerIndex: 1,
      explanation: "A revenue item (repairs) has been charged to a capital account (Motor Vehicles). The amount is correctly debited — only the type of account is wrong — so both columns are equally affected and the Trial Balance still agrees. Wrong classification of an account is an error of principle.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0013", chapter: "tb", topic: "Errors of Commission",
      type: "mcq", difficulty: "Medium", marks: 1,
      q: "₹2,000 paid to Mr. Sen was debited to Mr. Sengupta's account, both of them being trade creditors. This is:",
      options: ["An error of principle that will not affect the agreement of the Trial Balance",
        "An error of omission that will affect the agreement of the Trial Balance",
        "A compensating error that will affect the agreement of the Trial Balance",
        "An error of commission that will not affect the agreement of the Trial Balance"],
      answerIndex: 3,
      explanation: "The correct amount has been posted to the account of the wrong person of the same class — that is an error of commission. Since ₹2,000 has still been debited once, the two totals remain equal and the Trial Balance agrees.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0014", chapter: "tb", topic: "Limitations of Trial Balance",
      type: "mcq", difficulty: "Medium", marks: 1,
      q: "(A) An agreeing Trial Balance is not conclusive proof that the books are free from all errors.\n(R) Errors of principle, complete omissions and compensating errors do not disturb the equality of the debit and credit totals.",
      options: ["Both A and R are true and R is the correct explanation of A",
        "Both A and R are true but R is not the correct explanation of A",
        "A is true but R is false",
        "A is false but R is true"],
      answerIndex: 0,
      explanation: "Both statements are true, and the reason explains exactly why the first is true: these three kinds of errors leave the two columns equally tallied, so a Trial Balance can agree even while the books are wrong.",
      tags: ["assertion-reason", "conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0015", chapter: "tb", topic: "Balance Method",
      type: "mcq", difficulty: "Easy", marks: 1,
      q: "(A) Every ledger account has to be balanced before a Trial Balance is prepared.\n(R) The Trial Balance prepared under the balance method lists the opening balance of each ledger account.",
      options: ["Both A and R are true and R is the correct explanation of A",
        "Both A and R are true but R is not the correct explanation of A",
        "A is true but R is false",
        "A is false but R is true"],
      answerIndex: 2,
      explanation: "Statement A is true because the balance method uses the closing figure of each account. Statement R is false — the Trial Balance lists the CLOSING balance of each account, not the opening balance.",
      tags: ["assertion-reason", "conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0016", chapter: "tb", topic: "Features of Trial Balance",
      type: "mcq", difficulty: "Medium", marks: 1,
      q: "Consider the following statements:\n(i) A Trial Balance is a statement and not an account.\n(ii) A Trial Balance can be prepared only on the last day of the accounting year.\n(iii) The agreement of a Trial Balance proves that no error exists in the books.\n(iv) Under the balance method each ledger account contributes a single closing figure to the Trial Balance.\nWhich of the statements given above are correct?",
      options: ["(i), (ii) and (iii) only", "(ii) and (iii) only", "(i), (ii), (iii) and (iv)", "(i) and (iv) only"],
      answerIndex: 3,
      explanation: "(i) is correct — a Trial Balance is only a two-column list of balances. (ii) is wrong because it can be prepared on any date. (iii) is wrong because some errors do not disturb the totals. (iv) is correct — under the balance method each account contributes one closing balance.",
      tags: ["statement", "conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0017", chapter: "tb", topic: "Classification of Errors",
      type: "mcq", difficulty: "Hard", marks: 1,
      q: "Consider the following statements about errors:\n(i) A complete omission of a transaction does not affect the agreement of the Trial Balance.\n(ii) An error of commission always makes the Trial Balance disagree.\n(iii) A compensating error is a group of errors whose effects cancel each other.\n(iv) An error of principle affects the agreement of the Trial Balance.\nWhich of the statements given above is/are correct?",
      options: ["(ii) and (iv) only", "(i) and (iii) only", "(i), (ii) and (iii) only", "(iii) and (iv) only"],
      answerIndex: 1,
      explanation: "(i) is correct — nothing was recorded on either side. (ii) is wrong — posting to the wrong person of the same class keeps the totals equal. (iii) is correct by definition. (iv) is wrong — in an error of principle the amount is debited, only to the wrong class of account, so the Trial Balance still agrees.",
      tags: ["statement", "hots"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0018", chapter: "tb", topic: "Features of Trial Balance",
      type: "mcq", difficulty: "Easy", marks: 1,
      q: "(A) A Trial Balance may be prepared on any date and not necessarily on 31st March.\n(R) Assets, expenses and drawings normally show debit balances in a Trial Balance.",
      options: ["Both A and R are true and R is the correct explanation of A",
        "Both A and R are true but R is not the correct explanation of A",
        "A is true but R is false",
        "A is false but R is true"],
      answerIndex: 1,
      explanation: "Both statements are true, but the second does not explain the first. A Trial Balance can be drawn up on any date because it is simply a list of the balances standing on that date; the normal sides of different accounts have nothing to do with when it is prepared.",
      tags: ["assertion-reason", "conceptual"], provenance: { kind: "new", verified: true }
    },

    /* ---- Trial Balance — numericals ---- */
    {
      id: "x-tb-0019", chapter: "tb", topic: "Totals of a Trial Balance",
      type: "numerical", difficulty: "Easy", marks: 1,
      q: "A Trial Balance lists the following debit balances: Cash in Hand ₹12,500, Furniture ₹18,000, Sundry Debtors ₹24,500 and Purchases ₹36,000. What is the total of the debit column?",
      value: 91000, tolerance: 0, prefix: "₹",
      explanation: "Total of the Debit column = ₹12,500 + ₹18,000 + ₹24,500 + ₹36,000 = ₹91,000.",
      tags: ["numerical", "competency"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0020", chapter: "tb", topic: "Totals of a Trial Balance",
      type: "numerical", difficulty: "Easy", marks: 1,
      q: "The credit balances in a Trial Balance are Capital ₹60,000, Sales ₹84,000, Sundry Creditors ₹15,000 and Loan taken from a bank ₹12,000. What is the total of the credit column?",
      value: 171000, tolerance: 0, prefix: "₹",
      explanation: "Total of the Credit column = ₹60,000 + ₹84,000 + ₹15,000 + ₹12,000 = ₹1,71,000.",
      tags: ["numerical"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0021", chapter: "tb", topic: "Agreement of Trial Balance",
      type: "numerical", difficulty: "Easy", marks: 1,
      q: "A Trial Balance shows Total Debit ₹1,42,600 and Total Credit ₹1,40,900. By how much do the two columns differ?",
      value: 1700, tolerance: 0, prefix: "₹",
      explanation: "Difference = ₹1,42,600 − ₹1,40,900 = ₹1,700. Since the totals are unequal, the Trial Balance does not agree and the ₹1,700 has to be traced.",
      tags: ["numerical"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0022", chapter: "tb", topic: "Suspense Account",
      type: "numerical", difficulty: "Medium", marks: 1,
      q: "A Trial Balance shows Total Debit ₹78,460 and Total Credit ₹79,100. What amount must be entered in the debit column (as Suspense A/c) to make the two totals equal?",
      value: 640, tolerance: 0, prefix: "₹",
      explanation: "The debit column is short by ₹79,100 − ₹78,460 = ₹640, so Suspense A/c of ₹640 is written in the debit column. Both columns then total ₹79,100.",
      tags: ["numerical", "competency"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0023", chapter: "tb", topic: "Effect of Errors",
      type: "numerical", difficulty: "Medium", marks: 1,
      q: "The Purchases A/c was overcast by ₹1,500. By how much will the two columns of the Trial Balance differ?",
      value: 1500, tolerance: 0, prefix: "₹",
      explanation: "Purchases carries a debit balance, so overcasting it makes the debit column ₹1,500 heavier than the credit column. The Trial Balance will therefore differ by ₹1,500.",
      tags: ["numerical"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0024", chapter: "tb", topic: "Compensating Errors",
      type: "numerical", difficulty: "Hard", marks: 1,
      q: "The Purchases A/c was overcast by ₹800 and the Salaries A/c was undercast by ₹800. What is the net difference in the totals of the Trial Balance?",
      value: 0, tolerance: 0, prefix: "₹",
      explanation: "Both accounts carry debit balances. Overcasting Purchases makes the debit column ₹800 heavier, while undercasting Salaries makes it ₹800 lighter. The two effects cancel exactly, so the net difference is ₹0 — the Trial Balance still agrees (these are compensating errors).",
      tags: ["numerical", "hots"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0025", chapter: "tb", topic: "Effect of Errors",
      type: "numerical", difficulty: "Medium", marks: 1,
      q: "The Stationery A/c balance of ₹3,600 was written in the debit column of the Trial Balance as ₹3,060. By how much will the two columns differ?",
      value: 540, tolerance: 0, prefix: "₹",
      explanation: "The debit column should have carried ₹3,600 but carries only ₹3,060, so it is short by ₹3,600 − ₹3,060 = ₹540. The credit column is unaffected, hence a difference of ₹540.",
      tags: ["numerical"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0026", chapter: "tb", topic: "Correcting Trial Balance Totals",
      type: "numerical", difficulty: "Hard", marks: 1,
      q: "The debit column of a Trial Balance shows a total of ₹1,12,000. On checking it is found that this column was overcast by ₹700 and that a credit balance of ₹300 had also been entered in it. What is the correct total of the debit column?",
      value: 111000, tolerance: 0, prefix: "₹",
      explanation: "Remove the overcasting: ₹1,12,000 − ₹700 = ₹1,11,300. Then remove the credit balance that was wrongly entered here: ₹1,11,300 − ₹300 = ₹1,11,000. Correct debit total = ₹1,11,000.",
      tags: ["numerical", "competency"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0027", chapter: "tb", topic: "Suspense Account",
      type: "numerical", difficulty: "Medium", marks: 1,
      q: "A difference of ₹900 was put in the debit column of the Trial Balance as Suspense A/c. It was then found that the debit balance of Stationery A/c (₹900) had been left out of the list of balances. What amount will be credited to the Suspense A/c to close it?",
      value: 900, tolerance: 0, prefix: "₹",
      explanation: "To show the omitted Stationery A/c the entry is Stationery A/c Dr. ₹900; To Suspense A/c ₹900. Crediting ₹900 wipes out the debit balance of the Suspense A/c, which then stands at nil.",
      tags: ["numerical", "competency"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0028", chapter: "tb", topic: "Correcting Trial Balance Totals",
      type: "numerical", difficulty: "Hard", marks: 1,
      q: "The debit column of a Trial Balance shows ₹1,05,300. It is later found that a debit balance of ₹1,200 was shown in the credit column and a credit balance of ₹400 was shown in the debit column. What should the correct total of the debit column be?",
      value: 106100, tolerance: 0, prefix: "₹",
      explanation: "The debit column lost ₹1,200 (not shown in it) and gained ₹400 (shown in it wrongly). Correct debit total = ₹1,05,300 − ₹400 + ₹1,200 = ₹1,06,100.",
      tags: ["numerical", "hots"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0029", chapter: "tb", topic: "Suspense Account",
      type: "numerical", difficulty: "Hard", marks: 1,
      q: "A Trial Balance agrees with both columns totalling ₹94,000, but the debit column includes a Suspense A/c of ₹2,500. On checking, the debit balance of Furniture A/c (₹2,500) is found to have been left out of the list. What will be the total of the debit column after Furniture A/c is shown and the Suspense A/c is removed?",
      value: 94000, tolerance: 0, prefix: "₹",
      explanation: "The suspense of ₹2,500 is taken out of the debit column (−₹2,500) and the Furniture A/c of ₹2,500 is put into it (+₹2,500). The two movements cancel, so the debit total remains ₹94,000 − ₹2,500 + ₹2,500 = ₹94,000, still equal to the credit total.",
      tags: ["numerical", "hots", "competency"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0030", chapter: "tb", topic: "Classification for Trial Balance",
      type: "numerical", difficulty: "Medium", marks: 1,
      q: "From the following balances, what is the total of the items that go into the credit column: Capital ₹45,000, Machinery ₹30,000, Sales ₹72,000, Purchases ₹50,000, Discount Received ₹1,500, Rent Paid ₹6,000, Sundry Creditors ₹24,000, Drawings ₹3,000?",
      value: 142500, tolerance: 0, prefix: "₹",
      explanation: "Credit column: Capital ₹45,000 + Sales ₹72,000 + Discount Received ₹1,500 + Sundry Creditors ₹24,000 = ₹1,42,500. Machinery, Purchases, Rent Paid and Drawings are debit balances.",
      tags: ["numerical", "competency"], provenance: { kind: "new", verified: true }
    },

    /* ---- Trial Balance — multi select ---- */
    {
      id: "x-tb-0031", chapter: "tb", topic: "Debit and Credit Balances",
      type: "multi", difficulty: "Medium", marks: 1,
      q: "Which of the following appear in the CREDIT column of a Trial Balance?",
      options: ["Capital A/c", "Drawings A/c", "Bank Overdraft A/c", "Discount Received A/c"],
      answers: [0, 2, 3],
      explanation: "Capital is what the business owes the owner, a bank overdraft is a liability, and Discount Received is a gain — all three carry credit balances. Drawings reduce the owner's capital and therefore carry a debit balance.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0032", chapter: "tb", topic: "Errors Not Affecting Trial Balance",
      type: "multi", difficulty: "Medium", marks: 1,
      q: "Which of these errors will NOT cause a Trial Balance to disagree?",
      options: ["A transaction of ₹3,000 completely left out of the Journal",
        "Furniture purchased for ₹7,000 debited to Purchases A/c",
        "The Purchases A/c being overcast by ₹400",
        "A debit balance of ₹500 written in the credit column of the Trial Balance"],
      answers: [0, 1],
      explanation: "The complete omission touches neither side, and the error of principle debits the same amount to the wrong type of account — both leave the totals equal. Overcasting an account and writing a balance in the wrong column are one-sided errors, so they make the columns differ.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0033", chapter: "tb", topic: "Classification of Errors",
      type: "multi", difficulty: "Hard", marks: 1,
      q: "Which of the following are one-sided errors, i.e. errors that make the Trial Balance disagree?",
      options: ["The Salaries A/c being undercast by ₹600",
        "An amount posted to the account of the wrong person of the same class",
        "An account balance being left out while listing the Trial Balance",
        "A credit balance of ₹500 written as ₹50 in the debit column"],
      answers: [0, 2, 3],
      explanation: "Undercasting an account, omitting a balance from the list, and misplacing a figure while copying all affect only one column, so the totals differ. Posting to the wrong person of the same class debits or credits the same amount, so both totals remain equal — it is a two-sided error.",
      tags: ["hots", "competency"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0034", chapter: "tb", topic: "Debit and Credit Balances",
      type: "multi", difficulty: "Easy", marks: 1,
      q: "Which of the following normally appear in the DEBIT column of a Trial Balance?",
      options: ["Sundry Debtors", "Carriage Inward", "Sundry Creditors", "Commission Received"],
      answers: [0, 1],
      explanation: "Sundry Debtors is an asset and Carriage Inward is an expense on purchases — both are debit balances. Sundry Creditors is a liability and Commission Received is an income, so both go to the credit column.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },

    /* ---- Trial Balance — matching ---- */
    {
      id: "x-tb-0035", chapter: "tb", topic: "Debit and Credit Balances",
      type: "matching", difficulty: "Easy", marks: 1,
      q: "Match each account with the column of the Trial Balance in which it appears.",
      left: ["Interest Received A/c", "Drawings A/c", "Bank Overdraft A/c", "Carriage Outward A/c"],
      right: ["Credit column (income earned by the business)",
        "Debit column (asset of the business)",
        "Credit column (liability of the business)",
        "Debit column (expense of the business)",
        "Debit column (reduction of the owner's capital)"],
      answerSlots: [0, 4, 2, 3],
      explanation: "Interest Received is income (credit). Drawings reduce capital and carry a debit balance. Bank Overdraft is a liability (credit). Carriage Outward is an expense (debit). The fifth option is the decoy that matches none of them.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0036", chapter: "tb", topic: "Classification of Errors",
      type: "matching", difficulty: "Medium", marks: 1,
      q: "Match each type of error with its correct description.",
      left: ["Error of omission", "Error of principle", "Error of commission", "Compensating error"],
      right: ["The transaction is not recorded at all",
        "Correct amount posted to a wrong type of account",
        "Correct amount posted to the wrong person of the same class",
        "Two or more errors that cancel each other's effect",
        "The difference parked in the Suspense A/c"],
      answerSlots: [0, 1, 2, 3],
      explanation: "Each description defines one error: omission = nothing recorded; principle = right amount, wrong class of account; commission = right amount, wrong person of the same class; compensating = errors that cancel. The fifth option is a decoy — a suspense account is a consequence of a difference, not a type of error.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0037", chapter: "tb", topic: "Classification of Accounts",
      type: "matching", difficulty: "Easy", marks: 1,
      q: "Match each account with the class to which it belongs.",
      left: ["Machinery A/c", "Ramesh (a creditor) A/c", "Wages A/c", "Outstanding Salary A/c"],
      right: ["Real account", "Personal account", "Nominal account",
        "Representative personal account", "Suspense account"],
      answerSlots: [0, 1, 2, 3],
      explanation: "Machinery is a real account (asset), Ramesh's account is a personal account, Wages is a nominal account (expense), and Outstanding Salary represents the salary bill of the employees who are still to be paid — a representative personal account. The fifth option is the decoy.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },

    /* ---- Trial Balance — case studies ---- */
    {
      id: "x-tb-0038", chapter: "tb", topic: "Preparing a Trial Balance",
      type: "case", difficulty: "Medium", marks: 4,
      q: "Read the balances given below and answer the questions that follow.",
      passage: "A trader extracts the following balances from his ledger on 31st March: Capital ₹86,000 (Cr), Cash in Hand ₹18,000 (Dr), Bank Balance ₹32,000 (Dr), Sundry Debtors ₹64,000 (Dr), Sundry Creditors ₹46,000 (Cr), Purchases ₹1,12,000 (Dr), Sales ₹1,96,000 (Cr), Wages ₹24,000 (Dr), Rent ₹16,000 (Dr), Machinery ₹60,000 (Dr), Commission Received ₹8,000 (Cr), Drawings ₹10,000 (Dr). He prepares the Trial Balance from these balances.",
      subs: [
        {
          q: "What is the total of the debit column of this Trial Balance?",
          type: "numerical", marks: 2, value: 336000, tolerance: 0, prefix: "₹",
          explanation: "Debit column = Cash ₹18,000 + Bank ₹32,000 + Debtors ₹64,000 + Purchases ₹1,12,000 + Wages ₹24,000 + Rent ₹16,000 + Machinery ₹60,000 + Drawings ₹10,000 = ₹3,36,000."
        },
        {
          q: "Which statement about this Trial Balance is correct?",
          type: "mcq", marks: 1, answerIndex: 0,
          options: ["Both columns total ₹3,36,000, so the Trial Balance agrees",
            "Debit ₹3,36,000 and credit ₹3,46,000, so it does not agree",
            "Debit ₹3,26,000 and credit ₹3,36,000, so it does not agree",
            "Both columns total ₹4,00,000, so the Trial Balance agrees"],
          explanation: "Credit column = Capital ₹86,000 + Creditors ₹46,000 + Sales ₹1,96,000 + Commission Received ₹8,000 = ₹3,36,000, exactly equal to the debit total, so the Trial Balance agrees."
        },
        {
          q: "If the Rent A/c balance of ₹16,000 is wrongly written in the credit column instead of the debit column, the Trial Balance will:",
          type: "mcq", marks: 1, answerIndex: 3,
          options: ["Still agree, because the same amount is used",
            "Disagree by ₹8,000", "Disagree by ₹16,000", "Disagree by ₹32,000"],
          explanation: "The debit column loses ₹16,000 and the credit column gains ₹16,000, so the gap becomes twice ₹16,000 = ₹32,000, with the credit column heavier."
        }
      ],
      explanation: "Classify every balance first — assets, expenses and drawings to the debit column; liabilities, capital and incomes to the credit column. Both columns then total ₹3,36,000. Writing a debit balance into the credit column shifts it once out of one column and once into the other, so the difference becomes double the amount.",
      tags: ["competency", "case-study"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0039", chapter: "tb", topic: "Suspense Account",
      type: "case", difficulty: "Hard", marks: 4,
      q: "A Trial Balance does not agree. Trace the difference and answer the questions that follow.",
      passage: "On 31st March a trader's Trial Balance shows Total Debit ₹1,08,400 and Total Credit ₹1,06,800. To make the columns agree he enters the difference in the shorter column as Suspense A/c. Later, on checking, he finds that the credit balance of Commission Received A/c (₹1,600) had been omitted from the list of balances altogether.",
      subs: [
        {
          q: "Where does the difference go so that the Trial Balance agrees?",
          type: "mcq", marks: 1, answerIndex: 1,
          options: ["In the debit column as Suspense A/c ₹1,600",
            "In the credit column as Suspense A/c ₹1,600",
            "In the debit column as Suspense A/c ₹3,200",
            "In the credit column as Suspense A/c ₹800"],
          explanation: "₹1,08,400 − ₹1,06,800 = ₹1,600. The credit column is the shorter one, so Suspense A/c of ₹1,600 is written in the credit column."
        },
        {
          q: "What amount will be credited to the Suspense A/c when this error is corrected?",
          type: "numerical", marks: 2, value: 1600, tolerance: 0, prefix: "₹",
          explanation: "The correction is Suspense A/c Dr. ₹1,600; To Commission Received A/c ₹1,600. Crediting ₹1,600 clears the suspense balance completely."
        },
        {
          q: "After this correction, the balance of the Suspense A/c will be:",
          type: "mcq", marks: 1, answerIndex: 0,
          options: ["Nil", "A debit balance of ₹1,600",
            "A credit balance of ₹1,600", "A debit balance of ₹1,08,400"],
          explanation: "The suspense was opened only because the error was unknown. Once the omitted credit balance is shown, the entire suspense amount is used up and the account stands at nil."
        }
      ],
      explanation: "A one-sided difference (here a credit balance left out of the credit column) is parked in the shorter column as a Suspense A/c. Correcting the omission debits the Suspense A/c and credits the account that was missed, which closes the suspense.",
      tags: ["competency", "case-study"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0040", chapter: "tb", topic: "Classification of Errors",
      type: "case", difficulty: "Medium", marks: 4,
      q: "Classify the errors given below and answer the questions that follow.",
      passage: "While auditing the books of a trader, four errors were discovered: (i) ₹6,000 spent on repairs of the building was debited to Building A/c; (ii) a credit sale of ₹4,200 to Anu was debited to Neeta's account, both being debtors of the same class; (iii) the Purchases A/c was overcast by ₹700; (iv) the Salaries A/c was undercast by ₹700.",
      subs: [
        {
          q: "Which of these errors, on its own, will NOT cause the Trial Balance to disagree?",
          type: "multi", marks: 2, answers: [0, 1],
          options: ["Error (i)", "Error (ii)", "Error (iii)", "Error (iv)"],
          explanation: "Error (i) is an error of principle — the same amount is debited, only to the wrong class of account. Error (ii) is an error of commission — the amount is still debited once, just to the wrong debtor of the same class. Errors (iii) and (iv) are one-sided and each upsets the totals on its own."
        },
        {
          q: "Error (i) is an error of principle because:",
          type: "mcq", marks: 1, answerIndex: 2,
          options: ["the amount of ₹6,000 was not recorded at all",
            "the same amount was debited to two different accounts",
            "a revenue item was debited to a capital account",
            "two errors of equal amount cancelled each other"],
          explanation: "Repairs is a revenue expense, while Building is a fixed asset. Charging the correct amount to the wrong type of account is exactly what an error of principle means."
        },
        {
          q: "What is the net difference in the Trial Balance totals caused by errors (iii) and (iv) together?",
          type: "numerical", marks: 1, value: 0, tolerance: 0, prefix: "₹",
          explanation: "Both are debit balances: overcasting Purchases makes the debit column ₹700 heavier, undercasting Salaries makes it ₹700 lighter. Together they cancel, so the net difference is ₹0 — these are compensating errors."
        }
      ],
      explanation: "Classify each error first: principle (wrong type of account), commission (wrong person of the same class) and one-sided casting errors. Only one-sided errors change the totals, and two equal one-sided errors on the same side cancel each other out.",
      tags: ["competency", "case-study", "hots"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-0041", chapter: "tb", topic: "Preparing a Trial Balance",
      type: "case", difficulty: "Easy", marks: 3,
      q: "Study the ledger balances given below and answer the questions that follow.",
      passage: "On 31st March the ledger of a trader shows: Cash in Hand ₹15,000, Furniture ₹45,000, Wages ₹20,000, Sundry Debtors ₹30,000, Loan taken from Munni ₹25,000, Sales ₹75,000 and Capital ₹10,000. The balances are to be listed in a Trial Balance using the balance method.",
      subs: [
        {
          q: "Which of these will appear in the credit column of the Trial Balance?",
          type: "mcq", marks: 1, answerIndex: 3,
          options: ["Wages A/c", "Furniture A/c", "Sundry Debtors A/c", "Loan taken from Munni A/c"],
          explanation: "A loan taken is money the business owes, i.e. a liability with a credit balance. Wages (expense), Furniture (asset) and Sundry Debtors (asset) all carry debit balances."
        },
        {
          q: "What is the total of the debit column of this Trial Balance?",
          type: "numerical", marks: 1, value: 110000, tolerance: 0, prefix: "₹",
          explanation: "Debit column = Cash ₹15,000 + Furniture ₹45,000 + Wages ₹20,000 + Sundry Debtors ₹30,000 = ₹1,10,000."
        },
        {
          q: "Wages A/c belongs to which class of account?",
          type: "mcq", marks: 1, answerIndex: 1,
          options: ["Real account", "Nominal account", "Personal account", "Representative personal account"],
          explanation: "Wages is an expense, and all expense and income accounts are nominal accounts. Nominal accounts carry debit balances when they represent expenses."
        }
      ],
      explanation: "List each balance in the column its account type demands — assets and expenses on the debit side, liabilities, capital and incomes on the credit side. Debit total ₹1,10,000 equals credit total (Loan ₹25,000 + Sales ₹75,000 + Capital ₹10,000) = ₹1,10,000, so the Trial Balance agrees.",
      tags: ["case-study"], provenance: { kind: "new", verified: true }
    },

    /* ----------------------------------------------------------
       CHAPTER 14 — DEPRECIATION (dep)
       ---------------------------------------------------------- */
    {
      id: "x-dep-0001", chapter: "dep", topic: "Need for Depreciation",
      type: "mcq", difficulty: "Easy", marks: 1,
      q: "If depreciation is not charged every year, which of the following will be wrong?",
      options: ["Both the profit and the value of the fixed asset will be shown at a higher figure than they really are",
        "Both the profit and the value of the fixed asset will be shown at a lower figure",
        "The cash balance of the business will be shown too high",
        "The sales of the business will be shown too low"],
      answerIndex: 0,
      explanation: "Depreciation is an expense of using the asset; leaving it out overstates the profit for the year. It is also a reduction in the asset's value; leaving it out keeps the asset in the Balance Sheet at more than it is worth. Both figures are therefore shown too high.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0002", chapter: "dep", topic: "Causes of Depreciation",
      type: "mcq", difficulty: "Easy", marks: 1,
      q: "A leasehold property loses value simply because the period of the lease is running out, even though it is not used at all. This cause of depreciation is called:",
      options: ["Wear and tear", "Effluxion of time", "Obsolescence", "Exhaustion of the asset"],
      answerIndex: 1,
      explanation: "Loss of value purely because time is passing is called effluxion of time. Wear and tear needs actual use, obsolescence needs a newer replacement to appear, and exhaustion applies to assets that are used up physically.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0003", chapter: "dep", topic: "Factors Affecting Depreciation",
      type: "mcq", difficulty: "Easy", marks: 1,
      q: "Which of the following is NOT one of the factors used to calculate the amount of depreciation?",
      options: ["The market demand for the product made by the asset",
        "The cost of the asset",
        "The estimated useful life of the asset",
        "The estimated residual value of the asset"],
      answerIndex: 0,
      explanation: "The amount of depreciation depends only on the cost of the asset, its estimated useful life and its estimated residual (scrap) value. Market demand for the product has no bearing on how much the asset itself wears out.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0004", chapter: "dep", topic: "Factors Affecting Depreciation",
      type: "mcq", difficulty: "Easy", marks: 1,
      q: "For calculating depreciation, the 'cost of an asset' means:",
      options: ["Only the invoice price at which the asset was bought",
        "The purchase price plus every expense needed to bring the asset into working condition",
        "The market price of the asset at the end of the year",
        "The invoice price less the estimated residual value"],
      answerIndex: 1,
      explanation: "The cost of an asset includes the purchase price plus freight, installation, brokerage and any other expense incurred to make it ready for use. Only after this total is fixed is depreciation computed on it.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0005", chapter: "dep", topic: "SLM and WDV",
      type: "mcq", difficulty: "Medium", marks: 1,
      q: "Under which method can the book value of an asset be written down to zero by the end of its useful life (ignoring residual value)?",
      options: ["Straight Line Method only", "Written Down Value Method only",
        "Both methods can reduce it to zero", "Neither method can reduce it to zero"],
      answerIndex: 0,
      explanation: "Under the Straight Line Method a fixed amount is charged each year until the whole cost is written off, so the book value can reach zero. Under WDV the charge is always a percentage of a shrinking balance, so a part of the cost always remains.",
      tags: ["hots", "conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0006", chapter: "dep", topic: "Advantages of WDV",
      type: "mcq", difficulty: "Medium", marks: 1,
      q: "Which of the following is an advantage of the Written Down Value Method?",
      options: ["It matches the depreciation charge with the repair costs of an ageing asset",
        "It charges the same amount of depreciation every year",
        "It is simpler to calculate than the Straight Line Method",
        "It writes the asset down to exactly zero at the end of its life"],
      answerIndex: 0,
      explanation: "As an asset gets older, repairs and maintenance rise while the WDV charge falls, so the total burden stays fairly even across the years. The other three options describe the Straight Line Method, not WDV.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0007", chapter: "dep", topic: "Advantages of SLM",
      type: "mcq", difficulty: "Medium", marks: 1,
      q: "Which of the following is an advantage of the Straight Line Method?",
      options: ["The charge automatically falls as repair costs rise in later years",
        "The yearly charge keeps falling as the book value reduces",
        "The profits of different years can be compared easily because the charge is the same every year",
        "It is the method prescribed for computing taxable income"],
      answerIndex: 2,
      explanation: "Because an equal amount goes to the Profit & Loss Account every year, the yearly profits are not disturbed by a changing depreciation charge and are easy to compare. The other three statements describe the Written Down Value Method.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0008", chapter: "dep", topic: "Recording Depreciation",
      type: "mcq", difficulty: "Medium", marks: 1,
      q: "At the end of the accounting year, the balance of the Depreciation A/c is closed by the entry:",
      options: ["Depreciation A/c Dr.; To Profit & Loss A/c",
        "Profit & Loss A/c Dr.; To Asset A/c",
        "Asset A/c Dr.; To Depreciation A/c",
        "Profit & Loss A/c Dr.; To Depreciation A/c"],
      answerIndex: 3,
      explanation: "Depreciation is an expense, so its account carries a debit balance. To close it, Profit & Loss A/c is debited and Depreciation A/c is credited. The opening entry for the year (Depreciation A/c Dr.; To Asset A/c or To Provision for Depreciation A/c) comes before this closing entry.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0009", chapter: "dep", topic: "Provision for Depreciation",
      type: "mcq", difficulty: "Medium", marks: 1,
      q: "When a Provision for Depreciation A/c is maintained, the amount at which a depreciable asset is shown in the Balance Sheet is:",
      options: ["The original cost of the asset every year",
        "Nil, once the first year's depreciation has been charged",
        "The estimated residual value alone",
        "The original cost less the balance of the Provision for Depreciation A/c"],
      answerIndex: 3,
      explanation: "Under this method the Asset A/c is left untouched at cost and the depreciation is accumulated in the Provision for Depreciation A/c. The asset's book value is therefore Cost − balance of the Provision for Depreciation A/c.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0010", chapter: "dep", topic: "Disposal of an Asset",
      type: "mcq", difficulty: "Medium", marks: 1,
      q: "When an asset is sold and a Provision for Depreciation A/c is maintained, its original cost is written off through the Asset Disposal A/c by the entry:",
      options: ["Machinery A/c Dr.; To Asset Disposal A/c",
        "Asset Disposal A/c Dr.; To Machinery A/c",
        "Provision for Depreciation A/c Dr.; To Machinery A/c",
        "Bank A/c Dr.; To Asset Disposal A/c"],
      answerIndex: 1,
      explanation: "The cost of the asset is taken out of the Asset A/c and put into the disposal account: Asset Disposal A/c Dr. (cost); To Machinery A/c (cost). The accumulated depreciation follows with Provision for Depreciation A/c Dr.; To Asset Disposal A/c, and the sale proceeds are credited with Bank A/c Dr.; To Asset Disposal A/c.",
      tags: ["competency"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0011", chapter: "dep", topic: "Need for Depreciation",
      type: "mcq", difficulty: "Easy", marks: 1,
      q: "Charging depreciation each year mainly follows which accounting concept?",
      options: ["Money measurement concept", "Matching concept",
        "Business entity concept", "Cash basis of accounting"],
      answerIndex: 1,
      explanation: "The cost of using a fixed asset must be matched against the revenue it helps to earn in the same period. Charging depreciation does exactly that, so the profit is stated correctly.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0012", chapter: "dep", topic: "Features of Depreciation",
      type: "mcq", difficulty: "Easy", marks: 1,
      q: "Depreciation is transferred to the Profit & Loss Account at the end of the year because it is:",
      options: ["A charge against the profit of the period in which the asset is used",
        "An appropriation of the profit already earned",
        "A capital expenditure of the business",
        "A liability that has to be paid in cash"],
      answerIndex: 0,
      explanation: "Depreciation is treated as an expense of the year and is debited to the Profit & Loss Account, reducing the profit — even though no cash leaves the business when it is charged.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0013", chapter: "dep", topic: "Disposal of an Asset",
      type: "mcq", difficulty: "Medium", marks: 1,
      q: "Consider the following statements:\n(i) Profit or loss on the sale of an asset is found by comparing the sale proceeds with its book value on the date of sale.\n(ii) Under the provision method, the amount transferred from the Provision for Depreciation A/c to the Asset Disposal A/c is the accumulated depreciation on the asset sold.\n(iii) The book value of an asset increases when depreciation is charged on it.\nWhich of the statements given above is/are correct?",
      options: ["(ii) and (iii) only", "(i) and (ii) only", "(i) only", "(i), (ii) and (iii)"],
      answerIndex: 1,
      explanation: "(i) is correct — proceeds are compared with book value, not with cost. (ii) is correct — only the accumulated depreciation of the asset sold is removed from the provision. (iii) is wrong because charging depreciation reduces, never increases, the book value.",
      tags: ["statement", "conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0014", chapter: "dep", topic: "Part-Year Depreciation",
      type: "mcq", difficulty: "Easy", marks: 1,
      q: "An asset is purchased on 1st September and the accounting year ends on 31st March. In the year of purchase, depreciation will be charged for:",
      options: ["6 months", "8 months", "7 months", "9 months"],
      answerIndex: 2,
      explanation: "The asset is used from September to March — September, October, November, December, January, February and March — that is 7 months, so depreciation is charged for 7/12 of a full year's amount.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0015", chapter: "dep", topic: "Recording Depreciation",
      type: "mcq", difficulty: "Hard", marks: 1,
      q: "Consider the following statements about the two methods of recording depreciation:\n(i) Under the method in which depreciation is charged to the Asset A/c, the Asset A/c shows the original cost.\n(ii) Under the provision method the Asset A/c continues to show the original cost, and the book value is found by deducting the provision from it.\n(iii) Under both methods, the Depreciation A/c is finally transferred to the Profit & Loss A/c.\nWhich of the statements given above is/are correct?",
      options: ["(i) only", "(ii) only", "(i) and (ii) only", "(ii) and (iii) only"],
      answerIndex: 3,
      explanation: "(i) is wrong — when depreciation is credited to the Asset A/c itself, that account shows the written down value, not the cost. (ii) is correct and (iii) is correct, because in both methods the year's depreciation is closed to the Profit & Loss Account.",
      tags: ["statement", "hots"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0016", chapter: "dep", topic: "SLM and WDV",
      type: "mcq", difficulty: "Medium", marks: 1,
      q: "(A) Under the Written Down Value Method the amount of depreciation charged goes on decreasing every year.\n(R) Under the Written Down Value Method the rate of depreciation is applied to the original cost of the asset every year.",
      options: ["Both A and R are true and R is the correct explanation of A",
        "Both A and R are true but R is not the correct explanation of A",
        "A is true but R is false",
        "A is false but R is true"],
      answerIndex: 2,
      explanation: "Statement A is true — the charge keeps falling. Statement R is false: under WDV the fixed rate is applied to the book value at the start of the year, not to the original cost; charging on the original cost would give an equal amount each year.",
      tags: ["assertion-reason", "conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0017", chapter: "dep", topic: "Need for Depreciation",
      type: "mcq", difficulty: "Medium", marks: 1,
      q: "(A) A business that charges depreciation every year builds up funds to replace the asset when it wears out.\n(R) Depreciation is a non-cash charge, so the amount charged stays inside the business.",
      options: ["Both A and R are true and R is the correct explanation of A",
        "Both A and R are true but R is not the correct explanation of A",
        "A is true but R is false",
        "A is false but R is true"],
      answerIndex: 0,
      explanation: "Both statements are true and the reason explains the first: because depreciation involves no cash outflow, the profit it reduces is retained in the business and can finance the replacement of the asset.",
      tags: ["assertion-reason"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0018", chapter: "dep", topic: "Features of Depreciation",
      type: "mcq", difficulty: "Medium", marks: 1,
      q: "(A) Depreciation reduces the book value of a fixed asset.\n(R) Depreciation is provided only on tangible fixed assets and not on current assets.",
      options: ["Both A and R are true and R is the correct explanation of A",
        "Both A and R are true but R is not the correct explanation of A",
        "A is true but R is false",
        "A is false but R is true"],
      answerIndex: 1,
      explanation: "Both statements are true: depreciation does reduce book value, and it is provided only on fixed tangible assets. But the second does not explain the first — the fall in book value happens because the asset is used up, not because of the type of asset on which depreciation is provided.",
      tags: ["assertion-reason", "conceptual"], provenance: { kind: "new", verified: true }
    },

    /* ---- Depreciation — numericals ---- */
    {
      id: "x-dep-0019", chapter: "dep", topic: "SLM Computation",
      type: "numerical", difficulty: "Easy", marks: 1,
      q: "A generator is bought for ₹1,60,000. Its estimated residual value at the end of 5 years is ₹10,000. What is the annual depreciation under the Straight Line Method?",
      value: 30000, tolerance: 0, prefix: "₹",
      explanation: "Annual depreciation (SLM) = (Cost − Residual value) ÷ Useful life = (₹1,60,000 − ₹10,000) ÷ 5 = ₹1,50,000 ÷ 5 = ₹30,000. The same ₹30,000 is charged every year.",
      tags: ["numerical"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0020", chapter: "dep", topic: "SLM Computation",
      type: "numerical", difficulty: "Easy", marks: 1,
      q: "A machine costing ₹75,000 is depreciated at 12% per annum under the Straight Line Method, with no residual value. What is the depreciation for one full year?",
      value: 9000, tolerance: 0, prefix: "₹",
      explanation: "Annual depreciation (SLM) = Cost × Rate ÷ 100 = ₹75,000 × 12 ÷ 100 = ₹9,000. Since it is charged on the original cost, the same ₹9,000 is charged every year.",
      tags: ["numerical"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0021", chapter: "dep", topic: "WDV Computation",
      type: "numerical", difficulty: "Hard", marks: 1,
      q: "A machine costing ₹80,000 is depreciated at 20% per annum under the Written Down Value Method. What is the depreciation for the third year?",
      value: 10240, tolerance: 0, prefix: "₹",
      explanation: "Year 1: ₹80,000 × 20% = ₹16,000, book value = ₹64,000. Year 2: ₹64,000 × 20% = ₹12,800, book value = ₹51,200. Year 3: ₹51,200 × 20% = ₹10,240.",
      tags: ["numerical", "hots"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0022", chapter: "dep", topic: "Book Value",
      type: "numerical", difficulty: "Medium", marks: 1,
      q: "A machine costing ₹1,25,000 is depreciated at 10% per annum under the Written Down Value Method. What is its book value at the end of the second year?",
      value: 101250, tolerance: 0, prefix: "₹",
      explanation: "Year 1: depreciation = ₹1,25,000 × 10% = ₹12,500, book value = ₹1,12,500. Year 2: depreciation = ₹1,12,500 × 10% = ₹11,250, book value = ₹1,12,500 − ₹11,250 = ₹1,01,250.",
      tags: ["numerical"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0023", chapter: "dep", topic: "Part-Year Depreciation",
      type: "numerical", difficulty: "Medium", marks: 1,
      q: "A van is bought on 1st January for ₹4,80,000 and is depreciated at 15% per annum under the Straight Line Method. The accounting year ends on 31st March. What is the depreciation for this first year?",
      value: 18000, tolerance: 0, prefix: "₹",
      explanation: "Full-year depreciation = ₹4,80,000 × 15 ÷ 100 = ₹72,000. The van is used from 1st January to 31st March = 3 months, so depreciation = ₹72,000 × 3 ÷ 12 = ₹18,000.",
      tags: ["numerical", "competency"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0024", chapter: "dep", topic: "Part-Year Depreciation",
      type: "numerical", difficulty: "Medium", marks: 1,
      q: "A machine is bought on 1st August for ₹90,000 and is depreciated at 20% per annum under the Written Down Value Method. The accounting year ends on 31st March. What is the depreciation for this first year?",
      value: 12000, tolerance: 0, prefix: "₹",
      explanation: "Full-year depreciation = ₹90,000 × 20 ÷ 100 = ₹18,000. The machine is used from 1st August to 31st March = 8 months, so depreciation = ₹18,000 × 8 ÷ 12 = ₹12,000.",
      tags: ["numerical"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0025", chapter: "dep", topic: "Accumulated Depreciation",
      type: "numerical", difficulty: "Medium", marks: 1,
      q: "A machine costing ₹2,40,000 is depreciated at 10% per annum under the Straight Line Method with no residual value. What is the accumulated depreciation on it after 3 years?",
      value: 72000, tolerance: 0, prefix: "₹",
      explanation: "Annual depreciation = ₹2,40,000 × 10 ÷ 100 = ₹24,000. Accumulated depreciation after 3 years = ₹24,000 × 3 = ₹72,000.",
      tags: ["numerical"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0026", chapter: "dep", topic: "Disposal of an Asset",
      type: "numerical", difficulty: "Hard", marks: 1,
      q: "A machine is bought on 1st April for ₹2,00,000 and depreciated at 10% per annum under the Straight Line Method. After 2 full years it is sold for ₹1,50,000. What is the loss on the sale?",
      value: 10000, tolerance: 0, prefix: "₹",
      explanation: "Depreciation for 2 years = ₹2,00,000 × 10 ÷ 100 × 2 = ₹40,000. Book value on the date of sale = ₹2,00,000 − ₹40,000 = ₹1,60,000. Loss = Book value − Sale proceeds = ₹1,60,000 − ₹1,50,000 = ₹10,000.",
      tags: ["numerical", "hots"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0027", chapter: "dep", topic: "Disposal of an Asset",
      type: "numerical", difficulty: "Hard", marks: 1,
      q: "Machinery costing ₹75,000 has accumulated depreciation of ₹28,500 on the date of sale, and it is sold for ₹40,000. What is the loss on the sale?",
      value: 6500, tolerance: 0, prefix: "₹",
      explanation: "Book value = Cost − Accumulated depreciation = ₹75,000 − ₹28,500 = ₹46,500. Loss = Book value − Sale proceeds = ₹46,500 − ₹40,000 = ₹6,500.",
      tags: ["numerical", "competency"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0028", chapter: "dep", topic: "Disposal of an Asset",
      type: "numerical", difficulty: "Hard", marks: 1,
      q: "Machinery costing ₹60,000, on which depreciation of ₹18,000 has been accumulated, is sold for ₹50,000. Under the provision method, what amount is credited to the Machinery A/c when the asset is written off through the Asset Disposal A/c?",
      value: 60000, tolerance: 0, prefix: "₹",
      explanation: "The asset is removed from the books at its ORIGINAL COST, not at its book value: Asset Disposal A/c Dr. ₹60,000; To Machinery A/c ₹60,000. The accumulated depreciation of ₹18,000 is transferred separately from the Provision for Depreciation A/c.",
      tags: ["numerical", "hots", "competency"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0029", chapter: "dep", topic: "Book Value",
      type: "numerical", difficulty: "Easy", marks: 1,
      q: "On 31st March, Machinery A/c shows ₹2,50,000 and Provision for Depreciation — Machinery A/c shows ₹95,000. What is the book value of the machinery shown in the Balance Sheet?",
      value: 155000, tolerance: 0, prefix: "₹",
      explanation: "Book value = Balance of Machinery A/c − Balance of Provision for Depreciation A/c = ₹2,50,000 − ₹95,000 = ₹1,55,000.",
      tags: ["numerical"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0030", chapter: "dep", topic: "WDV Computation",
      type: "numerical", difficulty: "Hard", marks: 1,
      q: "A machine costing ₹40,000 is depreciated at 25% per annum under the Written Down Value Method. What is the total depreciation charged over the first two years?",
      value: 17500, tolerance: 0, prefix: "₹",
      explanation: "Year 1: ₹40,000 × 25% = ₹10,000, book value = ₹30,000. Year 2: ₹30,000 × 25% = ₹7,500. Total for two years = ₹10,000 + ₹7,500 = ₹17,500.",
      tags: ["numerical"], provenance: { kind: "new", verified: true }
    },

    /* ---- Depreciation — multi select ---- */
    {
      id: "x-dep-0031", chapter: "dep", topic: "Causes of Depreciation",
      type: "multi", difficulty: "Medium", marks: 1,
      q: "Which of the following are causes of depreciation?",
      options: ["Wear and tear from normal use", "Obsolescence of the asset",
        "An increase in the market demand for the product", "Effluxion of time"],
      answers: [0, 1, 3],
      explanation: "A fixed asset loses value because it is physically used, because a newer and better asset makes it outdated, and simply because time passes. A rise in the demand for the product affects the business's sales, not the value of the asset.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0032", chapter: "dep", topic: "SLM and WDV",
      type: "multi", difficulty: "Medium", marks: 1,
      q: "Which of the following statements about the Straight Line Method are correct?",
      options: ["An equal amount of depreciation is charged every year",
        "Depreciation is calculated on the original cost of the asset",
        "The yearly charge keeps increasing as the asset becomes older",
        "The book value of the asset can be written down to zero"],
      answers: [0, 1, 3],
      explanation: "Under SLM the same amount is charged every year because it is always computed on the unchanged original cost, and by the end of the useful life the whole cost (ignoring residual value) is written off. The third statement is wrong — the yearly charge never increases; under WDV, in fact, the charge falls year after year.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0033", chapter: "dep", topic: "Recording Depreciation",
      type: "multi", difficulty: "Hard", marks: 1,
      q: "Which of the following entries can be made at the end of an accounting year for recording depreciation?",
      options: ["Depreciation A/c Dr.; To Asset A/c",
        "Asset A/c Dr.; To Depreciation A/c",
        "Depreciation A/c Dr.; To Provision for Depreciation A/c",
        "Profit & Loss A/c Dr.; To Depreciation A/c"],
      answers: [0, 2, 3],
      explanation: "Depreciation is debited to Depreciation A/c and credited either to the Asset A/c (direct method) or to the Provision for Depreciation A/c (provision method); the Depreciation A/c is then closed by debiting the Profit & Loss A/c. The second entry is the reverse of what is required and is never passed.",
      tags: ["hots", "competency"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0034", chapter: "dep", topic: "Depreciable Assets",
      type: "multi", difficulty: "Easy", marks: 1,
      q: "Which of the following are depreciated in the accounts?",
      options: ["A motor van", "A patent", "A building", "Sundry debtors"],
      answers: [0, 2],
      explanation: "A motor van and a building are tangible fixed assets with limited lives, so depreciation is charged on them. A patent is an intangible asset and its cost is written off by amortisation, while sundry debtors are current assets that are not depreciated.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },

    /* ---- Depreciation — matching ---- */
    {
      id: "x-dep-0035", chapter: "dep", topic: "Causes of Depreciation",
      type: "matching", difficulty: "Easy", marks: 1,
      q: "Match each cause with what it means.",
      left: ["Wear and tear", "Obsolescence", "Effluxion of time", "Expiry of a legal right"],
      right: ["Loss of value because the asset is physically used",
        "Loss of value because a newer and better asset becomes available",
        "Loss of value merely because time is passing",
        "Loss of value as a patent, licence or lease runs out",
        "Loss of value because of a fire or an accident"],
      answerSlots: [0, 1, 2, 3],
      explanation: "Each cause has its own trigger: physical use, replacement by better technology, the mere passage of time, or the running out of a legal period. The fifth option is a decoy — an accident is a sudden mishap, not a cause of yearly depreciation.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0036", chapter: "dep", topic: "SLM, WDV and Recording",
      type: "matching", difficulty: "Medium", marks: 1,
      q: "Match each method or account with its correct description.",
      left: ["Straight Line Method", "Written Down Value Method",
        "Provision for Depreciation A/c", "Asset Disposal A/c"],
      right: ["Charges an equal amount of depreciation every year",
        "Charges a fixed rate on a shrinking book value every year",
        "Keeps the Asset A/c at its original cost",
        "A temporary account used to find profit or loss on sale",
        "Writes off intangible assets over their legal life"],
      answerSlots: [0, 1, 2, 3],
      explanation: "SLM gives an equal yearly charge on cost; WDV applies a fixed rate to a shrinking balance; the Provision for Depreciation A/c accumulates the charges while the Asset A/c stays at cost; and the Asset Disposal A/c is opened only to work out the profit or loss on sale. The fifth option describes amortisation and is the decoy.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0037", chapter: "dep", topic: "Depreciation, Depletion, Amortisation",
      type: "matching", difficulty: "Easy", marks: 1,
      q: "Match each term with what it applies to.",
      left: ["Depreciation", "Depletion", "Amortisation", "Residual value"],
      right: ["Written off on tangible fixed assets",
        "Written off on natural resources such as mines",
        "Written off on intangible assets such as patents",
        "The amount expected to be recovered when the asset is scrapped",
        "The market price of the asset on the date of sale"],
      answerSlots: [0, 1, 2, 3],
      explanation: "Depreciation covers tangible fixed assets, depletion covers wasting natural resources, amortisation covers intangible assets, and residual value is the scrap amount expected at the end of the useful life. The fifth option is the decoy that matches none of them.",
      tags: ["conceptual"], provenance: { kind: "new", verified: true }
    },

    /* ---- Depreciation — case studies ---- */
    {
      id: "x-dep-0038", chapter: "dep", topic: "Part-Year Depreciation",
      type: "case", difficulty: "Medium", marks: 4,
      q: "Read the information about the machine and answer the questions that follow.",
      passage: "A trader buys a machine on 1st August for ₹3,60,000. It is depreciated at 10% per annum under the Straight Line Method, and the accounting year of the business ends on 31st March. The machine is in use for the whole of the second year.",
      subs: [
        {
          q: "What is the depreciation charged on the machine for the first accounting year?",
          type: "numerical", marks: 1, value: 24000, tolerance: 0, prefix: "₹",
          explanation: "Full-year depreciation = ₹3,60,000 × 10 ÷ 100 = ₹36,000. The machine is used from 1st August to 31st March = 8 months, so the first year's charge = ₹36,000 × 8 ÷ 12 = ₹24,000."
        },
        {
          q: "What is the depreciation charged on the machine for the second accounting year?",
          type: "numerical", marks: 2, value: 36000, tolerance: 0, prefix: "₹",
          explanation: "In the second year the machine is used for the full 12 months, and under SLM the charge is always the same: ₹3,60,000 × 10 ÷ 100 = ₹36,000."
        },
        {
          q: "What is the book value of the machine on 31st March of the second year?",
          type: "mcq", marks: 1, answerIndex: 0,
          options: ["₹3,60,000 − ₹60,000 = ₹3,00,000",
            "₹3,60,000 − ₹36,000 = ₹3,24,000",
            "₹3,60,000 − ₹24,000 = ₹3,36,000",
            "₹3,60,000, because SLM never reduces the book value"],
          explanation: "Accumulated depreciation = ₹24,000 (first year) + ₹36,000 (second year) = ₹60,000. Book value = ₹3,60,000 − ₹60,000 = ₹3,00,000."
        }
      ],
      explanation: "Charging depreciation for the period the asset was actually used gives ₹24,000 in the year of purchase; from the second year the full yearly charge of ₹36,000 applies. Book value is always cost minus accumulated depreciation.",
      tags: ["competency", "case-study"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0039", chapter: "dep", topic: "Disposal of an Asset",
      type: "case", difficulty: "Hard", marks: 4,
      q: "A machine is sold after three years of use. Work out the sale and answer the questions that follow.",
      passage: "A company buys a machine on 1st April for ₹1,20,000 and depreciates it at 15% per annum under the Straight Line Method, maintaining a Provision for Depreciation A/c. On 31st March, after exactly three years of use, the machine is sold for ₹70,000.",
      subs: [
        {
          q: "What amount stands in the Provision for Depreciation A/c for this machine on the date of sale?",
          type: "numerical", marks: 1, value: 54000, tolerance: 0, prefix: "₹",
          explanation: "Annual depreciation = ₹1,20,000 × 15 ÷ 100 = ₹18,000. Accumulated depreciation for 3 years = ₹18,000 × 3 = ₹54,000."
        },
        {
          q: "What profit is made on the sale of the machine?",
          type: "numerical", marks: 2, value: 4000, tolerance: 0, prefix: "₹",
          explanation: "Book value on the date of sale = ₹1,20,000 − ₹54,000 = ₹66,000. Profit = Sale proceeds − Book value = ₹70,000 − ₹66,000 = ₹4,000."
        },
        {
          q: "Which entry transfers the cost of the machine out of the Asset A/c?",
          type: "mcq", marks: 1, answerIndex: 1,
          options: ["Machinery A/c Dr. ₹1,20,000; To Asset Disposal A/c ₹1,20,000",
            "Asset Disposal A/c Dr. ₹1,20,000; To Machinery A/c ₹1,20,000",
            "Asset Disposal A/c Dr. ₹54,000; To Machinery A/c ₹54,000",
            "Provision for Depreciation A/c Dr. ₹66,000; To Machinery A/c ₹66,000"],
          explanation: "The asset is written off at its original cost of ₹1,20,000: Asset Disposal A/c Dr. ₹1,20,000; To Machinery A/c ₹1,20,000. The accumulated depreciation of ₹54,000 is transferred separately from the Provision for Depreciation A/c."
        }
      ],
      explanation: "Three years at 15% on cost gives accumulated depreciation of ₹54,000, so the book value is ₹66,000. Selling above the book value yields a profit of ₹4,000, and the cost of ₹1,20,000 — not the book value — is what leaves the Asset A/c.",
      tags: ["competency", "case-study"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0040", chapter: "dep", topic: "WDV Computation",
      type: "case", difficulty: "Medium", marks: 4,
      q: "A machine is depreciated under the Written Down Value Method. Answer the questions that follow.",
      passage: "A machine costing ₹2,00,000 is purchased on 1st April and is depreciated at 20% per annum under the Written Down Value Method. The accounting year ends on 31st March, and the machine is used for every full year of its life.",
      subs: [
        {
          q: "What is the depreciation for the second year?",
          type: "numerical", marks: 2, value: 32000, tolerance: 0, prefix: "₹",
          explanation: "Year 1: ₹2,00,000 × 20% = ₹40,000, book value = ₹1,60,000. Year 2: ₹1,60,000 × 20% = ₹32,000."
        },
        {
          q: "What is the book value of the machine at the end of the third year?",
          type: "numerical", marks: 1, value: 102400, tolerance: 0, prefix: "₹",
          explanation: "Year 2 closes at ₹1,60,000 − ₹32,000 = ₹1,28,000. Year 3: depreciation = ₹1,28,000 × 20% = ₹25,600, so book value = ₹1,28,000 − ₹25,600 = ₹1,02,400."
        },
        {
          q: "Why is the depreciation for the third year much smaller than for the first year?",
          type: "mcq", marks: 1, answerIndex: 2,
          options: ["Because the rate of depreciation falls every year under WDV",
            "Because the machine is scrapped at the end of the third year",
            "Because the fixed rate is applied to a book value that keeps shrinking",
            "Because no depreciation can be charged after three years"],
          explanation: "The rate stays at 20%, but it is applied to the opening book value of each year. As that balance keeps falling (₹2,00,000 → ₹1,60,000 → ₹1,28,000), the amount of depreciation also keeps falling."
        }
      ],
      explanation: "Under WDV the fixed rate is applied to the opening book value of each year: ₹40,000, then ₹32,000, then ₹25,600, so the book value at the end of year 3 is ₹2,00,000 − ₹40,000 − ₹32,000 − ₹25,600 = ₹1,02,400.",
      tags: ["competency", "case-study", "hots"], provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-0041", chapter: "dep", topic: "SLM Computation",
      type: "case", difficulty: "Easy", marks: 3,
      q: "Read the information about the computer and answer the questions that follow.",
      passage: "Ravi buys a computer on 1st April for ₹50,000. He expects to use it for 5 years and to recover ₹10,000 by selling it as scrap at the end of that period. He depreciates it under the Straight Line Method and charges depreciation directly to the asset account.",
      subs: [
        {
          q: "What is the depreciation on the computer for one full year?",
          type: "numerical", marks: 1, value: 8000, tolerance: 0, prefix: "₹",
          explanation: "Annual depreciation (SLM) = (Cost − Residual value) ÷ Useful life = (₹50,000 − ₹10,000) ÷ 5 = ₹40,000 ÷ 5 = ₹8,000."
        },
        {
          q: "What is the book value of the computer on 31st March of the second year?",
          type: "mcq", marks: 1, answerIndex: 3,
          options: ["₹42,000", "₹50,000", "₹26,000", "₹34,000"],
          explanation: "Depreciation for two years = ₹8,000 × 2 = ₹16,000. Book value = ₹50,000 − ₹16,000 = ₹34,000."
        },
        {
          q: "Which entry records the first year's depreciation when it is charged directly to the asset?",
          type: "mcq", marks: 1, answerIndex: 0,
          options: ["Depreciation A/c Dr. ₹8,000; To Computer A/c ₹8,000",
            "Computer A/c Dr. ₹8,000; To Depreciation A/c ₹8,000",
            "Depreciation A/c Dr. ₹8,000; To Provision for Depreciation A/c ₹8,000",
            "Profit & Loss A/c Dr. ₹8,000; To Computer A/c ₹8,000"],
          explanation: "When depreciation is charged to the asset itself, the entry is Depreciation A/c Dr.; To Computer A/c, which reduces the asset's balance to its new book value. The Depreciation A/c is closed later by debiting the Profit & Loss A/c."
        }
      ],
      explanation: "The depreciable amount is cost minus residual value, ₹50,000 − ₹10,000 = ₹40,000, spread over 5 years at ₹8,000 a year. Two years of that charge reduces the book value to ₹34,000.",
      tags: ["case-study"], provenance: { kind: "new", verified: true }
    }
  ];
});
