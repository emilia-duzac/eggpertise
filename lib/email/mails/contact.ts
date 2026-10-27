import { dataTable, icon, label, link, quote, raw, title } from "../components";
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
