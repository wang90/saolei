<template>
    <div :class="[
        'block',
        {'active':active},
        {'touched':touched},
        {'error':error},
        {'none': active && value === 0},
        {'die': active && value === 9}
    ]">{{getValue}}</div>
</template>
<style>
  .block {
    width: 25px;
    border:1px solid #ccc;
    height: 25px;
    text-align: center;
    line-height: 25px;
    position: relative;
    cursor: pointer;
  }
  .block::before  {
    content: "";
    position: absolute;
    left: 1px;
    top: 1px;
    right: 1px;
    bottom: 1px;
    background: #fff;
  }
  .block.touched{
    background: rgba(0, 128, 0, 0.2);
  }
  .block.error{
    background: rgba(255, 0, 0, 0.2);
  }
  .block.active{
    background: rgba(173, 255, 47, 0.2);
  }
  .block.none{
    background:#eee;
  }
  .block.die{
    background: url('../assets/die.png') no-repeat  center ;
    background-size: 70%;
  }
  .block.touched.die{
    background-color: rgba(255, 0, 0, 0.2);
  }
  .block.active::before{
    display: none;
  } 
</style>
<script>

export default {
    name: 'Block',
    computed:{
        getValue() {
            if (this.value === 0 || this.value === 9 ) {
                return "";
            } 
            return this.value;
        }
    },
    props:{
        value: {
            type: Number,
            default: 0 ,
            required:true,
        },
        active: {
            type: Boolean,
            default: false ,
            required:true,
        },
        error: {
            type: Boolean,
            default: false ,
            required:true,
        },
        touched: {
            type: Boolean,
            default: false,
            required:true,
        }
    },
    data() {
        return {}
    },
}
</script>

