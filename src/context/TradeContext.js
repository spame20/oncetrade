import React, { createContext, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Ensure uuid is installed

// Create the context
const TradeContext = createContext();

// Mock initial trades data
const initialTrades = [
  {
    _id: 't1',
    // Assuming 'user1' (TWICE_Fan) is the current user doing the rating
    // and 'u1' (TWICE_Fan99) is the partner they traded with.
    initiatorId: 'user1', 
    receiverId: 'u1',    
    partner: {
      _id: 'u1',
      username: 'TWICE_Fan99',
      avatar: 'https://via.placeholder.com/40'
    },
    status: 'completed', // Trade must be completed to be rated
    date: '2025-03-15',
    offered_cards: [
      { photocard_id: 'pcMinaRTB', member: 'Mina', album: 'Ready to Be', image: 'https://i.ebayimg.com/images/g/YyYAAOSw~-tkrB~k/s-l1600.jpg' }
    ],
    received_cards: [
      { photocard_id: 'pcJeongyeonFOL', member: 'Jeongyeon', album: 'Formula of Love', image: 'https://i.ebayimg.com/images/g/pskAAOSwTWhj3~OD/s-l1600.jpg' }
    ],
    messages: [
      { senderId: 'user1', content: 'Hi! Interested in your Jeongyeon FOL card.', timestamp: '2025-03-14T10:00:00Z' },
      { senderId: 'u1', content: 'Hello! Yes, it is. What are you offering?', timestamp: '2025-03-14T10:05:00Z' },
    ]
  },
  {
    _id: 't2',
    initiatorId: 'u2', 
    receiverId: 'user1',
    partner: {
      _id: 'user1',
      username: 'TWICE_Fan',
      avatar: 'https://via.placeholder.com/40'
    },
    status: 'in-progress', // This trade cannot be rated yet
    date: '2025-04-10',
    offered_cards: [
      { photocard_id: 'pcSanaB12', member: 'Sana', album: 'Between 1&2', image: 'https://via.placeholder.com/150' }
    ],
    received_cards: [
      { photocard_id: 'pcMomoFOL', member: 'Momo', album: 'Formula of Love', image: 'https://via.placeholder.com/150' }
    ],
    messages: []
  },
  {
    _id: 't3',
    initiatorId: 'user1',
    receiverId: 'u3',
    partner: {
      _id: 'u3',
      username: 'TwicyCollector',
      avatar: 'https://via.placeholder.com/40'
    },
    status: 'completed',
    date: '2025-04-15',
    offered_cards: [
      { photocard_id: 'pcDahyunFOL', member: 'Dahyun', album: 'Formula of Love', image: 'https://via.placeholder.com/150' }
    ],
    received_cards: [
      { photocard_id: 'pcTzuyuYIA', member: 'Tzuyu', album: 'Yes, I Am', image: 'https://via.placeholder.com/150' }
    ],
    messages: []
  },
  // Add more mock trades as needed, ensuring some are 'completed'
  // and involve 'user1' as either initiator or receiver to test rating from user1's perspective.
];

// Create a provider component
export const TradeProvider = ({ children })  => {
  const [trades, setTrades] = useState(initialTrades);

  // Function to add a new trade (simplified, no backend)
  const addTrade = (tradeData) => {
    const newTrade = {
      ...tradeData,
      _id: uuidv4(), // Generate a unique ID for the new trade
      date: new Date().toISOString(),
      // Ensure initiatorId and receiverId are correctly passed in tradeData
    };
    setTrades((prevTrades) => [...prevTrades, newTrade]);
  };

  // Function to update trade status (simplified)
  const updateTradeStatus = (tradeId, newStatus) => {
    setTrades((prevTrades) =>
      prevTrades.map((trade) =>
        trade._id === tradeId ? { ...trade, status: newStatus } : trade
      )
    );
    // In a real app, this would also trigger a backend update
  };

  return (
    <TradeContext.Provider value={{ trades, addTrade, updateTradeStatus, setTrades }}>
      {children}
    </TradeContext.Provider>
  );
};

// Create a custom hook to use the trade context
export const useTrades = () => {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error('useTrades must be used within a TradeProvider');
  }
  return context;
};
