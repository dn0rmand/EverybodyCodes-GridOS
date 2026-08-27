function GenerateQuest1Part3() {
    function generate(missed: number): string[] {
        return [
            ``,
            `// Missing ${missed}`,
            ``,
            `MISS${missed} AA/****/**** MISS${missed - 8} PP/PPPP/PPPP RR/LLLL/RRRR`,
            `MISS${missed} AB/****/**** MISS${missed - 7} PP/PPPP/PPPP RR/LLLL/RRRR`,
            `MISS${missed} AC/****/**** MISS${missed - 5} PP/PPPP/PPPP RR/LLLL/RRRR`,
            `MISS${missed} AD/****/**** MISS${missed - 1} PP/PPPP/PPPP RR/LLLL/RRRR`,
            `MISS${missed} A_/****/**** MISS${missed - 10} PP/PPPP/PPPP RR/LLLL/RRRR`,
            ``,
            `MISS${missed} BA/****/**** MISS${missed - 7} PP/PPPP/PPPP RR/LLLL/RRRR`,
            `MISS${missed} BB/****/**** MISS${missed - 6} PP/PPPP/PPPP RR/LLLL/RRRR`,
            `MISS${missed} BC/****/**** MISS${missed - 4} PP/PPPP/PPPP RR/LLLL/RRRR`,
            `MISS${missed} BD/****/**** MISS${missed - 2} PP/PPPP/PPPP RR/LLLL/RRRR`,
            `MISS${missed} B_/****/**** MISS${missed - 11} PP/PPPP/PPPP RR/LLLL/RRRR`,
            ``,
            `MISS${missed} CA/****/**** MISS${missed - 5} PP/PPPP/PPPP RR/LLLL/RRRR`,
            `MISS${missed} CB/****/**** MISS${missed - 4} PP/PPPP/PPPP RR/LLLL/RRRR`,
            `MISS${missed} CC/****/**** MISS${missed - 2} PP/PPPP/PPPP RR/LLLL/RRRR`,
            `MISS${missed} CD/****/**** MISS${missed} PP/PPPP/PPPP RR/LLLL/RRRR`,
            `MISS${missed} C_/****/**** MISS${missed - 7} PP/PPPP/PPPP RR/LLLL/RRRR`,
            ``,
            `MISS${missed} DA/****/**** MISS${missed - 3} PP/PPPP/PPPP RR/LLLL/RRRR`,
            `MISS${missed} DB/****/**** MISS${missed - 2} PP/PPPP/PPPP RR/LLLL/RRRR`,
            `MISS${missed} DC/****/**** MISS${missed} PP/PPPP/PPPP RR/LLLL/RRRR`,
            `MISS${missed} D_/****/**** MISS${missed - 5} PP/PPPP/PPPP RR/LLLL/RRRR`,
            ``,
            `MISS${missed} DD/****/**** MISS${missed + 2} PP/PPPP/PPPP RR/LLLL/RRRR`,
            ``,
            `MISS${missed} _*/****/**** MISS${missed - 8}  **/PPPP/PPPP SS/LLLL/RRRR`,
            `MISS${missed} P*/****/**** MISS${missed - 8}  **/PPPP/PPPP SS/LLLL/RRRR`,
        ]
    }

    for (let idx = 7; idx <= 12; idx += 1) {
        generate(idx).forEach(s => console.log(s))
    }
}

function generateQuest2Part2() {
    const keys: Set<string> = new Set()

    function generateKeys(key: string) {
        if (key.length === 5) {
            keys.add(key)
            return
        }

        if (key[key.length - 1] === '_') {
            generateKeys(key + '_')
        } else {
            generateKeys(key + 'A')
            generateKeys(key + 'B')
            generateKeys(key + '_')
        }
    }

    generateKeys('A')
    generateKeys('B')

    for (const left of keys) {
        const leftEmpty = left.split('').filter(c => c === '_').length
        for (const right of keys) {
            const rightEmpty = right.split('').filter(c => c === '_').length
            if (leftEmpty !== rightEmpty) {
                continue
            }
            const items: string[] = ['RUN', `${left}/${right}`, 'RUN', '', 'RRRRR/RRRRR']
            const t = []
            for (let i = 0; i < 5; i++) {
                if (left[i] === right[i] && left[i] !== '_') {
                    t.push('@')
                } else {
                    t.push('_')
                }
            }
            items[3] = t.join('') + '/*****'
            console.log(items.join(' '))
        }
    }
}

generateQuest2Part2()
