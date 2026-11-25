import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Settings,
  Globe,
  Handshake,
  ArrowRight,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";
import Image from "@/components/optimized-image";

export function ServicesSection() {
  const services = [
    {
      icon: Settings,
      title: "Asesoramiento Técnico Local",
      description:
        "Brindamos soporte técnico especializado y personalizado para cada proyecto, adaptándonos a las necesidades específicas de tu operación.",
      features: [
        "Consultoría especializada",
        "Soporte 24/7",
        "Análisis personalizado",
      ],
      image: "/climate-control-farm-systems.jpg",
    },
    {
      icon: Globe,
      title: "Innovación Tecnológica Global",
      description:
        "Conectamos a nuestros clientes con las últimas innovaciones tecnológicas del mercado mundial, seleccionando las mejores soluciones.",
      features: [
        "Tecnología de vanguardia",
        "Alianzas internacionales",
        "Investigación continua",
      ],
      image: "/global-farm-technology-solutions.jpg",
    },
    {
      icon: Handshake,
      title: "Acompañamiento en el Proceso de Transformación",
      description:
        "Te acompañamos en cada etapa del proceso de transformación, desde la planificación hasta la implementación y seguimiento.",
      features: [
        "Planificación estratégica",
        "Implementación guiada",
        "Seguimiento continuo",
      ],
      image: "/agricultural-innovation-technology.jpg",
    },
  ];

  const stats = [
    {
      icon: Users,
      value: "500+",
      label: "Clientes Satisfechos",
    },
    {
      icon: TrendingUp,
      value: "95%",
      label: "Tasa de Éxito",
    },
    {
      icon: Award,
      value: "15+",
      label: "Años de Experiencia",
    },
  ];

  return (
    <section
      id="que-hacemos"
      className="py-24 bg-primary opacity-90 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-6 mb-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-primary-foreground">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Nuestros Servicios Profesionales
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground leading-tight">
            Qué Hacemos
          </h2>
          <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-4xl mx-auto leading-relaxed">
            Ofrecemos un enfoque integral que combina tecnología de vanguardia
            con asesoramiento personalizado
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <Card
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl hover:bg-white/10 transition-all duration-500 hover:scale-105 group overflow-hidden p-0 flex flex-col h-full"
            >
              {/* Service Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>

              <CardHeader className="text-center pb-4 pt-6">
                <CardTitle className="text-2xl font-serif font-bold text-primary-foreground mb-3 group-hover:text-white transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8 flex flex-col flex-grow">
                <p className="text-primary-foreground/80 text-center leading-relaxed mb-6 text-lg flex-grow">
                  {service.description}
                </p>

                {/* Feature List */}
                <div className="flex flex-wrap gap-2 justify-center mt-auto">
                  {service.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="bg-primary/20 text-primary-foreground text-xs font-medium px-3 py-2 rounded-full border border-primary/30 hover:bg-primary/30 transition-colors"
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 group-hover:bg-white/20 transition-colors">
                  <stat.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="text-4xl font-serif font-bold text-primary-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-foreground/80 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
