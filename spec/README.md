# spec/ — Spec Driven Development (Sistema de Soporte TIC PWA)

> Documentación de arquitectura y guías de desarrollo impulsado por especificación (SDD) para el proyecto **PWA Registro de Soporte TIC y Captura de Evidencias**.
> 
> **Regla de oro para cualquier Agente de IA o Desarrollador:** Antes de implementar nuevo código o modificar el sistema, se debe leer la `constitution/`, escribir o consultar la `feature/` correspondiente (`spec.md` -> `plan.md` -> `tasks.md`), y solo entonces modificar el código fuente en `src/`.

---

## Estructura de Especificación

```text
c:/TIC/Registros_tic/spec/
├── constitution/                        ← Reglas estables y principios del proyecto
│   ├── mission.md                       ← Propósito del sistema, usuarios y qué NO es
│   ├── tech-stack.md                    ← Stack tecnológico, límites duros y convenciones
│   └── roadmap.md                       ← Historial de features y próximas etapas
└── features/                            ← Módulos y funcionalidades del proyecto
    ├── 001-pwa-captura-firmas/          ← Feature inicial (Captura de Firma, PWA, Supabase, Looker)
    │   ├── spec.md                      ← Especificación del usuario y criterios de aceptación
    │   ├── plan.md                      ← Plan técnico de implementación
    │   └── tasks.md                     ← Registro de tareas completadas y verificación
    └── 002-sincronizacion-offline-auto/ ← Próxima feature planificada
```

---

## Flujo de Trabajo con Agentes de IA

1. **Constitución:** La `constitution/` manda. Ninguna solución técnica puede violar `tech-stack.md` ni extender el alcance fuera de `mission.md`.
2. **Crear Feature:** Toda nueva funcionalidad requiere una carpeta en `features/NNN-nombre-feature/`.
3. **Paso 1 (Spec):** Redactar `spec.md` con los criterios de aceptación medibles.
4. **Paso 2 (Plan):** Redactar `plan.md` justificando las decisiones técnicas y afectación de archivos.
5. **Paso 3 (Ejecución y Verificación):** Ejecutar tareas en `tasks.md`, validar compilación (`npm run build`), y mover el estado a `Hecho ✅` en `roadmap.md`.
