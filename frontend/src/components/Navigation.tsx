import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Navigation = () => {
  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Chat & Games
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/" className="hover:text-blue-400">
            Home
          </Link>
          <Link to="/chat" className="hover:text-blue-400">
            Chat
          </Link>
          <Link to="/games" className="hover:text-blue-400">
            Games
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="hover:text-blue-400">
              Admin
            </Link>
          )}
          <div className="flex gap-2 items-center">
            <span className="text-sm">{user?.username}</span>
            <span className="text-xs bg-blue-600 px-2 py-1 rounded">{user?.role}</span>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;