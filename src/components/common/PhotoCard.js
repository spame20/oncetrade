import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './PhotoCard.css';

const PhotoCard = ({ card, userStatus, onStatusChange }) => {
  const { isAuthenticated } = useAuth();
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [tempQuantity, setTempQuantity] = useState(userStatus?.quantity || 1);
  
  const getCardClassName = () => {
    let baseClass = 'photocard';
    if (!isAuthenticated || !userStatus) return baseClass;
    
    if (userStatus.status === 'owned') {
      return `${baseClass} card-owned`;
    }
    if (userStatus.status === 'wanted') {
      return `${baseClass} card-wanted`;
    }
    return baseClass;
  };

  // Handle status changes
  const handleStatusToggle = (newStatus) => {
    if (!isAuthenticated) return;
    
    // If clicking the same status, toggle it off
    if (userStatus && userStatus.status === newStatus) {
      onStatusChange(card._id, null);
      return;
    }
    
    // If clicking "owned", show quantity modal
    if (newStatus === 'owned') {
      setTempQuantity(userStatus?.quantity || 1);
      setShowQuantityModal(true);
      return;
    }
    
    // Otherwise, update the status directly
    onStatusChange(card._id, { status: newStatus, quantity: 1 });
  };
  
  // Handle quantity confirmation
  const handleQuantityConfirm = () => {
    onStatusChange(card._id, { status: 'owned', quantity: tempQuantity });
    setShowQuantityModal(false);
  };
  
  // Handle trade toggle
  const handleTradeToggle = () => {
    if (!isAuthenticated || !userStatus || userStatus.status !== 'owned') return;
    
    const newTradeStatus = !userStatus.forTrade;
    onStatusChange(card._id, { 
      ...userStatus, 
      forTrade: newTradeStatus 
    });
  };

  return (
    <div className={getCardClassName()}>
      <Link to={`/photocards/${card._id}`} className="card-link">
        <div className="card-img-wrapper">
          <img 
            src={card.image_url || 'https://via.placeholder.com/200x250?text=Photocard'} 
            alt={`${card.member_name || 'Unknown'} - ${card.album_title || 'Album'}`}
            className="card-img"
            loading="lazy"
          />
        </div>
        
        {isAuthenticated && userStatus && userStatus.status === 'owned' && (
          <div className="status-icon owned-icon">✓</div>
         )}
        {isAuthenticated && userStatus && userStatus.status === 'wanted' && (
          <div className="status-icon wanted-icon">♥</div>
        )}
        {isAuthenticated && userStatus && userStatus.status === 'owned' && userStatus.forTrade && (
          <div className="status-icon trade-icon">★</div>
        )}
        
        {isAuthenticated && userStatus && userStatus.status === 'owned' && userStatus.quantity > 1 && (
          <div className="quantity-badge">x{userStatus.quantity}</div>
        )}
        
        <div className="card-info">
          <h3 className="card-title" title={card.member_name || card.member_id?.name || 'Unknown Member'}>
            {card.member_name || card.member_id?.name || 'Unknown Member'}
          </h3>
          <p className="card-album" title={card.album_title || card.album_id?.name || 'Unknown Album'}>
            {card.album_title || card.album_id?.name || 'Unknown Album'}
          </p>
          {card.type && card.type !== 'Regular' && (
            <p className="card-type" title={card.type}>{card.type}</p>
          )}
        </div>
      </Link>
      
      {isAuthenticated && (
        <div className="card-actions">
          <button 
            className={`action-btn wishlist-btn ${userStatus?.status === 'wanted' ? 'active' : ''}`}
            onClick={() => handleStatusToggle('wanted')}
            title="Add to Wishlist"
          >
            ♥
          </button>
          <button 
            className={`action-btn owned-btn ${userStatus?.status === 'owned' ? 'active' : ''}`}
            onClick={() => handleStatusToggle('owned')}
            title="Add to Collection"
          >
            ✓
          </button>
          {userStatus && userStatus.status === 'owned' && (
            <button 
              className={`action-btn trade-btn ${userStatus.forTrade ? 'active' : ''}`}
              onClick={handleTradeToggle}
              title="Available for Trade"
            >
              ★
            </button>
          )}
        </div>
      )}
      
      {showQuantityModal && (
        <div className="quantity-modal">
          <div className="quantity-modal-content">
            <h4>How many do you own?</h4>
            <div className="quantity-controls">
              <button 
                onClick={() => setTempQuantity(Math.max(1, tempQuantity - 1))}
                disabled={tempQuantity <= 1}
              >-</button>
              <input 
                type="number" 
                min="1" 
                value={tempQuantity} 
                onChange={(e) => setTempQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <button onClick={() => setTempQuantity(tempQuantity + 1)}>+</button>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowQuantityModal(false)}>Cancel</button>
              <button onClick={handleQuantityConfirm}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoCard;
