import React from 'react';
import './TradeCompletionModal.css'; // We will create this CSS file next

// Placeholder for a generic trade success graphic or specific card image
const TradeSuccessImage = ({ cardImageUrl }) => {
  // If cardImageUrl is provided, display it. Otherwise, a generic graphic.
  const imgSrc = cardImageUrl || 'https://via.placeholder.com/300x250?text=Trade+Success!';
  return (
    <div className="polaroid-image-area">
      <img src={imgSrc} alt="Trade Keepsake" />
    </div>
  ) ;
};

const TradeCompletionModal = ({ isOpen, onClose, tradeDetails }) => {
  if (!isOpen || !tradeDetails) return null;

  const { userA, userB, date, receivedCardImageUrl } = tradeDetails;

  // Fallback for missing details (should ideally always be present)
  const displayUserA = userA || 'Trader 1';
  const displayUserB = userB || 'Trader 2';
  const displayDate = date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'A memorable day';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content trade-completion-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        
        <div className="polaroid-frame">
          <TradeSuccessImage cardImageUrl={receivedCardImageUrl} />
          <div className="polaroid-caption">
            <h3 className="polaroid-title">Trade Completed!</h3>
            <p className="polaroid-traders">{displayUserA} & {displayUserB}</p>
            <p className="polaroid-date">{displayDate}</p>
            {/* Optional: Small handshake or custom icon here */}
            {/* <span className="polaroid-icon">🤝</span> */}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TradeCompletionModal;
