// @ts-ignore
const { groth16 } = require("snarkjs");

async function genProofArgs(proof, pub) {
  proof = unstringifyBigInts(proof);
  pub = unstringifyBigInts(pub);
  const calldata = await groth16.exportSolidityCallData(proof, pub);
  const args = JSON.parse("[" + calldata + "]");
  return args;
}

// source: https://github.com/iden3/ffjavascript/blob/master/src/utils_bigint.js
function unstringifyBigInts(o) {
  if (typeof o == "string" && /^[0-9]+$/.test(o)) {
    return BigInt(o);
  } else if (Array.isArray(o)) {
    return o.map(unstringifyBigInts);
  } else if (typeof o == "object") {
    const res = {};
    const keys = Object.keys(o);
    keys.forEach(k => {
      res[k] = unstringifyBigInts(o[k]);
    });
    return res;
  } else {
    return o;
  }
}

module.exports = {
  genProofArgs,
  unstringifyBigInts,
  groth16,
};
