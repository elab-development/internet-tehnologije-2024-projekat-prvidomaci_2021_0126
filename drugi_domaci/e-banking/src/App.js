import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Cards from './pages/Cards';
import NewTransaction from './pages/NewTransaction';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import Breadcrumbs from './components/Breadcrumbs';

function App() {

  const [user, setUser] = useState({
    id: 91,
    firstName: "Miloš",
    lastName: "Damjanović",
    username: "shomica",
    age: 22,
    dateOfBirth: "21/06/2002",
    gender: "Male",
    phone: "+381691343847",
    university: "Faculty of Organisational Sciences",
    workStatus: "Student",
    address: [
      {
        street: "Milosa Damjanovica 1",
        city: "Belgrade",
        country: "Serbia",
        postalCode: 123123,
      }
    ],
    email: "shomi02kraljina@gmail.com",
    email_verified_at: null,
    created_at: "2025-01-14T03:23:22.000000Z",
    updated_at: "2025-01-14T03:23:22.000000Z",
    accounts: [
      {
        id: 1,
        account_number: "1234567890123456",
        user_id: 91,
        currency: "USD",
        balance: 5343.76,
        is_active: 1,
        created_at: "2025-01-14",
        updated_at: "2025-02-05"
      },
      {
        id: 2,
        account_number: "1234567820123456",
        user_id: 91,
        currency: "USD",
        balance: 1506.23,
        is_active: 1,
        created_at: "2025-01-14",
        updated_at: "2025-02-14"
      }
    ]
  });
  const [usersList, setUsersList] = useState([user]);
  const [accounts, setAccounts] = useState([]);

  // Mockaroo koriscen za generisanje ovih podataka
  // Nije bio dovoljno relevantan API data
  let transactionData = [
    {
    "id": 1,
    "transactionId": "6e382db9-6869-4e04-a7c0-915ace2106ab",
    "recipient": "Cesya Hollingsbee",
    "dateTime": "2/7/2025",
    "amount": "$231.64"
  }, {
    "id": 2,
    "transactionId": "b92483ea-ebaa-4595-8431-4d286ae3e34f",
    "recipient": "Sunshine Bowle",
    "dateTime": "2/4/2025",
    "amount": "$120.29"
  }, {
    "id": 3,
    "transactionId": "d8b322fd-a62f-4701-9fe6-f3b1a7937f15",
    "recipient": "Jade Bartaletti",
    "dateTime": "2/9/2025",
    "amount": "$55.92"
  }, {
    "id": 4,
    "transactionId": "3abe3290-36db-464a-9360-273b5121dcb9",
    "recipient": "Sharia Westhoff",
    "dateTime": "1/25/2025",
    "amount": "$191.68"
  }, {
    "id": 5,
    "transactionId": "ecd51d07-5eba-437f-b0fe-08d99a2a2b4e",
    "recipient": "Addia Kopke",
    "dateTime": "2/7/2025",
    "amount": "$200.77"
  }, {
    "id": 6,
    "transactionId": "56544eee-f2f9-4284-aab9-3a6a96607d94",
    "recipient": "Aundrea Houtby",
    "dateTime": "1/23/2025",
    "amount": "$170.59"
  }, {
    "id": 7,
    "transactionId": "58f43f21-4207-4d24-b095-2869e885752f",
    "recipient": "Nalani Wrightem",
    "dateTime": "2/8/2025",
    "amount": "$147.25"
  }, {
    "id": 8,
    "transactionId": "72bb35e4-2f7b-40ec-a28b-04c0ebc67cfa",
    "recipient": "Izabel Hamstead",
    "dateTime": "2/7/2025",
    "amount": "$120.56"
  }, {
    "id": 9,
    "transactionId": "e866eb4d-148d-4521-a3f3-100dab430585",
    "recipient": "Malanie Ferie",
    "dateTime": "1/25/2025",
    "amount": "$115.24"
  }, {
    "id": 10,
    "transactionId": "e24778c2-ecfa-4374-97fd-12befd7c4bc3",
    "recipient": "Gregoire Pablo",
    "dateTime": "2/2/2025",
    "amount": "$57.17"
  }, {
    "id": 11,
    "transactionId": "9223ce93-ae1e-49d4-b795-b47e5e03c5f5",
    "recipient": "Jodi Grain",
    "dateTime": "1/24/2025",
    "amount": "$20.44"
  }, {
    "id": 12,
    "transactionId": "7b9b8ad7-9da7-46de-8a48-8e81587778e2",
    "recipient": "Charla McRobbie",
    "dateTime": "2/8/2025",
    "amount": "$120.21"
  }, {
    "id": 13,
    "transactionId": "0ef9a889-bc86-482c-9baf-6085bcc5b07a",
    "recipient": "Anita Breadon",
    "dateTime": "2/3/2025",
    "amount": "$232.73"
  }, {
    "id": 14,
    "transactionId": "7902c4c4-2884-4736-b8a4-1dc38b24f897",
    "recipient": "Gare St. Clair",
    "dateTime": "2/11/2025",
    "amount": "$81.16"
  }, {
    "id": 15,
    "transactionId": "4c3e429e-76f4-4123-bb1d-aedb6c98efb6",
    "recipient": "Georgetta Truitt",
    "dateTime": "2/4/2025",
    "amount": "$176.15"
  }, {
    "id": 16,
    "transactionId": "edf3eb15-c2e9-4024-98b8-529a4c4124f5",
    "recipient": "Willy Fenny",
    "dateTime": "2/3/2025",
    "amount": "$128.26"
  }, {
    "id": 17,
    "transactionId": "9012f74e-64f7-4296-9689-0e141dcf6f62",
    "recipient": "Emilee Sandy",
    "dateTime": "1/29/2025",
    "amount": "$44.41"
  }, {
    "id": 18,
    "transactionId": "68120b2f-aa02-4996-a887-5c400b4bae78",
    "recipient": "Benny Keough",
    "dateTime": "2/12/2025",
    "amount": "$173.85"
  }, {
    "id": 19,
    "transactionId": "65d8e676-0a7a-44c4-b2ef-ff22f29ccb17",
    "recipient": "Haily Elmore",
    "dateTime": "1/31/2025",
    "amount": "$99.96"
  }, {
    "id": 20,
    "transactionId": "95b6c620-b09f-4355-934a-bda2750254ce",
    "recipient": "Eryn Obray",
    "dateTime": "1/30/2025",
    "amount": "$154.54"
  }, {
    "id": 21,
    "transactionId": "c49dddad-48ba-47af-9a62-066e0d907bb7",
    "recipient": "Verne Swaine",
    "dateTime": "1/30/2025",
    "amount": "$193.82"
  }, {
    "id": 22,
    "transactionId": "22770a8d-f942-46b0-be64-31758d2040da",
    "recipient": "Allie Hirsch",
    "dateTime": "2/12/2025",
    "amount": "$96.57"
  }, {
    "id": 23,
    "transactionId": "ff4b60e0-24f7-4090-9ff8-a3bd186772b3",
    "recipient": "Andriana Sterman",
    "dateTime": "2/3/2025",
    "amount": "$177.78"
  }, {
    "id": 24,
    "transactionId": "39ea6457-ba73-4fcc-b685-06cfc533ad11",
    "recipient": "Audy Bauser",
    "dateTime": "2/1/2025",
    "amount": "$218.35"
  }, {
    "id": 25,
    "transactionId": "0cf730a1-6b7e-41c6-87d7-b84263e2acf8",
    "recipient": "Ada Crosen",
    "dateTime": "1/25/2025",
    "amount": "$96.73"
  }, {
    "id": 26,
    "transactionId": "c9d48ef1-1355-469a-9c62-267193efa65c",
    "recipient": "Alysa Hassall",
    "dateTime": "2/6/2025",
    "amount": "$156.52"
  }, {
    "id": 27,
    "transactionId": "cfd795de-df0f-4b31-a333-8581d117d3ea",
    "recipient": "Allayne Stearnes",
    "dateTime": "1/26/2025",
    "amount": "$28.14"
  }, {
    "id": 28,
    "transactionId": "f271c338-61a4-4a9d-b60f-5f3ca3031a64",
    "recipient": "Phyllys Eagleston",
    "dateTime": "1/24/2025",
    "amount": "$93.31"
  }, {
    "id": 29,
    "transactionId": "fe76eabc-1d13-4691-af83-031adef039f4",
    "recipient": "Phylys Bithell",
    "dateTime": "2/5/2025",
    "amount": "$227.34"
  }, {
    "id": 30,
    "transactionId": "0e7c074f-8d19-45e0-bdcb-16118e22a5b9",
    "recipient": "Wilfrid Fylan",
    "dateTime": "2/3/2025",
    "amount": "$135.78"
  }
  ]
  let cardData = [
    {
    "id": 1,
    "paymentType": "visa",
    "cardType": "credit",
    "cardNumber": "4555280954107",
    "cvv": 616,
    "expiryDate": "05/28",
    "account": "1234567890123456"
  }, {
    "id": 2,
    "paymentType": "visa",
    "cardType": "debit",
    "cardNumber": "4041379152481",
    "cvv": 424,
    "expiryDate": "05/28",
    "account": "1234567890123456"
  }, {
    "id": 3,
    "paymentType": "mastercard",
    "cardType": "credit",
    "cardNumber": "5002352936398140",
    "cvv": 676,
    "expiryDate": "05/28",
    "account": "1234567820123456",
  }, {
    "id": 4,
    "paymentType": "visa",
    "cardType": "prepaid",
    "cardNumber": "4041591719903784",
    "cvv": 544,
    "expiryDate": "05/28",
    "account": "1234567890123456"
  }, {
    "id": 5,
    "paymentType": "mastercard",
    "cardType": "debit",
    "cardNumber": "5141185899998478",
    "cvv": 995,
    "expiryDate": "05/28",
    "account": "1234567820123456",
  }, {
    "id": 6,
    "paymentType": "mastercard",
    "cardType": "prepaid",
    "cardNumber": "4041378778847569",
    "cvv": 295,
    "expiryDate": "05/28",
    "account": "1234567820123456",
  }
  ]
  const [transactions, setTransactions] = useState(transactionData);
  const [cards, setCards] = useState(cardData);

  const updateAccountBalance = (accountId, amount) => {
    setAccounts(prevAccounts => prevAccounts.map(account => {
      if (account.id === accountId) {
        return {...account, balance: account.balance - amount};
      }
      return account;
    }));
  };

  //Jedini iole relevantan API data koji sam pronasao
  useEffect(() => {
    fetch("https://dummyjson.com/users")
      .then(res => res.json())
      .then((res) => {
        setUsersList([user, ...res.users]); // user ostaje prvi element
      });    
  }, [user]);
  var currentUser = usersList.find( item => {return item.id === user.id});

  useEffect(() => {
    setAccounts(currentUser.accounts); 
  }, [user]);  

  return (
    <div className="App">    
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<>
            <Breadcrumbs />
            <Home user={currentUser} accounts={accounts} />
          </>} />
          <Route path="/cards" element={<>
            <Breadcrumbs />
            {<Cards cards ={cards}/>}
          </>} />
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
        </Routes>
      </BrowserRouter>
    </div>
  );

}

export default App;
