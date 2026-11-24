---
name: traducir-pedido
description: >
  Convierte un pedido informal de marketing o diseño, en lenguaje no técnico, en un requisito funcional claro y confirmado con el usuario antes de tocar código. Usar al recibir cualquier pedido de cambio en el sitio (primer paso de sdd), y cuando el pedido sea ambiguo, mezcle varias cosas o no se sepa si se resuelve en Contentful o en código.
---

# De pedido informal a requisito funcional

Antes de escribir código, convertí el pedido en un requisito. No saltees este paso, ni siquiera para cambios "chicos": es lo que evita retrabajo.

## Clasificá el pedido

| Tipo | Ejemplos | Dónde se resuelve |
|---|---|---|
| **Contenido** | Nuevo producto, nueva marca, nueva noticia, cambiar una ficha, subir fotos de productos | **Contentful**, no código. Guiá a la persona paso a paso; ver `docs/contenido.md` |
| **Texto / imagen** | Cambiar un título, reemplazar una foto del hero, corregir un párrafo fijo | Código (componentes en `components/` y `public/`) |
| **Estilo / diseño** | Colores, tipografías, espaciados, cómo se ve en celular | Código (`app/globals.css` y Tailwind en los componentes) |
| **Sección o página nueva** | Banner, sección de prensa, página de campaña | Código (`app/` y `components/`) |
| **Comportamiento** | Un botón nuevo, un modal, un enlace a WhatsApp con mensaje | Código |
| **Formularios, mails, leads** | Cambiar campos, textos de un mail, destinatarios | Código **sensible**: seguí las reglas de `CLAUDE.md` (reglas intocables y mails/formularios en `docs/mapa-del-codigo.md`) |
| **Infraestructura** | Dominio, DNS, variables de entorno, deploy, cuentas | **No lo hagas**: derivá a Emilia (ver "Qué requiere a Emilia" en `CLAUDE.md`) |
| **Analítica / terceros** | Google Tag Manager, píxeles, chats | Código sensible: pedí el ID/snippet oficial y confirmá con Emilia |

Si el pedido se puede resolver en Contentful, **decilo primero**: es más rápido, no pasa por el equipo técnico y no requiere publicar código.

## Armá el requisito

Reformulá el pedido con esta plantilla y **mostrásela al usuario para que la confirme** antes de implementar (en lenguaje simple, no como ticket):

```
Qué se quiere lograr:   <objetivo de negocio en una frase>
Dónde se ve:            <página/sección; escritorio, celular o ambos>
Cómo debe verse/funcionar:
  - <comportamiento 1, observable y verificable>
  - <comportamiento 2>
Contenido:              <textos, imágenes, enlaces exactos; quién los provee>
Qué NO cambia:          <lo que debe quedar igual>
Criterios de aceptación:
  - [ ] <cosa que se puede comprobar mirando la página>
  - [ ] Se ve bien en celular y escritorio
  - [ ] Nada de lo existente se rompió
```

## Preguntas que conviene hacer (solo las que falten)

- **Contenido:** ¿Tenés el texto final y las imágenes? ¿Qué formato/tamaño tienen? ¿En qué idioma está? (El sitio base está en español; ver `docs/convenciones.md`.)
- **Ubicación:** ¿Dónde exactamente? ¿Antes o después de qué sección? ¿Aparece en todas las páginas o solo en una?
- **Dispositivos:** ¿Importa más el celular o el escritorio? ¿Hay un diseño (Figma, imagen) para seguir?
- **Alcance:** ¿Es algo permanente o temporal (una campaña con fecha de fin)?
- **Enlaces y acciones:** ¿A dónde lleva cada botón? ¿Se abre en la misma pestaña?
- **Medición:** ¿Hay que medir clics o conversiones?

Si el usuario manda una imagen o un diseño, usalo como fuente de verdad visual y comparalo contra el resultado antes de dar el cambio por terminado.

## Alcance y tamaño

- Si el pedido mezcla varias cosas, **dividilo** en cambios independientes (uno por rama y por PR) y proponé el orden.
- Si es grande o ambiguo, proponé un plan corto en pasos y esperá el ok antes de empezar.
- No hagas "mejoras de paso" que nadie pidió (renombrar archivos, reformatear, actualizar dependencias). Si ves algo que conviene arreglar, **anotalo y avisá** en vez de hacerlo.
