import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getLanguageByCode, getLanguageDirection, isValidLanguageCode, detectLanguageFromRegion, Language } from './languages';

interface TranslationData {
  [key: string]: string;
}

interface LanguageContextType {
  currentLanguage: string;
  direction: 'ltr' | 'rtl';
  languages: Language[];
  setLanguage: (code: string) => void;
  t: (key: string, fallback?: string) => string;
  isLoading: boolean;
  getLocalizedPath: (path: string) => string;
  getAlternateUrls: (path: string) => { lang: string; url: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translationCache: Record<string, TranslationData> = {};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getLanguageFromPath = useCallback((): string => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0 && isValidLanguageCode(pathParts[0])) {
      return pathParts[0];
    }
    const stored = localStorage.getItem('preferredLanguage');
    if (stored && isValidLanguageCode(stored)) {
      return stored;
    }
    const regionLang = detectLanguageFromRegion();
    if (regionLang) {
      return regionLang;
    }
    const browserLang = navigator.language.split('-')[0];
    if (isValidLanguageCode(browserLang)) {
      return browserLang;
    }
    return DEFAULT_LANGUAGE;
  }, [location.pathname]);

  const [currentLanguage, setCurrentLanguage] = useState<string>(getLanguageFromPath);
  const [translations, setTranslations] = useState<TranslationData>({});
  const [isLoading, setIsLoading] = useState(false);

  const loadTranslations = useCallback(async (lang: string) => {
    if (translationCache[lang]) {
      setTranslations(translationCache[lang]);
      return;
    }
    
    setIsLoading(true);
    try {
      const module = await import(`./locales/${lang}.ts`);
      const data = module.default || module;
      translationCache[lang] = data;
      setTranslations(data);
    } catch (error) {
      console.warn(`Failed to load translations for ${lang}, falling back to English`);
      try {
        const enModule = await import('./locales/en.ts');
        const enData = enModule.default || enModule;
        translationCache['en'] = enData;
        setTranslations(enData);
      } catch (e) {
        console.error('Failed to load English translations');
        setTranslations({});
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTranslations(currentLanguage);
    localStorage.setItem('preferredLanguage', currentLanguage);
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = getLanguageDirection(currentLanguage);
  }, [currentLanguage, loadTranslations]);

  useEffect(() => {
    const langFromPath = getLanguageFromPath();
    if (langFromPath !== currentLanguage) {
      setCurrentLanguage(langFromPath);
    }
  }, [location.pathname, getLanguageFromPath, currentLanguage]);

  const setLanguage = useCallback((code: string) => {
    if (!isValidLanguageCode(code) || code === currentLanguage) return;
    
    const pathParts = location.pathname.split('/').filter(Boolean);
    let newPath: string;
    
    if (pathParts.length > 0 && isValidLanguageCode(pathParts[0])) {
      pathParts[0] = code;
      newPath = '/' + pathParts.join('/');
    } else {
      newPath = code === DEFAULT_LANGUAGE ? location.pathname : `/${code}${location.pathname}`;
    }
    
    setCurrentLanguage(code);
    navigate(newPath + location.search, { replace: true });
  }, [currentLanguage, location.pathname, location.search, navigate]);

  const t = useCallback((key: string, fallback?: string): string => {
    return translations[key] || fallback || key;
  }, [translations]);

  const getLocalizedPath = useCallback((path: string): string => {
    if (currentLanguage === DEFAULT_LANGUAGE) {
      return path;
    }
    if (path.startsWith('/admin')) {
      return path;
    }
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `/${currentLanguage}${cleanPath}`;
  }, [currentLanguage]);

  const getAlternateUrls = useCallback((path: string): { lang: string; url: string }[] => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    return SUPPORTED_LANGUAGES.map(lang => ({
      lang: lang.code,
      url: lang.code === DEFAULT_LANGUAGE 
        ? `${baseUrl}${cleanPath}`
        : `${baseUrl}/${lang.code}${cleanPath}`
    }));
  }, []);

  const direction = getLanguageDirection(currentLanguage);

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      direction,
      languages: SUPPORTED_LANGUAGES,
      setLanguage,
      t,
      isLoading,
      getLocalizedPath,
      getAlternateUrls,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useTranslation = () => {
  const { t, currentLanguage, isLoading } = useLanguage();
  return { t, language: currentLanguage, isLoading };
};
