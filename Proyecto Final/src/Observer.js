export const EVENTS = {
    START: 'START',
    CLICK: 'CLICK',
    GAME_OVER: 'GAME_OVER',
    NEW_GAME: 'NEW_GAME',
    UPDATE_POINTS: 'UPDATE_POINTS',
    STACK: 'STACK'
}

const Observer = new EventEmitter();
export default Observer;
