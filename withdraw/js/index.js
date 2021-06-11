const { MerkleTree } = require("./merkleTree");
const circomlib = require("circomlib");
const crypto = require("crypto");

// source: https://github.com/no2chem/bigint-buffer/blob/c4d61b5c4fcaab36c55130840e906c162dfce646/src/index.ts#L25
function toBigIntLE(buf) {
  const reversed = Buffer.from(buf);
  reversed.reverse();
  const hex = reversed.toString("hex");
  if (hex.length === 0) {
    return BigInt(0);
  }
  return BigInt(`0x${hex}`);
}

/** Generate random buffer of specified byte length */
const rbuffer = nbytes => crypto.randomBytes(nbytes);

/** Compute pedersen hash */
const pedersenHash = data => circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(data))[0];

/** Must use toBigInt 'LE' to generate same result in circom pedersen */
const rbuf = rbuffer(31);
const secret = toBigIntLE(rbuf).toString();
console.log("secret: ", secret);
const commitment = pedersenHash(rbuf);
console.log("commitment: ", commitment.toString());

const levels = 20;
const leaves = [123, 456, commitment, 101112, 131415].map(e => e.toString());

const tree = new MerkleTree(levels, leaves);

const index = 2;
const proof = tree.proof(index);

const input = {
  secret: secret,
  root: proof.root,
  pathElements: proof.pathElements,
  pathIndices: proof.pathIndices,
};
console.log("input: ");
console.log(input);
