import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { setUser, logout } from '../redux/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';

// Initialize Firebase services
import { auth } from '../firebase';

export const AuthContext = createContext();

// Definim rutele publice care nu necesită autentificare
const PUBLIC_ROUTES = ['/login', '/register'];

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ascultător pentru schimbările stării de autentificare
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Utilizatorul este autentificat
        const token = await user.getIdToken();
        const userData = {
          uid: user.uid,
          email: user.email,
          token: token,
        };

        // Actualizează Redux
        dispatch(setUser(userData));

        // Actualizează localStorage
        localStorage.setItem('user', JSON.stringify(userData));

        // Fetch user's role from Firestore
        const db = getFirestore();
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userRole = userDoc.data().role;

          // If user is an admin, redirect them to the admin page
          if (userRole === 'admin') {
            navigate('/admin');
          } else {
            // If not admin, stay on the current page or redirect to home
            if (!PUBLIC_ROUTES.includes(location.pathname)) {
              navigate('/');
            }
          }
        } else {
          console.log('User data not found in Firestore');
        }
      } else {
        // Utilizatorul nu este autentificat
        dispatch(logout());
        localStorage.removeItem('user');

        // Verificăm dacă suntem pe o rută care necesită autentificare
        if (!PUBLIC_ROUTES.includes(location.pathname)) {
          navigate('/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch, navigate, location]);

  // Token refresh periodic
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken(true);
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
    }, 10 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
