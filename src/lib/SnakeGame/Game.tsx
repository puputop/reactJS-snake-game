import React, {ReactElement} from 'react';
import '../../styles/game.css';
import Board, {BoardSize} from "./Interface/Board";
import {createSnake, Snake} from "./Objects/Snake";
import {pointsPerStep, SNAKE} from "./config";
import {CoinsFarm, createCoinsFarm} from "./Objects/Coins";
import {menuActions} from "./Interface/MenuButton";
import {Direction} from "./Point";
import PlayScreen from "./Interface/Screens/PlayScreen";
import PauseScreen from "./Interface/Screens/PauseScreen";
import MainMenuScreen from "./Interface/Screens/MainMenuScreen";
import GameOverScreen from "./Interface/Screens/GameOverScreen";

/*
TODO раскидать стили по файлам
4. изучить модули для подгрузки стилей
5. изучить наследование для определения параметров интерфейсов по умолчанию
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
        this.PlayPauseScreen = this.PlayPauseScreen.bind(this)
        this.Menu = this.Menu.bind(this)
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
        if (this.state.status === gameStatus.PLAY && this.gameBoardDiv.current) {
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

    keyPress(e: React.KeyboardEvent) : void {
        if (this.state.status !== gameStatus.STOP) {
            const pause : any = ['Space'];
            const stop = ['Escape'];
            const up = ['ArrowUp', 'KeyW'];
            const down = ['ArrowDown', 'KeyS'];
            const left = ['ArrowLeft', 'KeyA'];
            const right = ['ArrowRight', 'KeyD'];
            const keyCode = e.code;
            if(this.state.status === gameStatus.PLAY) {
                if (up.indexOf(keyCode) > -1) {
                    this.snake.setDirection(Direction.top)
                    e.preventDefault();
                } else if (down.indexOf(keyCode) > -1) {
                    this.snake.setDirection(Direction.bottom)
                    e.preventDefault();
                } else if (left.indexOf(keyCode) > -1) {
                    this.snake.setDirection(Direction.left)
                    e.preventDefault();
                } else if (right.indexOf(keyCode) > -1) {
                    this.snake.setDirection(Direction.right)
                    e.preventDefault();
                } else if (pause.indexOf(keyCode) > -1) {
                    this.gamePause();
                    e.preventDefault();
                } else if (stop.indexOf(keyCode) > -1) {
                    this.gameStop();
                    e.preventDefault();
                }
            } else if (this.state.status === gameStatus.PAUSE) {
                if(pause.indexOf(keyCode) > -1) {
                    this.gamePlay();
                    e.preventDefault();
                } else if (stop.indexOf(keyCode) > -1) {
                    this.gameStop();
                    e.preventDefault();
                }
            }
        }
    }

    onMenuHandle(event: React.MouseEvent, action: menuActions) : void {
        event.preventDefault()
        switch (action) {
            case menuActions.NEW_GAME:
                return this.gameNewGame()
            case menuActions.PAUSE:
                return this.gamePause()
            case menuActions.PLAY:
                return this.gamePlay()
            case menuActions.STOP:
                return this.gameStop()
            case menuActions.MAIN_MENU:
                return this.gameMainMenu()
        }
    }

    gameMainMenu() : void {
        this.pauseDuration = 0;
        this.startGameTime = 0;
        this.finishGameTime = 0;
        this.pauseStartTime = 0;
        this.setState<never>(() => {
            return {
                status: gameStatus.STOP,
                points: 0,
            };
        });
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

    Menu() : ReactElement|null {
        if([gameStatus.PLAY, gameStatus.PAUSE].indexOf(this.state.status) > -1) {
            return <div id='game-score'>points: {Math.round(this.state.points)}</div>
        } else {
            return null
        }
    }

    PlayPauseScreen() : ReactElement|null {
        if(!this.startGameTime) {
            return <MainMenuScreen onMenuHandle={this.onMenuHandle} />
        } else if(this.finishGameTime) {
            return <GameOverScreen points={this.state.points}
                                   gameDuration={this.getGameDuration()}
                                   snakeSpeed={this.getSnakeSpeed()}
                                   snakeLength={this.snake.getLength()}
                                   onMenuHandle={this.onMenuHandle} />
        } else if(this.state.status === gameStatus.PAUSE) {
            return <PauseScreen key={this.pauseStartTime} />
        } else if(this.state.status === gameStatus.PLAY && this.pauseDuration) {
            return <PlayScreen key={this.pauseStartTime} />
        } else {
            return null;
        }
    }

    render() {
        let workAreaClass = '';
        if (this.state.status === gameStatus.STOP) {
            workAreaClass = 'game-over';
        }
        const gameDuration = this.getGameDuration();

        return <div id='board-wrapper'>
            <div key={2} className='board-game-side'>
                <div id='board-active-area' className={this.state.status === gameStatus.STOP ? workAreaClass : ''}
                     ref={this.gameBoardDiv} tabIndex={0} onKeyDown={(e) => this.keyPress(e)}>
                    <Board board={this.props.board}/>
                    <this.snake.Draw />
                    <this.coinsFarm.Draw gameDuration={gameDuration} />
                    <this.Menu />
                    <this.PlayPauseScreen />
                </div>
            </div>
        </div>
    }
}

export default Game;
