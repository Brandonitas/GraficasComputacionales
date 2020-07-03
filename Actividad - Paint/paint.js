let ctx = null;
let canvas = null;
let rectCanvas = null;
let x = null;
let y = null;
let dibujando = null;
let color = null;
let grosor = null;

function main()
{
    canvas = document.getElementById('paintCanvas');
    ctx = canvas.getContext("2d");

    //Sistema de coordenadas del canvas
    rectCanvas = canvas.getBoundingClientRect();

    //Puntos iniciales donde va a empezar a dibujar
    x = 0;
    y = 0;

    //Boolean para saber si el usuario esta dibujando
    dibujando = false;

    //Valores por dafault
    color = 'black';
    grosor = 1;
    
    mouseEvents();

    //Escondemos el menu al inicio para que seleccione opcion
    element = document.querySelector('#options'); 
    element.style.visibility = 'hidden';

}

function mouseEvents()
{

    document.addEventListener('mousedown', (e) =>{
        //Coordenads x y y coincidan las coordenadas del canvas, por eso restamos
        x = e.clientX - rectCanvas.left;
        y = e.clientY - rectCanvas.top;
        dibujando = true;
    })
    
    document.addEventListener('mousemove', (e)=>{
        //Dibujamos 
        if(dibujando == true){
            //Le mandamos las coordenada iniciales y finales (en donde nos encontramos)
            dibujar(x,y, e.clientX - rectCanvas.left, e.clientY - rectCanvas.top);
    
            //Ahora cambiamos nuestro punto inicial 
            x = e.clientX - rectCanvas.left;
            y = e.clientY - rectCanvas.top;
        }
    })
    
    document.addEventListener('mouseup', (e)=>{
        if(dibujando == true){
            //Dibuje la ultima linea donde solte el click
            dibujar(x,y, e.clientX - rectCanvas.left, e.clientY - rectCanvas.top);
    
            //Regresamos valores por default
            x= 0;
            y =0;
            dibujando = false;
        }
    })    

}

function selectColor(c){
    color = c;
}

function selectGrosor(g){
    grosor = g;
}


function dibujar(x1,y1,x2,y2){
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = grosor;
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    ctx.closePath();
}


function cleanCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function paintOptions(displayOpt){
    element = document.querySelector('#options'); 
    paintImg = document.querySelector('#paintImg'); 
    gomaImg = document.querySelector('#gomaImg'); 
    if(displayOpt == true){        
        element.style.visibility = 'visible';
        paintImg.style.background = '#F9E8E5'
        gomaImg.style.background = 'white'
        
    }else{
        element.style.visibility = 'hidden';
        gomaImg.style.background = '#F9E8E5'
        paintImg.style.background = 'white'
        borrando = true;
        color = 'white';
        grosor = 20;
    }
}