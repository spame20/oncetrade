import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useTrades } from '../../context/TradeContext';

const UserProfilePage = () => {
  // Get user data and functions from context
  const { user, toggleForTrade } = useUser();
  const { trades } = useTrades();
  
  // Tab state
  const [activeTab, setActiveTab] = useState('collection');
  
  // Filter state for collection
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAlbum, setFilterAlbum] = useState('');
  const [filterMember, setFilterMember] = useState('');
  
  // Get unique albums and members for filters
  const albums = [...new Set(user.collection.map(card => card.album))];
  const members = [...new Set(user.collection.map(card => card.member))];
  
  // Filter collection
  const filteredCollection = user.collection
    .filter(card => {
      const matchesSearch = card.member.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           card.album.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAlbum = filterAlbum ? card.album === filterAlbum : true;
      const matchesMember = filterMember ? card.member === filterMember : true;
      return matchesSearch && matchesAlbum && matchesMember;
    });
  
  // Get user's completed trades
  const userTrades = trades.filter(trade => trade.status === 'completed');

  return (
    <main className="container">
      <div className="profile-header">
        <div className="profile-info">
          <h2 className="username">{user.username}</h2>
          <p className="joined-date">Joined: {new Date(user.join_date).toLocaleDateString()}</p>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{user.collection.length}</span>
              <span className="stat-label">Cards</span>
            </div>
            <div className="stat">
              <span className="stat-value">{user.wishlist.length}</span>
              <span className="stat-label">Wishlist</span>
            </div>
            <div className="stat">
              <span className="stat-value">{userTrades.length}</span>
              <span className="stat-label">Trades</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'collection' ? 'active' : ''}`}
          onClick={() => setActiveTab('collection')}
        >
          Collection
        </button>
        <button 
          className={`tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          Wishlist
        </button>
        <button 
          className={`tab-btn ${activeTab === 'trades' ? 'active' : ''}`}
          onClick={() => setActiveTab('trades')}
        >
          Trades
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'collection' && (
          <>
            <div className="collection-controls">
              <div className="search-filter-container">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search cards..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="collection-search"
                  />
                </div>
                
                <div className="filter-box">
                  <select 
                    value={filterAlbum} 
                    onChange={(e) => setFilterAlbum(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All Albums</option>
                    {albums.map(album => (
                      <option key={album} value={album}>{album}</option>
                    ))}
                  </select>
                  
                  <select 
                    value={filterMember} 
                    onChange={(e) => setFilterMember(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All Members</option>
                    {members.map(member => (
                      <option key={member} value={member}>{member}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {filteredCollection.length > 0 ? (
              <div className="card-grid">
                {filteredCollection.map(card => (
                  <div key={card._id} className={`photocard ${card.for_trade ? 'card-for-trade' : ''}`}>
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
                <p>No cards found in your collection matching your filters.</p>
                {user.collection.length > 0 ? (
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterAlbum('');
                      setFilterMember('');
                    }}
                  >
                    Clear Filters
                  </button>
                ) : (
                  <Link to="/albums" className="btn btn-primary">Browse Albums</Link>
                )}
              </div>
            )}
          </>
        )}
        
        {activeTab === 'wishlist' && (
          <>
            {user.wishlist.length > 0 ? (
              <div className="card-grid">
                {user.wishlist.map(card => (
                  <div key={card._id} className="photocard card-wanted">
                    <img src={card.image} alt={`${card.member} from ${card.album}`} className="card-img" />
                    <div className="card-info">
                      <h3 className="card-title">{card.member}</h3>
                      <p className="card-album">{card.album}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-cards-message">
                <p>You don't have any cards in your wishlist yet.</p>
                <Link to="/albums" className="btn btn-primary">Browse Albums</Link>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'trades' && (
          <>
            {userTrades.length > 0 ? (
              <div className="trades-list">
                {userTrades.map(trade => (
                  <div key={trade._id} className={`trade-item status-${trade.status}`}>
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
    </main>
  );
};

export default UserProfilePage;
