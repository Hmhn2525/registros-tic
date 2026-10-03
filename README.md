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
2. Configura en Vercel las cuatro variables documentadas en `.env.example`.
3. Aplica las variables a Production, Preview y Development según corresponda.
4. Realiza un nuevo despliegue; las variables `VITE_*` se incorporan durante la compilación.

La firma remota se procesa en `api/remote-signature.ts`. La clave
`SUPABASE_SECRET_KEY` se usa exclusivamente en esa función del servidor y nunca
debe copiarse a una variable que comience con `VITE_`, almacenarse en el navegador o
subirse al repositorio.

## Copia local saneada (sin publicación)

Usar npm y Node 22.12 o posterior compatible. Instalar con npm ci, revisar con npm run lint y compilar con npm run build.

Sin variables Supabase la interfaz usa usuarios y activos ficticios y conserva los tickets locales; no hay sincronización automática. La cola existente del navegador no se elimina: para una demostración usar un perfil de navegador nuevo o separado. No copiar credenciales del sistema real.

Para una base de demostración nueva y aislada, ejecutar supabase_schema.sql y después supabase/seed.sql mediante una conexión local/de desarrollo. Las migraciones actuales son cambios incrementales, no un esquema inicial completo. El esquema sigue teniendo permisos anónimos y firmas públicas: no usarlo con datos reales.

La API remota requiere un entorno que ejecute api/remote-signature.ts; vite dev y vite preview solo sirven el frontend. No se verificó un despliegue remoto.

Consultar docs/project-status.md, docs/reporting.md y docs/duplicate-comparison.md. El historial Git pendiente de saneamiento no debe publicarse ni exportarse junto con una demo.
