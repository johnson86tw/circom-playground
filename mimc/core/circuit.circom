include "../../node_modules/circomlib/circuits/mimcsponge.circom";

template HashLeftRight() {
    signal private input left;
    signal private input right;
    signal output hash;

    component hasher = MiMCSponge(2, 220, 1);
    hasher.ins[0] <== left;
    hasher.ins[1] <== right;
    hasher.k <== 0;

    hash <== hasher.outs[0];
}

component main = HashLeftRight();