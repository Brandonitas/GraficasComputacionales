//import { Scene, Color, DirectionalLight, HemisphereLight } from 'three';
import BoxCreator from '../objects/BoxCreator.js'
import Box  from '../objects/Box.js'
import Observer, { EVENTS } from '../Observer.js';
import SlicesBox from '../objects/SlicesBox.js';

class Scene1 extends THREE.Scene {
	constructor() {
		super();
		this.background = new THREE.Color('skyblue').convertSRGBToLinear();

		this.stack_points = 0;
		//Cuando empieza la partida esta en game over
		this.game_over = true;

		this.create();
		this.events();
	}

	create() {
		//this.brick = new Cube(200, new THREE.Color('rgb(255,0,0)'));
		//this.add(this.brick);

		//Base del cubo
		this.base_cube = new BoxCreator({
			width: 200,
			height: 200,
			alt: 200,
			color: 0x2c3e50
		});
		this.add(this.base_cube);

		//Grupo de cajas
		this.boxes_group = new THREE.Object3D;
		this.add(this.boxes_group); 

		//Helpers
		//AxesHelper son los ejes
		this.add(new THREE.AxesHelper(800))

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
				this.getLastBox().place();
			}
		});

		Observer.on(EVENTS.START, ()=>{
			this.resetGroup();
			//Cuando empieza emitimos el evento de puntaje 
			Observer.emit(EVENTS.UPDATE_POINTS, this.stack_points);
			this.newBox({
				width:200,
				height:200,
				last:this.base_cube
			});

			this.game_over = false;
		})

		Observer.on(EVENTS.STACK, (new_box)=>{
			//New box nos trae el dato de los dos bloques que vienen, el que se queda y el que se corta
			console.log('NEW BOX IN STACK',new_box)
			this.stack_points++;

			//Removemos el bloque principal para separar bloques
			this.boxes_group.remove(this.getLastBox());

			//Espacio para cortar bloque
			const actual_base_cut = new SlicesBox(new_box);
			this.boxes_group.add(actual_base_cut.getBase());

			//El corte que debe de desaparecer
			//this.add(actual_base_cut.getCut());

			//Bloque nuevo
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

export default Scene1;
