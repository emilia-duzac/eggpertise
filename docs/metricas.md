# Métricas: Google Tag Manager, Analytics, Meta y LinkedIn

**Última revisión:** 2026-11-25.

Esta guía tiene dos partes: **qué mide el sitio** (ya está en el código) y **qué hay que armar en la web de Google Tag Manager** para que esos datos lleguen a Analytics, Meta y LinkedIn.

## Cómo funciona

1. El sitio avisa a **Google Tag Manager (GTM)** cada vez que pasa algo importante (un formulario enviado, un clic en WhatsApp...).
2. En GTM se decide a dónde va cada aviso: Google Analytics, Pixel de Meta, LinkedIn.
3. Para medir algo nuevo o cambiar a dónde va, casi siempre alcanza con tocar GTM, sin publicar código.

## Identificadores (son públicos, no son secretos)

| Qué | Valor |
|---|---|
| Contenedor de GTM | `GTM-NK5WMFBX` |
| Google Analytics 4 | `G-LH9L77P6YJ` |
| Pixel de Meta | `1754669193333807` |
| Insight Tag de LinkedIn (Partner ID) | **PENDIENTE: pedirlo a quien administra LinkedIn Ads** |

## Qué mide el sitio

Cada aviso lleva el nombre del evento y algunos datos. **Nunca** lleva datos personales (nombre, mail, teléfono).

| Evento | Cuándo ocurre | Datos que trae | ¿Conversión? |
|---|---|---|---|
| `generate_lead` | Se envió bien un formulario | `form` (`contacto`, `ficha_tecnica`, `info_tecnica`), `producto` (si corresponde) | **Sí** |
| `click_whatsapp` | Clic en cualquier enlace de WhatsApp | `ubicacion`, `pais_numero` (`AR` o `US`), `producto` | **Sí** |
| `click_phone` | Clic en un teléfono | `ubicacion`, `producto` | Sí |
| `click_email` | Clic en un mail | `ubicacion`, `producto` | Sí |
| `click_social` | Clic en LinkedIn, Instagram o YouTube | `red`, `ubicacion` | No |
| `form_start` | Se abre un formulario o se empieza a escribir | `form`, `producto` | No |
| `view_item` | Se abre la página de un producto | `ecommerce.items` (id, nombre y marca del producto) | No |
| `language_change` | Se cambia el idioma | `idioma` (`es`, `pt`, `en`) | No |

`ubicacion` dice dónde estaba el enlace: `boton_flotante`, `footer`, `contacto` (sección de contacto), `header`, otra sección de la página o `pagina`.

Además, GTM puede medir solo, sin código: visitas a cada página, cuánto se baja en la página (scroll) y reproducciones de los videos de YouTube de los productos.

## Parte 1: armar GTM (en borrador)

Entrá a GTM, contenedor `GTM-NK5WMFBX`, espacio de trabajo. Todo lo que sigue queda en borrador hasta que lo publiques.

### 1. Variables
*Variables → Variables definidas por el usuario → Nueva → Variable de capa de datos.* Crear una por cada nombre:
`form`, `producto`, `ubicacion`, `pais_numero`, `red`, `idioma`.

### 2. Activadores
*Activadores → Nuevo → Evento personalizado.* Uno por evento, con el **nombre exacto** de la tabla de arriba (`generate_lead`, `click_whatsapp`, `click_phone`, `click_email`, `click_social`, `form_start`, `view_item`, `language_change`).

### 3. Pixel de Meta
- **Etiqueta base:** *HTML personalizado* con el código del Pixel (ID `1754669193333807`), activador **All Pages**. Es el código que viene en el documento que pasó marketing. **No pegarlo en el código del sitio**: si está en los dos lugares, cada visita cuenta doble.
- **Eventos** (también *HTML personalizado*, uno por cada fila):

| Cuándo (activador) | Código |
|---|---|
| `generate_lead` | `fbq('track','Lead');` |
| `click_whatsapp`, `click_phone`, `click_email` | `fbq('track','Contact');` |
| `view_item` | `fbq('track','ViewContent');` |

En la sección "Consentimiento" de cada etiqueta de Meta, dejar el orden de disparo después de la etiqueta base (*Secuencia de etiquetas*: que la base se dispare primero).

### 4. LinkedIn
Cuando esté el Partner ID:
- **Insight Tag:** plantilla *LinkedIn Insight Tag* (de la galería de plantillas de la comunidad), con el Partner ID, activador **All Pages**.
- **Conversiones:** en LinkedIn Campaign Manager, crear una conversión para consultas (`generate_lead`) y otra para contacto por WhatsApp (`click_whatsapp`), y en GTM una etiqueta de conversión de LinkedIn por cada una con su activador. Seguir la ayuda oficial de LinkedIn "conversion tracking con Google Tag Manager" porque los pasos de esa pantalla cambian.

### 5. Google Analytics (Publicar 2, no antes)
Hasta que se publique el segundo paso, **Analytics sigue cargándose directo desde el sitio** y estas etiquetas no se crean todavía. Ver "Publicación".
- **Etiqueta de Google (configuración):** ID `G-LH9L77P6YJ`, activador **Initialization - All Pages**.
- **Una etiqueta de evento de GA4 por cada evento** de la tabla, con el nombre del evento igual y los datos como parámetros (`form`, `producto`, `ubicacion`, `pais_numero`, `red`, `idioma`). En `view_item`, activar "Enviar datos de comercio electrónico → Capa de datos".
- **Videos y scroll:** activar las variables integradas de scroll y YouTube, y crear los activadores *Profundidad de desplazamiento* (75%) y *Video de YouTube*.
- En Analytics: *Administrar → Eventos →* marcar como **evento clave**: `generate_lead`, `click_whatsapp`, `click_phone`, `click_email`.

## Parte 2: probar antes de publicar

1. En tu computadora, en la carpeta del proyecto, crear el archivo `.env.local` (no se sube a GitHub) con la línea `NEXT_PUBLIC_GTM_ID=GTM-NK5WMFBX` y correr `npm run dev`.
2. En GTM, botón **Vista previa**, e ingresar `http://localhost:3000`.
3. Recorrer el sitio: enviar un formulario (en local falla el envío, lo esperado: los eventos de formulario solo se prueban en producción), hacer clic en WhatsApp, abrir un producto. En la vista previa debe aparecer cada evento y qué etiquetas disparó.
4. Instalar la extensión *Meta Pixel Helper* de Chrome: debe mostrar el Pixel y los eventos.
5. En el sitio de producción, un envío de formulario real o de prueba se ve en *Meta Events Manager → Probar eventos* y en *Analytics → Informes en tiempo real*.

## Publicación (dos pasos, para no contar doble ni perder datos)

**Publicar 1**
1. Mergear a `main` (lo aprueba Emilia).
2. En Vercel, cargar `NEXT_PUBLIC_GTM_ID=GTM-NK5WMFBX` solo en **Production** y hacer redeploy (la variable se lee al construir).
3. En GTM, **Enviar → Publicar** con Meta, LinkedIn y los activadores, **sin** las etiquetas de Analytics. Analytics sigue funcionando como antes.
4. Esperar 24 a 48 horas y revisar Meta Events Manager y LinkedIn.

**Publicar 2** (solo si lo anterior está bien)
1. En el código, sacar de `app/layout.tsx` el bloque de Analytics directo (los dos `Script` con `G-LH9L77P6YJ`) y desplegar.
2. En el mismo momento, publicar en GTM las etiquetas de Analytics del punto 5.
3. Revisar en Analytics (tiempo real) que cada visita cuente **una sola vez**.

## Cookies y privacidad

Hoy el sitio no tiene aviso de cookies ni política de privacidad. Al activar Meta y LinkedIn se usan cookies de publicidad. Antes de hacer campañas en países con leyes estrictas (Europa, Brasil, entre otros) conviene tener el aviso, y Google exige "Consent Mode v2" con un aviso certificado para el tráfico de Europa y Reino Unido. Es un cambio aparte.

## Cómo sumar un evento nuevo

1. Agregarlo al tipo `GtmEvent` en `lib/gtm.ts` y llamar a `trackEvent()` donde ocurre. Los clics a WhatsApp, teléfono, mail y redes **no necesitan código**: `components/click-tracker.tsx` los detecta por la dirección del enlace.
2. Sumar su fila a la tabla de esta guía.
3. Crear su activador y sus etiquetas en GTM.

## Pendientes conocidos

- API de conversiones de Meta y LinkedIn (se envía desde un servidor, más precisa; requiere un servidor de GTM aparte y evitar duplicados).
- Guardar la campaña de origen (parámetros UTM) en la planilla de leads: toca `app/api/*` y el Apps Script, se deriva a Emilia.
- Verificar el dominio `eggpertise.com` en la cuenta de Meta.
