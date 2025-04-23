import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AlbumCard from '../common/AlbumCard';

const AlbumsListPage = () => {
  // Mock albums data - in a real app, this would come from an API
  const [albums, setAlbums] = useState([
    {
      _id: '1',
      name: 'Yes, I Am',
      cover_image: 'https://via.placeholder.com/300x300',
      release_date: '2023-04-28',
      total_cards: 36,
      description: 'TWICE 12th mini album featuring the title track "SET ME FREE"'
    },
    {
      _id: '2',
      name: 'Between 1&2',
      cover_image: 'https://via.placeholder.com/300x300',
      release_date: '2022-08-26',
      total_cards: 45,
      description: 'TWICE 11th mini album featuring the title track "Talk that Talk"'
    },
    {
      _id: '3',
      name: 'Formula of Love',
      cover_image: 'https://via.placeholder.com/300x300',
      release_date: '2021-11-12',
      total_cards: 45,
      description: 'TWICE 3rd full album featuring the hit song "Scientist"'
    },
    {
      _id: '4',
      name: 'Dive',
      cover_image: 'https://via.placeholder.com/300x300',
      release_date: '2024-01-26',
      total_cards: 40,
      description: 'TWICE 13th mini album featuring the title track "One Spark"'
    },
    {
      _id: '5',
      name: 'Taste of Love',
      cover_image: 'https://via.placeholder.com/300x300',
      release_date: '2021-06-11',
      total_cards: 30,
      description: 'TWICE 10th mini album featuring the title track "Alcohol-Free"'
    },
    {
      _id: '6',
      name: 'Eyes Wide Open',
      cover_image: 'https://via.placeholder.com/300x300',
      release_date: '2020-10-26',
      total_cards: 40,
      description: 'TWICE 2nd full album featuring the title track "I CAN\'T STOP ME"'
    },
    {
      _id: '7',
      name: 'More & More',
      cover_image: 'https://via.placeholder.com/300x300',
      release_date: '2020-06-01',
      total_cards: 30,
      description: 'TWICE 9th mini album featuring the title track "MORE & MORE"'
    },
    {
      _id: '8',
      name: 'Feel Special',
      cover_image: 'https://via.placeholder.com/300x300',
      release_date: '2019-09-23',
      total_cards: 27,
      description: 'TWICE 8th mini album featuring the title track "Feel Special"'
    }
  ]) ;

  // State for filtering and sorting
  const [sortOption, setSortOption] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter albums based on search term
  const filteredAlbums = albums.filter(album => 
    album.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort albums based on selected option
  const sortedAlbums = [...filteredAlbums].sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.release_date) - new Date(a.release_date);
    } else if (sortOption === 'oldest') {
      return new Date(a.release_date) - new Date(b.release_date);
    } else if (sortOption === 'name_asc') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'name_desc') {
      return b.name.localeCompare(a.name);
    } else if (sortOption === 'most_cards') {
      return b.total_cards - a.total_cards;
    } else {
      return 0;
    }
  });

  return (
    <main className="container">
      <div className="albums-header">
        <h2 className="section-title">TWICE Albums</h2>
        <div className="albums-controls">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search albums..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="album-search"
            />
          </div>
          <div className="sort-options">
            <label htmlFor="sort">Sort by:</label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="most_cards">Most Cards</option>
            </select>
          </div>
        </div>
      </div>

      {sortedAlbums.length > 0 ? (
        <div className="album-grid">
          {sortedAlbums.map(album => (
            <Link to={`/albums/${album._id}`} key={album._id} className="album-link">
              <div className="album-card">
                <img src={album.cover_image} alt={album.name} className="album-cover" />
                <div className="album-info">
                  <h3 className="album-title">{album.name}</h3>
                  <p className="album-date">{new Date(album.release_date).getFullYear()}</p>
                  <p className="album-cards">Cards: {album.total_cards}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="no-albums-message">
          <p>No albums found matching your search.</p>
        </div>
      )}
    </main>
  );
};

export default AlbumsListPage;
