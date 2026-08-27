//  _  (underscore) - an empty value
//  *  - in  READ  argument, it matches any value (or empty cell)
//  !  - in  READ  argument, it matches any non-empty value
//  *  - in  WRITE  argument, it means “leave the current value unchanged”

type HEAD = 'A' | 'B' | 'C' | 'D'
type MOVE = 'U' | 'D' | 'L' | 'R' | 'S'

type TPosition = {
    x: number
    y: number
}

type TRule = {
    state: string
    read: string
    nextState: string
    write: string
    move: MOVE[]
}

type TLimits = {
    heads: number
    states: number
    rules: number
    steps: number
    bytes: number
}

type TStartPoint = {
    A: TPosition
    B: TPosition
    C: TPosition | undefined
    D: TPosition | undefined
}

type TCase = {
    startPoints: TStartPoint
    data: string
    validate: 'EXACT' | 'TEXT'
    expected: string
}

type TInput = {
    limits: TLimits
    cases: TCase[]
}

export type TProgram = {
    heads: HEAD[]
    rules: TRule[]
}

export class Engine {
    private input: TCase
    private grid: Map<string, string> = new Map()
    private writeCache: Set<string> = new Set()
    private state: string = 'START'
    private heads: TPosition[]
    private rules: TRule[]
    private leftTop: TPosition = { x: 0, y: 0 }
    private rightBottom: TPosition = { x: 0, y: 0 }

    constructor(program: TProgram, input: TCase) {
        this.input = input
        this.rules = program.rules
        this.heads = program.heads.map(h => {
            if (h !== 'A' && h !== 'B' && h !== 'C' && h !== 'D') {
                throw 'Invalid Head'
            }
            const head = this.input.startPoints[h]
            if (head === undefined) {
                throw 'Head not available'
            }
            return head
        })
        const rows = input.data.split('\n')
        for (let y = 0; y < rows.length; y++) {
            const r = rows[y]
            for (let x = 0; x < r.length; x++) {
                this.set(x, y, r[x])
            }
        }
    }

    set(x: number, y: number, value: string) {
        const key = `${x}:${y}`
        if (this.writeCache.has(key) && this.get(x, y) !== value) {
            throw 'Multiple heads trying to write different values to the same location'
        }
        this.writeCache.add(key)
        this.grid.set(key, value)
        this.leftTop.x = Math.min(x, this.leftTop.x)
        this.leftTop.y = Math.min(y, this.leftTop.y)
        this.rightBottom.x = Math.max(x, this.rightBottom.x)
        this.rightBottom.y = Math.max(y, this.rightBottom.y)
    }

    get(x: number, y: number): string {
        const key = `${x}:${y}`
        return this.grid.get(key) ?? ' '
    }

    step(): boolean {
        const values = this.heads.map(p => this.get(p.x, p.y)).join('')
        const matchingRules = this.rules.filter(r => r.state === this.state && this.isMatch(r.read, values))

        if (matchingRules.length > 1) {
            throw `Duplicate rule matching ${this.state} ${values}`
        } else if (matchingRules.length === 0) {
            throw `No rule found of for state ${values}`
        }

        const rule = matchingRules[0]
        this.write(rule.write, values)
        this.move(rule.move)
        this.state = rule.nextState
        return rule.nextState !== 'STOP'
    }

    move(move: MOVE[]) {
        if (move.length != this.heads.length) {
            throw 'Not the same length'
        }
        for (let i = 0; i < move.length; i++) {
            let { x, y } = this.heads[i]
            switch (move[i]) {
                case 'S':
                    break
                case 'L':
                    x--
                    break
                case 'R':
                    x++
                    break
                case 'U':
                    y--
                    break
                case 'D':
                    y++
                    break
            }
            this.heads[i] = { x, y }
        }
    }

    write(write: string, values: string) {
        if (values.length !== write.length) {
            throw 'Not the same length'
        }

        this.writeCache.clear()
        for (let i = 0; i < values.length; i++) {
            const w = write[i]
            const { x, y } = this.heads[i]
            switch (w) {
                case '*':
                    break // do nothing
                case '_':
                    this.set(x, y, ' ')
                    break // Write space
                case '!':
                    throw 'Not supported'
                default:
                    this.set(x, y, w)
                    break //write w
            }
        }
    }

    validateResult() {
        const lines: string[] = []
        const exact = this.input.validate === 'EXACT'

        for (let y = this.leftTop.y; y <= this.rightBottom.y; y++) {
            const line: string[] = []

            for (let x = this.leftTop.x; x <= this.rightBottom.x; x++) {
                const p = this.get(x, y)
                if (p !== ' ') {
                    line.push(p)
                } else if (exact) {
                    line.push('_')
                }
            }
            lines.push(line.join(''))
        }

        const result = exact ? lines.join('\n') : lines.join('')

        if (result !== this.input.expected) {
            console.log(`Got:\n${result}\nExpected\n${this.input.expected}`)
            throw 'Invalid result'
        }
    }

    isMatch(read: string, values: string) {
        if (values.length !== read.length) {
            throw 'Not the same length'
        }
        for (let i = 0; i < values.length; i++) {
            const c = values[i]
            const r = read[i]
            switch (r) {
                case '_':
                    if (c !== ' ') {
                        return false
                    } else {
                        break
                    }
                case '*':
                    break
                case '!':
                    if (c === ' ') {
                        return false
                    } else {
                        break
                    }
                default:
                    if (c !== r) {
                        return false
                    } else {
                        break
                    }
            }
        }
        return true
    }
}

export class Parser {
    static loadProgram(filename: string, limits: TLimits): TProgram {
        const data = Deno.readTextFileSync(filename)
        const lines = data
            .split('\n')
            .filter(l => l.length > 0)
            .map(l => l.split('//')[0].trim())
            .map(l => l.split(' ').filter(s => s.length > 0))

        if (lines.length === 0) {
            throw 'Empty program'
        }

        const program: TProgram = { heads: [], rules: [] }

        program.heads = Parser.parseHeads(lines.shift()!)
        program.rules = lines.map(l => Parser.parseRule(program.heads, l))

        Parser.validate(program, limits)
        return program
    }

    static validate(program: TProgram, limits: TLimits) {
        if (program.rules.every(r => r.state !== 'START')) {
            throw "Program doesn't have a START state"
        }

        if (program.rules.every(r => r.nextState !== 'STOP')) {
            throw 'Program will not STOP'
        }

        if (program.rules.some(r1 => program.rules.every(r2 => r1.nextState !== 'STOP' && r2.state !== r1.nextState))) {
            throw "Some nextState values don't have a matching state"
        }

        if (program.heads.length > limits.heads) {
            throw `Too many heads. Limit is ${limits.heads}`
        }
        if (program.rules.length > limits.rules) {
            throw `Too many rules. Limit is ${limits.rules}`
        }
        const states: Set<string> = new Set()
        program.rules.forEach(r => {
            states.add(r.state)
            states.add(r.nextState)
        })
        if (states.size > limits.states) {
            throw `Too many states. Limit is ${limits.states}`
        }
    }

    static parseRule(heads: HEAD[], tokens: string[]): TRule {
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

    static parseHeads(tokens: string[]): HEAD[] {
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

export class Runner {
    private program: TProgram
    private input: TInput

    constructor(quest: number, part: number) {
        const inputs = JSON.parse(Deno.readTextFileSync(`./Quests/Quest ${quest}/input.json`))

        this.input = inputs[part]
        this.program = Parser.loadProgram(`./Quests/Quest ${quest}/part${part}.gridec`, this.input.limits)
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
