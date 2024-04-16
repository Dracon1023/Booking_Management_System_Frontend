import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/PasswordResetPage.css";
import Alert from '@mui/material/Alert';

function PasswordResetPage() {
  let host = "http://localhost:80";
  const navigate = useNavigate();
  const [showErrorAlert, setErrorAlert] = useState(false);
  const [showInputAlert, setInputAlert] = useState(false);
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  const handleNewPassword = (event) => {
    setNewPassword(event.target.value);
  };
  const handleConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
  };
  const handleSubmit = (event) => {
    if (!username || !newPassword || !confirmPassword) {
      setInputAlert(true);
      setErrorAlert(false);
    }
    else if (newPassword !== confirmPassword) {
      setInputAlert(false);
      setErrorAlert(true);
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setErrorAlert(false);
      var credentials = JSON.stringify({
        "username": username,
        "password": newPassword
      })
      fetch(host+"/users/reset", 
      {
        method: 'PUT', 
        mode: 'cors', 
        headers: { 'Content-Type': 'application/json' },
        body: credentials 
      })
      .then(async response => {
        if(response.status==200) {
            navigate('/login')
        } else {
            //notify user of failed reset attempt
        }
      })
      .catch(error => {
          console.log(error)
      })
    }
  };
  return (
    <div className="center">
      <div className="container">
      {showInputAlert && <Alert severity="error">Please fill all fields.</Alert>}
      {showErrorAlert && <Alert severity="error">Passwords do not match. Please try again.</Alert>}
        <h2>Reset Password</h2>
        <label>Email/Mobile:</label>
        <input type="text" value={username} onChange={handleUsernameChange} />
        <br />
        <label>New Password:</label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={handleNewPassword}
        />
        <br />
        <label>Confirm Password:</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPassword}
        />
        <br />
        <button onClick={handleSubmit}>
          Reset
        </button>
      </div>
      </div>
  );
}

export default PasswordResetPage;
