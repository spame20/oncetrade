import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const { token } = useParams();
  const { resetPassword, verifyResetToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Verify the token when the component mounts
    const checkToken = async () => {
      try {
        // For development/testing purposes, allow a mock token verification
        if (token === 'mock-token') {
          console.log('Mock token verification successful');
          return;
        }
        
        // Real token verification with backend API
        await verifyResetToken(token);
      } catch (err) {
        console.error('Token verification error:', err);
        setIsTokenValid(false);
        setError('Invalid or expired password reset link. Please request a new one.');
      }
    };
    
    checkToken();
  }, [token, verifyResetToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // For development/testing purposes, allow a mock password reset
      if (token === 'mock-token') {
        console.log('Mock password reset successful');
        setIsSubmitted(true);
        return;
      }
      
      // Real password reset with backend API
      await resetPassword(token, password);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isTokenValid) {
    return (
      <main className="auth-container">
        <div className="auth-form-container">
          <h2>Invalid Reset Link</h2>
          <p>
            The password reset link is invalid or has expired. Please request a new one.
          </p>
          <div className="auth-links" style={{ marginTop: '20px' }}>
            <Link to="/forgot-password" className="btn btn-primary">
              Request New Reset Link
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-container">
      <div className="auth-form-container">
        {!isSubmitted ? (
          <>
            <h2>Reset Your Password</h2>
            <p>Please enter your new password below.</p>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary btn-block"
                disabled={isLoading}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        ) : (
          <div className="password-reset-success">
            <h2>Password Reset Successful</h2>
            <p>
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <div className="auth-links" style={{ marginTop: '20px' }}>
              <Link to="/login" className="btn btn-primary">
                Log In
              </Link>
            </div>
          </div>
        )}
        
        <div className="test-account-info" style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <h4>Test Reset</h4>
          <p>For testing purposes, use the URL:</p>
          <p><strong>/reset-password/mock-token</strong></p>
        </div>
      </div>
    </main>
  );
};

export default ResetPasswordPage;
