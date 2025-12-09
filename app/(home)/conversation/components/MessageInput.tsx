"use client";

import { useState, useRef } from "react";

export default function MessageInput({
  threadId,
  socket
}: {
  threadId: string;
  socket: any;
}) {

  const [text, setText] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const send = async () => {
    if (!text.trim()) return;

    sendStoppedTyping();

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

  // 🔥 Helper to clear the indicator

  const sendStoppedTyping = () => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
        // Send the event if the socket is ready and text is not empty
        if (socket && text.length > 0) {
            socket.emit("stopped_typing", { threadId });
        }
    };
     
// 🔥 2. Typing/Debounce Handler

    const handleTyping = (newText: string) => {
        setText(newText);
        
        if (!socket || !threadId) return;

        if (newText.length > 0) {
            // A. If the user was NOT typing, emit the 'typing' event
            if (!typingTimeoutRef.current) {
                socket.emit("typing", { threadId });
            }

            // B. Reset the 'stopped_typing' timer
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // C. Set a new timer: If no new input after 3 seconds, send 'stopped_typing'
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit("stopped_typing", { threadId });
                typingTimeoutRef.current = null;
            }, 3000); // 3-second debounce
            
        } else {
            // D. If input is emptied, stop typing immediately
            sendStoppedTyping();
        }
    };

  return (
    <div className="flex items-center p-4 bg-white border-t border-gray-200">
      <input
        type="text"
        placeholder="Type Your Message..."
        className="flex-1 px-3 py-2 text-sm border rounded-md outline-none focus:ring-1 focus:ring-amber-600"
        value={text}
        onChange={(e) => handleTyping(e.target.value)} 
        onKeyDown={(e) => e.key === "Enter" && send()}
        // onChange={(e) => setText(e.target.value)}
        // onKeyDown={(e) => e.key === "Enter" && send()} 
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
