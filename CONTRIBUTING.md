# Contribuir

## Preparar el entorno

```bash
npm install
cp .env.example .env.local   # completá los valores (ver docs/accesos.md)
npm run dev
```

## Ramas

Hasta ahora se commiteaba directo a `main`. Para trabajar con más gente se acuerda:

- Una rama por cambio, con prefijo: `feat/*`, `fix/*`, `refactor/*`, `docs/*`, `chore/*`.
  Ejemplos: `feat/agregar-seccion-prensa`, `fix/formulario-contacto`, `docs/actualizar-readme`.
- Se integra a `main` por Pull Request. `main` es lo que Vercel publica en producción
  (PENDIENTE: confirmar al tener acceso a Vercel), así que **no se pushea directo**.
- Se borra la rama remota después de mergear.

No hay CI que lo verifique. Si se quiere forzar, se puede agregar una *branch
protection rule* en GitHub (*Settings → Branches*).

## Commits

Se sigue [Conventional Commits](https://www.conventionalcommits.org/), como el
historial existente. El scope es opcional.

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
- Si el cambio toca formularios o leads, probar **los tres formularios** y confirmar
  que llega el email y aparece la fila en la planilla (ver `docs/leads.md`).
- Si el cambio agrega o modifica una variable de entorno, actualizar `.env.example`
  y avisar para cargarla en Vercel.

## Antes de abrir el PR

No hay CI ni tests. Revisar a mano:

```bash
npm run lint
npx tsc --noEmit   # el build no chequea tipos
npm run build
```

## Qué documentar

Si cambia algo de accesos, deploy, Contentful o el flujo de leads, actualizar el documento correspondiente en `docs/` y su fecha de "Última revisión". Nunca poner secretos ni credenciales en el repo ni en los docs.
