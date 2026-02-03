# Guía Rápida - Autenticación LoyaltyVibes

## ⚡ 30 Segundos para Entender

LoyaltyVibes tiene un sistema de autenticación **funcional** con Supabase que necesita:
- ✅ Documentación formal
- ✅ Pruebas (urgente)
- ✅ Mejoras de seguridad
- ✅ Mejoras de UX

---

## 📁 Ubicación del Código

```
/src/features/auth/
├── types.ts              # Tipos TypeScript + Schemas Zod
├── services/
│   ├── authService.ts          # Login, registro, logout
│   └── profileService.ts       # CRUD de perfiles
├── hooks/
│   ├── useAuth.ts              # Hook principal de auth
│   └── useProfile.ts           # Hook de perfil (realtime)
└── components/
    └── AuthGuard.tsx           # <AuthGuard> protege rutas

/src/app/(auth)/
├── login/page.tsx              # /login
└── register/page.tsx            # /register
```

---

## 🚀 Uso Básico

### Login
```typescript
import { useAuth } from '@/features/auth/hooks/useAuth';

function LoginPage() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    await login({ email, password });
    // Redirección automática por rol
  };
}
```

### Registro
```typescript
const { register } = useAuth();

await register({
  email: 'user@example.com',
  password: 'Password123',
  name: 'Juan Pérez',
  role: 'customer' // default
});
// Crea perfil con tier='explorador', points=0
```

### Proteger Ruta
```typescript
import { AuthGuard } from '@/features/auth/components/AuthGuard';

export default function AdminPage() {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <AdminDashboard />
    </AuthGuard>
  );
}
```

### Hook de Perfil
```typescript
import { useProfile } from '@/features/auth/hooks/useProfile';

function UserProfile() {
  const { profile, loading, updateProfile } = useProfile();

  // Actualización en tiempo real vía Supabase
  const handleUpdate = async () => {
    await updateProfile({ name: 'Nuevo Nombre' });
  };
}
```

---

## 🎯 Roles y Redirecciones

| Rol | Redirect | Guards |
|-----|----------|--------|
| `customer` | `/wallet` | `<CustomerGuard>` |
| `staff` | `/scanner` | `<StaffGuard>` |
| `admin` | `/dashboard` | `<AdminGuard>` |

---

## 📊 Modelo de Datos

### Tabla: profiles
```sql
id          UUID    PK → auth.users
email       TEXT    NOT NULL
name        TEXT    NULL
role        TEXT    customer/staff/admin
tier        TEXT    explorador/conocedor/embajador
points_balance INT   DEFAULT 0
total_spent DECIMAL DEFAULT 0
visit_count INT     DEFAULT 0
created_at  TIMESTAMPTZ
updated_at  TIMESTAMPTZ
```

---

## ✅ Validación (Zod)

### Login
```typescript
{
  email: string (email válido)
  password: string (mínimo 1 carácter)
}
```

### Registro
```typescript
{
  email: string (email válido)
  password: string (
    mínimo 8 caracteres,
    1 mayúscula,
    1 número
  )
  name: string (opcional, mínimo 2 caracteres)
  role: 'admin' | 'staff' | 'customer' (default: customer)
}
```

---

## 🔐 Seguridad Actual

✅ **Implementado**:
- Supabase Auth (JWT)
- RLS en base de datos
- Validación Zod (cliente + servidor)
- Passwords nunca en texto plano

⚠️ **Falta**:
- Rate limiting en login
- Validación de contraseñas comunes
- Verificación de email
- Recuperación de contraseña

---

## 🧪 Testing (Prioridad URGENTE)

**Estado Actual**: 0% coverage

**Pruebas Necesarias**:
```typescript
// Unit tests
authService.test.ts
useAuth.test.ts
AuthGuard.test.tsx
profileService.test.ts
useProfile.test.ts

// Integration tests
auth.integration.test.ts
login-flow.test.ts
register-flow.test.ts
```

**Objetivo**: 85% coverage

---

## 📋 Requisitos EARS Resumen

### Ubicuidad (WHEN)
- Sesión persiste al recargar página
- Estado de auth sincronizado en tiempo real
- Perfil actualizado vía Supabase realtime

### Respuesta (WHERE)
- Redirección por rol post-login
- Protección de rutas autenticadas
- Verificación de permisos por rol

### Comportamiento (WHILE)
- Prevención de envíos múltiples
- Validación inline de formularios
- Limpieza de errores

### Eventos (IF)
- Registro exitoso → crea perfil con defaults
- Login fallido → error genérico
- Logout → redirección a `/`

### Acción (HERE)
- Creación de usuario en Supabase Auth
- Creación de perfil en `profiles`
- Integración con Supabase client

---

## 🎨 UI Components

### Login Page
- Formulario con validación
- Toggle visibilidad contraseña
- Mensajes de error en español
- Link a registro

### Register Page
- Todo de Login +
- Info de beneficios de registro
- Requisitos de contraseña visibles
- Campo nombre opcional

### AuthGuard
- Loading spinner mientras verifica
- Redirección automática si no autorizado
- Soporte para roles múltiples

---

## 🔧 Servicios Principales

### authService
```typescript
{
  register(input): Promise<AuthResult<Profile>>
  login(input): Promise<AuthResult<Profile>>
  logout(): Promise<void>
  getSession(): Promise<Session>
  getProfile(userId): Promise<Profile>
}
```

### profileService
```typescript
{
  getProfile(userId): Promise<Profile>
  getCurrentProfile(): Promise<Profile>
  updateProfile(userId, data): Promise<Profile>
  getProfileStats(userId): Promise<ProfileStats>
  getProfilesByRole(role): Promise<Profile[]>
  searchProfiles(query): Promise<Profile[]>
}
```

---

## 📦 Dependencias

```json
{
  "@supabase/supabase-js": "^2.45.0",
  "@supabase/ssr": "^0.5.2",
  "react-hook-form": "^7.53.0",
  "@hookform/resolvers": "^3.9.0",
  "zod": "^3.23.8"
}
```

---

## 🚨 Problemas Conocidos

1. **Sin pruebas** - 0% coverage (CRÍTICO)
2. **Sin rate limiting** - Vulnerable a brute force
3. **Sin recuperación de contraseña** - UX limitada
4. **Sin verificación de email** - Seguridad reducida
5. **Sin indicador de fortaleza** - UX subóptima

---

## 🎯 Metas del SPEC

### Corto Plazo (Semana 1)
- [ ] Configurar Vitest
- [ ] Escribir pruebas unitarias
- [ ] Alcanzar 85% coverage

### Medio Plazo (Semana 2-3)
- [ ] Implementar rate limiting
- [ ] Agregar recuperación de contraseña
- [ ] Mejorar UX de formularios

### Largo Plazo (Semana 4+)
- [ ] Verificación de email
- [ ] Logout en todos los dispositivos
- [ ] Optimizaciones de performance

---

## 📚 Documentación Completa

- **spec.md**: Especificación técnica completa
- **implementation.md**: Plan de implementación detallado
- **ANALYSIS.md**: Análisis profundo del código existente
- **README.md**: Vista general del SPEC

---

## 🔄 Flujo de Trabajo Recomendado

### Para Agregar Funcionalidad
1. Revisar SPEC (spec.md)
2. Agregar requisito EARS si es necesario
3. Escribir prueba primero
4. Implementar con pruebas pasando
5. Actualizar documentación

### Para Corregir Bug
1. Reproducir bug
2. Escribir prueba que falle
3. Corregir código
4. Verificar que pasen todas las pruebas

---

**Versión**: 1.0
**Fecha**: 2026-02-02
**Estado**: Pendiente de aprobación
