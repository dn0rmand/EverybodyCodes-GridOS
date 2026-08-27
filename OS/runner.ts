import { TInput, TProgram } from './types.ts'
import { Engine } from './engine.ts'
import { ProgramParser } from './program.ts'

export class Runner {
    private program: TProgram
    private input: TInput

    constructor(quest: number, part: number) {
        const inputs = JSON.parse(Deno.readTextFileSync(`./Quests/Quest ${quest}/input.json`))

        this.input = inputs[part]
        this.program = ProgramParser.loadProgram(`./Quests/Quest ${quest}/part${part}.gridec`, this.input.limits)
    }

    runCase(testCase: number): number {
        if (testCase < 1 || testCase > this.input.cases.length) {
            throw 'Invalid case number'
        }

        const engine = new Engine(this.program, this.input.cases[testCase - 1])
        let steps = 0
        for (steps = 1; engine.step(); steps++) {
            if (steps > this.input.limits.steps) {
                throw 'Too many steps'
            }
        }

        engine.validateResult()
        return steps
    }
}
