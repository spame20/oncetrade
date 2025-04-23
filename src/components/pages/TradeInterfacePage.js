import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTrades } from '../../context/TradeContext';
import { useUser } from '../../context/UserContext';
import { useMessages } from '../../context/MessageContext';

const TradeInterfacePage = () => {
  const { tradeId } = useParams();
  const navigate = useNavigate();
  const { trades, setTrades } = useTrades();
  const { user } = useUser();
  const { sendMessage } = useMessages();
  
  // Find the current trade
  const trade = trades.find(t => t._id === tradeId) || null;
  
  // State for new trade
  const [selectedUserCards, setSelectedUserCards] = useState([]);
  const [selectedPartnerCards, setSelectedPartnerCards] = useState([]);
  const [message, setMessage] = useState('');
  
  // Mock trading partner for new trades
  const [tradingPartner, setTradingPartner] = useState({
    _id: 'u1',
    username: 'TWICE_Fan99',
    avatar: 'https://via.placeholder.com/40',
    collection: [
      {
        _id: 'pc2',
        member: 'Jeongyeon',
        album: 'Formula of Love',
        image: 'https://via.placeholder.com/200x200'
      },
      {
        _id: 'pc3',
        member: 'Momo',
        album: 'Formula of Love',
        image: 'https://via.placeholder.com/200x200'
      },
      {
        _id: 'pc5',
        member: 'Jihyo',
        album: 'Between 1&2',
        image: 'https://via.placeholder.com/200x200'
      }
    ]
  }) ;
  
  // If viewing an existing trade
  useEffect(() => {
    if (tradeId && tradeId !== 'new' && !trade) {
      // Trade not found, redirect to trades list
      navigate('/trades');
    }
  }, [tradeId, trade, navigate]);
  
  // Toggle selection of user's card
  const toggleUserCard = (card) => {
    if (selectedUserCards.some(c => c._id === card._id)) {
      setSelectedUserCards(selectedUserCards.filter(c => c._id !== card._id));
    } else {
      setSelectedUserCards([...selectedUserCards, card]);
    }
  };
  
  // Toggle selection of partner's card
  const togglePartnerCard = (card) => {
    if (selectedPartnerCards.some(c => c._id === card._id)) {
      setSelectedPartnerCards(selectedPartnerCards.filter(c => c._id !== card._id));
    } else {
      setSelectedPartnerCards([...selectedPartnerCards, card]);
    }
  };
  
  // Create a new trade
  const createTrade = () => {
    if (selectedUserCards.length === 0 || selectedPartnerCards.length === 0) {
      alert('Please select at least one card from each side to create a trade.');
      return;
    }
    
    const newTrade = {
      _id: `t${trades.length + 1}`,
      partner: {
        _id: tradingPartner._id,
        username: tradingPartner.username,
        avatar: tradingPartner.avatar
      },
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      offered_cards: selectedUserCards.map(card => ({
        member: card.member,
        album: card.album
      })),
      received_cards: selectedPartnerCards.map(card => ({
        member: card.member,
        album: card.album
      }))
    };
    
    setTrades([...trades, newTrade]);
    
    // Send a message to the trading partner
    if (message.trim()) {
      sendMessage(tradingPartner._id, message);
    }
    
    // Redirect to trades list
    navigate('/trades');
  };
  
  // Update trade status
  const updateTradeStatus = (newStatus) => {
    const updatedTrades = trades.map(t => {
      if (t._id === tradeId) {
        return { ...t, status: newStatus };
      }
      return t;
    });
    
    setTrades(updatedTrades);
    
    // Redirect to trades list
    navigate('/trades');
  };
  
  // If creating a new trade
  if (tradeId === 'new') {
    return (
      <main className="container">
        <div className="trade-interface-header">
          <h2 className="section-title">Create New Trade</h2>
          <div className="trade-with">
            <span>Trading with:</span>
            <div className="trade-partner">
              <img src={tradingPartner.avatar} alt={tradingPartner.username} className="user-avatar" />
              <span className="username">{tradingPartner.username}</span>
            </div>
          </div>
        </div>
        
        <div className="trade-interface">
          <div className="trade-side">
            <h3 className="side-title">Your Cards</h3>
            <div className="card-selection">
              {user.collection
                .filter(card => card.for_trade)
                .map(card => (
                  <div 
                    key={card._id} 
                    className={`selection-card ${selectedUserCards.some(c => c._id === card._id) ? 'selected' : ''}`}
                    onClick={() => toggleUserCard(card)}
                  >
                    <img src={card.image} alt={`${card.member} from ${card.album}`} className="card-img-small" />
                    <div className="card-info-small">
                      <p className="card-title-small">{card.member}</p>
                      <p className="card-album-small">{card.album}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="trade-side">
            <h3 className="side-title">{tradingPartner.username}'s Cards</h3>
            <div className="card-selection">
              {tradingPartner.collection.map(card => (
                <div 
                  key={card._id} 
                  className={`selection-card ${selectedPartnerCards.some(c => c._id === card._id) ? 'selected' : ''}`}
                  onClick={() => togglePartnerCard(card)}
                >
                  <img src={card.image} alt={`${card.member} from ${card.album}`} className="card-img-small" />
                  <div className="card-info-small">
                    <p className="card-title-small">{card.member}</p>
                    <p className="card-album-small">{card.album}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="trade-message">
          <h3>Message to {tradingPartner.username}</h3>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Write a message to ${tradingPartner.username}...`}
            className="trade-message-input"
          ></textarea>
        </div>
        
        <div className="trade-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/trades')}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={createTrade}>
            Propose Trade
          </button>
        </div>
      </main>
    );
  }
  
  // If viewing an existing trade
  if (trade) {
    return (
      <main className="container">
        <div className="trade-interface-header">
          <h2 className="section-title">Trade Details</h2>
          <div className="trade-with">
            <span>Trading with:</span>
            <div className="trade-partner">
              <img src={trade.partner.avatar} alt={trade.partner.username} className="user-avatar" />
              <span className="username">{trade.partner.username}</span>
            </div>
          </div>
          <span className={`status-badge status-${trade.status}`}>
            {trade.status === 'in-progress' ? 'In Progress' : 
             trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
          </span>
        </div>
        
        <div className="trade-interface">
          <div className="trade-side">
            <h3 className="side-title">You Offered</h3>
            <div className="trade-cards-list">
              {trade.offered_cards.map((card, index) => (
                <div key={index} className="trade-card-detail">
                  <div className="card-info">
                    <p className="card-member">{card.member}</p>
                    <p className="card-album">{card.album}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="trade-side">
            <h3 className="side-title">You Received</h3>
            <div className="trade-cards-list">
              {trade.received_cards.map((card, index) => (
                <div key={index} className="trade-card-detail">
                  <div className="card-info">
                    <p className="card-member">{card.member}</p>
                    <p className="card-album">{card.album}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="trade-date-info">
          <p>Trade initiated on: {new Date(trade.date).toLocaleDateString()}</p>
        </div>
        
        {trade.status === 'pending' && (
          <div className="trade-actions">
            <button className="btn btn-secondary" onClick={() => updateTradeStatus('cancelled')}>
              Decline
            </button>
            <button className="btn btn-primary" onClick={() => updateTradeStatus('in-progress')}>
              Accept
            </button>
          </div>
        )}
        
        {trade.status === 'in-progress' && (
          <div className="trade-actions">
            <button className="btn btn-secondary" onClick={() => updateTradeStatus('cancelled')}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={() => updateTradeStatus('completed')}>
              Complete Trade
            </button>
          </div>
        )}
        
        <div className="back-link">
          <Link to="/trades">← Back to Trades</Link>
        </div>
      </main>
    );
  }
  
  return <div>Loading...</div>;
};

export default TradeInterfacePage;
