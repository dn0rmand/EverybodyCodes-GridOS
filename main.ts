import { Runner } from './engine.ts'

function runCase(runner: Runner, c: number): number {
    const steps = runner.runCase(c)

    console.log(`Case ${c} => ${steps} steps`)
    return steps
}

const runner = new Runner(3, 1)
let steps = 0
for (let c = 1; c <= 100; c++) {
    steps += runCase(runner, c)
}
console.log('Total steps', steps)
