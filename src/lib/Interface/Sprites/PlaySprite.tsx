import '../../../styles/sprites/sprite.css'
import '../../../styles/sprites/play-sprite.css'
import React, {ReactElement} from "react";

export default function PlaySprite(props: {points : number}): ReactElement {
    return <>
        <div className='game-score'>points: {Math.round(props.points)}</div>
        <div className='sprite disappear500'>
            <span className='play-icon'/>
            <p className='tip'>Press <span className='button'>SPACE</span> to pause</p>
        </div>
    </>
}
