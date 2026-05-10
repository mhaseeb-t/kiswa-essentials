import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import uiReducer from './slices/uiSlice';
import settingsReducer from './slices/settingsSlice';

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
  },
  preloadedState: {
    auth: preloadedAuth,
    cart: preloadedCart,
    wishlist: preloadedWishlist,
  },
});

store.subscribe(() => {
  const { items, isOpen } = store.getState().cart;
  localStorage.setItem('kiswa-cart', JSON.stringify({ items, isOpen }));
});

export default store;