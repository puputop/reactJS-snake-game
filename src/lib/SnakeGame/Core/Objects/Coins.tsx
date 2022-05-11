import {Snake} from "./Snake";
import {ReactElement} from "react";
import {BOARD, COINS} from "../../config";
import Point from "./Point";
import game from "../../Game";
import point from "./Point";

export type Coin = {
    point: Point,
    bornTime: number,   // milliseconds from start of game
    lifetime: number,   // milliseconds
    isAlive: (gameTime: number) => boolean
};

export type CoinsFarm = {
    Draw: (params : {gameDuration: number}) => ReactElement,
    start: () => CoinsFarm,
    stop: () => CoinsFarm,
    empty: () => CoinsFarm,
    hasCoinThere: (point: Point) => boolean,
    clearPoint: (point : Point) => void,
    setRespawnIntervalMin: (milliseconds: number) => void,
    setRespawnIntervalMax: (milliseconds: number) => void,
    setLifetimeMin: (milliseconds: number) => void,
    setLifetimeMax: (milliseconds: number) => void,
}

/**
 * @param params
 * function updateCallback - will be call if coins collection was change
 */
export function createCoinsFarm(params: { boardCols: number, boardRows: number, snake: Snake, getGameDuration: Function, updateCallback: Function }): CoinsFarm {
    const {boardCols, boardRows, snake, getGameDuration, updateCallback} = params;
    let respawnIntervalMin: number = COINS.RESPAWN_INTERVAL_MIN;
    let respawnIntervalMax: number = COINS.RESPAWN_INTERVAL_MAX;
    let lifetimeMin: number = COINS.LIFETIME_MIN;
    let lifetimeMax: number = COINS.LIFETIME_MAX;
    let coins: Coin[] = [];
    let isWork = false;
    let workTimer: NodeJS.Timer | null = null;
    let lifetimeTimers: NodeJS.Timer[] = [];

    function getBurnDelay(): number {
        const k = 1; // TODO // const k = this.getSpeed() / SNAKE.SPEED.INITIAL;
        return Math.round((respawnIntervalMin + Math.random() * (respawnIntervalMax - respawnIntervalMin)) * k);
    }

    const addLifetimeTimer = (coin: Coin): void => {
        lifetimeTimers.push(
            setTimeout(
                () => {
                    const gameDuration = getGameDuration();
                    let isUpdate = false;
                    for(let i = coins.length - 1;i >= 0; i--) {
                        if(coins[i].isAlive(gameDuration)) {
                            coins.splice(i, 1);
                            isUpdate = true;
                        }
                    }
                    if(isUpdate) {
                        updateCallback();
                    }
                },
                Math.max(1, coin.bornTime + coin.lifetime - getGameDuration())
            )
        );
    };

    const work = () => {
        if (isWork) {
            const newCoin = createCoin(boardCols, boardRows, getGameDuration(), snake, coins);
            addLifetimeTimer(newCoin);
            coins.push(newCoin);
            if (workTimer) clearTimeout(workTimer);
            workTimer = setTimeout(work, getBurnDelay());
        }
    }

    const start = () => {
        if (!isWork) {
            isWork = true;
            workTimer = setTimeout(work, getBurnDelay());
            coins.forEach((coin) => {addLifetimeTimer(coin)});
        }
    }

    const stop = () => {
        if (isWork) {
            isWork = false;
            if (workTimer) clearTimeout(workTimer);
            lifetimeTimers.forEach((timer) => clearTimeout(timer));
            lifetimeTimers = [];
        }
    }
    const empty = () => {
        lifetimeTimers.forEach((timer) => clearTimeout(timer));
        coins = [];
        updateCallback()
    }


    return {
        start: function () {
            start();
            return this
        },
        stop: function () {
            stop();
            return this
        },
        empty: function () {
            empty();
            return this
        },
        clearPoint: (point) => {
            const {x, y} = point;
            coins.forEach((coin, i) => {
                if(coin.point.x === x && coin.point.y === y) {
                    coins.splice(i, 1);
                }
            });
        },
        Draw: () => <DrawCoins coins={coins} gameDuration={getGameDuration()}/>,
        hasCoinThere: (point: Point) => {
            for(let coin of coins) {
                if(coin.point.x === point.x && coin.point.y === point.y) return true;
            }
            return false;
        },
        setRespawnIntervalMin: (milliseconds: number) => {
            respawnIntervalMin = milliseconds
        },
        setRespawnIntervalMax: (milliseconds: number) => {
            respawnIntervalMax = milliseconds
        },
        setLifetimeMin: (milliseconds: number) => {
            lifetimeMin = milliseconds
        },
        setLifetimeMax: (milliseconds: number) => {
            lifetimeMax = milliseconds
        },
    }
}

export function createCoin(boardCols: number, boardRows: number, gameDuration: number, snake: Snake, coins: Array<Coin>): Coin {
    function isVacantPoint(p: Point): boolean {
        const disposition = snake.getDisposition();
        for (let i = 0; i < disposition.length; i++) {
            const sp = disposition[i];
            if (p.x === sp.x && p.y === sp.y) return false;
        }
        for (let i = 0; i < coins.length; i++) {
            const sp = coins[i].point;
            if (p.x === sp.x && p.y === sp.y) return false;
        }
        return true;
    }

    let x: number,
        y: number,
        point: Point = {x: 0, y: 0},
        isFound: boolean = false;
    for (let time = 0; time < 20; time++) {
        x = Math.round(Math.random() * (boardCols - 1));
        y = Math.round(Math.random() * (boardRows - 1));
        point = {x, y};
        if (isVacantPoint(point)) {
            isFound = true;
            break;
        }
    }
    // search first empty place
    if (!isFound) {
        for (x = 0; x < boardCols; x++) {
            for (y = 0; y < boardRows; y++) {
                point = {x, y};
                if (isVacantPoint(point)) {
                    isFound = true;
                    break;
                }
            }
        }
    }
    if (isFound) {
        // create Coin
        return {
            point,
            bornTime: gameDuration,
            lifetime: COINS.LIFETIME_MIN + Math.random() * (COINS.LIFETIME_MAX - COINS.LIFETIME_MIN),
            isAlive: function (gameTime: number): boolean {
                return (gameTime - this.bornTime) > this.lifetime
            }
        }
    } else {
        throw new Error('board is absolutely fill');
    }
}

export function DrawCoins(params: { coins: Array<Coin>, gameDuration: number }): ReactElement {
    const coins = params.coins;
    let sprites: ReactElement[] = [];
    for (let i = 0; i < coins.length; i++) {
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
