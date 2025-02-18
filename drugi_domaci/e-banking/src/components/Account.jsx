import React from 'react';
import accountPic from '../images/account-pic.png';

function Account({ account }) {
  if (!account) {
    return <p>No account data available.</p>;
  }

  function getCurrency() {
    if(account.currency === "USD") return '$';
    return '';
  }

  function getActivityStatus() {
    return account.is_active === 1 ? "Active" : "Inactive";
  }

  return (
    <div className="account-card">
      <img src={accountPic} alt="Account" className="account-image" />
      <p className="account-number">{account.account_number}</p>
      
      <div className="balance-amount">
        {getCurrency()}{account.balance}
      </div>

      <div className={`status-badge ${getActivityStatus() === "Active" ? 'status-active' : 'status-inactive'}`}>
        {getActivityStatus()}
      </div>

      <div className="dates-container">
        <p className="account-detail">Created: {(account.created_at)}</p>
        <p className="account-detail">Last Updated: {(account.updated_at)}</p>
      </div>
    </div>
  );
}

export default Account;