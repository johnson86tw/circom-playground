pragma circom 2.1.7;

include "../../node_modules/circomlib/circuits/comparators.circom";

template Max(n) {
	signal input in[n];
	signal output out;

	signal highest;

	for (var i = 0; i < n; i++) {
		component gt = GreaterThan(8);
		gt.in[0] <== in[i];
		gt.in[1] <== highest;
	}

	

	out <== max;
}

component main = Max(3);