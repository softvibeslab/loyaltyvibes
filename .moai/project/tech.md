# LoyaltyVibes - Stack Tecnológico

## Resumen
Progressive Web Application (PWA) Offline-First construida con Next.js 14, optimizada para operar en zonas con conectividad intermitente como San Cristóbal de Las Casas, Chiapas.

## Stack Principal

### Frontend

| Tecnología | Versión | Justificación |
|------------|---------|---------------|
| **Next.js** | 14+ (App Router) | Renderizado híbrido: SSG para marketing/SEO, CSR para dashboards interactivos |
| **React** | 18.2+ | Librería UI con Suspense y Concurrent Features |
| **TypeScript** | 5.3+ | Type-safety obligatorio |
| **Tailwind CSS** | 3.4+ | Estilos utilitarios, diseño responsive |

### Estado y Sincronización

| Tecnología | Propósito |
|------------|-----------|
| **TanStack Query** | Gestión de estado servidor, cache inteligente, reintentos automáticos |
| **Dexie.js** | Wrapper para IndexedDB, persistencia offline de transacciones |
| **Zustand** | Estado cliente ligero (UI state) |

### Backend (BaaS)

| Tecnología | Propósito |
|------------|-----------|
| **Supabase** | Base de datos PostgreSQL, autenticación, tiempo real |
| **PostgreSQL** | Base de datos relacional con RLS (Row Level Security) |
| **Supabase Auth** | Gestión de roles (admin, staff, customer) |
| **Supabase Realtime** | Suscripciones para confirmaciones instantáneas |

### Seguridad QR

| Tecnología | Propósito |
|------------|-----------|
| **jose** | Generación y validación de JWT en el navegador |
| **react-qr-code** | Renderizado de códigos QR |
| **Web Crypto API** | Firma criptográfica del payload |

### PWA / Offline

| Tecnología | Propósito |
|------------|-----------|
| **Service Worker** | Cache de assets y estrategias offline |
| **IndexedDB** | Almacenamiento local de transacciones |
| **Background Sync** | Sincronización cuando regresa conexión |
| **Wake Lock API** | Pantalla activa para terminal de staff |

## Esquema de Base de Datos (PostgreSQL)

### Tablas Principales

```sql
-- Perfiles de usuario (extensión de auth.users)
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

-- Establecimientos participantes
CREATE TABLE establishments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    description TEXT,
    settings JSONB DEFAULT '{}',
    points_per_peso DECIMAL(5,2) DEFAULT 0.1,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Libro mayor de transacciones (inmutable)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    staff_id UUID REFERENCES profiles(id),
    establishment_id UUID REFERENCES establishments(id),
    amount_mxn DECIMAL(10,2) NOT NULL,
    points_change INTEGER NOT NULL,
    transaction_type TEXT CHECK (transaction_type IN ('EARN', 'REDEEM')) NOT NULL,
    multiplier DECIMAL(3,2) DEFAULT 1.0,
    sync_id TEXT, -- Para rastreo offline
    synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Catálogo de recompensas
CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    establishment_id UUID REFERENCES establishments(id),
    name TEXT NOT NULL,
    description TEXT,
    points_required INTEGER NOT NULL,
    min_tier TEXT CHECK (min_tier IN ('explorador', 'conocedor', 'embajador')) DEFAULT 'explorador',
    quantity_available INTEGER,
    active BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Políticas RLS (Row Level Security)

```sql
-- Clientes solo leen sus propias transacciones
CREATE POLICY "Users read own transactions"
ON transactions FOR SELECT
USING (auth.uid() = user_id);

-- Staff puede crear transacciones
CREATE POLICY "Staff insert transactions"
ON transactions FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'staff')
    )
);

-- Nadie puede modificar transacciones (inmutables)
-- No hay política UPDATE/DELETE
```

## Protocolo de Seguridad QR

### Flujo de Tokenización Dinámica

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   App Cliente   │     │   App Staff     │     │    Supabase     │
│   (Wallet)      │     │   (Scanner)     │     │    (Backend)    │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │ 1. Genera JWT         │                       │
         │    cada 30s           │                       │
         │    ┌──────────┐       │                       │
         │    │ Payload: │       │                       │
         │    │ sub: uid │       │                       │
         │    │ iat: now │       │                       │
         │    │ nonce: X │       │                       │
         │    │ exp: +60s│       │                       │
         │    └──────────┘       │                       │
         │                       │                       │
         │ ──── QR Display ────► │                       │
         │                       │                       │
         │                       │ 2. Escanea QR         │
         │                       │    Valida firma       │
         │                       │    Verifica exp       │
         │                       │    Verifica nonce     │
         │                       │                       │
         │                       │ 3. Registra TX ──────►│
         │                       │    (online/offline)   │
         │                       │                       │
         │ ◄─── Realtime ────────┼───────────────────────│
         │      Confirmación     │                       │
```

### Payload JWT

```typescript
interface QRPayload {
    sub: string;      // User UUID
    iat: number;      // Timestamp de generación
    nonce: string;    // Aleatorio único (anti-replay)
    exp: number;      // Expiración (iat + 60 segundos)
}
```

## Herramientas de Desarrollo

### Calidad de Código

| Herramienta | Propósito |
|-------------|-----------|
| ESLint | Linting de código |
| Prettier | Formateo consistente |
| Husky | Git hooks |
| lint-staged | Checks pre-commit |

### Testing

| Herramienta | Propósito |
|-------------|-----------|
| Vitest | Unit testing (recomendado por MoAI) |
| React Testing Library | Testing de componentes |
| Playwright | E2E testing (opcional) |

### Validación

| Herramienta | Propósito |
|-------------|-----------|
| Zod | Validación de esquemas runtime |
| TypeScript | Validación estática de tipos |

## Configuración PWA

### manifest.json

```json
{
    "name": "LoyaltyVibes",
    "short_name": "LoyaltyVibes",
    "description": "Tu wallet de lealtad",
    "start_url": "/wallet",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#7c3aed",
    "icons": [
        {
            "src": "/icons/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/icons/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
```

## Despliegue

### Recomendado

| Servicio | Propósito |
|----------|-----------|
| **Vercel** | Hosting Next.js (Edge optimizado) |
| **Supabase Cloud** | Backend as a Service |

### Variables de Entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# JWT Secret (para firma de QR)
JWT_SECRET=

# App
NEXT_PUBLIC_APP_URL=
```

## Requisitos de Desarrollo

### Sistema
- Node.js 20 LTS
- pnpm (recomendado) o npm

### Navegadores Target
- Chrome/Edge 90+
- Safari 15+
- Firefox 90+

## Métricas de Rendimiento Target

| Métrica | Objetivo | Razón |
|---------|----------|-------|
| FCP (First Contentful Paint) | < 1.5s | Turistas en 4G/roaming |
| LCP (Largest Contentful Paint) | < 2.5s | Core Web Vitals |
| TTI (Time to Interactive) | < 3s | Interactividad rápida |
| Velocidad de escaneo | < 2s | UX crítica para staff |

## Archivos de Configuración

| Archivo | Propósito |
|---------|-----------|
| `package.json` | Dependencias y scripts |
| `tsconfig.json` | Configuración TypeScript |
| `next.config.js` | Configuración Next.js |
| `tailwind.config.ts` | Configuración Tailwind |
| `.windsurfrules` | Guía para IA (Cascade/Claude) |
| `supabase/config.toml` | Configuración local Supabase |

---
*Generado por MoAI-ADK - Análisis de Dataset*
