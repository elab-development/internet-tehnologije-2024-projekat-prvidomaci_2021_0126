import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/NewTransaction.css'; 
import axios from 'axios';

function NewTransaction({accounts, setAccounts, transactions, setTransactions}) {
  const [recipient, setRecipient] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [error, setError] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({});

  const navigate = useNavigate(); //hook za dinamicko rutiranje, bez koriscenja <Link> klase

  useEffect(() => {
    const fetchExchangeRates = async () => {
        try {
            const response = await axios.get('/api/exchange-rates');
            console.log('Exchange rates:', response.data);
            if (response.data.success) {
                setCurrencies(Object.keys(response.data.rates));
                setExchangeRates(response.data.rates);
            }
            else {
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
  
    if (!recipient || !amount || !recipientAccount || !selectedAccount) {
      setError('Please fill out all fields.');
      return;
    }
  
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
  
    try {
      const authToken = window.sessionStorage.getItem("auth_token");
  
      // Convert the amount to USD
      const amountInUSD = (amount / exchangeRates[selectedCurrency]).toFixed(2);
  
      // Convert the amount to the sender's currency (domain currency)
      const domainAmount = (amountInUSD * exchangeRates[selectedAccount.currency]).toFixed(2);
  
      const response = await axios.post('/api/new-transaction', {
        account_id: selectedAccount.id,
        recipient_account: recipientAccount,
        recipient_name: recipient,
        amount_in_domain: domainAmount,
        amount: amount,
        currency: selectedCurrency,
        currency_domain: selectedAccount.currency,
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      if (response.data.success) {
        const [accountsResponse, transactionsResponse] = await Promise.all([
          axios.get('/api/profile', {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }),
          axios.get('/api/profile/transactions', {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }),
        ]);
  
        setAccounts(accountsResponse.data['user-data'].accounts);
        setTransactions(transactionsResponse.data.data);
        navigate('/transactions');
      } else {
        setError(response.data.message || 'Transaction failed.');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('Insufficient funds.');
      } else {
        console.error(error);
        setError('An error occurred while processing the transaction.');
      }
    }
  };

  return (
    <div className="new-transaction-container">
      <h2>Create a new Transaction</h2>
      <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
      <form onSubmit={handleSubmit} className="new-transaction-form">
        

      <div className="form-group">
          <label>From Account:</label>
          <select
            value={selectedAccount ? selectedAccount.id : ''}
            onChange={(e) => {
              const accountId = e.target.value;
              const account = accounts.find((acc) => acc.id === parseInt(accountId));
              setSelectedAccount(account);
            }}
            required
          >
            <option value="">Select an account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.account_number} (Balance: {account.balance} {account.currency})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Recipient:</label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter recipient name"
          />
        </div>

        <div className="form-group">
          <label>Recipient Account Number:</label>
          <input
            type="text"
            id="recipient_account"
            value={recipientAccount}
            onChange={(e) => setRecipientAccount(e.target.value)}
            placeholder="Enter recipient account number"
          />
        </div>

        <div className="form-group">
          <label>Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="0"
            step="0.1"
          />
        </div>

        <div className="form-group">
          <label>Currency:</label>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
          >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
          </select>
        </div>    


        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
}

export default NewTransaction;