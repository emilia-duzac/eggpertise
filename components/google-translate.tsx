"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Globe2 } from "lucide-react";
import { trackEvent } from "@/lib/gtm";
import { isLanguage, type Language } from "@/lib/languages";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: {
          new (
            options: {
              pageLanguage: string;
              includedLanguages: string;
              layout?: number;
              autoDisplay?: boolean;
            },
            elementId: string
          ): void;
          InlineLayout?: {
            SIMPLE: number;
          };
        };
      };
    };
  }
}

const PAGE_LANGUAGE = "es";
const COOKIE_NAME = "googtrans";
// Remembers a language change across the page reload (see GoogleTranslate).
const LANGUAGE_CHANGE_KEY = "gtm_language_change";
const FAR_FUTURE = "expires=Fri, 31 Dec 9999 23:59:59 GMT";
const EPOCH = "expires=Thu, 01 Jan 1970 00:00:00 GMT";

/**
 * Google Translate writes its cookie on the parent domain (.eggpertise.com)
 * while the widget below writes it on the exact host. Every scope has to be
 * covered, otherwise a stale cookie keeps the page translated.
 */
function cookieScopes() {
  const host = window.location.hostname;
  if (!host.includes(".")) return [""];

  const scopes = ["", `domain=${host}; `];
  const parts = host.split(".");
  for (let i = 1; i <= parts.length - 2; i++) {
    scopes.push(`domain=.${parts.slice(i).join(".")}; `);
  }
  return scopes;
}

function clearTranslationCookie() {
  for (const scope of cookieScopes()) {
    document.cookie = `${COOKIE_NAME}=; ${scope}path=/; ${EPOCH}`;
  }
}

function setTranslationCookie(target: string) {
  for (const scope of cookieScopes()) {
    document.cookie = `${COOKIE_NAME}=/${PAGE_LANGUAGE}/${target}; ${scope}path=/; ${FAR_FUTURE}`;
  }
}

export function GoogleTranslate() {
  const [language, setLanguage] = useState<Language>("es");

  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
    if (match?.[1] === "pt" || match?.[1] === "en") {
      setLanguage(match[1]);
    }

    // The page reloads when the language changes, so the event is announced
    // after the reload; sending it before could be lost.
    try {
      const changed = sessionStorage.getItem(LANGUAGE_CHANGE_KEY);
      if (isLanguage(changed)) {
        sessionStorage.removeItem(LANGUAGE_CHANGE_KEY);
        trackEvent({ event: "language_change", idioma: changed });
      }
    } catch {
      // sessionStorage can be blocked; the measurement is optional.
    }
  }, []);

  const changeLanguage = (nextLanguage: Language) => {
    clearTranslationCookie();
    if (nextLanguage !== PAGE_LANGUAGE) {
      setTranslationCookie(nextLanguage);
    }
    setLanguage(nextLanguage);
    try {
      sessionStorage.setItem(LANGUAGE_CHANGE_KEY, nextLanguage);
    } catch {
      // Optional measurement only.
    }
    window.location.reload();
  };

  return (
    <label className="notranslate relative inline-flex h-9 items-center" translate="no">
      <span className="sr-only">Idioma</span>
      <Globe2 className="pointer-events-none absolute left-3 h-4 w-4 text-foreground" />
      <select
        aria-label="Idioma"
        value={language}
        onChange={(event) =>
          changeLanguage(event.target.value as Language)
        }
        className="h-9 cursor-pointer appearance-none rounded-full border border-border bg-background py-1.5 pl-9 pr-8 text-sm font-medium text-foreground shadow-xs outline-none transition-colors hover:bg-accent focus-visible:ring-1 focus-visible:ring-ring"
      >
        <option value="es">ES</option>
        <option value="pt">PT</option>
        <option value="en">EN</option>
      </select>
      <span className="pointer-events-none absolute right-3 text-xs text-foreground">
        ▾
      </span>
    </label>
  );
}

export function GoogleTranslateProvider() {
  return (
    <>
      <div id="google_translate_element" className="google-translate-element" />
      <Script id="google-translate-init" strategy="afterInteractive">
        {`
          window.googleTranslateElementInit = function() {
            if (!window.google || !window.google.translate) return;
            if (document.getElementById('google_translate_element')?.dataset.initialized === 'true') return;
            document.getElementById('google_translate_element').dataset.initialized = 'true';
            new window.google.translate.TranslateElement({
              pageLanguage: 'es',
              includedLanguages: 'es,pt,en',
              autoDisplay: false
            }, 'google_translate_element');
          };
        `}
      </Script>
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
