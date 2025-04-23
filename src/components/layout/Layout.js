import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <Navigation />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
