import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";
import { notificationDate } from "@/lib/email/date";
import { contactClientEmail, contactTeamEmail } from "@/lib/email/mails/contact";
import { sendClientConfirmation, sendTeamEmail } from "@/lib/email/send";
import { syncLeadToSpreadsheet } from "@/lib/leads-sheet";
import { contactSchema, parseFormBody } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = await parseFormBody(request, contactSchema);
    if (!parsed.success) {
      return parsed.response;
    }
    const { nombre, email, empresa, pais, mensaje } = parsed.data;

    // Recorded before the email so the lead survives a failed send.
    await syncLeadToSpreadsheet({
      nombre,
      email,
      empresa,
      pais,
      mensaje,
      fuente: "Formulario Web",
    });

    const contactRequest = { name: nombre, email, company: empresa, country: pais, message: mensaje };
    const data = await sendTeamEmail(
      contactTeamEmail(contactRequest, notificationDate()),
      "EggPertise Contact Form"
    );

    // Only after the team has been notified, so we never promise a reply that
    // nobody will see.
    await sendClientConfirmation(email, () => contactClientEmail(contactRequest));

    return NextResponse.json(
      {
        success: true,
        message: "Email enviado exitosamente",
        data,
      },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      {
        error: "Error al enviar el email. Por favor intente nuevamente.",
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
