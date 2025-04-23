import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAlbums } from '../../context/AlbumContext';

const AlbumsListPage = () => {
  // Get albums data from context
  const { albums } = useAlbums();
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name_asc');
  
  // Filter and sort albums
  const filteredAlbums = albums
    .filter(album => 
      album.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch(sortOption) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'date_asc':
          return new Date(a.release_date) - new Date(b.release_date);
        case 'date_desc':
          return new Date(b.release_date) - new Date(a.release_date);
        default:
          return 0;
      }
    });

  return (
    <main className="container">
      <h2 className="section-title">All Albums</h2>
      
      <div className="albums-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="album-search"
          />
        </div>
        
        <div className="sort-box">
          <label htmlFor="sort">Sort by:</label>
          <select 
            id="sort"
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-select"
          >
            <option value="name_asc">Album Name (A-Z)</option>
            <option value="name_desc">Album Name (Z-A)</option>
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
          </select>
        </div>
      </div>
      
      <div className="album-grid">
        {filteredAlbums.map(album => (
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
    </main>
  );
};

export default AlbumsListPage;
