import { useState, useEffect } from 'react';
import { CURRENCIES } from '@/types/invoice';

interface UserLocale {
  currency: string;
  currencySymbol: string;
  language: string;
  dateFormat: Intl.DateTimeFormatOptions;
}

const currencyLocaleMap: Record<string, string> = {
  'en-US': 'USD',
  'en-GB': 'GBP',
  'en-CA': 'CAD',
  'en-AU': 'AUD',
  'en-NZ': 'NZD',
  'de-DE': 'EUR',
  'de-AT': 'EUR',
  'de-CH': 'CHF',
  'fr-FR': 'EUR',
  'fr-CA': 'CAD',
  'fr-CH': 'CHF',
  'es-ES': 'EUR',
  'es-MX': 'MXN',
  'es-AR': 'USD',
  'it-IT': 'EUR',
  'pt-BR': 'BRL',
  'pt-PT': 'EUR',
  'nl-NL': 'EUR',
  'nl-BE': 'EUR',
  'ja-JP': 'JPY',
  'zh-CN': 'CNY',
  'zh-HK': 'HKD',
  'zh-TW': 'TWD',
  'ko-KR': 'KRW',
  'hi-IN': 'INR',
  'sv-SE': 'SEK',
  'no-NO': 'NOK',
  'da-DK': 'DKK',
  'fi-FI': 'EUR',
  'pl-PL': 'PLN',
  'cs-CZ': 'CZK',
  'hu-HU': 'HUF',
  'ro-RO': 'RON',
  'bg-BG': 'BGN',
  'hr-HR': 'EUR',
  'sk-SK': 'EUR',
  'sl-SI': 'EUR',
  'lt-LT': 'EUR',
  'lv-LV': 'EUR',
  'et-EE': 'EUR',
  'mt-MT': 'EUR',
  'cy-GB': 'GBP',
  'ga-IE': 'EUR',
  'is-IS': 'ISK',
  'mk-MK': 'MKD',
  'sq-AL': 'ALL',
  'sr-RS': 'RSD',
  'uk-UA': 'UAH',
  'ru-RU': 'RUB',
  'tr-TR': 'TRY',
  'ar-SA': 'SAR',
  'he-IL': 'ILS',
  'th-TH': 'THB',
  'vi-VN': 'VND',
  'id-ID': 'IDR',
  'ms-MY': 'MYR',
  'tl-PH': 'PHP',
  'en-SG': 'SGD',
  'en-HK': 'HKD',
  'en-IN': 'INR',
  'en-ZA': 'ZAR',
  'en-NG': 'NGN',
  'en-KE': 'KES',
  'en-GH': 'GHS',
};

export function useUserLocale(): UserLocale {
  const [locale, setLocale] = useState<UserLocale>({
    currency: 'USD',
    currencySymbol: '$',
    language: 'en-US',
    dateFormat: { year: 'numeric', month: 'long', day: 'numeric' },
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const userLanguage = navigator.language || 'en-US';
    const currencyCode = currencyLocaleMap[userLanguage] || 'USD';
    const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];

    // Detect date format preference based on locale
    const dateFormat: Intl.DateTimeFormatOptions = 
      userLanguage.startsWith('en-US') 
        ? { year: 'numeric', month: 'short', day: 'numeric' }
        : { year: 'numeric', month: 'long', day: 'numeric' };

    setLocale({
      currency: currency.code,
      currencySymbol: currency.symbol,
      language: userLanguage,
      dateFormat,
    });
  }, []);

  return locale;
}

export function formatCurrency(amount: number, currencyCode: string, locale: string = 'en-US'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Fallback if currency code is invalid
    const currency = CURRENCIES.find(c => c.code === currencyCode);
    const symbol = currency?.symbol || '$';
    return `${symbol}${amount.toFixed(2)}`;
  }
}

export function formatDate(dateString: string, locale: string = 'en-US'): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}
