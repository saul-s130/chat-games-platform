import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  isBanned: boolean;
  bannedReason?: string;
}

interface ChatMessage {
  _id: string;
  username: string;
  message: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const { token } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'messages' | 'announcements'>('users');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchMessages();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/chat/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const handleBanUser = async (userId: string, reason: string) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/users/${userId}/ban`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
      alert('User banned successfully');
    } catch (err) {
      alert('Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/users/${userId}/unban`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
      alert('User unbanned successfully');
    } catch (err) {
      alert('Failed to unban user');
    }
  };

  const handlePostAnnouncement = async () => {
    if (!announcementTitle || !announcementContent) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/announcements`,
        { title: announcementTitle, content: announcementContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnnouncementTitle('');
      setAnnouncementContent('');
      alert('Announcement posted successfully');
    } catch (err) {
      alert('Failed to post announcement');
    }
  };

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded ${
            activeTab === 'users' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 rounded ${
            activeTab === 'messages' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          Messages
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded ${
            activeTab === 'announcements' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          Announcements
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="bg-gray-800 rounded-lg p-6 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4">User Management</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Username</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Role</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-700">
                  <td className="p-2">{user.username}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        user.isBanned ? 'bg-red-600' : 'bg-green-600'
                      }`}
                    >
                      {user.isBanned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td className="p-2">
                    {user.isBanned ? (
                      <button
                        onClick={() => handleUnbanUser(user._id)}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                      >
                        Unban
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const reason = prompt('Ban reason:');
                          if (reason) handleBanUser(user._id, reason);
                        }}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                      >
                        Ban
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="bg-gray-800 rounded-lg p-6 max-h-96 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">All Messages</h2>
          {messages.map((msg) => (
            <div key={msg._id} className="border-b p-2">
              <span className="font-bold text-blue-400">{msg.username}:</span>
              <span className="ml-2">{msg.message}</span>
              <p className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Post Announcement</h2>
          <input
            type="text"
            placeholder="Announcement Title"
            value={announcementTitle}
            onChange={(e) => setAnnouncementTitle(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded mb-2 outline-none focus:bg-gray-600"
          />
          <textarea
            placeholder="Announcement Content"
            value={announcementContent}
            onChange={(e) => setAnnouncementContent(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded mb-4 outline-none focus:bg-gray-600 h-32"
          />
          <button
            onClick={handlePostAnnouncement}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-bold"
          >
            Post Announcement
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;