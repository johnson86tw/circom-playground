const { eddsa, mimcsponge } = require("circomlib");
const { sign } = require("circomlib/src/eddsa");
const { MerkleTree } = require("../../utils/merkleTree");
const fs = require("fs");
const path = require("path");

const levels = 4;
const senderPrvKey = "0001020304050607080900010203040506070809000102030405060708090001";
const receiverPrvKey = "00010203040506070809000102030405060708090001020304050607080900AA";

const senderInitialBalance = 10 * 10 ** 18;
const receiverInitialBalance = 0;
const transferAmount = 8 * 10 ** 18;

function getAccount(prvKeyHex, balance) {
  const prvKey = Buffer.from(prvKeyHex, "hex");
  const pubKey = eddsa.prv2pub(prvKey);
  return {
    prvKey,
    pubKey,
    balance: BigInt(balance),
  };
}

function hashAccount(account) {
  return mimcsponge.multiHash([account.pubKey[0], account.pubKey[1], account.balance]);
}

function hashMessage(pubA, pubB, amount) {
  return mimcsponge.multiHash([pubA[0], pubA[1], pubB[0], pubB[1], amount]);
}

function main() {
  // init
  const tree = new MerkleTree(levels);
  const senderAccount = getAccount(senderPrvKey, senderInitialBalance);
  const receiverAccount = getAccount(receiverPrvKey, receiverInitialBalance);

  tree.insert(hashAccount(senderAccount).toString());
  tree.insert(hashAccount(receiverAccount).toString());
  const initRoot = tree.root();

  const senderProof = tree.proof(0);

  // sign message
  const msg = hashMessage(senderAccount.pubKey, receiverAccount.pubKey, BigInt(transferAmount));
  const signature = eddsa.signMiMC(senderAccount.prvKey, msg);
  if (!eddsa.verifyMiMC(msg, signature, senderAccount.pubKey)) {
    throw new Error("signature not verified");
  }

  // calculate sender's new leaf
  const newSenderAccount = getAccount(senderPrvKey, senderInitialBalance - transferAmount);
  tree.update(0, hashAccount(newSenderAccount).toString());
  const newSenderRoot = tree.root(); // intermediate root

  // calculate receiver's new leaf (final root)
  const newReceiverAccount = getAccount(receiverPrvKey, receiverInitialBalance + transferAmount);
  tree.update(1, hashAccount(newReceiverAccount).toString());
  const finalProof = tree.proof(1);

  const input = {
    accountRoot: initRoot,

    newSenderAccountRoot: newSenderRoot,

    accountPubKey: senderAccount.pubKey.map(e => e.toString()),
    accountBalance: senderAccount.balance.toString(),

    // sender
    senderPubKey: senderAccount.pubKey.map(e => e.toString()),
    senderBalance: senderAccount.balance.toString(),
    amount: BigInt(transferAmount).toString(),
    R8: signature.R8.map(e => e.toString()),
    S: signature.S.toString(),
    senderPathElements: senderProof.pathElements,
    senderPathIndices: senderProof.pathIndices,

    // receiver
    receiverPubKey: receiverAccount.pubKey.map(e => e.toString()),
    receiverBalance: receiverAccount.balance.toString(),
    receiverPathElements: finalProof.pathElements,
    receiverPathIndices: finalProof.pathIndices,
  };

  console.log(input);
  console.log("public: ", {
    finalRoot: finalProof.root,
    accountRoot: initRoot,
  });

  console.log("Generating new input.json...");
  fs.writeFileSync(path.resolve(__dirname, "../core/input.json"), JSON.stringify(input), "utf-8");
  console.log("done");
}

main();
