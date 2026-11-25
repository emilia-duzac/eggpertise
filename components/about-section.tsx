import { CheckCircle } from "lucide-react";
import Image from "@/components/optimized-image";

export function AboutSection() {
  return (
    <section id="quienes-somos" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-left mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold">
            Transformando la Producción Avícola y Porcina
          </h2>
        </div>

        {/* Nuestra Historia - Image left, text right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src="/landing/nacho.jpeg"
              alt="Ignacio Pernicone - Fundador de EggPertise"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-3xl md:text-4xl font-serif font-bold">
              Nuestra historia
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                EggPertise fue fundada por Ignacio Pernicone, el 2 de Julio de
                2025, en el Día de la Avicultura, como resultado de una vida
                dedicada al sector. Vinculado a la industria desde los 14 años,
                y con más de 40 años en la industria, Ignacio continúa hoy un
                legado familiar, siendo la tercera generación dentro de la
                avicultura.
              </p>
              <p className="text-lg leading-relaxed">
                Con una profunda pasión por la innovación y el compromiso con la
                excelencia, EggPertise representa marcas líderes de calidad
                premium. Con un equipo humano de primer nivel, solido y
                dinamico, el foco está puesto en identificar y ofrecer las
                mejores soluciones, anticipándonos a las necesidades de la
                industria y promoviendo su desarrollo sostenible.
              </p>
            </div>
          </div>
        </div>

        {/* Nuestra Visión y Misión - Text left, cards right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <h3 className="text-3xl md:text-4xl font-serif font-bold">
              Nuestra visión y misión
            </h3>
            <p className="text-lg leading-relaxed text-muted-foreground">
              En EggPertise, nos dedicamos a ayudar a nuestros clientes a
              transformar proteína vegetal en proteína animal de manera
              eficiente y sustentable. Buscamos seleccionar las mejores
              innovaciones tecnológicas a nivel mundial para ofrecer soluciones
              personalizadas, rentables a largo plazo y de alta calidad en
              Latinoamérica.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Nuestra visión es contribuir a un mundo más sustentable y
              saludable, donde la producción de alimentos sea respetuosa con el
              medio ambiente y permita garantizar la disponibilidad de alimento
              para las generaciones futuras.
            </p>
          </div>

          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            {[
              "Tecnología líder mundial",
              "Soporte técnico especializado",
              "Acompañamiento local en LATAM",
              "Soluciones a medida",
            ].map((text) => (
              <div key={text} className="flex items-center gap-3 p-6 bg-secondary/50 rounded-lg min-h-[100px]">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="font-bold">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nuestro Equipo - Image left, text right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-20">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src="/landing/team.jpg"
              alt="Equipo de EggPertise"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-3xl md:text-4xl font-serif font-bold">
              Nuestro equipo
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                Detrás de EggPertise hay un equipo humano de primer nivel,
                sólido y dinámico, que comparte la misma pasión por la industria
                avícola y porcina. Cada integrante aporta experiencia,
                conocimiento técnico y un compromiso genuino con el éxito de
                nuestros clientes.
              </p>
              <p className="text-lg leading-relaxed">
                Trabajamos de manera cercana y colaborativa, entendiendo que
                cada proyecto es único. Nuestro equipo acompaña a los
                productores en cada etapa, desde el asesoramiento inicial hasta
                la implementación y el soporte continuo, asegurando soluciones
                que generen resultados reales y sostenibles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
