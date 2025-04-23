import api from './api';

class RatingService {
  getUserRatings(userId) {
    return api.get(`/ratings/user/${userId}`);
  }

  createRating(data) {
    return api.post('/ratings', data);
  }

  updateRating(id, data) {
    return api.patch(`/ratings/${id}`, data);
  }

  deleteRating(id) {
    return api.delete(`/ratings/${id}`);
  }
}

export default new RatingService();

