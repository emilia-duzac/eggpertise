# CLAUDE.md

Guía para agentes de código. Para humanos, ver [`README.md`](README.md).

## Qué es

Sitio web de EggPertise (Next.js 14, App Router). Contenido en Contentful, emails con Resend, leads a Google Sheets vía Apps Script, deploy en Vercel.

## Comandos

```bash
npm run dev      # servidor local
npm run build    # build de producción
npm run lint
npx tsc --noEmit # chequeo de tipos: el build NO lo hace
```

No hay suite de tests.

## Reglas que no hay que "arreglar"

- **No quites `ignoreBuildErrors` / `ignoreDuringBuilds`** de `next.config.mjs` como parte de otra tarea: puede destapar muchos errores. Es una tarea aparte.
- **El orden de marcas y productos de la home** son listas de slugs fijas en `lib/contentful.ts`. Es pedido del cliente, no un descuido.
- **La copia de leads a la planilla no debe romper el formulario.** El fallo se loguea y se traga a propósito (`lib/leads-sheet.ts`), y tiene un corte de 5 segundos.
- **El lead se guarda antes de mandar el mail**, para no perderlo si el mail falla. No cambiar ese orden sin discutirlo.
- **Los mails se envían siempre con los helpers de `lib/email/send.ts`**, que usan `sendEmail` y `mailFrom()` (`lib/resend.ts`). No volver a llamar a Resend directamente: el SDK no lanza error cuando rechaza un envío.
- **No tocar el DNS ni los registros de correo** sin leer [`docs/dns.md`](docs/dns.md).
- **Nunca pongas secretos ni valores reales** en el repo. Las variables van en `.env.local` (ignorado) y en Vercel. Documentalas en `.env.example`.
- **Los `.env*` están en `.gitignore`**, salvo `.env.example`.
- El sitio se traduce con Google Translate; no hay `next-intl`. `docs/superpowers/` describe una propuesta no implementada.

## Cuándo leer qué

| Si vas a tocar... | Leé primero |
|---|---|
| Formularios, `lib/leads-sheet.ts` o el Apps Script | `docs/leads.md` |
| Los mails (diseño, textos o envío) | `docs/arquitectura.md`, sección Emails |
| Consultas a Contentful o el orden de la home | `docs/contenido.md` |
| Variables de entorno, deploy o repo | `docs/deploy.md` |
| Dominio, DNS o el dominio de los mails | `docs/dns.md` |
| Servicios y cuentas | `docs/accesos.md` |
| Cosas raras del código | `docs/arquitectura.md` |

## Convenciones

- Idioma de la UI, los commits y los textos: español. Nombres de código en inglés.
- Commits al estilo Conventional Commits (`feat(...)`, `fix(...)`, `docs(...)`), como el historial existente.
- Trabajar en ramas (`feat/*`, `fix/*`, `docs/*`, `chore/*`), abrir PR a `develop` y después de `develop` a `main`. No pushear directo a `main`.

## Mails y formularios

- **Las reglas de diseño están centralizadas.** Colores, fuentes y tamaños, en `lib/email/theme.ts`. Datos de contacto, textos compartidos y enlaces, en `lib/email/contact.ts`. Los mails y los componentes no llevan valores de diseño ni textos repetidos sueltos: si algo se usa en más de un lugar, va a uno de esos dos archivos.
- **Todo lo que escribe el visitante pasa por `escapeHtml` o `safeHref`** antes de entrar al HTML de un mail.
- **Los cuerpos de los formularios se validan con `zod`** (`lib/validation.ts`). Los datos del producto salen de Contentful en el servidor, nunca del request.
- **Sin números ni textos mágicos.** Los códigos de estado HTTP con `StatusCodes` (`http-status-codes`) y los demás valores repetidos con una constante con nombre.
