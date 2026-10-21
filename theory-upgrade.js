/* theory-upgrade part 1 — Class 11 chapters 1-6 (intro, terms, tbase, basis, equation, debitCredit) */
(function () {
  "use strict";
  window.THEORY_UPGRADE_PARTS = window.THEORY_UPGRADE_PARTS || [];
  window.THEORY_UPGRADE_PARTS.push({
    intro: {
      intro: [
        "Imagine two friends start a tea stall together. By December they have handled thousands of rupees — bought milk, paid the rent, sold chai, paid a helper — and yet neither can say how much they actually earned. Accounting begins with exactly this problem: human memory cannot be trusted with money. It is the practice of turning every rupee that moves in or out of a business into an organised written record, so that questions like how much did we earn and what do we own are answered from books, never from somebody's memory.",
        "Because that record exists, a shop owner can decide whether to restock, a bank can decide whether to give a loan, and the tax department can decide how much tax is due — all from the same set of books. This is why accounting is called the language of business: one common set of rules lets very different people read the same financial reality and reach their own conclusions. Every commerce student meets this language again and again, in business studies, in economics, and in any career involving organisations, banks, startups, or government.",
        "This chapter lays the foundation for everything that follows in Class 11 Accountancy. The basic terms you meet here — capital, assets, liabilities, revenue, expenses — are the vocabulary used in every later chapter. The idea that every transaction has two equal sides becomes the accounting equation in Chapter 5 and the rules of debit and credit in Chapter 6, and those rules then power the Journal, the Ledger, the Cash Book, and finally the financial statements. Learn this chapter slowly; everything else stands on it."
      ],
      objectives: [
        "Understand what accounting is, and how it grew out of the narrower activity of book-keeping.",
        "Learn the stages of the accounting process, from identifying a transaction to communicating the results.",
        "Apply the two-part test that decides whether an event is a recordable transaction at all.",
        "Know the main objectives of accounting and the financial statements that fulfil them.",
        "Distinguish the internal and external users of accounting information and the question each one asks.",
        "Recognise the qualitative characteristics that make accounting information genuinely useful."
      ],
      blocks: [
        {
          h: "The Accounting Process, Stage by Stage",
          p: "Accounting is not one activity but a chain, each link feeding the next. A transaction is first identified as a financial event, then recorded in the books, classified into the right account, summarised into statements, analysed, interpreted, and finally communicated to the people who need it. Skip any link and the chain breaks: records without classification are a mess, and statements without interpretation are just numbers.",
          list: [
            { term: "Identifying", def: "Deciding which events are financial transactions of this business at all — a cash sale yes, a competitor's new shop no." },
            { term: "Recording", def: "Entering each transaction in the books of original entry (the Journal) in date order, with its supporting evidence attached." },
            { term: "Classifying", def: "Posting each entry to its proper Ledger account, so all rent sits together, all salary sits together, and so on." },
            { term: "Summarising", def: "Totalling the Ledger accounts into a Trial Balance and then into the financial statements." },
            { term: "Analysing", def: "Studying the statements to find meaning — which product earns the best margin, where costs are creeping up." },
            { term: "Interpreting and communicating", def: "Explaining what the analysis shows, in statements and reports, to owners, banks, the government, and others." }
          ],
          example: "A customer pays ₹2,000 cash for notebooks. The event is identified as a transaction; recorded in the day book; classified into the Cash and Sales accounts; summarised into the day's sales total; analysed against yesterday's figure; and communicated to Priya, the shop owner, as part of her monthly report.",
          simple: "Think of it like water moving through a canal system: water (the money facts) is collected, filtered, channelled, and finally poured into glasses of different sizes for different drinkers. Each stage prepares the facts for the next, until a user gets exactly the shape of information they need.",
          note: "Book-keeping covers identifying, recording, and classifying. The later stages — summarising, analysing, interpreting, communicating — are what turn book-keeping into accounting.",
          mistakes: [
            "Thinking the process ends once the Ledger is posted — summarising, analysing, and communicating are still to come.",
            "Recording everything that happens instead of identifying true financial transactions first."
          ]
        },
        {
          h: "Is It a Transaction? The Two-Part Test",
          p: "Beginners record too much; careful accountants record only what qualifies. An event becomes a transaction only if it passes both parts of one test, and an event that fails either part stays out of the books entirely.",
          list: [
            { term: "Test 1 — financial position", def: "Does the business now own something more, owe something more, or have less of either? If nothing has changed, there is nothing to record." },
            { term: "Test 2 — money measure", def: "Can the change be expressed as a reliable rupee figure? If it cannot be measured in money, it cannot enter the books." }
          ],
          real: "Ritu's tiffin service buys a gas stove worth ₹12,000 from a dealer who allows 30 days' credit. No cash has moved, yet the business now owns a stove and owes ₹12,000 — both tests passed, so it is recorded at once. By contrast, a customer saying I might order ₹1,00,000 of books next year changes nothing today, so nothing is recorded.",
          confusion: {
            a: "Recordable transaction",
            aText: "A credit purchase of goods: stock rises and creditors rise, both measurable in rupees. Both tests pass, so it enters the books immediately.",
            b: "Important event with no money measure",
            bText: "The owner winning a prestigious award, or a key employee resigning. These matter to the business but have no objective rupee value, so they stay outside the books.",
            diff: "Recording depends on measurability in money, not on importance. A huge non-monetary event is ignored; a small money event like a ₹100 postage bill is recorded."
          },
          tip: "In exams, is it a transaction is a favourite one-marker. Answer by quoting both parts of the test: it changes the financial position and it can be measured in money.",
          mistakes: [
            "Recording a customer's informal order or enquiry as a sale — no exchange has taken place yet.",
            "Skipping a credit sale because no cash has changed hands — the amount now owed by the customer is itself a measurable change in financial position.",
            "Assuming only outsider dealings are transactions — the owner depositing ₹2,00,000 of personal savings into the business is a transaction, because the business's position changes."
          ]
        },
        {
          h: "From Raw Entries to Financial Statements",
          p: "A year produces thousands of small entries, and no user can read them all. Accounting's summarising stage compresses them into a handful of statements, in a fixed order: the Journal records each transaction as it happens, the Ledger sorts them under headed accounts, the Trial Balance lists every account's balance as a check that total debits equal total credits, and then the final statements are prepared.",
          list: [
            { term: "Statement of Profit and Loss", def: "Answers did we earn or lose — by showing revenue, expenses, and the resulting profit or loss for a period." },
            { term: "Balance Sheet (Statement of Financial Position)", def: "Answers what do we own and owe — showing assets, liabilities, and capital as on one specific date." },
            { term: "Cash Flow Statement", def: "Answers where did the cash go — showing cash generated and used across operating, investing, and financing activities." }
          ],
          simple: "The Journal is like a diary of every event, the Ledger like a set of named folders, the Trial Balance like a proof-check before publishing, and the final statements like the published report itself.",
          tip: "Remember the order Journal to Ledger to Trial Balance to Financial Statements. Chronology questions and marks questions both come from knowing this chain, and every later chapter of this syllabus sits somewhere in it.",
          note: "The Trial Balance is a check, not a guarantee — total debits equal total credits because of double entry, but wrong figures can still hide behind a tallying trial balance."
        },
        {
          h: "One Set of Records, Many Different Questions",
          p: "A common beginner's assumption is that there is one correct use of accounting information. In fact the same year's records answer many different questions, and each user reads them for their own purpose. The skill examiners look for is matching the user to the question they are really asking.",
          list: [
            { term: "The owner asks", def: "Is my capital earning a good return, and is it safe?" },
            { term: "Management asks", def: "Which costs are rising, and what should we do about it this quarter?" },
            { term: "A bank asks", def: "Can this business repay a loan, and when?" },
            { term: "A creditor or supplier asks", def: "Will this business pay for what we supplied on credit, on time?" },
            { term: "The tax department asks", def: "What income has the business earned, and what tax is due on it?" },
            { term: "An investor asks", def: "Would buying a stake here be a sound decision?" }
          ],
          real: "Arjun's banker and Arjun's employees both read the same statements this March. The banker hunts for repayment capacity in the cash and debtor figures; the employees look for the profit that decides their bonus. Same numbers, completely different questions.",
          note: "Internal users are inside the business — owner, management, employees. Everyone else — banks, investors, creditors, government, researchers, the public — is external."
        }
      ],
      advBlocks: [
        {
          h: "Book-keeping, Accounting and Accountancy",
          p: "These three words are close cousins, and marks often rest on keeping them apart. Accountancy is the widest term: the whole subject, the skill and body of knowledge of keeping and communicating accounts. Inside it sits accounting, and inside accounting sits book-keeping, the smallest circle.",
          list: [
            { term: "Book-keeping", def: "The mechanical core — identifying transactions, then recording and classifying them in the Journal and the Ledger. It ends where the Ledger is posted." },
            { term: "Accounting", def: "The wider process that includes book-keeping and adds summarising, analysing, interpreting, and communicating the results." },
            { term: "Accountancy", def: "The entire discipline — the principles, practices, and skills of keeping accounts and preparing and presenting financial information, of which accounting and book-keeping are parts." }
          ],
          p2: "A neat way to say it in an answer: book-keeping is the handwriting in which the business story is written, accounting tells the story, and accountancy is the whole literature.",
          simple: "Draw three circles, one inside the other. The smallest is book-keeping, the middle one accounting, the largest accountancy. Nothing in the smallest circle lies outside the bigger ones, but each bigger circle contains work the smaller one does not do.",
          tip: "If a question asks for the distinction between book-keeping and accounting, the dividing line is interpretation: book-keeping stops at classified records, accounting continues until a user can act on the result."
        },
        {
          h: "Branches of Accounting",
          p: "As businesses grow, different readers need different kinds of information, and accounting branched out to serve each of them. All three branches start from the same recorded transactions but prepare different reports for different decisions.",
          list: [
            { term: "Financial accounting", def: "Records transactions and prepares the Statement of Profit and Loss and the Balance Sheet, mainly for owners, investors, lenders, and regulators." },
            { term: "Cost accounting", def: "Measures the cost of producing each product or service, so management can price products sensibly and control waste." },
            { term: "Management accounting", def: "Prepares budgets, estimates, and internal reports that help managers plan and decide — it looks forward, while financial accounting mainly looks back." }
          ],
          real: "A bakery's financial accounts tell the owner that the year ended with a profit of ₹3,40,000. Its cost accounting tells him each cake costs ₹96 to make, and its management accounting projects next year's profit if egg prices rise. One business, three kinds of numbers, three kinds of decision.",
          note: "Financial accounting is the branch this syllabus concentrates on; cost and management accounting mainly appear in later, specialised study."
        },
        {
          h: "Window Dressing: When the Picture Is Painted, Not True",
          p: "Because several accounting figures involve judgement, there is scope to present the accounts in a more flattering light than reality justifies. This practice is called window dressing, and it is a limitation every user should watch for. It usually works at the edges of the year, where timing and estimates can be nudged without any outright lie.",
          list: [
            { term: "Timing games", def: "Rushing a credit sale through on 31 March so this year's revenue looks bigger, or delaying a purchase bill into next year." },
            { term: "Estimate games", def: "Providing too little for doubtful debts, or showing closing stock at an overly generous value." },
            { term: "Presentation games", def: "Hiding a significant obligation in a small-print note instead of the main statements." }
          ],
          simple: "Window dressing is to financial statements what a freshly painted shopfront is to a tired shop — the paint is not exactly a lie, but it is designed to make you judge the shop by the paint rather than by what is inside.",
          note: "Full Disclosure and Objectivity exist as concepts precisely to fight this: recorded amounts must rest on verifiable evidence, and everything significant must be disclosed."
        },
        {
          h: "Where This Chapter Leads",
          p: "Nothing in this chapter exists in isolation. The basic terms become the heads of accounts in the Journal and Ledger chapters. The idea that every transaction has two sides becomes the accounting equation, and then the rules of debit and credit. The summarising stage becomes the Trial Balance and the final accounts. Even the limitations return later: historical cost resurfaces in depreciation, and personal judgement resurfaces in provisions and adjustments.",
          list: [
            { term: "Chapters 2 to 4", def: "Build the vocabulary and the theory base that every later entry depends on." },
            { term: "Chapters 5 and 6", def: "Turn the dual aspect idea into working rules — the accounting equation, then debit and credit." },
            { term: "The remaining chapters", def: "Turn those rules into books: Journal, Ledger, Cash Book, Trial Balance, and the financial statements." }
          ],
          simple: "Think of this chapter as the legend of a map. Nothing dramatic happens here, but without reading it the rest of the map makes no sense.",
          real: "Priya's accountant once told her the shop earned ₹2,14,000 this year. Every rupee of that figure can be traced back, through the Trial Balance and the Ledger, to individual entries like the ₹2,000 notebook sale — that traceability is what makes the number trustworthy, and it is exactly what the coming chapters teach you to build."
        }
      ],
      mistakes: [
        "Using book-keeping and accounting interchangeably in answers — the examiner is usually testing exactly that distinction.",
        "Calling every business event a transaction — an enquiry, a price change, or a competitor's launch fails the two-part test and is not recorded.",
        "Believing credit transactions are not accounting transactions because no cash moved — financial position changed measurably, so they are recorded at once.",
        "Listing only four objectives of accounting and missing protecting business assets, or merging two objectives into one.",
        "Putting banks or creditors among internal users — they are external; only owners, management, and employees are inside the business.",
        "Expecting the Balance Sheet to show reputation or staff skill — accounting records only what can be measured in money."
      ],
      summary: [
        "Accounting is the process of identifying, recording, classifying, summarising, analysing, interpreting, and communicating financial transactions — book-keeping is only its recording core.",
        "An event is a transaction only if it changes the business's financial position and can be measured in money.",
        "The main objectives are systematic records, ascertaining profit or loss, ascertaining financial position, providing information to users, and protecting business assets.",
        "The financial statements — Statement of Profit and Loss, Balance Sheet, and Cash Flow Statement — are the summarised output of the accounting process.",
        "Users are internal (owner, management, employees) or external (banks, investors, creditors, government, researchers, public), and each asks a different question of the same records.",
        "Useful accounting information must be reliable, relevant, understandable, and comparable.",
        "Accounting's limitations — money measurement, historical cost, personal judgement, ignoring price-level changes — are as important to know as its advantages.",
        "Every idea in this chapter feeds the accounting equation, the debit-credit rules, and the book-keeping chapters that follow."
      ],
      check: [
        { q: "In one line each, distinguish book-keeping from accounting, and accounting from accountancy.", a: "Book-keeping is the routine recording and classifying of transactions in the Journal and the Ledger. Accounting includes that work but continues through summarising, analysing, interpreting, and communicating. Accountancy is the whole discipline — the subject that contains both." },
        { q: "True or false: a customer's promise to place an order worth ₹50,000 next month must be recorded in this month's books. Give a reason.", a: "False. No exchange has taken place, so the business's financial position has not changed at all. A promise or intention is not measurable as a transaction of this business today; recording happens only when goods are delivered or payment is made." },
        { q: "A bank and an employee both read the same company's statements. State the different question each is really asking.", a: "The bank asks whether the business can generate enough cash and profit to repay its loan safely — it studies liquidity and debtors closely. The employee asks whether the business is stable and profitable enough to secure jobs, wages, and bonus. Same figures, different decisions." },
        { q: "Explain in your own words why accounting is called the language of business.", a: "Because it is the common channel that lets very different people — owner, bank, government, investor — understand the same financial reality. Just as a shared language lets strangers understand each other, a shared set of accounting rules turns one business's many transactions into statements that any trained reader can interpret, whatever their own interest in the business." }
      ]
    },

    terms: {
      intro: [
        "Every subject has a vocabulary you must learn before you can say anything in it, and Accountancy is no exception. Before a single journal entry can be passed you must know exactly what capital means, what separates an asset from a liability, why a debtor is the opposite of a creditor, and why the discount written on a catalogue is not the discount written in the books. This chapter gives you that vocabulary — a couple of dozen precise terms — and precision is the whole point: in accountancy, two words that sound alike often mean very different things.",
        "These terms are not decoration; they are the labels on every account you will ever prepare. When Chapter 5 asks you to balance the accounting equation, it is asking you to place each amount under the right term. When Chapter 6 asks for a journal entry, it is asking which of these heads is debited and which is credited. Students who lose marks in later chapters usually lost them here, by treating terms loosely — calling a loan revenue, or counting goods taken for personal use as a sale.",
        "The chapter is best learned in pairs and contrasts: capital against drawings, assets against liabilities, debtor against creditor, trade discount against cash discount, profit against loss. Each pair looks similar on the surface, and the difference between each pair is a favourite exam question. Learn every term with a tiny example attached and it stays: capital is what the owner puts in, drawings is what the owner takes out, and every rupee in the business's books can be classified under one term or another."
      ],
      objectives: [
        "Define the basic terms of accountancy precisely, in the standard wording used in exams.",
        "Distinguish the owner's dealings — capital and drawings — from the business's dealings with outsiders.",
        "Apply the ownership test that separates assets from liabilities, and debtors from creditors.",
        "Differentiate revenue, expense, and income, and use them correctly in a profit calculation.",
        "Explain how goods move through purchases, stock, and sales, and why goods are not the same as assets.",
        "Compare trade discount with cash discount, and state how each is treated in the books."
      ],
      blocks: [
        {
          h: "The Business and Its Owner: Capital and Drawings",
          p: "The moment an owner puts money into a business, two worlds separate. The business becomes an entity of its own — it can own property, owe money, and keep books — and the owner's investment becomes something the business owes back to the owner. That owed-back amount is capital, and everything the owner later pulls out for personal use is drawings.",
          list: [
            { term: "Capital", def: "The amount invested by the owner in the business. The business treats it as a liability towards the owner, shown on the liabilities side of the Balance Sheet." },
            { term: "Drawings", def: "Cash, goods, or any other asset withdrawn by the owner for personal use. Drawings reduce the owner's capital." },
            { term: "Fresh capital", def: "Additional investment made by the owner during the year, which adds to capital just like the original investment." }
          ],
          example: "Suresh starts a shop with ₹3,00,000. During the year he adds ₹50,000 more, takes goods worth ₹20,000 for his daughter's wedding, and withdraws ₹10,000 cash. His total drawings are ₹20,000 + ₹10,000 = ₹30,000, and they reduce his capital by that amount — while any profit the business earns would add to it, and any loss would cut it further.",
          confusion: {
            a: "Capital",
            aText: "Money and goods going IN from the owner. It increases what the business owes the owner and strengthens the business.",
            b: "Drawings",
            bText: "Money and goods going OUT to the owner for personal use. It reduces the owner's stake in the business.",
            diff: "The direction of the owner's personal flow. Both are personal dealings of the owner with the business, and neither is revenue nor an expense of the business."
          },
          simple: "Think of the business as a separate person with its own purse. What the owner gives that person is capital; what the owner asks back for personal use is drawings.",
          note: "Capital is a liability of the business towards the owner — this follows directly from the business entity concept, and it is why capital appears on the liabilities side of the Balance Sheet."
        },
        {
          h: "Assets, Liabilities and the People Attached to Them",
          p: "A simple ownership test sorts almost everything in accounting into two piles. If the item gives the business a future benefit — it can be sold, used, or collected — it is an asset. If the business will eventually have to pay or perform for someone, it is a liability. The test is not about size or importance, only about who benefits and who is owed.",
          list: [
            { term: "Assets", def: "Economic resources owned by the business that are expected to bring future benefit — cash, bank balance, machinery, building, furniture, stock, and amounts owed by debtors." },
            { term: "Liabilities", def: "Financial obligations towards outsiders that must eventually be settled — creditors, bank loans, bills payable, and outstanding expenses." },
            { term: "Debtor", def: "A person who owes money TO the business, usually from a credit sale. Debtors are assets." },
            { term: "Creditor", def: "A person to whom the business owes money, usually from a credit purchase. Creditors are liabilities." },
            { term: "Solvent and Insolvent", def: "Solvent means assets exceed liabilities, so all debts can be paid in full. Insolvent means liabilities exceed assets, so they cannot." }
          ],
          real: "Sharma buys ₹15,000 of goods from Meena on credit. In Meena's books Sharma is a debtor and an asset — he will bring money in. In Sharma's books Meena is a creditor and a liability — money will eventually go out to her. The same deal, seen from two sides, produces opposite classifications.",
          confusion: {
            a: "Debtor",
            aText: "Owes money to the business. Created by a credit SALE, and shown on the assets side. The word smells of debt, but it is our money coming back to us.",
            b: "Creditor",
            bText: "Is owed money by the business. Created by a credit PURCHASE, and shown on the liabilities side.",
            diff: "Which direction the money will travel. A credit sale makes someone our debtor; a credit purchase makes someone our creditor. Asking who will pay whom settles it every time."
          },
          mistakes: [
            "Listing debtors among liabilities because the word sounds like debt — a debtor is money receivable, so it is an asset.",
            "Counting a bank overdraft as an asset — an overdraft is money the business owes the bank, so it is a liability.",
            "Forgetting outstanding expenses like unpaid salary among liabilities — the business owes that money even though no cash has left yet."
          ]
        },
        {
          h: "Revenue, Expense and Income: the Story of One Sale",
          p: "Money in and money out are not enough to judge performance — accountancy measures them against each other. Revenue is what the business earns from its regular, day-to-day operations, chiefly sales of goods or services. Expense is the cost of the resources used up in earning that revenue. Income is what remains when expenses are matched against revenue for a period.",
          formula: "Income = Revenue − Expense for the period\nProfit when Revenue exceeds Expense; Loss when Expense exceeds Revenue",
          example: "Anjali's boutique stitched a dress using cloth worth ₹800 and sold it for ₹1,200. The ₹1,200 is revenue; the ₹800 cloth cost is the expense matched against it; the remaining ₹400 is income from that one sale. Over a full year, all revenues are set against all expenses — if revenues win, the year's result is a profit; if expenses win, a loss.",
          simple: "Think of revenue as water flowing into a tank and expenses as water drawn out. Income is what remains in the tank at the end of the year — a profit if the tank still holds water, a loss if it has run dry.",
          note: "In strict accounting language, income is not a synonym for revenue: revenue is the total earned, and income is revenue minus the expenses incurred to earn it.",
          tip: "When a question asks for meaning and example, always attach a two-line example with a rupee figure — half the marks usually sit in the example."
        },
        {
          h: "Goods on the Move: Purchases, Sales and Stock",
          p: "The word goods is narrower than the word assets. Goods are the articles a business buys to sell, or makes to sell — nothing else. Everything the business owns for use rather than resale is an asset, even if it is the same kind of article. What counts as goods therefore depends on the business, not on the item itself.",
          list: [
            { term: "Purchases", def: "Goods bought for resale, or for use in producing what the business sells — for cash or on credit." },
            { term: "Sales", def: "Goods sold that the business had bought or manufactured for the purpose of resale — for cash or on credit." },
            { term: "Stock (Inventory)", def: "Goods lying unsold on a given date. Closing stock of one year becomes opening stock of the next." },
            { term: "Not goods", def: "Furniture the firm uses itself, a delivery scooter for an electronics dealer, machinery — these are assets, whatever they are made of." }
          ],
          example: "A furniture dealer buys 10 chairs to sell and 1 chair for the manager's cabin. The 10 are purchases (goods); the 1 is furniture (an asset). If she later sells 6 of the 10 chairs, those 6 are sales, and the 4 still unsold are closing stock.",
          simple: "The same chair can be goods or an asset depending on one question only: is this business in the business of selling chairs?",
          real: "A cloth merchant's cloth is goods; the same cloth, if taken by the owner for a family function, becomes drawings; and the shop's own curtain, bought to hang in the window, is an asset. One item, three terms, three treatments.",
          confusion: {
            a: "Purchases",
            aText: "Goods acquired to sell or process for sale. The Purchases account is debited like an expense, and goods leave it only when sold or taken out of the business.",
            b: "An asset bought for use",
            bText: "Machinery, furniture, or a delivery vehicle bought for the business's own use. No Purchases account is involved; the specific asset account is debited.",
            diff: "Purpose at the time of buying. For resale — goods and the Purchases account. For use in the business — an asset and its own account."
          }
        }
      ],
      advBlocks: [
        {
          h: "Discounts: the Two Kinds and Their Very Different Fates",
          p: "Discount is simply a reduction on a price, but accountancy recognises two kinds, and they are treated almost as opposites in the books. Trade discount is granted on the list price, usually for bulk buying, and is deducted before the invoice is even prepared. Cash discount is granted as a reward for prompt payment, after the invoice exists, and it does appear in the books.",
          list: [
            { term: "Trade discount", def: "Deducted from the list price before invoicing; never recorded separately; only the net invoice amount enters the books." },
            { term: "Cash discount", def: "Allowed on settlement for paying promptly; recorded in the books — Discount Allowed is an expense of the seller, Discount Received is income of the buyer." }
          ],
          example: "A sofa is listed at ₹10,000 with a 15% trade discount for bulk orders. Trade discount = ₹1,500, so the invoice is made for ₹8,500 — and ₹8,500 is the only figure ever recorded. If the buyer then pays within the prompt-payment period and gets a further 2% cash discount, that is ₹8,500 × 2/100 = ₹170; the buyer pays ₹8,330, and the seller records ₹8,330 in cash and ₹170 as Discount Allowed.",
          simple: "Trade discount happens at the door of the shop, before the bill is written, so the books never see it. Cash discount happens at the door of the cash box, while the bill is being settled, so the books record it as a real cost or a real gain.",
          note: "The net amount after trade discount is the invoice value; cash discount is calculated on that invoice value, not on the list price.",
          tip: "A classic one-marker asks why trade discount is not recorded. The answer: it is deducted before invoicing, so only the reduced price ever becomes a book entry — there is nothing left to record separately."
        },
        {
          h: "Building Up the Owner's Stake Over a Year",
          p: "Capital is not a statue; it moves through the year. Fresh investment pushes it up, profit pushes it up, losses pull it down, and drawings pull it down. At the year end one small formula gathers all four movements into a single closing figure — and this exact formula returns in the accounting equation chapter.",
          formula: "Opening Capital + Fresh Capital + Profit − Drawings = Closing Capital\n(Any loss for the year is subtracted along with drawings.)",
          example: "Ramesh began the year with capital of ₹2,20,000. He introduced ₹30,000 more in July, the business earned a profit of ₹85,000, and he withdrew ₹40,000 cash plus goods worth ₹10,000 for personal use. Closing capital = 2,20,000 + 30,000 + 85,000 − 50,000 = ₹2,85,000. Had the business made a loss of ₹15,000 instead of a profit, that loss would have been subtracted too.",
          real: "Parents often track savings exactly this way — opening balance, additions, interest earned, withdrawals. The owner's capital account of a business is the same arithmetic, kept with accountancy's precision.",
          note: "Drawings include goods as well as cash, valued at cost — ₹5,000 of goods taken is exactly as much a reduction of capital as ₹5,000 of cash taken."
        },
        {
          h: "Promises in Writing: Bills Receivable and Bills Payable",
          p: "When a debtor buys on credit, the business may ask for a written promise to pay — a bill of exchange. For the firm that will receive the money, that paper is a Bill Receivable, an asset. For the person who signed it and must pay, the same paper is a Bill Payable, a liability. The object is one; the classification flips with the side you stand on.",
          list: [
            { term: "Bill Receivable", def: "The firm's written claim on a debtor — an asset, because money is due to the business on a future date." },
            { term: "Bill Payable", def: "The firm's signed promise to pay a creditor on a future date — a liability." },
            { term: "The swap", def: "Accepting a bill reduces the open debtor balance and creates a bill receivable in its place; for the signer, it reduces the open creditor balance and creates a bill payable." }
          ],
          real: "Anjali sells ₹20,000 of fabric to a boutique on credit and takes the owner's signed bill, payable in 30 days. In Anjali's books it is a Bill Receivable of ₹20,000; in the boutique's books the identical paper is a Bill Payable of ₹20,000. If the boutique honours it, cash flows and both bills vanish; if it fails, Anjali falls back on the original debtor.",
          note: "A bill receivable belongs with assets and a bill payable with liabilities — the paper does not change when the classification does."
        },
        {
          h: "Four Timing Terms: Outstanding, Prepaid, Accrued, and Advance",
          p: "Almost every year end brings the same problem: an expense relates to this year but is unpaid, or a payment covers next year too, or income has been earned but not collected, or cash has arrived before the work is done. Accountancy names all four cases precisely, and Chapter 4 treats them in full — knowing the terms now makes that chapter much easier.",
          list: [
            { term: "Outstanding expense", def: "An expense already incurred but not yet paid — a liability, shown with the expenses on the liabilities side until it is paid." },
            { term: "Prepaid expense", def: "An expense paid now but relating to a future period — an asset, until that period arrives." },
            { term: "Accrued income", def: "Income earned in this period but not yet received — an asset, until it is received." },
            { term: "Income received in advance", def: "Cash received now for work not yet done — a liability, until it is earned." }
          ],
          example: "On 1 October a firm pays ₹18,000 as insurance for 12 months and its year ends on 31 March. Six months belong to this year, so ₹9,000 is this year's expense; the remaining ₹9,000 is prepaid expense — an asset. In the same month the firm earns ₹4,000 commission that the customer will pay next year: that ₹4,000 is accrued income, an asset of this year.",
          simple: "Two simple questions settle all four: has the benefit been used yet, and has the cash moved yet? Used but not paid is outstanding; paid but not used is prepaid; earned but not received is accrued; received but not earned is advance.",
          confusion: {
            a: "Accrued income",
            aText: "Earned first, cash later. The business has done the work, so it is income now — and the amount still to come is an asset.",
            b: "Income received in advance",
            bText: "Cash first, earned later. The money has arrived but the work is not done, so it is not income yet — it is a liability.",
            diff: "Which came first, the earning or the cash. Accrued income is money flying toward the business; advance income is money already landed that still has to be flown for."
          }
        }
      ],
      mistakes: [
        "Recording the owner's personal bill — paid from shop cash — as a business expense; it is drawings.",
        "Calling a bank loan or fresh capital revenue; neither is earned from the business's own operations.",
        "Recording trade discount separately in the books; only the net invoice amount is ever recorded.",
        "Treating goods taken by the owner for personal use as a sale or as an expense; they are drawings, and they reduce capital.",
        "Counting closing stock as part of the year's purchases or sales; unsold goods are stock, and they become next year's opening stock.",
        "Reversing debtor and creditor in credit transactions; always ask who will pay whom."
      ],
      summary: [
        "Capital is the owner's investment, treated as a liability of the business; drawings are the owner's withdrawals and reduce capital.",
        "Assets give future benefit; liabilities are obligations to outsiders; a firm is solvent or insolvent depending on which side is larger.",
        "A debtor owes money to the business (from a credit sale); a creditor is owed money by the business (from a credit purchase).",
        "Revenue is earned from regular operations; expense is the cost of earning it; income is revenue minus expense, and its direction decides profit or loss.",
        "Goods are what the business deals in; items bought for use are assets, and the same item can switch categories depending on purpose or use.",
        "Purchases add goods to the business, sales send them out, and what remains unsold is stock — closing stock of one year is opening stock of the next.",
        "Trade discount is never recorded separately; cash discount is recorded, as Discount Allowed or Discount Received.",
        "A transaction must change financial position and be measurable in money; a voucher is the evidence behind it, and an account is its classified home in the Ledger."
      ],
      check: [
        { q: "Classify these: machinery used in the factory; cloth bought by a cloth merchant for resale; the same cloth taken by the owner for a family function; amount owed by a credit customer.", a: "Machinery used in the factory — an asset, since it is held for use, not for resale. Cloth bought for resale — purchases (goods). Cloth taken by the owner personally — drawings, reducing capital. Amount owed by a credit customer — a debtor, which is an asset." },
        { q: "True or false: capital is money the owner has given to the business, so it belongs to the business and is not a liability. Give a reason.", a: "False. Under the business entity concept the business is treated as separate from its owner, so what the owner invested is an amount the business owes back to the owner. Capital therefore appears on the liabilities side of the Balance Sheet." },
        { q: "A firm's assets are ₹6,20,000 and its liabilities are ₹7,40,000. State whether the firm is solvent or insolvent, with the amount of the shortfall.", a: "Insolvent. Liabilities exceed assets by ₹7,40,000 − ₹6,20,000 = ₹1,20,000, so the firm cannot pay its debts in full. A firm is solvent only when its assets are worth more than its liabilities." },
        { q: "Explain in your own words why a wholesaler's 10% reduction for bulk buying is not recorded in the books, but a 2% reduction for prompt payment is.", a: "The bulk-buying reduction is a trade discount — it comes off the list price before the invoice is made, so the books only ever see the reduced invoice figure and there is nothing separate to record. The prompt-payment reduction is a cash discount — it is decided later, when the bill is settled, and it is a genuine cost to the giver and a genuine gain to the receiver, so it is recorded through Discount Allowed or Discount Received." }
      ]
    },

    tbase: {
      intro: [
        "Two accountants, given identical details of the same business, can honestly produce very different profit figures — unless they follow a common set of rules. The theory base of accounting exists to prevent exactly that. It is the shared foundation of assumptions, concepts, and principles — collectively called GAAP, Generally Accepted Accounting Principles — on which every set of accounts quietly rests. None of these rules is printed on the face of a Balance Sheet, yet every figure on it has been shaped by them.",
        "The foundation works in layers. At the bottom sit the three fundamental accounting assumptions — Going Concern, Consistency, and Accrual — so basic that they are simply assumed unless a business says otherwise. Above them sit concepts that decide what gets recorded and how it is measured: Business Entity, Money Measurement, Accounting Period, Cost, Dual Aspect, Revenue Recognition, and Matching. Above those sit conventions that keep the information honest: Full Disclosure, Consistency, Conservatism, Materiality, and Objectivity.",
        "This chapter also introduces the formal version of all this discipline. When principles are written down and issued by a recognised body — in India, the Institute of Chartered Accountants of India — they become Accounting Standards, and the newer IFRS-converged set known as Ind AS applies to larger companies. This layer matters beyond school: it is why two companies in the same industry can be compared at all, and why your own work in later chapters must follow fixed patterns rather than personal preference."
      ],
      objectives: [
        "Explain what the theory base of accounting is, and why GAAP is needed for reliable, comparable information.",
        "State and apply the three fundamental accounting assumptions: going concern, consistency, and accrual.",
        "Distinguish the major accounting concepts — entity, money measurement, accounting period, cost, dual aspect, revenue recognition, and matching — using examples.",
        "Apply the conventions of full disclosure, consistency, conservatism, materiality, and objectivity to practical situations.",
        "Compare the cash basis with the accrual basis of accounting, and state which is required for company accounts.",
        "Describe the purpose of Accounting Standards and Ind AS, and how they improve comparability."
      ],
      blocks: [
        {
          h: "The Three Assumptions in Action",
          p: "The fundamental accounting assumptions are not rules a teacher imposes; they are the quiet starting conditions of every question you will meet in Class 11. Unless a problem says a business is closing down, changing methods every year, or keeping cash books only, these three hold automatically — and most answers depend on them.",
          list: [
            { term: "Going Concern", def: "The business is assumed to continue operating for the foreseeable future. This is why a machine is carried at cost less depreciation rather than at what it would fetch in a distress sale — nobody expects a distress sale to happen." },
            { term: "Consistency", def: "The same accounting methods are applied period after period unless there is a genuine reason to change. This is what makes this year's profit comparable with last year's." },
            { term: "Accrual", def: "Revenues and costs are recognised when earned or incurred, not when cash moves. This single assumption is the bridge to the next chapter on bases of accounting." }
          ],
          example: "A firm buys a delivery van and expects to use it for years, so it is shown at cost less depreciation — going concern. The firm charges depreciation by the same straight-line method every year — consistency. December's electricity bill of ₹3,500, though paid in January, is deducted from December's revenue — accrual. Three assumptions, three everyday consequences.",
          simple: "These three are like the ground rules of a game: nobody announces them each play, but nothing makes sense without them. A question would have to tell you explicitly before any one of them stopped applying.",
          note: "Going Concern, Consistency and Accrual — that trio is where every assumption of the theory base begins. If a business plans to close next month, going concern can no longer be assumed."
        },
        {
          h: "What the Books Will Not Show: Entity and Money Measurement",
          p: "Two concepts decide the boundary of the accounting records themselves. The Business Entity concept keeps the business separate from its owner, so the owner's personal affairs never enter the business's books. The Money Measurement concept keeps out anything that cannot be expressed in rupees, however valuable it may be to the business.",
          list: [
            { term: "Business Entity", def: "The owner's personal car purchase stays out of the business's books; the owner's investment appears as capital, which the business owes back." },
            { term: "Money Measurement", def: "A customer's loyalty, an employee's skill, a competitor's new launch — all matter, none can be reliably measured in money, so none is recorded." },
            { term: "The combination", def: "It explains a common puzzle: capital is recorded, but the owner's private wealth is not; a credit sale is recorded, but a mere promise of future business is not." }
          ],
          real: "Fatima's salon is famous for its stylists, yet its Balance Sheet looks modest — reputation and skill have no invoice attached. Meanwhile a loan of ₹4,00,000 from the bank does appear, precisely because it has a money figure. The Balance Sheet shows what can be measured, not everything that is valuable.",
          confusion: {
            a: "Business Entity",
            aText: "Separates the BUSINESS from its OWNER. It decides whose transaction this is — the owner's personal buys stay out, and capital records what the business owes the owner.",
            b: "Money Measurement",
            bText: "Separates MONEY facts from NON-MONEY facts. It decides whether a transaction can enter the books at all, regardless of whose it is.",
            diff: "Entity is about the boundary between two people; money measurement is about the boundary between measurable and unmeasurable events. The owner's bank loan to the business passes both — it is the business's transaction, and it has a rupee value."
          }
        },
        {
          h: "Cost and Dual Aspect: How Numbers Enter and Why They Balance",
          p: "Once an event passes the entity and money-measurement boundaries, two further concepts control how it enters the books. The Cost concept fixes the number: an asset is recorded at the price actually paid to acquire it, keeping the figure objective and verifiable. The Dual Aspect concept fixes the structure: every transaction has a giving side and a receiving side, and both are recorded.",
          formula: "Asset recorded at acquisition cost (price paid plus expenses necessary to acquire it)\nEvery transaction has two aspects of equal amount, so Assets = Capital + Liabilities",
          example: "A trader buys a shop for ₹4,00,000 and pays ₹15,000 in registration and legal charges. The shop is recorded at ₹4,00,000 + ₹15,000 = ₹4,15,000 — the full acquisition cost, not the old owner's price alone and certainly not today's market value. When goods worth ₹60,000 are bought on credit, the dual aspect shows immediately: stock rises by ₹60,000 and creditors rise by ₹60,000 — two accounts, one amount, both sides of the equation moving together.",
          simple: "Cost answers how much do we write, and dual aspect answers how many places do we write it. The first keeps values objective; the second is why the accounting equation can never fall out of balance.",
          note: "Depreciation is applied to an asset's recorded cost — the cost concept is the reason a Balance Sheet may show less than market value, and that is a known limitation, not a mistake."
        },
        {
          h: "Revenue Recognition and Matching: Pinning Profit to the Right Period",
          p: "Two concepts decide which period a rupee of revenue or expense belongs to, and together they give the profit figure its meaning. Revenue Recognition says revenue is earned when goods are sold or a service is rendered — not when the cash arrives. Matching says that period's expenses must be set against that period's own revenue.",
          formula: "Revenue is recognised on sale or service (realisation), not on cash receipt\nProfit of a period = that period's revenue − the expenses incurred to earn it",
          example: "A firm delivers goods worth ₹75,000 in March; the customer pays only in May. Revenue Recognition puts the ₹75,000 in March's revenue. The same firm pays ₹18,000 on 1 October for 12 months' insurance, with the year ending 31 March: only six months (October to March) benefit this year, so Matching charges ₹9,000 to this year and leaves ₹9,000 to next year. Both concepts are simply asking: which period did this belong to?",
          simple: "Imagine each accounting period as a photograph. Revenue Recognition decides which photograph a sale appears in — the one taken when the goods left the shop, not when the money arrived. Matching ensures everything needed to produce that photograph — every cost of that sale — is in the same frame.",
          tip: "Case questions on these two concepts are near-certain marks. Name the concept first, then give the one-line reason — recognition is about the sale moment, matching about pairing costs with the revenue they produced."
        }
      ],
      advBlocks: [
        {
          h: "Cautious or Transparent: Conservatism and Full Disclosure",
          p: "Two conventions guard the accounts from opposite dangers. Conservatism guards against optimism: when there is genuine uncertainty, anticipate no profit, but provide for all possible losses. Full Disclosure guards against silence: disclose all significant information that could influence a user's judgement, however uncomfortable.",
          list: [
            { term: "Conservatism in practice", def: "Stock valued at the lower of cost or market price; a provision created for doubtful debts before any customer has actually defaulted; a probable loss from a court case provided for now, while a probable gain is recorded only when the case is actually won." },
            { term: "Full Disclosure in practice", def: "A pending lawsuit, a large guarantee given for another firm's loan, or a change in accounting method — all noted in the statements so that users are not misled by omission." }
          ],
          confusion: {
            a: "Conservatism (Prudence)",
            aText: "A rule of MEASUREMENT under uncertainty — be cautious in the numbers. Provide losses early, profits late.",
            b: "Full Disclosure",
            bText: "A rule of REPORTING — be complete in the information. Say everything significant, whether it flatters the business or not.",
            diff: "One decides what value to write; the other decides what to tell. A firm can be perfectly conservative and still violate full disclosure by hiding a contingency."
          },
          note: "The words to remember for prudence are exactly these: anticipate no profit, but provide for all possible losses."
        },
        {
          h: "Materiality and Objectivity: How Much Detail, and What Counts as Proof",
          p: "Two more conventions fine-tune the accounts. Materiality asks whether a detail is significant enough to influence anyone's decision. Objectivity asks whether a figure rests on evidence that someone else could independently check. Between them they decide what gets elaborate treatment, and what gets recorded at all.",
          list: [
            { term: "Materiality", def: "A ₹60 dustbin bought for the office could be shown as an asset and depreciated over five years, but no user's decision would change either way — so it is simply charged to expense this year. Trivial items may be combined; anything significant is shown separately." },
            { term: "Objectivity", def: "An accountant records a ₹80,000 purchase only after seeing the supplier's invoice and the cheque counterfoil — not on the owner's verbal word. Recorded amounts must rest on documents, not opinions." }
          ],
          simple: "Materiality is the accountant deciding this detail is too small for the main story; objectivity is the accountant refusing to write the story without papers to back every line.",
          real: "A company that writes off every pen and staple box separately buries its real performance in clutter — that is what materiality prevents. And a tax officer accepts figures only when vouchers exist behind them — that is objectivity at work.",
          tip: "In answers, materiality examples usually involve small amounts and objectivity examples usually mention documents — invoice, receipt, cheque counterfoil. Match the example to the concept and the mark is yours."
        },
        {
          h: "Cash Basis or Accrual Basis: the Same Year, Two Profits",
          p: "The theory base also fixes the choice of system. Under the cash basis, revenue and expenses are recorded only when cash actually moves — simple, but blind to amounts still owed to or by the business. Under the accrual basis, they are recorded when earned or incurred — complete, but requiring adjustment entries and some estimation.",
          example: "A consultancy bills ₹60,000 during the year and collects ₹45,000; its expenses are ₹25,000, of which ₹7,000 is still unpaid.\nAccrual basis profit = 60,000 − 25,000 = ₹35,000 (billed and incurred)\nCash basis profit = 45,000 − 18,000 = ₹27,000 (actually received and paid)\nThe two systems differ by exactly the amounts owed — ₹15,000 receivable less ₹7,000 payable.",
          confusion: {
            a: "Cash Basis",
            aText: "Records on the movement of cash. Simple, no estimates, but profit can be distorted by timing and the true financial position stays hidden.",
            b: "Accrual Basis",
            bText: "Records when revenue is earned and expenses incurred, whatever the cash timing. Gives a complete and matched picture, but needs adjustment entries and trained handling.",
            diff: "The trigger for recording — cash actually moving, versus the underlying earning or incurring. Chapter 4 works out the consequences line by line."
          },
          list: [
            { term: "Cash basis", def: "No debtors, no creditors, no outstanding or prepaid items in the records; profit can swing purely with cash timing." },
            { term: "Accrual basis", def: "Recognises amounts receivable and payable; satisfies the matching concept; is the basis the Companies Act requires from companies." }
          ]
        },
        {
          h: "From Principles to Paper: Accounting Standards and Ind AS",
          p: "Concepts and conventions shape accounts informally; Accounting Standards make the shaping formal. Accounting Standards (AS) are written documents issued by the Institute of Chartered Accountants of India (ICAI) that lay down uniform rules for recognising, measuring, presenting, and disclosing transactions. Indian Accounting Standards (Ind AS), converged with the International Financial Reporting Standards (IFRS), are issued by the Ministry of Corporate Affairs and apply mainly to larger companies based on criteria such as net worth and listing status.",
          list: [
            { term: "Objectives", def: "Uniformity in practice, better reliability and comparability, and less scope for different treatments of the same transaction." },
            { term: "Advantages", def: "Statements comparable across companies and years; fraud and manipulation harder to hide; auditors and regulators working from a common rulebook." },
            { term: "Limitations", def: "No set can cover every situation; some standards allow more than one acceptable treatment; a rigid rule cannot fit every business perfectly." }
          ],
          real: "An investor comparing one textile company with another can trust the comparison only because both measured closing stock, depreciation, and provisions under the same standards. Without them, every comparison would be guesswork about which rules each firm chose.",
          note: "AS are issued by the ICAI and apply broadly; Ind AS are converged with IFRS and apply mainly to larger specified companies. Both exist together — neither has replaced the other for every company.",
          tip: "GAAP, AS and Ind AS is a recurring three or four-mark note. Always mention the ICAI as the body that issues Accounting Standards in India — that single line frequently carries a mark."
        }
      ],
      mistakes: [
        "Confusing consistency (a method followed year after year) with comparability (the quality of information that consistent methods produce).",
        "Mixing conservatism with full disclosure — one is caution in measurement, the other completeness in reporting.",
        "Calling materiality or conservatism a fundamental assumption — the only three assumptions are going concern, consistency, and accrual.",
        "Recording an asset at its list price and forgetting acquisition expenses such as registration and legal charges.",
        "Believing Ind AS have replaced AS for every company in India — Ind AS apply mainly to larger companies meeting specified criteria.",
        "Thinking going concern means assets never lose value — it only means the business is not being wound up, so assets are carried at cost less depreciation rather than at forced-sale prices."
      ],
      summary: [
        "The theory base is the shared set of assumptions, concepts, and conventions — collectively GAAP — that keeps accounting information reliable and comparable.",
        "The three fundamental assumptions are Going Concern, Consistency, and Accrual.",
        "Business Entity separates owner and business; Money Measurement admits only money-measurable events; Accounting Period splits the business's life into regular reporting intervals.",
        "Cost records assets at acquisition cost; Dual Aspect gives every transaction two equal sides and underlies Assets = Capital + Liabilities.",
        "Revenue Recognition places revenue at the moment of sale or service; Matching places each expense in the period whose revenue it helped earn.",
        "Full Disclosure, Consistency, Conservatism, Materiality, and Objectivity keep the accounts honest, comparable, cautious, and verifiable.",
        "Cash basis records only cash movement; accrual basis records earning and incurrence, and is required for company accounts.",
        "AS, issued by the ICAI, and Ind AS, converged with IFRS for larger companies, formalise all of the above into written, enforceable rules."
      ],
      check: [
        { q: "A firm values its closing stock at the lower of cost and market price, provides for a probable court loss, and discloses a large guarantee in its notes. Name the three conventions being followed.", a: "Valuing stock at the lower figure and providing for a probable loss follow Conservatism (Prudence) — anticipate no profit, provide for all possible losses. Disclosing the guarantee follows Full Disclosure — all significant information that could influence a user must be shared." },
        { q: "True or false: materiality is one of the three fundamental accounting assumptions. Correct the statement if it is wrong.", a: "False. The three fundamental accounting assumptions are Going Concern, Consistency, and Accrual. Materiality is an accounting convention — it only says that trivial items need not be separately disclosed in detail." },
        { q: "Distinguish Accounting Standards (AS) from Indian Accounting Standards (Ind AS) in two lines.", a: "AS are issued by the ICAI and apply broadly to enterprises preparing accounts under Indian requirements. Ind AS are converged with IFRS, are issued by the Ministry of Corporate Affairs, and apply mainly to larger companies meeting specified criteria like net worth and listing status." },
        { q: "Explain in your own words why a business on accrual basis records December's electricity bill in December even though the cash leaves in January.", a: "Because under accrual accounting — and the accrual assumption — costs are recognised when they are incurred, not when they are paid. The electricity was used in December, so the cost belongs to December's accounts and is matched against December's revenue; the later payment only creates an outstanding expense liability at the year end." }
      ]
    },

    basis: {
      intro: [
        "Here is a small question with large consequences: when should a rupee be written in the books — when it is earned, or when it arrives? The answer you give is your basis of accounting. Choose the cash basis and a business looks rich in months when customers pay and poor in months when they do not, even if nothing about its real performance has changed. Choose the accrual basis and each period's result reflects the work actually done in that period.",
        "Chapter 3 introduced both bases in a few lines; this chapter opens them up. The heart of the matter is what happens at a year end, when four familiar situations appear — an expense incurred but unpaid, a payment covering next year, income earned but not received, and cash received for work not yet done. Under the cash basis none of these are adjusted at all; under the accrual basis all four are, each with a specific name and a specific place in the Balance Sheet.",
        "This is also the first chapter where two profit figures can genuinely coexist for the same business and the same year, and learning to convert one into the other is a core exam skill. Beyond the examination, the choice of basis explains why a shopkeeper's diary and a company's accounts look so different, why the Companies Act insists on accrual accounting for companies, and why the accounting standards you met in the theory base chapter assume accrual almost everywhere."
      ],
      objectives: [
        "Define a basis of accounting and state what it actually decides.",
        "Explain the cash basis — its features, advantages, and limitations.",
        "Explain the accrual basis and how it applies the matching concept.",
        "Classify year-end items as outstanding expense, prepaid expense, accrued income, or income received in advance, and state the Balance Sheet treatment of each.",
        "Convert a cash basis profit figure into an accrual basis profit, and explain why the two differ."
      ],
      blocks: [
        {
          h: "One Year, Two Profits: the Cash and Accrual Views",
          p: "The difference between the bases is not a matter of opinion — it can be calculated rupee by rupee. Take a single year of a small consultancy and run it through both systems: the accrual basis counts everything earned and everything incurred; the cash basis counts only what actually arrived and what actually left.",
          example: "During the year the firm bills clients ₹60,000 and collects ₹45,000. Expenses incurred are ₹25,000, of which ₹18,000 has been paid.\nAccrual basis: income ₹60,000 − expenses ₹25,000 = profit ₹35,000\nCash basis: cash received ₹45,000 − cash paid ₹18,000 = profit ₹27,000\nThe gap of ₹8,000 is exactly ₹15,000 still receivable minus ₹7,000 still payable.",
          simple: "The cash basis asks one question about everything — has the money moved? The accrual basis asks a different question — has the business earned it or incurred it? Same transactions, different questions, different profits.",
          note: "Unless a question states otherwise, CBSE problems assume accrual basis — and when the choice of basis changes your answer, say in one line which basis you used."
        },
        {
          h: "The Four Year-End Adjustments at a Glance",
          p: "Every accrual adjustment has the same shape: one effect in the Statement of Profit and Loss, and one in the Balance Sheet. Memorise the four names and their Balance Sheet homes, and most of this chapter's questions answer themselves.",
          list: [
            { term: "Outstanding expense", def: "Expense of this period, still unpaid. Shown as a liability until paid — for example, salary of ₹12,000 for March, paid in April." },
            { term: "Prepaid expense", def: "Payment made now for a future period's benefit. The unexpired part is an asset — for example, insurance paid for twelve months, part of which covers next year." },
            { term: "Accrued income", def: "Earned this period, still to be received. Shown as an asset until received — for example, commission earned but not yet banked." },
            { term: "Income received in advance", def: "Cash received now for work not yet done. A liability until it is earned — for example, rent received for next month." }
          ],
          confusion: {
            a: "Accrued income",
            aText: "Earned but not received. It is this period's income, and the amount still to come is an asset of the business.",
            b: "Income received in advance",
            bText: "Received but not earned. It is not this period's income yet, and the obligation to earn or refund it is a liability.",
            diff: "Whether the earning has happened. Accrued income has been earned and merely awaits cash; advance income has the cash and awaits the earning."
          },
          real: "A tuition teacher who teaches in March but collects fees in April is living with an accrued income. A landlord who collects April's rent on 29 March is holding an income received in advance. Neither is unusual — both appear every year in every business.",
          tip: "The four adjustments are often tested as a matching exercise: name the item, name its Balance Sheet side. OutstAnding and prEpaid, Accrued income and income received in advance — OPAI gets you through."
        },
        {
          h: "Splitting a Payment Across Two Periods",
          p: "Prepaid expenses and advance incomes share one mechanical skill: dividing a cash amount by the months it covers. The monthly figure is the cash amount divided by the number of months covered; the months falling in the current period are charged to this year, and the rest is carried forward as an asset or a liability.",
          example: "On 1 September a firm pays ₹36,000 as insurance for twelve months, and its year ends on 31 March.\nMonthly cost = 36,000 ÷ 12 = ₹3,000\nMonths in this year (September to March) = 7, so insurance expense = 3,000 × 7 = ₹21,000\nPrepaid insurance carried forward = 36,000 − 21,000 = ₹15,000 (an asset)\nUnder the cash basis, the whole ₹36,000 would have been charged to this year, with no split at all.",
          simple: "Think of the payment as a bar of chocolate numbered month by month. Accrual accounting bites off only the squares belonging to this year and wraps up the rest for next year; cash basis swallows the whole bar in the month it was bought.",
          note: "Count the months the benefit actually covers — not the months since the payment date by habit. One miscounted month is one month of expense sitting in the wrong year."
        },
        {
          h: "Which Items Exist Only Under Accrual",
          p: "A subtle but examinable point: outstanding expenses, prepaid expenses, accrued incomes, and advance incomes are not features of the cash basis at all — the cash basis has no mechanism to record them, because nothing has moved in cash yet. Recognising these four Balance Sheet items is what distinguishes accrual records from cash records in practice.",
          list: [
            { term: "Cash basis, unpaid salary of ₹15,000 for March", def: "Recorded only when paid, in the month of payment. March itself shows nothing." },
            { term: "Accrual basis, same salary", def: "March's expense, with Outstanding Salary of ₹15,000 shown as a liability at 31 March." },
            { term: "Cash basis, credit sale of ₹25,000 in March, paid in April", def: "The sale appears in April, when the cash arrives." },
            { term: "Accrual basis, same sale", def: "March's revenue, with Debtors of ₹25,000 shown as an asset at 31 March." }
          ],
          simple: "If a Balance Sheet shows debtors, creditors, or any outstanding or prepaid item, accrual accounting is at work — under pure cash basis none of them could exist.",
          note: "Credit transactions are recorded in the accrual system the moment goods are delivered or received, whether or not any cash has changed hands."
        }
      ],
      advBlocks: [
        {
          h: "Why Cash Timing Can Flatter or Squeeze a Year",
          p: "Cash basis profit has a weakness that goes beyond incompleteness: it can swing dramatically between two years while the business's real performance barely changes, simply because large payments or receipts fall on one side of the year end or the other. Accrual profit is immune to this, because it never looks at the calendar of cash.",
          example: "A trader's real performance is steady — he earns ₹50,000 a year of accrual profit, year after year. One year he happens to pay a creditor ₹60,000 on 30 March; the next year the same style of payment lands on 2 April.\nYear 1 cash basis: the ₹60,000 outflow strikes this year's cash profits.\nYear 2 cash basis: the same outflow belongs to next year.\nThe cash basis swings by ₹60,000 while accrual profit stays at ₹50,000 in both years — because in economic terms, nothing really changed.",
          simple: "Cash basis profit is like judging a student by the days they happened to submit assignments; accrual profit is like judging them by the term's actual work.",
          real: "This is why a growing firm can look broke in the month it pre-pays a large order, and rich in the month its customers pay last year's bills. The bank, which sees cash, knows the truth; the accrual accounts show it every month."
        },
        {
          h: "Hybrid Basis: Using Both at Once",
          p: "Some small businesses quietly use the cash basis for some items and the accrual basis for others — perhaps recording credit sales like an accrual firm, but ignoring outstanding expenses like a cash firm. This mixed practice is called the hybrid basis. It is useful to recognise in a question, but it has no theoretical standing: it satisfies neither system fully, is not permitted for company accounts, and cannot be recommended.",
          list: [
            { term: "How it appears", def: "Debtors recorded (an accrual feature) but prepaid expenses ignored (a cash feature), often chosen so that profit looks better." },
            { term: "Why it fails in theory", def: "The matching concept cannot be satisfied partially — an expense either belongs to the period or it does not." },
            { term: "What to write in an exam", def: "Define it, give the small example, and end with the standard verdict — it has no theoretical validity." }
          ],
          simple: "Half-basis accounting is like driving with only one of the two mirrors adjusted — convenient until the moment the missing view matters.",
          tip: "The hybrid basis is a short-note question, not a numerical one. Definition, one example, one verdict — three lines, and the mark is complete."
        },
        {
          h: "Who Uses Which Basis, and Why the Law Cares",
          p: "The choice of basis is not free for everyone. Very small non-corporate entities and many professionals may keep cash basis books, because their transactions are few, mostly cash, and the difference rarely matters enough to justify the extra work. Companies, however, must use the accrual basis — the Companies Act requires it, and virtually every Accounting Standard and Indian Accounting Standard assumes it.",
          list: [
            { term: "Cash basis suits", def: "A tea stall, a tuition teacher, a small trader with mostly cash dealings — simple records, no estimates, no adjustment entries." },
            { term: "Accrual basis is required for", def: "Companies, and it is assumed in standard school problems unless the question says otherwise." },
            { term: "Users' perspective", def: "An outside lender or investor always prefers accrual accounts, because only those show amounts receivable and payable — and therefore the true financial position." }
          ],
          real: "Ritu's tiffin service can honestly run a cash diary for years. The day she incorporates a private limited company to expand, her accountant must switch everything to accrual — and the outstanding and prepaid items she never tracked before suddenly all have to be found.",
          confusion: {
            a: "Cash Basis",
            aText: "Records only actual cash movement. Legally acceptable for very small non-corporate entities and professionals; simple, but incomplete and potentially misleading.",
            b: "Accrual Basis",
            bText: "Records earnings and incurrences as they occur. Mandatory for companies under the Companies Act and assumed by AS and Ind AS; complete, but complex.",
            diff: "Legal standing and completeness. The question's wording decides which applies — if it does not say, assume accrual."
          }
        },
        {
          h: "Every Adjustment Keeps the Equation Balanced",
          p: "The four timing adjustments look like profit-and-loss business, but each one is really a two-effect transaction of exactly the kind the accounting equation chapter trains you for. One effect lands in the Statement of Profit and Loss, changing capital; the other lands in the Balance Sheet, as an asset or a liability. Nothing about the equation's balance is ever disturbed.",
          example: "Outstanding salary of ₹12,000 at the year end:\nExpense side: salary expense rises by ₹12,000, so profit falls and capital falls by ₹12,000\nBalance Sheet side: a liability — Outstanding Salary — rises by ₹12,000\nEquation check: assets unchanged; capital −12,000 and liabilities +12,000 — still equal.\nPrepaid insurance of ₹9,000 works the reverse way: capital rises by ₹9,000 (this year's expense is smaller) and an asset — prepaid insurance — rises by ₹9,000.",
          simple: "Every adjustment is a two-sided arrow: one head in the profit statement, one head in the Balance Sheet. Find both and the equation proves your answer by balancing.",
          note: "This is why teachers insist on finding both effects of every adjustment — a one-sided adjustment tilts the equation, and the final accounts will not agree."
        }
      ],
      mistakes: [
        "Assuming the cash and accrual profits are usually close — any outstanding, prepaid, accrued, or advance item makes them differ by exactly those amounts.",
        "Charging the full ₹36,000 insurance to this year under accrual basis — only the months belonging to this year may be charged; the rest is a prepaid asset.",
        "Showing income received in advance as income of the current year — until it is earned it is a liability, not revenue.",
        "Thinking the cash basis is illegal for every business — it remains acceptable for very small non-corporate entities and professionals; only companies must use accrual.",
        "Adding an outstanding expense to cash basis profit — an outstanding expense reduces accrual profit relative to cash profit; it is subtracted in the conversion, not added.",
        "Mixing up accrued income with advance income — accrued is an asset (earned, not received), advance is a liability (received, not earned)."
      ],
      summary: [
        "A basis of accounting is the rule that decides when a revenue or expense is recorded in the books.",
        "Cash basis records only actual cash movement — simple, but it ignores amounts owed and can misstate profit.",
        "Accrual basis records revenue when earned and expense when incurred — complete, matched, and mandatory for companies.",
        "Outstanding expense (liability), prepaid expense (asset), accrued income (asset), and income received in advance (liability) are the four accrual adjustments — OPAI.",
        "Prepayments and advances are split by months: the current period takes its share, and the rest is carried forward.",
        "Cash basis profit converts to accrual profit by subtracting outstanding expenses and advance incomes, and adding prepaid expenses and accrued incomes.",
        "Each accrual adjustment has two effects — one in the profit statement and one in the Balance Sheet — so the accounting equation always stays balanced."
      ],
      check: [
        { q: "A firm's cash basis profit is ₹2,40,000. Outstanding expenses ₹20,000, prepaid expenses ₹6,000, accrued income ₹9,000, and income received in advance ₹12,000. Find the accrual basis profit.", a: "Accrual profit = 2,40,000 − 20,000 + 6,000 + 9,000 − 12,000 = ₹2,23,000. Outstanding expenses and advance incomes are subtracted because accrual basis recognises costs and unearned receipts that cash basis ignored; prepaid expenses and accrued incomes are added for the same reason in reverse." },
        { q: "Classify these Balance Sheet items: outstanding rent, prepaid insurance, accrued commission, and rent received for next month.", a: "Outstanding rent — a liability (incurred, not yet paid). Prepaid insurance — an asset (paid, benefit still to come). Accrued commission — an asset (earned, not yet received). Rent received for next month — a liability (received, not yet earned)." },
        { q: "True or false: under the cash basis, an expense incurred in March but paid in April appears in March's accounts. Give a reason.", a: "False. The cash basis records an expense only when cash is actually paid, so the amount appears in April, whenever payment is made. Only the accrual basis would record it in March, since that is when it was incurred." },
        { q: "Explain in your own words why the Companies Act requires accrual accounting rather than cash accounting.", a: "Because only the accrual basis matches each period's expenses against the revenue of that same period and recognises amounts still receivable and payable. That is what makes a company's profit figure meaningful and its Balance Sheet complete — a cash basis account could show a healthy profit to a company that actually cannot pay its bills, which is exactly what shareholders and lenders are entitled to avoid." }
      ]
    },

    equation: {
      intro: [
        "Every rupee a business holds came from somewhere — the owner, or someone the business owes. That single fact is the whole content of the accounting equation. On one side stand the assets, everything the business owns; on the other stand capital and liabilities, the two claims against those assets. The equation Assets = Capital + Liabilities is not a formula to memorise but a description of reality, and it stays true after every single transaction a business ever records.",
        "What makes the chapter satisfying is that the balance is never maintained by care — it is maintained by logic. Because every transaction has two effects of equal amount (the dual aspect concept from the theory base chapter), the two sides of the equation move together: they may both rise, both fall, or one asset may swap into another, but they cannot drift apart. If your totals ever disagree, the error is always findable, and that is what makes this chapter such good training.",
        "Practically, this chapter is where accounting stops being vocabulary and starts being arithmetic. You will learn to track a business transaction by transaction, watch capital grow with profit and shrink with drawings, and work backwards to find a missing asset or an unknown liability. The column method you build here is the same thinking that underlies every journal entry in Chapter 6 and every ledger account thereafter — this is the bridge from words to numbers."
      ],
      objectives: [
        "State the accounting equation and explain why it remains balanced after every transaction.",
        "Identify the two effects of a transaction on assets, capital, and liabilities.",
        "Apply the column method to a series of transactions, showing the equation after each one.",
        "Explain how revenue, expenses, profit, loss, and drawings change capital.",
        "Find a missing element of the equation — assets, capital, or liabilities — from the other two.",
        "Trace how the equation effects become the debits and credits of the next chapter."
      ],
      blocks: [
        {
          h: "Setting Up: the Column Method",
          p: "A single line of arithmetic gets messy after three transactions, so accountants use columns. Write the equation with one column for each head — assets broken into their own columns, then capital and liabilities — enter the opening figures, and record each transaction as a new row with its two effects. The check is constant: the total of the asset columns must equal capital plus liabilities, after every row.",
          list: [
            { term: "Step 1", def: "List every asset head and every liability head as its own column, with capital between them." },
            { term: "Step 2", def: "Enter the opening position — what the owner started with, and anything already owed." },
            { term: "Step 3", def: "For each transaction, find its two effects and write both, with the same amount." },
            { term: "Step 4", def: "Re-total both sides after each transaction; if they disagree, one effect is missing or wrong." },
            { term: "Step 5", def: "Continue until the closing balances asked for are reached." }
          ],
          simple: "Think of the two sides as two pockets of the same pair of trousers. Money may move from the left pocket to the right, or appear in both, but the trousers never lose or gain a rupee in the process.",
          tip: "CBSE examiners award a mark for each correct balance in a series question, not just for the final figure. Show the equation after every transaction in a clean table — never jump straight to the answer."
        },
        {
          h: "A Business Grows: Transactions Line by Line",
          p: "Nothing teaches the equation like watching one. Here is Meena's first week — start with the opening position and apply each transaction, and the balance survives all of them.",
          example: "Meena starts with cash of ₹1,00,000. Assets = 1,00,000; Capital = 1,00,000; Liabilities = 0.\nBuys furniture for ₹25,000 cash: cash 75,000 + furniture 25,000 = 1,00,000; capital 1,00,000. Totals unchanged — an asset-for-asset swap.\nBuys goods worth ₹40,000 on credit: stock 40,000 added. Assets 1,40,000 = capital 1,00,000 + creditors 40,000.\nPays the creditor ₹15,000: cash falls to 60,000 and creditors to 25,000. Assets 1,25,000 = 1,00,000 + 25,000.\nSells goods costing ₹18,000 for ₹25,000 cash: stock falls to 22,000 and cash rises to 85,000; capital gains the profit of 7,000. Assets 1,32,000 = capital 1,07,000 + liabilities 25,000.\nWithdraws ₹5,000 for personal use: cash 80,000; capital 1,02,000. Assets 1,27,000 = 1,02,000 + 25,000 — still balanced.",
          note: "Notice the sale moved three heads at once — cash up, stock down, capital up by the profit. Transactions with more than two effects are still perfectly balanced; the effects simply include the profit element.",
          real: "Every line above could be printed as a shop's weekly diary. The equation is simply the diary kept in two columns, so that at any moment the owner can see what the business holds and who has a claim on it."
        },
        {
          h: "What Moves Capital — and What Never Does",
          p: "Most equation errors come from touching capital when it should stay untouched. Capital is the owner's stake, so only owner actions and the business's own results move it: fresh investment and income push it up; losses, expenses, and drawings push it down. Anything that merely settles or rearranges obligations and resources leaves capital exactly where it is.",
          list: [
            { term: "Capital rises", def: "The owner introduces fresh capital; the business earns revenue or makes a profit." },
            { term: "Capital falls", def: "The business suffers a loss or incurs an expense; the owner makes drawings." },
            { term: "Capital never moves", def: "Buying an asset for cash, buying an asset on credit, paying a creditor, a debtor paying what they owe, depositing cash in the bank — pure asset, liability, or asset-liability rearrangements." }
          ],
          confusion: {
            a: "Paying a creditor ₹20,000",
            aText: "Cash falls by 20,000 and creditors fall by 20,000. An asset and a liability shrink together; capital is untouched — the business does not lose wealth by settling its own debt.",
            b: "Paying rent of ₹20,000",
            bText: "Cash falls by 20,000 and capital falls by 20,000, because rent is an expense of running the business this period.",
            diff: "Whether something is consumed. Settling a debt consumes nothing — it only exchanges a liability for the cash that clears it. Paying rent consumes the benefit of the premises, so capital absorbs it."
          },
          real: "A shopkeeper who confuses the two will believe his wealth fell every time he paid a supplier. It did not — his assets and his obligations fell together. His wealth falls only when he spends on something, or takes money out.",
          mistakes: [
            "Reducing capital when a creditor is paid — both cash and creditors fall equally.",
            "Forgetting the profit element of a sale — the sale price and the cost of goods are separate effects, and capital rises only by the difference.",
            "Treating drawings as an expense — they reduce capital directly and never appear in the profit statement.",
            "Recording a credit purchase as an increase in assets alone — creditors must rise by the same amount."
          ]
        },
        {
          h: "Working Backwards: Finding a Missing Head",
          p: "Many questions hide one element and ask you to find it — and the equation answers every time, because with two elements known, the third is arithmetic. Total the known side, apply the equation, and the gap is the answer. The same method finds a missing asset when all liabilities and capital are given.",
          formula: "Capital = Assets − Liabilities\nLiabilities = Assets − Capital\nAssets = Capital + Liabilities\nMissing asset = required total assets − known assets",
          example: "A firm has capital of ₹1,50,000 and liabilities of a loan ₹40,000 plus outstanding wages ₹8,000. Total liabilities = 48,000, so assets must be 1,50,000 + 48,000 = ₹1,98,000. If the known assets are cash ₹20,000, stock ₹60,000, and debtors ₹30,000 (total 1,10,000), the remaining asset is 1,98,000 − 1,10,000 = ₹88,000 — perhaps machinery, perhaps prepaid insurance, depending on what the question says.",
          simple: "The equation is three corners of a triangle. Cover any corner with your thumb, and the other two tell you exactly what is hidden underneath.",
          tip: "Before subtracting, check that every liability is counted — outstanding expenses and bank overdrafts hide in the list precisely because students forget them."
        },
        {
          h: "From Equation Effects to Debit and Credit",
          p: "This chapter is not an island. Every effect you have been writing in columns becomes, in the next chapter, one debit and one credit. An asset increasing is a debit; capital increasing is a credit; an expense falling due reduces capital, so the expense is a debit — the modern approach to debit and credit is simply the accounting equation in another notation.",
          list: [
            { term: "Assets", def: "An asset rise is a Debit; an asset fall is a Credit — same as in your columns." },
            { term: "Liabilities", def: "A liability rise is a Credit; a liability fall is a Debit." },
            { term: "Capital", def: "Capital rises (income, profit, fresh capital) with a Credit; capital falls (expense, loss, drawings) with a Debit." },
            { term: "The statements", def: "The Balance Sheet heads in your columns become the Balance Sheet directly; the revenue and expense effects become the Statement of Profit and Loss." }
          ],
          real: "When Meena's sale pushed capital up by ₹7,000, her accountant eventually wrote exactly two lines recording it — one debit for the cash that came in, one credit for the sale. The equation columns and the journal entry are the same fact, written twice in two languages.",
          note: "If the debit-credit rules ever feel arbitrary, come back here: they are the equation's arithmetic, given new names."
        }
      ],
      advBlocks: [
        {
          h: "Transactions That Touch Three Heads",
          p: "Simple transactions move two heads; trading transactions often move more, because profit hides inside them. The sale of goods is the classic case: one effect brings in the sale proceeds, another sends out the goods at their cost, and capital rises only by the difference between the two.",
          example: "Goods costing ₹12,000 are sold for ₹16,000 — ₹8,000 in cash and ₹8,000 on credit.\nCash (asset) rises by 8,000\nDebtors (asset) rise by 8,000\nStock (asset) falls by 12,000\nCapital rises by the profit of 4,000\nNet effect on assets: +8,000 + 8,000 − 12,000 = +4,000, matching the capital rise exactly. Assets 4,000 more = capital 4,000 more — balanced, as always.",
          simple: "Every sale carries two price tags — the price the customer pays, and the price the shop paid for the goods. The equation tracks both, and the owner's stake grows only by the gap between them.",
          note: "A credit sale recognises revenue in full the moment the goods are delivered — the portion still to be collected simply sits in debtors."
        },
        {
          h: "The Capital Ladder: Opening, Additions, Profit, Drawings",
          p: "Capital questions in this chapter are almost always dressed-up versions of one ladder. Start with the opening figure, climb with fresh capital and profit, descend with losses and drawings, and you arrive at the capital that must appear in the closing equation.",
          formula: "Closing Capital = Opening Capital + Fresh Capital + Profit − Drawings − Loss",
          example: "A firm opened the year with capital of ₹90,000. During the year the owner introduced machinery worth ₹15,000 as further capital, the business earned a profit of ₹20,000, and the owner withdrew ₹9,000 in cash.\nClosing capital = 90,000 + 15,000 + 20,000 − 9,000 = ₹1,16,000\nIf total liabilities are ₹54,000, closing assets must be 1,16,000 + 54,000 = ₹1,70,000.",
          real: "This is the same arithmetic a family uses to track savings across a year — opening balance, additions, interest, withdrawals — done with accountancy's insistence that every figure has a name and a source.",
          tip: "Machinery introduced as further capital is capital, not a loan — the wording introduced by the owner is what decides. Borrowed money, however useful, always belongs to liabilities."
        },
        {
          h: "Verification Questions: Proving and Locating the Balance",
          p: "A whole family of exam questions turns the equation into a detective tool. Some ask you to verify that a given position balances; others admit a discrepancy and ask for its size; a few ask you to name the missing head. All are solved the same way — calculate both sides independently, then compare.",
          example: "A firm reports capital of ₹1,80,000 and liabilities of ₹60,000, but its listed assets total only ₹2,25,000.\nRequired assets = 1,80,000 + 60,000 = ₹2,40,000\nListed assets = ₹2,25,000\nDiscrepancy = 2,40,000 − 2,25,000 = ₹15,000\nEither an asset of ₹15,000 has not been listed, or capital or liabilities have been overstated by that amount — if the question only asks for the size of the gap, the gap is the answer.",
          simple: "Think of the equation as a drawing of a scales. If one side of the sketch weighs more than the paper shows, the difference tells you exactly how much drawing is missing.",
          note: "When only the discrepancy is asked for, do not guess which item is wrong — state the gap and the two possible explanations, and stop."
        },
        {
          h: "Patterns as Shortcuts: Naming the Move Before Calculating",
          p: "Experienced students do not calculate their way through each transaction — they name its pattern first, and the arithmetic follows. Six patterns cover almost everything this chapter contains, and recognising them turns long questions into quick, confident ones.",
          list: [
            { term: "Asset for asset", def: "₹10,000 withdrawn from bank for office use — cash up 10,000, bank down 10,000. Nothing else moves." },
            { term: "Asset up, liability up", def: "Goods of ₹30,000 bought on credit — stock up 30,000, creditors up 30,000." },
            { term: "Asset up, capital up", def: "₹50,000 fresh capital brought in, or a cash sale — the asset and the owner's stake rise together." },
            { term: "Asset down, liability down", def: "₹12,000 paid to a creditor — cash down 12,000, creditors down 12,000." },
            { term: "Asset down, capital down", def: "Rent of ₹6,000 paid, or drawings of ₹6,000 — an expense or a withdrawal consumes value." },
            { term: "Liability up, capital down", def: "An expense incurred but not yet paid — the obligation rises and the owner's stake falls by the expense." }
          ],
          simple: "Name the pattern, then fill in the amounts. It is the difference between reading every sign on a road and simply knowing that red means stop.",
          tip: "In long questions, write the pattern name in the working — it forces you to decide what is happening before you compute, and it earns method marks when arithmetic slips."
        },
        {
          h: "From the Equation to the Books",
          p: "The equation is the skeleton of the entire book-keeping system, and it is worth being explicit about where it leads. The asset, liability, and capital columns of your table become, almost unchanged, the two sides of the Balance Sheet. The revenue and expense effects that moved capital become the Statement of Profit and Loss. And every pair of effects you have written as plus and minus will become, in Chapter 6, a pair of debit and credit entries in the Journal.",
          list: [
            { term: "Equation columns to Balance Sheet heads", def: "Each column's closing balance appears in the Balance Sheet under its own heading." },
            { term: "Capital-affecting effects to the profit statement", def: "Incomes and expenses decide the profit that itself updates capital." },
            { term: "Two effects to two entries", def: "One debit and one credit of equal amount — the language of the Journal." }
          ],
          simple: "If the accounting chapters were a building, this chapter is its frame. The Journal bricks it up, the Ledger rooms it, and the financial statements move the family in.",
          real: "Meena's week of transactions, written as equation rows, can be re-read as journal entries without changing a single rupee. That consistency is not luck — it is double entry, and it is what allows a bank to trust the statements a business prepares about itself."
        }
      ],
      mistakes: [
        "Recording a credit purchase as an increase in assets only — creditors must rise by exactly the same amount, or the equation silently stops balancing.",
        "Deducting a creditor payment from capital — it reduces cash and creditors equally; capital is only touched by income, expense, profit, loss, and drawings.",
        "Forgetting that a sale's profit, not its price, increases capital — the cost of the goods sold is a separate, downward effect.",
        "Treating drawings as a business expense — they are the owner's withdrawal, reducing capital directly, with no place in the profit statement.",
        "Counting a bank overdraft as an asset — it is money owed to the bank, so it sits with liabilities.",
        "Giving up when a transaction seems to have one effect — every transaction has two; if one is elusive, look for the profit element or the liability that was created."
      ],
      summary: [
        "Assets = Capital + Liabilities states that everything a business owns was funded by the owner or by outsiders.",
        "Every transaction has two effects of equal amount, which is why the equation can never fall out of balance.",
        "Capital rises with fresh investment, revenue, and profit; it falls with expenses, losses, and drawings.",
        "Paying a creditor, swapping one asset for another, and settling obligations never touch capital.",
        "The column method records each transaction's two effects and re-totals both sides, earning a mark at every correct balance.",
        "With two elements known, the third is always found by rearranging the equation — including missing assets and the size of discrepancies.",
        "Sales often move three heads — proceeds in, goods out, capital up by the profit.",
        "Every equation effect becomes one debit and one credit in the next chapter — the modern debit-credit rules are this chapter in another notation."
      ],
      check: [
        { q: "A firm has assets of ₹2,75,000. Its creditors are ₹40,000 and outstanding wages ₹8,000. Find its capital.", a: "Total liabilities = 40,000 + 8,000 = ₹48,000. Capital = Assets − Liabilities = 2,75,000 − 48,000 = ₹2,27,000. Outstanding wages are a liability even though no cash has left — the business still owes them." },
        { q: "True or false: paying ₹20,000 to a creditor reduces the firm's capital by ₹20,000. Give a reason.", a: "False. The payment reduces cash (an asset) and creditors (a liability) by ₹20,000 each. The business's net worth is unchanged, so capital does not move — capital changes only through investment, income, expense, profit, loss, and drawings." },
        { q: "Classify this transaction's pattern: goods worth ₹30,000 bought on credit. State both effects.", a: "Pattern: asset up, liability up. Stock (an asset) rises by ₹30,000 and creditors (a liability) rise by ₹30,000. Both sides of the equation increase by the same amount, so it remains balanced." },
        { q: "Explain in your own words why the accounting equation never breaks, even after a long series of transactions.", a: "Because of dual aspect — every transaction has two effects of equal amount, one on each side of the exchange. Whatever a transaction adds to one side it adds or removes on the other in the same rupees, so the totals move together. If a student's totals ever disagree, the fault is in the recording — a missing or wrong effect — never in the equation itself." }
      ]
    },

    debitCredit: {
      intro: [
        "The words debit and credit frighten more beginners than any other pair in accountancy, and almost always for one reason: people assume they must mean good and bad, increase and decrease, or in and out. They mean none of these. Debit simply means an entry on the left side of an account, and credit an entry on the right. Which side any particular account receives is decided not by the words but by the type of account involved.",
        "There are two honest routes to that decision, and both are in the syllabus. The traditional route sorts accounts into three types — personal, real, and nominal — and applies the three Golden Rules: debit the receiver and credit the giver; debit what comes in and credit what goes out; debit all expenses and losses and credit all incomes and gains. The modern route keeps the accounting equation in view and asks a simpler question of each item: which element is it, and is it increasing or decreasing?",
        "Whichever route you travel, you arrive at the same journal entry every time — the two are lenses, not rival theories, and consistency within one answer matters more than which one you chose. This chapter's real skill is classification: knowing that a bank overdraft is a liability, that a debtor is an asset even though its name smells of credit, that goods bought for resale are purchases while machinery is an asset, and that goods leaving the business for anything other than a sale never touch the Sales account. Master that, and the Journal, Ledger, and Cash Book chapters become mechanical."
      ],
      objectives: [
        "Explain what debit and credit actually mean, and why they do not automatically mean increase or decrease.",
        "State the three Golden Rules and apply them to personal, real, and nominal accounts.",
        "Apply the modern approach — assets, liabilities, capital, income, and expenses — to decide each side of an entry.",
        "Classify tricky heads correctly: representative personal accounts, bank overdraft, purchases versus asset purchases, and discounts.",
        "Pass simple and compound journal entries, with total debits equalling total credits.",
        "Explain why goods taken for personal use or given away are credited to Purchases, not to Sales."
      ],
      blocks: [
        {
          h: "Debit and Credit: Just Left and Right",
          p: "Strip the fear out of the words first. An account is a ruled page — traditionally T-shaped — with a debit (left) side and a credit (right) side. Every entry goes on one side or the other, and the account is balanced only when both sides are totalled and compared. Debit and credit are directions, not judgements: an entry is not good because it is a debit or bad because it is a credit.",
          formula: "Debit = left side of an account (Dr.)\nCredit = right side of an account (Cr.)\nTotal debits of every transaction = Total credits, always",
          list: [
            { term: "A debit may mean", def: "An increase of an asset or an expense, or a decrease of a liability, of capital, or of an income." },
            { term: "A credit may mean", def: "An increase of a liability, of capital, or of an income, or a decrease of an asset or an expense." },
            { term: "What decides the side", def: "The type of the account involved — never the words debit or credit by themselves." }
          ],
          simple: "Debit and credit are like the words left and right. Saying turn right is not moral advice, it is only a direction — and which turn is correct depends entirely on where you are trying to go, just as the correct side depends on the account type.",
          real: "A shopkeeper's register has a slot for money coming in and a slot for money going out. Debit and credit are accountancy's two slots — and the rulebook decides which slot each rupee belongs in.",
          note: "Total debits must equal total credits in every entry and, extended across all accounts, in the whole Trial Balance. This equality is double entry in one sentence."
        },
        {
          h: "Personal Accounts: the Receiver and the Giver",
          p: "The first Golden Rule covers anything with a name — individuals, firms, companies, and the bank, which is a legal entity. Personal accounts answer one question: in this transaction, is this person or firm receiving something, or giving something? Debit the receiver, credit the giver — and once the question is asked, the answer is rarely in doubt.",
          formula: "Personal Account — Debit the Receiver, Credit the Giver",
          example: "Started business with cash ₹50,000.\nCash A/c Dr 50,000 (cash is received by the business — but cash is a real account, see the next rule)\n    To Capital A/c 50,000 (the proprietor is the giver of the capital)\nPaid ₹20,000 to Sharma by cheque against his credit bill.\nSharma A/c Dr 20,000 (Sharma receives the money — personal account, debit the receiver)\n    To Bank A/c 20,000 (the bank gives the money out of our account — bank is also treated as a personal account)",
          simple: "Ask of every name in the entry: is this party receiving, or giving? The receiver's name goes on the debit side, the giver's on the credit side — nothing more personal than that.",
          mistakes: [
            "Crediting a debtor after a credit sale — the debtor is receiving goods, so the debtor is debited.",
            "Treating the bank as a real account because money passes through it — in the traditional approach the bank is a personal account, a legal entity we deal with."
          ],
          tip: "In a payment, the person paid is the receiver (debit) and cash or bank is the giver (credit). In a receipt, cash or bank receives (debit) and the payer gives (credit)."
        },
        {
          h: "Real Accounts: What Comes In and What Goes Out",
          p: "The second Golden Rule covers assets and properties — cash, bank balance, furniture, machinery, stock, and even intangible things like goodwill. The question here is physical, almost: did this item come into the business, or go out of it? Debit what comes in, credit what goes out.",
          formula: "Real Account — Debit what Comes In, Credit what Goes Out",
          example: "Bought furniture for cash ₹15,000.\nFurniture A/c Dr 15,000 (furniture comes in)\n    To Cash A/c 15,000 (cash goes out)\nSold that old furniture (not goods — the shop deals in textiles) for ₹4,000 cash.\nCash A/c Dr 4,000 (cash comes in)\n    To Furniture A/c 4,000 (furniture goes out — and no Sales account is touched)",
          simple: "Real accounts are the business's property page. Anything arriving gets a line on the debit side, anything leaving gets a line on the credit side — like a gate register for everything the business owns.",
          note: "The furniture sale above is not Sales, because the business does not deal in furniture. Sales means goods the business bought or made to sell — a point this chapter shares with the terms chapter.",
          mistakes: [
            "Crediting Sales whenever something leaves the business — only goods leaving through trade are Sales; an asset leaving is credited to its own asset account."
          ]
        },
        {
          h: "Nominal Accounts: Expenses, Losses, Incomes and Gains",
          p: "The third Golden Rule covers everything that is neither a person nor a property: costs, losses, earnings, and gains. Nominal accounts measure results, and the rule names both directions — debit all expenses and losses, credit all incomes and gains. This is the rule that fills most of the Statement of Profit and Loss.",
          formula: "Nominal Account — Debit all Expenses and Losses, Credit all Incomes and Gains",
          list: [
            { term: "Common expense heads", def: "Rent, salary, wages, electricity, carriage inward, commission paid, interest paid, discount allowed, depreciation." },
            { term: "Common loss heads", def: "Bad debts (a debtor who cannot pay), loss by fire or theft, discount allowed." },
            { term: "Common income and gain heads", def: "Sales, commission received, rent received, interest received, discount received, profit on sale of an asset." }
          ],
          example: "Received commission of ₹2,500 in cash.\nCash A/c Dr 2,500 (cash comes in — real account rule)\n    To Commission Received A/c 2,500 (an income — credit all incomes and gains)\nNote the same word with different endings: commission PAID is an expense and is debited; commission RECEIVED is an income and is credited. The verb in the question decides the side.",
          simple: "Nominal accounts are the business's diary of gains and costs. Every day spent is written on the debit side; every day earned is written on the credit side — and the difference between the two sides is the profit or loss.",
          confusion: {
            a: "Discount Allowed",
            aText: "A reduction we give to a debtor for paying promptly. It is a cost to us — a nominal account, debited like an expense.",
            b: "Discount Received",
            bText: "A reduction we take as a creditor for paying promptly. It is a gain to us — a nominal account, credited like an income.",
            diff: "The direction of the favour. Allowed means we gave the discount (debit); received means we got it (credit)."
          }
        },
        {
          h: "The Compound Entry: More Than Two Accounts",
          p: "Real life rarely affects exactly two accounts. When a single transaction touches three or more heads, one journal entry records all of it — debits first, then the credits — and the totals must still match. The most common compound entry involves a cash discount at the time a debtor settles his bill.",
          example: "Sharma owes us ₹5,000. He pays ₹4,800 in cash, taking a 4% cash discount for prompt payment.\nCash A/c Dr 4,800 (cash comes in — the amount actually received)\nDiscount Allowed A/c Dr 200 (the discount we gave is our expense — 4% of 5,000)\n    To Sharma A/c 5,000 (Sharma's account is settled in full for what he owed)\nCheck: total debits 4,800 + 200 = 5,000 = total credit. The personal account is always cleared for the FULL amount; the discount account absorbs the difference.",
          note: "The same structure in reverse appears when we pay a creditor less than we owe: the creditor is debited in full, Cash is credited with what left, and Discount Received is credited with the balance.",
          tip: "A compound entry is just a longer sentence with the same grammar: every debit line, then every To line, and one arithmetic proof at the end that the two totals agree."
        }
      ],
      advBlocks: [
        {
          h: "Representative Personal Accounts: the Trickiest Classification",
          p: "Some accounts carry no person's name yet are still personal accounts, because they stand for a person or a group. Outstanding salary stands for the employees still to be paid; prepaid insurance stands for the insurer we have paid in advance; accrued income stands for the party who owes us; income received in advance stands for the customer who has paid us. Exam questions hunt these out precisely because their names look like expenses or incomes.",
          list: [
            { term: "Outstanding Salary A/c", def: "Personal — stands for the employees owed March salary. Created by crediting it when salary becomes due but unpaid." },
            { term: "Prepaid Insurance A/c", def: "Personal — stands for the portion of benefit still to come from the insurer. Debited when part of a premium relates to next year." },
            { term: "Accrued Income A/c", def: "Personal — stands for the party who owes us earned income. Debited when income is earned but not yet received." },
            { term: "Income Received in Advance A/c", def: "Personal — stands for the customer who has paid us for work not yet done. Credited when the advance is taken." },
            { term: "Bank A/c and Cash A/c users", def: "The bank is a legal person, so Bank is personal in the traditional approach; Cash is the classic real account." }
          ],
          example: "Salary of ₹15,000 for March is due but not paid.\nSalary A/c Dr 15,000 (the expense of March — nominal, debit all expenses)\n    To Outstanding Salary A/c 15,000 (personal — the employees are the receivers-to-be)\nModern reading of the same entry: an expense rises (debit) and a liability rises (credit) — identical logic, different vocabulary.",
          real: "This is exactly the adjustment students will meet again in the basis chapter and in final accounts: one effect in the profit statement, one in the Balance Sheet, and both sides of the entry agreeing as always.",
          note: "Outstanding and accrued items are liabilities or assets, never incomes or expenses in themselves — the account name tells you what it stands for, not what it earns."
        },
        {
          h: "Choosing the Right Head: the Classification Drills",
          p: "Most debit-credit mistakes are classification mistakes made before any rule is applied. A quick, honest classification of these usual suspects will save more marks than re-reading the rules.",
          list: [
            { term: "Bank Overdraft", def: "Personal (representative of the bank) — it is money WE owe the bank, so it behaves like a liability and normally carries a credit balance." },
            { term: "Machinery bought", def: "Real — a specific asset account is debited. No Purchases account, because machinery is not stock-in-trade." },
            { term: "Old machinery sold", def: "Real — its own asset account is credited. No Sales account, because the firm does not deal in machinery." },
            { term: "Interest paid and interest received", def: "Both nominal — paid is an expense (debit), received is an income (credit). Same noun, opposite sides." },
            { term: "Carriage inward and carriage outward", def: "Both nominal expenses (debits) — inward on purchases, outward on sales." },
            { term: "Purchases and Sales", def: "Nominal in the traditional system — they measure the cost of stock bought and the revenue earned from trading it." }
          ],
          confusion: {
            a: "Buying goods (Purchases)",
            aText: "Stock bought to sell — debited to Purchases A/c, a nominal account standing for the cost of trading stock.",
            b: "Buying an asset (say, a machine)",
            bText: "A machine bought for use — debited to Machinery A/c, a real account representing the property itself.",
            diff: "Purpose at the time of the buy. Goods for resale go through Purchases; items for use go to their own asset account. Misclassifying this changes the entry AND the wrong answer still balances — which is why the Trial Balance cannot catch it."
          },
          tip: "Say the classification out loud before writing the entry — Personal, Real, Nominal, or Asset, Liability, Capital, Income, Expense. The side then writes itself, and examiners often give method marks for naming the type."
        },
        {
          h: "Reading an Entry Backwards: What the Debit Tells You",
          p: "Every journal entry is a sentence written in two directions. Reading the debits tells you what was received, what increased, or what expense was incurred; reading the credits tells you what was given, what decreased, or what income was earned. And because every sentence keeps its two halves equal, the whole system carries built-in arithmetic: total debits equal total credits, entry by entry and account by account.",
          list: [
            { term: "The equality", def: "Each transaction adds equal amounts to total debits and total credits — this is what a Trial Balance later proves across every account." },
            { term: "The caution", def: "Equal debits and credits do NOT prove the entry is right — using the wrong accounts on both sides keeps the totals equal while the records stay wrong." },
            { term: "The habit", def: "After writing any entry, total both sides mentally. If they differ, an amount or an account is missing." }
          ],
          example: "Read this entry backwards and forwards:\nRent A/c Dr 4,000\n    To Bank A/c 4,000\nForward (what happened): the business incurred a rent expense of ₹4,000 and ₹4,000 left its bank balance.\nBackward (what the sides say): a nominal expense is debited, a personal bank account is credited as the giver. Both readings describe one event — that is double entry doing its job.",
          simple: "A journal entry is a coin: one side describes the receiving, the other the giving. You can read either face, and both must tell the same story in the same rupees."
        },
        {
          h: "Modern Approach in Exam Speed-Mode",
          p: "Once the accounting equation is comfortable, the modern approach is often faster: classify each item as an asset, liability, capital, income, or expense, note whether it is rising or falling, and apply one line per element. It is the equation chapter in shorthand, and many students switch to it for long journal questions.",
          formula: "Asset ↑ Debit · Asset ↓ Credit\nLiability ↑ Credit · Liability ↓ Debit\nCapital ↑ Credit · Capital ↓ Debit\nIncome ↑ Credit · Expense ↑ Debit",
          example: "Paid ₹7,000 by cheque to a creditor for goods bought on credit.\nCreditor (liability) falls by 7,000 → Debit\nBank (asset) falls by 7,000 → Credit\nCreditors A/c Dr 7,000\n    To Bank A/c 7,000\nTraditional check: Sharma-type creditor receives (debit the receiver, personal) and the bank gives (credit the giver, personal). Same entry, both roads.",
          note: "Choose one approach per answer and stay with it. Mixing mid-entry invites errors — and an entry that balances for the wrong reason is harder to fix than one that obviously does not.",
          tip: "The modern approach is fastest for adjustments — outstanding expenses, prepayments, accrued and advance incomes — because the equation reading (expense up and liability up, and so on) maps onto them instantly."
        },
        {
          h: "Drawings Entries: Cash and Goods",
          p: "Goods leaving for the owner's personal use is a short entry that carries long marks, because it tests three ideas at once: the owner and business are separate, the goods are not sold, and capital falls. The pair of drawings entries below are worth learning word-perfect.",
          example: "Owner withdraws ₹5,000 cash and goods worth ₹3,000 for personal use.\nDrawings A/c Dr 5,000\n    To Cash A/c 5,000\nDrawings A/c Dr 3,000\n    To Purchases A/c 3,000\nTraditional reading: the proprietor receives (personal, debit the receiver); cash goes out (real, credit what goes out); goods go out through the PURCHASES account at cost — never Sales, because nobody bought them.\nModern reading: drawings reduce capital, and a capital reduction is a debit; stock falls, which is an asset credit.",
          confusion: {
            a: "Goods taken by the owner",
            aText: "Drawings — credited to Purchases A/c at cost. No revenue is involved; the owner is taking from his own business.",
            b: "Goods given away as free samples or charity",
            bText: "An expense (Advertisement, Charity) is debited and Purchases A/c is credited — again, no Sales, because no customer paid.",
            diff: "The account debited — Drawings for the owner's use, an expense head for business giveaways — but BOTH credit Purchases, since in neither case has anything been sold."
          },
          note: "The one-word trap: goods going out for ANY reason other than a sale credit Purchases, not Sales. Sales is credited only when a customer buys the goods.",
          real: "This single rule prevents a whole family of year-end distortions: crediting Sales for withdrawals would inflate revenue, overstate profit, and flatter the very capital figure drawings are supposed to reduce."
        }
      ],
      mistakes: [
        "Believing debit always means increase and credit always means decrease — the meaning depends on the account type, and for liabilities, capital, and incomes it is exactly the reverse.",
        "Reversing cash and bank entries — cash deposited into the bank debits Bank (the asset received) and credits Cash (the asset given out).",
        "Giving trade discount its own account — it is deducted from the price before the entry is passed, and only the net amount is recorded.",
        "Showing a bank overdraft as an asset — it is money the business owes the bank, so it behaves as a liability with a credit balance.",
        "Debiting Discount Received — it is an income of the business, so it is credited, while Discount Allowed is the one that is debited.",
        "Debiting Sales when goods are withdrawn for personal use — Purchases is credited, not Sales, because no sale took place."
      ],
      summary: [
        "Debit means the left side of an account and credit the right side; which side a head receives depends on its type, not on the words themselves.",
        "Golden Rules: Personal — debit the receiver, credit the giver; Real — debit what comes in, credit what goes out; Nominal — debit all expenses and losses, credit all incomes and gains.",
        "Modern Rules: assets and expenses rise with a debit; liabilities, capital, and incomes rise with a credit; every rise has the matching fall as its reverse.",
        "Both approaches always produce the same entry — choose one per answer and stay consistent within it.",
        "Representative personal accounts — outstanding salary, prepaid insurance, accrued income, income received in advance, and the bank — stand for a person or group, so they follow personal-account logic.",
        "Purchases and Sales are nominal accounts in the traditional system; machinery bought or sold uses its own real account instead.",
        "Compound entries record transactions touching three or more heads, with total debits still equal to total credits, and personal accounts settled in full.",
        "Goods leaving the business for anything other than a sale — drawings, charity, free samples — credit Purchases at cost, never Sales."
      ],
      check: [
        { q: "State the three Golden Rules of debit and credit, one line each.", a: "Personal Account — Debit the Receiver, Credit the Giver. Real Account — Debit what Comes In, Credit what Goes Out. Nominal Account — Debit all Expenses and Losses, Credit all Incomes and Gains." },
        { q: "Classify these heads: Commission Received, Bank Overdraft, Machinery, Discount Allowed, Outstanding Salary.", a: "Commission Received — nominal (income). Bank Overdraft — personal (representative of the bank; a liability, credit balance). Machinery — real (an asset). Discount Allowed — nominal (an expense/loss). Outstanding Salary — personal (representative of the employees owed)." },
        { q: "True or false: in every transaction the debit side increases and the credit side decreases. Give a reason with one example.", a: "False. Debit and credit are only left and right — for liabilities, capital, and incomes the credit side is the increase. Example: taking a bank loan debits Bank (asset rises) and credits Bank Loan (liability rises) — here the credit is an increase, not a decrease." },
        { q: "Pass the entry: paid rent ₹4,000 by cheque, and state the rule applied on each side.", a: "Rent A/c Dr 4,000; To Bank A/c 4,000. Rent is a nominal account and an expense, so it is debited (debit all expenses). Bank is treated as a personal account and gives the money out, so it is credited (credit the giver). Under the modern approach: an expense rises (debit) and an asset falls (credit) — the same entry." }
      ]
    }
  });
})();

/* theory-upgrade part 2 — Class 11 chapters 7-12 (journal, ledger, cashBook, specialBooks2, brs, gst) */
(function () {
  "use strict";
  window.THEORY_UPGRADE_PARTS = window.THEORY_UPGRADE_PARTS || [];
  window.THEORY_UPGRADE_PARTS.push({
    journal: {
      intro: [
        "Every business transaction has to be written down somewhere for the first time, and in double entry that somewhere is the Journal — the book of original entry. Long before any account balance or financial statement exists, the transaction is analysed into its debit and credit effects and recorded here, in the order in which it happens. The Journal is therefore the starting point of the accounting cycle: nothing reaches the Ledger without first being journalised. Think of it as a dated diary of the business, written entirely in accounting language, one clearly marked entry block per transaction.",
        "Writing an entry is a three-step habit. First, name every account the transaction touches — there are never fewer than two. Then classify each one (personal, real or nominal under the traditional approach, or asset, liability, capital, revenue and expense under the modern approach) and apply the rule of debit and credit that fits it. Finally, set the entry down in the standard form: the debit account first with Dr after it, the credit account on the next line prefixed by To, the amounts in their own two columns, and a one-line narration in brackets that begins with Being. Both amount columns must agree for every block, simple or compound.",
        "Because the Journal carries the first — and therefore the most authoritative — record of a transaction, marks in this unit go to accuracy of form as much as to correctness of account. Exams repeatedly ask for full entries: date, particulars, amounts in the right columns and the narration, on everything from a cash sale to a dishonoured cheque, a full settlement with discount, an adjustment for accrued income, or an opening entry for a new year. Once the entries are written, each line is posted to the Ledger and the L.F. column is filled in — the next stage of the accounting cycle, taken up in the following chapter."
      ],
      objectives: [
        "Explain why the Journal is called the book of original entry and describe its five columns.",
        "Analyse any transaction into the accounts affected and decide which account is to be debited and which credited.",
        "Write complete journal entries with the correct date, particulars, amounts in the two amount columns and a short narration.",
        "Record trade discount, cash discount, cheque dishonour and compound transactions without disturbing the debit-credit equality.",
        "Prepare an opening entry that brings forward the year's assets, liabilities and capital.",
        "Describe how journal entries are posted to the Ledger and explain when the L.F. column is filled in."
      ],
      blocks: [
        {
          h: "Analysing a transaction before writing the entry",
          p: "Nothing goes on paper until two questions are settled: which accounts does this transaction affect, and which of them increases while the other decreases? Every entry in this chapter follows that same invisible first step. Name the accounts, classify each one, apply the rule that fits it, and the shape of the entry appears almost on its own. Students who skip this step and start writing lines are the ones who end up reversing debit and credit.",
          list: [
            { term: "Personal accounts", def: "Accounts of the persons, firms and organisations the business deals with — Ramesh, Meera Traders, a supplier, a customer. Debit the receiver and Credit the giver; in modern terms, an increase in what someone owes the business is debited." },
            { term: "Real accounts", def: "Accounts of the assets the business owns — cash, bank, furniture, machinery. Debit what comes in and Credit what goes out; in modern terms, an increase in an asset is debited and a decrease credited." },
            { term: "Nominal accounts", def: "Accounts of expenses, losses, incomes and gains — rent, purchases, sales, commission received. Debit all expenses and losses, and Credit all incomes and gains." }
          ],
          formula: "Traditional rules: Debit the receiver and Credit the giver · Debit what comes in and Credit what goes out · Debit all expenses and losses and Credit all incomes and gains\nModern rules: an increase in an asset or an expense is debited, a decrease is credited; an increase in a liability, capital or income is credited, a decrease is debited.",
          example: "Transaction: Paid rent ₹4,000 in cash.\nStep 1 — accounts affected: Rent A/c and Cash A/c.\nStep 2 — Rent is an expense (Nominal); Cash is an asset that goes out (Real).\nStep 3 —\nRent A/c ... Dr. 4,000\n   To Cash A/c ... 4,000\n(Being rent paid in cash)",
          note: "Two accounts is the minimum, but there is no maximum — one transaction can touch three, four or more accounts, and the dual aspect is preserved in every single one of them.",
          tip: "If you cannot decide the debit, ask who receives or benefits. If you cannot decide the credit, ask who gives or loses."
        },
        {
          h: "From transaction to finished entry — three worked examples",
          p: "The Journal has a fixed rhythm that never changes: date, debit line with Dr, credit line with To, narration in brackets. Amounts appear only in the Debit and Credit columns, never inside Particulars. Writing the same rhythm until it is automatic is what makes journalising fast and accurate under exam pressure.",
          example: "1. Started business with cash ₹1,00,000.\nCash A/c ... Dr. 1,00,000\n   To Capital A/c ... 1,00,000\n(Being business started with cash)\n\n2. Purchased goods for cash ₹15,000.\nPurchases A/c ... Dr. 15,000\n   To Cash A/c ... 15,000\n(Being goods purchased for cash)\n\n3. Deposited cash into the bank ₹18,000.\nBank A/c ... Dr. 18,000\n   To Cash A/c ... 18,000\n(Being cash deposited into the bank)",
          p2: "Read each block back before moving on: at least two accounts, the debit written first with Dr, the credit prefixed by To, and the debit amount equal to the credit amount. Only then should you write the narration and move to the next transaction.",
          real: "A shopkeeper's day is exactly this pattern repeated — cash sale, rent paid, cheque banked, goods bought. Nobody outside the office ever sees the Journal, but a year later, when the accounts are checked, each of these lines is what proves the cash position.",
          mistakes: [
            "Writing the amount inside the Particulars column instead of the Debit and Credit columns.",
            "Prefixing the debit account with To, or leaving the credit account without it.",
            "Stopping after the two accounts and forgetting the narration."
          ],
          note: "One transaction, one block. Never merge two separate transactions into a single entry just because they look related."
        },
        {
          h: "Trade discount and cash discount — two very different things",
          p: "Both words contain discount, and in the Journal they behave in opposite ways. A trade discount is a reduction on the list price offered to a trade or bulk buyer; it is deducted before the entry is even formed, so the Journal only ever sees the net invoice value. A cash discount is a concession for prompt settlement of an already recorded debt; it exists only at the moment of settlement and it must be recorded, because it is a genuine gain or cost of the business.",
          formula: "Trade discount: List Price − Trade Discount = the figure that enters the entry. No separate amount, no separate account.\nCash discount: recorded at settlement — Discount Allowed A/c (Dr.) or Discount Received A/c (Cr.), and the party's account is settled for the full amount.",
          example: "A. Purchased goods with a list price of ₹8,000 less 20% trade discount, paying cash.\nTrade discount = 8,000 × 20/100 = ₹1,600; net value = 8,000 − 1,600 = ₹6,400.\nPurchases A/c ... Dr. 6,400\n   To Cash A/c ... 6,400\n(Being goods purchased for cash, net of trade discount)\n\nB. Cheque of ₹11,700 received from Yash in full settlement of ₹12,000.\nBank A/c ... Dr. 11,700\nDiscount Allowed A/c ... Dr. 300\n   To Yash A/c ... 12,000\n(Being cheque received from Yash in full settlement, discount allowed)\nCheck: 11,700 + 300 = 12,000.",
          confusion: {
            a: "Trade discount",
            aText: "Off the list price, before any entry is formed. It never appears in the Journal at all — not as an amount, not as an account.",
            b: "Cash discount",
            bText: "Only at settlement, and always recorded. It gets its own account: Discount Allowed (an expense of the business) or Discount Received (a gain of the business).",
            diff: "Ask when the reduction is offered. Before the invoice value is worked out? Trade discount — ignore it in the entry. When an existing debt is settled early? Cash discount — record it alongside the cash actually received or paid."
          },
          tip: "Full-settlement entries always clear the party's account for the whole amount owed — part cash or cheque, part discount."
        },
        {
          h: "The opening entry — beginning a new year's books",
          p: "When a new financial year begins, the balances of assets, liabilities and capital are carried forward from the previous year's Balance Sheet by one combined entry known as the opening entry. Assets are debited and liabilities are credited, but capital is never given in the question — it is always the balancing figure that makes the two sides agree.",
          formula: "Cash A/c, Bank A/c, Stock A/c and other assets ... Dr.\n   To Creditors A/c, Bank Loan A/c and other liabilities\n   To Capital A/c\nCapital = Total Assets − Total Liabilities",
          example: "On 1st April a business has cash ₹20,000, bank balance ₹40,000, stock ₹30,000, furniture ₹25,000 and debtors ₹15,000, while it owes creditors ₹18,000 and carries a bank loan of ₹12,000.\n\nTotal assets = 20,000 + 40,000 + 30,000 + 25,000 + 15,000 = ₹1,30,000.\nTotal liabilities = 18,000 + 12,000 = ₹30,000.\nCapital = 1,30,000 − 30,000 = ₹1,00,000.\n\nCash A/c ... Dr. 20,000\nBank A/c ... Dr. 40,000\nStock A/c ... Dr. 30,000\nFurniture A/c ... Dr. 25,000\nDebtors A/c ... Dr. 15,000\n   To Creditors A/c ... 18,000\n   To Bank Loan A/c ... 12,000\n   To Capital A/c ... 1,00,000\nCheck: debits ₹1,30,000 = credits 18,000 + 12,000 + 1,00,000 = ₹1,30,000.",
          note: "If the two sides of an opening entry refuse to agree, the mistake is in the list of balances, not in the entry — re-check every asset, every liability, and the arithmetic of capital."
        },
        {
          h: "After the entry — posting and the L.F. trail",
          p: "Journalising is only half the process. Each debit line and each credit line is later transferred to the account it names in the Ledger — a step called posting — so that every account gathers its own transactions together and can be balanced. Until that transfer actually happens, the L.F. column in the Journal is left blank; it is filled with the ledger page number only as the entry is posted.",
          p2: "The Ledger Folio creates a two-way trail. Given a Journal entry, the L.F. tells you where it was posted. Given a posting in a ledger account, its own J.F. column points back to the Journal page it came from. When a Trial Balance refuses to agree, this trail is the fastest route to the mistake.",
          tip: "Leaving L.F. blank while journalising is not laziness — it is a checklist. A blank L.F. flags an entry that has not yet been posted."
        }
      ],
      advBlocks: [
        {
          h: "Settlements with discount — allowed and received",
          p: "A debtor who pays early may be allowed a cash discount, and a creditor who is paid early may give one. In both cases the party's personal account is dealt with for the FULL amount involved — the discount always gets its own line. Discount Allowed is an expense of the business and is debited; Discount Received is a gain of the business and is credited.",
          formula: "Party's account is settled for the whole amount due:\nwhat actually changed hands (cash, bank or cheque) + discount allowed or received = the party's full balance",
          example: "Yash owed ₹12,000 and paid by cheque ₹11,700 in full settlement.\nBank A/c ... Dr. 11,700\nDiscount Allowed A/c ... Dr. 300\n   To Yash A/c ... 12,000\n\nFarida was owed ₹19,000 and was paid ₹18,600 by cheque in full settlement.\nFarida A/c ... Dr. 19,000\n   To Bank A/c ... 18,600\n   To Discount Received A/c ... 400\n\nBoth blocks balance: 11,700 + 300 = 12,000, and 18,600 + 400 = 19,000.",
          note: "Discount Allowed reduces what the business actually receives, and Discount Received reduces what it actually pays — but the party's account always closes in full.",
          tip: "If the party's account does not go to zero after your entry, you have posted only the cash figure and the discount line is missing."
        },
        {
          h: "When a cheque bounces — reversing the receipt",
          p: "A cheque received and banked is treated as money in. If the bank later returns it dishonoured, that money never really arrived, so the original entry is reversed and the debtor becomes a debtor again. The reversal is exact: same amount, opposite sides.",
          example: "Cheque of ₹11,700 received from Yash in full settlement of ₹12,000 (discount allowed ₹300) and banked.\nBank A/c ... Dr. 11,700\nDiscount Allowed A/c ... Dr. 300\n   To Yash A/c ... 12,000\n\nThe cheque is returned dishonoured — two reversals are needed:\nYash A/c ... Dr. 11,700\n   To Bank A/c ... 11,700\n   (recorded in the bank column of the Cash Book when a Cash Book is maintained)\n\nYash A/c ... Dr. 300\n   To Discount Allowed A/c ... 300\n   (the discount written back, through Journal Proper)\n\nEffect: Yash owes the full ₹12,000 once again — 11,700 reversed from the bank and 300 written back from discount.",
          p2: "Notice which figure goes where. Only the amount that actually touched the bank is reversed against Bank A/c; the discount never entered the bank at all, so it is reversed against its own account.",
          mistakes: [
            "Reversing only the cheque amount and leaving the discount allowed un-reversed, so the debtor's account still stands short.",
            "Debiting Cash A/c instead of Bank A/c when the cheque had already been deposited into the bank."
          ]
        },
        {
          h: "Bills of exchange — receipt, honour and dishonour",
          p: "A bill receivable is a written promise from a debtor to pay on a fixed date. Recording it moves the amount out of the ordinary debtor's account into Bills Receivable A/c — a separate asset — and the fate of the bill on maturity decides which account is debited then.",
          formula: "Bill received: Bills Receivable A/c ... Dr.   To Drawee's A/c\nHonoured: Bank (or Cash) A/c ... Dr.   To Bills Receivable A/c\nDishonoured: Drawee's A/c ... Dr.   To Bills Receivable A/c",
          example: "Bill of ₹8,000 received from Vikram in settlement of his account.\nBills Receivable A/c ... Dr. 8,000\n   To Vikram A/c ... 8,000\n\nCase 1 — honoured on the due date, collected through the bank:\nBank A/c ... Dr. 8,000\n   To Bills Receivable A/c ... 8,000\n\nCase 2 — dishonoured on the due date:\nVikram A/c ... Dr. 8,000\n   To Bills Receivable A/c ... 8,000",
          note: "Whichever way it ends, Bills Receivable A/c is credited and closed — the account is debited when the bill is received and must finish with a credit.",
          tip: "Honour means the money actually arrived; dishonour means it did not. Decide which of the two happened and the debit side follows automatically."
        },
        {
          h: "Adjustment entries — recording what belongs to this year",
          p: "Accrual accounting requires an expense to be recorded in the year it is incurred and income in the year it is earned, whether or not cash has moved. The four regular adjustment entries follow one of two shapes: either a fresh asset or liability account is opened against an existing account, or a payment already made is re-labelled as an asset.",
          formula: "Outstanding expense: Expense A/c ... Dr.   To Outstanding Expense A/c\nAccrued income: Accrued Income A/c ... Dr.   To Income A/c\nPrepaid expense: Prepaid Expense A/c ... Dr.   To Cash/Bank A/c\nIncome received in advance: Cash/Bank A/c ... Dr.   To Advance Income A/c",
          example: "Outstanding wages at the year end ₹2,200.\nWages A/c ... Dr. 2,200\n   To Outstanding Wages A/c ... 2,200\n\nRent of ₹6,000 paid in advance for the next quarter.\nPrepaid Rent A/c ... Dr. 6,000\n   To Cash A/c ... 6,000\n\nCommission of ₹1,200 earned during the year but not yet received.\nAccrued Commission A/c ... Dr. 1,200\n   To Commission Received A/c ... 1,200\n\nInterest on capital allowed to the proprietor ₹3,500.\nInterest on Capital A/c ... Dr. 3,500\n   To Capital A/c ... 3,500",
          note: "An outstanding expense is a liability of the business, while a prepaid expense and accrued income are assets of the business — none of them has moved any cash yet.",
          tip: "Look for the words at the year end, still outstanding, not yet received or paid. They are the signal that an adjustment entry, not a cash entry, is required."
        }
      ],
      mistakes: [
        "Writing the credit line above the debit line — the account to be debited always comes first, with Dr after it.",
        "Recording a trade discount as a separate amount or account — only the net invoice value should enter the entry.",
        "Debiting or crediting the party's account with only the cash actually received in a full settlement, instead of the full amount owed.",
        "Writing the narration on a separate page, or leaving it out entirely when the question asks for complete entries.",
        "Filling the L.F. column while journalising — it is completed only at the time of posting.",
        "Changing the credit figure simply to make the block agree — if the two columns differ, the analysis of the transaction is wrong, not the arithmetic."
      ],
      summary: [
        "The Journal is the book of original entry: every transaction is analysed into debit and credit and written here first, in date order.",
        "Five columns — Date, Particulars, L.F., Debit ₹, Credit ₹ — with amounts appearing only in the two amount columns.",
        "The debit account is written first with Dr after it; the credit account follows on the next line, prefixed by To, and the narration closes the block with Being.",
        "Every block must have equal debit and credit totals, and a compound entry carries several debits or several credits for one event while still balancing as a whole.",
        "Trade discount is deducted before the entry and never recorded; cash discount is recorded at settlement, with the party's account cleared in full.",
        "The opening entry debits assets and credits liabilities, with capital as the balancing figure that makes both sides agree.",
        "Dishonoured cheques and bills reverse the original entry, while adjustment entries record what has been earned or incurred without any cash moving.",
        "Posting transfers each line to the Ledger, and only when that is done is the L.F. column filled in."
      ],
      check: [
        { q: "Why is the Journal called the book of original entry, and when is its L.F. column filled in?", a: "Because every transaction is recorded in the Journal first, in date order, before anything is posted anywhere else. The L.F. column is filled in only at the time of posting, with the ledger page number — never while journalising, so that a blank L.F. can flag an entry that has not yet been posted." },
        { q: "True or false, with a reason: a cash discount allowed to a customer is deducted before the journal entry is written, exactly like a trade discount.", a: "False. Only a trade discount is deducted before the entry, because it is a reduction on the list price itself. A cash discount arises at settlement and is recorded: Bank A/c Dr., Discount Allowed A/c Dr., To Customer's A/c for the full amount due." },
        { q: "Pass the journal entry: purchased goods with a list price of ₹20,000 from Bhavya, less 10% trade discount — half paid in cash and the balance on credit.", a: "Trade discount = 10% of 20,000 = ₹2,000, so net value = ₹18,000. Purchases A/c Dr. 18,000; To Cash A/c 9,000; To Bhavya A/c 9,000. Debits 18,000 = credits 9,000 + 9,000 = 18,000." },
        { q: "Give one difference between a simple journal entry and a compound journal entry.", a: "A simple entry involves exactly two accounts — one debit and one credit of the same amount. A compound entry involves three or more accounts in a single block, with one debit and several credits (or one credit and several debits), and the total of all debits must still equal the total of all credits." }
      ]
    },

    ledger: {
      intro: [
        "A business may record a thousand transactions in the Journal, but a date-wise list is not much use when the question is how much cash is in hand today, or what a particular customer still owes. The Ledger solves exactly that problem. Every debit and credit written in the Journal is transferred — posted — into an account of its own, so that all the entries affecting Cash sit together, all the entries affecting Meera sit together, and so on. Because every account a business needs is finally collected here, the Ledger is called the principal book of accounts, or the book of final entry.",
        "Each ledger account is drawn in the familiar T-shape with four columns on each side: Date, Particulars, J.F. and Amount. Posting follows four rules and only four — a journal debit goes to the debit side of that same account, a journal credit goes to its credit side, particulars on the debit side are written with To, and particulars on the credit side are written with By. The J.F. number records which Journal page the posting came from, creating a two-way trail between the two books that is invaluable when checking an error.",
        "Once every posting is in place, the account is balanced. Both sides are totalled separately, the difference is written on the lighter side as Balance c/d, and the same figure is brought down on the heavier side as Balance b/d to open the next period. Where the brought-down figure sits tells you its nature: a debit balance on the left, a credit balance on the right, and a nil balance if the two sides already agreed. Real and personal balances travel forward into the Balance Sheet, while nominal balances are closed to the Trading Account or Profit and Loss Account."
      ],
      objectives: [
        "Define the Ledger and explain why it is called the principal book of accounts.",
        "Distinguish the Ledger's account-wise arrangement from the Journal's date-wise record.",
        "Apply the four posting rules — debit to debit side with To, credit to credit side with By.",
        "Draw a ledger account in T-format with Date, Particulars, J.F. and Amount on both sides.",
        "Balance an account and state whether the result is a debit balance, a credit balance or a nil balance.",
        "Identify the posting errors that stop a Trial Balance from tallying, and explain how each is detected."
      ],
      mistakes: [
        "Posting an amount to the wrong side of an account, quietly turning a debit into a credit.",
        "Writing By on the debit side or To on the credit side — the prefixes belong the other way round.",
        "Posting only one leg of an entry, so the two accounts never match and the Trial Balance will not agree.",
        "Writing Balance c/d on the heavier side just to force the totals to agree — it always goes on the lighter side.",
        "Forgetting to bring the balance down as Balance b/d on the opposite side, leaving the next period with no opening balance.",
        "Leaving the J.F. column blank after posting has been done, or filling it in before the posting actually happens."
      ],
      summary: [
        "The Ledger is the principal book of accounts — the book of final entry — where journal postings are collected account-wise, one account per page or T-shaped box.",
        "Journal debit is posted to the debit side of that account; journal credit is posted to its credit side, so every entry produces at least two postings.",
        "Particulars on the debit side begin with To and on the credit side with By, while J.F. records the Journal page each posting came from.",
        "Balancing means totalling both sides, writing the difference as Balance c/d on the lighter side, and bringing it down as Balance b/d on the heavier side.",
        "Balance b/d on the debit side means a debit balance; on the credit side, a credit balance; equal totals mean a nil balance.",
        "Real and personal accounts are carried forward to the next period and appear in the Balance Sheet; nominal accounts are closed to the Trading or Profit and Loss Account.",
        "Ledger balances are what the Trial Balance, and then the final accounts, are built from — the Journal alone cannot give a single account's position.",
        "Where a Cash Book is maintained, the Cash Account and Bank Account are kept there instead of in the Ledger, and their balances go straight to the Trial Balance."
      ],
      check: [
        { q: "What is meant by posting in accounting?", a: "Posting means transferring the debit and credit amounts of a journal entry into their respective accounts in the Ledger — the debit to the debit side of one account and the credit to the credit side of another — so that each account gathers its own transactions together." },
        { q: "True or false, with a reason: the word By is written on the debit side of a ledger account.", a: "False. Particulars on the debit side are prefixed with To (for example, To Capital A/c), and particulars on the credit side are prefixed with By (for example, By Cash A/c)." },
        { q: "A Cash Account shows total debits of ₹20,000 and total credits of ₹8,000. State the closing balance, where it is written, and its nature.", a: "The difference of ₹12,000 is written on the lighter (credit) side as By Balance c/d, making both sides total ₹20,000. It is then brought down on the debit side as To Balance b/d ₹12,000 — a debit balance of ₹12,000, which is the cash in hand." },
        { q: "Differentiate between Balance carried down (c/d) and Balance brought down (b/d).", a: "Balance c/d is the closing figure written at the end of the current period on the smaller side so that both sides show equal totals. Balance b/d is that exact same figure brought forward onto the opposite side at the start of the next period, where it becomes that period's opening balance." }
      ]
    },

    cashBook: {
      intro: [
        "Cash is the most active item in any business, and if every rupee received and paid had to be journalised line by line, the Journal would drown in routine entries. This is why the first subsidiary book is the Cash Book: a book of original entry in which cash receipts are written on the debit side and cash payments on the credit side, in date order. A simple Cash Book keeps cash alone; a two-column Cash Book adds a bank column for cheques, deposits and withdrawals, effectively holding both the Cash Account and the Bank Account in one book.",
        "Because it already behaves like an account, the Cash Book does double duty — it is a Subsidiary Book where transactions are first recorded, and also a Principal Book whose balances go straight into the Trial Balance, so no separate Cash Account or Bank Account is opened in the Ledger. Entries that move money between the firm's own cash box and its own bank account are contra entries, marked C in the L.F. column on both sides and never posted further. Everything the Cash Book deliberately refuses — cash discount, a cheque not yet banked, a non-cash transaction — is handled in Journal Proper instead.",
        "The book must also cope with the banking realities an exam loves to test: a cheque received but not deposited the same day, a cheque later dishonoured, a post-dated cheque, a bank overdraft that flips the bank column's balance onto the credit side, and the tiny daily expenses handled by a Petty Cash Book under the imprest system. Learning the Cash Book is therefore less about memorising a format and more about knowing, for any movement of money, which side and which column it belongs in — and whether it belongs in the Cash Book at all."
      ],
      objectives: [
        "Explain what subsidiary books are and why the Journal is sub-divided into them.",
        "Record cash receipts and payments in a single column Cash Book and balance it correctly.",
        "Use the cash and bank columns of a two-column Cash Book, marking contra entries with C in the L.F. column.",
        "Handle cheques not banked the same day, dishonoured cheques, post-dated cheques and overdraft balances.",
        "Explain the imprest system of petty cash and post from the Petty Cash Book into the Ledger.",
        "Identify the transactions that must be kept out of the Cash Book and routed through Journal Proper instead."
      ],
      blocks: [
        {
          h: "Posting from the Cash Book into the Ledger",
          p: "A Cash Book entry is only one half of a transaction. The other half lives in the Ledger, where the account named in the Particulars column receives its posting on the opposite side — this is what keeps the dual aspect intact even though no separate Journal entry is written for Cash Book transactions.",
          formula: "Receipt (debit side of Cash Book) → posted to the CREDIT side of that account as By Cash A/c or By Bank A/c\nPayment (credit side of Cash Book) → posted to the DEBIT side of that account as To Cash A/c or To Bank A/c\nOpening and closing balances are never posted.",
          example: "Receipt: received ₹6,000 in cash from Anita.\nCash Book, debit side: To Anita A/c ... 6,000\nLedger, Anita A/c, credit side: By Cash A/c ... 6,000\n\nPayment: paid ₹1,000 for electricity.\nCash Book, credit side: By Electricity Expenses A/c ... 1,000\nLedger, Electricity Expenses A/c, debit side: To Cash A/c ... 1,000",
          p2: "The two balances of the Cash Book are the exception. The opening balance is simply the brought-down figure of the previous period, and the closing balance goes straight to the asset side of the Balance Sheet — neither is ever posted to a Ledger account.",
          note: "When a Cash Book is maintained, Cash A/c and Bank A/c are not opened in the Ledger at all, because the Cash Book itself is those two accounts.",
          mistakes: [
            "Posting the closing balance of the Cash Book to a Ledger account — it belongs on the Balance Sheet instead.",
            "Posting a receipt to the debit side of the other account as well, which would double the effect of the transaction."
          ]
        },
        {
          h: "Contra entries — when both cash and bank are affected",
          p: "Some transactions simply move money between the firm's own cash box and its own bank account: cash deposited into the bank, or cash withdrawn from the bank for office use. Neither event changes total assets — only the form in which they are held. Because both the cash balance and the bank balance are affected at once, the entry is written on BOTH sides of the Cash Book, once in each column, and it is called a contra entry.",
          formula: "Cash deposited into bank: Bank column debit (To Cash A/c) + Cash column credit (By Bank A/c)\nCash withdrawn from bank for office use: Cash column debit (To Bank A/c) + Bank column credit (By Cash A/c)\nMark C in the L.F. column on both sides. Contra entries are never posted to a separate Ledger account.",
          example: "Deposit of cash into bank ₹20,000 — recorded twice:\nDebit side, bank column: To Cash A/c ... C ... 20,000\nCredit side, cash column: By Bank A/c ... C ... 20,000\n\nCash withdrawn from the bank for office use ₹10,000:\nDebit side, cash column: To Bank A/c ... C ... 10,000\nCredit side, bank column: By Cash A/c ... C ... 10,000",
          real: "Think of a shop moving notes from the cash drawer into the till's bank bag at the end of the day. The shop's total money has not changed — some is now in the bank instead of in the drawer. That single event needs two lines in the Cash Book, and nothing at all in the Ledger.",
          note: "The C in the L.F. column is the examiner's signal that this entry is self-contained — it already affects both accounts it needs to.",
          mistakes: [
            "Marking C and then still posting the entry to a Cash or Bank account in the Ledger.",
            "Writing both halves on the same side of the Cash Book — one half always goes on each side."
          ]
        },
        {
          h: "Choosing the side and the column",
          p: "Almost every Cash Book error is a side-and-column error rather than an arithmetic one. Two questions settle each transaction: is money coming in or going out, and is it cash or bank? Four answers give four positions, and a contra entry is the special case where both columns are used at once.",
          list: [
            { term: "Cash received", def: "Debit (receipts) side, cash column — cash sales, cash from a debtor, commission received in cash, sale of scrap." },
            { term: "Cash paid", def: "Credit (payments) side, cash column — cash purchases, rent or salaries in cash, payments to a creditor in cash." },
            { term: "Cheque received and banked the same day", def: "Debit side, bank column. A cheque banked later than the day it is received goes through Cheques-in-Hand A/c first and enters the Cash Book only on the day of deposit." },
            { term: "Cheque issued", def: "Credit side, bank column, on the date the cheque is actually handed over — even if it is post-dated." },
            { term: "Cash into bank, bank into cash", def: "Contra entry — both sides, marked C, no ledger posting." },
            { term: "Withdrawal from bank for the proprietor's personal use", def: "Credit side, bank column only, as By Drawings A/c — this is NOT a contra entry, because the money never enters the firm's cash box." }
          ],
          confusion: {
            a: "Cash column",
            aText: "Only physical cash in hand. It can show a debit balance or a nil balance — cash paid can never exceed the cash actually held.",
            b: "Bank column",
            bText: "Cheques, deposits and withdrawals through the bank account. It can show a debit balance (money at the bank) or a credit balance (bank overdraft).",
            diff: "The cash column has only one possible direction for its balance; the bank column can flip to the credit side when the firm overdraws its account, which is why its balancing figure sometimes appears as To Balance c/d on the receipts side."
          },
          tip: "Draw the side-and-column grid on the corner of your answer sheet before you start — once the positions are fixed, the entries write themselves."
        },
        {
          h: "What never enters the Cash Book",
          p: "The Cash Book records only genuine movements of cash and bank balance, and it records them the moment the firm itself becomes aware of them. Everything else belongs somewhere else — and knowing the destination of each excluded item is just as examinable as knowing where a receipt goes.",
          list: [
            { term: "Non-cash transactions", def: "Depreciation, bad debts, goods taken for own use and similar events move no money, so they are journalised in Journal Proper." },
            { term: "Cash discount allowed or received", def: "Recorded by a Journal entry in Journal Proper — Discount Allowed A/c Dr. to Party's A/c, or Party's A/c Dr. to Discount Received A/c — and so is its reversal when a cheque is dishonoured." },
            { term: "A cheque received but not banked that day", def: "Nothing enters the Cash Book on the day of receipt. Cheques-in-Hand A/c Dr. to Party's A/c is passed in Journal Proper, and the bank column sees the cheque only when it is actually deposited." },
            { term: "A cheque endorsed over to another party", def: "If a cheque received never touches the firm's own bank account, the bank column cannot show it — Customer's A/c Dr. to Supplier's A/c is passed in Journal Proper." },
            { term: "Cheques received before banking hours, kept in hand", def: "Recorded through Cheques-in-Hand A/c at the time, and the Cash Book bank column is updated on the actual date of deposit." }
          ],
          real: "A customer hands you a cheque at 6 p.m. after the bank has shut. Your Cash Book has not changed — no cash, no bank balance yet. Tomorrow, when you bank it, the bank column finally records it. In between, Journal Proper holds the cheque through Cheques-in-Hand A/c so the accounts still balance.",
          note: "A cheque ISSUED is different from a cheque RECEIVED: the issue is recorded in the bank column at once (the firm's bank balance has fallen in its own records), while a receipt waits until the money is actually banked."
        }
      ],
      advBlocks: [
        {
          h: "Dishonour of a deposited cheque — reversing the bank column",
          p: "A cheque received from a customer and deposited is recorded as a receipt in the bank column, increasing the bank balance. If the bank later returns it dishonoured, the firm's bank balance really has come down again, so the same party's name reappears on the payments side to reverse the receipt.",
          example: "5 April — cheque of ₹9,500 received from a customer and banked the same day.\nBank column, debit side: To [Customer] A/c ... 9,500\n\n12 April — the cheque is returned dishonoured by the bank.\nBank column, credit side: By [Customer] A/c ... 9,500\n\nIf a discount of ₹500 had been allowed when the cheque was received (full settlement of ₹10,000), that discount is written back separately in Journal Proper:\n[Customer] A/c ... Dr. 500\n   To Discount Allowed A/c ... 500\n\nThe customer owes ₹10,000 again: 9,500 restored through the bank column and 500 through the discount reversal.",
          p2: "The mirror case is a cheque the firm itself issued and which is not paid on presentation. Since the payment never went through, the bank balance effectively recovers, and the entry sits on the debit (receipts) side of the bank column with the supplier's name.",
          note: "This reversal is one of the standard reasons the Cash Book and the Pass Book disagree on a given date — the firm may not yet know its cheque has bounced.",
          tip: "In a BRS question, a dishonoured cheque previously deposited is deducted from the Cash Book balance, because the Cash Book still counts money that never actually arrived."
        },
        {
          h: "A worked month in a two-column Cash Book",
          p: "The only way to be sure of the format is to run a whole period through it. Below is one April in a two-column Cash Book — receipts and payments, two contra entries, and both closing balances worked out in full.",
          example: "Opening on 1 April: Cash ₹12,000, Bank ₹30,000.\nApr 3 — Cash sales ₹15,000: cash column, debit.\nApr 5 — Cash deposited into bank ₹10,000: contra, cash column credit and bank column debit, marked C.\nApr 8 — Cheque from Ramesh ₹8,000 banked the same day: bank column, debit.\nApr 12 — Rent paid by cheque ₹4,000: bank column, credit.\nApr 15 — Goods purchased for cash ₹6,000: cash column, credit.\nApr 20 — Cash withdrawn from bank for office use ₹5,000: contra, bank column credit and cash column debit, marked C.\nApr 25 — Salaries paid in cash ₹3,500: cash column, credit.\n\nCash column: debits 12,000 + 15,000 + 5,000 = ₹32,000; credits 10,000 + 6,000 + 3,500 = ₹19,500; Balance c/d = 32,000 − 19,500 = ₹12,500 cash in hand.\nBank column: debits 30,000 + 10,000 + 8,000 = ₹48,000; credits 4,000 + 5,000 = ₹9,000; Balance c/d = 48,000 − 9,000 = ₹39,000 balance at bank.\nOn 1 May both figures are brought down as To Balance b/d.",
          note: "Each column is balanced on its own. The cash column can only be a debit balance; the bank column here is also a debit balance, but it would show a credit balance (overdraft) if the payments side had run ahead of the receipts side.",
          mistakes: [
            "Forgetting one half of a contra entry, so the two columns never pick up the same amount twice as they should.",
            "Adding both columns together for a single balance — the Cash Book needs two separate balances."
          ]
        },
        {
          h: "Entries the bank records first — charges, interest and direct collections",
          p: "Some bank transactions are initiated by the bank itself: service charges, interest allowed on the balance, interest charged on an overdraft, or amounts collected and paid directly under standing instructions. The bank enters them in the Pass Book at once, but the firm only discovers them when it studies the statement — and until the firm records them, they are items that make the two balances differ.",
          example: "Bank charges of ₹150 debited by the bank.\nBank column, credit side: By Bank Charges A/c ... 150\n\nInterest of ₹600 allowed by the bank on the balance held.\nBank column, debit side: To Interest A/c ... 600\n\nInterest of ₹350 charged by the bank on an overdrawn balance.\nBank column, credit side: By Interest on Overdraft A/c ... 350\n\nRohit deposits ₹5,000 directly into the firm's bank account in settlement of his dues.\nBank column, debit side: To Rohit A/c ... 5,000",
          p2: "Each of these is a normal receipt or payment once the firm knows about it — the only special feature is the timing. That timing is precisely what a Bank Reconciliation Statement measures in the next chapter.",
          note: "In a Cash Book, these appear the moment the firm checks its statement. In a BRS, they are still outstanding items until that happens.",
          tip: "Anything that begins with the words as per the bank statement or as per the pass book is telling you the bank got there first."
        },
        {
          h: "Petty cash through the main Cash Book — the imprest flow",
          p: "Small payments — postage, courier, stationery, cartage — are too frequent and too tiny for the main Cash Book, so a Petty Cash Book kept by the Petty Cashier takes care of them. From the main Cash Book's point of view, only two events ever occur: handing over the imprest, and reimbursing exactly what was spent.",
          example: "1 April — the main cashier hands ₹6,000 to the petty cashier to start the imprest.\nMain Cash Book, credit side, cash column: By Petty Cash A/c ... 6,000\n\nDuring April the petty cashier spends ₹1,750 on courier, stationery and cartage.\n\n30 April — the head cashier reimburses exactly what was spent.\nMain Cash Book, credit side, cash column: By Petty Cash A/c ... 1,750\n\nThe petty cashier starts May with 6,000 − 1,750 + 1,750 = ₹6,000 again — the imprest is restored to its original figure, which is the whole point of the system.",
          p2: "In the Ledger, Petty Cash A/c receives these amounts on its debit side (To Cash A/c), and at the end of the period the individual expense accounts are debited for their own totals, with Petty Cash A/c credited.",
          real: "A school receptionist keeps a fixed float for tea, courier and small repairs. Every month she hands over bills exactly equal to what she spent, and her float is the same rupee figure again — that is the imprest system in daily life.",
          note: "Reimbursement is not a fresh advance. The petty cashier is paid back only what was actually spent, so the imprest amount at the start of every period is identical.",
          tip: "Both Cash Book lines — the original advance and every reimbursement — are payments on the credit side of the main Cash Book."
        }
      ],
      mistakes: [
        "Posting a contra entry to a separate Ledger account — after marking it C in the L.F. column, the entry stops right there.",
        "Writing Discount Allowed or Discount Received inside the Cash Book instead of passing an entry in Journal Proper.",
        "Treating cash withdrawn by the proprietor for personal use as a contra entry — it is Drawings, and only the bank column is credited.",
        "Putting a cheque received but not banked on the same day straight into the bank column, skipping Cheques-in-Hand A/c.",
        "Posting the opening or closing balance of the Cash Book to the Ledger — balances are never posted; the closing balance goes straight to the Balance Sheet.",
        "Entering a post-dated cheque on the date printed on it, instead of the date it was actually issued (for a cheque given) or deposited (for a cheque received)."
      ],
      summary: [
        "The Cash Book is a book of original entry for cash and bank transactions, and it is also the Cash Account and the Bank Account themselves, so its balances go directly to the Trial Balance.",
        "Receipts are written on the debit side and payments on the credit side, in date order — one amount column in a simple Cash Book, cash and bank columns in a two-column Cash Book.",
        "Contra entries affect both cash and bank, are marked C in the L.F. column on both sides, and are never posted to a separate Ledger account.",
        "Cash discount, endorsed cheques and cheques received but not yet banked stay out of the Cash Book and are recorded through Journal Proper.",
        "The cash column can show only a debit or nil balance; the bank column can also show a credit balance, which is a bank overdraft — a liability owed to the bank.",
        "A cheque deposited and later dishonoured is written on the credit side of the bank column, while a cheque issued but not paid on presentation is written back on the debit side.",
        "Petty expenses are handled by a Petty Cash Book, most commonly under the imprest system, where the amount actually spent is reimbursed and the imprest is restored to its original figure.",
        "Opening and closing balances are never posted — the closing balance appears on the asset side of the Balance Sheet, or as an overdraft on the liabilities side."
      ],
      check: [
        { q: "What is a contra entry, and how is it identified in the Cash Book?", a: "A contra entry is one that affects both cash and bank at the same time — cash deposited into the bank or cash withdrawn from the bank for office use. It is written on both sides of the Cash Book, once in each column, with C marked in the L.F. column, and it is never posted to any separate Ledger account." },
        { q: "True or false, with a reason: cash withdrawn by the proprietor from the bank for his personal use is a contra entry.", a: "False. The money goes to the proprietor and never enters the firm's own cash box, so only the bank column is credited, as By Drawings A/c. A contra entry requires one balance to rise while the other falls within the firm itself." },
        { q: "A Cash Book shows total receipts of ₹46,000 and total payments of ₹38,700. State the closing balance and where it is written.", a: "Balance c/d = 46,000 − 38,700 = ₹7,300, written on the credit (payments) side so that both sides total ₹46,000, and brought down on the debit side on the next date as To Balance b/d ₹7,300 — the cash in hand." },
        { q: "Why is there no separate Cash Account in the Ledger when a Cash Book is maintained?", a: "Because the Cash Book itself performs the function of the Cash Account (and, in a two-column Cash Book, of the Bank Account as well). Its balances are taken straight to the Trial Balance, so opening a Cash Account in the Ledger would record the same transactions twice." }
      ]
    },

    specialBooks2: {
      intro: [
        "Once the Cash Book has taken cash and bank traffic out of the Journal, five subsidiary books remain to be dealt with, and this chapter is about them: Purchases Book, Sales Book, Purchases Return Book, Sales Return Book and Journal Proper. Each is a specialised part of the Journal for one family of transactions — a book of original entry with its own ruling, so that a month's credit purchases of goods, for example, can be read off a single page and posted in one total instead of being scattered across hundreds of Journal lines.",
        "The discipline these books demand is a discipline of boundaries. The Purchases Book and Sales Book record only credit transactions in goods the firm deals in; cash business goes to the Cash Book, and credit business in fixed assets goes to Journal Proper. Returns flow in two directions and are caught by two books backed by two documents — a Debit Note sent to a supplier and a Credit Note issued to a customer. Whatever fits none of the five books is the Journal Proper's job, from the opening entry to bad debts and depreciation.",
        "Posting from these books follows a neat symmetry: each individual party is credited in the Purchases Book and debited in the Sales Book, while the periodic totals land on the opposite side of the Purchases, Sales and Return accounts, keeping total debits equal to total credits. Since a wrong book means a wrong account and a Trial Balance that will not agree, the habit worth building is simple — identify the nature of the transaction first, and let the book follow. That identification is exactly what one-mark book-selection questions test."
      ],
      objectives: [
        "State the purpose of each subsidiary book other than the Cash Book and name the source document behind it.",
        "Decide, for any transaction, which book it belongs in — or that it belongs in none of them.",
        "Record credit purchases and credit sales net of trade discount in the Purchases and Sales Books.",
        "Distinguish a Debit Note from a Credit Note and record returns in the correct return book.",
        "Post individual party accounts and the periodic totals of these books to the Ledger.",
        "List and illustrate the six categories of entries recorded in the Journal Proper."
      ],
      blocks: [
        {
          h: "Choosing the right book — the three-question test",
          p: "Book selection looks intimidating until you see that every question is really the same three questions asked in order. Answer them and the book reveals itself; answer only the first and you will keep landing in the wrong one.",
          list: [
            { term: "Question 1 — Is it goods?", def: "Goods are the items the firm deals in or uses to manufacture what it sells. Furniture bought for the office, a delivery van or a computer for own use are assets, never goods, so they never enter the Purchases or Sales Book." },
            { term: "Question 2 — Is it on credit?", def: "Credit transactions only. Cash purchases and cash sales belong to the Cash Book, whatever the goods are." },
            { term: "Question 3 — Is it a purchase, a sale or a return?", def: "A purchase of goods goes to the Purchases Book, a sale of goods to the Sales Book, goods returned to a supplier to the Purchases Return Book, and goods returned by a customer to the Sales Return Book." },
            { term: "Question 4 — Anything left over?", def: "Opening and closing entries, rectification, transfers, adjustments, bad debts, depreciation, asset transactions and discount entries all go to the Journal Proper." }
          ],
          example: "Credit purchase of garments from a supplier — goods, credit, purchase → Purchases Book.\nCash purchase of the same garments — goods, cash → Cash Book.\nCredit purchase of office furniture by a furniture trader — asset for own use, credit → Journal Proper.\nDepreciation on machinery at the year end — not goods, no credit → Journal Proper.",
          tip: "Ask about the SELLER'S business for a sale and about the BUYER'S business for a purchase — what the goods are to that firm decides the book."
        },
        {
          h: "Recording net of trade discount — worked entries",
          p: "Entries in the Purchases Book and Sales Book are made from the invoice, and always net of trade discount. The list price is reduced by the trade discount first, and only that reduced figure is written in the book — the discount itself never appears as a figure or an account anywhere.",
          example: "Purchase from Meera Traders: list price ₹20,000 less 10% trade discount.\nTrade discount = 20,000 × 10/100 = ₹2,000.\nAmount recorded in the Purchases Book = 20,000 − 2,000 = ₹18,000.\n\nSale to Kiran: list price ₹15,000 less 20% trade discount.\nTrade discount = 15,000 × 20/100 = ₹3,000.\nAmount recorded in the Sales Book = 15,000 − 3,000 = ₹12,000.\n\nAt the period end: Purchases A/c Dr. 18,000 to Meera Traders 18,000,\nand Kiran A/c Dr. 12,000 to Sales A/c 12,000.",
          p2: "Cash discount is a different animal altogether — it arises only when an account is settled, and it is recorded through Journal Proper, never inside these books.",
          note: "Returns of goods are recorded on the same net basis as the original purchase or sale. If goods bought at a list price of ₹8,000 less 25% trade discount are returned, the return is recorded at ₹6,000, not ₹8,000.",
          mistakes: [
            "Entering the list price in the book and showing the trade discount as a separate line beneath it.",
            "Deducting trade discount again when the goods are returned, instead of returning them at the same net figure."
          ]
        },
        {
          h: "Returns — which way are the goods flowing?",
          p: "Two return books, two notes, and one easy way to remember which is which: follow the goods. Goods flowing OUT to a supplier are Returns Outward, caught by the Purchases Return Book. Goods flowing IN from a customer are Returns Inward, caught by the Sales Return Book.",
          list: [
            { term: "Purchases Return Book (Returns Outward)", def: "Goods bought on credit are returned to the supplier. The purchaser prepares a Debit Note, notifying the supplier that the supplier's account has been debited. Each supplier's account is debited individually, and the periodic total is credited to Purchases Return A/c." },
            { term: "Sales Return Book (Returns Inward)", def: "Goods sold on credit are returned by the customer. The seller prepares a Credit Note, notifying the customer that the customer's account has been credited. Each customer's account is credited individually, and the periodic total is debited to Sales Return A/c." },
            { term: "Out of scope", def: "Return of goods bought or sold for cash, and return of any asset rather than goods, are not recorded in these books." }
          ],
          example: "Goods of ₹4,000 bought on credit from Ashok Traders are returned as defective.\nAshok Traders A/c ... Dr. 4,000\n   To Purchases Return A/c ... 4,000   (basis: Debit Note)\n\nPriya returns goods of ₹3,200 that she had bought on credit from us.\nSales Return A/c ... Dr. 3,200\n   To Priya A/c ... 3,200   (basis: Credit Note)",
          confusion: {
            a: "Debit Note",
            aText: "Prepared by the PURCHASER when returning goods to a supplier, and it is the basis for an entry in the Purchases Return Book.",
            b: "Credit Note",
            bText: "Prepared by the SELLER when goods are returned to them by a customer, and it is the basis for an entry in the Sales Return Book.",
            diff: "Whoever prepares the note is telling the other party what has been done to that party's account — the purchaser debits the supplier, and the seller credits the customer."
          }
        },
        {
          h: "Sorting six transactions — a worked exercise",
          p: "The fastest way to secure full marks in a book-selection question is to sort a mixed set in one sitting. Each item below is decided by the three-question test, and the reason matters as much as the answer.",
          example: "1. Bought goods on credit from Meera Traders ₹18,000 → Purchases Book: credit purchase of goods dealt in.\n2. Sold goods on credit to Sharma and Co. ₹32,000 → Sales Book: credit sale of goods dealt in.\n3. Bought a delivery van on credit from Auto Motors ₹2,40,000 → Journal Proper: a fixed asset, not stock-in-trade.\n4. Returned goods of ₹4,000 to Rakesh, from whom they were bought on credit → Purchases Return Book, supported by a Debit Note.\n5. Priya returned goods of ₹3,200 bought on credit from us → Sales Return Book, supported by a Credit Note.\n6. Paid the stationery bill of ₹800 in cash → Cash Book, payments side — none of this chapter's books is involved.",
          note: "Item 3 would have gone to the Purchases Book if the van had been stock-in-trade for that firm, and item 6 would have gone to the Purchases Book had the stationery been bought on credit by a firm dealing in stationery. The facts, not the words, decide."
        }
      ],
      advBlocks: [
        {
          h: "Periodic totals and how they post — a worked month",
          p: "These books exist so that posting can be done twice a month or once a month instead of after every transaction. Each party is posted individually, and then the columns are cast (totalled) and posted as a block — with double entry preserved to the last rupee.",
          example: "Purchases Book for April:\n5 April — Meera Traders, net of trade discount: ₹18,000\n12 April — Ganga Traders, cost ₹12,000 plus freight ₹400 billed by her: total payable ₹12,400\n20 April — Om Traders: ₹9,600\nCost column total = 18,000 + 12,000 + 9,600 = ₹39,600; Freight column total = ₹400.\nIndividual credits: 18,000 + 12,400 + 9,600 = ₹40,000.\nPeriod-end entry: Purchases A/c Dr. 39,600, Freight Inwards A/c Dr. 400, To Meera Traders, Ganga Traders and Om Traders 40,000.\nDebits 39,600 + 400 = 40,000 = credits 40,000.\n\nSales Book for April:\n8 April — Neha Boutique: ₹32,000\n18 April — Farhan, sale ₹9,000 plus packing charges ₹150 recovered: total debited ₹9,150\n25 April — Kiran: ₹12,000\nSale value total = 32,000 + 9,000 + 12,000 = ₹53,000; Packing column total = ₹150.\nIndividual debits: 32,000 + 9,150 + 12,000 = ₹53,150.\nPeriod-end entry: To Sales A/c 53,000 and To Packing Charges A/c 150, against the three customers ₹53,150.\nCredits 53,000 + 150 = 53,150 = debits 53,150.",
          note: "Freight billed by the seller is debited to Freight Inwards A/c, and packing recovered from the buyer is credited to Packing Charges A/c — neither forms part of the Purchases or Sales figure itself.",
          tip: "Cast the columns twice before posting. A footing error in a subsidiary book will follow the total straight into the Ledger and the Trial Balance."
        },
        {
          h: "Journal Proper entries — worked patterns",
          p: "Journal Proper is where everything that fits no other book is recorded, and its entries fall into six regular patterns: opening entries, closing entries, rectification entries, transfer entries, adjustment entries and miscellaneous entries. Here are four of the commonest miscellany entries, each already in final form.",
          example: "Outstanding rent at the year end ₹1,200 (adjustment entry).\nRent A/c ... Dr. 1,200\n   To Outstanding Rent A/c ... 1,200\n\nGoods costing ₹2,000 taken by the proprietor for household use.\nDrawings A/c ... Dr. 2,000\n   To Purchases A/c ... 2,000\n\nBad debts of ₹2,500 written off against a customer who became insolvent.\nBad Debts A/c ... Dr. 2,500\n   To Customer's A/c ... 2,500\n\nProprietor brought in furniture worth ₹30,000 as capital.\nFurniture A/c ... Dr. 30,000\n   To Capital A/c ... 30,000",
          p2: "The opening entry pattern (assets debited, liabilities and capital credited) and the closing entry pattern (nominal accounts transferred to the Trading or Profit and Loss Account) round out the six categories.",
          note: "None of these can go into the Cash Book either — no cash moves in an adjustment or a transfer, and goods taken for personal use are not a purchase or a sale at all."
        },
        {
          h: "The near misses — transactions that fool careful students",
          p: "Exams are built around transactions that almost belong somewhere. The difference between an almost-right book and the right book is one fact, and the mark usually rests on that single fact.",
          list: [
            { term: "Credit purchase of furniture by a furniture trader", def: "The firm deals in furniture, but this piece is for its own office — a fixed asset, so it is a Journal Proper entry, not a Purchases Book entry." },
            { term: "Credit sale of laptops by a laptop trader to a buyer who will use them in his office", def: "Sales Book. What matters is what the SELLER deals in, never what the buyer intends to do with the goods." },
            { term: "Cash purchase of goods, however large the amount", def: "Cash Book, payments side. Credit is the entry ticket to the Purchases Book, not size of the amount." },
            { term: "Freight paid in cash by the seller on goods dispatched to a customer", def: "Cash Book, payments side, as carriage outwards — it was never billed to the buyer, so it is not part of any Sales Book entry." },
            { term: "Return of goods that were originally bought for cash", def: "Not the Purchases Return Book. Cash transactions were never in the Purchases Book, so their return cannot be in its return book either." },
            { term: "Allowance given to a customer after the invoice has already been issued", def: "Journal Proper — the invoice, and with it the Sales Book entry, is already a closed book." }
          ],
          confusion: {
            a: "Goods for resale",
            aText: "Recorded in the Purchases Book or Sales Book when the transaction is on credit, and in the Cash Book when it is for cash.",
            b: "Assets for own use",
            bText: "Recorded in Journal Proper when bought or sold on credit, and in the Cash Book when money changes hands.",
            diff: "The label on the item does not decide the book — the firm's line of business does. The same table is goods for a furniture trader and an asset for a stationery trader."
          }
        }
      ],
      mistakes: [
        "Recording a cash purchase or cash sale of goods in the Purchases Book or Sales Book simply because goods were involved.",
        "Recording the credit purchase of office furniture or machinery in the Purchases Book — a fixed asset for own use goes to Journal Proper.",
        "Entering trade discount as a separate figure instead of recording only the net invoice value.",
        "Reversing the direction of a return — the supplier is DEBITED in the Purchases Return Book, and the customer is CREDITED in the Sales Return Book.",
        "Sending a Credit Note when goods are returned to a supplier — the purchaser prepares a Debit Note for that, and the seller prepares a Credit Note when goods come back to them.",
        "Posting only the periodic total to Purchases A/c and forgetting that each individual party must also be credited in their own account."
      ],
      summary: [
        "Five subsidiary books besides the Cash Book: Purchases Book, Sales Book, Purchases Return Book, Sales Return Book and Journal Proper.",
        "The Purchases Book and Sales Book take only credit transactions in goods the firm deals in, recorded on the invoice basis net of trade discount.",
        "Cash purchases and sales go to the Cash Book; credit purchases and sales of fixed assets go to Journal Proper.",
        "A Debit Note prepared by the purchaser supports the Purchases Return Book entry, while a Credit Note prepared by the seller supports the Sales Return Book entry.",
        "The return books are ruled exactly like the purchases and sales books, except that Invoice No. is replaced by Debit Note No. or Credit Note No.",
        "Posting is symmetric: parties are credited in the Purchases Book and debited in the Sales Book, while the periodic totals go to the opposite sides of Purchases, Sales and Return accounts.",
        "Freight billed on a purchase is debited to Freight Inwards A/c, and packing recovered on a sale is credited to Packing Charges A/c.",
        "Journal Proper records opening and closing entries, rectification, transfer and adjustment entries, plus miscellaneous items such as bad debts, depreciation, goods drawn for personal use and capital brought in kind."
      ],
      check: [
        { q: "Which book records a credit purchase of furniture by a trader in stationery, and why?", a: "Journal Proper. The furniture is not goods the firm deals in — it is a fixed asset bought for its own use — so even though the purchase is on credit, it cannot enter the Purchases Book." },
        { q: "True or false, with a reason: goods returned to a supplier are recorded in the Sales Return Book because a return reduces sales.", a: "False. Goods returned to a supplier are Returns Outward and go to the Purchases Return Book, supported by a Debit Note prepared by the purchaser. The Sales Return Book records only goods returned BY a customer, supported by a Credit Note." },
        { q: "Goods with a list price of ₹8,000 were bought on credit at a 25% trade discount and a part of them, at a list price of ₹4,000, is returned. What amount is recorded for the return?", a: "The original purchase was recorded net: 8,000 − 25% (2,000) = ₹6,000. The return must be recorded on the same net basis — 4,000 − 25% (1,000) = ₹3,000 — with the supplier debited and Purchases Return A/c credited for ₹3,000." },
        { q: "Give one difference between the Purchases Book and the Purchases Account.", a: "The Purchases Book is part of the Journal and records only credit purchases of goods, with no debit or credit columns. The Purchases Account is part of the Ledger, has debit and credit columns, records cash as well as credit purchases, and its balance is transferred to the Trading Account at year end." }
      ]
    },

    brs: {
      intro: [
        "A firm that banks its money keeps its own record of that account in the bank column of the Cash Book, while the bank keeps its own record in the Pass Book or bank statement it issues. Both describe the same account, yet on any given date the two balances rarely agree. The Bank Reconciliation Statement exists to explain why: it takes one balance, lists every item the other record has not yet picked up, adds or deducts each one, and proves that the two figures match once those items are accounted for.",
        "The causes fall into three groups. First, timing differences — a cheque issued days ago may still be unpresented, and a cheque deposited may not yet have been collected. Second, transactions the bank records first: bank charges, interest allowed, direct collections and direct payments made under standing instructions, which the firm learns of only when it studies the Pass Book. Third, plain errors, whether in the firm's casting of the Cash Book or in the bank's own entries. In every case, one book has recorded the item and the other has not — yet.",
        "Reconciliation itself is deliberately simple. Choose one balance as your starting point, then ask of each item whether that figure is short of, or ahead of, the balance you are trying to reach: short, add; ahead, deduct. Reverse the starting point and every sign reverses with it, which is why this chapter rewards understanding over memorising. The habit matters beyond the exam too — a correctly reconciled bank balance is what finally appears in the Balance Sheet, and regular reconciliation is how errors and fraud come to light."
      ],
      objectives: [
        "Define the Bank Reconciliation Statement and state why the Cash Book and Pass Book balances differ.",
        "Distinguish the balance as per Cash Book from the balance as per Pass Book, including favourable and overdraft readings.",
        "Group the causes of difference into timing differences, bank-recorded items and errors.",
        "Apply the single add-or-deduct rule from either starting balance.",
        "Prepare a BRS in the standard format with heading, date and correctly signed items.",
        "Reconcile when the starting balance is an overdraft, and when the Cash Book itself contains a casting error."
      ],
      blocks: [
        {
          h: "The vocabulary of reconciliation",
          p: "Before any statement can be written, five terms must be absolutely clear — they carry the meaning of every item that follows, and examiners use them precisely.",
          list: [
            { term: "Balance as per Cash Book", def: "The figure the firm's own bank column shows on the given date — every bank transaction exactly as the firm itself has recorded it. A debit balance means money available with the bank; a credit balance means an overdraft." },
            { term: "Balance as per Pass Book", def: "The figure the bank's statement shows on the same date, written from the bank's point of view — money the firm holds with the bank is a credit balance there, and an overdraft appears as a debit balance." },
            { term: "Favourable balance", def: "Money standing to the firm's credit — a debit balance in the Cash Book and a credit balance in the Pass Book. It is the normal, healthy position." },
            { term: "Overdraft", def: "The amount withdrawn in excess of the available balance — a credit balance in the Cash Book and a debit balance in the Pass Book. It is a liability owed to the bank." },
            { term: "Unpresented cheque", def: "A cheque issued by the firm and already recorded in its Cash Book, but not yet presented at the bank by the payee." },
            { term: "Uncollected cheque", def: "A cheque deposited by the firm and already recorded in its Cash Book, but not yet cleared and credited by the bank." }
          ],
          real: "Your pass book says ₹30,000, but you paid a supplier by cheque yesterday and he has not banked it yet. The bank still shows ₹30,000; your own records already show ₹26,000. Neither is wrong — one is simply a day ahead of the other.",
          note: "The reversal of debit and credit language between the two books changes no part of the reconciliation logic. Throughout the chapter, balance as per Pass Book simply means the closing figure the statement shows on that date."
        },
        {
          h: "A worked statement starting from the Cash Book balance",
          p: "This is the commonest format: begin with your own bank column balance and adjust it item by item until it equals the Pass Book figure. Every item is tested against one question — is my starting figure short of, or ahead of, the target?",
          example: "Bank Reconciliation Statement as on 31st March, 2026\n\nBalance as per Cash Book                                 40,000\nAdd: Cheque issued but not yet presented                 4,000\n                                                          -------\n                                                       44,000\nLess: Cheque deposited but not yet collected             2,500\nLess: Bank charges not yet entered in the Cash Book        200    2,700\n                                                          -------\nBalance as per Pass Book                                 41,300\n                                                          =======\n\nWorking: the firm has already reduced its balance for the unpresented cheque, so the Cash Book is short of the Pass Book there — Add. The firm has already increased its balance for the deposit the bank has not credited yet, and has not yet been debited for the charges — both make the Cash Book ahead — Less.\nCheck: 40,000 + 4,000 − 2,500 − 200 = 41,300.",
          tip: "Write the heading and the date even when the question is short — format marks are given for structure, not only for the final figure."
        },
        {
          h: "The four-step method",
          p: "Every reconciliation in this chapter, however long, is built the same four steps. Follow them in order and no question can catch you out.",
          list: [
            { term: "Step 1 — Fix the starting point", def: "Write the balance you have been given — as per Cash Book or as per Pass Book — and note whether it is favourable or an overdraft before touching anything else." },
            { term: "Step 2 — Test every item", def: "For each item ask: because of this, is my starting figure short of, or ahead of, the balance I am trying to reach? Short means Add; ahead means Less." },
            { term: "Step 3 — Group and total", def: "List all additions under Add and all deductions under Less, sub-total each group, then apply them to the starting figure in order." },
            { term: "Step 4 — Prove the result", def: "The figure you arrive at must be exactly the other balance. If it is not, one item has been missed, treated backwards or mis-added — re-check the arithmetic line by line." }
          ],
          formula: "Starting Balance ± Reconciling Items = The Other Balance\nShort of the target → Add.   Ahead of the target → Less.",
          note: "Never memorise a fixed list of signs. The same item flips direction with the starting point, so a list memorised for one format becomes a trap in the other."
        },
        {
          h: "What a BRS is — and is not",
          p: "A Bank Reconciliation Statement is a statement, not an account. It has no debit and credit sides, no ledger posting, and it does not change any balance — it only explains the difference between two records of the same account on a particular date.",
          p2: "Most items in it need no Journal entry at all. An unpresented cheque needs no entry, because the Cash Book has already recorded it correctly and the bank will record it when the payee cashes it. Only genuine bank-initiated items — charges, interest, direct collections and payments — must eventually be recorded in the Cash Book, once the firm has been intimated about them.",
          confusion: {
            a: "Balance as per Cash Book",
            aText: "What the firm's own records show, based only on what the firm knows on that date. Debit balance means money at the bank; credit balance means overdraft.",
            b: "Balance as per Pass Book",
            bText: "What the bank's records show, based only on what the bank has processed. Credit balance means money at the bank; debit balance means overdraft.",
            diff: "The two describe one account from opposite ends. They differ only because each side has recorded what it knows so far — reconcile the timing, and they must agree."
          },
          mistakes: [
            "Passing a Journal entry for every reconciling item — most are pure timing differences that need no entry at all.",
            "Writing the statement in T-shape with Dr and Cr sides — a BRS is a vertical statement of additions and deductions."
          ]
        }
      ],
      advBlocks: [
        {
          h: "A worked statement starting from the Pass Book balance",
          p: "The same statement prepared from the other end. Every item that was an Add from the Cash Book becomes a Less here, and every Less becomes an Add, because the direction of travel has reversed.",
          example: "Bank Reconciliation Statement as on 31st March, 2026\n\nBalance as per Pass Book                                30,000\nLess: Cheque issued but not yet presented                5,000\nLess: Interest credited by the bank, not yet in the\n      Cash Book                                           150    5,150\n                                                          -------\n                                                       24,850\nAdd: Cheque deposited but not yet collected              3,000\n                                                          -------\nBalance as per Cash Book                                 27,850\n                                                          =======\n\nWorking: the Pass Book is ahead where the firm has not yet recorded its own payment and the bank's interest — those are Less here. The Pass Book is behind where the firm has banked a cheque it has not yet cleared — that is Add.\nCheck: 30,000 − 5,000 − 150 + 3,000 = 27,850.",
          note: "Compare this with the statement started from the Cash Book: the unpresented cheque was an Add there and a Less here, while the uncollected cheque was a Less there and an Add here. The facts never changed — only the starting point did.",
          tip: "Whichever format the question demands, decide each item afresh with the short-or-ahead test. Marks are for the reasoning behind the sign, not the sign itself."
        },
        {
          h: "A worked statement when the starting point is an overdraft",
          p: "An overdraft flips the usual picture: the Cash Book balance sits on the credit side and the Pass Book records it as a debit. The add-or-deduct logic, however, does not change at all — it is applied to the signed balance.",
          example: "Bank Reconciliation Statement as on 31st March, 2026\n\nBalance as per Cash Book (overdraft)                    (8,000)\nAdd: Cheque issued but not yet presented                 1,500\n                                                          -------\n                                                       (6,500)\nLess: Cheque deposited but not yet collected             2,000\n                                                          -------\nBalance as per Pass Book (overdraft)                    (10,000)\n                                                          =======\n\nReading the figures: as a signed balance, −8,000 + 1,500 − 2,000 = −10,000.\nThe firm has already deepened its overdraft for the cheque it issued, while the bank has not — so the Cash Book figure is short of the Pass Book figure there, and the item is added, which brings the overdraft down to 6,500. The deposit has already reduced the Cash Book overdraft, while the bank has not credited it yet — so the Cash Book figure is ahead of the Pass Book figure there, and the item is deducted, taking the overdraft to 10,000.",
          note: "Adding to an overdraft reduces its size, and deducting from it makes it larger — that apparent reversal is exactly why overdraft questions are marked as the hard variety.",
          mistakes: [
            "Treating every overdraft item as a Less simply because the balance is a liability.",
            "Dropping the negative sign halfway through and reporting an overdraft as a favourable balance."
          ]
        },
        {
          h: "Recording first, then reconciling — the amended Cash Book approach",
          p: "Bank-initiated items must eventually enter the Cash Book anyway, because the firm is now aware of them. A neat way to handle a statement containing several such items is to record them first, then reconcile the amended balance — this leaves only genuine timing differences in the statement.",
          example: "Balance as per Cash Book ₹25,000. Bank charges of ₹200 debited by the bank and interest of ₹150 credited by the bank are not yet in the Cash Book. A cheque of ₹5,000 issued is still unpresented.\n\nStep 1 — record the two bank items in the Cash Book:\nBank Charges A/c ... Dr. 200\n   To Bank A/c ... 200\nBank A/c ... Dr. 150\n   To Interest Received A/c ... 150\n\nStep 2 — amended Cash Book balance = 25,000 − 200 + 150 = ₹24,950.\n\nStep 3 — Bank Reconciliation Statement:\nBalance as per amended Cash Book                        24,950\nAdd: Cheque issued but not yet presented                 5,000\nBalance as per Pass Book                                29,950\n\nCross-check from the unamended balance: 25,000 + 5,000 − 200 + 150 = ₹29,950 — the same answer.",
          note: "Whether you adjust the Cash Book first or adjust the starting balance in the statement, the Pass Book figure you reach must be identical. That cross-check is the quickest proof that your signs are right.",
          tip: "If a question gives several bank-initiated items and asks for the amended cash balance before reconciling, treat the BRS items as only those that remain unrecorded."
        },
        {
          h: "Errors that only reconciliation can expose",
          p: "Not every difference is a timing gap — some are genuine mistakes, and finding them is one of the main reasons reconciliation is done. Errors inside the Cash Book are corrected towards the correct Pass Book figure, while errors made by the bank are corrected towards the correct Cash Book figure.",
          list: [
            { term: "Receipts side of the bank column undercast", def: "The Cash Book balance is understated → Add the shortfall when starting from the Cash Book." },
            { term: "Receipts side overcast", def: "The Cash Book balance is overstated → Less the excess when starting from the Cash Book." },
            { term: "Payments side undercast", def: "Too little was deducted, so the balance is overstated → Less the shortfall when starting from the Cash Book." },
            { term: "Payments side overcast", def: "Too much was deducted, so the balance is understated → Add the excess when starting from the Cash Book." },
            { term: "The bank has wrongly credited the account", def: "The Pass Book is overstated → Less this amount when starting from the Pass Book, or Add it when starting from the Cash Book to reach that inflated figure." },
            { term: "The bank has wrongly debited the account", def: "The Pass Book is understated → Add this amount when starting from the Pass Book, or Less it when starting from the Cash Book." }
          ],
          example: "Cash Book shows a bank balance of ₹40,000. On checking the statement it is found that the receipts side of the bank column was undercast by ₹500 and the payments side was overcast by ₹300.\n\nReceipts undercast: the true balance is higher by ₹500 → Add.\nPayments overcast: ₹300 too much was deducted, so the true balance is higher by ₹300 → Add.\n\nCorrected Cash Book balance = 40,000 + 500 + 300 = ₹40,800,\nwhich is then reconciled with the remaining timing items to reach the Pass Book figure.",
          tip: "Before blaming the bank, re-add both columns of your own bank column. A casting error in the Cash Book is far more common than an error by the bank."
        }
      ],
      mistakes: [
        "Confusing an unpresented cheque (issued, Cash Book already reduced) with an uncollected cheque (deposited, Cash Book already increased) — they take exactly opposite treatment.",
        "Applying signs from memory instead of asking whether the starting balance is short of, or ahead of, the target figure.",
        "Forgetting to write the starting balance itself and jumping straight to the Add and Less items.",
        "Treating bank-initiated items as if the Cash Book has already recorded them — charges, interest, direct collections and direct payments sit only in the Pass Book until the firm records them.",
        "Passing a Journal entry for every reconciling item, when most are pure timing differences that need no entry at all.",
        "Arriving at a figure that does not agree and assuming the statement is at fault, instead of re-totalling each line of the arithmetic."
      ],
      summary: [
        "The Cash Book's bank column and the Pass Book record the same account from two sides, and their balances differ whenever one side has recorded something the other has not yet.",
        "Causes fall into three groups — timing differences, bank-recorded items such as charges and interest, and outright errors in either book.",
        "Start from one balance and ask of each item whether the starting figure is short of, or ahead of, the target: short means Add, ahead means Less.",
        "Reverse the starting point and every sign reverses with it — an unpresented cheque is added from the Cash Book and deducted from the Pass Book.",
        "A favourable balance is money with the bank, shown as a debit balance in the Cash Book and a credit balance in the Pass Book; an overdraft is the exact reverse of both.",
        "The statement carries a heading with the date, items grouped under Add and Less, and closes on the balance of the other book.",
        "Casting errors in the Cash Book are corrected towards the Pass Book figure, while errors made by the bank are corrected towards the Cash Book figure.",
        "Most reconciling items need no Journal entry — only bank-initiated items, once intimated to the firm, are recorded in the Cash Book."
      ],
      check: [
        { q: "Why do the Cash Book and Pass Book balances differ even when neither book contains an error?", a: "Because of timing differences. The firm records a transaction when it becomes aware of it, while the bank records the same transaction when it processes it — a cheque issued is recorded at once by the firm but only when presented by the payee, and a cheque deposited is recorded at once by the firm but only when it clears. Until both sides record it, the two balances differ." },
        { q: "True or false, with a reason: a cheque deposited into the bank but not yet collected should be added when the statement starts from the Cash Book balance.", a: "False. The firm has already increased its Cash Book balance for that cheque, but the bank has not credited it yet, so the Cash Book is ahead of the Pass Book. Ahead means deduct — it is deducted when starting from the Cash Book and added when starting from the Pass Book." },
        { q: "Starting from a Cash Book balance of ₹25,000, with an unpresented cheque of ₹5,000, an uncollected cheque of ₹3,000 and bank charges of ₹200, find the balance as per Pass Book.", a: "25,000 + 5,000 − 3,000 − 200 = ₹26,800. The unpresented cheque is added because the Cash Book is short of the Pass Book there; the uncollected cheque and the bank charges are deducted because the Cash Book is ahead of the Pass Book in both cases." },
        { q: "Give one difference between an unpresented cheque and an uncollected cheque.", a: "An unpresented cheque is one the firm has ISSUED — the Cash Book has already reduced the balance for it, but the payee has not yet cashed it, so the Pass Book is still higher. An uncollected cheque is one the firm has DEPOSITED — the Cash Book has already increased the balance for it, but the bank has not yet cleared it, so the Pass Book is still lower. They therefore take opposite signs in a statement." }
      ]
    },

    gst: {
      intro: [
        "Goods and Services Tax is a single, comprehensive indirect tax levied on the supply of goods and services in India, replacing the maze of earlier levies such as VAT, excise duty and service tax. It is collected by the seller from the buyer as part of the price and deposited with the government, so although the business handles the money, the burden finally falls on the consumer. It is charged at every stage of the supply chain, follows the goods to the state where they are finally consumed, and is broadly uniform across the country — the idea behind the phrase One Nation, One Tax.",
        "For a business, GST is experienced through just two figures. GST paid on purchases is Input GST, which the business can claim back; GST collected on sales is Output GST, which it owes to the government. At the end of a tax period only the difference is paid — Net GST Payable equals Output GST minus Input GST. This mechanism of Input Tax Credit is what removes the cascading effect of tax on tax, so that each stage effectively pays tax only on the value it has added.",
        "Two practical questions decide every answer in this chapter. First, where are the buyer and the seller located — an intra-state supply splits the tax equally into CGST and SGST, while an inter-state supply charges the whole amount as IGST. Second, what value is the tax computed on — always the taxable value, meaning the list price after trade discount, with freight included only if the question says GST applies to it. Those two questions, asked in that order, settle both the figures and the journal entries."
      ],
      objectives: [
        "Define GST and describe its main characteristics — multi-stage, value-added, destination-based and dual.",
        "Explain Input Tax Credit and show how it removes the cascading effect of tax on tax.",
        "Compute taxable value, GST amount and invoice value, deducting trade discount first.",
        "Determine whether a supply is intra-state (CGST and SGST) or inter-state (IGST) and split the tax accordingly.",
        "Record purchases and sales with GST through Input GST and Output GST accounts.",
        "Calculate the net GST payable for a period and recognise when excess input credit is carried forward."
      ],
      blocks: [
        {
          h: "Input Tax Credit — why tax on tax disappears",
          p: "Before GST, a business that paid tax on its purchases often ended up paying tax again on an amount that already contained that tax — the cascading effect. Input Tax Credit removes it by letting the business set off the GST it has already paid against the GST it collects, so that tax falls only on the value added at each stage.",
          example: "Stage 1 — a manufacturer buys raw material for ₹1,000 and pays GST of ₹180. This ₹180 is his Input GST.\nStage 2 — he sells the finished product for ₹1,500. GST collected (Output GST) = 1,500 × 18% = ₹270.\nNet GST payable at stage 2 = 270 − 180 = ₹90.\n\n₹90 is exactly 18% of the value he added: 1,500 − 1,000 = ₹500, and 500 × 18% = ₹90.\n\nWithout Input Tax Credit the burden would have been 180 + 270 = ₹450 on a value added of only ₹500 — tax charged on tax.",
          real: "A wholesaler buys a carton on which tax has already been paid at the factory, and sells it with tax on his own margin. He deposits only the difference — the tax his customer pays him minus the tax shown on his own purchase bill.",
          note: "Input Tax Credit is the reason GST is called a value-added tax, even though it is charged at every stage of the supply chain.",
          tip: "A one-mark question on cascading is really a question on Input Tax Credit — mention tax on tax and how credit avoids it."
        },
        {
          h: "A shop's month — input, output and the net payable",
          p: "Every GST calculation in business life is the same two-sided comparison. The shop collects Output GST from its customers all month, has already paid Input GST to its suppliers, and at the end of the period pays over only the balance.",
          example: "Purchases during April: ₹20,000, GST at 18%.\nInput GST = 20,000 × 18/100 = ₹3,600 — paid to suppliers, and claimable as credit.\n\nSales during April: ₹30,000, GST at 18%.\nOutput GST = 30,000 × 18/100 = ₹5,400 — collected from customers, and payable to the government.\n\nNet GST Payable = Output GST − Input GST = 5,400 − 3,600 = ₹1,800.",
          p2: "Input GST behaves like an asset because it can be claimed; Output GST is a liability because it is money held on behalf of the government. Adjusting one against the other is what the period-end calculation does.",
          formula: "Net GST Payable = Output GST − Input GST",
          note: "Only the difference of ₹1,800 leaves the business — the ₹3,600 already paid to suppliers is not paid to the government a second time."
        },
        {
          h: "Reading a tax invoice line by line",
          p: "Every GST question is really a bill waiting to be built. The invoice shows the taxable value first, then the tax computed on it, and finally the total the customer pays — in an intra-state supply the tax appears as two equal halves.",
          list: [
            { term: "Taxable value", def: "The value on which GST is computed — the list price after deducting any trade discount, plus freight only if the question says GST applies to it." },
            { term: "GST amount", def: "Taxable value multiplied by the rate, divided by 100 — the total tax for the supply." },
            { term: "CGST and SGST", def: "For an intra-state supply, the total GST is split equally — at an 18% rate, CGST is 9% and SGST is 9%." },
            { term: "IGST", def: "For an inter-state supply, the whole tax appears as a single IGST line, with no split." },
            { term: "Invoice value", def: "Taxable value plus the GST — the amount the customer actually pays." }
          ],
          example: "Goods of taxable value ₹9,000 sold within the state, GST at 18%.\nTotal GST = 9,000 × 18/100 = ₹1,620.\nCGST = 1,620 ÷ 2 = ₹810 and SGST = 1,620 ÷ 2 = ₹810.\nInvoice value = 9,000 + 810 + 810 = ₹10,620.",
          real: "Look at any shop bill in India: the taxable value is printed, then CGST 9% and SGST 9% as separate lines for a local purchase, and the three figures add up to the amount at the bottom.",
          tip: "Show the split as two lines even when the question only asks for the total — examiners award marks for naming CGST and SGST separately."
        },
        {
          h: "The words in the question that change your answer",
          p: "Almost every GST error is a reading error. Four or five phrases decide the entire working, and spotting them before picking up the pen is the cheapest marks in the paper.",
          list: [
            { term: "List price less trade discount", def: "Deduct the trade discount first. GST is computed only on the resulting taxable value, never on the list price." },
            { term: "Cash discount for prompt payment", def: "Comes after GST, at the time of settlement. It never reduces the taxable value and never changes the GST already charged." },
            { term: "Freight or cartage charged", def: "Include it in the taxable value only if the question says GST is also chargeable on it; otherwise calculate GST on the goods alone and add the freight afterwards to the invoice value." },
            { term: "Intra-state or within the same state", def: "Split the total GST equally into CGST and SGST." },
            { term: "Inter-state or to another state", def: "Charge the full amount as IGST, with no split." },
            { term: "Invoice value inclusive of GST", def: "Work backwards — divide the invoice value by (1 + rate/100) to recover the taxable value." }
          ],
          confusion: {
            a: "Trade discount",
            aText: "Given on the list price before the bill is worked out. Deduct it first, then compute GST on the lower figure.",
            b: "Cash discount",
            bText: "Given to encourage early settlement of an invoice that is already raised. GST stands as charged, and only the cash actually received changes.",
            diff: "Trade discount changes the taxable value; cash discount changes only what the customer hands over at the end."
          }
        }
      ],
      advBlocks: [
        {
          h: "Working backwards — taxable value and rate from a given figure",
          p: "Not every question hands you the taxable value. Sometimes the invoice total is given, GST-inclusive, or the tax amount is given with the value and you are asked for the rate. Both are handled with one line of reverse arithmetic.",
          formula: "Taxable Value = Invoice Value ÷ (1 + Rate/100)\nRate of GST = (GST Amount ÷ Taxable Value) × 100",
          example: "A. The invoice value of goods, inclusive of 18% GST, is ₹10,620. Find the taxable value.\nTaxable value = 10,620 ÷ 1.18 = ₹9,000.\nCheck: 9,000 × 18/100 = ₹1,620, and 9,000 + 1,620 = ₹10,620.\n\nB. Taxable value of goods is ₹6,000 and the GST charged is ₹1,080. Find the rate.\nRate = (1,080 ÷ 6,000) × 100 = 18%.\n\nC. Goods worth ₹5,000 sold at 12%. GST = 5,000 × 12/100 = ₹600; invoice value = 5,600.",
          note: "The division method works because the invoice value is simply the taxable value multiplied by (1 + rate/100) — the same relationship, read forwards or backwards.",
          tip: "When the answer options are given, multiplying each option by (1 + rate/100) is often quicker than dividing — but always confirm with one check line."
        },
        {
          h: "Freight and GST in one bill — both treatments worked",
          p: "Freight is the classic trap, because the question itself decides how it is treated. If GST is stated to be chargeable on the freight, the freight joins the taxable value before GST is computed; if the question is silent or says freight is charged separately, GST is computed on the goods alone and the freight is added afterwards.",
          example: "Goods with a list price of ₹20,000, trade discount 10%, GST 18%, freight ₹500.\n\nTaxable value of goods = 20,000 − (10% × 20,000) = 20,000 − 2,000 = ₹18,000.\n\nCase A — GST also chargeable on the freight:\nTaxable value = 18,000 + 500 = ₹18,500.\nGST = 18,500 × 18/100 = ₹3,330.\nInvoice value = 18,500 + 3,330 = ₹21,830.\n\nCase B — GST not applicable on the freight:\nGST = 18,000 × 18/100 = ₹3,240.\nInvoice value = 18,000 + 3,240 + 500 = ₹21,740.",
          note: "In Case A the freight earns credit along with the goods; in Case B it simply rides along at the bottom of the bill. The difference in the final figure is only ₹90 — the GST on ₹500.",
          mistakes: [
            "Adding freight to the taxable value even when the question says GST applies to the goods alone.",
            "Computing GST on the list price and deducting trade discount afterwards — the discount always comes first."
          ]
        },
        {
          h: "Cash discount comes after GST",
          p: "A cash discount is a concession granted at the time of settlement, on an invoice that has already been raised and taxed. It does not reduce the taxable value, and it never changes the Output GST already recorded — it simply reduces the cash the business receives, with the difference recorded as Discount Allowed.",
          example: "Goods of ₹10,000 sold, GST 18%.\nGST = 10,000 × 18/100 = ₹1,800.\nInvoice value = 10,000 + 1,800 = ₹11,800.\n\nIf the customer settles promptly and is allowed a cash discount of ₹180:\nCash A/c ... Dr. 11,620\nDiscount Allowed A/c ... Dr. 180\n   To Customer's A/c ... 11,800\n\nCheck: 11,620 + 180 = 11,800. Output GST remains ₹1,800 — the discount does not touch it.",
          p2: "The same logic applies from the buyer's side: a cash discount received on a purchase does not reduce the Input GST already claimed on the original invoice.",
          note: "Cash discount is recorded through Journal Proper, exactly as the Cash Book chapter teaches — it never has a column of its own.",
          confusion: {
            a: "Before GST",
            aText: "Only trade discount belongs here — it is a reduction in the price itself, so the taxable value falls before the rate is applied.",
            b: "After GST",
            bText: "Cash discount belongs here — it is a reduction in what is finally collected on an invoice whose GST is already fixed.",
            diff: "Compute GST on the price after trade discount, then, and only then, allow any cash discount on settlement."
          }
        },
        {
          h: "Net position at the end of a tax period — payable or carried forward",
          p: "At the end of a period the Output GST and Input GST are simply set against each other. If Output is larger, the balance is payable to the government; if Input is larger, the excess is not lost — it is carried forward as credit to the next period.",
          example: "Case 1 — Output GST ₹6,200 and Input GST ₹4,500.\nNet GST Payable = 6,200 − 4,500 = ₹1,700 payable to the government.\n\nCase 2 — Output GST ₹4,500 and Input GST ₹6,200.\nNet position = 4,500 − 6,200 = −₹1,700.\nThis is an excess input credit of ₹1,700, carried forward to the next tax period — not a refund by default.",
          formula: "Output GST greater than Input GST → Net GST Payable\nInput GST greater than Output GST → excess credit carried forward",
          p2: "On the intra-state and inter-state sides, the same set-off is done component-wise: input CGST against output CGST and input SGST against output SGST for local supplies, and input IGST against output IGST for inter-state supplies.",
          note: "A negative net figure does not mean the government owes the business cash — it means the business may adjust that credit against the tax it collects next period.",
          tip: "State the sign and the meaning together in an answer: payable, or carried forward as credit. Marks are given for recognising which of the two you have found."
        }
      ],
      mistakes: [
        "Charging GST on the list price when a trade discount was allowed — the taxable value is the price after the discount.",
        "Adding freight to the taxable value even when the question is silent about GST on freight.",
        "Writing both CGST and SGST and then IGST as well — only one system applies to a given supply.",
        "Debiting Output GST or crediting Input GST — Input GST belongs to purchases and is debited, Output GST belongs to sales and is credited.",
        "Debiting or crediting the customer's account with only the taxable value instead of the full invoice value including GST.",
        "Deducting cash discount before computing GST — cash discount is a settlement matter and always comes after GST."
      ],
      summary: [
        "GST is a single comprehensive indirect tax on the supply of goods and services, replacing VAT, excise duty and service tax.",
        "It is multi-stage, value-added and destination-based, with a dual structure — CGST and SGST for intra-state supplies and IGST for inter-state supplies.",
        "Taxable Value = List Price − Trade Discount, and GST is computed only on that taxable value.",
        "Include freight in the taxable value only when the question says GST applies to it; otherwise add it to the invoice value after GST.",
        "Input GST on purchases is debited, Output GST on sales is credited, and Net GST Payable = Output GST − Input GST.",
        "For an intra-state supply the total tax is split equally — CGST = SGST = total GST ÷ 2; an inter-state supply carries the full amount as IGST.",
        "The party to a credit transaction is debited or credited with the full invoice value, taxable value plus GST, not merely the taxable value.",
        "Excess Input GST over Output GST is carried forward as credit to the next period — it is not automatically a refund."
      ],
      check: [
        { q: "What is Input Tax Credit, and which problem of the pre-GST era does it solve?", a: "Input Tax Credit is the credit a business claims for the GST it has already paid on its own purchases, which it sets off against the GST it collects on sales. It solves the cascading effect — tax charged on an amount that already includes tax paid earlier — so that tax is effectively charged only on the value added at each stage." },
        { q: "True or false, with a reason: when a list price of ₹10,000 is subject to a 10% trade discount, GST at 18% is charged on ₹10,000.", a: "False. The trade discount is deducted first — 10% of ₹10,000 is ₹1,000, so the taxable value is ₹9,000 and GST is 9,000 × 18% = ₹1,620, giving an invoice value of ₹10,620." },
        { q: "Goods with a list price of ₹15,000 are sold at a 20% trade discount with GST at 12%. Find the taxable value, the GST and the invoice value.", a: "Trade discount = 20% of 15,000 = ₹3,000, so taxable value = 15,000 − 3,000 = ₹12,000. GST = 12,000 × 12/100 = ₹1,440. Invoice value = 12,000 + 1,440 = ₹13,440." },
        { q: "Give one difference between an intra-state supply and an inter-state supply so far as tax is concerned.", a: "An intra-state supply (buyer and seller in the same state) is taxed with CGST and SGST in equal halves — at 18%, that is 9% each. An inter-state supply (buyer and seller in different states) is taxed with the single full-rate IGST, with no CGST/SGST split at all." }
      ]
    }
  });
})();

/* theory-upgrade part 3 — Class 11 chapters 13-18 (tb, dep, pres, roe, fs, adj) */
(function () {
  "use strict";
  window.THEORY_UPGRADE_PARTS = window.THEORY_UPGRADE_PARTS || [];
  window.THEORY_UPGRADE_PARTS.push({
    tb: {
      intro: [
        "Every accounting year produces hundreds of ledger accounts, each balanced to a single figure. The Trial Balance is the statement that gathers all those figures onto one page, as on a particular date, so that the accountant can check one thing before going further: does the total of all debit balances equal the total of all credit balances? Because every transaction was recorded with an equal debit and an equal credit, a correctly written-up set of books should always produce equal totals — and the Trial Balance is where that promise is tested.",
        "The Trial Balance sits at a very specific point in the accounting cycle: after every ledger account has been balanced, and before the Trading Account, Profit and Loss Account and Balance Sheet are drawn. It is a statement, not an account — it has no debit or credit side of its own, only two money columns. And it is a humble but honest check: it confirms arithmetical agreement, yet it cannot certify that the books are free of every kind of error, because several types of errors never disturb the equality of the totals.",
        "This upgrade takes the chapter further in four directions. It explains the three methods of extracting a Trial Balance — totals, balance and list. It gives you a detective's toolkit for locating the difference when the columns refuse to agree, including the halving and nine tests. It shows how a Suspense Account carries the difference until every one-sided error is found. And it decodes the ledger balances that confuse everyone — sales returns, provisions, interest on drawings — into their correct columns."
      ],
      objectives: [
        "Explain the place of the Trial Balance in the accounting cycle, from subsidiary books and ledger balancing to the final accounts.",
        "Distinguish between the Totals Method, the Balance Method and the List Method of extracting a Trial Balance.",
        "Classify tricky ledger balances into the correct debit or credit column using the rules of debit and credit.",
        "Apply systematic techniques to locate the difference when the Trial Balance disagrees, including the halving and nine tests.",
        "Explain how a Suspense Account carries the difference until the one-sided errors behind it are rectified.",
        "Judge precisely what an agreeing Trial Balance proves — and what it silently allows to remain wrong."
      ],
      blocks: [
        {
          h: "The Trial Balance in the Accounting Cycle",
          p: "The Trial Balance is neither the first nor the last document of the year — it is the checkpoint in the middle. Transactions enter through the Journal or the subsidiary books, flow into the Ledger accounts, and each Ledger account is then balanced to one closing figure. The Trial Balance simply collects those closing figures. Everything after it — the Trading Account, the Profit and Loss Account and the Balance Sheet — is built from the numbers it lists.",
          list: [
            { term: "Before the Trial Balance", def: "Journal entries and subsidiary books feed the Ledger; every Ledger account is balanced so that it shows one debit balance or one credit balance" },
            { term: "The Trial Balance itself", def: "A two-column statement listing every account with a non-zero balance, under Particulars, with its figure in the Debit Balance or Credit Balance column" },
            { term: "After the Trial Balance", def: "The balances are sorted into the Trading Account, the Profit and Loss Account and the Balance Sheet to produce the final accounts" },
            { term: "Why the sequence matters", def: "If the Trial Balance disagrees, the error must be hunted before the final accounts are drawn — otherwise the profit figure and the Balance Sheet will both be built on shaky numbers" }
          ],
          simple: "Think of the Trial Balance as a daily headcount of the ledger. Before the parade of final accounts begins, every account is made to stand in its correct column, and the two columns must hold the same number of people.",
          note: "The Trial Balance is prepared from the CLOSING balances of ledger accounts — never from their individual totals — unless the question explicitly asks for the Totals Method."
        },
        {
          h: "Three Methods of Extracting a Trial Balance",
          p: "The word extraction is used deliberately: the Trial Balance is extracted from the ledger in one of three ways. All three aim at the same check, but they differ in what figure each account contributes to the statement.",
          list: [
            { term: "Totals Method", def: "The debit-side total and the credit-side total of each ledger account are listed in the two columns. Agreement of the combined totals checks the arithmetic, but every account with unequal sides leaves a balance that this method never isolates" },
            { term: "Balance Method", def: "Each account is first balanced, and only its single closing figure — debit balance or credit balance — is listed. This is the method Class 11 questions normally expect" },
            { term: "List Method", def: "Balances are copied straight from the ledger pages as they are found, without separately extracting totals first. It is quick but gives the least checking value" },
            { term: "Which one to use in exams", def: "Unless the question names a method, prepare by the Balance Method and say so in a line — some marking schemes award a mark for stating the method chosen" }
          ],
          formula: "Balance Method:  Total of Debit Balances = Total of Credit Balances\n\nTotals Method:   Combined debit-side totals = Combined credit-side totals\n\nList Method:    Balances listed directly from the ledger, then totalled",
          note: "All three methods serve the same purpose — verifying arithmetical agreement. Only the Balance Method, however, produces the single clean figures that flow into the final accounts."
        },
        {
          h: "Balances That Confuse Everyone",
          p: "Most Trial Balance errors are not arithmetic at all — they are classification slips. Whether a balance falls in the debit or the credit column depends on what the account is, and a handful of accounts trip up students repeatedly because they behave opposite to what their names suggest.",
          list: [
            { term: "Sales Returns (Returns Inward)", def: "A debit balance — it reduces sales, so it behaves like a reduction of income, the opposite of Sales itself" },
            { term: "Purchases Returns (Returns Outward)", def: "A credit balance — it reduces purchases, so it behaves like a reduction of expense, the opposite of Purchases" },
            { term: "Provision for Depreciation", def: "A credit balance — it accumulates a reduction against an asset's value, even though it relates to an asset" },
            { term: "Provision for Doubtful Debts", def: "A credit balance — a provision against debtors, deducted from the asset in the Balance Sheet, never shown as a debit" },
            { term: "Interest on Drawings", def: "A credit balance — it is income of the business, charged to the owner, just as Interest on Capital is an expense (debit) of the business" },
            { term: "Drawings", def: "A debit balance — it reduces the owner's capital, and reduction of capital always behaves like a debit" },
            { term: "Outstanding expenses and prepaid expenses", def: "Outstanding rent, wages and similar items are credit balances (liabilities); prepaid insurance and similar items are debit balances (assets)" }
          ],
          simple: "If an account grows with a debit entry, its closing balance sits in the debit column; if it grows with a credit entry, its balance sits in the credit column. Returns and provisions are simply growth-in-reverse accounts.",
          tip: "When you see Provision, Interest on, or Returns in a Trial Balance question, pause for two seconds and ask which way the account grows — that single habit prevents most column slips."
        },
        {
          h: "The Suspense Account — What Happens When the Totals Disagree",
          p: "When the two columns refuse to agree, the difference cannot simply be left hanging — the final accounts still have to be prepared. The standard practice is to park the unexplained difference in a temporary Suspense Account, so that the books force-agree while the error is hunted down. The short side of the Trial Balance is the side completed through the Suspense Account.",
          list: [
            { term: "Debit total heavier", def: "The credit side is short, so the Suspense Account is CREDITED with the difference to complete that side" },
            { term: "Credit total heavier", def: "The debit side is short, so the Suspense Account is DEBITED with the difference" },
            { term: "As errors are found", def: "Each rectifying entry touches the Suspense Account and removes part of the parked difference" },
            { term: "The finishing signal", def: "When every one-sided error has been found and corrected, the Suspense Account closes to nil — nothing remains unexplained" }
          ],
          example: "A Trial Balance shows a debit total of ₹84,500 and a credit total of ₹81,700. The debit side is heavier by ₹2,800, so the credit side is completed by CREDITING a Suspense Account with ₹2,800. On investigation, two one-sided errors surface: an account had been overcast by ₹1,900, and a credit of ₹900 had never been posted. Rectifying both debits the Suspense Account ₹1,900 + ₹900 = ₹2,800 — exactly the amount parked in it — and the Suspense Account closes to nil.",
          confusion: {
            a: "Trial Balance",
            aText: "A statement of ledger balances, prepared to check arithmetical agreement.",
            b: "Suspense Account",
            bText: "A temporary account that parks the unexplained difference when the Trial Balance fails to agree.",
            diff: "A Trial Balance is prepared from balanced ledger accounts and is expected to agree; a Suspense Account exists only BECAUSE the Trial Balance disagreed, holds only the unexplained difference, and must close to nil once every one-sided error has been rectified."
          },
          note: "A Suspense Account is never opened when the Trial Balance agrees — errors that keep the totals equal need no suspense, only careful checking."
        }
      ],
      advBlocks: [
        {
          h: "Totals Method and List Method — Worked",
          p: "The Balance Method has its own worked example in the chapter. Here is how the other two methods actually look, so that no variety of question can surprise you.",
          list: [
            { term: "Under the Totals Method", def: "Each ledger account contributes two figures — its debit-side total and its credit-side total. A Cash Account with a debit-side total of ₹1,08,600 and a credit-side total of ₹96,400 appears as ₹1,08,600 in the Trial Balance debit column and ₹96,400 in the credit column. The account's actual balance of ₹12,200 is never isolated, so the statement checks casting but hides what each account is really worth" },
            { term: "Under the List Method", def: "The clerk runs down the ledger pages and copies whatever balance each account shows, without first balancing the accounts separately. It saves time but catches fewer mistakes, since an unbalanced account contributes a wrong figure with no second look" },
            { term: "Under the Balance Method", def: "Every account is balanced first, so the statement shows one true figure per account — the figures that will feed the Trading Account, Profit and Loss Account and Balance Sheet directly" }
          ],
          example: "Cash Account — debit side total ₹1,08,600; credit side total ₹96,400.\nTotals Method entry: Debit column ₹1,08,600 · Credit column ₹96,400.\nBalance Method entry: Debit column ₹12,200 (the balance 1,08,600 − 96,400).\n\nThe Balance Method states the position of the Cash Account in one honest figure; the Totals Method only proves that the two sides were added correctly.",
          tip: "If a question asks you to prepare a Trial Balance by the Totals Method, remember that accounts showing equal totals on both sides contribute nothing to the disagreement — which is exactly why examiners prefer the Balance Method."
        },
        {
          h: "Locating the Difference — A Detective's Toolkit",
          p: "When the columns disagree, experienced accountants do not search the ledger at random. A few cheap tests narrow the hunt dramatically, and two of them — halving and the nines test — can point straight at the guilty entry.",
          list: [
            { term: "First, re-add both columns", def: "The commonest cause of a disagreement is a simple casting slip in the Trial Balance itself — nothing in the ledger is wrong at all" },
            { term: "Second, re-check the carry forwards", def: "A balance written correctly in a ledger but carried incorrectly into the Trial Balance produces a difference equal to that slip" },
            { term: "Halving the difference", def: "If the difference divided by 2 gives a familiar figure, look for that amount posted to the wrong side — replacing a credit with a debit (or vice versa) shifts the totals by twice the amount" },
            { term: "The nines test", def: "A difference divisible by 9 usually points to a transposition slip — writing ₹1,980 as ₹1,890, a gap of exactly ₹90 — or to a casting error in a column" },
            { term: "The tens test", def: "A difference divisible by 10 often means a wrong digit at the end — ₹450 entered as ₹400, or an amount posted with a naught dropped" },
            { term: "Finally, trace balances to source", def: "Compare a few suspicious balances with the ledger pages they came from — this catches wrong carry forwards and wrongly sided balances" }
          ],
          formula: "If difference ÷ 2 = a figure you recognise: an amount of that size sits on the wrong side.\n\nIf difference ÷ 9 = a whole number: suspect a transposition (digits swapped) or a casting slip.\n\nIf difference ÷ 10 = a whole number: suspect a dropped or added naught at the end.",
          example: "A difference of ₹360: halving gives ₹180 — search for an amount of ₹180 that was posted to the wrong side of its account. A difference of ₹90: nine divides it exactly — check for ₹1,980 written as ₹1,890, since 1,980 − 1,890 = ₹90, the classic digit swap that only the nines test reveals at a glance.",
          note: "These tests narrow the search; they do not replace the rectifying entry. Once the slip is found, it is corrected properly — and if the books had been force-agreed through a Suspense Account, the correction also clears that account."
        },
        {
          h: "Worked Example — One Balance on the Wrong Side",
          p: "A single balance posted to the wrong column is one of the most instructive slips, because of the peculiar way it distorts the difference. Work through this example before facing the exam.",
          example: "Balances: Capital ₹80,000 (Cr) · Creditors ₹15,000 (Cr) · Sales ₹90,000 (Cr) · Commission Received ₹3,000 (Cr) · Cash ₹25,000 (Dr) · Debtors ₹40,000 (Dr) · Purchases ₹55,000 (Dr) · Drawings ₹6,000 (Dr) · Rent ₹9,000 (Dr) · Furniture ₹53,000 (Dr).\n\nCorrect Trial Balance: Debit = 25,000 + 40,000 + 55,000 + 6,000 + 9,000 + 53,000 = ₹1,88,000. Credit = 80,000 + 15,000 + 90,000 + 3,000 = ₹1,88,000. It agrees.\n\nNow suppose Drawings of ₹6,000 is written in the CREDIT column by mistake. Debit total becomes ₹1,82,000 and credit total becomes ₹1,94,000 — a difference of ₹12,000, which is exactly TWICE the misplaced ₹6,000: the debit side lost the figure AND the credit side gained it.",
          formula: "Effect of posting a balance to the wrong column:\nDifference = 2 × the wrongly placed balance",
          note: "Whenever a difference turns out to be twice a familiar amount, do not hunt for a missing entry — hunt for a misplaced one. The money is in the books; only its column is wrong."
        },
        {
          h: "What the Trial Balance Cannot See — A Refresher Before Final Accounts",
          p: "The chapter's limitations section lists the errors that survive an agreeing Trial Balance. The practical value of that list lies in what it tells you to do next: agreement is the START of the checking, not the end of it.",
          list: [
            { term: "Complete omission", def: "Neither side was ever recorded, so neither column can complain — the missing transaction must be found by other checks, such as comparing with a bank statement or a counterparty's report" },
            { term: "Error of principle", def: "The right amount sits in the wrong CLASS of account — machinery charged to Purchases, for instance — and the totals stay equal while both profit and the Balance Sheet are wrong" },
            { term: "Compensating errors", def: "Two mistakes of the same size, on opposite sides, hold the totals steady while each individual account carries a wrong figure" },
            { term: "Wrong account, same class", def: "Debiting Ramesh instead of Suresh keeps the totals intact — only a careful checking of names reveals it" },
            { term: "What this means for final accounts", def: "Even a perfectly agreeing Trial Balance must be read with care: classification, naming and completeness are judged later, in the Trading Account, Profit and Loss Account and Balance Sheet" }
          ],
          real: "A shopkeeper who finds his khata totals matching the cash box does not stop checking bills — the total proves addition, not honesty of every entry. An agreeing Trial Balance deserves exactly that same measured trust.",
          tip: "A question that asks what an agreeing Trial Balance proves wants the phrase arithmetical accuracy — using the word accuracy alone, without arithmetical, usually costs the mark."
        }
      ],
      mistakes: [
        "Treating the Trial Balance as a statement of assets and liabilities — it is only a list of ledger balances, and its job is to check arithmetic, not to show the financial position.",
        "Expecting the Trial Balance to detect a complete omission, an error of principle or a compensating pair — all three leave the totals perfectly equal.",
        "Wondering why the difference is twice an amount after a balance was posted to the wrong column — a wrong-side posting shifts the totals by double that balance.",
        "Listing an account twice, or including one whose balance is nil — only accounts with a genuine closing balance appear, each exactly once.",
        "Mixing up similarly named accounts while filling the columns — Discount Allowed against Discount Received, Purchases against Purchase Returns, Interest on Capital against Interest on Drawings.",
        "Concluding that equal columns mean a safe profit figure — wrong classification hides comfortably inside equal totals, and only the final accounts expose it."
      ],
      summary: [
        "The Trial Balance is a statement, not an account — it lists every ledger balance as on a particular date.",
        "It is extracted after every ledger account has been balanced and before the final accounts are drawn.",
        "Three methods exist — totals, balance and list; Class 11 questions normally expect the Balance Method.",
        "Debit column: assets, expenses, losses and drawings. Credit column: liabilities, capital and incomes.",
        "Equal totals prove only arithmetical agreement — never freedom from errors of omission, principle or compensation.",
        "When the columns disagree, the short side is completed through a Suspense Account, which must close to nil once every one-sided error is rectified.",
        "The halving test finds wrong-side postings and the nines test finds digit swaps — cheap tricks that save hours of searching.",
        "The Trial Balance is the raw material of the Trading Account, Profit and Loss Account and Balance Sheet."
      ],
      check: [
        { q: "A Trial Balance agrees at ₹4,50,000 on both sides. Can the accountant now confirm that the books are entirely free of errors? Answer with reason.", a: "No. An agreeing Trial Balance proves only that equal debits and credits were recorded. A complete omission, an error of principle, a compensating pair or a wrong account of the same class can all hide inside equal totals. Only detailed checking of the accounts can find those." },
        { q: "True or false, with reason: a Trial Balance is prepared to find the profit of the business.", a: "False. The Trial Balance only brings together ledger balances to check arithmetical agreement. Profit is worked out later, in the Trading Account and the Profit and Loss Account." },
        { q: "Balances: Capital ₹50,000 (Cr), Sales ₹55,000 (Cr), Creditors ₹5,000 (Cr), Purchases ₹40,000 (Dr), Cash ₹25,000 (Dr), Debtors ₹35,000 (Dr), Furniture ₹10,000 (Dr). Does the Trial Balance agree, and what is the total of each column?", a: "Yes, it agrees. Debit column = 40,000 + 25,000 + 35,000 + 10,000 = ₹1,10,000. Credit column = 50,000 + 55,000 + 5,000 = ₹1,10,000. Both columns total ₹1,10,000." },
        { q: "Give one point of difference between the Totals Method and the Balance Method of extracting a Trial Balance.", a: "Under the Totals Method, each account contributes its debit-side total and credit-side total, so agreement is checked without ever isolating the balance. Under the Balance Method, each account is first balanced and only its single closing figure is listed — which is why it gives the figures that feed the final accounts." }
      ]
    }
    ,
    dep: {
      intro: [
        "A machine bought this year will still be in the godown a decade from now — but it will not be worth what it cost. Depreciation is the accounting answer to that quiet, continuous fall in value: the gradual and permanent decrease in the value of a fixed asset caused by use, the passage of time or obsolescence. Because the asset is used to earn revenue across many years, its cost must be spread across those years rather than dumped on the year of purchase — that is the Matching Concept at work, and it is why depreciation is charged even though no cash leaves the business when it is.",
        "The Class 11 syllabus gives you two methods of measuring the charge and two methods of recording it. The Straight Line Method spreads an equal amount over the asset's life, calculated on the original cost. The Written Down Value Method applies a fixed rate to the asset's shrinking book value, so the charge falls every year. Recording is either direct to the Asset Account — which then always shows book value — or through a Provision for Depreciation Account, which leaves the Asset Account at cost and accumulates the charges separately.",
        "This upgrade builds on that foundation in four ways. It walks a machine through three years of charges under both methods side by side, so the divergence is visible in real numbers. It opens a Provision for Depreciation Account and reads the running balances. It handles the trick the textbook examples usually skip — selling an asset in the middle of a year, with depreciation charged only to the date of sale. And it computes depletion and amortisation charges for wasting assets and intangible assets."
      ],
      objectives: [
        "Compute annual depreciation under SLM and WDV, for full years and for part years.",
        "Compare the yearly charge and the closing book value of the same asset under both methods.",
        "Maintain a Provision for Depreciation Account and read the book value from cost minus accumulated depreciation.",
        "Compute the profit or loss on disposal, including depreciation up to the exact date of sale.",
        "Present a depreciated asset correctly in the final accounts under both recording methods.",
        "Compute simple depletion and amortisation charges and state which asset types they apply to."
      ],
      blocks: [
        {
          h: "How Depreciation Reaches the Financial Statements",
          p: "Depreciation is not merely a calculation — it is an adjustment that touches both final accounts. The charge belongs to the year in which the asset was used, and the asset's value in the Balance Sheet must fall by the same amount. Two effects, two statements — the same discipline that governs every year-end adjustment.",
          list: [
            { term: "First effect", def: "The year's depreciation is DEBITED to the Profit and Loss Account as an expense of the period, reducing net profit even though no cash moves" },
            { term: "Second effect", def: "The asset appears in the Balance Sheet at its reduced value — cost minus the depreciation charged so far" },
            { term: "If depreciation is already in the Trial Balance", def: "The charge has already passed through the books, so only the Balance Sheet reduction is shown — showing the charge again would count it twice" },
            { term: "Which figure hits the Profit and Loss Account", def: "Only the charge for the CURRENT year — the accumulated depreciation of earlier years was debited to the Profit and Loss Accounts of those years, never again" }
          ],
          simple: "Think of the asset's value as a bag of rice being emptied a little every year. Each year's emptying is that year's expense; the bag's weight on the last day is what the Balance Sheet shows.",
          note: "In the Balance Sheet, a depreciated asset always appears NET of the depreciation charged so far — at original cost only in the first year, before any charge has been made."
        },
        {
          h: "Depreciation Across Three Years — SLM and WDV Side by Side",
          p: "Reading about the two methods is one thing; watching the same ₹60,000 machine depreciate under both is another. This comparison, run on identical figures, shows exactly where and by how much the two methods diverge.",
          example: "A machine costing ₹60,000 is depreciated at 20% p.a. with no residual value.\n\nStraight Line Method: 60,000 × 20/100 = ₹12,000 every year.\nYear 1: charge ₹12,000, book value ₹48,000\nYear 2: charge ₹12,000, book value ₹36,000\nYear 3: charge ₹12,000, book value ₹24,000\n\nWritten Down Value Method: rate stays 20%, base shrinks.\nYear 1: charge ₹12,000 (60,000 × 20%), book value ₹48,000\nYear 2: charge ₹9,600 (48,000 × 20%), book value ₹38,400\nYear 3: charge ₹7,680 (38,400 × 20%), book value ₹30,720\n\nAfter three years: total charge ₹36,000 under SLM against ₹29,280 under WDV (12,000 + 9,600 + 7,680); book value ₹24,000 under SLM against ₹30,720 under WDV.",
          list: [
            { term: "What the table proves", def: "WDV front-loads the charge — the first year is identical under both methods, and every year after that the WDV charge is lighter and the book value higher" },
            { term: "Where the difference ends up", def: "The gap between the two book values (₹30,720 − ₹24,000 = ₹6,720) is exactly the depreciation SLM took in the extra years that WDV deferred" }
          ],
          tip: "In an exam, write the book value in a column beside each year's charge before answering any later-year question — ten seconds of column work prevents the commonest cumulative slip."
        },
        {
          h: "Worked Example — Selling an Asset Mid-Year",
          p: "Textbook disposal examples usually sell assets at a clean year end. Real questions often sell them in the middle — and the first step is always to bring the depreciation up to the date of sale, so that the book value compared with the sale proceeds is the book value OF THAT DAY.",
          example: "A machine was bought on 1st April for ₹50,000 and depreciated at 10% p.a. under SLM. It is sold on 1st October for ₹43,000.\n\nStep 1 — Depreciation up to the date of sale: 1st April to 1st October is 6 months, so 50,000 × 10/100 × 6/12 = ₹2,500.\nStep 2 — Book value on the date of sale: 50,000 − 2,500 = ₹47,500.\nStep 3 — Compare with proceeds: 43,000 against 47,500 → a LOSS of ₹4,500 on the sale.",
          list: [
            { term: "Why only six months", def: "Depreciation is charged for the period the asset was actually held — half a year of use earns half a year of charge" },
            { term: "Never compare with cost", def: "Profit or loss on sale is always measured against the book value on the date of sale, never against the original cost of ₹50,000" }
          ],
          note: "If the machine had instead been sold on 30th September, the same six months would be counted. Count the months the asset was actually held, from the first day of ownership to the day before sale."
        },
        {
          h: "Depletion and Amortisation — Computing the Charge",
          p: "The idea behind depreciation — spreading cost over useful life — travels far beyond machinery. For natural resources the charge is called depletion, and it is measured by usage rather than by time. For intangible assets it is called amortisation, and it simply divides the cost over the legal or useful life.",
          formula: "Depletion for the year = Cost of the wasting asset × Quantity extracted during the year ÷ Total estimated quantity\n\nAmortisation per year = Cost of the intangible asset ÷ Useful or legal life",
          example: "A coal mine was purchased for ₹2,00,000, with total estimated coal of 1,00,000 tonnes. During the year 12,000 tonnes were extracted.\nDepletion = 2,00,000 × 12,000 ÷ 1,00,000 = ₹24,000.\n\nA patent costing ₹80,000 with a legal life of 8 years:\nAmortisation = 80,000 ÷ 8 = ₹10,000 per year.",
          list: [
            { term: "Depletion follows QUANTITY", def: "The more tonnes extracted, the larger the charge — time alone does not reduce a mine's value" },
            { term: "Amortisation follows TIME", def: "A patent loses value as its years run out, whether or not it is exploited — the charge is a straight yearly division" },
            { term: "The common thread", def: "All three — depreciation, depletion, amortisation — spread the cost of an asset over the benefit it gives; only the asset type and the measuring stick differ" }
          ],
          real: "A farmer measures the wear of a tractor in hours of use, the exhaustion of his well in litres drawn, and the expiry of his seed licence in months. Accountancy simply names the three: depreciation, depletion and amortisation.",
          note: "Land is not depreciated — it is treated as having no limited useful life — but a wasting asset like a mine or quarry held on land is depleted."
        }
      ],
      advBlocks: [
        {
          h: "Provision for Depreciation A/c — Running Balances Over Three Years",
          p: "When depreciation is accumulated in a Provision for Depreciation Account instead of being credited to the Asset Account, the Machinery Account stays frozen at cost while the provision grows year after year. Opening the account and watching it run makes the mechanics unmistakable.",
          formula: "Each year:  Depreciation A/c Dr.  To Provision for Depreciation A/c\nThen:        Profit and Loss A/c Dr.  To Depreciation A/c\n\nBook value at any date = Balance of Machinery A/c (at cost) − Balance of Provision for Depreciation A/c",
          example: "Machinery costing ₹50,000, depreciated at 10% p.a. under SLM, with a Provision for Depreciation A/c maintained.\n\nEnd of Year 1: charge ₹5,000 → provision balance ₹5,000; book value 50,000 − 5,000 = ₹45,000\nEnd of Year 2: charge ₹5,000 → provision balance ₹10,000; book value 50,000 − 10,000 = ₹40,000\nEnd of Year 3: charge ₹5,000 → provision balance ₹15,000; book value 50,000 − 15,000 = ₹35,000\n\nThe Machinery A/c itself still shows ₹50,000 throughout — every year's story is told by the growing provision balance.",
          list: [
            { term: "Advantage of this method", def: "The original cost of every asset remains visible in the Asset Account for as long as the asset is held — useful when assets are bought and sold at different times" },
            { term: "On disposal", def: "Both the cost (from the Asset Account) and the accumulated depreciation (from the Provision Account) are transferred out, and the book value is compared with the sale proceeds" }
          ],
          note: "Accumulated depreciation is the TOTAL of all years' charges so far — never the charge of the current year alone."
        },
        {
          h: "Combined Worked Example — Purchase in July, Sale in the Second Year",
          p: "Put every skill together: a part-year charge in the year of purchase, a full or part charge in the next year, depreciation up to the date of sale, and then the profit or loss. Read the dates carefully at every step.",
          example: "A machine was bought on 1st July for ₹1,00,000 and depreciated at 10% p.a. under SLM with a Provision for Depreciation A/c. It was sold on 30th September of the next year for ₹90,000. The accounting year ends 31st March.\n\nYear 1 (1st July to 31st March = 9 months): 1,00,000 × 10/100 × 9/12 = ₹7,500.\nYear 2 (1st April to 30th September = 6 months): 1,00,000 × 10/100 × 6/12 = ₹5,000.\nAccumulated depreciation on the date of sale = 7,500 + 5,000 = ₹12,500.\nBook value = 1,00,000 − 12,500 = ₹87,500.\nSale proceeds ₹90,000 exceed book value ₹87,500 → PROFIT of ₹2,500 on the sale.",
          list: [
            { term: "The profit entry, in outline", def: "The Asset Disposal A/c receives the cost ₹1,00,000 (from Machinery), the accumulated depreciation ₹12,500 (from the Provision) and the proceeds ₹90,000; its credit side then exceeds its debit side by ₹2,500, which is transferred to Profit on Sale of Machinery A/c" }
          ],
          tip: "Write the months on a small timeline before multiplying — 9 months and 6 months, not 10 and 7 — is where most of these marks are quietly lost."
        },
        {
          h: "Choosing Between SLM and WDV — Signals in the Question",
          p: "Before writing a single figure, decide which method the question wants. The language of the question gives itself away, and picking wrongly turns an easy sum into a wrong one.",
          list: [
            { term: "SLM signals", def: "'Fixed amount every year', 'equal annual charge', a useful life stated in years with a residual value, ' depreciated by ₹X p.a.', or a request to write the asset down to zero" },
            { term: "WDV signals", def: "'Fixed rate p.a. on the book value', 'diminishing balance', 'reducing balance', or a question asking for the book value after several years at the same rate" },
            { term: "Both methods, same rate, first year", def: "In the first year alone, SLM and WDV at the same rate produce the same charge — since the book value still equals cost. The divergence begins only in Year 2" },
            { term: "Income tax angle", def: "Questions often remind you that WDV is the method prescribed under the Income Tax Act for computing depreciation — a favourite one-mark fact" }
          ],
          confusion: {
            a: "Straight Line Method",
            aText: "A fixed AMOUNT every year, calculated on the original cost.",
            b: "Written Down Value Method",
            bText: "A fixed RATE every year, applied to the shrinking book value.",
            diff: "SLM's charge never changes, so its book value falls in equal steps and can reach the residual value. WDV's charge falls every year because the rate runs on a smaller balance, so the book value never becomes exactly zero — and the total charged over the life is always less than under SLM at the same rate."
          },
          note: "The rate under WDV is applied to the book value at the START of the year, never to the original cost — the single rule that separates correct WDV workings from wrong ones."
        }
      ],
      mistakes: [
        "Applying the WDV rate to the original cost every year instead of to the opening book value of each year.",
        "Reducing the machinery twice in the Balance Sheet — once by writing depreciation off the asset account and once more by deducting a provision, when only one method is in force.",
        "Charging a full year's depreciation on an asset bought in July or sold in November — part-year charges are the rule whenever the asset was held for less than twelve months.",
        "Comparing sale proceeds with the original cost instead of the book value on the date of sale when computing profit or loss.",
        "Recording the annual charge as Depreciation A/c Dr. To Provision for Depreciation A/c under the direct method, or crediting the Asset Account when a provision method is being followed.",
        "Forgetting the second entry that closes the Depreciation A/c by transferring it to the Profit and Loss Account — the charge is not complete until it reaches profit."
      ],
      summary: [
        "Depreciation is the gradual, permanent, non-cash fall in the value of a fixed asset, charged as an expense against profit every year it is used.",
        "SLM charges an equal amount on the original cost; WDV charges a fixed rate on a shrinking book value.",
        "Book value = cost minus accumulated depreciation, always — under either method.",
        "An asset held for part of a year earns only a part-year charge: annual depreciation multiplied by months used divided by 12.",
        "Depreciation is recorded either directly against the Asset Account or through a Provision for Depreciation Account that leaves the asset at cost.",
        "On disposal, remove the cost and the accumulated depreciation, then compare the book value with the sale proceeds to find profit or loss.",
        "Depletion charges wasting assets by quantity extracted; amortisation spreads the cost of intangible assets over their legal life.",
        "In the final accounts, depreciation debits the Profit and Loss Account and reduces the asset in the Balance Sheet — two effects of one charge."
      ],
      check: [
        { q: "State the two journal entries needed at year end when depreciation is charged through a Provision for Depreciation Account.", a: "First, Depreciation A/c Dr.; To Provision for Depreciation A/c — being the charge for the year, leaving the Machinery A/c at cost. Second, Profit and Loss A/c Dr.; To Depreciation A/c — closing the charge into profit for the year." },
        { q: "True or false, with reason: under WDV at a fixed rate, the book value of an asset can become exactly zero at the end of its useful life.", a: "False. Under WDV the charge is always a percentage of a shrinking balance, so the balance keeps reducing but never becomes exactly zero. It is SLM that can write an asset down to zero, or exactly to its residual value." },
        { q: "A machine costing ₹90,000 was bought on 1st October; the year ends 31st March; depreciation is charged at 20% p.a. under SLM with no residual value. What depreciation is charged in the first year?", a: "Full-year depreciation = 90,000 × 20/100 = ₹18,000. The machine was used for 6 months (October to March), so the charge is 18,000 × 6/12 = ₹9,000." },
        { q: "A machine with a book value of ₹35,000 is sold for ₹40,000. What is the accounting result of the sale?", a: "Sale proceeds exceed the book value by ₹5,000, so there is a profit of ₹5,000 on the sale. Because it arose from selling a fixed asset rather than from trading, it is a capital profit." }
      ]
    }
    ,
    pres: {
      intro: [
        "A business that pays every bill as it falls due and still wants to sleep well at year end does two distinct things. It sets aside money for liabilities it already knows are coming, even though the exact figure or date is uncertain — that is a provision, and it is a genuine liability of the business. And it keeps back part of its own profit, untouched by the owner's withdrawals, purely to strengthen the business against the future — that is a reserve, which belongs to the owner and owes nobody anything.",
        "The distinction runs through every accountancy examination on this chapter, and it is not merely definitional. A provision is a charge against profit — debited before net profit is even arrived at, compulsory once the obligation exists. A reserve is an appropriation of profit already worked out — voluntary, created only when the business has profit to spare. Beyond the basic split, reserves are further classified by source (revenue or capital) and by restriction on use (general, specific, contingency or secret), and provisions are adjusted year after year as better estimates emerge.",
        "This upgrade adds four layers to the chapter. It explains the prudence concept that makes provisions compulsory in the first place, and separates a charge against profit from an appropriation of profit with a fully worked profit split. It shows how an existing provision is adjusted — charging only the increase, or releasing the excess when the requirement falls. And it settles a persistent confusion by proving why accumulated depreciation in a Provision for Depreciation Account is a provision, not a reserve."
      ],
      objectives: [
        "Explain why provisions are created and link their creation to the prudence concept.",
        "Distinguish a charge against profit from an appropriation of profit with a worked example.",
        "Classify reserves by source (revenue or capital) and by restriction on use (general, specific, contingency, secret).",
        "Adjust an existing provision by charging only the increase, or releasing the excess when the requirement falls.",
        "Explain why accumulated depreciation is a provision-like contra asset and not a reserve.",
        "Show provisions and reserves correctly in the final accounts."
      ],
      blocks: [
        {
          h: "Why Provisions Are Created — The Prudence Concept",
          p: "Provisions are not optional bookkeeping; they are demanded by a deep-seated rule of accounting judgement. Accountants follow the maxim that all probable losses should be provided against, while no profit should be anticipated. A loss the business can already see coming — a bill for services taken, debts that may turn bad, repairs that are due — must be charged to the year in which the trouble arose, even before the exact figure is known.",
          list: [
            { term: "The maxim", def: "Provide against all probable losses; anticipate no profit. Gains enter the books only when they are actually earned — losses the moment they become probable" },
            { term: "Why the amount is estimated", def: "The liability exists in substance now, but its final bill or its exact fallout is uncertain — so the best honest estimate is provided, and refined each year" },
            { term: "Why it is charged to profit", def: "The obligation belongs to this year's business, so this year's profit must bear it — that is the Matching Concept doing its work" },
            { term: "What happens when the estimate improves", def: "The provision is adjusted — increased with a fresh charge to profit, or reduced with the excess released back to profit" }
          ],
          simple: "A provision is the accountant's way of saying: this will cost us something, we do not know exactly how much yet, but this year's profit is going to carry it.",
          real: "A family that sets money aside for a hospital bill the doctor has only warned them about is following prudence — the expense belongs to this year's budget even though the final bill has not arrived.",
          note: "A provision is created because the liability already exists in substance. What is uncertain is only the amount or the timing — never the existence of the obligation itself."
        },
        {
          h: "Charge Against Profit vs Appropriation of Profit",
          p: "These two phrases decide the position of every item in the final accounts, and examiners love them. A charge against profit is deducted BEFORE net profit is computed; an appropriation divides profit that has ALREADY been computed. A provision is always a charge; a reserve is always an appropriation.",
          list: [
            { term: "Charge against profit", def: "Debited to the Profit and Loss Account as part of the year's expenses — it reduces net profit itself. Provision for doubtful debts, provision for repairs, depreciation" },
            { term: "Appropriation of profit", def: "Debited only after net profit is worked out — it divides the profit rather than reducing it. Transfers to General Reserve, the owner's drawings" },
            { term: "Order of appearance", def: "Charges come first, inside the Profit and Loss Account; appropriations come after, dividing what is left among the owner and the reserves" },
            { term: "Compulsion", def: "A charge is compulsory once the obligation exists. An appropriation is a decision — made only when there is profit to appropriate" }
          ],
          example: "A firm earns a net figure of ₹3,00,000 before considering a known repairs liability of ₹24,000, and then decides to transfer ₹50,000 to General Reserve.\n\nStep 1 — Charge the provision: 3,00,000 − 24,000 = ₹2,76,000 (profit after the charge).\nStep 2 — Appropriate the reserve: 2,76,000 − 50,000 = ₹2,26,000 carried to the owner's capital.\nThe ₹24,000 reduced the profit itself; the ₹50,000 merely divided the profit that survived it.",
          note: "Both entries read Profit and Loss A/c Dr. — but at different stages. The provision's debit happens while profit is being found; the reserve's debit happens after profit is found, dividing it."
        },
        {
          h: "Contingency Reserve — The Reserve for the Unforeseen",
          p: "Reserves are also classified by how far ahead the business can see. A general reserve answers any purpose; a specific reserve answers one fixed purpose only; and a contingency reserve answers a question nobody can quite phrase — the unforeseen expense, the unexpected loss, the sudden opportunity.",
          list: [
            { term: "Contingency reserve", def: "Created out of revenue profit to meet unforeseen expenses or losses that cannot be predicted precisely — a reserve of pure caution rather than of plan" },
            { term: "How it differs from a provision", def: "A provision answers a KNOWN liability of uncertain amount; a contingency reserve answers an UNCERTAIN future event of uncertain amount. The provision is compulsory, the reserve is a choice" },
            { term: "Specific reserves beside it", def: "A Dividend Equalisation Reserve is fixed for steady dividends; a Reserve for Redemption of Debentures is fixed for one repayment. Neither may be diverted to another use" },
            { term: "Source test still applies", def: "A contingency reserve built from trading profit is a revenue reserve and sits on the same side of the line as the General Reserve — flexible, but held back deliberately" }
          ],
          example: "A firm with a net profit of ₹4,00,000 transfers ₹60,000 to Contingency Reserve for unforeseen expenses and ₹1,00,000 to Reserve for Redemption of Debentures. The ₹60,000 may be used when a genuinely unforeseen loss lands; the ₹1,00,000 may be used for nothing except the debenture redemption.",
          tip: "A short note on types of reserves earns its marks with one line of meaning and one named example each — general, specific, contingency, secret — nothing more is needed."
        },
        {
          h: "Accumulated Depreciation Is Not a Reserve",
          p: "Few confusions in this unit are as persistent as the belief that the Provision for Depreciation Account is a reserve. It sits in the credit column of the Trial Balance, it grows year after year, it never seems to be paid to anyone — so students call it a reserve. It is not.",
          confusion: {
            a: "Provision for Depreciation (Accumulated Depreciation)",
            aText: "A provision account that accumulates the yearly depreciation charge against an asset's value.",
            b: "Reserve",
            bText: "An amount of profit deliberately kept aside by management for strength or a future purpose.",
            diff: "The provision arises compulsorily the moment the asset is used — management has no choice about creating it, it is a contra reduction against an asset rather than owners funds held back, and it is never divisible as dividend. A reserve arises only from profit, only by decision, and (if revenue) may be distributed. Accumulated depreciation fails every test of a reserve and passes every test of a provision."
          },
          list: [
            { term: "Compulsion test", def: "Depreciation must be charged on a used asset; management cannot vote not to. Reserves are created only by a decision of management" },
            { term: "Purpose test", def: "The provision tracks the falling value of a specific asset. A reserve strengthens the overall financial position" },
            { term: "Dividend test", def: "A reserve (revenue) may be distributed as dividend; nobody ever distributes accumulated depreciation" },
            { term: "Where it stands", def: "Accumulated depreciation is deducted from the related asset in the Balance Sheet — provisions against assets are shown there, not among the owners funds" }
          ],
          note: "A provision AGAINST an asset — doubtful debts, depreciation — is deducted from that asset. A provision FOR a service still to be performed — repairs, legal charges — appears as a liability. A reserve always appears among owners funds."
        }
      ],
      advBlocks: [
        {
          h: "Adjusting an Existing Provision — Charge the Increase, Release the Fall",
          p: "When a provision already sits in the Trial Balance as a credit balance, this year's Profit and Loss Account must NOT be charged with the new requirement all over again. The old figure was charged in earlier years; only the movement in the provision belongs to this year.",
          formula: "Required provision exceeds existing one:\nCharge to Profit and Loss A/c = New required provision − Existing provision\n\nRequired provision below existing one:\nRelease to profit (credit) = Existing provision − New required provision",
          example: "Year 1: the Trial Balance shows Provision for Doubtful Debts (Cr) ₹4,000; the review requires ₹9,000.\nCharge this year = 9,000 − 4,000 = ₹5,000 to the Profit and Loss Account. The Balance Sheet deducts the full ₹9,000 from Debtors.\n\nYear 2: the opening provision is now ₹9,000, and the review requires only ₹7,000 — some doubtful debtors paid up.\nRelease = 9,000 − 7,000 = ₹2,000 credited back to profit. The Balance Sheet deducts the new ₹7,000 from Debtors.",
          list: [
            { term: "Why only the increase", def: "The existing credit balance already reduced profit in earlier years; charging it again would count the same loss twice" },
            { term: "Why a fall is released", def: "The provision is an estimate, not a debt. When the estimate shrinks, the excess is no longer needed and returns to this year's profit as a credit" },
            { term: "The Balance Sheet figure", def: "Whatever the movement in the Profit and Loss Account, the ASSET is always shown net of the full CURRENT required provision — not of last year's figure" }
          ],
          tip: "Underline whether the given provision is inside or outside the Trial Balance before charging anything — that one circle decides whether you write the full figure or only the difference."
        },
        {
          h: "Reserve Fund — What Really Changes When a Reserve Is Invested",
          p: "A reserve that exists only as an entry has its money still mixed with the business's operating funds. The moment it is invested outside the business, it becomes a reserve fund — a real, separate pot that earns its own income and guards its own purpose.",
          example: "Meena Traders transfers ₹2,00,000 to General Reserve and then invests the amount in 8% government securities.\n\nTransfer: Profit and Loss A/c Dr. ₹2,00,000; To General Reserve A/c ₹2,00,000.\nInvestment: Reserve Fund A/c Dr. ₹2,00,000; To Bank A/c ₹2,00,000 (in the simplified Class 11 treatment).\nEffect on the Balance Sheet total: NIL — one asset (cash at bank) simply changes into another (investments); the reserve still stands at ₹2,00,000 among owners funds.\nInterest for the year: 2,00,000 × 8/100 = ₹16,000, credited to the Profit and Loss Account as an income of the year.",
          list: [
            { term: "What changed", def: "The money left daily operations, so the fund now has its own identity and cannot be casually spent on day-to-day needs" },
            { term: "What did not change", def: "The total of the Balance Sheet, and the classification of the reserve — it remains owners funds, never a liability" },
            { term: "The extra reward", def: "Once invested, the fund earns its own income — interest, which enters the Profit and Loss Account credit side like any other income" }
          ],
          note: "A reserve is an intention recorded in books; a reserve fund is that same intention carried out in cash. The accounting world treats the second as far more credible."
        },
        {
          h: "Worked Example — One Profit, Four Different Labels",
          p: "Examination questions rarely announce what something is — they describe a situation and wait. Here are four year-end items of ₹8,000, ₹40,000, ₹15,000 and a hidden cushion, each with a completely different destiny.",
          example: "At the year end of a firm:\n\n(a) A delivery van with a book value of ₹20,000 is sold for ₹28,000 → the ₹8,000 gain is a capital profit (not from trading) → transferred to Capital Reserve, not divisible as dividend.\n(b) The year's trading produces a surplus of ₹40,000 → revenue profit → a part of it may be transferred to General Reserve, fully divisible as dividend.\n(c) A lawyer's bill for services already taken is expected around ₹15,000, final figure pending → a known liability of uncertain amount → Provision for Legal Charges, debited to the Profit and Loss Account and shown on the liabilities side.\n(d) Furniture is depreciated at 40% p.a. when 15% would be proper → profit understated every year, a hidden cushion built up → a secret reserve, which AS-1's full-disclosure requirement disapproves.",
          list: [
            { term: "The one-line tests", def: "Profit outside normal trade → capital reserve. Profit kept back from trading → revenue reserve. Known liability of uncertain amount → provision. Deliberately concealed profit → secret reserve" },
            { term: "The trap in (a)", def: "Sold ABOVE book value means capital PROFIT. Sold below book value gives a capital LOSS — and a loss never creates any kind of reserve" }
          ],
          real: "Four envelopes of money on the same desk: one came from selling the family car above its worth, one from the shop's earnings, one owed to a lawyer, and one deliberately unlabelled. Each envelope demands different treatment — so does each figure."
        }
      ],
      mistakes: [
        "Charging the full new provision to the Profit and Loss Account when an older provision already sits in the Trial Balance — only the increase belongs to this year.",
        "Showing a Provision for Doubtful Debts on the liabilities side instead of deducting it from Debtors — it is a provision against an asset, not an obligation to an outsider.",
        "Believing a Capital Reserve can be distributed as dividend — only revenue reserves, built from trading profit, are divisible.",
        "Creating a reserve in a loss year — reserves are appropriations of profit, and a business with no profit has nothing to appropriate.",
        "Calling accumulated depreciation a reserve — it is a provision created compulsorily by the fall in an asset's value, never at management's discretion.",
        "Assuming every reserve has been invested — a plain reserve is only a book entry; it becomes a reserve fund only when invested outside the business."
      ],
      summary: [
        "A provision meets a known liability of uncertain amount or timing; it IS a liability and is compulsory once the obligation exists.",
        "A reserve is profit kept aside to strengthen the business; it is NOT a liability and is created only at management's discretion.",
        "Provisions are charges against profit, deducted before net profit arrives; reserves are appropriations of profit already worked out.",
        "Revenue reserves come from trading profit and are divisible as dividend; capital reserves come from capital profit and are not.",
        "General reserves are unrestricted, specific reserves are tied to one purpose, contingency reserves face the unforeseen, and secret reserves are hidden — and disapproved by AS-1.",
        "A reserve invested outside the business becomes a reserve fund, earning its own income and keeping its own identity.",
        "When an existing provision sits in the Trial Balance, only the increase is charged; when the requirement falls, the excess is released back to profit.",
        "Accumulated depreciation is a provision-like reduction against an asset — never a reserve created at management's choice."
      ],
      check: [
        { q: "Give two points of difference between a provision and a reserve.", a: "First, nature: a provision IS a liability of the business, while a reserve is not a liability — it is part of the owners funds. Second, creation: a provision is compulsory once the liability exists, while a reserve is created only at the discretion of management, out of profit." },
        { q: "True or false, with reason: a capital reserve can be created out of the profit on the sale of goods.", a: "False. Profit on the sale of goods is revenue profit earned in the normal course of trade. A capital reserve arises only from capital profit — profit outside normal trade, such as profit on the sale of a fixed asset above its book value or premium on the issue of shares." },
        { q: "The Trial Balance shows Provision for Doubtful Debts (Cr) ₹8,000, and the year-end review requires a provision of ₹10,500. How much is charged to the Profit and Loss A/c, and what figure for Debtors of ₹70,000 appears in the Balance Sheet?", a: "Only the increase is charged: 10,500 − 8,000 = ₹2,500 to the Profit and Loss A/c. Debtors are shown net of the FULL required provision: 70,000 − 10,500 = ₹59,500." },
        { q: "Why is Provision for Repairs shown on the liabilities side, while Provision for Doubtful Debts is deducted from Debtors?", a: "Provision for Repairs is a provision for a service still to be performed — an obligation the business owes, so it stands on the liabilities side. Provision for Doubtful Debts is a provision AGAINST an asset — it reduces the value at which Debtors are shown and creates no obligation to anybody." }
      ]
    }
    ,
    roe: {
      intro: [
        "Nobody writes perfect books. A figure is posted to the wrong side, an amount is copied as ₹6,300 instead of ₹3,600, a whole transaction slips out of the Journal, or a machinery bill quietly lands in Purchases. Rectification of Errors is the craft of finding those mistakes and correcting them through proper entries — so that the profit figure and the financial position finally tell the truth. The corrections are passed in the Journal Proper, and they are best made before the final accounts are drawn.",
        "Everything in this chapter turns on one sorting question: does the error disturb the equality of the Trial Balance, or does it hide inside equal totals? Two-sided errors — complete omissions, errors of principle, compensating pairs, wrong accounts of the same class — leave the totals equal. One-sided errors — wrong amounts, wrong sides, partial omissions, casting slips — break them. When the Trial Balance disagrees, the unexplained difference is parked in a Suspense Account, corrected against as each error surfaces, and the account must close to nil when the hunt is complete.",
        "This upgrade adds what working students need most. It draws the line between an innocent error and a deliberate fraud — a distinction the definitions alone never settle. It traces how each type of error distorts the final accounts, so rectification stops feeling abstract. It opens a Suspense Account in full and closes it with balanced entries. And it hands you the two cheap hunting tests — halving and the nines test — plus a translator that converts question wording straight into rectifying entries."
      ],
      objectives: [
        "Classify any given error as an omission, commission, principle or compensating error.",
        "Decide whether a described error affects the agreement of the Trial Balance.",
        "Frame correct rectifying entries for two-sided errors without using a Suspense Account.",
        "Rectify one-sided errors through a Suspense Account and close it to a nil balance.",
        "Distinguish an unintentional error from a deliberate fraud.",
        "Predict how each type of error distorts the Trading Account, Profit and Loss Account and Balance Sheet."
      ],
      blocks: [
        {
          h: "Error vs Fraud — The Line That Changes Everything",
          p: "Every error is a mistake; not every mistake is an error. Rectification assumes good faith — the books went wrong by accident and a correcting entry sets them right. Fraud is deliberate: the figures were bent on purpose, and no journal entry repairs what was intended.",
          confusion: {
            a: "Error",
            aText: "An unintentional mistake in recording, posting, totalling or classifying — the accountant meant well and got it wrong.",
            b: "Fraud",
            bText: "A deliberate act — falsifying figures, suppressing receipts, misappropriating cash, or maintaining fake accounts to deceive.",
            diff: "An error is accidental and is fully corrected by a rectifying entry; a fraud is intentional and calls for investigation, recovery of what was taken and, where warranted, legal action. Both may sit inside an agreeing Trial Balance — which is precisely why agreement proves honesty no more than it proves arithmetic."
          },
          list: [
            { term: "Typical errors", def: "Wrong amount copied, wrong side posted, transaction left out, wrong class of account used, two slips cancelling each other — all careless, none criminal" },
            { term: "Typical frauds", def: "A receipt never entered, a creditor's payment shown but not made, closing stock manipulated, a creditor's account inflated with fake entries" },
            { term: "The shared disguise", def: "A simple omission looks identical in the Trial Balance whether it happened by accident or by design — agreement of totals detects neither" },
            { term: "What the exam expects", def: "Rectification questions assume errors. If a question says the cashier concealed receipts, treat it as a fraud discussion — identify it, do not just pass an entry" }
          ],
          simple: "An error is a slip; a fraud is a shove. The correcting entry fixes slips — shoves need explaining first.",
          note: "Rectification repairs the books, not the fact. After a fraud is corrected in the accounts, the recovery of the money and the action against the person are separate matters entirely."
        },
        {
          h: "How Each Error Distorts the Final Accounts",
          p: "Rectification feels abstract until you see what each error does to the statements a business actually lives by. Every error damages either the profit figure, or the financial position, or — most dangerously — both, while the Trial Balance happily agrees.",
          list: [
            { term: "Credit sale omitted completely", def: "Sales understated and Debtors understated — profit falls short and the Balance Sheet hides money owed to the business, all inside equal totals" },
            { term: "Machinery debited to Purchases", def: "Purchases overstated, so profit understated; assets understated by the same amount — both statements wrong, Trial Balance still agreeing" },
            { term: "Sale posted to the wrong debtor", def: "Totals are untouched, but the Balance Sheet shows the wrong person owing the money — the right debtor looks smaller than he is" },
            { term: "Rent or wages account overcast", def: "Expenses overstated, profit understated; the asset or liability sides stay honest — the damage lands squarely on the profit figure" },
            { term: "Partial omission — one side unposted", def: "One ledger account is understated, the Trial Balance disagrees, and the final accounts cannot be completed until the difference is resolved" },
            { term: "Compensating pair", def: "Each affected account carries its own wrong balance, so the statements built from them are wrong — even though every total was right" }
          ],
          real: "A pilot's instruments can show a balanced fuel reading while one gauge is faulty. Rectification is the pre-flight check that reads every gauge instead of trusting the overall panel.",
          tip: "In a discuss-the-effect question, name BOTH statements — profit effect and Balance Sheet effect. Mentioning only the Trial Balance earns half the available marks."
        },
        {
          h: "The Journal Proper — Home of Every Rectification",
          p: "Rectifying entries do not belong in the Cash Book or any subsidiary book — they belong to the Journal Proper, the book reserved for entries that fit nowhere else. This is where the correcting entries are passed, each with a narration that says plainly what error it repairs.",
          list: [
            { term: "What else lives in the Journal Proper", def: "The opening entry of the new year, entries for credit purchases and returns not recorded in subsidiary books, adjustment entries, and the closing entries transferring final results" },
            { term: "How a rectification is narrated", def: "A clear narration — being entry passed to rectify the overcast of Wages A/c, or being credit sale to Kiran wrongly posted to her account — so the correction can be traced later" },
            { term: "When it is passed", def: "Before the final accounts are prepared whenever possible; if the error surfaces later, the correction goes through the opening capital or prior-period route instead of this year's fresh charges" },
            { term: "The entry itself", def: "Cancel the wrong effect, apply the right effect — and if only one account needs correcting, the other side of the entry must be the Suspense Account" }
          ],
          note: "All rectifying entries go into the Journal Proper — no rectification is ever made by scratching out a figure in the ledger and writing a new one beside it."
        }
      ],
      advBlocks: [
        {
          h: "Worked Example — A Suspense A/c That Opens, Works and Closes",
          p: "Here is the complete life story of a Suspense Account, from the moment the difference is parked to the moment it closes to nil. Every figure ties back to the original difference — that tie-back is the whole discipline.",
          example: "A Trial Balance shows a debit total of ₹84,500 and a credit total of ₹81,700. The debit side is heavier by ₹2,800, so the credit side is completed by CREDITING the Suspense Account with ₹2,800.\n\nInvestigation reveals two one-sided errors:\n(a) An account overcast by ₹1,900 — rectify: Suspense A/c Dr. ₹1,900; To that account ₹1,900 (removes the excess debit).\n(b) A credit of ₹900 that was never posted — rectify: Suspense A/c Dr. ₹900; To that account ₹900 (records the missing credit side).\n\nSuspense A/c:  Cr side ₹2,800 (opening park) against Dr side 1,900 + 900 = ₹2,800 — balance NIL.\nBoth ledger accounts now show their true figures, and the difference has been fully explained.",
          formula: "Total of all rectifying entries against Suspense = the original Trial Balance difference, exactly\n\nLeftover Suspense balance = at least one one-sided error still unlocated",
          note: "A nil balance in the Suspense Account is not luck — it is proof that every rupee of the original difference has been explained and corrected."
        },
        {
          h: "Hunting a One-Sided Error — The Two and Nine Tests",
          p: "Before opening the ledger page by page, run two arithmetic tests on the difference itself. They take ten seconds and frequently point straight at the guilty entry.",
          formula: "Difference ÷ 2 → if the answer is a figure you recognise, that amount sits on the WRONG SIDE\n\nDifference ÷ 9 → if it divides exactly, suspect a transposition (digits swapped) or a casting slip\n\nDifference ÷ 10 → if it divides exactly, suspect a dropped or added naught",
          list: [
            { term: "Why halving works", def: "Posting ₹1,800 to the credit side instead of the debit side removes it from debits AND adds it to credits — a shift of twice the amount. A ₹360 difference therefore points to a ₹180 figure on the wrong side" },
            { term: "Why nines work", def: "Swapping digits always changes the total by a multiple of nine — ₹1,980 written as ₹1,890 differs by exactly ₹90, and 90 divides by 9" },
            { term: "Cheap checks before the tests", def: "Re-add both Trial Balance columns (the commonest cause of all), then re-check each balance against its ledger page for a wrong carry forward" },
            { term: "What the tests never replace", def: "The rectifying entry itself — locating the slip finds it; only the entry corrects it and clears the Suspense Account" }
          ],
          example: "A difference of ₹360: 360 ÷ 2 = ₹180 — hunt for an amount of ₹180 posted to the wrong side. A difference of ₹90: 90 ÷ 9 = 10 — hunt for a digit swap such as ₹1,980 entered as ₹1,890, since 1,980 − 1,890 = ₹90.",
          tip: "Write the division on the answer sheet before hunting — examiners award method marks for the test even when you never name the final culprit."
        },
        {
          h: "Translating the Question — From Wording to Entry",
          p: "Rectification questions are written in a small set of standard sentences. Learn the translations and you can convert any of them into an entry without long deliberation.",
          list: [
            { term: "'The transaction was not recorded at all'", def: "A complete omission — pass the full original entry, two accounts touched, no Suspense Account" },
            { term: "'Recorded in the Journal but one side not posted'", def: "A partial omission — post the missing side against the Suspense Account" },
            { term: "'₹3,000 paid to Ram was debited to Shyam'", def: "Wrong account, same class — Ram's A/c Dr. To Shyam's A/c. Totals agreed, so no suspense" },
            { term: "'Machinery was debited to Purchases'", def: "Error of principle — Machinery A/c Dr. To Purchases A/c. Totals agreed, so no suspense" },
            { term: "'Entered as ₹6,300 instead of ₹3,600 and posted to both accounts'", def: "Both sides wrong by ₹2,700 — reverse the excess: Sales A/c Dr. ₹2,700; To the debtor's A/c ₹2,700" },
            { term: "'Credited to Salaries instead of debited'", def: "Wrong side — double the amount on the correct side through Suspense: Salaries A/c Dr. 2 × amount; To Suspense A/c" },
            { term: "'The account is overcast by ₹1,200'", def: "Casting slip — remove the excess from that account, with Suspense on the other side if the totals had been force-agreed" }
          ],
          example: "A credit sale of ₹3,600 to Neha was entered in the Journal as ₹6,300 and posted to both Neha's account and Sales at ₹6,300.\nWrong entry: Neha Dr. 6,300; Sales Cr. 6,300. Correct entry: Neha Dr. 3,600; Sales Cr. 3,600.\nRectifying: Sales A/c Dr. ₹2,700; To Neha's A/c ₹2,700 — both sides reduced by the excess of ₹2,700. The Trial Balance had agreed (both sides equally wrong), so no Suspense Account appears.",
          note: "Ask of every sentence: how many accounts need fixing? Two accounts — no suspense. One account — the other side of the entry must be the Suspense Account."
        }
      ],
      mistakes: [
        "Opening a Suspense Account to rectify a complete omission, an error of principle or a compensating pair — all are two-sided, and the Trial Balance agreed in the first place.",
        "Rectifying a wrong-side posting with a single amount instead of double — replacing a credit with a debit shifts the totals by twice the figure, so one entry must undo and redo.",
        "Correcting only one half of a compensating pair — each error needs its own separate entry, or the individual ledger accounts stay wrong forever.",
        "Walking away with a balance still sitting in the Suspense Account — a leftover balance is the proof that a one-sided error remains unlocated.",
        "Writing a rectifying note that names no accounts — the entry must show clearly which account is debited and which is credited, with the amount on each side.",
        "Assuming that because the Trial Balance agrees, there is nothing to rectify — errors of principle, omission and compensation hide precisely there."
      ],
      summary: [
        "Rectification means locating mistakes and correcting them through proper entries in the Journal Proper, preferably before the final accounts are drawn.",
        "The four error types are omission (left out), commission (recorded wrongly), principle (wrong class of account) and compensating (errors that cancel).",
        "Errors that keep the totals equal are two-sided; errors that disturb the totals are one-sided.",
        "Two-sided errors are corrected by entries between the accounts involved, with no Suspense Account at all.",
        "One-sided errors are corrected against the Suspense Account, which must close to nil once every such error is found.",
        "A wrong-side posting creates a difference of twice the amount — halving the difference finds such errors, and the nines test finds digit swaps.",
        "An agreeing Trial Balance proves only equal debits and credits — and a fraud, being deliberate, is not an error at all."
      ],
      check: [
        { q: "True or false, with reason: a wholly omitted credit purchase of ₹6,000 from Anita must be rectified through a Suspense Account.", a: "False. A complete omission removes equal amounts from both sides, so the Trial Balance still agrees. It is rectified by passing the full original entry: Purchases A/c Dr. ₹6,000; To Anita's A/c ₹6,000 — two accounts corrected, no Suspense Account involved." },
        { q: "Wages A/c is overcast by ₹1,200, making the debit side heavier, and the books were force-agreed through a Suspense A/c. What entry rectifies this?", a: "The excess must be removed from Wages: Suspense A/c Dr. ₹1,200; To Wages A/c ₹1,200. Since the short credit side had been completed through the Suspense Account, this entry both corrects Wages and clears that Suspense balance." },
        { q: "What does a remaining balance in the Suspense Account indicate after all known rectifications have been passed?", a: "That at least one one-sided error is still unlocated. The Suspense Account absorbs exactly the unexplained difference, so any leftover balance means part of the difference has not yet been corrected — and the final accounts cannot yet be fully relied upon." },
        { q: "How does an error of principle differ from an error of commission?", a: "In an error of principle the wrong CLASS of account is used — machinery debited to Purchases, for instance — so equal debits and credits were passed and the Trial Balance agrees. In an error of commission the execution is wrong — wrong amount, wrong side or wrong person of the same class — and when the amount or side is wrong, the Trial Balance disagrees." }
      ]
    }
    ,
    fs: {
      intro: [
        "A year of trading produces a mountain of ledger balances, but nobody can read a mountain. The financial statements cut it into two readable shapes: the Trading and Profit and Loss Account, which tells the story of the whole period — what the goods cost, what they fetched, and what remained for the owner — and the Balance Sheet, a photograph of one date showing what the business owns, what it owes and where the owner stands. Together they convert the Trial Balance into information any user can act on.",
        "Everything in these statements rests on classification. Money in is either a capital receipt or a revenue receipt; money out is either capital expenditure, revenue expenditure or deferred revenue expenditure; every expense is either direct — belonging to the goods — or indirect, belonging to the running of the business. Put an item in the wrong bucket and the profit figure bends while the Trial Balance still agrees. Only the final accounts, with their grouping and marshalling, expose the truth.",
        "This upgrade strengthens the chapter in four places. It derives the Balance Sheet from the accounting equation, so its two sides never look arbitrary again. It contrasts the Trading Account and the Profit and Loss Account as one sharp distinction. It lays out the vertical form beside the horizontal form this chapter uses. And it works operating profit through a mixed set of figures, then places the pairs students confuse most — interest on capital against interest on drawings, discount allowed against discount received — into their correct statements."
      ],
      objectives: [
        "State the accounting equation and explain how profit, loss and drawings move capital within it.",
        "Distinguish the Trading Account from the Profit and Loss Account in scope, contents and result.",
        "Present financial statements in horizontal form and in vertical form.",
        "Compute operating profit from a given set of figures by removing non-operating items.",
        "Place commonly confused items — interest on drawings, discount allowed, goods drawings — in their correct statement.",
        "Verify that a prepared Balance Sheet tallies and diagnose what a mismatch means."
      ],
      blocks: [
        {
          h: "The Accounting Equation Behind the Balance Sheet",
          p: "The Balance Sheet is not a random list of figures — it is the accounting equation written out in full. Whatever the business owns equals whatever it owes, with the owner's stake sitting between the two. Every single transaction, however complicated, leaves this equation standing exactly where it was.",
          formula: "Assets = Liabilities + Capital\n\nCapital rises with net profit and additional capital; it falls with net loss and drawings.\n\nSo at any date:  Capital (adjusted) + Liabilities = Assets",
          example: "The owner starts a business with ₹1,00,000 cash. Assets = cash ₹1,00,000; Capital = ₹1,00,000 — the equation holds.\nHe then buys machinery for ₹40,000 cash. Cash falls to ₹60,000 and machinery appears at ₹40,000, so assets still total ₹1,00,000 — and Capital is untouched.\nThe year ends with a net profit of ₹15,000: Capital becomes ₹1,15,000, and the asset side must have grown to ₹1,15,000 by the same amount.",
          list: [
            { term: "Why profit increases capital", def: "Profit is the owner's earnings — it belongs to him, so the business owes him more, and the assets it built with that profit appear on the other side of the same equation" },
            { term: "Why drawings reduce capital", def: "What the owner takes out is no longer the business's — both capital and the paying asset fall together" },
            { term: "Why the Balance Sheet must tally", def: "It is the equation itself. A sheet that refuses to tally means the equation was broken somewhere — almost always by an adjustment given only one of its two effects" }
          ],
          simple: "Whatever the business owns must have come from somewhere — from outsiders (liabilities) or from the owner (capital). The Balance Sheet is simply that sentence, written in two columns.",
          note: "A net loss and drawings both REDUCE capital on the liabilities side; neither is ever shown as an asset — an accumulated loss appears as a lower capital figure."
        },
        {
          h: "Trading A/c vs Profit and Loss A/c — The Distinction",
          p: "Both accounts cover the same period and both end in a result — but their scope is entirely different. The Trading Account asks one narrow question: did the buying and selling of goods earn a margin? The Profit and Loss Account asks the broad one: after every expense of running the business, what did the owner really keep?",
          list: [
            { term: "Scope", def: "Trading Account: only direct trading activity — goods, their cost and their sale price. Profit and Loss Account: the whole business, including office, selling and finance costs" },
            { term: "Debit contents", def: "Trading: opening stock, purchases less returns, direct expenses (wages, carriage inward, factory costs). Profit and Loss: gross loss, indirect expenses (rent, salaries, depreciation, bad debts, discount allowed)" },
            { term: "Credit contents", def: "Trading: sales less returns, closing stock. Profit and Loss: gross profit brought down, indirect incomes (commission, rent and interest received, profit on sale of an asset)" },
            { term: "Result", def: "Trading gives GROSS profit or gross loss — carried down. Profit and Loss gives NET profit or net loss — carried to the Balance Sheet, where it adjusts capital" },
            { term: "What sits between them", def: "The gross profit is the connecting figure: the Trading Account's balancing act becomes the Profit and Loss Account's opening credit" }
          ],
          confusion: {
            a: "Capital Expenditure",
            aText: "Benefit lasting more than one year — machinery, furniture, installation. Shown as an ASSET and depreciated slowly.",
            b: "Revenue Expenditure",
            bText: "Benefit consumed within the year — rent, wages, carriage inward. Charged to the Trading or Profit and Loss Account now.",
            diff: "The test is the life of the benefit, never the size of the amount. A ₹5 lakh generator is capital; a ₹500 repair bill is revenue. Capital expenditure distorts BOTH statements when wrongly charged to profit — profit falls now and the asset disappears from the Balance Sheet — while revenue expenditure wrongly capitalised flatters this year's profit and pads the asset side."
          },
          note: "Direct expenses go to the Trading Account because they belong to the goods; indirect expenses go to the Profit and Loss Account because they belong to the business as a whole."
        },
        {
          h: "Horizontal and Vertical Forms of Presentation",
          p: "The chapter draws the Balance Sheet in horizontal form — liabilities and capital on the left, assets on the right, facing each other. That is the form CBSE expects at Class 11. But financial statements may also be presented vertically, one block above the other, and recognizing both keeps you safe for any wording a question uses.",
          list: [
            { term: "Horizontal form", def: "Liabilities and capital on the left, assets on the right, both totals ruled at the bottom — a face-to-face view of what is owed and what is owned" },
            { term: "Vertical form", def: "Capital and liabilities stated first, assets directly beneath, one running total after the other — the format favoured for company statements and for Schedule-compliant presentation" },
            { term: "Which to write", def: "Use whichever the question names; if it names none, the horizontal form of this chapter is the natural choice at Class 11" },
            { term: "What never changes", def: "The figures, their grouping and the equality of the totals — only the arrangement of the rows differs between the two forms" }
          ],
          simple: "Same photograph, two framings: horizontal holds the two sides side by side; vertical stacks them. The person in the photograph does not move.",
          tip: "In a format question, head the statement correctly, show the Dr and Cr sides of each account, and rule the totals — presentation marks follow the ruling as much as the figures."
        }
      ],
      advBlocks: [
        {
          h: "The Vertical Form — A Worked Layout",
          p: "Written out once, the vertical form loses its mystery. The same two statements, the same figures — simply read from top to bottom.",
          formula: "Vertical Form — Trading and Profit and Loss Account for the year ended [date]\n\n  Revenue from operations (Net Sales)             XXXX\n  Other incomes                                   XXXX\n  Total revenue                                   XXXX\n Less: Cost of goods sold (Opening stock, purchases,\n       direct expenses, less closing stock)        XXXX\n Less: Other expenses (Indirect expenses)          XXXX\n  Profit for the period                           XXXX\n\nVertical Form — Balance Sheet as on [date]\n\n  Capital and reserves                            XXXX\n  Loans and current liabilities                   XXXX\n  Total                                           XXXX\n\n  Fixed assets (less depreciation)                XXXX\n  Current assets, loans and advances              XXXX\n  Total                                           XXXX",
          note: "In the vertical form the two totals still meet at the same figure — the equation has simply been written as one column instead of two facing pages."
        },
        {
          h: "Worked Example — Operating Profit from Mixed Figures",
          p: "Operating profit strips the core business naked: it removes the effect of financing (interest) and one-off events (profits and losses on asset sales), leaving only what the trading engine itself earned. The chapter gives two equivalent routes; this example runs both and shows they agree.",
          example: "A firm reports Gross Profit ₹1,20,000; indirect expenses for the year ₹80,000, including interest on a loan ₹6,000 and a loss on the sale of furniture ₹2,000; indirect incomes ₹10,000, including a profit on the sale of investments ₹4,000.\n\nNet Profit = 1,20,000 + 10,000 − 80,000 = ₹50,000.\n\nRoute 1 — from net profit:\nOperating Profit = Net Profit + Non-operating expenses − Non-operating incomes\n= 50,000 + 6,000 + 2,000 − 4,000 = ₹54,000.\n\nRoute 2 — straight from the core:\nOperating incomes = 10,000 − 4,000 = ₹6,000.\nOperating expenses = 80,000 − 6,000 − 2,000 = ₹72,000.\nOperating Profit = 1,20,000 + 6,000 − 72,000 = ₹54,000 — both routes meet at ₹54,000.",
          formula: "Operating Profit = Net Profit + Non-operating expenses − Non-operating incomes\n\nOperating Profit = Gross Profit + Other operating incomes − Operating expenses",
          list: [
            { term: "Why bother", def: "A large interest payment can make a healthy trading year look weak, and a lucky asset sale can make a weak year look healthy — operating profit shows the trading itself, undecorated" }
          ],
          tip: "Circle every non-operating figure before computing — interest, and profit or loss on the sale of assets — then decide which route the question's wording wants."
        },
        {
          h: "Commonly Confused Pairs and Their Correct Placement",
          p: "Certain pairs keep landing in the wrong statement because their names rhyme or their natures invert. Settle each pair once and it stays settled.",
          list: [
            { term: "Interest on Capital vs Interest on Drawings", def: "Interest on Capital is an expense OF the business — Profit and Loss debit, and added to Capital in the Balance Sheet. Interest on Drawings is INCOME to the business — Profit and Loss credit, never an expense" },
            { term: "Discount Allowed vs Discount Received", def: "Allowed to customers for prompt payment — an expense, Profit and Loss debit. Received from suppliers — a gain, Profit and Loss credit" },
            { term: "Purchases of goods vs Purchase of machinery", def: "Goods bought for resale — Trading Account debit, an expense of the year. Machinery — an asset in the Balance Sheet; only its yearly depreciation reaches profit" },
            { term: "Goods withdrawn by the owner vs goods given to staff", def: "Owner's withdrawal — drawings: deduct from purchases and reduce Capital. Staff gifts or free samples — a business expense: charge the Trading or Profit and Loss Account and reduce closing stock" },
            { term: "Wages vs Salaries", def: "Wages pay for work on the goods — direct, Trading debit. Salaries pay office and administrative staff — indirect, Profit and Loss debit" },
            { term: "Carriage inward vs Carriage outward", def: "Inward brings goods TO the business — direct, Trading debit. Outward sends goods TO customers — indirect, Profit and Loss debit" }
          ],
          real: "A shop's electricity bill has two halves: the power running the freezers that chill the stock (part of getting goods ready) and the power lighting the counter (running the shop). Accountancy splits the bill exactly as life does.",
          note: "Interest on Drawings is one of the few 'interest' items that is income — it is the owner being charged for using the business's money, credited like any other gain."
        }
      ],
      mistakes: [
        "Adding net profit on the assets side instead of increasing Capital on the liabilities side — profit belongs to the owner, not to the pile of assets.",
        "Charging the whole cost of machinery to the Profit and Loss Account in the year of purchase — only the year's depreciation is an expense of that year.",
        "Crediting closing stock to the Trading Account but forgetting it as an asset, or showing it as an asset without crediting the Trading Account — one figure, two effects.",
        "Treating interest on drawings as an expense — it is an income of the business, credited to the Profit and Loss Account.",
        "Assuming that because the Trial Balance agreed, the Balance Sheet must tally — a single half-given adjustment breaks the statement even when every ledger total was right.",
        "Showing sales and purchases without deducting the respective returns, inflating both sides of the Trading Account and misstating gross profit."
      ],
      summary: [
        "Financial statements are the Trading and Profit and Loss Account for the period and the Balance Sheet for one date, both built from the Trial Balance.",
        "Assets = Liabilities + Capital; profit raises capital, while loss and drawings reduce it — and the equation keeps the Balance Sheet tied.",
        "The Trading Account shows direct results and gives gross profit or loss; the Profit and Loss Account adds indirect items and gives the net result.",
        "Capital receipts and expenditure reach the Balance Sheet; revenue ones hit this year's profit — decided by the life of the benefit, never by size.",
        "Operating profit isolates core performance by removing interest and one-off profit or loss on asset sales.",
        "Balance Sheet items may be marshalled by permanence or by liquidity — either is accepted, provided one order is applied consistently.",
        "The horizontal form faces liabilities against assets; the vertical form stacks them — the totals must be equal in both.",
        "A Balance Sheet that will not tally almost always points to an adjustment given only one of its two effects."
      ],
      check: [
        { q: "Opening capital ₹1,50,000 and liabilities ₹60,000. If the net profit for the year is nil and there are no drawings, what are the total assets at the year end?", a: "Assets = Liabilities + Capital = 60,000 + 1,50,000 = ₹2,10,000. With no profit, loss or drawings, the owner's stake remains exactly as it opened." },
        { q: "True or false, with reason: the Balance Sheet is an account with a debit and a credit side.", a: "False. The Balance Sheet is a statement, not an account — it has no sides of its own. It lists liabilities and capital against assets as on one date, and its two totals must be equal." },
        { q: "Opening capital ₹2,00,000, net profit ₹45,000 and drawings ₹30,000 for the year. What figure for capital appears in the Balance Sheet?", a: "Closing capital = 2,00,000 + 45,000 − 30,000 = ₹2,15,000, shown on the liabilities side and added to the other liabilities." },
        { q: "State one point of difference between the Trading Account and the Profit and Loss Account.", a: "The Trading Account covers only direct trading activity — opening stock, purchases, direct expenses, sales and closing stock — and the result is gross profit or gross loss. The Profit and Loss Account takes that result forward, adds indirect incomes and deducts indirect expenses, giving the net profit or net loss that finally adjusts capital." }
      ]
    }
    ,
    adj: {
      intro: [
        "The Trial Balance is struck before the year is truly over. The stock has not yet been counted, the last bills have not arrived, some income has not been received, and several values still need updating. Adjustments are those year-end facts, given outside the Trial Balance under a list of additional information, and they exist to pull the accounts from ledger-balanced to year-complete. Every one of them must be worked into the statements before the final figures can be believed.",
        "One rule governs the entire unit: every adjustment has two effects — one in the Trading or Profit and Loss Account, and one in the Balance Sheet. Outstanding expenses add to the charge and create a liability; prepaid expenses cut the charge and create an asset. Accrued income adds to the income and creates an asset; advance income cuts the income and creates a liability. Depreciation, bad debts and provisions charge profit and reduce an asset. Goods that leave must leave the cost side and the asset side together.",
        "This upgrade attacks the places marks actually leak. It separates opening stock from closing stock and shows both feeding the cost of goods sold. It works accrued income and advance income together in one example, sets Provision for Doubtful Debts against Provision for Discount on Debtors, and hands you a diagnostic guide that reads the direction of a Balance Sheet mismatch like a doctor reads a symptom. Finally, a self-contained mini problem exercises the income-side adjustments that the chapter's big worked example leaves untouched."
      ],
      objectives: [
        "Apply the two-effect rule to every adjustment line before drawing any statement.",
        "Compute this year's charge for outstanding and prepaid items, and place each in the Balance Sheet.",
        "Run the debtors sequence — bad debts, then doubtful provision, then discount provision — on the correct bases.",
        "Handle goods adjustments for drawings, staff welfare and abnormal loss without double counting.",
        "Compute manager's commission under the after-charging clause and place it in the statements.",
        "Diagnose the direction of a Balance Sheet mismatch and name the adjustment at fault."
      ],
      blocks: [
        {
          h: "Opening Stock and Closing Stock — Two Figures, Two Roles",
          p: "Two stock figures, both about unsold goods, sitting in two different places — the confusion is understandable, but the roles are exact opposites. Opening stock is where the year BEGINS, carried in from last year's Balance Sheet; closing stock is where the year ENDS, discovered by the count taken at the last date.",
          formula: "Cost of Goods Sold = Opening Stock + Net Purchases + Direct Expenses − Closing Stock\n\nGross Profit = Net Sales − Cost of Goods Sold",
          list: [
            { term: "Opening stock", def: "A Trial Balance item — the goods already lying with the business when the year began. It opens the DEBIT side of the Trading Account and never appears in the Balance Sheet of this year" },
            { term: "Closing stock", def: "Normally an adjustment outside the Trial Balance — credited to the Trading Account to keep unsold goods out of this year's cost, and shown as a current asset in the Balance Sheet" },
            { term: "Why the credit to Trading", def: "Goods still on hand did not contribute to this year's sales, so their cost must leave this year's cost of goods sold — that credit is what raises gross profit to its true figure" },
            { term: "If closing stock sits inside the Trial Balance", def: "The books already recorded it — show ONLY the Balance Sheet asset in the statements, or the same stock gets counted twice" }
          ],
          example: "Opening stock ₹20,000 + purchases ₹1,50,000 + direct expenses ₹10,000 − closing stock ₹30,000 = cost of goods sold ₹1,50,000.\nAgainst net sales of ₹2,00,000: gross profit = 2,00,000 − 1,50,000 = ₹50,000.\nHad the ₹30,000 of unsold goods been left in the cost, profit would have been understated by exactly that amount — and the same goods would also have vanished from the Balance Sheet.",
          note: "Opening stock adjusts last year's closing figure and belongs to the debit side; closing stock adjusts this year's cost and belongs to the credit side — and, if outside the Trial Balance, to the asset side as well."
        },
        {
          h: "Accrued Income and Advance Income — Worked Together",
          p: "The income side of the mirror deserves its own worked example, because real questions often hand you both halves at once: money earned but not yet received, and money received but not yet earned. Each bends the year's income in the opposite direction.",
          list: [
            { term: "Accrued income", def: "Earned this year, not received — ADD it to that income in the Profit and Loss Account, and show it as a current asset (someone owes the business)" },
            { term: "Income received in advance", def: "Received this year, relating to next year — DEDUCT it from that income in the Profit and Loss Account, and show it as a current liability (the business owes that service)" },
            { term: "The single test", def: "Ask two questions. Has it been earned? Then it is this year's income. Has it been received? If not, it sits on the asset side as a receivable" }
          ],
          example: "Rent received in the bank during the year ₹60,000. Of this, ₹5,000 was received for the coming year (advance), and ₹4,000 of this year's rent is still to be received (accrued).\n\nProfit and Loss credit = 60,000 − 5,000 + 4,000 = ₹59,000 — only the earned portion of the cash actually received, plus what was earned but not received.\nBalance Sheet — asset: Accrued Rent ₹4,000 (owed to the business).\nBalance Sheet — liability: Rent Received in Advance ₹5,000 (owed back to the tenant in service).",
          note: "The cash figure is a starting point, not the income figure — accrual accounting reports what was EARNED, and the two Balance Sheet entries carry the gap between cash and earnings."
        },
        {
          h: "Provision for Doubtful Debts vs Provision for Discount on Debtors",
          p: "Both reduce Debtors in the Balance Sheet and both debit the Profit and Loss Account, yet they protect against completely different risks — and they are computed on completely different bases, one after the other.",
          confusion: {
            a: "Provision for Doubtful Debts",
            aText: "Covers debtors who may NOT pay at all — the risk of default. Computed on debtors AFTER writing off further bad debts.",
            b: "Provision for Discount on Debtors",
            bText: "Covers debtors who WILL pay but may take a cash discount for paying promptly — the risk of a discount. Computed AFTER the doubtful provision.",
            diff: "Different risks and different bases: remove the certainly-dead debtors first (bad debts), then estimate the possibly-dead ones (doubtful provision), and offer the discount only to the survivors — a debtor who may never pay is not going to pay early to claim a discount. In the statements both debit the Profit and Loss Account and both reduce the same Debtors figure, one after the other."
          },
          list: [
            { term: "The sequence in full", def: "Trial Balance Debtors, less further bad debts, less the new doubtful provision on what remains, less the discount provision on what remains again — that final figure reaches the Balance Sheet" },
            { term: "Why discount comes last", def: "Cash discount rewards prompt payment; only the good, realistically collectible debtors are candidates for paying early" },
            { term: "Both reach the Profit and Loss Account", def: "Bad debts + new doubtful provision + discount provision are charged together — less only the increase, if an old provision already sits in the Trial Balance" }
          ],
          example: "Debtors ₹80,000; further bad debts ₹5,000; doubtful provision @10%; discount provision @2%.\nBad debtors gone: 80,000 − 5,000 = ₹75,000.\nDoubtful provision: 75,000 × 10/100 = ₹7,500 → good debtors ₹67,500.\nDiscount provision: 67,500 × 2/100 = ₹1,350.\nBalance Sheet Debtors = 80,000 − 5,000 − 7,500 − 1,350 = ₹66,150.\nProfit and Loss debit = 5,000 + 7,500 + 1,350 = ₹13,850.",
          tip: "Draw three arrows down the page — bad debts, doubtful, discount — and write each new base beside the arrow. The sequence, once drawn, cannot be done in the wrong order."
        }
      ],
      advBlocks: [
        {
          h: "When the Balance Sheet Refuses to Tally — A Diagnostic Guide",
          p: "A mismatch is not random noise; it is a symptom with a readable direction. The amount of the gap and which side is heavier between them usually identify the adjustment at fault within a minute.",
          list: [
            { term: "Assets exceed liabilities by exactly one adjustment's amount", def: "That adjustment's Balance Sheet effect is missing. Outstanding salaries of ₹6,000 charged correctly to the Profit and Loss Account but never shown as a liability leaves the assets side heavier by exactly ₹6,000" },
            { term: "Liabilities exceed assets by exactly one adjustment's amount", def: "The statement effect was shown but the charge was skipped. The ₹6,000 liability appeared, yet the expense was never added to the Profit and Loss Account — so profit, and therefore capital, stands ₹6,000 too high" },
            { term: "Tallied, but the figures still look wrong", def: "An item already inside the Trial Balance was given BOTH effects, or an old provision was charged afresh — both errors move the two sides by equal amounts, so the sheet balances happily while the profit is wrong" },
            { term: "The general cure", def: "Tick every adjustment line in the margin and write its pair of effects beside it — one statement effect, one Balance Sheet effect. The line without a tick is your culprit" }
          ],
          example: "Salaries paid ₹36,000, outstanding ₹6,000.\nCorrect: Profit and Loss debit 36,000 + 6,000 = ₹42,000, and a liability of ₹6,000.\nMiss the liability: charge is right, capital is right, but the liabilities side is ₹6,000 short — assets exceed liabilities by ₹6,000.\nMiss the charge: liability is shown, but profit is ₹6,000 too high — liabilities exceed assets by ₹6,000.\nThe direction of the gap names the half-given effect.",
          note: "Marshalling order can never unbalance a Balance Sheet — only the figures can. Look for a missing or double-counted adjustment effect, not for the sequence of the rows."
        },
        {
          h: "Worked Example — Depreciation, Bad Debts and an Existing Provision Together",
          p: "The advanced adjustments arrive in packs: an existing provision inside the Trial Balance, fresh bad debts, a new estimate, and this year's depreciation — all in one question. Work the pack in the right order and every figure falls into place.",
          example: "Trial Balance contains Debtors ₹60,000, Provision for Doubtful Debts (Cr) ₹4,000, and Machinery ₹1,50,000 with Provision for Depreciation (Cr) ₹30,000.\nAdjustments: further bad debts ₹3,000; required doubtful provision @10%; depreciation for the year ₹15,000.\n\nStep 1 — Bad debts: 60,000 − 3,000 = ₹57,000 remaining.\nStep 2 — Required provision: 57,000 × 10/100 = ₹5,700. Charge = 5,700 − 4,000 (old) = ₹1,700 — only the increase.\nStep 3 — Profit and Loss debit from debtors = 3,000 + 1,700 = ₹4,700.\nStep 4 — Balance Sheet Debtors = 60,000 − 3,000 − 5,700 = ₹51,300 (net of the FULL required provision).\nStep 5 — Machinery: charge this year's ₹15,000 to the Profit and Loss Account; show the asset at 1,50,000 − 30,000 (old provision) − 15,000 (this year) = ₹1,05,000.",
          list: [
            { term: "Why the old provisions stay out of this year's charge", def: "Both the ₹4,000 and the ₹30,000 were charged to profit in earlier years — this year takes only what changed: ₹1,700 on debtors and ₹15,000 on machinery" },
            { term: "The Balance Sheet rule behind it", def: "Assets are shown net of ALL depreciation to date and the FULL current doubtful provision — the totals are cumulative even when this year's charge is not" }
          ],
          note: "Every provision already in the Trial Balance has done its job once — inside these statements it appears only where it lands in the Balance Sheet, never as a fresh charge."
        },
        {
          h: "Worked Mini Problem — The Income-Side Adjustments",
          p: "Closing stock, outstanding expenses and depreciation are well practised. This mini problem deliberately loads the adjustments that receive less practice — advance income, accrued income, prepaid insurance, interest on capital and goods drawings — and proves the two-effect rule with totals that tie.",
          example: "Trial Balance as on 31st March: Capital ₹1,00,000 (Cr) · Cash at Bank ₹30,000 (Dr) · Debtors ₹52,000 (Dr) · Creditors ₹25,000 (Cr) · Purchases ₹1,20,000 (Dr) · Sales ₹1,80,000 (Cr) · Opening Stock ₹20,000 (Dr) · Wages ₹10,000 (Dr) · Insurance ₹12,000 (Dr) · Rent Received ₹24,000 (Cr) · Machinery ₹85,000 (Dr). Totals agree at ₹3,29,000 each side.\n\nAdjustments: closing stock ₹30,000 · rent received includes ₹4,000 in advance · accrued rent ₹2,000 not yet received · insurance includes ₹3,000 for next year · interest on capital ₹6,000 · goods worth ₹2,000 withdrawn for personal use.\n\nTrading A/c — Dr: 20,000 + (1,20,000 − 2,000) + 10,000 = ₹1,48,000. Cr: 1,80,000 + 30,000 = ₹2,10,000. Gross Profit = ₹62,000.\nProfit and Loss A/c — Cr: 62,000 + (24,000 − 4,000 + 2,000) = ₹84,000. Dr: (12,000 − 3,000) + 6,000 = ₹15,000. Net Profit = ₹69,000.\nBalance Sheet — Liabilities: 1,00,000 + 69,000 + 6,000 − 2,000 (drawings) + 25,000 (creditors) + 4,000 (advance rent) = ₹2,02,000. Assets: 85,000 + 52,000 + 30,000 + 2,000 (accrued rent) + 3,000 (prepaid insurance) + 30,000 = ₹2,02,000 — the sides tie.",
          list: [
            { term: "Each adjustment's pair", def: "Closing stock: Trading credit and asset · advance rent: reduces income and creates a liability · accrued rent: increases income and creates an asset · prepaid insurance: reduces expense and creates an asset · interest on capital: Profit and Loss debit and added to Capital · goods drawings: reduces purchases and increases total drawings" }
          ],
          tip: "Notice the interest on capital pair nets itself out — the charge reduces profit by ₹6,000 while capital rises by the same ₹6,000 — yet BOTH entries must still be made, or the sheet will not tie."
        }
      ],
      mistakes: [
        "Charging only the cash paid for an expense instead of the full year's charge — paid plus outstanding, or paid less prepaid, decides the Profit and Loss figure.",
        "Debiting the Profit and Loss Account for income received in advance instead of deducting it from that income's credit — advance income is never an expense.",
        "Reducing closing stock for an abnormal loss but forgetting the Trading debit for the goods destroyed — the cost must land somewhere, or the loss simply vanishes.",
        "Adding interest on capital to Capital without debiting the Profit and Loss Account — the second effect cannot be skipped because the first looks obvious.",
        "Valuing closing stock at a figure that still includes goods withdrawn by the owner or destroyed by fire — such goods are no longer assets of the business.",
        "Netting the insurance claim for an abnormal loss against the Trading debit instead of showing the claim separately as an asset of the amount expected to be recovered."
      ],
      summary: [
        "Every adjustment outside the Trial Balance has two effects — one in the Trading or Profit and Loss Account, and one in the Balance Sheet.",
        "An item already inside the Trial Balance gets only its Balance Sheet effect shown — both effects would double count it.",
        "Outstanding expenses add to the charge and create a liability; prepaid expenses reduce the charge and create an asset.",
        "Accrued income adds to the income and creates an asset; income in advance reduces the income and creates a liability.",
        "Debtors run in a fixed sequence — bad debts, then doubtful provision, then discount provision — each computed on what remains.",
        "Goods that leave the business must leave both the cost side and the asset side — drawings reduce purchases, abnormal loss reduces stock.",
        "Interest on capital debits the Profit and Loss Account and increases Capital; manager's commission after charging equals profit before commission times rate divided by (100 plus rate).",
        "A Balance Sheet that will not tally is almost always an adjustment carrying only half its treatment — the direction of the gap names the missing half."
      ],
      check: [
        { q: "True or false, with reason: an outstanding expense of ₹4,000 is shown as a current asset in the Balance Sheet.", a: "False. An outstanding expense has been incurred but not yet paid — the business owes it, so it is a current LIABILITY. It is a prepaid expense, paid but not yet used, that appears as a current asset." },
        { q: "Rent paid during the year ₹30,000, of which ₹5,000 relates to the next year. What amount is debited to the Profit and Loss A/c, and what appears in the Balance Sheet?", a: "Only this year's portion is charged: 30,000 − 5,000 = ₹25,000 to the Profit and Loss A/c. The prepaid ₹5,000 appears as a current asset in the Balance Sheet — prepaid rent." },
        { q: "State the two effects of an abnormal loss of ₹4,000 by fire on the final accounts, given the goods were included in the closing stock count, and add the effect of an expected insurance claim of ₹3,000.", a: "First effect: ₹4,000 debited to the Trading or Profit and Loss A/c as the loss of the year. Second effect: closing stock reduced by ₹4,000 in the Balance Sheet, since destroyed goods cannot remain an asset. The expected claim of ₹3,000 is separately shown as a current asset — insurance claim receivable — and the full loss stays charged." },
        { q: "Net profit before charging manager's commission is ₹1,05,000 and the manager is entitled to 5% commission on net profit after charging such commission. What is the commission?", a: "Commission = 1,05,000 × 5 ÷ 105 = ₹5,000. Check: 1,05,000 − 5,000 = ₹1,00,000, and 5% of ₹1,00,000 is ₹5,000 — the commission is exactly 5% of the profit measured after itself." }
      ]
    }
  });
})();

/* theory-upgrade part 4 — Class 12 chapters (pf, gw, psr, adm, ret, dis, sc, deb, cfin, fsa, rat, cf, ca) */
(function () {
  "use strict";
  window.THEORY_UPGRADE_PARTS = window.THEORY_UPGRADE_PARTS || [];
  window.THEORY_UPGRADE_PARTS.push({
    pf: {
      intro: [
        "Partnership Fundamentals opens the Class 12 Accountancy course with the rules that govern how a firm earns, records and divides profit among its partners. Before any revaluation or goodwill problem can be attempted, you must be fluent in the Profit and Loss Appropriation Account, because every later chapter assumes you can divide profit correctly.",
        "This chapter matters because it teaches the default logic of the Indian Partnership Act, 1932: what happens when the partnership deed falls silent, what must be paid even in a loss year, and what can only be paid out of profit. Examiners test this logic directly through one-mark traps and short numericals.",
        "It connects forward to admission, retirement and dissolution, where profit must first be computed before it is re-divided, and to company accounts, where appropriation reappears as divisible profit after tax. Master this foundation and the reconstitution chapters become mechanical."
      ],
      objectives: [
        "Define a partnership and its governing features under the Indian Partnership Act, 1932.",
        "Distinguish between a charge against profit and an appropriation of profit.",
        "Prepare a Profit and Loss Appropriation Account and compute divisible profit.",
        "Reduce appropriations proportionately when the year's profit is insufficient.",
        "Apply a guarantee of minimum profit and compute the resulting deficiency.",
        "Pass a single past-adjustment entry to correct an earlier division of profit."
      ],
      blocks: [
        {
          h: "The Deed and the Act's Defaults",
          p: "A partnership deed is the written agreement recording the profit-sharing ratio, interest on capital, salary, commission and capital of each partner. When a term is missing, the Indian Partnership Act, 1932 supplies the default: no interest on capital, no salary, no interest on a partner's drawings, and interest on a partner's loan treated as a charge against profit.",
          list: [
            { term: "Interest on capital by default", def: "Nothing is payable unless the deed provides for it, because the Act does not reward capital, only profit-sharing." },
            { term: "Partner's salary by default", def: "No salary unless the deed grants it; partners share profit equally when even the ratio is silent." },
            { term: "Interest on a partner's loan", def: "Payable under the Act unless the deed states otherwise, and always a charge, due even in a loss year." }
          ],
          simple: "In Simple Words: if the deed does not mention a term, assume the Act gives nothing on capital or salary, except interest on a loan, which a lending partner always earns.",
          tip: "Exam Tip: a question that says the deed is silent means you answer with the Act's defaults, which is usually no interest on capital and no salary."
        },
        {
          h: "Building the Appropriation Account, Line by Line",
          p: "The Profit and Loss Appropriation Account is a nominal account that begins with net profit brought down from the Profit and Loss Account and ends with divisible profit shared in the profit-sharing ratio. Between those two lines sit every appropriation the deed provides.",
          p2: "Post on the debit side the interest on capital for each partner, any salary or commission, and transfers to reserves. Post on the credit side the net profit brought down and the interest on drawings. The residual is the divisible profit, divided in the profit-sharing ratio.",
          formula: "Divisible profit = Net profit + Interest on drawings − Interest on capital − Salary or commission − Transfers to reserves",
          simple: "In Simple Words: net profit is the raw earnings, while divisible profit is what is left to share after the deed's promises have been honoured.",
          confusion: {
            a: "Net profit", aText: "Earnings after all business expenses but before any partner-specific appropriations.",
            b: "Divisible profit", bText: "What remains after interest on capital, salary and reserve transfers are removed.",
            diff: "Net profit feeds the appropriation account, while divisible profit is its output and the figure actually shared."
          }
        },
        {
          h: "Fixed and Fluctuating Capital Accounts",
          p: "Partners' capital can be kept in two ways. Under the fluctuating system, the default, one account per partner carries the capital balance together with salary, interest, drawings and profit share, so the balance moves every year. Under the fixed system, the capital account stays fixed and a separate current account collects all of the year's adjustments.",
          list: [
            { term: "Fluctuating capital", def: "One account per partner; every appropriation and drawing touches it, so the balance fluctuates." },
            { term: "Fixed capital", def: "Capital account unchanged except on introduction or withdrawal; salary, interest and drawings go to a separate current account." }
          ],
          note: "Remember This: unless the deed expressly adopts fixed capital, assume fluctuating.",
          example: "Worked Example: A starts with capital of ₹1,00,000. During the year A earns interest on capital of ₹6,000 and salary of ₹12,000, and draws ₹10,000. Under fluctuating capital, A's closing capital = 1,00,000 + 6,000 + 12,000 − 10,000 = ₹1,08,000, all in one account."
        }
      ],
      advBlocks: [
        {
          h: "Insufficient Profit: The Pro-Rata Factor",
          p: "When the deed treats interest on capital and salary as appropriations and the year's profit cannot cover the full demand, every item is reduced by one common factor. Compute the total appropriations claimed, divide the profit available by that total, and scale each item by the resulting fraction.",
          formula: "Common factor = Profit available ÷ Total appropriations claimed\nAmount payable = Full claim × Common factor",
          example: "Worked Example: Net profit ₹9,000. Interest on capital A ₹6,000, B ₹2,000, and salary to A ₹4,000, so the total claim is ₹12,000. Factor = 9,000 ÷ 12,000 = 3/4. A receives interest of 6,000 × 3/4 = ₹4,500 plus salary of 4,000 × 3/4 = ₹3,000; B receives 2,000 × 3/4 = ₹1,500. Total distributed 4,500 + 3,000 + 1,500 = ₹9,000, so divisible profit is nil.",
          note: "Remember This: if the deed makes these items charges against profit rather than appropriations, they are deducted in full regardless of profit, because the pro-rata rule applies only to appropriations."
        },
        {
          h: "Guarantee of Minimum Profit, Two Flavours",
          p: "A guarantee promises a partner at least a stated amount of profit. The guarantee may come from the firm as a whole, from one specific partner, or from the remaining partners in an agreed proportion. Compute every share first, then find the guaranteed partner's shortfall, then let the guaranteeing party meet it.",
          example: "Worked Example: A and B share 3:2. Net profit ₹60,000. B is guaranteed ₹26,000 by A. B's share = 60,000 × 2/5 = ₹24,000, which is short by ₹2,000. A meets it from his own share, so A keeps 36,000 − 2,000 = ₹34,000. Check: 34,000 + 26,000 = ₹60,000.",
          confusion: {
            a: "Guarantee by the firm", aText: "The deficiency is covered by reducing the other partners' shares in their profit-sharing ratio.",
            b: "Guarantee by one partner", bText: "That single partner alone bears the deficiency from their own share.",
            diff: "Read who gave the guarantee, because it decides whether the burden is shared or falls on one partner."
          },
          mistakes: ["Covering the deficiency from General Reserve instead of the guaranteeing partner.", "Testing the minimum before computing each partner's normal share."]
        },
        {
          h: "Past Adjustments: One Correcting Entry",
          p: "After the accounts close, a mis-posted salary or an omitted interest may come to light. For each partner compute the correction as correct entitlement minus the amount already credited. A positive figure credits the partner now, a negative figure debits them, and all the corrections together sum to zero because profit is only re-divided, never created.",
          formula: "Correction for a partner = Correct entitlement − Amount already credited",
          example: "Worked Example: A and B share 3:2. A salary of ₹8,000 was wrongly credited to B. A's correction = 8,000 − 0 = +₹8,000, a credit. B's correction = 0 − 8,000 = −₹8,000, a debit. The entry is B's Capital A/c Dr ₹8,000 to A's Capital A/c ₹8,000.",
          tip: "Exam Tip: draw a two-column table of correct versus received for every partner before writing the entry, because the debits and credits must net to zero."
        },
        {
          h: "Guarantee Inside a Full Appropriation",
          p: "The hardest questions combine a guarantee with interest on capital and salary and an insufficient profit. Sequence matters: first scale every appropriation by the pro-rata factor, then find the divisible profit, then divide it in the profit-sharing ratio, and only then test the guarantee against the guaranteed partner's final share.",
          example: "Worked Example: Net profit ₹12,000. Interest on capital A ₹4,000, B ₹2,000, with no salary. The full claim of ₹6,000 is covered, so appropriations are paid in full, leaving divisible profit of ₹6,000 shared 3:2, which is A ₹3,600 and B ₹2,400. If B were guaranteed ₹3,000 by A, B's shortfall of ₹600 is met by A, leaving A with ₹3,000. Total 3,000 + 3,000 = ₹6,000."
        }
      ],
      mistakes: [
        "Charging interest on capital straight to the Profit and Loss Account instead of the appropriation account.",
        "Paying appropriations in full when profit is insufficient, instead of reducing them proportionately.",
        "Debiting the guaranteed partner's deficiency to General Reserve rather than to the guaranteeing partner.",
        "Forgetting that interest on drawings is credited to the appropriation account and raises divisible profit.",
        "Treating interest on a partner's loan as an appropriation, when it is always a charge payable even in a loss year.",
        "Using the fixed-capital current account figures when the problem expects fluctuating capital, or the reverse."
      ],
      summary: [
        "Partnership is a relationship of persons agreeing to share business profits carried on by all or any acting for all, governed by the Indian Partnership Act, 1932 when the deed is silent.",
        "The Profit and Loss Appropriation Account starts with net profit brought down and closes with divisible profit shared in the profit-sharing ratio.",
        "Interest on capital, salary and commission are appropriations, while interest on a partner's loan is a charge payable even in a loss year.",
        "When profit cannot meet appropriations, every item is scaled by one factor, namely profit available divided by total claim.",
        "A guarantee fixes a minimum, and the deficiency is borne by whoever gave the guarantee.",
        "A past adjustment computes correct entitlement minus amount received for each partner and passes one netting entry.",
        "Fluctuating capital is the default, while fixed capital keeps a separate current account."
      ],
      check: [
        { q: "State the default under the Indian Partnership Act when the deed is silent about interest on capital.", a: "No interest on capital is payable, and partners share profit equally unless a ratio is agreed." },
        { q: "True or false: interest on a partner's loan to the firm is payable only out of profit.", a: "False. It is a charge against profit under the Act unless the deed states otherwise, and is payable even in a loss year." },
        { q: "Net profit ₹24,000. Interest on capital A ₹6,000, B ₹4,000; salary to A ₹8,000; interest on drawings ₹2,000. Find the divisible profit.", a: "24,000 + 2,000 − 6,000 − 4,000 − 8,000 = ₹18,000." },
        { q: "In a 3:2 firm, B is guaranteed ₹20,000 by A out of a divisible profit of ₹50,000. How much does A finally keep?", a: "B's share = 50,000 × 2/5 = ₹20,000, already at the minimum, so A keeps 50,000 × 3/5 = ₹30,000 with no deficiency to meet." }
      ]
    },
    gw: {
      intro: [
        "Goodwill: Nature and Valuation asks a single question: what is a firm's reputation worth in rupees? The chapter introduces goodwill as the value of above-normal earning power created by location, loyalty and management, and then teaches the families of methods that convert that reputation into a number.",
        "It matters because every reconstitution chapter depends on it. Admission, retirement and death all require the firm's goodwill to be valued and settled between partners, so a student who cannot compute goodwill cannot complete those problems.",
        "It connects to AS-26, which records only purchased goodwill, and to the premium methods of the later chapters. The average profit, super profit and capitalisation methods are the tools, while the sacrificing and gaining ratios of later chapters decide who receives the money."
      ],
      objectives: [
        "Explain the nature of goodwill and the factors that create it.",
        "State when goodwill is valued and the position of AS-26 on self-generated goodwill.",
        "Value goodwill by the average profit method.",
        "Compute super profit and value goodwill by the super profit method.",
        "Apply both capitalisation methods and reconcile them.",
        "Interpret years' purchase and the normal rate of return."
      ],
      blocks: [
        {
          h: "What Goodwill Is and When It Is Valued",
          p: "Goodwill is the value of a firm's reputation and its ability to earn more than the normal return for its capital. It is not recorded when the firm builds it internally, because under AS-26 only purchased goodwill enters the books. It becomes a live figure at the events that change who owns the profit stream.",
          list: [
            { term: "Valued at admission", def: "When a new partner buys into future profits, they pay for their share of existing goodwill." },
            { term: "Valued at retirement or death", def: "The outgoing partner or their heirs are compensated for their share of goodwill." },
            { term: "Valued at sale or amalgamation", def: "The whole reputation is priced when the business changes hands." }
          ],
          simple: "In Simple Words: goodwill is the extra a buyer would pay for a known, trusted name over an identical but unknown one."
        },
        {
          h: "The Factors That Build Goodwill",
          p: "The standard factors examiners expect: a favourable location, quality of products or services, efficient and experienced management, a loyal customer base, monopoly position or restrictions on entry, and a record of earning returns above the industry norm. The last factor is the one the valuation methods actually measure, while the others explain why the excess exists.",
          real: "Real-Life Connection: a corner shop with the same stock as its neighbour may outsell it for years because regulars trust the owner. That trust is the shop's goodwill.",
          confusion: {
            a: "Goodwill", aText: "The present value of future above-normal earnings, arising from reputation.",
            b: "Normal profit", bText: "The return capital could earn in any alternative of similar risk.",
            diff: "Goodwill exists only where average profit exceeds normal profit, so equal earnings mean zero goodwill."
          }
        },
        {
          h: "The Method Families at a Glance",
          p: "The average profit method multiplies recent average earnings by years' purchase. The super profit method isolates only the earnings above normal and capitalises those. The capitalisation methods work backwards from the value the market would place on the earnings. All agree when the inputs are consistent.",
          formula: "Average profit method: GW = Average profit × n\nSuper profit method: SP = Average profit − (Capital employed × NRR); GW = SP × n\nCapitalisation of super profit: GW = SP ÷ NRR\nCapitalisation of average profit: GW = (Average profit ÷ NRR) − Capital employed",
          note: "Remember This: the two capitalisation routes are algebraically identical and must return the same goodwill, which is a free check in the exam."
        }
      ],
      advBlocks: [
        {
          h: "Super Profit, the Heart of the Chapter",
          p: "A firm earning exactly the normal rate has no goodwill, because anyone could earn that elsewhere. Goodwill exists only where earnings exceed the normal return on the capital actually employed, and super profit measures that annual excess. Capital employed is the long-term funds invested: partners' capital plus long-term reserves, or total assets less long-term liabilities.",
          formula: "Super profit = Average profit − Normal profit, where Normal profit = Capital employed × NRR",
          example: "Worked Example: Average profit ₹1,80,000, capital employed ₹12,00,000, NRR 10%. Normal profit = 12,00,000 × 0.10 = ₹1,20,000. Super profit = 1,80,000 − 1,20,000 = ₹60,000. Goodwill at three years' purchase = 60,000 × 3 = ₹1,80,000."
        },
        {
          h: "Capitalisation of Average Profit",
          p: "Ask what total capital would produce the average profit at the normal rate. That total is the firm's capitalised value. Subtract the capital actually employed and the remainder is goodwill, the value of the excess.",
          formula: "Goodwill = (Average profit ÷ NRR) − Capital employed",
          example: "Worked Example: Average profit ₹2,00,000, capital employed ₹20,00,000, NRR 8%. Capitalised value = 2,00,000 ÷ 0.08 = ₹25,00,000. Goodwill = 25,00,000 − 20,00,000 = ₹5,00,000."
        },
        {
          h: "Hidden Goodwill at Reconstitution",
          p: "When a problem never states goodwill but gives the new partner's capital for their share, goodwill is hidden inside the capital structure. Value the total capital of the reconstituted firm from the new share, subtract the new partners' net tangible assets, and the difference is the goodwill implied.",
          example: "Worked Example: A and B share 3:2. C is admitted for 1/5 with capital of ₹1,00,000 for that share. Total capital of the firm implied = 1,00,000 × 5 = ₹5,00,000. If the combined net tangible assets after reconstitution are ₹4,00,000, hidden goodwill = 5,00,000 − 4,00,000 = ₹1,00,000.",
          tip: "Exam Tip: hidden goodwill equals the total capital implied by the new share minus the actual net assets brought forward."
        },
        {
          h: "Reading Years' Purchase and Normal Rate",
          p: "Years' purchase is a given multiplier converting one year's surplus into a price, so three years' purchase means the buyer pays for three years of past super performance. The normal rate of return is the hurdle capital must clear in that line of business. Neither is guessed, both are stated, and doubling years' purchase doubles goodwill proportionally.",
          note: "Remember This: goodwill by the average profit method ignores capital size, so it can overstate value for a capital-heavy firm, while super profit corrects this by charging a normal return on capital."
        }
      ],
      mistakes: [
        "Recording self-generated goodwill as an asset in the balance sheet, against AS-26.",
        "Forgetting to deduct capital employed after capitalising average profit.",
        "Capitalising average profit when the question asks for super profit, so read the method named.",
        "Using the closing capital instead of capital employed, or forgetting to include long-term reserves.",
        "Treating years' purchase as a period of the firm's life rather than a multiplier of surplus."
      ],
      summary: [
        "Goodwill is the value of above-normal earning power, valued at admission, retirement, death, sale or amalgamation.",
        "AS-26 records only purchased goodwill, while self-generated goodwill is valued purely to settle partners.",
        "The average profit method values goodwill as average profit multiplied by years' purchase.",
        "Super profit is average profit minus normal profit, where normal profit is capital employed times the normal rate of return.",
        "Capitalisation of super profit divides super profit by the normal rate.",
        "Capitalisation of average profit divides average profit by the normal rate, then subtracts capital employed.",
        "Both capitalisation routes must agree because they are the same algebra."
      ],
      check: [
        { q: "Average profit ₹2,40,000, goodwill at three years' purchase. Find goodwill.", a: "2,40,000 × 3 = ₹7,20,000." },
        { q: "State the AS-26 position on internally generated goodwill at a partner's admission.", a: "It is not recorded as an asset; it is valued only to settle the partners' shares." },
        { q: "Super profit ₹45,000, normal rate 10%. Goodwill by capitalisation of super profit.", a: "45,000 ÷ 0.10 = ₹4,50,000." },
        { q: "When do the two capitalisation methods give the same goodwill?", a: "When they use consistent inputs, meaning the same average profit, capital employed and normal rate of return, because the two formulas are algebraically identical." }
      ]
    },
    psr: {
      intro: [
        "Change in Profit-Sharing Ratio studies what happens when existing partners agree a new profit-sharing ratio among themselves. No outsider enters or leaves, yet the firm is reconstituted, because the old agreement ends and a new one begins the moment the ratio moves.",
        "The chapter matters because it isolates the pure logic of sacrifice and gain. One partner gives up a slice of future profit and another picks it up, and everything the firm gained or lost under the old ratio must be settled before the new ratio governs anything.",
        "It connects to admission, retirement and death, which are the same mechanics triggered by an outsider arriving or a partner leaving. Revaluation, reserve distribution and goodwill compensation learned here reappear unchanged in those chapters."
      ],
      objectives: [
        "Compute the new profit-sharing ratio when partners revise their shares.",
        "Determine the sacrificing ratio and the gaining ratio.",
        "Explain why assets and liabilities are revalued at a change in ratio.",
        "Prepare a revaluation account and distribute its result in the old ratio.",
        "Distribute accumulated profits and losses among the old partners.",
        "Compute goodwill compensation using the sacrifice and gain figures."
      ],
      blocks: [
        {
          h: "New Ratio, Sacrifice and Gain",
          p: "The new ratio is either stated or computed from what each partner surrenders. A partner may give up a fraction of their own share, which then goes to the others, usually in their existing ratio. Old ratio minus new ratio gives sacrifice, while new ratio minus old ratio gives gain, and the two always offset.",
          formula: "New share = Old share − Surrendered portion\nSacrifice = Old ratio − New ratio\nGaining ratio = New ratio − Old ratio",
          example: "Worked Example: A and B share 3:2. A surrenders one-fifth of his share to B. A gives away 1/5 × 3/5 = 3/25. New A = 15/25 − 3/25 = 12/25; new B = 10/25 + 3/25 = 13/25. The new ratio is 12:13.",
          simple: "In Simple Words: sacrifice is what a partner hands over, while gain is what the other picks up, which is the same slice seen from two sides."
        },
        {
          h: "Why Revalue at All",
          p: "A building bought years ago may now be worth far more, while stock may have lost value. Those movements belong to the period the old ratio governed. If they were left in the books, the gaining partner would inherit years of appreciation they did nothing to earn. Revaluation fixes this by restating assets and liabilities and sending the result to the old partners in the old ratio.",
          note: "Remember This: revaluation profit or loss always goes to the OLD ratio, never the new one.",
          confusion: {
            a: "Revaluation account", aText: "A nominal account restating assets and liabilities to current values, whose result goes to old partners in the old ratio.",
            b: "General reserve", bText: "An accumulated past profit already sitting in the books, distributed to old partners in the old ratio.",
            diff: "Revaluation creates a fresh gain or loss from value movements, while a reserve divides a profit already earned and recorded."
          }
        },
        {
          h: "Reserves, Accumulated Profits and Losses",
          p: "General reserve, reserve fund, investments fluctuation fund and credit profit-and-loss balances are undistributed past profits of the old agreement. They are shared among the old partners in the old ratio. Accumulated losses and debit profit-and-loss balances are debited to them the same way. Nothing accumulated survives into the new agreement untouched.",
          list: [
            { term: "Accumulated profits", def: "General reserve, reserve fund, investments fluctuation fund, credit P and L balance, all credited to old partners in the old ratio." },
            { term: "Accumulated losses", def: "Debit profit-and-loss balance, debited to old partners in the old ratio." },
            { term: "Old goodwill in books", def: "Written off among old partners in the old ratio before fresh goodwill is valued." }
          ]
        }
      ],
      advBlocks: [
        {
          h: "The Revaluation Account, Step by Step",
          p: "Open a nominal revaluation account. Debit falls in asset values, rises in liabilities and any fictitious assets written off. Credit rises in asset values and falls in liabilities. The balance, profit or loss, transfers to the old partners in the old ratio. The revised balance sheet then shows every item at its new value.",
          formula: "Revaluation profit = (Rises in assets + Falls in liabilities) − (Falls in assets + Rises in liabilities)",
          example: "Worked Example: Building rises ₹20,000; machinery falls ₹15,000; creditors rise ₹4,000. Revaluation profit = 20,000 − (15,000 + 4,000) = ₹1,000, credited to old partners in the old ratio."
        },
        {
          h: "Goodwill Compensation at a Pure Ratio Change",
          p: "At a change between existing partners, the gaining partner compensates the sacrificing partner for their share of the firm's valued goodwill. Compute the gain and sacrifice fractions, apply the firm's goodwill, and the gaining partner pays the sacrificer. The compensation is the price of the future share bought.",
          example: "Worked Example: Partners move from 3:2 to 5:4. A sacrifices 27/45 − 25/45 = 2/45 and B gains 2/45. Firm goodwill ₹4,50,000. Compensation = 4,50,000 × 2/45 = ₹20,000, paid by B to A.",
          confusion: {
            a: "Gaining ratio", aText: "New minus old for the partner who picks up share, and they pay the goodwill compensation.",
            b: "Sacrificing ratio", bText: "Old minus new for the partner who gives up share, and they receive the goodwill compensation.",
            diff: "The payer is always the gainer and the payee always the sacrificer, so reversing this direction is the commonest error."
          }
        },
        {
          h: "The Revised Balance Sheet",
          p: "After the change, draw a fresh balance sheet: every asset and liability at its revalued figure, no reserves or accumulated losses left standing, no old goodwill, and partners' capitals carrying their share of the revaluation and distributions. Each line should trace back to a decision already taken.",
          tip: "Exam Tip: if the revised balance sheet still shows a reserve or old goodwill, something has been missed, because those must be cleared before the new ratio operates."
        },
        {
          h: "Surrender of a Fraction Versus a Fixed Amount",
          p: "Partners may surrender a fraction of their share, or a fixed number of shares, or be guaranteed against loss. The surrender-of-fraction route multiplies the fraction by the old share, while a fixed-fraction new ratio is simply stated. Always reduce to a common denominator before comparing, so the sacrifice and gain are visible.",
          example: "Worked Example: A partner surrenders 1/4 of their 2/3 share. Surrender = 1/4 × 2/3 = 1/6. That partner keeps 2/3 − 1/6 = 4/6 − 1/6 = 3/6. The other partner, starting at 1/3, gains 1/6 to reach 2/6 + 1/6 = 3/6. The new ratio is 1:1."
        }
      ],
      mistakes: [
        "Dividing revaluation profit in the new ratio instead of the old ratio.",
        "Sharing accumulated reserves in the new ratio, when they belong to the old agreement only.",
        "Forgetting that a partner's gain is another's sacrifice, so all gains and sacrifices must net to zero.",
        "Valuing fresh goodwill without first writing off any old goodwill already in the books.",
        "Applying the goodwill compensation in the old ratio instead of the gaining and sacrificing ratio.",
        "Leaving reserves or accumulated losses standing in the revised balance sheet."
      ],
      summary: [
        "A change in profit-sharing ratio reconstitutes the firm even though no partner enters or leaves.",
        "New share equals old share minus the surrendered portion, while sacrifice is old minus new and gain is new minus old.",
        "Gains and sacrifices always net to zero across the partners.",
        "Revaluation restates assets and liabilities, and its profit or loss goes to old partners in the old ratio.",
        "Accumulated profits and losses are distributed to old partners in the old ratio.",
        "The gaining partner compensates the sacrificing partner for their share of the firm's goodwill.",
        "The revised balance sheet shows revalued figures with reserves and old goodwill cleared."
      ],
      check: [
        { q: "A and B move from 3:2 to 1:1. State the sacrifice or gain for each.", a: "A sacrifices 3/5 − 1/2 = 1/10, while B gains 2/5 − 1/2 = a gain of 1/10." },
        { q: "Firm goodwill ₹2,00,000 at the 3:2 to 1:1 change. What is the compensation?", a: "2,00,000 × 1/10 = ₹20,000, paid by B to A." },
        { q: "True or false: at a ratio change, revaluation profit is shared in the new ratio.", a: "False. It is shared in the old ratio, because the gain accrued under the old agreement." },
        { q: "A partner surrenders 1/4 of a 2/3 share. What is the new ratio with the other partner?", a: "Surrender is 1/6, so the first partner holds 3/6 and the second 3/6, giving a new ratio of 1:1." }
      ]
    },
    adm: {
      intro: [
        "Admission of a Partner handles the arrival of a newcomer who buys a share of future profits and reconstitutes the firm. Three tasks must be completed before the new ratio governs anything: the new ratio and sacrificing ratio are computed, assets and liabilities are restated, and accumulated profits, reserves and old goodwill are settled with the old partners.",
        "It matters because it is the most examined reconstitution event and the template for retirement and death. Master the sequence here and the later chapters reuse it.",
        "It connects the goodwill valuation of the earlier chapter to the sacrifice and gain logic of a ratio change, now triggered from outside rather than within."
      ],
      objectives: [
        "Compute the new profit-sharing ratio on admission.",
        "Determine the sacrificing ratio and use it to share goodwill compensation.",
        "Prepare a revaluation account and share its result in the old ratio.",
        "Distribute reserves and accumulated losses to old partners.",
        "Adjust the new partner's share of goodwill in cash or through capital accounts.",
        "Restructure total capital in the new profit-sharing ratio."
      ],
      blocks: [
        {
          h: "New Ratio and Sacrificing Ratio on Admission",
          p: "When a new partner is admitted for a fraction of future profits, the remaining profit is split between the old partners, usually in their old ratio. Old ratio minus new ratio gives each old partner's sacrifice, and that sacrificing ratio decides who receives the goodwill compensation.",
          formula: "New share of old partner = (1 − New partner's share) × Old ratio fraction\nSacrifice = Old ratio − New ratio",
          example: "Worked Example: A and B share 3:2. C is admitted for 1/5, with the remainder shared in the old ratio. Remainder = 4/5. A = 4/5 × 3/5 = 12/25; B = 4/5 × 2/5 = 8/25; C = 5/25. The new ratio is 12:8:5. A sacrifices 15/25 − 12/25 = 3/25, B sacrifices 10/25 − 8/25 = 2/25, so the sacrificing ratio is 3:2.",
          simple: "In Simple Words: the newcomer's slice is carved out of the old partners' shares, and the sacrificing ratio records exactly how the carving was done."
        },
        {
          h: "The Revaluation Account at Admission",
          p: "A nominal account opened at admission. Debit side: falls in asset values, rises in liabilities, fictitious assets written off. Credit side: rises in asset values, falls in liabilities. The balance goes to the old partners in the old ratio, because the movement happened while they owned the firm.",
          formula: "Revaluation profit = (Rises in assets + Falls in liabilities) − (Falls in assets + Rises in liabilities)",
          confusion: {
            a: "Revaluation profit", aText: "Shared among old partners in the old ratio, and the new partner has no claim on it.",
            b: "Goodwill compensation", bText: "Funded by the new partner and credited in the sacrificing ratio.",
            diff: "Revaluation belongs to the past under the old ratio, while goodwill compensation is the newcomer buying future share from the sacrificers."
          }
        },
        {
          h: "Goodwill at Admission, the Premium Method",
          p: "The new partner brings cash for their share of the firm's goodwill, which is credited to the sacrificing partners in the sacrificing ratio. If goodwill already sits in the books, the old partners first write it off among themselves in the old ratio, so the same reputation is never counted twice.",
          example: "Worked Example: Firm goodwill ₹1,00,000; C admitted for 1/5 and brings goodwill in cash, with a sacrificing ratio of 3:2. C brings 1,00,000 × 1/5 = ₹20,000. A receives 20,000 × 3/5 = ₹12,000; B receives 20,000 × 2/5 = ₹8,000.",
          note: "Remember This: under AS-26 only purchased goodwill is recorded, while self-generated goodwill is valued purely to settle partners, never shown as a fresh asset."
        }
      ],
      advBlocks: [
        {
          h: "Goodwill Adjusted Without Cash",
          p: "When the problem says goodwill is not to be brought in cash, the mechanism is the same but runs through capital accounts. Debit the new partner for their share of the firm's goodwill and credit the sacrificing partners in the sacrificing ratio, all inside the capital accounts.",
          example: "Worked Example: Firm goodwill ₹90,000; C admitted for 1/5, not bringing goodwill in cash, with a sacrificing ratio of 3:2. C's share = 90,000 × 1/5 = ₹18,000. The entry is C's Capital A/c Dr ₹18,000 to A's Capital A/c ₹10,800 to B's Capital A/c ₹7,200. Check: 10,800 + 7,200 = ₹18,000, and 90,000 × 3/25 = 10,800, 90,000 × 2/25 = 7,200."
        },
        {
          h: "Capital Adjustment at Admission",
          p: "The firm fixes the total capital of the reconstituted business, often by capitalising the new profit or taking a multiple of the new partner's share, and expresses it in the new ratio. Each partner's capital is then adjusted by bringing in cash or paying out the excess, so the balance sheet opens with the agreed structure.",
          formula: "Partner's capital = Total capital of the firm × Partner's new share",
          example: "Worked Example: C admitted for 1/5 brings ₹1,00,000 for that share, implying total capital of 1,00,000 × 5 = ₹5,00,000. In the new ratio 12:8:5, A's capital = 5,00,000 × 12/25 = ₹2,40,000 and B's = 5,00,000 × 8/25 = ₹1,60,000, with C keeping ₹1,00,000. Total 2,40,000 + 1,60,000 + 1,00,000 = ₹5,00,000."
        },
        {
          h: "The Revised Balance Sheet",
          p: "Drawn immediately after admission: assets and liabilities at revalued figures, no reserves or accumulated losses left, no old goodwill, and partners' capitals in the new structure. When the new partner brings in an asset or takes over a liability, those enter at agreed values alongside the revaluation.",
          tip: "Exam Tip: every figure in the revised balance sheet should be traceable to revaluation, distribution, write-off or cash brought in, so if you cannot trace it, revisit your entries."
        },
        {
          h: "Revaluation With Fictitious Assets and Specific Adjustments",
          p: "Fictitious assets such as accumulated losses, goodwill already written down or deferred advertisement expenses are written off at admission through the revaluation account, debiting revaluation and reducing the old partners in the old ratio. A specific asset may be transferred to the new partner at an agreed value rather than revalued.",
          example: "Worked Example: Old partners share 3:2. A debit balance of profit and loss of ₹25,000 is written off through revaluation. This is a revaluation loss shared in the old ratio: A bears 25,000 × 3/5 = ₹15,000 and B bears 25,000 × 2/5 = ₹10,000, reducing their capitals."
        }
      ],
      mistakes: [
        "Sharing revaluation profit in the new ratio instead of the old ratio.",
        "Forgetting that the new partner has no claim on revaluation profit.",
        "Crediting goodwill compensation in the old ratio rather than the sacrificing ratio.",
        "Failing to write off old goodwill already in the books before valuing fresh goodwill.",
        "Treating the goodwill brought in cash as firm income instead of compensation for sacrifice.",
        "Leaving reserves standing instead of distributing them to old partners in the old ratio."
      ],
      summary: [
        "Admission reconstitutes the firm, and the new ratio, sacrificing ratio, revaluation and goodwill settlement all precede the new agreement.",
        "New share equals the remainder after the newcomer's fraction, usually split in the old ratio.",
        "Sacrificing ratio equals old ratio minus new ratio and drives goodwill compensation.",
        "Revaluation restates assets and liabilities, and its profit or loss goes to old partners in the old ratio.",
        "The new partner funds their share of goodwill, credited to sacrificers in the sacrificing ratio.",
        "Old goodwill in books is written off among old partners in the old ratio first.",
        "Total capital is restructured in the new profit-sharing ratio."
      ],
      check: [
        { q: "A and B share 3:2, and C is admitted for 1/5. Find the new ratio.", a: "A 12/25, B 8/25, C 5/25, so the ratio is 12:8:5." },
        { q: "Firm goodwill ₹1,00,000; C brings 1/5 in cash; sacrificing ratio 3:2. What does A receive?", a: "C brings ₹20,000, and A receives 20,000 × 3/5 = ₹12,000." },
        { q: "True or false: the new partner shares in revaluation profit.", a: "False. Revaluation belongs to the old agreement, so it goes to old partners in the old ratio." },
        { q: "C is admitted for 1/5 and brings ₹1,00,000 for that share. What is the implied total capital?", a: "1,00,000 × 5 = ₹5,00,000." }
      ]
    },
    ret: {
      intro: [
        "Retirement and Death of a Partner covers the departure of a partner from a continuing firm, whether by choice or by death. The outgoing partner must be settled in full: capital, share of reserves, share of revaluation profit and compensation for their share of goodwill. If the firm does not pay at once, the total stands as a loan.",
        "It matters because it tests the gaining ratio in its clearest form: the continuing partners buy the departing share and must fund the goodwill compensation in that proportion.",
        "It connects to admission's revaluation and goodwill logic, adding two new ideas, namely the loan account of the retiring partner and, on death, the estimate of profit up to the date of death on a time or product basis."
      ],
      objectives: [
        "Compute the gaining ratio of the continuing partners on retirement.",
        "Settle the outgoing partner's account including reserves, revaluation and goodwill.",
        "Carry the unpaid settlement as a loan to the retiring partner.",
        "Estimate a deceased partner's share of profit up to the date of death.",
        "Distinguish the time basis from the product basis of profit estimation.",
        "Prepare a revised balance sheet after retirement."
      ],
      blocks: [
        {
          h: "The Outgoing Partner's Entitlements",
          p: "On retirement the outgoing partner's account gathers everything owed: the adjusted capital balance, share of reserves and accumulated profits, share of revaluation profit, and compensation for their share of goodwill. If the firm does not pay immediately, the total stands as a loan and the partner becomes a creditor.",
          list: [
            { term: "Gaining ratio", def: "New ratio minus old ratio of the continuing partners, showing who took the departing share and in what proportion they pay." },
            { term: "Loan of the retiring partner", def: "The unpaid settlement carried as a firm liability until paid." },
            { term: "Executor's account", def: "Receives a deceased partner's dues before payment to the legal heirs." }
          ],
          simple: "In Simple Words: the departing partner takes one last cheque that bundles capital, reserves, revaluation share and goodwill compensation."
        },
        {
          h: "Goodwill Compensation by the Gainers",
          p: "The departing partner's share of the firm's goodwill is funded by the continuing partners in the gaining ratio, because they are the ones buying the outgoing share of future profits. The entry credits the outgoing partner and debits the gainers in exactly that proportion.",
          formula: "Outgoing partner's goodwill share = Firm goodwill × Outgoing partner's profit share, paid by gainers in the gaining ratio",
          example: "Worked Example: A, B and C share 3:2:1. C retires and A and B continue as 3:2. Firm goodwill ₹1,20,000. C's share = 1,20,000 × 1/6 = ₹20,000, paid by A and B in the gaining ratio 3:2, which is A ₹12,000 and B ₹8,000."
        },
        {
          h: "Share of Profit Up to the Date of Death",
          p: "When a partner dies mid-year, their share of profit for the part-year is estimated and credited. The time basis uses the last year's or average profit multiplied by the fraction of the year and the partner's share, suited to steady profits. The product basis weights each period's profit by the months it lasted, suited to fluctuating profits.",
          formula: "Time basis: Profit × (months ÷ 12) × share\nProduct basis: Σ(profit × months) ÷ total months × share",
          confusion: {
            a: "Time basis", aText: "Uses one profit figure for the whole period, scaled by the months elapsed, and suits stable profits.",
            b: "Product basis", bText: "Weights each period's profit by the months it covered, then averages, and suits fluctuating profits.",
            diff: "Choose the time basis when profits are steady and the product basis when they moved materially during the year."
          }
        }
      ],
      advBlocks: [
        {
          h: "The Settlement Sequence in Full",
          p: "Every item flows into the outgoing partner's account: capital balance, reserves in the old ratio, revaluation in the old ratio, goodwill compensation in the gaining ratio and, for a death, profit up to the date of death. The total is paid in cash or carried as a loan. For a deceased partner the same list flows to the executor's account.",
          example: "Worked Example: C's capital ₹3,00,000, share of General Reserve 1/6 of ₹2,40,000 = ₹40,000, share of revaluation profit 1/6 of ₹60,000 = ₹10,000, and goodwill compensation ₹30,000. Total settlement = 3,00,000 + 40,000 + 10,000 + 30,000 = ₹3,80,000, carried as a loan if unpaid."
        },
        {
          h: "Product-Basis Death Profit, Line by Line",
          p: "Split the year into segments where profit was roughly constant. Multiply each segment's profit by the months it covered, add the products for the months up to death, divide by the months counted, and apply the deceased's share. A three-month patch of high profit carries exactly three months of weight.",
          example: "Worked Example: April to June, 3 months, profit ₹90,000, product 2,70,000. July to September up to death, 3 months, profit ₹1,50,000, product 4,50,000. Total 6 months, product 7,20,000. Weighted average = 7,20,000 ÷ 6 = ₹1,20,000. Deceased's share 1/4 × 1,20,000 = ₹30,000.",
          tip: "Exam Tip: weight by the months actually elapsed up to death, not by the number of periods."
        },
        {
          h: "Revised Balance Sheet After Retirement",
          p: "Reserves are distributed, existing goodwill is written off by old partners in the old ratio, the outgoing partner's capital and compensation are removed and replaced by a loan if unpaid, and the continuing capitals reflect the new structure at revalued figures.",
          note: "Remember This: the retiring partner's loan appears as a liability, separate from outside liabilities, because the partner no longer shares profit."
        },
        {
          h: "Death Paired With a Guarantee or Loan Interest",
          p: "A deceased partner may also be owed interest on a loan to the firm, which is a charge and accrues to the date of death, or be covered by a profit guarantee. Add the accrued interest and any guarantee shortfall to the settlement alongside the part-year profit estimate.",
          example: "Worked Example: The deceased partner lent ₹60,000 at 6% per annum, and six months elapse to death. Accrued interest = 60,000 × 0.06 × 6/12 = ₹1,800, added to the executor's account before the loan or settlement is computed."
        }
      ],
      mistakes: [
        "Paying goodwill compensation in the old ratio instead of the gaining ratio of the continuing partners.",
        "Forgetting the direction, because gainers pay and so are debited while the outgoing partner is credited.",
        "Using the wrong basis for death profit, namely time when profits fluctuated or product when they were even.",
        "Weighting each period equally in the product basis instead of by the months it covered.",
        "Leaving the outgoing partner's capital account open instead of closing it into a loan.",
        "Sharing the departing partner's revaluation profit in the new ratio rather than the old ratio."
      ],
      summary: [
        "The outgoing partner is settled with capital, reserves, revaluation share and goodwill compensation.",
        "Gaining ratio equals new minus old ratio of continuing partners and decides who funds goodwill.",
        "The outgoing partner's goodwill share is firm goodwill multiplied by their profit share.",
        "An unpaid settlement becomes a loan to the retiring partner, a liability of the firm.",
        "On death, part-year profit is estimated on a time basis for steady profits or a product basis for fluctuating profits.",
        "The product basis weights each period's profit by the months it covered.",
        "For a deceased partner the settlement flows to the executor's account before payment to heirs."
      ],
      check: [
        { q: "A, B and C share 3:2:1; C retires and A and B continue 3:2. State the gaining ratio.", a: "A gains 3/5 − 3/6 = 1/10 and B gains 2/5 − 2/6 = 1/15, giving a gaining ratio of 3:2." },
        { q: "Firm goodwill ₹1,20,000 in the above retirement. What is C's goodwill compensation?", a: "C's share = 1,20,000 × 1/6 = ₹20,000, paid by A and B in the gaining ratio 3:2, which is A ₹12,000 and B ₹8,000." },
        { q: "State the formula for the product basis of a deceased partner's profit share.", a: "Sum of profit times months for each period divided by total months, then multiplied by the partner's share." },
        { q: "An unpaid settlement to a retiring partner is shown as what?", a: "A loan account of the retiring partner, a liability of the firm, until it is paid." }
      ]
    },
    dis: {
      intro: [
        "Dissolution of a Partnership Firm studies the winding up of the business itself: assets are realised, liabilities paid, expenses met and the surplus divided among the partners. The realisation account is the single nominal account that converts everything into cash terms and measures the final profit or loss.",
        "It matters because it is the one chapter where the firm ceases to exist, so every rule of settlement and the statutory order of payment are tested directly.",
        "It connects to the capital accounts of the fundamentals chapter and to the revaluation logic of reconstitution, but replaces the going-concern assumption with a liquidation one."
      ],
      objectives: [
        "Distinguish dissolution of partnership from dissolution of the firm.",
        "Explain the modes of dissolution recognised for a partnership firm.",
        "Prepare a realisation account and compute the profit or loss.",
        "Identify the items that never enter the realisation account.",
        "Apply the statutory order of payment from available cash.",
        "Settle partners' capital and close the cash account."
      ],
      blocks: [
        {
          h: "Dissolution of Partnership vs Dissolution of Firm",
          p: "Dissolution of partnership changes the constitution, as a partner leaves and the deed is rewritten while the business carries on. Dissolution of firm ends the business itself. Unless the partners agree otherwise, dissolution of the partnership between all partners amounts to dissolution of the firm.",
          list: [
            { term: "Dissolution by agreement", def: "All partners mutually agree to wind up the firm." },
            { term: "Dissolution by court", def: "Ordered by the court on grounds such as a partner becoming of unsound mind or persistent misconduct." },
            { term: "Realisation account", def: "The nominal account opened at dissolution to convert assets and liabilities into cash and measure the final result." }
          ]
        },
        {
          h: "The Realisation Account",
          p: "Debit side: assets transferred at book value, cash and bank excluded, followed by the liabilities actually paid and the expenses of dissolution. Credit side: liabilities transferred at book value, followed by the cash realised from each asset. The difference, profit or loss, is shared between the partners in the profit-sharing ratio.",
          formula: "Profit or loss on realisation = (Assets realised + Liabilities transferred) − (Assets transferred + Liabilities paid + Expenses)",
          simple: "In Simple Words: everything the firm owned and owed is parked in one account so the winding-up gain or loss can be read off in a single figure."
        },
        {
          h: "What Never Enters Realisation",
          p: "Cash and bank balances stay out, because they are the pot being divided and not an asset to be realised. A partner's loan to the firm is settled separately as a creditor's claim. Amounts due from or to partners on other accounts are adjusted directly against capital or loan accounts. Only third-party assets and liabilities drive realisation.",
          confusion: {
            a: "Realisation account", aText: "Holds third-party assets and liabilities at book value and measures the winding-up result.",
            b: "Cash or bank account", bText: "Holds the actual money and is the final pot divided among claimants.",
            diff: "Realisation measures the gain or loss, while cash is what is finally paid out in statutory order."
          }
        }
      ],
      advBlocks: [
        {
          h: "Reading the Realisation Result",
          p: "A gain on liabilities, by paying less than book, and a gain on assets, by realising above book, both push the result towards profit, while write-downs and expenses push towards loss. Rather than memorising sides, total both columns and compare.",
          example: "Worked Example: Assets of ₹2,00,000 realised ₹1,75,000; liabilities of ₹80,000 paid ₹78,000; expenses ₹7,000. Credits = 1,75,000 + 80,000 = ₹2,55,000. Debits = 2,00,000 + 78,000 + 7,000 = ₹2,85,000. The loss = 2,85,000 − 2,55,000 = ₹30,000, shared 3:2 as A ₹18,000 and B ₹12,000."
        },
        {
          h: "The Order of Payment From Available Cash",
          p: "Cash is applied in statutory order: realisation expenses first, then any amount due to partners for their loans, then outside liabilities, and only the surplus reaches partners' capital accounts, which already carry reserves and their share of the realisation result. The cash account closes at exactly zero.",
          formula: "Order: Realisation expenses → Partners' loans → Outside liabilities → Partners' capital",
          tip: "Exam Tip: partners' capital is paid last, from the surplus that remains after realisation expenses, partners' loans and outside liabilities are settled."
        },
        {
          h: "The Final Division, Line by Line",
          p: "Close every account into partners' capital: distribute reserves in the profit-sharing ratio, add the share of realisation profit or deduct the loss, then pay each partner their balance from the available cash after all prior claims. What remains in the capital accounts after payment is zero by construction.",
          example: "Worked Example: After the ₹30,000 loss above, partners share 3:2. If A's capital was ₹1,50,000 and B's ₹1,00,000 with no reserve, A bears ₹18,000 and B bears ₹12,000, leaving A ₹1,32,000 and B ₹88,000 to be paid from cash."
        },
        {
          h: "Assets Taken Over and Liabilities Discharged",
          p: "Sometimes a partner takes an asset at an agreed value, or a creditor accepts less than full settlement. Both are recorded inside realisation: the asset side is credited at the agreed value and the partner's capital debited, while a liability settled for less creates a gain on the credit of realisation.",
          example: "Worked Example: Machinery of book value ₹50,000 is taken over by partner A at ₹40,000. Realisation is credited with ₹40,000 for machinery and A's capital is debited ₹40,000. The ₹10,000 shortfall forms part of the overall realisation result."
        }
      ],
      mistakes: [
        "Transferring cash or bank balances to the realisation account, when they must stay out.",
        "Forgetting that partners' loans to the firm are settled separately, not through realisation.",
        "Sharing the realisation profit or loss in anything other than the profit-sharing ratio.",
        "Paying partners their capital before outside liabilities or realisation expenses.",
        "Settling a liability at book value instead of the amount actually paid, which distorts the result.",
        "Leaving the cash account with a balance instead of closing it at zero."
      ],
      summary: [
        "Dissolution of the firm ends the business, while dissolution of partnership alone may leave it running.",
        "The realisation account is nominal and holds third-party assets and liabilities at book value.",
        "Assets realised and liabilities paid are recorded inside realisation, while cash and bank stay out.",
        "The profit or loss on realisation is shared in the profit-sharing ratio.",
        "Partners' loans are settled separately from realisation.",
        "Cash is applied in the statutory order, with partners' capital paid last from the surplus.",
        "The cash account always closes at exactly zero."
      ],
      check: [
        { q: "On dissolution, assets of book value ₹2,00,000 realised ₹1,75,000, liabilities of ₹80,000 paid ₹78,000, expenses ₹7,000. Profit or loss?", a: "Credits 2,55,000 and debits 2,85,000, so there is a loss of ₹30,000." },
        { q: "True or false: cash at bank is transferred to the realisation account.", a: "False. Cash and bank balances are never transferred, because they are the pot divided at the end." },
        { q: "Which item is settled outside the realisation account?", a: "A partner's loan to the firm, which is a creditor claim settled separately." },
        { q: "Who is paid last from available cash at dissolution?", a: "The partners, from their capital balances, after realisation expenses, partners' loans and outside liabilities." }
      ]
    },
    sc: {
      intro: [
        "Accounting for Share Capital introduces company accounts: how a company offers shares, collects money in instalments, handles over- and under-subscription, and deals with premium, forfeiture and reissue. It is the first heavy journal-entry chapter of the second part of the course.",
        "It matters because share capital is the backbone of a company's balance sheet, and the Companies Act discipline around it is examined every year through journal entries and balance-sheet presentation.",
        "It connects to debentures, where the same instalment rhythm appears for debt instead of equity, and to the financial statements chapter, where share capital and securities premium reserve appear under shareholders' funds."
      ],
      objectives: [
        "Distinguish authorised, issued, subscribed, called-up and paid-up capital.",
        "Record the issue of shares at par and at premium, and account for over- and under-subscription.",
        "Account for calls in advance and calls in arrears.",
        "Record the forfeiture of shares and their subsequent reissue.",
        "Compute the capital reserve arising on reissue.",
        "Explain the use and restriction of the securities premium reserve."
      ],
      blocks: [
        {
          h: "The Capital Ladder",
          p: "A company's capital passes through five figures, each a subset of the one before. Authorised capital is the maximum permitted. Issued capital is what is offered. Subscribed capital is what investors apply for and the company accepts. Called-up capital is what has been demanded so far. Paid-up capital is what has actually been received.",
          list: [
            { term: "Authorised capital", def: "The maximum share capital the company may issue, shown on the balance sheet face." },
            { term: "Issued capital", def: "The portion offered to the public for subscription." },
            { term: "Subscribed capital", def: "The part applied for and accepted." },
            { term: "Called-up capital", def: "The portion of subscribed capital demanded so far." },
            { term: "Paid-up capital", def: "Called-up capital less calls in arrears." }
          ],
          simple: "In Simple Words: each step is a smaller slice of the one above, a funnel from what is allowed to what is actually in the bank."
        },
        {
          h: "Issuing Shares, Par, Premium and Instalments",
          p: "Shares are payable in instalments: application money first, then allotment, then calls. Shares may be issued at par, at a premium above face value, or at a discount in the specific statutory cases. The premium is credited to the securities premium reserve and may be used only for the purposes the law lists.",
          formula: "Application money = Shares applied × Application rate per share\nPremium = Issue price − Face value",
          note: "Remember This: securities premium reserve may fund bonus shares and premium on future redemption, but never write down losses or pay dividend."
        },
        {
          h: "Over-Subscription, Under-Subscription, Arrears and Advances",
          p: "When applications exceed the offer, the excess is rejected or partly accepted and the surplus returned. When they fall short and the minimum subscription is not met, the issue fails. Late payers leave calls in arrears, while early payers leave calls in advance. Neither carries interest in this course.",
          confusion: {
            a: "Calls in arrears", aText: "Amount unpaid after a call is made, a receivable of the company.",
            b: "Calls in advance", bText: "Amount received before the corresponding call is due, a liability until that call is made.",
            diff: "Arrears reduce paid-up capital, while advance is transferred to the call account only when that call becomes due."
          }
        }
      ],
      advBlocks: [
        {
          h: "Forfeiture of Shares",
          p: "When a shareholder fails to pay a call despite notice, the company may forfeit the shares, cancelling their rights and moving everything already paid to the share forfeited account. Share capital is debited only up to the called-up amount, never to face value, because uncalled capital was never demanded.",
          formula: "Share Capital A/c Dr — called-up capital only\nShare Forfeited A/c Dr — amount actually paid\nTo Share Allotment or Calls A/c — amount unpaid",
          example: "Worked Example: 1,000 shares of ₹10, fully called, with ₹6 paid. On forfeiture, share capital is debited 1,000 × 10 = ₹10,000, share forfeited is debited 1,000 × 6 = ₹6,000, and the calls account is credited 1,000 × 4 = ₹4,000 for the amount unpaid. Check: 6,000 + 4,000 = ₹10,000."
        },
        {
          h: "Reissue and the Capital Reserve",
          p: "On reissue, any discount allowed is adjusted against the forfeited amount of those specific shares. Whatever forfeited balance remains unused after reissue is transferred to the capital reserve. Only the forfeited amount relating to reissued shares, less the reissue discount, reaches capital reserve.",
          formula: "Capital reserve on reissue = Amount forfeited on reissued shares − Discount allowed on reissue",
          example: "Worked Example: 1,000 shares of ₹10 forfeited with ₹6 paid each, so ₹6,000 sits in share forfeited. Reissue 500 of them at ₹8, a discount of ₹2. Discount used = 500 × 2 = ₹1,000. Capital reserve on this reissue = (500 × 6) − 1,000 = 3,000 − 1,000 = ₹2,000. The remaining 500 reissued at ₹10 with no discount add their full 500 × 6 = ₹3,000, so total capital reserve = 2,000 + 3,000 = ₹5,000.",
          tip: "Exam Tip: capital reserve arises only on reissue, and only on the forfeited amount of the reissued shares, never on shares still held forfeited."
        },
        {
          h: "The Issue Entry Rhythm",
          p: "Every stage has its own pair. Application money is held in share application until allotment, then transferred to share capital. Allotment and each call are first made due, debiting the receivable and crediting capital, then received. Nothing is transferred to capital before it is called.",
          example: "Worked Example: 20,000 shares of ₹10 at a premium of ₹2, with application ₹4, allotment ₹5 including premium, and first call ₹3. Application received = 20,000 × 4 = ₹80,000. Allotment due = 20,000 × 5 = ₹1,00,000, of which the premium is 20,000 × 2 = ₹40,000. First call due = 20,000 × 3 = ₹60,000. Check: 4 + 5 + 3 = ₹12, which is face 10 plus premium 2."
        },
        {
          h: "Other Routes Into Share Capital",
          p: "Shares may be issued for consideration other than cash, to a vendor supplying assets at an agreed value. Private placement allots to selected persons without a public issue. Sweat equity shares are issued to employees or directors at a special price for their skill or contribution, and an employees' stock option plan grants the right to buy at a predetermined price.",
          note: "Remember This: whichever route is used, the same capital and premium credits result, and only the consideration differs."
        }
      ],
      mistakes: [
        "Debiting share capital to face value on forfeiture instead of the called-up amount.",
        "Forgetting that capital reserve arises only on reissue, not on forfeiture.",
        "Using the total forfeited amount rather than only the forfeited amount of the reissued shares to compute capital reserve.",
        "Crediting the securities premium reserve for purposes the law does not allow, such as writing off losses.",
        "Transferring application money to share capital before allotment is made.",
        "Treating calls in advance as transferred to the call account immediately rather than when the call becomes due."
      ],
      summary: [
        "Authorised, issued, subscribed, called-up and paid-up capital form a funnel of decreasing size.",
        "Shares may be issued at par or premium and collected in instalments of application, allotment and calls.",
        "Securities premium reserve is restricted to the purposes the Companies Act lists.",
        "Over-subscription is met by rejection or pro-rata allotment, while under-subscription can fail the minimum requirement.",
        "Forfeiture debits share capital to the called-up amount and credits the share forfeited account with the amount paid.",
        "Reissue adjusts any discount against the forfeited amount of those shares.",
        "Capital reserve equals forfeited amount on reissued shares less the reissue discount."
      ],
      check: [
        { q: "1,000 shares of ₹10 fully called, with ₹6 paid, are forfeited. State the amounts debited and credited.", a: "Share Capital Dr ₹10,000, Share Forfeited Dr ₹6,000, to Calls or Allotment Cr ₹4,000." },
        { q: "Of these, 500 are reissued at ₹8. Find the capital reserve on this reissue.", a: "Forfeited on reissued shares = 500 × 6 = ₹3,000; discount = 500 × 2 = ₹1,000; capital reserve = ₹2,000." },
        { q: "Can securities premium reserve be used to write off a loss?", a: "No. It may be used only for permitted purposes such as issuing bonus shares or providing for premium on future redemption." },
        { q: "Define paid-up capital.", a: "The portion of called-up capital actually received, that is called-up capital less calls in arrears." }
      ]
    },
    deb: {
      intro: [
        "Accounting for Debentures mirrors share capital but for debt. A debenture is a certificate acknowledging a company's debt at a fixed rate of interest payable whether or not the company earns profit. Holders are creditors, not owners, and rank ahead of shareholders on winding up.",
        "It matters because debenture issues, interest, redemption and the writing off of loss on issue are examined every year, and because interest on debentures is a finance cost that behaves very differently from dividend.",
        "It connects to share capital through the shared instalment rhythm and to the financial statements chapter, where debentures appear as long-term borrowings and interest as a charge in the statement of profit and loss."
      ],
      objectives: [
        "Distinguish the main types of debentures.",
        "Record the issue of debentures at par, premium and discount.",
        "Compute and record interest on debentures.",
        "Explain and write off the loss on issue.",
        "Account for debentures issued as collateral security.",
        "Differentiate debentures from shares."
      ],
      blocks: [
        {
          h: "What a Debenture Is and Its Types",
          p: "A debenture acknowledges a debt carrying a fixed rate of interest. Debenture holders are creditors. Debentures may be secured by a charge on assets, unsecured, registered and transferable only by instrument, or bearer and transferable by delivery with interest paid to whoever holds the coupon.",
          list: [
            { term: "Secured debentures", def: "Backed by a charge on the company's assets, either fixed on a specific asset or floating on a class of assets changing in form." },
            { term: "Unsecured debentures", def: "Carry no specific charge, and holders are merely creditors." },
            { term: "Registered debentures", def: "Transferable only by the prescribed instrument in the recorded name." },
            { term: "Bearer debentures", def: "Transferable by delivery, with interest paid to the coupon holder." }
          ]
        },
        {
          h: "Issuing Debentures, Par, Premium and Discount",
          p: "Debentures may be issued at par, at a premium or at a discount. The entry pattern mirrors share issues: money due, then received. A discount is a loss on issue and must be written off, because the law does not permit it to remain on the balance sheet as an asset.",
          formula: "Net proceeds = Debentures × Issue price\nDiscount = Debentures × (Face − Issue price)",
          simple: "In Simple Words: a debenture issue runs like a share issue in reverse on the balance sheet, because one side creates a liability instead of equity."
        },
        {
          h: "Interest on Debentures",
          p: "Interest at the stated rate accrues for the period the debentures remain outstanding, usually paid half-yearly, and is carried to the statement of profit and loss as a finance cost. It is a charge against profit, payable even in a loss year, unlike dividend. No tax is deducted at source on that interest in this course.",
          formula: "Interest = Debentures × Rate × Months ÷ 12",
          confusion: {
            a: "Interest on debentures", aText: "A finance cost and charge against profit, payable even in a loss year.",
            b: "Dividend on shares", bText: "An appropriation of divisible profit, paid only when profit exists.",
            diff: "Debenture interest is a cost of borrowing that must be met, while dividend is a reward that depends on profit."
          }
        }
      ],
      advBlocks: [
        {
          h: "Writing Off the Loss on Issue",
          p: "Loss on issue bundles two components: the discount allowed at issue and the premium payable on future redemption when debentures are issued redeemable at a premium. Both are recognised at issue, and the total is written off first out of securities premium reserve to the extent it exists, the remainder out of the profit and loss account as a financial cost.",
          formula: "Loss on issue = Discount on issue + Premium payable on redemption",
          example: "Worked Example: 2,000 debentures of ₹100 issued at ₹95, a discount of ₹5 each, so the discount = 2,000 × 5 = ₹10,000. They are redeemable at ₹107.50, a premium of ₹7.50 each, so the premium on redemption = 2,000 × 7.50 = ₹15,000. Total loss on issue = 10,000 + 15,000 = ₹25,000, written off first from securities premium reserve of ₹6,000 and the remaining ₹19,000 from profit and loss as a finance cost."
        },
        {
          h: "Debentures as Collateral Security",
          p: "Debentures may be handed to a bank purely as additional security for a loan. No regular entry is made for the debentures themselves, because the loan is recorded and the debentures disclosed. If the loan is repaid the debentures are cancelled, while if it is not they become a real liability.",
          example: "Worked Example: A bank loan of ₹2,00,000 is secured by debentures of ₹2,50,000 issued as collateral. The entry records only the bank loan, and the debentures are disclosed in a note to the balance sheet, with no capital or interest entry until the loan defaults.",
          tip: "Exam Tip: the test is whether the company received money or value against the debentures. If yes, an entry. If they are only security, a disclosure."
        },
        {
          h: "Debentures for Consideration Other Than Cash",
          p: "Debentures may be issued to a vendor for assets or services received, valued at the agreed figure. The discount then reflects the difference between the agreed debt and the value of what was received. The entry credits debentures at face, and any discount is a loss on issue.",
          example: "Worked Example: Debentures of ₹100 each issued at ₹95 to a vendor for assets valued at ₹1,90,000. The entry debits the asset account and credits debentures at ₹2,00,000, with a loss on issue of ₹10,000 written off. Check: 2,000 debentures × 95 = ₹1,90,000 received against 2,00,000 face."
        },
        {
          h: "Debentures vs Shares, the Fixed Difference",
          p: "A share is ownership, while a debenture is debt. Interest is payable even in a loss year and is a finance cost, while dividend depends on divisible profit and is an appropriation. On winding up debenture holders rank ahead of shareholders. Debenture capital creates a liability, while share capital creates members' funds, and the two never merge whatever the issue terms.",
          note: "Remember This: interest on debentures continues accruing even if no profit is earned, which is the single most tested difference from dividend."
        }
      ],
      mistakes: [
        "Forgetting that a discount on issue must be written off immediately rather than shown as an asset.",
        "Missing the premium payable on redemption when computing total loss on issue.",
        "Writing off loss on issue entirely to profit and loss instead of using securities premium reserve first.",
        "Making a full journal entry for debentures issued as collateral security, when only disclosure is required.",
        "Charging debenture interest only in profitable years, as if it were dividend.",
        "Computing interest without the Months divided by 12 fraction for part-year debentures."
      ],
      summary: [
        "A debenture is a debt certificate at fixed interest, and holders are creditors, not owners.",
        "Debentures may be secured, unsecured, registered or bearer.",
        "They are issued at par, premium or discount, with the same due-then-received rhythm as shares.",
        "Interest is a finance cost and charge against profit, payable even in a loss year.",
        "Loss on issue equals discount plus premium on redemption and is written off from securities premium reserve first.",
        "Debentures as collateral security are disclosed, not entered.",
        "Debenture capital is a liability, while share capital is members' funds."
      ],
      check: [
        { q: "A company issued 2,000 debentures of ₹100 at ₹95, redeemable at ₹107.50. Find the loss on issue.", a: "Discount 2,000 × 5 = ₹10,000 plus premium on redemption 2,000 × 7.50 = ₹15,000, total ₹25,000." },
        { q: "How is that loss written off if securities premium reserve is only ₹6,000?", a: "₹6,000 from securities premium reserve and the remaining ₹19,000 from profit and loss as a finance cost." },
        { q: "State whether an entry is made for debentures issued as collateral security.", a: "No entry is made for the debentures, because the loan is recorded and the debentures are disclosed." },
        { q: "Is interest on debentures payable in a loss year?", a: "Yes. It is a charge against profit and a finance cost, unlike dividend which depends on divisible profit." }
      ]
    },
    cfin: {
      intro: [
        "Financial Statements of a Company covers the two formal records a company must present under Schedule III of the Companies Act: the statement of profit and loss, which reports what it earned over a period, and the balance sheet, which shows what it held and owed at a date.",
        "It matters because Schedule III fixes the headings and order for every company, making accounts comparable, and because the preparation and interpretation of these statements is examined through both formats and short answer questions.",
        "It connects to the analysis chapter, where these statements become the raw material for comparative and common-size statements, and to company accounts, where share capital and debentures feed the shareholders' funds and borrowings lines."
      ],
      objectives: [
        "State the purpose of a company's financial statements and the role of Schedule III.",
        "List the prescribed headings under equity and liabilities and under assets.",
        "Distinguish revenue from operations from other income.",
        "Compute divisible profit from net profit after tax.",
        "Explain the role of notes to accounts.",
        "Read the statements for the economic story they tell."
      ],
      blocks: [
        {
          h: "The Two Statements and Schedule III",
          p: "The statement of profit and loss tells what the company earned over a period, while the balance sheet shows its position at a date. Schedule III of the Companies Act prescribes their format, the same headings, the same order, the same discipline for every company, so any reader can compare one with another.",
          list: [
            { term: "Statement of profit and loss", def: "Revenue from operations plus other income, less expenses and tax, a flow over a period." },
            { term: "Balance sheet", def: "Equity and liabilities against assets at a reporting date, a position not a flow." },
            { term: "Notes to accounts", def: "The narrative behind every figure: sub-headings, policies and the detail the face compresses." }
          ]
        },
        {
          h: "Equity, Liabilities and Assets in Order",
          p: "Schedule III reads top to bottom in a strict hierarchy. Equity and liabilities begin with shareholders' funds, then non-current liabilities, then current liabilities. On the other side come non-current assets and then current assets. Each heading is a family of sub-headings, such as trade payables and inventories.",
          formula: "Total equity and liabilities = Total assets, because the balance sheet balances by construction",
          simple: "In Simple Words: both sides are recipes with fixed ingredients in a fixed order, which is why two companies' balance sheets can be compared line by line."
        },
        {
          h: "Revenue, Other Income and the Line Between",
          p: "Revenue from operations is what the main business brings, such as the sale of goods or services. Other income is everything legitimate arriving from outside that flow: interest income, dividend received, profit on the sale of a fixed asset. Both reach profit before tax but are shown separately so a reader can see how much came from the business itself.",
          confusion: {
            a: "Revenue from operations", aText: "Income from the principal business, such as sale of goods or services.",
            b: "Other income", bText: "Income from outside the main flow, such as interest income or profit on a fixed-asset sale.",
            diff: "Both add to profit, but separating them shows whether profit came from the core business or its surroundings."
          }
        }
      ],
      advBlocks: [
        {
          h: "From Net Profit to Divisible Profit",
          p: "Net profit before tax is not all available to shareholders. Transfers to reserves reduce what remains, a proposed dividend is set aside, and the residue is the divisible profit that may legitimately be distributed. The appropriation always starts from a figure that has already borne its expenses and tax.",
          formula: "Divisible profit = Net profit after tax − Transfers to reserves − Proposed dividend",
          example: "Worked Example: Revenue from operations ₹8,00,000 and other income ₹40,000; employee benefits expense ₹3,20,000, other expenses ₹2,80,000, depreciation and amortisation ₹80,000. Profit before tax = 8,00,000 + 40,000 − 3,20,000 − 2,80,000 − 80,000 = ₹1,60,000. Current tax ₹40,000 leaves profit for the year ₹1,20,000. If ₹30,000 is transferred to reserves and a proposed dividend of ₹40,000 is set aside, divisible profit = 1,20,000 − 30,000 − 40,000 = ₹50,000."
        },
        {
          h: "Notes to Accounts",
          p: "Every figure on the face is a summary, while the notes carry the detail. Contingent liabilities, commitments, the split of reserves, the basis of depreciation and related-party amounts all live in the notes. A reader who ignores the notes reads half the accounts, and an examiner expects the note references to match the line items exactly. Notes also carry the accounting policies, the choices made where the framework allowed more than one.",
          tip: "Exam Tip: when a question gives figures with note numbers, check each note against the line it supports, because mismatches are where marks are lost."
        },
        {
          h: "Reading the Statements as an Analyst",
          p: "A company showing rising revenue but faster-rising trade receivables is selling on increasingly generous credit. Heavy short-term borrowings against thin cash signals a liquidity squeeze. Reserves swollen year after year show a company preferring to keep profit rather than part with it. The statements are the company's economics written down, not merely a compliance product.",
          note: "Remember This: comparing one year's statement with the previous year's turns a static picture into a trend, which is the bridge to the analysis chapter."
        },
        {
          h: "Presenting a Schedule III Balance Sheet",
          p: "Presentation means placing each figure under its prescribed heading and sub-heading and casting the totals. Share capital and reserves sit under shareholders' funds; long-term borrowings under non-current liabilities; trade payables under current liabilities; property, plant and equipment under non-current assets; inventories, trade receivables and cash under current assets.",
          example: "Worked Example: Share capital ₹5,00,000 and reserves and surplus ₹2,40,000 give shareholders' funds of ₹7,40,000. Add long-term borrowings ₹1,50,000 and trade payables ₹1,20,000, and total equity and liabilities = 7,40,000 + 1,50,000 + 1,20,000 = ₹10,10,000. This matches total assets of property, plant and equipment ₹4,20,000 plus inventories ₹1,80,000 plus trade receivables ₹2,10,000 plus cash ₹2,00,000 = ₹10,10,000."
        }
      ],
      mistakes: [
        "Placing an item under the wrong Schedule III heading, such as trade payables under non-current liabilities.",
        "Treating profit on the sale of a fixed asset as revenue from operations instead of other income.",
        "Computing divisible profit from profit before tax instead of profit after tax.",
        "Ignoring notes to accounts, which carry the detail and the accounting policies.",
        "Forgetting that total equity and liabilities must equal total assets by construction.",
        "Mixing the flow of the profit and loss statement with the position of the balance sheet."
      ],
      summary: [
        "A company's financial statements comprise the statement of profit and loss and the balance sheet, in the Schedule III format.",
        "Schedule III fixes headings and order so every company's accounts are comparable.",
        "Equity and liabilities run shareholders' funds, non-current liabilities, then current liabilities, while assets run non-current then current.",
        "Revenue from operations is the core business flow, while other income is everything outside it.",
        "Divisible profit equals net profit after tax less transfers to reserves and the proposed dividend.",
        "Notes to accounts carry the detail, policies, contingent liabilities and commitments.",
        "Reading the statements reveals the company's economic decisions, not just compliance."
      ],
      check: [
        { q: "Give the order of equity and liabilities under Schedule III.", a: "Shareholders' funds, then non-current liabilities, then current liabilities." },
        { q: "Profit before tax ₹1,60,000, tax ₹40,000, transfer to reserves ₹30,000, proposed dividend ₹40,000. Find divisible profit.", a: "Profit after tax 1,20,000 less 30,000 and 40,000 gives ₹50,000." },
        { q: "Is profit on the sale of a fixed asset revenue from operations?", a: "No. It is other income, shown separately from the core business revenue." },
        { q: "What guarantees that the balance sheet balances?", a: "Total equity and liabilities equals total assets by construction under the Schedule III format." }
      ]
    },
    fsa: {
      intro: [
        "Analysis of Financial Statements turns two years of figures into a story: what changed, by how much, in which direction and what it implies. It teaches two core tools, the comparative statement for horizontal analysis and the common-size statement for vertical analysis.",
        "It matters because analysis is how shareholders, bankers and managers actually use accounts, and because the techniques are examined through statement preparation and interpretation questions.",
        "It connects backwards to the financial statements chapter, which supplies the raw figures, and forwards to ratios and cash flow, which deepen the same enquiry into profitability, solvency and liquidity."
      ],
      objectives: [
        "Explain who performs financial analysis and why.",
        "Prepare a comparative statement with absolute and percentage change.",
        "Prepare a common-size statement of profit and loss and balance sheet.",
        "Distinguish horizontal from vertical analysis.",
        "Interpret changes in the comparative statement.",
        "State the limitations of financial statement analysis."
      ],
      blocks: [
        {
          h: "Internal, External, Horizontal and Vertical",
          p: "Analysis is done internally by management for decisions on pricing, cost, dividend and expansion, and externally by lenders, investors and regulators working mainly from published statements. Horizontal analysis compares one year with another, while vertical analysis reads each year's figures against a base within that year.",
          list: [
            { term: "Internal analysis", def: "By management with full access, for operational decisions." },
            { term: "External analysis", def: "By outsiders with limited access, mainly from published statements." },
            { term: "Horizontal analysis", def: "Comparative statement across years, showing absolute and percentage change." },
            { term: "Vertical analysis", def: "Common-size statement, each line a percentage of a chosen base within the year." }
          ],
          simple: "In Simple Words: horizontal looks at how a line moved over time, while vertical looks at how a line sits within one year's structure."
        },
        {
          h: "The Comparative Statement",
          p: "Take each line of the profit and loss statement or balance sheet across two or more years. Subtract to get the absolute change, and express it against the base year to get the percentage change. The result is not a diagnosis but tells you exactly where to look next.",
          formula: "Change = Current year − Base year\nChange % = Change ÷ Base year × 100",
          example: "Worked Example: Revenue from operations rises from ₹20,00,000 to ₹25,00,000. Absolute change = 25,00,000 − 20,00,000 = ₹5,00,000. Percentage change = 5,00,000 ÷ 20,00,000 × 100 = 25%."
        },
        {
          h: "The Common-Size Statement",
          p: "In the profit and loss statement, revenue from operations is the natural 100% and every expense and profit line is a percentage of it. In the balance sheet, total assets serve as the 100% base. This removes the effect of size so two firms of very different scale can be compared line by line.",
          confusion: {
            a: "Comparative statement", aText: "Each line across years with absolute and percentage change against a base year, which is horizontal.",
            b: "Common-size statement", bText: "Each line as a percentage of a base within the same year, which is vertical.",
            diff: "The comparative shows movement over time, while the common-size shows structure within a single year."
          }
        }
      ],
      advBlocks: [
        {
          h: "Reading a Comparative Statement Like an Analyst",
          p: "Absolute change flatters big numbers, while percentage change flatters small ones. Revenue rising ten lakh looks impressive until you see it is four per cent while employee costs rose eighteen. Read the two in pairs: absolute change tells materiality, while percentage change tells momentum. Compare expense lines against revenue, not against themselves.",
          example: "Worked Example: Revenue rises 20% while other expenses rise 12%. Because expenses grew slower than revenue, efficiency is improving. The same 12% expense growth against 6% revenue growth would be deterioration, even though the absolute expense change is identical.",
          tip: "Exam Tip: an expense rising more slowly than revenue is a good sign, while rising faster is a warning, regardless of the absolute rupees."
        },
        {
          h: "Common-Size Profit and Loss in Practice",
          p: "Express every line as a percentage of revenue from operations. A firm whose employee costs are 45% of revenue against a peer's 30% has a labour-intensity problem or a pricing one. The common-size statement surfaces the difference, and investigation explains it.",
          example: "Worked Example: Revenue ₹25,00,000, employee benefits expense ₹9,60,000, other expenses ₹8,00,000, other income ₹50,000, profit before tax ₹7,90,000. As percentages of revenue: employee costs = 9,60,000 ÷ 25,00,000 × 100 = 38.4%, other expenses = 8,00,000 ÷ 25,00,000 × 100 = 32%, profit before tax = 7,90,000 ÷ 25,00,000 × 100 = 31.6%."
        },
        {
          h: "Comparative Balance Sheet, the Financing Story",
          p: "The same technique on the position statement reveals financing decisions: did growth come from borrowings or retained profits? Did inventory build faster than sales? Did trade receivables grow while revenue stagnated, the oldest warning sign in accounting? Each line is a trace of a decision taken during the year.",
          note: "Remember This: a long-term borrowing line that doubled while fixed assets did not move invites the question of what the money was for."
        },
        {
          h: "Limitations, Because Numbers Do Not Speak for Themselves",
          p: "Analysis inherits every weakness of the statements: historical cost ignores inflation, a change in policy can move a line with no economic change, and inter-firm comparison fails when firms use different year-ends or classifications. Window dressing, a one-day bank balance at year end, can make a picture look better for exactly one date. Qualitative events never appear yet often explain the numbers.",
          confusion: {
            a: "Window dressing", aText: "One-off year-end arrangements that flatter the statements for a single reporting date.",
            b: "Real trend", bText: "A sustained movement across several periods reflecting genuine performance.",
            diff: "A single dressed-up date disappears next year, while a trend survives across statements."
          }
        }
      ],
      mistakes: [
        "Computing percentage change against the current year instead of the base year.",
        "Expressing common-size profit and loss lines against profit instead of revenue from operations.",
        "Reading absolute change alone and missing that a large rupee change may be a small percentage.",
        "Treating a rise in trade receivables as unambiguously good without checking revenue growth.",
        "Forgetting that the balance sheet common-size uses total assets as the base.",
        "Drawing firm conclusions from a single year without a trend or peer comparison."
      ],
      summary: [
        "Financial analysis turns statements into a story of what changed and why.",
        "Internal analysis is by management, while external analysis is by outsiders from published statements.",
        "Comparative statements give absolute and percentage change against a base year.",
        "Common-size statements express each line as a percentage of a base within the year.",
        "Horizontal analysis compares across time, while vertical analysis compares within a year.",
        "Absolute change shows materiality and percentage change shows momentum, so read them together.",
        "Analysis is limited by historical cost, policy changes, window dressing and missing qualitative data."
      ],
      check: [
        { q: "Revenue moves from ₹20,00,000 to ₹25,00,000. Give the absolute and percentage change.", a: "Absolute change ₹5,00,000; percentage change 5,00,000 ÷ 20,00,000 × 100 = 25%." },
        { q: "What is the base for a common-size statement of profit and loss?", a: "Revenue from operations, taken as 100%, while for a balance sheet the base is total assets." },
        { q: "State whether horizontal or vertical analysis a comparative statement represents.", a: "Horizontal, because it compares each line across years." },
        { q: "Give one limitation of financial statement analysis.", a: "Window dressing can flatter the statements for a single reporting date without any real economic improvement." }
      ]
    },
    rat: {
      intro: [
        "Accounting Ratios holds one number against another to say something neither says alone. It turns statement figures into statements about the business: can it pay next month's bills, can it service its debt, how fast does it turn stock into sales, and how much of each rupee of revenue survives as profit.",
        "It matters because ratios are the shared language of shareholders, bankers and managers, and because the chapter's formulas are examined every year in direct numerical form.",
        "It connects to the analysis chapter, which supplies the statements, and to the cash flow chapter, which reveals the liquidity that ratios only infer from balances."
      ],
      objectives: [
        "Classify ratios into liquidity, solvency, activity and profitability.",
        "Compute the current ratio and quick ratio and interpret them.",
        "Compute the debt-equity ratio and interest coverage ratio.",
        "Compute inventory turnover, trade receivables turnover and their day figures.",
        "Compute gross profit rate, net profit rate and return on investment.",
        "Interpret ratios in context rather than in isolation."
      ],
      blocks: [
        {
          h: "The Four Families of Ratios",
          p: "Liquidity ratios measure short-run paying ability. Solvency ratios measure long-run structure, how much is owed versus owned. Activity or turnover ratios measure how intensively assets are used. Profitability ratios measure how much profit the activity throws out.",
          list: [
            { term: "Liquidity ratios", def: "Short-run paying ability, namely the current ratio and quick ratio, against the next twelve months." },
            { term: "Solvency ratios", def: "Long-run structure, namely debt-equity and interest coverage." },
            { term: "Activity ratios", def: "Asset use intensity, namely inventory, trade receivables and trade payables turnover." },
            { term: "Profitability ratios", def: "Profit generation, namely gross profit rate, net profit rate, return on investment and earnings per share." }
          ]
        },
        {
          h: "Liquidity, the Next Twelve Months",
          p: "The current ratio holds current assets against current liabilities; two to one is the textbook comfort mark, but a ratio built from slow-moving inventory is comfort without substance. That is why the quick ratio exists, as it removes inventory and prepayments, leaving cash, bank, trade receivables and short-term investments against the same liabilities.",
          formula: "Current ratio = Current assets ÷ Current liabilities\nQuick ratio = (Current assets − Inventory − Prepayments) ÷ Current liabilities",
          example: "Worked Example: Current assets ₹6,00,000 including inventory ₹2,00,000 and prepayments ₹40,000; current liabilities ₹3,00,000. Current ratio = 6,00,000 ÷ 3,00,000 = 2:1. Quick assets = 6,00,000 − 2,00,000 − 40,000 = ₹3,60,000. Quick ratio = 3,60,000 ÷ 3,00,000 = 1.2:1."
        },
        {
          h: "Profitability, the Margin and the Return",
          p: "The gross profit rate measures the markup on trading, while the net profit rate measures what survives every expense. Return on investment holds profit before interest and tax against the capital employed that produced it, which is the most honest measure of how hard the whole capital base is working, because it ignores how the capital was financed.",
          formula: "Gross profit rate = Gross profit ÷ Revenue × 100\nNet profit rate = Net profit ÷ Revenue × 100\nROI = PBIT ÷ Capital employed × 100",
          confusion: {
            a: "Gross profit rate", aText: "Gross profit as a percentage of revenue, measuring the markup on trading.",
            b: "Net profit rate", bText: "Net profit as a percentage of revenue, measuring what survives every expense.",
            diff: "Gross profit excludes indirect expenses, while net profit bears them, so the net rate is always the lower and more complete measure."
          }
        }
      ],
      advBlocks: [
        {
          h: "Solvency, Who Owns the Firm and Who Is Owed",
          p: "The debt-equity ratio sets long-term debt against shareholders' funds: how many rupees outsiders have put in for every rupee the owners have. Interest coverage, which is PBIT against interest, asks whether earnings can service the debt at all. Together they separate a conservative structure from a leveraged one.",
          formula: "Debt-equity = Long-term debt ÷ Shareholders' funds\nInterest coverage = PBIT ÷ Interest",
          example: "Worked Example: Long-term debt ₹2,00,000 and shareholders' funds ₹8,00,000. Debt-equity = 2,00,000 ÷ 8,00,000 = 0.25:1. Net profit ₹1,20,000, interest ₹40,000, tax ₹30,000, so PBIT = 1,20,000 + 40,000 + 30,000 = ₹1,90,000. Interest coverage = 1,90,000 ÷ 40,000 = 4.75 times."
        },
        {
          h: "Activity, the Speed of the Machine",
          p: "Inventory turnover says how many times stock became sales in the year, and the days figure divides 365 by it. Trade receivables turnover says how quickly credit customers pay, while trade payables turnover says how quickly the firm pays its own suppliers. Each converts a balance-sheet stock into an income-statement flow.",
          formula: "Inventory turnover = COGS ÷ Average inventory\nReceivables turnover = Revenue ÷ Average trade receivables\nDays = 365 ÷ Turnover",
          example: "Worked Example: Cost of goods sold ₹6,00,000 and average inventory ₹1,50,000. Inventory turnover = 6,00,000 ÷ 1,50,000 = 4 times. Days stock held = 365 ÷ 4 = 91.25 days, about three months."
        },
        {
          h: "Capital Employed and Return on Investment in Full",
          p: "Capital employed can be built two ways: shareholders' funds plus long-term debt, or total assets minus current liabilities, and both must agree. PBIT is net profit plus interest plus tax. Return on investment then holds PBIT against capital employed, showing how hard the whole base worked.",
          example: "Worked Example: From the asset side, shareholders' funds ₹8,00,000 plus long-term debt ₹2,00,000 gives capital employed of ₹10,00,000. From total assets, total assets ₹12,00,000 minus current liabilities ₹2,00,000 also gives ₹10,00,000. With PBIT ₹1,90,000, ROI = 1,90,000 ÷ 10,00,000 × 100 = 19%.",
          tip: "Exam Tip: state the formula, substitute the figures, then give the answer with its unit, whether times, percentage or ratio."
        },
        {
          h: "Interpreting Without Fooling Yourself",
          p: "A ratio is a comparison device: against last year, against the industry, against a stated standard. Alone it means little, since a current ratio of 2.5 could be health or dead inventory. Trends beat snapshots, and pairs beat singles, such as current with quick and gross with net. Every ratio inherits the statements' limitations, so the first question is always what the figure cannot be telling you.",
          note: "Remember This: state your formula and inputs, because rounding the denominator can change the story."
        }
      ],
      mistakes: [
        "Forgetting to subtract inventory and prepayments when computing the quick ratio.",
        "Using closing inventory instead of average inventory in turnover ratios.",
        "Computing return on investment with net profit instead of PBIT.",
        "Reading a ratio in isolation without a trend or peer to compare against.",
        "Mixing up the debt-equity numerator by using short-term debt instead of long-term debt.",
        "Expressing turnover or coverage ratios as percentages instead of times."
      ],
      summary: [
        "Ratios group into liquidity, solvency, activity and profitability families.",
        "Current ratio is current assets over current liabilities, while quick ratio removes inventory and prepayments.",
        "Debt-equity sets long-term debt against shareholders' funds, while interest coverage sets PBIT against interest.",
        "Inventory turnover is cost of goods sold over average inventory, and days equal 365 divided by turnover.",
        "Return on investment is PBIT over capital employed as a percentage.",
        "Capital employed can be built from shareholders' funds plus long-term debt or total assets minus current liabilities.",
        "Ratios mean little alone, so compare against trends, industry and standards."
      ],
      check: [
        { q: "Current assets ₹6,00,000 including inventory ₹2,00,000 and prepayments ₹40,000; current liabilities ₹3,00,000. Give the current and quick ratios.", a: "Current ratio 2:1; quick ratio 3,60,000 ÷ 3,00,000 = 1.2:1." },
        { q: "Long-term debt ₹2,00,000 and shareholders' funds ₹8,00,000. Give the debt-equity ratio.", a: "2,00,000 ÷ 8,00,000 = 0.25:1." },
        { q: "Cost of goods sold ₹6,00,000 and average inventory ₹1,50,000. Give inventory turnover and days.", a: "Turnover 4 times; days 365 ÷ 4 = 91.25 days." },
        { q: "Which profit is used in return on investment and why?", a: "PBIT, that is net profit plus interest plus tax, because ROI measures the return on capital before financing costs." }
      ]
    },
    cf: {
      intro: [
        "The Cash Flow Statement reports the actual movement of cash and cash equivalents during the year, sorted by what caused it. Profit is an opinion and cash is a fact, so this statement closes the gap between an invoiced sale and money in the bank.",
        "It matters because a company can show healthy profit and still fail to pay wages, and because the indirect-method adjustments are examined every year for their direction logic.",
        "It connects to the financial statements, which supply net profit before tax and the balance-sheet movements, and to the analysis chapter, where liquidity is judged from exactly these flows."
      ],
      objectives: [
        "Define cash, cash equivalents and cash flow.",
        "Classify movements into operating, investing and financing activities.",
        "Explain the indirect method of computing operating cash flow.",
        "Apply the working-capital adjustment rule in the correct direction.",
        "State where interest and dividend are shown in this course.",
        "Read a cash flow statement for the story it tells."
      ],
      blocks: [
        {
          h: "Cash, Cash Equivalents and Why the Statement Exists",
          p: "Cash is cash in hand and demand deposits with banks. Cash equivalents are short-term, highly liquid investments readily convertible to known cash amounts with insignificant risk of value change, held for meeting short-term commitments. A cash flow is the net movement, inflows minus outflows, over a period.",
          list: [
            { term: "Cash", def: "Cash in hand and demand deposits with banks." },
            { term: "Cash equivalents", def: "Short-term, highly liquid investments readily convertible to known cash, with insignificant value risk." },
            { term: "Cash flow", def: "The net movement in cash and cash equivalents over a period." }
          ],
          simple: "In Simple Words: profit counts a sale when it is invoiced, while cash counts it when the money arrives. This statement is the honest version."
        },
        {
          h: "The Three Activities",
          p: "Every cash movement belongs to exactly one of three families. Operating activities are the principal revenue-producing activities, such as cash from customers, to suppliers and employees, and expenses paid. Investing activities are the purchase and sale of long-term assets and investments. Financing activities are transactions with owners and lenders, such as issue and repayment of capital and borrowings, dividend and interest paid.",
          formula: "Net movement in cash = Operating + Investing + Financing",
          confusion: {
            a: "Operating activity", aText: "Principal revenue-producing flows such as cash from customers and to suppliers.",
            b: "Financing activity", bText: "Transactions with owners and lenders such as issue of capital, borrowings and dividend paid.",
            diff: "Operating is the engine of the business, while financing is how the business is funded and returns value to providers of finance."
          }
        },
        {
          h: "The Indirect Method, From Profit to Operating Cash",
          p: "The profit and loss statement is prepared on an accrual basis, while the cash flow statement wants cash. The indirect method bridges them: start with net profit before tax, remove everything that moved profit without moving cash, such as depreciation and other non-cash charges and gains or losses on disposal, then adjust for working-capital changes.",
          formula: "Operating cash flow = Net profit before tax + Non-cash charges ± Working capital changes",
          simple: "In Simple Words: you start from profit and peel away every non-cash effect until only the cash the operations truly generated remains."
        }
      ],
      advBlocks: [
        {
          h: "Working Capital Adjustments, the Direction Rule",
          p: "Every adjustment follows one rule: an increase in a current asset consumes cash, an increase in a current liability releases cash, and the reverse for decreases. Trade receivables up means sales invoiced but not collected, so cash is stuck. Trade payables up means purchases made but not paid, so cash is retained. Apply the rule to the movement, not the balance.",
          example: "Worked Example: Net profit before tax ₹2,40,000. Add depreciation ₹60,000. Trade receivables rise ₹40,000, which is an outflow. Trade payables rise ₹30,000, which is an inflow. Operating cash flow = 2,40,000 + 60,000 − 40,000 + 30,000 = ₹2,90,000.",
          note: "Remember This: an increase in a current asset is always an outflow and an increase in a current liability always an inflow, so learn this once and apply it to every balance."
        },
        {
          h: "Interest, Dividend and Where They Belong",
          p: "In this course, interest and dividend paid are shown under financing activities, as transactions with the providers of finance, while interest and dividend received are shown under investing activities, as returns on money invested. Classification follows the nature of the relationship, not the accounting head the payment passed through.",
          example: "Worked Example: In a year the firm pays interest ₹20,000 and receives dividend ₹10,000. The interest paid is a financing outflow of ₹20,000, while the dividend received is an investing inflow of ₹10,000, shown in their separate sections.",
          tip: "Exam Tip: state your classification convention when the question allows a choice, and stay consistent within the statement."
        },
        {
          h: "Assembling the Three Sections",
          p: "Present the three sections in the prescribed order: operating, then investing, then financing. Within each, list the flows, total them, then combine to find the net increase or decrease in cash and cash equivalents. Add the opening balance to confirm the closing figure ties to the balance sheet.",
          example: "Worked Example: Operating ₹2,90,000. Investing: purchase of machinery ₹1,50,000 outflow. Financing: proceeds from long-term borrowings ₹80,000 inflow, interest paid ₹20,000 outflow and dividend paid ₹30,000 outflow. Net increase = 2,90,000 − 1,50,000 + 80,000 − 20,000 − 30,000 = ₹1,70,000."
        },
        {
          h: "Reading a Cash Flow Statement",
          p: "Three questions in order. Did operations generate cash, and if not how long can that continue? Did the firm invest in its future or live off disposals? Did it finance growth from owners, lenders or its own operations? A firm whose operations bleed cash while investing outflows are funded by borrowings is writing a story the profit and loss account cannot tell.",
          note: "Remember This: the closing cash and cash equivalents of the statement must equal the balance sheet figure, because that tie proves the statement was built correctly."
        }
      ],
      mistakes: [
        "Showing an increase in a current asset as an inflow instead of an outflow.",
        "Treating depreciation as a cash outflow instead of adding it back as a non-cash charge.",
        "Classifying interest paid under operating instead of financing in this course.",
        "Applying the working-capital rule to the closing balance instead of the movement during the year.",
        "Omitting the reconciliation of opening and closing cash with the balance sheet figures.",
        "Putting the purchase of a fixed asset under operating instead of investing."
      ],
      summary: [
        "The cash flow statement reports movements of cash and cash equivalents by cause.",
        "Operating activities are revenue-producing, investing covers long-term assets, and financing covers owners and lenders.",
        "The indirect method starts from net profit before tax and removes non-cash effects and working-capital movements.",
        "An increase in a current asset is an outflow, while an increase in a current liability is an inflow.",
        "Interest and dividend paid are financing, while interest and dividend received are investing, in this course.",
        "The three sections sum to the net increase or decrease in cash.",
        "Closing cash must tie to the balance sheet figure."
      ],
      check: [
        { q: "State the working-capital direction rule for an increase in a current asset and an increase in a current liability.", a: "An increase in a current asset is a cash outflow, while an increase in a current liability is a cash inflow." },
        { q: "Net profit before tax ₹2,40,000, depreciation ₹60,000, receivables up ₹40,000, payables up ₹30,000. Find operating cash flow.", a: "2,40,000 + 60,000 − 40,000 + 30,000 = ₹2,90,000." },
        { q: "Where is interest paid shown in this course?", a: "Under financing activities, as a transaction with the providers of finance." },
        { q: "What check proves the cash flow statement is correct?", a: "The closing cash and cash equivalents must equal the balance sheet figure." }
      ]
    },
    ca: {
      intro: [
        "Computerised Accounting studies the processing of accounting information with computers: data entered once and validated at entry, with every ledger, trial balance and statement produced by the machine. The double-entry logic does not change, while speed, accuracy, storage and on-demand reporting do.",
        "It matters because modern practice is almost entirely computerised, and because the concepts of generic, specific and tailored software, electronic spreadsheets, codification, validation and audit trail are examined as short-answer theory.",
        "It connects to every practical chapter, since a computerised system still must record a partnership appropriation, a share issue or a cash flow correctly, because the rules are identical and only the tool differs."
      ],
      objectives: [
        "Explain the features and advantages of a computerised accounting system.",
        "Distinguish generic, specific and tailored accounting software.",
        "Describe the components of a computerised accounting system.",
        "Explain the use of electronic spreadsheets in accounting.",
        "Apply codification and the hierarchy of account heads.",
        "Explain validation, verification, audit trail and system security."
      ],
      blocks: [
        {
          h: "Features of a Computerised Accounting System",
          p: "The same accounting logic is delivered faster and more reliably. Data is entered once and validated at entry, then every ledger, trial balance and statement is generated without re-entry. Errors now come from wrong data or wrong logic, not from faulty addition.",
          list: [
            { term: "Speed", def: "Volumes of entries that would take days by hand are posted and summarised in seconds." },
            { term: "Accuracy", def: "The arithmetic is machine-performed, so errors come from wrong data or logic, not addition." },
            { term: "Storage and retrieval", def: "Years of books fit on one device and can be searched in moments." },
            { term: "Reliability and connectivity", def: "Consistent processing, with data flowing between modules without re-entry." }
          ],
          simple: "In Simple Words: the computer changes how fast and how reliably accounts are kept, not the rules of double entry they follow."
        },
        {
          h: "Generic, Specific and Tailored Software",
          p: "A generic package serves a wide audience and wide purpose, since a spreadsheet can be taught accounting but accounting is not its design centre. A specific package is built for accounting itself and suits most firms of a kind. A tailored package is built or adapted for one organisation, matching its heads, reports and controls exactly, at the highest cost and closest fit.",
          formula: "Generic (wide use) is contained in Specific (accounting), which is contained in Tailored (this firm)",
          confusion: {
            a: "Generic software", aText: "Built for a wide purpose, such as a spreadsheet or word processor.",
            b: "Tailored software", bText: "Built or adapted for one organisation's specific heads, reports and controls.",
            diff: "Generic is flexible but not specialised, while tailored is a close fit but costly and less portable."
          }
        },
        {
          h: "The Electronic Spreadsheet",
          p: "An electronic spreadsheet is a grid of cells in rows and columns, each holding a value, a label or a formula that recomputes automatically when inputs change. Live recalculation makes it an accounting instrument: a depreciation schedule, a loan table and a ratio report all rebuild when one figure moves. Cell references may be relative or absolute.",
          simple: "In Simple Words: change one assumption cell and every dependent figure updates at once, so the spreadsheet's quiet superpower is what-if analysis."
        }
      ],
      advBlocks: [
        {
          h: "Spreadsheets Doing an Accountant's Work",
          p: "Four applications cover most of a small firm's needs. Bank reconciliation compares the cash book with the bank statement and isolates timing differences such as cheques issued but not presented, or bank charges not yet entered. Asset accounting maintains the register and computes depreciation. Loan repayment schedules split each instalment into interest and principal. Ratio analysis turns statements into standard measures.",
          formula: "Loan schedule: Interest = Opening outstanding × Rate\nPrincipal = Instalment − Interest\nClosing = Opening − Principal",
          example: "Worked Example: A loan of ₹1,00,000 at 10% with annual instalments of ₹40,000. Year one interest = 1,00,000 × 0.10 = ₹10,000; principal = 40,000 − 10,000 = ₹30,000; closing outstanding = 1,00,000 − 30,000 = ₹70,000. Year two interest = 70,000 × 0.10 = ₹7,000; principal = 40,000 − 7,000 = ₹33,000; closing = 70,000 − 33,000 = ₹37,000."
        },
        {
          h: "Codification and the Hierarchy of Account Heads",
          p: "Before entries can be posted the accounts must exist and exist in an order. Heads are arranged in a hierarchy: main groups such as assets and liabilities, sub-groups within them, account heads within sub-groups, and individual ledger accounts within each head. Codification assigns a structured code to each level so that heads sort, group and report correctly.",
          example: "Worked Example: Assets is main group code 1; Current assets is sub-group 1-01; Cash-in-hand is account head 1-01-01; a specific cash account is ledger 1-01-01-001. On the expenditure side, Indirect expenditure is 4-02 and Salaries is 4-02-03. The code carries the position, so the software groups and reports automatically.",
          tip: "Exam Tip: a well-built code structure is why one data entry can appear in a ledger, a trial balance and a balance sheet without anyone re-typing it."
        },
        {
          h: "Validation, Verification and the Audit Trail",
          p: "Data enters once, so it must be checked at entry: validation rules reject an invalid month, a negative quantity or an account code that does not exist. Verification confirms what was posted, and an audit trail records who changed what and when, so every figure can be traced back to its entry.",
          formula: "Validation (at entry) → Verification (audit trail) → Adjustment (entries) → Statements",
          confusion: {
            a: "Validation", aText: "Rules applied at data entry that reject invalid values before they enter the system.",
            b: "Verification", bText: "Confirmation after posting, supported by the audit trail of who changed what and when.",
            diff: "Validation stops bad data entering, while verification proves what entered can be traced."
          }
        },
        {
          h: "Security, Backup and the Components of the System",
          p: "A computerised system needs its own protection: physical measures such as locks and uninterruptible power, logical measures such as passwords and per-user access rights, and backups, which are recovery rather than prevention, the last line after everything else fails. The system as a whole comprises users, procedures and instructions, data, application software, computer hardware, computer software and telecom networks working together.",
          note: "Remember This: remove any one component, whether procedures, data, software or hardware, and the system stops accounting."
        }
      ],
      mistakes: [
        "Forgetting that a computerised system still follows double entry, so the accounting logic does not change with the tool.",
        "Confusing a generic package with a specific one, when a spreadsheet is generic and an accounting package is specific.",
        "Thinking a backup prevents data loss, when it only provides recovery after failure.",
        "Ignoring codification, which is what lets one entry flow into ledgers, trial balance and statements automatically.",
        "Assuming validation and verification are the same, when validation is at entry and verification is after posting via the audit trail."
      ],
      summary: [
        "Computerised accounting processes data once and validates at entry, generating every report automatically.",
        "The double-entry logic is unchanged; speed, accuracy, storage and reporting are what improve.",
        "Generic software serves a wide purpose, specific software is built for accounting, and tailored software fits one firm.",
        "An electronic spreadsheet recalculates live, using relative and absolute references and what-if analysis.",
        "Codification assigns codes across a hierarchy of main groups, sub-groups, heads and ledgers.",
        "Validation rejects bad data at entry, while the audit trail supports verification after posting.",
        "Security needs physical and logical measures, and backups provide recovery rather than prevention."
      ],
      check: [
        { q: "Distinguish a generic package from a specific package.", a: "A generic package, such as a spreadsheet, serves a wide purpose, while a specific package is built for accounting itself." },
        { q: "What property of a spreadsheet makes it an accounting instrument?", a: "Live recalculation, where formulas recompute automatically when their inputs change." },
        { q: "Give the four-level codification example for cash-in-hand under assets.", a: "Assets 1, Current assets 1-01, Cash-in-hand 1-01-01, and a ledger account 1-01-01-001." },
        { q: "True or false: a backup is a security prevention measure.", a: "False. A backup is recovery, the last line after prevention measures such as passwords and physical locks have failed." }
      ]
    }
  });
})();


/* ---------------------------------------------------------------
   theory-upgrade.js — v92 Part 2 (chapter theory upgrade applier).

   The theory-upgrade PART files (injected before this one) push
   plain data objects onto window.THEORY_UPGRADE_PARTS, keyed by the
   APP_DATA content key of each chapter (Class 11: intro, terms,
   tbase, basis, equation, debitCredit, journal, ledger, cashBook,
   specialBooks2, brs, gst, tb, dep, pres, roe, fs, adj; Class 12:
   pf, gw, psr, adm, ret, dis, sc, deb, cfin, fsa, rat, cf, ca).

   This applier MERGES — never replaces — onto the chapter objects:
     intro       -> sec.upgrade.intro       (chapter introduction)
     objectives  -> sec.upgrade.objectives  (learning objectives)
     mistakes    -> sec.upgrade.mistakes    (common mistakes)
     summary     -> sec.upgrade.summary     (quick recap)
     check       -> sec.upgrade.check       (check-your-understanding)
     blocks      -> appended to sec.theory.simple
     advBlocks   -> appended to sec.theory.advanced

   It also registers every chapter's theory arrays in a context map
   so the single shared renderer (renderCashBookTheoryBlocks in
   app.js) can inject the chapter chrome exactly once per tab.
   Runs after classes.js (which installs Class 12 content into
   APP_DATA) and before app.js. Purely additive: with no part files
   present, every chapter renders exactly as before.
   --------------------------------------------------------------- */
(function () {
  "use strict";
  var parts = window.THEORY_UPGRADE_PARTS || [];
  var D = (typeof APP_DATA !== "undefined") ? APP_DATA : null;
  if (!D) return;

  /* Context map: theory array reference -> { data, kind }. The
     renderer looks blocks arrays up here; chapters that were never
     marked simply render without chrome (safe degradation). */
  if (typeof WeakMap !== "undefined") window.THEORY_CTX_MAP = new WeakMap();
  function mark(arr, data, kind) {
    if (window.THEORY_CTX_MAP) window.THEORY_CTX_MAP.set(arr, { data: data, kind: kind });
  }

  /* Merge the part data onto each chapter object. */
  parts.forEach(function (part) {
    if (!part || typeof part !== "object") return;
    Object.keys(part).forEach(function (key) {
      var up = part[key];
      var sec = D[key];
      if (!sec || typeof sec !== "object") {
        if (typeof console !== "undefined" && console.warn) console.warn("theory-upgrade: unknown chapter key", key);
        return;
      }
      if (!sec.theory) sec.theory = {};
      if (!Array.isArray(sec.theory.simple)) sec.theory.simple = [];
      if (!Array.isArray(sec.theory.advanced)) sec.theory.advanced = [];
      if (Array.isArray(up.blocks) && up.blocks.length) sec.theory.simple = sec.theory.simple.concat(up.blocks);
      if (Array.isArray(up.advBlocks) && up.advBlocks.length) sec.theory.advanced = sec.theory.advanced.concat(up.advBlocks);
      sec.upgrade = {
        intro: Array.isArray(up.intro) && up.intro.length ? up.intro : null,
        objectives: Array.isArray(up.objectives) && up.objectives.length ? up.objectives : null,
        mistakes: Array.isArray(up.mistakes) && up.mistakes.length ? up.mistakes : null,
        summary: Array.isArray(up.summary) && up.summary.length ? up.summary : null,
        check: Array.isArray(up.check) && up.check.length ? up.check : null
      };
    });
  });

  /* Mark EVERY chapter's theory arrays (part or no part) so both the
     C11 and C12 surfaces route through the shared renderer's chrome
     injection. Class 12 content objects were installed into
     APP_DATA by classes.js — same object references, so marking the
     APP_DATA entry marks the registered chapter too. */
  Object.keys(D).forEach(function (key) {
    var sec = D[key];
    if (!sec || typeof sec !== "object" || !sec.theory || typeof sec.theory !== "object") return;
    if (Array.isArray(sec.theory.simple)) mark(sec.theory.simple, sec, "simple");
    if (Array.isArray(sec.theory.advanced)) mark(sec.theory.advanced, sec, "advanced");
  });
})();
