import React, { useState, useEffect } from "react";
import { X, Search, Loader2, UserPlus } from "lucide-react";
import { userAPI } from "../../services/api";
import type { User } from "../../types";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: User) => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  onClose,
  onSelectUser,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggested, setSuggested] = useState<User[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchSuggested();
    }
  }, [isOpen]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery) {
        searchUsers();
      } else {
        setUsers([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const fetchSuggested = async () => {
    try {
      const response = await userAPI.getSuggested();
      setSuggested(response.data.users);
    } catch (error) {
      console.error("Failed to fetch suggested users:", error);
    }
  };

  const searchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.search(searchQuery);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Failed to search users:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const displayUsers = searchQuery ? users : suggested;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-(--bg-primary) border border-(--border-color) rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-(--border-color) flex items-center justify-between">
          <h2 className="text-lg font-semibold text-(--text-primary)">
            New Message
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-(--hover-color) rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-(--text-primary)" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-(--text-muted)" />
            <input
              type="text"
              placeholder="Search people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-(--bg-secondary) border border-(--border-color) text-(--text-primary) rounded-xl focus:outline-none focus:ring-2 focus:ring-(--accent-primary) transition-all placeholder-(--text-muted)"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : displayUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? "No users found" : "Search for people to message"}
            </div>
          ) : (
            <>
              {!searchQuery && (
                <h3 className="px-4 py-2 text-xs font-bold text-(--text-muted) uppercase tracking-wider">
                  Suggested
                </h3>
              )}

              {displayUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() => {
                    onSelectUser(user);
                    onClose();
                    setSearchQuery("");
                  }}
                  className="w-full p-4 flex items-center gap-3 hover:bg-(--hover-color) transition-colors border-b border-(--border-color) last:border-0"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold shadow-sm">
                      {user.username[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 text-left">
                    <h4 className="font-semibold text-(--text-primary)">
                      {user.fullName || user.username}
                    </h4>
                    <p className="text-sm text-(--text-secondary)">
                      @{user.username}
                    </p>
                  </div>
                  <UserPlus className="w-5 h-5 text-(--text-muted)" />
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
