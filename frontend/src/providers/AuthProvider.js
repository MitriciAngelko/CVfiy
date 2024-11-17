import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../firebase';
import { setUser, logout } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ascultător pentru schimbările stării de autentificare
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Utilizatorul este autentificat
        const token = await user.getIdToken();
        const userData = {
          uid: user.uid,
          email: user.email,
          token: token,
          // Adaugă aici orice alte câmpuri relevante
        };

        // Actualizează Redux
        dispatch(setUser(userData));

        // Actualizează localStorage
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        // Utilizatorul nu este autentificat
        dispatch(logout());
        localStorage.removeItem('user');
        navigate('/login');
      }
      setLoading(false);
    });

    // Cleanup la unmount
    return () => unsubscribe();
  }, [dispatch, navigate]);

  // Token refresh periodic
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken(true); // forțează reînnoirea token-ului
          const userData = JSON.parse(localStorage.getItem('user'));
          if (userData) {
            const updatedUserData = {
              ...userData,
              token: token
            };
            localStorage.setItem('user', JSON.stringify(updatedUserData));
            dispatch(setUser(updatedUserData));
          }
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      }
    }, 10 * 60 * 1000); // Verifică la fiecare 10 minute

    return () => clearInterval(intervalId);
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>; // sau un component de loading
  }

  return (
    <AuthContext.Provider value={{ loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;