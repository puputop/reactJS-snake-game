import '../../../../styles/screens/screen.css'
import '../../../../styles/screens/pause-screen.css'
import {ReactElement} from "react";

export default function PauseScreen () : ReactElement {
    return <div className='screen'>
        <span className='pause-icon' />
        <p className='tip'>Press <span className='button'>SPACE</span> to continue</p>
    </div>
}
