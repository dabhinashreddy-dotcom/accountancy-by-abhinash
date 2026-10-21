/* ============================================================
   guided-learning.js — v94 LEARN → UNDERSTAND → PRACTISE →
   REMEMBER guided learning system (Accountancy By Abhinash).

   Loaded after classes.js + theory-upgrade.js and before app.js.

   PART DATA (below, pushed onto window.GUIDED_PARTS): one entry
   per chapter (Class 11 data keys: intro, terms, tbase, basis,
   equation, debitCredit, journal, ledger, cashBook, specialBooks2,
   brs, gst, tb, dep, pres, roe, fs, adj; Class 12 ids: pf, gw,
   psr, adm, ret, dis, sc, deb, cfin, fsa, rat, cf, ca) carrying:

     hook        the engaging opening question/scenario that opens
                 the redesigned chapter Introduction
     connects    { before?, after? } genuine links to earlier and
                 later chapters (absent when no real link exists)
     readiness   { q, options, answer, explain } the lightweight
                 pre-theory check (never blocks the lesson)
     checkpoint  [question ids] from this chapter's own practice
                 bank, placed as an understanding checkpoint at
                 the end of the advanced theory surface
     recall      { intro?, items: [{ q, a }] } the attempt-first
                 recall set that closes the Remember stage
     diagrams    [{ after, type, caption, ... }] purposeful visual
                 explanations anchored to an EXACT theory block
                 heading (or the sentinel "intro-end" for chapters
                 whose intro has no block list — ledger only)

   The APPLIER merges onto APP_DATA[key].guide (purely additive:
   without part data every chapter renders exactly as before).

   window.GuidedLearn is the pure helper API — stage plans, stage
   state computation, id mapping and diagram HTML building. No DOM
   state, no localStorage, no XP: app.js owns all of that. This
   keeps the learning rules testable in Node exactly like
   ui-features.js does for XP.

   No backend, no API, no network: every byte is local data.
   ============================================================ */
(function () {
  "use strict";

  var w = window;
  w.GUIDED_PARTS = w.GUIDED_PARTS || [];

  /* ==========================================================
     PART 1 — Class 11 chapters 1-6
     (intro, terms, tbase, basis, equation, debitCredit)
     ========================================================== */
  w.GUIDED_PARTS.push({
    intro: {
      hook: "A neighbourhood tea stall moves thousands of rupees every month — milk, rent, wages, chai sales — and at year-end its owners often cannot say what they actually earned. How does a business ever answer that question reliably?",
      connects: {
        after: "Everything you meet later stands on this chapter. The Accounting Equation (Ch.5) and the rules of Debit and Credit (Ch.6) grow from one idea — every transaction has two equal sides — and the Journal, Ledger, Cash Book and financial statements are the recording system you will build from Ch.7 onwards."
      },
      readiness: {
        q: "Riya's father says, 'Our shop earned ₹4 lakh this year.' Riya wonders how anyone can know that, when the shop also owns a godown full of stock. Where does that number really come from?",
        options: [
          "The owner remembers every rupee that came in and went out, then subtracts.",
          "The business keeps written records of its transactions, and profit is worked out from those records.",
          "The government estimates the shop's profit from the number of customers it serves."
        ],
        answer: 1,
        explain: "Accounting exists because human memory cannot be trusted with money: transactions are written down first, and profit is calculated from those records. The first option is exactly the problem accounting solves (a year of cash movements cannot be held in anyone's head), and the third is wrong because nobody outside the business counts its customers to fix its profit."
      },
      checkpoint: [1, 8, 22],
      recall: {
        intro: "Close the notes for a moment. Write each answer from memory first — the reveal only measures you if you actually tried.",
        items: [
          { q: "In your own words, what is accounting and why does a business need it?", a: "Accounting is the process of identifying, recording, classifying and summarising financial transactions of a business, and communicating the results to interested users. A business needs it because memory and guesswork cannot reliably tell profit, position or tax liability across a year of thousands of transactions." },
          { q: "Name the users of accounting information and split them into two groups.", a: "Internal users: owners, managers, employees of the business. External users: creditors, lenders, investors, government, tax authorities, researchers and the general public. Internal users run the business; external users decide whether to deal with it." },
          { q: "What are the two basic accounting characteristics a set of accounts must have?", a: "Reliability — the information must be verifiable, free from bias and faithfully represent what happened. Relevance — it must be capable of influencing decisions, helping users predict outcomes and confirm (or correct) earlier expectations." },
          { q: "Put the accounting process stages in order, from transaction to communication.", a: "Identify the transaction, Record in the Journal, Classify in the Ledger, Summarise through Trial Balance and Final Accounts, Analyse the figures, Communicate the results to users." },
          { q: "What does the Balance Sheet show, and when is it prepared?", a: "The Balance Sheet shows what the business owns (assets), what it owes (liabilities) and the owner's claim (capital) on a particular date — usually 31 March. Unlike the other statements it is a position statement for one day, not a performance statement for a period." }
        ]
      },
      diagrams: [
        {
          after: "The Accounting Process, Stage by Stage",
          type: "flow",
          caption: "The accounting process — each stage prepares the facts for the next one.",
          steps: [
            { t: "Identify", d: "Is this a financial transaction?" },
            { t: "Record", d: "Journal, in date order" },
            { t: "Classify", d: "Ledger, by account" },
            { t: "Summarise", d: "Trial balance + statements" },
            { t: "Analyse", d: "Find the meaning" },
            { t: "Communicate", d: "Tell the users" }
          ]
        },
        {
          after: "From Raw Entries to Financial Statements",
          type: "flow",
          caption: "How a year of thousands of entries compresses into a handful of statements.",
          steps: [
            { t: "Journal", d: "every transaction, by date" },
            { t: "Ledger", d: "grouped under accounts" },
            { t: "Trial Balance", d: "debits = credits check" },
            { t: "Financial Statements", d: "P&L + Balance Sheet" }
          ]
        }
      ]
    },

    terms: {
      hook: "Every accounting question you will ever face is built from about twenty words — capital, assets, liability, revenue, expense, stock, debtor, creditor. Learn what each one really means and the whole subject starts speaking your language; guess at them and every sentence stays ambiguous.",
      connects: {
        after: "This vocabulary is what every later chapter operates on: the Accounting Equation (Ch.5) arranges capital, assets and liabilities, and the Journal and Ledger (Ch.7, Ch.8) name their accounts using exactly these words."
      },
      readiness: {
        q: "Goods worth Rs.2,000 are taken home by the owner for personal use. In the books of the business, this:",
        options: [
          "Increases Sales, because goods left the shop",
          "Decreases Capital, through Drawings",
          "Reduces Purchases, since the goods came back out",
          "Is not recorded until the year ends"
        ],
        answer: 1,
        explain: "Money or goods taken for personal use is Drawings — a charge against the owner's own claim, so capital falls. It is not a sale (no revenue was earned by giving goods to oneself) and not a purchase reversal. The same logic runs in reverse: what the owner puts in is capital, what the owner takes out is drawings."
      },
      checkpoint: [1, 11, 22],
      diagrams: [
        {
          after: "Revenue, Expense and Income: the Story of One Sale",
          type: "steps",
          caption: "One sale, told in three words — the distinction every markscheme tests.",
          items: [
            { t: "Revenue first", d: "the full Rs.1,000 the customer paid is revenue — the shop's earnings from operations" },
            { t: "Match the expense", d: "the Rs.700 cost of those goods is the expense of earning that revenue, in the same period" },
            { t: "Income remains", d: "revenue minus matched expense = Rs.300 income — what the sale actually added" }
          ]
        },
        {
          after: "Four Timing Terms: Outstanding, Prepaid, Accrued, and Advance",
          type: "table",
          caption: "The four timing twins — each one a real event on the wrong side of the year-end line.",
          head: ["Term", "What it actually is"],
          rows: [
            ["Outstanding expense", "incurred this year, still unpaid — salary due for March, paid in April"],
            ["Prepaid expense", "paid this year, belongs to next — insurance for 12 months paid in October"],
            ["Accrued income", "earned this year, not yet received — commission earned but not collected"],
            ["Income received in advance", "received this year, not yet earned — rent taken for next month's premises"]
          ]
        }
      ],
      recall: {
        intro: "These five definitions are the alphabet of the subject. Write yours from memory first, then compare.",
        items: [
          { q: "Define a transaction in accounting terms, and give an example of something that is NOT one.", a: "A transaction is an economic event, measurable in money, that changes the financial position of the business and is supported by documentary evidence — a credit purchase of goods is one. A promise to buy next month, or a price rise in unsold stock, is not recorded: no money event has happened yet." },
          { q: "Capital, assets, liabilities — state the equation between them and one example of each.", a: "Assets equal Capital plus Liabilities. Capital is the owner's stake (cash invested at opening), an asset is a resource with future benefit (the delivery scooter), a liability is an amount owed to outsiders (the bank loan). Everything the business holds is funded either by the owner or by creditors." },
          { q: "What is the difference between revenue and income?", a: "Revenue is the total earned from normal operations — goods sold, services rendered. Income is what remains after the costs of earning that revenue are deducted. Revenue of Rs.1,00,000 carrying a cost of goods of Rs.70,000 leaves an income of Rs.30,000." },
          { q: "Debtor and creditor — who is who, and what makes each one?", a: "A debtor owes the business money, typically because goods were sold to them on credit — they received value first and pay later. A creditor is owed money by the business, typically because goods were bought from them on credit — they gave value first and are paid later." },
          { q: "Explain closing stock and where it sits in the accounts.", a: "Closing stock is the value of goods unsold on a given date. It appears as a current asset in the Balance Sheet, and on the credit side of the Trading Account, where it removes the cost of unsold goods from this period's cost of goods sold — the cost belongs to the next period, when the goods are actually sold." }
        ]
      }
    },

    tbase: {
      hook: "Two shopkeepers with identical businesses can show different profits — not from cheating, but from different assumptions about when revenue counts, how long the business will last, and what counts as a number. This chapter is the rulebook that stops accounts meaning whatever their author wants.",
      connects: {
        before: "The vocabulary of Ch.2 — capital, assets, revenue, expenses — is the raw material these rules operate on.",
        after: "Every following chapter applies this base: the Journal records on accrual logic, the adjustment chapter applies matching at year end, and the Bases of Accounting chapter (Ch.4) takes the cash-versus-accrual question to its full depth."
      },
      readiness: {
        q: "A firm takes machinery on credit in March and pays in April; it makes a credit sale in May and receives the money in July. Under the accounting logic this chapter defends, when does each event belong?",
        options: [
          "Both belong to the month they actually happened — March and May",
          "Machinery to April, sale to July — when cash moved",
          "Machinery to March, sale to July",
          "Neither is recorded until the cash is settled"
        ],
        answer: 0,
        explain: "Accrual logic records events when they occur, not when cash moves: the machinery becomes the firm's in March (a liability is born with it) and the sale is May's revenue (a debtor is born with it). This is exactly why a theory base exists — without it, the same year could be told two honest-looking ways."
      },
      checkpoint: [4, 10, 23],
      diagrams: [
        {
          after: "GAAP & the Fundamental Accounting Assumptions",
          type: "table",
          caption: "The three assumptions every set of accounts silently rests on.",
          head: ["Fundamental assumption", "What it assumes"],
          rows: [
            ["Going Concern", "the business keeps operating for the foreseeable future — no plans to liquidate, so assets hold values, not fire-sale prices"],
            ["Consistency", "the same methods are followed year after year unless there is a genuine reason to change"],
            ["Accrual", "revenues and expenses are recognised when earned or incurred, not when cash moves"]
          ]
        },
        {
          after: "Entity, Money & Time",
          type: "table",
          caption: "Three boundary decisions: where the business ends, what counts as a number, how a life becomes years.",
          head: ["Concept", "What it means for your books"],
          rows: [
            ["Business Entity", "the business is separate from its owner — personal assets and personal expenses never enter the books"],
            ["Money Measurement", "only events expressible in money are recorded — skill and reputation stay out until they have a price"],
            ["Accounting Period", "the business's indefinite life is cut into standard years so performance can be compared"]
          ]
        }
      ],
      recall: {
        intro: "Theory-base questions are definition questions — and definitions are pure memory. Attempt before revealing.",
        items: [
          { q: "What is GAAP, and why does it exist?", a: "Generally Accepted Accounting Practices — the umbrella of rules, conventions and procedures that accountants follow so accounts speak one common language. Without it, two firms could prepare profits by private logic and nobody could meaningfully compare them." },
          { q: "State the three fundamental accounting assumptions.", a: "Going Concern — the business is assumed to continue operating indefinitely with no intention of liquidation. Consistency — the same methods are followed period to period unless there is a sound reason to change. Accrual — revenues and expenses are recognised when earned or incurred, not when cash is received or paid." },
          { q: "What is the entity assumption, and what does it prevent?", a: "The business is treated as an identity separate from its owner. It prevents a fatal mixing: the owner's house is not the business's asset, and shop money spent on the owner's family is not a business expense — it is drawings, charged against capital." },
          { q: "What is money measurement, and what does it keep out of the books?", a: "Only transactions and events measurable in money are recorded. It keeps out real facts that matter but have no price yet — staff skill, brand reputation, a court case still undecided — which is exactly why the notes to the accounts exist." },
          { q: "Explain conservatism, with its classic maxim.", a: "Conservatism, or prudence: anticipate no profit, but provide for all possible losses. Closing stock is valued at the lower of cost or market price; a likely loss is recorded today while a likely gain waits for certainty. It shields users from inflated expectations." }
        ]
      }
    },

    basis: {
      hook: "In June the tea stall paid twelve months' insurance at once, and in July collected four months of old dues. Ask its profit for the year and the answer swings by thousands depending on one question: does money moving decide the year, or does earning decide it? That question is this whole chapter.",
      connects: {
        before: "The theory base of Ch.3 introduced accrual as an assumption; this chapter opens it up fully — and the terms of Ch.2 (expense, income, outstanding, prepaid) are its raw material.",
        after: "The four year-end adjustments practised here are exactly the ones the adjustment chapter (Ch.18) applies inside final accounts, and every one of them keeps the accounting equation of Ch.5 balanced."
      },
      readiness: {
        q: "A business pays Rs.12,000 as insurance in October, covering the next 12 months. What happens under the cash basis this year, and what should happen under accrual?",
        options: [
          "Cash: nothing; Accrual: the full Rs.12,000 as expense",
          "Cash: Rs.12,000 as expense; Accrual: only the months belonging to this year",
          "Both: the full Rs.12,000 as this year's expense",
          "Both: nothing until the policy ends"
        ],
        answer: 1,
        explain: "Cash basis simply records the payment — Rs.12,000 leaves, so Rs.12,000 is the year's expense, even though nine months of that cover belong to next year. Accrual splits it: this year carries only its own months, and the rest sits on the Balance Sheet as a prepaid expense. Same payment, two different profits."
      },
      checkpoint: [2, 9, 19],
      diagrams: [
        {
          after: "Cash Basis vs. Accrual Basis — Key Differences",
          type: "compare",
          caption: "The same year, two profit figures — the difference is only about timing.",
          head: ["Cash Basis", "Accrual Basis"],
          rows: [
            ["Records only when cash actually moves", "Records when earned or incurred, cash or not"],
            ["Simple — matches the cash book exactly", "More work — needs year-end adjustments"],
            ["Profit swings with payment timing", "Profit reflects the period's actual operations"],
            ["Used by very small businesses", "Required by companies and the accounting standards"]
          ],
          diff: "Same transactions, same year — two honest-looking profits, purely because each system admits an event in a different month."
        },
        {
          after: "The Four Year-End Adjustments at a Glance",
          type: "table",
          caption: "Four adjustments, two directions each — what belongs to this side of the year line and what does not.",
          head: ["Adjustment", "Meaning at year end"],
          rows: [
            ["Outstanding expenses", "incurred this year, still unpaid — added to this year's expense, shown as a liability"],
            ["Prepaid expenses", "paid this year, belongs to next — removed from this year's expense, shown as an asset"],
            ["Accrued income", "earned this year, not yet received — added to this year's income, shown as an asset"],
            ["Income received in advance", "received this year, not yet earned — removed from this year's income, shown as a liability"]
          ]
        }
      ],
      recall: {
        intro: "Adjustment logic is where easy marks live — and where carelessness costs most. Attempt all five honestly.",
        items: [
          { q: "Define cash basis and accrual basis in one sentence each.", a: "Cash basis records revenues and expenses only when cash is actually received or paid. Accrual basis records them when earned or incurred regardless of cash movement — which is why accrual needs year-end adjustments and cash basis does not." },
          { q: "Salary of Rs.15,000 for March is unpaid at year end. Treatment under accrual, and under cash?", a: "Under accrual the March salary is this year's expense — an outstanding expense, charged in the Profit and Loss Account and shown as a liability in the Balance Sheet. Under cash basis nothing is recorded in March; the expense appears in April, when it is actually paid." },
          { q: "Insurance of Rs.12,000 paid for 12 months, 3 of them next year — the accrual treatment?", a: "Only this year's nine months — Rs.9,000 — is charged as expense. The remaining Rs.3,000 is a prepaid expense: a current asset in the Balance Sheet that reduces next year's insurance charge." },
          { q: "Why can cash-basis profit be artificially high in one year and low in another?", a: "Because it follows the calendar of cash, not the calendar of work. A year in which old dues are collected looks rich and a year in which large payments fall looks poor, even when both years' actual operations were identical." },
          { q: "Which basis must companies in India follow, and why?", a: "Companies must follow the accrual basis, as required by the Companies Act and enforced through the accounting standards. Accrual reports what a period's operations actually earned — the figure investors, lenders and the tax system need; cash timing alone would make comparison meaningless." }
        ]
      }
    },

    equation: {
      hook: "A business begins with Rs.1,00,000 cash. It buys a scooter, takes a loan, sells goods, pays rent — and through all of it one sentence never stops being true: what the business owns equals what it owes plus the owner's claim. The accounting equation is that sentence, and this chapter makes it do your arithmetic.",
      connects: {
        before: "Capital, assets and liabilities from Ch.2 are the three words this equation is built from, and the assumptions of Ch.3 (entity, accrual) decide what counts.",
        after: "The rules of Debit and Credit (Ch.6) are this equation's logic written as rules, and every Journal entry (Ch.7) is a transaction's effect on this equation."
      },
      readiness: {
        q: "A firm has assets of Rs.2,50,000 and the owner's capital is Rs.1,80,000. How much does it owe outsiders — and which single line answers it?",
        options: [
          "Rs.70,000, from Assets minus Capital",
          "Rs.1,80,000, from Capital minus Assets",
          "Rs.2,50,000, the total assets",
          "Rs.4,30,000, assets plus capital"
        ],
        answer: 0,
        explain: "Rearranged, the equation reads Liabilities = Assets − Capital: Rs.2,50,000 − Rs.1,80,000 = Rs.70,000 owed to outsiders. Everything the business holds is funded by exactly two sources — what creditors put in and what the owner put in — so removing the owner's share leaves the creditors' share."
      },
      checkpoint: [1, 31, 61],
      diagrams: [
        {
          after: "The expanded equation",
          type: "equation",
          caption: "The whole chapter in one line — every transaction keeps this sentence true.",
          terms: [
            { t: "Assets", d: "what the business owns" },
            { t: "Liabilities", d: "what it owes outsiders" },
            { t: "Capital", d: "the owner's claim" }
          ],
          ops: ["=", "+"],
          note: "Profit raises capital and a loss lowers it; drawings lower it; fresh investment raises it. Nothing a business does can move one term without moving another to match."
        },
        {
          after: "Setting Up: the Column Method",
          type: "table",
          caption: "A business opens: Rs.1,00,000 cash capital, then furniture bought for Rs.20,000 cash.",
          head: ["Event", "Assets", "Liabilities", "Capital"],
          rows: [
            ["Started with cash", "Cash 1,00,000", "—", "1,00,000"],
            ["Bought furniture for cash", "Cash 80,000 + Furniture 20,000", "—", "1,00,000"]
          ]
        }
      ],
      recall: {
        intro: "Equation questions are won by memory of the patterns, not by fresh thinking each time. Attempt first, then check.",
        items: [
          { q: "State the accounting equation and define each term.", a: "Assets equal Liabilities plus Capital. Assets are resources owned that give future benefit; Liabilities are amounts owed to outsiders; Capital is the owner's claim — the difference between the two, also called net worth." },
          { q: "Why can the equation never break, whatever the transaction?", a: "Because every transaction either changes both sides equally (a loan raises cash and liabilities together) or reshuffles one side (cash becomes furniture). The equality is structural — an entry that seems to break it has simply missed one of its effects." },
          { q: "Owner starts with Rs.70,000 cash and a Rs.20,000 loan to buy machinery. What is capital?", a: "Assets are cash Rs.70,000 plus machinery Rs.20,000 — Rs.90,000. Liabilities are the Rs.20,000 loan. Capital is therefore Rs.70,000 — exactly what the owner personally brought in; the loan-funded part of the machinery belongs to the creditors' share." },
          { q: "What increases capital, and what reduces it, besides profit and loss?", a: "Additional capital introduced by the owner increases it; drawings — cash or goods taken for personal use — reduce it. Interest on capital adds to the owner's claim as a business expense, and interest on drawings reduces it." },
          { q: "Goods worth Rs.5,000 taken for personal use — the effect on the equation?", a: "Drawings rise by Rs.5,000 so capital falls by the same amount, and the goods leave the business as stock so assets fall by Rs.5,000. Both sides shrink equally and the equation holds — the owner has simply taken part of the business home." }
        ]
      }
    },

    debitCredit: {
      hook: "Debit and credit have no native meaning — no debit is inherently good or bad, money-in or money-out. They are a left column and a right column whose meaning depends entirely on which account you are standing in. Learn the one grid that decides it, and the fear of these two words disappears.",
      connects: {
        before: "The accounting equation of Ch.5 supplies the modern logic directly: debit and credit are that equation's two sides, applied account by account.",
        after: "Every Journal entry (Ch.7) is decided here, every Ledger posting (Ch.8) repeats it, and the classification skill of this chapter is exactly what the Trial Balance (Ch.13) assumes you already have."
      },
      readiness: {
        q: "Rs.3,000 rent is paid in cash. Under the modern approach, which account is debited — and why?",
        options: [
          "Cash, because money went out of the box",
          "Rent Expense, because an expense increased",
          "Capital, because the owner's money paid it",
          "None — cash payments are not journalised"
        ],
        answer: 1,
        explain: "The modern approach asks two questions per transaction: which accounts are involved, and did each one increase or decrease. Rent Expense increased, so it is debited; Cash decreased, so it is credited. 'Money out means credit' is only a consequence of that grid, never the reason."
      },
      checkpoint: [4, 13, 25],
      diagrams: [
        {
          after: "The three Golden Rules",
          type: "table",
          caption: "The traditional rules — one line per account class.",
          head: ["Account class", "The rule"],
          rows: [
            ["Personal", "Debit the receiver, credit the giver"],
            ["Real", "Debit what comes in, credit what goes out"],
            ["Nominal", "Debit all expenses and losses, credit all incomes and gains"]
          ]
        },
        {
          after: "The Modern Approach, tied to the equation",
          type: "table",
          caption: "The modern grid — every entry you will ever write fits one of these rows.",
          head: ["Account type", "Debit it when", "Credit it when"],
          rows: [
            ["Asset", "it increases", "it decreases"],
            ["Liability", "it decreases", "it increases"],
            ["Capital (owner's claim)", "it decreases — drawings", "it increases — investment or profit"],
            ["Income / Gain", "— it is reversed or reduced", "it is earned"],
            ["Expense / Loss", "it is incurred", "— it is reversed or reduced"]
          ]
        }
      ],
      recall: {
        intro: "The grid takes ten seconds to recall and decides every entry in the paper. Attempt these from memory — no half-remembering allowed.",
        items: [
          { q: "State the three golden rules of the traditional approach.", a: "Personal account: debit the receiver, credit the giver. Real account: debit what comes in, credit what goes out. Nominal account: debit all expenses and losses, credit all incomes and gains." },
          { q: "Give the modern approach rules for assets and liabilities.", a: "Assets are debited when they increase and credited when they decrease. Liabilities mirror them: debited when they decrease, credited when they increase. Capital follows the liability pattern — credited by investment and profit, debited by drawings." },
          { q: "Why is a credit purchase of goods debited to Purchases rather than only to the supplier?", a: "Because two effects occur: the purchases expense rises and the supplier's balance owed rises. The modern view debits the increased expense and credits the increased liability; the traditional view credits the giver of the goods. Both describe the same two-sided fact." },
          { q: "What is a representative personal account, with two examples?", a: "A nominal account that stands for a person or group of persons: Outstanding Salary, Provision for Discount on Debtors, Prepaid Insurance. They are treated like personal accounts — outstanding salary is debited (a person owes us), prepaid insurance is debited (the insurer owes us the unexpired cover)." },
          { q: "In the entry Drawings A/c to Cash A/c, what does each side tell you?", a: "Drawings is debited because the owner's personal claim against the business increased — value left for private use. Cash is credited because an asset decreased. Read this way, every entry tells its own story: the debit shows what gained, the credit shows what gave." }
        ]
      }
    }
  });

  /* ==========================================================
     PART 2 — Class 11 chapters 7-12
     (journal, ledger, cashBook, specialBooks2, brs, gst)
     ========================================================== */
  w.GUIDED_PARTS.push({
    journal: {
      hook: "At 6 pm a steel trader's son sits with a daybook, writing the day's forty transactions in the order they happened — date, parties, amounts. Nothing has been classified yet; nothing summarised. That first honest writing-down is the Journal, and every number your final accounts will ever show begins here.",
      connects: {
        before: "The Accounting Equation (Ch.5) and the rules of Debit and Credit (Ch.6) do all the deciding; the Journal is simply where you apply them on paper, in date order.",
        after: "Every entry you write here is posted to the Ledger (Ch.8), cash entries find the Cash Book (Ch.9), and the year's entries end up summarised in the Trial Balance and Final Accounts (Ch.13, Ch.17)."
      },
      readiness: {
        q: "Neha's boutique bought a sewing machine worth Rs.45,000 on credit from a supplier. No cash moved that day. Where should this transaction be recorded FIRST?",
        options: [
          "In the Cash Book, because the machine cost money",
          "In the Journal, as one dated entry with two equal sides",
          "In the Ledger, under the machine's own account",
          "In the year-end Balance Sheet only"
        ],
        answer: 1,
        explain: "The Journal (day book) is the first book of entry: every transaction is written down in date order the moment it happens, whether or not cash moves. The Cash Book cannot show it because no cash or bank amount changed hands; the Ledger comes later, when the entry is posted; and the Balance Sheet is a year-end summary, never the place a transaction is first recorded."
      },
      checkpoint: [8, 13, 25],
      diagrams: [
        {
          after: "The five columns",
          type: "table",
          caption: "The five columns of a Journal entry and what each one carries.",
          head: ["Column", "What goes in it"],
          rows: [
            ["Date", "the day the transaction happened"],
            ["Particulars", "the accounts involved: debit entry first, credit entry prefixed with To, plus a one-line narration"],
            ["L.F.", "the ledger page number, filled in after posting"],
            ["Debit (Dr.)", "the amount charged to the debited account"],
            ["Credit (Cr.)", "the amount credited — always equal to the debit"]
          ]
        },
        {
          after: "Trade discount and cash discount — two very different things",
          type: "compare",
          caption: "Trade discount and cash discount look similar on paper and behave completely differently in the books.",
          head: ["Trade discount", "Cash discount"],
          rows: [
            ["Deduction from list price for bulk or trade reasons", "Deduction granted for paying promptly"],
            ["Never recorded — entries are made net of it", "Recorded, through Discount Allowed or Discount Received"],
            ["Appears only on the invoice", "Has its own ledger account"],
            ["Same whatever the payment date", "Exists only if payment happens in time"]
          ],
          diff: "One changes the price before the transaction is even recorded; the other is a separate incentive attached to the timing of payment."
        }
      ],
      recall: {
        intro: "Close the notes for a moment. These answers should come from memory — an honest blank tells you exactly what to revise next.",
        items: [
          { q: "What is a Journal, in one sentence, and when is an entry made in it?", a: "The Journal is the book of original entry in which every financial transaction is recorded in chronological order, on the date it happens, before it is posted anywhere else." },
          { q: "Name the five columns of a Journal and what each carries.", a: "Date; Particulars (debit account first, then the credit account prefixed with To, followed by a brief narration); Ledger Folio (the page reference, filled at posting time); Debit amount; Credit amount. The debit and credit amounts of one entry are always equal." },
          { q: "Why does a narration matter if it is never posted?", a: "The narration is the one-line explanation written under the entry. It is not posted to any ledger account, but it is the only record of what the entry was for — months later, when nobody remembers, the narration is what makes the entry readable and auditable." },
          { q: "State the difference between trade discount and cash discount in your own words.", a: "Trade discount is a reduction from list price granted for bulk or trade reasons and is never recorded — the entry is made net of it. Cash discount is a reduction granted for prompt payment; it is recorded through the Discount Allowed or Discount Received account." },
          { q: "What is a compound entry, and when do you write one?", a: "A compound entry is a single journal entry with two or more accounts on one or both sides, used when one transaction affects several accounts at once — for example, paying a rent bill that partly belongs to the proprietor. One tidy entry with equal totals replaces several separate ones." }
        ]
      }
    },

    ledger: {
      hook: "Ask a shopkeeper how much Ramesh owes and they will not open the daybook — they will flip to Ramesh's page. The Journal remembers the year by date; the Ledger retells it by account, so any one question can be answered in seconds. That flipping-to-one-page is what this chapter teaches.",
      connects: {
        before: "Every line you post here comes from a Journal entry (Ch.7) — the debit side of the entry becomes a To posting, the credit side a By posting.",
        after: "Balanced ledger accounts feed the Trial Balance (Ch.13), which feeds the Final Accounts (Ch.17); the Cash Book (Ch.9) is itself a ledger-shaped book for cash and bank."
      },
      readiness: {
        q: "After a year of transactions, which single book would you open to know exactly how much a particular customer owes you right now?",
        options: [
          "The Journal, read from January to March",
          "The Ledger, the customer's own account page",
          "The Balance Sheet, the assets side",
          "The Trial Balance, the debit column"
        ],
        answer: 1,
        explain: "The Ledger is the book of classified accounts: each person and item gets one page carrying the running effect of every transaction that concerns it, ending in a balance. The Journal records by date and cannot answer a person-specific question without reading the whole year; the Balance Sheet and Trial Balance summarise totals, and neither shows one customer's story."
      },
      checkpoint: [1, 13, 29],
      diagrams: [
        {
          after: "intro-end",
          type: "steps",
          caption: "How one Journal entry travels into two ledger accounts.",
          items: [
            { t: "Take the debited account", d: "In its ledger account, post on the CREDIT side: To (name of the credit account)" },
            { t: "Take the credited account", d: "In its ledger account, post on the DEBIT side: By (name of the debited account)" },
            { t: "Carry the amounts unchanged", d: "Posting moves facts between books; it never alters them" },
            { t: "Update the L.F.", d: "Write the ledger page number back into the Journal so the trail can be walked both ways" }
          ]
        }
      ],
      recall: {
        intro: "No notes allowed. Attempt each answer in writing, then reveal — the gap between attempt and answer is where the revision list writes itself.",
        items: [
          { q: "What is a Ledger, and how does it differ from the Journal?", a: "The Ledger is the principal book containing all accounts, where transactions are classified by account rather than by date. The Journal records transactions chronologically as they happen; the Ledger collects, under one page per account, every entry that affects it and ends in a balance." },
          { q: "What does posting mean?", a: "Posting is the process of transferring the debit and credit amounts of a journal entry into the respective ledger accounts — the debited account receives a To posting on its credit side, and the credited account receives a By posting on its debit side." },
          { q: "State the four posting rules for a simple two-account entry.", a: "In the account that was debited in the Journal, post on its credit side as To (credit account name). In the account that was credited, post on its debit side as By (debit account name). The amounts stay identical, and each posting carries its date and a journal reference." },
          { q: "What is balancing an account, and what does the balance represent?", a: "Balancing is footing both sides, writing the difference on the shorter side so both sides total equally, and carrying the balance down as the opening of the next period. The balance represents the net position of that account — what it owes, is owed, or holds." },
          { q: "Why can the Ledger answer questions the Journal cannot?", a: "Because it is classified, not chronological: one page collects the whole story of one account. Asking how much a creditor is owed is a lookup on that page; in the Journal the same answer would require reading and adding a year of scattered entries." }
        ]
      }
    },

    cashBook: {
      hook: "In a kirana shop the cash box and the passbook are the two books the owner actually trusts. The Cash Book is where every rupee — cash or bank — is written down the day it moves, in columns of coming and columns of going. Miss a line here and the Bank Reconciliation chapter will find it.",
      connects: {
        before: "The debit-credit rules of Ch.6 and the entry-writing habit of the Journal (Ch.7) decide every line: a Cash Book line is simply a journal entry split into columns.",
        after: "Bank Reconciliation (Ch.11) exists because the bank keeps its own copy of your bank column; GST (Ch.12) supplies the tax lines on many of these very entries; and petty cash is the small-change extension of this same book."
      },
      readiness: {
        q: "Rs.5,000 rent is paid by cheque. In a two-column Cash Book, where does this entry belong?",
        options: [
          "Credit side, cash column",
          "Credit side, bank column",
          "Debit side, bank column",
          "Debit side, cash column"
        ],
        answer: 1,
        explain: "A cheque moves money through the bank, so the BANK column carries it — and every payment is written on the credit side, because credit is where money-out lives in a Cash Book. The cash column stays untouched: no notes and coins left the box."
      },
      checkpoint: [14, 17, 21],
      diagrams: [
        {
          after: "Contra entries — when both cash and bank are affected",
          type: "taccount",
          caption: "Rs.20,000 cash deposited into the bank — one movement, both sides of the Cash Book, marked Contra.",
          left: { h: "Debit side (money in)", rows: [["To Cash A/c — cash deposited into bank", "20,000"]] },
          right: { h: "Credit side (money out)", rows: [["By Bank A/c — the same Rs.20,000 leaving the cash box", "20,000"]] },
          note: "Both sides carry the same amount because the money only changed boxes inside the firm. The entry is marked Contra (C) so it is never mistaken for an outside transaction."
        },
        {
          after: "What never enters the Cash Book",
          type: "table",
          caption: "Transactions that look like money movement but belong to other books.",
          head: ["Transaction", "Where it is actually recorded"],
          rows: [
            ["Trade discount on a credit purchase", "Nowhere as a separate entry — the purchase is recorded net"],
            ["Cash discount for prompt payment", "Journal Proper, via Discount Allowed or Discount Received"],
            ["Cheque received after banking hours", "Cheque in Hand account, until it is banked the next day"],
            ["Post-dated cheque received", "Memorandum only — recorded when the date actually arrives"],
            ["Issued cheque returned as not paid", "Bank column reversed, plus the party's account reinstated"]
          ]
        }
      ],
      recall: {
        intro: "Attempt from memory before revealing. The point is not to feel clever — it is to find, honestly, which of these five you would lose marks on.",
        items: [
          { q: "What is a Cash Book, and what two roles does it play?", a: "The Cash Book records all cash and bank receipts and payments in date order. It is simultaneously a subsidiary book (it replaces the Journal for cash transactions) and a principal book (it stands in for the Cash and Bank ledger accounts)." },
          { q: "What makes an entry contra, and how is it treated?", a: "An entry is contra when the same transaction affects both the cash and the bank sides of the Cash Book — cash deposited into or withdrawn from the bank. It appears on both sides of the Cash Book, is marked Contra (C), and posts in the ledger only to the account genuinely affected." },
          { q: "Why is cash discount never entered in the Cash Book?", a: "Because it is not a movement of cash or bank money at the moment of the transaction. It arises only when an account is settled, so it is recorded in the Journal Proper through Discount Allowed or Discount Received, and the Cash Book records only the net amount actually paid or received." },
          { q: "Explain the imprest system of petty cash.", a: "A fixed sum — the imprest — is handed to the petty cashier at the start of a period. He spends it on small expenses against vouchers, and at period end the head cashier reimburses exactly the amount spent, restoring the float to its original figure. Overspending becomes visible instantly, because the float is always the same." },
          { q: "What is a bank overdraft, and where does it appear in the Cash Book?", a: "An overdraft is a negative bank balance — the firm has withdrawn more than it held and owes the bank. In a two-column Cash Book it shows as a credit (excess) balance in the bank column, and reconciling it is one of the standard starting points in a BRS." }
        ]
      }
    },

    specialBooks2: {
      hook: "A garment wholesaler files hundreds of bills a month. Filing them by type — purchases here, sales there, returns in their own register — is not tidiness for its own sake; it is what makes one month's totals possible in minutes. Those registers are this chapter.",
      connects: {
        before: "The Journal (Ch.7) and the subsidiary-book idea of the Cash Book chapter (Ch.9): these books exist because the Journal alone cannot carry a trader's daily volume.",
        after: "Each register's period total posts as ONE amount to its ledger account, and those totals are exactly what the Trial Balance (Ch.13) and the Trading Account of the Final Accounts (Ch.17) expect to see."
      },
      readiness: {
        q: "Ravi Furnishings buys office furniture worth Rs.85,000 on credit. Furniture is not the goods it sells. Which book records this purchase?",
        options: [
          "Purchases Book",
          "Sales Book",
          "Journal Proper",
          "Cash Book"
        ],
        answer: 2,
        explain: "Only the credit purchase of goods meant for resale or production enters the Purchases Book. Furniture is a fixed asset, not stock-in-trade, so the transaction goes to the Journal Proper like any other non-routine entry. This one-word test — is it goods the firm trades in? — decides most placement answers in this chapter."
      },
      checkpoint: [1, 13, 5, 23],
      diagrams: [
        {
          after: "Choosing the right book — the three-question test",
          type: "steps",
          caption: "Three questions that place almost any transaction in the right book.",
          items: [
            { t: "Is it goods the business trades in?", d: "No — straight to the Journal Proper, whatever else is true" },
            { t: "Purchase or sale, cash or credit?", d: "Credit purchases go to the Purchases Book, credit sales to the Sales Book; cash transactions go to the Cash Book" },
            { t: "Is something coming back or going back?", d: "Goods returning from a customer — Sales Return Book; goods returning to a supplier — Purchases Return Book" }
          ]
        },
        {
          after: "Returns — which way are the goods flowing?",
          type: "compare",
          caption: "The two return books, side by side — named by the movement of goods, not of money.",
          head: ["Returns Outward (Purchase Return)", "Returns Inward (Sales Return)"],
          rows: [
            ["Goods flow OUT — back to the supplier", "Goods flow IN — back from the customer"],
            ["Supplied goods were defective or not per order", "Sold goods were defective or not per order"],
            ["A debit note is issued to the supplier", "A credit note is issued to the customer"],
            ["Entered in the Purchases Return Book", "Entered in the Sales Return Book"],
            ["Reduces the purchases total", "Reduces the sales total"]
          ],
          diff: "Outward and inward name the movement of the GOODS — which is why the naming feels reversed if you keep thinking only about cash."
        }
      ],
      recall: {
        intro: "Five placement questions worth of memory. Write your answer first; reveal only when you have committed to something.",
        items: [
          { q: "Which credit transactions enter the Purchases Book, and which do not?", a: "Only credit purchases of goods the business buys for resale or for use in production. Cash purchases go to the Cash Book, credit purchases of fixed assets such as furniture or machinery go to the Journal Proper, and every other credit transaction goes to the Journal Proper as well." },
          { q: "What is a debit note, and when is it issued?", a: "A debit note accompanies returned goods and informs the supplier that their account has been debited — because the return reduces what we owe them. It is filed with the Purchases Return Book." },
          { q: "What is a credit note?", a: "A credit note is issued to a customer when goods are returned, informing them that their account has been credited — the return reduces what they owe us. It is filed with the Sales Return Book." },
          { q: "How does a Sales Book differ from a Sales Account?", a: "The Sales Book is a register of credit sales, one row per invoice. The Sales Account is the ledger account that receives the Sales Book's period total as a single posting. The book records the pieces; the account records the sum." },
          { q: "Why do purchases and sales totals post as single amounts instead of transaction by transaction?", a: "Because the subsidiary books exist to reduce ledger clutter. At period end each register's total is posted once to its account, while the individual parties are posted separately to their own accounts from the same books — the ledger gets totals for items and details for people." }
        ]
      }
    },

    brs: {
      hook: "Your passbook says Rs.42,300; the cash book says Rs.38,800. Neither is wrong — they are two diaries of the same money, written at slightly different moments. Bank Reconciliation is the page where the two diaries are compared line by line until every rupee of the difference is explained.",
      connects: {
        before: "The bank column of the Cash Book (Ch.9) is the half of this story you control; the pass book is the bank's half. Everything reconciled here is a timing or recording gap between those two.",
        after: "Reconciled figures keep the final accounts free of double counting, and the error category of differences is exactly what the Rectification of Errors chapter (Ch.16) later repairs."
      },
      readiness: {
        q: "Cheques worth Rs.6,000 have been issued to suppliers but not yet presented to the bank. Starting from the Cash Book balance, how does this appear on a BRS?",
        options: [
          "Add Rs.6,000",
          "Less Rs.6,000",
          "It does not appear at all",
          "Add only the cheque charges"
        ],
        answer: 0,
        explain: "The firm reduced its cash book the day the cheques were written; the bank has not paid them yet, so the pass book balance stands HIGHER. Starting from the cash book, you add Rs.6,000 to arrive at the pass book figure. Every BRS item is this one move: find which book already knows about the item, then push the other book towards it."
      },
      checkpoint: [1, 7, 14],
      diagrams: [
        {
          after: "The four-step method",
          type: "steps",
          caption: "The four steps that solve any BRS question.",
          items: [
            { t: "Fix your starting point", d: "Cash Book balance, Pass Book balance, or an overdraft — the question always says which" },
            { t: "List every cause given", d: "Each item is one reason the two balances differ; write each down with its amount" },
            { t: "Apply the one rule", d: "Item already in the starting book but not the other — adjust towards the other balance" },
            { t: "Arrive and check", d: "The final figure must equal the other book's balance; if it does not, one item moved the wrong way" }
          ]
        },
        {
          after: "Why the Same Item Flips Direction",
          type: "compare",
          caption: "The same five items, reversed, purely because the starting book changed.",
          head: ["Starting from Cash Book balance", "Starting from Pass Book balance"],
          rows: [
            ["Cheque issued, not presented — Add", "Cheque issued, not presented — Less"],
            ["Cheque deposited, not collected — Add", "Cheque deposited, not collected — Less"],
            ["Bank charges debited by bank — Less", "Bank charges debited by bank — Add"],
            ["Interest allowed by bank — Add", "Interest allowed by bank — Less"],
            ["Own cheque dishonoured — Less", "Own cheque dishonoured — Add"]
          ],
          diff: "The item never changes; only the book you are standing in changes — and the direction is always the one that moves you towards the OTHER balance."
        }
      ],
      recall: {
        intro: "Reconciliation logic decays fast without use. Attempt each from memory — especially the direction rules; they are where marks leak.",
        items: [
          { q: "What is a Bank Reconciliation Statement?", a: "A statement that explains, with amounts, every difference between the balance shown by the firm's cash book bank column and the balance shown by the bank's pass book on the same date, carrying one figure to the other." },
          { q: "State the one rule behind every add or less decision.", a: "Adjust according to which book already records the item: if it is in the starting book but not yet in the other, move the starting balance towards the other book's figure. The item's nature never decides the direction — the starting point does." },
          { q: "Why do cheques issued but not presented make the two balances differ?", a: "The cash book is reduced on the day of issue; the bank pays only when the cheque is presented, days later. In that window the cash book shows less and the pass book shows more, and the difference equals the value of such cheques." },
          { q: "What is meant by a cheque dishonoured, and how does it affect a BRS?", a: "A cheque deposited earlier is returned by the bank unpaid — insufficient funds or similar reason. The bank reverses the credit, so the pass book falls below the cash book; starting from the cash book, the amount is lessed." },
          { q: "What can a BRS NOT do by itself?", a: "It cannot correct anything. A BRS only explains and quantifies the differences; actual correction happens through entries — the amended cash book records bank-initiated items first, and genuine errors are rectified through the error-rectification process." }
        ]
      }
    },

    gst: {
      hook: "The price of a Rs.250 t-shirt is the same at two shops, yet one shopkeeper sends more tax to the government than the other — because he only pays tax on the value HE added. GST is that chain of value, and this chapter teaches you to read any GST invoice backwards, from the total to the tax to the rate.",
      connects: {
        before: "The trade and cash discount ideas from the Basic Terms chapter (Ch.2) decide where your taxable value starts, and the journal-entry rules of Ch.6 and Ch.7 write every GST entry here.",
        after: "The input and output tax balances computed in this chapter become real ledger accounts that appear in the final accounts, and the invoice-reading skill is the direct foundation of Class 12 company-accounting questions."
      },
      readiness: {
        q: "A shop sells goods worth Rs.10,000 to a buyer in the same state; GST is 18%. How much does the buyer hand over in total?",
        options: [
          "Rs.10,000",
          "Rs.10,180",
          "Rs.11,800",
          "Rs.10,900"
        ],
        answer: 2,
        explain: "18% of Rs.10,000 is Rs.1,800 of GST, charged on top of the taxable value — the buyer pays Rs.11,800 in total. Inside that sit Rs.900 CGST for the central government and Rs.900 SGST for the state. The shopkeeper does not keep the Rs.1,800; it is collected for the governments, which is why GST never becomes the seller's income."
      },
      checkpoint: [3, 6, 22],
      diagrams: [
        {
          after: "Input Tax Credit — why tax on tax disappears",
          type: "steps",
          caption: "How ITC makes each stage pay tax only on its own value.",
          items: [
            { t: "Manufacturer buys inputs", d: "pays GST on raw materials — this becomes INPUT tax" },
            { t: "Adds value and sells forward", d: "charges GST on the higher price — this is OUTPUT tax" },
            { t: "Pays only the difference", d: "output tax minus input tax goes to the government — the tax on tax is gone" },
            { t: "The chain continues", d: "for the next buyer, your output is their input, all the way to the final consumer" }
          ]
        },
        {
          after: "CGST, SGST and IGST — Which One Applies?",
          type: "compare",
          caption: "The same 18% rate, split or whole, decided by one line in the question.",
          head: ["Intra-state — same state", "Inter-state — different states"],
          rows: [
            ["CGST (Centre) plus SGST (State)", "IGST (Integrated) alone"],
            ["18% becomes 9% CGST + 9% SGST", "18% stays 18% IGST"],
            ["Both governments share directly", "Collected centrally, then apportioned"],
            ["Invoice shows two tax lines", "Invoice shows one IGST line"]
          ],
          diff: "The place of supply is what decides it — the moment buyer and seller sit in different states, the split disappears and IGST replaces the pair."
        }
      ],
      recall: {
        intro: "GST questions in exams are speed questions. Speed comes from memory — attempt all five before revealing a single answer.",
        items: [
          { q: "What does GST stand for, and what kind of tax is it?", a: "Goods and Services Tax — a comprehensive, multi-stage, destination-based indirect tax levied on value added at every stage of the supply chain, with input tax credit making each stage pay only on its own value addition." },
          { q: "What is input tax, and what is output tax?", a: "Input tax is the GST a business pays when it purchases goods or services for its business. Output tax is the GST it collects when it sells. At the end of a tax period the business pays the government output tax minus input tax." },
          { q: "Where is trade discount adjusted in a GST calculation?", a: "Trade discount is deducted BEFORE GST is computed. The GST rate applies to the net invoiced value after trade discount, never to the list price — charging GST on the list price is one of the most common numerical errors in exams." },
          { q: "When are CGST and SGST charged instead of IGST?", a: "When the supplier and the place of supply are in the same state — an intra-state supply — CGST and SGST are charged at half the GST rate each. For inter-state supplies, IGST is charged at the full rate instead." },
          { q: "What does an inclusive-of-GST invoice value mean, and how do you find the taxable value?", a: "It means the quoted figure already contains the tax. The taxable value is the inclusive amount divided by (100 plus rate) over 100 — for Rs.10,620 at 18%, that is 10,620 divided by 1.18, giving Rs.9,000, on which Rs.1,620 of GST was charged." }
        ]
      }
    }
  });

  /* ==========================================================
     PART 3 — Class 11 chapters 13-18
     ========================================================== */
  w.GUIDED_PARTS.push({
    tb: {
      hook: "The totals agree — Rs.92,450 on both sides — and the clerk feels safe. Yet a Rs.5,000 furniture purchase sits happily inside the Purchases account and the books still agree perfectly. A Trial Balance is the profession's honesty check, but it only checks arithmetic. This chapter teaches you exactly what it promises — and exactly what it cannot.",
      connects: {
        before: "The debit and credit classification of Ch.6 is the raw skill here — every figure you list is one account's net position under those same rules.",
        after: "Balanced totals are the licence to prepare Final Accounts (Ch.17), and every one-sided difference you chase here is practised again in Rectification of Errors (Ch.16)."
      },
      readiness: {
        q: "A Trial Balance extracted on 31 March shows equal totals of Rs.92,000. A classmate declares the accounts now error-free. What is the correct reply?",
        options: [
          "Agree — equal totals prove the ledger is correct",
          "Disagree — agreement proves arithmetic equality only; many errors survive it",
          "Disagree — but only because closing stock has not been recorded",
          "Agree — provided every entry came through the Journal"
        ],
        answer: 1,
        explain: "Agreement only proves that the double effect was maintained in total. A complete omission, a wrong account treated on both sides, two compensating errors, or an original entry written with the wrong amount — all of these keep debits equal to credits. The Trial Balance is necessary evidence, never a certificate of accuracy."
      },
      checkpoint: [1, 15, 17],
      diagrams: [
        {
          after: "Three Methods of Extracting a Trial Balance",
          type: "steps",
          caption: "Three ways to reach the same balances — and why one of them dominates exams.",
          items: [
            { t: "Balance method", d: "post every account, strike its closing balance, list it as debit or credit — the exam default" },
            { t: "Totals method", d: "total each account's two sides and list the heavier total — quick, but hides the net figures the statements need" },
            { t: "List method", d: "an assistant totals each account and hands over a list of balances; the accountant only compiles" }
          ]
        },
        {
          after: "The Core Trial Balance Rule",
          type: "table",
          caption: "Where each balance normally lands — memorise this grid and half the chapter's questions answer themselves.",
          head: ["Normally a DEBIT balance", "Normally a CREDIT balance"],
          rows: [
            ["Expenses, losses and all purchases", "Income, gains and all sales"],
            ["Drawings and Purchase Returns (Returns Outward)", "Capital, reserves and the year's profit"],
            ["Debtors, bills receivable and every account with a debit closing balance", "Creditors, bills payable, bank overdraft and every credit closing balance"],
            ["Sales Returns (Returns Inward) — a contra-credit account", "Provision for Depreciation and similar contra-debit accounts"]
          ]
        }
      ],
      recall: {
        intro: "Trial balance questions are quick in exams only if this list is memory, not reasoning. Attempt first, reveal second.",
        items: [
          { q: "What does the agreement of a Trial Balance prove, and what does it not prove?", a: "It proves that every debit had an equal credit when posted and that the arithmetic of the totals is correct. It does not prove that transactions were recorded at all, recorded in the right accounts, recorded with the right amounts, or free from fraud — agreement is equality, not truth." },
          { q: "Why is the balance method of extraction preferred in examinations?", a: "Because the final accounts need closing balances, not grand totals. The balance method produces exactly the figures the Trading Account, Profit and Loss Account and Balance Sheet consume, and a totals error can never travel forward into the statements." },
          { q: "What is a suspense account, and when does it close?", a: "A temporary account opened when the Trial Balance disagrees, carrying the difference on the short side so the totals agree and work can continue. Each rectified one-sided error clears part of it, and it closes for good only when the balance returns to exactly zero." },
          { q: "Name four kinds of error that an agreeing Trial Balance cannot detect.", a: "Complete omission — the transaction never entered the books. Error of principle — a capital item posted to a revenue account. Compensating errors — two mistakes of equal size cancelling out. An original entry recorded with the wrong amount but posted consistently on both sides." },
          { q: "A debtor of Rs.4,500 was correctly totalled but listed as Rs.450 in the Trial Balance. What kind of error is this?", a: "A transcription error in the summary itself: the ledger is right and the list is wrong, so a one-sided difference of Rs.4,050 appears. Because only one side moved, the suspense account and the difference-locating tests are the tools that find it." }
        ]
      }
    },

    dep: {
      hook: "A delivery van bought for Rs.6,00,000 still runs after eight years but is worth almost nothing on resale. The business paid once, yet the van served eight years of deliveries — depreciation is the discipline of charging that one cost across the years that actually used it. Learn both methods and their entries here, and every final accounts question gets easier.",
      connects: {
        before: "The matching idea from the Theory Base (Ch.3) is the philosophy of this chapter: the cost belongs to the years the asset helps earn revenue, not to the payment date.",
        after: "Every charge computed here appears in the final accounts (Ch.17), and provision for depreciation balances are adjusted again in the Adjustments chapter (Ch.18)."
      },
      readiness: {
        q: "A machine costing Rs.60,000 with no residual value is depreciated at 15% p.a. under the straight line method. What is the annual charge?",
        options: [
          "Rs.9,000",
          "Rs.6,000",
          "Rs.15,000",
          "Rs.10,000"
        ],
        answer: 0,
        explain: "SLM charges the same amount every year: 15 percent of the original cost — Rs.9,000 — for each year of useful life. The rate applies to cost, never to the falling book value, and that single habit separates the two methods before a single number is computed."
      },
      checkpoint: [3, 13, 29],
      diagrams: [
        {
          after: "Depreciation vs. Depletion vs. Amortisation",
          type: "table",
          caption: "Three words for one idea — spreading cost — aimed at three different kinds of asset.",
          head: ["Applies to", "The idea in one line"],
          rows: [
            ["Depreciation — tangible fixed assets like plant, machinery and buildings", "Wear, time and use reduce the asset's ability to serve"],
            ["Depletion — natural resources like mines, quarries and oil wells", "Each unit extracted physically reduces the reserve, so cost falls with extraction"],
            ["Amortisation — intangible assets like patents, trademarks and software", "The legal or competitive life simply runs out, so cost is written off over that term"]
          ]
        },
        {
          after: "SLM vs. WDV — Key Differences",
          type: "table",
          caption: "The same Rs.1,00,000 machine at 10 percent, watched across three years under each method.",
          head: ["Year", "SLM — charge, book value", "WDV — charge, book value"],
          rows: [
            ["First", "Charge 10,000 — book value 90,000", "Charge 10,000 — book value 90,000"],
            ["Second", "Charge 10,000 — book value 80,000", "Charge 9,000 — book value 81,000"],
            ["Third", "Charge 10,000 — book value 70,000", "Charge 8,100 — book value 72,900"]
          ],
          diff: "The first year is identical; after that SLM stays flat while WDV shrinks — bigger charges early under WDV, smaller later, and profit tells the same story in reverse."
        }
      ],
      recall: {
        intro: "Depreciation is the most reliable numeric question in this unit. Attempt each before revealing — the formulas must come out instantly.",
        items: [
          { q: "Define depreciation and explain why it is charged even though no cash moves that year.", a: "Depreciation is the systematic allocation of the cost of a tangible fixed asset over its useful life. No cash leaves in the charging year, but the asset has been consumed in earning that year's revenue, and the matching principle requires that consumption to be charged against the revenue it helped produce." },
          { q: "State the straight line formula, from useful life and from rate.", a: "From useful life: cost minus residual value, divided by the number of years. From rate: the resulting annual amount divided by cost and expressed as a percentage — or, with no residual value, simply rate percent of original cost. Both routes give the same flat annual charge." },
          { q: "Why does WDV produce a falling charge even though the rate never changes?", a: "Because the rate is applied to the written down value — book value after earlier charges — rather than to original cost. Each year's base is smaller by roughly the rate itself, so the charge falls geometrically: heavy in early years, light in later ones." },
          { q: "What is book value, and how is it computed under the provision method?", a: "Book value, or written down value, is cost minus accumulated depreciation to date. Under the provision method the asset account keeps its original cost while a separate Provision for Depreciation account accumulates every charge, so book value is the difference between those two balances." },
          { q: "Machinery with a book value of Rs.35,000 is sold for Rs.40,000. What is recorded?", a: "A profit on disposal of Rs.5,000 — the excess of proceeds over book value. The asset and its accumulated depreciation leave the books, the cash or bank account receives the proceeds, and the profit is transferred to the Profit and Loss Account as a gain." }
        ]
      }
    },

    pres: {
      hook: "A business reports Rs.3,00,000 of profit and pays no dividend. Is it healthy, or hiding something? Provisions and reserves are how honest businesses answer that question in advance — one faces a liability it can already feel coming, the other strengthens the balance sheet against what it cannot predict. Both shapes decide how truthfully a business reports itself.",
      connects: {
        before: "The charge-versus-appropriation idea grows directly out of the accrual logic of Ch.4 and the depreciation charges of Ch.14 — this chapter classifies what those chapters create.",
        after: "These classifications decide the final accounts (Ch.17) and return as adjustments (Ch.18); the Class 12 partnership chapter rebuilds the appropriation account from these same rules."
      },
      readiness: {
        q: "The Trial Balance carries a Provision for Doubtful Debts of Rs.5,000, and this year's estimate requires Rs.12,000. How much is charged to the Profit and Loss Account?",
        options: [
          "Rs.12,000",
          "Rs.5,000",
          "Rs.7,000",
          "Rs.17,000"
        ],
        answer: 2,
        explain: "Only the increase — Rs.7,000 — is charged, because Rs.5,000 was charged in earlier years. The provision is adjusted to the required figure, never re-charged from zero. If the requirement had instead fallen to Rs.9,000, the fall of Rs.3,000 would be released back to profit."
      },
      checkpoint: [1, 13, 16],
      diagrams: [
        {
          after: "Charge Against Profit vs Appropriation of Profit",
          type: "compare",
          caption: "One profit figure, two different kinds of claim on it.",
          head: ["Charged BEFORE profit is found", "Appropriated AFTER profit is found"],
          rows: [
            ["Depreciation, rent, salaries, bad debts, doubtful-debt provisions", "Transfer to General Reserve"],
            ["A known liability of the year — chargeable whether or not profit is adequate", "Dividend, and interest on capital where the deed provides for it"],
            ["Shown inside the Profit and Loss Account", "Shown in the Appropriation Account below net profit"],
            ["Skippable only by understating the year's true cost", "A choice of the partners or the board, never a compulsion"]
          ],
          diff: "Charging is discipline; appropriating is discretion. A business that appropriated heavily but charged little is not more profitable — it is less honest."
        },
        {
          after: "Provision vs. Reserve — The Core Difference",
          type: "table",
          caption: "The one-line difference, then the three consequences that follow from it.",
          head: ["Provision", "Reserve"],
          rows: [
            ["Created for a known liability of uncertain amount", "Created out of profit to strengthen the financial position"],
            ["A liability by nature — credited side of the Balance Sheet", "An appropriation — added with capital on the liabilities side"],
            ["Creation is compulsory wherever the obligation exists", "Creation is the discretion of management"]
          ]
        }
      ],
      recall: {
        intro: "These distinctions are pure marks in theory questions — but only if the four-point difference is memory. Attempt, then compare.",
        items: [
          { q: "Distinguish a provision from a reserve in four points.", a: "A provision meets a known liability of uncertain amount, is a charge against profit, and appears as a liability. A reserve is an appropriation of profit that strengthens the financial position and appears with capital. Provisions are compulsory where the obligation exists; reserves are discretionary." },
          { q: "Why can a revenue reserve not be distributed as dividend?", a: "Because it is created out of revenue profits for general strengthening or future contingencies, not out of realised capital gains. Distributing it would hand capital receipts to shareholders dressed as dividend, which is why the law restricts dividend to accumulated realised profits." },
          { q: "Give two ways a secret reserve can be created, and say why it is discouraged.", a: "Overcharging depreciation, undervaluing stock, or charging capital expenditure to revenue all depress reported profit and build hidden reserves. They are discouraged because they mislead every user about the true strength and earning power of the business." },
          { q: "What is the difference between a reserve and a reserve fund?", a: "A reserve is an amount merely retained out of profit and shown on the liabilities side. A reserve fund is that retained amount actually invested outside the business in securities or a named asset. The investment, not the retention, is what makes it a fund." },
          { q: "Is accumulated depreciation a reserve? Explain.", a: "No. It is the accumulated charge against the asset, matching the wear the asset has already suffered. It represents no free surplus, cannot be distributed, and exists only to bring the asset's book value down to what genuinely remains usable." }
        ]
      }
    },

    roe: {
      hook: "The Trial Balance agrees at Rs.1,08,700 and the clerk smiles — but Rs.6,000 of salary sits credited in the Salaries account and a machinery purchase was booked as purchases. Agreement is not innocence. This chapter is the detective work: find what went wrong, decide which book lied, and write the single entry that sets the truth back in place.",
      connects: {
        before: "Every error chased here was born in the Journal and Ledger chapters (Ch.7, Ch.8) — rectification simply runs those rules backwards and writes the correction.",
        after: "The suspense account opened here closes only when every difference is found, and these skills deliver the accuracy that the final accounts (Ch.17) demand."
      },
      readiness: {
        q: "Machinery purchased for Rs.50,000 was debited to the Purchases account, and the Trial Balance still agrees. What does that prove, and how is it corrected?",
        options: [
          "The error is harmless since totals agree; no entry is needed",
          "Both sides were treated alike; correct by debiting Machinery and crediting Purchases Rs.50,000",
          "A Suspense account must be opened before correcting it",
          "Only the ledger posting was wrong, so the ledger alone is rewritten"
        ],
        answer: 1,
        explain: "Purchases was wrongly debited and Machinery was never debited — yet the totals still agreed because the other side of the original entry, cash or creditor, was posted correctly. A two-sided error of this kind needs no suspense: debit Machinery, credit Purchases, and the ledger tells the truth again."
      },
      checkpoint: [2, 11, 14],
      diagrams: [
        {
          after: "Errors that Affect vs. Do NOT Affect the Trial Balance",
          type: "table",
          caption: "The dividing line decides whether a suspense account is needed at all.",
          head: ["Breaks the agreement", "Leaves the agreement intact"],
          rows: [
            ["Posting one side only — a ledger account simply left unposted", "Complete omission — the transaction never entered the books"],
            ["Casting error — one account's total wrongly struck", "Error of principle — both sides wrong in the same wrong class"],
            ["Rs.430 recorded where Rs.340 belonged, on one side", "Compensating errors — two mistakes of equal size cancelling"],
            ["Wrong-side posting — a debit entered on the credit side", "An original entry wrong but posted consistently — Rs.500 written as Rs.50 in the journal itself"]
          ]
        },
        {
          after: "The Rectification Method — Four Steps",
          type: "steps",
          caption: "Four moves that solve every rectification question, always in this order.",
          items: [
            { t: "Read what happened", d: "find the correct treatment the transaction actually deserved" },
            { t: "Find what was done", d: "identify the wrong account, wrong amount or wrong side actually recorded" },
            { t: "Write the correction", d: "reverse the wrong effect and apply the right one — a single entry with both sides" },
            { t: "Clear the suspense", d: "if a one-sided error caused the difference, its share of suspense vanishes as it is fixed" }
          ]
        }
      ],
      recall: {
        intro: "Rectification is decided in seconds by students who have memorised the categories. Attempt honestly — the wording traps are the point.",
        items: [
          { q: "What is an error of commission, and how does it differ from an error of principle?", a: "An error of commission keeps the correct class of account but names the wrong person or account within it — Ram's payment posted to Shyam, or one creditor set against another. An error of principle uses the wrong class entirely, charging a capital asset to a revenue account like purchases." },
          { q: "Why does a complete omission never appear in the Trial Balance?", a: "Because double entry never started — no debit and no credit exist anywhere to disagree. The books balance perfectly while simply being poorer by the transaction, which is why such errors surface only through physical verification, voucher checking or reconciliation." },
          { q: "When is a suspense account opened, and when does it finally close?", a: "It is opened when the Trial Balance disagrees, carrying the difference on the short side so totals agree and work can proceed. It closes only when every one-sided error has been located and rectified; a balance still standing proves errors remain undiscovered." },
          { q: "Wages account was overcast by Rs.1,500. State the rectifying entry.", a: "An overcast debit account makes the debit total of the Trial Balance exceed by Rs.1,500. Rectify by crediting Wages Rs.1,500 and debiting the Suspense account — the difference is consumed and the suspense balance steps down by the same amount." },
          { q: "Errors found after the final accounts are closed — how are they rectified?", a: "Through a prior period adjustment: the rectifying entry is passed in the current year's books and its net effect is routed through the earlier year's profit and loss appropriation, so the current year's reported performance does not silently absorb a previous year's mistake." }
        ]
      }
    },

    fs: {
      hook: "A year of transactions has been recorded, classified and balanced — now it must speak. The Trading Account says what the goods earned, the Profit and Loss Account says what the business kept, and the Balance Sheet freezes a single day's position. This chapter builds all three from one Trial Balance, and the order in which you build them decides your marks.",
      connects: {
        before: "Every figure entered here arrives from the Trial Balance (Ch.13) and the year-end adjustments of Ch.18, while the capital-versus-revenue vocabulary of Ch.2 decides each placement.",
        after: "This is the destination the entire Class 11 course has been building towards — and the vertical form and operating-profit ideas introduced here return inside the company accounts of Class 12."
      },
      readiness: {
        q: "Opening capital Rs.1,20,000; profit for the year Rs.30,000; drawings Rs.20,000. What is the closing capital shown in the Balance Sheet?",
        options: [
          "Rs.1,30,000",
          "Rs.1,70,000",
          "Rs.1,10,000",
          "Rs.1,50,000"
        ],
        answer: 0,
        explain: "Closing capital is opening capital plus profit minus drawings — Rs.1,20,000 plus Rs.30,000 minus Rs.20,000 gives Rs.1,30,000. The same three moves are exactly what the opening entry of the next year records, which is why closing capital and next year's opening capital always agree."
      },
      checkpoint: [3, 8, 20],
      diagrams: [
        {
          after: "Trading A/c vs Profit and Loss A/c — The Distinction",
          type: "table",
          caption: "Which statement receives the figure — decided by one question, never by habit.",
          head: ["Trading Account — direct, production side", "Profit and Loss Account — indirect, operating side"],
          rows: [
            ["Opening stock, purchases less returns, carriage inward, wages, power, factory rent, manufacturing expenses", "Salaries, office rent, selling and distribution expenses, advertising, legal charges"],
            ["Closing stock is credited to arrive at gross profit", "The trading account's debit side transfers in as gross profit"],
            ["Result: gross profit — the margin on goods alone", "Result: net profit — what the business actually earned"],
            ["Direct expenses touch the goods themselves", "Indirect expenses run the business around the goods"]
          ]
        },
        {
          after: "The Accounting Equation Behind the Balance Sheet",
          type: "equation",
          caption: "The balance sheet is this one sentence written in two columns.",
          terms: [
            { t: "Assets", d: "everything the business owns" },
            { t: "Liabilities", d: "everything it owes outsiders" },
            { t: "Capital", d: "the owner's remaining claim" }
          ],
          ops: ["=", "+"],
          note: "Every entry in the final accounts moves at least one of these three. Profit raises capital and with it the assets; a loss shrinks both. When a balance sheet refuses to tally, the missing rupee is almost always one effect of an adjustment that was applied only once."
        }
      ],
      recall: {
        intro: "Final accounts are built under exam pressure, so placements must be reflex. Attempt all five, then reveal and count the leaks.",
        items: [
          { q: "Distinguish capital receipts from revenue receipts, with an example of each.", a: "A capital receipt brings long-term funding or disposes of a long-lived asset — sale of machinery, fresh capital introduced, a loan taken. A revenue receipt is earned in the normal course of trading — sales, commission received, rent received. The first strengthens the balance sheet; the second feeds the Profit and Loss Account." },
          { q: "What is the opening entry, and where is it written?", a: "The compound journal entry that closes the previous year's books: debiting all assets and closing stock, crediting all liabilities and opening stock, with the balancing figure going to capital. It is written in the Journal Proper at the start of the new accounting year." },
          { q: "Why is closing stock credited to the Trading Account?", a: "Goods unsold at year end were included in purchases but not sold, so their cost must be removed before profit can be found. Crediting the Trading Account reduces the cost of goods sold, and the same figure appears as a current asset in the Balance Sheet — one figure, two effects." },
          { q: "What is meant by marshalling of the Balance Sheet?", a: "Deciding the order in which assets and liabilities are listed. The permanence order puts long-lived items first — fixed assets, then investments, then current assets — while the liquidity order reverses it, starting with cash. Both are acceptable, but consistency within one statement is what examiners reward." },
          { q: "State the difference between gross profit and net profit.", a: "Gross profit is net sales minus the cost of goods sold, found in the Trading Account, reflecting only the margin on goods. Net profit is gross profit minus all indirect expenses plus other incomes, found in the Profit and Loss Account, reflecting what the whole business earned this year." }
        ]
      }
    },

    adj: {
      hook: "The examiner hands you two things: a Trial Balance and a list of adjustments. The Trial Balance lies by omission — every adjustment you must apply was real all year long but was recorded nowhere. Two disciplined effects per item is the entire skill, and this chapter is where that discipline turns into muscle memory before the exam clock starts.",
      connects: {
        before: "Each adjustment practised here is the year-end form of the accrual logic from Ch.4 and the charges of Ch.14 — nothing new, only applied at the closing line.",
        after: "This chapter completes the final accounts (Ch.17), and the same two-effect discipline reappears throughout the Class 12 accounts wherever year-end figures must be estimated."
      },
      readiness: {
        q: "Rent paid during the year was Rs.20,000, which includes Rs.2,000 payable for the next year. What amount is debited to the Profit and Loss Account?",
        options: [
          "Rs.20,000",
          "Rs.18,000",
          "Rs.2,000",
          "Rs.22,000"
        ],
        answer: 1,
        explain: "Only the current year's expense belongs in this year's accounts — Rs.18,000. The remaining Rs.2,000 is prepaid: it steps out of the Profit and Loss Account and into the Balance Sheet as a current asset, waiting to be charged against next year's profit. Charge what belongs to this year; carry what belongs to the next."
      },
      checkpoint: [1, 17, 19],
      diagrams: [
        {
          after: "The Two-Effect Discipline — A Working Method",
          type: "steps",
          caption: "The same four moves, applied to every adjustment, every single time.",
          items: [
            { t: "Decide the account", d: "which figure the item touches — trading, profit and loss, or balance sheet" },
            { t: "Apply the first effect", d: "add or subtract it from that statement figure for the year" },
            { t: "Apply the second effect", d: "the balancing side lands in the Balance Sheet as an asset, a liability or a capital change" },
            { t: "Verify the pair", d: "both effects must exist; a one-effect adjustment is the commonest cause of a Balance Sheet refusing to tally" }
          ]
        },
        {
          after: "Items Inside vs. Outside the Trial Balance — The Presentation Rule",
          type: "table",
          caption: "One line in the question decides whether the figure is used once or twice.",
          head: ["Item INSIDE the Trial Balance", "Item OUTSIDE the Trial Balance"],
          rows: [
            ["Already recorded — both effects are complete", "Not yet recorded — only the information is given"],
            ["Use it ONCE, on the statement side it belongs to", "Use it TWICE — once in the statement, once in the Balance Sheet"],
            ["E.g. Stock on 31 March Rs.26,000 listed among the balances — take it where it already sits, not again", "E.g. Closing stock Rs.26,000 as an adjustment — credit the Trading Account AND show it as a current asset"],
            ["A figure already posted cannot be posted again", "Depreciation or bad debts given outside must strike the Profit and Loss Account and the Balance Sheet together"]
          ]
        }
      ],
      recall: {
        intro: "Adjustments are where final-account marks are actually lost. Attempt each from memory — the second effect is the one everyone forgets.",
        items: [
          { q: "State the treatment of closing stock in final accounts.", a: "Outside the Trial Balance it takes two effects: credit the Trading Account to remove unsold goods from the cost of goods sold, and show it as a current asset in the Balance Sheet. Inside the Trial Balance it means the stock was already adjusted, so it goes to the Balance Sheet alone." },
          { q: "Outstanding expenses of Rs.4,000 and prepaid expenses of Rs.1,500 — where does each go?", a: "Outstanding expenses are added to the expense in the Profit and Loss Account and shown as a current liability. Prepaid expenses are subtracted from the expense in the Profit and Loss Account and shown as a current asset. Both obey accrual: charge the year, carry the rest." },
          { q: "Goods worth Rs.3,000 taken by the owner for personal use — the two effects?", a: "Debit Drawings Rs.3,000 and credit the Trading Account. The goods must leave the closing stock figure because the business no longer owns them, and the owner's claim falls by their cost — capital absorbs the withdrawal, never profit." },
          { q: "Why are free samples debited to advertisement and credited to the Trading Account?", a: "The goods were bought for sale, so their cost must leave the Trading Account, while the benefit they provide is promotional, so the charge belongs with advertising in the Profit and Loss Account. Cost follows the goods out; expense follows the purpose." },
          { q: "How do the provision for doubtful debts and the provision for discount on debtors sequence?", a: "First deduct the bad debts already known, then compute the doubtful-debts provision on the remainder and deduct it, and only then compute the discount provision on the net figure that remains. Each provision rests on the previous one's result, so reversing the order overstates the discount and understates the charge." }
        ]
      }
    }
  });

  /* ==========================================================
     PART 4 — Class 12 chapters
     ========================================================== */
  w.GUIDED_PARTS.push({
    pf: {
      hook: "A partnership announces a profit of Rs.1,20,000 and the partners expect it to land in their capitals by ratio alone. It never does. Before the ratio touches a rupee, the deed takes its cuts — interest on capital, salary, commission — and only the remainder is divisible. This chapter builds that ladder, line by line.",
      connects: {
        before: "The charge-versus-appropriation distinction of Ch.15 is this chapter's engine, and the profit figure itself arrives from the final accounts of Ch.17.",
        after: "Everything learned here powers the reconstitution chapters that follow — a change in ratio (Ch.21), admission (Ch.22) and retirement (Ch.23) all reopen this appropriation logic."
      },
      readiness: {
        q: "A and B share profits 3:2. Net profit before appropriations is Rs.66,000. The deed allows A a salary of Rs.12,000 and interest on capital at 10% on capitals of Rs.1,00,000 (A) and Rs.50,000 (B). What does B receive in total?",
        options: [
          "Rs.20,600",
          "Rs.15,600",
          "Rs.19,000",
          "Rs.23,100"
        ],
        answer: 0,
        explain: "Interest on capital: A Rs.10,000, B Rs.5,000. Salary to A Rs.12,000. Total appropriations Rs.27,000, leaving Rs.39,000 divisible. B's two-fifths of that is Rs.15,600, and B's interest of Rs.5,000 stacks on top — Rs.20,600 in all. The appropriation ladder always runs the same way: interest and salary first, ratio on the remainder."
      },
      checkpoint: [1, 2, 9],
      diagrams: [
        {
          after: "The Deed and the Act's Defaults",
          type: "table",
          caption: "When the deed is silent, the Partnership Act decides — memorise this column and half the theory questions answer themselves.",
          head: ["Matter", "Act's default when the deed is silent"],
          rows: [
            ["Profit and loss sharing", "Equally, regardless of how much capital each partner contributed"],
            ["Interest on capital", "None — capital earns nothing extra"],
            ["Salary or commission to a partner", "Nothing"],
            ["Interest on a partner's loan to the firm", "6% per annum, even without any agreement"],
            ["Interest on drawings", "None may be charged"]
          ]
        },
        {
          after: "Building the Appropriation Account, Line by Line",
          type: "steps",
          caption: "The account is a fixed sequence — write it in this order every time and nothing is missed.",
          items: [
            { t: "Net profit b/d", d: "arrives from the Profit and Loss Account — the pool everything comes out of" },
            { t: "Add interest on drawings", d: "charged to partners, so it comes back into the pool" },
            { t: "Less interest on capital, salary, commission", d: "only if the deed provides them — these are appropriations, not charges" },
            { t: "Transfer to General Reserve", d: "optional — any amount the partners decide to retain" },
            { t: "Divide the remainder", d: "in the profit-sharing ratio, straight to the capital accounts" }
          ]
        }
      ],
      recall: {
        intro: "Partnership accounts are pure method. Attempt each from memory — especially the deed defaults, which examiners test every single year.",
        items: [
          { q: "What is a Profit and Loss Appropriation Account, and how does it differ from the Profit and Loss Account?", a: "It is an extension of the Profit and Loss Account used only by partnerships, showing how net profit is divided among partners — interest on capital, salary, commission, reserve transfers and the final division. The Profit and Loss Account finds the profit; the Appropriation Account allocates it." },
          { q: "Why is interest on capital an appropriation rather than a charge against profit?", a: "Because it depends on the partners' own agreement, not on the business's operations. A charge like rent must be paid whether profit exists or not; interest on capital is paid only out of profit available for division, which is why an insufficient-profit year reduces it instead of creating a loss for the firm." },
          { q: "State the Partnership Act's defaults when a deed is silent on profit sharing and interest on capital.", a: "Profits and losses are shared equally, irrespective of capital contributed, and no interest on capital is allowed. The one exception is a partner's loan to the firm, which carries 6% simple interest per annum even when the deed is silent." },
          { q: "Distinguish fixed capital accounts from fluctuating capital accounts.", a: "Under fixed capital, the capital account stays constant and all adjustments — interest, salary, profit share, drawings — go to a separate current account. Under fluctuating capital, every adjustment goes into the capital account itself, so its balance moves through the year. The method follows the deed; silence means fluctuating." },
          { q: "What is a past adjustment, and when is it passed?", a: "A correcting entry made in a later year when an omission or error of an earlier year — unpaid salary, wrongly computed interest on capital — is discovered after that year's books were closed. It is passed through the partners' capital or current accounts in the old ratio effect, without reopening the closed accounts." }
        ]
      }
    },

    gw: {
      hook: "Two tea stalls on the same street earn identical profits. One sells for ten lakh; the other cannot be given away. The difference has a name — goodwill — and it is nothing but the power to earn MORE than any newcomer with the same capital could earn here. This chapter teaches you to price that power.",
      connects: {
        before: "Average profit and capital employed come straight from the final accounts of Ch.17, and the normal rate of return is the same idea the ratio chapter (Ch.29) measures from the other side.",
        after: "Every valuation built here is cashed in during the reconstitution chapters — a change in ratio (Ch.21), admission (Ch.22) and retirement (Ch.23) all use these methods to settle compensation."
      },
      readiness: {
        q: "A firm's average profit is Rs.1,80,000, capital employed is Rs.12,00,000 and the normal rate of return for the trade is 10%. Goodwill is valued at four years' purchase of super profit. What is the goodwill?",
        options: [
          "Rs.2,40,000",
          "Rs.7,20,000",
          "Rs.1,80,000",
          "Rs.4,80,000"
        ],
        answer: 0,
        explain: "Normal profit is 10% of Rs.12,00,000 — Rs.1,20,000. Super profit is average profit minus normal profit: Rs.1,80,000 − Rs.1,20,000 = Rs.60,000. Goodwill at four years' purchase is Rs.60,000 × 4 = Rs.2,40,000. The whole method rests on one idea: only the EXTRA earning power above the trade norm is worth paying for."
      },
      checkpoint: [1, 2, 4],
      diagrams: [
        {
          after: "Super Profit — the Heart of the Chapter",
          type: "steps",
          caption: "Super profit in four moves — the method examiners reach for whenever capital employed is given.",
          items: [
            { t: "Find average profit", d: "add the given years' profits and divide by the number of years" },
            { t: "Compute normal profit", d: "capital employed multiplied by the normal rate of return over 100" },
            { t: "Subtract", d: "average profit minus normal profit gives super profit — the excess above the trade norm" },
            { t: "Multiply by years' purchase", d: "super profit × years' purchase = goodwill under this method" }
          ]
        },
        {
          after: "The Three Valuation Methods at a Glance",
          type: "table",
          caption: "Three families, three formulas — the question's data tells you which one to pick.",
          head: ["Method", "Formula", "When the question points to it"],
          rows: [
            ["Average profit", "Average profit × years' purchase", "Profits are stable and no capital figures are given"],
            ["Super profit", "Super profit × years' purchase", "Capital employed and the normal rate are given"],
            ["Capitalisation of average profit", "Average profit divided by NRR, minus capital employed", "The question asks for the total value of the firm's earning power"]
          ]
        }
      ],
      recall: {
        intro: "Goodwill problems are formula-recall under time pressure. Attempt first — if the formula does not arrive instantly, reveal and re-drill.",
        items: [
          { q: "Define goodwill and name the factors that build it.", a: "Goodwill is the value of a firm's ability to earn profit beyond the normal return available on capital invested in the trade. It is built by reputation and location, quality of products and management, regularity of earnings, access to customers and suppliers, and efficient management — everything that a newcomer cannot buy by simply investing money." },
          { q: "What is meant by years' purchase in goodwill valuation?", a: "The number of future years of excess earnings the buyer is willing to pay for up front. Valuing goodwill at three years' purchase of super profit means the purchaser pays today's equivalent of three years of the firm's above-normal earnings — the past built the reputation, but the buyer pays for its expected future life." },
          { q: "State the super profit formula and explain what it captures.", a: "Super profit equals average profit minus normal profit, where normal profit equals capital employed multiplied by the normal rate of return. It captures only what the firm earns ABOVE what any competitor with equal capital would earn in the same trade — the true measure of reputation-driven earning power." },
          { q: "Why is internally generated goodwill not recorded in the books?", a: "Under the accounting standard on intangible assets, only goodwill purchased for consideration can be recognised and recorded. Internally generated goodwill has no verifiable cost and its value fluctuates with reputation, so writing it into the books would make the statements subjective and unreliable." },
          { q: "How does the capitalisation of average profit method value goodwill?", a: "Capitalise the firm's average profit at the normal rate — average profit divided by the normal rate, scaled to 100 — to get the total value of the firm's earning power, then subtract the actual capital employed. The remainder is goodwill: the value the market would pay above the invested capital for that earnings stream." }
        ]
      }
    },

    psr: {
      hook: "Two partners quietly agree to move from 3:2 to 1:1. Nothing physical changes — same shop, same stock — yet a settlement has secretly occurred: one of them has bought a slice of tomorrow's profit from the other. The revaluation, the reserves and the goodwill are how that purchase price is computed and paid.",
      connects: {
        before: "The old profit-sharing logic and the appropriation account of Ch.19 are the baseline being disturbed, and goodwill valuation of Ch.20 supplies every number this chapter pays out.",
        after: "A ratio change is the simplest reconstitution; the same machinery runs at admission (Ch.22) and retirement (Ch.23), and dissolution (Ch.24) finally ends it."
      },
      readiness: {
        q: "A and B share profits 3:2 and revise to 1:1. The firm's goodwill is valued at Rs.2,00,000. Who compensates whom, and by how much?",
        options: [
          "A sacrifices 1/10 and receives Rs.20,000 from B",
          "B sacrifices 1/10 and receives Rs.20,000 from A",
          "They compensate equally, Rs.10,000 each",
          "No compensation arises from a pure ratio change"
        ],
        answer: 0,
        explain: "A's share falls from 3/5 to 1/2 — a sacrifice of 1/10. B's rises from 2/5 to 1/2 — a gain of 1/10. The gainer compensates the sacrificer for the share of goodwill attached to that fraction: Rs.2,00,000 × 1/10 = Rs.20,000, paid by B to A, usually through the partners' capital accounts."
      },
      checkpoint: [3, 5, 7],
      diagrams: [
        {
          after: "New Ratio, Sacrifice and Gain",
          type: "table",
          caption: "The sacrifice-gain computation in one grid — old ratio minus new ratio decides everything.",
          head: ["Partner", "Old share (3:2)", "New share (1:1)", "Old minus new"],
          rows: [
            ["A", "3/5 = 0.60", "1/2 = 0.50", "Sacrifice of 0.10"],
            ["B", "2/5 = 0.40", "1/2 = 0.50", "Gain of 0.10"],
            ["Check", "Total 1.00", "Total 1.00", "Sacrifices must equal gains"]
          ],
          diff: "Always compute per partner as old minus new: a positive result is a sacrifice, negative a gain. And the sacrifies and gains MUST net to zero — if they do not, one of the shares was written wrong."
        },
        {
          after: "The Revaluation Account, Step by Step",
          type: "steps",
          caption: "Revaluation is the firm telling the truth about its assets before the new deal begins.",
          items: [
            { t: "Debit losses and increases in liabilities", d: "assets that fell in value, liabilities that rose — the firm is worse off on these" },
            { t: "Credit gains and decreases in liabilities", d: "assets that rose, liabilities that fell — the firm is better off on these" },
            { t: "Strike the balance", d: "a credit balance is revaluation profit, a debit balance a loss" },
            { t: "Divide in the OLD ratio", d: "only old partners share it — the new terms never touch past gains" }
          ]
        }
      ],
      recall: {
        intro: "Ratio-change questions are the fastest in the paper IF the sacrifice-gain logic is memory. Attempt each before revealing.",
        items: [
          { q: "Define sacrificing ratio and gaining ratio.", a: "Sacrificing ratio is old share minus new share for each partner, computed where a partner gives up part of his share. Gaining ratio is new share minus old share, computed where partners acquire additional share. In a pure change, the gaining ratio of the beneficiaries equals the sacrificing ratio of the one who gives up." },
          { q: "Why are reserves and accumulated profits distributed at a change in profit-sharing ratio?", a: "Because they were earned under the OLD ratio and belong to the old profit structure. Leaving them in the books would let the gaining partner later claim a share of profits he did not help earn. So they are divided among the old partners in the old ratio before the new ratio begins to govern." },
          { q: "Which items are NOT revalued when the profit-sharing ratio changes?", a: "Assets and liabilities already shown at current realisable values, and items like accumulated depreciation that reflect past allocation rather than a change in worth. Only genuine differences between book value and current value are revalued — revaluation is not a routine re-check of every figure." },
          { q: "How is goodwill compensation recorded at a pure ratio change?", a: "The gaining partner's capital account is debited and the sacrificing partner's credit with the firm's total goodwill multiplied by the gaining ratio — no cash moves, it settles through the capital accounts, because the compensation is for a share of future earning power, not for an asset being sold." },
          { q: "What happens if the partners change their ratio but leave reserves and revaluation unrecorded?", a: "The gaining partner walks away with an unearned share of past accumulations and revaluation gains, and the sacrificed partner silently finances it. The error surfaces later in the capital balances, which is why every reconstitution begins by closing reserves and revaluing before the new ratio takes over." }
        ]
      }
    },

    adm: {
      hook: "A new partner counts out cash at the door — but his money buys only a share of FUTURE profit. Everything the old partners built before today: unvalued assets, standing reserves, a reputation called goodwill. The admission chapter is the settlement that must finish before his share begins.",
      connects: {
        before: "Revaluation and reserve distribution are the Ch.21 machinery running at full strength, and the goodwill methods of Ch.20 price what the new partner must compensate.",
        after: "Today's admitted partner is tomorrow's retiring or deceased partner — the settlement logic built here runs again in Ch.23, and dissolution (Ch.24) ends the firm itself."
      },
      readiness: {
        q: "A and B share profits 3:2. C is admitted for 1/5 of the future profits, and the firm's goodwill is valued at Rs.1,00,000. C brings his share of goodwill in cash, paid to A and B in their sacrificing ratio 3:2. How much does C pay, and who receives what?",
        options: [
          "Rs.20,000 total — A Rs.12,000, B Rs.8,000",
          "Rs.20,000 total — A Rs.8,000, B Rs.12,000",
          "Rs.1,00,000 total — A Rs.60,000, B Rs.40,000",
          "Nothing — goodwill is never brought in cash at admission"
        ],
        answer: 0,
        explain: "C's share of the firm's goodwill is Rs.1,00,000 × 1/5 = Rs.20,000, which he brings in cash. Under the premium method it is distributed to the sacrificing partners — here A and B in 3:2 — giving A Rs.12,000 and B Rs.8,000, credited to their capital accounts. The new partner pays the old ones for the reputation he is buying a share of."
      },
      checkpoint: [3, 5, 8],
      diagrams: [
        {
          after: "New Ratio and Sacrificing Ratio on Admission",
          type: "steps",
          caption: "Finding the new ratio when C takes a fraction of future profit — the pattern behind every admission question.",
          items: [
            { t: "Note C's share", d: "given directly, as 1/5 of future profits" },
            { t: "Find the remaining profit", d: "1 minus C's share — here 4/5, still belonging to A and B" },
            { t: "Split it in the sacrificing ratio", d: "if A and B sacrifice in their old ratio 3:2, the remainder splits the same way" },
            { t: "Write the new ratio", d: "3/5 × 4/5, 2/5 × 4/5, 1/5 — convert to whole numbers: 12 : 8 : 5" }
          ]
        },
        {
          after: "The Revaluation Account at Admission",
          type: "steps",
          caption: "Revaluation at admission has one rule that students forget every year — the new partner gets nothing here.",
          items: [
            { t: "Revalue every asset and liability", d: "to its true value on the admission date" },
            { t: "Strike the revaluation result", d: "profit or loss on the account's balance" },
            { t: "Divide in the OLD ratio", d: "3:2 here — C joined today, so yesterday's gains are not his" },
            { t: "Draw the revised balance sheet", d: "at revalued figures, with the new partner's capital and cash added" }
          ]
        }
      ],
      recall: {
        intro: "Admission is a fixed sequence — revalue, distribute reserves, adjust goodwill, fix capital. Attempt each and check the ORDER is as sharp as the numbers.",
        items: [
          { q: "State the sequence of steps when a new partner is admitted.", a: "Revalue assets and liabilities and share the result in the old ratio; distribute reserves and accumulated profits in the old ratio; adjust goodwill — premium method or otherwise — for the new partner's share; compute the new profit-sharing and sacrificing ratios; fix the new partner's capital and adjust total capital if required." },
          { q: "Explain the premium method of treating goodwill at admission.", a: "The new partner brings cash equal to his share of the firm's valued goodwill, which is credited directly to the sacrificing partners' capital accounts in their sacrificing ratio. No goodwill account is opened, and old goodwill already in the books is written off among all partners in the old ratio." },
          { q: "How is existing goodwill in the balance sheet treated at admission?", a: "It is written off entirely among all partners, including the incoming one, in the old profit-sharing ratio — debiting each capital account and crediting goodwill. Internally generated goodwill has no place in the books, so a revalued figure replaces the stale one through the premium method." },
          { q: "How is the new partner's capital fixed when the total capital of the reconstituted firm is given?", a: "Multiply the total capital by the new partner's profit-sharing share and require him to bring exactly that; the old partners then adjust their capitals to their own new-ratio shares by introducing or withdrawing the difference. The share, not the individual figure, determines each partner's stake." },
          { q: "Why does the new partner get no share of the revaluation profit?", a: "Because revaluation profit arises from changes in value that occurred BEFORE his admission — earned and risked by the old partners alone. Allowing the newcomer a share would transfer past gains to a person who neither financed nor built them, which is why the result divides in the old ratio strictly." }
        ]
      }
    },

    ret: {
      hook: "One partner walks out of a firm he helped build. Three debts fall due at once: his capital, his share of everything accumulated over the years, and compensation for the future profit he is handing to those who stay. Retirement and death differ only in urgency — the arithmetic is the same ladder.",
      connects: {
        before: "The revaluation and goodwill settlement machinery of Ch.21 and Ch.22 runs here almost unchanged, only the direction is reversed — a partner leaves instead of joining.",
        after: "The balance left behind continues, and when the remaining partners decide to wind up, the dissolution chapter (Ch.24) settles the firm itself the same careful way."
      },
      readiness: {
        q: "A, B and C share profits 3:2:1. C retires and A and B agree to share future profits 3:2. What is the gaining ratio of A and B?",
        options: [
          "Gaining ratio is 3:2",
          "Gaining ratio is 2:3",
          "Gaining ratio is 1:1",
          "Gaining ratio is 3:1"
        ],
        answer: 0,
        explain: "A's share moves from 1/2 to 3/5 — a gain of 1/10. B's moves from 1/4 to 2/5 — a gain of 1/15. Converting to a common denominator gives 3/30 and 2/30, so the gaining ratio is 3:2, exactly C's 1/6 share absorbed in that proportion. The gaining ratio is always new minus old, per partner, reduced to whole numbers."
      },
      checkpoint: [3, 4, 5],
      diagrams: [
        {
          after: "The Settlement Sequence",
          type: "steps",
          caption: "The retirement settlement in order — skip a step and the outgoing partner's balance is simply wrong.",
          items: [
            { t: "Revalue and close", d: "assets and liabilities revalued, result shared in the OLD ratio" },
            { t: "Distribute reserves", d: "general reserve, accumulated profits — all divided in the old ratio" },
            { t: "Goodwill compensation", d: "the gaining partners pay the outgoing partner, in the gaining ratio" },
            { t: "Add profit and deduct drawings", d: "his share of profit to the date of leaving, less what he took" },
            { t: "Settle the balance", d: "paid in cash, or transferred to a loan account if the firm does not pay at once" }
          ]
        },
        {
          after: "The Outgoing Partner's Entitlements",
          type: "table",
          caption: "Which ratio governs each component — this table is where most retirement marks are won or lost.",
          head: ["Component", "Divided in which ratio"],
          rows: [
            ["Share of reserves and accumulated profits", "Old profit-sharing ratio"],
            ["Revaluation profit or loss", "Old profit-sharing ratio"],
            ["Goodwill compensation", "Gaining ratio, paid by the gaining partners"],
            ["Profit up to the date of death", "His own share, on a time basis or product basis"],
            ["Any amount still unpaid", "Shown as a loan in the firm's balance sheet"]
          ]
        }
      ],
      recall: {
        intro: "Retirement is the strictest sequence in the syllabus. Attempt from memory — the ratio that governs each component is the whole game.",
        items: [
          { q: "State the gaining ratio formula and say where it is used.", a: "Gaining ratio equals new ratio minus old ratio, computed partner by partner and reduced to whole numbers. It decides how the continuing partners compensate the outgoing partner for the share of future profit they have acquired, and therefore how the goodwill adjustment divides at retirement." },
          { q: "Why are reserves distributed to the retiring partner in the old ratio?", a: "Because reserves were accumulated out of profits earned while he was a partner under the old terms. His entitlement to them is complete at the date of retirement, and distributing in the old ratio prevents the continuing partners from absorbing profits that were never theirs." },
          { q: "How is a deceased partner's share of profit up to the date of death estimated?", a: "On a time basis using the last year's or average profit multiplied by his share and the fraction of the year he lived, or on the product basis when period-wise profits are given — weighting each period's profit by the months elapsed, dividing the total products by the months of the year, then taking his share of the result." },
          { q: "What is done with any unpaid amount due to the outgoing partner?", a: "It is transferred to a loan account in his name and shown under non-current or current liabilities in the firm's balance sheet according to when it is payable. Interest may run on that loan at the agreed rate, or at 6% per annum under the Partnership Act's default." },
          { q: "How is a policy of insurance taken by the firm on the life of a partner treated at his death?", a: "The policy is not an asset of the firm for the partner's benefit — on death, the surrender value or claim proceeds are treated as a gain to the firm and shared among the surviving partners, while the deceased's executor receives his capital, reserves share and profit up to date in the settlement." }
        ]
      }
    },

    dis: {
      hook: "Everything must end: the assets are sold, the outsiders are paid, and whatever survives is divided one final time. Dissolution compresses an entire firm's accounting into a single account — Realisation — and a strict order of payment that decides who gets cash first when there is not enough for everyone.",
      connects: {
        before: "Capital balances arrive from the partnership chapters (Ch.19 to Ch.23), and the ledger skills of Ch.8 write every entry this account needs.",
        after: "Realisation closes the partnership story entirely — from here the syllabus turns to companies, beginning with share capital (Ch.25)."
      },
      readiness: {
        q: "On dissolution, assets of book value Rs.2,00,000 realise Rs.1,75,000; liabilities of book value Rs.80,000 are settled for Rs.85,000; realisation expenses come to Rs.10,000. What is the result on realisation?",
        options: [
          "Loss of Rs.40,000",
          "Loss of Rs.30,000",
          "Profit of Rs.40,000",
          "Loss of Rs.20,000"
        ],
        answer: 0,
        explain: "Shortfall on assets: Rs.25,000. Extra paid on liabilities: Rs.5,000. Realisation expenses: Rs.10,000. Total Rs.40,000 of loss, divided between the partners in their profit-sharing ratio. Every dissolution question reduces to this one arithmetic: what came in minus what went out, both measured against book values."
      },
      checkpoint: [2, 3, 1],
      diagrams: [
        {
          after: "The Order of Payment From Available Cash",
          type: "steps",
          caption: "The statutory order of payment — memorise it, because a question will ask for it by name.",
          items: [
            { t: "Realisation expenses", d: "the cost of winding up itself comes first" },
            { t: "Outside creditors", d: "third-party liabilities must be met before any partner touches cash" },
            { t: "Partners' loans", d: "paid after outsiders; equally between partners if the agreement is silent" },
            { t: "Partners' capitals", d: "last — and in the profit-sharing ratio if cash runs short" }
          ]
        },
        {
          after: "What Never Enters Realisation",
          type: "table",
          caption: "The exclusions that catch every student at least once — each goes somewhere else entirely.",
          head: ["Item", "Where it actually goes"],
          rows: [
            ["Cash and bank balances", "Transferred straight to the Cash Account — they ARE the money being divided"],
            ["A partner's loan to the firm", "Settled after outside creditors and before capitals — never through Realisation"],
            ["Fictitious assets and accumulated losses", "Written off against partners' capitals in the old ratio"],
            ["Reserves and accumulated profits", "Credited directly to partners' capitals in the old ratio"]
          ]
        }
      ],
      recall: {
        intro: "Dissolution is compact and relentless — a few rules decide every question. Attempt first; these five ARE the chapter.",
        items: [
          { q: "What is the purpose of the Realisation Account, and what is transferred to it?", a: "It records the disposal of assets and settlement of liabilities at dissolution and measures the final profit or loss. All assets except cash and fictitious ones are debited to it at book value, all external liabilities are credited at book value, and the difference on closing is the realisation profit or loss." },
          { q: "How is profit or loss on realisation treated?", a: "It is divided among all partners in their profit-sharing ratio — a profit is credited to and a loss debited to each capital account. It belongs to the partnership's final chapter because it arises from the collective act of winding up, not from any partner's individual dealings." },
          { q: "What is the correct order of payment from available cash at dissolution?", a: "Realisation expenses first, then outside creditors and other external claims, then partners' loans — equally if no agreement exists — and finally partners' capitals in the profit-sharing ratio. The order exists to protect outsiders before any partner receives a rupee." },
          { q: "How is an asset taken over by a partner in part settlement of his account recorded?", a: "The asset is credited to Realisation at its book value, and the amount at which the partner takes it is debited to his capital account. The difference between book value and takeover value passes to Realisation as a gain or loss, shared by all partners in the profit ratio." },
          { q: "What happens if a partner's capital account shows a debit balance and he cannot pay?", a: "Under the Partnership Act, the deficiency is made good from his private estate — and if that is insufficient, from the private estates of the remaining partners proportionally. Outside creditors must be made whole before the partners' own losses are absorbed." }
        ]
      }
    },

    sc: {
      hook: "A company's share capital is not one number but a ladder — authorised, issued, subscribed, called-up, paid-up — and every figure in a share question lives on one rung of it. Climb the ladder once and issuance, over-subscription, forfeiture and reissue all become the same story told at different heights.",
      connects: {
        before: "The journal-entry discipline of Ch.7 and the ledger structure of Ch.8 write every entry here; the company itself is introduced in the financial statements chapter (Ch.27).",
        after: "Debentures (Ch.26) mirror this chapter with interest instead of dividend, and every capital figure computed here feeds the statements of Ch.27 and the ratios of Ch.29."
      },
      readiness: {
        q: "A company issued 10,000 shares of Rs.10 each at Rs.12 (Rs.2 as premium), payable Rs.5 on application, Rs.4 on allotment and Rs.3 on first call. How much is received on application, and where is it credited?",
        options: [
          "Rs.50,000, credited to Share Application and Allotment Account",
          "Rs.1,20,000, credited to Share Capital Account",
          "Rs.40,000, credited to Securities Premium Reserve",
          "Rs.1,00,000, credited to Bank Account only"
        ],
        answer: 0,
        explain: "Application money runs on shares applied for: 10,000 × Rs.5 = Rs.50,000, credited to the Share Application and Allotment Account. On allotment it is transferred to share capital (and premium if collected then). The premium rides along with whichever instalment the question places it on — never a separate receipt of its own."
      },
      checkpoint: [1, 4, 7],
      diagrams: [
        {
          after: "The Capital Ladder",
          type: "flow",
          caption: "The five rungs of share capital — each figure in every share question sits on exactly one of them.",
          steps: [
            { t: "Authorised", d: "the maximum the memorandum allows — nothing may be issued above it" },
            { t: "Issued", d: "actually offered to the public" },
            { t: "Subscribed", d: "the portion the public applied for and the company accepted" },
            { t: "Called-up", d: "the part the company has demanded so far" },
            { t: "Paid-up", d: "what shareholders have actually paid — called-up minus arrears" }
          ]
        },
        {
          after: "Forfeiture and Reissue of Shares",
          type: "steps",
          caption: "Forfeiture cancels; reissue redistributes — and only the surplus, never the whole pot, becomes capital reserve.",
          items: [
            { t: "Forfeit the shares", d: "debit Share Capital up to the called-up amount, credit Calls in Arrears, credit Forfeited Shares Account with what the defaulter paid" },
            { t: "Reissue at a price", d: "debit Bank with the new price and the discount allowed, credit Share Capital with the full face value" },
            { t: "Cap the discount", d: "the discount on reissue can never exceed the forfeited amount on those shares" },
            { t: "Transfer the surplus", d: "the leftover forfeited balance on reissued shares moves to Capital Reserve — the only figure the question usually asks for" }
          ]
        }
      ],
      recall: {
        intro: "Share capital is pattern-recall at speed. Attempt each from memory — the forfeiture entry especially, which examiners rarely leave out.",
        items: [
          { q: "Distinguish authorised, issued, subscribed, called-up and paid-up capital.", a: "Authorised is the maximum the memorandum permits. Issued is what is offered. Subscribed is what the public applies for and the company accepts. Called-up is the portion demanded so far. Paid-up is what has actually been received — called-up minus calls in arrears." },
          { q: "What are calls in arrears, and how are they presented?", a: "The amount a shareholder fails to pay when a call is made. It is debited to a Calls in Arrears Account and deducted from paid-up capital to arrive at the figure shown in the balance sheet, keeping the share capital figure honest about what has truly been received." },
          { q: "State the journal entry for forfeiture of shares.", a: "Debit Share Capital Account with the amount up to the called-up value on the forfeited shares, credit Calls in Arrears with the amount unpaid, and credit the Forfeited Shares Account with the amount already paid by the defaulting shareholder. The forfeited account holds that money until reissue." },
          { q: "How is a reissue of forfeited shares recorded, and what is the restriction on price?", a: "Bank is debited with the reissue price, any shortfall is debited to the Forfeited Shares Account, and Share Capital is credited with the full face value. The discount allowed on reissue cannot exceed the amount forfeited on those particular shares — the firm can never return more than it kept." },
          { q: "From what source is the capital reserve on reissue computed?", a: "From the balance standing in the Forfeited Shares Account relating to the reissued shares only — the amount originally paid by the defaulting shareholder minus the discount allowed on reissue. Amounts on shares still held forfeited stay where they are until their own reissue." }
        ]
      }
    },

    deb: {
      hook: "Shares divide profit; debentures demand interest whether profit exists or not. That single difference turns everything — security, repayment order, even the loss on issue — on its head. Debenture accounting is not about sharing a fortune; it is about honouring a fixed promise, on fixed dates, in fixed amounts.",
      connects: {
        before: "The instalment-entry rhythm of share capital (Ch.25) is mirrored here, with interest replacing the profit divide; the securities premium logic also carries over from that chapter.",
        after: "Debenture interest and redemption figures appear in the company statements (Ch.27), and the fixed-obligation logic resurfaces in the solvency ratios of Ch.29."
      },
      readiness: {
        q: "A company issued 1,000 debentures of Rs.100 each at Rs.95, redeemable at Rs.105. What is the total loss on issue, and how is it treated?",
        options: [
          "Rs.15,000 — written off over the life of the debentures or against securities premium",
          "Rs.5,000 — shown as an asset until redemption",
          "Rs.10,000 — charged to the Profit and Loss Account at redemption only",
          "Rs.1,00,000 — the full face value is the loss"
        ],
        answer: 0,
        explain: "Discount on issue: Rs.5 per debenture × 1,000 = Rs.5,000. Premium on redemption: Rs.10 × 1,000 = Rs.10,000. Both are losses of the issue — Rs.15,000 together — and prudence demands they be written off immediately, against the Securities Premium Reserve first and the statement of profit and loss for the rest. They can never sit on the asset side."
      },
      checkpoint: [1, 2, 6],
      diagrams: [
        {
          after: "Issuing Debentures — Par, Premium, Discount",
          type: "table",
          caption: "The three issue prices and the extra account each one drags along.",
          head: ["Issue at", "Cash received per Rs.100", "The extra account"],
          rows: [
            ["Par", "Rs.100 — none extra", "Nothing; the whole amount is the debenture value"],
            ["Premium, say at Rs.105", "Rs.105", "Premium on Issue — a gain, written off against any loss on redemption"],
            ["Discount, say at Rs.95", "Rs.95", "Discount on Issue — a capital loss, written off at once"],
            ["Redeemable above par", "Paid more at the end", "Premium on Redemption — a loss, written off at the time of issue itself"]
          ]
        },
        {
          after: "Debentures vs Shares — the Fixed Difference",
          type: "compare",
          caption: "The comparison examiners love — every row springs from one idea: owner versus creditor.",
          head: ["Debentures", "Shares"],
          rows: [
            ["Holders are creditors — lenders to the company", "Holders are owners — members of the company"],
            ["Interest is a charge against profit, payable even in a loss year", "Dividend is an appropriation, paid only out of profit"],
            ["No voting rights", "Voting rights, one vote per share"],
            ["Repaid on a fixed date as per the terms", "Repaid only on winding up or under buy-back rules"],
            ["Usually secured by a charge on assets", "Unsecured — the residual claim on everything"]
          ],
          diff: "Fixed obligation against residual claim — interest must be paid before any dividend is thought of, and debenture holders are paid before shareholders receive a rupee at winding up."
        }
      ],
      recall: {
        intro: "Debenture questions are small but sharp — one wrong account and the entry is worthless. Attempt each before revealing.",
        items: [
          { q: "What is a debenture, and how does its holder differ from a shareholder?", a: "A debenture is a written certificate acknowledging a debt owed by the company, carrying a fixed rate of interest and repayable on a fixed date or under agreed terms. The holder is a creditor entitled to interest and repayment; the shareholder is an owner entitled to dividend and a residual claim, with no fixed return at all." },
          { q: "What is the loss on issue of debentures, and how is it written off?", a: "It is the total of the discount allowed at issue and the premium promised at redemption — both capital losses of the issue. They are written off immediately, either against the Securities Premium Reserve to the extent available or against the statement of profit and loss, over the life of the debentures or at once." },
          { q: "What are debentures issued as collateral security, and how are they recorded?", a: "Debentures handed to a lender as security for a loan, over and above other assets pledged. They are recorded by a memorandum entry only — debiting Debentures Suspense Account and crediting Debentures — because no debt arises from the arrangement itself; the actual debt is the loan, and the entry exists for disclosure." },
          { q: "How are debentures issued for consideration other than cash treated?", a: "They are issued to a vendor in payment for an asset purchased — machinery, for example — with the asset account debited and Debentures credited at their agreed value. The entry replaces the cash payment entirely, and any discount or premium follows the normal issue rules." },
          { q: "Where is interest on debentures due but unpaid shown at the balance sheet date?", a: "As a current liability — an outstanding expense — because the obligation has accrued but the payment has not been made. It appears under other current liabilities in the company balance sheet, and the corresponding debit sits in the statement of profit and loss as finance cost." }
        ]
      }
    },

    cfin: {
      hook: "Every company in the country lays out its balance sheet in the same statutory order — because Schedule III says so. That uniformity is what lets an outsider compare two firms without learning a new layout each time. This chapter is the grammar of that shared language: the two statements, their heads, and the notes that explain them.",
      connects: {
        before: "The final accounts of Ch.17 built the trading account, profit and loss account and balance sheet from scratch — here the same statements return in the statutory company format.",
        after: "These statements are the raw material of the next three chapters — analysis (Ch.28), ratios (Ch.29) and the cash flow statement (Ch.30) all read the figures prepared here."
      },
      readiness: {
        q: "A company reports revenue from operations of Rs.8,00,000, other income of Rs.40,000 and total expenses of Rs.6,80,000. What is its profit before tax?",
        options: [
          "Rs.1,60,000",
          "Rs.1,20,000",
          "Rs.2,00,000",
          "Rs.7,60,000"
        ],
        answer: 0,
        explain: "Total income — revenue from operations plus other income — is Rs.8,40,000. Subtract total expenses of Rs.6,80,000 and profit before tax is Rs.1,60,000. Only after current tax is deducted does it become profit for the year, and only then does the appropriation of that profit begin."
      },
      checkpoint: [1, 2, 10],
      diagrams: [
        {
          after: "Equity, Liabilities and Assets in Order",
          type: "table",
          caption: "The Schedule III order, side by side — this is the format every company statement must follow.",
          head: ["Equity and liabilities", "Assets"],
          rows: [
            ["Share capital", "Non-current assets — fixed assets, intangible assets, non-current investments"],
            ["Reserves and surplus", "Current assets — inventories, trade receivables, cash and bank balances, short-term advances"],
            ["Non-current liabilities — long-term borrowings, deferred tax liabilities", "Total assets must equal total equity and liabilities"],
            ["Current liabilities — short-term borrowings, trade payables, other current liabilities, short-term provisions", "Both sides are stated in this fixed order, never rearranged"]
          ]
        },
        {
          after: "Notes to Accounts — the Part That Explains the Rest",
          type: "steps",
          caption: "The face of the statement shows totals; the notes carry the truth behind them.",
          items: [
            { t: "Each line gets a note number", d: "the face of the statement is deliberately short and comparable" },
            { t: "The note gives the break-up", d: "for example, reserves and surplus split into profit for the year, general reserve, securities premium" },
            { t: "Policies and estimates live here", d: "depreciation method, useful lives, provisioning conventions — disclosed in the notes" },
            { t: "Contingent facts are disclosed", d: "a lawsuit pending, a loan guaranteed — disclosed even when no figure has been booked" }
          ]
        }
      ],
      recall: {
        intro: "Company statements are pure format marks — the order is the answer. Attempt each before revealing.",
        items: [
          { q: "What does Schedule III prescribe for company financial statements?", a: "The form and manner of presentation — the heads and sub-heads of the balance sheet, the line items of the statement of profit and loss, and the requirement of notes to accounts with disclosure of accounting policies and contingent liabilities. It standardises presentation so that any two companies' statements can be compared directly." },
          { q: "Distinguish revenue from operations from other income.", a: "Revenue from operations is what the company earns from its principal business — sale of goods or rendering of services. Other income comes from non-operating sources — interest received, dividends, profit on sale of fixed assets. Mixing the two overstates the core business's performance, which is why Schedule III keeps them apart." },
          { q: "Where is a proposed dividend shown under Schedule III?", a: "As a short-term provision on the liabilities side, deducted in arriving at profit for the year in the statement of profit and loss and added back through reserves and surplus — it is a provision against the profit of the year being presented, not merely a note of intent." },
          { q: "What is the purpose of notes to accounts?", a: "To give the detailed break-up behind every figure on the face of the statements, disclose the accounting policies and estimates followed, and report contingent liabilities and commitments that do not yet qualify for booking. Without the notes, the face of the statement tells only half the story." },
          { q: "Why are comparative figures shown alongside the current year's figures?", a: "Because a single year's numbers in isolation say little — comparatives reveal the direction and size of change, letting readers judge growth, deterioration and structural shifts. Schedule III therefore requires the previous year's corresponding figures to be presented with every line item." }
        ]
      }
    },

    fsa: {
      hook: "Two years of tables cannot answer a single question by themselves. Analysis is the craft that turns them into sentences — what changed, by how much, in which direction, and whether that direction should worry you. Comparative and common-size statements are the two lenses; this chapter teaches you to look THROUGH them, not just at them.",
      connects: {
        before: "The statements of Ch.27 supply every figure used here — analysis never creates data, it only reshapes what the company reports.",
        after: "Ratio analysis (Ch.29) and the cash flow statement (Ch.30) continue the same project — reading financial reality behind reported numbers — using these techniques as the base vocabulary."
      },
      readiness: {
        q: "Revenue from operations was Rs.20,00,000 last year and Rs.25,00,000 this year. What are the absolute change and the percentage change?",
        options: [
          "Rs.5,00,000 and 25 percent",
          "Rs.5,00,000 and 20 percent",
          "Rs.25,000 and 25 percent",
          "Rs.5,00,000 and 5 percent"
        ],
        answer: 0,
        explain: "Absolute change is this year minus last year: Rs.5,00,000. Percentage change divides that by the BASE year: 5,00,000 divided by 20,00,000, times 100 — 25 percent. Dividing by the current year instead gives 20 percent, and that single wrong denominator is the most common error in comparative statements."
      },
      checkpoint: [1, 2, 5],
      diagrams: [
        {
          after: "Internal, External, Horizontal and Vertical",
          type: "table",
          caption: "Two independent axes classify every analysis — who is looking, and how the numbers are laid out.",
          head: ["Axis", "Types"],
          rows: [
            ["Who analyses", "Internal — managers and owners using full records; External — lenders and investors using published statements only"],
            ["How compared", "Horizontal — one item across several years, as absolute and percentage change"],
            ["How presented", "Vertical — one year's figure expressed as a percentage of a base, showing structure"],
            ["Typical use", "Horizontal tracks a trend; vertical exposes composition and supports cross-firm comparison"]
          ]
        },
        {
          after: "Comparative Balance Sheet — What Changed in the Position",
          type: "table",
          caption: "One year's balance sheet change, read as a story — fixed investment funded by reserves, not debt.",
          head: ["Item (Rs.)", "Year 1", "Year 2", "Change %"],
          rows: [
            ["Non-current assets", "24,00,000", "26,00,000", "plus 8.33"],
            ["Current assets", "16,00,000", "14,00,000", "minus 12.50"],
            ["Shareholders' funds", "30,00,000", "32,00,000", "plus 6.67"],
            ["Total", "40,00,000", "40,00,000", "nil"]
          ],
          diff: "Total capital did not grow — it restructured: long-term investment up, current assets down, funded by reserves rather than borrowing. The totals hide that story completely; only the comparative percentages reveal it."
        }
      ],
      recall: {
        intro: "Analysis questions punish formula confusion. Attempt each from memory — especially the base denominators.",
        items: [
          { q: "What is a comparative statement, and what does it show?", a: "A statement presenting the same items for two or more years side by side, with the absolute change and the percentage change for each line. It reveals the direction and magnitude of movement in every item, letting a reader see growth, contraction and structural shifts that single-year figures conceal." },
          { q: "What is the base for percentages in a common-size statement of profit and loss, and in a common-size balance sheet?", a: "In the profit and loss statement, revenue from operations is taken as 100 percent and every item is shown as its share of that revenue. In the balance sheet, total assets — equal to total equity and liabilities — is the base, showing each item's proportion of the firm's total size." },
          { q: "Why are both absolute and percentage changes shown in a comparative statement?", a: "Because each corrects the other's blind spot. A large absolute change may be a small proportional move on a huge base, and a big percentage change may be trivial in rupees. Showing both prevents either from misleading the reader about the true significance of the movement." },
          { q: "State two limitations of financial statement analysis.", a: "The statements themselves follow accounting policies that differ between firms — different depreciation methods or stock valuation make direct comparison unsafe. And figures are historical cost-based, so inflation and price changes distort real trends; window-dressing of published statements can mislead further." },
          { q: "What does it indicate when employee benefits expense rises more slowly than revenue?", a: "That the workforce's share of earnings has fallen — either productivity improved, or headcount was cut relative to business volume. Either way operating leverage is working in the firm's favour, provided quality and capacity have not been quietly damaged to achieve it." }
        ]
      }
    },

    rat: {
      hook: "Four questions decide a firm's health: can it survive the next twelve months, who really owns it, how fast does its machinery of stock and credit turn, and how much of every rupee survives as profit. Ratios are those four questions in numbers — and the interpretation, not the arithmetic, is where the marks live.",
      connects: {
        before: "Every figure comes from the statements of Ch.27, and the analysis techniques of Ch.28 — comparative and common-size — are the same reading skill applied to ratios.",
        after: "The cash flow statement (Ch.30) completes the picture, and the computerised tools of Ch.31 automate exactly these computations at scale."
      },
      readiness: {
        q: "Current assets are Rs.6,00,000, including inventory of Rs.2,00,000 and prepaid expenses of Rs.40,000. Current liabilities are Rs.3,00,000. What is the quick ratio?",
        options: [
          "1.2 : 1",
          "2 : 1",
          "1.6 : 1",
          "0.8 : 1"
        ],
        answer: 0,
        explain: "The quick ratio removes inventory and prepayments — the least liquid current assets: Rs.6,00,000 − Rs.2,40,000 = Rs.3,60,000, divided by Rs.3,00,000 gives 1.2 : 1. The current ratio would show a comfortable 2 : 1, but the quick ratio exposes how much of that comfort depends on stock actually selling."
      },
      checkpoint: [1, 2, 6],
      diagrams: [
        {
          after: "The Four Families of Ratios",
          type: "table",
          caption: "The four families, their questions and their star ratios — the whole chapter's map in one grid.",
          head: ["Family", "The question it answers", "Star ratios"],
          rows: [
            ["Liquidity", "Can it pay the next twelve months' dues?", "Current ratio, quick ratio"],
            ["Solvency", "Who owns the firm, and how much is owed?", "Debt-equity ratio, total assets to debt"],
            ["Activity", "How fast does the machine turn?", "Inventory turnover, receivables turnover, payables turnover"],
            ["Profitability", "How much of each rupee survives?", "Gross profit ratio, net profit ratio, return on investment"]
          ]
        },
        {
          after: "Capital Employed and Return on Investment in Full",
          type: "steps",
          caption: "Return on investment computed properly — the two routes to capital employed, and the one formula that uses it.",
          items: [
            { t: "Route one to capital employed", d: "share capital plus reserves plus long-term debt — the financing view" },
            { t: "Route two", d: "non-current assets plus working capital — the investment view; both give the same figure" },
            { t: "Take profit before interest and tax", d: "PBIT, not net profit — the return belongs to ALL providers of long-term capital" },
            { t: "Divide and scale", d: "PBIT divided by capital employed, times 100, gives the return the firm earns on every rupee locked in" }
          ]
        }
      ],
      recall: {
        intro: "Ratio formulas flood out of memory only if they are rehearsed. Attempt each before revealing — the interpretation lines matter as much as the arithmetic.",
        items: [
          { q: "State the current ratio and the quick ratio formulas, and the ideal of each.", a: "Current ratio equals current assets divided by current liabilities, ideal 2 : 1. Quick ratio equals quick assets — current assets minus inventory and prepayments — divided by current liabilities, ideal 1 : 1. The second is the harder test because it removes everything that must first be sold." },
          { q: "What does the debt-equity ratio measure, and how is it computed?", a: "Long-term solvency — how much of the firm's long-term financing comes from creditors versus owners. Long-term debt divided by shareholders' funds gives it; a rising ratio means growing dependence on borrowing and therefore growing fixed-interest obligation ahead of any dividend." },
          { q: "How is inventory turnover computed, and what does a rise from four to seven times indicate?", a: "Cost of goods sold divided by average inventory. A rise from four to seven means stock is selling nearly twice as fast — stronger demand, better inventory management, less capital locked in goods. It is favourable unless achieved by stockouts that are quietly costing sales." },
          { q: "What is interest coverage, and what does it tell a lender?", a: "Profit before interest and tax divided by interest for the year. It counts how many times the operating profit could pay the interest bill. A high ratio reassures lenders of safety; below about two or three times, the fixed obligation starts to threaten the firm in a bad year." },
          { q: "State the formula for return on investment and explain why PBIT is used.", a: "Return on investment equals profit before interest and tax divided by capital employed, times 100. PBIT is used because interest belongs to lenders and tax to the government — the operating return must be measured before either claims its cut, so the figure reflects what the firm's long-term funds genuinely earn." }
        ]
      }
    },

    cf: {
      hook: "Profit is an opinion; cash is a fact. A firm can post healthy profits and still die at the bank counter. The Cash Flow Statement rebuilds the year from actual cash — operations first, investing second, financing third — and the three streams are never allowed to hide inside one another.",
      connects: {
        before: "The profit figure and every working capital balance arrive from the statements of Ch.27, and the reading discipline of Ch.28 and Ch.29 tells you what the resulting cash pattern means.",
        after: "Cash flow analysis is the final reading skill of the course — combined with the ratios of Ch.29 it completes the financial picture that began in the final accounts of Ch.17."
      },
      readiness: {
        q: "Net profit before tax is Rs.2,40,000 and depreciation for the year is Rs.60,000. There are no working capital changes and tax is to be ignored. What is cash generated from operations?",
        options: [
          "Rs.3,00,000",
          "Rs.1,80,000",
          "Rs.2,40,000",
          "Rs.3,60,000"
        ],
        answer: 0,
        explain: "Depreciation reduced profit without moving any cash, so it is added back: Rs.2,40,000 + Rs.60,000 = Rs.3,00,000. With no working capital movements and no tax, this is also the net operating cash flow. Every indirect-method question begins with exactly this reversal — profit back to cash."
      },
      checkpoint: [1, 2, 7],
      diagrams: [
        {
          after: "Working Capital Adjustments — the Direction Trap",
          type: "table",
          caption: "The direction rule for every current asset and liability — the single most examined grid in the chapter.",
          head: ["Movement", "Effect on operating cash"],
          rows: [
            ["Trade receivables increase", "Deduct — revenue counted, cash not yet received"],
            ["Trade receivables decrease", "Add — old debts collected in cash"],
            ["Inventory increases", "Deduct — cash locked into unsold stock"],
            ["Trade payables increase", "Add — purchases used, cash not yet paid"],
            ["Trade payables decrease", "Deduct — old bills settled in cash"],
            ["Prepaid expenses increase", "Deduct — cash paid ahead of the year it belongs to"]
          ],
          diff: "Assets move OPPOSITE to cash; liabilities move WITH it. An asset rising means cash went out and has not come back; a liability rising means cash stayed in the pocket. Understand that and the table needs no memorising."
        },
        {
          after: "Assembling the Three Sections",
          type: "steps",
          caption: "The full skeleton of the statement — build it in this order and the closing cash proves itself.",
          items: [
            { t: "A. Operating activities", d: "net profit before tax, plus non-cash charges like depreciation, adjusted for working capital movements, less tax paid" },
            { t: "B. Investing activities", d: "purchase and sale of fixed assets and investments, interest and dividend received" },
            { t: "C. Financing activities", d: "proceeds from shares and loans, repayment of borrowings, interest and dividend paid" },
            { t: "Reconcile", d: "net increase or decrease across the three, plus opening cash, must equal closing cash and cash equivalents — the final proof of the whole statement" }
          ]
        }
      ],
      recall: {
        intro: "Cash flow direction rules are where marks leak. Attempt each from memory — the working capital directions especially.",
        items: [
          { q: "What are cash and cash equivalents, and why does the statement distinguish them?", a: "Cash is cash in hand and demand deposits with banks; cash equivalents are short-term, highly liquid investments readily convertible to known cash amounts, with insignificant risk of value change — typically holdings under three months. The pair is treated as one pool so the statement reflects genuine spendable liquidity." },
          { q: "Name the three activity categories and give one example of each.", a: "Operating activities — the company's principal revenue-producing activities, such as cash received from customers and paid to suppliers. Investing activities — the acquisition and disposal of long-term assets and investments, such as buying machinery. Financing activities — activities that change the size and composition of equity and borrowings, such as proceeds from a loan or dividend paid." },
          { q: "Why is depreciation added back to net profit in the indirect method?", a: "Because it is a non-cash charge — it reduced the reported profit without any cash leaving the business. Since the statement starts from profit and aims to reach cash, every such charge must be reversed, as must other non-cash items such as a loss on the sale of an asset." },
          { q: "Where are interest paid and dividend received shown in this course's format?", a: "Interest paid is shown under financing activities, as a cost of obtaining funds, and dividend received under investing activities, as a return on investment made. Both may alternatively be shown within operating activities under the standard, but this course follows the first treatment consistently." },
          { q: "What is shown if a company makes a bonus issue during the year?", a: "Nothing — no cash moves in a bonus issue; it merely capitalises reserves by issuing shares against them. Since the statement records only actual cash inflows and outflows, a bonus issue is a non-cash financing activity and does not appear among the three sections." }
        ]
      }
    },

    ca: {
      hook: "The ledger has not changed in five hundred years — but the person keeping it now works inside a spreadsheet and a database. Computerised accounting is about the machine around the ledger: heads coded into hierarchies, errors blocked at the point of entry, every change stamped with a name and a time.",
      connects: {
        before: "The books of original entry (Ch.7 to Ch.10) and the ratio computations of Ch.29 are exactly what this chapter automates — the spreadsheet problems here revisit that same arithmetic.",
        after: "This chapter closes the course — every technique from the accounting equation (Ch.5) to the cash flow statement (Ch.30) is now executed by the systems whose structure and security you have just learned."
      },
      readiness: {
        q: "In the hierarchy Assets to Current assets to Cash-in-hand to Cash a/c, what exactly is the item Cash-in-hand?",
        options: [
          "A sub-group heading under current assets",
          "A ledger account",
          "A transaction",
          "A financial statement"
        ],
        answer: 0,
        explain: "Codification builds a hierarchy — major groups, then sub-groups, then ledger account heads. Current assets is a major group, Cash-in-hand is a sub-group within it, and Cash a/c is the ledger account that actually carries balances. Every voucher posts to a coded ledger head, and that structure is what makes automatic statements possible."
      },
      checkpoint: [3, 5, 15],
      diagrams: [
        {
          after: "Software Packages — Generic, Specific, Tailored",
          type: "table",
          caption: "The three package families — the trade-off between fit and cost decides which a firm buys.",
          head: ["Package type", "Built for", "The trade-off"],
          rows: [
            ["Generic", "Any business — standard books, ledgers, statements", "Cheap and quick to install, but forces every firm into one common shape"],
            ["Specific", "One line of business — housing societies, hospitals, schools", "Fits that trade's reports and compliances; less flexible outside it"],
            ["Tailored", "One firm's exact account heads, reports and controls", "Perfect fit and exclusive; costly, slow to build and maintain"]
          ]
        },
        {
          after: "Validation, Verification and the Audit Trail",
          type: "steps",
          caption: "The four guards standing between a typo and a wrong financial report — in the order they operate.",
          items: [
            { t: "Validation at entry", d: "a rule blocks invalid data before it is stored — a date outside the period, a negative quantity, an account code that does not exist" },
            { t: "Verification afterwards", d: "totals, trial balance agreement and reconciliation confirm what has been stored" },
            { t: "Audit trail", d: "every change records who changed it, from what value to what, and when — accountability made automatic" },
            { t: "Security and backup", d: "passwords and access rights prevent misuse; regular backups recover the books after hardware failure or disaster" }
          ]
        }
      ],
      recall: {
        intro: "This final chapter is theory-dense but short. Attempt each from memory — validation, audit trail and codification are the recurring exam favourites.",
        items: [
          { q: "What is a computerised accounting system, and what are its basic components?", a: "A system that records transactions, maintains ledgers and produces statements electronically, built from computers, printers, connectivity, UPS or power backup, and the accounting software itself. Its features include codified account heads, quick posting and retrieval, automatic reports and multi-user access with controls." },
          { q: "Distinguish generic software from tailored software, with an example of each.", a: "Generic software serves all kinds of businesses with standardised books and reports — a general accounting package any trader can install. Tailored software is built for one particular firm's exact account heads, report formats and controls, matching its workflow precisely but costing far more to develop and maintain." },
          { q: "What is data validation, and give two examples of validation rules.", a: "Validation checks data at the moment of entry against predefined rules, rejecting anything invalid before it is stored. Examples: a date field accepting only dates within the financial period, a numeric field rejecting negative amounts, or an account code that must exist in the chart of heads before a voucher is accepted." },
          { q: "What is an audit trail, and why is it essential in a computerised system?", a: "A chronological record of every change made to stored data — who made it, what the old value was, the new value, and when. It converts the invisibility of electronic editing into accountability, supports verification and audit, and deters unauthorised manipulation because every alteration leaves a trace." },
          { q: "How does codification of account heads help accounting software?", a: "Coding assigns a structured hierarchy — groups, sub-groups and ledger heads — which lets the software classify every voucher automatically, post it to the right account, and generate grouped statements and reports without manual sorting. Errors in coding, conversely, send figures to the wrong head and distort every statement built on top." }
        ]
      }
    }
  });

  /* ==========================================================
     APPLIER — merge the parts onto APP_DATA (never replace).
     Runs at load time, after classes.js installed Class 12
     content and after theory-upgrade.js attached .upgrade.
     ========================================================== */
  (function applyGuidedParts() {
    var parts = w.GUIDED_PARTS || [];
    var D = (typeof APP_DATA !== "undefined") ? APP_DATA : null;
    if (!D) return;

    function bad(s) { return typeof s === "string" && (s.indexOf("<") !== -1 || s.indexOf(">") !== -1); }
    function str(s, min) {
      return typeof s === "string" && s.replace(/\s+/g, " ").trim().length >= (min || 1) && !bad(s);
    }

    parts.forEach(function (part) {
      if (!part || typeof part !== "object") return;
      Object.keys(part).forEach(function (key) {
        var g = part[key];
        var sec = D[key];
        if (!sec || typeof sec !== "object") {
          if (typeof console !== "undefined" && console.warn) console.warn("guided-learning: unknown chapter key", key);
          return;
        }
        var guide = sec.guide && typeof sec.guide === "object" ? sec.guide : {};

        if (str(g.hook, 30)) guide.hook = g.hook;
        if (g.connects && typeof g.connects === "object") {
          var c = {};
          if (str(g.connects.before, 30)) c.before = g.connects.before;
          if (str(g.connects.after, 30)) c.after = g.connects.after;
          if (c.before || c.after) guide.connects = c;
        }
        if (g.readiness && typeof g.readiness === "object" &&
            str(g.readiness.q, 25) && Array.isArray(g.readiness.options) &&
            g.readiness.options.length >= 2 && g.readiness.options.length <= 4 &&
            g.readiness.options.every(function (o) { return str(o, 3); }) &&
            typeof g.readiness.answer === "number" &&
            g.readiness.answer >= 0 && g.readiness.answer < g.readiness.options.length &&
            str(g.readiness.explain, 40)) {
          guide.readiness = {
            q: g.readiness.q,
            options: g.readiness.options.slice(),
            answer: g.readiness.answer,
            explain: g.readiness.explain
          };
        }
        if (Array.isArray(g.checkpoint) && g.checkpoint.length) {
          var ids = g.checkpoint.filter(function (n) { return typeof n === "number" && isFinite(n) && n > 0; });
          if (ids.length) guide.checkpoint = ids;
        }
        if (g.recall && typeof g.recall === "object" && Array.isArray(g.recall.items)) {
          var rItems = g.recall.items.filter(function (it) {
            return it && typeof it === "object" && str(it.q, 8) && str(it.a, 8);
          }).slice(0, 6);
          if (rItems.length >= 2) {
            guide.recall = { items: rItems };
            if (str(g.recall.intro, 20)) guide.recall.intro = g.recall.intro;
          }
        }
        if (Array.isArray(g.diagrams) && g.diagrams.length) {
          var DIAGRAM_TYPES = { flow: 1, steps: 1, compare: 1, table: 1, taccount: 1, equation: 1 };
          var keep = g.diagrams.filter(function (d) {
            return d && typeof d === "object" && DIAGRAM_TYPES[d.type] === 1 &&
              str(d.after, 3) && str(d.caption, 15) && !bad(String(d.after)) && !bad(String(d.caption));
          });
          if (keep.length) guide.diagrams = keep;
        }
        sec.guide = guide;
      });
    });
  })();

  /* ==========================================================
     GuidedLearn — pure helpers (no DOM, no STATE, no storage)
     ========================================================== */
  var GL = {};

  /* The four stages, in journey order. */
  GL.STAGES = [
    { key: "learn", label: "Learn", icon: "compass", blurb: "What you are about to study, and why it matters." },
    { key: "understand", label: "Understand", icon: "book-open", blurb: "Concepts explained, worked through and checked." },
    { key: "practise", label: "Practise", icon: "pencil-line", blurb: "Questions that test what you just learned." },
    { key: "remember", label: "Remember", icon: "rotate-ccw", blurb: "Recap, recall and revision tools." }
  ];

  /* Route id (what STATE, URLs and progress use) <-> APP_DATA key
     (what the content files use). Identical for every chapter
     except the six renamed Class 11 ones. */
  var ROUTE_TO_DATA = { eq: "equation", dc: "debitCredit", jr: "journal", lg: "ledger", cb: "cashBook", sp2: "specialBooks2" };
  var DATA_TO_ROUTE = {};
  Object.keys(ROUTE_TO_DATA).forEach(function (r) { DATA_TO_ROUTE[ROUTE_TO_DATA[r]] = r; });

  GL.routeToDataKey = function (routeId) { return ROUTE_TO_DATA[routeId] || routeId; };
  GL.dataKeyToRoute = function (dataKey) { return DATA_TO_ROUTE[dataKey] || dataKey; };

  /* Stage -> tabs plan per chapter (route-id keyed). Order inside a
     stage is the click preference (best revision/practice surface
     first). Tabs that do not appear in any stage (Class 12 activity
     labs with dynamic titles, future tabs) fall through to the
     practise stage in stageOfTab — every activity surface IS a
     practice surface, so the fallback is honest. */
  var PLAN = {
    /* Class 11 */
    intro:  { learn: ["Introduction"], understand: ["Theory"], practise: ["Practice Bank", "Accounting in Action"], remember: ["Quick Revision", "Mind Map"] },
    terms:  { learn: ["Introduction"], understand: ["Theory"], practise: ["Practice Bank", "Term Detective"], remember: ["Quick Revision", "Mind Map"] },
    tbase:  { learn: ["Introduction"], understand: ["Theory"], practise: ["Practice Bank", "Concept Detective"], remember: ["Quick Revision", "Mind Map"] },
    basis:  { learn: ["Introduction"], understand: ["Theory"], practise: ["Practice Bank", "Basis Switch"], remember: ["Quick Revision", "Mind Map"] },
    eq:     { learn: ["Theory"], understand: ["Concepts"], practise: ["Practice Bank", "Balance Verifier", "Random Generator"], remember: ["Quick Revision", "Mind Map"] },
    dc:     { learn: ["Theory"], understand: ["Concepts"], practise: ["Practice Bank", "Balance Sheet Qs"], remember: ["Quick Revision", "Common Mistakes", "Mind Map"] },
    jr:     { learn: ["Theory"], understand: ["Concepts"], practise: ["Practice Bank", "Entry Generator", "Ledger Posting"], remember: ["Quick Revision", "Mind Map"] },
    lg:     { learn: ["Introduction"], understand: ["Ledger Format", "Posting Rules"], practise: ["Journal → Ledger Practice", "Balancing Accounts", "Exam Questions"], remember: ["Quick Revision", "Mind Map"] },
    cb:     { learn: ["Introduction"], understand: ["Format & Rules"], practise: ["Practice Bank", "Cash Book Challenge"], remember: ["Quick Revision", "Mind Map"] },
    sp2:    { learn: ["Introduction"], understand: ["Format & Rules"], practise: ["Practice Bank", "Books Detective"], remember: ["Quick Revision", "Mind Map"] },
    brs:    { learn: ["Introduction"], understand: ["Format & Rules"], practise: ["Practice Bank", "BRS Detective"], remember: ["Quick Revision", "Mind Map"] },
    gst:    { learn: ["Introduction"], understand: ["Format & Rules"], practise: ["Practice Bank", "GST Bill Detective"], remember: ["Quick Revision", "Mind Map"] },
    tb:     { learn: ["Introduction"], understand: ["Format & Rules"], practise: ["Practice Bank", "Trial Balance Checkpoint"], remember: ["Quick Revision", "Mind Map"] },
    dep:    { learn: ["Introduction"], understand: ["Format & Rules"], practise: ["Practice Bank", "Depreciation Lab"], remember: ["Quick Revision", "Mind Map"] },
    pres:   { learn: ["Introduction"], understand: ["Format & Rules"], practise: ["Practice Bank", "Decision Lab"], remember: ["Quick Revision", "Mind Map"] },
    roe:    { learn: ["Introduction"], understand: ["Format & Rules"], practise: ["Practice Bank", "Error Detective"], remember: ["Quick Revision", "Mind Map"] },
    fs:     { learn: ["Introduction"], understand: ["Format & Rules"], practise: ["Practice Bank", "Statement Builder"], remember: ["Quick Revision", "Mind Map"] },
    adj:    { learn: ["Introduction"], understand: ["Format & Rules"], practise: ["Practice Bank", "Adjustment Studio"], remember: ["Quick Revision", "Mind Map"] },
    /* Class 12 (activity tab titles are dynamic — the practise
       fallback in stageOfTab picks them up automatically) */
    pf:   { learn: ["Introduction"], understand: ["Theory", "Formulas & Rules"], practise: ["Practice Bank"], remember: ["Quick Revision", "Mind Map"] },
    gw:   { learn: ["Introduction"], understand: ["Theory", "Formulas & Rules"], practise: ["Practice Bank"], remember: ["Quick Revision", "Mind Map"] },
    psr:  { learn: ["Introduction"], understand: ["Theory", "Formulas & Rules"], practise: ["Practice Bank"], remember: ["Quick Revision", "Mind Map"] },
    adm:  { learn: ["Introduction"], understand: ["Theory", "Formulas & Rules"], practise: ["Practice Bank"], remember: ["Quick Revision", "Mind Map"] },
    ret:  { learn: ["Introduction"], understand: ["Theory", "Formulas & Rules"], practise: ["Practice Bank"], remember: ["Quick Revision", "Mind Map"] },
    dis:  { learn: ["Introduction"], understand: ["Theory", "Formulas & Rules"], practise: ["Practice Bank"], remember: ["Quick Revision", "Mind Map"] },
    sc:   { learn: ["Introduction"], understand: ["Theory", "Formulas & Rules"], practise: ["Practice Bank"], remember: ["Quick Revision", "Mind Map"] },
    deb:  { learn: ["Introduction"], understand: ["Theory", "Formulas & Rules"], practise: ["Practice Bank"], remember: ["Quick Revision", "Mind Map"] },
    cfin: { learn: ["Introduction"], understand: ["Theory", "Formulas & Rules"], practise: ["Practice Bank"], remember: ["Quick Revision", "Mind Map"] },
    fsa:  { learn: ["Introduction"], understand: ["Theory", "Formulas & Rules"], practise: ["Practice Bank"], remember: ["Quick Revision", "Mind Map"] },
    rat:  { learn: ["Introduction"], understand: ["Theory", "Formulas & Rules"], practise: ["Practice Bank"], remember: ["Quick Revision", "Mind Map"] },
    cf:   { learn: ["Introduction"], understand: ["Theory", "Formulas & Rules"], practise: ["Practice Bank"], remember: ["Quick Revision", "Mind Map"] },
    ca:   { learn: ["Introduction"], understand: ["Theory", "Formulas & Rules"], practise: ["Practice Bank"], remember: ["Quick Revision", "Mind Map"] }
  };

  GL.stagePlan = function (routeId) {
    return PLAN[routeId] || null;
  };
  GL.allPlanIds = function () { return Object.keys(PLAN); };

  /* Which stage a tab belongs to. Explicit stage membership wins;
     an unknown tab is an activity/lab surface -> practise. */
  GL.stageOfTab = function (tab, plan) {
    if (!tab || !plan) return null;
    if (plan.learn.indexOf(tab) !== -1) return "learn";
    if (plan.understand.indexOf(tab) !== -1) return "understand";
    if (plan.remember.indexOf(tab) !== -1) return "remember";
    if (plan.practise.indexOf(tab) !== -1) return "practise";
    return "practise";
  };

  /* The first tab of a stage that actually exists in this chapter's
     tab bar — keeps stage clicks working on every chapter layout. */
  GL.firstStageTab = function (routeId, stageKey, availableTabs) {
    var plan = GL.stagePlan(routeId);
    if (!plan) return null;
    var order = plan[stageKey] || [];
    var avail = Array.isArray(availableTabs) ? availableTabs : order;
    for (var i = 0; i < order.length; i++) {
      if (avail.indexOf(order[i]) !== -1) return order[i];
    }
    /* The stage's own list may name a tab this chapter does not have
       (e.g. a shared default) — fall back to any available tab that
       belongs to the stage. */
    for (var j = 0; j < avail.length; j++) {
      if (GL.stageOfTab(avail[j], plan) === stageKey) return avail[j];
    }
    return null;
  };

  /* Pure roadmap state machine. input:
       { readinessAt, understandAt, rememberAt, progress, activeStage }
     Returns [{ key, label, icon, blurb, state, sub }]:
       state: "done" | "current" | "todo"   sub: short status line
     Completion rules — genuine activity only:
       learn     done when the readiness check was submitted
       understand done when a theory checkpoint was answered
                 correctly (or self-assessed correct)
       practise  done when chapter progress reaches 100% (all
                 practice-bank questions solved — computed from
                 STATE.solved, never stored)
       remember  done when the chapter recall set was completed */
  GL.stageStates = function (input) {
    var i = input || {};
    var active = i.activeStage || null;
    var progress = (typeof i.progress === "number" && isFinite(i.progress)) ? Math.max(0, Math.min(100, i.progress)) : 0;
    function st(done, whenActive, subDone, subTodo) {
      return {
        state: done ? "done" : (active === whenActive ? "current" : "todo"),
        sub: done ? subDone : subTodo
      };
    }
    var learn = st(!!i.readinessAt, "learn", "readiness checked", "first look");
    var understand = st(!!i.understandAt, "understand", "checkpoint cleared", "lesson + check");
    var practiseState;
    if (progress >= 100) practiseState = { state: "done", sub: "all questions solved" };
    else if (progress > 0) practiseState = { state: active === "practise" ? "current" : "todo", sub: progress + "% solved" };
    else practiseState = { state: active === "practise" ? "current" : "todo", sub: "questions waiting" };
    var remember = st(!!i.rememberAt, "remember", "recap recalled", "revise later");

    var map = { learn: learn, understand: understand, practise: practiseState, remember: remember };
    return GL.STAGES.map(function (s) {
      return { key: s.key, label: s.label, icon: s.icon, blurb: s.blurb, state: map[s.key].state, sub: map[s.key].sub };
    });
  };

  /* The chapter's guide data (APP_DATA side), given the route id. */
  GL.guideDataOf = function (routeId) {
    if (typeof APP_DATA === "undefined") return null;
    var sec = APP_DATA[GL.routeToDataKey(routeId)];
    return (sec && sec.guide) || null;
  };

  /* Find the diagram anchored to this exact block heading. */
  GL.diagramAfter = function (guide, heading) {
    if (!guide || !Array.isArray(guide.diagrams) || !heading) return null;
    for (var i = 0; i < guide.diagrams.length; i++) {
      if (guide.diagrams[i].after === heading) return guide.diagrams[i];
    }
    return null;
  };

  /* ----------------------------------------------------------
     Diagram HTML builders — one small renderer per visual type.
     All text is escaped; captions and labels carry the meaning
     (colour never does); figures are semantic <figure>/<figcaption>
     so screen readers get a real description. Returns "" for
     anything malformed so a bad spec can never break a chapter.
     ---------------------------------------------------------- */
  GL.esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };
  var E = GL.esc;

  function cap(d) {
    return '<figcaption class="gl-diag-cap">' + E(d.caption) + "</figcaption>";
  }
  function figure(cls, d, body, label) {
    return '<figure class="gl-diagram ' + cls + '" role="figure" aria-label="' + E(label || d.caption) + '">' +
      cap(d) + body + "</figure>";
  }
  function stepItem(s) {
    return '<li class="gl-step"><b class="gl-step-t">' + E(s.t) + "</b>" +
      (s.d ? '<span class="gl-step-d">' + E(s.d) + "</span>" : "") + "</li>";
  }

  GL.buildDiagram = function (d) {
    if (!d || typeof d !== "object" || !d.caption) return "";
    var i, rows, html;

    if (d.type === "flow" && Array.isArray(d.steps) && d.steps.length) {
      html = '<ol class="gl-flow">';
      d.steps.forEach(function (s, idx) {
        if (idx > 0) html += '<li class="gl-flow-arrow" aria-hidden="true">&#8594;</li>';
        html += "<li>" + stepItem(s) + "</li>";
      });
      html += "</ol>";
      return figure("gl-diagram--flow", d, html);
    }

    if (d.type === "steps" && Array.isArray(d.items) && d.items.length) {
      html = '<ol class="gl-numsteps">';
      d.items.forEach(function (s) { html += stepItem(s); });
      html += "</ol>";
      return figure("gl-diagram--steps", d, html);
    }

    if (d.type === "compare" && Array.isArray(d.head) && d.head.length === 2 && Array.isArray(d.rows)) {
      html = '<div class="table-scroll"><table class="gl-diag-table"><thead><tr><th scope="col">' +
        E(d.head[0]) + '</th><th scope="col">' + E(d.head[1]) + "</th></tr></thead><tbody>";
      d.rows.forEach(function (r) {
        html += "<tr><td>" + E(Array.isArray(r) ? r[0] : r) + "</td><td>" +
          E(Array.isArray(r) ? (r[1] == null ? "" : r[1]) : "") + "</td></tr>";
      });
      html += "</tbody></table></div>";
      if (d.diff) html += '<p class="gl-diag-diff"><b>The difference:</b> ' + E(d.diff) + "</p>";
      return figure("gl-diagram--compare", d, html);
    }

    if (d.type === "table" && Array.isArray(d.head) && Array.isArray(d.rows)) {
      html = '<div class="table-scroll"><table class="gl-diag-table"><thead><tr>';
      d.head.forEach(function (h) { html += '<th scope="col">' + E(h) + "</th>"; });
      html += "</tr></thead><tbody>";
      d.rows.forEach(function (r) {
        html += "<tr>";
        (Array.isArray(r) ? r : [r]).forEach(function (c) { html += "<td>" + E(c == null ? "" : c) + "</td>"; });
        html += "</tr>";
      });
      html += "</tbody></table></div>";
      return figure("gl-diagram--table", d, html);
    }

    if (d.type === "taccount" && d.left && d.right && Array.isArray(d.left.rows) && Array.isArray(d.right.rows)) {
      function side(s, cls) {
        var b = '<div class="gl-ta-side ' + cls + '"><div class="gl-ta-h">' + E(s.h || "") + "</div><ul>";
        s.rows.forEach(function (r) {
          if (Array.isArray(r)) {
            b += '<li><span class="gl-ta-txt">' + E(r[0]) + '</span><span class="gl-ta-amt tnum">' + E(r[1] == null ? "" : r[1]) + "</span></li>";
          } else {
            b += "<li>" + E(r) + "</li>";
          }
        });
        return b + "</ul></div>";
      }
      html = '<div class="gl-taccount" role="group">' +
        '<div class="gl-ta-bar"><span>Dr.</span><span>Cr.</span></div>' +
        side(d.left, "gl-ta-dr") + side(d.right, "gl-ta-cr") + "</div>";
      return figure("gl-diagram--taccount", d, html);
    }

    if (d.type === "equation" && Array.isArray(d.terms) && d.terms.length) {
      html = '<div class="gl-eqdiag">';
      d.terms.forEach(function (t, idx) {
        if (idx > 0) {
          var op = (Array.isArray(d.ops) && d.ops[idx - 1] != null) ? d.ops[idx - 1] : "+";
          html += '<span class="gl-eq-op" aria-hidden="true">' + E(op) + "</span>";
        }
        html += '<span class="gl-eq-term"><b>' + E(t.t || "") + "</b>" +
          (t.d ? "<small>" + E(t.d) + "</small>" : "") + "</span>";
      });
      html += "</div>";
      if (d.note) html += '<p class="gl-diag-diff">' + E(d.note) + "</p>";
      return figure("gl-diagram--equation", d, html);
    }
    return "";
  };

  w.GuidedLearn = GL;
})();
