import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { io } from 'socket.io-client';
import axios from 'axios';

const ChatPage = () => {
  const { user, token } = useAuthStore();
  const { messages, addMessage, setMessages, typingUsers, addTypingUser, removeTypingUser } =
    useChatStore();
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    // Fetch existing messages
    fetchMessages();

    // Connect to Socket.io
    const newSocket = io(process.env.REACT_APP_SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('receive-message', (message) => {
      addMessage(message);
    });

    newSocket.on('typing', (data) => {
      addTypingUser(data.username);
    });

    newSocket.on('stop-typing', (data) => {
      removeTypingUser(data.username);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/chat`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !socket) return;

    socket.emit('send-message', {
      userId: user?.id,
      username: user?.username,
      message: inputMessage,
    });

    setInputMessage('');
  };

  const handleTyping = () => {
    socket?.emit('typing', { username: user?.username });
  };

  const handleStopTyping = () => {
    socket?.emit('stop-typing');
  };

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <div className="flex-1 bg-gray-800 rounded-lg p-4 overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-4 text-white">
            <span className="font-bold text-blue-400">{msg.username}:</span>
            <span className="ml-2">{msg.message}</span>
            <p className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleTimeString()}</p>
          </div>
        ))}
        {typingUsers.length > 0 && (
          <div className="text-gray-400 italic">{typingUsers.join(', ')} is typing...</div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          onInput={handleTyping}
          onBlur={handleStopTyping}
          placeholder="Type a message..."
          className="flex-1 bg-gray-700 text-white p-3 rounded-lg outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;