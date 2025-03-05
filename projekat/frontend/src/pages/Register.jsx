import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/Form.css'; 

const Register = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        date_of_birth: '',
        gender: '',
        work_status: '',
        street: '',
        city: '',
        country: '',
        postal_code: '',
        phone_number: '',
    });
    const [error, setError] = useState('');

    let navigate = useNavigate();

    function handleInput(e) {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    function handleRegister(e) {
        e.preventDefault();
        axios.post('api/auth/register', userData)
            .then((res) => {
                console.log(res.data);
                navigate('/login');
            })
            .catch((e) => {
                console.error('Error creating user:', error);
                if(userData.password.length < 8){
                    setError('Password must be at least 8 characters long.');
                }else{
                    setError('An error occurred while creating the user.');
                } 
            });
    }

    return (
        <div className="auth-container register-container">
            <h2>Register</h2>
            <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
            <form onSubmit={handleRegister} className="auth-form">
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        required
                        name="name"
                        onInput={(e) => handleInput(e)}
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
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

                <div className="form-group">
                    <label>Date of Birth:</label>
                    <input
                        type="date"
                        name="date_of_birth"
                        value={userData.date_of_birth}
                        onChange={handleInput}
                    />
                </div>

                <div className="form-group">
                    <label>Gender:</label>
                    <select name="gender" value={userData.gender} onChange={handleInput}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Work Status:</label>
                    <select name="work_status" value={userData.work_status} onChange={handleInput}>
                        <option value="">Select Work Status</option>
                        <option value="unemployed">Unemployed</option>
                        <option value="student">Student</option>
                        <option value="employed">Employed</option>
                        <option value="retired">Retired</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Address:</label>
                    <input type="text" name="street" placeholder="Street" value={userData.street} onChange={handleInput} />
                    <input type="text" name="city" placeholder="City" value={userData.city} onChange={handleInput} />
                    <input type="text" name="country" placeholder="Country" value={userData.country} onChange={handleInput} />
                    <input type="text" name="postal_code" placeholder="Postal Code" value={userData.postal_code} onChange={handleInput} />
                </div>

                <div className="form-group">
                    <label>Phone Number:</label>
                    <input type="text" name="phone_number" placeholder="Phone Number" value={userData.phone_number} onChange={handleInput} />
                </div>

                <button type="submit" className="submit-button">Register</button>
            </form>
        </div>
    );
};

export default Register;