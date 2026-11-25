import type { MetadataRoute } from "next";
import { getAllFabricanteSlugs, getAllProductoSlugs } from "@/lib/contentful";

export const revalidate = 14400; // 4 hours, igual que el resto del catálogo

const BASE_URL = "https://www.eggpertise.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productoSlugs, fabricanteSlugs] = await Promise.all([
    getAllProductoSlugs(),
    getAllFabricanteSlugs(),
  ]);

  return [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...productoSlugs.map((slug) => ({
      url: `${BASE_URL}/productos/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...fabricanteSlugs.map((slug) => ({
      url: `${BASE_URL}/distribuidoras/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
