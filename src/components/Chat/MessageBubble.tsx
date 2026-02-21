import React, { useState } from "react";
import { format } from "date-fns";
import {
  Heart,
  Trash2,
  CornerUpLeft,
  Check,
  CheckCheck,
  Play,
  Pause,
  FileText,
  Download,
  PhoneIncoming,
  PhoneMissed,
} from "lucide-react";

import type { Message, User } from "../../types";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  currentUser: User | null;
  onDelete: (messageId: string) => void;
  onReply: (message: Message) => void;
  onReaction: (messageId: string, emoji: string) => void;
}

const REACTIONS = ["❤️", "🔥", "👍", "👎", "😂", "😮"];

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  currentUser,
  onDelete,
  onReply,
  onReaction,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const hasReactions = message.reactions && message.reactions.length > 0;

  const getStatusIcon = () => {
    if (message.isDeleted) return null;

    const isSeen = message.seenBy?.some((s) => s.user._id !== currentUser?._id);
    const isDelivered = message.deliveredTo?.some(
      (d) => d.user._id !== currentUser?._id,
    );

    if (isSeen) {
      return <CheckCheck className="w-4 h-4 text-blue-500" />;
    }
    if (isDelivered) {
      return <CheckCheck className="w-4 h-4 text-gray-400" />;
    }
    return <Check className="w-4 h-4 text-gray-400" />;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderMedia = () => {
    switch (message.messageType) {
      case "image":
        return (
          <div className="relative group">
            <img
              src={message.mediaUrl}
              alt="Shared image"
              className="max-w-full rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => window.open(message.mediaUrl, "_blank")}
            />
          </div>
        );

      case "video":
        return (
          <div className="relative group">
            <video
              src={message.mediaUrl}
              className="max-w-full rounded-lg"
              controls
              preload="metadata"
            />
          </div>
        );

      case "audio":
      case "voice":
        return (
          <div className="flex items-center gap-2 bg-black/10 rounded-full px-3 py-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-gray-700" />
              ) : (
                <Play className="w-4 h-4 text-gray-700 ml-0.5" />
              )}
            </button>
            <div className="flex-1">
              <div className="w-24 h-1 bg-black/20 rounded-full">
                <div className="w-1/3 h-full bg-white rounded-full" />
              </div>
            </div>
            <span className="text-xs">
              {formatDuration(message.duration || 0)}
            </span>
          </div>
        );

      case "file":
        return (
          <a
            href={message.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-black/10 rounded-lg p-3 hover:bg-black/20 transition-colors"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{message.fileName}</p>
              <p className="text-xs opacity-70">
                {(message.fileSize || 0 / 1024).toFixed(1)} KB
              </p>
            </div>
            <Download className="w-5 h-5" />
          </a>
        );

      case "call":
        const isStarted = message.content.toLowerCase().includes("started");
        return (
          <div className="flex items-center gap-3 py-1 px-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${isStarted ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
            >
              {isStarted ? (
                <PhoneIncoming className="w-5 h-5" />
              ) : (
                <PhoneMissed className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold">{message.content}</p>
              <p className="text-xs opacity-70">
                {isStarted ? "Ongoing" : "Finished"}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4 group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowEmojiPicker(false);
      }}
    >
      {/* Avatar for received messages */}
      {!isOwn && (
        <div className="mr-2">
          {message.sender.avatar ? (
            <img
              src={message.sender.avatar}
              alt={message.sender.username}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-semibold">
              {message.sender.username[0]?.toUpperCase()}
            </div>
          )}
        </div>
      )}

      <div
        className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}
      >
        {/* Reply reference */}
        {message.replyTo && (
          <div
            className={`mb-1 px-3 py-1.5 rounded-lg text-sm ${
              isOwn
                ? "bg-black/20 text-(--msg-user-text)"
                : "bg-(--bg-secondary) text-(--text-secondary) border border-(--border-color)"
            }`}
          >
            <p className="text-xs opacity-70 mb-0.5">
              Replying to {message.replyTo.sender.username}
            </p>
            <p className="truncate">{message.replyTo.content || "Media"}</p>
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`relative px-4 py-2 rounded-2xl ${
            message.messageType === "call"
              ? "bg-(--bg-secondary) border border-(--border-color) text-(--text-primary) italic"
              : isOwn
                ? "bg-(--msg-user-bg) text-(--msg-user-text) rounded-br-md"
                : "bg-(--msg-other-bg) text-(--msg-other-text) rounded-bl-md shadow-sm"
          } ${message.messageType !== "text" ? "p-2" : ""}`}
        >
          {/* Media content */}
          {message.messageType !== "text" && renderMedia()}

          {/* Text content */}
          {message.content && message.messageType !== "call" && (
            <p
              className={`${message.messageType !== "text" ? "mt-2 px-2" : ""}`}
            >
              {message.content}
            </p>
          )}

          {/* Time and status */}
          <div
            className={`flex items-center gap-1 mt-1 ${message.messageType !== "text" ? "px-2 pb-1" : ""}`}
          >
            <span
              className={`text-[10px] ${isOwn ? "opacity-70" : "text-(--text-muted)"}`}
            >
              {format(new Date(message.createdAt), "h:mm a")}
            </span>
            {isOwn && getStatusIcon()}
          </div>

          {/* Actions dropdown */}
          {showActions && !message.isDeleted && (
            <div
              className={`absolute ${isOwn ? "left-0 -translate-x-full pr-2" : "right-0 translate-x-full pl-2"} top-0 flex items-center gap-1`}
            >
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1.5 hover:bg-(--hover-color) rounded-full transition-colors bg-(--bg-primary) border border-(--border-color) shadow-sm"
              >
                <Heart className="w-4 h-4 text-(--text-secondary)" />
              </button>
              <button
                onClick={() => onReply(message)}
                className="p-1.5 hover:bg-(--hover-color) rounded-full transition-colors bg-(--bg-primary) border border-(--border-color) shadow-sm"
              >
                <CornerUpLeft className="w-4 h-4 text-(--text-secondary)" />
              </button>
              {isOwn && (
                <button
                  onClick={() => onDelete(message._id)}
                  className="p-1.5 hover:bg-(--hover-color) rounded-full transition-colors bg-(--bg-primary) border border-(--border-color) shadow-sm"
                >
                  <Trash2 className="w-4 h-4 text-(--text-secondary)" />
                </button>
              )}
            </div>
          )}

          {/* Emoji picker */}
          {showEmojiPicker && (
            <div
              className={`absolute ${isOwn ? "left-0 -translate-x-full" : "right-0 translate-x-full"} top-8 bg-white shadow-lg rounded-lg p-2 flex gap-1 z-10`}
            >
              {REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReaction(message._id, emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="hover:bg-gray-100 p-1 rounded transition-colors text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reactions */}
        {hasReactions && (
          <div
            className={`flex items-center gap-1 mt-1 ${isOwn ? "flex-row-reverse" : ""}`}
          >
            {message.reactions.slice(0, 3).map((reaction, idx) => (
              <span
                key={idx}
                className={`text-xs bg-white shadow-sm rounded-full px-1.5 py-0.5 border ${
                  reaction.user._id === currentUser?._id
                    ? "border-purple-500"
                    : "border-gray-200"
                }`}
              >
                {reaction.emoji}
              </span>
            ))}
            {message.reactions.length > 3 && (
              <span className="text-xs text-gray-500">
                +{message.reactions.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
