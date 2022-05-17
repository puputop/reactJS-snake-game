import '../../../../styles/sprites/sprite.css'
import '../../../../styles/sprites/play-sprite.css'
import {ReactElement} from "react";

export default function PlaySprite () : ReactElement {
    return <div className='sprite disappear500'>
        <span className='play-icon' />
        <p className='tip'>Press <span className='button'>SPACE</span> to pause</p>
    </div>
}
