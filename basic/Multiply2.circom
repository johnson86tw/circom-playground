pragma circom  2.1.7;

template Multiply() {
    signal input a;
    signal input b;
    signal input c;
    signal v;
    signal output out;

    v <-- a * b;
    out <== v * c;
}

component main = Multiply();