import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { RootState } from '../store/store';
import { Spin } from 'antd';
import PlaceInfoWindow from './PlaceInfoWindow';
import { Place } from '../types/place';

const LIBRARIES: ("places" | "marker")[] = ["places", "marker"];
const DEFAULT_CENTER = { lat: 3.1390, lng: 101.6869 };
const MAP_OPTIONS = {
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  mapId: import.meta.env.VITE_GOOGLE_MAPS_ID
};

const Map: React.FC = () => {
  const { selectedPlace, searchResults } = useSelector((state: RootState) => state.places);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<{ [key: string]: google.maps.marker.AdvancedMarkerElement }>({});

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES
  });

  const handleMarkerClick = (placeId: string) => {
    setActiveMarker(placeId);
  };

  const createMarker = (place: Place) => {
    if (!mapRef.current || !isMapLoaded) return;

    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: place.coordinates,
      title: place.name,
      map: mapRef.current,
    });

    marker.addListener('click', () => handleMarkerClick(place.id));
    markersRef.current[place.id] = marker;
  };

  const updateMarkers = () => {
    if (!mapRef.current || !isMapLoaded) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => {
      marker.map = null;
    });
    markersRef.current = {};

    // Add new markers
    const placesToShow = selectedPlace ? [selectedPlace] : searchResults;
    placesToShow.forEach(createMarker);
  };

  useEffect(() => {
    updateMarkers();
    return () => {
      Object.values(markersRef.current).forEach(marker => {
        marker.map = null;
      });
    };
  }, [selectedPlace, searchResults, isMapLoaded]);

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