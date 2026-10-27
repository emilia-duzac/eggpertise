import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";
import { getProductoBySlug } from "@/lib/contentful";
import { technicalInfoTeamEmail } from "@/lib/email/mails/technical-info";
import { syncLeadToSpreadsheet } from "@/lib/leads-sheet";
import { mailFrom, sendEmail } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, telefono, pais, empresa, productoSlug } = body;

    if (!email || !telefono || !pais || !empresa || !productoSlug) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "El email no es válido" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // The product comes from Contentful, never from the request: the form only
    // says which product it is.
    const producto =
      typeof productoSlug === "string"
        ? await getProductoBySlug(productoSlug)
        : null;

    if (!producto) {
      return NextResponse.json(
        { error: "No encontramos el producto. Por favor intente nuevamente." },
        { status: StatusCodes.NOT_FOUND }
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
      mensaje: `Solicitud de información técnica sobre ${producto.nombre}`,
      fuente: "Solicitud Info Técnica",
    });

    const teamEmail = technicalInfoTeamEmail(
      {
        email,
        phone: telefono,
        country: pais,
        company: empresa,
        product: producto.nombre,
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

    return NextResponse.json({ success: true }, { status: StatusCodes.OK });
  } catch (error) {
    console.error("Error sending solicitud info técnica:", error);
    return NextResponse.json(
      { error: "Error al enviar la solicitud. Por favor intente nuevamente." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
