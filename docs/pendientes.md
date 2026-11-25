# Pendientes

Cosas que se encontraron trabajando en otro pedido, no forman parte de ningún cambio
en curso, y conviene no perder de vista. Cuando se resuelva un ítem, se borra de acá
(el commit que lo resuelve ya queda en el historial).

**Última revisión:** 2026-11-25.

## Para Emilia (zona sensible, `next.config.mjs`)

- **Optimización de imágenes apagada en todo el sitio** (`images: { unoptimized:
  true }`). Puede estar frenando la carga de todas las páginas. Antes de reactivarla,
  revisar por qué se apagó — puede estar tapando otro problema (por ejemplo, dominios
  de Contentful sin configurar en `images.remotePatterns`).
- **Faltan headers de seguridad estándar** en las respuestas del servidor
  (`X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`,
  `Referrer-Policy`, `Permissions-Policy`). Solo está presente HSTS.

  _Origen: auditoría SEO del 2026-11-24
  (`docs/plans/2026-11-24-seo-indexacion/hallazgos/findings/technical.md`)._

## Para marketing (contenido, no código)

- **La home no nombra ninguna marca representada por su nombre en el texto** (solo
  aparecen en los logos e imágenes). Si alguien le pregunta a una IA "¿qué marcas
  representa EggPertise?", hoy no se puede responder bien con lo que hay en el texto.
- **Las fichas de producto son cortas** (entre 193 y 261 palabras en la muestra
  revisada) y no tienen tabla técnica ni preguntas frecuentes genuinas.
- **No hay casos de clientes, instalaciones ni testimonios** en ninguna página — la
  única prueba de experiencia visible es la trayectoria del fundador.

  _Origen: auditoría SEO del 2026-11-24
  (`docs/plans/2026-11-24-seo-indexacion/hallazgos/findings/content.md` y `geo.md`)._

## Técnico, para investigar más adelante

- **El `slug` de cada producto/marca (la URL) no sale de un campo propio de
  Contentful**: se calcula en código a partir del nombre
  (`generateSlug(item.nombre)`, en `lib/contentful.ts`). `docs/contenido.md` lo
  describe como si fuera un campo de Contentful (`slug`), pero el código lo ignora.
  Importa porque si dos productos tuvieran nombres que generan el mismo slug, o si se
  cambia el nombre de un producto, la URL cambiaría sola sin que nadie lo decida
  explícitamente en Contentful.
- **Las consultas que traen todos los productos o todas las marcas no paginan.**
  El tope más bajo está en `getProductoBySlug` (`lib/contentful.ts`), que arma la
  página de cada producto: pide solo **50 productos** (`productoCollection(limit:
  50)`) y busca el slug entre esos. Si el catálogo pasa de 50 productos, los que
  queden afuera van a dar "página no encontrada". El resto (`getAllProductoSlugs`,
  `getAllFabricanteSlugs`, `generateStaticParams`, `app/sitemap.ts` y la consulta de
  productos de los formularios) no pide límite o pide 100, que es el máximo por
  defecto de Contentful: fallarían recién al pasar de 100 productos o marcas. Hoy el
  catálogo tiene bastante menos, pero hay que sumar paginación antes de llegar a 50.

  _Origen: investigación de código para el plan de indexación,
  `docs/plans/2026-11-24-seo-indexacion/investigacion.md`._
