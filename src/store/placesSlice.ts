import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Place } from '../types/place';
import { searchNearbyPlaces } from '../services/placesService';

interface PlacesState {
  searchResults: Place[];
  selectedPlace: Place | null;
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  markers: any[];
}

const initialState: PlacesState = {
  searchResults: [],
  selectedPlace: null,
  loading: false,
  error: null,
  hasSearched: false,
  markers: [],
};

// Redux Thunk middleware is already included by default. 
// When we use configureStore from Redux Toolkit, it automatically includes some default middleware, including Redux Thunk.
export const searchPlaces = createAsyncThunk(
  'places/search',
  async (query: string, { rejectWithValue }) => {
    try {
      const results = await searchNearbyPlaces(query);
      return results;
    } catch (error) {
      return rejectWithValue('Search failed. Please try again.');
    }
  }
);

const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    setSelectedPlace: (state, action: PayloadAction<Place | null>) => {
      state.selectedPlace = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.selectedPlace = null;
      state.hasSearched = false;
      state.error = null;
    },
    clearMapMarkers: (state) => {
      state.markers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchPlaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPlaces.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
        state.hasSearched = true;
        state.error = null;
      })
      .addCase(searchPlaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'An error occurred';
        state.hasSearched = true;
      });
  },
});

export const { setSelectedPlace, clearSearchResults, clearMapMarkers } = placesSlice.actions;
export default placesSlice.reducer;