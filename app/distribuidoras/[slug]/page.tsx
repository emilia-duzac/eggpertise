export const revalidate = 14400; // 4 hours

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "@/components/optimized-image";
import { IMAGE_SIZES } from "@/lib/image-sizes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import {
  getFabricanteBySlug,
  getAllFabricanteSlugs,
  Fabricante,
  Producto,
} from "@/lib/contentful";
import { buildPageMetadata } from "@/lib/metadata";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { renderOptions } from "@/lib/rich-text-renderers";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const distributor = await getFabricanteBySlug(params.slug);

  if (!distributor) {
    return {};
  }

  return buildPageMetadata({
    nombre: distributor.marca,
    descripcionCorta: distributor.descripcion_corta,
    path: `/distribuidoras/${distributor.slug}`,
    imagen: distributor.imagen_portada,
  });
}

// Helper function to group products by category
function groupProductsByCategory(productos: Producto[]) {
  const groupedProducts = new Map<string, Producto[]>();
  const productosSinCategoria: Producto[] = [];

  // Group products by category (case insensitive)
  productos.forEach((producto) => {
    if (!producto.categoria || producto.categoria.trim() === "") {
      productosSinCategoria.push(producto);
    } else {
      const categoriaKey = producto.categoria.trim().toLowerCase();
      if (!groupedProducts.has(categoriaKey)) {
        groupedProducts.set(categoriaKey, []);
      }
      groupedProducts.get(categoriaKey)!.push(producto);
    }
  });

  const hasCategories = groupedProducts.size > 0;

  // If there are products without category and some with categories, add "Otros"
  if (productosSinCategoria.length > 0 && hasCategories) {
    groupedProducts.set("otros", productosSinCategoria);
  }

  // Convert map to array and sort (case insensitive, "Otros" at the end)
  const categorias: Array<[string, Producto[]]> = Array.from(
    groupedProducts.entries()
  ).sort((a, b) => {
    if (a[0] === "otros") return 1;
    if (b[0] === "otros") return -1;
    return a[0].localeCompare(b[0]);
  });

  // If no categories, return all products as a single group
  return {
    hasCategories,
    groups: hasCategories
      ? categorias
      : [
          [
            "",
            productosSinCategoria.length > 0
              ? productosSinCategoria
              : productos,
          ] as [string, Producto[]],
        ],
  };
}

// Product Card Component
function ProductCard({ producto }: { producto: Producto }) {
  return (
    <Card className="bg-white/10 backdrop-blur-md border border-white/20 group overflow-hidden p-0 flex flex-col h-full">
      {/* Product Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={producto.logo_portada}
          alt={producto.nombre}
          fill
          sizes={IMAGE_SIZES.cardGrid}
          className="object-cover"
        />
      </div>

      <CardHeader className="text-center pb-2 pt-4">
        <CardTitle className="text-xl font-serif font-bold text-foreground mb-1">
          {producto.nombre}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-6 flex flex-col flex-grow">
        <p className="text-foreground/80 text-center leading-relaxed mb-4 text-base flex-grow">
          {producto.descripcion_corta}
        </p>

        <Button
          asChild
          variant="outline"
          className="w-full border-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200 font-medium px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mt-auto"
        >
          <Link href={`/productos/${producto.slug}`}>Ver Detalles</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

// Category Group Component
function CategoryGroup({
  categoriaKey,
  productos,
  showCategoryTitle,
}: {
  categoriaKey: string;
  productos: Producto[];
  showCategoryTitle: boolean;
}) {
  const getCategoryDisplayName = () => {
    if (categoriaKey === "otros") return "Otros";
    return productos[0]?.categoria || categoriaKey;
  };

  return (
    <div className="mb-16 last:mb-0">
      {showCategoryTitle && categoriaKey && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-sm border border-primary/20">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground capitalize">
                {getCategoryDisplayName()}
              </h3>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Badge
                variant="secondary"
                className="text-xs font-semibold px-3 py-1.5 bg-gradient-to-r from-primary/15 to-primary/10 text-primary border border-primary/20 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  {productos.length}{" "}
                  {productos.length === 1 ? "producto" : "productos"}
                </span>
              </Badge>
            </div>
          </div>
          <div className="h-[2px] bg-gradient-to-r from-primary/40 via-primary/20 to-transparent rounded-full"></div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        {productos.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
}

export default async function DistributorPage({ params }: PageProps) {
  const distributor: Fabricante | null = await getFabricanteBySlug(params.slug);

  if (!distributor) {
    notFound();
  }

  // Group products by category
  const productGroups = distributor.productos
    ? groupProductsByCategory(distributor.productos)
    : null;

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 min-h-[70vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={distributor.imagen_portada}
            alt={distributor.marca}
            fill
            sizes={IMAGE_SIZES.fullWidth}
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Back Button - Top Left */}
        <div className="absolute top-24 left-4 sm:top-28 sm:left-6 z-20">
          <Button
            asChild
            variant="ghost"
            className="bg-white/10 hover:bg-white/20 text-white hover:text-white border border-white/30 hover:border-white/40 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Link
              href="/#distribuidoras"
              className="flex items-center text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Fabricantes
            </Link>
          </Button>
        </div>

        {/* Logo Overlay - Left with White Border */}
        <div className="absolute -bottom-12 left-4 sm:-bottom-16 sm:left-6 z-20">
          {distributor.link ? (
            <Link
              href={distributor.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:scale-105 transition-transform duration-300"
            >
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-56 lg:h-56 xl:w-60 xl:h-60 rounded-full border-2 sm:border-3 lg:border-4 border-white overflow-hidden shadow-xl bg-white cursor-pointer">
                <div className="absolute inset-2 sm:inset-[10px] md:inset-3 rounded-full overflow-hidden">
                  <Image
                    src={distributor.logo}
                    alt={distributor.marca}
                    fill
                    sizes={IMAGE_SIZES.brandBadge}
                    className="object-contain"
                  />
                </div>
              </div>
            </Link>
          ) : (
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-56 lg:h-56 xl:w-60 xl:h-60 rounded-full border-2 sm:border-3 lg:border-4 border-white overflow-hidden shadow-xl bg-white">
              <div className="absolute inset-2 sm:inset-[10px] md:inset-3 rounded-full overflow-hidden">
                <Image
                  src={distributor.logo}
                  alt={distributor.marca}
                  fill
                  sizes={IMAGE_SIZES.brandBadge}
                  className="object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg prose-slate max-w-none mx-auto">
              {documentToReactComponents(
                distributor.descripcion_larga,
                renderOptions
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      {productGroups && (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                  Productos de {distributor.marca}
                </h2>
              </div>

              {productGroups.groups.map(([categoriaKey, productos]) => (
                <CategoryGroup
                  key={categoriaKey || "all"}
                  categoriaKey={categoriaKey}
                  productos={productos}
                  showCategoryTitle={productGroups.hasCategories}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              ¿Interesado en {distributor.marca}?
            </h2>
            <p className="text-xl text-white/70 mb-12 leading-relaxed">
              Contáctanos para obtener más información sobre nuestros productos
              y servicios
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-3"
              >
                <Link href="/#contacto">Contactar Ahora</Link>
              </Button>
              <Button asChild size="lg" className="bg-white hover:bg-white/90 text-primary border-0 px-8 py-3">
                <Link href="/#distribuidoras">Ver Otros Fabricantes</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// Generate static params for all distributors
export async function generateStaticParams() {
  const slugs = await getAllFabricanteSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}
