import React from 'react';
import { AlbumProvider } from './AlbumContext';
import { PhotocardProvider } from './PhotocardContext';
import { UserProvider } from './UserContext';
import { TradeProvider } from './TradeContext';
import { MessageProvider } from './MessageContext';

// Create a combined provider component
export const AppProvider = ({ children }) => {
  return (
    <AlbumProvider>
      <PhotocardProvider>
        <UserProvider>
          <TradeProvider>
            <MessageProvider>
              {children}
            </MessageProvider>
          </TradeProvider>
        </UserProvider>
      </PhotocardProvider>
    </AlbumProvider>
  );
};
