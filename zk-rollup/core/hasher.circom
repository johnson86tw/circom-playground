include "../../node_modules/circomlib/circuits/mimcsponge.circom";

template AccountHasher() {
    signal input pubKey[2];
    signal input balance;
    signal output hash;

    component hasher = MiMCSponge(3, 220, 1);
    hasher.ins[0] <== pubKey[0];
    hasher.ins[1] <== pubKey[1];
    hasher.ins[2] <== balance;
    hasher.k <== 0;

    hash <== hasher.outs[0];
}

template MessageHasher(n) {
    signal input ins[n];
    signal output hash;

    component hasher = MiMCSponge(n, 220, 1);
    for (var i = 0; i < n; i++) {
        hasher.ins[i] <== ins[i];
    }
    hasher.k <== 0;

    hash <== hasher.outs[0];
}