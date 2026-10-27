# Contribuir

## Preparar el entorno

```bash
npm install
cp .env.example .env.local   # completá los valores (ver docs/accesos.md)
npm run dev
```

## Ramas

El flujo es:

```
rama de trabajo ──PR──► develop ──PR──► main
                      (se prueba)      (producción)
```

- Una rama por cambio, con prefijo: `feat/*`, `fix/*`, `refactor/*`, `docs/*`, `chore/*`. Ejemplos: `feat/agregar-seccion-prensa`, `fix/formulario-contacto`, `docs/actualizar-readme`.
- Los cambios entran a **`develop`** por Pull Request. Vercel genera un preview de la rama y de `develop`, que sirve para probar antes de pasar a producción.
- De `develop` a **`main`** también va por Pull Request. `main` es lo que Vercel publica en producción (`www.eggpertise.com`), así que **no se pushea directo**.
- Se borra la rama remota después de mergear.

No hay CI que lo verifique. Si se quiere forzar, se puede agregar una *branch protection rule* en GitHub (*Settings → Branches*).

Dos cosas a tener en cuenta con Vercel (detalle en [`docs/deploy.md`](docs/deploy.md)):
- Un preview no tiene las variables de Production: los formularios muestran un error y no tocan la planilla real. Es lo esperado.
- Si el contenido de `main` es idéntico al de un commit ya construido, Vercel no genera un deploy nuevo de Production. En ese caso hay que hacer un *Redeploy* eligiendo Production.

## Commits

Se sigue [Conventional Commits](https://www.conventionalcommits.org/), como el historial existente. El scope es opcional.

```
<tipo>(<scope>): <descripción>

feat(home): ordenar marcas y productos destacados
fix(forms): evitar que Google Translate rompa el mensaje de éxito
docs: agregar manual de accesos
chore: ignorar archivos .env
```

Tipos habituales: `feat`, `fix`, `docs`, `refactor`, `chore`.

## Pull Requests

- Chicos y enfocados: si la tarea es grande, dividirla.
- Describir qué cambia y por qué, y cómo se probó.
- Si el cambio toca formularios o leads, probar **los tres formularios** y confirmar que llega el email y aparece la fila en la planilla (ver `docs/leads.md`).
- Si el cambio agrega o modifica una variable de entorno, actualizar `.env.example` y avisar para cargarla en Vercel.

## Antes de abrir el PR

No hay CI ni tests. Revisar a mano:

```bash
npm run lint
npx tsc --noEmit   # el build no chequea tipos
npm run build
```

## Qué documentar

Si cambia algo de accesos, deploy, Contentful o el flujo de leads, actualizar el documento correspondiente en `docs/` y su fecha de "Última revisión". Nunca poner secretos ni credenciales en el repo ni en los docs.
