import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Cards from './pages/Cards';
import NewTransaction from './pages/NewTransaction';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';


function App() {


  return (
    <div className="App">    
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<>
            <Home/>
          </>} />
          <Route path="/cards" element={<>
            {<Cards/>}
          </>} />
          <Route path="/transactions" element={<>
            {<Transactions/> }
          </>} />
          <Route path="/new-transaction" element={<>
            {<NewTransaction/>}
          </>} />
          <Route path="/profile" element={<>
            <Profile/>
            
          </>} />
        </Routes>
      </BrowserRouter>
    </div>
  );

}

export default App;
