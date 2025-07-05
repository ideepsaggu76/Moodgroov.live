import React, { useState, useEffect } from 'react';
import '../../styles/Dashboard.css';
import Button from '../../components/Button';

// Mock data for music tracks - in a real app, you'd fetch this from an API
const mockTracks = [
	{
		id: 1,
		title: 'Blinding Lights',
		artist: 'The Weeknd',
		poster: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
		audioUrl: 'https://example.com/audio1.mp3',
	},
	{
		id: 2,
		title: 'Circles',
		artist: 'Post Malone',
		poster: 'https://i.scdn.co/image/ab67616d0000b273b1c4b76e23414c9f20242268',
		audioUrl: 'https://example.com/audio2.mp3',
	},
	{
		id: 3,
		title: "Don't Start Now",
		artist: 'Dua Lipa',
		poster: 'https://i.scdn.co/image/ab67616d0000b273bd26ede1ae69327010d49946',
		audioUrl: 'https://example.com/audio3.mp3',
	},
	{
		id: 4,
		title: 'Watermelon Sugar',
		artist: 'Harry Styles',
		poster: 'https://i.scdn.co/image/ab67616d0000b273e2e352d89826aef6dbd5ff8f',
		audioUrl: 'https://example.com/audio4.mp3',
	},
	{
		id: 5,
		title: 'Bad Guy',
		artist: 'Billie Eilish',
		poster: 'https://i.scdn.co/image/ab67616d0000b27350a3147b4edd7701a876c6ce',
		audioUrl: 'https://example.com/audio5.mp3',
	},
];

const Dashboard = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [tracks, setTracks] = useState(mockTracks);
	const [currentTrack, setCurrentTrack] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);

	// Filter tracks based on search query
	useEffect(() => {
		if (!searchQuery.trim()) {
			setTracks(mockTracks);
			return;
		}

		const filteredTracks = mockTracks.filter(
			(track) =>
				track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				track.artist.toLowerCase().includes(searchQuery.toLowerCase())
		);

		setTracks(filteredTracks);
	}, [searchQuery]);

	// Handle playing a track
	const playTrack = (track) => {
		setCurrentTrack(track);
		setIsPlaying(true);
		// In a real app, you would play the audio file here
	};

	// Toggle play/pause
	const togglePlayPause = () => {
		setIsPlaying(!isPlaying);
		// In a real app, you would toggle the audio playback
	};

	return (
		<div
			className="dashboard-container"
			style={{
				backgroundImage: currentTrack ? `url(${currentTrack.poster})` : 'none',
			}}
		>
			<div className="dashboard-overlay"></div>

			<div className="dashboard-content">
				<h1>MoodGroov Dashboard</h1>

				{/* Search Bar */}
				<div className="search-container">
					<input
						type="text"
						placeholder="Search for songs or artists..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="search-input"
					/>
					<Button variant="primary" size="medium">
						Search
					</Button>
				</div>

				{/* Tracks Grid */}
				<div className="tracks-grid">
					{tracks.map((track) => (
						<div
							key={track.id}
							className="track-card"
							onClick={() => playTrack(track)}
						>
							<div className="track-image">
								<img src={track.poster} alt={track.title} />
								<div className="play-overlay">
									<span className="play-icon">▶</span>
								</div>
							</div>
							<div className="track-info">
								<h3>{track.title}</h3>
								<p>{track.artist}</p>
							</div>
						</div>
					))}
				</div>

				{/* Music Player */}
				{currentTrack && (
					<div className="music-player">
						<div className="player-left">
							<img
								src={currentTrack.poster}
								alt={currentTrack.title}
								className="player-image"
							/>
						</div>
						<div className="player-center">
							<div className="track-details">
								<h3>{currentTrack.title}</h3>
								<p>{currentTrack.artist}</p>
							</div>
							<div className="player-controls">
								<button className="control-button">⏮</button>
								<button
									className="control-button play-button"
									onClick={togglePlayPause}
								>
									{isPlaying ? '⏸' : '▶'}
								</button>
								<button className="control-button">⏭</button>
							</div>
							<div className="progress-bar">
								<div className="progress-fill" style={{ width: '30%' }}></div>
							</div>
						</div>
						<div className="player-right">
							<div className="volume-control">
								<span className="volume-icon">🔊</span>
								<input
									type="range"
									min="0"
									max="100"
									defaultValue="80"
									className="volume-slider"
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
