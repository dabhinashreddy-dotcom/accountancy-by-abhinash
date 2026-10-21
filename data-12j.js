/* ============================================================
   CLASS 12 — EXPANSION J (v86): Debentures (deb) + Company FS (cfin)
   Additive unit — extends the chapters registered by data-12c.js.
   Content is original teaching material written for this project
   against the CBSE Class 12 Accountancy curriculum (2026-27).
   ============================================================ */
(function () {
  "use strict";

  C12_DATA.register({

    content: {
      deb: {

        /* ---- Practice Bank (merged with existing ids 1–10) ---- */
        numericals: [
          {
            id: 11, difficulty: "Easy",
            question: "A company issued 1,200 debentures of ₹100 each at ₹108. The total money received by the company is:",
            options: ["₹1,29,600", "₹1,20,000", "₹1,08,000", "₹9,600"],
            answerIndex: 0,
            explanation: "At a premium the company collects the issue price: 1,200 × 108 = ₹1,29,600, of which ₹1,20,000 is the face value of the debentures and ₹9,600 is the premium credited to Securities Premium Reserve."
          },
          {
            id: 12, difficulty: "Medium",
            question: "A loss on issue of ₹25,000 is to be written off and the Securities Premium Reserve holds ₹10,000. The correct entry is:",
            options: [
              "Securities Premium Reserve A/c Dr ₹10,000; Profit and Loss A/c Dr ₹15,000; To Loss on Issue of Debentures A/c ₹25,000",
              "Loss on Issue of Debentures A/c Dr ₹25,000; To Securities Premium Reserve A/c ₹25,000",
              "Profit and Loss A/c Dr ₹25,000; To Loss on Issue of Debentures A/c ₹25,000",
              "Securities Premium Reserve A/c Dr ₹15,000; Profit and Loss A/c Dr ₹10,000; To Loss on Issue of Debentures A/c ₹25,000"
            ],
            answerIndex: 0,
            explanation: "The reserve is used first, up to its balance — ₹10,000 — and the remainder of the ₹25,000 loss on issue, i.e. ₹15,000, is charged to the profit and loss account as a financial cost, extinguishing the ₹25,000 in full."
          },
          {
            id: 13, difficulty: "Hard",
            question: "A company had 6,000 debentures of ₹100 each outstanding for the whole year and issued 3,000 more on 1st October, 2025. Interest is 12% per annum and the accounting year ends on 31st March, 2026. Total debenture interest for the year is:",
            options: ["₹90,000", "₹1,08,000", "₹72,000", "₹99,000"],
            answerIndex: 0,
            explanation: "The original block earns for twelve months: 6,00,000 × 12% = ₹72,000. The new issue earns for six months only, from 1st October to 31st March: 3,00,000 × 12% × 6/12 = ₹18,000. Total ₹90,000 — running the new debentures for a full year would wrongly give ₹1,08,000."
          },
          {
            id: 14, difficulty: "Easy",
            question: "A bank is advanced a loan of ₹3,00,000 and debentures of ₹3,50,000 are handed to it as collateral security. The loan is repaid in full after two years. The company should then:",
            options: ["Cancel the debentures, because the liability they secured no longer exists", "Record the debentures as a liability of ₹3,50,000", "Pay ₹3,50,000 to the debenture holders", "Transfer ₹3,50,000 to Securities Premium Reserve"],
            answerIndex: 0,
            explanation: "Collateral debentures are never entered while the loan runs — they are only disclosed. Once the loan of ₹3,00,000 is repaid the security is no longer needed, so the ₹3,50,000 of debentures is cancelled and nothing is payable to anyone."
          },
          {
            id: 15, difficulty: "Easy",
            question: "On the winding up of a company, the order in which these two internal claimants are paid is:",
            options: ["Debenture holders are paid before shareholders receive anything", "Shareholders are paid before debenture holders", "Both are paid equally at the same time", "Debenture holders are paid only out of the shareholders' surplus"],
            answerIndex: 0,
            explanation: "Debenture holders are creditors and shareholders are owners: every creditor is settled first, so debenture holders are paid ahead of the shareholders, who receive only what remains after that."
          },
          {
            id: 16, difficulty: "Medium",
            question: "2,000 debentures of ₹100 each were issued at par and are redeemable at ₹105. The loss on issue is:",
            options: ["₹10,000", "₹5,000", "₹20,000", "Nil — no loss arises on a par issue"],
            answerIndex: 0,
            explanation: "There is no discount at issue, but the premium payable on redemption is a loss the moment the debentures are issued: 2,000 × (105 − 100) = ₹10,000, written off as a financial cost."
          },
          {
            id: 17, difficulty: "Easy",
            question: "Interest on bearer debentures is paid to:",
            options: ["Whoever presents the coupon at the payment date", "Only the person named in the company's register of debenture holders", "The trustee named in the debenture trust deed", "The company's auditors"],
            answerIndex: 0,
            explanation: "Bearer instruments move with delivery and their coupons travel with them — the company pays whoever surrenders the coupon, without knowing who owns the debentures."
          },
          {
            id: 18, difficulty: "Hard",
            question: "Debentures of ₹2,00,000 were issued at a discount of 5% and are redeemable at a premium of 10%. Of the total loss on issue, the portion representing the premium payable on redemption is:",
            options: ["₹20,000", "₹10,000", "₹30,000", "₹2,000"],
            answerIndex: 0,
            explanation: "Discount = 5% of 2,00,000 = ₹10,000 and premium on redemption = 10% of 2,00,000 = ₹20,000, so the total loss on issue is ₹30,000 — of which the premium payable at redemption is the ₹20,000 share."
          },
          {
            id: 19, difficulty: "Medium",
            question: "A company issued ₹3,00,000 of debentures on 1st July, 2025 carrying interest at 12% per annum. The accounting year ends on 31st March, 2026. Interest for the year is:",
            options: ["₹27,000", "₹36,000", "₹18,000", "₹9,000"],
            answerIndex: 0,
            explanation: "The debentures remained outstanding for nine months, from 1st July to 31st March: 3,00,000 × 12% × 9/12 = ₹27,000. Charging 12% for the whole year would wrongly give ₹36,000."
          },
          {
            id: 20, difficulty: "Easy",
            question: "Discount allowed on the issue of debentures is written off because:",
            options: ["It is a loss of the company and the law does not permit it to be carried as an asset", "It is an asset that grows in value over time", "It is an appropriation of profit", "It increases the amount payable to debenture holders at redemption"],
            answerIndex: 0,
            explanation: "The company received less than it must one day repay, so the shortfall — say ₹4 on every ₹100 debenture issued at ₹96 — is a loss recognised at issue and written off against securities premium reserve or the profit and loss account; it can never sit on the asset side."
          },
          {
            id: 21, difficulty: "Hard",
            question: "A company issued 5,000 debentures of ₹100 each at ₹95, redeemable at ₹105. The Securities Premium Reserve holds ₹20,000. The amount charged to the Statement of Profit and Loss on writing off the loss on issue is:",
            options: ["₹30,000", "₹50,000", "₹20,000", "₹25,000"],
            answerIndex: 0,
            explanation: "Discount 5,000 × 5 = ₹25,000 plus premium payable on redemption 5,000 × 5 = ₹25,000 gives a loss on issue of ₹50,000; the reserve absorbs ₹20,000 and the remaining ₹30,000 is charged to the profit and loss account as a financial cost."
          },
          {
            id: 22, difficulty: "Medium",
            question: "Interest on debentures has fallen due but remains unpaid on the balance sheet date. It is shown as:",
            options: ["A current liability — other financial liabilities — of the company", "An appropriation added to the debentures account", "A reserve of the company", "An asset, because it will be received later"],
            answerIndex: 0,
            explanation: "The company owes the holders, so unpaid interest is a payable shown under current liabilities as other financial liabilities — it is a charge already recognised in the Statement of Profit and Loss, payable even in a loss year."
          },
          {
            id: 23, difficulty: "Medium",
            question: "A charge created on the company's stock-in-trade, book debts and cash — assets that keep changing in form — is called a:",
            options: ["Floating charge, and debentures carrying it are secured debentures", "Fixed charge, because the assets belong to the company", "No charge at all, so the debentures are unsecured", "Contingent charge that never needs disclosure"],
            answerIndex: 0,
            explanation: "A fixed charge is on one identified asset; a charge on a class of assets that keeps changing — stock, debtors, cash — is a floating charge, and debentures carrying either charge are secured debentures."
          },
          {
            id: 24, difficulty: "Medium",
            question: "Interest for one half-year on 3,000 debentures of ₹100 each at 11% per annum is:",
            options: ["₹16,500", "₹33,000", "₹11,000", "₹8,250"],
            answerIndex: 0,
            explanation: "Principal = 3,000 × 100 = ₹3,00,000; interest for six months = 3,00,000 × 11% × 6/12 = ₹16,500. A full year's charge would be ₹33,000, which is the trap distractor here."
          },
          {
            id: 25, difficulty: "Hard",
            question: "A company issued 10,000 debentures of ₹100 each at ₹95 on 1st October, 2025, carrying interest at 12% per annum and redeemable at ₹105. For the accounting year ending 31st March, 2026 the interest charge and the total loss on issue are:",
            options: ["₹60,000 and ₹1,00,000", "₹1,20,000 and ₹1,00,000", "₹60,000 and ₹50,000", "₹1,00,000 and ₹60,000"],
            answerIndex: 0,
            explanation: "Interest for the six months from 1st October to 31st March = 10,00,000 × 12% × 6/12 = ₹60,000. Loss on issue = discount 10,000 × 5 = ₹50,000 plus premium payable on redemption 10,000 × 5 = ₹50,000 = ₹1,00,000 — both recognised at issue itself."
          }
        ],

        /* ---- Interactive bench (engine strings copied verbatim
               from data-12c.js; only the case list grows) ---- */
        activity: {
          type: "calc",
          title: "Debenture Issue & Interest Bench",
          instruction: "Work each problem exactly as the working note should appear in the exam. Every figure is checked before the bench reveals its own calculation.",
          problems: [
            {
              prompt: "3,000 debentures of ₹100 each were issued at ₹98 and are redeemable at ₹103. Find the discount on issue, the premium payable on redemption and the total loss on issue.",
              inputs: [
                { key: "disc", label: "Discount on issue (₹)", placeholder: "e.g. 6000" },
                { key: "prem", label: "Premium payable on redemption (₹)", placeholder: "e.g. 9000" },
                { key: "total", label: "Total loss on issue (₹)", placeholder: "e.g. 15000" }
              ],
              answers: { disc: 6000, prem: 9000, total: 15000 },
              formula: "Loss on issue = Discount on issue + Premium payable on redemption",
              working: "Discount = 3,000 × (100 − 98) = <b>₹6,000</b>; premium on redemption = 3,000 × (103 − 100) = <b>₹9,000</b>; together <b>₹15,000</b>, recognised at issue and written off — springs first, then the profit and loss account."
            },
            {
              prompt: "10% debentures of ₹2,50,000 were outstanding for the full year ended 31st March, 2026, and ₹1,50,000 more debentures were issued on 1st January, 2026. Find the interest payable for the year on the original debentures and on the new issue.",
              inputs: [
                { key: "old", label: "Interest on the original debentures (₹)", placeholder: "e.g. 25000" },
                { key: "neu", label: "Interest on the new issue (₹)", placeholder: "e.g. 5000" }
              ],
              answers: { old: 25000, neu: 5000 },
              formula: "Interest = Principal × Rate × Months ÷ 12",
              working: "Original block: 2,50,000 × 10% = <b>₹25,000</b> for the full year. New issue: 1,50,000 × 10% × 3/12 = <b>₹5,000</b> for the three months from 1st January to 31st March.",
              note: "Interest follows the period the money stayed with the company — count the months from the date of issue to the last day of the accounting year."
            },
            {
              prompt: "A company issued 2,000 debentures of ₹100 each at ₹96, redeemable at ₹102, carrying interest at 12% per annum. The Securities Premium Reserve holds ₹9,000. Find the cash received, the total loss on issue and the amount charged to the profit and loss account.",
              inputs: [
                { key: "proc", label: "Cash received (₹)", placeholder: "e.g. 192000" },
                { key: "loss", label: "Total loss on issue (₹)", placeholder: "e.g. 12000" },
                { key: "pl", label: "Charged to profit and loss (₹)", placeholder: "e.g. 3000" }
              ],
              answers: { proc: 192000, loss: 12000, pl: 3000 },
              formula: "Loss on issue = Discount + Premium on redemption; write off springs first",
              working: "Cash = 2,000 × 96 = <b>₹1,92,000</b>. Loss on issue = discount 2,000 × 4 = ₹8,000 + premium on redemption 2,000 × 2 = ₹4,000 = <b>₹12,000</b>; the springs absorbs ₹9,000, leaving <b>₹3,000</b> to the profit and loss account as a financial cost."
            }
          ]
        },

        /* ---- Exam cases (existing id is 1) ---- */
        examCases: [
          {
            id: 2,
            title: "The redemption-premium issue",
            passage: "A company issued 3,000 debentures of ₹100 each at ₹98 on 1st April, 2025, carrying interest at 15% per annum payable half-yearly on 30th September and 31st March. The debentures are redeemable at ₹105, and the Securities Premium Reserve of the company held ₹12,000 at the date of issue.",
            difficulty: "Hard",
            subs: [
              {
                q: "Cash received on the issue:",
                options: ["₹2,94,000", "₹3,00,000", "₹3,15,000", "₹6,000"],
                answerIndex: 0,
                reasoning: "3,000 × 98 = ₹2,94,000 — the company collects the issue price, not the face value of ₹3,00,000."
              },
              {
                q: "Total loss on issue recognised at the time of issue:",
                options: ["₹21,000", "₹15,000", "₹6,000", "₹9,000"],
                answerIndex: 0,
                reasoning: "Discount = 3,000 × 2 = ₹6,000 and premium payable on redemption = 3,000 × 5 = ₹15,000, so the loss on issue is ₹21,000."
              },
              {
                q: "Amount charged to the Statement of Profit and Loss on writing the loss off:",
                options: ["₹9,000", "₹21,000", "₹12,000", "₹6,000"],
                answerIndex: 0,
                reasoning: "The reserve is exhausted first: ₹21,000 − ₹12,000 = ₹9,000 is carried to finance costs, and the springs absorbs ₹12,000."
              },
              {
                q: "Interest payable on 30th September, 2025:",
                options: ["₹22,500", "₹45,000", "₹15,000", "₹11,250"],
                answerIndex: 0,
                reasoning: "Half-year's interest on the face value: 3,00,000 × 15% × 6/12 = ₹22,500 — interest always runs on the ₹3,00,000 principal, never on the ₹2,94,000 received."
              }
            ]
          },
          {
            id: 3,
            title: "Interest across a changing debt",
            passage: "A company had 5,000 debentures of ₹100 each outstanding on 1st April, 2025 carrying interest at 12% per annum. On 1st October, 2025 it issued 2,000 more debentures of ₹100 each at par, carrying interest at 10% per annum. Interest is paid on 31st March each year and the accounting year ends on that date.",
            difficulty: "Medium",
            subs: [
              {
                q: "Interest on the original debentures for the year:",
                options: ["₹60,000", "₹50,000", "₹72,000", "₹12,000"],
                answerIndex: 0,
                reasoning: "They stood with the company for the whole year: 5,00,000 × 12% = ₹60,000."
              },
              {
                q: "Interest on the new issue for the year:",
                options: ["₹10,000", "₹20,000", "₹12,000", "₹5,000"],
                answerIndex: 0,
                reasoning: "Outstanding only from 1st October to 31st March — six months: 2,00,000 × 10% × 6/12 = ₹10,000."
              },
              {
                q: "Total debenture interest charged for the year:",
                options: ["₹70,000", "₹80,000", "₹60,000", "₹72,000"],
                answerIndex: 0,
                reasoning: "₹60,000 + ₹10,000 = ₹70,000 — each block of debentures earns interest only for the time it was actually outstanding."
              },
              {
                q: "Total debenture debt outstanding after the new issue:",
                options: ["₹7,00,000", "₹5,00,000", "₹6,00,000", "₹2,00,000"],
                answerIndex: 0,
                reasoning: "5,00,000 + 2,00,000 = ₹7,00,000 of debenture debt, both classes shown as a liability of the company until redemption."
              }
            ]
          }
        ],

        /* ---- Short exam numericals (existing ids are 1–3) ---- */
        examNumericals: [
          {
            id: 4,
            q: "800 debentures of ₹100 each were issued at ₹96. Discount on issue (₹).",
            value: 3200,
            explanation: "800 × (100 − 96) = ₹3,200 — a loss on issue, written off as a financial cost.",
            difficulty: "Easy"
          },
          {
            id: 5,
            q: "Interest at 10% per annum for one quarter on debentures of ₹4,50,000 (₹).",
            value: 11250,
            explanation: "4,50,000 × 10% × 3/12 = ₹11,250 — the charge for the three months the debentures were outstanding.",
            difficulty: "Medium"
          },
          {
            id: 6,
            q: "Discount of ₹18,000 and premium payable on redemption of ₹27,000 on a debenture issue; the Securities Premium Reserve holds ₹10,000. Amount charged to the profit and loss account (₹).",
            value: 35000,
            explanation: "Loss on issue = 18,000 + 27,000 = ₹45,000; the springs absorbs ₹10,000 and the remaining ₹35,000 is charged as a financial cost.",
            difficulty: "Hard"
          }
        ]
      },

      /* ---------- Chapter 9: Financial Statements of a Company ---------- */
      cfin: {

        /* ---- Practice Bank (merged with existing ids 1–10) ---- */
        numericals: [
          {
            id: 11, difficulty: "Easy",
            question: "Under Schedule III, employees' salaries, wages and retirement benefits paid by a company appear in the Statement of Profit and Loss under:",
            options: ["Employee benefits expense", "Other expenses", "Finance costs", "An appropriation of profit"],
            answerIndex: 0,
            explanation: "Employee benefits expense is one of the four expense headings Schedule III prescribes — it collects everything paid to and for the employees, and carries its own note reference."
          },
          {
            id: 12, difficulty: "Medium",
            question: "Total income of a company is ₹18,60,000 and its total expenses are ₹15,45,000. Profit before tax is:",
            options: ["₹3,15,000", "₹3,45,000", "₹2,85,000", "₹34,05,000"],
            answerIndex: 0,
            explanation: "18,60,000 − 15,45,000 = ₹3,15,000. Every expense heading — employee benefits, finance costs, depreciation and other expenses — is deducted before tax; adding the two figures gives the ₹34,05,000 trap."
          },
          {
            id: 13, difficulty: "Medium",
            question: "A company earned a profit before tax of ₹7,20,000 and paid current tax of ₹1,80,000. Its profit for the year is:",
            options: ["₹5,40,000", "₹7,20,000", "₹1,80,000", "₹9,00,000"],
            answerIndex: 0,
            explanation: "Profit for the year = profit before tax ₹7,20,000 − current tax ₹1,80,000 = ₹5,40,000 — the figure from which transfers to reserve and the proposed dividend are then made."
          },
          {
            id: 14, difficulty: "Easy",
            question: "The heading under which a company shows the price it pays for the money it has borrowed is:",
            options: ["Finance costs", "Other income", "Employee benefits expense", "A reserve"],
            answerIndex: 0,
            explanation: "Interest on debentures, bank loans and other borrowings is the cost of finance — a charge against profit shown under finance costs, never an appropriation or a reserve."
          },
          {
            id: 15, difficulty: "Hard",
            question: "Equity and liabilities of a company: share capital ₹9,00,000; reserves and surplus ₹5,40,000; long-term borrowings ₹3,60,000; trade payables ₹2,40,000; other current liabilities ₹1,20,000; short-term provisions ₹60,000. The total of this side of the Balance Sheet is:",
            options: ["₹22,20,000", "₹21,60,000", "₹22,80,000", "₹20,40,000"],
            answerIndex: 0,
            explanation: "Added in the Schedule III order: shareholders' funds 9,00,000 + 5,40,000 = ₹14,40,000; non-current liabilities ₹3,60,000; current liabilities 2,40,000 + 1,20,000 + 60,000 = ₹4,20,000 — a total of ₹22,20,000, while ₹21,60,000 forgets the short-term provisions."
          },
          {
            id: 16, difficulty: "Easy",
            question: "Intangible assets such as patents and software used in the business are shown under:",
            options: ["Non-current assets", "Current assets", "Current liabilities", "Reserves and surplus"],
            answerIndex: 0,
            explanation: "They serve the business for years and are not held for sale or consumption within the operating cycle, so they belong to non-current assets — usually within intangible assets."
          },
          {
            id: 17, difficulty: "Medium",
            question: "Net profit after tax ₹7,40,000; transfer to general reserve ₹1,80,000; proposed dividend ₹2,20,000. The profit available for distribution is:",
            options: ["₹3,40,000", "₹5,20,000", "₹5,60,000", "₹7,40,000"],
            answerIndex: 0,
            explanation: "Appropriations are made only out of profit after tax: 7,40,000 − 1,80,000 − 2,20,000 = ₹3,40,000 is what the company may actually distribute, while ₹5,20,000 forgets the proposed dividend."
          },
          {
            id: 18, difficulty: "Medium",
            question: "A company's accountant added other income to revenue from operations and reported the whole amount under revenue from operations. The result is:",
            options: ["Revenue from operations is overstated, although profit before tax is unaffected", "Profit before tax is overstated by the amount of other income", "Other income is lost from the accounts", "Both revenue and profit rise by the amount of other income"],
            answerIndex: 0,
            explanation: "Both streams were already inside total income, so the profit of the year is still right — the damage is presentational: revenue from operations looks larger than the main business really earned, hiding the quality of the profit."
          },
          {
            id: 19, difficulty: "Hard",
            question: "From these figures find the profit for the year: revenue from operations ₹32,00,000; other income ₹1,50,000; employee benefits ₹14,00,000; other expenses ₹7,00,000; depreciation ₹2,50,000; finance costs ₹2,00,000; current tax ₹2,00,000.",
            options: ["₹6,00,000", "₹8,00,000", "₹33,50,000", "₹4,00,000"],
            answerIndex: 0,
            explanation: "Total income = 32,00,000 + 1,50,000 = ₹33,50,000; total expenses = 14,00,000 + 7,00,000 + 2,50,000 + 2,00,000 = ₹25,50,000, so profit before tax = ₹8,00,000; less current tax ₹2,00,000 gives profit for the year of ₹6,00,000."
          },
          {
            id: 20, difficulty: "Easy",
            question: "Trade payables of a company are:",
            options: ["Amounts the company owes its suppliers for goods or services received", "Amounts customers owe the company for goods sold", "A part of the company's share capital", "An asset the company expects to receive in cash"],
            answerIndex: 0,
            explanation: "Trade payables sit under current liabilities — they are obligations to suppliers; the money owed by customers is trade receivables, a current asset on the other side of the Balance Sheet."
          },
          {
            id: 21, difficulty: "Medium",
            question: "A note to the accounts of a company discloses a lawsuit of ₹3,00,000 pending against it. This is:",
            options: ["A contingent liability — disclosed in the notes, not added to the balance sheet total", "Added to trade payables within current liabilities", "Shown as a loss in the Statement of Profit and Loss", "Ignored until the court gives its verdict"],
            answerIndex: 0,
            explanation: "The obligation depends on a future event — the court's decision — so it is contingent: the company discloses the ₹3,00,000 in the notes so a reader knows the risk, and records nothing until the outcome is probable and measurable."
          },
          {
            id: 22, difficulty: "Hard",
            question: "A company's revenue from operations rose from ₹25,00,000 to ₹30,00,000 in a year while its trade receivables rose from ₹4,00,000 to ₹9,00,000. The most reasonable reading of these two movements is:",
            options: ["Sales grew, but collections slowed — the company's money is now tied up with customers", "Sales and collections improved together", "The company's cash balance must have risen sharply", "The company has cut its credit sales"],
            answerIndex: 0,
            explanation: "Revenue rose by ₹5,00,000, i.e. by 20%, while receivables rose by the same ₹5,00,000 on a base of only ₹4,00,000 — a 120% jump. When receivables outrun revenue like this, more of the profit is sitting with customers, which pressures cash and puts the realisability of the profit in doubt."
          },
          {
            id: 23, difficulty: "Medium",
            question: "Which pair of items belongs to the SAME major head under Schedule III?",
            options: ["Trade payables and short-term provisions — both current liabilities", "Trade receivables and trade payables — both current liabilities", "Share capital and long-term borrowings — both shareholders' funds", "Inventories and trade payables — both current assets"],
            answerIndex: 0,
            explanation: "Trade payables and short-term provisions both sit inside current liabilities. A trade receivable is an asset, a long-term borrowing is a non-current liability and inventories are current assets — each of the other pairs straddles the two sides of the Balance Sheet."
          },
          {
            id: 24, difficulty: "Easy",
            question: "Which of these is an 'other expense' of the year?",
            options: ["Carriage outward on goods sold by the company", "Sale of finished goods to customers", "Interest credited on the company's fixed deposit", "Profit on the sale of an old machine"],
            answerIndex: 0,
            explanation: "Carriage outward is incurred in earning the year's profit and is neither employee benefits, finance costs nor depreciation, so it lands in other expenses; the sale of goods is revenue from operations, while the deposit interest and the machine's profit are other income."
          },
          {
            id: 25, difficulty: "Hard",
            question: "A company's profit before tax is ₹12,00,000 and its current tax is ₹3,00,000. During the year it transferred ₹2,00,000 to general reserve and proposed a dividend of ₹2,50,000. The profit available for distribution is:",
            options: ["₹4,50,000", "₹7,50,000", "₹9,00,000", "₹12,00,000"],
            answerIndex: 0,
            explanation: "After current tax the company holds ₹12,00,000 − 3,00,000 = ₹9,00,000; the reserve transfer of ₹2,00,000 and the proposed dividend of ₹2,50,000 are appropriations of that profit, leaving ₹4,50,000 available for distribution."
          }
        ],

        /* ---- Interactive sorter (engine strings copied verbatim
               from data-12c.js; only the case list grows) ---- */
        activity: {
          type: "classify",
          title: "Schedule III Sorter",
          instruction: "Every figure in a company's accounts belongs to a family. Sort each item into its correct Schedule III home — the working appears when every set is placed correctly.",
          sets: [
            {
              title: "Set 4 — Which expense head does each item belong to?",
              prompt: "Sort each item into its Statement of Profit and Loss expense head.",
              buckets: ["Employee benefits expense", "Finance costs", "Depreciation and amortisation", "Other expenses"],
              items: [
                { label: "Salaries and wages ₹6,00,000", bucket: "Employee benefits expense" },
                { label: "Interest on debentures ₹1,80,000", bucket: "Finance costs" },
                { label: "Rent of the godown ₹28,000", bucket: "Other expenses" },
                { label: "Depreciation on machinery ₹1,20,000", bucket: "Depreciation and amortisation" },
                { label: "Legal and professional charges ₹18,000", bucket: "Other expenses" },
                { label: "Contribution to provident fund ₹72,000", bucket: "Employee benefits expense" },
                { label: "Interest on a bank loan ₹24,000", bucket: "Finance costs" }
              ],
              working: "Employee benefits covers everything paid to and for employees; finance costs are the price of borrowed money; depreciation and amortisation keeps its own head; everything else spent in earning the profit — rent, legal charges, repairs — lands in other expenses."
            },
            {
              title: "Set 5 — Current or non-current?",
              prompt: "Place each item in its correct Schedule III column.",
              buckets: ["Non-current liability", "Current liability", "Non-current asset", "Current asset"],
              items: [
                { label: "9% debentures repayable after four years — ₹3,00,000", bucket: "Non-current liability" },
                { label: "Bank overdraft ₹40,000", bucket: "Current liability" },
                { label: "Prepaid insurance ₹12,000", bucket: "Current asset" },
                { label: "A patent held for long-term use ₹90,000", bucket: "Non-current asset" },
                { label: "Trade payables ₹1,50,000", bucket: "Current liability" },
                { label: "Closing inventory ₹2,20,000", bucket: "Current asset" },
                { label: "Furniture used in the office ₹60,000", bucket: "Non-current asset" },
                { label: "Provision for tax ₹35,000", bucket: "Current liability" }
              ],
              working: "Liabilities and assets due or realisable within the operating cycle are current; everything with a longer life is non-current. The debentures run four years and the patent and furniture serve for years — all non-current — while the overdraft, payables, tax provision, inventory and prepaid insurance turn over within the year."
            },
            {
              title: "Set 6 — Face of the statement or notes?",
              prompt: "Each item belongs either on the face of the statements or in the notes that support them.",
              buckets: ["Face of the statement", "Notes to accounts"],
              items: [
                { label: "Revenue from operations ₹15,00,000", bucket: "Face of the statement" },
                { label: "Accounting policy — depreciation charged on the straight-line basis", bucket: "Notes to accounts" },
                { label: "Contingent liability of ₹2,00,000 on a pending lawsuit", bucket: "Notes to accounts" },
                { label: "Trade receivables ₹2,10,000", bucket: "Face of the statement" },
                { label: "Split of reserves — general reserve ₹1,20,000 and securities premium ₹60,000", bucket: "Notes to accounts" },
                { label: "Profit before tax ₹4,00,000", bucket: "Face of the statement" }
              ],
              working: "The face carries what a reader needs at a glance — revenue, receivables, profit before tax. The notes carry the detail and the judgement: accounting policies, splits of face figures, and contingent liabilities that are disclosed but never added to the totals."
            },
            {
              title: "Set 7 — Income, expense or appropriation?",
              prompt: "Decide how each item is treated in the company's accounts for the year.",
              buckets: ["Income", "Expense of the business", "Appropriation of profit"],
              items: [
                { label: "Revenue from operations ₹30,00,000", bucket: "Income" },
                { label: "Other income — interest on investments ₹45,000", bucket: "Income" },
                { label: "Depreciation and amortisation ₹1,80,000", bucket: "Expense of the business" },
                { label: "Employee benefits expense ₹11,00,000", bucket: "Expense of the business" },
                { label: "Transfer to general reserve ₹1,50,000", bucket: "Appropriation of profit" },
                { label: "Proposed dividend ₹2,00,000", bucket: "Appropriation of profit" }
              ],
              working: "Inflows form the profit; expenses are taken out of it before tax; appropriations divide what remains AFTER tax. Total income 30,00,000 + 45,000, less expenses 11,00,000 + 1,80,000, gives profit before tax — and only the residue left after tax can be transferred to reserves or paid as dividend."
            },
            {
              title: "Set 8 — Which sub-head inside the current families?",
              prompt: "Every item here is current — pick its exact sub-head.",
              buckets: ["Trade payables", "Other current liabilities", "Short-term provisions", "Inventories", "Trade receivables", "Cash and bank balances", "Short-term advances"],
              items: [
                { label: "Sundry creditors ₹1,80,000", bucket: "Trade payables" },
                { label: "Bills payable ₹90,000", bucket: "Trade payables" },
                { label: "Interest accrued but not due on borrowings ₹15,000", bucket: "Other current liabilities" },
                { label: "Provision for tax ₹45,000", bucket: "Short-term provisions" },
                { label: "Raw material and work-in-progress ₹2,40,000", bucket: "Inventories" },
                { label: "Amounts due from customers ₹2,70,000", bucket: "Trade receivables" },
                { label: "Balance with scheduled banks ₹1,35,000", bucket: "Cash and bank balances" },
                { label: "Advance to a supplier ₹30,000", bucket: "Short-term advances" }
              ],
              working: "Current liabilities split into trade payables (creditors and bills payable), other current liabilities and short-term provisions; current assets into inventories, trade receivables, cash and bank balances and short-term advances. Naming the sub-head exactly is what earns the mark in a preparation question."
            }
          ]
        },

        /* ---- Exam cases (existing id is 1) ---- */
        examCases: [
          {
            id: 2,
            title: "Reading a Balance Sheet extract",
            passage: "A company's Balance Sheet as at 31st March, 2026 shows equity and liabilities — share capital ₹6,00,000, reserves and surplus ₹3,60,000, long-term borrowings ₹2,40,000, trade payables ₹1,80,000, other current liabilities ₹60,000 and short-term provisions ₹60,000; and assets — property, plant and equipment ₹4,80,000, intangible assets ₹1,20,000, inventories ₹3,60,000, trade receivables ₹3,00,000, cash and bank balances ₹1,80,000 and short-term advances ₹60,000.",
            difficulty: "Hard",
            subs: [
              {
                q: "Total shareholders' funds:",
                options: ["₹9,60,000", "₹6,00,000", "₹12,00,000", "₹15,00,000"],
                answerIndex: 0,
                reasoning: "Share capital ₹6,00,000 + reserves and surplus ₹3,60,000 = ₹9,60,000 — the owners' stake, the first family of equity and liabilities."
              },
              {
                q: "Total current liabilities:",
                options: ["₹3,00,000", "₹2,40,000", "₹2,10,000", "₹3,60,000"],
                answerIndex: 0,
                reasoning: "Trade payables 1,80,000 + other current liabilities 60,000 + short-term provisions 60,000 = ₹3,00,000; the ₹2,40,000 borrowings are non-current and stay out of it."
              },
              {
                q: "Total non-current assets:",
                options: ["₹6,00,000", "₹4,80,000", "₹1,20,000", "₹7,20,000"],
                answerIndex: 0,
                reasoning: "Property, plant and equipment ₹4,80,000 + intangible assets ₹1,20,000 = ₹6,00,000, the assets held for long-term use."
              },
              {
                q: "Total of the Balance Sheet (each side):",
                options: ["₹15,00,000", "₹12,00,000", "₹14,40,000", "₹15,60,000"],
                answerIndex: 0,
                reasoning: "Equity and liabilities 9,60,000 + 2,40,000 + 3,00,000 = ₹15,00,000; assets 6,00,000 + (3,60,000 + 3,00,000 + 1,80,000 + 60,000 = 9,00,000) = ₹15,00,000 — the two sides agree, as the balance sheet must."
              }
            ]
          },
          {
            id: 3,
            title: "What the notes carry",
            passage: "A reader opens the accounts of a company for the year ended 31st March, 2026. On the face of the Balance Sheet she finds Trade receivables of ₹6,60,000, and on the face of the Statement of Profit and Loss revenue from operations of ₹28,5,000 under its own heading and other income of ₹95,000 under another. Note 12 explains that customers owe ₹7,20,000 for goods sold, less expected credit losses of ₹60,000, which is exactly the ₹6,60,000 carried on the face; note 9 discloses a contingent liability of ₹1,75,000 on a copyright suit.",
            difficulty: "Medium",
            subs: [
              {
                q: "Trade receivables shown on the face of the Balance Sheet are:",
                options: ["₹6,60,000 — ₹7,20,000 owed by customers less ₹60,000 expected credit losses", "₹7,20,000 — the full amount the customers owe", "₹7,80,000 — the amount owed plus the expected credit losses", "₹60,000 — only the amount expected to be lost"],
                answerIndex: 0,
                reasoning: "7,20,000 − 60,000 = ₹6,60,000 — note 12 shows the gross ₹7,20,000 and the ₹60,000 the firm does not expect to collect, and the face carries only the net ₹6,60,000 the receivables are worth to it."
              },
              {
                q: "The expected credit losses of ₹60,000 tell a reader that:",
                options: ["Part of the ₹7,20,000 may never be collected, so the balance sheet reports what the firm really expects to receive", "The company has already collected ₹60,000 in cash", "Trade payables of the company rise by ₹60,000", "The customers' debt has been written off in full"],
                answerIndex: 0,
                reasoning: "Expected credit losses are the firm's own estimate of ₹60,000 that will go uncollected out of the ₹7,20,000 owed, so the asset is carried at what it expects to realise. No cash has moved, the payables of the company are unaffected, and a write-off of the whole debt would be a far larger step."
              },
              {
                q: "The two inflows appear under separate headings because:",
                options: ["₹28,50,000 arose from the company's main business while ₹95,000 arose outside it, and the prescribed format keeps the two apart", "Revenue from operations is never taxed while other income is taxed twice", "The larger figure must always be shown above the smaller one by law", "Schedule III forbids combining any two figures even inside a note"],
                answerIndex: 0,
                reasoning: "Revenue from operations of ₹28,50,000 comes from the firm's principal business, while the ₹95,000 of other income arises outside it; kept apart, a reader can see how much of the profit the business itself earned. Both inflows are taxed alike, no law fixes their order, and combining figures is restricted on the face, not inside notes."
              },
              {
                q: "The face of the Balance Sheet shows one figure — Trade receivables ₹6,60,000 — because:",
                options: ["The prescribed face shows only the total of the line, while the note carries the split and the policy behind it", "Trade receivables need no disclosure at all", "The split belongs on the assets side of the Statement of Profit and Loss instead", "Debtors are not assets of the company"],
                answerIndex: 0,
                reasoning: "Schedule III keeps the face readable with a single total per line — Trade receivables ₹6,60,000 — and the composition of that total, along with the accounting policy behind it, is disclosed in the notes, which are read together with the face rather than in place of it."
              }
            ]
          }
        ],

        /* ---- Short exam numericals (existing id is 1) ---- */
        examNumericals: [
          {
            id: 2,
            q: "Employee benefits expenses ₹11,50,000, other expenses ₹4,30,000, depreciation and amortisation ₹1,70,000 and finance costs ₹90,000. Total expenses of the year (₹).",
            value: 1840000,
            explanation: "Schedule III collects every expense of the year under these four heads: 11,50,000 + 4,30,000 + 1,70,000 + 90,000 = ₹18,40,000, the figure deducted from total income to reach profit before tax.",
            difficulty: "Easy"
          },
          {
            id: 3,
            q: "Net profit after tax ₹3,60,000; transfer to reserves ₹90,000; proposed dividend ₹1,50,000. Divisible profit (₹).",
            value: 120000,
            explanation: "3,60,000 − 90,000 − 1,50,000 = ₹1,20,000 — appropriations are made only out of profit after tax.",
            difficulty: "Medium"
          },
          {
            id: 4,
            q: "Share capital ₹4,00,000, reserves and surplus ₹2,60,000, long-term borrowings ₹1,20,000, trade payables ₹90,000, other current liabilities ₹50,000, short-term provisions ₹30,000. Total equity and liabilities (₹).",
            value: 950000,
            explanation: "4,00,000 + 2,60,000 + 1,20,000 + 90,000 + 50,000 + 30,000 = ₹9,50,000, added in the Schedule III order — shareholders' funds, then non-current, then current liabilities.",
            difficulty: "Medium"
          }
        ]
      }
    },

    /* ============ QUIZ (ids 70236–70265) ============ */
    quiz: [
      { id: 70236, chapter: "deb", difficulty: "Easy",
        q: "A charge created on the company's stock-in-trade, book debts and cash — assets that change in form from day to day — is:",
        options: ["A floating charge, and debentures carrying it are secured debentures", "A fixed charge, because the assets are identified", "No charge at all, so the debentures are unsecured", "A contingent charge that never needs disclosure"],
        answerIndex: 0,
        explanation: "A fixed charge attaches to one identified asset; a floating charge rides on a class of assets that keeps changing — stock, debtors, cash — and debentures carrying either charge are secured debentures." },
      { id: 70237, chapter: "deb", difficulty: "Medium",
        q: "When the money received on debenture application is transferred on allotment, the entry is:",
        options: ["Debenture Application A/c Dr to Debentures A/c", "Bank A/c Dr to Debentures A/c", "Debentures A/c Dr to Debenture Application A/c", "Debenture Application A/c Dr to Bank A/c"],
        answerIndex: 0,
        explanation: "The money already received sits in Debenture Application A/c; on allotment that account is debited and Debentures A/c is credited with the face value, closing the application stage of the issue." },
      { id: 70238, chapter: "deb", difficulty: "Medium",
        q: "Premium received on issuing 1,500 debentures of ₹100 each at ₹102 is:",
        options: ["₹3,000", "₹1,53,000", "₹1,50,000", "₹1,500"],
        answerIndex: 0,
        explanation: "1,500 × (102 − 100) = ₹3,000, credited to Securities Premium Reserve; the company collects ₹1,53,000 in all, of which ₹1,50,000 is the face value of the debentures." },
      { id: 70239, chapter: "deb", difficulty: "Medium",
        q: "One half-year's interest on debentures of ₹2,50,000 at 14% per annum is:",
        options: ["₹17,500", "₹35,000", "₹14,000", "₹8,750"],
        answerIndex: 0,
        explanation: "2,50,000 × 14% × 6/12 = ₹17,500 for six months; the full year's charge would be ₹35,000, which is the classic slip." },
      { id: 70240, chapter: "deb", difficulty: "Hard",
        q: "The loss on issue of debentures totals ₹60,000 and the Securities Premium Reserve holds ₹25,000. The charge to the Statement of Profit and Loss is:",
        options: ["₹35,000", "₹60,000", "₹25,000", "₹30,000"],
        answerIndex: 0,
        explanation: "₹60,000 − ₹25,000 = ₹35,000. The reserve is used first, up to its balance; only the remainder becomes a financial cost of the year." },
      { id: 70241, chapter: "deb", difficulty: "Easy",
        q: "Debentures are said to be issued at a discount when:",
        options: ["The issue price is below the face value of the debentures", "The debentures are redeemable below their face value", "The interest rate is below the market rate", "The company pays the discount out of profits later"],
        answerIndex: 0,
        explanation: "Issue at a discount means the company receives less than face — say ₹96 for a ₹100 debenture — and the ₹4 shortfall per debenture is a loss on issue to be written off." },
      { id: 70242, chapter: "deb", difficulty: "Easy",
        q: "A company's debentures are 'redeemed' when:",
        options: ["The company repays the principal amount to the debenture holders", "The company converts them into shares", "The company writes off the loss on issue", "The company pays the half-year's interest"],
        answerIndex: 0,
        explanation: "Redemption is the repayment of the debt itself — the debenture liability is discharged and the holders get their money back; interest is a separate, recurring payment made during the life of the debentures." },
      { id: 70243, chapter: "deb", difficulty: "Hard",
        q: "₹6,00,000 of debentures were issued on 1st July, 2025 at 12% per annum. The accounting year ends on 31st March, 2026. Interest for the year is:",
        options: ["₹54,000", "₹72,000", "₹36,000", "₹18,000"],
        answerIndex: 0,
        explanation: "Nine months from 1st July to 31st March: 6,00,000 × 12% × 9/12 = ₹54,000. Applying the rate for a full year gives ₹72,000, which overstates the finance cost." },
      { id: 70244, chapter: "deb", difficulty: "Medium",
        q: "Interest on debentures falls due on 31st March but is still unpaid on that date. It appears on the Balance Sheet as:",
        options: ["Other current liabilities — an amount payable to the debenture holders", "A reserve, payable only if profit allows", "A deduction from the debentures account", "An asset, shown as accrued income"],
        answerIndex: 0,
        explanation: "The company owes the holders, so unpaid interest is a current liability under other financial liabilities; it is nevertheless a charge already recognised in the Statement of Profit and Loss — payable even in a loss year." },
      { id: 70245, chapter: "deb", difficulty: "Hard",
        q: "A company had 4,000 debentures of ₹100 each outstanding from 1st April at 12% per annum and repaid 1,500 of them on 30th September. Interest for the year ended 31st March is:",
        options: ["₹39,000", "₹48,000", "₹33,000", "₹24,000"],
        answerIndex: 0,
        explanation: "First half-year: 4,00,000 × 12% × 6/12 = ₹24,000. After the repayment only ₹2,50,000 remained: 2,50,000 × 12% × 6/12 = ₹15,000 — total ₹39,000, while running ₹4,00,000 for the year would wrongly give ₹48,000." },
      { id: 70246, chapter: "deb", difficulty: "Easy",
        q: "Which of these is NOT a feature of a debenture?",
        options: ["Voting rights in the general meetings of the company", "A fixed rate of interest payable to the holder", "Evidence of a debt owed by the company", "Repayment of the principal at an agreed time"],
        answerIndex: 0,
        explanation: "Debenture holders are creditors, not members: they receive interest and get their principal back, but they have no vote in the company's meetings — the vote belongs to the shareholders who own the company." },
      { id: 70247, chapter: "deb", difficulty: "Easy",
        q: "The loss on issue of debentures is recognised:",
        options: ["At the time of issue itself, not when the debentures are redeemed", "Only when the debentures are repaid at redemption", "As interest, spread over the life of the debentures", "Only if the company makes a profit in the year of issue"],
        answerIndex: 0,
        explanation: "The discount allowed and the premium payable on redemption are both fixed on the day the debentures are issued, so the whole loss is recognised then and written off — it waits for nothing, least of all for profit." },
      { id: 70248, chapter: "deb", difficulty: "Medium",
        q: "5,000 debentures of ₹100 each were issued at ₹95. On allotment, the Debentures A/c is credited with:",
        options: ["The full face value of ₹5,00,000", "The issue proceeds of ₹4,75,000", "₹4,75,000 plus the discount of ₹25,000", "A nominal ₹1, with the rest going to securities premium"],
        answerIndex: 0,
        explanation: "The debenture account always carries what the company owes — the face value of ₹5,00,000 — while the ₹25,000 shortfall on the ₹4,75,000 received is separately a loss on issue to be written off." },
      { id: 70249, chapter: "deb", difficulty: "Medium",
        q: "Which of these is charged under 'finance costs' in the Statement of Profit and Loss?",
        options: ["Interest on debentures for the period they remained outstanding", "Dividend declared out of the company's profit", "Transfer to General Reserve at the year end", "Provision for tax made for the year"],
        answerIndex: 0,
        explanation: "Interest on debentures is the cost of borrowed money — a finance cost and a charge against profit. Dividend is an appropriation, a transfer to reserve divides profit, and tax is deducted after profit before tax." },
      { id: 70250, chapter: "deb", difficulty: "Hard",
        q: "2,500 debentures of ₹100 each were issued at ₹96 and are redeemable at ₹105. The total loss on issue is:",
        options: ["₹22,500", "₹10,000", "₹12,500", "₹32,500"],
        answerIndex: 0,
        explanation: "Discount = 2,500 × (100 − 96) = ₹10,000 and premium payable on redemption = 2,500 × (105 − 100) = ₹12,500, so the loss on issue is ₹22,500 — both halves are recognised at issue itself." },

      { id: 70251, chapter: "cfin", difficulty: "Easy",
        q: "Which statement shows a company's income and expenses for an accounting period?",
        options: ["The Statement of Profit and Loss", "The Balance Sheet", "The notes to accounts alone", "The register of debenture holders"],
        answerIndex: 0,
        explanation: "It is the flow statement — revenue, other income, expenses and tax for the period. The Balance Sheet, by contrast, is a position at a date." },
      { id: 70252, chapter: "cfin", difficulty: "Medium",
        q: "A company's total income is ₹13,40,000 and its total expenses are ₹10,55,000. Profit before tax is:",
        options: ["₹2,85,000", "₹2,35,000", "₹3,05,000", "₹1,85,000"],
        answerIndex: 0,
        explanation: "13,40,000 − 10,55,000 = ₹2,85,000 — revenue from operations and other income together, less every expense heading of the year." },
      { id: 70253, chapter: "cfin", difficulty: "Easy",
        q: "Short-term advances given by a company are shown under:",
        options: ["Current assets", "Non-current assets", "Current liabilities", "Shareholders' funds"],
        answerIndex: 0,
        explanation: "Advances recoverable within the operating cycle belong with inventories, trade receivables and cash and bank balances — the current assets family." },
      { id: 70254, chapter: "cfin", difficulty: "Medium",
        q: "A proposed dividend is:",
        options: ["An appropriation of profit, deducted after tax to arrive at divisible profit", "An expense deducted before tax to arrive at profit before tax", "A liability added to trade payables on the face", "Part of the other income of the company"],
        answerIndex: 0,
        explanation: "A proposed dividend is a decision about the year's profit: it is set aside from profit after tax, before the residue is treated as divisible. It never reduces profit before tax and it is disclosed as the prescribed format directs." },
      { id: 70255, chapter: "cfin", difficulty: "Hard",
        q: "A company's accountant (i) added other income into revenue from operations, (ii) left out the year's depreciation of ₹2,40,000 altogether, and (iii) treated the proposed dividend as an expense before tax. Its reported profit before tax is:",
        options: ["₹2,40,000 too high — only the omitted depreciation changes profit before tax", "Correct as reported — all three entries are presentational only", "₹2,40,000 too low — depreciation should never be deducted from profit", "Wrong because of (i) and (iii); the depreciation omission does not matter"],
        answerIndex: 0,
        explanation: "Folding other income into revenue merely relabels an inflow that was inside total income anyway, and a proposed dividend is an appropriation made after tax — neither touches profit before tax. Depreciation of ₹2,40,000, however, is a real expense of the year, so leaving it out overstates profit before tax by exactly ₹2,40,000 — only (ii) distorts the figure." },
      { id: 70256, chapter: "cfin", difficulty: "Easy",
        q: "A note to the accounts discloses a lawsuit of ₹3,00,000 pending against the company. This liability is shown:",
        options: ["In the notes to accounts, without being added to the balance sheet total", "As a current liability on the face of the Balance Sheet", "As a loss in the Statement of Profit and Loss", "Nowhere — an unproven claim is never disclosed"],
        answerIndex: 0,
        explanation: "The claim may or may not become payable, so it is contingent: the company discloses the ₹3,00,000 in the notes so a reader knows the risk, and records neither a liability nor a loss until the event settles it." },
      { id: 70257, chapter: "cfin", difficulty: "Medium",
        q: "Which pair of items belongs to the SAME major head under Schedule III?",
        options: ["Trade payables and short-term provisions — both current liabilities", "Trade receivables and trade payables — both current liabilities", "Share capital and long-term borrowings — both shareholders' funds", "Inventories and trade payables — both current assets"],
        answerIndex: 0,
        explanation: "Trade payables and short-term provisions both sit inside current liabilities. A trade receivable is an asset, a long-term borrowing is a non-current liability and inventories are assets — each other pair straddles the two sides of the Balance Sheet." },
      { id: 70258, chapter: "cfin", difficulty: "Medium",
        q: "A company reports total equity and liabilities of ₹14,80,000 and total assets of ₹15,30,000. The statements:",
        options: ["Do not agree — an error of ₹50,000 must be traced before the statements are finalised", "Are correct, because assets are usually larger than liabilities", "Show a profit of ₹50,000 for the year", "Will agree once the proposed dividend is added to liabilities"],
        answerIndex: 0,
        explanation: "Every asset is financed by a claim, so the two totals must be identical; here they differ by ₹50,000 (15,30,000 − 14,80,000), which is an error to be found — not a profit, and nothing a dividend entry can repair." },
      { id: 70259, chapter: "cfin", difficulty: "Medium",
        q: "Which of these is an 'other expense' of the year?",
        options: ["Carriage outward on goods sold by the company", "Sale of finished goods to customers", "Interest credited on the company's fixed deposit", "Profit on the sale of an old machine"],
        answerIndex: 0,
        explanation: "Carriage outward is incurred in earning the year's profit and is neither employee benefits, finance costs nor depreciation, so it goes to other expenses; the other three are inflows — the first is revenue from operations, the last two other income." },
      { id: 70260, chapter: "cfin", difficulty: "Hard",
        q: "Revenue from operations ₹26,00,000; other income ₹1,00,000; total expenses ₹21,00,000; current tax ₹1,50,000. The profit for the year is:",
        options: ["₹4,50,000", "₹6,00,000", "₹7,50,000", "₹2,40,000"],
        answerIndex: 0,
        explanation: "Total income 26,00,000 + 1,00,000 = ₹27,00,000, less expenses ₹21,00,000 gives profit before tax ₹6,00,000; less current tax ₹1,50,000 gives profit for the year ₹4,50,000." },
      { id: 70261, chapter: "cfin", difficulty: "Medium",
        q: "Depreciation charged on the company's assets during the year appears in the Statement of Profit and Loss under:",
        options: ["Depreciation and amortisation expense", "Other income", "Employee benefits expense", "Finance costs"],
        answerIndex: 0,
        explanation: "Schedule III gives depreciation and amortisation its own expense heading so the charge is visible separately from other expenses; it is deducted before tax like every other expense of earning the profit." },
      { id: 70262, chapter: "cfin", difficulty: "Easy",
        q: "Trade payables of a company are:",
        options: ["Amounts the company owes its suppliers for goods or services received", "Amounts customers owe the company for goods sold", "A part of the company's share capital", "An asset the company will receive in cash"],
        answerIndex: 0,
        explanation: "Trade payables sit under current liabilities — they are obligations to suppliers; the money owed by customers is trade receivables, a current asset on the other side of the Balance Sheet." },
      { id: 70263, chapter: "cfin", difficulty: "Hard",
        q: "Share capital ₹8,00,000; reserves and surplus ₹4,50,000; long-term borrowings ₹3,00,000; trade payables ₹2,00,000; other current liabilities ₹1,00,000; short-term provisions ₹50,000. Total equity and liabilities:",
        options: ["₹19,00,000", "₹18,50,000", "₹19,50,000", "₹20,00,000"],
        answerIndex: 0,
        explanation: "8,00,000 + 4,50,000 = ₹12,50,000 shareholders' funds; plus non-current borrowings ₹3,00,000; plus current liabilities 2,00,000 + 1,00,000 + 50,000 = ₹3,50,000 — total ₹19,00,000." },
      { id: 70264, chapter: "cfin", difficulty: "Easy",
        q: "The format in which every Indian company must present its financial statements is prescribed by:",
        options: ["Schedule III of the Companies Act", "The partnership deed of the firm", "The stock exchange where the shares are listed", "The company's own accounting policy"],
        answerIndex: 0,
        explanation: "Schedule III fixes the headings and their order for both statements, so the accounts of every company can be read and compared the same way, year after year." },
      { id: 70265, chapter: "cfin", difficulty: "Hard",
        q: "A company's revenue from operations rose from ₹40,00,000 to ₹46,00,000 in a year, while its trade receivables rose from ₹5,00,000 to ₹11,00,000 and its cash and bank balances fell. The most reasonable reading is:",
        options: ["Sales are rising, but credit sales are piling up — collections need watching", "Cash collections improved along with sales", "The company has cut its credit sales sharply", "Revenue and receivables always move together, so nothing is wrong"],
        answerIndex: 0,
        explanation: "Revenue grew by ₹6,00,000, i.e. 15%, while receivables grew by the same ₹6,00,000 on a base of ₹5,00,000 — a 120% jump. When receivables outrun revenue like this, more of the profit is sitting with customers than before, which pressures cash and casts doubt on how much of that profit will convert into money." }
    ],

    /* ============ FLASHCARDS (ids 71189–71212) ============ */
    flashcards: [
      { id: 71189, chapter: "deb", front: "Fixed charge vs floating charge?", back: "A fixed charge is on one specific asset. A floating charge rides on a class of assets that keeps changing in form — stock, debtors, cash — and crystallises when the company defaults." },
      { id: 71190, chapter: "deb", front: "What does issuing debentures at a premium mean?", back: "They are issued above face value and the excess goes to Securities Premium Reserve — 1,000 debentures of ₹100 at ₹106 gives a ₹6,000 premium." },
      { id: 71191, chapter: "deb", front: "Is the discount on issue an asset?", back: "No — it is a loss on issue, debited to Loss on Issue of Debentures A/c and written off at once. Carrying it on the balance sheet as an asset is wrong." },
      { id: 71192, chapter: "deb", front: "Over what period does debenture interest accrue?", back: "From the date the money is payable — usually allotment — to the date of repayment. Principal × rate × months ÷ 12; never a full year by default." },
      { id: 71193, chapter: "deb", front: "Journal entry when debenture interest falls due?", back: "Debenture Interest A/c Dr to Debenture Holders' A/c (or Interest Payable). The amount is then carried to finance costs." },
      { id: 71194, chapter: "deb", front: "What makes debenture interest payable even in a loss year?", back: "It is a contractual charge owed to creditors of the company. Dividend, by contrast, is an appropriation that needs divisible profit." },
      { id: 71195, chapter: "deb", front: "Par issue but premium redemption — does a loss arise?", back: "Yes: the premium payable on redemption is a loss on issue. 2,000 debentures of ₹100 redeemable at ₹105 gives a ₹10,000 loss, recognised at issue." },
      { id: 71196, chapter: "deb", front: "What do secured debentures carry?", back: "A charge on the company's assets — fixed (a specific asset) or floating (a class changing in form) — giving the holders security for their money." },
      { id: 71197, chapter: "deb", front: "Do debenture holders vote in company meetings?", back: "No. They are creditors, not members: interest and principal, but no voting rights at all." },
      { id: 71198, chapter: "deb", front: "Order of writing off the loss on issue?", back: "Securities Premium Reserve first, up to its balance; the remainder to the Statement of Profit and Loss as a financial cost." },
      { id: 71199, chapter: "deb", front: "What happens to collateral debentures when the loan is repaid?", back: "They are cancelled — the security they stood for has gone. If the loan is never repaid, they become a real liability of the company." },
      { id: 71200, chapter: "deb", front: "Which account is debited on allotment of debentures?", back: "Debenture Application A/c — it is debited and Debentures A/c is credited with the face value, moving the money from application into the debt." },

      { id: 71201, chapter: "cfin", front: "Which statement is a flow and which a position?", back: "The Statement of Profit and Loss is a flow over a period; the Balance Sheet is a position at a date. One measures performance, the other what is held and owed." },
      { id: 71202, chapter: "cfin", front: "Order of the Balance Sheet headings?", back: "Equity and liabilities: shareholders' funds, then non-current liabilities, then current liabilities. Assets: non-current assets, then current assets." },
      { id: 71203, chapter: "cfin", front: "What sits inside shareholders' funds?", back: "Share capital, reserves and surplus, and money received against share allotment — the owners' stake in the company." },
      { id: 71204, chapter: "cfin", front: "Which liabilities are 'current'?", back: "Trade payables, other current liabilities and short-term provisions — obligations due within the operating cycle of the business." },
      { id: 71205, chapter: "cfin", front: "Profit before tax in one line?", back: "Revenue from operations + other income − total expenses (employee benefits, finance costs, depreciation and amortisation, other expenses)." },
      { id: 71206, chapter: "cfin", front: "Appropriations come out of which profit?", back: "Profit after tax. Divisible profit = profit for the year − transfers to reserves − proposed dividend." },
      { id: 71207, chapter: "cfin", front: "Why is other income shown separately?", back: "So a reader can see how much of the profit came from the business itself and how much came from outside it — the quality of the profit." },
      { id: 71208, chapter: "cfin", front: "Name the four expense heads of the Statement of Profit and Loss.", back: "Employee benefits expense; finance costs; depreciation and amortisation expense; other expenses. Each carries its own note reference." },
      { id: 71209, chapter: "cfin", front: "What does the balance-sheet equation guarantee?", back: "Total equity and liabilities = total assets. Every resource the company holds is financed by somebody's claim on it." },
      { id: 71210, chapter: "cfin", front: "Where does a contingent liability appear?", back: "In the notes to accounts — disclosed because it may crystallise, but never added to the balance sheet total." },
      { id: 71211, chapter: "cfin", front: "What does comparing two years of statements give you?", back: "A trend: rising revenue with faster-rising receivables means generous credit; reserves swelling year after year means profit is being retained." },
      { id: 71212, chapter: "cfin", front: "What pairs with every figure on the face?", back: "A note reference — the notes carry the split, the accounting policy and the commitments behind the compressed number." }
    ],

    /* ============ IMPORTANT QUESTIONS (existing count: 7 each) ============ */
    importantQuestions: {
      deb: [
        { type: "Short Answer", marks: 3,
          q: "What is the Loss on Issue of Debentures account, and which two items may be routed through it?",
          answer: "It is a temporary account that gathers every loss the company suffers at the moment it issues debentures. Two items may pass through it: the discount allowed at issue, being the face value more than the money received, and the premium payable on redemption when the debentures are issued redeemable above face. Both are recognised at issue itself and never at redemption. The total is then extinguished — Securities Premium Reserve is debited up to its balance and the remainder is charged to the Statement of Profit and Loss as a financial cost." },
        { type: "Long Answer", marks: 6,
          q: "A company issued 3,000 debentures of ₹100 each at ₹96 on 1st April, 2025, carrying interest at 12% per annum payable half-yearly, and the debentures are redeemable at ₹105. The Securities Premium Reserve held ₹15,000. Show the issue of the debentures, write off the loss on issue and compute the first half-year's interest.",
          answer: "Money received: Bank A/c Dr 2,88,000 to Debenture Application A/c, being 3,000 × 96. On allotment: Debenture Application A/c Dr 2,88,000 and Loss on Issue of Debentures A/c Dr 27,000 to Debentures A/c 3,00,000 — the debenture account always takes the face value, whatever the issue price. The loss on issue is discount 3,000 × 4 = ₹12,000 plus premium payable on redemption 3,000 × 5 = ₹15,000, together ₹27,000. Writing it off: Securities Premium Reserve Dr 15,000 and Statement of Profit and Loss (finance costs) Dr 12,000 to Loss on Issue of Debentures A/c 27,000 — the reserve is used first, up to its balance. Interest for the first half-year = 3,00,000 × 12% × 6/12 = ₹18,000, debited to Debenture Interest and carried to finance costs." },
        { type: "Long Answer", marks: 6,
          q: "A bank advances a loan of ₹4,00,000 to a company and debentures of ₹5,00,000 are handed to the bank as collateral security. Explain the accounting, and state what the company does if the loan is repaid in full after three years.",
          answer: "No money or value is received against the debentures themselves, so no entry is made for them. The company records only the loan: Bank A/c Dr 4,00,000 to Bank Loan A/c 4,00,000, and the interest on that loan is charged in the Statement of Profit and Loss as a finance cost of the years it runs. The debentures issued as collateral are disclosed — a note states that ₹5,00,000 of debentures stand as security for the bank loan. When the loan is repaid after three years, the bank loan account is settled and the collateral debentures are cancelled, because the liability they secured no longer exists. Had the company defaulted instead, the debentures would have turned into a real liability and the bank would have enforced its charge over the company's assets." },
        { type: "Case-Based", marks: 4,
          q: "A company issued 5,000 debentures of ₹100 each at ₹95 on 1st April, 2025, carrying interest at 14% per annum payable on 30th September and 31st March, and the debentures are redeemable at ₹103. (a) Compute the discount on issue. (b) Compute the total loss on issue. (c) State the interest payable on 30th September, 2025.",
          answer: "(a) Discount = 5,000 × (100 − 95) = ₹25,000, being the shortfall between the face value the company owes and the ₹4,75,000 it received. (b) Loss on issue = discount ₹25,000 + premium payable on redemption 5,000 × (103 − 100) = ₹15,000, i.e. ₹40,000 in all, recognised at issue itself and written off — Securities Premium Reserve first, then the Statement of Profit and Loss. (c) Interest for the half-year = 5,00,000 × 14% × 6/12 = ₹35,000, charged to finance costs; it runs on the face value of ₹5,00,000 and never on the issue proceeds of ₹4,75,000." },
        { type: "Case-Based", marks: 6,
          q: "The Loss on Issue of Debentures account of a company shows a balance of ₹36,000 at the year end, and its Securities Premium Reserve holds ₹20,000. (a) Name the two components that may make up this loss. (b) Pass the entry to write the loss off. (c) State where the amount that does not come out of the reserve finally appears.",
          answer: "(a) The discount allowed at the issue of the debentures, and the premium payable on their redemption where the debentures were issued redeemable above face. Both are recognised at the moment of issue, not at redemption. (b) Securities Premium Reserve A/c Dr 20,000; Statement of Profit and Loss (finance costs) A/c Dr 16,000; to Loss on Issue of Debentures A/c 36,000. (c) The balance of ₹16,000 — being ₹36,000 less the ₹20,000 absorbed by the reserve — is charged to the Statement of Profit and Loss as a financial cost of the year, reducing the profit available for appropriation and payable even if the year had produced a loss." },
        { type: "Assertion-Reason", marks: 4,
          q: "Assertion (A): Interest on debentures must be provided for even in a year in which the company earns no profit. Reason (R): Both interest on debentures and dividend are appropriations of profit and depend on the divisible profit of the year. Choose the correct option: (a) both A and R are true and R is the correct explanation of A, (b) both A and R are true but R is not the correct explanation of A, (c) A is true but R is false, (d) A is false but R is true.",
          answer: "Option (c) is correct: A is true while R is false. Debenture holders are creditors of the company and their interest is a contractual charge against profit — it accrues whether or not the company earns anything and is shown under finance costs. Dividend is not a charge at all: it is an appropriation that may be paid only out of divisible profit, so it simply does not arise in a loss year. Because interest and dividend differ in exactly this way, R — which treats both as appropriations of profit — is false and cannot be the explanation of A." },
        { type: "Assertion-Reason", marks: 4,
          q: "Assertion (A): Debentures issued to a bank as collateral security for a loan are not recorded in the books of the company. Reason (R): The company receives money or value in exchange for those debentures. Choose the correct option: (a) both A and R are true and R is the correct explanation of A, (b) both A and R are true but R is not the correct explanation of A, (c) A is true but R is false, (d) A is false but R is true.",
          answer: "Option (c) is correct: A is true while R is false. Against collateral debentures the company receives nothing — the lender had already parted with its money under the loan, and the debentures merely stand as extra security, so they are disclosed and never entered in the books. It is precisely the absence of consideration that justifies the 'disclose, do not enter' treatment, which is why R's claim that money or value is received is false and cannot be the explanation of A." },
        { type: "Long Answer", marks: 6,
          q: "Explain the terms 'fixed charge' and 'floating charge' as used in connection with secured debentures, and state how the rights of a secured debenture holder differ from those of a shareholder on winding up.",
          answer: "A fixed charge is created on one identified asset of the company — a building, a machine — so the company cannot deal with that asset without the lender's consent. A floating charge is created on a class of assets that keeps changing in form and location — stock-in-trade, book debts, cash at bank — and the company remains free to use them in the ordinary course of business until the charge crystallises, usually on default. Debentures carrying either charge are secured debentures, and their holder enjoys the comfort of a claim on assets of the company. A shareholder, by contrast, owns the company: on winding up every creditor and every debenture holder is paid first, and the shareholder receives only the surplus, if any remains after that." }
      ],

      cfin: [
        { type: "Short Answer", marks: 3,
          q: "State two differences between the Balance Sheet and the Statement of Profit and Loss of a company.",
          answer: "The Balance Sheet is a statement of financial position: it reports what the company holds and what it owes at a particular date — share capital and reserves, borrowings, payables and the asset families — and its two sides must total alike. The Statement of Profit and Loss is a performance statement: it covers a period, recording revenue from operations and other income against the expenses of earning them, then tax, and finally the profit for the year. The first is a photograph of a single day; the second is a film of the whole year's trading, and Schedule III fixes the headings of both." },
        { type: "Long Answer", marks: 6,
          q: "Prepare the Statement of Profit and Loss (extract) of a company up to profit for the year from: revenue from operations ₹26,00,000; other income ₹1,00,000; employee benefits expense ₹12,00,000; other expenses ₹6,00,000; depreciation and amortisation ₹2,00,000; finance costs ₹1,00,000; current tax ₹1,50,000.",
          answer: "Income: revenue from operations ₹26,00,000 and other income ₹1,00,000, each under its own heading, giving total income of ₹27,00,000. Expenses: employee benefits expense ₹12,00,000, finance costs ₹1,00,000, depreciation and amortisation ₹2,00,000 and other expenses ₹6,00,000, totalling ₹21,00,000. Profit before tax = 27,00,000 − 21,00,000 = ₹6,00,000. Less current tax ₹1,50,000, so profit for the year is ₹4,50,000. The headings appear in the prescribed order — income first, then each expense head, then tax — and every figure carries the note reference that explains its detail." },
        { type: "Long Answer", marks: 6,
          q: "Complete the Balance Sheet (extract) and give both totals: share capital ₹7,50,000; reserves and surplus ₹3,30,000; long-term borrowings ₹2,40,000; trade payables ₹1,80,000; other current liabilities ₹90,000; short-term provisions ₹60,000; property, plant and equipment ₹6,00,000; intangible assets ₹1,50,000; inventories ₹4,20,000; trade receivables ₹2,70,000; cash and bank balances ₹1,20,000; short-term advances ₹90,000.",
          answer: "Equity and liabilities: shareholders' funds = share capital ₹7,50,000 + reserves and surplus ₹3,30,000 = ₹10,80,000; non-current liabilities — long-term borrowings ₹2,40,000; current liabilities = trade payables ₹1,80,000 + other current liabilities ₹90,000 + short-term provisions ₹60,000 = ₹3,30,000. Total = 10,80,000 + 2,40,000 + 3,30,000 = ₹16,50,000. Assets: non-current = property, plant and equipment ₹6,00,000 + intangible assets ₹1,50,000 = ₹7,50,000; current = inventories ₹4,20,000 + trade receivables ₹2,70,000 + cash and bank balances ₹1,20,000 + short-term advances ₹90,000 = ₹9,00,000. Total = 7,50,000 + 9,00,000 = ₹16,50,000 — the two sides agree, exactly as the balance sheet must." },
        { type: "Long Answer", marks: 6,
          q: "A company reports a net profit after tax of ₹5,00,000 for the year. It transfers ₹1,20,000 to the general reserve and proposes a dividend of ₹1,50,000. Explain how each adjustment is treated and compute the profit available for distribution.",
          answer: "Net profit after tax is the profit of the year once every expense of earning it and the tax on it have been met. From that figure the company first makes its transfers to reserves — here ₹1,20,000 to the general reserve — an appropriation that keeps profit inside the business rather than distributing it to shareholders. A proposed dividend of ₹1,50,000 is the next appropriation: it is that part of the year's profit the company intends to pay its shareholders. Divisible profit = 5,00,000 − 1,20,000 − 1,50,000 = ₹2,30,000, which is the profit that may legitimately be distributed; anything distributed beyond that would be a return of capital rather than a dividend. Neither adjustment touches profit before tax, and no amount already charged as an expense of the year is deducted a second time." },
        { type: "Case-Based", marks: 4,
          q: "A reader compares two years of a company: revenue from operations ₹40,00,000 (previous year ₹34,00,000), trade receivables ₹11,00,000 (₹5,00,000) and cash and bank balances ₹1,50,000 (₹6,00,000). (a) By how much and by what percentage did trade receivables grow? (b) What does the fall in cash alongside rising receivables suggest? (c) State where trade receivables appear in the accounts.",
          answer: "(a) Trade receivables grew by 11,00,000 − 5,00,000 = ₹6,00,000, i.e. by 120% of the opening figure, against revenue growth of ₹6,00,000 on ₹34,00,000, which is only about 18% — receivables outran revenue by a wide margin proportionately. (b) Sales are being made on more generous credit and collections are slow: the profit has been booked, but the money is sitting with customers instead of in the bank, which squeezes liquidity and puts the realisability of that profit in question. (c) Trade receivables are a current asset, shown under current assets on the assets side of the Balance Sheet, with the revenue figure appearing in the Statement of Profit and Loss." },
        { type: "Case-Based", marks: 6,
          q: "The 'Other expenses' line of a company's Statement of Profit and Loss shows ₹4,80,000. Its note breaks this into carriage outward ₹1,20,000, legal and professional charges ₹60,000, repairs to factory ₹90,000 and miscellaneous expenses ₹2,10,000. (a) What must a note to accounts disclose in general? (b) Verify the total of the note. (c) Why does the face of the statement show only ₹4,80,000?",
          answer: "(a) A note carries what the face compresses: the sub-headings and splits behind every face figure, the accounting policies chosen where the framework allowed more than one, commitments, contingent liabilities and related-party information — each figure on the face carrying its note reference. (b) 1,20,000 + 60,000 + 90,000 + 2,10,000 = ₹4,80,000, which agrees exactly with the other expenses total shown on the face — the note must reconcile with the statement, never contradict it. (c) The face of the statement is read at a glance, so Schedule III shows only the aggregate under one heading; the detail belongs in the note, where a reader who wants it can find it without cluttering the statement itself." },
        { type: "Assertion-Reason", marks: 4,
          q: "Assertion (A): A company's financial statements must be presented in the format prescribed by Schedule III of the Companies Act. Reason (R): A prescribed format, with fixed headings in a fixed order, makes the accounts of different companies comparable. Choose the correct option: (a) both A and R are true and R is the correct explanation of A, (b) both A and R are true but R is not the correct explanation of A, (c) A is false but R is true, (d) A is true but R is false.",
          answer: "Option (a) is correct: both statements are true and R explains A. Schedule III does prescribe the format — the headings of the Balance Sheet and the Statement of Profit and Loss and the order in which they appear — and the very reason it exists is comparability: because every company presents the same skeleton, a reader can set one company's accounts against another's, or against its own past years, without relearning the structure each time. R therefore gives precisely the purpose that makes A mandatory." },
        { type: "Assertion-Reason", marks: 4,
          q: "Assertion (A): Interest earned on a company's investments is included in arriving at profit before tax but is not shown under revenue from operations. Reason (R): Interest income does not arise from the principal business of the company. Choose the correct option: (a) both A and R are true and R is the correct explanation of A, (b) both A and R are true but R is not the correct explanation of A, (c) A is false but R is true, (d) A is true but R is false.",
          answer: "Option (a) is correct: both are true and R explains A. Interest income is a genuine inflow of the year, so it enters total income and helps form profit before tax; but it arises from investing surplus funds rather than from selling goods or rendering services, so Schedule III shows it under other income. The reason it is placed there is exactly the one R gives — the source lies outside the principal business — so R is true and is the correct explanation of A." }
      ]
    }
  });
})();
