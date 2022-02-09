// const server = require("express")();
// const http = require("http").createServer(server);
// const cors = require("cors");

// const players = {};
// const io = require("socket.io")(http, {
//   cors: {
//     origin: "https://localhost:8080",

//     credentials: true,
//   },
// });

// io.on("connection", (socket) => {
//   console.log("A user connected: " + socket.id);

//   socket.on("disconnect", () => {
//     console.log("A user disconnected " + socket.id);
//     delete players[socket.id];
//     io.emit("disconnect", socket.id);
//   });

//   players[socket.id]({
//     rotation: 0,
//     x: 400,
//     y: 300,
//     playerId: socket.id,
//   });

//   socket.emit("currentPlayers", players);

//   socket.broadcast.emit("newplayer", players[socket.id]);
//   console.log(players);
// });

// http.listen(3000, () => {
//   console.log("Server started!");
// });
