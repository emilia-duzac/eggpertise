# CLAUDE.md

Guía para agentes de código. Para humanos, ver [`README.md`](README.md).

## Qué es

Sitio web de EggPertise (Next.js 14, App Router). Contenido en Contentful,
emails con Resend, leads a Google Sheets vía Apps Script, deploy en Vercel.

## Comandos

```bash
npm run dev      # servidor local
npm run build    # build de producción
npm run lint
npx tsc --noEmit # chequeo de tipos: el build NO lo hace
```

No hay suite de tests.

## Reglas que no hay que "arreglar"

- **No quites `ignoreBuildErrors` / `ignoreDuringBuilds`** de `next.config.mjs`
  como parte de otra tarea: puede destapar muchos errores. Es una tarea aparte.
- **El orden de marcas y productos de la home** son listas de slugs fijas en
  `lib/contentful.ts`. Es pedido del cliente, no un descuido.
- **La copia de leads a la planilla no debe romper el formulario.** El fallo se
  loguea y se traga a propósito (`lib/leads-sheet.ts`).
- **Nunca pongas secretos ni valores reales** en el repo. Las variables van en
  `.env.local` (ignorado) y en Vercel. Documentalas en `.env.example`.
- **Los `.env*` están en `.gitignore`**, salvo `.env.example`.
- El sitio se traduce con Google Translate; no hay `next-intl`. `docs/superpowers/`
  describe una propuesta no implementada.

## Cuándo leer qué

| Si vas a tocar... | Leé primero |
|---|---|
| Formularios, `lib/leads-sheet.ts` o el Apps Script | `docs/leads.md` |
| Consultas a Contentful o el orden de la home | `docs/contenido.md` |
| Variables de entorno, deploy o repo | `docs/deploy.md` |
| Servicios y cuentas | `docs/accesos.md` |
| Cosas raras del código | `docs/arquitectura.md` |

## Convenciones

- Idioma de la UI, los commits y los textos: español. Nombres de código en inglés.
- Commits al estilo Conventional Commits (`feat(...)`, `fix(...)`, `docs(...)`),
  como el historial existente.
- Trabajar en ramas (`feat/*`, `fix/*`, `docs/*`, `chore/*`) y abrir PR a `main`.
