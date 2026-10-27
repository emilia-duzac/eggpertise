import {
  EMAIL_ASSETS_URL,
  SALES_CONTACT,
  mailtoLink,
  whatsappLink,
} from "./contact";
import { escapeHtml, safeHref } from "./escape";
import { colors, fontSizes, fontStack } from "./theme";

/**
 * Building blocks for the emails. Every function returns an HTML string with
 * inline styles, which is the only thing mail clients reliably render.
 *
 * Text arguments are escaped here. The exceptions are `paragraph` and `note`,
 * which take markup so a caller can bold a word: escape anything a visitor
 * typed with `escapeHtml` before putting it in there.
 */

/** HTML that is already safe and must not be escaped again. */
export class Raw {
  constructor(readonly html: string) {}
}

export const raw = (html: string) => new Raw(html);

const text = (value: string | Raw) =>
  value instanceof Raw ? value.html : escapeHtml(value);

/** Small label above a title or a piece of data. */
export function label(value: string): string {
  return `<div style="margin:0 0 10px;font-family:${fontStack};font-weight:700;font-size:${fontSizes.label}px;letter-spacing:.08em;text-transform:uppercase;color:${colors.navy2};">${escapeHtml(value)}</div>`;
}

/** Title with the signal bar underneath. */
export function title(value: string): string {
  return (
    `<h1 style="margin:0 0 12px;font-family:${fontStack};font-weight:900;font-size:${fontSizes.title}px;line-height:1.2;letter-spacing:-0.02em;color:${colors.navy};">${escapeHtml(value)}</h1>` +
    `<div style="width:76px;height:4px;background:${colors.sky};margin:0 0 20px;font-size:0;line-height:0;">&nbsp;</div>`
  );
}

export function paragraph(html: string): string {
  return `<p style="margin:0 0 16px;font-family:${fontStack};font-size:${fontSizes.body}px;line-height:1.6;color:${colors.ink};">${html}</p>`;
}

export function note(html: string): string {
  return `<p style="margin:0 0 16px;font-family:${fontStack};font-size:${fontSizes.note}px;line-height:1.6;color:${colors.muted};">${html}</p>`;
}

export function link(value: string | Raw, href: string): string {
  return `<a href="${safeHref(href)}" target="_blank" rel="noopener" style="color:${colors.navy2};text-decoration:underline;">${text(value)}</a>`;
}

/** The one call to action of the email: navy pill with white text. */
export function button(labelText: string, href: string): string {
  return (
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;"><tr>` +
    `<td style="background:${colors.navy};border-radius:999px;">` +
    `<a href="${safeHref(href)}" target="_blank" rel="noopener" style="display:inline-block;padding:14px 30px;border-radius:999px;font-family:${fontStack};font-weight:700;font-size:${fontSizes.body}px;color:${colors.white};text-decoration:none;">${escapeHtml(labelText)}</a>` +
    `</td></tr></table>`
  );
}

/** Closing line of the emails that reach the client. */
export function signature(value = "Gracias por tu interés en EggPertise."): string {
  return `<p style="margin:24px 0 0;font-family:${fontStack};font-size:${fontSizes.signature}px;line-height:1.6;color:${colors.ink};">${escapeHtml(value)}</p>`;
}

/** What the visitor wrote, set apart with a rule on the left. */
export function quote(value: string): string {
  return `<div style="margin:0 0 20px;padding:2px 0 2px 16px;border-left:3px solid ${colors.sky};font-family:${fontStack};font-size:${fontSizes.data}px;line-height:1.6;color:${colors.ink};white-space:pre-wrap;">${escapeHtml(value)}</div>`;
}

export type DataCell = { label: string; value: string | Raw };

function dataCell({ label: cellLabel, value }: DataCell, width: string, colspan = 1) {
  return (
    `<td width="${width}" colspan="${colspan}" valign="top" style="padding:12px 12px 12px 0;border-top:1px solid ${colors.line};">` +
    `<div style="font-family:${fontStack};font-weight:700;font-size:${fontSizes.label}px;letter-spacing:.08em;text-transform:uppercase;color:${colors.muted};margin-bottom:3px;">${escapeHtml(cellLabel)}</div>` +
    `<div style="font-family:${fontStack};font-size:${fontSizes.data}px;line-height:1.4;color:${colors.ink};word-break:break-word;">${text(value)}</div>` +
    `</td>`
  );
}

/**
 * Table of label/value pairs separated by hairlines, no boxes. Each row has
 * one or two cells; a row with one cell takes the full width.
 */
export function dataTable(rows: DataCell[][]): string {
  const body = rows
    .map((row) =>
      row.length === 1
        ? `<tr>${dataCell(row[0], "100%", 2)}</tr>`
        : `<tr>${row.map((cell) => dataCell(cell, "50%")).join("")}</tr>`
    )
    .join("");

  return (
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">${body}` +
    `<tr><td colspan="2" style="border-top:1px solid ${colors.line};font-size:0;line-height:0;">&nbsp;</td></tr></table>`
  );
}

/** Icon shown inline before a value. Displayed at 20px, exported at 60px. */
export function icon(name: "whatsapp" | "gmail"): string {
  return `<img src="${EMAIL_ASSETS_URL}/${name}.png" width="20" height="20" alt="" style="vertical-align:-5px;margin-right:8px;border:0;">`;
}

function pill(options: {
  icon: "whatsapp" | "gmail";
  text: string;
  href: string;
  background: string;
  border: string;
}): string {
  return `<a href="${safeHref(options.href)}" target="_blank" rel="noopener" style="display:inline-block;box-sizing:border-box;min-width:268px;text-decoration:none;white-space:nowrap;background:${options.background};border:1.5px solid ${options.border};border-radius:999px;padding:7px 18px 7px 12px;font-family:${fontStack};font-weight:700;font-size:14px;line-height:22px;color:${colors.navy2};">${icon(options.icon)}${escapeHtml(options.text)}</a>`;
}

/**
 * Card with the sales contact. Both pills open with the text already written,
 * so the client only has to send.
 */
export function contactCard(draft: { subject: string; message: string }): string {
  return (
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:${colors.paper};border:1px solid ${colors.line};border-radius:20px;">` +
    `<tr><td style="padding:18px 20px 6px;">` +
    `<div style="font-family:${fontStack};font-weight:900;font-size:17px;color:${colors.navy};">${escapeHtml(SALES_CONTACT.name)}</div>` +
    `<div style="font-family:${fontStack};font-size:${fontSizes.signature}px;color:${colors.muted};">${escapeHtml(SALES_CONTACT.role)} · EggPertise</div>` +
    `</td></tr>` +
    `<tr><td style="padding:8px 20px 0;">${pill({
      icon: "whatsapp",
      text: SALES_CONTACT.phone,
      href: whatsappLink(draft.message),
      background: colors.whatsappLight,
      border: colors.whatsapp,
    })}</td></tr>` +
    `<tr><td style="padding:10px 20px 18px;">${pill({
      icon: "gmail",
      text: SALES_CONTACT.email,
      href: mailtoLink(draft.subject, draft.message),
      background: colors.skyLight,
      border: colors.sky,
    })}</td></tr></table>`
  );
}
