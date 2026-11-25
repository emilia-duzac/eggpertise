import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

export function NotEncontrado({
  titulo,
  mensaje,
}: {
  titulo: string;
  mensaje: string;
}) {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="pt-40 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
            {titulo}
          </h1>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            {mensaje}
          </p>
          <Button asChild size="lg">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </section>
      <Footer />
    </main>
  );
}
