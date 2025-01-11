import { API_CONFIG } from '../services/api';

/**
 * Initialize Google Places Service with retry mechanism
 * @returns Promise<google.maps.places.PlacesService | null>
 */
export const initializePlacesService = async (): Promise<google.maps.places.PlacesService | null> => {
  let retries = 0;
  
  while (!window.google?.maps?.places && retries < API_CONFIG.MAX_RETRIES) {
    await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
    retries++;
  }

  if (!window.google?.maps?.places) {
    console.error('Google Maps Places service failed to load');
    return null;
  }

  try {
    const mapDiv = document.createElement('div');
    const map = new google.maps.Map(mapDiv, {
      center: API_CONFIG.KUALA_LUMPUR_LOCATION,
      zoom: 15
    });
    return new google.maps.places.PlacesService(map);
  } catch (error) {
    console.error('Failed to initialize places service:', error);
    return null;
  }
};