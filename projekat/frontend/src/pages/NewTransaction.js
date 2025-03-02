import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/NewTransaction.css'; 
import useLocalStorage from '../hooks/useLocalStorage';

function NewTransaction({accounts, updateAccountBalance,transactions, setTransactions}) {
  const [recipient, setRecipient] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [newTransactions, setNewTransactions] = useLocalStorage('newTransactions', '');
  const navigate = useNavigate(); //hook za dinamicko rutiranje, bez koriscenja <Link> klase

  const handleSubmit = (e) => {
    e.preventDefault() // da se ne bi refreshovala stranica kada kliknem submit

    if (!recipient || !amount ||!recipientAccount) {
      alert('Please fill out all fields.');
      return;
    }

    const accountToUpdate = accounts.find(acc => acc.balance >= amount);
    
    if (!accountToUpdate) {
      alert('Insufficient funds in all accounts');
      return;
    }

    updateAccountBalance(accountToUpdate.id, amount);

    const newTransaction = {
      id: transactions.length+1 , 
      transactionId: `tID-${Date.now()}`, // generise id 
      recipient: recipient,
      dateTime: new Date().toLocaleString(),
      amount: `$${amount}`,
    };    

    setNewTransactions(prevNewTransactions => [...prevNewTransactions, newTransaction])
    setTransactions(prevTransactions => [...prevTransactions, newTransaction])
    navigate('/transactions'); //prebacuje me direktno u transakcije
  };
  return (
    <div className="new-transaction-container">
      <h2>Create New Transaction</h2>
      <form onSubmit={handleSubmit} className="new-transaction-form">
        
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
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter recipient name"
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