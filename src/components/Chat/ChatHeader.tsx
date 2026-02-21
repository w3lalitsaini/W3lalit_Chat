import React, { useState } from "react";
import { Phone, Video, Info, ChevronLeft } from "lucide-react";
import type { Conversation } from "../../types";
import ThemeSwitcher from "./ThemeSwitcher";

interface ChatHeaderProps {
  conversation: Conversation;
  onBack?: () => void;
  onCall?: (type: "audio" | "video") => void;
  isMobile?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  onBack,
  onCall,
  isMobile,
}) => {
  const [showInfo, setShowInfo] = useState(false);

  const getStatusText = () => {
    if (conversation.participant?.isOnline) {
      return "Active now";
    }
    if (conversation.participant?.lastSeen) {
      const lastSeen = new Date(conversation.participant.lastSeen);
      const now = new Date();
      const diff = now.getTime() - lastSeen.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);

      if (minutes < 1) return "Just now";
      if (minutes < 60) return `Active ${minutes}m ago`;
      if (hours < 24) return `Active ${hours}h ago`;
      return `Active ${lastSeen.toLocaleDateString()}`;
    }
    return "";
  };

  return (
    <div className="px-4 py-3 bg-[var(--bg-primary)] border-b border-[var(--border-color)] flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-3">
        {isMobile && onBack && (
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-[var(--hover-color)] rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[var(--text-primary)]" />
          </button>
        )}

        <div className="relative">
          {conversation.participant?.avatar ? (
            <img
              src={conversation.participant.avatar}
              alt={conversation.participant.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
              {conversation.participant?.username?.[0]?.toUpperCase() || "?"}
            </div>
          )}
          {conversation.participant?.isOnline && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[var(--bg-primary)]" />
          )}
        </div>

        <div>
          <h3 className="font-semibold text-[var(--text-primary)]">
            {conversation.participant?.fullName ||
              conversation.participant?.username}
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            {getStatusText()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <ThemeSwitcher />
        <button
          onClick={() => onCall?.("audio")}
          className="p-2 hover:bg-[var(--hover-color)] rounded-full transition-colors"
        >
          <Phone className="w-5 h-5 text-[var(--text-secondary)]" />
        </button>
        <button
          onClick={() => onCall?.("video")}
          className="p-2 hover:bg-[var(--hover-color)] rounded-full transition-colors"
        >
          <Video className="w-5 h-5 text-[var(--text-secondary)]" />
        </button>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 hover:bg-[var(--hover-color)] rounded-full transition-colors"
        >
          <Info className="w-5 h-5 text-[var(--text-secondary)]" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
