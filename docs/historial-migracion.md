# Historial de la migración a un Vercel propio

**Última revisión:** 2026-10-21.

Resumen de cómo se pasó el sitio, que dependía de la cuenta de Vercel de la persona que lo armó, a una cuenta de EggPertise, y qué quedó pendiente. Sirve de contexto para entender por qué las cosas están como están.

## Por qué se hizo

Los leads de los formularios habían dejado de llegar a la planilla desde julio y nadie lo había notado. Al investigarlo apareció el problema de fondo: Vercel, Resend, el Apps Script y el dominio dependían de cuentas de una persona que ya no mantiene el proyecto.

**Causa probable de los leads perdidos (no confirmada):** el Apps Script corría con una cuenta externa que perdió acceso a la planilla. Además, la copia a la planilla falla en silencio por diseño.

## Qué se hizo

- **Documentación y accesos:** README, CONTRIBUTING, `.env.example` y los documentos de `docs/`.
- **Vercel nuevo:** proyecto en una cuenta de EggPertise, con Analytics activado.
- **Contentful:** API key propia (`eggpertise-web-vercel`).
- **Planilla:** se quitó el acceso público (estaba legible por cualquiera con el link).
- **Apps Script nuevo:** desplegado con una cuenta de EggPertise y compartido con otra persona.
- **Resend nuevo:** cuenta propia, con el subdominio `mail.eggpertise.com` verificado.
- **Código de los formularios** (PR #5, #6 y #7):
  - un fallo de Resend ya no se oculta: el usuario ve un error;
  - el lead se guarda en la planilla antes de mandar el mail, con un tiempo límite de 5 segundos;
  - en la ficha técnica se intentan los dos mails aunque falle uno;
  - el dominio del remitente es configurable (`MAIL_DOMAIN`);
  - el build ya no necesita `RESEND_API_KEY`.
- **Flujo de ramas:** `develop` → `main`.
- **Dominio (2026-10-21):** `www.eggpertise.com` pasó al proyecto nuevo, verificado con un `TXT` en el DNS. El correo de la empresa no se tocó.

## Orden en que se hizo el cambio de dominio

1. Probar todo en la URL `.vercel.app`: contenido, tres formularios, mails y planilla.
2. Dejar los avisos yendo a `info@eggpertise.com` (se borró `CONTACT_EMAIL`).
3. Agregar `www.eggpertise.com` en Vercel. Pidió verificación porque estaba en otra cuenta.
4. Cargar el `TXT` `_vercel` en GoDaddy. Al verificarse, el dominio pasó al proyecto nuevo.
5. Probar un formulario con el dominio real.

## Lecciones

- **Un fallo silencioso es peor que uno visible.** Por eso los formularios ahora muestran el error.
- **Vercel no reconstruye commits con contenido idéntico a uno ya construido**, y Production necesita su propio build. Ver [`deploy.md`](deploy.md).
- **Resend no deja reclamar un dominio que otra cuenta usa activamente**, aunque se controle el DNS. Se resolvió provisoriamente con un subdominio.
- **Los registros de DNS nuevos no pisaron nada** porque se usó un subdominio nuevo. Conviene hacerlo así cuando hay una cuenta vieja de por medio.
- El acceso de **GoDaddy** fue lo único realmente bloqueante. Tenerlo propio es prioridad.

## Pendiente

| Tema | Detalle |
|---|---|
| **GoDaddy** | Conseguir acceso delegado propio |
| **Resend** | Pasar los mails de `mail.eggpertise.com` a `eggpertise.com`. Bloqueado hasta que la cuenta vieja elimine el dominio (ver [`dns.md`](dns.md)) |
| **Vercel anterior** | Pedir que lo apaguen cuando se cierre lo de Resend. Hasta entonces, que no lo borren |
| **Vercel Hobby** | Una sola persona con acceso. Pasar a un plan con equipo y revisar el uso comercial |
| **Seguridad** | 2FA en GitHub, Vercel, Contentful y GoDaddy. Gestor de contraseñas del equipo. Segunda persona admin en Contentful, Resend y GitHub |
| **GitHub** | Mover el repo a una org (ver [`deploy.md`](deploy.md)) |
| **Planilla** | Reparar el Dashboard (`#REF!` y conteos en cero) y completar la lista de Fuente |
| **Mejoras** | Reply-To en el mail de la ficha técnica; que el sitio avise cuando falle la copia a la planilla; quitar `ignoreBuildErrors` |
