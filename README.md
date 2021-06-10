# circuit playground

## Pre-requisites
```
npm install -g circom
npm install -g snarkjs
```
or
```
npx circom ...
npx snarkjs ...
```

## Guild
At first, `cd` into one circuit folder:
```
cd multiplier
```

### build snarks `bash ./scripts/build_circuits.sh`
1. `circom circuit.circom --r1cs --wasm --sym` --> circuit.r1cs & circuit.sym & circuit.wasm
2. `wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau` --> powersOfTau28_hez_final_10.ptau
3. `snarkjs zkey new circuit.r1cs powersOfTau28_hez_final_10.ptau circuit_0000.zkey` --> circuit_0000.zkey
4. `snarkjs zkey contribute circuit_0000.zkey circuit_final.zkey` --> enter random text --> circuit_final.zkey
5. `snarkjs zkey export verificationkey circuit_final.zkey verification_key.json` --> verification_key.json

### generate proof `bash ./scripts/gen_proof.sh`
6. create input.json including `{"a": 3, "b": 11}`
7. `snarkjs wtns calculate circuit.wasm input.json witness.wtns` --> witness.wtns
8. `snarkjs wtns export json witness.wtns witness.json` --> witness.json
9.  `snarkjs groth16 prove circuit_final.zkey witness.wtns proof.json public.json` --> proof.json & public.json

### verify `bash ./scripts/verify.sh`
10. `snarkjs groth16 verify verification_key.json public.json proof.json` // snarkJS: OK! (or Invalid proof)
11. `snarkjs zkey export solidityverifier circuit_final.zkey verifier.sol` --> verifier.sol
12. `snarkjs zkey export soliditycalldata public.json proof.json`

### others
```
snarkjs r1cs info circuit.r1cs
```
- [INFO]  snarkJS: Curve: bn-128
- [INFO]  snarkJS: # of Wires: 4
- [INFO]  snarkJS: # of Constraints: 1
- [INFO]  snarkJS: # of Private Inputs: 2
- [INFO]  snarkJS: # of Public Inputs: 0
- [INFO]  snarkJS: # of Labels: 4
- [INFO]  snarkJS: # of Outputs: 1

```
snarkjs r1cs print circuit.r1cs circuit.sym
```
- [INFO]  snarkJS: [ 21888242871839275222246405745257275088548364400416034343698204186575808495616main.a ] * [ main.b ] - [ 21888242871839275222246405745257275088548364400416034343698204186575808495616main.c ] = 0

```
snarkjs wtns debug circuit.wasm input.json witness.wtns circuit.sym
```

clean all files built from step 1~9
```
bash ./script/clean.sh
```

## Tutorial
- https://github.com/iden3/circom/blob/master/TUTORIAL.md

## Deprecated work flow
1. `cd helloworld`
2. `npx circom@0.0.34 circuit.circom` --> circuit.json
3. `npx snarkjs@0.1.20 setup --protocol groth` --> proving_key.json & verification_key.json
4. create new file --> input.json
5. `npx snarkjs@0.1.20 calculatewitness` --> witness.json
6. `npx snarkjs@0.1.20 proof` --> proof.json & public.json
7. `npx snarkjs@0.1.20 verify` // OK
