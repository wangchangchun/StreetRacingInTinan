$(document).ready(function() {
  const ID = window.sessionStorage.getItem("playId");
  $("#game").hide();
  $("#waitingRoom").hide();
  $.ajax({
    url:"./readBtn",
    method:"POST",
    type:"get",
    data:{
        
    },
    success:(res)=>{
        var sp = res.split(" ");
        for (var i=0;i<sp.length-1;i++){
            
          $("#roomList").append("<button class='ui purple button'>"+sp[i]+"</button>")
        }
    }
  })
  var socket = io();
  $("#createOk").click(()=>{
      socket.emit('create',{id:ID,num:$('#numSelect').val(),map:$('#mapSelect').val()});
      $('#createModal').modal('hide');
      $("#background").html("<img class='img-fuild' id='bg_pic' src='./src/bg.png'>")
      $("#menu").hide();
      $("#waitingRoom").show();
  })
  $("#searchOk").click(()=>{
      socket.emit('search',{id:ID,search:$('#searchInput').val()});
       $("#background").html("<img class='img-fuild' id='bg_pic' src='./src/bg.png'>")
         $("#menu").hide();
       $("#waitingRoom").show();
       $.ajax({
         url:"./roomData",
         method:"POST",
         type:"post",
         data:{
           roomId:$('#searchInput').val()
         },
         success:(res)=>{
           $("#inRoom").append(res);

         }
       })
  })
  $("#multiStart").click(()=>{
      $("#waitingRoom").hide();
      $("#game").show();
      $("#background").hide();

  
  })
  socket.on('connectToRoom',function(data) {
    window.sessionStorage.setItem("roomId",data.roomId);
    $("#inRoom").append("<div class =\"memberBlock\"><img src = \"./src/member.png\"> <p>"+data.id+"</p></div>")
  })
  socket.on('disconnect',function(data){
    socket.emit('disconnect',ID)

  })
  $("#sendMsg").click(()=>{
    socket.emit('chat message',{ msg:$('#m').val(),roomId: window.sessionStorage.getItem("roomId")});
    $('#m').val('');
  })
  socket.on('message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });
  $("#auto").click(()=>{
    socket.emit('auto',ID)
  })
  $('.dropdown').dropdown();
  $('.cancel').click(()=>{
    $('.modal').modal('hide');
  })
  $('#searchModal').modal('attach events', '#search', 'show');
  $('#createModal').modal('attach events', '#create', 'show');
})
