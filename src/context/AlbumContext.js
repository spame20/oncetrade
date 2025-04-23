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
      cover_image: 'https://via.placeholder.com/300x300',
      release_date: '2021-11-12',
      total_cards: 45
    },
    {
      _id: '2',
      name: 'Between 1&2',
      cover_image: 'https://via.placeholder.com/300x300',
      release_date: '2022-08-26',
      total_cards: 36
    },
    {
      _id: '3',
      name: 'Ready to Be',
      cover_image: 'https://via.placeholder.com/300x300',
      release_date: '2023-03-10',
      total_cards: 40
    },
    {
      _id: '4',
      name: 'Yes, I Am',
      cover_image: 'https://via.placeholder.com/300x300',
      release_date: '2020-06-01',
      total_cards: 30
    }
  ]) ;

  // Return the provider with the data and functions
  return (
    <AlbumContext.Provider value={{ albums, setAlbums }}>
      {children}
    </AlbumContext.Provider>
  );
};

// Create a custom hook to use the album context
export const useAlbums = () => {
  const context = useContext(AlbumContext);
  if (!context) {
    throw new Error('useAlbums must be used within an AlbumProvider');
  }
  return context;
};
