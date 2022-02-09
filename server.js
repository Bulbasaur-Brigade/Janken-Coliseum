const server = require("express")();
const http = require("http").createServer(server);
const cors = require("cors");

const players = {};
const io = require("socket.io")(http, {
  cors: {
    origin: "https://localhost:8080",

    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected " + socket.id);
    delete players[socket.id];
    io.emit("disconnect", socket.id);
  });

  players[socket.id]({
    rotation: 0,
    x: 400,
    y: 300,
    playerId: socket.id,
  });

  socket.emit("currentPlayers", players);

  socket.broadcast.emit("newplayer", players[socket.id]);
  console.log(players);

  // update number of players

  // const gameRoom = {
  //   players: {},
  //   numPlayers: 0,
  // };
  // set initial state
  //   socket.emit("setState", gameRoom);

  //   // send the players object to the new player
  //   socket.emit("currentPlayers", {
  //     players: gameRoom.players,
  //     numPlayers: gameRoom.numPlayers,
  //   });

  //   // update all other players of the new player
  //   socket.to(gameRoom).emit("newPlayer", {
  //     numPlayers: gameRoom.numPlayers,
  //   });
  // });
  // // when a player moves, update the player data
  // socket.on("playerMovement", function (data) {
  //   const { x, y, gameRoom } = data;
  //   gameRoom.players[socket.id].x = x;
  //   gameRoom.players[socket.id].y = y;
  //   // emit a message to all players about the player that moved
  //   socket.to(gameRoom).emit("playerMoved", gameRoom.players[socket.id]);
  // });
});

http.listen(3000, () => {
  console.log("Server started!");
});
