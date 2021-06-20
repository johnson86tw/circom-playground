include "../../node_modules/circomlib/circuits/eddsamimc.circom";
include "./merkleTree.circom";
include "./hasher.circom"

template Semaphore(levels) {
   
}

component main = Semaphore(4);