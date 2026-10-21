/* ============================================================
   CLASS 12 — EXPANSION H (v86): Admission (adm) + Retirement (ret)
   Additive unit — extends the chapters registered by data-12b.js.
   Content is original teaching material written for this project
   against the CBSE Class 12 Accountancy curriculum (2026-27).
   ============================================================ */
(function () {
  "use strict";

  C12_DATA.register({
    content: {

      /* ---------- Chapter 4: Admission of a Partner ---------- */
      adm: {

        /* ---- Practice Bank (merged with existing ids 1–10) ---- */
        numericals: [
          {
            id: 11, difficulty: "Easy",
            question: "General Reserve of ₹75,000 stands in the books when C is admitted. The journal entry that closes this reserve before the new ratio starts working is:",
            options: ["General Reserve A/c Dr ₹75,000 to A's and B's Capital A/cs in the old ratio", "A's and B's Capital A/cs Dr to General Reserve A/c", "Revaluation A/c Dr to General Reserve A/c", "Cash A/c Dr to General Reserve A/c"],
            answerIndex: 0,
            explanation: "General Reserve is an accumulated profit earned under the old agreement, so it is written back to the old partners — General Reserve A/c Dr ₹75,000 to A and B in the old ratio. The Revaluation Account is reserved for movements in assets and liabilities, not for reserves."
          },
          {
            id: 12, difficulty: "Medium",
            question: "A and B share profits 3:2. C is admitted for 1/6th of the future profits, after which the balance is shared equally between A and B. Their shares immediately after admission are:",
            options: ["A 5/12, B 5/12, C 2/12", "A 1/2, B 1/3, C 1/6", "A 5/12, B 3/12, C 2/12", "A 5/12, B 5/12, C 1/12"],
            answerIndex: 0,
            explanation: "The balance 5/6 left after C's 1/6 is split equally: 5/6 × 1/2 = 5/12 for A and 5/12 for B, while C keeps 1/6 = 2/12 — giving the new ratio 5:5:2. Keeping A at 1/2 and B at 1/3 forgets that both had to give up share."
          },
          {
            id: 13, difficulty: "Medium",
            question: "A and B share profits 5:3. On admitting C the firm agrees a new profit-sharing ratio of 12:7:5. The sacrificing ratio of A:B is:",
            options: ["3:2", "5:3", "2:3", "1:1"],
            answerIndex: 0,
            explanation: "Out of 24 parts: A now takes 12 against 15 earlier, giving up 3/24; B takes 7 against 9 earlier, giving up 2/24 — so the sacrificing ratio is 3:2. The sacrifices total 5/24 = C's share ✓. The old ratio 5:3 is only a coincidence of the question, not the sacrifice."
          },
          {
            id: 14, difficulty: "Medium",
            question: "The firm's goodwill is valued at ₹2,40,000. C is admitted for 1/4th of the profits and brings that share in cash. A and B sacrifice in the ratio 3:2. How much of the premium is credited to B?",
            options: ["₹24,000", "₹36,000", "₹60,000", "₹30,000"],
            answerIndex: 0,
            explanation: "C brings 2,40,000 × 1/4 = ₹60,000, which is divided between the sacrificers 3:2: B takes 60,000 × 2/5 = ₹24,000 and A takes ₹36,000. Quoting ₹60,000 mistakes C's whole contribution for B's share."
          },
          {
            id: 15, difficulty: "Hard",
            question: "At C's admission the revaluation shows building up ₹60,000, stock down ₹18,000, machinery down ₹25,000, creditors up ₹7,000 and a preliminary expense of ₹20,000 written off. The revaluation account closes with:",
            options: ["A profit of ₹10,000", "A loss of ₹10,000", "A profit of ₹50,000", "A loss of ₹30,000"],
            answerIndex: 1,
            explanation: "Gains = building ₹60,000. Falls = 18,000 + 25,000 + 7,000 + 20,000 = ₹70,000. Net = 60,000 − 70,000 = a loss of ₹10,000, which is debited to A and B in their old ratio. Counting only the building and the stock (60,000 − 18,000 = ₹42,000) or ignoring the write-off of the preliminary expense are the usual slips."
          },
          {
            id: 16, difficulty: "Medium",
            question: "C is admitted with a capital of ₹1,50,000 for a 1/6th share of the firm's profits, and the partners fix the total capital of the reconstituted firm in proportion to this contribution. The total capital of the firm will be:",
            options: ["₹9,00,000", "₹6,00,000", "₹7,50,000", "₹3,00,000"],
            answerIndex: 0,
            explanation: "₹1,50,000 represents 1/6th of the firm, so the whole firm is 1,50,000 × 6/1 = ₹9,00,000, on which each partner's capital is then fixed in the agreed new ratio. Multiplying by 5 (treating the share as 1/5) would wrongly give ₹7,50,000."
          },
          {
            id: 17, difficulty: "Easy",
            question: "Which of these will NOT appear in the balance sheet drawn up immediately after C's admission?",
            options: ["General Reserve, because it has already been shared with the old partners", "Creditors shown at their revised figures", "Building shown at its revalued figure", "Cash at bank, increased by whatever C brought in"],
            answerIndex: 0,
            explanation: "Everything accumulated is settled at reconstitution — General Reserve, accumulated losses and old goodwill are all gone before the new ratio begins. Creditors at revised values, the revalued building and the cash C brought in are exactly what the revised balance sheet is meant to show."
          },
          {
            id: 18, difficulty: "Medium",
            question: "A student credited the entire premium for goodwill brought by the new partner to the old partners in their old profit-sharing ratio. If the sacrificing ratio differs from the old ratio, this error:",
            options: ["Over-credits the partner who sacrificed less and under-credits the partner who sacrificed more", "Shares the revaluation profit with the new partner as well", "Creates a goodwill asset twice in the balance sheet", "Changes the total capital of the reconstituted firm"],
            answerIndex: 0,
            explanation: "The premium compensates the exact slices surrendered, so it must follow the sacrificing ratio: whoever sacrificed a smaller fraction than the old ratio suggests receives too much, and the other receives too little. Revaluation, reserve distribution and total capital are untouched, and no asset is ever created."
          },
          {
            id: 19, difficulty: "Easy",
            question: "The journal entry to record the premium for goodwill brought in cash by the new partner is:",
            options: ["Bank A/c Dr to the Sacrificing Partners' Capital A/cs", "New Partner's Capital A/c Dr to Bank A/c", "Bank A/c Dr to Goodwill A/c", "Goodwill A/c Dr to the Old Partners' Capital A/cs in the old ratio"],
            answerIndex: 0,
            explanation: "Cash flows in and is immediately passed on to the partners who gave up share — Bank A/c Dr to A and B in the sacrificing ratio. Under AS-26 the firm never records self-generated goodwill, so 'Goodwill A/c' does not appear in the entry."
          },
          {
            id: 20, difficulty: "Hard",
            question: "A and B share profits 3:2 and C is admitted for 1/6th share. Against part of his capital, C takes over furniture of book value ₹90,000 at an agreed value of ₹75,000. The revaluation account is debited with:",
            options: ["₹15,000", "₹90,000", "₹75,000", "₹1,25,000"],
            answerIndex: 0,
            explanation: "Furniture worth ₹90,000 leaves the firm at ₹75,000, so the fall of 90,000 − 75,000 = ₹15,000 is the revaluation debit. The entry is C's Capital A/c Dr ₹75,000, Revaluation A/c Dr ₹15,000 to Furniture ₹90,000 — quoting ₹90,000 or ₹75,000 confuses the transfer with the revaluation of value."
          },
          {
            id: 21, difficulty: "Medium",
            question: "A and B share profits 3:2 with a General Reserve of ₹60,000. At C's admission (1/5th share) revaluation closes with a profit of ₹25,000 and C brings ₹20,000 in cash for goodwill, the sacrifice being 3:2. Total amount credited to A's capital account on the day of reconstitution (excluding capital introduced) is:",
            options: ["₹63,000", "₹51,000", "₹60,000", "₹56,000"],
            answerIndex: 0,
            explanation: "Reserve 60,000 × 3/5 = ₹36,000, plus revaluation 25,000 × 3/5 = ₹15,000, plus goodwill 20,000 × 3/5 = ₹12,000 — total ₹63,000. Leaving out the goodwill gives ₹51,000 and sharing the revaluation in the new ratio (25,000 × 12/25 = ₹12,000) gives ₹60,000, both wrong."
          },
          {
            id: 22, difficulty: "Easy",
            question: "The main purpose of opening a Revaluation Account at the time of admission is to:",
            options: ["Restate every asset and liability to current values so the old partners gain or lose on the changes that happened under their agreement", "Increase the total assets shown in the balance sheet", "Fix the capital the new partner must contribute", "Work out the sacrificing ratio of the old partners"],
            answerIndex: 0,
            explanation: "Revaluation is a settling-up exercise, not a valuation exercise: appreciation and depreciation accrued while only the old partners owned the firm, so they are pushed through the revaluation account and shared in the old ratio. Capital is fixed separately and the sacrifice ratio drives goodwill alone."
          },
          {
            id: 23, difficulty: "Easy",
            question: "The balance sheet at admission shows old goodwill of ₹30,000, while the partners value the firm's goodwill at ₹1,50,000 for settling compensation. Which goodwill figures appear in the revised balance sheet?",
            options: ["Neither figure", "₹30,000 only", "₹1,50,000 only", "₹1,80,000 — both added together"],
            answerIndex: 0,
            explanation: "The old ₹30,000 is written off to A and B in the old ratio, and the self-generated goodwill of ₹1,50,000 is valued only to divide compensation — AS-26 keeps it out of the books. So the revised balance sheet carries no goodwill line at all."
          },
          {
            id: 24, difficulty: "Hard",
            question: "A and B hold capitals of ₹2,40,000 and ₹1,60,000. On admitting C (new ratio 12:8:5) the firm fixes its total capital at ₹6,00,000. The cash each old partner must bring in or withdraw is:",
            options: ["A brings in ₹48,000 and B brings in ₹32,000", "A brings in ₹48,000 and B withdraws ₹32,000", "A brings in ₹88,000 and B brings in ₹32,000", "Neither partner needs any adjustment"],
            answerIndex: 0,
            explanation: "A needs 6,00,000 × 12/25 = ₹2,88,000 against ₹2,40,000, so A brings in ₹48,000. B needs 6,00,000 × 8/25 = ₹1,92,000 against ₹1,60,000, so B brings in ₹32,000. Both bring money in; 48,000 + 32,000 + C's 1,20,000 = ₹6,00,000 ✓."
          },
          {
            id: 25, difficulty: "Hard",
            question: "The firm's goodwill is ₹1,20,000 and C is admitted for 1/6th share. The partners decide that goodwill is not to be brought in cash but adjusted through capital accounts, and A and B sacrifice equally. The entry requires:",
            options: ["Debiting C's capital ₹20,000 and crediting A and B ₹10,000 each", "Crediting C's capital ₹20,000 and debiting A and B", "Debiting the revaluation account with ₹20,000", "No entry at all"],
            answerIndex: 0,
            explanation: "C's share of the firm's goodwill = 1,20,000 × 1/6 = ₹20,000; with A and B sacrificing equally they are credited ₹10,000 each and C is debited ₹20,000. Only the settlement route changed from cash to capital — the economics of paying for the surrendered share are identical."
          }
        ],

        /* ---- Interactive statement lab (engine strings copied verbatim
               from data-12b.js; only the case list grows) ---- */
        activity: {
          type: "statement",
          title: "Revaluation Statement Builder",
          instruction: "Build each statement the board expects: pick the treatment for every line and type the amount where asked. Verify each statement before moving on — the working appears only when every line is right.",
          statements: [
            {
              title: "Statement 4 — Revaluation movements and their amounts",
              prompt: "For every movement decide whether it raises or lowers the revaluation profit, and type the amount of that movement.",
              needsAmount: true,
              rows: [
                { label: "Building carried at ₹5,00,000 is now worth ₹5,45,000", options: ["Increases profit", "Decreases profit", "No effect"], answer: "Increases profit", amount: 45000 },
                { label: "Machinery carried at ₹3,20,000 is now worth ₹2,96,000", options: ["Increases profit", "Decreases profit", "No effect"], answer: "Decreases profit", amount: 24000 },
                { label: "Creditors of ₹1,50,000 are now expected to be ₹1,56,000", options: ["Increases profit", "Decreases profit", "No effect"], answer: "Decreases profit", amount: 6000 },
                { label: "Prepaid insurance of ₹4,000 was never recorded in the books", options: ["Increases profit", "Decreases profit", "No effect"], answer: "Increases profit", amount: 4000 },
                { label: "A contingent liability of ₹12,000 becomes certain and must be paid", options: ["Increases profit", "Decreases profit", "No effect"], answer: "Decreases profit", amount: 12000 }
              ],
              working: "Gains 45,000 + 4,000 = ₹49,000 against falls 24,000 + 6,000 + 12,000 = ₹42,000 → revaluation <b>profit ₹7,000</b>, shared between A and B in the old ratio."
            },
            {
              title: "Statement 5 — Goodwill premium and old goodwill together",
              prompt: "The firm's goodwill is ₹1,60,000, C is admitted for 1/5th and brings that share in cash; A and B sacrifice in the ratio 3:1. Old goodwill of ₹25,000 sits in the books (A:B = 3:2). Place every figure.",
              needsAmount: true,
              rows: [
                { label: "Cash C brings for his share of goodwill", options: ["Credited to the sacrificing partners", "Credited to all old partners in the old ratio", "Recorded as the firm's asset", "Debited to revaluation"], answer: "Credited to the sacrificing partners", amount: 32000 },
                { label: "A's credit out of C's premium (sacrificing ratio 3:1)", options: ["Credit to A's capital", "Debit to A's capital", "Carried forward"], answer: "Credit to A's capital", amount: 24000 },
                { label: "B's credit out of C's premium (sacrificing ratio 3:1)", options: ["Credit to B's capital", "Debit to B's capital", "Carried forward"], answer: "Credit to B's capital", amount: 8000 },
                { label: "Old goodwill of ₹25,000 lying in the balance sheet", options: ["Written off by A and B in the old ratio", "Carried forward to the new firm", "Credited to C's capital"], answer: "Written off by A and B in the old ratio", amount: 25000 }
              ],
              working: "Premium = 1,60,000 × 1/5 = <b>₹32,000</b> → A 32,000 × 3/4 = <b>₹24,000</b>, B <b>₹8,000</b>. Old goodwill 25,000 goes back to A (15,000) and B (10,000) in 3:2 so the same reputation is never counted twice."
            },
            {
              title: "Statement 6 — Reading the revised balance sheet",
              prompt: "Pick exactly how each line stands in the balance sheet drawn up immediately after admission.",
              head: ["Line item after admission", "How it appears"],
              rows: [
                { label: "General Reserve ₹80,000", options: ["Omitted — distributed to the old partners in the old ratio", "Shown on the liability side", "Added to goodwill", "Transferred to revaluation"], answer: "Omitted — distributed to the old partners in the old ratio" },
                { label: "Old goodwill ₹30,000", options: ["Omitted — written off by the old partners", "Shown at ₹30,000 as an asset", "Shown at its revalued figure", "Added to building"], answer: "Omitted — written off by the old partners" },
                { label: "Building carried at ₹5,00,000, now agreed at ₹5,45,000", options: ["₹5,45,000 — the revalued figure", "₹5,00,000 — the book figure", "₹45,000 — the increase alone", "Omitted until cash is received"], answer: "₹5,45,000 — the revalued figure" },
                { label: "Cash at bank after C brought in ₹1,20,000", options: ["Rises by ₹1,20,000", "Falls by ₹1,20,000", "Does not change", "Moves to goodwill"], answer: "Rises by ₹1,20,000" },
                { label: "Partners' capital accounts", options: ["Restated in the new profit-sharing ratio", "Left at their old balances", "Shown as a loan of the firm", "Merged into General Reserve"], answer: "Restated in the new profit-sharing ratio" }
              ],
              working: "A revised balance sheet shows the decision already taken: reserves and old goodwill are gone, the building sits at ₹5,45,000, bank rises by the ₹1,20,000 C brought in, and capitals follow the new ratio."
            },
            {
              title: "Statement 7 — Capital restructuring of the new firm",
              prompt: "Total capital is fixed at ₹5,00,000 with the new ratio 3:3:2. Find the movement each partner must make.",
              needsAmount: true,
              rows: [
                { label: "A holds ₹2,00,000 against a target of ₹1,87,500 (5,00,000 × 3/8)", options: ["A withdraws ₹12,500", "A brings in ₹12,500", "No movement for A"], answer: "A withdraws ₹12,500", amount: 12500 },
                { label: "B holds ₹1,50,000 against a target of ₹1,87,500 (5,00,000 × 3/8)", options: ["B withdraws ₹37,500", "B brings in ₹37,500", "No movement for B"], answer: "B brings in ₹37,500", amount: 37500 },
                { label: "C joins with a target capital of 5,00,000 × 2/8", options: ["C brings in ₹1,25,000", "C withdraws ₹1,25,000", "No entry for C"], answer: "C brings in ₹1,25,000", amount: 125000 },
                { label: "Total capital the partners agree for the new firm", options: ["₹5,00,000", "₹6,25,000", "₹4,00,000"], answer: "₹5,00,000", amount: 500000 }
              ],
              working: "Targets: A 1,87,500, B 1,87,500, C 1,25,000 = <b>₹5,00,000</b> ✓. A is ₹12,500 above target and takes it out; B is ₹37,500 short and brings it in; C brings the whole ₹1,25,000."
            },
            {
              title: "Statement 8 — Every old item settled on reconstitution",
              prompt: "A and B share 5:3. Distribute the reserve, the accumulated loss and the revaluation loss, and say the direction for each partner.",
              needsAmount: true,
              rows: [
                { label: "A's share of General Reserve ₹1,60,000 (5:3)", options: ["Credit to A's capital", "Debit to A's capital", "Carried forward"], answer: "Credit to A's capital", amount: 100000 },
                { label: "B's share of General Reserve ₹1,60,000 (5:3)", options: ["Credit to B's capital", "Debit to B's capital", "Carried forward"], answer: "Credit to B's capital", amount: 60000 },
                { label: "A's share of the debit balance in P&L A/c ₹64,000 (5:3)", options: ["Debit to A's capital", "Credit to A's capital", "Transferred to revaluation"], answer: "Debit to A's capital", amount: 40000 },
                { label: "B's share of the debit balance in P&L A/c ₹64,000 (5:3)", options: ["Debit to B's capital", "Credit to B's capital", "Transferred to revaluation"], answer: "Debit to B's capital", amount: 24000 },
                { label: "A's share of the revaluation loss ₹20,000 (5:3)", options: ["Debit to A's capital", "Credit to A's capital", "Shared with the new partner"], answer: "Debit to A's capital", amount: 12500 }
              ],
              working: "Reserve 1,60,000 × 5/8 = <b>₹1,00,000</b> and × 3/8 = <b>₹60,000</b> credited. Accumulated loss 64,000 → A <b>₹40,000</b>, B <b>₹24,000</b> debited. Revaluation loss 20,000 × 5/8 = A <b>₹12,500</b> (B 7,500). Old goodwill of ₹40,000 goes too — A 25,000, B 15,000."
            },
            {
              title: "Statement 9 — Which movements belong to revaluation at all?",
              prompt: "Decide the side of the Revaluation Account for each event. Two of these never touch it.",
              head: ["Movement at admission", "Effect on the revaluation account"],
              rows: [
                { label: "Provision for doubtful debts cut from ₹15,000 to ₹6,000", options: ["Credit — profit rises by ₹9,000", "Debit — profit falls by ₹9,000", "No effect"], answer: "Credit — profit rises by ₹9,000" },
                { label: "A liability of ₹50,000 is found to be understated by ₹4,000", options: ["Debit — profit falls by ₹4,000", "Credit — profit rises by ₹4,000", "No effect"], answer: "Debit — profit falls by ₹4,000" },
                { label: "Prepaid insurance of ₹3,000 was never recorded", options: ["Credit — profit rises by ₹3,000", "Debit — profit falls by ₹3,000", "No effect"], answer: "Credit — profit rises by ₹3,000" },
                { label: "A receivable of ₹5,000 written off last year is recovered in cash", options: ["No effect on revaluation", "Credit — profit rises by ₹5,000", "Debit — profit falls by ₹5,000"], answer: "No effect on revaluation" },
                { label: "A contingent liability of ₹12,000 becomes certain", options: ["Debit — profit falls by ₹12,000", "Credit — profit rises by ₹12,000", "No effect"], answer: "Debit — profit falls by ₹12,000" },
                { label: "Self-generated trade marks (book ₹0) are valued at ₹45,000", options: ["No effect — self-generated intangibles are not recorded", "Credit — profit rises by ₹45,000", "Debit — profit falls by ₹45,000"], answer: "No effect — self-generated intangibles are not recorded" }
              ],
              working: "Revaluation moves only with assets and liabilities the firm already recognises. A write-off recovered in cash and an internally built trade mark never enter it — AS-26 keeps self-generated intangibles out of the books entirely."
            },
            {
              title: "Statement 10 — Entry, debit, credit and amount",
              prompt: "For each event choose the entry that records it and type the amount involved.",
              needsAmount: true,
              rows: [
                { label: "Cash of ₹1,00,000 brought in by C as capital", options: ["Bank A/c Dr to C's Capital A/c", "C's Capital A/c Dr to Bank A/c", "Bank A/c Dr to Revaluation A/c"], answer: "Bank A/c Dr to C's Capital A/c", amount: 100000 },
                { label: "General Reserve of ₹80,000 written back at admission", options: ["General Reserve A/c Dr to old partners' capital", "Old partners' capital A/cs Dr to General Reserve A/c", "Revaluation A/c Dr to General Reserve A/c"], answer: "General Reserve A/c Dr to old partners' capital", amount: 80000 },
                { label: "Old goodwill of ₹24,000 written off (A:B = 3:2)", options: ["Old partners' capital A/cs Dr to Goodwill A/c", "Goodwill A/c Dr to old partners' capital A/cs", "Revaluation A/c Dr to Goodwill A/c"], answer: "Old partners' capital A/cs Dr to Goodwill A/c", amount: 24000 },
                { label: "Premium of ₹18,000 received for goodwill in cash", options: ["Bank A/c Dr to sacrificing partners' capital A/cs", "Bank A/c Dr to Goodwill A/c", "Sacrificing partners' A/cs Dr to Bank A/c"], answer: "Bank A/c Dr to sacrificing partners' capital A/cs", amount: 18000 },
                { label: "Revaluation closes with a profit of ₹30,000", options: ["Revaluation A/c Dr to old partners' capital A/cs", "Old partners' capital A/cs Dr to Revaluation A/c", "Revaluation A/c Dr to new partner's capital A/c"], answer: "Revaluation A/c Dr to old partners' capital A/cs", amount: 30000 }
              ],
              working: "Capital and premium come in through Bank; reserves and old goodwill are closed against the old partners; the revaluation profit goes to A and B in the old ratio. The premium of ₹18,000 is split 3:2 → A ₹10,800, B ₹7,200."
            }
          ]
        },

        examCases: [
          {
            id: 2,
            title: "A quarter of the firm changes hands",
            passage: "Arav and Kabir share profits 5:3. They admit Dhruv for one-fourth of the future profits, the balance to be divided between them exactly as before. The firm's goodwill is taken at ₹1,60,000 and General Reserve stands at ₹1,28,000. At revaluation the plant is agreed ₹48,000 higher, stock is down ₹16,000 and creditors are expected to rise by ₹8,000.",
            difficulty: "Hard",
            subs: [
              {
                q: "What is the new profit-sharing ratio A:B:D?",
                options: ["15:9:8", "5:3:4", "20:12:8", "15:9:4"],
                answerIndex: 0,
                reasoning: "The balance 3/4 is split 5:3 → A 15/32, B 9/32 and D 8/32, i.e. 15:9:8, with the sacrifices of 5/32 and 3/32 exactly funding D's 8/32."
              },
              {
                q: "How much cash does Dhruv bring for goodwill?",
                options: ["₹40,000", "₹20,000", "₹80,000", "₹1,60,000"],
                answerIndex: 0,
                reasoning: "Dhruv's contribution is the firm's goodwill multiplied by his share: 1,60,000 × 1/4 = ₹40,000, credited to the sacrificing partners."
              },
              {
                q: "What is the profit or loss on revaluation?",
                options: ["Profit ₹24,000", "Loss ₹24,000", "Profit ₹72,000", "Profit ₹16,000"],
                answerIndex: 0,
                reasoning: "+48,000 plant − 16,000 stock − 8,000 creditors = ₹24,000 profit, which goes to Arav and Kabir in the old ratio 5:3 (Kabir gets 9,000)."
              },
              {
                q: "How much of the General Reserve is credited to Kabir?",
                options: ["₹48,000", "₹80,000", "₹72,000", "₹32,000"],
                answerIndex: 0,
                reasoning: "Reserves belong to the old agreement: 1,28,000 × 3/8 = ₹48,000 to Kabir, while Arav receives ₹80,000."
              }
            ]
          },
          {
            id: 3,
            title: "Three items the new partner must not inherit",
            passage: "Nila and Sameer share profits 4:1. They admit Riya for one-fifth of the future profits, the remainder continuing between them in the old ratio. On that day the books show a General Reserve of ₹50,000, a debit balance of ₹20,000 in the Profit and Loss Account, and goodwill of ₹15,000 purchased years ago. Revaluation closes with a profit of ₹45,000. The firm's goodwill is ₹1,50,000 and Riya brings her share for it in cash.",
            difficulty: "Medium",
            subs: [
              {
                q: "What is the new profit-sharing ratio Nila:Sameer:Riya?",
                options: ["16:4:5", "4:1:5", "20:5:5", "16:9:5"],
                answerIndex: 0,
                reasoning: "The balance 4/5 split 4:1 gives Nila 16/25, Sameer 4/25 and Riya 5/25 = 16:4:5; keeping Nila and Sameer at 4 and 1 would leave the total short of the firm."
              },
              {
                q: "How much of the Profit and Loss debit balance is debited to Sameer?",
                options: ["₹4,000", "₹16,000", "₹5,000", "₹10,000"],
                answerIndex: 0,
                reasoning: "An accumulated loss is shared in the old ratio 4:1: 20,000 × 1/5 = ₹4,000 charged to Sameer and ₹16,000 to Nila."
              },
              {
                q: "How much of Riya's goodwill contribution is credited to Sameer?",
                options: ["₹6,000", "₹24,000", "₹30,000", "₹15,000"],
                answerIndex: 0,
                reasoning: "Riya brings 1,50,000 × 1/5 = ₹30,000, divided in the sacrificing ratio 4:1 (the old ratio, because the remainder was split that way) → Sameer ₹6,000."
              },
              {
                q: "What amount of the old goodwill of ₹15,000 is written off from Sameer?",
                options: ["₹3,000", "₹12,000", "₹15,000", "₹7,500"],
                answerIndex: 0,
                reasoning: "Old purchased goodwill is removed in the old ratio 4:1: 15,000 × 1/5 = ₹3,000 from Sameer and ₹12,000 from Nila, before any premium method is applied."
              }
            ]
          }
        ],

        examNumericals: [
          {
            id: 3,
            q: "The firm's goodwill is ₹2,40,000 and a new partner is admitted for 1/8th of the profits, bringing that share in cash. Find the cash paid by the new partner for goodwill (₹).",
            value: 30000,
            explanation: "2,40,000 × 1/8 = ₹30,000 — the amount credited to the sacrificing partners in the sacrificing ratio, never to the firm as an asset.",
            difficulty: "Medium"
          },
          {
            id: 4,
            q: "At admission, building rises by ₹70,000, machinery falls by ₹22,000 and a liability is understated by ₹8,000. Find the profit on revaluation (₹).",
            value: 40000,
            explanation: "70,000 − 22,000 − 8,000 = ₹40,000, shared between the old partners in the old ratio.",
            difficulty: "Easy"
          },
          {
            id: 5,
            q: "Total capital of the reconstituted firm is fixed at ₹7,20,000 with the new ratio 3:2:1. Partner B's capital in the old books is ₹2,60,000. Find the amount B must withdraw (₹).",
            value: 20000,
            explanation: "B's target capital = 7,20,000 × 2/6 = ₹2,40,000 against ₹2,60,000 held, so B withdraws 2,60,000 − 2,40,000 = ₹20,000.",
            difficulty: "Hard"
          }
        ]
      },

      /* ---------- Chapter 5: Retirement & Death of a Partner ---------- */
      ret: {

        /* ---- Practice Bank (merged with existing ids 1–10) ---- */
        numericals: [
          {
            id: 11, difficulty: "Medium",
            question: "A, B and C share profits 3:2:1. C retires, after which A and B agree to share future profits in the ratio 7:5. The gaining ratio of A:B is:",
            options: ["1:1", "3:2", "7:5", "1:6"],
            answerIndex: 0,
            explanation: "A gains 7/12 − 1/2 = 1/12 and B gains 5/12 − 1/3 = 1/12, so the gaining ratio is 1:1. The two gains total 2/12 = 1/6, exactly C's old share — the free check on every gaining ratio. Reading the answer off as 7:5 simply repeats the new ratio."
          },
          {
            id: 12, difficulty: "Medium",
            question: "On K's retirement the amounts due to him are capital ₹2,75,000, share of General Reserve ₹45,000, share of revaluation profit ₹18,000 and goodwill compensation ₹32,000. The firm pays ₹2,00,000 at once and carries the rest forward. The loan shown in the balance sheet will be:",
            options: ["₹1,70,000", "₹3,70,000", "₹1,88,000", "₹2,00,000"],
            answerIndex: 0,
            explanation: "Total settlement = 2,75,000 + 45,000 + 18,000 + 32,000 = ₹3,70,000. After paying ₹2,00,000 the balance 3,70,000 − 2,00,000 = ₹1,70,000 stands as K's loan — a liability of the firm. Quoting ₹3,70,000 forgets the immediate payment."
          },
          {
            id: 13, difficulty: "Easy",
            question: "The gains of the continuing partners, added together, must always equal:",
            options: ["The outgoing partner's profit share in the old firm", "A full year's profit of the firm", "The goodwill valued for settlement", "The profit on revaluation"],
            answerIndex: 0,
            explanation: "Whatever the departing partner gave up is precisely what the stayers picked up — so A's gain + B's gain = C's share. With gains of 1/12 each, 1/12 + 1/12 = 1/6 = C's share ✓, and a mismatch means the new ratio was written wrongly."
          },
          {
            id: 14, difficulty: "Medium",
            question: "Last year's profit was ₹5,40,000 (year ending 31st March) and a partner holding 1/6th share died on 31st October. On the time basis, the share of profit credited up to the date of death is:",
            options: ["₹52,500", "₹45,000", "₹90,000", "₹3,15,000"],
            answerIndex: 0,
            explanation: "April to 31st October is 7 months: 5,40,000 × 7/12 = ₹3,15,000, and the partner's 1/6th of it is 3,15,000 × 1/6 = ₹52,500. Using 6 months wrongly gives ₹45,000, and skipping the 1/6th share leaves ₹3,15,000."
          },
          {
            id: 15, difficulty: "Hard",
            question: "Profits of the firm were ₹90,000 (April–June), ₹1,50,000 (July–September) and ₹60,000 (October–December), and a partner with 1/4th share died on 31st December. The share of profit up to death on the product basis is:",
            options: ["₹25,000", "₹1,00,000", "₹30,000", "₹60,000"],
            answerIndex: 0,
            explanation: "Products: 90,000 × 3 = 2,70,000; 1,50,000 × 3 = 4,50,000; 60,000 × 3 = 1,80,000 → total ₹9,00,000 over 9 months = ₹1,00,000 a month, and 1/4th of it is ₹25,000. Leaving out the share gives ₹1,00,000, while quoting a single period's profit gives ₹60,000."
          },
          {
            id: 16, difficulty: "Easy",
            question: "The firm holds a life-insurance policy on partner M for ₹3,00,000 with a surrender value of ₹85,000. When M dies, the surrender value is:",
            options: ["Credited to the executor's account of M", "Kept as an asset of the continuing firm", "Paid to the continuing partners in the gaining ratio", "Transferred to the General Reserve"],
            answerIndex: 0,
            explanation: "The firm insured the life of a partner, so the money realised on that life belongs to the partner's estate: the surrender value of ₹85,000 is credited to M's executor along with capital, reserves, revaluation and goodwill."
          },
          {
            id: 17, difficulty: "Hard",
            question: "A, B and C share profits 3:2:1. C retires and A and B continue as 7:5. The firm's goodwill is ₹2,40,000, but the accountant charged C's goodwill compensation to the gainers in the OLD ratio 3:2 instead of the gaining ratio. A is charged:",
            options: ["₹4,000 too much", "₹4,000 too little", "₹20,000 too much", "₹24,000 too little"],
            answerIndex: 0,
            explanation: "C's entitlement = 2,40,000 × 1/6 = ₹40,000. The gaining ratio is 7/12 − 1/2 = 1/12 for A and 5/12 − 1/3 = 1/12 for B, i.e. 1:1, so A should pay ₹20,000; the old-ratio split 3:2 charged him 40,000 × 3/5 = ₹24,000 — that is ₹4,000 too much, and B correspondingly pays ₹4,000 too little."
          },
          {
            id: 18, difficulty: "Medium",
            question: "Average profit of the last four years is ₹4,80,000 and a partner holding 1/8th share died on 30th June (accounting year ending 31st March). Share of profit up to the date of death is:",
            options: ["₹15,000", "₹60,000", "₹30,000", "₹10,000"],
            answerIndex: 0,
            explanation: "Three months of the year had run: 4,80,000 × 3/12 = ₹1,20,000, and 1/8th of that is ₹15,000. Charging the whole year's 1/8th would wrongly give ₹60,000 and counting six months would wrongly give ₹30,000."
          },
          {
            id: 19, difficulty: "Easy",
            question: "Why is the deceased partner's share of profit for the part-year estimated rather than taken straight from the books?",
            options: ["Because the books are closed only once a year, so no profit has been struck for the part-year", "Because the partnership deed forbids the heirs from receiving profit", "Because the firm never earns profit in the year a partner dies", "Because the gaining partners must approve the figure first"],
            answerIndex: 0,
            explanation: "Accounts are closed on 31st March, so at a death in the middle of the year the part-year profit simply does not exist in the books — it has to be estimated on the time or product basis and credited to the deceased's account."
          },
          {
            id: 20, difficulty: "Easy",
            question: "A retiring partner's settlement is ₹4,20,000, of which ₹1,50,000 is paid at once. In the revised balance sheet the unpaid balance is shown as:",
            options: ["A loan of ₹2,70,000 — a liability of the firm", "A loan of ₹4,20,000 — the full settlement", "Capital of ₹1,50,000", "An asset of ₹2,70,000"],
            answerIndex: 0,
            explanation: "4,20,000 − 1,50,000 = ₹2,70,000 is still owed, so the partner's capital account is closed and a loan of ₹2,70,000 takes its place on the liability side; only ₹1,50,000 has actually left the firm's bank."
          },
          {
            id: 21, difficulty: "Medium",
            question: "The revaluation account at retirement closes with a loss of ₹48,000, shared by the old partners in the ratio 3:1. The outgoing partner (share 1/4th) is debited with:",
            options: ["₹12,000", "₹36,000", "₹24,000", "₹4,800"],
            answerIndex: 0,
            explanation: "Revaluation belongs to the old agreement, so the loss goes in the old ratio 3:1: 48,000 × 1/4 = ₹12,000 debited to the outgoing partner and ₹36,000 shared between the continuing partners. Using the gaining ratio or dividing equally would give a different figure."
          },
          {
            id: 22, difficulty: "Medium",
            question: "On N's death the executor receives capital ₹3,50,000, share of General Reserve ₹30,000, share of revaluation profit ₹12,000, goodwill compensation ₹48,000 and profit up to the date of death ₹21,000. The total credited to the executor's account is:",
            options: ["₹4,61,000", "₹4,40,000", "₹4,13,000", "₹4,28,000"],
            answerIndex: 0,
            explanation: "3,50,000 + 30,000 + 12,000 + 48,000 + 21,000 = ₹4,61,000. Leaving out the part-year profit gives ₹4,40,000, leaving out goodwill gives ₹4,13,000, and leaving out both the revaluation share and the death profit gives ₹4,28,000."
          },
          {
            id: 23, difficulty: "Easy",
            question: "Which of these is NOT added to the outgoing partner's settlement account?",
            options: ["The capital balances of the continuing partners", "The outgoing partner's share of General Reserve", "The outgoing partner's share of revaluation profit", "Goodwill compensation funded by the gainers"],
            answerIndex: 0,
            explanation: "The settlement gathers everything owed TO the departing partner — capital, reserves, revaluation and goodwill. The continuing partners' capitals stay where they are, simply restated for the new structure and the revalued figures."
          },
          {
            id: 24, difficulty: "Hard",
            question: "A, B and C share profits 5:4:3. C retires and A and B continue in the ratio 5:4. C's capital is ₹4,00,000, General Reserve is ₹2,40,000, revaluation profit is ₹72,000 and the firm's goodwill is ₹3,60,000. C's total settlement is:",
            options: ["₹5,68,000", "₹4,78,000", "₹5,08,000", "₹5,50,000"],
            answerIndex: 0,
            explanation: "C's share is 3/12 = 1/4: reserve 2,40,000 × 1/4 = 60,000, revaluation 72,000 × 1/4 = 18,000 and goodwill 3,60,000 × 1/4 = 90,000. With capital, 4,00,000 + 60,000 + 18,000 + 90,000 = ₹5,68,000. Dropping the goodwill gives ₹4,78,000, the reserve ₹5,08,000 and the revaluation ₹5,50,000."
          },
          {
            id: 25, difficulty: "Hard",
            question: "A, B and C share profits 3:2:1. C dies leaving capital of ₹3,60,000; the firm holds a General Reserve of ₹1,80,000, a revaluation profit of ₹54,000 and goodwill of ₹3,00,000, while last year's profit was ₹4,80,000 and the death occurred on 31st December. The amount credited to the executor's account is:",
            options: ["₹4,09,000", "₹3,49,000", "₹4,00,000", "₹3,59,000"],
            answerIndex: 0,
            explanation: "Reserve 1,80,000 × 1/6 = 30,000, revaluation 54,000 × 1/6 = 9,000, goodwill 3,00,000 × 1/6 = 50,000 and death profit 4,80,000 × 9/12 × 1/6 = 60,000. Together with capital: 3,60,000 + 30,000 + 9,000 + 50,000 + 60,000 = ₹4,09,000. Skipping the death profit gives ₹3,49,000, skipping revaluation ₹4,00,000 and skipping goodwill ₹3,59,000."
          }
        ],

        /* ---- Interactive calculation bench (engine strings copied
               verbatim from data-12b.js; only the case list grows) ---- */
        activity: {
          type: "calc",
          title: "Retirement Settlement Bench",
          instruction: "Work each settlement exactly as the working note should appear in the exam — every figure is checked before the bench reveals its own.",
          problems: [
            {
              prompt: "V retires carrying capital of ₹2,40,000, a General Reserve share of ₹36,000, a revaluation share of ₹14,400 and goodwill compensation of ₹30,000. The firm pays ₹1,20,000 at once. A clerk's margin note reads 'total settlement ₹3,20,400, loan carried ₹2,00,400'. Verify both figures.",
              inputs: [
                { key: "tot", label: "Total settlement (₹)", placeholder: "e.g. 320400" },
                { key: "loan", label: "Loan carried forward (₹)", placeholder: "e.g. 200400" }
              ],
              answers: { tot: 320400, loan: 200400 },
              formula: "Capital + reserves + revaluation + goodwill − immediate payment",
              working: "2,40,000 + 36,000 + 14,400 + 30,000 = <b>₹3,20,400</b>; after the payment of ₹1,20,000 the balance 3,20,400 − 1,20,000 = <b>₹2,00,400</b> stands as V's loan — the clerk's note is right on both counts."
            },
            {
              prompt: "A partner holding 1/6th of the firm died on 31st October in a year ending 31st March, when the last year's profit was ₹5,40,000. The clerk counted 7 months up to the death and wrote a credit of ₹52,500 to the deceased's account on the time basis. Confirm the months and the money.",
              inputs: [
                { key: "mo", label: "Months elapsed (of 12)", placeholder: "e.g. 7" },
                { key: "sp", label: "Share of profit credited (₹)", placeholder: "e.g. 52500" }
              ],
              answers: { mo: 7, sp: 52500 },
              formula: "Profit × months ÷ 12 × share",
              working: "April to 31st October is <b>7 months</b>. 5,40,000 × 7/12 = 3,15,000 and 3,15,000 × 1/6 = <b>₹52,500</b> credited to the deceased's account, later transferred to the executor."
            },
            {
              prompt: "On the product basis the firm earned ₹60,000 (April–June) and ₹1,20,000 (July–September), and a partner holding 1/3rd share died on 30th September. A note in the ledger reads 'weighted average ₹90,000 a month, share credited ₹30,000'. Check both figures.",
              inputs: [
                { key: "avg", label: "Weighted monthly average (₹)", placeholder: "e.g. 90000" },
                { key: "sp", label: "Share credited (₹)", placeholder: "e.g. 30000" }
              ],
              answers: { avg: 90000, sp: 30000 },
              formula: "Σ(profit × months) ÷ months counted × share",
              working: "Products up to the death: 60,000 × 3 = 1,80,000 and 1,20,000 × 3 = 3,60,000 → 5,40,000 ÷ 6 months = <b>₹90,000</b> a month; × 1/3 = <b>₹30,000</b> credited. The ledger note is correct."
            }
          ]
        },

        examCases: [
          {
            id: 3,
            title: "A death between two balance sheet dates",
            passage: "Arun, Bina and Chand share profits 5:3:2 with books closed on 31st March. Chand died on 31st December and last year's profit was ₹6,00,000. On that date the firm held a General Reserve of ₹2,00,000 and the revaluation account stood at a profit of ₹80,000. Goodwill of the firm is ₹5,00,000, Arun and Bina will continue in the ratio 5:3, and Chand's capital is ₹3,00,000.",
            difficulty: "Hard",
            subs: [
              {
                q: "What is Chand's share of profit up to the date of death on the time basis?",
                options: ["₹90,000", "₹1,50,000", "₹45,000", "₹60,000"],
                answerIndex: 0,
                reasoning: "Nine months had run from April to 31st December: 6,00,000 × 9/12 = ₹4,50,000, and Chand's 1/5th of it = ₹90,000."
              },
              {
                q: "What is Arun's gain as a fraction?",
                options: ["1/8", "3/40", "1/5", "1/10"],
                answerIndex: 0,
                reasoning: "Arun moves from 1/2 to 5/8, so his gain is 5/8 − 1/2 = 1/8; Bina gains 3/40, and the two together total 1/5 = Chand's share."
              },
              {
                q: "How much does Arun contribute towards Chand's share of goodwill?",
                options: ["₹62,500", "₹37,500", "₹1,00,000", "₹50,000"],
                answerIndex: 0,
                reasoning: "Chand's entitlement is 5,00,000 × 1/5 = ₹1,00,000, funded by the gainers in the gaining ratio 1/8 : 3/40 = 5:3, so Arun pays ₹62,500 and Bina ₹37,500."
              },
              {
                q: "What total is credited to Chand's executor's account?",
                options: ["₹5,46,000", "₹4,56,000", "₹5,30,000", "₹4,46,000"],
                answerIndex: 0,
                reasoning: "Capital 3,00,000 + reserve 40,000 + revaluation 16,000 + goodwill 1,00,000 + part-year profit 90,000 = ₹5,46,000, before any payment is made to the heirs."
              }
            ]
          },
          {
            id: 4,
            title: "Paying out a retiring partner",
            passage: "Suresh, Tara and Uma share profits 4:3:2. Uma retires and the remaining two continue in the ratio 4:3. Uma's capital is ₹4,05,000, General Reserve stands at ₹1,35,000, the revaluation account closes with a profit of ₹72,000 and the firm's goodwill is ₹3,15,000. ₹2,00,000 is paid to Uma immediately and the balance is carried forward.",
            difficulty: "Medium",
            subs: [
              {
                q: "What is Uma's share of the General Reserve?",
                options: ["₹30,000", "₹60,000", "₹54,000", "₹15,000"],
                answerIndex: 0,
                reasoning: "Reserves are settled in the old ratio 4:3:2: 1,35,000 × 2/9 = ₹30,000 credited to Uma."
              },
              {
                q: "What does Uma receive for her share of goodwill?",
                options: ["₹70,000", "₹40,000", "₹30,000", "₹3,15,000"],
                answerIndex: 0,
                reasoning: "3,15,000 × 2/9 = ₹70,000, funded by Suresh ₹40,000 and Tara ₹30,000 in the gaining ratio 4:3."
              },
              {
                q: "What is Uma's total settlement before the immediate payment?",
                options: ["₹5,21,000", "₹5,05,000", "₹4,51,000", "₹4,91,000"],
                answerIndex: 0,
                reasoning: "Capital 4,05,000 + reserve 30,000 + revaluation 16,000 + goodwill 70,000 = ₹5,21,000; dropping the revaluation gives ₹5,05,000 and dropping the goodwill ₹4,51,000."
              },
              {
                q: "What balance is carried forward as Uma's loan after ₹2,00,000 is paid?",
                options: ["₹3,21,000", "₹5,21,000", "₹3,05,000", "₹2,00,000"],
                answerIndex: 0,
                reasoning: "5,21,000 − 2,00,000 = ₹3,21,000, shown as a loan of the firm — Uma's capital account itself is closed."
              }
            ]
          }
        ],

        examNumericals: [
          {
            id: 3,
            q: "Last year's profit was ₹5,40,000 (year ending 31st March) and a partner holding 1/6th share died on 31st October. Find the share of profit credited on the time basis (₹).",
            value: 52500,
            explanation: "April to 31st October = 7 months: 5,40,000 × 7/12 = 3,15,000; × 1/6 = ₹52,500.",
            difficulty: "Medium"
          },
          {
            id: 4,
            q: "The firm's goodwill is ₹3,60,000 and a partner holding 1/4th share retires. The goodwill is to be funded by the gaining partners in the ratio 2:1. Find the amount the first gainer pays (₹).",
            value: 60000,
            explanation: "Outgoing partner's share = 3,60,000 × 1/4 = ₹90,000; the first gainer bears 2/3 of it = 60,000 (the other pays ₹30,000).",
            difficulty: "Easy"
          },
          {
            id: 5,
            q: "A retiring partner's dues total ₹4,32,000, of which ₹1,44,000 is paid at once. Find the loan carried forward (₹).",
            value: 288000,
            explanation: "4,32,000 − 1,44,000 = ₹2,88,000, shown as the retiring partner's loan — a liability of the firm until it is paid.",
            difficulty: "Medium"
          }
        ]
      }
    },

    /* ============ QUIZ (ids 70176–70205) ============ */
    quiz: [
      { id: 70176, chapter: "adm", difficulty: "Easy",
        q: "C brings ₹2,00,000 in cash as capital on his admission. The entry to record it is:",
        options: ["Cash A/c Dr ₹2,00,000 to C's Capital A/c", "C's Capital A/c Dr to Cash A/c", "Cash A/c Dr to Goodwill A/c", "Bank A/c Dr to Revaluation A/c"],
        answerIndex: 0,
        explanation: "Capital brought in is a simple receipt: Cash (or Bank) A/c Dr ₹2,00,000 to C's Capital A/c, which also raises the firm's total assets. Nothing is revalued by this entry — revaluation deals with old assets and liabilities only." },
      { id: 70177, chapter: "adm", difficulty: "Easy",
        q: "The Profit and Loss Account carries a debit balance of ₹40,000 when C is admitted (A:B = 3:2). This accumulated loss is:",
        options: ["Debited to A ₹24,000 and B ₹16,000 — the old partners alone", "Shared between A, B and C in the new ratio", "Debited to the revaluation account and shared with C", "Carried forward to the next year's accounts"],
        answerIndex: 0,
        explanation: "A past loss belongs to the old agreement: 40,000 × 3/5 = ₹24,000 charged to A and 40,000 × 2/5 = ₹16,000 to B. C neither earned nor suffers it, and it never survives into the revised balance sheet." },
      { id: 70178, chapter: "adm", difficulty: "Easy",
        q: "The sacrifices of the old partners, added together, must equal:",
        options: ["The new partner's share of profits", "The firm's goodwill value", "The total capital brought in by the new partner", "The revaluation profit of the firm"],
        answerIndex: 0,
        explanation: "The newcomer's entire share is funded out of the slices the old partners surrender, so the sacrifices must add up to it — for a 1/5th share the sacrifices must total 5/25 if the ratio is expressed over 25. A mismatch means the new ratio was computed wrongly." },
      { id: 70179, chapter: "adm", difficulty: "Easy",
        q: "Which of these is credited to the Revaluation Account at admission?",
        options: ["A fall in the amount the firm owes its creditors", "A fall in the value of machinery", "An increase in the firm's warranty liability", "Writing off a fictitious asset"],
        answerIndex: 0,
        explanation: "A liability expected to shrink from ₹1,00,000 to ₹94,000 is a gain of ₹6,000, so it is credited to revaluation. Falls in assets, rises in liabilities and write-offs of fictitious assets all sit on the debit side because they reduce the revaluation profit." },
      { id: 70180, chapter: "adm", difficulty: "Easy",
        q: "Before a single journal entry is passed at admission, the accountant must first compute:",
        options: ["The new profit-sharing ratio and then the sacrificing ratio", "The total of the revised balance sheet", "The interest on capital of the new partner", "The drawings the new partner may make"],
        answerIndex: 0,
        explanation: "Everything else hangs on those two ratios: goodwill follows the sacrifice, capitals follow the new ratio, and the revised balance sheet follows both. Building the statement first means redoing it once the ratios are known." },
      { id: 70181, chapter: "adm", difficulty: "Medium",
        q: "The firm's goodwill is ₹2,00,000. D is admitted for 1/4th of the profits and brings that share in cash, while A and B sacrifice in the ratio 3:1. A's credit from the premium is:",
        options: ["₹37,500", "₹12,500", "₹50,000", "₹25,000"],
        answerIndex: 0,
        explanation: "D brings 2,00,000 × 1/4 = ₹50,000, divided between the sacrificers 3:1 — A takes 50,000 × 3/4 = ₹37,500 and B takes ₹12,500. Half of the premium or the premium itself are common mis-readings of the sacrifice ratio." },
      { id: 70182, chapter: "adm", difficulty: "Medium",
        q: "A revaluation profit of ₹18,000 was wrongly shared in the new ratio 2:2:1 instead of the old ratio 3:2. The amount wrongly credited to the new partner C is:",
        options: ["₹3,600", "₹7,200", "₹10,800", "₹9,000"],
        answerIndex: 0,
        explanation: "In the new ratio 2:2:1, C's slice is 18,000 × 1/5 = ₹3,600 — a share the change in values never earned him, since the movement happened before he joined. Correctly, the whole ₹18,000 belongs to A and B in the old ratio." },
      { id: 70183, chapter: "adm", difficulty: "Medium",
        q: "The balance sheet drawn after admission still shows a General Reserve of ₹80,000. This tells you that the accountant has:",
        options: ["Forgotten to distribute the reserve to the old partners in the old ratio", "Correctly carried the reserve into the new firm", "Revalued the reserve along with the assets", "Added the reserve to the new partner's capital"],
        answerIndex: 0,
        explanation: "A reserve is an accumulated profit of the old agreement and must be closed into the old partners' capitals on reconstitution — 80,000 split in the old ratio. Carrying it forward hands the old partners' past earnings to the newcomer as well." },
      { id: 70184, chapter: "adm", difficulty: "Medium",
        q: "Which pair of items is shared in two DIFFERENT ratios at admission?",
        options: ["Revaluation profit (old ratio) and premium for goodwill (sacrificing ratio)", "General Reserve and revaluation profit", "Premium for goodwill and General Reserve", "Accumulated loss and revaluation profit"],
        answerIndex: 0,
        explanation: "Revaluation measures what changed under the old agreement, so the old ratio governs it; the premium compensates the exact future share surrendered, so the sacrificing ratio governs it. Reserves and accumulated losses also follow the old ratio — which is why the other three pairs are alike." },
      { id: 70185, chapter: "adm", difficulty: "Medium",
        q: "The firm's goodwill is agreed at ₹4,80,000. E is admitted for 3/10th of the profits and brings his share of goodwill in cash. The cash E pays is:",
        options: ["₹1,44,000", "₹96,000", "₹1,60,000", "₹1,20,000"],
        answerIndex: 0,
        explanation: "4,80,000 × 3/10 = ₹1,44,000, which is credited to the sacrificing partners in their sacrificing ratio. Treating the share as 1/5 gives ₹96,000 and as 1/3 gives ₹1,60,000 — both wrong fractions of the same firm." },
      { id: 70186, chapter: "adm", difficulty: "Medium",
        q: "Old goodwill of ₹25,000 stands in the books at admission and A:B share profits 3:2. The entry to write it off is:",
        options: ["Old Partners' Capital A/cs Dr (A ₹15,000, B ₹10,000) to Goodwill A/c", "Goodwill A/c Dr to Old Partners' Capital A/cs", "Revaluation A/c Dr to Goodwill A/c", "Goodwill A/c Dr to Bank A/c"],
        answerIndex: 0,
        explanation: "The old purchased figure is removed by charging the old partners in the old ratio: 25,000 × 3/5 = ₹15,000 to A and 25,000 × 2/5 = ₹10,000 to B. Only after this write-off is the premium method applied, so the same reputation is not counted twice." },
      { id: 70187, chapter: "adm", difficulty: "Hard",
        q: "The firm fixes its total capital at ₹5,00,000 with a new ratio of 3:3:2. A's capital in the old books is ₹2,00,000 and B's is ₹1,50,000. As a result:",
        options: ["A withdraws ₹12,500 while B brings in ₹37,500", "A brings in ₹12,500 while B withdraws ₹37,500", "A withdraws ₹50,000 and B needs no adjustment", "Both A and B bring in ₹12,500 each"],
        answerIndex: 0,
        explanation: "Targets: A and B each need 5,00,000 × 3/8 = ₹1,87,500 and C needs ₹1,25,000. A already holds ₹2,00,000, so ₹12,500 comes out; B holds ₹1,50,000, so ₹37,500 goes in. 1,87,500 + 1,87,500 + 1,25,000 = ₹5,00,000 ✓." },
      { id: 70188, chapter: "adm", difficulty: "Hard",
        q: "A and B share 3:2 with a General Reserve of ₹75,000; the revaluation closes with a loss of ₹30,000; C is admitted for 1/5th and brings ₹20,000 for goodwill, sacrificing 3:2. On reconstitution day B's account is:",
        options: ["Credited ₹26,000 net — nothing is debited to him", "Debited ₹12,000, the revaluation loss alone", "Debited ₹4,000 after setting the loss against goodwill", "Credited ₹30,000, the reserve share alone"],
        answerIndex: 0,
        explanation: "B gets reserve 75,000 × 2/5 = +₹30,000, suffers the revaluation loss 30,000 × 2/5 = −₹12,000 and receives goodwill 20,000 × 2/5 = +₹8,000 — a net credit of ₹26,000. Ignoring the goodwill leaves only ₹18,000 and mis-reading the loss as a debit of ₹12,000 is the classic slip." },
      { id: 70189, chapter: "adm", difficulty: "Hard",
        q: "A and B share profits 7:5. C is admitted for 1/3rd of the profits, after which A's share is fixed at 1/2. B's new share and the sacrificing ratio A:B are:",
        options: ["B gets 1/6 and the sacrifice is 1:3", "B gets 1/4 and the sacrifice is 1:1", "B gets 1/6 and the sacrifice is 3:1", "B gets 1/3 and the sacrifice is 1:3"],
        answerIndex: 0,
        explanation: "A gives up 7/12 − 1/2 = 1/12. B is left with 1 − 1/2 − 1/3 = 1/6, so B gives up 5/12 − 1/6 = 1/4. The sacrifice 1/12 : 1/4 = 1:3, and the two sacrifices total 1/3 = C's share ✓." },
      { id: 70190, chapter: "adm", difficulty: "Hard",
        q: "The firm's goodwill is ₹90,000 and C is admitted for 1/5th, bringing ₹18,000 in cash. A and B sacrifice in the ratio 2:1, but the accountant credited the premium in the old ratio 3:2. A has been credited:",
        options: ["₹1,200 less than due", "₹1,200 more than due", "₹6,000 more than due", "The whole ₹18,000"],
        answerIndex: 0,
        explanation: "C brings 90,000 × 1/5 = ₹18,000. By the sacrificing ratio 2:1, A should receive 18,000 × 2/3 = ₹12,000, but the old-ratio split 3:2 gave him 18,000 × 3/5 = ₹10,800 — so A is credited ₹1,200 less than due, and B receives ₹1,200 more." },
      { id: 70191, chapter: "ret", difficulty: "Easy",
        q: "The entry to record goodwill compensation payable to a retiring partner, funded by the gaining partners, is:",
        options: ["Gaining Partners' Capital A/cs Dr to the Retiring Partner's Capital A/c", "Retiring Partner's Capital A/cs Dr to the Gaining Partners", "Goodwill A/c Dr to Cash A/c", "Revaluation A/c Dr to the Retiring Partner's Capital A/c"],
        answerIndex: 0,
        explanation: "The gainers are buying the outgoing share of future profits, so their capitals are debited and the retiring partner's capital is credited in the gaining ratio. Cash moves only if the partners settle outside the firm — and no goodwill asset is ever created." },
      { id: 70192, chapter: "ret", difficulty: "Easy",
        q: "When a partner retires from a firm, the firm is said to be:",
        options: ["Reconstituted under a fresh agreement between the remaining partners", "Dissolved and wound up", "Converted into a company", "Placed under the court's supervision"],
        answerIndex: 0,
        explanation: "The old partnership ends and a new one begins with the continuing partners — the business itself carries on. Only a dissolution ends the business, and that needs the realisation account which retirement never opens." },
      { id: 70193, chapter: "ret", difficulty: "Easy",
        q: "The share of profit of a partner who died on 15th October is credited to:",
        options: ["The deceased partner's capital account, later transferred to the executor's account", "The gaining partners in the gaining ratio", "The General Reserve of the firm", "The Profit and Loss Account of the next year"],
        answerIndex: 0,
        explanation: "Profit up to the date of death belongs to the partner for the months they were alive: it is credited to the deceased's capital account and, together with capital, reserves, revaluation and goodwill, moves into the executor's account for payment to the heirs." },
      { id: 70194, chapter: "ret", difficulty: "Easy",
        q: "Interest on the amount left unpaid to a retiring partner is allowed only:",
        options: ["If the partnership deed or the Partnership Act provides for it", "Always, at 12% per annum by law", "Only if the continuing partners agree in writing after three years", "Never — loans to partners carry no interest"],
        answerIndex: 0,
        explanation: "The unpaid settlement is a loan of the firm like any other, and its price follows the agreement: the deed's rate applies, and where the deed is silent the Indian Partnership Act, 1932 provides interest at 6% per annum on a partner's loan." },
      { id: 70195, chapter: "ret", difficulty: "Easy",
        q: "The firm's goodwill is valued at the time of a partner's retirement in order to:",
        options: ["Fix the compensation the gaining partners must pay the outgoing partner for their share of profits", "Show the goodwill as an asset in the revised balance sheet", "Increase the revaluation profit of the firm", "Determine the General Reserve to be distributed"],
        answerIndex: 0,
        explanation: "The departing partner gives up a slice of future super-profits, and the gainers keep that slice — so goodwill is priced only to move money from the gainers to the outgoing partner. Under AS-26 nothing is recorded as an asset." },
      { id: 70196, chapter: "ret", difficulty: "Medium",
        q: "Average profit of the last three years is ₹2,40,000 and a partner holding 1/8th share died on 31st August (year ending 31st March). The share of profit up to death on the time basis is:",
        options: ["₹12,500", "₹25,000", "₹20,000", "₹30,000"],
        answerIndex: 0,
        explanation: "Five months had run from April to 31st August: 2,40,000 × 5/12 = ₹1,00,000, and 1/8th of it is ₹12,500. Counting ten months gives ₹25,000 and skipping the time element gives the full-year share of ₹30,000." },
      { id: 70197, chapter: "ret", difficulty: "Medium",
        q: "A, B and C share profits 7:5:2. C retires and A and B continue in the ratio 3:2. The gaining ratio of A:B is:",
        options: ["7:3", "7:5", "3:2", "1:1"],
        answerIndex: 0,
        explanation: "A moves from 7/14 = 1/2 to 3/5, gaining 3/5 − 1/2 = 1/10 = 7/70. B moves from 5/14 to 2/5, gaining 2/5 − 5/14 = 3/70. So the gaining ratio is 7:3 and the gains total 10/70 = 1/7 = C's share ✓." },
      { id: 70198, chapter: "ret", difficulty: "Medium",
        q: "The firm earned ₹1,20,000 (April–September) and ₹90,000 (October–December), and a partner with 1/4th share died on 31st December. The product-basis share of profit is:",
        options: ["₹27,500", "₹1,10,000", "₹22,500", "₹30,000"],
        answerIndex: 0,
        explanation: "Products: 1,20,000 × 6 = 7,20,000 and 90,000 × 3 = 2,70,000 → ₹9,90,000 over 9 months = ₹1,10,000 a month; 1/4th of it is ₹27,500. Quoting the monthly average itself gives ₹1,10,000 and using the last quarter's profit as the annual rate gives ₹22,500." },
      { id: 70199, chapter: "ret", difficulty: "Medium",
        q: "The retiring partner's dues of ₹2,61,000 are not paid immediately. The entry at reconstitution is:",
        options: ["Retiring Partner's Capital A/c Dr ₹2,61,000 to Retiring Partner's Loan A/c", "Cash A/c Dr to Retiring Partner's Loan A/c", "Retiring Partner's Loan A/c Dr to Capital A/c", "Bank A/c Dr to Realisation A/c"],
        answerIndex: 0,
        explanation: "The capital account must be closed, so its balance is carried to a loan account: Retiring Partner's Capital A/c Dr ₹2,61,000 to Retiring Partner's Loan A/c. No cash moves in this entry, and the loan appears on the liability side of the revised balance sheet." },
      { id: 70200, chapter: "ret", difficulty: "Medium",
        q: "The balance sheet prepared after a partner's retirement shows no General Reserve. The correct reason is:",
        options: ["It was distributed among all partners in the old ratio before reconstitution", "It was written off against the revaluation profit", "It was paid only to the retiring partner", "It was set against the goodwill of the firm"],
        answerIndex: 0,
        explanation: "A reserve is an accumulated profit of the old agreement, so on retirement every partner — including the one leaving — takes their old-ratio slice: with ₹1,80,000 and shares 3:2:1, the outgoing partner receives ₹30,000. Nothing is left for the new balance sheet." },
      { id: 70201, chapter: "ret", difficulty: "Medium",
        q: "A partner retires holding 1/8th share and the firm's goodwill is ₹2,40,000. The gainers should pay in the ratio 3:1, but the amount was split equally, so ₹15,000 was taken from each gainer. The second gainer has been:",
        options: ["Charged ₹7,500 too much", "Charged ₹15,000 too much", "Charged ₹7,500 too little", "Charged ₹22,500 too little"],
        answerIndex: 0,
        explanation: "The outgoing partner's entitlement is 2,40,000 × 1/8 = ₹30,000. By the gaining ratio 3:1 the first gainer should pay ₹22,500 and the second only ₹7,500, but the equal split charged him ₹15,000 — ₹7,500 too much." },
      { id: 70202, chapter: "ret", difficulty: "Hard",
        q: "A, B and C share profits 5:3:2. C retires and A and B continue as 3:2. C's capital is ₹3,20,000, General Reserve is ₹1,80,000, revaluation profit is ₹45,000 and the firm's goodwill is ₹2,70,000. C's total settlement is:",
        options: ["₹4,19,000", "₹3,65,000", "₹4,10,000", "₹3,20,000"],
        answerIndex: 0,
        explanation: "C's share is 1/5 of each item: reserve 1,80,000 × 1/5 = 36,000, revaluation 45,000 × 1/5 = 9,000, goodwill 2,70,000 × 1/5 = 54,000. With capital, 3,20,000 + 36,000 + 9,000 + 54,000 = ₹4,19,000; dropping the goodwill gives ₹3,65,000 and the revaluation ₹4,10,000." },
      { id: 70203, chapter: "ret", difficulty: "Hard",
        q: "A retiring partner's settlement is ₹2,61,000, of which ₹1,00,000 is paid at once. The deed allows interest at 6% per annum on the unpaid balance for the 8 months it stays outstanding. The interest is:",
        options: ["₹6,440", "₹9,660", "₹8,050", "₹3,220"],
        answerIndex: 0,
        explanation: "The unpaid balance is 2,61,000 − 1,00,000 = ₹1,61,000, so interest = 1,61,000 × 6% × 8/12 = ₹6,440. Charging the rate for a full year wrongly gives ₹9,660 and counting ten months wrongly gives ₹8,050." },
      { id: 70204, chapter: "ret", difficulty: "Hard",
        q: "A, B and C share profits 5:3:2 and revaluation closes with a profit of ₹1,20,000 at C's retirement. It was wrongly credited in the new ratio of the continuing partners, 5:3. A has received:",
        options: ["₹15,000 too much", "₹15,000 too little", "₹24,000 too much", "₹60,000 too little"],
        answerIndex: 0,
        explanation: "Correctly the profit goes in the old ratio 5:3:2 — A 1,20,000 × 5/10 = ₹60,000, B ₹36,000 and the retiring C ₹24,000. The new ratio 5:3 gave A 1,20,000 × 5/8 = ₹75,000, which is ₹15,000 too much, and it shut C out of his ₹24,000 altogether." },
      { id: 70205, chapter: "ret", difficulty: "Hard",
        q: "A partner with 1/4th share died on 30th June (year ending 31st March) when last year's profit was ₹4,20,000. On that day the firm held a General Reserve of ₹96,000, a revaluation profit of ₹24,000 and goodwill of ₹1,80,000, while the deceased's capital was ₹2,50,000. The total credited to the executor's account is:",
        options: ["₹3,51,250", "₹3,25,000", "₹3,45,250", "₹3,26,250"],
        answerIndex: 0,
        explanation: "Death profit 4,20,000 × 3/12 × 1/4 = 26,250; reserve 96,000 × 1/4 = 24,000; revaluation 24,000 × 1/4 = 6,000; goodwill 1,80,000 × 1/4 = 45,000. With capital 2,50,000 the executor receives ₹3,51,250; omitting the death profit gives ₹3,25,000, omitting the revaluation ₹3,45,250 and omitting the goodwill ₹3,26,250." },
    ],

    /* ============ FLASHCARDS (ids 71141–71164) ============ */
    flashcards: [
      { id: 71141, chapter: "adm", front: "Order of work on the day of admission?", back: "New ratio → sacrificing ratio → revaluation → distribute reserves and write off old goodwill → pay the premium to the sacrificers → fix capitals → draw the revised balance sheet." },
      { id: 71142, chapter: "adm", front: "Which side of the Revaluation Account takes a rise in an asset?", back: "The credit side — it raises the revaluation profit. Falls in assets, rises in liabilities and write-offs of fictitious assets go on the debit side." },
      { id: 71143, chapter: "adm", front: "Journal entry when the new partner pays for goodwill in cash?", back: "Bank A/c Dr to the Sacrificing Partners' Capital A/cs in the sacrificing ratio. The firm keeps no goodwill asset (AS-26)." },
      { id: 71144, chapter: "adm", front: "Treatment of an accumulated Profit and Loss debit balance at admission?", back: "Debited to the old partners in the old ratio — a past loss is theirs alone. It never reaches the revised balance sheet." },
      { id: 71145, chapter: "adm", front: "Finding the firm's total capital from the new partner's contribution?", back: "Total capital = new partner's capital ÷ the partner's share. A capital of ₹1,80,000 for a 1/8th share fixes the whole firm at ₹14,40,000." },
      { id: 71146, chapter: "adm", front: "Can revaluation profit be shared in the new ratio?", back: "Never. The changes happened before admission, so only the old partners share them in the old ratio — the new partner's claim starts from the day he joins." },
      { id: 71147, chapter: "adm", front: "What does the sacrificing ratio NOT decide?", back: "It decides only the goodwill compensation. Revaluation, reserves and accumulated losses always follow the old ratio." },
      { id: 71148, chapter: "adm", front: "Goodwill is adjusted through capitals instead of cash — who is debited?", back: "The new partner's capital account is debited for his share of the firm's goodwill, and the sacrificing partners are credited — only the route of settlement changes." },
      { id: 71149, chapter: "adm", front: "An unrecorded liability of ₹20,000 is discovered at admission. Where does it go?", back: "Debited to the Revaluation Account as a rise in liability, reducing the revaluation profit that the old partners share in the old ratio." },
      { id: 71150, chapter: "adm", front: "Why value goodwill at admission if it is never recorded?", back: "The value is needed only to settle partners — it fixes how much the newcomer pays the sacrificers for the profit slice they surrendered." },
      { id: 71151, chapter: "adm", front: "What exactly happens to the partnership on admission?", back: "The old deed ends and the firm is reconstituted under a new agreement with the new ratio. The business continues; the partnership does not." },
      { id: 71152, chapter: "adm", front: "Why must the sacrifices of the old partners total the new partner's share?", back: "Because the newcomer's entire share is carved out of what the old partners gave up — a mismatch means the new ratio was computed wrongly." },
      { id: 71153, chapter: "ret", front: "What must the continuing partners' gains add up to?", back: "The outgoing partner's profit share — whatever they lost, the stayers picked up. It is a free check on every gaining ratio." },
      { id: 71154, chapter: "ret", front: "Order in which items enter the outgoing partner's settlement?", back: "Capital balance, then reserves and revaluation in the old ratio, then goodwill compensation in the gaining ratio — and, on death, profit up to the date of death." },
      { id: 71155, chapter: "ret", front: "Journal entry for goodwill paid to a retiring partner?", back: "Gaining Partners' Capital A/cs Dr to the Retiring Partner's Capital A/c, in the gaining ratio." },
      { id: 71156, chapter: "ret", front: "Why is goodwill valued when a partner retires?", back: "Only to price the compensation the gainers owe the outgoing partner for their share of future super-profits — never to show an asset (AS-26)." },
      { id: 71157, chapter: "ret", front: "Which amounts are collected in a deceased partner's executor's account?", back: "Capital, share of reserves, share of revaluation, goodwill compensation and profit up to the date of death — paid out from there to the legal heirs." },
      { id: 71158, chapter: "ret", front: "Which ratio must NEVER fund goodwill at retirement?", back: "The old ratio. Only the gaining ratio measures who bought the departing share, so only the gainers pay for it." },
      { id: 71159, chapter: "ret", front: "Does a retired partner share in profits earned after retirement?", back: "No. From the date of retirement the claim is limited to interest on the unpaid loan, and only if the deed or the Act allows it." },
      { id: 71160, chapter: "ret", front: "Entry when a retiring partner's dues are left unpaid?", back: "Retiring Partner's Capital A/c Dr to Retiring Partner's Loan A/c — capital is closed and the balance becomes a liability of the firm." },
      { id: 71161, chapter: "ret", front: "Firm holds a life policy on a partner who dies — what happens to it?", back: "The surrender value is credited to the deceased's executor's account: the money belongs to the partner's estate, not the continuing firm." },
      { id: 71162, chapter: "ret", front: "How do continuing partners' capitals appear after a retirement?", back: "At revalued figures and in the new profit-sharing ratio, with reserves and old goodwill already removed and any loan to the outgoing partner shown separately." },
      { id: 71163, chapter: "ret", front: "Which extra item does a death settlement include that a retirement does not?", back: "The deceased partner's share of profit for the part-year from the start of the year to the date of death." },
      { id: 71164, chapter: "ret", front: "Why is the part-year profit up to death an estimate?", back: "The books close only on 31st March, so no profit has been struck for the part-year. Use the time basis for steady profits and the product basis when profits fluctuated." },
    ],

    /* ============ IMPORTANT QUESTIONS (existing count: 7) ============ */
    importantQuestions: {
      adm: [
        { type: "Short Answer", marks: 3,
          q: "A General Reserve of ₹60,000 stands in the books when a new partner is admitted. A and B share profits 4:1. Give the entry and state the ratio used.",
          answer: "General Reserve A/c Dr ₹60,000 to A's Capital A/c ₹48,000 and B's Capital A/c ₹12,000. The reserve is an accumulated profit of the old agreement, so it is written back to the old partners in the OLD profit-sharing ratio (60,000 × 4/5 = ₹48,000 and 60,000 × 1/5 = ₹12,000). The new partner gets nothing, because the reserve was earned before he joined and it disappears from the revised balance sheet." },
        { type: "Short Answer", marks: 3,
          q: "What is meant by 'premium for goodwill'? How is it settled when the partners agree that the new partner will not bring it in cash?",
          answer: "Premium for goodwill is the cash contribution the incoming partner makes for his share of the firm's established reputation — his payment to the old partners for the part of future profits they surrender. Normally it is received in cash (Bank A/c Dr) and credited to the sacrificing partners in the sacrificing ratio. When it is not to be brought in cash, the same economics are recorded through capitals: the new partner's Capital A/c is debited for his share of the firm's goodwill and the sacrificing partners' Capital A/cs are credited in the sacrificing ratio. Either way nothing is recorded as an asset of the firm." },
        { type: "Short Answer", marks: 3,
          q: "At admission an unrecorded liability of ₹25,000 and an unrecorded prepaid expense of ₹8,000 are discovered. A and B share profits 3:2. State the treatment and the net effect on revaluation.",
          answer: "The unrecorded liability is a rise in liabilities and is debited to the Revaluation Account with ₹25,000. The unrecorded prepaid expense is an asset not in the books and is credited to the Revaluation Account with ₹8,000. The revaluation account therefore closes with a net loss of 25,000 − 8,000 = ₹17,000, which is borne by the old partners in the old ratio — A is debited ₹10,200 (17,000 × 3/5) and B ₹6,800 (17,000 × 2/5). The new partner has no share in it." },
        { type: "Long Answer", marks: 6,
          q: "A and B share profits 3:2 and admit C for 1/5th of the future profits, the balance being shared between them in the old ratio. General Reserve is ₹75,000, the Profit and Loss Account carries a debit balance of ₹20,000 and old goodwill of ₹30,000 appears in the books. Revaluation shows building up ₹50,000, stock down ₹10,000 and creditors up ₹5,000. The firm's goodwill is ₹1,50,000 and C brings his share for it in cash. Pass all the journal entries at admission.",
          answer: "New ratio: balance 4/5 split 3:2 → A 12/25, B 8/25, C 5/25 = 12:8:5; sacrifice 3:2. (1) Revaluation: Building A/c Dr 50,000 to Stock 10,000, Creditors 5,000 and Revaluation A/c 35,000 — the revaluation profit of ₹35,000 is then transferred: Revaluation A/c Dr 35,000 to A 21,000, B 14,000 (old ratio). (2) General Reserve A/c Dr 75,000 to A 45,000, B 30,000. (3) A's Capital A/c Dr 12,000, B's Capital A/c Dr 8,000 to Profit and Loss A/c 20,000 — the accumulated loss goes in the old ratio. (4) A's Capital A/c Dr 18,000, B's Capital A/c Dr 12,000 to Goodwill A/c 30,000 — old goodwill written off first. (5) Bank A/c Dr 30,000 to A 18,000, B 12,000 — C brings 1,50,000 × 1/5 = ₹30,000 credited in the sacrificing ratio 3:2. On the day of admission A gains 45,000 + 21,000 − 12,000 − 18,000 + 18,000 = ₹54,000 and B gains 30,000 + 14,000 − 8,000 − 12,000 + 12,000 = ₹36,000, and the revised balance sheet carries no reserve, no accumulated loss and no goodwill." },
        { type: "Long Answer", marks: 6,
          q: "On admitting C for 1/5th of the profits (A and B continuing 5:3, so the new ratio is 5:3:2) the partners fix the total capital of the reconstituted firm at ₹7,50,000. A's capital in the old books is ₹3,00,000 and B's is ₹2,00,000. Show the capital adjustment of each partner and name the entries passed.",
          answer: "Target capitals in the new ratio: A = 7,50,000 × 5/10 = ₹3,75,000; B = 7,50,000 × 3/10 = ₹2,25,000; C = 7,50,000 × 2/10 = ₹1,50,000 (check: 3,75,000 + 2,25,000 + 1,50,000 = ₹7,50,000). Against these, A already holds ₹3,00,000 and must bring in 3,75,000 − 3,00,000 = ₹75,000; B holds ₹2,00,000 and must bring in 2,25,000 − 2,00,000 = ₹25,000; C brings the whole ₹1,50,000 as his capital. The entry is Bank A/c Dr 2,50,000 to A's Capital A/c 75,000, B's Capital A/c 25,000 and C's Capital A/c 1,50,000. Had a partner's balance exceeded his target, the excess would have been paid out with the partner's Capital A/c debited to Cash/Bank. The revised balance sheet then opens with capitals of exactly these agreed figures." },
        { type: "Long Answer", marks: 6,
          q: "A and B share profits 4:1. C is admitted for 1/10th of the profits and the partners agree that goodwill of ₹4,00,000 shall not be brought in cash but adjusted through capital accounts, A and B sacrificing in the ratio 4:1. Revaluation closes with a loss of ₹30,000 and General Reserve is ₹1,00,000. Show the effect on the partners' capital accounts.",
          answer: "Goodwill adjustment: C's share = 4,00,000 × 1/10 = ₹40,000, so C's Capital A/c is debited ₹40,000 and A is credited 40,000 × 4/5 = ₹32,000, B 40,000 × 1/5 = ₹8,000 (sacrificing ratio 4:1). No cash changes hands and no asset is created. Revaluation loss of ₹30,000 is shared in the old ratio: A debited 30,000 × 4/5 = ₹24,000 and B 30,000 × 1/5 = ₹6,000. General Reserve of ₹1,00,000 is credited in the old ratio: A ₹80,000 and B ₹20,000. Net effect on the old partners: A gains 32,000 + 80,000 − 24,000 = ₹88,000 credit and B gains 8,000 + 20,000 − 6,000 = ₹22,000 credit, while C's account is charged ₹40,000 before his capital contribution is credited. The revised balance sheet shows no goodwill and no reserve." },
        { type: "Case-Based", marks: 6,
          q: "Tara and Dev share profits 5:3 and admit Mona for 1/4th of the future profits, the balance continuing between them in the old ratio. The firm's goodwill is ₹2,00,000, General Reserve is ₹64,000 and the Profit and Loss Account carries a debit balance of ₹16,000. Revaluation shows plant up ₹36,000, stock down ₹12,000 and a customer claim up ₹8,000. (a) Compute the new profit-sharing ratio and the sacrificing ratio. (b) State the revaluation result and Tara's share of it. (c) Find the cash Mona brings for goodwill and Tara's credit from it.",
          answer: "(a) Balance 3/4 split 5:3 → Tara 15/32, Dev 9/32, Mona 8/32, i.e. 15:9:8. Sacrifice: Tara 5/8 − 15/32 = 20/32 − 15/32 = 5/32; Dev 3/8 − 9/32 = 12/32 − 9/32 = 3/32 → sacrificing ratio 5:3, and 5/32 + 3/32 = 8/32 = 1/4 = Mona's share ✓. (b) Revaluation: +36,000 − 12,000 − 8,000 = profit of ₹16,000, shared in the old ratio — Tara 16,000 × 5/8 = ₹10,000 and Dev ₹6,000. (c) Mona brings 2,00,000 × 1/4 = ₹50,000 for goodwill, divided in the sacrificing ratio 5:3 — Tara is credited 50,000 × 5/8 = ₹31,250 and Dev ₹18,750." },
        { type: "Assertion-Reason", marks: 4,
          q: "Assertion (A): At the admission of a partner, the premium for goodwill should be credited to all the old partners in their old profit-sharing ratio. Reason (R): The premium compensates only those partners who actually surrender part of their future share, and the proportion of that surrender is measured by the sacrificing ratio. Choose the correct option: (a) both A and R are true and R is the correct explanation of A, (b) both A and R are true but R is not the correct explanation of A, (c) A is false but R is true, (d) A is true but R is false.",
          answer: "Option (c) is correct: A is false while R is true. The premium pays for the specific slices of future profit given up by the old partners, and the sacrifice is measured partner-wise as old ratio minus new ratio — so the credit must follow the sacrificing ratio, which may differ from the old ratio when the balance is not shared that way. R states precisely this mechanism, which is why A's claim of an old-ratio split is wrong: it would over-credit whoever surrendered proportionately less and under-credit the larger sacrificer, while the total credited would still look right." }
      ],
      ret: [
        { type: "Short Answer", marks: 3,
          q: "A firm holds a life-insurance policy on partner M for ₹3,00,000 with a surrender value of ₹85,000. M dies. State what happens to the policy.",
          answer: "The policy was taken by the firm on the life of a partner, so the money it releases belongs to that partner's estate. The surrender value of ₹85,000 is credited to M's executor's account along with capital, reserves, revaluation and goodwill, and is finally paid to the legal heirs. It is not kept as an asset of the continuing firm and it is not shared with the gaining partners — nothing of the policy survives the death except its realisation value." },
        { type: "Short Answer", marks: 3,
          q: "The deed allows interest at 7% per annum on whatever remains unpaid to a retiring partner. The settlement is ₹1,90,000, of which ₹80,000 is paid at once and the balance stays outstanding for 6 months. Compute the interest and state where it is recorded.",
          answer: "Unpaid balance = 1,90,000 − 80,000 = ₹1,10,000. Interest = 1,10,000 × 7% × 6/12 = ₹3,850. It is charged as an expense against the firm's profit for the period (debited to the Profit and Loss Account or shown as an appropriation exactly as the deed directs) and credited to the retiring partner's loan account, raising the amount the firm still owes. Charging 7% on the whole ₹1,90,000 for a full year would wrongly give ₹13,300." },
        { type: "Short Answer", marks: 3,
          q: "State any three ways in which the balance sheet prepared after a partner's retirement differs from the one drawn up before it.",
          answer: "(1) The retiring partner's capital disappears and, if the dues are not paid, a loan of the firm of the unpaid amount appears in its place on the liability side. (2) General Reserve and other accumulated profits are gone, because they have been distributed to all partners in the old ratio. (3) Goodwill written off in the books no longer appears, and the revaluation effect is now embedded in the asset and liability figures, while the remaining partners' capitals stand at the agreed figures in the new ratio. Cash also falls by any immediate payment made to the outgoing partner." },
        { type: "Long Answer", marks: 6,
          q: "A, B and C share profits 5:3:2. C retires and A and B continue in the ratio 3:2. C's capital is ₹4,50,000, General Reserve is ₹2,00,000, the revaluation account closes with a profit of ₹60,000 and the firm's goodwill is ₹4,00,000. ₹2,00,000 is paid to C at once. Give the entries and show C's settlement.",
          answer: "Gains: A 3/5 − 1/2 = 1/10 and B 2/5 − 3/10 = 1/10, so the gaining ratio is 1:1 and both gains total 1/5 = C's share ✓. (1) General Reserve A/c Dr 2,00,000 to A 1,00,000, B 60,000, C 40,000 (old ratio 5:3:2). (2) Revaluation A/c Dr 60,000 to A 30,000, B 18,000, C 12,000. (3) A's Capital A/c Dr 40,000 and B's Capital A/c Dr 40,000 to C's Capital A/c 80,000 — goodwill of 4,00,000 × 1/5 = ₹80,000 funded equally by the gainers. C's account: capital 4,50,000 + reserve 40,000 + revaluation 12,000 + goodwill 80,000 = ₹5,82,000. (4) C's Capital A/c Dr 2,00,000 to Bank 2,00,000 and C's Capital A/c Dr 3,82,000 to C's Loan A/c 3,82,000. The revised balance sheet therefore shows a loan of ₹3,82,000 where C's capital stood, no General Reserve, no book goodwill, and A and B's capitals at 5/8 and 3/8 of the new structure at revalued figures." },
        { type: "Long Answer", marks: 6,
          q: "A, B and C share profits 3:2:1. C died on 31st October, last year's profit was ₹5,40,000, General Reserve is ₹1,80,000, revaluation profit is ₹36,000, goodwill of the firm is ₹2,40,000 and C's capital is ₹2,00,000; A and B continue in the ratio 3:2. Compute the amount passing to C's executor and give the entries.",
          answer: "C's share is 1/6. Profit up to death (time basis): April to 31st October = 7 months, so 5,40,000 × 7/12 = ₹3,15,000 and 3,15,000 × 1/6 = ₹52,500. Reserve: 1,80,000 × 1/6 = ₹30,000. Revaluation: 36,000 × 1/6 = ₹6,000. Goodwill: 2,40,000 × 1/6 = ₹40,000, and the gains are A 3/5 − 1/2 = 1/10, B 2/5 − 1/3 = 1/15, i.e. 3:2, so A pays ₹24,000 and B ₹16,000. Entries: General Reserve Dr 1,80,000 to A 90,000, B 60,000, C 30,000; Revaluation Dr 36,000 to A 18,000, B 12,000, C 6,000; A's Capital Dr 24,000, B's Capital Dr 16,000 to C's Capital 40,000; Profit and Loss Suspense A/c Dr 52,500 to C's Capital A/c 52,500 (share of profit up to the date of death); then C's Capital A/c Dr 3,28,500 to C's Executor's A/c 3,28,500 (2,00,000 + 30,000 + 6,000 + 40,000 + 52,500)." },
        { type: "Long Answer", marks: 6,
          q: "The firm earned ₹1,00,000 (April–June), ₹1,60,000 (July–September) and ₹70,000 (October–December) and a partner holding 1/5th share died on 31st December. The last year's profit was ₹4,00,000. Compute the share of profit on both bases, and state which one you would use and why.",
          answer: "Product basis — weight each period by its months: 1,00,000 × 3 = 3,00,000; 1,60,000 × 3 = 4,80,000; 70,000 × 3 = 2,10,000 → total ₹9,90,000 over 9 months = ₹1,10,000 per month, and the deceased's 1/5th = ₹22,000. Time basis — apply the last year's profit to the months elapsed: 4,00,000 × 9/12 = ₹3,00,000, of which 1/5th = ₹60,000. The product basis should be used here because the quarterly profits move sharply (₹70,000 against ₹1,60,000 in the very same year), so a single annual average would overstate the part-year profit; the time basis is only reliable when profits are steady from year to year. The chosen figure of ₹22,000 is credited to the deceased's capital account and then transferred to the executor." },
        { type: "Case-Based", marks: 6,
          q: "Mira, Naveen and Om share profits 4:3:1 with books closed on 31st March. Om died on 30th September, last year's profit being ₹5,60,000. On that date the firm held a General Reserve of ₹1,44,000 and a revaluation profit of ₹40,000; goodwill of the firm was ₹2,40,000; after the death Mira and Naveen decided to share profits 9:7; Om's capital was ₹2,80,000, and ₹1,00,000 was paid to the executor at once. (a) Compute Om's share of profit up to the date of death. (b) How much does each continuing partner pay towards Om's share of goodwill? (c) What total is credited to the executor's account? (d) What balance remains payable to the heirs?",
          answer: "(a) Six months had run: 5,60,000 × 6/12 = ₹2,80,000, and Om's 1/8th of it = ₹35,000. (b) Om's entitlement = 2,40,000 × 1/8 = ₹30,000. The gaining ratio is Mira 9/16 − 1/2 = 1/16 and Naveen 7/16 − 3/8 = 1/16, i.e. 1:1 (and 1/16 + 1/16 = 1/8 = Om's share ✓), so each pays ₹15,000. (c) Capital 2,80,000 + death profit 35,000 + reserve 1,44,000 × 1/8 = 18,000 + revaluation 40,000 × 1/8 = 5,000 + goodwill 30,000 = ₹3,68,000 credited to the executor's account. (d) 3,68,000 − 1,00,000 already paid = ₹2,68,000 still payable to the legal heirs." },
        { type: "Assertion-Reason", marks: 4,
          q: "Assertion (A): The unpaid amount due to a retiring partner should be shown in the revised balance sheet as part of partners' capital, because the firm still owes him. Reason (R): From the date of retirement the outgoing partner is no longer an owner, so his capital account is closed and the balance becomes a debt of the firm carried in a loan account. Choose the correct option: (a) both A and R are true and R is the correct explanation of A, (b) both A and R are true but R is not the correct explanation of A, (c) A is false but R is true, (d) A is true but R is false.",
          answer: "Option (c) is correct: A is false while R is true. Capital is the account of an owner's stake, and after retirement there is no ownership left to carry — the settlement is a creditor's claim, so the balance is shown as a loan (a liability) of the firm. R gives exactly this reason: the change in status converts capital into debt, which is why the revised balance sheet shows a loan where the retiring partner's capital used to stand, with any interest on it charged according to the deed." }
      ]
    }
  });
})();
