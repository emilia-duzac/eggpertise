import { COMPANY, EMAIL_ASSETS_URL } from "./contact";
import { escapeHtml, safeHref } from "./escape";
import {
  PREHEADER_PADDING_REPEATS,
  colors,
  fontSizes,
  fontStack,
  imageSizes,
  layout,
} from "./theme";

/**
 * Seal at the bottom right of the product emails.
 * - Own line (Compostaje): only its logo.
 * - Any other line: the EggPertise logo next to the supplier's.
 */
export type Seal =
  | { kind: "compostaje" }
  | { kind: "supplier"; name: string; logoUrl: string };

export interface EmailOptions {
  /** Short text the mail client shows next to the subject. */
  preheader: string;
  /** Inner HTML of the white card, built with ./components. */
  body: string;
  /** Why the recipient got this email. */
  footerReason: string;
  seal?: Seal;
  /** Emails for the team: no postal address in the footer. */
  internal?: boolean;
}

const image = (
  src: string,
  alt: string,
  size: { width: number; height: number }
) =>
  `<img src="${safeHref(src)}" alt="${escapeHtml(alt)}" width="${size.width}" height="${size.height}" style="display:block;border:0;width:${size.width}px;height:${size.height}px;">`;

function sealHtml(seal: Seal): string {
  const cells =
    seal.kind === "compostaje"
      ? `<td valign="middle">${image(`${EMAIL_ASSETS_URL}/compostaje.png`, "EggPertise Compostaje", imageSizes.compostajeLogo)}</td>`
      : `<td valign="middle" style="padding-right:14px;">${image(`${EMAIL_ASSETS_URL}/logo.png`, "EggPertise", imageSizes.sealLogo)}</td>` +
        `<td valign="middle" style="border-left:1px solid ${colors.line};padding-left:14px;">` +
        // The supplier's logo has an unknown ratio: fix the width only.
        `<img src="${safeHref(seal.logoUrl)}" alt="${escapeHtml(seal.name)}" width="${imageSizes.supplierLogoWidth}" style="display:block;border:0;width:${imageSizes.supplierLogoWidth}px;height:auto;">` +
        `</td>`;

  return (
    `<table role="presentation" align="right" cellpadding="0" cellspacing="0" style="margin-top:8px;"><tr>${cells}</tr></table>` +
    `<div style="clear:both;font-size:0;line-height:0;">&nbsp;</div>`
  );
}

/** Wraps the body in the common frame and returns the full HTML document. */
export function renderEmail(options: EmailOptions): string {
  const { preheader, body, footerReason, seal, internal } = options;

  const footer =
    `${escapeHtml(footerReason)}<br>` +
    `<span style="color:${colors.ink};font-weight:700;">${COMPANY.name}</span> · ${COMPANY.website}` +
    (internal ? "" : `<br>${escapeHtml(COMPANY.address)}`);

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${COMPANY.name}</title>
<style>
  @media (max-width: 480px) {
    .card { padding: ${layout.cardPaddingMobile}px !important; }
    .outer { padding: 24px 12px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${colors.paper};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(preheader)}${"&#8204;&nbsp;".repeat(PREHEADER_PADDING_REPEATS)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.paper};"><tr><td align="center" class="outer" style="padding:24px 20px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:${layout.maxWidth}px;">
    <tr><td style="padding:0 0 14px 0;">${image(`${EMAIL_ASSETS_URL}/logo.png`, COMPANY.name, imageSizes.logo)}</td></tr>
    <tr><td style="height:3px;background:${colors.navy};font-size:0;line-height:0;">&nbsp;</td></tr>
    <tr><td class="card" style="background:${colors.white};border:1px solid ${colors.line};border-top:0;padding:${layout.cardPadding}px;">${body}${seal ? sealHtml(seal) : ""}</td></tr>
    <tr><td style="padding:16px 0 0;font-family:${fontStack};font-size:${fontSizes.footer}px;line-height:1.6;color:${colors.muted};">${footer}</td></tr>
  </table>
</td></tr></table>
</body>
</html>`;
}

export interface PlainTextOptions {
  title: string;
  paragraphs: string[];
  footerReason: string;
  internal?: boolean;
}

/**
 * Plain-text alternative of an email. Sent next to the HTML: it helps
 * deliverability and covers clients that do not render HTML.
 */
export function renderPlainText(options: PlainTextOptions): string {
  const { title, paragraphs, footerReason, internal } = options;

  return [
    title,
    ...paragraphs,
    "—",
    footerReason,
    `${COMPANY.name} · ${COMPANY.website}`,
    ...(internal ? [] : [COMPANY.address]),
  ].join("\n\n");
}
