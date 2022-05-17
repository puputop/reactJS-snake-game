import React, {ReactElement} from 'react';
import './styles/game.css';
import Board from "./lib/common/Board";
import GameBoard from "./lib/interface/GameBoard";
import {createSnake} from "./lib/common/snake/createSnake";
import {pointsPerStep, SNAKE} from "./lib/config";
import CoinsFarm, {createCoinsFarm} from "./lib/common/coins/CoinsFarm";
import {menuActions} from "./lib/interface/MenuButton";
import PlaySprite from "./lib/interface/sprites/PlaySprite";
import PauseSprite from "./lib/interface/sprites/PauseSprite";
import MainMenuSprite from "./lib/interface/sprites/MainMenuSprite";
import GameOverSprite from "./lib/interface/sprites/GameOverSprite";
import {getDirection, isForceStop, isPause} from "./lib/controlKeys";
import {IScoreProps} from "./lib/interface/Score";
import Snake from "./lib/common/snake/Snake";

export interface IGameProps {
    board: Board
}

export interface IGameState {
    status: gameStatus,
    points: number,
    startTime: number,
    finishTime: number,
    pauseStartTime: number,
    pauseDuration: number,
}

/**
 * PLAY - game in the progress
 * PAUSE - game on the pause
 * STOP - game finished or not started
 */
export const enum gameStatus {
    PLAY, STOP, PAUSE
}

class Game extends React.Component<IGameProps, IGameState> {

    readonly snake: Snake
    readonly coinsFarm: CoinsFarm
    readonly gameBoardDiv: React.RefObject<HTMLDivElement>
    // timers
    private focusTimer: NodeJS.Timer | undefined

    constructor(props: IGameProps) {
        super(props);
        this.state = {
            startTime: 0,
            finishTime: 0,
            pauseStartTime: 0,
            pauseDuration: 0,
            status: gameStatus.STOP,
            points: 0,
        };
        // bind
        this.onKeyDownHandler = this.onKeyDownHandler.bind(this)
        this.focusBoard = this.focusBoard.bind(this)
        this.onClickMenuHandler = this.onClickMenuHandler.bind(this)
        this.onChangeSnakeHandler = this.onChangeSnakeHandler.bind(this)
        this.onChangeCoinsFarmHandle = this.onChangeCoinsFarmHandle.bind(this)
        this.getGameDuration = this.getGameDuration.bind(this)
        this.AdditionalSprite = this.AdditionalSprite.bind(this)
        // ref
        this.gameBoardDiv = React.createRef();
        // create game objects
        const {board} = props;
        this.coinsFarm = createCoinsFarm(board, this.getGameDuration, this.onChangeCoinsFarmHandle);
        this.snake = createSnake(board, this.onChangeSnakeHandler)
            .setCoinsFarm(this.coinsFarm);
        this.coinsFarm.setSnake(this.snake);
    }

    componentDidMount(): void {
        this.focusBoard();
        this.focusTimer = setInterval(() => this.focusBoard(), 200)
    }

    componentWillUnmount() {
        if (this.focusTimer) clearInterval(this.focusTimer)
        this.snake.stop();
        this.coinsFarm.stop();
    }

    componentDidUpdate(): void {
        this.focusBoard();
    }

    focusBoard(): void {
        if (this.state.status !== gameStatus.STOP && this.gameBoardDiv.current) {
            this.gameBoardDiv.current.focus();
        }
    }

    onChangeSnakeHandler(alive: boolean): void {
        if (alive) {
            const speed = this.getSnakeSpeed();
            this.snake.setSpeed(speed)
            this.coinsFarm.setAccelerationCoefficient(this.getCoinsFarmAccelerationCoefficient())
            this.setState<never>((prevState) => ({
                points: (prevState.points + pointsPerStep(this.snake.getLength(), speed))
            }))
        } else {
            this.gameStop();
        }
    }

    onChangeCoinsFarmHandle(): void {
        this.setState({})
    }

    /**
     * speed - it's interval in milliseconds between snake steps
     */
    getSnakeSpeed(): number {
        const numWholeIntervals = Math.floor(this.getGameDuration() / SNAKE.SPEED.GROWTH_INTERVAL)
        const percentGrowthSpeedPerInterval = SNAKE.SPEED.GROWTH_STEP / 100
        const percentIncreaseSpeed = numWholeIntervals * percentGrowthSpeedPerInterval
        const speed = SNAKE.SPEED.INITIAL / (1 + percentIncreaseSpeed);
        return Math.max(speed, SNAKE.SPEED.MINIMAL);
    }

    getCoinsFarmAccelerationCoefficient(): number {
        const actualSpeed = this.getSnakeSpeed();
        return actualSpeed / SNAKE.SPEED.INITIAL
    }


    onKeyDownHandler(e: React.KeyboardEvent): void {
        const keyCode = e.code;
        if (this.state.status !== gameStatus.STOP && isForceStop(keyCode)) {
            this.gameStop();
            e.preventDefault();
        } else if (this.state.status === gameStatus.PAUSE && isPause(keyCode)) {
            this.gamePlay();
            e.preventDefault();
        } else if (this.state.status === gameStatus.PLAY) {
            const direction = getDirection(keyCode)
            if (direction !== null) {
                this.snake.setDirection(direction)
                e.preventDefault()
            } else if (isPause(keyCode)) {
                this.gamePause()
                e.preventDefault()
            }
        }
    }

    onClickMenuHandler(event: React.MouseEvent, action: menuActions): void {
        event.preventDefault()
        switch (action) {
            case menuActions.START_NEW_GAME:
                return this.gameStartNewGame()
            case menuActions.PAUSE:
                return this.gamePause()
            case menuActions.PLAY:
                return this.gamePlay()
            case menuActions.STOP:
                return this.gameStop()
            case menuActions.GO_TO_MAIN_MENU:
                return this.gameGoToMainMenu()
        }
    }

    gameGoToMainMenu(): void {
        this.setState(() => ({
                status: gameStatus.STOP,
                points: 0,
                startTime: 0,
                finishTime: 0,
                pauseStartTime: 0,
                pauseDuration: 0
            }),
            () => {
                this.snake.stop();
                this.coinsFarm.stop();
            }
        )
    }

    gameStartNewGame(): void {
        this.setState((prevState) => (
                prevState.status === gameStatus.STOP ? {
                    status: gameStatus.PLAY,
                    points: 0,
                    startTime: new Date().getTime(),
                    finishTime: 0,
                    pauseStartTime: 0,
                    pauseDuration: 0,
                } : null),
            () => {
                if (this.state.status === gameStatus.PLAY) {
                    this.coinsFarm.empty().start()
                    this.snake.toInitial().start()
                }
            }
        )
    }

    gameStop(): void {
        this.setState((prevState) => (
                prevState.status === gameStatus.STOP ?
                    null : {
                        status: gameStatus.STOP,
                        finishTime: new Date().getTime()
                    }),
            () => {
                if (this.state.status === gameStatus.STOP) {
                    this.coinsFarm.stop()
                    this.snake.stop()
                }
            }
        )
    }

    gamePause(): void {
        this.setState((prevState) => (
                prevState.status === gameStatus.PLAY ? {
                    status: gameStatus.PAUSE,
                    pauseStartTime: new Date().getTime()
                } : null
            ),
            () => {
                if (this.state.status === gameStatus.PAUSE) {
                    this.snake.stop()
                    this.coinsFarm.stop()
                }
            }
        )
    }

    gamePlay(): void {
        this.setState((prevState) => (
                prevState.status === gameStatus.PAUSE ? {
                    status: gameStatus.PLAY,
                    pauseStartTime: 0,
                    pauseDuration: prevState.pauseDuration + (new Date().getTime() - prevState.pauseStartTime)
                } : null),
            () => {
                if (this.state.status === gameStatus.PLAY) {
                    this.snake.start()
                    this.coinsFarm.start()
                }
            })
    }

    getGameDuration(): number {
        if (this.state.finishTime > 0) {
            return this.state.finishTime - this.state.startTime - this.state.pauseDuration;
        } else if (this.state.pauseStartTime > 0) {
            return this.state.pauseStartTime - this.state.startTime - this.state.pauseDuration;
        } else {
            return new Date().getTime() - this.state.startTime - this.state.pauseDuration;
        }
    }

    AdditionalSprite(): ReactElement | null {
        switch (this.state.status) {
            case gameStatus.STOP:
                if (this.state.startTime) {
                    const scoreProps: IScoreProps = {
                        points: this.state.points,
                        gameDuration: this.getGameDuration(),
                        snakeLength: this.snake.getLength(),
                        snakeSpeed: this.getSnakeSpeed()
                    }
                    return <GameOverSprite scoreProps={scoreProps} onClickMenuHandler={this.onClickMenuHandler}/>
                } else {
                    return <MainMenuSprite onClickMenuHandler={this.onClickMenuHandler}/>
                }
            case gameStatus.PLAY:
                return <PlaySprite key={this.state.pauseStartTime} points={this.state.points}/>
            case gameStatus.PAUSE:
                return <PauseSprite key={this.state.pauseStartTime}/>
        }
    }

    render() {
        return <div id='board-wrapper'>
            <div id='board-active-area' ref={this.gameBoardDiv} tabIndex={0}
                 onKeyDown={(e) => this.onKeyDownHandler(e)}>

                <GameBoard board={this.props.board}/>
                <this.snake.Render/>
                <this.coinsFarm.Render gameDuration={this.getGameDuration()}/>

                <this.AdditionalSprite/>
            </div>
        </div>
    }
}

export default Game;
