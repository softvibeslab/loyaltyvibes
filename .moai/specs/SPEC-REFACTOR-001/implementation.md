# Plan de Implementación - SPEC-REFACTOR-001

## Resumen

Este documento detalla el plan de implementación para formalizar, probar y mejorar el sistema de autenticación existente de LoyaltyVibes.

## Enfoque: Domain-Driven Development (DDD)

Seguiremos el ciclo **ANALYZE-PRESERVE-IMPROVE**:

1. **ANALYZE**: Análisis profundo del comportamiento existente
2. **PRESERVE**: Creación de pruebas de caracterización para proteger comportamiento
3. **IMPROVE**: Mejoras incrementales con validación continua

## Fase 1: ANALYZE (Análisis del Comportamiento Existente)

### Objetivo
Comprender completamente cómo funciona el sistema de autenticación actual antes de realizar cambios.

### Actividades

#### A-01: Mapeo de Flujos de Usuario
- [ ] Documentar flujo completo de registro
- [ ] Documentar flujo completo de login
- [ ] Documentar flujo de logout
- [ ] Documentar redirecciones por rol
- [ ] Identificar edge cases actuales

**Entregable**: Diagramas de secuencia de los flujos principales

#### A-02: Análisis de Dependencias
- [ ] Mapear dependencias entre componentes
- [ ] Identificar acoplamiento con otros módulos
- [ ] Documentar integración con Supabase
- [ ] Analizar hooks y su lifecycle

**Entregable**: Grafo de dependencias

#### A-03: Análisis de Estado Global
- [ ] Documentar estado en `useAuth`
- [ ] Documentar estado en `useProfile`
- [ ] Identificar mutations y efectos secundarios
- [ ] Mapear eventos de Supabase Auth

**Entregable**: Diagrama de transición de estado

#### A-04: Análisis de Seguridad
- [ ] Revisar políticas RLS en base de datos
- [ ] Verificar manejo de errores (no leak de info sensible)
- [ ] Analizar exposición de datos en cliente
- [ ] Revisar validación de inputs

**Entregable**: Reporte de análisis de seguridad

#### A-05: Análisis de Performance
- [ ] Medir tiempo de carga inicial de sesión
- [ ] Medir latencia de operaciones de auth
- [ ] Identificar re-renders innecesarios
- [ ] Analizar uso de memoria

**Entregable**: Reporte de perfilamiento

## Fase 2: PRESERVE (Pruebas de Caracterización)

### Objetivo
Crear pruebas que capturen el comportamiento existente para protegerlo durante mejoras.

### Estrategia de Pruebas

#### P-01: Pruebas Unitarias

**Cobertura Objetivo**: 85%

**authService.test.ts** (Servicio de Autenticación)
```typescript
describe('authService.register', () => {
  it('should create Supabase auth user with provided email and password')
  it('should create profile with default values (tier: explorador, points: 0)')
  it('should return profile data on success')
  it('should handle Supabase auth errors')
  it('should handle profile creation errors')
  it('should log registration success')
  it('should log errors appropriately')
})

describe('authService.login', () => {
  it('should sign in with valid credentials')
  it('should fetch user profile after authentication')
  it('should return profile data on success')
  it('should handle invalid credentials with generic error')
  it('should handle profile fetch errors')
  it('should log login success')
})

describe('authService.logout', () => {
  it('should sign out from Supabase')
  it('should handle logout errors')
  it('should log logout success/failure')
})

describe('authService.getSession', () => {
  it('should return current session')
  it('should return null if no session')
})

describe('authService.getProfile', () => {
  it('should fetch profile by user ID')
  it('should return null on error')
  it('should handle profile not found')
})
```

**useAuth.test.ts** (Hook de Autenticación)
```typescript
describe('useAuth', () => {
  describe('initialization', () => {
    it('should initialize with loading state true')
    it('should load session on mount')
    it('should set loading to false after session check')
    it('should set user if session exists')
    it('should not set user if no session')
  })

  describe('auth state changes', () => {
    it('should update state on SIGNED_IN event')
    it('should clear state on SIGNED_OUT event')
    it('should unsubscribe from auth changes on unmount')
  })

  describe('register', () => {
    it('should call authService.register with input')
    it('should set loading state during registration')
    it('should set error if registration fails')
    it('should redirect to /wallet on customer registration')
    it('should redirect to /scanner on staff registration')
    it('should redirect to /dashboard on admin registration')
    it('should return true on success')
    it('should return false on failure')
  })

  describe('login', () => {
    it('should call authService.login with input')
    it('should set loading state during login')
    it('should set error if login fails')
    it('should redirect to role-specific route on success')
    it('should clear existing errors before login')
    it('should return true on success')
    it('should return false on failure')
  })

  describe('logout', () => {
    it('should call authService.logout')
    it('should redirect to /')
  })

  describe('clearError', () => {
    it('should clear error state')
  })
})
```

**AuthGuard.test.tsx** (Componentes de Protección)
```typescript
describe('AuthGuard', () => {
  it('should show loading component while checking auth')
  it('should redirect to /login if not authenticated')
  it('should render children if authenticated and no role restriction')
  it('should render children if user has required role')
  it('should redirect to role default path if user lacks role')
  it('should use custom fallbackUrl if provided')
  it('should not render anything while unauthorized')
})

describe('AdminGuard', () => {
  it('should only allow admin role')
  it('should redirect staff users to /scanner')
  it('should redirect customers to /wallet')
})

describe('StaffGuard', () => {
  it('should allow admin and staff roles')
  it('should redirect customers to /wallet')
})

describe('CustomerGuard', () => {
  it('should allow all authenticated roles')
})

describe('withAuthGuard HOC', () => {
  it('should wrap component with AuthGuard')
  it('should pass props to wrapped component')
})
```

**profileService.test.ts** (Servicio de Perfil)
```typescript
describe('ProfileService', () => {
  describe('getProfile', () => {
    it('should fetch profile by userId')
    it('should return null on error')
  })

  describe('getCurrentProfile', () => {
    it('should fetch current user profile')
    it('should return null if not authenticated')
  })

  describe('updateProfile', () => {
    it('should update profile fields')
    it('should update updated_at timestamp')
    it('should throw error on failure')
  })

  describe('getProfileStats', () => {
    it('should return profile statistics')
    it('should return null on error')
  })

  describe('getProfilesByRole', () => {
    it('should return profiles filtered by role')
    it('should order by created_at desc')
    it('should return empty array on error')
  })

  describe('searchProfiles', () => {
    it('should search by name or email')
    it('should be case insensitive')
    it('should limit results to 20')
  })
})
```

**useProfile.test.ts** (Hook de Perfil)
```typescript
describe('useProfile', () => {
  it('should load profile on mount')
  it('should set loading state appropriately')
  it('should set error on failure')
  it('should update profile when updateProfile is called')
  it('should subscribe to realtime profile changes')
  it('should update profile on realtime UPDATE event')
  it('should unsubscribe from realtime on unmount')
  it('should refetch profile when refetch is called')
})

describe('useProfileStats', () => {
  it('should load stats on mount')
  it('should return stats object')
  it('should set loading state')
})
```

#### P-02: Pruebas de Integración

**auth.integration.test.ts**
```typescript
describe('Authentication Flow Integration', () => {
  describe('Registration Flow', () => {
    it('should complete full registration journey')
    it('should create both auth user and profile')
    it('should set initial tier to explorador')
    it('should redirect to wallet after registration')
    it('should maintain session after redirect')
  })

  describe('Login Flow', () => {
    it('should complete full login journey')
    it('should authenticate with valid credentials')
    it('should load profile after authentication')
    it('should redirect based on user role')
    it('should maintain session across page refreshes')
  })

  describe('Logout Flow', () => {
    it('should complete logout and redirect')
    it('should clear all auth state')
    it('should prevent access to protected routes')
  })

  describe('Protected Routes', () => {
    it('should redirect unauthenticated users to login')
    it('should allow access with correct role')
    it('should redirect unauthorized roles')
  })
})
```

#### P-03: Pruebas E2E (Opcional)

**auth.e2e.test.ts**
```typescript
describe('Authentication E2E', () => {
  it('should allow new user to register and access wallet')
  it('should allow existing user to login and see dashboard')
  it('should prevent access to admin routes as customer')
  it('should handle logout correctly')
})
```

### Herramientas de Pruebas

- **Framework**: Vitest
- **Coverage**: c8 o istanbul
- **Mocks**: Vitest mock functions
- **Testing Library**: React Testing Library para componentes

## Fase 3: IMPROVE (Mejoras Incrementales)

### Objetivo
Implementar mejoras con validación continua mediante pruebas existentes.

### I-01: Mejoras de Seguridad

#### Rate Limiting en Cliente
**Prioridad**: Alta
**Esfuerzo**: 2 horas

```typescript
// src/features/auth/utils/rateLimiter.ts
class AuthRateLimiter {
  private attempts: Map<string, number[]> = new Map();

  canAttempt(identifier: string): boolean {
    const now = Date.now();
    const window = 5 * 60 * 1000; // 5 minutos
    const maxAttempts = 3;

    const attempts = this.attempts.get(identifier) || [];
    const validAttempts = attempts.filter(t => now - t < window);

    if (validAttempts.length >= maxAttempts) {
      return false;
    }

    validAttempts.push(now);
    this.attempts.set(identifier, validAttempts);
    return true;
  }

  getRemainingTime(identifier: string): number {
    const attempts = this.attempts.get(identifier);
    if (!attempts || attempts.length < 3) return 0;

    const oldestAttempt = attempts[attempts.length - 3];
    const window = 5 * 60 * 1000;
    return Math.max(0, oldestAttempt + window - Date.now());
  }
}
```

**Pruebas**:
```typescript
describe('AuthRateLimiter', () => {
  it('should allow 3 attempts within 5 minutes')
  it('should block 4th attempt within 5 minutes')
  it('should reset after 5 minutes')
  it('should track attempts per identifier')
})
```

#### Validación de Contraseñas Comunes
**Prioridad**: Media
**Esfuerzo**: 1 hora

```typescript
// src/features/auth/validation/passwordRules.ts
const COMMON_PASSWORDS = [
  'password123', 'Password1', '12345678', 'qwerty123',
  // ... lista extendida
];

export const enhancedPasswordSchema = z.string()
  .min(8, 'Mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Requiere al menos una mayúscula')
  .regex(/[0-9]/, 'Requiere al menos un número')
  .refine(
    (pwd) => !COMMON_PASSWORDS.includes(pwd),
    'Contraseña demasiado común'
  );
```

### I-02: Mejoras de UX

#### Indicador de Fortaleza de Contraseña
**Prioridad**: Media
**Esfuerzo**: 3 horas

```typescript
// src/features/auth/components/PasswordStrength.tsx
interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = calculatePasswordStrength(password);
  const { level, color, label } = getStrengthInfo(strength);

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded ${
              i <= level ? color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  );
}
```

#### Checklist de Requisitos
**Prioridad**: Baja
**Esfuerzo**: 1 hora

```typescript
// src/features/auth/components/PasswordRequirements.tsx
export function PasswordRequirements({ password }: { password: string }) {
  const requirements = [
    { test: (p: string) => p.length >= 8, label: '8+ caracteres' },
    { test: (p: string) => /[A-Z]/.test(p), label: '1 mayúscula' },
    { test: (p: string) => /[0-9]/.test(p), label: '1 número' },
  ];

  return (
    <ul className="mt-2 space-y-1">
      {requirements.map((req, i) => (
        <li key={i} className={req.test(password) ? 'text-green-600' : 'text-gray-400'}>
          {req.test(password) ? '✓' : '○'} {req.label}
        </li>
      ))}
    </ul>
  );
}
```

### I-03: Funcionalidades Adicionales

#### Recuperación de Contraseña
**Prioridad**: Alta
**Esfuerzo**: 4 horas

```typescript
// src/features/auth/services/passwordResetService.ts
export const passwordResetService = {
  async requestReset(email: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { success: !error, error: error?.message };
  },

  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    return { success: !error, error: error?.message };
  }
};
```

**Nueva página**: `/src/app/(auth)/reset-password/page.tsx`

#### Verificación de Email
**Prioridad**: Media
**Esfuerzo**: 2 horas

```typescript
// Agregar en useAuth
async resendVerificationEmail(): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: state.user?.email,
  });
  return !error;
}
```

### I-04: Optimizaciones de Performance

#### Memoización de Cálculos
**Prioridad**: Baja
**Esfuerzo**: 1 hora

```typescript
// En useAuth
const authValue = useMemo(() => ({
  ...state,
  register,
  login,
  logout,
  clearError,
}), [state, register, login, logout, clearError]);
```

#### Lazy Loading de Componentes
**Prioridad**: Baja
**Esfuerzo**: 1 hora

```typescript
// En páginas de auth
const LoginForm = dynamic(() => import('@/features/auth/components/LoginForm'), {
  loading: () => <Spinner />,
});
```

### I-05: Mejoras de Código

#### Extracción de Constantes
**Prioridad**: Baja
**Esfuerzo**: 1 hora

```typescript
// src/features/auth/constants/messages.ts
export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Inicio de sesión exitoso',
  LOGIN_FAILED: 'Email o contraseña inválidos',
  REGISTRATION_SUCCESS: 'Cuenta creada exitosamente',
  PROFILE_LOAD_ERROR: 'Error al cargar perfil',
  // ...
} as const;
```

#### Tipado Estricto
**Prioridad**: Media
**Esfuerzo**: 2 horas

```typescript
// Asegurar que todos los errores estén tipados
export type AuthError =
  | 'INVALID_CREDENTIALS'
  | 'PROFILE_LOAD_FAILED'
  | 'REGISTRATION_FAILED'
  | 'NETWORK_ERROR';

interface AuthResult<T> {
  data: T | null;
  error: AuthError | null;
}
```

## Cronograma

### Semana 1: Análisis y Caracterización
- **Día 1-2**: Fase ANALYZE (actividades A-01 a A-05)
- **Día 3-4**: Pruebas unitarias (P-01)
- **Día 5**: Pruebas de integración (P-02)

### Semana 2: Mejoras de Seguridad y UX
- **Día 1-2**: Mejoras de seguridad (I-01)
- **Día 3-4**: Mejoras de UX (I-02)
- **Día 5**: Funcionalidad de recuperación de contraseña (I-03.1)

### Semana 3: Funcionalidades Adicionales
- **Día 1-2**: Verificación de email (I-03.2)
- **Día 3**: Optimizaciones de performance (I-04)
- **Día 4-5**: Mejoras de código (I-05)

## Métricas de Éxito

### Cobertura de Pruebas
- [ ] Cobertura >= 85%
- [ ] Todas las pruebas unitarias pasan
- [ ] Todas las pruebas de integración pasan

### Calidad de Código
- [ ] TypeScript sin errores
- [ ] ESLint sin warnings
- [ ] Sin problemas de seguridad detectados

### Performance
- [ ] Tiempo de login < 2 segundos
- [ ] Tiempo de registro < 3 segundos
- [ ] Sin memory leaks en hooks

### UX
- [ ] Formularios accesibles (WCAG AA)
- [ ] Mensajes de error claros en español
- [ ] Feedback visual adecuado

## Riesgos y Mitigación

### Riesgo 1: Cambios en Supabase Auth
**Impacto**: Alto
**Probabilidad**: Baja
**Mitigación**: Version locking en package.json, revisión de changelog

### Riesgo 2: Tests Frágiles
**Impacto**: Medio
**Probabilidad**: Media
**Mitigación**: Mocks aislados, pruebas de integración robustas

### Riesgo 3: Regresiones en UX
**Impacto**: Medio
**Probabilidad**: Baja
**Mitigación**: Pruebas E2E, revisión manual de cambios

### Riesgo 4: Problemas de Realtime
**Impacto**: Bajo
**Probabilidad**: Media
**Mitigación**: Tests de suscripción, fallback a polling

## Checklist Final

### Antes de Considerar Completo
- [ ] Todas las pruebas implementadas
- [ ] Cobertura >= 85%
- [ ] Documentación actualizada
- [ ] Código review completado
- [ ] Linter clean
- [ ] TypeScript sin errores
- [ ] Pruebas de manual testing pasan
- [ ] No hay warnings en consola
- [ ] Performance acceptable
- [ ] Accessibility verificado

### Para Deployment
- [ ] Variables de entorno configuradas
- [ ] Migraciones de BD ejecutadas
- [ ] Políticas RLS verificadas
- [ ] Logs configurados
- [ ] Monitoreo configurado
- [ ] Backup previo ejecutado
