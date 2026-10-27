import { dataTable, icon, label, link, raw, title } from "../components";
import { renderEmail, renderPlainText } from "../layout";
import type { EmailMessage } from "../types";

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
