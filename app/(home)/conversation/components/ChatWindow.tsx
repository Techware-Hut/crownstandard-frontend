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
  const [peerId, setPeerId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isPeerTyping, setIsPeerTyping] = useState(false);
    
  // 🔥 NEW: Ref for managing the typing debounce timer
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const userId = Cookies.get("user_id");  

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

  /* ---------------- Load thread info (FIXED) --------------- */
  async function loadThreadMeta() {
    try {
      const res = await axios.get(`/chat/thread/${threadId}`, { withCredentials: true });
      const participants = res.data.thread.participants;
      const other = participants.find((p: any) => p._id !== userId);

      setPeerName(other?.name || "Chat Partner");
      // 🔥 FIX: Must set peerId here
      setPeerId(other?._id?.toString() || null); 
    } catch (err) {
      console.error("Thread meta fetch failed", err);
    }
  }

// ----------------------- DATA & META LOADING (Run only on threadId change) -----------------------
  useEffect(() => {
    loadMessages();
    loadThreadMeta();
  }, [threadId]);


// ----------------------- SOCKET INITIALIZATION & LISTENERS (Run after peerId is set) -----------------------
  useEffect(() => {
    // 1. Prevent socket initialization if peerId or threadId are missing
    if (!peerId || !threadId) {
        // If running without peerId, ensure any old socket is disconnected
        if (socketRef.current) socketRef.current.disconnect();
        return;
    }

    console.log(`[Socket] Initializing for thread: ${threadId}, peer: ${peerId}`);

    const socket: Socket = io(process.env.NEXT_PUBLIC_API_BASE!, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;
    socket.emit("join_thread", threadId);

    // New Message Listener
    socket.on("new_message", (msg: any) => {
      const formatted = { ...msg, isMine: msg.senderId?.toString() === userId };
      setMessages(prev => [...prev, formatted]);
      scrollBottom();
      onNewMessage({ threadId, message: msg.message });
    });

    // 🔥 TYPING LISTENERS (This now captures the correct peerId value)
    socket.on("typing", ({ userId: senderId }: { userId: string }) => {
        if (senderId === peerId) {
            console.log(`[Typing] ${peerName} started typing.`);
            setIsPeerTyping(true);
        }
    });

    socket.on("stopped_typing", ({ userId: senderId }: { userId: string }) => {
        if (senderId === peerId) {
            console.log(`[Typing] ${peerName} stopped typing.`);
            setIsPeerTyping(false);
        }
    });

    return () => {
        console.log(`[Socket] Cleaning up listeners for thread: ${threadId}`);
      if (socket) {
          socket.off("new_message");
          socket.off("typing");
          socket.off("stopped_typing");
          socket.disconnect(); 
          socketRef.current = null;
      }
    };
  }, [threadId, peerId]); // 💥 CRITICAL: This re-runs only when peerId is available and correct

  /* ------------------------- Helper: Stop Typing ------------------------ */
  const sendStoppedTyping = (currentSocket: Socket | null) => {
    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
    }
    if (currentSocket && input.length > 0) {
        currentSocket.emit("stopped_typing", { threadId });
    }
  };


  /* ------------------------- Typing/Debounce Handler ------------------------ */
  const handleTyping = (newText: string) => {
    setInput(newText);
    const currentSocket = socketRef.current;
    
    if (!currentSocket || !threadId) return;

    if (newText.length > 0) {
        // 1. If not currently typing (no timer), emit 'typing'
        if (!typingTimeoutRef.current) {
            currentSocket.emit("typing", { threadId });
        }

        // 2. Clear previous timeout (user typed again)
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // 3. Set new timeout: emit 'stopped_typing' if user pauses for 3s
        typingTimeoutRef.current = setTimeout(() => {
            currentSocket.emit("stopped_typing", { threadId });
            typingTimeoutRef.current = null;
        }, 3000); 
    } else {
        // If input is cleared, stop typing immediately
        sendStoppedTyping(currentSocket);
    }
  };


  /* ------------------------- Send Message ------------------------ */
  async function sendMessage() {
    if (!input.trim()) return;
    
    // Ensure typing indicator is cleared before sending the message
    sendStoppedTyping(socketRef.current); 

    await axios.post(`/chat/messages/${threadId}`, { message: input }, { withCredentials: true });
    setInput("");
  }

  return (
    <div className="flex flex-col h-full">

      {/* Chat User Name */}
      <div className="p-4 text-lg font-semibold bg-white border-b">
        {peerName}

 {/* 🔥 Indicator in the Header (Styled to be smaller) */}
        {isPeerTyping && (
            <div className="text-xs font-normal text-amber-600 italic mt-0.5">
                {/* You can add an animated typing ellipsis here for a cleaner look */}
                Typing...
            </div>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollerRef} className="flex-1 p-4 space-y-3 overflow-y-auto bg-white">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.isMine ? "justify-end" : "justify-start"}`}>
            <div className={`px-3 py-2 rounded-lg text-sm max-w-xs ${m.isMine ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-800"
              }`}>
              {m.message}
            </div>
          </div>
        ))}
      
      {/* 🔥 NEW: Typing Indicator UI */}
      {isPeerTyping && (
          <div className="flex justify-start pt-1">
              <div className="px-3 py-2 rounded-lg text-sm text-gray-500 italic max-w-xs bg-gray-100">
                  {peerName} is typing...
              </div>
          </div>
      )}
      {/* END TYPING INDICATOR UI */}
      </div>

      {/* Input */}
      <div className="flex gap-2 p-3 bg-white border-t">
        <input
          className="flex-1 px-3 py-2 border rounded-md"
          placeholder="Type a message..."
          value={input}
          // 🔥 USE THE DEBOUNCE HANDLER
          onChange={e => handleTyping(e.target.value)}
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