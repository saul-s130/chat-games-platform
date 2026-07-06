import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import GamesPage from './pages/GamesPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const { token } = useAuthStore();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900">
        {token && <Navigation />}
        <Routes>
          <Route path="/" element={token ? <HomePage /> : <LoginPage />} />
          <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/chat" element={token ? <ChatPage /> : <Navigate to="/login" />} />
          <Route path="/games" element={token ? <GamesPage /> : <Navigate to="/login" />} />
          <Route path="/admin" element={token ? <AdminDashboard /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;