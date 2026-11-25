import type { MetadataRoute } from "next";
import { getAllFabricanteSlugs, getAllProductoSlugs } from "@/lib/contentful";
import { SITE_URL } from "@/lib/site";

export const revalidate = 14400; // 4 hours, igual que el resto del catálogo

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productoSlugs, fabricanteSlugs] = await Promise.all([
    getAllProductoSlugs(),
    getAllFabricanteSlugs(),
  ]);

  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...productoSlugs.map((slug) => ({
      url: `${SITE_URL}/productos/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...fabricanteSlugs.map((slug) => ({
      url: `${SITE_URL}/distribuidoras/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
