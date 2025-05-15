import React from 'react';
import { NavLink } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext
import './Navigation.css';

const Navigation = ({ isMobileNavVisible, toggleMobileNav }) => {
  // const { isAuthenticated } = useAuth(); // Temporarily bypassed

  const handleLinkClick = () => {
    if (isMobileNavVisible && typeof toggleMobileNav === 'function') {
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
          <>
            <li>
              {/* MODIFIED LINE: Changed to="/my-collection" to to="/profile" */}
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleLinkClick}>
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
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;

