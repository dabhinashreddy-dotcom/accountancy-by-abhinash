/* ============================================================
   CLASS 12 — EXPANSION I (v86): Dissolution (dis) + Share Capital (sc)
   Additive unit — extends the chapters registered by data-12b.js
   and data-12c.js. Content is original teaching material written for
   this project against the CBSE Class 12 Accountancy curriculum
   (2026-27).
   ============================================================ */
(function () {
  "use strict";

  C12_DATA.register({
    content: {
      dis: {
        /* ---- Practice Bank (merged with existing ids 1–10) ---- */
        numericals: [
          {
            id: 11, difficulty: "Medium",
            question: "During dissolution an asset of book value ₹80,000 realises ₹95,000, and trade payables of ₹50,000 are settled for ₹44,000. Ignoring every other item, the net contribution of these two transactions to the realisation result is:",
            options: ["A profit of ₹21,000", "A loss of ₹21,000", "A profit of ₹15,000", "A profit of ₹6,000"],
            answerIndex: 0,
            explanation: "Asset surplus 95,000 − 80,000 = ₹15,000 plus liability gain 50,000 − 44,000 = ₹6,000, together a profit of ₹21,000 to the realisation credit."
          },
          {
            id: 12, difficulty: "Easy",
            question: "Machinery with a book value of ₹40,000 is taken over by partner P at ₹35,000 in part settlement of his capital claim. In the realisation account the credit side receives:",
            options: ["₹35,000 — the agreed value, which is ₹5,000 less than the book figure", "₹40,000 — the book value is always credited", "₹5,000 — only the shortfall is credited", "₹75,000 — both figures are added"],
            answerIndex: 0,
            explanation: "The machinery leaves the debit side at its book ₹40,000 but only ₹35,000 is credited as the value accepted, so the takeover worsens the realisation result by ₹5,000."
          },
          {
            id: 13, difficulty: "Easy",
            question: "A firm dissolves carrying a bank overdraft of ₹25,000. That balance is:",
            options: ["A liability of the firm — repaying it debits the realisation account", "Kept out of realisation like a positive bank balance", "Shared between the partners as a reserve", "Ignored, because it nets off against cash in hand"],
            answerIndex: 0,
            explanation: "An overdraft of ₹25,000 is money owed to the bank, so it is settled like any outside liability — the payment debits realisation. Only a positive cash or bank balance is excluded."
          },
          {
            id: 14, difficulty: "Medium",
            question: "After every outside claim is met, only ₹45,000 of cash remains. Partner K has lent the firm ₹15,000, and the capital claims are ₹1,20,000 (K) and ₹90,000 (L), the partners sharing profits 2:1. What is the deficiency on the capital claims?",
            options: ["₹1,80,000", "₹2,10,000", "₹1,50,000", "₹1,95,000"],
            answerIndex: 0,
            explanation: "K's loan is met ahead of capital: 45,000 − 15,000 = ₹30,000 remains for capital claims of 1,20,000 + 90,000 = ₹2,10,000, so the deficiency is 2,10,000 − 30,000 = ₹1,80,000, shared 2:1 by K and L."
          },
          {
            id: 15, difficulty: "Medium",
            question: "On dissolution the firm had cash in hand of ₹20,000 and a bank overdraft of ₹8,000. Assets realised ₹1,50,000; liabilities of ₹1,20,000 were paid; realisation expenses came to ₹5,000. The cash available immediately before the partners' loans and capital are settled is:",
            options: ["₹37,000", "₹45,000", "₹32,000", "₹1,62,000"],
            answerIndex: 0,
            explanation: "20,000 − 8,000 + 1,50,000 − 1,20,000 − 5,000 = ₹37,000. Ignoring the overdraft wrongly gives ₹45,000, and stopping before payments gives ₹1,62,000."
          },
          {
            id: 16, difficulty: "Medium",
            question: "General Reserve of ₹60,000 stands in the books when a firm dissolves. Partners X and Y share profits 4:1. The reserve is dealt with as:",
            options: ["₹48,000 credited to X and ₹12,000 credited to Y, before the final cash division", "₹30,000 each, since reserves are shared equally", "Credited to the realisation account", "Paid to the outside creditors first"],
            answerIndex: 0,
            explanation: "Accumulated profits belong to the old agreement, so 60,000 × 4/5 = ₹48,000 to X and 60,000 × 1/5 = ₹12,000 to Y, credited to their capital accounts."
          },
          {
            id: 17, difficulty: "Easy",
            question: "Partner Y pays ₹9,000 of the firm's realisation expenses on the firm's behalf. The firm's books record:",
            options: ["Realisation debited ₹9,000 and Y's capital credited ₹9,000", "Y's capital debited ₹9,000 and bank credited ₹9,000", "Realisation credited ₹9,000", "No entry at all, because Y paid in cash"],
            answerIndex: 0,
            explanation: "The cost of winding up still belongs to the firm: realisation is debited with the ₹9,000 and Y's capital is credited because the firm now owes him that money."
          },
          {
            id: 18, difficulty: "Hard",
            question: "On dissolution, assets of book value ₹4,00,000 include stock of ₹1,00,000 that is taken over by a partner at ₹90,000, while the remaining assets realise ₹2,60,000. Liabilities of book value ₹1,50,000 include ₹20,000 taken over by another partner, the rest being paid ₹1,18,000. Expenses are ₹7,000. The firm makes:",
            options: ["A loss of ₹5,000", "A profit of ₹5,000", "A loss of ₹15,000", "A profit of ₹15,000"],
            answerIndex: 0,
            explanation: "Credits 1,50,000 + 2,60,000 + 90,000 + 20,000 = ₹5,20,000; debits 4,00,000 + 1,18,000 + 7,000 = ₹5,25,000 → a loss of ₹5,000."
          },
          {
            id: 19, difficulty: "Easy",
            question: "An accumulated loss of ₹45,000 sits on a firm's balance sheet at dissolution. Partners share profits 3:2. The accumulated loss is:",
            options: ["Charged to the partners' capitals — ₹27,000 and ₹18,000 — before the final cash division", "Transferred to the debit of realisation", "Paid to the outside creditors", "Ignored, being a fictitious item"],
            answerIndex: 0,
            explanation: "A past loss was always the owners' to bear: 45,000 × 3/5 = ₹27,000 and 45,000 × 2/5 = ₹18,000 are debited directly to their capital accounts; it never fetches cash, so realisation is untouched."
          },
          {
            id: 20, difficulty: "Medium",
            question: "Assets of book value ₹2,50,000 realise ₹2,20,000; liabilities of book value ₹1,00,000 are discharged for ₹95,000; realisation expenses are ₹10,000. Before the result is shared, capitals stand at A ₹3,00,000 and B ₹2,00,000 (profit-sharing 3:2). The amount finally paid to A is:",
            options: ["₹2,79,000", "₹3,00,000", "₹2,85,000", "₹3,21,000"],
            answerIndex: 0,
            explanation: "Credits 2,20,000 + 1,00,000 = ₹3,20,000 against debits 2,50,000 + 95,000 + 10,000 = ₹3,55,000 → loss ₹35,000, of which A bears 3/5 = ₹21,000; A collects 3,00,000 − 21,000 = ₹2,79,000."
          },
          {
            id: 21, difficulty: "Easy",
            question: "Which of these is settled directly between the firm and a partner's account instead of through the realisation account?",
            options: ["An amount of ₹12,000 due from a partner to the firm on an old account", "A third-party mortgage on the godown", "Trade receivables standing in the books", "The firm's bank overdraft"],
            answerIndex: 0,
            explanation: "Mutual dues between the firm and a partner are adjusted against that partner's capital or loan account, so the ₹12,000 reduces what he finally receives; only third-party assets and liabilities ever pass through realisation."
          },
          {
            id: 22, difficulty: "Hard",
            question: "Cash of ₹55,000 is left after settling every outside liability. Realisation expenses of ₹5,000 are still due, partner M has lent the firm ₹20,000, and the capital balances are ₹80,000 (M) and ₹70,000 (N) with profits shared 3:2. What does N finally receive in cash?",
            options: ["₹22,000", "₹42,000", "₹28,000", "₹70,000"],
            answerIndex: 0,
            explanation: "Cash for capital = 55,000 − 5,000 − 20,000 = ₹30,000 against claims of ₹1,50,000 → deficiency ₹1,20,000 shared 3:2, so N bears ₹48,000 and collects 70,000 − 48,000 = ₹22,000 (M gets the remaining ₹8,000)."
          },
          {
            id: 23, difficulty: "Easy",
            question: "Which of these adds to the credit side of the realisation account?",
            options: ["Cash of ₹32,000 realised from the sale of trade receivables", "Cash of ₹55,000 paid to settle trade payables", "Realisation expenses of ₹6,000 paid in cash", "A partner's share of the realisation loss"],
            answerIndex: 0,
            explanation: "Realisation is credited with everything the assets fetch — the ₹32,000 of sale proceeds — while payments and costs such as the ₹55,000 and ₹6,000 go to its debit."
          },
          {
            id: 24, difficulty: "Medium",
            question: "Assets of book value ₹3,50,000 realise ₹3,80,000; liabilities of book value ₹1,60,000 are paid ₹1,55,000; expenses are ₹9,000; and the firm held opening cash of ₹25,000. The cash lying with the firm just before the partners' capital accounts are settled is:",
            options: ["₹2,41,000", "₹2,50,000", "₹2,16,000", "₹3,05,000"],
            answerIndex: 0,
            explanation: "25,000 opening + 3,80,000 realised − 1,55,000 paid to creditors − 9,000 expenses = ₹2,41,000. Book values never touch cash, so the ₹3,50,000 and ₹1,60,000 stay out of this arithmetic."
          },
          {
            id: 25, difficulty: "Hard",
            question: "A and B share profits 3:2. On dissolution, assets of book value ₹5,00,000 realise ₹4,50,000, liabilities of book value ₹2,00,000 are paid ₹1,90,000, realisation expenses are ₹10,000, General Reserve is ₹60,000, and the capitals are ₹2,40,000 (A) and ₹1,60,000 (B). A had also lent the firm ₹50,000. The total cash received by A is:",
            options: ["₹2,96,000", "₹2,46,000", "₹2,76,000", "₹3,00,000"],
            answerIndex: 0,
            explanation: "Loss = (4,50,000 + 2,00,000) − (5,00,000 + 1,90,000 + 10,000) = ₹50,000; A bears 3/5 = ₹30,000 and takes reserve 60,000 × 3/5 = ₹36,000, so his capital pays ₹2,46,000 — plus the ₹50,000 loan paid earlier in the order, a total of ₹2,96,000."
          }
        ],

        /* ---- Interactive statement lab (engine strings copied verbatim
               from data-12b.js; only the case list grows) ---- */
        activity: {
          type: "statement",
          title: "Realisation Statement Builder",
          instruction: "Construct the realisation statements line by line: choose each side of the account, then enter the amounts. Verify a statement to unlock its working.",
          statements: [
            {
              title: "Statement 4 — Reading a full realisation summary",
              prompt: "Ravi and Meera dissolve their firm. Classify each posting of the realisation account and enter its amount.",
              needsAmount: true,
              rows: [
                { label: "Cash realised from the building — book value ₹4,00,000, sold for ₹4,50,000", options: ["Debit side", "Credit side", "Not recorded"], answer: "Credit side", amount: 450000 },
                { label: "Cash realised from trade receivables of ₹1,20,000 — only ₹1,00,000 recovered", options: ["Debit side", "Credit side", "Not recorded"], answer: "Credit side", amount: 100000 },
                { label: "Trade payables of ₹2,50,000 transferred to realisation at book value", options: ["Debit side", "Credit side", "Not recorded"], answer: "Credit side", amount: 250000 },
                { label: "Trade payables discharged by cheque for ₹2,40,000", options: ["Debit side", "Credit side", "Not recorded"], answer: "Debit side", amount: 240000 },
                { label: "Bank overdraft of ₹30,000 repaid to the bank", options: ["Debit side", "Credit side", "Not recorded"], answer: "Debit side", amount: 30000 },
                { label: "Realisation expenses paid by cheque — ₹15,000", options: ["Debit side", "Credit side", "Not recorded"], answer: "Debit side", amount: 15000 }
              ],
              working: "Credit 2,50,000 + 4,50,000 + 1,00,000 + 75,000 (inventory realised) = <b>₹8,75,000</b>; debit 6,10,000 (assets transferred, book) + 2,40,000 + 30,000 + 15,000 = <b>₹8,95,000</b> → realisation <b>loss ₹20,000</b>, shared in the profit-sharing ratio."
            },
            {
              title: "Statement 5 — Through realisation or settled directly?",
              prompt: "Decide how each dissolution item reaches the books. Only third-party items drive the realisation account.",
              rows: [
                { label: "Mortgage of ₹75,000 on the godown, owed to an outside lender, paid at dissolution", options: ["Through realisation", "Settled directly between firm and partner", "Never recorded"], answer: "Through realisation" },
                { label: "₹12,000 due from partner S to the firm on an old account", options: ["Through realisation", "Settled directly between firm and partner", "Never recorded"], answer: "Settled directly between firm and partner" },
                { label: "₹30,000 lent to the firm by partner M", options: ["Through realisation", "Settled directly between firm and partner", "Never recorded"], answer: "Settled directly between firm and partner" },
                { label: "Cash at bank of ₹55,000 standing in the firm's account", options: ["Through realisation", "Settled directly between firm and partner", "Divided among partners after outside claims"], answer: "Divided among partners after outside claims" },
                { label: "Realisation expenses of ₹6,000 due to the liquidator", options: ["Through realisation", "Settled directly between firm and partner", "Never recorded"], answer: "Through realisation" },
                { label: "Trade payables of ₹80,000 owed to outside suppliers", options: ["Through realisation", "Settled directly between firm and partner", "Never recorded"], answer: "Through realisation" }
              ],
              working: "Realisation measures only third-party dealings: outside mortgages, payables and the cost of winding up pass through it. Mutual dues and loans of partners are settled against their own accounts, while the ₹55,000 bank balance never enters realisation at all — it is the pool being divided."
            },
            {
              title: "Statement 6 — The deficiency statement",
              prompt: "Cash of ₹45,000 is all that remains after outside liabilities. Profit ratio 2:1. Follow the statutory order and enter the figures.",
              needsAmount: true,
              rows: [
                { label: "K's loan claim of ₹15,000 — met ahead of every capital claim", options: ["Paid in full", "Shared in the profit-sharing ratio", "Left unpaid"], answer: "Paid in full", amount: 15000 },
                { label: "Cash remaining for the partners' capital claims", options: ["₹30,000", "₹45,000", "₹15,000"], answer: "₹30,000", amount: 30000 },
                { label: "Total capital claims of K and L (₹1,20,000 + ₹90,000)", options: ["₹2,10,000", "₹1,80,000", "₹1,20,000"], answer: "₹2,10,000", amount: 210000 },
                { label: "Deficiency on the capital claims", options: ["₹1,80,000", "₹2,10,000", "₹1,50,000"], answer: "₹1,80,000", amount: 180000 },
                { label: "Deficiency borne by K in the profit-sharing ratio 2:1", options: ["₹1,20,000", "₹60,000", "₹90,000"], answer: "₹1,20,000", amount: 120000 },
                { label: "Cash actually received by L against his capital claim", options: ["₹30,000", "₹60,000", "₹90,000"], answer: "₹30,000", amount: 30000 }
              ],
              working: "Loan first ₹15,000, leaving ₹30,000 for capital claims of ₹2,10,000 → deficiency ₹1,80,000 shared 2:1 (K ₹1,20,000, L ₹60,000). K collects 1,20,000 − 1,20,000 = <b>₹0</b> and L collects 90,000 − 60,000 = <b>₹30,000</b>. Every rupee of the ₹45,000 is applied and the cash account closes at zero."
            },
            {
              title: "Statement 7 — Building the partners' final balances",
              prompt: "Capitals before the closing entries are A ₹3,00,000 and B ₹2,00,000. General Reserve is ₹1,50,000 and the realisation profit is ₹40,000, shared 3:2.",
              needsAmount: true,
              rows: [
                { label: "A's share of the General Reserve credited to capital", options: ["Debit to capital", "Credit to capital", "Paid from cash"], answer: "Credit to capital", amount: 90000 },
                { label: "B's share of the General Reserve credited to capital", options: ["Debit to capital", "Credit to capital", "Paid from cash"], answer: "Credit to capital", amount: 60000 },
                { label: "A's share of the realisation profit", options: ["Debit to capital", "Credit to capital", "Paid from cash"], answer: "Credit to capital", amount: 24000 },
                { label: "B's share of the realisation profit", options: ["Debit to capital", "Credit to capital", "Paid from cash"], answer: "Credit to capital", amount: 16000 },
                { label: "Final cash payment to A", options: ["Debit to capital", "Credit to capital", "Paid from cash"], answer: "Paid from cash", amount: 414000 },
                { label: "Final cash payment to B", options: ["Debit to capital", "Credit to capital", "Paid from cash"], answer: "Paid from cash", amount: 276000 }
              ],
              working: "A 3,00,000 + 90,000 reserve share + 24,000 profit share = <b>₹4,14,000</b>; B 2,00,000 + 60,000 + 16,000 = <b>₹2,76,000</b>. Both are paid only after expenses, loans and outside liabilities."
            },
            {
              title: "Statement 8 — What never enters realisation",
              prompt: "At dissolution the firm holds the items below. Decide how each is treated; only realisation drives the third-party ones.",
              rows: [
                { label: "Cash at bank of ₹70,000 in the firm's current account", options: ["Transferred to realisation", "Kept out of realisation", "Settled with partners' capitals"], answer: "Kept out of realisation" },
                { label: "Trade receivables of ₹1,10,000 shown in the books", options: ["Transferred to realisation", "Kept out of realisation", "Settled with partners' capitals"], answer: "Transferred to realisation" },
                { label: "Loan of ₹50,000 given to the firm by partner N", options: ["Transferred to realisation", "Kept out of realisation", "Settled with partners' capitals"], answer: "Settled with partners' capitals" },
                { label: "Loan of ₹90,000 taken from a bank", options: ["Transferred to realisation", "Kept out of realisation", "Settled with partners' capitals"], answer: "Transferred to realisation" },
                { label: "Accrued bank interest of ₹6,000, never recorded in the books, now paid", options: ["Transferred to realisation", "Kept out of realisation", "Settled with partners' capitals"], answer: "Transferred to realisation" },
                { label: "Deferred expenditure (fictitious asset) of ₹24,000 in the books", options: ["Transferred to realisation", "Kept out of realisation", "Settled with partners' capitals"], answer: "Settled with partners' capitals" }
              ],
              working: "Cash is the pool, never an asset to realise. Third-party assets, loans and even the unrecorded ₹6,000 interest pass through realisation. A partner's loan and fictitious assets never fetch cash, so they are settled directly — the loan in the order of payment and the fictitious asset through the partners' capitals in the profit-sharing ratio."
            },
            {
              title: "Statement 9 — Every disposal has its own value",
              prompt: "Different ways of disposing of the same class of assets reach the realisation credit at different values. Decide, and enter the amount credited.",
              needsAmount: true,
              rows: [
                { label: "Debts of ₹80,000 sold to a debt collector for ₹60,000", options: ["At the cash realised", "At the value agreed with the partner", "Nothing is credited"], answer: "At the cash realised", amount: 60000 },
                { label: "Stock of ₹50,000 taken over by partner J at ₹45,000", options: ["At the cash realised", "At the value agreed with the partner", "Nothing is credited"], answer: "At the value agreed with the partner", amount: 45000 },
                { label: "Building of book value ₹3,00,000 transferred to a creditor in settlement of his claim of ₹2,80,000", options: ["At the cash realised", "At the value agreed with the creditor", "Nothing is credited"], answer: "At the value agreed with the creditor", amount: 280000 },
                { label: "Trade receivables of ₹25,000 whose debtor has become insolvent — nothing is recovered", options: ["At the cash realised", "At the value agreed with the partner", "Nothing is credited"], answer: "Nothing is credited", amount: 0 },
                { label: "Inventory of ₹40,000 sold in the market for ₹44,000", options: ["At the cash realised", "At the value agreed with the partner", "Nothing is credited"], answer: "At the cash realised", amount: 44000 }
              ],
              working: "Cash sales credit the realised figure (₹60,000, ₹44,000); a takeover credits the agreed value (₹45,000 to J, ₹2,80,000 for the creditor's claim); the insolvent debt brings in <b>nothing</b>, so its full book ₹25,000 worsens the result."
            },
            {
              title: "Statement 10 — Following the cash trail",
              prompt: "The firm starts with ₹35,000 at the bank and every transaction below settles through that account. Enter each movement and the balance before partners are paid.",
              needsAmount: true,
              rows: [
                { label: "Opening cash at bank", options: ["Added to bank", "Deducted from bank", "Not recorded"], answer: "Added to bank", amount: 35000 },
                { label: "Assets realised into the bank account — ₹2,10,000", options: ["Added to bank", "Deducted from bank", "Not recorded"], answer: "Added to bank", amount: 210000 },
                { label: "Trade payables of ₹1,40,000 paid by cheque", options: ["Added to bank", "Deducted from bank", "Not recorded"], answer: "Deducted from bank", amount: 140000 },
                { label: "Realisation expenses of ₹8,000 paid by cheque", options: ["Added to bank", "Deducted from bank", "Not recorded"], answer: "Deducted from bank", amount: 8000 },
                { label: "Partner Q's loan of ₹25,000 repaid", options: ["Added to bank", "Deducted from bank", "Not recorded"], answer: "Deducted from bank", amount: 25000 },
                { label: "Bank balance before the partners' capital are paid", options: ["₹72,000", "₹35,000", "₹68,000"], answer: "₹72,000", amount: 72000 }
              ],
              working: "35,000 + 2,10,000 − 1,40,000 − 8,000 − 25,000 = <b>₹72,000</b>. Expenses rank first and the loan second, so both were already met before this balance was struck; the ₹72,000 now goes to the partners' capital claims."
            }
          ]
        },

        /* ---- Exam cases (existing ids are 1) ---- */
        examCases: [
          {
            id: 2,
            title: "Takeovers at agreed values",
            passage: "Nisha and Karan dissolve their firm sharing profits 2:1. Trade receivables of ₹1,80,000 (book) are taken over by Nisha at ₹1,50,000 in part settlement of her claim; the building (book ₹3,00,000) realises ₹3,30,000; inventory of ₹1,20,000 realises ₹1,00,000. Trade payables of ₹2,00,000 (book) are settled for ₹1,90,000, an unrecorded liability of ₹20,000 is also paid, and realisation expenses come to ₹10,000. Before dissolution, capitals stood at ₹4,00,000 (Nisha) and ₹2,50,000 (Karan), with a General Reserve of ₹90,000 and no loans.",
            difficulty: "Hard",
            subs: [
              {
                q: "What is the total credited to the realisation account?",
                options: ["₹5,80,000", "₹6,00,000", "₹5,30,000", "₹6,20,000"],
                answerIndex: 0,
                reasoning: "Liabilities transferred 2,00,000 + building realised 3,30,000 + inventory realised 1,00,000 + receivables taken over 1,50,000 = ₹5,80,000. The unrecorded liability is only debited when paid, never having been transferred."
              },
              {
                q: "What is the total debited to the realisation account?",
                options: ["₹8,20,000", "₹8,00,000", "₹5,80,000", "₹8,10,000"],
                answerIndex: 0,
                reasoning: "Assets transferred 1,80,000 + 3,00,000 + 1,20,000 = ₹6,00,000, plus liabilities paid 1,90,000, the unrecorded liability 20,000 and expenses 10,000 → ₹8,20,000."
              },
              {
                q: "The firm incurs on realisation:",
                options: ["A loss of ₹2,40,000", "A profit of ₹2,40,000", "A loss of ₹20,000", "A loss of ₹40,000"],
                answerIndex: 0,
                reasoning: "Debits ₹8,20,000 − credits ₹5,80,000 = ₹2,40,000 loss, shared 2:1."
              },
              {
                q: "What cash is finally paid to Nisha against her capital?",
                options: ["₹1,50,000", "₹3,00,000", "₹2,40,000", "₹1,20,000"],
                answerIndex: 0,
                reasoning: "4,00,000 capital + 60,000 reserve share (2/3 of 90,000) − 1,60,000 loss share (2/3 of 2,40,000) − 1,50,000 for the receivables she took over = ₹1,50,000."
              },
              {
                q: "What cash is finally paid to Karan against his capital?",
                options: ["₹1,90,000", "₹2,80,000", "₹2,50,000", "₹2,20,000"],
                answerIndex: 0,
                reasoning: "2,50,000 capital + 30,000 reserve share − 80,000 loss share (1/3 of 2,40,000) = ₹1,90,000."
              }
            ]
          },
          {
            id: 3,
            title: "The last of the cash",
            passage: "Falguni and Ravi wind up their firm sharing profits 3:1. After realisation the firm holds ₹1,45,000 in the bank. Realisation expenses of ₹15,000 are still to be paid, Ravi has lent the firm ₹40,000, every outside liability was already settled out of earlier receipts, and the partners' capital accounts stand at ₹2,50,000 (Falguni) and ₹1,10,000 (Ravi) after recording the realisation result and their share of reserves.",
            difficulty: "Hard",
            subs: [
              {
                q: "How much cash goes towards the realisation expenses?",
                options: ["₹15,000", "₹40,000", "₹1,30,000", "₹1,45,000"],
                answerIndex: 0,
                reasoning: "The cost of winding up is met first from the ₹1,45,000, so ₹15,000 is paid before any partner sees a rupee."
              },
              {
                q: "What cash remains for the partners' loans and capital after the expenses?",
                options: ["₹1,30,000", "₹1,45,000", "₹90,000", "₹1,15,000"],
                answerIndex: 0,
                reasoning: "1,45,000 − 15,000 = ₹1,30,000 — expenses always precede even a partner's loan."
              },
              {
                q: "What cash is left for the capital claims once Ravi's loan is repaid?",
                options: ["₹90,000", "₹1,30,000", "₹50,000", "₹1,45,000"],
                answerIndex: 0,
                reasoning: "The loan ranks second: 1,30,000 − 40,000 = ₹90,000 remains for the two capital claims."
              },
              {
                q: "What deficiency arises on the capital claims?",
                options: ["₹2,70,000", "₹3,60,000", "₹90,000", "₹2,25,000"],
                answerIndex: 0,
                reasoning: "Claims of 2,50,000 + 1,10,000 = ₹3,60,000 against ₹90,000 of cash → ₹2,70,000 deficiency, shared 3:1."
              },
              {
                q: "What cash does Ravi finally collect against his capital?",
                options: ["₹42,500", "₹67,500", "₹1,10,000", "₹40,000"],
                answerIndex: 0,
                reasoning: "Ravi bears 1/4 of the ₹2,70,000 deficiency = ₹67,500, so he collects 1,10,000 − 67,500 = ₹42,500, over and above the ₹40,000 loan paid to him earlier."
              }
            ]
          }
        ],

        /* ---- Short exam numericals (existing ids are 1) ---- */
        examNumericals: [
          {
            id: 2,
            q: "On dissolution, assets of book value ₹6,00,000 are taken over by a partner at ₹3,50,000 and the remaining assets of book value ₹2,00,000 realise ₹1,75,000; liabilities of book value ₹1,80,000 are paid ₹1,72,000; expenses are ₹8,000. Find the loss on realisation (₹).",
            value: 75000,
            explanation: "Debits 6,00,000 + 2,00,000 + 1,72,000 + 8,000 = ₹7,80,000; credits 1,80,000 + 3,50,000 + 1,75,000 = ₹7,05,000 → loss ₹75,000.",
            difficulty: "Medium"
          },
          {
            id: 3,
            q: "Cash of ₹1,00,000 stands with the firm after every outside liability is met. Realisation expenses of ₹10,000 are due, a partner has lent the firm ₹20,000, and the capitals are ₹90,000 (P) and ₹60,000 (Q) with profits shared 3:2. Compute the cash finally paid to Q towards his capital claim (₹).",
            value: 28000,
            explanation: "Cash for capital = 1,00,000 − 10,000 − 20,000 = ₹70,000 against claims of ₹1,50,000 → deficiency ₹80,000 shared 3:2, so Q bears ₹32,000 and collects 60,000 − 32,000 = ₹28,000 (P receives 90,000 − 48,000 = ₹42,000; 28,000 + 42,000 = ₹70,000 ✓).",
            difficulty: "Hard"
          },
          {
            id: 4,
            q: "Cash of ₹60,000 is left after settling all outside liabilities. Realisation expenses of ₹10,000 are due, partner E has lent the firm ₹20,000, and the capitals are ₹1,50,000 (E) and ₹1,00,000 (F) with profits shared 3:2. Compute the cash finally paid to E towards his capital claim (₹).",
            value: 18000,
            explanation: "Cash for capital = 60,000 − 10,000 − 20,000 = ₹30,000 against claims of ₹2,50,000 → deficiency ₹2,20,000, of which E bears 3/5 = ₹1,32,000; E collects 1,50,000 − 1,32,000 = ₹18,000 (F receives the remaining ₹12,000).",
            difficulty: "Hard"
          }
        ]
      },
      /* ---------- Chapter 7 extension: Accounting for Share Capital ---------- */
      sc: {
        /* ---- Practice Bank (merged with existing ids 1–10) ---- */
        numericals: [
          {
            id: 11, difficulty: "Medium",
            question: "Shares of ₹10 each at par were applied for by the public for 30,000 shares against an offer of 20,000 shares. Applications were accepted pro rata. An applicant for 1,500 shares was allotted:",
            options: ["1,000 shares", "1,500 shares", "750 shares", "500 shares"],
            answerIndex: 0,
            explanation: "Allotment runs in proportion: 20,000 ÷ 30,000 = 2/3, so 1,500 × 2/3 = 1,000 shares. Allowing the full 1,500 would allot the offer twice over."
          },
          {
            id: 12, difficulty: "Easy",
            question: "Applications for 26,000 shares poured in against an offer of 20,000 shares of ₹10 each at par. The excess is rejected and the application money is ₹5 per share. The amount refunded on rejection is:",
            options: ["₹30,000", "₹1,00,000", "₹1,30,000", "₹20,000"],
            answerIndex: 0,
            explanation: "6,000 rejected applications × ₹5 = ₹30,000 is returned; the ₹1,30,000 trap counts the whole issue, and the ₹1,00,000 figure is the application money on the shares actually allotted."
          },
          {
            id: 13, difficulty: "Hard",
            question: "A company issued 10,000 shares of ₹10 each at par, payable ₹4 on application and ₹6 on allotment. Applications for 15,000 shares were received; allotment was pro rata and the entire surplus was retained against allotment. An applicant for 1,200 shares now pays on allotment:",
            options: ["₹3,200", "₹4,800", "₹1,600", "₹7,200"],
            answerIndex: 0,
            explanation: "Allotted 1,200 × 10/15 = 800 shares. He paid 1,200 × 4 = ₹4,800 against an application demand of 800 × 4 = ₹3,200, so ₹1,600 is retained; allotment is 800 × 6 = ₹4,800 less ₹1,600 = ₹3,200 payable."
          },
          {
            id: 14, difficulty: "Medium",
            question: "2,000 shares of ₹10 each were issued; ₹7 per share was called up. A holder of 400 shares paid only ₹4 per share and the shares were forfeited. The amount credited to Share Forfeited A/c is:",
            options: ["₹1,600", "₹2,800", "₹4,000", "₹1,200"],
            answerIndex: 0,
            explanation: "Forfeiture takes exactly what was paid: 400 × ₹4 = ₹1,600. Share Capital is debited the called-up ₹2,800 and ₹1,200 goes to calls in arrears; debiting the face value of ₹4,000 is the classic slip."
          },
          {
            id: 15, difficulty: "Hard",
            question: "A shareholder holding 500 shares of ₹10 each, on which ₹8 per share had been called up and ₹6 per share paid, defaulted and the shares were forfeited. 300 of these shares were reissued at ₹9 per share as fully paid. The capital reserve on that reissue is:",
            options: ["₹1,500", "₹1,800", "₹300", "₹2,000"],
            answerIndex: 0,
            explanation: "The 300 reissued shares carry 300 × ₹6 = ₹1,800 forfeited; the reissue at ₹9 costs 300 × ₹1 = ₹300 of discount, leaving ₹1,500 to capital reserve."
          },
          {
            id: 16, difficulty: "Easy",
            question: "Which of the following statements about a share is correct?",
            options: ["A share is a proportionate claim on the company's profits and residual assets, not a debt of the company", "A share is a loan of the company repayable on a fixed date", "A share always carries one vote for every ₹10 held", "A share is a certificate acknowledging a debt with fixed interest"],
            answerIndex: 0,
            explanation: "A share represents ownership: it carries a claim on divisible profits and, on winding up, on residual assets. The other options describe a debenture, which is debt rather than capital."
          },
          {
            id: 17, difficulty: "Medium",
            question: "5,000 shares of ₹10 each at par are payable ₹5 on application, ₹3 on allotment and ₹2 on the first call. A holder of 1,000 shares deposits ₹8 per share with the application itself. When the allotment is made due, the amount transferred out of calls in advance is:",
            options: ["₹3,000", "₹8,000", "₹5,000", "₹1,000"],
            answerIndex: 0,
            explanation: "He deposited 1,000 × ₹8 = ₹8,000 of which ₹5,000 is application money; the extra ₹3 per share = ₹3,000 is calls in advance and moves to the allotment account only when that instalment is made due."
          },
          {
            id: 18, difficulty: "Medium",
            question: "When a company makes the allotment money due on its shares, the correct entry is:",
            options: ["Share Allotment A/c Dr to Share Capital A/c, with Securities Premium Reserve A/c credited when issued at a premium", "Bank A/c Dr to Share Capital A/c", "Share Capital A/c Dr to Share Allotment A/c", "Share Application A/c Dr to Share Allotment A/c"],
            answerIndex: 0,
            explanation: "The due entry creates the receivable and raises capital — Share Allotment is debited and Share Capital credited (premium split to Securities Premium Reserve). Bank is debited only when the money is actually received."
          },
          {
            id: 19, difficulty: "Easy",
            question: "Which of these is NOT part of the company's share capital?",
            options: ["Securities Premium Reserve", "Subscribed capital", "Called-up capital", "Paid-up capital"],
            answerIndex: 0,
            explanation: "Premium collected over and above face value is a separate reserve with its own statutory restrictions; the capital ladder runs authorised → issued → subscribed → called-up → paid-up, all at face value terms."
          },
          {
            id: 20, difficulty: "Hard",
            question: "A company issued 5,000 shares of ₹10 each at par. ₹6 per share was called on allotment and ₹4 on the first and final call. A holder of 800 shares paid only ₹3 on allotment, never paid the call, and was forfeited. Later 500 of those shares were reissued at ₹9 as fully paid. The capital reserve on reissue is:",
            options: ["₹1,000", "₹1,500", "₹500", "₹2,400"],
            answerIndex: 0,
            explanation: "Each forfeited share carries ₹3 paid, so the 500 reissued shares hold 500 × ₹3 = ₹1,500; the ₹1 discount per share (₹500) is met from that amount, leaving ₹1,000 to capital reserve."
          },
          {
            id: 21, difficulty: "Medium",
            question: "Arin Ltd. issued 20,000 shares of ₹10 each at ₹12, payable ₹5 on application, ₹4 on allotment (including premium) and ₹3 on first call. Applications for 25,000 shares were received and the excess was rejected; a holder of 2,000 shares later failed to pay the first call. The amount credited to Securities Premium Reserve is:",
            options: ["₹40,000", "₹50,000", "₹34,000", "₹20,000"],
            answerIndex: 0,
            explanation: "Only allotted shares create premium: 20,000 × ₹2 = ₹40,000. The rejected 5,000 applications never reach capital, and the defaulter's ₹6,000 first-call arrears (2,000 × ₹3) is a separate receivable that does not touch the premium."
          },
          {
            id: 22, difficulty: "Easy",
            question: "A first call of ₹3 per share was made on 15,000 shares. The holders of 500 shares and of 300 shares did not pay. Calls in arrears amount to:",
            options: ["₹2,400", "₹4,500", "₹800", "₹5,400"],
            answerIndex: 0,
            explanation: "Arrears = (500 + 300) × ₹3 = ₹2,400 — the unpaid call money of every defaulter added together; no interest is charged in this course."
          },
          {
            id: 23, difficulty: "Medium",
            question: "A company acquired machinery valued at ₹8,00,000 from a vendor and issued 8,000 equity shares of ₹100 each, fully paid, against it. The entry credits:",
            options: ["Share Capital A/c with ₹8,00,000 — the agreed value of the consideration received", "Securities Premium Reserve A/c with ₹8,00,000", "The vendor's loan account with ₹8,00,000", "Share Capital only when cash is received from the vendor"],
            answerIndex: 0,
            explanation: "Consideration other than cash is recorded at the agreed value of what the company received: Machinery Dr ₹8,00,000 to Share Capital ₹8,00,000, with no premium arising because the shares are treated as issued at that agreed value."
          },
          {
            id: 24, difficulty: "Hard",
            question: "A company issued 20,000 shares of ₹10 each at par, payable ₹5 on application, ₹3 on allotment and ₹2 on first call. One shareholder holding 1,000 shares paid the full ₹10 with the application, and a holder of 500 shares never paid the first call. The cash the company actually receives when the first call is made and collected is:",
            options: ["₹37,000", "₹40,000", "₹38,000", "₹43,000"],
            answerIndex: 0,
            explanation: "First call due 20,000 × ₹2 = ₹40,000, less ₹2,000 already held for that shareholder as calls in advance and ₹1,000 left unpaid by the defaulter (500 × ₹2) → ₹37,000 in cash."
          },
          {
            id: 25, difficulty: "Easy",
            question: "On receipt of application money from the public, the correct entry is:",
            options: ["Bank A/c Dr to Share Application A/c", "Share Application A/c Dr to Share Capital A/c", "Bank A/c Dr to Share Capital A/c", "Share Allotment A/c Dr to Bank A/c"],
            answerIndex: 0,
            explanation: "Money first arrives in the bank and waits in Share Application A/c; the transfer to Share Capital (and Securities Premium Reserve) comes only when allotment is decided."
          }
        ],

        /* ---- Interactive journal lab (engine strings copied verbatim
               from data-12c.js; only the case list grows) ---- */
        activity: {
          type: "journal",
          title: "Share Capital Journal Lab",
          instruction: "Issue at par: 5,000 shares of ₹12 each, payable ₹5 on application, ₹4 on allotment, ₹3 on first call. One shareholder deposits ₹1,000 in advance before the first call; a holder of 500 shares defaults on the first call and pays the arrears later. Build each entry — debit, credit and amount — and verify.",
          entries: [
            {
              prompt: "Another shareholder, holding 400 shares, never paid the allotment money and, after notice, the company forfeits those shares — only ₹5 per share on application had been received.",
              dr: ["Share Capital A/c", "Share Forfeited A/c", "Calls in Arrears A/c", "Share Allotment A/c"],
              cr: ["Share Forfeited A/c", "Calls in Arrears A/c", "Share Capital A/c", "Share Allotment A/c"],
              drAccount: "Share Capital A/c", crAccount: "Share Forfeited A/c", amount: 3600,
              note: "Called-up at forfeiture = application ₹5 + allotment ₹4 = ₹9 per share, so Share Capital is debited 400 × ₹9 = ₹3,600; the ₹5 paid (₹2,000) is forfeited and the ₹4 unpaid (₹1,600) clears calls in arrears."
            },
            {
              prompt: "200 of those forfeited shares are reissued at ₹10 per share as fully paid.",
              dr: ["Bank A/c", "Share Forfeited A/c", "Share Capital A/c", "Capital Reserve A/c"],
              cr: ["Share Capital A/c", "Share Forfeited A/c", "Bank A/c", "Capital Reserve A/c"],
              drAccount: "Bank A/c", crAccount: "Share Capital A/c", amount: 2000,
              note: "Reissue at par brings in 200 × ₹10 = ₹2,000; Share Capital is credited with the full face value of the reissued shares."
            },
            {
              prompt: "The forfeited amount relating to those 200 reissued shares is transferred to Capital Reserve.",
              dr: ["Share Forfeited A/c", "Capital Reserve A/c", "Share Capital A/c", "Bank A/c"],
              cr: ["Capital Reserve A/c", "Share Forfeited A/c", "Share Capital A/c", "Bank A/c"],
              drAccount: "Share Forfeited A/c", crAccount: "Capital Reserve A/c", amount: 1000,
              note: "Each of those shares carried ₹5 forfeited, so 200 × ₹5 = ₹1,000 moves to Capital Reserve; a reissue at par used none of it as discount."
            },
            {
              prompt: "The remaining 200 forfeited shares are reissued at ₹9 per share as fully paid.",
              dr: ["Bank A/c", "Share Forfeited A/c", "Share Capital A/c", "Calls in Arrears A/c"],
              cr: ["Share Capital A/c", "Share Forfeited A/c", "Bank A/c", "Capital Reserve A/c"],
              drAccount: "Bank A/c", crAccount: "Share Capital A/c", amount: 1800,
              note: "Bank receives 200 × ₹9 = ₹1,800 and the ₹1 per share discount (₹200) is met from the ₹1,000 forfeited on these very shares; Share Capital is still credited with the full ₹2,000 face value."
            }
          ]
        },
        /* ---- Exam cases (existing ids are 1 and 2) ---- */
        examCases: [
          {
            id: 3,
            title: "Pro-rata allotment with a defaulter",
            passage: "Veda Ltd. offered 10,000 equity shares of ₹10 each at par, payable ₹4 on application, ₹3 on allotment and ₹3 on the first and final call. Applications for 20,000 shares arrived and the company accepted them pro rata, adjusting the surplus application money against the later instalments. Meera, who had applied for 1,400 shares, paid her allotment from the surplus but never paid the call; her shares were forfeited, and 400 of the forfeited shares were later reissued at ₹9 as fully paid.",
            difficulty: "Hard",
            subs: [
              {
                q: "How many shares was Meera allotted?",
                options: ["700 shares", "1,400 shares", "350 shares", "1,000 shares"],
                answerIndex: 0,
                reasoning: "Applications exceeded the offer two to one, so the allotment ratio is 1/2 — 1,400 × 1/2 = 700 shares."
              },
              {
                q: "How much money had Meera paid to the company before defaulting?",
                options: ["₹5,600", "₹2,800", "₹8,400", "₹7,000"],
                answerIndex: 0,
                reasoning: "She sent 1,400 × ₹4 = ₹5,600 with the application; of this ₹2,800 was the application money on her 700 shares and the surplus ₹2,800 was absorbed against allotment ₹2,100 and the call ₹700. Nothing further ever came."
              },
              {
                q: "How much was unpaid on the first and final call after the surplus was adjusted?",
                options: ["₹1,400", "₹2,100", "₹700", "₹2,800"],
                answerIndex: 0,
                reasoning: "Call due 700 × ₹3 = ₹2,100, of which ₹700 came from the surplus application money — ₹1,400 was never paid."
              },
              {
                q: "What amount is credited to Share Forfeited A/c when her shares are forfeited?",
                options: ["₹5,600", "₹7,000", "₹1,400", "₹2,800"],
                answerIndex: 0,
                reasoning: "Forfeiture takes exactly what she paid — ₹5,600. Share Capital is debited the called-up ₹7,000 (700 × ₹10) and ₹1,400 clears calls in arrears."
              },
              {
                q: "What capital reserve arises on the reissue of 400 shares at ₹9?",
                options: ["₹2,800", "₹3,200", "₹400", "₹5,600"],
                answerIndex: 0,
                reasoning: "Those shares carry 400 × ₹8 = ₹3,200 forfeited (₹5,600 ÷ 700 = ₹8 per share); the ₹1 per share discount (₹400) leaves ₹2,800 to capital reserve."
              }
            ]
          },
          {
            id: 4,
            title: "An advancer and a defaulter",
            passage: "Arin Ltd. issued 20,000 equity shares of ₹10 each at a premium of ₹2, payable ₹5 on application, ₹4 on allotment (including the premium) and ₹3 on first call. The issue was fully subscribed. Riya, holding 1,000 shares, paid ₹6 per share with the application — a rupee more than was due — and later paid her allotment in full, but never paid the first call. Every other shareholder paid every instalment on time.",
            difficulty: "Medium",
            subs: [
              {
                q: "What total cash arrived with the applications?",
                options: ["₹1,01,000", "₹1,00,000", "₹1,06,000", "₹95,000"],
                answerIndex: 0,
                reasoning: "19,000 shares × ₹5 = ₹95,000 plus Riya's 1,000 × ₹6 = ₹6,000 gives ₹1,01,000; quoting the plain ₹5 rate on 20,000 shares misses her extra rupee."
              },
              {
                q: "How is Riya's extra ₹1 per share recorded?",
                options: ["Calls in advance ₹1,000", "Securities Premium Reserve ₹1,000", "Share Forfeited ₹1,000", "Refunded immediately"],
                answerIndex: 0,
                reasoning: "Money received beyond what is currently due is calls in advance: 1,000 × ₹1 = ₹1,000, moved to the allotment account when that instalment fell due."
              },
              {
                q: "What amount is credited to Securities Premium Reserve at allotment?",
                options: ["₹40,000", "₹20,000", "₹80,000", "₹60,000"],
                answerIndex: 0,
                reasoning: "Premium of ₹2 on the 20,000 allotted shares = ₹40,000; the premium rides with allotment, never with application."
              },
              {
                q: "What cash does the company receive on allotment?",
                options: ["₹79,000", "₹80,000", "₹81,000", "₹1,00,000"],
                answerIndex: 0,
                reasoning: "Allotment due 20,000 × ₹4 = ₹80,000, less the ₹1,000 already held as calls in advance from Riya → ₹79,000 in cash."
              },
              {
                q: "What calls in arrears arise on the first call?",
                options: ["₹3,000", "₹6,000", "₹1,000", "₹4,000"],
                answerIndex: 0,
                reasoning: "Only Riya defaults: 1,000 × ₹3 = ₹3,000 goes to calls in arrears, while the other 19,000 shares pay ₹57,000 in cash."
              }
            ]
          }
        ],

        /* ---- Short exam numericals (existing ids are 1 and 2) ---- */
        examNumericals: [
          {
            id: 3,
            q: "A company offered shares of ₹10 each at par payable ₹4 on application and ₹3 on allotment. Applications for 25,000 shares came against an offer of 15,000 shares and were accepted pro rata. An applicant for 1,200 shares was allotted in proportion. Find the surplus application money retained against allotment from him (₹).",
            value: 1920,
            explanation: "Allotted 1,200 × 15,000/25,000 = 720 shares. Application paid 1,200 × ₹4 = ₹4,800 against 720 × ₹4 = ₹2,880 due → surplus ₹1,920 retained and set against his allotment of 720 × ₹3 = ₹2,160.",
            difficulty: "Medium"
          },
          {
            id: 4,
            q: "1,200 shares of ₹10 each, fully called up, on which only ₹6 per share was paid, were forfeited. Later 800 of them were reissued at ₹9 and the remaining 400 at ₹10, all as fully paid. Find the total capital reserve (₹).",
            value: 6400,
            explanation: "First batch: 800 × ₹6 = ₹4,800 forfeited less discount 800 × ₹1 = ₹800 → ₹4,000. Second batch: 400 × ₹6 = ₹2,400 with no discount → ₹2,400. Total capital reserve = 4,000 + 2,400 = ₹6,400.",
            difficulty: "Hard"
          },
          {
            id: 5,
            q: "A company's issued capital is ₹4,00,000 in shares of ₹10 each, and the public applied for 48,000 shares. How many shares will be allotted?",
            value: 40000,
            explanation: "The offer is 4,00,000 ÷ ₹10 = 40,000 shares, so 40,000 shares are allotted and the excess 8,000 shares are rejected (or the issue proceeds with the minimum subscription met).",
            difficulty: "Easy"
          }
        ]
      },
    },

    /* ============ QUIZ (ids 70206–70235) ============ */
    quiz: [
      { id: 70206, chapter: "dis", difficulty: "Easy",
        q: "An unrecorded asset of ₹20,000 is discovered during dissolution and sold for ₹18,000. The realisation account is:",
        options: ["Credited ₹18,000 — the proceeds are realised even though the asset was never transferred", "Credited ₹20,000 — its notional value", "Debited ₹18,000 — a cost of winding up", "Left completely untouched"],
        answerIndex: 0,
        explanation: "Nothing left the books, so there is no debit — but the ₹18,000 the asset fetches is a pure credit to realisation, boosting the profit by that figure." },
      { id: 70207, chapter: "dis", difficulty: "Medium",
        q: "A liability of ₹12,000 that is missing from the books is settled during dissolution. The realisation account is:",
        options: ["Debited ₹12,000 — paying an unrecorded liability is a fresh cost of winding up", "Credited ₹12,000 — a gain for the firm", "Left untouched, because the liability was never recorded", "Debited only with the partners' share of it"],
        answerIndex: 0,
        explanation: "Unrecorded or not, the ₹12,000 had to be paid, and every payment of a firm liability debits realisation — reducing the profit shared by the partners." },
      { id: 70208, chapter: "dis", difficulty: "Easy",
        q: "A firm dissolves carrying a bank overdraft of ₹30,000. This balance is:",
        options: ["A liability — repaying it debits the realisation account", "Excluded from realisation, like a positive bank balance", "Shared between the partners as an accumulated profit", "Ignored, because it nets off against the cash in hand"],
        answerIndex: 0,
        explanation: "₹30,000 owed to the bank is a third-party claim settled like any other liability; only a positive cash or bank balance is kept out of realisation." },
      { id: 70209, chapter: "dis", difficulty: "Medium",
        q: "When a partner takes over an asset at an agreed value, the realisation account is:",
        options: ["Credited with the agreed value, and the partner's capital is debited with the same amount", "Debited with the agreed value, and the partner's capital credited", "Credited with the book value whatever the agreement says", "Not involved — the entry goes straight to cash"],
        answerIndex: 0,
        explanation: "The partner pays out of his claim on the firm: his capital is debited and realisation is credited with the agreed value, so a value below book simply leaves a poorer realisation result." },
      { id: 70210, chapter: "dis", difficulty: "Hard",
        q: "Assets of book value ₹4,00,000 realise ₹3,60,000; liabilities of book value ₹2,00,000 are paid ₹1,95,000; expenses are ₹10,000; a partner has lent the firm ₹25,000. Capitals are ₹2,50,000 (A) and ₹1,50,000 (B), sharing profits 3:2. What does A finally receive in cash?",
        options: ["₹2,23,000", "₹2,50,000", "₹2,77,000", "₹2,05,000"],
        answerIndex: 0,
        explanation: "Loss = (4,00,000 + 1,95,000 + 10,000) − (2,00,000 + 3,60,000) = ₹45,000, of which A bears 3/5 = ₹27,000, so A collects 2,50,000 − 27,000 = ₹2,23,000 after the loan and outside claims are met first." },
      { id: 70211, chapter: "dis", difficulty: "Easy",
        q: "General Reserve of ₹75,000 stands in the books at dissolution; partners share profits 2:3. It is credited to their capitals as:",
        options: ["₹30,000 and ₹45,000", "₹37,500 each", "₹45,000 and ₹30,000", "A credit to the realisation account"],
        answerIndex: 0,
        explanation: "Accumulated profits are shared in the old profit-sharing ratio: 75,000 × 2/5 = ₹30,000 and 75,000 × 3/5 = ₹45,000, credited before the final cash division." },
      { id: 70212, chapter: "dis", difficulty: "Medium",
        q: "Partner Z agreed to bear the firm's realisation expenses of ₹9,000 himself. The firm's books record:",
        options: ["Realisation debited ₹9,000 and Z's capital credited ₹9,000", "Z's capital debited ₹9,000 and bank credited ₹9,000", "Realisation credited ₹9,000", "Nothing at all, because no cash left the firm"],
        answerIndex: 0,
        explanation: "Even when a partner bears the cost, the firm records it: the ₹9,000 is a realisation debit and the firm owes Z that amount, credited to his capital." },
      { id: 70213, chapter: "dis", difficulty: "Medium",
        q: "After every claim has been settled and the partners paid, the cash/bank account of the dissolved firm shows:",
        options: ["Nil — the account is emptied by construction", "The balance of the General Reserve", "The last year's profit", "A debit balance equal to the realisation loss"],
        answerIndex: 0,
        explanation: "Dissolution divides the entire pool: expenses, loans, outside liabilities and finally the partners' capitals absorb every rupee, so cash closes at exactly zero." },
      { id: 70214, chapter: "dis", difficulty: "Hard",
        q: "The firm holds opening cash of ₹15,000 against a bank overdraft of ₹5,000. Assets realise ₹2,00,000; liabilities of ₹1,10,000 are paid; expenses are ₹6,000. The cash available for the partners' loans and capital is:",
        options: ["₹94,000", "₹99,000", "₹89,000", "₹1,04,000"],
        answerIndex: 0,
        explanation: "15,000 − 5,000 + 2,00,000 − 1,10,000 − 6,000 = ₹94,000. Treating the overdraft as money available wrongly gives ₹99,000, and ignoring it twice gives ₹89,000." },
      { id: 70215, chapter: "dis", difficulty: "Medium",
        q: "₹15,000 is due from a partner to the firm on an old account when the firm dissolves. This amount is:",
        options: ["Adjusted directly against that partner's capital — it never passes through realisation", "Credited to the realisation account", "Paid to the outside creditors ahead of everything", "Shared between all partners in the profit-sharing ratio"],
        answerIndex: 0,
        explanation: "Mutual dues are settled between the firm and that partner: the ₹15,000 is debited to his capital account, reducing what he finally receives; only third-party items drive realisation." },
      { id: 70216, chapter: "dis", difficulty: "Easy",
        q: "The firm's unrecorded goodwill is valued at ₹60,000 when it dissolves, but no buyer will pay for it. The realisation account receives:",
        options: ["Nothing for the goodwill — only money actually realised is credited", "A credit of ₹60,000", "A debit of ₹60,000", "A credit of ₹30,000"],
        answerIndex: 0,
        explanation: "Goodwill earns the firm nothing on winding up unless someone pays for it — the ₹60,000 valuation on its own brings no cash and therefore no realisation credit." },
      { id: 70217, chapter: "dis", difficulty: "Hard",
        q: "A creditor holding a claim of ₹36,000 takes over goods of book value ₹40,000 in full settlement. The effect on the realisation account is:",
        options: ["₹40,000 debited as the goods given up and ₹36,000 credited as the claim settled — a ₹4,000 drag on the result", "Only ₹4,000 is recorded, being the difference", "₹36,000 debited and ₹40,000 credited — a ₹4,000 gain", "Nothing is recorded until cash changes hands"],
        answerIndex: 0,
        explanation: "The goods had already reached realisation's debit at ₹40,000; knocking off the ₹36,000 claim credits realisation with that amount, so the firm ends ₹4,000 worse off than the book figures suggest." },
      { id: 70218, chapter: "dis", difficulty: "Hard",
        q: "Capitals are ₹2,50,000 (P) and ₹1,50,000 (Q) sharing profits 3:2, General Reserve is ₹1,00,000 and the realisation loss is ₹80,000. The total cash finally paid to P is:",
        options: ["₹2,62,000", "₹3,10,000", "₹2,10,000", "₹2,50,000"],
        answerIndex: 0,
        explanation: "P takes reserve 1,00,000 × 3/5 = ₹60,000 and bears loss 80,000 × 3/5 = ₹48,000, so 2,50,000 + 60,000 − 48,000 = ₹2,62,000 (Q receives 1,50,000 + 40,000 − 32,000 = ₹1,58,000)." },
      { id: 70219, chapter: "dis", difficulty: "Easy",
        q: "Every partner of a firm mutually agrees to wind up the business. This is a dissolution:",
        options: ["By agreement — the most common form, resting on the partners' own consent", "By an order of the court", "By order of the Registrar of Firms", "By the retirement of one partner alone"],
        answerIndex: 0,
        explanation: "The consent of every partner dissolves the firm without any court process; a court order is a separate route, yet the accounting once the firm dissolves is identical." },
      { id: 70220, chapter: "dis", difficulty: "Medium",
        q: "The balance of the realisation account after every item has been posted represents:",
        options: ["The profit or loss of the winding up itself, shared in the profit-sharing ratio", "The firm's profit or loss for the last trading year", "The cash available for the partners", "The market value of the firm's goodwill"],
        answerIndex: 0,
        explanation: "Realisation is a closed account for the wind-up alone — assets, liabilities, costs and proceeds — so its balance measures nothing but the gain or loss of dissolving." },

      { id: 70221, chapter: "sc", difficulty: "Easy",
        q: "Money received from the public on a share application is credited to:",
        options: ["Share Application A/c, and transferred to capital only at allotment", "Share Capital A/c directly", "Securities Premium Reserve A/c", "Calls in Advance A/c"],
        answerIndex: 0,
        explanation: "Application money waits in Share Application A/c; it becomes capital (and premium) only when the company decides to allot the shares." },
      { id: 70222, chapter: "sc", difficulty: "Medium",
        q: "An offer of 12,000 shares drew applications for 20,000 shares and allotment was made pro rata. The allotment ratio is:",
        options: ["3:5", "5:3", "1:2", "2:5"],
        answerIndex: 0,
        explanation: "12,000 ÷ 20,000 = 3/5 — every applicant receives three shares for every five applied for, which is the ratio 3:5." },
      { id: 70223, chapter: "sc", difficulty: "Medium",
        q: "Shares on which ₹6 per share had been paid (of ₹10, fully called) are forfeited, and 200 of them are reissued at ₹12 as fully paid. The excess of ₹2 per share on reissue is credited to:",
        options: ["Securities Premium Reserve A/c", "Capital Reserve A/c", "Share Forfeited A/c", "Profit and Loss A/c"],
        answerIndex: 0,
        explanation: "A reissue above face value earns a premium of 200 × ₹2 = ₹400 to Securities Premium Reserve; it never reduces the capital reserve computed from the ₹1,200 forfeited on those shares." },
      { id: 70224, chapter: "sc", difficulty: "Easy",
        q: "Of a ₹10 share, ₹8 has been called up and a holder of 500 shares has paid only ₹6. His calls in arrears are:",
        options: ["₹1,000", "₹5,000", "₹3,000", "₹6,000"],
        answerIndex: 0,
        explanation: "Arrears are measured against the called-up amount: 500 × (₹8 − ₹6) = ₹1,000. Measuring against the face value would wrongly give ₹2,000." },
      { id: 70225, chapter: "sc", difficulty: "Medium",
        q: "A company issued 10,000 shares of ₹10 each at ₹13, receiving ₹7 on application, including a premium of ₹3. When the application money is transferred at allotment, the amount credited to Securities Premium Reserve is:",
        options: ["₹30,000", "₹13,000", "₹70,000", "₹60,000"],
        answerIndex: 0,
        explanation: "The premium of ₹3 rides with application here: 10,000 × ₹3 = ₹30,000 to Securities Premium Reserve, while ₹40,000 becomes Share Capital." },
      { id: 70226, chapter: "sc", difficulty: "Easy",
        q: "A share of a company differs from a debenture mainly because it represents:",
        options: ["Ownership — a claim on profits and residual assets, not a debt", "A debt with fixed interest payable every year", "A creditor's certificate redeemable on a fixed date", "A loan repayable only on winding up"],
        answerIndex: 0,
        explanation: "A share is capital, not debt: its return is dividend from divisible profit and it ranks last on winding up, whereas a debenture carries fixed interest as a charge." },
      { id: 70227, chapter: "sc", difficulty: "Medium",
        q: "A shareholder of 1,000 shares of ₹10 each, on which ₹6 per share had been called up, paid only ₹4 per share and was forfeited. The correct forfeiture entry is:",
        options: ["Share Capital Dr ₹6,000 / to Share Forfeited ₹4,000 / to Calls in Arrears ₹2,000", "Share Capital Dr ₹10,000 / to Share Forfeited ₹4,000 / to Calls in Arrears ₹6,000", "Share Capital Dr ₹4,000 / to Share Forfeited ₹4,000", "Share Forfeited Dr ₹6,000 / to Share Capital ₹6,000"],
        answerIndex: 0,
        explanation: "Capital is debited the called-up ₹6,000, only the ₹4,000 actually paid is forfeited, and ₹2,000 of arrears is cleared; debiting the face value of ₹10,000 is the classic slip." },
      { id: 70228, chapter: "sc", difficulty: "Easy",
        q: "Preference shareholders differ from equity shareholders mainly in that they have priority in:",
        options: ["Payment of dividend and in the repayment of capital on winding up", "Voting at every general meeting", "Directing the day-to-day affairs of the company", "Claiming interest on their capital"],
        answerIndex: 0,
        explanation: "Preference carries its name from that preference — dividend first and capital back first — usually in exchange for no voting rights." },
      { id: 70229, chapter: "sc", difficulty: "Medium",
        q: "When application money is refunded to rejected applicants, the entry debits:",
        options: ["Share Application A/c, with Bank credited", "Share Capital A/c, with Bank credited", "Bank A/c, with Share Application credited", "Calls in Arrears A/c, with Bank credited"],
        answerIndex: 0,
        explanation: "The money sits in Share Application A/c — rejecting applicants empties that account, so Share Application is debited with the refund and Bank credited. Share Capital is untouched, since rejected shares never became capital." },
      { id: 70230, chapter: "sc", difficulty: "Easy",
        q: "An Employees' Stock Option Plan grants employees:",
        options: ["The right to buy shares at a predetermined price", "Free bonus shares every year", "A fixed interest on their deposits with the company", "Priority in dividend over equity shareholders"],
        answerIndex: 0,
        explanation: "An ESOP is a plan of options, not of shares: employees may buy at a price fixed in advance, which is why the scheme is meant to reward long-term value creation." },
      { id: 70231, chapter: "sc", difficulty: "Hard",
        q: "5,000 shares of ₹10 each at par, payable ₹4 on application, ₹3 on allotment and ₹3 on call, were applied for by holders of 10,000 shares and allotted pro rata. An applicant for 1,000 shares has had his surplus application money absorbed up to allotment. How much does he still owe on the call?",
        options: ["₹1,000", "₹1,500", "₹500", "₹2,000"],
        answerIndex: 0,
        explanation: "Allotted 1,000 × 1/2 = 500 shares. He paid 1,000 × ₹4 = ₹4,000 against ₹2,000 due, leaving ₹2,000 — ₹1,500 meets allotment in full and ₹500 reduces the ₹1,500 call to ₹1,000." },
      { id: 70232, chapter: "sc", difficulty: "Medium",
        q: "After a forfeiture, the balance standing in the Share Forfeited Account for shares not yet reissued is:",
        options: ["Retained until those shares are reissued — only then is the unused part sent to Capital Reserve", "Transferred to Capital Reserve on the day of forfeiture", "Credited to Securities Premium Reserve", "Paid back to the defaulting shareholder"],
        answerIndex: 0,
        explanation: "Forfeited money stays with the shares: it funds any discount when they are reissued, and only the residue of that particular batch moves to Capital Reserve on reissue." },
      { id: 70233, chapter: "sc", difficulty: "Hard",
        q: "1,000 shares of ₹10 each, fully called up, on which only ₹7 per share was paid, were forfeited. Later 600 were reissued at ₹8 and the remaining 400 at ₹10, all as fully paid. The total capital reserve is:",
        options: ["₹5,800", "₹7,000", "₹4,200", "₹1,600"],
        answerIndex: 0,
        explanation: "First batch 600 × ₹7 = ₹4,200 less discount 600 × ₹2 = ₹1,200 → ₹3,000; second batch 400 × ₹7 = ₹2,800 with no discount → ₹2,800. Together ₹5,800." },
      { id: 70234, chapter: "sc", difficulty: "Hard",
        q: "A company issued 8,000 shares of ₹10 each at par payable ₹3 on application, ₹4 on allotment and ₹3 on call. Applications for 10,000 shares were accepted pro rata and the entire surplus was adjusted against allotment. An applicant for 800 shares now pays on allotment:",
        options: ["₹2,080", "₹2,560", "₹480", "₹1,920"],
        answerIndex: 0,
        explanation: "Allotted 800 × 8/10 = 640 shares; he paid 800 × 3 = ₹2,400 against ₹1,920 due, so ₹480 is retained; allotment 640 × 4 = ₹2,560 less ₹480 = ₹2,080 payable." },
      { id: 70235, chapter: "sc", difficulty: "Hard",
        q: "Anuradha applied for 2,000 shares when a company offered 4,000 shares of ₹10 each at par, payable ₹4 on application, ₹3 on allotment and ₹3 on call; applications totalled 8,000 shares and allotment was made pro rata. After her surplus application money absorbs the allotment in full, how much does she owe on the first call?",
        options: ["₹2,000", "₹3,000", "₹0", "₹4,000"],
        answerIndex: 0,
        explanation: "Allotted 2,000 × 4,000/8,000 = 1,000 shares. Surplus = 2,000 × ₹4 − 1,000 × ₹4 = ₹4,000, of which ₹3,000 meets allotment in full and ₹1,000 reduces the ₹3,000 call to ₹2,000." }
    ],

    /* ============ FLASHCARDS (ids 71165–71188) ============ */
    flashcards: [
      { id: 71165, chapter: "dis", front: "How is realisation credited when a partner takes over an asset?", back: "With the agreed value, not the book value — and the partner's capital is debited with the same amount. A value below book simply worsens the realisation result." },
      { id: 71166, chapter: "dis", front: "Treatment of an unrecorded liability at dissolution?", back: "It is paid like any other and realisation is debited with the payment — nothing had been provided for it, so the whole amount is a fresh cost of winding up." },
      { id: 71167, chapter: "dis", front: "Is a bank overdraft kept out of realisation like cash?", back: "No. An overdraft is money owed to the bank — a third-party liability settled through a realisation debit. Only positive cash and bank balances are excluded." },
      { id: 71168, chapter: "dis", front: "Who bears a shortage of cash while paying partners?", back: "The partners themselves, in the profit-sharing ratio. The unpaid part of each capital claim is a deficiency statement — a loss for the owners, not a firm expense." },
      { id: 71169, chapter: "dis", front: "Where does a General Reserve go at dissolution?", back: "Into the partners' capital accounts in the profit-sharing ratio, before the final cash division — the closing balance sheet starts with every reserve distributed." },
      { id: 71170, chapter: "dis", front: "A partner pays the firm's realisation expenses — what does the firm record?", back: "Realisation is debited with the amount and that partner's capital (or loan) is credited, because the firm owes the partner who paid." },
      { id: 71171, chapter: "dis", front: "An asset realises more than its book value. What boosts the profit?", back: "The book value leaves the debit side while the full proceeds arrive on the credit — the excess over book is the gain, credited to realisation." },
      { id: 71172, chapter: "dis", front: "What is a deficiency statement?", back: "A short statement showing the cash available, the claims met in the statutory order, and the shortfall on the partners' capital claims — that shortfall is shared in the profit-sharing ratio." },
      { id: 71173, chapter: "dis", front: "Which dues bypass the realisation account?", back: "Mutual dues between the firm and a partner — an amount due from or to a partner on capital or loan accounts is settled directly against that account." },
      { id: 71174, chapter: "dis", front: "Accumulated losses and fictitious assets at dissolution?", back: "They never fetch cash, so they play no part in realisation; they are charged to the partners' capital accounts in the profit-sharing ratio before the final division." },
      { id: 71175, chapter: "dis", front: "Which ratio shares the realisation result?", back: "Always the profit-sharing ratio in force — never a new or gaining ratio — because the gain or loss belongs to winding up the old firm." },
      { id: 71176, chapter: "dis", front: "What does the cash/bank account show at the very end?", back: "Zero. Every rupee is applied in the statutory order and the last payments to partners bring both cash and their capital accounts down to nil." },

      { id: 71177, chapter: "sc", front: "Where does subscription money sit before allotment?", back: "In Share Application A/c. It moves to Share Capital — and Securities Premium Reserve where a premium is charged — only when allotment is decided." },
      { id: 71178, chapter: "sc", front: "What is pro-rata allotment?", back: "Applications exceed the offer, so every applicant is allotted in proportion: shares allotted = applied × (offered ÷ applied). The surplus money is adjusted against later instalments or refunded." },
      { id: 71179, chapter: "sc", front: "Why is Share Capital debited only up to the called-up value on forfeiture?", back: "Uncalled capital was never demanded from the shareholder, so there is nothing to cancel beyond what was called; the unpaid part goes to calls in arrears." },
      { id: 71180, chapter: "sc", front: "Forfeited shares reissued above face value — where does the excess go?", back: "To Securities Premium Reserve. Bank is debited and Share Capital credited with the full face value; the premium never reduces the capital reserve computed from the forfeited amount." },
      { id: 71181, chapter: "sc", front: "Is the forfeited balance sent to Capital Reserve at forfeiture?", back: "No — only when those very shares are reissued. Until then it stays in Share Forfeited A/c as the money held against shares not yet reissued." },
      { id: 71182, chapter: "sc", front: "The three lines of a forfeiture entry?", back: "Share Capital A/c Dr (called-up amount), To Share Forfeited A/c (amount actually paid), To Calls in Arrears A/c (the unpaid balance)." },
      { id: 71183, chapter: "sc", front: "How is share capital disclosed under Schedule III?", back: "The note lists authorised, issued, subscribed, called-up and paid-up — but only the subscribed figures are totalled; authorised is shown for information and excluded from the total." },
      { id: 71184, chapter: "sc", front: "What exactly does an ESOP grant?", back: "The right to buy shares at a predetermined price — an option, not a share. It rewards employees for long-term value, unlike sweat equity, which issues shares for knowledge or skills." },
      { id: 71185, chapter: "sc", front: "Shares issued to a vendor for assets — at what value?", back: "The agreed value of the consideration received. Share Capital is credited with that figure; no premium arises unless the agreement itself provides for one." },
      { id: 71186, chapter: "sc", front: "Preference shares in one line?", back: "Shares that carry preference in the payment of dividend and in the repayment of capital on winding up, usually without voting rights." },
      { id: 71187, chapter: "sc", front: "When is calls in advance transferred to the call account?", back: "Only when that particular call is actually made due. Before that it stays a liability of the company to the shareholder — it never becomes capital early." },
      { id: 71188, chapter: "sc", front: "Premium collected along with application money — where is it credited?", back: "To Securities Premium Reserve when the application money is transferred at allotment. Application money is never wholly capital if part of it is premium." }
    ],
    importantQuestions: {
      dis: [
        { type: "Short Answer", marks: 3,
          q: "Why is the realisation account called a nominal account, and what does its balance measure?",
          answer: "It is nominal because it records only the gains, losses and costs of winding up — the proceeds of assets, the settlement of liabilities and the expenses of dissolution, with no asset or liability residing in it. Its debit side carries assets transferred at book value, liabilities actually paid and realisation expenses; its credit side carries liabilities transferred at book value and everything the assets fetched. The balance — the difference between the two totals — is therefore purely the profit or loss of the wind-up itself, which is then shared between the partners in the profit-sharing ratio before the cash is divided." },
        { type: "Short Answer", marks: 3,
          q: "An asset of book value ₹45,000 is taken over by a partner at ₹40,000. How does this differ from the asset being sold for ₹40,000 in cash, and what entry records it?",
          answer: "In both cases the asset leaves realisation's debit at its book ₹45,000 and only ₹40,000 of value comes back, so the realisation result is ₹5,000 worse either way. The difference lies in the settlement: a cash sale brings ₹40,000 into the bank, whereas a takeover is settled out of the partner's claim on the firm — the entry is Partner's Capital A/c Dr ₹40,000 to Realisation A/c ₹40,000 — and the same ₹40,000 is then deducted from what that partner finally receives in cash." },
        { type: "Long Answer", marks: 6,
          q: "On dissolution: assets of book value ₹6,00,000 include stock of ₹1,50,000 taken over by partner K at ₹1,35,000, the rest realising ₹4,20,000; liabilities of book value ₹2,40,000 include ₹30,000 taken over by partner L, the rest paid ₹2,00,000; expenses are ₹12,000. K and L share profits 2:3. Prepare the realisation account and give each partner's share of the result.",
          answer: "Debit side: assets transferred ₹6,00,000 + liabilities paid ₹2,00,000 + expenses ₹12,000 = ₹8,12,000. Credit side: liabilities transferred ₹2,40,000 + stock taken over ₹1,35,000 + assets realised ₹4,20,000 + liability taken over by L ₹30,000 = ₹8,25,000. Credits exceed debits by ₹13,000, so there is a profit on realisation of ₹13,000. It is shared in the profit-sharing ratio: K receives 13,000 × 2/5 = ₹5,200 and L receives 13,000 × 3/5 = ₹7,800, credited to their capital accounts. Note that takeovers reach the credit at their agreed values — ₹1,35,000 for the stock and ₹30,000 for the liability — while the whole book figures still pass through the account." },
        { type: "Long Answer", marks: 6,
          q: "Partners A and B share profits 3:2 with capitals of ₹4,00,000 and ₹2,60,000. The firm has a General Reserve of ₹1,50,000, B has lent the firm ₹80,000, and after paying every outside claim the bank holds ₹8,30,000. Realisation has already thrown a loss of ₹60,000 into the capitals. Show the final division of cash and verify that the bank account closes at zero.",
          answer: "Close the accounts into capital first: the General Reserve of ₹1,50,000 shared 3:2 gives A ₹90,000 and B ₹60,000, and the realisation loss of ₹60,000 costs A ₹36,000 and B ₹24,000. A's claim becomes 4,00,000 + 90,000 − 36,000 = ₹4,54,000 and B's 2,60,000 + 60,000 − 24,000 = ₹2,96,000. Now apply the statutory order: outside liabilities have already been met, so B's loan of ₹80,000 is paid second, and only then the capitals — ₹4,54,000 to A and ₹2,96,000 to B. Verification: 80,000 + 4,54,000 + 2,96,000 = ₹8,30,000, exactly the bank balance, so the cash account closes at zero and both capital accounts stand at nil." },
        { type: "Case-Based", marks: 6,
          q: "Meghna and Raj dissolve their firm sharing profits 1:1. Assets of book value ₹3,20,000 realise ₹3,00,000; liabilities of book value ₹1,40,000 are settled for ₹1,35,000; realisation expenses are ₹9,000; the General Reserve is ₹60,000; capitals are ₹2,20,000 (Meghna) and ₹1,80,000 (Raj); and Raj had lent the firm ₹35,000. (a) Find the result on realisation. (b) What is Raj's total settlement, including his loan? (c) How much cash must the firm hold at the start to complete the wind-up?",
          answer: "(a) Debits 3,20,000 + 1,35,000 + 9,000 = ₹4,64,000; credits 1,40,000 + 3,00,000 = ₹4,40,000 → a loss of ₹24,000, shared equally at ₹12,000 each. (b) Raj's capital 1,80,000 + reserve share 30,000 − loss share 12,000 = ₹1,98,000, plus his loan of ₹35,000 paid ahead of the capitals → total ₹2,33,000. (c) Meghna receives 2,20,000 + 30,000 − 12,000 = ₹2,38,000. Cash required = expenses 9,000 + liabilities 1,35,000 + Raj's loan 35,000 + Meghna 2,38,000 + Raj 2,33,000 = ₹4,50,000 in all." },
        { type: "Case-Based", marks: 4,
          q: "Extract of a firm's balance sheet at dissolution: cash ₹25,000; trade receivables ₹1,50,000; plant ₹2,00,000; trade payables ₹1,20,000; bank overdraft ₹40,000. Plant realises ₹1,85,000, receivables realise ₹1,30,000, payables are settled for ₹1,15,000, the overdraft is repaid and expenses of ₹10,000 are paid. (a) Which of these items never enters the realisation account? (b) Find the result on realisation. (c) What cash remains with the firm after these payments, before the partners are paid?",
          answer: "(a) The cash balance of ₹25,000 — cash and bank are the pool being divided, never an asset to be realised. (b) Debits: plant 2,00,000 + receivables 1,50,000 + payables paid 1,15,000 + overdraft 40,000 + expenses 10,000 = ₹5,15,000; credits: payables transferred 1,20,000 + plant realised 1,85,000 + receivables realised 1,30,000 = ₹4,35,000 → a loss of ₹80,000 on realisation. (c) 25,000 + 1,85,000 + 1,30,000 − 1,15,000 − 40,000 − 10,000 = ₹1,75,000 available for the partners' claims." },
        { type: "Assertion-Reason", marks: 4,
          q: "Assertion (A): When a partner takes over an asset, the realisation account is debited with the asset's book value and credited with the agreed value of the takeover. Reason (R): Realisation must absorb every asset at book value on its debit, and credit only the value the firm actually gets for it, whether in cash or out of a partner's claim. Choose the correct option: (a) both A and R are true and R is the correct explanation of A, (b) both A and R are true but R is not the correct explanation of A, (c) A is false but R is true, (d) A is true but R is false.",
          answer: "Option (a) is correct: both statements are true and R explains A. The asset's book value had already gone to realisation's debit when the dissolution opened, and on takeover the agreed value is credited against the partner's capital, which is exactly the principle R states — debits carry the book figures and credits carry only what the firm actually received. Any difference between the agreed value and the book value simply widens or narrows the realisation profit or loss that the partners share." },
        { type: "Assertion-Reason", marks: 4,
          q: "Assertion (A): A firm's bank overdraft is excluded from the realisation account in the same way as its cash at bank. Reason (R): Realisation excludes cash and bank balances because they are the pool to be divided among the claimants, not assets to be realised. Choose the correct option: (a) both A and R are true and R is the correct explanation of A, (b) both A and R are true but R is not the correct explanation of A, (c) A is false but R is true, (d) A is true but R is false.",
          answer: "Option (c) is correct: A is false while R is true. A positive cash or bank balance is indeed excluded because it is the pool being divided — that part of R is right — but a bank overdraft of, say, ₹40,000 is money the firm owes the bank, a third-party liability, so repaying it debits the realisation account like any other outside liability. R correctly explains why cash is excluded, but that reason does not extend to an overdraft, which is why A fails." }
      ],
      sc: [
        { type: "Short Answer", marks: 3,
          q: "What is meant by pro-rata allotment, and how is the surplus application money of an applicant dealt with?",
          answer: "Pro-rata allotment is proportionate acceptance used when applications exceed the offer: every applicant receives a fixed fraction of what he applied for, the fraction being offers divided by applications. Each applicant therefore pays application money on more shares than he receives. The surplus is not refunded while it can be used — it is adjusted against the next instalments that fall due, typically allotment and then calls, and only any amount still left over after every instalment is absorbed is returned. In the ledger the surplus travels from Share Application A/c to the allotment or call account, never straight to profit." },
        { type: "Long Answer", marks: 6,
          q: "A shareholder holding 1,000 shares of ₹10 each, on which ₹6 per share had been called up, paid only ₹4 per share and was forfeited after notice. Later 250 of those shares were reissued at ₹9 as fully paid and the remaining 150 at ₹11 as fully paid. Pass the entries and compute the capital reserve and the premium involved.",
          answer: "Forfeiture: Share Capital A/c Dr 6,000 / To Share Forfeited A/c 4,000 / To Calls in Arrears A/c 2,000 — capital only up to the called-up ₹6,000, forfeiture only of the ₹4 per share actually paid. First reissue: Bank A/c Dr 2,250 + Share Forfeited A/c Dr 250 / To Share Capital A/c 2,500 — the ₹1 per share discount (₹250) comes out of the 250 × ₹4 = ₹1,000 forfeited on those shares, leaving a capital reserve of ₹750. Second reissue at ₹11 needs no discount: Bank A/c Dr 1,650 / To Share Capital A/c 1,500 / To Securities Premium Reserve A/c 150 — the ₹1 above face on 150 shares is premium, credited to Securities Premium Reserve. The ₹600 forfeited on that batch (150 × ₹4) then goes wholly to capital reserve. Total capital reserve = 750 + 600 = ₹1,350, and no discount is ever met from Securities Premium Reserve." },
        { type: "Long Answer", marks: 6,
          q: "A company issued 10,000 shares of ₹10 each at par, payable ₹6 on application and ₹4 on the first and final call. A holder of 500 shares paid the full ₹10 with the application. Another holder of 800 shares paid only ₹4 on application and never paid anything more, and his shares were forfeited; later 500 of the forfeited shares were reissued at ₹7 as fully paid. Give the entries for the advance, the forfeiture and the reissue, and find the cash received on the call and the capital reserve.",
          answer: "Advance: Bank A/c Dr 5,000 / To Calls in Advance A/c 5,000 — of which ₹3,000 is application money (500 × ₹6) and ₹2,000 the call, held as a liability until the call is made. Call due: Share First Call A/c Dr 40,000 / To Share Capital A/c 40,000, and the advance is transferred: Calls in Advance A/c Dr 2,000 / To Share First Call A/c 2,000. Cash on call = 40,000 − 2,000 already held − 3,200 arrears of the defaulter (800 × ₹4) = ₹34,800, with Calls in Arrears A/c Dr 3,200 / To Share First Call A/c 3,200. Forfeiture: Share Capital A/c Dr 8,000 / To Share Forfeited A/c 3,200 / To Calls in Arrears A/c 4,800 — called-up ₹10, paid ₹4 per share. Reissue of 500 at ₹7: Bank A/c Dr 3,500 + Share Forfeited A/c Dr 1,500 / To Share Capital A/c 5,000; the discount of ₹3 per share is met strictly from the 500 × ₹4 = ₹2,000 forfeited on those shares, leaving a capital reserve of ₹500." },
        { type: "Long Answer", marks: 6,
          q: "A company's authorised capital is ₹50,00,000 in shares of ₹10 each; issued and subscribed capital is ₹30,00,000; the company has called ₹8 per share; calls in arrears stand at ₹48,000; and the Securities Premium Reserve holds ₹6,00,000. Present the share capital note under Schedule III, compute paid-up capital, and state which figures are added in the balance sheet.",
          answer: "The note discloses the full ladder at face-value terms: authorised ₹50,00,000 (5,00,000 shares of ₹10), issued and subscribed ₹30,00,000 (30,00,000 shares), called-up ₹24,00,000 (30,00,000 × ₹8), less calls in arrears ₹48,000, giving paid-up capital of ₹23,52,000. Under Schedule III only the subscribed figure enters the total of share capital — ₹30,00,000 — with the called-up and paid-up details disclosed in the note; the authorised capital of ₹50,00,000 is shown for information and is never added, since a company cannot issue beyond it. The ₹6,00,000 Securities Premium Reserve is not share capital at all: it appears under Reserves and Surplus with its own note, because premium collected over face value is a separate reserve usable only for the statutory purposes such as issuing bonus shares or providing for premium on future redemption — never for dividend." },
        { type: "Case-Based", marks: 6,
          q: "Veda Ltd. offered 10,000 shares of ₹10 each at par, payable ₹4 on application, ₹3 on allotment and ₹3 on the first and final call. Applications for 15,000 shares were accepted pro rata. Meera applied for 900 shares, paid her allotment from the surplus, but never paid the call; her shares were forfeited and 400 of them were later reissued at ₹8 as fully paid. (a) How many shares was she allotted? (b) How much did she pay in total before defaulting? (c) State the calls in arrears and the amount forfeited. (d) Give the forfeiture entry and the capital reserve on reissue.",
          answer: "(a) Allotment ratio 10,000 ÷ 15,000 = 2/3, so 900 × 2/3 = 600 shares. (b) Application money paid 900 × ₹4 = ₹3,600, of which ₹2,400 is the application on her 600 shares; the surplus ₹1,200 absorbs part of her ₹1,800 allotment, so she pays ₹600 more in cash — total paid ₹4,200, or ₹7 per allotted share. (c) Call due 600 × ₹3 = ₹1,800 was never paid → calls in arrears ₹1,800; on forfeiture the Share Forfeited Account is credited ₹4,200, Share Capital is debited the called-up 600 × ₹10 = ₹6,000 and Calls in Arrears is cleared with ₹1,800. (d) Forfeiture: Share Capital A/c Dr 6,000 / To Share Forfeited A/c 4,200 / To Calls in Arrears A/c 1,800. Reissue of 400 at ₹8: Bank A/c Dr 3,200 + Share Forfeited A/c Dr 800 / To Share Capital A/c 4,000, and the residue of those shares' forfeited money — 400 × ₹8 − ₹800 = ₹2,000 — is transferred to Capital Reserve." },
        { type: "Case-Based", marks: 4,
          q: "While closing the forfeiture records, an audit found two mistakes. First, on forfeiting 1,000 shares of ₹10 each of which only ₹6 had been called and ₹4 paid, the clerk debited Share Capital with ₹10,000 and credited Share Forfeited with ₹10,000. Second, when 500 of those shares were reissued at ₹9, the ₹500 discount was debited to Securities Premium Reserve. Identify the errors and state the correct treatment, including the capital reserve on reissue.",
          answer: "Error 1: Share Capital may be debited only up to the called-up amount, so the entry should have been Share Capital A/c Dr 6,000 / To Share Forfeited A/c 4,000 / To Calls in Arrears A/c 2,000. The clerk's entry of ₹10,000 cancelled capital the company had never demanded and omitted the ₹2,000 of arrears altogether; the Share Forfeited Account was overstated by ₹6,000 because only the ₹4 per share actually paid (₹4,000) can ever be forfeited. Error 2: discount on reissue is met strictly from the amount forfeited on those very shares, not from Securities Premium Reserve — 500 shares carry 500 × ₹4 = ₹2,000 forfeited, of which the ₹500 discount uses ₹500, so the correct reissue entry is Bank A/c Dr 4,500 + Share Forfeited A/c Dr 500 / To Share Capital A/c 5,000 and the unused ₹1,500 is transferred to Capital Reserve." },
        { type: "Assertion-Reason", marks: 4,
          q: "Assertion (A): On forfeiture, the Share Capital account is debited with the called-up amount and not with the face value of the shares. Reason (R): Capital can only be cancelled up to what the company actually demanded from the shareholder; the unpaid part of the call is a receivable, not capital. Choose the correct option: (a) both A and R are true and R is the correct explanation of A, (b) both A and R are true but R is not the correct explanation of A, (c) A is false but R is true, (d) A is true but R is false.",
          answer: "Option (a) is correct: both are true and R explains A. Forfeiture withdraws the shareholder's rights only over what was called up — if ₹6 of a ₹10 share had been demanded, only ₹6 of capital is cancelled, because the remaining ₹4 was never demanded and therefore cannot be cancelled. The unpaid portion is handled as a receivable through Calls in Arrears, while only the money actually paid is credited to Share Forfeited, exactly as R says." },
        { type: "Assertion-Reason", marks: 4,
          q: "Assertion (A): Money received from a shareholder before a call is due may be transferred to Share Capital straight away. Reason (R): Nothing can become share capital before the corresponding call is actually made — until then the money is a liability of the company to the shareholder. Choose the correct option: (a) both A and R are true and R is the correct explanation of A, (b) both A and R are true but R is not the correct explanation of A, (c) A is false but R is true, (d) A is true but R is false.",
          answer: "Option (c) is correct: A is false while R is true. Calls in advance stay in Calls in Advance A/c as a liability of the company because no capital has been demanded yet; only when the call is made due is the advance transferred to the call account and, through it, to Share Capital. R states exactly this rule — nothing is capital before it is called — and that is precisely why A, which would transfer the money to capital at once, is wrong." }
      ]
    }
  });
})();
