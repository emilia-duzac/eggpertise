---
name: sdd
description: >
  Flujo obligatorio de desarrollo guiado por especificación (SDD) para cambios en el sitio: investiga, compara alternativas y decide, planifica en etapas, implementa etapa por etapa (verifica, se autorrevisa, commit y push) y cierra con un PR. Usar cada vez que alguien pida agregar, cambiar, corregir o quitar algo del sitio (textos, imágenes, secciones, estilos, comportamiento), por pequeño que parezca. No se escribe código antes de completar las fases 1 a 3.
---

# SDD: desarrollo guiado por especificación

Todo cambio sigue **SDD**: primero se investiga y se especifica, después se planifica por etapas y recién entonces se implementa, revisándose en cada etapa. **No se escribe código antes de tener la especificación y el plan.** Aplica a todo pedido, incluso a los chicos (en un cambio mínimo, las fases 1 a 3 pueden ser de pocas líneas, pero no se saltean).

Los documentos de trabajo (investigación y plan) van en `docs/plans/<fecha>-<nombre-del-cambio>/` (por ejemplo `2026-11-23-banner-primavera/`), que está **ignorada por git**: son andamiaje temporal, no se suben. Sirven para retomar el trabajo si la sesión se interrumpe: dejá tildadas las etapas ya hechas.

## Fase 1. Entender e investigar

1. Clasificá el pedido y armá el requisito funcional (skill `traducir-pedido`). Hacé las preguntas que falten.
2. **Investigá el estado actual** sin cambiar nada: `git status` (si hay cambios ajenos sin guardar, avisá y no los pises), cómo está resuelto hoy lo que se toca, componentes y helpers reutilizables, el doc correspondiente de la tabla "Cuándo leer qué" de `CLAUDE.md`, y `docs/mapa-del-codigo.md`, el contenido en Contentful que interviene y qué otras páginas o secciones se verían afectadas.
3. Para investigaciones amplias podés delegar en subagentes de solo lectura; vos seguís siendo responsable de la conclusión.
4. Guardá el resultado en `investigacion.md`: estado actual, archivos involucrados, restricciones (reglas intocables de `CLAUDE.md`), riesgos y preguntas abiertas.

## Fase 2. Alternativas y decisión

1. Proponé **2 o 3 alternativas reales** (por ejemplo: resolverlo en Contentful vs. en código; reutilizar un componente vs. crear uno nuevo; librería vs. solución propia). Para cada una: qué implica, pros, contras, riesgo, esfuerzo y cómo afecta al mantenimiento.
2. **Elegí la mejor y justificala** con criterios del proyecto: simpleza, reutilización de lo existente, consistencia con la marca, riesgo para formularios/mails/leads, impacto en rendimiento y en la traducción automática.
3. Al usuario presentale la decisión **en lenguaje de negocio**: qué va a ver, qué se descartó y por qué. Si dos alternativas son equivalentes y la diferencia es de gusto o de contenido, preguntale; si la diferencia es técnica, decidí vos.
4. Guardá la especificación final (requisito + alternativa elegida + qué se descartó) en `especificacion.md`.

## Fase 3. Plan en etapas

1. Dividí la implementación en **etapas chicas, independientes y verificables**: cada una deja el sitio funcionando, se puede probar sola y tiene su propio criterio de terminado. Ordenalas por dependencia (primero lo que otras necesitan; las partes sensibles o de mayor riesgo, temprano).
2. Para cada etapa definí: objetivo, archivos que se tocan o crean, qué se verifica y qué mensaje de commit lleva.
3. Guardá el plan en `plan.md` como lista de etapas con casillas para tildar.
4. Mostrale al usuario un **resumen simple** del plan (etapas en lenguaje no técnico y cómo va a poder verlo) y esperá su "ok" antes de implementar. Si cambia el pedido, volvé a la fase que corresponda y actualizá los documentos.

## Fase 4. Implementación por etapas

Primero, preparación: actualizá `develop` y creá la rama de trabajo desde ahí (skill `publicar-cambio`). Verificá que exista `.env.local`; si no, avisá, **nunca inventes valores**.

Después, **por cada etapa del plan**, en orden:

1. Leé los archivos que vas a tocar y reutilizá lo existente (leé `docs/convenciones.md`). Si el cambio es visual, activá el skill `identidad-visual-eggpertise`.
2. Implementá solo lo de esa etapa. Si lo que encontrás no coincide con lo que decía el plan, **frená**, actualizá el plan y, si cambia lo que el usuario va a ver, consultalo.
3. **Verificá la etapa** (skill `verificar-cambio`): `npx tsc --noEmit`, `npm run lint` y, cuando corresponda, mirá el resultado en el navegador.
4. **Autorrevisión de la etapa:** seguí el skill `revisar-cambio` sobre tu propio `git diff` y corregí lo que encuentres.
5. **Commit y push de la etapa** a la rama de trabajo (skill `publicar-cambio`). Un push por etapa terminada, nunca con la etapa a medias ni con chequeos fallando.
6. Tildá la etapa en `plan.md` y seguí con la siguiente.

Si un chequeo falla por algo que **no causaste vos**, decilo con claridad y no lo "arregles" sin avisar. No avances de etapa si la anterior falló.

## Fase 5. Cierre

1. **Verificación final** de todo el cambio: `npm run lint`, `npx tsc --noEmit`, `npm run build`, revisión en celular, tablet y escritorio, y cada criterio de aceptación del requisito (skill `verificar-cambio`).
2. **Mostrale el resultado al usuario:** levantá `npm run dev`, dale la dirección (`http://localhost:3000`) indicando en qué página mirar, y pedí feedback. Iterá (cada ajuste es una etapa más, con su commit y push).
3. Cuando el usuario aprueba cómo se ve ("está bien", "dale", "me gusta"), ese es el ok: ejecutá solo el **PR único** con todo el trabajo, la revisión y el merge a `develop` (skill `publicar-cambio`), sin pedirle permisos técnicos ni usar jerga de Git.
4. **Documentá** si cambió algo que figura en `docs/` o en `CLAUDE.md`.
