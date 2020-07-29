//import { Scene, Color, DirectionalLight, HemisphereLight } from 'three';
import Cube from '../objects/Cube.js';
import BoxCreator from '../objects/BoxCreator.js'
import Box  from '../objects/Box.js'

class Scene1 extends THREE.Scene {
	constructor() {
		super();
		this.background = new THREE.Color('skyblue').convertSRGBToLinear();
		this.create();
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

		//La propiedad de alt no hace falta ya que se auto asigna en BoxCreator.js y se pone automatico en 40
		this.newBox({
			width: 200,
			height: 200,
			last: this.base_cube
		})

		this.newBox({
			width: 200,
			height: 200,
			last: this.getLastBox()
		})

		this.newBox({
			width: 200,
			height: 200,
			last: this.getLastBox()
		})

		this.newBox({
			width: 200,
			height: 200,
			last: this.getLastBox()
		})


		this.newBox({
			width: 200,
			height: 200,
			last: this.getLastBox()
		})


		this.newBox({
			width: 200,
			height: 200,
			last: this.getLastBox()
		})

		//Luces
		const ambientLight = new THREE.HemisphereLight(0xffffbb, 0x080820, .5);
		const light = new THREE.DirectionalLight(0xffffff, 1.0);
		this.add(light, ambientLight);
	}

	newBox({width, height, last}){
		const actual_box = new Box({
			width,
			height,
			last
		});
		this.boxes_group.add(actual_box);
	}

	getLastBox(){
		return this.boxes_group.children[this.boxes_group.children.length - 1];
	}

	update() {

	}
}

export default Scene1;
