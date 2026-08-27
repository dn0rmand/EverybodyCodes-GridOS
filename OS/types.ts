//  _  (underscore) - an empty value
//  *  - in  READ  argument, it matches any value (or empty cell)
//  !  - in  READ  argument, it matches any non-empty value
//  *  - in  WRITE  argument, it means “leave the current value unchanged”

export type THead = 'A' | 'B' | 'C' | 'D'
export type TMove = 'U' | 'D' | 'L' | 'R' | 'S'

export type TPosition = {
    x: number
    y: number
}

export type TRule = {
    state: string
    read: string
    nextState: string
    write: string
    move: TMove[]
}

export type TLimits = {
    heads: number
    states: number
    rules: number
    steps: number
    bytes: number
}

export type TStartPoint = {
    A: TPosition
    B: TPosition
    C: TPosition | undefined
    D: TPosition | undefined
}

export type TCase = {
    startPoints: TStartPoint
    data: string
    validate: 'EXACT' | 'TEXT'
    expected: string
}

export type TInput = {
    limits: TLimits
    cases: TCase[]
}

export type TProgram = {
    heads: THead[]
    rules: TRule[]
}
