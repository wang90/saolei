<template>
  <div>
    <div>
      <button @click="chooseType('easy')">初级</button>
      <button @click="chooseType('middle')">中级</button>
      <button @click="chooseType('difficulty')">高级</button>
    </div>
    <div>
      <button @mousedown = "init">开始</button>
      <div>剩余地雷数:{{count}}</div>
    </div>
    <div class="play-contain">
      <div class="lines" 
      v-for = "(line,index) in list" 
      :key = index>
        <div  
          :key= i
          v-for="( l , i ) in line" 
          @click="choose( $event, l , {'row':index,'col':i})">
          <block 
            :value="l.value"
            :active="l.active"
            :error="l.error"
            :touched="l.touched"
            :win="winner"
            ></block>
        </div>
      </div>
    </div>
      <h6>{{message}}</h6>
  </div>
</template>
<style>
 .lines {
    display: flex;
  }
</style>
<script lang = "ts">
import { Component, Vue } from 'vue-property-decorator';
import { AROUND } from "@/config/index";
import { initData , setList} from "@/libs/data";
import BlockCompontent from "@/components/block.vue";
import {GameConfig} from "@/libs/inital";
import { Block, Initialvalue, Coordinates } from "@/types/index";
const firstConfig:string = 'easy';

@Component({
  components: {
    'block': BlockCompontent,
  },
})
export default class Index extends Vue{
  // 变量
  private list: Block[][] = [];
  private message: string = '';
  private isPlay: boolean = true;
  private count: number = 0;
  private nums: number = 0;
  private remain: number = 0;
  private winner: boolean = false;
  private type: string = firstConfig;
  private current: Initialvalue = new GameConfig(firstConfig);

  // lifed
  private created() {
    console.log('init');
    this.init();
  }
  // methods
  private init() {
    this.isPlay = true;
    this.message = "";
    this.nums  = 0 ;
    this.remain = 0;
    this.winner = false;
    this.current = new GameConfig(this.type);

    initData( this.current ).then((list: Block[][]) => {
      
      this.count = this.current['COUNT'];
      this.nums = this.current['ROWS'] * this.current['COLS'];

      setList( list, 'create').then(( ls: Block[][]) => {
        this.list = ls as Block[][];
        this.beOver();
      });
    })
  }
  private chooseType( type: string ) {
      this.type  = type;
      this.init();
  }

    private choose( $event: MouseEvent, e: Block, { row, col }: Coordinates ) {
        if ( this.isPlay && !e.active) {
            if ($event.button === 0) {
                if ( e.value === 9) {
                    const newValue:Block = {
                        value: e.value,
                        error: true,
                        touched: true,
                        active: true,
                    }
                    this.bindSetList(newValue,{row,col});
                    this.playEnd();
                } else if ( e.value === 0 ) {
                    console.log('需要遍历');
                    this.searchValueNone({ row, col } );
                    this.beOver();
            } else {
                const newValue:Block = {
                    value: e.value,
                    error: e.error,
                    touched: true,
                    active: true,
                }
                this.bindSetList(newValue,{row,col});
                this.remain += 1;
                this.beOver();
            }
        }
      }
    }
    private beOver() {
        if( this.nums - this.remain  > this.count){
        // 继续游戏中;
        } else {
            this.winner = true;
            this.setList('you win')
        }
    }
    private searchValueNone ( data: Coordinates ) {
        const  { row , col } = data;
        this.searchValue( { row , col } );
    }
    private searchValue( { row, col }: Coordinates) {

        const currentIndex = this.list[row] ? this.list[row][col] || null : null;
        
        if (currentIndex &&  currentIndex['active'] === false) {
            
            if ( currentIndex['value'] === 0 ) {
                // const newValue: Block = this.list[row][col];
                currentIndex['active'] = true;
                this.bindSetList( currentIndex,{ row , col } );
                this.remain +=1;
                AROUND.forEach( offset => {
                    const rowIndex: number = row + offset[0];
                    const colIndex:number  = col + offset[1];
                    const current = this.list[rowIndex]? this.list[rowIndex][colIndex] || null : null;
                    
                    if ( current ) {

                        if ( current['active'] === false && current['value'] !== 9 ) {

                            if ( current['value'] !== 9 ) {
                  
                                if (current['value'] !== 0 ) {

                                    current['active'] = true;
                                    this.bindSetList( current,{ row: rowIndex , col: colIndex } );
                                    this.remain +=1;

                                } else {

                                    this.searchValue( {row: rowIndex, col: colIndex });
                                }
                            } else {

                                current['active'] = true;
                                this.bindSetList( current, { row: rowIndex , col: colIndex } );
                                this.remain +=1;
                            }
                        }
                    } 
                })
            } 
        }
    }
    private playEnd () {
        this.setList('你踩到地雷了');
    }
    private setList ( msg: string = '') {
        this.message = msg;
        this.isPlay = false;
        setList(this.list).then( (list: Block[][]) =>{
            this.list  = JSON.parse(JSON.stringify(list)) as Block[][];
        });
    }
    private bindSetList( data: Block, { row, col }: Coordinates) {
      this.$set(this.list[row], col, data);
    }
}
</script>

