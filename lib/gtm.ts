declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

// Events the site announces to Google Tag Manager. What each one triggers
// (Meta Pixel, GA4, ...) is configured inside the GTM container, not here.
export type GtmEvent =
  | "form_contacto"
  | "form_ficha_tecnica"
  | "form_info_tecnica";

// Never pass personal data (email, phone, name) here: it would reach third parties.
export function trackEvent(event: GtmEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event });
}
