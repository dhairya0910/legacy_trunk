import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  // Join a room
  const joinRoom = () => {
    if (room.trim() !== "") {
      socket.emit("join_room", room);
      setJoined(true);
    }
  };

  // Send a message to the current room
  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("send_message", { room, message });
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }} className="text-black">
      {!joined ? (
        <div>
          <h2> Join a Room</h2>
          <input
            type="text"
            placeholder="Enter room name..."
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            style={{ padding: "0.5rem", marginRight: "0.5rem" }}
          />
          <button onClick={joinRoom} style={{ padding: "0.5rem 1rem" }}>
            Join
          </button>
        </div>
      ) : (
        <div>
          <h2>💬 Room: {room}</h2>

          <div
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              height: "200px",
              overflowY: "auto",
              marginBottom: "1rem",
            }}
          >
            {messages.map((msg, i) => (
              <p key={i}>{msg}</p>
            ))}
          </div>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            style={{ padding: "0.5rem", width: "70%" }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "0.5rem 1rem",
              marginLeft: "1rem",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
