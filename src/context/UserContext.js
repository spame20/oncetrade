import React, { createContext, useState, useContext } from 'react';

// Create the context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  // Mock user data
  const [user, setUser] = useState({
    _id: 'user1',
    username: 'TWICE_Fan',
    avatar: 'https://via.placeholder.com/100',
    join_date: '2025-01-15',
    collection: [
      {
        _id: 'uc1',
        photocard_id: 'pc1',
        member: 'Nayeon',
        album: 'Formula of Love',
        image: 'https://via.placeholder.com/200x200',
        for_trade: true
      },
      {
        _id: 'uc2',
        photocard_id: 'pc4',
        member: 'Sana',
        album: 'Between 1&2',
        image: 'https://via.placeholder.com/200x200',
        for_trade: false
      },
      {
        _id: 'uc3',
        photocard_id: 'pc6',
        member: 'Mina',
        album: 'Ready to Be',
        image: 'https://via.placeholder.com/200x200',
        for_trade: true
      },
      {
        _id: 'uc4',
        photocard_id: 'pc8',
        member: 'Chaeyoung',
        album: 'Yes, I Am',
        image: 'https://via.placeholder.com/200x200',
        for_trade: false
      }
    ],
    wishlist: [
      {
        _id: 'w1',
        photocard_id: 'pc2',
        member: 'Jeongyeon',
        album: 'Formula of Love',
        image: 'https://via.placeholder.com/200x200',
        available_trades: 2
      },
      {
        _id: 'w2',
        photocard_id: 'pc3',
        member: 'Momo',
        album: 'Formula of Love',
        image: 'https://via.placeholder.com/200x200',
        available_trades: 0
      },
      {
        _id: 'w3',
        photocard_id: 'pc5',
        member: 'Jihyo',
        album: 'Between 1&2',
        image: 'https://via.placeholder.com/200x200',
        available_trades: 3
      },
      {
        _id: 'w4',
        photocard_id: 'pc9',
        member: 'Tzuyu',
        album: 'Yes, I Am',
        image: 'https://via.placeholder.com/200x200',
        available_trades: 1
      }
    ]
  }) ;

  // Function to toggle "for_trade" status of a card in collection
  const toggleForTrade = (cardId) => {
    setUser(prevUser => {
      const updatedCollection = prevUser.collection.map(card => {
        if (card._id === cardId) {
          return { ...card, for_trade: !card.for_trade };
        }
        return card;
      });
      return { ...prevUser, collection: updatedCollection };
    });
  };

  // Function to remove a card from wishlist
  const removeFromWishlist = (cardId) => {
    setUser(prevUser => {
      const updatedWishlist = prevUser.wishlist.filter(card => card._id !== cardId);
      return { ...prevUser, wishlist: updatedWishlist };
    });
  };

  // Return the provider with the data and functions
  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      toggleForTrade, 
      removeFromWishlist 
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
