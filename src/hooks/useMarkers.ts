import { useRef, useEffect } from 'react';
import { Place } from '../types/place';

interface UseMarkersProps {
  map: google.maps.Map | null;
  places: Place[];
  onMarkerClick: (placeId: string) => void;
  isMapLoaded: boolean;
}

export const useMarkers = ({ map, places, onMarkerClick, isMapLoaded }: UseMarkersProps) => {
  const markersRef = useRef<{ [key: string]: google.maps.marker.AdvancedMarkerElement }>({});

  const clearMarkers = () => {
    Object.values(markersRef.current).forEach(marker => {
      marker.map = null;
    });
    markersRef.current = {};
  };

  const createMarker = (place: Place) => {
    if (!map || !isMapLoaded) return;

    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: place.coordinates,
      title: place.name,
      map,
    });

    marker.addListener('click', () => onMarkerClick(place.id));
    markersRef.current[place.id] = marker;
  };

  useEffect(() => {
    if (!map || !isMapLoaded) return;

    clearMarkers();
    places.forEach(createMarker);

    return clearMarkers;
  }, [map, places, isMapLoaded, onMarkerClick]);

  return { markers: markersRef.current };
}; 