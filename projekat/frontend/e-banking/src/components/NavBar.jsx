import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import '../style/NavBar.css';

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Shomica Bank</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/cards">Cards</Link></li>
        <li><Link to="/transactions">Transactions</Link></li>
        <li><Link to="/new-transaction" className="new-transaction-link"><FiPlus /></Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;
