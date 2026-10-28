/**
 * Visual tokens shared by every email. Colors come from the Brand Book; the
 * only values that are not in it are marked below.
 *
 * Emails need inline styles and absolute image URLs, so these are plain
 * constants consumed by the layout and components, not CSS variables.
 */

export const colors = {
  navy: "#001C45", // Imperial blue: rule under the logo, titles, primary button
  navy2: "#12346F", // Secondary blue: labels, links
  sky: "#8FAFD0", // Light blue: signal bar, quote rule
  skyLight: "#D2E3F2", // Lightest blue: email pill background
  paper: "#F8FAFC", // Page background
  line: "#E5EAF2", // Hairlines and borders
  ink: "#1A1A1A", // Body text
  muted: "#5B6B86", // Secondary text. Not in the Brand Book.
  white: "#FFFFFF",
  whatsapp: "#25D366", // WhatsApp's own green, only on its pill
  whatsappLight: "#E6F7EC", // Background of the WhatsApp pill
} as const;

/**
 * Gmail and Outlook do not load web fonts, so Lato is only used where the
 * client already has it. Calibri and Source Sans 3 are the Brand Book's
 * approved substitutes; Arial is not allowed.
 */
export const fontStack = "Lato, Calibri, 'Source Sans 3', sans-serif";

export const fontSizes = {
  title: 26,
  body: 16,
  data: 15,
  note: 13,
  secondary: 14,
  contactName: 17,
  label: 11,
  footer: 12,
} as const;

export const layout = {
  // Width of the white card on desktop. Clients shrink it on their own.
  maxWidth: 640,
  logoHeight: 42,
  cardPadding: 32,
  cardPaddingMobile: 20,
  pagePadding: "24px 20px",
  pagePaddingMobile: "24px 12px",
  mobileBreakpoint: 480, // px: below this width the mobile paddings apply
  ruleHeight: 3, // the rule under the logo
  signalBar: { width: 76, height: 4 }, // the bar under the title
} as const;

// Corner radii: the Brand Book's closed scale.
export const radius = {
  pill: 999,
  card: 20,
} as const;

// The call to action button.
export const buttonSize = {
  paddingY: 14,
  paddingX: 30,
} as const;

/**
 * Sizes at which the images are shown, in px. The PNGs in public/brand/email
 * are exported at three times these values (see scripts/build-email-assets.cjs).
 */
export const imageSizes = {
  logo: { width: 109, height: layout.logoHeight },
  sealLogo: { width: 78, height: 30 },
  compostajeLogo: { width: 93, height: 40 },
  supplierLogoWidth: 96, // the supplier's ratio is unknown: only the width is fixed
  icon: 20,
} as const;

// Pill buttons of the contact card.
export const pill = {
  minWidth: 268,
  fontSize: 14,
  lineHeight: 22,
  borderWidth: 1.5,
  padding: "7px 18px 7px 12px",
} as const;

// Invisible characters after the preheader, so the mail client does not
// continue it with the first words of the body.
export const PREHEADER_PADDING_REPEATS = 60;
