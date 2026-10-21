/* ============================================================
   CLASS 12 — EXPANSION L (v86): Cash Flow (cf) + Computerised
   Accounting (ca). Additive unit — extends the chapters registered
   by data-12d.js and data-12e.js. Content is original teaching
   material written for this project against the CBSE Class 12
   Accountancy curriculum (2026-27).
   ============================================================ */
(function () {
  "use strict";

  C12_DATA.register({
    content: {
      cf: {

        /* ---- Practice Bank (merged with existing ids 1–10) ---- */
        numericals: [
          {
            id: 11, difficulty: "Medium",
            question: "Net profit before tax ₹3,50,000; depreciation ₹70,000; loss on the sale of investments ₹20,000 (included in the profit); trade receivables up ₹45,000; inventories up ₹35,000; trade payables up ₹30,000. Cash generated from operations is:",
            options: ["₹3,90,000", "₹3,70,000", "₹3,50,000", "₹3,10,000"],
            answerIndex: 0,
            explanation: "3,50,000 + 70,000 + 20,000 − 45,000 − 35,000 + 30,000 = ₹3,90,000. The loss never moved cash, so it is added back like depreciation; both rising current assets consume cash and rising payables retain it."
          },
          {
            id: 12, difficulty: "Easy",
            question: "Machinery costing ₹2,00,000 (accumulated depreciation ₹1,20,000) was sold for ₹1,00,000. The sale produces a profit of:",
            options: ["₹20,000", "₹80,000", "₹1,20,000", "₹1,00,000"],
            answerIndex: 0,
            explanation: "Book value = 2,00,000 − 1,20,000 = ₹80,000; sold for ₹1,00,000, so the profit is 1,00,000 − 80,000 = ₹20,000 — that profit sits inside the operating figure and must be removed, while the ₹1,00,000 proceeds are shown under investing."
          },
          {
            id: 13, difficulty: "Medium",
            question: "During the year a company purchased a machine for ₹3,00,000 and sold its old machine for ₹1,20,000. Its cash flow from investing activities is:",
            options: ["A net outflow of ₹1,80,000", "A net inflow of ₹1,80,000", "A net outflow of ₹3,00,000", "A net outflow of ₹1,20,000"],
            answerIndex: 0,
            explanation: "1,20,000 proceeds − 3,00,000 paid = ₹1,80,000 net outflow. The purchase is a cash outflow and the disposal a cash inflow — both belong to investing, and the book value of the old machine is irrelevant here."
          },
          {
            id: 14, difficulty: "Easy",
            question: "Dividend paid of ₹40,000 is shown (in this course) under:",
            options: ["Financing activities, as a payment to the providers of equity finance", "Operating activities, as a charge against profit", "Investing activities, as a return paid out", "Nowhere — it is only an appropriation"],
            answerIndex: 0,
            explanation: "In this course, dividend paid is a transaction with the owners of the business, so the ₹40,000 is a financing outflow."
          },
          {
            id: 15, difficulty: "Medium",
            question: "Direct taxes paid during the year amounted to ₹60,000. In the prescribed format this is shown as:",
            options: ["A deduction inside the operating section, after cash generated from operations", "An outflow under investing activities", "An outflow under financing activities", "An adjustment added back to net profit before tax"],
            answerIndex: 0,
            explanation: "Direct taxes paid of ₹60,000 are deducted within the operating activities section, after cash generated from operations, to arrive at net cash from operating activities."
          },
          {
            id: 16, difficulty: "Hard",
            question: "Net profit before tax ₹4,00,000; depreciation ₹80,000; trade receivables up ₹50,000; trade payables up ₹20,000; direct taxes paid ₹60,000; interest paid ₹30,000 (financing in this course). Cash flow from operating activities is:",
            options: ["₹3,90,000", "₹3,60,000", "₹4,20,000", "₹4,50,000"],
            answerIndex: 0,
            explanation: "4,00,000 + 80,000 − 50,000 + 20,000 − 60,000 = ₹3,90,000. The ₹30,000 interest paid stays out of the operating section entirely because in this course it is a financing outflow — deducting it here would wrongly give ₹3,60,000."
          },
          {
            id: 17, difficulty: "Easy",
            question: "A company earned a net profit of ₹6,50,000 but its operations generated only ₹5,00,000 of cash. The most likely explanation is:",
            options: ["Working capital absorbed cash — receivables and inventory grew during the year", "The company paid no depreciation at all", "Financing activities produced the difference", "Profit is always higher than cash by definition"],
            answerIndex: 0,
            explanation: "Rising trade receivables and inventories tie up cash that the profit statement has already recognised — the direction rule at work; the ₹1,50,000 gap is the year's working capital absorption."
          },
          {
            id: 18, difficulty: "Easy",
            question: "Trade payables decreased by ₹40,000 during the year. The effect on operating cash flow is:",
            options: ["An outflow of ₹40,000", "An inflow of ₹40,000", "No effect", "An outflow of ₹80,000"],
            answerIndex: 0,
            explanation: "A current liability falling means suppliers were paid down — last year's unpaid purchases were settled, so ₹40,000 of cash left the business."
          },
          {
            id: 19, difficulty: "Medium",
            question: "Prepaid expenses increased by ₹12,000 and accrued income increased by ₹8,000 during the year. The combined effect on operating cash flow is:",
            options: ["A net outflow of ₹20,000", "A net inflow of ₹20,000", "A net outflow of ₹4,000", "No effect"],
            answerIndex: 0,
            explanation: "Both are current assets, and both rose: 12,000 + 8,000 = ₹20,000 of cash consumed — prepayments are money paid ahead and accrued income is earnings not yet collected."
          },
          {
            id: 20, difficulty: "Hard",
            question: "A company's cash and cash equivalents stood at ₹1,50,000 on 1st April, 2026. During the year its operations generated ₹4,25,000, investing consumed ₹2,00,000 and financing consumed ₹1,05,000. The closing cash and cash equivalents will be shown as:",
            options: ["₹2,70,000", "₹4,70,000", "₹1,20,000", "₹70,000"],
            answerIndex: 0,
            explanation: "Net movement = 4,25,000 − 2,00,000 − 1,05,000 = ₹1,20,000 increase; opening 1,50,000 + 1,20,000 = ₹2,70,000, which must also equal the movement shown in the balance sheet."
          },
          {
            id: 21, difficulty: "Medium",
            question: "A company made a bonus issue of shares to its existing shareholders during the year. In the cash flow statement this:",
            options: ["Has no effect — no cash moves, so it is never reported", "Is a financing inflow of the face value of the bonus shares", "Is an investing outflow", "Is deducted from operating cash flow"],
            answerIndex: 0,
            explanation: "A bonus issue merely capitalises reserves — no cash comes in or goes out — and AS 3 reports only movements in cash and cash equivalents, so the transaction is not shown at all."
          },
          {
            id: 22, difficulty: "Hard",
            question: "A young company reports cash flow from operating activities of ₹(1,20,000), investing outflow of ₹3,00,000 and financing inflow of ₹4,50,000. The correct reading is:",
            options: ["The core business is burning cash and its growth is being funded by borrowings or fresh capital — a warning to investigate", "Operations are healthy and funding the company's investments", "The company is repaying its lenders quickly out of operating cash", "The company is living off the sale of its long-term assets"],
            answerIndex: 0,
            explanation: "Operations consumed ₹1,20,000 and investing consumed ₹3,00,000, together ₹4,20,000, which the ₹4,50,000 of financing almost exactly funds — the business survives on outside money, not on what it earns."
          },
          {
            id: 23, difficulty: "Easy",
            question: "A firm purchased investments for ₹50,000, sold machinery (book value ₹30,000) for ₹35,000 and received ₹6,000 as interest on investments. In this course its cash flow from investing activities is:",
            options: ["A net outflow of ₹9,000", "A net inflow of ₹9,000", "A net outflow of ₹21,000", "A net outflow of ₹15,000"],
            answerIndex: 0,
            explanation: "−50,000 + 35,000 + 6,000 = ₹9,000 net outflow. Interest received is an investing inflow in this course, and the ₹35,000 proceeds — not the ₹30,000 book value — are the cash figure."
          },
          {
            id: 24, difficulty: "Medium",
            question: "Trade receivables decreased by ₹25,000 while inventories increased by ₹15,000. The net effect of these two movements on operating cash flow is:",
            options: ["A net inflow of ₹10,000", "A net outflow of ₹10,000", "A net inflow of ₹40,000", "A net outflow of ₹40,000"],
            answerIndex: 0,
            explanation: "Receivables down ₹25,000 releases cash; inventory up ₹15,000 absorbs cash: 25,000 − 15,000 = ₹10,000 net inflow."
          },
          {
            id: 25, difficulty: "Hard",
            question: "An accountant added depreciation of ₹50,000 back to net profit and then also showed it as an outflow below 'cash generated from operations'. Compared with the correct statement, the operating cash flow shown is:",
            options: ["Understated by ₹50,000", "Overstated by ₹50,000", "Understated by ₹1,00,000", "Correct — the two effects cancel"],
            answerIndex: 0,
            explanation: "The correct treatment adds back ₹50,000 once; the wrong statement adds it and then subtracts it, showing a net nil adjustment — so the figure is ₹50,000 lower than it should be."
          }
        ],

        /* ---- Interactive calc bench (engine strings copied verbatim
               from data-12d.js; only the case list grows) ---- */
        activity: {
          type: "calc",
          title: "Operating Cash Flow Bench",
          instruction: "Convert accrual profit to operating cash, line by line. Enter every figure exactly as the working note should show it; the bench verifies each before revealing its own.",
          problems: [
            {
              prompt: "Net profit before tax ₹3,20,000; depreciation ₹55,000; loss on the sale of old equipment ₹25,000; trade receivables up ₹60,000; inventories up ₹20,000; trade payables up ₹10,000. Find cash generated from operations.",
              inputs: [
                { key: "op", label: "Cash generated from operations (₹)", placeholder: "e.g. 330000" }
              ],
              answers: { op: 330000 },
              formula: "NPBT + Depreciation + Loss on sale − Increase in receivables − Increase in inventory + Increase in payables",
              working: "3,20,000 + 55,000 + 25,000 − 60,000 − 20,000 + 10,000 = <b>₹3,30,000</b>. The loss is added back exactly like depreciation — it reduced profit without paying out any cash."
            },
            {
              prompt: "Cash generated from operations ₹4,40,000; direct taxes paid ₹75,000; interest paid ₹35,000 (shown under financing activities in this course). Find net cash from operating activities.",
              inputs: [
                { key: "op", label: "Net cash from operating activities (₹)", placeholder: "e.g. 365000" }
              ],
              answers: { op: 365000 },
              formula: "Cash generated from operations − Direct taxes paid",
              working: "4,40,000 − 75,000 = <b>₹3,65,000</b>. Direct taxes are deducted inside the operating section, but the ₹35,000 interest paid belongs to financing in this course and must not be touched here."
            },
            {
              prompt: "Cash flow from operating activities ₹3,65,000; old furniture sold for proceeds of ₹60,000; a delivery van purchased for ₹2,40,000; shares issued for cash ₹1,50,000; interest paid ₹35,000. Find the investing total, the financing total and the net increase in cash and cash equivalents.",
              inputs: [
                { key: "inv", label: "Net cash used in investing activities (₹)", placeholder: "e.g. -180000" },
                { key: "fin", label: "Net cash from financing activities (₹)", placeholder: "e.g. 115000" },
                { key: "net", label: "Net increase in cash and cash equivalents (₹)", placeholder: "e.g. 300000" }
              ],
              answers: { inv: -180000, fin: 115000, net: 300000 },
              formula: "Investing = Proceeds − Purchase · Financing = Issue − Interest paid · Net = Operating + Investing + Financing",
              working: "Investing: 60,000 − 2,40,000 = <b>−₹1,80,000</b>. Financing: 1,50,000 − 35,000 = <b>₹1,15,000</b>. Net: 3,65,000 − 1,80,000 + 1,15,000 = <b>₹3,00,000</b> increase in cash and cash equivalents."
            },
            {
              prompt: "Net profit before tax ₹2,80,000 — it already includes interest received on investments of ₹20,000 and dividend received of ₹15,000; depreciation ₹35,000; trade receivables up ₹45,000; trade payables down ₹10,000. Reclassify the two receipts under investing activities (this course's convention) and find cash flow from operating activities and cash flow from investing activities.",
              inputs: [
                { key: "op", label: "Cash flow from operating activities (₹)", placeholder: "e.g. 225000" },
                { key: "inv", label: "Cash flow from investing activities (₹)", placeholder: "e.g. 35000" }
              ],
              answers: { op: 225000, inv: 35000 },
              formula: "Operating = NPBT + Depreciation − Increase in receivables − Decrease in payables − Interest and dividend received · Investing = Interest and dividend received",
              working: "Operating: 2,80,000 + 35,000 − 45,000 − 10,000 − 20,000 − 15,000 = <b>₹2,25,000</b>. Investing: 20,000 + 15,000 = <b>₹35,000</b>. Both receipts sit inside profit before tax, but in this course they belong to investing — so they leave the operating figure and reappear there, relocated rather than lost."
            }
          ]
        },

        /* ---- Exam cases (existing ids are 1 and 2) ---- */
        examCases: [
          {
            id: 3,
            title: "The year in full",
            passage: "For the year ended 31st March, 2027 a trading company reported net profit before tax of ₹5,40,000. That figure had already been charged with interest paid of ₹45,000 and included a profit of ₹15,000 on the sale of a delivery van. During the year trade receivables rose by ₹70,000, inventories rose by ₹30,000 and trade payables rose by ₹25,000. Direct taxes paid were ₹95,000. The van was sold for ₹85,000, a new machine was bought for ₹3,20,000, a five-year loan of ₹2,00,000 was raised and equity shares of ₹1,00,000 were issued for cash.",
            difficulty: "Hard",
            subs: [
              {
                q: "Cash flow from operating activities:",
                options: ["₹4,45,000", "₹5,40,000", "₹4,60,000", "₹4,00,000"],
                answerIndex: 0,
                reasoning: "5,40,000 + 90,000 depreciation − 15,000 profit on sale − 70,000 − 30,000 + 25,000 = 5,40,000 cash generated, less direct taxes paid ₹95,000 = ₹4,45,000. The interest of ₹45,000 is a financing outflow in this course and is not deducted here."
              },
              {
                q: "Cash flow from investing activities:",
                options: ["A net outflow of ₹2,35,000", "A net inflow of ₹2,35,000", "A net outflow of ₹3,20,000", "A net outflow of ₹2,50,000"],
                answerIndex: 0,
                reasoning: "Proceeds of ₹85,000 less the machine costing ₹3,20,000 = ₹2,35,000 net outflow. The ₹15,000 profit on the van is not a cash figure — it was removed from operating instead."
              },
              {
                q: "Cash flow from financing activities:",
                options: ["A net inflow of ₹2,55,000", "A net inflow of ₹3,00,000", "A net inflow of ₹2,45,000", "A net outflow of ₹45,000"],
                answerIndex: 0,
                reasoning: "Loan raised ₹2,00,000 + shares issued ₹1,00,000 − interest paid ₹45,000 = ₹2,55,000 net inflow."
              },
              {
                q: "Net increase in cash and cash equivalents:",
                options: ["₹4,65,000", "₹4,45,000", "₹2,10,000", "₹5,10,000"],
                answerIndex: 0,
                reasoning: "4,45,000 − 2,35,000 + 2,55,000 = ₹4,65,000, which must equal the movement in cash and cash equivalents shown on the balance sheet."
              }
            ]
          },
          {
            id: 4,
            title: "Closing the year's cash",
            passage: "Nila Ltd. held cash and cash equivalents of ₹1,75,000 on 1st April, 2026. For the year ended 31st March, 2027 it reported net profit before tax of ₹2,25,000, after charging depreciation of ₹45,000 and after a loss of ₹5,000 on the sale of investments. Trade receivables fell by ₹35,000, inventories rose by ₹15,000 and trade payables fell by ₹20,000. Direct taxes paid were ₹30,000. Investments costing ₹60,000 were sold for ₹55,000; a machine was purchased for ₹1,40,000; a loan of ₹1,00,000 was repaid; interest paid was ₹12,000 and dividend paid was ₹25,000.",
            difficulty: "Medium",
            subs: [
              {
                q: "Cash flow from operating activities:",
                options: ["₹2,45,000", "₹2,75,000", "₹2,40,000", "₹2,33,000"],
                answerIndex: 0,
                reasoning: "2,25,000 + 45,000 + 5,000 + 35,000 − 15,000 − 20,000 = 2,75,000 cash generated, less direct taxes paid ₹30,000 = ₹2,45,000. Skipping the loss add-back would wrongly give ₹2,40,000 and deducting the ₹12,000 interest here would wrongly give ₹2,33,000."
              },
              {
                q: "Cash flow from investing activities:",
                options: ["A net outflow of ₹85,000", "A net inflow of ₹85,000", "A net outflow of ₹1,40,000", "A net outflow of ₹90,000"],
                answerIndex: 0,
                reasoning: "Sale proceeds ₹55,000 less machine purchased ₹1,40,000 = ₹85,000 net outflow — the ₹5,000 book loss is an operating adjustment, not a cash figure."
              },
              {
                q: "Closing cash and cash equivalents on 31st March, 2027:",
                options: ["₹1,98,000", "₹2,68,000", "₹1,52,000", "₹1,75,000"],
                answerIndex: 0,
                reasoning: "Financing = −1,00,000 − 12,000 − 25,000 = −₹1,37,000; net movement = 2,45,000 − 85,000 − 1,37,000 = ₹23,000 increase; opening 1,75,000 + 23,000 = ₹1,98,000."
              }
            ]
          }
        ],

        /* ---- Short exam numericals (existing ids are 1, 2 and 3) ---- */
        examNumericals: [
          {
            id: 4,
            q: "Net profit before tax ₹3,00,000; depreciation ₹50,000; trade receivables down ₹30,000; trade payables down ₹20,000; direct taxes paid ₹40,000. Net cash from operating activities (₹).",
            value: 320000,
            explanation: "3,00,000 + 50,000 + 30,000 − 20,000 = 3,60,000 cash generated from operations, less direct taxes paid of 40,000 = ₹3,20,000.",
            difficulty: "Medium"
          },
          {
            id: 5,
            q: "Operating ₹4,00,000; investments purchased ₹2,50,000; investments sold for ₹90,000; loan raised ₹1,50,000; interest paid ₹30,000; dividend paid ₹50,000. Net increase in cash and cash equivalents (₹).",
            value: 310000,
            explanation: "Investing: 90,000 − 2,50,000 = −1,60,000; financing: 1,50,000 − 30,000 − 50,000 = +70,000; net = 4,00,000 − 1,60,000 + 70,000 = ₹3,10,000.",
            difficulty: "Hard"
          },
          {
            id: 6,
            q: "Cash and cash equivalents on 1st April, 2026 were ₹2,40,000. During the year, operating activities generated ₹3,35,000, investing activities used ₹1,90,000 and financing activities used ₹2,25,000. Closing cash and cash equivalents (₹).",
            value: 160000,
            explanation: "Net movement = 3,35,000 − 1,90,000 − 2,25,000 = −₹80,000; closing = 2,40,000 − 80,000 = ₹1,60,000.",
            difficulty: "Medium"
          }
        ]
      },

      ca: {

        /* ---- Practice Bank (merged with existing ids 1–10) ---- */
        numericals: [
          {
            id: 11, difficulty: "Medium",
            question: "Cash book balance ₹65,000; cheques issued ₹9,000 not yet presented; cheques deposited ₹12,000 not yet credited by the bank; bank charges of ₹1,500 and interest credited of ₹2,500 do not appear in the cash book. Balance as per pass book:",
            options: ["₹63,000", "₹69,000", "₹60,500", "₹62,000"],
            answerIndex: 0,
            explanation: "65,000 + 9,000 − 12,000 − 1,500 + 2,500 = ₹63,000. Unpresented cheques make the pass book higher, uncredited cheques make it lower, the bank charges have already reduced it and the interest has already increased it."
          },
          {
            id: 12, difficulty: "Easy",
            question: "A spreadsheet lists 19 transactions in cells B2:B20. Which function returns the number of transactions recorded?",
            options: ["COUNT(B2:B20)", "SUM(B2:B20)", "AVERAGE(B2:B20)", "MAX(B2:B20)"],
            answerIndex: 0,
            explanation: "COUNT(B2:B20) counts how many entries the range holds; SUM would add their values, AVERAGE would give their mean and MAX would return the largest value."
          },
          {
            id: 13, difficulty: "Medium",
            question: "A loan schedule opens with an outstanding loan of ₹4,00,000 at 9% per annum, repaid in equal annual instalments of ₹1,20,000. The closing outstanding after the first instalment is:",
            options: ["₹3,16,000", "₹2,80,000", "₹3,64,000", "₹3,60,000"],
            answerIndex: 0,
            explanation: "Interest for the year = 4,00,000 × 9% = ₹36,000, so principal repaid = 1,20,000 − 36,000 = ₹84,000 and closing outstanding = 4,00,000 − 84,000 = ₹3,16,000. Treating the whole instalment as principal would wrongly give ₹2,80,000."
          },
          {
            id: 14, difficulty: "Easy",
            question: "An asset of ₹1,80,000 is depreciated at 20% per annum on the written-down value method. Its WDV at the end of the first year is:",
            options: ["₹1,44,000", "₹1,62,000", "₹1,26,000", "₹36,000"],
            answerIndex: 0,
            explanation: "First-year depreciation = 1,80,000 × 20% = ₹36,000, so the closing WDV in the asset register is 1,80,000 − 36,000 = ₹1,44,000."
          },
          {
            id: 15, difficulty: "Hard",
            question: "An asset of ₹2,50,000 is depreciated at 20% per annum on the written-down value method. The depreciation charged in the SECOND year is:",
            options: ["₹40,000", "₹50,000", "₹45,000", "₹36,000"],
            answerIndex: 0,
            explanation: "Year 1: 2,50,000 × 20% = ₹50,000, leaving a WDV of ₹2,00,000. Year 2: 2,00,000 × 20% = ₹40,000 — the rate falls on the opening WDV of the year, not on the original cost, which would wrongly repeat ₹50,000."
          },
          {
            id: 16, difficulty: "Easy",
            question: "In cell E2 a spreadsheet holds the formula =C2−D2. When it is copied down to cell E7, the formula in E7 reads:",
            options: ["=C7−D7", "=C2−D2", "=C7−D2", "=C5−D5"],
            answerIndex: 0,
            explanation: "Both references are relative, so they shift with the copy — row 2 becomes row 7 in each term, giving =C7−D7 and keeping each row's own figures in the subtraction."
          },
          {
            id: 17, difficulty: "Hard",
            question: "A credit sale of ₹24,000 to Ravi was correctly debited to trade receivables (1-01-03) but credited to Cash-in-hand (1-01-01) instead of Revenue (3-01-01). The effect in the computerised books is:",
            options: ["The trial balance still agrees, but the cash balance and revenue are each understated by ₹24,000", "The trial balance does not agree, so the software detects the error immediately", "Trade receivables are overstated by ₹24,000", "Revenue is overstated by ₹24,000 while cash remains correct"],
            answerIndex: 0,
            explanation: "The wrong entry still has one debit and one credit of ₹24,000, so the totals agree and validation cannot catch it — but cash was credited although no cash moved, and the credit to revenue never happened. Only verification against the invoice would find this."
          },
          {
            id: 18, difficulty: "Easy",
            question: "Which of these is a specific software package?",
            options: ["A readymade accounting package sold to hundreds of businesses of the same kind", "A spreadsheet package used by millions of users for any purpose", "A package built for one company's own account heads and reports", "The operating system running the application"],
            answerIndex: 0,
            explanation: "A specific package is designed for accounting itself and suits a class of firms; the spreadsheet is generic, the one-company package is tailored and the operating system is system software, not application software."
          },
          {
            id: 19, difficulty: "Medium",
            question: "A user in an accounting system has been given only data-entry rights. She can:",
            options: ["Enter vouchers, but not alter reports or delete vouchers posted by others", "Change any figure in any report at any time", "Delete the audit trail along with the vouchers she posted", "Alter the chart of accounts and take backups of the data"],
            answerIndex: 0,
            explanation: "Per-user access rights are logical security: the role permits entry but withholds alteration of reports, deletion of others' vouchers and any change to the masters — limiting both error and misuse."
          },
          {
            id: 20, difficulty: "Medium",
            question: "Checking that the total of debit balances equals the total of credit balances in the trial balance is an example of:",
            options: ["Verification — it confirms what has already been posted", "Validation — it prevents bad data from entering", "A backup procedure", "An adjusting entry passed at year end"],
            answerIndex: 0,
            explanation: "The trial balance test works on data already in the books — it is verification. Validation would refuse the bad voucher at the moment of entry, before any balance was affected."
          },
          {
            id: 21, difficulty: "Hard",
            question: "Balance as per pass book ₹1,10,000; cheques issued ₹15,000 not yet presented; cheques deposited ₹18,000 not yet credited; the bank has debited ₹2,000 as a loan instalment under a standing instruction, not recorded in the cash book. Balance as per cash book:",
            options: ["₹1,15,000", "₹1,09,000", "₹1,25,000", "₹1,07,000"],
            answerIndex: 0,
            explanation: "Working backwards from the pass book: 1,10,000 − 15,000 + 18,000 + 2,000 = ₹1,15,000. Unpresented cheques must be removed from the pass book figure, unc credited cheques added back, and the unrecorded bank debit of ₹2,000 added back — and then a correcting entry posted in the books."
          },
          {
            id: 22, difficulty: "Easy",
            question: "Adjusting entries in a computerised system are passed:",
            options: ["At the year end, before the financial statements are drawn, exactly as in manual books", "Only after the financial statements have been finalised", "Never — the software calculates their effect automatically", "Only for nominal accounts, never for real accounts"],
            answerIndex: 0,
            explanation: "Preliminary, adjusting, closing and opening entries are all passed in the system exactly as by hand, and the statements are drawn from the adjusted ledger."
          },
          {
            id: 23, difficulty: "Medium",
            question: "Codification of account heads helps the software mainly because:",
            options: ["The code's position tells it where to group the entry when building ledgers and statements", "It replaces the need for a trial balance", "It encrypts the accounting data against intrusion", "It computes depreciation without being given a rate"],
            answerIndex: 0,
            explanation: "Each code segment carries a place in the hierarchy — main group, sub-group, account head, ledger — so one entry can populate the right ledger, trial balance and statement line without anyone re-typing it."
          },
          {
            id: 24, difficulty: "Hard",
            question: "A loan of ₹3,00,000 at 12% per annum is repaid in equal annual instalments of ₹90,000. The interest charged in the SECOND year of the schedule is:",
            options: ["₹29,520", "₹36,000", "₹32,520", "₹26,520"],
            answerIndex: 0,
            explanation: "Year 1: interest 3,00,000 × 12% = ₹36,000, principal 90,000 − 36,000 = ₹54,000, closing outstanding ₹2,46,000. Year 2 interest = 2,46,000 × 12% = ₹29,520 — the rate falls on the reduced outstanding, not on the original ₹3,00,000, which would wrongly repeat ₹36,000."
          },
          {
            id: 25, difficulty: "Medium",
            question: "In a spreadsheet ratio report, current assets are read from a cell showing ₹6,00,000 and current liabilities from a cell showing ₹3,00,000, with the ratio computed by formula. The current assets cell is then revised to ₹7,50,000. The ratio will now show:",
            options: ["2.5:1", "2:1", "1.5:1", "3:1"],
            answerIndex: 0,
            explanation: "7,50,000 ÷ 3,00,000 = 2.5:1 — live recalculation rebuilds the ratio the moment the input changes, which is the whole point of building the report from formulas."
          }
        ],

        /* ---- Interactive classify lab (engine strings copied verbatim
               from data-12e.js; only the case list grows) ---- */
        activity: {
          type: "classify",
          title: "Account Head Sorter",
          instruction: "Every account, code and spreadsheet job has one correct place. Sort each item into its home; the working appears when every set is placed correctly.",
          sets: [
            {
              title: "Set 4 — Which layer of security?",
              prompt: "Place each measure in the security layer it belongs to.",
              buckets: ["Physical", "Logical", "Recovery"],
              items: [
                { label: "Uninterruptible power supply for the server", bucket: "Physical" },
                { label: "Locked room housing the machines", bucket: "Physical" },
                { label: "A password required at every login", bucket: "Logical" },
                { label: "Access rights that stop a data-entry user deleting posted vouchers", bucket: "Logical" },
                { label: "Nightly copies of the data stored off-site", bucket: "Recovery" },
                { label: "Restoring yesterday's copy after a disk crash", bucket: "Recovery" }
              ],
              working: "Physical measures protect the machines themselves; logical measures protect the data from unauthorised use; recovery measures restore the books after the worst has happened. A backup is recovery, not prevention — it helps only once something has already gone wrong."
            },
            {
              title: "Set 5 — Validation, verification or adjustment?",
              prompt: "Place each check or entry at the stage it belongs to.",
              buckets: ["Validation at entry", "Verification after posting", "Adjusting entries"],
              items: [
                { label: "A month field refuses the value 13", bucket: "Validation at entry" },
                { label: "A voucher carrying an account code not in the chart is rejected", bucket: "Validation at entry" },
                { label: "Debit and credit totals of the trial balance are compared", bucket: "Verification after posting" },
                { label: "The audit trail is read to find who altered a posted voucher", bucket: "Verification after posting" },
                { label: "Year-end entry charging depreciation for the year", bucket: "Adjusting entries" },
                { label: "Entry recording insurance paid in advance as an asset of the new year", bucket: "Adjusting entries" }
              ],
              working: "Validation stops impossible data before it enters; verification confirms what has already been posted; adjusting entries bring the ledger to its true state — preliminary, adjusting, closing and opening — before the statements are drawn from it."
            },
            {
              title: "Set 6 — Generic, specific or tailored?",
              prompt: "Place each package by the audience it was built for.",
              buckets: ["Generic", "Specific", "Tailored"],
              items: [
                { label: "A spreadsheet package used to keep a shop's accounts", bucket: "Generic" },
                { label: "A word processor turned into a voucher printer", bucket: "Generic" },
                { label: "A readymade accounting package sold to thousands of retailers", bucket: "Specific" },
                { label: "A billing package designed for pharmacies as a class", bucket: "Specific" },
                { label: "A package rewritten for one jeweller's account heads and reports", bucket: "Tailored" },
                { label: "A ledger module adapted to one hospital's exact controls", bucket: "Tailored" }
              ],
              working: "Generic software serves any purpose for any user; specific software is built for accounting and suits a class of firms; tailored software is built for one organisation alone — the closest fit, the highest cost. Fit and cost rise together across the three."
            },
            {
              title: "Set 7 — Which validation rule is this?",
              prompt: "Place each entry check in the family of validation rules it uses.",
              buckets: ["Range check", "List check", "Format check", "Cross-field check"],
              items: [
                { label: "A quantity field refuses the value −5 units", bucket: "Range check" },
                { label: "A discount field accepts only values from 0 to 100 percent", bucket: "Range check" },
                { label: "A voucher with account code 5-99-99 is refused — no such head exists", bucket: "List check" },
                { label: "A bank column entry must name a bank from the approved master list", bucket: "List check" },
                { label: "A date field accepts only a valid calendar date", bucket: "Format check" },
                { label: "A delivery date earlier than the order date is refused", bucket: "Cross-field check" }
              ],
              working: "Range checks test bounds, list checks test membership of a master, format checks test the shape of the data and cross-field checks test the relationship between two fields — all applied at the moment of entry, so nothing impossible ever reaches the books."
            },
            {
              title: "Set 8 — Reconciliation: which way does each item move?",
              prompt: "Place each item by the treatment it needs when the cash book balance is taken to the pass book balance.",
              buckets: ["Add to reach the pass book balance", "Deduct to reach the pass book balance"],
              items: [
                { label: "Cheques issued but not yet presented by the bank", bucket: "Add to reach the pass book balance" },
                { label: "A cheque deposited but not yet credited by the bank", bucket: "Deduct to reach the pass book balance" },
                { label: "Bank interest credited but not entered in the cash book", bucket: "Add to reach the pass book balance" },
                { label: "Bank charges debited but not entered in the cash book", bucket: "Deduct to reach the pass book balance" },
                { label: "A direct tax refund credited by the bank, not yet booked", bucket: "Add to reach the pass book balance" },
                { label: "A loan instalment paid directly by the bank, not yet booked", bucket: "Deduct to reach the pass book balance" }
              ],
              working: "Unpresented cheques and uncredited deposits are timing differences; the interest, charges, refunds and direct debits are one-sided items that also need correcting entries in the books. The direction always follows what the bank has already done that the cash book has not."
            }
          ]
        },

        /* ---- Exam cases (existing id is 1) ---- */
        examCases: [
          {
            id: 2,
            title: "Closing the year in a computerised set of books",
            passage: "Anu Traders closes its computerised books for the year ended 31st March, 2027. Salaries for March of ₹48,000 remain unpaid; depreciation on machinery for the year is ₹60,000; insurance of ₹9,000 relates to the next year and had been wholly charged this year; and ₹15,000 of the interest received has been received in advance. The final statements must be drawn from the adjusted ledger before the nominal accounts are closed and the new year opened.",
            difficulty: "Medium",
            subs: [
              {
                q: "The adjusting entry for the unpaid March salaries will:",
                options: ["Debit Salaries A/c ₹48,000 and credit Salary Payable A/c ₹48,000", "Debit Cash A/c ₹48,000 and credit Salaries A/c ₹48,000", "Be omitted — unpaid salaries do not affect this year", "Debit Salary Payable A/c and credit Salaries A/c"],
                answerIndex: 0,
                reasoning: "The expense belongs to the year just closed although no cash has moved: debit Salaries A/c and create the liability of ₹48,000 — an outstanding expense, exactly as by hand."
              },
              {
                q: "The prepaid insurance of ₹9,000 will appear on the 31st March, 2027 Balance Sheet as:",
                options: ["A current asset — prepaid insurance", "An expenditure of the year just closed", "A current liability", "An appropriation of profit"],
                answerIndex: 0,
                reasoning: "The ₹9,000 was paid for a benefit of the next year, so the adjusting entry removes it from this year's expense and leaves it on the balance sheet as a current asset."
              },
              {
                q: "The interest received in advance of ₹15,000 is shown on 31st March, 2027 as:",
                options: ["A current liability — income received in advance", "Income of the year just closed", "A current asset", "A reserve of the firm"],
                answerIndex: 0,
                reasoning: "The firm owes the service or the period against the ₹15,000 already collected, so it is a current liability until it is earned."
              },
              {
                q: "The correct order of year-end processing in the system is:",
                options: ["Adjusting entries → financial statements → closing entries → opening entries", "Closing entries → financial statements → adjusting entries → opening entries", "Opening entries → adjusting entries → closing entries → financial statements", "Financial statements → opening entries → adjusting entries → closing entries"],
                answerIndex: 0,
                reasoning: "The statements are drawn from the adjusted ledger, so the adjusting entries come first; only then are the nominal accounts closed and the new year opened with the balances carried forward."
              }
            ]
          },
          {
            id: 3,
            title: "Reconciliation and a loan schedule, side by side",
            passage: "Sunil maintains a small firm's books in a spreadsheet. On 31st March, 2027 the cash book column shows ₹2,30,000. Cheques issued ₹34,000 had not been presented; cheques deposited ₹28,000 had not been credited; and the bank had charged ₹2,000 and credited ₹4,000, neither entry appearing in the cash book. In the same sheet, a loan of ₹5,00,000 taken on 1st April, 2026 at 10% per annum is repaid in equal annual instalments of ₹1,30,000, the first instalment falling due on 31st March, 2027.",
            difficulty: "Hard",
            subs: [
              {
                q: "Balance as per pass book on 31st March, 2027:",
                options: ["₹2,38,000", "₹2,26,000", "₹2,64,000", "₹2,32,000"],
                answerIndex: 0,
                reasoning: "2,30,000 + 34,000 − 28,000 − 2,000 + 4,000 = ₹2,38,000 — add the unpresented cheques, deduct the uncredited deposits, deduct the bank charges and add the interest the bank has already credited."
              },
              {
                q: "Interest charged in the loan schedule for the first year:",
                options: ["₹50,000", "₹1,30,000", "₹37,000", "₹65,000"],
                answerIndex: 0,
                reasoning: "5,00,000 × 10% = ₹50,000 for the year — the rate falls on the opening outstanding of the full loan."
              },
              {
                q: "Principal repaid with the first instalment:",
                options: ["₹80,000", "₹1,30,000", "₹50,000", "₹30,000"],
                answerIndex: 0,
                reasoning: "1,30,000 instalment − 50,000 interest = ₹80,000 of principal — only the principal component reduces the loan."
              },
              {
                q: "Outstanding loan on 31st March, 2027 after the first instalment:",
                options: ["₹4,20,000", "₹3,70,000", "₹4,50,000", "₹3,50,000"],
                answerIndex: 0,
                reasoning: "5,00,000 − 80,000 = ₹4,20,000 — the closing balance of one row becomes the opening outstanding of the next."
              }
            ]
          }
        ],

        /* ---- Short exam numericals (existing ids are 1 and 2) ---- */
        examNumericals: [
          {
            id: 3,
            q: "Loan schedule: opening outstanding ₹1,80,000 at 12% per annum; annual instalment ₹60,000. Closing outstanding after the first instalment (₹).",
            value: 141600,
            explanation: "Interest = 1,80,000 × 12% = ₹21,600; principal = 60,000 − 21,600 = ₹38,400; closing outstanding = 1,80,000 − 38,400 = ₹1,41,600.",
            difficulty: "Medium"
          },
          {
            id: 4,
            q: "An asset of ₹4,00,000 is depreciated at 15% per annum on the straight line method for a full year. Closing written-down value in the asset register (₹).",
            value: 340000,
            explanation: "Depreciation = 4,00,000 × 15% = ₹60,000; closing WDV = 4,00,000 − 60,000 = ₹3,40,000.",
            difficulty: "Easy"
          },
          {
            id: 5,
            q: "An asset of ₹2,00,000 is depreciated at 20% per annum on the written-down value method. Total depreciation for the first two years (₹).",
            value: 72000,
            explanation: "Year 1: 2,00,000 × 20% = ₹40,000, leaving a WDV of ₹1,60,000. Year 2: 1,60,000 × 20% = ₹32,000. Total = 40,000 + 32,000 = ₹72,000.",
            difficulty: "Hard"
          }
        ]
      }
    },

    /* ============ QUIZ (ids 70296–70310) ============ */
    quiz: [
      { id: 70296, chapter: "cf", difficulty: "Easy",
        q: "For the cash flow statement, 'cash' means:",
        options: ["Cash in hand and demand deposits with banks", "Cash in hand plus fixed deposits with banks", "Cash in hand plus all short-term investments", "Every asset that can be converted to cash within a year"],
        answerIndex: 0,
        explanation: "Only cash in hand and demand deposits count as cash; fixed deposits and other convertible holdings must first qualify as cash equivalents on their own terms." },
      { id: 70297, chapter: "cf", difficulty: "Easy",
        q: "Which of these is a cash equivalent?",
        options: ["A treasury bill bought a week before it matures", "An investment in the shares of another company", "Inventory held for ordinary sale", "A machine installed in the factory"],
        answerIndex: 0,
        explanation: "A short-term, highly liquid holding bought close to maturity, readily convertible to a known amount of cash with insignificant value risk — the other three fail one or more conditions." },
      { id: 70298, chapter: "cf", difficulty: "Medium",
        q: "A profit of ₹25,000 on the sale of machinery is included inside net profit. In the indirect method this profit is:",
        options: ["Deducted from operating cash flow — the gain belongs to the investing activity", "Added back to operating cash flow, like depreciation", "Left inside operating cash flow, because it is genuine profit", "Shown as a financing inflow"],
        answerIndex: 0,
        explanation: "The whole cash effect of the sale — the proceeds — is reported under investing, so the ₹25,000 gain sitting inside profit must be removed from operating to avoid double counting." },
      { id: 70299, chapter: "cf", difficulty: "Medium",
        q: "Inventories decreased by ₹18,000 during the year. In the indirect method this is:",
        options: ["An addition of ₹18,000 to operating profit — a current asset falling releases cash", "A deduction of ₹18,000 from operating profit", "An investing inflow of ₹18,000", "No effect on operating cash flow"],
        answerIndex: 0,
        explanation: "Stock was sold down without being replaced, so ₹18,000 of the year's sales converted into cash rather than into new inventory." },
      { id: 70300, chapter: "cf", difficulty: "Easy",
        q: "Proceeds from the issue of 5,000 equity shares of ₹100 each are shown under financing activities as an inflow of:",
        options: ["₹5,00,000", "₹50,000", "₹5,000", "₹1,00,000"],
        answerIndex: 0,
        explanation: "5,000 × 100 = ₹5,00,000 raised from the owners — financing inflow when the shares are issued for cash." },
      { id: 70301, chapter: "cf", difficulty: "Medium",
        q: "Dividend paid of ₹35,000 during the year is shown (in this course) under:",
        options: ["Financing activities — a payment to the providers of equity finance", "Operating activities — it is debited in the profit and loss account", "Investing activities — it is a return paid out", "As an addition back to net profit"],
        answerIndex: 0,
        explanation: "In this course, dividend paid is treated as a transaction with the owners — a financing outflow of ₹35,000." },
      { id: 70302, chapter: "cf", difficulty: "Hard",
        q: "Net profit before tax ₹2,60,000; depreciation ₹40,000; profit on the sale of investments ₹15,000 (included in the profit); trade receivables down ₹20,000; trade payables down ₹10,000. Cash generated from operations:",
        options: ["₹2,95,000", "₹3,10,000", "₹3,25,000", "₹2,75,000"],
        answerIndex: 0,
        explanation: "2,60,000 + 40,000 − 15,000 + 20,000 − 10,000 = ₹2,95,000. The gain is deducted, not added; leaving it in would give ₹3,10,000 and adding it would give ₹3,25,000." },
      { id: 70303, chapter: "cf", difficulty: "Easy",
        q: "A company's cash and cash equivalents were ₹1,20,000 at the start of the year and ₹1,45,000 at the end. The cash flow statement will show:",
        options: ["A net increase in cash of ₹25,000", "A net decrease in cash of ₹25,000", "A net increase of ₹1,45,000", "No change — the movement is a balance sheet item"],
        answerIndex: 0,
        explanation: "1,45,000 − 1,20,000 = ₹25,000 increase, which is the figure the three activity sections must add up to." },
      { id: 70304, chapter: "cf", difficulty: "Hard",
        q: "Cash generated from operations ₹3,40,000; interest paid ₹25,000 (financing in this course); direct taxes paid ₹45,000. Net cash from operating activities is:",
        options: ["₹2,95,000", "₹2,70,000", "₹3,15,000", "₹3,40,000"],
        answerIndex: 0,
        explanation: "3,40,000 − 45,000 = ₹2,95,000 — only the direct taxes are deducted inside operating; taking the ₹25,000 interest also would wrongly give ₹2,70,000." },
      { id: 70305, chapter: "cf", difficulty: "Medium",
        q: "A firm's cash flow statement closes with a cash figure that does not agree with the movement in cash shown by its balance sheets. The correct conclusion is:",
        options: ["Something is wrong — an item has been omitted, duplicated or misclassified, and the statement must be corrected", "The balance sheet must be adjusted to agree with the cash flow statement", "Small differences are acceptable in practice", "The statement is right, because software produced it"],
        answerIndex: 0,
        explanation: "The closing cash tying to the balance sheet is the statement's own proof — any mismatch means the statement itself contains an error that must be found and fixed." },
      { id: 70306, chapter: "cf", difficulty: "Easy",
        q: "Which of these is an investing outflow?",
        options: ["Cash paid to buy a delivery vehicle", "Wages paid to factory workers", "Proceeds from a bank loan", "Interest received on investments"],
        answerIndex: 0,
        explanation: "Acquiring a long-term asset is an investing outflow; wages are operating, loan proceeds are financing and interest received is an investing inflow in this course." },
      { id: 70307, chapter: "cf", difficulty: "Medium",
        q: "Repayment of a long-term loan of ₹1,25,000 appears in the cash flow statement as:",
        options: ["A financing outflow of ₹1,25,000", "An operating deduction from profit", "An investing outflow — a repayment buys back a claim", "It is not shown, because the loan appeared at the time of raising"],
        answerIndex: 0,
        explanation: "Repaying a lender reverses the inflow recorded when the loan was raised — the ₹1,25,000 is a financing outflow." },
      { id: 70308, chapter: "cf", difficulty: "Hard",
        q: "Which of these sets classifies every item correctly (in this course)?",
        options: [
          "Purchase of machinery — investing; dividend paid — financing; depreciation — added back in operating; interest received — investing",
          "Purchase of machinery — operating; dividend paid — operating; depreciation — subtracted in operating; interest received — financing",
          "Purchase of machinery — financing; dividend paid — investing; depreciation — added back in operating; interest received — operating",
          "Purchase of machinery — investing; dividend paid — operating; depreciation — added back in operating; interest received — financing"
        ],
        answerIndex: 0,
        explanation: "Only the first set is right throughout: machinery purchase is investing, dividend paid is financing, depreciation is a non-cash charge added back inside operating, and interest received is investing." },
      { id: 70309, chapter: "cf", difficulty: "Medium",
        q: "A company received dividend of ₹15,000 and interest of ₹25,000 on its investments during the year. In this course, both together appear as:",
        options: ["An investing inflow of ₹40,000", "A financing inflow of ₹40,000", "An operating inflow of ₹40,000", "Two separate lines, one in operating and one in investing"],
        answerIndex: 0,
        explanation: "Both are returns on money invested, so 15,000 + 25,000 = ₹40,000 is shown as an inflow under investing activities." },
      { id: 70310, chapter: "cf", difficulty: "Hard",
        q: "Operating activities ₹2,10,000; machinery sold for ₹80,000; investments purchased for ₹1,50,000; shares issued for ₹4,00,000; dividend paid ₹30,000; interest paid ₹20,000. Opening cash ₹2,00,000. Closing cash and cash equivalents:",
        options: ["₹6,90,000", "₹5,90,000", "₹7,10,000", "₹4,90,000"],
        answerIndex: 0,
        explanation: "Investing = 80,000 − 1,50,000 = −70,000; financing = 4,00,000 − 30,000 − 20,000 = +3,50,000; net increase = 2,10,000 − 70,000 + 3,50,000 = ₹4,90,000; opening 2,00,000 + 4,90,000 = ₹6,90,000." },

      { id: 70311, chapter: "ca", difficulty: "Easy",
        q: "In a computerised accounting system, the rules of double entry:",
        options: ["Remain exactly as in manual books — the software only processes them faster", "Are replaced by single-entry processing", "Apply only to nominal accounts", "Are optional, because the software balances totals automatically"],
        answerIndex: 0,
        explanation: "A computerised cash book still follows double entry; what changes is speed, accuracy, storage and reporting — never the accounting logic." },
      { id: 70312, chapter: "ca", difficulty: "Medium",
        q: "Before a voucher can be posted, the account it charges must:",
        options: ["Already exist in the chart of accounts with a valid code", "Be a nominal account", "Have a zero opening balance", "Be approved by the software vendor"],
        answerIndex: 0,
        explanation: "A list check at entry matches the code against the master chart — a head that does not exist cannot be posted, because there is no ledger account to receive the entry." },
      { id: 70313, chapter: "ca", difficulty: "Easy",
        q: "In a spreadsheet, the function =AVERAGE(B2:B20) returns:",
        options: ["The arithmetic mean of the values in the range", "The total of the values in the range", "The number of entries in the range", "The largest value in the range"],
        answerIndex: 0,
        explanation: "AVERAGE divides the total by the count — SUM gives the total, COUNT the number of entries and MAX the largest value." },
      { id: 70314, chapter: "ca", difficulty: "Medium",
        q: "In the codified structure 4-02-03, the middle segment '02' identifies:",
        options: ["The sub-group under the main group, e.g. indirect expenditure", "The main group itself, e.g. expenditure", "The individual ledger account", "The voucher number"],
        answerIndex: 0,
        explanation: "4 is the main group, 4-02 the sub-group within it and 4-02-03 the account head — each added segment narrows the position in the hierarchy." },
      { id: 70315, chapter: "ca", difficulty: "Hard",
        q: "A loan of ₹2,00,000 at 10% per annum is repaid in equal annual instalments of ₹70,000. The interest charged in the SECOND year is:",
        options: ["₹15,000", "₹20,000", "₹17,500", "₹10,000"],
        answerIndex: 0,
        explanation: "Year 1: interest 20,000, principal 50,000, closing outstanding ₹1,50,000. Year 2 interest = 1,50,000 × 10% = ₹15,000 — on the reduced outstanding, not the original loan, which would wrongly repeat ₹20,000." },
      { id: 70316, chapter: "ca", difficulty: "Easy",
        q: "Which of these is a physical security measure?",
        options: ["An uninterruptible power supply for the server", "A password at login", "Per-user access rights", "The audit trail"],
        answerIndex: 0,
        explanation: "Physical measures protect the machines themselves — locks, restricted rooms, power protection — while passwords, access rights and audit trails are logical measures over the data." },
      { id: 70317, chapter: "ca", difficulty: "Medium",
        q: "The correct sequence of processing before a computerised firm's statements are drawn is:",
        options: ["Voucher entry → validation → posting to ledgers → trial balance → adjusting entries → statements", "Statements → trial balance → voucher entry → adjusting entries", "Adjusting entries → statements → voucher entry → trial balance", "Trial balance → voucher entry → posting → statements → adjusting entries"],
        answerIndex: 0,
        explanation: "Data is entered and validated once, posted to the ledger, summarised in the trial balance, corrected by the adjusting entries and only then turned into statements — the order manual books follow, executed by the machine." },
      { id: 70318, chapter: "ca", difficulty: "Hard",
        q: "Balance as per pass book ₹1,40,000; cheques issued ₹16,000 not yet presented; cheques deposited ₹11,000 not yet credited; bank charges of ₹1,000 not recorded in the cash book. Balance as per cash book:",
        options: ["₹1,36,000", "₹1,44,000", "₹1,35,000", "₹1,46,000"],
        answerIndex: 0,
        explanation: "1,40,000 − 16,000 + 11,000 + 1,000 = ₹1,36,000. Going from pass book to cash book reverses every reconciling sign, and the unbooked charges of ₹1,000 are added back because the bank has already paid them out." },
      { id: 70319, chapter: "ca", difficulty: "Easy",
        q: "Opening entries in a computerised system are passed to:",
        options: ["Carry the balances of real and personal accounts forward into the new year", "Close the year's nominal accounts into profit and loss", "Correct an error found in the trial balance", "Validate the first voucher of the new year"],
        answerIndex: 0,
        explanation: "After the closing entries, opening entries bring the asset and liability balances into the new year's books — the same purpose they serve by hand." },
      { id: 70320, chapter: "ca", difficulty: "Medium",
        q: "A loan repayment schedule built entirely from formulas rebuilds itself the moment the interest rate is changed because:",
        options: ["Every cell in the schedule depends on the input cells — the spreadsheet recalculates all of them live", "The software detects the change and re-enters the data", "The schedule is stored as text and re-parsed", "Interest rates never affect the totals"],
        answerIndex: 0,
        explanation: "That is live recalculation — the property that turns a grid of cells into an accounting instrument: change one assumption and every dependent figure, interest, principal and balance, updates at once." },
      { id: 70321, chapter: "ca", difficulty: "Easy",
        q: "A spreadsheet formula uses the reference $B$2. When the formula is copied to another cell, this reference:",
        options: ["Stays fixed at B2 — that is the point of the dollar signs", "Shifts to the matching relative cell", "Becomes a text label", "Is replaced by the value in B2"],
        answerIndex: 0,
        explanation: "An absolute reference never shifts on copy, which is exactly what you want for a rate, a total or a factor sitting in a single cell and serving many rows." },
      { id: 70322, chapter: "ca", difficulty: "Medium",
        q: "The main advantage of keeping a depreciation schedule in a spreadsheet rather than in a written register is:",
        options: ["Changing one cost or rate instantly updates every year's depreciation and every total", "The schedule cannot contain errors", "No depreciation rate needs to be entered", "The asset register replaces the ledger"],
        answerIndex: 0,
        explanation: "Because every figure is a formula over the input cells, a revised cost, rate or year flows through the whole schedule at once — the live-recalculation benefit, not an immunity from error." },
      { id: 70323, chapter: "ca", difficulty: "Hard",
        q: "A voucher of ₹7,500 was posted twice because of a loophole in validation. The best correction in a computerised system is to:",
        options: ["Pass a reversing entry for the duplicate ₹7,500 — the audit trail already shows who posted it and when", "Delete the entry from the ledger and erase the log", "Pass a reversing entry and also erase the audit trail", "Nothing — the trial balance still agrees"],
        answerIndex: 0,
        explanation: "Posted entries are corrected, never erased: the audit trail records the duplicate posting of ₹7,500, and a reversing entry cancels it while leaving the record of what happened intact. Erasing the trail destroys the very evidence that makes the books trustworthy." },
      { id: 70324, chapter: "ca", difficulty: "Medium",
        q: "Which of these is NOT a component of a computerised accounting system as studied?",
        options: ["The firm's statutory auditors", "Application software", "Telecom networks", "Procedures and instructions"],
        answerIndex: 0,
        explanation: "The components are users, procedures and instructions, data, application software, computer hardware, computer software and telecom networks — the auditors stand outside the system and review it." },
      { id: 70325, chapter: "ca", difficulty: "Hard",
        q: "In a spreadsheet ratio report, cost of goods sold is ₹7,20,000, opening inventory ₹1,50,000 and closing inventory ₹2,10,000. The inventory turnover ratio shows:",
        options: ["4 times", "4.8 times", "2 times", "3.4 times"],
        answerIndex: 0,
        explanation: "Average inventory = (1,50,000 + 2,10,000) ÷ 2 = ₹1,80,000; turnover = 7,20,000 ÷ 1,80,000 = 4 times. Using the opening stock alone would wrongly give 4.8 times and skipping the ÷ 2 would wrongly give 2 times." }
    ],

    /* ============ FLASHCARDS (ids 71237–71248) ============ */
    flashcards: [
      { id: 71237, chapter: "cf", front: "What counts as 'cash' in a cash flow statement?", back: "Cash in hand and demand deposits with banks — nothing else. Fixed deposits and other holdings must qualify as cash equivalents in their own right." },
      { id: 71238, chapter: "cf", front: "How is a profit on the sale of a fixed asset treated?", back: "Deduct it from operating cash flow — it sits inside profit but was earned through the investing section, where the full proceeds are reported." },
      { id: 71239, chapter: "cf", front: "How is a loss on the sale of a fixed asset treated?", back: "Add it back to operating cash flow — it reduced profit without moving cash; the cash effect is the proceeds, shown under investing." },
      { id: 71240, chapter: "cf", front: "Where are direct taxes paid shown?", back: "Inside the operating section, deducted after cash generated from operations, to reach net cash from operating activities." },
      { id: 71241, chapter: "cf", front: "'Cash generated from operations' vs 'net cash from operating activities'?", back: "The first is operating profit adjusted for non-cash items and working capital; the second is that figure less direct taxes paid. Interest paid follows the financing convention in this course." },
      { id: 71242, chapter: "cf", front: "Effect of an increase in prepaid expenses on operating cash flow?", back: "An outflow — prepayments are a current asset, and a rising current asset means cash paid ahead of the expense being incurred." },
      { id: 71243, chapter: "cf", front: "Where does repayment of a long-term loan go?", back: "Financing activities, as an outflow — it reverses the inflow recorded when the money was raised." },
      { id: 71244, chapter: "cf", front: "The closing check every cash flow statement must pass?", back: "Opening cash + net movement during the year = closing cash, and that figure must equal the movement in cash on the balance sheet." },
      { id: 71245, chapter: "cf", front: "Which transactions never enter the cash flow statement?", back: "Non-cash ones — depreciation, a bonus issue of shares, conversion of a loan into shares. Only movements of cash and cash equivalents are reported." },
      { id: 71246, chapter: "cf", front: "Proceeds from the issue of shares — which activity?", back: "Financing — raising resources from the owners. An inflow when the shares are issued for cash; a bonus issue brings no cash at all." },
      { id: 71247, chapter: "cf", front: "How can a profitable firm still run short of cash?", back: "Profit is accrual-based — it counts sales when invoiced. If receivables and inventory absorb the profit, no cash is left to pay the bills." },
      { id: 71248, chapter: "cf", front: "How do you read a negative operating cash flow?", back: "The core business is consuming cash. Unless it reverses, the firm must fund itself from asset disposals, borrowings or fresh capital — which cannot continue indefinitely." },

      { id: 71249, chapter: "ca", front: "What is live recalculation in a spreadsheet?", back: "When an input cell changes, every formula that depends on it updates instantly — the single property that turns a grid of cells into an accounting instrument." },
      { id: 71250, chapter: "ca", front: "Relative vs absolute references on copy?", back: "Relative (B2) shifts with the copy — it becomes B7 in row 7. Absolute ($B$2) stays fixed, which is what you want for a rate or total serving many rows." },
      { id: 71251, chapter: "ca", front: "Where does a bank charge not yet in the cash book go during reconciliation?", back: "It is deducted from the cash book balance to reach the pass book balance — and a correcting entry then records the charge in the books." },
      { id: 71252, chapter: "ca", front: "What is a chart of accounts?", back: "The complete list of the firm's account heads with their codes — the master every voucher is checked against at entry." },
      { id: 71253, chapter: "ca", front: "Which entries open a new year in a computerised system?", back: "Opening entries carry real and personal account balances forward; nominal accounts start the year afresh after the closing entries." },
      { id: 71254, chapter: "ca", front: "How does an audit trail differ from validation?", back: "Validation refuses bad data at the moment of entry; the audit trail records every change afterwards — who, what and when." },
      { id: 71255, chapter: "ca", front: "How does the asset register apply the WDV method?", back: "Each year's depreciation = opening written-down value × rate; closing WDV = opening WDV − depreciation. The base shrinks every year." },
      { id: 71256, chapter: "ca", front: "Why should a user's rights be limited by role?", back: "Access rights stop a data-entry user altering reports or deleting posted vouchers — logical security that limits both error and misuse." },
      { id: 71257, chapter: "ca", front: "What does a list check reject?", back: "A value that is not in the approved master — for example an account code that does not exist in the chart of accounts." },
      { id: 71258, chapter: "ca", front: "How is a loan's principal for the year found?", back: "Instalments less interest for the year — and per instalment: principal = instalment − interest on the opening outstanding." },
      { id: 71259, chapter: "ca", front: "What is a what-if analysis?", back: "Changing an assumption cell — rate, price, instalment — and reading the updated results, because the spreadsheet rebuilds every dependent figure." },
      { id: 71260, chapter: "ca", front: "Why can the trial balance agree although an entry is wrong?", back: "A wrong posting usually keeps one debit and one credit of equal amount, so totals agree while individual balances are wrong. Only verification catches it." }
    ],

    /* ============ IMPORTANT QUESTIONS (existing count: 7) ============ */
    importantQuestions: {
      cf: [
        { type: "Short Answer", marks: 3,
          q: "A company reports a net profit of ₹4,00,000 for the year, yet its cash balance has fallen by ₹60,000. State two possible reasons for this.",
          answer: "Profit is prepared on the accrual basis, so it recognises revenue when invoiced, not when collected. Two likely reasons: (i) trade receivables and inventories grew during the year — credit sales not yet collected and cash tied up in stock absorb exactly the kind of profit that produces no cash; (ii) the firm invested in long-term assets or repaid borrowings — large investing or financing outflows can swamp a positive operating cash flow. The cash flow statement exists precisely to reveal this gap between profit and cash." },
        { type: "Short Answer", marks: 3,
          q: "State how each of the following is treated in the indirect method of preparing a cash flow statement: (a) goodwill written off, (b) profit on the sale of investments, (c) an increase in accrued income.",
          answer: "(a) Goodwill written off is a non-cash charge that reduced profit — it is added back to operating cash flow. (b) The profit on the sale is deducted from operating cash flow, because the entire cash effect (the sale proceeds) is reported under investing activities; leaving the profit in operating would double count it. (c) Accrued income is a current asset, so an increase is an operating outflow — the income has been earned in profit but no cash has been received." },
        { type: "Short Answer", marks: 3,
          q: "What is meant by 'cash generated from operations'? How does it differ from 'net cash from operating activities'?",
          answer: "Cash generated from operations is reached by starting with net profit before tax, adding back non-cash charges such as depreciation and losses, removing non-cash gains, and applying the working capital direction rule to every current asset and current liability movement. Net cash from operating activities goes one step further: direct taxes paid are deducted from it (in this course, interest paid stays out entirely because it is shown under financing). The first figure measures what operations produced before the taxman; the second is the operating section's final total." },
        { type: "Long Answer", marks: 6,
          q: "From the following information prepare the three sections of the cash flow statement and find the net movement in cash: net profit before tax ₹3,60,000; depreciation ₹60,000; profit on the sale of machinery ₹30,000 (included in the profit above); trade receivables up ₹40,000; inventories up ₹25,000; trade payables up ₹15,000; direct taxes paid ₹60,000; machinery purchased ₹2,00,000; machinery sold for ₹1,10,000; shares issued for cash ₹3,00,000; interest paid ₹24,000; dividend paid ₹40,000 (interest and dividend paid are financing in this course).",
          answer: "Operating: 3,60,000 + 60,000 − 30,000 − 40,000 − 25,000 + 15,000 = ₹3,40,000 cash generated from operations; less direct taxes paid ₹60,000 = ₹2,80,000 net cash from operating activities. The profit on sale is removed because the ₹1,10,000 proceeds belong to investing. Investing: proceeds 1,10,000 − purchase 2,00,000 = −₹90,000. Financing: shares issued 3,00,000 − interest paid 24,000 − dividend paid 40,000 = +₹2,36,000. Net movement = 2,80,000 − 90,000 + 2,36,000 = ₹4,26,000 increase, which must equal the movement in cash and cash equivalents on the balance sheet." },
        { type: "Long Answer", marks: 6,
          q: "Explain where interest and dividend — paid and received — are shown in the cash flow statement in this course, and discuss why classification follows the nature of the underlying relationship rather than the head the amount passed through in the accounts.",
          answer: "In this course, interest paid and dividend paid are shown under financing activities, while interest received and dividend received are shown under investing activities. Interest paid is the price of borrowed capital and dividend paid the reward demanded by equity owners — both are transactions with the providers of finance, so they sit with the raising and repayment of capital. Interest received and dividend received are returns on money the firm has invested elsewhere — investments are long-term assets, so their returns belong to investing. The accounting head through which an amount passes (finance cost, other income, appropriation) reflects how it was recorded, not what caused the cash to move; classification must follow the cause. Whichever convention a question permits, the student must state it and apply it consistently — a mixed statement is the commonest source of lost marks." },
        { type: "Case-Based", marks: 6,
          q: "A firm reports net profit before tax of ₹2,75,000 for the year ended 31st March, 2027, after charging depreciation of ₹45,000 and after a loss of ₹10,000 on the sale of investments. Trade receivables fell by ₹30,000, inventories rose by ₹20,000 and trade payables rose by ₹25,000. Direct taxes paid were ₹35,000. Investments costing ₹80,000 were sold for ₹90,000; equipment was purchased for ₹1,75,000; a loan of ₹1,25,000 was repaid; interest paid was ₹15,000. (a) Compute cash flow from operating activities. (b) Compute cash flow from investing and financing activities. (c) Find the net movement in cash and comment on the quality of that movement.",
          answer: "(a) Operating: 2,75,000 + 45,000 + 10,000 + 30,000 − 20,000 + 25,000 = ₹3,65,000 cash generated from operations; less direct taxes paid ₹35,000 = ₹3,30,000 net cash from operating activities. (b) Investing: sale proceeds ₹90,000 − equipment purchased ₹1,75,000 = −₹85,000 (the ₹10,000 book loss was already removed from operating). Financing: loan repaid ₹1,25,000 + interest paid ₹15,000 = −₹1,40,000. (c) Net movement = 3,30,000 − 85,000 − 1,40,000 = ₹1,05,000 increase. The quality is sound: the core business comfortably funded the new equipment and the debt repayment, leaving cash higher at the year end." },
        { type: "Case-Based", marks: 4,
          q: "An extract of a company's cash flow statement for the year ended 31st March, 2027 reads: cash flow from operating activities ₹5,20,000; cash used in investing activities ₹6,00,000; cash flow from financing activities ₹(1,00,000); and cash and cash equivalents at the start of the year ₹3,00,000. (a) Find the net decrease in cash and cash equivalents. (b) Find the closing cash and cash equivalents. (c) Comment on what the pattern of the three sections tells a lender about the firm.",
          answer: "(a) 5,20,000 − 6,00,000 − 1,00,000 = −₹1,80,000, a net decrease in cash and cash equivalents. (b) Closing cash = 3,00,000 − 1,80,000 = ₹1,20,000, which must agree with the movement shown on the balance sheet. (c) Operations are generating healthy cash and the firm is investing well beyond that, part-repaying lenders at the same time — expansion largely self-funded, with the shortfall drawn from existing cash. A lender would read this as growth underpinned by a working core business, though the fall in the cash cushion warrants asking how long the expansion programme will continue." },
        { type: "Assertion-Reason", marks: 4,
          q: "Assertion (A): An increase in trade payables of ₹40,000 is added to operating profit in the indirect method. Reason (R): An increase in a current liability means the firm has postponed paying for its purchases, retaining cash that the profit statement has already charged as an expense. Choose the correct option: (a) both A and R are true and R is the correct explanation of A, (b) both A and R are true but R is not the correct explanation of A, (c) A is false but R is true, (d) A is true but R is false.",
          answer: "Option (a) is correct: both statements are true and R explains A. Rising trade payables mean purchases were made but not yet paid for, so cash that profit has already recognised as an expense stays in the business — that is exactly why the ₹40,000 is added back when profit is converted to operating cash flow. R gives the very reason the adjustment in A points the way it does." }
      ],

      ca: [
        { type: "Short Answer", marks: 3,
          q: "What is meant by a 'tailored' software package? State one advantage and one limitation of using one.",
          answer: "A tailored package is built or adapted for one particular organisation, matching its account heads, its reports and its controls exactly. Advantage: the closest possible fit — the firm buys only what it needs and no user fights a workflow designed for someone else. Limitation: it is the costliest of the three package types and ties the firm to its vendor for changes, upgrades and support, since no other organisation shares the cost of developing it." },
        { type: "Short Answer", marks: 3,
          q: "Distinguish between a relative and an absolute cell reference in a spreadsheet, giving an example of each.",
          answer: "A relative reference such as B2 shifts when the formula containing it is copied — placed in row 7 it becomes B7, so each row picks up its own figure; this is right for per-row calculations such as an instalment line. An absolute reference such as $B$2 never shifts — copied anywhere it still points at that one cell, which is what a constant such as an interest rate, a tax percentage or a grand total needs. The dollar signs lock the column and the row respectively." },
        { type: "Short Answer", marks: 3,
          q: "What is an asset register? Which details does a computerised asset register typically hold?",
          answer: "An asset register is the detailed record of the firm's fixed assets maintained in the system — the working paper behind the property, plant and equipment figure of the balance sheet. It typically holds each asset's description and code, cost and date of acquisition, the depreciation method and rate, the depreciation charged each year and the resulting written-down value, and the details of any disposal including sale proceeds and the profit or loss on it. Year-wise depreciation is computed in the register itself, often through a spreadsheet." },
        { type: "Long Answer", marks: 6,
          q: "The spreadsheet is said to do an accountant's work through four standard applications. Explain each application and illustrate it with a small computation: bank reconciliation, asset accounting, a loan repayment schedule and ratio analysis.",
          answer: "Bank reconciliation compares the cash book with the bank statement and isolates timing differences: e.g. cash book ₹90,000; cheques issued ₹14,000 not presented; cheque deposited ₹10,000 not yet credited; bank charges ₹2,000 not booked → 90,000 + 14,000 − 10,000 − 2,000 = pass book ₹92,000. Asset accounting maintains the register and computes depreciation: a ₹3,00,000 asset at 15% straight line charges ₹45,000 a year, leaving a WDV of ₹2,55,000. A loan repayment schedule splits each instalment: on ₹2,40,000 at 10% with an instalment of ₹80,000, interest is ₹24,000, principal ₹56,000 and the closing outstanding ₹1,84,000, which opens the next row. Ratio analysis turns statement cells into measures: current assets ₹6,40,000 and current liabilities ₹3,20,000 give a current ratio of 2:1. Each is a grid of formulas over a grid of data, so one changed input rebuilds the whole report." },
        { type: "Long Answer", marks: 6,
          q: "Describe the components of a computerised accounting system and explain why each is necessary for the system to function.",
          answer: "The components are: (i) Users — they enter data, run reports and take decisions; without them the system has no purpose. (ii) Procedures and instructions — the documented rules for entry, checks and report generation, so that processing is uniform whatever the operator. (iii) Data — the accounting information itself: transaction entries, master records of heads and parties, and balances. (iv) Application software — the package that performs the accounting: ledgers, trial balance, statements. (v) Computer hardware — the machines the software runs on. (vi) Computer software — the operating system and support programs beneath the application, managing the hardware for the application. (vii) Telecom networks — the channels that move data between locations, branches and users. Remove any one and the chain breaks: hardware without software is inert, software without data processes nothing, data without procedures is entered inconsistently, and users without access rights and networks cannot reach it." },
        { type: "Case-Based", marks: 6,
          q: "On 31st March, 2027 a firm's cash book showed ₹1,50,000. Cheques issued ₹20,000 had not been presented; cheques deposited ₹16,000 had not yet been credited; the bank had charged ₹3,000 as charges and ₹30,000 as a loan instalment under a standing instruction, neither recorded in the cash book; and it had credited ₹5,000 as interest, also unrecorded. (a) Compute the balance as per pass book. (b) Which items are pure timing differences and which are one-sided errors needing correcting entries? (c) Give the correcting entries for the one-sided items.",
          answer: "(a) Pass book = 1,50,000 + 20,000 − 16,000 − 3,000 − 30,000 + 5,000 = ₹1,26,000. (b) The unpresented cheques of ₹20,000 and uncredited deposits of ₹16,000 are pure timing differences — the bank will record them in its own time and no entry is needed in the books. The charges, the loan instalment and the interest are one-sided items: the bank has recorded them but the firm has not, so each needs a correcting entry in the cash book before the reconciliation statement is drawn. (c) Bank charges: Profit and Loss A/c Dr ₹3,000 to Cash A/c. Loan instalment: Loan A/c Dr ₹30,000 to Cash A/c (the interest element, if any, is charged as a financial cost). Interest credited: Cash A/c Dr ₹5,000 to Interest Received A/c. After these entries the cash book balance stands at 1,50,000 − 3,000 − 30,000 + 5,000 = ₹1,22,000, and the reconciliation explains the ₹4,000 gap to the pass book figure of ₹1,26,000 as the net of the two timing differences." },
        { type: "Case-Based", marks: 4,
          q: "A retail firm's chart of accounts is coded: 1 = Assets (1-01 Current assets; 1-01-01 Cash-in-hand; 1-01-02 Bank; 1-01-03 Trade receivables); 2 = Liabilities; 3 = Income (3-01-01 Revenue from operations); 4 = Expenditure (4-01 Direct expenditure; 4-02 Indirect expenditure; 4-02-01 Salaries; 4-02-02 Rent; 4-01-03 Carriage inward). (a) A receipt voucher debits 1-01-01 and credits 1-01-03 — which accounts are involved, and is the posting correct for a cash collection from a credit customer? (b) Which head receives a voucher recording salaries of ₹42,000 paid for the month? (c) A voucher is keyed with the code 4-02-09, which does not exist in the chart. What should the software do, and under which check?",
          answer: "(a) A debit to 1-01-01 posts to Cash-in-hand and a credit to 1-01-03 to Trade receivables — correct for a cash collection from a credit customer: cash rises and the customer's balance falls by the same amount. (b) Salaries go to 4-02-01, the account head for salaries under indirect expenditure — the voucher's account code, not its narration, decides where the entry posts. (c) The software must refuse the voucher at entry: 4-02-09 does not exist in the chart of accounts, so a list check rejects it before it can reach any ledger. Posting it to a nearest-looking head, or creating the head silently, would both destroy the integrity the codification exists to protect." },
        { type: "Assertion-Reason", marks: 4,
          q: "Assertion (A): A backup is not a measure that prevents loss of accounting data. Reason (R): A backup only restores data after loss or corruption has occurred; prevention requires physical and logical measures such as locks, passwords and access rights. Choose the correct option: (a) both A and R are true and R is the correct explanation of A, (b) both A and R are true but R is not the correct explanation of A, (c) A is false but R is true, (d) A is true but R is false.",
          answer: "Option (a) is correct: both statements are true and R explains A. A backup sits at the recovery layer — it changes nothing while the system is running and stops nothing from happening; it only limits how much is lost once something has. That is precisely why A calls it not a preventive measure, and R identifies where prevention actually lies: physical measures over the hardware and logical measures — passwords, per-user rights, the audit trail — over the data." }
      ]
    }
  });
})();
