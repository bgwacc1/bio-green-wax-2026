export interface Language {
  code: string;
  countryCode: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'zh', countryCode: 'CN', name: 'Chinese', nativeName: '中文', direction: 'ltr', flag: '🇨🇳' },
  { code: 'de', countryCode: 'DE', name: 'German', nativeName: 'Deutsch', direction: 'ltr', flag: '🇩🇪' },
  { code: 'es', countryCode: 'ES', name: 'Spanish', nativeName: 'Español', direction: 'ltr', flag: '🇪🇸' },
  { code: 'fr', countryCode: 'FR', name: 'French', nativeName: 'Français', direction: 'ltr', flag: '🇫🇷' },
  { code: 'en', countryCode: 'GB', name: 'English', nativeName: 'English', direction: 'ltr', flag: '🇬🇧' },
  { code: 'it', countryCode: 'IT', name: 'Italian', nativeName: 'Italiano', direction: 'ltr', flag: '🇮🇹' },
  { code: 'ja', countryCode: 'JP', name: 'Japanese', nativeName: '日本語', direction: 'ltr', flag: '🇯🇵' },
  { code: 'sw', countryCode: 'KE', name: 'Swahili', nativeName: 'Kiswahili', direction: 'ltr', flag: '🇰🇪' },
  { code: 'ko', countryCode: 'KR', name: 'Korean', nativeName: '한국어', direction: 'ltr', flag: '🇰🇷' },
  { code: 'pl', countryCode: 'PL', name: 'Polish', nativeName: 'Polski', direction: 'ltr', flag: '🇵🇱' },
  { code: 'pt', countryCode: 'PT', name: 'Portuguese', nativeName: 'Português', direction: 'ltr', flag: '🇵🇹' },
  { code: 'ru', countryCode: 'RU', name: 'Russian', nativeName: 'Русский', direction: 'ltr', flag: '🇷🇺' },
  { code: 'ar', countryCode: 'SA', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', flag: '🇸🇦' },
  { code: 'th', countryCode: 'TH', name: 'Thai', nativeName: 'ไทย', direction: 'ltr', flag: '🇹🇭' },
  { code: 'tr', countryCode: 'TR', name: 'Turkish', nativeName: 'Türkçe', direction: 'ltr', flag: '🇹🇷' },
  { code: 'vi', countryCode: 'VN', name: 'Vietnamese', nativeName: 'Tiếng Việt', direction: 'ltr', flag: '🇻🇳' },
];

export const DEFAULT_LANGUAGE = 'en';

export const getLanguageByCode = (code: string): Language | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
};

export const isValidLanguageCode = (code: string): boolean => {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
};

export const getLanguageDirection = (code: string): 'ltr' | 'rtl' => {
  const lang = getLanguageByCode(code);
  return lang?.direction || 'ltr';
};

const TIMEZONE_TO_LANGUAGE: Record<string, string> = {
  'Asia/Shanghai': 'zh',
  'Asia/Chongqing': 'zh',
  'Asia/Hong_Kong': 'zh',
  'Asia/Macau': 'zh',
  'Asia/Taipei': 'zh',
  'Asia/Urumqi': 'zh',
  'Europe/Berlin': 'de',
  'Europe/Vienna': 'de',
  'Europe/Zurich': 'de',
  'Europe/Madrid': 'es',
  'Europe/Barcelona': 'es',
  'Atlantic/Canary': 'es',
  'America/Mexico_City': 'es',
  'America/Bogota': 'es',
  'America/Argentina/Buenos_Aires': 'es',
  'America/Lima': 'es',
  'America/Santiago': 'es',
  'America/Caracas': 'es',
  'America/Guayaquil': 'es',
  'Europe/Paris': 'fr',
  'Europe/Brussels': 'fr',
  'Africa/Dakar': 'fr',
  'Africa/Abidjan': 'fr',
  'America/Montreal': 'fr',
  'Europe/London': 'en',
  'Europe/Dublin': 'en',
  'America/New_York': 'en',
  'America/Chicago': 'en',
  'America/Denver': 'en',
  'America/Los_Angeles': 'en',
  'Australia/Sydney': 'en',
  'Pacific/Auckland': 'en',
  'Europe/Rome': 'it',
  'Europe/Milan': 'it',
  'Asia/Tokyo': 'ja',
  'Africa/Nairobi': 'sw',
  'Africa/Dar_es_Salaam': 'sw',
  'Africa/Kampala': 'sw',
  'Asia/Seoul': 'ko',
  'Europe/Warsaw': 'pl',
  'Europe/Lisbon': 'pt',
  'America/Sao_Paulo': 'pt',
  'America/Fortaleza': 'pt',
  'America/Recife': 'pt',
  'America/Belem': 'pt',
  'America/Manaus': 'pt',
  'Europe/Moscow': 'ru',
  'Europe/Volgograd': 'ru',
  'Asia/Yekaterinburg': 'ru',
  'Asia/Novosibirsk': 'ru',
  'Asia/Vladivostok': 'ru',
  'Asia/Riyadh': 'ar',
  'Asia/Dubai': 'ar',
  'Asia/Qatar': 'ar',
  'Asia/Kuwait': 'ar',
  'Africa/Cairo': 'ar',
  'Africa/Casablanca': 'ar',
  'Asia/Baghdad': 'ar',
  'Asia/Amman': 'ar',
  'Asia/Beirut': 'ar',
  'Asia/Bangkok': 'th',
  'Europe/Istanbul': 'tr',
  'Asia/Ho_Chi_Minh': 'vi',
  'Asia/Saigon': 'vi',
};

export const detectLanguageFromRegion = (): string | null => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone && TIMEZONE_TO_LANGUAGE[timezone]) {
      const detectedLang = TIMEZONE_TO_LANGUAGE[timezone];
      if (isValidLanguageCode(detectedLang)) {
        return detectedLang;
      }
    }
  } catch {}
  return null;
};
