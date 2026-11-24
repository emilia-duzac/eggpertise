# Mapa del código y pedidos frecuentes

Referencia rápida para saber dónde se resuelve cada pedido. **Última revisión:** 2026-11-23.

## Mapa rápido del código

```
app/page.tsx                    home (arma las secciones de components/)
app/productos/[slug]/           ficha de producto
app/distribuidoras/[slug]/      página de cada fabricante
app/api/*                       formularios (contacto, info técnica, ficha) → ZONA SENSIBLE
app/globals.css                 colores y tokens de diseño
components/                     secciones de la home, modales, WhatsApp
components/ui/                  componentes base (shadcn/ui)
lib/contentful.ts               consultas a Contentful (el orden de la home viene de Contentful)
lib/email/                      diseño y envío de mails
public/                         imágenes y archivos estáticos
docs/                           documentación del proyecto
```

## Pedidos frecuentes: dónde se resuelven

| Pedido habitual | Cómo encararlo |
|---|---|
| "Cambiar el texto del banner principal" | `components/hero-section.tsx` |
| "Agregar un producto / marca / noticia" | Contentful (no código); guiar a la persona |
| "Cambiar el orden de los proveedores o productos de la home" | Contentful (no código): entrada `configuracionHome`; guiar con el instructivo de `docs/contenido.md` |
| "Cambiar el número o mensaje de WhatsApp" | `components/whatsapp-button.tsx` y `lib/email/contact.ts` (para mails) |
| "Cambiar el pie de página o los datos de contacto" | `components/footer.tsx`, `components/contact-section.tsx` y `lib/email/contact.ts` |
| "Agregar una sección nueva a la home" | Componente nuevo en `components/` + registrarlo en `app/page.tsx` |
| "Cambiar un color o tipografía" | Token en `app/globals.css`, no en cada componente |
| "Que el mail de contacto diga otra cosa" | `lib/email/mails/` y `lib/email/contact.ts` (sección "Mails y formularios" de este documento) |


## Mails y formularios (cuando sí se pueden tocar)

- **Las reglas de diseño están centralizadas.** Colores, fuentes y tamaños, en `lib/email/theme.ts`. Datos de contacto, textos compartidos y enlaces, en `lib/email/contact.ts`. Los mails y los componentes no llevan valores de diseño ni textos repetidos sueltos: si algo se usa en más de un lugar, va a uno de esos dos archivos.
- **Los cuerpos de los formularios se validan con `zod`** (`lib/validation.ts`).
- Al cambiar un formulario o un mail: probá **los tres formularios** (contacto, info técnica, ficha técnica) o, si no hay variables, generá la vista previa con `npm run email:preview` y revisala. Detalle: `docs/leads.md` y `docs/arquitectura.md` (sección Emails).
- Los mails usan estilos en línea, fuente Lato (con Calibri/Source Sans 3 de respaldo), sin fuentes web ni SVG: lo que funciona en una página web puede no funcionar en Gmail/Outlook.
