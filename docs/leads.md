# Leads: formularios, email y planilla

**Última revisión:** 2026-10-20.

Un *lead* es una persona que dejó sus datos en un formulario de la web.
Cada lead se envía por **email** y además se copia a una **planilla de Google** para hacer seguimiento.

## Cómo viaja un lead

```
Formulario web
  └─► POST /api/send-email | /api/solicitar-info-tecnica | /api/send-ficha-tecnica
        1. Resend manda un email a CONTACT_EMAIL        (canal principal)
        2. syncLeadToSpreadsheet() (lib/leads-sheet.ts)  (canal secundario)
              └─► POST a LEADS_SHEET_ENDPOINT (Web App de Google Apps Script)
                    └─► el script agrega una fila en la hoja "Leads"
```

- La planilla es **"LEADS WEB EggPertise"** (pestañas `Leads`, `Dashboard`, `Config`), en el Shared Drive "Marketing". ID en [`accesos.md`](accesos.md).
- El script está en [`docs/apps-script/lead-capture.gs`](apps-script/lead-capture.gs). Mapea los datos **por nombre de columna** (fila 1 de la hoja `Leads`) y completa solo `ID`, `Fecha` y `Fecha (API raw)`. Si una columna no existe, la ignora sin avisar.
- Los tres formularios están conectados. Cada uno marca su origen en la columna `Fuente` (ver [`arquitectura.md`](arquitectura.md)).

## Por qué puede fallar sin que nadie se entere

La copia a la planilla **nunca rompe el formulario**: si falla, se escribe un error en el log (`Spreadsheet sync failed for <email>`) y el usuario ve "enviado". El email sale igual, así que el problema solo se nota mirando la planilla.

Además, si `LEADS_SHEET_ENDPOINT` no está definida, la copia se omite sin ningún mensaje.

## Si dejan de llegar leads a la planilla

Revisar en este orden:

1. **Variables en Vercel:** ¿existen `LEADS_SHEET_ENDPOINT` y `LEADS_SHEET_TOKEN`? Después de cambiarlas hay que hacer redeploy.
2. **Logs de Vercel** (*Project → Logs*): buscar `Spreadsheet sync failed`. El mensaje dice el motivo (`Unauthorized`, `Sheet "Leads" not found`, error de permisos, etc.).
3. **Apps Script → Ejecuciones:** si hay ejecuciones fallidas, el log dice por qué. Si no hay ninguna, los pedidos no están llegando (problema en 1 o 2, o URL vieja).
4. **Cuenta dueña del script:** el script corre con los permisos de la cuenta que lo desplegó ("Ejecutar como: Yo"). Esa cuenta tiene que poder **escribir en la planilla**. Si se le quitó acceso (por ejemplo, alguien que dejó el proyecto), el script falla.
5. **URL del deployment:** cada nueva implementación puede cambiar la URL `/exec`. Tiene que coincidir con `LEADS_SHEET_ENDPOINT`.
6. **La planilla:** que exista la pestaña `Leads` y que los encabezados no se hayan renombrado.

**Prueba directa del script** (sin pasar por la web):

```bash
curl -L -X POST "<URL /exec>" \
  -H "Content-Type: application/json" \
  -d '{"token":"<SECRETO>","Nombre":"Prueba","Email":"prueba@example.com","Empresa":"Test","País":"Argentina","Mensaje":"Prueba","Estado":"Nuevo","Fuente":"Formulario Web","Notas":"borrar"}'
```

Debe responder `{"ok":true}` y aparecer una fila. Borrar la fila de prueba.

## Recrear el Apps Script (si se pierde acceso al original)

No hace falta recuperar el deployment anterior; alcanza con crear uno nuevo.

1. Entrar a `script.google.com` con una cuenta `@eggpertise.com` que tenga permiso de escritura en la planilla. Idealmente una cuenta de la empresa, no personal.
2. **Nuevo proyecto independiente.** No crearlo desde la planilla: está en un Shared Drive y un script ligado a la planilla no se puede desplegar desde una cuenta externa.
3. Pegar el contenido de `docs/apps-script/lead-capture.gs` **de este repo** (no de copias viejas: una versión anterior usaba `appendRow`, que escribe cientos de filas debajo de los datos por las filas vacías preformateadas; la actual busca la primera fila libre).
4. Cambiar `SHARED_SECRET` por un valor largo y aleatorio.
5. *Implementar → Nueva implementación → Aplicación web*: Ejecutar como **Yo**, Acceso **Cualquier persona**. Autorizar los permisos.
6. Copiar la URL `/exec` a `LEADS_SHEET_ENDPOINT` y el secreto a `LEADS_SHEET_TOKEN` en Vercel. Redeploy.
7. Probar los **tres** formularios y confirmar que aparece una fila por cada uno.
8. Compartir el proyecto de Apps Script con otra persona como editora (*Compartir*), para no volver a depender de una sola cuenta. Anotarlo en [`accesos.md`](accesos.md).

**Al cambiar el código del script en el repo**, hay que volver a pegarlo en Apps Script y crear una nueva versión de la implementación: el repo no se sincroniza solo.

## Pendientes conocidos

- El `Dashboard` de la planilla muestra `#REF!` en "TOTAL LEADS", y "Leads por País" solo cuenta Argentina, Chile, Uruguay y Brasil.
- La lista desplegable de `Fuente` en `Config` solo tiene Formulario Web, WhatsApp, Linkedin y Recomendación. Faltan "Solicitud Info Técnica" y "Descarga Ficha Técnica".
- La planilla es legible por cualquiera con el link: restringirla.
- No hay alerta cuando la copia falla. Idea: que el script avise por mail ante error.
