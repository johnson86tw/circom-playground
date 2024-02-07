# Test

### compile circom
```
circom circuit.circom  --r1cs --wasm --sym --c
```

### generate witness
- create `input.json` at first.
```
bun ./circuit_js/generate_witness.js circuit_js/circuit.wasm input.json circuit_js/witness.wtns
```

### setup zkey (proving key)
```
snarkjs groth16 setup circuit.r1cs ../pot12_final.ptau circuit_0000.zkey                       
```


### contribute phase 2 ceremony
```
snarkjs zkey contribute circuit_0000.zkey circuit_0001.zkey --name="1st Contributor Name" -v
```


### export verificationkey
```
snarkjs zkey export verificationkey circuit_0001.zkey verification_key.json             
```

### generate proof
```
snarkjs groth16 prove circuit_0001.zkey ./circuit_js/witness.wtns proof.json public.json
```


### verify with verification_key, public, and proof
```
snarkjs groth16 verify verification_key.json public.json proof.json
```