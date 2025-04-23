import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PhotoCard = ({ card, userStatus }) => {
  const { isAuthenticated } = useAuth();
  
  // Determine card styling based on user status
  const getCardClassName = () => {
    if (!userStatus) return 'photocard';
    
    if (userStatus.status === 'owned') {
      return 'photocard card-owned';
    } else if (userStatus.status === 'wanted') {
      return 'photocard card-wanted';
    } else {
      return 'photocard card-not-interested';
    }
  };

  return (
    <div className={getCardClassName()}>
      <Link to={`/photocards/${card._id}`}>
        <img 
          src={card.image_url || 'https://via.placeholder.com/200x250'} 
          alt={`${card.member_name || 'Unknown'} from ${card.album_title || 'Unknown Album'}`} 
          className="card-img"
        />
        
        {/* Status icons - only show if user is authenticated */}
        {isAuthenticated && userStatus && userStatus.status === 'owned' && (
          <div className="status-icon owned-icon">✓</div>
        )}
        
        {isAuthenticated && userStatus && userStatus.status === 'wanted' && (
          <div className="status-icon wanted-icon">★</div>
        )}
        
        {/* Quantity badge for owned cards */}
        {isAuthenticated && userStatus && userStatus.status === 'owned' && userStatus.quantity > 1 && (
          <div className="quantity-badge">x{userStatus.quantity}</div>
        )}
        
        <div className="card-info">
          <h3 className="card-title">{card.member_name || card.member_id?.name || 'Unknown Member'}</h3>
          <p className="card-album">{card.album_title || card.album_id?.name || 'Unknown Album'}</p>
          {card.type && card.type !== 'Regular' && (
            <p className="card-type">{card.type}</p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default PhotoCard;
