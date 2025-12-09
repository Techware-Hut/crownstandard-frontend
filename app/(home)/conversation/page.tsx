"use client";

import { useEffect, useState, useRef } from "react";
import ChatList from "./components/ChatList";
import axios from "@/lib/axios";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { ChatThreadUI } from "@/types/conversation";

export default function ConversationIndexPage() {

  const [threads, setThreads] = useState<ChatThreadUI[]>([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const userId = Cookies.get("user_id");

  /* ================= LOAD THREADS ================= */
  useEffect(() => {
    loadThreads();
    startSocketListener();
  }, []);

  async function loadThreads() {
    try {
      const res = await axios.get("/chat/threads", { withCredentials: true });

      const formatted: ChatThreadUI[] = res.data.threads.map((t: any) => {
        const other = t.participants.find((p: any) => p._id !== userId);   // ← correct user name
        return {
          id: t._id,
          name: other?.name || "Unknown User",
          lastMessage: t.lastMessage?.text || "No messages yet",
          lastActivityAt: t.lastActivityAt,
          participants: t.participants,
          online: t.online || false,  
        };
      });

      console.log(formatted,"formted")

      setThreads(formatted);
    } catch (err) {
      console.log("Error fetching threads:", err);
    } finally {
      setLoading(false);
    }
  }

  /* =============== SOCKET LIVE LISTENER =============== */
  function startSocketListener() {
    const socket = io(process.env.NEXT_PUBLIC_API_BASE!, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("new_message", (msg: any) => {
      setThreads(prev =>
        prev
          .map(t =>
            t.id === msg.threadId
              ? { ...t, lastMessage: msg.message, lastActivityAt: new Date() }
              : t
          )
          .sort((a, b) =>
            new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
          )
      );
    });
  }

  /* ================= UI ================= */
  if (loading) return <p className="p-10">Loading chats...</p>;

  return (
    <div className="flex flex-col container 3xl:max-w-[1280px] bg-white">
      <div className="pt-10">
        <h1 className="text-2xl font-bold text-gray-900">Your Conversations</h1>
        <p className="mt-1 text-gray-500">Manage your messages</p>
      </div>

      <div className="flex gap-4 pb-10 mt-6 lg:gap-8">

        {/* LEFT → CHAT LIST */}
        <div className="md:w-1/3 w-full flex flex-col overflow-hidden pt-4 border border-gray-100 rounded-xl bg-[#F3F1ED] h-[75vh]">
          <ChatList chats={threads} />
        </div>

        {/* RIGHT → EMPTY VIEW */}
        <div className="items-center justify-center flex-1 hidden border md:flex rounded-xl">
          <p className="text-gray-600">Select a conversation</p>
        </div>

      </div>
    </div>
  );
}
