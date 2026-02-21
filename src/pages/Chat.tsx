import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  LogOut,
  Settings,
  User as UserIcon,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useConversations } from "../hooks/useConversations";
import ConversationList from "../components/Chat/ConversationList";
import ChatWindow from "../components/Chat/ChatWindow";
import EmptyState from "../components/Chat/EmptyState";
import NewChatModal from "../components/Chat/NewChatModal";
import ProfileModal from "../components/Chat/ProfileModal";
import SettingsModal from "../components/Chat/SettingsModal";
import type { Conversation, User } from "../types";

const Chat: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const {
    conversations,
    loading: conversationsLoading,
    markAsRead,
    getOrCreateConversation,
  } = useConversations();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/auth", { replace: true });
      }
    }
  }, [user, isLoading, navigate]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowMobileChat(true);
    if (conversation.unreadCount > 0) {
      markAsRead(conversation._id);
    }
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
    setSelectedConversation(null);
  };

  const handleSelectUser = async (selectedUser: User) => {
    try {
      const conversation = await getOrCreateConversation(selectedUser._id);
      setSelectedConversation(conversation);
      setShowMobileChat(true);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar with conversations */}
      <div
        className={`${showMobileChat ? "hidden md:flex" : "flex"} flex-col h-full w-full md:w-auto`}
      >
        {/* Header with user info */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                  {user.username[0]?.toUpperCase()}
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {user.fullName || user.username}
              </h3>
              <p className="text-xs text-gray-500">@{user.username}</p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={() => {
                    setIsProfileModalOpen(true);
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    setIsSettingsModalOpen(true);
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>

                <hr className="my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <ConversationList
          conversations={conversations}
          selectedId={selectedConversation?._id || null}
          onSelect={handleSelectConversation}
          onNewChat={() => setIsNewChatModalOpen(true)}
          loading={conversationsLoading}
        />
      </div>

      {/* Chat window */}
      <div
        className={`${!showMobileChat ? "hidden md:flex" : "flex"} flex-1 h-full`}
      >
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            onBack={handleBackToList}
            isMobile={showMobileChat}
          />
        ) : (
          <EmptyState onNewChat={() => setIsNewChatModalOpen(true)} />
        )}
      </div>

      {/* New chat modal */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onSelectUser={handleSelectUser}
      />

      {user && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={user}
        />
      )}

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {/* Click outside to close profile menu */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </div>
  );
};

export default Chat;
