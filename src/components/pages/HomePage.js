import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  // Mock data for featured albums
  const featuredAlbums = [
    {
      id: 1,
      title: 'Yes, I Am',
      year: '2023',
      image: 'https://via.placeholder.com/200x200'
    },
    {
      id: 2,
      title: 'Between 1&2',
      year: '2022',
      image: 'https://via.placeholder.com/200x200'
    },
    {
      id: 3,
      title: 'Formula of Love',
      year: '2021',
      image: 'https://via.placeholder.com/200x200'
    },
    {
      id: 4,
      title: 'Dive',
      year: '2024',
      image: 'https://via.placeholder.com/200x200'
    }
  ];

  // Mock data for most wanted cards
  const wantedCards = [
    {
      id: 1,
      member: 'Nayeon',
      album: 'Yes, I Am',
      image: 'https://via.placeholder.com/200x200',
      status: 'owned',
      quantity: 2
    },
    {
      id: 2,
      member: 'Jeongyeon',
      album: 'Yes, I Am',
      image: 'https://via.placeholder.com/200x200',
      status: 'wanted'
    },
    {
      id: 3,
      member: 'Momo',
      album: 'Yes, I Am',
      image: 'https://via.placeholder.com/200x200',
      status: 'not-interested'
    },
    {
      id: 4,
      member: 'Sana',
      album: 'Yes, I Am',
      image: 'https://via.placeholder.com/200x200',
      status: 'owned'
    }
  ];

  // Mock data for recent trades
  const recentTrades = [
    {
      id: 1,
      user1: 'User1',
      card1: 'Nayeon (Yes, I Am) ',
      user2: 'User2',
      card2: 'Jihyo (Formula of Love)'
    },
    {
      id: 2,
      user1: 'User3',
      card1: 'Tzuyu (Between 1&2)',
      user2: 'User4',
      card2: 'Mina (Dive)'
    },
    {
      id: 3,
      user1: 'User5',
      card1: 'Dahyun (Dive)',
      user2: 'User6',
      card2: 'Chaeyoung (Yes, I Am)'
    }
  ];

  return (
    <main className="container">
      <section>
        <h2 className="section-title">Featured Albums</h2>
        <div className="album-grid">
          {featuredAlbums.map(album => (
            <div key={album.id} className="album-card">
              <img src={album.image} alt={`${album.title} Album`} className="album-img" />
              <div className="album-info">
                <h3 className="album-title">{album.title}</h3>
                <p className="album-date">{album.year}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section>
        <h2 className="section-title">Most Wanted Cards</h2>
        <div className="card-grid">
          {wantedCards.map(card => (
            <div key={card.id} className={`photocard card-${card.status}`}>
              <img src={card.image} alt={`${card.member} Card`} className="card-img" />
              {card.status === 'owned' && (
                <div className="status-icon owned-icon">✓</div>
              )}
              {card.status === 'wanted' && (
                <div className="status-icon wanted-icon">★</div>
              )}
              {card.quantity > 1 && (
                <div className="quantity-badge">x{card.quantity}</div>
              )}
              <div className="card-info">
                <h3 className="card-title">{card.member}</h3>
                <p className="card-album">{card.album}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section>
        <h2 className="section-title">Recent Trades</h2>
        <div className="trades-list">
          {recentTrades.map(trade => (
            <div key={trade.id} className="trade-item">
              <p>{trade.user1} traded {trade.card1} with {trade.user2} for {trade.card2}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
