/* ============================================================
   Accountancy By Abhinash — Study Tools Calculator
   ------------------------------------------------------------
   One file, three layers (the first two have no DOM and are unit-tested
   in Node — see tests/calculator-tests.js):

   1. ENGINE   lex → parse → evaluate. A small hand-written recursive-descent
               parser. No eval(), no Function(), nothing from the expression
               is ever executed as JavaScript.
   2. MODEL    the editor behind the display: tokens + caret, input rules,
               AC / CE / Backspace / Delete, history, memory, DEG / RAD.
   3. UI       builds the keypad, display, history drawer, keyboard
               handling and persistence inside #calcRoot.

   Loaded by index.html before app.js; app.js calls ABACalc.mount().
   ============================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ABACalc = factory();
}(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* =========================================================
     1. ENGINE
     ========================================================= */
  class CalcError extends Error {
    constructor(code) { super(code); this.code = code; }
  }
  const ERROR_TEXT = {
    SYNTAX: "Invalid expression",
    DIV0: "Cannot divide by zero",
    DOMAIN: "Invalid calculation",
    RANGE: "Result too large"
  };

  const SIG_DIGITS = 15;
  // Strips binary floating-point noise (0.1 + 0.2 → 0.3) by keeping 15
  // significant digits — the most a double can faithfully hold. Applied after
  // every operation so noise never accumulates into later steps.
  function clean(x) {
    if (x === 0) return 0;
    if (!isFinite(x)) return x;
    return Number(x.toPrecision(SIG_DIGITS));
  }
  function chk(v) {
    if (v !== v) throw new CalcError("DOMAIN");
    if (!isFinite(v)) throw new CalcError("RANGE");
    return v;
  }

  const NUM_RE = /(?:\d+\.?\d*|\.\d+)(?:E[+\-\u2212]?\d+)?/y;
  const OP_CHARS = {
    "+": "+", "-": "-", "\u2212": "-", "\u2013": "-",
    "*": "*", "\u00D7": "*", "\u00B7": "*",
    "/": "/", "\u00F7": "/", "^": "^"
  };
  const POSTFIX_CHARS = { "%": "pct", "!": "fact", "\u00B2": "sq", "\u00B3": "cube" };
  const INVERSE_SUFFIX = "\u207B\u00B9"; // ⁻¹
  const FN_LEXEMES = [
    ["sin" + INVERSE_SUFFIX, "asin"], ["cos" + INVERSE_SUFFIX, "acos"], ["tan" + INVERSE_SUFFIX, "atan"],
    ["asin", "asin"], ["acos", "acos"], ["atan", "atan"],
    ["sin", "sin"], ["cos", "cos"], ["tan", "tan"],
    ["log", "log"], ["ln", "ln"], ["sqrt", "sqrt"], ["cbrt", "cbrt"], ["abs", "abs"],
    ["\u221A", "sqrt"], ["\u221B", "cbrt"]
  ];
  const PREFIX_OK = { sqrt: true, cbrt: true }; // √144 and √(144) both fine

  function lex(src) {
    const out = [];
    const n = src.length;
    let i = 0;
    while (i < n) {
      const c = src[i];
      if (c === " " || c === "\u00A0" || c === "\u2009") { i++; continue; }
      if ((c >= "0" && c <= "9") || c === ".") {
        NUM_RE.lastIndex = i;
        const m = NUM_RE.exec(src);
        if (!m) throw new CalcError("SYNTAX");
        i += m[0].length;
        if (src[i] === ".") throw new CalcError("SYNTAX"); // "1.2.3"
        const v = Number(m[0].replace(/\u2212/g, "-"));
        if (!isFinite(v)) throw new CalcError("RANGE");
        out.push({ t: "num", v: v });
        continue;
      }
      if (OP_CHARS[c]) { out.push({ t: "op", v: OP_CHARS[c] }); i++; continue; }
      if (POSTFIX_CHARS[c]) { out.push({ t: "post", v: POSTFIX_CHARS[c] }); i++; continue; }
      if (src.startsWith(INVERSE_SUFFIX, i)) { out.push({ t: "post", v: "inv" }); i += INVERSE_SUFFIX.length; continue; }
      if (c === "(") { out.push({ t: "(" }); i++; continue; }
      if (c === ")") { out.push({ t: ")" }); i++; continue; }
      if (c === "\u03C0") { out.push({ t: "num", v: Math.PI }); i++; continue; }
      if (src.startsWith("pi", i)) { out.push({ t: "num", v: Math.PI }); i += 2; continue; }
      if (c === "e") { out.push({ t: "num", v: Math.E }); i++; continue; }
      let matched = false;
      for (let k = 0; k < FN_LEXEMES.length; k++) {
        const name = FN_LEXEMES[k][0];
        if (!src.startsWith(name, i)) continue;
        const fn = FN_LEXEMES[k][1];
        const after = i + name.length;
        if (src[after] === "(") { out.push({ t: "fn", v: fn }); i = after + 1; }
        else if (PREFIX_OK[fn]) { out.push({ t: "fnp", v: fn }); i = after; }
        else throw new CalcError("SYNTAX");
        matched = true;
        break;
      }
      if (matched) continue;
      throw new CalcError("SYNTAX");
    }
    return out;
  }

  /* Grammar (lowest → highest precedence):
       expr    := term (('+'|'-') term)*
       term    := unary (('*'|'/') unary | <implicit multiply> unary)*
       unary   := ('-'|'+') unary | power
       power   := postfix ('^' expo)?            right-associative
       expo    := ('-'|'+') expo | power
       postfix := primary ('%'|'!'|'²'|'³'|'⁻¹')*
       primary := number | '(' expr ')' | fn '(' expr ')' | prefix-root primary
     Because power binds tighter than unary minus, −2² = −4, as on a real
     calculator. */
  function parse(tokens) {
    // Auto-close any parentheses left open at the end ("(500+250" → "(500+250)").
    let depth = 0;
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i].t;
      if (t === "(" || t === "fn") depth++;
      else if (t === ")") { depth--; if (depth < 0) throw new CalcError("SYNTAX"); }
    }
    const toks = tokens.slice();
    while (depth-- > 0) toks.push({ t: ")" });

    let pos = 0;
    let nest = 0;
    const peek = () => toks[pos];
    const isOp = (tk, v) => tk && tk.t === "op" && v.indexOf(tk.v) !== -1;
    const startsPrimary = tk => tk && (tk.t === "num" || tk.t === "(" || tk.t === "fn" || tk.t === "fnp");

    function parseExpr() {
      if (++nest > 120) throw new CalcError("SYNTAX");
      let node = parseTerm();
      while (isOp(peek(), "+-")) {
        const op = toks[pos++].v;
        node = { k: "bin", op: op, l: node, r: parseTerm() };
      }
      nest--;
      return node;
    }
    function parseTerm() {
      let node = parseUnary();
      for (;;) {
        const tk = peek();
        if (isOp(tk, "*/")) { pos++; node = { k: "bin", op: tk.v, l: node, r: parseUnary() }; }
        else if (startsPrimary(tk)) node = { k: "bin", op: "*", l: node, r: parseUnary() }; // 2π, 3(4+5)
        else break;
      }
      return node;
    }
    function parseUnary() {
      const tk = peek();
      if (isOp(tk, "-")) { pos++; return { k: "neg", x: parseUnary() }; }
      if (isOp(tk, "+")) { pos++; return parseUnary(); }
      return parsePower();
    }
    function parsePower() {
      const base = parsePostfix();
      if (isOp(peek(), "^")) { pos++; return { k: "pow", b: base, e: parseExpo() }; }
      return base;
    }
    function parseExpo() {
      const tk = peek();
      if (isOp(tk, "-")) { pos++; return { k: "neg", x: parseExpo() }; }
      if (isOp(tk, "+")) { pos++; return parseExpo(); }
      return parsePower();
    }
    function parsePostfix() {
      let node = parsePrimary();
      while (peek() && peek().t === "post") {
        const op = toks[pos++].v;
        node = op === "pct" ? { k: "pct", x: node } : { k: "post", op: op, x: node };
      }
      return node;
    }
    function parsePrimary() {
      const tk = toks[pos++];
      if (!tk) throw new CalcError("SYNTAX");
      if (tk.t === "num") return { k: "num", v: tk.v };
      if (tk.t === "(") {
        const e = parseExpr();
        if (!peek() || peek().t !== ")") throw new CalcError("SYNTAX");
        pos++;
        return e;
      }
      if (tk.t === "fn") {
        const e = parseExpr();
        if (!peek() || peek().t !== ")") throw new CalcError("SYNTAX");
        pos++;
        return { k: "fn", name: tk.v, x: e };
      }
      if (tk.t === "fnp") {
        let neg = false;
        if (isOp(peek(), "-")) { pos++; neg = true; }
        const operand = parsePrimary();
        const node = { k: "fn", name: tk.v, x: neg ? { k: "neg", x: operand } : operand };
        return node;
      }
      throw new CalcError("SYNTAX");
    }

    const ast = parseExpr();
    if (pos < toks.length) throw new CalcError("SYNTAX");
    return ast;
  }

  function factorial(x) {
    if (!Number.isInteger(x) || x < 0) throw new CalcError("DOMAIN");
    if (x > 170) throw new CalcError("RANGE");
    let r = 1;
    for (let i = 2; i <= x; i++) r *= i;
    return clean(r);
  }
  function power(b, e) {
    if (b === 0 && e < 0) throw new CalcError("DIV0");
    return chk(clean(Math.pow(b, e)));
  }
  function tiny(v) { return Math.abs(v) < 1e-15 ? 0 : clean(v); }
  function trig(name, x, deg) {
    let a = x;
    if (deg) {
      const r = ((x % 360) + 360) % 360;
      if (name === "sin") { if (r % 180 === 0) return 0; if (r === 90) return 1; if (r === 270) return -1; }
      else if (name === "cos") { if (r === 90 || r === 270) return 0; if (r === 0) return 1; if (r === 180) return -1; }
      else { if (r % 180 === 0) return 0; if (r === 90 || r === 270) throw new CalcError("DOMAIN"); }
      a = x * Math.PI / 180;
    } else if (name === "tan" && Math.abs(Math.cos(a)) < 1e-13) {
      // π/2 has already been rounded to 15 digits by the time it gets here, so cos() is ~3e-14, not 0
      throw new CalcError("DOMAIN");
    }
    return tiny(Math[name](a));
  }
  function applyFn(name, x, deg) {
    switch (name) {
      case "sqrt": if (x < 0) throw new CalcError("DOMAIN"); return clean(Math.sqrt(x));
      case "cbrt": return clean(Math.cbrt(x));
      case "abs": return Math.abs(x);
      case "log": if (x <= 0) throw new CalcError("DOMAIN"); return clean(Math.log10(x));
      case "ln": if (x <= 0) throw new CalcError("DOMAIN"); return clean(Math.log(x));
      case "sin": case "cos": case "tan": return trig(name, x, deg);
      case "asin": case "acos": {
        if (x > 1 || x < -1) throw new CalcError("DOMAIN");
        const r = Math[name](x);
        return tiny(deg ? r * 180 / Math.PI : r);
      }
      case "atan": { const r = Math.atan(x); return tiny(deg ? r * 180 / Math.PI : r); }
    }
    throw new CalcError("SYNTAX");
  }

  const isPct = n => n.k === "pct" || (n.k === "neg" && isPct(n.x));
  function pctFraction(n, deg) { return n.k === "neg" ? -pctFraction(n.x, deg) : evalNode(n.x, deg) / 100; }

  function evalNode(n, deg) {
    switch (n.k) {
      case "num": return n.v;
      case "neg": { const v = evalNode(n.x, deg); return v === 0 ? 0 : -v; }
      case "pct": return chk(clean(evalNode(n.x, deg) / 100));
      case "post": {
        const v = evalNode(n.x, deg);
        if (n.op === "fact") return factorial(v);
        if (n.op === "sq") return chk(clean(v * v));
        if (n.op === "cube") return chk(clean(v * v * v));
        if (n.op === "inv") { if (v === 0) throw new CalcError("DIV0"); return clean(1 / v); }
        throw new CalcError("SYNTAX");
      }
      case "pow": return power(evalNode(n.b, deg), evalNode(n.e, deg));
      case "fn": return applyFn(n.name, evalNode(n.x, deg), deg);
      case "bin": {
        const l = evalNode(n.l, deg);
        // Accounting-style percent: "250 + 10%" means 250 plus 10% OF 250 = 275,
        // and "500 − 20%" = 400. Percent after × or ÷ is a plain fraction:
        // "100 × 18%" = 18. A percent on the left ("50% + 25%") stays a plain fraction.
        if ((n.op === "+" || n.op === "-") && isPct(n.r) && !isPct(n.l)) {
          const delta = clean(l * pctFraction(n.r, deg));
          return chk(clean(n.op === "+" ? l + delta : l - delta));
        }
        const r = evalNode(n.r, deg);
        switch (n.op) {
          case "+": return chk(clean(l + r));
          case "-": return chk(clean(l - r));
          case "*": return chk(clean(l * r));
          case "/": if (r === 0) throw new CalcError("DIV0"); return chk(clean(l / r));
        }
      }
    }
    throw new CalcError("SYNTAX");
  }

  /* calculate("2 + 3 × 4", {angle:"deg"}) → {ok:true, value:14}
     or {ok:false, code, error:"Invalid expression"} — never throws. */
  function calculate(src, opts) {
    const deg = !opts || opts.angle !== "rad";
    try {
      const tokens = lex(String(src));
      if (!tokens.length || tokens.length > 2000) throw new CalcError("SYNTAX");
      const value = clean(evalNode(parse(tokens), deg));
      return { ok: true, value: value === 0 ? 0 : value };
    } catch (e) {
      const code = e instanceof CalcError ? e.code : "SYNTAX";
      return { ok: false, code: code, error: ERROR_TEXT[code] };
    }
  }

  /* Display formatting. The numeric value is never altered — only its text.
     grouping: "in" → 22,50,000 (lakh/crore) · "intl" → 2,250,000 · "none". */
  function groupDigits(intStr, mode) {
    if (mode === "none" || intStr.length <= 3) return intStr;
    if (mode === "in") {
      const last3 = intStr.slice(-3);
      const rest = intStr.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
      return rest + "," + last3;
    }
    return intStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function formatNumber(v, grouping) {
    if (typeof v !== "number" || !isFinite(v)) return "";
    v = clean(v);
    if (v === 0) return "0";
    const abs = Math.abs(v);
    const sign = v < 0 ? "\u2212" : "";
    if (abs >= 1e15 || abs < 1e-6) {
      const parts = abs.toExponential().split("e");
      const exp = parseInt(parts[1], 10);
      return sign + parts[0] + "E" + (exp < 0 ? "\u2212" + (-exp) : String(exp));
    }
    const intDigits = Math.floor(Math.log10(abs)) + 1;
    const frac = Math.max(0, Math.min(20, SIG_DIGITS - intDigits));
    let s = abs.toFixed(frac);
    if (s.indexOf(".") !== -1) s = s.replace(/0+$/, "").replace(/\.$/, "");
    const dot = s.indexOf(".");
    const intPart = dot === -1 ? s : s.slice(0, dot);
    const fracPart = dot === -1 ? "" : s.slice(dot);
    return sign + groupDigits(intPart, grouping || "none") + fracPart;
  }

  /* =========================================================
     2. MODEL — tokens, caret, input rules, history, memory
     ========================================================= */
  const MINUS = "\u2212", TIMES = "\u00D7", DIVIDE = "\u00F7", PI = "\u03C0";
  const SQ = "\u00B2", CUBE = "\u00B3", INV = "\u207B\u00B9";
  const setOf = a => { const o = Object.create(null); a.forEach(k => { o[k] = true; }); return o; };
  const OPS = setOf(["+", MINUS, TIMES, DIVIDE, "^"]);
  const POST = setOf(["%", "!", SQ, CUBE, INV]);
  const FUNCS = setOf(["sin(", "cos(", "tan(", "sin" + INV + "(", "cos" + INV + "(", "tan" + INV + "(",
    "log(", "ln(", "\u221A(", "\u221B(", "abs("]);
  const CONSTS = setOf([PI, "e"]);
  const DIGIT = /^[0-9]$/;
  const MAX_TOKENS = 240;
  const MAX_HISTORY = 50;
  const isOpen = t => t === "(" || FUNCS[t] === true;
  const isLit = t => DIGIT.test(t) || t === "." || t === "E";

  const SPLIT_LIST = Object.keys(FUNCS).concat([INV]).sort((a, b) => b.length - a.length);
  function splitTokens(str) {
    const out = [];
    let i = 0;
    while (i < str.length) {
      const ch = str[i];
      if (ch === " " || ch === "\u00A0") { i++; continue; }
      let hit = null;
      for (let k = 0; k < SPLIT_LIST.length; k++) if (str.startsWith(SPLIT_LIST[k], i)) { hit = SPLIT_LIST[k]; break; }
      if (hit) { out.push(hit); i += hit.length; continue; }
      out.push(ch === "-" ? MINUS : ch === "*" ? TIMES : ch === "/" ? DIVIDE : ch);
      i++;
    }
    return out;
  }

  // Start index of the numeric literal (digits . E and an exponent sign) that ends at c.
  function runStart(t, c) {
    let j = c;
    while (j > 0) {
      const x = t[j - 1];
      if (DIGIT.test(x) || x === "." || x === "E") j--;
      else if ((x === "+" || x === MINUS) && j >= 2 && t[j - 2] === "E") j--;
      else break;
    }
    return j;
  }
  const isOperandEnd = x => x !== null && x !== undefined && (DIGIT.test(x) || x === "." || x === ")" || POST[x] === true || CONSTS[x] === true);
  function isUnarySign(t, i) { // is t[i] a sign (not a binary minus)?
    return t[i] === MINUS && (i === 0 || isOpen(t[i - 1]) || OPS[t[i - 1]] === true) && !(i >= 1 && t[i - 1] === "E");
  }
  function matchingOpen(t, closeIdx) {
    let depth = 0;
    for (let j = closeIdx; j >= 0; j--) {
      if (t[j] === ")") depth++;
      else if (isOpen(t[j])) { depth--; if (depth === 0) return j; }
    }
    return -1;
  }
  // Start of the operand that ends just before index `end`, or -1.
  function operandStart(t, end) {
    let i = end;
    while (i > 0 && POST[t[i - 1]]) i--;
    if (i === 0) return -1;
    const last = t[i - 1];
    if (last === ")") return matchingOpen(t, i - 1);
    if (CONSTS[last]) return i - 1;
    if (DIGIT.test(last) || last === ".") return runStart(t, i);
    return -1;
  }

  // "5 × −4" style text for history and screen readers.
  function exprText(tokens) {
    let s = "";
    for (let i = 0; i < tokens.length; i++) {
      const tk = tokens[i];
      const binary = OPS[tk] === true && tk !== "^" && !isUnarySign(tokens, i) && !(i >= 1 && tokens[i - 1] === "E");
      s += binary ? " " + tk + " " : tk;
    }
    return s;
  }

  class CalcModel {
    constructor(o) {
      o = o || {};
      this.t = [];
      this.c = 0;
      this.angle = o.angle === "rad" ? "rad" : "deg";
      this.grouping = o.grouping === "intl" ? "intl" : "in";
      this.final = false;
      this.value = null;
      this.error = null;
      this.history = Array.isArray(o.history) ? o.history.slice(0, MAX_HISTORY) : [];
      this.memory = typeof o.memory === "number" && isFinite(o.memory) ? o.memory : null;
      this.hIdx = -1;
      this.draft = null;
    }

    get expression() { return exprText(this.t); }
    format(v) { return formatNumber(v, this.grouping); }

    /* ---- entry point used by buttons AND keyboard ---- */
    press(a) {
      switch (a) {
        case "AC": return this.clearAll();
        case "CE": return this.clearEntry();
        case "BKSP": return this.backspace();
        case "DEL": return this.del();
        case "=": return this.equals();
        case "\u00B1": return this.toggleSign();
        case "LEFT": return this.moveCaret(-1);
        case "RIGHT": return this.moveCaret(1);
        case "HOME": return this.moveCaret(-Infinity);
        case "END": return this.moveCaret(Infinity);
        case "UP": return this.histUp();
        case "DOWN": return this.histDown();
        case "MC": this.memory = null; return true;
        case "MR": return this.memRecall();
        case "M+": return this.memAdd(1);
        case "M" + MINUS: return this.memAdd(-1);
        case "10^(": return this.insertGroup(["1", "0", "^", "("]);
        case "e^(": return this.insertGroup(["e", "^", "("]);
        default: return this.insert(a);
      }
    }

    _prep(kind) {
      if (this.final) {
        if (kind === "continue") { this.t = splitTokens(formatNumber(this.value, "none")); this.c = this.t.length; }
        else { this.t = []; this.c = 0; }
        this.final = false;
      }
      this.error = null;
      this.hIdx = -1;
    }

    insert(tok) {
      if (this.final) {
        if (tok === ")" || tok === "E") return false;
        this._prep(OPS[tok] || POST[tok] ? "continue" : "fresh");
      } else this._prep("edit");
      return this._ins(tok);
    }

    _ins(tok) {
      const t = this.t, c = this.c;
      const prev = c > 0 ? t[c - 1] : null;
      if (t.length >= MAX_TOKENS) return false;
      const put = (...toks) => { t.splice(c, 0, ...toks); this.c = c + toks.length; return true; };
      const prevEnd = isOperandEnd(prev);
      const prevExpSign = prev !== null && (prev === "+" || prev === MINUS) && c >= 2 && t[c - 2] === "E";
      const needTimes = prev === ")" || POST[prev] === true || CONSTS[prev] === true;

      if (DIGIT.test(tok)) {
        const run = t.slice(runStart(t, c), c);
        if (run.length === 1 && run[0] === "0") { if (tok === "0") return false; t[c - 1] = tok; return true; } // no leading zeros
        return needTimes ? put(TIMES, tok) : put(tok);
      }
      if (tok === ".") {
        const run = t.slice(runStart(t, c), c);
        if (run.indexOf(".") !== -1 || run.indexOf("E") !== -1) return false;
        if (run.length > 0) return put(".");
        return needTimes ? put(TIMES, "0", ".") : put("0", ".");
      }
      if (tok === "E") {
        const run = t.slice(runStart(t, c), c);
        if (!run.some(x => DIGIT.test(x)) || run.indexOf("E") !== -1 || prev === ".") return false;
        return put("E");
      }
      if (tok === "(" || FUNCS[tok] || CONSTS[tok]) {
        if (prev === "E" || prevExpSign) return false;
        return prevEnd && prev !== "." ? put(TIMES, tok) : put(tok);
      }
      if (tok === ")") {
        if (!prevEnd) return false;
        let depth = 0;
        for (let i = 0; i < c; i++) { if (isOpen(t[i])) depth++; else if (t[i] === ")") depth--; }
        return depth > 0 ? put(")") : false;
      }
      if (POST[tok]) return prevEnd ? put(tok) : false;

      if (OPS[tok]) {
        if (prev === "E") return (tok === "+" || tok === MINUS) ? put(tok) : false; // 1E+5, 1E−5
        if (prevExpSign) return false;
        const atStartOrOpen = prev === null || isOpen(prev);
        const prevIsOp = prev !== null && OPS[prev] === true;
        if (tok === MINUS) {
          if (atStartOrOpen) return put(MINUS);                         // −500 + 250, (−3)
          if (prevIsOp) {
            if (prev === MINUS) return false;                           // "5 − −" → ignore
            if (prev === "+") { t[c - 1] = MINUS; return true; }        // "5 +" then "−" → "5 −"
            return put(MINUS);                                          // 25 × −4
          }
          return put(MINUS);
        }
        if (atStartOrOpen) return false;                                // nothing to operate on
        if (prevIsOp) {
          if (isUnarySign(t, c - 1)) {                                  // "5 × −" then "÷" → "5 ÷"
            if (c >= 2 && OPS[t[c - 2]]) { t.splice(c - 2, 2, tok); this.c = c - 1; return true; }
            return false;
          }
          t[c - 1] = tok;                                               // "5 + ×" → "5 ×"  (replace, never stack)
          return true;
        }
        return put(tok);
      }
      return false;
    }

    // Insert a fixed token sequence (10ˣ, eˣ) with an implicit × when needed.
    insertGroup(toks) {
      if (this.final) this._prep("fresh"); else this._prep("edit");
      const t = this.t, c = this.c;
      const prev = c > 0 ? t[c - 1] : null;
      if (t.length + toks.length + 1 > MAX_TOKENS) return false;
      if (prev === "E" || (prev && (prev === "+" || prev === MINUS) && c >= 2 && t[c - 2] === "E")) return false;
      const out = isOperandEnd(prev) ? [TIMES].concat(toks) : toks;
      t.splice(c, 0, ...out);
      this.c = c + out.length;
      return true;
    }

    // Insert a numeric value (memory recall, history result). Replaces a number being typed.
    insertValue(v) {
      if (typeof v !== "number" || !isFinite(v)) return false;
      if (this.final) this._prep("fresh"); else this._prep("edit");
      const t = this.t;
      const s = runStart(t, this.c);
      if (s < this.c) { t.splice(s, this.c - s); this.c = s; }
      const prev = this.c > 0 ? t[this.c - 1] : null;
      const digits = splitTokens(formatNumber(Math.abs(v), "none"));
      let out = [];
      if (prev === ")" || POST[prev] === true || CONSTS[prev] === true) out.push(TIMES);
      if (v < 0) {
        if (this.c === 0 || isOpen(prev)) out = out.concat([MINUS], digits);
        else out = out.concat(["(", MINUS], digits, [")"]);
      } else out = out.concat(digits);
      if (t.length + out.length > MAX_TOKENS) return false;
      t.splice(this.c, 0, ...out);
      this.c += out.length;
      return true;
    }

    _removeAt(i) { // remove token i; an opening token takes its matching ")" with it
      const t = this.t;
      const removed = [i];
      if (isOpen(t[i])) {
        let depth = 0;
        for (let j = i; j < t.length; j++) {
          if (isOpen(t[j])) depth++;
          else if (t[j] === ")") { depth--; if (depth === 0) { removed.push(j); break; } }
        }
      }
      removed.sort((a, b) => b - a).forEach(idx => t.splice(idx, 1));
      return removed;
    }

    backspace() {
      if (this.final) { this.final = false; this.c = this.t.length; }
      this.error = null; this.hIdx = -1;
      if (this.c === 0) return false;
      const removed = this._removeAt(this.c - 1);
      this.c -= removed.filter(i => i < this.c).length;
      return true;
    }

    del() {
      if (this.final) { this.final = false; this.c = this.t.length; }
      this.error = null; this.hIdx = -1;
      if (this.c >= this.t.length) return this.clearEntry();   // at the end there is nothing ahead: clear the entry
      const removed = this._removeAt(this.c);
      this.c -= removed.filter(i => i < this.c).length;
      return true;
    }

    clearAll() {
      this.t = []; this.c = 0;
      this.final = false; this.value = null; this.error = null;
      this.hIdx = -1; this.draft = null;
      return true;
    }

    clearEntry() {
      if (this.final || this.error) return this.clearAll();
      this.hIdx = -1;
      const t = this.t, c = this.c;
      if (c === 0) return false;
      const prev = t[c - 1];
      let s;
      if (isLit(prev) || ((prev === "+" || prev === MINUS) && c >= 2 && t[c - 2] === "E")) {
        s = runStart(t, c);
        if (s > 0 && isUnarySign(t, s - 1)) s--;
      } else if (prev === ")") {
        s = matchingOpen(t, c - 1);
        if (s < 0) s = c - 1;
      } else s = c - 1;
      t.splice(s, c - s);
      this.c = s;
      return true;
    }

    toggleSign() {
      if (this.final) {
        const v = this.value === null ? 0 : -this.value;
        this.t = splitTokens(formatNumber(v === 0 ? 0 : v, "none"));
        this.c = this.t.length;
        this.final = false; this.error = null;
        return true;
      }
      this._prep("edit");
      const t = this.t, c = this.c;
      const s = operandStart(t, c);
      if (s === -1) return this._ins(MINUS) || (c > 0 && isUnarySign(t, c - 1) && (t.splice(c - 1, 1), this.c = c - 1, true));
      // "(−x)" → "x"
      if (t[s] === "(" && t[s + 1] === MINUS && t[c - 1] === ")" && matchingOpen(t, c - 1) === s) {
        t.splice(c - 1, 1); t.splice(s, 2); this.c = c - 3; return true;
      }
      // "−x" → "x"
      if (s > 0 && isUnarySign(t, s - 1)) { t.splice(s - 1, 1); this.c = c - 1; return true; }
      if (t.length + 3 > MAX_TOKENS) return false;
      // "5 + 3" → "5 + (−3)"
      if (s > 0 && (t[s - 1] === "+" || t[s - 1] === MINUS)) {
        t.splice(c, 0, ")"); t.splice(s, 0, "(", MINUS); this.c = c + 3; return true;
      }
      t.splice(s, 0, MINUS); this.c = c + 1; return true;
    }

    moveCaret(d) {
      if (this.final) { this.final = false; this.c = this.t.length; }
      this.error = null;
      this.c = d === -Infinity ? 0 : d === Infinity ? this.t.length : Math.max(0, Math.min(this.t.length, this.c + d));
      return true;
    }
    setCaret(i) { this.c = Math.max(0, Math.min(this.t.length, i | 0)); }

    _close(tokens) {
      const out = tokens.slice();
      let depth = 0;
      for (let i = 0; i < out.length; i++) { if (isOpen(out[i])) depth++; else if (out[i] === ")") depth--; }
      while (depth-- > 0) out.push(")");
      return out;
    }

    equals() {
      if (this.final || !this.t.length) return false;
      this.error = null; this.hIdx = -1;
      const closed = this._close(this.t);
      const res = calculate(closed.join(""), { angle: this.angle });
      if (!res.ok) { this.error = res.error; return false; }
      this.t = closed; this.c = closed.length;
      this.value = res.value; this.final = true;
      if (!/^\u2212?[0-9.]+(E[+\u2212]?[0-9]+)?$/.test(closed.join(""))) this._pushHistory(closed, res.value);
      return true;
    }

    _pushHistory(tokens, value) {
      const e = exprText(tokens);
      if (this.history.length && this.history[0].e === e) this.history.shift();
      this.history.unshift({ e: e, v: value });
      if (this.history.length > MAX_HISTORY) this.history.length = MAX_HISTORY;
    }
    clearHistory() { this.history = []; this.hIdx = -1; }

    // Value of what is on the display right now (live preview). Trailing
    // operators / open brackets are ignored: "5 +" previews as 5.
    previewValue() {
      const base = this.t;
      let k = base.length;
      for (let guard = 0; guard < 14 && k > 0; guard++) {
        const r = calculate(this._close(base.slice(0, k)).join(""), { angle: this.angle });
        if (r.ok) return r.value;
        const last = base[k - 1];
        if (OPS[last] || isOpen(last) || last === "E") k--; else break;
      }
      return null;
    }
    currentValue() {
      if (this.final) return this.value;
      if (this.error || !this.t.length) return null;
      return this.previewValue();
    }

    setAngle(mode) {
      this.angle = mode === "rad" ? "rad" : "deg";
      if (this.final) {
        const r = calculate(this.t.join(""), { angle: this.angle });
        if (r.ok) this.value = r.value; else { this.error = r.error; this.final = false; }
      }
    }

    /* ---- memory ---- */
    memAdd(sign) {
      const v = this.currentValue();
      if (v === null) return false;
      this.memory = clean((this.memory || 0) + sign * v);
      return true;
    }
    memRecall() { return this.memory === null ? false : this.insertValue(this.memory); }

    /* ---- history ---- */
    loadExpression(str) {
      this.t = splitTokens(str); this.c = this.t.length;
      this.final = false; this.error = null; this.hIdx = -1;
      return true;
    }
    _loadHist(i) {
      this.t = splitTokens(this.history[i].e); this.c = this.t.length;
      this.final = false; this.error = null; this.hIdx = i;
    }
    histUp() {
      if (!this.history.length) return false;
      if (this.hIdx === -1) this.draft = { t: this.t.slice(), c: this.c };
      const next = Math.min(this.hIdx + 1, this.history.length - 1);
      this._loadHist(next);
      return true;
    }
    histDown() {
      if (this.hIdx === -1) return false;
      if (this.hIdx === 0) {
        const d = this.draft || { t: [], c: 0 };
        this.t = d.t; this.c = d.c; this.hIdx = -1; this.draft = null;
        this.final = false; this.error = null;
        return true;
      }
      this._loadHist(this.hIdx - 1);
      return true;
    }
  }

  /* Physical keyboard → calculator action (or null to leave the key alone). */
  function mapKey(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return null;
    const k = e.key;
    // Numpad: go by physical key so it types calculator input whether NumLock is on or off.
    if (typeof e.code === "string" && e.code.indexOf("Numpad") === 0) {
      const nk = e.code.slice(6);
      if (/^[0-9]$/.test(nk)) return nk;
      const NP = { Add: "+", Subtract: MINUS, Multiply: TIMES, Divide: DIVIDE, Decimal: ".", Enter: "=", Equal: "=", Comma: "." };
      if (NP[nk]) return NP[nk];
    }
    if (typeof k !== "string") return null;
    if (/^[0-9]$/.test(k)) return k;
    switch (k) {
      case "+": return "+";
      case "-": return MINUS;
      case "*": case "x": case "X": return TIMES;
      case "/": return DIVIDE;
      case "^": return "^";
      case "%": return "%";
      case "!": return "!";
      case ".": case ",": return ".";
      case "(": return "(";
      case ")": return ")";
      case "Enter": case "=": return "=";
      case "Backspace": return "BKSP";
      case "Delete": return "DEL";
      case "Escape": return "AC";
      case "ArrowLeft": return "LEFT";
      case "ArrowRight": return "RIGHT";
      case "ArrowUp": return "UP";
      case "ArrowDown": return "DOWN";
      case "Home": return "HOME";
      case "End": return "END";
      // Letter shortcuts for the scientific keys (Shift = inverse trig).
      case "s": return "sin(";
      case "c": return "cos(";
      case "t": return "tan(";
      case "S": return "sin" + INV + "(";
      case "C": return "cos" + INV + "(";
      case "T": return "tan" + INV + "(";
      case "l": return "log(";
      case "n": return "ln(";
      case "r": return "\u221A(";
      case "a": return "abs(";
      case "p": return PI;
      case "e": return "e";
      case "E": return "E";
      case "q": return SQ;
      case "i": return INV;
    }
    return null;
  }

  /* =========================================================
     3. UI
     ========================================================= */
  const STORE_KEY = "abhinash_calc_v2";

  function h(tag, cls, html, attrs) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined && html !== null) e.innerHTML = html;
    if (attrs) Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k]));
    return e;
  }

  // kind → visual weight. a2/label2/aria2 → the "2nd" layer.
  const MAIN_KEYS = [
    { a: "AC", label: "AC", kind: "clear", aria: "All clear" },
    { a: "CE", label: "CE", kind: "clear2", aria: "Clear entry" },
    { a: "BKSP", icon: "delete", kind: "fn", aria: "Backspace" },
    { a: DIVIDE, label: DIVIDE, kind: "op", aria: "Divide" },
    { a: "(", label: "(", kind: "fn", aria: "Open parenthesis" },
    { a: ")", label: ")", kind: "fn", aria: "Close parenthesis" },
    { a: "%", label: "%", kind: "op", aria: "Percent" },
    { a: TIMES, label: TIMES, kind: "op", aria: "Multiply" },
    { a: "7", label: "7", kind: "num" }, { a: "8", label: "8", kind: "num" }, { a: "9", label: "9", kind: "num" },
    { a: MINUS, label: MINUS, kind: "op", aria: "Subtract" },
    { a: "4", label: "4", kind: "num" }, { a: "5", label: "5", kind: "num" }, { a: "6", label: "6", kind: "num" },
    { a: "+", label: "+", kind: "op", aria: "Add" },
    { a: "1", label: "1", kind: "num" }, { a: "2", label: "2", kind: "num" }, { a: "3", label: "3", kind: "num" },
    { a: "=", label: "=", kind: "eq", aria: "Equals" },
    { a: "\u00B1", label: "\u00B1", kind: "fn", aria: "Change sign" },
    { a: "0", label: "0", kind: "num" },
    { a: ".", label: ".", kind: "num", aria: "Decimal point" }
  ];
  const MEM_KEYS = [
    { a: "MC", label: "MC", aria: "Memory clear" },
    { a: "MR", label: "MR", aria: "Memory recall" },
    { a: "M+", label: "M+", aria: "Memory add" },
    { a: "M" + MINUS, label: "M" + MINUS, aria: "Memory subtract" }
  ];
  // Listed so that, filled column-by-column (phones, 3 rows) or row-by-row
  // (desktop, 3 columns), each group of three stays together.
  const SCI_KEYS = [
    { second: true, label: "2nd", aria: "Second function layer" },
    { a: PI, label: PI, aria: "Pi" },
    { a: "e", label: "e", aria: "Euler's number" },
    { a: "sin(", label: "sin", a2: "sin" + INV + "(", label2: "sin<sup>\u22121</sup>", aria: "Sine", aria2: "Inverse sine" },
    { a: "cos(", label: "cos", a2: "cos" + INV + "(", label2: "cos<sup>\u22121</sup>", aria: "Cosine", aria2: "Inverse cosine" },
    { a: "tan(", label: "tan", a2: "tan" + INV + "(", label2: "tan<sup>\u22121</sup>", aria: "Tangent", aria2: "Inverse tangent" },
    { a: "log(", label: "log", a2: "10^(", label2: "10<sup>x</sup>", aria: "Logarithm base 10", aria2: "Ten to the power x" },
    { a: "ln(", label: "ln", a2: "e^(", label2: "e<sup>x</sup>", aria: "Natural logarithm", aria2: "e to the power x" },
    { a: "E", label: "EXP", aria: "Exponent: times ten to the power" },
    { a: SQ, label: "x<sup>2</sup>", a2: CUBE, label2: "x<sup>3</sup>", aria: "Square", aria2: "Cube" },
    { a: "\u221A(", label: "\u221A", a2: "\u221B(", label2: "\u221B", aria: "Square root", aria2: "Cube root" },
    { a: "^", label: "x<sup>y</sup>", aria: "x to the power y" },
    { a: INV, label: "1/x", aria: "Reciprocal" },
    { a: "!", label: "x!", aria: "Factorial" },
    { a: "abs(", label: "|x|", aria: "Absolute value" }
  ];

  const KEYBOARD_HINT = "Type with your keyboard \u00B7 Enter to calculate \u00B7 Esc to clear \u00B7 \u2191 \u2193 for history";

  function loadStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "null") || {}; } catch (e) { return {}; }
  }

  function mount(host, opts) {
    opts = opts || {};
    if (!host || typeof document === "undefined") return null;
    const panel = opts.panel || host.closest(".floating-panel");
    const refreshIcons = typeof opts.icons === "function" ? opts.icons : function () {};
    const notify = typeof opts.toast === "function" ? opts.toast : function () {};

    const saved = loadStore();
    const model = new CalcModel({
      angle: saved.angle, grouping: saved.grouping, memory: saved.memory,
      history: Array.isArray(saved.history)
        ? saved.history.filter(x => x && typeof x.e === "string" && typeof x.v === "number" && isFinite(x.v))
        : []
    });
    let sci = typeof saved.sci === "boolean" ? saved.sci : window.innerWidth > 640;
    let second = false;
    let active = false;
    let historyOpen = false;

    function persist() {
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify({
          angle: model.angle, grouping: model.grouping, sci: sci,
          memory: model.memory, history: model.history
        }));
      } catch (e) { /* private mode / quota: calculator still works, it just won't remember */ }
    }

    /* ---------- DOM ---------- */
    host.innerHTML = "";
    const root = h("div", "calc");
    host.appendChild(root);

    // control row
    const bar = h("div", "calc-bar");
    const sciBtn = h("button", "calc-switch", '<span class="sw-opt" data-v="basic">Basic</span><span class="sw-opt" data-v="sci">Scientific</span>',
      { type: "button", role: "switch" });
    const angleBtn = h("button", "calc-switch calc-switch-angle", '<span class="sw-opt" data-v="deg">DEG</span><span class="sw-opt" data-v="rad">RAD</span>',
      { type: "button", role: "switch" });
    const groupBtn = h("button", "calc-group-badge calc-switch-group", '<span class="sw-opt" data-v="in">1,00,000</span><span class="sw-opt" data-v="intl">100,000</span>',
      { type: "button", role: "switch" });
    const histBtn = h("button", "calc-iconbtn", '<i data-lucide="history"></i>',
      { type: "button", "aria-label": "Calculation history", "aria-expanded": "false", title: "History" });
    bar.append(sciBtn, angleBtn, histBtn);

    // display
    const screen = h("div", "calc-screen", "", {
      tabindex: "0", role: "group",
      "aria-label": "Calculator display. Type numbers and operators with your keyboard."
    });
    const memBadge = h("span", "calc-mem-badge", "M", { hidden: "" });
    const angleBadge = h("span", "calc-angle-badge", "DEG");
    const exprEl = h("div", "calc-expr", "", { "aria-hidden": "true" });
    const resEl = h("div", "calc-result", "0", { "aria-hidden": "true" });
    screen.append(h("div", "calc-badges", "", {}), exprEl, resEl);
    screen.firstChild.append(memBadge, angleBadge, groupBtn);
    const live = h("div", "calc-sr", "", { "aria-live": "polite", role: "status" });

    // keypads
    const btnByAction = Object.create(null);
    const keyEls = [];
    function makeKey(def) {
      const b = h("button", "calc-key k-" + (def.kind || "fn"), "", { type: "button" });
      if (def.icon) b.innerHTML = '<i data-lucide="' + def.icon + '"></i>';
      else b.innerHTML = def.label;
      if (def.aria) b.setAttribute("aria-label", def.aria);
      if (def.a) { b.dataset.a = def.a; btnByAction[def.a] = b; }
      if (def.a2) { b.dataset.a2 = def.a2; btnByAction[def.a2] = b; }
      keyEls.push({ el: b, def: def });
      return b;
    }

    const memRow = h("div", "calc-mem-row");
    MEM_KEYS.forEach(d => { const b = makeKey(Object.assign({ kind: "mem" }, d)); memRow.appendChild(b); });

    const sciPad = h("div", "calc-sci-pad");
    let secondBtn = null;
    SCI_KEYS.forEach(d => {
      const b = makeKey(Object.assign({ kind: "sci" }, d));
      if (d.second) { secondBtn = b; b.classList.add("k-second"); b.setAttribute("aria-pressed", "false"); }
      sciPad.appendChild(b);
    });

    const mainPad = h("div", "calc-main-pad");
    MAIN_KEYS.forEach(d => mainPad.appendChild(makeKey(d)));

    const pads = h("div", "calc-pads");
    const mainCol = h("div", "calc-main-col");
    mainCol.append(memRow, mainPad);
    pads.append(sciPad, mainCol);

    // history drawer
    const drawer = h("div", "calc-history", "", { hidden: "", role: "region", "aria-label": "Calculation history" });
    const dHead = h("div", "calc-history-head");
    dHead.innerHTML = '<span>History</span>';
    const dClear = h("button", "calc-hist-clear", '<i data-lucide="trash-2"></i><span>Clear</span>', { type: "button", "aria-label": "Clear history" });
    const dClose = h("button", "calc-iconbtn sm", '<i data-lucide="x"></i>', { type: "button", "aria-label": "Close history" });
    dHead.append(dClear, dClose);
    const dList = h("ul", "calc-history-list");
    drawer.append(dHead, dList);

    const hint = h("p", "calc-hint", KEYBOARD_HINT);
    root.append(bar, screen, pads, drawer, hint, live);
    refreshIcons();

    /* ---------- rendering ---------- */
    const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    function tokenHTML(t, i) {
      const tk = t[i];
      let cls = "t-n";
      if (OPS[tk]) cls = (isUnarySign(t, i) || (i > 0 && t[i - 1] === "E") || tk === "^") ? "t-sign" : "t-op";
      else if (FUNCS[tk]) cls = "t-fn";
      else if (POST[tk]) cls = "t-post";
      else if (tk === "(" || tk === ")") cls = "t-par";
      else if (CONSTS[tk]) cls = "t-const";
      return '<span class="' + cls + '" data-i="' + i + '">' + esc(tk) + "</span>";
    }
    let lastExprHTML = "";
    function render() {
      const t = model.t;
      let html = "";
      for (let i = 0; i <= t.length; i++) {
        if (i === model.c && !model.final) html += '<span class="calc-caret" aria-hidden="true"></span>';
        if (i < t.length) html += tokenHTML(t, i);
      }
      if (model.final) html += '<span class="t-eq">&nbsp;=</span>';
      html = '<div class="calc-expr-inner">' + html + "</div>";
      if (html !== lastExprHTML) { exprEl.innerHTML = html; lastExprHTML = html; }

      // caret / end of line stays in view
      const caret = exprEl.querySelector(".calc-caret");
      if (caret && model.c < t.length) {
        const left = caret.offsetLeft, view = exprEl.clientWidth;
        if (left < exprEl.scrollLeft + 12) exprEl.scrollLeft = Math.max(0, left - 12);
        else if (left > exprEl.scrollLeft + view - 28) exprEl.scrollLeft = left - view + 28;
      } else exprEl.scrollLeft = exprEl.scrollWidth;

      // result line
      let text, cls = "calc-result";
      if (model.error) { text = model.error; cls += " is-error"; }
      else if (model.final) { text = model.format(model.value); cls += " is-final"; }
      else if (!t.length) { text = "0"; cls += " is-preview"; }
      else {
        const pv = model.previewValue();
        text = pv === null ? "" : model.format(pv);
        cls += " is-preview";
      }
      const len = text.length;
      if (!model.error) cls += len > 21 ? " sz-xs" : len > 15 ? " sz-s" : len > 11 ? " sz-m" : "";
      else cls += len > 18 ? " sz-s" : "";
      if (resEl.className !== cls) resEl.className = cls;
      if (resEl.textContent !== text) resEl.textContent = text;
      screen.classList.toggle("is-final", model.final);
      screen.classList.toggle("is-error", !!model.error);

      // badges + toggles
      memBadge.hidden = model.memory === null;
      memBadge.title = model.memory === null ? "" : "Memory: " + model.format(model.memory);
      angleBadge.textContent = model.angle.toUpperCase();
      setSwitch(sciBtn, sci ? "sci" : "basic", sci ? "Scientific mode on. Press to switch to basic." : "Basic mode. Press to show scientific functions.");
      setSwitch(angleBtn, model.angle, model.angle === "deg" ? "Angle mode: degrees. Press to switch to radians." : "Angle mode: radians. Press to switch to degrees.");
      setSwitch(groupBtn, model.grouping, model.grouping === "in" ? "Digit grouping: Indian, lakh and crore. Press to switch to international." : "Digit grouping: international. Press to switch to Indian.");
      if (panel) panel.classList.toggle("calc-sci", sci);
      root.classList.toggle("is-sci", sci);
      btnByAction.MC.classList.toggle("is-empty", model.memory === null);
      btnByAction.MR.classList.toggle("is-empty", model.memory === null);
      if (btnByAction.MR) btnByAction.MR.title = model.memory === null ? "Memory is empty" : "Recall " + model.format(model.memory);

      // 2nd layer labels
      secondBtn.classList.toggle("is-on", second);
      secondBtn.setAttribute("aria-pressed", second ? "true" : "false");
      keyEls.forEach(k => {
        const d = k.def;
        if (!d.a2) return;
        k.el.innerHTML = second ? d.label2 : d.label;
        k.el.setAttribute("aria-label", second ? d.aria2 : d.aria);
        k.el.classList.toggle("is-second", second);
      });

      const full = model.error ? "Error: " + model.error : model.final ? model.expression + " equals " + text : "";
      screen.setAttribute("aria-label", "Calculator display. " + (model.expression ? "Expression " + model.expression + ". " : "Empty. ") + (full ? full + "." : "") + " Type with your keyboard.");
    }
    function setSwitch(btn, val, label) {
      const opts2 = btn.querySelectorAll(".sw-opt");
      for (let i = 0; i < opts2.length; i++) opts2[i].classList.toggle("on", opts2[i].dataset.v === val);
      btn.setAttribute("aria-checked", (val === "sci" || val === "rad" || val === "intl") ? "true" : "false");
      btn.setAttribute("aria-label", label);
    }
    function announce(msg) { live.textContent = ""; live.textContent = msg; }

    function renderHistory() {
      dList.innerHTML = "";
      if (!model.history.length) {
        dList.appendChild(h("li", "calc-history-empty", "No calculations yet. Press = to save one here."));
        dClear.disabled = true;
        return;
      }
      dClear.disabled = false;
      model.history.forEach((item, i) => {
        const li = h("li", "calc-history-item");
        const e = h("button", "hist-expr", esc(item.e), { type: "button", "aria-label": "Reuse calculation " + item.e, title: "Reuse this calculation" });
        const r = h("button", "hist-res", "= " + esc(model.format(item.v)), { type: "button", "aria-label": "Use result " + model.format(item.v), title: "Use this result" });
        e.addEventListener("click", () => { model.loadExpression(item.e); setHistory(false); render(); focusScreen(); });
        r.addEventListener("click", () => { model.insertValue(item.v); setHistory(false); render(); focusScreen(); });
        li.append(e, r);
        dList.appendChild(li);
      });
    }
    function setHistory(open) {
      if (open && !historyOpen) {
        // Same height as the keypad it replaces, but never taller than the room left in the panel.
        let room = Infinity;
        if (panel) {
          const used = screen.getBoundingClientRect().bottom - panel.getBoundingClientRect().top + panel.scrollTop;
          room = panel.clientHeight - used - 20;
        }
        drawer.style.height = Math.max(190, Math.min(pads.offsetHeight, room)) + "px";
      }
      historyOpen = open;
      drawer.hidden = !open;
      histBtn.setAttribute("aria-expanded", open ? "true" : "false");
      root.classList.toggle("has-history", open);
      if (open) { renderHistory(); const first = dList.querySelector("button"); (first || dClose).focus({ preventScroll: true }); }
    }
    function focusScreen() { try { screen.focus({ preventScroll: true }); } catch (e) { screen.focus(); } }

    /* ---------- actions ---------- */
    const SECOND_ACTIONS = new Set(SCI_KEYS.filter(d => d.a2).map(d => d.a2));
    let flashTimers = new WeakMap();
    function flash(action) {
      const b = btnByAction[action];
      if (!b) return;
      b.classList.add("is-key");
      clearTimeout(flashTimers.get(b));
      flashTimers.set(b, setTimeout(() => b.classList.remove("is-key"), 130));
    }
    function shake() {
      if (document.documentElement.classList.contains("reduce-motion")) return;
      screen.classList.remove("is-nudge");
      void screen.offsetWidth;
      screen.classList.add("is-nudge");
    }

    function act(a, viaKeyboard) {
      const hadFinal = model.final;
      const ok = model.press(a);
      if (SECOND_ACTIONS.has(a) || a === "10^(" || a === "e^(") second = false;
      if (viaKeyboard) flash(a);
      if (a === "=") {
        if (model.final && !hadFinal) { announce("Result " + model.format(model.value)); persist(); if (historyOpen) renderHistory(); }
        else if (model.error) { announce(model.error); shake(); }
      } else if (a === "AC") announce("Cleared");
      else if (a === "MC") { announce("Memory cleared"); persist(); }
      else if (a === "MR") { announce(ok ? "Memory recalled" : "Memory is empty"); if (!ok) shake(); }
      else if (a === "M+" || a === "M" + MINUS) {
        if (ok) { announce("Memory is now " + model.format(model.memory)); persist(); } else { announce("Nothing to store"); shake(); }
      } else if (!ok && !(a === "LEFT" || a === "RIGHT" || a === "HOME" || a === "END")) {
        // rejected input (e.g. a second decimal point): quiet nudge, no error message
        if (a !== "UP" && a !== "DOWN" && a !== "BKSP" && a !== "DEL" && a !== "CE") shake();
      }
      render();
    }

    /* ---------- pointer / touch ---------- */
    // Keep focus on the display while keys are pressed so the keyboard keeps working.
    root.addEventListener("mousedown", e => { if (e.target.closest(".calc-key")) e.preventDefault(); });
    pads.addEventListener("click", e => {
      const b = e.target.closest(".calc-key");
      if (!b) return;
      if (b === secondBtn) { second = !second; render(); return; }
      const a = second && b.dataset.a2 ? b.dataset.a2 : b.dataset.a;
      if (a) act(a, false);
    });
    sciBtn.addEventListener("click", () => {
      sci = !sci; persist(); render();
      window.dispatchEvent(new Event("resize")); // let the panel re-fit the viewport
    });
    angleBtn.addEventListener("click", () => {
      model.setAngle(model.angle === "deg" ? "rad" : "deg"); persist(); render();
      announce(model.angle === "deg" ? "Degrees" : "Radians");
    });
    groupBtn.addEventListener("click", () => {
      model.grouping = model.grouping === "in" ? "intl" : "in"; persist(); render();
      if (historyOpen) renderHistory();
    });
    histBtn.addEventListener("click", () => setHistory(!historyOpen));
    dClose.addEventListener("click", () => { setHistory(false); histBtn.focus({ preventScroll: true }); });
    dClear.addEventListener("click", () => {
      model.clearHistory(); persist(); renderHistory(); announce("History cleared");
      notify("Calculator history cleared", "success", "check-circle");
    });
    // click on the expression moves the caret there
    exprEl.addEventListener("pointerdown", e => {
      const tok = e.target.closest("[data-i]");
      if (model.final) { model.final = false; }
      if (tok) {
        const i = parseInt(tok.dataset.i, 10), r = tok.getBoundingClientRect();
        model.setCaret(e.clientX > r.left + r.width / 2 ? i + 1 : i);
      } else model.setCaret(model.t.length);
      render();
    });

    /* ---------- physical keyboard ---------- */
    function isEditable(el) {
      return !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
    }
    function onKeyDown(e) {
      if (!panel || panel.hidden || e.defaultPrevented) return;
      const target = e.target;
      const inside = panel.contains(target);
      if (!inside && (!active || isEditable(target) || isEditable(document.activeElement))) return;
      // Enter / Space on a focused button inside the panel keeps its normal meaning
      if (inside && target.closest && target.closest("button") && (e.key === "Enter" || e.key === " ")) return;
      // arrow keys inside the history list move between its buttons instead
      if (inside && drawer.contains(target) && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        const items = Array.prototype.slice.call(dList.querySelectorAll("button"));
        const idx = items.indexOf(target);
        if (idx !== -1) {
          e.preventDefault(); e.stopPropagation();
          const nx = items[Math.max(0, Math.min(items.length - 1, idx + (e.key === "ArrowDown" ? 2 : -2)))];
          if (nx) nx.focus({ preventScroll: true });
          return;
        }
      }
      if (e.key === "Escape" && historyOpen) {
        e.preventDefault(); e.stopPropagation();
        setHistory(false); focusScreen();
        return;
      }
      const a = mapKey(e);
      if (!a) return;
      e.preventDefault();
      e.stopPropagation(); // the site's own "/" search shortcut and Escape handlers must not also fire
      if (inside && target !== screen && !(target.closest && target.closest("button"))) focusScreen();
      act(a, true);
    }
    document.addEventListener("keydown", onKeyDown, true);
    // "active" = the student's attention is on the calculator, so bare digits are for it.
    document.addEventListener("pointerdown", e => { active = !!(panel && panel.contains(e.target)); }, true);

    persist();
    render();

    return {
      model: model,
      onOpen: function () {
        active = true;
        requestAnimationFrame(focusScreen);
      }
    };
  }

  return {
    calculate: calculate,
    formatNumber: formatNumber,
    CalcModel: CalcModel,
    splitTokens: splitTokens,
    exprText: exprText,
    mapKey: mapKey,
    mount: mount
  };
}));
