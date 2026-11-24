# Contenido (Contentful)

**Última revisión:** 2026-11-23.

Todo el contenido del sitio sale de Contentful, space `qjhuufa729ye`. Se lee con la Content Delivery API (GraphQL, solo contenido **publicado**) desde `lib/contentful.ts`. Para editar hace falta rol *Editor* o superior (ver [`accesos.md`](accesos.md)).

## Tipos de contenido

| Content type | Qué es | Campos que usa el sitio |
|---|---|---|
| `fabricante` | Marca o fabricante representado | `nombre`, `logo`, `descripcionCorta`, `descripcionLarga` (rich text), `imagenPortada`, `link` |
| `producto` | Producto de un fabricante | `slug`, `nombre`, `principal` (booleano), `imagenes`, `videos`, textos y bullets de la ficha; referencia a su `fabricante` |
| `configuracionHome` | Una sola entrada con el orden de la home | `proveedoresOrdenados` (lista de `fabricante`) y `productosDestacadosOrdenados` (lista de `producto`) |
| `noticia` | Nota de la sección Noticias | `slug`, `fechaPublicacion` y campos de texto e imagen |

La lista exacta de campos de cada uno está en las consultas GraphQL de `lib/contentful.ts`. Si agregás un campo en Contentful, el sitio no lo muestra hasta que se agregue a la consulta y al componente.

## Reglas que conviene saber

- **Publicar, no solo guardar.** Un borrador no aparece en el sitio.
- **La URL sale del `slug`** (`/productos/<slug>`, `/distribuidoras/<slug>`). Cambiar un slug cambia la URL y rompe los links existentes.
- **Productos destacados de la home:** los que tienen `principal = true`.
- **Orden de la home:** lo define el equipo en Contentful, en la entrada **configuracionHome** (ver [`manual-usuario/orden-de-la-home.md`](manual-usuario/orden-de-la-home.md)). El código ya no tiene listas fijas.
- **Noticias:** se muestran las 6 más recientes por `fechaPublicacion`. Si no hay ninguna publicada, la sección se oculta.
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
