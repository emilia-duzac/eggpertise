import {
  contactCard,
  dataTable,
  label,
  link,
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

export interface TechnicalInfoRequest {
  email: string;
  phone: string;
  country: string;
  company: string;
  productName: string;
}

/**
 * Sent to the team when someone asks for technical information about a
 * product. Reply goes to the lead.
 */
export function technicalInfoTeamEmail(
  data: TechnicalInfoRequest,
  date: string
): EmailMessage {
  const { email, phone, country, company, productName } = data;
  const heading = `Solicitud de información técnica sobre ${productName}`;
  const status = "El cliente todavía no recibió la información técnica.";
  const footerReason = `Aviso automático desde el modal de producto de eggpertise.com · ${date}`;

  const html = renderEmail({
    preheader: `${company} pidió información sobre ${productName}. Todavía no la recibió.`,
    footerReason,
    internal: true,
    body:
      label("Aviso interno · Requiere respuesta") +
      title(heading) +
      statusNote(`<b>${status}</b>`, true) +
      dataTable([
        [{ label: "Producto", value: productName }],
        [
          { label: "Empresa", value: company },
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
      `Producto: ${productName}\nEmpresa: ${company}\nPaís: ${country}\nEmail: ${email}\nTeléfono: ${phone}`,
    ],
    footerReason,
    internal: true,
  });

  return {
    subject: `Responder: info técnica de ${productName} · ${company}`.replace(/\s+/g, " "),
    html,
    text,
    replyTo: email,
  };
}

/** Sent to the person who asked for technical information, to confirm it arrived. */
export function technicalInfoClientEmail(data: {
  company: string;
  product: ProductContext;
}): EmailMessage {
  const { company, product } = data;
  const heading = "Recibimos tu pedido de información técnica";
  const footerReason =
    "Recibiste este mail porque pediste información técnica en eggpertise.com.";

  const html = renderEmail({
    preheader: "Nuestro equipo se contactará a la brevedad.",
    footerReason,
    seal: sealFor(product),
    body:
      label("Información técnica") +
      title(heading) +
      paragraph(
        `Gracias por escribirnos. Nuestro equipo ya recibió tu pedido sobre <b>${escapeHtml(product.name)}</b> y se estará contactando a la brevedad.`
      ) +
      paragraph(SALES_CONTACT_INTRO) +
      contactCard(contactDrafts.technicalInfo(product.name, company)),
  });

  const text = renderPlainText({
    title: heading,
    paragraphs: [
      `Gracias por escribirnos. Nuestro equipo ya recibió tu pedido sobre ${product.name} y se estará contactando a la brevedad.`,
      SALES_CONTACT_INTRO,
      salesContactText(),
    ],
    footerReason,
  });

  return {
    subject: `Recibimos tu pedido de información sobre ${product.name}`.replace(/\s+/g, " "),
    html,
    text,
    replyTo: clientReplyTo(),
  };
}
