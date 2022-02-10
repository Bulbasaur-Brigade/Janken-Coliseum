const server = require('express')();
const http = require('http').createServer(server);
const path = require('path');
const serverStatic = require('serve-static');
const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
  },
});

server.use(cors());
server.use(serverStatic(__dirname + '/dist'));

io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  socket.on('disconnect', () => {
    console.log('A user disconnected ' + socket.id);
  });

  // socket.emit("currentPlayers", players);

  // socket.broadcast.emit("newplayer", players[socket.id]);
  // console.log(players);
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log('Server started! Listening on: ', PORT);
});
