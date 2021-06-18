include "../../node_modules/circomlib/circuits/eddsamimc.circom";
include "../../node_modules/circomlib/circuits/mimc.circom";
include "../../node_modules/circomlib/circuits/mimcsponge.circom";

template MessageHash(n) {
    signal input ins[n];
    signal output out;

    component hasher = MiMCSponge(n, 220, 1);
    for (var i = 0; i < n; i++) {
        hasher.ins[i] <== ins[i];
    }
    hasher.k <== 0;

    out <== hasher.outs[0];
}

template VerifyMessage() {
    signal private input from_x;
    signal private input from_y;
    signal private input ins[3]
    signal private input R8x;
    signal private input R8y;
    signal private input S;
    
    signal output msgHash;
    
    component hasher = MessageHash(3);
    for (var i = 0; i < 3; i++) {
        hasher.ins[i] <== ins[i];
    } 
    
    msgHash <== hasher.out;

    component verifier = EdDSAMiMCVerifier();
    verifier.enabled <== 1;
    verifier.Ax <== from_x;
    verifier.Ay <== from_y;
    verifier.R8x <== R8x;
    verifier.R8y <== R8y;
    verifier.S <== S;
    verifier.M <== hasher.out;
}

component main = VerifyMessage();