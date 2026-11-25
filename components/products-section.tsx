import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "@/components/optimized-image";
import { Producto } from "@/lib/contentful";

interface ProductsSectionProps {
  productos: Producto[];
}

export function ProductsSection({ productos }: ProductsSectionProps) {
  return (
    <section
      id="productos-principales"
      className="py-12 bg-gradient-to-br from-primary/5 to-primary/15 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0,29,81,0.1) 1px, transparent 1px),
                             radial-gradient(circle at 75% 75%, rgba(0,29,81,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-left space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
            Productos Principales
          </h2>
        </div>

        {productos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mx-auto max-w-6xl">
            {productos.map((producto) => (
              <Card
                key={producto.id}
                className="bg-white/10 backdrop-blur-md border border-white/20 group overflow-hidden p-0 flex flex-col"
              >
                {/* Product Image */}
                <div className="relative h-44 overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <Image
                    src={producto.logo_portada}
                    alt={producto.nombre}
                    width={400}
                    height={400}
                    className="object-contain max-w-[80%] max-h-[80%]"
                  />
                </div>

                <CardHeader className="text-center pt-3">
                  <CardTitle className="text-xl font-serif font-bold text-foreground">
                    {producto.nombre}
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-6 pb-4 flex flex-col flex-grow">
                  <p className="text-foreground/80 text-center leading-relaxed mb-3 text-base flex-grow">
                    {producto.descripcion_corta}
                  </p>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200 font-medium px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mt-auto"
                  >
                    <Link href={`/productos/${producto.slug}`}>
                      Ver Detalles
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No hay productos principales disponibles en este momento.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}


