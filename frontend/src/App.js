import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LogoutPage from './pages/LogoutPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar'; // Import the Navbar component
import './App.css';
import AuthProvider from './providers/AuthProvider';
import CVFormPage from './pages/CVFormPage';

const App = () => {
  return (
    <Router>
      <AuthProvider>
      <div className="flex h-screen overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<HomePage />}/>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/cv-form" element={<CVFormPage />} />
          </Routes>
        </div>
      </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
