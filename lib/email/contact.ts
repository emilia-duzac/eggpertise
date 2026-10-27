/**
 * Company and sales contact data shown in the emails, in one place.
 * These are public details (they are in the sales contact's signature), not
 * secrets.
*/

// Overridable so images also load from a preview deploy; production otherwise.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.eggpertise.com"
).replace(/\/$/, "");

// Images in emails need an absolute URL. They live in public/brand/email.
export const EMAIL_ASSETS_URL = `${SITE_URL}/brand/email`;

export const COMPANY = {
  name: "EggPertise",
  website: "www.eggpertise.com",
  address:
    "Parque Empresarial Austral – Flex 1, Módulo 3 · Av. Sgto. Cayetano Beliera 3025 · B1629 Pilar, Buenos Aires, Argentina",
} as const;

export const SALES_CONTACT = {
  name: "Tomás Strenitz",
  role: "Gerente de Proyectos",
  phone: "+54 9 11 2515 5801",
  // Digits only, as wa.me expects.
  whatsappNumber: "5491125155801",
  email: "tomas.strenitz@eggpertise.com",
} as const;

// Replies to the client emails go to the sales contact and to the shared inbox.
export function clientReplyTo(): string[] {
  return [
    SALES_CONTACT.email,
    process.env.CONTACT_EMAIL || "info@eggpertise.com",
  ];
}

export function whatsappLink(message: string): string {
  return `https://wa.me/${SALES_CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function mailtoLink(subject: string, body: string): string {
  return `mailto:${SALES_CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Text prefilled in WhatsApp and in the email draft when the client taps the
 * sales contact, one per email.
 */
export const contactDrafts = {
  ficha: (product: string) => ({
    subject: `Consulta sobre ${product}`,
    message: `Hola Tomás, solicité la ficha técnica de ${product} y me gustaría obtener más información.`,
  }),
  contact: (name: string, company: string) => ({
    subject: "Consulta desde el formulario de contacto",
    message: `Hola Tomás, soy ${name} de ${company}. Les escribí a través del formulario de contacto.`,
  }),
  technicalInfo: (product: string, company: string) => ({
    subject: `Información técnica sobre ${product}`,
    message: `Hola Tomás, pedimos información técnica sobre ${product} desde ${company}.`,
  }),
};
