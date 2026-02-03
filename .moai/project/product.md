# LoyaltyVibes - Documentación de Producto

## Resumen Ejecutivo

**LoyaltyVibes** es una plataforma de fidelización gamificada diseñada específicamente para restaurantes y hoteles en San Cristóbal de Las Casas, Chiapas. Transforma las experiencias de lealtad tradicionales en un sistema interactivo que motiva a los clientes a través de progresión por niveles, recompensas y beneficios exclusivos, con arquitectura offline-first para zonas con conectividad limitada.

## Visión del Producto

Una billetera digital de lealtad que combina:
- **Sistema de niveles progresivo** (Explorador → Conocedor → Embajador)
- **Acumulación inteligente de puntos** con multiplicadores por nivel
- **Arquitectura resiliente** que funciona sin conexión a internet
- **Experiencia gamificada** con indicadores visuales de progreso
- **Multi-rol** para clientes, staff y administradores

## Propuesta de Valor

### Para Clientes
- **Experiencia Gamificada**: Sistema de niveles progresivo que motiva visitas repetidas
- **Recompensas Tangibles**: Puntos canjeables por descuentos y experiencias
- **Multiplicadores Progresivos**: Hasta 1.5x más puntos en niveles altos
- **Dashboard Interactivo**: Seguimiento visual del progreso
- **Funcionalidad Offline**: Operación completa sin conexión

### Para Negocios
- **Retención Mejorada**: Incentivos para visitas recurrentes
- **Gestión Eficiente**: Dashboard administrativo completo
- **Operaciones Simplificadas**: Escáner QR para procesamiento rápido
- **Datos Valiosos**: Análisis de patrones de consumo

## Sistema Multi-Rol

La plataforma soporta tres tipos de usuarios con interfaces personalizadas:

### 1. Cliente (Customer)
**Archivos**: `/src/app/(client)/`

**Características**:
- **Wallet de Puntos** (`/wallet`): Balance actual con equivalencia en pesos MXN
- **Dashboard de Progreso** (`PointsDashboard.tsx`): Indicadores visuales de avance
- **Historial de Transacciones** (`TransactionHistory.tsx`): Registro completo
- **Perfil Personalizado** (`/profile`): Nivel, multiplicador y estadísticas

**Componentes Principales**:
- `TierBadge`: Insignia visual del nivel actual
- `TierProgress`: Barra de progreso animada
- `PointsDashboard`: Tarjeta principal con balance
- `OfflineIndicator`: Estado de conexión

### 2. Staff
**Archivos**: `/src/app/(staff)/`

**Características**:
- **Escáner QR** (`/scanner`): Registro rápido de visitas
- **Procesamiento de Transacciones**: Asignación de puntos por consumo
- **Validación de Clientes**: Verificación de perfiles y niveles

**Flujo de Trabajo**:
1. Escanea código QR del cliente
2. Ingresa monto de consumo
3. Sistema calcula puntos con multiplicador
4. Transacción se registra (online u offline)

### 3. Administrador
**Archivos**: `/src/app/(admin)/`

**Características**:
- **Dashboard Analytics** (`/dashboard`): Métricas globales
- **Gestión de Usuarios**: Vista de base de clientes
- **Configuración**: Parámetros de puntos y niveles

## Sistema de Niveles Gamificado

### Configuración de Niveles

**Archivos**: `/src/features/gamification/constants/tiers.ts`

#### Nivel 1: Explorador
- **Requisitos**: 0 visitas, $0 MXN gastados
- **Multiplicador**: 1.0x (puntos base)
- **Color**: Ámbar
- **Beneficios**:
  - 1 punto por cada $10 MXN
  - Acceso a promociones básicas
  - Historial de transacciones

#### Nivel 2: Conocedor
- **Requisitos**: 5 visitas, $5,000 MXN gastados
- **Multiplicador**: 1.2x (20% más puntos)
- **Color**: Gris
- **Beneficios**:
  - Promociones exclusivas
  - Prioridad en reservaciones
  - Regalo de cumpleaños
  - Acceso prioritario

#### Nivel 3: Embajador
- **Requisitos**: 15 visitas, $15,000 MXN gastados
- **Multiplicador**: 1.5x (50% más puntos)
- **Color**: Dorado
- **Beneficios VIP**:
  - Acceso VIP a eventos exclusivos
  - Descuentos especiales
  - Atención personalizada
  - Invitaciones privadas
  - Beneficios premium

### Sistema de Cálculo de Puntos

**Archivos**: `/src/features/transactions/services/pointsService.ts`

**Tasa Base**: 1 punto = $10 MXN (0.1 puntos por peso)

**Fórmula**:
```
Puntos = (Monto × 0.1) × MultiplicadorNivel × MultiplicadorBonus
```

**Ejemplos**:
- Explorador gasta $500: 500 × 0.1 × 1.0 = **50 puntos**
- Conocedor gasta $500: 500 × 0.1 × 1.2 = **60 puntos**
- Embajador gasta $500: 500 × 0.1 × 1.5 = **75 puntos**

### Tipos de Transacción

**Archivos**: `/src/features/transactions/types.ts`

- **earn**: Acumulación de puntos por compras
- **redeem**: Canje de puntos por recompensas
- **adjustment**: Ajustes administrativos
- **expiry**: Expiración de puntos (futuro)

## Arquitectura Offline-First

### Capacidades Offline

**Archivos**: `/src/shared/lib/db/dexie.ts`, `/src/features/transactions/services/syncService.ts`

LoyaltyVibes implementa estrategia offline-first con:

- **Transacciones Locales**: Registro de compras y canjes sin conexión
- **Caching de Perfil**: Acceso a datos básicos del usuario
- **Sincronización Automática**: Replicación cuando se restablece conexión
- **Indicadores Visuales**: UI muestra estado de conexión (`OfflineIndicator`)

### Base de Datos Local (Dexie/IndexedDB)

**Esquema**:
```typescript
// Transacciones pendientes de sincronización
interface OfflineTransaction {
  sync_id: string;           // ID único
  user_id: string;
  type: 'earn' | 'redeem';
  amount: number;
  description: string;
  tier: string;
  synced: boolean;           // Estado de sincronización
  sync_attempts: number;     // Reintentos realizados
  error?: string;            // Último error si falló
}

// Perfiles cacheados para acceso offline
interface CachedProfile {
  id: string;
  data: Profile;
  updated_at: string;
}

// Operaciones pendientes
interface SyncOperation {
  operation: 'create' | 'update' | 'delete';
  table: string;
  data: Record<string, unknown>;
  synced: boolean;
}
```

### Estrategia de Sincronización

1. **Cola de Operaciones**: Transacciones pendientes almacenadas localmente
2. **Reintentos Automáticos**: Backoff exponencial para fallos
3. **Prevención de Duplicados**: IDs únicos (UUID) para cada transacción
4. **Limpieza Automática**: Datos antiguos eliminados después de 24h

**Hooks Especializados**:
- `useOnlineStatus`: Detecta estado de conexión
- `useOfflineMutation`: Maneja mutaciones offline con sincronización

## Experiencia de Usuario

### Flujos Principales

#### 1. Registro y Onboarding

**Archivos**: `/src/app/(auth)/login/page.tsx`, `/src/app/(auth)/register/page.tsx`

**Flujo**:
1. Usuario accede a landing page (`/src/app/page.tsx`)
2. Selecciona "Registrarse" y completa formulario
3. Validación con Zod (email, password con mayúscula y número)
4. Creación de perfil automáticamente en nivel "Explorador"
5. Redirección según rol del usuario:
   - Customer → `/wallet`
   - Staff → `/scanner`
   - Admin → `/dashboard`

#### 2. Acumulación de Puntos (Cliente)

**Archivos**: `/src/app/(client)/wallet/page.tsx`, `/src/features/wallet/components/PointsDashboard.tsx`

**Flujo**:
1. Cliente visita establecimiento participante
2. Abre wallet y presenta código QR
3. Staff escanea código y registra monto de consumo
4. Puntos calculados automáticamente con multiplicador
5. Cliente ve notificación de puntos ganados
6. Progreso hacia siguiente nivel se actualiza

**Componentes Visuales**:
- Badge de nivel con color distintivo
- Barra de progreso animada hacia siguiente nivel
- Balance actual con equivalencia en pesos
- Multiplicador activo destacado

#### 3. Canje de Recompensas

**Archivos**: `/src/features/transactions/components/TransactionHistory.tsx`

**Flujo**:
1. Cliente navega a historial de transacciones
2. Selecciona "Canjear Puntos"
3. Especifica cantidad y descripción
4. Sistema valida saldo suficiente
5. Transacción registrada y balance actualizado
6. Confirmación visual inmediata

#### 4. Procesamiento de Transacciones (Staff)

**Archivos**: `/src/app/(staff)/scanner/page.tsx`

**Flujo Offline**:
1. Staff escanea QR del cliente (sin internet)
2. Sistema valida firma criptográfica localmente
3. Staff ingresa monto de consumo
4. Transacción guardada en cola local (IndexedDB)
5. Sincronización automática al recuperar conexión

**Flujo Online**:
1. Staff escanea QR del cliente
2. Validación en tiempo real con Supabase
3. Transacción inmediata a base de datos
4. Confirmación instantánea al cliente

## Componentes de UI

### Componentes Compartidos

**Archivos**: `/src/shared/components/ui/`

#### TierBadge
```typescript
interface TierBadgeProps {
  tier: TierLevel;        // 'explorador' | 'conocedor' | 'embajador'
  size?: 'sm' | 'md' | 'lg';
}
```
Muestra insignia visual del nivel con color distintivo.

#### TierProgress
```typescript
interface TierProgressProps {
  currentTier: TierLevel;
  totalSpent: number;
  visitCount: number;
}
```
Barra de progreso animada hacia siguiente nivel.

#### PointsDashboard
```typescript
interface PointsDashboardProps {
  profile: Profile;
}
```
Tarjeta principal con:
- Balance de puntos actual
- Equivalencia en pesos MXN
- Multiplicador activo
- Contador de visitas
- Resumen de transacciones del mes

#### OfflineIndicator
Indicador visual de estado de conexión con icono y mensaje.

#### TransactionHistory
Lista cronológica de movimientos con:
- Tipo de transacción (earn/redeem)
- Monto y puntos
- Fecha y hora
- Descripción

### Paleta de Colores

**Definición**: `/tailwind.config.ts`

- **Primario**: Púrpura (#9333EA) - Identidad de marca
- **Secundario**: Esmeralda (#10B981) - Puntos y éxito
- **Nivel Explorador**: Ámber (#F59E0B) - Nivel inicial
- **Nivel Conocedor**: Gris (#6B7280) - Nivel intermedio
- **Nivel Embajador**: Dorado (#EAB308) - Nivel premium

### Tipografía

**Fuente**: Inter (Google Fonts)
- Títulos: Bold, tamaños responsivos
- Cuerpo: Regular, legible en móviles
- Números: Tabular figures para alineación

## Casos de Uso Detallados

### Cliente Turista
- **Contexto**: Visitante ocasional de San Cristóbal
- **Necesidad**: Acumular puntos durante estadía corta
- **Beneficio**: Recompensas inmediatas sin compromiso a largo plazo
- **Flujo Típico**: Registro → Comidas en restaurantes → Canje antes de partir

### Cliente Local Frecuente
- **Contexto**: Residente que visita regularmente
- **Necesidad**: Maximizar valor de visitas recurrentes
- **Beneficio**: Progresión a niveles altos con multiplicadores significativos
- **Flujo Típico**: visitas semanales → Progresión a Embajador → Beneficios VIP

### Personal de Staff
- **Contexto**: Empleado en restaurante/hotel
- **Necesidad**: Procesar transacciones rápidamente
- **Beneficio**: Interfaz simplificada con escáner QR eficiente
- **Flujo Típico**: Escaneo → Monto → Confirmación (en <30 segundos)

### Administrador del Negocio
- **Contexto**: Gerente dueño del programa de lealtad
- **Necesidad**: Monitorear rendimiento y ajustar parámetros
- **Beneficio**: Dashboard completo con métricas y controles
- **Flujo Típico**: Revisar analytics → Ajustar promociones → Medir ROI

## Métricas de Éxito

### KPIs de Cliente
- **Tasa de Retención**: Porcentaje de usuarios con visitas repetidas
- **Progresión de Nivel**: Usuarios avanzando de Explorador → Embajador
- **Frecuencia de Canje**: Transacciones de canje por usuario
- **Tiempo entre Visitas**: Días promedio entre transacciones

### KPIs de Negocio
- **CLV (Customer Lifetime Value)**: Valor total por cliente
- **Ticket Promedio**: Incremento en consumo promedio
- **Tasa de Activación**: Registro → primera visita
- **NPS (Net Promoter Score)**: Satisfacción del cliente

### KPIs Técnicos
- **Sincronización Exitosa**: % de transacciones offline sincronizadas
- **Tiempo de Carga**: FCP < 1.5s en 4G
- **Velocidad de Escaneo**: < 2 segundos por QR
- **Disponibilidad**: % uptime del sistema

## Roadmap del Producto

### Fase 1: MVP (Actual - v0.1.0)

**Implementado**:
- ✅ Sistema multi-rol completo (customer, staff, admin)
- ✅ Tres niveles de lealtad (Explorador, Conocedor, Embajador)
- ✅ Acumulación y canje de puntos
- ✅ Arquitectura offline-first con Dexie
- ✅ Middleware de rutas por rol
- ✅ Dashboard de puntos y progreso
- ✅ Historial de transacciones

### Fase 2: Mejoras Próximas

**Planeado**:
- 📋 Sistema de catálogo de recompensas
- 📋 Notificaciones push para nuevas transacciones
- 📋 Integración con redes sociales (compartir logros)
- 📋 Badges y logros adicionales
- 📋 Exportación de datos para administradores

### Fase 3: Escalabilidad

**Futuro**:
- 📋 Multi-tenancia (múltiples establecimientos)
- 📋 API para integraciones POS
- 📋 Analytics avanzados con dashboards personalizados
- 📋 Programa de referidos
- 📋 Integración con sistemas de pago

## Diferenciadores Competitivos

1. **Enfoque Local**: Diseñado específicamente para San Cristóbal de Las Casas
2. **Sistema Híbrido**: Balance entre simplicidad y gamificación sofisticada
3. **Offline-First**: Funciona en áreas con conectividad limitada
4. **UX Visual**: Indicadores progresivos y elementos motivadores
5. **Arquitectura Moderna**: Base tecnológica escalable y mantenible
6. **Multi-Rol**: Solución unificada para clientes, staff y administración

## Validación de Esquemas

**Archivos**: `/src/features/auth/types.ts`, `/src/features/transactions/types.ts`

### Registro de Usuario (Zod)
```typescript
registerSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Requiere mayúscula')
    .regex(/[0-9]/, 'Requiere número'),
  name: z.string().min(2).optional(),
  role: z.enum(['admin', 'staff', 'customer']).default('customer')
})
```

### Transacción (Zod)
```typescript
createTransactionSchema = z.object({
  user_id: z.string().uuid(),
  type: z.enum(['earn', 'redeem', 'adjustment', 'expiry']),
  amount: z.number().positive(),
  points: z.number().int(),
  description: z.string().min(1).max(255),
  reference_id: z.string().optional()
})
```

---

**Versión**: 0.1.0
**Última Actualización**: Febrero 2026
**Idioma**: Español (es-MX)
**Framework**: Next.js 14 App Router
