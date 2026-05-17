declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type AnalyticsParams = Record<string, string | number | boolean | undefined | null>;

export const trackEvent = (eventName: string, params: AnalyticsParams = {}) => {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", eventName, {
    ...params,
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
  });
};

export const trackPageView = (params: AnalyticsParams = {}) => {
  trackEvent("page_view", params);
};
