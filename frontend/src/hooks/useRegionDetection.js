import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRegion, setLanguage } from '../../store/slices/settingsSlice';

const useRegionDetection = () => {
  const dispatch = useDispatch();
  const { region, regionCode, loadingRegion } = useSelector((state) => state.settings);
  const [ipData, setIpData] = useState(null);

  useEffect(() => {
    const detectRegion = async () => {
      try {
        // Get IP and location
        const ipResponse = await fetch('https://ipapi.co/json/');
        const ipData = await ipResponse.json();

        if (ipData && ipData.country_code) {
          const countryCode = ipData.country_code;
          const countryName = ipData.country_name || countryCode;
          const city = ipData.city || '';

          // Map country to region pricing
          const regionMap = {
            'GB': { code: 'UK', currency: 'GBP', symbol: '£' },
            'US': { code: 'US', currency: 'USD', symbol: '$' },
            'PK': { code: 'PK', currency: 'PKR', symbol: '₨' },
            'AE': { code: 'AE', currency: 'AED', symbol: 'د.إ' },
            'IN': { code: 'IN', currency: 'INR', symbol: '₹' },
            'SA': { code: 'SA', currency: 'SAR', symbol: '﷼' },
            'QA': { code: 'QA', currency: 'QAR', symbol: '﷼' },
            'KW': { code: 'KW', currency: 'KWD', symbol: 'د.ك' },
            'BH': { code: 'BH', currency: 'BHD', symbol: '.د.ب' },
          };

          // Default to UK if not in region map
          const regionInfo = regionMap[countryCode] || { code: 'UK', currency: 'GBP', symbol: '£' };

          dispatch(setRegion({
            region: city ? `${city}, ${countryName}` : countryName,
            code: regionInfo.code,
            currency: regionInfo.currency
          }));

          setIpData(ipData);
        }
      } catch (error) {
        console.error('Failed to detect region:', error);
        dispatch(setRegion({ region: 'United Kingdom', code: 'UK', currency: 'GBP' }));
      }
    };

    if (!region) {
      detectRegion();
    }
  }, [region, dispatch]);

  return { region, regionCode, ipData, loadingRegion };
};

export default useRegionDetection;