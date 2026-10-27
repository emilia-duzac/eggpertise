import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";
import { contactTeamEmail } from "@/lib/email/mails/contact";
import { syncLeadToSpreadsheet } from "@/lib/leads-sheet";
import { mailFrom, sendEmail } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, email, empresa, pais, mensaje } = body;

    // Validate required fields
    if (!nombre || !email || !empresa || !pais || !mensaje) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "El email no es válido" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Recorded before the email so the lead survives a failed send.
    await syncLeadToSpreadsheet({
      nombre,
      email,
      empresa,
      pais,
      mensaje,
      fuente: "Formulario Web",
    });

    const currentDate = new Date().toLocaleString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
    });
    const teamEmail = contactTeamEmail(
      { name: nombre, email, company: empresa, country: pais, message: mensaje },
      currentDate
    );

    const data = await sendEmail({
      from: mailFrom("EggPertise Contact Form"),
      to: [process.env.CONTACT_EMAIL || "info@eggpertise.com"],
      replyTo: teamEmail.replyTo,
      subject: teamEmail.subject,
      html: teamEmail.html,
      text: teamEmail.text,
    });

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
