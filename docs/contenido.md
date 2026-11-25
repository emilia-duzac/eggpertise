# Contenido (Contentful)

**Última revisión:** 2026-11-25.

Todo el contenido del sitio sale de Contentful, space `qjhuufa729ye`. Se lee con la Content Delivery API (GraphQL, solo contenido **publicado**) desde `lib/contentful.ts`. Para editar hace falta rol *Editor* o superior (ver [`accesos.md`](accesos.md)).

## Tipos de contenido

| Content type | Qué es | Campos que usa el sitio |
|---|---|---|
| `fabricante` | Categoría de producto que representa una marca (alimentación, calefacción, etc.) | `nombre` (nombre de la **categoría**, no de la marca — ver más abajo), `logo`, `descripcionCorta`, `descripcionLarga` (rich text), `imagenPortada`, `link` |
| `producto` | Producto de un fabricante | `slug`, `nombre`, `principal` (booleano), `imagenes`, `videos`, textos y bullets de la ficha; referencia a su `fabricante` |
| `configuracionHome` | Una sola entrada con el orden de la home | `proveedoresOrdenados` (lista de `fabricante`) y `productosDestacadosOrdenados` (lista de `producto`) |
| `noticia` | Nota de la sección Noticias. **Hoy no existe en Contentful** (a 2026-11-23): el código la pide pero el tipo no está creado, por eso la sección no se muestra | `titulo`, `slug`, `url`, `extracto`, `contenido`, `imagenDestacada`, `fechaPublicacion`, `autor` |

La lista exacta de campos de cada uno está en las consultas GraphQL de `lib/contentful.ts`. Si agregás un campo en Contentful, el sitio no lo muestra hasta que se agregue a la consulta y al componente.

## El nombre de la marca en cada `fabricante`

El campo `nombre` de cada `fabricante` es el de la **categoría** ("ALIMENTACIÓN", "CALEFACCIÓN", etc.), no el de la marca que representa. El sitio arma el nombre real de la marca (el que se ve en la home, en el título de la página y en los datos que lee Google) a partir del **primer título dentro del texto largo (`descripcionLarga`)** de cada fabricante — el mismo que ya se ve arriba de la descripción en la página de cada marca.

Para que una marca se identifique bien en todo el sitio, esa página tiene que empezar con un título (estilo "Título 1" en el editor de Contentful) con el nombre de la marca, por ejemplo:

> **LANDMECO**
> Landmeco es una empresa danesa...

Si ese primer título no está, el sitio muestra el nombre de la categoría en su lugar (por ejemplo "ALIMENTACIÓN"), sin romperse. Si el título menciona "EggPertise" (como en Compostaje, que es una línea propia y no una marca de afuera), el sitio muestra "EggPertise" en vez del título completo.

**En la práctica:** para corregir o cambiar el nombre de una marca en todo el sitio de una sola vez, editá ese primer título en la descripción larga del fabricante en Contentful y publicá. No hace falta tocar código.

## Reglas que conviene saber

- **Publicar, no solo guardar.** Un borrador no aparece en el sitio.
- **La URL sale del `slug`** (`/productos/<slug>`, `/distribuidoras/<slug>`). Cambiar un slug cambia la URL y rompe los links existentes.
- **Productos destacados de la home:** los que tienen `principal = true`.
- **Orden de la home:** lo define el equipo en Contentful, en la entrada **configuracionHome** (ver [`manual-usuario/orden-de-la-home.md`](manual-usuario/orden-de-la-home.md)). El código ya no tiene listas fijas.
- **Noticias:** se muestran las 6 más recientes por `fechaPublicacion`. Si no hay ninguna publicada, o si el tipo `noticia` no existe (como hoy), la sección se oculta y el build deja `Error fetching noticias` en el log. Para activarla hay que crear el tipo con los campos de la tabla y publicar noticias.
- **Cambios tardan hasta 4 horas** en verse (ver [`deploy.md`](deploy.md)).

## Idiomas

El contenido de Contentful está en un solo idioma. La traducción del sitio se hace con el widget de Google Translate del navegador, no con locales de Contentful (ver [`arquitectura.md`](arquitectura.md)).

## Cambiar el orden de la home

Para el equipo de marketing, con capturas y paso a paso: [`manual-usuario/orden-de-la-home.md`](manual-usuario/orden-de-la-home.md). En resumen: se edita la **única** entrada `configuracionHome` en Contentful (dos listas ordenables), se publica, y el cambio se ve en hasta 4 horas.

Reglas:
- Lo que no está en la lista aparece igual en el sitio, **al final y por orden alfabético**. Para ocultar un proveedor o un producto, despublicalo.
- En los productos, la lista define solo el **orden**: se muestran los que tienen marcado `principal`. Un producto de la lista sin `principal` no aparece.
- Una referencia a algo despublicado se ignora.
- Si la entrada no existe, no está publicada o Contentful falla, el sitio muestra el orden alfabético: no se rompe.
- Los campos de este tipo se identifican por sus ids (`configuracionHome`, `proveedoresOrdenados`, `productosDestacadosOrdenados`): **no se pueden cambiar** sin cambiar también el código.
