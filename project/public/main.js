$(document).ready(function() {  
  $("#login_button").click(function(){
    event.preventDefault();//取消reload
    $.ajax({
      method: "POST",
      url: "./login_data",
      data: {
        ID: $("input[name='ID']").val(),
        PASSWORD: $("input[name='PASSWORD']").val(),
      },
      success: function(data) {
          if(data=="0"){
              $("#ajax_content").text("please fill all blanks")
          }
          else if(data=='1'){
              $("#ajax_content").text("Login succeed")
              document.location.href="../gameStart/index.html?"+$("#ID_text").val();
          }
          else{
              $("#ajax_content").text("Login failed")
              
          }
      }
    })
  })
  $("#sign_up_button").click(function(){
    $("#bg_setting").html("<img class='img-fuild' id='backgroundL' src='SIGNUP.png'>");
    $("#login_button").hide();
    $("#sign_up_button").hide();
    $("#NAME_text").show();
    $("#finish_button").show();
    $("#ID_text").css("margin-top","5%");
  })
  $("#finish_button").click(function(){
    event.preventDefault();//取消reload
    $.ajax({
      method: "POST",
      url: "./sign_up_data",
      data: {
        ID: $("input[name='ID']").val(),
        PASSWORD: $("input[name='PASSWORD']").val(),
        NAME: $("input[name='NAME']").val()
      },
      success: function(data) {
        $("#ajax_content").text(data)
          $("#bg_setting").html("<img class='img-fuild' id='backgroundL' src='LOGIN.png'>");
        $("#login_button").show();
        $("#sign_up_button").show();
        $("#NAME_word").hide();
        $("#NAME_text").hide();
        $("#finish_button").hide();
      }
    })
  })
})
function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(response);
    if (response.status === 'connected') {
      testAPI();
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
    cookie     : true,  // enable cookies to allow the server to access 
    // the session
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
function testAPI() {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', function(response) {
    console.log('Successful login for: ' + response.name);
    console.log(JSON.stringify(response));
    fb_id = response.id;
    $.ajax({
      url: "./fb_read",
      method:"POST",
      type:"post",
      data:{
        fb_id: response.id,
        fb_name:response.name
      },
      success:function(data){
              $("#ajax_content").text(data)
              document.location.href="../gameStart/index.html?"+fb_id;
        
      }
    })

  });
}
$("#fb_logout").click(()=>{

  FB.logout(function(response) {
    alert('已成功登出!');
    document.location.href="https://luffy.ee.ncku.edu.tw:1235/index.html";
  });
});
