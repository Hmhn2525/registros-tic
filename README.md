# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Configuración del proyecto

1. En instalaciones nuevas usa `supabase_schema.sql`; en proyectos existentes aplica, en orden, las migraciones de `supabase/migrations`.
2. Configura en Vercel las cinco variables documentadas en `.env.example`.
3. Aplica las variables a Production, Preview y Development según corresponda.
4. Realiza un nuevo despliegue; las variables `VITE_*` se incorporan durante la compilación.

La firma remota se procesa en `api/remote-signature.ts`. La clave
`SUPABASE_SECRET_KEY` se usa exclusivamente en esa función del servidor y nunca
debe copiarse a una variable que comience con `VITE_`, almacenarse en el navegador o
subirse al repositorio.
