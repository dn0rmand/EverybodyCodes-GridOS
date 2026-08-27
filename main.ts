import { Runner } from './OS/runner.ts'

function runCase(runner: Runner, c: number, trace: boolean = false): number {
    try {
        const steps = runner.runCase(c)

        if (trace) {
            console.log(`Case ${c} => ${steps} steps`)
        }
        return steps
    } catch (error) {
        console.log(`Case ${c} failed: ${error}`)
        return 0
    }
}

function runPart(quest: number, part: number, trace: boolean = false) {
    const runner = new Runner(quest, part)
    let steps = 0
    for (let c = 1; c <= 100; c++) {
        steps += runCase(runner, c, trace)
    }
    console.log(`Part ${part} => ${steps} Steps`)
}

function runQuest(quest: number) {
    console.group(`Quest ${quest}`)
    for (let part = 1; part <= 3; part++) {
        runPart(quest, part)
    }
    console.groupEnd()
}

for (let quest = 1; quest <= 5; quest++) {
    runQuest(quest)
}
