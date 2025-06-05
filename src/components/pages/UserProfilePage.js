import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext'; // Provides current logged-in user
import { useRatings } from '../../context/RatingContext';
import { useTrades } from '../../context/TradeContext';
import { useAuth } from '../../context/AuthContext';
import PhotoCard from '../common/PhotoCard'; // Import the PhotoCard component
import EditProfileForm from '../common/EditProfileForm';
import SortFilterBar from '../common/SortFilterBar'; // Import the new SortFilterBar component

// Mock data for users - replace with actual data fetching in a real app
const mockUsers = [
  {
    _id: 'user1',
    username: 'TWICE_Fan',
    email: 'test@example.com',
    avatar: 'https://via.placeholder.com/150',
    join_date: '2025-01-15',
    bio: 'TWICE fan since 2016. Collecting photocards from all eras!',
    collection: [
      { _id: 'userCard1', photocard_id: 'pc1', member: 'Nayeon', album: 'Formula of Love', image: 'https://via.placeholder.com/200x250?text=Nayeon+FOL', for_trade: true, quantity: 1 },
      { _id: 'userCard2', photocard_id: 'pc2', member: 'Jeongyeon', album: 'Formula of Love', image: 'https://via.placeholder.com/200x250?text=Jeongyeon+FOL', for_trade: false, quantity: 2 },
      { _id: 'userCard3', photocard_id: 'pc5', member: 'Mina', album: 'Between 1&2', image: 'https://via.placeholder.com/200x250?text=Mina+B1&2', for_trade: true, quantity: 1 },
      { _id: 'userCard4', photocard_id: 'pc6', member: 'Dahyun', album: 'Eyes Wide Open', image: 'https://via.placeholder.com/200x250?text=Dahyun+EWO', for_trade: false, quantity: 1 },
      { _id: 'userCard5', photocard_id: 'pc7', member: 'Tzuyu', album: 'Taste of Love', image: 'https://via.placeholder.com/200x250?text=Tzuyu+TOL', for_trade: true, quantity: 3 },
    ],
    wishlist: [
      { _id: 'wishItem1', photocard_id: 'pc3', member: 'Momo', album: 'Formula of Love', image: 'https://via.placeholder.com/200x250?text=Momo+FOL' },
      { _id: 'wishItem2', photocard_id: 'pc8', member: 'Sana', album: 'Taste of Love', image: 'https://via.placeholder.com/200x250?text=Sana+TOL' },
    ],
  },
  {
    _id: 'u2',
    username: 'MomoLover',
    email: 'momo@example.com',
    avatar: 'https://via.placeholder.com/150',
    join_date: '2025-02-10',
    bio: 'Momo is the best dancer!',
    collection: [
      { _id: 'pc3', photocard_id: 'pc3', member: 'Momo', album: 'Formula of Love', image: 'https://via.placeholder.com/100', for_trade: true },
      { _id: 'pc4', photocard_id: 'pc4', member: 'Sana', album: 'Between 1&2', image: 'https://via.placeholder.com/100', for_trade: true },
    ],
    wishlist: [],
  },
  {
    _id: 'u3',
    username: 'TwicyCollector',
    email: 'twicy@example.com',
    avatar: 'https://via.placeholder.com/150',
    join_date: '2025-03-01',
    bio: '',
    collection: [],
    wishlist: [
        { _id: 'w2', photocard_id: 'pc9', member: 'Tzuyu', album: 'Yes, I Am', image: 'https://via.placeholder.com/100', available_trades: 1 },
    ],
  },
];

const UserProfilePage = ( ) => {
  const { userId } = useParams(); // Get userId from URL params (e.g., /profile/u2)
  const { user: loggedInUser, toggleForTrade } = useUser(); // Get the currently logged-in user and collection functions
  const { trades } = useTrades();
  const { getRatingsForUser } = useRatings();
  const { currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [activeTab, setActiveTab] = useState('collection');
  const [userRatings, setUserRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const fileInputRef = useRef(null);
  const [userCardStatuses, setUserCardStatuses] = useState({});
  
  // New state for sorting and filtering
  const [sortOption, setSortOption] = useState('member-asc');
  const [filterMember, setFilterMember] = useState('');
  const [filterAlbum, setFilterAlbum] = useState('');
  const [tradeFilterOption, setTradeFilterOption] = useState('');
  const [availableMembers, setAvailableMembers] = useState([]);
  const [availableAlbums, setAvailableAlbums] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    let userToDisplay = null;

    if (userId) {
      // Viewing a specific user's profile via URL (e.g., /profile/u2)
      console.log(`[UserProfilePage] Attempting to display profile for userId from URL: ${userId}`);
      userToDisplay = mockUsers.find(u => u._id === userId);
      if (!userToDisplay) {
        console.warn(`[UserProfilePage] User with ID ${userId} not found in mockUsers.`);
      }
    } else if (loggedInUser && loggedInUser._id) {
      // No userId in URL, so display the logged-in user's profile
      // This is typically for routes like /profile or when clicking "My Collection"
      console.log(`[UserProfilePage] No userId in URL. Displaying logged-in user: ${loggedInUser.username} (ID: ${loggedInUser._id})`);
      userToDisplay = mockUsers.find(u => u._id === loggedInUser._id);
      if (!userToDisplay) {
         console.warn(`[UserProfilePage] Logged-in user (ID: ${loggedInUser._id}) from context not found in mockUsers. Using context user directly.`);
         userToDisplay = loggedInUser; 
      }
    } else if (currentUser && currentUser._id) {
      // Fallback to AuthContext if UserContext is not available
      userToDisplay = mockUsers.find(u => u._id === currentUser._id) || currentUser;
    } else {
      console.log("[UserProfilePage] No userId in URL and no loggedInUser in context.");
    }

    setProfileUser(userToDisplay);

    if (userToDisplay && userToDisplay._id) {
      console.log(`[UserProfilePage] Profile user set to: ${userToDisplay.username}. Fetching ratings.`);
      const ratings = getRatingsForUser(userToDisplay._id);
      setUserRatings(ratings);
      if (ratings.length > 0) {
        const totalStars = ratings.reduce((sum, rating) => sum + rating.stars, 0);
        setAverageRating(totalStars / ratings.length);
      } else {
        setAverageRating(0);
      }
      
      // Initialize userCardStatuses from the profileUser's collection and wishlist
      const initialStatuses = {};
      if (userToDisplay.collection) {
        userToDisplay.collection.forEach(item => {
          initialStatuses[item.photocard_id] = {
            status: 'owned',
            quantity: item.quantity || 1,
            forTrade: item.for_trade || false,
          };
        });
      }
      if (userToDisplay.wishlist) {
        userToDisplay.wishlist.forEach(item => {
          // Avoid overwriting if a card is somehow in collection AND wishlist (owned takes precedence)
          if (!initialStatuses[item.photocard_id]) {
            initialStatuses[item.photocard_id] = {
              status: 'wanted',
              quantity: 0,
              forTrade: false,
            };
          }
        });
      }
      setUserCardStatuses(initialStatuses);
      
      // Extract available members and albums for filtering
      if (userToDisplay.collection && userToDisplay.collection.length > 0) {
        const members = [...new Set(userToDisplay.collection.map(item => item.member))].sort();
        const albums = [...new Set(userToDisplay.collection.map(item => item.album))].sort();
        setAvailableMembers(members);
        setAvailableAlbums(albums);
      } else {
        setAvailableMembers([]);
        setAvailableAlbums([]);
      }
    } else {
      console.log("[UserProfilePage] No profileUser to display or fetch ratings for.");
      setUserRatings([]);
      setAverageRating(0);
    }
    setIsLoading(false);
  }, [userId, loggedInUser, getRatingsForUser, currentUser]);

  const isOwnProfile = (loggedInUser && profileUser && loggedInUser._id === profileUser._id) || 
                       (currentUser && profileUser && currentUser._id === profileUser._id);

  const userTrades = profileUser ? trades.filter(trade => 
    trade.initiatorId === profileUser._id || trade.receiverId === profileUser._id
  ) : [];

  // Handle card status change (for PhotoCard interactions)
  const handleCardStatusChange = (cardId, newStatusInfo) => {
    if (!isOwnProfile) {
      console.log("Cannot change status on another user's profile.");
      return;
    }
    console.log('[UserProfilePage] Updating status for card:', cardId, 'New status info:', newStatusInfo);
    setUserCardStatuses(prevStatuses => {
      const updatedStatuses = { ...prevStatuses };
      if (newStatusInfo === null) { 
        delete updatedStatuses[cardId];
      } else {
        updatedStatuses[cardId] = { 
          ...prevStatuses[cardId],
          ...newStatusInfo 
        };
      }
      // TODO: API call to persist this change to the backend for the loggedInUser
      // e.g., updateUserCollection(loggedInUser._id, cardId, updatedStatuses[cardId]);
      console.log("[UserProfilePage] New statuses:", updatedStatuses);
      return updatedStatuses;
    });
  };

  // Profile picture upload functions
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image size should be less than 2MB');
      return;
    }

    setUploadError('');
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    if (isOwnProfile) {
      setShowUploadModal(true);
    }
  };

  const handleCancelUpload = () => {
    setShowUploadModal(false);
    setPreviewImage(null);
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveUpload = () => {
    if (!previewImage) {
      setUploadError('Please select an image to upload');
      return;
    }

    // In a real app, you would upload the image to your server here
    // For now, we'll just update the mock user's avatar
    const updatedUser = { ...profileUser, avatar: previewImage };
    setProfileUser(updatedUser);
    
    // Update the mock data (this would be an API call in a real app)
    const userIndex = mockUsers.findIndex(u => u._id === profileUser._id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = updatedUser;
    }

    // Close the modal and reset
    setShowUploadModal(false);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Profile editing functions
  const handleEditClick = () => {
    if (isOwnProfile) {
      setShowEditForm(true);
    }
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
  };

  const handleSaveEdit = (updatedUser) => {
    // Update the profile user with the edited information
    setProfileUser({ ...profileUser, ...updatedUser });
    
    // Update the mock data (this would be an API call in a real app)
    const userIndex = mockUsers.findIndex(u => u._id === profileUser._id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updatedUser };
    }
    
    // Close the edit form
    setShowEditForm(false);
  };

  // Apply sorting and filtering to collection items
  const getSortedAndFilteredCollection = () => {
    if (!profileUser || !profileUser.collection) return [];
    
    let filteredCollection = [...profileUser.collection];
    
    // Apply member filter
    if (filterMember) {
      filteredCollection = filteredCollection.filter(item => item.member === filterMember);
    }
    
    // Apply album filter
    if (filterAlbum) {
      filteredCollection = filteredCollection.filter(item => item.album === filterAlbum);
    }
    
    // Apply trade status filter
    if (tradeFilterOption === 'for-trade') {
      filteredCollection = filteredCollection.filter(item => item.for_trade === true);
    } else if (tradeFilterOption === 'not-for-trade') {
      filteredCollection = filteredCollection.filter(item => item.for_trade === false);
    }
    
    // Apply sorting
    filteredCollection.sort((a, b) => {
      switch (sortOption) {
        case 'member-asc':
          return a.member.localeCompare(b.member);
        case 'member-desc':
          return b.member.localeCompare(a.member);
        case 'album-asc':
          return a.album.localeCompare(b.album);
        case 'album-desc':
          return b.album.localeCompare(a.album);
        case 'trade-status':
          return (b.for_trade === true) - (a.for_trade === true);
        case 'quantity':
          return (b.quantity || 1) - (a.quantity || 1);
        default:
          return 0;
      }
    });
    
    return filteredCollection;
  };

  // Apply sorting and filtering to wishlist items
  const getSortedAndFilteredWishlist = () => {
    if (!profileUser || !profileUser.wishlist) return [];
    
    let filteredWishlist = [...profileUser.wishlist];
    
    // Apply member filter
    if (filterMember) {
      filteredWishlist = filteredWishlist.filter(item => item.member === filterMember);
    }
    
    // Apply album filter
    if (filterAlbum) {
      filteredWishlist = filteredWishlist.filter(item => item.album === filterAlbum);
    }
    
    // Apply sorting
    filteredWishlist.sort((a, b) => {
      switch (sortOption) {
        case 'member-asc':
          return a.member.localeCompare(b.member);
        case 'member-desc':
          return b.member.localeCompare(a.member);
        case 'album-asc':
          return a.album.localeCompare(b.album);
        case 'album-desc':
          return b.album.localeCompare(a.album);
        default:
          return 0;
      }
    });
    
    return filteredWishlist;
  };

  if (isLoading) {
    return <main className="container"><p>Loading profile...</p></main>;
  }

  if (!profileUser) {
    return <main className="container"><p>User not found.</p></main>;
  }

  const handleToggleForTrade = (cardId) => {
    if (isOwnProfile) {
      toggleForTrade(cardId);
    } else {
      console.log("[UserProfilePage] Cannot toggle trade status on another user's profile.");
    }
  };

  const renderCollection = () => {
    const sortedAndFilteredCollection = getSortedAndFilteredCollection();
    
    return (
      <div className="profile-collection">
        <h4>{isOwnProfile ? "My Collection" : `${profileUser.username}'s Collection`}</h4>
        
        {profileUser.collection && profileUser.collection.length > 0 ? (
          <>
            <SortFilterBar 
              sortOption={sortOption}
              setSortOption={setSortOption}
              filterMember={filterMember}
              setFilterMember={setFilterMember}
              filterAlbum={filterAlbum}
              setFilterAlbum={setFilterAlbum}
              availableMembers={availableMembers}
              availableAlbums={availableAlbums}
              showTradeFilter={true}
              tradeFilterOption={tradeFilterOption}
              setTradeFilterOption={setTradeFilterOption}
            />
            
            {sortedAndFilteredCollection.length > 0 ? (
              <div className="card-grid">
                {sortedAndFilteredCollection.map(item => {
                  const cardDataForPhotoCard = {
                    _id: item.photocard_id,
                    image_url: item.image,
                    member_name: item.member,
                    album_title: item.album,
                  };
                  return (
                    <PhotoCard
                      key={item._id}
                      card={cardDataForPhotoCard}
                      userStatus={userCardStatuses[item.photocard_id] || { status: 'owned', quantity: item.quantity || 1, forTrade: item.for_trade || false }}
                      onStatusChange={isOwnProfile ? handleCardStatusChange : () => {}}
                    />
                  );
                })}
              </div>
            ) : (
              <p>No cards match your current filters.</p>
            )}
          </>
        ) : (
          <p>{isOwnProfile ? "You have" : "This user has"} no cards in their collection yet.</p>
        )}
      </div>
    );
  };

  const renderWishlist = () => {
    const sortedAndFilteredWishlist = getSortedAndFilteredWishlist();
    
    return (
      <div className="profile-wishlist">
        <h4>{isOwnProfile ? "My Wishlist" : `${profileUser.username}'s Wishlist`}</h4>
        
        {profileUser.wishlist && profileUser.wishlist.length > 0 ? (
          <>
            <SortFilterBar 
              sortOption={sortOption}
              setSortOption={setSortOption}
              filterMember={filterMember}
              setFilterMember={setFilterMember}
              filterAlbum={filterAlbum}
              setFilterAlbum={setFilterAlbum}
              availableMembers={availableMembers}
              availableAlbums={availableAlbums}
              showTradeFilter={false}
            />
            
            {sortedAndFilteredWishlist.length > 0 ? (
              <div className="card-grid">
                {sortedAndFilteredWishlist.map(item => {
                  const cardDataForPhotoCard = {
                    _id: item.photocard_id,
                    image_url: item.image,
                    member_name: item.member,
                    album_title: item.album,
                  };
                  return (
                    <PhotoCard
                      key={item._id}
                      card={cardDataForPhotoCard}
                      userStatus={userCardStatuses[item.photocard_id] || { status: 'wanted', quantity: 0, forTrade: false }}
                      onStatusChange={isOwnProfile ? handleCardStatusChange : () => {}}
                    />
                  );
                })}
              </div>
            ) : (
              <p>No cards match your current filters.</p>
            )}
          </>
        ) : (
          <p>{isOwnProfile ? "You have" : "This user has"} no cards in their wishlist yet.</p>
        )}
      </div>
    );
  };

  const renderTrades = () => (
    <div className="profile-trades">
      <h4>{isOwnProfile ? "My Trade History" : `${profileUser.username}'s Trade History`}</h4>
      {userTrades.length > 0 ? (
        <div className="trades-list">
          {userTrades.map(trade => (
            <div key={trade._id} className={`trade-item status-${trade.status}`}>
              <div className="trade-header">
                 <p>Trade with: <strong>{trade.partner.username}</strong></p>
                 <span className={`status-badge status-${trade.status}`}>{trade.status.replace('-', ' ')}</span>
              </div>
              <p>Date: {new Date(trade.date).toLocaleDateString()}</p>
              <Link to={`/trades/${trade._id}`} className="btn btn-secondary btn-sm">View Details</Link>
            </div>
          ))}
        </div>
      ) : (
        <p>{isOwnProfile ? "You have" : "This user has"} no trades yet.</p>
      )}
    </div>
  );

  const renderRatings = () => (
    <div className="profile-ratings">
      <h4>Ratings for {profileUser.username}</h4>
      {userRatings.length > 0 ? (
        <>
          <div className="average-rating" style={{marginBottom: '15px', fontWeight: 'bold'}}>
            Average Rating: {averageRating.toFixed(1)} ★ ({userRatings.length} reviews)
          </div>
          <div className="ratings-display-list">
            {userRatings.map(rating => (
              <div key={rating.ratingId} className="rating-item-display" style={{border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '5px'}}>
                <div className="rating-header-display" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px'}}>
                  <span className="rating-stars-display">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className={star <= rating.stars ? 'star selected' : 'star'} style={{color: star <= rating.stars ? 'gold' : '#ccc', fontSize: '1.2em'}}>★</span>
                    ))}
                  </span>
                  <span className="rating-rater" style={{fontSize: '0.9em', color: '#555'}}>By: UserID {rating.raterUserId}</span>
                  <span className="rating-date-display" style={{fontSize: '0.9em', color: '#555'}}>{new Date(rating.timestamp).toLocaleDateString()}</span>
                </div>
                {rating.comment && <p className="rating-comment-text" style={{fontSize: '0.95em', color: '#333'}}>{rating.comment}</p>}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="no-ratings-message">This user has not received any ratings yet.</p>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="profile-settings">
      <h4>Profile Settings</h4>
      {showEditForm ? (
        <EditProfileForm 
          user={profileUser}
          onCancel={handleCancelEdit}
          onSave={handleSaveEdit}
        />
      ) : (
        <div className="profile-details">
          <div className="profile-detail-item">
            <strong>Username:</strong> {profileUser.username}
          </div>
          <div className="profile-detail-item">
            <strong>Email:</strong> {profileUser.email || 'Not provided'}
          </div>
          <div className="profile-detail-item">
            <strong>Bio:</strong> {profileUser.bio || 'No bio provided'}
          </div>
          <div className="profile-detail-item">
            <strong>Joined:</strong> {new Date(profileUser.join_date || Date.now()).toLocaleDateString()}
          </div>
          <button 
            onClick={handleEditClick}
            className="btn btn-primary"
            style={{marginTop: '15px'}}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );

  return (
    <main className="container user-profile-page">
      <div className="profile-header" style={{display: 'flex', alignItems: 'center', marginBottom: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
        <div className="profile-avatar-container" style={{position: 'relative', marginRight: '20px'}}>
          <img 
            src={profileUser.avatar} 
            alt={profileUser.username} 
            style={{
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              objectFit: 'cover'
            }} 
          />
          {isOwnProfile && (
            <button 
              onClick={handleUploadClick}
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                backgroundColor: 'var(--color-accent)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '16px'
              }}
              title="Change profile picture"
            >
              +
            </button>
          )}
        </div>
        <div className="profile-info">
          <h2 style={{fontSize: '24px', color: 'var(--primary)', marginBottom: '5px'}}>{profileUser.username}</h2>
          {profileUser.bio && (
            <p style={{fontSize: '14px', color: '#333', marginBottom: '10px'}}>{profileUser.bio}</p>
          )}
          <p style={{fontSize: '14px', color: '#666', marginBottom: '10px'}}>Joined: {new Date(profileUser.join_date || Date.now()).toLocaleDateString()}</p>
          {userRatings.length > 0 && (
            <div className="profile-average-rating" style={{fontSize: '16px', fontWeight: 'bold'}}>
              Average Rating: {averageRating.toFixed(1)} ★ <span style={{fontSize: '0.8em', fontWeight: 'normal'}}>({userRatings.length} reviews)</span>
            </div>
          )}
        </div>
      </div>

      <div className="profile-tabs" style={{display: 'flex', marginBottom: '20px', borderBottom: '1px solid var(--border)'}}>
        <button 
          className={`tab-button ${activeTab === 'collection' ? 'active' : ''}`}
          onClick={() => setActiveTab('collection')}
          style={{padding: '10px 20px', background: activeTab === 'collection' ? 'var(--primary)' : 'transparent', color: activeTab === 'collection' ? 'white' : 'var(--text)', border: 'none', cursor: 'pointer', fontWeight: 'bold'}}
        >
          Collection ({profileUser.collection?.length || 0})
        </button>
        <button 
          className={`tab-button ${activeTab === 'wishlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('wishlist')}
          style={{padding: '10px 20px', background: activeTab === 'wishlist' ? 'var(--primary)' : 'transparent', color: activeTab === 'wishlist' ? 'white' : 'var(--text)', border: 'none', cursor: 'pointer', fontWeight: 'bold'}}
        >
          Wishlist ({profileUser.wishlist?.length || 0})
        </button>
        <button 
          className={`tab-button ${activeTab === 'trades' ? 'active' : ''}`}
          onClick={() => setActiveTab('trades')}
          style={{padding: '10px 20px', background: activeTab === 'trades' ? 'var(--primary)' : 'transparent', color: activeTab === 'trades' ? 'white' : 'var(--text)', border: 'none', cursor: 'pointer', fontWeight: 'bold'}}
        >
          Trades ({userTrades.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'ratings' ? 'active' : ''}`}
          onClick={() => setActiveTab('ratings')}
          style={{padding: '10px 20px', background: activeTab === 'ratings' ? 'var(--primary)' : 'transparent', color: activeTab === 'ratings' ? 'white' : 'var(--text)', border: 'none', cursor: 'pointer', fontWeight: 'bold'}}
        >
          Ratings ({userRatings.length})
        </button>
        {isOwnProfile && (
          <button 
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            style={{padding: '10px 20px', background: activeTab === 'settings' ? 'var(--primary)' : 'transparent', color: activeTab === 'settings' ? 'white' : 'var(--text)', border: 'none', cursor: 'pointer', fontWeight: 'bold'}}
          >
            Settings
          </button>
        )}
      </div>

      <div className="profile-tab-content" style={{backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
        {activeTab === 'collection' && renderCollection()}
        {activeTab === 'wishlist' && renderWishlist()}
        {activeTab === 'trades' && renderTrades()}
        {activeTab === 'ratings' && renderRatings()}
        {activeTab === 'settings' && renderSettings()}
      </div>

      {/* Profile Picture Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{marginTop: 0}}>Update Profile Picture</h3>
            
            {uploadError && (
              <div className="error-message" style={{
                color: 'red',
                marginBottom: '15px',
                padding: '10px',
                backgroundColor: '#ffeeee',
                borderRadius: '5px'
              }}>
                {uploadError}
              </div>
            )}
            
            <div className="upload-preview" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    marginBottom: '15px'
                  }}
                />
              ) : (
                <div style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '15px'
                }}>
                  <span style={{fontSize: '40px', color: '#aaa'}}>+</span>
                </div>
              )}
              
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{marginBottom: '15px'}}
              />
              <p style={{fontSize: '0.8em', color: '#666', textAlign: 'center'}}>
                Select an image file (JPEG, PNG, or GIF) less than 2MB in size.
              </p>
            </div>
            
            <div className="modal-actions" style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px'
            }}>
              <button 
                onClick={handleCancelUpload}
                style={{
                  padding: '8px 15px',
                  backgroundColor: '#f0f0f0',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveUpload}
                style={{
                  padding: '8px 15px',
                  backgroundColor: 'var(--color-accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default UserProfilePage;
