import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTrades } from '../../context/TradeContext'; // Fixed import
import { useUser } from '../../context/UserContext'; // Fixed import
import { useMessages } from '../../context/MessageContext'; // Fixed import
import { useRatings } from '../../context/RatingContext'; // Fixed import
import RatingForm from '../ratings/RatingForm';

const TradeInterfacePage = () => {
  const { tradeId } = useParams();
  const navigate = useNavigate();
  const { trades, setTrades } = useTrades();
  const { user } = useUser(); // Logged-in user from UserContext
  const { sendMessage } = useMessages();
  const { getRatingForTradeByRater } = useRatings();

  const [trade, setTrade] = useState(null);
  const [selectedUserCards, setSelectedUserCards] = useState([]);
  const [selectedPartnerCards, setSelectedPartnerCards] = useState([]);
  const [message, setMessage] = useState('');
  const [tradingPartner, setTradingPartner] = useState(null);
  const [showRatingForm, setShowRatingForm] = useState(false);

  const currentUserId = user?._id || 'user1';
  console.log('[TradeInterfacePage] Current User ID:', currentUserId, '(from user context:', user?._id, ')');

  useEffect(() => {
    console.log('[TradeInterfacePage] useEffect triggered. tradeId:', tradeId, 'Trades available:', trades.length);
    const currentTrade = trades.find(t => t._id === tradeId);
    console.log('[TradeInterfacePage] Found trade in context:', currentTrade);

    if (currentTrade) {
      setTrade(currentTrade);
      console.log('[TradeInterfacePage] Set trade state:', currentTrade);

      let partnerInTrade = null;
      if (currentTrade.initiatorId === currentUserId) {
        partnerInTrade = currentTrade.partner?._id === currentTrade.receiverId ? currentTrade.partner : null;
        if (!partnerInTrade && currentTrade.receiverId) {
            console.warn("[TradeInterfacePage] Partner object might not be correctly assigned for initiator.");
            if (currentTrade.partner?._id === currentTrade.receiverId) partnerInTrade = currentTrade.partner;
        }
      } else if (currentTrade.receiverId === currentUserId) {
        partnerInTrade = currentTrade.partner?._id === currentTrade.initiatorId ? currentTrade.partner : null;
         if (!partnerInTrade && currentTrade.initiatorId) {
            console.warn("[TradeInterfacePage] Partner object might not be correctly assigned for receiver.");
            if (currentTrade.partner?._id === currentTrade.initiatorId) partnerInTrade = currentTrade.partner;
        }
      } else {
        console.warn("[TradeInterfacePage] Current user is neither initiator nor receiver. Using trade.partner as fallback if it's not the current user.");
        if(currentTrade.partner?._id !== currentUserId) {
            partnerInTrade = currentTrade.partner;
        }
      }
      
      if (!partnerInTrade && currentTrade.partner && currentTrade.partner._id !== currentUserId) {
        console.log("[TradeInterfacePage] Fallback: Setting tradingPartner to trade.partner as it's not current user.");
        partnerInTrade = currentTrade.partner;
      }

      setTradingPartner(partnerInTrade);
      console.log('[TradeInterfacePage] Set tradingPartner state:', partnerInTrade);

    } else if (tradeId === 'new') {
      console.log('[TradeInterfacePage] Setting up for new trade.');
      setTradingPartner({
        _id: 'u2',
        username: 'MomoLover_NewTrade',
        avatar: 'https://via.placeholder.com/40',
        collection: [
          { _id: 'pcX_partner_new', member: 'Momo', album: 'Example Album Partner New', image: 'https://via.placeholder.com/100', for_trade: true },
        ],
      }) ;
    }
  }, [tradeId, trades, currentUserId, user]);

  const handleOfferCardToggle = (cardId, listType) => {
    if (listType === 'user') {
      setSelectedUserCards(prev =>
        prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]
      );
    } else {
      setSelectedPartnerCards(prev =>
        prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]
      );
    }
  };

  const handleProposeTrade = () => {
    if (selectedUserCards.length === 0 || selectedPartnerCards.length === 0) {
      alert('Please select cards for both offer and receive.');
      return;
    }
    if (!tradingPartner) {
        alert('Trading partner not found or not correctly identified.');
        console.error("[TradeInterfacePage] Attempted to propose trade with no tradingPartner.");
        return;
    }
    if (!user || !user.collection) {
        alert('Current user data or collection not available.');
        return;
    }
    const newTrade = {
      _id: `t${trades.length + 1}${Date.now()}`,
      partner: tradingPartner,
      status: 'pending',
      date: new Date().toISOString(),
      offered_cards: user.collection.filter(card => selectedUserCards.includes(card._id))
        .map(c => ({ photocard_id: c._id, member: c.member, album: c.album, image: c.image })),
      received_cards: tradingPartner.collection?.filter(card => selectedPartnerCards.includes(card._id))
        .map(c => ({ photocard_id: c._id, member: c.member, album: c.album, image: c.image })) || [],
      messages: [{ senderId: currentUserId, content: message, timestamp: new Date().toISOString() }],
      initiatorId: currentUserId,
      receiverId: tradingPartner._id,
    };
    setTrades(prevTrades => [...prevTrades, newTrade]);
    if (sendMessage) sendMessage(tradingPartner._id, `Trade proposed: ${message}`);
    else console.warn("sendMessage function not available from MessageContext");
    navigate('/trades');
  };

  const handleUpdateTradeStatus = (newStatus) => {
    if (trade) {
      setTrades(prevTrades =>
        prevTrades.map(t =>
          t._id === trade._id ? { ...t, status: newStatus } : t
        )
      );
      setTrade(prevTrade => ({ ...prevTrade, status: newStatus }));
      console.log(`[TradeInterfacePage] Trade ${trade._id} status updated to ${newStatus}`);
    }
  };

  console.log('[TradeInterfacePage] Evaluating rating conditions. Trade object:', trade);
  console.log('[TradeInterfacePage] Trading partner for rating:', tradingPartner);

  const alreadyRated = trade && tradingPartner ? getRatingForTradeByRater(trade._id, currentUserId) : null;
  console.log('[TradeInterfacePage] Already rated this trade by current user?', alreadyRated);

  const isParticipant = trade && (trade.initiatorId === currentUserId || trade.receiverId === currentUserId);
  console.log('[TradeInterfacePage] Is current user a participant?', isParticipant, 'Initiator:', trade?.initiatorId, 'Receiver:', trade?.receiverId);

  const canRate = trade && trade.status === 'completed' && tradingPartner && tradingPartner._id !== currentUserId && !alreadyRated && isParticipant;
  console.log('[TradeInterfacePage] Can rate?', canRate,
              'trade status completed:', trade?.status === 'completed',
              'tradingPartner exists:', !!tradingPartner,
              'partner is not self:', tradingPartner?._id !== currentUserId,
              '!alreadyRated:', !alreadyRated,
              'isParticipant:', isParticipant);

  if (tradeId !== 'new' && !trade && trades.length > 0) {
    console.log("[TradeInterfacePage] No specific trade found for ID:", tradeId, "and not creating new. Showing loading/not found.");
    return <main className="container"><p>Loading trade details or trade not found...</p></main>;
  }
  if (tradeId === 'new' && (!user || !user.collection)) {
    return <main className="container"><p>Please log in and ensure your collection is loaded to propose a new trade.</p></main>;
  }

  return (
    <main className="container trade-interface-page">
      {tradeId === 'new' ? (
        <h2>Propose New Trade with {tradingPartner?.username || 'User'}</h2>
      ) : (
        <h2>Trade with {tradingPartner?.username || trade?.partner.username}</h2>
      )}

      {trade && tradeId !== 'new' && (
        <div className="trade-details-section">
          <p><strong>Status:</strong> <span className={`status-${trade.status}`}>{trade.status.replace('-', ' ')}</span></p>
          <p><strong>Date:</strong> {new Date(trade.date).toLocaleDateString()}</p>
          <div className="trade-cards-comparison">
            <div>
              <h4>You Offered:</h4>
              {trade.offered_cards?.map((card, index) => (
                <div key={`offered-${index}-${card.photocard_id}`} className="mini-card-display">
                  <img src={card.image} alt={`${card.member} - ${card.album}`} />
                  <p>{card.member} - {card.album}</p>
                </div>
              )) || <p>No cards offered.</p>}
            </div>
            <div>
              <h4>You Will Receive:</h4>
              {trade.received_cards?.map((card, index) => (
                <div key={`received-${index}-${card.photocard_id}`} className="mini-card-display">
                  <img src={card.image} alt={`${card.member} - ${card.album}`} />
                  <p>{card.member} - {card.album}</p>
                </div>
              )) || <p>No cards to receive.</p>}
            </div>
          </div>

          <div className="trade-actions">
            {trade.status === 'pending' && trade.receiverId === currentUserId && (
              <button onClick={() => handleUpdateTradeStatus('accepted')} className="btn btn-success">Accept Trade</button>
            )}
            {trade.status === 'pending' && (trade.initiatorId === currentUserId || trade.receiverId === currentUserId) && (
              <button onClick={() => handleUpdateTradeStatus('declined')} className="btn btn-danger">Decline Trade</button>
            )}
            {trade.status === 'accepted' && (trade.initiatorId === currentUserId || trade.receiverId === currentUserId) && (
              <button onClick={() => handleUpdateTradeStatus('shipped')} className="btn btn-primary">Mark as Shipped/Received</button>
            )}
            {trade.status === 'shipped' && (trade.initiatorId === currentUserId || trade.receiverId === currentUserId) && (
              <button onClick={() => handleUpdateTradeStatus('completed')} className="btn btn-primary">Mark as Completed</button>
            )}
            
            {canRate && tradingPartner && (
              <button onClick={() => setShowRatingForm(true)} className="btn btn-info">Rate {tradingPartner.username}</button>
            )}
          </div>

          {showRatingForm && trade && tradingPartner && (
            <div className="rating-form-container" style={{ marginTop: '20px', border: '1px solid #eee', padding: '20px', borderRadius: '8px' }}>
              <RatingForm 
                tradeId={trade._id}
                ratedUserId={tradingPartner._id}
                onComplete={() => {
                  setShowRatingForm(false);
                }}
              />
              <button onClick={() => setShowRatingForm(false)} className="btn btn-secondary" style={{ marginTop: '10px' }}>Cancel Rating</button>
            </div>
          )}
          
          {alreadyRated && trade.status === 'completed' && (
            <p className="feedback-info" style={{ marginTop: '15px', color: 'green' }}>You have already rated this trade. Thank you!</p>
          )}
        </div>
      )}

      {tradeId === 'new' && tradingPartner && user && user.collection && (
        <div className="new-trade-form">
          <h3>Your Offer (from your collection):</h3>
          <div className="card-selection-grid">
            {user.collection.filter(c => c.for_trade).map(card => (
              <div 
                key={card._id} 
                className={`card-selectable ${selectedUserCards.includes(card._id) ? 'selected' : ''}`}
                onClick={() => handleOfferCardToggle(card._id, 'user')}
              >
                <img src={card.image} alt={`${card.member} - ${card.album}`} />
                <p>{card.member} - {card.album}</p>
              </div>
            ))}
             {user.collection.filter(c => c.for_trade).length === 0 && <p>You have no cards marked for trade in your collection.</p>}
          </div>

          <h3>Request from {tradingPartner.username}'s Collection:</h3>
          <div className="card-selection-grid">
            {tradingPartner.collection && tradingPartner.collection.filter(c => c.for_trade).map(card => (
              <div 
                key={card._id} 
                className={`card-selectable ${selectedPartnerCards.includes(card._id) ? 'selected' : ''}`}
                onClick={() => handleOfferCardToggle(card._id, 'partner')}
              >
                <img src={card.image} alt={`${card.member} - ${card.album}`} />
                <p>{card.member} - {card.album}</p>
              </div>
            ))}
            {(!tradingPartner.collection || tradingPartner.collection.filter(c => c.for_trade).length === 0) && <p>{tradingPartner.username} has no cards marked for trade.</p>}
          </div>

          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a message to your trade proposal (optional)"
            rows="3"
            className="trade-message-input"
            style={{ width: '100%', padding: '10px', marginTop: '15px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button onClick={handleProposeTrade} className="btn btn-primary" style={{ marginTop: '15px' }}>Propose Trade</button>
        </div>
      )}

      <div className="back-link" style={{ marginTop: '20px' }}>
        <Link to="/trades">← Back to Trades List</Link>
      </div>
    </main>
  );
};

export default TradeInterfacePage;
