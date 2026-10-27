import {
  contactCard,
  dataTable,
  icon,
  label,
  link,
  paragraph,
  quote,
  raw,
  signature,
  title,
} from "../components";
import {
  CLIENT_SIGNATURE,
  clientReplyTo,
  contactDrafts,
  salesContactText,
} from "../contact";
import { escapeHtml } from "../escape";
import { renderEmail, renderPlainText } from "../layout";
import type { EmailMessage } from "../types";

export interface ContactRequest {
  name: string;
  email: string;
  company: string;
  country: string;
  message: string;
}

/** Sent to the team when someone uses the contact form. Reply goes to the lead. */
export function contactTeamEmail(data: ContactRequest, date: string): EmailMessage {
  const { name, email, company, country, message } = data;
  const heading = "Nueva consulta de contacto";
  const footerReason = `Aviso automático del formulario de contacto de eggpertise.com · ${date}`;

  const html = renderEmail({
    preheader: `${name} escribió desde el formulario de contacto.`,
    footerReason,
    internal: true,
    body:
      label("Aviso interno · Formulario Web") +
      title(heading) +
      dataTable([
        [
          { label: "Nombre", value: name },
          { label: "Empresa", value: company },
        ],
        [
          {
            label: "Email",
            value: raw(icon("gmail") + link(email, `mailto:${email}`)),
          },
          { label: "País", value: country },
        ],
      ]) +
      label("Mensaje") +
      quote(message),
  });

  const text = renderPlainText({
    title: heading,
    paragraphs: [
      `Nombre: ${name}\nEmpresa: ${company}\nEmail: ${email}\nPaís: ${country}`,
      `Mensaje:\n${message}`,
    ],
    footerReason,
    internal: true,
  });

  return {
    // A visitor-controlled name must not break the header with a line break.
    subject: `Nueva consulta de ${name} - ${company}`.replace(/\s+/g, " "),
    html,
    text,
    replyTo: email,
  };
}

/** Sent to the person who used the contact form, to confirm it arrived. */
export function contactClientEmail(data: ContactRequest): EmailMessage {
  const { name, company } = data;
  const heading = `Hola ${name}, recibimos tu consulta`;
  const received =
    "Gracias por escribirnos. Nuestro equipo ya recibió tu consulta y se estará contactando a la brevedad.";
  const contactIntro =
    "Si es urgente o querés sumar información, podés contactarte directamente con nuestro responsable de ventas:";
  const footerReason =
    "Recibiste este mail porque nos escribiste desde eggpertise.com.";

  const html = renderEmail({
    preheader: "Nuestro equipo se contactará a la brevedad.",
    footerReason,
    body:
      label("Consulta recibida") +
      title(heading) +
      paragraph(escapeHtml(received)) +
      paragraph(escapeHtml(contactIntro)) +
      contactCard(contactDrafts.contact(name, company)) +
      signature(),
  });

  const text = renderPlainText({
    title: heading,
    paragraphs: [
      received,
      contactIntro,
      salesContactText(),
      CLIENT_SIGNATURE,
    ],
    footerReason,
  });

  return {
    subject: `Recibimos tu consulta, ${name}`.replace(/\s+/g, " "),
    html,
    text,
    replyTo: clientReplyTo(),
  };
}
