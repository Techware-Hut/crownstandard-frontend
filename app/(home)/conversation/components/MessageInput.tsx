"use client";

import { useState } from "react";

export default function MessageInput({
  threadId,
  socket
}: {
  threadId: string;
  socket: any;
}) {

  const [text, setText] = useState("");

  const send = async () => {
    if (!text.trim()) return;

    try {
      // 1️⃣ Save in DB via API
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/chat/messages/${threadId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // include cookies for auth_token
        body: JSON.stringify({ message: text })
      });

      // 2️⃣ Emit real-time event to receiver
      socket.emit("send_message", {
        threadId,
        message: text
      });

      setText(""); // reset input

    } catch (err) {
      console.log("Message send failed", err);
    }
  };

  return (
    <div className="flex items-center p-4 bg-white border-t border-gray-200">
      <input
        type="text"
        placeholder="Type Your Message..."
        className="flex-1 px-3 py-2 text-sm border rounded-md outline-none focus:ring-1 focus:ring-amber-600"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}  // SEND ON ENTER
      />

      <button
        onClick={send}
        className="px-6 py-2 ml-3 text-white rounded-md bg-amber-600 hover:bg-amber-700"
      >
        Send
      </button>
    </div>
  );
}
