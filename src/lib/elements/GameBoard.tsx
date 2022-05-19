import React, {ReactElement} from "react"

import styles from '@/styles/GameBoard.module.sass'
import Board from "../models/Board"

function GameBoard(props: {board : Board}) : ReactElement  {
    const {cols, rows} = props.board
    const board = []
    for(let x = 0; x < rows; x++) {
        const line = []
        for(let y = 0; y < cols; y++) {
            line.push(<span className={styles.field} key={y}></span>)
            // line.push(<span className='field' key={y}></span>)
        }
        // board.push(<div className='line' key={x}>{line.concat()}</div>)
        board.push(<div className={styles.line} key={x}>{line.concat()}</div>)
    }
    return <div className={styles.boardBg}>{board.concat()}</div>
    // return <div className='boardBg'>{board.concat()}</div>
}

export default GameBoard
