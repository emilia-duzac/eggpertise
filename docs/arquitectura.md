# Arquitectura y decisiones

**Última revisión:** 2026-10-20. Esto es lo que no se ve leyendo el código por
arriba.

## Flujo de datos

```
Contentful (GraphQL) ──► lib/contentful.ts ──► páginas (Server Components)
                                                  regeneradas cada 4 h (ISR)

Formulario ──► /api/* ──┬─► Resend (email a CONTACT_EMAIL)
                        └─► lib/leads-sheet.ts ─► Apps Script ─► Google Sheets
```

Las páginas usan `generateStaticParams` para generar productos y fabricantes en el build, y `revalidate = 14400` para refrescarlos.

## Cosas no obvias

- **El build no valida tipos ni lint.** `next.config.mjs` tiene `typescript.ignoreBuildErrors` y `eslint.ignoreDuringBuilds` en `true`. Eso viene del proyecto original generado con v0. Correr `npx tsc --noEmit` antes de mergear. Idealmente se corrigen los errores y se quitan esas opciones.
- **Las imágenes no se optimizan** (`images.unoptimized: true`).
- **La copia a la planilla no rompe el formulario.** Se hace primero, para que el lead sobreviva a un fallo del email. Si falla (o no responde en 5 segundos), se registra en el log y se sigue: el usuario igual ve "enviado". Por eso una falla puede pasar desapercibida meses. Si Resend rechaza el email, en cambio, el usuario sí ve un error.
- **Traducción:** el sitio se traduce con el widget de Google Translate (`components/google-translate.tsx`). La página base está en español. El widget guarda la cookie `googtrans` en varios dominios; el componente limpia todos los alcances para evitar que quede la página traducida de forma persistente.
- **i18n propio sin implementar:** `docs/superpowers/` tiene un spec y un plan para i18n con `next-intl` (español y portugués con locales de Contentful). Es una **propuesta, no el estado actual**: no hay `next-intl` en `package.json` ni locales en el código.
- **Orden de marcas y productos en la home:** listas de slugs fijas en `lib/contentful.ts`. Ver [`contenido.md`](contenido.md).
- **Dos lockfiles** (`package-lock.json` y `pnpm-lock.yaml`). Elegir uno y borrar el otro es una tarea pendiente.
- **Sin tests.** No hay suite de tests ni CI en el repo.

## Formularios

Tres rutas, con validación mínima de campos requeridos y formato de email:

| Ruta | Formulario | `Fuente` en la planilla |
|---|---|---|
| `/api/send-email` | Contacto | `Formulario Web` |
| `/api/solicitar-info-tecnica` | Solicitud de información técnica (modal de producto) | `Solicitud Info Técnica` |
| `/api/send-ficha-tecnica` | Descarga de ficha técnica | `Descarga Ficha Técnica` |

El remitente es `noreply@eggpertise.com` (dominio verificado en Resend).
Los destinatarios van a `CONTACT_EMAIL`, o a `info@eggpertise.com` por defecto.

Detalle de los leads y su planilla en [`leads.md`](leads.md).
