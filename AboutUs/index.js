$(document).ready(function(){


  $('#pic2').show().animate({
    left:"3%",
    top:"18%"
  },1000);
  $('#pic1').show().animate({
    top:"3%",
    left: "18%"
  },1000);
  $("#SRT_ch").show(1300).animate({
    top:"10%",
    left: "50%"
  },300)
  $("#SRT").show(1600).animate({
    top:"25%",
    left: "50%"
  },300)
  $("#lattice").show(1900).animate({
    top:"50%",
    left: "50%"
  },300)
  $("#about_us").show(2100).animate({
    top:"90%",
    left: "45%"
  },300)
  $("#mem_intro").hide();

  $("#about_us").click(function(){
    //$("html, body").scrollTop($('#indexH0').offset().top);
    $('html,body').animate({scrollTop:$('#indexH0').offset().top},500)
      $("#about_us_intro").show().animate({
        top: "110%",
        left: "7%"
      },300)
    $("#line").show(1300).animate({
      top: "116%",
      left: "7%"
    },500)
    $("#intro").show(1500).animate({
      top: "120%",
      left: "7%"
    },300)
    $("#icon").show(1800).animate({
      top: "170%",
      right: "18%"
    },300)
  })
  var start_pos=0;
  var dir =0;
  $(window).on("scroll", function(){
    var current_pos = $(this).scrollTop();
    if (current_pos > start_pos) {
      dir=0;
    } else {
      dir=1;
    }
    start_pos = current_pos;

    if( (dir==0&&Math.abs($(window).scrollTop()-100)<10)||(dir==1&&Math.abs($(window).scrollTop()-$('#member_photo').offset().top+50)<10)){ 
      $('html,body').animate({scrollTop:$('#indexH0').offset().top},500)
        $("#about_us_intro").show().animate({
          top: "110%",
          left: "7%"
        },300)
      $("#line").show(1300).animate({
        top: "116%",
        left: "7%"
      },500)
      $("#intro").show(1500).animate({
        top: "120%",
        left: "7%"
      },300)
      $("#icon").show(1800).animate({
        top: "170%",
        left: "76%",
        //height:"12vh",
        "max-width":"6vw"
      },300)
    }
    if(dir==0&&Math.abs($(window).scrollTop() - ($('#indexH0').offset().top+50) )<10 ){
      $("html,body").animate({scrollTop:$('#member_photo').offset().top},500);
      $('#icon').animate({
        top:"233%",
        left:"3%",
        //height:"24vh",
        "max-width":"12vw"
      },300)

    }
  })
  //click MEMBER
  $("#icon").click(function(){
    $("html,body").animate({scrollTop:$('#member_photo').offset().top},500);
    $(this).animate({
      top:"233%",
      left:"3%",
      //height:"24vh",
      "max-width":"12vw"
    },300)
  })
  $("#back_to_top").click(function(){
    $("html,body").animate({scrollTop:0},500);
  })

  // Click member icon
  var on_click;
  $("#mem_1").click(function(){
    $("#team_photo").hide();
    Recover();
    $(this).animate({
      top: "10%",
      left: "3%",
      //height: "50vh",
      "max-width": "30vw"
    },300)
    document.getElementById("mem_intro").innerHTML = "王昶鈞<br>資訊系<br>學過C、C++、JAVA和一點點python，<br>但 coding能力普普<br>";
    $("#mem_intro").show(300);
    on_click = 1;
  })

  $("#mem_2").click(function(){
    $("#team_photo").hide();
    Recover();
    $(this).animate({
      top: "10%",
      left: "3%",
      //height: "50vh",
      "max-width": "30vw"
    },300)
    document.getElementById("mem_intro").innerHTML = "施善文<br>工業設計所<br>3D建模、ICON製作、修圖、版面編排等等，<br>本身為數理背景。<br>";
    $("#mem_intro").show(300);
    on_click = 2;
  })

  $("#mem_3").click(function(){
    $("#team_photo").hide();
    Recover();
    $(this).animate({
      top: "10%",
      left: "3%",
      "max-width": "30vw"
    },300)
    document.getElementById("mem_intro").innerHTML = "陳宥融<br>資訊系<br>打籃球 看NBA<br> 程式應該還ok 不過網頁方面才剛開始學 OwO <br>";
    $("#mem_intro").show(300);
    on_click = 3;
  })

  $("#mem_4").click(function(){
    $("#team_photo").hide();
    Recover();
    $(this).animate({
      top: "10%",
      left: "3%",
      "max-width": "30vw"
    },300)
    document.getElementById("mem_intro").innerHTML = "李相受<br>化工系<br>聽音樂 踢足球 釣蝦 聊天 <br>看蠟筆小新 看足球 等等。<br>";
    $("#mem_intro").show(300);
    on_click = 4;
  })

  $("#mem_5").click(function(){
    $("#team_photo").hide();
    Recover();
    $(this).animate({
      top: "10%",
      left: "3%",
      "max-width": "30vw"
    },300)
    document.getElementById("mem_intro").innerHTML = "陳靖沇<br>歷史系<br>耙疏史料、繪圖、飆車、喝酒，<br>前兩項專長應該可以多少幫大家一些忙~<br>";
    $("#mem_intro").show(300);
    on_click = 5;
  })

  $("#mem_6").click(function(){
    $("#team_photo").hide();
    Recover();
    $(this).animate({
      top: "10%",
      left: "3%",
      "max-width": "30vw"
    },300)
    document.getElementById("mem_intro").innerHTML = "謝明穎<br>電機系<br>健身 聽音樂 吃美食 <br>最近迷上二輪的世界 希望有一天能當一位賽車手呵呵<br>";
    $("#mem_intro").show(300);
    on_click = 6;
  })

  $("#mem_7").click(function(){
    $("#team_photo").hide();
    Recover();
    $(this).animate({
      top: "10%",
      left: "3%",
      "max-width": "30vw"
    },300)
    document.getElementById("mem_intro").innerHTML = "賴郁升<br>電機系<br>熬夜 打電動 打球 <br>程式甚麼的我只能盡量QQ<br>";
    $("#mem_intro").show(300);
    on_click = 7;
  })

  function Recover(){
    var left =[20,30,40,50,60,70,80];
    $("#mem_"+on_click).animate({
      top: "75%",
      left: left[on_click-1]+"%",
      "max-width": "6vw"
    },100)
    /* 
       if(on_click == 1){
       $("#mem_1").animate({
       top: "75%",
       left: "20%",
       height: "12vh",
       width: "6vw"
       },100)
       }
       else if(on_click == 2){
       $("#mem_2").animate({
       top: "75%",
       left: "30%",
       height: "12vh",
       width: "6vw"
       },100)
       }    
       else if(on_click == 3){
       $("#mem_3").animate({
       top: "75%",
       left: "40%",
       height: "12vh",
       width: "6vw"
       },100)
       }
       else if(on_click == 4){
       $("#mem_4").animate({
       top: "75%",
       left: "50%",
       height: "12vh",
       width: "6vw"
       },100)
       }
       else if(on_click == 5){
       $("#mem_5").animate({
       top: "75%",
       left: "60%",
       height: "12vh",
       width: "6vw"
       },100)
       }
       else if(on_click == 6){
       $("#mem_6").animate({
       top: "75%",
       left: "70%",
       height: "12vh",
       width: "6vw"
       },100)
       }
       else if(on_click == 7){
       $("#mem_7").animate({
       top: "75%",
       left: "80%",
       height: "12vh",
       width: "6vw"
       },100)
       }
       */
  }

  // Hover member icon
  $(".member").hover(
      function(){
        $(this).css('height',(this.height + 10) + "px");
        $(this).css('width',(this.width + 5) + "px");
      },
      function(){
        $(this).css('height',(this.height - 10) + "px");
        $(this).css('width',(this.width - 5) + "px");
      }
      );

})


