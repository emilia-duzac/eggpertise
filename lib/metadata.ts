import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

interface PageMetadataInput {
  /** Product or fabricante name, without the " - EggPertise" suffix. */
  nombre: string;
  descripcionCorta?: string | null;
  /** Page path starting with "/", e.g. `/productos/mi-producto`. */
  path: string;
  imagen?: string | null;
}

/**
 * Builds the title/description/openGraph metadata shared by product and
 * fabricante pages. Falls back to the site's own image when the item has
 * none, so the layout's openGraph image isn't lost (the page's openGraph
 * replaces the layout's instead of merging with it).
 */
export function buildPageMetadata({
  nombre,
  descripcionCorta,
  path,
  imagen,
}: PageMetadataInput): Metadata {
  const titulo = `${nombre} - EggPertise`;
  const descripcion =
    descripcionCorta?.trim() ||
    `Conocé ${nombre}, representado por EggPertise en Latinoamérica.`;

  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: path },
    openGraph: {
      title: titulo,
      description: descripcion,
      url: path,
      images: [{ url: imagen || DEFAULT_OG_IMAGE }],
    },
  };
}
