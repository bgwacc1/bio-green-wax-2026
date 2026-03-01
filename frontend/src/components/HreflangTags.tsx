import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useLanguage, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@/i18n";

interface HreflangTagsProps {
  canonicalPath?: string;
}

const HreflangTags = ({ canonicalPath }: HreflangTagsProps) => {
  const location = useLocation();
  const { currentLanguage, direction } = useLanguage();
  
  const getCleanPath = () => {
    if (canonicalPath) return canonicalPath;
    
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0 && SUPPORTED_LANGUAGES.some(lang => lang.code === pathParts[0])) {
      pathParts.shift();
    }
    return '/' + pathParts.join('/');
  };
  
  const cleanPath = getCleanPath();
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://biogreenwax.com';
  
  const getLanguageUrl = (langCode: string) => {
    if (langCode === DEFAULT_LANGUAGE) {
      return `${baseUrl}${cleanPath}`;
    }
    return `${baseUrl}/${langCode}${cleanPath}`;
  };

  return (
    <Helmet>
      <html lang={currentLanguage} dir={direction} />
      <link rel="canonical" href={getLanguageUrl(currentLanguage)} />
      
      {SUPPORTED_LANGUAGES.map((lang) => (
        <link
          key={lang.code}
          rel="alternate"
          hrefLang={lang.code}
          href={getLanguageUrl(lang.code)}
        />
      ))}
      
      <link
        rel="alternate"
        hrefLang="x-default"
        href={getLanguageUrl(DEFAULT_LANGUAGE)}
      />
    </Helmet>
  );
};

export default HreflangTags;
