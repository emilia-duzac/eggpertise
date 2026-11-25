import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

export default function ProductoNoEncontrado() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="pt-40 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
            No encontramos este producto
          </h1>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Puede que el enlace esté roto o que el producto ya no esté disponible.
            Volvé al inicio para ver el catálogo completo.
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
