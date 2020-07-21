let renderer = null, 
scene = null, 
camera = null,
cube = null,
cubeGroup = null,
sphere = null,
cone = null,
sphereGroup = null,
canvas = null;

let duration = 5000; // ms
let currentTime = Date.now();

let groupObjectArray = [];
let objectsArray = [];
let groupSatelitesArray = [];
let satelitesArray = [];

let bucketObject = []
let bucketSatelite = []

function createObject(canvasN){
    let cube = new THREE.CubeGeometry(2, 2, 2);
    let cono = new THREE.ConeGeometry( 1, 2, 32 );
    let cilindro = new THREE.CylinderGeometry( 1, 1, 2, 32 );
    let esfera = new THREE.SphereGeometry( 1, 20, 20 );
    let anillo = new THREE.TorusGeometry( 1, .3, 16, 100 );
    let nudo = new THREE.TorusKnotBufferGeometry( .7, .2, 100, 16 );

    bucketObject.push(cube);
    bucketObject.push(cono);
    bucketObject.push(cilindro);
    bucketObject.push(esfera);
    bucketObject.push(anillo);
    bucketObject.push(nudo);

    canvas = canvasN;

}

function createSatelite(){
    let cube = new THREE.CubeGeometry(.3, .3, .3);
    let cono = new THREE.ConeGeometry( .2, .4, 32 );
    let cilindro = new THREE.CylinderGeometry( .1, .1, .4, 32 );
    let esfera =  new THREE.SphereGeometry( .3, 20, 20 );
    let anillo = new THREE.TorusGeometry( .2, .1, 16, 100 );
    let nudo = new THREE.TorusKnotBufferGeometry( .2, .1, 100, 16 );

    bucketSatelite.push(cube);
    bucketSatelite.push(cono);
    bucketSatelite.push(cilindro);
    bucketSatelite.push(esfera);
    bucketSatelite.push(anillo);
    bucketSatelite.push(nudo);

}



function addObject(){
    console.log("ADD")

    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 2 * fract;

    let textureUrl = "../images/ash_uvgrid01.jpg";
    let texture = new THREE.TextureLoader().load(textureUrl);
    let material = new THREE.MeshPhongMaterial({ map: texture });
    // Create the cube geometry
    //let geometry = new THREE.TorusKnotBufferGeometry( .2, .1, 100, 16 );
    let geometry = bucketObject[Math.floor(Math.random() * bucketObject.length)];

    let newObject = new THREE.Mesh(geometry, material);

    // Tilt the mesh toward the viewer
    newObject.rotation.x = Math.PI / 5;
    newObject.rotation.y = Math.PI / 5;

    if(groupObjectArray.length == 0){

        cubeGroup = new THREE.Object3D;

        x = 0
        y = 0
        z = 0

        cubeGroup.add(newObject);
        cubeGroup.position.set(x,y,z);
        scene.add(cubeGroup);
        
        //Pusheo a mi arreglo de objetos para animacion
        objectsArray.push(newObject)

        //Pusheo a mi arreglo de grupos
        groupObjectArray.push(cubeGroup);

        // add mouse handling so we can rotate the scene
        addMouseHandler(canvas, cubeGroup);

    }else{
        console.log("bb",groupObjectArray[groupObjectArray.length-1])
        console.log("LENGTH", groupObjectArray.length)

        //Jalo el grupo padre
        let padreCubeGroup = groupObjectArray[groupObjectArray.length-1];

        //hago un nuevo grupo
        let cubeGroupNew = new THREE.Object3D;

        let x = 6;
        let y = Math.floor(Math.random()*3);// this will get a number between 0 and 3;
        let z = Math.floor(Math.random()*3);// this will get a number between 0 and 3;

        y *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases
        z *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases
        x *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases

        cubeGroupNew.add(newObject);

        cubeGroupNew.position.set(x,y,z);

        console.log("POSITION HIJO NUEVA", cubeGroupNew.position)

        //A mi grupo padre le agrego el nuevo grupo 
        padreCubeGroup.add(cubeGroupNew);

        //Pusheo a mi arreglo de objetos para animacion
        objectsArray.push(newObject)

        //Pusheo a mi arreglo de grupos
        groupObjectArray.push(cubeGroupNew);
    }    

}

function addSatelite(){

    console.log("ADD SATELITE")

    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 2 * fract;

    let textureUrl = "../images/ash_uvgrid01.jpg";
    let texture = new THREE.TextureLoader().load(textureUrl);
    let material = new THREE.MeshPhongMaterial({ map: texture });
    // Create the cube geometry
    //let geometry = new THREE.TorusKnotBufferGeometry( .2, .1, 100, 16 );
    let geometry = bucketSatelite[Math.floor(Math.random() * bucketSatelite.length)];

    let newObject = new THREE.Mesh(geometry, material);

    // Tilt the mesh toward the viewer
    newObject.rotation.x = Math.PI / 5;
    newObject.rotation.y = Math.PI / 5;


    if(groupObjectArray.length > 0){
        //Jalo el grupo padre
        let padreCubeGroup = groupObjectArray[groupObjectArray.length-1];

        sateliteGroup = new THREE.Object3D;
        x = 0
        y = 0
        z = 0
        newObject.position.set(2,Math.floor(Math.random()*3),0);
        sateliteGroup.add(newObject);
        sateliteGroup.position.set(x,y,z);
        scene.add(sateliteGroup);
        
        //Pusheo a mi arreglo de objetos para animacion
        satelitesArray.push(newObject);
    
        //Pusheo a mi arreglo de grupos de satelites
        groupSatelitesArray.push(sateliteGroup);

        //A mi grupo padre le agrego el nuevo grupo 
        padreCubeGroup.add(sateliteGroup);

    }
    
}

function clean(){
    console.log("CLEAN")
    groupObjectArray = [];
    objectsArray = [];
    groupSatelitesArray = [];
    satelitesArray = [];
    console.log(scene.children)
    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }
    console.log(scene.children)

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 10;
    scene.add(camera);
    cubeGroup = new THREE.Object3D;
    let light = new THREE.DirectionalLight( 0xffffff, 1.0);
    light.position.set(-.5, .2, 1);
    light.target.position.set(0,-2,0);
    scene.add(light);
    let ambientLight = new THREE.AmbientLight(0xffccaa, 0.2);
    scene.add(ambientLight);

}

function animate() 
{
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 2 * fract;

    for(object of objectsArray){
        object.rotation.y += angle;
    }

    for(object of satelitesArray){
        object.rotation.y += angle;
    }

    for(object of groupSatelitesArray){
        object.rotation.y -= angle / 2;
    }

}

function run() {
    requestAnimationFrame(function() { run(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();

}

function createScene(canvas)
{    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Set the background color 
    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );
    // scene.background = new THREE.Color( "rgb(100, 100, 100)" );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 10;
    scene.add(camera);

    // Create a group to hold all the objects
    cubeGroup = new THREE.Object3D;
    
    // Add a directional light to show off the objects
    let light = new THREE.DirectionalLight( 0xffffff, 1.0);
    // let light = new THREE.DirectionalLight( "rgb(255, 255, 100)", 1.5);

    // Position the light out from the scene, pointing at the origin
    light.position.set(-.5, .2, 1);
    light.target.position.set(0,-2,0);
    scene.add(light);

    // This light globally illuminates all objects in the scene equally.
    // Cannot cast shadows
    let ambientLight = new THREE.AmbientLight(0xffccaa, 0.2);
    scene.add(ambientLight);

    
}