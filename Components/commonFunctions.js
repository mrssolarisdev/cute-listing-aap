const COLOURS = [
    '#ffcfe1',
    '#ffdbe9',
    '#ffd5e0',
    '#d5edff',
    '#ffd5eb',
    '#ffd5f9',
    '#f2d5ff',
    '#e2d5ff',
    '#d5ddff',
    '#d5f4ff',
    '#d5ffef',
    '#d5ffdf',
    '#ddffd5',
    '#eeffd5',
    '#fff9d5',
    '#ffeed5',
    '#ffe2d5',
    '#ffd5d5',
    '#d5fff6',
    '#e0ecff',
    '#fff2e3',
    '#efffcf',
    '#cffff6',
    '#eedbff'
]
export const chooseColour = (allowWhite=false) => {
    let retColours = [...COLOURS]
    if(allowWhite)
        retColours[0] = ('#ffffff')
    return retColours[Math.floor(Math.random() * retColours.length)]
}

export const returnColours = (allowWhite=false) => {
    let retColours = [...COLOURS]
    if(allowWhite)
        retColours[0] = ('#ffffff')
    return retColours
}