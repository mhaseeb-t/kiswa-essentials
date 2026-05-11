import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRegion } from '../store/slices/settingsSlice';

const REGION_MAPPINGS = {
  GB: { region: 'United Kingdom', code: 'UK', currency: 'GBP' },
  US: { region: 'United States', code: 'US', currency: 'USD' },
  PK: { region: 'Pakistan', code: 'PK', currency: 'PKR' },
  AE: { region: 'United Arab Emirates', code: 'AE', currency: 'AED' },
  IN: { region: 'India', code: 'IN', currency: 'INR' },
  SA: { region: 'Saudi Arabia', code: 'SA', currency: 'SAR' },
  DE: { region: 'Germany', code: 'DE', currency: 'EUR' },
  FR: { region: 'France', code: 'FR', currency: 'EUR' },
};

const DEFAULT_REGION = { region: 'United Kingdom', code: 'UK', currency: 'GBP' };

const useRegionDetection = () => {
  const dispatch = useDispatch();
  const region = useSelector((state) => state.settings.region);
  const loadingRegion = useSelector((state) => state.settings.loadingRegion);

  useEffect(() => {
    if (region || loadingRegion) return;

    const detectRegion = async () => {
      dispatch({ type: 'settings/setLoadingRegion', payload: true });

      // Try browser geolocation first
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              maximumAge: 3600000, // Cache for 1 hour
            });
          });

          // Use reverse geocoding via free API
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
              { headers: { 'Accept-Language': 'en' } }
            );
            const data = await response.json();
            const countryCode = data.address?.country_code?.toUpperCase();
            const mappedRegion = REGION_MAPPINGS[countryCode];

            if (mappedRegion) {
              dispatch(setRegion(mappedRegion));
              localStorage.setItem('kiswa_region', JSON.stringify(mappedRegion));
              dispatch({ type: 'settings/setLoadingRegion', payload: false });
              return;
            }
          } catch {
            // Fall through to IP detection
          }
        } catch {
          // Geolocation denied or failed, continue to IP detection
        }
      }

      // Try IP-based detection via free API (no API key needed)
      try {
        const response = await fetch('https://ipapi.co/json/', {
          signal: AbortSignal.timeout(3000),
        });
        const data = await response.json();
        const countryCode = data.country_code || 'GB';
        const mappedRegion = REGION_MAPPINGS[countryCode] || DEFAULT_REGION;

        dispatch(setRegion(mappedRegion));
        localStorage.setItem('kiswa_region', JSON.stringify(mappedRegion));
        dispatch({ type: 'settings/setLoadingRegion', payload: false });
        return;
      } catch {
        // Use cached or default
      }

      // Check localStorage cache
      const cached = localStorage.getItem('kiswa_region');
      if (cached) {
        try {
          dispatch(setRegion(JSON.parse(cached)));
        } catch {
          dispatch(setRegion(DEFAULT_REGION));
        }
      } else {
        dispatch(setRegion(DEFAULT_REGION));
      }
      dispatch({ type: 'settings/setLoadingRegion', payload: false });
    };

    detectRegion();
  }, [region, loadingRegion, dispatch]);

  const regionCode = useSelector((state) => state.settings.regionCode);
  return { region, regionCode, loadingRegion };
};

export default useRegionDetection;