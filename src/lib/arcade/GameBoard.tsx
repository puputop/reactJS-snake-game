export function generateBoard(cols : number, rows : number)  {
    let board = [];
    for(let x = 0; x < rows; x++) {
        let line = [];
        for(let y = 0; y < cols; y++) {
            line.push(<span className='field' key={y}></span>)
        }
        board.push(<div className='line' key={x}>{line.concat()}</div>)
    }
    return <div id='board-bg'>{board.concat()}</div>;
}
