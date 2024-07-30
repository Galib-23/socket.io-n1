import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = 3000;
const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("user connected");
  console.log("ID: ", socket.id);

  socket.on("message", ({message, room}) => {
    console.log(message);
    io.to(room).emit("recieve-message", message);
  });
});

app.get("/", (req, res) => {
  res.send("Websocket server running...");
});
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
