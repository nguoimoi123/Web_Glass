import React, { useEffect, useState, createContext, useContext } from 'react';
import api from '../services/api';
import { error } from 'console';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
}

interface UserContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (user: Omit<User, '_id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (user: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('Token in fetchUser:', token); // Debug
    
    if (!token) {
      console.log('No token found');
      return;
    }

    // Đảm bảo header được set
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Headers set:', api.defaults.headers.common['Authorization']); // Debug
    
    const res = await api.get('/users/me');
    console.log('User data fetched:', res.data); // Debug
    
    setCurrentUser(res.data);
    setIsAuthenticated(true);
  } catch (err) {
    console.error('Failed to fetch user:', err);
    logout();
  }
};

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, ...user } = res.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;  // Thêm dòng này
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  const register = async (userData: Omit<User, '_id'> & { password: string }): Promise<boolean> => {
  try {
    const res = await api.post('/auth/register', userData);
    const { token, ...user } = res.data;
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;  // Thêm dòng này
    setCurrentUser(user);
    setIsAuthenticated(true);
    return true;
  } catch (err) {
    console.error('Register failed:', err);
    return false;
  }
};

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    try {
      const res = await api.put('/users/me', userData);
      setCurrentUser(res.data);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    login,
    register,
    logout,
    updateUserProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};