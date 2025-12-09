"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { ChatThreadUI } from "@/types/conversation";

export default function ConversationDetailPage() {

  const { id: threadId } = useParams();       // Active thread being viewed
  const userId = Cookies.get("user_id");      // current logged-in user

  const [threads, setThreads] = useState<ChatThreadUI[]>([]);
  const [selectedThread, setSelectedThread] = useState<ChatThreadUI | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH THREAD LIST ================= */
  useEffect(() => { loadThreads(); }, []);

  async function loadThreads() {
    try {
      const res = await axios.get("/chat/threads", { withCredentials: true });

      const formatted: ChatThreadUI[] = res.data.threads.map((t: any) => {
        const other = t.participants.find((p: any) => p._id !== userId); // 👈 FIX NAME
        return {
          id: t._id,
          name: other?.name || "Unknown User",
          participants: t.participants,
          lastMessage: t.lastMessage?.text || "No messages yet",
          lastActivityAt: t.lastActivityAt,
        };
      });

      // latest threads first
      formatted.sort(
        (a: any, b: any) =>
          new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
      );

      setThreads(formatted);
    } catch (err) {
      console.log("❌ Thread load failed", err);
    } finally {
      setLoading(false);
    }
  }

  /* ===== When URL or list changes, select active thread ===== */
  useEffect(() => {
    if (!threads.length) return;

    const active = threads.find(t => t.id === threadId);
    setSelectedThread(active || null);
  }, [threads, threadId]);

  /* 🔥 Called by ChatWindow whenever message is sent/received */
  function handleNewMessage({ threadId, message }: { threadId: string; message: string }) {

    setThreads(prev =>
      prev
        .map(t =>
          t.id === threadId
            ? { ...t, lastMessage: message, lastActivityAt: new Date() }
            : t
        )
        .sort((a, b) =>
          new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
        )
    );
  }

  /* ================= UI ================= */
  if (loading) return <p className="p-10">Loading...</p>;
  if (!selectedThread) return <p className="p-10">Chat not found</p>;

  return (
    <div className="flex flex-col container 3xl:max-w-[1280px] bg-white">

      <div className="pt-10">
        <h1 className="text-2xl font-bold text-gray-900">Chat Conversation</h1>
      </div>

      <div className="flex gap-4 pb-10 mt-6">

        {/* LEFT — THREAD LIST */}
        <div className="hidden md:flex md:w-1/3 flex-col overflow-hidden pt-4 border border-gray-100 rounded-xl bg-[#F3F1ED] h-[75vh]">
          <ChatList chats={threads} selectedId={threadId as string} />
        </div>

        {/* RIGHT — CHAT WINDOW */}
        <div className="flex-1 border border-gray-100 rounded-xl h-[75vh] overflow-hidden">
          <ChatWindow
            threadId={threadId as string}
            onNewMessage={handleNewMessage}
          />
        </div>

      </div>
    </div>
  );
}
