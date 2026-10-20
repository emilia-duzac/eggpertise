# Deploy

**Última revisión:** 2026-10-20. Varias partes están marcadas PENDIENTE hasta tener acceso a Vercel; completarlas apenas se pueda.

## Cómo se despliega

- Hosting: **Vercel** (equipo y proyecto: PENDIENTE, ver [`accesos.md`](accesos.md)).
- El repo no tiene `vercel.json` ni carpeta `.vercel/`: la configuración vive en el panel de Vercel.
- PENDIENTE: confirmar si el deploy es automático por push a `main` (lo habitual con la integración de GitHub) y si cada PR genera un preview.

## Variables de entorno

Se cargan en Vercel: *Project → Settings → Environment Variables*. La lista está en [`.env.example`](../.env.example). Los archivos `.env*` están ignorados por git, así que **no viajan con el código**: si se crea un proyecto de Vercel nuevo, hay que cargarlas a mano.

Después de cambiar una variable hay que hacer un **redeploy** para que tome el valor nuevo.

Ojo con `LEADS_SHEET_ENDPOINT`: si falta, el código no avisa. Simplemente no copia los leads a la planilla (ver [`leads.md`](leads.md)).

## Cuánto tarda en verse el contenido nuevo

Las páginas se regeneran cada **4 horas** (`export const revalidate = 14400` en `app/page.tsx`, `app/productos/[slug]/page.tsx` y `app/distribuidoras/[slug]/page.tsx`). Si publicás algo en Contentful, puede tardar hasta 4 horas en aparecer. Para verlo ya, hacé un redeploy en Vercel.

## Mover el repo a una org de GitHub

1. Instalar la GitHub App de Vercel en la org y darle acceso al repo (lo aprueba un admin de la org).
2. GitHub → *Settings → Transfer ownership* del repo.
3. Vercel → *Project → Settings → Git*: desconectar y volver a conectar con el repo nuevo.
4. Hacer un push de prueba y verificar que dispara un deploy.
5. Actualizar el remoto local: `git remote set-url origin git@github.com:<org>/eggpertise.git`.

El sitio ya publicado sigue funcionando durante la transferencia; solo pueden pausarse los deploys nuevos hasta el paso 3. El dominio, el DNS y las variables de entorno no cambian. Los repos de una org en Vercel requieren plan Pro.

## Si un deploy falla o el sitio se rompe

1. Vercel → *Deployments* → abrir el último y revisar el log de build.
2. Para volver atrás rápido: en un deploy anterior que funcionaba, *Promote to Production* (o *Instant Rollback*).
3. Los errores de runtime de las rutas `/api/*` se ven en *Logs* del proyecto.
