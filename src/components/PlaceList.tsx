import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setSelectedPlace } from '../store/placesSlice';
import PlaceCard from './PlaceCard';
import { Empty, Spin } from 'antd';

const PlaceList: React.FC = () => {
  const dispatch = useDispatch();
  const { searchResults, loading, hasSearched } = useSelector((state: RootState) => state.places);

  if (!hasSearched) {
    return (
      <div className="empty-state">
        <Empty description="Search for places to see results" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-state">
        <Spin size="large" />
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="empty-state">
        <Empty description="No places found" />
      </div>
    );
  }

  return (
    <>
      <p className="place-count">Found {searchResults.length} places</p>
      <div className="place-list">
        {searchResults.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            onClick={() => dispatch(setSelectedPlace(place))}
          />
        ))}
      </div>
    </>
  );
};

export default PlaceList;