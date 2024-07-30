import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, TextField, Typography } from "@mui/material";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });
    socket.on("recieve-message", (data) => {
      console.log(data);
      setMessages((prevData) => [data, ...prevData]);
    });
    socket.on("welcome", (msg) => {
      console.log(msg);
    });
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" component="div" gutterBottom>
        WTF!
      </Typography>
      <Typography variant="h5" component="div" gutterBottom>
        <span
          style={{
            fontWeight: "bold",
          }}
        >
          Socket id:
        </span>{" "}
        {socketId}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          id="outlined-basic"
          label="outlined"
          variant="outlined"
        />
        <TextField
          value={room}
          onChange={(e) => {
            setRoom(e.target.value);
          }}
          id="outlined-basic"
          label="Room"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
      <h4
        style={{
          fontWeight: "bold",
        }}
      >
        Recieved Message:
      </h4>
      {messages.map((m, idx) => (
        <Typography style={{
          fontWeight: "lighter",
          fontSize: "14px"
        }} key={idx} variant="h6" component="div" gutterBottom>
        {m}
      </Typography>
      ))}
    </Container>
  );
};

export default App;
