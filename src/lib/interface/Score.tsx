import '../../styles/score.css'
import React, {ReactElement} from "react";

type ScoreItem = {
    label: string,
    value: string
}

function RenderItem (item: ScoreItem, index : number) {
    const {label, value} = item;
    return <p key={index} className='item'>
        <span className='label'>{label}</span>
        <span className='value'>{value}</span>
    </p>
}

export interface IScoreProps {
    points: number,
    gameDuration: number,
    snakeSpeed: number,
    snakeLength : number
}

export default function Score (props: IScoreProps) : ReactElement {
    const {points, gameDuration, snakeSpeed, snakeLength} = props
    const scoreFields : ScoreItem[] = [
        {label: 'Points', value: Math.round(points).toString()},
        {label: 'Duration', value: Math.round(gameDuration / 1000).toString()}, // seconds
        {label: 'Speed', value: (Math.round(1000 / snakeSpeed * 10) / 10).toString()}, // cells per second
        {label: 'Length', value: snakeLength.toString()},
    ]
    return <div id='score'>
        {scoreFields.map((item, index) => RenderItem(item, index))}
    </div>
}
