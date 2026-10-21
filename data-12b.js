/* ============================================================
   CLASS 12 — PART A: PARTNERSHIP FIRMS II (v83)
   Chapters 4–6: Admission of a Partner (adm), Retirement and
   Death of a Partner (ret), Dissolution of a Partnership Firm
   (dis). Plain browser script; C12_DATA must exist (data-12.js).
   Original teaching material written for this project against
   the published CBSE Class 12 Accountancy curriculum
   (session 2026-27) — not copied from any textbook.
   ============================================================ */
(function () {
  "use strict";

  C12_DATA.register({

    content: {

      /* ---------- Chapter 4: Admission of a Partner ---------- */
      adm: {
        theory: {
          simple: [
            {
              h: "What Admission Does to the Firm",
              p: "A new partner enters, the deed is rewritten, and the firm is reconstituted. Three things must happen before the new ratio governs anything: the effect on profit-sharing ratios is computed, every asset and liability is restated to current values, and the old accumulated profits, reserves and goodwill are settled with the old partners.",
              list: [
                { term: "New profit-sharing ratio", def: "What is left of the old shares after the new partner's admitted fraction, divided between the old partners (usually in their old ratio unless stated otherwise)." },
                { term: "Sacrificing ratio", def: "Old ratio − new ratio for the old partners — the slices each gave up for the newcomer, which also decides who receives goodwill compensation." },
                { term: "Reconstitution", def: "The old agreement ends and a new one begins — the firm survives, the partnership does not." }
              ]
            },
            {
              h: "The Revaluation Account",
              p: "A nominal account opened at admission. Debit side: falls in asset values, rises in liabilities, writing off fictitious assets. Credit side: rises in asset values, falls in liabilities. The balance — profit or loss — goes to the old partners in the old ratio, because the movement happened while they owned the firm.",
              formula: "Revaluation profit = (Rises in assets + Falls in liabilities) − (Falls in assets + Rises in liabilities)"
            },
            {
              h: "Goodwill at Admission — the Premium Method",
              p: "The new partner brings cash for their share of the firm's goodwill. That cash is credited to the sacrificing partners in the sacrificing ratio — compensation for the profit slices they gave up. If goodwill already sits in the books, the old partners write it off among themselves in the old ratio first, so the same reputation is never counted twice.",
              p2: "Under AS-26 only purchased goodwill is recorded; goodwill the firm built itself is valued purely to settle partners, never to be shown as a fresh asset."
            }
          ],
          advanced: [
            {
              h: "Capital Adjustment at Admission",
              p: "The firm fixes the total capital of the reconstituted business — often by capitalising the new profit or a multiple of the new partner's share — and expresses it in the new ratio. Each partner's capital account is then adjusted by bringing in cash or paying the excess out, so the balance sheet opens with the agreed structure in place.",
              formula: "Partner's capital = Total capital of the firm × Partner's new share"
            },
            {
              h: "The Revised Balance Sheet",
              p: "Drawn immediately after admission: assets and liabilities at revalued figures, no reserves or accumulated losses left standing (distributed to the old partners), no old goodwill (written off), and partners' capitals showing the new structure. Every line you see should trace back to a decision already taken — revaluation, distribution, write-off or cash brought in.",
              p2: "When the new partner brings assets or liabilities (premises taken over, or a liability assumed), those enter at agreed values alongside the revaluation."
            },
            {
              h: "Goodwill Adjusted Without Cash",
              p: "Sometimes the problem states goodwill is not to be brought in cash but adjusted through capital accounts. The mechanism is identical: compute each sacrificing partner's share of the firm's goodwill, credit them, and debit the gaining... at admission there is no gaining old partner — the new partner is debited for their share, credited to the sacrificers through their capital accounts."
            }
          ]
        },

        concepts: [
          { title: "Reconstitution of partnership", body: "Any event changing the agreement between existing partners while the firm continues — admission, retirement, death or a change in profit-sharing ratio." },
          { title: "Sacrificing ratio", body: "Old ratio minus new ratio for the old partners; it decides both the goodwill compensation and nothing else — revaluation always follows the old ratio." },
          { title: "Revaluation account", body: "A nominal account restating every asset and liability to current values at admission; its profit or loss belongs to the old partners in the old ratio." },
          { title: "Capital adjustment", body: "Rebalancing every partner's capital to the agreed total of the new firm, expressed in the new profit-sharing ratio." }
        ],

        formats: [
          {
            title: "Revaluation Account",
            note: "Nominal. Close the balance to old partners in the OLD ratio.",
            head: ["Particulars", "Amount (₹)", "Particulars", "Amount (₹)"],
            rows: [
              ["To Machinery (decrease)", "15,000", "By Building (increase)", "55,000"],
              ["To Creditors (increase)", "6,000", "By Provision for doubtful debts (decrease)", "6,000"],
              ["To Patent (written off)", "30,000", "By Investment Fluctuation Fund (unused)", "—"],
              ["To Profit on revaluation → A (3:2)", "6,000", "", ""],
              ["To Profit on revaluation → B", "4,000", "", ""],
              ["Total", "61,000", "Total", "61,000"]
            ]
          },
          {
            title: "Working note — new ratio and sacrifice on admission",
            note: "Build this before any entry; it drives goodwill, never revaluation.",
            head: ["Partner", "Old share", "New share", "Sacrifice (−) / Gain (+)"],
            rows: [
              ["A", "3/5 (15/25)", "12/25", "Sacrifice 3/25"],
              ["B", "2/5 (10/25)", "8/25", "Sacrifice 2/25"],
              ["C (new)", "—", "5/25", "Brings 1/5 of the firm"],
              ["Total", "1", "1", "Sacrifices total 5/25 = C's share ✓"]
            ]
          }
        ],

        numericals: [
          {
            id: 1, difficulty: "Medium",
            question: "A and B share 3:2. C is admitted for 1/5th of the future profits, the remaining profit being shared between A and B in their old ratio. The new ratio A:B:C is:",
            options: ["12:8:5", "3:2:1", "15:10:5", "12:16:5"],
            answerIndex: 0,
            explanation: "Remaining profit = 4/5, split 3:2 → A 12/25, B 8/25, C 5/25 = 12:8:5."
          },
          {
            id: 2, difficulty: "Medium",
            question: "In the same admission (A:B 3:2; C for 1/5), the sacrificing ratio of A:B is:",
            options: ["3:2", "2:1", "1:1", "12:8"],
            answerIndex: 0,
            explanation: "A sacrifices 3/5 − 12/25 = 3/25; B sacrifices 2/5 − 8/25 = 2/25 — ratio 3:2, exactly the old ratio when the remainder is split that way."
          },
          {
            id: 3, difficulty: "Easy",
            question: "Revaluation profit at admission is shared:",
            options: ["In the old ratio", "In the new ratio", "Only with the new partner", "To the sacrificing partners only"],
            answerIndex: 0,
            explanation: "The gain accrued under the old agreement — the new partner has no claim to it."
          },
          {
            id: 4, difficulty: "Medium",
            question: "Firm's goodwill ₹1,00,000; C admitted for 1/5 and brings goodwill in cash. With sacrificing ratio 3:2, A receives:",
            options: ["₹12,000", "₹20,000", "₹60,000", "₹8,000"],
            answerIndex: 0,
            explanation: "C brings 1,00,000 × 1/5 = ₹20,000, credited to sacrificers 3:2 → A ₹12,000."
          },
          {
            id: 5, difficulty: "Medium",
            question: "Goodwill of ₹15,000 already appears in the books at admission. The correct treatment is:",
            options: ["Written off by old partners in the old ratio", "Carried forward to the new firm", "Credited to the new partner", "Shown as a fresh asset at the new value"],
            answerIndex: 0,
            explanation: "The old goodwill is an accumulated item of the old agreement — write it off first, then apply the premium method."
          },
          {
            id: 6, difficulty: "Medium",
            question: "Total capital of the reconstituted firm is fixed at ₹6,00,000 and the new ratio is 12:8:5. C's capital account is credited with:",
            options: ["₹1,20,000", "₹1,00,000", "₹1,50,000", "₹2,40,000"],
            answerIndex: 0,
            explanation: "6,00,000 × 5/25 = ₹1,20,000 — the capital the new firm agrees to hold for C."
          },
          {
            id: 7, difficulty: "Easy",
            question: "Which is settled BEFORE the new profit-sharing ratio begins to govern the firm?",
            options: ["General reserve and accumulated profits", "The coming year's profits", "The new partner's drawings", "Interest on the new capital"],
            answerIndex: 0,
            explanation: "Everything accumulated belongs to the old ratio and is distributed at reconstitution."
          },
          {
            id: 8, difficulty: "Hard",
            question: "In a revaluation, a liability of ₹40,000 is understated by ₹6,000 and a fictitious asset of ₹12,000 is written off. The net effect on revaluation profit is:",
            options: ["A loss of ₹18,000", "A profit of ₹18,000", "A loss of ₹6,000", "No effect"],
            answerIndex: 0,
            explanation: "Rise in liability −6,000 and write-off of fictitious asset −12,000 → total ₹18,000 less. (Writing off a fictitious asset improves the balance sheet but costs the revaluation account — it is a debit there.)"
          },
          {
            id: 9, difficulty: "Easy",
            question: "Under AS-26, goodwill brought in by a new partner in cash is recorded as:",
            options: ["A credit to the sacrificing partners — not an asset of the firm", "An intangible asset in the balance sheet", "Revenue in the profit and loss account", "A reserve of the firm"],
            answerIndex: 0,
            explanation: "The cash is compensation flowing to the old partners for their surrendered share — it never stands as the firm's asset."
          },
          {
            id: 10, difficulty: "Hard",
            question: "A and B share 3:2; C is admitted for 1/5. If C's share of goodwill ₹20,000 is to be adjusted through capitals instead of cash, then:",
            options: ["C is debited ₹20,000 and A and B credited in 3:2", "A and B are debited and C credited", "The firm debits revaluation", "Nothing is recorded"],
            answerIndex: 0,
            explanation: "The economics are unchanged — C still pays for the surrendered share; only the settlement moves from cash to capital accounts."
          }
        ],

        activity: {
          type: "statement",
          title: "Revaluation Statement Builder",
          instruction: "Build each statement the board expects: pick the treatment for every line and type the amount where asked. Verify each statement before moving on — the working appears only when every line is right.",
          statements: [
            {
              title: "Statement 1 — Revaluation effects",
              prompt: "For each movement, decide whether it increases or decreases revaluation profit, and enter the amount of the movement.",
              needsAmount: true,
              rows: [
                { label: "Building worth ₹5,00,000 revalued to ₹5,55,000", options: ["Increases profit", "Decreases profit", "No effect"], answer: "Increases profit", amount: 55000 },
                { label: "Machinery ₹2,00,000 revalued to ₹1,85,000", options: ["Increases profit", "Decreases profit", "No effect"], answer: "Decreases profit", amount: 15000 },
                { label: "Creditors ₹1,20,000 now expected to be ₹1,26,000", options: ["Increases profit", "Decreases profit", "No effect"], answer: "Decreases profit", amount: 6000 },
                { label: "Provision for doubtful debts ₹10,000 reduced to ₹4,000", options: ["Increases profit", "Decreases profit", "No effect"], answer: "Increases profit", amount: 6000 },
                { label: "Patent (book ₹30,000) written off in full", options: ["Increases profit", "Decreases profit", "No effect"], answer: "Decreases profit", amount: 30000 }
              ],
              working: "Increase +55,000 + 6,000; decrease 15,000 + 6,000 + 30,000 → revaluation <b>profit ₹10,000</b>, shared between the old partners in the old ratio."
            },
            {
              title: "Statement 2 — Goodwill premium: where each item goes",
              prompt: "Choose the correct treatment for each event at admission.",
              rows: [
                { label: "New partner brings ₹20,000 for goodwill", options: ["Credited to sacrificing partners", "Credited to old partners in old ratio", "Debited to revaluation account", "Recorded as firm's asset"], answer: "Credited to sacrificing partners" },
                { label: "Goodwill of ₹15,000 already in the books", options: ["Written off by old partners in old ratio", "Credited to sacrificing partners", "Carried to the new firm", "Shared with the new partner"], answer: "Written off by old partners in old ratio" },
                { label: "Machinery's market value falls at admission", options: ["Debited to revaluation account", "Credited to revaluation account", "Sent to General Reserve", "Ignored"], answer: "Debited to revaluation account" },
                { label: "Self-generated goodwill revalued for settlement", options: ["Not recorded as an asset — settled between partners only", "Recorded as firm's asset at revalued figure", "Shared with the new partner as revenue", "Transferred to Securities Premium"], answer: "Not recorded as an asset — settled between partners only" }
              ],
              working: "The last line is the trap: self-generated goodwill is NEVER an asset (AS-26). Only purchased goodwill enters the books; a revalued figure is used purely to settle between partners, and no firm asset is created."
            },
            {
              title: "Statement 3 — Old items settled at admission (ratio 3:2)",
              prompt: "General Reserve is ₹80,000 and the revaluation account closes with a loss of ₹27,000. Say what happens to each partner's share.",
              rows: [
                { label: "A's share of General Reserve ₹80,000", options: ["Credited to capital", "Debited to capital", "Carried forward"], answer: "Credited to capital", amount: 48000 },
                { label: "B's share of General Reserve ₹80,000", options: ["Credited to capital", "Debited to capital", "Carried forward"], answer: "Credited to capital", amount: 32000 },
                { label: "A's share of revaluation loss ₹27,000", options: ["Debited to capital", "Credited to capital", "Carried forward"], answer: "Debited to capital", amount: 16200 },
                { label: "B's share of revaluation loss ₹27,000", options: ["Debited to capital", "Credited to capital", "Carried forward"], answer: "Debited to capital", amount: 10800 }
              ],
              
              needsAmount: true,
              working: "Reserve credited 80,000 × 3/5 = 48,000 and × 2/5 = 32,000; loss debited 27,000 × 3/5 = 16,200 and × 2/5 = 10,800 — all in the OLD ratio."
            }
          ]
        },

        examCases: [
          {
            id: 1,
            title: "A third friend joins",
            passage: "A and B share profits 3:2. They admit C for one-fifth of the future profits, the remainder to be shared between A and B in their old ratio. The firm's goodwill is valued at ₹1,00,000 for the purpose (C brings their share in cash). At revaluation, a building rises from ₹5,00,000 to ₹5,40,000, stock falls from ₹1,50,000 to ₹1,35,000 and a claim rises by ₹5,000. General Reserve stands at ₹90,000.",
            difficulty: "Hard",
            subs: [
              {
                q: "What is the new profit-sharing ratio A:B:C?",
                options: ["12:8:5", "3:2:1", "15:10:5", "12:16:5"],
                answerIndex: 0,
                reasoning: "Remaining 4/5 split 3:2 → A 12/25, B 8/25, C 5/25."
              },
              {
                q: "What is the profit or loss on revaluation?",
                options: ["Profit ₹20,000", "Loss ₹20,000", "Profit ₹10,000", "Nil"],
                answerIndex: 0,
                reasoning: "+40,000 building − 15,000 stock − 5,000 claim = ₹20,000 profit, shared in the old ratio 3:2."
              },
              {
                q: "How much of C's goodwill contribution is credited to A?",
                options: ["₹12,000", "₹20,000", "₹8,000", "₹10,000"],
                answerIndex: 0,
                reasoning: "C brings 1,00,000 × 1/5 = ₹20,000, split in sacrificing ratio 3:2 → A ₹12,000, B ₹8,000."
              },
              {
                q: "How much of the General Reserve is credited to B?",
                options: ["₹36,000", "₹54,000", "₹40,000", "₹45,000"],
                answerIndex: 0,
                reasoning: "Reserves belong to the old agreement: 90,000 × 2/5 = ₹36,000."
              }
            ]
          }
        ],

        examNumericals: [
          {
            id: 1, q: "Total capital of the reconstituted firm is fixed at ₹6,00,000 with new ratio 12:8:5. Find the new partner C's capital (₹).",
            value: 120000,
            explanation: "6,00,000 × 5/25 = ₹1,20,000.",
            difficulty: "Medium"
          },
          {
            id: 2, q: "At admission, building rises ₹40,000, stock falls ₹15,000 and a claim rises ₹5,000. Find the revaluation profit (₹).",
            value: 20000,
            explanation: "40,000 − 15,000 − 5,000 = ₹20,000.",
            difficulty: "Easy"
          }
        ],

        quickRevision: {
          definition: "Admission reconstitutes the partnership: the new ratio is computed, assets and liabilities are revalued, accumulated items are settled in the old ratio, and goodwill brought in compensates the sacrificing partners.",
          keyPoints: [
            "New ratio first, sacrificing ratio second — one drives capital, the other drives goodwill.",
            "Revaluation profit or loss always goes to the OLD partners in the OLD ratio.",
            "Existing goodwill is written off by old partners in the old ratio before the premium method is applied.",
            "Premium for goodwill is credited to sacrificing partners in the sacrificing ratio (AS-26 — no asset created).",
            "Reserves and accumulated losses are distributed at reconstitution; the revised balance sheet starts clean."
          ],
          calculationSteps: [
            "Step 1 — Find the new ratio: new partner's share + remainder split between old partners as directed.",
            "Step 2 — Sacrifice = old − new for each old partner; confirm sacrifices total the new partner's share.",
            "Step 3 — Revaluation: debit falls in assets and rises in liabilities; credit rises and falls; transfer balance in old ratio.",
            "Step 4 — Distribute reserves in old ratio; write off old goodwill in old ratio.",
            "Step 5 — Goodwill: new partner's share of firm goodwill × each partner's sacrifice.",
            "Step 6 — Fix total capital in the new ratio; adjust accounts by cash; draw the revised balance sheet."
          ],
          formulas: [
            { label: "New share of old partner", expr: "(1 − new partner's share) × old partner's share in remainder ratio" },
            { label: "Sacrifice", expr: "Old ratio − New ratio" },
            { label: "Goodwill compensation", expr: "Firm goodwill × New partner's share × Sacrifice proportion (or firm goodwill × sacrifice)" },
            { label: "Capital", expr: "Total capital of firm × Partner's new share" }
          ],
          distinctions: [
            {
              title: "Revaluation vs goodwill adjustment",
              head: ["Revaluation", "Goodwill"],
              rows: [
                ["Shared in", "Old ratio", "Sacrificing ratio"],
                ["Covers", "Assets and liabilities to current values", "Past super earnings"],
                ["New partner's claim", "None — happened before admission", "Pays for it in cash or capital"]
              ]
            }
          ],
          examPoints: [
            "Draw the sacrifice sheet before touching any journal entry — goodwill depends on it, revaluation does not.",
            "A revised balance sheet after admission should show no reserves and no existing goodwill.",
            "Capital adjustment questions give the total capital — multiply by each new share, don't guess."
          ],
          commonMistakes: [
            "Sharing revaluation profit in the new ratio because the new partner appears in the question.",
            "Crediting goodwill to the old partners in the old ratio instead of the sacrificing ratio.",
            "Recording self-generated goodwill as an asset (AS-26 forbids it)."
          ],
          mnemonic: "NSR — New ratio, Sacrifice ratio, Revaluation: settle the past in the old ratio, price the future in the sacrifice ratio."
        }
      },

      /* ---------- Chapter 5: Retirement & Death of a Partner ---------- */
      ret: {
        theory: {
          simple: [
            {
              h: "What the Outgoing Partner Is Owed",
              p: "On retirement the outgoing partner's account gathers everything they are entitled to: adjusted capital, share of reserves and accumulated profits, share of revaluation profit, and compensation for their share of goodwill. If the firm does not pay immediately, the total stands as a loan — the outgoing partner is now a creditor.",
              list: [
                { term: "Gaining ratio", def: "New ratio − old ratio of the continuing partners — who picked up the departing share, and in what proportion they pay for it." },
                { term: "Loan of the retiring partner", def: "The unpaid settlement, carried as a liability of the firm until paid." },
                { term: "Executor's account", def: "The account that receives a deceased partner's dues before payment to their legal heirs." }
              ]
            },
            {
              h: "Goodwill: Compensation by the Gainers",
              p: "The departing partner's share of the firm's goodwill is funded by the continuing partners in the gaining ratio — they are the ones buying the outgoing share of future profits. The entry credits the outgoing partner and debits the gainers in exactly that proportion.",
              formula: "Outgoing partner's goodwill share = Firm goodwill × Outgoing partner's profit share (paid by gainers in gaining ratio)"
            },
            {
              h: "Share of Profit Up to the Date of Death",
              p: "When a partner dies mid-year, their share of profit for the part-year is estimated and credited to their account. Two bases: the time basis (last year's or average profit × fraction of the year × share) when profits are steady, and the product basis (each period's profit weighted by the months it lasted) when profits fluctuated.",
              formula: "Time basis: Profit × (months ÷ 12) × share · Product basis: Σ(profit × months) ÷ total months × share"
            }
          ],
          advanced: [
            {
              h: "The Settlement Sequence",
              p: "Every item arrives in the outgoing partner's account: capital balance, reserves in the old ratio, revaluation in the old ratio, goodwill compensation in the gaining ratio, and — for a death — profit up to the date of death. The total is either paid in cash or carried as a loan; either way nothing is left to the old agreement.",
              p2: "For a deceased partner the same list flows into the executor's account, which is then settled with the legal heirs."
            },
            {
              h: "Revised Balance Sheet After Retirement",
              p: "Reserves are gone (distributed), existing goodwill is written off (old partners, old ratio), the outgoing partner's capital and compensation are removed (replaced by a loan if unpaid), and continuing capitals reflect the new structure at revalued figures."
            },
            {
              h: "Product-Basis Death Profit in Detail",
              p: "Split the year into segments in which profit was roughly constant. Multiply each segment's profit by the months it covered, add the products for the months up to the date of death, divide by the months counted, and apply the deceased's share. The weight given to a three-month patch of high profit is exactly three months — no more, no less."
            }
          ]
        },

        concepts: [
          { title: "Gaining ratio", body: "New ratio minus old ratio of continuing partners — the mirror of the outgoing partner's sacrifice, and the proportion in which they fund goodwill compensation." },
          { title: "Loan account of retiring partner", body: "The firm's unpaid dues to the outgoing partner, carried as a liability until settled — the partner's capital account is closed, not left open." },
          { title: "Share of profit up to date of death", body: "A mid-year estimate of the deceased partner's profit entitlement, computed on a time or product basis and credited to their account." },
          { title: "Executor's account", body: "The account receiving a deceased partner's total dues — capital, reserves, revaluation, goodwill and part-year profit — before payment to legal heirs." }
        ],

        formats: [
          {
            title: "Settlement of the outgoing partner (working table)",
            note: "Build this table first; the loan balance is its final line.",
            head: ["Particulars", "Amount (₹)"],
            rows: [
              ["Capital balance as per books", "3,00,000"],
              ["Add: share of General Reserve (1/6 of 2,40,000)", "40,000"],
              ["Add: share of revaluation profit (1/6 of 60,000)", "10,000"],
              ["Add: goodwill compensation received", "30,000"],
              ["Total settlement", "3,80,000"]
            ]
          },
          {
            title: "Product basis — share of profit up to death",
            note: "Deceased's share is applied to the weighted average of the months that lasted up to death.",
            head: ["Period", "Months", "Profit (₹)", "Product (₹)"],
            rows: [
              ["April – June", "3", "90,000", "2,70,000"],
              ["July – September (up to death)", "3", "1,50,000", "4,50,000"],
              ["Total counted", "6", "", "7,20,000"],
              ["Weighted average = 7,20,000 ÷ 6", "", "1,20,000", "per month"],
              ["Deceased's share 1/4 × 1,20,000", "", "", "30,000"]
            ]
          }
        ],

        numericals: [
          {
            id: 1, difficulty: "Medium",
            question: "A, B and C share 3:2:1. C retires and A and B continue as 3:2. The gaining ratio of A:B is:",
            options: ["3:2 (A gains 1/10, B gains 1/15)", "1:1", "2:1", "3:1"],
            answerIndex: 0,
            explanation: "A: 3/5 − 3/6 = 1/10; B: 2/5 − 2/6 = 1/15 — ratio 1/10 : 1/15 = 3:2, and both gains total 1/6 = C's share."
          },
          {
            id: 2, difficulty: "Medium",
            question: "Firm's goodwill ₹1,80,000 at C's retirement (share 1/6). With gaining ratio 3:2, A pays:",
            options: ["₹18,000", "₹30,000", "₹12,000", "₹15,000"],
            answerIndex: 0,
            explanation: "C's share = 1,80,000 × 1/6 = ₹30,000, funded by gainers 3:2 → A ₹18,000, B ₹12,000."
          },
          {
            id: 3, difficulty: "Easy",
            question: "Gaining ratio is computed as:",
            options: ["New ratio − old ratio", "Old ratio − new ratio", "New + old", "Goodwill ÷ share"],
            answerIndex: 0,
            explanation: "The rise in the continuing partners' shares — mirroring the outgoing partner's sacrifice."
          },
          {
            id: 4, difficulty: "Medium",
            question: "Last year's profit ₹3,60,000; partner with 1/4 share dies on 30 September (April–March year). Time-basis share of profit is:",
            options: ["₹45,000", "₹90,000", "₹30,000", "₹15,000"],
            answerIndex: 0,
            explanation: "3,60,000 × 6/12 × 1/4 = ₹45,000 — six months of the year elapsed."
          },
          {
            id: 5, difficulty: "Hard",
            question: "Average profit of three years ₹3,00,000; partner with 1/5 share dies on 31 December (April–March year). Share of profit is:",
            options: ["₹45,000", "₹15,000", "₹60,000", "₹30,000"],
            answerIndex: 0,
            explanation: "3,00,000 × 9/12 × 1/5 = ₹45,000 — nine months elapsed."
          },
          {
            id: 6, difficulty: "Easy",
            question: "A retiring partner's unpaid settlement is shown in the firm's balance sheet as:",
            options: ["A loan — a liability of the firm", "Partners' capital", "A reserve", "An asset"],
            answerIndex: 0,
            explanation: "Capital closed, dues become a loan — the partner is now a creditor."
          },
          {
            id: 7, difficulty: "Medium",
            question: "General Reserve of ₹2,40,000 is distributed at C's retirement (share 1/6). C receives:",
            options: ["₹40,000", "₹30,000", "₹20,000", "₹60,000"],
            answerIndex: 0,
            explanation: "Reserves belong to the old agreement: 2,40,000 × 1/6 = ₹40,000, credited in the old ratio."
          },
          {
            id: 8, difficulty: "Easy",
            question: "Revaluation profit at retirement is shared in the:",
            options: ["Old ratio", "New ratio", "Gaining ratio", "Ratio fixed by the executor"],
            answerIndex: 0,
            explanation: "The movement belongs to the years before the retirement — old ratio, always."
          },
          {
            id: 9, difficulty: "Hard",
            question: "Profits Apr–Jun ₹90,000 (3 months), Jul–Dec ₹1,50,000 (6 months); partner with 1/4 share dies on 30 September. Product-basis share is:",
            options: ["₹30,000", "₹15,000", "₹45,000", "₹10,000"],
            answerIndex: 0,
            explanation: "Products up to death: 90,000 × 3 = 2,70,000 and 1,50,000 × 3 = 4,50,000 → total 7,20,000 ÷ 6 months = ₹1,20,000 per month; × 1/4 share = ₹30,000."
          },
          {
            id: 10, difficulty: "Medium",
            question: "At retirement, goodwill already in the books is:",
            options: ["Written off by old partners in the old ratio", "Paid to the retiring partner", "Shared in the gaining ratio", "Carried forward"],
            answerIndex: 0,
            explanation: "Write off the old figure first; only then compensate the outgoing partner for their share of the revalued goodwill."
          }
        ],

        activity: {
          type: "calc",
          title: "Retirement Settlement Bench",
          instruction: "Work each settlement exactly as the working note should appear in the exam — every figure is checked before the bench reveals its own.",
          problems: [
            {
              prompt: "A, B and C share profits 3:2:1. C retires; A and B continue as 3:2. Find A's and B's gaining fractions as numerators over 30, and confirm they equal C's sacrifice.",
              inputs: [
                { key: "ag", label: "A's gain (numerator / 30)", placeholder: "e.g. 3" },
                { key: "bg", label: "B's gain (numerator / 30)", placeholder: "e.g. 2" }
              ],
              answers: { ag: 3, bg: 2 },
              formula: "Gain = new − old",
              working: "A: 3/5 − 1/2 = 6/10 − 5/10 = 1/10 = <b>3/30</b>. B: 2/5 − 1/3 = 6/15 − 5/15 = 1/15 = <b>2/30</b>. Total 5/30 = 1/6 = C's sacrifice ✓."
            },
            {
              prompt: "Firm goodwill is ₹1,80,000 at C's retirement (share 1/6), funded by A and B in their gaining ratio 3:2. Find C's goodwill share and each gainer's payment.",
              inputs: [
                { key: "cs", label: "C's share of goodwill (₹)", placeholder: "e.g. 30000" },
                { key: "ap", label: "A pays (₹)", placeholder: "e.g. 18000" },
                { key: "bp", label: "B pays (₹)", placeholder: "e.g. 12000" }
              ],
              answers: { cs: 30000, ap: 18000, bp: 12000 },
              formula: "Outgoing share = GW × share; paid by gainers in gaining ratio",
              working: "C's share = 1,80,000 × 1/6 = <b>₹30,000</b>. Gainers 3:2 → A pays 30,000 × 3/5 = <b>₹18,000</b>, B pays <b>₹12,000</b>."
            },
            {
              prompt: "A deceased partner held 1/4 of the firm. The last year's profit was ₹3,60,000 (April–March) and the death occurred on 30 September. Compute the share of profit on the time basis.",
              inputs: [
                { key: "pp", label: "Months elapsed (of 12)", placeholder: "e.g. 6" },
                { key: "sp", label: "Share of profit credited (₹)", placeholder: "e.g. 45000" }
              ],
              answers: { pp: 6, sp: 45000 },
              formula: "Profit × months ÷ 12 × share",
              working: "April to 30 September = <b>6 months</b>. 3,60,000 × 6/12 = 1,80,000; × 1/4 = <b>₹45,000</b> credited to the deceased's account."
            },
            {
              prompt: "On the product basis: Apr–Jun profit ₹90,000, Jul–Dec profit ₹1,50,000; the partner (1/4 share) died on 30 September. Find the weighted monthly average and the share credited.",
              inputs: [
                { key: "avg", label: "Weighted monthly average (₹)", placeholder: "e.g. 120000" },
                { key: "sp", label: "Share credited (₹)", placeholder: "e.g. 30000" }
              ],
              answers: { avg: 120000, sp: 30000 },
              formula: "Σ(profit × months) ÷ months counted × share",
              working: "Products to death: 90,000 × 3 = 2,70,000; 1,50,000 × 3 = 4,50,000 → 7,20,000 ÷ 6 = <b>₹1,20,000</b> per month; × 1/4 = <b>₹30,000</b>."
            },
            {
              prompt: "Settle the outgoing partner: capital ₹3,00,000, General Reserve share ₹40,000, revaluation profit share ₹10,000, goodwill compensation ₹30,000. Find the total settlement and, if ₹1,00,000 is paid immediately, the loan balance carried forward.",
              inputs: [
                { key: "tot", label: "Total settlement (₹)", placeholder: "e.g. 380000" },
                { key: "loan", label: "Loan carried forward (₹)", placeholder: "e.g. 280000" }
              ],
              answers: { tot: 380000, loan: 280000 },
              formula: "Capital + reserves + revaluation + goodwill − immediate payment",
              working: "3,00,000 + 40,000 + 10,000 + 30,000 = <b>₹3,80,000</b>; after paying ₹1,00,000, the balance <b>₹2,80,000</b> stands as the retiring partner's loan."
            }
          ]
        },

        examCases: [
          {
            id: 1,
            title: "A death mid-year",
            passage: "P, Q and R share profits 3:2:1. The books are closed annually on 31 March, and the last year's profit was ₹4,80,000. R died on 30 September; the share of profit up to the date of death is computed on the time basis. At that date the firm held a General Reserve of ₹1,20,000 and the revaluation account showed a profit of ₹30,000.",
            difficulty: "Hard",
            subs: [
              {
                q: "R's share of profit up to the date of death is:",
                options: ["₹40,000", "₹80,000", "₹20,000", "₹24,000"],
                answerIndex: 0,
                reasoning: "4,80,000 × 6/12 × 1/6 = ₹40,000 — six months elapsed, one-sixth share."
              },
              {
                q: "R's share of the General Reserve is:",
                options: ["₹20,000", "₹40,000", "₹60,000", "₹10,000"],
                answerIndex: 0,
                reasoning: "Reserves shared in the old ratio: 1,20,000 × 1/6 = ₹20,000."
              },
              {
                q: "R's share of the revaluation profit is:",
                options: ["₹5,000", "₹10,000", "₹15,000", "₹30,000"],
                answerIndex: 0,
                reasoning: "30,000 × 1/6 = ₹5,000, credited in the old ratio."
              }
            ]
          },
          {
            id: 2,
            title: "Settling a retiring partner",
            passage: "A, B and C share 3:2:1. C retires and A and B continue as 3:2. The firm's goodwill is ₹1,80,000, General Reserve ₹2,40,000 and the revaluation account closes with a profit of ₹60,000. C's capital as per books is ₹3,00,000; ₹1,00,000 is paid immediately and the rest is carried forward.",
            difficulty: "Hard",
            subs: [
              {
                q: "What is A's gaining fraction?",
                options: ["1/10", "1/15", "1/6", "3/10"],
                answerIndex: 0,
                reasoning: "New 3/5 − old 1/2 = 6/10 − 5/10 = 1/10 (B gains 1/15; both total 1/6)."
              },
              {
                q: "How much does A pay towards C's goodwill share?",
                options: ["₹18,000", "₹30,000", "₹12,000", "₹15,000"],
                answerIndex: 0,
                reasoning: "C's share 1,80,000 × 1/6 = ₹30,000, paid by gainers 3:2 → A ₹18,000."
              },
              {
                q: "What is C's total settlement before the immediate payment?",
                options: ["₹3,80,000", "₹3,50,000", "₹3,70,000", "₹3,00,000"],
                answerIndex: 0,
                reasoning: "Capital 3,00,000 + reserve 40,000 + revaluation 10,000 + goodwill 30,000 = ₹3,80,000."
              },
              {
                q: "What balance is carried forward as C's loan after paying ₹1,00,000?",
                options: ["₹2,80,000", "₹3,00,000", "₹2,40,000", "₹3,80,000"],
                answerIndex: 0,
                reasoning: "3,80,000 − 1,00,000 = ₹2,80,000, carried as a loan of the firm."
              }
            ]
          }
        ],

        examNumericals: [
          {
            id: 1, q: "Average profit of three years ₹3,00,000; partner holding 1/5 share died on 31 December (April–March year). Time-basis share of profit (₹) —",
            value: 45000,
            explanation: "3,00,000 × 9/12 × 1/5 = ₹45,000.",
            difficulty: "Medium"
          },
          {
            id: 2, q: "Firm goodwill ₹1,80,000 at retirement of a partner holding 1/6 share. The outgoing partner's goodwill entitlement (₹) —",
            value: 30000,
            explanation: "1,80,000 × 1/6 = ₹30,000, funded by the gaining partners in the gaining ratio.",
            difficulty: "Easy"
          }
        ],

        quickRevision: {
          definition: "Retirement or death reconstitutes the firm: the outgoing partner is paid for capital, reserves, revaluation and goodwill — and, on death, for their share of profit up to the date of death — while the gainers fund the goodwill and the firm carries any unpaid balance as a loan.",
          keyPoints: [
            "Gaining ratio = new − old; it governs goodwill compensation and nothing else.",
            "Reserves and revaluation go in the OLD ratio; goodwill goes by the GAINING ratio.",
            "Unpaid dues become a loan of the firm — the partner's capital account is closed.",
            "Death profit: time basis when profits are steady, product basis when they moved sharply.",
            "A deceased partner's dues accumulate in the executor's account before payment to heirs."
          ],
          calculationSteps: [
            "Step 1 — Write old ratio and continuing ratio; compute each gainer's gain (new − old); check gains total the outgoing share.",
            "Step 2 — Goodwill: outgoing share of firm goodwill, funded by gainers in gaining ratio.",
            "Step 3 — Revaluation and reserves to the outgoing partner in the old ratio.",
            "Step 4 — On death: profit up to date — time basis (profit × months/12 × share) or product basis (Σ product ÷ months × share).",
            "Step 5 — Total the settlement; pay or carry as a loan; draw the revised balance sheet."
          ],
          formulas: [
            { label: "Gaining ratio", expr: "New ratio − Old ratio" },
            { label: "Goodwill compensation", expr: "Firm goodwill × Outgoing share, paid by gainers in gaining ratio" },
            { label: "Time-basis death profit", expr: "Profit × (months ÷ 12) × Share" },
            { label: "Product-basis death profit", expr: "Σ(Profit × months) ÷ Months counted × Share" }
          ],
          distinctions: [
            {
              title: "Retirement vs death settlement",
              head: ["Retirement", "Death"],
              rows: [
                ["Who receives", "The outgoing partner", "The executor, then the heirs"],
                ["Part-year profit", "Full year belongs to the firm", "Share up to date of death is credited"],
                ["Deed interest on dues", "As the deed/Act provides", "As the deed/Act provides"],
                ["Same items", "Capital, reserves, revaluation, goodwill", "Capital, reserves, revaluation, goodwill"]
              ]
            }
          ],
          examPoints: [
            "Product basis: weight each period's profit by its months, count only months up to death.",
            "After retirement, the revised balance sheet shows a loan where the partner's capital used to be.",
            "Gains of continuing partners must total the outgoing partner's share — a free check on every computation."
          ],
          commonMistakes: [
            "Sharing goodwill compensation in the old ratio instead of the gaining ratio.",
            "Using the average basis when the question gives period-by-period profits (or vice versa).",
            "Leaving the outgoing partner's capital open instead of converting it into a loan."
          ],
          mnemonic: "GRG — General reserve and Revaluation use the old ratio; Goodwill uses the gaining ratio."
        }
      },

      /* ---------- Chapter 6: Dissolution of a Partnership Firm ---------- */
      dis: {
        theory: {
          simple: [
            {
              h: "Dissolution of Partnership vs Dissolution of Firm",
              p: "Dissolution of partnership changes the constitution — a partner leaves, the deed is rewritten, the business carries on. Dissolution of firm ends the business itself: assets are realised, liabilities paid, operations stopped, cash divided. Unless the partners agree otherwise, dissolution of partnership between all partners amounts to dissolution of the firm.",
              list: [
                { term: "Types of dissolution", def: "Dissolution by agreement of partners, and dissolution by court order — plus the statutory consequence of the partnership itself coming to an end." },
                { term: "Realisation account", def: "The single nominal account opened at dissolution to convert every asset and liability into cash terms and measure the final profit or loss." },
                { term: "Cash/bank excluded", def: "Cash balances are never transferred to realisation — they are the pot being divided, not an asset to be realised." }
              ]
            },
            {
              h: "The Realisation Account",
              p: "Debit side: assets transferred at book value (cash and bank excluded), later the liabilities actually paid and the expenses of dissolution. Credit side: liabilities transferred at book value, later the cash realised from each asset. The difference — profit or loss on realisation — is shared between the partners in the profit-sharing ratio.",
              formula: "Profit/loss on realisation = (Assets realised + Liabilities transferred) − (Assets transferred + Liabilities paid + Expenses)"
            },
            {
              h: "Dividing the Cash",
              p: "Cash is applied in statutory order: realisation expenses first, then any amount due to partners for their loans, then outside liabilities — and only the surplus reaches partners' capital accounts, which already carry their share of reserves and of the realisation result. The cash/bank account closes at exactly zero."
            }
          ],
          advanced: [
            {
              h: "Reading the Realisation Result",
              p: "A gain on liabilities (paid less than book) and a gain on assets (realised above book) both push the result towards profit; write-downs and expenses push towards loss. Rather than memorising sides, total both columns and compare — the exam rewards arithmetic, not recall.",
              p2: "With assets ₹2,00,000, liabilities ₹80,000, realised ₹1,75,000, paid ₹78,000 and expenses ₹7,000: credits 1,75,000 + 80,000 = 2,55,000; debits 2,00,000 + 78,000 + 7,000 = 2,85,000 → loss ₹30,000."
            },
            {
              h: "Items That Never Enter Realisation",
              p: "Cash and bank balances stay out. A partner's loan to the firm is settled separately — it is a creditor's claim, not a firm asset. Amounts due from or to partners on other accounts are adjusted directly against their capital or loan accounts. Only third-party assets and liabilities drive the realisation account."
            },
            {
              h: "The Final Division, Line by Line",
              p: "Close every account into partners' capital: distribute reserves in the profit-sharing ratio, add the share of realisation profit (or deduct the loss), then pay each partner their balance from the available cash after all outside claims. What remains in the partners' capital accounts after payment is zero by construction."
            }
          ]
        },

        concepts: [
          { title: "Dissolution of firm", body: "The winding up of the entire business — assets realised, liabilities settled, cash divided, the firm ceases to exist." },
          { title: "Realisation account", body: "A nominal account transferring every asset and liability at book value to measure the profit or loss of winding up, shared in the profit-sharing ratio." },
          { title: "Profit on realisation", body: "Credits (assets realised + liabilities transferred) minus debits (assets transferred + liabilities paid + expenses) — a surplus of the winding-up process itself." },
          { title: "Order of payment", body: "Realisation expenses, then partners' loans, then outside liabilities — partners' capital receives the surplus last." }
        ],

        formats: [
          {
            title: "Realisation Account",
            note: "Nominal. Cash and bank balances are never transferred.",
            head: ["Particulars", "Amount (₹)", "Particulars", "Amount (₹)"],
            rows: [
              ["To Assets (book value)", "2,00,000", "By Liabilities (book value)", "80,000"],
              ["To Bank A/c — liabilities paid", "78,000", "By Bank A/c — assets realised", "1,75,000"],
              ["To Bank A/c — expenses", "7,000", "", ""],
              ["To Loss on realisation → partners (3:2)", "18,000 / 12,000", "", ""],
              ["Total", "2,85,000", "Total", "2,55,000"]
            ]
          },
          {
            title: "Order of payment from available cash",
            note: "The statutory sequence — capital gets the surplus only after every prior claim.",
            head: ["Order", "Who is paid", "Basis"],
            rows: [
              ["First", "Realisation expenses", "Cost of winding up"],
              ["Second", "Amounts due to partners for loans", "Creditor status of lending partners"],
              ["Third", "Outside liabilities", "Third-party claims settled in full"],
              ["Last", "Partners' capital balances", "Surplus shared after reserves and realisation share"]
            ]
          }
        ],

        numericals: [
          {
            id: 1, difficulty: "Hard",
            question: "On dissolution: assets (book) ₹2,00,000 realised ₹1,75,000; liabilities (book) ₹80,000 paid ₹78,000; expenses ₹7,000. The result is:",
            options: ["Loss ₹30,000", "Profit ₹30,000", "Loss ₹10,000", "Profit ₹10,000"],
            answerIndex: 0,
            explanation: "Credits 1,75,000 + 80,000 = 2,55,000; debits 2,00,000 + 78,000 + 7,000 = 2,85,000 → ₹30,000 loss."
          },
          {
            id: 2, difficulty: "Easy",
            question: "Which item is NOT transferred to the realisation account on dissolution?",
            options: ["Cash at bank", "Trade receivables", "Building", "Trade payables"],
            answerIndex: 0,
            explanation: "Cash balances are the pool to be divided — they never pass through realisation."
          },
          {
            id: 3, difficulty: "Medium",
            question: "Profit on realisation of ₹45,000 with partners sharing 3:2 is distributed:",
            options: ["₹27,000 to A and ₹18,000 to B", "₹22,500 each", "To creditors first", "In the new ratio"],
            answerIndex: 0,
            explanation: "45,000 × 3/5 = 27,000; × 2/5 = 18,000 — the profit-sharing ratio, always."
          },
          {
            id: 4, difficulty: "Medium",
            question: "An asset of ₹25,000 (book) realises ₹40,000. The ₹15,000 excess:",
            options: ["Reduces the debit of assets and creates realisation credit — increasing profit", "Is revenue of the firm", "Goes to the partners directly", "Is a reserve"],
            answerIndex: 0,
            explanation: "The asset leaves at book ₹25,000 and ₹40,000 cash arrives — net ₹15,000 surplus to the realisation credit."
          },
          {
            id: 5, difficulty: "Easy",
            question: "Realisation expenses of ₹10,000 are paid. Their treatment:",
            options: ["Debited to the realisation account", "Charged to the profit and loss account", "Debited to partners' capital equally", "Ignored"],
            answerIndex: 0,
            explanation: "The cost of winding up belongs to the realisation account — it reduces the surplus shared by partners."
          },
          {
            id: 6, difficulty: "Easy",
            question: "A partner's loan to the firm at dissolution is settled:",
            options: ["After realisation expenses but before partners' capital", "Only after capital is paid", "By crediting realisation", "Nowhere — it is written off"],
            answerIndex: 0,
            explanation: "Lending partners are creditors for the loan — paid ahead of capital, behind the cost of winding up."
          },
          {
            id: 7, difficulty: "Medium",
            question: "Liabilities of ₹60,000 are settled for ₹55,000. This ₹5,000 gain:",
            options: ["Increases profit on realisation", "Reduces profit on realisation", "Is transferred to reserve", "Belongs to creditors"],
            answerIndex: 0,
            explanation: "The firm credited liabilities at ₹60,000 but paid ₹55,000 — ₹5,000 surplus to the realisation credit."
          },
          {
            id: 8, difficulty: "Medium",
            question: "After every outside claim is settled, partners receive:",
            options: ["Their capital balances adjusted for reserves and realisation share", "Equal amounts", "The full cash equally", "Nothing until creditors are doubled"],
            answerIndex: 0,
            explanation: "Capital accounts carry the whole history — reserves, revaluation-era balances, realisation result — and are paid last from the surplus."
          },
          {
            id: 9, difficulty: "Hard",
            question: "Which sequence of payment from available cash is correct?",
            options: [
              "Realisation expenses → partners' loans → outside liabilities → partners' capital",
              "Outside liabilities → partners' capital → realisation expenses",
              "Partners' capital → outside liabilities → expenses",
              "All claims simultaneously"
            ],
            answerIndex: 0,
            explanation: "The statutory order: cost of winding up, then lending partners as creditors, then third-party creditors, and only then the owners."
          },
          {
            id: 10, difficulty: "Easy",
            question: "Dissolution by court is distinguished from dissolution by agreement because:",
            options: [
              "One is ordered by the court on a partner's or creditor's application; the other is by mutual consent",
              "Only court dissolution uses a realisation account",
              "Court dissolution forbids asset realisation",
              "There is no difference in accounting treatment"
            ],
            answerIndex: 0,
            explanation: "The origin differs — mutual consent or judicial order — while the accounting mechanics (realisation, cash division) remain the same."
          }
        ],

        activity: {
          type: "statement",
          title: "Realisation Statement Builder",
          instruction: "Construct the realisation statements line by line: choose each side of the account, then enter the amounts. Verify a statement to unlock its working.",
          statements: [
            {
              title: "Statement 1 — Which side does each line go to?",
              prompt: "Classify every dissolution event as it enters the realisation account. Amounts are the figures involved.",
              needsAmount: true,
              rows: [
                { label: "Machinery (book ₹2,00,000) transferred at dissolution", options: ["Debit side", "Credit side", "Not recorded"], answer: "Debit side", amount: 200000 },
                { label: "Trade payables (book ₹80,000) transferred", options: ["Debit side", "Credit side", "Not recorded"], answer: "Credit side", amount: 80000 },
                { label: "Cash at bank — no entry for transfer", options: ["Debit side", "Credit side", "Not recorded"], answer: "Not recorded" },
                { label: "Machinery realised for ₹1,75,000", options: ["Debit side", "Credit side", "Not recorded"], answer: "Credit side", amount: 175000 },
                { label: "Trade payables settled for ₹78,000", options: ["Debit side", "Credit side", "Not recorded"], answer: "Debit side", amount: 78000 },
                { label: "Realisation expenses paid ₹7,000", options: ["Debit side", "Credit side", "Not recorded"], answer: "Debit side", amount: 7000 }
              ],
              working: "Debit: assets transferred 2,00,000 + liabilities paid 78,000 + expenses 7,000 = <b>2,85,000</b>. Credit: liabilities transferred 80,000 + assets realised 1,75,000 = <b>2,55,000</b> → realisation <b>loss ₹30,000</b>, shared 3:2."
            },
            {
              title: "Statement 2 — Statutory order of payment",
              prompt: "Put each claim in the order it is met from the available cash.",
              rows: [
                { label: "Realisation expenses", options: ["First", "Second", "Third", "Last"], answer: "First" },
                { label: "Amount due to a partner for a loan to the firm", options: ["First", "Second", "Third", "Last"], answer: "Second" },
                { label: "Outside liabilities", options: ["First", "Second", "Third", "Last"], answer: "Third" },
                { label: "Partners' capital balances", options: ["First", "Second", "Third", "Last"], answer: "Last" }
              ],
              working: "Cost of winding up first, then lending partners as creditors, then third-party creditors — owners take the surplus last."
            },
            {
              title: "Statement 3 — Final division (loss ₹30,000, ratio 3:2)",
              prompt: "Capitals before the realisation result: A ₹3,00,000, B ₹2,00,000. Decide the treatment and amount of each line.",
              rows: [
                { label: "A's share of realisation loss ₹30,000", options: ["Debit to capital", "Credit to capital", "Paid from cash"], answer: "Debit to capital", amount: 18000 },
                { label: "B's share of realisation loss ₹30,000", options: ["Debit to capital", "Credit to capital", "Paid from cash"], answer: "Debit to capital", amount: 12000 },
                { label: "Final payment to A", options: ["Debit to capital", "Credit to capital", "Paid from cash"], answer: "Paid from cash", amount: 282000 },
                { label: "Final payment to B", options: ["Debit to capital", "Credit to capital", "Paid from cash"], answer: "Paid from cash", amount: 188000 }
              ],
              needsAmount: true,
              working: "A 3,00,000 − 18,000 = <b>₹2,82,000</b>; B 2,00,000 − 12,000 = <b>₹1,88,000</b>. Paid after every outside claim; cash closes at zero."
            }
          ]
        },

        examCases: [
          {
            id: 1,
            title: "Winding up the firm",
            passage: "A and B dissolve their firm sharing profits 3:2. Assets of ₹2,00,000 (book) realise ₹1,75,000; liabilities of ₹80,000 (book) are settled for ₹78,000; realisation expenses are ₹7,000. Before dissolution, A's capital was ₹3,00,000 and B's ₹2,00,000, with no reserves.",
            difficulty: "Hard",
            subs: [
              {
                q: "What is the total of the debit side of the realisation account?",
                options: ["₹2,85,000", "₹2,55,000", "₹2,00,000", "₹85,000"],
                answerIndex: 0,
                reasoning: "Assets transferred 2,00,000 + liabilities paid 78,000 + expenses 7,000 = ₹2,85,000."
              },
              {
                q: "The firm makes on realisation:",
                options: ["A loss of ₹30,000", "A profit of ₹30,000", "A loss of ₹7,000", "No profit or loss"],
                answerIndex: 0,
                reasoning: "Debits 2,85,000 − credits (80,000 + 1,75,000 = 2,55,000) = ₹30,000 loss."
              },
              {
                q: "B's share of the realisation loss is:",
                options: ["₹12,000", "₹18,000", "₹15,000", "₹7,500"],
                answerIndex: 0,
                reasoning: "30,000 × 2/5 = ₹12,000, debited to B's capital."
              }
            ]
          }
        ],

        examNumericals: [
          {
            id: 1, q: "On dissolution, assets (book) ₹3,00,000 realise ₹3,30,000; liabilities (book) ₹1,00,000 are paid ₹95,000; expenses ₹5,000. Find the profit on realisation (₹).",
            value: 30000,
            explanation: "Credits 3,30,000 + 1,00,000 = 4,30,000; debits 3,00,000 + 95,000 + 5,000 = 4,00,000 → ₹30,000 profit.",
            difficulty: "Medium"
          }
        ],

        quickRevision: {
          definition: "On dissolution of the firm every asset and liability is settled through the realisation account, the resulting profit or loss is shared in the profit-sharing ratio, and the remaining cash is divided after expenses, partners' loans and outside liabilities.",
          keyPoints: [
            "Realisation is nominal: debit assets transferred and liabilities paid; credit liabilities transferred and assets realised.",
            "Cash and bank balances are never transferred to realisation.",
            "The realisation result — profit or loss — is shared in the profit-sharing ratio.",
            "Order of payment: realisation expenses → partners' loans → outside liabilities → partners' capital.",
            "Dissolution of partnership (constitution changes) is not automatically the end of business; dissolution of firm ends it."
          ],
          calculationSteps: [
            "Step 1 — Open realisation; transfer assets (except cash/bank) at book value and liabilities at book value.",
            "Step 2 — Credit every amount realised from assets; debit every liability paid and every expense.",
            "Step 3 — Total both sides; the balance is profit or loss — share it in the profit-sharing ratio.",
            "Step 4 — Distribute reserves into capital accounts; close the realisation result into capital.",
            "Step 5 — Pay in statutory order; the final payments to partners bring both capital accounts and cash to zero."
          ],
          formulas: [
            { label: "Realisation result", expr: "(Assets realised + Liabilities transferred) − (Assets transferred + Liabilities paid + Expenses)" },
            { label: "Partner's final receipt", expr: "Capital + Reserves share + Profit share (− Loss share)" }
          ],
          distinctions: [
            {
              title: "Partnership dissolved vs firm dissolved",
              head: ["Dissolution of partnership", "Dissolution of firm"],
              rows: [
                ["Business", "Continues under a new constitution", "Ceases completely"],
                ["Realisation account", "Not opened", "Opened — the core of the process"],
                ["Trigger", "A partner leaves or terms change", "Mutual agreement or court order"]
              ]
            }
          ],
          examPoints: [
            "Never transfer cash or bank to realisation — the single most marked trap in this chapter.",
            "State the order of payments explicitly in a long-answer question; examiners look for it.",
            "Realisation profit/loss always uses the profit-sharing ratio — never a new or gaining ratio."
          ],
          commonMistakes: [
            "Including cash at bank among transferred assets.",
            "Paying partners' capital before outside liabilities.",
            "Sharing the realisation loss equally regardless of the profit-sharing ratio."
          ],
          mnemonic: "DACE — Debit: Assets transferred + costs paid; Credit: liabilities + assets realised — compare and share."
        }
      }
    },

    /* ================= MIND MAPS ================= */
    mindmaps: {
      adm: {
        center: "Admission of\na Partner",
        branches: [
          {
            label: "Ratio Work",
            color: "var(--c-adm)",
            children: ["New ratio = remainder × old shares", "Sacrificing ratio = old − new", "Sacrifices total the new partner's share", "Drives goodwill only, never revaluation"]
          },
          {
            label: "Revaluation",
            color: "var(--c-psr)",
            children: ["Debit: asset falls, liability rises", "Credit: asset rises, liability falls", "Profit/loss → old partners, old ratio", "Feeds the revised balance sheet"]
          },
          {
            label: "Goodwill (Premium Method)",
            color: "var(--c-gw)",
            children: ["New partner brings share in cash", "Credited to sacrificing partners", "Old book goodwill written off first", "AS-26 — no asset created"]
          },
          {
            label: "Accumulated Items",
            color: "var(--c-pf)",
            children: ["Reserves → old ratio", "Accumulated losses → old ratio", "Distributed at reconstitution", "Revised balance sheet starts clean"]
          },
          {
            label: "Capital & Balance Sheet",
            color: "var(--c-cfin)",
            children: ["Fix total capital of new firm", "Express in the new ratio", "Adjust by cash in/out", "Draw at revalued figures"]
          }
        ]
      },
      ret: {
        center: "Retirement &\nDeath of a Partner",
        branches: [
          {
            label: "The Two Ratios",
            color: "var(--c-ret)",
            children: ["Gaining ratio = new − old", "Gains total the outgoing share", "Funds goodwill compensation", "Old ratio still governs reserves/revaluation"]
          },
          {
            label: "Settlement of Outgoing Partner",
            color: "var(--c-pf)",
            children: ["Capital + reserves + revaluation", "Goodwill share (by gainers)", "Unpaid total → loan account", "Paid or carried as a liability"]
          },
          {
            label: "Death — Time Basis",
            color: "var(--c-adm)",
            children: ["Last year's or average profit", "× months elapsed ÷ 12", "× deceased's share", "Use when profits are steady"]
          },
          {
            label: "Death — Product Basis",
            color: "var(--c-gw)",
            children: ["Each period's profit × its months", "Σ products ÷ months counted", "Apply deceased's share", "Use when profits fluctuated"]
          },
          {
            label: "Executor & Balance Sheet",
            color: "var(--c-cfin)",
            children: ["Dues accumulate in executor's account", "Paid to legal heirs", "Revised balance sheet shows loan if unpaid", "Reserves distributed, old goodwill written off"]
          }
        ]
      },
      dis: {
        center: "Dissolution of a\nPartnership Firm",
        branches: [
          {
            label: "Two Meanings",
            color: "var(--c-dis)",
            children: ["Partnership dissolved ≠ firm always ends", "Firm dissolved = business ceases", "By agreement or by court", "Same accounting once firm dissolves"]
          },
          {
            label: "Realisation Account",
            color: "var(--c-pf)",
            children: ["Dr: assets at book, liabilities paid, expenses", "Cr: liabilities at book, assets realised", "Cash/bank never transferred", "Balance = profit/loss in PSR"]
          },
          {
            label: "Order of Payment",
            color: "var(--c-ret)",
            children: ["1. Realisation expenses", "2. Partners' loans", "3. Outside liabilities", "4. Partners' capital (surplus)"]
          },
          {
            label: "Final Division",
            color: "var(--c-cfin)",
            children: ["Reserves into capital first", "Realisation result into capital", "Pay each partner their balance", "Cash account closes at zero"]
          }
        ]
      }
    },

    /* ================= IMPORTANT QUESTIONS ================= */
    importantQuestions: {
      adm: [
        { type: "Short Answer", marks: 3, q: "A and B share 3:2; C is admitted for 1/5 of the profits, the remainder shared between A and B in the old ratio. Compute the new ratio and sacrificing ratio.",
          answer: "Remaining profit = 4/5, split 3:2 → A 12/25, B 8/25, C 5/25 → new ratio 12:8:5. Sacrifice: A 3/5 − 12/25 = 3/25; B 2/5 − 8/25 = 2/25 → sacrificing ratio 3:2 (total 5/25 = C's share ✓)." },
        { type: "Short Answer", marks: 3, q: "Explain why revaluation profit at admission is shared in the old ratio while goodwill premium is shared in the sacrificing ratio.",
          answer: "Revaluation measures changes that occurred under the old agreement — appreciation and depreciation accrued while only the old partners owned the firm, so they share it in the old ratio. The goodwill premium compensates partners for the specific future profit slices they surrendered to the newcomer, and only the sacrificing partners surrendered anything — hence the sacrificing ratio." },
        { type: "Short Answer", marks: 3, q: "Treatment of existing goodwill in the books at admission?",
          answer: "Existing (purchased) goodwill in the books is written off by the old partners in the old profit-sharing ratio before the premium method is applied — this ensures the same reputation is not counted twice: once as an old asset and again as fresh compensation." },
        { type: "Long Answer", marks: 6, q: "Revaluation: building up ₹40,000, stock down ₹15,000, claim up ₹5,000; General Reserve ₹90,000; goodwill ₹1,00,000 (C brings 1/5 share); ratio 3:2 → 12:8:5. Pass the journal entries at admission.",
          answer: "Revaluation: Building Dr 40,000 to Stock 15,000, Claim 5,000, Revaluation A/c 20,000 (profit) — then Revaluation Dr 20,000 to A 12,000, B 8,000 (old ratio). Reserve: General Reserve Dr 90,000 to A 54,000, B 36,000. Goodwill: Bank Dr 20,000 to A 12,000, B 8,000 (premium in sacrificing ratio 3:2)." },
        { type: "Short Answer", marks: 3, q: "What is a revised balance sheet, and which old items are absent from it?",
          answer: "The balance sheet drawn immediately after reconstitution. Reserves and accumulated losses are absent (distributed), existing goodwill is absent (written off), the outgoing... at admission these settle with the old partners, and all assets/liabilities appear at revalued values with partners' capitals reflecting the new agreed structure." },
        { type: "Long Answer", marks: 6, q: "Total capital of the reconstituted firm is fixed at ₹6,00,000 in ratio 12:8:5. A's capital was ₹2,00,000, B's ₹1,60,000 and C brings the amount required. Show the capital adjustments.",
          answer: "A = 6,00,000 × 12/25 = ₹2,88,000 → brings in ₹88,000. B = 6,00,000 × 8/25 = ₹1,92,000 → brings in ₹32,000. C = 6,00,000 × 5/25 = ₹1,20,000 → brings ₹1,00,000 as capital plus the agreed goodwill share. Entries: Bank Dr to respective capital accounts." },
        { type: "Short Answer", marks: 3, q: "State AS-26's position on goodwill at admission.",
          answer: "Only goodwill purchased for consideration is recognised. Goodwill the firm generated internally is never recorded as an asset — it may be valued at reconstitution, and cash or capital adjustments made between partners, but the firm's own books show no goodwill asset." }
      ],
      ret: [
        { type: "Short Answer", marks: 3, q: "Define gaining ratio. How does it differ from the sacrificing ratio used at admission?",
          answer: "Gaining ratio = new ratio − old ratio of continuing partners, showing who picked up the departing partner's share. At admission the sacrificing ratio = old − new shows who gave up share. They are mirror images: at retirement the outgoing partner sacrifices (continuing partners gain); compensation flows from gainers to the outgoing partner, whereas at admission it flows from the new partner to the sacrificers." },
        { type: "Short Answer", marks: 3, q: "A, B, C share 3:2:1; C retires; A and B continue 3:2. Compute gaining ratio and goodwill compensation on firm goodwill of ₹1,80,000.",
          answer: "A: 3/5 − 1/2 = 1/10; B: 2/5 − 1/3 = 1/15 → gaining ratio 3:2 (gains total 1/6 = C's share). C's goodwill share = 1,80,000 × 1/6 = ₹30,000, paid by A ₹18,000 and B ₹12,000." },
        { type: "Short Answer", marks: 3, q: "How is a retiring partner's unpaid settlement shown in the balance sheet?",
          answer: "As a loan — a liability of the firm. The partner's capital account is closed; from that moment the amount is a creditor's claim, carried as a loan until paid." },
        { type: "Long Answer", marks: 6, q: "Last year's profit ₹3,60,000; partner with 1/4 share dies on 30 September (April–March year). Compute the share of profit up to death on the time basis, and state when the product basis would be used.",
          answer: "Months elapsed April to 30 September = 6. Share = 3,60,000 × 6/12 × 1/4 = ₹45,000, credited to the deceased's account. The product basis is used when profits moved sharply during the year: each period's profit is multiplied by its months, products totalled and divided by the months counted (up to death), and the share applied to that weighted average." },
        { type: "Long Answer", marks: 6, q: "A, B, C share 3:2:1; C retires. Capital ₹3,00,000; General Reserve ₹2,40,000; revaluation profit ₹60,000; firm goodwill ₹1,80,000; new A:B = 3:2. Show C's settlement.",
          answer: "Gains: A 1/10, B 1/15 (3:2). C's account: capital 3,00,000 + reserve 2,40,000 × 1/6 = 40,000 + revaluation 60,000 × 1/6 = 10,000 + goodwill 1,80,000 × 1/6 = 30,000 (paid by A 18,000, B 12,000) = ₹3,80,000 total settlement; any unpaid balance is carried as C's loan." },
        { type: "Short Answer", marks: 3, q: "Explain the executor's account of a deceased partner.",
          answer: "All amounts due to the deceased — capital, share of reserves, revaluation share, goodwill compensation and profit up to the date of death — are transferred to the executor's account. It is debited when payments are made to the legal heirs and closed only when everything is settled." },
        { type: "Short Answer", marks: 3, q: "Profit Apr–Jun ₹90,000, Jul–Dec ₹1,50,000; partner (1/4) died 30 September. Compute share on product basis.",
          answer: "Products to death: 90,000 × 3 = 2,70,000; 1,50,000 × 3 = 4,50,000 → total 7,20,000 ÷ 6 months = ₹1,20,000 average monthly profit × 1/4 = ₹30,000 credited." }
      ],
      dis: [
        { type: "Short Answer", marks: 3, q: "Distinguish between dissolution of partnership and dissolution of the firm.",
          answer: "Dissolution of partnership changes the constitution — a partner leaves or terms change while the business continues (no realisation account). Dissolution of the firm winds up the entire business: assets realised, liabilities paid, cash divided (realisation account opened). Unless agreed otherwise, dissolution of partnership between all partners amounts to dissolution of the firm." },
        { type: "Short Answer", marks: 3, q: "Which items are excluded from the realisation account and why?",
          answer: "Cash and bank balances — they are the pool to be divided, not an asset to be realised. Also, amounts due to or from partners on capital/loan accounts are settled directly against those accounts rather than through realisation." },
        { type: "Long Answer", marks: 6, q: "Prepare the realisation account: assets (book) ₹5,00,000 realise ₹4,60,000; liabilities (book) ₹2,00,000 paid ₹1,95,000; expenses ₹15,000; partners A:B = 3:2.",
          answer: "Debit: assets 5,00,000 + liabilities paid 1,95,000 + expenses 15,000 = 7,10,000. Credit: liabilities 2,00,000 + assets realised 4,60,000 = 6,60,000. Loss = ₹50,000 → A 30,000, B 20,000, debited to their capital accounts in the profit-sharing ratio." },
        { type: "Short Answer", marks: 3, q: "State the order in which available cash is applied at dissolution.",
          answer: "First, realisation expenses; second, amounts due to partners for loans to the firm; third, outside liabilities; last, partners' capital balances. Partners receive the surplus only after every prior claim." },
        { type: "Short Answer", marks: 3, q: "How is profit or loss on realisation treated?",
          answer: "Transferred to the partners' capital accounts in the profit-sharing ratio — credited in case of profit, debited in case of loss — before the final cash division." },
        { type: "Long Answer", marks: 6, q: "On dissolution, assets (book) ₹3,00,000 realise ₹3,30,000; liabilities (book) ₹1,00,000 paid ₹95,000; expenses ₹5,000; capitals A ₹2,50,000, B ₹1,50,000 (3:2). Show the settlement.",
          answer: "Realisation: credits 3,30,000 + 1,00,000 = 4,30,000; debits 3,00,000 + 95,000 + 5,000 = 4,00,000 → profit ₹30,000 → A 18,000, B 12,000. A: 2,50,000 + 18,000 = ₹2,68,000; B: 1,50,000 + 12,000 = ₹1,62,000. Cash of ₹4,30,000 (3,30,000 realised + opening 1,00,000 cash)... paid: expenses 5,000, liabilities 95,000, then A 2,68,000 and B 1,62,000 → total ₹4,30,000 exactly, closing cash at zero." },
        { type: "Short Answer", marks: 3, q: "How is a fictitious asset treated at dissolution?",
          answer: "Fictitious assets such as accumulated losses or debit balances are settled with the partners in the profit-sharing ratio — they represent past losses of the firm, which on winding up are borne by the owners. (They never fetch cash, so they play no part in realisation cash flows.)" }
      ]
    },

    /* ================= QUIZ (ids 70031–70060) ================= */
    quiz: [
      { id: 70031, chapter: "adm", difficulty: "Easy",
        q: "Revaluation profit at admission is shared:",
        options: ["In the old ratio", "In the new ratio", "With the new partner", "In the sacrificing ratio"],
        answerIndex: 0,
        explanation: "The gain accrued under the old agreement — the newcomer has no claim to it." },
      { id: 70032, chapter: "adm", difficulty: "Medium",
        q: "A:B = 3:2; C admitted for 1/5. New ratio A:B:C is:",
        options: ["12:8:5", "3:2:1", "15:10:5", "4:5:1"],
        answerIndex: 0,
        explanation: "Remaining 4/5 split 3:2 → 12/25, 8/25, 5/25." },
      { id: 70033, chapter: "adm", difficulty: "Medium",
        q: "Goodwill of ₹1,00,000; C (1/5) brings their share; sacrificing ratio 3:2. B receives:",
        options: ["₹8,000", "₹12,000", "₹20,000", "₹40,000"],
        answerIndex: 0,
        explanation: "C brings ₹20,000, split 3:2 → B ₹8,000." },
      { id: 70034, chapter: "adm", difficulty: "Easy",
        q: "Who receives the cash a new partner brings for goodwill?",
        options: ["The sacrificing partners, in the sacrificing ratio", "All old partners in the old ratio", "The firm as reserve", "The new partner back"],
        answerIndex: 0,
        explanation: "Only those who gave up share are compensated." },
      { id: 70035, chapter: "adm", difficulty: "Easy",
        q: "Existing goodwill in the books at admission is:",
        options: ["Written off by old partners in old ratio", "Kept at the same value", "Credited to the new partner", "Added to revaluation"],
        answerIndex: 0,
        explanation: "Write it off first, then apply the premium method cleanly." },
      { id: 70036, chapter: "adm", difficulty: "Medium",
        q: "Firm capital fixed at ₹6,00,000; new ratio 12:8:5. C's capital is:",
        options: ["₹1,20,000", "₹1,00,000", "₹1,50,000", "₹2,00,000"],
        answerIndex: 0,
        explanation: "6,00,000 × 5/25 = ₹1,20,000." },
      { id: 70037, chapter: "adm", difficulty: "Medium",
        q: "A rise in a liability at admission is:",
        options: ["Debited to revaluation", "Credited to revaluation", "Shared with the new partner", "Sent to reserve"],
        answerIndex: 0,
        explanation: "Bad news for the revaluation account — debit side, reducing profit." },
      { id: 70038, chapter: "adm", difficulty: "Easy",
        q: "Admission of a partner means the firm is:",
        options: ["Reconstituted under a new agreement", "Dissolved", "Converted to a company", "Merged"],
        answerIndex: 0,
        explanation: "Old agreement ends, new begins — the firm itself continues." },
      { id: 70039, chapter: "adm", difficulty: "Hard",
        q: "Sacrificing ratio drives which adjustment?",
        options: ["Goodwill compensation only", "Revaluation only", "Reserve distribution", "Cash balance"],
        answerIndex: 0,
        explanation: "Revaluation uses the old ratio; reserves use the old ratio; goodwill follows sacrifice." },
      { id: 70040, chapter: "adm", difficulty: "Medium",
        q: "Under AS-26, goodwill brought in cash by a new partner is recorded as:",
        options: ["A credit to sacrificing partners' capitals", "An intangible asset", "Revenue income", "A liability of the firm"],
        answerIndex: 0,
        explanation: "Compensation between partners — never the firm's asset." },

      { id: 70041, chapter: "ret", difficulty: "Easy",
        q: "Gaining ratio is:",
        options: ["New ratio − old ratio", "Old ratio − new ratio", "New + old", "Goodwill ÷ capital"],
        answerIndex: 0,
        explanation: "The increase in continuing partners' shares." },
      { id: 70042, chapter: "ret", difficulty: "Medium",
        q: "A:B:C 3:2:1; C retires; new A:B = 3:2. A's gain is:",
        options: ["1/10", "1/15", "1/6", "3/10"],
        answerIndex: 0,
        explanation: "3/5 − 1/2 = 1/10 (B gains 1/15; total 1/6 = C's share)." },
      { id: 70043, chapter: "ret", difficulty: "Medium",
        q: "Goodwill ₹1,80,000; C's share 1/6. C's goodwill entitlement is:",
        options: ["₹30,000", "₹18,000", "₹12,000", "₹60,000"],
        answerIndex: 0,
        explanation: "1,80,000 × 1/6 = ₹30,000, funded by gainers in gaining ratio." },
      { id: 70044, chapter: "ret", difficulty: "Easy",
        q: "Unpaid settlement to a retiring partner appears as:",
        options: ["A loan — liability of the firm", "Capital of the firm", "A reserve", "An asset"],
        answerIndex: 0,
        explanation: "Capital closed; the dues become a creditor's claim." },
      { id: 70045, chapter: "ret", difficulty: "Medium",
        q: "Last year's profit ₹3,60,000; partner (1/4) died 30 September (April–March). Time-basis share is:",
        options: ["₹45,000", "₹90,000", "₹30,000", "₹15,000"],
        answerIndex: 0,
        explanation: "3,60,000 × 6/12 × 1/4 = ₹45,000." },
      { id: 70046, chapter: "ret", difficulty: "Hard",
        q: "Profits Apr–Jun ₹90,000, Jul–Dec ₹1,50,000; partner (1/4) died 30 September. Product-basis share:",
        options: ["₹30,000", "₹15,000", "₹45,000", "₹60,000"],
        answerIndex: 0,
        explanation: "Products 2,70,000 + 4,50,000 = 7,20,000 ÷ 6 = 1,20,000/month × 1/4 = ₹30,000." },
      { id: 70047, chapter: "ret", difficulty: "Easy",
        q: "Which ratio shares goodwill compensation at retirement?",
        options: ["Gaining ratio", "Old ratio", "New ratio", "Equal ratio"],
        answerIndex: 0,
        explanation: "The gainers pay — in the proportion they gained." },
      { id: 70048, chapter: "ret", difficulty: "Medium",
        q: "Revaluation profit at retirement goes:",
        options: ["To old partners in the old ratio", "To the retiring partner alone", "To continuing partners in gaining ratio", "To the executor"],
        answerIndex: 0,
        explanation: "It accrued under the old agreement." },
      { id: 70049, chapter: "ret", difficulty: "Easy",
        q: "A deceased partner's dues are accumulated in:",
        options: ["The executor's account", "Realisation account", "General reserve", "The gaining ratio"],
        answerIndex: 0,
        explanation: "Paid to legal heirs from there." },
      { id: 70050, chapter: "ret", difficulty: "Medium",
        q: "When is the product basis preferred for death profit?",
        options: ["When profits fluctuated sharply during the year", "When the firm is new", "When reserves exist", "Never — time basis is always used"],
        answerIndex: 0,
        explanation: "Period-weighting corrects for uneven years." },

      { id: 70051, chapter: "dis", difficulty: "Easy",
        q: "On dissolution, cash at bank is:",
        options: ["Never transferred to realisation", "Transferred to realisation debit", "Transferred to realisation credit", "Paid to creditors first of all"],
        answerIndex: 0,
        explanation: "Cash is the pool to divide — not an asset to realise." },
      { id: 70052, chapter: "dis", difficulty: "Hard",
        q: "Assets (book) 2,00,000 → realised 1,75,000; liabilities (book) 80,000 → paid 78,000; expenses 7,000. Result:",
        options: ["Loss ₹30,000", "Profit ₹30,000", "Loss ₹10,000", "Profit ₹5,000"],
        answerIndex: 0,
        explanation: "Credits 2,55,000 vs debits 2,85,000 → ₹30,000 loss." },
      { id: 70053, chapter: "dis", difficulty: "Easy",
        q: "Realisation account is a:",
        options: ["Nominal account", "Personal account", "Real account only", "Suspense account"],
        answerIndex: 0,
        explanation: "It records gains, losses and costs of winding up." },
      { id: 70054, chapter: "dis", difficulty: "Medium",
        q: "Profit on realisation is shared in the:",
        options: ["Profit-sharing ratio", "Gaining ratio", "Ratio of capitals", "Equal ratio"],
        answerIndex: 0,
        explanation: "The winding-up result belongs to the ownership agreement." },
      { id: 70055, chapter: "dis", difficulty: "Medium",
        q: "Liabilities of ₹60,000 settled for ₹55,000 — the ₹5,000 gain:",
        options: ["Increases realisation profit", "Reduces realisation profit", "Goes to creditors", "Is ignored"],
        answerIndex: 0,
        explanation: "Credited at 60,000, paid 55,000 — surplus of 5,000." },
      { id: 70056, chapter: "dis", difficulty: "Easy",
        q: "A partner's loan to the firm is paid:",
        options: ["After expenses, before capital", "After capital", "Before expenses", "Never"],
        answerIndex: 0,
        explanation: "Lending partners are creditors for the loan." },
      { id: 70057, chapter: "dis", difficulty: "Hard",
        q: "Correct order of payment from available cash:",
        options: ["Expenses → partners' loans → outside liabilities → capital", "Capital → liabilities → expenses", "Liabilities → capital → expenses", "Expenses → capital → everything else"],
        answerIndex: 0,
        explanation: "Statutory sequence — owners take the surplus last." },
      { id: 70058, chapter: "dis", difficulty: "Easy",
        q: "Dissolution by court differs from dissolution by agreement in that:",
        options: ["It is ordered by the court on application", "It uses a different account", "It forbids realisation", "It pays capital first"],
        answerIndex: 0,
        explanation: "Origin differs; the accounting is identical." },
      { id: 70059, chapter: "dis", difficulty: "Medium",
        q: "An asset of ₹25,000 realising ₹40,000 contributes:",
        options: ["₹40,000 cash against ₹25,000 book — ₹15,000 surplus", "₹15,000 only", "₹25,000 only", "Nothing extra"],
        answerIndex: 0,
        explanation: "Book value leaves; full proceeds arrive — the excess boosts realisation profit." },
      { id: 70060, chapter: "dis", difficulty: "Medium",
        q: "After all outside claims, the surplus cash goes:",
        options: ["To partners against their adjusted capital balances", "To the court", "To reserve", "To creditors"],
        answerIndex: 0,
        explanation: "Capital accounts already carry reserves and the realisation share." }
    ],

    /* ================= FLASHCARDS (ids 71025–71048) ================= */
    flashcards: [
      { id: 71025, chapter: "adm", front: "New ratio when old ratio is 3:2 and C is admitted for 1/5?", back: "Remainder 4/5 split 3:2 → A 12/25, B 8/25, C 5/25 = 12:8:5." },
      { id: 71026, chapter: "adm", front: "Sacrificing ratio formula?", back: "Old ratio − new ratio, partner-wise. At admission with the remainder split in the old ratio, the sacrificing ratio equals the old ratio." },
      { id: 71027, chapter: "adm", front: "Revaluation profit goes to?", back: "Old partners in the OLD ratio — the change accrued under the old agreement." },
      { id: 71028, chapter: "adm", front: "Premium for goodwill at admission?", back: "The new partner's cash share of firm goodwill is credited to the sacrificing partners in the sacrificing ratio — compensation between partners, never a firm asset (AS-26)." },
      { id: 71029, chapter: "adm", front: "Treatment of old goodwill in books?", back: "Written off by old partners in the old ratio before applying the premium method." },
      { id: 71030, chapter: "adm", front: "Capital adjustment formula at admission?", back: "Partner's capital = total capital of the reconstituted firm × partner's new share; adjust by bringing in or withdrawing cash." },
      { id: 71031, chapter: "adm", front: "What does a revised balance sheet show?", back: "Revalued assets/liabilities, distributed reserves, written-off goodwill, new capital structure — no accumulated residue." },
      { id: 71032, chapter: "adm", front: "AS-26 and admission goodwill?", back: "Only purchased goodwill is recorded; goodwill brought by the new partner is a credit to sacrificing partners' capitals, not an asset." },

      { id: 71033, chapter: "ret", front: "Gaining ratio formula?", back: "New ratio − old ratio of continuing partners; gains total the outgoing partner's share." },
      { id: 71034, chapter: "ret", front: "Who funds the outgoing partner's goodwill share?", back: "The gaining partners, in the gaining ratio." },
      { id: 71035, chapter: "ret", front: "What happens to unpaid retirement dues?", back: "Carried as a loan of the firm — the partner's capital account is closed and the partner becomes a creditor." },
      { id: 71036, chapter: "ret", front: "Time-basis share of profit up to death?", back: "Profit × (months elapsed ÷ 12) × deceased's share — for years with steady profits." },
      { id: 71037, chapter: "ret", front: "Product-basis share of profit up to death?", back: "Σ(period profit × period months) ÷ months counted (up to death) × share — for fluctuating profits." },
      { id: 71038, chapter: "ret", front: "Which ratio shares reserves at retirement?", back: "The OLD ratio — accumulated profits belong to the old agreement." },
      { id: 71039, chapter: "ret", front: "Where do a deceased partner's dues accumulate?", back: "In the executor's account, before payment to the legal heirs." },
      { id: 71040, chapter: "ret", front: "Revised balance sheet after retirement shows?", back: "Loan where the outgoing partner's capital was, reserves distributed, old goodwill written off, revalued figures." },

      { id: 71041, chapter: "dis", front: "Realisation account — what is debited?", back: "Assets transferred at book value (cash/bank excluded), liabilities actually paid, and realisation expenses." },
      { id: 71042, chapter: "dis", front: "Realisation account — what is credited?", back: "Liabilities transferred at book value and the cash realised from each asset." },
      { id: 71043, chapter: "dis", front: "Which balance never enters realisation?", back: "Cash at bank / cash in hand — they are the pool being divided." },
      { id: 71044, chapter: "dis", front: "Where does realisation profit or loss go?", back: "Partners' capital accounts in the profit-sharing ratio." },
      { id: 71045, chapter: "dis", front: "Order of payment at dissolution?", back: "Realisation expenses → partners' loans → outside liabilities → partners' capital (surplus)." },
      { id: 71046, chapter: "dis", front: "Realisation result formula?", back: "(Assets realised + liabilities transferred) − (assets transferred + liabilities paid + expenses)." },
      { id: 71047, chapter: "dis", front: "Dissolution of partnership vs firm?", back: "Partnership dissolution changes the constitution (business continues, no realisation). Firm dissolution ends the business (realisation opened, cash divided)." },
      { id: 71048, chapter: "dis", front: "How is a partner's loan settled at dissolution?", back: "After realisation expenses and before partners' capital — lending partners are creditors for their loans." }
    ]
  });
})();
