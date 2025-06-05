import axios from 'axios';

const API_URL = 'http://localhost:6060/api';

class PhotocardService {
  getAllPhotocards() {
    return axios.get(`${API_URL}/photocards`);
  }

  getPhotocardById(id) {
    const cardId = id;
    console.log("Card ID from URL:", cardId);
    return axios.get(`${API_URL}/photocards/${id}`).then(cardResponse => {
      console.log("API Response:", cardResponse.data);
      return cardResponse;
    });
  }

  getMostWantedCards() {
    return axios.get(`${API_URL}/photocards/most-wanted`);
  }

  searchPhotocards(query) {
    return axios.get(`${API_URL}/photocards/search`, { params: { query } });
  }

  filterPhotocards(filters) {
    return axios.get(`${API_URL}/photocards/filter`, { params: filters });
  }
}

const photocardServiceInstance = new PhotocardService();
export default photocardServiceInstance;
