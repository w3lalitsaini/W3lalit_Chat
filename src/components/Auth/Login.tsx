import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { MessageSquare, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onToggle: () => void;
}

const Login: React.FC<LoginProps> = ({ onToggle }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.emailOrUsername, formData.password);
      navigate("/dashboard");
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Invalid credentials";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Branding Section */}
      <div className="hidden lg:flex w-1/2 bg-linear-to-br from-(--accent-primary) via-purple-600 to-(--accent-secondary) text-white items-center justify-center p-12">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-10 h-10" />
            <h1 className="text-3xl font-bold">ChatSphere</h1>
          </div>
          <p className="text-lg opacity-90 max-w-md">
            Welcome back. Continue your conversations and stay connected with
            your community.
          </p>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex flex-1 items-center justify-center bg-(--bg-secondary) p-6 transition-colors duration-300">
        <div className="w-full max-w-md backdrop-blur-xl bg-(--bg-primary)/80 border border-(--border-color) shadow-2xl rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-2">
            Welcome Back
          </h2>
          <p className="text-(--text-secondary) text-sm mb-6">
            Sign in to your account
          </p>

          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Username */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="emailOrUsername"
                placeholder="Email or Username"
                value={formData.emailOrUsername}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-(--bg-secondary) border border-(--border-color) text-(--text-primary) rounded-xl focus:ring-2 focus:ring-(--accent-primary) outline-none transition-all placeholder-(--text-muted)"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 bg-(--bg-secondary) border border-(--border-color) text-(--text-primary) rounded-xl focus:ring-2 focus:ring-(--accent-primary) outline-none transition-all placeholder-(--text-muted)"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right text-sm">
              <button type="button" className="text-indigo-600 hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-(--accent-primary) to-(--accent-secondary) text-green-500 font-extrabold py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-(--text-secondary)">
            Don’t have an account?{" "}
            <button
              onClick={onToggle}
              className="text-(--accent-primary) font-semibold hover:underline"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
