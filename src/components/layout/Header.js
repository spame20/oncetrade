import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css'; // Uses your original Header.css

// The toggleMobileNav prop is passed down from Layout.js
const Header = ({ toggleMobileNav }) => {
  const { isAuthenticated, logout, currentUser: user } = useAuth();

  return (
    <header> {/* Ensure your top-level element matches your Header.css, e.g., <header className="site-header-top"> if needed */}
      <div className="header-content container"> {/* Ensure class names match your Header.css */} 
        <div className="logo">
          <Link to="/">ONCEtrade</Link>
        </div>

        <div className="search-bar"> {/* Ensure class name matches your Header.css */} 
          <input 
            type="text" 
            placeholder="Search cards, albums, members..." 
          />
        </div>

        {/* Hamburger Menu Icon - onClick calls toggleMobileNav from Layout */} 
        <div className="hamburger-menu" onClick={toggleMobileNav}>
          &#9776; {/* Standard hamburger icon */}
        </div>

        <div className="user-menu"> {/* This is for desktop, ensure it's styled to be hidden on mobile by Header.css */} 
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

        {/* If your original Header.css handled a mobile dropdown directly via a class like .mobile-nav-menu, */}
        {/* that part of the CSS might now be redundant or need adjustment, as Navigation.js will handle the dropdown content. */}
        {/* The hamburger icon in this component now solely controls the visibility of the Navigation.js component on mobile. */}
      </div>
    </header>
  );
};

export default Header;
