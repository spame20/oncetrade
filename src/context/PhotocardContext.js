import React, { createContext, useState, useContext } from 'react';

// Create the context
const PhotocardContext = createContext();

// Create a provider component
export const PhotocardProvider = ({ children }) => {
  // Mock photocards data
  const [photocards, setPhotocards] = useState([
    {
      _id: 'pc1',
      member: 'Nayeon',
      album_id: '1',
      album: 'Formula of Love',
      image: 'https://via.placeholder.com/200x200',
      rarity: 'Regular'
    },
    {
      _id: 'pc2',
      member: 'Jeongyeon',
      album_id: '1',
      album: 'Formula of Love',
      image: 'https://via.placeholder.com/200x200',
      rarity: 'Regular'
    },
    {
      _id: 'pc3',
      member: 'Momo',
      album_id: '1',
      album: 'Formula of Love',
      image: 'https://via.placeholder.com/200x200',
      rarity: 'Limited'
    },
    {
      _id: 'pc4',
      member: 'Sana',
      album_id: '2',
      album: 'Between 1&2',
      image: 'https://via.placeholder.com/200x200',
      rarity: 'Regular'
    },
    {
      _id: 'pc5',
      member: 'Jihyo',
      album_id: '2',
      album: 'Between 1&2',
      image: 'https://via.placeholder.com/200x200',
      rarity: 'Regular'
    },
    {
      _id: 'pc6',
      member: 'Mina',
      album_id: '3',
      album: 'Ready to Be',
      image: 'https://via.placeholder.com/200x200',
      rarity: 'Limited'
    },
    {
      _id: 'pc7',
      member: 'Dahyun',
      album_id: '3',
      album: 'Ready to Be',
      image: 'https://via.placeholder.com/200x200',
      rarity: 'Regular'
    },
    {
      _id: 'pc8',
      member: 'Chaeyoung',
      album_id: '4',
      album: 'Yes, I Am',
      image: 'https://via.placeholder.com/200x200',
      rarity: 'Regular'
    },
    {
      _id: 'pc9',
      member: 'Tzuyu',
      album_id: '4',
      album: 'Yes, I Am',
      image: 'https://via.placeholder.com/200x200',
      rarity: 'Limited'
    }
  ]) ;

  // Return the provider with the data and functions
  return (
    <PhotocardContext.Provider value={{ photocards, setPhotocards }}>
      {children}
    </PhotocardContext.Provider>
  );
};

// Create a custom hook to use the photocard context
export const usePhotocards = () => {
  const context = useContext(PhotocardContext);
  if (!context) {
    throw new Error('usePhotocards must be used within a PhotocardProvider');
  }
  return context;
};
