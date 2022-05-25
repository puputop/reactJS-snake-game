import styles from '@/lib/models/snake/snake.module.sass';
import CoinsFarm from "../coins/CoinsFarm";
import Point, {Direction} from "../Point";
import {ReactElement} from "react";
import {BOARD} from "@/lib/config";


type Snake = {
    setCoinsFarm: (coinsFarm: CoinsFarm) => Snake,
    toInitial: () => Snake,
    start: () => Snake,
    stop: () => Snake,
    growth: () => Snake, // length++
    setDirection: (direction: Direction) => Snake,
    setSpeed: (speed: number) => Snake,
    Render: () => ReactElement,
    getDisposition: () => Point[],
    getLength: () => number
}

export default Snake


export function RenderSnake(params: { snakeDisposition: Point[] }): ReactElement {
    const {snakeDisposition} = params;
    const cellLength = BOARD.CELL_LENGTH; // width|height of 1 field
    let sprites: ReactElement[] = [];
    for (let i = 0; i < snakeDisposition.length; i++) {

        const point = snakeDisposition[i]
        const style = {
            top: point.y * cellLength,
            left: point.x * cellLength,
        }
        const classNames: string[] = [styles.body]
        let key = point.x + '-' + point.y
        const neighborsPoints: Point[] = [];
        const nextPoint = snakeDisposition[i + 1];
        const prevPoint = snakeDisposition[i - 1];
        if (i === 0) {
            // tail of the snake
            neighborsPoints.push(nextPoint)
            classNames.push(styles.tail)
        } else if (i === snakeDisposition.length - 1) {
            // head of the snake
            key = 'head' // when die snake will cross body and duplicate xy-key call error
            neighborsPoints.push(prevPoint)
            classNames.push(styles.head)
        } else {
            // middle part of the snake
            neighborsPoints.push(nextPoint, prevPoint)
        }
        classNames.push(classOfTheDirection(point, neighborsPoints))
        sprites.push(<span className={classNames.join(' ')} style={style} key={key}></span>)
    }
    return <div className={styles.snake}>{sprites.concat()}</div>;

    function classOfTheDirection(point: Point, neighborsPoints: Point[]): string {
        const {x, y} = point;
        let className: string[] = [];
        neighborsPoints.forEach(function (p) {
            if (x === p.x) {
                if (p.y === y - 1) className.push(styles.top);
                else if (p.y === y + 1) className.push(styles.bottom);
            } else if (y === p.y) {
                if (p.x === x - 1) className.push(styles.left);
                else if (p.x === x + 1) className.push(styles.right);
            }
        })
        return className.join(' ');
    }
}
