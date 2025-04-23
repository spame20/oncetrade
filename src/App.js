import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Layout
import Layout from './components/layout/Layout';

// Pages
import HomePage from './components/pages/HomePage';
import UserProfilePage from './components/pages/UserProfilePage';
import TradeInterfacePage from './components/pages/TradeInterfacePage';
import MessagingInterfacePage from './components/pages/MessagingInterfacePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/profile" element={<Layout><UserProfilePage /></Layout>} />
        <Route path="/profile/:userId" element={<Layout><UserProfilePage /></Layout>} />
        <Route path="/trades/:tradeId" element={<Layout><TradeInterfacePage /></Layout>} />
        <Route path="/messages" element={<Layout><MessagingInterfacePage /></Layout>} />
        <Route path="/messages/:userId" element={<Layout><MessagingInterfacePage /></Layout>} />
        
        {/* Placeholder routes - these will redirect to home for now */}
        <Route path="/albums" element={<Layout><HomePage /></Layout>} />
        <Route path="/wishlist" element={<Layout><HomePage /></Layout>} />
        <Route path="/trades" element={<Layout><HomePage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
