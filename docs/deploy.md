# Deploy

**Última revisión:** 2026-10-21.

## Cómo se despliega

- Hosting: **Vercel**, proyecto `eggpertise` (ver [`accesos.md`](accesos.md)). Se instala con **pnpm**, porque el repo tiene `pnpm-lock.yaml`.
- El repo no tiene `vercel.json` ni carpeta `.vercel/`: la configuración vive en el panel de Vercel.
- La integración con GitHub construye automáticamente:
  - la rama **`main`** → ambiente **Production**,
  - cualquier otra rama y cada PR → ambiente **Preview**, con una URL propia.
- Flujo de trabajo: rama de trabajo → PR a **`develop`** → se prueba en el preview de `develop` → PR de `develop` a **`main`**. Ver [`CONTRIBUTING.md`](../CONTRIBUTING.md).
- No hay CI propio. Los chequeos del PR son los de Vercel (que compile) y los que se hagan a mano.

## Ambientes

| Ambiente | Qué construye | URL | Variables |
|---|---|---|---|
| **Production** | `main` | `eggpertise-flax.vercel.app` y `www.eggpertise.com` | Las marcadas Production |
| **Preview** | Cualquier otra rama y los PR | Una por rama (`eggpertise-git-<rama>-…vercel.app`) y una por commit | Las marcadas Preview |

Las URL de preview están **protegidas por login de Vercel** (solo las abre quien tiene sesión en la cuenta). La tabla de variables está en [`accesos.md`](accesos.md).

## Cosas que no son obvias

1. **Vercel no vuelve a construir un commit cuyo contenido ya construyó.** El commit de merge de un PR ya construido tiene el mismo contenido y **no genera un deploy nuevo**. Pero Production necesita **su propio build con sus variables**: un build de Preview no sirve.
2. **El botón "Redeploy" reconstruye el commit del deploy que elegiste**, no el último de `main`. Si elegís un deploy viejo, reconstruís código viejo.
3. **Para forzar un build de Production con el código de `main`:** en *Deployments*, abrir un deploy que tenga **el mismo contenido** que `main` (por ejemplo el preview del último commit de la rama que se mergeó), tres puntitos → *Redeploy* → **Environment: Production**, con *Use existing Build Cache* sin tildar. Alternativa: un PR con cualquier cambio real.
4. **Las variables se leen al construir.** Cambiar una variable no tiene efecto hasta el siguiente deploy.
5. **Un build de Preview no tiene `RESEND_API_KEY` ni las variables de la planilla.** El sitio compila igual (el cliente de Resend se crea al enviar), pero los formularios muestran un error.
6. **Un deploy fallido no tumba el sitio:** Vercel deja en línea el último deploy bueno de Production.

## Variables de entorno

Los archivos `.env*` están ignorados por git, así que **no viajan con el código**: si se crea un proyecto de Vercel nuevo, hay que cargarlas a mano. Lista y valores en [`accesos.md`](accesos.md) y [`.env.example`](../.env.example).

Si falta `LEADS_SHEET_ENDPOINT`, el código no avisa: simplemente no copia los leads a la planilla (ver [`leads.md`](leads.md)).

## Dominio

- **`www.eggpertise.com`** está asignado al proyecto, conectado a Production. Se agregó el 2026-10-21 verificándolo con un registro `TXT` en `_vercel.eggpertise.com`, porque estaba en la cuenta de Vercel anterior.
- **`eggpertise.com`** (sin `www`) **no está en Vercel**: lo redirige a `www` el reenvío de dominio de GoDaddy. No agregarlo en Vercel sin revisar ese reenvío.
- El `CNAME` de `www` sigue apuntando al valor viejo (`d417eb0165d47bf6.vercel-dns-017.com`). Vercel lo marca como **Valid Configuration**, así que no se cambió. Ver [`dns.md`](dns.md).
- Vercel decide qué proyecto sirve un dominio por **la asignación del dominio**, no por el valor del CNAME. Por eso, si algo falla, **poner el CNAME viejo no vuelve al sitio anterior**.

## Cuánto tarda en verse el contenido nuevo

Las páginas se regeneran cada **4 horas** (`export const revalidate = 14400` en `app/page.tsx`, `app/productos/[slug]/page.tsx` y `app/distribuidoras/[slug]/page.tsx`). Si se publica algo en Contentful, puede tardar hasta 4 horas en aparecer. Para verlo ya, hacer un redeploy de Production.

## Si un deploy falla o el sitio se rompe

1. Vercel → *Deployments* → abrir el último y revisar el log de build.
2. Para volver atrás rápido: *Instant Rollback* a un deploy anterior que funcionaba.
3. Los errores de runtime de las rutas `/api/*` están en *Logs* del proyecto. Buscar `Resend rejected the email` o `Spreadsheet sync failed`.
4. Si el problema es el dominio: ver [`dns.md`](dns.md). Recuperar el dominio en otro proyecto requiere acceso a GoDaddy.

## Mover el repo a una org de GitHub

Está pendiente y conviene hacerlo con el sitio estable.

1. Comprobar que el plan de Vercel permite conectar un repo de una organización (el plan Hobby suele restringirlo).
2. Instalar la GitHub App de Vercel en la org y darle acceso al repo.
3. GitHub → *Settings → Transfer ownership*.
4. Vercel → *Project → Settings → Git*: desconectar y volver a conectar con el repo nuevo.
5. Hacer un push de prueba y verificar que dispara un deploy.
6. Actualizar el remoto local: `git remote set-url origin git@github.com:<org>/eggpertise.git`.

El sitio publicado sigue funcionando durante la transferencia; solo pueden pausarse los deploys nuevos hasta el paso 4. El dominio, el DNS y las variables no cambian.
