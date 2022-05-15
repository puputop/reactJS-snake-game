import '../../../styles/menu.css'
import React, {ReactElement} from 'react'

export interface IMenuButton {
    action: menuActions,
    onMenuHandle: (e: React.MouseEvent, action: menuActions) => void,
    active?: boolean,
    buttonText?: string,
}
// TODO перенести отсюда menuActions в Game - сделать текст задаваемым внешне
export const enum menuActions {NEW_GAME, PAUSE, PLAY, STOP, MAIN_MENU}
export const defaultButtonText = ['NEW GAME', 'PAUSE', 'PLAY', 'STOP', 'MAIN MENU'];

export function MenuButton (props : IMenuButton) : ReactElement {
    const {action, onMenuHandle} = props
    let {active, buttonText} = props
    if(active === undefined) active = true
    if(buttonText === undefined) buttonText = defaultButtonText[action]
    return <span key={action} className={'menu-button' + (active ? ' active' : '')}
                 onClick={(e) => onMenuHandle(e, action)}>{buttonText}</span>
}
