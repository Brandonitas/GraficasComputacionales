let ctx = null;
let canvas = null;
let keyPressed = {'w':false, 's':false, 'o':false,'l':false}

class sphere{

    constructor(color,x,y,radius){
        this.color = color;
        this.x = x;
        this.y= y;
        this.radius = radius;

        this.right = true;
        this.up = true;
    }

    draw(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0, Math.PI * 2);
        ctx.fill();
    }

    update(xLimit,yLimit,rec1,rec2){

        //Revisar que las coordenadas no esten dentro de las coordenadas del rec

        if((this.x + this.radius) >= xLimit) this.right = false;
        if((this.x - this.radius)<=0) this.right = true;

        if((this.y + this.radius) >= yLimit) this.up = true;
        if((this.y - this.radius)<=0) this.up = false;

        if(this.right){
            this.x += 1;
        }else{
            this.x -= 1;
        }

        if(this.up){
            this.y -= 1;
        }else{
            this.y += 1;
        }
  
    }

    collide(recX,recY, recWidth, recHeight){
        if(((this.x + this.radius) >= (canvas.width - recWidth)) && 
            this.y <= (recY+recHeight) && this.y >= recY){
                this.right = false;
        }

        if(((this.x - this.radius) <= recWidth) && 
            this.y <= (recY+recHeight) && this.y >= recY){
                this.right = true;
        }    
            
    }

}

class rectangle{
    constructor(color,x,y,width,height,upKey,downKey){
        this.color = color;
        this.x = x;
        this.y= y;
        this.width = width;
        this.height = height    
        this.upKey = upKey;    
        this.downKey = downKey;

        this.limitUp = false;
        this.limitDown = false;

        this.keyEvents();

    }

    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }

    keyEvents(){
        document.addEventListener("keydown", event=>
        {
            if(event.key in keyPressed)
                keyPressed[event.key] = true;

            if(keyPressed[this.upKey]){
                let newY =  this.y - 5;
                if(newY>=5) this.y -= 5;
            }                
            
            if(keyPressed[this.downKey]){
                let newY = this.y + 5;
                if(newY<=(canvas.height-5-this.height)) this.y += 5;
            }
        });

        document.addEventListener('keyup', event =>{
            if(event.key in keyPressed)
                keyPressed[event.key] = false;
        })
    }

}


//Pedimos que se contruya una y otra vez
function update(objects,rec1,rec2){
    //Procesa cuadros y los que ya estan me los vas mandando 
    requestAnimationFrame(()=> update(objects,rec1,rec2));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rec1.draw();
    rec2.draw();

    objects.forEach(object =>{
        object.draw();
        object.update(canvas.width, canvas.height,rec1,rec2);
        object.collide(rec1.x, rec1.y, rec1.width, rec1.height);
        object.collide(rec2.x, rec2.y, rec2.width, rec2.height);
    })
}

function main()
{
    canvas = document.getElementById('ballCanvas');
    ctx = canvas.getContext("2d");
    let ball = new sphere('white',canvas.width/2,canvas.height/2,20);
    //let ball2 = new sphere('white',canvas.width/1.3,canvas.height/1.3,20);
    let rec1 = new rectangle('white', 5,5,15,60,'w','s')
    let rec2 = new rectangle('white', canvas.width-20,5,15,60,'o','l')
 
    update([ball], rec1,rec2);
}

