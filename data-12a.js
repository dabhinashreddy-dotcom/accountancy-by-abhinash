/* ============================================================
   CLASS 12 — PART A: PARTNERSHIP FIRMS I (v83)
   Chapters 1–3: Partnership Fundamentals (pf), Goodwill (gw),
   Change in Profit-Sharing Ratio (psr).
   Plain browser script: registers everything into C12_DATA
   (data-12.js must load first). Node/tests can vm-evaluate it
   in the same way, since C12_DATA is a free variable.
   Content is original teaching material written for this project
   against the published CBSE Class 12 Accountancy curriculum
   (session 2026-27) — not copied from any textbook.
   ============================================================ */
(function () {
  "use strict";

  C12_DATA.register({

    /* ================= CONTENT ================= */
    content: {

      /* ---------- Chapter 1: Partnership Fundamentals ---------- */
      pf: {
        theory: {
          simple: [
            {
              h: "What a Partnership Is",
              p: "A partnership is a relationship between persons who have agreed to share the profits of a business carried on by all or any of them acting for all. The governing features: at least two persons, an agreement (written deed or oral), sharing of profits, and mutual agency — every partner can bind the firm with their acts.",
              list: [
                { term: "Partnership deed", def: "The written agreement recording the terms — profit ratio, interest, salary, capital — and the firm's single most important document when a dispute reaches court." },
                { term: "Mutual agency", def: "Each partner is the agent of all the other partners: an act of one partner in the ordinary course of business binds the whole firm." },
                { term: "Indian Partnership Act, 1932", def: "Fills every gap the deed leaves silent — which is why knowing the Act's default rules matters as much as knowing the deed's terms." }
              ]
            },
            {
              h: "From Net Profit to Divisible Profit",
              p: "Net profit is the starting point of the Profit and Loss Appropriation Account — the account that divides the year's profit among the partners. Debit side: interest on capital, partners' salary or commission, transfers to reserves. Credit side: interest on drawings, the net profit itself brought down.",
              p2: "What survives these appropriations is the divisible profit, split between the partners in their profit-sharing ratio. Appropriations are paid only out of profit unless the deed converts them into charges — the distinction decides what happens in a loss year.",
              formula: "Divisible profit = Net profit + Interest on drawings − Interest on capital − Partners' salary/commission − Transfers to reserves"
            },
            {
              h: "Charge Against Profit vs Appropriation of Profit",
              p: "An appropriation is a division of profit — it can exist only when profit exists. A charge against profit is an expense the firm owes regardless of the result. Interest on a partner's loan is always a charge: a partner who lent money is a creditor first and a partner second, and lending does not waive the right to interest even in a loss year.",
              list: [
                { term: "Appropriations (default)", def: "Interest on capital, partners' salary and commission, interest on drawings." },
                { term: "Charges (always)", def: "Interest on a partner's loan to the firm; anything the deed expressly declares a charge." }
              ]
            }
          ],
          advanced: [
            {
              h: "Interest on Capital When Profit Is Insufficient",
              p: "When the deed provides interest on capital as an appropriation but the year's profit cannot cover the full demand, the interest is not refused and not paid in full — it is reduced proportionately, in the ratio of the amounts actually claimed. Salary and other appropriations share the same pro-rata reduction, so every item is scaled by one common factor.",
              formula: "Amount payable = Full claim × (Profit available ÷ Total appropriations claimed)"
            },
            {
              h: "Guarantee of Minimum Profit to a Partner",
              p: "A partner may be guaranteed a minimum share of profit — by the firm as a whole, by one specific partner, or by the remaining partners in an agreed proportion. If the guaranteed partner's computed share falls short, the deficiency is met by the guaranteeing party; only the profit left after that payment is distributed among the others.",
              p2: "The examination favourite is a guarantee by the firm: compute every partner's share as usual, find the deficiency of the guaranteed partner, and cover it by reducing the other partners' shares in their profit-sharing ratio."
            },
            {
              h: "Past Adjustments",
              p: "Sometimes the accounts are closed and only later does the firm notice that an appropriation was missed, or charged to the wrong partner. A single adjusting entry then corrects the past division: for each partner compute (correct share − amount already received), and pass one journal entry through the partners' capital accounts. The sum of all corrections is always zero — what one partner gains, another gives up.",
              formula: "Adjustment for a partner = Correct entitlement − Amount already credited"
            }
          ]
        },

        concepts: [
          { title: "Divisible profit", body: "The profit remaining after every appropriation the deed provides for — the slice actually shared between the partners in the profit-sharing ratio." },
          { title: "Mutual agency", body: "Each partner can act for the firm and bind every other partner in matters within the ordinary course of the business — the legal glue that makes a partnership a single economic unit." },
          { title: "Fixed vs fluctuating capital", body: "Under fixed capital, the capital account moves only on introduction or withdrawal, and salary, interest and drawings are kept in separate accounts. Under fluctuating capital, everything is merged into one account — the default when the deed is silent." },
          { title: "Guarantee of profit", body: "A promise that a partner will receive at least a stated amount of profit; any shortfall — the deficiency — is borne by the guaranteeing partner or partners in the agreed manner." }
        ],

        formats: [
          {
            title: "Profit and Loss Appropriation Account",
            note: "Nominal account. Opens with net profit brought down; closes with divisible profit transferred in the profit-sharing ratio.",
            head: ["Particulars", "Amount (₹)", "Particulars", "Amount (₹)"],
            rows: [
              ["To Interest on Capital — A", "6,000", "By Net Profit b/d", "1,20,000"],
              ["To Interest on Capital — B", "4,000", "By Interest on Drawings — A", "2,000"],
              ["To Partner's Salary — A", "12,000", "", ""],
              ["To Transfer to General Reserve", "20,000", "", ""],
              ["To Divisible Profit (3:2)", "1,00,000", "", ""],
              ["Total", "1,42,000", "Total", "1,42,000"]
            ]
          },
          {
            title: "Partner's Capital Account — Fluctuating (default)",
            note: "One account per partner carries every adjustment of the year.",
            head: ["Particulars", "A (₹)", "B (₹)", "Particulars", "A (₹)", "B (₹)"],
            rows: [
              ["To Drawings", "10,000", "6,000", "By Balance b/d", "1,00,000", "60,000"],
              ["To P&L Appropriation (share)", "60,000", "40,000", "By Interest on Capital", "6,000", "4,000"],
              ["To Balance c/d", "1,56,000", "98,000", "By Salary", "12,000", "—"],
              ["", "", "", "By Interest on Drawings", "2,000", "—"],
              ["Total", "2,26,000", "1,44,000", "Total", "2,26,000", "1,44,000"]
            ]
          }
        ],

        numericals: [
          {
            id: 1, difficulty: "Easy",
            question: "Net profit for the year is ₹1,20,000. Interest on capital is ₹6,000 (A) and ₹4,000 (B), salary to A is ₹12,000, and interest on A's drawings is ₹2,000. What is the divisible profit?",
            options: ["₹1,00,000", "₹1,02,000", "₹98,000", "₹1,10,000"],
            answerIndex: 0,
            explanation: "Divisible profit = 1,20,000 + 2,000 − 6,000 − 4,000 − 12,000 = ₹1,00,000."
          },
          {
            id: 2, difficulty: "Medium",
            question: "A firm earns only ₹9,000 profit. The deed provides interest on capital of ₹6,000 (A) and ₹4,000 (B) and a salary of ₹8,000 to A. Profit cannot meet the appropriations. How much interest on capital is credited to A?",
            options: ["₹3,000", "₹4,500", "₹6,000", "₹4,000"],
            answerIndex: 0,
            explanation: "Total demand = 6,000 + 4,000 + 8,000 = ₹18,000 against ₹9,000 available — exactly half. A's interest = 6,000 × 9,000/18,000 = ₹3,000."
          },
          {
            id: 3, difficulty: "Medium",
            question: "P and Q share profits 2:1. Net profit ₹90,000 is divided, but Q was guaranteed a minimum of ₹40,000 by P. The deficiency is met by:",
            options: ["P alone, from his own share", "The firm, from general reserve", "Both partners equally", "Nobody — Q gets whatever remains"],
            answerIndex: 0,
            explanation: "Q's share = 90,000 × 1/3 = ₹30,000, short by ₹10,000. Since P guaranteed the amount, the full deficiency is met by P."
          },
          {
            id: 4, difficulty: "Easy",
            question: "Interest on a partner's loan to the firm is:",
            options: ["A charge against profit, payable even in a loss year", "An appropriation, paid only out of profit", "Payable only if the deed mentions it", "Never payable"],
            answerIndex: 0,
            explanation: "Under the Indian Partnership Act a partner is entitled to interest on a loan at 6% per annum unless the deed states otherwise, and it is a charge — not an appropriation."
          },
          {
            id: 5, difficulty: "Easy",
            question: "When the partnership deed is silent about the method of maintaining capital accounts, the default is:",
            options: ["Fluctuating capital accounts", "Fixed capital accounts", "No capital accounts at all", "Revaluation accounts"],
            answerIndex: 0,
            explanation: "The fluctuating method — one account per partner carrying salary, interest and drawings — applies unless the deed expressly adopts the fixed system."
          },
          {
            id: 6, difficulty: "Easy",
            question: "Interest on drawings of a partner is recorded in the Profit and Loss Appropriation Account on the:",
            options: ["Credit side, as it increases divisible profit", "Debit side, as it reduces divisible profit", "Debit side of the Profit and Loss Account", "Asset side of the balance sheet"],
            answerIndex: 0,
            explanation: "Drawings interest is income for the firm — credited to the appropriation account, increasing the profit available to share."
          },
          {
            id: 7, difficulty: "Medium",
            question: "The Profit and Loss Appropriation Account begins with:",
            options: ["Net profit brought down from the Profit and Loss Account", "Gross profit brought down from the Trading Account", "The balance of the partners' capital accounts", "Cash at bank"],
            answerIndex: 0,
            explanation: "Appropriation is a division of the net profit already computed — gross profit has not yet borne indirect expenses."
          },
          {
            id: 8, difficulty: "Medium",
            question: "Partners A and B share 3:2. A transfer of ₹20,000 to General Reserve is made. This transfer:",
            options: ["Reduces divisible profit and is an appropriation of profit", "Reduces net profit and is a charge against profit", "Does not affect the partners at all", "Increases the firm's assets"],
            answerIndex: 0,
            explanation: "A transfer to reserve is made out of profit after it is earned — an appropriation. It reduces what the partners share but not the net profit reported for the year."
          },
          {
            id: 9, difficulty: "Hard",
            question: "Profit for the year ₹45,000. The deed declares interest on capital (A ₹6,000, B ₹4,000) and a salary of ₹20,000 to B to be charges against profit. How much does B receive?",
            options: ["₹20,000, paid in full because the deed makes the items charges", "₹10,000, being half of the salary after pro-rata reduction", "Nothing, because salary is an appropriation", "₹18,000, being the salary plus B's interest on capital"],
            answerIndex: 0,
            explanation: "Total demand = 6,000 + 4,000 + 20,000 = ₹30,000, which the ₹45,000 profit covers in full. Because the deed made these items charges, they are deducted even in principle regardless of profit — B's salary is ₹20,000 and B's interest on capital adds ₹4,000 on top."
          },
          {
            id: 10, difficulty: "Medium",
            question: "In a past-adjustment correction, a partner's correction figure is positive. This means:",
            options: ["The partner was under-credited earlier and now receives the difference", "The partner was over-credited and now pays back the difference", "The partner has resigned", "The firm suffered a loss"],
            answerIndex: 0,
            explanation: "Correction = correct entitlement − amount already received. A positive result means too little was credited before, so the entry credits the partner now."
          }
        ],

        activity: {
          type: "journal",
          title: "Appropriation Journal Lab",
          instruction: "Fluctuating capital accounts are in use. Build each journal entry — pick the account to debit, the account to credit, and type the amount. Every entry is checked against the deed's working before it is stamped verified.",
          entries: [
            {
              prompt: "Interest on capital of Partner A, ₹6,000, is provided out of profit for the year.",
              dr: ["Profit and Loss Appropriation A/c", "Profit and Loss A/c", "Interest on Capital A/c", "Partner's Current A/c"],
              cr: ["Partner A's Capital A/c", "Interest on Capital A/c", "Profit and Loss Appropriation A/c", "General Reserve A/c"],
              drAccount: "Profit and Loss Appropriation A/c",
              crAccount: "Partner A's Capital A/c",
              amount: 6000,
              note: "Interest on capital is an appropriation — it comes out of profit in the appropriation account, never out of the Profit and Loss Account directly."
            },
            {
              prompt: "Salary of ₹12,000 for the year is due to Partner B.",
              dr: ["Profit and Loss Appropriation A/c", "Profit and Loss A/c", "Partner B's Capital A/c", "Salary A/c"],
              cr: ["Partner B's Capital A/c", "Salary A/c", "Profit and Loss Appropriation A/c", "Cash A/c"],
              drAccount: "Profit and Loss Appropriation A/c",
              crAccount: "Partner B's Capital A/c",
              amount: 12000,
              note: "Partner salary is an appropriation of profit under the fluctuating method — credited straight to the partner's capital account."
            },
            {
              prompt: "Interest on drawings of ₹2,000 is charged to Partner A.",
              dr: ["Partner A's Capital A/c", "Drawings A/c", "Profit and Loss Appropriation A/c", "Cash A/c"],
              cr: ["Profit and Loss Appropriation A/c", "Interest on Drawings A/c", "Partner A's Capital A/c", "Profit and Loss A/c"],
              drAccount: "Partner A's Capital A/c",
              crAccount: "Profit and Loss Appropriation A/c",
              amount: 2000,
              note: "Drawings interest is income for the firm: debit the partner, credit the appropriation account — it raises divisible profit."
            },
            {
              prompt: "Divisible profit of ₹1,00,000 is credited to Partner A, whose share is three-fifths.",
              dr: ["Profit and Loss Appropriation A/c", "Divisible Profit A/c", "Partner A's Capital A/c", "Profit and Loss A/c"],
              cr: ["Partner A's Capital A/c", "General Reserve A/c", "Profit and Loss Appropriation A/c", "Interest on Capital A/c"],
              drAccount: "Profit and Loss Appropriation A/c",
              crAccount: "Partner A's Capital A/c",
              amount: 60000,
              note: "Three-fifths of ₹1,00,000 = ₹60,000. The appropriation account is closed by dividing the residual profit."
            },
            {
              prompt: "₹20,000 is transferred from profit to the General Reserve.",
              dr: ["Profit and Loss Appropriation A/c", "General Reserve A/c", "Profit and Loss A/c", "Reserve A/c"],
              cr: ["General Reserve A/c", "Profit and Loss Appropriation A/c", "Reserve Fund A/c", "Partners' Capital A/c"],
              drAccount: "Profit and Loss Appropriation A/c",
              crAccount: "General Reserve A/c",
              amount: 20000,
              note: "A transfer to reserve is an appropriation — it reduces divisible profit but leaves net profit untouched."
            }
          ]
        },

        examCases: [
          {
            id: 1,
            title: "Appropriation on a modest profit",
            passage: "Nita and Ravi carry on a firm sharing profits and losses in the ratio 3:2, with fluctuating capital accounts. The deed provides interest on capital at 8% on capitals of ₹1,12,500 (Nita) and ₹75,000 (Ravi), a salary of ₹12,000 to Nita, and interest on drawings at 10% on Nita's drawings of ₹30,000. Net profit for the year is ₹90,000.",
            difficulty: "Hard",
            subs: [
              {
                q: "What is the total interest on capital provided for the year?",
                options: ["₹16,500", "₹15,000", "₹18,000", "₹12,000"],
                answerIndex: 1,
                reasoning: "8% of ₹1,12,500 = ₹9,000 and 8% of ₹75,000 = ₹6,000 — interest on capital totals ₹15,000. Salary and drawings interest are separate appropriation lines and do not belong in this figure."
              },
              {
                q: "What is the divisible profit for the year?",
                options: ["₹66,000", "₹72,000", "₹60,000", "₹69,000"],
                answerIndex: 0,
                reasoning: "90,000 − 15,000 interest on capital − 12,000 salary + 3,000 drawings interest = ₹66,000."
              },
              {
                q: "How much is credited to Nita's capital account for interest on capital, salary and profit share together?",
                options: ["₹66,600", "₹57,600", "₹78,600", "₹60,600"],
                answerIndex: 3,
                reasoning: "Interest on capital ₹9,000 + salary ₹12,000 + share of divisible profit 66,000 × 3/5 = ₹39,600 — total ₹60,600 credited to Nita. Her drawings interest of ₹3,000 is separately debited to her, which is why it is not added here."
              }
            ]
          },
          {
            id: 2,
            title: "A guarantee by one partner",
            passage: "Sana and Tia run a firm sharing profits 2:1. For the year the net profit is ₹90,000 before any appropriation. Sana has agreed to guarantee Tia a minimum profit of ₹40,000, the deficiency to be borne by Sana alone. There are no interest or salary provisions.",
            difficulty: "Hard",
            subs: [
              {
                q: "What would Tia's share be without the guarantee?",
                options: ["₹30,000", "₹45,000", "₹60,000", "₹20,000"],
                answerIndex: 0,
                reasoning: "90,000 × 1/3 = ₹30,000 — the arithmetic before any guarantee adjustment."
              },
              {
                q: "What is the deficiency Tia suffers before the guarantee is applied?",
                options: ["₹10,000", "₹15,000", "₹5,000", "₹20,000"],
                answerIndex: 0,
                reasoning: "Guaranteed minimum ₹40,000 − actual share ₹30,000 = ₹10,000 short."
              },
              {
                q: "How much profit does Sana finally keep?",
                options: ["₹50,000", "₹55,000", "₹60,000", "₹45,000"],
                answerIndex: 0,
                reasoning: "Sana's own share 90,000 × 2/3 = ₹60,000, from which the ₹10,000 deficiency is met — ₹50,000. Total distributed: 50,000 + 40,000 = 90,000 ✓."
              }
            ]
          }
        ],

        examNumericals: [
          {
            id: 1, q: "Net profit ₹9,000. Deed: interest on capital ₹6,000 (A) and ₹4,000 (B), salary ₹8,000 to A. Profit cannot meet appropriations. Find the interest on capital credited to A (₹).",
            value: 3000,
            explanation: "Total claim 18,000 against 9,000 available — pay 50%: A gets 6,000 × 0.5 = ₹3,000.",
            difficulty: "Medium"
          },
          {
            id: 2, q: "Net profit ₹1,20,000; interest on capital ₹6,000 (A) and ₹4,000 (B); salary ₹12,000 (A); interest on drawings ₹2,000 (A). Find the divisible profit (₹).",
            value: 100000,
            explanation: "1,20,000 + 2,000 − 6,000 − 4,000 − 12,000 = ₹1,00,000.",
            difficulty: "Easy"
          }
        ],

        quickRevision: {
          definition: "Partnership: a relationship between persons who have agreed to share the profits of a business carried on by all or any of them acting for all (Indian Partnership Act, 1932). The Profit and Loss Appropriation Account divides that profit among the partners.",
          keyPoints: [
            "The appropriation account opens with net profit brought down and closes with divisible profit shared in the profit-sharing ratio.",
            "Interest on capital, partner's salary and commission are appropriations by default; interest on a partner's loan is always a charge against profit.",
            "Fluctuating capital accounts are the default when the deed is silent; fixed capital needs the deed to say so.",
            "A guarantee fixes a minimum; the deficiency is borne by whoever gave the guarantee, in the agreed manner.",
            "When profit cannot meet appropriations, every item is reduced proportionately — never paid in full and never refused outright."
          ],
          calculationSteps: [
            "Step 1 — Start with net profit from the Profit and Loss Account.",
            "Step 2 — Add interest on drawings; deduct interest on capital, salary/commission and transfers to reserves.",
            "Step 3 — The balance is divisible profit; if a guarantee exists, test each partner's share against the minimum.",
            "Step 4 — Cover any deficiency from the guaranteeing partner, then distribute the residue in the profit-sharing ratio.",
            "Step 5 — For past adjustments: compute (correct share − amount received) per partner and pass one correcting entry."
          ],
          formulas: [
            { label: "Divisible profit", expr: "Net profit + Interest on drawings − Appropriations" },
            { label: "Pro-rata payment", expr: "Amount payable = Claim × (Profit available ÷ Total claim)" },
            { label: "Past adjustment", expr: "Correct share − Amount already credited" }
          ],
          distinctions: [
            {
              title: "Charge vs appropriation",
              head: ["Charge against profit", "Appropriation of profit"],
              rows: [
                ["Meaning", "An expense payable whether or not there is profit", "A division of profit — exists only when profit exists"],
                ["Example", "Interest on a partner's loan to the firm", "Interest on capital, partner's salary"],
                ["In a loss year", "Still payable", "Nothing is paid"]
              ]
            }
          ],
          examPoints: [
            "In insufficient-profit problems, compute one factor: profit available ÷ total appropriations claimed, and scale every item by it.",
            "In guarantee problems, always compute shares first, test the minimum second, and cover the deficiency last.",
            "A transfer to General Reserve reduces divisible profit but not net profit — a favourite one-mark trap."
          ],
          commonMistakes: [
            "Charging interest on capital to the Profit and Loss Account — it belongs to the appropriation account.",
            "Paying the guaranteed partner's deficiency from the firm instead of the guaranteeing partner.",
            "Forgetting interest on drawings on the credit side, which inflates the apparent appropriations."
          ],
          mnemonic: "ISA — Interest on capital, Salary, Adjustments come out of profit; loan interest is always a Charge."
        }
      },

      /* ---------- Chapter 2: Goodwill — Nature & Valuation ---------- */
      gw: {
        theory: {
          simple: [
            {
              h: "What Goodwill Is",
              p: "Goodwill is the value of a business's reputation — the excess earning power a firm enjoys because of everything intangible it has built. It is not an asset a firm creates internally and records; it becomes a measurable figure only when a partnership is reconstituted and someone must be paid for their share of it.",
              list: [
                { term: "When it is valued", def: "Admission, retirement, death of a partner, sale or amalgamation of the firm — every event that changes who owns the profit stream." },
                { term: "AS-26 position", def: "Purchased goodwill is recorded in the books; self-generated goodwill is not — you value it to settle partners, not to show it as an asset." }
              ]
            },
            {
              h: "Factors That Build Goodwill",
              p: "A firm's reputation compounds over years. The examiners' standard list: a favourable location, quality of products or services, efficient and experienced management, a loyal customer base, monopoly position or restrictions on entry, and a record of earning returns above the normal for the industry.",
              p2: "The last factor — earning above normal — is the one the valuation methods actually measure. The others are the reasons the excess exists."
            },
            {
              h: "The Three Valuation Methods at a Glance",
              p: "Average profit method capitalises the firm's recent average earnings. Super profit method isolates only the earnings above normal and capitalises those. Capitalisation methods work backwards from the value the market would place on those earnings.",
              formula: "Average Profit: GP = Avg profit × n years · Super Profit: SP = Avg profit − (Capital employed × NRR); GP = SP × n · Capitalisation: SP ÷ NRR, or (Avg ÷ NRR) − Capital employed"
            }
          ],
          advanced: [
            {
              h: "Super Profit — the Heart of the Chapter",
              p: "A firm earning exactly the normal rate of return has no goodwill: anyone could earn that elsewhere. Goodwill exists only where earnings exceed the normal return on the capital actually employed, and super profit measures exactly that excess year after year.",
              p2: "Capital employed means the long-term funds invested in the business — total assets less long-term liabilities, or partners' capital plus long-term reserves, whichever the problem indicates.",
              formula: "Super profit = Average profit − Normal profit, where Normal profit = Capital employed × Normal rate of return"
            },
            {
              h: "Capitalisation of Average Profit",
              p: "Ask a different question: what total capital would produce this average profit at the normal rate? The answer is the firm's capitalized value. Subtract the capital actually employed from it, and what remains is the value of the excess — goodwill.",
              formula: "Goodwill = (Average profit ÷ Normal rate of return) − Capital employed"
            },
            {
              h: "Reading Years' Purchase",
              p: "Years' purchase multiplies one year's surplus into a price. Three years' purchase means the buyer pays for three years of past super performance. It is given in the question, never guessed — and doubling it doubles goodwill proportionally, which is why problems state it plainly."
            }
          ]
        },

        concepts: [
          { title: "Super profit", body: "The excess of a firm's average profit over the normal profit its capital could earn elsewhere — the annual surplus goodwill exists to represent." },
          { title: "Normal rate of return (NRR)", body: "The return typically earned by capital in that line of business — the hurdle a firm must clear before any goodwill arises." },
          { title: "Capital employed", body: "The long-term funds invested in the business: partners' capital plus long-term reserves, equivalently total assets less long-term liabilities." },
          { title: "Years' purchase", body: "The multiplier converting one year of surplus into the goodwill price — how many past years of excess earnings the buyer pays for." }
        ],

        formats: [
          {
            title: "Goodwill — the three methods side by side",
            note: "Every method must agree when the inputs are consistent — that agreement is your exam check.",
            head: ["Method", "Formula", "Worked on: Avg ₹1,80,000 · Capital ₹12,00,000 · NRR 10% · 3 years"],
            rows: [
              ["Average profit", "Avg profit × n years", "1,80,000 × 3 = ₹5,40,000"],
              ["Super profit", "(Avg − Capital × NRR) × n", "(1,80,000 − 1,20,000) × 3 = ₹1,80,000"],
              ["Capitalisation of super profit", "Super profit ÷ NRR", "60,000 ÷ 0.10 = ₹6,00,000"],
              ["Capitalisation of average profit", "(Avg ÷ NRR) − Capital", "18,00,000 − 12,00,000 = ₹6,00,000"]
            ]
          },
          {
            title: "Super profit sheet",
            note: "Build this table first in any super-profit problem — the goodwill line is one multiplication away.",
            head: ["Particulars", "Amount (₹)"],
            rows: [
              ["Average profit of the years considered", "1,80,000"],
              ["Less: normal profit (12,00,000 × 10%)", "(1,20,000)"],
              ["Super profit", "60,000"],
              ["Goodwill at 3 years' purchase", "1,80,000"]
            ]
          }
        ],

        numericals: [
          {
            id: 1, difficulty: "Easy",
            question: "Average annual profit of a firm is ₹2,40,000. Goodwill is to be valued at three years' purchase. The goodwill is:",
            options: ["₹7,20,000", "₹2,40,000", "₹3,60,000", "₹8,00,000"],
            answerIndex: 0,
            explanation: "2,40,000 × 3 = ₹7,20,000 — the average profit method in its simplest form."
          },
          {
            id: 2, difficulty: "Medium",
            question: "A firm earns an average profit of ₹1,80,000; capital employed is ₹12,00,000 and the normal rate of return is 10%. The super profit is:",
            options: ["₹60,000", "₹1,20,000", "₹1,80,000", "₹3,00,000"],
            answerIndex: 0,
            explanation: "Normal profit = 12,00,000 × 10% = ₹1,20,000. Super profit = 1,80,000 − 1,20,000 = ₹60,000."
          },
          {
            id: 3, difficulty: "Medium",
            question: "Super profit is ₹45,000 and goodwill is valued at four years' purchase. Goodwill equals:",
            options: ["₹1,80,000", "₹45,000", "₹90,000", "₹2,25,000"],
            answerIndex: 0,
            explanation: "45,000 × 4 = ₹1,80,000."
          },
          {
            id: 4, difficulty: "Hard",
            question: "Super profit is ₹50,000 and the normal rate of return is 10%. Goodwill by the capitalisation of super profit method is:",
            options: ["₹5,00,000", "₹50,000", "₹50,00,000", "₹1,00,000"],
            answerIndex: 0,
            explanation: "Capitalised value = 50,000 ÷ 0.10 = ₹5,00,000 — the stream of surplus capitalised at the normal rate."
          },
          {
            id: 5, difficulty: "Hard",
            question: "Average profit ₹2,00,000, capital employed ₹20,00,000, normal rate 8%. Goodwill by the capitalisation of average profit method is:",
            options: ["₹5,00,000", "₹2,00,000", "₹16,00,000", "₹25,00,000"],
            answerIndex: 0,
            explanation: "Capitalised value = 2,00,000 ÷ 0.08 = ₹25,00,000. Less capital employed ₹20,00,000 → goodwill ₹5,00,000."
          },
          {
            id: 6, difficulty: "Easy",
            question: "Which of these is a factor affecting goodwill?",
            options: ["A favourable location of the business", "The salary of the firm's accountant", "The firm's bank overdraft", "The number of journal entries passed"],
            answerIndex: 0,
            explanation: "Location, product quality, management, customer loyalty and above-normal returns are the standard factors — the rest are unrelated to earning power."
          },
          {
            id: 7, difficulty: "Medium",
            question: "A firm's average profit and capital employed both double, with the NRR unchanged. Super profit will:",
            options: ["Double", "Remain the same", "Quadruple", "Become zero"],
            answerIndex: 0,
            explanation: "Both terms scale together: (2A − 2C×r) = 2(A − C×r) — super profit doubles exactly with the scale of the business."
          },
          {
            id: 8, difficulty: "Medium",
            question: "Internally generated goodwill, when revalued at a partner's admission:",
            options: ["Is not recorded as an asset but is settled between partners in cash or capital adjustment", "Is recorded as an intangible asset in the balance sheet", "Is transferred to the General Reserve", "Cannot be valued at all"],
            answerIndex: 0,
            explanation: "AS-26: only purchased goodwill enters the books. Self-generated goodwill is valued purely to settle the partners' shares."
          },
          {
            id: 9, difficulty: "Hard",
            question: "The capitalisation of average profit and capitalisation of super profit methods return the same goodwill when:",
            options: ["The inputs are consistent — same average profit, capital employed and NRR", "The years' purchase equals the NRR", "The firm has no reserves", "Average profit equals capital employed"],
            answerIndex: 0,
            explanation: "(Avg ÷ r) − C and (Avg − C×r) ÷ r are algebraically identical — the two routes meet whenever they use the same figures."
          },
          {
            id: 10, difficulty: "Easy",
            question: "Goodwill at three years' purchase of super profit values:",
            options: ["Three years of past excess earnings", "Three years since the firm started", "Three partners in the firm", "Thirty percent of capital"],
            answerIndex: 0,
            explanation: "The multiplier captures past surplus performance — it is not a duration of the firm's life."
          }
        ],

        activity: {
          type: "calc",
          title: "Goodwill Valuation Bench",
          instruction: "Work each valuation the way you would in the exam — enter every figure the bench asks for. The working is revealed only when every figure in the problem is right.",
          problems: [
            {
              prompt: "A trading firm earned profits of ₹1,60,000, ₹1,80,000, ₹2,00,000 and ₹2,20,000 over the last four years. Value the goodwill at three years' purchase by the average profit method.",
              inputs: [
                { key: "avg", label: "Average profit (₹)", placeholder: "e.g. 190000" },
                { key: "gw", label: "Goodwill (₹)", placeholder: "e.g. 570000" }
              ],
              answers: { avg: 190000, gw: 570000 },
              formula: "Avg = total ÷ 4 · Goodwill = Avg × 3",
              working: "Total = 1,60,000 + 1,80,000 + 2,00,000 + 2,20,000 = ₹7,60,000. Average = 7,60,000 ÷ 4 = ₹1,90,000. Goodwill = 1,90,000 × 3 = <b>₹5,70,000</b>."
            },
            {
              prompt: "A firm's average profit is ₹1,50,000. Capital employed is ₹10,00,000 and the normal rate of return in this line of business is 10%. Find normal profit, super profit and goodwill at two years' purchase of super profit.",
              inputs: [
                { key: "np", label: "Normal profit (₹)", placeholder: "e.g. 100000" },
                { key: "sp", label: "Super profit (₹)", placeholder: "e.g. 50000" },
                { key: "gw", label: "Goodwill (₹)", placeholder: "e.g. 100000" }
              ],
              answers: { np: 100000, sp: 50000, gw: 100000 },
              formula: "Normal = Capital × NRR · Super = Avg − Normal · GW = Super × n",
              working: "Normal profit = 10,00,000 × 10% = ₹1,00,000. Super profit = 1,50,000 − 1,00,000 = ₹50,000. Goodwill at two years' purchase = <b>₹1,00,000</b>."
            },
            {
              prompt: "Average profit of a firm is ₹1,80,000, capital employed ₹12,00,000, normal rate of return 12%. Compute goodwill by the capitalisation of average profit method.",
              inputs: [
                { key: "cv", label: "Capitalised value (₹)", placeholder: "e.g. 1500000" },
                { key: "gw", label: "Goodwill (₹)", placeholder: "e.g. 300000" }
              ],
              answers: { cv: 1500000, gw: 300000 },
              formula: "Capitalised value = Avg ÷ NRR · GW = Capitalised − Capital employed",
              working: "Capitalised value = 1,80,000 ÷ 0.12 = ₹15,00,000. Less capital employed ₹12,00,000 → goodwill <b>₹3,00,000</b>."
            },
            {
              prompt: "A firm reports super profit of ₹40,000 and the normal rate of return is 8%. Value the goodwill by the capitalisation of super profit method.",
              inputs: [
                { key: "gw", label: "Goodwill (₹)", placeholder: "e.g. 500000" }
              ],
              answers: { gw: 500000 },
              formula: "GW = Super profit ÷ NRR",
              working: "40,000 ÷ 0.08 = <b>₹5,00,000</b> — the capitalised value of the surplus stream, which is the whole of the goodwill here."
            }
          ]
        },

        examCases: [
          {
            id: 1,
            title: "One firm, three valuations",
            passage: "Meera buys a share of a firm whose accounts show average annual profit of ₹1,50,000. Capital employed in the business is ₹9,00,000 and the normal rate of return for the trade is 10%. The partners agree to value goodwill on three years' purchase of super profit.",
            difficulty: "Hard",
            subs: [
              {
                q: "What is the firm's normal profit?",
                options: ["₹90,000", "₹1,50,000", "₹60,000", "₹45,000"],
                answerIndex: 0,
                reasoning: "9,00,000 × 10% = ₹90,000 — what the capital could earn without any goodwill."
              },
              {
                q: "What is the annual super profit?",
                options: ["₹60,000", "₹1,50,000", "₹90,000", "₹30,000"],
                answerIndex: 0,
                reasoning: "1,50,000 − 90,000 = ₹60,000 — the excess over normal that goodwill represents."
              },
              {
                q: "What goodwill figure do the partners arrive at?",
                options: ["₹1,80,000", "₹4,50,000", "₹60,000", "₹5,40,000"],
                answerIndex: 0,
                reasoning: "Super profit × 3 years' purchase = 60,000 × 3 = ₹1,80,000."
              }
            ]
          }
        ],

        examNumericals: [
          {
            id: 1, q: "Average profit ₹2,40,000; goodwill at three years' purchase of average profit. Find goodwill (₹).",
            value: 720000,
            explanation: "2,40,000 × 3 = ₹7,20,000.",
            difficulty: "Easy"
          },
          {
            id: 2, q: "Average profit ₹1,80,000; capital employed ₹12,00,000; NRR 10%. Find super profit (₹).",
            value: 60000,
            explanation: "Normal profit 1,20,000; 1,80,000 − 1,20,000 = ₹60,000.",
            difficulty: "Medium"
          },
          {
            id: 3, q: "Super profit ₹45,000 valued at four years' purchase. Find goodwill (₹).",
            value: 180000,
            explanation: "45,000 × 4 = ₹1,80,000.",
            difficulty: "Easy"
          },
          {
            id: 4, q: "Super profit ₹50,000; NRR 10%; capitalisation of super profit method. Find goodwill (₹).",
            value: 500000,
            explanation: "50,000 ÷ 0.10 = ₹5,00,000.",
            difficulty: "Medium"
          }
        ],

        quickRevision: {
          definition: "Goodwill is the value of a firm's reputation and earning power beyond its tangible assets — measurable as the capitalised value of the excess earnings a business makes over the normal return on capital employed.",
          keyPoints: [
            "Goodwill is valued at reconstitution — admission, retirement, death, sale or amalgamation — never casually.",
            "Self-generated goodwill is not recorded in the books (AS-26); only purchased goodwill enters the balance sheet.",
            "Goodwill exists only when the firm earns above the normal rate — no excess, no goodwill.",
            "Years' purchase is a given multiplier of past surplus earnings, not a time period of the firm's life."
          ],
          calculationSteps: [
            "Underline what the question names — averaging, super profit or capitalisation — plus the years' purchase and the normal rate of return.",
            "Average profit method: adjust any abnormal item the question flags, average the years given, then Goodwill = Average profit × years' purchase.",
            "Super profit method: Normal profit = Capital employed × NRR ÷ 100; Super profit = Average profit − Normal profit; Goodwill = Super profit × years' purchase.",
            "Capitalisation method: firm value = Average profit ÷ NRR, then Goodwill = firm value − Capital employed — this must agree with the super-profit figure.",
            "Hidden goodwill: value total capital of the reconstituted firm from the new share, subtract the new net assets, and the difference is the goodwill."
          ],
          formulas: [
            { label: "Average profit method", expr: "GW = Average profit × n" },
            { label: "Super profit", expr: "SP = Avg profit − (Capital employed × NRR)" },
            { label: "Super profit method", expr: "GW = Super profit × n" },
            { label: "Capitalisation of super profit", expr: "GW = Super profit ÷ NRR" },
            { label: "Capitalisation of average profit", expr: "GW = (Avg profit ÷ NRR) − Capital employed" }
          ],
          distinctions: [
            {
              title: "Average vs super profit method",
              head: ["Average profit method", "Super profit method"],
              rows: [
                ["What it capitalises", "The whole of average earnings", "Only earnings above normal"],
                ["Needs NRR?", "No", "Yes — normal profit must be computed"],
                ["Sanity check", "Ignores capital size", "Cross-checks with capitalisation methods"]
              ]
            }
          ],
          examPoints: [
            "Capital employed = total assets − long-term liabilities (or capital + long-term reserves).",
            "Both capitalisation routes must return the same goodwill — if they don't, an input is wrong.",
            "Super profit scales with the size of the business; it doubles when capital and profits both double."
          ],
          commonMistakes: [
            "Capitalising average profit when the question asks for super profit — read the method named in the question.",
            "Forgetting to deduct capital employed after capitalising average profit.",
            "Recording self-generated goodwill as an asset in the balance sheet."
          ],
          mnemonic: "ASC — Average, Super, Capitalisation: three doors into the same room."
        }
      },

      /* ---------- Chapter 3: Change in Profit-Sharing Ratio ---------- */
      psr: {
        theory: {
          simple: [
            {
              h: "What Changes, and What Must Be Settled",
              p: "When existing partners decide on a new profit-sharing ratio, the firm is reconstituted — the old agreement ends and a new one begins. Two questions arise immediately: who gave up share, and what happens to everything the firm gained or lost while the old ratio held?",
              list: [
                { term: "Sacrificing ratio", def: "Old ratio − new ratio. The partner giving up a slice of profit for another." },
                { term: "Gaining ratio", def: "New ratio − old ratio. The mirror image — whoever sacrifices, another gains exactly that much." },
                { term: "Revaluation", def: "Restating every asset and liability to current value at the moment of change, so the new ratio starts from fair ground." }
              ]
            },
            {
              h: "The New Profit-Sharing Ratio",
              p: "The revised ratio is either stated outright or computed from what each partner surrenders. A partner may surrender a fraction of their own share — say one-fifth — in which case the surrendered portion goes to the other partners, usually in their existing ratio.",
              formula: "New share = Old share − Surrendered portion (or + received portion)"
            },
            {
              h: "Why Revalue at All?",
              p: "A building bought years ago may now be worth far more; stock may have lost value. Those movements belong to the period the old ratio governed. When the ratio changes, the gaining partner would otherwise inherit years of appreciation they did nothing to earn — so assets and liabilities are revalued and the profit or loss goes to the old partners in the old ratio."
            }
          ],
          advanced: [
            {
              h: "Revaluation Account and Revised Balance Sheet",
              p: "The revaluation account is nominal: debits for falls in asset values and rises in liabilities, credits for rises in assets and falls in liabilities. The balance — profit or loss — transfers to the old partners in the old ratio. The revised balance sheet then shows every item at its new value, with reserves and accumulated profits already distributed."
            },
            {
              h: "Treatment of Reserves and Accumulated Profits",
              p: "General reserve, reserve fund, investments fluctuation fund and credit balances of profit and loss all represent undistributed past profits — shared in the old ratio. Accumulated losses and debit balances are debited to the old partners the same way. Nothing accumulative survives into the new agreement untouch."
            },
            {
              h: "The Cumulative Effect of Goodwill",
              p: "Goodwill arises from past super earnings — a joint product of the old ratio. At a change, the gaining partner compensates the sacrificing partner for their share of the firm's valued goodwill, using the sacrifice-and-gain figures just computed. The compensation is the price of the future share they bought."
            }
          ]
        },

        concepts: [
          { title: "Sacrificing ratio", body: "Old ratio minus new ratio — the proportion in which existing partners give up profit share for one another." },
          { title: "Gaining ratio", body: "New ratio minus old ratio — the proportion in which partners pick up the share someone else surrendered." },
          { title: "Revaluation", body: "Restating assets and liabilities to their current values when the ratio changes, so accumulated gains and losses reach the old partners only." },
          { title: "Revised balance sheet", body: "The balance sheet drawn after reconstitution: revalued assets and liabilities, reserves distributed, new capital structure in place." }
        ],

        formats: [
          {
            title: "Revaluation Account",
            note: "Nominal account. Profit on revaluation goes to old partners in the old ratio; loss the same way.",
            head: ["Particulars", "Amount (₹)", "Particulars", "Amount (₹)"],
            rows: [
              ["To Machinery (decrease)", "15,000", "By Debtors (increase)", "5,000"],
              ["To Creditors (increase)", "4,000", "", ""],
              ["To Profit on revaluation (transferred)", "—", "", ""],
              ["To Loss on revaluation — A (3:2)", "8,400", "", ""],
              ["To Loss on revaluation — B", "5,600", "", ""],
              ["Total", "24,000", "Total", "24,000"]
            ]
          },
          {
            title: "Sacrifice and gain — the working sheet",
            note: "Build this before touching any journal entry in a ratio-change problem.",
            head: ["Partner", "Old share", "New share", "Sacrifice (−) / Gain (+)"],
            rows: [
              ["X", "3/5 (27/45)", "5/9 (25/45)", "Sacrifice 2/45"],
              ["Y", "2/5 (18/45)", "4/9 (20/45)", "Gain 2/45"],
              ["Total", "1", "1", "Zero — every sacrifice is someone's gain"]
            ]
          }
        ],

        numericals: [
          {
            id: 1, difficulty: "Medium",
            question: "A and B share profits 3:2. A surrenders one-fifth of his share to B. A's new share is:",
            options: ["12/25", "2/5", "13/25", "3/10"],
            answerIndex: 0,
            explanation: "A gives away 1/5 of 3/5 = 3/25. A: 3/5 − 3/25 = 15/25 − 3/25 = 12/25 (and B gets 13/25)."
          },
          {
            id: 2, difficulty: "Medium",
            question: "Partners A and B move from 3:2 to 1:1. The sacrificing ratio is:",
            options: ["A 1/10, B gains 1/10", "Both sacrifice", "Both gain", "A gains 1/10"],
            answerIndex: 0,
            explanation: "A: 3/5 − 1/2 = 6/10 − 5/10 = 1/10 sacrificed. B: 2/5 − 1/2 = −1/10 — a gain of 1/10."
          },
          {
            id: 3, difficulty: "Easy",
            question: "Firm's goodwill is valued at ₹2,00,000 when partners revise from 2:1 to 1:1. The gaining partner must compensate the sacrificing partner with:",
            options: ["₹20,000", "₹1,00,000", "₹66,667", "₹50,000"],
            answerIndex: 0,
            explanation: "Sacrifice/gain is 1/10 for this change; 2,00,000 × 1/10 = ₹20,000."
          },
          {
            id: 4, difficulty: "Easy",
            question: "Revaluation shows a profit of ₹18,000 and old ratio is 3:2. Each partner's share of revaluation profit is:",
            options: ["A ₹10,800, B ₹7,200", "A ₹9,000, B ₹9,000", "A ₹12,000, B ₹6,000", "Shared in the new ratio"],
            answerIndex: 0,
            explanation: "Revaluation profit always goes to the OLD ratio: 18,000 × 3/5 = 10,800 and 18,000 × 2/5 = 7,200."
          },
          {
            id: 5, difficulty: "Medium",
            question: "A General Reserve of ₹90,000 exists when the ratio changes from 3:2 to 5:4. The correct treatment is:",
            options: ["Credited to old partners in 3:2", "Credited in the new ratio 5:4", "Transferred to revaluation account", "Left untouched until retirement"],
            answerIndex: 0,
            explanation: "Reserves are accumulated profits of the old agreement — they belong to the old ratio, period."
          },
          {
            id: 6, difficulty: "Medium",
            question: "Which item is NOT revalued at a change in profit-sharing ratio?",
            options: ["Cash at bank", "Building whose market value has risen", "A liability understated in the books", "Stock that has lost value in the market"],
            answerIndex: 0,
            explanation: "Cash is cash — its book value equals its real value. Everything whose real value can differ from book value is revalued."
          },
          {
            id: 7, difficulty: "Hard",
            question: "X and Y move from 3:2 to 5:4. Firm goodwill ₹4,50,000. The compensation X receives is:",
            options: ["₹20,000", "₹25,000", "₹45,000", "₹15,000"],
            answerIndex: 0,
            explanation: "X sacrifices 27/45 − 25/45 = 2/45; 4,50,000 × 2/45 = ₹20,000, paid by Y who gains the same 2/45."
          },
          {
            id: 8, difficulty: "Easy",
            question: "At a change in ratio, the sum of all partners' sacrifices and gains is:",
            options: ["Always zero", "Equal to the revaluation profit", "Equal to the firm's goodwill", "Always positive"],
            answerIndex: 0,
            explanation: "The ratio must still add to one — one partner's surrendered slice is necessarily another's pickup."
          },
          {
            id: 9, difficulty: "Medium",
            question: "Accumulated losses (debit balance of P&L) at a ratio change are:",
            options: ["Debited to old partners in the old ratio", "Carried forward to the new agreement", "Written off against revaluation", "Transferred to the reserve"],
            answerIndex: 0,
            explanation: "Accumulated losses are past losses of the old agreement — borne by the old partners in the old ratio, exactly like accumulated profits."
          },
          {
            id: 10, difficulty: "Hard",
            question: "A partner surrenders 1/4 of their 2/3 share to the other partner. The new ratio of the two partners is:",
            options: ["1:1", "5:1", "2:1", "3:2"],
            answerIndex: 0,
            explanation: "Surrender = 1/4 × 2/3 = 1/6. First partner: 2/3 − 1/6 = 4/6 − 1/6 = 3/6. Second partner: 1/3 + 1/6 = 2/6 + 1/6 = 3/6. The new ratio is 3:3 = 1:1."
          }
        ],

        activity: {
          type: "calc",
          title: "Sacrifice or Gain Bench",
          instruction: "Every problem here is a ratio-change worked the way the board expects: new ratio, sacrifice or gain, and the rupee compensation. Enter each figure; the bench checks them all before revealing the working.",
          problems: [
            {
              prompt: "A and B share profits 3:2. A surrenders one-fifth of his share to B. Find the new shares of A and B, expressed with denominator 25.",
              inputs: [
                { key: "an", label: "A's new share (numerator / 25)", placeholder: "e.g. 12" },
                { key: "bn", label: "B's new share (numerator / 25)", placeholder: "e.g. 13" }
              ],
              answers: { an: 12, bn: 13 },
              formula: "Surrender = 1/5 × 3/5 = 3/25",
              working: "A gives away 3/25: A = 15/25 − 3/25 = <b>12/25</b>. B receives it: 10/25 + 3/25 = <b>13/25</b>. Check: 12 + 13 = 25 ✓."
            },
            {
              prompt: "The firm's goodwill is valued at ₹2,00,000. Partners move from 2:1 to 1:1. Find the sacrifice of the first partner (fraction numerator over 10) and the compensation in rupees.",
              inputs: [
                { key: "sf", label: "Sacrifice (numerator / 10)", placeholder: "e.g. 1" },
                { key: "comp", label: "Compensation paid (₹)", placeholder: "e.g. 20000" }
              ],
              answers: { sf: 1, comp: 20000 },
              formula: "Sacrifice = old − new · Compensation = Goodwill × sacrifice",
              working: "A: 2/3 − 1/2 = 4/6 − 3/6 = <b>1/10</b> sacrificed; B gains 1/10. Compensation = 2,00,000 × 1/10 = <b>₹20,000</b>, paid by B to A."
            },
            {
              prompt: "At the change, a building worth ₹80,000 in the books is revalued to ₹95,000, a liability of ₹40,000 is now ₹46,000, and machinery of ₹2,50,000 is revalued to ₹2,32,000. Old ratio 3:2. Find the revaluation result and A's share of it.",
              inputs: [
                { key: "loss", label: "Revaluation loss (₹)", placeholder: "e.g. 9000" },
                { key: "ashare", label: "A's share of the loss (₹)", placeholder: "e.g. 5400" }
              ],
              answers: { loss: 9000, ashare: 5400 },
              formula: "Profit = rises − falls",
              working: "Rises +15,000; falls 6,000 + 18,000 = 24,000 → revaluation <b>loss ₹9,000</b>, shared in the old ratio: A 9,000 × 3/5 = <b>₹5,400</b>."
            },
            {
              prompt: "X and Y move from 3:2 to 5:4. The firm's goodwill is ₹4,50,000 and General Reserve is ₹90,000. Find X's sacrifice fraction (numerator over 45), the compensation X receives, and the reserve credited to X.",
              inputs: [
                { key: "sf", label: "X's sacrifice (numerator / 45)", placeholder: "e.g. 2" },
                { key: "comp", label: "Compensation to X (₹)", placeholder: "e.g. 20000" },
                { key: "res", label: "Reserve credited to X (₹)", placeholder: "e.g. 54000" }
              ],
              answers: { sf: 2, comp: 20000, res: 54000 },
              formula: "Sacrifice = old − new · Reserve share = old ratio",
              working: "X: 3/5 − 5/9 = 27/45 − 25/45 = <b>2/45</b> sacrificed. Compensation = 4,50,000 × 2/45 = <b>₹20,000</b> from Y. Reserve 90,000 in old ratio: X gets 90,000 × 3/5 = <b>₹54,000</b>."
            }
          ]
        },

        examCases: [
          {
            id: 1,
            title: "Two friends redraw the map",
            passage: "X and Y have shared profits 3:2. They now agree to share future profits 5:4. The firm's goodwill is valued at ₹4,50,000 for the purpose. The firm holds a General Reserve of ₹90,000. At revaluation, a building rises from ₹5,00,000 to ₹5,60,000, stock falls from ₹2,00,000 to ₹1,75,000, and creditors rise from ₹1,20,000 to ₹1,35,000.",
            difficulty: "Hard",
            subs: [
              {
                q: "In what proportion does Y gain from the change?",
                options: ["2/45", "3/45", "1/9", "1/5"],
                answerIndex: 0,
                reasoning: "Y: new 4/9 − old 2/5 = 20/45 − 18/45 = 2/45 — exactly X's sacrifice."
              },
              {
                q: "What compensation does Y pay X for goodwill?",
                options: ["₹20,000", "₹22,500", "₹30,000", "₹18,000"],
                answerIndex: 0,
                reasoning: "4,50,000 × 2/45 = ₹20,000."
              },
              {
                q: "What is the profit or loss on revaluation?",
                options: ["Profit ₹20,000", "Loss ₹20,000", "Profit ₹10,000", "Nil"],
                answerIndex: 0,
                reasoning: "+60,000 building − 25,000 stock − 15,000 creditors = ₹20,000 profit, shared 3:2 in the old ratio."
              },
              {
                q: "How much of the General Reserve is credited to Y?",
                options: ["₹36,000", "₹40,000", "₹54,000", "₹45,000"],
                answerIndex: 0,
                reasoning: "Reserves belong to the old agreement: 90,000 × 2/5 = ₹36,000 to Y."
              }
            ]
          }
        ],

        examNumericals: [
          {
            id: 1, q: "A and B share 3:2; A surrenders 1/5 of his share to B. B's new share, as a numerator over 25, is —",
            value: 13,
            explanation: "A gives 3/25; B: 10/25 + 3/25 = 13/25.",
            difficulty: "Medium"
          },
          {
            id: 2, q: "Goodwill ₹2,00,000; ratio changes from 2:1 to 1:1. Compensation paid by the gaining partner (₹) —",
            value: 20000,
            explanation: "Sacrifice/gain 1/10; 2,00,000 × 1/10 = ₹20,000.",
            difficulty: "Medium"
          }
        ],

        quickRevision: {
          definition: "A change in profit-sharing ratio reconstitutes the firm: the old agreement ends, a new one begins — and every accumulated gain, loss and reserve must be settled in the old ratio before the new one takes effect.",
          keyPoints: [
            "Sacrificing ratio = old − new; gaining ratio = new − old. They mirror each other exactly — the total is always zero.",
            "Revaluation profit or loss and every reserve go to the OLD partners in the OLD ratio.",
            "Gaining partners compensate sacrificing partners for their share of the firm's goodwill.",
            "The revised balance sheet shows revalued figures, no distributed reserves, and the new capital structure."
          ],
          calculationSteps: [
            "Step 1 — Write old and new shares with a common denominator; compute sacrifice/gain per partner.",
            "Step 2 — Revalue: debit falls in assets and rises in liabilities; credit rises and falls. Transfer the balance in the old ratio.",
            "Step 3 — Distribute reserves and accumulated profits/losses in the old ratio.",
            "Step 4 — Compute goodwill compensation: firm goodwill × each sacrificing partner's sacrifice.",
            "Step 5 — Draw the revised balance sheet at the new values."
          ],
          formulas: [
            { label: "Sacrificing ratio", expr: "Old ratio − New ratio" },
            { label: "Gaining ratio", expr: "New ratio − Old ratio" },
            { label: "New share on surrender", expr: "Old share − (Surrender fraction × Old share)" },
            { label: "Compensation", expr: "Firm goodwill × Sacrificing partner's sacrifice" }
          ],
          examPoints: [
            "Revaluation profit always uses the old ratio — a one-mark question on this appears in nearly every paper.",
            "Reserves and accumulated balances are distributed at reconstitution, never carried silently into the new ratio.",
            "Check: all sacrifices + all gains must total zero before any rupee moves."
          ],
          commonMistakes: [
            "Sharing revaluation profit in the new ratio because the question mentions the change first.",
            "Compensating goodwill in the old ratio instead of the sacrificing ratio.",
            "Forgetting that a surrendered fraction applies to the partner's own share, not to the whole profit."
          ],
          mnemonic: "Old ratio settles the past (reserves, revaluation); sacrifice and gain price the future (goodwill)."
        }
      }
    },

    /* ================= MIND MAPS ================= */
    mindmaps: {
      pf: {
        center: "Partnership\nFundamentals",
        branches: [
          {
            label: "The Framework",
            color: "var(--c-pf)",
            children: ["Two or more persons, mutual agency", "Profit sharing is the defining purpose", "Deed or the Indian Partnership Act, 1932", "Fixed vs fluctuating capital (deed decides)"]
          },
          {
            label: "Appropriation Account",
            color: "var(--c-gw)",
            children: ["Opens with net profit b/d", "Debit: interest on capital, salary, reserve transfers", "Credit: interest on drawings", "Closes with divisible profit in PSR"]
          },
          {
            label: "Charge vs Appropriation",
            color: "var(--c-psr)",
            children: ["Charge: payable even in a loss", "Partner's loan interest = charge (6% default)", "Appropriation: only from profit", "Deed can convert an appropriation into a charge"]
          },
          {
            label: "Insufficient Profit",
            color: "var(--c-adm)",
            children: ["Full demand exceeds available profit", "Pay proportionately: claim × (available ÷ total)", "One common factor scales every item", "Never full, never zero"]
          },
          {
            label: "Guarantee of Profit",
            color: "var(--c-ret)",
            children: ["Minimum fixed by firm, one partner, or the rest", "Compute shares first, test minimum second", "Deficiency met by the guaranteeing party", "Residue shared by the remaining partners"]
          },
          {
            label: "Past Adjustments",
            color: "var(--c-dis)",
            children: ["One correction entry fixes old mistakes", "Adjustment = correct share − received", "Passed through capital accounts", "All corrections sum to zero"]
          }
        ]
      },
      gw: {
        center: "Goodwill —\nNature & Valuation",
        branches: [
          {
            label: "Nature",
            color: "var(--c-gw)",
            children: ["Value beyond tangible assets", "Built by location, quality, management, loyalty", "Measured only at reconstitution", "AS-26: only purchased goodwill is recorded"]
          },
          {
            label: "Average Profit Method",
            color: "var(--c-pf)",
            children: ["GW = Average annual profit × n", "Needs the year's profit list", "Simplest method", "Ignores capital size"]
          },
          {
            label: "Super Profit Method",
            color: "var(--c-psr)",
            children: ["Normal profit = Capital employed × NRR", "SP = Average − Normal", "GW = SP × n", "Goodwill exists only when SP > 0"]
          },
          {
            label: "Capitalisation Methods",
            color: "var(--c-adm)",
            children: ["Of super profit: SP ÷ NRR", "Of average profit: (Avg ÷ NRR) − Capital", "Both agree on the same figure", "The built-in exam check"]
          },
          {
            label: "Key Inputs",
            color: "var(--c-cfin)",
            children: ["Capital employed = assets − long-term liabilities", "NRR given in the question", "Years' purchase is a multiplier, not time", "Consistency across methods"]
          }
        ]
      },
      psr: {
        center: "Change in\nProfit-Sharing Ratio",
        branches: [
          {
            label: "The Two Ratios",
            color: "var(--c-psr)",
            children: ["Sacrifice = old − new", "Gain = new − old", "Mirror images — total always zero", "Common denominator makes both visible"]
          },
          {
            label: "New Ratio Computation",
            color: "var(--c-pf)",
            children: ["Surrendered fraction × own share", "Goes to the others in their ratio", "Recompute both partners", "Check: shares sum to one"]
          },
          {
            label: "Revaluation",
            color: "var(--c-adm)",
            children: ["Assets and liabilities to current values", "Profit/loss to OLD partners, OLD ratio", "Cash needs no revaluation", "Feeds the revised balance sheet"]
          },
          {
            label: "Reserves & Accumulations",
            color: "var(--c-ret)",
            children: ["General reserve, P&L credits → old partners", "Accumulated losses → debited in old ratio", "Nothing survives into the new agreement", "Settled at reconstitution, not later"]
          },
          {
            label: "Goodwill Compensation",
            color: "var(--c-gw)",
            children: ["Firm goodwill × sacrifice", "Gaining partner pays the sacrifice", "AS-26 — no goodwill asset created", "Prices the future share bought"]
          }
        ]
      }
    },

    /* ================= IMPORTANT QUESTIONS ================= */
    importantQuestions: {
      pf: [
        { type: "Short Answer", marks: 3, q: "Distinguish between a charge against profit and an appropriation of profit, with one example of each.",
          answer: "A charge against profit is an expense the firm must bear whether or not there is profit — example: interest on a partner's loan to the firm. An appropriation of profit is a division of the year's profit and can be made only when profit exists — examples: interest on capital, a partner's salary or commission, transfer to reserve. In a loss year charges are still payable; appropriations are not." },
        { type: "Short Answer", marks: 3, q: "Net profit ₹20,000. The deed provides interest on capital ₹6,000 (A) and ₹4,000 (B) and a salary of ₹8,000 to A. Show how the appropriations are made.",
          answer: "Total appropriations demanded = 6,000 + 4,000 + 8,000 = ₹18,000 against ₹20,000 available… profit exceeds demand, so pay in full: A receives 6,000 interest + 8,000 salary + 2/5 of the remaining 20,000 − 18,000 = ₹2,000 → ₹4,000 share; B receives 4,000 + 1/5 × 2,000 = ₹1,000. (Had profit been ₹9,000, the factor would be 9,000 ÷ 18,000 = 0.5 and every item halved.)" },
        { type: "Short Answer", marks: 3, q: "What is a guarantee of profit to a partner? Who bears the deficiency when the firm guarantees the minimum?",
          answer: "A guarantee of profit assures a partner a minimum amount of profit for the year. If the partner's computed share falls short of the minimum, the shortfall — the deficiency — is met by whoever gave the guarantee: by the firm (usually by reducing the other partners' shares in their profit-sharing ratio) or by one named partner from their own share." },
        { type: "Short Answer", marks: 3, q: "State the default rules the Indian Partnership Act, 1932 applies when the partnership deed is silent on interest on a partner's loan.",
          answer: "A partner is entitled to interest on the loan advanced to the firm at 6% per annum, calculated from the date the loan was taken. This interest is a charge against profit — payable even when the firm incurs a loss. No interest is payable on a partner's capital or drawings by default." },
        { type: "Long Answer", marks: 6, q: "Explain fixed and fluctuating capital accounts. If a partner's capital is ₹1,00,000, salary ₹12,000, drawings ₹10,000 and share of profit ₹60,000, show the capital account under both methods.",
          answer: "Fixed method: the capital account changes only on introduction or withdrawal of capital — it shows ₹1,00,000 throughout the year; salary, drawings, interest and profit share go to a separate current account (here: credit 12,000 + 60,000, debit 10,000 → closing current account ₹62,000). Fluctuating method: one account per partner carries everything — opening 1,00,000 + salary 12,000 + profit 60,000 − drawings 10,000 = closing capital ₹1,62,000. The fluctuating method is the default when the deed is silent." },
        { type: "Long Answer", marks: 6, q: "Net profit ₹90,000; P and Q share 2:1; Q is guaranteed ₹40,000 by P. Prepare the appropriation account and show the final distribution.",
          answer: "No other appropriations. Q's share = 90,000 × 1/3 = ₹30,000 — short of the guaranteed ₹40,000 by ₹10,000. P bears the deficiency alone: P's share 60,000 − 10,000 = ₹50,000. Distribution: P ₹50,000, Q ₹40,000; total ₹90,000 ✓." },
        { type: "Short Answer", marks: 3, q: "Explain the concept of a past adjustment with a suitable illustration.",
          answer: "A past adjustment corrects a division of profit that was already completed but was computed on wrong facts — an appropriation omitted, or charged to the wrong partner. For each partner, compute (correct entitlement − amount already credited); one journal entry through the capital accounts fixes the past. Illustration: if ₹6,000 salary to A was omitted, A is credited ₹6,000 and the partner(s) who received that profit are debited in the profit-sharing ratio." }
      ],
      gw: [
        { type: "Short Answer", marks: 3, q: "What is goodwill? State any four factors affecting the goodwill of a firm.",
          answer: "Goodwill is the value of a firm's reputation and earning power beyond its measurable tangible assets — the capacity to earn more than the normal return on capital employed. Factors: favourable location, quality of products and services, efficient and experienced management, a loyal customer base, and a record of above-normal returns." },
        { type: "Short Answer", marks: 3, q: "Average profit ₹1,80,000, capital employed ₹12,00,000, NRR 10%. Compute goodwill by the super profit method at three years' purchase.",
          answer: "Normal profit = 12,00,000 × 10% = ₹1,20,000. Super profit = 1,80,000 − 1,20,000 = ₹60,000. Goodwill = 60,000 × 3 = ₹1,80,000." },
        { type: "Short Answer", marks: 3, q: "How is goodwill valued under the capitalisation of average profit method?",
          answer: "Capitalise the average profit at the normal rate: capitalised value = average profit ÷ NRR. Subtract the capital actually employed; the balance is goodwill. With average profit ₹1,80,000, NRR 12% and capital employed ₹12,00,000: 1,80,000 ÷ 0.12 = ₹15,00,000 − 12,00,000 = ₹3,00,000." },
        { type: "Short Answer", marks: 3, q: "Why is self-generated goodwill not recorded in the books of a firm?",
          answer: "Under AS-26, only goodwill purchased from outside for consideration can be recognised as an intangible asset. Internally generated goodwill has no separately identifiable cost of acquisition, so it is not recorded — it is nevertheless valued when a partnership is reconstituted, to settle the outgoing or incoming partner's share in cash or capital adjustment." },
        { type: "Long Answer", marks: 6, q: "Average profits of the last four years: ₹1,60,000, ₹1,80,000, ₹2,00,000, ₹2,20,000. Capital employed ₹10,00,000; NRR 10%. Value goodwill (a) at three years' purchase of average profit and (b) at three years' purchase of super profit.",
          answer: "(a) Average = 7,60,000 ÷ 4 = ₹1,90,000; goodwill = 1,90,000 × 3 = ₹5,70,000. (b) Normal profit = 10,00,000 × 10% = ₹1,00,000; super profit = 1,90,000 − 1,00,000 = ₹90,000; goodwill = 90,000 × 3 = ₹2,70,000. The average-profit figure is higher because it capitalises all earnings, while the super-profit figure capitalises only the excess over normal." },
        { type: "Short Answer", marks: 3, q: "Explain the term 'years of purchase' in goodwill valuation.",
          answer: "Years of purchase is the multiplier applied to a year's profit or super profit to convert it into a goodwill price — it expresses how many years of past surplus performance the buyer is paying for. At three years' purchase of super profit, three years of excess earnings are capitalised into the valuation." },
        { type: "Long Answer", marks: 6, q: "Average profit ₹2,40,000, capital employed ₹16,00,000, NRR 12%. Compute goodwill by both capitalisation methods and comment on the result.",
          answer: "Capitalisation of super profit: normal profit = 16,00,000 × 12% = ₹1,92,000; super profit = 2,40,000 − 1,92,000 = ₹48,000; goodwill = 48,000 ÷ 0.12 = ₹4,00,000. Capitalisation of average profit: 2,40,000 ÷ 0.12 = ₹20,00,000; less capital employed ₹16,00,000 = ₹4,00,000. Both methods agree — the algebra is identical when the inputs are consistent, and the agreement validates the computation." }
      ],
      psr: [
        { type: "Short Answer", marks: 3, q: "Define sacrificing ratio and gaining ratio. How are they computed?",
          answer: "Sacrificing ratio = old profit-sharing ratio − new profit-sharing ratio, computed partner-wise; it shows who gives up share. Gaining ratio = new ratio − old ratio; it shows who picks up the surrendered share. The two are mirror images — the sacrifices of some partners exactly equal the gains of the others." },
        { type: "Short Answer", marks: 3, q: "Why are assets and liabilities revalued when the profit-sharing ratio changes, even though the firm continues?",
          answer: "Assets and liabilities may have moved far from book values during the old agreement. Without revaluation, the gaining partner would inherit a share of past appreciation (or be spared past depreciation) they did not earn under the old ratio. Revaluation settles that history: the profit or loss is shared by the old partners in the old ratio, so the new ratio begins from current values." },
        { type: "Short Answer", marks: 3, q: "X and Y move from 3:2 to 1:1. Firm goodwill ₹2,50,000. Compute the compensation.",
          answer: "X: 3/5 − 1/2 = 1/10 sacrificed; Y: 1/10 gained. Compensation = 2,50,000 × 1/10 = ₹25,000, paid by Y to X." },
        { type: "Long Answer", marks: 6, q: "Partners A, B and C share 3:2:1 and revise to 5:3:2. Goodwill ₹6,00,000; General Reserve ₹1,20,000; building revalued from ₹4,00,000 to ₹4,40,000. Explain the settlement steps.",
          answer: "Step 1 — sacrifice/gain: A 3/6 − 5/10 = 0; B 2/6 − 3/10 = 1/30 sacrificed; C 1/6 − 2/10 = −1/30 gained. Step 2 — goodwill compensation: C pays B 6,00,000 × 1/30 = ₹20,000. Step 3 — revaluation profit ₹40,000 to A:B:C as 3:2:1 → 20,000 / 13,333 / 6,667. Step 4 — General Reserve in old ratio 3:2:1 → 60,000 / 40,000 / 20,000. Every item is settled before the new ratio governs anything." },
        { type: "Short Answer", marks: 3, q: "What is a revised balance sheet, and how does it differ from the last balance sheet before the change?",
          answer: "A revised balance sheet is drawn immediately after reconstitution: assets and liabilities appear at revalued figures, reserves and accumulated profits/losses no longer appear (they were distributed to the old partners), partners' capitals reflect compensation and adjustments, and any goodwill adjustment is already settled in cash or capital." },
        { type: "Long Answer", marks: 6, q: "A and B move from 2:1 to 3:2. Goodwill ₹90,000; stock revalued 1,50,000 → 1,35,000; a claim understated by ₹12,000 is now provided. Pass the journal entries.",
          answer: "Sacrifice/gain: A 2/3 − 3/5 = 10/15 − 9/15 = 1/15 sacrificed; B gains 1/15. Goodwill: B pays A 90,000 × 1/15 = ₹6,000 — entry: B's Capital A/c Dr 6,000 to A's Capital A/c 6,000. Revaluation loss = 15,000 + 12,000 = ₹27,000 — A Dr 18,000, B Dr 9,000 to Revaluation A/c 27,000 (old ratio 2:1). Revaluation account closed with a loss debit." },
        { type: "Short Answer", marks: 3, q: "How are accumulated profits and losses treated at a change in profit-sharing ratio?",
          answer: "They belong to the old agreement and are distributed to the old partners in the old ratio: general reserve, reserve fund and profit-and-loss credit balances are credited to their capital/current accounts; accumulated losses and debit balances are debited. Nothing accumulative is carried into the new ratio." }
      ]
    },

    /* ================= QUIZ (ids 70001–70030) ================= */
    quiz: [
      { id: 70001, chapter: "pf", difficulty: "Easy",
        q: "The Profit and Loss Appropriation Account starts with:",
        options: ["Net profit brought down", "Gross profit brought down", "Capital balances", "Cash at bank"],
        answerIndex: 0,
        explanation: "Appropriation divides the net profit already computed in the Profit and Loss Account." },
      { id: 70002, chapter: "pf", difficulty: "Easy",
        q: "Interest on a partner's loan to the firm is:",
        options: ["A charge against profit", "An appropriation of profit", "A transfer to reserve", "Not payable"],
        answerIndex: 0,
        explanation: "The partner is a creditor for the loan — interest is a charge, payable even in a loss year (6% default under the Act)." },
      { id: 70003, chapter: "pf", difficulty: "Medium",
        q: "Net profit ₹8,000; appropriations demanded: IOC ₹6,000 (A) and ₹4,000 (B). A's interest is credited with:",
        options: ["₹3,000", "₹6,000", "₹4,000", "₹4,800"],
        answerIndex: 3,
        explanation: "Pro-rata factor = 8,000 ÷ 10,000 = 0.8. A's interest = 6,000 × 0.8 = ₹4,800; B receives ₹3,200 the same way." },
      { id: 70004, chapter: "pf", difficulty: "Easy",
        q: "Default capital method when the deed is silent:",
        options: ["Fluctuating", "Fixed", "Revaluation", "Current"],
        answerIndex: 0,
        explanation: "One merged capital account per partner, carrying every adjustment of the year." },
      { id: 70005, chapter: "pf", difficulty: "Medium",
        q: "A transfer of profit to General Reserve:",
        options: ["Reduces divisible profit, not net profit", "Reduces net profit", "Increases assets", "Is a charge against profit"],
        answerIndex: 0,
        explanation: "It is an appropriation — made from profit after it is earned." },
      { id: 70006, chapter: "pf", difficulty: "Easy",
        q: "Interest on drawings is shown on the credit side of the appropriation account because it:",
        options: ["Increases profit available to share", "Reduces the partner's drawings", "Is an expense of the firm", "Is a charge against profit"],
        answerIndex: 0,
        explanation: "It is income for the firm — added to the profit before division." },
      { id: 70007, chapter: "pf", difficulty: "Hard",
        q: "A firm guarantees partner Q a minimum of ₹40,000; the year's profit is ₹90,000 and the ratio is 2:1 (P:Q). P finally receives:",
        options: ["₹50,000", "₹55,000", "₹60,000", "₹45,000"],
        answerIndex: 0,
        explanation: "Q's share ₹30,000 falls short by ₹10,000, borne by P: 60,000 − 10,000 = ₹50,000." },
      { id: 70008, chapter: "pf", difficulty: "Easy",
        q: "Mutual agency in a partnership means:",
        options: ["Each partner can bind the firm by acts in the ordinary course of business", "Partners cannot act for each other", "Only the manager can bind the firm", "The firm must register every act"],
        answerIndex: 0,
        explanation: "Every partner is an agent of the others — that is what makes a partnership a single business unit." },
      { id: 70009, chapter: "pf", difficulty: "Medium",
        q: "Which of the following is an appropriation of profit?",
        options: ["Partner's salary", "Rent paid for the godown", "Interest on a partner's loan", "Depreciation on machinery"],
        answerIndex: 0,
        explanation: "Salary to a partner divides profit; the others are business expenses (charges)." },
      { id: 70010, chapter: "pf", difficulty: "Medium",
        q: "In a past adjustment, a positive correction figure for a partner means:",
        options: ["They were under-credited and are now paid the difference", "They were over-credited and now refund", "Their capital has grown", "The firm owes them interest"],
        answerIndex: 0,
        explanation: "Correction = correct share − already received; positive means too little was credited before." },

      { id: 70011, chapter: "gw", difficulty: "Easy",
        q: "Goodwill is valued when:",
        options: ["The partnership is reconstituted", "Every accounting year ends", "The firm buys machinery", "A partner lends money"],
        answerIndex: 0,
        explanation: "Admission, retirement, death, sale or amalgamation — the events that change who owns the profit stream." },
      { id: 70012, chapter: "gw", difficulty: "Medium",
        q: "Average profit ₹1,50,000, capital employed ₹10,00,000, NRR 10%. Super profit is:",
        options: ["₹50,000", "₹1,00,000", "₹1,50,000", "₹10,000"],
        answerIndex: 0,
        explanation: "Normal profit = 1,00,000; super = 1,50,000 − 1,00,000 = ₹50,000." },
      { id: 70013, chapter: "gw", difficulty: "Easy",
        q: "Super profit × n years' purchase gives goodwill by the:",
        options: ["Super profit method", "Average profit method", "Capitalisation method", "Balance sheet method"],
        answerIndex: 0,
        explanation: "The multiplier is applied to the excess-over-normal earnings only." },
      { id: 70014, chapter: "gw", difficulty: "Hard",
        q: "Capitalised value of super profit = ₹5,00,000 at NRR 10%. The super profit is:",
        options: ["₹50,000", "₹5,00,000", "₹1,00,000", "₹25,000"],
        answerIndex: 0,
        explanation: "Super profit = capitalised value × NRR = 5,00,000 × 0.10 = ₹50,000." },
      { id: 70015, chapter: "gw", difficulty: "Medium",
        q: "Under AS-26, which goodwill is recorded in the books?",
        options: ["Only purchased goodwill", "Only self-generated goodwill", "Both", "Neither"],
        answerIndex: 0,
        explanation: "Purchased goodwill has an identifiable cost of acquisition; internally generated goodwill is not recognised." },
      { id: 70016, chapter: "gw", difficulty: "Easy",
        q: "Capital employed is best computed as:",
        options: ["Total assets less long-term liabilities", "Cash at bank only", "Sales minus expenses", "Capital × NRR"],
        answerIndex: 0,
        explanation: "The long-term funds actually invested in the business." },
      { id: 70017, chapter: "gw", difficulty: "Medium",
        q: "A firm earning exactly the normal rate of return has goodwill of:",
        options: ["Zero", "One year's profit", "Its capital employed", "An indeterminate amount"],
        answerIndex: 0,
        explanation: "No excess earnings means nothing for a buyer to pay for — super profit is nil." },
      { id: 70018, chapter: "gw", difficulty: "Hard",
        q: "Average profit ₹2,00,000, NRR 8%, capital employed ₹20,00,000. Goodwill (capitalisation of average profit) is:",
        options: ["₹5,00,000", "₹2,00,000", "₹25,00,000", "₹16,00,000"],
        answerIndex: 0,
        explanation: "2,00,000 ÷ 0.08 = 25,00,000; less capital 20,00,000 → ₹5,00,000." },
      { id: 70019, chapter: "gw", difficulty: "Easy",
        q: "Which is NOT a factor affecting goodwill?",
        options: ["The firm's bank overdraft", "Favourable location", "Product quality", "Loyal customers"],
        answerIndex: 0,
        explanation: "Goodwill factors are all drivers of above-normal earning power; an overdraft is financing, not reputation." },
      { id: 70020, chapter: "gw", difficulty: "Medium",
        q: "Both capitalisation methods return the same goodwill when:",
        options: ["The inputs are consistent", "NRR is 10%", "The firm is new", "Goodwill is purchased"],
        answerIndex: 0,
        explanation: "The two formulas are algebraically identical — agreement is a built-in check." },

      { id: 70021, chapter: "psr", difficulty: "Easy",
        q: "Sacrificing ratio is computed as:",
        options: ["Old ratio − new ratio", "New ratio − old ratio", "Old + new", "Old ÷ new"],
        answerIndex: 0,
        explanation: "The fall in a partner's share is their sacrifice." },
      { id: 70022, chapter: "psr", difficulty: "Easy",
        q: "Gaining ratio is computed as:",
        options: ["New ratio − old ratio", "Old ratio − new ratio", "Revaluation profit ÷ capital", "Goodwill ÷ years"],
        answerIndex: 0,
        explanation: "The rise in a partner's share is their gain — mirroring someone else's sacrifice." },
      { id: 70023, chapter: "psr", difficulty: "Medium",
        q: "A and B move from 2:1 to 1:1. A sacrifices:",
        options: ["1/10", "1/5", "1/15", "1/30"],
        answerIndex: 0,
        explanation: "2/3 − 1/2 = 4/6 − 3/6 = 1/10; B gains 1/10." },
      { id: 70024, chapter: "psr", difficulty: "Medium",
        q: "Revaluation profit at a ratio change is shared:",
        options: ["In the old ratio", "In the new ratio", "Equally", "To the gaining partner"],
        answerIndex: 0,
        explanation: "The gain accrued under the old agreement — it belongs to the old ratio." },
      { id: 70025, chapter: "psr", difficulty: "Easy",
        q: "General Reserve at reconstitution is distributed:",
        options: ["In the old ratio to old partners", "In the new ratio", "To the gaining partner only", "Carried forward silently"],
        answerIndex: 0,
        explanation: "It is an accumulated profit of the old agreement." },
      { id: 70026, chapter: "psr", difficulty: "Hard",
        q: "X and Y move from 3:2 to 5:4; goodwill ₹4,50,000. Compensation paid to X:",
        options: ["₹20,000", "₹25,000", "₹45,000", "₹15,000"],
        answerIndex: 0,
        explanation: "X sacrifices 2/45; 4,50,000 × 2/45 = ₹20,000, paid by Y." },
      { id: 70027, chapter: "psr", difficulty: "Medium",
        q: "Which item needs NO revaluation at a ratio change?",
        options: ["Cash at bank", "Building", "Undervalued stock", "Understated liability"],
        answerIndex: 0,
        explanation: "Cash book value equals real value — nothing to restate." },
      { id: 70028, chapter: "psr", difficulty: "Medium",
        q: "A surrenders 1/5 of his 3/5 share to B. A's new share is:",
        options: ["12/25", "2/5", "13/25", "3/5"],
        answerIndex: 0,
        explanation: "Surrender 3/25; A: 15/25 − 3/25 = 12/25, B rises to 13/25." },
      { id: 70029, chapter: "psr", difficulty: "Easy",
        q: "A change in profit-sharing ratio between existing partners is called:",
        options: ["Reconstitution of the partnership", "Dissolution of the firm", "Amalgamation", "Conversion into a company"],
        answerIndex: 0,
        explanation: "The firm continues under a new agreement — the old one ends." },
      { id: 70030, chapter: "psr", difficulty: "Hard",
        q: "Accumulated loss (debit P&L balance) at reconstitution is:",
        options: ["Debited to old partners in the old ratio", "Shared in the new ratio", "Sent to revaluation", "Ignored"],
        answerIndex: 0,
        explanation: "Past losses belong to the old agreement, exactly like past profits." }
    ],

    /* ================= FLASHCARDS (ids 71001–71024) ================= */
    flashcards: [
      { id: 71001, chapter: "pf", front: "Define partnership (Indian Partnership Act, 1932).", back: "A relationship between persons who have agreed to share the profits of a business carried on by all or any of them acting for all." },
      { id: 71002, chapter: "pf", front: "What is a Profit and Loss Appropriation Account?", back: "A nominal account that divides the year's net profit among the partners — interest on capital, salary and reserves on the debit side, interest on drawings on the credit side, divisible profit transferred at the end." },
      { id: 71003, chapter: "pf", front: "Charge against profit vs appropriation of profit?", back: "Charge: payable even in a loss (e.g. interest on a partner's loan). Appropriation: a division of profit, possible only when profit exists (e.g. interest on capital, partner's salary)." },
      { id: 71004, chapter: "pf", front: "How are appropriations treated when profit is insufficient?", back: "Reduced proportionately: amount payable = full claim × (profit available ÷ total appropriations claimed). One common factor scales every item." },
      { id: 71005, chapter: "pf", front: "What is a guarantee of profit?", back: "A promise that a partner receives at least a fixed amount; any shortfall (deficiency) is met by the guaranteeing partner or firm — never by increasing the firm's profit." },
      { id: 71006, chapter: "pf", front: "Fixed vs fluctuating capital accounts?", back: "Fixed: capital moves only on introduction/withdrawal; other adjustments go to current accounts — needs the deed. Fluctuating: one account carries everything — the default." },
      { id: 71007, chapter: "pf", front: "Formula for divisible profit?", back: "Net profit + interest on drawings − interest on capital − partners' salary/commission − transfers to reserves." },
      { id: 71008, chapter: "pf", front: "What is a past adjustment?", back: "A single correcting entry through partners' capital accounts fixing an earlier wrong division: adjustment = correct entitlement − amount already credited. All corrections sum to zero." },

      { id: 71009, chapter: "gw", front: "Define goodwill.", back: "The value of a firm's reputation and earning power beyond its tangible assets — the capacity to earn above the normal return on capital employed." },
      { id: 71010, chapter: "gw", front: "Super profit formula?", back: "Super profit = average profit − normal profit, where normal profit = capital employed × normal rate of return." },
      { id: 71011, chapter: "gw", front: "Goodwill by average profit method?", back: "Average annual profit × number of years' purchase." },
      { id: 71012, chapter: "gw", front: "Goodwill by capitalisation of super profit?", back: "Super profit ÷ normal rate of return." },
      { id: 71013, chapter: "gw", front: "Goodwill by capitalisation of average profit?", back: "(Average profit ÷ normal rate of return) − capital employed." },
      { id: 71014, chapter: "gw", front: "When is goodwill recorded in the books?", back: "Only purchased goodwill (AS-26). Self-generated goodwill is valued for partner settlements but never shown as an asset." },
      { id: 71015, chapter: "gw", front: "What does years' purchase mean?", back: "The multiplier converting one year's surplus into the goodwill price — how many past years of excess earnings are being paid for." },
      { id: 71016, chapter: "gw", front: "Capital employed = ?", back: "Total assets minus long-term liabilities (equivalently, partners' capital plus long-term reserves)." },

      { id: 71017, chapter: "psr", front: "Sacrificing ratio formula?", back: "Old ratio − new ratio, partner by partner. Positive result = sacrifice." },
      { id: 71018, chapter: "psr", front: "Gaining ratio formula?", back: "New ratio − old ratio. It mirrors the sacrifice exactly — all sacrifices and gains sum to zero." },
      { id: 71019, chapter: "psr", front: "Why revalue assets when the ratio changes?", back: "So accumulated appreciation or depreciation is settled with the OLD partners in the OLD ratio — the gaining partner never inherits history they did not earn." },
      { id: 71020, chapter: "psr", front: "Treatment of General Reserve at reconstitution?", back: "Distributed to old partners in the old ratio — it is an accumulated profit of the old agreement." },
      { id: 71021, chapter: "psr", front: "How is goodwill compensated at a ratio change?", back: "Gaining partner pays the sacrificing partner: firm's goodwill × the sacrificing partner's sacrifice fraction." },
      { id: 71022, chapter: "psr", front: "A surrenders 1/5 of his 3/5 share. New shares?", back: "Surrender = 3/25. A: 12/25; B: 13/25." },
      { id: 71023, chapter: "psr", front: "What is a revised balance sheet?", back: "The balance sheet drawn at reconstitution: revalued assets/liabilities, reserves distributed, capitals adjusted for compensation, no accumulated balances left." },
      { id: 71024, chapter: "psr", front: "Which ratio governs revaluation profit?", back: "The OLD profit-sharing ratio — always, without exception." }
    ]
  });
})();
