import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice'; // Importă acțiunea setUser
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Corectat importul aici
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);  // Folosește auth
      const user = userCredential.user;

      // Salvează datele utilizatorului în localStorage
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        token: await user.getIdToken(), // Optional, dacă vrei să salvezi token-ul
      }));

      // Salvează utilizatorul în Redux
      dispatch(setUser({
        uid: user.uid,
        email: user.email,
      }));

      // Redirecționează utilizatorul către pagina principală
      navigate('/home');  // Aici schimbăm ruta către Homepage.js
    } catch (error) {
      console.error("Autentificare eșuată:", error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleLogin}
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
        >
          Login
        </button>
        <p className="mt-4 text-center">
          Don't have an account? 
          <button
            onClick={() => navigate('/register')}
            className="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
