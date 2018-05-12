const express = require('express');
const app = express();
const port = 10081; // 請改成各組分配的port
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended:true});
const fs = require('fs');

app.listen(port);
app.use(express.static(__dirname + '/public'));
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
