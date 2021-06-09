#!/bin/bash

# This script will generate following files:
# circuit.r1cs
# circuit.sym
# circuit.wasm
# powersOfTau28_hez_final_11.ptau
# circuit_0000.zkey
# circuit_final.zkey
# verification_key.json

# constants
TARGET_CIRCUIT=./core/circuit.circom
PTAU_FILE=powersOfTau28_hez_final_11.ptau
ENTROPY_FOR_ZKEY=qiwhef

cd "$(dirname "$0")"

cd ..

circom $TARGET_CIRCUIT --r1cs circuit.r1cs --wasm circuit.wasm --sym circuit.sym
[ $? -eq 0 ] && echo "success: circuit.r1cs & circuit.sym & circuit.wasm"

# download $PTAU_FILE
if [ -f ./$PTAU_FILE ]; then
    echo skip: "$PTAU_FILE already exists"
else
    wget https://hermez.s3-eu-west-1.amazonaws.com/$PTAU_FILE
    [ $? -eq 0 ] && echo "success: $PTAU_FILE"
fi

# generate circuit_0000.zkey
snarkjs zkey new circuit.r1cs $PTAU_FILE circuit_0000.zkey
[ $? -eq 0 ] && echo "success: circuit_0000.zkey"

# generate circuit_final.zkey
echo $ENTROPY_FOR_ZKEY | snarkjs zkey contribute circuit_0000.zkey circuit_final.zkey
[ $? -eq 0 ] && echo "success: circuit_final.zkey"

# generate verification_key.json
snarkjs zkey export verificationkey circuit_final.zkey verification_key.json
[ $? -eq 0 ] && echo "success: verification_key.json"
