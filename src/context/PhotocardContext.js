import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const PhotocardContext = createContext();

// Create a provider component
export const PhotocardProvider = ({ children }) => {
  // Mock photocards data
  const [photocards, setPhotocards] = useState([
    {
      _id: 'pc1',
      member_name: 'Nayeon', // Changed 'member' to 'member_name' for consistency with PhotoCard.js
      album_id: '1',
      album_title: 'Formula of Love', // Changed 'album' to 'album_title'
      image_url: 'https://via.placeholder.com/200x250?text=Nayeon+FoL', // Changed 'image' to 'image_url'
      type: 'Regular' // Changed 'rarity' to 'type'
    },
    {
      _id: 'pc2',
      member_name: 'Jeongyeon',
      album_id: '1',
      album_title: 'Formula of Love',
      image_url: 'https://via.placeholder.com/200x250?text=Jeongyeon+FoL',
      type: 'Regular'
    },
    {
      _id: 'pc3',
      member_name: 'Momo',
      album_id: '1',
      album_title: 'Formula of Love',
      image_url: 'https://via.placeholder.com/200x250?text=Momo+FoL',
      type: 'Limited'
    },
    {
      _id: 'pc4',
      member_name: 'Sana',
      album_id: '2',
      album_title: 'Between 1&2',
      image_url: 'https://via.placeholder.com/200x250?text=Sana+B1&2',
      type: 'Regular'
    },
    {
      _id: 'pc5',
      member_name: 'Jihyo',
      album_id: '2',
      album_title: 'Between 1&2',
      image_url: 'https://via.placeholder.com/200x250?text=Jihyo+B1&2',
      type: 'Regular'
    },
    {
      _id: 'pc6',
      member_name: 'Mina',
      album_id: '3',
      album_title: 'Ready to Be',
      image_url: 'https://via.placeholder.com/200x250?text=Mina+RtB',
      type: 'Limited'
    },
    {
      _id: 'pc7',
      member_name: 'Dahyun',
      album_id: '3',
      album_title: 'Ready to Be',
      image_url: 'https://via.placeholder.com/200x250?text=Dahyun+RtB',
      type: 'Regular'
    },
    {
      _id: 'pc8',
      member_name: 'Chaeyoung',
      album_id: '4',
      album_title: 'Yes, I Am Chaeyoung', // Example, adjust if it's an album
      image_url: 'https://via.placeholder.com/200x250?text=Chaeyoung+YIAM',
      type: 'Regular'
    },
    {
      _id: 'pc9',
      member_name: 'Tzuyu',
      album_id: '4',
      album_title: 'Yes, I Am Tzuyu', // Example, adjust if it's an album
      image_url: 'https://via.placeholder.com/200x250?text=Tzuyu+YIAM',
      type: 'Limited'
    }
    // Add more mock photocards as needed, ensuring album_id matches an album
  ]) ;

  const [loading, setLoading] = useState(false); // Basic loading state
  const [error, setError] = useState(null);   // Basic error state

  // Function to get photocards by album ID
  const getPhotocardsByAlbum = (albumId) => {
    // This is a simple filter for mock data.
    // In a real app, this would likely be an API call.
    setLoading(true);
    try {
      const filteredPhotocards = photocards.filter(card => card.album_id === albumId);
      setLoading(false);
      return filteredPhotocards;
    } catch (e) {
      setError(e);
      setLoading(false);
      return [];
    }
  };

  // The value provided to the context consumers
  const value = {
    photocards,       // All photocards (if needed elsewhere)
    setPhotocards,    // To update photocards (if needed)
    getPhotocardsByAlbum,
    loading,          // Photocard specific loading state
    error             // Photocard specific error state
  };

  return (
    <PhotocardContext.Provider value={value}>
      {children}
    </PhotocardContext.Provider>
  );
};

// Create a custom hook to use the photocard context
export const usePhotocards = () => {
  const context = useContext(PhotocardContext);
  if (context === undefined) { // Check for undefined, as context can be null
    throw new Error('usePhotocards must be used within a PhotocardProvider');
  }
  return context;
};
