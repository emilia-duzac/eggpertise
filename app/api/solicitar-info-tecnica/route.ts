import { NextResponse } from "next/server";
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

    await sendEmail({
      from: mailFrom(),
      to: [process.env.CONTACT_EMAIL || "info@eggpertise.com"],
      subject: `Nueva solicitud de información técnica: ${productoNombre}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Nueva Solicitud de Información Técnica</h1>
              <p style="margin: 8px 0 0;">${currentDate}</p>
            </div>
            <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <h2 style="color: #374151;">Producto solicitado</h2>
              <p style="font-size: 18px; font-weight: bold; color: #4f46e5;">${productoNombre}</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
              <h2 style="color: #374151;">Datos del solicitante</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #6b7280; width: 40%;">Email</td><td style="padding: 8px 0; font-weight: 500;">${email}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;">Teléfono</td><td style="padding: 8px 0; font-weight: 500;">${telefono}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;">País</td><td style="padding: 8px 0; font-weight: 500;">${pais}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;">Empresa</td><td style="padding: 8px 0; font-weight: 500;">${empresa}</td></tr>
              </table>
            </div>
          </body>
        </html>
      `,
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
