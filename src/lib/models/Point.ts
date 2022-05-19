import Board from "./Board";

type Point = {
    x: number,
    y: number
};

export default Point;

export enum Direction {left, right, up, down}

/**
 * similar Array.indexOf for Point[]
 * search Point in Points and return index or -1 if not found
 * @param point: Point
 * @param points: Point[]
 */
export function indexOfPoint(point: Point, points: Point[]): number {
    for (let i = 0; i < points.length; i++) {
        const {x, y} = points[i]
        if (point.x === x && point.y === y) return i
    }
    return -1
}


/**
 * return nextPoint for point with the defined direction for the defined board
 * if nextPoint beyond the board will be return point from other side of the board
 * @param point: Point
 * @param direction: Direction
 * @param board: BoardSize
 */
export function nextPoint(point: Point, direction: Direction, board: Board): Point {
    const {cols, rows} = board
    const nextPoint = {x : point.x, y: point.y}
    switch (direction) {
        case Direction.left:
            nextPoint.x--
            if (nextPoint.x < 0) nextPoint.x = cols - 1
            return nextPoint
        case Direction.right:
            nextPoint.x++
            if(nextPoint.x >= cols) nextPoint.x = 0
            return nextPoint
        case Direction.up:
            nextPoint.y--
            if(nextPoint.y < 0) nextPoint.y = rows - 1
            return nextPoint
        case Direction.down:
            nextPoint.y++
            if(nextPoint.y >= rows) nextPoint.y = 0
            return nextPoint
    }
}

export function randomPoint(board: Board) : Point {
    const {cols, rows} = board
    const x = Math.round(Math.random() * (cols - 1))
    const y = Math.round(Math.random() * (rows - 1))
    return {x, y}
}

export function isEqualPoints(point1: Point, point2: Point) : boolean {
    return point1.x === point2.x && point1.y === point2.y
}
