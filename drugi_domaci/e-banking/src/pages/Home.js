import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Account from '../components/Account';
import '../style/Home.css';

function Home({user, accounts}) {
    
    return (
        
        <div>
            <h1>Welcome {user.firstName}!</h1>
        {
            accounts.map(account => (
                <Account key={account.id} account={account}/>
            )
                
            )
        }
        </div>
        
    );

}

export default Home
