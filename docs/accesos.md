# Accesos y propiedad de los servicios

**Última revisión:** 2026-10-20. Actualizá la fecha cada vez que cambie algo.

Este documento dice **dónde vive cada cosa y quién la controla**. No contiene credenciales: los valores secretos van en un gestor de contraseñas del equipo y en las variables de entorno de Vercel.

Regla de oro: **cada servicio tiene al menos 2 administradores con cuenta `@eggpertise.com`**. Si hay uno solo, es un riesgo (ya pasó una vez, ver [`leads.md`](leads.md)).

| Servicio | Para qué | Identificador | Dueño / admins | Estado |
|---|---|---|---|---|
| **GitHub** | Código | `emilia-duzac/eggpertise` (cuenta personal) | PENDIENTE | Mover a una org de EggPertise |
| **Vercel** | Hosting y deploy | PENDIENTE (equipo y proyecto) | PENDIENTE | Acceso en trámite |
| **Contentful** | Contenido (CMS) | Space `qjhuufa729ye` | PENDIENTE | Pedir rol Space Admin |
| **Resend** | Emails de formularios | Remitente `noreply@eggpertise.com` | PENDIENTE | Verificar acceso |
| **Google Apps Script** | Recibe leads y los escribe en la planilla | PENDIENTE (proyecto y cuenta que lo desplegó) | PENDIENTE | Ver `leads.md` |
| **Google Sheets** | Planilla "LEADS WEB EggPertise" | `1w_ZjMuc7X2wUQxedim-ZWo7qYnTxSx6LhP2uNEmxczA` | Shared Drive "Marketing" | Ver abajo |
| **Dominio / DNS** | eggpertise.com | PENDIENTE (registrador) | PENDIENTE | |

## Qué permisos pedir

- **Vercel:** rol *Owner* o *Member* con acceso al proyecto. Un Owner del equipo
  invita desde *Settings → Members*. Un proyecto en una cuenta Hobby personal no
  se puede compartir: hay que transferirlo a un equipo.
- **Contentful:** *Editor* alcanza para cargar contenido. Para cambiar el
  modelo, activar locales o ver las API keys hace falta *Space Admin*. La
  organización la administra un Admin de organización.
- **GitHub:** pasar el repo a una org y dar rol *Admin* a al menos 2 personas.
- **Planilla:** los miembros del Shared Drive "Marketing" ya tienen acceso. Hay
  que revisar quiénes son *organizers* y quitar enlaces públicos (hoy la
  planilla es legible por cualquiera con el link).

## Dónde viven los secretos

| Secreto | Dónde se genera | Dónde se guarda |
|---|---|---|
| `CONTENTFUL_SPACE_ID`, `CONTENTFUL_DELIVERY_TOKEN` | Contentful → Settings → API keys | Vercel (env vars) + gestor de contraseñas |
| `RESEND_API_KEY` | Resend → API Keys | Vercel (env vars) + gestor de contraseñas |
| `CONTACT_EMAIL` | No es secreto | Vercel (env vars) |
| `MAIL_DOMAIN` (opcional) | No es secreto. Dominio verificado en Resend desde el que se envía | Vercel (env vars) |
| `LEADS_SHEET_ENDPOINT` | URL `/exec` al desplegar el Apps Script | Vercel (env vars) |
| `LEADS_SHEET_TOKEN` | Lo inventa quien despliega el script | Vercel (env vars) + dentro del script (`SHARED_SECRET`) |

La lista completa y comentada de variables está en [`.env.example`](../.env.example).

## Checklist cuando alguien se va del equipo

- [ ] ¿Tenía rol de admin en Vercel, Contentful, GitHub o Resend? Dejar a otra persona antes de quitarlo.
- [ ] ¿Era dueño del Apps Script? Hay que recrearlo con otra cuenta (ver `leads.md`).
- [ ] Rotar las API keys que conocía.
