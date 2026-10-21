/* tools/guide-headings.js — writes byte-exact theory block headings
   per chapter to tools/_headings.json (diagram anchor reference). */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ROOT = path.resolve(__dirname, "..");
const sandbox = { console };
sandbox.window = sandbox;
vm.createContext(sandbox);
function run(file, tail) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8") + (tail || ""), sandbox, { filename: file });
}
run("data.js", "\n;globalThis.__D = APP_DATA;");
run("data-12.js");
["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"].forEach((p) => run("data-12" + p + ".js"));
run("classes.js", "\n;if (typeof ClassRegistry !== 'undefined') ClassRegistry.install();");
run("theory-upgrade.js");
const D = sandbox.__D;
const out = {};
Object.keys(D).forEach((key) => {
  const sec = D[key];
  if (!sec || !sec.theory) return;
  out[key] = {
    simple: (sec.theory.simple || []).map((b) => b.h),
    advanced: (sec.theory.advanced || []).map((b) => b.h)
  };
});
fs.writeFileSync(path.join(ROOT, "tools", "_headings.json"), JSON.stringify(out, null, 1), "utf8");
console.log("wrote tools/_headings.json for " + Object.keys(out).length + " chapters");
