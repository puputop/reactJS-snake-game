import React, {ReactElement} from 'react';
// import {IGameProps, IGameState} from "./Types";
import './game.css';
import {generateBoard} from "./GameBoard";
import {createSnake, Direction, DrawSnake, Snake} from "./Snake";
import {COINS, pointsPerStep, SNAKE} from "./config";
import {Coin, createCoin, DrawCoins} from "./Coins";

interface IGameProps {
    name: string,
    cols: number,
    rows: number
}

interface IGameState {
    snake: Snake,
    coins: Coin[],
    status: gameStatus,
    points: number,
    speed: number, // milliseconds per cell
    gameDuration: number, // milliseconds
}

const enum menuActions {NEW_GAME, PAUSE, PLAY, STOP}
const enum gameStatus {PLAY, STOP, PAUSE}

export class Game extends React.Component<IGameProps, IGameState> {

    gameDiv: React.RefObject<any>;
    snakeStepTimer: NodeJS.Timer | undefined = undefined
    coinRespawnTimer: NodeJS.Timer | undefined = undefined
    currentDirection: Direction = Direction.right


    constructor(props: IGameProps) {
        super(props);
        this.state = {
            snake: createSnake(props.cols, props.rows),
            coins: [],
            status: gameStatus.STOP,
            points: 0,
            speed: SNAKE.SPEED.INITIAL,
            gameDuration: 0,
        };
        this.keyPress = this.keyPress.bind(this)
        this.focusDiv = this.focusDiv.bind(this)
        this.menuClick = this.menuClick.bind(this)
        this.gameTick = this.gameTick.bind(this)
        this.respawnCoin = this.respawnCoin.bind(this)
        this.gameDiv = React.createRef();
        setInterval(() => this.focusDiv(), 200)
        this.updateSpeed(this.state.speed);
    }

    updateSpeed(speed: number) {
        if (this.snakeStepTimer) {
            clearInterval(this.snakeStepTimer);
        }
        this.snakeStepTimer = setInterval(this.gameTick, speed);
    }

    calcNewSpeed(gameDuration : number) : number {
        const speed = SNAKE.SPEED.INITIAL / (1 + gameDuration / 1000 / SNAKE.SPEED.GROWTH_INTERVAL * SNAKE.SPEED.GROWTH_STEP / 100);
        return Math.max(speed, SNAKE.SPEED.MINIMAL);
    }

    componentDidMount() {
        this.focusDiv();
    }

    componentDidUpdate() {
        this.focusDiv();
    }

    focusDiv() {
        if (this.gameDiv.current) {
            this.gameDiv.current.focus();
        }
    }

    keyPress(e: any) {
        if (this.state.status !== gameStatus.PLAY) return;
        const up = [38, 87];
        const down = [40, 83];
        const left = [37, 65];
        const right = [68, 39];
        const keyCode = e.keyCode;
        let direction: Direction;
        if (up.indexOf(keyCode) > -1) {
            direction = Direction.top;
        } else if (down.indexOf(keyCode) > -1) {
            direction = Direction.bottom;
        } else if (left.indexOf(keyCode) > -1) {
            direction = Direction.left;
        } else if (right.indexOf(keyCode) > -1) {
            direction = Direction.right;
        } else {
            return;
        }
        if(this.state.snake.isPossibleDirection(direction)) {
            this.currentDirection = direction;
        }
    }

    menuClick(e: React.MouseEvent, action: menuActions): void {
        switch (action) {
            case menuActions.NEW_GAME:
                this.currentDirection = Direction.right;
                if(this.coinRespawnTimer) {
                    clearInterval(this.coinRespawnTimer);
                }
                this.coinRespawnTimer = setInterval(this.respawnCoin, 100);
                this.setState<never>((prevState) => {
                    if (prevState.status === gameStatus.STOP) {
                        return {
                            snake: createSnake(this.props.cols, this.props.rows),
                            coins: [],
                            status: gameStatus.PLAY,
                            points: 0,
                            speed: SNAKE.SPEED.INITIAL,
                            gameDuration: 0,
                        };
                    }
                });
                break;
            case menuActions.PAUSE:
                this.setState<never>(() => {
                    if (this.state.status === gameStatus.PLAY) {
                        return {status: gameStatus.PAUSE};
                    }
                })
                break;
            case menuActions.PLAY:
                this.setState<never>(() => {
                    if (this.state.status === gameStatus.PAUSE) {
                        return {status: gameStatus.PLAY};
                    }
                })
                break;
            case menuActions.STOP:
                if(this.coinRespawnTimer) {
                    clearTimeout(this.coinRespawnTimer);
                }
                this.setState<never>(() => {
                    if (this.state.status !== gameStatus.STOP) {
                        return {status: gameStatus.STOP};
                    }
                })
                break;
        }
    }

    gameTick(): void {
        if (this.state.status === gameStatus.PLAY) {
            if (this.state.snake.moveSnake(this.currentDirection)) {
                const snakeNewPoint = this.state.snake.getCurrentPoint();
                // coins
                // 1. clear coins by lifetime
                for(let i = 0; i < this.state.coins.length; i++) {
                    const coin = this.state.coins[i];
                    if(coin.bornTime + coin.lifetime < this.state.gameDuration) {
                        this.state.coins.splice(i, 1);
                    }
                }
                // 2. check is grab coin
                for(let i = 0; i < this.state.coins.length; i++) {
                    const p = this.state.coins[i].point;
                    if(p.x === snakeNewPoint.x && p.y === snakeNewPoint.y){
                        this.state.coins.splice(i, 1);
                        this.state.snake.growth();
                        break;
                    }
                }
                // move Snake
                this.setState<never>((prevState) => {
                    const gameDuration = prevState.gameDuration + prevState.speed;
                    const speed = this.calcNewSpeed(gameDuration);
                    this.updateSpeed(speed);
                    return {
                        points: prevState.points + pointsPerStep(prevState.snake.length, prevState.speed),
                        gameDuration: gameDuration,
                        speed,
                    }
                });
            } else {
                this.setState<never>(() => ({
                    status: gameStatus.STOP
                }));
            }
        }
    }

    respawnCoin(): void {
        if (this.state.status === gameStatus.PLAY) {
            this.state.coins.push(
                createCoin(this.props.cols, this.props.rows, this.state.gameDuration, this.state.snake, this.state.coins)
            )
        }
        if(this.coinRespawnTimer) {
            clearInterval(this.coinRespawnTimer);
        }
        const k = this.state.speed / SNAKE.SPEED.INITIAL;
        this.coinRespawnTimer = setInterval(this.respawnCoin,
            Math.round((COINS.RESPAWN_INTERVAL_MIN + Math.random() * COINS.RESPAWN_INTERVAL_MAX)) * k);
    }

    gameMenu() {
        const menu: Array<ReactElement> = [];
        const status = this.state.status;
        menu.push(<span key={menuActions.NEW_GAME}
                        className={'menu-button' + (status === gameStatus.STOP ? ' active' : '')}
                        onClick={(e) => this.menuClick(e, menuActions.NEW_GAME)}>NEW GAME</span>);
        menu.push(<span key={menuActions.PLAY}
                        className={'menu-button' + (status === gameStatus.PAUSE ? ' active' : '')}
                        onClick={(e) => this.menuClick(e, menuActions.PLAY)}>PLAY</span>);
        menu.push(<span key={menuActions.PAUSE}
                        className={'menu-button' + (status === gameStatus.PLAY ? ' active' : '')}
                        onClick={(e) => this.menuClick(e, menuActions.PAUSE)}>PAUSE</span>);
        menu.push(<span key={menuActions.STOP} className={'menu-button' + (status !== gameStatus.STOP ? ' active' : '')}
                        onClick={(e) => this.menuClick(e, menuActions.STOP)}>STOP</span>);
        return menu.concat();
    }

    gameScore() {
        const scoreFields = [
            {label: 'Points', value: Math.round(this.state.points)},
            {label: 'Duration', value: Math.round(this.state.gameDuration / 1000)},
            {label: 'Speed', value: (Math.round(1000 / this.state.speed * 10) / 10)},
            {label: 'Length', value: this.state.snake.length},
        ]
        return scoreFields.map((score, index) => (
            <span key={index} className='score'><span className='label'>{score.label}</span><span
                className='value'>{score.value}</span></span>
        ));
    }


    render() {
        let workAreaClass = '';
        if(this.state.status === gameStatus.STOP) {
            workAreaClass = 'game-over';
        }

        return <div id='board-wrapper'>
            <div key={1} className='board-menu-side'>
                <p className='board-title'>MENU</p>
                {this.gameMenu()}
            </div>
            <div key={2} className='board-game-side'>
                <p className='board-title'>{this.props.name}</p>
                <div id='board-active-area' className={workAreaClass} ref={this.gameDiv} tabIndex={0} onKeyDown={this.keyPress}>
                    {generateBoard(this.props.cols, this.props.rows)}
                    <DrawSnake {...this.state.snake} />
                    <DrawCoins coins={this.state.coins} gameDuration={this.state.gameDuration} />
                </div>
            </div>
            <div key={3} className='board-score-side'>
                <p className='board-title'>SCORE</p>
                {this.gameScore()}
            </div>
        </div>
    }
}
