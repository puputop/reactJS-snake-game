// BOARD setting
export const BOARD = {
    CELL_LENGTH: 20 as number,  // width & height cell of board (if you want to change - need correct CSS (game.css))
    ROWS: 20 as number, // cells per row
    COLS: 40 as number // cells per column
}
// GAME setting
export const SNAKE = {
    INITIAL: {
        LENGTH: 5 as number,
        POSITION: {
            x: 0 as number,
            y: 0 as number
        }
    },
    SPEED: {
        INITIAL:            300 as number,  // milliseconds
        MINIMAL:            35  as number,  // milliseconds
        GROWTH_STEP:        5   as number,  // percents from initial
        GROWTH_INTERVAL:    1   as number,  // seconds
    }
}
export const COINS = {
    // respawn interval actual for begin game and will be less, when snake speed will be growth
    RESPAWN_INTERVAL_MIN:   300     as number,  // milliseconds
    RESPAWN_INTERVAL_MAX:   4000    as number,  // milliseconds
    LIFE_TIME_MIN:          5000    as number,  // milliseconds
    LIFE_TIME_MAX:          10000   as number,  // milliseconds
}

// Scoring formula
export function pointsPerStep(snakeLength : number, snakeSpeed : number) : number {
    const speedK = SNAKE.SPEED.INITIAL / snakeSpeed;
    return snakeLength / SNAKE.INITIAL.LENGTH * speedK;
}
