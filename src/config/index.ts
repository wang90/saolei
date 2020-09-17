import {  Initialvalue } from "@/types/index";

export const SAFE_CELL = 0;
export const MINE_CELL = 9;

export const TYPE:{ [key: string]: Initialvalue; }  = {
    'easy' : {
      ROWS: 15,
      COLS: 10,
      COUNT: 10,
    },
    'middle': {
      ROWS: 30,
      COLS: 20,
      COUNT: 50,
    },
    'difficulty': {
      ROWS: 35,
      COLS: 28,
      COUNT: 100,
    }
}
export const TYPE_NAME:{ [key: string]: string }  = {
  'easy' : '初级',
  'middle': '中级',
  'difficulty': '高级',
}
export const AROUND = [
    [ -1, -1 ],
    [ -1, 0 ],
    [ -1, 1 ],
    [ 0, -1 ],
    [ 0, 1 ] ,
    [ 1, -1 ],
    [ 1, 0 ],
    [ 1, 1 ],
]

export const START_VALUE: string[] = [
  '开始',
  '重制中',
  '重新开始',
]


