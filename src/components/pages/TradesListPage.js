import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTrades } from '../../context/TradeContext';

const TradesListPage = () => {
  // Get trades data from context
  const { trades } = useTrades();
  
  // Filter state
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOption, setSortOption] = useState('date_desc');
  
  // Filter and sort trades
  const filteredTrades = trades
    .filter(trade => {
      if (filterStatus === 'all') return true;
      return trade.status === filterStatus;
    })
    .sort((a, b) => {
      switch(sortOption) {
        case 'date_asc':
          return new Date(a.date) - new Date(b.date);
        case 'date_desc':
          return new Date(b.date) - new Date(a.date);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'partner':
          return a.partner.username.localeCompare(b.partner.username);
        default:
          return 0;
      }
    });
  
  // Get counts for each status
  const statusCounts = trades.reduce((counts, trade) => {
    counts[trade.status] = (counts[trade.status] || 0) + 1;
    return counts;
  }, {});

  return (
    <main className="container">
      <div className="trades-header">
        <h2 className="section-title">My Trades</h2>
        <Link to="/trades/new" className="btn btn-primary">New Trade</Link>
      </div>
      
      <div className="trades-controls">
        <div className="status-filters">
          <button 
            className={`status-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All ({trades.length})
          </button>
          <button 
            className={`status-btn ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            Pending ({statusCounts.pending || 0})
          </button>
          <button 
            className={`status-btn ${filterStatus === 'in-progress' ? 'active' : ''}`}
            onClick={() => setFilterStatus('in-progress')}
          >
            In Progress ({statusCounts['in-progress'] || 0})
          </button>
          <button 
            className={`status-btn ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            Completed ({statusCounts.completed || 0})
          </button>
        </div>
        
        <div className="sort-box">
          <label htmlFor="sort">Sort by:</label>
          <select 
            id="sort"
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-select"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="status">Status</option>
            <option value="partner">Trading Partner</option>
          </select>
        </div>
      </div>
      
      {filteredTrades.length > 0 ? (
        <div className="trades-list">
          {filteredTrades.map(trade => (
            <div key={trade._id} className={`trade-item status-${trade.status}`}>
              <div className="trade-header">
                <div className="trade-users">
                  <div className="trade-user">
                    <span className="username">You</span>
                  </div>
                  <span className="trade-direction">↔</span>
                  <div className="trade-user">
                    <img src={trade.partner.avatar} alt={trade.partner.username} className="user-avatar" />
                    <span className="username">{trade.partner.username}</span>
                  </div>
                </div>
                <span className={`status-badge status-${trade.status}`}>
                  {trade.status === 'in-progress' ? 'In Progress' : 
                   trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                </span>
              </div>
              
              <div className="trade-content">
                <div className="trade-cards">
                  <h4>You Offered:</h4>
                  {trade.offered_cards.map((card, index) => (
                    <div key={index} className="trade-card">
                      <div className="card-info">
                        <p className="card-member">{card.member}</p>
                        <p className="card-album">{card.album}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="trade-cards">
                  <h4>You Received:</h4>
                  {trade.received_cards.map((card, index) => (
                    <div key={index} className="trade-card">
                      <div className="card-info">
                        <p className="card-member">{card.member}</p>
                        <p className="card-album">{card.album}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="trade-footer">
                <span className="trade-date">
                  {new Date(trade.date).toLocaleDateString()}
                </span>
                <Link to={`/trades/${trade._id}`} className="view-trade-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-trades-message">
          <p>No trades found matching your filters.</p>
          {trades.length > 0 ? (
            <button 
              className="btn btn-secondary"
              onClick={() => setFilterStatus('all')}
            >
              Show All Trades
            </button>
          ) : (
            <p>You haven't made any trades yet. Start a new trade to begin exchanging photocards.</p>
          )}
        </div>
      )}
    </main>
  );
};

export default TradesListPage;
