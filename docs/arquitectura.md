# Arquitectura y decisiones

**Última revisión:** 2026-10-21. Esto es lo que no se ve leyendo el código por
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

## Analítica y Tag Manager

- **Google Tag Manager** se carga desde `components/google-tag-manager.tsx`, que está en `app/layout.tsx` (todas las páginas). Solo se activa si `NEXT_PUBLIC_GTM_ID` está definida y tiene forma de ID de GTM (`GTM-XXXX`); sin la variable no carga nada. Se define solo en Production, para que los previews no ensucien las métricas, y se lee al construir: hay que redeployar.
- **Eventos de los formularios:** cada formulario llama a `trackEvent()` (`lib/gtm.ts`) justo después de `response.ok`, así que solo se avisa cuando el envío salió bien. Deja `{ event: "form_contacto" | "form_ficha_tecnica" | "form_info_tecnica" }` en el `dataLayer`. **Nunca pasar datos personales** (mail, teléfono, nombre): llegarían a terceros.
- **Qué se hace con esos eventos no está en el código:** los tags (Pixel de Meta, GA4) y sus triggers se arman en la web de GTM. Para sumar un evento hay que agregarlo a `GtmEvent`, llamarlo donde ocurre y armar su trigger en GTM. Las visitas y los clics en WhatsApp los detecta GTM solo, sin código.
- **GA4 sigue instalado directo** con `gtag` en `app/layout.tsx` (ID `G-LH9L77P6YJ`, agregado el 2026-01-09). Si el contenedor de GTM suma una etiqueta de GA4, **cada visita se cuenta dos veces**: en ese mismo cambio hay que sacar el `gtag` del layout.
- **Vercel Analytics** (`<Analytics />`) es independiente de lo anterior y no usa cookies.
- **Cookies:** GA4 (`_ga`) y, cuando se active, el Pixel de Meta se cargan sin pedir consentimiento. No hay banner ni política de privacidad.

## Emails

- Todos los envíos pasan por `sendEmail` (`lib/resend.ts`), que **falla si Resend rechaza el mail**. El SDK de Resend no lanza error cuando la API rechaza un envío: lo devuelve dentro de la respuesta, y sin esa revisión un mail rechazado parece enviado.
- El cliente de Resend se crea **al enviar**, no al cargar el módulo. Así el build no depende de `RESEND_API_KEY`.
- **Remitente:** `mailFrom()` arma `noreply@<MAIL_DOMAIN>`. Si no hay variable, usa `eggpertise.com`. Hoy `MAIL_DOMAIN=mail.eggpertise.com`, porque el dominio raíz sigue registrado en la cuenta vieja de Resend (ver [`dns.md`](dns.md)).
- **Destinatario de los avisos:** `CONTACT_EMAIL`, o `info@eggpertise.com` si no está definida. Una dirección mal formada hace fallar los tres formularios (`Invalid 'to' field`).
- **Reply-To:** solo el formulario de contacto lo usa (con el mail de quien escribió). El mail de la ficha técnica que recibe el usuario no tiene, así que una respuesta no llega a nadie.
- **Orden dentro de cada ruta:** primero se guarda el lead en la planilla y después se manda el mail. Un fallo del mail muestra un error al usuario pero no pierde el lead; si el usuario reintenta, puede quedar duplicado.
- En la **ficha técnica** se mandan dos mails (aviso al equipo y ficha al usuario) y se intentan ambos aunque falle uno.
