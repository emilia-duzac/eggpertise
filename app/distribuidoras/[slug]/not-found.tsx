import { NotEncontrado } from "@/components/not-encontrado";

export default function MarcaNoEncontrada() {
  return (
    <NotEncontrado
      titulo="No encontramos esta marca"
      mensaje="Puede que el enlace esté roto o que la marca ya no esté disponible. Volvé al inicio para ver las marcas representadas."
    />
  );
}
