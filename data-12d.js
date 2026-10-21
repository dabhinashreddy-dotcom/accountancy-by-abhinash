/* ============================================================
   CLASS 12 — PART B (OPTION 1): ANALYSIS OF FINANCIAL
   STATEMENTS (v83) — Chapters 10–12: Analysis of Financial
   Statements (fsa), Accounting Ratios (rat), Cash Flow
   Statement (cf). Plain browser script; C12_DATA must exist.
   Original teaching material for the published CBSE Class 12
   Accountancy curriculum (session 2026-27) — not copied from
   any textbook.
   ============================================================ */
(function () {
  "use strict";

  C12_DATA.register({

    content: {

      /* ---------- Chapter 10: Analysis of Financial Statements ---------- */
      fsa: {
        theory: {
          simple: [
            {
              h: "What Analysis Is — and Who It Serves",
              p: "Financial statement analysis is the art of turning two years of figures into a story: what changed, by how much, in which direction, and what it implies. Different readers read different chapters of that story. A shareholder watches profitability, a banker watches the ability to repay, management watches both. The statements are the same; the questions differ.",
              list: [
                { term: "Internal analysis", def: "By management itself — for decisions about pricing, cost, dividend and expansion." },
                { term: "External analysis", def: "By outsiders with limited access — lenders, investors, regulators — working mainly from the published statements." },
                { term: "Horizontal analysis", def: "Comparing one year with another — the comparative statement, showing absolute and percentage change." },
                { term: "Vertical analysis", def: "Reading each year's figures against a base within that year — the common-size statement, where every line is a percentage of a chosen total." }
              ]
            },
            {
              h: "The Comparative Statement",
              p: "Take each line of the statement of profit and loss or the balance sheet across two (or more) years. Subtract to get the absolute change; express it against the base year to get the percentage change. The result is not a diagnosis — a 40% rise in receivables is a question, not a verdict — but it tells you exactly where to look next.",
              formula: "Change = Current year − Base year · Change % = Change ÷ Base year × 100"
            },
            {
              h: "The Common-Size Statement",
              p: "In the statement of profit and loss, revenue from operations is the natural 100% and every expense and profit line is shown as a percentage of it. In the balance sheet, total assets (equity and liabilities too) serve as the 100% base. This removes the effect of size: two firms of very different scale can now be compared line by line, and the structural picture of each becomes visible.",
              p2: "A firm whose employee costs are 45% of revenue against a peer's 30% has a labour intensity problem — or a pricing one. The common-size statement surfaces the difference; investigation explains it."
            }
          ],
          advanced: [
            {
              h: "Reading a Comparative Statement Like an Analyst",
              p: "Absolute change flatters big numbers; percentage change flatters small ones. Revenue rising ₹10 lakh looks impressive until you see it is 4% while employee costs rose 18%. Comparative statements are read by pairs: the absolute line tells you materiality, the percentage line tells you momentum. Disagreement between the two — a large absolute change with a small percentage, or the reverse — is itself information.",
              p2: "Compare expense lines against revenue, not against themselves. An expense rising 12% while revenue rises 20% is improving efficiency; the same 12% against 6% revenue growth is deterioration."
            },
            {
              h: "Comparative Balance Sheet — What Changed in the Position",
              p: "The same technique on the position statement reveals the financing decisions: did the growth come from borrowings or from profits retained? Did inventory build up faster than sales? Did trade receivables grow while revenue stagnated — the oldest warning sign in accounting. Each line of the comparative balance sheet is a trace of a decision taken during the year.",
              p2: "A long-term borrowing line that doubled while fixed assets did not move invites the question: what was the money for?"
            },
            {
              h: "Limitations — Because Numbers Do Not Speak for Themselves",
              p: "Analysis inherits every weakness of the statements themselves: historical cost ignores inflation, a change in accounting policy can move a line without any economic change, and inter-firm comparison fails when the firms use different year-ends or classifications. Window dressing — a one-day bank balance at year end, an invoice suppressed until January — can make a picture look better for exactly one reporting date. Analysis is evidence, not proof.",
              p2: "Qualitative information — a strike settled in April, a patent granted in June — never appears in the comparative statement, yet often explains it."
            }
          ]
        },

        concepts: [
          { title: "Financial statement analysis", body: "The examination of published statements to judge profitability, solvency and efficiency — by outsiders with limited access, or by management with full access." },
          { title: "Comparative statement", body: "A statement showing each line across years with absolute change and percentage change against a base year — horizontal analysis." },
          { title: "Common-size statement", body: "A statement where each line is expressed as a percentage of a chosen base within the same year — revenue for profit and loss, total assets for the balance sheet — vertical analysis." },
          { title: "Limitations of analysis", body: "Historical cost, changed policies, window dressing, differing year-ends and the absence of qualitative information — all of which cap what any ratio or comparison can prove." }
        ],

        formats: [
          {
            title: "Comparative Statement of Profit and Loss — skeleton",
            note: "Change against the base year, absolute and percentage.",
            head: ["Particulars", "2025–26 (₹)", "2026–27 (₹)", "Change (₹)", "Change (%)"],
            rows: [
              ["Revenue from operations", "20,00,000", "25,00,000", "5,00,000", "25.00"],
              ["Other income", "40,000", "50,000", "10,000", "25.00"],
              ["Employee benefits expense", "8,00,000", "9,60,000", "1,60,000", "20.00"],
              ["Other expenses", "6,00,000", "8,00,000", "2,00,000", "33.33"],
              ["Profit before tax", "6,40,000", "7,90,000", "1,50,000", "23.44"]
            ]
          },
          {
            title: "Common-size Statement of Profit and Loss — skeleton",
            note: "Revenue from operations = 100%. Every other line is a percentage of it.",
            head: ["Particulars", "2025–26 (%)", "2026–27 (%)"],
            rows: [
              ["Revenue from operations", "100.00", "100.00"],
              ["Other income", "2.00", "2.00"],
              ["Employee benefits expense", "40.00", "38.40"],
              ["Other expenses", "30.00", "32.00"],
              ["Profit before tax", "32.00", "31.60"]
            ]
          }
        ],

        numericals: [
          {
            id: 1, difficulty: "Easy",
            question: "Revenue from operations was ₹20,00,000 last year and ₹25,00,000 this year. The absolute and percentage increases are:",
            options: ["₹5,00,000 and 25%", "₹5,00,000 and 20%", "₹4,00,000 and 20%", "₹25,00,000 and 25%"],
            answerIndex: 0,
            explanation: "Change = 25,00,000 − 20,00,000 = ₹5,00,000; percentage = 5,00,000 ÷ 20,00,000 × 100 = 25%."
          },
          {
            id: 2, difficulty: "Medium",
            question: "In a common-size statement of profit and loss, the base (100%) is:",
            options: ["Revenue from operations", "Total assets", "Net profit", "Shareholders' funds"],
            answerIndex: 0,
            explanation: "In the profit and loss statement, revenue from operations is the natural base; for the balance sheet it is total assets."
          },
          {
            id: 3, difficulty: "Medium",
            question: "Other expenses rose from ₹6,00,000 to ₹8,00,000 while revenue rose from ₹20,00,000 to ₹25,00,000. In common-size terms, other expenses:",
            options: ["Rose from 30% to 32% of revenue", "Fell from 30% to 25%", "Stayed at 30%", "Rose from 25% to 30%"],
            answerIndex: 0,
            explanation: "6,00,000 ÷ 20,00,000 = 30%; 8,00,000 ÷ 25,00,000 = 32%. The expense grew faster than revenue — a two-point deterioration."
          },
          {
            id: 4, difficulty: "Easy",
            question: "Comparative statements are an example of:",
            options: ["Horizontal analysis — change over time", "Vertical analysis — structure within a year", "Ratio analysis", "Cash flow analysis"],
            answerIndex: 0,
            explanation: "Comparing a line across years is horizontal; expressing it against a base within one year is vertical (common-size)."
          },
          {
            id: 5, difficulty: "Hard",
            question: "Employee benefits expense rose 20% while revenue rose 25%. The correct reading is:",
            options: ["Employee cost efficiency improved — the expense share of revenue fell", "Employee cost efficiency worsened", "Profit must have fallen", "Nothing can be said"],
            answerIndex: 0,
            explanation: "The expense grew slower than revenue, so its share of revenue fell — efficiency improved, all else equal."
          },
          {
            id: 6, difficulty: "Medium",
            question: "Trade receivables grew 40% while revenue grew 5%. The analyst should first suspect:",
            options: ["Slower collections or aggressive credit sales", "A fall in inventory", "An increase in share capital", "Higher depreciation"],
            answerIndex: 0,
            explanation: "Receivables far outpacing revenue is the classic sign of collection trouble or credit pushed to sustain sales."
          },
          {
            id: 7, difficulty: "Easy",
            question: "In a common-size balance sheet, each line is expressed as a percentage of:",
            options: ["Total assets", "Revenue from operations", "Net profit", "Called-up capital"],
            answerIndex: 0,
            explanation: "Total assets — which equals total equity and liabilities — is the base for the vertical reading of position."
          },
          {
            id: 8, difficulty: "Hard",
            question: "Which of the following is NOT a limitation of financial statement analysis?",
            options: ["It uses figures the statements actually report", "Historical cost ignores price-level changes", "Window dressing can mislead at a date", "Inter-firm comparison may use different policies"],
            answerIndex: 0,
            explanation: "Working from reported figures is the method's foundation, not a defect; the others are genuine limitations."
          },
          {
            id: 9, difficulty: "Medium",
            question: "A comparative statement of profit and loss shows revenue up 25% and profit before tax up 23.44%. The operating leverage reading is:",
            options: ["Profit grew slightly slower than revenue — the cost share rose marginally", "Profit grew faster than revenue", "Costs fell absolutely", "The firm is loss-making"],
            answerIndex: 0,
            explanation: "23.44% < 25% means the expense share of revenue increased marginally — profit margin dipped a little."
          },
          {
            id: 10, difficulty: "Easy",
            question: "External analysis is conducted mainly by:",
            options: ["Outsiders with limited access — lenders, investors, regulators", "The board of directors", "The internal audit team", "The production manager"],
            answerIndex: 0,
            explanation: "External users depend on the published statements alone; internal users have the ledgers behind them."
          }
        ],

        activity: {
          type: "statement",
          title: "Comparative Statement Builder",
          instruction: "Build each comparative statement line by line: pick whether the line increased, decreased or stayed, and enter the amount of movement. Verify a statement to unlock its working.",
          statements: [
            {
              title: "Statement 1 — Profit and loss movements (2025–26 → 2026–27)",
              prompt: "Decide the direction of each movement and enter the absolute change in ₹.",
              needsAmount: true,
              rows: [
                { label: "Revenue from operations: ₹20,00,000 → ₹25,00,000", options: ["Increase", "Decrease", "No change"], answer: "Increase", amount: 500000 },
                { label: "Other income: ₹40,000 → ₹50,000", options: ["Increase", "Decrease", "No change"], answer: "Increase", amount: 10000 },
                { label: "Employee benefits expense: ₹8,00,000 → ₹9,60,000", options: ["Increase", "Decrease", "No change"], answer: "Increase", amount: 160000 },
                { label: "Other expenses: ₹6,00,000 → ₹8,00,000", options: ["Increase", "Decrease", "No change"], answer: "Increase", amount: 200000 },
                { label: "Profit before tax: ₹6,40,000 → ₹7,90,000", options: ["Increase", "Decrease", "No change"], answer: "Increase", amount: 150000 }
              ],
              working: "Every line moved up, but not equally: revenue +25%, employee costs +20%, other expenses +33.33%. The expense that outran revenue — other expenses — is where an analyst starts asking questions."
            },
            {
              title: "Statement 2 — Common-size the profit and loss (base: revenue)",
              prompt: "Each row gives a figure and the year's revenue. Classify the direction of the change in its share of revenue, and enter the percentage of revenue for the current year.",
              needsAmount: true,
              rows: [
                { label: "Revenue from operations ₹25,00,000 — its own share", options: ["100% of revenue", "Base not 100%", "Cannot be expressed"], answer: "100% of revenue", amount: 100 },
                { label: "Employee benefits ₹9,60,000 on revenue ₹25,00,000 (was 40.00%)", options: ["Share fell", "Share rose", "Share unchanged"], answer: "Share fell", amount: 38.4 },
                { label: "Other expenses ₹8,00,000 on revenue ₹25,00,000 (was 30.00%)", options: ["Share rose", "Share fell", "Share unchanged"], answer: "Share rose", amount: 32 },
                { label: "Profit before tax ₹7,90,000 on revenue ₹25,00,000 (was 32.00%)", options: ["Share fell", "Share rose", "Share unchanged"], answer: "Share fell", amount: 31.6 }
              ],
              working: "9,60,000 ÷ 25,00,000 = <b>38.40%</b> (down from 40%); 8,00,000 ÷ 25,00,000 = <b>32.00%</b> (up from 30%); 7,90,000 ÷ 25,00,000 = <b>31.60%</b> (down from 32%). Employee efficiency improved, other expenses worsened, and the margin dipped slightly."
            },
            {
              title: "Statement 3 — Balance sheet: what changed in the position?",
              prompt: "Classify each movement's direction and enter the change in ₹.",
              needsAmount: true,
              rows: [
                { label: "Trade receivables: ₹4,00,000 → ₹5,60,000", options: ["Increase", "Decrease", "No change"], answer: "Increase", amount: 160000 },
                { label: "Inventory: ₹3,00,000 → ₹2,70,000", options: ["Decrease", "Increase", "No change"], answer: "Decrease", amount: 30000 },
                { label: "Long-term borrowings: ₹5,00,000 → ₹8,00,000", options: ["Increase", "Decrease", "No change"], answer: "Increase", amount: 300000 },
                { label: "Cash and bank balances: ₹1,20,000 → ₹90,000", options: ["Decrease", "Increase", "No change"], answer: "Decrease", amount: 30000 }
              ],
              working: "Receivables +₹1,60,000 while (from Statement 1) revenue grew only 25% — collections deserve a look. Borrowings +₹3,00,000 financed something; inventory fell ₹30,000 and cash fell ₹30,000. The comparative balance sheet turns decisions into numbers an analyst can question."
            }
          ]
        },

        examCases: [
          {
            id: 1,
            title: "Two years, one company",
            passage: "A company reports the following: revenue from operations ₹20,00,000 (2025–26) and ₹25,00,000 (2026–27); other income ₹40,000 and ₹50,000; employee benefits expense ₹8,00,000 and ₹9,60,000; other expenses ₹6,00,000 and ₹8,00,000. Total assets stood at ₹16,00,000 and ₹20,00,000 on the two dates.",
            difficulty: "Hard",
            subs: [
              {
                q: "Absolute increase in revenue from operations:",
                options: ["₹5,00,000", "₹4,00,000", "₹25,00,000", "₹1,00,000"],
                answerIndex: 0,
                reasoning: "25,00,000 − 20,00,000 = ₹5,00,000."
              },
              {
                q: "Percentage increase in other expenses:",
                options: ["33.33%", "25%", "20%", "16.67%"],
                answerIndex: 0,
                reasoning: "2,00,000 ÷ 6,00,000 × 100 = 33.33% — the fastest-growing line in the statement."
              },
              {
                q: "Common-size employee benefits expense for 2026–27:",
                options: ["38.40%", "40.00%", "32.00%", "31.60%"],
                answerIndex: 0,
                reasoning: "9,60,000 ÷ 25,00,000 × 100 = 38.40% — down from 40%, an improvement in share terms."
              },
              {
                q: "Profit before tax as a percentage of revenue in 2026–27:",
                options: ["31.60%", "32.00%", "25.00%", "38.40%"],
                answerIndex: 0,
                reasoning: "PBT = 25,50,000 − 17,60,000 = 7,90,000; 7,90,000 ÷ 25,00,000 = 31.60%."
              }
            ]
          },
          {
            id: 2,
            title: "Reading a common-size balance sheet",
            passage: "A company's balance sheets report total assets of ₹50,00,000 (2025–26) and ₹60,00,000 (2026–27). Shareholders' funds stood at ₹30,00,000 and ₹39,00,000; non-current liabilities at ₹8,00,000 and ₹6,00,000; and current liabilities at ₹12,00,000 and ₹15,00,000 on the two dates.",
            difficulty: "Hard",
            subs: [
              {
                q: "Common-size shareholders' funds as a share of total assets in 2025–26:",
                options: ["60%", "50%", "65%", "70%"],
                answerIndex: 0,
                reasoning: "30,00,000 ÷ 50,00,000 × 100 = 60% of total assets."
              },
              {
                q: "The same share in 2026–27:",
                options: ["65%", "60%", "70%", "58.50%"],
                answerIndex: 0,
                reasoning: "39,00,000 ÷ 60,00,000 × 100 = 65% — owners now fund a larger share of the balance sheet."
              },
              {
                q: "Net change in total external liabilities over the year:",
                options: ["An increase of ₹1,00,000", "A decrease of ₹2,00,000", "An increase of ₹3,00,000", "No change"],
                answerIndex: 0,
                reasoning: "External liabilities (8,00,000 + 12,00,000 = 20,00,000) rose to 6,00,000 + 15,00,000 = 21,00,000 — non-current fell ₹2,00,000 while current rose ₹3,00,000, a net increase of ₹1,00,000."
              },
              {
                q: "Non-current liabilities fell from 16% to 10% of total assets. The correct reading:",
                options: ["Gearing fell — the firm relies less on borrowed funds", "Gearing rose", "The firm became less liquid", "Interest rates on debt rose"],
                answerIndex: 0,
                reasoning: "8,00,000 ÷ 50,00,000 = 16% and 6,00,000 ÷ 60,00,000 = 10% — a smaller borrowed share of the balance sheet, not a liquidity or interest-rate statement."
              }
            ]
          }
        ],

        examNumericals: [
          {
            id: 1, q: "Revenue ₹20,00,000 → ₹25,00,000. Find the percentage increase in revenue (%).",
            value: 25,
            explanation: "5,00,000 ÷ 20,00,000 × 100 = 25%.",
            difficulty: "Easy"
          },
          {
            id: 2, q: "Other expenses ₹6,00,000 on revenue ₹20,00,000 (last year); ₹8,00,000 on ₹25,00,000 (this year). Find the change in the common-size percentage of other expenses (percentage points).",
            value: 2,
            explanation: "30% → 32% = an increase of 2 percentage points.",
            difficulty: "Medium"
          }
        ],

        quickRevision: {
          definition: "Analysis of financial statements examines published accounts to judge performance and position — horizontally (change across years, the comparative statement) and vertically (structure within a year, the common-size statement) — within stated limitations.",
          keyPoints: [
            "Comparative statement = absolute change + percentage change against the base year (horizontal).",
            "Common-size statement = every line as a percentage of a base within the same year (vertical).",
            "Profit and loss base: revenue from operations. Balance sheet base: total assets.",
            "Compare expense growth against revenue growth — not against the expense's own past.",
            "Receivables growing far faster than revenue is a collection warning.",
            "Limitations: historical cost, policy changes, window dressing, differing year-ends, no qualitative data."
          ],
          calculationSteps: [
            "Step 1 — Lay the two years side by side, base year first.",
            "Step 2 — Absolute change = current − base for every line.",
            "Step 3 — Percentage change = change ÷ base × 100 (never divide by the current year).",
            "Step 4 — Common-size: divide each line by the year's base (revenue or total assets) × 100.",
            "Step 5 — Read in pairs: absolute for materiality, percentage for momentum; then question every line that outran revenue."
          ],
          formulas: [
            { label: "Absolute change", expr: "Current year − Base year" },
            { label: "Percentage change", expr: "(Change ÷ Base year) × 100" },
            { label: "Common-size (P&L)", expr: "(Line ÷ Revenue from operations) × 100" },
            { label: "Common-size (BS)", expr: "(Line ÷ Total assets) × 100" }
          ],
          distinctions: [
            {
              title: "Comparative vs common-size",
              head: ["Comparative statement", "Common-size statement"],
              rows: [
                ["Shows", "Change across years", "Structure within a year"],
                ["Base", "The base year's figure", "Revenue (P&L) or total assets (BS)"],
                ["Answers", "How much did it move?", "How big is it relative to the whole?"],
                ["Flatters", "Big absolute numbers", "Neither — size is removed"]
              ]
            }
          ],
          examPoints: [
            "Percentage change is always on the base year — writing the base in the working earns the method mark.",
            "In a common-size question, state the base explicitly before computing.",
            "A 'comment on' question wants two numbers compared and one sentence of interpretation — no essay."
          ],
          commonMistakes: [
            "Dividing the change by the current year instead of the base year.",
            "Common-sizing the profit and loss statement against total assets.",
            "Calling a movement 'good' or 'bad' without comparing it to the revenue movement."
          ],
          mnemonic: "H & V — Horizontal across years (comparative), Vertical within a year (common-size)."
        }
      },

      /* ---------- Chapter 11: Accounting Ratios ---------- */
      rat: {
        theory: {
          simple: [
            {
              h: "What a Ratio Is",
              p: "A ratio is one number held against another to say something neither says alone. Accounting ratios turn statement figures into statements about the business: can it pay next month's bills, can it service its debt, how fast does it turn stock into sales, how much of every rupee of revenue survives as profit. The formula is arithmetic; the interpretation is the subject.",
              list: [
                { term: "Liquidity ratios", def: "Short-run paying ability — current ratio and quick ratio, measured against the next twelve months." },
                { term: "Solvency ratios", def: "Long-run structure — how much of the firm is owed versus owned: debt-equity and its cousins." },
                { term: "Activity (turnover) ratios", def: "How intensively the assets are used — inventory turnover, trade receivables and trade payables turnover, working capital turnover." },
                { term: "Profitability ratios", def: "How much profit the activity throws out — gross profit rate, net profit rate, return on investment, earnings per share." }
              ]
            },
            {
              h: "Liquidity — the Next Twelve Months",
              p: "The current ratio holds current assets against current liabilities: two to one is the textbook comfort mark, but a ratio built from slow-moving inventory and uncollectable receivables is comfort without substance. That is why the quick ratio exists — it removes inventory and prepayments, leaving cash, bank, trade receivables and short-term investments against the same liabilities. A quick ratio near one is the acid test.",
              formula: "Current ratio = Current assets ÷ Current liabilities · Quick ratio = (Current assets − Inventory − Prepayments) ÷ Current liabilities"
            },
            {
              h: "Profitability — the Margin and the Return",
              p: "The gross profit rate measures the markup on trading; the net profit rate measures what survives every expense. Return on investment holds profit before interest and tax against the capital employed that produced it — the single most honest measure of how hard the whole capital base is working, because it ignores how that capital was financed and looks only at what it earned.",
              formula: "Gross profit rate = Gross profit ÷ Revenue × 100 · Net profit rate = Net profit ÷ Revenue × 100 · ROI = PBIT ÷ Capital employed × 100"
            }
          ],
          advanced: [
            {
              h: "Solvency — Who Owns the Firm, and Who Is Owed",
              p: "The debt-equity ratio sets long-term debt against shareholders' funds: how many rupees outsiders have put in for every rupee the owners have. Interest coverage — PBIT against interest — asks whether the earnings can service the debt at all. Together they separate a conservative structure from a leveraged one: the same current ratio can sit over two completely different long-run risks.",
              formula: "Debt-equity = Long-term debt ÷ Shareholders' funds · Interest coverage = PBIT ÷ Interest"
            },
            {
              h: "Activity — the Speed of the Machine",
              p: "Inventory turnover says how many times the stock became sales in the year; the days figure divides 365 by it. Trade receivables turnover says how quickly credit customers pay; trade payables turnover how quickly the firm pays its own suppliers. Each converts a balance-sheet stock into an income-statement flow — the only way to judge whether ₹10 lakh of inventory is normal for the business or a year's stagnation.",
              formula: "Inventory turnover = COGS ÷ Average inventory · Receivables turnover = Revenue ÷ Average trade receivables · Days = 365 ÷ Turnover"
            },
            {
              h: "Interpreting Without Fooling Yourself",
              p: "A ratio is a comparison device: against last year, against the industry, against the stated standard. Alone, it means almost nothing — a current ratio of 2.5 could be health or dead inventory. Trends beat snapshots; pairs beat singles (current with quick, gross with net, debt with coverage). And every ratio inherits the statements' limitations — historical costs, policy choices, year-end window dressing — so the analyst's first question is always what the figure cannot be telling them.",
              p2: "Rounding the denominator changes the story: state your formula, state your inputs, and the examiner can follow every step."
            }
          ]
        },

        concepts: [
          { title: "Current ratio", body: "Current assets divided by current liabilities — the standard measure of short-term paying ability; about 2:1 is the traditional comfort level." },
          { title: "Quick ratio", body: "(Current assets − inventory − prepayments) ÷ current liabilities — the acid test, counting only assets convertible to cash within days." },
          { title: "Debt-equity ratio", body: "Long-term debt divided by shareholders' funds — the structural measure of how the firm is financed." },
          { title: "Return on investment", body: "Profit before interest and tax ÷ capital employed × 100 — the return the whole capital base earned, independent of its financing mix." }
        ],

        formats: [
          {
            title: "Ratio formula sheet — the four families",
            note: "State formula, substitute, answer — every time.",
            head: ["Family", "Ratio", "Formula"],
            rows: [
              ["Liquidity", "Current ratio", "Current assets ÷ Current liabilities"],
              ["Liquidity", "Quick ratio", "(Current assets − Inventory − Prepayments) ÷ Current liabilities"],
              ["Solvency", "Debt-equity", "Long-term debt ÷ Shareholders' funds"],
              ["Solvency", "Interest coverage", "PBIT ÷ Interest"],
              ["Activity", "Inventory turnover", "COGS ÷ Average inventory"],
              ["Profitability", "Return on investment", "PBIT ÷ Capital employed × 100"]
            ]
          },
          {
            title: "Working note — capital employed",
            note: "Two routes to the same figure; use whichever the question feeds you.",
            head: ["Route", "Build-up", "Illustration (₹)"],
            rows: [
              ["From the asset side", "Shareholders' funds + Long-term debt", "8,00,000 + 2,00,000 = 10,00,000"],
              ["From total assets", "Total assets − Current liabilities", "12,00,000 − 2,00,000 = 10,00,000"],
              ["PBIT for ROI", "Net profit + Interest + Tax", "1,20,000 + 40,000 + 30,000 = 1,90,000"],
              ["ROI", "PBIT ÷ Capital employed", "1,90,000 ÷ 10,00,000 = 19%"]
            ]
          }
        ],

        numericals: [
          {
            id: 1, difficulty: "Easy",
            question: "Current assets ₹6,00,000; current liabilities ₹3,00,000. The current ratio is:",
            options: ["2:1", "1:2", "3:1", "1:1"],
            answerIndex: 0,
            explanation: "6,00,000 ÷ 3,00,000 = 2:1 — the traditional comfort level."
          },
          {
            id: 2, difficulty: "Medium",
            question: "Current assets ₹6,00,000 include inventory ₹2,00,000 and prepayments ₹40,000; current liabilities ₹3,00,000. The quick ratio is:",
            options: ["1.2:1", "2:1", "0.8:1", "1.52:1"],
            answerIndex: 0,
            explanation: "(6,00,000 − 2,00,000 − 40,000) ÷ 3,00,000 = 3,60,000 ÷ 3,00,000 = 1.2:1."
          },
          {
            id: 3, difficulty: "Medium",
            question: "Long-term debt ₹2,00,000; shareholders' funds ₹8,00,000. Debt-equity ratio:",
            options: ["0.25:1", "4:1", "1:4", "0.5:1"],
            answerIndex: 0,
            explanation: "2,00,000 ÷ 8,00,000 = 0.25:1 — a conservatively financed firm."
          },
          {
            id: 4, difficulty: "Easy",
            question: "Revenue from operations ₹10,00,000; cost of goods sold ₹6,00,000. Gross profit rate is:",
            options: ["40%", "60%", "66.67%", "25%"],
            answerIndex: 0,
            explanation: "Gross profit = 4,00,000; 4,00,000 ÷ 10,00,000 × 100 = 40%."
          },
          {
            id: 5, difficulty: "Medium",
            question: "PBIT ₹1,90,000; capital employed ₹10,00,000. Return on investment:",
            options: ["19%", "12%", "10%", "1.9%"],
            answerIndex: 0,
            explanation: "1,90,000 ÷ 10,00,000 × 100 = 19% — the whole capital base earned a fifth of itself."
          },
          {
            id: 6, difficulty: "Hard",
            question: "COGS ₹6,00,000; closing inventory ₹1,50,000; opening inventory ₹1,00,000. Inventory turnover:",
            options: ["4.8 times", "4 times", "6 times", "1.2 times"],
            answerIndex: 0,
            explanation: "Average inventory = 1,25,000; 6,00,000 ÷ 1,25,000 = 4.8 times."
          },
          {
            id: 7, difficulty: "Medium",
            question: "Revenue ₹10,00,000; average trade receivables ₹2,00,000. Receivables turnover:",
            options: ["5 times", "20 times", "0.2 times", "2 times"],
            answerIndex: 0,
            explanation: "10,00,000 ÷ 2,00,000 = 5 times — collections average about 73 days (365 ÷ 5)."
          },
          {
            id: 8, difficulty: "Medium",
            question: "PBIT ₹3,60,000; interest ₹60,000. Interest coverage:",
            options: ["6 times", "0.17 times", "60 times", "3 times"],
            answerIndex: 0,
            explanation: "3,60,000 ÷ 60,000 = 6 times — earnings cover the interest sixfold."
          },
          {
            id: 9, difficulty: "Hard",
            question: "Inventory turnover rises from 4 to 7 times a year. The correct reading is:",
            options: ["Stock moves faster — better utilisation or leaner stocking", "The firm is holding more dead stock", "Profit must have fallen", "The current ratio definitely rose"],
            answerIndex: 0,
            explanation: "Faster turnover means stock converts to sales more often — efficiency improving, provided service levels and margins hold."
          },
          {
            id: 10, difficulty: "Easy",
            question: "Which ratio family directly measures short-term paying ability?",
            options: ["Liquidity ratios", "Solvency ratios", "Activity ratios", "Profitability ratios"],
            answerIndex: 0,
            explanation: "Current and quick ratios compare near-term resources against near-term obligations."
          }
        ],

        activity: {
          type: "match",
          title: "Ratio Match-Up",
          instruction: "Match every ratio to its correct formula, then every result to its interpretation. Each set verifies as a whole — the working appears when every pair is right.",
          sets: [
            {
              title: "Set 1 — Ratio → formula",
              prompt: "Click a ratio on the left, then its formula on the right.",
              pairs: [
                { left: "Current ratio", right: "Current assets ÷ Current liabilities" },
                { left: "Quick ratio", right: "(Current assets − Inventory − Prepayments) ÷ Current liabilities" },
                { left: "Debt-equity ratio", right: "Long-term debt ÷ Shareholders' funds" },
                { left: "Inventory turnover", right: "Cost of goods sold ÷ Average inventory" },
                { left: "Return on investment", right: "Profit before interest and tax ÷ Capital employed × 100" },
                { left: "Interest coverage", right: "Profit before interest and tax ÷ Interest" }
              ],
              working: "The formula is the first mark in every ratio question — write it, substitute into it, then reduce."
            },
            {
              title: "Set 2 — Result → interpretation",
              prompt: "Match each computed result to the one interpretation the numbers support.",
              pairs: [
                { left: "Current ratio 1.1:1 with quick ratio 0.3:1", right: "Liquidity depends on selling inventory — the gap is stock-heavy" },
                { left: "Debt-equity 0.25:1 with interest coverage 6×", right: "Conservatively financed — debt is small and easily serviced" },
                { left: "Inventory turnover fell 6 → 3 times", right: "Stock is moving half as fast — investigate slow lines" },
                { left: "Receivables turnover 5 times (≈73 days)", right: "Credit customers pay in about two and a half months" },
                { left: "Gross profit 40%, net profit 8%", right: "Strong markup, but operating expenses absorb most of it" }
              ],
              working: "Every interpretation above uses two figures, not one. A lone ratio is a fact; a pair of ratios is an opinion worth writing down."
            }
          ]
        },

        examCases: [
          {
            id: 1,
            title: "One firm, four questions",
            passage: "A company reports: revenue from operations ₹10,00,000; cost of goods sold ₹6,00,000; PBIT ₹1,90,000; interest ₹40,000; current assets ₹6,00,000 (including inventory ₹2,00,000 and prepayments ₹40,000); current liabilities ₹3,00,000; long-term debt ₹2,00,000; shareholders' funds ₹8,00,000.",
            difficulty: "Hard",
            subs: [
              {
                q: "Gross profit rate:",
                options: ["40%", "60%", "19%", "13%"],
                answerIndex: 0,
                reasoning: "Gross profit = 10,00,000 − 6,00,000 = 4,00,000 → 40% of revenue."
              },
              {
                q: "Quick ratio:",
                options: ["1.2:1", "2:1", "0.8:1", "1.2%"],
                answerIndex: 0,
                reasoning: "(6,00,000 − 2,00,000 − 40,000) ÷ 3,00,000 = 3,60,000 ÷ 3,00,000 = 1.2:1."
              },
              {
                q: "Interest coverage:",
                options: ["4.75 times", "6 times", "1.5 times", "12 times"],
                answerIndex: 0,
                reasoning: "1,90,000 ÷ 40,000 = 4.75 times."
              },
              {
                q: "Return on investment:",
                options: ["19%", "12%", "25%", "4.75%"],
                answerIndex: 0,
                reasoning: "Capital employed = 8,00,000 + 2,00,000 = 10,00,000; 1,90,000 ÷ 10,00,000 = 19%."
              }
            ]
          },
          {
            id: 2,
            title: "Five ratios from one year",
            passage: "For the year ended 31 March 2027 a company reports: revenue from operations ₹11,25,000; cost of materials consumed ₹7,20,000; opening inventory ₹1,60,000 and closing inventory ₹2,00,000; current assets ₹4,80,000; current liabilities ₹3,20,000; profit before interest and tax ₹2,40,000; and interest ₹40,000.",
            difficulty: "Hard",
            subs: [
              {
                q: "Gross profit ratio:",
                options: ["36%", "40%", "64%", "30%"],
                answerIndex: 0,
                reasoning: "Gross profit = 11,25,000 − 7,20,000 = 4,05,000; 4,05,000 ÷ 11,25,000 × 100 = 36%."
              },
              {
                q: "Inventory turnover ratio:",
                options: ["4 times", "5 times", "4.5 times", "3 times"],
                answerIndex: 0,
                reasoning: "Average inventory = (1,60,000 + 2,00,000) ÷ 2 = ₹1,80,000; 7,20,000 ÷ 1,80,000 = 4 times."
              },
              {
                q: "Quick ratio:",
                options: ["0.875:1", "1.5:1", "1.2:1", "0.5:1"],
                answerIndex: 0,
                reasoning: "Quick assets = 4,80,000 − 2,00,000 = ₹2,80,000; 2,80,000 ÷ 3,20,000 = 0.875:1 — below the 1:1 acid test."
              },
              {
                q: "Interest coverage ratio:",
                options: ["6 times", "5 times", "4 times", "8 times"],
                answerIndex: 0,
                reasoning: "2,40,000 ÷ 40,000 = 6 times — earnings cover the interest bill sixfold."
              }
            ]
          }
        ],

        examNumericals: [
          {
            id: 1, q: "Current assets ₹6,00,000, inventory ₹2,00,000, prepayments ₹40,000, current liabilities ₹3,00,000. Quick ratio (express as a decimal to two places, e.g. 1.20).",
            value: 1.2,
            explanation: "3,60,000 ÷ 3,00,000 = 1.20:1.",
            difficulty: "Medium"
          },
          {
            id: 2, q: "COGS ₹6,00,000; opening inventory ₹1,00,000; closing ₹1,50,000. Inventory turnover (times, one decimal).",
            value: 4.8,
            explanation: "Average inventory ₹1,25,000; 6,00,000 ÷ 1,25,000 = 4.8 times.",
            difficulty: "Medium"
          }
        ],

        quickRevision: {
          definition: "Accounting ratios hold one statement figure against another to measure liquidity, solvency, activity and profitability — computed by formula, interpreted only in pairs, trends or against a standard.",
          keyPoints: [
            "Four families: liquidity, solvency, activity, profitability — know which question each answers.",
            "Quick ratio strips inventory and prepayments — the acid test of near-cash resources.",
            "Debt-equity uses long-term debt only; interest coverage uses PBIT.",
            "Average of opening and closing balances is used wherever a balance meets a flow (inventory, receivables).",
            "ROI uses PBIT against capital employed — financing-neutral by construction.",
            "A ratio alone proves nothing: pair it, trend it, or compare it."
          ],
          calculationSteps: [
            "Step 1 — Write the formula in words before touching numbers.",
            "Step 2 — Extract inputs from the statement; average balances where the formula demands it.",
            "Step 3 — Substitute and reduce; state units (times, %, or :1).",
            "Step 4 — Interpret in one sentence tied to a second number — never in isolation.",
            "Step 5 — For capital employed, choose the route the data supports: funds + long-term debt, or total assets − current liabilities."
          ],
          formulas: [
            { label: "Current ratio", expr: "Current assets ÷ Current liabilities" },
            { label: "Quick ratio", expr: "(Current assets − Inventory − Prepayments) ÷ Current liabilities" },
            { label: "Debt-equity", expr: "Long-term debt ÷ Shareholders' funds" },
            { label: "Interest coverage", expr: "PBIT ÷ Interest" },
            { label: "Inventory turnover", expr: "COGS ÷ Average inventory" },
            { label: "Return on investment", expr: "PBIT ÷ Capital employed × 100" }
          ],
          distinctions: [
            {
              title: "Liquidity vs solvency",
              head: ["Liquidity ratios", "Solvency ratios"],
              rows: [
                ["Horizon", "Next twelve months", "The long run"],
                ["Core pair", "Current and quick ratio", "Debt-equity and interest coverage"],
                ["Question", "Can it pay what is due soon?", "Can it carry its structure forever?"],
                ["Fails when", "Inventory is stale or receivables uncollectable", "Earnings fall below the interest bill"]
              ]
            }
          ],
          examPoints: [
            "Formula → substitution → answer, in that order; the formula earns a mark on its own.",
            "Use averages for turnover ratios wherever opening balances are given.",
            "Interpretation must cite two numbers: the ratio and what it is being compared to."
          ],
          commonMistakes: [
            "Using closing inventory instead of the average when opening inventory is given.",
            "Putting total debt (including current borrowings) into debt-equity.",
            "Dividing by revenue where the formula says COGS (inventory turnover)."
          ],
          mnemonic: "LSAP — Liquidity, Solvency, Activity, Profitability: name the family first, then reach for its formula."
        }
      },

      /* ---------- Chapter 12: Cash Flow Statement ---------- */
      cf: {
        theory: {
          simple: [
            {
              h: "Why Cash, and Why a Statement",
              p: "Profit is an opinion; cash is a fact. A company can show healthy profit and still fail to pay wages, because profit counts a sale when it is invoiced, while cash arrives when the money does. The cash flow statement closes that gap: it reports the actual movement of cash and cash equivalents during the year, sorted by what caused it.",
              list: [
                { term: "Cash", def: "Cash in hand and demand deposits with banks." },
                { term: "Cash equivalents", def: "Short-term, highly liquid investments readily convertible to known cash amounts, with insignificant risk of value change — held for meeting short-term commitments, not for investment." },
                { term: "Cash flow", def: "The net movement — inflows minus outflows — in cash and cash equivalents over a period." }
              ]
            },
            {
              h: "The Three Activities",
              p: "Every cash movement belongs to exactly one of three families. Operating activities are the principal revenue-producing activities — cash from customers, cash to suppliers and employees, expenses paid. Investing activities are the purchase and sale of long-term assets and investments. Financing activities are the transactions with the owners and lenders — issue and repayment of capital and borrowings, dividend and interest paid.",
              formula: "Net movement in cash = Operating + Investing + Financing (in this course)"
            },
            {
              h: "Indirect Method — From Profit to Operating Cash",
              p: "The statement of profit and loss is prepared on an accrual basis; the cash flow statement wants a cash basis. The indirect method bridges them: start with net profit before tax, remove everything that moved the profit without moving cash — depreciation and other non-cash charges, gains or losses on asset disposal — and then adjust for the changes in working capital. What remains is the cash the operations actually generated.",
              formula: "Operating cash flow = Net profit before tax + Non-cash charges ± Working capital changes"
            }
          ],
          advanced: [
            {
              h: "Working Capital Adjustments — the Direction Trap",
              p: "Every working capital adjustment follows one rule, learned once and applied forever: an increase in a current asset consumes cash (outflow); an increase in a current liability releases cash (inflow). The reverse for decreases. Trade receivables up means sales invoiced but not collected — cash is stuck. Trade payables up means purchases made but not paid — cash is retained. Each adjustment is this single rule applied to a specific balance.",
              p2: "Apply the rule to the movement, not the balance: it is the rise or fall during the year that generates or consumes the cash."
            },
            {
              h: "Interest, Dividend, and Where They Belong",
              p: "In this course, interest and dividend paid are shown under financing activities — they are transactions with the providers of finance — and interest and dividend received are shown under investing activities, as returns on money invested. Classification follows the nature of the underlying relationship, not the accounting head the payment passed through.",
              p2: "State your classification convention in the answer when the question allows a choice; consistency within the statement is what the examiner checks."
            },
            {
              h: "Reading a Cash Flow Statement",
              p: "Three questions, in order. Did operations generate cash — and if not, how long can that continue? Did the firm invest in its future, or live off disposals? Did it finance growth from owners, lenders, or its own operations? A firm whose operations bleed cash while investing outflows are funded by borrowings is writing a story the profit and loss account cannot tell — which is precisely why the statement exists.",
              p2: "The closing cash and cash equivalents of the statement must equal the balance sheet figure — that tie is the proof the statement was built correctly."
            }
          ]
        },

        concepts: [
          { title: "Cash equivalents", body: "Short-term, highly liquid investments readily convertible to known cash, held to meet short-term commitments — insignificant value risk." },
          { title: "Operating activities", body: "The principal revenue-producing activities: cash from customers, to suppliers, for expenses — the engine of the business." },
          { title: "Indirect method", body: "Starting from net profit before tax and removing non-cash effects and working-capital movements to reach operating cash flow." },
          { title: "Working capital adjustment", body: "Increase in a current asset = cash outflow; increase in a current liability = cash inflow — and the mirror for decreases." }
        ],

        formats: [
          {
            title: "Cash Flow Statement — indirect method skeleton",
            note: "Three sections, in the prescribed order.",
            head: ["Activity", "Particulars", "Amount (₹)"],
            rows: [
              ["A. Operating", "Net profit before tax", "2,40,000"],
              ["A. Operating", "Add: Depreciation (non-cash)", "60,000"],
              ["A. Operating", "Less: Increase in trade receivables", "(40,000)"],
              ["A. Operating", "Add: Increase in trade payables", "30,000"],
              ["A. Operating", "Cash generated from operations", "2,90,000"],
              ["B. Investing", "Purchase of machinery", "(1,50,000)"],
              ["C. Financing", "Proceeds from long-term borrowings", "2,00,000"],
              ["C. Financing", "Interest paid", "(20,000)"],
              ["Net increase", "In cash and cash equivalents", "1,20,000"]
            ]
          },
          {
            title: "Working note — the direction rule",
            note: "Learn the rule once; apply it to every balance.",
            head: ["Balance", "Increase during year", "Decrease during year"],
            rows: [
              ["Trade receivables", "Outflow — cash stuck in credit sales", "Inflow — collections exceed new credit"],
              ["Inventory", "Outflow — cash bought into stock", "Inflow — stock sold down"],
              ["Trade payables", "Inflow — purchases unpaid, cash retained", "Outflow — suppliers paid down"],
              ["Prepayments", "Outflow — cash paid ahead", "Inflow — no new prepayment"],
              ["Outstanding expenses", "Inflow — expense incurred unpaid", "Outflow — liabilities settled"]
            ]
          }
        ],

        numericals: [
          {
            id: 1, difficulty: "Easy",
            question: "Net profit before tax ₹2,40,000; depreciation ₹60,000; no working capital changes. Cash flow from operating activities:",
            options: ["₹3,00,000", "₹2,40,000", "₹1,80,000", "₹60,000"],
            answerIndex: 0,
            explanation: "2,40,000 + 60,000 = ₹3,00,000 — depreciation never touched cash, so it is added back."
          },
          {
            id: 2, difficulty: "Medium",
            question: "Trade receivables increased by ₹40,000 during the year. The effect on operating cash flow is:",
            options: ["An outflow of ₹40,000", "An inflow of ₹40,000", "No effect", "An outflow of ₹80,000"],
            answerIndex: 0,
            explanation: "An increase in a current asset consumes cash — sales invoiced but not yet collected."
          },
          {
            id: 3, difficulty: "Medium",
            question: "Trade payables increased by ₹30,000. The effect on operating cash flow is:",
            options: ["An inflow of ₹30,000", "An outflow of ₹30,000", "No effect", "An inflow of ₹60,000"],
            answerIndex: 0,
            explanation: "An increase in a current liability releases cash — purchases made but not yet paid."
          },
          {
            id: 4, difficulty: "Easy",
            question: "Purchase of machinery for ₹1,50,000 appears under:",
            options: ["Investing activities", "Operating activities", "Financing activities", "Not shown"],
            answerIndex: 0,
            explanation: "Long-term asset acquisition is an investing outflow, wherever the cash went."
          },
          {
            id: 5, difficulty: "Easy",
            question: "Proceeds from a long-term loan of ₹2,00,000 appear under:",
            options: ["Financing activities", "Operating activities", "Investing activities", "Not shown"],
            answerIndex: 0,
            explanation: "Transactions with lenders — raising finance — are financing inflows."
          },
          {
            id: 6, difficulty: "Medium",
            question: "Interest paid ₹20,000 is shown (in this course) under:",
            options: ["Financing activities", "Operating activities", "Investing activities", "Added back only"],
            answerIndex: 0,
            explanation: "Interest paid is a transaction with the providers of finance — financing outflow."
          },
          {
            id: 7, difficulty: "Hard",
            question: "Net profit before tax ₹2,40,000; depreciation ₹60,000; receivables up ₹40,000; payables up ₹30,000. Operating cash flow:",
            options: ["₹2,90,000", "₹3,00,000", "₹2,50,000", "₹2,70,000"],
            answerIndex: 0,
            explanation: "2,40,000 + 60,000 − 40,000 + 30,000 = ₹2,90,000 — the direction rule applied twice."
          },
          {
            id: 8, difficulty: "Easy",
            question: "Cash equivalents must be:",
            options: ["Short-term, highly liquid, readily convertible to known cash with insignificant value risk", "Any investment the firm holds", "Inventory held for sale", "Debtors' balances"],
            answerIndex: 0,
            explanation: "All three conditions — short-term, highly liquid, negligible value risk — must hold together."
          },
          {
            id: 9, difficulty: "Medium",
            question: "Dividend received on an investment is shown (in this course) under:",
            options: ["Investing activities", "Financing activities", "Operating activities", "Added to net profit only"],
            answerIndex: 0,
            explanation: "A return on money invested — investing inflow."
          },
          {
            id: 10, difficulty: "Hard",
            question: "A firm's operations generated ₹1,00,000; it bought machinery for ₹4,00,000 and raised a loan of ₹3,00,000. The net movement in cash is:",
            options: ["A decrease of ₹0 — inflows and outflows exactly match", "A decrease of ₹4,00,000", "An increase of ₹4,00,000", "A decrease of ₹3,00,000"],
            answerIndex: 0,
            explanation: "1,00,000 − 4,00,000 + 3,00,000 = ₹0 — the statement ties to a nil movement; every rupee is accounted for."
          }
        ],

        activity: {
          type: "calc",
          title: "Operating Cash Flow Bench",
          instruction: "Convert accrual profit to operating cash, line by line. Enter every figure exactly as the working note should show it; the bench verifies each before revealing its own.",
          problems: [
            {
              prompt: "Net profit before tax ₹2,40,000; depreciation ₹60,000; no working capital changes. Find cash generated from operations.",
              inputs: [
                { key: "op", label: "Cash from operations (₹)", placeholder: "e.g. 300000" }
              ],
              answers: { op: 300000 },
              formula: "NPBT + Non-cash charges ± Working capital",
              working: "2,40,000 + 60,000 = <b>₹3,00,000</b>. Depreciation reduced profit but never paid out cash — add it back."
            },
            {
              prompt: "Net profit before tax ₹2,40,000; depreciation ₹60,000; trade receivables up ₹40,000; trade payables up ₹30,000. Find operating cash flow.",
              inputs: [
                { key: "op", label: "Operating cash flow (₹)", placeholder: "e.g. 290000" }
              ],
              answers: { op: 290000 },
              formula: "NPBT + Depreciation − Increase in receivables + Increase in payables",
              working: "2,40,000 + 60,000 − 40,000 + 30,000 = <b>₹2,90,000</b>. Receivables up = cash stuck (outflow); payables up = cash retained (inflow)."
            },
            {
              prompt: "Net profit before tax ₹1,80,000; depreciation ₹30,000; inventory decreased ₹25,000; outstanding expenses decreased ₹10,000. Find operating cash flow.",
              inputs: [
                { key: "op", label: "Operating cash flow (₹)", placeholder: "e.g. 225000" }
              ],
              answers: { op: 225000 },
              formula: "NPBT + Depreciation + Decrease in inventory − Decrease in outstanding expenses",
              working: "1,80,000 + 30,000 + 25,000 − 10,000 = <b>₹2,25,000</b>. Inventory sold down releases cash; settling last year's outstanding expenses consumes it."
            },
            {
              prompt: "A company's operating cash flow is ₹2,90,000; it purchased machinery for ₹1,50,000 and paid interest of ₹20,000. Find the net increase in cash and cash equivalents.",
              inputs: [
                { key: "net", label: "Net increase in cash (₹)", placeholder: "e.g. 120000" }
              ],
              answers: { net: 120000 },
              formula: "Operating + Investing + Financing",
              working: "2,90,000 − 1,50,000 − 20,000 = <b>₹1,20,000</b> net increase — and this figure must equal the balance sheet movement in cash."
            }
          ]
        },

        examCases: [
          {
            id: 1,
            title: "The full statement",
            passage: "A company reports net profit before tax of ₹2,40,000. During the year it charged depreciation of ₹60,000; trade receivables rose by ₹40,000; trade payables rose by ₹30,000. It purchased machinery for ₹1,50,000 and raised a long-term loan of ₹2,00,000; interest paid during the year was ₹20,000.",
            difficulty: "Hard",
            subs: [
              {
                q: "Cash flow from operating activities:",
                options: ["₹2,90,000", "₹3,00,000", "₹2,30,000", "₹2,50,000"],
                answerIndex: 0,
                reasoning: "2,40,000 + 60,000 − 40,000 + 30,000 = ₹2,90,000."
              },
              {
                q: "Cash flow from investing activities:",
                options: ["An outflow of ₹1,50,000", "An inflow of ₹1,50,000", "An outflow of ₹2,10,000", "Nil"],
                answerIndex: 0,
                reasoning: "Machinery purchased — the only investing movement — is an outflow of ₹1,50,000."
              },
              {
                q: "Cash flow from financing activities:",
                options: ["A net inflow of ₹1,80,000", "An inflow of ₹2,00,000", "A net inflow of ₹2,20,000", "A net outflow of ₹20,000"],
                answerIndex: 0,
                reasoning: "Loan raised ₹2,00,000 (inflow) less interest paid ₹20,000 (outflow) = ₹1,80,000 net inflow."
              },
              {
                q: "Net increase in cash and cash equivalents:",
                options: ["₹1,20,000", "₹3,30,000", "₹90,000", "₹2,90,000"],
                answerIndex: 0,
                reasoning: "2,90,000 − 1,50,000 + 1,80,000 = ₹1,20,000."
              }
            ]
          },
          {
            id: 2,
            title: "The direction rule, applied",
            passage: "Net profit before tax ₹1,80,000; depreciation ₹30,000; inventory decreased by ₹25,000; outstanding expenses decreased by ₹10,000; prepaid insurance decreased by ₹5,000. No other movements.",
            difficulty: "Hard",
            subs: [
              {
                q: "Effect of the inventory decrease:",
                options: ["An inflow of ₹25,000", "An outflow of ₹25,000", "No effect", "An inflow of ₹50,000"],
                answerIndex: 0,
                reasoning: "A decrease in a current asset releases cash — stock was sold down without replacement."
              },
              {
                q: "Effect of the outstanding expenses decrease:",
                options: ["An outflow of ₹10,000", "An inflow of ₹10,000", "No effect", "An outflow of ₹20,000"],
                answerIndex: 0,
                reasoning: "A decrease in a current liability consumes cash — last year's unpaid expenses were settled."
              },
              {
                q: "Effect of the prepaid insurance decrease:",
                options: ["An inflow of ₹5,000", "An outflow of ₹5,000", "No effect", "An inflow of ₹10,000"],
                answerIndex: 0,
                reasoning: "Prepayments are a current asset — a decrease releases cash (the expense was incurred without new payment)."
              },
              {
                q: "Cash flow from operating activities:",
                options: ["₹2,30,000", "₹2,00,000", "₹2,20,000", "₹2,40,000"],
                answerIndex: 0,
                reasoning: "1,80,000 + 30,000 + 25,000 − 10,000 + 5,000 = ₹2,30,000."
              }
            ]
          }
        ],

        examNumericals: [
          {
            id: 1, q: "NPBT ₹2,40,000; depreciation ₹60,000; receivables up ₹40,000; payables up ₹30,000. Operating cash flow (₹).",
            value: 290000,
            explanation: "2,40,000 + 60,000 − 40,000 + 30,000 = ₹2,90,000.",
            difficulty: "Medium"
          },
          {
            id: 2, q: "Operating ₹2,90,000; machinery purchased ₹1,50,000; loan raised ₹2,00,000; interest paid ₹20,000. Net increase in cash (₹).",
            value: 120000,
            explanation: "2,90,000 − 1,50,000 + 2,00,000 − 20,000 = ₹1,20,000.",
            difficulty: "Medium"
          },
          {
            id: 3, q: "NPBT ₹1,80,000; depreciation ₹30,000; inventory down ₹25,000; outstanding expenses down ₹10,000; prepayments down ₹5,000. Operating cash flow (₹).",
            value: 230000,
            explanation: "1,80,000 + 30,000 + 25,000 − 10,000 + 5,000 = ₹2,30,000.",
            difficulty: "Hard"
          }
        ],

        quickRevision: {
          definition: "The cash flow statement reports the movement of cash and cash equivalents through operating, investing and financing activities — converting accrual profit to cash through the indirect method and the working capital direction rule.",
          keyPoints: [
            "Cash = cash in hand + demand deposits; cash equivalents = short-term, highly liquid, negligible value risk.",
            "Three activities: operating (revenue engine), investing (long-term assets), financing (owners and lenders).",
            "Indirect method: NPBT + non-cash charges ± working capital changes.",
            "Direction rule: increase in current asset = outflow; increase in current liability = inflow (mirror for decreases).",
            "In this course: interest and dividend paid → financing; interest and dividend received → investing.",
            "Closing cash must equal the balance sheet figure — the statement's self-check."
          ],
          calculationSteps: [
            "Step 1 — Operating: start with net profit before tax.",
            "Step 2 — Add back non-cash charges (depreciation); remove non-cash gains, add non-cash losses.",
            "Step 3 — Apply the direction rule to every working capital movement.",
            "Step 4 — Investing: purchase and sale of long-term assets and investments, with sign.",
            "Step 5 — Financing: capital and borrowings raised (+) and repaid (−); interest and dividend paid (−).",
            "Step 6 — Sum the three; add opening cash; the result must equal closing cash on the balance sheet."
          ],
          formulas: [
            { label: "Operating cash flow", expr: "Net profit before tax + Non-cash charges ± Working capital changes" },
            { label: "Net movement", expr: "Operating + Investing + Financing" },
            { label: "Closing cash", expr: "Opening cash + Net movement" }
          ],
          distinctions: [
            {
              title: "Operating vs investing vs financing",
              head: ["Operating", "Investing", "Financing"],
              rows: [
                ["Nature", "Principal revenue-producing activities", "Long-term assets and investments", "Transactions with owners and lenders"],
                ["Examples", "Cash from customers, to suppliers, expenses", "Machinery bought/sold, investments", "Capital and loans raised/repaid; interest & dividend paid"],
                ["Sign source", "The working capital cycle", "Acquisition or disposal of long-term items", "The capital structure"]
              ]
            }
          ],
          examPoints: [
            "Write the direction rule at the top of the working note — it earns the method mark before the arithmetic starts.",
            "Classify interest/dividend by the convention you state; examiners reward consistency, not luck.",
            "The final tie — net movement added to opening cash equals the balance sheet closing cash — is worth stating explicitly."
          ],
          commonMistakes: [
            "Sign errors: treating an increase in receivables as an inflow.",
            "Adding depreciation but also subtracting it elsewhere in the statement.",
            "Forgetting that a gain on sale sits inside profit but belongs to investing — remove it from operating."
          ],
          mnemonic: "AIR — Assets up = cash leaves; Liabilities (current) up = cash stays; Reverse for decreases."
        }
      }
    },

    /* ================= MIND MAPS ================= */
    mindmaps: {
      fsa: {
        center: "Analysis of\nFinancial Statements",
        branches: [
          {
            label: "Who Analyzes",
            color: "var(--c-fsa)",
            children: ["Internal — management, full access", "External — lenders, investors", "Published statements only", "Different readers, different questions"]
          },
          {
            label: "Horizontal — Comparative",
            color: "var(--c-fs)",
            children: ["Two or more years side by side", "Absolute change = current − base", "% change = change ÷ base × 100", "Absolute = materiality, % = momentum"]
          },
          {
            label: "Vertical — Common-size",
            color: "var(--c-adj)",
            children: ["Each line % of a base", "P&L base: revenue from operations", "BS base: total assets", "Removes size — firms comparable"]
          },
          {
            label: "Reading It Well",
            color: "var(--c-rat)",
            children: ["Expense growth vs revenue growth", "Receivables far outpacing revenue = warning", "Borrowings up, fixed assets flat = ask why", "Pairs of lines, not single lines"]
          },
          {
            label: "Limitations",
            color: "var(--c-tb)",
            children: ["Historical cost, no inflation", "Policy changes move lines", "Window dressing at a date", "No qualitative information"]
          }
        ]
      },
      rat: {
        center: "Accounting\nRatios",
        branches: [
          {
            label: "Liquidity",
            color: "var(--c-rat)",
            children: ["Current ratio = CA ÷ CL", "Quick ratio strips inventory", "Comfort ≈ 2:1 and 1:1", "Answers: can it pay soon?"]
          },
          {
            label: "Solvency",
            color: "var(--c-fs)",
            children: ["Debt-equity = LTD ÷ funds", "Interest coverage = PBIT ÷ interest", "Structure and service capacity", "Answers: can it carry the load?"]
          },
          {
            label: "Activity",
            color: "var(--c-cf)",
            children: ["Inventory turnover = COGS ÷ avg stock", "Receivables turnover = revenue ÷ avg receivables", "Days = 365 ÷ turnover", "Answers: how hard do assets work?"]
          },
          {
            label: "Profitability",
            color: "var(--c-pres)",
            children: ["GP% and NP% on revenue", "ROI = PBIT ÷ capital employed", "Financing-neutral return", "Answers: how much survives?"]
          },
          {
            label: "Discipline",
            color: "var(--c-tbase)",
            children: ["Formula → substitute → answer", "Averages where balances meet flows", "Interpret in pairs/trends", "One ratio alone proves nothing"]
          }
        ]
      },
      cf: {
        center: "Cash Flow\nStatement",
        branches: [
          {
            label: "Cash & Equivalents",
            color: "var(--c-cf)",
            children: ["Cash in hand + demand deposits", "Short-term, highly liquid", "Insignificant value risk", "For short-term commitments"]
          },
          {
            label: "Three Activities",
            color: "var(--c-cb)",
            children: ["Operating — revenue engine", "Investing — long-term assets", "Financing — owners & lenders", "Every movement has exactly one home"]
          },
          {
            label: "Indirect Method",
            color: "var(--c-adj)",
            children: ["Start: net profit before tax", "Add back non-cash charges", "± Working capital changes", "= Operating cash flow"]
          },
          {
            label: "Direction Rule",
            color: "var(--c-dep)",
            children: ["Asset up → outflow", "Liability up → inflow", "Mirror for decreases", "Apply to movement, not balance"]
          },
          {
            label: "Classification (this course)",
            color: "var(--c-fs)",
            children: ["Interest/dividend paid → financing", "Interest/dividend received → investing", "Machinery purchase → investing", "Closing cash ties to balance sheet"]
          }
        ]
      }
    },

    /* ================= IMPORTANT QUESTIONS ================= */
    importantQuestions: {
      fsa: [
        { type: "Short Answer", marks: 3, q: "Distinguish between horizontal and vertical analysis of financial statements.",
          answer: "Horizontal analysis compares a line across two or more years — the comparative statement, showing absolute change and percentage change against a base year; it answers 'how much did it move?'. Vertical analysis expresses each line as a percentage of a base within the same year — the common-size statement (revenue as base for profit and loss, total assets for the balance sheet); it answers 'how big is it within the whole?'." },
        { type: "Short Answer", marks: 3, q: "Revenue rose 25% while employee costs rose 20%. What does the pair of percentages indicate?",
          answer: "The expense grew slower than revenue, so its share of revenue fell — employee cost efficiency improved. The correct comparison is always an expense's growth against revenue's growth, never against the expense's own past: an expense rising 20% may still be an improvement if revenue rose 25%." },
        { type: "Short Answer", marks: 3, q: "State three limitations of financial statement analysis.",
          answer: "(i) Historical cost figures ignore price-level changes, so 'growth' may be inflation. (ii) Changes in accounting policy can move a line without any economic change occurring. (iii) Window dressing — a one-day bank balance, a suppressed invoice — can improve a picture for exactly one reporting date. Also: inter-firm comparison fails across different year-ends or classifications, and qualitative information never appears." },
        { type: "Long Answer", marks: 6, q: "From the data — revenue ₹20,00,000 → ₹25,00,000; other income ₹40,000 → ₹50,000; employee benefits ₹8,00,000 → ₹9,60,000; other expenses ₹6,00,000 → ₹8,00,000 — prepare a comparative statement of profit and loss and comment.",
          answer: "Changes: revenue +₹5,00,000 (+25%); other income +₹10,000 (+25%); employee benefits +₹1,60,000 (+20%); other expenses +₹2,00,000 (+33.33%). PBT: ₹6,40,000 → ₹7,90,000 (+₹1,50,000, +23.44%). Comment: profit grew slightly slower than revenue because other expenses outran it at 33.33%; employee cost efficiency improved (20% < 25%). The line to investigate is other expenses." },
        { type: "Short Answer", marks: 3, q: "What is a common-size statement of profit and loss? Which line is the base?",
          answer: "A statement in which every line is expressed as a percentage of revenue from operations for that year — the vertical analysis tool. With revenue as 100%, each expense and profit line shows its share of revenue, making firms of different sizes comparable and exposing structural differences in cost and margin." },
        { type: "Long Answer", marks: 6, q: "Common-size the profit and loss: revenue ₹25,00,000; employee benefits ₹9,60,000; other expenses ₹8,00,000; PBT ₹7,90,000 (prior year shares: 40%, 30%, 32%). Comment on the movement.",
          answer: "Employee benefits = 38.40% (down from 40%) — efficiency improved. Other expenses = 32% (up from 30%) — deterioration. PBT = 31.60% (down from 32%) — margin dipped slightly. The improved employee share was more than consumed by the rise in other expenses; management should isolate what drove other expenses up a third while revenue grew a quarter." },
        { type: "Short Answer", marks: 3, q: "Trade receivables grew 40% while revenue grew 5%. What should an analyst infer?",
          answer: "Receivables are growing seven times faster than revenue — the classic warning of slower collections or credit sales pushed to sustain revenue. The analyst should examine the aging of receivables, the adequacy of the provision for doubtful debts, and whether the credit policy changed during the year. It is a question to investigate, not yet a conclusion." }
      ],
      rat: [
        { type: "Short Answer", marks: 3, q: "Current assets ₹6,00,000 (inventory ₹2,00,000, prepayments ₹40,000); current liabilities ₹3,00,000. Compute the current and quick ratios and comment.",
          answer: "Current ratio = 6,00,000 ÷ 3,00,000 = 2:1. Quick ratio = (6,00,000 − 2,00,000 − 40,000) ÷ 3,00,000 = 3,60,000 ÷ 3,00,000 = 1.2:1. The firm meets the traditional 2:1 comfort level, and the quick ratio above 1 shows that even without inventory it can meet current obligations — the liquidity is genuine, not stock-dependent." },
        { type: "Short Answer", marks: 3, q: "Define debt-equity ratio. What does it measure?",
          answer: "Debt-equity ratio = long-term debt ÷ shareholders' funds. It measures the firm's long-term financial structure — how many rupees outsiders have financed for every rupee the owners have. A low ratio (e.g. 0.25:1) indicates conservative financing and lower financial risk; a high ratio indicates leverage and greater fixed-obligation risk, which the interest coverage ratio then tests against earnings." },
        { type: "Short Answer", marks: 3, q: "COGS ₹6,00,000; opening inventory ₹1,00,000; closing ₹1,50,000. Compute inventory turnover and the average holding period.",
          answer: "Average inventory = (1,00,000 + 1,50,000) ÷ 2 = ₹1,25,000. Inventory turnover = 6,00,000 ÷ 1,25,000 = 4.8 times. Average holding period = 365 ÷ 4.8 ≈ 76 days — stock converts to cost of sales roughly every two and a half months." },
        { type: "Long Answer", marks: 6, q: "From the following compute any four ratios and interpret: revenue ₹10,00,000; COGS ₹6,00,000; PBIT ₹1,90,000; interest ₹40,000; current assets ₹6,00,000 (inventory ₹2,00,000, prepayments ₹40,000); current liabilities ₹3,00,000; long-term debt ₹2,00,000; shareholders' funds ₹8,00,000.",
          answer: "Gross profit rate = 4,00,000 ÷ 10,00,000 = 40%. Quick ratio = 3,60,000 ÷ 3,00,000 = 1.2:1. Interest coverage = 1,90,000 ÷ 40,000 = 4.75 times. Debt-equity = 2,00,000 ÷ 8,00,000 = 0.25:1. ROI = 1,90,000 ÷ 10,00,000 = 19%. Interpretation: strong markup and a conservatively financed structure (0.25:1) that earnings cover comfortably (4.75×); liquidity is sound with the quick ratio above 1; the whole capital base returns 19%." },
        { type: "Short Answer", marks: 3, q: "Why are averages used in turnover ratios?",
          answer: "Turnover ratios relate a flow over the year (COGS, revenue) to a balance that exists at a point. The opening balance represents the start of the period and the closing its end; their average is the best single representative of the stock maintained through the year. Using the closing figure alone lets a year-end arrangement — a one-day reduction in inventory — distort the whole ratio." },
        { type: "Long Answer", marks: 6, q: "Explain any four liquidity and solvency ratios with formulas and the interpretation each supports.",
          answer: "Current ratio = current assets ÷ current liabilities — short-term paying ability; about 2:1 is comfortable. Quick ratio = (current assets − inventory − prepayments) ÷ current liabilities — the acid test; near 1:1 means liquidity does not depend on selling stock. Debt-equity = long-term debt ÷ shareholders' funds — structural risk; low means owners fund most of the business. Interest coverage = PBIT ÷ interest — service capacity; a high multiple means the interest bill is easily borne even if profits dip. Read in pairs: a good current ratio with a poor quick ratio points at inventory; low debt with low coverage still means trouble if earnings fall." },
        { type: "Short Answer", marks: 3, q: "Inventory turnover fell from 6 to 3 times a year. What are the possible causes and consequences?",
          answer: "Causes: slower-moving or obsolete stock, overstocking, a fall in demand, or a pricing problem making sales harder. Consequences: capital locked in inventory, higher holding costs, risk of markdowns and obsolescence, and a weaker current ratio if the stock is not saleable. The analyst checks the aging of inventory and the provision for decline in value before concluding." }
      ],
      cf: [
        { type: "Short Answer", marks: 3, q: "What are cash equivalents? State two examples.",
          answer: "Short-term, highly liquid investments that are readily convertible to known amounts of cash, with an insignificant risk of changes in value, held to meet short-term commitments rather than for investment — for example, treasury bills maturing within three months and highly liquid commercial paper. All three conditions — short-term, highly liquid, negligible value risk — must hold together." },
        { type: "Short Answer", marks: 3, q: "State the three activities of a cash flow statement with one example of each.",
          answer: "Operating activities: principal revenue-producing activities — cash received from customers, cash paid to suppliers and employees. Investing activities: acquisition and disposal of long-term assets and investments — cash paid to buy machinery. Financing activities: transactions with owners and lenders — proceeds from a long-term loan, or interest paid on it." },
        { type: "Short Answer", marks: 3, q: "Explain the working capital direction rule used in the indirect method.",
          answer: "An increase in a current asset is a cash outflow (money is tied up — e.g. receivables rising means sales invoiced but not collected); an increase in a current liability is a cash inflow (money is retained — e.g. payables rising means purchases unpaid). For decreases, the direction reverses. The rule applies to the movement during the year, not to the balance itself." },
        { type: "Long Answer", marks: 6, q: "NPBT ₹2,40,000; depreciation ₹60,000; receivables up ₹40,000; payables up ₹30,000; machinery purchased ₹1,50,000; loan raised ₹2,00,000; interest paid ₹20,000. Prepare the cash flow statement (indirect method).",
          answer: "Operating: 2,40,000 + 60,000 − 40,000 + 30,000 = ₹2,90,000. Investing: machinery purchased −₹1,50,000. Financing: loan raised +₹2,00,000, interest paid −₹20,000 = +₹1,80,000. Net increase in cash = 2,90,000 − 1,50,000 + 1,80,000 = ₹1,20,000, which must equal the movement in cash and cash equivalents on the balance sheet." },
        { type: "Short Answer", marks: 3, q: "Where are interest paid and dividend received shown in this course, and why?",
          answer: "Interest paid is shown under financing activities — it is a transaction with the providers of finance. Dividend received is shown under investing activities — a return on money invested. Classification follows the nature of the underlying relationship (lending, investing) rather than the accounting head the amount passed through." },
        { type: "Long Answer", marks: 6, q: "NPBT ₹1,80,000; depreciation ₹30,000; inventory down ₹25,000; outstanding expenses down ₹10,000; prepayments down ₹5,000. Compute cash flow from operating activities and explain each adjustment.",
          answer: "Operating cash flow = 1,80,000 + 30,000 + 25,000 − 10,000 + 5,000 = ₹2,30,000. Depreciation is added back — it reduced profit but never paid out cash. Inventory down ₹25,000 — a current asset decreasing releases cash (stock sold down without replacement). Outstanding expenses down ₹10,000 — a current liability decreasing consumes cash (prior liabilities settled). Prepayments down ₹5,000 — a current asset decreasing, so the insurance expense was incurred without fresh payment, releasing ₹5,000 relative to profit." },
        { type: "Short Answer", marks: 3, q: "How does a cash flow statement differ from a balance sheet?",
          answer: "A balance sheet is a position statement — assets, liabilities and capital at a single date, on historical cost. A cash flow statement is a flow statement — the movement of cash and cash equivalents across a period, sorted by activity. The balance sheet says what the firm has and owes; the cash flow statement says where the cash came from and where it went, which is why it can reveal a profitable firm heading for a cash crisis." }
      ]
    },

    /* ================= QUIZ (ids 70091–70120) ================= */
    quiz: [
      { id: 70091, chapter: "fsa", difficulty: "Easy",
        q: "Comparing a line across two years is an example of:",
        options: ["Horizontal analysis", "Vertical analysis", "Cash flow analysis", "Ratio analysis"],
        answerIndex: 0,
        explanation: "Change over time is horizontal; the common-size vertical reading is structure within one year." },
      { id: 70092, chapter: "fsa", difficulty: "Easy",
        q: "In a common-size statement of profit and loss, the base (100%) is:",
        options: ["Revenue from operations", "Total assets", "Net profit", "Shareholders' funds"],
        answerIndex: 0,
        explanation: "Revenue from operations for the P&L; total assets for the balance sheet." },
      { id: 70093, chapter: "fsa", difficulty: "Medium",
        q: "Revenue ₹20,00,000 → ₹25,00,000. Percentage increase:",
        options: ["25%", "20%", "5%", "125%"],
        answerIndex: 0,
        explanation: "5,00,000 ÷ 20,00,000 × 100 = 25% — always on the base year." },
      { id: 70094, chapter: "fsa", difficulty: "Medium",
        q: "Other expenses ₹6,00,000 → ₹8,00,000 while revenue rose 25%. The correct reading is:",
        options: ["Expenses outran revenue — the cost share rose", "Efficiency improved", "Profit rose faster than revenue", "Nothing can be inferred"],
        answerIndex: 0,
        explanation: "33.33% expense growth against 25% revenue growth — a deterioration in the cost share." },
      { id: 70095, chapter: "fsa", difficulty: "Easy",
        q: "A common-size balance sheet expresses each line as a percentage of:",
        options: ["Total assets", "Revenue from operations", "Net profit", "Current assets"],
        answerIndex: 0,
        explanation: "Total assets — which equals total equity and liabilities — is the vertical base." },
      { id: 70096, chapter: "fsa", difficulty: "Hard",
        q: "Trade receivables grew 40% while revenue grew 5%. The first suspicion is:",
        options: ["Slower collections or pushed credit sales", "Overpayment of dividends", "Rise in share capital", "Fall in depreciation"],
        answerIndex: 0,
        explanation: "Receivables far outpacing revenue is the classic collections warning." },
      { id: 70097, chapter: "fsa", difficulty: "Easy",
        q: "Which is NOT a limitation of financial statement analysis?",
        options: ["It works from figures the statements report", "Historical cost ignores inflation", "Window dressing can mislead", "Policies may differ across firms"],
        answerIndex: 0,
        explanation: "Using reported figures is the method's foundation; the others are genuine limitations." },
      { id: 70098, chapter: "fsa", difficulty: "Medium",
        q: "PBT rose 23.44% while revenue rose 25%. The margin reading is:",
        options: ["Margin dipped slightly — cost share rose", "Margin improved", "Costs fell absolutely", "The firm is loss-making"],
        answerIndex: 0,
        explanation: "Profit growing slower than revenue means the expense share of revenue increased marginally." },
      { id: 70099, chapter: "fsa", difficulty: "Easy",
        q: "External analysis is conducted mainly by:",
        options: ["Lenders, investors and regulators from published statements", "The internal audit team", "The production manager", "The board of directors"],
        answerIndex: 0,
        explanation: "External users have only the published statements; internal users have the ledgers." },
      { id: 70100, chapter: "fsa", difficulty: "Medium",
        q: "Employee benefits fell from 40% to 38.40% of revenue. In common-size terms this means:",
        options: ["The employee cost share of revenue decreased", "Employee costs fell in absolute terms", "Revenue fell", "Nothing — percentages are meaningless"],
        answerIndex: 0,
        explanation: "Share fell from 40% to 38.40% — improved relative efficiency, even though the absolute cost rose." },

      { id: 70101, chapter: "rat", difficulty: "Easy",
        q: "Current assets ₹6,00,000, current liabilities ₹3,00,000. Current ratio:",
        options: ["2:1", "1:2", "3:1", "1:1"],
        answerIndex: 0,
        explanation: "6,00,000 ÷ 3,00,000 = 2:1 — the traditional comfort level." },
      { id: 70102, chapter: "rat", difficulty: "Medium",
        q: "The quick ratio excludes from current assets:",
        options: ["Inventory and prepayments", "Cash and bank", "Trade receivables", "Short-term investments"],
        answerIndex: 0,
        explanation: "Only assets convertible within days remain — the acid test of near-cash resources." },
      { id: 70103, chapter: "rat", difficulty: "Medium",
        q: "Long-term debt ₹2,00,000, shareholders' funds ₹8,00,000. Debt-equity:",
        options: ["0.25:1", "4:1", "1:4", "0.5:1"],
        answerIndex: 0,
        explanation: "2,00,000 ÷ 8,00,000 = 0.25:1 — conservatively financed." },
      { id: 70104, chapter: "rat", difficulty: "Easy",
        q: "Which family of ratios measures short-term paying ability?",
        options: ["Liquidity", "Solvency", "Activity", "Profitability"],
        answerIndex: 0,
        explanation: "Current and quick ratios compare near-term resources with near-term obligations." },
      { id: 70105, chapter: "rat", difficulty: "Medium",
        q: "COGS ₹6,00,000; opening inventory ₹1,00,000; closing ₹1,50,000. Inventory turnover:",
        options: ["4.8 times", "4 times", "6 times", "1.2 times"],
        answerIndex: 0,
        explanation: "Average inventory ₹1,25,000; 6,00,000 ÷ 1,25,000 = 4.8 times." },
      { id: 70106, chapter: "rat", difficulty: "Medium",
        q: "PBIT ₹1,90,000, capital employed ₹10,00,000. Return on investment:",
        options: ["19%", "12%", "1.9%", "10%"],
        answerIndex: 0,
        explanation: "1,90,000 ÷ 10,00,000 × 100 = 19% — financing-neutral by construction." },
      { id: 70107, chapter: "rat", difficulty: "Easy",
        q: "Interest coverage is computed as:",
        options: ["PBIT ÷ Interest", "Net profit ÷ Interest", "Interest ÷ PBIT", "PBIT ÷ Dividend"],
        answerIndex: 0,
        explanation: "How many times earnings cover the interest bill — a solvency measure." },
      { id: 70108, chapter: "rat", difficulty: "Hard",
        q: "Turnover ratios use average balances because:",
        options: ["A flow over the year meets a balance at a point", "Averages are always more accurate", "The examiner requires it in every question", "Closing balances cannot be used"],
        answerIndex: 0,
        explanation: "COGS and revenue are flows; inventory and receivables are points — the average represents the year." },
      { id: 70109, chapter: "rat", difficulty: "Medium",
        q: "Receivables turnover 5 times. The average collection period is approximately:",
        options: ["73 days", "7 days", "50 days", "365 days"],
        answerIndex: 0,
        explanation: "365 ÷ 5 = 73 days — credit customers pay in about two and a half months." },
      { id: 70110, chapter: "rat", difficulty: "Hard",
        q: "Inventory turnover fell from 6 to 3 times. The correct reading:",
        options: ["Stock moves half as fast — investigate slow lines", "The firm is more efficient", "Profit doubled", "The debt-equity ratio rose"],
        answerIndex: 0,
        explanation: "Halved turnover means capital locked in slower-moving stock — holding costs and obsolescence risk rise." },

      { id: 70111, chapter: "cf", difficulty: "Easy",
        q: "Cash equivalents are:",
        options: ["Short-term, highly liquid investments with insignificant value risk", "Any investment held", "Trade receivables", "Inventory held for sale"],
        answerIndex: 0,
        explanation: "All three conditions together: short-term, highly liquid, negligible risk of value change." },
      { id: 70112, chapter: "cf", difficulty: "Easy",
        q: "Purchase of machinery appears under:",
        options: ["Investing activities", "Operating activities", "Financing activities", "Not shown"],
        answerIndex: 0,
        explanation: "Acquisition of a long-term asset is an investing outflow." },
      { id: 70113, chapter: "cf", difficulty: "Medium",
        q: "An increase in trade receivables of ₹40,000 during the year is:",
        options: ["An operating outflow of ₹40,000", "An operating inflow of ₹40,000", "An investing outflow", "No effect"],
        answerIndex: 0,
        explanation: "Asset up = cash out — sales invoiced but not collected." },
      { id: 70114, chapter: "cf", difficulty: "Medium",
        q: "An increase in trade payables of ₹30,000 is:",
        options: ["An operating inflow of ₹30,000", "An operating outflow of ₹30,000", "A financing inflow", "No effect"],
        answerIndex: 0,
        explanation: "Liability up = cash stays — purchases made but not yet paid." },
      { id: 70115, chapter: "cf", difficulty: "Medium",
        q: "NPBT ₹2,40,000; depreciation ₹60,000; receivables up ₹40,000; payables up ₹30,000. Operating cash flow:",
        options: ["₹2,90,000", "₹3,00,000", "₹2,50,000", "₹2,30,000"],
        answerIndex: 0,
        explanation: "2,40,000 + 60,000 − 40,000 + 30,000 = ₹2,90,000." },
      { id: 70116, chapter: "cf", difficulty: "Easy",
        q: "Interest paid is shown (in this course) under:",
        options: ["Financing activities", "Operating activities", "Investing activities", "Added back only"],
        answerIndex: 0,
        explanation: "A transaction with the providers of finance — financing outflow." },
      { id: 70117, chapter: "cf", difficulty: "Easy",
        q: "Dividend received is shown (in this course) under:",
        options: ["Investing activities", "Financing activities", "Operating activities", "Nowhere"],
        answerIndex: 0,
        explanation: "A return on money invested — investing inflow." },
      { id: 70118, chapter: "cf", difficulty: "Medium",
        q: "Depreciation of ₹60,000 is treated in the indirect method as:",
        options: ["Added back to net profit — non-cash charge", "Subtracted again", "A financing outflow", "An investing inflow"],
        answerIndex: 0,
        explanation: "It reduced profit but never moved cash — add it back." },
      { id: 70119, chapter: "cf", difficulty: "Hard",
        q: "Operating ₹2,90,000; machinery purchased ₹1,50,000; loan raised ₹2,00,000; interest paid ₹20,000. Net increase in cash:",
        options: ["₹1,20,000", "₹3,30,000", "₹90,000", "₹2,70,000"],
        answerIndex: 0,
        explanation: "2,90,000 − 1,50,000 + 2,00,000 − 20,000 = ₹1,20,000." },
      { id: 70120, chapter: "cf", difficulty: "Hard",
        q: "The closing cash of the cash flow statement must equal:",
        options: ["The cash and cash equivalents on the balance sheet", "Net profit for the year", "Opening cash", "Total financing inflows"],
        answerIndex: 0,
        explanation: "The tie to the balance sheet is the statement's own proof of correctness." }
    ],

    /* ================= FLASHCARDS (ids 71073–71096) ================= */
    flashcards: [
      { id: 71073, chapter: "fsa", front: "Horizontal vs vertical analysis?", back: "Horizontal: change across years (comparative). Vertical: each line as % of a base within one year (common-size)." },
      { id: 71074, chapter: "fsa", front: "Percentage change formula?", back: "(Current − Base) ÷ Base × 100 — always divided by the base year." },
      { id: 71075, chapter: "fsa", front: "Common-size P&L base? Balance sheet base?", back: "Revenue from operations (P&L); Total assets (BS)." },
      { id: 71076, chapter: "fsa", front: "The comparison rule for expenses?", back: "Compare an expense's growth to revenue's growth — if slower, its share fell and efficiency improved." },
      { id: 71077, chapter: "fsa", front: "Receivables up 40%, revenue up 5% — reading?", back: "Collections trouble or pushed credit sales — check the aging and the provision for doubtful debts." },
      { id: 71078, chapter: "fsa", front: "Three limitations of analysis?", back: "Historical cost ignores inflation; policy changes move lines; window dressing misleads at a date." },
      { id: 71079, chapter: "fsa", front: "Internal vs external analysis?", back: "Internal: management, full access. External: lenders/investors, published statements only." },
      { id: 71080, chapter: "fsa", front: "Absolute vs percentage change?", back: "Absolute change shows materiality; percentage change shows momentum. Read them as a pair." },

      { id: 71081, chapter: "rat", front: "Four families of ratios?", back: "Liquidity, solvency, activity, profitability — name the family, then the formula." },
      { id: 71082, chapter: "rat", front: "Current ratio formula and comfort level?", back: "Current assets ÷ Current liabilities; about 2:1 is the traditional comfort mark." },
      { id: 71083, chapter: "rat", front: "Quick ratio formula?", back: "(Current assets − Inventory − Prepayments) ÷ Current liabilities — near 1:1 is the acid test." },
      { id: 71084, chapter: "rat", front: "Debt-equity and interest coverage formulas?", back: "Long-term debt ÷ Shareholders' funds; PBIT ÷ Interest." },
      { id: 71085, chapter: "rat", front: "Inventory turnover formula?", back: "COGS ÷ Average inventory; days = 365 ÷ turnover. Use the average when opening balances are given." },
      { id: 71086, chapter: "rat", front: "ROI formula?", back: "PBIT ÷ Capital employed × 100 — the financing-neutral return of the whole capital base." },
      { id: 71087, chapter: "rat", front: "Two routes to capital employed?", back: "Shareholders' funds + long-term debt; or Total assets − current liabilities. Both give the same figure." },
      { id: 71088, chapter: "rat", front: "Why never interpret a lone ratio?", back: "A single ratio is a fact; pairs, trends or a standard turn it into a conclusion worth writing." },

      { id: 71089, chapter: "cf", front: "Three activities of the cash flow statement?", back: "Operating (revenue engine), Investing (long-term assets), Financing (owners and lenders)." },
      { id: 71090, chapter: "cf", front: "Cash equivalents definition?", back: "Short-term, highly liquid investments readily convertible to known cash, insignificant value risk, held for short-term commitments." },
      { id: 71091, chapter: "cf", front: "The working capital direction rule?", back: "Current asset up = outflow; current liability up = inflow; mirror for decreases. Apply to the movement." },
      { id: 71092, chapter: "cf", front: "Indirect method skeleton?", back: "NPBT + non-cash charges ± working capital changes = operating cash flow." },
      { id: 71093, chapter: "cf", front: "Where do interest/dividend paid and received go (this course)?", back: "Paid → financing; received → investing." },
      { id: 71094, chapter: "cf", front: "Depreciation in the indirect method?", back: "Added back — it reduced profit but never moved cash." },
      { id: 71095, chapter: "cf", front: "The statement's self-check?", back: "Opening cash + net movement must equal closing cash on the balance sheet." },
      { id: 71096, chapter: "cf", front: "Profit vs cash?", back: "Profit counts a sale when invoiced; cash when collected. A profitable firm can still run out of cash — that is why this statement exists." }
    ]
  });
})();
