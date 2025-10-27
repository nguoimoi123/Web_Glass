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
  sendMessage: (content: string) => void;
  isTyping: boolean;
  adminTyping: boolean;
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
  const [isTyping, setIsTyping] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);

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
      console.log('WebSocket connected');
      setConnected(true);
    });

    newSocket.on('connected', (data) => {
      console.log('Authenticated:', data);
    });

    newSocket.on('newMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
      if (!message.isRead) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    newSocket.on('messageSent', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('adminTyping', () => {
      setAdminTyping(true);
    });

    newSocket.on('adminStopTyping', () => {
      setAdminTyping(false);
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    });

    newSocket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (socket && connected) {
      socket.emit('sendMessage', { content });
    }
  }, [socket, connected]);

  useEffect(() => {
    if (!socket || !connected) return;

    let typingTimeout: NodeJS.Timeout;

    const handleTyping = () => {
      if (!isTyping) {
        setIsTyping(true);
        socket.emit('typing', {});
      }

      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        setIsTyping(false);
        socket.emit('stopTyping', {});
      }, 1000);
    };

    return () => {
      clearTimeout(typingTimeout);
    };
  }, [socket, connected, isTyping]);

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        connected,
        messages,
        unreadCount,
        sendMessage,
        isTyping,
        adminTyping
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
