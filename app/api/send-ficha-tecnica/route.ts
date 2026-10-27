import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";
import { notificationDate } from "@/lib/email/date";
import { toSafeUrl } from "@/lib/email/escape";
import { fichaClientEmail, fichaTeamEmail } from "@/lib/email/mails/ficha";
import { emailProduct } from "@/lib/email/product";
import { sendClientEmail, sendTeamEmail } from "@/lib/email/send";
import { findProductForForm } from "@/lib/form-product";
import { syncLeadToSpreadsheet } from "@/lib/leads-sheet";
import { fichaSchema, parseFormBody } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = await parseFormBody(request, fichaSchema);
    if (!parsed.success) {
      return parsed.response;
    }
    const { nombre, apellido, email, telefono, pais, productoSlug } = parsed.data;

    // The product, its datasheet and its supplier come from Contentful, never
    // from the request: the form only says which product it is.
    const lookup = await findProductForForm(
      productoSlug,
      "No encontramos la ficha técnica de este producto. Por favor intente nuevamente."
    );
    if (!lookup.found) {
      return lookup.response;
    }
    const { producto } = lookup;

    if (!producto.ficha_tecnica) {
      return NextResponse.json(
        { error: "No encontramos la ficha técnica de este producto. Por favor intente nuevamente." },
        { status: StatusCodes.NOT_FOUND }
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
      fichaUrl: toSafeUrl(producto.ficha_tecnica.url),
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

    // Both are attempted even if one fails: a rejected team notification must
    // not stop the visitor from getting the ficha técnica they asked for.
    const [teamResult, clientResult] = await Promise.allSettled([
      sendTeamEmail(fichaTeamEmail(fichaRequest, notificationDate())),
      sendClientEmail(email, fichaClientEmail(fichaRequest)),
    ]);

    // The visitor only sees an error when their own email failed. If just the
    // notification failed they already have the ficha, and an error would make
    // them retry and duplicate the lead.
    if (teamResult.status === "rejected") {
      console.error("Team notification for a ficha request failed:", teamResult.reason);
    }
    if (clientResult.status === "rejected") {
      throw clientResult.reason;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Ficha técnica enviada exitosamente",
      },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    console.error("Error sending ficha técnica:", error);
    return NextResponse.json(
      {
        error: "Error al enviar la ficha técnica. Por favor intente nuevamente.",
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
