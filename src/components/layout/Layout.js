import React, { useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(false);

  const toggleMobileNav = () => {
    console.log('Layout.js: toggleMobileNav function CALLED. Current isMobileNavVisible state BEFORE change:', isMobileNavVisible);
    setIsMobileNavVisible(prevState => {
      const newState = !prevState;
      console.log('Layout.js: isMobileNavVisible state changing FROM:', prevState, 'TO:', newState);
      return newState;
    });
  };

  return (
    <>
      <Header toggleMobileNav={toggleMobileNav} />
      <Navigation isMobileNavVisible={isMobileNavVisible} toggleMobileNav={toggleMobileNav} />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
