import React, { createContext, useState, useContext } from 'react';

// Create the context
const TradeContext = createContext();

// Create a provider component
export const TradeProvider = ({ children }) => {
  // Mock trades data
  const [trades, setTrades] = useState([
    {
      _id: 't1',
      partner: {
        _id: 'u1',
        username: 'TWICE_Fan99',
        avatar: 'https://via.placeholder.com/40'
      },
      status: 'completed',
      date: '2025-03-15',
      offered_cards: [
        {
          member: 'Nayeon',
          album: 'Formula of Love'
        }
      ],
      received_cards: [
        {
          member: 'Jihyo',
          album: 'Formula of Love'
        }
      ]
    },
    {
      _id: 't2',
      partner: {
        _id: 'u2',
        username: 'MomoLover',
        avatar: 'https://via.placeholder.com/40'
      },
      status: 'in-progress',
      date: '2025-04-10',
      offered_cards: [
        {
          member: 'Sana',
          album: 'Between 1&2'
        }
      ],
      received_cards: [
        {
          member: 'Momo',
          album: 'Between 1&2'
        }
      ]
    },
    {
      _id: 't3',
      partner: {
        _id: 'u3',
        username: 'TwicyCollector',
        avatar: 'https://via.placeholder.com/40'
      },
      status: 'pending',
      date: '2025-04-18',
      offered_cards: [
        {
          member: 'Tzuyu',
          album: 'Dive'
        }
      ],
      received_cards: [
        {
          member: 'Chaeyoung',
          album: 'Dive'
        }
      ]
    },
    {
      _id: 't4',
      partner: {
        _id: 'u4',
        username: 'MinaFanatic',
        avatar: 'https://via.placeholder.com/40'
      },
      status: 'completed',
      date: '2025-02-28',
      offered_cards: [
        {
          member: 'Dahyun',
          album: 'Yes, I Am'
        }
      ],
      received_cards: [
        {
          member: 'Mina',
          album: 'Yes, I Am'
        }
      ]
    },
    {
      _id: 't5',
      partner: {
        _id: 'u5',
        username: 'JeongyeonStan',
        avatar: 'https://via.placeholder.com/40'
      },
      status: 'in-progress',
      date: '2025-04-05',
      offered_cards: [
        {
          member: 'Mina',
          album: 'Between 1&2'
        }
      ],
      received_cards: [
        {
          member: 'Jeongyeon',
          album: 'Between 1&2'
        }
      ]
    }
  ]) ;

  // Return the provider with the data and functions
  return (
    <TradeContext.Provider value={{ trades, setTrades }}>
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
