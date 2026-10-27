import { NextResponse } from "next/server";
import { getProductoBySlug } from "@/lib/contentful";
import { fichaClientEmail, fichaTeamEmail } from "@/lib/email/mails/ficha";
import { emailProduct } from "@/lib/email/product";
import { syncLeadToSpreadsheet } from "@/lib/leads-sheet";
import { mailFrom, sendEmail } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, apellido, email, telefono, pais, productoSlug } = body;

    // Validate required fields
    if (!nombre || !apellido || !email || !telefono || !pais || !productoSlug) {
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

    // The product, its datasheet and its supplier come from Contentful, never
    // from the request: the form only says which product it is.
    const producto =
      typeof productoSlug === "string"
        ? await getProductoBySlug(productoSlug)
        : null;

    if (!producto?.ficha_tecnica) {
      return NextResponse.json(
        { error: "No encontramos la ficha técnica de este producto. Por favor intente nuevamente." },
        { status: 404 }
      );
    }

    const product = emailProduct(producto);
    const fichaRequest = {
      firstName: nombre,
      lastName: apellido,
      email,
      phone: telefono,
      country: pais,
      product,
      fichaName: producto.ficha_tecnica.title || "Ficha Técnica",
      fichaUrl: encodeURI(producto.ficha_tecnica.url),
    };

    // Recorded before the emails so the lead survives a failed send.
    await syncLeadToSpreadsheet({
      nombre: `${nombre} ${apellido}`,
      email,
      pais,
      telefono,
      mensaje: `Descarga de ficha técnica: ${product.name}`,
      fuente: "Descarga Ficha Técnica",
    });

    const currentDate = new Date().toLocaleString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
    });
    const teamEmail = fichaTeamEmail(fichaRequest, currentDate);
    const clientEmail = fichaClientEmail(fichaRequest);

    // Both are attempted even if one fails: a rejected admin notification
    // must not stop the user from getting the ficha técnica they asked for.
    const results = await Promise.allSettled([
      // Notification to admin
      sendEmail({
        from: mailFrom(),
        to: [process.env.CONTACT_EMAIL || "info@eggpertise.com"],
        replyTo: teamEmail.replyTo,
        subject: teamEmail.subject,
        html: teamEmail.html,
        text: teamEmail.text,
      }),
      // Ficha técnica to user
      sendEmail({
        from: mailFrom(),
        to: [email],
        replyTo: clientEmail.replyTo,
        subject: clientEmail.subject,
        html: clientEmail.html,
        text: clientEmail.text,
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
