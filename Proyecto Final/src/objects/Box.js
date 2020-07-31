import  BoxCreator from "./BoxCreator.js";
import generateColor from "../helpers/generateColors.js";
import Observer, { EVENTS } from "../Observer.js";

export default class Box extends BoxCreator {
    //Last es el ultimo cubo que se puso
    constructor({width, height, last, boxesLenght}){
        super({width, height, color: generateColor()})
        this.last = last;

        //Para ir aumentando la velocidad
        this.boxesLenght = boxesLenght;

        //Modificamos la posicion del cubo para amonotonar
        //Last.position.y es la ultima posicion central
        //last.geometry.parameters.height/2 le sumamos su mitad para posicionarlo encima del cubo
        this.position.y = last.position.y + last.geometry.parameters.height / 2 + this.geometry.parameters.height / 2;

        //Posicion maxima que se va a estar moviendo de derecha a izquierda el bloque
        this.max_position = 360;
        this.is_stopped = false;
        //Punto inicial
        this.direction = 1;
        this.speed = 4 + boxesLenght/2;
        this.actual = last.axis;
        this.actual_axis = (Math.random() >= 0.5) ? 'x' : 'z';
        this.contray_axys = (this.actual_axis === 'x') ? 'z' : 'x';

        //Posicion inicial un poco atras del cubo
        this.position[this.actual_axis] -= this.max_position * this.direction; 
        this.position[this.contray_axys] = last.position[this.contray_axys];

    }

    //Cuando hacemos click que se posicione cubo
    place(){
        //Necesito saber si voy a modificar mi ancho o alto
        const plane = (this.actual_axis === 'x') ? 'width' : 'height';
        
        //Valor de corte
        //A la posicion actual le restamos la posicion del pasado  
        //Cuando el corte es perfecto la distance_center es 0
        const distance_center = this.position[this.actual_axis] - this.last.position[this.actual_axis];
        console.log("DISTANCE CENTER", distance_center)
        
        //Overlay es cuando el cubo esta encima del otro se obtiene el valor de corte
        //Si es positivo se obtiene el valor de la base que se va a quedar
        //Esa base se resta al cubo que esta para obtener el sobrante 
        const overlay = this.last.dimension[plane] - Math.abs(distance_center);
        console.log("OVERLAY", overlay)
        //Si el overlay es negativo quiere decir que se salio de la dimension del cubo de abajo
        if(overlay > 0){
            //Obtenemos el cubo de abajo y le restamos el overlay que es el sobrante que se va a borrar
            const cut = this.last.dimension[plane] - overlay;
            
            //Se genera nuevo cubo
            const new_box = {
                //Base es el cubo que se mantiene
                base:{
                    //Si se esta trabajando en width se queda el overlay
                    //Si se esta moviendo por heigth no se necestia cortar el width
                    width: (plane === 'width') ? overlay : this.dimension.width,
                    height: (plane === 'height') ? overlay : this.dimension.height,
                },
                cut:{
                    //Si se esta trabajando en width se queda el overlay
                    //Si se esta moviendo por heigth no se necestia cortar el width
                    width: (plane === 'width') ? cut : this.dimension.width,
                    height: (plane === 'height') ? cut : this.dimension.height,
                },
                color: this.color,
                axis: this.actual_axis,
                last_position: this.position,
                //Para saber si lo corta en sentido positivo o negativo
                //1 positivo, -1 negativo
                //en caso de que de 0 regresa 1
                direction: distance_center/Math.abs(distance_center) | 1
            }

            Observer.emit(EVENTS.STACK,new_box);
            

        }else{
            Observer.emit(EVENTS.GAME_OVER);
        }
    }

    update(){
        if(!this.is_stopped){
            this.position[this.actual_axis]+= this.direction * this.speed;
            if(Math.abs(this.position[this.actual_axis])>= this.max_position){
                //cambio movimiento
                this.direction *= -1;
            }
        }
    }

}
