import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../context/UserContext';
import PhotoCard from '../common/PhotoCard'; // Import the PhotoCard component

// Mock data for wishlist cards - replace with actual API calls in a real app
const mockWishlistCards = [
  { _id: 'pc1', member_name: 'Jeongyeon', album_title: 'Formula of Love', image_url: 'https://via.placeholder.com/200x250?text=Jeongyeon+FOL', available_trades: 2 },
  { _id: 'pc2', member_name: 'Jihyo', album_title: 'Between 1&2', image_url: 'https://via.placeholder.com/200x250?text=Jihyo+B1&2', available_trades: 3 },
  { _id: 'pc3', member_name: 'Momo', album_title: 'Formula of Love', image_url: 'https://via.placeholder.com/200x250?text=Momo+FOL', available_trades: 0 },
  { _id: 'pc4', member_name: 'Tzuyu', album_title: 'Yes, I Am', image_url: 'https://via.placeholder.com/200x250?text=Tzuyu+YIA', available_trades: 1 },
];

const WishlistPage = ( ) => {
  const { user, isAuthenticated } = useUser();
  const [wishlistCards, setWishlistCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterAlbum, setFilterAlbum] = useState('All Albums');
  const [filterMember, setFilterMember] = useState('All Members');
  const [sortBy, setSortBy] = useState('Member (A-Z)');
  const [searchQuery, setSearchQuery] = useState('');
  const [userCardStatuses, setUserCardStatuses] = useState({});

  // Fetch wishlist cards - in a real app, this would be an API call
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setWishlistCards(mockWishlistCards);
      
      // Initialize userCardStatuses for all cards in the wishlist
      const initialStatuses = {};
      mockWishlistCards.forEach(card => {
        initialStatuses[card._id] = {
          status: 'wanted',
          quantity: 0,
          forTrade: false
        };
      });
      setUserCardStatuses(initialStatuses);
      
      setIsLoading(false);
    }, 500);
  }, []);

  // Handle card status changes (add/remove from collection, wishlist, etc.)
  const handleCardStatusChange = useCallback((cardId, newStatusInfo) => {
    if (!isAuthenticated) return;
    
    console.log('[WishlistPage] Updating status for card:', cardId, 'New status info:', newStatusInfo);
    
    setUserCardStatuses(prevStatuses => {
      const updatedStatuses = { ...prevStatuses };
      
      if (newStatusInfo === null) {
        // If status is null, remove from wishlist
        delete updatedStatuses[cardId];
        
        // Also remove from displayed wishlist cards
        setWishlistCards(prev => prev.filter(card => card._id !== cardId));
      } else {
        updatedStatuses[cardId] = {
          ...prevStatuses[cardId],
          ...newStatusInfo
        };
        
        // If status changed from 'wanted' to something else, remove from wishlist
        if (newStatusInfo.status && newStatusInfo.status !== 'wanted') {
          setWishlistCards(prev => prev.filter(card => card._id !== cardId));
        }
      }
      
      // TODO: API call to persist this change to the backend
      // e.g., updateUserWishlist(user._id, cardId, updatedStatuses[cardId]);
      
      return updatedStatuses;
    });
  }, [isAuthenticated]);

  // Get unique albums and members for filters
  const uniqueAlbums = ['All Albums', ...new Set(wishlistCards.map(card => card.album_title))];
  const uniqueMembers = ['All Members', ...new Set(wishlistCards.map(card => card.member_name))];

  // Filter and sort cards
  const filteredCards = wishlistCards.filter(card => {
    const matchesAlbum = filterAlbum === 'All Albums' || card.album_title === filterAlbum;
    const matchesMember = filterMember === 'All Members' || card.member_name === filterMember;
    const matchesSearch = !searchQuery || 
      card.member_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.album_title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAlbum && matchesMember && matchesSearch;
  });

  // Sort cards based on selected option
  const sortedCards = [...filteredCards].sort((a, b) => {
    switch (sortBy) {
      case 'Member (A-Z)':
        return a.member_name.localeCompare(b.member_name);
      case 'Member (Z-A)':
        return b.member_name.localeCompare(a.member_name);
      case 'Album (A-Z)':
        return a.album_title.localeCompare(b.album_title);
      case 'Album (Z-A)':
        return b.album_title.localeCompare(a.album_title);
      case 'Most Available':
        return (b.available_trades || 0) - (a.available_trades || 0);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return <main className="container"><p>Loading wishlist...</p></main>;
  }

  return (
    <main className="container wishlist-page">
      <div className="page-header">
        <h1 className="page-title">My Wishlist</h1>
        <div className="card-count">{filteredCards.length} cards</div>
      </div>

      <div className="filters-container">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="dropdown-filters">
          <select 
            value={filterAlbum} 
            onChange={(e) => setFilterAlbum(e.target.value)}
            className="filter-select"
          >
            {uniqueAlbums.map(album => (
              <option key={album} value={album}>{album}</option>
            ))}
          </select>

          <select 
            value={filterMember} 
            onChange={(e) => setFilterMember(e.target.value)}
            className="filter-select"
          >
            {uniqueMembers.map(member => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>

          <div className="sort-by">
            <span>Sort by: </span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="Member (A-Z)">Member (A-Z)</option>
              <option value="Member (Z-A)">Member (Z-A)</option>
              <option value="Album (A-Z)">Album (A-Z)</option>
              <option value="Album (Z-A)">Album (Z-A)</option>
              <option value="Most Available">Most Available for Trade</option>
            </select>
          </div>
        </div>
      </div>

      {sortedCards.length > 0 ? (
        <div className="card-grid">
          {sortedCards.map(card => (
            <PhotoCard
              key={card._id}
              card={card}
              userStatus={userCardStatuses[card._id]}
              onStatusChange={handleCardStatusChange}
            />
          ))}
        </div>
      ) : (
        <p className="no-cards-message">No cards in your wishlist match the current filters.</p>
      )}
    </main>
  );
};

export default WishlistPage;
