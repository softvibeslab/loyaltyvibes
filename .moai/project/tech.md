# LoyaltyVibes - Stack Tecnológico

## Resumen Ejecutivo

**LoyaltyVibes** es una Progressive Web Application (PWA) construida con Next.js 14 y App Router, optimizada para funcionar en zonas con conectividad intermitente como San Cristóbal de Las Casas, Chiapas. Implementa arquitectura offline-first con TypeScript estricto, Supabase como backend, y Dexie para persistencia local.

## Stack Principal

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 14.2.29 | Framework React con App Router para renderizado híbrido |
| **React** | 18.2.0 | Librería UI con hooks modernos |
| **TypeScript** | 5.x | Type-safety obligatorio en todo el proyecto |
| **TailwindCSS** | 3.4.14 | Estilos utilitarios con diseño responsive |
| **PostCSS** | 8.4.47 | Procesamiento de CSS |
| **Autoprefixer** | 10.4.20 | Vendor prefixes automáticos |

### Gestión de Formularios

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React Hook Form** | 7.53.0 | Manejo eficiente de forms con validación |
| **Zod** | 3.23.8 | Validación de esquemas runtime |
| **@hookform/resolvers** | 3.9.0 | Integración Zod con React Hook Form |

### Backend (BaaS)

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Supabase** | 2.45.0 | Backend as a Service completo |
| **@supabase/ssr** | 0.5.2 | Server-side rendering support |
| **PostgreSQL** | (vía Supabase) | Base de datos relacional con RLS |
| **Supabase Auth** | (incluido) | Autenticación con roles |

### Persistencia Offline

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Dexie** | 4.0.8 | Wrapper para IndexedDB |
| **IndexedDB** | (nativo) | Almacenamiento local de transacciones |
| **UUID** | 10.0.0 | Generación de IDs únicos offline |

### Testing

| Tecnología | Propósito |
|------------|-----------|
| **Vitest** | Unit testing framework (configurado en package.json) |
| **@types/*** | Type definitions para test mocks |

### Desarrollo

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **ESLint** | 8.x | Linting de código TypeScript |
| **eslint-config-next** | 14.2.21 | Configuración ESLint para Next.js |
| **TypeScript Compiler** | 5.x | Validación estática de tipos |

## Configuración de TypeScript

**Archivo**: `/tsconfig.json`

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,                    // Modo estricto obligatorio
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]              // Alias de imports
    }
  }
}
```

**Convenciones de Type-Safety**:
- Modo `strict` activado (no implicit any)
- Interfaces sobre types para objetos
- Enums reemplazados por `as const` arrays
- Type imports explícitos cuando es necesario

## Esquema de Base de Datos (PostgreSQL + Supabase)

### Tabla: profiles

Extensión de `auth.users` con datos del programa de lealtad:

```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL,
    name TEXT,
    role TEXT CHECK (role IN ('admin', 'staff', 'customer')) DEFAULT 'customer',
    tier TEXT CHECK (tier IN ('explorador', 'conocedor', 'embajador')) DEFAULT 'explorador',
    points_balance INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    visit_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Índices**:
- `idx_profiles_email` en `email`
- `idx_profiles_tier` en `tier`
- `idx_profiles_role` en `role`

### Tabla: transactions

Libro mayor inmutable de todas las transacciones:

```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    type TEXT CHECK (type IN ('earn', 'redeem', 'adjustment', 'expiry')) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    points INTEGER NOT NULL,
    points_before INTEGER NOT NULL,
    points_after INTEGER NOT NULL,
    multiplier_applied DECIMAL(3,2) DEFAULT 1.0,
    tier_at_transaction TEXT CHECK (tier_at_transaction IN ('explorador', 'conocedor', 'embajador')),
    description TEXT NOT NULL,
    reference_id TEXT,
    status TEXT CHECK (status IN ('pending', 'completed', 'cancelled', 'failed')) DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    staff_id UUID REFERENCES profiles(id)
);
```

**Índices**:
- `idx_transactions_user_id` en `user_id`
- `idx_transactions_created_at` en `created_at DESC`
- `idx_transactions_type` en `type`

### Políticas RLS (Row Level Security)

**Clientes** (role = 'customer'):
```sql
-- Solo leen sus propias transacciones
CREATE POLICY "Customers read own transactions"
ON transactions FOR SELECT
USING (auth.uid() = user_id);
```

**Staff** (role = 'staff'):
```sql
-- Staff puede crear transacciones de earn
CREATE POLICY "Staff create earn transactions"
ON transactions FOR INSERT
WITH CHECK (
    auth.uid() = staff_id
    AND type = 'earn'
    AND EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'staff'
    )
);
```

**Admin** (role = 'admin'):
```sql
-- Full access
CREATE POLICY "Admin full access transactions"
ON transactions FOR ALL
USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
));
```

## Arquitectura Offline-First

### Capa de Persistencia Local (IndexedDB + Dexie)

**Archivo**: `/src/shared/lib/db/dexie.ts`

```typescript
class LoyaltyVibesDB extends Dexie {
  offlineTransactions!: Table<OfflineTransaction, number>;
  cachedProfiles!: Table<CachedProfile, string>;
  syncOperations!: Table<SyncOperation, number>;

  constructor() {
    super('LoyaltyVibesDB');

    this.version(1).stores({
      offlineTransactions: '++id, sync_id, user_id, created_at, synced',
      cachedProfiles: 'id, updated_at',
      syncOperations: '++id, operation, table, created_at, synced',
    });
  }
}
```

### Estrategia de Sincronización

**Archivo**: `/src/features/transactions/services/syncService.ts`

**Flujo**:
1. **Detección**: `useOnlineStatus` hook detecta conexión
2. **Cola**: `getPendingTransactions()` obtiene transacciones no sincronizadas
3. **Procesamiento**: Cada transacción se envía a Supabase
4. **Confirmación**: `markTransactionSynced()` actualiza estado local
5. **Reintentos**: `incrementSyncAttempt()` maneja fallos con backoff
6. **Limpieza**: `clearOldCache()` elimina datos >24h

**Transacciones Offline**:
```typescript
interface OfflineTransaction {
  sync_id: string;              // UUID único
  user_id: string;
  type: 'earn' | 'redeem';
  amount: number;
  description: string;
  tier: string;                 // Tier en el momento de la tx
  created_at: string;
  synced: boolean;              // false = pendiente
  sync_attempts: number;        // Contador de reintentos
  error?: string;               // Último error
}
```

### Hook de Mutación Offline

**Archivo**: `/src/features/transactions/hooks/useOfflineMutation.ts`

```typescript
function useOfflineMutation<T>(mutationFn: (data: T) => Promise<void>) {
  const isOnline = useOnlineStatus();

  return useMutation({
    mutationFn: async (data: T) => {
      if (isOnline) {
        // Ejecutar directamente
        return mutationFn(data);
      } else {
        // Guardar en IndexedDB para sincronización posterior
        await addOfflineTransaction(data);
      }
    },
  });
}
```

## Middleware de Rutas

**Archivo**: `/src/middleware.ts`

### Configuración de Rutas

```typescript
const PUBLIC_ROUTES = ['/', '/login', '/register'];
const AUTH_ROUTES = ['/login', '/register'];

const ROLE_ROUTES: Record<string, string[]> = {
  admin: ['/dashboard', '/scanner', '/wallet', '/profile'],
  staff: ['/scanner', '/wallet', '/profile'],
  customer: ['/wallet', '/profile'],
};

const ROLE_REDIRECTS: Record<string, string> = {
  admin: '/dashboard',
  staff: '/scanner',
  customer: '/wallet',
};
```

### Lógica de Middleware

1. **Crear cliente Supabase SSR** con cookies del request
2. **Obtener sesión** actual del usuario
3. **Rutas públicas**: Permitir acceso sin autenticación
4. **Rutas de auth**: Redirigir usuarios autenticados a su home
5. **Rutas protegidas**: Requerir autenticación
6. **Validación de rol**: Verificar acceso permitido por rol
7. **Redirección**: Enviar al home apropiado si acceso denegado

### Integración con Supabase SSR

```typescript
const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        request.cookies.set({ name, value, ...options });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        request.cookies.set({ name, value: '', ...options });
        response.cookies.set({ name, value: '', ...options });
      },
    },
  }
);
```

## Validación con Zod

### Ejemplos de Esquemas

**Archivo**: `/src/features/auth/types.ts`

```typescript
// Registro de usuario
export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Requiere al menos una mayúscula')
    .regex(/[0-9]/, 'Requiere al menos un número'),
  name: z.string().min(2, 'Nombre requerido').optional(),
  role: z.enum(['admin', 'staff', 'customer']).default('customer'),
});

// Login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});
```

**Archivo**: `/src/features/transactions/types.ts`

```typescript
// Crear transacción
export const createTransactionSchema = z.object({
  user_id: z.string().uuid('ID de usuario inválido'),
  type: z.enum(['earn', 'redeem', 'adjustment', 'expiry']),
  amount: z.number().positive('El monto debe ser positivo'),
  points: z.number().int('Los puntos deben ser enteros'),
  description: z.string().min(1, 'Descripción requerida').max(255),
  reference_id: z.string().optional(),
});

// Canjear puntos
export const redeemPointsSchema = z.object({
  user_id: z.string().uuid('ID de usuario inválido'),
  points: z.number().int().positive('Los puntos deben ser positivos'),
  description: z.string().min(1, 'Descripción requerida'),
  reward_id: z.string().optional(),
});

// Transacción de staff
export const staffTransactionSchema = z.object({
  customer_email: z.string().email('Email inválido'),
  amount: z.number().positive('El monto debe ser positivo'),
  description: z.string().default('Compra en establecimiento'),
});
```

### Integración con React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/features/auth/types';

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const result = await authService.login(data);
    // ...
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      {/* ... */}
    </form>
  );
}
```

## Servicios de Aplicación

### AuthService

**Ubicación**: `/src/features/auth/services/authService.ts`

```typescript
const authService = {
  async register(input: RegisterInput): Promise<AuthResult<Profile>> {
    // 1. Crear auth user en Supabase
    const { data: authData, error: authError } =
      await supabase.auth.signUp({
        email: input.email,
        password: input.password,
      });

    // 2. Crear perfil con defaults
    const { data: profile } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: input.email,
        name: input.name || null,
        role: input.role || 'customer',
        tier: 'explorador',          // Tier inicial
        points_balance: 0,
        total_spent: 0,
        visit_count: 0,
      })
      .select()
      .single();

    return { data: profile, error: null };
  },

  async login(input: LoginInput): Promise<AuthResult<Profile>> {
    // 1. Autenticar con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    // 2. Fetch profile para role-based redirect
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return { data: profile, error: null };
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },
};
```

### PointsService

**Ubicación**: `/src/features/transactions/services/pointsService.ts`

```typescript
const pointsService = {
  calculatePoints(input: PointsCalculationInput): PointsCalculationResult {
    const basePoints = Math.floor(input.amount * POINTS_PER_PESO);
    const tierMultiplier = getMultiplier(input.tier);
    const bonusMultiplier = input.bonusMultiplier || 1;

    const totalPoints = Math.floor(
      basePoints * tierMultiplier * bonusMultiplier
    );

    return {
      basePoints,
      tierMultiplier,
      bonusMultiplier,
      totalPoints,
      breakdown: {
        base: basePoints,
        tierBonus: basePoints * (tierMultiplier - 1),
        bonus: basePoints * (bonusMultiplier - 1),
      },
    };
  },

  calculatePointsValue(points: number): number {
    return points / POINTS_PER_PESO; // 1 punto = $10 MXN
  },

  formatPoints(points: number): string {
    return points.toLocaleString('es-MX');
  },
};
```

### TransactionService

**Ubicación**: `/src/features/transactions/services/transactionService.ts`

```typescript
const transactionService = {
  async createTransaction(input: CreateTransactionInput) {
    // 1. Obtener perfil actual
    const profile = await getProfile(input.user_id);

    // 2. Calcular puntos
    const pointsCalc = pointsService.calculatePoints({
      amount: input.amount,
      tier: profile.tier,
    });

    // 3. Crear transacción inmutable
    const { data } = await supabase
      .from('transactions')
      .insert({
        user_id: input.user_id,
        type: input.type,
        amount: input.amount,
        points: pointsCalc.totalPoints,
        points_before: profile.points_balance,
        points_after: profile.points_balance + pointsCalc.totalPoints,
        multiplier_applied: pointsCalc.tierMultiplier,
        tier_at_transaction: profile.tier,
        description: input.description,
        reference_id: input.reference_id,
      })
      .select()
      .single();

    // 4. Actualizar balance de perfil
    await supabase
      .from('profiles')
      .update({
        points_balance: profile.points_balance + pointsCalc.totalPoints,
        total_spent: profile.total_spent + input.amount,
        visit_count: profile.visit_count + 1,
      })
      .eq('id', input.user_id);

    return data;
  },

  async getTransactionSummary(userId: string): Promise<TransactionSummary> {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId);

    // Calcular agregados
    return {
      totalEarned: data.filter(t => t.type === 'earn').reduce((sum, t) => sum + t.points, 0),
      totalRedeemed: data.filter(t => t.type === 'redeem').reduce((sum, t) => sum + t.points, 0),
      totalTransactions: data.length,
      lastTransaction: data.sort((a, b) => b.created_at - a.created_at)[0] || null,
      thisMonthEarned: /* filtrar por mes */,
      thisMonthRedeemed: /* filtrar por mes */,
    };
  },
};
```

## Configuración de TailwindCSS

**Archivo**: `/tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          500: '#8b5cf6',
          600: '#7c3aed', // Púrpura principal
          700: '#6d28d9',
        },
        success: {
          500: '#10b981', // Esmeralda para puntos
          600: '#059669',
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

## Scripts de NPM

**Archivo**: `/package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

## Testing con Vitest

**Configuración**:
- Framework: Vitest (configurado en package.json)
- Cobertura objetivo: 85% (según MoAI constitution)
- Type de tests: Unit tests para servicios y hooks

**Estructura de Tests**:
```
tests/
├── features/
│   ├── auth/
│   │   ├── authService.test.ts
│   │   └── useAuth.test.ts
│   ├── transactions/
│   │   ├── pointsService.test.ts
│   │   └── transactionService.test.ts
│   └── gamification/
│       └── tierService.test.ts
└── shared/
    └── lib/
        └── dexie.test.ts
```

## Variables de Entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Despliegue

### Plataforma Recomendada: Vercel

**Razones**:
- Integración nativa con Next.js
- Edge network global
- Build automático por commit
- Entornos preview por PR
- Variables de entorno gestionadas

**Configuración**:
1. Conectar repo de Git
2. Configurar variables de entorno
3. Deploy automático a `main`
4. Deploy preview a branches

### Backend: Supabase Cloud

**Configuración**:
1. Proyecto creado en Supabase
2. Migraciones SQL aplicadas
3. Políticas RLS configuradas
4. Auth providers habilitados (email)

## Requisitos de Desarrollo

### Sistema
- **Node.js**: 20 LTS (recomendado)
- **npm**: 9+ o pnpm 8+
- **Git**: 2.30+

### Navegadores Soportados
- Chrome/Edge 90+
- Safari 15+
- Firefox 90+
- Navegadores móviles modernos

## Métricas de Rendimiento

| Métrica | Objetivo | Razón |
|---------|----------|-------|
| FCP (First Contentful Paint) | < 1.5s | Usuarios en 4G/roaming |
| LCP (Largest Contentful Paint) | < 2.5s | Core Web Vitals |
| TTI (Time to Interactive) | < 3s | Interactividad rápida |
| Velocidad de Escaneo QR | < 2s | UX crítica para staff |
| Tasa de Sincronización Offline | > 95% | Confiabilidad del sistema |

## Archivos de Configuración

| Archivo | Propósito |
|---------|-----------|
| `package.json` | Dependencias y scripts npm |
| `tsconfig.json` | Configuración TypeScript estricta |
| `tailwind.config.ts` | Configuración TailwindCSS |
| `postcss.config.js` | Configuración PostCSS + Autoprefixer |
| `.eslintrc.json` | Reglas de linting (eslint-config-next) |
| `next.config.js` | Configuración Next.js |

## Decisiones Técnicas Clave

### 1. Next.js 14 App Router vs Pages Router
**Decisión**: App Router

**Razones**:
- Server Components por defecto (mejor performance)
- Layouts anidados y reutilizables
- Streaming y Suspense mejor integrados
- Mejor UX para PWA
- Futuro de Next.js

### 2. Supabase vs Backend Propio
**Decisión**: Supabase

**Razones**:
- Tiempo de desarrollo reducido (BaaS)
- Auth y RLS incluidos
- PostgreSQL real (no vendor lock-in)
- Realtime subscriptions
- SDKs TypeScript nativos

### 3. Dexie vs Otras BD Locales
**Decisión**: Dexie (IndexedDB wrapper)

**Razones**:
- API tipo MongoDB (familiar)
- Promesas nativas (async/await)
- Buen soporte TypeScript
- Compatible con todos los browsers
- Mejor que localStorage (capacity)

### 4. Zod vs Yup vs Joi
**Decisión**: Zod

**Razones**:
- Type inference automática
- Integración con tsc (no duplicación)
- Composición de esquemas
- Integración nativa con React Hook Form
- Bundle size pequeño

### 5. React Hook Form vs Formik
**Decisión**: React Hook Form

**Razones**:
- Performance superior (menos re-renders)
- Bundle size más pequeño
- Integración perfecta con Zod
- API simple y flexible

## Patrones de Código

### 1. Imports con Alias

```typescript
// ✅ Correcto
import { Profile } from '@/features/auth/types';
import { authService } from '@/features/auth/services/authService';

// ❌ Incorrecto
import { Profile } from '../../../features/auth/types';
```

### 2. Tipos sobre Interfaces

```typescript
// ✅ Correcto (type alias)
type UserRole = 'admin' | 'staff' | 'customer';
type TierLevel = 'explorador' | 'conocedor' | 'embajador';

// ❌ Evitar (interface a menos que necesite extensión)
interface UserRole {
  value: string;
}
```

### 3. Enums vs Const Assertions

```typescript
// ✅ Correcto (const assertions)
const USER_ROLES = ['admin', 'staff', 'customer'] as const;
type UserRole = typeof USER_ROLES[number];

// ❌ Evitar (enum)
enum UserRole {
  Admin = 'admin',
  Staff = 'staff',
  Customer = 'customer',
}
```

### 4. Servicios como Objetos

```typescript
// ✅ Correcto
export const authService = {
  async login() { /* ... */ },
  async register() { /* ... */ },
  async logout() { /* ... */ },
};

// ❌ Evitar (class con métodos estáticos)
export class AuthService {
  static async login() { /* ... */ }
}
```

## Convenciones de Nombres

### Archivos
- Components: PascalCase (`PointsDashboard.tsx`)
- Services: camelCase (`authService.ts`)
- Hooks: camelCase con prefijo 'use' (`useAuth.ts`)
- Types: PascalCase (`types.ts` o `Profile.ts`)
- Utils: camelCase (`formatPoints.ts`)

### Directorios
- Features: plural (`auth/`, `transactions/`)
- Components: plural (`components/`)
- Hooks: plural (`hooks/`)
- Servicios: singular (`services/`)

### Variables
- Const/let: camelCase (`pointsBalance`)
- Types/Interfaces: PascalCase (`Profile`, `UserRole`)
- Enums/Const assertions: UPPER_SNAKE_CASE (`USER_ROLES`)

## Consideraciones de Seguridad

### 1. Row Level Security (RLS)
- Todas las tablas con RLS activado
- Políticas por rol en cada tabla
- Nunca confiar en el cliente para autorización

### 2. Validación en Múltiples Capas
- Frontend: Zod para validación de forms
- Backend: Supabase RLS para acceso a datos
- API: Validación adicional en server actions

### 3. Manejo de Secrets
- Nunca exponer `SUPABASE_SERVICE_ROLE_KEY` en cliente
- Usar variables de entorno para secrets
- Rotación de keys periódica

### 4. Transacciones Inmutables
- Tabla `transactions` sin UPDATE/DELETE
- Audit trail completo
- Prevención de manipulación

---

**Versión**: 0.1.0
**Última Actualización**: Febrero 2026
**Framework**: Next.js 14 + TypeScript 5 + Supabase 2.45
