import React from 'react';
import './Footer.css'; // We will create this CSS file next

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <p>&copy; {currentYear} ONCEtrade. All rights reserved (Fan Project).</p>
        <p>
          <a href="/privacy-policy">Privacy Policy</a> | <a href="/terms-of-service">Terms of Service</a>
          {/* Add other footer links as needed */}
        </p>
        {/* You can add social media icons or other elements here later */}
      </div>
    </footer>
  );
};

export default Footer;

