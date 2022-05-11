import {ReactElement} from "react";
import {BOARD, SNAKE} from "../../config";

export type Point = {
    x: number,
    y: number
};

export function isNeighboringPoints(a : Point, b : Point) : boolean {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
}


export type Snake = {
    getLength: () => number,
    getDisposition: () => Array<Point>,
    moveSnake: (direction: Direction) => boolean
    isPossibleDirection: (direction: Direction) => boolean
    getCurrentPoint: () => Point,
    growth: () => void, // length++
    reborn: () => void  // snake params to default (for new game)
};

export enum Direction {left, right, top, bottom}

export function createSnake(boardParams : {cols: number, rows: number}) : Snake {
    const {cols, rows} = boardParams;
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

    function nextPoint(direction: Direction) : Point {
        const snakesHead: Point = disposition[disposition.length - 1];
        let x = snakesHead.x;
        let y = snakesHead.y;
        switch(direction) {
            case Direction.left:
                x--;
                break;
            case Direction.right:
                x++;
                break;
            case Direction.bottom:
                y++;
                break;
            case Direction.top:
                y--;
                break;
        }
        let p = {x,y}
        if(isBoardArea(p)) {
            return p;
        } else {
            if(x >= cols)     p.x = 0;
            if(y >= rows)    p.y = 0;
            if(x < 0)               p.x = cols - 1;
            if(y < 0)               p.y = rows - 1;
            return p;
        }
    }

    function moveSnake(direction: Direction) : boolean {
        const p = nextPoint(direction);
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

    function isBoardArea(p: Point) : boolean {
        return p.x >= 0 && p.x < cols && p.y >= 0 && p.y < rows;
    }

    function isSelfBody(p: Point) : boolean {
        for(let i = 0; i < disposition.length; i++) {
            if(disposition[i].x === p.x && disposition[i].y === p.y) return true;
        }
        return false;
    }

    function isPossibleDirection(direction : Direction) : boolean {
        if(length < 2) return true;
        const point = nextPoint(direction);
        const beforePoint = disposition[disposition.length - 2];
        return point.x !== beforePoint.x || point.y !== beforePoint.y;
    }

    return {
        getLength: () => length,
        getDisposition: () => disposition,
        moveSnake: function(direction){
            return moveSnake(direction)
        },
        isPossibleDirection: (direction) => isPossibleDirection(direction),
        getCurrentPoint: () => disposition[disposition.length - 1],
        growth: () => {length++},
        reborn: () => reborn()
    };
}

export function DrawSnake(params : {snakeDisposition: Array<Point>}) : ReactElement {
    const {snakeDisposition} = params;
    const l = BOARD.CELL_LENGTH; // width|height of 1 field
    let lineBegin: Point|null = null;
    let lineEnd: Point|null = null;
    let sprites: ReactElement[] = [];
    function pushSprint() {
        if(lineBegin !== null && lineEnd !== null) {
            const x1 = lineBegin.x,
                y1 = lineBegin.y,
                x2 = lineEnd.x,
                y2 = lineEnd.y;
            const style = {
                top: Math.min(y1, y2) * l + 2,
                left: Math.min(x1, x2) * l + 2,
                width: (Math.abs(x2 - x1) + 1) * l - 4,
                height: (Math.abs(y2 - y1) + 1) * l - 4
            }
            sprites.push(<span key={x1+'-'+x2+'-'+y1+'-'+y2} className='snake-body-section' style={style} />)
            // clear
            lineBegin = lineEnd;
            lineEnd = null;
        }
    }
    function pushEye() {
        const p = snakeDisposition[snakeDisposition.length - 1];
        if(p) {
            const style = {
                top: p.y * l + 2,
                left: p.x * l + 2,
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
        } else if((lineEnd.y === point.y && lineBegin.y === point.y)
            || (lineEnd.x === point.x && lineBegin.x === point.x)
        ) {
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
