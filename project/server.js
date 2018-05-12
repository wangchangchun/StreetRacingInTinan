const express = require('express');
const app = express();
const port = 10081; // 請改成各組分配的port
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended:true});
const fs = require('fs');

app.listen(port);
app.use(express.static(__dirname + '/public'));
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
		else if(!user.hasOwnProperty(req.body.PASSWORD)){
			res.send('Password is wrong');
		}
		else{
			res.send('Hello,'+user[req.body.ID]);
		}
		});
	}
});
app.post("/sign_up_result",urlencodedParser,function(req,res){
	if(req.body.ID==""||req.body.PASSWORD==""||req.body.NAME==""){
    res.send('please fill all blanks');
    }
    else{
		fs.readFile('name.json',{},function(err,data){
		var user;
		if(err){throw err;}
		user=JSON.parse(data);
		if(!user.hasOwnProperty(req.body.ID)){
			user[req.body.ID]=[req.body.PASSWORD:req.body.NAME];
			fs.writeFile("name.json",JSON.stringify(user),functtion(err){if(err)throw err;});
			res.send('user saved');
			}
		});
	}
});