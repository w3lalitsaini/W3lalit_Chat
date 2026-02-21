import React, { useState } from "react";
import { X, Camera, Loader2, Save } from "lucide-react";
import { userAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import type { User } from "../../types";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    bio: user.bio || "",
    avatar: user.avatar || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await userAPI.updateProfile(formData);
      setUser(response.data.user);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-(--bg-primary) border border-(--border-color) rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden transition-colors duration-300">
        {/* Header */}
        <div className="p-4 border-b border-(--border-color) flex items-center justify-between bg-(--bg-primary)">
          <h2 className="text-xl font-bold text-(--text-primary)">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-(--hover-color) rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-(--text-primary)" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 overflow-y-auto max-h-[70vh]"
        >
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-(--accent-primary)/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-3xl font-bold border-4 border-(--accent-primary)/20">
                  {user.username[0].toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-xs text-(--text-muted)">
              Click to change avatar
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl text-sm">
              Profile updated successfully!
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-(--text-secondary) mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-4 py-3 bg-(--bg-secondary) border border-(--border-color) text-(--text-primary) rounded-xl focus:ring-2 focus:ring-(--accent-primary) outline-none transition-all placeholder-(--text-muted)"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-(--text-secondary) mb-1.5">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full px-4 py-3 bg-(--bg-secondary) border border-(--border-color) text-(--text-primary) rounded-xl focus:ring-2 focus:ring-(--accent-primary) outline-none transition-all placeholder-(--text-muted) min-h-[100px] resize-none"
                placeholder="Tell us about yourself..."
                maxLength={150}
              />
              <p className="text-right text-xs text-(--text-muted) mt-1">
                {formData.bio.length}/150
              </p>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-(--border-color) text-(--text-primary) rounded-xl font-semibold hover:bg-(--hover-color) transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-linear-to-r from-(--accent-primary) to-(--accent-secondary) text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
