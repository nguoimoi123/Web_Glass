import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useWebSocket } from '../context/WebSocketContext';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const MessageWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket, connected, sendMessage, unreadCount, adminTyping } = useWebSocket();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (isOpen && token) {
      loadConversation();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!socket) return;

    socket.on('newMessage', (msg: any) => {
      setConversation((prev) => [...prev, msg]);
      scrollToBottom();
    });

    socket.on('messageSent', (msg: any) => {
      setConversation((prev) => [...prev, msg]);
      scrollToBottom();
    });

    return () => {
      socket.off('newMessage');
      socket.off('messageSent');
    };
  }, [socket]);

  const loadConversation = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/messages/my-messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversation(response.data);
      
      const unreadMessageIds = response.data
        .filter((msg: any) => !msg.isRead && msg.receiver)
        .map((msg: any) => msg._id);
      
      if (unreadMessageIds.length > 0) {
        await axios.post(
          `${API_BASE}/messages/mark-read`,
          { messageIds: unreadMessageIds },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      scrollToBottom();
    } catch (error) {
      console.error('Failed to load conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (message.trim() && connected) {
      sendMessage(message.trim());
      setMessage('');
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (!token) {
    return null;
  }

  return (
    <>
     <button
        onClick={() => setIsOpen(!isOpen)}
         className="group fixed bottom-24 right-6 flex items-center bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 z-50 overflow-hidden"
        aria-label="Open chat"
        >
        {/* Icon luôn hiển thị */}
        <MessageCircle size={24} className="flex-shrink-0" />

        {/* Text chỉ hiện khi hover */}
        <span className="ml-2 font-medium opacity-0 max-w-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden">
            Chat with Shop
        </span>

        {/* Badge số tin nhắn chưa đọc */}
        {unreadCount > 0 && (
            <span className="ml-2 bg-white text-blue-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            {unreadCount}
            </span>
        )}
        </button>


      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Support Chat</h3>
              <p className="text-xs">
                {connected ? (
                  <span className="text-green-300">● Online</span>
                ) : (
                  <span className="text-gray-300">● Offline</span>
                )}
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : conversation.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No messages yet</p>
                <p className="text-sm">Start a conversation with support</p>
              </div>
            ) : (
              conversation.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${msg.senderRole === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.senderRole === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            {adminTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 p-3 rounded-lg">
                  <p className="text-sm italic">Admin is typing...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={!connected}
              />
              <button
                onClick={handleSend}
                disabled={!connected || !message.trim()}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageWidget;
