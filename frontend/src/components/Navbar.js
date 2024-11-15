import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../firebase'; // Ensure this is correctly imported

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('user'); // Remove user data from localStorage
      navigate('/login'); // Redirect to the login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="fixed left-0 top-0 w-64 h-full bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-8">Dashboard</h2>
      <ul>
        <li className="mb-6">
          <button
            onClick={() => navigate('/home')}
            className="w-full p-2 text-left hover:bg-gray-700 rounded-lg"
          >
            Home
          </button>
        </li>
        <li className="mb-6">
          <button
            onClick={() => navigate('/profile')}
            className="w-full p-2 text-left hover:bg-gray-700 rounded-lg"
          >
            Profile
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
    </div>
  );
};

export default Navbar;
