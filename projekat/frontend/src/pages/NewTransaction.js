import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/NewTransaction.css'; 
import axios from 'axios';

function NewTransaction({accounts, setAccounts, transactions, setTransactions}) {
  const [recipient, setRecipient] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); //hook za dinamicko rutiranje, bez koriscenja <Link> klase

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!recipient || !amount || !recipientAccount || !selectedAccount) {
      alert('Please fill out all fields.');
      return;
    }
  
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
  
    try {
      const authToken = window.sessionStorage.getItem("auth_token");
      const response = await axios.post('/api/new-transaction', {
        account_id: selectedAccount,
        recipient_account: recipientAccount,
        recipient_name: recipient,
        amount: amount,
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
      <h2>Create New Transaction</h2>
      <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
      <form onSubmit={handleSubmit} className="new-transaction-form">
        

      <div className="form-group">
          <label>From Account:</label>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            required
          >
            <option value="">Select an account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.account_number} (Balance: ${account.balance})
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
            required
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
            required
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
            step="0.01"
            required
          />
        </div>


        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
}

export default NewTransaction;