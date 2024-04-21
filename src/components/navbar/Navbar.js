import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './../../css/Navbar.css';

const Navbar = ( ) => {
  const location = useLocation();
  const [isAuthenticated, setAuthenticated] = useState(() => sessionStorage.getItem("token") !== null);
  const [userType, setUserType] = useState(null); // State to store the user type

  // Fetch user type from the database when the component mounts
  useEffect(() => {
    setAuthenticated(sessionStorage.getItem("token") !== null);

    const fetchUserType = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found in session storage");
        }
        const response = await fetch("http://localhost:80/userType", {
          method: "GET",
          headers: {
            "Authorization": token
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserType(data.userType);
        } else {
          throw new Error("Failed to fetch user type");
        }
      } catch (error) {
        console.error("Error fetching user type:", error);
      }
    };

    fetchUserType();
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <Link className="logo" to="/">
        Movie Mates
      </Link>
      <div className="section">
        {/* Conditionally render login or logout link based on authentication status */}
        {isAuthenticated ? (
          <Link className="nav-links" to="/logout">
            Logout
          </Link>
        ) : (
          <Link className="nav-links" to="/login">
            Login
          </Link>
        )}
        
        <ul className="ul-nav">
          <li className="dropdown">
            {/* Conditionally render "Admin" or "Profile" based on userType */}
            {userType === 1 ? (
              <Link className="nav-links" to="/admin">
                Admin
              </Link>
            ) : (
              <Link className="nav-links" to="/me">
                Profile
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
