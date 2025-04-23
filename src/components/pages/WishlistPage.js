import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  // Mock wishlist data
  const [wishlist, setWishlist] = useState([
    {
      _id: '1',
      member: 'Nayeon',
      album: 'Formula of Love',
      image: 'https://via.placeholder.com/200x200',
      rarity: 'Regular',
      available_trades: 3
    },
    {
      _id: '2',
      member: 'Jeongyeon',
      album: 'Between 1&2',
      image: 'https://via.placeholder.com/200x200',
      rarity: 'Limited',
      available_trades: 1
    },
    {
      _id: '3',
      member: 'Momo',
      album: 'Yes, I Am',
      image: 'https://via.placeholder.com/200x200',
      rarity: 'Regular',
      available_trades: 5
    },
    {
      _id: '4',
      member: 'Sana',
      album: 'Dive',
      image: 'https://via.placeholder.com/200x200',
      rarity: 'Regular',
      available_trades: 2
    },
    {
      _id: '5',
      member: 'Jihyo',
      album: 'Formula of Love',
      image: 'https://via.placeholder.com/200x200',
      rarity: 'Limited',
      available_trades: 0
    },
    {
      _id: '6',
      member: 'Mina',
      album: 'Between 1&2',
      image: 'https://via.placeholder.com/200x200',
      rarity: 'Regular',
      available_trades: 4
    },
    {
      _id: '7',
      member: 'Dahyun',
      album: 'Yes, I Am',
      image: 'https://via.placeholder.com/200x200',
      rarity: 'Regular',
      available_trades: 2
    },
    {
      _id: '8',
      member: 'Chaeyoung',
      album: 'Dive',
      image: 'https://via.placeholder.com/200x200',
      rarity: 'Limited',
      available_trades: 1
    },
    {
      _id: '9',
      member: 'Tzuyu',
      album: 'Formula of Love',
      image: 'https://via.placeholder.com/200x200',
      rarity: 'Regular',
      available_trades: 3
    }
  ]) ;
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAlbum, setFilterAlbum] = useState('');
  const [filterMember, setFilterMember] = useState('');
  const [sortOption, setSortOption] = useState('member_asc');
  
  // Get unique albums and members for filters
  const albums = [...new Set(wishlist.map(card => card.album))];
  const members = [...new Set(wishlist.map(card => card.member))];
  
  // Filter and sort wishlist
  const filteredWishlist = wishlist
    .filter(card => {
      const matchesSearch = card.member.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           card.album.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAlbum = filterAlbum ? card.album === filterAlbum : true;
      const matchesMember = filterMember ? card.member === filterMember : true;
      return matchesSearch && matchesAlbum && matchesMember;
    })
    .sort((a, b) => {
      switch(sortOption) {
        case 'member_asc':
          return a.member.localeCompare(b.member);
        case 'member_desc':
          return b.member.localeCompare(a.member);
        case 'album_asc':
          return a.album.localeCompare(b.album);
        case 'album_desc':
          return b.album.localeCompare(a.album);
        case 'available_asc':
          return a.available_trades - b.available_trades;
        case 'available_desc':
          return b.available_trades - a.available_trades;
        default:
          return 0;
      }
    });
  
  // Remove card from wishlist
  const removeFromWishlist = (cardId) => {
    setWishlist(wishlist.filter(card => card._id !== cardId));
  };

  return (
    <main className="container">
      <div className="wishlist-header">
        <h2 className="section-title">My Wishlist</h2>
        <div className="wishlist-stats">
          <span className="wishlist-count">{wishlist.length} cards</span>
        </div>
      </div>
      
      <div className="wishlist-controls">
        <div className="search-filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="wishlist-search"
            />
          </div>
          
          <div className="filter-box">
            <select 
              value={filterAlbum} 
              onChange={(e) => setFilterAlbum(e.target.value)}
              className="filter-select"
            >
              <option value="">All Albums</option>
              {albums.map(album => (
                <option key={album} value={album}>{album}</option>
              ))}
            </select>
            
            <select 
              value={filterMember} 
              onChange={(e) => setFilterMember(e.target.value)}
              className="filter-select"
            >
              <option value="">All Members</option>
              {members.map(member => (
                <option key={member} value={member}>{member}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="sort-box">
          <label htmlFor="sort">Sort by:</label>
          <select 
            id="sort"
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-select"
          >
            <option value="member_asc">Member (A-Z)</option>
            <option value="member_desc">Member (Z-A)</option>
            <option value="album_asc">Album (A-Z)</option>
            <option value="album_desc">Album (Z-A)</option>
            <option value="available_desc">Most Available</option>
            <option value="available_asc">Least Available</option>
          </select>
        </div>
      </div>
      
      {filteredWishlist.length > 0 ? (
        <div className="card-grid">
          {filteredWishlist.map(card => (
            <div key={card._id} className="photocard card-wanted">
              <img src={card.image} alt={`${card.member} from ${card.album}`} className="card-img" />
              <div className="card-info">
                <h3 className="card-title">{card.member}</h3>
                <p className="card-album">{card.album}</p>
                <p className="card-rarity">{card.rarity}</p>
              </div>
              <div className="card-actions">
                <div className="available-trades">
                  <span className={`available-count ${card.available_trades > 0 ? 'available' : 'unavailable'}`}>
                    {card.available_trades > 0 
                      ? `${card.available_trades} available for trade` 
                      : 'Not available for trade'}
                  </span>
                </div>
                <div className="wishlist-actions">
                  {card.available_trades > 0 && (
                    <Link to="/trades/new" className="find-trade-btn">
                      Find Trade
                    </Link>
                  )}
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromWishlist(card._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-cards-message">
          <p>No cards found in your wishlist matching your filters.</p>
          {wishlist.length > 0 ? (
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setSearchTerm('');
                setFilterAlbum('');
                setFilterMember('');
              }}
            >
              Clear Filters
            </button>
          ) : (
            <Link to="/albums" className="btn btn-primary">Browse Albums</Link>
          )}
        </div>
      )}
    </main>
  );
};

export default WishlistPage;
