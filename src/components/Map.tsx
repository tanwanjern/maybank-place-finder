import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { RootState } from '../store/store';
import { Spin } from 'antd';
import PlaceInfoWindow from './PlaceInfoWindow';
import { useMarkers } from '../hooks/useMarkers';
import { Place } from '../types/place';

// Required libraries for Google Maps functionality
const LIBRARIES: ("places" | "marker")[] = ["places", "marker"];

// Default map center (Kuala Lumpur)
const DEFAULT_CENTER = { lat: 3.1390, lng: 101.6869 };

// Map configuration options
const MAP_OPTIONS = {
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  mapId: import.meta.env.VITE_GOOGLE_MAPS_ID
};

const Map: React.FC = () => {
  // Redux state for places
  const { selectedPlace, searchResults } = useSelector((state: RootState) => state.places);
  
  // Local state and refs
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Load Google Maps with required libraries
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES
  });

  // Setup markers
  const placesToShow = selectedPlace ? [selectedPlace] : searchResults;
  useMarkers({
    map: mapRef.current,
    places: placesToShow,
    onMarkerClick: setActiveMarker,
    isMapLoaded
  });

  // Handle loading states
  if (loadError) {
    return (
      <div className="loading-container">
        <p>Error loading maps. Please check your API key and try again.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  // Render info window for a place
  const renderInfoWindow = (place: Place) => (
    activeMarker === place.id && (
      <PlaceInfoWindow
        key={place.id}
        place={place}
        onClose={() => setActiveMarker(null)}
      />
    )
  );

  return (
    <GoogleMap
      zoom={14}
      center={selectedPlace?.coordinates || searchResults[0]?.coordinates || DEFAULT_CENTER}
      mapContainerClassName="map-container"
      options={MAP_OPTIONS}
      onLoad={(map) => {
        mapRef.current = map;
        setIsMapLoaded(true);
      }}
      onUnmount={() => {
        mapRef.current = null;
        setIsMapLoaded(false);
      }}
    >
      {selectedPlace ? renderInfoWindow(selectedPlace) : searchResults.map(renderInfoWindow)}
    </GoogleMap>
  );
};

export default Map;