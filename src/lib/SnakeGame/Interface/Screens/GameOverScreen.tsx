import '../../../../styles/screens/screen.css'
import '../../../../styles/screens/game-over-screen.css'
import React, {ReactElement} from "react";
import Score, {IScoreProps} from "../Score";
import {menuActions, MenuButton} from "../MenuButton";
import {IMainMenuScreenProps} from "./MainMenuScreen";

export interface IGameOverScreenProps extends IScoreProps, IMainMenuScreenProps {

}

export default function GameOverScreen (props : IGameOverScreenProps) : ReactElement {
    return <div className='screen fill opacity90'>
        <p className='disappear-title'>GAME OVER</p>
        <div className='delay-score'>
            <p className='title'>GAME OVER</p>
            <Score {...props} />
            <MenuButton action={menuActions.NEW_GAME} {...props}/>
            <MenuButton action={menuActions.MAIN_MENU} {...props}/>
        </div>
    </div>
}
