import { App } from './App.js';

const app = new App(document.querySelector('#game-container'));

window.addEventListener('resize', () => {
	app.onResize();
});
