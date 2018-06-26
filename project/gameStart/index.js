
var ID = window.sessionStorage.getItem("playId");
function tabClick(tab){
  $(".item").removeClass("active")
    $(".record").removeClass("active")
    $("#"+tab.id).addClass("active")
    var tabNum= tab.id[3];
  $("#record"+tabNum).addClass("active")
    if ($("#menuBtn1").hasClass("active")){
      var str = " ID = \""+ID+"\" AND";
      //    alert(str)
      $.ajax({
        method: "post",
        url: "./readRecord",
        data: {
          mode:str,
          ID:ID,
          map:tabNum
        },
        success: function(data) {
          $("#record"+tabNum).html(data)
        }
      })
    }
  if ($("#menuBtn2").hasClass("active")){
    var str = " ";
    $.ajax({
      method: "post",
      url: "./readRecord",
      data: {
        mode:str,
        ID:ID,
        map:tabNum
      },
      success: function(data) {
        $("#record"+tabNum).html(data)
      }
    })
  }
}
function menuClick(btn){
  $(".button").removeClass("active");
  $("#"+btn.id).addClass("active");
  $(".item").removeClass("active")
    $(".record").removeClass("active")
    $("#tab1").addClass("active")
    $("#record1").addClass("active")
    if ($("#menuBtn1").hasClass("active")){
      var str = " ID = \""+ID+"\" AND ";
      //    alert(str)
      $.ajax({
        method: "post",
        url: "./readRecord",
        data: {
          mode:str,
          ID:ID,
          map:1
        },
        success: function(data) {
          $("#record1").html(data)
        }
      })
    }
  if ($("#menuBtn2").hasClass("active")){
    var str = " ";
    $.ajax({
      method: "post",
      url: "./readRecord",
      data: {
        mode:str,
        ID:ID,
        map:1
      },
      success: function(data) {
        $("#record1").html(data)
      }
    })
  }
}
$(document).ready(function(){
  var url = window.location.href;
  $("#return").hide();
  $("#score").hide();
  $("#achPage").hide();
  //$("#share").hide(); 
  //$("#testData").text("WELCOME TO TSR "+ID);
  $("#blue").css("transform","rotate(720deg) scale(1)");
  setTimeout(function(){
    $("#building").show().animate({
      opacity:"1"
    },3200)
    $("#building").show().animate({
      opacity:"0"
    },2500)
    $("#building").show().animate({
      opacity:"1"
    },2500)
    $("#logo").show().animate({
      opacity:"1"
    },3200)
    $("#logo").show().animate({
      opacity:"0"
    },2500)
    $("#logo").show().animate({
      opacity:"1"
    },2500)
    $("#car").show().animate({
      left: "18%",
      opacity:"1"
    },3000)
    $("#menuBtn").show().animate({
      top: "-13%",
      opacity:"1"
    },3000)
    $("#share").show().animate({
      opacity:"1"
    },1200)
    $("#share").show().animate({
      opacity:"0"
    },500)
    $("#share").show().animate({
      opacity:"1"
    },500)
  },2200);
  $("#ach").click(function(){
    $("#score").show();
    $("#startPage").hide();
    $("#car").hide();
    $("#building").hide();
    $("#blue").hide();
    var str = " ID = \""+ID+"\" AND";
    $.ajax({
      method: "post",
      url: "./readRecord",
      data: {
        mode:str,
        ID:ID,
        map:1
      },
      success: function(data) {
        $("#record1").html(data)
      }
    })
    $("#return").show();
    $("#record").show();
    $("#achPage").show();
    //document.location.href = "../scorePage/index.html?"+ID;
  })
  $("#start").click(function(){
    //    document.location.href = "../racer/v4.final.html";
    document.location.href = "../choosePage/index.html";
  })
  $("#multi").click(function(){
    document.location.href = "../multi.html";

  })

  $("#return").click(function(){
    $("#score").hide();
    $("#startPage").show();
    $("#car").show();
    $("#building").show();
    $("#blue").show();
    $("#return").hide();
    $("#record").hide();
    $("#achPage").hide();
  })
});
