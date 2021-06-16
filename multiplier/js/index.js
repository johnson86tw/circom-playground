const { groth16 } = require("snarkjs");
const path = require("path");

const wasmPath = path.join(__dirname, "../circuit.wasm");
const zkeyPath = path.join(__dirname, "../circuit_final.zkey");
const vkeyPath = path.join(__dirname, "../verification_key.json");
const vkey = require(vkeyPath);

async function main() {
  const input = { a: "3", b: "11" };
  console.log("input: ", input);

  let { proof, publicSignals } = await groth16.fullProve(input, wasmPath, zkeyPath);
  console.log(`public: ${publicSignals}`);

  const isValid = await groth16.verify(vkey, publicSignals, proof);
  console.log(`isValid: ${isValid}`);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    throw new Error(e);
  });
