export const revalidate = 14400; // 4 hours

import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProductImageGallery } from "@/components/product-image-gallery";
import Link from "next/link";
import { MessageCircle, CheckCircle2 } from "lucide-react";
import { FichaTecnicaModal } from "@/components/ficha-tecnica-modal";
import { SolicitarInfoTecnicaModal } from "@/components/solicitar-info-tecnica-modal";
import {
  getProductoBySlug,
  getAllProductoSlugs,
  getProductosByFabricante,
  ProductoCompleto,
} from "@/lib/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { renderOptions } from "@/lib/rich-text-renderers";
import { Card } from "@/components/ui/card";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: PageProps) {
  const producto: ProductoCompleto | null = await getProductoBySlug(
    params.slug
  );

  if (!producto) {
    notFound();
  }

  const whatsappMessage = encodeURIComponent(
    `Hola, estuve revisando la web de EggPertise y quisiera recibir asesoramiento técnico sobre ${producto.nombre}.\nNombre:\nPaís:\nTipo de producción:`
  );
  const whatsappUrl = `https://api.whatsapp.com/send/?phone=5491125155801&text=${whatsappMessage}&type=phone_number&app_absent=0`;

  const otrosProductos = producto.fabricante
    ? (await getProductosByFabricante(producto.fabricante.id))
        .filter((p) => p.id !== producto.id)
        .slice(0, 4)
    : [];

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 min-h-[70vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={producto.imagen_portada}
            alt={producto.nombre}
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {producto.fabricante && (
              <div className="mb-4">
                <Link
                  href={`/distribuidoras/${producto.fabricante.slug}`}
                  className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-white/30 transition-colors"
                >
                  {producto.fabricante.nombre}
                </Link>
              </div>
            )}
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-white">
              {producto.nombre}
            </h1>
            <div className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              {producto.descripcion_corta}
            </div>
          </div>
        </div>
      </section>
      {/* Main Content - 2 Column Grid */}
      <section className="py-12 lg:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              {/* Left Column - Gallery + Actions + Manufacturer */}
              <div>
                <div className="lg:sticky lg:top-24 space-y-6">
                  {producto.imagenes && producto.imagenes.length > 0 && (
                    <ProductImageGallery
                      images={producto.imagenes}
                      productName={producto.nombre}
                    />
                  )}

                  {/* Technical Data Sheet CTA */}
                  <div className="flex justify-center">
                    {producto.ficha_tecnica ? (
                      <FichaTecnicaModal
                        productoNombre={producto.nombre}
                        productoSlug={producto.slug}
                        fichaTecnicaNombre={
                          producto.ficha_tecnica.title || "Ficha Técnica"
                        }
                      />
                    ) : (
                      <SolicitarInfoTecnicaModal
                        productoNombre={producto.nombre}
                        productoSlug={producto.slug}
                      />
                    )}
                  </div>

                </div>
              </div>

              {/* Right Column - Description */}
              <div className="prose prose-lg prose-slate max-w-none">
                {documentToReactComponents(
                  producto.descripcion_larga,
                  renderOptions
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* P2 + Bullets Section */}
      {(producto.parrafo2 || (producto.bullets && producto.bullets.length > 0)) && (
        <section className="py-12 lg:py-20 bg-slate-100 dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                {producto.parrafo2 && (
                  <div className="prose prose-lg prose-slate max-w-none">
                    {documentToReactComponents(producto.parrafo2, renderOptions)}
                  </div>
                )}
                {producto.bullets && producto.bullets.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {producto.bullets.map((bullet, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 px-5 py-5 rounded-xl bg-white dark:bg-slate-700"
                      >
                        <CheckCircle2 className="shrink-0 text-green-500" size={24} />
                        <span className="text-base font-medium text-foreground">{bullet}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* P3 + Video Section */}
      {(producto.parrafo3 || (producto.videos && producto.videos.length > 0) || producto.youtubeUrl) && (
        <section className="py-12 lg:py-20 bg-background border-t border-border/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                {producto.youtubeUrl ? (
                  <div className="w-full aspect-video rounded-xl overflow-hidden shadow-md">
                    <iframe
                      src={`https://www.youtube.com/embed/${
                        producto.youtubeUrl.includes("youtu.be/")
                          ? producto.youtubeUrl.split("youtu.be/")[1]?.split("?")[0]
                          : new URLSearchParams(producto.youtubeUrl.split("?")[1]).get("v")
                      }`}
                      title="Video del producto"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                ) : producto.videos && producto.videos.length > 0 ? (
                  <div className="space-y-4">
                    {producto.videos.map((video, i) => (
                      <video
                        key={i}
                        src={video.url}
                        title={video.title}
                        controls
                        className="w-full rounded-xl shadow-md aspect-video object-cover"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-full aspect-video rounded-xl bg-muted/50 border border-border/40 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                    <span className="text-sm opacity-50">Video próximamente</span>
                  </div>
                )}
                {producto.parrafo3 && (
                  <div className="prose prose-lg prose-slate max-w-none">
                    {documentToReactComponents(producto.parrafo3, renderOptions)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              ¿Interesado en {producto.nombre}?
            </h2>
            <p className="text-lg text-white/70 mb-10 leading-relaxed">
              Contáctanos para obtener más información sobre este producto
              {producto.fabricante &&
                ` y otros de ${producto.fabricante.nombre}`}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-[#25D366] hover:bg-[#20BD5A] text-white px-8 py-3 shadow-lg"
              >
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Consultar por WhatsApp
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-3"
              >
                <Link href="/#contacto">Contactar Ahora</Link>
              </Button>
              {producto.fabricante && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-white hover:bg-white/90 text-primary border-0 px-8 py-3"
                >
                  <Link href={`/distribuidoras/${producto.fabricante.slug}`}>
                    Explorar Soluciones {producto.fabricante.nombre.toUpperCase()}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA 3 - Explore More */}
      {otrosProductos.length > 0 && (
        <section className="py-16 bg-background border-t border-border/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-8">
              Explora más soluciones EggPertise:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otrosProductos.map((p) => (
                <div
                  key={p.id}
                  className="bg-white/10 backdrop-blur-md border border-border/20 rounded-2xl overflow-hidden flex flex-col"
                >
                  <div className="relative h-44 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <Image
                      src={p.logo_portada}
                      alt={p.nombre}
                      width={400}
                      height={400}
                      className="object-contain max-w-[80%] max-h-[80%]"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-serif font-bold text-foreground text-center mb-2">
                      {p.nombre}
                    </h3>
                    <p className="text-sm text-foreground/70 text-center leading-relaxed flex-grow mb-4">
                      {p.descripcion_corta}
                    </p>
                    <Button asChild variant="outline" className="w-full rounded-full border-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground">
                      <Link href={`/productos/${p.slug}`}>Ver Detalles</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

// Generate static params for all products
export async function generateStaticParams() {
  const slugs = await getAllProductoSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}
