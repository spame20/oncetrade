import React, { useState, useEffect } from 'react';
// Removed Link as it's not directly used here, AlbumCard handles its own Link
import { useAlbums } from '../../context/AlbumContext'; // Assuming this context provides albums
import AlbumCard from '../common/AlbumCard'; // Import the styled AlbumCard
import './AlbumsListPage.css'; // Import the new CSS file

const AlbumsListPage = () => {
  const { albums, loading, error } = useAlbums(); // Assuming context provides loading/error states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name_asc');
  const [filteredAndSortedAlbums, setFilteredAndSortedAlbums] = useState([]);

  useEffect(() => {
    if (albums) {
      const processedAlbums = albums
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
      setFilteredAndSortedAlbums(processedAlbums);
    }
  }, [albums, searchTerm, sortOption]);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading albums...</p>;
  if (error) return <p style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Error loading albums: {error.message || 'Unknown error'}</p>;
  if (!albums || albums.length === 0) return <p style={{ textAlign: 'center', marginTop: '50px' }}>No albums found.</p>;

  return (
    <main className="container albums-list-page-main">
      <h2 className="section-title">All Albums</h2>
      
      <div className="albums-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="album-search"
            aria-label="Search albums"
          />
        </div>
        
        <div className="sort-box">
          <label htmlFor="sort-albums">Sort by:</label>
          <select 
            id="sort-albums"
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-select"
            aria-label="Sort albums by"
          >
            <option value="name_asc">Album Name (A-Z)</option>
            <option value="name_desc">Album Name (Z-A)</option>
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
          </select>
        </div>
      </div>
      
      {filteredAndSortedAlbums.length > 0 ? (
        <div className="album-grid">
          {filteredAndSortedAlbums.map(album => (
            // Assuming completionStatus would be fetched or calculated here or passed down
            // For now, passing undefined if not available from your AlbumContext
            <AlbumCard key={album._id} album={album} completionStatus={album.completionStatus} />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', marginTop: '30px' }}>No albums match your search criteria.</p>
      )}
    </main>
  );
};

export default AlbumsListPage;
