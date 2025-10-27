import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, User } from 'lucide-react';
import { useWebSocket } from '../../contexts/WebSocketContext';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface Conversation {
  userId: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<Conversation | null>(null);
  const [currentConversation, setCurrentConversation] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket, connected, sendMessage, newMessageNotifications, clearNotifications } = useWebSocket();

  const token = localStorage.getItem('token');

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('newMessage', (msg: any) => {
      if (selectedUser && msg.sender._id === selectedUser.userId) {
        setCurrentConversation((prev) => [...prev, msg]);
        scrollToBottom();
      }
      loadConversations();
    });

    socket.on('messageSent', (msg: any) => {
      setCurrentConversation((prev) => [...prev, msg]);
      scrollToBottom();
    });

    return () => {
      socket.off('newMessage');
      socket.off('messageSent');
    };
  }, [socket, selectedUser]);

  useEffect(() => {
    if (newMessageNotifications.length > 0) {
      loadConversations();
    }
  }, [newMessageNotifications]);

  const loadConversations = async () => {
    try {
      const response = await axios.get(`${API_BASE}/messages/user-conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadConversation = async (userId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/messages/conversation/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentConversation(response.data);
      
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

  const handleSelectUser = (conv: Conversation) => {
    setSelectedUser(conv);
    loadConversation(conv.userId);
    clearNotifications();
  };

  const handleSend = () => {
    if (message.trim() && connected && selectedUser) {
      sendMessage(message.trim(), selectedUser.userId);
      setMessage('');
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="h-screen flex">
      <div className="w-1/3 border-r bg-white overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">User Messages</h2>
          <p className="text-sm text-gray-600">
            {connected ? (
              <span className="text-green-600">● Online</span>
            ) : (
              <span className="text-gray-400">● Offline</span>
            )}
          </p>
        </div>

        <div className="divide-y">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.userId}
                onClick={() => handleSelectUser(conv)}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedUser?.userId === conv.userId ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold truncate">{conv.userName}</h3>
                      {conv.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conv.userEmail}</p>
                    <p className="text-sm text-gray-500 truncate mt-1">{conv.lastMessage}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(conv.lastMessageTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedUser ? (
          <>
            <div className="bg-white p-4 border-b">
              <h3 className="font-semibold">{selectedUser.userName}</h3>
              <p className="text-sm text-gray-600">{selectedUser.userEmail}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                currentConversation.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.senderRole === 'admin'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-800 shadow'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-white p-4 border-t">
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
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
