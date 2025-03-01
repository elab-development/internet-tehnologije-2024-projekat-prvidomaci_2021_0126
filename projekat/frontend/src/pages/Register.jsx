import React,{useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Register = () => {

    const [userData, setUserData] = useState({
        name: "",
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
    
      function handleRegister(e){
        e.preventDefault();
        axios.post("api/auth/register", userData).then((res) =>{
            console.log(res.data)
            navigate("/login")
        }).catch(e=> {
            console.log(e);
        });
      }

    return (
        <div>
    
        <h2>Register</h2>
          <form onSubmit={handleRegister}>
    
          <div >
              <label>Name: </label>
              <input
                type="name"
                placeholder="Enter a valid username"
                required
                name='name'
                onInput={(e) => handleInput(e)}
              />
            </div>
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
          
          <button type="submit" className="submit-button">Register</button>
          </form>
        </div>
      )
}

export default Register
