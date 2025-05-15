import React, { createContext, useState, useContext } from 'react';

// Create the context
const AlbumContext = createContext();

// Create a provider component
export const AlbumProvider = ({ children }) => {
  // Mock albums data
  const [albums, setAlbums] = useState([
    {
      _id: '1',
      name: 'Formula of Love',
      cover_image: 'https://via.placeholder.com/300x300?text=Formula+of+Love',
      release_date: '2021-11-12',
      total_cards: 45
    },
    {
      _id: '2',
      name: 'Between 1&2',
      cover_image: 'https://via.placeholder.com/300x300?text=Between+1%262',
      release_date: '2022-08-26',
      total_cards: 36
    },
    {
      _id: '3',
      name: 'Ready to Be',
      cover_image: 'https://via.placeholder.com/300x300?text=Ready+to+Be',
      release_date: '2023-03-10',
      total_cards: 40
    },
    {
      _id: '4',
      name: 'Yes, I Am Chaeyoung',
      cover_image: 'https://via.placeholder.com/300x300?text=Yes+I+Am+Chaeyoung',
      release_date: '2020-06-01', // Example date
      total_cards: 30 // Example count
    }
    // Add more mock albums as needed
  ]) ;

  // Function to get a single album by its ID
  const getAlbumById = (id) => {
    // This is a simple find for mock data.
    // In a real app, this might involve an API call or more complex state lookup.
    // Note: This is a synchronous example for simplicity with mock data.
    // If fetching from an API, it would be asynchronous (async/await).
    return albums.find(album => album._id === id);
  };

  // The value provided to the context consumers
  const value = {
    albums,
    setAlbums, // If you need to update albums from components
    getAlbumById
  };

  return (
    <AlbumContext.Provider value={value}>
      {children}
    </AlbumContext.Provider>
  );
};

// Create a custom hook to use the album context
export const useAlbums = () => {
  const context = useContext(AlbumContext);
  if (context === undefined) { // Check for undefined, as context can be null
    throw new Error('useAlbums must be used within an AlbumProvider');
  }
  return context;
};
