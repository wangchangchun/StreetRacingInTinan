const express = require('express');
const app = express();
const port = 10088; // 請改成各組分配的port
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended:true});
const fs = require('fs');
//const config = require('./config');
const mysql = require('mysql');

const config = {
    host:'localhost',
    user:'uidd2018_groupI',
    password:'TSRgogogo',
    database:'uidd2018_groupI'
};

app.listen(port);
app.use(express.static(__dirname));
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
app.post("/sign_up_data",urlencodedParser,function(req,res){
  if(req.body.ID==""||req.body.PASSWORD==""||req.body.NAME==""){
    res.send('please fill all blanks');
  }
  else{
    fs.readFile('name.json',{},function(err,data){
      var user;
      //var id,password,name;
      if(err){throw err;}
      user=JSON.parse(data);
      if(req.body.ID==user[req.body.NAME])
        res.send('user already exist!');
      if(!user.hasOwnProperty(req.body.ID)){
        user[req.body.ID]=req.body.NAME;
        //user[req.body.NAME]=req.body.PASSWORD;
        fs.writeFile("name.json",JSON.stringify(user),function(err){if(err)throw err;});
        res.send('user saved');
      }
    });
  }
});
app.post("/login_data",urlencodedParser,function(req, res) {
  if(req.body.ID==""||req.body.PASSWORD==""){
    res.send('please fill all blanks');
  }
  else{
    fs.readFile('name.json',{},function(err,data) {
      if(err)throw err;
      user=JSON.parse(data);
      if(!user.hasOwnProperty(req.body.ID)){
        res.send('user not exist!');
      }
      /*else if(!user.hasOwnProperty(req.body.PASSWORD)){
        res.send('Password is wrong');
        }*/
      else{
        res.send('Hello,'+user[req.body.ID]);
      }
    });
  }
});
