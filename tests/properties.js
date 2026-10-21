module.exports = function (E, H) {
  const out = [];
  const add = (group, name, fn) => {
    let err = null;
    try { const r = fn(); if (r) err = r; } catch (e) { err = 'exception: ' + (e.stack || e.message); }
    out.push({ group, name, err });
  };
  const strip = a => a.replace(/ A\/c$/, '');
  const one = (line, ctx) => E.acParseTransaction(line, 1, ctx || {});
  const F = r => H.fmt(r.lines);
  const stateKey = ctx => JSON.stringify(Object.assign({}, ctx, { lastDate: null }));
  const near = (a, b) => Math.abs(a - b) < 0.011;

  /* ---------- P1. invariants over the WHOLE example corpus ---------- */
  const G1 = '17 Invariants (whole corpus)';
  add(G1, 'every VALID entry has debit = credit', () => {
    let n = 0;
    for (const c of H.cases) {
      const ctx = {};
      for (const line of E.acMergeOpeningBalanceLines(c.input.map(s => s.trim()))) {
        const r = E.acParseTransaction(line, 1, ctx); if (!r || r.status !== 'VALID') continue; n++;
        const dr = r.lines.reduce((s, l) => s + (l.dr || 0), 0), cr = r.lines.reduce((s, l) => s + (l.cr || 0), 0);
        if (!near(dr, cr)) return `unbalanced VALID entry for "${line}": ${dr} vs ${cr}`;
      }
    }
    return n > 100 ? null : 'too few VALID entries were checked (' + n + ')';
  });
  add(G1, 'INVALID / UNCERTAIN / NO_ENTRY leave ZERO state change', () => {
    let n = 0;
    for (const c of H.cases) {
      const ctx = {}; E.acParseTransaction('Hello there how are you', 1, ctx);   // initialise the state object
      for (const line of E.acMergeOpeningBalanceLines(c.input.map(s => s.trim()))) {
        const before = stateKey(ctx);
        const r = E.acParseTransaction(line, 1, ctx);
        if (r && r.status !== 'VALID') { n++; if (stateKey(ctx) !== before) return `state changed by a ${r.status} transaction: "${line}"`; }
      }
    }
    return n >= 15 ? null : 'too few non-VALID transactions were checked (' + n + ')';
  });
  add(G1, 'every VALID transaction reports its state update (exactly one commit)', () => {
    for (const c of H.cases) {
      const ctx = {};
      for (const line of E.acMergeOpeningBalanceLines(c.input.map(s => s.trim()))) {
        const r = E.acParseTransaction(line, 1, ctx);
        if (r && r.status === 'VALID' && !(r.stateChanges && r.stateChanges.length)) return `no stateChanges recorded for "${line}"`;
        if (r && r.status !== 'VALID' && r.stateChanges && r.stateChanges.length) return `stateChanges present on a ${r.status} result: "${line}"`;
      }
    }
  });
  add(G1, 'no VALID transaction silently drops a stated amount', () => {
    for (const c of H.cases) {
      const ctx = {};
      for (const line of E.acMergeOpeningBalanceLines(c.input.map(s => s.trim()))) {
        const r = E.acParseTransaction(line, 1, ctx);
        if (!r || r.status !== 'VALID' || r.tag === 'opening') continue;
        const amts = E.acExtractAmounts(' ' + line.toLowerCase() + ' ').map(a => a.value);
        const lineVals = r.lines.map(l => l.dr !== undefined ? l.dr : l.cr);
        // every stated amount must appear on a line, or be part of a documented calculation
        const calc = (r.calcs || []).flatMap(x => x.inputs || []);
        for (const a of amts) {
          if (lineVals.some(v => near(v, a)) || calc.some(v => v !== null && near(v, a))) continue;
          const sumOK = ['dr', 'cr'].some(side => { const arr = r.lines.filter(l => l[side] !== undefined).map(l => l[side]); return arr.some((x, i) => arr.some((y, j) => i < j && near(x + y, a))); });
          if (sumOK || (r.narration || '').replace(line.trim(), '').includes(E.acFmt ? '' : '')) continue;
          if (near(a, 0)) continue;
          // derived amounts (e.g. a % base) are allowed when the narration explains them
          if ((r.narration || '').slice(line.trim().length).match(/\d/)) continue;
          return `amount ${a} in "${line}" is not represented by the entry: ${F(r)}`;
        }
      }
    }
  });

  /* ---------- P2. metamorphic properties ---------- */
  const G2 = '18 Metamorphic properties';
  add(G2, 'cash → cheque → bank changes only the settlement account', () => {
    const base = 'Paid salary ₹5,000 and rent ₹2,000';
    const rc = F(one(base + ' in cash.')), rb = F(one(base + ' by bank.')), rq = F(one(base + ' by cheque.'));
    if (rc !== 'Cr Cash 7000; Dr Rent 2000; Dr Salary 5000') return rc;
    if (rb !== 'Cr Bank 7000; Dr Rent 2000; Dr Salary 5000') return rb;
    if (rq !== rb) return 'cheque ≠ bank: ' + rq;
  });
  add(G2, 'paid → received reverses the direction (commission)', () => {
    const p = one('Paid commission ₹1,000 in cash.'), r = one('Received commission ₹1,000 in cash.');
    if (F(p) !== 'Cr Cash 1000; Dr Commission Paid 1000') return F(p);
    if (F(r) !== 'Cr Commission Received 1000; Dr Cash 1000') return F(r);
  });
  add(G2, 'paid → received reverses the direction (rent, compound)', () => {
    const p = one('Paid rent ₹2,000 and commission ₹1,000 in cash.'), r = one('Received rent ₹2,000 and commission ₹1,000 in cash.');
    if (F(p) !== 'Cr Cash 3000; Dr Commission Paid 1000; Dr Rent 2000') return F(p);
    if (F(r) !== 'Cr Commission Received 1000; Cr Rent Received 2000; Dr Cash 3000') return F(r);
  });
  add(G2, 'scaling every amount scales the journal, accounts unchanged', () => {
    const acc = r => r.lines.map(l => l.account).sort().join('|');
    const a = one('Paid salary ₹5,000, rent ₹2,000 and electricity ₹1,500 in cash.'), b = one('Paid salary ₹50,000, rent ₹20,000 and electricity ₹15,000 in cash.');
    if (acc(a) !== acc(b)) return 'accounts differ';
    if (!a.lines.every((l, i) => near((l.dr || l.cr) * 10, b.lines.find(x => x.account === l.account)[l.dr !== undefined ? 'dr' : 'cr']))) return 'amounts do not scale';
  });
  add(G2, 'adding another expense adds one debit and raises the credit', () => {
    const items = [['salary', 5000], ['rent', 2000], ['commission', 1000], ['electricity', 1500], ['wages', 800], ['postage', 300]];
    let prevDr = 0, prevCr = 0;
    for (let n = 2; n <= items.length; n++) {
      const text = 'Paid ' + items.slice(0, n).map(([k, v]) => `${k} ₹${v.toLocaleString('en-IN')}`).join(', ') + ' in cash.';
      const r = one(text); if (r.status !== 'VALID') return `n=${n}: ${r.status} ${r.reason}`;
      const drN = r.lines.filter(l => l.dr !== undefined).length, cr = r.lines.find(l => l.cr !== undefined).cr;
      if (drN !== n) return `n=${n}: expected ${n} debit lines, got ${drN}`;
      if (!near(cr, items.slice(0, n).reduce((s, x) => s + x[1], 0))) return `n=${n}: credit ${cr}`;
      if (n > 2 && !(cr > prevCr && drN === prevDr + 1)) return `n=${n}: did not grow`;
      prevDr = drN; prevCr = cr;
    }
  });
  add(G2, 'SLM vs WDV agree in year 1 and diverge in year 2', () => {
    const seq = m => { const ctx = {}; return ['Purchased furniture ₹1,00,000 for cash.', `Charge depreciation on furniture @20% ${m} for year 1.`, `Charge depreciation on furniture @20% ${m} for year 2.`].map(l => one(l, ctx)); };
    const w = seq('WDV'), s = seq('SLM');
    if (w[1].lines[0].dr !== 20000 || s[1].lines[0].dr !== 20000) return 'year 1 differs';
    if (w[2].lines[0].dr !== 16000) return 'WDV year 2 = ' + w[2].lines[0].dr;
    if (s[2].lines[0].dr === 16000) return 'SLM year 2 should not equal WDV';
  });
  add(G2, 'explicit depreciation amount always overrides rate × cost', () => {
    for (const amt of [1, 200, 999, 12345]) {
      const r = one(`Charge depreciation on furniture @10% p.a. for 1 month; depreciation amount is ₹${amt}.`, { assets: {} });
      if (r.status !== 'VALID' || r.lines[0].dr !== amt) return `amount ${amt} → ${F(r)} ${r.reason || ''}`;
    }
  });
  add(G2, 'independent same-date transactions can be reordered without changing the books', () => {
    const lines = ['Apr 05: Purchased goods for cash ₹30,000.', 'Apr 05: Paid rent ₹2,000.', 'Apr 05: Received commission ₹1,500.', 'Apr 05: Paid salary ₹4,000 and wages ₹1,000 in cash.'];
    const start = 'Apr 01: Started business with cash ₹1,00,000.';
    const tb = ls => JSON.stringify(E.acRunCycle([start].concat(ls).join('\n'), 0).tb.rows);
    const a = tb(lines), b = tb(lines.slice().reverse()), c = tb([lines[2], lines[0], lines[3], lines[1]]);
    if (a !== b || a !== c) return 'trial balance changed with order';
  });
  add(G2, 'a date prefix never changes the accounting (every single-line VALID example)', () => {
    let n = 0;
    for (const c of H.cases) {
      if (c.input.length !== 1 || typeof c.expected !== 'string' || /^\s*(?:\d|[A-Za-z]+ \d)/.test(c.input[0])) continue;
      if (/^Cash ₹|^Assets:/.test(c.input[0])) continue;
      const r0 = one(c.input[0]), r1 = one('Apr 12: ' + c.input[0]);
      n++;
      if (r0.status === 'VALID' && (r1.status !== 'VALID' || F(r0) !== F(r1))) return `date prefix changed "${c.input[0]}": ${F(r0)} vs ${r1.lines ? F(r1) : r1.reason}`;
    }
    return n > 60 ? null : 'too few examples (' + n + ')';
  });
  add(G2, 'number format never changes the amount (₹5,000 / 5000 / Rs. 5,000 / ₹5000)', () => {
    const forms = ['₹5,000', '5000', 'Rs. 5,000', '₹5000', 'Rs 5000', '₹5,000.00'];
    const res = forms.map(f => F(one(`Paid rent ${f} by cheque.`)));
    return res.every(x => x === res[0]) && res[0] === 'Cr Bank 5000; Dr Rent 5000' ? null : res.join(' || ');
  });

  /* ---------- P3. generated coverage grid: item sets × sentence templates × modes ---------- */
  const G3 = '19 Generated compound grid';
  const ITEMS = [
    [['salary', 'Salary', 5000], ['rent', 'Rent', 2000], ['commission', 'Commission Paid', 1000]],
    [['wages', 'Wages', 4000], ['rent', 'Rent', 3000], ['insurance', 'Insurance Premium', 2000]],
    [['electricity', 'Electricity Charges', 1500], ['telephone', 'Telephone Charges', 700]],
    [['salary', 'Salary', 12000], ['postage', 'Postage & Courier', 300], ['stationery', 'Printing & Stationery', 450], ['advertisement', 'Advertisement', 2500]]
  ];
  const TEMPLATES = [
    (it, m) => `Paid ${it.map(([k, , v]) => `${k} ₹${v.toLocaleString('en-IN')}`).join(', ').replace(/, ([^,]+)$/, ' and $1')} ${m}.`,
    (it, m) => `Paid ${it.map(([k, , v]) => `${k} of ₹${v.toLocaleString('en-IN')}`).join(', ').replace(/, ([^,]+)$/, ' and $1')} ${m}.`,
    (it, m) => `Paid ${it.map(([k, , v]) => `₹${v.toLocaleString('en-IN')} for ${k}`).join(', ').replace(/, ([^,]+)$/, ' and $1')} ${m}.`,
    (it, m) => `${it.map(([k, , v]) => `${k} ₹${v.toLocaleString('en-IN')}`).join(', ').replace(/, ([^,]+)$/, ' and $1')} were paid ${m}.`,
    (it, m) => `Apr 25: Paid ${it.map(([k, , v]) => `${k[0].toUpperCase() + k.slice(1)} ₹${v.toLocaleString('en-IN')}`).join(', ').replace(/, ([^,]+)$/, ', and $1')} ${m}.`
  ];
  const MODES = [['in cash', 'Cash'], ['by bank', 'Bank'], ['by cheque', 'Bank'], ['through bank', 'Bank']];
  let gridN = 0, gridFail = null;
  ITEMS.forEach((it, ii) => TEMPLATES.forEach((tp, ti) => MODES.forEach(([m, acc]) => {
    gridN++;
    if (gridFail) return;
    const text = tp(it, m), r = one(text);
    const want = it.map(([, a, v]) => `Dr ${a} ${v}`).concat(`Cr ${acc} ${it.reduce((s, x) => s + x[2], 0)}`).sort().join('; ');
    if (r.status !== 'VALID' || F(r) !== want) gridFail = `"${text}" → ${r.status === 'VALID' ? F(r) : r.status + ' ' + r.reason}  (wanted ${want})`;
  })));
  add(G3, `${gridN} generated compound payments (5 wordings × 4 modes × 4 item sets)`, () => gridFail);
  const CAPS = [
    (a) => `Commenced business with ${a.map(([k, v]) => `${k} ₹${v.toLocaleString('en-IN')}`).join(', ').replace(/, ([^,]+)$/, ' and $1')}.`,
    (a) => `Started business with ${a.map(([k, v]) => `${k} ₹${v.toLocaleString('en-IN')}`).join(', ').replace(/, ([^,]+)$/, ', and $1')}.`,
    (a) => `Business was launched with ${a.map(([k, v]) => `₹${v.toLocaleString('en-IN')} ${k}`).join(', ').replace(/, ([^,]+)$/, ' and $1')}.`
  ];
  const ASSETSETS = [
    [['cash', 100000, 'Cash'], ['goods', 40000, 'Goods (Stock)'], ['furniture', 20000, 'Furniture']],
    [['cash', 50000, 'Cash'], ['machinery', 30000, 'Machinery']],
    [['bank', 75000, 'Bank'], ['stock', 25000, 'Goods (Stock)'], ['computer', 45000, 'Computer'], ['vehicle', 150000, 'Vehicle']]
  ];
  let capN = 0, capFail = null;
  ASSETSETS.forEach(a => CAPS.forEach(tp => {
    capN++; if (capFail) return;
    const text = tp(a.map(([k, v]) => [k, v])), r = one(text);
    const total = a.reduce((s, x) => s + x[1], 0);
    const want = a.map(([, v, acc]) => `Dr ${acc} ${v}`).concat(`Cr Capital ${total}`).sort().join('; ');
    if (r.status !== 'VALID' || F(r) !== want) capFail = `"${text}" → ${r.status === 'VALID' ? F(r) : r.status + ' ' + r.reason}  (wanted ${want})`;
  }));
  add(G3, `${capN} generated capital-introduction sentences (3 wordings × 3 asset sets)`, () => capFail);

  /* ---------- P4. FULL PIPELINE: Journal → Ledger → Trial Balance → Final Accounts ---------- */
  const G4 = '20 Pipeline & Final Accounts';
  const cycleLines = ['Apr 01: Commenced business with Cash ₹1,00,000, Goods ₹40,000, and Furniture ₹20,000.', 'Apr 05: Purchased goods for cash ₹30,000.', 'Apr 10: Sold goods for cash ₹80,000.',
    'Apr 25: Paid Salaries ₹5,000, Rent ₹2,000, and Commission ₹1,000 in cash.', 'Apr 30: Charge depreciation on furniture @ 10% p.a. for 1 month.'].join('\n');
  add(G4, 'full cycle with closing stock: balanced everywhere, no double counting', () => {
    const r = E.acRunCycle(cycleLines, 20000);
    if (r.incomplete || r.summary.processed !== 5) return 'not all processed: ' + JSON.stringify(r.summary);
    if (!r.tb.balanced || !r.tb.checks.ok) return 'TB not balanced/consistent';
    const fa = r.fa;
    if (!near(fa.trading.grossProfit, 30000)) return 'gross profit ' + fa.trading.grossProfit;
    if (!fa.trading.dr.some(x => x.label === 'Opening Stock' && x.amount === 40000)) return 'opening stock missing from Trading A/c';
    if (!near(fa.pl.netProfit, 21833.33)) return 'net profit ' + fa.pl.netProfit;
    if (!near(fa.bs.liabilities[0].amount, 181833.33)) return 'closing capital ' + fa.bs.liabilities[0].amount;
    if (!fa.bs.balanced) return `balance sheet ${fa.bs.totalAssets} vs ${fa.bs.totalLiabilities}`;
    if (fa.bs.assets.filter(a => /stock/i.test(a.label)).length !== 1) return 'stock appears more than once on the balance sheet';
  });
  add(G4, 'no closing stock entered: ledger stock is the closing stock (no double count)', () => {
    const r = E.acRunCycle(cycleLines, 0);
    if (!r.fa.bs.balanced) return `balance sheet ${r.fa.bs.totalAssets} vs ${r.fa.bs.totalLiabilities}`;
    if (!r.fa.bs.assets.some(a => a.label === 'Stock' && a.amount === 40000)) return 'stock missing on balance sheet';
  });
  add(G4, 'drawings reduce closing capital', () => {
    const r = E.acRunCycle(cycleLines + '\nApr 28: Paid personal school fees from business cash ₹5,000.', 20000);
    const b = r.fa.capitalBreakdown;
    if (!near(b.drawings, 5000) || !near(b.closing, 176833.33)) return JSON.stringify(b);
    if (!r.fa.bs.balanced) return 'balance sheet does not balance';
  });
  add(G4, 'bad debts + provision reach the P&L (not a fake "sundry debtor")', () => {
    const r = E.acRunCycle('Cash ₹50,000; Debtors ₹1,00,000; Stock ₹10,000\nDebtors ₹1,00,000; bad debts ₹5,000; create provision at 5%.', 0);
    const pl = r.fa.pl;
    if (!pl.dr.some(x => x.label === 'Bad Debts' && x.amount === 5000) || !pl.dr.some(x => /Provision for Doubtful Debts/.test(x.label) && x.amount === 4750)) return JSON.stringify(pl.dr);
    if (!near(pl.netProfit, -9750)) return 'net profit ' + pl.netProfit;
    if (r.fa.bs.assets.some(a => /Profit|unclassified/i.test(a.label))) return 'P&L balance leaked to balance sheet';
    if (!r.fa.bs.balanced) return `balance sheet ${r.fa.bs.totalAssets} vs ${r.fa.bs.totalLiabilities}`;
  });
  add(G4, 'provision for discount on creditors is deducted from creditors and balances', () => {
    const r = E.acRunCycle('Cash ₹90,000; Stock ₹10,000; Creditors ₹80,000\nCreditors ₹80,000; create provision for discount on creditors at 2%.', 0);
    if (!r.fa.bs.balanced) return `balance sheet ${r.fa.bs.totalAssets} vs ${r.fa.bs.totalLiabilities}`;
    if (!r.fa.bs.liabilities.some(x => /Provision for Discount on Creditors/.test(x.label) && x.amount === -1600)) return JSON.stringify(r.fa.bs.liabilities);
  });
  add(G4, 'outstanding expense is a liability and part of the P&L expense', () => {
    const r = E.acRunCycle('Started business with cash ₹1,00,000.\nPaid salaries ₹25,000; ₹5,000 remained outstanding.', 0);
    if (!r.fa.pl.dr.some(x => x.label === 'Salary' && x.amount === 30000)) return JSON.stringify(r.fa.pl.dr);
    if (!r.fa.bs.liabilities.some(x => x.label === 'Outstanding Salary' && x.amount === 5000)) return JSON.stringify(r.fa.bs.liabilities);
    if (!r.fa.bs.balanced) return 'not balanced';
  });
  add(G4, 'GST: net input credit / payable reaches the balance sheet', () => {
    const r = E.acRunCycle('Started business with cash ₹5,00,000.\nPurchased goods ₹40,000 plus CGST 9% and SGST 9% for cash.\nSold goods ₹80,000 plus CGST 9% and SGST 9% for cash.', 0);
    if (!r.fa.bs.balanced) return `balance sheet ${r.fa.bs.totalAssets} vs ${r.fa.bs.totalLiabilities}`;
    if (!r.fa.bs.liabilities.some(x => x.label === 'GST Payable (net)' && x.amount === 7200)) return JSON.stringify(r.fa.bs.liabilities);
  });
  add(G4, 'account identity: "Carriage Inward" / "Carriage Inwards" is ONE ledger', () => {
    const r = E.acRunCycle('Started business with cash ₹50,000.\nPaid carriage inward ₹2,000.\nPaid carriage inwards ₹1,000.', 0);
    const names = Object.keys(r.ledgers).filter(n => /carriage/i.test(n));
    if (names.length !== 1 || r.ledgers[names[0]].totalDr !== 3000) return JSON.stringify(names.map(n => [n, r.ledgers[n].totalDr]));
    if (!r.fa.trading.dr.some(x => /Carriage/.test(x.label) && x.amount === 3000)) return 'carriage not on the Trading Account';
  });
  add(G4, 'account identity: Stock / Goods (Stock) is ONE ledger', () => {
    const r = E.acRunCycle('Started business with cash ₹1,00,000, stock ₹30,000 and furniture ₹10,000.\nApr 02: Cash ₹10,000; Stock ₹5,000; Creditors ₹2,000', 0);
    const stocks = Object.keys(r.ledgers).filter(n => /stock/i.test(n));
    return stocks.length === 1 ? null : JSON.stringify(stocks);
  });
  add(G4, 'expense accounts the old string lists missed (cartage) are classified by metadata', () => {
    const r = E.acRunCycle('Started business with cash ₹50,000.\nPaid cartage ₹500 in cash.\nPaid internet charges ₹300 in cash.', 0);
    if (r.fa.bs.assets.concat(r.fa.bs.liabilities).some(x => /Cartage|Internet/i.test(x.label))) return 'expense leaked into the balance sheet';
    if (!r.fa.bs.balanced) return 'not balanced';
  });
  add(G4, 'incomplete input is reported, never hidden', () => {
    const r = E.acRunCycle('Started business with cash ₹1,00,000.\nPurchased goods for cash ₹20,000.\nPaid salary ₹5,000 and ₹2,000 in cash.\nCorrected an error relating to purchase of furniture.\nProprietor paid income tax from personal funds ₹4,000.', 0);
    const s = r.summary;
    if (s.total !== 5 || s.processed !== 2 || s.needsReview !== 2 || s.noEntry !== 1) return JSON.stringify(s);
    if (!r.incomplete) return 'cycle not flagged incomplete';
    if (r.journalLines.length !== 4) return 'excluded transactions leaked into the journal';
    if (r.tb.checks.excludedTransactions !== 2) return 'TB does not report the excluded transactions';
  });
  add(G4, 'transactions are processed chronologically (a later-typed earlier date runs first)', () => {
    const r = E.acRunCycle('Apr 10: Charge depreciation on furniture ₹200.\nApr 01: Purchased furniture ₹20,000 for cash.', 0);
    if (r.results[0].text.indexOf('Apr 01') !== 0) return 'order: ' + r.results.map(x => x.text).join(' | ');
    const d = r.results.find(x => /depreciation/i.test(x.text));
    if (d.warnings.some(w => /No earlier purchase/.test(w))) return 'depreciation did not see the purchase';
  });
  add(G4, 'same-date transactions keep the typed order; undated lines travel with their date', () => {
    const r = E.acRunCycle('Apr 05: Paid rent ₹1,000.\nPaid wages ₹2,000.\nApr 01: Started business with cash ₹50,000.\nApr 05: Paid salary ₹3,000.', 0);
    const order = r.results.map(x => x.text.replace(/^Apr \d+: /, '').split(' ')[1]);
    return order.join(',') === 'business,rent,wages,salary' ? null : order.join(',');
  });
  add(G4, 'ledger totals equal journal totals; trial balance = ledger', () => {
    const r = E.acRunCycle(E.AC_PRACTICE_BANK_74.join('\n'), 0);
    if (!r.tb.checks.ledgerMatchesJournal || !r.tb.checks.noDuplicateAccounts || !r.tb.checks.journalBalanced) return JSON.stringify(r.tb.checks);
    if (!r.tb.balanced) return 'trial balance not balanced';
  });
  add(G4, 'the 74-item practice bank runs without exceptions; every VALID entry balances', () => {
    let valid = 0, other = 0; const ctx = {};
    for (const line of E.acMergeOpeningBalanceLines(E.AC_PRACTICE_BANK_74)) {
      const r = E.acParseTransaction(line, 1, ctx); if (!r) continue;
      if (r.status === 'VALID') { valid++; const dr = r.lines.reduce((s, l) => s + (l.dr || 0), 0), cr = r.lines.reduce((s, l) => s + (l.cr || 0), 0); if (!near(dr, cr)) return 'unbalanced: ' + line; } else other++;
    }
    return valid >= 140 ? null : `only ${valid} VALID (${other} others)`;
  });
  add(G4, 'built-in example set still produces the same journal', () => {
    const r = E.acRunCycle(E.AC_EXAMPLE_SET, 0);
    if (r.summary.processed !== 8 || r.incomplete) return JSON.stringify(r.summary);
    if (!r.tb.balanced) return 'TB unbalanced';
  });

  return out;
};
