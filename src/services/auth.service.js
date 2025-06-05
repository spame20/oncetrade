import api from './api';

class AuthService {
  login(email, password) {
    // For development/testing purposes, allow a mock login
    if (email === 'test@example.com' && password === 'password') {
      console.log('Mock login successful');
      return Promise.resolve({
        token: 'mock-token-for-testing',
        user: {
          _id: 'user1',
          username: 'TWICE_Fan',
          email: 'test@example.com',
          bio: 'TWICE fan since 2016. Collecting photocards from all eras!'
        }
      });
    }
    
    return api.post('/auth/login', { email, password })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        return response.data;
      });
  }

  register(userData) {
    // For development/testing purposes, allow a mock registration
    if (userData.email === 'newuser@example.com') {
      console.log('Mock registration successful');
      return Promise.resolve({
        success: true,
        user: {
          _id: 'user2',
          username: userData.username,
          email: userData.email,
          bio: ''
        }
      });
    }
    
    return api.post('/auth/register', userData)
      .then(response => {
        return response.data;
      });
  }

  updateProfile(userId, userData) {
    // For development/testing purposes, mock update
    if (userId === 'user1' || userId === 'u2' || userId === 'u3') {
      console.log('Mock profile update successful');
      return Promise.resolve({
        success: true,
        user: {
          _id: userId,
          ...userData
        }
      });
    }
    
    return api.put(`/auth/users/${userId}`, userData)
      .then(response => {
        return response.data;
      });
  }

  requestPasswordReset(email) {
    // For development/testing purposes, allow a mock password reset request
    if (email === 'test@example.com') {
      console.log('Mock password reset request successful');
      return Promise.resolve({
        success: true,
        message: 'Password reset email sent'
      });
    }
    
    return api.post('/auth/forgot-password', { email })
      .then(response => {
        return response.data;
      });
  }

  verifyResetToken(token) {
    // For development/testing purposes, allow a mock token verification
    if (token === 'mock-token') {
      console.log('Mock token verification successful');
      return Promise.resolve({
        success: true,
        valid: true
      });
    }
    
    return api.get(`/auth/reset-password/${token}/verify`)
      .then(response => {
        return response.data;
      });
  }

  resetPassword(token, newPassword) {
    // For development/testing purposes, allow a mock password reset
    if (token === 'mock-token') {
      console.log('Mock password reset successful');
      return Promise.resolve({
        success: true,
        message: 'Password reset successful'
      });
    }
    
    return api.post(`/auth/reset-password/${token}`, { password: newPassword })
      .then(response => {
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    // Check for mock user first
    const mockUserStr = localStorage.getItem('user');
    if (mockUserStr) {
      const mockUser = JSON.parse(mockUserStr);
      return Promise.resolve({ data: mockUser });
    }
    
    return api.get('/auth/me');
  }

  getUserProfile(userId) {
    return api.get(`/auth/users/${userId}`);
  }
}

export default new AuthService();
