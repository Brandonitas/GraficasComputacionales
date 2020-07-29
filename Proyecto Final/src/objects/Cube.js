//import { Mesh, MeshStandardMaterial, Color, BoxBufferGeometry } from 'three';

export default class Cube extends THREE.Mesh {
	constructor(size) {
		super();

		this.geometry = new THREE.BoxBufferGeometry(size, size, size);
		this.material = new THREE.MeshStandardMaterial({
			color: new THREE.Color('orangered').convertSRGBToLinear(),
			flatShading: true,
			roughness: .5
		});
	}
}
