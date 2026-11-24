---
name: revisar-cambio
description: >
  Autorrevisión del diff propio con la exigencia de un compañero senior: seguridad, reglas del proyecto, correctitud, cambios ajenos al pedido, convenciones, accesibilidad y traducción. Usar al terminar cada etapa (antes del commit), antes de abrir el PR a develop y al revisar el PR de develop a main.
---

# Revisar un cambio

Revisá `git diff` (o el diff del PR) completo, archivo por archivo, sin saltear los que parecen simples. No leas más de lo necesario.

## Qué mirar, en orden de prioridad

1. **Seguridad y privacidad:** secretos o valores reales en el diff; datos de visitantes sin `escapeHtml`/`safeHref` en mails; datos de producto tomados del request en vez de Contentful; variables sensibles expuestas al navegador (`NEXT_PUBLIC_*`); datos personales de clientes.
2. **Reglas intocables de `CLAUDE.md`:** orden de la home, orden lead-antes-que-mail, helpers de `lib/email/send.ts`, `next.config.mjs`, slugs, DNS, zonas que requieren a Emilia.
3. **Correctitud:** que haga exactamente lo del requisito y cumpla cada criterio de aceptación; casos borde (contenido vacío, textos largos, imagen faltante, Contentful sin datos, lista vacía); estados de carga y error.
4. **Alcance:** que no haya cambios ajenos al pedido (reformateos, archivos sueltos, imágenes pesadas, `.env*`, `email-preview/`, `docs/plans/`, lockfile de pnpm).
5. **Convenciones** (`docs/convenciones.md`): reutilización de componentes y tokens de diseño, sin colores ni medidas sueltas, sin números ni textos mágicos, sin `any` ni `@ts-ignore`, `"use client"` solo si hace falta.
6. **Accesibilidad y SEO:** `alt` en imágenes, jerarquía de títulos, contraste, teclado, `metadata` en páginas nuevas.
7. **Traducción automática:** textos como texto real (no en imágenes), `translate="no"` en marcas, frases no partidas en nodos sueltos.
8. **Rendimiento:** imágenes livianas y con dimensiones, sin librerías ni scripts innecesarios.
9. **Claridad:** código sobrante, `console.log`, comentarios que repiten el código, duplicación evitable.

## Cómo reportar y actuar

- Anotá cada hallazgo con archivo y línea, el problema y la corrección concreta.
- Si un patrón se repite, mencionalo una vez con todas las ubicaciones.
- **Corregí los hallazgos vos mismo** (a diferencia de una revisión externa), re-verificá con el skill `verificar-cambio` y repetí la revisión sobre lo corregido.
- Si un hallazgo no se puede resolver sin decidir algo de negocio, planteáselo al usuario en lenguaje simple.
- En el PR a `main`, revisá el conjunto acumulado de cambios de `develop`, no solo el último.
