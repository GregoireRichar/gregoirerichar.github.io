/**
 *
 * This is not a drill. 
 * I repeat, this is not a flim about cyclims.
 *
 * Author: Grégoire Richard
 *
 */

// Basic elements of the canvas; circles represent actuators
class Circle {
    constructor(X, Y, R, name){
        this.x = X;
        this.y = Y;
        this.radius = R;
        this.name = name;
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    getR(){
        return this.radius;
    }

    getName() {
        return this.name;
    }

    setRadius(R){
        this.radius = R;
    }

    setX(value){
        this.x = value;
    }

    setY(value){
        this.y = value;
    }
}