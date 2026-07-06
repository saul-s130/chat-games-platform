import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

const HomePage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/announcements`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setAnnouncements(response.data);
    } catch (err) {
      console.error('Failed to fetch announcements', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-4xl font-bold mb-8">Welcome to Chat & Games Platform</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">💬 Chat</h2>
          <p>Connect with other users in real-time</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">🎮 Games (Soon)</h2>
          <p>Coup, Blackjack, Cheat, Poker and more!</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">👥 Community</h2>
          <p>Different membership tiers with exclusive perks</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Latest Announcements</h2>
      {loading ? (
        <p>Loading announcements...</p>
      ) : announcements.length === 0 ? (
        <p className="text-gray-400">No announcements yet</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement._id} className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold">{announcement.title}</h3>
              <p className="text-gray-300 mt-2">{announcement.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(announcement.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;