import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import PhotoCard from '../common/PhotoCard'; // Adjust path if necessary
// import albumService from '../../services/album.service'; // Example: if you fetch album data
// import photocardService from '../../services/photocard.service'; // Example: if you fetch photocards
// import userCardService from '../../services/usercard.service'; // Example: for managing user's card statuses
import './AlbumViewPage.css'; // Create this CSS file if you need specific styles

const AlbumViewPage = () => {
  const { albumId } = useParams();
  const [albumDetails, setAlbumDetails] = useState(null);
  const [photocards, setPhotocards] = useState([]);
  const [userCardStatuses, setUserCardStatuses] = useState({}); // Stores status like { cardId: { status, quantity, forTrade } }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate fetching album details and its photocards
  useEffect(() => {
    const fetchAlbumData = async () => {
      setLoading(true);
      try {
        // --- SIMULATED API CALLS --- 
        // In a real app, replace these with actual API calls
        // Example: const albumData = await albumService.getAlbumById(albumId);
        // Example: const cardsData = await photocardService.getPhotocardsByAlbum(albumId);
        
        // Simulated album details
        const fetchedAlbumDetails = {
          _id: albumId,
          name: `Sample Album ${albumId}`,
          cover_image: 'https://via.placeholder.com/300x300?text=Album+Cover',
          release_date: new Date( ).toISOString(),
          description: 'This is a sample album description.'
        };
        
        // Simulated photocards for this album
        const fetchedPhotocards = [
          { _id: 'card1', member_name: 'Nayeon', album_title: fetchedAlbumDetails.name, image_url: 'https://via.placeholder.com/200x250?text=Nayeon+Card1' },
          { _id: 'card2', member_name: 'Jeongyeon', album_title: fetchedAlbumDetails.name, image_url: 'https://via.placeholder.com/200x250?text=Jeongyeon+Card2' },
          { _id: 'card3', member_name: 'Momo', album_title: fetchedAlbumDetails.name, image_url: 'https://via.placeholder.com/200x250?text=Momo+Card3' },
          // Add more sample cards as needed
        ];
        
        setAlbumDetails(fetchedAlbumDetails );
        setPhotocards(fetchedPhotocards);

        // Simulate fetching user's statuses for these cards
        // Example: const statuses = await userCardService.getStatusesForCards(fetchedPhotocards.map(c => c._id));
        // setUserCardStatuses(statuses); // This would be an object like { card1_id: { status: 'owned', quantity: 2, forTrade: true }, card2_id: { status: 'wanted'} }
        // For now, initialize with empty statuses
        const initialStatuses = {};
        fetchedPhotocards.forEach(card => {
          // Example: Pre-populate if you have existing data
          // if (card._id === 'card1') initialStatuses[card._id] = { status: 'owned', quantity: 1, forTrade: false };
        });
        setUserCardStatuses(initialStatuses);

        setLoading(false);
      } catch (err) {
        setError('Failed to load album data.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchAlbumData();
  }, [albumId]);

  const handleCardStatusChange = useCallback((cardId, newStatusInfo) => {
    console.log('Updating status for card:', cardId, 'New status info:', newStatusInfo);
    setUserCardStatuses(prevStatuses => {
      const updatedStatuses = { ...prevStatuses };
      if (newStatusInfo === null) { // Clearing the status
        delete updatedStatuses[cardId];
      } else {
        updatedStatuses[cardId] = { 
          ...prevStatuses[cardId], // Preserve existing parts of status if any
          ...newStatusInfo 
        };
      }
      // In a real app, you would also make an API call here to save the change to the backend
      // Example: await userCardService.updateCardStatus(cardId, updatedStatuses[cardId]);
      return updatedStatuses;
    });
  }, []);

  if (loading) return <div className="loading-message">Loading album details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!albumDetails) return <div className="info-message">Album not found.</div>;

  return (
    <div className="album-view-page">
      <div className="album-header-details">
        <img src={albumDetails.cover_image} alt={albumDetails.name} className="album-cover-large" />
        <div className="album-meta">
          <h1>{albumDetails.name}</h1>
          <p>{new Date(albumDetails.release_date).toLocaleDateString()}</p>
          <p>{albumDetails.description}</p>
        </div>
      </div>

      <h2>Photocards in this Album</h2>
      {photocards.length > 0 ? (
        <div className="photocard-grid">
          {photocards.map(card => (
            <PhotoCard 
              key={card._id} 
              card={card} 
              userStatus={userCardStatuses[card._id] || { status: null, quantity: 0, forTrade: false }} // Pass current status or default
              onStatusChange={handleCardStatusChange} 
            />
          ))}
        </div>
      ) : (
        <p className="info-message">No photocards found for this album yet.</p>
      )}
    </div>
  );
};

export default AlbumViewPage;
