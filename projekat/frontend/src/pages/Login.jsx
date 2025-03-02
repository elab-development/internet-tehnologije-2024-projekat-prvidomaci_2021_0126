import React,{useState} from 'react'
import axios from "axios";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Login({}) {

  const [userData, setUserData] = useState({
    email:"",
    password: "",
  })  

  const [error, setError] = useState('');
  let navigate = useNavigate();
  
  function handleInput(e){
      let newUserData = userData;
      newUserData[e.target.name] = e.target.value;
    //   console.log(e)
      setUserData(newUserData); 
  }

  function handleLogin(e){
    e.preventDefault(); setError('');

    axios.post("api/auth/login", userData).then((res) =>{
        console.log(res.data)
        if(res.data.success === true){
            window.sessionStorage.setItem("auth_token", res.data.token);
            navigate("/");
        } else {
          setError('Invalid email or password.'); // Set error message
        }
    }).catch(e=> {
        console.log(e);
        setError('Incorrect input of login credentials.');
    });
  }

  return (
    <div>

    <h2>Log In</h2>
    <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
      <form onSubmit={handleLogin}>


        <div >
          <label>Email: </label>
          <input
            type="email"
            placeholder="Enter a valid email address"
            required
            name='email'
            onInput={(e) => handleInput(e)}
          />
        </div>

        <div >
          <label>Password: </label>
          <input
            type="password"
            placeholder="Enter password"
            required
            name='password'
            onInput={(e) => handleInput(e)}
          />
          </div>
      
      <button type="submit" className="submit-button">Login</button>
      </form>

      <div><Link to="/register">Register</Link></div>
      <div><Link to="/forgotten_password">Forgotten password?</Link></div>
    </div>
  )
}

export default Login
