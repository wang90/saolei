

import { SAFE_CELL, MINE_CELL ,AROUND} from "@/config/index";
import { Initialvalue, Block } from "@/types/index";


export const initData = ( config: Initialvalue ) => {
    return new Promise((resolve, reject) => {
        const rows = config['ROWS'];
        const cols = config['COLS'];
        const mines = config['COUNT'];
        const safeCellNum = rows * cols - mines;
        const safeArea = new Array(safeCellNum).fill(SAFE_CELL );
        const mineArea = ( new Array(mines) ).fill(MINE_CELL);
        let totalArea = safeArea.concat(mineArea);
            totalArea = minShuffle(totalArea);

        const data = totalArea.reduce(( memo, curr, index ) => {
            if (index % cols === 0 ) {
                memo.push([ curr ])
            }else {
                memo[ memo.length - 1 ].push( curr )
            }
            return memo;
        }, [] );
        const list = setEnvNum(data);
        resolve(list)
      });
} 
export const setList = (list: Block[][], type: string = 'over') => {
    return new Promise((resolve, reject) => {
        const newList:Block[][] =  list.map( v => {
            return v.map( _v => { 
                let nv:Block = _v;
                if (type === 'create') {
                    nv = {
                        "value": Number(_v),
                        "active": false,
                        "error": false,
                        "touched": false,
                    }
                }else if (type ==='over'){
                    if ( nv.active === false) {
                        nv.active = true
                    }
                }
                return nv;
            })
        })
        resolve(newList)
    })
}
const minShuffle  = ( array: number[][], count:number = array.length )=> {
    let index;
    while (count) {
        index = Math.floor( Math.random() * count -- );
        [ array[ count ], array[ index ]] = [ array[ index ], array[ count ] ]
    }
    return array;
}
const setEnvNum = ( list: number[][] ) => {
    list.forEach( ( row: number[], rowIndex: number) => {
        row.forEach( ( cell:number, colIndex: number ) => {
          if ( cell === MINE_CELL) {
            AROUND.forEach( offset => {
              const row = rowIndex + offset[0];
              const col = colIndex + offset[1];
              if ( list[row] &&
                list[row][col] !== undefined && 
                list[row][col] !== MINE_CELL ) { 
                  list[row][col] ++ ;
              }
            })
          }
        })
    });
    return list;
}



