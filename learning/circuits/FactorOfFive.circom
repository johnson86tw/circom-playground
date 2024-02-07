pragma circom 2.1.7;

include "../../node_modules/circomlib/circuits/comparators.circom";


template FactorOfFive() {
	signal input in;
	signal output out;

	// out <== in * 5; // non-quadratic constraint

	signal time;
	time <-- 5;

	component iseq = IsEqual();
	iseq.in[0] <== in * time;
	iseq.in[1] <== in * 5;

	out <== in * time;
}

component main = FactorOfFive();

// r1cs:
// non-linear constraints: 0

// The solution is to write the isEqual template "in" to enforce the equality.