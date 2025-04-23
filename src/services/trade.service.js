import api from './api';

class TradeService {
  getUserTrades() {
    return api.get('/trades/user');
  }

  getTradeById(id) {
    return api.get(`/trades/${id}`);
  }

  getRecentTrades() {
    return api.get('/trades/recent');
  }

  createTrade(tradeData) {
    return api.post('/trades', tradeData);
  }

  updateTradeStatus(id, status) {
    return api.patch(`/trades/${id}/status`, { status });
  }

  cancelTrade(id) {
    return api.delete(`/trades/${id}`);
  }
}

export default new TradeService();
