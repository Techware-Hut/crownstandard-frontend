import Link from "next/link";
import type { Chat } from "@/types/conversation";

export default function ChatList({
  chats,
  selectedId,
}: { chats: Chat[]; selectedId?: string }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-2 py-4 space-y-2 overflow-y-auto lg:px-4 scrollbar-hide">

        {chats.map((chat) => {
          console.log(chat);
          
          const name = chat.name ?? "User";

          // ✔ FIX → extract initials
          const initials = name
            .split(" ")
            .map((n: string) => n.charAt(0).toUpperCase())
            .join("");

          const selected = selectedId === chat.id;

          // ✔ FIX → Handle text OR { text, sender }
          const lastText =
            typeof chat.lastMessage === "string"
              ? chat.lastMessage
              : chat.lastMessage?.text ?? "No messages yet";

          return (
            <Link
              key={chat.id}
              href={`/conversation/${chat.id}`}
              className={[
                "flex gap-2 justify-between items-center px-2 lg:px-4 py-3 transition-all rounded-md",
                selected
                  ? "bg-[#1D2432] text-white shadow border border-gray-500"
                  : "bg-white hover:bg-gray-100",
              ].join(" ")}
            >
              {/* Avatar */}
              <div className="relative flex items-center justify-center w-10 h-10 p-2 text-sm font-semibold bg-gray-200 rounded-full">
                {initials}
                <span
                  className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full ${
                    chat.online ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${selected ? "text-white" : "text-gray-900"}`}>
                  {chat.name}
                </p>
                <p className={`text-sm truncate ${selected ? "text-gray-300" : "text-gray-500"}`}>
                  {lastText}
                </p>
              </div>

              {/* Unread Badge */}
              <div className="flex items-center shrink-0">
                {chat.unreadCount && chat.unreadCount > 0 && (
                  <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-200 rounded-full">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </Link>
          );
        })}

      </div>
    </div>
  );
}
