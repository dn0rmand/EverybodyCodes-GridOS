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

// console.log(`

// // Finish 54

// MISS54 PP/****/**** MISS54 **/PPPP/PPPP DD/LLLL/RRRR
// MISS54 P_/****/**** ADD38 **/PPPP/PPPP DL/LLLL/RRRR

// ADD38 **/****/**** ADD28 PP/PPPP/PPPP DD/LLLL/RRRR
// ADD28 **/****/**** ADD18 PP/PPPP/PPPP DD/LLLL/RRRR
// ADD18 **/****/**** ADD8 PP/PPPP/PPPP DD/LLLL/RRRR
// ADD8 **/****/**** STOP PP/PPPP/PP** DD/LLLL/RRRR
// `)
