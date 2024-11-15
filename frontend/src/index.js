import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';  // Importă Provider
import store from './redux/store';      // Importă store-ul Redux

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>  {/* Împachetează aplicația cu Provider */}
      <App />
    </Provider>
  </React.StrictMode>
);

// Dacă vrei să măsori performanța aplicației, poți transmite o funcție pentru a înregistra rezultatele
// (de exemplu: reportWebVitals(console.log)) sau să le trimiti către un endpoint de analytics.
reportWebVitals();
