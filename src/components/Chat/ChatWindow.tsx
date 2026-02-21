import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import type { Conversation, Message } from "../../types";
import { useMessages } from "../../hooks/useMessages";
import { useTyping } from "../../hooks/useTyping";
import { useAuth } from "../../context/AuthContext";

interface ChatWindowProps {
  conversation: Conversation;
  onBack?: () => void;
  isMobile?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  onBack,
  isMobile,
}) => {
  const { user } = useAuth();
  const {
    messages,
    loading,
    hasMore,
    messagesEndRef,
    sendMessage,
    deleteMessage,
    addReaction,
    loadMore,
    scrollToBottom,
  } = useMessages(conversation._id);

  const { typingUsers, handleInputChange, stopTyping } = useTyping(
    conversation._id,
  );
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  const handleSend = async (data: {
    content: string;
    messageType?: string;
    mediaUrl?: string;
    duration?: number;
  }) => {
    try {
      await sendMessage({
        ...data,
        replyTo: replyTo?._id,
      });
      setReplyTo(null);
      stopTyping();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleReply = (message: Message) => {
    setReplyTo(message);
  };

  const otherUserTyping =
    typingUsers.filter((id) => id !== user?._id).length > 0;

  return (
    <div className="flex-1 flex flex-col bg-(--bg-primary) h-full transition-colors duration-300">
      <ChatHeader
        conversation={conversation}
        onBack={onBack}
        isMobile={isMobile}
      />

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-(--bg-primary)"
        onScroll={(e) => {
          const target = e.target as HTMLDivElement;
          if (target.scrollTop === 0 && hasMore && !loading) {
            loadMore();
          }
        }}
      >
        {loading && messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}

        {hasMore && !loading && messages.length > 0 && (
          <div className="text-center py-4">
            <button
              onClick={loadMore}
              className="text-sm text-(--accent-primary) hover:underline"
            >
              Load more messages
            </button>
          </div>
        )}

        <div className="space-y-1">
          {messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              isOwn={message.sender._id === user?._id}
              currentUser={user}
              onDelete={deleteMessage}
              onReply={handleReply}
              onReaction={addReaction}
            />
          ))}
        </div>

        {/* Typing indicator */}
        {otherUserTyping && (
          <div className="flex items-center gap-2 mt-4">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-semibold">
              {conversation.participant?.username[0]?.toUpperCase()}
            </div>

            <div className="bg-(--bg-secondary) border border-(--border-color) rounded-full px-4 py-2 flex items-center gap-1">
              <span
                className="w-2 h-2 bg-(--text-muted) rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-2 h-2 bg-(--text-muted) rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-2 h-2 bg-(--text-muted) rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        onSend={handleSend}
        onTyping={handleInputChange}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
};

export default ChatWindow;
