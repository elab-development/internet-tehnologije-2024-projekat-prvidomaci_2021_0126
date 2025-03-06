import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import Account from '../components/Account';
import '../style/UserProfile.css'; // Import the new CSS file

Chart.register(...registerables);

function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date_of_birth: '',
    gender: '',
    work_status: '',
    street: '',
    city: '',
    country: '',
    postal_code: '',
    email: '',
    phone_number: '',
  });
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

        // Populate form data
        setFormData({
          name: response.data.name,
          date_of_birth: response.data.date_of_birth,
          gender: response.data.gender,
          work_status: response.data.work_status,
          street: response.data.street,
          city: response.data.city,
          country: response.data.country,
          postal_code: response.data.postal_code,
          email: response.data.email,
          phone_number: response.data.phone_number,
        });

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
    labels: accounts.map((account) => account.account_number),
    datasets: [
      {
        label: '$',
        data: accounts.map((account) => account.balance_in_usd),
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
      },
    ],
  };

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

  const handleNextAccount = () => {
    if (accounts.length > 0) {
      const currentIndex = accounts.findIndex((acc) => acc.id === currentAccount.id);
      const nextIndex = (currentIndex + 1) % accounts.length;
      setCurrentAccount(accounts[nextIndex]);
    }
  };

  const handlePreviousAccount = () => {
    if (accounts.length > 0) {
      const currentIndex = accounts.findIndex((acc) => acc.id === currentAccount.id);
      const previousIndex = (currentIndex - 1 + accounts.length) % accounts.length;
      setCurrentAccount(accounts[previousIndex]);
    }
  };

  const handleSaveChanges = async () => {
    try {
        const authToken = window.sessionStorage.getItem('auth_token');
        const response = await axios.put(
            `api/users/${id}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        setIsEditing(false);
        window.location.reload();
    } catch (error) {
        console.error('Error updating user data:', error.response ? error.response.data : error.message);
        setError('An error occurred while updating user data.');
    }
  };

  if (loading) {
    return <p>Loading user profile...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="up-container">
      <div className="up-top-section">
        <div className="up-accounts-section">
          <h3>Accounts</h3>
          {currentAccount ? (
            <Account account={currentAccount} />
          ) : (
            <p>No accounts available.</p>
          )}

          {accounts.length > 1 ? (
            <div className="up-account-nav-buttons1">
              <button className="up-account-button1" onClick={handlePreviousAccount}>Previous</button>
              <button className="up-account-button" onClick={() => navigate(`/accounts/${currentAccount.id}/cards`)}>View Cards</button>
              <button className="up-account-button" onClick={() => navigate(`/new-account/${user.id}`)}>New Account</button>
              <button className="up-account-button1" onClick={handleNextAccount}>Next</button>
            </div>
          ) : accounts.length === 1 ? (
            <div className="up-account-nav-buttons1">
              <button className="up-account-button" onClick={() => navigate(`/accounts/${currentAccount.id}/cards`)}>View Cards</button>
              <button className="up-account-button" onClick={() => navigate(`/new-account/${user.id}`)}>New Account</button>
            </div>
          ) : (
            <div className="up-account-nav-buttons1">
              <button className="up-account-button" onClick={() => navigate(`/new-account/${user.id}`)}>New Account</button>
            </div>
          )}
        </div>

        <div className="up-chart-section">
          <h3>Account Balances</h3>
          <Doughnut data={chartData} options={chartOptions} />
          <div className="up-total-balance">
            <strong>Total Balance:</strong> ${totalBalance.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="up-profile-data-section">
        <h3>Profile Data</h3>
        <div className="up-profile-section">
          <h4>Personal Data</h4>
          {isEditing ? (
            <>
              <label>Name:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <label>Date of Birth:</label>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
              />
              <label>Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <label>Work Status:</label>
              <select
                name="work_status"
                value={formData.work_status}
                onChange={(e) => setFormData({ ...formData, work_status: e.target.value })}
              >
                <option value="">Select Work Status</option>
                <option value="unemployed">Unemployed</option>
                <option value="student">Student</option>
                <option value="employed">Employed</option>
                <option value="retired">Retired</option>
              </select>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Date of Birth:</strong> {user.date_of_birth}</p>
              <p><strong>Gender:</strong> {user.gender}</p>
              <p><strong>Work Status:</strong> {user.work_status}</p>
            </>
          )}
        </div>

        <div className="up-profile-section">
          <h4>Address</h4>
          {isEditing ? (
            <>
              <label>Street:</label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              />
              <label>City:</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              <label>Country:</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
              <label>Postal Code:</label>
              <input
                type="text"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              />
            </>
          ) : (
            <>
              <p><strong>Street:</strong> {user.street}</p>
              <p><strong>City:</strong> {user.city}</p>
              <p><strong>Country:</strong> {user.country}</p>
              <p><strong>Postal Code:</strong> {user.postal_code}</p>
            </>
          )}
        </div>

        <div className="up-profile-section">
          <h4>Contact</h4>
          {isEditing ? (
            <>
              <label>Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <label>Phone:</label>
              <input
                type="text"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              />
            </>
          ) : (
            <>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone_number}</p>
            </>
          )}
        </div>

        <button className="up-edit-button" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit'}
        </button>

        {isEditing && (
          <button className="up-save-button" onClick={handleSaveChanges}>
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
}

export default UserProfile;