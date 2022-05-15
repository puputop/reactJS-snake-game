import '../../../../styles/screens/screen.css'
import React, {ReactElement} from "react";
import {menuActions, MenuButton} from "../MenuButton";

export interface IMainMenuScreenProps {
    onMenuHandle: (e: React.MouseEvent, action: menuActions) => void
}

export default function MainMenuScreen (props: IMainMenuScreenProps) : ReactElement {
    return <div className='screen fill'>
        <p className='title'>SNAKE REACT JS</p>
        <MenuButton action={menuActions.NEW_GAME} {...props}/>
        <p className='tip'>Press <span className='button'>SPACE</span> to pause/continue</p>
        <p className='tip'>Press <span className='button'>ESC</span> for forced game over</p>
    </div>
}
