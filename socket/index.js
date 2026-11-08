const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const socketIO = require("socket.io");
const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

const io = socketIO(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Eshop-MV real-time service is running.");
});

let users = [];

const addUser = (userId, socketId) => {
  // Replace any stale connection for this user before registering the new socket.
  users = users.filter((user) => user.userId !== userId);
  users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (receiverId) => {
  return users.find((user) => user.userId === receiverId);
};

const createMessage = ({ senderId, receiverId, text, images }) => ({
  senderId,
  receiverId,
  text,
  images,
  seen: false,
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("addUser", (userId) => {
    if (!userId) return;
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  const messages = {};

  socket.on("sendMessage", ({ senderId, receiverId, text, images } = {}) => {
    if (!senderId || !receiverId) return;
    const message = createMessage({ senderId, receiverId, text, images });
    if (!messages[receiverId]) messages[receiverId] = [];
    messages[receiverId].push(message);

    const recipient = getUser(receiverId);
    if (recipient) io.to(recipient.socketId).emit("getMessage", message);
  });

  socket.on("messageSeen", ({ senderId, receiverId, messageId } = {}) => {
    const recipient = getUser(senderId);
    if (messages[senderId]) {
      const message = messages[senderId].find(
        (item) => item.receiverId === receiverId && item.id === messageId
      );
      if (message) {
        message.seen = true;
        if (recipient) {
          io.to(recipient.socketId).emit("messageSeen", {
            senderId,
            receiverId,
            messageId,
          });
        }
      }
    }
  });

  socket.on("updateLastMessage", ({ lastMessage, lastMessageId } = {}) => {
    io.emit("getLastMessage", { lastMessage, lastMessagesId: lastMessageId });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log(`Eshop-MV Socket.IO service listening on port ${process.env.PORT || 4000}`);
});
