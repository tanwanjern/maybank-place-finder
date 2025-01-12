import { Place } from '../types/place';
import { mockPlaces } from '../data/mockPlaces';

const KUALA_LUMPUR_LOCATION = {
  lat: 3.1390,
  lng: 101.6869
};

let placesService: google.maps.places.PlacesService | null = null;

const initializePlacesService = () => {
  if (!placesService && window.google?.maps?.places) {
    try {
      // Create a temporary map div for the PlacesService
      const mapDiv = document.createElement('div');
      const map = new google.maps.Map(mapDiv, {
        center: KUALA_LUMPUR_LOCATION,
        zoom: 15
      });
      placesService = new google.maps.places.PlacesService(map);
    } catch (error) {
      console.error('Failed to initialize places service:', error);
      return null;
    }
  }
  return placesService;
};

export const searchNearbyPlaces = async (query: string): Promise<Place[]> => {
  if (!query.trim()) {
    return [];
  }

  // Wait for Google Maps to be loaded
  let retries = 0;
  while (!window.google?.maps?.places && retries < 50) {
    await new Promise(resolve => setTimeout(resolve, 100));
    retries++;
  }

  const service = initializePlacesService();
  if (!service) {
    console.log('Falling back to mock data due to service initialization failure');
    return filterMockPlaces(query);
  }

  try {
    return await new Promise((resolve, reject) => {
      const request: google.maps.places.TextSearchRequest = {
        query: query,
        location: new google.maps.LatLng(KUALA_LUMPUR_LOCATION),
        radius: 5000
      };

      service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const places: Place[] = results.map(result => ({
            id: result.place_id || Math.random().toString(),
            name: result.name || 'Unknown Place',
            address: result.formatted_address || 'No address available',
            city: 'Kuala Lumpur',
            country: 'Malaysia',
            coordinates: {
              lat: result.geometry?.location?.lat() || KUALA_LUMPUR_LOCATION.lat,
              lng: result.geometry?.location?.lng() || KUALA_LUMPUR_LOCATION.lng,
            },
            rating: result.rating || 0,
            type: result.types || [],
            photoUrl: result.photos?.[0]?.getUrl() || undefined,
          }));
          resolve(places);
        } else {
          console.log('Places service failed, falling back to mock data. Status:', status);
          resolve(filterMockPlaces(query));
        }
      });
    });
  } catch (error) {
    console.error('Search failed:', error);
    return filterMockPlaces(query);
  }
};

const filterMockPlaces = (query: string): Place[] => {
  const searchTerm = query.toLowerCase();
  return mockPlaces.filter(place => 
    place.name.toLowerCase().includes(searchTerm) ||
    place.type.some(t => t.toLowerCase().includes(searchTerm))
  );
};