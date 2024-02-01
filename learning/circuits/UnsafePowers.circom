pragma circom  2.1.7;

template Powers(k) {
	signal input a;
	signal output powers[k];

	powers[0] <== a;
	powers[1] <== a * a;
	powers[2] <== a ** 3;
	powers[3] <== a ** 4;
	powers[4] <== a ** 5;
	powers[5] <== a ** 6;
}

component main = Powers(6);