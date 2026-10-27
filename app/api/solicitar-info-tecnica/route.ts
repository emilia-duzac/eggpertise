import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";
import { notificationDate } from "@/lib/email/date";
import {
  technicalInfoClientEmail,
  technicalInfoTeamEmail,
} from "@/lib/email/mails/technical-info";
import { emailProduct } from "@/lib/email/product";
import { sendClientConfirmation, sendTeamEmail } from "@/lib/email/send";
import { findProductForForm } from "@/lib/form-product";
import { syncLeadToSpreadsheet } from "@/lib/leads-sheet";
import { parseFormBody, technicalInfoSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = await parseFormBody(request, technicalInfoSchema);
    if (!parsed.success) {
      return parsed.response;
    }
    const { email, telefono, pais, empresa, productoSlug } = parsed.data;

    // The product comes from Contentful, never from the request: the form only
    // says which product it is.
    const lookup = await findProductForForm(
      productoSlug,
      "No encontramos el producto. Por favor intente nuevamente."
    );
    if (!lookup.found) {
      return lookup.response;
    }
    const { producto } = lookup;

    // Recorded before the email so the lead survives a failed send.
    await syncLeadToSpreadsheet({
      email,
      empresa,
      pais,
      telefono,
      mensaje: `Solicitud de información técnica sobre ${producto.nombre}`,
      fuente: "Solicitud Info Técnica",
    });

    await sendTeamEmail(
      technicalInfoTeamEmail(
        {
          email,
          phone: telefono,
          country: pais,
          company: empresa,
          productName: producto.nombre,
        },
        notificationDate()
      )
    );

    // Only after the team has been notified, so we never promise a reply that
    // nobody will see.
    await sendClientConfirmation(email, () =>
      technicalInfoClientEmail({
        company: empresa,
        product: emailProduct(producto),
      })
    );

    return NextResponse.json({ success: true }, { status: StatusCodes.OK });
  } catch (error) {
    console.error("Error sending solicitud info técnica:", error);
    return NextResponse.json(
      { error: "Error al enviar la solicitud. Por favor intente nuevamente." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
