import React, { useState } from "react";
import { Palette, Sun, Moon, Sparkles, Sunset, Wind } from "lucide-react";
import { useTheme, type Theme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const themes: { id: Theme; name: string; icon: any; color: string }[] = [
  { id: "light", name: "Light", icon: Sun, color: "bg-white" },
  { id: "dark", name: "Dark", icon: Moon, color: "bg-slate-900" },
  { id: "midnight", name: "Midnight", icon: Wind, color: "bg-blue-950" },
  { id: "sunset", name: "Sunset", icon: Sunset, color: "bg-orange-100" },
  { id: "lavender", name: "Lavender", icon: Sparkles, color: "bg-purple-100" },
];

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 group"
        title="Change Theme"
      >
        <Palette className="w-5 h-5 text-gray-500 group-hover:text-purple-600 transition-colors" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
            >
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                    theme === t.id
                      ? "text-purple-600 font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-md ${t.color} ${theme === t.id ? "ring-2 ring-purple-600" : "ring-1 ring-gray-200"}`}
                  >
                    <t.icon
                      className={`w-4 h-4 ${t.id === "light" ? "text-orange-500" : t.id === "dark" || t.id === "midnight" ? "text-white" : t.id === "sunset" ? "text-orange-600" : "text-purple-600"}`}
                    />
                  </div>
                  <span className="text-sm">{t.name}</span>
                  {theme === t.id && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-600" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;
