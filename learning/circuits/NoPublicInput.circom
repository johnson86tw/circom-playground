pragma circom 2.1.7;

template Multiply() {
	signal input a;
	signal input b;
	signal input c;

	c === a * b;
}

component main = Multiply();