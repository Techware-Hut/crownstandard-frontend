export type Sender = "me" | "them";

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  seen: boolean; // false => show "New" label
  ts?: string;
}

export interface Chat {
  id: string;
  name: string;
  lastMessage?: string | { text: string; sender: string };
  unreadCount?: number;
  online?: boolean;
}

export interface Participant {
  _id: string;
  name: string;
  role?: string;
  profilePhoto?: string;
}

export interface ChatThreadUI {
  id: string;
  participants: Participant[];  // full list
  name: string;                 // derived for UI only
  lastMessage: string;
  lastActivityAt: string | Date;
  unreadCount?: number;
  online?: boolean;
}
