import axios from 'axios';

class YouTubeService {
  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    this.baseUrl = 'https://www.googleapis.com/youtube/v3';
  }

  // Search for videos
  async searchVideos(query, maxResults = 20) {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults: maxResults,
          key: this.apiKey,
          videoCategoryId: '10', // Music category
          order: 'relevance'
        }
      });

      return response.data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`
      }));
    } catch (error) {
      console.error('YouTube search error:', error);
      throw error;
    }
  }

  // Search for music specifically
  async searchMusic(artist, track, maxResults = 10) {
    const query = `${artist} ${track} official audio`;
    return await this.searchVideos(query, maxResults);
  }

  // Get video details
  async getVideoDetails(videoId) {
    try {
      const response = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          part: 'snippet,contentDetails,statistics',
          id: videoId,
          key: this.apiKey
        }
      });

      const video = response.data.items[0];
      if (!video) {
        throw new Error('Video not found');
      }

      return {
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
        channelTitle: video.snippet.channelTitle,
        publishedAt: video.snippet.publishedAt,
        duration: video.contentDetails.duration,
        viewCount: video.statistics.viewCount,
        likeCount: video.statistics.likeCount,
        url: `https://www.youtube.com/watch?v=${video.id}`
      };
    } catch (error) {
      console.error('YouTube video details error:', error);
      throw error;
    }
  }

  // Get trending music videos
  async getTrendingMusic(maxResults = 20) {
    try {
      const response = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          part: 'snippet,statistics',
          chart: 'mostPopular',
          videoCategoryId: '10', // Music category
          maxResults: maxResults,
          key: this.apiKey,
          regionCode: 'US'
        }
      });

      return response.data.items.map(item => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        viewCount: item.statistics.viewCount,
        likeCount: item.statistics.likeCount,
        url: `https://www.youtube.com/watch?v=${item.id}`
      }));
    } catch (error) {
      console.error('YouTube trending error:', error);
      throw error;
    }
  }

  // Get music playlists
  async searchPlaylists(query, maxResults = 20) {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          part: 'snippet',
          q: query,
          type: 'playlist',
          maxResults: maxResults,
          key: this.apiKey,
          order: 'relevance'
        }
      });

      return response.data.items.map(item => ({
        id: item.id.playlistId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        url: `https://www.youtube.com/playlist?list=${item.id.playlistId}`
      }));
    } catch (error) {
      console.error('YouTube playlist search error:', error);
      throw error;
    }
  }

  // Get playlist videos
  async getPlaylistVideos(playlistId, maxResults = 50) {
    try {
      const response = await axios.get(`${this.baseUrl}/playlistItems`, {
        params: {
          part: 'snippet',
          playlistId: playlistId,
          maxResults: maxResults,
          key: this.apiKey
        }
      });

      return response.data.items.map(item => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`
      }));
    } catch (error) {
      console.error('YouTube playlist videos error:', error);
      throw error;
    }
  }

  // Extract video ID from YouTube URL
  extractVideoId(url) {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  // Format duration from ISO 8601 format
  formatDuration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';

    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');

    let formatted = '';
    if (hours) {
      formatted += `${hours}:`;
    }
    
    if (minutes) {
      formatted += hours ? minutes.padStart(2, '0') : minutes;
    } else {
      formatted += '0';
    }
    
    formatted += ':';
    formatted += seconds ? seconds.padStart(2, '0') : '00';

    return formatted;
  }

  // Create YouTube embed URL
  getEmbedUrl(videoId, autoplay = false, controls = true) {
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      controls: controls ? '1' : '0',
      rel: '0',
      showinfo: '0',
      modestbranding: '1'
    });

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }
}

const youtubeServiceInstance = new YouTubeService();
export default youtubeServiceInstance;
