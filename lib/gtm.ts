declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

// Events the site announces to Google Tag Manager. Names follow GA4's
// recommended events; what each one triggers (GA4, Meta Pixel, LinkedIn, ...)
// is configured inside the GTM container, not here. Keep docs/metricas.md in
// sync when adding one.
export type GtmEvent =
  | {
      event: "generate_lead";
      // Which form was sent.
      form: "contacto" | "ficha_tecnica" | "info_tecnica";
      // Product slug, when the form belongs to a product page.
      producto?: string;
    }
  | {
      // A click on a WhatsApp, phone or email link (see click-tracker.tsx).
      event: "click_whatsapp" | "click_phone" | "click_email";
      // Where on the page the link is (section id, "footer", "boton_flotante"...).
      ubicacion: string;
      // WhatsApp only: which company number was opened.
      pais_numero?: "AR" | "US" | "otro";
      producto?: string;
    }
  | {
      event: "click_social";
      red: "linkedin" | "instagram" | "youtube";
      ubicacion: string;
    };

// Never pass personal data (email, phone, name) here: it would reach third parties.
export function trackEvent(data: GtmEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ...data });
}
