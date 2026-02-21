import React, { useState, useRef } from "react";
import { Send, Image, Paperclip, Mic, X, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import type { Message } from "../../types";
import { messageAPI } from "../../services/api";

interface MessageInputProps {
  onSend: (data: {
    content: string;
    messageType?: string;
    mediaUrl?: string;
    duration?: number;
  }) => void;
  onTyping: () => void;
  replyTo: Message | null;
  onCancelReply: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onTyping,
  replyTo,
  onCancelReply,
}) => {
  const [content, setContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploading, setUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !replyTo) return;

    onSend({
      content: content.trim(),
      messageType: "text",
    });
    setContent("");
    setShowEmojiPicker(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
    onTyping();
  };

  const handleEmojiClick = (emojiData: any) => {
    setContent((prev) => prev + emojiData.emoji);
    inputRef.current?.focus();
  };

  const handleFileUpload = async (
    file: File,
    type: "image" | "video" | "audio",
  ) => {
    try {
      setUploading(true);
      let response;

      if (type === "image") {
        response = await messageAPI.uploadImage(file);
      } else if (type === "video") {
        response = await messageAPI.uploadVideo(file);
      } else {
        response = await messageAPI.uploadAudio(file);
      }

      onSend({
        content: "",
        messageType: type,
        mediaUrl: response.data.url,
      });
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        handleFileUpload(file, "image");
      } else if (file.type.startsWith("video/")) {
        handleFileUpload(file, "video");
      }
    }
    e.target.value = "";
  };

  return (
    <div className="bg-(--bg-primary) border-t border-(--border-color) p-4 transition-colors duration-300">
      {/* Reply preview */}
      {replyTo && (
        <div className="flex items-center gap-2 mb-3 bg-(--bg-secondary) border border-(--border-color) rounded-lg p-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-(--text-muted) mb-1">
              Replying to {replyTo.sender.username}
            </p>
            <p className="text-sm text-(--text-secondary) truncate">
              {replyTo.content || "Media message"}
            </p>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 hover:bg-(--hover-color) rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-(--text-muted)" />
          </button>
        </div>
      )}

      {/* Input area */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 hover:bg-(--hover-color) rounded-full transition-colors"
        >
          <Smile className="w-5 h-5 text-(--text-secondary)" />
        </button>

        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className="p-2 hover:bg-(--hover-color) rounded-full transition-colors"
          disabled={uploading}
        >
          <Image className="w-5 h-5 text-(--text-secondary)" />
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-(--hover-color) rounded-full transition-colors"
          disabled={uploading}
        >
          <Paperclip className="w-5 h-5 text-(--text-secondary)" />
        </button>

        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={content}
            onChange={handleChange}
            placeholder={uploading ? "Uploading..." : "Message..."}
            className="w-full px-4 py-2.5 bg-(--bg-secondary) border border-(--border-color) text-(--text-primary) rounded-full focus:outline-none focus:ring-2 focus:ring-(--accent-primary) transition-all placeholder-(--text-muted)"
            disabled={uploading}
          />

          {/* Emoji picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 mb-2 z-50">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width={300}
                height={400}
              />
            </div>
          )}
        </div>

        {content.trim() ? (
          <button
            type="submit"
            className="p-2.5 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full hover:opacity-90 transition-opacity"
            disabled={uploading}
          >
            <Send className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            className="p-2.5 hover:bg-(--hover-color) rounded-full transition-colors"
            disabled={uploading}
          >
            <Mic className="w-5 h-5 text-(--text-secondary)" />
          </button>
        )}
      </form>

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleImageSelect}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file, "audio");
          e.target.value = "";
        }}
        className="hidden"
      />
    </div>
  );
};

export default MessageInput;
