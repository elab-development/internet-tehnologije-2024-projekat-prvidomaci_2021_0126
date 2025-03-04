import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../style/Form.css'; 

function ForgottenPassword() {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    let navigate = useNavigate();

    function handleInput(e) {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSuccess('');

        axios.post('api/auth/forgot-password', userData)
            .then((res) => {
                if (res.data.success === true) {
                    setSuccess('Password updated successfully!');
                    setTimeout(() => { navigate('/login'); }, 1500);
                } else {
                    setError(res.data.message || 'An error occurred.');
                }
            })
            .catch((error) => {
                console.error(error);
                setError(error.response?.data?.message || 'An error occurred. Please try again.');
            });
    }

    return (
        <div className="auth-container">
            <h2>Forgotten Password</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        required
                        name="name"
                        onInput={(e) => handleInput(e)}
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        required
                        name="email"
                        onInput={(e) => handleInput(e)}
                    />
                </div>

                <div className="form-group">
                    <h4>Choose your new password:</h4>
                    <label>New Password:</label>
                    <input
                        type="password"
                        placeholder="Enter your new password"
                        required
                        name="password"
                        onInput={(e) => handleInput(e)}
                    />
                </div>

                <button type="submit" className="submit-button">Change Password</button>
            </form>

            <div className="link-container">
                <Link to="/login">Back to Login</Link>
            </div>
        </div>
    );
}

export default ForgottenPassword;