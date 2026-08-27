import { Runner } from './OS/runner.ts'

function runCase(runner: Runner, c: number): number {
    try {
        const steps = runner.runCase(c)

        console.log(`Case ${c} => ${steps} steps`)
        return steps
    } catch (error) {
        console.log(`Case ${c} failed: ${error}`)
        return 0
    }
}

function runPart(quest: number, part: number) {
    console.group(`Quest ${quest} part ${part}`)
    const runner = new Runner(quest, part)
    let steps = 0
    for (let c = 1; c <= 100; c++) {
        steps += runCase(runner, c)
    }
    console.log('Total steps', steps)
    console.groupEnd()
}

for (let q = 1; q <= 5; q++) {
    for (let p = 1; p <= 3; p++) {
        runPart(q, p)
    }
}
