import React from 'react';
import './RatingDisplay.css'; // We'll create this CSS file next

const RatingDisplay = ({ ratings }) => {
  if (!ratings || ratings.length === 0) {
    return <p className="no-ratings">No ratings yet.</p>;
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="ratings-list">
      <h3>User Reviews</h3>
      {ratings.map((rating) => (
        <div key={rating.ratingId} className="rating-item">
          <div className="rating-header">
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= rating.stars ? 'star selected' : 'star'}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="rating-user">Rated by: {rating.raterUserId}</span> {/* We might want to fetch actual username later */}
            <span className="rating-date">{formatDate(rating.timestamp)}</span>
          </div>
          {rating.comment && (
            <p className="rating-comment-display">{rating.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default RatingDisplay;
