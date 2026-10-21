import { NextResponse } from "next/server";
import { getContactFormEmailTemplate } from "@/lib/email-templates";
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
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "El email no es válido" },
        { status: 400 }
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

    const data = await sendEmail({
      from: mailFrom("EggPertise Contact Form"),
      to: [process.env.CONTACT_EMAIL || "info@eggpertise.com"],
      replyTo: email,
      subject: `Nueva consulta de ${nombre} - ${empresa}`,
      html: getContactFormEmailTemplate({ nombre, email, empresa, pais, mensaje }),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Email enviado exitosamente",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      {
        error: "Error al enviar el email. Por favor intente nuevamente.",
      },
      { status: 500 }
    );
  }
}
