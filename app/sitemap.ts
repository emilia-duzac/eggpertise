import type { MetadataRoute } from "next";
import { getProductoSitemapData, getFabricanteSitemapData } from "@/lib/contentful";
import { SITE_URL } from "@/lib/site";

export const revalidate = 14400; // 4 hours, igual que el resto del catálogo

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productos, fabricantes] = await Promise.all([
    getProductoSitemapData(),
    getFabricanteSitemapData(),
  ]);

  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...productos.map(({ slug, lastModified }) => ({
      url: `${SITE_URL}/productos/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...fabricantes.map(({ slug, lastModified }) => ({
      url: `${SITE_URL}/distribuidoras/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
