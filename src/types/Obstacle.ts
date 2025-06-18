import {  IObstacle, } from "../types";
export class Obstacle implements IObstacle{
    x: number;
    y: number;
    radius: number;
    constructor (x: number, y: number, radius: number){
        this.x = x
        this.y = y
        this.radius = radius
    }
}