import React, { useState } from "react";
import  { useNavigate } from 'react-router-dom'
const Login = () => {
    const [credentials,setcredentials ]= useState({email:"",password:""})
    let navigate = useNavigate(); 
    const handleSubmit = async (e) => {
        e.preventDefault();  
      
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              },
              body: JSON.stringify({email:credentials.email,password:credentials.password})
          });
          const json = await response.json()
          console.log(json)
          if (json.success) {
            localStorage.setItem('token', json.authtoken); // Check if json.authtoken is defined
            console.log("Token set in localStorage:", json.authtoken); // Log the token to see if it’s correct
            navigate("/"); // Use navigate directly, not navigate.push
        
        // Use navigate directly, not navigate.push
          
          }else{

          }
    }
    const onChange = (e) => {
        setcredentials({ ...credentials, [e.target.name]: e.target.value });
      }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={credentials.email}
            onChange={onChange}
            name="email"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            value={credentials.password}
            onChange={onChange}
            className="form-control"
            name="password"
            id="password"
          />
        </div>
      
        <button type="submit" className="btn btn-primary" >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
