include "../../node_modules/circomlib/circuits/mimcsponge.circom";

template HashLeftRight() {
    signal input left;
    signal input right;
    signal output hash;

    component hasher = MiMCSponge(2, 220, 1);
    hasher.ins[0] <== left;
    hasher.ins[1] <== right;
    hasher.k <== 0;

    hash <== hasher.outs[0];
}

template HashChecker() {
    signal input root;
    signal private input left;
    signal private input right;

    component hasher = HashLeftRight();
    hasher.left <== left;
    hasher.right <== right;

    root === hasher.hash;
}

component main = HashChecker();