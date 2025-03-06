import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

// wait for the DOM to load
document.addEventListener('DOMContentLoaded', async () => {
    // axios base URL
    axios.defaults.baseURL = "http://127.0.0.1:8000/";
    axios.defaults.withCredentials = true;

    // allow Axios to send cookies
    axios.defaults.withCredentials = true;
    try {
        // fetch the CSRF token using Sanctum
        await axios.get('/sanctum/csrf-cookie');
        console.log('CSRF token fetched successfully');
    } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
});