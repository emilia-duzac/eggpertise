---
name: verificar-cambio
description: >
  Checklist de calidad para dar un cambio por terminado: tipos, lint, build, revisión en el navegador, responsive, que lo existente siga andando y criterios de aceptación. Usar al terminar cada etapa de implementación y en la verificación final, antes de mostrar el resultado o abrir el PR.
---

# Verificar un cambio

Un cambio **no está terminado** hasta que cumple todo esto:

1. `npx tsc --noEmit` sin errores nuevos. (El proyecto puede tener errores previos: compará contra antes de tu cambio y reportá solo los tuyos.)
2. `npm run lint` sin errores nuevos.
3. `npm run build` compila. Un build verde **no** garantiza que no haya errores de tipos (ver reglas intocables).
4. **Se miró en el navegador** con `npm run dev`: la página carga, no hay errores en consola, el cambio se ve como se pidió.
5. **Responsive:** revisado en ancho de celular (~375 px), tablet (~768 px) y escritorio (≥1280 px). Sin scroll horizontal ni textos cortados.
6. **Lo existente sigue andando:** navegación, enlaces, el menú, el botón de WhatsApp y la página que se tocó con sus vecinas.
7. **Criterios de aceptación** del requisito (skill `traducir-pedido`) tildados uno por uno.
8. Si es un cambio visual importante, compará con el diseño/imagen que dio el usuario.

Si no pudiste verificar algo (por ejemplo, no hay variables de entorno), **decilo explícitamente** en vez de asumir que anda. Nunca digas "listo" sobre algo que no probaste.
