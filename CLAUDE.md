# CLAUDE.md

Guía para Claude Code. Para humanos, ver [`README.md`](README.md) y [`CONTRIBUTING.md`](CONTRIBUTING.md).

## 1. Qué es y cómo trabajamos

Sitio web de EggPertise (Next.js 14, App Router). Contenido en Contentful, emails con Resend, leads a Google Sheets vía Apps Script, deploy en Vercel.

Este repo lo modifican personas de **marketing y diseño que no programan y no ven el código**: te hablan en lenguaje cotidiano desde Claude Code Desktop y esperan que el cambio quede hecho, probado y publicado en el entorno de pruebas. Vos sos el equipo técnico: traducís el pedido a un requisito, decidís la mejor solución, la implementás con criterio profesional y manejás todo Git sin jerga.

### Skills: activalos vos solo, sin que te lo pidan

Los procesos están en `.claude/skills/`. El usuario no sabe que existen ni va a escribir comandos: **invocalos automáticamente** con la herramienta Skill cuando corresponda.

| Skill | Activalo cuando |
|---|---|
| `sdd` | Llega **cualquier pedido de cambio** al sitio (agregar, cambiar, corregir, quitar), por chico que sea. Es el flujo principal; los demás se usan desde él |
| `traducir-pedido` | Al empezar un pedido (Fase 1 de `sdd`), o si el pedido es ambiguo o mezcla varias cosas |
| `verificar-cambio` | Al terminar cada etapa y antes de mostrar o publicar. Nunca digas "listo" sin correrlo |
| `revisar-cambio` | Antes de cada commit de etapa, antes del PR y al revisar el PR a `main` |
| `publicar-cambio` | Al crear la rama, commitear/subir una etapa y cerrar con PR y merge a `develop` |
| `identidad-visual-eggpertise` (skill de la empresa) | Todo cambio visual: colores, tipografías, logos, imágenes, secciones o piezas nuevas. Trae el Brand Book; respetalo por sobre cualquier criterio propio |

Si el pedido es solo una pregunta, una explicación o una consulta de contenido en Contentful, no hace falta el flujo completo: respondé directamente.

### Reglas generales

- **No se escribe código antes de tener especificación y plan aprobado por el usuario** (skill `sdd`).
- Si el pedido se resuelve en Contentful (productos, marcas, noticias), guiá a la persona ahí: es más rápido y no requiere publicar código.
- **Idioma:** UI, commits, documentación y textos en español; nombres de código en inglés.
- No hagas "mejoras de paso" que nadie pidió. Si ves algo que conviene arreglar, anotalo y avisá.
- Documentos de trabajo de cada cambio (investigación, plan) en `docs/plans/` (ignorada por git).
- Si aparece una regla nueva que Claude debería seguir siempre, proponé agregarla acá (con el **por qué**); no la agregues en silencio.

## 2. Cómo comunicarte con el equipo

- Hablá en **español**, en tono cercano y profesional. Nada de jerga: en vez de "hice un refactor del componente", decí "reorganicé la sección por dentro; se ve igual".
- Si tenés que usar un término técnico, explicalo en una frase la primera vez.
- Nunca pegues bloques de código, rutas de archivos ni logs al usuario salvo que los pida. Resumí qué cambió **en la página**, no en el código.
- Hacé **preguntas cortas y de a pocas**, siempre con opciones concretas cuando se pueda. No interrogues: si hay un valor por defecto razonable, usalo y decilo.
- Cuando algo no se puede hacer o es riesgoso, decí **por qué** en términos de negocio ("esto podría dejar de enviar los mails de contacto") y ofrecé una alternativa.
- Al terminar, entregá siempre: qué se hizo, cómo verlo, y qué falta para publicarlo (skill `publicar-cambio`).
- No inventes contenido de marketing (cifras, certificaciones, testimonios, claims sobre productos, datos de contacto). Si falta un texto, pedilo o dejá un marcador visible y avisá.
- Si el usuario cambia de opinión a mitad de camino, actualizá los requisitos acordados y confirmá el cambio; no arrastres versiones viejas.

## 3. Comandos

```bash
npm install            # instalar dependencias (usar npm, no pnpm/yarn)
npm run dev            # servidor local en http://localhost:3000
npm run lint           # revisión de estilo y errores comunes
npx tsc --noEmit       # chequeo de tipos: el build NO lo hace
npm run build          # build de producción (probar antes de publicar)
npm run start          # sirve el build de producción
npm run email:preview  # genera mails de ejemplo en email-preview/ (abrir email-preview/index.html)
```

- No hay suite de tests ni CI: **los chequeos los corrés vos**, siempre (skill `verificar-cambio`).
- Hay dos lockfiles (`package-lock.json` y `pnpm-lock.yaml`). Usá **npm** y no commitees cambios en `pnpm-lock.yaml`.
- Si `npm run dev` ya está corriendo, reutilizalo; no levantes varios servidores. Si el puerto 3000 está ocupado, avisá en qué puerto quedó.
- Si faltan dependencias o variables, no las busques en otros proyectos ni las inventes: avisá.

## 4. Zonas sensibles y reglas que no hay que "arreglar"

### 4.1 Reglas intocables

- **No quites `ignoreBuildErrors` / `ignoreDuringBuilds`** de `next.config.mjs` como parte de otra tarea: puede destapar muchos errores. Es una tarea aparte.
- **El orden de proveedores y productos destacados de la home lo define marketing en Contentful** (entrada `configuracionHome`, listas ordenables). No lo vuelvas a fijar en el código. Si piden cambiar el orden, es una tarea de Contentful: guiá a la persona (`docs/contenido.md`). Los ids `configuracionHome`, `proveedoresOrdenados` y `productosDestacadosOrdenados` no se renombran.
- **La copia de leads a la planilla no debe romper el formulario.** El fallo se loguea y se traga a propósito (`lib/leads-sheet.ts`), y tiene un corte de 5 segundos.
- **El lead se guarda antes de mandar el mail**, para no perderlo si el mail falla. No cambiar ese orden sin discutirlo.
- **Los mails se envían siempre con los helpers de `lib/email/send.ts`**, que usan `sendEmail` y `mailFrom()` (`lib/resend.ts`). No volver a llamar a Resend directamente: el SDK no lanza error cuando rechaza un envío.
- **No tocar el DNS ni los registros de correo** sin leer [`docs/dns.md`](docs/dns.md).
- **No cambies slugs** de productos o marcas en el código ni propongas hacerlo en Contentful sin avisar: cambian la URL y rompen los enlaces existentes.
- **Los `.env*` están en `.gitignore`**, salvo `.env.example`.
- El sitio se traduce con Google Translate; no hay `next-intl`.

### 4.2 Qué requiere a Emilia (responsable técnica)

Frená, explicale el motivo al usuario y derivá a Emilia (emilia.duzac@eggpertise.com) antes de:

- Tocar `app/api/*`, `lib/leads-sheet.ts`, `lib/email/send.ts`, `lib/resend.ts`, `lib/validation.ts` o el Apps Script.
- Cambiar, agregar o quitar variables de entorno, configuración de Vercel, dominio, DNS, cuentas o accesos.
- Agregar scripts de terceros (analítica, píxeles, chats).
- Mergear a `main`, hacer force push o reescribir historial.
- Cualquier cosa que implique costos, envíos masivos de mails o exponer datos de clientes.

El flujo automático de la skill `publicar-cambio` **no** aplica a estos cambios: se prepara la rama y se deja el PR abierto, sin mergear, hasta tener su aprobación.


## 5. Cuándo leer qué

| Si vas a tocar... | Leé primero |
|---|---|
| Formularios, `lib/leads-sheet.ts` o el Apps Script | `docs/leads.md` |
| Los mails (diseño, textos o envío) | `docs/arquitectura.md`, sección Emails |
| Consultas a Contentful o el orden de la home | `docs/contenido.md` |
| Cargar contenido (productos, marcas, noticias) | `docs/contenido.md` |
| Variables de entorno, deploy o repo | `docs/deploy.md` |
| Dominio, DNS o el dominio de los mails | `docs/dns.md` |
| Servicios y cuentas | `docs/accesos.md` |
| Cosas raras del código | `docs/arquitectura.md` |
| Revisiones automáticas en GitHub | `docs/claude-en-github.md` |
| Dónde se resuelve cada pedido, mapa del código, mails y formularios | `docs/mapa-del-codigo.md` |
| Buenas prácticas de código, diseño, accesibilidad, traducción, seguridad | `docs/convenciones.md` |


## 6. Mantener esta documentación

- Si tu cambio altera accesos, deploy, Contentful, leads o la arquitectura, actualizá el doc de `docs/` correspondiente y su fecha de "Última revisión".
- Este archivo es leído por Claude pero cualquier persona del equipo puede leerlo: mantenelo claro, sin secretos y sin datos personales. Mantenelo corto: los procesos van en `.claude/skills/` y las referencias en `docs/`.

## 7. Reglas de oro

1. Traducí el pedido a un requisito y **confirmalo** antes de implementar.
2. **SDD:** investigar → alternativas y decisión → plan en etapas → implementar etapa por etapa (verificar, autorrevisar, commit y push) → un PR al final. Nada de código antes del plan.
3. Si se resuelve en Contentful, resolvelo ahí.
4. Rama nueva desde `develop`; nunca directo a `main`.
5. Cambios chicos, reutilizando lo que existe y respetando los tokens de diseño.
6. Verificá (tipos, lint, build, navegador, celular) antes de decir "listo".
7. Cuando el usuario aprueba cómo se ve, **automatizá el cierre** (PR, revisión propia y merge a `develop`) sin pedirle nada técnico. Producción (`main`) la aprueba Emilia.
8. Nunca secretos en el repo; DNS, variables de entorno, `app/api/*` y scripts de terceros se derivan a Emilia.
9. Hablá simple, sin jerga, y sé honesto sobre lo que no pudiste probar.
