//import { PerspectiveCamera, Vector3, WebGLRenderer, sRGBEncoding } from 'three';
import Scene1 from './scenes/Scene1.js';

export class App {
	constructor(container) {
		this.container = container;

		this.scene = new Scene1();

        // ## Camera's config
		this.camera = new THREE.OrthographicCamera(
            this.container.clientWidth / -2, 
            this.container.clientWidth / 2, 
            this.container.clientWidth / 2, 
            this.container.clientHeight / -2, 
            -1000,1000);
		this.camera.position.set(10, 10, 10);
        this.camera.lookAt(0, 0, 0);
        
        //Add orbit controls 
        this.controls = new THREE.OrbitControls(this.camera, this.container);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 1;

		// ## Renderer's config
		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
		})
		this.renderer.setPixelRatio(window.devicePixelRatio);

		// sRGBEncoding
		this.renderer.outputEncoding = THREE.sRGBEncoding;

		// ## Light's config
		this.renderer.physicallyCorrectLights = true;

		this.container.appendChild(this.renderer.domElement);
		this.onResize();
		this.render();
	}

	onResize() {
		this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        
        this.camera.left = this.container.clientWidth / -2; 
        this.camera.right = this.container.clientWidth / 2;
        this.camera.top = this.container.clientWidth / 2;
        this.camera.bottom = this.container.clientHeight / -2;

		this.camera.updateProjectionMatrix();
	}

	render() {
		this.renderer.render(this.scene, this.camera);

		// Updates here
		this.scene.update();

		this.renderer.setAnimationLoop(() => this.render());
	}
}
