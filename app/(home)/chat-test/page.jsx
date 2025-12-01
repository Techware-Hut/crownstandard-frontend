"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function ChatTest() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  const THREAD = "692944cbbf91be9b3894e3d5"; // demo thread

  useEffect(() => {
    const s = io("http://localhost:5000", {
      transports: ["websocket"],
      withCredentials: true // ⬅ enables cookie auth for socket
    });

    setSocket(s);

    // Debug all socket events
    s.onAny((e, d) => console.log("📡", e, d));

    // join instantly
    s.emit("join_thread", THREAD);

    // message listener
    s.on("new_message", (msg) => {
      console.log("🔥 LIVE INCOMING:", msg);
      setMessages(prev => [...prev, msg]);
    });

    return () => s.disconnect();
  }, []);

  // ⬇ sending uses cookies → must include credentials
  const sendMessage = async (text) => {
    await fetch(`http://localhost:5000/api/chat/messages/${THREAD}`, {
      method: "POST",
      credentials: "include", // ⬅ REQUIRED for cookie auth
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>⚡ Crownstandard Chat Test (Cookie Auth Ready)</h2>

      <input id="msg" style={{ width: 200 }} placeholder="type message..." />
      <button
        onClick={() => {
          const val = document.getElementById("msg").value;
          sendMessage(val);
          document.getElementById("msg").value = "";
        }}
      >
        SEND
      </button>

      <h3>📥 Live Messages</h3>
      {messages.map((m, i) => (
        <div key={i} style={{ color: "#0f0", marginTop: 6 }}>
          {m.message}
        </div>
      ))}
    </div>
  );
}
