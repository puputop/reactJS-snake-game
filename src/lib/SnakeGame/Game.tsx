import React from 'react';
import './style/game.css';
import Board, {BoardSize} from "./Core/Interface/Board";
import {createSnake, Snake} from "./Core/Objects/Snake";
import {pointsPerStep, SNAKE} from "./config";
import {CoinsFarm, createCoinsFarm} from "./Core/Objects/Coins";
import Menu, {menuActions} from "./Core/Interface/Menu";
import Score from "./Core/Interface/Score";
import {Direction} from "./Core/Objects/Point";

/*
TODO Вынести логику в игру и сделать максимально простую структуру
со змейкой по аналогии с монетами

сделать максимально читаемую структуру - "змейка съела монету"

    поправить дизайн
 */
interface IGameProps {
    name: string,
    board : BoardSize
}

interface IGameState {
    status: gameStatus,
    points: 0
}


export const enum gameStatus {PLAY, STOP, PAUSE}

class Game extends React.Component<IGameProps, IGameState> {

    snake: Snake
    coinsFarm : CoinsFarm
    gameBoardDiv: React.RefObject<HTMLDivElement>
    startGameTime: number = 0
    pauseDuration: number = 0
    pauseStartTime: number = 0
    finishGameTime: number = 0



    constructor(props: IGameProps) {
        super(props);
        this.state = {
            status: gameStatus.STOP,
            points: 0,
        };
        const {board} = props;
        // bind
        this.keyPress = this.keyPress.bind(this)
        this.focusBoard = this.focusBoard.bind(this)
        this.onMenuHandle = this.onMenuHandle.bind(this)
        this.onChangeSnakeHandle = this.onChangeSnakeHandle.bind(this)
        this.onChangeCoinsFarmHandle = this.onChangeCoinsFarmHandle.bind(this)
        this.getGameDuration = this.getGameDuration.bind(this)
        // ref
        this.gameBoardDiv = React.createRef();
        // create game objects
        this.coinsFarm = createCoinsFarm({
            board,
            getGameDuration: this.getGameDuration,
            onChangeCallback: this.onChangeCoinsFarmHandle
        });
        this.snake = createSnake(board, this.onChangeSnakeHandle)
            .setCoinsFarm(this.coinsFarm);
        this.coinsFarm.setSnake(this.snake);
        setInterval(() => this.focusBoard(), 200)
    }

    componentDidMount() : void {
        this.focusBoard();
    }

    componentDidUpdate() : void {
        this.focusBoard();
    }

    focusBoard() : void {
        if (this.gameBoardDiv.current) {
            this.gameBoardDiv.current.focus();
        }
    }

    onChangeSnakeHandle(alive : boolean) :void {
        if(alive) {
            const speed = this.getSnakeSpeed();
            this.snake.setSpeed(speed)
            this.coinsFarm.setAccelerationCoefficient(this.getCoinsFarmAccelerationCoefficient())
            this.setState<never>((prevState) => ({
                points: (prevState.points + pointsPerStep(this.snake.getLength(), speed))
            }))
        } else {
            this.gameStop();
            this.setState({})
        }
    }

    onChangeCoinsFarmHandle() : void {
        this.setState({})
    }

    getSnakeSpeed(): number {
        const speed = SNAKE.SPEED.INITIAL / (1 + this.getGameDuration() / 1000 / SNAKE.SPEED.GROWTH_INTERVAL * SNAKE.SPEED.GROWTH_STEP / 100);
        return Math.max(speed, SNAKE.SPEED.MINIMAL);
    }

    getCoinsFarmAccelerationCoefficient() : number {
        return 1 / (SNAKE.SPEED.INITIAL / this.getSnakeSpeed())
    }

    keyPress(e: any) : void {
        if (this.state.status === gameStatus.PLAY) {
            const up = [38, 87];
            const down = [40, 83];
            const left = [37, 65];
            const right = [68, 39];
            const keyCode = e.keyCode;
            if (up.indexOf(keyCode) > -1) {
                this.snake.setDirection(Direction.top)
            } else if (down.indexOf(keyCode) > -1) {
                this.snake.setDirection(Direction.bottom)
            } else if (left.indexOf(keyCode) > -1) {
                this.snake.setDirection(Direction.left)
            } else if (right.indexOf(keyCode) > -1) {
                this.snake.setDirection(Direction.right)
            }
            e.preventDefault();
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
            this.pauseDuration = 0;
            this.startGameTime = (new Date()).getTime();
            this.finishGameTime = 0;
            this.pauseStartTime = 0;
            this.setState<never>((prevState) => {
                if (prevState.status === gameStatus.STOP) {
                    return {
                        status: gameStatus.PLAY,
                        points: 0,
                    };
                }
            });
            // start timers
            this.coinsFarm.empty().start()
            this.snake.toInitial().start()
        }
    }

    gameStop() : void {
        if(this.state.status !== gameStatus.STOP) {
            this.finishGameTime = new Date().getTime()
            this.coinsFarm.stop();
            this.snake.stop();
            this.setState<never>(() => ({status: gameStatus.STOP}))
        }
    }

    gamePause() : void {
        if(this.state.status === gameStatus.PLAY) {
            this.pauseStartTime = new Date().getTime()
            this.snake.stop();
            this.coinsFarm.stop();
            this.setState<never>(() => ({status: gameStatus.PAUSE}))
        }
    }

    gamePlay() : void {
        if(this.state.status === gameStatus.PAUSE) {
            this.pauseDuration += new Date().getTime() - this.pauseStartTime
            this.snake.start();
            this.pauseStartTime = 0;
            this.coinsFarm.start();
            this.setState<never>(() => ({status: gameStatus.PLAY}))
        }
    }

    getGameDuration() : number {
        switch(this.state.status) {
            case gameStatus.PLAY:
                return new Date().getTime() - this.startGameTime - this.pauseDuration;
            case gameStatus.PAUSE:
                if(this.pauseStartTime > 0) {
                    return this.pauseStartTime - this.startGameTime - this.pauseDuration;
                } else {
                    return new Date().getTime() - this.startGameTime - this.pauseDuration;
                }
            case gameStatus.STOP:
                return this.finishGameTime - this.startGameTime - this.pauseDuration;
        }
    }

    render() {
        let workAreaClass = '';
        if (this.state.status === gameStatus.STOP) {
            workAreaClass = 'game-over';
        }
        const gameDuration = this.getGameDuration();

        return <div id='board-wrapper'>
            <div key={1} className='board-menu-side'>
                <p className='board-title'>MENU</p>
                <Menu status={this.state.status} onMenuHandle={this.onMenuHandle}/>
            </div>
            <div key={2} className='board-game-side'>
                <p className='board-title'>{this.props.name}</p>
                <div id='board-active-area' className={this.state.status === gameStatus.STOP ? workAreaClass : ''}
                     ref={this.gameBoardDiv} tabIndex={0} onKeyDown={(e) => this.keyPress(e)}>
                    <Board board={this.props.board}/>
                    <this.snake.Draw />
                    <this.coinsFarm.Draw gameDuration={gameDuration} />
                </div>
            </div>
            <div key={3} className='board-score-side'>
                <p className='board-title'>SCORE</p>
                <Score points={this.state.points}
                       gameDuration={gameDuration}
                       snakeSpeed={this.getSnakeSpeed()}
                       snakeLength={this.snake.getLength()}/>
            </div>
        </div>
    }
}

export default Game;
