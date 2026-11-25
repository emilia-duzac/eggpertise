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
      // Someone opened a form or started typing in it (before sending).
      event: "form_start";
      form: "contacto" | "ficha_tecnica" | "info_tecnica";
      producto?: string;
    }
  | {
      // A product page was opened. Follows GA4's view_item shape.
      event: "view_item";
      ecommerce: {
        items: { item_id: string; item_name: string; item_brand?: string }[];
      };
    }
  | {
      event: "language_change";
      idioma: "es" | "pt" | "en";
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
  // GTM keeps the last ecommerce object; clear it so items never carry over.
  if ("ecommerce" in data) window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({ ...data });
}
