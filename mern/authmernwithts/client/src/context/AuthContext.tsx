import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/axios';
import { User, AuthContextType, AuthResponse } from '../types';
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get<User>('/auth/profile');
          setUser(res.data);
        } catch (err) {
          localStorage.removeItem('token');
          setError('Session expired. Please login again.');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);
  const login = async (email: string, password: string): Promise<void> => {
    setError(null);
    try {
      const res = await api.post<AuthResponse>('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };
  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};