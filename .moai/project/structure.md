# LoyaltyVibes - Estructura del Proyecto

## Patrón de Arquitectura
**Progressive Web Application (PWA)** con **Next.js 14 App Router** y estructura **Feature-Based**

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
│   └── specs/                      # Especificaciones EARS
│       └── SPEC-001-CORE-LOYALTY.md
├── doc/                            # Documentación estratégica
│   └── dataset.md                  # Informe estratégico original
├── src/
│   ├── app/                        # Next.js 14 App Router
│   │   ├── (auth)/                 # Rutas de autenticación
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx
│   │   ├── (client)/               # Rutas Wallet del Cliente
│   │   │   ├── wallet/
│   │   │   │   ├── page.tsx        # QR dinámico
│   │   │   │   └── components/
│   │   │   ├── rewards/
│   │   │   │   ├── page.tsx        # Catálogo de recompensas
│   │   │   │   └── [id]/
│   │   │   ├── profile/
│   │   │   └── layout.tsx
│   │   ├── (staff)/                # Rutas Terminal de Staff
│   │   │   ├── scanner/
│   │   │   │   ├── page.tsx        # Escáner QR
│   │   │   │   └── components/
│   │   │   ├── transactions/
│   │   │   └── layout.tsx
│   │   ├── (admin)/                # Rutas Dashboard Admin
│   │   │   ├── dashboard/
│   │   │   ├── establishments/
│   │   │   ├── rewards/
│   │   │   ├── analytics/
│   │   │   └── layout.tsx
│   │   ├── api/                    # API Routes (si necesario)
│   │   ├── layout.tsx              # Layout raíz
│   │   ├── page.tsx                # Landing page (SSG/SEO)
│   │   └── manifest.ts             # PWA Manifest
│   ├── features/                   # Módulos por característica
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── services/
│   │   │   │   └── authService.ts
│   │   │   └── types.ts
│   │   ├── wallet/
│   │   │   ├── components/
│   │   │   │   ├── DynamicQR.tsx   # QR con JWT rotativo
│   │   │   │   ├── PointsDashboard.tsx
│   │   │   │   └── TierProgress.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useQRGenerator.ts
│   │   │   └── services/
│   │   │       └── jwtService.ts
│   │   ├── scanner/
│   │   │   ├── components/
│   │   │   │   ├── QRScanner.tsx
│   │   │   │   └── TransactionForm.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useQRValidator.ts
│   │   │   └── services/
│   │   ├── transactions/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   │   └── useOfflineMutation.ts
│   │   │   └── services/
│   │   │       └── syncService.ts
│   │   ├── rewards/
│   │   │   ├── components/
│   │   │   │   └── RewardsGallery.tsx
│   │   │   └── hooks/
│   │   └── gamification/
│   │       ├── components/
│   │       │   └── LevelProgress.tsx
│   │       ├── hooks/
│   │       │   └── useTierCalculation.ts
│   │       └── constants/
│   │           └── tiers.ts
│   ├── shared/                     # Recursos compartidos
│   │   ├── components/
│   │   │   ├── ui/                 # Componentes UI base
│   │   │   └── layout/
│   │   ├── hooks/
│   │   │   ├── useSupabase.ts
│   │   │   └── useOnlineStatus.ts
│   │   ├── lib/
│   │   │   ├── supabase/
│   │   │   │   ├── client.ts
│   │   │   │   └── server.ts
│   │   │   ├── db/
│   │   │   │   └── dexie.ts        # IndexedDB setup
│   │   │   └── jwt/
│   │   │       └── jose.ts
│   │   ├── utils/
│   │   ├── constants/
│   │   └── types/
│   │       ├── database.ts         # Tipos generados de Supabase
│   │       └── index.ts
│   └── assets/
│       ├── images/
│       └── icons/
├── public/
│   ├── icons/                      # Iconos PWA
│   ├── sw.js                       # Service Worker
│   └── manifest.json
├── supabase/
│   ├── migrations/                 # Migraciones SQL
│   │   └── 001_initial_schema.sql
│   └── seed.sql                    # Datos iniciales
├── __tests__/                      # Tests
│   ├── features/
│   └── e2e/
├── .windsurfrules                  # Guía para Cascade/Claude
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## Directorios Clave

### `/src/app/` - Next.js 14 App Router
Rutas organizadas por grupos de rutas (route groups):
- `(auth)` - Flujos de autenticación
- `(client)` - Interfaz Wallet para turistas
- `(staff)` - Terminal de escaneo para empleados
- `(admin)` - Dashboard administrativo

### `/src/features/` - Módulos por Característica
Cada feature contiene todo su código relacionado:
- `components/` - Componentes React específicos
- `hooks/` - Custom hooks de la feature
- `services/` - Lógica de negocio y API
- `types.ts` - Tipos TypeScript

### `/src/shared/lib/` - Librerías Core
- `supabase/` - Clientes Supabase (browser y server)
- `db/dexie.ts` - Configuración IndexedDB para offline
- `jwt/jose.ts` - Generación y validación de tokens JWT

### `/supabase/migrations/` - Esquema de Base de Datos
Migraciones SQL para PostgreSQL con políticas RLS.

## Organización de Módulos

### Patrón Feature Module
```
feature/
├── components/     # UI específica del módulo
├── hooks/          # Lógica de estado y efectos
├── services/       # Llamadas API y lógica de negocio
├── types.ts        # Tipos TypeScript del módulo
└── index.ts        # Exportaciones públicas
```

### Flujo de Navegación

```
Landing (SSG/SEO)
    │
    ├─── Login ───┬─── [Cliente] Wallet ─── Rewards ─── Profile
    │             │
    │             ├─── [Staff] Scanner ─── Transactions
    │             │
    │             └─── [Admin] Dashboard ─── Analytics ─── Settings
```

## Puntos de Entrada

| Archivo | Propósito |
|---------|-----------|
| `src/app/layout.tsx` | Layout raíz, providers globales |
| `src/app/page.tsx` | Landing page (SSG para SEO) |
| `src/app/manifest.ts` | Configuración PWA |
| `public/sw.js` | Service Worker para offline |
| `src/shared/lib/db/dexie.ts` | Base de datos local |

## Consideraciones de Arquitectura

### Renderizado Híbrido
- **SSG**: Landing pages para SEO
- **CSR**: Dashboard interactivos (wallet, scanner, admin)

### Offline-First
- Service Worker para cache de assets
- IndexedDB (Dexie) para datos transaccionales
- Cola de sincronización automática

### Seguridad por Capas
- RLS en Supabase (base de datos)
- JWT firmados para QR (aplicación)
- Validación Zod (frontend)

---
*Generado por MoAI-ADK - Análisis de Dataset*
