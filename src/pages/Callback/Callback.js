import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import spotifyService from '../../services/spotifyService';
import './Callback.css';

const Callback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(`Spotify authorization error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Exchange code for access token
        await spotifyService.getAccessToken(code, state);
        
        // Get user profile to verify authentication
        const user = await spotifyService.getCurrentUser();
        console.log('User authenticated:', user);

        // Redirect to dashboard
        navigate('/dashboard');
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    handleCallback();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="callback-container">
        <div className="callback-content">
          <div className="loading-spinner"></div>
          <h2>Connecting to Spotify...</h2>
          <p>Please wait while we set up your account</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="callback-container">
        <div className="callback-content error">
          <h2>Authentication Failed</h2>
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={() => navigate('/login')}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Callback;
