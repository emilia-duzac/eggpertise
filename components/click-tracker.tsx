"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/gtm";

const SOCIAL_HOSTS: Record<string, "linkedin" | "instagram" | "youtube"> = {
  "linkedin.com": "linkedin",
  "instagram.com": "instagram",
  "youtube.com": "youtube",
};

// Where the link lives: an explicit data-ubicacion, else the closest section
// with an id, else the page region (header/footer).
function getUbicacion(link: Element): string {
  const explicit = link.closest("[data-ubicacion]")?.getAttribute("data-ubicacion");
  if (explicit) return explicit;
  const withId = link.closest("[id]")?.id;
  if (withId) return withId;
  if (link.closest("footer")) return "footer";
  if (link.closest("header")) return "header";
  return "pagina";
}

function getProducto(): string | undefined {
  const match = window.location.pathname.match(/^\/productos\/([^/]+)/);
  return match?.[1];
}

function paisDelNumero(url: URL): "AR" | "US" | "otro" {
  const phone = url.searchParams.get("phone") ?? url.pathname.replace(/\D/g, "");
  if (phone.startsWith("54")) return "AR";
  if (phone.startsWith("1")) return "US";
  return "otro";
}

// One listener for every contact link on the site, so new buttons are measured
// without extra code. Classifies by the link's address; sends no personal data.
export function ClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!link) return;

      let url: URL;
      try {
        url = new URL(link.getAttribute("href") || "", window.location.href);
      } catch {
        return;
      }

      const ubicacion = getUbicacion(link);
      const host = url.hostname.replace(/^www\./, "");

      if (url.protocol === "tel:") {
        trackEvent({ event: "click_phone", ubicacion, producto: getProducto() });
      } else if (url.protocol === "mailto:") {
        trackEvent({ event: "click_email", ubicacion, producto: getProducto() });
      } else if (host === "api.whatsapp.com" || host === "wa.me") {
        trackEvent({
          event: "click_whatsapp",
          ubicacion,
          pais_numero: paisDelNumero(url),
          producto: getProducto(),
        });
      } else if (SOCIAL_HOSTS[host]) {
        trackEvent({ event: "click_social", red: SOCIAL_HOSTS[host], ubicacion });
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
