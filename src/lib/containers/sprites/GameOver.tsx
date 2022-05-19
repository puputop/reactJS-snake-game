import '../../../styles/sprites/sprite.css'
import '../../../styles/sprites/game-over-sprite.css'
import React, {ReactElement} from "react";
import Score, {IScoreProps} from "../Score";
import {menuActions, MenuButton, OnClickMenuHandler} from "../MenuButton";

export interface IGameOverSpriteProps {
    scoreProps: IScoreProps,
    onClickMenuHandler: OnClickMenuHandler
}

const menuButtons: menuActions[] = [menuActions.START_NEW_GAME, menuActions.GO_TO_MAIN_MENU]

export default function GameOver(props: IGameOverSpriteProps): ReactElement {
    const {onClickMenuHandler, scoreProps} = props
    return <div className='sprite fill opacity90'>
        <p className='disappear-text'>GAME OVER</p>
        <div className='delay-sprite'>
            <p className='title'>GAME OVER</p>
            <Score {...scoreProps}/>
            {menuButtons.map((action) => <MenuButton key={action} action={action} {...{onClickMenuHandler}}/>)}
        </div>
    </div>
}
