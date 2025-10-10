import ChatList from "./components/ChatList";
import { chats } from "./data";

export default function ConversationIndexPage() {

  const hasChats = chats && chats.length > 0;

  if (!hasChats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[95vh] bg-white max-w-7xl mx-auto text-center">
        <div className="p-10">
          {/* Empty state graphic / icon */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center w-32 h-32 mb-4 bg-white rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 10h8m-8 4h5m9 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-700">
              No conversations yet
            </p>
            <p className="max-w-sm mt-1 text-sm text-gray-500">
              You haven’t started any chats yet. Once you message a customer or
              service provider, they’ll appear here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col container 3xl:max-w-[1280px] bg-white">
      {/* Heading outside */}
      <div className="pt-10">
        <h1 className="text-2xl font-bold text-gray-900">Your Conversations</h1>
        <p className="mt-1 text-gray-500">
          Manage your messages with service providers and customers
        </p>
      </div>

      <div className="flex gap-4 lg:gap-8 pb-10 mt-6 md:flex-1">
        {/* List */}
        <div className="md:w-1/3 w-full flex flex-col overflow-hidden pt-4 border border-gray-100 rounded-xl bg-[#F3F1ED] h-[75vh]">
          <ChatList chats={chats} />
        </div>

        {/* Empty state (no chat open) */}

        <div className="flex-1 border border-gray-100 rounded-xl hidden md:block">
          <div className="grid h-full p-10 text-center place-items-center">
            {/* <div className="hidden md:block"> */}
              <p className="text-lg font-medium text-gray-700">No conversation selected</p>
              <p className="mt-1 text-sm text-gray-500">
                Choose a chat from the left to start messaging.
              </p>
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
