import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PhotocardService from '../../services/photocard.service';
import UserCardService from '../../services/usercard.service';

const CardDetailPage = () => {
  const { cardId } = useParams();
  const { currentUser, isAuthenticated } = useAuth();
  const [card, setCard] = useState(null);
  const [userCard, setUserCard] = useState(null);
  const [tradingUsers, setTradingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        setLoading(true);
        
        // Fetch photocard details
        const cardResponse = await PhotocardService.getPhotocardById(cardId);
        setCard(cardResponse.data);
        
        if (isAuthenticated) {
          // Fetch user's card status if authenticated
          try {
            const userCardResponse = await UserCardService.getUserCardStatus(cardId);
            setUserCard(userCardResponse.data);
          } catch (err) {
            // User doesn't have this card yet, which is fine
            console.log('User does not have this card yet');
          }
        }
        
        // Fetch users trading this card
        const tradingResponse = await UserCardService.getUsersTradingCard(cardId);
        setTradingUsers(tradingResponse.data);
        
      } catch (err) {
        console.error('Error fetching card data:', err);
        setError('Failed to load card details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (cardId) {
      fetchCardData();
    }
  }, [cardId, isAuthenticated]);

  const updateCardStatus = async (status) => {
    if (!isAuthenticated) return;
    
    try {
      setStatusUpdating(true);
      
      const data = {
        photocard_id: cardId,
        status: status,
        quantity: 1,
        condition: 'mint'
      };
      
      if (userCard) {
        // Update existing user card
        await UserCardService.updateUserCard(userCard._id, data);
      } else {
        // Create new user card
        await UserCardService.createUserCard(data);
      }
      
      // Refresh user card data
      const userCardResponse = await UserCardService.getUserCardStatus(cardId);
      setUserCard(userCardResponse.data);
      
    } catch (err) {
      console.error('Error updating card status:', err);
      setError('Failed to update card status. Please try again.');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!card) {
    return <div className="error-message">Card not found</div>;
  }

  return (
    <div className="card-detail-page">
      <div className="container">
        <div className="card-detail-content">
          <div className="card-image-container">
            <img 
              src={card.image_url} 
              alt={`${card.member_name} from ${card.album_title}`} 
              className="card-image"
            />
          </div>
          
          <div className="card-info-container">
            <div className="card-header">
              <h1>{card.member_name}</h1>
              <div className="card-subtitle">
                <Link to={`/albums/${card.album_id}`}>{card.album_title}</Link>
                <span className="card-type">{card.card_type}</span>
              </div>
            </div>
            
            <div className="card-details">
              <div className="detail-item">
                <span className="detail-label">Release Date:</span>
                <span className="detail-value">
                  {new Date(card.release_date).toLocaleDateString()}
                </span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Rarity:</span>
                <span className="detail-value">{card.rarity || 'Regular'}</span>
              </div>
              
              {card.description && (
                <div className="card-description">
                  <h3>Description</h3>
                  <p>{card.description}</p>
                </div>
              )}
            </div>
            
            {isAuthenticated && (
              <div className="card-actions">
                <h3>Update Your Collection</h3>
                <div className="status-buttons">
                  <button 
                    className={`status-btn ${userCard?.status === 'owned' ? 'active' : ''}`}
                    onClick={() => updateCardStatus('owned')}
                    disabled={statusUpdating}
                  >
                    Mark as Owned
                  </button>
                  <button 
                    className={`status-btn ${userCard?.status === 'wanted' ? 'active' : ''}`}
                    onClick={() => updateCardStatus('wanted')}
                    disabled={statusUpdating}
                  >
                    Add to Wishlist
                  </button>
                  <button 
                    className={`status-btn ${userCard?.status === 'not_interested' ? 'active' : ''}`}
                    onClick={() => updateCardStatus('not_interested')}
                    disabled={statusUpdating}
                  >
                    Not Interested
                  </button>
                </div>
                
                {userCard?.status === 'owned' && (
                  <div className="trade-toggle">
                    <label>
                      <input 
                        type="checkbox" 
                        checked={userCard.for_trade}
                        onChange={async () => {
                          try {
                            await UserCardService.updateUserCard(userCard._id, {
                              for_trade: !userCard.for_trade
                            });
                            setUserCard({
                              ...userCard,
                              for_trade: !userCard.for_trade
                            });
                          } catch (err) {
                            console.error('Error updating trade status:', err);
                          }
                        }}
                      />
                      Mark for Trade
                    </label>
                  </div>
                )}
              </div>
            )}
            
            <div className="trading-users">
              <h3>Users Trading This Card</h3>
              {tradingUsers.length > 0 ? (
                <ul className="users-list">
                  {tradingUsers.map(user => (
                    <li key={user._id} className="user-item">
                      <Link to={`/users/${user._id}`} className="user-link">
                        <img 
                          src={user.profile_picture || '/default-avatar.png'} 
                          alt={user.username} 
                          className="user-avatar"
                        />
                        <span className="username">{user.username}</span>
                      </Link>
                      <Link to={`/trades/${user._id}`} className="trade-button">
                        Propose Trade
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-users">No users are currently trading this card</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailPage;
