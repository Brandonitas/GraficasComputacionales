//Me genera los cubos que se apilan 
export default class BoxCreator extends THREE.Mesh {
	constructor( {width, height, alt = 40, color} ) {
        super();
		this.geometry = new THREE.BoxBufferGeometry(width, alt, height);
		this.material = new THREE.MeshStandardMaterial({
			color,
			flatShading: true,
			roughness: .15
		});
		this.material.color.convertSRGBToLinear();

		// Variables propias, las guardamos para poder usarlas mas adelante
		this.color = color;
		this.dimension = {width, height}

	}
}

