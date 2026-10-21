/* ============================================================
   CLASS 12 — EXPANSION F (v86): Partnership Fundamentals (pf)
   Additive unit — extends the chapter registered by data-12a.js.
   Content is original teaching material written for this project
   against the CBSE Class 12 Accountancy curriculum (2026-27).
   ============================================================ */
(function () {
  "use strict";

  C12_DATA.register({

    content: {
      pf: {

        /* ---- Practice Bank (merged with existing ids 1–10) ---- */
        numericals: [
          {
            id: 11, difficulty: "Easy",
            question: "A firm ran the whole year without a partnership deed and earned a profit of ₹84,000. Two partners had contributed unequal capitals. How does the Indian Partnership Act, 1932 direct the profit to be divided?",
            options: ["Equally — ₹42,000 each, whatever the capitals contributed", "In proportion to the capitals standing to the partners' accounts", "In proportion to the days each partner worked in the year", "In proportion to the experience each partner brought to the firm"],
            answerIndex: 0,
            explanation: "Section 13 of the Act fills every gap a deed leaves: profits and losses are shared equally when nothing has been agreed, so ₹84,000 ÷ 2 = ₹42,000 each."
          },
          {
            id: 12, difficulty: "Easy",
            question: "Partner A withdrew ₹20,000 from the firm on 1st October, 2025. The accounting year ends on 31st March, 2026 and the deed charges interest on drawings at 12% per annum. Interest on drawings for the year is:",
            options: ["₹720", "₹1,440", "₹360", "₹2,400"],
            answerIndex: 0,
            explanation: "The money stood out for 6 months, from 1st October to 31st March: 20,000 × 12% × 6/12 = ₹720. Applying the rate for a full year would wrongly give ₹1,440."
          },
          {
            id: 13, difficulty: "Hard",
            question: "P and Q share profits 3:2, but while closing the books the accountant found that the entire profit of ₹95,000 had been divided in the reversed ratio of 2:3. The single past-adjustment entry required is:",
            options: ["Credit P with ₹19,000 and debit Q with ₹19,000", "Debit P with ₹19,000 and credit Q with ₹19,000", "Credit P with ₹9,500 and debit Q with ₹9,500", "No entry is required"],
            answerIndex: 0,
            explanation: "P should have received 95,000 × 3/5 = ₹57,000 but took 95,000 × 2/5 = ₹38,000, while Q received ₹57,000 against a correct ₹38,000 — so the entry credits P ₹19,000 and debits Q ₹19,000."
          },
          {
            id: 14, difficulty: "Medium",
            question: "P and Q share profits 3:2. P is entitled to a salary of ₹12,000 for the year, but the salary was never appropriated and the amount stayed in the profit, which was then divided between P and Q in their profit-sharing ratio. The past-adjustment entry will credit P with:",
            options: ["₹4,800", "₹12,000", "₹7,200", "₹6,000"],
            answerIndex: 0,
            explanation: "P's correct entitlement is the full ₹12,000, but he already received 12,000 × 3/5 = ₹7,200 of it along with his share of profit, so he is credited 12,000 − 7,200 = ₹4,800 and Q is debited the same."
          },
          {
            id: 15, difficulty: "Easy",
            question: "The partnership deed allows partner D a commission of ₹15,000 for the year. In the firm's final accounts this commission is:",
            options: ["Debited to the Profit and Loss Appropriation Account as an appropriation of profit", "Debited to the Profit and Loss Account as a charge against profit", "Debited to the Trading Account as an expense of goods sold", "Shown on the asset side of the Balance Sheet as prepaid commission"],
            answerIndex: 0,
            explanation: "Commission paid to a partner divides profit rather than earning it — the ₹15,000 goes on the debit side of the appropriation account, exactly like a partner's salary or interest on capital."
          },
          {
            id: 16, difficulty: "Medium",
            question: "A firm keeps fixed capital accounts. During the year a partner introduced ₹40,000 of fresh capital, withdrew ₹25,000 for personal use and earned ₹6,000 as interest on capital. Which of these moves the partner's Capital Account?",
            options: ["Only the ₹40,000 introduction, because the ₹25,000 drawings and ₹6,000 interest go to the Current Account", "All three figures — ₹40,000, ₹25,000 and ₹6,000 — are posted to the Capital Account", "Only the ₹6,000 interest, because interest on capital always touches capital", "None of them, because under the fixed method capital accounts are never posted"],
            answerIndex: 0,
            explanation: "Under the fixed method the Capital Account changes only when capital is introduced or withdrawn, so the ₹40,000 introduction hits it, while the ₹25,000 drawings and ₹6,000 interest on capital are routed to the partner's Current Account."
          },
          {
            id: 17, difficulty: "Medium",
            question: "A partner withdrew ₹6,000 from the firm on 1st July, 2025 and another ₹6,000 on 1st January, 2026. The accounting year ends on 31st March, 2026 and the deed charges interest on drawings at 12% per annum. Interest on drawings for the year is:",
            options: ["₹720", "₹1,440", "₹540", "₹900"],
            answerIndex: 0,
            explanation: "Each withdrawal earns interest only for the months it stayed out of the firm: 6,000 × 12% × 9/12 = ₹540 on the 1st July withdrawal and 6,000 × 12% × 3/12 = ₹180 on the 1st January one, i.e. ₹720 in all. Charging 12% on ₹12,000 for the whole year would wrongly give ₹1,440."
          },
          {
            id: 18, difficulty: "Hard",
            question: "Net profit before appropriations is ₹2,00,000. The deed provides interest on drawings of ₹4,000 (X) and ₹1,000 (Y); interest on capital at 10% on capitals of ₹2,00,000 (X) and ₹1,00,000 (Y); a commission of ₹5,000 to X; and a transfer of 10% of net profit to General Reserve. The divisible profit is:",
            options: ["₹1,50,000", "₹1,55,000", "₹1,45,000", "₹1,60,000"],
            answerIndex: 0,
            explanation: "2,00,000 + 4,000 + 1,000 interest on drawings − 20,000 − 10,000 interest on capital − 5,000 commission − 20,000 reserve (10% of 2,00,000) = ₹1,50,000."
          },
          {
            id: 19, difficulty: "Easy",
            question: "A firm's accountant charged interest on capital of ₹8,000 to the Profit and Loss Account instead of showing it in the Profit and Loss Appropriation Account, and did not deduct it anywhere else. The result is:",
            options: ["Reported net profit is ₹8,000 too low, while the profit the partners divide is unchanged", "Both net profit and divisible profit are ₹8,000 too low", "Net profit is correct but divisible profit is ₹8,000 too low", "Nothing is affected, because both accounts give the same answer"],
            answerIndex: 0,
            explanation: "Interest on capital of ₹8,000 belongs in the appropriation account; charging it in the Profit and Loss Account reduces reported net profit by ₹8,000, but the amount the partners finally share is the same either way."
          },
          {
            id: 20, difficulty: "Medium",
            question: "A and B share profits 3:2 and the firm has guaranteed A a minimum of ₹50,000 for every year. The divisible profit for the year is ₹1,35,000. How much does A receive?",
            options: ["₹81,000, because a guarantee is only a floor", "₹50,000, because the guarantee fixes the amount", "₹67,500, being half of the profit", "₹75,000"],
            answerIndex: 0,
            explanation: "A's share = 1,35,000 × 3/5 = ₹81,000, which already exceeds the guaranteed minimum of ₹50,000, so no deficiency arises and A keeps the whole ₹81,000."
          },
          {
            id: 21, difficulty: "Hard",
            question: "A and B share profits 3:1. Interest on capital at 10% on capitals of ₹2,00,000 (A) and ₹1,00,000 (B) was not given at all, and the entire net profit of ₹90,000 was divided in the profit-sharing ratio. The single past-adjustment entry required is:",
            options: ["Credit B with ₹2,500 and debit A with ₹2,500", "Debit B with ₹2,500 and credit A with ₹2,500", "Credit B with ₹10,000 and debit A with ₹10,000", "No entry is required"],
            answerIndex: 0,
            explanation: "Divisible profit = 90,000 − 30,000 interest = ₹60,000, so B should have received 10,000 + 60,000 × 1/4 = ₹25,000 but took 90,000 × 1/4 = ₹22,500, while A received ₹67,500 against a correct ₹65,000 — hence B is credited ₹2,500 and A debited ₹2,500."
          },
          {
            id: 22, difficulty: "Easy",
            question: "A partnership firm ran the whole year without a partnership deed. Which of the following can a partner NOT claim from the firm?",
            options: ["Salary for the work done in running the business", "An equal share of the year's profit", "Interest at 6% per annum on money he had lent to the firm", "An equal share of the year's loss"],
            answerIndex: 0,
            explanation: "With no deed the Act gives no salary, commission or interest on capital to any partner; profits and losses are shared equally and only a partner's loan carries interest at 6% per annum."
          },
          {
            id: 23, difficulty: "Medium",
            question: "An extract of a firm's Profit and Loss Appropriation Account shows Net profit b/d ₹1,50,000 and Interest on drawings ₹6,000 on the credit side, and Interest on capital ₹9,000, Partner's salary ₹12,000 and Transfer to General Reserve ₹15,000 on the debit side. C and D share profits 4:1. How much of the divisible profit is credited to C?",
            options: ["₹96,000", "₹1,20,000", "₹1,00,000", "₹90,000"],
            answerIndex: 0,
            explanation: "Divisible profit = 1,50,000 + 6,000 − 9,000 − 12,000 − 15,000 = ₹1,20,000, and C takes 4/5 of it = ₹96,000 (D receives the remaining ₹24,000)."
          },
          {
            id: 24, difficulty: "Hard",
            question: "J, K and L share profits 2:3:1. L is guaranteed a minimum of ₹60,000 by the firm, the deficiency to be borne by J and K in the agreed ratio 1:4. Net profit after all appropriations is ₹3,00,000. What does K finally receive?",
            options: ["₹1,42,000", "₹1,50,000", "₹1,44,000", "₹1,38,000"],
            answerIndex: 0,
            explanation: "L's share = 3,00,000 × 1/6 = ₹50,000 against the guaranteed ₹60,000, a deficiency of ₹10,000 borne by J and K in 1:4 — K pays 10,000 × 4/5 = ₹8,000 out of his own 3,00,000 × 3/6 = ₹1,50,000 and ends with ₹1,42,000."
          },
          {
            id: 25, difficulty: "Medium",
            question: "The deed allows interest on capital at 12% per annum, payable from the date the capital is actually introduced. A partner's opening capital was ₹3,00,000 and he introduced ₹50,000 more on 1st July, 2025. The accounting year ends on 31st March, 2026. Interest on capital for the year is:",
            options: ["₹40,500", "₹42,000", "₹39,000", "₹36,000"],
            answerIndex: 0,
            explanation: "Opening capital 3,00,000 × 12% = ₹36,000 for the full year, plus 50,000 × 12% × 9/12 = ₹4,500 for the 9 months from 1st July to 31st March — total ₹40,500. Charging 12% on the whole 3,50,000 for a year would wrongly give ₹42,000."
          }
        ],

        /* ---- Interactive journal lab (engine strings copied verbatim
               from data-12a.js; only the case list grows) ---- */
        activity: {
          type: "journal",
          title: "Appropriation Journal Lab",
          instruction: "Fluctuating capital accounts are in use. Build each journal entry — pick the account to debit, the account to credit, and type the amount. Every entry is checked against the deed's working before it is stamped verified.",
          entries: [
            {
              prompt: "Interest at 6% per annum for the year on Partner C's loan of ₹1,00,000 falls due and the deed is silent on the rate.",
              dr: ["Profit and Loss A/c", "Profit and Loss Appropriation A/c", "Interest on Partner's Loan A/c", "Partner C's Capital A/c"],
              cr: ["Partner C's Loan A/c", "Interest on Partner's Loan A/c", "Profit and Loss Appropriation A/c", "Partner C's Capital A/c"],
              drAccount: "Profit and Loss A/c",
              crAccount: "Partner C's Loan A/c",
              amount: 6000,
              note: "A partner's loan is a liability, not capital: interest on it is a charge against profit, so it is debited to the Profit and Loss Account and never to the appropriation account (1,00,000 × 6% = ₹6,000)."
            },
            {
              prompt: "Commission of ₹15,000 allowed by the deed to Partner D for the year is payable out of profit.",
              dr: ["Profit and Loss Appropriation A/c", "Profit and Loss A/c", "Commission A/c", "Partner D's Capital A/c"],
              cr: ["Partner D's Capital A/c", "Commission A/c", "Profit and Loss Appropriation A/c", "General Reserve A/c"],
              drAccount: "Profit and Loss Appropriation A/c",
              crAccount: "Partner D's Capital A/c",
              amount: 15000,
              note: "Commission paid to a partner divides profit instead of earning it — debit the appropriation account and credit the partner's capital account with ₹15,000."
            },
            {
              prompt: "Partner E is charged with his equal half-share of the firm's loss of ₹36,000 for the year.",
              dr: ["Partner E's Capital A/c", "Profit and Loss A/c", "Profit and Loss Appropriation A/c", "Loss A/c"],
              cr: ["Profit and Loss A/c", "Profit and Loss Appropriation A/c", "General Reserve A/c", "Partner E's Capital A/c"],
              drAccount: "Partner E's Capital A/c",
              crAccount: "Profit and Loss A/c",
              amount: 18000,
              note: "A year's loss is borne by the partners in their profit-sharing ratio — debit each partner's capital and close the Profit and Loss Account. Half of ₹36,000 is ₹18,000."
            }
          ]
        },

        /* ---- Exam cases (existing ids are 1 and 2) ---- */
        examCases: [
          {
            id: 3,
            title: "A deed written in dates and percentages",
            passage: "Ira and Dev run a firm sharing profits and losses equally, with fluctuating capital accounts. The deed provides interest on capital at 9% per annum on opening capitals of ₹1,60,000 (Ira) and ₹80,000 (Dev), a salary of ₹2,000 per month to Dev, and interest on drawings at 12% per annum. Ira withdrew ₹36,000 on 1st October, 2025 and Dev withdrew ₹24,000 on 1st January, 2026; the accounting year ends on 31st March, 2026. Net profit before any appropriation is ₹1,44,000.",
            difficulty: "Medium",
            subs: [
              {
                q: "What is the total interest on capital provided for the year?",
                options: ["₹21,600", "₹24,000", "₹14,400", "₹19,800"],
                answerIndex: 0,
                reasoning: "9% of ₹1,60,000 = ₹14,400 and 9% of ₹80,000 = ₹7,200, so interest on capital totals ₹21,600. Salary and drawings interest are separate lines of the appropriation account."
              },
              {
                q: "What does Dev receive as salary for the year?",
                options: ["₹24,000", "₹2,000", "₹26,000", "₹22,000"],
                answerIndex: 0,
                reasoning: "₹2,000 a month × 12 months = ₹24,000 for the year — quoting the monthly figure of ₹2,000 forgets the twelve-month run."
              },
              {
                q: "What is the total interest on drawings charged to the partners?",
                options: ["₹2,880", "₹4,320", "₹3,600", "₹1,440"],
                answerIndex: 0,
                reasoning: "Ira: 36,000 × 12% × 6/12 = ₹2,160 for the six months from 1st October to 31st March. Dev: 24,000 × 12% × 3/12 = ₹720 for the three months from 1st January. Together ₹2,880."
              },
              {
                q: "What is the divisible profit for the year?",
                options: ["₹1,01,280", "₹98,400", "₹1,04,160", "₹1,02,720"],
                answerIndex: 0,
                reasoning: "1,44,000 net profit + 2,880 drawings interest − 21,600 interest on capital − 24,000 salary = ₹1,01,280."
              },
              {
                q: "What is Dev's total credit for the year — salary, interest on capital and share of profit taken together?",
                options: ["₹81,840", "₹78,840", "₹84,600", "₹81,120"],
                answerIndex: 0,
                reasoning: "Salary ₹24,000 + interest on capital ₹7,200 + half of ₹1,01,280 = ₹50,640 gives ₹81,840, before his drawings interest of ₹720 is separately debited to him."
              }
            ]
          },
          {
            id: 4,
            title: "A guarantee shared by two partners",
            passage: "Arjun, Seema and Toshi run a firm sharing profits in the ratio 3:2:1 with fluctuating capital accounts. For the year ended 31st March, 2026 the net profit after all business expenses was ₹1,20,000, and the deed requires 10% of that profit to be transferred to General Reserve before the division. Seema is guaranteed a minimum profit of ₹60,000 for the year, any deficiency to be borne by Arjun and Toshi in the ratio 2:1.",
            difficulty: "Hard",
            subs: [
              {
                q: "What amount is transferred to General Reserve before division?",
                options: ["₹12,000", "₹10,000", "₹20,000", "₹24,000"],
                answerIndex: 0,
                reasoning: "10% of net profit ₹1,20,000 = ₹12,000, which is debited to the appropriation account and reduces the profit the partners share."
              },
              {
                q: "What is the divisible profit available for division?",
                options: ["₹1,08,000", "₹1,20,000", "₹1,14,000", "₹1,02,000"],
                answerIndex: 0,
                reasoning: "1,20,000 net profit − 12,000 transferred to General Reserve = ₹1,08,000, the figure that is actually sliced between the three partners."
              },
              {
                q: "What would Seema receive if the guarantee did not exist?",
                options: ["₹36,000", "₹60,000", "₹24,000", "₹54,000"],
                answerIndex: 0,
                reasoning: "1,08,000 × 2/6 = ₹36,000 — Seema's share of the divisible profit before the guarantee is tested against her minimum."
              },
              {
                q: "What deficiency does the guarantee make good for Seema?",
                options: ["₹24,000", "₹12,000", "₹18,000", "₹30,000"],
                answerIndex: 0,
                reasoning: "Guaranteed minimum ₹60,000 − computed share ₹36,000 = ₹24,000 — the amount by which Seema falls short and must be made whole."
              },
              {
                q: "How much does Arjun finally receive?",
                options: ["₹38,000", "₹54,000", "₹46,000", "₹30,000"],
                answerIndex: 0,
                reasoning: "Arjun's share = 1,08,000 × 3/6 = ₹54,000, less 2/3 of the ₹24,000 deficiency = ₹16,000, leaving ₹38,000. Toshi bears the remaining ₹8,000, and 38,000 + 60,000 + 10,000 = 1,08,000 ✓."
              }
            ]
          }
        ],

        /* ---- Short exam numericals (existing ids are 1 and 2) ---- */
        examNumericals: [
          {
            id: 3,
            q: "X and Y share profits 4:1. Net profit before appropriations ₹2,50,000; interest on capital at 10% on capitals of ₹2,50,000 (X) and ₹1,50,000 (Y); commission to X ₹10,000; 5% of net profit transferred to General Reserve; interest on drawings ₹6,000 from X. Find the divisible profit (₹).",
            value: 193500,
            explanation: "2,50,000 + 6,000 drawings interest − 25,000 − 15,000 interest on capital − 10,000 commission − 12,500 reserve (5% of 2,50,000) = ₹1,93,500.",
            difficulty: "Hard"
          },
          {
            id: 4,
            q: "M and N share profits 2:3. The Profit and Loss Account for the year shows a debit balance of ₹25,000 — a net loss. Find N's share of the loss (₹).",
            value: 15000,
            explanation: "A loss is shared in the profit-sharing ratio just like a profit: 25,000 × 3/5 = ₹15,000, debited to N's capital account.",
            difficulty: "Easy"
          },
          {
            id: 5,
            q: "Under the fixed capital method a partner's capital is ₹4,00,000 and his current account shows a credit balance of ₹30,000. During the year he introduced ₹50,000 of fresh capital and withdrew ₹20,000 as capital. Find his closing capital (₹).",
            value: 430000,
            explanation: "Only capital movements touch the capital account: 4,00,000 + 50,000 − 20,000 = ₹4,30,000. The ₹30,000 in the current account is deliberately left out of this figure.",
            difficulty: "Medium"
          }
        ]
      }
    },

    /* ============ QUIZ (ids 70131–70145) ============ */
    quiz: [
      { id: 70131, chapter: "pf", difficulty: "Easy",
        q: "If a partnership firm has no deed, how are the year's profits and losses divided?",
        options: ["Equally, in 1:1 shares", "In proportion to each partner's capital", "In proportion to the time each partner spends on the business", "In proportion to the seniority of the partners"],
        answerIndex: 0,
        explanation: "Section 13 of the Indian Partnership Act, 1932 fills every gap: where nothing has been agreed, profits and losses are shared equally, so capital contributed and seniority are irrelevant." },
      { id: 70132, chapter: "pf", difficulty: "Easy",
        q: "Under the Indian Partnership Act, 1932, a partner with no deed in hand is entitled to interest:",
        options: ["Only on money lent to the firm, at 6% per annum", "On his capital at 6% per annum", "On his drawings at 6% per annum", "On both capital and drawings at 6% per annum"],
        answerIndex: 0,
        explanation: "The Act allows no interest on capital and no interest on drawings unless the deed provides for them — but money a partner has lent to the firm earns 6% per annum as a charge against profit." },
      { id: 70133, chapter: "pf", difficulty: "Medium",
        q: "Partner D withdrew ₹24,000 on 1st November, 2025 and the year ends on 31st March, 2026. Interest on drawings is charged at 15% per annum. The interest for the year is:",
        options: ["₹1,500", "₹3,600", "₹1,200", "₹2,400"],
        answerIndex: 0,
        explanation: "The drawings stood out for 5 months, from 1st November to 31st March: 24,000 × 15% × 5/12 = ₹1,500. Charging the rate for a full year would wrongly give ₹3,600." },
      { id: 70134, chapter: "pf", difficulty: "Medium",
        q: "Net profit ₹11,000; the deed provides interest on capital of ₹8,000 (R) and ₹4,000 (S) and a salary of ₹10,000 to S. Profit is insufficient. How much is credited to S towards interest on capital and salary?",
        options: ["₹7,000", "₹10,000", "₹5,500", "₹4,000"],
        answerIndex: 0,
        explanation: "Total claims = 8,000 + 4,000 + 10,000 = ₹22,000 against ₹11,000 available — exactly half. S's claim of 4,000 + 10,000 = ₹14,000 × 0.5 = ₹7,000." },
      { id: 70135, chapter: "pf", difficulty: "Medium",
        q: "A firm incurs a loss of ₹20,000 this year. The deed allows interest on capital of ₹6,000 to T and a salary of ₹10,000 to U. What is credited to U's capital account for the year?",
        options: ["Nothing, because appropriations can be made only out of profit", "₹10,000, because the deed makes the salary binding", "₹5,000, being the salary cut down in proportion to the loss", "₹16,000, being salary together with T's interest on capital"],
        answerIndex: 0,
        explanation: "There is no profit to divide, so U's salary of ₹10,000 is not payable at all — appropriations split profit and can never create it, whereas a charge such as interest on a partner's loan would still fall due." },
      { id: 70136, chapter: "pf", difficulty: "Medium",
        q: "A firm keeps fixed capital accounts. Which of these is posted to a partner's Current Account?",
        options: ["Interest on capital credited to the partner", "Additional capital introduced by the partner", "Capital permanently withdrawn by the partner", "Repayment of a loan the partner had advanced to the firm"],
        answerIndex: 0,
        explanation: "Only movements of capital itself touch the Capital Account; interest on capital, salary and drawings are all routed to the Current Account. Fresh capital, capital withdrawn and a partner's loan are settled through other accounts." },
      { id: 70137, chapter: "pf", difficulty: "Hard",
        q: "A, B and C share profits 3:2:1. The firm guarantees C a minimum of ₹45,000, any deficiency to be borne by A and B equally. The divisible profit is ₹2,10,000. What does A finally keep?",
        options: ["₹1,00,000", "₹1,05,000", "₹95,000", "₹1,10,000"],
        answerIndex: 0,
        explanation: "C's share = 2,10,000 × 1/6 = ₹35,000, short of ₹45,000 by ₹10,000; borne equally, so A gives ₹5,000 out of his own 2,10,000 × 3/6 = ₹1,05,000 and keeps ₹1,00,000." },
      { id: 70138, chapter: "pf", difficulty: "Easy",
        q: "Which of these final-account statements has no meaning in a sole proprietorship?",
        options: ["Profit and Loss Appropriation Account", "Trading Account", "Profit and Loss Account", "Balance Sheet"],
        answerIndex: 0,
        explanation: "A sole proprietor has no partners to divide profit between, so the year ends with the Profit and Loss Account — the appropriation account is a partnership-only statement." },
      { id: 70139, chapter: "pf", difficulty: "Medium",
        q: "V and W share profits 3:1. Interest on capital of ₹6,000 due to V was credited in full to W by a clerical error. The past-adjustment entry needed is:",
        options: ["Credit V with ₹6,000 and debit W with ₹6,000", "Debit V with ₹6,000 and credit W with ₹6,000", "Credit V with ₹4,500 and debit W with ₹4,500", "No entry is required"],
        answerIndex: 0,
        explanation: "The ₹6,000 was V's entitlement and W took it, so the single correcting entry credits V ₹6,000 and debits W ₹6,000, leaving each partner with exactly what the deed allows." },
      { id: 70140, chapter: "pf", difficulty: "Hard",
        q: "A and B share profits 2:1. Net profit before appropriations ₹1,05,000; interest on drawings ₹3,000 (A); interest on capital at 10% on capitals of ₹1,50,000 (A) and ₹75,000 (B); salary ₹12,000 to A. What is B's total credit for the year?",
        options: ["₹32,000", "₹34,500", "₹24,500", "₹31,500"],
        answerIndex: 0,
        explanation: "Divisible profit = 1,05,000 + 3,000 − 15,000 − 7,500 − 12,000 = ₹73,500; B's share is 1/3 of it = ₹24,500 and with interest on capital of ₹7,500 his total credit is ₹32,000." },
      { id: 70141, chapter: "pf", difficulty: "Hard",
        q: "An accountant debited interest on capital of ₹20,000 and partner's salary of ₹30,000 to the Profit and Loss Account while working out net profit, and then charged them a second time in the Profit and Loss Appropriation Account. The divisible profit shown in the books is short by:",
        options: ["₹50,000", "₹20,000", "₹30,000", "₹1,00,000"],
        answerIndex: 0,
        explanation: "Both items are appropriations and were deducted twice — 20,000 + 30,000 = ₹50,000 — so the divisible profit recorded is ₹50,000 lower than it should be." },
      { id: 70142, chapter: "pf", difficulty: "Easy",
        q: "After every appropriation has been made, the balance of the Profit and Loss Appropriation Account is transferred to:",
        options: ["The partners' capital (or current) accounts in the profit-sharing ratio", "The General Reserve, to be carried forward", "The Profit and Loss Account", "The partners' loan accounts"],
        answerIndex: 0,
        explanation: "That balance is the divisible profit — it leaves the appropriation account by being credited to each partner's capital or current account in the agreed profit-sharing ratio." },
      { id: 70143, chapter: "pf", difficulty: "Medium",
        q: "In a firm's Profit and Loss Appropriation Account the debit side stands at ₹1,05,000 before the divisible-profit line, while the credit side shows only ₹90,000. What does this show?",
        options: ["The profit is ₹15,000 short of meeting the appropriations, so the partners must bear that shortfall", "The firm has earned ₹15,000 of extra profit", "Interest on drawings of ₹15,000 has been left out of the account", "₹15,000 has to be transferred to General Reserve"],
        answerIndex: 0,
        explanation: "Appropriations claimed exceed the profit available by 1,05,000 − 90,000 = ₹15,000 — there is no divisible profit at all, and the ₹15,000 shortfall falls on the partners in their profit-sharing ratio." },
      { id: 70144, chapter: "pf", difficulty: "Easy",
        q: "Interest on drawings is charged to a partner because:",
        options: ["The partner has used the firm's money for personal purposes", "The partner has lent money to the firm", "The firm must pay interest on its own borrowings", "The partner has not introduced enough capital"],
        answerIndex: 0,
        explanation: "Drawings are the partner's personal withdrawals from the firm's funds; the interest compensates the firm for money so used and is credited to the appropriation account, raising divisible profit." },
      { id: 70145, chapter: "pf", difficulty: "Hard",
        q: "Net profit ₹7,000 and interest on drawings ₹2,000 (C) and ₹1,000 (D). The deed provides interest on capital of ₹6,000 (C) and ₹3,000 (D) and a salary of ₹6,000 to D. Profit cannot meet the appropriations. What is credited to D?",
        options: ["₹6,000", "₹9,000", "₹7,500", "₹4,500"],
        answerIndex: 0,
        explanation: "Profit available = 7,000 + 2,000 + 1,000 = ₹10,000 against claims of 6,000 + 3,000 + 6,000 = ₹15,000, giving a factor of 2/3. D's claim of ₹9,000 × 2/3 = ₹6,000." }
    ],

    /* ============ FLASHCARDS (ids 71105–71116) ============ */
    flashcards: [
      { id: 71105, chapter: "pf", front: "Default profit-sharing ratio when the deed is silent?", back: "Equal, 1:1. Section 13 of the Indian Partnership Act, 1932 shares profits and losses equally — capital contributions and seniority do not change it." },
      { id: 71106, chapter: "pf", front: "What can a partner claim by default when the deed says nothing?", back: "No salary, no commission and no interest on capital or drawings. Only a partner's loan earns interest — 6% per annum, as a charge against profit." },
      { id: 71107, chapter: "pf", front: "Formula for interest on drawings when dates are given?", back: "Drawings × rate × (months outstanding ÷ 12). Count the months from the date of withdrawal to the last day of the accounting year." },
      { id: 71108, chapter: "pf", front: "Which items go to the Current Account under the fixed capital method?", back: "Salary, commission, interest on capital, interest on drawings, drawings and the share of profit — everything except the introduction or withdrawal of capital itself." },
      { id: 71109, chapter: "pf", front: "What are the four steps of a guarantee-of-profit problem?", back: "Compute every partner's share, compare the guaranteed partner's share with the minimum, find the deficiency, then charge it to the guaranteeing party before dividing the rest." },
      { id: 71110, chapter: "pf", front: "When is interest on capital paid proportionately instead of in full?", back: "When the deed makes it an appropriation and profit cannot cover every claim — each item is scaled by (profit available ÷ total appropriations claimed)." },
      { id: 71111, chapter: "pf", front: "Who bears the deficiency when the firm itself guarantees a partner's minimum?", back: "The remaining partners, out of their own shares, usually in their profit-sharing ratio — never the firm's General Reserve." },
      { id: 71112, chapter: "pf", front: "Journal entry for transferring profit to General Reserve?", back: "Profit and Loss Appropriation A/c Dr to General Reserve A/c. It reduces divisible profit but leaves the year's net profit unchanged." },
      { id: 71113, chapter: "pf", front: "How is a past adjustment framed?", back: "One entry through the partners' capital or current accounts: debit whoever was over-credited, credit whoever was under-credited. The corrections always total zero." },
      { id: 71114, chapter: "pf", front: "Is a guaranteed minimum a cap on a partner's share?", back: "No — it is a floor. If the computed share already exceeds the minimum, the partner keeps the larger amount and no deficiency arises." },
      { id: 71115, chapter: "pf", front: "Which side of the Profit and Loss Appropriation Account carries a partner's salary?", back: "The debit side — it is appropriated out of profit, so it reduces what the partners finally share." },
      { id: 71116, chapter: "pf", front: "How is a year's loss divided between the partners?", back: "In the profit-sharing ratio, by debiting each partner's capital or current account and crediting the Profit and Loss Account. No appropriation can be made in a loss year." }
    ],

    /* ============ IMPORTANT QUESTIONS (existing count: 7) ============ */
    importantQuestions: {
      pf: [
        { type: "Short Answer", marks: 3,
          q: "What is a Profit and Loss Appropriation Account, and why does a partnership firm need one when a sole proprietorship does not?",
          answer: "It is a nominal account prepared after the Profit and Loss Account to divide the year's net profit among the partners on the terms of the deed. Its debit side carries interest on capital, partners' salary or commission and transfers to reserve; its credit side carries net profit brought down and interest on drawings; the balance — the divisible profit — is transferred to the partners' capital or current accounts in the profit-sharing ratio. A sole proprietor has no partner to appropriate profit to, so the statement has no purpose there." },
        { type: "Short Answer", marks: 3,
          q: "A withdrew ₹40,000 from the firm on 1st August, 2025. The accounting year ends on 31st March, 2026 and the deed charges interest on drawings at 12% per annum. Compute the interest and state where it is recorded.",
          answer: "The drawings remained outstanding for 8 months, from 1st August, 2025 to 31st March, 2026. Interest = 40,000 × 12% × 8/12 = ₹3,200. It is credited to the Profit and Loss Appropriation Account because it is income of the firm, and the same ₹3,200 is debited to the partner's capital account — so it raises the divisible profit that all the partners share." },
        { type: "Assertion-Reason", marks: 4,
          q: "Assertion (A): When the firm itself guarantees a minimum profit to a partner, the deficiency is met out of the firm's General Reserve. Reason (R): The deficiency is not a loss of the firm — it is met by reducing the shares of the other partners in their profit-sharing ratio. Choose the correct option: (a) both A and R are true and R is the correct explanation of A, (b) both A and R are true but R is not the correct explanation of A, (c) A is false but R is true, (d) A is true but R is false.",
          answer: "Option (c) is correct: A is false while R is true. A guarantee given by the firm does not become a firm-level expense — the guaranteed partner is simply paid out of the profit that would otherwise have gone to the other partners, so the deficiency is recovered by reducing their shares in the profit-sharing ratio (or in the ratio agreed for that purpose). General Reserve is an accumulated-profit transfer and has nothing to do with a guarantee, which is exactly why A is wrong. R correctly describes how the deficiency is actually met." },
        { type: "Long Answer", marks: 6,
          q: "A and B share profits 3:2 with fluctuating capitals. Net profit before appropriations is ₹1,80,000. The deed provides interest on capital at 10% on capitals of ₹3,00,000 (A) and ₹2,00,000 (B), a salary of ₹24,000 to B, interest on drawings of ₹5,000 (A) and ₹3,000 (B), and a transfer of 10% of net profit to General Reserve. Prepare the appropriation account and give A's total credit for the year.",
          answer: "Interest on capital: A 10% of 3,00,000 = ₹30,000 and B 10% of 2,00,000 = ₹20,000. Transfer to General Reserve = 10% of 1,80,000 = ₹18,000. Divisible profit = 1,80,000 + 5,000 + 3,000 − 30,000 − 20,000 − 24,000 − 18,000 = ₹96,000. A's share of it = 96,000 × 3/5 = ₹57,600, so A's total credit is interest on capital ₹30,000 + share ₹57,600 = ₹87,600, against which his drawings interest of ₹5,000 is separately debited. B receives 20,000 + 24,000 + 96,000 × 2/5 = ₹82,400. Check: 87,600 + 82,400 = 1,70,000 = interest on capital 50,000 + salary 24,000 + divisible profit 96,000." },
        { type: "Case-Based", marks: 6,
          q: "Kabir and Tara share profits and losses 5:3. While closing the books for the year it was found that the entire net profit of ₹1,60,000 had been divided between them in that ratio without applying a single deed provision: Kabir's salary of ₹24,000 had not been recorded, and interest on capital at 8% on capitals of ₹2,00,000 (Kabir) and ₹1,50,000 (Tara) had not been given. (a) Compute the total appropriations ignored. (b) State the correct divisible profit. (c) Pass the single past-adjustment entry.",
          answer: "(a) Ignored appropriations: salary ₹24,000 + interest on capital 8% of 2,00,000 = ₹16,000 and 8% of 1,50,000 = ₹12,000, totalling ₹52,000. (b) Correct divisible profit = 1,60,000 − 52,000 = ₹1,08,000, giving Kabir 1,08,000 × 5/8 = ₹67,500 and Tara 1,08,000 × 3/8 = ₹40,500. (c) Kabir should have received 16,000 + 24,000 + 67,500 = ₹1,07,500 but actually took 1,60,000 × 5/8 = ₹1,00,000; Tara should have received 12,000 + 40,500 = ₹52,500 but took ₹60,000. The correcting entry is therefore Tara's Capital A/c Dr ₹7,500 to Kabir's Capital A/c ₹7,500 — the two corrections net to zero, as every past adjustment must." },
        { type: "Case-Based", marks: 4,
          q: "Extract of the Profit and Loss Appropriation Account of Meher & Co.: credit side — Net profit b/d ₹1,95,000 and Interest on drawings ₹7,500; debit side — Interest on capital ₹12,000 (P), Interest on capital ₹8,000 (Q), Partner's salary ₹18,000 (P) and Transfer to General Reserve ₹25,000. P and Q share profits 4:1. (a) What is the total of the appropriations charged? (b) What is the divisible profit? (c) How much does Q receive as share of profit?",
          answer: "(a) Appropriations charged = 12,000 + 8,000 + 18,000 + 25,000 = ₹63,000. (b) Divisible profit = 1,95,000 credit side + 7,500 interest on drawings − 63,000 = ₹1,39,500. (c) Q's share = 1,39,500 × 1/5 = ₹27,900, while P receives 1,39,500 × 4/5 = ₹1,11,600. Check: 27,900 + 1,11,600 = ₹1,39,500, so the whole divisible profit is distributed." },
        { type: "Long Answer", marks: 6,
          q: "A firm carried on business for a whole year without any partnership deed. Two partners ran it equally, and one of them had earlier lent ₹1,00,000 to the firm. Net profit for the year is ₹1,44,000. Explain how the profit is divided, compute the interest on the loan, and state what neither partner can claim.",
          answer: "With no deed, Section 13 of the Indian Partnership Act, 1932 applies. Interest on a partner's loan is a charge against profit at 6% per annum: 1,00,000 × 6% = ₹6,000, debited to the Profit and Loss Account — this would be payable even if the firm had made a loss. The residue, 1,44,000 − 6,000 = ₹1,38,000, is shared equally, so each partner receives ₹69,000. Neither partner can claim a salary, a commission or interest on capital, and no interest is payable on drawings either, because the Act allows none without an agreement; only a share of profit or loss and interest on a partner's loan follow automatically by statute." },
        { type: "Short Answer", marks: 3,
          q: "What is a partner's commission, and how is it treated in the accounts of the firm at the year end?",
          answer: "Commission is a payment the deed allows a partner for particular services, such as placing orders, making collections or supervising a branch. Like salary and interest on capital it is an appropriation of profit: it is debited to the Profit and Loss Appropriation Account and credited to the partner's capital account (or current account under the fixed method), and it is paid only out of profit unless the deed expressly makes it a charge. Because it is shared out before division, it reduces the divisible profit received by every partner." }
      ]
    }
  });
})();
