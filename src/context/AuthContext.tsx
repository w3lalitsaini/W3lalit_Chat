import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthState } from '../types';
import { authAPI } from '../services/api';
import socketService from '../services/socket';
import { demoUser } from '../services/demoData';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: { username: string; email: string; password: string; fullName: string }) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  enableDemoMode: () => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isDemoMode = () => {
  return localStorage.getItem('demoMode') === 'true' || !import.meta.env.VITE_API_URL;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true
  });
  const [demoMode, setDemoMode] = useState(isDemoMode());

  useEffect(() => {
    const initAuth = async () => {
      // Check for demo mode first
      if (isDemoMode()) {
        setDemoMode(true);
        setState({
          user: demoUser,
          token: 'demo-token',
          isAuthenticated: true,
          isLoading: false
        });
        return;
      }

      const token = localStorage.getItem('token');
      if (token && token !== 'demo-token') {
        try {
          const response = await authAPI.getMe();
          const user = response.data.user;
          setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          });
          // Connect socket
          socketService.connect(user._id);
        } catch (error) {
          console.error('Auth init error:', error);
          localStorage.removeItem('token');
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const enableDemoMode = () => {
    localStorage.setItem('demoMode', 'true');
    setDemoMode(true);
    setState({
      user: demoUser,
      token: 'demo-token',
      isAuthenticated: true,
      isLoading: false
    });
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.removeItem('demoMode');
      setDemoMode(false);
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      });
      
      // Connect socket
      socketService.connect(user._id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (data: { username: string; email: string; password: string; fullName: string }) => {
    try {
      const response = await authAPI.register(data);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.removeItem('demoMode');
      setDemoMode(false);
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      });
      
      // Connect socket
      socketService.connect(user._id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      if (!demoMode) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      socketService.disconnect();
      localStorage.removeItem('token');
      localStorage.removeItem('demoMode');
      setDemoMode(false);
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  };

  const updateUser = (user: User) => {
    setState(prev => ({ ...prev, user }));
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      login, 
      register, 
      logout, 
      updateUser,
      enableDemoMode,
      isDemoMode: demoMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
