import '../../../../styles/screens/screen.css'
import '../../../../styles/screens/play-screen.css'
import {ReactElement} from "react";

export default function PlayScreen () : ReactElement {
    return <div className='screen disappear500'>
        <span className='play-icon' />
        <p className='tip'>Press <span className='button'>SPACE</span> to pause</p>
    </div>
}
