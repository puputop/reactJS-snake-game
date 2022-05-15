import '../../../styles/board.css'
import {ReactElement} from "react"

export type BoardSize = {
    cols : number,
    rows : number
}

function Board(props: {board : BoardSize}) : ReactElement  {
    const {cols, rows} = props.board
    const board = []
    for(let x = 0; x < rows; x++) {
        const line = []
        for(let y = 0; y < cols; y++) {
            line.push(<span className='field' key={y}></span>)
        }
        board.push(<div className='line' key={x}>{line.concat()}</div>)
    }
    return <div id='board-bg'>{board.concat()}</div>
}

export default Board
