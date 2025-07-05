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
        // Parse hash parameters from URL (implicit grant flow)
        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);

        const access_token = hashParams.get('access_token');
        const token_type = hashParams.get('token_type');
        const expires_in = hashParams.get('expires_in');
        const state = hashParams.get('state');
        const error = hashParams.get('error');

        if (error) {
          throw new Error(`Spotify authorization error: ${error}`);
        }

        if (!access_token) {
          throw new Error('No access token received');
        }

        // Handle the callback with implicit grant flow
        await spotifyService.handleCallback({
          access_token,
          token_type,
          expires_in: parseInt(expires_in),
          state
        });

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
