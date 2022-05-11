
export default Point;

type Point = {
    x: number,
    y: number
};

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
