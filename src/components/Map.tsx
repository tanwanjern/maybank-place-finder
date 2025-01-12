import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { RootState } from '../store/store';
import { Spin } from 'antd';
import PlaceInfoWindow from './PlaceInfoWindow';

const libraries: ("places")[] = ["places"];

const Map: React.FC = () => {
  const { selectedPlace, searchResults } = useSelector((state: RootState) => state.places);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

  const defaultCenter = {
    lat: 3.1390,
    lng: 101.6869
  };

  if (!isLoaded) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  const center = selectedPlace ? selectedPlace.coordinates : 
                searchResults.length > 0 ? searchResults[0].coordinates : 
                defaultCenter;

  return (
    <GoogleMap
      zoom={14}
      center={center}
      mapContainerClassName="map-container"
      options={{
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      }}
    >
      {selectedPlace ? (
        <Marker
          key={selectedPlace.id}
          position={selectedPlace.coordinates}
          title={selectedPlace.name}
          onClick={() => setActiveMarker(selectedPlace.id)}
        >
          {activeMarker === selectedPlace.id && (
            <PlaceInfoWindow
              place={selectedPlace}
              onClose={() => setActiveMarker(null)}
            />
          )}
        </Marker>
      ) : (
        searchResults.map((place) => (
          <Marker
            key={place.id}
            position={place.coordinates}
            title={place.name}
            onClick={() => setActiveMarker(place.id)}
          >
            {activeMarker === place.id && (
              <PlaceInfoWindow
                place={place}
                onClose={() => setActiveMarker(null)}
              />
            )}
          </Marker>
        ))
      )}
    </GoogleMap>
  );
};

export default Map;