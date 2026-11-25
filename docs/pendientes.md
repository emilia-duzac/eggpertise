# Pendientes

Cosas que se encontraron trabajando en otro pedido, no forman parte de ningún cambio
en curso, y conviene no perder de vista. Cuando se resuelva un ítem, se borra de acá
(el commit que lo resuelve ya queda en el historial).

**Última revisión:** 2026-11-25.

## Para Emilia (zona sensible, `next.config.mjs`)

- **Faltan headers de seguridad** `X-Content-Type-Options` y
  `Content-Security-Policy`. La CSP hay que armarla con todo lo que carga el sitio
  (GTM, Google Translate, Google Fonts, YouTube, Contentful) y probarla primero en
  modo `Content-Security-Policy-Report-Only`: los tags que marketing agregue en GTM
  quedarían bloqueados si no están en la lista.

  _Origen: auditoría SEO del 2026-11-24
  (`docs/plans/2026-11-24-seo-indexacion/hallazgos/findings/technical.md`)._

## Para marketing (contenido, no código)

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

  _Origen: investigación de código para el plan de indexación,
  `docs/plans/2026-11-24-seo-indexacion/investigacion.md`._
