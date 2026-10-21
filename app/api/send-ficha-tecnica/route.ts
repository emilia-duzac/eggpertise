import { NextResponse } from "next/server";
import {
  getFichaTecnicaNotificationTemplate,
  getFichaTecnicaUserTemplate,
} from "@/lib/email-templates";
import { syncLeadToSpreadsheet } from "@/lib/leads-sheet";
import { sendEmail } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, apellido, email, telefono, pais, productoNombre, fichaTecnicaUrl, fichaTecnicaNombre } = body;

    // Validate required fields
    if (!nombre || !apellido || !email || !telefono || !pais || !productoNombre || !fichaTecnicaUrl || !fichaTecnicaNombre) {
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

    const templateData = {
      nombre,
      apellido,
      email,
      telefono,
      pais,
      productoNombre,
      fichaTecnicaUrl: encodeURI(fichaTecnicaUrl),
      fichaTecnicaNombre,
    };

    // Recorded before the emails so the lead survives a failed send.
    await syncLeadToSpreadsheet({
      nombre: `${nombre} ${apellido}`,
      email,
      pais,
      telefono,
      mensaje: `Descarga de ficha técnica: ${productoNombre}`,
      fuente: "Descarga Ficha Técnica",
    });

    // Both are attempted even if one fails: a rejected admin notification
    // must not stop the user from getting the ficha técnica they asked for.
    const results = await Promise.allSettled([
      // Notification to admin
      sendEmail({
        from: "EggPertise <noreply@eggpertise.com>",
        to: [process.env.CONTACT_EMAIL || "info@eggpertise.com"],
        subject: `Nueva solicitud de ficha técnica: ${productoNombre}`,
        html: getFichaTecnicaNotificationTemplate(templateData),
      }),
      // Ficha técnica to user
      sendEmail({
        from: "EggPertise <noreply@eggpertise.com>",
        to: [email],
        subject: `Ficha Técnica - ${productoNombre}`,
        html: getFichaTecnicaUserTemplate(templateData),
      }),
    ]);

    const failed = results.find(
      (result): result is PromiseRejectedResult => result.status === "rejected"
    );
    if (failed) {
      throw failed.reason;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Ficha técnica enviada exitosamente",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending ficha técnica:", error);
    return NextResponse.json(
      {
        error: "Error al enviar la ficha técnica. Por favor intente nuevamente.",
      },
      { status: 500 }
    );
  }
}
