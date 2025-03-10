import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../style/NewTransaction.css';
import axios from 'axios';

function NewAccount() {
  const { userId } = useParams();
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [currencies, setCurrencies] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  //fetching exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get('/api/exchange-rates');
        if (response.data.success) {
          setCurrencies(Object.keys(response.data.rates));
          setExchangeRates(response.data.rates);
        } else {
          console.error('Failed to fetch exchange rates:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    const amountInUSD = (amount / exchangeRates[selectedCurrency]).toFixed(2);


                        
    if(amountInUSD > 20000){
      setError('Amount cannot be greater than 20000 USD');
      return;
    }

    try {
      const authToken = window.sessionStorage.getItem('auth_token');
      const response = await axios.post(
        '/api/new-account',
        {
          balance: amount,
          balance_in_usd: amountInUSD,
          currency: selectedCurrency,
          user_id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.success) {
        console.log(JSON.stringify(response.data));
        navigate(`/users/${userId}`);
      } 
      else {
        setError(response.data.message || 'Failed to create account.');
      }
    } catch (error) {
      
      console.error('Error creating account:', error);
      setError('An error occurred while creating the account.');
    }
  };

  return (
    <div className="new-transaction-container">
      <h2>Create a New Account</h2>
      <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
      <form onSubmit={handleSubmit} className="new-transaction-form">
        <div className="form-group">
          <label>Starting Balance:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter starting balance"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Currency:</label>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            required
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-button">Create Account</button>
      </form>
    </div>
  );
}

export default NewAccount;