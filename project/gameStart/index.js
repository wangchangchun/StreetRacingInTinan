
$(document).ready(function(){
  var url = window.location.href;
  var ID = url.split("?")[1]
  $("#return").hide();
 //$("#share").hide(); 
  //$("#testData").text("WELCOME TO TSR "+ID);
  $("#ach").click(function(){
      $("#start").hide();
      $("#ach").hide();
      $("#exit").hide();
      $("#testData").hide();
     // $("#share").show();
      $("#background").html("<img class='img-fuild' id='bgPic' src='./src/SCORE PAGE.png'>")
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
    document.location.href = "../racer/v4.final.html?"+ID;
  })
  $("#return").click(function(){
      $("#start").show();
      $("#ach").show();
      $("#exit").show();
      $("#testData").show();
      $("#return").hide();
      $("#background").html("<img class='img-fuild' id='bgPic' src='./src/GAME START PAGE-0.png'>")
      $("#record").hide();
   //   $("#share").hide();
  })
});
