import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filters: {
    categories: [],
    minPrice: '',
    maxPrice: '',
    color: '',
    size: '',
    sort: 'newest',
    inStock: false,
  },
  availableFilters: {
    colors: [],
    sizes: [],
    priceRange: { min: 0, max: 1000 }
  },
  searchQuery: '',
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setAvailableFilters: (state, action) => {
      state.availableFilters = action.payload;
    },
  },
});

export const { setFilters, clearFilters, setSearchQuery, setAvailableFilters } = productSlice.actions;

export const selectFilters = (state) => state.product.filters;
export const selectSearchQuery = (state) => state.product.searchQuery;
export const selectAvailableFilters = (state) => state.product.availableFilters;

export default productSlice.reducer;