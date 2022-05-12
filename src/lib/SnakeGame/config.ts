// BOARD setting
import Point, {Direction} from "./Core/Objects/Point";

export const BOARD = {
    CELL_LENGTH: 20 as number,  // width & height cell of board (if you want to change - need correct CSS (game.css))
    ROWS: 20 as number, // cells per row
    COLS: 20 as number // cells per column
}
// GAME setting
export const SNAKE = {
    INITIAL: {
        LENGTH: 5 as number,
        POSITION : {
            x: 0 as number,
            y: 0 as number
        } as Point,
        DIRECTION: Direction.right
    },
    SPEED: {
        INITIAL:            250 as number,  // milliseconds 250
        MINIMAL:            50  as number,  // milliseconds 50
        GROWTH_STEP:        2   as number,  // percents from initial per every GROWTH_INTERVAL of the game duration
        GROWTH_INTERVAL:    1   as number,  // seconds
    }
}
export const COINS = {
    // respawn interval actual for begin game and will be less, when snake speed will be growth
    RESPAWN_INTERVAL_MIN:   300     as number,  // milliseconds 300
    RESPAWN_INTERVAL_MAX:   4000    as number,  // milliseconds 4000
    LIFETIME_MIN:           5000    as number,  // milliseconds 5000
    LIFETIME_MAX:           10000   as number,  // milliseconds 10000
}

// Scoring formula
export function pointsPerStep(snakeLength : number, snakeSpeed : number) : number {
    const speedK = SNAKE.SPEED.INITIAL / snakeSpeed;
    return snakeLength / SNAKE.INITIAL.LENGTH * speedK;
}
