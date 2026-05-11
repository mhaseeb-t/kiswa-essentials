import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import uiReducer from './slices/uiSlice';
import settingsReducer from './slices/settingsSlice';

const loadSettingsFromStorage = () => {
  try {
    const region = localStorage.getItem('kiswa_region');
    const language = localStorage.getItem('kiswa_language') || 'en';
    const regionData = region ? JSON.parse(region) : {};
    return {
      language: language,
      currency: regionData.currency || 'GBP',
      region: regionData.region || null,
      regionCode: regionData.code || null,
      loadingRegion: false
    };
  } catch {
    return { language: 'en', currency: 'GBP', region: null, regionCode: null, loadingRegion: false };
  }
};

const preloadedSettings = loadSettingsFromStorage();
import productReducer from './slices/productSlice';

const loadCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem('kiswa-cart');
    return cartData ? JSON.parse(cartData) : { items: [], isOpen: false };
  } catch {
    return { items: [], isOpen: false };
  }
};

const loadAuthFromStorage = () => {
  try {
    const token = localStorage.getItem('kiswa-token');
    const user = localStorage.getItem('kiswa-user');
    return {
      token: token || null,
      user: user ? JSON.parse(user) : null,
      isLoading: false,
      error: null,
    };
  } catch {
    return { user: null, token: null, isLoading: false, error: null };
  }
};

const preloadedCart = loadCartFromStorage();
const preloadedAuth = loadAuthFromStorage();
const preloadedWishlist = { items: [] }; // Wishlist is not persisted to keep it simple

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
    settings: settingsReducer,
    product: productReducer,
  },
  preloadedState: {
    auth: preloadedAuth,
    cart: preloadedCart,
    wishlist: preloadedWishlist,
    settings: preloadedSettings,
  },
});

store.subscribe(() => {
  const { items, isOpen } = store.getState().cart;
  localStorage.setItem('kiswa-cart', JSON.stringify({ items, isOpen }));

  const { language, region, regionCode, currency } = store.getState().settings;
  if (language) localStorage.setItem('kiswa_language', language);
  if (region && regionCode && currency) {
    localStorage.setItem('kiswa_region', JSON.stringify({ region, code: regionCode, currency }));
  }
});

export default store;