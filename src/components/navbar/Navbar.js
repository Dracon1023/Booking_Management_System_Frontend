import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './../../css/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [isAuthenticated, setAuthenticated] = useState(() => sessionStorage.getItem("token") !== null);

  // Update the isAuthenticated state when the sessionStorage changes
  useEffect(() => {
    setAuthenticated(sessionStorage.getItem("token") !== null);
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
            <Link className="nav-links" to="/me">
              Profile
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
