import React, { useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer'; // Assuming you have a Footer component
// import './Layout.css'; // Optional: if you have specific layout styles - Commented out to fix error

const Layout = ({ children }) => {
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(false);

  const toggleMobileNav = () => {
    setIsMobileNavVisible(!isMobileNavVisible);
  };

  return (
    <div className="site-layout">
      <Header toggleMobileNav={toggleMobileNav} />
      <Navigation isMobileNavVisible={isMobileNavVisible} toggleMobileNav={toggleMobileNav} />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
