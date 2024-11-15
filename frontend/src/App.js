import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LogoutPage from './pages/LogoutPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar'; // Import the Navbar component
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App flex min-h-screen">
        <Navbar />
        <div className="flex-1 ml-64 p-6">
          {/* The Routes and Content */}
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/logout" element={<LogoutPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
