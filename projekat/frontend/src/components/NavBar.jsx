import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import '../style/NavBar.css';
import axios from 'axios';

function NavBar() {

  const navigate = useNavigate();
  function handleLogout(){
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'api/auth/logout',
      headers: { 
        'Authorization': 'Bearer ' +window.sessionStorage.getItem("auth_token"), 
      },
    };

    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      window.sessionStorage.removeItem("auth_token");
      navigate('/');
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
        : (<>
          <li><Link to="/logout" onClick={handleLogout}>Logout</Link></li>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/cards">Cards</Link></li>
          <li><Link to="/transactions">Transactions</Link></li>
          <li><Link to="/new-transaction" className="new-transaction-link"><FiPlus /></Link></li> 
          </>
         )
           }
      
        
      </ul>
    </nav>
  );
};

export default NavBar;
