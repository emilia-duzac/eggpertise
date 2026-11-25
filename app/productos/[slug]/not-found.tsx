import { NotEncontrado } from "@/components/not-encontrado";

export default function ProductoNoEncontrado() {
  return (
    <NotEncontrado
      titulo="No encontramos este producto"
      mensaje="Puede que el enlace esté roto o que el producto ya no esté disponible. Volvé al inicio para ver el catálogo completo."
    />
  );
}
