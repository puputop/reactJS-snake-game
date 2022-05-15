import '../../../styles/score.css'
import React, {ReactElement} from "react";

export interface IScoreProps {
    points: number,
    gameDuration: number,
    snakeSpeed: number,
    snakeLength : number
}

function Score (props: IScoreProps) : ReactElement {
    const {points, gameDuration, snakeSpeed, snakeLength} = props
    const scoreFields = [
        {label: 'Points', value: Math.round(points)},
        {label: 'Duration', value: Math.round(gameDuration / 1000)},
        {label: 'Speed', value: (Math.round(1000 / snakeSpeed * 10) / 10)},
        {label: 'Length', value: snakeLength},
    ]
    return <div id='score'>
        {scoreFields.map((score, index) => (
            <p key={index} className='item'>
                <span className='label'>{score.label}</span>
                <span className='value'>{score.value}</span>
            </p>
        ))}
    </div>
}

export default Score;
