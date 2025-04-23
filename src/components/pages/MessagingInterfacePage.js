import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMessages } from '../../context/MessageContext';

const MessagingInterfacePage = () => {
  const { userId } = useParams();
  const { messages, sendMessage, markAsRead } = useMessages();
  const [newMessage, setNewMessage] = useState('');
  const [activeContact, setActiveContact] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Get unique contacts from messages
  const contacts = [...new Set(
    messages.map(msg => 
      msg.sender._id === 'user1' 
        ? msg.receiver._id 
        : msg.sender._id
    )
  )].map(contactId => {
    const contactMsg = messages.find(msg => 
      msg.sender._id === contactId || msg.receiver._id === contactId
    );
    return {
      _id: contactId,
      username: contactId === 'user1' 
        ? 'You' 
        : (contactMsg.sender._id === contactId 
          ? contactMsg.sender.username 
          : contactMsg.receiver.username),
      avatar: contactId === 'user1' 
        ? 'https://via.placeholder.com/40' 
        : (contactMsg.sender._id === contactId 
          ? contactMsg.sender.avatar 
          : contactMsg.receiver.avatar) ,
      lastMessage: messages
        .filter(msg => msg.sender._id === contactId || msg.receiver._id === contactId)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0],
      unreadCount: messages.filter(msg => 
        msg.sender._id === contactId && !msg.read
      ).length
    };
  });
  
  // Set active contact based on URL parameter or first contact
  useEffect(() => {
    if (userId && contacts.find(c => c._id === userId)) {
      setActiveContact(contacts.find(c => c._id === userId));
    } else if (contacts.length > 0 && !activeContact) {
      setActiveContact(contacts[0]);
    }
  }, [userId, contacts, activeContact]);
  
  // Mark messages as read when viewing conversation
  useEffect(() => {
    if (activeContact) {
      messages
        .filter(msg => msg.sender._id === activeContact._id && !msg.read)
        .forEach(msg => markAsRead(msg._id));
    }
  }, [activeContact, messages, markAsRead]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeContact]);
  
  // Get conversation messages
  const conversationMessages = activeContact 
    ? messages.filter(msg => 
        (msg.sender._id === 'user1' && msg.receiver._id === activeContact._id) ||
        (msg.sender._id === activeContact._id && msg.receiver._id === 'user1')
      ).sort((a, b) => new Date(a.date) - new Date(b.date))
    : [];
  
  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && activeContact) {
      sendMessage(activeContact._id, newMessage);
      setNewMessage('');
    }
  };
  
  // Format date for display
  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
           ' ' + date.toLocaleDateString();
  };

  return (
    <main className="container">
      <h2 className="section-title">Messages</h2>
      
      <div className="messaging-interface">
        <div className="contacts-list">
          <div className="contacts-header">
            <h3>Conversations</h3>
          </div>
          
          {contacts.length > 0 ? (
            <div className="contacts">
              {contacts
                .filter(contact => contact._id !== 'user1') // Don't show self
                .map(contact => (
                  <div 
                    key={contact._id} 
                    className={`contact-item ${activeContact && activeContact._id === contact._id ? 'active' : ''}`}
                    onClick={() => setActiveContact(contact)}
                  >
                    <div className="contact-avatar">
                      <img src={contact.avatar} alt={contact.username} />
                      {contact.unreadCount > 0 && (
                        <span className="unread-badge">{contact.unreadCount}</span>
                      )}
                    </div>
                    <div className="contact-info">
                      <div className="contact-name">{contact.username}</div>
                      <div className="contact-last-message">
                        {contact.lastMessage.content.length > 25
                          ? contact.lastMessage.content.substring(0, 25) + '...'
                          : contact.lastMessage.content}
                      </div>
                    </div>
                    <div className="contact-time">
                      {new Date(contact.lastMessage.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="no-contacts">
              <p>No conversations yet.</p>
            </div>
          )}
        </div>
        
        <div className="message-area">
          {activeContact ? (
            <>
              <div className="message-header">
                <div className="message-contact">
                  <img src={activeContact.avatar} alt={activeContact.username} className="contact-avatar-img" />
                  <span className="contact-name">{activeContact.username}</span>
                </div>
                <Link to={`/profile/${activeContact._id}`} className="view-profile-link">
                  View Profile
                </Link>
              </div>
              
              <div className="messages-container">
                {conversationMessages.length > 0 ? (
                  <div className="messages">
                    {conversationMessages.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`message ${msg.sender._id === 'user1' ? 'sent' : 'received'}`}
                      >
                        <div className="message-content">{msg.content}</div>
                        <div className="message-time">{formatMessageDate(msg.date)}</div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="no-messages">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>
              
              <form className="message-input-form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="message-input"
                />
                <button type="submit" className="send-button">
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="no-conversation-selected">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MessagingInterfacePage;
