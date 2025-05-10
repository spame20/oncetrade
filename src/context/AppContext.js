import React from 'react';
import { AlbumProvider } from './AlbumContext';
import { PhotocardProvider } from './PhotocardContext';
import { UserProvider } from './UserContext';
import { TradeProvider } from './TradeContext';
import { MessageProvider } from './MessageContext';
import { RatingProvider } from './RatingContext'; // Import the new RatingProvider

// Create a combined provider component
export const AppProvider = ({ children }) => {
  return (
    <AlbumProvider>
      <PhotocardProvider>
        <UserProvider>
          <TradeProvider>
            <MessageProvider>
              <RatingProvider> {/* Add RatingProvider here */}
                {children}
              </RatingProvider>
            </MessageProvider>
          </TradeProvider>
        </UserProvider>
      </PhotocardProvider>
    </AlbumProvider>
  );
};
