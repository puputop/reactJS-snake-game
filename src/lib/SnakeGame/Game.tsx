import React from 'react';
import './style/game.css';
import Board from "./Core/Interface/Board";
import {createSnake, Direction, Snake} from "./Core/Objects/Snake";
import {pointsPerStep, SNAKE} from "./config";
import {CoinsFarm, createCoinsFarm} from "./Core/Objects/Coins";
import Menu, {menuActions} from "./Core/Interface/Menu";
import Score from "./Core/Interface/Score";
/*
TODO Вынести логику в игру и сделать максимально простую структуру
со змейкой по аналогии с монетами

сделать максимально читаемую структуру - "змейка съела монету"

    поправить дизайн
 */
interface IGameProps {
    name: string,
    cols: number,
    rows: number
}

interface IGameState {
    status: gameStatus,
    points: number,
    gameDuration: number, // milliseconds // TODO remove from the state
}


export const enum gameStatus {PLAY, STOP, PAUSE}

class Game extends React.Component<IGameProps, IGameState> {

    gameBoardDiv: React.RefObject<HTMLDivElement>
    snakeStepTimer: NodeJS.Timer | undefined = undefined
    currentDirection: Direction = Direction.right
    startGameTime: number = new Date().getTime()
    pauseDuration: number = 0
    pauseStartTime: number = 0
    snake: Snake
    coinsFarm : CoinsFarm


    constructor(props: IGameProps) {
        super(props);
        const {cols, rows} = props;
        this.snake = createSnake({cols, rows});
        this.state = {
            status: gameStatus.STOP,
            points: 0,
            gameDuration: 0,
        };
        this.keyPress = this.keyPress.bind(this)
        this.focusDiv = this.focusDiv.bind(this)
        this.onMenuHandle = this.onMenuHandle.bind(this)
        this.snakeMove = this.snakeMove.bind(this)
        this.gameBoardDiv = React.createRef();
        setInterval(() => this.focusDiv(), 200)
        this.coinsFarm = createCoinsFarm({
            boardCols: cols,
            boardRows: rows,
            snake: this.snake,
            getGameDuration: ()=>this.getActualGameDuration(),
            updateCallback: ()=>{this.setState({})}
        });
    }

    componentDidMount() : void {
        this.focusDiv();
    }

    componentDidUpdate() : void {
        this.focusDiv();
    }

    focusDiv() : void {
        if (this.gameBoardDiv.current) {
            this.gameBoardDiv.current.focus();
        }
    }

    getSpeed(): number {
        const speed = SNAKE.SPEED.INITIAL / (1 + this.state.gameDuration / 1000 / SNAKE.SPEED.GROWTH_INTERVAL * SNAKE.SPEED.GROWTH_STEP / 100);
        return Math.max(speed, SNAKE.SPEED.MINIMAL);
    }

    keyPress(e: any) : void {
        if (this.state.status === gameStatus.PLAY) {
            const up = [38, 87];
            const down = [40, 83];
            const left = [37, 65];
            const right = [68, 39];
            const keyCode = e.keyCode;
            if (up.indexOf(keyCode) > -1) {
                this.setDirection(Direction.top);
            } else if (down.indexOf(keyCode) > -1) {
                this.setDirection(Direction.bottom);
            } else if (left.indexOf(keyCode) > -1) {
                this.setDirection(Direction.left);
            } else if (right.indexOf(keyCode) > -1) {
                this.setDirection(Direction.right);
            }
        }
    }

    setDirection(direction : Direction) : void {
        if (this.snake.isPossibleDirection(direction)) {
            if(this.currentDirection !== direction) {
                this.currentDirection = direction
                // for perfect control in the game
                if(this.snakeStepTimer) {
                    clearTimeout(this.snakeStepTimer);
                }
                this.snakeMove();
            }
        }
    }

    onMenuHandle(action: menuActions): void {
        switch (action) {
            case menuActions.NEW_GAME:
                return this.gameNewGame();
            case menuActions.PAUSE:
                return this.gamePause();
            case menuActions.PLAY:
                return this.gamePlay();
            case menuActions.STOP:
                return this.gameStop();
        }
    }

    gameNewGame() : void {
        if(this.state.status === gameStatus.STOP) {
            this.currentDirection = Direction.right;
            this.pauseDuration = 0;
            this.startGameTime = (new Date()).getTime();
            this.setState<never>((prevState) => {
                if (prevState.status === gameStatus.STOP) {
                    this.snake.reborn();
                    return {
                        status: gameStatus.PLAY,
                        points: 0,
                        speed: SNAKE.SPEED.INITIAL,
                        gameDuration: 0,
                    };
                }
            });
            // start timers
            if (this.snakeStepTimer) clearTimeout(this.snakeStepTimer);
            this.snakeStepTimer = setTimeout(this.snakeMove, this.getSpeed());
            this.coinsFarm.empty().start();
        }
    }

    gameStop() : void {
        if(this.state.status !== gameStatus.STOP) {
            this.coinsFarm.stop();
            if (this.snakeStepTimer) clearTimeout(this.snakeStepTimer);
            this.setState<never>(() => ({status: gameStatus.STOP}))
        }
    }

    gamePause() : void {
        if(this.state.status === gameStatus.PLAY) {
            this.pauseStartTime = new Date().getTime()
            this.coinsFarm.stop();
            this.setState<never>(() => ({status: gameStatus.PAUSE}))
        }
    }

    gamePlay() : void {
        if(this.state.status === gameStatus.PAUSE) {
            this.pauseDuration += new Date().getTime() - this.pauseStartTime
            this.pauseStartTime = 0;
            this.coinsFarm.start();
            this.setState<never>(() => ({status: gameStatus.PLAY}))
        }
    }

    snakeMove(): void {
        if (this.state.status === gameStatus.PLAY) {
            if (this.snake.moveSnake(this.currentDirection)) {
                // coinsFarm
                const snakeBegin = this.snake.getBeginPoint();
                if(this.coinsFarm.hasCoinThere(snakeBegin)) {
                    this.coinsFarm.clearPoint(snakeBegin);
                    this.snake.growth();
                }
                // move Snake
                this.setState<never>((prevState) => ({
                    points: prevState.points + pointsPerStep(this.snake.getLength(), this.getSpeed()),
                    gameDuration: new Date().getTime() - this.startGameTime - this.pauseDuration,
                }));
            } else {
                // the end of game
                this.gameStop();
            }
        }
        if(this.state.status !== gameStatus.STOP) {
            if (this.snakeStepTimer) {
                clearTimeout(this.snakeStepTimer);
            }
            this.snakeStepTimer = setTimeout(this.snakeMove, this.getSpeed());
        }
    }

    getActualGameDuration() : number {
        switch(this.state.status) {
            case gameStatus.PLAY:
                return new Date().getTime() - this.startGameTime - this.pauseDuration;
            case gameStatus.PAUSE:
                if(this.pauseStartTime > 0) {
                    return this.pauseStartTime - this.startGameTime - this.pauseDuration;
                } else {
                    return new Date().getTime() - this.startGameTime - this.pauseDuration;
                }
            default:
                return this.state.gameDuration;
        }
    }

    render() {
        let workAreaClass = '';
        if (this.state.status === gameStatus.STOP) {
            workAreaClass = 'game-over';
        }

        return <div id='board-wrapper'>
            <div key={1} className='board-menu-side'>
                <p className='board-title'>MENU</p>
                <Menu status={this.state.status} onMenuHandle={this.onMenuHandle}/>
            </div>
            <div key={2} className='board-game-side'>
                <p className='board-title'>{this.props.name}</p>
                <div id='board-active-area' className={this.state.status === gameStatus.STOP ? workAreaClass : ''}
                     ref={this.gameBoardDiv} tabIndex={0} onKeyDown={(e) => this.keyPress(e)}>
                    <Board cols={this.props.cols} rows={this.props.rows}/>
                    <this.snake.Draw />
                    <this.coinsFarm.Draw gameDuration={this.state.gameDuration} />
                </div>
            </div>
            <div key={3} className='board-score-side'>
                <p className='board-title'>SCORE</p>
                <Score points={this.state.points}
                       gameDuration={this.state.gameDuration}
                       snakeSpeed={this.getSpeed()}
                       snakeLength={this.snake.getLength()}/>
            </div>
        </div>
    }
}

export default Game;
