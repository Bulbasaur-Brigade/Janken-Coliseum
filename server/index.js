const express = require('express');
const app = express();
// const server = require('http').Server(app);
// const io = require('socket.io')(server);
const path = require('path');
const socketio = require('socket.io')

const server = app.listen(8080, function () {
    console.log(`Listening on http://localhost:${server.address().port}`);
});

const io = socketio(server);

// app.use('/css',express.static(__dirname + '/css'));
// app.use('/js',express.static(__dirname + '/js'));
// app.use('/assets',express.static(__dirname + '/assets'));
// app.use(express.static(__dirname + '../public'));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, '../', 'index.html'))
});

// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/index.html');
// });

// app.get('/',function(req,res){
//     res.sendFile(__dirname+'../index.html');
// });

// app.get('/',function(req,res){
//     res.sendFile(__dirname+'/index.html');
// });

// app.get('/',function(req,res){
//   res.sendFile(__dirname+'/index.html');
// });

io.on("connection", function (socket) {
  console.log("a user connected");})

// server.listen(8080,function(){ // Listens to port 8080
//   console.log('Listening on '+server.address().port);
// });

