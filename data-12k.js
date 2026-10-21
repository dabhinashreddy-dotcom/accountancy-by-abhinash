/* ============================================================
   CLASS 12 — EXPANSION K (v86): FS Analysis (fsa) + Ratios (rat)
   Additive unit — extends the chapters registered by data-12d.js.
   Content is original teaching material written for this project
   against the CBSE Class 12 Accountancy curriculum (2026-27).
   ============================================================ */
(function () {
  "use strict";

  C12_DATA.register({

    content: {

      /* ---------- Chapter 10: Analysis of Financial Statements ---------- */
      fsa: {

        /* ---- Practice Bank (merged with existing ids 1–10) ---- */
        numericals: [
          {
            id: 11, difficulty: "Easy",
            question: "In trend percentage analysis, how is each year's figure expressed?",
            options: ["As a percentage of a chosen base year, which itself is set at 100", "As a percentage of the current year's revenue", "As a percentage of total assets", "As a percentage of the previous year only"],
            answerIndex: 0,
            explanation: "Trend analysis picks one base year, sets it at 100, and shows every other year as a percentage of that base — so a trend of 140 means the line stands at 140% of the base year's figure."
          },
          {
            id: 12, difficulty: "Medium",
            question: "Revenue from operations was ₹4,00,000 in 2024–25 (the base year) and ₹5,20,000 in 2026–27. The trend percentage for 2026–27 is:",
            options: ["130", "120", "30", "104"],
            answerIndex: 0,
            explanation: "5,20,000 ÷ 4,00,000 × 100 = 130 — revenue in 2026–27 is 130% of the base year. Writing 30 forgets that the base year itself carries a value of 100."
          },
          {
            id: 13, difficulty: "Medium",
            question: "Profit before tax fell from ₹2,00,000 to ₹1,75,000. The correct comparative statement entry is:",
            options: ["A decrease of ₹25,000 and 12.5%", "A decrease of ₹25,000 and 14.29%", "A decrease of ₹25,000 and 25%", "An increase of ₹25,000 and 12.5%"],
            answerIndex: 0,
            explanation: "1,75,000 − 2,00,000 = −₹25,000 and 25,000 ÷ 2,00,000 × 100 = 12.5%. Dividing by the current year (25,000 ÷ 1,75,000 = 14.29%) is the classic wrong-divisor error."
          },
          {
            id: 14, difficulty: "Easy",
            question: "A short-term lender evaluating a loan is most interested in which question, and which tool answers it?",
            options: ["Can the firm pay what falls due within a year? — the liquidity reading of the statements", "How fast is the firm growing? — the trend of revenue", "What is the firm's market share? — not answerable from the statements at all", "How much dividend was declared last year? — the appropriation account"],
            answerIndex: 0,
            explanation: "Creditors care about repayment within the coming year, which the comparative and common-size balance sheets plus the liquidity ratios address; growth speed and dividend history are secondary for them."
          },
          {
            id: 15, difficulty: "Hard",
            question: "In a comparative common-size balance sheet, the share of non-current assets rose from 55% to 70% of total assets while revenue grew only 8% and inventory also rose. The best reading is:",
            options: ["Capital is being locked into long-term capacity that sales have not yet justified — test capacity utilisation before calling it expansion", "The firm has become more liquid", "The firm's collections have improved", "Profit must have risen in proportion to the assets"],
            answerIndex: 0,
            explanation: "A 55% → 70% shift into non-current assets against 8% revenue growth means the asset base expanded far faster than the business it serves; inventory rising alongside suggests the new capacity is not yet converting into sales."
          },
          {
            id: 16, difficulty: "Medium",
            question: "A student computes percentage change by dividing the change by the current year instead of the base year. On revenue of ₹20,00,000 rising to ₹25,00,000, the student's figure is:",
            options: ["20% — wrong, because the base year is the correct divisor", "25% — correct, and the student's method is right", "5% — wrong, because the change must be doubled", "125% — correct, because it shows the current year against a base of 100%"],
            answerIndex: 0,
            explanation: "5,00,000 ÷ 25,00,000 × 100 = 20% is the student's wrong-divisor answer; the correct percentage change is 5,00,000 ÷ 20,00,000 × 100 = 25%, always measured on the base year."
          },
          {
            id: 17, difficulty: "Easy",
            question: "Why does a comparative statement show both the absolute change and the percentage change?",
            options: ["Absolute change shows materiality, percentage change shows the rate of movement — the pair prevents either from misleading", "Absolute change is required by law while percentage change is optional", "Percentage change is used only for profit lines and absolute change for assets", "The two convey identical information in different units"],
            answerIndex: 0,
            explanation: "A ₹10,00,000 rise can be trivial for a ₹100 crore firm and decisive for a ₹10 lakh one; a 2% rise can be huge on a large base. The absolute line answers 'does it matter?' and the percentage line 'how fast is it moving?'."
          },
          {
            id: 18, difficulty: "Medium",
            question: "Two firms in the same trade report revenue from operations of ₹25,00,000 and ₹60,00,000. In their common-size statements of profit and loss, employee benefits expense is 45% of revenue for the first firm and 30% for the second. The correct conclusion is:",
            options: ["The first firm is far more labour-intensive — investigate whether pricing, process or productivity explains the 15-point gap", "The first firm necessarily pays higher salaries per employee", "The second firm is automatically more profitable overall", "The comparison is invalid because the revenues differ"],
            answerIndex: 0,
            explanation: "Common-sizing removes the scale effect, so 45% against 30% is a genuine structural difference — a 15 percentage point gap in labour intensity — to be explained by pricing, process or productivity, not by size."
          },
          {
            id: 19, difficulty: "Hard",
            question: "Revenue from operations rose from ₹15,00,000 to ₹18,00,000; employee benefits from ₹4,50,000 to ₹5,40,000; other expenses from ₹3,00,000 to ₹3,90,000. Profit before tax changed by:",
            options: ["An increase of 16%", "An increase of 25%", "An increase of 20%", "A decrease of 16%"],
            answerIndex: 0,
            explanation: "PBT moved from 15,00,000 − 4,50,000 − 3,00,000 = ₹7,50,000 to 18,00,000 − 5,40,000 − 3,90,000 = ₹8,70,000, a rise of ₹1,20,000; 1,20,000 ÷ 7,50,000 × 100 = 16% — profit grew more slowly than the 20% revenue rise."
          },
          {
            id: 20, difficulty: "Medium",
            question: "Profit after tax was ₹2,50,000 in the base year 2023–24 (trend base 100) and ₹1,75,000 in 2026–27. The trend percentage for 2026–27 is:",
            options: ["70", "30", "143", "75"],
            answerIndex: 0,
            explanation: "1,75,000 ÷ 2,50,000 × 100 = 70 — the line stands at 70% of the base year, a 30% fall that the index of 70 expresses directly. Writing 30 records the fall, not the trend."
          },
          {
            id: 21, difficulty: "Easy",
            question: "The primary purpose of a comparative statement of profit and loss is to:",
            options: ["Show how each line moved between years, in rupees and in per cent", "Show each expense as a percentage of revenue", "Show the cash actually collected during the year", "Show the budgeted figures for the coming year"],
            answerIndex: 0,
            explanation: "The comparative statement is the horizontal tool: every line gets an absolute change and a percentage change against the base year. Expressing lines as percentages of revenue belongs to the common-size statement."
          },
          {
            id: 22, difficulty: "Hard",
            question: "A comparative balance sheet shows shareholders' funds rising from ₹24,00,000 to ₹29,00,000, non-current liabilities steady at ₹10,00,000, current liabilities rising from ₹6,00,000 to ₹11,00,000 and total assets rising from ₹40,00,000 to ₹50,00,000. The company issued no fresh capital during the year. How was the ₹10,00,000 growth in assets financed?",
            options: ["₹5,00,000 by profit retained with the owners and ₹5,00,000 by current liabilities", "₹10,00,000 entirely by long-term borrowings", "₹6,00,000 by shareholders and ₹4,00,000 by non-current liabilities", "Equally from borrowings and from share capital"],
            answerIndex: 0,
            explanation: "Funds rose ₹5,00,000 (29,00,000 − 24,00,000), non-current liabilities contributed nothing and current liabilities rose ₹5,00,000 — 5,00,000 + 5,00,000 = the ₹10,00,000 asset growth, half owned and half owed to short-term creditors."
          },
          {
            id: 23, difficulty: "Easy",
            question: "In a common-size statement of profit and loss for a year in which revenue from operations is ₹12,00,000, other income of ₹60,000 appears as:",
            options: ["5% of revenue", "2% of revenue", "20% of revenue", "0.5% of revenue"],
            answerIndex: 0,
            explanation: "60,000 ÷ 12,00,000 × 100 = 5% of revenue — a small line that can flatter profit in a weak trading year, so it is read separately from operating performance."
          },
          {
            id: 24, difficulty: "Hard",
            question: "Two firms report the same revenue. Firm A shows a gross profit ratio of 38% and a net profit ratio of 6%; Firm B shows 30% and 12% respectively. The correct reading is:",
            options: ["A buys or makes more cheaply but its operating expenses absorb most of the markup; B earns less on trading but keeps twice the net share", "B is worse on both counts", "A must be selling inferior goods", "The two firms are equally efficient overall"],
            answerIndex: 0,
            explanation: "A's 38% gross against 6% net leaves 32 percentage points eaten by operating expenses; B's 30% against 12% leaves only 18 — so B keeps twice the net share of each rupee despite the weaker markup."
          },
          {
            id: 25, difficulty: "Medium",
            question: "A company changes the method of depreciating its machinery from written-down value to straight line. Its comparative statement shows depreciation up 45% while machine hours are unchanged. The line moved because of:",
            options: ["A change in accounting policy — a limitation of analysis, not an economic change", "A fall in the machinery's productivity", "An acquisition of new machinery", "Inflation in the year"],
            answerIndex: 0,
            explanation: "The method change alone can lift depreciation 45% with no change in the assets or their use — exactly the 'changes in accounting policy' limitation; before reading the line, check the notes for policy changes."
          }
        ],

        /* ---- Interactive statement lab (engine strings copied verbatim
               from data-12d.js; only the case list grows) ---- */
        activity: {
          type: "statement",
          title: "Comparative Statement Builder",
          instruction: "Build each comparative statement line by line: pick whether the line increased, decreased or stayed, and enter the amount of movement. Verify a statement to unlock its working.",
          statements: [
            {
              title: "Statement 4 — Trend percentages (base year 2024–25 = 100)",
              prompt: "Decide the direction of each movement and enter the trend percentage of the current year, taking 2024–25 as the base year set at 100.",
              needsAmount: true,
              rows: [
                { label: "Revenue from operations: ₹8,00,000 → ₹10,00,000", options: ["Increase", "Decrease", "No change"], answer: "Increase", amount: 125 },
                { label: "Employee benefits expense: ₹3,20,000 → ₹4,00,000", options: ["Increase", "Decrease", "No change"], answer: "Increase", amount: 125 },
                { label: "Cost of materials: ₹4,00,000 → ₹5,20,000", options: ["Increase", "Decrease", "No change"], answer: "Increase", amount: 130 },
                { label: "Other expenses: ₹80,000 → ₹60,000", options: ["Decrease", "Increase", "No change"], answer: "Decrease", amount: 75 },
                { label: "Profit before tax: ₹1,20,000 → ₹20,000", options: ["Decrease", "Increase", "No change"], answer: "Decrease", amount: 16.67 }
              ],
              working: "Trends = current ÷ base × 100: revenue <b>125</b>, employee benefits <b>125</b>, materials <b>130</b>, other expenses <b>75</b>, PBT (1,20,000 → 20,000) <b>16.67</b>. Revenue grew a quarter while materials grew a third — profit collapsed to barely a sixth of the base year even though the top line looked healthy."
            },
            {
              title: "Statement 5 — Common-size the balance sheet (base: total assets ₹20,00,000)",
              prompt: "Each row gives the prior year's share of total assets. Classify the direction of the change in the share and enter the current-year percentage of total assets.",
              needsAmount: true,
              rows: [
                { label: "Non-current assets ₹8,00,000 (was 45% of total assets)", options: ["Share fell", "Share rose", "Share unchanged"], answer: "Share fell", amount: 40 },
                { label: "Inventories ₹4,00,000 (was 18% of total assets)", options: ["Share rose", "Share fell", "Share unchanged"], answer: "Share rose", amount: 20 },
                { label: "Trade receivables ₹5,00,000 (was 22% of total assets)", options: ["Share rose", "Share fell", "Share unchanged"], answer: "Share rose", amount: 25 },
                { label: "Cash and bank balances ₹3,00,000 (was 15% of total assets)", options: ["Share unchanged", "Share rose", "Share fell"], answer: "Share unchanged", amount: 15 },
                { label: "Shareholders' funds ₹11,00,000 (was 50% of total assets)", options: ["Share rose", "Share fell", "Share unchanged"], answer: "Share rose", amount: 55 },
                { label: "Current liabilities ₹5,00,000 (was 30% of total assets)", options: ["Share fell", "Share rose", "Share unchanged"], answer: "Share fell", amount: 25 }
              ],
              working: "Each figure ÷ 20,00,000 × 100: non-current assets <b>40%</b> (down from 45), inventories <b>20%</b> (up from 18), receivables <b>25%</b> (up from 22), cash <b>15%</b> (unchanged), funds <b>55%</b> (up from 50), current liabilities <b>25%</b> (down from 30). The firm financed itself more from owners and shifted weight from fixed assets into working capital — the two receivable-and-stock points deserve the next question."
            },
            {
              title: "Statement 6 — Comparative balance sheet movements (2025–26 → 2026–27)",
              prompt: "Classify each movement's direction and enter the change in ₹.",
              needsAmount: true,
              rows: [
                { label: "Trade payables: ₹2,40,000 → ₹3,60,000", options: ["Increase", "Decrease", "No change"], answer: "Increase", amount: 120000 },
                { label: "Property, plant and equipment (net): ₹15,00,000 → ₹17,00,000", options: ["Increase", "Decrease", "No change"], answer: "Increase", amount: 200000 },
                { label: "Long-term borrowings: ₹6,00,000 → ₹4,50,000", options: ["Decrease", "Increase", "No change"], answer: "Decrease", amount: 150000 },
                { label: "Trade receivables: ₹3,00,000 → ₹3,90,000", options: ["Increase", "Decrease", "No change"], answer: "Increase", amount: 90000 },
                { label: "Cash and bank balances: ₹1,50,000 → ₹90,000", options: ["Decrease", "Increase", "No change"], answer: "Decrease", amount: 60000 }
              ],
              working: "Payables +₹1,20,000, fixed assets +₹2,00,000, borrowings −₹1,50,000, receivables +₹90,000, cash −₹60,000. The firm expanded capacity while repaying long-term debt — but receivables grew ₹90,000 and cash fell ₹60,000, so the expansion is being financed partly by stretching suppliers and customers."
            },
            {
              title: "Statement 7 — Reading the movement: pick the interpretation the numbers support",
              prompt: "For each pair of movements, choose the one reading the comparative statement actually supports.",
              rows: [
                { label: "Revenue up 25% while cost of materials up 38%", options: ["The materials share of revenue rose — gross margin weakened", "The materials share fell — efficiency improved", "Materials fell in absolute terms"], answer: "The materials share of revenue rose — gross margin weakened" },
                { label: "Revenue up 8% while employee benefits up 20%", options: ["The employee cost share of revenue rose — labour became dearer relative to sales", "The employee cost share fell", "Employee costs fell in absolute terms"], answer: "The employee cost share of revenue rose — labour became dearer relative to sales" },
                { label: "Revenue down 5% while inventories up 12%", options: ["Stock is building against falling sales — obsolescence and holding-cost risk", "Stock is turning faster than before", "Sales are being pushed successfully by extra stock"], answer: "Stock is building against falling sales — obsolescence and holding-cost risk" },
                { label: "Revenue up 15% while trade payables up 5%", options: ["The firm grew while its payables share shrank — suppliers were paid faster than sales grew", "Supplier credit financed the growth", "Payables outran revenue"], answer: "The firm grew while its payables share shrank — suppliers were paid faster than sales grew" },
                { label: "Revenue up 15% while cash and bank down 40%", options: ["Growth consumed cash — check how the working capital is being funded", "Growth freed cash for the owners", "Cash is irrelevant to analysis"], answer: "Growth consumed cash — check how the working capital is being funded" }
              ],
              working: "Every reading compares one line's growth against revenue's growth — never against its own past. Expense outrunning revenue = weaker share; expense lagging revenue = improved share; balance-sheet lines are read against the business they support."
            },
            {
              title: "Statement 8 — Multi-line comparative profit and loss",
              prompt: "Enter the absolute change in ₹ for every line, then for profit before tax.",
              needsAmount: true,
              rows: [
                { label: "Revenue from operations: ₹14,00,000 → ₹17,50,000", options: ["Increase", "Decrease", "No change"], answer: "Increase", amount: 350000 },
                { label: "Cost of materials: ₹7,00,000 → ₹9,10,000", options: ["Increase", "Decrease", "No change"], answer: "Increase", amount: 210000 },
                { label: "Employee benefits expense: ₹2,80,000 → ₹3,36,000", options: ["Increase", "Decrease", "No change"], answer: "Increase", amount: 56000 },
                { label: "Other expenses: ₹1,40,000 → ₹1,75,000", options: ["Increase", "Decrease", "No change"], answer: "Increase", amount: 35000 },
                { label: "Profit before tax: ₹2,80,000 → ₹3,29,000", options: ["Increase", "Decrease", "No change"], answer: "Increase", amount: 49000 }
              ],
              working: "Revenue +₹3,50,000 (+25%), materials +₹2,10,000 (+30%), employee benefits +₹56,000 (+20%), other expenses +₹35,000 (+25%). PBT = 14,00,000 − 7,00,000 − 2,80,000 − 1,40,000 = ₹2,80,000 and 17,50,000 − 9,10,000 − 3,36,000 − 1,75,000 = ₹3,29,000 — a rise of only ₹49,000, or 17.5%, because materials outran the top line."
            }
          ]
        },

        /* ---- Exam cases (existing ids are 1 and 2) ---- */
        examCases: [
          {
            id: 3,
            title: "Three years and a base",
            passage: "A trading company reports revenue from operations of ₹12,00,000 in 2024–25, ₹15,00,000 in 2025–26 and ₹16,80,000 in 2026–27. The management wants a trend reading of the top line before setting next year's target.",
            difficulty: "Medium",
            subs: [
              {
                q: "The trend percentage of revenue for 2025–26 (base 2024–25 = 100) is:",
                options: ["125", "120", "118", "25"],
                answerIndex: 0,
                reasoning: "15,00,000 ÷ 12,00,000 × 100 = 125 — revenue in 2025–26 stands at 125% of the base year."
              },
              {
                q: "The absolute increase in revenue from 2024–25 to 2026–27 is:",
                options: ["₹4,80,000", "₹1,80,000", "₹3,00,000", "₹16,80,000"],
                answerIndex: 0,
                reasoning: "16,80,000 − 12,00,000 = ₹4,80,000 — the rupee growth across the whole three-year window."
              },
              {
                q: "The growth in revenue during 2026–27 over the previous year is:",
                options: ["12%", "15%", "40%", "2.5%"],
                answerIndex: 0,
                reasoning: "16,80,000 − 15,00,000 = 1,80,000; 1,80,000 ÷ 15,00,000 × 100 = 12% — momentum slowed after the 25% rise of 2025–26."
              },
              {
                q: "The trend percentage of revenue for 2026–27 (base 2024–25 = 100) is:",
                options: ["140", "125", "112", "14"],
                answerIndex: 0,
                reasoning: "16,80,000 ÷ 12,00,000 × 100 = 140 — three years on, the top line is 140% of the base year."
              }
            ]
          },
          {
            id: 4,
            title: "Same trade, different structure",
            passage: "Two firms in the same line of business present the following for 2026–27. Firm A: revenue from operations ₹20,00,000, cost of goods sold ₹12,00,000, distribution costs ₹2,00,000, other expenses ₹1,00,000, profit before tax ₹5,00,000. Firm B: revenue from operations ₹60,00,000, cost of goods sold ₹42,00,000, distribution costs ₹6,00,000, other expenses ₹4,20,000, profit before tax ₹7,80,000.",
            difficulty: "Hard",
            subs: [
              {
                q: "Common-size cost of goods sold of Firm A (percentage of revenue):",
                options: ["60%", "70%", "40%", "50%"],
                answerIndex: 0,
                reasoning: "12,00,000 ÷ 20,00,000 × 100 = 60% of revenue."
              },
              {
                q: "Common-size cost of goods sold of Firm B (percentage of revenue):",
                options: ["70%", "60%", "30%", "42%"],
                answerIndex: 0,
                reasoning: "42,00,000 ÷ 60,00,000 × 100 = 70% — B's goods cost seven-tenths of its revenue against six-tenths for A."
              },
              {
                q: "Common-size profit before tax of the two firms:",
                options: ["A 25%, B 13%", "A 13%, B 25%", "A 25%, B 21%", "Both 19%"],
                answerIndex: 0,
                reasoning: "5,00,000 ÷ 20,00,000 × 100 = 25% and 7,80,000 ÷ 60,00,000 × 100 = 13%."
              },
              {
                q: "Which firm converts a bigger share of each rupee of revenue into profit?",
                options: ["Firm A — 25% against B's 13%, despite the smaller scale", "Firm B — ₹7,80,000 is the larger absolute profit", "Both convert equally", "Neither — the data is insufficient"],
                answerIndex: 0,
                reasoning: "A turns 25 paise of every rupee into profit against B's 13 paise; B's larger rupee profit comes from a much larger revenue base, not from a better margin."
              }
            ]
          }
        ],

        /* ---- Short exam numericals (existing ids are 1 and 2) ---- */
        examNumericals: [
          {
            id: 3,
            q: "Revenue from operations rose from ₹35,00,000 to ₹42,00,000. Find the percentage increase in revenue (%).",
            value: 20,
            explanation: "42,00,000 − 35,00,000 = 7,00,000; 7,00,000 ÷ 35,00,000 × 100 = 20% — the change measured on the base year.",
            difficulty: "Easy"
          },
          {
            id: 4,
            q: "Profit after tax was ₹4,00,000 in the base year 2023–24 (trend base 100) and ₹3,40,000 in 2026–27. Find the trend percentage for 2026–27.",
            value: 85,
            explanation: "3,40,000 ÷ 4,00,000 × 100 = 85 — the line stands at 85% of the base year, a 15% fall from the base.",
            difficulty: "Medium"
          },
          {
            id: 5,
            q: "A common-size balance sheet is built on total assets of ₹75,00,000, of which non-current liabilities are ₹15,00,000. Express non-current liabilities as a percentage of total assets (%).",
            value: 20,
            explanation: "15,00,000 ÷ 75,00,000 × 100 = 20% of total assets — one-fifth of the asset base is funded by long-term outsiders.",
            difficulty: "Medium"
          }
        ]
      },

      /* ---------- Chapter 11: Accounting Ratios ---------- */
      rat: {

        /* ---- Practice Bank (merged with existing ids 1–10) ---- */
        numericals: [
          {
            id: 11, difficulty: "Easy",
            question: "Current assets ₹8,40,000 and current liabilities ₹4,20,000. Working capital is:",
            options: ["₹4,20,000", "₹12,60,000", "₹2,00,000", "₹42,000"],
            answerIndex: 0,
            explanation: "8,40,000 − 4,20,000 = ₹4,20,000 — the rupee cushion between near-term resources and near-term obligations."
          },
          {
            id: 12, difficulty: "Medium",
            question: "The firm's working capital is ₹2,00,000 and its current liabilities are ₹5,00,000. The current ratio is:",
            options: ["1.4:1", "0.4:1", "0.71:1", "2:1"],
            answerIndex: 0,
            explanation: "Current assets = working capital + current liabilities = 2,00,000 + 5,00,000 = ₹7,00,000, and 7,00,000 ÷ 5,00,000 = 1.4:1. Dividing the ₹2,00,000 cushion itself would wrongly give 0.4:1, while 0.71:1 turns the ratio upside down."
          },
          {
            id: 13, difficulty: "Medium",
            question: "Long-term debt ₹3,00,000; short-term borrowings ₹1,00,000; shareholders' funds ₹9,00,000. The debt-equity ratio is:",
            options: ["0.33:1 — long-term debt only", "0.44:1 — total debt including short-term borrowings", "1:3", "0.5:1"],
            answerIndex: 0,
            explanation: "3,00,000 ÷ 9,00,000 = 0.33:1; folding the ₹1,00,000 short-term borrowings into the numerator would wrongly give 0.44:1 — the ratio measures long-term structure only."
          },
          {
            id: 14, difficulty: "Easy",
            question: "Revenue from operations ₹9,00,000; average trade receivables ₹1,50,000. Trade receivables turnover is:",
            options: ["6 times", "1.5 times", "15 times", "60 times"],
            answerIndex: 0,
            explanation: "9,00,000 ÷ 1,50,000 = 6 times — on a 365-day year the average credit customer pays in about 61 days (365 ÷ 6)."
          },
          {
            id: 15, difficulty: "Hard",
            question: "Revenue from operations ₹12,00,000; cost of goods sold ₹9,00,000; average inventory ₹2,00,000. Inventory turnover is:",
            options: ["4.5 times — cost of goods sold ÷ average inventory", "6 times — revenue ÷ average inventory", "3 times", "0.22 times"],
            answerIndex: 0,
            explanation: "9,00,000 ÷ 2,00,000 = 4.5 times. Dividing revenue by inventory gives 6 times, overstating turnover by the gross margin — inventory is valued at cost, so the flow must also be measured at cost."
          },
          {
            id: 16, difficulty: "Medium",
            question: "Profit before interest and tax ₹4,20,000; interest ₹60,000. Interest coverage is:",
            options: ["7 times", "0.14 times", "14 times", "6 times"],
            answerIndex: 0,
            explanation: "4,20,000 ÷ 60,000 = 7 times — earnings cover the interest bill sevenfold, before tax is even considered."
          },
          {
            id: 17, difficulty: "Easy",
            question: "Profit after tax ₹6,00,000; 3,00,000 equity shares of ₹10 each are outstanding. Earnings per share is:",
            options: ["₹2 per share", "₹0.20 per share", "₹20 per share", "₹6 per share"],
            answerIndex: 0,
            explanation: "6,00,000 ÷ 3,00,000 shares = ₹2 per share — the profit earned for each share. The ₹10 face value does not enter the calculation."
          },
          {
            id: 18, difficulty: "Medium",
            question: "Revenue from operations ₹12,00,000; gross profit ₹3,60,000; operating expenses ₹2,40,000. The net profit ratio is:",
            options: ["10%", "20%", "30%", "5%"],
            answerIndex: 0,
            explanation: "Net profit = 3,60,000 − 2,40,000 = ₹1,20,000; 1,20,000 ÷ 12,00,000 × 100 = 10% — the 30% gross margin loses 20 percentage points to operating expenses."
          },
          {
            id: 19, difficulty: "Hard",
            question: "Profit before interest and tax ₹2,80,000; total assets ₹18,00,000; current liabilities ₹4,00,000. Return on investment is:",
            options: ["20%", "15.56%", "25%", "14%"],
            answerIndex: 0,
            explanation: "Capital employed = 18,00,000 − 4,00,000 = ₹14,00,000; 2,80,000 ÷ 14,00,000 × 100 = 20%. Using total assets as the denominator wrongly gives 15.56% — current liabilities are not part of the long-term capital base."
          },
          {
            id: 20, difficulty: "Medium",
            question: "Credit purchases ₹6,60,000; average trade payables ₹1,10,000. Trade payables turnover is:",
            options: ["6 times", "0.17 times", "16.5 times", "60 times"],
            answerIndex: 0,
            explanation: "6,60,000 ÷ 1,10,000 = 6 times — the firm turns its supplier credit about six times a year, holding roughly 61 days of purchases at a time."
          },
          {
            id: 21, difficulty: "Easy",
            question: "Which of these is a solvency ratio?",
            options: ["Debt-equity ratio", "Current ratio", "Trade receivables turnover ratio", "Gross profit ratio"],
            answerIndex: 0,
            explanation: "Solvency ratios judge the long-run structure — debt against the owners' stake. The current ratio is liquidity, turnover ratios are activity and the gross profit ratio is profitability."
          },
          {
            id: 22, difficulty: "Hard",
            question: "A firm's current assets are ₹6,00,000 and current liabilities ₹3,00,000. Two days before the year end it pays trade payables of ₹1,00,000 out of its bank balance. The current ratio shown in the statements will be:",
            options: ["2.5:1 — improved on paper with no economic change", "1.67:1", "2:1 — unchanged", "2.2:1"],
            answerIndex: 0,
            explanation: "Paying reduces both sides: 5,00,000 ÷ 2,00,000 = 2.5:1 against the earlier 2:1, yet the firm is no healthier — a one-day window dressing that the quick ratio and the year's average balance expose."
          },
          {
            id: 23, difficulty: "Medium",
            question: "Company A reports a current ratio of 1.2:1 and a quick ratio of 1.0:1; company B reports 2.4:1 and 0.8:1. The defensible statement on liquidity is:",
            options: ["A is nearer-term sound — B's headline rests on inventory that must be sold first", "B is more liquid on every measure", "Both are equally liquid", "Neither can pay its bills"],
            answerIndex: 0,
            explanation: "A's quick ratio of 1.0 sits just under its current ratio of 1.2, so little depends on stock; B's falls from 2.4 to 0.8, meaning most of its comfort is inventory — exactly the gap the acid test exists to reveal."
          },
          {
            id: 24, difficulty: "Hard",
            question: "Revenue from operations ₹20,00,000 earns a gross profit of 25%. Average inventory is ₹3,00,000 and average trade receivables ₹2,50,000. Inventory turnover and trade receivables turnover are respectively:",
            options: ["5 times and 8 times", "8 times and 5 times", "6.67 times and 8 times", "5 times and 12.5 times"],
            answerIndex: 0,
            explanation: "Gross profit = 25% of 20,00,000 = ₹5,00,000, so cost of goods sold = ₹15,00,000; 15,00,000 ÷ 3,00,000 = 5 times. Receivables: 20,00,000 ÷ 2,50,000 = 8 times. Revenue ÷ inventory would wrongly give 6.67 times."
          },
          {
            id: 25, difficulty: "Easy",
            question: "A trade receivables turnover of 10 times means the average credit customer pays in about:",
            options: ["36.5 days", "10 days", "100 days", "365 days"],
            answerIndex: 0,
            explanation: "365 ÷ 10 = 36.5 days — roughly every five weeks, which is the collection period the firm's credit policy should be judged against."
          }
        ],

        /* ---- Interactive match lab (engine strings copied verbatim
               from data-12d.js; only the case list grows) ---- */
        activity: {
          type: "match",
          title: "Ratio Match-Up",
          instruction: "Match every ratio to its correct formula, then every result to its interpretation. Each set verifies as a whole — the working appears when every pair is right.",
          sets: [
            {
              title: "Set 3 — Ratio → family",
              prompt: "Click a ratio on the left, then the family it belongs to on the right.",
              pairs: [
                { left: "Current ratio", right: "Liquidity ratio" },
                { left: "Quick ratio", right: "Liquidity ratio — the acid test" },
                { left: "Debt-equity ratio", right: "Solvency ratio — long-term structure" },
                { left: "Inventory turnover ratio", right: "Activity ratio — asset utilisation" },
                { left: "Gross profit ratio", right: "Profitability ratio — margin on revenue" },
                { left: "Interest coverage ratio", right: "Solvency ratio — debt service capacity" }
              ],
              working: "Name the family before the formula: liquidity answers 'can it pay soon?', solvency 'can it carry the load?', activity 'how hard do the assets work?' and profitability 'how much of each rupee survives?'."
            },
            {
              title: "Set 4 — Result → what it suggests",
              prompt: "Match each computed result to the one interpretation the numbers support.",
              pairs: [
                { left: "Current ratio 2.6:1 with quick ratio 0.9:1", right: "Comfortable headline but stock-heavy — the acid test fails" },
                { left: "Debt-equity 1.8:1 with interest coverage 2.2 times", right: "Heavily leveraged and thinly covered — refinancing risk" },
                { left: "Inventory turnover 9 times against an industry average of 5", right: "Lean stocking — or dangerously thin safety stock" },
                { left: "Trade receivables turnover 24 times (about 15 days)", right: "Near-cash collections — a tight or cash-and-carry credit policy" }
              ],
              working: "365 ÷ 24 ≈ 15 days of credit. Every interpretation above pairs two figures — a current ratio with a quick ratio, a turnover with its industry norm — because a lone ratio is only a fact."
            },
            {
              title: "Set 5 — Formula → ratio",
              prompt: "Match each activity-family formula to the ratio it defines.",
              pairs: [
                { left: "Cost of goods sold ÷ Average inventory", right: "Inventory turnover ratio" },
                { left: "Revenue from operations ÷ Average trade receivables", right: "Trade receivables turnover ratio" },
                { left: "Credit purchases ÷ Average trade payables", right: "Trade payables turnover ratio" },
                { left: "Revenue from operations ÷ Working capital", right: "Working capital turnover ratio" },
                { left: "365 ÷ Trade receivables turnover ratio", right: "Average collection period in days" }
              ],
              working: "Every activity ratio marries a flow over the year to a balance at a point — that is why the balance is averaged whenever opening figures are given."
            },
            {
              title: "Set 6 — Wrong move → consequence",
              prompt: "Match each common mistake to what it does to the answer.",
              pairs: [
                { left: "Using closing inventory when opening inventory is given", right: "Distorts turnover — a one-day dip in stock flatters the whole year" },
                { left: "Putting short-term borrowings into debt-equity", right: "Overstates long-term gearing — the ratio loses its structural meaning" },
                { left: "Dividing revenue by average inventory", right: "Overstates turnover by the amount of the gross margin" },
                { left: "Reading the current ratio alone", right: "A stock-heavy firm can look liquid until the acid test is applied" },
                { left: "Using total assets instead of capital employed in ROI", right: "Understates the return — current liabilities are not the earning capital" }
              ],
              working: "Each mistake is a formula substitution error, not an arithmetic one. State the formula in words first and most of them become impossible to commit."
            },
            {
              title: "Set 7 — Figure → verdict",
              prompt: "Match each ratio result to the verdict it supports.",
              pairs: [
                { left: "Operating ratio 82% against a peer's 68%", right: "Heavier cost structure — each rupee of revenue costs more to operate" },
                { left: "Proprietary ratio 0.7:1", right: "Owners fund seventy paise of every rupee of assets — a conservative base" },
                { left: "Interest coverage 1.2 times", right: "Earnings barely cover the interest bill — a small dip turns it into a shortfall" },
                { left: "Working capital turnover 12 times against last year's 7", right: "Leaner working capital or overtrading — check the current ratio before applauding" }
              ],
              working: "Operating ratio = (COGS + operating expenses) ÷ revenue × 100; proprietary ratio = shareholders' funds ÷ total assets. Both are read against a peer, a prior year or a stated norm — never alone."
            },
            {
              title: "Set 8 — Statement trick → the ratio it distorts",
              prompt: "Match each year-end trick to the ratio it flatters.",
              pairs: [
                { left: "A one-day bank overdraft repaid on 1st April", right: "Inflates the year-end current ratio and quick ratio" },
                { left: "Inventory written down to scrap value just after year end", right: "Understates year-end inventory and flatters the turnover ratio at that date" },
                { left: "A supplier invoice held back until April", right: "Understates year-end payables and inflates the payables turnover" },
                { left: "A large credit sale booked on 30th March and reversed in April", right: "Inflates receivables and revenue — the receivables turnover looks healthier than the year was" }
              ],
              working: "Window dressing attacks ratios that mix a year-end balance with a year's flow. Averages, the quick ratio and a look at the notes are the analyst's defences."
            }
          ]
        },

        /* ---- Exam cases (existing ids are 1 and 2) ---- */
        examCases: [
          {
            id: 3,
            title: "A seasonal trader's working cycle",
            passage: "A wholesale trader reports for 2026–27: credit sales ₹24,00,000; credit purchases ₹15,00,000; average inventory ₹2,50,000; average trade receivables ₹2,00,000; average trade payables ₹1,50,000; profit before interest and tax ₹3,60,000; interest ₹60,000. The banker wants to see how fast the firm's money moves through the cycle.",
            difficulty: "Medium",
            subs: [
              {
                q: "Inventory turnover ratio:",
                options: ["6 times", "5 times", "10 times", "0.17 times"],
                answerIndex: 0,
                reasoning: "15,00,000 ÷ 2,50,000 = 6 times — stock turns about six times a year, roughly 61 days on the shelves (365 ÷ 6)."
              },
              {
                q: "Trade receivables turnover ratio:",
                options: ["12 times", "6 times", "2 times", "20 times"],
                answerIndex: 0,
                reasoning: "24,00,000 ÷ 2,00,000 = 12 times — customers pay about every 30 days (365 ÷ 12 ≈ 30)."
              },
              {
                q: "Trade payables turnover ratio:",
                options: ["10 times", "15 times", "1.5 times", "0.1 times"],
                answerIndex: 0,
                reasoning: "15,00,000 ÷ 1,50,000 = 10 times — the firm settles its suppliers roughly every 36 days (365 ÷ 10 ≈ 37)."
              },
              {
                q: "Interest coverage ratio:",
                options: ["6 times", "0.17 times", "60 times", "3 times"],
                answerIndex: 0,
                reasoning: "3,60,000 ÷ 60,000 = 6 times — earnings cover the interest bill sixfold."
              }
            ]
          },
          {
            id: 4,
            title: "To borrow, or not to borrow",
            passage: "A company is financed by long-term debt of ₹10,00,000 and shareholders' funds of ₹10,00,000, and earns profit before interest and tax of ₹2,40,000. Interest on the existing debt runs at 10% per annum. The board proposes to raise a further ₹5,00,000 of long-term debt at 12% to buy assets expected to add ₹1,20,000 to profit before interest and tax each year.",
            difficulty: "Hard",
            subs: [
              {
                q: "The debt-equity ratio before the fresh borrowing is:",
                options: ["1:1", "0.5:1", "2:1", "1.5:1"],
                answerIndex: 0,
                reasoning: "10,00,000 ÷ 10,00,000 = 1:1 — outsiders and owners each fund half the firm."
              },
              {
                q: "The debt-equity ratio after the fresh borrowing is:",
                options: ["1.5:1", "1:1", "0.67:1", "2.5:1"],
                answerIndex: 0,
                reasoning: "Long-term debt becomes 15,00,000 against unchanged funds of 10,00,000 — 15,00,000 ÷ 10,00,000 = 1.5:1, a visibly more leveraged structure."
              },
              {
                q: "The interest coverage ratio after the expansion is:",
                options: ["2.25 times", "2.4 times", "3 times", "4 times"],
                answerIndex: 0,
                reasoning: "Interest = 10% of 10,00,000 + 12% of 5,00,000 = 1,00,000 + 60,000 = ₹1,60,000; PBIT = 2,40,000 + 1,20,000 = ₹3,60,000; 3,60,000 ÷ 1,60,000 = 2.25 times — slightly below the earlier 2.4 times."
              },
              {
                q: "The return on investment before and after the expansion is:",
                options: ["12% before and 12% after — the new assets earn exactly the old rate", "12% before and 14.4% after", "10% before and 12% after", "24% before and 24% after"],
                answerIndex: 0,
                reasoning: "Capital employed = 20,00,000 before → 2,40,000 ÷ 20,00,000 = 12%; 25,00,000 after → 3,60,000 ÷ 25,00,000 = 12%. The new assets earn 1,20,000 on 5,00,000 = 24%, but the blended ROI stays 12%."
              }
            ]
          }
        ],

        /* ---- Short exam numericals (existing ids are 1 and 2) ---- */
        examNumericals: [
          {
            id: 3,
            q: "Shareholders' funds ₹18,00,000; long-term debt ₹7,20,000. Find the debt-equity ratio (as a decimal to two places, e.g. 0.25).",
            value: 0.4,
            explanation: "7,20,000 ÷ 18,00,000 = 0.4 — expressed as a ratio, 0.4:1, meaning forty paise of long-term debt for every rupee the owners have put in.",
            difficulty: "Medium"
          },
          {
            id: 4,
            q: "Revenue from operations ₹45,00,000; working capital ₹9,00,000. Find the working capital turnover ratio (times).",
            value: 5,
            explanation: "45,00,000 ÷ 9,00,000 = 5 times — every rupee of working capital supports ₹5 of revenue through the year.",
            difficulty: "Easy"
          },
          {
            id: 5,
            q: "Cost of goods sold ₹13,50,000; opening inventory ₹2,00,000; closing inventory ₹2,50,000. Find the average holding period of inventory in days (nearest whole day, 365-day year).",
            value: 61,
            explanation: "Average inventory = (2,00,000 + 2,50,000) ÷ 2 = ₹2,25,000; turnover = 13,50,000 ÷ 2,25,000 = 6 times; 365 ÷ 6 ≈ 61 days of stock on hand.",
            difficulty: "Hard"
          }
        ]
      }
    },

    /* ============ QUIZ (ids 70266–70295) ============ */
    quiz: [
      { id: 70266, chapter: "fsa", difficulty: "Easy",
        q: "In trend percentage analysis, each year's figure is expressed:",
        options: ["As a percentage of a chosen base year, which is itself set at 100", "As a percentage of the current year's revenue", "As a percentage of total assets", "As an absolute change from the previous year only"],
        answerIndex: 0,
        explanation: "One base year is picked, set at 100, and every other year becomes a percentage of it — a trend of 140 means 140% of the base year." },
      { id: 70267, chapter: "fsa", difficulty: "Easy",
        q: "Which set lists only tools of financial statement analysis?",
        options: ["Comparative statements, common-size statements, trend analysis and ratio analysis", "Trading account, profit and loss account, balance sheet and cash book", "Journal, ledger, trial balance and rectification entry", "Budget, standard costing, marginal costing and reconciliation"],
        answerIndex: 0,
        explanation: "Comparative, common-size and trend statements plus ratios are the four analysis tools; the others are accounting records or management-accounting techniques." },
      { id: 70268, chapter: "fsa", difficulty: "Medium",
        q: "Revenue from operations rose from ₹16,00,000 to ₹18,40,000. The percentage increase is:",
        options: ["15%", "13.04%", "24%", "12%"],
        answerIndex: 0,
        explanation: "18,40,000 − 16,00,000 = 2,40,000; 2,40,000 ÷ 16,00,000 × 100 = 15% on the base year. Dividing by the current year wrongly gives 13.04%." },
      { id: 70269, chapter: "fsa", difficulty: "Medium",
        q: "Current liabilities were ₹8,00,000 in a total of ₹40,00,000 last year and ₹10,00,000 in a total of ₹50,00,000 this year. The common-size reading is:",
        options: ["The share of current liabilities in total assets is unchanged at 20% — proportionate growth", "The share rose to 25%", "The share fell to 16%", "Current liabilities doubled in share"],
        answerIndex: 0,
        explanation: "8,00,000 ÷ 40,00,000 = 20% and 10,00,000 ÷ 50,00,000 = 20% — the same 20% share in both years, so the structure did not move." },
      { id: 70270, chapter: "fsa", difficulty: "Easy",
        q: "Window dressing in financial statements means:",
        options: ["Entries or balances timed for the reporting date to make the picture look better than the year's reality", "Fictitious sales recorded to inflate revenue", "Errors corrected before the audit", "Showing the statements in a common-size format"],
        answerIndex: 0,
        explanation: "A one-day bank balance or a deferred invoice improves exactly one date without any economic change — the classic window-dressing limitation of analysis." },
      { id: 70271, chapter: "fsa", difficulty: "Medium",
        q: "A comparative statement shows trade payables up 50% while credit purchases rose only 10%. The first inference is:",
        options: ["The firm is stretching its supplier credit — liquidity propped up by delayed payments", "The firm is paying suppliers faster", "Purchases must have fallen", "The firm's profitability improved"],
        answerIndex: 0,
        explanation: "Payables growing five times faster than purchases means the firm is holding on to supplier money — a liquidity cushion that suppliers may one day withdraw." },
      { id: 70272, chapter: "fsa", difficulty: "Hard",
        q: "Firm X reports revenue of ₹25,00,000 with a profit before tax of 18% of revenue; firm Y reports revenue of ₹40,00,000 with a profit before tax of 12% of revenue. Which statement is correct?",
        options: ["Y earns more in rupees (₹4,80,000) but X converts a bigger share of revenue into profit (18%)", "X earns more in rupees", "Y's margin is higher than X's", "Both firms convert the same share of revenue"],
        answerIndex: 0,
        explanation: "X's profit = 18% of 25,00,000 = ₹4,50,000; Y's = 12% of 40,00,000 = ₹4,80,000. Y leads in rupees, X leads in share — the absolute and percentage lines tell different stories, as always." },
      { id: 70273, chapter: "fsa", difficulty: "Easy",
        q: "The chief benefit of a common-size statement is that it:",
        options: ["Removes the effect of size, so firms of very different scale become comparable", "Removes the effect of inflation", "Shows cash movements directly", "Eliminates the need for accounting standards"],
        answerIndex: 0,
        explanation: "Every line becomes a percentage of the same base, so a ₹25 lakh firm and a ₹60 crore firm can be compared structure by structure." },
      { id: 70274, chapter: "fsa", difficulty: "Medium",
        q: "Employee benefits fell from 42% to 40% of revenue as revenue rose from ₹20,00,000 to ₹25,00,000. The absolute change in employee cost is:",
        options: ["An increase of ₹1,60,000", "An increase of ₹2,00,000", "A decrease of ₹40,000", "An increase of ₹1,20,000"],
        answerIndex: 0,
        explanation: "42% of 20,00,000 = ₹8,40,000; 40% of 25,00,000 = ₹10,00,000; the increase is ₹1,60,000 — the share fell even though the rupee cost rose, which is why both changes are read together." },
      { id: 70275, chapter: "fsa", difficulty: "Medium",
        q: "Revenue in the base year 2024–25 was ₹10,00,000. The trend index reads 118 for 2025–26 and 133 for 2026–27. Revenue in 2026–27 was:",
        options: ["₹13,30,000", "₹11,80,000", "₹12,30,000", "₹10,00,000"],
        answerIndex: 0,
        explanation: "A trend of 133 means 133% of the base: 133 ÷ 100 × 10,00,000 = ₹13,30,000. The 2025–26 index of 118 corresponds to ₹11,80,000." },
      { id: 70276, chapter: "fsa", difficulty: "Hard",
        q: "A comparative statement shows non-current assets up 60%, trade receivables up 45% and revenue up 8%, with no change in borrowings. The best reading is:",
        options: ["The firm expanded its capacity and its credit book far faster than sales grew — test utilisation and collections before calling it growth", "The firm became more liquid", "The firm's debt burden doubled", "Collections improved dramatically"],
        answerIndex: 0,
        explanation: "60% and 45% against 8% revenue growth means assets and receivables are outrunning the business they serve — capacity utilisation and collection quality are the two questions to ask next." },
      { id: 70277, chapter: "fsa", difficulty: "Medium",
        q: "Which of these movements most calls for investigation rather than celebration?",
        options: ["Revenue up 10% while trade receivables up 40%", "Revenue up 10% while cash up 30%", "Revenue up 10% while inventories down 5%", "Revenue up 10% and other income up 10%"],
        answerIndex: 0,
        explanation: "Receivables growing four times faster than revenue is the oldest warning in accounting — slower collections or credit pushed to sustain sales." },
      { id: 70278, chapter: "fsa", difficulty: "Hard",
        q: "Long-term borrowings stayed at ₹9,00,000 while total assets grew from ₹30,00,000 to ₹35,00,000. In the common-size balance sheet, the share of long-term borrowings moved from:",
        options: ["30% to about 25.71%", "25% to 30%", "30% to 27%", "30% to 35%"],
        answerIndex: 0,
        explanation: "9,00,000 ÷ 30,00,000 = 30% and 9,00,000 ÷ 35,00,000 = 25.71% — the rupee amount of debt never moved, yet its share of the balance sheet fell, which only the common-size reading shows." },
      { id: 70279, chapter: "fsa", difficulty: "Hard",
        q: "In a common-size balance sheet the share of inventories rose from 18% to 26% of total assets while revenue grew just 4%. The most defensible conclusion is:",
        options: ["Capital is accumulating in unsold stock — investigate demand, pricing and stock policy before calling it expansion", "Inventory efficiency improved", "The firm's liquidity definitely improved", "Profit must have risen with the larger stock"],
        answerIndex: 0,
        explanation: "An 8 percentage point rise in the stock share against 4% sales growth points to overstocking or slowing demand — a question for the aging schedule, not an applause." },
      { id: 70280, chapter: "fsa", difficulty: "Easy",
        q: "An expense of ₹4,00,000 rose by ₹60,000. The percentage increase is:",
        options: ["15%", "6.67%", "60%", "1.5%"],
        answerIndex: 0,
        explanation: "60,000 ÷ 4,00,000 × 100 = 15% — the change measured on the base figure of 4,00,000, not on the new total." },

      { id: 70281, chapter: "rat", difficulty: "Easy",
        q: "Current assets ₹9,00,000, current liabilities ₹3,60,000. Working capital is:",
        options: ["₹5,40,000", "₹12,60,000", "₹2,50,000", "₹36,000"],
        answerIndex: 0,
        explanation: "9,00,000 − 3,60,000 = ₹5,40,000 — the cushion of current assets over current liabilities, in rupees rather than as a ratio." },
      { id: 70282, chapter: "rat", difficulty: "Easy",
        q: "Which of these belongs to the solvency family of ratios?",
        options: ["Debt-equity ratio", "Current ratio", "Trade receivables turnover ratio", "Gross profit ratio"],
        answerIndex: 0,
        explanation: "Debt-equity judges the long-run financing structure; the current ratio is liquidity, turnover is activity and gross profit ratio is profitability." },
      { id: 70283, chapter: "rat", difficulty: "Medium",
        q: "A firm shows a current ratio of 1.8:1 and a quick ratio of 0.6:1. The reading is:",
        options: ["Liquidity depends almost entirely on selling inventory — the acid test exposes a stock-heavy position", "The firm cannot pay its bills at all", "Inventory is negligible", "Borrowings are too high"],
        answerIndex: 0,
        explanation: "The gap between 1.8 and 0.6 sits in inventory and prepayments — unless stock sells, only 0.6 of near-cash resources stands against each rupee of current liabilities." },
      { id: 70284, chapter: "rat", difficulty: "Medium",
        q: "Shareholders' funds ₹12,00,000; long-term debt ₹3,00,000; short-term notes ₹2,00,000. The debt-equity ratio is:",
        options: ["0.25:1 — short-term notes stay outside the ratio", "0.42:1 — total debt divided by funds", "4:1", "0.6:1"],
        answerIndex: 0,
        explanation: "3,00,000 ÷ 12,00,000 = 0.25:1; including the ₹2,00,000 short-term notes would wrongly give 5,00,000 ÷ 12,00,000 = 0.42:1 — the ratio measures long-term structure only." },
      { id: 70285, chapter: "rat", difficulty: "Easy",
        q: "Return on investment measures:",
        options: ["Profit before interest and tax against capital employed — the financing-neutral return", "Net profit against revenue from operations", "Profit against shareholders' funds only", "Cash generated against total assets"],
        answerIndex: 0,
        explanation: "ROI = PBIT ÷ capital employed × 100 — it asks what the whole capital base earned, irrespective of whether it was funded by owners or lenders." },
      { id: 70286, chapter: "rat", difficulty: "Medium",
        q: "Cost of goods sold ₹14,40,000; average inventory ₹2,40,000. Inventory turnover is:",
        options: ["6 times", "0.17 times", "24 times", "3 times"],
        answerIndex: 0,
        explanation: "14,40,000 ÷ 2,40,000 = 6 times — the stock became cost of sales six times in the year, about 61 days per turn (365 ÷ 6)." },
      { id: 70287, chapter: "rat", difficulty: "Hard",
        q: "Inventory turnover fell from 8 to 4 times while revenue rose 10%. The best conclusion is:",
        options: ["Stock is piling up faster than sales — capital locked in and obsolescence risk rising", "Efficiency improved with the higher revenue", "Profit must have doubled", "The debt-equity ratio fell"],
        answerIndex: 0,
        explanation: "Turnover halved while sales grew 10% — inventory grew far faster than the business, tying up capital and raising holding and obsolescence costs." },
      { id: 70288, chapter: "rat", difficulty: "Medium",
        q: "Profit before interest and tax ₹5,60,000; interest ₹70,000. Interest coverage is:",
        options: ["8 times", "0.125 times", "80 times", "4 times"],
        answerIndex: 0,
        explanation: "5,60,000 ÷ 70,000 = 8 times — earnings cover the interest bill eightfold before tax is considered." },
      { id: 70289, chapter: "rat", difficulty: "Easy",
        q: "The quick ratio is called the acid test because it shows whether the firm can pay current liabilities:",
        options: ["Without selling inventory — quick assets near 1:1 against current liabilities", "Only by selling its fixed assets", "Only after raising fresh capital", "Exactly twice over"],
        answerIndex: 0,
        explanation: "Inventory and prepayments are stripped out, leaving cash, bank, trade receivables and short-term investments — near-cash resources; about 1:1 is the acid-test mark." },
      { id: 70290, chapter: "rat", difficulty: "Hard",
        q: "Revenue from operations ₹25,00,000; cost of goods sold ₹17,50,000; office and selling expenses ₹2,50,000. The operating ratio is:",
        options: ["80%", "70%", "30%", "25%"],
        answerIndex: 0,
        explanation: "(17,50,000 + 2,50,000) ÷ 25,00,000 × 100 = 20,00,000 ÷ 25,00,000 × 100 = 80% — every rupee of revenue costs 80 paise to operate, leaving the operating profit ratio at its complement, 20%." },
      { id: 70291, chapter: "rat", difficulty: "Medium",
        q: "Shareholders' funds ₹15,00,000; total assets ₹25,00,000. The proprietary ratio is:",
        options: ["0.6:1", "1.67:1", "0.4:1", "6:1"],
        answerIndex: 0,
        explanation: "15,00,000 ÷ 25,00,000 = 0.6:1 — owners fund sixty paise of every rupee of assets, a majority stake financed internally." },
      { id: 70292, chapter: "rat", difficulty: "Hard",
        q: "A firm reports total assets of ₹32,00,000 and long-term debt of ₹8,00,000. Its total asset to debt ratio of 4:1 means:",
        options: ["Each rupee of long-term debt is backed by ₹4 of assets", "Each ₹4 of debt backs ₹1 of assets", "Debt is four times equity", "Assets grew four times during the year"],
        answerIndex: 0,
        explanation: "32,00,000 ÷ 8,00,000 = 4:1 — ₹4 of assets stand behind every ₹1 of long-term debt; 'debt is four times equity' would be a debt-equity statement, a different ratio entirely." },
      { id: 70293, chapter: "rat", difficulty: "Medium",
        q: "Credit purchases ₹7,20,000 and trade payables turnover 6 times. Average trade payables are:",
        options: ["₹1,20,000", "₹43,200", "₹4,32,000", "₹1,20,000 per month"],
        answerIndex: 0,
        explanation: "Turnover = purchases ÷ average payables, so average payables = 7,20,000 ÷ 6 = ₹1,20,000 — about two months of purchases held as supplier credit." },
      { id: 70294, chapter: "rat", difficulty: "Easy",
        q: "Which ratio family answers the question 'how intensively are the assets used'?",
        options: ["Activity ratios", "Liquidity ratios", "Solvency ratios", "Profitability ratios"],
        answerIndex: 0,
        explanation: "Turnover ratios convert balance-sheet stocks into income-statement flows to measure how hard the assets work; liquidity asks about paying, solvency about structure and profitability about margins." },
      { id: 70295, chapter: "rat", difficulty: "Hard",
        q: "Revenue from operations ₹18,00,000; working capital ₹4,00,000. The working capital turnover ratio and its best caution are:",
        options: ["4.5 times — a very high turnover can signal overtrading, with too little working capital for the volume", "0.22 times — the firm is overtrading", "45 times — the firm is overtrading", "4.5 times — inventory is excluded from the calculation"],
        answerIndex: 0,
        explanation: "18,00,000 ÷ 4,00,000 = 4.5 times — each rupee of working capital supports ₹4.50 of revenue; pushed much higher, the same ratio can mean the firm is trading beyond its working capital, i.e. overtrading." }
    ],

    /* ============ FLASHCARDS (ids 71213–71236) ============ */
    flashcards: [
      { id: 71213, chapter: "fsa", front: "Trend percentage — definition and base?", back: "Each year expressed as a percentage of a chosen base year, which is itself set at 100. One index shows direction and rate across many years." },
      { id: 71214, chapter: "fsa", front: "The four tools of financial statement analysis?", back: "Comparative statements, common-size statements, trend analysis and ratio analysis — change, structure, direction and relationships." },
      { id: 71215, chapter: "fsa", front: "Reading rule for a three-year comparative statement?", back: "Compare each year with the base for percentage change, but also check consecutive years — a single base can hide a reversal in the latest year." },
      { id: 71216, chapter: "fsa", front: "What does a common-size statement remove?", back: "The effect of size. Firms of very different scale become comparable line by line because every line is a percentage of the same base." },
      { id: 71217, chapter: "fsa", front: "Can an expense's share of revenue fall while its rupee cost rises?", back: "Yes — if revenue grew faster than the expense. Read the percentage change and the absolute change as a pair before judging efficiency." },
      { id: 71218, chapter: "fsa", front: "What is window dressing?", back: "Timing entries or balances for the reporting date — a one-day bank loan, an invoice deferred — to improve one date without any real economic change." },
      { id: 71219, chapter: "fsa", front: "Why can inter-firm comparison fail?", back: "Different year-ends, accounting policies and classifications make line-by-line comparison misleading unless the statements are first made comparable." },
      { id: 71220, chapter: "fsa", front: "How does qualitative information enter analysis?", back: "It never appears in the statements — a strike, a new patent or a lost contract must be brought in from outside the numbers to explain them." },
      { id: 71221, chapter: "fsa", front: "Comparing an expense against its own past — right or wrong?", back: "Wrong as a first step. Compare its growth against revenue's growth; only then does the movement say anything about efficiency." },
      { id: 71222, chapter: "fsa", front: "What does a comparative balance sheet reveal?", back: "The financing decisions of the year — whether growth came from borrowings or retained profit, whether receivables outran sales, whether inventory built up." },
      { id: 71223, chapter: "fsa", front: "Why pair absolute and percentage change?", back: "Absolute change shows materiality; percentage change shows momentum. Big numbers flatter in rupees and small ones in per cent — read the pair." },
      { id: 71224, chapter: "fsa", front: "Name the key limitations of analysis in one line each.", back: "Historical cost ignores inflation; policy changes move lines without economics; window dressing misleads at a date; no qualitative data appears." },
      { id: 71225, chapter: "rat", front: "Working capital — definition and formula?", back: "Current assets − Current liabilities. The rupee cushion between what is owed within a year and what is coming in within a year." },
      { id: 71226, chapter: "rat", front: "Proprietary ratio formula?", back: "Shareholders' funds ÷ Total assets — the share of the asset base owned by the shareholders rather than owed to outsiders." },
      { id: 71227, chapter: "rat", front: "Total asset to debt ratio formula?", back: "Total assets ÷ Long-term debt — the long-term asset backing available for each rupee of borrowed capital." },
      { id: 71228, chapter: "rat", front: "Operating ratio formula?", back: "(COGS + Operating expenses) ÷ Revenue from operations × 100. Its complement, the operating profit ratio, is 100 − operating ratio." },
      { id: 71229, chapter: "rat", front: "Earnings per share formula?", back: "Profit after tax ÷ Number of equity shares — the profit earned for each share outstanding; the face value of the share plays no part." },
      { id: 71230, chapter: "rat", front: "Trade payables turnover formula?", back: "Credit purchases ÷ Average trade payables. Days payable = 365 ÷ turnover — how long supplier credit is being held." },
      { id: 71231, chapter: "rat", front: "Working capital turnover formula and its caution?", back: "Revenue from operations ÷ Working capital. A very high ratio can mean overtrading — too little working capital for the volume being done." },
      { id: 71232, chapter: "rat", front: "Is a 2:1 current ratio always healthy?", back: "No — if the current assets are mostly slow inventory, the quick ratio exposes it. Judge the pair, never the single ratio." },
      { id: 71233, chapter: "rat", front: "What does interest coverage below 1 mean?", back: "Profit before interest and tax does not even cover the interest bill — earnings must rise, costs fall, or fresh finance is needed just to pay interest." },
      { id: 71234, chapter: "rat", front: "Debt-equity — what goes in and what stays out?", back: "Long-term debt in the numerator, shareholders' funds in the denominator. Short-term borrowings stay out — the ratio measures long-term structure only." },
      { id: 71235, chapter: "rat", front: "Gross profit ratio versus net profit ratio?", back: "Gross profit ÷ revenue is the markup on trading; net profit ÷ revenue is what survives every expense. A wide gap points at heavy operating costs." },
      { id: 71236, chapter: "rat", front: "Which base for inventory turnover — COGS or revenue?", back: "COGS. Inventory is valued at cost, so a cost flow over a cost base matches; using revenue overstates turnover by the amount of the markup." }
    ],

    /* ============ IMPORTANT QUESTIONS (existing count: 7) ============ */
    importantQuestions: {
      fsa: [
        { type: "Short Answer", marks: 3,
          q: "What is trend percentage analysis, and how does it differ from a comparative statement?",
          answer: "Trend percentage analysis selects one year as the base, sets it at 100, and expresses every other year as a percentage of that base, so the direction and rate of a line across many years appear on a single scale — a trend of 140 means the line stands at 140% of the base year. A comparative statement compares two adjacent years, showing the absolute change and the percentage change of each line against the previous year. The comparative view gives the detail of the latest movement; the trend view shows whether that movement continues, reverses or stalls a pattern established over several years." },
        { type: "Short Answer", marks: 3,
          q: "State two advantages of common-size statements.",
          answer: "First, they remove the effect of size: two firms with turnovers of ₹25 lakh and ₹60 lakh become comparable line by line because every line is a percentage of the same base — revenue from operations for the profit and loss statement, total assets for the balance sheet. Second, they expose structure immediately: a shift in the share of an expense, a margin or a financing line shows itself even while every absolute figure is growing, so an analyst sees that employee costs have become 45% of revenue against a peer's 30% without ever needing the peers' absolute numbers." },
        { type: "Short Answer", marks: 3,
          q: "Revenue grew 30% while finance costs grew only 5%. What does the pair of percentages indicate?",
          answer: "Finance costs grew far more slowly than revenue, so their share of revenue fell — the interest burden eased relative to the size of the business. The usual causes are repayment of borrowings during the year, a refinancing at lower rates, or simply that revenue expanded on existing debt. As always the pair is evidence, not proof: the analyst checks the borrowings note and the interest charge before concluding that the firm's financing became cheaper." },
        { type: "Long Answer", marks: 6,
          q: "From the data — revenue ₹18,00,000 → ₹22,50,000; cost of materials ₹9,00,000 → ₹11,70,000; employee benefits ₹3,60,000 → ₹4,14,000; other expenses ₹1,80,000 → ₹2,16,000 — prepare a comparative statement of profit and loss and comment.",
          answer: "Changes: revenue +₹4,50,000 (+25%); cost of materials +₹2,70,000 (+30%); employee benefits +₹54,000 (+15%); other expenses +₹36,000 (+20%). Profit before tax: 18,00,000 − 9,00,000 − 3,60,000 − 1,80,000 = ₹3,60,000 against 22,50,000 − 11,70,000 − 4,14,000 − 2,16,000 = ₹4,50,000, a rise of ₹90,000 or 25%. Comment: profit grew exactly in step with revenue at 25%, but the composition moved — materials outran revenue at 30% and squeezed the gross margin, while employee benefits at 15% and other expenses at 20% both lagged revenue and improved their shares. The single line to investigate is the cost of materials: a 30% rise against 25% revenue growth points at input prices or wastage, and reversing those 5 percentage points would have lifted profit growth well above the top line." },
        { type: "Long Answer", marks: 6,
          q: "Common-size the following and comment: Firm P — revenue ₹30,00,000, COGS ₹18,60,000, employee benefits ₹6,00,000, other expenses ₹2,40,000, PBT ₹3,00,000. Firm Q — revenue ₹50,00,000, COGS ₹35,00,000, employee benefits ₹7,50,000, other expenses ₹3,75,000, PBT ₹3,75,000.",
          answer: "Common-size (each ÷ own revenue × 100). Firm P: COGS 62%, employee benefits 20%, other expenses 8%, PBT 10%. Firm Q: COGS 70%, employee benefits 15%, other expenses 7.5%, PBT 7.5%. Comment: P buys or makes more cheaply — 62% against 70% of revenue in cost of goods — and converts 10 paise of every rupee into profit against Q's 7.5 paise, despite being the smaller firm. But P is also the more labour-intensive operation at 20% against Q's 15%, so its advantage lives in purchasing or pricing rather than in overhead control. Size, remember, has been removed by common-sizing: the 2.5 percentage point margin gap is a structural difference that scale alone cannot explain, and the natural next question is whether P's input advantage is durable or a one-year commodity buy." },
        { type: "Case-Based", marks: 4,
          q: "Extract of comparative balance sheets — non-current assets ₹22,00,000 → ₹28,00,000; current assets ₹18,00,000 → ₹22,00,000; equity share capital ₹15,00,000 (both years); other reserves ₹13,00,000 → ₹20,00,000; non-current liabilities ₹8,00,000 (both years); current liabilities ₹4,00,000 → ₹7,00,000. No fresh capital was issued. (a) Find the percentage increase in non-current assets. (b) State how the growth in total assets was financed. (c) Find the movement in the common-size share of current liabilities.",
          answer: "(a) 28,00,000 − 22,00,000 = ₹6,00,000; 6,00,000 ÷ 22,00,000 × 100 = 27.27% — fixed capacity grew by more than a quarter. (b) Total assets rose from ₹40,00,000 to ₹50,00,000, i.e. ₹10,00,000, funded entirely from inside the firm and from short-term credit: reserves rose ₹7,00,000 (retained profit, since no fresh capital was issued) and current liabilities rose ₹3,00,000, while non-current liabilities stood still — 7,00,000 + 3,00,000 = 10,00,000 ✓. (c) Current liabilities were 4,00,000 ÷ 40,00,000 = 10% of total assets and are now 7,00,000 ÷ 50,00,000 = 14% — a 4 percentage point rise in the share owed to short-term creditors, worth questioning alongside the ₹6,00,000 fixed-asset expansion." },
        { type: "Case-Based", marks: 6,
          q: "Zen Ltd's comparative statement shows the following for 2026–27: revenue from operations +12%, trade receivables +38%, inventories +25%, short-term borrowings +40%, profit before interest and tax +3%. (a) What does the receivables movement indicate? (b) How should the inventory movement be read against revenue? (c) What does the borrowing movement suggest about how the build-up was financed? (d) Which single line would you investigate first, and why?",
          answer: "(a) Receivables grew more than three times faster than revenue — either collections have slowed or credit terms were loosened to hold sales up; the aging schedule and the provision for doubtful debts are the next documents to read. (b) Stock rose 25% against 12% sales growth, so the inventory share of the business doubled in momentum terms — capital is accumulating in goods that are not yet selling, raising holding and obsolescence risk. (c) Short-term borrowings up 40% while profit grew only 3% suggests the receivable-and-inventory build-up was funded by bank credit rather than by internal accruals — the working capital gap is being papered over with debt. (d) Trade receivables first: at +38% against +12% revenue they are the largest divergence, they carry the bad-debt risk, and they explain both the inventory question (goods bought but not sold or collected) and the borrowing question (cash stuck in the cycle). Cite the three percentages in the answer to earn full marks." },
        { type: "Assertion-Reason", marks: 4,
          q: "Assertion (A): A fall in an expense's share of revenue in the common-size statement proves that the firm's efficiency has improved. Reason (R): The share can fall while the absolute expense rises, and a change in accounting policy or product mix can move the share without any change in efficiency at all. Choose the correct option: (a) both A and R are true and R is the correct explanation of A, (b) both A and R are true but R is not the correct explanation of A, (c) A is false but R is true, (d) A is true but R is false.",
          answer: "Option (c) is correct: A is false while R is true. A falling share means the expense grew more slowly than revenue — evidence consistent with improved efficiency, but not proof of it. R gives exactly why proof is impossible: the rupee cost may still have risen (42% to 40% of revenue can accompany an absolute increase when revenue grows), and policy changes, outsourcing shifts or a different product mix can move the percentage with no change in how efficiently the firm works. Efficiency conclusions require the share, the absolute change and a check of the accounting policies together — which is why the common-size statement opens questions rather than closing them." }
      ],

      rat: [
        { type: "Short Answer", marks: 3,
          q: "Current assets ₹5,60,000 (including inventory ₹1,80,000 and prepayments ₹60,000); current liabilities ₹2,80,000. Compute the current and quick ratios and comment.",
          answer: "Current ratio = 5,60,000 ÷ 2,80,000 = 2:1 — the traditional comfort level. Quick ratio = (5,60,000 − 1,80,000 − 60,000) ÷ 2,80,000 = 3,20,000 ÷ 2,80,000 = 1.14:1. The quick ratio above 1 shows that even without selling a rupee of inventory or counting prepayments, the firm has 1.14 of near-cash resources against each rupee of current liabilities — the liquidity is genuine rather than stock-dependent, which is precisely what the pair of ratios is read to establish." },
        { type: "Short Answer", marks: 3,
          q: "Distinguish between liquidity ratios and solvency ratios, giving one example of each.",
          answer: "Liquidity ratios judge the firm's ability to pay what falls due within about twelve months — the current ratio (current assets ÷ current liabilities) and the quick ratio are the standard pair. Solvency ratios judge the long-run structure: how much of the firm is owed versus owned and whether earnings can service that debt — the debt-equity ratio (long-term debt ÷ shareholders' funds) and interest coverage (PBIT ÷ interest) are the standard pair. A firm can be liquid today and insolvent tomorrow if short-term comfort rests on borrowings it cannot roll over; that is why both families are computed together." },
        { type: "Short Answer", marks: 3,
          q: "Why is interest coverage computed on profit before interest and tax rather than on net profit?",
          answer: "Interest is payable out of profit before it is deducted — the pool available to service interest is the profit before interest and tax, so PBIT ÷ interest measures how many times that pool covers the interest bill. Net profit is measured after interest (and usually after tax) have already been taken out, so using it would charge the interest twice and understate the coverage. Tax is irrelevant to the lenders' claim, which is why the pre-tax, pre-interest figure is the correct numerator." },
        { type: "Long Answer", marks: 6,
          q: "From the following compute the gross profit ratio, operating ratio, operating profit ratio, net profit ratio and interest coverage ratio, and interpret: revenue from operations ₹16,00,000; cost of goods sold ₹11,20,000; operating expenses ₹1,60,000; profit before interest and tax ₹3,20,000; interest ₹40,000; no tax is provided for.",
          answer: "Gross profit = 16,00,000 − 11,20,000 = ₹4,80,000 → gross profit ratio = 4,80,000 ÷ 16,00,000 × 100 = 30%. Operating ratio = (11,20,000 + 1,60,000) ÷ 16,00,000 × 100 = 12,80,000 ÷ 16,00,000 × 100 = 80%, so the operating profit ratio is its complement, 20% (which also equals 3,20,000 ÷ 16,00,000 × 100 — a useful cross-check). Net profit = 3,20,000 − 40,000 = ₹2,80,000 → net profit ratio = 2,80,000 ÷ 16,00,000 × 100 = 17.5%. Interest coverage = 3,20,000 ÷ 40,000 = 8 times. Interpretation: the firm keeps 30 paise of each rupee as gross margin and 17.5 paise as net profit; operating costs absorb 12.5 percentage points of the markup; and earnings cover the interest bill eightfold, so the debt service is comfortable even if profit dips sharply." },
        { type: "Long Answer", marks: 6,
          q: "From the following compute any six ratios and comment: shareholders' funds ₹14,00,000; long-term debt ₹6,00,000; current liabilities ₹5,00,000; total assets ₹25,00,000; inventories ₹4,00,000; trade receivables ₹3,00,000; cash and bank ₹2,00,000; prepayments ₹1,00,000; profit before interest and tax ₹2,80,000; interest ₹70,000.",
          answer: "Current assets = 4,00,000 + 3,00,000 + 2,00,000 + 1,00,000 = ₹10,00,000. Current ratio = 10,00,000 ÷ 5,00,000 = 2:1; quick ratio = (10,00,000 − 4,00,000 − 1,00,000) ÷ 5,00,000 = 5,00,000 ÷ 5,00,000 = 1:1. Debt-equity = 6,00,000 ÷ 14,00,000 = 0.43:1; proprietary ratio = 14,00,000 ÷ 25,00,000 = 0.56:1; total asset to debt ratio = 25,00,000 ÷ 6,00,000 = 4.17:1; interest coverage = 2,80,000 ÷ 70,000 = 4 times. Comment: liquidity meets both the 2:1 and the 1:1 marks, so it does not depend on selling stock; owners fund 56 paise of every rupee of assets and each rupee of long-term debt is backed by ₹4.17 of assets — a conservative structure; and earnings cover interest fourfold, comfortable but the least strong of the six readings, so a fall in PBIT to below ₹2,80,000 would quickly erode the cushion." },
        { type: "Case-Based", marks: 4,
          q: "Two firms of the same size report: Firm X — revenue from operations ₹18,00,000, cost of goods sold ₹12,60,000, average inventory ₹3,00,000; Firm Y — revenue from operations ₹30,00,000, cost of goods sold ₹22,50,000, average inventory ₹7,50,000. (a) Compute the inventory turnover of each firm. (b) Which firm turns its stock faster, and by how much? (c) Convert both into average holding periods on a 365-day year. (d) State one caution before concluding that X is the better manager of stock.",
          answer: "(a) Firm X: 12,60,000 ÷ 3,00,000 = 4.2 times. Firm Y: 22,50,000 ÷ 7,50,000 = 3 times. (b) X turns its stock faster — 4.2 times against Y's 3 times, about 40% more turns per year on the same measure. (c) X: 365 ÷ 4.2 ≈ 87 days of stock; Y: 365 ÷ 3 ≈ 122 days — roughly five weeks less shelf time for X. (d) A faster turnover is better only if service levels and margins hold: X may be achieving 87 days by holding dangerously thin safety stock and risking stock-outs and lost sales, or it may simply carry a faster-moving product mix than Y. Compare gross margins, stock-out complaints and the industry norm before declaring a winner." },
        { type: "Case-Based", marks: 6,
          q: "A bank is screening a borrower. The firm reports: current assets ₹9,60,000 (inventories ₹4,80,000, prepayments ₹3,60,000, balance in cash and receivables ₹1,20,000); current liabilities ₹6,00,000; long-term debt ₹8,00,000; shareholders' funds ₹12,00,000; profit before interest and tax ₹2,40,000; interest ₹1,20,000. (a) Compute the current and quick ratios. (b) Interpret the gap between them. (c) Compute interest coverage and comment. (d) Advise the bank on a long-term loan to this firm.",
          answer: "(a) Current ratio = 9,60,000 ÷ 6,00,000 = 1.6:1. Quick assets = 9,60,000 − 4,80,000 − 3,60,000 = ₹1,20,000; quick ratio = 1,20,000 ÷ 6,00,000 = 0.2:1. (b) The headline 1.6:1 is carried almost entirely by inventory and prepayments — of ₹9,60,000 of current assets only ₹1,20,000 is near cash, so the firm can meet current obligations only by selling stock or deferring payments. The acid test of 0.2:1 is the real picture. (c) Interest coverage = 2,40,000 ÷ 1,20,000 = 2 times — earnings cover the interest bill just twice, so a 50% fall in PBIT would leave the interest unpaid. (d) Debt-equity is 8,00,000 ÷ 12,00,000 = 0.67:1 and is not alarming, but with a quick ratio of 0.2:1 and coverage of 2 times the firm is thin on both fronts: the bank should decline a plain long-term loan, or grant one only against collateral and covenants requiring a minimum quick ratio and interest cover, converting a large part of the borrowing into short-term reviewable credit." },
        { type: "Assertion-Reason", marks: 4,
          q: "Assertion (A): A high inventory turnover ratio always indicates better performance. Reason (R): Turnover computed against a very small average inventory may be the result of stock-outs, lost sales and lost goodwill — the ratio must be read together with service levels, margins and the industry average. Choose the correct option: (a) both A and R are true and R is the correct explanation of A, (b) both A and R are true but R is not the correct explanation of A, (c) A is false but R is true, (d) A is true but R is false.",
          answer: "Option (c) is correct: A is false while R is true. The word 'always' sinks the assertion — a very high turnover can come from lean, well-managed stocking or from stocking so thin that the firm runs out of goods, loses sales and irritates customers, and neither the ratio nor its arithmetic reveals which. R supplies exactly that caution: turnover is meaningful only against the industry norm, the firm's own trend, and evidence on margins and service levels. The honest analyst reports the computed figure — say 12 times against an industry average of 6 — and then asks what produced it before calling it performance." }
      ]
    }
  });
})();
