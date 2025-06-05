import React from 'react';
import './SortFilterBar.css';

const SortFilterBar = ({ 
  sortOption, 
  setSortOption, 
  filterMember, 
  setFilterMember, 
  filterAlbum, 
  setFilterAlbum,
  availableMembers,
  availableAlbums,
  showTradeFilter,
  tradeFilterOption,
  setTradeFilterOption
}) => {
  return (
    <div className="sort-filter-bar">
      <div className="filter-section">
        <label htmlFor="member-filter">Member:</label>
        <select 
          id="member-filter" 
          value={filterMember} 
          onChange={(e) => setFilterMember(e.target.value)}
        >
          <option value="">All Members</option>
          {availableMembers.map(member => (
            <option key={member} value={member}>{member}</option>
          ))}
        </select>
      </div>
      
      <div className="filter-section">
        <label htmlFor="album-filter">Album:</label>
        <select 
          id="album-filter" 
          value={filterAlbum} 
          onChange={(e) => setFilterAlbum(e.target.value)}
        >
          <option value="">All Albums</option>
          {availableAlbums.map(album => (
            <option key={album} value={album}>{album}</option>
          ))}
        </select>
      </div>
      
      {showTradeFilter && (
        <div className="filter-section">
          <label htmlFor="trade-filter">Trade Status:</label>
          <select 
            id="trade-filter" 
            value={tradeFilterOption} 
            onChange={(e) => setTradeFilterOption(e.target.value)}
          >
            <option value="">All Cards</option>
            <option value="for-trade">Available for Trade</option>
            <option value="not-for-trade">Not for Trade</option>
          </select>
        </div>
      )}
      
      <div className="filter-section">
        <label htmlFor="sort-option">Sort By:</label>
        <select 
          id="sort-option" 
          value={sortOption} 
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="member-asc">Member (A-Z)</option>
          <option value="member-desc">Member (Z-A)</option>
          <option value="album-asc">Album (A-Z)</option>
          <option value="album-desc">Album (Z-A)</option>
          {showTradeFilter && (
            <>
              <option value="trade-status">Trade Status</option>
              <option value="quantity">Quantity</option>
            </>
          )}
        </select>
      </div>
    </div>
  );
};

export default SortFilterBar;
