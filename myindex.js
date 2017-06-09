var   mineArray, //地雷数组
      lastNum, //剩余雷数
      countNum,  //没有被揭开的方块数
      inGame = 0,//游戏状态.0结束，1进行中，2初始化单位开始
      startTime ;//开始时间

init(10,10,10);
$(function(){
  $("#main").mouseup(function(e){
    var clicked = $(e.target),
        id = clicked.attr("id"),
        cX = parseInt(id.substring(1,id.indexOf("-"))),
        cY = parseInt(id.substring(id.indexOf("-")+1));
      console.log(e.which);
    /*
    * e.which
    * 鼠标1.左键，
    * 鼠标2.中间
    * 鼠标3.右键
    * */
    if(inGame ==1){
      if(e.which ==1){
        if(clicked.hasClass('hidden') && !clicked.hasClass('flag')){
          openBlock(cX,cY);
        }else if(!clicked.hasClass('hidden')){

        }
      }else if(e.which  ==3 && clicked.hasClass('hidden')){
        console.log("到右键了");
        if(clicked.hasClass('flag')){
          clicked.removeClass("flag");
          if($("#check").attr("checked")){
            clicked.addClass("check");
          }
          lastNum++;
          countNum++;
        }else if(clicked.hasClass("check")){
          clicked.removeClass("check");
        } else{
          clicked.addClass('flag');
          lastNum --;
          countNum --;
        }
        $("#lastnum").text(lastNum);
      }
      if(lastNum ==countNum){
        endGame(1);
      }
    }else if(inGame==2){
      if(e.which ==1){
        openBlock(cX,cY);
        inGame =1 ;
        var now =new Date();
        startTime  = now.getTime();
        timer();
      }
    }
  })
  $('#main').bind('contextmenu', function(){ return false; }); //阻止默认右击事件
})



//初始化
function init(x,y,mine){
  countNum = x*y;
  inGame = 2;
  lastNum = mine;
  /*创建一个mine1维数组*/
  mineArray = new Array(y+2);
  $.each(mineArray,function(key){
    mineArray[key] = new Array(x+2);
  });
  /*创建地雷二维数据*/
  for(var i = 1; i <= y;i++){
    for (var j = 1 ; j <=x ; j++ ){
      mineArray[i][j] = 0;
    }
  };
  /*随机埋雷*/
  while (mine >0){
    var i =Math.ceil(Math.random()*y);
    var j =Math.ceil(Math.random()*x);
    if(mineArray[i][j] !=-1){
      mineArray[i][j] =-1;
      mine--;
    }
  };
  for(var i = 1 ; i <= y ;i++){
    for(var j = 1 ; j<=x ; j++){
      /*如果不是雷*/
      if(mineArray[i][j] != -1){
        /*检测左面上*/
        if(i > 1 && j > 1 && mineArray[i - 1][j - 1] == -1) mineArray[i][j] ++;
        /*检测左面中*/
        if(i > 1 && mineArray[i - 1][j] == -1) mineArray[i][j] ++;
        /*检测左面下*/
        if(i > 1 && j < x && mineArray[i - 1][j + 1] == -1) mineArray[i][j] ++;
        /*检测正下面*/
        if(j < x && mineArray[i][j + 1] == -1) mineArray[i][j] ++;
        /*检测右面下*/
        if(i < y && j < x && mineArray[i + 1][j + 1] == -1) mineArray[i][j] ++;
        /*检测右面中*/
        if(i < y && mineArray[i + 1][j] == -1) mineArray[i][j] ++;
        /*检测右面上*/
        if(i < y && j > 1 && mineArray[i + 1][j - 1] == -1) mineArray[i][j] ++;
        /*检测正上面*/
        if(j > 1 && mineArray[i][j - 1] == -1) mineArray[i][j] ++;
      }
    }
  }
  var block = '';
  for(var i = 1, row = mineArray.length  -1 ; i<row ;i++){
    for(var j = 1, col = mineArray[0].length - 1 ; j<col ; j++){
      block += '<div id ="b'+i+'-'+j+'" style="left:'+(j-1)*20+'px;top:'+(i-1)*20+'px" class="hidden"></div>'
    }
  }
  $("#main").html(block).width(x*20+1).height(y*20+1).show();
  $("#warning").html('');
  $("#submenu").show();
  $("#lastnum").text(lastNum);
  $("#time").text('0');
};

//时间倒计时
function timer(){
  if(inGame ==1){
    var now =new Date();
    ms = now.getTime();
    $("#time").text(Math.ceil((ms-startTime)/1000));
    if(inGame ==1){
      setTimeout(function(){
        timer();
      },1000)
    }
  } else if(inGame ==2){
    $("#time").text('0');
  }
};

function openBlock(x,y){
  var current = $("#b"+x+'-'+y);
  if(mineArray[x][y] == -1){
    //有雷的
    if(inGame ==1){
      current.addClass("cbomb");
      endGame();
    }else if(inGame ==2){
      init(mineArray[0].length -2 ,mineArray.length-2,lastNum);
      openBlock(x,y);
    }else{
      if(!current.hasClass("flag")){
        current.addClass("bomb")
      }
    }
  }else if(mineArray[x][y] >0){
    //周围雷数目存在
    if(current.hasClass("flag")){
      current.addClass("wrong");
      if(inGame){
        endGame();
      }
    }else {
      current.html(mineArray[x][y]).addClass("num"+mineArray[x][y]).removeClass("hidden");
      if(current.hasClass("check")){
        current.removeClass("check");
      }
      if(inGame){
        countNum--;
      }
    }
  }else {
    //周围什么都没有的
    if(current.hasClass("flag")){
      current.addClass("wrong");
      console.log(111);
      if(inGame){
        endGame();
      }
    }else{
      current.removeClass("hidden");
      if(current.hasClass("check")){
        current.removeClass("check");
      };
      if(inGame){
        countNum--;
        var row = mineArray.length -2, col = mineArray[0].length -2;
        if(x > 1 && y > 1 && $('#b' + (x - 1) + '-' + (y - 1)).hasClass('hidden')) openBlock(x - 1, y - 1);
        if(x > 1 && $('#b' + (x - 1) + '-' + y).hasClass('hidden')) openBlock(x - 1, y);
        if(x > 1 && y < col && $('#b' + (x - 1) + '-' + (y + 1)).hasClass('hidden')) openBlock(x - 1, y + 1);
        if(y < col && $('#b' + x + '-' + (y + 1)).hasClass('hidden')) openBlock(x, y + 1);
        if(x < row && y < col && $('#b' + (x + 1) + '-' + (y + 1)).hasClass('hidden')) openBlock(x + 1, y + 1);
        if(x < row && $('#b' + (x + 1) + '-' + y).hasClass('hidden')) openBlock(x + 1, y);
        if(x < row && y > 1 && $('#b' + (x + 1) + '-' + (y - 1)).hasClass('hidden')) openBlock(x + 1, y - 1);
        if(y > 1 && $('#b' + x + '-' + (y - 1)).hasClass('hidden')) openBlock(x, y - 1);
      }
    }
  }
};

function endGame(isWin){
  inGame = 0;
  for(var i = 1,row =mineArray.length -1 ; i <row;i++){
    for(var j = 1,col = mineArray[0].length -1 ; j < col ;j++){
      if(isWin){
        if($("#b"+i+'-'+j).hasClass("hidden")&&!$("#b"+i+'-'+j).hasClass("flag")){
          $("#b"+i+'-'+j).addClass("flag");
          lastNum = 0;
          $("#lastnum").text(lastNum);
        }else{
          openBlock(i,j)
        }
      }
    }
  };
  $('#warning').text(isWin ? 'You Win!' : 'You Lose!');
}