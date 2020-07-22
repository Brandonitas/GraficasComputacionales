var camera, scene, renderer, composer, clock, orbit;
var uniforms, mesh;

let canvas = null;

let duration = 5000; // ms
let currentTime = Date.now();

let groupObjectArray = [];
let groupSatelitesArray = [];
let satelitesArray = [];

let planets = [];
let moons = [];

let sunGroup = null;

let mercurioGroup = null;
let mercurioLunaGroup = null;

let venusGroup = null;
let venusLunaGroup = null;

let tierraGroup = null;
let tierraLunaGroup = null;

let marteGroup = null;
let marteLunaGroup = null;


function animate() 
{
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 1 * fract;

    /*for(object of planets){
        object.rotation.y += angle;
    }*/

    /*for(object of satelitesArray){
        object.rotation.y += angle;
    }*/

    for(object of groupObjectArray){
        object.rotation.y -= angle / 2;
    }

}

function run() {
    requestAnimationFrame(function() { run(); });
    
    // Render the scene
    renderer.render( scene, camera );

    var delta = 5 * clock.getDelta();

    uniforms[ "time" ].value += 0.2 * delta;

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

    const loader = new THREE.TextureLoader();
    loader.load('https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg' , function(texture)
            {
             scene.background = texture;  
    });

    // Set the background color 
    //scene.background = new THREE.Color( 0.0, 0.0, 0.0 );
    // scene.background = new THREE.Color( "rgb(100, 100, 100)" );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    
    camera.position.z = 10;
    scene.add(camera);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 1;

    
    
    // Add a directional light to show off the objects
    let light = new THREE.PointLight( 0xffffff, 1.0);
    // let light = new THREE.DirectionalLight( "rgb(255, 255, 100)", 1.5);

    // Position the light out from the scene, pointing at the origin
    light.position.set(0, 0, 0);
    //light.target.position.set(0,-2,0);
    scene.add(light);

    // This light globally illuminates all objects in the scene equally.
    // Cannot cast shadows
    let ambientLight = new THREE.AmbientLight(0xffccaa, 0.2);
    scene.add(ambientLight);

    // Create a group to hold all the objects
    sunGroup = new THREE.Object3D;

    clock = new THREE.Clock();

    var textureLoader = new THREE.TextureLoader();

    uniforms = {

        "fogDensity": { value: 0.45 },
        "fogColor": { value: new THREE.Vector3( 0, 0, 0 ) },
        "time": { value: 1.0 },
        "uvScale": { value: new THREE.Vector2( 2.0, 1 ) },
        "texture1": { value: textureLoader.load( './cloud.png' ) },
        "texture2": { value: textureLoader.load( './lavatile.jpg' ) }

    };
    
    uniforms[ "texture1" ].value.wrapS = uniforms[ "texture1" ].value.wrapT = THREE.RepeatWrapping;
    uniforms[ "texture2" ].value.wrapS = uniforms[ "texture2" ].value.wrapT = THREE.RepeatWrapping;
    
    var size = 0.65;

    var material = new THREE.ShaderMaterial( {

        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent

    } );

    mesh = new THREE.Mesh( new THREE.SphereGeometry( size, 30, 30 ), material );
    mesh.rotation.x = 0.3;
    sunGroup.add(mesh);
    
    //Agrego mi planeta al array de planetas
    planets.push(mesh);

    console.log(mesh);

    renderer = new THREE.WebGLRenderer( { canvas:canvas, antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );

    mercurioGroup = new THREE.Object3D;
    mercurioLunaGroup = new THREE.Object3D;

    venusGroup = new THREE.Object3D;
    venusLunaGroup = new THREE.Object3D;

    tierraGroup = new THREE.Object3D;
    tierraLunaGroup = new THREE.Object3D;

    marteGroup = new THREE.Object3D;
    marteLunaGroup = new THREE.Object3D;


    crearPlaneta('mercurio','/mercurymap.jpg','/mercurybump.jpg',[.2, 15, 20],[2,0,0], mercurioGroup, 1, 'luna1.jpg',[.05, 10, 20],mercurioLunaGroup);
    crearPlaneta('venus','/venusmap.jpg','/venusbump.jpg',[.3, 15, 20],[-4,0,0], venusGroup, 1, 'luna2.jpg',[.05, 10, 20],venusLunaGroup);
    crearPlaneta('tierra','/earthmap1k.jpg','/earthbump1k.jpg',[.35, 15, 20],[6,0,0], tierraGroup, 1, 'lunaTierra.jpg',[.05, 10, 20],tierraLunaGroup);
    crearPlaneta('marte','/mars_1k_color.jpg','/mars_1k_topo.jpg',[.3, 15, 20],[-8,0,0], marteGroup, 1, 'luna3.jpg',[.05, 10, 20],marteLunaGroup);

    groupObjectArray.push(sunGroup);
    scene.add( sunGroup );
    
}

function crearPlaneta(planetaName, textura, bump, geometryCords, positionCords, grupoPlaneta, nLunas, lunaTextura, lunaCords, grupoLuna){
    //PLANETA TIERRA INICIO
    let mapUrl = "./texturas/"+planetaName+textura;
    let bumpMapUrl = "./texturas/"+planetaName+bump;

    let materials = {};

    let textureMap = new THREE.TextureLoader().load(mapUrl);
    let bumpMap = new THREE.TextureLoader().load(bumpMapUrl);

    materials["phong-textured"] = new THREE.MeshPhongMaterial({ map: textureMap, bumpMap: bumpMap, bumpScale: 0.01 });

    // Create the cube geometry
    let geometry = new THREE.SphereGeometry( geometryCords[0], geometryCords[1], [geometryCords[2]] );

    // And put the geometry and material together into a mesh
    let planeta = new THREE.Mesh(geometry, materials["phong-textured"]);

    // Tilt the mesh toward the viewer
    planeta.rotation.x = Math.PI / 5;
    planeta.rotation.y = Math.PI / 5;

    //Pusheo a mi arreglo de planetas para rotacion
    planets.push(planeta);

    x = positionCords[0];
    y = positionCords[1];
    z = positionCords[2];

    grupoPlaneta.add(planeta);
    grupoPlaneta.position.set(x,y,z);

    //Pusheo a mi arreglo de grupos para que roten al sol
    groupObjectArray.push(grupoPlaneta);

    crearLunas(grupoPlaneta, nLunas, lunaTextura, lunaCords, grupoLuna);
    
    sunGroup.add(grupoPlaneta);

    //PLANETA TIERRA FIN

    var orbit = new THREE.Line(
        new THREE.CircleGeometry(positionCords[0], 90),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: .4,
          side: THREE.BackSide
        })
      );
    orbit.geometry.vertices.shift();
    orbit.rotation.x = THREE.Math.degToRad(90);
    scene.add(orbit);
    
    sunGroup.add(orbit)


}

function crearLunas(planetGroup, nLunas, lunaTextura, lunaCords, grupoLuna){

    while(nLunas>0){
        //PLANETA TIERRA INICIO
        let textureUrl = "./texturas/lunas/"+lunaTextura;
        let texture = new THREE.TextureLoader().load(textureUrl);
        let material = new THREE.MeshPhongMaterial({ map: texture });

        // Create the cube geometry
        let geometry = new THREE.SphereGeometry(lunaCords[0],lunaCords[1],lunaCords[2]);

        // And put the geometry and material together into a mesh
        let luna = new THREE.Mesh(geometry, material);

        // Tilt the mesh toward the viewer
        luna.rotation.x = Math.PI / 5;
        luna.rotation.y = Math.PI / 5;

        //Pusheo a mi arreglo de planetas para rotacion
        planets.push(luna);

        x = .5
        y = 0
        z = 0

        grupoLuna.add(luna);
        grupoLuna.position.set(x,y,z);

        //Pusheo a mi arreglo de grupos para que roten al sol
        groupObjectArray.push(grupoLuna);

        planetGroup.add(grupoLuna);

        nLunas--;
    }
}



function crearCinturon(textura, geometryCords, positionCords, grupoPlaneta, nLunas, lunaTextura, lunaCords, grupoLuna){
    //PLANETA TIERRA INICIO
    let mapUrl = "./texturas/"+planetaName+textura;
    let bumpMapUrl = "./texturas/"+planetaName+bump;

    let materials = {};

    let textureMap = new THREE.TextureLoader().load(mapUrl);
    let bumpMap = new THREE.TextureLoader().load(bumpMapUrl);

    materials["phong-textured"] = new THREE.MeshPhongMaterial({ map: textureMap, bumpMap: bumpMap, bumpScale: 0.01 });

    // Create the cube geometry
    let geometry = new THREE.SphereGeometry( geometryCords[0], geometryCords[1], [geometryCords[2]] );

    // And put the geometry and material together into a mesh
    let planeta = new THREE.Mesh(geometry, materials["phong-textured"]);

    // Tilt the mesh toward the viewer
    planeta.rotation.x = Math.PI / 5;
    planeta.rotation.y = Math.PI / 5;

    //Pusheo a mi arreglo de planetas para rotacion
    planets.push(planeta);

    x = positionCords[0];
    y = positionCords[1];
    z = positionCords[2];

    grupoPlaneta.add(planeta);
    grupoPlaneta.position.set(x,y,z);

    //Pusheo a mi arreglo de grupos para que roten al sol
    groupObjectArray.push(grupoPlaneta);

    crearLunas(grupoPlaneta, nLunas, lunaTextura, lunaCords, grupoLuna);
    
    sunGroup.add(grupoPlaneta);

    //PLANETA TIERRA FIN

    var orbit = new THREE.Line(
        new THREE.CircleGeometry(positionCords[0], 90),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 1,
          side: THREE.BackSide
        })
      );
    orbit.geometry.vertices.shift();
    orbit.rotation.x = THREE.Math.degToRad(90);
    scene.add(orbit);
    
    sunGroup.add(orbit)


}