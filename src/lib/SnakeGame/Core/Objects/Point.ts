import exp from "constants";

export default Point;

type Point = {
    x: number,
    y: number
};

export enum Direction {left, right, top, bottom}


export function isNeighboringPoints(a : Point, b : Point) : boolean {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
}

export function isInlinePoints(points : Array<Point>) : boolean {
    if(points.length) {
        let xInLine = true,
            yInLine = true,
            xLine: number = -1,
            yLine: number = -1;
        for (let i = 0; i < points.length; i++) {
            const {x, y} = points[i];
            if(xInLine) {
                if (xLine === -1) xLine = x
                else if (xLine !== x) xInLine = false;
            }
            if(yInLine) {
                if (yLine === -1) yLine = y
                else if (yLine !== y) yInLine = false;
            }
        }
        return xInLine || yInLine;
    } else {
        return true;
    }
}


export function nextPoint(point: Point, direction: Direction, board: {cols:number, rows: number}) : Point {
    let {x,y} = point
    const {cols, rows} = board

    function isBoardArea(point: Point) : boolean {
        return point.x >= 0 && point.x < cols && point.y >= 0 && point.y < rows;
    }

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
    const p = {x,y}
    if(isBoardArea(p)) {
        return p;
    } else {
        if(x >= cols) p.x = 0;
        if(y >= rows) p.y = 0;
        if(x < 0) p.x = cols - 1;
        if(y < 0) p.y = rows - 1;
        return p;
    }
}
