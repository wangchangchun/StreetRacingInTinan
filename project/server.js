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
    console.log(sqls);
    connection.query(sqls, function(err,result,fields){
      if(err) throw err;
      for( var i = 0 ; i < result.length ; i++){
        if(result[i].id==id) {res.send('Your id has been used.');notfound=1;break;}
      }
      if(notfound == 0){
        var sqli = "INSERT INTO `mytable` ( name , id , pw,play) VALUES ('"+name+"','"+id+"','"+pw+"',0)";
        console.log(sqli);
        connection.query(sqli, function(err,result){
          if(err) throw err;
          console.log("signup");
          res.send('Sign up succeed');
        });
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
    console.log(sqls);
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
        }
      res.send("login succeed!")

    }) 
})
app.post("/gameStart/readRecord",urlencodedParser,function(req,res){
  var id = req.param('ID');
  //console.log(id);
  var str = "";
  connection.query("SELECT * FROM `uidd2018_groupI`.`record` WHERE id = \""+id+"\";",(err,rows,fields)=>{ 
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
  console.log(id +" "+time)
    connection.query("SELECT * FROM `uidd2018_groupI`.`mytable` WHERE id = \""+id+"\";",(err,rows,fields)=>{ 
      if(err) console.log("read err");
      else{
        var play = rows[0]['play']+1;
        var account = rows[0]['name'];
        console.log(account)
          var update_str = "UPDATE `uidd2018_groupI`.`mytable` SET `play`="+ play+" WHERE id =\""+id+"\";";
        connection.query(update_str);
        var insert_data = "INSERT INTO `uidd2018_groupI`. `record` (id,name,num,time) VALUES(\""+id+"\",\""+account+"\","+play+","+time+");";
        connection.query(insert_data);
      }
      res.send("OK")
    })
})
app.post("/readBtn",urlencodedParser,function(req,res){
  connection.query("SELECT * FROM `uidd2018_groupI`.`roomList`" ,(err,rows,fields)=>{
    var str = "";
    for(var i=0;i<rows.length;i++){
      str = str +rows[i].id+" ";
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
    console.log(data.id);
    var roomId = data.id;
    var memNum = data.num;
    var insert_data = "INSERT INTO `uidd2018_groupI`. `roomList` (id,num) VALUES(\""+roomId+"\","+memNum+");";
    connection.query(insert_data);
    socket.join(roomId);
    io.sockets.in(roomId).emit('connectToRoom', roomId );
  });
  socket.on('search',function(data){
    var checkNum = "SELECT * FROM `uidd2018_groupI`.`roomList` WHERE id =\""+data+"\";"
      connection.query(checkNum,(err,rows,field)=>{
        if(rows.length==0)
        {

        }
        else{
          var update_str = "UPDATE `uidd2018_groupI`.`roomList` SET `num`="+ (rows[0].num-1)+" WHERE id =\""+data+"\";";
          connection.query(update_str);
          socket.join(data);
          io.sockets.in(data).emit('connectToRoom', data);

        }
      });

  })
  socket.on('auto', function(msg){
    var select = "SELECT * FROM `uidd2018_groupI`.`roomList`;"
    //io.emit('chat message', msg);
      connection.query(select,(err,rows,field)=>{
          var update_str = "UPDATE `uidd2018_groupI`.`roomList` SET `num`="+ (rows[1].num-1)+" WHERE id =\""+rows[1].id+"\";";
          connection.query(update_str);
          socket.join(rows[1].id);
          io.sockets.in(rows[1].id).emit('connectToRoom', rows[1].id);
      
      
      })
  });
  //socket.on('start',gameStart);
  socket.on('disconnect',function(roomId){
    console.log("disconnect")
      var delete_data = "DELETE FROM `uidd2018_groupI`.`roomList` WHERE id=\""+roomId+"\";"
      connection.query(delete_data)
      console.log("delete data")
  })

});
