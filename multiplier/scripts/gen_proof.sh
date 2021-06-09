#!/bin/bash

# This script will generate following files:
# witness.wtns
# witness.json
# proof.json
# public.json

# constants
INPUT_PATH=./core/input.json

cd "$(dirname "$0")"

cd ..

snarkjs wtns calculate circuit.wasm $INPUT_PATH witness.wtns
[ $? -eq 0 ] && echo "success: witness.wtns"

snarkjs wtns export json witness.wtns witness.json
[ $? -eq 0 ] && echo "success: witness.json"

snarkjs groth16 prove circuit_final.zkey witness.wtns proof.json public.json
[ $? -eq 0 ] && echo "success: proof.json & public.json"
