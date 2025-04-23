import React, { useState } from 'react';

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('collection');
  
  // Mock user data
  const user = {
    username: 'TwiceFan123',
    profilePicture: 'https://via.placeholder.com/200x200',
    totalCards: 45,
    albumsCompleted: 3,
    tradesCompleted: 12,
    rating: 4.8,
    location: 'New York, USA'
  };
  
  // Mock cards data for each tab
  const collectionCards = [
    {
      id: 1,
      member: 'Nayeon',
      album: 'Yes, I Am',
      image: 'https://via.placeholder.com/200x200',
      status: 'owned',
      quantity: 2
    },
    {
      id: 2,
      member: 'Jeongyeon',
      album: 'Formula of Love',
      image: 'https://via.placeholder.com/200x200',
      status: 'owned'
    },
    {
      id: 3,
      member: 'Momo',
      album: 'Between 1&2',
      image: 'https://via.placeholder.com/200x200',
      status: 'owned'
    },
    {
      id: 4,
      member: 'Sana',
      album: 'Dive',
      image: 'https://via.placeholder.com/200x200',
      status: 'owned'
    }
  ];
  
  const wishlistCards = [
    {
      id: 5,
      member: 'Jihyo',
      album: 'Yes, I Am',
      image: 'https://via.placeholder.com/200x200',
      status: 'wanted'
    },
    {
      id: 6,
      member: 'Mina',
      album: 'Formula of Love',
      image: 'https://via.placeholder.com/200x200',
      status: 'wanted'
    }
  ];
  
  const forTradeCards = [
    {
      id: 7,
      member: 'Dahyun',
      album: 'Between 1&2',
      image: 'https://via.placeholder.com/200x200',
      status: 'owned',
      quantity: 3
    }
  ];
  
  const completedTrades = [
    {
      id: 101,
      user1: 'TwiceFan123',
      card1: 'Nayeon (Yes, I Am) ',
      user2: 'User2',
      card2: 'Jihyo (Formula of Love)'
    },
    {
      id: 102,
      user1: 'User3',
      card1: 'Tzuyu (Between 1&2)',
      user2: 'TwiceFan123',
      card2: 'Mina (Dive)'
    }
  ];
  
  // Render cards based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case 'collection':
        return (
          <>
            {collectionCards.length > 0 ? (
              <div className="card-grid">
                {collectionCards.map(card => (
                  <div key={card.id} className={`photocard card-${card.status}`}>
                    <img src={card.image} alt={`${card.member} Card`} className="card-img" />
                    {card.status === 'owned' && (
                      <div className="status-icon owned-icon">✓</div>
                    )}
                    {card.quantity > 1 && (
                      <div className="quantity-badge">x{card.quantity}</div>
                    )}
                    <div className="card-info">
                      <h3 className="card-title">{card.member}</h3>
                      <p className="card-album">{card.album}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-cards-message">
                <p>No cards in collection yet.</p>
              </div>
            )}
          </>
        );
      case 'wishlist':
        return (
          <>
            {wishlistCards.length > 0 ? (
              <div className="card-grid">
                {wishlistCards.map(card => (
                  <div key={card.id} className={`photocard card-${card.status}`}>
                    <img src={card.image} alt={`${card.member} Card`} className="card-img" />
                    {card.status === 'wanted' && (
                      <div className="status-icon wanted-icon">★</div>
                    )}
                    <div className="card-info">
                      <h3 className="card-title">{card.member}</h3>
                      <p className="card-album">{card.album}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-cards-message">
                <p>No cards in wishlist yet.</p>
              </div>
            )}
          </>
        );
      case 'forTrade':
        return (
          <>
            {forTradeCards.length > 0 ? (
              <div className="card-grid">
                {forTradeCards.map(card => (
                  <div key={card.id} className={`photocard card-${card.status}`}>
                    <img src={card.image} alt={`${card.member} Card`} className="card-img" />
                    {card.status === 'owned' && (
                      <div className="status-icon owned-icon">✓</div>
                    )}
                    {card.quantity > 1 && (
                      <div className="quantity-badge">x{card.quantity}</div>
                    )}
                    <div className="card-info">
                      <h3 className="card-title">{card.member}</h3>
                      <p className="card-album">{card.album}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-cards-message">
                <p>No cards for trade yet.</p>
              </div>
            )}
          </>
        );
      case 'completedTrades':
        return (
          <>
            {completedTrades.length > 0 ? (
              <div className="trades-list">
                {completedTrades.map(trade => (
                  <div key={trade.id} className="trade-item">
                    <p>{trade.user1} traded {trade.card1} with {trade.user2} for {trade.card2}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-cards-message">
                <p>No completed trades yet.</p>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };
  
  return (
    <main className="container">
      <div className="profile-header">
        <h2 className="profile-title">{user.username}'s Profile</h2>
        <button className="btn btn-secondary">Edit Profile</button>
      </div>
      
      <div className="profile-info">
        <img 
          src={user.profilePicture} 
          alt={`${user.username}'s profile`} 
          className="profile-picture" 
        />
        
        <div className="profile-details">
          <div className="profile-stats">
            <div className="stat-box">
              <p className="stat-title">Total Cards</p>
              <p className="stat-value">{user.totalCards}</p>
            </div>
            <div className="stat-box">
              <p className="stat-title">Albums Completed</p>
              <p className="stat-value">{user.albumsCompleted}</p>
            </div>
            <div className="stat-box">
              <p className="stat-title">Trades Completed</p>
              <p className="stat-value">{user.tradesCompleted}</p>
            </div>
          </div>
          
          <div className="profile-meta">
            <p>
              <span className="rating">★ {user.rating}</span>
              <span className="location">{user.location}</span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="profile-tabs">
        <div className="tab-buttons">
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
            className={`tab-btn ${activeTab === 'forTrade' ? 'active' : ''}`}
            onClick={() => setActiveTab('forTrade')}
          >
            For Trade
          </button>
          <button 
            className={`tab-btn ${activeTab === 'completedTrades' ? 'active' : ''}`}
            onClick={() => setActiveTab('completedTrades')}
          >
            Completed Trades
          </button>
        </div>
        
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
      
      {(activeTab === 'collection' || activeTab === 'wishlist' || activeTab === 'forTrade') && (
        <button className="load-more">Load More</button>
      )}
    </main>
  );
};

export default UserProfilePage;
