import {
  button,
  contactCard,
  dataTable,
  label,
  link,
  note,
  paragraph,
  raw,
  statusNote,
  title,
} from "../components";
import {
  SALES_CONTACT_INTRO,
  clientReplyTo,
  contactDrafts,
  salesContactText,
} from "../contact";
import { escapeHtml } from "../escape";
import { renderEmail, renderPlainText } from "../layout";
import { sealFor, type EmailMessage, type ProductContext } from "../types";

export interface FichaRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  product: ProductContext;
  /** Name of the file, for the team notification. */
  fichaName: string;
  fichaUrl: string;
}

/** Sent to the client who asked for a datasheet. */
export function fichaClientEmail(data: FichaRequest): EmailMessage {
  const { firstName, product, fichaUrl } = data;
  const heading = `Gracias por tu interés en ${product.name}`;
  const greeting = `Hola ${firstName}, ya podés descargar la ficha técnica que solicitaste.`;
  const footerReason =
    "Recibiste este mail porque pediste una ficha técnica en eggpertise.com.";
  const preheader =
    "Ya podés descargarla. Si querés cotizar, escribile a nuestro equipo de ventas.";

  const html = renderEmail({
    preheader,
    footerReason,
    seal: sealFor(product),
    body:
      label("Ficha técnica") +
      title(heading) +
      paragraph(escapeHtml(greeting)) +
      button("Descargar ficha técnica", fichaUrl) +
      note(
        `También podés acceder desde el navegador copiando el enlace: ${link(fichaUrl, fichaUrl)}`
      ) +
      paragraph(SALES_CONTACT_INTRO) +
      contactCard(contactDrafts.ficha(product.name)),
  });

  const text = renderPlainText({
    title: heading,
    paragraphs: [
      `${greeting}\n${fichaUrl}`,
      SALES_CONTACT_INTRO,
      salesContactText(),
    ],
    footerReason,
  });

  return {
    subject: `Tu ficha técnica de ${product.name}`,
    html,
    text,
    replyTo: clientReplyTo(),
  };
}

/** Sent to the team when someone asks for a datasheet. Reply goes to the lead. */
export function fichaTeamEmail(data: FichaRequest, date: string): EmailMessage {
  const { firstName, lastName, email, phone, country, product, fichaName } = data;
  const fullName = `${firstName} ${lastName}`;
  const heading = `Solicitud de ficha técnica de ${product.name}`;
  const status = "El cliente ya recibió la ficha por mail.";
  const footerReason = `Aviso automático desde eggpertise.com · ${date}`;

  const html = renderEmail({
    preheader: `${fullName} pidió la ficha de ${product.name}. Ya la recibió.`,
    footerReason,
    internal: true,
    body:
      label("Aviso interno · Ficha enviada") +
      title(heading) +
      statusNote(`<b>${status}</b>`) +
      dataTable([
        [
          { label: "Producto", value: product.name },
          { label: "Ficha solicitada", value: fichaName },
        ],
        [
          { label: "Nombre", value: fullName },
          { label: "País", value: country },
        ],
        [
          { label: "Email", value: raw(link(email, `mailto:${email}`)) },
          { label: "Teléfono", value: phone },
        ],
      ]),
  });

  const text = renderPlainText({
    title: heading,
    paragraphs: [
      status,
      `Producto: ${product.name}\nFicha solicitada: ${fichaName}\nNombre: ${fullName}\nPaís: ${country}\nEmail: ${email}\nTeléfono: ${phone}`,
    ],
    footerReason,
    internal: true,
  });

  return {
    subject: `Ficha enviada: ${product.name} · ${fullName}`.replace(/\s+/g, " "),
    html,
    text,
    replyTo: email,
  };
}
