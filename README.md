# Maybank Place Finder

A modern single-page application built with React, TypeScript, and Redux for discovering and exploring places in Kuala Lumpur. This application utilizes the Google Places API for autocomplete functionality and displays results on an interactive map.

Demo: maybank-place-finder.vercel.app

## Project Overview

Place Finder allows users to:
- Search for places using the Google Places Autocomplete API
- View places on an interactive map with detailed info windows
- Get detailed information about each location including:
  - Place photos from Google Places API
  - Place names and addresses
  - Direct access to Google Maps directions
- Access directions to selected places
- View place information and ratings

## Assessment of Requirements

1. **Autocomplete Functionality**:
   - The project implements Google Place Autocomplete API through the `SearchBar` component with region restriction to Malaysia
   - Suggests places as the user types with graceful handling of ZERO_RESULTS
   - Custom hook `useGoogleMapsService` manages the service lifecycle

2. **Fallback Option**:
   - The application has a fallback mechanism using mock data in the `placesService.ts` file
   - Quick suggestion buttons for common searches
   - Clear feedback when API fails or returns no results

3. **State Management**:
   - Redux is used for state management, with the `placesSlice` managing search results and user queries
   - Implements proper state handling for place selection and search results

4. **Middleware Integration**:
   - The project uses Redux Thunk for handling asynchronous actions
   - Integrated into the `placesSlice` for fetching places and photos

5. **User Interface**:
   - Clean and modern UI using Ant Design components
   - Enhanced info windows with place photos and directions
   - Responsive layout for both desktop and mobile

6. **Code Structure**:
   - Organized with custom hooks for reusable logic
   - Clean separation of concerns with marker management
   - Type-safe implementations throughout the codebase

## Technical Stack

- **React 18** - UI library
- **TypeScript** - Type safety and better developer experience
- **Redux Toolkit** - State management
- **Google Maps API** - Maps, places data, and photos
- **Ant Design** - UI component library
- **Vite** - Build tool and development server

## Architecture

### Project Structure
```
src/
├── components/ # React components
├── data/ # Data of Maybank Branches
├── store/ # Redux store and slices
├── services/ # API and external services
├── hooks/ # Custom React hooks
├── types/ # TypeScript type definitions
├── utils/ # Utility functions
└── styles/ # Global styles
```

### Key Components
- **App.tsx** - Main application component and layout
- **SearchBar** - Search functionality with autocomplete
- **Map** - Google Maps integration with Advanced Markers
- **PlaceList** - List of search results
- **PlaceCard** - Individual place display with photos
- **PlaceInfoWindow** - Enhanced place information display

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_api_key
   VITE_GOOGLE_MAPS_ID=your_map_id  # Required for Advanced Markers
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