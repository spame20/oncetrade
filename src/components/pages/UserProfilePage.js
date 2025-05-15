import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext'; 
import { useRatings } from '../../context/RatingContext';
import { useTrades } from '../../context/TradeContext';
import PhotoCard from '../common/PhotoCard'; // Import the PhotoCard component

// Mock data for users - replace with actual data fetching in a real app
const mockUsers = [
  {
    _id: 'user1',
    username: 'TWICE_Fan',
    avatar: 'https://via.placeholder.com/150',
    join_date: '2025-01-15',
    collection: [
      { _id: 'userCard1', photocard_id: 'pc1', member: 'Nayeon', album: 'Formula of Love', image: 'https://via.placeholder.com/200x250?text=Nayeon+FOL', for_trade: true, quantity: 1 },
      { _id: 'userCard2', photocard_id: 'pc2', member: 'Jeongyeon', album: 'Formula of Love', image: 'https://via.placeholder.com/200x250?text=Jeongyeon+FOL', for_trade: false, quantity: 2 },
    ],
    wishlist: [
      { _id: 'wishItem1', photocard_id: 'pc3', member: 'Momo', album: 'Formula of Love', image: 'https://via.placeholder.com/200x250?text=Momo+FOL' },
    ],
  },
  {
    _id: 'u2',
    username: 'MomoLover',
    avatar: 'https://via.placeholder.com/150',
    join_date: '2025-02-10',
    collection: [
      { _id: 'pc3', photocard_id: 'pc3', member: 'Momo', album: 'Formula of Love', image: 'https://via.placeholder.com/100', for_trade: true },
      { _id: 'pc4', photocard_id: 'pc4', member: 'Sana', album: 'Between 1&2', image: 'https://via.placeholder.com/100', for_trade: true },
    ],
    wishlist: [],
  },
  {
    _id: 'u3',
    username: 'TwicyCollector',
    avatar: 'https://via.placeholder.com/150',
    join_date: '2025-03-01',
    collection: [],
    wishlist: [
        { _id: 'w2', photocard_id: 'pc9', member: 'Tzuyu', album: 'Yes, I Am', image: 'https://via.placeholder.com/100', available_trades: 1 },
    ],
  },
];

const UserProfilePage = ( ) => {
  const { userId } = useParams();
  const { user: loggedInUser } = useUser();
  const { trades } = useTrades();
  const { getRatingsForUser } = useRatings();

  const [profileUser, setProfileUser] = useState(null);
  const [activeTab, setActiveTab] = useState('collection');
  const [userRatings, setUserRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userCardStatuses, setUserCardStatuses] = useState({}); // For PhotoCard interactions

  useEffect(() => {
    setIsLoading(true);
    let userToDisplay = null;
    let currentMockUser = null;

    if (userId) {
      currentMockUser = mockUsers.find(u => u._id === userId);
      userToDisplay = currentMockUser;
    } else if (loggedInUser && loggedInUser._id) {
      currentMockUser = mockUsers.find(u => u._id === loggedInUser._id);
      userToDisplay = currentMockUser || loggedInUser; // Fallback to context user if not in mock
    } 

    setProfileUser(userToDisplay);

    if (userToDisplay && userToDisplay._id) {
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
            quantity: item.quantity || 1, // Assuming quantity might be in your data
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
    } else {
      setUserRatings([]);
      setAverageRating(0);
      setUserCardStatuses({});
    }
    setIsLoading(false);
  }, [userId, loggedInUser, getRatingsForUser]);

  const isOwnProfile = loggedInUser && profileUser && loggedInUser._id === profileUser._id;

  const userTrades = profileUser ? trades.filter(trade => 
    trade.initiatorId === profileUser._id || trade.receiverId === profileUser._id
  ) : [];

  const handleCardStatusChange = useCallback((cardId, newStatusInfo) => {
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
  }, [isOwnProfile]);

  if (isLoading) {
    return <main className="container"><p>Loading profile...</p></main>;
  }

  if (!profileUser) {
    return <main className="container"><p>User not found.</p></main>;
  }

  const renderCollection = () => (
    <div className="profile-collection">
      <h4>{isOwnProfile ? "My Collection" : `${profileUser.username}'s Collection`}</h4>
      {profileUser.collection && profileUser.collection.length > 0 ? (
        <div className="card-grid"> {/* Ensure .card-grid is styled for layout */}
          {profileUser.collection.map(item => {
            const cardDataForPhotoCard = {
              _id: item.photocard_id, // Use the actual photocard ID
              image_url: item.image,
              member_name: item.member,
              album_title: item.album,
              // Add any other fields PhotoCard might expect from the 'card' prop
            };
            return (
              <PhotoCard
                key={item._id} // Use the user's collection item ID for the key
                card={cardDataForPhotoCard}
                userStatus={userCardStatuses[item.photocard_id] || { status: 'owned', quantity: item.quantity || 1, forTrade: item.for_trade || false }}
                onStatusChange={isOwnProfile ? handleCardStatusChange : () => {}} // Only allow changes on own profile
              />
            );
          })}
        </div>
      ) : (
        <p>{isOwnProfile ? "You have" : "This user has"} no cards in their collection yet.</p>
      )}
    </div>
  );

  const renderWishlist = () => (
    <div className="profile-wishlist">
      <h4>{isOwnProfile ? "My Wishlist" : `${profileUser.username}'s Wishlist`}</h4>
      {profileUser.wishlist && profileUser.wishlist.length > 0 ? (
        <div className="card-grid"> {/* Ensure .card-grid is styled for layout */}
          {profileUser.wishlist.map(item => {
            const cardDataForPhotoCard = {
              _id: item.photocard_id, // Use the actual photocard ID
              image_url: item.image,
              member_name: item.member,
              album_title: item.album,
            };
            return (
              <PhotoCard
                key={item._id} // Use the wishlist item ID for the key
                card={cardDataForPhotoCard}
                userStatus={userCardStatuses[item.photocard_id] || { status: 'wanted', quantity: 0, forTrade: false }}
                onStatusChange={isOwnProfile ? handleCardStatusChange : () => {}} // Only allow changes on own profile
              />
            );
          })}
        </div>
      ) : (
        <p>{isOwnProfile ? "You have" : "This user has"} no cards in their wishlist yet.</p>
      )}
    </div>
  );

  const renderTrades = () => (
    <div className="profile-trades">
      <h4>{isOwnProfile ? "My Trade History" : `${profileUser.username}'s Trade History`}</h4>
      {userTrades.length > 0 ? (
        <div className="trades-list">
          {userTrades.map(trade => (
            <div key={trade._id} className={`trade-item status-${trade.status}`}>
              <div className="trade-header">
                 <p>Trade with: <strong>{trade.partner?.username || 'Unknown User'}</strong></p>
                 <span className={`status-badge status-${trade.status}`}>{trade.status?.replace('-', ' ')}</span>
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

  return (
    <main className="container user-profile-page">
      <div className="profile-header" style={{display: 'flex', alignItems: 'center', marginBottom: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
        <img src={profileUser.avatar} alt={profileUser.username} style={{width: '100px', height: '100px', borderRadius: '50%', marginRight: '20px'}} />
        <div className="profile-info">
          <h2 style={{fontSize: '24px', color: 'var(--primary)', marginBottom: '5px'}}>{profileUser.username}</h2>
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
      </div>

      <div className="profile-tab-content" style={{backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
        {activeTab === 'collection' && renderCollection()}
        {activeTab === 'wishlist' && renderWishlist()}
        {activeTab === 'trades' && renderTrades()}
        {activeTab === 'ratings' && renderRatings()}
      </div>
    </main>
  );
};

export default UserProfilePage;
