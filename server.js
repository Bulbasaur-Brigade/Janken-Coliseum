const server = require('express')();
const http = require('http').createServer(server);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'https://localhost:8080',

    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  socket.on('disconnect', () => {
    console.log('A user disconnected ' + socket.id);
  });
});

http.listen(3000, () => {
  console.log('Server started!');
});
