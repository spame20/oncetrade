import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MessagingInterfacePage = () => {
  const [message, setMessage] = useState('');
  const [activeConversationId, setActiveConversationId] = useState('1');
  
  // Mock conversations data
  const conversations = [
    {
      id: '1',
      user: {
        id: '789',
        username: 'MomoCollector',
        profilePicture: 'https://via.placeholder.com/50x50'
      },
      lastMessage: {
        text: 'Yes, I have both! I\'ve added them to the trade offer.',
        timestamp: '2025-04-15T14:40:00Z',
        isRead: true
      },
      messages: [
        {
          id: 1,
          sender: 'TwiceFan123',
          text: 'Hi! I\'m interested in your Momo card. Would you like to trade?',
          timestamp: '2025-04-15T14:30:00Z'
        },
        {
          id: 2,
          sender: 'MomoCollector',
          text: 'Sure! I\'m looking for Nayeon and Jeongyeon cards. Do you have any?',
          timestamp: '2025-04-15T14:35:00Z'
        },
        {
          id: 3,
          sender: 'TwiceFan123',
          text: 'Yes, I have both! I\'ve added them to the trade offer.',
          timestamp: '2025-04-15T14:40:00Z'
        }
      ]
    },
    {
      id: '2',
      user: {
        id: '101',
        username: 'TwiceForever',
        profilePicture: 'https://via.placeholder.com/50x50'
      },
      lastMessage: {
        text: 'Do you have any Sana cards from the "Yes, I Am" album?',
        timestamp: '2025-04-14T10:15:00Z',
        isRead: false
      },
      messages: [
        {
          id: 1,
          sender: 'TwiceForever',
          text: 'Hello! I saw you have a lot of TWICE cards.',
          timestamp: '2025-04-14T10:10:00Z'
        },
        {
          id: 2,
          sender: 'TwiceForever',
          text: 'Do you have any Sana cards from the "Yes, I Am" album?',
          timestamp: '2025-04-14T10:15:00Z'
        }
      ]
    },
    {
      id: '3',
      user: {
        id: '102',
        username: 'JihyoFan',
        profilePicture: 'https://via.placeholder.com/50x50'
      },
      lastMessage: {
        text: 'Thanks for the trade! The card arrived safely.',
        timestamp: '2025-04-10T16:20:00Z',
        isRead: true
      },
      messages: [
        {
          id: 1,
          sender: 'JihyoFan',
          text: 'Thanks for the trade! The card arrived safely.',
          timestamp: '2025-04-10T16:20:00Z'
        }
      ]
    }
  ];
  
  // Get active conversation
  const getActiveConversation = ()  => {
    return conversations.find(conv => conv.id === activeConversationId) || null;
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Format preview timestamp (relative time)
  const formatPreviewTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  // Handle message input
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  
  // Handle message submit
  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;
    
    // In a real app, this would send the message to the API
    console.log('Sending message:', message);
    
    // Clear the input
    setMessage('');
  };
  
  const activeConversation = getActiveConversation();
  
  return (
    <main className="messaging-interface">
      <div className="conversations-sidebar">
        <div className="sidebar-header">
          <h2>Messages</h2>
        </div>
        
        <div className="conversations-list">
          {conversations.map(conv => (
            <div 
              key={conv.id} 
              className={`conversation-item ${activeConversationId === conv.id ? 'active' : ''} ${!conv.lastMessage.isRead && conv.user.username !== 'TwiceFan123' ? 'unread' : ''}`}
              onClick={() => setActiveConversationId(conv.id)}
            >
              <img 
                src={conv.user.profilePicture} 
                alt={`${conv.user.username}'s profile`} 
                className="user-avatar" 
              />
              
              <div className="conversation-info">
                <div className="conversation-header">
                  <h3 className="username">{conv.user.username}</h3>
                  <span className="timestamp">{formatPreviewTimestamp(conv.lastMessage.timestamp)}</span>
                </div>
                
                <p className="message-preview">
                  {conv.lastMessage.text.length > 40 
                    ? conv.lastMessage.text.substring(0, 40) + '...' 
                    : conv.lastMessage.text
                  }
                </p>
              </div>
              
              {!conv.lastMessage.isRead && conv.user.username !== 'TwiceFan123' && (
                <div className="unread-indicator"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="chat-area">
        {activeConversation ? (
          <>
            <div className="chat-header">
              <div className="user-info">
                <img 
                  src={activeConversation.user.profilePicture} 
                  alt={`${activeConversation.user.username}'s profile`} 
                  className="user-avatar" 
                />
                <h3 className="username">{activeConversation.user.username}</h3>
              </div>
              
              <div className="chat-actions">
                <Link to={`/profile/${activeConversation.user.id}`} className="view-profile-btn">
                  View Profile
                </Link>
                <Link to={`/trades/new/${activeConversation.user.id}`} className="propose-trade-btn">
                  Propose Trade
                </Link>
              </div>
            </div>
            
            <div className="messages-container">
              {activeConversation.messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`message ${msg.sender === 'TwiceFan123' ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    <p className="message-text">{msg.text}</p>
                    <span className="message-time">{formatTimestamp(msg.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <form className="message-form" onSubmit={handleMessageSubmit}>
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={message}
                onChange={handleMessageChange}
                className="message-input"
              />
              <button type="submit" className="btn btn-primary send-btn">Send</button>
            </form>
          </>
        ) : (
          <div className="no-conversation-selected">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default MessagingInterfacePage;
