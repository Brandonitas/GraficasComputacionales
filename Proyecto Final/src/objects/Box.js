import  BoxCreator from "./BoxCreator.js";
import generateColor from "../helpers/generateColors.js";

export default class Box extends BoxCreator {
    //Last es el ultimo cubo que se puso
    constructor({width, height, last}){
        super({width, height, color: generateColor()})
        this.last = last;

        //Modificamos la posicion del cubo para amonotonar
        //Last.position.y es la ultima posicion central
        //last.geometry.parameters.height/2 le sumamos su mitad para posicionarlo encima del cubo
        this.position.y = last.position.y + last.geometry.parameters.height / 2 + this.geometry.parameters.height / 2;
        
        console.log(last);
    }

    update(){

    }

}
