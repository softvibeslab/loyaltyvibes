# LoyaltyVibes - Estructura del Proyecto

## Patrón de Arquitectura
**Progressive Web Application (PWA)** con **Next.js 14 App Router**, estructura **Feature-Based** y middleware de rutas basado en roles

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    Lado del Cliente (PWA)                   │
├─────────────────┬─────────────────┬─────────────────────────┤
│   Wallet App    │   Staff App     │     Admin Dashboard     │
│   (Clientes)    │   (Escáner)     │     (Gerentes)          │
│   /wallet       │   /scanner      │     /dashboard          │
├─────────────────┴─────────────────┴─────────────────────────┤
│              Service Worker (Offline-First)                  │
│              IndexedDB (Dexie.js) - Cola Local               │
├─────────────────────────────────────────────────────────────┤
│              React Hook Form + Zod (Validación)              │
│              TailwindCSS (Estilos)                           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE (BaaS)                          │
├─────────────────┬─────────────────┬─────────────────────────┤
│   PostgreSQL    │   Auth          │     Client SDK          │
│   + RLS         │   (Roles)       │     (@supabase/ssr)     │
└─────────────────┴─────────────────┴─────────────────────────┘
```

## Middleware de Rutas

**Archivo**: `/src/middleware.ts`

El middleware implementa:
1. **Detección de sesión** con Supabase SSR
2. **Rutas públicas**: `/`, `/login`, `/register`
3. **Protección por rol**:
   - `admin`: `/dashboard`, `/scanner`, `/wallet`, `/profile`
   - `staff`: `/scanner`, `/wallet`, `/profile`
   - `customer`: `/wallet`, `/profile`
4. **Redirección automática** según rol después de login

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (PWA)                            │
├─────────────────┬─────────────────┬─────────────────────────┤
│   Wallet App    │   Staff App     │     Admin Dashboard     │
│   (Turistas)    │   (Escáner)     │     (Gerentes)          │
├─────────────────┴─────────────────┴─────────────────────────┤
│              Service Worker (Offline-First)                  │
│              IndexedDB (Dexie.js) - Cola Local               │
├─────────────────────────────────────────────────────────────┤
│                  TanStack Query (Cache)                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE (BaaS)                          │
├─────────────────┬─────────────────┬─────────────────────────┤
│   PostgreSQL    │   Auth          │     Realtime            │
│   + RLS         │   (Roles)       │     (Suscripciones)     │
└─────────────────┴─────────────────┴─────────────────────────┘
```

## Estructura de Directorios

```
loyaltyvibes/
├── .moai/                          # Configuración MoAI-ADK
│   ├── config/                     # Configuraciones del proyecto
│   ├── project/                    # Documentación generada
│   │   ├── product.md              # Visión del producto
│   │   ├── structure.md            # Este archivo
│   │   └── tech.md                 # Stack tecnológico
│   ├── specs/                      # Especificaciones EARS
│   └── skills/                     # Skills del sistema
├── src/
│   ├── app/                        # Next.js 14 App Router
│   │   ├── (auth)/                 # Rutas de autenticación
│   │   │   ├── login/
│   │   │   │   └── page.tsx        # Login con React Hook Form
│   │   │   ├── register/
│   │   │   │   └── page.tsx        # Registro con validación Zod
│   │   │   └── layout.tsx          # Layout auth
│   │   ├── (client)/               # Rutas Wallet del Cliente
│   │   │   ├── wallet/
│   │   │   │   └── page.tsx        # Dashboard de puntos
│   │   │   ├── profile/
│   │   │   │   └── page.tsx        # Perfil de usuario
│   │   │   └── layout.tsx          # Layout cliente
│   │   ├── (staff)/                # Rutas Terminal de Staff
│   │   │   ├── scanner/
│   │   │   │   └── page.tsx        # Escáner QR
│   │   │   └── layout.tsx          # Layout staff
│   │   ├── (admin)/                # Rutas Dashboard Admin
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx        # Analytics
│   │   │   └── layout.tsx          # Layout admin
│   │   ├── layout.tsx              # Layout raíz
│   │   ├── page.tsx                # Landing page (SSG/SEO)
│   │   └── globals.css             # Estilos globales
│   ├── features/                   # Módulos por característica
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   └── AuthGuard.tsx   # Protección de rutas
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts      # Hook de autenticación
│   │   │   │   └── useProfile.ts   # Hook de perfil
│   │   │   ├── services/
│   │   │   │   ├── authService.ts  # Servicios de auth
│   │   │   │   └── profileService.ts
│   │   │   └── types.ts            # Tipos: Profile, UserRole, TierLevel
│   │   ├── wallet/
│   │   │   ├── components/
│   │   │   │   ├── PointsDashboard.tsx  # Dashboard principal
│   │   │   │   └── TierProgress.tsx     # Barra de progreso
│   │   │   └── services/
│   │   ├── transactions/
│   │   │   ├── components/
│   │   │   │   └── TransactionHistory.tsx  # Historial
│   │   │   ├── hooks/
│   │   │   │   └── useOfflineMutation.ts   # Mutaciones offline
│   │   │   ├── services/
│   │   │   │   ├── pointsService.ts        # Cálculo de puntos
│   │   │   │   ├── transactionService.ts   # Gestión de transacciones
│   │   │   │   └── syncService.ts          # Sincronización
│   │   │   └── types.ts            # Tipos de transacción
│   │   ├── gamification/
│   │   │   ├── components/
│   │   │   │   └── LevelProgress.tsx       # Progreso de nivel
│   │   │   ├── hooks/
│   │   │   │   └── useTierCalculation.ts   # Cálculo de tier
│   │   │   ├── services/
│   │   │   │   └── tierService.ts          # Lógica de niveles
│   │   │   └── constants/
│   │   │       └── tiers.ts        # Configuración de tiers
│   ├── shared/                     # Recursos compartidos
│   │   ├── components/
│   │   │   └── ui/
│   │   │       ├── TierBadge.tsx   # Badge de nivel
│   │   │       └── OfflineIndicator.tsx  # Indicador offline
│   │   ├── hooks/
│   │   │   └── useOnlineStatus.ts  # Estado de conexión
│   │   ├── lib/
│   │   │   ├── supabase/
│   │   │   │   ├── client.ts       # Cliente browser
│   │   │   │   └── server.ts       # Cliente SSR
│   │   │   └── db/
│   │   │       └── dexie.ts        # IndexedDB setup
│   │   └── types/
│   ├── middleware.ts               # Middleware de rutas
│�── public/                        # Archivos estáticos
├── tests/                          # Tests (Vitest)
├── .claude/                        # Configuración Claude
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Directorios Clave

### `/src/app/` - Next.js 14 App Router

**Grupos de Rutas (Route Groups)**:
- `(auth)` - Flujos de autenticación (login, register)
- `(client)` - Interfaz Wallet para clientes
- `(staff)` - Terminal de escaneo para empleados
- `(admin)` - Dashboard administrativo

**Archivos Principales**:
- `layout.tsx` - Layout raíz con metadata y fuente Inter
- `page.tsx` - Landing page con gradientes púrpura
- `globals.css` - Estilos globales de Tailwind
- `middleware.ts` - Protección de rutas por rol

### `/src/features/` - Módulos por Característica

**Patrón Feature Module**:
Cada feature contiene:
- `components/` - Componentes React específicos
- `hooks/` - Custom hooks de la feature
- `services/` - Lógica de negocio y API
- `types.ts` - Tipos TypeScript del módulo

**Features Implementadas**:

#### auth
- `AuthGuard.tsx` - Componente de protección de rutas
- `useAuth.ts` - Hook de autenticación
- `authService.ts` - Login, registro, logout
- `types.ts` - Profile, UserRole ('admin'|'staff'|'customer'), TierLevel

#### wallet
- `PointsDashboard.tsx` - Dashboard principal con balance
- `TierProgress.tsx` - Barra de progreso hacia siguiente nivel

#### transactions
- `TransactionHistory.tsx` - Lista de transacciones
- `pointsService.ts` - Cálculo de puntos y equivalencias
- `transactionService.ts` - CRUD de transacciones
- `syncService.ts` - Sincronización offline→online
- `useOfflineMutation.ts` - Hook para mutaciones offline

#### gamification
- `LevelProgress.tsx` - Progreso de nivel
- `useTierCalculation.ts` - Hook de cálculo de tier
- `tierService.ts` - Lógica de progresión de nivel
- `tiers.ts` - Constantes de configuración (umbrales, beneficios)

### `/src/shared/` - Recursos Compartidos

#### components/ui
- `TierBadge.tsx` - Insignia visual de nivel con color
- `OfflineIndicator.tsx` - Indicador de estado de conexión

#### lib/supabase
- `client.ts` - Cliente Supabase para browser
- `server.ts` - Cliente Supabase para SSR (@supabase/ssr)

#### lib/db
- `dexie.ts` - Configuración de IndexedDB con:
  - `OfflineTransaction` - Transacciones pendientes
  - `CachedProfile` - Perfiles en cache
  - `SyncOperation` - Cola de operaciones

#### hooks
- `useOnlineStatus.ts` - Detección de online/offline

## Organización de Tipos

### Jerarquía de Tipos

**Archivo**: `/src/features/auth/types.ts`

```typescript
// Roles de usuario
type UserRole = 'admin' | 'staff' | 'customer';

// Niveles de lealtad
type TierLevel = 'explorador' | 'conocedor' | 'embajador';

// Perfil de usuario
interface Profile {
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

// Configuración de tiers
const TIER_CONFIG = {
  explorador: { multiplier: 1.0, label: 'Explorador', color: 'amber' },
  conocedor: { multiplier: 1.2, label: 'Conocedor', color: 'gray' },
  embajador: { multiplier: 1.5, label: 'Embajador', color: 'yellow' },
};
```

**Archivo**: `/src/features/transactions/types.ts`

```typescript
// Tipos de transacción
type TransactionType = 'earn' | 'redeem' | 'adjustment' | 'expiry';

// Estado de transacción
type TransactionStatus = 'pending' | 'completed' | 'cancelled' | 'failed';

// Registro de transacción
interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  points: number;
  points_before: number;
  points_after: number;
  multiplier_applied: number;
  tier_at_transaction: TierLevel;
  description: string;
  reference_id: string | null;
  status: TransactionStatus;
  created_at: string;
  processed_at: string | null;
  staff_id: string | null;
}
```

## Flujo de Navegación

```
Landing Page (/)
    │
    ├─── Login ───┬─── [customer] /wallet ─── /profile
    │             │
    │             ├─── [staff] /scanner
    │             │
    │             └─── [admin] /dashboard
    │
    └─── Register ──┬─── (crea perfil Explorador)
                    └─── (redirección según rol)
```

**Middleware Protection** (`/src/middleware.ts`):
1. Rutas públicas: `/`, `/login`, `/register`
2. Rutas protegidas: todas las demás
3. Redirección automática según rol
4. Validación de sesión con Supabase SSR

## Puntos de Entrada de la Aplicación

| Archivo | Propósito | Descripción |
|---------|-----------|-------------|
| `src/app/layout.tsx` | Layout raíz | Metadata SEO, fuente Inter, estructura HTML |
| `src/app/page.tsx` | Landing page | Homepage con gradiente púrpura, llamadas a la acción |
| `src/middleware.ts` | Middleware | Protección de rutas, redirección por rol |
| `src/shared/lib/db/dexie.ts` | Base local | IndexedDB para transacciones offline |
| `src/shared/lib/supabase/client.ts` | Cliente browser | Supabase client para componentes |
| `src/shared/lib/supabase/server.ts` | Cliente SSR | Supabase server para middleware |

## Consideraciones de Arquitectura

### Renderizado Híbrido

**Server-Side**:
- Landing page (`/src/app/page.tsx`) - SSG para SEO
- Middleware (`/src/middleware.ts`) - SSR para validación de auth
- Layouts - Server components por defecto

**Client-Side**:
- Dashboard interactivo - CSR con 'use client'
- Formularios con React Hook Form - CSR
- Hooks personalizados - CSR

### Patrón Offline-First

**Capa de Persistencia Local**:
```
IndexedDB (Dexie)
├── offlineTransactions  → Transacciones pendientes
├── cachedProfiles       → Perfiles en cache
└── syncOperations       → Cola de operaciones
```

**Flujo de Sincronización**:
1. Usuario crea transacción offline
2. Guardada en IndexedDB con `synced: false`
3. Background Sync detecta conexión
4. `syncService` procesa cola
5. Transacción enviada a Supabase
6. Marcada como `synced: true`

**Servicios Especializados**:
- `syncService.ts` - Orquestador de sincronización
- `useOfflineMutation.ts` - Hook para mutaciones offline-aware
- `useOnlineStatus.ts` - Detección de estado de conexión

### Seguridad por Capas

**Capa 1 - Base de Datos (Supabase)**:
- Row Level Security (RLS) en PostgreSQL
- Políticas por rol en tablas
- Transacciones inmutables (no UPDATE/DELETE)

**Capa 2 - Aplicación (Middleware)**:
- Validación de sesión en cada request
- Redirección por rol
- Protección de rutas sensibles

**Capa 3 - Frontend (Validación)**:
- Zod para validación de forms
- TypeScript para type-safety
- React Hook Form para manejo de forms

**Capa 4 - Cliente (Auth)**:
- Supabase Auth con JWT
- Sesiones con cookies httpOnly
- Tokens refrescados automáticamente

## Servicios Core

### AuthService
**Ubicación**: `/src/features/auth/services/authService.ts`

**Métodos**:
- `register(input)` - Registro con creación de perfil
- `login(input)` - Autenticación con fetch de perfil
- `logout()` - Cierre de sesión
- `getSession()` - Obtener sesión actual
- `getProfile(userId)` - Fetch de perfil

### PointsService
**Ubicación**: `/src/features/transactions/services/pointsService.ts`

**Métodos**:
- `calculatePoints(input)` - Cálculo con multiplicador
- `calculatePointsValue(points)` - Conversión a pesos MXN
- `formatPoints(points)` - Formato con separadores

### TransactionService
**Ubicación**: `/src/features/transactions/services/transactionService.ts`

**Métodos**:
- `createTransaction(input)` - Crear transacción
- `getTransactionSummary(userId)` - Resumen de actividad
- `getUserTransactions(userId)` - Historial completo

### TierService
**Ubicación**: `/src/features/gamification/services/tierService.ts`

**Métodos**:
- `calculateUserTier(userId)` - Calcular nivel actual
- `updateUserTier(userId)` - Actualizar tras transacción
- `getTierProgress(profile)` - Progreso hacia siguiente nivel

### SyncService
**Ubicación**: `/src/features/transactions/services/syncService.ts`

**Métodos**:
- `syncPendingTransactions()` - Procesar cola offline
- `markAsSynced(transactionId)` - Marcar como sincronizado
- `handleSyncError(transactionId, error)` - Manejo de errores

## Hooks Personalizados

### useAuth
**Ubicación**: `/src/features/auth/hooks/useAuth.ts`

**Retorna**:
```typescript
{
  user: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}
```

### useProfile
**Ubicación**: `/src/features/auth/hooks/useProfile.ts`

**Retorna**: Profile con carga automática

### useTierCalculation
**Ubicación**: `/src/features/gamification/hooks/useTierCalculation.ts`

**Retorna**: Progreso hacia siguiente tier con cálculos automáticos

### useOfflineMutation
**Ubicación**: `/src/features/transactions/hooks/useOfflineMutation.ts`

**Propósito**: Wrapper para mutaciones que funcionan offline

### useOnlineStatus
**Ubicación**: `/src/shared/hooks/useOnlineStatus.ts`

**Retorna**: `boolean` indicando estado de conexión

---

**Versión**: 0.1.0
**Última Actualización**: Febrero 2026
**Framework**: Next.js 14 App Router + TypeScript 5
