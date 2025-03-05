import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Cards from './pages/Cards';
import NewTransaction from './pages/NewTransaction';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import Breadcrumbs from './components/Breadcrumbs';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './pages/ProtectedRoute';
import ForgottenPassword from './pages/ForgottenPassword';
import Contact from './pages/Contact';
import axios from 'axios';
import Footer from './components/Footer';
import Admins from './manager_pages/Admins';
import NewAdmin from './manager_pages/NewAdmin';
import AuthenticatedRoute from './pages/AuthenticatedRoute';

function App() {
  

  const [user, setUser] = useState(() =>{
    const storedUser = window.sessionStorage.getItem('user_data');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [accounts, setAccounts] = useState([]);
  const [transactions,setTransactions] = useState([]);
  const [cards, setCards] = useState([]);
  const [admins, setAdmins] = useState([]);


  const userRoutes = <> 
    <Route path="/" element={<> <Home user={user} accounts={accounts} /> </>} > </Route>
    <Route path="/cards" element= {<><Breadcrumbs />{<Cards cards ={cards} setCards={setCards}/>}</>} />
    <Route path="/transactions" element={<><Breadcrumbs />{<Transactions transactions={transactions}/> }</>} />   
    <Route path="/new-transaction" element={<><Breadcrumbs />
                      {<NewTransaction accounts = {accounts } setAccounts ={setAccounts}
                      transactions={transactions} setTransactions = {setTransactions}/>}
    </>} />
    <Route path="/profile" element={<><Breadcrumbs /><Profile user={user} /></>} />
    <Route path="/contact" element={<><Breadcrumbs /> <Contact/></>}>  </Route>  
    <Route path="*" element={<Navigate to="/" replace />} />
    <Route path="/login" element={<Navigate to="/" replace />} />
  </>
  
  const adminRoutes = <>

  </>
  const managerRoutes = <>
    <Route path="/" element={<Admins admins={admins}/>}/>
    <Route path="/new-admin" element={<NewAdmin/>}/>
    <Route path="*" element={<Navigate to="/" replace />} />
  </>
  
  //fetching data for these users, accounts, transactions, cards, admins
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
        JSON.stringify(res.data);
        const userData = res.data['user-data'];
        window.sessionStorage.setItem('user_data', JSON.stringify(userData));
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
        JSON.stringify(response.data);
        const transactionData = response.data['data'];
        setTransactions(transactionData);
      })
      .catch((error) => {
        if(axios.isAxiosError(error)){
          console.log("No transactions found!");
        }
        else {
          console.log("Error fetching transaction data: " +error);
        }
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
        JSON.stringify(response.data);
        const cardData = response.data['data'];
        setCards(cardData);
      })
      .catch((error) => {
        if(axios.isAxiosError(error)){
          console.log("No cards found!");
        }
        else {
          console.log("Error fetching card data: " +error);
        }
      });
      
    }
    
    if(user.role === 'user'){
      fetchUserData();
      fetchTransactionsData();
      fetchCardsData();
    }
    if(user.role === 'manager'){
      return;
    }
  },[window.sessionStorage.getItem("auth_token")]);



  return (
    <div className="App">    
      <BrowserRouter>
        <NavBar user={user} setUser={setUser} setAccounts={setAccounts} setCards={setCards} setTransactions={setTransactions}/>
        <Routes>
          <Route element={<AuthenticatedRoute/>}>
            <Route path='/login' element= {<Login setUser={setUser}/>}/>
            <Route path='/register' element= {<Register/>}/>
            <Route path='/forgotten_password' element= {<ForgottenPassword/>}/>
          </Route>
          <Route element={<ProtectedRoute/>}>

          {user?.role === 'user' ? userRoutes : user?.role === 'admin' ? adminRoutes : managerRoutes}
          

          
          </Route>

          {/* uz ovo, koju god rutu (cak i pogresnu) korisnik da ukuca, uvek ga vodi ka login page ako nije logged */}
          {/* routes/api.php i ovaj element omogucavaju zastitu od IDOR napada, jer nijedan neautorizovan korisnik ne moze da 
          pristupa rutama koje mu nisu dozvoljene */}
          <Route path="*" element={<Navigate to="/login" replace />} />

          </Routes>
          <Footer />
      </BrowserRouter>
    </div>
  );

}

export default App;
