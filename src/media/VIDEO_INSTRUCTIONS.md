# Video Background Instructions

## Adding Your Background Video

To add a background video to the login page:

1. **Place your video file** in this `src/media/` folder
2. **Supported formats**: MP4, WebM, OGV
3. **Recommended specs**:
   - Resolution: 1920x1080 (Full HD)
   - Duration: 10-30 seconds (it will loop)
   - File size: Under 10MB for better performance
   - Frame rate: 30fps

## Example Video Sources

You can get free background videos from:
- [Pixabay](https://pixabay.com/videos/)
- [Pexels](https://www.pexels.com/videos/)
- [Unsplash](https://unsplash.com/videos)

## To Enable Video Background

Once you have your video file, update the Login.js file:

```jsx
// In Login.js, line 49-52, replace with:
<video autoPlay muted loop className="bg-video">
  <source src="/src/media/your-video-name.mp4" type="video/mp4" />
  <source src="/src/media/your-video-name.webm" type="video/webm" />
</video>
```

## Current Fallback

Right now, the page uses an animated gradient background that changes colors automatically. This creates a beautiful moving background effect even without a video file.

## Video Effect Features

The neon logo color will automatically change every 3 seconds to simulate responding to video movement. You can customize this in the `useEffect` hook in Login.js.

## Performance Tips

- Compress your video for web use
- Use modern formats like WebM for better compression
- Consider using a CDN for larger video files
- Test on mobile devices for performance
