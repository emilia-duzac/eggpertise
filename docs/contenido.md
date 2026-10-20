# Contenido (Contentful)

**Última revisión:** 2026-10-20.

Todo el contenido del sitio sale de Contentful, space `qjhuufa729ye`. Se lee con la Content Delivery API (GraphQL, solo contenido **publicado**) desde `lib/contentful.ts`. Para editar hace falta rol *Editor* o superior (ver [`accesos.md`](accesos.md)).

## Tipos de contenido

| Content type | Qué es | Campos que usa el sitio |
|---|---|---|
| `fabricante` | Marca o fabricante representado | `nombre`, `logo`, `descripcionCorta`, `descripcionLarga` (rich text), `imagenPortada`, `link` |
| `producto` | Producto de un fabricante | `slug`, `nombre`, `principal` (booleano), `imagenes`, `videos`, textos y bullets de la ficha; referencia a su `fabricante` |
| `noticia` | Nota de la sección Noticias | `slug`, `fechaPublicacion` y campos de texto e imagen |

La lista exacta de campos de cada uno está en las consultas GraphQL de `lib/contentful.ts`. Si agregás un campo en Contentful, el sitio no lo muestra hasta que se agregue a la consulta y al componente.

## Reglas que conviene saber

- **Publicar, no solo guardar.** Un borrador no aparece en el sitio.
- **La URL sale del `slug`** (`/productos/<slug>`, `/distribuidoras/<slug>`). Cambiar un slug cambia la URL y rompe los links existentes.
- **Productos destacados de la home:** los que tienen `principal = true`.
- **Orden de la home:** NO se define en Contentful. Está escrito a mano en `lib/contentful.ts` (`FABRICANTE_ORDER` y `PRODUCTO_PRINCIPAL_ORDER`, listas de slugs). Lo que no está en esas listas va al final, ordenado alfabéticamente. Para cambiar el orden hay que editar el código.
- **Noticias:** se muestran las 6 más recientes por `fechaPublicacion`. Si no hay ninguna publicada, la sección se oculta.
- **Cambios tardan hasta 4 horas** en verse (ver [`deploy.md`](deploy.md)).

## Idiomas

El contenido de Contentful está en un solo idioma. La traducción del sitio se hace con el widget de Google Translate del navegador, no con locales de Contentful (ver [`arquitectura.md`](arquitectura.md)).
