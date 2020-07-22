var camera, scene, renderer, composer, clock, orbit;
var uniforms, mesh;

let canvas = null;

let duration = 5000; // ms
let currentTime = Date.now();

let groupObjectArray = [];

let planets = [];

let sunGroup = null;

let mercurioGroup = null;
let mercurioLunaGroup = null;

let venusGroup = null;
let venusLunaGroup = null;

let tierraGroup = null;
let tierraLunaGroup = null;

let marteGroup = null;
let marteLunaGroup = null;

let jupiterGroup = null;
let jupiterLunaGroup = null;

let saturnoGroup = null;
let saturnoLunaGroup = null;

let uranoGroup = null;
let uranoLunaGroup = null;

let neptunoGroup = null;
let neptunoLunaGroup = null;

let cinturonGroup = null;

function animate() 
{
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 1 * fract;

    for(object of planets){
        object.rotation.y += angle;
    }

    for(object of groupObjectArray){
        object.rotation.y -= angle / 8;
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

    //Add image as a background
    const loader = new THREE.TextureLoader();
    loader.load('./texturas/galaxy.jpg' , function(texture)
            {
             scene.background = texture;  
    });

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, .1, 4000 );
    
    //Change camara position
    camera.position.z = 10;
    camera.position.x = 10;
    camera.position.y = 10;

    scene.add(camera);

    //Add orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 1;

    // Add a point light to show off the objects
    let light = new THREE.PointLight( 0xffffff, 1.0);

    // Position the light in the sun
    light.position.set(0, 0, 0);
    scene.add(light);

    // Create a group to hold all the objects
    sunGroup = new THREE.Object3D;
    clock = new THREE.Clock();
    var textureLoader = new THREE.TextureLoader();
    uniforms = {
        "fogDensity": { value: 0.45 },
        "fogColor": { value: new THREE.Vector3( 0, 0, 0 ) },
        "time": { value: 1.0 },
        "uvScale": { value: new THREE.Vector2( 2.0, 1 ) },
        "texture1": { value: textureLoader.load( './texturas/cloud.png' ) },
        "texture2": { value: textureLoader.load( './texturas/lavatile.jpg' ) }
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
    
    //Add sun to planet array
    planets.push(mesh);

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

    jupiterGroup = new THREE.Object3D;
    jupiterLunaGroup = new THREE.Object3D;

    saturnoGroup = new THREE.Object3D;
    saturnoLunaGroup = new THREE.Object3D;

    uranoGroup = new THREE.Object3D;
    uranoLunaGroup = new THREE.Object3D;

    neptunoGroup = new THREE.Object3D;
    neptunoLunaGroup = new THREE.Object3D;

    cinturonGroup = new THREE.Object3D;

    crearPlaneta('mercurio','/mercurymap.jpg','/mercurybump.jpg',[.2, 15, 20],[2,0,0], mercurioGroup, 1, 'luna1.jpg',[.05, 10, 20],mercurioLunaGroup, 180);
    crearPlaneta('venus','/venusmap.jpg','/venusbump.jpg',[.3, 15, 20],[-4,0,0], venusGroup, 1, 'luna2.jpg',[.05, 10, 20],venusLunaGroup, 130);
    crearPlaneta('tierra','/earthmap.jpg','/earthbump.jpg',[.35, 15, 20],[6,0,0], tierraGroup, 1, 'lunaTierra.jpg',[.05, 10, 20],tierraLunaGroup, 40);
    crearPlaneta('marte','/marsmap.jpg','/marsbump.jpg',[.3, 15, 20],[-8,0,0], marteGroup, 2, 'luna3.jpg',[.05, 10, 20],marteLunaGroup, 210);

    crearCinturon('cinturon','/cinturonmap.jpg','',[.05, 15, 20],[10,0,0], cinturonGroup);

    crearPlaneta('jupiter','/jupitermap.png','/jupiterbump.png',[1, 15, 20],[12,0,0], jupiterGroup, 10, 'luna4.jpg',[.05, 10, 20],jupiterLunaGroup,320);
    crearPlaneta('saturno','/saturnomap.jpg','',[.8, 15, 20],[-14,0,0], saturnoGroup, 10, 'luna1.jpg',[.05, 10, 20],saturnoLunaGroup,130);
    crearPlaneta('urano','/uranusmap.jpg','',[.7, 15, 20],[16,0,0], uranoGroup, 10, 'luna2.jpg',[.05, 10, 20],uranoLunaGroup,80);
    crearPlaneta('neptuno','/neptunomap.jpg','',[.8, 15, 20],[-18,0,0], neptunoGroup, 10, 'luna3.jpg',[.05, 10, 20],neptunoLunaGroup,0);

    groupObjectArray.push(sunGroup);

    scene.add( sunGroup );
    
}

function crearPlaneta(planetaName, textura, bump, geometryCords, positionCords, grupoPlaneta, nLunas, lunaTextura, lunaSize, grupoLuna, angulo){
    let mapUrl = "./texturas/"+planetaName+textura;
    let bumpMapUrl = "./texturas/"+planetaName+bump;

    let materials = {};

    let textureMap = new THREE.TextureLoader().load(mapUrl);
    let bumpMap = new THREE.TextureLoader().load(bumpMapUrl);

    materials["phong-textured"] = new THREE.MeshPhongMaterial({ map: textureMap, bumpMap: bumpMap, bumpScale: 0.01 });

    // Create the planet geometry
    let geometry = new THREE.SphereGeometry( geometryCords[0], geometryCords[1], [geometryCords[2]] );

    // And put the geometry and material together into a mesh
    let planeta = new THREE.Mesh(geometry, materials["phong-textured"]);

    // Rotation to planet
    planeta.rotation.x = Math.PI / 5;
    planeta.rotation.y = Math.PI / 5;

    //Push array to array of planets
    planets.push(planeta);

    //Get the coords according to the angle given
    x = positionCords[0] * Math.cos(angulo)
    y = 0; 
    z = positionCords[0] * Math.sin(angulo)

    grupoPlaneta.add(planeta);
    grupoPlaneta.position.set(x,y,z);

    //Push array of grupPlanet to spin around the sun
    groupObjectArray.push(grupoPlaneta);

    crearLunas(planetaName,grupoPlaneta, nLunas, lunaTextura, lunaSize, grupoLuna);
    
    sunGroup.add(grupoPlaneta);

    //Make rings
    if(planetaName == 'saturno' || planetaName == 'urano'){
        crearAnillo(planetaName, positionCords, grupoPlaneta, angulo);
    }

    //Create orbit
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
    sunGroup.add(orbit);
}


function crearAnillo(planetaName, positionCords, grupoPlaneta, angulo){

    let mapUrl = "./texturas/"+planetaName+"anillo.jpg";
    let textureMap = new THREE.TextureLoader().load(mapUrl);
    let geometry = new THREE.RingGeometry( 1, 1.5, 32 );
    let material = new THREE.MeshBasicMaterial( { map: textureMap, side: THREE.DoubleSide } );
    let anillo = new THREE.Mesh( geometry, material);
    
    // Tilt the mesh toward the viewer
    anillo.rotation.x = Math.PI / 5;
    anillo.rotation.y = Math.PI / 5;
  
    //Pusheo a mi arreglo de planetas para rotacion
    planets.push(anillo);
  
    x = positionCords[0] * Math.cos(angulo)
    y = 0; 
    z = positionCords[0] * Math.sin(angulo)
  
    grupoPlaneta.add(anillo);
    grupoPlaneta.position.set(x,y,z);
  
    //Pusheo a mi arreglo de grupos para que roten al sol
    groupObjectArray.push(grupoPlaneta);
      
    sunGroup.add(grupoPlaneta);

}

function crearLunas(planetaName,planetGroup, nLunas, lunaTextura, lunaSize, grupoLuna){

    while(nLunas>0){
        let textureUrl = "./texturas/lunas/"+lunaTextura;
        let texture = new THREE.TextureLoader().load(textureUrl);
        let material = new THREE.MeshPhongMaterial({ map: texture });

        // Create the moon geometry
        let geometry = new THREE.SphereGeometry(lunaSize[0],lunaSize[1],lunaSize[2]);

        // And put the geometry and material together into a mesh
        let luna = new THREE.Mesh(geometry, material);

        luna.rotation.x = Math.PI / 5;
        luna.rotation.y = Math.PI / 5;

        planets.push(luna);

        x = 0
        y = 0
        z = 0
     
        //Chance the random position in big planets
        if(planetaName == 'jupiter' || planetaName == 'saturno' || planetaName == 'urano' || planetaName == 'neptuno'){

            //Metodo random genera decimanales entre 0 y .5
            lunax = Number.random(.5, 1, 2);
            lunay = Number.random(-2, 2, 2);
            lunaz = Number.random(.5, 1, 2);
            luna.position.set(lunax, lunay, lunaz);

        }else{

            //Metodo random genera decimanales entre 0 y .5
            lunax = Number.random(.3, .5, 2);
            lunay = Number.random(-.3, .5, 2);
            lunaz = Number.random(.3, .5, 2);
            luna.position.set(lunax, lunay, lunaz);

        }

        grupoLuna.add(luna);
        grupoLuna.position.set(x,y,z);

        //Pusheo a mi arreglo de grupos para que roten al sol
        groupObjectArray.push(grupoLuna);

        planetGroup.add(grupoLuna);

        nLunas--;
    }
}


function crearCinturon(planetaName, textura, bump, geometryCords, positionCords, grupoPlaneta){

    let mapUrl = "./texturas/"+planetaName+textura;
    let bumpMapUrl = "./texturas/"+planetaName+bump;

    let materials = {};

    let textureMap = new THREE.TextureLoader().load(mapUrl);
    let bumpMap = new THREE.TextureLoader().load(bumpMapUrl);

    materials["phong-textured"] = new THREE.MeshPhongMaterial({ map: textureMap, bumpMap: bumpMap, bumpScale: 0.01 });

    let geometry = new THREE.SphereGeometry( geometryCords[0], geometryCords[1], [geometryCords[2]] );

        for(let i = 0;i<720;i++){        
            let planeta = new THREE.Mesh(geometry, materials["phong-textured"]);
            planets.push(planeta);   
            x = positionCords[0] * Math.cos(i) + Number.random(-3, 3, 0);
            y = Number.random(-.3, .3, 2); 
            z = positionCords[0] * Math.sin(i)
            planeta.position.set(x,y,z);
            grupoPlaneta.add(planeta);
        }
        
    groupObjectArray.push(grupoPlaneta);
    sunGroup.add(grupoPlaneta);

}

Number.random = function(minimum, maximum, precision) {
    minimum = minimum === undefined ? 0 : minimum;
    maximum = maximum === undefined ? 9007199254740992 : maximum;
    precision = precision === undefined ? 0 : precision;

    var random = Math.random() * (maximum - minimum) + minimum;

    return random.toFixed(precision);
}
