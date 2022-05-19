import styles from '@/styles/sprites/play.module.sass'
import React, {ReactElement} from "react";

export default function Play(props: {points : number}): ReactElement {
    return <>
        <div className={styles.gameScore}>points: {Math.round(props.points)}</div>
        <div className={styles.sprite + ' ' + styles.disappear500}>

            <span className={styles.icon}/>
            <p className={styles.tip}>Press <span className={styles.asButton}>SPACE</span> to pause</p>
        </div>
    </>
}
