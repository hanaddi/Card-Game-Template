

function getWorkSheet1(level, numDumies=null) {
    const cards = [];
    const cardEqu = { cardType: "equation", value: "=", id: `c${cards.length}` };
    cards.push(cardEqu);

    const cardOp = { cardType: "operator", value: "+", id: `c${cards.length}` };
    cards.push(cardOp);

    const result = 2 + Math.floor(Math.random() * 8);
    const number1 = 1 + Math.floor(Math.random() * (result - 1));
    const number2 = result - number1;

    const number1Arr = `${number1}`.split("");
    const number1Cards = [];
    for (const n of number1Arr) {
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        number1Cards.push(card);
    }

    const number2Arr = `${number2}`.split("");
    const number2Cards = [];
    for (const n of number2Arr) {
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        number2Cards.push(card);
    }

    const resultArr = `${result}`.split("");
    const resultCards = [];
    for (const n of resultArr) {
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        resultCards.push(card);
    }

    numDumies = numDumies!=null ? numDumies : Math.min(3, (level - 1) % 5);
    let extraNumbers = 0;
    while (numDumies-- > 0) {
        const n = Math.floor(Math.random() * 10);
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        extraNumbers++;
    }

    const levelSheet = {
        cards: cards.sort(()=>Math.random()<.5?1:-1),
        stock: {
            width: Math.max(5, number1Cards.length + number2Cards.length + extraNumbers),
        },
        works: [
            {
                slots: [
                    ...number1Cards.map(c => ({ pickable: true, pile: [] })),
                    { pickable: false, pile: [cardOp.id] },
                    ...number2Cards.map(c => ({ pickable: true, pile: [] })),
                    { pickable: false, pile: [cardEqu.id] },
                    ...resultCards.map(c => ({ pickable: false, pile: [c.id] })),
                ],
            },
        ],
    };

    return levelSheet;
}

function getWorkSheet2(level, numDumies=null) {
    const cards = [];
    const cardEqu = { cardType: "equation", value: "=", id: `c${cards.length}` };
    cards.push(cardEqu);

    const cardOp = { cardType: "operator", value: "+", id: `c${cards.length}` };
    cards.push(cardOp);

    const result = 2 + Math.floor(Math.random() * 98);
    const number1 = 1 + Math.floor(Math.random() * 9);
    const number2 = result - number1;

    const number1Arr = `${number1}`.split("");
    const number1Cards = [];
    for (const n of number1Arr) {
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        number1Cards.push(card);
    }

    const number2Arr = `${number2}`.split("");
    const number2Cards = [];
    for (const n of number2Arr) {
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        number2Cards.push(card);
    }

    const resultArr = `${result}`.split("");
    const resultCards = [];
    for (const n of resultArr) {
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        resultCards.push(card);
    }

    numDumies = numDumies!=null ? numDumies : Math.min(3, (level - 1) % 5);
    let extraNumbers = 0;
    while (numDumies-- > 0) {
        const n = Math.floor(Math.random() * 10);
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        extraNumbers++;
    }

    const levelSheet = {
        cards: cards.sort(()=>Math.random()<.5?1:-1),
        stock: {
            width: Math.max(5, number1Cards.length + number2Cards.length + extraNumbers),
        },
        works: [
            {
                slots: [
                    ...number1Cards.map(c => ({ pickable: true, pile: [] })),
                    { pickable: false, pile: [cardOp.id] },
                    ...number2Cards.map(c => ({ pickable: true, pile: [] })),
                    { pickable: false, pile: [cardEqu.id] },
                    ...resultCards.map(c => ({ pickable: false, pile: [c.id] })),
                ],
            },
        ],
    };

    return levelSheet;
}

function getWorkSheet3(level, numDumies=null) {
    const cards = [];
    const cardEqu = { cardType: "equation", value: "=", id: `c${cards.length}` };
    cards.push(cardEqu);

    const cardOp = { cardType: "operator", value: "+", id: `c${cards.length}` };
    cards.push(cardOp);

    const result = 20 + Math.floor(Math.random() * 80);
    const number1 = 10 + Math.floor(Math.random() * (result - 15));
    const number2 = result - number1;

    const number1Arr = `${number1}`.split("");
    const number1Cards = [];
    for (const n of number1Arr) {
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        number1Cards.push(card);
    }

    const number2Arr = `${number2}`.split("");
    const number2Cards = [];
    for (const n of number2Arr) {
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        number2Cards.push(card);
    }

    const resultArr = `${result}`.split("");
    const resultCards = [];
    for (const n of resultArr) {
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        resultCards.push(card);
    }

    numDumies = numDumies!=null ? numDumies : Math.max(4, level - 20);
    let extraNumbers = 0;
    while (numDumies-- > 0) {
        const n = Math.floor(Math.random() * 10);
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        extraNumbers++;
    }

    const levelSheet = {
        cards: cards.sort(()=>Math.random()<.5?1:-1),
        stock: {
            width: Math.max(5, number1Cards.length + number2Cards.length + extraNumbers),
        },
        works: [
            {
                slots: [
                    ...number1Cards.map(c => ({ pickable: true, pile: [] })),
                    { pickable: false, pile: [cardOp.id] },
                    ...number2Cards.map(c => ({ pickable: true, pile: [] })),
                    { pickable: false, pile: [cardEqu.id] },
                    ...resultCards.map(c => ({ pickable: false, pile: [c.id] })),
                ],
            },
        ],
    };

    return levelSheet;
}

function getWorkSheetSub1(level, numDumies=null) {
    const cards = [];
    const cardEqu = { cardType: "equation", value: "=", id: `c${cards.length}` };
    cards.push(cardEqu);

    const cardOp = { cardType: "operator", value: "-", id: `c${cards.length}` };
    cards.push(cardOp);

    const number2 = 2 + Math.floor(Math.random() * 8);
    const number1 = 1 + Math.floor(Math.random() * (number2 - 1));
    const result = number2 - number1;

    const number1Arr = `${number1}`.split("");
    const number1Cards = [];
    for (const n of number1Arr) {
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        number1Cards.push(card);
    }

    const number2Arr = `${number2}`.split("");
    const number2Cards = [];
    for (const n of number2Arr) {
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        number2Cards.push(card);
    }

    const resultArr = `${result}`.split("");
    const resultCards = [];
    for (const n of resultArr) {
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        resultCards.push(card);
    }

    numDumies = numDumies!=null ? numDumies : Math.min(3, (level - 1) % 5);
    let extraNumbers = 0;
    while (numDumies-- > 0) {
        const n = Math.floor(Math.random() * 10);
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        extraNumbers++;
    }

    const levelSheet = {
        cards: cards.sort(()=>Math.random()<.5?1:-1),
        stock: {
            width: Math.max(5, number1Cards.length + number2Cards.length + extraNumbers),
        },
        works: [
            {
                slots: [
                    ...number1Cards.map(c => ({ pickable: true, pile: [] })),
                    { pickable: false, pile: [cardOp.id] },
                    ...number2Cards.map(c => ({ pickable: true, pile: [] })),
                    { pickable: false, pile: [cardEqu.id] },
                    ...resultCards.map(c => ({ pickable: false, pile: [c.id] })),
                ],
            },
        ],
    };

    return levelSheet;
}

function getWorkSheetSub3(level, numDumies=null) {
    const cards = [];
    const cardEqu = { cardType: "equation", value: "=", id: `c${cards.length}` };
    cards.push(cardEqu);

    const cardOp = { cardType: "operator", value: "-", id: `c${cards.length}` };
    cards.push(cardOp);

    const number2 = 20 + Math.floor(Math.random() * 80);
    const number1 = 10 + Math.floor(Math.random() * (number2 - 15));
    const result = number2 - number1;

    const number1Arr = `${number1}`.split("");
    const number1Cards = [];
    for (const n of number1Arr) {
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        number1Cards.push(card);
    }

    const number2Arr = `${number2}`.split("");
    const number2Cards = [];
    for (const n of number2Arr) {
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        number2Cards.push(card);
    }

    const resultArr = `${result}`.split("");
    const resultCards = [];
    for (const n of resultArr) {
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        resultCards.push(card);
    }

    numDumies = numDumies!=null ? numDumies : Math.max(4, level - 20);
    let extraNumbers = 0;
    while (numDumies-- > 0) {
        const n = Math.floor(Math.random() * 10);
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        extraNumbers++;
    }

    const levelSheet = {
        cards: cards.sort(()=>Math.random()<.5?1:-1),
        stock: {
            width: Math.max(5, number1Cards.length + number2Cards.length + extraNumbers),
        },
        works: [
            {
                slots: [
                    ...number1Cards.map(c => ({ pickable: true, pile: [] })),
                    { pickable: false, pile: [cardOp.id] },
                    ...number2Cards.map(c => ({ pickable: true, pile: [] })),
                    { pickable: false, pile: [cardEqu.id] },
                    ...resultCards.map(c => ({ pickable: false, pile: [c.id] })),
                ],
            },
        ],
    };

    return levelSheet;
}

function getWorkSheetMul1(level, numDumies=null) {
    const cards = [];
    const cardEqu = { cardType: "equation", value: "=", id: `c${cards.length}` };
    cards.push(cardEqu);

    const cardOp = { cardType: "operator", value: "x", id: `c${cards.length}` };
    cards.push(cardOp);

    const number1 = 1 + Math.floor(Math.random() * 9);
    const number2 = 1 + Math.floor(Math.random() * 9);
    const result  = number1 * number2;

    const number1Arr = `${number1}`.split("");
    const number1Cards = [];
    for (const n of number1Arr) {
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        number1Cards.push(card);
    }

    const number2Arr = `${number2}`.split("");
    const number2Cards = [];
    for (const n of number2Arr) {
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        number2Cards.push(card);
    }

    const resultArr = `${result}`.split("");
    const resultCards = [];
    for (const n of resultArr) {
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        resultCards.push(card);
    }

    numDumies = numDumies != null ? numDumies : 2;
    let extraNumbers = 0;
    while (numDumies-- > 0) {
        const n = Math.floor(Math.random() * 10);
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        extraNumbers++;
    }

    const levelSheet = {
        cards: cards.sort(()=>Math.random()<.5?1:-1),
        stock: {
            width: Math.max(5, number1Cards.length + number2Cards.length + extraNumbers),
        },
        works: [
            {
                slots: [
                    ...number1Cards.map(c => ({ pickable: true, pile: [] })),
                    { pickable: false, pile: [cardOp.id] },
                    ...number2Cards.map(c => ({ pickable: true, pile: [] })),
                    { pickable: false, pile: [cardEqu.id] },
                    ...resultCards.map(c => ({ pickable: false, pile: [c.id] })),
                ],
            },
        ],
    };

    return levelSheet;
}

function getWorkSheetMul2(level, numDumies=null) {
    const cards = [];
    const cardEqu = { cardType: "equation", value: "=", id: `c${cards.length}` };
    cards.push(cardEqu);

    const cardOp = { cardType: "operator", value: "x", id: `c${cards.length}` };
    cards.push(cardOp);

    const number1 = 10 + Math.floor(Math.random() * 19);
    const number2 = 1 + Math.floor(Math.random() * 9);
    const result  = number1 * number2;

    const number1Arr = `${number1}`.split("");
    const number1Cards = [];
    for (const n of number1Arr) {
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        number1Cards.push(card);
    }

    const number2Arr = `${number2}`.split("");
    const number2Cards = [];
    for (const n of number2Arr) {
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        number2Cards.push(card);
    }

    const resultArr = `${result}`.split("");
    const resultCards = [];
    for (const n of resultArr) {
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        resultCards.push(card);
    }

    numDumies = numDumies != null ? numDumies : 2;
    let extraNumbers = 0;
    while (numDumies-- > 0) {
        const n = Math.floor(Math.random() * 10);
        const card = { cardType: "number", value: `${n}`, id: `c${cards.length}` }
        cards.push(card);
        extraNumbers++;
    }

    const levelSheet = {
        cards: cards.sort(()=>Math.random()<.5?1:-1),
        stock: {
            width: Math.max(5, number1Cards.length + number2Cards.length + extraNumbers + 1),
        },
        works: [
            {
                slots: [
                    ...number1Cards.map(c => ({ pickable: true, pile: [] })),
                    { pickable: true, pile: [] }, // cardOp.id
                    ...number2Cards.map(c => ({ pickable: true, pile: [] })),
                    { pickable: false, pile: [cardEqu.id] },
                    ...resultCards.map(c => ({ pickable: false, pile: [c.id] })),
                ],
            },
        ],
    };

    return levelSheet;
}

function combineWorkSheet(sheet1, sheet2) {
    const cards = [];
    let stockWidth = 5;
    const works = [];

    const workLength = Math.max(
        ...sheet1.works.map(w => w.slots.length),
        ...sheet2.works.map(w => w.slots.length),
    );

    // Sheet 1
    const objCards1 = Object.fromEntries(sheet1.cards.map(c => [c.id, c]));
    stockWidth = Math.max(stockWidth, sheet1.stock.width);
    for (const card of sheet1.cards) {
        card.id = `c${cards.length}`;
        cards.push(card);
    }
    for (const work of sheet1.works) {
        const slots = work.slots.map(s => ({ ...s, pile: s.pile.map(i => objCards1[i].id) }) );
        // while (slots.length < workLength) {
        //     slots
        // }
        works.push({
            slots: slots,
        });
    }

    // Sheet 2
    const objCards2 = Object.fromEntries(sheet2.cards.map(c => [c.id, c]));
    stockWidth += sheet2.stock.width;
    for (const card of sheet2.cards) {
        card.id = `c${cards.length}`;
        cards.push(card);
    }
    for (const work of sheet2.works) {
        works.push({
            slots: work.slots.map(s => ({ ...s, pile: s.pile.map(i => objCards2[i].id) }) ),
        });
    }

    stockWidth = Math.min(12, stockWidth);
    const levelSheet = {
        cards: cards.sort(() => Math.random() < .5? 1 : -1),
        stock: {
            width: stockWidth,
        },
        works: works,
    };

    return levelSheet;

}

function getWorkSheet(level) {
    if (level <= 5) {
        return getWorkSheet1(level);
    }
    if (level <= 10) {
        return getWorkSheet2(level);
    }

    if (level <= 15) {
        return getWorkSheet3(level);
    }
    if (level <= 20) {
        return getWorkSheetSub1(level);
    }
    if (level <= 25) {
        return getWorkSheetSub3(level, 0);
    }

    if (level <= 30) {
        return getWorkSheetMul1(level);
    }
    if (level <= 35) {
        return getWorkSheetMul2(level);
    }

    if (level <= 40) {
        return combineWorkSheet(getWorkSheetMul2(level, 1), getWorkSheet1(level, 0));
    }
    if (level <= 45) {
        return combineWorkSheet(getWorkSheetMul2(level, 1), getWorkSheet2(level, 0));
    }
    if (level <= 50) {
        return combineWorkSheet(getWorkSheetMul2(level, 1), getWorkSheet3(level, 0));
    }
    
    if (level <= 55) {
        return combineWorkSheet(getWorkSheetMul2(level, 1), getWorkSheetSub1(level, 0));
    }
    if (level <= 60) {
        return combineWorkSheet(getWorkSheetMul2(level, 1), getWorkSheetSub3(level, 0));
    }

    let worksheet = combineWorkSheet(getWorkSheetMul2(level, 1), getWorkSheetMul2(level, 1));
    if (level % 2) {
        worksheet = combineWorkSheet(worksheet, getWorkSheetMul1(level, 0));
    } else {
        worksheet = combineWorkSheet(worksheet, getWorkSheetSub3(level, 0));
    }
    // console.log(worksheet);
    return worksheet;

}
