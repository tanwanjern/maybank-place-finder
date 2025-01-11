import { useEffect, useState } from 'react';
import { initializePlacesService } from '../utils/mapUtils';

/**
 * Custom hook to manage Google Places Service initialization
 */
export const usePlacesService = () => {
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initService = async () => {
      try {
        const service = await initializePlacesService();
        setPlacesService(service);
      } catch (err) {
        setError('Failed to initialize Places service');
        console.error(err);
      }
    };

    initService();
  }, []);

  return { placesService, error };
};