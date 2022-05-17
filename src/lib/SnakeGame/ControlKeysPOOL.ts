// React.KeyboardEvent.code
import {Direction} from "./Point";

const controlKeysPOOL = {
    pause: ['Space'],
    forceStop: ['Escape'],
    directions: {
        up: ['ArrowUp', 'KeyW'],
        down: ['ArrowDown', 'KeyS'],
        left: ['ArrowLeft', 'KeyA'],
        right: ['ArrowRight', 'KeyD'],
    }
}

export function isPause(keyCode : string) : boolean {
    return controlKeysPOOL.pause.indexOf(keyCode) > -1
}

export function isForceStop(keyCode : string) : boolean {
    return controlKeysPOOL.forceStop.indexOf(keyCode) > -1
}

export function getDirection(keyCode : string) : null|Direction {
    const {up, down, left, right} = controlKeysPOOL.directions
    if(up.indexOf(keyCode) > -1) return Direction.up
    if(down.indexOf(keyCode) > -1) return Direction.down
    if(left.indexOf(keyCode) > -1) return Direction.left
    if(right.indexOf(keyCode) > -1) return Direction.right
    return null
}
