export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  fullName: string;
  bio: string;
  isOnline: boolean;
  lastSeen: string;
  followers: string[];
  following: string[];
}

export interface Message {
  _id: string;
  conversation: string;
  sender: User;
  content: string;
  messageType:
    | "text"
    | "image"
    | "video"
    | "audio"
    | "file"
    | "voice"
    | "gif"
    | "call";

  mediaUrl: string;
  mediaThumbnail?: string;
  fileName?: string;
  fileSize?: number;
  duration?: number;
  seenBy: { user: User; seenAt: string }[];
  deliveredTo: { user: User; deliveredAt: string }[];
  reactions: { user: User; emoji: string }[];
  replyTo?: Message;
  forwardedFrom?: User;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  participant: User;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
  theme?: string;
  emoji?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface TypingEvent {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

export interface CallData {
  type: "video" | "audio";
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
}
