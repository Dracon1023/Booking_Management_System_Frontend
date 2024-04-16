import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'
function HomePage() {
  const navigate = useNavigate();
  const [isAuthenticated, setAuthenticated] = useState(() => {
    const token = sessionStorage.getItem("token");
    return token !== null;
  });

  const handleButtonClick = () => {
    // Add your navigation logic here
    navigate('/movielist');
  };

  useEffect(() => {
    // Add the background image and the CSS for the flashing button
    document.body.style.backgroundImage = "url('https://wallpaperaccess.com/full/4839516.jpg')";
    document.body.style.backgroundSize = "cover";
    require('./HomePage.css'); // Assuming the CSS is in HomePage.css in the same directory

    // Cleanup function to remove the CSS when the component unmounts
    return () => {
      document.body.style.backgroundImage = null;
      document.body.style.backgroundSize = null;
    };
  }, []);

  if (isAuthenticated) {
    const user = sessionStorage.getItem("user");
    let user_name = user.split("@")[0];
    return (
      <div>
        <h1>Welcome {user_name}</h1>
      </div>
    );
  } else {
    return (
      <div className="centered">
        <h1>Home Page</h1>
        <button className="button" onClick={handleButtonClick}>Book My Show</button>
      </div>
    );
  }
}


export default HomePage;
