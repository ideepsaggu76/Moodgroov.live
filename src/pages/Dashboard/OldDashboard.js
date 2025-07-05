import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>MoodGroov Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="dashboard-grid">
          <div className="dashboard-card welcome-card">
            <h2>Welcome back!</h2>
            <p>Track your mood and discover music that matches your feelings.</p>
          </div>
          
          <div className="dashboard-card stats-card">
            <h3>Today's Mood</h3>
            <div className="mood-display">
              <span className="mood-emoji">😊</span>
              <span className="mood-text">Happy</span>
            </div>
          </div>
          
          <div className="dashboard-card quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button 
                className="action-btn mood-btn"
                onClick={() => navigate('/mood-tracking')}
              >
                📊 Track Mood
              </button>
              <button 
                className="action-btn music-btn"
                onClick={() => navigate('/music-recommendations')}
              >
                🎵 Get Music
              </button>
            </div>
          </div>
          
          <div className="dashboard-card recent-activity">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-emoji">😊</span>
                <span className="activity-text">Felt happy - 2 hours ago</span>
              </div>
              <div className="activity-item">
                <span className="activity-emoji">🎵</span>
                <span className="activity-text">Listened to Jazz playlist - 5 hours ago</span>
              </div>
              <div className="activity-item">
                <span className="activity-emoji">😌</span>
                <span className="activity-text">Felt calm - Yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
