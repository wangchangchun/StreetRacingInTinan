
$(document).ready(function(){
//  var url = window.location.href;
  var ID = window.sessionStorage.getItem("playId");
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
    document.location.href = "../racer/v4.final.html";
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
  $("#exit").click(()=>{
    FB.getLoginStatus(function(response){
      if (response.status === 'connected'){
        FB.logout(function(response) {
          alert('已成功登出!');
          document.location.href="https://luffy.ee.ncku.edu.tw:10088/public/login.html";
        });
      }
      else{
        document.location.href="https://luffy.ee.ncku.edu.tw:10088/public/login.html"
      }
    })
  });
});
function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(response);
  if (response.status === 'connected') {
    //testAPI();
  } else {
  }
}
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}
window.fbAsyncInit = function() {
  FB.init({
    appId      : '619303298409586',
    cookie     : true,  // enable cookies to allow the server to access the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.11' // use graph api version 2.8
  });
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
};
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
