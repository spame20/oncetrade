import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AlbumCard = ({ album, completionStatus }) => {
  const { isAuthenticated } = useAuth();
  
  // Format release date
  const formatReleaseDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  // Calculate completion percentage if provided
  const getCompletionPercentage = () => {
    if (!completionStatus) return null;
    
    const { owned, total } = completionStatus;
    if (!total) return 0;
    return Math.round((owned / total) * 100);
  };
  
  const completionPercentage = getCompletionPercentage();

  return (
    <div className="album-card">
      <Link to={`/albums/${album._id}`}>
        <img 
          src={album.cover_image || 'https://via.placeholder.com/300x300'} 
          alt={album.name} 
          className="album-img"
        />
        
        {/* Completion indicator for authenticated users */}
        {isAuthenticated && completionPercentage !== null && (
          <div className="completion-indicator">
            <div 
              className="completion-bar" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
            <span className="completion-text">{completionPercentage}%</span>
          </div>
        )}
        
        <div className="album-info">
          <h3 className="album-title">{album.name}</h3>
          <p className="album-date">{formatReleaseDate(album.release_date)}</p>
          {album.total_cards && (
            <p className="album-cards-count">{album.total_cards} cards</p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default AlbumCard;
