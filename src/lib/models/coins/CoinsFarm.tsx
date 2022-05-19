import {ReactElement} from "react";
import {COINS} from "../../config";
import Point, {indexOfPoint, isEqualPoints, randomPoint} from "../Point";
import Board from "../Board";
import Coin, {RenderCoins} from "./Coin";
import Snake from "../snake/Snake";

type CoinsFarm = {
    setSnake: (snake : Snake) => CoinsFarm,
    Render: (params : {gameDuration: number}) => ReactElement,
    start: () => CoinsFarm,
    stop: () => CoinsFarm,
    empty: () => CoinsFarm,
    hasCoinThere: (point: Point) => boolean,
    clearPoint: (point : Point) => CoinsFarm,
    setAccelerationCoefficient: (k : number) => CoinsFarm,
    setRespawnIntervalMin: (milliseconds: number) => CoinsFarm,
    setRespawnIntervalMax: (milliseconds: number) => CoinsFarm,
    setLifetimeMin: (milliseconds: number) => CoinsFarm,
    setLifetimeMax: (milliseconds: number) => CoinsFarm,
}

export default CoinsFarm

/**
 * function updateCallback - will be call if coins collection was change
 */
export function createCoinsFarm(board: Board, getGameDuration: Function, onChangeCallback: Function): CoinsFarm {
    let respawnIntervalMin: number = COINS.RESPAWN_INTERVAL_MIN
    let respawnIntervalMax: number = COINS.RESPAWN_INTERVAL_MAX
    let lifetimeMin: number = COINS.LIFETIME_MIN
    let lifetimeMax: number = COINS.LIFETIME_MAX
    let coins: Coin[] = []
    let isWork = false
    let workTimer: NodeJS.Timer | null = null
    let lifetimeTimers: NodeJS.Timer[] = []
    let currentSnake: Snake
    let k = 1 // accelerationCoefficient

    function getBornDelay(): number {
        return Math.round((respawnIntervalMin + Math.random() * (respawnIntervalMax - respawnIntervalMin)) * k)
    }

    const addLifetimeTimer = (coin: Coin): void => {
        lifetimeTimers.push(
            setTimeout(
                () => {
                    for(let i = coins.length - 1;i >= 0; i--) {
                        if(coins[i] === coin) {
                            coins.splice(i, 1)
                            onChangeCallback()
                            return
                        }
                    }
                },
                Math.max(1, coin.bornTime + coin.lifetime - getGameDuration())
            )
        )
    }

    const isVacantPoint = (point: Point): boolean => {
        for (let i = 0; i < coins.length; i++) {
            if (isEqualPoints(point, coins[i].point)) return false
        }
        return !currentSnake || indexOfPoint(point, currentSnake.getDisposition()) === -1
    }

    const createCoin = (): Coin => {
        let x: number,
            y: number,
            point: Point = {x: 0, y: 0},
            isFound: boolean = false
        // try to find random empty place
        for (let time = 0; time < 20; time++) {
            point = randomPoint(board)
            if (isVacantPoint(point)) {
                isFound = true
                break
            }
        }
        // search first empty place
        if (!isFound) {
            const {cols, rows} = board
            stop_loop:
            for (x = 0; x < cols; x++) {
                for (y = 0; y < rows; y++) {
                    point = {x, y}
                    if (isVacantPoint(point)) {
                        isFound = true
                        break stop_loop
                    }
                }
            }
        }
        if (isFound) {
            // create Coin
            return {
                point,
                bornTime: getGameDuration(),
                lifetime: lifetimeMin + Math.random() * (lifetimeMax - lifetimeMin),
            }
        } else {
            throw new Error('board is absolutely fill')
        }
    }

    const work = () => {
        if (isWork) {
            try {
                const newCoin = createCoin()
                addLifetimeTimer(newCoin)
                coins.push(newCoin)
            } catch (e) {
                // full map
            }
            if (workTimer) clearTimeout(workTimer)
            workTimer = setTimeout(work, getBornDelay())
        }
    }

    const start = () => {
        if (!isWork) {
            isWork = true
            workTimer = setTimeout(work, getBornDelay())
            coins.forEach((coin) => {addLifetimeTimer(coin)})
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
        onChangeCallback()
    }

    return {
        setSnake: function (snake: Snake) {
            currentSnake = snake
            return this
        },
        start: function () {
            start()
            return this
        },
        stop: function () {
            stop()
            return this
        },
        empty: function () {
            empty()
            return this
        },
        clearPoint: function (point) {
            const {x, y} = point
            coins.forEach((coin, i) => {
                if(coin.point.x === x && coin.point.y === y) {
                    coins.splice(i, 1)
                }
            })
            return this
        },
        Render: () => <RenderCoins coins={coins} gameDuration={getGameDuration()}/>,
        hasCoinThere: (point: Point) => {
            for(let coin of coins) {
                if(coin.point.x === point.x && coin.point.y === point.y) return true;
            }
            return false;
        },
        setAccelerationCoefficient: function (accelerationCoefficient : number) {
            k = accelerationCoefficient;
            return this
        },
        setRespawnIntervalMin: function (milliseconds: number) {
            respawnIntervalMin = milliseconds
            return this;
        },
        setRespawnIntervalMax: function (milliseconds: number) {
            respawnIntervalMax = milliseconds
            return this;
        },
        setLifetimeMin: function (milliseconds: number) {
            lifetimeMin = milliseconds
            return this
        },
        setLifetimeMax: function (milliseconds: number) {
            lifetimeMax = milliseconds
            return this
        },
    }
}
