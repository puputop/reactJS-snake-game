import styles from './common.module.sass'
import React, {ReactElement} from "react";
import {menuActions, Button, OnClickMenuHandler} from "../elements/Button";

export interface IMainMenuSpriteProps {
    onClickMenuHandler: OnClickMenuHandler
}

export default function MainMenu(props: IMainMenuSpriteProps): ReactElement {
    return <div className={styles.sprite}>
        <p className={styles.title}>SNAKE REACT JS</p>
        <Button action={menuActions.START_NEW_GAME} {...props}/>
        <p className={styles.tip}>Press <span className={styles.asButton}>SPACE</span> to pause/continue</p>
        <p className={styles.tip}>Press <span className={styles.asButton}>ESCAPE</span> for forced game over</p>
    </div>
}
