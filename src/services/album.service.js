import api from './api';

class AlbumService {
  getAllAlbums() {
    return api.get('/albums');
  }

  getFeaturedAlbums() {
    return api.get('/albums/featured');
  }

  getAlbumById(id) {
    return api.get(`/albums/${id}`);
  }

  getAlbumPhotocards(id) {
    return api.get(`/albums/${id}/photocards`);
  }
}

export default new AlbumService();
