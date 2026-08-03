import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Noticia } from "@/lib/contentful";
import { Calendar, User, ExternalLink } from "lucide-react";

interface NewsSectionProps {
  noticias: Noticia[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function NewsCard({ noticia }: { noticia: Noticia }) {
  const href = noticia.url || `/noticias/${noticia.slug}`;
  const isExternal = Boolean(noticia.url);

  return (
    <Card className="bg-white/10 backdrop-blur-md border border-white/20 group overflow-hidden p-0 flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={noticia.imagen_destacada}
          alt={noticia.titulo}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(noticia.fecha_publicacion)}
          </span>
          {noticia.autor && (
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {noticia.autor}
            </span>
          )}
        </div>
        <CardTitle className="text-xl font-serif font-bold text-foreground line-clamp-2">
          {noticia.titulo}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-4 flex flex-col flex-grow">
        <p className="text-foreground/80 text-left leading-relaxed mb-4 text-base flex-grow line-clamp-3">
          {noticia.extracto}
        </p>

        {isExternal ? (
          <Button
            asChild
            variant="outline"
            className="w-full border-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200 font-medium px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm"
          >
            <a href={href} target="_blank" rel="noopener noreferrer">
              Leer más <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        ) : (
          <Button
            asChild
            variant="outline"
            className="w-full border-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200 font-medium px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm"
          >
            <Link href={href}>
              Leer más
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function NewsSection({ noticias }: NewsSectionProps) {
  if (noticias.length === 0) {
    return null;
  }

  return (
    <section
      id="noticias"
      className="py-12 bg-gradient-to-br from-primary/5 to-primary/15 relative overflow-hidden"
    >
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
            Noticias y Publicaciones
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Mantente actualizado con las últimas novedades del sector avícola y porcino
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {noticias.map((noticia) => (
            <NewsCard key={noticia.id} noticia={noticia} />
          ))}
        </div>
      </div>
    </section>
  );
}