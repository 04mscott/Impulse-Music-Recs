// src/index.js or src/main.jsx (depending on your setup)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './auth/SpotifyAuth';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <React.StrictMode>
            <Router>
            <AuthProvider>
                <App />
            </AuthProvider>
            </Router>
        </React.StrictMode>
    );