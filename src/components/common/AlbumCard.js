import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AlbumCard.css'; // Import the new CSS file

const AlbumCard = ({ album, completionStatus }) => {
  const { isAuthenticated } = useAuth();
  
  const formatReleaseDate = (dateString) => {
    if (!dateString) return 'Unknown Release';
    const date = new Date(dateString);
    // Using a slightly more verbose but clear date format
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };
  
  const getCompletionPercentage = () => {
    if (!completionStatus || !isAuthenticated) return null; // Only show for authenticated users
    
    const { owned, total } = completionStatus;
    if (total === null || total === undefined || owned === null || owned === undefined) return 0;
    if (total === 0) return 0;
    return Math.round((owned / total) * 100);
  };
  
  const completionPercentage = getCompletionPercentage();

  return (
    <div className="album-card">
      <Link to={`/albums/${album._id}`}>
        <div className="album-img-container">
          <img 
            src={album.cover_image || 'https://via.placeholder.com/300x300?text=Album+Cover'} 
            alt={album.name} 
            className="album-img"
          />
          {isAuthenticated && completionPercentage !== null && (
            <div className="completion-indicator">
              <div 
                className="completion-bar" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
              <span className="completion-text">{completionPercentage}% Complete</span>
            </div>
          ) }
        </div>
        
        <div className="album-info">
          <h3 className="album-title">{album.name}</h3>
          <p className="album-date">{formatReleaseDate(album.release_date)}</p>
          {album.total_cards !== null && album.total_cards !== undefined && (
            <p className="album-cards-count">{album.total_cards} cards</p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default AlbumCard;
