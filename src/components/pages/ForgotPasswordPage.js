import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // For development/testing purposes, allow a mock password reset
      if (email === 'test@example.com') {
        console.log('Mock password reset request successful');
        setIsSubmitted(true);
        return;
      }
      
      // Real password reset request with backend API
      await requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Password reset request error:', err);
      setError('Failed to request password reset. Please check your email address.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <div className="auth-form-container">
        {!isSubmitted ? (
          <>
            <h2>Reset Your Password</h2>
            <p>Enter your email address and we'll send you a link to reset your password.</p>
            
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
              
              <button 
                type="submit" 
                className="btn btn-primary btn-block"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Reset Password'}
              </button>
            </form>
            
            <div className="auth-links">
              <p>
                Remember your password? <Link to="/login">Log In</Link>
              </p>
            </div>
          </>
        ) : (
          <div className="password-reset-success">
            <h2>Check Your Email</h2>
            <p>
              If an account exists with the email <strong>{email}</strong>, we've sent instructions to reset your password.
            </p>
            <p>
              Please check your inbox and follow the link in the email. The link will expire in 1 hour.
            </p>
            <div className="auth-links" style={{ marginTop: '20px' }}>
              <Link to="/login" className="btn btn-secondary">
                Return to Login
              </Link>
            </div>
          </div>
        )}
        
        <div className="test-account-info" style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <h4>Test Account</h4>
          <p>For testing purposes, you can use:</p>
          <p><strong>Email:</strong> test@example.com</p>
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
