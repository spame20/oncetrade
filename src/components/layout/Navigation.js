import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  // Check if the current path matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav>
      <div className="container">
        <ul className="nav-links">
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/albums" className={isActive('/albums') ? 'active' : ''}>
              Albums
            </Link>
          </li>
          <li>
            <Link to="/collection" className={isActive('/collection') ? 'active' : ''}>
              Collection
            </Link>
          </li>
          <li>
            <Link to="/wishlist" className={isActive('/wishlist') ? 'active' : ''}>
              Wishlist
            </Link>
          </li>
          <li>
            <Link to="/trades" className={isActive('/trades') ? 'active' : ''}>
              Trades
            </Link>
          </li>
          <li>
            <Link to="/messages" className={isActive('/messages') ? 'active' : ''}>
              Messages
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
