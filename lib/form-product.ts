import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";
import { getProductoForForm, type ProductoCompleto } from "./contentful";

type ProductLookup =
  | { found: true; producto: ProductoCompleto }
  | { found: false; response: NextResponse };

/**
 * Resolves the product a form refers to. The forms only send its slug: its
 * name, datasheet and supplier always come from Contentful, never from the
 * request. A missing product is a 404; Contentful being unreachable is a 503.
 */
export async function findProductForForm(
  slug: string,
  notFoundMessage: string
): Promise<ProductLookup> {
  try {
    const producto = await getProductoForForm(slug);
    if (producto) {
      return { found: true, producto };
    }
    return {
      found: false,
      response: NextResponse.json(
        { error: notFoundMessage },
        { status: StatusCodes.NOT_FOUND }
      ),
    };
  } catch (error) {
    console.error("Error looking up the product for a form:", error);
    return {
      found: false,
      response: NextResponse.json(
        { error: "No pudimos consultar el producto en este momento. Por favor intente nuevamente." },
        { status: StatusCodes.SERVICE_UNAVAILABLE }
      ),
    };
  }
}
