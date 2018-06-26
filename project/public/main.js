$(document).ready(function(){
	$("#building").show().animate({
		opacity:"1"
	},1200)
	$("#building").show().animate({
		opacity:"0"
	},500)
	$("#building").show().animate({
		opacity:"1"
	},500)
	$("#line").show().animate({
		opacity:"1"
	},2000)
	$("#car").show().animate({
		left: "32%"
	},4000)
	$("#btns").show().animate({
		left: "-10%"
	},1000)
	$("#stuid").show().animate({
		left: "6%"
	},2000)
	$("#pw").show().animate({
		left: "6%"
	},2000)
})
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
			        setTimeout(function(){
                $("#login_button").hide();
				$("#sign_up_button").hide();
				$("#car").hide();
				$("#line").hide();
				$("#stuid").hide();
				$("#pw").hide();
				$("#building").hide();
				$("#logo").hide();
				$("#ID_text").hide();
				$("#PASSWORD_text").hide();
				$("#fb_login").hide();
                $("#backgroundL").css("transform","rotate(720deg) scale(0)");
              },1500);
			        setTimeout(function () {
                window.sessionStorage.setItem("playId", $("#ID_text").val());
				         window.location.href ="../gameStart/index.html";
               },4000); 
          }
          else{
              $("#ajax_content").text("Login failed")
              
          }
      }
    })
  })
  $("#sign_up_button").click(function(){
    $("#login_button").hide();
    $("#sign_up_button").hide();
    $("#NAME_text").show();
    $("#finish_button").show();
	$("#name").show();
  $("#name").css("top","37%");
	$("#stuid").css("top","46%");
	$("#pw").css("top","58%");
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
        $("#ajax_content").text(data);
        $("#login_button").show();
        $("#sign_up_button").show();
        $("#NAME_word").hide();
        $("#NAME_text").hide();
        $("#finish_button").hide();
        $("#name").hide();
        $("#stuid").css("top","35%");
        $("#pw").css("top","46%");
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
   // statusChangeCallback(response);
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
                window.sessionStorage.setItem("playId",response.id );
                document.location.href="../gameStart/index.html";
        
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
