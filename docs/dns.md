# DNS y dominio

**Última revisión:** 2026-10-21. Inventario relevado el 2026-10-21 desde GoDaddy.

El dominio **`eggpertise.com`** está registrado en **GoDaddy** (vence **2028-04-30**), y su DNS se administra ahí mismo (nameservers `ns69.domaincontrol.com` y `ns70.domaincontrol.com`). El acceso a GoDaddy está pendiente de resolver (ver [`accesos.md`](accesos.md)).

**Tocar el DNS es lo más delicado de todo el proyecto:** un error puede cortar el sitio y el correo de la empresa. Antes de cambiar algo, sacar una captura de la tabla completa.

## Reglas

- **No tocar nunca** los `MX` de Google, el `TXT` de SPF del `@`, el `TXT` de `google-site-verification`, ni `_dmarc`, salvo que el cambio sea sobre el correo.
- **Un solo SPF por nombre.** Un nombre no puede tener dos `TXT` que empiecen con `v=spf1`. Distintos servicios que verifican el dominio (`google-site-verification`, `resend-domain-verification`, `vc-domain-verify`) **sí** pueden convivir en el mismo nombre.
- **Un `CNAME` no puede convivir con ningún otro registro en el mismo nombre.**
- En GoDaddy, el campo *Name* va **sin** `.eggpertise.com`. El `@` es el dominio raíz.
- **No usar los botones de "Auto configure"** (de Resend, Vercel o GoDaddy): escriben en el DNS por su cuenta.
- Cada cambio pide verificación de identidad a quien tenga la cuenta de GoDaddy.
- Los cambios tardan de minutos a una hora en verse (TTL de 1 hora).

## Inventario de registros

| Tipo | Nombre | Para qué | ¿Tocar? |
|---|---|---|---|
| `A` ×2 | `@` | Reenvío de GoDaddy: `eggpertise.com` → `https://www.eggpertise.com` | No |
| `NS` ×2 | `@` | Nameservers de GoDaddy | No |
| `SOA` | `@` | Interno de GoDaddy | No |
| `CNAME` | `www` | **El sitio.** Apunta a `d417eb0165d47bf6.vercel-dns-017.com` (valor heredado del Vercel anterior). Vercel lo marca válido | Con cuidado. Ver abajo |
| `CNAME` | `pay` | Pagos de GoDaddy (`paylinks.commerce.godaddy.com`) | No |
| `CNAME` | `pt3iqhbx6rl5` | Verificación de Google (`…dv.googlehosted.com`) | No |
| `CNAME` | `test-odoo` | **Entorno de prueba de Odoo** (`…dev.odoo.com`). No es de este proyecto | No |
| `CNAME` | `_domainconnect` | Interno de GoDaddy | No |
| `MX` ×5 | `@` | **Correo de Google Workspace** (`aspmx.l.google.com` y 4 `alt…`) | No |
| `TXT` | `@` | `google-site-verification=…` | No |
| `TXT` | `@` | SPF del correo (`v=spf1 include:dc-aa8e722993._spfm.eggpertise.com ~all`) | No |
| `TXT` | `dc-aa8e722993._spfm` | SPF de Google (`v=spf1 include:_spf.google.com ~all`) | No |
| `TXT` | `_dmarc` | DMARC: `p=reject`, alineación relajada | No |
| `TXT` | `resend._domainkey` | DKIM de la **cuenta vieja** de Resend | Se reemplaza al reclamar el dominio raíz |
| `MX` | `send` | Rebotes de la cuenta **vieja** de Resend (`feedback-smtp.sa-east-1.amazonses.com`) | Se borra al reclamar el dominio raíz |
| `TXT` | `send` | SPF de la cuenta **vieja** de Resend (`include:amazonses.com`) | Se borra al reclamar el dominio raíz |

### Registros agregados el 2026-10-21

| Tipo | Nombre | Para qué |
|---|---|---|
| `TXT` | `_vercel` | Verificación del dominio `www.eggpertise.com` en el Vercel nuevo (`vc-domain-verify=www.eggpertise.com,…`) |
| `TXT` | `resend._domainkey.mail` | DKIM de `mail.eggpertise.com` en el Resend nuevo |
| `CNAME` | `rsend.mail` | Auxiliar de Resend para `mail.eggpertise.com` |
| `CNAME` | `send.mail` | Envío de Resend para `mail.eggpertise.com` |
| `TXT` | `@` | `resend-domain-verification=…`: reclamo de `eggpertise.com` en el Resend nuevo. Puede quedarse |

Los tres registros con `.mail` permiten enviar desde `noreply@mail.eggpertise.com`, que es lo que usa el sitio hoy. Se verificó que los mails salen con **SPF, DKIM y DMARC en PASS**.

## El sitio y el `CNAME` de `www`

- Vercel asigna el dominio a un proyecto (se hizo con el `TXT` `_vercel`). El valor del `CNAME` **no decide** qué proyecto lo sirve.
- Hoy el `CNAME` conserva el valor del Vercel anterior y Vercel lo da por válido. No se cambió. Si en el futuro Vercel marca el dominio como mal configurado, el valor recomendado se ve en *Settings → Domains → Show DNS configuration*.
- Por eso, si algo falla, **volver a poner un valor viejo no devuelve el sitio anterior**. Se corrige en el proyecto actual o con *Instant Rollback* (ver [`deploy.md`](deploy.md)).

## Pendiente: pasar los mails a `eggpertise.com`

Hoy los mails salen de `noreply@mail.eggpertise.com` (variable `MAIL_DOMAIN`). El objetivo es volver a `noreply@eggpertise.com`.

**Bloqueo:** el dominio `eggpertise.com` está registrado y "enviando activamente" en la cuenta vieja de Resend. Al intentar reclamarlo con el `TXT` de `@`, Resend respondió que la cuenta vieja tiene que eliminarlo manualmente.

Cuando esa cuenta lo elimine:

1. Resend → `eggpertise.com` → **Verify** (el `TXT` ya está cargado).
2. Resend muestra los registros definitivos. **Revisar la tabla antes de cargar nada.**
3. En GoDaddy: borrar `send` `MX` y `send` `TXT` (los de la cuenta vieja), reemplazar el `TXT` de `resend._domainkey` y agregar los `CNAME` nuevos. **No tocar nada más.**
4. Esperar el estado **Verified** en Resend.
5. Crear una **API key nueva** limitada a `eggpertise.com` (la actual solo vale para `mail.eggpertise.com`).
6. En Vercel: cargar la key en `RESEND_API_KEY`, **borrar `MAIL_DOMAIN`** y redeployar Production.
7. Probar un formulario. El remitente debe ser `noreply@eggpertise.com`, con SPF, DKIM y DMARC en PASS.
8. Borrar `mail.eggpertise.com` en Resend y sus 3 registros de GoDaddy.

**Alternativa si esa cuenta no responde:** borrar de GoDaddy los registros viejos de Resend (`resend._domainkey`, `send` `MX` y `send` `TXT`) deja a esa cuenta sin poder firmar mails de `eggpertise.com`. Antes hay que confirmar que ningún otro sistema (por ejemplo, Odoo) mande mail a través de ella.
