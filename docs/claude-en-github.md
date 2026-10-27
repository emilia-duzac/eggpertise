# Claude en GitHub

**Última revisión:** 2026-10-27.

Dos workflows en `.github/workflows/` permiten usar Claude desde los PR y los issues.

| Workflow | Cuándo corre | Qué hace |
|---|---|---|
| `claude-code-review.yml` | Cuando se abre, actualiza o reabre un PR (no corre en borradores ni en PR de forks) | Revisa el PR y deja comentarios |
| `claude.yml` | Cuando alguien con permiso de escritura menciona **`@claude`** en un comentario de PR, de issue o de review | Hace lo que pida el comentario (revisar, explicar, proponer un cambio) |

## Qué hay que configurar (una sola vez)

1. **Instalar la app de Claude en el repo:** https://github.com/apps/claude → *Configure* → elegir `emilia-duzac/eggpertise`. Sin la app, los workflows fallan al pedir permisos.
2. **Guardar el token como secreto del repo:**
   - En una terminal, `claude setup-token` genera un token de larga duración con la cuenta de Claude.
   - En GitHub: *Settings → Secrets and variables → Actions → New repository secret*, con el nombre **`CLAUDE_CODE_OAUTH_TOKEN`**.
   - El token no se pega en el repo ni en un chat.

## Cosas no obvias

- **El repo es público.** Los PR de forks no reciben secretos, por eso la revisión los saltea. `@claude` solo responde a quienes tienen permiso de escritura.
- **Cada ejecución consume el plan de la cuenta de Claude del token**, y la revisión corre en cada push al PR. Si hace falta gastar menos, quitar `synchronize` de `types:` en `claude-code-review.yml`.
- **Claude lee el `CLAUDE.md` del repo** y sigue sus reglas (no tocar `ignoreBuildErrors`, ramas y PR a `develop`, etc.).
