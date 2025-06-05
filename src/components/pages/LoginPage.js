import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // For development/testing purposes, allow a mock login
      if (email === 'test@example.com' && password === 'password') {
        // Mock successful login
        console.log('Mock login successful');
        localStorage.setItem('token', 'mock-token-for-testing');
        localStorage.setItem('user', JSON.stringify({
          _id: 'user1',
          username: 'TWICE_Fan',
          email: 'test@example.com'
        }));
        window.location.href = '/'; // Force reload to update auth state
        return;
      }
      
      // Real login attempt with backend API
      const response = await login(email, password);
      console.log('Login successful:', response);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to log in. Please check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <div className="auth-form-container">
        <h2>Log In to Your Account</h2>
        <p>Welcome back! Please enter your details to access your collection.</p>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="form-group forgot-password-link">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
        
        <div className="test-account-info" style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <h4>Test Account</h4>
          <p>For testing purposes, you can use:</p>
          <p><strong>Email:</strong> test@example.com</p>
          <p><strong>Password:</strong> password</p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
