// Exchange rates relative to GBP (products stored in GBP)
const EXCHANGE_RATES = {
  GBP: 1,
  USD: 1.27,
  PKR: 355.5,
  EUR: 1.17,
  AED: 4.67,
  INR: 106.5,
  SAR: 4.77,
};

const CURRENCY_CONFIG = {
  GBP: { symbol: '£', locale: 'en-GB', decimals: 2 },
  USD: { symbol: '$', locale: 'en-US', decimals: 2 },
  PKR: { symbol: '₨', locale: 'ur-PK', decimals: 0 },
  EUR: { symbol: '€', locale: 'de-DE', decimals: 2 },
  AED: { symbol: 'د.إ', locale: 'ar-AE', decimals: 2 },
  INR: { symbol: '₹', locale: 'en-IN', decimals: 2 },
  SAR: { symbol: 'ر.س', locale: 'ar-SA', decimals: 2 },
};

export const convertPrice = (priceInGBP, targetCurrency) => {
  if (targetCurrency === 'GBP') return priceInGBP;
  const rate = EXCHANGE_RATES[targetCurrency] || 1;
  return priceInGBP * rate;
};

export const formatPrice = (price, currency = 'GBP', autoConvert = false) => {
  // If autoConvert is true and prices are stored in GBP, convert first
  const convertedPrice = autoConvert ? convertPrice(price, currency) : price;
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.GBP;

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(convertedPrice);
};

export const getCurrencySymbol = (currency = 'GBP') => {
  return CURRENCY_CONFIG[currency]?.symbol || '£';
};

export default formatPrice;