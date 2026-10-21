# Accesos y propiedad de los servicios

**Última revisión:** 2026-10-21. Actualizá la fecha cada vez que cambie algo.

Este documento dice **dónde vive cada cosa y quién la controla**. No contiene credenciales: los valores secretos van en las variables de entorno de Vercel y, cuando exista, en un gestor de contraseñas del equipo.

Regla de oro: **cada servicio tiene al menos 2 administradores con cuenta `@eggpertise.com`**. Hoy casi ninguno la cumple (ver "Puntos únicos de falla").

## Servicios

| Servicio | Para qué | Identificador | Quién lo controla hoy | Estado |
|---|---|---|---|---|
| **GitHub** | Código | `emilia-duzac/eggpertise` (cuenta personal, repo público) | `emilia-duzac` | Mover a una org de EggPertise (pendiente, ver [`deploy.md`](deploy.md)) |
| **Vercel** | Hosting y deploy | Proyecto `eggpertise` en una cuenta **Hobby** de `emilia.duzac@eggpertise.com` (scope `emiliaduzac-5870`) | Una sola persona (Hobby no permite sumar miembros) | En producción desde 2026-10-21 |
| **Vercel (anterior)** | Servía el sitio hasta 2026-10-21 | Proyecto de la persona que armó la web | Esa persona | Ya no sirve `www.eggpertise.com`. Se mantiene unos días y se apaga al cerrar lo de Resend |
| **Contentful** | Contenido (CMS) | Space `qjhuufa729ye`. API key propia `eggpertise-web-vercel` | Quien administra el space (PENDIENTE anotar nombres) | Funcionando |
| **Resend** | Emails de los formularios | Cuenta nueva de la empresa. Dominio verificado: `mail.eggpertise.com` (São Paulo). API key `eggpertise-web` | Una persona (PENDIENTE anotar el mail de la cuenta) | Funcionando |
| **Resend (anterior)** | Es dueña de `eggpertise.com` en Resend | Cuenta de la persona anterior | Esa persona | Bloquea reclamar el dominio raíz (ver [`dns.md`](dns.md)) |
| **Google Apps Script** | Recibe leads y los escribe en la planilla | Proyecto independiente "EggPertise - Captura de leads" | Creado con `emilia.duzac@eggpertise.com`, compartido como editor con 1 persona (PENDIENTE anotar quién) | Funcionando. Ver [`leads.md`](leads.md) |
| **Google Sheets** | Planilla "LEADS WEB EggPertise" | `1w_ZjMuc7X2wUQxedim-ZWo7qYnTxSx6LhP2uNEmxczA` | Shared Drive "Marketing" | Acceso restringido (ya no es pública) |
| **GoDaddy** | Registro del dominio y DNS de `eggpertise.com` | Vence 2028-04-30. Nameservers de GoDaddy | PENDIENTE: hoy se opera con la sesión de un compañero | **Falta acceso delegado propio** |
| **Google Workspace** | Correo `@eggpertise.com` | Registros `MX` de Google | Administración de la empresa | No cambió |

## Puntos únicos de falla

Si cualquiera de estos se pierde, algo deja de funcionar. Conviene resolverlos en este orden:

1. **GoDaddy sin acceso propio.** Sin él no se puede tocar el DNS: ni el dominio, ni el correo, ni Resend. Pedir "Acceso delegado" a `emilia.duzac@eggpertise.com`.
2. **Vercel en una cuenta Hobby personal.** Una sola persona puede entrar. Pasar a un plan que permita equipo y sumar una segunda persona. Hobby además limita el uso comercial: revisar los términos.
3. **El Apps Script corre con los permisos de una cuenta** ("Ejecutar como: Yo"). Si esa cuenta pierde acceso a la planilla, los leads dejan de guardarse sin avisar. Ver el traspaso en [`leads.md`](leads.md).
4. **Gestor de contraseñas:** todavía no hay. Los secretos viven solo en Vercel.
5. **Una sola persona admin en Contentful, Resend y GitHub.**

## Qué permisos pedir

- **Vercel:** rol *Owner* o *Member*. Un proyecto en una cuenta Hobby personal no se puede compartir: hay que pasarlo a un equipo.
- **Contentful:** *Editor* alcanza para cargar contenido. Para cambiar el modelo, activar locales o crear API keys hace falta *Space Admin*.
- **GitHub:** pasar el repo a una org y dar rol *Admin* a al menos 2 personas.
- **GoDaddy:** "Acceso delegado" (dominios y DNS). La función puede aparecer como *Delegate Access* o dentro de *Users*; los roles se leen en pantalla. No compartir contraseñas.
- **Planilla:** los miembros del Shared Drive "Marketing" ya tienen acceso.

## Variables de entorno

Se cargan en Vercel (*Settings → Environment Variables*). Después de cambiarlas hay que **redeployar**. La lista comentada está en [`.env.example`](../.env.example).

| Variable | Valor / de dónde sale | Production | Preview | Tipo |
|---|---|---|---|---|
| `CONTENTFUL_SPACE_ID` | `qjhuufa729ye` | Sí | Sí | Sensible |
| `CONTENTFUL_DELIVERY_TOKEN` | Contentful → Settings → API keys (key `eggpertise-web-vercel`) | Sí | Sí | Sensible |
| `RESEND_API_KEY` | Resend → API Keys (key `eggpertise-web`, permiso *Sending access*, limitada a `mail.eggpertise.com`) | Sí | No | Sensible |
| `MAIL_DOMAIN` | `mail.eggpertise.com`. Dominio desde el que se envía. Se borra cuando se pueda enviar desde `eggpertise.com` | Sí | Según se necesite | No sensible |
| `CONTACT_EMAIL` | **No definida a propósito**: los avisos van a `info@eggpertise.com`. Definirla solo para cambiar la casilla | No | No | No sensible |
| `LEADS_SHEET_ENDPOINT` | URL `/exec` de la implementación del Apps Script | Sí | No | Sensible |
| `LEADS_SHEET_TOKEN` | Secreto compartido; es el mismo `SHARED_SECRET` que está dentro del script | Sí | No | Sensible |

`RESEND_API_KEY` y las variables de la planilla están solo en Production a propósito: así un preview no escribe en la planilla real ni manda mails. En un preview, enviar un formulario **falla con un error**, y es lo esperado.

## Checklist cuando alguien se va del equipo

- [ ] ¿Tenía rol de admin en Vercel, Contentful, GitHub, Resend o GoDaddy? Dejar a otra persona antes de quitarlo.
- [ ] ¿Es la cuenta con la que corre el Apps Script? Hay que crear una nueva implementación desde otra cuenta y cambiar `LEADS_SHEET_ENDPOINT` (ver [`leads.md`](leads.md)).
- [ ] ¿Conocía las API keys? Rotarlas: Contentful, Resend y el secreto del script.
- [ ] Actualizar este documento.
