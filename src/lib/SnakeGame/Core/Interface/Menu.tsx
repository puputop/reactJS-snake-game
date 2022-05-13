import React, {ReactElement} from 'react';
import {gameStatus} from "../../Game";


interface IMenuProps {
    status: gameStatus,
    onMenuHandle: (action : menuActions) => void
}

interface IMenuButton {
    action: menuActions,
    onMenuHandle: (action : menuActions) => void
}

export const enum menuActions {NEW_GAME, PAUSE, PLAY, STOP}

export function MenuButton (props : IMenuButton) : ReactElement {
    const {action, onMenuHandle} = props
    return <span key={action} className={'menu-button active'} onClick={() => onMenuHandle(action)}>NEW GAME</span>
}

function Menu (props: IMenuProps) : ReactElement {
    return <div>
        <span key={menuActions.NEW_GAME}
              className={'menu-button' + (props.status === gameStatus.STOP ? ' active' : '')}
              onClick={() => props.onMenuHandle(menuActions.NEW_GAME)}>NEW GAME</span>
        {/*<span key={menuActions.PLAY}*/}
        {/*      className={'menu-button' + (props.status === gameStatus.PAUSE ? ' active' : '')}*/}
        {/*      onClick={() => props.onMenuHandle(menuActions.PLAY)}>PLAY</span>*/}
        {/*<span key={menuActions.PAUSE}*/}
        {/*      className={'menu-button' + (props.status === gameStatus.PLAY ? ' active' : '')}*/}
        {/*      onClick={() => props.onMenuHandle(menuActions.PAUSE)}>PAUSE</span>*/}
        {/*<span key={menuActions.STOP} className={'menu-button' + (props.status !== gameStatus.STOP ? ' active' : '')}*/}
        {/*      onClick={() => props.onMenuHandle(menuActions.STOP)}>STOP</span>*/}
    </div>
}

export default Menu;
