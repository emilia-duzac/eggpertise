# Convenciones de código

Buenas prácticas del sitio. Las lee Claude antes de implementar (skill `sdd`, fase 4). **Última revisión:** 2026-11-23.

## Generales

- **Cambios mínimos y enfocados.** Tocá solo lo necesario para el requisito. No reformatees ni reordenes archivos enteros.
- **Reutilizá antes de crear.** Buscá componentes y helpers existentes (`components/`, `components/ui/`, `lib/`). Duplicar código es una deuda.
- **Nombres claros.** Código en inglés (variables, funciones, componentes, archivos); UI, commits y comentarios en español. Archivos en `kebab-case`, componentes en `PascalCase`.
- **Sin números ni textos mágicos.** Valores repetidos o con significado van en una constante con nombre. Códigos HTTP con `StatusCodes` (`http-status-codes`).
- **Funciones chicas, una responsabilidad.** Si un componente pasa de ~150 líneas o mezcla datos con presentación, dividilo.
- **Comentarios solo para el "por qué"**, no para repetir lo que dice el código.
- **No dejes** `console.log`, código comentado, `TODO` sin dueño ni archivos de prueba.
- **Dependencias:** no agregues librerías sin necesidad real. Hace un análisis, busca alternativas y fijate pros y contras.
- **TypeScript estricto en lo nuevo:** sin `any` ni `@ts-ignore`; tipá props y datos de Contentful.

## Next.js y React

- App Router. Los componentes son **Server Components por defecto**; usá `"use client"` solo si hace falta estado, efectos o eventos del navegador, y en el componente más chico posible.
- Los datos de Contentful se piden en el servidor (`lib/contentful.ts`). Las páginas se regeneran cada 4 h (`revalidate = 14400`); mantené ese patrón.
- Navegación interna con `next/link`; enlaces externos con `target="_blank"` y `rel="noopener noreferrer"`.
- Las imágenes **no se optimizan** en este proyecto (`images.unoptimized: true`): comprimilas **antes** de subirlas (idealmente WebP/JPG, < 300 KB las de contenido), con nombre descriptivo en minúsculas y guiones, en `public/`. Usá siempre `alt` descriptivo (o `alt=""` si es decorativa).
- Formularios, rutas `/api/*` y validación: ver las reglas intocables de `CLAUDE.md`.

## Estilos y diseño de marca

- **Tailwind** y los tokens de color/tipografía definidos en `app/globals.css` (`bg-primary`, `text-foreground`, `bg-secondary`, etc.). **No hardcodees colores hex ni medidas arbitrarias** si existe un token; si el diseño pide un color nuevo, proponé agregarlo como token y consultá.
- Paleta base: azul imperial (`#001D51`) y su familia de azules. Seguí el Brand Book de EggPertise (skill `identidad-visual-eggpertise`, activala en todo cambio visual); no inventes variantes.
- Componentes base de **shadcn/ui** en `components/ui/`: usalos tal cual. No los modifiques para un caso puntual; componé sobre ellos.
- **Mobile-first**: se diseña primero para celular y se amplía con `sm:`, `md:`, `lg:`.
- Modo claro y oscuro: si tocás colores, revisá que ambos se vean bien.
- Animaciones sobrias; respetá `prefers-reduced-motion` cuando agregues movimiento.

## Accesibilidad y SEO

- HTML semántico (`header`, `main`, `section`, `nav`, `footer`), un solo `h1` por página y jerarquía de títulos ordenada.
- Contraste suficiente (WCAG AA), foco visible, botones y enlaces con texto comprensible (no "click aquí").
- Todo lo clickeable tiene que ser operable con teclado; los íconos solos llevan `aria-label`.
- Páginas nuevas: `metadata` con `title` y `description` propios.

## Idioma y traducción

- El sitio base está **en español** y se traduce con el widget de Google Translate (`components/google-translate.tsx`). **No hay `next-intl`**: `docs/superpowers/` es una propuesta no implementada.
- Escribí los textos en español, completos y como texto real (no dentro de imágenes), para que se puedan traducir. Marcas y nombres propios que no deben traducirse: atributo `translate="no"`.
- No partas una frase en varios nodos sueltos: el traductor la rompe.

## Rendimiento

- Imágenes livianas, con dimensiones definidas para evitar saltos de diseño (`width`/`height` o `aspect-ratio`).
- Evitá librerías pesadas o scripts de terceros sin necesidad; los scripts externos se cargan con `next/script` y la estrategia adecuada.

## Seguridad y privacidad

- **Nunca** pongas secretos, tokens, claves ni valores reales en el repo, en commits, en PR ni en el chat. Las variables van en `.env.local` (ignorado) y en Vercel; se documentan **solo el nombre y la finalidad** en `.env.example`.
- Todo lo que escribe el visitante y entra a un HTML (mails) pasa por `escapeHtml` o `safeHref`.
- Los datos de producto salen de Contentful en el servidor, **nunca** del request del navegador.
- No pegues datos personales de leads/clientes en el código, en el chat ni en commits.
- No expongas al navegador variables sensibles (en Next, las `NEXT_PUBLIC_*` son públicas).
