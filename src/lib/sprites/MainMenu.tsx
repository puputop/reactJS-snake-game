import '../../styles/sprites/sprite.css'
import React, {ReactElement} from "react";
import {menuActions, Button, OnClickMenuHandler} from "../elements/Button";

export interface IMainMenuSpriteProps {
    onClickMenuHandler: OnClickMenuHandler
}

export default function MainMenu(props: IMainMenuSpriteProps): ReactElement {
    return <div className='sprite fill'>
        <p className='title'>SNAKE REACT JS</p>
        <Button action={menuActions.START_NEW_GAME} {...props}/>
        <p className='tip'>Press <span className='buttonInactive'>SPACE</span> to pause/continue</p>
        <p className='tip'>Press <span className='buttonInactive'>ESCAPE</span> for forced game over</p>
    </div>
}
