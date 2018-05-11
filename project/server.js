const express = require('express')
const app = express()
const port = 10081 // 請改成各組分配的port

app.listen(port)
app.use(express.static(__dirname + '/public'))
app.get('/get_data', function(req, res) {
    res.send(`<h1>Hello, ${req.query.fname} ${req.query.lname}</h1>`)
})
app.get("/ajax_data", function(req, res) {
  res.send(`Hello, ${req.query.fname} ${req.query.lname}`)
})
