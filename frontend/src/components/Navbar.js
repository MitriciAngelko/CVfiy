import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../firebase';
import { logout } from '../redux/userSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());  // Dispatch logout action to Redux
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white p-4 flex-shrink-0">
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
        
        {user ? (
          <>
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
                className="w-full p-2 text-left bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li className="mb-6">
            <button
              onClick={() => navigate('/login')}
              className="w-full p-2 text-left hover:bg-gray-700 rounded-lg"
            >
              Login
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Navbar;