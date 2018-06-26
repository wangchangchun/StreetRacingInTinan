const fs = require('fs');
var url = require('url');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('./ssl/private.key','utf8');
var certificate = fs.readFileSync('./ssl/certificate.crt','utf8');
var ca_bundle = fs.readFileSync('./ssl/ca_bundle.crt','utf8');
var credentials = {key: privateKey, cert: certificate};
const express = require('express');
const app = express();
const port = 10088; // 請改成各組分配的port
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended:true});
//const config = require('./config');
const mysql = require('mysql');
const request = require('request');
app.use(express.static(__dirname));
///*
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port,() => {
  console.log(`Listening on port ${port}`)
})
//*/
const io = require('socket.io')(httpsServer);
var rooms = require('./roomDefine');
const config = {
  host:'localhost',
  user:'uidd2018_groupI',
  password:'TSRgogogo',
  database:'uidd2018_groupI'
};

//app.listen(port);
var connection;
function handleDisconnect() {
  connection = mysql.createConnection(config);
  // Recreate the connection, since the old one cannot be reused.
  console.log("mysql connection OK!") 
    connection.connect( function onConnect(err) {   // The server is either down
      if (err) {                                  // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 10000);    // We introduce a delay before attempting to reconnect,
      }                                           // to avoid a hot loop, and to allow our node script to
    });                                             // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on('error', function onError(err) {
    console.log('db error', err);
    if (err.code == 'PROTOCOL_CONNECTION_LOST') {   // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                        // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}
handleDisconnect();



app.post("/public/sign_up_data",urlencodedParser,function(req,res){
  var id = req.param('ID');
  var pw = req.param('PASSWORD');
  var name = req.param('NAME');
  var notfound = 0;
  if(req.body.ID==""||req.body.PASSWORD==""||req.body.NAME==""){
    res.send('Please fill all blanks');
  }
  else{	
    var sqls = "SELECT * FROM `mytable` WHERE id = '"+id+"'";
    //  console.log(sqls);
    connection.query(sqls, function(err,result,fields){
      if(err) throw err;
      for( var i = 0 ; i < result.length ; i++){
        if(result[i].id==id) {res.send('Your id has been used.');notfound=1;break;}
      }
      if(notfound == 0){
        var sqli = "INSERT INTO `mytable` ( name , id , pw,play) VALUES ('"+name+"','"+id+"','"+pw+"',0)";
        var achsql = "INSERT INTO `achievement` (id,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18) VALUES (\""+id+"\",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)";
        //   console.log(sqli);
        connection.query(sqli, function(err,result){
          if(err) throw err;
          //     console.log("signup");
          res.send('Sign up succeed');
        });
        connection.query(achsql);
      }
    });  
  }
});
app.post("/public/login_data",urlencodedParser,function(req, res) {
  var id = req.param('ID');
  var pw = req.param('PASSWORD');
  var notfound=0;
  if(req.body.ID==""||req.body.PASSWORD==""){
    res.send("0");
  }
  else{
    var sqls = "SELECT * FROM `mytable` WHERE id = '"+id+"'";
    // console.log(sqls);
    connection.query(sqls, function(err,result,fields){
      if(err) throw err;
      for( var i = 0 ; i < result.length ; i++){
        if(result[i].id==id) {
          notfound=1;
          if(result[i].pw==pw) res.send('1');
          else res.send('2');
          break;
        }
      }
      if(notfound == 0)res.send('2');			
    }); 
  }	  
});
app.post("/public/fb_read",urlencodedParser,function(req, res) {
  var fb_id = req.param("fb_id")
    var fb_name = req.param("fb_name")
    console.log(fb_id + " "+fb_name)
    connection.query("SELECT * FROM `uidd2018_groupI`.`mytable` WHERE id = \""+fb_id+"\";",(err,rows,fields)=>{ 
      var sql = ""  
        if(rows.length==0){
          sql = "INSERT INTO `mytable` ( name , id ,play) VALUES ('"+fb_name+"','"+fb_id+"',0)";
          connection.query(sql)
            var achsql = "INSERT INTO `achievement` (id,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18) VALUES (\""+fb_id+"\",0,0,0,0,0,0,0,0,0,0,,0,0,0,00,0,0,0)";
          connection.query(achsql)
        }
      res.send("login succeed!")

    }) 
})
app.post("/gameStart/readRecord",urlencodedParser,function(req,res){
  var id = req.param('ID');
  var map = req.param('map');
  var mode = req.param('mode');
  console.log("mode:"+mode);
  var str = "";
  var select = "SELECT * FROM `uidd2018_groupI`.`record` WHERE "+mode+" map = "+map+" ORDER BY time ASC;"
    console.log(select)
    connection.query(select,(err,rows,fields)=>{ 
      for(var i=0;i<rows.length;i++)
      {
        if(rows[i].time>60)
        {
          var min = Math.floor(rows[i].time/60);
          var sec = (rows[i].time%60).toFixed(3);
          rows[i].time = min+" min "+sec +"sec";
        }
        else
          rows[i].time = rows[i].time+" sec"
            str = str+rows[i].name+" "+ rows[i].time+ "<br>"
            console.log("i = "+i+" "+rows[i].time)
      }

      res.send(str);
    })

})
app.post("/racer/saveRecord",urlencodedParser,function(req,res){
  var id = req.param('ID');
  var time = req.param('THISTIME');
  var map = req.param('map');
  console.log(id +" "+time)
    connection.query("SELECT * FROM `uidd2018_groupI`.`mytable` WHERE id = \""+id+"\";",(err,rows,fields)=>{ 
      if(err) console.log("read err");
      else{
        connection.query("UPDATE `uidd2018_groupI`.`achievement` SET a"+(++map)+"=1 WHERE id = \""+id+"\"");
        var play = rows[0]['play']+1;
        var update_str = "UPDATE `uidd2018_groupI`.`mytable` SET `play`="+ play+" WHERE id =\""+id+"\";";
        connection.query(update_str);
        var insert_data = "INSERT INTO `uidd2018_groupI`. `record` (id,name,map,num,time) VALUES(\""+id+"\",\""+account+"\","+map+","+play+","+time+");";
        connection.query(insert_data);
        var account = rows[0]['name'];
        connection.query("SELECT * FROM `uidd2018_groupI`.`achievement` WHERE id = \""+id+"\";",(err,r,fields)=>{ 
          if(play>=1&&!r[0].a1)
            connection.query("UPDATE `uidd2018_groupI`.`achievement` SET a1=1 WHERE id = \""+id+"\"");
          if(play>=10&&!r[0].a7)
            connection.query("UPDATE `uidd2018_groupI`.`achievement` SET a7=1 WHERE id = \""+id+"\"");
          if(play>=15&&!r[0].a8)
            connection.query("UPDATE `uidd2018_groupI`.`achievement` SET a8=1 WHERE id = \""+id+"\"");
          if(play>=20&&!r[0].a9)
            connection.query("UPDATE `uidd2018_groupI`.`achievement` SET a9=1 WHERE id = \""+id+"\"");
          if(play>=50&&!r[0].a18)
            connection.query("UPDATE `uidd2018_groupI`.`achievement` SET a18=1 WHERE id = \""+id+"\"");
          if(time<90&&!r[0].a13)
            connection.query("UPDATE `uidd2018_groupI`.`achievement` SET a13=1 WHERE id = \""+id+"\"");
          if(time<75&&!r[0].a14)
            connection.query("UPDATE `uidd2018_groupI`.`achievement` SET a14=1 WHERE id = \""+id+"\"");
          if(time<70&&!r[0].a15)
            connection.query("UPDATE `uidd2018_groupI`.`achievement` SET a15=1 WHERE id = \""+id+"\"");
          if(time>120&&!r[0].a16)
            connection.query("UPDATE `uidd2018_groupI`.`achievement` SET a16=1 WHERE id = \""+id+"\"");
          if(time>180&&!r[0].a17)
            connection.query("UPDATE `uidd2018_groupI`.`achievement` SET a17=1 WHERE id = \""+id+"\"");
        })
      }
    })
  res.send("OK")


})
/*
   app.post("/racer/saveAchieve",urlencodedParser,function(req,res){
   var id = req.param('ID');
   var notfound=0;
   var done=1;
   var notdone=0;
   connection.query("SELECT * FROM `uidd2018_groupI`.`achievement` WHERE id = \""+id+"\";",(err,rows,fields)=>{ 
   if(err) console.log("read err");
   else{
   var sqls = "SELECT * FROM `achievement` WHERE id = '"+id+"'";
//       console.log(sqls);
connection.query(sqls, function(err,result,fields){
if(err) throw err;
for( var i = 0 ; i < result.length ; i++){
if(result[i].id==id) 
{notfound=1;break;}
}
if(notfound == 0){
var update_str = "UPDATE `uidd2018_groupI`.`achievement` SET `a1`="+ done+" WHERE id =\""+id+"\";";
connection.query(update_str);
}
else if(notfound == 1){
var insert_data = "INSERT INTO `uidd2018_groupI`. `record` (id,name,num,time) VALUES(\""+id+"\",\""+account+"\","+play+","+time+");";
connection.query(insert_data);
}
});
};  
var insert_data = "INSERT INTO `uidd2018_groupI`. `record` (id,name,num,time) VALUES(\""+id+"\",\""+account+"\","+play+","+time+");";
connection.query(insert_data);
})
})
*/
app.post("/readBtn",urlencodedParser,function(req,res){
  connection.query("SELECT * FROM `uidd2018_groupI`.`roomList`" ,(err,rows,fields)=>{
    var str = "";
    for(var i=0;i<rows.length;i++){
      str = str +rows[i].id+" ";
    }
    res.send(str)
  })
})
app.post("/gameStart/readAch",urlencodedParser,function(req,res){
  var id = req.param('id');
  var arr=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    var ach= "SELECT * FROM `uidd2018_groupI`.`achievement` WHERE id = \""+id+"\";"
    connection.query(ach,(err,rows,field)=>{
      if(rows.length!=0){
        //for (var i=1;i<=14;i++) {
        arr[0]= rows[0].a1;
        arr[1]= rows[0].a2;
        arr[2]= rows[0].a3;
        arr[3]= rows[0].a4;
        arr[4]= rows[0].a5;
        arr[5]= arr[1]&&arr[2]&&arr[3]&&arr[4];
        arr[6]= rows[0].a7;
        arr[7]= rows[0].a8;
        arr[8]= rows[0].a9;
        arr[9]= rows[0].a10;
        arr[10]= rows[0].a11;
        arr[11]= rows[0].a12;
        arr[12]= rows[0].a13;
        arr[13]= rows[0].a14;
        arr[14]= rows[0].a15;
        arr[15]= rows[0].a16;
        arr[16]= rows[0].a17;
        arr[17]= rows[0].a18;
        //    }
        res.send(arr);
      }

    });

})
app.post("/roomData",urlencodedParser,function(req,res){
  var roomId = req.param('roomId');
  //  console.log("roomId = "+roomId)
  var checkNum = "SELECT * FROM `uidd2018_groupI`.`roomList` WHERE id =\""+roomId+"\";"
    //   console.log(checkNum);
    connection.query(checkNum,(err,rows,field)=>{
      // console.log(rows.length)
      var str="";
      for (var i=1;i<rows[0].num;i++)
      {
        if(i==1)
          str = str+"<div class =\"memberBlock\"><img src = \"./src/member.png\"> <p>"+rows[0].id+"</p></div>";
        if(i==2)
          str = str+"<div class =\"memberBlock\"><img src = \"./src/member.png\"> <p>"+rows[0].mem1+"</p></div>";
        if(i==3)
          str = str+"<div class =\"memberBlock\"><img src = \"./src/member.png\"> <p>"+rows[0].mem2+"</p></div>";
        if(i==4)
          str = str+"<div class =\"memberBlock\"><img src = \"./src/member.png\"> <p>"+rows[0].mem3+"</p></div>";
      }
      res.send(str)
    })

})
/***
 *  multiplayer connection setting
 *  don't change!!!!!!!!!
 *
 */
io.on('connection', function(socket){
  console.log("connect")
    socket.on('create',function(data){
      // console.log(data.id);
      var roomId = data.id;
      var memNum = data.num;
      var insert_data = "INSERT INTO `uidd2018_groupI`. `roomList` (id,map,allnum,num) VALUES(\""+roomId+"\","+data.map+","+memNum+",1);";
      connection.query(insert_data);
      socket.join(roomId);
      io.sockets.in(roomId).emit('connectToRoom',{id:data.id,roomId: roomId} );
      //socket.broadcast.in(roomId).emit('message', 'joined this room.');


    });
  socket.on('search',function(data){
    var checkNum = "SELECT * FROM `uidd2018_groupI`.`roomList` WHERE id =\""+data.search+"\";"
      // console.log(checkNum);
      connection.query(checkNum,(err,rows,field)=>{
        if((rows.length==0)||( rows[0].allnum<=rows[0].num))
        {

        }
        else{
          var update_str = "UPDATE `uidd2018_groupI`.`roomList` SET `num`="+ (rows[0].num+1)+", `mem"+(rows[0].num)+"`=\""+data.id+"\" WHERE id =\""+data.search+"\";";
          connection.query(update_str);
          //     console.log("search succeed join"+data.search)
          socket.join(data.search);
          io.sockets.in(data.search).emit('connectToRoom', {id:data.id,roomId:data.search});

        }
      });

  })
  socket.on('chat message', function(data){
    io.sockets.in(data.roomId).emit('message', data.msg);
  });
  socket.on('auto', function(msg){
    var select = "SELECT * FROM `uidd2018_groupI`.`roomList`;"
      // io.emit('chat message', msg);
      connection.query(select,(err,rows,field)=>{
        var update_str = "UPDATE `uidd2018_groupI`.`roomList` SET `num`="+ (rows[1].num-1)+" WHERE id =\""+rows[1].id+"\";";
        connection.query(update_str);
        socket.join(rows[1].id);
        io.sockets.in(rows[1].id).emit('connectToRoom', rows[1].id);


      })
  });
  socket.on('startGame',function(data){
    //console.log("room "+data+" start");
    io.sockets.in(data).emit('start',data);
  });
  socket.on('position',function(data){
    //console.log("id "+data.id+" roomId "+data.roomId+" position "+data.position)
    socket.broadcast.in(data.roomId).emit('rivalPosition',{id:data.id,position:data.position,playerX:data.playerX})
      //socket.broadcast.in(roomId).emit('message', 'joined this room.');

  })
  socket.on('disconnect',function(roomId){
    console.log("disconnect")
      var delete_data = "DELETE FROM `uidd2018_groupI`.`roomList` WHERE id=\""+roomId+"\";"
      connection.query(delete_data)
      console.log("delete data")
  })

});
