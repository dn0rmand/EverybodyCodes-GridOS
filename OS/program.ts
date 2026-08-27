import { TLimits, TProgram, TRule, THead } from './types.ts'

export class ProgramParser {
    static loadProgram(filename: string, limits: TLimits): TProgram {
        const data = Deno.readTextFileSync(filename)
        const lines = data
            .split('\n')
            .filter(l => l.length > 0)
            .map(l => l.split('//')[0].trim())
            .filter(l => l.length > 0)
            .map(l => l.split(' ').filter(s => s.length > 0))

        if (lines.length === 0) {
            throw 'Empty program'
        }

        const program: TProgram = { heads: [], rules: [] }

        program.heads = ProgramParser.parseHeads(lines.shift()!)
        program.rules = lines.map(l => ProgramParser.parseRule(program.heads, l))

        ProgramParser.validate(program, limits)
        return program
    }

    static validate(program: TProgram, limits: TLimits) {
        if (program.rules.every(r => r.state !== 'START')) {
            throw "Program doesn't have a START state"
        }

        if (program.rules.every(r => r.nextState !== 'STOP')) {
            throw 'Program is missing a STOP'
        }

        const states: Set<string> = new Set(program.rules.map(r => r.state))

        if (states.size > limits.states) {
            throw `Too many states. Limit is ${limits.states}`
        }

        states.add('STOP')
        const missingStates = program.rules.map(r => r.nextState).filter(s => !states.has(s))
        if (missingStates.length > 0) {
            throw `States ${missingStates.join(', ')} are missing`
        }

        if (program.heads.length > limits.heads) {
            throw `Too many heads. Limit is ${limits.heads}`
        }
        if (program.rules.length > limits.rules) {
            throw `Too many rules. Limit is ${limits.rules}`
        }
    }

    static parseRule(heads: THead[], tokens: string[]): TRule {
        if (tokens.length !== 5) {
            throw 'Syntax error: expected 4 entries'
        }

        tokens[1] = this.normalize(tokens[1])
        tokens[3] = this.normalize(tokens[3])
        tokens[4] = this.normalize(tokens[4])

        if (tokens[1].length !== heads.length) {
            throw "Read's length doesn't match the number of heads"
        }
        if (tokens[3].length !== heads.length) {
            throw "Write's length doesn't match the number of heads"
        }
        if (tokens[4].length !== heads.length) {
            throw "Move's length doesn't match the number of heads"
        }
        const rule: TRule = {
            state: tokens[0],
            read: tokens[1],
            nextState: tokens[2],
            write: tokens[3],
            move: tokens[4].split('').filter(t => t === 'S' || t === 'L' || t === 'R' || t === 'D' || t === 'U'),
        }

        return rule
    }

    static normalize(token: string): string {
        return token
            .split('')
            .filter(c => c !== '/')
            .join('')
    }

    static parseHeads(tokens: string[]): THead[] {
        if (tokens[0] !== 'HEADS') {
            throw 'Syntax error: HEADS token expected'
        }
        if (tokens.length != 2) {
            throw 'Syntax error: HEADS takes 1 argument'
        }
        const hs = tokens[1].split('').filter(c => c !== '/')
        const heads = hs.filter(h => h === 'A' || h === 'B' || h === 'C' || h === 'D')
        if (hs.length !== heads.length) {
            throw 'Syntax error: HEADS allows only combinaison of A,B,C or D'
        }
        return heads
    }
}
