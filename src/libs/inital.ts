import { TYPE } from "@/config/index";
import {  Initialvalue } from "@/types/index";

export class GameConfig {
    ROWS:number = 0;
    COLS:number = 0;
    COUNT:number = 0;
    constructor(type: string) {
        const current: Initialvalue = TYPE[type];
        this.ROWS = current['ROWS'];
        this.COLS = current['COLS'];
        this.COUNT = current['COUNT'];
    }  
}