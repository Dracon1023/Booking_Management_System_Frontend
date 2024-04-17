import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/LoginPage.css";
import GoogleLoginButton from "./components/GoogleLoginButton";
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";

const backendURL = "https://booking-services-aldoub.onrender.com"

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Perform login logic here
    var credentials = JSON.stringify({
        "username": username,
        "password": password
    })

  fetch(`${backendURL}/users/login`, {  

      method: 'POST', 
      mode: 'cors', 
      headers: { 'Content-Type': 'application/json' },
      body: credentials 
    })
    .then(async response => {
        if(response.status==200) {
          // set token in session storage
          let res_data = await response.json();
          sessionStorage.setItem("token", res_data.accessToken);
          sessionStorage.setItem("user", res_data.username);
          //navigate to home page
          navigate("/");
        } else {
            //TODO: display error popup
            console.log("Invalid credentials")
        }
    })
    .catch(error => {
        console.log(error)
    })

  };

  const goToSignup = () => {
    navigate("/signup");
  };

  const goToPasswordReset = () => {
    navigate("/resetpassword");

  };

  const appId = "385141384216301";
  const success = (response) => {
    console.log("success");
    console.log(response);
  };
  const failure = (response) => {
    console.log("failure");
    console.log(response);
  };
  return (
    <div className="center">
      <div className="container">
        <h2>Login</h2>
        <label>Email/Mobile:</label>
        <input
          className="loginInputs"
          type="text"
          value={username}
          onChange={handleUsernameChange}
        />
        <br />
        <label>Password:</label>
        <input
          className="loginInputs"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <span>
          <u onClick={goToPasswordReset}>Forgot your password?</u>
        </span>
        <br />
        <button id="loginBtn" onClick={handleSubmit}>
          Login
        </button>
        <hr></hr>
        <GoogleLoginButton setUsername={setUsername} />
        <br />
        <LoginSocialFacebook
          appId={appId}
          onResolve={success}
          onReject={failure}
        >
          <FacebookLoginButton />
        </LoginSocialFacebook>
      </div>
      <div className="linkContainer">
        <span>Don't have an account? </span>
        <span>
          <u onClick={goToSignup}>Sign Up</u>
        </span>
      </div>
    </div>
  );
}

export default LoginPage;
