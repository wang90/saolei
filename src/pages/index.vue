<template>
  <div class="contain">
    <div class="games-type">
      <button v-for="(v,index) in tabLists"  
              :key="index" 
              :class="['btn',{'active':type === v.type}]" 
              @click="chooseType(v.type)">{{v.name}}</button>
    </div>
    <div class="start">
      <button class="btn" @mousedown = "init">{{startValue}}</button>
    </div>
    <div class="game-info">
      <div>剩余地雷数:{{count}}</div>
      <h6>{{message}}</h6>
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
  </div>
</template>
<style>
  .contain {
    padding: 30px;
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .btn {
    height: 30px;
    line-height: 30px;
    width: 100px;
    text-align: center;
    cursor: pointer;
    display: inline-block;
    margin: 0 10px;
    transition: all 0.2s;
    border: 1px solid transparent;  
    outline: none;   
    border-radius: 5px;
    box-shadow: 0 0 4px 1px #f6f6f6;
  }
  .btn.active {
    background: #333;
    color:#fff;
  }
 .lines {
    display: flex;
  }
  .start{
    padding: 12px 0;
  }
  .game-info{
    height: 50px;
  }
  .game-info > h6{
    text-align: center;
    padding: 5px 0;
  }
</style>
<script lang = "ts">
import { Component, Vue } from 'vue-property-decorator';
import { TYPE, AROUND ,TYPE_NAME, START_VALUE } from "@/config/index";
import { initData , setList} from "@/libs/data";
import BlockCompontent from "@/components/block.vue";
import { GameConfig } from "@/libs/inital";
import { Block, Initialvalue, Coordinates , TabItem } from "@/types/index";
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
  private tabLists: TabItem[] = [];
  private startValue: string = START_VALUE[0];

  // lifed
  private created() {
    const keys = Object.keys(TYPE);
    this.tabLists = keys.map(( v: string) => {
      const item: TabItem = {
        active : false,
        type: v,
        name: TYPE_NAME[v],
      }
      return item;
    })
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
    this.startValue = START_VALUE[1];

    initData( this.current ).then((list: unknown) => {
      
      this.count = this.current['COUNT'];
      this.nums = this.current['ROWS'] * this.current['COLS'];

      setList( list as Block[][], 'create').then(( ls: unknown) => {
        this.list = ls as Block[][];
        this.startValue = START_VALUE[2];
        this.beOver();
      }).catch(()=>{});
    }).catch(()=>{});
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
        setList(this.list).then( (list: unknown) =>{
            this.list  = JSON.parse(JSON.stringify(list)) as Block[][];
            this.startValue = START_VALUE[2];
        }).catch(()=>{})
    }
    private bindSetList( data: Block, { row, col }: Coordinates) {
      this.$set(this.list[row], col, data);
    }
}
</script>

