import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Layout
import Layout from './components/layout/Layout';

// Pages
import HomePage from './components/pages/HomePage';
import AlbumViewPage from './components/pages/AlbumViewPage';
import CardDetailPage from './components/pages/CardDetailPage';
import UserProfilePage from './components/pages/UserProfilePage';
import TradeInterfacePage from './components/pages/TradeInterfacePage';
import MessagingInterfacePage from './components/pages/MessagingInterfacePage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/albums/:albumId" element={<Layout><AlbumViewPage /></Layout>} />
        <Route path="/photocards/:cardId" element={<Layout><CardDetailPage /></Layout>} />
        <Route path="/profile/:userId" element={<Layout><UserProfilePage /></Layout>} />
        <Route path="/profile" element={<Layout><UserProfilePage /></Layout>} />
        <Route path="/trades/:userId" element={<Layout><TradeInterfacePage /></Layout>} />
        <Route path="/messages/:userId" element={<Layout><MessagingInterfacePage /></Layout>} />
        <Route path="/messages" element={<Layout><MessagingInterfacePage /></Layout>} />
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
