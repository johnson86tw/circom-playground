const crypto = require("crypto");
const { eddsa, mimc7, mimcsponge } = require("circomlib");

// const secret = crypto.randomBytes(32);
const sha256 = data => crypto.createHash("sha256").update(data).digest("hex");

const prvKey = Buffer.from("1".toString().padStart(64, "0"), "hex");
console.log("private key: ", prvKey);

const pubKey = eddsa.prv2pub(prvKey);

const msg = [123, 456, 789];
const preimage = msg.map(e => BigInt(e));
const msgHash = mimc7.multiHash(preimage);

const signature = eddsa.signMiMC(prvKey, msgHash);

const input = {
  from_x: pubKey[0].toString(),
  from_y: pubKey[1].toString(),
  R8x: signature["R8"][0].toString(),
  R8y: signature["R8"][1].toString(),
  S: signature["S"].toString(),
  M: msgHash.toString(),
};

console.log(input);
console.log(eddsa.verifyMiMC(msgHash, signature, pubKey));
