pragma circom  2.1.7;

template Square() {
	signal input in;
	signal output out;

	out <== in * in;
}

template SumOfSquares() {
	signal input a;
	signal input b;
	signal output out;

	component sq1 = Square();
	sq1.in <== a;

	component sq2 = Square();
	sq2.in <== b;

	out <== sq1.out + sq2.out;
}

component main = SumOfSquares();
