const exrpess = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

//middleware
const { verifyToken } = require("./middleware/verifyToken");

//routes
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

dotenv.config();
const app = exrpess();
app.use(exrpess.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));

//use routes
app.use("/", userRoutes);
app.use("/", verifyToken, chatRoutes);
app.use("/", verifyToken, messageRoutes);

//connect to Database
mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "MainDB",
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });
///

const server = app.listen(process.env.PORT, () => {
  console.log(`Server running in port: ${process.env.PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  //console.log(socket.id);

  socket.on("join-chat", (chatId) => {
    socket.join(chatId);
    //console.log(socket.id + " Joined chat: " + chatId);
  });

  socket.on("send-message", (data) => {
    socket
      .to(data.chatId)
      .emit("recieve-message", { chatId: data.chatId, message: data.message });
  });

  socket.on("chat-created", (chat) => {
    socket.broadcast.emit("chat-created", chat);
  });

  // Handle disconnection events
  socket.on("disconnect", () => {
    //save messages to db
    //console.log("A user disconnected!");
  });
});
