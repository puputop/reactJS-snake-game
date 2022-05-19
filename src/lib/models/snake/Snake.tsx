import '../../../styles/snake.css';
import CoinsFarm from "../coins/CoinsFarm";
import Point, {Direction} from "../Point";
import {ReactElement} from "react";
import {BOARD} from "../../config";


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
        if (i === 0) {
            // tail of the snake
            const nextPoint = snakeDisposition[i + 1];

            sprites.push(<span className={'body tail ' + classOfTheDirection(point, [nextPoint])}
                               style={style} key='tail'></span>)
        } else if (i === snakeDisposition.length - 1) {
            // head of the snake
            const prevPoint = snakeDisposition[i - 1];

            sprites.push(<span className={'body head ' + classOfTheDirection(point, [prevPoint])}
                               style={style} key='head'></span>)
        } else {
            // middle part of the snake
            const nextPoint = snakeDisposition[i + 1];
            const prevPoint = snakeDisposition[i - 1];

            sprites.push(<span className={'body ' + classOfTheDirection(point, [nextPoint, prevPoint])}
                               style={style} key={i}></span>)
        }
    }
    return <div className='snake'>{sprites.concat()}</div>;

    function classOfTheDirection(point: Point, neighborsPoints: Point[]): string {
        const {x, y} = point;
        let className: string[] = [];
        neighborsPoints.forEach(function (p) {
            if (x === p.x) {
                if (p.y === y - 1) className.push('top');
                else if (p.y === y + 1) className.push('bottom');
            } else if (y === p.y) {
                if (p.x === x - 1) className.push('left');
                else if (p.x === x + 1) className.push('right');
            }
        })
        return className.join(' ');
    }
}
