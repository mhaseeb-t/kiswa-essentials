import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  language: 'en',
  currency: 'GBP',
  region: null,
  regionCode: null,
  loadingRegion: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setRegion: (state, action) => {
      state.region = action.payload.region;
      state.regionCode = action.payload.code;
      state.currency = action.payload.currency;
    },
    setLoadingRegion: (state, action) => {
      state.loadingRegion = action.payload;
    },
  },
});

export const { setLanguage, setRegion, setLoadingRegion } = settingsSlice.actions;
export default settingsSlice.reducer;