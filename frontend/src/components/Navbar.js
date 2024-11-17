import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../firebase';
import { logout } from '../redux/userSlice';
import { 
  Home,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  FileText,
  MessageSquare
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigationItems = [
    {
      name: 'Home',
      path: '/home',
      icon: <Home className="w-5 h-5" />,
      show: true
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: <User className="w-5 h-5" />,
      show: !!user
    },
    {
      name: 'CV Form',
      path: '/cv-form',
      icon: <FileText className="w-5 h-5" />,
      show: !!user
    },
    {
      name: 'Chat Assistant',
      path: '/chat',
      icon: <MessageSquare className="w-5 h-5" />,
      show: !!user
    }
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button - Only show when menu is closed */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-gray-800 text-white z-40 transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header with Close Button */}
          <div className="p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            {isOpen && (
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 hover:bg-gray-700 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Rest of the navigation */}
          <nav className="flex-1">
            <ul className="space-y-2 px-4">
              {navigationItems.map((item, index) => (
                item.show && (
                  <li key={index}>
                    <button
                      onClick={() => {
                        navigate(item.path);
                        setIsOpen(false);
                      }}
                      className="w-full p-3 flex items-center space-x-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </button>
                  </li>
                )
              ))}
            </ul>
          </nav>

          {/* Auth Button */}
          <div className="p-4 border-t border-gray-700">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full p-3 flex items-center justify-center space-x-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate('/login');
                  setIsOpen(false);
                }}
                className="w-full p-3 flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;