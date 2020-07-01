function main()
{
    sliderEvent();
    //Dibujamos el triangulo inicial al momento de cargar la página
    drawTriangleOne(0, 0, 550, 1); 
    drawTriangleTwo(0, 550, 550, 1);  
    
}

function sliderEvent()
{
    document.getElementById("slider").oninput = function(event) {
        //Definimos nuestro size del triangulo y la coordenada de inicio x,y
        var size = 550;
        var x = 0;
        var y = 0;
        var subdivision = event.target.value;
        document.getElementById("sliderValue").innerHTML = "Subdivisions: " + event.target.value;
        cleanTriangle("htmlCanvas");
        drawTriangleOne(x, y, size, subdivision);
    };

    document.getElementById("slider-2").oninput = function(event) {
        //Definimos nuestro size del triangulo y la coordenada de inicio x,y
        var size = 550;
        var x = 0;
        var y = 550;
        var subdivision = event.target.value;
        document.getElementById("sliderValue-2").innerHTML = "Subdivisions: " + event.target.value;
        cleanTriangle("htmlCanvas-2");
        drawTriangleTwo(x, y, size, subdivision);
    };
}

//Limpiamos canvas
function cleanTriangle(canvasId){
    let canvas = document.getElementById(canvasId);
    let ctx = canvas.getContext("2d");
   	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//Dibujamos los triangulos de manera recursiva
function drawTriangleOne(x, y, size, subdivision) {
    let canvas = document.getElementById("htmlCanvas");
    let ctx = canvas.getContext("2d");
	
	// caso base cuando: subdivision = 1 y tiene 0 triangulos dentro
    if(subdivision == 1){ 
    	ctx.fillStyle = 'rgba(117, 175, 234, 1.0)';
        ctx.beginPath();
        // Nos colocamos en el punto x,y y dibujamos la linea horizontal del top
		ctx.moveTo(x, y);
		ctx.lineTo(x + size, y);
		// Dibujamos la diagonal izquierda
		ctx.lineTo(x + (size/2), y + size);
        //Cerramos el path y rellenamos 
        ctx.closePath();
		ctx.fill();
    } else if(subdivision > 1) {
        //Mandamos nuevos valores con nuevas coordenadas y nuevos tamanos 
        //Triangulo de la izquierda
        drawTriangleOne(x, y, size/2, subdivision-1);
        //Triangulo de la derecha
        drawTriangleOne(x + (size/2), y, size/2, subdivision-1);
        //Triangulo del centro
        drawTriangleOne(x + (size/4), y + size/2, size/2, subdivision-1);
    }
}

//Dibujamos los triangulos de manera recursiva
function drawTriangleTwo(x, y, size, subdivision) {
    let canvas = document.getElementById("htmlCanvas-2");
    let ctx = canvas.getContext("2d");
	
    // caso base cuando: subdivision = 1 y tiene 0 triangulos dentro
    if(subdivision == 1){ 
    	ctx.fillStyle = 'rgba(117, 175, 234, 1.0)';
        ctx.beginPath();
        // Nos colocamos en el punto x,y y dibujamos la linea horizontal del bottom
        ctx.moveTo(x, y);
		ctx.lineTo(x+size, y);
		// Diagonal izquierda 
		ctx.lineTo(x + (size/2), y - size);
        //Cerramos el path y rellenamos 
        ctx.closePath();
        ctx.fill();
    
    } else if(subdivision > 1) {
        //Mandamos nuevos valores con nuevas coordenadas y nuevos tamanos
        //Triangulo de la izquierda 
        drawTriangleTwo(x, y, size/2, subdivision-1);
        //Triangulo de la derecha
        drawTriangleTwo(x + (size/2), y, size/2, subdivision-1);
        //Triangulo del centro
        drawTriangleTwo(x + (size/4), y - size/2, size/2, subdivision-1);
    }
}
