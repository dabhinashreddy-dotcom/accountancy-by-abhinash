/* ============================================================
   CLASS 12 — PART A: COMPANY ACCOUNTS (v83)
   Chapters 7–9: Accounting for Share Capital (sc), Accounting
   for Debentures (deb), Financial Statements of a Company
   (cfin). Plain browser script; C12_DATA must exist (data-12.js).
   Original teaching material written for this project against
   the published CBSE Class 12 Accountancy curriculum
   (session 2026-27) — not copied from any textbook.
   ============================================================ */
(function () {
  "use strict";

  C12_DATA.register({

    content: {

      /* ---------- Chapter 7: Accounting for Share Capital ---------- */
      sc: {
        theory: {
          simple: [
            {
              h: "What a Company Is — and What a Share Is",
              p: "A company is an artificial person registered under the Companies Act, with perpetual succession, a separate legal identity, and limited liability for its members. Its capital is divided into units called shares. A share is not a debt — it is a proportionate claim on the company's profits and, on winding up, on its residual assets.",
              list: [
                { term: "Authorised capital", def: "The maximum share capital the company is permitted to issue, printed on the face of the balance sheet." },
                { term: "Issued capital", def: "The portion of authorised capital actually offered to the public for subscription." },
                { term: "Subscribed capital", def: "The part of issued capital that investors actually applied for and the company accepted." },
                { term: "Called-up capital", def: "The portion of subscribed capital the company has demanded shareholders to pay so far; the rest is calls unpaid." },
                { term: "Paid-up capital", def: "The portion of called-up capital actually received — called-up minus calls in arrears." }
              ]
            },
            {
              h: "Issuing Shares — Par and Premium",
              p: "A company offers shares payable in instalments: application money first, then allotment, then calls. Shares may be issued at par (at face value), at a premium (above face, reflecting the company's reputation and earning power), or at a discount (below face — permitted only in the specific statutory circumstances). The premium is credited to the Securities Premium Reserve and may be applied only to the purposes the law lists — issuing bonus shares, or providing for premium payable on future redemption — never to writing down losses or paying dividend.",
              formula: "Application money = Shares applied × Application rate per share · Premium = Issue price − Face value"
            },
            {
              h: "Over-Subscription, Under-Subscription, Arrears and Advances",
              p: "When applications exceed the offer, the excess is rejected (or accepted in part) and the surplus money returned. When they fall short and the minimum subscription is not met, the issue fails. Shareholders who pay late leave calls in arrears; those who pay before a call leave calls in advance. In this course neither carries interest — the syllabus treats them purely as balance-sheet items.",
              p2: "Under the Companies Act minimum subscription requirements, an issue can proceed only if the public has applied for at least the prescribed portion of the offered capital."
            }
          ],
          advanced: [
            {
              h: "Forfeiture and Reissue of Shares",
              p: "When a shareholder fails to pay a call despite notice, the company may forfeit the shares — cancelling the shareholder's rights and transferring everything already paid to the Share Forfeited Account. The share capital is debited only up to the called-up amount, never to face value, because uncalled capital was never demanded. On reissue, any discount allowed is adjusted against the forfeited amount of those specific shares; whatever forfeited balance remains unused is transferred to the Capital Reserve.",
              formula: "Capital reserve on reissue = (Amount forfeited on reissued shares) − (Discount allowed on reissue)"
            },
            {
              h: "Entries That Keep the Ledger Honest",
              p: "Every stage of the issue has its own pair: application money is held in Share Application until allotment, then transferred to Share Capital; allotment and each call are first made due (debiting the receivable, crediting capital) and then received. Calls in arrears appear when the receivable is not fully collected; calls in advance when money arrives before the corresponding call is made. Nothing is ever transferred to capital before it is called.",
              p2: "Calls-in-advance is transferred to the relevant call account only when that call actually becomes due."
            },
            {
              h: "Other Routes Into Share Capital",
              p: "Shares may be issued for consideration other than cash — to a vendor supplying assets, valued at the agreed figure. Private placement bypasses a public issue by allotting to selected persons. Sweat equity shares are issued to employees or directors at a special price for their knowledge, skills or contributions; an employees' stock option plan (ESOP) grants the right to buy shares at a predetermined price. Each route still ends with the same capital and premium credits — only the consideration differs."
            }
          ]
        },

        concepts: [
          { title: "Share", body: "A unit of the company's divided capital — a proportionate claim on profits and residual assets, not a debt of the company." },
          { title: "Securities Premium Reserve", body: "The excess of issue price over face value, credited to a reserve usable only for the purposes the Companies Act lists — never for dividend or writing off losses." },
          { title: "Forfeiture of shares", body: "Cancellation of a defaulting shareholder's rights on unpaid calls; the amount already paid is transferred to the Share Forfeited Account and share capital is debited up to the called-up value only." },
          { title: "Calls in advance / arrears", body: "Money received before a call is due (advance) or unpaid after a call is made (arrears) — both treated without interest in this course." }
        ],

        formats: [
          {
            title: "Capital ladder on the company balance sheet",
            note: "The four figures, each a subset of the one before it.",
            head: ["Stage", "Meaning", "Illustration (₹)"],
            rows: [
              ["Authorised capital", "Maximum permitted", "5,00,000 (50,000 shares × 10)"],
              ["Issued capital", "Offered to public", "2,00,000 (20,000 shares × 10)"],
              ["Subscribed capital", "Applied for and accepted", "1,80,000"],
              ["Called-up capital", "Demanded so far (say ₹8 of ₹10)", "1,44,000"],
              ["Paid-up capital", "Received (less arrears ₹3,000)", "1,41,000"]
            ]
          },
          {
            title: "Working note — forfeiture and reissue",
            note: "Called-up value drives the capital debit; forfeited amount drives the discount adjust.",
            head: ["Particulars", "Amount (₹)"],
            rows: [
              ["Shares forfeited (1,000 of ₹10, fully called)", "10,000"],
              ["Less: amount unpaid (arrears)", "(4,000)"],
              ["Amount transferred to Share Forfeited A/c", "6,000"],
              ["Reissue of 500 shares at ₹8 (discount ₹2)", "1,000"],
              ["Forfeited amount used for that discount (500 × 6)", "3,000"],
              ["Capital reserve on first reissue", "2,000"],
              ["Remaining 500 reissued at ₹10 — no discount", "3,000"],
              ["Total capital reserve", "5,000"]
            ]
          }
        ],

        numericals: [
          {
            id: 1, difficulty: "Easy",
            question: "A company issued 10,000 shares of ₹10 each at ₹12 (₹2 premium), payable ₹5 on application. Application money received on full subscription:",
            options: ["₹50,000", "₹1,20,000", "₹1,00,000", "₹20,000"],
            answerIndex: 0,
            explanation: "Application money is charged at the application rate, not the issue price: 10,000 × ₹5 = ₹50,000. The premium is collected with allotment."
          },
          {
            id: 2, difficulty: "Medium",
            question: "Shares of ₹10 each issued at par were subscribed for 8,000 shares against an offer of 10,000. The company will allot:",
            options: ["8,000 shares and refund nothing further", "10,000 shares", "8,000 shares with the balance re-issued later", "No shares — the issue fails"],
            answerIndex: 0,
            explanation: "Under-subscription: allot only what was applied for (assuming the minimum subscription is met). The remaining 2,000 shares simply remain unissued."
          },
          {
            id: 3, difficulty: "Easy",
            question: "A holder of 500 shares of ₹10 each (₹3 call due) does not pay the call. Calls in arrears:",
            options: ["₹1,500", "₹5,000", "₹3,500", "₹1,000"],
            answerIndex: 0,
            explanation: "Arrears = shares × unpaid call amount = 500 × 3 = ₹1,500. Interest on arrears is not computed in this course."
          },
          {
            id: 4, difficulty: "Medium",
            question: "On allotment due of ₹4 per share, a shareholder holding 1,000 shares pays ₹5 per share. The excess is recorded as:",
            options: ["Calls in advance ₹1,000", "Securities premium ₹1,000", "Calls in arrears ₹1,000", "Share forfeited ₹1,000"],
            answerIndex: 0,
            explanation: "Money received beyond what is currently due is calls in advance: 1,000 × (5 − 4) = ₹1,000, transferred to the call account only when that call is made."
          },
          {
            id: 5, difficulty: "Medium",
            question: "1,000 shares of ₹10 each (₹7 called up) on which ₹5 per share was paid are forfeited. Amount transferred to Share Forfeited A/c:",
            options: ["₹5,000", "₹7,000", "₹10,000", "₹2,000"],
            answerIndex: 0,
            explanation: "The forfeited account receives exactly what was paid: 1,000 × ₹5 = ₹5,000. Share Capital is debited ₹7,000 (called-up), and the ₹2,000 shortfall goes to Calls in Arrears."
          },
          {
            id: 6, difficulty: "Hard",
            question: "Of the forfeited shares above, 500 are reissued at ₹8 per share as fully paid. The discount of ₹1,000 is adjusted against:",
            options: ["Share Forfeited Account of those shares", "Securities Premium Reserve", "Profit and Loss Account", "General Reserve"],
            answerIndex: 0,
            explanation: "Discount on reissue is met strictly from the amount forfeited on those shares (500 × ₹5 = ₹2,500 available) — nothing else."
          },
          {
            id: 7, difficulty: "Hard",
            question: "In the same case (forfeited at ₹5 paid; 500 reissued at ₹8), the capital reserve transferred on reissue is:",
            options: ["₹1,500", "₹2,500", "₹1,000", "₹500"],
            answerIndex: 0,
            explanation: "Forfeited on those 500 shares = ₹2,500; discount allowed = ₹1,000; capital reserve = ₹1,500."
          },
          {
            id: 8, difficulty: "Easy",
            question: "Securities Premium Reserve may NOT be used for:",
            options: ["Paying dividend to shareholders", "Issuing bonus shares", "Providing for premium on future redemption", "Writing off share issue expenses as permitted"],
            answerIndex: 0,
            explanation: "The premium is not free money: dividend cannot be paid out of it. Bonus shares and premium-on-redemption provisions are permitted uses."
          },
          {
            id: 9, difficulty: "Easy",
            question: "Shares issued to employees at a special price in recognition of their knowledge, skills or contributions are called:",
            options: ["Sweat equity shares", "Bonus shares", "Forfeited shares", "Calls-in-advance shares"],
            answerIndex: 0,
            explanation: "Sweat equity recognises human contribution to the company's value; an ESOP is the plan granting employees the option to buy at a predetermined price."
          },
          {
            id: 10, difficulty: "Easy",
            question: "Called-up capital of a company is ₹1,44,000 and calls in arrears are ₹3,000. Paid-up capital is:",
            options: ["₹1,41,000", "₹1,47,000", "₹1,44,000", "₹3,000"],
            answerIndex: 0,
            explanation: "Paid-up = called-up − arrears = ₹1,44,000 − ₹3,000 = ₹1,41,000."
          }
        ],

        activity: {
          type: "journal",
          title: "Share Capital Journal Lab",
          instruction: "Issue at par: 5,000 shares of ₹12 each, payable ₹5 on application, ₹4 on allotment, ₹3 on first call. One shareholder deposits ₹1,000 in advance before the first call; a holder of 500 shares defaults on the first call and pays the arrears later. Build each entry — debit, credit and amount — and verify.",
          entries: [
            {
              prompt: "Application money received on full subscription (5,000 shares × ₹5).",
              dr: ["Bank A/c", "Share Application A/c", "Share Capital A/c", "Calls in Arrears A/c"],
              cr: ["Share Application A/c", "Share Capital A/c", "Bank A/c", "Share Allotment A/c"],
              drAccount: "Bank A/c", crAccount: "Share Application A/c", amount: 25000,
              note: "Cash arrives first and sits in Share Application until allotment decides its destination."
            },
            {
              prompt: "Application money transferred to share capital on allotment.",
              dr: ["Share Application A/c", "Bank A/c", "Share Capital A/c", "Share Allotment A/c"],
              cr: ["Share Capital A/c", "Share Application A/c", "Bank A/c", "Securities Premium Reserve A/c"],
              drAccount: "Share Application A/c", crAccount: "Share Capital A/c", amount: 25000,
              note: "At par, the entire application money becomes capital."
            },
            {
              prompt: "Allotment money made due (5,000 shares × ₹4).",
              dr: ["Share Allotment A/c", "Share Capital A/c", "Bank A/c", "Share First Call A/c"],
              cr: ["Share Capital A/c", "Share Allotment A/c", "Bank A/c", "Share Application A/c"],
              drAccount: "Share Allotment A/c", crAccount: "Share Capital A/c", amount: 20000,
              note: "The due entry creates the receivable and raises capital — cash follows later."
            },
            {
              prompt: "Allotment money received in full from all shareholders (5,000 shares × ₹4).",
              dr: ["Bank A/c", "Share Allotment A/c", "Calls in Advance A/c", "Share Capital A/c"],
              cr: ["Share Allotment A/c", "Calls in Advance A/c", "Bank A/c", "Share Capital A/c"],
              drAccount: "Bank A/c", crAccount: "Share Allotment A/c", amount: 20000,
              note: "The receivable created by the due entry is now realised in cash."
            },
            {
              prompt: "A shareholder deposits ₹1,000 with the company before the first call is made.",
              dr: ["Bank A/c", "Calls in Advance A/c", "Share First Call A/c", "Share Capital A/c"],
              cr: ["Calls in Advance A/c", "Bank A/c", "Share First Call A/c", "Share Capital A/c"],
              drAccount: "Bank A/c", crAccount: "Calls in Advance A/c", amount: 1000,
              note: "Money received ahead of its call is a liability of the company — it moves to the call account only when that call falls due."
            },
            {
              prompt: "First call made due (5,000 shares × ₹3).",
              dr: ["Share First Call A/c", "Bank A/c", "Share Capital A/c", "Calls in Advance A/c"],
              cr: ["Share Capital A/c", "Share First Call A/c", "Calls in Advance A/c", "Bank A/c"],
              drAccount: "Share First Call A/c", crAccount: "Share Capital A/c", amount: 15000,
              note: "Each call follows the same pattern: due, then received."
            },
            {
              prompt: "First call money received in cash: the 500-share holder defaults entirely; the shareholder who had deposited ₹1,000 in advance pays only the balance of ₹2,000; everyone else pays the full ₹3.",
              dr: ["Bank A/c", "Share First Call A/c", "Calls in Arrears A/c", "Share Capital A/c"],
              cr: ["Share First Call A/c", "Bank A/c", "Calls in Arrears A/c", "Share Capital A/c"],
              drAccount: "Bank A/c", crAccount: "Share First Call A/c", amount: 12500,
              note: "15,000 due − 1,500 defaulted − 1,000 already deposited in advance = ₹12,500 in cash."
            },
            {
              prompt: "The unpaid portion of the first call (500 × ₹3) is transferred to calls in arrears.",
              dr: ["Calls in Arrears A/c", "Share First Call A/c", "Share Capital A/c", "Bank A/c"],
              cr: ["Share First Call A/c", "Calls in Arrears A/c", "Share Capital A/c", "General Reserve A/c"],
              drAccount: "Calls in Arrears A/c", crAccount: "Share First Call A/c", amount: 1500,
              note: "Arrears are a receivable of the company against the defaulting shareholder."
            },
            {
              prompt: "The advance of ₹1,000 is transferred to the first call account now that the call has fallen due.",
              dr: ["Calls in Advance A/c", "Bank A/c", "Share First Call A/c", "Calls in Arrears A/c"],
              cr: ["Share First Call A/c", "Calls in Advance A/c", "Share Capital A/c", "Bank A/c"],
              drAccount: "Calls in Advance A/c", crAccount: "Share First Call A/c", amount: 1000,
              note: "Advance becomes call money only when the corresponding call actually falls due — it is never capital before that."
            },
            {
              prompt: "The 500-share defaulter now pays the arrears of ₹1,500 in full.",
              dr: ["Bank A/c", "Share First Call A/c", "Calls in Arrears A/c", "Share Capital A/c"],
              cr: ["Calls in Arrears A/c", "Bank A/c", "Share First Call A/c", "Share Capital A/c"],
              drAccount: "Bank A/c", crAccount: "Calls in Arrears A/c", amount: 1500,
              note: "Arrears are a receivable until paid — in this course no interest is charged on them."
            }
          ]
        },

        examCases: [
          {
            id: 1,
            title: "A premium issue, end to end",
            passage: "A company issued 10,000 shares of ₹10 each at ₹12 (including a premium of ₹2), payable ₹5 on application, ₹4 on allotment (including the premium) and ₹3 on first call. The issue was fully subscribed and every shareholder paid on time.",
            difficulty: "Hard",
            subs: [
              {
                q: "Total application money received:",
                options: ["₹50,000", "₹1,20,000", "₹1,00,000", "₹20,000"],
                answerIndex: 0,
                reasoning: "10,000 × ₹5 = ₹50,000 — application is charged at its own rate."
              },
              {
                q: "Allotment money due on the whole issue:",
                options: ["₹40,000", "₹20,000", "₹30,000", "₹50,000"],
                answerIndex: 0,
                reasoning: "10,000 × ₹4 = ₹40,000, which includes the premium of ₹2 per share."
              },
              {
                q: "Securities Premium credited at allotment:",
                options: ["₹20,000", "₹40,000", "₹10,000", "₹50,000"],
                answerIndex: 0,
                reasoning: "Premium = 10,000 × ₹2 = ₹20,000, credited to Securities Premium Reserve."
              }
            ]
          },
          {
            id: 2,
            title: "Forfeiture and reissue",
            passage: "A shareholder holding 1,000 shares of ₹10 each, fully called up, paid only ₹6 per share and defaulted. The shares were forfeited. Later, 500 of the forfeited shares were reissued at ₹8 per share as fully paid, and the remaining 500 at ₹10 per share.",
            difficulty: "Hard",
            subs: [
              {
                q: "Amount transferred to Share Forfeited A/c on forfeiture:",
                options: ["₹6,000", "₹10,000", "₹4,000", "₹5,000"],
                answerIndex: 0,
                reasoning: "Only what was paid is forfeited: 1,000 × ₹6 = ₹6,000."
              },
              {
                q: "Calls in arrears at the date of forfeiture:",
                options: ["₹4,000", "₹6,000", "₹10,000", "₹2,000"],
                answerIndex: 0,
                reasoning: "1,000 × (10 − 6) = ₹4,000 unpaid on fully called shares."
              },
              {
                q: "Share Capital debited on forfeiture:",
                options: ["₹10,000", "₹6,000", "₹4,000", "₹16,000"],
                answerIndex: 0,
                reasoning: "Capital is debited up to the called-up value: 1,000 × ₹10 = ₹10,000 — never beyond it."
              },
              {
                q: "Discount allowed on the reissue of 500 shares at ₹8:",
                options: ["₹1,000", "₹2,000", "₹500", "₹1,500"],
                answerIndex: 0,
                reasoning: "500 × (10 − 8) = ₹1,000, adjusted against the forfeited amount of those shares."
              },
              {
                q: "Capital reserve arising from that first reissue:",
                options: ["₹2,000", "₹1,000", "₹3,000", "₹5,000"],
                answerIndex: 0,
                reasoning: "Forfeited on those 500 shares = ₹3,000; less discount ₹1,000 → ₹2,000."
              },
              {
                q: "Total capital reserve after both reissues:",
                options: ["₹5,000", "₹6,000", "₹3,000", "₹4,000"],
                answerIndex: 0,
                reasoning: "Second batch: ₹3,000 forfeited, no discount → ₹3,000. Total = 2,000 + 3,000 = ₹5,000."
              }
            ]
          }
        ],

        examNumericals: [
          {
            id: 1, q: "10,000 shares of ₹10 issued at ₹12, payable ₹5 on application. Total application money received on full subscription (₹).",
            value: 50000,
            explanation: "10,000 × ₹5 = ₹50,000.",
            difficulty: "Easy"
          },
          {
            id: 2, q: "1,000 forfeited shares (₹6 paid of ₹10 fully called) — 500 reissued at ₹8 as fully paid. Capital reserve on reissue (₹).",
            value: 2000,
            explanation: "Forfeited 500 × 6 = 3,000; discount 500 × 2 = 1,000 → capital reserve ₹2,000.",
            difficulty: "Medium"
          }
        ],

        quickRevision: {
          definition: "Accounting for share capital records the issue of shares in instalments (application, allotment, calls), the treatment of premium, arrears and advances, and the forfeiture-and-reissue cycle when a shareholder defaults.",
          keyPoints: [
            "Capital ladder: authorised ⊇ issued ⊇ subscribed ⊇ called-up ⊇ paid-up.",
            "Premium is credited to Securities Premium Reserve — usable only for statutory purposes, never dividend.",
            "Calls in advance and arrears carry no interest in this course.",
            "Forfeiture debits Share Capital only up to the called-up amount.",
            "Reissue discount is adjusted against the forfeited amount of those shares; the residue goes to Capital Reserve."
          ],
          postingRules: [
            "Application received: Bank Dr / To Share Application.",
            "On allotment: Share Application Dr / To Share Capital (at par; premium split to Securities Premium Reserve).",
            "Allotment/call due: Share Allotment (or First Call) Dr / To Share Capital.",
            "Money received: Bank Dr / To Share Allotment (or the call account).",
            "Defaulter's unpaid portion: Calls in Arrears Dr / To the call account.",
            "Advance received: Bank Dr / To Calls in Advance — transferred to the call account only when that call is due.",
            "Forfeiture: Share Capital Dr (called-up) / To Share Forfeited (paid) / To Calls in Arrears (unpaid)."
          ],
          formulas: [
            { label: "Application money", expr: "Shares applied × Application rate" },
            { label: "Calls in arrears", expr: "Shares × Unpaid call amount" },
            { label: "Share Forfeited credit", expr: "Shares forfeited × Amount actually paid per share" },
            { label: "Capital reserve on reissue", expr: "Forfeited amount on reissued shares − Discount allowed" }
          ],
          distinctions: [
            {
              title: "Calls in advance vs calls in arrears",
              head: ["Calls in advance", "Calls in arrears"],
              rows: [
                ["Meaning", "Money received before the call is due", "Money unpaid after the call is due"],
                ["Nature", "Liability of the company to the shareholder", "Receivable of the company from the shareholder"],
                ["Transfer", "To the call account when that call falls due", "From the call account when the default is identified"],
                ["Interest (this course)", "None", "None"]
              ]
            }
          ],
          examPoints: [
            "Draw a two-line statement per instalment — due, then received — and the ledger will never disagree with you.",
            "Forfeiture questions: called-up drives the capital debit; paid drives the forfeited credit.",
            "Reissue: adjust discount strictly against those shares' forfeited amount, then transfer the unused balance to Capital Reserve."
          ],
          commonMistakes: [
            "Debiting Share Capital at face value on forfeiture even when only part of the capital was called up.",
            "Adjusting reissue discount against the entire Share Forfeited Account instead of the reissued shares' portion.",
            "Collecting premium with application but crediting the whole amount to Share Capital."
          ],
          mnemonic: "ACPP — Application, Calls (arrears/advance), Premium reserve, and the forfeiture Pair: Capital (called-up) vs Forfeited (paid)."
        }
      },

      /* ---------- Chapter 8: Accounting for Debentures ---------- */
      deb: {
        theory: {
          simple: [
            {
              h: "What a Debenture Is",
              p: "A debenture is a certificate acknowledging a debt of the company, carrying a fixed rate of interest payable whether or not the company earns profits. Debenture holders are creditors, not owners — they receive interest, not dividend, and their repayment terms were fixed when the debentures were issued.",
              list: [
                { term: "Secured debentures", def: "Backed by a charge on the company's assets; the charge may be fixed (on a specific asset) or floating (on a class of assets changing in form)." },
                { term: "Unsecured debentures", def: "Carry no specific charge — holders are merely creditors of the company." },
                { term: "Registered debentures", def: "Transferable only by the company's prescribed instrument, in the name recorded in the register." },
                { term: "Bearer debentures", def: "Transferable by delivery, with interest paid to whoever holds the coupon." }
              ]
            },
            {
              h: "Issuing Debentures — Par, Premium, Discount",
              p: "Debentures may be issued at par (at face), at a premium (above face) or at a discount (below face). The entry pattern mirrors share issues: money due, then received. When issued at a discount, the discount is a loss on issue and must be written off — the law does not permit it to lie on the balance sheet as an asset.",
              formula: "Net proceeds = Debentures × Issue price · Discount = Debentures × (Face − Issue price)"
            },
            {
              h: "Interest on Debentures",
              p: "Interest at the stated rate accrues on debentures for the period they remain outstanding — payable half-yearly in practice, and carried to the Statement of Profit and Loss as a finance cost. It is a charge against profit: payable even in a loss-making year, unlike dividend. In this course no tax is deducted at source on that interest.",
              formula: "Interest = Debentures × Rate × Months ÷ 12"
            }
          ],
          advanced: [
            {
              h: "Writing Off the Loss on Issue",
              p: "Loss on issue bundles two components: the discount allowed at issue and the premium payable on future redemption when the debentures were issued redeemable at a premium. Both are recognised at the moment of issue, and the total is written off — first out of Securities Premium Reserve to the extent it exists, and the remainder out of the profit and loss account as a financial cost.",
              formula: "Loss on issue = Discount on issue + Premium payable on redemption"
            },
            {
              h: "Debentures for Consideration, and as Collateral Security",
              p: "Debentures may be issued to a vendor for assets or services received, valued at the agreed figure — the discount then reflects the difference between the agreed debt and the value of what was received. Debentures may also be issued to a bank as collateral security for a loan: no regular entry is made for the debentures themselves; the loan is recorded, and the debentures are disclosed. If the loan is repaid, the debentures are cancelled; if it is not, the debentures become a real liability.",
              p2: "The distinguishing test is always the same: has the company received money or value against the debentures? If yes, an entry. If it is only security for a loan, a disclosure."
            },
            {
              h: "Debentures vs Shares — the Fixed Difference",
              p: "A share is ownership; a debenture is debt. Interest on debentures is payable even in a loss year and is a finance cost; dividend depends on divisible profit and is an appropriation. On winding up, debenture holders rank ahead of shareholders. Capital for debentures creates a liability on the balance sheet; share capital creates members' funds — the two never merge, whatever the issue terms."
            }
          ]
        },

        concepts: [
          { title: "Debenture", body: "A certificate of debt of the company carrying a fixed rate of interest, with holders treated as creditors rather than owners." },
          { title: "Collateral security", body: "Debentures handed to a lender purely as additional security for a loan — no entry is made for them; they are disclosed instead." },
          { title: "Loss on issue", body: "Discount allowed at issue plus premium payable on redemption — recognised immediately and written off as a financial cost." },
          { title: "Finance cost", body: "The Statement of Profit and Loss heading under which interest on debentures appears — a charge against profit, payable even in a loss year." }
        ],

        formats: [
          {
            title: "Debenture issue — instalment entry pattern",
            note: "Same two-step rhythm as share issues: due, then received.",
            head: ["Event", "Debit", "Credit", "Amount (₹)"],
            rows: [
              ["Issue of 2,000 debentures at ₹95 — due", "Debentures A/c", "Debenture Application A/c", "1,90,000"],
              ["Application money received", "Bank A/c", "Debenture Application A/c", "1,90,000"],
              ["Money due on debentures at par", "Debenture Allotment A/c", "Debentures A/c", "2,00,000"],
              ["Discount on issue recognised", "Loss on Issue of Debentures A/c", "Debentures Discount A/c", "10,000"]
            ]
          },
          {
            title: "Writing off loss on issue",
            note: "Springs first, then the profit and loss account.",
            head: ["Component", "Amount (₹)", "Absorbed from", "Amount (₹)"],
            rows: [
              ["Discount on issue", "10,000", "Securities Premium Reserve", "6,000"],
              ["Premium payable on redemption", "15,000", "Profit and Loss (finance cost)", "19,000"],
              ["Total loss on issue", "25,000", "Total written off", "25,000"]
            ]
          }
        ],

        numericals: [
          {
            id: 1, difficulty: "Easy",
            question: "A company issued 5,000 debentures of ₹100 each at par. Amount received:",
            options: ["₹5,00,000", "₹50,000", "₹5,00,000 minus discount", "₹1,00,000"],
            answerIndex: 0,
            explanation: "At par: 5,000 × ₹100 = ₹5,00,000, all credited to debentures."
          },
          {
            id: 2, difficulty: "Medium",
            question: "1,000 debentures of ₹100 each were issued at ₹95. Discount on issue:",
            options: ["₹5,000", "₹95,000", "₹1,00,000", "₹10,000"],
            answerIndex: 0,
            explanation: "Discount = 1,000 × (100 − 95) = ₹5,000 — a loss on issue to be written off, not an asset."
          },
          {
            id: 3, difficulty: "Medium",
            question: "2,000 debentures of ₹100 each were issued at ₹105. The premium of ₹10,000 is credited to:",
            options: ["Securities Premium Reserve A/c", "Debentures A/c", "Capital Reserve A/c", "Profit and Loss A/c"],
            answerIndex: 0,
            explanation: "2,000 × ₹5 = ₹10,000 premium goes to Securities Premium Reserve, with the same statutory restrictions as share premium."
          },
          {
            id: 4, difficulty: "Medium",
            question: "Interest for half a year on 500 debentures of ₹100 each at 12% p.a. is:",
            options: ["₹3,000", "₹6,000", "₹1,500", "₹7,500"],
            answerIndex: 0,
            explanation: "50,000 × 12% × 6/12 = ₹3,000. Interest is computed only for the period the debentures were outstanding."
          },
          {
            id: 5, difficulty: "Easy",
            question: "Interest on debentures is shown in the financial statements as:",
            options: ["A finance cost — a charge against profit", "An appropriation of profit", "A liability of the company", "A reserve"],
            answerIndex: 0,
            explanation: "Finance cost in the Statement of Profit and Loss — payable even when the company makes a loss."
          },
          {
            id: 6, difficulty: "Hard",
            question: "Debentures of ₹1,00,000 were issued at a discount of ₹5,000 and are redeemable at a premium of ₹15,000. The loss on issue written off is:",
            options: ["₹20,000", "₹5,000", "₹15,000", "₹1,20,000"],
            answerIndex: 0,
            explanation: "Loss on issue = discount ₹5,000 + premium payable on redemption ₹15,000 = ₹20,000."
          },
          {
            id: 7, difficulty: "Medium",
            question: "In the case above, if the Securities Premium Reserve holds ₹8,000, the amount charged to the profit and loss account is:",
            options: ["₹12,000", "₹20,000", "₹8,000", "₹5,000"],
            answerIndex: 0,
            explanation: "₹20,000 − ₹8,000 = ₹12,000. The springs is used first, up to its balance; the remainder is a financial cost."
          },
          {
            id: 8, difficulty: "Easy",
            question: "A bank is advanced a loan of ₹2,00,000 by a company and debentures of ₹2,50,000 are handed over as collateral. The company should:",
            options: ["Make no entry for the debentures — disclose them; record only the loan", "Record debentures of ₹2,50,000 as a liability", "Cancel the loan and record ₹2,50,000", "Record ₹50,000 as premium"],
            answerIndex: 0,
            explanation: "Collateral security: no money or value is received against the debentures, so they are disclosed, not entered."
          },
          {
            id: 9, difficulty: "Easy",
            question: "Bearer debentures differ from registered debentures in that they are:",
            options: ["Transferable by delivery, with interest paid to the holder of the coupon", "Recorded in a register of members", "Never carrying interest", "Issued only at par"],
            answerIndex: 0,
            explanation: "Bearer instruments move by delivery; registered ones transfer only through the company's prescribed procedure."
          },
          {
            id: 10, difficulty: "Medium",
            question: "Debentures issued to a vendor for purchase of machinery worth ₹4,00,000 should be recorded at:",
            options: ["The agreed value of the consideration received — ₹4,00,000", "The face value of the debentures whatever it is", "The market price of the debentures", "A nominal ₹1"],
            answerIndex: 0,
            explanation: "Consideration other than cash is recorded at the agreed value of what the company actually received."
          }
        ],

        activity: {
          type: "calc",
          title: "Debenture Issue & Interest Bench",
          instruction: "Work each problem exactly as the working note should appear in the exam. Every figure is checked before the bench reveals its own calculation.",
          problems: [
            {
              prompt: "A company issued 2,000 debentures of ₹100 each at ₹95. Find the cash proceeds and the discount on issue.",
              inputs: [
                { key: "proc", label: "Cash proceeds (₹)", placeholder: "e.g. 190000" },
                { key: "disc", label: "Discount on issue (₹)", placeholder: "e.g. 10000" }
              ],
              answers: { proc: 190000, disc: 10000 },
              formula: "Proceeds = N × Issue price · Discount = N × (Face − Issue)",
              working: "2,000 × 95 = <b>₹1,90,000</b> received; discount 2,000 × 5 = <b>₹10,000</b> — a loss on issue to be written off."
            },
            {
              prompt: "1,500 debentures of ₹100 each were issued at ₹105. Find the premium credited and the total money received.",
              inputs: [
                { key: "proc", label: "Total money received (₹)", placeholder: "e.g. 157500" },
                { key: "prem", label: "Premium credited (₹)", placeholder: "e.g. 7500" }
              ],
              answers: { proc: 157500, prem: 7500 },
              formula: "Premium = N × (Issue − Face)",
              working: "1,500 × 105 = <b>₹1,57,500</b>; premium 1,500 × 5 = <b>₹7,500</b> to Securities Premium Reserve."
            },
            {
              prompt: "Interest at 12% p.a. on 600 debentures of ₹100 each is payable half-yearly. Find one half-year's interest and the annual charge.",
              inputs: [
                { key: "half", label: "Half-year interest (₹)", placeholder: "e.g. 3600" },
                { key: "year", label: "Annual interest (₹)", placeholder: "e.g. 7200" }
              ],
              answers: { half: 3600, year: 7200 },
              formula: "Interest = N × r × months ÷ 12",
              working: "60,000 × 12% × 6/12 = <b>₹3,600</b> per half-year; annual = 60,000 × 12% = <b>₹7,200</b>, a finance cost."
            },
            {
              prompt: "Debentures of ₹1,00,000 were issued at a discount of ₹5,000 and are redeemable at a premium of ₹15,000. The Securities Premium Reserve holds ₹8,000. Find the loss on issue, the amount absorbed from the springs, and the charge to profit and loss.",
              inputs: [
                { key: "loss", label: "Total loss on issue (₹)", placeholder: "e.g. 20000" },
                { key: "spr", label: "Written off from springs (₹)", placeholder: "e.g. 8000" },
                { key: "pl", label: "Charged to profit and loss (₹)", placeholder: "e.g. 12000" }
              ],
              answers: { loss: 20000, spr: 8000, pl: 12000 },
              formula: "Loss on issue = Discount + Premium on redemption; write off springs first",
              working: "Loss = 5,000 + 15,000 = <b>₹20,000</b>; springs absorbs <b>₹8,000</b>; the remaining <b>₹12,000</b> is a financial cost in the profit and loss account."
            },
            {
              prompt: "A vendor is issued 4,000 debentures of ₹100 each against machinery valued at ₹3,80,000. Find the discount recognised at issue.",
              inputs: [
                { key: "disc", label: "Discount on issue (₹)", placeholder: "e.g. 20000" }
              ],
              answers: { disc: 20000 },
              formula: "Discount = Face value issued − Value received",
              working: "Face 4,00,000 − value received 3,80,000 = <b>₹20,000</b> discount, written off as loss on issue."
            }
          ]
        },

        examCases: [
          {
            id: 1,
            title: "The discount issue",
            passage: "A company issued 4,000 debentures of ₹100 each at ₹95, carrying interest at 12% per annum payable half-yearly on 30 September and 31 March. The debentures were fully subscribed on 1 April and all payments were received on time. The company's Securities Premium Reserve stood at ₹10,000.",
            difficulty: "Hard",
            subs: [
              {
                q: "Cash received on the issue:",
                options: ["₹3,80,000", "₹4,00,000", "₹4,20,000", "₹20,000"],
                answerIndex: 0,
                reasoning: "4,000 × 95 = ₹3,80,000."
              },
              {
                q: "Discount on issue to be written off:",
                options: ["₹20,000", "₹4,00,000", "₹10,000", "₹2,000"],
                answerIndex: 0,
                reasoning: "4,000 × (100 − 95) = ₹20,000, a loss on issue."
              },
              {
                q: "Interest payable on 30 September (first half-year):",
                options: ["₹24,000", "₹48,000", "₹12,000", "₹2,000"],
                answerIndex: 0,
                reasoning: "4,00,000 × 12% × 6/12 = ₹24,000 — a finance cost of the first half-year."
              }
            ]
          }
        ],

        examNumericals: [
          {
            id: 1, q: "2,000 debentures of ₹100 each issued at ₹95. Net cash proceeds (₹).",
            value: 190000,
            explanation: "2,000 × 95 = ₹1,90,000.",
            difficulty: "Easy"
          },
          {
            id: 2, q: "Interest at 14% p.a. on 500 debentures of ₹100 each for one half-year (₹).",
            value: 3500,
            explanation: "50,000 × 14% × 6/12 = ₹3,500.",
            difficulty: "Easy"
          },
          {
            id: 3, q: "Discount ₹10,000 and premium payable on redemption ₹25,000 on a debenture issue. Total loss on issue (₹).",
            value: 35000,
            explanation: "10,000 + 25,000 = ₹35,000, written off from springs first and then as a financial cost.",
            difficulty: "Medium"
          }
        ],

        quickRevision: {
          definition: "Accounting for debentures covers their issue at par, premium or discount, the interest payable to holders as creditors of the company, and the writing off of the loss on issue — with collateral security treated as a disclosure, not an entry.",
          keyPoints: [
            "Debenture holders are creditors — interest is a finance cost, payable even in a loss year.",
            "Issue entries mirror share issues: money due, then received.",
            "Discount on issue is a loss — write it off; it is never an asset.",
            "Loss on issue = discount + premium payable on redemption; absorb from springs first, then profit and loss.",
            "Collateral security: disclose, do not enter — no value is received against those debentures."
          ],
          calculationSteps: [
            "Step 1 — Identify the issue terms: par, premium or discount; compute proceeds and the discount/premium.",
            "Step 2 — Pass the due and receipt entries at the issue price.",
            "Step 3 — Compute loss on issue if the debentures are redeemable at a premium (discount + premium on redemption).",
            "Step 4 — Write off: Securities Premium Reserve first (up to its balance), remainder to profit and loss as a financial cost.",
            "Step 5 — Interest = principal × rate × months ÷ 12, accrued only for the period outstanding; carry it to finance costs."
          ],
          formulas: [
            { label: "Net proceeds", expr: "Debentures × Issue price" },
            { label: "Discount on issue", expr: "Debentures × (Face − Issue price)" },
            { label: "Loss on issue", expr: "Discount + Premium payable on redemption" },
            { label: "Interest", expr: "Principal × Rate × Months ÷ 12" }
          ],
          distinctions: [
            {
              title: "Share capital vs debenture capital",
              head: ["Share capital", "Debenture capital"],
              rows: [
                ["Nature", "Ownership — members' funds", "Debt — a liability of the company"],
                ["Return", "Dividend from divisible profit", "Interest — a charge, payable even in a loss"],
                ["Ranking on winding up", "After creditors and debenture holders", "Ahead of shareholders"],
                ["Balance sheet", "Under shareholders' funds", "Under non-current/current liabilities"]
              ]
            }
          ],
          examPoints: [
            "State the loss-on-issue split explicitly in a long answer — springs first, then profit and loss.",
            "Interest questions: count only the months the debentures were actually outstanding.",
            "Collateral security earns a disclosure sentence in the answer, never an entry."
          ],
          commonMistakes: [
            "Recording collateral-security debentures as a liability.",
            "Leaving discount on issue on the balance sheet instead of writing it off.",
            "Charging the whole loss on issue to profit and loss even when springs has a balance."
          ],
          mnemonic: "DIPS — Discount, Interest, Premium on redemption, Springs-first: the four moving parts of a debenture problem."
        }
      },

      /* ---------- Chapter 9: Financial Statements of a Company ---------- */
      cfin: {
        theory: {
          simple: [
            {
              h: "The Two Statements, and Why They Exist",
              p: "A company's financial statements are the formal record of its economic story: the Statement of Profit and Loss tells what it earned over a period, and the Balance Sheet (the statement of financial position) shows what it held and owed at a date. Schedule III of the Companies Act prescribes their format — the same headings, the same order, the same discipline for every company, so that any reader can compare one with another.",
              list: [
                { term: "Statement of Profit and Loss", def: "Revenue from operations plus other income, less expenses and tax — a flow over a period." },
                { term: "Balance Sheet", def: "Equity and liabilities against assets at a reporting date — a position, not a flow." },
                { term: "Notes to accounts", def: "The narrative behind every figure: sub-headings, accounting policies, and the detail the face of the statement compresses." }
              ]
            },
            {
              h: "Equity and Liabilities — the Order",
              p: "Schedule III reads top to bottom in a strict hierarchy: Shareholders' Funds first (share capital, reserves and surplus, money received against allotment), then Non-Current Liabilities, then Current Liabilities — and on the other side, Non-Current Assets then Current Assets. Each heading is a family: trade payables, other current liabilities, short-term provisions sit inside Current Liabilities; inventories, trade receivables, cash and bank balances and short-term advances inside Current Assets.",
              formula: "Total equity and liabilities = Total assets — the balance sheet balances by construction"
            },
            {
              h: "Revenue, Other Income, and the Line Between Them",
              p: "Revenue from operations is what the company's main business brings — sale of goods or services. Other income is everything legitimate that arrives from outside that flow: interest income, dividend received, profit on the sale of a fixed asset. Both reach profit before tax, but they are shown separately so a reader can see how much of the profit came from the business itself and how much from its surroundings.",
              p2: "In this course the statements exclude exceptional items, extraordinary items and discontinued operations — the syllabus keeps them out of the preparation scope."
            }
          ],
          advanced: [
            {
              h: "From Net Profit to Divisible Profit",
              p: "Net profit before tax is not all available to shareholders. Transfers to reserves reduce what remains, a proposed dividend is set aside, and the residue — divisible profit — is what may legitimately be distributed. The appropriation is a decision about the past year's profit, shown in the notes or the statement as the prescribed format directs, and it always starts from a figure that has already borne its expenses and tax.",
              formula: "Divisible profit = Net profit after tax − Transfers to reserves − Proposed dividend"
            },
            {
              h: "Reading the Statements as a Reader Would",
              p: "A company that shows rising revenue but faster-rising trade receivables is selling on increasingly generous credit. Heavy short-term borrowings inside current liabilities against thin cash and bank balances is a liquidity squeeze. Reserves swollen by transfers year after year is a company that prefers to keep its profits rather than part with them. The statements are not just a compliance product — they are the company's economics written down.",
              p2: "Comparing one year's Schedule III statement with the previous year's turns a static picture into a trend, which is exactly what analysis — the next chapter — is built on."
            },
            {
              h: "Notes to Accounts — the Part That Explains the Rest",
              p: "Every figure on the face of the statements is a summary; the notes carry the detail. Contingent liabilities, commitments, the split of reserves, the basis of depreciation, related-party amounts — all of it lives in the notes. A reader who ignores the notes reads half the accounts; an examiner expects the note references to match the line items exactly.",
              p2: "Notes also carry the accounting policies — the choices the company made where the framework allowed more than one."
            }
          ]
        },

        concepts: [
          { title: "Schedule III", body: "The prescribed format of company financial statements — fixed headings, fixed order, so every company's accounts are comparable." },
          { title: "Revenue from operations", body: "Income from the company's principal business — sale of goods or services — distinguished from other income." },
          { title: "Other income", body: "Legitimate income from outside the main business flow: interest income, dividend received, profit on sale of fixed assets." },
          { title: "Divisible profit", body: "The profit actually available for distribution: net profit after tax, less transfers to reserves and the proposed dividend." }
        ],

        formats: [
          {
            title: "Statement of Profit and Loss — Schedule III skeleton",
            note: "The flow: income, then expenses, then tax.",
            head: ["Part", "Heading", "Amount (₹)"],
            rows: [
              ["Income", "Revenue from operations", "8,00,000"],
              ["Income", "Other income", "40,000"],
              ["Expenses", "Employee benefits expense", "(3,20,000)"],
              ["Expenses", "Other expenses", "(2,80,000)"],
              ["Expenses", "Depreciation and amortisation", "(80,000)"],
              ["Profit", "Profit before tax", "1,60,000"],
              ["Tax", "Current tax", "(40,000)"],
              ["Result", "Profit for the year", "1,20,000"]
            ]
          },
          {
            title: "Balance Sheet — Schedule III skeleton",
            note: "Equity and liabilities on one side, assets on the other — in the prescribed order.",
            head: ["Equity and liabilities", "Amount (₹)", "Assets", "Amount (₹)"],
            rows: [
              ["Shareholders' funds — share capital", "5,00,000", "Non-current assets — PPE", "4,20,000"],
              ["Shareholders' funds — reserves and surplus", "2,40,000", "Current assets — inventories", "1,80,000"],
              ["Non-current liabilities — long-term borrowings", "1,50,000", "Current assets — trade receivables", "2,10,000"],
              ["Current liabilities — trade payables", "1,20,000", "Current assets — cash and bank", "2,00,000"],
              ["Total", "10,10,000", "Total", "10,10,000"]
            ]
          }
        ],

        numericals: [
          {
            id: 1, difficulty: "Easy",
            question: "Revenue from operations ₹8,00,000, other income ₹40,000, expenses ₹6,80,000. Profit before tax:",
            options: ["₹1,60,000", "₹7,60,000", "₹1,20,000", "₹2,00,000"],
            answerIndex: 0,
            explanation: "8,40,000 − 6,80,000 = ₹1,60,000 — both streams of income count, all expenses subtract."
          },
          {
            id: 2, difficulty: "Medium",
            question: "Net profit after tax ₹4,00,000; transfer to general reserve ₹1,00,000; proposed dividend ₹1,20,000. Divisible profit:",
            options: ["₹1,80,000", "₹4,00,000", "₹2,80,000", "₹2,20,000"],
            answerIndex: 0,
            explanation: "4,00,000 − 1,00,000 − 1,20,000 = ₹1,80,000 available for distribution."
          },
          {
            id: 3, difficulty: "Easy",
            question: "Under Schedule III, interest income on investments is shown as:",
            options: ["Other income", "Revenue from operations", "A reserve", "A liability"],
            answerIndex: 0,
            explanation: "It is legitimate, recurring income — but not from the principal business, so it is other income."
          },
          {
            id: 4, difficulty: "Medium",
            question: "Inventories, trade receivables and cash and bank balances appear under:",
            options: ["Current assets", "Non-current assets", "Current liabilities", "Shareholders' funds"],
            answerIndex: 0,
            explanation: "All three are expected to be realised or consumed within the operating cycle — the current assets family."
          },
          {
            id: 5, difficulty: "Easy",
            question: "Share capital and reserves and surplus together form, under Schedule III:",
            options: ["Shareholders' funds", "Non-current liabilities", "Current liabilities", "Current assets"],
            answerIndex: 0,
            explanation: "Shareholders' funds is the first family of equity and liabilities — the owners' stake."
          },
          {
            id: 6, difficulty: "Hard",
            question: "Trade payables ₹1,20,000, other current liabilities ₹60,000, short-term provisions ₹30,000, share capital ₹5,00,000, reserves ₹2,40,000, long-term borrowings ₹1,50,000. Total equity and liabilities:",
            options: ["₹11,00,000", "₹10,70,000", "₹9,80,000", "₹11,30,000"],
            answerIndex: 0,
            explanation: "5,00,000 + 2,40,000 + 1,50,000 + 1,20,000 + 60,000 + 30,000 = ₹11,00,000."
          },
          {
            id: 7, difficulty: "Easy",
            question: "The Balance Sheet of a company shows:",
            options: ["Its financial position at a particular date", "Its profit over a period", "Its cash flows only", "Its tax liability only"],
            answerIndex: 0,
            explanation: "A position statement — a snapshot at the reporting date, not a flow."
          },
          {
            id: 8, difficulty: "Medium",
            question: "Which of the following is EXCLUDED from the statements prepared in this course?",
            options: ["Extraordinary items", "Revenue from operations", "Depreciation", "Other income"],
            answerIndex: 0,
            explanation: "The syllabus scope keeps exceptional, extraordinary and discontinued items out of the statements being prepared."
          },
          {
            id: 9, difficulty: "Medium",
            question: "Notes to accounts serve to:",
            options: ["Disclose the detail, policies and sub-headings behind the face figures", "Replace the balance sheet", "Show only contingent liabilities", "Record day-to-day transactions"],
            answerIndex: 0,
            explanation: "The face compresses; the notes explain — policies, splits, commitments, contingencies."
          },
          {
            id: 10, difficulty: "Hard",
            question: "A company's profit before tax is ₹3,00,000, current tax ₹75,000. It transfers ₹60,000 to a general reserve and proposes a dividend of ₹90,000. Divisible profit:",
            options: ["₹75,000", "₹1,50,000", "₹2,25,000", "₹3,00,000"],
            answerIndex: 0,
            explanation: "After tax: 2,25,000; less reserve 60,000 and proposed dividend 90,000 → ₹75,000 divisible."
          }
        ],

        activity: {
          type: "classify",
          title: "Schedule III Sorter",
          instruction: "Every figure in a company's accounts belongs to a family. Sort each item into its correct Schedule III home — the working appears when every set is placed correctly.",
          sets: [
            {
              title: "Set 1 — Where does each item sit on the Balance Sheet?",
              prompt: "Sort each item into its Balance Sheet family.",
              buckets: ["Shareholders' funds", "Non-current liabilities", "Current liabilities", "Non-current assets", "Current assets"],
              items: [
                { label: "Share capital of ₹5,00,000", bucket: "Shareholders' funds" },
                { label: "Reserves and surplus ₹2,40,000", bucket: "Shareholders' funds" },
                { label: "10% debentures repayable after 3 years — ₹1,50,000", bucket: "Non-current liabilities" },
                { label: "Trade payables ₹1,20,000", bucket: "Current liabilities" },
                { label: "Short-term borrowings from a bank ₹80,000", bucket: "Current liabilities" },
                { label: "Machinery ₹4,20,000", bucket: "Non-current assets" },
                { label: "Inventories ₹1,80,000", bucket: "Current assets" },
                { label: "Trade receivables ₹2,10,000", bucket: "Current assets" }
              ],
              working: "Shareholders' funds first, then liabilities (non-current before current), then assets (non-current before current) — that is the Schedule III order, and it never varies."
            },
            {
              title: "Set 2 — Income or expense in the Statement of Profit and Loss?",
              prompt: "Place each item in its Statement of Profit and Loss home.",
              buckets: ["Revenue from operations", "Other income", "Expense"],
              items: [
                { label: "Sale of products ₹8,00,000", bucket: "Revenue from operations" },
                { label: "Interest income on investments ₹40,000", bucket: "Other income" },
                { label: "Profit on sale of old machinery ₹15,000", bucket: "Other income" },
                { label: "Rent of the godown paid ₹24,000", bucket: "Expense" },
                { label: "Salaries and wages ₹3,20,000", bucket: "Expense" },
                { label: "Carriage outward ₹8,000", bucket: "Expense" },
                { label: "Dividend received from a subsidiary ₹60,000", bucket: "Other income" }
              ],
              working: "Main-business inflows are revenue; everything else legitimate is other income; outflows in earning that profit are expenses. The three streams never mix on the face of the statement."
            },
            {
              title: "Set 3 — Net profit to divisible profit",
              prompt: "Each line either reduces the profit available for distribution or is the starting point itself.",
              buckets: ["Starting point", "Deducted before dividing", "Neither"],
              items: [
                { label: "Net profit after tax ₹4,00,000", bucket: "Starting point" },
                { label: "Transfer to general reserve ₹1,00,000", bucket: "Deducted before dividing" },
                { label: "Proposed dividend ₹1,20,000", bucket: "Deducted before dividing" },
                { label: "Revenue from operations ₹8,00,000 — already inside the net profit", bucket: "Neither" },
                { label: "Depreciation of ₹80,000 — already charged before tax", bucket: "Neither" }
              ],
              working: "Divisible profit = 4,00,000 − 1,00,000 − 1,20,000 = <b>₹1,80,000</b>. Items already inside the net profit are not deducted twice — that is the error this set is built to prevent."
            }
          ]
        },

        examCases: [
          {
            id: 1,
            title: "A company's year in numbers",
            passage: "For the year ended 31 March, a company reported revenue from operations of ₹15,00,000 and other income of ₹60,000. Its expenses were: employee benefits ₹6,00,000, other expenses ₹4,20,000, depreciation ₹1,20,000 and finance costs ₹1,80,000. Current tax for the year was ₹30,000. The company transferred ₹60,000 to general reserve and proposed a dividend of ₹90,000.",
            difficulty: "Hard",
            subs: [
              {
                q: "Total income (revenue plus other income):",
                options: ["₹15,60,000", "₹15,00,000", "₹60,000", "₹16,20,000"],
                answerIndex: 0,
                reasoning: "15,00,000 + 60,000 = ₹15,60,000."
              },
              {
                q: "Profit before tax:",
                options: ["₹2,40,000", "₹2,10,000", "₹3,00,000", "₹5,40,000"],
                answerIndex: 0,
                reasoning: "Expenses total 6,00,000 + 4,20,000 + 1,20,000 + 1,80,000 = 13,20,000; 15,60,000 − 13,20,000 = ₹2,40,000."
              },
              {
                q: "Profit for the year after tax:",
                options: ["₹2,10,000", "₹2,40,000", "₹3,00,000", "₹60,000"],
                answerIndex: 0,
                reasoning: "Profit before tax ₹2,40,000 less current tax ₹30,000 = ₹2,10,000."
              },
              {
                q: "Profit available for distribution (divisible profit):",
                options: ["₹60,000", "₹2,10,000", "₹1,50,000", "₹2,40,000"],
                answerIndex: 0,
                reasoning: "₹2,10,000 − reserve transfer ₹60,000 − proposed dividend ₹90,000 = ₹60,000 — both appropriations come out of the after-tax profit."
              }
            ]
          }
        ],

        examNumericals: [
          {
            id: 1, q: "Revenue from operations ₹12,00,000, other income ₹50,000, expenses ₹10,40,000. Profit before tax (₹).",
            value: 210000,
            explanation: "12,50,000 − 10,40,000 = ₹2,10,000.",
            difficulty: "Easy"
          }
        ],

        quickRevision: {
          definition: "A company's financial statements — the Statement of Profit and Loss and the Balance Sheet in the Schedule III format — record its performance over a period and its position at a date, with notes carrying the detail behind every figure.",
          keyPoints: [
            "Schedule III fixes the headings and their order — every company uses the same skeleton.",
            "Revenue from operations is main-business income; everything else legitimate is other income.",
            "Profit before tax = total income − total expenses; tax follows, then appropriations.",
            "Divisible profit = net profit after tax − reserve transfers − proposed dividend.",
            "Notes to accounts disclose the detail, policies, splits and contingencies behind the face figures.",
            "Exceptional, extraordinary and discontinued items are excluded from the statements prepared in this course."
          ],
          addLessLogic: [
            "Start: Revenue from operations + Other income = Total income.",
            "Less: every expense heading — employee benefits, finance costs, depreciation, other expenses.",
            "Result: Profit before tax.",
            "Less: Current tax → Profit for the year.",
            "Less: Transfers to reserves and the proposed dividend → Divisible profit.",
            "Never deduct an item twice — if it was charged before tax, it stays inside the net profit."
          ],
          formulas: [
            { label: "Profit before tax", expr: "Revenue from operations + Other income − Total expenses" },
            { label: "Profit for the year", expr: "Profit before tax − Current tax" },
            { label: "Divisible profit", expr: "Profit for the year − Reserve transfers − Proposed dividend" },
            { label: "Balance sheet check", expr: "Total equity and liabilities = Total assets" }
          ],
          distinctions: [
            {
              title: "Revenue from operations vs other income",
              head: ["Revenue from operations", "Other income"],
              rows: [
                ["Source", "The principal business", "Outside the principal business"],
                ["Examples", "Sale of goods, services rendered", "Interest income, dividend received, profit on sale of a fixed asset"],
                ["Scale", "Usually the larger stream", "Usually smaller, but watched — it flatters profit"],
                ["Statement line", "Its own heading", "Its own separate heading"]
              ]
            }
          ],
          examPoints: [
            "In a preparation question, lay the Schedule III skeleton first and then drop figures into it — the marks are for the headings as much as the amounts.",
            "Divisible profit workings begin from profit AFTER tax, not before.",
            "Note references must match face items — an examiner looks for that pairing."
          ],
          commonMistakes: [
            "Mixing other income into revenue from operations because both increase profit.",
            "Starting the divisible-profit computation from profit before tax.",
            "Deducting an expense twice — once before tax and again in the appropriation."
          ],
          mnemonic: "ROTI — Revenue, Other income, Tax, then Appropriations: the order in which profit is consumed before anything reaches shareholders."
        }
      }
    },

    /* ================= MIND MAPS ================= */
    mindmaps: {
      sc: {
        center: "Accounting for\nShare Capital",
        branches: [
          {
            label: "The Capital Ladder",
            color: "var(--c-sc)",
            children: ["Authorised → Issued → Subscribed", "→ Called-up → Paid-up", "Each rung a subset of the last", "Balance sheet shows the ladder"]
          },
          {
            label: "Issue at Premium",
            color: "var(--c-gw)",
            children: ["Issue price > Face value", "Premium → Securities Premium Reserve", "Statutory uses only", "Never dividend, never loss-writing"]
          },
          {
            label: "Instalments",
            color: "var(--c-jr)",
            children: ["Application → Allotment → Calls", "Due entry, then receipt entry", "Nothing to capital before called", "Over-subscription: reject excess"]
          },
          {
            label: "Arrears & Advance",
            color: "var(--c-psr)",
            children: ["Arrears = receivable from defaulter", "Advance = liability to shareholder", "No interest in this course", "Advance → call account when due"]
          },
          {
            label: "Forfeiture & Reissue",
            color: "var(--c-adm)",
            children: ["Capital debited to called-up only", "Forfeited = amount actually paid", "Reissue discount from forfeited", "Residue → Capital Reserve"]
          }
        ]
      },
      deb: {
        center: "Accounting for\nDebentures",
        branches: [
          {
            label: "Types",
            color: "var(--c-deb)",
            children: ["Secured / unsecured", "Registered / bearer", "Redeemable terms fixed at issue", "Holders are creditors"]
          },
          {
            label: "Issue",
            color: "var(--c-sc)",
            children: ["Par, premium or discount", "Due then received — like shares", "For consideration: agreed value", "Discount = loss on issue"]
          },
          {
            label: "Interest",
            color: "var(--c-cb)",
            children: ["Fixed rate, half-yearly", "Finance cost — a charge", "Payable in a loss year too", "Principal × rate × months ÷ 12"]
          },
          {
            label: "Loss on Issue",
            color: "var(--c-dep)",
            children: ["Discount + premium on redemption", "Recognised at issue itself", "Springs first, then P&L", "Never left as an asset"]
          },
          {
            label: "Collateral Security",
            color: "var(--c-tb)",
            children: ["Debentures for a loan's security", "No entry — disclosure only", "No value received against them", "Loan repaid → debentures cancelled"]
          }
        ]
      },
      cfin: {
        center: "Financial Statements\nof a Company",
        branches: [
          {
            label: "Schedule III",
            color: "var(--c-cfin)",
            children: ["Prescribed headings & order", "Same skeleton every company", "Comparable across firms", "Face + notes together"]
          },
          {
            label: "Balance Sheet",
            color: "var(--c-fs)",
            children: ["Shareholders' funds first", "Non-current, then current liabilities", "Non-current, then current assets", "A position at a date"]
          },
          {
            label: "Profit and Loss",
            color: "var(--c-adj)",
            children: ["Revenue from operations", "Other income separate", "Expenses → profit before tax", "Tax → profit for the year"]
          },
          {
            label: "Divisible Profit",
            color: "var(--c-pres)",
            children: ["Start after tax", "Less reserve transfers", "Less proposed dividend", "Never deduct twice"]
          },
          {
            label: "Notes to Accounts",
            color: "var(--c-tbase)",
            children: ["Detail behind every line", "Policies and choices", "Contingencies & commitments", "References must match the face"]
          }
        ]
      }
    },

    /* ================= IMPORTANT QUESTIONS ================= */
    importantQuestions: {
      sc: [
        { type: "Short Answer", marks: 3, q: "Distinguish between calls in arrears and calls in advance, stating how each is recorded.",
          answer: "Calls in arrears: money a shareholder fails to pay after a call is made — a receivable of the company; recorded by debiting Calls in Arrears and crediting the call account. Calls in advance: money received before the corresponding call is due — a liability of the company; recorded by crediting Calls in Advance, transferred to the call account only when that call falls due. In this course neither carries interest." },
        { type: "Short Answer", marks: 3, q: "What is meant by forfeiture of shares? On what amount is the Share Forfeited Account credited?",
          answer: "Forfeiture is the cancellation of a defaulting shareholder's shares for non-payment of calls, after due notice. The Share Forfeited Account is credited with only the amount actually paid by that shareholder on the forfeited shares. Share Capital is debited up to the called-up amount only — the unpaid portion goes to Calls in Arrears." },
        { type: "Short Answer", marks: 3, q: "State two permitted uses of the Securities Premium Reserve and one prohibited use.",
          answer: "Permitted: issuing bonus shares; providing for the premium payable on the future redemption of preference shares or debentures. Prohibited: paying dividend to shareholders — the premium is not free money and cannot be distributed as income." },
        { type: "Long Answer", marks: 6, q: "A shareholder holding 1,000 shares of ₹10 each, fully called up, paid only ₹6 per share. The shares were forfeited; later 500 were reissued at ₹8 as fully paid and the rest at ₹10. Show the entries and the capital reserve.",
          answer: "Forfeiture: Share Capital Dr 10,000 / To Share Forfeited 6,000 / To Calls in Arrears 4,000. First reissue: Bank Dr 4,000 + Share Forfeited Dr 1,000 / To Share Capital 5,000 — capital reserve ₹2,000 (forfeited on those 500 = 3,000, less discount 1,000). Second reissue: Bank Dr 5,000 / To Share Capital 5,000 — remaining forfeited ₹3,000 transferred to Capital Reserve. Total capital reserve ₹5,000." },
        { type: "Short Answer", marks: 3, q: "Explain the terms authorised, issued and subscribed capital.",
          answer: "Authorised capital is the maximum the company is permitted to issue under its memorandum. Issued capital is the portion actually offered to the public (or subscribers). Subscribed capital is the part of the issued capital that applicants were allotted — it can be equal to or less than the issued capital, never more." },
        { type: "Long Answer", marks: 6, q: "A company issued 20,000 shares of ₹10 each at ₹12, payable ₹5 on application, ₹4 on allotment (including premium) and ₹3 on first call. Applications were received for 25,000 shares; the excess was rejected and the surplus refunded. Pass the entries up to the receipt of allotment money.",
          answer: "Bank Dr 1,25,000 / To Share Application 1,25,000 (25,000 × 5). Share Application Dr 1,00,000 / To Share Capital 80,000 / To Securities Premium Reserve 20,000; Bank Dr 25,000 / To Share Application 25,000 (refund of excess). Share Allotment Dr 80,000 / To Share Capital 60,000 / To Securities Premium Reserve 20,000; Bank Dr 80,000 / To Share Allotment 80,000." },
        { type: "Short Answer", marks: 3, q: "What are sweat equity shares? Why does an ESOP exist?",
          answer: "Sweat equity shares are shares issued by a company to employees or directors at a concessional price or for a consideration other than cash, in recognition of their knowledge, skills, intellectual property or value additions. An ESOP (employees' stock option plan) grants employees the option to buy shares at a predetermined price, aligning their interests with the company's long-term value." }
      ],
      deb: [
        { type: "Short Answer", marks: 3, q: "What is meant by issue of debentures as collateral security? How is it recorded?",
          answer: "When debentures are handed to a lender merely as additional security for a loan, no money or value is received against them. The company makes no entry for the debentures themselves — it records the loan and discloses the debentures issued as collateral. On repayment of the loan the debentures are cancelled; if the loan is not repaid, the debentures become a real liability." },
        { type: "Short Answer", marks: 3, q: "Distinguish between a share and a debenture.",
          answer: "A share is ownership — a portion of the company's capital; its return is dividend from divisible profit and it ranks last on winding up. A debenture is debt — an acknowledgment of a liability; its return is interest, a charge payable even in a loss year, and holders rank ahead of shareholders on winding up. Share capital is members' funds; debenture capital is a liability." },
        { type: "Short Answer", marks: 3, q: "How is loss on issue of debentures computed and written off?",
          answer: "Loss on issue = discount allowed at issue + premium payable on redemption (when the debentures are redeemable at a premium). Both are recognised at the time of issue itself. The total is written off first out of the Securities Premium Reserve to the extent of its balance, and the remainder is charged to the profit and loss account as a financial cost." },
        { type: "Long Answer", marks: 6, q: "A company issued 5,000 debentures of ₹100 each at ₹95, redeemable at a premium of ₹5. Interest is 12% payable half-yearly. Securities Premium Reserve held ₹10,000. Show the issue entries and the writing off of the loss on issue.",
          answer: "Issue: Debenture Application Dr 4,75,000 / To Bank 4,75,000; Debentures Dr 5,00,000 / To Debenture Application 4,75,000 / To Loss on Issue 25,000. Loss on issue = discount 25,000 + premium on redemption 25,000 = ₹50,000; write off: Securities Premium Reserve Dr 10,000 + Profit and Loss Dr 40,000 / To Loss on Issue 50,000. Interest: Debenture Interest Dr 30,000 / To Bank 30,000 per half-year (5,00,000 × 12% × 6/12), carried to finance costs." },
        { type: "Short Answer", marks: 3, q: "What are registered and bearer debentures?",
          answer: "Registered debentures are transferable only through the company's prescribed instrument and are recorded in the register of debenture holders; interest is paid to the registered holder. Bearer debentures are transferable by mere delivery, interest is paid to whoever presents the coupon, and the company does not know their owners." },
        { type: "Short Answer", marks: 3, q: "Why is interest on debentures shown as a finance cost rather than an appropriation?",
          answer: "Interest on debentures is a contractual obligation of the company to its creditors — it accrues whether or not profit is earned, and is payable even in a loss year. Dividend, by contrast, is an appropriation of profit that depends on divisible profit. Hence interest is a charge against profit, shown under finance costs in the Statement of Profit and Loss." },
        { type: "Long Answer", marks: 6, q: "Explain the accounting for debentures issued to a vendor for purchase of assets, and contrast it with debentures issued as collateral security.",
          answer: "When debentures are issued for consideration other than cash — say to a vendor for machinery — the transaction is recorded at the agreed value of what the company received: Machinery Dr / To Debentures (at the agreed issue value), with any difference between the face value issued and the value received recognised as discount or premium and treated accordingly. When debentures are issued merely as collateral security for a loan, no value is received — no entry is made for them; the loan is recorded and the debentures are disclosed in the accounts. The test is whether the company actually received money or value." }
      ],
      cfin: [
        { type: "Short Answer", marks: 3, q: "What is Schedule III and why does it matter?",
          answer: "Schedule III of the Companies Act prescribes the format of company financial statements — the headings and their order for both the Balance Sheet and the Statement of Profit and Loss. It matters because every company presents its accounts on the same skeleton, making them comparable across firms and across years, and it separates detail between the face of the statements and the notes." },
        { type: "Short Answer", marks: 3, q: "Distinguish between revenue from operations and other income with examples.",
          answer: "Revenue from operations is income from the company's principal business — sale of goods, rendering of services. Other income is legitimate income from outside that flow — interest income, dividend received, profit on the sale of a fixed asset. Both increase profit before tax, but they are shown under separate headings so the quality of the profit is visible." },
        { type: "Short Answer", marks: 3, q: "How is divisible profit computed?",
          answer: "Divisible profit = profit for the year (after tax) − transfers to reserves − proposed dividend. It is the profit actually available for distribution to shareholders. It always starts from the profit AFTER tax, and no item already charged before tax is deducted again." },
        { type: "Long Answer", marks: 6, q: "From the following, prepare the Statement of Profit and Loss up to profit before tax: revenue from operations ₹15,00,000; other income ₹60,000; employee benefits ₹6,00,000; other expenses ₹4,20,000; depreciation ₹1,20,000; finance costs ₹1,80,000.",
          answer: "Total income = 15,00,000 + 60,000 = ₹15,60,000. Total expenses = 6,00,000 + 4,20,000 + 1,20,000 + 1,80,000 = ₹13,20,000. Profit before tax = 15,60,000 − 13,20,000 = ₹2,40,000. The statement lists income first, then each expense heading, then the profit before tax line — the Schedule III order." },
        { type: "Short Answer", marks: 3, q: "What are notes to accounts? Give three items that appear there.",
          answer: "Notes to accounts disclose the detail behind every figure on the face of the statements. They carry accounting policies and the choices made where the framework allowed more than one, the sub-headings and splits of the face items, contingent liabilities, commitments, and related-party information. A figure on the face without its note reference is an incomplete answer." },
        { type: "Long Answer", marks: 6, q: "Prepare the Balance Sheet (extract) under Schedule III: share capital ₹5,00,000; reserves and surplus ₹2,40,000; long-term borrowings ₹1,50,000; trade payables ₹1,20,000; other current liabilities ₹60,000; short-term provisions ₹30,000; PPE ₹4,20,000; inventories ₹1,80,000; trade receivables ₹2,10,000; cash and bank balances ₹2,90,000.",
          answer: "Equity and liabilities: Shareholders' funds (share capital 5,00,000 + reserves and surplus 2,40,000) = 7,40,000; Non-current liabilities — long-term borrowings 1,50,000; Current liabilities — trade payables 1,20,000, other current liabilities 60,000, short-term provisions 30,000 = 2,10,000. Total 11,00,000. Assets: Non-current — PPE 4,20,000; Current — inventories 1,80,000, trade receivables 2,10,000, cash and bank 2,90,000 = 6,80,000. Total 11,00,000. The two totals agree — as they must." },
        { type: "Short Answer", marks: 3, q: "Which items are excluded from the financial statements prepared in this course?",
          answer: "Exceptional items, extraordinary items and discontinued operations are excluded from the statements prepared under this syllabus. The rest of the Schedule III framework applies in full — revenue, other income, expenses, tax, and the prescribed balance sheet families." }
      ]
    },

    /* ================= QUIZ (ids 70061–70090) ================= */
    quiz: [
      { id: 70061, chapter: "sc", difficulty: "Easy",
        q: "The maximum share capital a company is permitted to issue is:",
        options: ["Authorised capital", "Issued capital", "Subscribed capital", "Paid-up capital"],
        answerIndex: 0,
        explanation: "The memorandum's ceiling — printed on the face of the balance sheet." },
      { id: 70062, chapter: "sc", difficulty: "Easy",
        q: "Paid-up capital equals:",
        options: ["Called-up capital less calls in arrears", "Subscribed capital less calls in advance", "Issued capital less discount", "Authorised capital less reserves"],
        answerIndex: 0,
        explanation: "What the company demanded, minus what shareholders failed to pay." },
      { id: 70063, chapter: "sc", difficulty: "Medium",
        q: "On forfeiture of 1,000 shares of ₹10 (₹7 called, ₹5 paid), Share Capital is debited with:",
        options: ["₹7,000", "₹10,000", "₹5,000", "₹2,000"],
        answerIndex: 0,
        explanation: "Debit only up to the called-up amount: 1,000 × ₹7 = ₹7,000 — uncalled capital was never demanded." },
      { id: 70064, chapter: "sc", difficulty: "Medium",
        q: "In the same case, the Share Forfeited Account is credited with:",
        options: ["₹5,000", "₹7,000", "₹10,000", "₹2,000"],
        answerIndex: 0,
        explanation: "Forfeit exactly what was paid: 1,000 × ₹5 = ₹5,000." },
      { id: 70065, chapter: "sc", difficulty: "Hard",
        q: "500 forfeited shares (₹5 paid of ₹7 called) are reissued at ₹8 as fully paid. Capital reserve:",
        options: ["₹1,500", "₹2,500", "₹1,000", "₹500"],
        answerIndex: 0,
        explanation: "Forfeited on those 500 = ₹2,500; discount ₹1,000 → ₹1,500 to capital reserve." },
      { id: 70066, chapter: "sc", difficulty: "Easy",
        q: "Money received from a shareholder before the call is due is recorded as:",
        options: ["Calls in advance", "Calls in arrears", "Share forfeited", "Securities premium"],
        answerIndex: 0,
        explanation: "A liability of the company until the corresponding call falls due." },
      { id: 70067, chapter: "sc", difficulty: "Medium",
        q: "A premium of ₹2 per share on 10,000 shares of ₹10 is credited to:",
        options: ["Securities Premium Reserve", "Capital Reserve", "Profit and Loss", "General Reserve"],
        answerIndex: 0,
        explanation: "Issue premium goes to the springs — with statutory restrictions on its use." },
      { id: 70068, chapter: "sc", difficulty: "Easy",
        q: "Which is a prohibited use of the Securities Premium Reserve?",
        options: ["Paying dividend", "Issuing bonus shares", "Providing premium on future redemption", "Writing off share issue expenses as permitted"],
        answerIndex: 0,
        explanation: "Dividend cannot be paid out of premium — it is not distributable income." },
      { id: 70069, chapter: "sc", difficulty: "Easy",
        q: "Applications for 25,000 shares against an offer of 20,000. The company will:",
        options: ["Allot 20,000 and reject (or refund) the excess", "Allot all 25,000", "Allot 25,000 and reduce the face value", "Reject the whole issue"],
        answerIndex: 0,
        explanation: "Over-subscription: allot within the offer; excess applications are rejected and money refunded." },
      { id: 70070, chapter: "sc", difficulty: "Medium",
        q: "Shares issued to employees at a concessional price for their knowledge and skills are:",
        options: ["Sweat equity shares", "Bonus shares", "Rights shares", "Forfeited shares"],
        answerIndex: 0,
        explanation: "Human contribution recognised in equity — often through an ESOP." },

      { id: 70071, chapter: "deb", difficulty: "Easy",
        q: "Debenture holders of a company are:",
        options: ["Creditors of the company", "Members of the company", "Guarantors of the company", "Trustees of the company"],
        answerIndex: 0,
        explanation: "Debt, not ownership — they receive interest and rank ahead of shareholders." },
      { id: 70072, chapter: "deb", difficulty: "Easy",
        q: "Interest on debentures is:",
        options: ["A charge against profit, payable even in a loss year", "An appropriation of profit", "Payable only from divisible profit", "A reserve item"],
        answerIndex: 0,
        explanation: "Contractual obligation of the creditor — shown under finance costs." },
      { id: 70073, chapter: "deb", difficulty: "Medium",
        q: "2,000 debentures of ₹100 issued at ₹95. Discount on issue:",
        options: ["₹10,000", "₹1,90,000", "₹2,00,000", "₹5,000"],
        answerIndex: 0,
        explanation: "2,000 × 5 = ₹10,000, recognised as loss on issue." },
      { id: 70074, chapter: "deb", difficulty: "Medium",
        q: "Loss on issue of debentures comprises:",
        options: ["Discount on issue plus premium payable on redemption", "Discount only", "Interest plus discount", "Premium on issue plus redemption"],
        answerIndex: 0,
        explanation: "Both are recognised at issue and written off together." },
      { id: 70075, chapter: "deb", difficulty: "Hard",
        q: "Loss on issue ₹30,000; Securities Premium Reserve holds ₹12,000. Charged to profit and loss:",
        options: ["₹18,000", "₹30,000", "₹12,000", "₹6,000"],
        answerIndex: 0,
        explanation: "SPR is used first up to its balance: ₹30,000 − ₹12,000 = ₹18,000, and the remainder is charged as a financial cost." },
      { id: 70076, chapter: "deb", difficulty: "Easy",
        q: "Debentures handed to a bank as collateral security for a loan are:",
        options: ["Disclosed, not entered — no value is received against them", "Recorded as a liability", "Recorded as an asset", "Cancelled immediately"],
        answerIndex: 0,
        explanation: "Collateral is a disclosure matter; the loan itself is the entry." },
      { id: 70077, chapter: "deb", difficulty: "Easy",
        q: "Bearer debentures are transferable:",
        options: ["By delivery", "Only by registered transfer deed", "Only with the company's consent in writing", "By endorsement and registration"],
        answerIndex: 0,
        explanation: "Like currency — whoever holds the instrument owns it." },
      { id: 70078, chapter: "deb", difficulty: "Medium",
        q: "Interest on 500 debentures of ₹100 at 12% p.a. for one half-year:",
        options: ["₹3,000", "₹6,000", "₹1,500", "₹500"],
        answerIndex: 0,
        explanation: "50,000 × 12% × 6/12 = ₹3,000." },
      { id: 70079, chapter: "deb", difficulty: "Medium",
        q: "Debentures issued to a vendor for assets are recorded at:",
        options: ["The agreed value of the consideration received", "Nominal ₹1", "The market price of the debentures always", "The book value of the assets always"],
        answerIndex: 0,
        explanation: "Consideration other than cash — agreed value governs." },
      { id: 70080, chapter: "deb", difficulty: "Easy",
        q: "Debentures differ from shares mainly because they represent:",
        options: ["Debt of the company, with fixed interest", "Ownership with voting rights", "A reserve of the company", "A contingent liability only"],
        answerIndex: 0,
        explanation: "Creditors' capital with a fixed return — the fundamental distinction." },

      { id: 70081, chapter: "cfin", difficulty: "Easy",
        q: "Revenue from operations means income from:",
        options: ["The company's principal business", "Investments made by the company", "Sale of fixed assets", "Borrowings of the company"],
        answerIndex: 0,
        explanation: "Main-business inflows — sale of goods and services." },
      { id: 70082, chapter: "cfin", difficulty: "Easy",
        q: "Interest income on investments is shown under:",
        options: ["Other income", "Revenue from operations", "Shareholders' funds", "Current liabilities"],
        answerIndex: 0,
        explanation: "Legitimate but outside the principal business — hence other income." },
      { id: 70083, chapter: "cfin", difficulty: "Medium",
        q: "Revenue ₹8,00,000, other income ₹40,000, expenses ₹6,80,000. Profit before tax:",
        options: ["₹1,60,000", "₹1,20,000", "₹7,60,000", "₹2,00,000"],
        answerIndex: 0,
        explanation: "8,40,000 − 6,80,000 = ₹1,60,000." },
      { id: 70084, chapter: "cfin", difficulty: "Medium",
        q: "Net profit after tax ₹4,00,000; transfer to reserve ₹1,00,000; proposed dividend ₹1,20,000. Divisible profit:",
        options: ["₹1,80,000", "₹2,80,000", "₹4,00,000", "₹2,20,000"],
        answerIndex: 0,
        explanation: "After tax, then both appropriations: ₹1,80,000 available." },
      { id: 70085, chapter: "cfin", difficulty: "Easy",
        q: "Under Schedule III, trade receivables are classified as:",
        options: ["A current asset", "A non-current asset", "A current liability", "Shareholders' funds"],
        answerIndex: 0,
        explanation: "Expected to be realised within the operating cycle." },
      { id: 70086, chapter: "cfin", difficulty: "Easy",
        q: "Share capital and reserves together form:",
        options: ["Shareholders' funds", "Current liabilities", "Non-current assets", "Other income"],
        answerIndex: 0,
        explanation: "The first family of equity and liabilities." },
      { id: 70087, chapter: "cfin", difficulty: "Medium",
        q: "Notes to accounts disclose:",
        options: ["Policies, splits and contingencies behind the face figures", "Only the cash balance", "Daily transactions", "The auditor's report alone"],
        answerIndex: 0,
        explanation: "The face compresses; the notes explain — and every face figure should have a note reference." },
      { id: 70088, chapter: "cfin", difficulty: "Hard",
        q: "Profit before tax ₹3,00,000; current tax ₹75,000; transfer to reserve ₹60,000; proposed dividend ₹90,000. Divisible profit:",
        options: ["₹75,000", "₹2,25,000", "₹1,50,000", "₹3,00,000"],
        answerIndex: 0,
        explanation: "3,00,000 − 75,000 − 60,000 − 90,000 = ₹75,000." },
      { id: 70089, chapter: "cfin", difficulty: "Easy",
        q: "The Balance Sheet of a company shows:",
        options: ["Its position at a particular date", "Its performance over a period", "Its cash flows for the year", "Its budget for next year"],
        answerIndex: 0,
        explanation: "A snapshot; the Statement of Profit and Loss is the flow." },
      { id: 70090, chapter: "cfin", difficulty: "Medium",
        q: "Which of these is excluded from the statements prepared in this course?",
        options: ["Extraordinary items", "Other income", "Depreciation", "Trade payables"],
        answerIndex: 0,
        explanation: "Exceptional, extraordinary and discontinued items stay outside the syllabus scope." }
    ],

    /* ================= FLASHCARDS (ids 71049–71072) ================= */
    flashcards: [
      { id: 71049, chapter: "sc", front: "Capital ladder in order?", back: "Authorised → Issued → Subscribed → Called-up → Paid-up. Each rung a subset of the one before." },
      { id: 71050, chapter: "sc", front: "Application money formula?", back: "Shares applied × application rate per share — collected before allotment, held in Share Application A/c." },
      { id: 71051, chapter: "sc", front: "Share Capital debited on forfeiture with?", back: "The called-up amount only — never face value. Unpaid part goes to Calls in Arrears." },
      { id: 71052, chapter: "sc", front: "Share Forfeited credited with?", back: "Only the amount actually paid by that shareholder on the forfeited shares." },
      { id: 71053, chapter: "sc", front: "Capital reserve on reissue formula?", back: "Forfeited amount on the reissued shares − discount allowed on their reissue." },
      { id: 71054, chapter: "sc", front: "Calls in advance vs arrears?", back: "Advance: received before the call is due (liability). Arrears: unpaid after the call (receivable). No interest in this course." },
      { id: 71055, chapter: "sc", front: "Securities Premium Reserve — one permitted and one prohibited use?", back: "Permitted: issue of bonus shares. Prohibited: payment of dividend." },
      { id: 71056, chapter: "sc", front: "Sweat equity shares?", back: "Shares issued to employees/directors at a special price for knowledge, skills or value additions — often via an ESOP." },

      { id: 71057, chapter: "deb", front: "Debenture holders are…", back: "Creditors of the company — fixed interest, rank ahead of shareholders on winding up." },
      { id: 71058, chapter: "deb", front: "Interest on debentures — charge or appropriation?", back: "A charge against profit (finance cost) — payable even in a loss year." },
      { id: 71059, chapter: "deb", front: "Loss on issue formula?", back: "Discount on issue + premium payable on redemption (when redeemable at a premium)." },
      { id: 71060, chapter: "deb", front: "How is loss on issue written off?", back: "Securities Premium Reserve first (up to its balance), remainder to profit and loss as a financial cost." },
      { id: 71061, chapter: "deb", front: "Collateral security — entry?", back: "No entry for the debentures; disclose them. Only the loan is recorded. No value is received against collateral debentures." },
      { id: 71062, chapter: "deb", front: "Interest formula?", back: "Principal × Rate × Months ÷ 12 — for the period the debentures were outstanding." },
      { id: 71063, chapter: "deb", front: "Registered vs bearer debentures?", back: "Registered: transfer by prescribed instrument, in the register. Bearer: transfer by delivery, coupon carries the interest." },
      { id: 71064, chapter: "deb", front: "Debentures to a vendor for assets — at what value?", back: "The agreed value of the consideration received; any excess of face over it is discount, written off as loss on issue." },

      { id: 71065, chapter: "cfin", front: "Schedule III prescribes…", back: "The format of company financial statements — headings and order — making every company's accounts comparable." },
      { id: 71066, chapter: "cfin", front: "Revenue from operations vs other income?", back: "Principal business inflows (sales) vs everything else legitimate (interest, dividend, profit on fixed-asset sale)." },
      { id: 71067, chapter: "cfin", front: "Profit before tax formula?", back: "Revenue from operations + other income − total expenses." },
      { id: 71068, chapter: "cfin", front: "Divisible profit formula?", back: "Profit for the year (after tax) − transfers to reserves − proposed dividend." },
      { id: 71069, chapter: "cfin", front: "Balance sheet families in order?", back: "Equity and liabilities: shareholders' funds → non-current → current. Assets: non-current → current." },
      { id: 71070, chapter: "cfin", front: "Where do inventories, receivables, cash sit?", back: "Current assets — realised or consumed within the operating cycle." },
      { id: 71071, chapter: "cfin", front: "What do notes to accounts carry?", back: "Policies, sub-headings, splits, contingencies and commitments — the detail behind every face figure." },
      { id: 71072, chapter: "cfin", front: "Items excluded from the statements in this course?", back: "Exceptional items, extraordinary items and discontinued operations." }
    ]
  });
})();
