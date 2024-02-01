### compile circom
```
circom circuit.circom  --r1cs --wasm --sym --c
```

### print Rank 1 Constraint System
```
snarkjs r1cs print circuit.r1cs
```

### generate witness
```
bun ./circuit_js/generate_witness.js circuit_js/circuit.wasm input.json circuit_js/witness.wtns
```

### export the witness (optional)
```
snarkjs wtns export json witness.wtns
```

---


### new poweroftau
```
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
```

### contribute powersoftau
```
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v
```

### prepare phase 2

```
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v
```


### setup zkey (proving key)
```
snarkjs groth16 setup circuit.r1cs pot12_final.ptau circuit_0000.zkey                       
```


### contribute phase 2 ceremony
```
snarkjs zkey contribute circuit_0000.zkey circuit_0001.zkey --name="1st Contributor Name" -v
```


### export verificationkey
```
snarkjs zkey export verificationkey circuit_0001.zkey verification_key.json             
```

### generate verifier.sol
```
snarkjs zkey export solidityverifier circuit_0001.zkey verifier.sol
```

---

### generate proof
```
snarkjs groth16 prove circuit_0001.zkey ./circuit_js/witness.wtns proof.json public.json
```


### verify with verification_key, public, and proof
```
snarkjs groth16 verify verification_key.json public.json proof.json
```


### generate calldata
```
snarkjs zkey export soliditycalldata public.json proof.json
```