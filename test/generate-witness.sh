#!/bin/bash
set -e

command="bun run ./circuit_js/generate_witness.js circuit_js/circuit.wasm input.json circuit_js/witness.wtns"

if $command; then
	echo "successfully"
else
	echo "Command failed"
	exit 1
fi
