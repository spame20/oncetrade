import api from './api';

class AuthService {
  login(email, password) {
    return api.post('/auth/login', { email, password })
      .then(response => {
        return response.data;
      });
  }

  register(userData) {
    return api.post('/auth/register', userData)
      .then(response => {
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('token');
  }

  getCurrentUser() {
    return api.get('/auth/me');
  }

  getUserProfile(userId) {
    return api.get(`/auth/users/${userId}`);
  }
}

export default new AuthService();
