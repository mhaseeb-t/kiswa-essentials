import { useSelector, useDispatch } from 'react-redux';
import { setLanguage } from '../store/slices/settingsSlice';
import { getTranslation } from '../utils/translations';

export const useTranslation = () => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.settings.language);

  const t = (key, params = {}) => {
    return getTranslation(language, key, params);
  };

  const changeLanguage = (lang) => {
    dispatch(setLanguage(lang));
    localStorage.setItem('kiswa_language', lang);
  };

  return { t, language, changeLanguage };
};

export default useTranslation;