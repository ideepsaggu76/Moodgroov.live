import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MusicRecommendations.css';

const MusicRecommendations = () => {
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState('');
  const [currentMood, setCurrentMood] = useState('Happy');

  const recommendations = {
    Happy: [
      { title: "Good as Hell", artist: "Lizzo", genre: "Pop", duration: "3:31" },
      { title: "Can't Stop the Feeling", artist: "Justin Timberlake", genre: "Pop", duration: "3:56" },
      { title: "Walking on Sunshine", artist: "Katrina & The Waves", genre: "Rock", duration: "3:58" },
      { title: "Happy", artist: "Pharrell Williams", genre: "Pop", duration: "3:53" }
    ],
    Sad: [
      { title: "Someone Like You", artist: "Adele", genre: "Pop", duration: "4:45" },
      { title: "Mad World", artist: "Gary Jules", genre: "Alternative", duration: "3:07" },
      { title: "Hurt", artist: "Johnny Cash", genre: "Country", duration: "3:38" },
      { title: "The Sound of Silence", artist: "Simon & Garfunkel", genre: "Folk", duration: "3:05" }
    ],
    Calm: [
      { title: "Weightless", artist: "Marconi Union", genre: "Ambient", duration: "8:10" },
      { title: "Clair de Lune", artist: "Claude Debussy", genre: "Classical", duration: "4:42" },
      { title: "River", artist: "Joni Mitchell", genre: "Folk", duration: "4:00" },
      { title: "Aqueous Transmission", artist: "Incubus", genre: "Alternative", duration: "7:49" }
    ],
    Energetic: [
      { title: "Pump It", artist: "Black Eyed Peas", genre: "Hip-Hop", duration: "3:33" },
      { title: "Eye of the Tiger", artist: "Survivor", genre: "Rock", duration: "4:05" },
      { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", genre: "Funk", duration: "4:30" },
      { title: "Thunder", artist: "Imagine Dragons", genre: "Pop Rock", duration: "3:07" }
    ]
  };

  const moods = ['Happy', 'Sad', 'Calm', 'Energetic'];
  const genres = ['All', 'Pop', 'Rock', 'Hip-Hop', 'Classical', 'Jazz', 'Folk', 'Alternative'];

  const filteredSongs = selectedGenre && selectedGenre !== 'All' 
    ? recommendations[currentMood].filter(song => song.genre === selectedGenre)
    : recommendations[currentMood];

  return (
    <div className="music-recommendations-container">
      <header className="music-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Music Recommendations</h1>
      </header>

      <main className="music-main">
        <div className="music-content">
          <div className="mood-selector">
            <h2>Select Your Current Mood</h2>
            <div className="mood-buttons">
              {moods.map(mood => (
                <button
                  key={mood}
                  className={`mood-btn ${currentMood === mood ? 'active' : ''}`}
                  onClick={() => setCurrentMood(mood)}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          <div className="genre-filter">
            <h3>Filter by Genre</h3>
            <select 
              value={selectedGenre} 
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="genre-select"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          <div className="recommendations-section">
            <h3>Recommended for {currentMood} Mood</h3>
            <div className="songs-grid">
              {filteredSongs.map((song, index) => (
                <div key={index} className="song-card">
                  <div className="song-info">
                    <h4 className="song-title">{song.title}</h4>
                    <p className="song-artist">{song.artist}</p>
                    <div className="song-details">
                      <span className="song-genre">{song.genre}</span>
                      <span className="song-duration">{song.duration}</span>
                    </div>
                  </div>
                  <div className="song-actions">
                    <button className="play-btn">▶️ Play</button>
                    <button className="like-btn">❤️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredSongs.length === 0 && (
            <div className="no-results">
              <p>No songs found for the selected mood and genre combination.</p>
              <button onClick={() => setSelectedGenre('')} className="reset-btn">
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MusicRecommendations;
