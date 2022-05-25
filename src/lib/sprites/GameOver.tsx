import styles from '@/lib/sprites/game-over.module.sass'
import React, {ReactElement} from "react";
import Score, {IScoreProps} from "../elements/Score";
import {menuActions, Button, OnClickMenuHandler} from "../elements/Button";

export interface IGameOverSpriteProps {
    scoreProps: IScoreProps,
    onClickMenuHandler: OnClickMenuHandler
}

const menuButtons: menuActions[] = [menuActions.START_NEW_GAME, menuActions.GO_TO_MAIN_MENU]

export default function GameOver(props: IGameOverSpriteProps): ReactElement {
    const {onClickMenuHandler, scoreProps} = props
    return <div className={styles.sprite}>
        <p className={styles.disappearText}>GAME OVER</p>
        <div className={styles.delaySprite}>
            <p className={styles.title}>GAME OVER</p>
            <Score {...scoreProps}/>
            {menuButtons.map((action) => <Button key={action} action={action} {...{onClickMenuHandler}}/>)}
        </div>
    </div>
}
