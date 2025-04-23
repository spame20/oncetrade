import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Context Provider
import { AppProvider } from './context/AppContext';

// Layout
import Layout from './components/layout/Layout';

// Pages
import HomePage from './components/pages/HomePage';
import AlbumsListPage from './components/pages/AlbumsListPage';
import AlbumViewPage from './components/pages/AlbumViewPage';
import UserProfilePage from './components/pages/UserProfilePage';
import WishlistPage from './components/pages/WishlistPage';
import TradesListPage from './components/pages/TradesListPage';
import TradeInterfacePage from './components/pages/TradeInterfacePage';
import MessagingInterfacePage from './components/pages/MessagingInterfacePage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/albums" element={<Layout><AlbumsListPage /></Layout>} />
          <Route path="/albums/:albumId" element={<Layout><AlbumViewPage /></Layout>} />
          <Route path="/profile" element={<Layout><UserProfilePage /></Layout>} />
          <Route path="/profile/:userId" element={<Layout><UserProfilePage /></Layout>} />
          <Route path="/wishlist" element={<Layout><WishlistPage /></Layout>} />
          <Route path="/trades" element={<Layout><TradesListPage /></Layout>} />
          <Route path="/trades/:tradeId" element={<Layout><TradeInterfacePage /></Layout>} />
          <Route path="/messages" element={<Layout><MessagingInterfacePage /></Layout>} />
          <Route path="/messages/:userId" element={<Layout><MessagingInterfacePage /></Layout>} />
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
