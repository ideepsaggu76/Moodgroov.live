import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

class SpotifyService {
  constructor() {
    this.clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
    this.redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
    this.scopes = [
      'user-read-private',
      'user-read-email',
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
      'user-read-recently-played',
      'user-top-read',
      'user-library-read',
      'user-library-modify',
      'playlist-read-private',
      'playlist-read-collaborative',
      'playlist-modify-public',
      'playlist-modify-private',
      'streaming'
    ];
  }

  // Generate Spotify authorization URL
  getAuthUrl() {
    const state = this.generateRandomString(16);
    localStorage.setItem('spotify_auth_state', state);
    
    // Debug logging
    console.log('Spotify Auth Debug Info:');
    console.log('Client ID:', this.clientId);
    console.log('Redirect URI:', this.redirectUri);
    console.log('State:', state);
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      scope: this.scopes.join(' '),
      redirect_uri: this.redirectUri,
      state: state,
      show_dialog: true
    });

    const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
    console.log('Generated Auth URL:', authUrl);
    
    return authUrl;
  }

  // Generate random string for state parameter
  generateRandomString(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }

  // Exchange authorization code for access token
  async getAccessToken(code, state) {
    const storedState = localStorage.getItem('spotify_auth_state');
    
    if (state !== storedState) {
      throw new Error('State mismatch');
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret)
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.redirectUri
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    
    // Store tokens
    localStorage.setItem('spotify_access_token', data.access_token);
    localStorage.setItem('spotify_refresh_token', data.refresh_token);
    localStorage.setItem('spotify_token_expires', Date.now() + (data.expires_in * 1000));
    
    // Set access token for spotify API
    spotifyApi.setAccessToken(data.access_token);
    
    return data;
  }

  // Refresh access token
  async refreshAccessToken() {
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret)
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    const data = await response.json();
    
    localStorage.setItem('spotify_access_token', data.access_token);
    localStorage.setItem('spotify_token_expires', Date.now() + (data.expires_in * 1000));
    
    spotifyApi.setAccessToken(data.access_token);
    
    return data;
  }

  // Check if token is valid and refresh if needed
  async ensureValidToken() {
    const token = localStorage.getItem('spotify_access_token');
    const expires = localStorage.getItem('spotify_token_expires');
    
    if (!token) {
      throw new Error('No access token available');
    }

    if (expires && Date.now() > parseInt(expires)) {
      await this.refreshAccessToken();
    } else {
      spotifyApi.setAccessToken(token);
    }
  }

  // Get current user profile
  async getCurrentUser() {
    await this.ensureValidToken();
    return await spotifyApi.getMe();
  }

  // Get user's playlists
  async getUserPlaylists(limit = 50) {
    await this.ensureValidToken();
    return await spotifyApi.getUserPlaylists({ limit });
  }

  // Get recently played tracks
  async getRecentlyPlayed(limit = 50) {
    await this.ensureValidToken();
    return await spotifyApi.getMyRecentlyPlayedTracks({ limit });
  }

  // Get user's top tracks
  async getTopTracks(timeRange = 'medium_term', limit = 50) {
    await this.ensureValidToken();
    return await spotifyApi.getMyTopTracks({ time_range: timeRange, limit });
  }

  // Get user's top artists
  async getTopArtists(timeRange = 'medium_term', limit = 50) {
    await this.ensureValidToken();
    return await spotifyApi.getMyTopArtists({ time_range: timeRange, limit });
  }

  // Get user's saved tracks
  async getSavedTracks(limit = 50) {
    await this.ensureValidToken();
    return await spotifyApi.getMySavedTracks({ limit });
  }

  // Get user's saved albums
  async getSavedAlbums(limit = 50) {
    await this.ensureValidToken();
    return await spotifyApi.getMySavedAlbums({ limit });
  }

  // Search for tracks, artists, albums, playlists
  async search(query, types = ['track'], limit = 20) {
    await this.ensureValidToken();
    return await spotifyApi.search(query, types, { limit });
  }

  // Get playlist tracks
  async getPlaylistTracks(playlistId, limit = 100) {
    await this.ensureValidToken();
    return await spotifyApi.getPlaylistTracks(playlistId, { limit });
  }

  // Create a new playlist
  async createPlaylist(userId, name, description = '', isPublic = true) {
    await this.ensureValidToken();
    return await spotifyApi.createPlaylist(userId, {
      name,
      description,
      public: isPublic
    });
  }

  // Add tracks to playlist
  async addTracksToPlaylist(playlistId, trackUris) {
    await this.ensureValidToken();
    return await spotifyApi.addTracksToPlaylist(playlistId, trackUris);
  }

  // Get current playback state
  async getCurrentPlaybackState() {
    await this.ensureValidToken();
    return await spotifyApi.getMyCurrentPlaybackState();
  }

  // Get currently playing track
  async getCurrentlyPlaying() {
    await this.ensureValidToken();
    return await spotifyApi.getMyCurrentPlayingTrack();
  }

  // Play/pause playback
  async play(deviceId = null, contextUri = null, uris = null, offset = null) {
    await this.ensureValidToken();
    const options = {};
    if (deviceId) options.device_id = deviceId;
    if (contextUri) options.context_uri = contextUri;
    if (uris) options.uris = uris;
    if (offset) options.offset = offset;
    
    return await spotifyApi.play(options);
  }

  async pause() {
    await this.ensureValidToken();
    return await spotifyApi.pause();
  }

  // Skip to next/previous track
  async skipToNext() {
    await this.ensureValidToken();
    return await spotifyApi.skipToNext();
  }

  async skipToPrevious() {
    await this.ensureValidToken();
    return await spotifyApi.skipToPrevious();
  }

  // Set volume
  async setVolume(volumePercent) {
    await this.ensureValidToken();
    return await spotifyApi.setVolume(volumePercent);
  }

  // Get featured playlists
  async getFeaturedPlaylists(limit = 20) {
    await this.ensureValidToken();
    return await spotifyApi.getFeaturedPlaylists({ limit });
  }

  // Get new releases
  async getNewReleases(limit = 20) {
    await this.ensureValidToken();
    return await spotifyApi.getNewReleases({ limit });
  }

  // Check if user has valid token
  isAuthenticated() {
    const token = localStorage.getItem('spotify_access_token');
    const expires = localStorage.getItem('spotify_token_expires');
    
    return token && expires && Date.now() < parseInt(expires);
  }

  // Logout user
  logout() {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expires');
    localStorage.removeItem('spotify_auth_state');
    spotifyApi.setAccessToken(null);
  }
}

const spotifyServiceInstance = new SpotifyService();
export default spotifyServiceInstance;
