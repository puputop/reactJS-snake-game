import {ReactElement} from "react";

function Board(props: {cols: number, rows: number}) : ReactElement  {
    const {cols, rows} = props;
    const board = [];
    for(let x = 0; x < rows; x++) {
        const line = [];
        for(let y = 0; y < cols; y++) {
            line.push(<span className='field' key={y}></span>)
        }
        board.push(<div className='line' key={x}>{line.concat()}</div>)
    }
    return <div id='board-bg'>{board.concat()}</div>;
}

export default Board;
