let mat4 = glMatrix.mat4;

let projectionMatrix;

let shaderProgram, shaderVertexPositionAttribute, shaderVertexColorAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

let duration = 5000; // ms

// Attributes: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These do not change values from vertex to vertex.
// Varyings: Used for passing data from the vertex shader to the fragment shader. Represent information for which the shader can output different value for each vertex.
let vertexShaderSource =    
    "    attribute vec3 vertexPos;\n" +
    "    attribute vec4 vertexColor;\n" +
    "    uniform mat4 modelViewMatrix;\n" +
    "    uniform mat4 projectionMatrix;\n" +
    "    varying vec4 vColor;\n" +
    "    void main(void) {\n" +
    "		// Return the transformed and projected vertex value\n" +
    "        gl_Position = projectionMatrix * modelViewMatrix * \n" +
    "            vec4(vertexPos, 1.0);\n" +
    "        // Output the vertexColor in vColor\n" +
    "        vColor = vertexColor;\n" +
    "    }\n";

// precision lowp float
// This determines how much precision the GPU uses when calculating floats. The use of highp depends on the system.
// - highp for vertex positions,
// - mediump for texture coordinates,
// - lowp for colors.
let fragmentShaderSource = 
    "    precision lowp float;\n" +
    "    varying vec4 vColor;\n" +
    "    void main(void) {\n" +
    "    gl_FragColor = vColor;\n" +
    "}\n";

function initWebGL(canvas)
{
    let gl = null;
    let msg = "Your browser does not support WebGL, " +
        "or it is not enabled by default.";
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

function initGL(canvas)
{
    // Create a project matrix with 45 degree field of view
    projectionMatrix = mat4.create();
    
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);
    mat4.translate(projectionMatrix, projectionMatrix, [0, 0, -5]);
}

// Create the vertex, color and index data for a multi-colored cube
function createPyramid(gl, translation, rotationAxis)
{    
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
        // Bottom 
        -1.0, 0.0 , 0.0,    //0
        -0.5, 0.0 , 0.5,    //1
        0.0, 0.0 , -1.0,    //2

        -0.5, 0.0 , 0.5,    //3
        0.5, 0.0 , 0.5,     //4
        0.0, 0.0 , -1.0,    //5

         0.5, 0.0 , 0.5,    //6
         1.0, 0.0 , 0.0,    //7
         0.0, 0.0 , -1.0,   //8

        // 1er Cara
        -1.0, 0.0, 0.0,     //9
        -0.5, 0.0 , 0.5,    //10
        // Punta
         0.0, 2.0, 0.0,     //11

        // 2nda Cara
        -0.5, 0.0 , 0.5,    //12
        0.5, 0.0 , 0.5,     //13
        // Punta
        0.0, 2.0, 0.0,      //14

        // 3er Cara
        0.5, 0.0 , 0.5,     //15
        1.0, 0.0, 0.0,      //16
        // Punta
        0.0, 2.0, 0.0,      //17

        // 4ta Cara
        1.0, 0.0, 0.0,      //18
        0.0, 0.0, -1.0,     //19
        // Punta
        0.0, 2.0, 0.0,      //20

        // 5ta Cara
        0.0, 0.0, -1.0,     //21
        -1.0, 0.0 , 0.0,    //22
        // Punta
        0.0, 2,0, 0.0,      //23


    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    let faceColors = [
        [0.0, 1.0, 1.0, 1.0], //Bottom
        [0.0, 1.0, 1.0, 1.0], //Bottom
        [0.0, 1.0, 1.0, 1.0], //Bottom
        [1.0, 0.0, 0.0, 1.0], // 1st face
        [0.0, 1.0, 0.0, 1.0], // 2nd face
        [0.0, 0.0, 1.0, 1.0], // 3rd face
        [1.0, 0.0, 1.0, 1.0], // 4th face
        [0.0, 1.0, 1.0, 1.0]  // 5th face
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];
    // for (const color of faceColors) 
    // {
    //     for (let j=0; j < 4; j++)
    //         vertexColors.push(...color);
    // }
    faceColors.forEach(color =>{
        for (let j=0; j < 3; j++)
            vertexColors.push(...color);
    });

    console.log("COLOR", vertexColors);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let pyramidIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pyramidIndexBuffer);

    let pyramidIndices = [
        //bottom
        0, 1, 2,
        3, 4, 5,
        6, 7, 8,

        // 1er
        9, 10, 11,
        // 2nda
        12, 13, 14,
        // 3era
        15, 16 , 17,
        // 4ta
        18, 19, 20,
        // 5ta
        21, 22, 23
        
     ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(pyramidIndices), gl.STATIC_DRAW);
    
    //nVerts y nColors tienen que coincidir 6 caras x 4 vertices 
    //nIndices 6 caras *2 triangulos *3 vertices 
    //mat4.create() cada objeto tiene su propia matriz de transformacion 
    let pyramid = {
            buffer:vertexBuffer, colorBuffer:colorBuffer, indices:pyramidIndexBuffer,
            vertSize:3, nVerts:24, colorSize:4, nColors: 24, nIndices:pyramidIndices.length,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()};

    mat4.translate(pyramid.modelViewMatrix, pyramid.modelViewMatrix, translation);

    //Se llama cada vuelta del reqanimationFrame
    //deltat intervalos de tiempo en cada frame. Tiempo en que se tardo en procesar cada frame
    pyramid.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
    
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };
    
    return pyramid;
}

function createOctaedro(gl, translation, rotationAxis)
{    
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    const verts = [
        //SUPERIOR
        //Cara izquierda
        -0.5, 0.0, 0.5, 	//0
        -0.5, 0.0, -0.5,    //1
        0.0, 1.0, 0.0,      //2

        //Cara trasera
        -0.5, 0.0, -0.5,    //3
        0.5, 0.0, -0.5,     //4
        0.0, 1.0, 0.0,      //5

        //Cara derecha
        0.5, 0.0, -0.5,     //6
        0.5, 0.0, 0.5,      //7
        0.0, 1.0, 0.0,      //8

        //Cara frontal
        0.5, 0.0, 0.5,      //9
        -0.5, 0.0, 0.5,     //10
        0.0, 1.0, 0.0,      //11


        //INFERIOR
        //Cara izquierda
        -0.5, 0.0, 0.5, 	//12
        -0.5, 0.0, -0.5,    //13
        0.0, -1.0, 0.0,     //14

        //Cara trasera
        -0.5, 0.0, -0.5,    //15
        0.5, 0.0, -0.5,     //16
        0.0, -1.0, 0.0,     //17

        //Cara derecha
        0.5, 0.0, -0.5,     //18
        0.5, 0.0, 0.5,      //19
        0.0, -1.0, 0.0,     //20

        //Cara frontal
        0.5, 0.0, 0.5,      //21
        -0.5, 0.0, 0.5,     //22
        0.0, -1.0, 0.0,     //23
        

	];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    let faceColors = [
        [1.0, 0.0, 0.0, 1.0], // 1st face
        [0.0, 1.0, 0.0, 1.0], // 2nd face
        [0.0, 0.0, 1.0, 1.0], // 3rd face
        [1.0, 0.0, 1.0, 1.0], // 4th face
        [0.0, 1.0, 1.0, 1.0], // 5th face
        [1.0, 0.0, 0.0, 1.0], // 6st face
        [0.0, 1.0, 0.0, 1.0], // 7nd face
        [0.0, 0.0, 1.0, 1.0], // 8rd face
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];

    faceColors.forEach(color =>{
        for (let j=0; j < 3; j++)
            vertexColors.push(...color);
    });

    console.log("COLOR", vertexColors);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let octaedroIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, octaedroIndexBuffer);

    let octaedroIndices = [
        0, 1, 2,	
        3, 4, 5,	
        6, 7, 8,
        9, 10, 11,	
        12, 13, 14,	
        15, 16, 17,
        18, 19, 20,	
        21, 22, 23
	];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(octaedroIndices), gl.STATIC_DRAW);
    
    //nVerts y nColors tienen que coincidir 6 caras x 4 vertices 
    //nIndices 6 caras *2 triangulos *3 vertices 
    //mat4.create() cada objeto tiene su propia matriz de transformacion 
    let octaedro = {
            buffer:vertexBuffer, colorBuffer:colorBuffer, indices:octaedroIndexBuffer,
            vertSize:3, nVerts:24, colorSize:4, nColors: 24, nIndices:octaedroIndices.length,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()};

    mat4.translate(octaedro.modelViewMatrix, octaedro.modelViewMatrix, translation);    

    let top = false;
    let bottom = true;

    octaedro.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;

        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);

        if(bottom == true){
            mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0, .01,0])
            
            if(this.modelViewMatrix[13]>1.85){
                bottom  = false;
                top = true;
            }
        }

        if(top == true){
            mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0,-.01,0])

            if(this.modelViewMatrix[13]<-1.85){
                bottom  = true;
                top = false;
            }
        }
        
    };
    
    return octaedro;
}


function createDodecaedro(gl, translation, rotationAxis, rotationAxis2)
{    
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //Variables que se necesitan para calcular los puntos
    const t = ( 1 + Math.sqrt( 5 ) ) / 2;
    const r = 1 / t;
    
        const verts = [
            //Los puntos se pueden ver de una mejor manera abriendo el archivo dodecaedro.ggb en https://www.geogebra.org/3d
            //A, Q, S, B, M
            - 1, - 1, - 1,  //0
            - t, 0, - r,    //1
            - t, 0, r,      //2
            - 1, - 1, 1,    //3
            - r, - t, 0,    //4

            //C, N, D, S, Q
            - 1, 1, - 1,    //5
            - r, t, 0,      //6
            - 1, 1, 1,      //7
            - t, 0, r,      //8
            - t, 0, - r,    //9

            //N, P, H, L , D
            - r, t, 0,      //10
            r, t, 0,        //11
            1, 1, 1,        //12
            0, r, t,        //13
            - 1, 1, 1,      //14

            //K, G, P, N, C
            0, r, - t,      //15
            1, 1, - 1,      //16
            r, t, 0,        //17
            - r, t, 0,      //18
            - 1, 1, - 1,    //19

            //G, R, T, H, P 
            1, 1, - 1,      //20
            t, 0, - r,      //21
            t, 0, r,        //22
            1, 1, 1,        //23
            r, t, 0,        //24

            //H, T, F, J, L
            1, 1, 1,        //25
            t, 0, r,        //26
            1, - 1, 1,      //27
            0, - r, t,      //28
            0, r, t,        //29

            //K, I, R, S, G
            0, r, - t,      //30
            0, - r, - t,    //31
            t, 0, - r,      //32
            - t, 0, r,      //33
            1, 1, - 1,      //34

            //I, K, C, Q, A
            0, - r, - t,    //35
            0, r, - t,      //36
            - 1, 1, - 1,    //37
            - t, 0, - r,    //38
            - 1, - 1, - 1,  //39

            //B, S, D, L, J
            - 1, - 1, 1,    //40
            - t, 0, r,      //41
            - 1, 1, 1,      //42
            0, r, t,        //43
            0, - r, t,      //44

            //E, I, A, M, O
            1, - 1, - 1,    //45
            0, - r, - t,    //46
            - 1, - 1, - 1,  //47
            - r, - t, 0,    //48
            r, - t, 0,      //49

            //K, I, E, R, G
            0, r, - t,      //50
            0, - r, - t,    //51
            1, - 1, - 1,    //52
            t, 0, - r,      //53
            1, 1, - 1,      //54

            //R, E, O, F, T
            t, 0, - r,      //55
            1, - 1, - 1,    //56
            r, - t, 0,      //57
            1, - 1, 1,      //58
            t, 0, r         //59


           /* 
            //Algorimo obtenido de https://en.wikipedia.org/wiki/Regular_dodecahedron#Cartesian_coordinates
            
            //Base de un cubo
            // (±1, ±1, ±1)
            - 1, - 1, - 1,	//0 A
            - 1, - 1, 1,    //1 B 
            - 1, 1, - 1,    //2 C
            - 1, 1, 1,      //3 D
            1, - 1, - 1,    //4 E
            1, - 1, 1,      //5 F
            1, 1, - 1,      //6 G
            1, 1, 1,        //7 H
    
            // (0, ±1/φ, ±φ)
             0, - r, - t,   //8 I
             0, - r, t,     //9 J
             0, r, - t,     //10 K
             0, r, t,       //11 L
    
            // (±1/φ, ±φ, 0)
            - r, - t, 0,    //12 M
            - r, t, 0,      //13 N
             r, - t, 0,     //14 O 
             r, t, 0,       //15 P
    
            // (±φ, 0, ±1/φ)
            - t, 0, - r,    //16 Q
            t, 0, - r,      //17 R
            - t, 0, r,      //19 S
            t, 0, r         //19 T*/
        ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    let faceColors = [
        [1.0, 0.0, 0.0, 1.0], // 1st face
        [0.0, 1.0, 0.0, 1.0], // 2nd face
        [0.0, 0.0, 1.0, 1.0], // 3rd face
        [1.0, 0.0, 1.0, 1.0], // 4th face
        [0.0, 1.0, 1.0, 1.0], // 5th face
        [1.0, 0.0, 0.0, 1.0], // 6st face
        [0.0, 1.0, 0.0, 1.0], // 7nd face
        [0.0, 0.0, 1.0, 1.0], // 8rd face
        [1.0, 0.0, 0.0, 1.0], // 9st face
        [0.0, 1.0, 0.0, 1.0], // 10nd face
        [0.0, 0.0, 1.0, 1.0], // 11rd face
        [1.0, 0.0, 1.0, 1.0]  // 12th face
     
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];

    faceColors.forEach(color =>{
        for (let j=0; j < 5; j++)
            vertexColors.push(...color);
    });

    console.log("COLOR", vertexColors);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let dodecaedroIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, dodecaedroIndexBuffer);

    let dodecaedroIndices = [ 
        0,1,2,3,4,
        5,6,7,8,9,
        10,11,12,13,14,
        15,16,17,18,19,
        20,21,22,23,24,
        25,26,27,28,29,
        30,31,32,33,34,
        35,36,37,38,39,
        40,41,42,43,44,
        45,46,47,48,49,
        50,51,52,53,54,
        55,56,57,58,59
    ];
    
    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(dodecaedroIndices), gl.STATIC_DRAW);
    
    //nVerts y nColors tienen que coincidir 6 caras x 4 vertices 
    //nIndices 6 caras *2 triangulos *3 vertices 
    //mat4.create() cada objeto tiene su propia matriz de transformacion 
    let dodecaedro = {
            buffer:vertexBuffer, colorBuffer:colorBuffer, indices:dodecaedroIndexBuffer,
            vertSize:3, nVerts:60, colorSize:4, nColors: 60, nIndices:dodecaedroIndices.length,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()};

    mat4.translate(dodecaedro.modelViewMatrix, dodecaedro.modelViewMatrix, translation);    

    dodecaedro.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;

        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis2);
        
    };
    
    return dodecaedro;
}


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

function draw(gl, objs) 
{
    // clear the background (with black)
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);

    // set the shader to use
    gl.useProgram(shaderProgram);

    for(i = 0; i< objs.length; i++)
    {
        obj = objs[i];
        // connect up the shader parameters: vertex position, color and projection/model matrices
        // set up the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
        gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
        gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

        gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelViewMatrix);

        // Draw the object's primitives using indexed buffer information.
        // void gl.drawElements(mode, count, type, offset);
        // mode: A GLenum specifying the type primitive to render.
        // count: A GLsizei specifying the number of elements to be rendered.
        // type: A GLenum specifying the type of the values in the element array buffer.
        // offset: A GLintptr specifying an offset in the element array buffer.
        gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
    }
}

function run(gl, objs) 
{
    // The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.
    requestAnimationFrame(function() { run(gl, objs); });

    draw(gl, objs);

    for(i = 0; i<objs.length; i++)
        objs[i].update();
}
