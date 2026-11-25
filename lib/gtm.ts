declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

// Events the site announces to Google Tag Manager. Names follow GA4's
// recommended events; what each one triggers (GA4, Meta Pixel, LinkedIn, ...)
// is configured inside the GTM container, not here. Keep docs/metricas.md in
// sync when adding one.
export type GtmEvent = {
  event: "generate_lead";
  // Which form was sent.
  form: "contacto" | "ficha_tecnica" | "info_tecnica";
  // Product slug, when the form belongs to a product page.
  producto?: string;
};

// Never pass personal data (email, phone, name) here: it would reach third parties.
export function trackEvent(data: GtmEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ...data });
}
