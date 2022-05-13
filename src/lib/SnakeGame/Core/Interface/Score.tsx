import React, {ReactElement} from "react";

function Score (props: {points: number, gameDuration: number, snakeSpeed: number, snakeLength : number}) : ReactElement {
    const {points, gameDuration, snakeSpeed, snakeLength} = props;
    const scoreFields = [
        {label: 'Points', value: Math.round(points)},
        {label: 'Duration', value: Math.round(gameDuration / 1000)},
        {label: 'Speed', value: (Math.round(1000 / snakeSpeed * 10) / 10)},
        {label: 'Length', value: snakeLength},
    ]
    return <div id='score'>
        <p className='game-title'>SNAKE</p>
        {scoreFields.map((score, index) => (
            <span key={index} className='score'>
                <span className='label'>{score.label}</span>
                <span className='value'>{score.value}</span>
            </span>
        ))}
    </div>
}

export default Score;
