import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import spotifyService from '../../services/spotifyService';
import youtubeService from '../../services/youtubeService';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentWallpaper, setCurrentWallpaper] = useState('');
  const [youtubeResults, setYoutubeResults] = useState([]);
  const [currentYouTubeVideo, setCurrentYouTubeVideo] = useState(null);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [trendingMusic, setTrendingMusic] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [youtubePlayer, setYoutubePlayer] = useState(null);
  const [playerState, setPlayerState] = useState(-1); // -1: unstarted, 0: ended, 1: playing, 2: paused
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);

  const navigate = useNavigate();
  const youtubePlayerRef = useRef(null);

  // Initialize YouTube Player API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        console.log('YouTube API ready');
      };
    }
  }, []);

  // Update current time while playing
  useEffect(() => {
    let interval;
    if (youtubePlayer && playerState === 1) {
      interval = setInterval(() => {
        setCurrentTime(youtubePlayer.getCurrentTime());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [youtubePlayer, playerState]);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        if (!spotifyService.isAuthenticated()) {
          navigate('/login');
          return;
        }

        // Load user data
        const userData = await spotifyService.getCurrentUser();
        setUser(userData);

        // Load dashboard data
        await loadDashboardData();
        
        setLoading(false);
      } catch (error) {
        console.error('Dashboard initialization error:', error);
        navigate('/login');
      }
    };

    initializeDashboard();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      const [userPlaylists, recentTracks, userTopTracks, featured, trending] = await Promise.all([
        spotifyService.getUserPlaylists(),
        spotifyService.getRecentlyPlayed(20),
        spotifyService.getTopTracks('short_term', 20),
        spotifyService.getFeaturedPlaylists(10),
        youtubeService.getTrendingMusic(10)
      ]);
      
      setPlaylists(userPlaylists.items || []);
      setRecentlyPlayed(recentTracks.items || []);
      setTopTracks(userTopTracks.items || []);
      setFeaturedPlaylists(featured.playlists?.items || []);
      setTrendingMusic(trending || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const [spotifyResults, youtubeResults] = await Promise.all([
        spotifyService.search(searchQuery, ['track', 'artist', 'album'], 20),
        youtubeService.searchVideos(searchQuery + ' music', 20)
      ]);
      
      setSearchResults(spotifyResults.tracks?.items || []);
      setYoutubeResults(youtubeResults || []);
      setCurrentView('search');
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const playYouTubeVideo = (video) => {
    setCurrentYouTubeVideo(video);
    setCurrentTrack(null);
    setCurrentWallpaper(video.thumbnail);

    // Initialize YouTube player if not already done
    if (window.YT && window.YT.Player) {
      if (youtubePlayer) {
        youtubePlayer.loadVideoById(video.id);
      } else {
        const player = new window.YT.Player('youtube-player', {
          height: '0',
          width: '0',
          videoId: video.id,
          events: {
            onReady: (event) => {
              setYoutubePlayer(event.target);
              setDuration(event.target.getDuration());
              setVolume(event.target.getVolume());
            },
            onStateChange: (event) => {
              setPlayerState(event.data);
              setIsPlaying(event.data === 1);
            }
          },
          playerVars: {
            autoplay: 1,
            controls: 0,
            rel: 0,
            showinfo: 0,
            modestbranding: 1
          }
        });
        setYoutubePlayer(player);
      }
    }
  };

  const togglePlayPause = () => {
    if (youtubePlayer) {
      if (playerState === 1) {
        youtubePlayer.pauseVideo();
      } else {
        youtubePlayer.playVideo();
      }
    }
  };

  const seekTo = (seconds) => {
    if (youtubePlayer) {
      youtubePlayer.seekTo(seconds);
    }
  };

  const setPlayerVolume = (vol) => {
    if (youtubePlayer) {
      youtubePlayer.setVolume(vol);
      setVolume(vol);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playTrack = async (track, isYouTube = false) => {
    try {
      if (isYouTube) {
        playYouTubeVideo(track);
      } else {
        setCurrentTrack(track);
        setCurrentYouTubeVideo(null);
        
        // Set wallpaper to album art
        if (track.album?.images?.[0]?.url) {
          setCurrentWallpaper(track.album.images[0].url);
        }
        
        // Try to play on Spotify
        try {
          await spotifyService.play(null, null, [track.uri]);
          setIsPlaying(true);
        } catch (playError) {
          console.log('Spotify playback not available, showing track info only');
        }
      }
    } catch (error) {
      console.error('Play track error:', error);
    }
  };

  const createPlaylist = async () => {
    if (!newPlaylistName.trim() || !user) return;
    
    try {
      await spotifyService.createPlaylist(user.id, newPlaylistName, 'Created with MoodGroov');
      setNewPlaylistName('');
      setShowCreatePlaylist(false);
      
      // Reload playlists
      const userPlaylists = await spotifyService.getUserPlaylists();
      setPlaylists(userPlaylists.items || []);
    } catch (error) {
      console.error('Create playlist error:', error);
    }
  };

  const loadPlaylistTracks = async (playlist) => {
    try {
      setSelectedPlaylist(playlist);
      const tracks = await spotifyService.getPlaylistTracks(playlist.id);
      setPlaylistTracks(tracks.items || []);
      setCurrentView('playlist');
    } catch (error) {
      console.error('Load playlist tracks error:', error);
    }
  };

  const logout = () => {
    spotifyService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your music universe...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{
      backgroundImage: currentWallpaper ? `url(${currentWallpaper})` : 'none'
    }}>
      <div className="dashboard-overlay"></div>
      
      {/* Navigation Sidebar */}
      <nav className="dashboard-nav">
        <div className="nav-header">
          <h2 className="logo">MoodGroov</h2>
          <div className="user-info">
            {user?.images?.[0] && (
              <img src={user.images[0].url} alt="Profile" className="user-avatar" />
            )}
            <span className="user-name">{user?.display_name}</span>
          </div>
        </div>
        
        <ul className="nav-menu">
          <li className={currentView === 'home' ? 'active' : ''}>
            <button onClick={() => setCurrentView('home')}>
              <span className="nav-icon home-icon-3d"></span>
              Home
            </button>
          </li>
          <li className={currentView === 'search' ? 'active' : ''}>
            <button onClick={() => setCurrentView('search')}>
              <span className="nav-icon search-icon-3d"></span>
              Search
            </button>
          </li>
          <li>
            <button onClick={() => setShowCreatePlaylist(true)}>
              <span className="nav-icon add-icon-3d"></span>
              Create Playlist
            </button>
          </li>
          <li>
            <button onClick={logout}>
              <span className="nav-icon logout-icon-3d"></span>
              Logout
            </button>
          </li>
        </ul>
        
        <div className="playlists-section">
          <h3>Your Playlists</h3>
          <div className="playlist-list">
            {playlists.slice(0, 10).map((playlist) => (
              <button
                key={playlist.id}
                className="playlist-item"
                onClick={() => loadPlaylistTracks(playlist)}
              >
                {playlist.images?.[0] && (
                  <img src={playlist.images[0].url} alt={playlist.name} />
                )}
                <span>{playlist.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Search Bar */}
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for songs, artists, albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="search-btn">
              <span className="search-icon-3d"></span>
            </button>
          </div>
        </div>

        {/* Content Views */}
        {currentView === 'home' && (
          <div className="home-view">
            <div className="content-section">
              <h2>Recently Played</h2>
              <div className="track-grid">
                {recentlyPlayed.slice(0, 6).map((item, index) => (
                  <div
                    key={`${item.track.id}-${index}`}
                    className="track-card glass"
                    onClick={() => playTrack(item.track)}
                  >
                    {item.track.album?.images?.[0] && (
                      <img src={item.track.album.images[0].url} alt={item.track.name} />
                    )}
                    <h4>{item.track.name}</h4>
                    <p>{item.track.artists.map(a => a.name).join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="content-section">
              <h2>Your Top Tracks</h2>
              <div className="track-grid">
                {topTracks.slice(0, 6).map((track) => (
                  <div
                    key={track.id}
                    className="track-card glass"
                    onClick={() => playTrack(track)}
                  >
                    {track.album?.images?.[0] && (
                      <img src={track.album.images[0].url} alt={track.name} />
                    )}
                    <h4>{track.name}</h4>
                    <p>{track.artists.map(a => a.name).join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="content-section">
              <h2>Featured Playlists</h2>
              <div className="track-grid">
                {featuredPlaylists.slice(0, 6).map((playlist) => (
                  <div
                    key={playlist.id}
                    className="track-card glass"
                    onClick={() => loadPlaylistTracks(playlist)}
                  >
                    {playlist.images?.[0] && (
                      <img src={playlist.images[0].url} alt={playlist.name} />
                    )}
                    <h4>{playlist.name}</h4>
                    <p>{playlist.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="content-section">
              <h2>Trending on YouTube</h2>
              <div className="track-grid">
                {trendingMusic.slice(0, 6).map((video) => (
                  <div
                    key={video.id}
                    className="track-card glass"
                    onClick={() => playTrack(video, true)}
                  >
                    <img src={video.thumbnail} alt={video.title} />
                    <h4>{video.title.length > 30 ? video.title.substring(0, 30) + '...' : video.title}</h4>
                    <p>{video.channelTitle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView === 'search' && (
          <div className="search-view">
            <h2>Search Results</h2>
            
            {searchResults.length > 0 && (
              <div className="content-section">
                <h3>Spotify Tracks</h3>
                <div className="track-grid">
                  {searchResults.map((track) => (
                    <div
                      key={track.id}
                      className="track-card glass"
                      onClick={() => playTrack(track)}
                    >
                      {track.album?.images?.[0] && (
                        <img src={track.album.images[0].url} alt={track.name} />
                      )}
                      <h4>{track.name}</h4>
                      <p>{track.artists.map(a => a.name).join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {youtubeResults.length > 0 && (
              <div className="content-section">
                <h3>YouTube Music</h3>
                <div className="track-grid">
                  {youtubeResults.map((video) => (
                    <div
                      key={video.id}
                      className="track-card glass"
                      onClick={() => playTrack(video, true)}
                    >
                      <img src={video.thumbnail} alt={video.title} />
                      <h4>{video.title.length > 30 ? video.title.substring(0, 30) + '...' : video.title}</h4>
                      <p>{video.channelTitle}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'playlist' && selectedPlaylist && (
          <div className="playlist-view">
            <div className="playlist-header glass">
              {selectedPlaylist.images?.[0] && (
                <img src={selectedPlaylist.images[0].url} alt={selectedPlaylist.name} />
              )}
              <div>
                <h2>{selectedPlaylist.name}</h2>
                <p>{selectedPlaylist.description}</p>
                <span>{playlistTracks.length} tracks</span>
              </div>
            </div>
            
            <div className="track-list">
              {playlistTracks.map((item, index) => (
                <div
                  key={`${item.track?.id}-${index}`}
                  className="track-row glass"
                  onClick={() => item.track && playTrack(item.track)}
                >
                  <span className="track-number">{index + 1}</span>
                  {item.track?.album?.images?.[0] && (
                    <img src={item.track.album.images[0].url} alt={item.track.name} />
                  )}
                  <div className="track-info">
                    <h4>{item.track?.name}</h4>
                    <p>{item.track?.artists?.map(a => a.name).join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Music Player */}
      {(currentTrack || currentYouTubeVideo) && (
        <div className="music-player glass">
          <div className="player-info">
            {currentTrack && (
              <>
                {currentTrack.album?.images?.[0] && (
                  <img src={currentTrack.album.images[0].url} alt={currentTrack.name} className="player-artwork" />
                )}
                <div className="track-details">
                  <h4>{currentTrack.name}</h4>
                  <p>{currentTrack.artists.map(a => a.name).join(', ')}</p>
                </div>
              </>
            )}
            {currentYouTubeVideo && (
              <>
                <img src={currentYouTubeVideo.thumbnail} alt={currentYouTubeVideo.title} className="player-artwork" />
                <div className="track-details">
                  <h4>{currentYouTubeVideo.title}</h4>
                  <p>{currentYouTubeVideo.channelTitle}</p>
                </div>
              </>
            )}
          </div>
          
          {currentYouTubeVideo && (
            <>
              <div className="player-controls">
                <button onClick={togglePlayPause} className="play-pause-btn">
                  <span className={playerState === 1 ? "pause-icon-3d" : "play-icon-3d"}></span>
                </button>

                <div className="progress-container">
                  <span className="time-display">{formatTime(currentTime)}</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    ></div>
                    <input
                      type="range"
                      min="0"
                      max={duration || 100}
                      value={currentTime}
                      onChange={(e) => seekTo(parseFloat(e.target.value))}
                      className="progress-slider"
                    />
                  </div>
                  <span className="time-display">{formatTime(duration)}</span>
                </div>

                <div className="volume-control">
                  <span className="volume-icon-3d"></span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setPlayerVolume(parseInt(e.target.value))}
                    className="volume-slider"
                  />
                </div>
              </div>

              <div className="youtube-player-container">
                <div id="youtube-player"></div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreatePlaylist && (
        <div className="modal-overlay">
          <div className="modal glass">
            <h3>Create New Playlist</h3>
            <input
              type="text"
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createPlaylist()}
            />
            <div className="modal-actions">
              <button onClick={createPlaylist} className="create-btn">Create</button>
              <button onClick={() => setShowCreatePlaylist(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
