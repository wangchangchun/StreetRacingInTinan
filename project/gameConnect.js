$(document).ready(function() {
  const ID = window.sessionStorage.getItem("playId");
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
/*  
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '619303298409586',
      cookie     : true,  // enable cookies to allow the server to access 
      // the session
      xfbml      : true,  // parse social plugins on this page
      version    : 'v2.11' // use graph api version 2.8
    });
    FB.getLoginStatus(function(response) {
          //statusChangeCallback(response);
            });
  };
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
  */
  var socket = io();
  $("#createOk").click(()=>{
//    alert($('select').val())
      socket.emit('create',{id:ID,num:$('select').val()});
      $('#createModal').modal('hide');
  })
  $("#searchOk").click(()=>{
    alert($('input').val())
      socket.emit('search',$('input').val());
  })
  socket.on('connectToRoom',function(data) {
    //$("#roomList").append("<button class='ui purple button'>"+data+"</button>")
   window.sessionStorage.setItem("roomId",data);
      document.location.href = "./waitingRoom.html"
  })
  socket.on('disconnect',function(data){
          socket.emit('disconnect',ID)
  
  })
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
