"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Logo from "@/public/brand/logo.png";
import { usePathname, useRouter } from "next/navigation";
import { GoogleTranslate } from "@/components/google-translate";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const isHome = pathname === "/";

    if (!isHome) {
      const hash = targetId === "top" ? "" : `#${targetId}`;
      router.push(`/${hash}`);
      setIsMenuOpen(false);
      return;
    }

    if (targetId === "top") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const headerHeight = 64;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 z-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a
            href="#"
            onClick={(e) => handleSmoothScroll(e, "top")}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <Image src={Logo} alt="EggPertise" width={110} height={110} priority />
          </a>

          {/* Desktop Navigation - centered links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#quienes-somos"
              onClick={(e) => handleSmoothScroll(e, "quienes-somos")}
              className="relative text-foreground hover:text-primary transition-all duration-300 group cursor-pointer"
            >
              <span className="relative z-10">Quienes somos</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#distribuidoras"
              onClick={(e) => handleSmoothScroll(e, "distribuidoras")}
              className="relative text-foreground hover:text-primary transition-all duration-300 group cursor-pointer"
            >
              <span className="relative z-10">Marcas</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#productos-principales"
              onClick={(e) => handleSmoothScroll(e, "productos-principales")}
              className="relative text-foreground hover:text-primary transition-all duration-300 group cursor-pointer"
            >
              <span className="relative z-10">Productos</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <GoogleTranslate />
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleSmoothScroll(e as any, "contacto");
              }}
              className="cursor-pointer rounded-full px-6"
            >
              Contactanos
            </Button>
          </div>
          

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
              <a
                href="#"
                onClick={(e) => handleSmoothScroll(e, "top")}
                className="block px-3 py-2 text-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all duration-200 transform hover:translate-x-1 cursor-pointer"
              >
                Inicio
              </a>
              <a
                href="#quienes-somos"
                onClick={(e) => handleSmoothScroll(e, "quienes-somos")}
                className="block px-3 py-2 text-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all duration-200 transform hover:translate-x-1 cursor-pointer"
              >
                Quiénes Somos
              </a>
              {/*<a
                href="#que-hacemos"
                onClick={(e) => handleSmoothScroll(e, "que-hacemos")}
                className="block px-3 py-2 text-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all duration-200 transform hover:translate-x-1 cursor-pointer"
              >
                Que Hacemos
              </a>*/}
              <a
                href="#distribuidoras"
                onClick={(e) => handleSmoothScroll(e, "distribuidoras")}
                className="block px-3 py-2 text-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all duration-200 transform hover:translate-x-1 cursor-pointer"
              >
                Marcas
              </a>
              <a
                href="#productos-principales"
                onClick={(e) => handleSmoothScroll(e, "productos-principales")}
                className="block px-3 py-2 text-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all duration-200 transform hover:translate-x-1 cursor-pointer"
              >
                Productos
              </a>
              {/*<a
                href="#logros"
                onClick={(e) => handleSmoothScroll(e, "logros")}
                className="block px-3 py-2 text-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all duration-200 transform hover:translate-x-1 cursor-pointer"
              >
                Novedades
              </a>*/}
              <a
                href="#contacto"
                onClick={(e) => handleSmoothScroll(e, "contacto")}
                className="block px-3 py-2 text-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all duration-200 transform hover:translate-x-1 cursor-pointer"
              >
                Contacto
              </a>
              <div className="px-3 py-2">
                <GoogleTranslate />
              </div>
              <div className="px-3 py-2">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSmoothScroll(e as any, "contacto");
                  }}
                  className="w-full cursor-pointer"
                >
                  Consultar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
