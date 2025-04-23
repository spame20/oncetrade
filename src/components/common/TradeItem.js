import React from 'react';
import { Link } from 'react-router-dom';

const TradeItem = ({ trade, isUserTrade = false }) => {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'proposed':
        return 'status-badge status-proposed';
      case 'accepted':
        return 'status-badge status-accepted';
      case 'in_progress':
        return 'status-badge status-in-progress';
      case 'completed':
        return 'status-badge status-completed';
      case 'cancelled':
        return 'status-badge status-cancelled';
      case 'rejected':
        return 'status-badge status-rejected';
      default:
        return 'status-badge';
    }
  };
  
  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'proposed':
        return 'Proposed';
      case 'accepted':
        return 'Accepted';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  return (
    <div className="trade-item">
      <div className="trade-header">
        <div className="trade-users">
          <div className="trade-user initiator">
            <img 
              src={trade.initiator?.profile_picture || 'https://via.placeholder.com/40x40'} 
              alt={trade.initiator?.username || 'User'} 
              className="user-avatar"
            />
            <span className="username">{trade.initiator?.username || 'User'}</span>
          </div>
          
          <div className="trade-direction">
            <span className="trade-arrow">↔️</span>
          </div>
          
          <div className="trade-user recipient">
            <img 
              src={trade.recipient?.profile_picture || 'https://via.placeholder.com/40x40'} 
              alt={trade.recipient?.username || 'User'} 
              className="user-avatar"
            />
            <span className="username">{trade.recipient?.username || 'User'}</span>
          </div>
        </div>
        
        <div className={getStatusBadgeClass(trade.status)}>
          {getStatusText(trade.status)}
        </div>
      </div>
      
      <div className="trade-content">
        <div className="trade-cards initiator-cards">
          {trade.initiator_items && trade.initiator_items.length > 0 ? (
            trade.initiator_items.map((item, index) => (
              <div key={index} className="trade-card">
                <img 
                  src={item.photocard?.image_url || 'https://via.placeholder.com/60x80'} 
                  alt={item.photocard?.member_name || 'Card'} 
                  className="card-thumbnail"
                />
                <div className="card-info">
                  <span className="card-member">{item.photocard?.member_name || 'Unknown'}</span>
                  <span className="card-album">{item.photocard?.album_title || 'Unknown Album'}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-cards">No cards offered</div>
          )}
        </div>
        
        <div className="trade-cards recipient-cards">
          {trade.recipient_items && trade.recipient_items.length > 0 ? (
            trade.recipient_items.map((item, index) => (
              <div key={index} className="trade-card">
                <img 
                  src={item.photocard?.image_url || 'https://via.placeholder.com/60x80'} 
                  alt={item.photocard?.member_name || 'Card'} 
                  className="card-thumbnail"
                />
                <div className="card-info">
                  <span className="card-member">{item.photocard?.member_name || 'Unknown'}</span>
                  <span className="card-album">{item.photocard?.album_title || 'Unknown Album'}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-cards">No cards requested</div>
          )}
        </div>
      </div>
      
      <div className="trade-footer">
        <div className="trade-date">
          <span className="date-label">Created:</span>
          <span className="date-value">{formatDate(trade.created_at)}</span>
        </div>
        
        {isUserTrade && (
          <Link to={`/trades/${trade._id}`} className="view-trade-btn">
            View Details
          </Link>
        )}
      </div>
    </div>
  );
};

export default TradeItem;
