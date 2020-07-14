let projectionMatrix = null, shaderProgram = null;
let shaderVertexPositionAttribute = null, shaderVertexColorAttribute = null, shaderProjectionMatrixUniform = null, shaderModelViewMatrixUniform = null;
let mat4 = glMatrix.mat4;
let duration = 5000; // ms

let vertexShaderSource = `
attribute vec3 vertexPos;
attribute vec4 vertexColor;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec4 vColor;

void main(void) {
    // Return the transformed and projected vertex value
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
    // Output the vertexColor in vColor
    vColor = vertexColor;
}`;

let fragmentShaderSource = `
    precision lowp float;
    varying vec4 vColor;

    void main(void) {
    // Return the pixel color: always output white
    gl_FragColor = vColor;
}
`;

function createShader(gl, str, type)
{
    let shader;
    if (type == "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShader(gl)
{
    // load and compile the fragment and vertex shader
    let fragmentShader = createShader(gl, fragmentShaderSource, "fragment");
    let vertexShader = createShader(gl, vertexShaderSource, "vertex");

    // link them together into a new program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // get pointers to the shader params
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(shaderVertexColorAttribute);
    
    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
}

function initWebGL(canvas) 
{
    let gl = null;
    let msg = "Your browser does not support WebGL, or it is not enabled by default.";

    try 
    {
        gl = canvas.getContext("experimental-webgl");
    } 
    catch (e)
    {
        msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl)
    {
        alert(msg);
        throw new Error(msg);
    }

    return gl;        
}

function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initGL(gl, canvas)
{
     // Create a project matrix with 45 degree field of view
     projectionMatrix = mat4.create();
    
     mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);
     mat4.translate(projectionMatrix, projectionMatrix, [0, 0, -1]);
}

function draw(gl, objs) 
{
    // clear the background (with black)
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // set the shader to use
    gl.useProgram(shaderProgram);

    for(obj of objs)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
        gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
        gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

        gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelViewMatrix);

        gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
    }
}


function update(glCtx, objs)
{
    requestAnimationFrame(()=>update(glCtx, objs));

    draw(glCtx, objs);
    for(i = 0; i<objs.length; i++)
    objs[i].update();
}

function createTriangle(gl, translation)
{
 
    console.log("verts",verts)
    console.log("colors",faceColors)

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];

    //Tenemos 5 vertices por cara
    faceColors.forEach(color =>{
        for (let j=0; j < 3; j++)
            vertexColors.push(...color);
    });
    
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let triangleIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleIndexBuffer);

    let triangleIndices = [];
    for(let i = 0;i<faceColors.length*3;i++){
        triangleIndices.push(i);        
    }
    
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangleIndices), gl.STATIC_DRAW);
    
    let triangle = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:triangleIndexBuffer,
            vertSize:3, nVerts:verts.length/3, colorSize:4, nColors: vertexColors.length / 3, nIndices: triangleIndices.length,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
        };

    mat4.translate(triangle.modelViewMatrix, triangle.modelViewMatrix, translation);

    triangle.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;

        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, [0, 1, 0]);
        
    };
    
    return triangle;
}

function main()
{
    let canvas = document.getElementById("pyramidCanvas");
    let glCtx = initWebGL(canvas);

    initViewport(glCtx, canvas);
    initGL(glCtx, canvas);

    createVerts(0, 1.4, 0, -1, -1, 1, 1, -1, 1, 4,glCtx);
    //createVerts(0, 1.4, 0, -1, -1, 0, 1, -1, 0, 3,glCtx);

    
    let triangle = createTriangle(glCtx,  [0, 0, -4]);
    
    initShader(glCtx, vertexShaderSource, fragmentShaderSource);
    
    update(glCtx, [triangle]);
    
}

let verts = [];
let obj = [];
let faceColors = [];

function createVerts(x3,y3,z3,x1,y1,z1,x2,y2,z2,subdivision,glCtx){

    if(subdivision == 1){ 
        verts.push(x1,y1,z1,x2,y2,z2,x3,y3,z3);   
        faceColors.push([Math.random(),Math.random(),Math.random(),Math.random()]);

    } else if(subdivision > 1) {
       
        let mx12 = (x1+x2) /2
        let my12 = (y1+y2) /2
        let mz12 = (z1+z2) /2

        let mx23 = (x2+x3) /2
        let my23 = (y2+y3) /2
        let mz23 = (z2+z3) /2

        let mx13 = (x1+x3) /2
        let my13 = (y1+y3) /2
        let mz13 = (z1+z3) /2

        createVerts(x1,y1,z1,mx12,my12,mz12,mx13,my13,mz13,subdivision-1,glCtx);
        createVerts(mx12,my12,mz12,x2,y2,z2,mx23,my23,mz23,subdivision-1,glCtx);
        createVerts(mx13,my13,mz13,mx23,my23,mz23,x3,y3,z3,subdivision-1,glCtx);
        
    }
    
}
