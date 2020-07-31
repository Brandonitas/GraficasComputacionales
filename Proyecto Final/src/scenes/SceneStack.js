import BoxCreator from '../objects/BoxCreator.js'
import Box  from '../objects/Box.js'
import Observer, { EVENTS } from '../Observer.js';
import SlicesBox from '../objects/SlicesBox.js';
import UserInterface from '../objects/UserInterface.js'

export default class SceneStack extends THREE.Scene {
	constructor() {
		super();
		const userInterface = new UserInterface();

		this.background = new THREE.Color('goldenrod');

		//Puntos de usuario
		this.stack_points = 0;

		//Cuando empieza la partida esta en game over
		this.game_over = true;

		this.create();
		this.events();
	}

	create() {
		//Base del cubo
		this.base_cube = new BoxCreator({
			width: 200,
			height: 200,
			alt: 200,
			color: 0x76B8F6
		});

		//A mi scene la agrego la base
		this.add(this.base_cube);

		//Grupo de cajas
		this.boxes_group = new THREE.Object3D;
		this.add(this.boxes_group); 

		//Luces
		const ambientLight = new THREE.HemisphereLight(0xffffbb, 0x080820, .5);
		const light = new THREE.DirectionalLight(0xffffff, 1.0);
		this.add(light, ambientLight);
	}

	events(){
		Observer.emit(EVENTS.NEW_GAME);

		//EVENTS.CLICK es un string pero es buena practica ponerlo asi 
		Observer.on(EVENTS.CLICK, (msg)=>{
			if(this.game_over){
				Observer.emit(EVENTS.START);
			}else{
				//Colocamos en cada click la caja
				this.getLastBox().place();
			}
		});

		Observer.on(EVENTS.START, ()=>{
			this.resetGroup();
			//Cuando empieza emitimos el evento de puntaje 
			Observer.emit(EVENTS.UPDATE_POINTS, this.stack_points);

			//Agregamos primera caja que se va a estar moviendo
			this.newBox({
				width:200,
				height:200,
				last:this.base_cube
			});

			//Empezamos el juego
			this.game_over = false;
		})

		Observer.on(EVENTS.STACK, (new_box)=>{
			//New box ya me trae el bloque cortado
			//New box nos trae el dato de los dos bloques que vienen, el que se queda y el que se corta
			console.log('NEW BOX IN STACK',new_box)

			//Actualizamos puntos
			this.stack_points++;
			Observer.emit(EVENTS.UPDATE_POINTS, this.stack_points);

			//Removemos el bloque que se estaba moviendo para colocar el nuevo una vez dando click 
			this.boxes_group.remove(this.getLastBox());

			//Espacio para cortar bloque
			const actual_base_cut = new SlicesBox(new_box);
			this.boxes_group.add(actual_base_cut.getBase());

			//Bloque nuevo con las dimensiones de la base
			this.newBox({
				width: new_box.base.width,
				height: new_box.base.height,
				last: this.getLastBox()
			});
		})

		Observer.on(EVENTS.GAME_OVER, ()=>{
			console.log("Game over");
			if(!this.game_over){
				this.stack_points = 0;
				this.boxes_group.remove(this.getLastBox());
			}
			this.game_over = true;
		})

	}

	newBox({width, height, last}){
		const actual_box = new Box({
			width,
			height,
			last
		});
		this.boxes_group.add(actual_box);
	}

	resetGroup(){
		this.boxes_group.remove(...this.boxes_group.children);
	}

	getLastBox(){
		return this.boxes_group.children[this.boxes_group.children.length - 1];
	}

	update() {
		//Obtengo ultimo bloque que debe de moverse y lo updeteo
		if(!this.game_over){
			this.getLastBox().update();
		}
	}
}
