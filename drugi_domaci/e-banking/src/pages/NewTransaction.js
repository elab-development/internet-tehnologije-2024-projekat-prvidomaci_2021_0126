import React,{useState} from 'react'

function handleSubmit(){

}

function NewTransaction() {

    const [recipient, setRecipient] = useState('');
    // const [dateTime, setDateTime] = useState('');
    const [amount, setAmount] = useState('');

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
              <label>Amount:</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="1"
                required
              />
            </div>
    
    
            <button type="submit" className="submit-button">Submit</button>
          </form>
        </div>
      );
}

export default NewTransaction
