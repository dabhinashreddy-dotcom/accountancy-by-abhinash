/* ============================================================
   EXPANDED EXAM BANK — group 11: image-based questions
   Authored for the CBSE Class 11 Accountancy (055) syllabus.
   Generated source fragment; concatenated into questions-expanded.js.

   Every question here is built around one of the local diagrams in
   assets/questions/. Each carries meaningful alt text, and the
   answer never depends on seeing the picture alone — the numbers a
   student needs are stated in the question as well, so a student
   using a screen reader is tested on exactly the same fact.
   ============================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.EXAM_Q_GROUP11 = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  return [
    /* ---------------- eq — the accounting equation ---------------- */
    {
      id: "x-eq-9001", chapter: "eq", topic: "The accounting equation", type: "mcq",
      difficulty: "Easy", marks: 1,
      q: "The diagram repeats the accounting equation: Assets = Liabilities + Capital. If total liabilities are ₹1,80,000 and capital is ₹2,70,000, what are total assets?",
      options: ["₹90,000", "₹2,70,000", "₹4,50,000", "₹6,30,000"],
      answerIndex: 2,
      explanation: "Assets = Liabilities + Capital = ₹1,80,000 + ₹2,70,000 = ₹4,50,000. ₹6,30,000 would be the answer if the two figures were multiplied rather than added, and ₹90,000 if they were subtracted.",
      tags: ["image", "numerical", "conceptual"],
      image: {
        src: "assets/questions/accounting-equation.svg",
        alt: "Three boxes in a row: Assets, then an equals sign, then Liabilities plus Capital, showing that total assets always equal total liabilities plus capital.",
        table: "Assets = Liabilities + Capital"
      },
      provenance: { kind: "new", verified: true }
    },
    {
      id: "x-eq-9002", chapter: "eq", topic: "Capital and assets", type: "numerical",
      difficulty: "Easy", marks: 1,
      q: "A business owns assets worth ₹5,20,000 and owes ₹1,40,000 to outsiders. Using the equation in the diagram, find the owner's capital.",
      value: 380000, tolerance: 0, prefix: "₹",
      explanation: "Capital = Assets − Liabilities = ₹5,20,000 − ₹1,40,000 = ₹3,80,000. Adding the two figures gives ₹6,60,000, which is not the capital.",
      tags: ["image", "numerical", "application"],
      image: {
        src: "assets/questions/accounting-equation.svg",
        alt: "Three boxes in a row: Assets, then an equals sign, then Liabilities plus Capital.",
        table: "Assets = Liabilities + Capital"
      },
      provenance: { kind: "new", verified: true }
    },
    {
      id: "x-eq-9003", chapter: "eq", topic: "Effect of transactions", type: "multi",
      difficulty: "Medium", marks: 1,
      q: "The diagram states that every transaction keeps the equation in balance. Select every transaction below that genuinely leaves it in balance.",
      options: [
        "Cash of ₹60,000 introduced by the owner increases Cash and Capital by the same amount",
        "₹25,000 owed to a creditor is paid by cheque, reducing assets and liabilities together",
        "Furniture worth ₹40,000 is bought for cash, moving value from one asset to another",
        "An expense of ₹12,000 is recorded as an asset and never charged against capital",
        "Goods worth ₹9,000 are taken by the owner for personal use, reducing stock and capital together"
      ],
      answers: [0, 1, 2, 4],
      explanation: "Each of these changes two sides of the equation by the same amount. Recording an expense as an asset raises assets without reducing capital, so the two sides no longer agree — that entry is simply wrong.",
      tags: ["image", "conceptual", "application"],
      image: {
        src: "assets/questions/accounting-equation.svg",
        alt: "Three boxes in a row: Assets, then an equals sign, then Liabilities plus Capital, with a note that income and gains raise capital while expenses and drawings reduce it.",
        table: "Assets = Liabilities + Capital; income and gains raise capital, expenses and drawings reduce it"
      },
      provenance: { kind: "new", verified: true }
    },

    /* ---------------- lg — the T-format ledger account ------------- */
    {
      id: "x-lg-9001", chapter: "lg", topic: "Ledger account format", type: "mcq",
      difficulty: "Easy", marks: 1,
      q: "In the T-format account shown, what is the left-hand half of the account called?",
      options: ["Narration side", "Debit side", "Balance side", "Credit side"],
      answerIndex: 1,
      explanation: "A ledger account is drawn as the letter T. The half on the left is the debit side, headed Date, Particulars, J.F. and Amount; the half on the right is the credit side with the same four headings.",
      tags: ["image", "conceptual"],
      image: {
        src: "assets/questions/ledger-t-account.svg",
        alt: "A ledger account drawn as the letter T. The left half is the debit side with Date, Particulars, J.F. and Amount columns; the right half is the credit side with the same four columns. A closing balance line appears at the foot of each half and both totals agree.",
        table: "Left half: Debit side (Date, Particulars, J.F., Amount). Right half: Credit side (Date, Particulars, J.F., Amount). Both halves end with a Total line."
      },
      provenance: { kind: "new", verified: true }
    },
    {
      id: "x-lg-9002", chapter: "lg", topic: "Opening balances", type: "mcq",
      difficulty: "Medium", marks: 1,
      q: "An account opens with 'To Balance b/d' of ₹24,000 on its debit side, as the pattern in the diagram suggests. What does this tell you?",
      options: [
        "₹24,000 was received in cash during the period",
        "The account had a credit balance brought forward of ₹24,000",
        "₹24,000 was paid in cash during the period",
        "The account had a debit balance brought forward of ₹24,000"
      ],
      answerIndex: 3,
      explanation: "'To Balance b/d' on the debit side is the opening debit balance carried down from the previous account. Had it been on the credit side as 'By Balance b/d', it would have been an opening credit balance.",
      tags: ["image", "conceptual"],
      image: {
        src: "assets/questions/ledger-t-account.svg",
        alt: "A T-format ledger account whose debit side begins with the line To Balance b/d and whose credit side closes with By Balance c/d.",
        table: "Debit side: To Balance b/d. Credit side: By Balance c/d."
      },
      provenance: { kind: "new", verified: true }
    },
    {
      id: "x-lg-9003", chapter: "lg", topic: "Balancing an account", type: "numerical",
      difficulty: "Easy", marks: 1,
      q: "A Cash Account is drawn in the T format shown. The debit side totals ₹72,000 and the credit side totals ₹58,400. Find the closing balance.",
      value: 13600, tolerance: 0, prefix: "₹",
      explanation: "The account balances when both sides total the same. The credit side is short by ₹72,000 − ₹58,400 = ₹13,600, so 'By Balance c/d' on the credit side is ₹13,600 and the opening balance of the next period is a debit balance of ₹13,600.",
      tags: ["image", "numerical", "application"],
      image: {
        src: "assets/questions/ledger-t-account.svg",
        alt: "A T-format ledger account with Date, Particulars, J.F. and Amount columns on both the debit and credit sides, and a Total line at the foot of each side.",
        table: "Both sides must carry the same Total once the closing balance is brought down."
      },
      provenance: { kind: "new", verified: true }
    },

    /* ---------------- jr — the journal ------------------------------ */
    {
      id: "x-jr-9001", chapter: "jr", topic: "Journalising", type: "mcq",
      difficulty: "Easy", marks: 1,
      q: "The journal extract in the diagram shows 'Cash A/c … Dr 5,000' with 'To Ram's A/c 5,000' and the narration '(Being cash received from Ram)'. What does this entry record?",
      options: [
        "Cash received from Ram",
        "Cash paid to Ram",
        "Goods sold to Ram on credit",
        "Ram's account closed into Capital"
      ],
      answerIndex: 0,
      explanation: "Cash is debited because cash comes in, and Ram's account is credited because Ram is the giver. The narration confirms it: cash was received from Ram. Had cash been paid, Cash A/c would have been credited.",
      tags: ["image", "conceptual"],
      image: {
        src: "assets/questions/journal-format.svg",
        alt: "A journal sheet with Date, Particulars, L.F. and one Rupee amount column. One entry shows Cash account debited five thousand and Ram's account credited five thousand, with a narration in brackets below.",
        table: "Debit: Cash A/c 5,000. Credit: To Ram's A/c 5,000. Narration: Being cash received from Ram."
      },
      provenance: { kind: "new", verified: true }
    },
    {
      id: "x-jr-9002", chapter: "jr", topic: "Journal format", type: "mcq",
      difficulty: "Easy", marks: 1,
      q: "The journal format in the diagram includes a column headed L.F. What does L.F. stand for?",
      options: ["Ledger Format", "Loss and Fee", "Ledger Folio", "List of Figures"],
      answerIndex: 2,
      explanation: "L.F. means Ledger Folio — the page number of the ledger account to which the entry has been posted. It creates a link between the journal and the ledger so any entry can be traced.",
      tags: ["image", "conceptual"],
      image: {
        src: "assets/questions/journal-format.svg",
        alt: "A journal sheet whose column headings are Date, Particulars, L.F. and one Rupee amount column.",
        table: "Journal columns: Date | Particulars | L.F. | ₹ Amount"
      },
      provenance: { kind: "new", verified: true }
    },
    {
      id: "x-jr-9003", chapter: "jr", topic: "Journal format", type: "multi",
      difficulty: "Medium", marks: 1,
      q: "Looking at the Particulars column in the diagram, select everything that genuinely appears in it.",
      options: [
        "The account to be debited, written first and followed by dots and the letters Dr",
        "The account to be credited, written on the next line and preceded by the word To",
        "A short narration in brackets explaining the transaction",
        "A running total of every entry posted so far",
        "The ledger page number of each account involved"
      ],
      answers: [0, 1, 2],
      explanation: "The Particulars column carries the debited account, the credited account and the narration. Running totals are never kept in a journal, and the ledger page number belongs in the L.F. column, not in Particulars.",
      tags: ["image", "conceptual"],
      image: {
        src: "assets/questions/journal-format.svg",
        alt: "A journal entry showing a debited account on the first line, the credited account indented on the second line, and a narration in brackets on the third line.",
        table: "Line 1: Cash A/c … Dr 5,000. Line 2: To Ram's A/c 5,000. Line 3: (Being cash received from Ram)."
      },
      provenance: { kind: "new", verified: true }
    },

    /* ---------------- cb — the triple-column cash book -------------- */
    {
      id: "x-cb-9001", chapter: "cb", topic: "Triple column cash book", type: "mcq",
      difficulty: "Medium", marks: 1,
      q: "The cash book in the diagram has a Discount column on both sides. The Discount column on the debit (receipts) side records what?",
      options: [
        "Discount received from suppliers",
        "Discount allowed to customers",
        "Interest charged by the bank",
        "Interest on drawings"
      ],
      answerIndex: 0,
      explanation: "Discount received is a gain, so it is entered on the receipt side of the cash book. Discount allowed is an expense and goes on the payment side. Bank interest charged belongs in the bank column, not the Discount column.",
      tags: ["image", "conceptual"],
      image: {
        src: "assets/questions/cash-book-columns.svg",
        alt: "A cash book split down the middle. The left half is the receipt side and the right half the payment side, and each half carries Date, Particulars and three amount columns headed Cash, Bank and Discount.",
        table: "Each side: Date | Particulars | Cash | Bank | Discount"
      },
      provenance: { kind: "new", verified: true }
    },
    {
      id: "x-cb-9002", chapter: "cb", topic: "Cash and bank columns", type: "mcq",
      difficulty: "Easy", marks: 1,
      q: "A cheque for ₹4,200 is received from a customer and banked on the same day. In the cash book shown, which column receives the entry?",
      options: [
        "The Discount column",
        "The Cash column only",
        "Both the Cash and the Bank columns",
        "The Bank column only"
      ],
      answerIndex: 3,
      explanation: "Money that goes straight to the bank is entered in the Bank column of the receipt side. It never touches cash on hand, so the Cash column is untouched — recording it in both would count the same money twice.",
      tags: ["image", "conceptual"],
      image: {
        src: "assets/questions/cash-book-columns.svg",
        alt: "A cash book whose receipt side and payment side each carry three amount columns headed Cash, Bank and Discount.",
        table: "Receipt side columns: Cash | Bank | Discount. Payment side columns: Cash | Bank | Discount."
      },
      provenance: { kind: "new", verified: true }
    },
    {
      id: "x-cb-9003", chapter: "cb", topic: "Cash book and reconciliation", type: "matching",
      difficulty: "Hard", marks: 1,
      q: "Match each event on the left with the correct treatment in the cash book shown in the diagram.",
      left: [
        "Discount allowed to a customer",
        "Discount received from a supplier",
        "Cheque received and banked the same day",
        "Cheque issued but not yet presented for payment"
      ],
      right: [
        "Debit (receipt) side of the Cash Book",
        "Added to the Cash Book balance in a reconciliation",
        "Recorded in the Discount column on both sides",
        "Credit (payment) side of the Cash Book",
        "Bank column, debit side"
      ],
      answerSlots: [3, 0, 4, 1],
      explanation: "Discount allowed is an expense, so it sits on the payment side. Discount received is a gain, so it sits on the receipt side. A cheque banked the same day goes to the Bank column on the receipt side. A cheque issued but not yet presented has already left the Cash Book, so it is added back when reconciling towards the Pass Book balance.",
      tags: ["image", "conceptual", "application"],
      image: {
        src: "assets/questions/cash-book-columns.svg",
        alt: "A cash book with a receipt half and a payment half, each carrying Cash, Bank and Discount amount columns.",
        table: "Receipt side: Date | Particulars | Cash | Bank | Discount. Payment side: Date | Particulars | Cash | Bank | Discount."
      },
      provenance: { kind: "new", verified: true }
    },

    /* ---------------- tb — the trial balance ------------------------- */
    {
      id: "x-tb-9001", chapter: "tb", topic: "Limitations of a trial balance", type: "mcq",
      difficulty: "Medium", marks: 1,
      q: "The trial balance in the diagram agrees at ₹82,000 on both sides. Which of these could still be wrong without disturbing that agreement?",
      options: [
        "An arithmetic slip while adding the credit column",
        "A transaction that was never recorded in the books at all",
        "A debit balance written into the credit column",
        "A total of ₹500 written down as ₹600"
      ],
      answerIndex: 1,
      explanation: "A transaction that is omitted from both sides leaves the two totals equal, so a trial balance cannot detect it. Every other option either alters one side only or makes both columns add up to a different figure, and each would be caught.",
      tags: ["image", "conceptual", "hots"],
      image: {
        src: "assets/questions/trial-balance-format.svg",
        alt: "A trial balance statement with Particulars in the centre and Debit and Credit amount columns. Capital is shown as a credit of sixty thousand, Cash as a debit of eighteen thousand, Purchases as a debit of sixty-four thousand and Sales as a credit of twenty-two thousand, and both columns total eighty-two thousand.",
        table: "Capital Cr 60,000 | Cash Dr 18,000 | Purchases Dr 64,000 | Sales Cr 22,000 | Total Dr 82,000 = Total Cr 82,000"
      },
      provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-9002", chapter: "tb", topic: "Preparing a trial balance", type: "numerical",
      difficulty: "Easy", marks: 1,
      q: "In the trial balance shown, the debit side carries Purchases ₹64,000 and Cash ₹18,000, and the credit side carries Capital ₹60,000. What must Sales be for the two totals to agree?",
      value: 22000, tolerance: 0, prefix: "₹",
      explanation: "Debit side total = ₹64,000 + ₹18,000 = ₹82,000. The credit side must reach the same figure, so Sales = ₹82,000 − ₹60,000 = ₹22,000.",
      tags: ["image", "numerical", "application"],
      image: {
        src: "assets/questions/trial-balance-format.svg",
        alt: "A trial balance with a Debit column totalling eighty-two thousand and a Credit column totalling the same figure.",
        table: "Debit: Cash 18,000 + Purchases 64,000 = 82,000. Credit: Capital 60,000 + Sales 22,000 = 82,000."
      },
      provenance: { kind: "new", verified: true }
    },
    {
      id: "x-tb-9003", chapter: "tb", topic: "Closing stock", type: "mcq",
      difficulty: "Medium", marks: 1,
      q: "Closing stock does not appear anywhere in the trial balance shown. Why not?",
      options: [
        "It has not been posted to the ledger, so it sits outside the trial balance",
        "It is recorded in the journal but never posted to the ledger",
        "A trial balance lists only cash and bank items",
        "Closing stock forms no part of the final accounts"
      ],
      answerIndex: 0,
      explanation: "Closing stock is given as a year-end adjustment and is not posted to the ledger before the trial balance is drawn up, so it cannot appear in it. It is shown on the credit side of the Trading Account and as an asset in the Balance Sheet. It does form part of the final accounts.",
      tags: ["image", "conceptual"],
      image: {
        src: "assets/questions/trial-balance-format.svg",
        alt: "A trial balance listing Capital, Cash, Purchases and Sales with no line for closing stock.",
        table: "Listed: Capital, Cash, Purchases, Sales. Not listed: closing stock."
      },
      provenance: { kind: "new", verified: true }
    },

    /* ---------------- fs — the flow of final accounts ---------------- */
    {
      id: "x-fs-9001", chapter: "fs", topic: "Final accounts structure", type: "mcq",
      difficulty: "Easy", marks: 1,
      q: "The diagram traces the flow of the final accounts. Which statement about it is correct?",
      options: [
        "The Balance Sheet is an account and is closed at the end of each year",
        "Net profit is transferred from the Balance Sheet back to the Trading Account",
        "The Trading Account result is carried forward to the Profit and Loss Account",
        "The Balance Sheet is drawn up for a period of time"
      ],
      answerIndex: 2,
      explanation: "The Trading Account produces gross profit or gross loss, and that result is carried into the Profit and Loss Account. The Balance Sheet is a statement of assets, liabilities and capital at a particular date — it is not an account and it is not closed.",
      tags: ["image", "conceptual"],
      image: {
        src: "assets/questions/final-accounts-structure.svg",
        alt: "A flow diagram. The Trading Account produces gross profit or gross loss, which flows into the Profit and Loss Account, which produces net profit or net loss that increases or reduces capital. Below them sits the Balance Sheet, a statement of assets and liabilities at a date.",
        table: "Trading A/c → gross profit or gross loss → Profit and Loss A/c → net profit or net loss → Capital. Balance Sheet is a statement at a date."
      },
      provenance: { kind: "new", verified: true }
    },
    {
      id: "x-fs-9002", chapter: "fs", topic: "Trading account items", type: "multi",
      difficulty: "Medium", marks: 1,
      q: "Referring to the Trading Account at the start of the diagram, select every item that is charged to it.",
      options: [
        "Purchases",
        "Wages",
        "Depreciation of machinery",
        "Closing stock",
        "Interest on a loan taken for the owner's wedding"
      ],
      answers: [0, 1, 3],
      explanation: "Purchases, wages and closing stock are all part of the cost of goods sold, so they belong in the Trading Account. Depreciation is an indirect charge and goes to the Profit and Loss Account. A loan for the owner's wedding is a personal matter and is not a business expense at all.",
      tags: ["image", "conceptual"],
      image: {
        src: "assets/questions/final-accounts-structure.svg",
        alt: "The Trading Account box feeding its result into the Profit and Loss Account box.",
        table: "Trading A/c → Profit and Loss A/c."
      },
      provenance: { kind: "new", verified: true }
    },
    {
      id: "x-fs-9003", chapter: "fs", topic: "Net loss", type: "mcq",
      difficulty: "Medium", marks: 1,
      q: "In the diagram, a net loss would travel where, and what would it do to capital?",
      options: [
        "Increase the owner's drawings",
        "Be carried to the Balance Sheet and reduce capital",
        "Increase capital",
        "Be carried back to the Trading Account"
      ],
      answerIndex: 1,
      explanation: "A net loss is the opposite of a net profit: it leaves the Profit and Loss Account, appears in the Balance Sheet, and reduces the capital the owner holds in the business. Drawings are a separate reduction of capital.",
      tags: ["image", "conceptual"],
      image: {
        src: "assets/questions/final-accounts-structure.svg",
        alt: "The Profit and Loss Account box feeding its result into the Capital box, with the Balance Sheet shown as a statement beneath.",
        table: "Profit and Loss A/c → net profit or net loss → Capital; Balance Sheet is a statement at a date."
      },
      provenance: { kind: "new", verified: true }
    },

    /* ---------------- brs — bank reconciliation ---------------------- */
    {
      id: "x-brs-9001", chapter: "brs", topic: "Cause of a difference", type: "mcq",
      difficulty: "Medium", marks: 1,
      q: "The diagram shows cheques deposited but not yet cleared by the bank as one cause of difference. What does that do to the Pass Book balance compared with the Cash Book balance?",
      options: [
        "It leaves the two balances equal",
        "It lowers the Pass Book balance only when the account is an overdraft",
        "It leaves the Pass Book balance lower than the Cash Book balance",
        "It leaves the Pass Book balance higher than the Cash Book balance"
      ],
      answerIndex: 2,
      explanation: "The moment a cheque is banked the Cash Book rises, but the Pass Book rises only when the bank clears it. Until then the Pass Book balance is lower by exactly the amount of the cheques in transit.",
      tags: ["image", "conceptual"],
      image: {
        src: "assets/questions/bank-reconciliation-flow.svg",
        alt: "Two boxes, Balance as per Cash Book on the left and Balance as per Pass Book on the right. Two arrows point from the Cash Book to the Pass Book labelled cheques deposited not yet cleared and cheques issued not yet presented; two arrows point back from the Pass Book to the Cash Book labelled bank charges not entered in the Cash Book and interest credited by the bank not entered in the Cash Book.",
        table: "Cash Book → Pass Book: cheques deposited not yet cleared; cheques issued not yet presented. Pass Book → Cash Book: bank charges not entered; interest credited not entered."
      },
      provenance: { kind: "new", verified: true }
    },
    {
      id: "x-brs-9002", chapter: "brs", topic: "Reconciling a balance", type: "numerical",
      difficulty: "Easy", marks: 1,
      q: "Balance as per Cash Book is ₹37,200. Cheques of ₹6,500 have been issued but not yet presented for payment, and there are no other differences. Find the balance as per Pass Book.",
      value: 43700, tolerance: 0, prefix: "₹",
      explanation: "Cheques issued but not yet presented have already reduced the Cash Book but not yet the Pass Book, so the Pass Book balance is higher by that amount: ₹37,200 + ₹6,500 = ₹43,700.",
      tags: ["image", "numerical", "application"],
      image: {
        src: "assets/questions/bank-reconciliation-flow.svg",
        alt: "Two boxes joined by arrows labelled with the usual causes of difference between a Cash Book balance and a Pass Book balance.",
        table: "Causes: cheques in transit, cheques issued not yet presented, bank charges not entered, interest credited not entered."
      },
      provenance: { kind: "new", verified: true }
    },
    {
      id: "x-brs-9003", chapter: "brs", topic: "Bank charges", type: "mcq",
      difficulty: "Medium", marks: 1,
      q: "The bank debits charges of ₹340 from the account, and the firm has not yet entered them in its Cash Book. According to the diagram, what happens to the Pass Book balance?",
      options: [
        "It is higher than the Cash Book balance by ₹340",
        "It is unaffected by the charges",
        "It is higher only if the account is in credit",
        "It is lower than the Cash Book balance by ₹340"
      ],
      answerIndex: 3,
      explanation: "The bank has already taken the money out, so the Pass Book balance has fallen while the Cash Book has not yet moved. The Pass Book balance is therefore lower by exactly ₹340, and the charge is subtracted from the Cash Book balance when reconciling.",
      tags: ["image", "conceptual"],
      image: {
        src: "assets/questions/bank-reconciliation-flow.svg",
        alt: "An arrow pointing from the Pass Book box back to the Cash Book box labelled bank charges not entered in the Cash Book.",
        table: "Pass Book → Cash Book: bank charges not entered in the Cash Book."
      },
      provenance: { kind: "new", verified: true }
    },

    /* ---------------- dep — depreciation methods ---------------------- */
    {
      id: "x-dep-9001", chapter: "dep", topic: "Methods of depreciation", type: "mcq",
      difficulty: "Easy", marks: 1,
      q: "The chart compares the two methods over four years. What makes the straight line method different from the written down value method?",
      options: [
        "It charges a shrinking amount each year based on the opening book value",
        "It charges the same amount every year based on the cost of the asset",
        "It ignores the useful life of the asset",
        "It never reduces the book value of the asset"
      ],
      answerIndex: 1,
      explanation: "The straight line bars are all the same height because a fixed amount comes off cost each year. Under the written down value method the charge is a fixed rate of the opening book value, so the bars shrink as the book value falls.",
      tags: ["image", "conceptual"],
      image: {
        src: "assets/questions/depreciation-methods.svg",
        alt: "A grouped bar chart of depreciation over four years. The straight line bars are all the same height at twenty-five thousand each year. The written down value bars shrink from twenty thousand in year one to sixteen thousand, then twelve thousand eight hundred, then ten thousand two hundred and forty.",
        table: "Straight line: 25,000 each year for four years. Written down value at 20%: 20,000 then 16,000 then 12,800 then 10,240."
      },
      provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-9002", chapter: "dep", topic: "Book value", type: "numerical",
      difficulty: "Medium", marks: 1,
      q: "The chart is drawn for an asset costing ₹1,00,000 with four years of useful life and no residual value, depreciated straight line. Find its book value at the end of Year 2.",
      value: 50000, tolerance: 0, prefix: "₹",
      explanation: "Straight line depreciation is ₹1,00,000 ÷ 4 = ₹25,000 a year. After two years ₹50,000 has been written off, so the book value is ₹1,00,000 − ₹50,000 = ₹50,000.",
      tags: ["image", "numerical", "application"],
      image: {
        src: "assets/questions/depreciation-methods.svg",
        alt: "A bar chart whose straight line bars stand at twenty-five thousand in each of four years, for an asset costing one lakh with four years of useful life and no residual value.",
        table: "Cost 1,00,000; straight line charge 25,000 a year; book values 75,000, 50,000, 25,000, nil."
      },
      provenance: { kind: "new", verified: true }
    },
    {
      id: "x-dep-9003", chapter: "dep", topic: "Written down value method", type: "mcq",
      difficulty: "Hard", marks: 1,
      q: "Under the written down value method in the chart, depreciation in Year 4 is ₹10,240 and the rate is 20% of the opening book value. What was the book value at the end of Year 3?",
      options: ["₹40,960", "₹64,000", "₹51,200", "₹12,800"],
      answerIndex: 2,
      explanation: "Year 4 depreciation is 20% of the book value at the start of that year, so that opening book value — which is the closing book value of Year 3 — is ₹10,240 ÷ 0.20 = ₹51,200. The sequence runs 1,00,000 → 80,000 → 64,000 → 51,200 → 40,960.",
      tags: ["image", "numerical", "hots"],
      image: {
        src: "assets/questions/depreciation-methods.svg",
        alt: "A bar chart whose written down value bars shrink across four years: twenty thousand, sixteen thousand, twelve thousand eight hundred, ten thousand two hundred and forty.",
        table: "Written down value at 20%: 20,000 then 16,000 then 12,800 then 10,240; book values 80,000, 64,000, 51,200, 40,960."
      },
      provenance: { kind: "new", verified: true }
    }
  ];
});
