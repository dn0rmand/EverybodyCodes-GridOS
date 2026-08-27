import { TProgram, TRule, TCase, TPosition, TMove } from './types.ts'

enum READ {
    ANY = '*',
    EMPTY = '_',
    NOT_EMPTY = '!',
}

enum WRITE {
    SKIP = '*',
    EMPTY = '_',
    INVALID = '!',
}

const MOVES = {
    U: { x: 0, y: -1 },
    D: { x: 0, y: 1 },
    L: { x: -1, y: 0 },
    R: { x: 1, y: 0 },
    S: { x: 0, y: 0 },
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
        if (input.validate === 'TEXT' && input.expected.length > 0) {
            if (input.expected.split('').some(c => c !== input.expected[0])) {
                throw 'expected string is not a list of on single character'
            }
        }
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

    private keyFromPosition(x: number, y: number): string {
        return `${x}:${y}`
    }

    private positionFromKey(key: string): TPosition {
        const [x, y] = key.split(':').map(v => +v)

        return { x, y }
    }

    private set(x: number, y: number, value: string) {
        if (value === '_') {
            value = ' '
        }
        const key = this.keyFromPosition(x, y)
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

    private get(x: number, y: number): string {
        const key = this.keyFromPosition(x, y)
        return this.grid.get(key) ?? ' '
    }

    public step(): boolean {
        const values = this.heads.map(p => this.get(p.x, p.y)).join('')
        const matchingRules = this.rules.filter(r => r.state === this.state && this.isMatch(r.read, values))

        if (matchingRules.length > 1) {
            throw `Duplicate rule matching ${this.state} ${values}`
        } else if (matchingRules.length === 0) {
            throw `No rule found of for state ${this.state} ${values}`
        }

        const rule = matchingRules[0]
        this.write(rule.write, values)
        this.move(rule.move)
        this.state = rule.nextState
        return rule.nextState !== 'STOP'
    }

    private move(move: TMove[]) {
        if (move.length != this.heads.length) {
            throw 'Not the same length'
        }
        for (let i = 0; i < move.length; i++) {
            const { x, y } = this.heads[i]
            const { x: ox, y: oy } = MOVES[move[i]]
            this.heads[i] = { x: x + ox, y: y + oy }
        }
    }

    private write(write: string, values: string) {
        if (values.length !== write.length) {
            throw 'Not the same length'
        }

        this.writeCache.clear()
        for (let i = 0; i < values.length; i++) {
            const w = write[i]
            const { x, y } = this.heads[i]
            switch (w) {
                case WRITE.SKIP:
                    break // do nothing
                case WRITE.EMPTY:
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

    private validateExactResult() {
        const expectedData = this.input.expected.split('\n')
        const minX = 0
        const maxX = Math.max(...expectedData.map(l => l.length))
        const minY = 0
        const maxY = expectedData.length
        this.grid.forEach((value, key) => {
            const { x, y } = this.positionFromKey(key)
            if (x < minX || x >= maxX || y < minY || y >= maxY) {
                if (value !== ' ') {
                    throw 'Invalid result: remaining values outside the limits'
                }
            }
            const expected = (expectedData[y] ?? [])[x] ?? '_'
            if (value === ' ') {
                value = '_'
            }
            if (value !== expected) {
                throw `Invalid result: ${value} found at position ${x},${y} instead of ${expected}`
            }
        })
    }

    private validateTextResult() {
        const length = this.input.expected.length
        const ref = length === 0 ? '' : this.input.expected[0]

        let count = 0
        let bad = 0

        this.grid.forEach(value => {
            if (value === ref) {
                count++
            } else if (value !== ' ') {
                bad++
            }
        })

        if (bad > 0) {
            throw `Invalid result. ${bad} characters different than ${ref}`
        } else if (count !== length) {
            throw `Invalid result. ${count} ${ref === '  '} instead of ${length}`
        }
    }

    public validateResult() {
        if (this.input.validate === 'EXACT') {
            this.validateExactResult()
        } else {
            this.validateTextResult()
        }
    }

    private isMatch(read: string, values: string) {
        if (values.length !== read.length) {
            throw 'Not the same length'
        }
        for (let i = 0; i < values.length; i++) {
            const c = values[i]
            const r = read[i]
            switch (r) {
                case READ.EMPTY:
                    if (c !== ' ') {
                        return false
                    } else {
                        break
                    }
                case READ.ANY:
                    break
                case READ.NOT_EMPTY:
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
