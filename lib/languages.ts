// Languages the site can be shown in. "es" is the original; the others are
// produced by Google Translate (see components/google-translate.tsx).
export const LANGUAGES = ["es", "pt", "en"] as const;
export type Language = (typeof LANGUAGES)[number];

export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.includes(value as Language);
}
