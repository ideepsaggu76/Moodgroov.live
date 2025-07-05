import React from 'react';
import '../styles/Home.css';
import logo from '../logo.svg';
import Button from '../components/Button';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <img src={logo} className="home-logo" alt="MoodGroov logo" />
        <h1>Welcome to MoodGroov</h1>
        <p>Your personalized music experience based on your mood</p>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🎵</div>
            <h3>Discover Music</h3>
            <p>Find new tracks based on your preferences</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎧</div>
            <h3>Create Playlists</h3>
            <p>Build custom playlists for every mood</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Search</h3>
            <p>Find your favorite artists and songs</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Moods</h3>
            <p>See how your music tastes change with your mood</p>
          </div>
        </div>

        <div className="button-group">
          <Button variant="primary" size="large">Get Started</Button>
          <Button variant="secondary" size="large">Learn More</Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
