import { assert } from 'chai'
import { wasm } from 'circom_tester'

describe('Sudoku circuit', function () {
	let arrayCircuit

	before(async function () {
		arrayCircuit = await wasm('./sorting/circuit.circom')
	})

	it('Should generate the witness successfully', async function () {
		let input = {
			ans: ['1', '2', '3', '4', '5'],
			ques: ['4', '5', '1', '3', '2'],
		}
		const witness = await arrayCircuit.calculateWitness(input)
		await arrayCircuit.assertOut(witness, {})
	})
	it('Should fail because there is a number which is not in answer array', async function () {
		let input = {
			ans: ['1', '2', '3', '4', '5'],
			ques: ['6', '5', '1', '3', '2'],
		}
		try {
			await arrayCircuit.calculateWitness(input)
		} catch (err) {
			assert(err.message.includes('Assert Failed'))
		}
	})
	it('Should fail because answer array is not sorted', async function () {
		let input = {
			ans: ['2', '1', '3', '4', '5'],
			ques: ['4', '5', '1', '3', '2'],
		}
		try {
			await arrayCircuit.calculateWitness(input)
		} catch (err) {
			assert(err.message.includes('Assert Failed'))
		}
	})
})
