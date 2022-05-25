import styles from "./coin.module.sass";
import Point from "../Point";
import {ReactElement} from "react";
import {BOARD} from "../../config";

type Coin = {
    point: Point,
    bornTime: number,   // milliseconds from start of game
    lifetime: number,   // milliseconds
}

export default Coin

function RenderCoin(params: {coin : Coin, gameDuration: number}): ReactElement {
    const {coin, gameDuration} = params
    const {x,y} = coin.point
    const style = {
        top: y * BOARD.CELL_LENGTH + (BOARD.CELL_LENGTH - 1) * 0.15,
        left: x * BOARD.CELL_LENGTH + (BOARD.CELL_LENGTH - 1) * 0.15,
    }
    const lifetime = Math.max(0, Math.round((coin.bornTime + coin.lifetime - gameDuration) / 1000))
    const text = lifetime <= 5 ? lifetime.toString() : ''
    return <span key={x + '-' + y} className={styles.coin} style={style}>{text}</span>
}

export function RenderCoins(params: { coins: Coin[], gameDuration: number }): ReactElement {
    const {coins, gameDuration} = params
    return <>{coins.map((coin) => RenderCoin({coin, gameDuration}))}</>
}
