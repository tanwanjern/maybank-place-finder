import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Input, Button } from 'antd';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { searchPlaces, clearMapMarkers, setSelectedPlace } from '../store/placesSlice';
import type { AppDispatch } from '../store/store';
import { useGoogleMapsService } from '../hooks/useGoogleMapsService';
import debounce from 'lodash/debounce';

// Quick access suggestions
const SUGGESTIONS = ['Maybank', 'Restaurant', 'Shopping Mall', 'Park'];

// Minimum characters before triggering autocomplete
const MIN_SEARCH_LENGTH = 3;

const SearchBar: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const { service, error } = useGoogleMapsService();

  // Debounced autocomplete function
  const debouncedAutocomplete = useCallback(
    debounce(async (value: string) => {
      if (!value.trim() || !service || value.length < MIN_SEARCH_LENGTH) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const predictions = await new Promise<google.maps.places.AutocompletePrediction[]>((resolve, reject) => {
          service.getPlacePredictions(
            {
              input: value,
              componentRestrictions: { country: 'MY' },
              types: ['establishment', 'geocode'],
            },
            (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                resolve(results);
              } else {
                reject(status);
              }
            }
          );
        });

        setSuggestions(predictions.map(p => p.description));
        setShowSuggestions(true);
      } catch (error) {
        if (error === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          setSuggestions([]);
          setShowSuggestions(false);
        } else {
          console.error('Autocomplete error:', error);
          setSuggestions([]);
        }
      }
    }, 300),
    [service]
  );

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    setSuggestions([]);
    debouncedAutocomplete(value);
  };

  // Handle search submission
  const handleSearch = (text: string = searchText) => {
    const trimmedText = text.trim();
    if (trimmedText) {
      dispatch(clearMapMarkers());
      dispatch(setSelectedPlace(null));
      dispatch(searchPlaces(trimmedText));
      setShowSuggestions(false);
      setSuggestions([]);
      setSearchText('');
    }
  };

  // Handle clicks outside search box
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (error) {
    console.error('Google Maps service error:', error);
  }

  return (
    <div ref={searchBoxRef} className="search-box">
      <div className="search-input-container">
        <Input
          size="large"
          value={searchText}
          onChange={handleInputChange}
          onFocus={() => {
            if (searchText.trim() && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          prefix={<Search className="search-icon" />}
          placeholder="Search for places..."
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button size="large" type="primary" onClick={() => handleSearch()}>
          Search
        </Button>
      </div>

      {/* Quick suggestion buttons */}
      <div className="search-suggestions">
        <span className="suggestion-label">Suggestions: </span>
        {SUGGESTIONS.map((suggestion) => (
          <Button
            key={suggestion}
            size="small"
            onClick={() => {
              setSearchText(suggestion);
              handleSearch(suggestion);
            }}
          >
            {suggestion}
          </Button>
        ))}
      </div>

      {/* Autocomplete suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="autocomplete-suggestions">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => {
                setSearchText(suggestion);
                handleSearch(suggestion);
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;