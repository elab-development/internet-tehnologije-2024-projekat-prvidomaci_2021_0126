import React,{useState} from 'react'
import axios from "axios";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function ForgottenPassword({}) {

  const [userData, setUserData] = useState({
    name:"",
    email:"",
    password: "",
  })  

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  let navigate = useNavigate();
  
  function handleInput(e){
      let newUserData = userData;
      newUserData[e.target.name] = e.target.value;
    //   console.log(e)
      setUserData(newUserData); 
  }

  function handleSubmit(e){
    e.preventDefault(); setError(''); setSuccess('');

    axios.post("api/auth/forgot-password",userData).then(res =>{
        console.log(res.data)
        if(res.data.success === true){
            setSuccess('Password updated successfully!');
            setTimeout(() => {navigate('/login')}, 1500);
        } else {
            setError(res.data.message || 'An error occurred.');
        }
    }).catch(error => {
        console.error(error);
        setError(error.response?.data?.message || 'An error occurred. Please try again.');
    })

    }

  return (
    <div>

    <h2>Fill in your credentials</h2>
    <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
    <div style={{ color: 'green', marginBottom: '10px' }}>{success}</div>
      <form onSubmit={handleSubmit}>


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
          <h4>Choose your new password:</h4>  
          <label>New Password: </label>
          <input
            type="password"
            placeholder="Enter password"
            required
            name='password'
            onInput={(e) => handleInput(e)}
          />
          </div>
      
      <button type="submit" className="submit-button">Change password</button>
      </form>

    </div>
  )
}

export default ForgottenPassword
