import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../style/Form.css'; // Import shared styles

function Login({ setUser }) {
    const [userData, setUserData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    let navigate = useNavigate();

    function handleInput(e) {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    }

    function handleLogin(e) {
        e.preventDefault();
        setError('');

        axios.post('api/auth/login', userData)
            .then((res) => {
                if (res.data.success === true) {
                    setUser(res.data.data);
                    window.sessionStorage.setItem('auth_token', res.data.token);
                    navigate('/');
                } else {
                    setError('Invalid email or password.');
                }
            })
            .catch((e) => {
                console.log(e);
                setError('Incorrect input of login credentials.');
            });
    }

    return (
        <div className="auth-container">
            <h2>Log In</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleLogin} className="auth-form">
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Enter a valid email address"
                        required
                        name="email"
                        onInput={(e) => handleInput(e)}
                    />
                </div>

                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        required
                        name="password"
                        onInput={(e) => handleInput(e)}
                    />
                </div>

                <button type="submit" className="login-button">Login</button>
            </form>

            <div className="link-container">
                <Link to="/register">Register</Link> | <Link to="/forgotten_password">Forgotten password?</Link>
            </div>
        </div>
    );
}

export default Login;