# MoodGroov - React Web App

## Project Overview
MoodGroov is a responsive React web application designed to track user moods and provide personalized music recommendations. The app is built with mobile-first design principles and can be easily converted to an Android app in the future.

## Project Structure

```
moodgroov-app/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/          # Shared components across the app
│   │   └── ui/              # UI-specific components (buttons, inputs, etc.)
│   ├── pages/
│   │   ├── Login/
│   │   │   ├── Login.js     # Login page component
│   │   │   └── Login.css    # Login page styles
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.js # Dashboard page component
│   │   │   └── Dashboard.css # Dashboard page styles
│   │   ├── MoodTracking/
│   │   │   ├── MoodTracking.js # Mood tracking page
│   │   │   └── MoodTracking.css # Mood tracking styles
│   │   └── MusicRecommendations/
│   │       ├── MusicRecommendations.js # Music recommendations page
│   │       └── MusicRecommendations.css # Music recommendations styles
│   ├── styles/              # Global styles
│   ├── utils/               # Utility functions
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API services
│   ├── assets/              # Images, icons, etc.
│   ├── App.js               # Main app component with routing
│   ├── App.css              # Global app styles
│   └── index.js             # App entry point
├── package.json
└── README.md
```

## Features

### ✅ Implemented
- **Responsive Design**: Mobile-first approach with breakpoints for all screen sizes
- **Login Page**: Clean authentication interface
- **Dashboard**: Overview of user's mood tracking and quick actions
- **Mood Tracking**: Interactive mood selection with intensity levels and notes
- **Music Recommendations**: Mood-based music suggestions with genre filtering
- **Navigation**: Seamless routing between pages
- **Modern UI**: Clean, gradient-based design with animations

### 🔄 Ready for Future Implementation
- User authentication and backend integration
- Persistent data storage
- Music streaming integration (Spotify, Apple Music, etc.)
- Advanced mood analytics and charts
- Social features and mood sharing
- Push notifications for mood reminders

## Design Principles

1. **Separation of Concerns**: Each page has its own folder with component and styles
2. **Mobile-First**: Responsive design starting from mobile up to desktop
3. **Component Isolation**: Changes to one page don't affect others
4. **Scalable Architecture**: Easy to add new features and pages
5. **Modern React**: Uses functional components with hooks

## Responsive Breakpoints

- **Mobile**: up to 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px and above

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Future Android Conversion

The app is built with mobile-first principles and uses:
- Responsive design suitable for mobile screens
- Touch-friendly interface elements
- PWA-ready structure
- React Native compatibility considerations

For Android conversion, consider:
- React Native
- Capacitor for hybrid app development
- PWA with app-like features

## Color Scheme

- **Primary**: #667eea (Blue gradient start)
- **Secondary**: #764ba2 (Purple gradient end)
- **Background**: #f4f7fa (Light blue-gray)
- **Text**: #333 (Dark gray)
- **Accent**: Various mood-based colors

## Technology Stack

- **React** (Functional Components + Hooks)
- **React Router** (Navigation)
- **CSS3** (Custom styling with flexbox/grid)
- **ES6+** (Modern JavaScript)

The project structure ensures that each feature is modular and maintainable, making it easy to extend and modify individual components without affecting the entire application.
