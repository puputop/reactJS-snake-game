import {SNAKE} from "../../config";
import Point, {Direction, nextPoint} from "../Point";
import CoinsFarm from "../coins/CoinsFarm";
import Board from "../Board";
import Snake, {RenderSnake} from "./Snake";

export function createSnake(board: Board, onChangeCallback : (isAlive : boolean) => void) : Snake {
    let currentSpeed: number
    let currentDirection: Direction
    let length: number
    let disposition: Point[]
    let currentCoinsFarm: CoinsFarm

    let workTimer: NodeJS.Timer

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
    /**
     * testing that next point with direction differs from prevPoint
     * @param direction
     */
    const isPossibleDirection = (direction : Direction) : boolean => {
        if(length < 2) return true;
        const snakesHead: Point = disposition[disposition.length - 1];
        const beforePoint = disposition[disposition.length - 2];
        const point: Point = nextPoint(snakesHead, direction, board)
        return point.x !== beforePoint.x || point.y !== beforePoint.y;
    }

    /**
     * activate snake moves every currentSpeed ms
     * first move will be immediately after the call
     * in the end will be call onChangeCallback(isAlive)
     */
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
            workTimer = setTimeout(work, currentSpeed)
            return this
        },
        stop: function () {
            if(workTimer) clearTimeout(workTimer)
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
            currentSpeed = Math.max(speed, SNAKE.SPEED.MINIMAL)
            return this
        },
        Render: () => RenderSnake({snakeDisposition : disposition})
    }
}
