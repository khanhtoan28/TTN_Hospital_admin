'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { authService } from '@/lib/api/services';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userId: number | null;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra token khi component mount
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('accessToken');
      const storedUserId = localStorage.getItem('userId');
      const storedUsername = localStorage.getItem('username');

      if (storedToken) {
        setToken(storedToken);
        setUserId(storedUserId ? parseInt(storedUserId) : null);
        setUsername(storedUsername);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const response = await authService.login({ username, password });
    
    if (response.success && response.data) {
      const { accessToken, userId, username: user } = response.data;
      
      setToken(accessToken);
      setUserId(userId);
      setUsername(user);
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userId', userId.toString());
      localStorage.setItem('username', user);
    } else {
      throw new Error(response.error || 'Đăng nhập thất bại');
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setUsername(null);
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  }, []);

  const value = useMemo(() => ({
    isAuthenticated: !!token,
    token,
    userId,
    username,
    login,
    logout,
    loading,
  }), [token, userId, username, login, logout, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

