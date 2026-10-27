import { NextResponse } from "next/server";
import { technicalInfoTeamEmail } from "@/lib/email/mails/technical-info";
import { syncLeadToSpreadsheet } from "@/lib/leads-sheet";
import { mailFrom, sendEmail } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, telefono, pais, empresa, productoNombre } = body;

    if (!email || !telefono || !pais || !empresa || !productoNombre) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "El email no es válido" },
        { status: 400 }
      );
    }

    const currentDate = new Date().toLocaleString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
    });

    // Recorded before the email so the lead survives a failed send.
    await syncLeadToSpreadsheet({
      email,
      empresa,
      pais,
      telefono,
      mensaje: `Solicitud de información técnica sobre ${productoNombre}`,
      fuente: "Solicitud Info Técnica",
    });

    const teamEmail = technicalInfoTeamEmail(
      {
        email,
        phone: telefono,
        country: pais,
        company: empresa,
        product: productoNombre,
      },
      currentDate
    );

    await sendEmail({
      from: mailFrom(),
      to: [process.env.CONTACT_EMAIL || "info@eggpertise.com"],
      replyTo: teamEmail.replyTo,
      subject: teamEmail.subject,
      html: teamEmail.html,
      text: teamEmail.text,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error sending solicitud info técnica:", error);
    return NextResponse.json(
      { error: "Error al enviar la solicitud. Por favor intente nuevamente." },
      { status: 500 }
    );
  }
}
