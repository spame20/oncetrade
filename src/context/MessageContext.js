import React, { createContext, useState, useContext } from 'react';

// Create the context
const MessageContext = createContext();

// Create a provider component
export const MessageProvider = ({ children }) => {
  // Mock messages data
  const [messages, setMessages] = useState([
    {
      _id: 'm1',
      sender: {
        _id: 'u1',
        username: 'TWICE_Fan99',
        avatar: 'https://via.placeholder.com/40'
      },
      receiver: {
        _id: 'user1',
        username: 'TWICE_Fan',
        avatar: 'https://via.placeholder.com/40'
      },
      content: 'Hi! Would you be interested in trading your Nayeon photocard?',
      date: '2025-04-10T10:30:00',
      read: true
    },
    {
      _id: 'm2',
      sender: {
        _id: 'user1',
        username: 'TWICE_Fan',
        avatar: 'https://via.placeholder.com/40'
      },
      receiver: {
        _id: 'u1',
        username: 'TWICE_Fan99',
        avatar: 'https://via.placeholder.com/40'
      },
      content: 'Yes, I would! What do you have to offer?',
      date: '2025-04-10T11:15:00',
      read: true
    },
    {
      _id: 'm3',
      sender: {
        _id: 'u1',
        username: 'TWICE_Fan99',
        avatar: 'https://via.placeholder.com/40'
      },
      receiver: {
        _id: 'user1',
        username: 'TWICE_Fan',
        avatar: 'https://via.placeholder.com/40'
      },
      content: 'I have a Jihyo photocard from Formula of Love. Would you be interested?',
      date: '2025-04-10T11:30:00',
      read: true
    },
    {
      _id: 'm4',
      sender: {
        _id: 'u2',
        username: 'MomoLover',
        avatar: 'https://via.placeholder.com/40'
      },
      receiver: {
        _id: 'user1',
        username: 'TWICE_Fan',
        avatar: 'https://via.placeholder.com/40'
      },
      content: 'Hello! I saw you have a Sana photocard. Is it available for trade?',
      date: '2025-04-15T09:45:00',
      read: false
    }
  ]) ;

  // Function to send a new message
  const sendMessage = (receiverId, content) => {
    const newMessage = {
      _id: `m${messages.length + 1}`,
      sender: {
        _id: 'user1',
        username: 'TWICE_Fan',
        avatar: 'https://via.placeholder.com/40'
      },
      receiver: {
        _id: receiverId,
        username: '', // This would be filled in a real app
        avatar: 'https://via.placeholder.com/40'
      },
      content: content,
      date: new Date() .toISOString(),
      read: false
    };
    
    setMessages([...messages, newMessage]);
  };

  // Function to mark a message as read
  const markAsRead = (messageId) => {
    setMessages(prevMessages => 
      prevMessages.map(message => 
        message._id === messageId ? { ...message, read: true } : message
      )
    );
  };

  // Return the provider with the data and functions
  return (
    <MessageContext.Provider value={{ 
      messages, 
      setMessages,
      sendMessage,
      markAsRead
    }}>
      {children}
    </MessageContext.Provider>
  );
};

// Create a custom hook to use the message context
export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
