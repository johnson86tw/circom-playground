const { MerkleTree } = require("./merkleTree");

const levels = 2;
const leaves = [10, 20, 30, 40].map(e => e.toString());

const tree = new MerkleTree(levels, leaves);

const index = 2;
console.log(tree.proof(index));
