import api from './api';

class PhotocardService {
  getAllPhotocards() {
    return api.get('/photocards');
  }

  getPhotocardById(id) {
    return api.get(`/photocards/${id}`);
  }

  getMostWantedCards() {
    return api.get('/photocards/most-wanted');
  }

  searchPhotocards(query) {
    return api.get('/photocards/search', { params: { query } });
  }

  filterPhotocards(filters) {
    return api.get('/photocards/filter', { params: filters });
  }
}

export default new PhotocardService();
