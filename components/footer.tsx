import Link from "next/link";
import { WHATSAPP, whatsappUrl } from "@/lib/whatsapp";
import {
  Mail,
  Phone,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="text-2xl font-serif font-bold">EggPertise</div>
            <p className="text-sm opacity-90">
              Acercamos la innovación tecnológica global a productores avícolas
              y porcinos de Latinoamérica, con soluciones integrales,
              asesoramiento técnico y acompañamiento personalizado.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold">Navegación</h3>
            <div className="space-y-2 text-sm">
              <Link
                href="/"
                className="block hover:opacity-80 transition-opacity"
              >
                Inicio
              </Link>
              <Link
                href="/#quienes-somos"
                className="block hover:opacity-80 transition-opacity"
              >
                Quiénes Somos
              </Link>
              <Link
                href="/#distribuidoras"
                className="block hover:opacity-80 transition-opacity"
              >
                Marcas
              </Link>
              <Link
                href="/#contacto"
                className="block hover:opacity-80 transition-opacity"
              >
                Contacto
              </Link>
            </div>
          </div>

          {/* Addresses */}
          <div className="space-y-4">
            <h3 className="font-semibold">Dirección</h3>
            <div className="space-y-3 text-sm">
              <div className="space-y-1 opacity-90">
                <p className="font-semibold text-primary-foreground">
                  Oficina Central:
                </p>
                <p>Miami, FL, USA.</p>
              </div>
              <div className="space-y-1 opacity-90">
                <p className="font-semibold text-primary-foreground">
                  Oficina Regional:
                </p>
                <p>Pilar, Bs.As., Argentina.</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contacto</h3>
            <div className="space-y-2 text-sm">
              <a
                href="mailto:info@eggpertise.com"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <Mail className="h-4 w-4" />
                <span>info@eggpertise.com</span>
              </a>
              <a
                href={whatsappUrl("AR")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <Phone className="h-4 w-4" />
                <span>{WHATSAPP.AR.display}</span>
              </a>
              <a
                href={whatsappUrl("US")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <Phone className="h-4 w-4" />
                <span>{WHATSAPP.US.display}</span>
              </a>
            </div>
            <div className="flex space-x-4 pt-2">
              <Link
                href="https://www.linkedin.com/company/eggpertise"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/eggpertise"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.youtube.com/@EggPertise"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-80">
          <p>&copy; 2026 EggPertise. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
