/**
 *
 * This is not a drill. 
 * I repeat, this is not a flim about cyclims.
 *
 * Author: Grégoire Richard
 *
 */


//Create the triangular cells that will make up the matrix
class Cell {
    constructor(circle1, circle2, circle3, hovered, name){
        this.name = name;
        this.sommets = [circle1, circle2, circle3];
        this.state = hovered;
    }

    containPoint(pX, pY){
        var denominator = ((this.sommets[1].y - this.sommets[2].y) * (this.sommets[0].x - this.sommets[2].x) + (this.sommets[0].y - this.sommets[2].y) * (this.sommets[2].x - this.sommets[1].x));

        var a = ((this.sommets[1].y - this.sommets[2].y) * (pX - this.sommets[2].x) + (this.sommets[2].x - this.sommets[1].x) * (pY - this.sommets[2].y)) / denominator;

        var b = ((this.sommets[2].y - this.sommets[0].y) * (pX - this.sommets[2].x) + (this.sommets[0].x - this.sommets[2].x) * (pY - this.sommets[2].y)) / denominator;

        var c = 1 - a - b;

        return (0 <= a) && (a <= 1) && (0 <= b) && (b <= 1) && (0 <= c) && (c <= 1);

    }

    getState(){
        return this.state;
    }

    setState(hovered){
        this.state = hovered;
    }

    getSommets(){
        return this.sommets;
    }

    getName(){
        return this.name;
    }

    switchVertices() {
        this.sommets.push(this.sommets.shift())
    }
}