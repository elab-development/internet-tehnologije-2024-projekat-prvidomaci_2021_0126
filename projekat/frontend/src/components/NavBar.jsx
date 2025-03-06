import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import '../style/NavBar.css';

import axios from 'axios';

function NavBar({user,setUser,setAccounts,setCards,setTransactions}) {

  const navigate = useNavigate();

  const userLinks = <>
    <li><Link to="/logout" onClick={handleLogout}>Logout</Link></li>
    <li><Link to="/">Home</Link></li>
    <li><Link to="/cards">Cards</Link></li>
    <li><Link to="/transactions">Transactions</Link></li>
    <li><Link to="/contact">Contact</Link></li>
    <li><Link to="/new-transaction" className="new-transaction-link"><FiPlus /></Link></li> 
  </>
  const adminLinks = <>
    <li><Link to="/logout" onClick={handleLogout}>Logout</Link></li>
    <li><Link to="/">Users</Link></li>
  </>
  const managerLinks = <>
    <li><Link to="/logout" onClick={handleLogout}>Logout</Link></li>
    <li><Link to="/">Admins</Link></li>
    <li><Link to="/new-admin">New Admin</Link></li>
  </>

  function handleLogout(){
    //saving token in variable before removing it from the session storage
    const token = window.sessionStorage.getItem("auth_token");
    window.sessionStorage.removeItem("auth_token");

    // faster log out with refreshing states before config
    navigate('/');
    setUser(null);
    setAccounts([]);
    setCards([]);
    setTransactions([]);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'api/auth/logout',
      headers: { 
        'Authorization': 'Bearer '+token,
      },
    };

    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Shomica Bank</Link>
      </div>
      <ul className="navbar-links">

        {/* login/logout */}
        {window.sessionStorage.getItem("auth_token") == null 
        ? <>
          
        </>
        : user?.role === 'user' ? userLinks : user?.role === 'admin' ? adminLinks : managerLinks

         
           }
      
        
      </ul>
    </nav>
  );
};

export default NavBar;
