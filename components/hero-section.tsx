import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "@/components/optimized-image";
import HeroImage from "@/public/landing/hero.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center bg-white">
      <Image
        src={HeroImage}
        alt="Hero Image"
        priority
        className="absolute inset-0 w-full h-full object-cover opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10"></div>

      <div className="relative container mx-auto px-6 sm:px-8 lg:px-12 text-left">
        <div className="max-w-4xl">
          <div className="space-y-8">
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-2xl"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              Soluciones Reales para<br />tu Producción
            </h1>

            <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-medium max-w-2xl drop-shadow-lg">
              Desde EggPertise acercamos la innovación tecnológica global a
              productores avícolas y porcinos de Latinoamérica, combinando
              asesoramiento personalizado y soluciones integrales.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-start items-center pt-4">
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <Link
                  href="/#distribuidoras"
                  className="flex items-center justify-center gap-2"
                >
                  Marcas
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 22 22"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-lg font-medium transition-all duration-300 hover:scale-[1.02]"
              >
                <Link href="#contacto" className="flex items-center justify-center gap-2">
                  Consultar Ahora
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
