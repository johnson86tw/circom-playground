include "../../node_modules/circomlib/circuits/eddsamimc.circom";
include "./merkleTree.circom";
include "./hasher.circom"

template Transaction(levels) {
    signal input accountRoot; // init root

    signal private input newSenderAccountRoot; // intermediate root
    // account
    signal private input accountPubKey[2];
    signal private input accountBalance;
    // sender
    signal private input senderPubKey[2];
    signal private input senderBalance;
    signal private input amount;
    // signature
    signal private input R8[2];
    signal private input S;
    // existence of sender
    signal private input senderPathElements[levels];
    signal private input senderPathIndices[levels];
    // receiver
    signal private input receiverPubKey[2];
    signal private input receiverBalance;
    // final root path
    signal private input receiverPathElements[levels];
    signal private input receiverPathIndices[levels];

    signal output root; // final root

    // 1. verify existence of sender's account 
    component senderHasher = AccountHasher();
    senderHasher.pubKey[0] <== accountPubKey[0];
    senderHasher.pubKey[1] <== accountPubKey[1];
    senderHasher.balance <== accountBalance;

    component senderTree = MerkleTree(levels);
    senderTree.leaf <== senderHasher.hash;
    for (var i = 0; i < levels; i++) {
        senderTree.pathElements[i] <== senderPathElements[i];
        senderTree.pathIndices[i] <== senderPathIndices[i];
    }
    accountRoot === senderTree.root;  // check existence

    // 2. verify signature of transaction
    component msgHasher = MessageHasher(5);
    msgHasher.ins[0] <== senderPubKey[0];
    msgHasher.ins[1] <== senderPubKey[1];
    msgHasher.ins[2] <== receiverPubKey[0];
    msgHasher.ins[3] <== receiverPubKey[1];
    msgHasher.ins[4] <== amount;

    component verifier = EdDSAMiMCVerifier()
    verifier.enabled <== 1;
    verifier.Ax <== senderPubKey[0];
    verifier.Ay <== senderPubKey[1];
    verifier.R8x <== R8[0];
    verifier.R8y <== R8[1];
    verifier.S <== S;
    verifier.M <== msgHasher.hash // check signature

    // 3. check updated root of new sender's account
    component newSenderHasher = AccountHasher();
    newSenderHasher.pubKey[0] <== senderPubKey[0];
    newSenderHasher.pubKey[1] <== senderPubKey[1];
    newSenderHasher.balance <== accountBalance - amount;

    component newSenderTree = MerkleTree(levels);
    newSenderTree.leaf <== newSenderHasher.hash;
    for (var i = 0; i < levels; i++) {
        newSenderTree.pathElements[i] <== senderPathElements[i];
        newSenderTree.pathIndices[i] <== senderPathIndices[i];
    }
    newSenderAccountRoot === newSenderTree.root; // check intermediate root

    // 4. calculate final root as output
    component receiverHasher = AccountHasher();
    receiverHasher.pubKey[0] <== receiverPubKey[0];
    receiverHasher.pubKey[1] <== receiverPubKey[1];
    receiverHasher.balance <== receiverBalance + amount;

    component newReceiverTree = MerkleTree(levels);
    newReceiverTree.leaf <== receiverHasher.hash;
    for (var i = 0; i < levels; i++) {
        newReceiverTree.pathElements[i] <== receiverPathElements[i];
        newReceiverTree.pathIndices[i] <== receiverPathIndices[i];
    }

    root <== newReceiverTree.root;
}

component main = Transaction(4);