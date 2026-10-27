import type { ProductoCompleto } from "../contentful";
import type { ProductContext } from "./types";

// Manufacturers that are EggPertise's own line. Slugs are generated from the
// manufacturer's name in Contentful (see FABRICANTE_ORDER in lib/contentful.ts).
const COMPOSTAJE_MANUFACTURERS = [
  "eggpertise-compostaje",
  "tratamiento-de-estiercol-eggpertise",
];

/**
 * Asks Contentful for a PNG: Gmail does not show SVG or WebP, and the seal is
 * displayed at 96px wide (3x for high-density screens).
 */
function asEmailImage(url: string): string {
  const absolute = url.startsWith("//") ? `https:${url}` : url;
  return `${absolute}${absolute.includes("?") ? "&" : "?"}fm=png&w=288`;
}

/**
 * What the emails need to know about a product, taken from Contentful on the
 * server. It is never read from the request: the form only says which product.
 */
export function emailProduct(producto: ProductoCompleto): ProductContext {
  const { fabricante } = producto;
  const isOwnLine =
    !!fabricante && COMPOSTAJE_MANUFACTURERS.includes(fabricante.slug);

  return {
    name: producto.nombre,
    line: isOwnLine ? "compostaje" : "other",
    supplier:
      fabricante && !isOwnLine && fabricante.logo
        ? { name: fabricante.nombre, logoUrl: asEmailImage(fabricante.logo) }
        : undefined,
  };
}
