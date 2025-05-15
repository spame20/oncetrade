import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAlbums } from '../../context/AlbumContext'; // To get album details
import { usePhotocards } from '../../context/PhotocardContext'; // Assuming a context for photocards
import PhotoCard from '../common/PhotoCard'; // Import the styled PhotoCard
import './AlbumViewPage.css'; // Import the new CSS file

const AlbumViewPage = () => {
  const { albumId } = useParams();
  const { getAlbumById } = useAlbums(); // Function to get a single album
  const { getPhotocardsByAlbum, loading: photocardsLoading, error: photocardsError } = usePhotocards(); 
  // Assumes getPhotocardsByAlbum might return photocards for that albumId
  // and PhotocardContext provides loading/error for photocards

  const [album, setAlbum] = useState(null);
  const [photocards, setPhotocards] = useState([]);
  const [loadingAlbum, setLoadingAlbum] = useState(true);

  useEffect(() => {
    const fetchAlbumData = async () => {
      setLoadingAlbum(true);
      try {
        const albumData = await getAlbumById(albumId); // This needs to be implemented in AlbumContext
        setAlbum(albumData);
      } catch (err) {
        console.error("Error fetching album details:", err);
        // Handle error for album fetching if needed
      }
      setLoadingAlbum(false);
    };

    if (albumId) {
      fetchAlbumData();
      // Fetch photocards for this album
      // This is a placeholder; you'll need to implement actual fetching logic
      const albumPhotocards = getPhotocardsByAlbum(albumId); // This function needs to exist in PhotocardContext
      setPhotocards(albumPhotocards || []);
    }
  }, [albumId, getAlbumById, getPhotocardsByAlbum]);

  // Helper to format date (can be moved to a utils file)
  const formatReleaseDate = (dateString) => {
    if (!dateString) return 'Unknown Release';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loadingAlbum || photocardsLoading) {
    return <p className="album-view-message">Loading album and photocards...</p>;
  }

  if (!album) {
    return <p className="album-view-message error">Album not found.</p>;
  }

  if (photocardsError) {
    return <p className="album-view-message error">Error loading photocards: {photocardsError.message || 'Unknown error'}</p>;
  }

  return (
    <main className="container album-view-page-main">
      <div className="album-header-info">
        <h2 className="album-view-title">{album.name}</h2>
        <p className="album-view-details">Released: {formatReleaseDate(album.release_date)}</p>
        <p className="album-view-details">Total Cards: {album.total_cards || 'N/A'}</p>
        {/* Add other album details here if needed */}
      </div>

      {/* Placeholder for future photocard filters/sorts within this album */}
      {/* <div className="photocard-controls"></div> */}

      {photocards.length > 0 ? (
        <div className="photocard-grid">
          {photocards.map(card => (
            // Assuming userStatus would be fetched or available from a context for each card
            // For now, passing undefined if not available
            <PhotoCard key={card._id} card={card} userStatus={card.userStatus} />
          ))}
        </div>
      ) : (
        <p className="album-view-message">No photocards found for this album yet.</p>
      )}
    </main>
  );
};

export default AlbumViewPage;
