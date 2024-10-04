import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
  const [errorMessage, setErrorMessage] = useState(""); // For displaying error messages
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, cpassword } = credentials;

    // Check if passwords match
    if (password !== cpassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const json = await response.json();
      console.log(json);

      if (json.success) {
        // On successful signup, store token and navigate to homepage
        localStorage.setItem("token", json.authtoken);
        navigate("/");
        props.showAlert("Account Created Successfully","success")
      } else {
       props.showAlert("Invalid Credentials","danger")
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={credentials.name}
            onChange={onChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={credentials.email}
            onChange={onChange}
            required
          />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={credentials.password}
            onChange={onChange}
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            name="cpassword"
            value={credentials.cpassword}
            onChange={onChange}
            minLength={5}
            required
          />
        </div>

        {/* Error Message */}
        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default Signup;
