import styles from '@/lib/sprites/pause.module.sass'
import {ReactElement} from "react";

export default function Pause () : ReactElement {
    return <div className={styles.sprite}>
        <span className={styles.icon} />
        <p className={styles.tip}>Press <span className={styles.asButton}>SPACE</span> to continue</p>
    </div>
}
