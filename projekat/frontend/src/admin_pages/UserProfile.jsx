import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import Account from '../components/Account';
import '../style/Home.css'; 
import '../style/Profile.css';

Chart.register(...registerables);

function UserProfile() {
  const { id } = useParams(); // get the user id from the url
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const authToken = window.sessionStorage.getItem('auth_token');
        const response = await axios.get(`api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log('API Response:', response.data);
        setUser(response.data);
        setAccounts(response.data.accounts || []);
        setCurrentAccount(response.data.accounts.length > 0 ? response.data.accounts[0] : null);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  const totalBalance = accounts.reduce((sum, account) => sum + parseFloat(account.balance_in_usd), 0);

  const chartData = {
    labels: accounts.map(account => account.account_number),
    datasets: [{
      label: '$',
      data: accounts.map(account => account.balance_in_usd),
      backgroundColor: [
        'rgba(33, 53, 85, 0.9)',
        'rgba(88, 111, 154, 0.9)',
        'rgba(216,196,182,0.6)',
        'rgba(136, 149, 212, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
      borderColor: [
        'rgba(33, 53, 85, 1)',
        'rgba(88, 111, 154, 1)',
        'rgba(216,196,182,1)',
        'rgba(136, 149, 212, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
    }],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Account Balances in $',
      },
    },
  };

  // Handle next account
  const handleNextAccount = () => {
    if (accounts.length > 0) {
      const currentIndex = accounts.findIndex(acc => acc.id === currentAccount.id);
      const nextIndex = (currentIndex + 1) % accounts.length;
      setCurrentAccount(accounts[nextIndex]);
    }
  };

  // Handle previous account
  const handlePreviousAccount = () => {
    if (accounts.length > 0) {
      const currentIndex = accounts.findIndex(acc => acc.id === currentAccount.id);
      const previousIndex = (currentIndex - 1 + accounts.length) % accounts.length;
      setCurrentAccount(accounts[previousIndex]);
    }
  };

  if (loading) {
    return <p>Loading user profile...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }


    return (
        <div className="profile-container">
          <div className="profile-data">
      
            <div className="profile-section">
              <h3>Personal Data</h3>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Date of Birth:</strong> {user.date_of_birth}</p>
              <p><strong>Gender:</strong> {user.gender}</p>
              <p><strong>Work Status:</strong> {user.work_status}</p>
            </div>
      
            <div className="profile-section">
              <h3>Address</h3>
              <p><strong>Street:</strong> {user.street}</p>
              <p><strong>City:</strong> {user.city}</p>
              <p><strong>Country:</strong> {user.country}</p>
              <p><strong>Postal Code:</strong> {user.postal_code}</p>
            </div>
      
            <div className="profile-section profile-contact">
              <h3>Contact</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone_number}</p>
            </div>
          
      
          <div className="profile-accounts">     
            <div className="account-nav-container">
              <h3>Accounts</h3>
              {currentAccount ? (
                <Account account={currentAccount} />
              ) : (
                <p>No accounts available.</p>
              )}
      
              {accounts.length > 1 ? (
                <div className="account-nav-buttons">
                  <button className="account-button1" onClick={handlePreviousAccount}>Previous</button>
                  <button className="account-button" onClick={() => navigate(`/accounts/${currentAccount.id}/cards`)}>View Cards</button>
                  <button className="account-button" onClick={() => navigate(`/new-account/${user.id}`)}>New Account</button>
                  <button className="account-button1" onClick={handleNextAccount}>Next</button>
                </div>
              ):accounts.length === 1 ? (
                <div className="account-nav-buttons">
                  <button className="account-button" onClick={() => navigate(`/accounts/${currentAccount.id}/cards`)}>View Cards</button>
                  <button className="account-button" onClick={() => navigate(`/new-account/${user.id}`)}>New Account</button>
                </div>
              ) :
              (
                <div className="account-nav-buttons">
                  <button className="account-button" onClick={() => navigate(`/new-account/${user.id}`)}>New Account</button>
                </div>
              )}
            </div>
            <div className="chart-container">
              
              <Doughnut data={chartData} options={chartOptions} />
              <div className="total-balance">
                <strong>Total Balance:</strong> ${totalBalance.toFixed(2)}
              </div>
            </div>  
            </div>
          </div>
        </div>
      );
}

export default UserProfile;