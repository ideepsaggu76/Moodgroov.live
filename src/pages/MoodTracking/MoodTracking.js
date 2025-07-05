import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MoodTracking.css';

const MoodTracking = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const navigate = useNavigate();

  const moods = [
    { emoji: '😊', name: 'Happy', color: '#FFD700' },
    { emoji: '😢', name: 'Sad', color: '#4169E1' },
    { emoji: '😠', name: 'Angry', color: '#FF4500' },
    { emoji: '😰', name: 'Anxious', color: '#9370DB' },
    { emoji: '😌', name: 'Calm', color: '#32CD32' },
    { emoji: '😴', name: 'Tired', color: '#708090' },
    { emoji: '😎', name: 'Confident', color: '#FF1493' },
    { emoji: '🤔', name: 'Thoughtful', color: '#20B2AA' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save the mood data
    alert('Mood tracked successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="mood-tracking-container">
      <header className="mood-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Track Your Mood</h1>
      </header>

      <main className="mood-main">
        <form onSubmit={handleSubmit} className="mood-form">
          <div className="mood-selection">
            <h2>How are you feeling?</h2>
            <div className="mood-grid">
              {moods.map((mood) => (
                <button
                  key={mood.name}
                  type="button"
                  className={`mood-button ${selectedMood === mood.name ? 'selected' : ''}`}
                  onClick={() => setSelectedMood(mood.name)}
                  style={{ '--mood-color': mood.color }}
                >
                  <span className="mood-emoji">{mood.emoji}</span>
                  <span className="mood-name">{mood.name}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedMood && (
            <div className="intensity-section">
              <h3>Intensity Level: {intensity}/10</h3>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
                className="intensity-slider"
              />
              <div className="intensity-labels">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          )}

          <div className="note-section">
            <h3>Additional Notes (Optional)</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's on your mind? Any specific thoughts or events that influenced your mood?"
              className="mood-note"
              rows="4"
            />
          </div>

          <button
            type="submit"
            className="submit-mood-btn"
            disabled={!selectedMood}
          >
            Track Mood
          </button>
        </form>
      </main>
    </div>
  );
};

export default MoodTracking;
