import '../../../styles/sprites/sprite.css'
import React, {ReactElement} from "react";
import {menuActions, MenuButton, OnClickMenuHandler} from "../MenuButton";

export interface IMainMenuSpriteProps {
    onClickMenuHandler: OnClickMenuHandler
}

export default function MainMenuSprite(props: IMainMenuSpriteProps): ReactElement {
    return <div className='sprite fill'>
        <p className='title'>SNAKE REACT JS</p>
        <MenuButton action={menuActions.START_NEW_GAME} {...props}/>
        <p className='tip'>Press <span className='button'>SPACE</span> to pause/continue</p>
        <p className='tip'>Press <span className='button'>ESCAPE</span> for forced game over</p>
    </div>
}
