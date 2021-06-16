template Multiplier() {
    signal private input a;
    signal input b;
    signal output c;

    c <== a * b;
}

component main = Multiplier();