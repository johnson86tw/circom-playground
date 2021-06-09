const circomlib = require("circomlib");
const mimcsponge = circomlib.mimcsponge;

function hash(left, right) {
  return mimcsponge.multiHash([BigInt(left), BigInt(right)]).toString();
}

const left = 123;
const right = 456;
const root = hash(left, right);

console.log(`left: ${left}, right: ${right}`);
console.log();
console.log("bytes: ", root);
console.log("hex: ", "0x" + BigInt(root).toString(16));

const r = "0x21f50c15dc5c926121c7eca8eb8f4075715444d4046c37dc01c2b0126ab169f1";
console.log(BigInt(r).toString());
