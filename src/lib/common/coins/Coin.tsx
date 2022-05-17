import "../../../styles/coin.css";
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
        top: y * BOARD.CELL_LENGTH + 2,
        left: x * BOARD.CELL_LENGTH + 2,
    }
    const lifetime = Math.max(0, Math.round((coin.bornTime + coin.lifetime - gameDuration) / 1000))
    const text = lifetime <= 5 ? lifetime.toString() : ''
    return <span key={x + '-' + y} className='coin' style={style}>{text}</span>
}

export function RenderCoins(params: { coins: Coin[], gameDuration: number }): ReactElement {
    const {coins, gameDuration} = params
    return <>{coins.map((coin) => RenderCoin({coin, gameDuration}))}</>
}
