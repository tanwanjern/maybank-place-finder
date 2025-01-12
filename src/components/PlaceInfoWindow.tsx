import React from 'react';
import { Place } from '../types/place';
import { InfoWindowF } from '@react-google-maps/api';
import { Typography, Button } from 'antd';

const { Title, Paragraph } = Typography;

interface PlaceInfoWindowProps {
  place: Place;
  onClose: () => void;
}

const PlaceInfoWindow: React.FC<PlaceInfoWindowProps> = ({ place, onClose }) => {
  const getDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.address)}`;
    window.open(url, '_blank');
  };

  return (
    <InfoWindowF
      position={place.coordinates}
      onCloseClick={onClose}
    >
      <div className="info-window-container">
        {place.photoUrl && (
          <img 
            src={place.photoUrl} 
            alt={place.name}
            className="info-window-image"
          />
        )}
        <Title level={4} className="info-window-title">{place.name}</Title>
        <Paragraph className="info-window-address">{place.address}</Paragraph>
        <Button onClick={getDirections} type="primary">Get Directions</Button>
      </div>
    </InfoWindowF>
  );
};

export default PlaceInfoWindow; 