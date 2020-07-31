import BoxCreator from "./BoxCreator.js";

export default class SlicesBox {
	constructor(new_box) {
        //Cargamos la base que se queda
		this.base = new BoxCreator({
			width: new_box.base.width,
			height:  new_box.base.height,
			color: new_box.color
		});

        //Para que mi base este bien posicionada 
        //Direccion es -1 o 1 
		const move_base_x = new_box.cut.width / 2 * new_box.direction;
		const move_base_z = new_box.cut.height / 2 * new_box.direction;

		this.base.position.set(
            //Ahora el cubo principal pase a ser el nuevo cubo x,y,z
			(new_box.axis === 'x') ? new_box.last_position.x - move_base_x : new_box.last_position.x,
			new_box.last_position.y,
			(new_box.axis === 'z') ? new_box.last_position.z - move_base_z : new_box.last_position.z
        );
        
	}
	getBase() {
		return this.base;
	}

}
