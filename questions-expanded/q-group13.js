/* ============================================================
   EXPANDED EXAM BANK — group 13: two-mark short-answer cases
   Authored for the CBSE Class 11 Accountancy (055) syllabus.
   Generated source fragment; concatenated into questions-expanded.js.

   WHY THIS FILE EXISTS
   The CBSE Board Mock Test draws Section B as "2 marks each" and its
   second batch is pinned to `types: ["case"], unit: "u2"`. Nothing in
   the bank before this fragment produced a case worth exactly 2 marks
   from Unit 2, so that batch could never be filled and the whole paper
   was refused. Each question here is a short situation (a paragraph
   a student can read in seconds) with exactly two 1-mark parts, which
   is what a 2-mark short answer really is.

   Chapter ids used: eq dc jr lg cb sp2 brs gst tb dep pres roe
   Id range: x-<chapter>-6001 (reserved for this group)
   ============================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.EXAM_Q_GROUP13 = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  return [

    /* ---------------- eq : accounting equation -------------------- */
    {
      id: "x-eq-6001", chapter: "eq", topic: "Accounting equation", type: "case",
      difficulty: "Medium", marks: 2,
      q: "Read the situation and answer the two parts that follow.",
      passage: "Meera began a shop with ₹90,000 in cash and a delivery van valued at ₹60,000. She had borrowed ₹35,000 from her sister to set the business up. On the second day she bought a shelving unit for ₹12,000 and paid for it in cash on the spot.",
      subs: [
        {
          q: "What is Meera's capital on the day she started the shop?",
          type: "mcq", marks: 1,
          options: ["₹1,27,000", "₹1,15,000", "₹1,50,000", "₹80,000"],
          answerIndex: 1,
          explanation: "Capital = Assets − Liabilities. Assets on day one = ₹90,000 cash + ₹60,000 van = ₹1,50,000. Liabilities = ₹35,000. Capital = ₹1,50,000 − ₹35,000 = ₹1,15,000. ₹1,50,000 is the asset total, and ₹1,27,000 wrongly adds the loan instead of deducting it."
        },
        {
          q: "Find the total value of her assets after the shelving unit was bought.",
          type: "numerical", marks: 1, value: 150000, tolerance: 0, prefix: "₹",
          explanation: "Cash falls by ₹12,000 to ₹78,000 and a shelving unit of ₹12,000 appears. Total assets = ₹78,000 + ₹60,000 + ₹12,000 = ₹1,50,000. One asset was simply exchanged for another, so the total does not move."
        }
      ],
      explanation: "Capital is what the owner claims after the borrowed ₹35,000 is deducted, and paying cash for an asset only changes the shape of the asset side, never its total.",
      tags: ["case-study", "numerical"], provenance: { kind: "new", verified: true }
    },

    /* ---------------- dc : debit and credit ----------------------- */
    {
      id: "x-dc-6001", chapter: "dc", topic: "Debit and credit rules", type: "case",
      difficulty: "Easy", marks: 2,
      q: "Read the situation and answer the two parts that follow.",
      passage: "Ravi sold goods worth ₹7,500 to Suresh on credit. Two days later Suresh paid ₹5,000 by cheque and also returned goods worth ₹250, which Ravi accepted without complaint.",
      subs: [
        {
          q: "When the goods were first sold to Suresh on credit, which account was credited?",
          type: "mcq", marks: 1,
          options: ["Suresh's account", "Cash account", "Sales account", "Purchases account"],
          answerIndex: 2,
          explanation: "A credit sale gives one debit and one credit: Suresh's account is debited because he receives the goods, and Sales account is credited because the business gives the goods. Cash is not involved in a credit sale, and Purchases is used only when goods are bought."
        },
        {
          q: "After the cheque and the return, how much does Suresh still owe Ravi?",
          type: "numerical", marks: 1, value: 2250, tolerance: 0, prefix: "₹",
          explanation: "Opening amount owed ₹7,500, less ₹5,000 paid, less ₹250 of goods returned = ₹2,250 still due. The return reduces the debt because the goods went back to Ravi."
        }
      ],
      explanation: "A credit sale debits the buyer and credits Sales; what the buyer owes afterwards is the invoice less everything he has paid or sent back.",
      tags: ["case-study", "numerical"], provenance: { kind: "new", verified: true }
    },

    /* ---------------- jr : journal --------------------------------- */
    {
      id: "x-jr-6001", chapter: "jr", topic: "Journalising", type: "case",
      difficulty: "Medium", marks: 2,
      q: "Read the situation and answer the two parts that follow.",
      passage: "On 5th April a firm bought a computer for ₹32,000 and paid a further ₹200 by cheque to have it installed; its standing policy is to treat installation charges as part of the asset's cost. On 8th April it received ₹4,800 by cheque as rent for a part of its premises.",
      subs: [
        {
          q: "What total is debited to Computer A/c for the transaction of 5th April?",
          type: "numerical", marks: 1, value: 32200, tolerance: 0, prefix: "₹",
          explanation: "Because the firm capitalises installation, the asset carries the whole cost of getting it ready for use: ₹32,000 + ₹200 = ₹32,200. Splitting the ₹200 into a separate expense account would understate the asset."
        },
        {
          q: "On 8th April, which account is credited when the rent is received and banked?",
          type: "mcq", marks: 1,
          options: ["Cash account", "Bank account", "Rent account", "Deposits account"],
          answerIndex: 2,
          explanation: "Rent is an income, and every income account is credited. The money reaching the bank is debited to the Bank account, but the account that is credited — the one naming what was earned — is Rent account."
        }
      ],
      explanation: "Costs that make an asset ready for use belong in the asset; income received is always credited to the income account, not to cash or bank.",
      tags: ["case-study", "numerical"], provenance: { kind: "new", verified: true }
    },

    /* ---------------- lg : ledger ---------------------------------- */
    {
      id: "x-lg-6001", chapter: "lg", topic: "Balancing the ledger", type: "case",
      difficulty: "Easy", marks: 2,
      q: "Read the situation and answer the two parts that follow.",
      passage: "Anuj's account in the ledger opens with a debit balance of ₹18,400. During the month goods worth ₹6,000 were sold to him on credit and he paid ₹14,000 by cheque against his account. No other entries were passed in his account.",
      subs: [
        {
          q: "Find Anuj's closing balance after these transactions.",
          type: "numerical", marks: 1, value: 10400, tolerance: 0, prefix: "₹",
          explanation: "His account is a debit-balance account: ₹18,400 opening, plus ₹6,000 of goods taken, less ₹14,000 paid = ₹10,400 still owing, i.e. a closing debit balance of ₹10,400."
        },
        {
          q: "Where is that closing balance written, and with what heading?",
          type: "mcq", marks: 1,
          options: [
            "Debit side, as To Balance b/d",
            "Credit side, as By Balance c/d",
            "Debit side, as By Balance c/d",
            "Credit side, as To Balance b/d"
          ],
          answerIndex: 1,
          explanation: "A debit balance is brought down by writing By Balance c/d on the credit side, which is what makes both columns total the same. 'To Balance b/d' is the heading of the OPENING balance on the debit side."
        }
      ],
      explanation: "Add everything on the debit side, subtract everything on the credit side, and the difference is written on the opposite side to make the two totals agree.",
      tags: ["case-study", "numerical"], provenance: { kind: "new", verified: true }
    },

    /* ---------------- cb : cash book -------------------------------- */
    {
      id: "x-cb-6001", chapter: "cb", topic: "Cash book columns", type: "case",
      difficulty: "Easy", marks: 2,
      q: "Read the situation and answer the two parts that follow.",
      passage: "A trader's cash book shows ₹5,000 in hand at the start of the day. During the day he received ₹1,800 in cash from a customer, paid ₹650 in cash for wages, and took ₹1,000 out of the day's receipts and paid it into the bank.",
      subs: [
        {
          q: "Find the cash in hand at the end of the day.",
          type: "numerical", marks: 1, value: 5150, tolerance: 0, prefix: "₹",
          explanation: "₹5,000 opening + ₹1,800 received − ₹650 wages − ₹1,000 banked = ₹5,150 in hand. The banked amount leaves the cash box, so it comes off this total even though the business still holds the money."
        },
        {
          q: "How is the ₹1,000 paid into the bank shown in the cash book?",
          type: "mcq", marks: 1,
          options: [
            "Discount column on both sides",
            "Bank column on the credit side only",
            "Cash column on the credit side only",
            "Bank column debited on the debit side, with the Cash column credited on the credit side"
          ],
          answerIndex: 3,
          explanation: "Moving money from the cash box into the bank is a contra entry: the Bank column is debited because the bank balance rises, and the Cash column is credited because cash on hand falls. One account rises and the other falls, so nothing is double counted."
        }
      ],
      explanation: "Cash in hand is a running balance of what came in less what went out; banking cash is a contra entry touching both the Cash and the Bank column.",
      tags: ["case-study", "numerical"], provenance: { kind: "new", verified: true }
    },

    /* ---------------- sp2 : subsidiary books ------------------------ */
    {
      id: "x-sp2-6001", chapter: "sp2", topic: "Purchases Book", type: "case",
      difficulty: "Easy", marks: 2,
      q: "Read the situation and answer the two parts that follow.",
      passage: "A trader keeps separate books for credit transactions. During one week he bought goods worth ₹24,000 from Anil, ₹9,500 from Bina and ₹6,000 from Chandu, all on credit. He also bought a second-hand machine for ₹15,000 and paid for it in cash.",
      subs: [
        {
          q: "Which book records the three credit purchases of goods?",
          type: "mcq", marks: 1,
          options: ["Sales Book", "Purchases Book", "Journal Proper", "Cash Book"],
          answerIndex: 1,
          explanation: "The Purchases Book is the day book kept only for goods bought on credit. Cash purchases go straight to the Cash Book, the machine is not goods so it goes to the Journal Proper, and a Sales Book records goods sold rather than bought."
        },
        {
          q: "What total is posted from the Purchases Book for that week?",
          type: "numerical", marks: 1, value: 39500, tolerance: 0, prefix: "₹",
          explanation: "Only the three credit purchases of goods enter this book: ₹24,000 + ₹9,500 + ₹6,000 = ₹39,500. The ₹15,000 machine is excluded because the Purchases Book takes goods only, and it was a cash transaction besides."
        }
      ],
      explanation: "The Purchases Book holds credit purchases of goods alone, so the machine and the cash purchase are both left out of its total.",
      tags: ["case-study", "numerical"], provenance: { kind: "new", verified: true }
    },

    /* ---------------- brs : bank reconciliation --------------------- */
    {
      id: "x-brs-6001", chapter: "brs", topic: "Reconciling balances", type: "case",
      difficulty: "Medium", marks: 2,
      q: "Read the situation and answer the two parts that follow.",
      passage: "On 31st March a firm's Cash Book shows ₹46,700. Its Pass Book shows cheques of ₹5,400 deposited before that date still uncleared, and bank charges of ₹300 debited by the bank but never entered in the firm's own books.",
      subs: [
        {
          q: "Find the balance as per Pass Book on 31st March.",
          type: "numerical", marks: 1, value: 41000, tolerance: 0, prefix: "₹",
          explanation: "Both differences make the bank's figure lower: ₹46,700 − ₹5,400 of cheques not yet credited − ₹300 of charges already debited = ₹41,000. Interest credited by the bank would have pushed the Pass Book figure the other way."
        },
        {
          q: "Which of these is SUBTRACTED from the Cash Book balance when reconciling towards the Pass Book balance?",
          type: "mcq", marks: 1,
          options: [
            "Cheques deposited but not yet cleared by the bank",
            "Cheques issued but not yet presented for payment",
            "Interest credited by the bank and not yet entered",
            "A payment recorded twice by mistake in the Cash Book"
          ],
          answerIndex: 0,
          explanation: "Money the firm has already banked but the bank has not yet added is missing from the Pass Book, so it is subtracted when moving from Cash Book to Pass Book. Cheques issued and interest credited are added, and a duplicated payment is a bookkeeping error rather than a timing difference."
        }
      ],
      explanation: "Anything the firm has recorded before the bank has is taken off the Cash Book balance; anything the bank has recorded first is added to it.",
      tags: ["case-study", "numerical", "application"], provenance: { kind: "new", verified: true }
    },

    /* ---------------- gst : GST -------------------------------------- */
    {
      id: "x-gst-6001", chapter: "gst", topic: "Intra-state and inter-state supply", type: "case",
      difficulty: "Easy", marks: 2,
      q: "Read the situation and answer the two parts that follow.",
      passage: "A trader registered in Maharashtra sold goods worth ₹20,000 to a buyer in Karnataka, and separately sold goods worth ₹10,000 to a shop in Pune, which is in Maharashtra. The GST rate on both sales is 18%.",
      subs: [
        {
          q: "What is the total tax charged on the sale of ₹20,000 to Karnataka?",
          type: "numerical", marks: 1, value: 3600, tolerance: 0, prefix: "₹",
          explanation: "The buyer is in a different state, so this is an inter-state supply and IGST applies on the whole value: 18% × ₹20,000 = ₹3,600. It is charged as one tax, not split into two."
        },
        {
          q: "Which tax is charged on the ₹10,000 sale to Pune?",
          type: "mcq", marks: 1,
          options: [
            "CGST and SGST of ₹1,800 each",
            "Exempt from GST altogether",
            "CGST and SGST of ₹900 each",
            "IGST of ₹1,800"
          ],
          answerIndex: 2,
          explanation: "Pune and the trader are both in Maharashtra, so it is an intra-state supply: 18% of ₹10,000 = ₹1,800, split equally between CGST (Centre) and SGST (State), giving ₹900 each."
        }
      ],
      explanation: "Different states mean one IGST; the same state means the same amount divided equally between CGST and SGST.",
      tags: ["case-study", "numerical"], provenance: { kind: "new", verified: true }
    },

    /* ---------------- tb : trial balance ------------------------------ */
    {
      id: "x-tb-6001", chapter: "tb", topic: "Preparing a trial balance", type: "case",
      difficulty: "Easy", marks: 2,
      q: "Read the situation and answer the two parts that follow",
      passage: "A trial balance has the following debit balances: Cash ₹12,000, Purchases ₹48,000, Plant ₹30,000 and Discount Allowed ₹2,000. The only credit balances are Capital ₹60,000, Sales ₹26,000 and Commission Received ₹6,000.",
      subs: [
        {
          q: "What is the total on each side of this trial balance?",
          type: "numerical", marks: 1, value: 92000, tolerance: 0, prefix: "₹",
          explanation: "Debit side = ₹12,000 + ₹48,000 + ₹30,000 + ₹2,000 = ₹92,000. Credit side = ₹60,000 + ₹26,000 + ₹6,000 = ₹92,000. Both columns must reach the same figure for the statement to agree."
        },
        {
          q: "Which of these is placed on the CREDIT side of the trial balance?",
          type: "mcq", marks: 1,
          options: ["Commission Received", "Discount Allowed", "Purchases", "Plant"],
          answerIndex: 0,
          explanation: "Commission Received is an income, and every income carries a credit balance. Discount Allowed is an expense, Purchases is a debit-balance account and Plant is an asset — all three belong on the debit side."
        }
      ],
      explanation: "Assets, expenses, drawings and losses sit on the debit side; liabilities, capital, income and gains sit on the credit side, and the two totals must agree.",
      tags: ["case-study", "numerical"], provenance: { kind: "new", verified: true }
    },

    /* ---------------- dep : depreciation ------------------------------- */
    {
      id: "x-dep-6001", chapter: "dep", topic: "Sale of a depreciated asset", type: "case",
      difficulty: "Medium", marks: 2,
      q: "Read the situation and answer the two parts that follow.",
      passage: "A machine was bought for ₹2,00,000 and is depreciated at 15% per annum on its cost. After exactly two full years of use the machine was sold for ₹1,40,000.",
      subs: [
        {
          q: "How much depreciation is charged for each of the two years?",
          type: "numerical", marks: 1, value: 30000, tolerance: 0, prefix: "₹",
          explanation: "The straight line charge on cost never moves: 15% × ₹2,00,000 = ₹30,000 every year. Charging on the written down value instead would give ₹30,000 in the first year but less afterwards."
        },
        {
          q: "Was there a profit or a loss on the sale, and of how much?",
          type: "mcq", marks: 1,
          options: [
            "A profit of ₹1,40,000",
            "A loss of ₹30,000",
            "Neither profit nor loss — the machine was sold exactly at its book value",
            "A profit of ₹60,000"
          ],
          answerIndex: 2,
          explanation: "Book value after two years = ₹2,00,000 − ₹30,000 − ₹30,000 = ₹1,40,000, which is exactly the selling price. Neither a profit nor a loss arises when an asset is sold at its book value."
        }
      ],
      explanation: "Compare the selling price with the book value — cost less depreciation written off so far — not with the original cost.",
      tags: ["case-study", "numerical", "application"], provenance: { kind: "new", verified: true }
    },

    /* ---------------- pres : provisions and reserves ------------------- */
    {
      id: "x-pres-6001", chapter: "pres", topic: "Provisions and bad debts", type: "case",
      difficulty: "Medium", marks: 2,
      q: "Read the situation and answer the two parts that follow.",
      passage: "At the start of a year a firm's debtors totalled ₹1,20,000 and it carried a provision for doubtful debts of ₹6,000 brought forward from the previous accounting period. During the year debts amounting to ₹4,000 proved irrecoverable and were written off.",
      subs: [
        {
          q: "What is the balance of the Debtors Account after the bad debts are written off?",
          type: "numerical", marks: 1, value: 116000, tolerance: 0, prefix: "₹",
          explanation: "Writing off a bad debt removes it from the debtors: ₹1,20,000 − ₹4,000 = ₹1,16,000. The provision for doubtful debts is a separate contra account and does not reduce the Debtors Account itself."
        },
        {
          q: "Which of these is a Reserve rather than a Provision?",
          type: "mcq", marks: 1,
          options: ["Provision for doubtful debts", "Provision for depreciation", "General Reserve", "Provision for tax"],
          answerIndex: 2,
          explanation: "A General Reserve is an appropriation of profit, so it is a reserve. The other three are provisions: each is a charge made against profit to meet a liability or a fall in value that is known or estimated."
        }
      ],
      explanation: "A provision is a charge against profit for a known or estimated loss; a reserve is an appropriation of profit that strengthens the firm's funds.",
      tags: ["case-study", "conceptual"], provenance: { kind: "new", verified: true }
    },

    /* ---------------- roe : rectification of errors -------------------- */
    {
      id: "x-roe-6001", chapter: "roe", topic: "Effect of errors", type: "case",
      difficulty: "Medium", marks: 2,
      q: "Read the situation and answer the two parts that follow.",
      passage: "A bookkeeper bought a machine for ₹25,000 and debited the whole amount to the Repairs Account instead of the Machine Account. The trial balance drawn up afterwards still agreed at ₹1,40,000 on both sides, so nobody noticed for months.",
      subs: [
        {
          q: "Why did the trial balance still agree despite this mistake?",
          type: "mcq", marks: 1,
          options: [
            "The machine was never recorded in the books at all",
            "The amount was omitted from both the debit and the credit column",
            "One debit was replaced by another debit, so both columns kept the same total",
            "The mistake was corrected before the trial balance was drawn up"
          ],
          answerIndex: 2,
          explanation: "The correct entry was Machine Dr, Cash Cr. The entry actually made was Repairs Dr, Cash Cr. The credit is untouched and one debit simply became a different debit, so the two column totals are unchanged — which is exactly why a trial balance cannot detect this error."
        },
        {
          q: "By how much is the Repairs Account overstated because of this mistake?",
          type: "numerical", marks: 1, value: 25000, tolerance: 0, prefix: "₹",
          explanation: "Repairs now carries ₹25,000 of capital expenditure that should never have been charged to it, so it is overstated by the full ₹25,000 — and profit is understated by the same amount. Machine Account is understated by ₹25,000."
        }
      ],
      explanation: "Errors of commission and of principle leave the trial balance agreeing because a debit is replaced by a debit or a credit by a credit; the damage shows up in the wrong account instead.",
      tags: ["case-study", "application", "hots"], provenance: { kind: "new", verified: true }
    }
  ];
});
