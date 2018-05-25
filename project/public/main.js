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
        $("#ajax_content").text(data)
          document.location.href="../gameStart/index.html"
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
