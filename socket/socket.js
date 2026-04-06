const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer(app);
const io = new server(server, {
  cors: {
    origin: [
      "https://smart-x-front-end.vercel.app",
      "https://smart-x-front-end-git-main-zoya-shaikhs-projects.vercel.app",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const allOnlineUsers = {};

const getReceiverSocketId = (receiverId)=>{
  return allOnlineUsers[receiverId];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId !== undefined) {
    allOnlineUsers[userId] = socket.id;
    io.emit("all-online-users", Object.keys(allOnlineUsers));
  }

  socket.on("disconnect", () => {
    delete allOnlineUsers[userId];
    io.emit("all-online-users", Object.keys(allOnlineUsers));
  });
});

module.exports = { app, server, io, getReceiverSocketId };
