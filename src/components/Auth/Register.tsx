import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  MessageSquare,
  Loader2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RegisterProps {
  onToggle: () => void;
}

const Register: React.FC<RegisterProps> = ({ onToggle }) => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const validate = () => {
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }

    if (formData.password.length < 8) {
      return "Password must be at least 8 characters";
    }

    if (!/^[a-zA-Z0-9_]{3,15}$/.test(formData.username)) {
      return "Username must be 3-15 characters (letters, numbers, underscore)";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await register({
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      navigate("/dashboard");
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side Branding */}
      <div className="hidden lg:flex w-1/2 bg-linear-to-br from-(--accent-primary) via-purple-600 to-(--accent-secondary) text-white items-center justify-center p-12">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-10 h-10" />
            <h1 className="text-3xl font-bold">ChatSphere</h1>
          </div>
          <p className="text-lg opacity-90 max-w-md">
            Join thousands of creators, developers and thinkers sharing ideas in
            real-time conversations.
          </p>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="flex flex-1 items-center justify-center bg-(--bg-secondary) p-6 transition-colors duration-300">
        <div className="w-full max-w-md backdrop-blur-xl bg-(--bg-primary)/80 border border-(--border-color) shadow-2xl rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-2">
            Create Account
          </h2>
          <p className="text-(--text-secondary) text-sm mb-6">
            Start your journey with us today
          </p>

          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <InputField
              icon={<User size={18} />}
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />

            {/* Username */}
            <InputField
              icon={<span>@</span>}
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />

            {/* Email */}
            <InputField
              icon={<Mail size={18} />}
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
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

            {/* Confirm Password */}
            <InputField
              icon={<Lock size={18} />}
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-(--accent-primary) to-(--accent-secondary) text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-(--text-secondary)">
            Already have an account?{" "}
            <button
              onClick={onToggle}
              className="text-(--accent-primary) font-semibold hover:underline"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface InputFieldProps {
  icon: React.ReactNode;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  icon,
  name,
  placeholder,
  value,
  onChange,
  type = "text",
}) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      {icon}
    </div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-4 py-3 bg-(--bg-secondary) border border-(--border-color) text-(--text-primary) rounded-xl focus:ring-2 focus:ring-(--accent-primary) outline-none transition-all placeholder-(--text-muted)"
      required
    />
  </div>
);

export default Register;
