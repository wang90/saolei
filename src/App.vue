<template>
  <div id="app">
    <div>
      <button @click="init">开始</button>
      <div>剩余地雷数:{{count}}</div>
    </div>
    <div class="play-contain">
      <div class="lines" 
      v-for = "(line,index) in list" 
      :key = index>
        <div  
          :key= i
          v-for="(l,i) in line" 
          @click="choose($event,l,index,i)">
          <block 
            :value="l.value"
            :active="l.active"
            :error="l.error"
            :touched="l.touched"
            :win="win"
            ></block>
        </div>
      </div>
    </div>
      <h6>{{message}}</h6>
  </div>
</template>
<style>
  /* .play-contain{
    border:1px solid #ccc;
  } */
 .lines {
    display: flex;
  }
</style>
<script>
const SAFE_CELL = 0;
const MINE_CELL = 9;
const ROWS  = 15;
const COLS = 10;
const AROUND = [
  [ -1, -1 ],
  [ -1, 0 ],
  [ -1, 1 ],
  [ 0, -1 ],
  [ 0, 1 ] ,
  [ 1, -1 ],
  [ 1, 0 ],
  [ 1, 1 ],
]
import Block from "@/components/block.vue";

export default {
  name: 'App',
  data() {
    return {
      message:"",
      list :[],
      isPlay:true,
      count: 10,
      nums: 0,
      remain: 0 ,
      win: false,
    }
  },
  components:{'block':Block},
  created() {
    this.init();
  },
  methods:{
    init () {
      this.isPlay = true;
      this.message = "";
      this.count = 10;
      this.nums  = 0 ;
      this.remain = 0;
      this.win = false;
      this.initData();
    },
    initData() {
      const rows = ROWS;
      const cols = COLS;
      const mines = this.count;
      const safeCellNum = rows * cols - mines;
      const safeArea = (new Array(safeCellNum).fill(SAFE_CELL ));
      const mineArea = (new Array(mines)).fill(MINE_CELL);
      let totalArea = safeArea.concat(mineArea);
      totalArea = this.minShuffle(totalArea);

      const data = totalArea.reduce(( memo, curr, index ) => {
        if (index % cols === 0 ) {
          memo.push([curr])
        }else {
          memo[ memo.length - 1 ].push( curr )
        }
        return memo;
      }, [] );
      const list = this.setEnvNum(data);
  
      this.list = list.map(v=>{
        return v.map(_v=>{
          this.nums +=1;
          return {
            value: _v,
            active: false,
            error: false,
            touched: false,
          }
        })
      })
      this.beOver();
    },
    minShuffle (array, count = array.length) {
      let index;
      while(count) {
        index = Math.floor(Math.random() * count -- );
        [ array[ count ], array[ index ]] = [ array[ index ], array[ count ] ]
      }
      return array;
    },
    setEnvNum( list ) {
      list.forEach(( row, rowIndex) => {
          row.forEach(( cell, colIndex ) => {
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
    },
    playEnd(){
      this.message = '你踩到地雷了';
      this.isPlay = false;
      this.list.map(v => {
        return v.map( _v => {
          if ( _v.active === false) {
            _v.active = true
          }
          return v;
        })
      })
    },
    choose( $event, e, row, col ) {
      console.log($event);
      if ( this.isPlay && !e.active) {
        if ($event.button === 0) {
          if ( e.value === 9) {
            this.$set( this.list, this.list[row][col]['error'] = true);
            this.$set( this.list, this.list[row][col]['touched'] = true);
            this.$set( this.list, this.list[row][col]['active'] = true );
            this.playEnd();
          } else if ( e.value === 0 ) {
            console.log('需要遍历');
            this.searchValueNone({ row, col } );
            this.beOver();
          } else {
            this.$set( this.list, this.list[row][col]['active'] = true );
            this.$set( this.list, this.list[row][col]['touched'] = true );
            this.remain +=1;
            this.beOver();
          }
        }
      }
    },
    searchValueNone ( data ) {
      const  { row , col } = data;
      this.searchValue( row , col);
    },
    searchValue(rowIndex, colIndex) {
      const currentIndex = this.list[rowIndex] ? this.list[rowIndex][colIndex] || null : null;
      if (currentIndex &&  currentIndex['active'] === false) {
        if ( currentIndex['value'] === 0 ) {
          this.$set( this.list, this.list[rowIndex][colIndex]['active'] = true );
          this.remain +=1;
          AROUND.forEach( offset => {
            const row = rowIndex + offset[0];
            const col = colIndex + offset[1];
            const current = this.list[row]? this.list[row][col] || null : null;
            if ( current ) {
              if ( current['active'] === false && current['value'] !== 9 ) {
                
                if ( current['value'] !== 9 ) {
                  if (current['value'] !== 0 ) {
                    this.$set( this.list, this.list[row][col]['active'] = true );
                    this.remain +=1;
                  } else {
                    this.searchValue( row, col );
                  }
                } else {
                  this.$set( this.list, this.list[row][col]['active'] = true );
                  this.remain +=1;
                }
              }
            } 
          })
        } 
      }
    },
    beOver(){
      console.log(this.remain);
     if( this.nums - this.remain  > this.count){
       // 继续游戏中;
     } else {
       this.isPlay = false;
       this.win = true;
       this.message = 'you win';
       this.list.map(v => {
        return v.map( _v => {
          if ( _v.active === false) {
            _v.active = true
          }
          return v;
        })
      })
     }
    }
  
  }
}
</script>

