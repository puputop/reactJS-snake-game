import {ReactElement} from "react";
import {BOARD, SNAKE} from "../../config";
import Point, {Direction, isInlinePoints, isNeighboringPoints, nextPoint} from "./Point";
import {CoinsFarm} from "./Coins";

export type Snake2 = {
    toInitial: () => Snake2,
    start: () => Snake2,
    stop: () => Snake2,
    growth: () => Snake2, // length++
    setDirection: (direction: Direction) => Snake2,
    setSpeed: (speed : number) => Snake2,
    Draw: () => ReactElement,
}

export function createSnake2(board: {cols: number, rows: number}, onChangeCallback : (isAlive : boolean) => void, coinFarm : CoinsFarm) : Snake2 {
    // const {boardCols : cols, boardRows : rows} = params
    let currentSpeed: number
    let currentDirection: Direction
    let length: number
    let disposition: Array<Point>

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

    function isAlive() : boolean {
        return true;
    }

    function isPossibleDirection(direction : Direction) : boolean {
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
            if(coinFarm.hasCoinThere(newPoint)) {
                length++;
                coinFarm.clearPoint(newPoint)
            }
            if(workTimer) clearTimeout(workTimer)
            workTimer = setTimeout(work, currentSpeed)
            onChangeCallback(isAlive())
        }
    }

    return {
        toInitial: function() {
            toInitial()
            return this;
        },
        start: function () {
            if(workTimer) clearTimeout(workTimer)
            workTimer = setTimeout(work, currentSpeed)
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
        setDirection: function (direction: Direction) {
            if(isPossibleDirection(direction)) {
                currentDirection = direction
                if(workTimer) {
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
        Draw: function () {
            return DrawSnake({snakeDisposition : disposition})
        }
    }
}

export type Snake = {

    getLength: () => number,
    getDisposition: () => Array<Point>,
    moveSnake: (direction: Direction) => boolean
    isPossibleDirection: (direction: Direction) => boolean
    getBeginPoint: () => Point,
    growth: () => void, // length++
    reborn: () => void,  // snake params to default (for new game)
    Draw: () => ReactElement
};

export function createSnake(board : {cols: number, rows: number}) : Snake {
    let disposition : Array<Point> = [];
    let length : number = 0;
    reborn();

    function reborn() : void {
        disposition = [];
        length = SNAKE.INITIAL.LENGTH;
        const y = SNAKE.INITIAL.POSITION.y;
        for(let x = SNAKE.INITIAL.POSITION.x; x < length; x++) {
            disposition.push({x, y});
        }
    }

    function nextPointLocal(direction: Direction) : Point {
        const snakesHead: Point = disposition[disposition.length - 1];
        return nextPoint(snakesHead, direction, board)
    }

    function moveSnake(direction: Direction) : boolean {
        const p = nextPointLocal(direction);
        if(!isSelfBody(p)) {
            disposition.push(p);
            while(disposition.length > length) {
                disposition.shift();
            }
            return true;
        } else {
            return false;
        }
    }

    function isSelfBody(p: Point) : boolean {
        for(let i = 0; i < disposition.length; i++) {
            if(disposition[i].x === p.x && disposition[i].y === p.y) return true;
        }
        return false;
    }

    function isPossibleDirection(direction : Direction) : boolean {
        if(length < 2) return true;
        const point = nextPointLocal(direction);
        const beforePoint = disposition[disposition.length - 2];
        return point.x !== beforePoint.x || point.y !== beforePoint.y;
    }

    return {
        getLength: () => length,
        getDisposition: () => disposition,
        moveSnake: (direction) => moveSnake(direction),
        isPossibleDirection: (direction) => isPossibleDirection(direction),
        getBeginPoint: () => disposition[disposition.length - 1],
        growth: () => {length++},
        reborn: () => reborn(),
        Draw: () => DrawSnake({snakeDisposition : disposition}),
    };
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
