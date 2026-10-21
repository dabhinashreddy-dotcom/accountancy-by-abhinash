/* ============================================================
   CLASS 12 — PART B (OPTION 2): COMPUTERISED ACCOUNTING
   (v83) — Chapter 13: Computerised Accounting (ca). Plain
   browser script; C12_DATA must exist. Original teaching
   material for the published CBSE Class 12 Accountancy
   curriculum (session 2026-27) — not copied from any textbook.
   ============================================================ */
(function () {
  "use strict";

  C12_DATA.register({

    content: {

      /* ---------- Chapter 13: Computerised Accounting ---------- */
      ca: {
        theory: {
          simple: [
            {
              h: "What Computerised Accounting Is",
              p: "Computerised accounting is the processing of accounting information with computers: data is entered once, validated at entry, and then every ledger, trial balance and statement is produced by the machine rather than rewritten by hand. The accounting logic does not change — a computerised cash book still follows double entry. What changes is speed, accuracy, storage and the ability to produce reports on demand.",
              list: [
                { term: "Speed", def: "Volumes of entries that would take days by hand are posted and summarized in seconds." },
                { term: "Accuracy", def: "The arithmetic is performed by the machine; errors now come from wrong data or wrong logic, not addition." },
                { term: "Storage and retrieval", def: "Years of books fit on one device and can be searched in moments." },
                { term: "Reliability and connectivity", def: "Consistent processing, with data flowing between modules — sales to ledger to statements — without re-entry." }
              ]
            },
            {
              h: "Software Packages — Generic, Specific, Tailored",
              p: "The software a firm runs decides what it can do. A generic package is built for a wide audience and a wide purpose — a spreadsheet or word processor can be taught to do accounting, but accounting is not its design centre. A specific package is built for accounting itself and suits most firms of a kind. A tailored package is built or adapted for one particular organisation, matching its account heads, its reports and its controls exactly — at the highest cost and the closest fit.",
              formula: "Generic (wide use) ⊂ Specific (accounting) ⊂ Tailored (this firm)"
            },
            {
              h: "The Electronic Spreadsheet",
              p: "An electronic spreadsheet is a grid of cells organised into rows and columns, where each cell holds a value, a label or a formula that recomputes automatically when its inputs change. That single property — live recalculation — is what makes it an accounting instrument: a depreciation schedule, a loan repayment table and a ratio report all rebuild themselves when one figure moves. Cell references can be relative (they shift as the formula is copied) or absolute (they stay fixed), and built-in functions carry the standard computations.",
              p2: "What-if analysis is the spreadsheet's quiet superpower: change one assumption cell and every dependent figure updates at once."
            }
          ],
          advanced: [
            {
              h: "Spreadsheets Doing an Accountant's Work",
              p: "Four applications cover most of what a small firm needs. Bank reconciliation compares the cash book with the bank statement and isolates the timing differences — cheques issued but not presented, cheques deposited but not credited, charges and interest the bank has taken or given. Asset accounting maintains the register and computes depreciation year by year. Loan repayment schedules split every instalment into interest and principal and carry the outstanding balance forward. Ratio analysis turns the statement figures into the standard measures — each of these is a grid of formulas over a grid of data.",
              formula: "Loan schedule: Interest = Opening outstanding × Rate · Principal = Instalment − Interest · Closing = Opening − Principal"
            },
            {
              h: "Codification and the Hierarchy of Account Heads",
              p: "Before entries can be posted, the accounts must exist — and exist in an order. Account heads are arranged in a hierarchy: main groups (assets, liabilities, income, expenditure), sub-groups within them (current assets, trade payables), account heads within sub-groups (cash-in-hand, trade receivables), and the individual ledger accounts within each head. Codification assigns a structured code to each level so that heads sort, group and report correctly: the code carries the position in the hierarchy, and the software uses it to build ledgers and statements automatically.",
              p2: "A well-built code structure is why one data entry can appear in a ledger, a trial balance and a balance sheet without anyone re-typing it."
            },
            {
              h: "Validation, Verification, Adjustment — and Security",
              p: "Data enters once, so it must be checked at entry: validation rules reject a month of 13, a negative quantity, an account code that does not exist. Verification then confirms what was posted — an audit trail records who changed what and when, so every figure can be traced back to its entry. Adjusting entries (preliminary, adjusting, closing and opening) are passed in the system exactly as by hand, and the statements are drawn from the adjusted ledger. Because all of this lives on machines, the system needs its own protection: physical measures (locks, uninterruptible power), logical measures (passwords, access rights per user), and backups — which are not prevention but recovery, the last line after everything else fails.",
              formula: "Validation (at entry) → Verification (audit trail) → Adjustment (entries) → Statements"
            }
          ]
        },

        concepts: [
          { title: "Computerised accounting system", body: "Processing accounting data with computers — same double-entry logic, delivered with speed, accuracy, storage and on-demand reporting." },
          { title: "Generic vs specific vs tailored software", body: "Generic: wide purpose (spreadsheet). Specific: built for accounting generally. Tailored: built for one organisation's heads, reports and controls." },
          { title: "Electronic spreadsheet", body: "A grid of cells with live formulas that recalculate automatically — relative and absolute references, built-in functions, what-if analysis." },
          { title: "Validation and audit trail", body: "Validation rules reject bad data at entry; the audit trail records who changed what and when, making every reported figure traceable." }
        ],

        formats: [
          {
            title: "Structure of a computerised accounting system",
            note: "Components that must work together — remove one and the system stops accounting.",
            head: ["Component", "What it does"],
            rows: [
              ["Users", "Enter data, run reports, take decisions — the reason the system exists"],
              ["Procedures and instructions", "The documented rules for data entry, checks and report generation"],
              ["Data", "The accounting information itself — transactions, masters, balances"],
              ["Application software", "The package that performs the accounting: ledgers, statements, reports"],
              ["Computer hardware", "The machines the software runs on"],
              ["Computer software", "The operating system and support programs beneath the application"],
              ["Telecom networks", "Channels that move data between locations and users"]
            ]
          },
          {
            title: "Codification hierarchy — a four-level code",
            note: "The code carries the position; the software uses it to group and report.",
            head: ["Level", "Example", "Code"],
            rows: [
              ["Main group", "Assets", "1"],
              ["Sub-group", "Current assets", "1-01"],
              ["Account head", "Cash-in-hand", "1-01-01"],
              ["Ledger account", "Cash a/c with opening balance", "1-01-01-001"],
              ["Main group", "Expenditure", "4"],
              ["Sub-group", "Indirect expenditure", "4-02"],
              ["Account head", "Salaries", "4-02-03"]
            ]
          }
        ],

        numericals: [
          {
            id: 1, difficulty: "Medium",
            question: "Cash book balance ₹50,000; cheques issued ₹8,000 not yet presented; interest credited by bank ₹2,000 not entered in the cash book. Balance as per pass book:",
            options: ["₹60,000", "₹40,000", "₹58,000", "₹62,000"],
            answerIndex: 0,
            explanation: "Both items make the pass book higher: 50,000 + 8,000 + 2,000 = ₹60,000."
          },
          {
            id: 2, difficulty: "Medium",
            question: "In a loan repayment schedule, opening outstanding is ₹1,00,000, interest for the year is ₹10,000 and the instalment is ₹40,000. Closing outstanding is:",
            options: ["₹70,000", "₹60,000", "₹90,000", "₹50,000"],
            answerIndex: 0,
            explanation: "Principal repaid = 40,000 − 10,000 = ₹30,000; closing = 1,00,000 − 30,000 = ₹70,000."
          },
          {
            id: 3, difficulty: "Easy",
            question: "An asset of ₹5,00,000 is depreciated at 10% p.a. on the straight line method for a full year. The closing WDV in the asset register is:",
            options: ["₹4,50,000", "₹50,000", "₹4,00,000", "₹5,50,000"],
            answerIndex: 0,
            explanation: "Depreciation ₹50,000; WDV = 5,00,000 − 50,000 = ₹4,50,000."
          },
          {
            id: 4, difficulty: "Easy",
            question: "Spreadsheet cells hold current assets ₹6,00,000 and current liabilities ₹3,00,000. The current ratio computed from them is:",
            options: ["2:1", "1:2", "3:1", "1:1"],
            answerIndex: 0,
            explanation: "6,00,000 ÷ 3,00,000 = 2:1 — a ratio analysis application of the spreadsheet."
          },
          {
            id: 5, difficulty: "Medium",
            question: "In the hierarchy Assets → Current assets → Cash-in-hand → Cash a/c, the item 'Cash-in-hand' is the:",
            options: ["Account head", "Main group", "Sub-group", "Ledger account"],
            answerIndex: 0,
            explanation: "Main group: Assets; sub-group: Current assets; account head: Cash-in-hand; the ledger account is the individual Cash a/c."
          },
          {
            id: 6, difficulty: "Easy",
            question: "Which of these is a data validation rule?",
            options: ["A month must be between 1 and 12", "An audit trail of changes", "A backup taken nightly", "A depreciation rate of 10%"],
            answerIndex: 0,
            explanation: "A range check at entry — invalid data is rejected before it enters the books."
          },
          {
            id: 7, difficulty: "Medium",
            question: "A package built to match one firm's account heads, reports and controls exactly is:",
            options: ["Tailored software", "Generic software", "A spreadsheet", "System software"],
            answerIndex: 0,
            explanation: "Tailored = built for that organisation alone; specific serves a class of firms; generic serves any purpose."
          },
          {
            id: 8, difficulty: "Easy",
            question: "An example of generic software is:",
            options: ["A spreadsheet package", "A readymade accounting package", "An operating system designed for one firm's ledger", "A depreciation module built for one company"],
            answerIndex: 0,
            explanation: "A spreadsheet serves any purpose for any user — accounting is one of many jobs it can be taught to do."
          },
          {
            id: 9, difficulty: "Medium",
            question: "Which security measure recovers the books after a hardware failure?",
            options: ["Backup of data", "A password on login", "Access rights per user", "An uninterruptible power supply"],
            answerIndex: 0,
            explanation: "Backups are recovery, not prevention — they restore the data when everything else has failed."
          },
          {
            id: 10, difficulty: "Easy",
            question: "Closing entries in a computerised system transfer the balances of:",
            options: ["Nominal accounts to the profit and loss account", "Real accounts to the balance sheet", "Personal accounts to the ledger", "All accounts to the trial balance"],
            answerIndex: 0,
            explanation: "Nominal accounts are closed into the trading and profit and loss account — exactly as by hand, performed by the software."
          }
        ],

        activity: {
          type: "classify",
          title: "Account Head Sorter",
          instruction: "Every account, code and spreadsheet job has one correct place. Sort each item into its home; the working appears when every set is placed correctly.",
          sets: [
            {
              title: "Set 1 — Which account group?",
              prompt: "Place each account head in its main group.",
              buckets: ["Asset", "Liability", "Income", "Expenditure"],
              items: [
                { label: "Cash-in-hand (1-01-01)", bucket: "Asset" },
                { label: "Trade payables (2-01-01)", bucket: "Liability" },
                { label: "Interest received (3-02-01)", bucket: "Income" },
                { label: "Salaries (4-02-03)", bucket: "Expenditure" },
                { label: "Trade receivables (1-01-03)", bucket: "Asset" },
                { label: "Trade payables control (2-01-02)", bucket: "Liability" },
                { label: "Discount received (3-02-02)", bucket: "Income" },
                { label: "Rent paid (4-02-01)", bucket: "Expenditure" }
              ],
              working: "The first digit of the code carries the main group: 1 = assets, 2 = liabilities, 3 = income, 4 = expenditure. That is why one entry can populate every report — the code knows where it belongs."
            },
            {
              title: "Set 2 — The codification hierarchy",
              prompt: "Place each item at its level in the hierarchy.",
              buckets: ["Main group", "Sub-group", "Account head", "Ledger account"],
              items: [
                { label: "Assets (code 1)", bucket: "Main group" },
                { label: "Current assets (code 1-01)", bucket: "Sub-group" },
                { label: "Cash-in-hand (code 1-01-01)", bucket: "Account head" },
                { label: "Cash a/c showing ₹12,000 on hand", bucket: "Ledger account" },
                { label: "Expenditure (code 4)", bucket: "Main group" },
                { label: "Indirect expenditure (code 4-02)", bucket: "Sub-group" },
                { label: "Salaries (code 4-02-03)", bucket: "Account head" },
                { label: "Salary paid to Ramesh — ₹18,000", bucket: "Ledger account" }
              ],
              working: "Group → sub-group → account head → ledger account. Each level adds a segment to the code; the software groups by segments when it builds ledgers and statements."
            },
            {
              title: "Set 3 — Which spreadsheet application?",
              prompt: "Place each spreadsheet job in the application that performs it.",
              buckets: ["Bank reconciliation", "Asset accounting", "Loan repayment schedule", "Ratio analysis"],
              items: [
                { label: "Comparing the cash book with the bank statement", bucket: "Bank reconciliation" },
                { label: "Outstanding cheques listed for reconciliation", bucket: "Bank reconciliation" },
                { label: "Computing year-wise depreciation in the asset register", bucket: "Asset accounting" },
                { label: "Written-down value carried forward each year", bucket: "Asset accounting" },
                { label: "Splitting each EMI into interest and principal", bucket: "Loan repayment schedule" },
                { label: "Outstanding loan balance carried to the next row", bucket: "Loan repayment schedule" },
                { label: "Current ratio computed from statement cells", bucket: "Ratio analysis" },
                { label: "Inventory turnover from COGS and average stock", bucket: "Ratio analysis" }
              ],
              working: "Four jobs, four grids of formulas: reconciliation isolates timing differences; the asset register tracks cost and WDV; the loan schedule amortises; ratio analysis interprets. All rebuild automatically when one input changes."
            }
          ]
        },

        examCases: [
          {
            id: 1,
            title: "Reconciling in a spreadsheet",
            passage: "On 31 March 2027 a firm's cash book showed ₹80,000. Cheques issued ₹12,000 had not yet been presented; a cheque received ₹9,000 had not yet been credited by the bank; bank charges of ₹1,000 did not appear in the cash book; and the bank had credited interest of ₹3,000 not recorded in the cash book.",
            difficulty: "Hard",
            subs: [
              {
                q: "Cheques issued but not presented — reconciling treatment:",
                options: ["Add ₹12,000 when arriving at the pass book balance", "Deduct ₹12,000", "No effect", "Add ₹12,000 to the cash book"],
                answerIndex: 0,
                reasoning: "The bank has not yet debited them, so the pass book balance is higher by ₹12,000."
              },
              {
                q: "Cheque received but not yet credited — reconciling treatment:",
                options: ["Deduct ₹9,000", "Add ₹9,000", "No effect", "Deduct ₹9,000 from the pass book only"],
                answerIndex: 0,
                reasoning: "The bank has not yet added it, so the pass book balance is lower by ₹9,000."
              },
              {
                q: "Balance as per pass book on 31 March 2027:",
                options: ["₹85,000", "₹94,000", "₹76,000", "₹80,000"],
                answerIndex: 0,
                reasoning: "80,000 + 12,000 − 9,000 − 1,000 + 3,000 = ₹85,000."
              },
              {
                q: "Bank charges of ₹1,000 not in the cash book — reconciling treatment:",
                options: ["Deduct ₹1,000 from the cash book balance", "Add ₹1,000", "No effect", "Deduct ₹1,000 from the pass book"],
                answerIndex: 0,
                reasoning: "The bank has already paid them out; the cash book must come down to agree — and a correcting entry is posted in the books."
              }
            ]
          }
        ],

        examNumericals: [
          {
            id: 1, q: "Loan schedule: opening outstanding ₹2,50,000; interest for the year at 12% p.a. ₹30,000; instalment ₹80,000. Closing outstanding (₹).",
            value: 200000,
            explanation: "Principal repaid = 80,000 − 30,000 = ₹50,000; closing = 2,50,000 − 50,000 = ₹2,00,000.",
            difficulty: "Medium"
          },
          {
            id: 2, q: "Cash book ₹40,000; cheques deposited ₹5,000 not yet credited; interest credited by bank ₹2,000 not in the cash book. Balance as per pass book (₹).",
            value: 37000,
            explanation: "40,000 − 5,000 + 2,000 = ₹37,000.",
            difficulty: "Medium"
          }
        ],

        quickRevision: {
          definition: "Computerised accounting processes accounting data with computers — same double-entry logic, delivered through software packages and electronic spreadsheets, protected by validation, audit trails and system security.",
          keyPoints: [
            "CAS features: speed, accuracy, storage, reliability, connectivity — the logic of accounting does not change.",
            "Packages: generic (wide purpose), specific (accounting), tailored (one organisation).",
            "Spreadsheet: live-recalculating grid; relative vs absolute references; what-if analysis.",
            "Applications: bank reconciliation, asset accounting, loan repayment schedules, ratio analysis.",
            "Hierarchy: main group → sub-group → account head → ledger; the code carries the position.",
            "Security: physical, logical (passwords, access rights), audit trail, and backups as recovery."
          ],
          calculationSteps: [
            "Bank reconciliation: start with the cash book balance; add cheques issued not presented and bank credits not booked; deduct cheques deposited not credited and bank debits not booked → pass book balance.",
            "Loan schedule: Interest = Opening outstanding × Rate; Principal = Instalment − Interest; Closing = Opening − Principal.",
            "Asset register: Depreciation = Cost × Rate (SLM) or WDV × Rate (WDV method); Closing WDV = Opening WDV − Depreciation.",
            "Validation before posting: range, list, format and cross-field checks reject bad data at entry; the audit trail verifies afterwards."
          ],
          formulas: [
            { label: "Pass book balance", expr: "Cash book + cheques issued not presented + bank credits not booked − cheques deposited not credited − bank debits not booked" },
            { label: "Loan schedule interest", expr: "Opening outstanding × Rate × months ÷ 12" },
            { label: "Principal repaid", expr: "Instalment − Interest" },
            { label: "Closing outstanding", expr: "Opening outstanding − Principal repaid" }
          ],
          distinctions: [
            {
              title: "Validation vs verification",
              head: ["Data validation", "Verification"],
              rows: [
                ["When", "At the moment of entry", "After entries are posted"],
                ["Method", "Range, list, format and cross-field checks", "Audit trail, trial balance, reconciliation"],
                ["Rejects", "Impossible data before it enters", "Locates what has already gone wrong"],
                ["Example", "A month outside 1–12 is refused", "Tracing a figure to who changed it and when"]
              ]
            }
          ],
          examPoints: [
            "In a reconciliation question, state the starting balance and the sign of each item — the working earns the marks.",
            "Name the level (main group, sub-group, account head, ledger) whenever a code appears in the question.",
            "Security answers should separate physical, logical and recovery measures — backup belongs to recovery."
          ],
          commonMistakes: [
            "Reversing a reconciliation sign — treating cheques issued but not presented as a deduction.",
            "Computing loan-schedule interest on the instalment instead of the opening outstanding.",
            "Calling backup a preventive security measure — it restores, it does not protect."
          ],
          mnemonic: "GST — Generic, Specific, Tailored: the three package types, widest to closest fit."
        }
      }
    },

    /* ================= MIND MAP ================= */
    mindmaps: {
      ca: {
        center: "Computerised\nAccounting",
        branches: [
          {
            label: "Overview of CAS",
            color: "var(--c-ca)",
            children: ["Same double-entry logic", "Speed, accuracy, storage", "Reliability, connectivity", "Reports on demand"]
          },
          {
            label: "Software Packages",
            color: "var(--c-eq)",
            children: ["Generic — any purpose", "Specific — built for accounting", "Tailored — built for one firm", "Fit vs cost trade-off"]
          },
          {
            label: "Electronic Spreadsheet",
            color: "var(--c-rat)",
            children: ["Grid of cells, live formulas", "Relative vs absolute references", "Built-in functions", "What-if analysis"]
          },
          {
            label: "Applications",
            color: "var(--c-cf)",
            children: ["Bank reconciliation", "Asset accounting & depreciation", "Loan repayment schedules", "Ratio analysis"]
          },
          {
            label: "Setup & Security",
            color: "var(--c-tbase)",
            children: ["Codification: group → sub-group → head → ledger", "Validation at entry, audit trail after", "Adjusting, closing & opening entries", "Physical, logical, backup"]
          }
        ]
      }
    },

    /* ================= IMPORTANT QUESTIONS ================= */
    importantQuestions: {
      ca: [
        { type: "Short Answer", marks: 3, q: "What is a computerised accounting system? State any three features.",
          answer: "A computerised accounting system processes accounting data with computers — data is entered once and validated, and ledgers, trial balances and statements are produced by the software on the same double-entry logic as manual books. Features: (i) speed — large volumes posted and summarised in seconds; (ii) accuracy — arithmetic performed by the machine; (iii) storage and retrieval — years of books on one device, searchable in moments; also reliability and connectivity between modules." },
        { type: "Short Answer", marks: 3, q: "Distinguish between generic, specific and tailored software packages with an example of each.",
          answer: "Generic software serves a wide purpose for any user — a spreadsheet package can be taught to do accounting. Specific software is designed for accounting and suits a class of firms — a readymade accounting package. Tailored software is built or adapted for one organisation alone, matching its account heads, reports and controls — the closest fit at the highest cost." },
        { type: "Long Answer", marks: 6, q: "What is an electronic spreadsheet? State its features and any four accounting applications.",
          answer: "An electronic spreadsheet is a grid of cells in rows and columns where each cell holds data or a formula that recalculates automatically when inputs change. Features: ease of learning and flexibility; relative and absolute cell references; built-in functions; data storage and manipulation; what-if analysis; graphic facilities. Applications: (i) bank reconciliation — isolating timing differences between cash book and bank statement; (ii) asset accounting — the asset register and year-wise depreciation; (iii) loan repayment schedules — splitting each instalment into interest and principal; (iv) ratio analysis — computing standard ratios from statement cells." },
        { type: "Short Answer", marks: 3, q: "What is codification of account heads? Explain the hierarchy it serves.",
          answer: "Codification assigns structured codes to account heads so the software can sort, group and report automatically. The hierarchy is: main group (assets, liabilities, income, expenditure) → sub-group (e.g. current assets) → account head (e.g. cash-in-hand) → individual ledger account. Each level adds a segment to the code — e.g. 1-01-01-001 — and the code's position determines where the entry appears in ledgers and statements." },
        { type: "Short Answer", marks: 3, q: "What is data validation? Give two examples of validation rules.",
          answer: "Data validation checks data at the moment of entry and rejects anything impossible before it enters the books. Examples: a range check (a month must be between 1 and 12); a list check (the account code must exist in the chart of accounts); a format check (a date must be a valid date). Validation prevents bad data; the audit trail verifies what was posted afterwards." },
        { type: "Long Answer", marks: 6, q: "Explain the need for system security and the measures used to achieve it.",
          answer: "All accounting records live on machines, so the system itself can be lost, altered or stolen — security protects continuity and integrity. Measures: (i) physical — locks, restricted access to hardware, uninterruptible power supply; (ii) logical — passwords, per-user access rights so a user can only do what their role permits, and an audit trail recording who changed what and when; (iii) recovery — regular backups of data, which restore the books after hardware failure or corruption. Backup is recovery, not prevention — the last line after physical and logical measures have failed." },
        { type: "Short Answer", marks: 3, q: "How does a loan repayment schedule work in a spreadsheet?",
          answer: "Each row is one period: interest = opening outstanding × rate; principal repaid = instalment − interest; closing outstanding = opening outstanding − principal, and the closing becomes the next row's opening. Because the rows are formulas, changing the loan amount, rate or instalment rebuilds the entire schedule instantly — one input change, every dependent figure updated." }
      ]
    },

    /* ================= QUIZ (ids 70121–70130) ================= */
    quiz: [
      { id: 70121, chapter: "ca", difficulty: "Easy",
        q: "Which is NOT a feature of computerised accounting?",
        options: ["Manual re-writing of every ledger", "Speed of processing", "Storage and retrieval", "Accuracy of arithmetic"],
        answerIndex: 0,
        explanation: "Nothing is re-written — data is entered once and every report derives from it." },
      { id: 70122, chapter: "ca", difficulty: "Easy",
        q: "A spreadsheet package used to maintain accounts is an example of:",
        options: ["Generic software", "Specific software", "Tailored software", "System software"],
        answerIndex: 0,
        explanation: "It serves any purpose for any user — accounting is one of many jobs it can be taught." },
      { id: 70123, chapter: "ca", difficulty: "Medium",
        q: "Software built for one firm's own account heads, reports and controls is:",
        options: ["Tailored", "Generic", "Specific", "Open source"],
        answerIndex: 0,
        explanation: "Tailored = one organisation only; specific serves a class of firms; generic serves any purpose." },
      { id: 70124, chapter: "ca", difficulty: "Easy",
        q: "In a spreadsheet, a cell reference that stays fixed when a formula is copied is:",
        options: ["An absolute reference", "A relative reference", "A function", "A label"],
        answerIndex: 0,
        explanation: "Absolute references (e.g. $A$1) do not shift on copy; relative ones (A1) do." },
      { id: 70125, chapter: "ca", difficulty: "Medium",
        q: "Comparing the cash book with the bank statement to isolate timing differences is:",
        options: ["Bank reconciliation", "Asset accounting", "Ratio analysis", "Closing entry preparation"],
        answerIndex: 0,
        explanation: "One of the four standard spreadsheet applications for accounting information." },
      { id: 70126, chapter: "ca", difficulty: "Medium",
        q: "In the code structure 1-01-01, if 1 = Assets and 01 = Current assets, then 01-01 denotes:",
        options: ["The account head, e.g. Cash-in-hand", "The ledger account", "The main group", "The trial balance"],
        answerIndex: 0,
        explanation: "Group 1, sub-group 1-01, account head 1-01-01; the individual ledger account adds another segment." },
      { id: 70127, chapter: "ca", difficulty: "Easy",
        q: "A rule refusing a transaction dated in month 13 is an example of:",
        options: ["Data validation", "Verification", "Depreciation", "Backup"],
        answerIndex: 0,
        explanation: "A range check at entry — impossible data never enters the books." },
      { id: 70128, chapter: "ca", difficulty: "Medium",
        q: "An audit trail in a computerised system records:",
        options: ["Who changed what and when", "The depreciation rate", "The bank reconciliation", "The backup schedule"],
        answerIndex: 0,
        explanation: "Every change is traceable to a user and a time — verification after the event." },
      { id: 70129, chapter: "ca", difficulty: "Easy",
        q: "Backups are best described as:",
        options: ["Recovery — restoring data after failure", "Prevention — stopping intrusion", "Validation at entry", "A depreciation method"],
        answerIndex: 0,
        explanation: "Backups do not prevent anything; they restore the books when everything else has failed." },
      { id: 70130, chapter: "ca", difficulty: "Medium",
        q: "Closing entries transfer the balances of:",
        options: ["Nominal accounts to the profit and loss account", "Real accounts to the balance sheet", "Personal accounts to the ledger", "All accounts to cash"],
        answerIndex: 0,
        explanation: "The same rule as manual books — performed by the software at year end." }
    ],

    /* ================= FLASHCARDS (ids 71097–71104) ================= */
    flashcards: [
      { id: 71097, chapter: "ca", front: "Computerised accounting in one line?", back: "Same double-entry logic, processed by computers — data entered once, validated, and every ledger and statement derived automatically." },
      { id: 71098, chapter: "ca", front: "Three package types, widest to closest fit?", back: "Generic (any purpose) → Specific (built for accounting) → Tailored (built for one organisation)." },
      { id: 71099, chapter: "ca", front: "Electronic spreadsheet — the core property?", back: "Live recalculation: formulas recompute when inputs change; relative vs absolute references; what-if analysis." },
      { id: 71100, chapter: "ca", front: "Four spreadsheet applications for accounting?", back: "Bank reconciliation, asset accounting (depreciation), loan repayment schedules, ratio analysis." },
      { id: 71101, chapter: "ca", front: "Codification hierarchy?", back: "Main group → sub-group → account head → ledger account; each level adds a code segment the software groups by." },
      { id: 71102, chapter: "ca", front: "Validation vs verification?", back: "Validation rejects bad data at entry (range, list, format checks); verification confirms what was posted (audit trail, trial balance)." },
      { id: 71103, chapter: "ca", front: "Loan schedule row formulas?", back: "Interest = opening × rate; principal = instalment − interest; closing = opening − principal; closing becomes the next opening." },
      { id: 71104, chapter: "ca", front: "Three security layers?", back: "Physical (locks, power), logical (passwords, access rights, audit trail), recovery (backups — restore, not prevent)." }
    ]
  });
})();
