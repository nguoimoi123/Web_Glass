import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  receiver?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  senderRole: 'user' | 'admin';
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface WebSocketContextType {
  socket: Socket | null;
  connected: boolean;
  messages: Message[];
  unreadCount: number;
  sendMessage: (content: string, receiverId?: string) => void;
  newMessageNotifications: Message[];
  clearNotifications: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newMessageNotifications, setNewMessageNotifications] = useState<Message[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return;
    }

    const WS_URL = import.meta.env.VITE_WS_URL || window.location.origin;
    
    const newSocket = io(WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Admin WebSocket connected');
      setConnected(true);
    });

    newSocket.on('connected', (data) => {
      console.log('Admin authenticated:', data);
    });

    newSocket.on('newMessage', (message: Message) => {
      console.log('New message received:', message);
      setMessages((prev) => [...prev, message]);
      setNewMessageNotifications((prev) => [...prev, message]);
      if (!message.isRead) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    newSocket.on('messageSent', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('disconnect', () => {
      console.log('Admin WebSocket disconnected');
      setConnected(false);
    });

    newSocket.on('error', (error) => {
      console.error('Admin WebSocket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = useCallback((content: string, receiverId?: string) => {
    if (socket && connected) {
      socket.emit('sendMessage', { content, receiverId });
    }
  }, [socket, connected]);

  const clearNotifications = useCallback(() => {
    setNewMessageNotifications([]);
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        connected,
        messages,
        unreadCount,
        sendMessage,
        newMessageNotifications,
        clearNotifications
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
