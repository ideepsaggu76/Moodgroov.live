import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import spotifyService from '../../services/spotifyService';

const Login = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      title: "Intelligent Mood Detection",
      icon: "brain-3d",
      description: "Revolutionary AI that reads your emotions and creates the perfect soundtrack instantly",
      details: "Our AI analyzes your behavior and preferences to create playlists that perfectly match your emotional state. Every track is selected to enhance your mood."
    },
    {
      id: 2,
      title: "Ultimate Customization Studio",
      icon: "cube-3d",
      description: "Craft your perfect musical universe with unlimited creative control",
      details: "Mix and match from over 70 million tracks. Filter by genre, energy level, tempo, and mood. Create the perfect soundtrack that evolves with your taste."
    },
    {
      id: 3,
      title: "Seamless Spotify Integration",
      icon: "sphere-3d",
      description: "Transform your existing music library into an intelligent, mood-aware ecosystem",
      details: "Connect your Spotify to unlock AI-powered recommendations. Analyze your playlists and sync mood-based creations directly to your account."
    }
  ];

  // Video control functions
  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        // Pause video
        setAnimationClass('paused');
        videoRef.current.pause();
        setIsVideoPlaying(false);
        setTimeout(() => setAnimationClass(''), 300);
      } else {
        // Play video
        setAnimationClass('playing');
        videoRef.current.play().catch(console.error);
        setIsVideoPlaying(true);
        setTimeout(() => setAnimationClass(''), 300);
      }
    }
  };

  useEffect(() => {
    // Ensure video plays when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, []);

  useEffect(() => {
    // Sophisticated mirror glow effect that responds to video
    let glowIntensity = 0;
    let glowDirection = 1;
    let hue = 0;
    
    const updateMirrorGlow = () => {
      const logo = document.querySelector('.neon-logo');
      const featureCards = document.querySelectorAll('.feature-card');
      
      if (logo) {
        // Very slow, gentle color transitions like color spreading
        hue = (hue + 0.08) % 360; // Much slower color wheel rotation
        glowIntensity += glowDirection * 0.003; // Much gentler intensity changes
        
        // Reverse direction when reaching limits - more gentle range
        if (glowIntensity >= 0.8) glowDirection = -1;
        if (glowIntensity <= 0.4) glowDirection = 1;
        
        // Create subtle color based on hue and intensity
        const saturation = 60 + (glowIntensity * 20); // 60-80% (less saturated)
        const lightness = 70 + (glowIntensity * 15); // 70-85% (lighter, gentler)
        const glowColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        // Apply gentle glow
        logo.style.setProperty('--neon-color', glowColor);
        logo.style.setProperty('--glow-intensity', glowIntensity * 0.7); // Reduce overall glow intensity
        
        // Animate feature cards with subtle video-responsive effects
        featureCards.forEach((card, index) => {
          const delay = index * 0.1; // Staggered animation
          const cardHue = (hue + (index * 60)) % 360; // Different hue for each card
          const cardGlow = `hsl(${cardHue}, 50%, 70%)`;
          
          setTimeout(() => {
            card.style.setProperty('--card-glow', cardGlow);
            card.style.setProperty('--card-intensity', glowIntensity * 0.3);
          }, delay * 1000);
        });
      }
    };

    // Much slower animation for gentle color spreading effect
    const animationFrame = setInterval(updateMirrorGlow, 100); // ~10fps for slower transitions

    return () => {
      clearInterval(animationFrame);
    };
  }, []);

  return (
    <div className="login-container">
      {/* Video Background */}
      <div className="video-background">
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          preload="metadata"
          className={`bg-video ${isVideoLoaded ? 'loaded' : 'loading'}`}
          onLoadedMetadata={() => {
            setIsVideoLoaded(true);
          }}
          onCanPlayThrough={() => {
            if (videoRef.current) {
              videoRef.current.play().catch(console.error);
            }
          }}
          onCanPlay={() => {
            if (videoRef.current && !isVideoPlaying) {
              videoRef.current.pause();
            }
          }}
        >
          <source src="/background-video.mp4" type="video/mp4" />
          <source src="/background-video.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
        
        {/* Transparent Play/Pause Button */}
        <button 
          className="video-control-btn"
          onClick={toggleVideoPlayback}
          aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
        >
          <div className={`control-icon ${animationClass}`}>
            {isVideoPlaying ? (
              // Pause icon
              <svg viewBox="0 0 24 24" width="20" height="20">
                <rect x="6" y="4" width="4" height="16" fill="currentColor" />
                <rect x="14" y="4" width="4" height="16" fill="currentColor" />
              </svg>
            ) : (
              // Play icon
              <svg viewBox="0 0 24 24" width="20" height="20">
                <polygon points="5,3 19,12 5,21" fill="currentColor" />
              </svg>
            )}
          </div>
        </button>
      </div>

      {/* Left Side - Logo */}
      <div className="left-section">
        <div className="neon-logo">
          <h1 className="logo-text">MOODGROOV</h1>
          <div className="logo-subtitle">Feel the Beat of Your Emotions</div>
        </div>
      </div>

      {/* Right Side - Features */}
      <div className="right-section">
        <div className="features-container">
          <div className="welcome-text">
            <h2>Welcome to the Future of Music</h2>
            <p>Discover how MoodGroov transforms your emotions into the perfect soundtrack</p>
          </div>

          <div className="features-grid">
            {features.map((feature) => {
              const isExpanded = selectedFeature === feature.id || hoveredFeature === feature.id;
              return (
                <div 
                  key={feature.id}
                  className={`feature-card ${
                    isExpanded ? 'expanded' : ''
                  }`}
                  onMouseEnter={() => setHoveredFeature(feature.id)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  onClick={() => 
                    setSelectedFeature(selectedFeature === feature.id ? null : feature.id)
                  }
                >
                  <div className="feature-header">
                    <div className={`feature-icon ${feature.icon}`}></div>
                    <h3 className="feature-title">{feature.title}</h3>
                  </div>
                  <p className="feature-description">{feature.description}</p>
                  
                  <div className={`feature-details ${isExpanded ? 'visible' : ''}`}>
                    <p className="feature-details-text">{feature.details}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="main-spotify-btn" onClick={() => {
            console.log('Main Spotify login clicked');
            window.location.href = spotifyService.getAuthUrl();
          }}>
            <svg className="spotify-logo-main" viewBox="0 0 24 24" width="20" height="20">
              <path fill="white" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span>Login with Spotify</span>
            <div className="btn-glow"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
