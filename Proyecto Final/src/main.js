import { App } from './App.js';
import Observer, { EVENTS } from './Observer.js';

const container = document.querySelector('#game-container');
const app = new App(container);

window.addEventListener('resize', () => {
	app.onResize();
});

container.addEventListener('click', ()=>{
     Observer.emit(EVENTS.CLICK, 'Click');
})