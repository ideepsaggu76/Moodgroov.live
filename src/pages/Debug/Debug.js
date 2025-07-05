import React, { useState } from 'react';
import spotifyService from '../../services/spotifyService';

const Debug = () => {
  const [authUrl, setAuthUrl] = useState('');
  const [envVars, setEnvVars] = useState({});

  const generateUrl = () => {
    const url = spotifyService.getAuthUrl();
    setAuthUrl(url);
    
    setEnvVars({
      clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
      redirectUri: process.env.REACT_APP_SPOTIFY_REDIRECT_URI,
      youtubeKey: process.env.REACT_APP_YOUTUBE_API_KEY ? 'SET' : 'NOT SET'
    });
  };

  return (
    <div style={{ padding: '2rem', background: '#f5f5f5', minHeight: '100vh' }}>
      <h1>Spotify Debug Page</h1>
      
      <button onClick={generateUrl} style={{ 
        padding: '1rem 2rem', 
        fontSize: '1rem', 
        background: '#1db954', 
        color: 'white', 
        border: 'none', 
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '2rem'
      }}>
        Generate Spotify Auth URL
      </button>

      {authUrl && (
        <div style={{ marginBottom: '2rem' }}>
          <h3>Generated Auth URL:</h3>
          <div style={{ 
            padding: '1rem', 
            background: 'white', 
            border: '1px solid #ddd', 
            borderRadius: '5px',
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            fontSize: '0.9rem'
          }}>
            {authUrl}
          </div>
          
          <a 
            href={authUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#1db954',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px'
            }}
          >
            Test This URL
          </a>
        </div>
      )}

      {Object.keys(envVars).length > 0 && (
        <div>
          <h3>Environment Variables:</h3>
          <div style={{ 
            padding: '1rem', 
            background: 'white', 
            border: '1px solid #ddd', 
            borderRadius: '5px',
            fontFamily: 'monospace'
          }}>
            <div><strong>Client ID:</strong> {envVars.clientId}</div>
            <div><strong>Redirect URI:</strong> {envVars.redirectUri}</div>
            <div><strong>YouTube API Key:</strong> {envVars.youtubeKey}</div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', background: 'white', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Instructions:</h3>
        <ol>
          <li>Click "Generate Spotify Auth URL" button above</li>
          <li>Copy the generated URL</li>
          <li>Check that the redirect_uri parameter matches exactly what you added to Spotify</li>
          <li>The redirect_uri should be: <code>https://moodgroov-f94fe89a55d5.herokuapp.com/callback</code></li>
          <li>Make sure there are no extra spaces or characters</li>
        </ol>
      </div>
    </div>
  );
};

export default Debug;
