# Maybank Place Finder

A modern React application for discovering and exploring places in Kuala Lumpur, built with TypeScript and Redux.

## Project Overview

Place Finder is a full-featured location discovery application that allows users to:
- Search for places using Google Places API and Google Place Autocomplete API
- View places on an interactive map
- Get detailed information about each location
- Access directions to selected places
- View place information and ratings

## Technical Stack

### Core Technologies
- **React 18** - UI library
- **TypeScript** - Type safety and better developer experience
- **Redux Toolkit** - State management
- **Google Maps API** - Maps and places data
- **Ant Design** - UI component library
- **Vite** - Build tool and development server

### Key Features
- **Responsive Design** - Fully responsive layout with mobile-first approach
- **Real-time Search** - Autocomplete suggestions for place search
- **Interactive Map** - Google Maps integration with markers and place selection
- **State Management** - Centralized state with Redux and middleware
- **Error Handling** - Graceful fallback to mock data when API fails
- **Type Safety** - Full TypeScript implementation for robust code

## Architecture

### Project Structure
```
src/
├── components/         # React components
├── store/             # Redux store and slices
├── services/          # API and external services
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── styles/            # Global styles
```

### Key Components
- **App.tsx** - Main application component and layout
- **SearchBar** - Search functionality with autocomplete
- **Map** - Google Maps integration
- **PlaceList** - List of search results
- **PlaceCard** - Individual place display

### State Management
- **Redux Store** - Central state management

### Services
- **placesService** - Google Places API integration
- **API Configuration** - Centralized API settings
- **Mock Data** - Fallback data for testing and failures

## Notable Features

### 1. Advanced Search
- Real-time autocomplete suggestions
- Location-based search within Kuala Lumpur
- Quick search suggestions

### 2. Interactive Map
- Dynamic markers for search results
- Smooth transitions on place selection
- Responsive map controls

### 3. Mobile Optimization
- Responsive layout
- Bottom sheet for mobile place list
- Touch-friendly interactions

### 4. Error Handling
- Graceful degradation with mock data
- Service initialization retry mechanism
- Comprehensive error states

## Performance Considerations

1. **Code Splitting**
   - Component-based splitting
   - Lazy loading of map components

2. **State Management**
   - Efficient Redux updates

3. **API Optimization**
   - Debounced search
   - Caching of place data

## Testing and Quality

- TypeScript for type safety
- Error boundary implementation
- Consistent code style with ESLint

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_api_key
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## Build and Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```