import {
  contactCard,
  dataTable,
  icon,
  label,
  link,
  paragraph,
  raw,
  signature,
  title,
} from "../components";
import {
  SALES_CONTACT,
  clientReplyTo,
  contactDrafts,
} from "../contact";
import { escapeHtml } from "../escape";
import { renderEmail, renderPlainText } from "../layout";
import { sealFor, type EmailMessage, type ProductContext } from "../types";

export interface TechnicalInfoRequest {
  email: string;
  phone: string;
  country: string;
  company: string;
  product: string;
}

/**
 * Sent to the team when someone asks for technical information about a
 * product. Reply goes to the lead.
 */
export function technicalInfoTeamEmail(
  data: TechnicalInfoRequest,
  date: string
): EmailMessage {
  const { email, phone, country, company, product } = data;
  const heading = "Nueva solicitud de información técnica";
  const footerReason = `Aviso automático desde el modal de producto de eggpertise.com · ${date}`;

  const html = renderEmail({
    preheader: `${company} pidió información sobre ${product}.`,
    footerReason,
    internal: true,
    body:
      label("Aviso interno · Solicitud Info Técnica") +
      title(heading) +
      dataTable([
        [{ label: "Producto", value: product }],
        [
          { label: "Empresa", value: company },
          { label: "País", value: country },
        ],
        [
          {
            label: "Email",
            value: raw(icon("gmail") + link(email, `mailto:${email}`)),
          },
          { label: "Teléfono", value: phone },
        ],
      ]),
  });

  const text = renderPlainText({
    title: heading,
    paragraphs: [
      `Producto: ${product}\nEmpresa: ${company}\nPaís: ${country}\nEmail: ${email}\nTeléfono: ${phone}`,
    ],
    footerReason,
    internal: true,
  });

  return {
    subject: `Nueva solicitud de información técnica: ${product}`.replace(/\s+/g, " "),
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
  const contactIntro =
    "Si querés más información, tenés dudas técnicas o estás interesado en cotizar, podés contactarte con nuestro responsable de ventas:";
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
      paragraph(escapeHtml(contactIntro)) +
      contactCard(contactDrafts.technicalInfo(product.name, company)) +
      signature(),
  });

  const text = renderPlainText({
    title: heading,
    paragraphs: [
      `Gracias por escribirnos. Nuestro equipo ya recibió tu pedido sobre ${product.name} y se estará contactando a la brevedad.`,
      contactIntro,
      `${SALES_CONTACT.name} · ${SALES_CONTACT.role}\nWhatsApp: ${SALES_CONTACT.phone}\nEmail: ${SALES_CONTACT.email}`,
      "Gracias por tu interés en EggPertise.",
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
