import React from 'react';
import { Button, Card, Rate } from 'antd';
import { Navigation } from 'lucide-react';
import { Place } from '../types/place';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface PlaceCardProps {
  place: Place;
  onClick: () => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, onClick }) => {
  const selectedPlace = useSelector((state: RootState) => state.places.selectedPlace);
  const isSelected = selectedPlace?.id === place.id;

  const handleGetDirections = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    const destination = `${place.coordinates.lat},${place.coordinates.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&destination_place_id=${place.id}`;
    window.open(url, '_blank');
  };

  return (
    <Card
      className={`place-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="place-card-content">
        <div className="place-info">
          <h3 className="place-title">{place.name}</h3>
          <p className="place-address">{place.address}</p>
          <div className="place-rating-container">
            <Rate disabled defaultValue={place.rating} allowHalf/>
            <span className="place-rating-text">({place.rating})</span>
          </div>
          <div className="place-actions">
            <Button 
              type="primary" 
              icon={<Navigation size={16} />}
              onClick={handleGetDirections}
              className="direction-button"
            >
              Get Directions
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PlaceCard;