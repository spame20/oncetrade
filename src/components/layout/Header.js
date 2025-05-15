import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css'; // Styles will be adjusted for this simpler header

const Header = () => {
  const { isAuthenticated, logout, currentUser: user } = useAuth();
  // Mobile menu state and toggle might be removed if primary nav moves to Navigation.js
  // For now, let's assume the hamburger will toggle the main Navigation.js links if it's part of the Layout
  // Or, if Navigation.js has its own mobile handling, this can be simplified further.
  // Let's keep a simple hamburger for now, assuming it might control the visibility of the Navigation.js component on mobile.
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(false);

  const toggleMobileNav = () => {
    setIsMobileNavVisible(!isMobileNavVisible);
    // This function might need to communicate with Layout.js or Navigation.js
    // to show/hide the main navigation links on mobile.
    // We will refine this interaction after Navigation.js is updated.
  };

  return (
    <header className="site-header-top">
      <div className="header-content container">
        <div className="logo">
          <Link to="/">ONCEtrade</Link>
        </div>

        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search cards, albums, members..." 
          />
        </div>

        <div className="user-menu">
          {isAuthenticated ? (
            <>
              <span style={{ marginRight: '15px', color: 'var(--color-text-primary)' }}>Hi, {user?.username || 'User'}!</span>
              <button onClick={logout} className="btn btn-secondary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">Login</Link>
              <Link to="/register" className="btn btn-secondary">Register</Link>
            </>
          )}
        </div>

        {/* Hamburger menu - its role will be to toggle the main Navigation.js visibility on mobile */}
        {/* We might need to move this to Layout.js if it controls Navigation.js directly */}
        <div className="hamburger-menu" onClick={toggleMobileNav}>
          &#9776;
        </div>
      </div>
      {/* The mobile dropdown menu that was here will be handled by Navigation.js or Layout.js */}
    </header>
  );
};

export default Header;
