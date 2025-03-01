import React,{useState} from 'react'
import axios from "axios";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Login({}) {

  const [userData, setUserData] = useState({
    email:"",
    password: "",
  })  
  let navigate = useNavigate();
  
  function handleInput(e){
      let newUserData = userData;
      newUserData[e.target.name] = e.target.value;
    //   console.log(e)
      setUserData(newUserData); 
  }

  function handleLogin(e){
    e.preventDefault();
    axios.post("api/auth/login", userData).then((res) =>{
        console.log(res.data)
        if(res.data.success === true){
            window.sessionStorage.setItem("auth_token", res.data.token);
            navigate("/");
        }
    }).catch(e=> {
        console.log(e);
    });
  }

  return (
    <div>

    <h2>Log In</h2>
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
    </div>
  )
}

export default Login
