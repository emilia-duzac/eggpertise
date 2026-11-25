import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Distributor } from "@/lib/contentful";

interface DistributorsSectionProps {
  distributors: Distributor[];
}

export function DistributorsSection({
  distributors,
}: DistributorsSectionProps) {
  return (
    <section
      id="distribuidoras"
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
            Marcas Representadas
          </h2>
        </div>

        {distributors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mx-auto max-w-6xl">
            {distributors.map((distributor) => (
              <Card
                key={distributor.id}
                className="bg-white/10 backdrop-blur-md border border-white/20 group overflow-hidden p-0 flex flex-col"
              >
                {/* Distributor Logo */}
                <div className="relative h-44 overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <Image
                    src={distributor.logo}
                    alt={distributor.marca}
                    width={400}
                    height={400}
                    className="object-contain max-w-[80%] max-h-[80%]"
                  />
                </div>

                <CardHeader className="text-center pt-3">
                  <CardTitle className="text-xl font-serif font-bold text-foreground">
                    {distributor.marca}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-4 flex flex-col flex-grow">
                  <p className="text-foreground/80 text-center leading-relaxed mb-3 text-base flex-grow">
                    {distributor.descripcion_corta}
                  </p>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200 font-medium px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mt-auto"
                  >
                    <Link href={`/distribuidoras/${distributor.slug}`}>
                      Ver {distributor.marca}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No hay fabricantes disponibles en este momento.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
