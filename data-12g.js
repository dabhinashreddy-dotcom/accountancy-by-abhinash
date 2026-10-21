/* ============================================================
   CLASS 12 — EXPANSION G (v86): Goodwill (gw) + PSR Change (psr)
   Additive unit — extends the chapters registered by data-12a.js.
   Content is original teaching material written for this project
   against the CBSE Class 12 Accountancy curriculum (2026-27).
   ============================================================ */
(function () {
  "use strict";

  C12_DATA.register({
    content: {
      gw: {

        /* ---- Practice Bank (merged with existing ids 1–10) ---- */
        numericals: [
          {
            id: 11, difficulty: "Easy",
            question: "A firm's profits of the last four years were ₹2,00,000, ₹2,50,000, ₹3,00,000 and a loss of ₹1,50,000 in the fourth year. Goodwill is to be valued at three years' purchase of average profit. The goodwill is:",
            options: ["₹4,50,000", "₹5,62,500", "₹6,00,000", "₹1,50,000"],
            answerIndex: 0,
            explanation: "The loss must be set off against the profits: 2,00,000 + 2,50,000 + 3,00,000 − 1,50,000 = ₹6,00,000 ÷ 4 = ₹1,50,000 average, and 1,50,000 × 3 = ₹4,50,000. Dropping the loss year entirely would wrongly give 7,50,000 ÷ 4 × 3 = ₹5,62,500."
          },
          {
            id: 12, difficulty: "Easy",
            question: "Which of these events would most likely REDUCE a firm's goodwill?",
            options: ["The firm's long-serving manager resigns and her loyal clients follow her to a rival firm", "The firm opens a second showroom in a crowded market", "The firm improves the packaging of its best-selling product", "The firm wins a three-year supply contract at better prices"],
            answerIndex: 0,
            explanation: "Goodwill rests on reputation, loyal customers and efficient management — losing the manager who holds those relationships cuts the earning power, while the other three events add to it."
          },
          {
            id: 13, difficulty: "Medium",
            question: "A firm reports total assets of ₹25,00,000 including 10% debentures of ₹5,00,000 as a long-term liability, an average profit of ₹2,60,000 and a normal rate of return of 12%. The super profit is:",
            options: ["₹20,000", "₹2,40,000", "₹2,60,000", "₹60,000"],
            answerIndex: 0,
            explanation: "Capital employed = 25,00,000 − 5,00,000 = ₹20,00,000; normal profit = 20,00,000 × 12% = ₹2,40,000; super profit = 2,60,000 − 2,40,000 = ₹20,000."
          },
          {
            id: 14, difficulty: "Medium",
            question: "A firm has an average profit of ₹3,60,000, capital employed of ₹24,00,000 and a normal rate of return of 12%. A student reports goodwill of ₹30,00,000 by the capitalisation of average profit method. What has he done wrong?",
            options: ["He stopped at the capitalised value and never deducted capital employed — goodwill is really ₹6,00,000", "He capitalised at 10% instead of 12% — goodwill is really ₹12,00,000", "He added capital employed instead of deducting it — goodwill is really ₹54,00,000", "Nothing at all — ₹30,00,000 is the correct answer"],
            answerIndex: 0,
            explanation: "3,60,000 ÷ 0.12 = ₹30,00,000 is only the capitalised value of the whole firm; deducting capital employed of ₹24,00,000 leaves goodwill of ₹6,00,000 — the step the student skipped."
          },
          {
            id: 15, difficulty: "Medium",
            question: "Goodwill of a firm is ₹5,40,000 by the capitalisation of super profit method at a normal rate of return of 12%, and capital employed is ₹18,00,000. The firm's average profit must be:",
            options: ["₹2,80,800", "₹2,16,000", "₹5,40,000", "₹45,00,000"],
            answerIndex: 0,
            explanation: "Super profit = 5,40,000 × 12% = ₹64,800; normal profit = 18,00,000 × 12% = ₹2,16,000; average profit = 2,16,000 + 64,800 = ₹2,80,800."
          },
          {
            id: 16, difficulty: "Easy",
            question: "For the same firm the average profit method gives goodwill of ₹4,80,000 while the super profit method gives ₹1,20,000. The reason for the gap is:",
            options: ["The average method capitalises all earnings, while the super profit method capitalises only the earnings above the normal return", "The average profit method must always be lower than the super profit method", "The normal rate of return was deducted twice under the super profit method", "Goodwill cannot be worked out by two methods on one firm"],
            answerIndex: 0,
            explanation: "The super profit route first removes the normal return on capital from the average and capitalises only the balance of ₹1,20,000, whereas the average method capitalises the whole ₹4,80,000 — so it lands higher."
          },
          {
            id: 17, difficulty: "Medium",
            question: "A firm has an average profit of ₹1,80,000 and capital employed of ₹10,00,000. At a normal rate of return of 10% the super profit was ₹80,000. If the normal rate of return for the trade rises to 12%, the super profit will be:",
            options: ["₹60,000", "₹80,000", "₹20,000", "₹1,80,000"],
            answerIndex: 0,
            explanation: "Normal profit at 12% = 10,00,000 × 12% = ₹1,20,000, so super profit = 1,80,000 − 1,20,000 = ₹60,000 — it falls by ₹20,000 because the hurdle the firm must clear has risen from ₹1,00,000 to ₹1,20,000."
          },
          {
            id: 18, difficulty: "Hard",
            question: "Partners A and B contribute capitals of ₹6,00,000 and ₹4,00,000, the firm holds a General Reserve of ₹1,50,000 and 10% debentures of ₹2,50,000. Average profit is ₹2,00,000, normal rate of return 10%, years' purchase 4. Goodwill by the super profit method is:",
            options: ["₹3,40,000", "₹4,00,000", "₹2,40,000", "₹8,00,000"],
            answerIndex: 0,
            explanation: "Capital employed = 6,00,000 + 4,00,000 + 1,50,000 = ₹11,50,000 (debentures are a long-term liability and are not capital). Normal profit = 1,15,000; super profit = 2,00,000 − 1,15,000 = ₹85,000; goodwill = 85,000 × 4 = ₹3,40,000. Ignoring the reserve gives ₹4,00,000 and adding the debentures gives ₹2,40,000."
          },
          {
            id: 19, difficulty: "Easy",
            question: "In the capitalisation of super profit method, if the normal rate of return is doubled while the super profit itself stays unchanged, the goodwill valued by that method will:",
            options: ["Be halved", "Be doubled", "Stay the same", "Rise by half"],
            answerIndex: 0,
            explanation: "Goodwill = super profit ÷ NRR, so the rate sits in the denominator: ₹50,000 ÷ 10% = ₹5,00,000 becomes ₹50,000 ÷ 20% = ₹2,50,000 — exactly half."
          },
          {
            id: 20, difficulty: "Medium",
            question: "Profits of the last three years are ₹2,40,000, ₹2,70,000 and ₹3,30,000, but the last figure includes a non-recurring profit of ₹30,000 on the sale of old machinery. Goodwill at three years' purchase of average profit (after removing the non-recurring item) is:",
            options: ["₹8,10,000", "₹9,00,000", "₹7,20,000", "₹3,00,000"],
            answerIndex: 0,
            explanation: "Adjusted total = 2,40,000 + 2,70,000 + (3,30,000 − 30,000) = ₹8,10,000; average = 8,10,000 ÷ 3 = ₹2,70,000; goodwill = 2,70,000 × 3 = ₹8,10,000. Leaving the one-off gain in gives ₹9,00,000."
          },
          {
            id: 21, difficulty: "Hard",
            question: "Goodwill by the capitalisation of average profit method is ₹4,00,000, capital employed is ₹16,00,000 and the normal rate of return is 10%. The same firm values goodwill at two years' purchase of super profit. That valuation is:",
            options: ["₹80,000", "₹4,00,000", "₹2,00,000", "₹1,60,000"],
            answerIndex: 0,
            explanation: "Capitalised value = 4,00,000 + 16,00,000 = ₹20,00,000, so average profit = 20,00,000 × 10% = ₹2,00,000; normal profit = 16,00,000 × 10% = ₹1,60,000; super profit = ₹40,000; at two years' purchase goodwill = 40,000 × 2 = ₹80,000."
          },
          {
            id: 22, difficulty: "Easy",
            question: "The super profit method is preferred over the average profit method mainly because it:",
            options: ["Charges a normal return on the capital actually employed, so firms of different sizes can be compared", "Needs fewer years of profit data", "Never requires the years' purchase", "Can be applied without knowing the average profit"],
            answerIndex: 0,
            explanation: "The average method capitalises earnings regardless of how much capital produced them; the super profit method deducts capital employed × NRR first, so ₹2,00,000 earned on ₹10,00,000 is not valued like ₹2,00,000 earned on ₹20,00,000."
          },
          {
            id: 23, difficulty: "Hard",
            question: "A firm's average profit is ₹1,50,000 and capital employed is ₹10,00,000. Goodwill of ₹2,00,000 by the capitalisation of average profit method implies a normal rate of return of:",
            options: ["12.5%", "10%", "12%", "15%"],
            answerIndex: 0,
            explanation: "Capitalised value = 2,00,000 + 10,00,000 = ₹12,00,000, and the rate is what turns average profit into that value: 1,50,000 ÷ 12,00,000 = 0.125, i.e. 12.5%."
          },
          {
            id: 24, difficulty: "Medium",
            question: "Two firms in the same trade earn identical average profits of ₹2,00,000 and face the same normal rate of return of 10%, but firm A employs ₹12,00,000 and firm B employs ₹18,00,000. Both value goodwill at three years' purchase of super profit. The difference between their goodwill figures is:",
            options: ["₹1,80,000", "₹2,40,000", "₹60,000", "₹1,20,000"],
            answerIndex: 0,
            explanation: "A: normal 1,20,000, super 80,000 → goodwill 2,40,000. B: normal 1,80,000, super 20,000 → goodwill 60,000. Difference = 2,40,000 − 60,000 = ₹1,80,000 — the price of the extra capital B employs."
          },
          {
            id: 25, difficulty: "Hard",
            question: "Average profit ₹2,40,000, capital employed ₹15,00,000, normal rate of return 10%, years' purchase 3. Which method returns the HIGHEST goodwill and at what figure?",
            options: ["₹9,00,000, from either capitalisation method", "₹7,20,000, from the average profit method", "₹24,00,000, from the capitalisation of average profit method", "₹2,70,000, from the super profit method"],
            answerIndex: 0,
            explanation: "Average method: 2,40,000 × 3 = ₹7,20,000. Super profit method: (2,40,000 − 1,50,000) × 3 = ₹2,70,000. Capitalisation of super profit: 90,000 ÷ 0.10 = ₹9,00,000. Capitalisation of average profit: 24,00,000 − 15,00,000 = ₹9,00,000. The highest figure is therefore ₹9,00,000 from either capitalisation route."
          }
        ],

        /* ---- Interactive calc lab (engine strings copied verbatim
               from data-12a.js; only the case list grows) ---- */
        activity: {
          type: "calc",
          title: "Goodwill Valuation Bench",
          instruction: "Work each valuation the way you would in the exam — enter every figure the bench asks for. The working is revealed only when every figure in the problem is right.",
          problems: [
            {
              prompt: "A trading firm earned ₹2,10,000, ₹2,40,000, ₹2,70,000, ₹3,00,000 in the first four years of the last five and ran into a loss of ₹1,20,000 in the fifth. Value its goodwill at three years' purchase of average profit.",
              inputs: [
                { key: "avg", label: "Average profit (₹)", placeholder: "e.g. 180000" },
                { key: "gw", label: "Goodwill (₹)", placeholder: "e.g. 540000" }
              ],
              answers: { avg: 180000, gw: 540000 },
              formula: "Average = total of the five years ÷ 5 · Goodwill = Average × 3",
              working: "Total = 2,10,000 + 2,40,000 + 2,70,000 + 3,00,000 − 1,20,000 = ₹9,00,000. Average = 9,00,000 ÷ 5 = ₹1,80,000. Goodwill = 1,80,000 × 3 = <b>₹5,40,000</b>."
            },
            {
              prompt: "A firm shows an average profit of ₹2,40,000 on capital employed of ₹15,00,000. The normal rate of return in this line of business is 12%. Find normal profit, super profit and goodwill at four years' purchase of super profit.",
              inputs: [
                { key: "np", label: "Normal profit (₹)", placeholder: "e.g. 180000" },
                { key: "sp", label: "Super profit (₹)", placeholder: "e.g. 60000" },
                { key: "gw", label: "Goodwill (₹)", placeholder: "e.g. 240000" }
              ],
              answers: { np: 180000, sp: 60000, gw: 240000 },
              formula: "Normal = Capital × NRR · Super = Avg − Normal · GW = Super × n",
              working: "Normal profit = 15,00,000 × 12% = ₹1,80,000. Super profit = 2,40,000 − 1,80,000 = ₹60,000. Goodwill at four years' purchase = 60,000 × 4 = <b>₹2,40,000</b>."
            },
            {
              prompt: "On 1st April, 2026 C is admitted for one-fifth share in a firm and brings ₹2,00,000 as his capital for it. After the admission the revalued net assets of the firm stand at ₹8,00,000. Find the total value of the firm implied by C's capital and the hidden goodwill of the firm.",
              inputs: [
                { key: "tv", label: "Implied total value (₹)", placeholder: "e.g. 10000000" },
                { key: "gw", label: "Hidden goodwill (₹)", placeholder: "e.g. 2000000" }
              ],
              answers: { tv: 10000000, gw: 2000000 },
              formula: "Total value = Capital brought ÷ Share acquired · Goodwill = Total value − Net assets",
              working: "Value of the whole firm = 2,00,000 ÷ (1/5) = ₹10,00,000. Hidden goodwill = 10,00,000 − 8,00,000 = <b>₹2,00,000</b>, shared by the old partners in their old ratio."
            },
            {
              prompt: "The average profit of the last three years is reported as ₹2,70,000, but the last year's figure of ₹3,00,000 includes ₹60,000 of non-recurring profit on the sale of a fixed asset. Find the corrected average profit and the goodwill at three years' purchase.",
              inputs: [
                { key: "avg", label: "Corrected average profit (₹)", placeholder: "e.g. 250000" },
                { key: "gw", label: "Goodwill (₹)", placeholder: "e.g. 750000" }
              ],
              answers: { avg: 250000, gw: 750000 },
              formula: "Adjusted total ÷ 3 = average · Goodwill = Average × 3",
              working: "Reported total = 2,70,000 × 3 = ₹8,10,000; less the non-recurring ₹60,000 = ₹7,50,000. Corrected average = 7,50,000 ÷ 3 = ₹2,50,000. Goodwill = 2,50,000 × 3 = <b>₹7,50,000</b>."
            }
          ]
        },

        /* ---- Exam cases (existing id is 1) ---- */
        examCases: [
          {
            id: 2,
            title: "Two prices for one reputation",
            passage: "Neha is negotiating for a one-third share in a running food business. Its accounts show an average annual profit of ₹2,40,000 over the last three years, capital employed of ₹16,00,000, and a normal rate of return of 12% for the trade. The seller demands goodwill at four years' purchase of average profit, while Neha's adviser argues for the super profit route at the same four years' purchase.",
            difficulty: "Medium",
            subs: [
              {
                q: "What is the normal profit of the business?",
                options: ["₹1,92,000", "₹2,40,000", "₹48,000", "₹16,00,000"],
                answerIndex: 0,
                reasoning: "16,00,000 × 12% = ₹1,92,000 — the return the capital would earn with no goodwill at all."
              },
              {
                q: "What is the annual super profit?",
                options: ["₹48,000", "₹1,92,000", "₹2,40,000", "₹96,000"],
                answerIndex: 0,
                reasoning: "2,40,000 − 1,92,000 = ₹48,000 — the surplus above the normal return that the reputation produces."
              },
              {
                q: "What goodwill does the seller's method produce?",
                options: ["₹9,60,000", "₹4,80,000", "₹1,92,000", "₹2,40,000"],
                answerIndex: 0,
                reasoning: "Four years' purchase of average profit = 2,40,000 × 4 = ₹9,60,000, capitalising every rupee of average earnings."
              },
              {
                q: "What goodwill does the adviser's method produce?",
                options: ["₹1,92,000", "₹9,60,000", "₹48,000", "₹7,68,000"],
                answerIndex: 0,
                reasoning: "Four years' purchase of super profit = 48,000 × 4 = ₹1,92,000, capitalising only the earnings above normal."
              },
              {
                q: "By how far does the seller's demand exceed the adviser's figure?",
                options: ["₹7,68,000", "₹9,60,000", "₹1,92,000", "₹5,76,000"],
                answerIndex: 0,
                reasoning: "9,60,000 − 1,92,000 = ₹7,68,000 — the whole of the normal return for four years (1,92,000 × 4), which the seller's method wrongly capitalises as goodwill."
              }
            ]
          },
          {
            id: 3,
            title: "A goodwill figure the auditor rejected",
            passage: "Ravi shows goodwill as an asset in his firm's balance sheet every year, having valued it this year by the average profit method at ₹6,00,000 — average profit ₹2,00,000 and three years' purchase. The auditor's note records that the firm has never purchased any business, that capital employed in it is ₹25,00,000, and that the normal rate of return in this trade is 10%.",
            difficulty: "Hard",
            subs: [
              {
                q: "What is the firm's normal profit?",
                options: ["₹2,50,000", "₹2,00,000", "₹6,00,000", "₹50,000"],
                answerIndex: 0,
                reasoning: "25,00,000 × 10% = ₹2,50,000 — what the capital employed could earn without any reputation at all."
              },
              {
                q: "What super profit do Ravi's own figures imply?",
                options: ["A negative figure of ₹50,000, since average profit is below normal", "₹50,000", "₹2,50,000", "₹2,00,000"],
                answerIndex: 0,
                reasoning: "2,00,000 − 2,50,000 = −₹50,000 — the firm earns ₹50,000 a year LESS than the normal return on its capital."
              },
              {
                q: "What is the correct verdict on goodwill for this firm?",
                options: ["Nil — with no super profit there is nothing to pay for, so the ₹6,00,000 shown is wrong", "₹6,00,000, because the average profit method was applied correctly", "₹2,50,000", "₹50,000"],
                answerIndex: 0,
                reasoning: "Super profit is negative, so goodwill is nil; the ₹6,00,000 merely capitalises earnings that are below the normal rate."
              },
              {
                q: "If average profit were instead ₹3,50,000, what goodwill would the super profit method give at three years' purchase?",
                options: ["₹3,00,000", "₹10,50,000", "₹1,00,000", "₹2,50,000"],
                answerIndex: 0,
                reasoning: "Super profit = 3,50,000 − 2,50,000 = ₹1,00,000, and 1,00,000 × 3 = ₹3,00,000."
              }
            ]
          }
        ],

        /* ---- Short exam numericals (existing ids are 1–4) ---- */
        examNumericals: [
          {
            id: 5,
            q: "Average profit ₹2,25,000; capital employed ₹17,00,000; NRR 10%; goodwill at three years' purchase of super profit. Find goodwill (₹).",
            value: 165000,
            explanation: "Normal profit = 17,00,000 × 10% = ₹1,70,000; super profit = 2,25,000 − 1,70,000 = ₹55,000; 55,000 × 3 = ₹1,65,000.",
            difficulty: "Medium"
          },
          {
            id: 6,
            q: "Average profit ₹3,00,000; capital employed ₹18,00,000; NRR 12%. Find goodwill by the capitalisation of average profit method (₹).",
            value: 700000,
            explanation: "Capitalised value = 3,00,000 ÷ 0.12 = ₹25,00,000; less capital employed ₹18,00,000 → goodwill = ₹7,00,000.",
            difficulty: "Medium"
          },
          {
            id: 7,
            q: "A firm's super profit is ₹60,000 and its goodwill, valued at a certain number of years' purchase of super profit, is ₹3,60,000. Find the number of years' purchase.",
            value: 6,
            explanation: "Goodwill = super profit × years' purchase, so years' purchase = goodwill ÷ super profit = 3,60,000 ÷ 60,000 = 6 years' purchase.",
            difficulty: "Medium"
          }
        ]
      }
      ,

      psr: {

        /* ---- Practice Bank (merged with existing ids 1–10) ---- */
        numericals: [
          {
            id: 11, difficulty: "Easy",
            question: "A and B share profits 4:1. A gives one-fourth of his own share to B. The new profit-sharing ratio is:",
            options: ["3:2", "2:3", "3:1", "1:1"],
            answerIndex: 0,
            explanation: "A gives away 1/4 × 4/5 = 1/5. A: 4/5 − 1/5 = 3/5; B: 1/5 + 1/5 = 2/5. The new ratio is 3:2."
          },
          {
            id: 12, difficulty: "Easy",
            question: "The sacrificing ratio is needed at a change in profit-sharing ratio mainly to:",
            options: ["Find which partner must be compensated for goodwill and in what proportion", "Decide the new profit-sharing ratio", "Distribute the revaluation profit", "Distribute the General Reserve"],
            answerIndex: 0,
            explanation: "Compensation = firm's goodwill × each sacrificing partner's sacrifice, so the sacrifice of every partner has to be computed first — it decides both who pays and how much."
          },
          {
            id: 13, difficulty: "Medium",
            question: "A, B and C share profits 2:3:1 and revise to 1:2:1. The sacrificing and gaining positions are:",
            options: ["A sacrifices 1/12, C gains 1/12, B is unaffected", "All three partners sacrifice", "A and C sacrifice 1/12 each", "B gains 1/6 while A and C are unaffected"],
            answerIndex: 0,
            explanation: "In twelfths, old shares are A 4/12, B 6/12, C 2/12 and new shares are A 3/12, B 6/12, C 3/12. So A falls by 1/12 (sacrifice), B is unchanged and C rises by 1/12 (gain)."
          },
          {
            id: 14, difficulty: "Medium",
            question: "At the change of ratio machinery is revalued from ₹4,00,000 to ₹3,70,000, stock from ₹2,00,000 to ₹2,25,000 and outstanding wages rise from ₹30,000 to ₹45,000. The revaluation result is:",
            options: ["A loss of ₹20,000", "A profit of ₹20,000", "A loss of ₹45,000", "A profit of ₹5,000"],
            answerIndex: 0,
            explanation: "Falls: machinery ₹30,000 and wages ₹15,000 = ₹45,000; rise: stock ₹25,000. Net = 25,000 − 45,000 = a loss of ₹20,000, borne by the old partners in the OLD ratio — never by the gaining partner under the new ratio."
          },
          {
            id: 15, difficulty: "Hard",
            question: "A and B share profits 4:3 and revise to 2:1. The firm's goodwill is ₹4,20,000, to be settled through capital accounts. The correct entry is:",
            options: ["A's Capital A/c Dr ₹40,000 to B's Capital A/c ₹40,000", "B's Capital A/c Dr ₹40,000 to A's Capital A/c ₹40,000", "A's Capital A/c Dr ₹60,000 to B's Capital A/c ₹60,000", "Revaluation A/c Dr ₹40,000 to B's Capital A/c ₹40,000"],
            answerIndex: 0,
            explanation: "B: 3/7 − 1/3 = 9/21 − 7/21 = 2/21 sacrificed and A gains the same 2/21, so A pays 4,20,000 × 2/21 = ₹40,000 — debit the gaining partner A and credit the sacrificing partner B with ₹40,000."
          },
          {
            id: 16, difficulty: "Medium",
            question: "At reconstitution the firm has a General Reserve of ₹60,000, a Profit and Loss credit balance of ₹30,000 and an accumulated loss (debit balance) of ₹12,000. Old ratio is 3:2. The net amount credited to the first partner's account for these items is:",
            options: ["₹46,800", "₹54,000", "₹36,000", "₹18,000"],
            answerIndex: 0,
            explanation: "Net distributable balance = 60,000 + 30,000 − 12,000 = ₹78,000, shared in the old ratio: 78,000 × 3/5 = ₹46,800 (and ₹31,200 to the second partner). Ignoring the accumulated loss wrongly gives 90,000 × 3/5 = ₹54,000."
          },
          {
            id: 17, difficulty: "Easy",
            question: "Why does the gaining partner have to pay the sacrificing partner at a change in profit-sharing ratio?",
            options: ["Because the share of future profit surrendered has a price — the firm's valued goodwill", "Because the gaining partner has to buy fresh assets for the firm", "Because the revaluation profit is always shared that way", "Because the Indian Partnership Act, 1932 makes it compulsory in every case"],
            answerIndex: 0,
            explanation: "Goodwill is the value of past super earnings; whoever gives up a slice of the future profit stream is compensated by the receiver for the firm's goodwill × the sacrifice."
          },
          {
            id: 18, difficulty: "Medium",
            question: "A and B share profits 3:2. B surrenders one-third of her own share to A. The new ratio is:",
            options: ["11:4", "4:11", "11:3", "7:4"],
            answerIndex: 0,
            explanation: "B gives away 1/3 × 2/5 = 2/15. A: 3/5 + 2/15 = 9/15 + 2/15 = 11/15; B: 2/5 − 2/15 = 6/15 − 2/15 = 4/15. New ratio 11:4."
          },
          {
            id: 19, difficulty: "Hard",
            question: "A and B move from 3:2 to 2:3. The firm has a General Reserve of ₹90,000, a revaluation loss of ₹45,000 and goodwill valued at ₹1,50,000. B's net capital adjustment from all three settlements is a:",
            options: ["Debit of ₹12,000", "Credit of ₹12,000", "Credit of ₹6,000", "Debit of ₹30,000"],
            answerIndex: 0,
            explanation: "B: reserve credit 90,000 × 2/5 = ₹36,000; revaluation loss debit 45,000 × 2/5 = ₹18,000; B gains 1/5 (2/5 − 3/5 = −1/5 for A, so B is the gainer) and pays 1,50,000 × 1/5 = ₹30,000. Net = 36,000 − 18,000 − 30,000 = −₹12,000, a debit of ₹12,000."
          },
          {
            id: 20, difficulty: "Easy",
            question: "Which of these will NOT appear in a firm's revised balance sheet drawn immediately after a change in profit-sharing ratio?",
            options: ["General Reserve", "Machinery shown at its revalued amount", "Trade receivables shown at their revalued amount", "The partners' capital accounts as finally adjusted"],
            answerIndex: 0,
            explanation: "The General Reserve has already been distributed to the old partners in the old ratio, so it disappears from the statements — only revalued assets, liabilities and adjusted capitals survive."
          },
          {
            id: 21, difficulty: "Medium",
            question: "Revaluation profit of ₹36,000 was wrongly divided in the NEW ratio 5:4 instead of the old ratio 3:2. The first partner has been credited:",
            options: ["₹1,600 less than he should receive", "₹1,600 more than he should receive", "₹4,000 less than he should receive", "The same amount — both ratios give the same answer"],
            answerIndex: 0,
            explanation: "Correct share = 36,000 × 3/5 = ₹21,600; wrongly credited = 36,000 × 5/9 = ₹20,000. He is short by 21,600 − 20,000 = ₹1,600, and the second partner has been credited ₹1,600 too much."
          },
          {
            id: 22, difficulty: "Easy",
            question: "When a partner 'surrenders' a portion of his share, what actually happens?",
            options: ["He gives up part of his OWN share, which passes to the other partner(s)", "He takes a part of the other partner's share", "The firm writes off that part of the profit", "The ratio is changed without his consent"],
            answerIndex: 0,
            explanation: "Surrender means the partner hands over a fraction of his own share — say 1/4 of his 4/5 — and that portion is added to the receiving partner's share; the two shares still total one."
          },
          {
            id: 23, difficulty: "Hard",
            question: "X and Y move from 5:3 to 5:2 and the firm's goodwill is valued at ₹1,68,000. The compensation for goodwill is:",
            options: ["₹15,000, paid by X to Y", "₹15,000, paid by Y to X", "₹21,000, paid by X to Y", "₹30,000, paid by Y to X"],
            answerIndex: 0,
            explanation: "X: 5/8 − 5/7 = 35/56 − 40/56 = −5/56, i.e. X GAINS 5/56; Y: 3/8 − 2/7 = 21/56 − 16/56 = 5/56 sacrificed. Compensation = 1,68,000 × 5/56 = ₹15,000, paid by the gaining X to the sacrificing Y."
          },
          {
            id: 24, difficulty: "Medium",
            question: "If the partners change their ratio but quietly leave reserves, accumulated balances and revaluation untouched, the likely consequence is:",
            options: ["The gaining partner inherits a share of past profits and appreciation they did not earn", "The firm's goodwill is automatically doubled", "Nothing — the new ratio applies to past items as well", "The revaluation account is closed in the new ratio"],
            answerIndex: 0,
            explanation: "Everything accumulated belongs to the period the OLD ratio governed, so unless it is settled in the old ratio first, the partner who gains share takes a slice of history they had no hand in earning."
          },
          {
            id: 25, difficulty: "Hard",
            question: "A and B share profits 3:2 and revise to 1:1. Before the change the firm has a General Reserve of ₹1,50,000, a Profit and Loss credit balance of ₹60,000, a building carried at ₹5,00,000 revalued to ₹6,20,000, stock carried at ₹2,00,000 revalued to ₹1,70,000, and goodwill valued at ₹2,00,000. The total credited to A's capital account from ALL these settlements is:",
            options: ["₹2,00,000", "₹1,80,000", "₹1,60,000", "₹2,40,000"],
            answerIndex: 0,
            explanation: "A: General Reserve 1,50,000 × 3/5 = ₹90,000; Profit and Loss credit 60,000 × 3/5 = ₹36,000; revaluation profit (1,20,000 rise − 30,000 fall = ₹90,000) × 3/5 = ₹54,000; goodwill compensation — A sacrifices 3/5 − 1/2 = 1/10 → 2,00,000 × 1/10 = ₹20,000 received from B. Total = 90,000 + 36,000 + 54,000 + 20,000 = ₹2,00,000."
          }
        ],

        /* ---- Interactive calc lab (engine strings copied verbatim
               from data-12a.js; only the case list grows) ---- */
        activity: {
          type: "calc",
          title: "Sacrifice or Gain Bench",
          instruction: "Every problem here is a ratio-change worked the way the board expects: new ratio, sacrifice or gain, and the rupee compensation. Enter each figure; the bench checks them all before revealing the working.",
          problems: [
            {
              prompt: "A and B share profits 5:3 and from 1st April, 2026 they decide to share profits equally. The firm's goodwill is ₹2,40,000. Find A's sacrifice as a numerator over 8 and the compensation A receives from B.",
              inputs: [
                { key: "sf", label: "A's sacrifice (numerator / 8)", placeholder: "e.g. 1" },
                { key: "comp", label: "Compensation received (₹)", placeholder: "e.g. 30000" }
              ],
              answers: { sf: 1, comp: 30000 },
              formula: "Sacrifice = old − new · Compensation = Goodwill × sacrifice",
              working: "A: 5/8 − 1/2 = 5/8 − 4/8 = <b>1/8</b> sacrificed, and B gains the same 1/8. Compensation = 2,40,000 × 1/8 = <b>₹30,000</b>, paid by B to A."
            },
            {
              prompt: "A, B and C share profits 2:3:1 and revise them to 3:4:2. The firm's goodwill is ₹5,40,000. Find B's sacrifice as a numerator over 36 and the compensation B receives.",
              inputs: [
                { key: "sf", label: "B's sacrifice (numerator / 36)", placeholder: "e.g. 2" },
                { key: "comp", label: "Compensation received (₹)", placeholder: "e.g. 30000" }
              ],
              answers: { sf: 2, comp: 30000 },
              formula: "Write both ratios over 36 · Sacrifice = old − new",
              working: "Old in 36ths: A 12/36, B 18/36, C 6/36. New: A 12/36, B 16/36, C 8/36. B falls by <b>2/36</b> (A is unchanged, C gains 2/36). Compensation to B = 5,40,000 × 2/36 = <b>₹30,000</b>, paid by C."
            },
            {
              prompt: "At the change of ratio a building carried at ₹8,50,000 is revalued to ₹9,25,000, stock of ₹3,00,000 to ₹2,70,000, a liability of ₹1,20,000 becomes ₹1,32,000, and an unrecorded claim of ₹8,000 must now be provided. The old ratio is 3:1. Find the revaluation result and the second partner's share of it.",
              inputs: [
                { key: "result", label: "Revaluation profit (₹)", placeholder: "e.g. 25000" },
                { key: "share", label: "Second partner's share (₹)", placeholder: "e.g. 6250" }
              ],
              answers: { result: 25000, share: 6250 },
              formula: "Profit = rises − falls",
              working: "Rises: building +₹75,000. Falls: stock ₹30,000 + liability ₹12,000 + new claim ₹8,000 = ₹50,000. Revaluation profit = 75,000 − 50,000 = <b>₹25,000</b>, shared 3:1 → second partner 25,000 × 1/4 = <b>₹6,250</b>."
            },
            {
              prompt: "A and B move from 3:2 to 2:3. The firm holds a General Reserve of ₹1,50,000, its goodwill is ₹1,75,000, and the revaluation shows a profit of ₹60,000. Find B's total credit from the reserve and the revaluation, and the goodwill compensation B has to pay.",
              inputs: [
                { key: "credit", label: "B's credit — reserve + revaluation (₹)", placeholder: "e.g. 84000" },
                { key: "comp", label: "Compensation paid (₹)", placeholder: "e.g. 35000" }
              ],
              answers: { credit: 84000, comp: 35000 },
              formula: "Past items in the OLD ratio · Compensation = Goodwill × gain",
              working: "B's reserve share = 1,50,000 × 2/5 = ₹60,000 and revaluation share = 60,000 × 2/5 = ₹24,000 → total <b>₹84,000</b>. B gains 2/5 − 3/5, so he pays 1,75,000 × 1/5 = <b>₹35,000</b> to A, who sacrifices 1/5."
            }
          ]
        },

        /* ---- Exam cases (existing id is 1) ---- */
        examCases: [
          {
            id: 2,
            title: "Two sisters redraw the agreement",
            passage: "Meera and Sana run a boutique sharing profits 3:2, and from 1st April, 2026 they agree to share future profits equally. For the purpose the firm's goodwill is valued at ₹3,60,000. The balance sheet before the change shows a General Reserve of ₹75,000 and a Profit and Loss credit balance of ₹45,000. At revaluation the building rises from ₹6,00,000 to ₹6,45,000 and stock falls from ₹2,50,000 to ₹2,35,000.",
            difficulty: "Medium",
            subs: [
              {
                q: "In what proportion does Meera sacrifice?",
                options: ["1/10", "1/5", "1/20", "2/5"],
                answerIndex: 0,
                reasoning: "Meera: old 3/5 = 6/10 against new 1/2 = 5/10, so she sacrifices 6/10 − 5/10 = 1/10, which is exactly Sana's gain."
              },
              {
                q: "What goodwill compensation does Meera receive?",
                options: ["₹36,000", "₹18,000", "₹72,000", "₹3,600"],
                answerIndex: 0,
                reasoning: "3,60,000 × 1/10 = ₹36,000, paid by the gaining Sana to the sacrificing Meera."
              },
              {
                q: "How much of the accumulated profits is credited to Sana?",
                options: ["₹48,000", "₹72,000", "₹60,000", "₹24,000"],
                answerIndex: 0,
                reasoning: "Accumulated profits = 75,000 + 45,000 = ₹1,20,000, distributed in the OLD ratio 3:2 — Sana gets 1,20,000 × 2/5 = ₹48,000."
              },
              {
                q: "What is the profit or loss on revaluation?",
                options: ["Profit ₹30,000", "Loss ₹30,000", "Profit ₹45,000", "Nil"],
                answerIndex: 0,
                reasoning: "Building +₹45,000 and stock −₹15,000 give a revaluation profit of ₹30,000, shared 3:2 between Meera and Sana."
              },
              {
                q: "What is Meera's share of the revaluation profit?",
                options: ["₹18,000", "₹12,000", "₹30,000", "₹15,000"],
                answerIndex: 0,
                reasoning: "Revaluation profit always goes in the OLD ratio: 30,000 × 3/5 = ₹18,000 to Meera (and ₹12,000 to Sana)."
              }
            ]
          },
          {
            id: 3,
            title: "The ratio change nobody settled",
            passage: "Kabir closed the books for a change in profit-sharing ratio from 2:1 to 1:1 entirely on his own. He divided the revaluation profit of ₹72,000 in the new ratio 1:1, distributed the General Reserve of ₹90,000 in the new ratio as well, and passed no goodwill entry although the firm's goodwill was valued at ₹4,50,000. The auditor has asked for the corrections before the revised balance sheet is signed.",
            difficulty: "Hard",
            subs: [
              {
                q: "How much less has the first partner received towards revaluation profit?",
                options: ["₹12,000", "₹48,000", "₹36,000", "₹24,000"],
                answerIndex: 0,
                reasoning: "Correct share = 72,000 × 2/3 = ₹48,000, but the new ratio gave him only 72,000 × 1/2 = ₹36,000 — he is ₹12,000 short."
              },
              {
                q: "How much less has the first partner received on the General Reserve?",
                options: ["₹15,000", "₹60,000", "₹45,000", "₹30,000"],
                answerIndex: 0,
                reasoning: "Reserves belong to the old ratio: 90,000 × 2/3 = ₹60,000 against the ₹45,000 credited to him — a shortfall of ₹15,000."
              },
              {
                q: "What goodwill compensation did the first partner forgo?",
                options: ["₹75,000", "₹1,50,000", "₹2,25,000", "₹50,000"],
                answerIndex: 0,
                reasoning: "He sacrifices 2/3 − 1/2 = 1/6, and 4,50,000 × 1/6 = ₹75,000, which the gaining second partner should have paid him."
              },
              {
                q: "What total amount is now due to the first partner from these corrections?",
                options: ["₹1,02,000", "₹90,000", "₹1,08,000", "₹72,000"],
                answerIndex: 0,
                reasoning: "12,000 (revaluation) + 15,000 (reserve) + 75,000 (goodwill) = ₹1,02,000 payable to the first partner."
              }
            ]
          }
        ],

        /* ---- Short exam numericals (existing ids are 1 and 2) ---- */
        examNumericals: [
          {
            id: 3,
            q: "A and B move from 4:7 to 2:3 and the firm's goodwill of ₹1,65,000 is settled through the partners' capital accounts. Find the compensation paid (₹).",
            value: 6000,
            explanation: "B sacrifices 7/11 − 3/5 = 35/55 − 33/55 = 2/55 and A gains the same 2/55; 1,65,000 × 2/55 = ₹6,000, paid by the gaining A to the sacrificing B.",
            difficulty: "Hard"
          },
          {
            id: 4,
            q: "At a ratio change the building rises by ₹50,000, stock falls by ₹20,000 and a liability rises by ₹10,000. Old ratio 3:2. Find the first partner's share of the revaluation profit (₹).",
            value: 12000,
            explanation: "Revaluation profit = 50,000 − 20,000 − 10,000 = ₹20,000; first partner's share = 20,000 × 3/5 = ₹12,000.",
            difficulty: "Medium"
          },
          {
            id: 5,
            q: "X and Y move from 5:3 to 1:1 and the firm holds a General Reserve of ₹1,92,000. Find Y's share of the reserve (₹).",
            value: 72000,
            explanation: "The reserve belongs to the old agreement, so it is shared in the old ratio 5:3: 1,92,000 × 3/8 = ₹72,000 to Y (and ₹1,20,000 to X).",
            difficulty: "Medium"
          }
        ]
      }
    },

    /* ============ QUIZ (ids 70146–70175) ============ */
    quiz: [
      { id: 70146, chapter: "gw", difficulty: "Easy",
        q: "Which of these events does NOT make it necessary to value the firm's goodwill?",
        options: ["A partner advances a loan to the firm for the year", "Admission of a new partner", "Retirement of an existing partner", "Death of a partner"],
        answerIndex: 0,
        explanation: "Goodwill is valued at reconstitution — admission, retirement, death, sale or amalgamation — because those events change who owns the profit stream; a loan simply creates a liability and changes nothing about ownership." },
      { id: 70147, chapter: "gw", difficulty: "Easy",
        q: "The normal rate of return used in goodwill valuation means:",
        options: ["The return generally earned by capital in that line of business, which the firm must exceed before any goodwill arises", "The rate of interest the firm pays on its bank borrowings", "The rate of income-tax charged on the firm's profits", "The rate of return the partners personally need on their drawings"],
        answerIndex: 0,
        explanation: "It is the market rate for that trade — the hurdle a firm must clear before it earns anything above normal; only earnings above this rate create goodwill." },
      { id: 70148, chapter: "gw", difficulty: "Medium",
        q: "Which of the following goodwill valuation methods can be applied WITHOUT knowing the normal rate of return?",
        options: ["The average profit method", "The super profit method", "The capitalisation of super profit method", "The capitalisation of average profit method"],
        answerIndex: 0,
        explanation: "The average profit method simply multiplies average profit by the years' purchase; the other three all compute or capitalise the normal return, so each of them needs the rate." },
      { id: 70149, chapter: "gw", difficulty: "Medium",
        q: "A firm's balance sheet shows total assets of ₹30,00,000 (including cash at bank of ₹2,00,000) and long-term 12% debentures of ₹6,00,000. Its capital employed is:",
        options: ["₹24,00,000", "₹30,00,000", "₹28,00,000", "₹36,00,000"],
        answerIndex: 0,
        explanation: "Capital employed = total assets − long-term liabilities = 30,00,000 − 6,00,000 = ₹24,00,000. Cash already sits inside total assets, and the debentures are deducted, not added (adding them would wrongly give ₹36,00,000)." },
      { id: 70150, chapter: "gw", difficulty: "Medium",
        q: "A firm reports average profit ₹2,00,000, capital employed ₹15,00,000, NRR 10% and goodwill of ₹1,50,000 at three years' purchase of super profit. Which statement is TRUE?",
        options: ["The firm earns ₹50,000 a year above what its capital could earn at the normal rate", "The firm earns exactly the normal rate, so goodwill should be nil", "The firm's average profit is only ₹1,50,000", "Super profit equals the capital employed"],
        answerIndex: 0,
        explanation: "Normal profit = 15,00,000 × 10% = ₹1,50,000, so super profit = 2,00,000 − 1,50,000 = ₹50,000, and 50,000 × 3 = ₹1,50,000 confirms the goodwill figure." },
      { id: 70151, chapter: "gw", difficulty: "Hard",
        q: "Average profit ₹2,60,000, capital employed ₹25,00,000, NRR 8%. Goodwill by the capitalisation of super profit method is:",
        options: ["₹7,50,000", "₹60,000", "₹2,60,000", "₹25,00,000"],
        answerIndex: 0,
        explanation: "Normal profit = 25,00,000 × 8% = ₹2,00,000; super profit = 2,60,000 − 2,00,000 = ₹60,000; goodwill = 60,000 ÷ 0.08 = ₹7,50,000." },
      { id: 70152, chapter: "gw", difficulty: "Medium",
        q: "While computing capital employed a clerk deducted long-term liabilities twice from total assets. With average profit unchanged, the super profit shown will be:",
        options: ["Overstated, because normal profit is computed on an understated capital employed", "Understated, because capital employed should be larger", "Unaffected — capital employed enters only the capitalisation methods", "Unaffected, but the average profit will change"],
        answerIndex: 0,
        explanation: "Deducting twice pushes capital employed down, which cuts normal profit (capital × NRR) and leaves a bigger surplus: a smaller normal profit always inflates super profit." },
      { id: 70153, chapter: "gw", difficulty: "Easy",
        q: "Goodwill is described as a premium paid over the value of the firm's net assets because:",
        options: ["The buyer is paying for earning power beyond the tangible assets already counted", "It is a payment made to the partners as salary", "It is the market value of the firm's machinery", "It is a reserve created out of the year's profit"],
        answerIndex: 0,
        explanation: "Net assets are separately identifiable and valued; anything paid above them buys the reputation and future excess earnings — which is precisely what goodwill measures." },
      { id: 70154, chapter: "gw", difficulty: "Hard",
        q: "A firm's goodwill is ₹4,20,000 at three years' purchase of super profit, its capital employed is ₹12,00,000 and the NRR is 10%. The firm's average profit must be:",
        options: ["₹2,60,000", "₹1,40,000", "₹1,20,000", "₹4,20,000"],
        answerIndex: 0,
        explanation: "Super profit = 4,20,000 ÷ 3 = ₹1,40,000; normal profit = 12,00,000 × 10% = ₹1,20,000; average profit = 1,40,000 + 1,20,000 = ₹2,60,000." },
      { id: 70155, chapter: "gw", difficulty: "Medium",
        q: "Profits of the last three years are ₹1,90,000, ₹2,10,000 and ₹2,00,000; capital employed is ₹20,00,000 and the NRR is 10%. Goodwill at three years' purchase of super profit is:",
        options: ["₹0 — the firm earns only the normal return", "₹6,00,000", "₹2,00,000", "₹1,00,000"],
        answerIndex: 0,
        explanation: "Average = 6,00,000 ÷ 3 = ₹2,00,000 and normal profit = 20,00,000 × 10% = ₹2,00,000, so super profit = 2,00,000 − 2,00,000 = 0 and the goodwill is ₹0." },
      { id: 70156, chapter: "gw", difficulty: "Medium",
        q: "C is admitted into a firm for a one-fourth share and brings ₹1,50,000 as her capital for it. The revalued net assets of the firm stand at ₹5,40,000. The firm's hidden goodwill is:",
        options: ["₹60,000", "₹1,50,000", "₹5,40,000", "₹4,50,000"],
        answerIndex: 0,
        explanation: "C's capital implies a total firm value of 1,50,000 ÷ (1/4) = ₹6,00,000; hidden goodwill = 6,00,000 − 5,40,000 = ₹60,000." },
      { id: 70157, chapter: "gw", difficulty: "Hard",
        q: "Average profit ₹3,00,000, capital employed ₹20,00,000, NRR 12%, years' purchase 4. How much higher is the goodwill by the capitalisation of average profit method than by the super profit method?",
        options: ["₹2,60,000", "₹5,00,000", "₹2,40,000", "₹60,000"],
        answerIndex: 0,
        explanation: "Capitalisation of average profit = (3,00,000 ÷ 0.12) − 20,00,000 = 25,00,000 − 20,00,000 = ₹5,00,000. Super profit method: normal 2,40,000, super 60,000 × 4 = ₹2,40,000. Difference = 5,00,000 − 2,40,000 = ₹2,60,000." },
      { id: 70158, chapter: "gw", difficulty: "Easy",
        q: "The super profit method values goodwill on the firm's ability to:",
        options: ["Earn more than the normal return on the capital actually employed", "Borrow at a lower rate than its competitors", "Retain the whole of its profit in the business", "Hold its assets at historically low book values"],
        answerIndex: 0,
        explanation: "Super profit = average profit − (capital employed × NRR); goodwill exists only where the surplus over that normal return exists, and nothing else." },
      { id: 70159, chapter: "gw", difficulty: "Hard",
        q: "A firm has average profit of ₹2,00,000, capital employed of ₹10,00,000 and an NRR of 12%. The seller wants goodwill at five years' purchase of super profit and the buyer offers three years' purchase. The gap between the two demands is:",
        options: ["₹1,60,000", "₹4,00,000", "₹2,40,000", "₹80,000"],
        answerIndex: 0,
        explanation: "Normal profit = 10,00,000 × 12% = ₹1,20,000; super profit = 2,00,000 − 1,20,000 = ₹80,000. Seller: 80,000 × 5 = ₹4,00,000; buyer: 80,000 × 3 = ₹2,40,000; gap = 4,00,000 − 2,40,000 = ₹1,60,000." },
      { id: 70160, chapter: "gw", difficulty: "Easy",
        q: "Goodwill shown in a balance sheet (where it is admissible) is classified as:",
        options: ["An intangible fixed asset", "A current asset", "A fictitious asset", "A reserve against future losses"],
        answerIndex: 0,
        explanation: "Purchased goodwill is a long-term intangible asset; it is not fictitious — fictitious assets are write-offs such as preliminary expenses — and it is not a reserve, which sits on the liabilities side." },

      { id: 70161, chapter: "psr", difficulty: "Easy",
        q: "A partner's share falls from 2/5 to 1/4 when the ratio is revised. His sacrifice is:",
        options: ["3/20", "3/10", "1/20", "7/20"],
        answerIndex: 0,
        explanation: "Write both over 20: 2/5 = 8/20 and 1/4 = 5/20, so the fall is 8/20 − 5/20 = 3/20 sacrificed, and the other partner gains exactly 3/20." },
      { id: 70162, chapter: "psr", difficulty: "Easy",
        q: "When a partner surrenders a fixed fraction of his own share and no new ratio is stated, the surrendered portion is:",
        options: ["Given to the remaining partner(s), usually in their existing ratio", "Kept with the firm as a reserve", "Transferred to the revaluation account", "Divided equally among all the partners"],
        answerIndex: 0,
        explanation: "The surrendered slice simply moves to the other partners — in their old ratio unless the question says otherwise — and the recomputed shares must still total one." },
      { id: 70163, chapter: "psr", difficulty: "Medium",
        q: "P and Q share profits 5:3. Q surrenders one-fourth of her own share to P. The new ratio is:",
        options: ["23:3", "3:23", "23:8", "20:6"],
        answerIndex: 0,
        explanation: "Q gives away 1/4 × 3/8 = 3/32. P: 5/8 = 20/32 + 3/32 = 23/32; Q: 6/32 − 3/32 = 3/32. The new ratio is 23:3." },
      { id: 70164, chapter: "psr", difficulty: "Medium",
        q: "An Investments Fluctuation Fund of ₹25,000 exists and the market value of the investments has not changed. At the change in profit-sharing ratio the fund is:",
        options: ["Distributed to the old partners in the old ratio, because there is no revaluation loss to absorb it", "Transferred to the revaluation account", "Carried forward into the new agreement", "Written off against the investments"],
        answerIndex: 0,
        explanation: "With market value unchanged the fund has nothing left to cover, so it is an accumulated profit of the old agreement — 25,000 is shared in the OLD ratio and never carried forward." },
      { id: 70165, chapter: "psr", difficulty: "Medium",
        q: "A and B move from 1:2 to 1:1 and the firm's goodwill is valued at ₹3,60,000. The goodwill compensation is:",
        options: ["₹60,000, paid by A to B", "₹60,000, paid by B to A", "₹1,80,000, paid by A to B", "₹30,000, paid by B to A"],
        answerIndex: 0,
        explanation: "A: 1/3 − 1/2 = 2/6 − 3/6 = −1/6, so A GAINS 1/6 while B sacrifices 1/6. Compensation = 3,60,000 × 1/6 = ₹60,000, paid by the gaining A to the sacrificing B." },
      { id: 70166, chapter: "psr", difficulty: "Easy",
        q: "The revised balance sheet of a firm is prepared:",
        options: ["Immediately after the change in ratio, at revalued figures with reserves already distributed", "Before the old profit-sharing ratio comes to an end", "Only when the firm is dissolved", "At the end of every accounting year as usual"],
        answerIndex: 0,
        explanation: "Reconstitution triggers it at once: assets and liabilities at revalued amounts, no reserves or revaluation account left, and capitals adjusted for compensation." },
      { id: 70167, chapter: "psr", difficulty: "Medium",
        q: "General Reserve of ₹72,000 is to be distributed when A and B (old ratio 3:1) change their profit-sharing ratio. The entry is:",
        options: ["General Reserve A/c Dr ₹72,000 to A's Capital A/c ₹54,000 and B's Capital A/c ₹18,000", "Revaluation A/c Dr ₹72,000 to General Reserve A/c ₹72,000", "A's Capital A/c Dr ₹54,000 to B's Capital A/c ₹18,000", "Profit and Loss A/c Dr ₹72,000 to General Reserve A/c ₹72,000"],
        answerIndex: 0,
        explanation: "The reserve is an accumulated profit of the old agreement, so it is debited to General Reserve and credited to the partners in the OLD ratio 3:1 — 72,000 × 3/4 = ₹54,000 to A and ₹18,000 to B." },
      { id: 70168, chapter: "psr", difficulty: "Hard",
        q: "A and B move from 2:1 to 3:2 and the firm's goodwill is ₹1,80,000. A student wrongly shared the entire goodwill between the old partners in the OLD ratio. The excess credited to A is:",
        options: ["₹1,08,000", "₹1,20,000", "₹12,000", "₹60,000"],
        answerIndex: 0,
        explanation: "Correct treatment: A sacrifices 2/3 − 3/5 = 10/15 − 9/15 = 1/15, so he should receive 1,80,000 × 1/15 = ₹12,000 from B. The student gave him 1,80,000 × 2/3 = ₹1,20,000, an excess of 1,20,000 − 12,000 = ₹1,08,000." },
      { id: 70169, chapter: "psr", difficulty: "Medium",
        q: "Which of the following is NOT settled at the time of a change in profit-sharing ratio?",
        options: ["A partner's salary for the year that is yet to come", "The General Reserve", "The profit or loss on revaluation", "The goodwill compensation between partners"],
        answerIndex: 0,
        explanation: "Reserves, revaluation and goodwill compensation are all past effects of the old agreement and are closed at reconstitution, whereas a salary for the FUTURE year belongs to the new agreement and falls due when it is earned." },
      { id: 70170, chapter: "psr", difficulty: "Hard",
        q: "A, B and C share profits 1:2:3 and revise them to 3:4:5. The sacrificing and gaining positions are:",
        options: ["Only C sacrifices 1/12 and A gains 1/12, while B is unaffected", "All three partners sacrifice", "B sacrifices 1/12 while A and C gain", "A and B gain equally and C gains nothing"],
        answerIndex: 0,
        explanation: "In twelfths old = 2/12, 4/12, 6/12 and new = 3/12, 4/12, 5/12. So A rises by 1/12 (gain), B stays at 4/12 (no change) and C falls by 1/12 (sacrifice)." },
      { id: 70171, chapter: "psr", difficulty: "Easy",
        q: "If neither partner's share changes on reconstitution — the old and new ratios are the same — the goodwill compensation will be:",
        options: ["Nil, because no partner sacrifices anything", "Equal to the whole of the firm's goodwill", "Half of the firm's goodwill", "Payable all the same in cash"],
        answerIndex: 0,
        explanation: "Compensation = firm's goodwill × sacrifice; with sacrifice 0/5 − 0 = 0 for every partner, the amount works out to nil however large the goodwill is." },
      { id: 70172, chapter: "psr", difficulty: "Medium",
        q: "A and B share profits 7:5 and revise them to 11:9. The firm's goodwill is ₹2,70,000. The compensation is:",
        options: ["₹9,000, paid by B to A", "₹9,000, paid by A to B", "₹45,000, paid by B to A", "₹5,400, paid by A to B"],
        answerIndex: 0,
        explanation: "A: 7/12 − 11/20 = 35/60 − 33/60 = 2/60 = 1/30 sacrificed, and B gains 1/30. Compensation = 2,70,000 × 1/30 = ₹9,000, paid by B to A." },
      { id: 70173, chapter: "psr", difficulty: "Easy",
        q: "Which account is opened to restate every asset and liability to its current value when the profit-sharing ratio changes?",
        options: ["Revaluation Account — a nominal account", "Profit and Loss Appropriation Account", "Goodwill Account", "Partners' Loan Account"],
        answerIndex: 0,
        explanation: "The Revaluation Account is nominal: debits for falls in assets and rises in liabilities, credits for the reverse, and its balance goes to the old partners in the old ratio." },
      { id: 70174, chapter: "psr", difficulty: "Hard",
        q: "A, B and C share profits 2:3:1. A surrenders one-fourth of his share to B and C surrenders one-third of her share to A. The new ratio (A:B:C) is:",
        options: ["11:21:4", "9:21:4", "14:18:4", "5:27:4"],
        answerIndex: 0,
        explanation: "A gives away 1/4 × 2/6 = 1/12 of the total to B and receives 1/3 × 1/6 = 1/18 from C. Over 36: A 12/36 − 3/36 + 2/36 = 11/36, B 18/36 + 3/36 = 21/36, C 6/36 − 2/36 = 4/36 → 11:21:4. Reading A's share as 9/36 forgets the 1/18 he collects from C." },
      { id: 70175, chapter: "psr", difficulty: "Hard",
        q: "X and Y move from 5:3 to 5:4 and the firm's goodwill is ₹2,88,000. Which sequence is correct?",
        options: ["X sacrifices 5/72 and Y pays X ₹20,000", "X gains 5/72 and X pays Y ₹20,000", "Y sacrifices 5/72 and X pays Y ₹20,000", "X sacrifices 5/72 and Y pays X ₹25,000"],
        answerIndex: 0,
        explanation: "X: 5/8 − 5/9 = 45/72 − 40/72 = 5/72 sacrificed; Y: 3/8 − 4/9 = 27/72 − 32/72 = −5/72, a gain of 5/72. Compensation = 2,88,000 × 5/72 = ₹20,000, paid by the gaining Y to X." }
    ],

    /* ============ FLASHCARDS (ids 71117–71140) ============ */
    flashcards: [
      { id: 71117, chapter: "gw", front: "What does a super profit of zero tell you?", back: "The firm is earning exactly the normal return on its capital — capital could do as well elsewhere, so there is no goodwill to pay for." },
      { id: 71118, chapter: "gw", front: "Which goodwill method never needs the normal rate of return?", back: "The average profit method: average profit × years' purchase. The super profit and both capitalisation methods all need the NRR." },
      { id: 71119, chapter: "gw", front: "Why is goodwill valued only when a partnership is reconstituted?", back: "Because admission, retirement, death, sale or amalgamation changes who owns the future profit stream — one valuation at that moment settles who is paid for the reputation built so far." },
      { id: 71120, chapter: "gw", front: "Name the standard factors that build a firm's goodwill.", back: "Favourable location, quality of products or services, efficient and experienced management, a loyal customer base, monopoly or restricted entry, and a record of above-normal returns." },
      { id: 71121, chapter: "gw", front: "What happens to goodwill when the normal rate of return rises, other things equal?", back: "It falls twice over: a higher rate raises normal profit, cutting super profit, and the capitalisation methods divide that smaller super profit by a larger rate." },
      { id: 71122, chapter: "gw", front: "Can super profit be found without the average profit of the years considered?", back: "No — super profit = average profit − (capital employed × NRR), so averaging the years given (after removing abnormal items) comes first." },
      { id: 71123, chapter: "gw", front: "What if average profit is BELOW normal profit?", back: "Super profit is negative, so there is no goodwill — the firm earns less than capital could earn at the normal rate, and a buyer pays nothing extra." },
      { id: 71124, chapter: "gw", front: "What data does the average profit method require?", back: "The profits of the years chosen (adjusted for any abnormal item flagged), their average, and the years' purchase. No NRR, no capital employed." },
      { id: 71125, chapter: "gw", front: "Which method tells apart two firms with equal average profits but different capital?", back: "The super profit method (and the capitalisation methods): each charges the normal return on capital actually employed, while the average profit method ignores capital size." },
      { id: 71126, chapter: "gw", front: "What is 'hidden goodwill' and how is it computed?", back: "Goodwill implied by what a new partner pays: value the firm from the share bought (capital ÷ share), subtract the revalued net assets, and the balance is the hidden goodwill." },
      { id: 71127, chapter: "gw", front: "Goodwill at 4 years' purchase when average profit is ₹1,50,000?", back: "₹6,00,000 — 1,50,000 × 4. The multiplier converts one year's surplus into the price of that many past years." },
      { id: 71128, chapter: "gw", front: "What happens to goodwill if the years' purchase is doubled?", back: "It doubles under the average profit and super profit methods; the capitalisation methods never use years' purchase, so their figure does not move." },

      { id: 71129, chapter: "psr", front: "What is the first working in any ratio-change problem?", back: "Sacrifice and gain: write old and new shares over a common denominator, then old − new for every partner. Everything else follows from it." },
      { id: 71130, chapter: "psr", front: "Where does a surrendered portion of share go?", back: "To the other partner(s) — usually in their existing ratio — and the recomputed shares must still total one." },
      { id: 71131, chapter: "psr", front: "What must be true before any rupee moves at reconstitution?", back: "All sacrifices and gains must net to zero — one partner's surrender is necessarily another's pickup." },
      { id: 71132, chapter: "psr", front: "Formula for goodwill compensation at a ratio change?", back: "Firm's goodwill × the sacrificing partner's sacrifice fraction, paid by the gaining partner and adjusted through the capital accounts." },
      { id: 71133, chapter: "psr", front: "Treatment of accumulated losses at a change in ratio?", back: "Debited to the old partners in the OLD ratio — past losses belong to the old agreement exactly like past profits." },
      { id: 71134, chapter: "psr", front: "Which items go into the Revaluation Account?", back: "Debit falls in asset values and rises in liabilities; credit rises in assets and falls in liabilities. Cash and bank are never revalued." },
      { id: 71135, chapter: "psr", front: "Which ratio settles the past, and which prices the future?", back: "The OLD ratio settles the past (reserves, accumulated balances, revaluation); sacrifice and gain price the future (goodwill compensation)." },
      { id: 71136, chapter: "psr", front: "Formula for a new share when a partner surrenders a fraction of his share?", back: "New share = old share − (surrender fraction × old share); the part given away is added to the receiving partner." },
      { id: 71137, chapter: "psr", front: "What does the gaining partner actually buy?", back: "A slice of future profit that others surrendered — which is exactly why they are paid for their share of the firm's goodwill." },
      { id: 71138, chapter: "psr", front: "Why can reserves not be left undistributed at reconstitution?", back: "Otherwise the gaining partner would inherit a share of past accumulated profits they never helped earn — so every reserve and balance is closed in the old ratio first." },
      { id: 71139, chapter: "psr", front: "Give the sacrifice when 5:3 becomes 1:1.", back: "First partner: 5/8 − 4/8 = 1/8 sacrificed; the second partner gains exactly the same 1/8." },
      { id: 71140, chapter: "psr", front: "Which balances disappear from the revised balance sheet?", back: "General Reserve, profit-and-loss credits, accumulated losses and the revaluation account — all closed into partners' capital before the new ratio starts." }
    ],

    /* ============ IMPORTANT QUESTIONS (existing count: 7 each) ============ */
    importantQuestions: {
      gw: [
        { type: "Short Answer", marks: 3,
          q: "Two firms in the same trade earn identical average profits of ₹2,00,000, but firm A employs capital of ₹8,00,000 and firm B employs ₹15,00,000. With a normal rate of return of 10%, explain why their goodwill differs and value each at three years' purchase of super profit.",
          answer: "Goodwill rests on earnings ABOVE the normal return, and the normal return depends on the capital actually employed. Firm A: normal profit = 8,00,000 × 10% = ₹80,000, super profit = 2,00,000 − 80,000 = ₹1,20,000, goodwill = 1,20,000 × 3 = ₹3,60,000. Firm B: normal profit = 15,00,000 × 10% = ₹1,50,000, super profit = 2,00,000 − 1,50,000 = ₹50,000, goodwill = 50,000 × 3 = ₹1,50,000. B earns the same average profit but on nearly twice the capital, so only ₹50,000 a year is surplus — its goodwill is therefore ₹2,10,000 lower than A's." },
        { type: "Short Answer", marks: 3,
          q: "Profits of the last four years of a firm are ₹3,00,000, ₹2,40,000, ₹1,80,000 and a loss of ₹60,000 in the most recent year. Value the goodwill at three years' purchase of average profit.",
          answer: "The loss must be set off against the profits of the same period, because the average method averages what the business actually earned: 3,00,000 + 2,40,000 + 1,80,000 − 60,000 = ₹6,60,000. Average profit = 6,60,000 ÷ 4 = ₹1,65,000. Goodwill = 1,65,000 × 3 = ₹4,95,000. Had the loss year been ignored, the average would have been 7,20,000 ÷ 3 = ₹2,40,000 and the goodwill would have been wrongly reported as ₹7,20,000." },
        { type: "Short Answer", marks: 3,
          q: "A firm has an average profit of ₹3,00,000, capital employed of ₹15,00,000 and a normal rate of return of 12%. Compute its goodwill by the capitalisation of average profit method.",
          answer: "Capitalised value of the firm = average profit ÷ NRR = 3,00,000 ÷ 0.12 = ₹25,00,000 — the total capital that would be needed to earn ₹3,00,000 at 12%. Since capital actually employed is only ₹15,00,000, the excess represents the value of the above-normal earnings: goodwill = 25,00,000 − 15,00,000 = ₹10,00,000. The same figure is obtained by the other capitalisation route, which confirms the answer." },
        { type: "Long Answer", marks: 6,
          q: "A firm reports an average profit of ₹3,60,000, capital employed of ₹24,00,000, a normal rate of return of 10% and years' purchase of 3. Value the goodwill (a) by the average profit method, (b) by the super profit method, (c) by the capitalisation of super profit and (d) by the capitalisation of average profit, and comment on the results.",
          answer: "(a) Average profit method = 3,60,000 × 3 = ₹10,80,000 — it capitalises all earnings and ignores the size of capital. (b) Normal profit = 24,00,000 × 10% = ₹2,40,000; super profit = 3,60,000 − 2,40,000 = ₹1,20,000; goodwill = 1,20,000 × 3 = ₹3,60,000. (c) Capitalisation of super profit = 1,20,000 ÷ 0.10 = ₹12,00,000. (d) Capitalisation of average profit = (3,60,000 ÷ 0.10) − 24,00,000 = 36,00,000 − 24,00,000 = ₹12,00,000. Comment: the two capitalisation routes agree exactly because the formulas are algebraically the same; the super profit method gives only ₹3,60,000 because three years' purchase capitalises far less than perpetual capitalisation at 10%, and the average profit method gives the highest figure of ₹10,80,000 because it never charges a normal return on the ₹24,00,000 of capital." },
        { type: "Long Answer", marks: 6,
          q: "A and B share profits 3:2. C is admitted for a one-sixth share and brings ₹3,00,000 as capital for it. After revaluation the firm's net assets stand at ₹15,00,000. Compute the firm's goodwill by the implied-value (hidden goodwill) method and show how C's share of it is compensated to the old partners.",
          answer: "C's capital of ₹3,00,000 buys one-sixth of the firm, so the total value implied for the whole business = 3,00,000 ÷ (1/6) = ₹18,00,000. Net assets after revaluation are only ₹15,00,000, so hidden goodwill = 18,00,000 − 15,00,000 = ₹3,00,000. C takes one-sixth of it = 3,00,000 × 1/6 = ₹50,000, which she must pay to the old partners for the share of past reputation she acquires. Since the old ratio is 3:2 the amount is shared as A ₹30,000 and B ₹20,000. The entry is C's Capital A/c Dr ₹50,000 to A's Capital A/c ₹30,000 and to B's Capital A/c ₹20,000 — no goodwill asset is raised in the books (AS-26), because this is self-generated goodwill being settled between the partners." },
        { type: "Case-Based", marks: 6,
          q: "Arav & Co. value goodwill on 1st April, 2026. The partners are told the average profit of the last four years is ₹3,50,000, but the second year's figure of ₹3,00,000 includes ₹40,000 of non-recurring profit on the sale of an old fixed asset. Capital employed is ₹22,00,000, the NRR is 10% and years' purchase is 3. (a) Compute the corrected average profit. (b) Value goodwill by the average profit method. (c) Value goodwill by the super profit method.",
          answer: "(a) Reported total = 3,50,000 × 4 = ₹14,00,000; remove the non-recurring gain: 14,00,000 − 40,000 = ₹13,60,000; corrected average = 13,60,000 ÷ 4 = ₹3,40,000. (b) Average profit method = 3,40,000 × 3 = ₹10,20,000. (c) Super profit method: normal profit = 22,00,000 × 10% = ₹2,20,000; super profit = 3,40,000 − 2,20,000 = ₹1,20,000; goodwill = 1,20,000 × 3 = ₹3,60,000. The average profit method gives ₹10,20,000 because it capitalises the whole corrected average, while the super profit method capitalises only the ₹1,20,000 a year earned above the normal return on capital." },
        { type: "Case-Based", marks: 4,
          q: "An extract from a firm's accounts shows an average profit of ₹2,00,000, capital employed of ₹14,00,000, a normal rate of return of 12% and years' purchase of 4. (a) Compute the normal profit. (b) Compute the super profit. (c) Value the goodwill by the super profit method.",
          answer: "(a) Normal profit = 14,00,000 × 12% = ₹1,68,000. (b) Super profit = average profit − normal profit = 2,00,000 − 1,68,000 = ₹32,000. (c) Goodwill = super profit × years' purchase = 32,000 × 4 = ₹1,28,000. The small super profit shows how a high normal rate of return on a large capital leaves only a thin surplus — and therefore a modest goodwill — even when average profits look healthy." },
        { type: "Assertion-Reason", marks: 4,
          q: "Assertion (A): The average profit method is not a suitable basis for valuing goodwill when the capital employed in the business has changed significantly over the years being averaged. Reason (R): That method capitalises the whole of the average earnings without charging any normal return on the capital employed, so it treats a small-capital year and a large-capital year alike. Choose the correct option: (a) both A and R are true and R is the correct explanation of A, (b) both A and R are true but R is not the correct explanation of A, (c) A is false but R is true, (d) A is true but R is false.",
          answer: "Option (a) is correct: both statements are true and R explains A. The average profit method simply adds up the profits of the chosen years and divides by the number of years — it never asks how much capital produced those profits. When capital has grown sharply, the earlier years' profits were earned on a much smaller investment, and averaging them with later profits mixes incomparable years and overstates the surplus a buyer is paying for. It is precisely BECAUSE no normal return is charged on capital (R) that the method becomes unreliable in that situation, which is why the super profit or capitalisation methods, which normalise for capital employed, are preferred there." }
      ],
      psr: [
        { type: "Short Answer", marks: 3,
          q: "A and B share profits 4:3. A surrenders one-fourth of his own share to B. Compute the new profit-sharing ratio and the sacrificing ratio.",
          answer: "A gives away 1/4 × 4/7 = 1/7. New shares: A = 4/7 − 1/7 = 3/7; B = 3/7 + 1/7 = 4/7, so the new profit-sharing ratio is 3:4. Sacrificing ratio = old − new: A = 4/7 − 3/7 = 1/7 sacrificed. Gaining ratio = new − old: B = 4/7 − 3/7 = 1/7 gained. Hence the sacrificing ratio is A : B = 1 : 0 and the gaining ratio is 0 : 1 — B must compensate A out of goodwill in that proportion." },
        { type: "Short Answer", marks: 3,
          q: "State how each of the following is settled when the profit-sharing ratio is changed: (i) an Investments Fluctuation Fund of ₹25,000 when the market value of investments has not fallen, (ii) an accumulated loss shown as a debit balance of ₹12,000, (iii) a profit of ₹30,000 on revaluation.",
          answer: "(i) With no fall in market value the fund has nothing left to absorb, so it is an accumulated profit and is credited to the old partners in the OLD ratio. (ii) The accumulated loss belongs to the old agreement and is debited to the old partners in the OLD ratio — past losses are borne exactly like past profits. (iii) The revaluation profit is transferred to the old partners' capital accounts in the OLD ratio, because the appreciation accrued while the old ratio governed. Nothing accumulative survives into the new agreement." },
        { type: "Short Answer", marks: 3,
          q: "Why is the goodwill compensation on a change in profit-sharing ratio adjusted through the partners' capital accounts instead of being paid in cash?",
          answer: "The goodwill of an existing partnership is self-generated goodwill, which AS-26 does not allow to be recognised as an asset — so no Goodwill Account can be raised in the books. The payment is therefore settled as a capital adjustment: the gaining partner's capital account is debited and the sacrificing partner's capital account credited with firm's goodwill × sacrifice. Cash is used only if the partners expressly agree that the gaining partner will bring in cash, and even then the firm records no goodwill asset." },
        { type: "Long Answer", marks: 6,
          q: "A and B share profits 2:1 and revise them to 3:5. The firm has a General Reserve of ₹1,50,000, a Profit and Loss credit balance of ₹60,000, machinery carried at ₹8,00,000 revalued to ₹8,75,000, stock carried at ₹3,00,000 revalued to ₹2,85,000, and goodwill valued at ₹4,80,000. Show all the settlements and give the net effect on B's capital account.",
          answer: "Step 1 — sacrifice/gain: A 2/3 − 3/8 = 16/24 − 9/24 = 7/24 sacrificed; B 1/3 − 5/8 = 8/24 − 15/24, i.e. B GAINS 7/24. Step 2 — goodwill compensation: B pays A 4,80,000 × 7/24 = ₹1,40,000 (entry: B's Capital A/c Dr 1,40,000 to A's Capital A/c 1,40,000). Step 3 — revaluation: rise in machinery ₹75,000 less fall in stock ₹15,000 = profit of ₹60,000, shared in the OLD ratio 2:1 → A ₹40,000, B ₹20,000. Step 4 — accumulated balances in the OLD ratio: General Reserve 1,50,000 → A ₹1,00,000, B ₹50,000; Profit and Loss credit 60,000 → A ₹40,000, B ₹20,000. Effect on B: +50,000 reserve +20,000 P&L +20,000 revaluation −1,40,000 goodwill = a net DEBIT of ₹50,000, since the future share he bought costs more than the past accretions he receives. A is credited 1,00,000 + 40,000 + 40,000 + 1,40,000 = ₹3,20,000, and 3,20,000 − 50,000 = ₹2,70,000 = accumulated profits 2,10,000 + revaluation profit 60,000 ✓." },
        { type: "Long Answer", marks: 6,
          q: "With an old ratio of 3:2 and a new ratio of 1:1, a firm's balance sheet before reconstitution shows Building ₹8,00,000, Machinery ₹5,00,000, Stock ₹2,00,000, Cash ₹1,00,000, Creditors ₹1,50,000, General Reserve ₹1,50,000 and Capitals — A ₹7,00,000, B ₹6,00,000. Building is revalued to ₹9,00,000 and machinery to ₹4,60,000. Prepare the revised balance sheet and give the adjusted capitals.",
          answer: "Revaluation: building +₹1,00,000, machinery −₹40,000 → profit of ₹60,000, shared in the old ratio 3:2 → A ₹36,000, B ₹24,000. General Reserve of ₹1,50,000 also goes in the old ratio → A ₹90,000, B ₹60,000. Adjusted capitals: A = 7,00,000 + 36,000 + 90,000 = ₹8,26,000; B = 6,00,000 + 24,000 + 60,000 = ₹6,84,000. Revised balance sheet: assets — Building ₹9,00,000, Machinery ₹4,60,000, Stock ₹2,00,000, Cash ₹1,00,000 (total ₹16,60,000); liabilities — Creditors ₹1,50,000, A's Capital ₹8,26,000, B's Capital ₹6,84,000 (total ₹16,60,000) ✓. The General Reserve and the revaluation account have both disappeared, every asset stands at its revalued figure, and the new ratio 1:1 will govern future profits only." },
        { type: "Case-Based", marks: 6,
          q: "Rhea and Tara share profits 5:3 and from 1st April, 2026 decide to share equally. At that date the firm has a General Reserve of ₹1,60,000, a Profit and Loss debit balance of ₹40,000, machinery carried at ₹7,20,000 revalued to ₹8,00,000, and goodwill valued at ₹3,20,000. (a) Compute the sacrificing and gaining ratios. (b) Compute the goodwill compensation. (c) Give the revaluation profit and Rhea's share of it. (d) Give Rhea's net credit from the reserve and the accumulated loss together.",
          answer: "(a) Rhea: 5/8 − 1/2 = 5/8 − 4/8 = 1/8 sacrificed; Tara: 1/2 − 3/8 = 1/8 gained. Sacrificing ratio 1:0, gaining ratio 0:1. (b) Compensation = 3,20,000 × 1/8 = ₹40,000, paid by the gaining Tara to the sacrificing Rhea — entry: Tara's Capital A/c Dr 40,000 to Rhea's Capital A/c 40,000. (c) Revaluation: machinery rises by ₹80,000, so the profit is ₹80,000, shared in the OLD ratio 5:3 → Rhea 80,000 × 5/8 = ₹50,000, Tara ₹30,000. (d) Net accumulated balance = 1,60,000 reserve − 40,000 accumulated loss = ₹1,20,000 in the old ratio → Rhea 1,20,000 × 5/8 = ₹75,000 (Tara ₹45,000)." },
        { type: "Case-Based", marks: 4,
          q: "Extract of the Revaluation Account prepared on a change in ratio (P and Q, old ratio 2:1): debit side — To Machinery (decrease) ₹18,000; credit side — By Building (increase) ₹30,000 and By Provision for warranty claims no longer required ₹6,000. (a) What is the profit on revaluation? (b) How much of it is credited to P? (c) State the ratio in which this profit is divided.",
          answer: "(a) Credit side total = 30,000 + 6,000 = ₹36,000; debit side = ₹18,000; profit on revaluation = 36,000 − 18,000 = ₹18,000. (b) P's share = 18,000 × 2/3 = ₹12,000 (Q receives ₹6,000). (c) It is divided in the OLD ratio 2:1 — never in the new ratio — because the appreciation of the building and the release of the provision accumulated under the old agreement." },
        { type: "Assertion-Reason", marks: 4,
          q: "Assertion (A): When partners change their profit-sharing ratio, the General Reserve must be distributed to the existing partners even though the firm itself continues without any interruption. Reason (R): A reserve is an accumulated profit earned under the old agreement; if it is left standing, the gaining partner will share profits that were earned before they were entitled to them. Choose the correct option: (a) both A and R are true and R is the correct explanation of A, (b) both A and R are true but R is not the correct explanation of A, (c) A is false but R is true, (d) A is true but R is false.",
          answer: "Option (a) is correct: both statements are true and R explains A. The firm's legal existence is unaffected by a change in ratio, so nobody argues that the business stops — but the agreement under which the reserve was created does stop. The reserve represents profit the old partners chose to retain rather than divide, so at reconstitution it belongs to them in the OLD ratio; leaving it in the books would hand the gaining partner a share of past earnings they did nothing to earn (R), which is exactly why it is distributed (A)." }
      ]
    }
  });
})();
