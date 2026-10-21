// Loads the browser script accounting-cycle.js into a Node vm sandbox so its pure engine
// functions can be tested without a browser. No dependencies.
const fs = require('fs'), vm = require('vm'), path = require('path');
module.exports = function loadEngine(file) {
  file = file || path.join(__dirname, '..', 'accounting-cycle.js');
  const code = fs.readFileSync(file, 'utf8');
  const sandbox = { console, Math, Date, JSON, Set, Map, RegExp, parseFloat, parseInt, isNaN, Object, Array, String, Number, Intl };
  sandbox.globalThis = sandbox; sandbox.window = sandbox;
  vm.createContext(sandbox);
  const names = ['acParseTransaction', 'acRunCycle', 'acBuildLedgers', 'acBuildTrialBalance', 'acBuildFinalAccounts',
    'acMergeOpeningBalanceLines', 'acCanonAccount', 'acAccountMeta', 'acExtractAmounts', 'acExtractDate', 'acRound2', 'acFmt',
    'AC_PRACTICE_BANK_74', 'AC_EXAMPLE_SET', 'acChronological'];
  vm.runInContext(code + '\n;' + names.map(n => `try{globalThis.${n}=${n};}catch(e){}`).join('\n'), sandbox, { filename: file });
  return sandbox;
};
