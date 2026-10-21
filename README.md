# EggPertise: sitio web

Sitio institucional y de catálogo de EggPertise (eggpertise.com): fabricantes representados, productos, noticias y formularios de contacto. Desarrollado con Next.js (App Router), TypeScript, Tailwind y shadcn/ui, con el contenido en Contentful.

> Antes de tocar infraestructura, leé [`docs/accesos.md`](docs/accesos.md): es el
> mapa de quién es dueño de cada servicio.

## Requisitos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 18.17 (mínimo de Next 14; PENDIENTE confirmar la versión que usa Vercel) |
| npm | el que viene con Node |

El repo tiene `package-lock.json` y `pnpm-lock.yaml`. Usá **npm** y no commitees cambios en el otro lockfile. Para manejar versiones de Node se recomienda `nvm`.

## Instalación

```bash
# 1. Clonar el repositorio (la URL puede cambiar al mover el repo a una org)
git clone git@github.com:emilia-duzac/eggpertise.git

# 2. Instalar dependencias
npm install
```

## Variables de entorno

Creá un archivo `.env.local` en la raíz a partir de [`.env.example`](.env.example).

| Variable | Para qué |
|---|---|
| `CONTENTFUL_SPACE_ID`, `CONTENTFUL_DELIVERY_TOKEN` | Leer el contenido. Sin ellas el sitio no carga datos |
| `RESEND_API_KEY`, `CONTACT_EMAIL`, `MAIL_DOMAIN` (opcional) | Enviar los emails de los formularios. `MAIL_DOMAIN` cambia el dominio del remitente |
| `LEADS_SHEET_ENDPOINT`, `LEADS_SHEET_TOKEN` | Copiar los leads a la planilla. Si falta el endpoint, se omite **sin avisar** |

Dónde conseguir cada valor: [`docs/accesos.md`](docs/accesos.md). En producción las variables se cargan en Vercel (ver [`docs/deploy.md`](docs/deploy.md)).

## Correr la aplicación

```bash
# Servidor de desarrollo con hot-reload
npm run dev

# Build y servidor de producción
npm run build
npm run start
```

La app queda en http://localhost:3000.

## Lint y tipos

```bash
# Errores de lint
npm run lint

# Chequeo de tipos
npx tsc --noEmit
```

> **Ojo:** `next.config.mjs` desactiva el chequeo de TypeScript y ESLint durante el build (`ignoreBuildErrors`, `ignoreDuringBuilds`). Un build verde **no** garantiza que el código no tenga errores: corré `npx tsc --noEmit` a mano antes de mergear. Tampoco hay tests automatizados ni CI.

## Estructura

```
app/
  page.tsx                      home
  productos/[slug]/             ficha de producto
  distribuidoras/[slug]/        página de cada fabricante
  api/send-email/               formulario de contacto
  api/solicitar-info-tecnica/   solicitud de información técnica
  api/send-ficha-tecnica/       descarga de ficha técnica
components/                     secciones de la home, modales, WhatsApp
components/ui/                  componentes base (shadcn/ui)
lib/contentful.ts               consultas GraphQL y orden de marcas/productos
lib/leads-sheet.ts              envío de leads a la planilla
lib/email-templates.tsx         plantillas de email
docs/                           documentación
```

## Tecnologías

| Tecnología | Versión |
|---|---|
| Next.js | 14.2.35 |
| React | ^18 |
| TypeScript | ^5 |
| Tailwind CSS | ^4.1.9 |
| shadcn/ui (Radix UI) | ver `package.json` |
| Contentful (SDK + GraphQL) | ^11.8.1 |
| Resend | ^6.1.2 |
| Zod | 3.25.67 |
| Hosting | Vercel |

## Documentación

| Documento | Para qué |
|---|---|
| [`docs/accesos.md`](docs/accesos.md) | Quién es dueño de cada servicio y cómo pedir acceso |
| [`docs/deploy.md`](docs/deploy.md) | Deploy, variables y mover el repo de org |
| [`docs/contenido.md`](docs/contenido.md) | Modelo de Contentful y carga de contenido |
| [`docs/leads.md`](docs/leads.md) | Cómo viaja un lead y cómo diagnosticar si dejan de llegar |
| [`docs/arquitectura.md`](docs/arquitectura.md) | Decisiones y cosas no obvias del código |
| [`CLAUDE.md`](CLAUDE.md) | Reglas cortas para agentes de código |

`docs/superpowers/` contiene un spec y un plan de i18n (español/portugués) que
**no se implementaron**; ver [`docs/arquitectura.md`](docs/arquitectura.md).

## Contribuir

Ver [`CONTRIBUTING.md`](CONTRIBUTING.md) para el flujo de trabajo, y `CLAUDE.md` y `docs/` para la arquitectura y las convenciones.
