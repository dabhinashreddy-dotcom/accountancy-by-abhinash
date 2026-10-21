#!/usr/bin/env node
/* ============================================================
   Accounting Cycle Generator — regression + property test suite
   Run:  node tests/run-tests.js          (from the site's root folder)
   No dependencies. Loads ../accounting-cycle.js into a Node vm.
   ============================================================ */
const loadEngine = require('./loader.js');
const E = loadEngine();
const path = require('path');

const cases = [];
const groups = {};
// t(group, name, input(s), expected)
//   input    : one transaction string, or an array (a sequence sharing one accounting state)
//   expected : "Dr Cash 1000; Cr Capital 1000"   (checked on the LAST transaction)
//              { s: 'UNCERTAIN'|'INVALID'|'NO_ENTRY_REQUIRED'|'VALID', has: 'text in reason/warnings/assumptions' }
//              [ ...one expectation per step, null to skip a step ]
function t(group, name, input, expected) {
  cases.push({ group, name, input: Array.isArray(input) ? input : [input], expected });
}
const strip = a => a.replace(/ A\/c$/, '');
const num = n => String(Math.round(n * 100) / 100);
function fmt(lines) {
  return (lines || []).map(l => l.dr !== undefined ? `Dr ${strip(l.account)} ${num(l.dr)}` : `Cr ${strip(l.account)} ${num(l.cr)}`).sort().join('; ');
}
function normExpected(str) {
  return str.split(';').map(x => x.trim()).filter(Boolean).map(x => {
    const m = /^(Dr|Cr)\s+(.+?)\s+([\d.]+)$/.exec(x);
    if (!m) throw new Error('bad expected string: ' + x);
    return `${m[1]} ${m[2]} ${num(parseFloat(m[3]))}`;
  }).sort().join('; ');
}
function runSeq(inputs, ctx) {
  ctx = ctx || {};
  const merged = E.acMergeOpeningBalanceLines(inputs.map(s => s.trim()).filter(Boolean));
  return { ctx, results: merged.map((l, i) => E.acParseTransaction(l, i + 1, ctx)).filter(Boolean) };
}
function check(exp, r) {
  if (exp === null || exp === undefined) return null;
  if (typeof exp === 'string') {
    if (r.status !== 'VALID') return `expected a VALID entry but got [${r.status}] ${r.reason}`;
    const got = fmt(r.lines), want = normExpected(exp);
    return got === want ? null : `\n      expected: ${want}\n      got:      ${got}`;
  }
  if (exp.s && r.status !== exp.s) return `expected status ${exp.s} but got ${r.status}${r.reason ? ' — ' + r.reason : ''}`;
  if (exp.entry) { const got = fmt(r.lines || r.proposedLines), want = normExpected(exp.entry); if (got !== want) return `\n      expected: ${want}\n      got:      ${got}`; }
  if (exp.has) {
    const hay = [r.reason || '', ...(r.warnings || []), ...(r.assumptions || []), r.narration || ''].join(' | ').toLowerCase();
    if (!hay.includes(exp.has.toLowerCase())) return `expected text "${exp.has}" in reason/warnings/assumptions, got: ${hay.slice(0, 200)}`;
  }
  return null;
}

// ---- register the cases ----
require('./cases-a.js')(t, E);
require('./cases-b.js')(t, E);
require('./cases-c.js')(t, E);
require('./cases-d.js')(t, E);

let pass = 0, fail = 0; const failures = [];
cases.forEach(c => {
  const { results } = runSeq(c.input);
  let err = null;
  if (Array.isArray(c.expected)) {
    for (let i = 0; i < c.expected.length && !err; i++) { const e = check(c.expected[i], results[i]); if (e) err = `step ${i + 1}: ${e}`; }
  } else {
    const last = results[results.length - 1];
    err = last ? check(c.expected, last) : 'no result';
  }
  groups[c.group] = groups[c.group] || { pass: 0, fail: 0 };
  if (err) { fail++; groups[c.group].fail++; failures.push({ c, err }); } else { pass++; groups[c.group].pass++; }
});

// ---- property / invariant / pipeline tests ----
const props = require('./properties.js')(E, { runSeq, fmt, cases });
props.forEach(p => {
  groups[p.group] = groups[p.group] || { pass: 0, fail: 0 };
  if (p.err) { fail++; groups[p.group].fail++; failures.push({ c: { group: p.group, name: p.name, input: [] }, err: p.err }); } else { pass++; groups[p.group].pass++; }
});

console.log('\nAccounting Cycle regression suite');
console.log('='.repeat(60));
Object.keys(groups).forEach(g => console.log(`${(groups[g].fail ? 'FAIL' : 'PASS')}  ${g.padEnd(34)} ${groups[g].pass} passed / ${groups[g].fail} failed`));
console.log('='.repeat(60));
console.log(`TOTAL: ${pass} passed / ${fail} failed  (${cases.length} example transactions + ${props.length} property/pipeline checks)`);
if (failures.length) {
  console.log('\nFAILURES');
  failures.forEach(f => console.log(`\n[${f.c.group}] ${f.c.name}\n    input: ${(f.c.input || []).join('  ⏎  ')}\n    ${f.err}`));
  process.exit(1);
}
