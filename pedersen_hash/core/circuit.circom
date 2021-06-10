include "../../node_modules/circomlib/circuits/bitify.circom";
include "../../node_modules/circomlib/circuits/pedersen.circom";

template CommitmentHasher() {
  signal private input secret;
  signal output commitment;

  component commitmentHasher = Pedersen(248);
  component secretBits = Num2Bits(248);
  secretBits.in <== secret;

  for (var i = 0; i < 248; i++) {
    commitmentHasher.in[i] <== secretBits.out[i];
  }

  commitment <== commitmentHasher.out[0]
}

component main = CommitmentHasher();