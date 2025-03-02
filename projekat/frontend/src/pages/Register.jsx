import React,{useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Register = () => {

    const [userData, setUserData] = useState({
        name: "",
        email:"",
        password: "",
        date_of_birth: '',
        gender: '',
        work_status: '',
        street: '',
        city: '',
        country: '',
        postal_code: '',
        phone_number: '',
      })  
    
      let navigate = useNavigate();

      function handleInput(e) {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData, 
            [name]: value, 
        }));
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
                placeholder="Enter your name"
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

              <div>
                <label>Date of Birth: </label>
                <input type="date" name="date_of_birth" value={userData.date_of_birth} onChange={handleInput} />
              </div>
              <div>
                <label>Gender: </label>
                <select name="gender" value={userData.gender} onChange={handleInput}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>\
                </select>
              </div>
              <div>
                <label>Work status: </label>
                <select name="work_status" value={userData.work_status} onChange={handleInput}>
                  <option value="">Select Work Status</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="student">Student</option>
                  <option value="employed">Employed</option>
                  <option value="retired">Retired</option>
              </select>
              </div>
            
              <div>
                <label>Address: </label>
                <input type="text" name="street" placeholder="Street" value={userData.street} onChange={handleInput} />
                <input type="text" name="city" placeholder="City" value={userData.city} onChange={handleInput} />
                <input type="text" name="country" placeholder="Country" value={userData.country} onChange={handleInput} />
                <input type="text" name="postal_code" placeholder="Postal Code" value={userData.postal_code} onChange={handleInput} />
              </div>
              <div>
                <label>Phone number: </label>
                <input type="text" name="phone_number" placeholder="Phone Number" value={userData.phone_number} onChange={handleInput} />
              </div>
              
                



          
          <button type="submit" className="submit-button">Register</button>
          </form>
        </div>
      )
}

export default Register
