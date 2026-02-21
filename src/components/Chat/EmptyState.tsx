import React from "react";
import { MessageSquare, Send } from "lucide-react";

interface EmptyStateProps {
  onNewChat: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onNewChat }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-(--bg-secondary) p-8 transition-colors duration-300">
      <div className="w-24 h-24 bg-linear-to-br from-(--accent-primary) to-(--accent-secondary) opacity-20 rounded-full absolute" />
      <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 relative">
        <MessageSquare className="w-12 h-12 text-(--accent-primary)" />
      </div>

      <h2 className="text-2xl font-bold text-(--text-primary) mb-2">
        Your Messages
      </h2>
      <p className="text-(--text-secondary) text-center max-w-md mb-8">
        Send private photos and messages to a friend or group.
      </p>

      <button
        onClick={onNewChat}
        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
      >
        <Send className="w-5 h-5" />
        Send Message
      </button>
    </div>
  );
};

export default EmptyState;
