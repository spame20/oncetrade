import React, { createContext, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid'; // We'll need to install this package

// Create the context
const RatingContext = createContext();

// Mock initial ratings data (optional, for development)
const initialRatings = [
  {
    ratingId: 'r1',
    tradeId: 't1', // Assuming t1 is a completed trade
    raterUserId: 'u2', // User MomoLover rated
    ratedUserId: 'user1', // User TWICE_Fan (current user)
    stars: 5,
    comment: 'Great trader! Fast shipping and item as described.',
    timestamp: new Date('2025-04-20T10:00:00Z').toISOString(),
  },
  {
    ratingId: 'r2',
    tradeId: 't4', // Assuming t4 is a completed trade
    raterUserId: 'user1', // User TWICE_Fan (current user) rated
    ratedUserId: 'u2', // User MomoLover
    stars: 4,
    comment: 'Good communication, would trade again!',
    timestamp: new Date('2025-04-22T15:30:00Z').toISOString(),
  },
];

// Create a provider component
export const RatingProvider = ({ children }) => {
  const [ratings, setRatings] = useState(initialRatings);

  // Function to add a new rating
  const addRating = (ratingData) => {
    const newRating = {
      ...ratingData,
      ratingId: uuidv4(),
      timestamp: new Date().toISOString(),
    };
    setRatings((prevRatings) => [...prevRatings, newRating]);
    // In a real app, this would also send data to a backend
  };

  // Function to get all ratings received by a specific user
  const getRatingsForUser = (userId) => {
    return ratings.filter(rating => rating.ratedUserId === userId);
  };

  // Function to get a rating a specific user left for a specific trade
  const getRatingForTradeByRater = (tradeId, raterUserId) => {
    return ratings.find(rating => rating.tradeId === tradeId && rating.raterUserId === raterUserId);
  };
  
  // Function to get all ratings associated with a specific trade
  const getRatingsForTrade = (tradeId) => {
    return ratings.filter(rating => rating.tradeId === tradeId);
  };

  return (
    <RatingContext.Provider value={{ ratings, addRating, getRatingsForUser, getRatingForTradeByRater, getRatingsForTrade }}>
      {children}
    </RatingContext.Provider>
  );
};

// Create a custom hook to use the rating context
export const useRatings = () => {
  const context = useContext(RatingContext);
  if (!context) {
    throw new Error('useRatings must be used within a RatingProvider');
  }
  return context;
};
