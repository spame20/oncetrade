import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Make sure this path is correct
import './Navigation.css';

const Navigation = ({ isMobileNavVisible, toggleMobileNav }) => {
  const { isAuthenticated } = useAuth();

  // Log the received prop to see if it changes
  console.log('Navigation.js: Received isMobileNavVisible prop with value:', isMobileNavVisible);

  const handleLinkClick = () => {
    if (isMobileNavVisible && typeof toggleMobileNav === 'function') {
      console.log('Navigation.js: Link clicked, calling toggleMobileNav to close menu.');
      toggleMobileNav();
    }
  };

  return (
    <nav className={`main-navigation ${isMobileNavVisible ? 'mobile-nav-active' : ''}`}>
      <div className="container">
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleLinkClick} end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/albums" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleLinkClick}>
              Albums
            </NavLink>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <NavLink to="/my-collection" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleLinkClick}>
                  My Collection
                </NavLink>
              </li>
              <li>
                <NavLink to="/wishlist" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleLinkClick}>
                  Wishlist
                </NavLink>
              </li>
              <li>
                <NavLink to="/trades" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleLinkClick}>
                  Trades
                </NavLink>
              </li>
              <li>
                <NavLink to="/messages" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleLinkClick}>
                  Messages
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
