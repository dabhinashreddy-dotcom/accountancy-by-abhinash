#!/usr/bin/env node
/* ============================================================
   Calculator — engine + input-model tests
   Run:  node tests/calculator-tests.js      (from the site's root folder)
   No dependencies. Loads ../calculator.js directly (it has no DOM at module level).
   ============================================================ */
const path = require("path");
const Calc = require(path.join(__dirname, "..", "calculator.js"));

let pass = 0, fail = 0;
const failures = [];
function check(name, actual, expected) {
  const ok = typeof expected === "number" && typeof actual === "number"
    ? Math.abs(actual - expected) < 1e-12 * Math.max(1, Math.abs(expected))
    : actual === expected;
  if (ok) pass++; else { fail++; failures.push(`${name}\n      expected: ${JSON.stringify(expected)}\n      actual:   ${JSON.stringify(actual)}`); }
}
const MINUS = "\u2212", TIMES = "\u00D7", DIV = "\u00F7";

/* ---- engine: calc(expr) → value or error text ---- */
function calc(expr, angle) {
  const r = Calc.calculate(expr, { angle: angle || "deg" });
  return r.ok ? r.value : r.error;
}

// Basic
check("10 + 20", calc("10 + 20"), 30);
check("100 - 75", calc("100 - 75"), 25);
check("8 × 9", calc("8 × 9"), 72);
check("100 ÷ 4", calc("100 ÷ 4"), 25);
check("500 - 125", calc("500 - 125"), 375);
check("25 × 4", calc("25 × 4"), 100);
check("1000 ÷ 8", calc("1000 ÷ 8"), 125);
check("100 + 50", calc("100 + 50"), 150);
check("ascii operators 6*7/2", calc("6*7/2"), 21);

// Order of operations / parentheses
check("2 + 3 × 4", calc("2 + 3 × 4"), 14);
check("(2 + 3) × 4", calc("(2 + 3) × 4"), 20);
check("(500 + 250) × 2", calc("(500 + 250) × 2"), 1500);
check("10 - 2 - 3 left-assoc", calc("10 - 2 - 3"), 5);
check("100 ÷ 5 ÷ 2 left-assoc", calc("100 ÷ 5 ÷ 2"), 10);
check("2^3^2 right-assoc", calc("2^3^2"), 512);
check("-2² = -4", calc("-2²"), -4);
check("(-2)² = 4", calc("(-2)²"), 4);
check("nested parens", calc("((1+2)×(3+4))"), 21);
check("auto-close '(500+250'", calc("(500+250"), 750);
check("auto-close 'sin(30'", calc("sin(30"), 0.5);

// Percentages (accounting semantics)
check("100 × 18%", calc("100 × 18%"), 18);
check("125000 × 18%", calc("125000 × 18%"), 22500);
check("250 + 10%", calc("250 + 10%"), 275);
check("500 − 20%", calc("500 \u2212 20%"), 400);
check("(100+200) × 18%", calc("(100 + 200) × 18%"), 54);
check("200 ÷ 50%", calc("200 ÷ 50%"), 400);
check("50%", calc("50%"), 0.5);
check("50% + 25% stays plain", calc("50% + 25%"), 0.75);
check("100 + 50 + 10% (base is running total)", calc("100 + 50 + 10%"), 165);
check("1000 + 18% GST", calc("1000 + 18%"), 1180);
check("1000 − 10% discount", calc("1000 \u2212 10%"), 900);

// Negatives
check("-500 + 250", calc("-500 + 250"), -250);
check("25 × -4", calc("25 × -4"), -100);
check("5 − (−3)", calc("5 \u2212 (\u22123)"), 8);
check("−−3 via unary", calc("--3"), 3);

// Scientific
check("√144", calc("√144"), 12);
check("√(144)", calc("√(144)"), 12);
check("12²", calc("12²"), 144);
check("2³", calc("2³"), 8);
check("2^4", calc("2^4"), 16);
check("2^-2", calc("2^-2"), 0.25);
check("2^0.5", calc("2^0.5"), Math.SQRT2);
check("1/x of 4 (4⁻¹)", calc("4\u207B\u00B9"), 0.25);
check("5!", calc("5!"), 120);
check("0!", calc("0!"), 1);
check("10!", calc("10!"), 3628800);
check("π", calc("π"), Math.PI);
check("e", calc("e"), Math.E);
check("2π implicit multiply", calc("2π"), 2 * Math.PI);
check("3(4+5) implicit multiply", calc("3(4+5)"), 27);
check("abs(-7)", calc("abs(-7)"), 7);
check("∛(27)", calc("\u221B(27)"), 3);
check("1.5E3", calc("1.5E3"), 1500);
check("1E-3", calc("1E\u22123"), 0.001);
check("EXP in expression 2E3 + 1", calc("2E3 + 1"), 2001);
check("log(1000)", calc("log(1000)"), 3);
check("log(100)", calc("log(100)"), 2);
check("ln(e)", calc("ln(e)"), 1);
check("ln(1)", calc("ln(1)"), 0);

// Trig – DEG
check("sin(30) DEG", calc("sin(30)"), 0.5);
check("cos(60) DEG", calc("cos(60)"), 0.5);
check("tan(45) DEG", calc("tan(45)"), 1);
check("sin(90) DEG", calc("sin(90)"), 1);
check("cos(90) DEG exact 0", calc("cos(90)"), 0);
check("sin(180) DEG exact 0", calc("sin(180)"), 0);
check("cos(180) DEG", calc("cos(180)"), -1);
check("sin(0)", calc("sin(0)"), 0);
check("sin(390) DEG", calc("sin(390)"), 0.5);
check("sin⁻¹(0.5) DEG", calc("sin\u207B\u00B9(0.5)"), 30);
check("cos⁻¹(0.5) DEG", calc("cos\u207B\u00B9(0.5)"), 60);
check("tan⁻¹(1) DEG", calc("tan\u207B\u00B9(1)"), 45);
check("tan(90) DEG is invalid", calc("tan(90)"), "Invalid calculation");
// Trig – RAD
check("sin(π/6) RAD", calc("sin(π÷6)", "rad"), 0.5);
check("cos(π) RAD", calc("cos(π)", "rad"), -1);
check("sin(π) RAD → 0 (no 1.2e-16)", calc("sin(π)", "rad"), 0);
check("tan(π/4) RAD", calc("tan(π÷4)", "rad"), 1);
check("sin⁻¹(1) RAD", calc("sin\u207B\u00B9(1)", "rad"), Math.PI / 2);
check("tan(π/2) RAD invalid", calc("tan(π÷2)", "rad"), "Invalid calculation");

// Floating-point cleanliness
check("0.1 + 0.2", calc("0.1 + 0.2"), 0.3);
check("0.1 + 0.2 formatted", Calc.formatNumber(calc("0.1 + 0.2"), "in"), "0.3");
check("0.1+0.2−0.3 = 0", calc("0.1 + 0.2 \u2212 0.3"), 0);
check("1.1 × 1.1", calc("1.1 × 1.1"), 1.21);
check("0.7 × 3", calc("0.7 × 3"), 2.1);
check("19.99 × 3", calc("19.99 × 3"), 59.97);
check("1 ÷ 3 formatted", Calc.formatNumber(calc("1 ÷ 3"), "in"), "0.333333333333333");
check("4.35 × 100", calc("4.35 × 100"), 435);

// Errors
check("1 ÷ 0", calc("1 ÷ 0"), "Cannot divide by zero");
check("0 ÷ 0", calc("0 ÷ 0"), "Cannot divide by zero");
check("5 ÷ (3−3)", calc("5 \u00F7 (3\u22123)"), "Cannot divide by zero");
check("1/x of 0", calc("0\u207B\u00B9"), "Cannot divide by zero");
check("0^-1", calc("0^-1"), "Cannot divide by zero");
check("5 +", calc("5 +"), "Invalid expression");
check("5 + × 3", calc("5 + \u00D7 3"), "Invalid expression");
check("× 5", calc("\u00D7 5"), "Invalid expression");
check("empty", calc(""), "Invalid expression");
check("only ')'", calc(")"), "Invalid expression");
check("5 )", calc("5)"), "Invalid expression");
check("()", calc("()"), "Invalid expression");
check("1.2.3", calc("1.2.3"), "Invalid expression");
check(". alone", calc("."), "Invalid expression");
check("1E alone", calc("1E"), "Invalid expression");
check("sin without bracket", calc("sin30"), "Invalid expression");
check("garbage letters", calc("abc"), "Invalid expression");
check("√(−4)", calc("\u221A(\u22124)"), "Invalid calculation");
check("ln(0)", calc("ln(0)"), "Invalid calculation");
check("ln(−1)", calc("ln(\u22121)"), "Invalid calculation");
check("log(0)", calc("log(0)"), "Invalid calculation");
check("sin⁻¹(2)", calc("sin\u207B\u00B9(2)"), "Invalid calculation");
check("(−8)^0.5", calc("(\u22128)^0.5"), "Invalid calculation");
check("2.5!", calc("2.5!"), "Invalid calculation");
check("(−3)!", calc("(\u22123)!"), "Invalid calculation");
check("171!", calc("171!"), "Result too large");
check("10^400", calc("10^400"), "Result too large");
check("9E999 literal", calc("9E999"), "Result too large");
check("huge product overflow", calc("1E200 × 1E200"), "Result too large");

// Security: nothing is executed
check("alert(1) is rejected", calc("alert(1)"), "Invalid expression");
check("constructor trick", calc("constructor"), "Invalid expression");
check("process.exit", calc("process.exit()"), "Invalid expression");
check("template literal", calc("`1`"), "Invalid expression");
check("deep nesting does not crash", calc("(".repeat(500) + "1" + ")".repeat(500)), "Invalid expression");
check("very long chain fine", calc(Array(300).fill("1").join("+")), 300);

// Formatting
check("fmt 500000 IN", Calc.formatNumber(500000, "in"), "5,00,000");
check("fmt 500000 INTL", Calc.formatNumber(500000, "intl"), "500,000");
check("fmt 22500 IN", Calc.formatNumber(22500, "in"), "22,500");
check("fmt 12345678.5 IN", Calc.formatNumber(12345678.5, "in"), "1,23,45,678.5");
check("fmt 1234567 INTL", Calc.formatNumber(1234567, "intl"), "1,234,567");
check("fmt 999 IN", Calc.formatNumber(999, "in"), "999");
check("fmt 1000 IN", Calc.formatNumber(1000, "in"), "1,000");
check("fmt negative", Calc.formatNumber(-250, "in"), "\u2212250");
check("fmt -1234.56", Calc.formatNumber(-1234.56, "in"), "\u22121,234.56");
check("fmt 0", Calc.formatNumber(0, "in"), "0");
check("fmt -0", Calc.formatNumber(-0, "in"), "0");
check("fmt 0.000123", Calc.formatNumber(0.000123, "in"), "0.000123");
check("fmt big → exponent", Calc.formatNumber(9.999999998e19, "in"), "9.999999998E19");
check("fmt small → exponent", Calc.formatNumber(1.5e-9, "in"), "1.5E\u22129");
check("fmt 1e15 exponent", Calc.formatNumber(1e15, "in"), "1E15");
check("fmt 123456789012345 (15 digits)", Calc.formatNumber(123456789012345, "in"), "12,34,56,78,90,12,345");
check("fmt NaN is blank", Calc.formatNumber(NaN, "in"), "");
check("fmt plain, no grouping", Calc.formatNumber(1234567.891, "none"), "1234567.891");
check("very large product value", calc("9999999999 × 9999999999"), 9.999999998e19);
check("very large product text", Calc.formatNumber(calc("9999999999 × 9999999999"), "in"), "9.999999998E19");
check("20!", Calc.formatNumber(calc("20!"), "none"), "2432902008176640000".length > 15 ? "2.43290200817664E18" : "");

/* ---- model: simulate pressing keys ---- */
function run(keys, o) {
  const m = new Calc.CalcModel(o);
  keys.forEach(k => m.press(k));
  return m;
}
function typed(str, o) { // type a string as a student would on a keyboard
  const m = new Calc.CalcModel(o);
  for (const ch of str) {
    const a = Calc.mapKey({ key: ch });
    if (a) m.press(a);
  }
  return m;
}
const show = m => m.expression;
const result = m => m.error ? m.error : (m.final ? m.value : "(not final)");

// Keyboard-only flows
check("kbd: 10+20=", result(typed("10+20=")), 30);
check("kbd: 100-75=", result(typed("100-75=")), 25);
check("kbd: 8*9=", result(typed("8*9=")), 72);
check("kbd: 100/4=", result(typed("100/4=")), 25);
check("kbd: 2+3*4=", result(typed("2+3*4=")), 14);
check("kbd: (2+3)*4=", result(typed("(2+3)*4=")), 20);
check("kbd: 100*18%=", result(typed("100*18%=")), 18);
check("kbd: 250+10%=", result(typed("250+10%=")), 275);
check("kbd: -500+250=", result(typed("-500+250=")), -250);
check("kbd: 25*-4=", result(typed("25*-4=")), -100);
check("kbd: (100+200)*18%=", result(typed("(100+200)*18%=")), 54);
check("kbd: 2^4=", result(typed("2^4=")), 16);
check("kbd: 5!=", result(typed("5!=")), 120);
check("kbd: .5+.25=", result(typed(".5+.25=")), 0.75);
check("kbd: comma as decimal (numpad)", result(typed("1,5+1=")), 2.5);
check("kbd: x as multiply", result(typed("6x7=")), 42);
check("kbd: r (√) 144", result(typed("r144=")), 12);
check("kbd: s30 = sin(30)", result(typed("s30=")), 0.5);
check("kbd: S0.5 = asin(.5)", result(typed("S0.5=")), 30);
check("kbd: l1000 = log", result(typed("l1000=")), 3);
check("kbd: p = π", result(typed("p=")), Math.PI);
check("kbd: 1E3+1", result(typed("1E3+1=")), 1001);
check("kbd: q after number squares", result(typed("12q=")), 144);
check("kbd: ^ and unclosed bracket", result(typed("2*(3+4=")), 14);
check("mapKey Enter", Calc.mapKey({ key: "Enter" }), "=");
check("mapKey Escape", Calc.mapKey({ key: "Escape" }), "AC");
check("mapKey ctrl+c passes through", Calc.mapKey({ key: "c", ctrlKey: true }), null);
check("mapKey meta+a passes through", Calc.mapKey({ key: "a", metaKey: true }), null);
check("mapKey numpad digit, NumLock off (key=Home)", Calc.mapKey({ key: "Home", code: "Numpad7" }), "7");
check("mapKey numpad decimal, NumLock off", Calc.mapKey({ key: "\u0000", code: "NumpadDecimal" }), ".");
check("mapKey numpad Enter", Calc.mapKey({ key: "Enter", code: "NumpadEnter" }), "=");
check("mapKey numpad ops", ["NumpadAdd", "NumpadSubtract", "NumpadMultiply", "NumpadDivide"].map(c => Calc.mapKey({ key: "?", code: c })).join(""), "+" + MINUS + TIMES + DIV);
check("mapKey Tab ignored", Calc.mapKey({ key: "Tab" }), null);
check("mapKey Space ignored", Calc.mapKey({ key: " " }), null);
check("mapKey F5 ignored", Calc.mapKey({ key: "F5" }), null);

// Input rules
check("rule: repeated operators collapse (5 + × ÷)", show(run(["5", "+", TIMES, DIV])), "5 " + DIV + " ");
check("rule: operator at start ignored", show(run([TIMES, "5"])), "5");
check("rule: leading − allowed", show(run([MINUS, "5"])), MINUS + "5");
check("rule: 25 × − 4", show(run(["2", "5", TIMES, MINUS, "4"])), "25 " + TIMES + " " + MINUS + "4");
check("rule: 5 × − then ÷ → 5 ÷", show(run(["5", TIMES, MINUS, DIV])), "5 " + DIV + " ");
check("rule: 5 + then − → 5 −", show(run(["5", "+", MINUS])), "5 " + MINUS + " ");
check("rule: 5 − then + → 5 +", show(run(["5", MINUS, "+"])), "5 + ");
check("rule: double minus ignored", show(run(["5", MINUS, MINUS])), "5 " + MINUS + " ");
check("rule: '+' after '(' ignored", show(run(["(", "+", "3"])), "(3");
check("rule: × after '(' ignored", show(run(["(", TIMES, "3"])), "(3");
check("rule: −  after '(' allowed", show(run(["(", MINUS, "3"])), "(" + MINUS + "3");
check("rule: no leading zeros 007", show(run(["0", "0", "7"])), "7");
check("rule: 0 stays 0", show(run(["0", "0"])), "0");
check("rule: 0.5 allowed", show(run(["0", ".", "5"])), "0.5");
check("rule: 10 keeps its zero", show(run(["1", "0"])), "10");
check("rule: second decimal point ignored", show(run(["1", ".", "2", ".", "3"])), "1.23");
check("rule: lone . becomes 0.", show(run(["."])), "0.");
check("rule: . after operator → 0.", show(run(["5", "+", "."])), "5 + 0.");
check("rule: ) with nothing open ignored", show(run(["5", ")"])), "5");
check("rule: ) right after ( ignored", show(run(["(", ")"])), "(");
check("rule: ) after operator ignored", show(run(["(", "5", "+", ")"])), "(5 + ");
check("rule: % at start ignored", show(run(["%"])), "");
check("rule: % after operator ignored", show(run(["5", "+", "%"])), "5 + ");
check("rule: ! after number", show(run(["5", "!"])), "5!");
check("rule: implicit × before ( after number", show(run(["2", "("])), "2 " + TIMES + " (");
check("rule: implicit × digit after )", show(run(["(", "2", ")", "3"])), "(2) " + TIMES + " 3");
check("rule: implicit × before function after number", show(run(["3", "sin("])), "3 " + TIMES + " sin(");
check("rule: implicit × π after number", show(run(["2", "\u03C0"])), "2 " + TIMES + " \u03C0");
check("rule: EXP needs a number", show(run(["E"])), "");
check("rule: EXP once", show(run(["2", "E", "E"])), "2E");
check("rule: EXP then sign then digits", show(run(["2", "E", MINUS, "3"])), "2E" + MINUS + "3");
check("rule: operator after EXP sign ignored", show(run(["2", "E", MINUS, TIMES])), "2E" + MINUS);
check("rule: second decimal after EXP ignored", show(run(["2", "E", "3", "."])), "2E3");

// AC / CE / Backspace / Delete
check("AC clears everything", show(run(["1", "+", "2", "AC"])), "");
check("AC clears an error", run(["1", DIV, "0", "=", "AC"]).error, null);
check("CE removes just the current number", show(run(["5", "+", "1", "2", "3", "CE"])), "5 + ");
check("CE removes the unary minus with it", show(run(["5", TIMES, MINUS, "4", "CE"])), "5 " + TIMES + " ");
check("CE on a bracket group removes the group", show(run(["2", "+", "(", "3", "+", "4", ")", "CE"])), "2 + ");
check("CE after result = AC", show(run(["1", "+", "2", "=", "CE"])), "");
check("Backspace removes last char", show(run(["1", "2", "3", "BKSP"])), "12");
check("Backspace removes whole 'sin('", show(run(["sin(", "BKSP"])), "");
check("Backspace removing 'sin(' also removes its ')'", show(run(["sin(", "3", "0", ")", "LEFT", "LEFT", "LEFT", "BKSP"])), "30");
check("Backspace on empty is safe", show(run(["BKSP", "BKSP"])), "");
check("Backspace after = edits the expression", show(run(["1", "2", "+", "3", "=", "BKSP"])), "12 + ");
check("Backspace after = leaves result mode", run(["1", "+", "3", "=", "BKSP"]).final, false);
check("Delete removes char ahead of caret", show(run(["1", "2", "3", "LEFT", "LEFT", "DEL"])), "13");
check("Delete at end clears current entry", show(run(["5", "+", "1", "2", "DEL"])), "5 + ");
check("Home / End", show(run(["1", "2", "HOME", "9", "END", "8"])), "9128");
check("Left / Right caret insert", show(run(["1", "3", "LEFT", "2"])), "123");
check("Right does not run past end", show(run(["1", "RIGHT", "RIGHT", "2"])), "12");

// Equals / continuing
check("continue: 5+5= then +3=", result(run(["5", "+", "5", "=", "+", "3", "="])), 13);
check("continue: 100*18%= then ÷ 3 =", result(run(["1", "0", "0", TIMES, "1", "8", "%", "=", DIV, "3", "="])), 6);
check("continue: new number after = starts fresh", show(run(["1", "+", "2", "=", "7"])), "7");
check("continue: function after = starts fresh", show(run(["1", "+", "2", "=", "sin("])), "sin(");
check("continue from negative result", result(run([MINUS, "5", "+", "2", "=", TIMES, "2", "="])), -6);
check("continue from exponent result", result(run(["1", "E", "2", "0", "=", TIMES, "2", "="])), 2e20);
check("= twice does nothing odd", result(run(["2", "+", "2", "=", "="])), 4);
check("= on empty is safe", run(["="]).final, false);
check("error then edit: 5÷0 then fix", result(run(["5", DIV, "0", "=", "BKSP", "2", "="])), 2.5);
check("error leaves expression visible", show(run(["5", DIV, "0", "="])), "5 " + DIV + " 0");
check("incomplete expression error", run(["5", "+", "="]).error, "Invalid expression");
check("auto-closes brackets on =", show(run(["(", "2", "+", "3", "="])), "(2 + 3)");
check("auto-close sin( on =", result(run(["sin(", "3", "0", "="])), 0.5);
check("lone number = doesn't spam history", run(["5", "="]).history.length, 0);
check("expression = adds history", run(["5", "+", "5", "="]).history.length, 1);
check("history text", run(["5", "0", "0", TIMES, "1", "8", "%", "="]).history[0].e, "500 " + TIMES + " 18%");
check("history value", run(["5", "0", "0", TIMES, "1", "8", "%", "="]).history[0].v, 90);
check("history newest first", run(["1", "+", "1", "=", "AC", "2", "+", "2", "="]).history[0].v, 4);
check("history dedupes immediate repeat", run(["1", "+", "1", "=", "AC", "1", "+", "1", "="]).history.length, 1);
check("history capped at 50", (() => { const m = new Calc.CalcModel(); for (let i = 1; i <= 60; i++) { m.press("AC"); m.press("1"); m.press("+"); String(i).split("").forEach(d => m.press(d)); m.press("="); } return m.history.length; })(), 50);
check("history clear", (() => { const m = run(["1", "+", "1", "="]); m.clearHistory(); return m.history.length; })(), 0);

// History navigation + reuse
check("↑ loads last calculation", show(run(["2", "+", "3", "=", "AC", "UP"])), "2 + 3");
check("↑↑ goes further back", show(run(["2", "+", "3", "=", "AC", "4", TIMES, "5", "=", "AC", "UP", "UP"])), "2 + 3");
check("↓ returns to draft", show(run(["2", "+", "3", "=", "AC", "7", "UP", "DOWN"])), "7");
check("↑ with no history is safe", show(run(["UP", "DOWN"])), "");
check("↑ stops at oldest", show(run(["2", "+", "3", "=", "AC", "UP", "UP", "UP"])), "2 + 3");
check("history reuse then edit", result(run(["2", "+", "3", "=", "AC", "UP", "+", "1", "="])), 6);
check("loadExpression round-trips functions", (() => { const m = new Calc.CalcModel(); m.loadExpression("sin(30) + \u221A(16)"); m.press("="); return m.value; })(), 4.5);
check("insertValue (history result)", show((() => { const m = new Calc.CalcModel(); m.press("5"); m.press("+"); m.insertValue(90); return m; })()), "5 + 90");
check("insertValue negative gets brackets", show((() => { const m = new Calc.CalcModel(); m.press("5"); m.press("+"); m.insertValue(-3); return m; })()), "5 + (" + MINUS + "3)");

// ± sign change
check("± on empty starts negative", show(run(["\u00B1"])), MINUS);
check("± negates number", show(run(["5", "\u00B1"])), MINUS + "5");
check("± twice restores", show(run(["5", "\u00B1", "\u00B1"])), "5");
check("± acts on the current operand", show(run(["5", TIMES, "3", "\u00B1"])), "5 " + TIMES + " " + MINUS + "3");
check("± after + wraps in brackets", show(run(["5", "+", "3", "\u00B1"])), "5 + (" + MINUS + "3)");
check("± again unwraps", show(run(["5", "+", "3", "\u00B1", "\u00B1"])), "5 + 3");
check("± on bracket group", show(run(["(", "2", "+", "3", ")", "\u00B1"])), MINUS + "(2 + 3)");
check("± evaluates right", result(run(["5", "+", "3", "\u00B1", "="])), 2);
check("± after result negates it", result(run(["2", "+", "3", "=", "\u00B1", "="])), -5);

// Memory
check("M+ stores value", run(["5", "0", "M+"]).memory, 50);
check("M+ accumulates", run(["5", "0", "M+", "AC", "2", "5", "M+"]).memory, 75);
check("M− subtracts", run(["5", "0", "M+", "AC", "2", "0", "M\u2212"]).memory, 30);
check("M+ uses live result of expression", run(["2", "+", "3", "M+"]).memory, 5);
check("M+ after = uses the result", run(["2", "+", "3", "=", "M+"]).memory, 5);
check("M+ with empty display does nothing", run(["M+"]).memory, null);
check("MC clears", run(["5", "M+", "MC"]).memory, null);
check("MR inserts memory", show(run(["5", "0", "M+", "AC", "MR"])), "50");
check("MR in expression", result(run(["5", "0", "M+", "AC", "2", TIMES, "MR", "="])), 100);
check("MR with empty memory does nothing", show(run(["MR"])), "");
check("MR replaces the number being typed", show(run(["5", "0", "M+", "AC", "9", "MR"])), "50");
check("MR after = starts fresh", show(run(["5", "M+", "1", "+", "1", "=", "MR"])), "5");
check("memory float cleanliness", run(["0", ".", "1", "M+", "AC", "0", ".", "2", "M+"]).memory, 0.3);
check("memory negative recall bracketed", show(run(["2", "0", "M\u2212", "AC", "5", "+", "MR"])), "5 + (" + MINUS + "20)");

// DEG / RAD
check("DEG sin(30) via model", result(run(["sin(", "3", "0", "="])), 0.5);
check("RAD sin(30) via model", Math.abs(run(["sin(", "3", "0", "="], { angle: "rad" }).value - Math.sin(30)) < 1e-12, true);
check("switching mode re-evaluates a shown result", (() => { const m = run(["sin(", "3", "0", "="]); m.setAngle("rad"); return Math.abs(m.value - Math.sin(30)) < 1e-12; })(), true);

// Preview
check("preview of 5 + is 5", run(["5", "+"]).previewValue(), 5);
check("preview of 5 + ( is 5", run(["5", "+", "("]).previewValue(), 5);
check("preview of 2+3×4", run(["2", "+", "3", TIMES, "4"]).previewValue(), 14);
check("preview of 5÷0 is null", run(["5", DIV, "0"]).previewValue(), null);
check("preview of empty is null", run([]).previewValue(), null);
check("preview of sin( is null", run(["sin("]).previewValue(), null);

// 2nd-layer sequences
check("10ˣ → 10^( ", show(run(["10^("])), "10^(");
check("10ˣ after a number gets ×", show(run(["5", "10^("])), "5 " + TIMES + " 10^(");
check("10^(2) = 100", result(run(["10^(", "2", "="])), 100);
check("e^(1) = e", result(run(["e^(", "1", "="])), Math.E);
check("x³ key", result(run(["3", "\u00B3", "="])), 27);
check("1/x key", result(run(["8", "\u207B\u00B9", "="])), 0.125);
check("x² key", result(run(["1", "2", "\u00B2", "="])), 144);
check("√ key (prefix style)", result(run(["\u221A(", "1", "4", "4", "="])), 12);

// Accountancy-flavoured
check("GST: 5000 + 18%", result(typed("5000+18%=")), 5900);
check("Discount: 2500 − 12%", result(typed("2500-12%=")), 2200);
check("Trade discount net: 20000 × (100−10) ÷ 100", result(typed("20000*(100-10)/100=")), 18000);
check("Ratio: 150000 ÷ 50000", result(typed("150000/50000=")), 3);
check("Depreciation SLM: (500000 − 50000) ÷ 5", result(typed("(500000-50000)/5=")), 90000);
check("Depreciation WDV: 100000 × 10%", result(typed("100000*10%=")), 10000);
check("Large add: 12345678 + 87654321", result(typed("12345678+87654321=")), 99999999);
check("Decimal: 12.5 × 8.4", result(typed("12.5*8.4=")), 105);
check("Repeated arithmetic chain", result(typed("1000+500-250*2/5=")), 1400);
check("Display of 5,00,000 value stays exact", Calc.calculate("500000").value, 500000);

// Robustness: random fuzz must never throw and never return NaN/undefined text
(function fuzz() {
  const alphabet = ["0", "1", "2", "9", ".", "+", MINUS, TIMES, DIV, "^", "(", ")", "%", "!", "\u00B2", "\u207B\u00B9", "sin(", "log(", "\u221A(", "e", "\u03C0", "E", "abs("];
  let seed = 12345;
  const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  let bad = 0;
  for (let n = 0; n < 4000; n++) {
    const len = 1 + Math.floor(rnd() * 14);
    let s = "";
    for (let i = 0; i < len; i++) s += alphabet[Math.floor(rnd() * alphabet.length)];
    let r;
    try { r = Calc.calculate(s); } catch (e) { bad++; continue; }
    if (r.ok) { if (typeof r.value !== "number" || !isFinite(r.value)) bad++; }
    else if (!["Invalid expression", "Cannot divide by zero", "Invalid calculation", "Result too large"].includes(r.error)) bad++;
    // the model must also never throw, whatever is pressed
    try {
      const m = new Calc.CalcModel();
      for (let i = 0; i < len; i++) m.press(alphabet[Math.floor(rnd() * alphabet.length)]);
      m.press("="); m.press("\u00B1"); m.press("BKSP"); m.press("CE"); m.press("M+"); m.press("MR");
      if (/NaN|undefined|Infinity/.test(m.expression + String(m.error))) bad++;
    } catch (e) { bad++; }
  }
  check("fuzz: 4000 random expressions + key sequences never throw / never leak NaN", bad, 0);
})();

console.log(`\nCalculator tests: ${pass} passed, ${fail} failed`);
if (fail) { failures.forEach(f => console.log("  FAIL " + f)); process.exit(1); }
