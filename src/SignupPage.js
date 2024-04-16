import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "./components/GoogleLoginButton";
import "./css/SignupPage.css";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleMobileChange = (event) => {
    setMobile(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:80/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          mobile,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful
        navigate("/homepage");
      } else {
        // Registration failed
        console.log("Signup failed:", data.error);
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };
  return (
    <div className="center">
      <div className="container">
        <h2>Sign Up</h2>
        <label>Email:</label>
        <input type="text" value={username} onChange={handleUsernameChange} />
        <br />
        <label>Mobile:</label>
        <input type="tel" value={mobile} onChange={handleMobileChange} />
        <br />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <br />
        <button id="submitBtn" onClick={handleSubmit}>
          Create Account
        </button>
        <hr></hr>
        <GoogleLoginButton />
      </div>
      <div className="linkContainer">
        <span>Already have an account? </span>
        <span>
          <u onClick={goToLogin}>Log In</u>
        </span>
      </div>
    </div>
  );
}
export default SignupPage;
