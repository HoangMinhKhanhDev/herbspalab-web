/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi, logout as logoutApi } from '../api/authApi';
import API from '../api/axios';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('userInfo');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Restore session from server on mount (for page reload with HttpOnly cookie)
  useEffect(() => {
    if (!user) {
      API.get('/users/profile')
        .then(res => {
          const userData = res.data;
          // Normalize _id -> id for compatibility
          const normalized: User = {
            id: userData.id || userData._id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
          };
          setUser(normalized);
          localStorage.setItem('userInfo', JSON.stringify(normalized));
        })
        .catch(() => {
          // Not logged in — that's fine
          localStorage.removeItem('userInfo');
        });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user) {
      localStorage.setItem('userInfo', JSON.stringify(user));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    const { data } = await loginApi({ email, password });
    const normalized: User = {
      id: data.id || data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    setUser(normalized);
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await registerApi({ name, email, password });
    const normalized: User = {
      id: data.id || data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    setUser(normalized);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
