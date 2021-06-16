#!/bin/bash

cd "$(dirname "$0")"

cd ..

snarkjs groth16 verify verification_key.json public.json proof.json
