import type { Language } from "@/lib/languages";
import type { WhatsappCountry } from "@/lib/whatsapp";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

// Container ID (GTM-XXXX). Undefined when missing or malformed, which turns
// the whole integration off (previews and local builds stay clean). It ends up
// inside an inline script, hence the format check.
const rawId = process.env.NEXT_PUBLIC_GTM_ID;
export const GTM_ID = rawId && /^GTM-[A-Z0-9]+$/.test(rawId) ? rawId : undefined;

// Events the site announces to Google Tag Manager. Names follow GA4's
// recommended events; what each one triggers (GA4, Meta Pixel, LinkedIn, ...)
// is configured inside the GTM container, not here. Keep docs/metricas.md in
// sync when adding one.
export type GtmForm = "contacto" | "ficha_tecnica" | "info_tecnica";

// Product slug, when the event happens on or about a product.
type WithProducto = { producto?: string };

export type GtmEvent =
  | ({
      event: "generate_lead";
      // Which form was sent.
      form: GtmForm;
    } & WithProducto)
  | ({
      // A click on a WhatsApp, phone or email link (see click-tracker.tsx).
      event: "click_whatsapp" | "click_phone" | "click_email";
      // Where on the page the link is (section id, "footer", "boton_flotante"...).
      ubicacion: string;
      // WhatsApp only: which company number was opened.
      pais_numero?: WhatsappCountry | "otro";
    } & WithProducto)
  | ({
      // Someone opened a form or started typing in it (before sending).
      event: "form_start";
      form: GtmForm;
    } & WithProducto)
  | {
      // A product page was opened. Follows GA4's view_item shape.
      event: "view_item";
      ecommerce: {
        items: { item_id: string; item_name: string; item_brand?: string }[];
      };
    }
  | {
      event: "language_change";
      idioma: Language;
    }
  | {
      event: "click_social";
      red: "linkedin" | "instagram" | "youtube";
      ubicacion: string;
    };

// Never pass personal data (email, phone, name) here: it would reach third parties.
export function trackEvent(data: GtmEvent) {
  if (!GTM_ID || typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  // GTM keeps the last ecommerce object; clear it so items never carry over.
  if ("ecommerce" in data) window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({ ...data });
}
