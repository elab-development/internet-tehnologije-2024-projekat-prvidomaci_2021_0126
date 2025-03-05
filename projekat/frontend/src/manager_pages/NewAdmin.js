import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/NewTransaction.css'; // using the same style as NewTransaction.js - form is the same
import axios from 'axios';

function NewAdmin() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('admin');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            alert('Please fill out all fields.');
            return;
        }

        try {
            const authToken = window.sessionStorage.getItem('auth_token');
            const response = await axios.post(
                '/api/new-admin',
                {
                    name: name,
                    email: email,
                    password: password,
                    role: role,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            if (response.data.success) {
                navigate('/'); 
            } else {
                
                setError(response.data.message || 'Failed to create admin.');
                
            }
        } catch (error) {
            console.error('Error creating admin:', error);
            if(password.length < 8){
                setError('Password must be at least 8 characters long.');
            }else{
                setError('An error occurred while creating the admin.');
            } 
            
        }
    };

    return (
        <div className="new-transaction-container">
            <h2>Create a New Admin</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            <form onSubmit={handleSubmit} className="new-transaction-form">
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter admin name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter admin email"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter admin password"
                        required
                    />
                </div>

                <button type="submit" className="submit-button">Create Admin</button>
            </form>
        </div>
    );
}

export default NewAdmin;