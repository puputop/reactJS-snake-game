import {ReactElement} from "react";
import {BOARD, SNAKE} from "../../config";
import Point, {Direction, isInlinePoints, isNeighboringPoints, nextPoint} from "./Point";
import {CoinsFarm} from "./Coins";
import {BoardSize} from "../Interface/Board";

export type Snake = {
    setCoinsFarm: (coinsFarm: CoinsFarm) => Snake,
    toInitial: () => Snake,
    start: () => Snake,
    stop: () => Snake,
    growth: () => Snake, // length++
    setDirection: (direction: Direction) => Snake,
    setSpeed: (speed : number) => Snake,
    Draw: () => ReactElement,
    getDisposition: () => Array<Point>,
    getLength: () => number
}

export function createSnake(board: BoardSize, onChangeCallback : (isAlive : boolean) => void) : Snake {
    let currentSpeed: number
    let currentDirection: Direction
    let length: number
    let disposition: Array<Point>
    let currentCoinsFarm: CoinsFarm

    let workTimer: NodeJS.Timer | null = null

    toInitial()

    function toInitial() : void {
        currentSpeed = SNAKE.SPEED.INITIAL
        currentDirection = SNAKE.INITIAL.DIRECTION
        length = SNAKE.INITIAL.LENGTH
        let point = SNAKE.INITIAL.POSITION;
        disposition = [];
        disposition.push(point)
        for(let i = 1; i < length; i++) {
            disposition.push(point = nextPoint(point, currentDirection, board))
        }
    }

    const isAlive = () : boolean => {
        const p = disposition[disposition.length - 1]
        for(let i = 0; i < disposition.length - 1; i++) {
            if(disposition[i].x === p.x && disposition[i].y === p.y) return false;
        }
        return true;
    }

    const isPossibleDirection = (direction : Direction) : boolean => {
        if(length < 2) return true;
        const snakesHead: Point = disposition[disposition.length - 1];
        const beforePoint = disposition[disposition.length - 2];
        const point: Point = nextPoint(snakesHead, direction, board)
        return point.x !== beforePoint.x || point.y !== beforePoint.y;
    }

    const work = () => {
        if(isAlive()) {
            const snakesHead: Point = disposition[disposition.length - 1];
            const newPoint: Point = nextPoint(snakesHead, currentDirection, board)
            disposition.push(newPoint);
            if(disposition.length > length) {
                disposition.splice(0, disposition.length - length)
            }
            if(currentCoinsFarm && currentCoinsFarm.hasCoinThere(newPoint)) {
                length++;
                currentCoinsFarm.clearPoint(newPoint)
            }
            if(workTimer) clearTimeout(workTimer)
            workTimer = setTimeout(work, currentSpeed)
            onChangeCallback(isAlive())
        }
    }

    return {
        setCoinsFarm: function (coinsFarm: CoinsFarm) {
            currentCoinsFarm = coinsFarm
            return this
        },
        toInitial: function() {
            toInitial()
            return this
        },
        start: function () {
            if(workTimer) clearTimeout(workTimer)
            work()
            return this
        },
        stop: function () {
            if(workTimer) {
                clearTimeout(workTimer)
                workTimer = null
            }
            return this
        },
        growth: function () {
            length++
            return this
        },
        getDisposition: () => disposition,
        getLength: () => length,
        setDirection: function (direction: Direction) {
            if(direction !== currentDirection && isPossibleDirection(direction)) {
                currentDirection = direction
                if (workTimer) {
                    clearTimeout(workTimer)
                    work()
                }
            }
            return this
        },
        setSpeed: function (speed: number) {
            currentSpeed = speed
            return this
        },
        Draw: () => DrawSnake({snakeDisposition : disposition})
    }
}

function DrawSnake(params : {snakeDisposition: Array<Point>}) : ReactElement {
    const {snakeDisposition} = params;
    const l = BOARD.CELL_LENGTH; // width|height of 1 field
    let lineBegin: Point|null = null;
    let lineEnd: Point|null = null;
    let sprites: ReactElement[] = [];
    function pushSprint() {
        if(lineBegin !== null && lineEnd !== null) {
            const {x : x1, y : y1} = lineBegin;
            const {x : x2, y : y2} = lineEnd;
            const style = {
                top: Math.min(y1, y2) * l + 2,
                left: Math.min(x1, x2) * l + 2,
                width: (Math.abs(x2 - x1) + 1) * l - 4,
                height: (Math.abs(y2 - y1) + 1) * l - 4,
            }
            sprites.push(<span key={x1+'-'+x2+'-'+y1+'-'+y2} className='snake-body-section' style={style} />)
            // clear
            lineBegin = lineEnd;
            lineEnd = null;
        }
    }
    function pushEye() {
        const point : Point = snakeDisposition[snakeDisposition.length - 1];
        if(point) {
            const style = {
                top: point.y * l + 2,
                left: point.x * l + 2,
            };
            sprites.push(<span key={-1} className='snake-head' style={style}/>)
        }
    }
    let prevPoint;
    for(let i = snakeDisposition.length - 1; i >= 0 ; i--) {
        const point = snakeDisposition[i];
        if(!lineBegin) {
            lineBegin = point;
        } else if(prevPoint && !isNeighboringPoints(prevPoint, point)){
            if(!lineEnd) {
                lineEnd = lineBegin;
            }
            pushSprint();
            lineBegin = point;
        } if(!lineEnd) {
            lineEnd = point;
        } else if(isInlinePoints([lineEnd, lineBegin, point])) {
            lineEnd = point;
        } else {
            pushSprint();
            lineEnd = point;
        }
        prevPoint = point;
    }
    // draw last part of body
    if(snakeDisposition.length === 1) {
        lineEnd = lineBegin;
    }
    if(lineEnd !== null) {
        pushSprint()
    }
    pushEye();
    return <div className='snake'>{sprites.concat()}</div>;
}
