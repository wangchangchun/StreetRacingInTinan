
$(document).ready(function(){
  var url = window.location.href;
  var ID = window.sessionStorage.getItem("playId");
  $("#return").hide();
  $("#score").hide();
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
      $("#start").hide();
      $("#ach").hide();
	  $("#multi").hide();
      $("#exit").hide();
	  $("#car").hide();
	  $("#building").hide();
	  $("#blue").hide();
      $("#testData").hide();
     // $("#share").show();
        $.ajax({
          method: "post",
          url: "./readRecord",
          data: {
            ID:ID
          },
          success: function(data) {
            $("#record").html(data)
          }
        })
      $("#return").show();
      $("#record").show();
      //document.location.href = "../scorePage/index.html?"+ID;
  })
  $("#start").click(function(){
    document.location.href = "../racer/v4.final.html";
  })
  $("#return").click(function(){
	  $("#score").hide();
      $("#start").show();
      $("#ach").show();
	  $("#multi").show();
      $("#exit").show();
	  $("#car").show();
	  $("#building").show();
	  $("#blue").show();
      $("#testData").show();
      $("#return").hide();
      $("#record").hide();
   //   $("#share").hide();
  })
});
