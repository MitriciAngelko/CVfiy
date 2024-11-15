import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Importă auth din firebase
import { logoutUser } from '../firebase'; // Importă funcția de logout

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  // Obține informațiile despre utilizator din localStorage sau Firebase
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // Încarcă utilizatorul din localStorage
    if (user) {
      setUserInfo(user);
    } else {
      // Dacă nu există utilizator logat, redirecționează la login
      navigate('/login');
    }
  }, [navigate]);

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
      {/* Sidebar
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-8">Dashboard</h2>
        <ul>
        <li className="mb-6">
                <button 
                onClick={() => navigate('/home')} 
                className="w-full p-2 text-left hover:bg-gray-700 rounded-lg">
                Home
                </button>
          </li>
          <li className="mb-6">
            <button 
              onClick={() => navigate('/profile')} 
              className="w-full p-2 text-left hover:bg-gray-700 rounded-lg"
            >
              Profil
            </button>
          </li>
          <li className="mb-6">
            <button 
              onClick={handleLogout}
              className="w-full p-2 text-left hover:bg-gray-700 rounded-lg"
            >
              Logout
            </button>
          </li>
        </ul>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        {userInfo ? (
          <div className="mt-4">
            <p className="text-xl">Welcome, {userInfo.email}!</p>
            <p className="mt-2 text-lg">UID: {userInfo.uid}</p>
            <p className="mt-2 text-lg">Token: {userInfo.token}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
