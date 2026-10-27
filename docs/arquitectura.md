# Arquitectura y decisiones

**Última revisión:** 2026-10-27. Esto es lo que no se ve leyendo el código por
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

## Emails

- Todos los envíos pasan por `sendEmail` (`lib/resend.ts`), que **falla si Resend rechaza el mail**. El SDK de Resend no lanza error cuando la API rechaza un envío: lo devuelve dentro de la respuesta, y sin esa revisión un mail rechazado parece enviado.
- El cliente de Resend se crea **al enviar**, no al cargar el módulo. Así el build no depende de `RESEND_API_KEY`.
- **Remitente:** `mailFrom()` arma `noreply@<MAIL_DOMAIN>`. Si no hay variable, usa `eggpertise.com`. Hoy `MAIL_DOMAIN=mail.eggpertise.com`, porque el dominio raíz sigue registrado en la cuenta vieja de Resend (ver [`dns.md`](dns.md)).
- **Destinatario de los avisos:** `CONTACT_EMAIL`, o `info@eggpertise.com` si no está definida. Una dirección mal formada hace fallar los tres formularios (`Invalid 'to' field`).
- **Reply-To:** los mails al cliente (hoy, la ficha técnica) responden a Tomás Strenitz y a `CONTACT_EMAIL` (o `info@eggpertise.com`) juntos. Los avisos al equipo responden al email de quien llenó el formulario. Los datos de Tomás están en `lib/email/contact.ts`.
- **Orden dentro de cada ruta:** primero se guarda el lead en la planilla y después se manda el mail. Un fallo del mail muestra un error al usuario pero no pierde el lead; si el usuario reintenta, puede quedar duplicado.
- En la **ficha técnica** se mandan dos mails (aviso al equipo y ficha al usuario) y se intentan ambos aunque falle uno.

### Diseño de los mails

El diseño sigue el Brand Book de EggPertise. Todo está en `lib/email/`:

| Archivo | Qué tiene |
|---|---|
| `theme.ts` | Colores, fuentes y tamaños. Es el único lugar donde se definen |
| `escape.ts` | `escapeHtml` y `safeHref`. **Todo lo que escribe el visitante tiene que pasar por acá**, porque los mails son HTML |
| `contact.ts` | Datos de la empresa y del contacto de ventas, enlaces de WhatsApp y mail, y los textos precargados |
| `components.ts` | Piezas reutilizables: título, botón, tabla de datos, tarjeta de contacto |
| `layout.ts` | Marco común (`renderEmail`) y versión en texto plano (`renderPlainText`) |
| `mails/` | Un archivo por mail. Cada función devuelve `{ subject, html, text, replyTo }` |

- **Texto plano:** cada mail manda también `text`. Mejora la entrega y cubre clientes que no muestran HTML.
- **Estilos en línea y sin fuentes web:** Gmail y Outlook no cargan fuentes web ni SVG. La fuente es Lato con Calibri y Source Sans 3 de respaldo (Arial no está permitida por el Brand Book).
- **Imágenes:** los mails cargan el logo y los íconos por URL absoluta desde `public/brand/email/` (PNG, al triple del tamaño con que se muestran). Si la rama todavía no está desplegada, esas imágenes no existen en producción. Para probar desde un preview de Vercel, definir `NEXT_PUBLIC_SITE_URL`.
- **Regenerar las imágenes:** `npm i --no-save sharp && node scripts/build-email-assets.cjs`. Las fuentes están en `scripts/email-assets/`. `sharp` no es dependencia del proyecto.
- **Vista previa:** `npm run email:preview` genera los mails con datos de ejemplo en `email-preview/` (ignorada por git) sin enviar nada. Abrir `email-preview/index.html`.
- **Sello del proveedor:** la ficha lleva abajo a la derecha el logo de EggPertise junto al del proveedor, y en Compostaje solo el de Compostaje. `lib/email/product.ts` lo deduce del producto: si el fabricante es `eggpertise-compostaje` o `tratamiento-de-estiercol-eggpertise` es línea propia; si no, se usa el logo del fabricante en Contentful (pedido como PNG de 288 px con `fm=png`, porque Gmail no muestra SVG ni WebP). Un fabricante sin logo deja el mail sin sello.
- **Los formularios mandan solo el producto:** los modales de ficha y de info técnica envían `productoSlug`, y la ruta busca en Contentful el nombre, la ficha, el proveedor y la línea. Nada de eso viaja desde el navegador, así que nadie puede armar un mail oficial con un logo, un nombre o un enlace de descarga inventados. Si el producto no se encuentra (o Contentful no responde), la ruta devuelve 404 antes de guardar el lead, y el usuario ve un error para reintentar.
- **Outlook de escritorio** ignora los bordes redondeados: los botones se ven cuadrados ahí.
