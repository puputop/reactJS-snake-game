import '../../../styles/sprites/sprite.css'
import '../../../styles/sprites/pause-sprite.css'
import {ReactElement} from "react";

export default function Pause () : ReactElement {
    return <div className='sprite'>
        <span className='pause-icon' />
        <p className='tip'>Press <span className='button'>SPACE</span> to continue</p>
    </div>
}
