import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../firebase'; // Importă funcția de logout

const HomePage = () => {
  const navigate = useNavigate();

  // Funcția de logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('user'); // Înlătură datele utilizatorului din localStorage
      navigate('/login'); // Redirecționează către pagina de login
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold">Welcome to the Homepage!</h1>
        <p className="mt-4 text-gray-700">This is the content area of your application.</p>
      </div>
    </div>
  );
};

export default HomePage;
