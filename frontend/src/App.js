import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LogoutPage from './pages/LogoutPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import './App.css';
import AuthProvider from './providers/AuthProvider';
import CVFormPage from './pages/CVFormPage';
import ChatPage from './pages/ChatPage';
import { PublicRoute } from './components/PublicRoute.js';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="bg-gray-50 min-h-screen">
          {/* Sidebar */}
          <Navbar />
          
          {/* Main Content Container */}
          <main className="flex-1 lg:ml-64 relative overflow-y-auto pt-16 lg:pt-0">
            {/* Inner container for proper padding and max-width */}
            <div className="h-full w-full">
              <div className="mx-auto max-w-7xl">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                  <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/logout" element={<LogoutPage />} />
                  <Route path="/cv-form" element={<CVFormPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                </Routes>
              </div>
            </div>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;