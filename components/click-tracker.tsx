"use client";

import { useEffect } from "react";
import { trackEvent, type GtmEvent } from "@/lib/gtm";
import { WHATSAPP_HOSTS, countryOfNumber, type WhatsappCountry } from "@/lib/whatsapp";

const SOCIAL_HOSTS: Record<string, "linkedin" | "instagram" | "youtube"> = {
  "linkedin.com": "linkedin",
  "instagram.com": "instagram",
  "youtube.com": "youtube",
};
const DEFAULT_UBICACION = "pagina";
const MIDDLE_MOUSE_BUTTON = 1;

// Where the link lives: an explicit data-ubicacion, else the closest section
// with an id, else the page region (header/footer).
function getUbicacion(link: Element): string {
  const explicit = link.closest("[data-ubicacion]")?.getAttribute("data-ubicacion");
  if (explicit) return explicit;
  const withId = link.closest("[id]")?.id;
  if (withId) return withId;
  if (link.closest("footer")) return "footer";
  if (link.closest("header")) return "header";
  return DEFAULT_UBICACION;
}

function getProducto(): string | undefined {
  return window.location.pathname.match(/^\/productos\/([^/]+)/)?.[1];
}

function paisDelNumero(url: URL): WhatsappCountry | "otro" {
  const phone = url.searchParams.get("phone") ?? url.pathname.replace(/\D/g, "");
  return countryOfNumber(phone);
}

// Decides which event, if any, a link click is, from the link's address.
function classify(url: URL, ubicacion: string): GtmEvent | null {
  const host = url.hostname.replace(/^www\./, "");
  const producto = getProducto();

  if (url.protocol === "tel:") return { event: "click_phone", ubicacion, producto };
  if (url.protocol === "mailto:") return { event: "click_email", ubicacion, producto };
  if (WHATSAPP_HOSTS.includes(host)) {
    return { event: "click_whatsapp", ubicacion, producto, pais_numero: paisDelNumero(url) };
  }
  if (SOCIAL_HOSTS[host]) return { event: "click_social", red: SOCIAL_HOSTS[host], ubicacion };
  return null;
}

// One listener for every contact link on the site, so new buttons are measured
// without extra code. Sends no personal data.
export function ClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // "auxclick" also fires for the right button; only the middle one opens a link.
      if (e.type === "auxclick" && e.button !== MIDDLE_MOUSE_BUTTON) return;

      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!link) return;

      let url: URL;
      try {
        url = new URL(link.getAttribute("href") || "", window.location.href);
      } catch {
        return;
      }

      const event = classify(url, getUbicacion(link));
      if (event) trackEvent(event);
    };

    document.addEventListener("click", onClick);
    document.addEventListener("auxclick", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("auxclick", onClick);
    };
  }, []);

  return null;
}
