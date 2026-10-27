import {
  button,
  contactCard,
  dataTable,
  icon,
  label,
  link,
  note,
  paragraph,
  raw,
  signature,
  title,
} from "../components";
import {
  CLIENT_SIGNATURE,
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
  const heading = `Hola ${firstName}, esta es la ficha técnica que solicitaste`;
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
      paragraph(`Gracias por tu interés en <b>${escapeHtml(product.name)}</b>.`) +
      button("Descargar", fichaUrl) +
      note(
        `También podés acceder desde el navegador copiando el enlace: ${link(fichaUrl, fichaUrl)}`
      ) +
      paragraph(SALES_CONTACT_INTRO) +
      contactCard(contactDrafts.ficha(product.name)) +
      signature(),
  });

  const text = renderPlainText({
    title: heading,
    paragraphs: [
      `Gracias por tu interés en ${product.name}. Descargá la ficha técnica acá: ${fichaUrl}`,
      SALES_CONTACT_INTRO,
      salesContactText(),
      CLIENT_SIGNATURE,
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
  const heading = "Nueva solicitud de ficha técnica";
  const footerReason = `Aviso automático desde eggpertise.com · ${date}`;

  const html = renderEmail({
    preheader: `${fullName} pidió la ficha de ${product.name}.`,
    footerReason,
    internal: true,
    body:
      label("Aviso interno · Descarga Ficha Técnica") +
      title(heading) +
      dataTable([
        [
          { label: "Nombre", value: fullName },
          { label: "País", value: country },
        ],
        [
          {
            label: "Email",
            value: raw(icon("gmail") + link(email, `mailto:${email}`)),
          },
          { label: "Teléfono", value: phone },
        ],
        [
          { label: "Producto", value: product.name },
          { label: "Ficha solicitada", value: fichaName },
        ],
      ]),
  });

  const text = renderPlainText({
    title: heading,
    paragraphs: [
      `Nombre: ${fullName}\nPaís: ${country}\nEmail: ${email}\nTeléfono: ${phone}\nProducto: ${product.name}\nFicha solicitada: ${fichaName}`,
    ],
    footerReason,
    internal: true,
  });

  return {
    subject: `Nueva solicitud de ficha técnica: ${product.name}`,
    html,
    text,
    replyTo: email,
  };
}
