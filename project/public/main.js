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
      }
    })
  })
  $("#sign_up_button").click(function(){
    $("#backgroundL").hide();
	$("#backgroundS").show();
	$("#login_button").hide();
    $("#sign_up_button").hide();
    $("#NAME_text").show();
    $("#finish_button").show();
	$("#ID_text").css("top","39%");
	$("#PASSWORD_text").css("top","47%");	
  })
  $("#finish_button").click(function(){
    event.preventDefault();//取消reload
    $.ajax({
      method: "POST",
      url: "./sign_up_data",
      data: {
        ID: $("input[name='ID']").val(),
        PASSWORD: $("input[name='PASSWORD']").val(),
        NAME: $("input[name='NAME']").val(),
      },
      success: function(data) {
        $("#ajax_content").text(data)
      }
    })
	$("#backgroundL").show();
	$("#backgroundS").hide();
    $("#login_button").show();
    $("#sign_up_button").show();
    $("#NAME_word").hide();
    $("#NAME_text").hide();
    $("#finish_button").hide();
	$("#ID_text").css("top","31%");
	$("#PASSWORD_text").css("top","40%");	
  })
})
