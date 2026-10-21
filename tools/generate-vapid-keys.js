#!/usr/bin/env node
/* Generates ONE VAPID key pair with the project's own web-push package
   and prints it to the terminal. It never writes a file — save the
   output somewhere private (a password manager), put the values in
   Netlify's environment variables, and never commit them.
   Do NOT run this again after you have deployed: a new pair makes every
   existing subscription stop working. Run: npm run vapid:generate */
const webpush = require("web-push");
const k = webpush.generateVAPIDKeys();
console.log("VAPID_PUBLIC_KEY=" + k.publicKey);
console.log("VAPID_PRIVATE_KEY=" + k.privateKey + "   <-- SECRET");
console.log("VAPID_SUBJECT=mailto:you@example.com   <-- use your real e-mail or your site URL (https://...)");
