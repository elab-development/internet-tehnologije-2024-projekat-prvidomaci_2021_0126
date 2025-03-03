import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

// wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // axios base URL
    axios.defaults.baseURL = "http://127.0.0.1:8000/";

    // add the CSRF token to Axios headers
    const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
    if (csrfTokenMeta) {
        const csrfToken = csrfTokenMeta.getAttribute('content');
        console.log('CSRF Token:', csrfToken); // Should log the token
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    } else {
        console.error('CSRF token meta tag not found!');
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
});