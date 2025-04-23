import React from 'react';
import { useParams } from 'react-router-dom';
import AlbumCard from '../common/AlbumCard';
import PhotoCard from '../common/PhotoCard';

const AlbumViewPage = () => {
  const { albumId } = useParams();
  
  // Mock album data
  const album = {
    _id: albumId || '1',
    name: 'Formula of Love',
    cover_image: 'https://via.placeholder.com/300x300',
    release_date: '2021-11-12',
    total_cards: 45,
    description: 'TWICE 3rd full album featuring the hit song "Scientist"'
  };
  
  // Mock cards data
  const cards = [
    {
      id: '1',
      member: 'Nayeon',
      album: album.name,
      image: 'https://via.placeholder.com/200x200',
      type: 'Regular'
    },
    {
      id: '2',
      member: 'Jeongyeon',
      album: album.name,
      image: 'https://via.placeholder.com/200x200',
      type: 'Regular'
    },
    {
      id: '3',
      member: 'Momo',
      album: album.name,
      image: 'https://via.placeholder.com/200x200',
      type: 'Regular'
    },
    {
      id: '4',
      member: 'Sana',
      album: album.name,
      image: 'https://via.placeholder.com/200x200',
      type: 'Regular'
    },
    {
      id: '5',
      member: 'Jihyo',
      album: album.name,
      image: 'https://via.placeholder.com/200x200',
      type: 'Regular'
    },
    {
      id: '6',
      member: 'Mina',
      album: album.name,
      image: 'https://via.placeholder.com/200x200',
      type: 'Regular'
    },
    {
      id: '7',
      member: 'Dahyun',
      album: album.name,
      image: 'https://via.placeholder.com/200x200',
      type: 'Regular'
    },
    {
      id: '8',
      member: 'Chaeyoung',
      album: album.name,
      image: 'https://via.placeholder.com/200x200',
      type: 'Regular'
    },
    {
      id: '9',
      member: 'Tzuyu',
      album: album.name,
      image: 'https://via.placeholder.com/200x200',
      type: 'Regular'
    }
  ];

  return (
    <main className="container">
      <div className="album-header">
        <div className="album-info">
          <img src={album.cover_image} alt={album.name} className="album-cover" />
          <div className="album-details">
            <h2 className="album-title">{album.name}</h2>
            <p className="album-date">Released: {new Date(album.release_date) .toLocaleDateString()}</p>
            <p className="album-cards-count">Total Cards: {album.total_cards}</p>
            <p className="album-description">{album.description}</p>
          </div>
        </div>
      </div>
      
      <h3 className="section-title">Photocards in this Album</h3>
      <div className="card-grid">
        {cards.map(card => (
          <PhotoCard 
            key={card.id} 
            card={card}
          />
        ))}
      </div>
    </main>
  );
};

export default AlbumViewPage;
