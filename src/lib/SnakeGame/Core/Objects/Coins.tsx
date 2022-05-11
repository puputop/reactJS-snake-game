import {Snake} from "./Snake";
import {ReactElement} from "react";
import {BOARD, COINS} from "../../config";
import Point from "./Point";

export type Coin = {
    point: Point,
    bornTime: number,   // milliseconds from start of game
    lifetime: number,   // milliseconds
    isAlive: (gameTime: number) => boolean
};

export type CoinsFarm = {
    start: () => void,
    stop: () => void,
    clear: () => void,
    draw: () => ReactElement,
    hasCoinThere: (p : Point) => boolean,
    setMinTimeRespawn: (milliseconds : number) => void,
    setMaxTimeRespawn: (milliseconds : number) => void,
    setMinLifetime: (milliseconds : number) => void,
    setMaxLifetime: (milliseconds : number) => void,
}

export function createCoin(boardCols: number, boardRows: number, gameDuration: number, snake: Snake, coins: Array<Coin>) : Coin {
    function isVacantPoint(p : Point) : boolean {
        const disposition = snake.getDisposition();
        for(let i = 0;i < disposition.length; i++) {
            const sp = disposition[i];
            if(p.x === sp.x && p.y === sp.y) return false;
        }
        for(let i = 0;i < coins.length; i++) {
            const sp = coins[i].point;
            if(p.x === sp.x && p.y === sp.y) return false;
        }
        return true;
    }
    let x: number,
        y: number,
        point: Point = {x:0,y:0},
        isFound: boolean = false;
    for(let time = 0; time < 20; time++) {
        x = Math.round(Math.random() * (boardCols-1));
        y = Math.round(Math.random() * (boardRows-1));
        point = {x,y};
        if(isVacantPoint(point)) {
            isFound = true;
            break;
        }
    }
    // search first empty place
    if(!isFound) {
        for (x = 0; x < boardCols; x++) {
            for (y = 0; y < boardRows; y++) {
                point = {x, y};
                if(isVacantPoint(point)) {
                    isFound = true;
                    break;
                }
            }
        }
    }
    if(isFound) {
        // create Coin
        return {
            point,
            bornTime: gameDuration,
            lifetime: COINS.LIFE_TIME_MIN + Math.random() * (COINS.LIFE_TIME_MAX - COINS.LIFE_TIME_MIN),
            isAlive: function(gameTime: number) : boolean {
                return (gameTime - this.bornTime) > this.lifetime
            }
        }
    } else {
        throw new Error('board is absolutely fill');
    }
}

export function DrawCoins (params: {coins: Array<Coin>, gameDuration: number}) : ReactElement {
    const coins = params.coins;
    let sprites: ReactElement[] = [];
    for(let i = 0; i < coins.length; i++) {
        const coin = coins[i];
        const style = {
            top: coin.point.y * BOARD.CELL_LENGTH + 2,
            left: coin.point.x * BOARD.CELL_LENGTH + 2,
        }
        const lifetime = Math.max(0, Math.round((coin.bornTime + coin.lifetime - params.gameDuration) / 1000));
        const text = lifetime <= 5 ? lifetime.toString() : '';
        sprites.push(<span key={coin.point.x + '-' + coin.point.y} className='coin' style={style}>{text}</span>)
    }
    return <span>{sprites.concat()}</span>;
}
