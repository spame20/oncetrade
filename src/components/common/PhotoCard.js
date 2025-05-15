import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './PhotoCard.css'; // Import the new CSS file

// Placeholder for custom icons - we will replace these text/unicode characters later
const OwnedIcon = () => <span className="status-icon owned-icon">✓</span>; // ✓ or custom SVG
const WantedIcon = () => <span className="status-icon wanted-icon">★</span>; // ★ or custom SVG

const PhotoCard = ({ card, userStatus }) => {
  const { isAuthenticated } = useAuth();
  
  const getCardClassName = () => {
    let baseClass = 'photocard';
    if (!isAuthenticated || !userStatus) return baseClass;
    
    if (userStatus.status === 'owned') {
      return `${baseClass} card-owned`;
    }
    // For wanted/not-interested, we primarily use opacity, border is optional
    // if (userStatus.status === 'wanted') {
    //   return `${baseClass} card-wanted`;
    // }
    // if (userStatus.status === 'not-interested') {
    //  return `${baseClass} card-not-interested`;
    // }
    return baseClass; // Default if no specific status or not authenticated
  };

  // Determine opacity based on status for non-owned cards if user is authenticated
  const cardStyle = {};
  if (isAuthenticated && userStatus) {
    if (userStatus.status === 'wanted') {
      cardStyle.opacity = 0.85;
    }
    if (userStatus.status === 'not-interested') {
      cardStyle.opacity = 0.7;
    }
  }

  return (
    <div className={getCardClassName()} style={cardStyle}>
      <Link to={`/photocards/${card._id}`}>
        <div className="card-img-wrapper">
          <img 
            src={card.image_url || 'https://via.placeholder.com/200x250?text=Photocard'} 
            alt={`${card.member_name || 'Unknown'} - ${card.album_title || 'Album'}`}
            className="card-img"
            loading="lazy" // Add lazy loading for images
          />
        </div>
        
        {isAuthenticated && userStatus && userStatus.status === 'owned' && <OwnedIcon />}
        {isAuthenticated && userStatus && userStatus.status === 'wanted' && <WantedIcon />}
        
        {isAuthenticated && userStatus && userStatus.status === 'owned' && userStatus.quantity > 0 && (
          <div className="quantity-badge">x{userStatus.quantity}</div>
        ) }
        
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
    </div>
  );
};

export default PhotoCard;
