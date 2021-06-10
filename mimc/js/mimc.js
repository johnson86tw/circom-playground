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
console.log("root: ", root);
console.log("root hex: ", "0x" + BigInt(root).toString(16));
