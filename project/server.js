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
			var sqli = "INSERT INTO `mytable` ( name , id , pw) VALUES ('"+name+"','"+id+"','"+pw+"')";
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
    res.send('please fill all blanks');
  }
  else{
	  var sqls = "SELECT * FROM `mytable` WHERE id = '"+id+"'";
	  console.log(sqls);
      connection.query(sqls, function(err,result,fields){
		if(err) throw err;
		for( var i = 0 ; i < result.length ; i++){
			if(result[i].id==id) {
				notfound=1;
				if(result[i].pw==pw) res.send('Login succeed');
				else res.send('Login failed');
				break;
			}
		}
		if(notfound == 0)res.send('Login failed');			
	  }); 
  }	  
});
app.post("/gameStart/readRecord",urlencodedParser,function(req,res){
    var id = req.param('ID');
    //console.log(id);
    var str = "";
    connection.query("SELECT * FROM `uidd2018_groupI`.`record` WHERE id = \""+id+"\";",(err,rows,fields)=>{ 
    for(var i=0;i<rows.length;i++)
    {
        str = str + rows[i].time+ "<br>"
          console.log("i = "+i+" "+rows[i].time)
    }
    
    res.send(str);
    })

})
app.post("/javascript-racer/saveRecord",urlencodedParser,function(req,res){
    var id = req.param('ID');
    var time = req.param('THISTIME');
    connection.query("SELECT * FROM `uidd2018_groupI`.`mytable` WHERE id = \""+id+"\";",(err,rows,fields)=>{ 
      if(err) console.log("read err");
      else{
      var play = rows[0]['play']+1;
      var account = rows[0]['name'];
      var update_str = "UPDATE `uidd2018_groupI`.`mytable` SET `play`="+ play+" WHERE id =\""+id+"\";";
      connection.query(update_str);
      var insert_data = "INSERT INTO `uidd2018_groupI`. `record` (id,name,num,time) VALUES(\""+id+"\",\""+account+"\","+play+","+time+");";
      connection.query(insert_data);
      }


    })
})
