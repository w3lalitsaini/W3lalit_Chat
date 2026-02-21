import React from "react";
import { X, Bell, Shield, Moon, Palette, Trash2, LogOut } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { logout } = useAuth();

  if (!isOpen) return null;

  const sections = [
    {
      title: "Appearance",
      icon: <Palette className="w-5 h-5 text-purple-500" />,
      description: `Current theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`,
      action: "Change",
    },
    {
      title: "Notifications",
      icon: <Bell className="w-5 h-5 text-blue-500" />,
      description: "Configure push and sound alerts",
      action: "Manage",
    },
    {
      title: "Privacy & Security",
      icon: <Shield className="w-5 h-5 text-green-500" />,
      description: "Account security and data privacy",
      action: "Manage",
    },
    {
      title: "Data Usage",
      icon: <Trash2 className="w-5 h-5 text-red-500" />,
      description: "Clear cache and delete history",
      action: "Clear",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-(--bg-primary) border border-(--border-color) rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden transition-colors duration-300">
        {/* Header */}
        <div className="p-4 border-b border-(--border-color) flex items-center justify-between bg-(--bg-primary)">
          <h2 className="text-xl font-bold text-(--text-primary)">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-(--hover-color) rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-(--text-primary)" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-2">
            {sections.map((section, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-(--hover-color) transition-colors cursor-pointer border border-transparent hover:border-(--border-color)"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-(--bg-secondary) rounded-lg border border-(--border-color)">
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-(--text-primary)">
                      {section.title}
                    </h3>
                    <p className="text-sm text-(--text-muted)">
                      {section.description}
                    </p>
                  </div>
                </div>
                <button className="text-sm font-semibold text-(--accent-primary) hover:underline">
                  {section.action}
                </button>
              </div>
            ))}
          </div>

          <hr className="border-(--border-color)" />

          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full p-4 flex items-center gap-4 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Sign Out of Account
          </button>
        </div>

        <div className="p-4 bg-(--bg-secondary)/50 text-center">
          <p className="text-xs text-(--text-muted)">
            ChatSphere v1.0.0 • All features interactible
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
