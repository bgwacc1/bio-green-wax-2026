import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const API_URL = '/api';

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function getVisitorId(): string {
  let visitorId = localStorage.getItem('bgw_visitor_id');
  if (!visitorId) {
    visitorId = generateId();
    localStorage.setItem('bgw_visitor_id', visitorId);
  }
  return visitorId;
}

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('bgw_session_id');
  if (!sessionId) {
    sessionId = generateId();
    sessionStorage.setItem('bgw_session_id', sessionId);
  }
  return sessionId;
}

function isNewVisitor(): boolean {
  return !localStorage.getItem('bgw_returning');
}

function markAsReturning(): void {
  localStorage.setItem('bgw_returning', '1');
}

function getBrowserInfo(): { browser: string; version: string } {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let version = '';

  if (ua.includes('Firefox/')) {
    browser = 'Firefox';
    version = ua.match(/Firefox\/(\d+(\.\d+)?)/)?.[1] || '';
  } else if (ua.includes('Edg/')) {
    browser = 'Edge';
    version = ua.match(/Edg\/(\d+(\.\d+)?)/)?.[1] || '';
  } else if (ua.includes('Chrome/')) {
    browser = 'Chrome';
    version = ua.match(/Chrome\/(\d+(\.\d+)?)/)?.[1] || '';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    browser = 'Safari';
    version = ua.match(/Version\/(\d+(\.\d+)?)/)?.[1] || '';
  } else if (ua.includes('MSIE') || ua.includes('Trident/')) {
    browser = 'Internet Explorer';
    version = ua.match(/(?:MSIE |rv:)(\d+(\.\d+)?)/)?.[1] || '';
  }

  return { browser, version };
}

function getOS(): string {
  const ua = navigator.userAgent;
  
  if (ua.includes('Windows NT 10')) return 'Windows 10';
  if (ua.includes('Windows NT 6.3')) return 'Windows 8.1';
  if (ua.includes('Windows NT 6.2')) return 'Windows 8';
  if (ua.includes('Windows NT 6.1')) return 'Windows 7';
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac OS X')) return 'macOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  if (ua.includes('Linux')) return 'Linux';
  
  return 'Unknown';
}

function getDeviceType(): string {
  const ua = navigator.userAgent.toLowerCase();
  
  if (ua.includes('tablet') || ua.includes('ipad')) return 'tablet';
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) return 'mobile';
  
  return 'desktop';
}

function getReferrerDomain(): string {
  if (!document.referrer) return '';
  try {
    const url = new URL(document.referrer);
    if (url.hostname === window.location.hostname) return '';
    return url.hostname;
  } catch {
    return '';
  }
}

function getUTMParams(): { source: string; medium: string; campaign: string } {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('utm_source') || '',
    medium: params.get('utm_medium') || '',
    campaign: params.get('utm_campaign') || ''
  };
}

export function useAnalytics(): void {
  const location = useLocation();
  const lastPath = useRef<string>('');
  const pageStartTime = useRef<number>(Date.now());
  const maxScrollDepth = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);
        maxScrollDepth.current = Math.max(maxScrollDepth.current, scrollPercent);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    
    if (currentPath.startsWith('/admin')) {
      return;
    }

    const sendPreviousPageData = async () => {
      if (lastPath.current && lastPath.current !== currentPath) {
        const timeOnPage = Math.round((Date.now() - pageStartTime.current) / 1000);
        
        try {
          await fetch(`${API_URL}/analytics/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              visitor_id: getVisitorId(),
              session_id: getSessionId(),
              page_path: lastPath.current,
              page_title: document.title,
              time_on_page: timeOnPage,
              scroll_depth: maxScrollDepth.current
            })
          });
        } catch (e) {
          console.debug('Analytics update failed:', e);
        }
      }
    };

    const trackPageView = async () => {
      await sendPreviousPageData();
      
      pageStartTime.current = Date.now();
      maxScrollDepth.current = 0;
      lastPath.current = currentPath;

      const browserInfo = getBrowserInfo();
      const utm = getUTMParams();
      const newVisitor = isNewVisitor();

      try {
        await fetch(`${API_URL}/analytics/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitor_id: getVisitorId(),
            session_id: getSessionId(),
            page_path: currentPath,
            page_title: document.title,
            browser: browserInfo.browser,
            browser_version: browserInfo.version,
            operating_system: getOS(),
            device_type: getDeviceType(),
            screen_width: window.screen.width,
            screen_height: window.screen.height,
            language: navigator.language,
            referrer: document.referrer,
            referrer_domain: getReferrerDomain(),
            utm_source: utm.source,
            utm_medium: utm.medium,
            utm_campaign: utm.campaign,
            is_new_visitor: newVisitor,
            time_on_page: 0,
            scroll_depth: 0
          })
        });

        if (newVisitor) {
          markAsReturning();
        }
      } catch (e) {
        console.debug('Analytics tracking failed:', e);
      }
    };

    trackPageView();

    const handleBeforeUnload = () => {
      const timeOnPage = Math.round((Date.now() - pageStartTime.current) / 1000);
      
      const data = JSON.stringify({
        visitor_id: getVisitorId(),
        session_id: getSessionId(),
        page_path: currentPath,
        page_title: document.title,
        time_on_page: timeOnPage,
        scroll_depth: maxScrollDepth.current
      });
      
      const blob = new Blob([data], { type: 'application/json' });
      navigator.sendBeacon(`${API_URL}/analytics/track`, blob);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleBeforeUnload();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname]);
}
