import SceneStack from './scenes/SceneStack.js';
import Observer, { EVENTS } from './Observer.js';

export class App {
	constructor(container) {
        //HTML container
        this.container = container;
        
        //Jalo la escena
		this.scene = new SceneStack();

        // Camara
		this.camera = new THREE.OrthographicCamera(
            this.container.clientWidth / -2, 
            this.container.clientWidth / 2, 
            this.container.clientWidth / 2, 
            this.container.clientHeight / -2, 
            -1000,1000);
		this.camera.position.set(10, 300, 10);
        this.camera.lookAt(0, 290, 0);

        //Render
		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
		})
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.outputEncoding = THREE.sRGBEncoding;

        //El render me proporciona el canvas y ya no lo necesito en el html
		this.container.appendChild(this.renderer.domElement);
		this.onResize();
        this.render();
        this.events();
    }
    
    events(){
        //Gracias a observables puedo acceder a los eventos en cualquier parte del codigo
        Observer.on(EVENTS.STACK, ()=>{
            this.camera.translateY(25)
            this.camera.updateProjectionMatrix();
        })

        Observer.on(EVENTS.START, ()=>{
            this.camera.zoom = 1;
            this.camera.position.set(10, 300, 10);
            this.camera.lookAt(0, 290, 0);
            this.camera.updateProjectionMatrix();
        })

        Observer.on(EVENTS.GAME_OVER, ()=>{
            this.camera.zoom = .4;
            this.camera.position.set(10, 1000, 10);
            this.camera.updateProjectionMatrix();
        })
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
        //requestAnimationFrame(function() { this.render()});
        this.renderer.setAnimationLoop(() => this.render());
        
		// Updates here
		this.scene.update();
	}
}
