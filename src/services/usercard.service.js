import api from './api';

class UserCardService {
  getUserCollection(userId) {
    return api.get(`/usercards/user/${userId}/collection`);
  }

  getUserWishlist(userId) {
    return api.get(`/usercards/user/${userId}/wishlist`);
  }

  getUserTradingCards(userId) {
    return api.get(`/usercards/user/${userId}/trading`);
  }

  getUserCardStatus(photocardId) {
    return api.get(`/usercards/status/${photocardId}`);
  }

  createUserCard(data) {
    return api.post('/usercards', data);
  }

  updateUserCard(id, data) {
    return api.patch(`/usercards/${id}`, data);
  }

  deleteUserCard(id) {
    return api.delete(`/usercards/${id}`);
  }

  getUsersTradingCard(photocardId) {
    return api.get(`/usercards/trading/${photocardId}`);
  }
}

export default new UserCardService();
