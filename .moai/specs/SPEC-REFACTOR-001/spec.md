# SPEC-REFACTOR-001: Sistema de Autenticación - Login, Registro y Sesiones

## Metadatos

| Campo | Valor |
|-------|-------|
| **ID** | SPEC-REFACTOR-001 |
| **Dominio** | REFACTOR |
| **Prioridad** | Alta |
| **Estado** | Pendiente |
| **Creado** | 2026-02-02 |
| **Tech Stack** | Next.js 14, TypeScript, Supabase, React Hook Form, Zod |
| **Ubicación** | `/src/features/auth/` |

## Resumen Ejecutivo

Especificación técnica para el sistema de autenticación existente de LoyaltyVibes. El módulo actual implementa login, registro y gestión de sesiones utilizando Supabase Auth con integración de perfiles de usuario personalizados. Este documento establece los requisitos formales para pruebas, validación y mejoras futuras del sistema.

## Contexto del Negocio

LoyaltyVibes es una plataforma de lealtad para restaurantes y hoteles en San Cristóbal de Las Casas, México. El sistema de autenticación permite:

- **Clientes**: Acceder a su wallet de puntos y historial de transacciones
- **Staff**: Escanear códigos QR y registrar visitas
- **Admin**: Gestionar dashboard administrativo

### Roles de Usuario

| Rol | Descripción | Redirect Post-Login |
|-----|-------------|---------------------|
| `customer` | Cliente final que acumula puntos | `/wallet` |
| `staff` | Empleado que escanea códigos | `/scanner` |
| `admin` | Administrador del sistema | `/dashboard` |

## Arquitectura Actual

### Estructura de Archivos

```
src/features/auth/
├── types.ts                    # Tipos y schemas de validación
├── services/
│   ├── authService.ts          # Operaciones de autenticación
│   └── profileService.ts       # Gestión de perfiles
├── hooks/
│   ├── useAuth.ts              # Hook principal de autenticación
│   └── useProfile.ts           # Hook de perfil con realtime
└── components/
    └── AuthGuard.tsx           # Componentes de protección de rutas

src/app/(auth)/
├── layout.tsx                  # Layout de rutas autenticadas
├── login/page.tsx              # Página de login
└── register/page.tsx            # Página de registro
```

### Stack Tecnológico

- **Auth Provider**: Supabase Auth (JWT-based)
- **Validación**: Zod schemas + React Hook Form
- **State Management**: React hooks con Supabase realtime
- **Base de Datos**: PostgreSQL con Row Level Security (RLS)

## Requisitos EARS

### Ubicuidad (WHEN)

**EARS-U-01: Gestión de Sesión Persistente**

- **CUANDO** un usuario inicia sesión correctamente
- **ENTONCES** el sistema debe mantener la sesión activa al recargar la página
- **PARA** evitar múltiples inicios de sesión

**EARS-U-02: Sincronización de Estado de Autenticación**

- **CUANDO** ocurre un evento de autenticación (SIGNED_IN, SIGNED_OUT)
- **ENTONCES** el sistema debe actualizar el estado global de autenticación
- **PARA** reflejar cambios en toda la aplicación

**EARS-U-03: Actualización en Tiempo Real del Perfil**

- **CUANDO** el perfil del usuario se actualiza en la base de datos
- **ENTONCES** el hook `useProfile` debe recibir y reflejar los cambios automáticamente
- **PARA** mantener sincronizada la UI con el backend

### Respuesta (WHERE)

**EARS-R-01: Redirección por Rol**

- **DONDE** el usuario complete login o registro exitosamente
- **El SISTEMA** debe redirigir a la ruta correspondiente según su rol
- **PARA** proporcionar una experiencia personalizada

| Rol | Ruta de Destino |
|-----|-----------------|
| customer | `/wallet` |
| staff | `/scanner` |
| admin | `/dashboard` |

**EARS-R-02: Protección de Rutas**

- **DONDE** un usuario intente acceder a una ruta protegida sin autenticación
- **El SISTEMA** debe redirigir a `/login`
- **PARA** prevenir acceso no autorizado

**EARS-R-03: Protección por Rol**

- **DONDE** un usuario intente acceder a una ruta con restricción de rol
- **El SISTEMA** debe redirigir a la ruta por defecto de su rol
- **PARA** mantener la jerarquía de permisos

### Comportamiento (WHILE)

**EARS-C-01: Prevención de Envíos Múltiples**

- **MIENTRAS** una operación de autenticación está en progreso
- **El SISTEMA** debe deshabilitar el formulario y mostrar indicador de carga
- **PARA** prevenir envíos duplicados

**EARS-C-02: Validación en Tiempo Real**

- **MIENTRAS** el usuario interactúa con los campos del formulario
- **El SISTEMA** debe validar entradas y mostrar errores inline
- **PARA** proporcionar feedback inmediato

**EARS-C-03: Limpieza de Errores**

- **MIENTRAS** el usuario corrige un error en el formulario
- **El SISTEMA** debe limpiar el mensaje de error global al reenviar
- **PARA** evitar confusión con errores antiguos

### Eventos (IF)

**EARS-E-01: Registro Exitoso**

- **SI** el registro se completa exitosamente
- **ENTONCES** crear perfil con valores por defecto:
  - `tier: 'explorador'`
  - `points_balance: 0`
  - `total_spent: 0`
  - `visit_count: 0`
- **PARA** inicializar el lealtad del cliente

**EARS-E-02: Error de Credenciales**

- **SI** el login falla por credenciales inválidas
- **ENTONCES** mostrar mensaje: "Email o contraseña inválidos"
- **PARA** no revelar información sensible del sistema

**EARS-E-03: Logout**

- **SI** el usuario cierra sesión
- **ENTONCES** redirigir a `/` (landing page)
- **PARA** retornar a la página principal

**EARS-E-04: Error de Carga de Perfil**

- **SI** falla la carga del perfil después del login
- **ENTONCES** mostrar error: "Error al cargar perfil"
- **PARA** informar al usuario del problema técnico

### Acción (HERE)

**EARS-A-01: Creación de Usuario en Supabase Auth**

- **AQUÍ** (en el momento del registro)
- **El SISTEMA** debe crear usuario en `auth.users` via Supabase
- **PARA** gestionar autenticación centralizada

**EARS-A-02: Creación de Perfil Personalizado**

- **AQUÍ** (inmediatamente después de crear auth user)
- **El SISTEMA** debe crear registro en tabla `profiles`
- **PARA** extender datos con campos de lealtad

**EARS-A-03: Integración de Supabase Client**

- **AQUÍ** (en todos los servicios de auth)
- **El SISTEMA** debe utilizar `createClient()` del módulo compartido
- **PARA** mantener consistencia en la configuración

## Especificación de Componentes

### 1. Tipos y Validación (types.ts)

```typescript
// User roles
export const USER_ROLES = ['admin', 'staff', 'customer'] as const;
export type UserRole = (typeof USER_ROLES)[number];

// Tier levels
export const TIER_LEVELS = ['explorador', 'conocedor', 'embajador'] as const;
export type TierLevel = (typeof TIER_LEVELS)[number];

// Registration schema
export const registerSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z
    .string()
    .min(8, 'Minimo 8 caracteres')
    .regex(/[A-Z]/, 'Requiere al menos una mayuscula')
    .regex(/[0-9]/, 'Requiere al menos un numero'),
  name: z.string().min(2, 'Nombre requerido').optional(),
  role: z.enum(USER_ROLES).default('customer'),
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(1, 'Contrasena requerida'),
});

// Profile interface
export interface Profile {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  tier: TierLevel;
  points_balance: number;
  total_spent: number;
  visit_count: number;
  created_at: string;
  updated_at: string;
}
```

### 2. Servicio de Autenticación (authService.ts)

**Responsabilidades**:
- Registro de nuevos usuarios
- Login con email/contraseña
- Logout
- Obtención de sesión actual
- Carga de perfil de usuario

**Interface**:

```typescript
export const authService = {
  async register(input: RegisterInput): Promise<AuthResult<Profile>>
  async login(input: LoginInput): Promise<AuthResult<Profile>>
  async logout(): Promise<void>
  async getSession(): Promise<Session | null>
  async getProfile(userId: string): Promise<Profile | null>
}
```

### 3. Hook de Autenticación (useAuth.ts)

**Estado**:

```typescript
interface AuthState {
  user: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}
```

**Métodos**:

- `register(input: RegisterInput): Promise<boolean>`
- `login(input: LoginInput): Promise<boolean>`
- `logout(): Promise<void>`
- `clearError(): void`

**Comportamiento Clave**:
- Escucha eventos `SIGNED_IN` y `SIGNED_OUT` de Supabase
- Mantiene sesión sincronizada al recargar
- Redirección automática por rol post-login/registro

### 4. Componentes de Protección (AuthGuard.tsx)

**Componentes Disponibles**:

```typescript
// Guard genérico con roles
<AuthGuard allowedRoles={['admin', 'staff']}>
  {children}
</AuthGuard>

// Guards específicos
<AdminGuard>{children}</AdminGuard>        // Solo admin
<StaffGuard>{children}</StaffGuard>        // Admin + staff
<CustomerGuard>{children}</CustomerGuard>  // Todos los autenticados

// HOC para componentes
withAuthGuard(Component, ['admin'])
```

## Esquema de Base de Datos

### Tabla: profiles

```sql
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    role TEXT CHECK (role IN ('admin', 'staff', 'customer')) DEFAULT 'customer',
    tier TEXT CHECK (tier IN ('explorador', 'conocedor', 'embajador')) DEFAULT 'explorador',
    points_balance INTEGER DEFAULT 0 CHECK (points_balance >= 0),
    total_spent DECIMAL(10,2) DEFAULT 0 CHECK (total_spent >= 0),
    visit_count INTEGER DEFAULT 0 CHECK (visit_count >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)

- **Usuarios pueden leer su propio perfil**
- **Usuarios pueden actualizar su propio perfil (solo name)**
- **Usuarios pueden insertar su propio perfil (registro)**

### Índices

- `idx_profiles_email` para búsquedas por email
- `idx_profiles_role` para consultas por rol
- `idx_profiles_tier` para consultas por tier

## Plan de Implementación

### Fase 1: Documentación y Análisis
- ✅ Análisis de código existente completado
- ✅ Especificación EARS generada
- ⏳ Documentar casos de uso

### Fase 2: Pruebas (Test Coverage)
**Objetivo**: Alcanzar 85% de cobertura

#### Pruebas Unitarias

**1. authService.test.ts**
```typescript
describe('authService', () => {
  describe('register', () => {
    it('should create auth user and profile')
    it('should set default tier to explorador')
    it('should initialize points to 0')
    it('should handle Supabase auth errors')
    it('should handle profile creation errors')
  })

  describe('login', () => {
    it('should authenticate with valid credentials')
    it('should return profile data')
    it('should handle invalid credentials')
    it('should handle profile fetch errors')
  })

  describe('logout', () => {
    it('should sign out from Supabase')
  })
})
```

**2. useAuth.test.ts**
```typescript
describe('useAuth', () => {
  it('should initialize with loading state')
  it('should load session on mount')
  it('should listen to auth state changes')
  it('should redirect to role-specific route after login')
  it('should clear errors before new operation')
  it('should handle registration with role redirect')
})
```

**3. AuthGuard.test.tsx**
```typescript
describe('AuthGuard', () => {
  it('should redirect to login if not authenticated')
  it('should allow access if authenticated')
  it('should redirect based on role if not authorized')
  it('should show loading component during check')
  it('should allow all roles if no role restriction')
})
```

#### Pruebas de Integración

**4. Login Flow Integration**
```typescript
describe('Login Flow', () => {
  it('should complete full login flow with redirect')
  it('should handle invalid credentials with error message')
  it('should persist session after page reload')
})
```

**5. Register Flow Integration**
```typescript
describe('Register Flow', () => {
  it('should create user with default tier')
  it('should redirect to wallet after registration')
  it('should validate password requirements')
})
```

### Fase 3: Mejoras de Seguridad

**S-01: Rate Limiting en Login**
- Implementar rate limiting en cliente (3 intentos/5min)
- Considerar rate limiting en Supabase Auth

**S-02: Seguridad de Contraseñas**
- Revisar requisitos mínimos (actual: 8 chars, 1 mayúscula, 1 número)
- Considerar agregar lista de contraseñas comunes prohibidas

**S-03: Protección contra Brute Force**
- Implementar delay incremental tras fallos
- Monitorear intentos fallidos por IP

### Fase 4: Mejoras de UX

**UX-01: Autocompletado de Campos**
- ✅ `autoComplete="email"` en campo email
- ✅ `autoComplete="current-password"` en login
- ✅ `autoComplete="new-password"` en registro

**UX-02: Toggle Visibilidad de Contraseña**
- ✅ Implementado en login y registro
- ✅ Botón "Mostrar/Ocultar" funcional

**UX-03: Feedback Visual**
- ✅ Spinner de carga durante operaciones
- ✅ Mensajes de error en rojo con borde
- ✅ Campos con error en rojo

**UX-04: Indicadores de Fortaleza de Contraseña**
- ⏳ Agregar barra de fortaleza visual
- ⏳ Mostrar requisitos como checklist

### Fase 5: Funcionalidades Adicionales

**F-01: Recuperación de Contraseña**
- Implementar "¿Olvidaste tu contraseña?"
- Integrar Supabase Auth reset password

**F-02: Verificación de Email**
- Requerir verificación de email post-registro
- Mostrar estado de verificación en UI

**F-03: Logout en Todos los Dispositivos**
- Agregar opción en perfil
- Implementar revoke all sessions

**F-04: Session Timeout**
- Implementar inactivity timeout
- Mostrar modal de reautenticación

## Criterios de Aceptación

### CA-01: Registro de Usuario
- [ ] Usuario puede registrarse con email y contraseña
- [ ] Password valida requisitos (8+ chars, 1 mayúscula, 1 número)
- [ ] Nombre es opcional pero se muestra si está presente
- [ ] Perfil se crea con tier `explorador` y 0 puntos
- [ ] Usuario es redirigido a `/wallet` post-registro
- [ ] Errores se muestran en español claramente

### CA-02: Login
- [ ] Usuario puede iniciar sesión con credenciales válidas
- [ ] Sesión persiste al recargar la página
- [ ] Redirección por rol funciona correctamente
- [ ] Errores de credenciales muestran mensaje genérico
- [ ] Formulario se deshabilita durante login
- [ ] Toggle de visibilidad de contraseña funciona

### CA-03: Logout
- [ ] Usuario puede cerrar sesión
- [ ] Redirección a `/` (landing page)
- [ ] Sesión se elimina completamente
- [ ] Estado de autenticación se limpia

### CA-04: Protección de Rutas
- [ ] Rutas protegidas redirigen a `/login` si no autenticado
- [ ] Rutas con restricción de rol verifican permisos
- [ ] Usuarios sin permiso son redirigidos a su ruta por defecto
- [ ] Componente de carga se muestra durante verificación

### CA-05: Gestión de Perfil
- [ ] Perfil se carga automáticamente al iniciar sesión
- [ ] Cambios en perfil se reflejan en tiempo real (realtime)
- [ ] Errores de carga se manejan correctamente
- [ ] Hook `useProfile` proporciona métodos de actualización

### CA-06: Pruebas
- [ ] Cobertura de código >= 85%
- [ ] Todas las pruebas unitarias pasan
- [ ] Todas las pruebas de integración pasan
- [ ] Pruebas E2E cubren flujos críticos

### CA-07: Calidad de Código
- [ ] TypeScript sin errores de tipo
- [ ] ESLint sin warnings
- [ ] Código sigue principios SOLID
- [ ] Componentes debidamente documentados con JSDoc

## Casos de Uso

### UC-01: Registro de Nuevo Cliente

**Actor**: Cliente nuevo

**Precondiciones**:
- Usuario no tiene cuenta
- Usuario está en página de registro

**Flujo Principal**:
1. Usuario ingresa email válido
2. Usuario ingresa contraseña que cumple requisitos
3. Usuario (opcionalmente) ingresa su nombre
4. Usuario hace clic en "Crear Cuenta"
5. Sistema valida datos con Zod
6. Sistema crea usuario en Supabase Auth
7. Sistema crea perfil con tier `explorador`
8. Sistema redirige a `/wallet`

**Postcondiciones**:
- Usuario autenticado
- Perfil creado con 0 puntos
- Sesiión activa

**Flujos Alternativos**:
- **3a. Email inválido**: Sistema muestra error "Email invalido"
- **3b. Contraseña débil**: Sistema muestra requisitos no cumplidos
- **6a. Usuario ya existe**: Sistema muestra error de Supabase

### UC-02: Login de Cliente Existente

**Actor**: Cliente registrado

**Precondiciones**:
- Usuario tiene cuenta creada
- Usuario está en página de login

**Flujo Principal**:
1. Usuario ingresa email
2. Usuario ingresa contraseña
3. Usuario hace clic en "Iniciar Sesión"
4. Sistema valida credenciales
5. Sistema carga perfil del usuario
6. Sistema redirige según rol (`/wallet` para customer)

**Postcondiciones**:
- Usuario autenticado
- Sesión persistente
- Estado global actualizado

**Flujos Alternativos**:
- **4a. Credenciales inválidas**: Sistema muestra "Email o contraseña inválidos"
- **5a. Error al cargar perfil**: Sistema muestra "Error al cargar perfil"

### UC-03: Acceso a Ruta Protegida

**Actor**: Usuario autenticado

**Precondiciones**:
- Usuario intenta acceder a ruta protegida
- Usuario tiene rol específico

**Flujo Principal**:
1. Usuario navega a ruta protegida (ej: `/scanner`)
2. AuthGuard verifica autenticación
3. AuthGuard verifica permisos de rol
4. Si autorizado, muestra contenido
5. Si no autorizado, redirige a ruta por defecto del rol

**Postcondiciones**:
- Usuario ve contenido autorizado
- O usuario es redirigido apropiadamente

### UC-04: Cierre de Sesión

**Actor**: Usuario autenticado

**Precondiciones**:
- Usuario tiene sesión activa

**Flujo Principal**:
1. Usuario hace clic en "Cerrar Sesión"
2. Sistema llama a `authService.logout()`
3. Supabase elimina sesión
4. Sistema limpia estado local
5. Sistema redirige a `/`

**Postcondiciones**:
- Usuario no autenticado
- Estado limpio
- En landing page

## Modelo de Datos

### Entidad: Profile

| Campo | Tipo | Restricciones | Default | Descripción |
|-------|------|---------------|---------|-------------|
| `id` | UUID | PK, FK → auth.users | - | ID único de usuario |
| `email` | TEXT | NOT NULL | - | Email del usuario |
| `name` | TEXT | NULLABLE | null | Nombre opcional |
| `role` | TEXT | CHECK (admin/staff/customer) | customer | Rol de usuario |
| `tier` | TEXT | CHECK (explorador/conocedor/embajador) | explorador | Nivel de lealtad |
| `points_balance` | INTEGER | CHECK (>= 0) | 0 | Puntos disponibles |
| `total_spent` | DECIMAL(10,2) | CHECK (>= 0) | 0.00 | Total gastado |
| `visit_count` | INTEGER | CHECK (>= 0) | 0 | Visitas registradas |
| `created_at` | TIMESTAMPTZ | NOT NULL | NOW() | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | NOT NULL | NOW() | Última actualización |

### Relaciones

```
auth.users (1) ←→ (1) profiles
                        │
                        ├── (1:N) transactions
                        └── (1:N) rewards
```

## Configuración de Supabase

### Client Types

**Browser Client** (`/src/shared/lib/supabase/client.ts`):
- Utiliza `@supabase/ssr` para Next.js
- Configuración para componentes de cliente
- Maneja cookies de sesión

**Server Client** (`/src/shared/lib/supabase/server.ts`):
- Para Server Components y Route Handlers
- Acceso directo a variables de entorno
- Sin contexto de navegador

### Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Consideraciones de Seguridad

### Autenticación

- ✅ Contraseñas nunca se almacenan en texto plano (manejado por Supabase)
- ✅ JWT tokens gestionados por Supabase Auth
- ✅ HTTPS obligatorio en producción
- ⚠️ Considerar implementar refresh token rotation

### Autorización

- ✅ RLS activado en tabla `profiles`
- ✅ Usuarios solo pueden acceder a su propio perfil
- ✅ Verificación de rol en cliente (AuthGuard)
- ⚠️ Considerar verificación de rol también en servidor

### Validación

- ✅ Schemas Zod para validación de entrada
- ✅ Validación tanto en cliente como servidor
- ✅ Mensajes de error en español
- ⏳ Considerar sanitización de inputs adicionales

## Referencias

### Documentación de Supabase
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [SSR with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)

### Documentación de Librerías
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Next.js 14](https://nextjs.org/docs)

## Historial de Cambios

| Fecha | Versión | Cambios | Autor |
|-------|---------|---------|-------|
| 2026-02-02 | 1.0 | Creación inicial del SPEC | Claude (MoAI) |

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
|-----|--------|-------|--------|
| Tech Lead | - | - | ⏳ Pendiente |
| Product Owner | - | - | ⏳ Pendiente |
| Security Lead | - | - | ⏳ Pendiente |
