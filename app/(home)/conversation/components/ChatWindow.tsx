"use client";

import { useEffect, useRef, useState } from "react";
import axios from "@/lib/axios";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

export default function ChatWindow({
  threadId,
  onNewMessage,
}: {
  threadId: string;
  onNewMessage: (msg: any) => void;
}) {

  const [messages, setMessages] = useState<any[]>([]);
  const [peerName, setPeerName] = useState("Chat Partner");
  const [input, setInput] = useState("");

  const scrollerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const userId = Cookies.get("user_id");   // Logged-in user

  /* ------------------------ Auto-scroll ------------------------ */
  const scrollBottom = () =>
    setTimeout(() => {
      scrollerRef.current?.scrollTo({
        top: scrollerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 80);

  /* --------------------- Load messages ------------------------ */
  async function loadMessages() {
    try {
      const res = await axios.get(`/chat/messages/${threadId}`, { withCredentials: true });

      const formatted = res.data.messages.map((m: any) => ({
        ...m,
        isMine: m.senderId?.toString() === userId
      }));

      setMessages(formatted);
      scrollBottom();
    } catch (err) {
      console.error("Fetch messages failed:", err);
    }
  }

  /* ---------------- Load thread info to get peer name --------------- */
  async function loadThreadMeta() {
    try {
      const res = await axios.get(`/chat/thread/${threadId}`, { withCredentials: true });

      const participants = res.data.thread.participants;
      const other = participants.find((p: any) => p._id !== userId);

      setPeerName(other?.name || "Chat Partner");
    } catch (err) {
      console.error("Thread meta fetch failed", err);
    }
  }

  /* ----------------------- WebSocket Join ----------------------- */
  useEffect(() => {
    loadMessages();
    loadThreadMeta();

    const socket: Socket = io(process.env.NEXT_PUBLIC_API_BASE!, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;
    socket.emit("join_thread", threadId);

    socket.on("new_message", (msg: any) => {
      const formatted = {
        ...msg,
        isMine: msg.senderId?.toString() === userId,
      };

      setMessages(prev => [...prev, formatted]);
      scrollBottom();
      onNewMessage({ threadId, message: msg.message });
    });

    return () => {
      if (socket) socket.disconnect();   // 🔥 Cleanup explicitly inside a block
    };
  }, [threadId]);


  /* ------------------------- Send Message ------------------------ */
  async function sendMessage() {
    if (!input.trim()) return;

    await axios.post(`/chat/messages/${threadId}`, { message: input }, { withCredentials: true });
    setInput("");
  }

  return (
    <div className="flex flex-col h-full">

      {/* 🔥 Correct Chat User Name */}
      <div className="p-4 text-lg font-semibold bg-white border-b">
        {peerName}
      </div>

      {/* 🔥 Messages */}
      <div ref={scrollerRef} className="flex-1 p-4 space-y-3 overflow-y-auto bg-white">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.isMine ? "justify-end" : "justify-start"}`}>
            <div className={`px-3 py-2 rounded-lg text-sm max-w-xs ${m.isMine ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-800"
              }`}>
              {m.message}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 p-3 bg-white border-t">
        <input
          className="flex-1 px-3 py-2 border rounded-md"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-5 text-white rounded-md bg-amber-600 hover:bg-amber-700"
        >
          Send
        </button>
      </div>

    </div>
  );
}
