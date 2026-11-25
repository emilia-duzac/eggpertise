// The company's WhatsApp numbers: the single place to change one. Used by the
// site (buttons, footer, contact, product pages), by the click measurement and
// by the emails (lib/email/contact.ts).
export const WHATSAPP = {
  AR: { number: "5491125155801", display: "+54 9 11 2515-5801" },
  US: { number: "13058154905", display: "+1 (305) 815-4905" },
} as const;

export type WhatsappCountry = keyof typeof WHATSAPP;

export const WHATSAPP_HOSTS = ["api.whatsapp.com", "wa.me"];

const DEFAULT_MESSAGE = "Hola EggPertise! Quiero información sobre:";

/** Link that opens a chat with the number of `country`, with `message` prefilled. */
export function whatsappUrl(
  country: WhatsappCountry,
  message: string = DEFAULT_MESSAGE
): string {
  const params = new URLSearchParams({
    phone: WHATSAPP[country].number,
    text: message,
    type: "phone_number",
    app_absent: "0",
  });
  return `https://api.whatsapp.com/send/?${params}`;
}

/** Which company number a WhatsApp link points to, or "otro" if none. */
export function countryOfNumber(digits: string): WhatsappCountry | "otro" {
  const match = (Object.keys(WHATSAPP) as WhatsappCountry[]).find(
    (country) => WHATSAPP[country].number === digits
  );
  return match ?? "otro";
}
