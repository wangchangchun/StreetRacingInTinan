$(document).ready(function() {  
    $("#ajax_btn").click(function(){
        event.preventDefault();//取消reload
        $.ajax({
            method: "get",
            url: "./ajax_data",
            data: {
                fname: $("#ajax_form input[name='fname']").val(),
                lname: $("#ajax_form input[name='lname']").val(),
            },
            success: function(data) {
                $("#ajax_content").text(data)
            }
          })
    })  
})
