import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Search, Edit3, Loader2 } from "lucide-react";
import type { Conversation } from "../../types";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (conversation: Conversation) => void;
  onNewChat: () => void;
  loading?: boolean;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  onSelect,
  onNewChat,
  loading,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participant?.username
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      conv.participant?.fullName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full md:w-80 bg-(--bg-primary) border-r border-(--border-color) flex flex-col h-full transition-colors duration-300">
      {/* Header */}
      <div className="p-4 border-b border-(--border-color)">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-(--text-primary)">Messages</h2>

          <button
            onClick={onNewChat}
            className="p-2 hover:bg-(--hover-color) rounded-full transition-colors"
          >
            <Edit3 className="w-5 h-5 text-(--text-primary)" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-muted)" />
          <input
            type="text"
            placeholder="Search messages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-(--bg-secondary) border border-(--border-color) rounded-full text-sm text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-(--accent-primary) placeholder-(--text-muted)"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? "No conversations found" : "No messages yet"}
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <button
              key={conversation._id}
              onClick={() => onSelect(conversation)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-(--hover-color) transition-colors border-b border-(--border-color) ${
                selectedId === conversation._id ? "bg-(--hover-color)" : ""
              }`}
            >
              {/* Avatar */}
              <div className="relative">
                {conversation.participant?.avatar ? (
                  <img
                    src={conversation.participant.avatar}
                    alt={conversation.participant.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                    {conversation.participant?.username?.[0]?.toUpperCase() ||
                      "?"}
                  </div>
                )}
                {conversation.participant?.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-(--bg-primary)" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-(--text-primary) truncate">
                    {conversation.participant?.fullName ||
                      conversation.participant?.username}
                  </h3>
                  {conversation.lastMessage && (
                    <span className="text-xs text-(--text-muted)">
                      {formatDistanceToNow(new Date(conversation.updatedAt), {
                        addSuffix: false,
                      })}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-1">
                  <p
                    className={`text-sm truncate ${conversation.unreadCount > 0 ? "font-semibold text-(--text-primary)" : "text-(--text-secondary)"}`}
                  >
                    {conversation.lastMessage?.isDeleted
                      ? "This message was deleted"
                      : conversation.lastMessage?.messageType === "image"
                        ? "🖼️ Photo"
                        : conversation.lastMessage?.messageType === "video"
                          ? "🎥 Video"
                          : conversation.lastMessage?.content ||
                            "No messages yet"}
                  </p>

                  {conversation.unreadCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-linear-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;
