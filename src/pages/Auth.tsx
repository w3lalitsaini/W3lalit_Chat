import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import { useAuth } from "../context/AuthContext";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-500 via-pink-500 to-orange-400">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isLogin ? (
    <Login onToggle={() => setIsLogin(false)} />
  ) : (
    <Register onToggle={() => setIsLogin(true)} />
  );
};

export default Auth;
