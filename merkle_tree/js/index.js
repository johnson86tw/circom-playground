const { MerkleTree } = require("./merkleTree");

const levels = 5;
const leaves = [123, 456, 789, 101112, 131415].map(e => e.toString());

const tree = new MerkleTree(levels, leaves);

const index = 3;
console.log(tree.proof(index));
