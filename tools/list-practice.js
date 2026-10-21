/* one-off: list practice questions of an expansion unit (usage: node tools/list-practice.js data-12f.js) */
"use strict";
const fs = require("fs"), path = require("path");
const f = process.argv[2] || "data-12f.js";
const src = fs.readFileSync(path.resolve(__dirname, "..", f), "utf8");
const re = /id: (\d+), difficulty: "(\w+)",\s*\n\s*question: "([^"]{0,160})/g;
let m;
while ((m = re.exec(src))) console.log(m[1], m[2].padEnd(7), "|", m[3]);
