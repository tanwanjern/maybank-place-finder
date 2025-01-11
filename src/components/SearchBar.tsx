import React, { useState, useRef, useEffect } from 'react';
import { Input, Button } from 'antd';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { searchPlaces } from '../store/placesSlice';
import type { AppDispatch } from '../store/store';

const SUGGESTIONS = [
  'Maybank',
  'Restaurant',
  'Shopping Mall',
  'Park',
];

const SearchBar: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const initAutocomplete = () => {
      if (window.google?.maps?.places) {
        try {
          autocompleteService.current = new window.google.maps.places.AutocompleteService();
        } catch (error) {
          console.error('Failed to initialize AutocompleteService:', error);
        }
      }
    };

    if (window.google?.maps?.places) {
      initAutocomplete();
    } else {
      const checkGoogleMapsInterval = setInterval(() => {
        if (window.google?.maps?.places) {
          initAutocomplete();
          clearInterval(checkGoogleMapsInterval);
        }
      }, 100);

      setTimeout(() => clearInterval(checkGoogleMapsInterval), 10000);

      return () => {
        clearInterval(checkGoogleMapsInterval);
      };
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (text: string = searchText) => {
    if (text.trim()) {
      dispatch(searchPlaces(text));
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);

    if (value.trim() && autocompleteService.current) {
      try {
        const predictions = await new Promise<google.maps.places.AutocompletePrediction[]>((resolve, reject) => {
          autocompleteService.current!.getPlacePredictions(
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
        console.error('Autocomplete error:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

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
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <Button size="large" type="primary" onClick={() => handleSearch()}>
          Search
        </Button>
      </div>
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