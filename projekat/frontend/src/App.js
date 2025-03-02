import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Cards from './pages/Cards';
import NewTransaction from './pages/NewTransaction';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import Breadcrumbs from './components/Breadcrumbs';
import useLocalStorage from './hooks/useLocalStorage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './pages/ProtectedRoute';
import ForgottenPassword from './pages/ForgottenPassword';
import axios from 'axios';

function App() {
  
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions,setTransactions] = useState();
  const [cards, setCards] = useState();
  
  //fetching data for these 4 states
  useEffect( () => {

    const authToken = window.sessionStorage.getItem("auth_token");
  
      if (!authToken) {
        console.log("User is not authenticated. Skipping data fetch.");
        return;
      }
    function fetchUserData(){
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'api/profile',
        headers: { 
          'Authorization': 'Bearer '+window.sessionStorage.getItem("auth_token"),
        }
      };
      
      axios.request(config).then( res =>{
        console.log(JSON.stringify(res.data));
        const userData = res.data['user-data'];

        setUser(userData);
        setAccounts(userData.accounts);
      }).catch((error) => {
        console.log("Error fetching user data: " +error);
      }); 
    }
    function fetchTransactionsData(){
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'api/profile/transactions',
        headers: { 
          'Authorization': 'Bearer '+window.sessionStorage.getItem("auth_token"),
        }
      };
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        const transactionData = response.data['data'];
        setTransactions(transactionData);
      })
      .catch((error) => {
        console.log("Error fetching transaction data: " +error);
      });
      
    }
    function fetchCardsData(){
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'api/profile/cards',
        headers: { 
          'Authorization': 'Bearer '+window.sessionStorage.getItem("auth_token"),
        }
      };
      
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        const cardData = response.data['data'];
        setCards(cardData);
        console.log(cardData);
      })
      .catch((error) => {
        console.log("Error fetching card data: " +error);
      });
      
    }

    fetchUserData();
    fetchTransactionsData();
    fetchCardsData();
  },[window.sessionStorage.getItem("auth_token")]);


  const updateAccountBalance = (accountId, amount) => {
    setAccounts(prevAccounts => prevAccounts.map(account => {
      if (account.id === accountId) {
        return {...account, balance: account.balance - amount};
      }
      return account;
    }));
  };

  return (
    <div className="App">    
      <BrowserRouter>
        <NavBar setUser={setUser} setAccounts={setAccounts} setCards={setCards} setTransactions={setTransactions}/>
        <Routes>

          <Route path='/login' element= {<Login setUser={setUser}/>}/>
          <Route path='/register' element= {<Register/>}/>
          <Route path='/forgotten_password' element= {<ForgottenPassword/>}/>

          <Route element={<ProtectedRoute/>}>

            <Route path="/" element={<>
              <Breadcrumbs />
              <Home user={user} accounts={accounts} />
            </>}>
            </Route>

            <Route path="/cards" element={<>
              <Breadcrumbs />
              {<Cards cards ={cards}/>}
              </>} 
            />
            <Route path="/transactions" element={<>
              <Breadcrumbs />
              {<Transactions transactions={transactions}/> }
            </>} />
            <Route path="/new-transaction" element={<>
              <Breadcrumbs />
              {<NewTransaction accounts = {accounts } updateAccountBalance ={updateAccountBalance}
                              transactions={transactions} setTransactions = {setTransactions}/>}
            </>} />

            <Route path="/profile" element={<>
              <Breadcrumbs />
              <Profile user={user} />
            </>} />

          
          </Route>

          {/* uz ovo, koju god rutu (cak i pogresnu) korisnik da ukuca, uvek ga vodi ka login page ako nije logged */}
          <Route path="*" element={<Navigate to="/login" replace />} />

          </Routes>
          
      </BrowserRouter>
    </div>
  );

}

export default App;
