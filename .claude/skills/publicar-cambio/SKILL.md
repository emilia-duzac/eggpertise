---
name: publicar-cambio
description: >
  Maneja Git sin jerga para personas no técnicas: rama de trabajo, commit y push por etapa, Pull Request único, revisión propia, merge a develop y paso a producción. Usar al crear la rama, al subir una etapa terminada y al cerrar un cambio aprobado por el usuario.
---

# Git, ramas y publicación

El usuario no usa Git: lo manejás vos, explicándolo en términos simples ("guardé tus cambios en una versión aparte para revisarlos antes de publicar").

## Ramas

```
rama de trabajo ──PR──► develop ──PR──► main
                      (se prueba)      (producción)
```

- **Nunca trabajes ni pushees directo en `main` ni en `develop`.**
- Una rama por cambio, creada desde `develop` actualizado, con prefijo: `feat/*`, `fix/*`, `refactor/*`, `docs/*`, `chore/*`. Nombre corto y descriptivo en minúsculas con guiones: `feat/banner-campana-primavera`.
- Si ya estás en una rama de trabajo del mismo tema, seguí en ella; si es de otro tema, creá una nueva.
- Si hay muchas sesiones activas, utilizá worktrees.

## Commits

- Conventional Commits en español: `feat(home): agregar banner de campaña`, `fix(forms): ...`, `docs: ...`, `style(...)`, `refactor(...)`, `chore: ...`.
- Un commit = una idea. Mensaje que explique **qué y por qué**, no cómo.
- Antes de commitear: revisá `git diff` y que no entre nada que no corresponda (archivos sueltos, `.env*`, `email-preview/`, `node_modules`, imágenes pesadas sin querer).
- Nunca uses `--no-verify`, `git push --force` ni `git reset --hard`. No borres ramas que no sean la de trabajo propia ya mergeada.
- **Un commit y un push por cada etapa del plan terminada** (Fase 4 del skill `sdd`), a la rama de trabajo, sin pedir permiso: son versiones intermedias en una rama aparte que no afecta al sitio. Nunca un único commit enorme.
- **Nunca** agregues líneas `Co-Authored-By: Claude` (ni equivalentes) a commits ni a descripciones de PR. Es una decisión del equipo.

## Pull Requests: flujo automático hasta `develop`

El usuario no conoce estos términos ni tiene que conocerlos. Una vez que aprobó el resultado (Fase 5 del skill `sdd`), **hacé todo esto sin pedir confirmaciones técnicas**:

1. La rama ya está subida (un push por etapa). Abrí **un único PR** hacia `develop` con todo el trabajo (usá `gh`).
2. **Revisá el PR vos mismo** (podés usar `/code-review`) como lo haría un compañero exigente: correctitud, seguridad, reglas de `CLAUDE.md`, que no se haya colado nada ajeno (seguí el skill `revisar-cambio`). Corregí lo que encuentres y volvé a verificar (skill `verificar-cambio`).
3. Si la revisión queda limpia, `npm run lint`, `npx tsc --noEmit` y `npm run build` pasan y el preview de Vercel compiló sin error (`gh pr checks`), **mergeá a `develop`** y borrá la rama de trabajo ya mergeada.
4. Si algo falla y no podés resolverlo, **no mergees**: explicale al usuario el problema en términos simples y qué opciones hay.
5. Contale al usuario, en lenguaje simple, que el cambio quedó en el entorno de pruebas y pasale el enlace al preview si lo hay.

**Pasar a producción (`main`):**

- Los cambios se pueden acumular en `develop` antes de pasar a producción. Claude puede abrir el PR de `develop` a `main`, revisarlo de nuevo con la misma exigencia y dejarlo listo.
- **El merge a `main` lo aprueba Emilia** (responsable técnica): es lo que ven los clientes y las personas de marketing y diseño no pueden juzgar el código. Avisale al usuario que quedó pendiente de esa aprobación; no mergees a `main` por tu cuenta.
- Usá la cuenta de GitHub `emilia-duzac` (EggPertise) salvo que el usuario indique otra.

Descripción del PR, en español y en lenguaje comprensible para no técnicos:

```
## Qué cambia
<para quien lo ve en el sitio>

## Por qué
<objetivo de negocio / pedido original>

## Cómo se probó
- [ ] npm run lint
- [ ] npx tsc --noEmit
- [ ] npm run build
- [ ] Revisado en celular y escritorio (qué páginas)

## Riesgos / pendientes
<qué podría afectar, qué falta cargar en Contentful o en Vercel>
```

## Publicación y qué ve el usuario

- Vercel genera un **preview** automático de cada rama y PR (protegido por login de Vercel). Pasale el enlace al usuario cuando exista.
- En el preview, **los formularios muestran error a propósito** (no tiene las variables de Production). No es un bug; avisalo.
- El contenido de Contentful puede tardar hasta 4 horas en verse (ISR). No lo trates como un error.
- Detalle y trampas del deploy: `docs/deploy.md`.
