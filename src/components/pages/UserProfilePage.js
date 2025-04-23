import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PhotoCard from '../common/PhotoCard';

const UserProfilePage = () => {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState('collection');
  
  // Mock user data
  const user = {
    _id: userId || 'current-user',
    username: 'ONCE_Collector',
    avatar: 'https://via.placeholder.com/150',
    joined_date: '2023-01-15',
    location: 'Seoul, South Korea',
    rating: 4.8,
    total_trades: 24,
    collection_count: 78,
    wishlist_count: 32
  };
  
  // Mock collection data
  const [collection, setCollection] = useState([
    {
      _id: '1',
      member: 'Nayeon',
      album: 'Formula of Love',
      image: 'https://via.placeholder.com/200x200',
      quantity: 2,
      for_trade: true
    },
    {
      _id: '2',
      member: 'Jeongyeon',
      album: 'Between 1&2',
      image: 'https://via.placeholder.com/200x200',
      quantity: 1,
      for_trade: false
    },
    {
      _id: '3',
      member: 'Momo',
      album: 'Yes, I Am',
      image: 'https://via.placeholder.com/200x200',
      quantity: 1,
      for_trade: true
    },
    {
      _id: '4',
      member: 'Sana',
      album: 'Formula of Love',
      image: 'https://via.placeholder.com/200x200',
      quantity: 1,
      for_trade: true
    },
    {
      _id: '5',
      member: 'Jihyo',
      album: 'Between 1&2',
      image: 'https://via.placeholder.com/200x200',
      quantity: 1,
      for_trade: false
    },
    {
      _id: '6',
      member: 'Mina',
      album: 'Dive',
      image: 'https://via.placeholder.com/200x200',
      quantity: 1,
      for_trade: false
    }
  ]) ;
  
  // Mock wishlist data
  const [wishlist, setWishlist] = useState([
    {
      _id: '7',
      member: 'Dahyun',
      album: 'Formula of Love',
      image: 'https://via.placeholder.com/200x200'
    },
    {
      _id: '8',
      member: 'Chaeyoung',
      album: 'Yes, I Am',
      image: 'https://via.placeholder.com/200x200'
    },
    {
      _id: '9',
      member: 'Tzuyu',
      album: 'Dive',
      image: 'https://via.placeholder.com/200x200'
    }
  ]) ;
  
  // Mock trades data
  const [trades, setTrades] = useState([
    {
      _id: 't1',
      partner: {
        username: 'TWICE_Fan99',
        avatar: 'https://via.placeholder.com/40'
      },
      status: 'completed',
      date: '2025-03-15',
      offered_cards: [
        {
          member: 'Nayeon',
          album: 'Formula of Love'
        }
      ],
      received_cards: [
        {
          member: 'Jihyo',
          album: 'Formula of Love'
        }
      ]
    },
    {
      _id: 't2',
      partner: {
        username: 'MomoLover',
        avatar: 'https://via.placeholder.com/40'
      },
      status: 'in-progress',
      date: '2025-04-10',
      offered_cards: [
        {
          member: 'Sana',
          album: 'Between 1&2'
        }
      ],
      received_cards: [
        {
          member: 'Momo',
          album: 'Between 1&2'
        }
      ]
    }
  ]) ;
  
  // Function to toggle if a card is for trade
  const toggleForTrade = (cardId) => {
    setCollection(collection.map(card => 
      card._id === cardId ? { ...card, for_trade: !card.for_trade } : card
    ));
  };
  
  // Function to add card to wishlist
  const addToWishlist = (card) => {
    if (!wishlist.some(item => item._id === card._id)) {
      setWishlist([...wishlist, card]);
    }
  };
  
  // Function to remove card from wishlist
  const removeFromWishlist = (cardId) => {
    setWishlist(wishlist.filter(card => card._id !== cardId));
  };

  return (
    <main className="container">
      <div className="profile-header">
        <h2 className="profile-title">My Profile</h2>
        <div className="profile-actions">
          <button className="btn btn-secondary">Edit Profile</button>
        </div>
      </div>
      
      <div className="profile-info">
        <img src={user.avatar} alt={user.username} className="profile-picture" />
        <div className="profile-details">
          <h3 className="username">{user.username}</h3>
          <p className="joined-date">Member since {new Date(user.joined_date).toLocaleDateString()}</p>
          
          <div className="profile-stats">
            <div className="stat-box">
              <p className="stat-title">Collection</p>
              <p className="stat-value">{user.collection_count}</p>
            </div>
            <div className="stat-box">
              <p className="stat-title">Wishlist</p>
              <p className="stat-value">{user.wishlist_count}</p>
            </div>
            <div className="stat-box">
              <p className="stat-title">Trades</p>
              <p className="stat-value">{user.total_trades}</p>
            </div>
          </div>
          
          <div className="profile-meta">
            <p className="rating">★ {user.rating}</p>
            <p className="location">{user.location}</p>
          </div>
        </div>
      </div>
      
      <div className="profile-tabs">
        <div className="tab-buttons">
          <button 
            className={`tab-btn ${activeTab === 'collection' ? 'active' : ''}`}
            onClick={() => setActiveTab('collection')}
          >
            My Collection
          </button>
          <button 
            className={`tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            My Wishlist
          </button>
          <button 
            className={`tab-btn ${activeTab === 'trades' ? 'active' : ''}`}
            onClick={() => setActiveTab('trades')}
          >
            My Trades
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'collection' && (
            <>
              {collection.length > 0 ? (
                <div className="card-grid">
                  {collection.map(card => (
                    <div key={card._id} className={`photocard ${card.for_trade ? 'card-for-trade' : ''}`}>
                      {card.quantity > 1 && (
                        <span className="quantity-badge">x{card.quantity}</span>
                      )}
                      <img src={card.image} alt={`${card.member} from ${card.album}`} className="card-img" />
                      <div className="card-info">
                        <h3 className="card-title">{card.member}</h3>
                        <p className="card-album">{card.album}</p>
                      </div>
                      <div className="card-actions">
                        <button 
                          className={`trade-toggle ${card.for_trade ? 'active' : ''}`}
                          onClick={() => toggleForTrade(card._id)}
                        >
                          {card.for_trade ? 'For Trade' : 'Not For Trade'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-cards-message">
                  <p>You don't have any photocards in your collection yet.</p>
                  <Link to="/albums" className="btn btn-primary">Browse Albums</Link>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'wishlist' && (
            <>
              {wishlist.length > 0 ? (
                <div className="card-grid">
                  {wishlist.map(card => (
                    <div key={card._id} className="photocard card-wanted">
                      <img src={card.image} alt={`${card.member} from ${card.album}`} className="card-img" />
                      <div className="card-info">
                        <h3 className="card-title">{card.member}</h3>
                        <p className="card-album">{card.album}</p>
                      </div>
                      <div className="card-actions">
                        <button 
                          className="remove-btn"
                          onClick={() => removeFromWishlist(card._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-cards-message">
                  <p>You don't have any photocards in your wishlist yet.</p>
                  <Link to="/albums" className="btn btn-primary">Browse Albums</Link>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'trades' && (
            <>
              {trades.length > 0 ? (
                <div className="trades-list">
                  {trades.map(trade => (
                    <div key={trade._id} className="trade-item">
                      <div className="trade-header">
                        <div className="trade-users">
                          <div className="trade-user">
                            <span className="username">You</span>
                          </div>
                          <span className="trade-direction">↔</span>
                          <div className="trade-user">
                            <img src={trade.partner.avatar} alt={trade.partner.username} className="user-avatar" />
                            <span className="username">{trade.partner.username}</span>
                          </div>
                        </div>
                        <span className={`status-badge status-${trade.status}`}>
                          {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="trade-content">
                        <div className="trade-cards">
                          <h4>You Offered:</h4>
                          {trade.offered_cards.map((card, index) => (
                            <div key={index} className="trade-card">
                              <div className="card-info">
                                <p className="card-member">{card.member}</p>
                                <p className="card-album">{card.album}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="trade-cards">
                          <h4>You Received:</h4>
                          {trade.received_cards.map((card, index) => (
                            <div key={index} className="trade-card">
                              <div className="card-info">
                                <p className="card-member">{card.member}</p>
                                <p className="card-album">{card.album}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="trade-footer">
                        <span className="trade-date">
                          {new Date(trade.date).toLocaleDateString()}
                        </span>
                        <Link to={`/trades/${trade._id}`} className="view-trade-btn">
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-trades-message">
                  <p>You don't have any trades yet.</p>
                  <Link to="/trades/new" className="btn btn-primary">Start a Trade</Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default UserProfilePage;
