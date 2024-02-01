pragma circom  2.1.7;

template Powers(k) {
	signal input a;
	signal output powers[k];

	powers[0] <== a;
	for (var i = 1; i < k; i++) {
		powers[i] <== powers[i-1] * a;
	}

	// equal to
	// powers[0] <== a;
	// powers[1] <== powers[0] * a;
	// powers[2] <== powers[1] * a;
	// powers[3] <== powers[2] * a;
	// powers[4] <== powers[3] * a;
	// powers[5] <== powers[4] * a;
}

component main = Powers(6);