import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './PhotoCard.css';

// Placeholder for custom icons - we will replace these text/unicode characters later
const OwnedIcon = () => <span className="status-icon owned-icon">✓</span>; // ✓ or custom SVG
const WantedIcon = () => <span className="status-icon wanted-icon">♥</span>; // ♥ or custom SVG

const PhotoCard = ({ card, userStatus, onStatusChange }) => {
  const { isAuthenticated } = useAuth();
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [quantity, setQuantity] = useState(userStatus?.quantity || 1);
  const navigate = useNavigate();
  
  // Initialize status from props or default to not owned/wanted
  const initialStatus = userStatus?.status || 'none';
  const initialForTrade = userStatus?.forTrade || false;
  
  const [status, setStatus] = useState(initialStatus);
  const [forTrade, setForTrade] = useState(initialForTrade);
  
  const getCardClassName = () => {
    let baseClass = 'photocard';
    if (!isAuthenticated) return baseClass;
    
    if (status === 'owned') {
      return `${baseClass} card-owned`;
    }
    if (status === 'wanted') {
      return `${baseClass} card-wanted`;
    }
    return baseClass;
  };

  // Handle marking as owned
  const handleToggleOwned = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (status === 'owned') {
      // If already owned, show quantity modal
      setShowQuantityModal(true);
    } else {
      // If not owned, mark as owned with quantity 1
      setStatus('owned');
      setQuantity(1);
      if (onStatusChange) {
        onStatusChange(card._id, { 
          status: 'owned', 
          quantity: 1,
          forTrade: forTrade 
        });
      }
    }
  };
  
  // Handle marking as wanted/unwanted
  const handleToggleWanted = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newStatus = status === 'wanted' ? 'none' : 'wanted';
    setStatus(newStatus);
    
    if (onStatusChange) {
      if (newStatus === 'none') {
        onStatusChange(card._id, null); // Remove from wishlist
      } else {
        onStatusChange(card._id, { 
          status: newStatus,
          quantity: 0,
          forTrade: false
        });
      }
    }
  };
  
  // Handle marking for trade
  const handleToggleForTrade = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (status !== 'owned') return; // Can only mark owned cards for trade
    
    const newForTrade = !forTrade;
    setForTrade(newForTrade);
    
    if (onStatusChange) {
      onStatusChange(card._id, { 
        status: 'owned',
        quantity: quantity,
        forTrade: newForTrade
      });
    }
  };
  
  // Handle quantity change
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      setQuantity(newQuantity);
    }
  };
  
  // Save quantity changes
  const handleSaveQuantity = (e) => {
    e.preventDefault();
    
    if (quantity === 0) {
      // If quantity is 0, remove from collection
      setStatus('none');
      setForTrade(false);
      if (onStatusChange) {
        onStatusChange(card._id, null);
      }
    } else {
      // Update with new quantity
      if (onStatusChange) {
        onStatusChange(card._id, {
          status: 'owned',
          quantity: quantity,
          forTrade: forTrade
        });
      }
    }
    
    setShowQuantityModal(false);
  };

  // Handle card click to navigate to detail page
  const handleCardClick = (e) => {
    e.preventDefault(); // Prevent default behavior

    let cardId = card._id || card.id || card.photocard_id;

    if (typeof cardId === 'string' && cardId.startsWith('card')) {
      cardId = cardId.replace('card', '');
    }

    if (!cardId) {
      console.error("Card ID is missing or invalid!");
      return;
    }

    console.log("Navigating to card with ID:", cardId);
    navigate(`/cards/${cardId}`);
  };

  return (
    <div className={getCardClassName()}>
      <div className="card-clickable" onClick={handleCardClick}>
        <div className="card-img-wrapper">
          <img 
            src={card.image_url || 'https://via.placeholder.com/200x250?text=Photocard'} 
            alt={`${card.member_name || 'Unknown'} - ${card.album_title || 'Album'}`}
            className="card-img"
            loading="lazy"
          />
        </div>
        
        {isAuthenticated && status === 'owned' && <OwnedIcon />}
        {isAuthenticated && status === 'wanted' && <WantedIcon />}
        
        {isAuthenticated && status === 'owned' && quantity > 0 && (
          <div className="quantity-badge">x{quantity}</div>
         )}
        
        <div className="card-info">
          <h3 className="card-title" title={card.member_name || 'Unknown Member'}>
            {card.member_name || 'Unknown Member'}
          </h3>
          <p className="card-album" title={card.album_title || 'Unknown Album'}>
            {card.album_title || 'Unknown Album'}
          </p>
          {card.type && card.type !== 'Regular' && (
            <p className="card-type" title={card.type}>{card.type}</p>
          )}
        </div>
      </div>
      
      {/* Action buttons - only visible when authenticated */}
      {isAuthenticated && (
        <div className="card-actions">
          <div className="tooltip-wrapper">
            <button 
              className={`action-btn ${status === 'wanted' ? 'active' : ''}`}
              onClick={handleToggleWanted}
              aria-label={status === 'wanted' ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              ♥
              <span className="simple-tooltip">
                {status === 'wanted' ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </span>
            </button>
          </div>
          
          <div className="tooltip-wrapper">
            <button 
              className={`action-btn ${status === 'owned' ? 'active' : ''}`}
              onClick={handleToggleOwned}
              aria-label={status === 'owned' ? 'Edit Quantity' : 'Add to My Collection'}
            >
              ✓
              <span className="simple-tooltip">
                {status === 'owned' ? 'Edit Quantity' : 'Add to Collection'}
              </span>
            </button>
          </div>
          
          <div className="tooltip-wrapper">
            <button 
              className={`action-btn ${forTrade ? 'active' : ''} ${status !== 'owned' ? 'disabled' : ''}`}
              onClick={handleToggleForTrade}
              disabled={status !== 'owned'}
              aria-label={forTrade ? 'Remove from Trade List' : 'Mark Available for Trade'}
            >
              ★
              <span className="simple-tooltip">
                {forTrade ? 'Remove from Trade' : 'Available for Trade'}
              </span>
            </button>
          </div>
        </div>
      )}
      
      {/* Quantity Modal */}
      {showQuantityModal && (
        <div className="quantity-modal">
          <div className="quantity-modal-content">
            <h4>Update Quantity</h4>
            <input 
              type="number" 
              min="0" 
              value={quantity} 
              onChange={handleQuantityChange} 
            />
            <div className="quantity-modal-actions">
              <button onClick={() => setShowQuantityModal(false)}>Cancel</button>
              <button onClick={handleSaveQuantity}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoCard;
