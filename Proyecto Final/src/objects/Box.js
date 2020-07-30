import  BoxCreator from "./BoxCreator.js";
import generateColor from "../helpers/generateColors.js";
import Observer, { EVENTS } from "../Observer.js";

export default class Box extends BoxCreator {
    //Last es el ultimo cubo que se puso
    constructor({width, height, last}){
        super({width, height, color: generateColor()})
        this.last = last;

        //Modificamos la posicion del cubo para amonotonar
        //Last.position.y es la ultima posicion central
        //last.geometry.parameters.height/2 le sumamos su mitad para posicionarlo encima del cubo
        this.position.y = last.position.y + last.geometry.parameters.height / 2 + this.geometry.parameters.height / 2;

        //Posicion maxima que se va a estar moviendo de derecha a izquierda el bloque
        this.max_position = 360;
        this.is_stopped = false;
        this.direction = 1;
        this.speed = 4;
        this.actual_axis = (Math.random() >= 0.5) ? 'x' : 'z';
        this.contray_axys = (this.actual_axis === 'x') ? 'z' : 'x';

        //Posicion inicial un poco atras del cubo
        this.position[this.actual_axis] -= this.max_position * this.direction; 

    }

    //Cuando hacemos click que se posicione cubo
    place(){
        const plane = (this.actual_axis === 'x') ? 'width' : 'height';
        
        //Valor de corte
        const distance_center = this.position[this.actual_axis] - this.last.position[this.actual_axis];
        const overlay = this.last.dimension[plane] - Math.abs(distance_center);
        //Si el overlay es negativo quiere decir que se salio de la dimension del cubo de abajo
        if(overlay > 0){

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
