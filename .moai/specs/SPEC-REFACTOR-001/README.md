# SPEC-REFACTOR-001: Sistema de Autenticación

## Vista Rápida

**Especificación técnica para el módulo de autenticación existente de LoyaltyVibes**

## Contenido

Este directorio contiene la documentación completa del sistema de autenticación:

- **spec.md**: Especificación técnica completa con requisitos EARS
- **implementation.md**: Plan de implementación detallado (DDD approach)
- **README.md**: Este archivo

## Resumen Ejecutivo

### ¿Qué es?

LoyaltyVibes cuenta con un sistema de autenticación funcional implementado con:
- **Supabase Auth**: Gestión de sesiones y usuarios
- **React Hook Form + Zod**: Validación de formularios
- **Role-based Access Control**: 3 roles (customer, staff, admin)
- **Profile System**: Extensión de auth.users con datos de lealtad

### ¿Por qué REFACTOR?

Este no es un feature nuevo, sino una especificación para:
1. **Documentar** el comportamiento existente
2. **Crear pruebas** que protejan el sistema
3. **Mejorar** seguridad y UX gradualmente
4. **Validar** calidad y coverage

### Ubicación del Código

```
src/features/auth/
├── types.ts                    # Tipos y schemas Zod
├── services/
│   ├── authService.ts          # Operaciones de autenticación
│   └── profileService.ts       # Gestión de perfiles
├── hooks/
│   ├── useAuth.ts              # Hook principal de auth
│   └── useProfile.ts           # Hook de perfil con realtime
└── components/
    └── AuthGuard.tsx           # Protección de rutas

src/app/(auth)/
├── login/page.tsx              # Página de login
└── register/page.tsx            # Página de registro
```

## Funcionalidades Actuales

### ✅ Implementado

| Funcionalidad | Estado | Ubicación |
|---------------|--------|-----------|
| Registro de usuarios | ✅ Funcional | `/register` |
| Login con email/contraseña | ✅ Funcional | `/login` |
| Gestión de sesiones | ✅ Funcional | `useAuth` |
| Redirección por rol | ✅ Funcional | `useAuth` |
| Protección de rutas | ✅ Funcional | `AuthGuard` |
| Perfil con realtime | ✅ Funcional | `useProfile` |
| Validación Zod | ✅ Funcional | `types.ts` |

### ⏳ Por Implementar

| Funcionalidad | Prioridad | Esfuerzo |
|---------------|-----------|----------|
| Pruebas unitarias | Alta | 2 días |
| Pruebas de integración | Alta | 1 día |
| Rate limiting | Alta | 2 horas |
| Recuperación de contraseña | Alta | 4 horas |
| Verificación de email | Media | 2 horas |
| Indicador de fortaleza de contraseña | Media | 3 horas |
| Logout en todos los dispositivos | Baja | 3 horas |

## Requisitos EARS Resumen

### Ubicuidad (WHEN) - Gestión de Sesiones
- **U-01**: Sesión persiste al recargar
- **U-02**: Sincronización de estado de auth
- **U-03**: Actualización realtime del perfil

### Respuesta (WHERE) - Redirecciones
- **R-01**: Redirección por rol post-login
- **R-02**: Protección de rutas autenticadas
- **R-03**: Protección por rol específico

### Comportamiento (WHILE) - Interacción
- **C-01**: Prevención de envíos múltiples
- **C-02**: Validación en tiempo real
- **C-03**: Limpieza de errores

### Eventos (IF) - Condiciones
- **E-01**: Registro exitoso con valores por defecto
- **E-02**: Error de credenciales
- **E-03**: Logout y redirección
- **E-04**: Error de carga de perfil

### Acción (HERE) - Operaciones
- **A-01**: Creación de usuario en Supabase
- **A-02**: Creación de perfil personalizado
- **A-03**: Integración de Supabase client

## Plan de Trabajo Recomendado

### Fase 1: Análisis y Documentación (Semana 1)
1. ✅ Leer SPEC completo (`spec.md`)
2. ✅ Revisar código existente
3. ✅ Entender flujos de usuario
4. ⏳ Documentar casos de uso

### Fase 2: Pruebas (Semana 1-2)
1. ⏳ Configurar Vitest
2. ⏳ Escribir pruebas unitarias
3. ⏳ Escribir pruebas de integración
4. ⏳ Alcanzar 85% coverage

### Fase 3: Mejoras de Seguridad (Semana 2)
1. ⏳ Implementar rate limiting
2. ⏳ Validación de contraseñas comunes
3. ⏳ Revisión de políticas RLS

### Fase 4: Mejoras de UX (Semana 2-3)
1. ⏳ Indicador de fortaleza de contraseña
2. ⏳ Checklist de requisitos
3. ⏳ Mejorar mensajes de error

### Fase 5: Funcionalidades Adicionales (Semana 3)
1. ⏳ Recuperación de contraseña
2. ⏳ Verificación de email
3. ⏳ Logout en todos los dispositivos

## Cómo Usar Este SPEC

### Para Desarrolladores

**Antes de modificar el código de auth:**
1. Leer `spec.md` completo
2. Revisar requisitos EARS
3. Entender el modelo de datos
4. Revisar el plan de implementación

**Para agregar funcionalidad:**
1. Verificar si ya está especificado
2. Si no, agregar al SPEC
3. Escribir pruebas primero
4. Implementar con pruebas pasando

**Para corregir bugs:**
1. Reproducir el bug
2. Escribir prueba que falle
3. Corregir el código
4. Verificar que pase la prueba

### Para QA/Testers

**Casos de prueba derivados:**
- Cada requisito EARS puede convertirse en test case
- Ver sección "Casos de Uso" en spec.md
- Revisar criterios de aceptación (CA-01 a CA-07)

**Pruebas manuales:**
1. Flujo completo de registro
2. Flujo completo de login
3. Redirección por rol
4. Protección de rutas
5. Persistencia de sesión
6. Logout

### Para Product Owners

**Para solicitar cambios:**
1. Revisar funcionalidades actuales
2. Identificar gaps en requirements
3. Proponer nuevo requisito EARS
4. Evaluar impacto en plan de implementación

## Métricas de Éxito

### Cobertura de Pruebas
- Objetivo: >= 85%
- Actual: 0% (por implementar)

### Calidad de Código
- TypeScript: Sin errores ✅
- ESLint: Sin warnings ✅
- Tests: Por implementar ⏳

### Performance
- Login time: < 2s
- Registration time: < 3s
- Session load: < 1s

### Seguridad
- RLS: Habilitado ✅
- Password requirements: Implementados ✅
- Rate limiting: Por implementar ⏳

## Dependencias

### Externas
```json
{
  "@supabase/supabase-js": "^2.45.0",
  "@supabase/ssr": "^0.5.2",
  "react-hook-form": "^7.53.0",
  "@hookform/resolvers": "^3.9.0",
  "zod": "^3.23.8"
}
```

### Internas
- `src/shared/lib/supabase/client.ts`: Cliente de Supabase
- `src/shared/lib/supabase/server.ts`: Server client

## Configuración Requerida

### Variables de Entorno
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Base de Datos
- Tabla `profiles` creada
- RLS habilitado
- Índices configurados
- Triggers de `updated_at` activos

## Referencias

### Documentación
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

### Archivos Relacionados
- `/config/workspace/loyaltyvibes/supabase/migrations/001_profiles.sql`
- `/config/workspace/loyaltyvibes/src/middleware.ts`

## Contacto

**Mantenimiento de SPEC**: Equipo de Desarrollo
**Aprobaciones**: Tech Lead, Product Owner, Security Lead

---

**Versión**: 1.0
**Última actualización**: 2026-02-02
**Estado**: Pendiente de aprobación
