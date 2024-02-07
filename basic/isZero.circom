pragma circom 2.1.7;

template IsZero() {
	signal input in;
	signal output out;

	// 製造一個倒數
	signal inv;
	inv <-- in != 0 ? 1 / in : 0;

	// 對倒數進行「乘法」來形成「約束」
	// 數字乘上自己的倒數，如果數字不是 0，那麼結果必須是 1，否則結果必須是 0
	out <== inv * -in + 1;

	// out is 0 if in is not 0
	// out is 1 if in is 0
}

component main = IsZero();

// 這裡實踐了 compute, then constrain 的概念

// 但為什麼製造倒數要使用 signal 而不是用 var？
// 如果我們使用 var inv = in != 0 ? 1 / in : 0; 會出現 in * inv，
// 將一個 signal 乘以 var 會出現 FactorOfFive 的問題，導致 non-quadratic constraints error