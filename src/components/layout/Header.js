import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">TWICE PHOTOCARD EXCHANGE</Link>
          </div>
          
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search for photo cards..." 
            />
          </div>
          
          <div className="user-menu">
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/register" className="btn btn-secondary">Register</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
