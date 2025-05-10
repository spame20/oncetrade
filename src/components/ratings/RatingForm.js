import React, { useState, useContext } from 'react';
import { useRatings } from '../../context/RatingContext'; // Assuming RatingContext is in context folder
import './RatingForm.css'; // We'll create this CSS file next

const RatingForm = ({ tradeId, ratedUserId, onComplete }) => {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const { addRating } = useRatings();
  // In a real app, you might get the raterUserId from a user context
  const raterUserId = 'user1'; // Placeholder for the current logged-in user

  const handleSubmit = (e) => {
    e.preventDefault();
    if (stars === 0) {
      alert('Please select a star rating.');
      return;
    }
    const ratingData = {
      tradeId,
      raterUserId,
      ratedUserId,
      stars,
      comment,
    };
    addRating(ratingData);
    alert('Rating submitted successfully!');
    if (onComplete) {
      onComplete(); // Callback to close modal or redirect
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rating-form">
      <h3>Rate this Trade</h3>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= stars ? 'star selected' : 'star'}
            onClick={() => setStars(star)}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add an optional comment..."
        rows="4"
        className="rating-comment"
      />
      <button type="submit" className="submit-rating-btn">Submit Rating</button>
    </form>
  );
};

export default RatingForm;
