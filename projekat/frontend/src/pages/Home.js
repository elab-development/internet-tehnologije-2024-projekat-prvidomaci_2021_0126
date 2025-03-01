import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Account from '../components/Account';
import '../style/Home.css';

function Home({ user, accounts }) {
    const [currentAccount, setCurrentAccount] = useState(accounts.length > 0 ? accounts[0] : null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      if (accounts && accounts.length > 0) {
        setCurrentAccount(accounts[0]); 
        setLoading(false); 
      }
    }, [accounts]);
  
    const handleNextAccount = () => {
      if (accounts && accounts.length > 0) {
        let currentIndex = accounts.findIndex(acc => acc.id === currentAccount.id);
        let nextIndex = currentIndex + 1
        if(nextIndex === accounts.length)
          nextIndex = 0;
  
        setCurrentAccount(accounts[nextIndex]);
      }
    };
  
    const handlePreviousAccount = () => {
      if (accounts && accounts.length > 0) {
        let currentIndex = accounts.findIndex(acc => acc.id === currentAccount.id);
        let previousIndex = currentIndex - 1
        if(previousIndex === -1)
          previousIndex = accounts.length-1;;
        setCurrentAccount(accounts[previousIndex]);
      }
    };
  
    if (loading) {
      return <p>Loading accounts...</p>;
    }
  
    return (
      <div>
        <h1 className="welcome-heading">Welcome {user.firstName}!</h1>
        <Link to="/profile" className="profile-link">Profile Info</Link>
        <p className="accounts-text">Your accounts:</p>
  
  
        {currentAccount ? (
          <Account account={currentAccount} />
        ) : (
          <p>No accounts available.</p>
        )}
  
        <div className="account-nav-buttons">
          <button className="account-button" onClick={handlePreviousAccount}>Previous</button>
          <button className="account-button" onClick={handleNextAccount}>Next</button>
        </div>
      </div>
    );
  }

export default Home
