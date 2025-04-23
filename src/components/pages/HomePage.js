import React from 'react';
import { Link } from 'react-router-dom';
import { useAlbums } from '../../context/AlbumContext';
import { useUser } from '../../context/UserContext';
import { useMessages } from '../../context/MessageContext';

const HomePage = () => {
  const { albums } = useAlbums();
  const { user } = useUser();
  const { messages } = useMessages();
  
  // Get featured albums (newest 3)
  const featuredAlbums = [...albums]
    .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
    .slice(0, 3);
  
  // Get most wanted cards (first 4 from wishlist)
  const mostWantedCards = user.wishlist.slice(0, 4);
  
  // Get recent messages (newest 3)
  const recentMessages = [...messages]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
  
  return (
    <main className="container">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to ONCEtrade</h1>
          <p>The ultimate platform for TWICE photocard collectors and traders</p>
          <div className="hero-buttons">
            <Link to="/albums" className="btn btn-primary">Browse Albums</Link>
            <Link to="/trades/new" className="btn btn-secondary">Start Trading</Link>
          </div>
        </div>
      </section>
      
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">Featured Albums</h2>
          <Link to="/albums" className="view-all">View All</Link>
        </div>
        
        <div className="album-grid">
          {featuredAlbums.map(album => (
            <div key={album._id} className="album-card">
              <Link to={`/albums/${album._id}`}>
                <img src={album.cover_image} alt={album.name} className="album-cover" />
                <div className="album-info">
                  <h3 className="album-title">{album.name}</h3>
                  <p className="album-date">{new Date(album.release_date).getFullYear()}</p>
                  <p className="album-cards">{album.total_cards} cards</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
      
      <div className="two-column-layout">
        <section className="wanted-section">
          <div className="section-header">
            <h2 className="section-title">Most Wanted</h2>
            <Link to="/wishlist" className="view-all">View Wishlist</Link>
          </div>
          
          <div className="wanted-cards">
            {mostWantedCards.map(card => (
              <div key={card._id} className="wanted-card">
                <img src={card.image} alt={`${card.member} from ${card.album}`} className="wanted-img" />
                <div className="wanted-info">
                  <h3 className="wanted-title">{card.member}</h3>
                  <p className="wanted-album">{card.album}</p>
                  <span className={`available-count ${card.available_trades > 0 ? 'available' : 'unavailable'}`}>
                    {card.available_trades > 0 
                      ? `${card.available_trades} available` 
                      : 'Not available'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="messages-section">
          <div className="section-header">
            <h2 className="section-title">Recent Messages</h2>
            <Link to="/messages" className="view-all">View All</Link>
          </div>
          
          <div className="recent-messages">
            {recentMessages.length > 0 ? (
              recentMessages.map((message, index) => (
                <div key={index} className="message-preview">
                  <div className="message-sender">
                    <img 
                      src={message.sender._id === 'user1' ? message.receiver.avatar : message.sender.avatar} 
                      alt="User avatar" 
                      className="sender-avatar" 
                    />
                    <div className="sender-info">
                      <span className="sender-name">
                        {message.sender._id === 'user1' ? 'You → ' + message.receiver.username : message.sender.username}
                      </span>
                      <span className="message-date">
                        {new Date(message.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="message-text">
                    {message.content.length > 50 
                      ? message.content.substring(0, 50) + '...' 
                      : message.content}
                  </p>
                  <Link 
                    to={`/messages/${message.sender._id === 'user1' ? message.receiver._id : message.sender._id}`} 
                    className="view-message"
                  >
                    View Conversation
                  </Link>
                </div>
              ))
            ) : (
              <div className="no-messages-home">
                <p>No messages yet.</p>
                <Link to="/messages" className="btn btn-secondary">Start Messaging</Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default HomePage;
