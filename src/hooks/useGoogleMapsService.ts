import { useEffect, useRef, useState } from 'react';

export const useGoogleMapsService = () => {
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initService = () => {
      if (window.google?.maps?.places) {
        try {
          autocompleteService.current = new window.google.maps.places.AutocompleteService();
          setIsLoaded(true);
        } catch (error) {
          setError('Failed to initialize Google Maps service');
          console.error(error);
        }
      }
    };

    const timeoutId = setTimeout(() => {
      if (!window.google?.maps?.places) {
        setError('Google Maps failed to load');
      }
    }, 10000);

    if (window.google?.maps?.places) {
      initService();
    } else {
      const intervalId = setInterval(() => {
        if (window.google?.maps?.places) {
          initService();
          clearInterval(intervalId);
        }
      }, 100);

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }
  }, []);

  return { service: autocompleteService.current, isLoaded, error };
}; 