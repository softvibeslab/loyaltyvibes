---
id: SPEC-GAMIFICATION-002
version: "1.0.0"
status: draft
created: "2026-02-03"
updated: "2026-02-03"
author: "MoAI-ADK"
priority: MEDIUM
---

# HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-03 | MoAI-ADK | Initial SPEC creation - Gamification Enhancement |

---

# SPEC-GAMIFICATION-002: Sistema de Recompensas y Gamificación Avanzada

## Overview

| Field | Value |
|-------|-------|
| **SPEC ID** | SPEC-GAMIFICATION-002 |
| **Title** | Sistema de Recompensas y Gamificación Avanzada |
| **Priority** | MEDIUM (Feature Enhancement) |
| **Domain** | GAMIFICATION |
| **Lifecycle** | spec-anchored (Level 2) |
| **Dependencies** | SPEC-AUTH-001 (Core Loyalty Engine) |

## Description

Extensión del sistema de lealtad existente para agregar funcionalidad completa de recompensas, catálogo de premios canjeables, sistema de logros y badgificación, seguimiento de rachas (streaks), y mecánicas de engagement para mejorar la retención de usuarios en LoyaltyVibes. Esta especificación complementa el motor de lealtad base (SPEC-AUTH-001) añadiendo capas de gamificación sofisticada.

**Tipo de Especificación**: REFACTOR + MEJORA (el sistema base existe, esta SPEC añade funcionalidad)

---

## 1. Environment

### 1.1 Contexto del Sistema Existente

**Estado Actual** (SPEC-AUTH-001 implementado):

| Componente | Estado | Archivos |
|------------|--------|----------|
| Sistema de 3 niveles | ✅ Implementado | `/src/features/gamification/constants/tiers.ts` |
| Cálculo de puntos | ✅ Implementado | `/src/features/transactions/services/pointsService.ts` |
| Promoción automática de niveles | ✅ Implementado | `/supabase/migrations/002_tier_trigger.sql` |
| Dashboard de puntos | ✅ Implementado | `/src/features/wallet/components/PointsDashboard.tsx` |
| Historial de transacciones | ✅ Implementado | `/src/features/transactions/components/TransactionHistory.tsx` |
| Offline-first | ✅ Implementado | `/src/shared/lib/db/dexie.ts` |

**Gaps Identificados**:

| Gap | Impacto | Prioridad |
|-----|---------|-----------|
| Sin catálogo de recompensas | Alto | Alta |
| Canje de puntos básico | Medio | Alta |
| Sin sistema de logros | Medio | Media |
| Sin seguimiento de rachas | Medio | Media |
| Beneficios de nivel no implementados | Bajo | Baja |

### 1.2 Stack Técnico

| Layer | Technology | Versión | Purpose |
|-------|------------|---------|---------|
| Frontend | Next.js | 14+ (App Router) | Hybrid rendering |
| Frontend | React | 18.2+ | UI components |
| Frontend | TypeScript | 5.3+ | Type safety |
| State | TanStack Query | Latest | Server state |
| Database | Supabase | Latest | PostgreSQL |
| Cache | Dexie.js | Latest | IndexedDB (offline) |
| Validation | Zod | Latest | Schema validation |

### 1.3 Niveles de Lealtad (Configuración Base)

| Tier | Nombre | Requisito | Multiplicador | Color |
|------|--------|-----------|--------------|-------|
| explorador | Explorador | Registro | 1.0x | Ámber |
| conocedor | Conocedor | 5 visitas Y $5,000 MXN | 1.2x | Gris |
| embajador | Embajador | 15 visitas Y $15,000 MXN | 1.5x | Púrpura |

**Nota**: Ambas condiciones (visitas Y gasto) deben cumplirse para ascender.

---

## 2. Assumptions

### 2.1 Suposiciones Técnicas

| ID | Suposición | Confianza |
|----|------------|-----------|
| A-01 | Supabase puede almacenar catálogo de recompensas | ALTA |
| A-02 | RLS policies pueden restringir canje por nivel | ALTA |
| A-03 | Imágenes de recompensas pueden almacenarse en Supabase Storage | MEDIA |
| A-04 | Sistema de notificaciones push está disponible | BAJA |
| A-05 | Dexie.js puede cachear catálogo de recompensas | ALTA |

### 2.2 Suposiciones de Negocio

| ID | Suposición | Confianza |
|----|------------|-----------|
| B-01 | Tasa de canje: 100 puntos = $10 MXN | ALTA |
| B-02 | Recompensas tienen stock limitado | MEDIA |
| B-03 | Recompensas pueden estar restringidas por nivel | ALTA |
| B-04 | Rachas semanales motivan visitas recurrentes | MEDIA |
| B-05 | Logros desbloqueables aumentan engagement | MEDIA |

### 2.3 Suposiciones de Usuario

| ID | Suposición | Confianza |
|----|------------|-----------|
| U-01 | Clientes entienden el sistema de puntos | ALTA |
| U-02 | Clientes valoran recompensas tangibles | ALTA |
| U-03 | Usuarios comparten logros en redes sociales | BAJA |
| U-04 | Clientes verifican disponibilidad de recompensas | MEDIA |

---

## 3. Requirements (EARS Format)

### 3.1 Ubiquitous Requirements

| ID | Requirement |
|----|-------------|
| U-01 | El sistema **deberá** mostrar el catálogo de recompensas disponibles a todos los usuarios autenticados |
| U-02 | El sistema **deberá** validar que el usuario tenga suficientes puntos antes de canjear |
| U-03 | El sistema **deberá** registrar todas las transacciones de canje con timestamp |
| U-04 | El sistema **deberá** actualizar el balance de puntos inmediatamente después del canje |
| U-05 | El sistema **deberá** respetar las restricciones de nivel para recompensas exclusivas |
| U-06 | El sistema **deberá** mantener un historial de recompensas canjeadas por usuario |
| U-07 | El sistema **deberá** calcular la disponibilidad de stock en tiempo real |
| U-08 | El sistema **deberá** cachear el catálogo de recompensas para acceso offline |
| U-09 | El sistema **deberá** mostrar logros desbloqueados en el perfil del usuario |
| U-10 | El sistema **deberá** notificar al usuario cuando se desbloquea un nuevo logro |

### 3.2 Event-Driven Requirements

| ID | Event | Action |
|----|-------|--------|
| E-01 | **CUANDO** usuario selecciona una recompensa **ENTONCES** mostrar detalles completos incluyendo descripción, costo en puntos, stock disponible y restricciones de nivel |
| E-02 | **CUANDO** usuario confirma canje de recompensa **ENTONCES** validar puntos suficientes, crear transacción tipo 'redeem', descontar puntos y decrementar stock |
| E-03 | **CUANDO** usuario completa primera transacción **ENTONCES** desbloquear logro "Primera Visita" |
| E-04 | **CUANDO** usuario asciende a nivel "Conocedor" **ENTONCES** desbloquear logro "Conocedor" y mostrar notificación |
| E-05 | **CUANDO** usuario asciende a nivel "Embajador" **ENTONCES** desbloquear logro "Embajador" con celebración especial |
| E-06 | **CUANDO** usuario completa 3 visitas consecutivas en una semana **ENTONCES** otorgar logro "Racha Semanal" y bonus de puntos |
| E-07 | **CUANDO** usuario canjea primera recompensa **ENTONCES** desbloquear logro "Primer Canje" |
| E-08 | **CUANDO** stock de recompensa llega a 0 **ENTONCES** marcar como "Agotado" y ocultar del catálogo |
| E-09 | **CUANDO** stock es reabastecido **ENTONCES** marcar como "Disponible" y notificar a usuarios en lista de espera |
| E-10 | **CUANDO** usuario visita establecimiento 7 días seguidos **ENTONCES** otorgar logro "Visitante Devoto" |
| E-11 | **CUANDO** usuario acumula 10,000 puntos en total **ENTONCES** desbloquear logro "Acumulador" |
| E-12 | **CUANDO** usuario canjea recompensa exclusiva de nivel **ENTONCES** mostrar mensaje de felicitación personalizado |

### 3.3 State-Driven Requirements

| ID | Condition | Action |
|----|-----------|--------|
| S-01 | **SI** usuario.points_balance < recompensa.cost **ENTONCES** deshabilitar botón de canje y mostrar mensaje "Puntos insuficientes" |
| S-02 | **SI** usuario.tier < recompensa.min_tier **ENTONCES** mostrar recompensa con filtro gris y mensaje "Disponible para nivel {tier}" |
| S-03 | **SI** recompensa.stock === 0 **ENTONCES** mostrar etiqueta "Agotado" y deshabilitar canje |
| S-04 | **SI** recompensa.stock <= 5 **ENTONCES** mostrar etiqueta "¡Últimas unidades!" con color de advertencia |
| S-05 | **SI** usuario.tier === 'embajador' **ENTONCES** mostrar sección de recompensas exclusivas VIP |
| S-06 | **SI** dispositivo está offline **ENTONCES** permitir ver catálogo pero deshabilitar canje con mensaje "Conexión requerida" |
| S-07 | **SI** usuario tiene recompensa en lista de espera **ENTONCES** notificar cuando stock sea reabastecido |
| S-08 | **SI** streak_actual >= streak_mejor **ENTONCES** actualizar streak_mejor y mostrar notificación de "¡Nuevo Récord!" |

### 3.4 Optional Requirements

| ID | Feature |
|----|---------|
| O-01 | **DONDE** sea posible, permitir lista de espera para recompensas agotadas |
| O-02 | **DONDE** sea posible, mostrar recompensas recomendadas basadas en nivel del usuario |
| O-03 | **DONDE** sea posible, permitir compartir logros en redes sociales |
| O-04 | **DONDE** sea posible, implementar sistema de referidos con recompensas |
| O-05 | **DONDE** sea posible, mostrar leaderboard de usuarios con más puntos |
| O-06 | **DONDE** sea posible, permitir personalización de recompensas (ej: elegir nombre en taza personalizada) |

### 3.5 Unwanted Behavior Requirements

| ID | Prohibition |
|----|-------------|
| N-01 | El sistema **NO DEBERÁ** permitir canje de recompensas si stock es insuficiente |
| N-02 | El sistema **NO DEBERÁ** permitir balance de puntos negativo después del canje |
| N-03 | El sistema **NO DEBERÁ** permitir canje de recompensas exclusivas de nivel superior |
| N-04 | El sistema **NO DEBERÁ** mostrar recompensas agotadas como disponibles |
| N-05 | El sistema **NO DEBERÁ** permitir canje offline (requiere validación de stock) |
| N-06 | El sistema **NO DEBERÁ** permitir duplicación de logros ya desbloqueados |
| N-07 | El sistema **NO DEBERÁ** permitir modificación de transacciones de canje completadas |
| N-08 | El sistema **NO DEBERÁ** exponer información de stock a usuarios no autenticados |

### 3.6 Complex Requirements

| ID | Requirement |
|----|-------------|
| C-01 | **MIENTRAS** usuario tiene recompensa en lista de espera **Y CUANDO** stock es reabastecido **ENTONCES** enviar notificación push y mantener en lista por 24 horas antes de remover |
| C-02 | **MIENTRAS** streak_activa === true **Y CUANDO** usuario visita establecimiento **ENTONCES** incrementar contador y verificar si cumple criterio de logro |
| C-03 | **MIENTRAS** usuario.tier === 'conocedor' **Y CUANDO** total_spent >= 15000 **Y** visit_count >= 15 **ENTONCES** promover a 'embajador' y desbloquear logro automáticamente |
| C-04 | **MIENTRAS** recompensa.es_limitada === true **Y CUANDO** stock <= 3 **ENTONCES** mostrar contador regresivo de unidades restantes |
| C-05 | **MIENTRAS** dispositivo offline **Y CUANDO** usuario navega catálogo **ENTONCES** mostrar versión caché con indicador de "puede no estar actualizado" |

---

## 4. Database Schema

### 4.1 Nueva Tabla: rewards

```sql
CREATE TABLE IF NOT EXISTS public.rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    points_cost INTEGER NOT NULL CHECK (points_cost > 0),
    stock INTEGER DEFAULT NULL, -- NULL = ilimitado
    image_url TEXT,
    min_tier TEXT CHECK (min_tier IN ('explorador', 'conocedor', 'embajador')) DEFAULT 'explorador',
    category TEXT, -- 'food', 'merchandise', 'experience', 'discount'
    is_active BOOLEAN DEFAULT true,
    is_limited BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes para búsquedas comunes
CREATE INDEX IF NOT EXISTS idx_rewards_category ON public.rewards(category);
CREATE INDEX IF NOT EXISTS idx_rewards_min_tier ON public.rewards(min_tier);
CREATE INDEX IF NOT EXISTS idx_rewards_is_active ON public.rewards(is_active);
```

### 4.2 Nueva Tabla: redemptions

```sql
CREATE TABLE IF NOT EXISTS public.redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE SET NULL,
    transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
    points_used INTEGER NOT NULL,
    redemption_code TEXT UNIQUE NOT NULL, -- Código para validar en establecimiento
    status TEXT CHECK (status IN ('pending', 'claimed', 'expired', 'cancelled')) DEFAULT 'pending',
    claimed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_redemptions_user_id ON public.redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_status ON public.redemptions(status);
CREATE INDEX IF NOT EXISTS idx_redemptions_redemption_code ON public.redemptions(redemption_code);
```

### 4.3 Nueva Tabla: achievements

```sql
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL, -- 'first_visit', 'conocedor_tier', 'weekly_streak'
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_emoji TEXT,
    points_bonus INTEGER DEFAULT 0,
    tier_requirement TEXT CHECK (tier_requirement IN ('explorador', 'conocedor', 'embajador')),
    is_secret BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Logros predefinidos
INSERT INTO public.achievements (code, name, description, icon_emoji, points_bonus) VALUES
('first_visit', 'Primera Visita', 'Completa tu primera transacción', '🎉', 50),
('conocedor', 'Conocedor', 'Alcanza el nivel Conocedor', '⭐', 100),
('embajador', 'Embajador', 'Alcanza el nivel Embajador', '👑', 200),
('first_redemption', 'Primer Canje', 'Canjea tu primera recompensa', '🎁', 75),
('weekly_streak', 'Racha Semanal', 'Visita el establecimiento 3 días en una semana', '🔥', 150),
('devoted_visitor', 'Visitante Devoto', 'Visita 7 días consecutivos', '💚', 300),
('accumulator', 'Acumulador', 'Acumula 10,000 puntos en total', '💰', 500);
```

### 4.4 Nueva Tabla: user_achievements

```sql
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Trigger para otorgar puntos bonus al desbloquear logro
CREATE OR REPLACE FUNCTION public.grant_achievement_bonus()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET points_balance = points_balance + (
        SELECT points_bonus FROM public.achievements WHERE id = NEW.achievement_id
    )
    WHERE id = NEW.user_id;

    -- Crear transacción de ajuste
    INSERT INTO public.transactions (
        user_id, type, amount, points, points_before, points_after,
        multiplier_applied, tier_at_transaction, description, status, processed_at
    )
    SELECT
        NEW.user_id,
        'adjustment',
        0,
        (SELECT points_bonus FROM public.achievements WHERE id = NEW.achievement_id),
        (SELECT points_balance FROM public.profiles WHERE id = NEW.user_id) - (SELECT points_bonus FROM public.achievements WHERE id = NEW.achievement_id),
        (SELECT points_balance FROM public.profiles WHERE id = NEW.user_id),
        1.0,
        'explorador',
        'Logro: ' || (SELECT name FROM public.achievements WHERE id = NEW.achievement_id),
        'completed',
        NOW()
    ;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_grant_achievement_bonus
AFTER INSERT ON public.user_achievements
FOR EACH ROW
EXECUTE FUNCTION public.grant_achievement_bonus();
```

### 4.5 Nueva Tabla: streaks

```sql
CREATE TABLE IF NOT EXISTS public.streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    last_visit_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Función para actualizar racha
CREATE OR REPLACE FUNCTION public.update_streak()
RETURNS TRIGGER AS $$
DECLARE
    current_streak_val INTEGER;
    last_visit DATE;
BEGIN
    -- Obtener racha actual del usuario
    SELECT current_streak, last_visit_date INTO current_streak_val, last_visit
    FROM public.streaks
    WHERE user_id = NEW.user_id;

    -- Si no existe registro, crearlo
    IF NOT FOUND THEN
        INSERT INTO public.streaks (user_id, current_streak, best_streak, last_visit_date)
        VALUES (NEW.user_id, 1, 1, CURRENT_DATE);
        RETURN NEW;
    END IF;

    -- Verificar si es visita consecutiva (día siguiente o mismo día)
    IF last_visit = CURRENT_DATE - INTERVAL '1 day' OR last_visit = CURRENT_DATE THEN
        -- Incrementar racha (solo si es día diferente)
        IF last_visit != CURRENT_DATE THEN
            current_streak_val := current_streak_val + 1;

            UPDATE public.streaks
            SET
                current_streak = current_streak_val,
                best_streak = GREATEST(best_streak, current_streak_val),
                last_visit_date = CURRENT_DATE,
                updated_at = NOW()
            WHERE user_id = NEW.user_id;

            -- Verificar logros de racha
            IF current_streak_val = 3 THEN
                -- Desbloquear logro "Racha Semanal"
                INSERT INTO public.user_achievements (user_id, achievement_id)
                SELECT NEW.user_id, id FROM public.achievements WHERE code = 'weekly_streak'
                ON CONFLICT (user_id, achievement_id) DO NOTHING;
            ELSIF current_streak_val = 7 THEN
                -- Desbloquear logro "Visitante Devoto"
                INSERT INTO public.user_achievements (user_id, achievement_id)
                SELECT NEW.user_id, id FROM public.achievements WHERE code = 'devoted_visitor'
                ON CONFLICT (user_id, achievement_id) DO NOTHING;
            END IF;
        END IF;
    ELSIF last_visit < CURRENT_DATE - INTERVAL '1 day' THEN
        -- Romper racha
        UPDATE public.streaks
        SET
            current_streak = 1,
            last_visit_date = CURRENT_DATE,
            updated_at = NOW()
        WHERE user_id = NEW.user_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para actualizar racha en cada transacción earn
CREATE TRIGGER trigger_update_streak
AFTER INSERT OR UPDATE OF status ON public.transactions
FOR EACH ROW
WHEN (NEW.status = 'completed' AND NEW.type = 'earn')
EXECUTE FUNCTION public.update_streak();
```

### 4.6 RLS Policies

```sql
-- Habilitar RLS
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

-- Políticas para rewards (todos los autenticados pueden ver)
CREATE POLICY "Authenticated users can view rewards"
ON public.rewards FOR SELECT
TO authenticated
USING (is_active = true);

-- Solo admin puede gestionar rewards
CREATE POLICY "Admins can manage rewards"
ON public.rewards FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Políticas para redemptions
CREATE POLICY "Users can view own redemptions"
ON public.redemptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create redemptions"
ON public.redemptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can verify redemptions"
ON public.redemptions FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
);

-- Políticas para achievements (todos pueden ver)
CREATE POLICY "Everyone can view achievements"
ON public.achievements FOR SELECT
USING (true);

-- Políticas para user_achievements
CREATE POLICY "Users can view own achievements"
ON public.user_achievements FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can grant achievements"
ON public.user_achievements FOR INSERT
WITH CHECK (true);

-- Políticas para streaks
CREATE POLICY "Users can view own streak"
ON public.streaks FOR SELECT
USING (auth.uid() = user_id);
```

---

## 5. Architecture Design

### 5.1 Estructura de Módulos

```
src/features/rewards/
├── components/
│   ├── RewardCatalog.tsx          # Catálogo principal de recompensas
│   ├── RewardCard.tsx             # Tarjeta individual de recompensa
│   ├── RewardDetailModal.tsx      # Modal con detalles y canje
│   ├── RedemptionHistory.tsx      # Historial de canjes del usuario
│   └── RedemptionQR.tsx           # QR code para validar canje
├── services/
│   ├── rewardsService.ts          # CRUD de recompensas
│   ├── redemptionService.ts       # Lógica de canje
│   └── achievementService.ts      # Gestión de logros
├── hooks/
│   ├── useRewards.ts              # TanStack Query para catálogo
│   ├── useRedemption.ts           # Mutación de canje
│   └── useAchievements.ts         # Logros del usuario
├── types.ts                       # TypeScript types + Zod schemas
└── __tests__/
    ├── rewardsService.test.ts
    └── redemptionService.test.ts

src/features/gamification/ (existente + extensiones)
├── components/
│   ├── AchievementBadge.tsx       # [NUEVO] Badge de logro
│   ├── AchievementGrid.tsx        # [NUEVO] Grid de logros desbloqueados
│   ├── StreakTracker.tsx          # [NUEVO] Indicador de racha actual
│   └── LevelProgress.tsx          # [YA EXISTE] Barra de progreso
├── services/
│   ├── tierService.ts             # [YA EXISTE]
│   └── streakService.ts           # [NUEVO] Lógica de rachas
└── constants/
    ├── tiers.ts                   # [YA EXISTE]
    └── achievements.ts            # [NUEVO] Catálogo de logros
```

### 5.2 Tipos de TypeScript

```typescript
// src/features/rewards/types.ts

import { z } from 'zod';
import { TierLevel } from '@/features/auth/types';

// Categorías de recompensas
export const REWARD_CATEGORIES = [
  'food',
  'merchandise',
  'experience',
  'discount',
  'drink',
] as const;
export type RewardCategory = (typeof REWARD_CATEGORIES)[number];

// Estados de canje
export const REDEMPTION_STATUS = [
  'pending',
  'claimed',
  'expired',
  'cancelled',
] as const;
export type RedemptionStatus = (typeof REDEMPTION_STATUS)[number];

// Schema para recompensa
export const rewardSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  points_cost: z.number().int().positive(),
  stock: z.number().int().min(0).nullable(),
  image_url: z.string().url().nullable(),
  min_tier: z.enum(['explorador', 'conocedor', 'embajador']),
  category: z.enum(REWARD_CATEGORIES),
  is_active: z.boolean(),
  is_limited: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Reward = z.infer<typeof rewardSchema>;

// Schema para canje
export const redemptionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  reward_id: z.string().uuid(),
  transaction_id: z.string().uuid(),
  points_used: z.number().int().positive(),
  redemption_code: z.string(),
  status: z.enum(REDEMPTION_STATUS),
  claimed_at: z.string().nullable(),
  expires_at: z.string(),
  created_at: z.string(),
});

export type Redemption = z.infer<typeof redemptionSchema>;

// Schema para crear canje
export const createRedemptionSchema = z.object({
  reward_id: z.string().uuid('ID de recompensa inválido'),
  user_id: z.string().uuid('ID de usuario inválido'),
});

export type CreateRedemptionInput = z.infer<typeof createRedemptionSchema>;

// Schema para logro
export const achievementSchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(300),
  icon_emoji: z.string().emoji().nullable(),
  points_bonus: z.number().int().min(0).default(0),
  tier_requirement: z.enum(['explorador', 'conocedor', 'embajador']).nullable(),
  is_secret: z.boolean().default(false),
  created_at: z.string(),
});

export type Achievement = z.infer<typeof achievementSchema>;

// Schema para logro de usuario
export const userAchievementSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  achievement_id: z.string().uuid(),
  unlocked_at: z.string(),
  achievement: achievementSchema,
});

export type UserAchievement = z.infer<typeof userAchievementSchema>;

// Schema para racha
export const streakSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  current_streak: z.number().int().min(0).default(0),
  best_streak: z.number().int().min(0).default(0),
  last_visit_date: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Streak = z.infer<typeof streakSchema>;
```

### 5.3 Servicios Core

#### rewardsService.ts

```typescript
// src/features/rewards/services/rewardsService.ts

class RewardsService {
  private supabase = createClient();

  /**
   * Obtener catálogo de recompensas activas
   * Filtra por nivel del usuario si se proporciona
   */
  async getActiveRewards(userTier?: TierLevel): Promise<Reward[]> {
    let query = this.supabase
      .from('rewards')
      .select('*')
      .eq('is_active', true)
      .order('points_cost', { ascending: true });

    // Filtrar por nivel (solo mostrar recompensas accesibles)
    if (userTier) {
      const tierOrder = ['explorador', 'conocedor', 'embajador'];
      const userTierIndex = tierOrder.indexOf(userTier);

      // Obtener recompensas donde min_tier sea <= userTier
      query = query.filter('min_tier', 'in', tierOrder.slice(0, userTierIndex + 1));
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  /**
   * Obtener detalle de recompensa individual
   */
  async getRewardById(rewardId: string): Promise<Reward | null> {
    const { data, error } = await this.supabase
      .from('rewards')
      .select('*')
      .eq('id', rewardId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Verificar disponibilidad de stock
   */
  async checkAvailability(rewardId: string): Promise<boolean> {
    const reward = await this.getRewardById(rewardId);

    if (!reward) return false;
    if (!reward.is_limited) return true; // Stock ilimitado
    if (reward.stock === null) return true;
    return reward.stock > 0;
  }

  /**
   * Actualizar stock (decrementar después de canje)
   */
  async decrementStock(rewardId: string): Promise<void> {
    const { error } = await this.supabase.rpc('decrement_reward_stock', {
      reward_id: rewardId,
    });

    if (error) throw error;
  }

  /**
   * Crear nueva recompensa (admin only)
   */
  async createReward(input: Partial<Reward>): Promise<Reward> {
    const { data, error } = await this.supabase
      .from('rewards')
      .insert({
        ...input,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const rewardsService = new RewardsService();
```

#### redemptionService.ts

```typescript
// src/features/rewards/services/redemptionService.ts

import { createClient } from '@/shared/lib/supabase/client';
import { CreateRedemptionInput, Redemption } from '../types';

class RedemptionService {
  private supabase = createClient();

  /**
   * Procesar canje de recompensa
   * Validaciones: puntos suficientes, stock disponible, nivel mínimo
   */
  async redeemReward(input: CreateRedemptionInput): Promise<Redemption> {
    const { reward_id, user_id } = input;

    // 1. Obtener perfil del usuario
    const { data: profile, error: profileError } = await this.supabase
      .from('profiles')
      .select('id, points_balance, tier, name, email')
      .eq('id', user_id)
      .single();

    if (profileError || !profile) {
      throw new Error('Usuario no encontrado');
    }

    // 2. Obtener recompensa
    const { data: reward, error: rewardError } = await this.supabase
      .from('rewards')
      .select('*')
      .eq('id', reward_id)
      .single();

    if (rewardError || !reward) {
      throw new Error('Recompensa no encontrada');
    }

    // 3. Validar nivel mínimo
    const tierOrder = ['explorador', 'conocedor', 'embajador'];
    const userTierIndex = tierOrder.indexOf(profile.tier as TierLevel);
    const requiredTierIndex = tierOrder.indexOf(reward.min_tier as TierLevel);

    if (userTierIndex < requiredTierIndex) {
      throw new Error(
        `Esta recompensa requiere nivel ${reward.min_tier}`
      );
    }

    // 4. Validar puntos suficientes
    if (profile.points_balance < reward.points_cost) {
      throw new Error('Puntos insuficientes');
    }

    // 5. Validar stock (si aplica)
    if (reward.is_limited && reward.stock !== null && reward.stock <= 0) {
      throw new Error('Recompensa agotada');
    }

    // 6. Iniciar transacción de canje
    const redemptionCode = this.generateRedemptionCode();

    // Crear transacción de puntos (tipo 'redeem')
    const { data: transaction, error: transactionError } = await this.supabase
      .from('transactions')
      .insert({
        user_id: profile.id,
        type: 'redeem',
        amount: 0,
        points: -reward.points_cost,
        points_before: profile.points_balance,
        points_after: profile.points_balance - reward.points_cost,
        multiplier_applied: 1.0,
        tier_at_transaction: profile.tier,
        description: `Canje: ${reward.name}`,
        status: 'completed',
        processed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (transactionError || !transaction) {
      throw new Error('Error al crear transacción');
    }

    // Crear registro de canje
    const { data: redemption, error: redemptionError } = await this.supabase
      .from('redemptions')
      .insert({
        user_id: profile.id,
        reward_id: reward.id,
        transaction_id: transaction.id,
        points_used: reward.points_cost,
        redemption_code: redemptionCode,
        status: 'pending',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
      })
      .select()
      .single();

    if (redemptionError || !redemption) {
      throw new Error('Error al registrar canje');
    }

    // Decrementar stock
    if (reward.is_limited && reward.stock !== null) {
      await this.supabase
        .from('rewards')
        .update({ stock: reward.stock - 1 })
        .eq('id', reward_id);
    }

    return redemption;
  }

  /**
   * Generar código único de canje (formato: LV-XXXX-XXXX-XXXX)
   */
  private generateRedemptionCode(): string {
    const segment = () =>
      Math.random().toString(36).substring(2, 6).toUpperCase();
    return `LV-${segment()}-${segment()}-${segment()}`;
  }

  /**
   * Marcar canje como reclamado (staff validation)
   */
  async claimRedemption(redemptionCode: string): Promise<void> {
    const { error } = await this.supabase
      .from('redemptions')
      .update({
        status: 'claimed',
        claimed_at: new Date().toISOString(),
      })
      .eq('redemption_code', redemptionCode)
      .eq('status', 'pending');

    if (error) throw error;
  }

  /**
   * Obtener historial de canjes del usuario
   */
  async getUserRedemptions(userId: string): Promise<Redemption[]> {
    const { data, error } = await this.supabase
      .from('redemptions')
      .select('*, rewards(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

export const redemptionService = new RedemptionService();
```

#### achievementService.ts

```typescript
// src/features/rewards/services/achievementService.ts

class AchievementService {
  private supabase = createClient();

  /**
   * Obtener todos los logros disponibles
   */
  async getAllAchievements(): Promise<Achievement[]> {
    const { data, error } = await this.supabase
      .from('achievements')
      .select('*')
      .order('points_bonus', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Obtener logros desbloqueados por usuario
   */
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const { data, error } = await this.supabase
      .from('user_achievements')
      .select('*, achievements(*)')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Desbloquear logro manualmente
   * Retorna true si se desbloqueó, false si ya estaba desbloqueado
   */
  async unlockAchievement(
    userId: string,
    achievementCode: string
  ): Promise<boolean> {
    // Obtener ID del logro
    const { data: achievement } = await this.supabase
      .from('achievements')
      .select('id')
      .eq('code', achievementCode)
      .single();

    if (!achievement) return false;

    // Intentar insertar (ON CONFLICT DO NOTHING)
    const { error } = await this.supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievement.id,
      });

    // Si hay error de conflicto, ya estaba desbloqueado
    if (error && error.code !== '23505') {
      throw error;
    }

    return !error || error.code !== '23505';
  }

  /**
   * Verificar si usuario tiene logro específico
   */
  async hasAchievement(
    userId: string,
    achievementCode: string
  ): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievements.code', achievementCode)
      .single();

    if (error) return false;
    return !!data;
  }
}

export const achievementService = new AchievementService();
```

### 5.4 React Hooks

```typescript
// src/features/rewards/hooks/useRewards.ts

import { useQuery } from '@tanstack/react-query';
import { rewardsService } from '../services/rewardsService';
import { TierLevel } from '@/features/auth/types';

export function useRewards(userTier?: TierLevel) {
  return useQuery({
    queryKey: ['rewards', 'catalog', userTier],
    queryFn: () => rewardsService.getActiveRewards(userTier),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos caché
  });
}

// src/features/rewards/hooks/useRedemption.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { redemptionService } from '../services/redemptionService';
import { CreateRedemptionInput } from '../types';

export function useRedemption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRedemptionInput) =>
      redemptionService.redeemReward(input),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['redemptions'] });
    },
  });
}

// src/features/rewards/hooks/useAchievements.ts

import { useQuery } from '@tanstack/react-query';
import { achievementService } from '../services/achievementService';

export function useAchievements(userId: string) {
  return useQuery({
    queryKey: ['achievements', userId],
    queryFn: () => achievementService.getUserAchievements(userId),
    enabled: !!userId,
  });
}

export function useAllAchievements() {
  return useQuery({
    queryKey: ['achievements', 'all'],
    queryFn: () => achievementService.getAllAchievements(),
    staleTime: 60 * 60 * 1000, // 1 hora (catálogo estable)
  });
}
```

---

## 6. Componentes UI

### 6.1 RewardCatalog

```typescript
// src/features/rewards/components/RewardCatalog.tsx

'use client';

import { useRewards } from '../hooks/useRewards';
import { RewardCard } from './RewardCard';
import { Profile } from '@/features/auth/types';
import { useState } from 'react';

interface RewardCatalogProps {
  profile: Profile;
}

export function RewardCatalog({ profile }: RewardCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { data: rewards, isLoading, error } = useRewards(profile.tier);

  const filteredRewards = rewards?.filter((reward) =>
    selectedCategory === 'all' ? true : reward.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Filtros por categoría */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setSelectedCategory('food')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'food'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🍔 Comida
        </button>
        <button
          onClick={() => setSelectedCategory('drink')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'drink'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🍹 Bebidas
        </button>
        <button
          onClick={() => setSelectedCategory('merchandise')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'merchandise'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🎁 Merchandise
        </button>
        <button
          onClick={() => setSelectedCategory('experience')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'experience'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ⭐ Experiencias
        </button>
      </div>

      {/* Grid de recompensas */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl h-64 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-600 py-8">
          Error al cargar recompensas
        </div>
      ) : filteredRewards && filteredRewards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              userPoints={profile.points_balance}
              userTier={profile.tier}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          No hay recompensas disponibles en esta categoría
        </div>
      )}
    </div>
  );
}
```

### 6.2 RewardCard

```typescript
// src/features/rewards/components/RewardCard.tsx

'use client';

import { Reward } from '../types';
import { TierBadge } from '@/shared/components/ui/TierBadge';
import { useState } from 'react';
import { RewardDetailModal } from './RewardDetailModal';

interface RewardCardProps {
  reward: Reward;
  userPoints: number;
  userTier: 'explorador' | 'conocedor' | 'embajador';
}

export function RewardCard({
  reward,
  userPoints,
  userTier,
}: RewardCardProps) {
  const [showModal, setShowModal] = useState(false);

  const canAfford = userPoints >= reward.points_cost;
  const meetsTierRequirement =
    ['explorador', 'conocedor', 'embajador'].indexOf(userTier) >=
    ['explorador', 'conocedor', 'embajador'].indexOf(reward.min_tier);
  const isOutOfStock = reward.is_limited && reward.stock === 0;
  const isLowStock = reward.is_limited && reward.stock !== null && reward.stock <= 5;

  return (
    <>
      <div
        className={`bg-white rounded-xl border-2 overflow-hidden transition-all hover:shadow-lg ${
          !meetsTierRequirement ? 'opacity-60 border-gray-200' : 'border-gray-200'
        }`}
      >
        {/* Imagen */}
        <div className="relative h-40 bg-gradient-to-br from-purple-100 to-pink-100">
          {reward.image_url ? (
            <img
              src={reward.image_url}
              alt={reward.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              🎁
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            {isOutOfStock && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Agotado
              </span>
            )}
            {isLowStock && !isOutOfStock && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                ¡Últimas {reward.stock}!
              </span>
            )}
          </div>

          {/* Requisito de nivel */}
          <div className="absolute top-2 right-2">
            <TierBadge tier={reward.min_tier} size="sm" />
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-1">
              {reward.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {reward.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Costo en puntos</p>
              <p className="text-lg font-bold text-purple-600">
                {reward.points_cost.toLocaleString()} pts
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              disabled={!canAfford || !meetsTierRequirement || isOutOfStock}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !canAfford || !meetsTierRequirement || isOutOfStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {!meetsTierRequirement
                ? 'Nivel insuficiente'
                : isOutOfStock
                ? 'Agotado'
                : !canAfford
                ? 'Puntos insuficientes'
                : 'Canjear'}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <RewardDetailModal
          reward={reward}
          userPoints={userPoints}
          userTier={userTier}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
```

### 6.3 AchievementGrid

```typescript
// src/features/gamification/components/AchievementGrid.tsx

'use client';

import { useAchievements, useAllAchievements } from '@/features/rewards/hooks/useAchievements';
import { Profile } from '@/features/auth/types';

interface AchievementGridProps {
  profile: Profile;
}

export function AchievementGrid({ profile }: AchievementGridProps) {
  const { data: userAchievements, isLoading: isLoadingUser } =
    useAchievements(profile.id);
  const { data: allAchievements, isLoading: isLoadingAll } =
    useAllAchievements();

  const unlockedCodes = new Set(userAchievements?.map((ua) => ua.achievement.code));

  if (isLoadingUser || isLoadingAll) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-gray-100 rounded-xl h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {allAchievements?.map((achievement) => {
        const isUnlocked = unlockedCodes.has(achievement.code);

        return (
          <div
            key={achievement.id}
            className={`p-4 rounded-xl border-2 text-center transition-all ${
              isUnlocked
                ? 'bg-purple-50 border-purple-200'
                : 'bg-gray-50 border-gray-200 opacity-60'
            }`}
          >
            <div className="text-4xl mb-2">
              {isUnlocked ? achievement.icon_emoji : '🔒'}
            </div>
            <h4 className="font-semibold text-sm text-gray-900">
              {achievement.name}
            </h4>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {achievement.description}
            </p>
            {achievement.points_bonus > 0 && (
              <p className="text-xs font-medium text-purple-600 mt-2">
                +{achievement.points_bonus} pts
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

### 6.4 StreakTracker

```typescript
// src/features/gamification/components/StreakTracker.tsx

'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/shared/lib/supabase/client';
import { Streak } from '@/features/rewards/types';

interface StreakTrackerProps {
  userId: string;
}

export function StreakTracker({ userId }: StreakTrackerProps) {
  const { data: streak } = useQuery<Streak>({
    queryKey: ['streak', userId],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  if (!streak || streak.current_streak === 0) {
    return null;
  }

  const flameEmoji = streak.current_streak >= 7 ? '🔥🔥🔥' :
                      streak.current_streak >= 5 ? '🔥🔥' : '🔥';

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
      <div className="flex items-center gap-3">
        <div className="text-3xl">{flameEmoji}</div>
        <div className="flex-1">
          <p className="text-sm font-medium text-orange-900">
            Racha actual: {streak.current_streak} días
          </p>
          <p className="text-xs text-orange-700">
            Récord personal: {streak.best_streak} días
          </p>
        </div>
        {streak.current_streak === streak.best_streak && streak.current_streak > 1 && (
          <div className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
            ¡Nuevo récord!
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 7. Implementación de Features por Prioridad

### Fase 1: MVP (Alta Prioridad)

**Duración estimada**: 2-3 semanas

| Feature | Descripción | Complejidad |
|---------|-------------|-------------|
| Catálogo de recompensas | Listado de recompensas con filtros por categoría | MEDIA |
| Canje de recompensas | Flujo completo de canje con validaciones | ALTA |
| Historial de canjes | Vista de recompensas canjeadas por usuario | BAJA |
| Códigos de canje | Generación de códigos únicos para validación en establecimiento | MEDIA |

**Archivos clave**:
- `/src/features/rewards/components/RewardCatalog.tsx`
- `/src/features/rewards/services/redemptionService.ts`
- `/supabase/migrations/004_rewards.sql`
- `/supabase/migrations/005_redemptions.sql`

### Fase 2: Gamificación Básica (Media Prioridad)

**Duración estimada**: 2 semanas

| Feature | Descripción | Complejidad |
|---------|-------------|-------------|
| Sistema de logros | Definición y desbloqueo de logros | MEDIA |
| Grid de logros | Visualización de logros desbloqueados/bloqueados | BAJA |
| Notificaciones de logro | Alertas visuales al desbloquear logro | MEDIA |
| Bonus de puntos | Otorgar puntos extra por logros | BAJA |

**Archivos clave**:
- `/supabase/migrations/006_achievements.sql`
- `/src/features/gamification/components/AchievementGrid.tsx`
- `/src/features/rewards/services/achievementService.ts`

### Fase 3: Engagement (Baja Prioridad)

**Duración estimada**: 1-2 semanas

| Feature | Descripción | Complejidad |
|---------|-------------|-------------|
| Seguimiento de rachas | Sistema de streaks con contador de días consecutivos | ALTA |
| StreakTracker UI | Componente visual de racha actual | MEDIA |
| Logros de racha | Desbloquear logros por rachas de 3, 7, 30 días | MEDIA |
| Leaderboard | Ranking de usuarios por puntos | MEDIA |

**Archivos clave**:
- `/supabase/migrations/007_streaks.sql`
- `/src/features/gamification/components/StreakTracker.tsx`
- `/src/features/gamification/services/streakService.ts`

### Fase 4: Mejoras de Experiencia (Opcional)

**Duración estimada**: 1-2 semanas

| Feature | Descripción | Complejidad |
|---------|-------------|-------------|
| Lista de espera | Permitir notificación cuando recompensa agotada se reabastezca | MEDIA |
| Recompensas recomendadas | Sugerir recompensas basadas en nivel/historial | ALTA |
| Compartir logros | Integración con redes sociales | BAJA |
| Personalización | Permitir personalizar ciertas recompensas | MEDIA |

---

## 8. Quality Gates (TRUST 5)

| Pillar | Target | Method |
|--------|--------|--------|
| **Tested** | >= 85% coverage | Vitest + React Testing Library |
| **Readable** | TypeScript strict + ESLint | `npm run lint` |
| **Unified** | Feature modules consistency | Estructura por dominios |
| **Secured** | RLS + Zod validation | Supabase policies + schemas |
| **Trackable** | Event logging + Analytics | Console + monitoring |

### Casos de Prueba Críticos

```typescript
// src/features/rewards/__tests__/redemptionService.test.ts

describe('redemptionService', () => {
  it('should reject redemption if insufficient points', async () => {
    // Arrange
    const profile = { points_balance: 100, tier: 'explorador' };
    const reward = { points_cost: 500, min_tier: 'explorador', stock: 10 };

    // Act & Assert
    await expect(
      redemptionService.redeemReward({ reward_id: 'xxx', user_id: 'yyy' })
    ).rejects.toThrow('Puntos insuficientes');
  });

  it('should reject redemption if tier requirement not met', async () => {
    // Arrange
    const profile = { points_balance: 1000, tier: 'explorador' };
    const reward = { points_cost: 500, min_tier: 'conocedor', stock: 10 };

    // Act & Assert
    await expect(
      redemptionService.redeemReward({ reward_id: 'xxx', user_id: 'yyy' })
    ).rejects.toThrow('requiere nivel conocedor');
  });

  it('should reject redemption if out of stock', async () => {
    // Arrange
    const profile = { points_balance: 1000, tier: 'embajador' };
    const reward = { points_cost: 500, min_tier: 'explorador', stock: 0 };

    // Act & Assert
    await expect(
      redemptionService.redeemReward({ reward_id: 'xxx', user_id: 'yyy' })
    ).rejects.toThrow('Recompensa agotada');
  });

  it('should successfully redeem valid reward', async () => {
    // Arrange
    const profile = { points_balance: 1000, tier: 'conocedor' };
    const reward = { points_cost: 500, min_tier: 'conocedor', stock: 10 };

    // Act
    const redemption = await redemptionService.redeemReward({
      reward_id: 'xxx',
      user_id: 'yyy',
    });

    // Assert
    expect(redemption.points_used).toBe(500);
    expect(redemption.redemption_code).toMatch(/^LV-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    expect(redemption.status).toBe('pending');
  });
});
```

---

## 9. Risks

| Risk | Probabilidad | Impacto | Mitigación |
|------|-------------|---------|------------|
| Race condition en stock | MEDIA | ALTA | Usar transacciones de base de datos con `SELECT FOR UPDATE` |
| Canje duplicado por network retry | BAJA | ALTA | Idempotencia con `redemption_code` único |
| Puntos negativos por concurrencia | BAJA | MEDIA | Trigger de base de datos valida `points_balance >= 0` |
| Logro desbloqueado múltiples veces | MEDIA | BAJA | Constraint `UNIQUE(user_id, achievement_id)` |
| Performance de catálogo con muchas recompensas | BAJA | MEDIA | Paginación + índices de base de datos |
| UI congelada durante canje offline | MEDIA | ALTA | Deshabilitar botón de canje cuando `!navigator.onLine` |

---

## 10. Migration Plan

### 10.1 Migraciones de Base de Datos

**Orden de ejecución**:

1. **004_rewards.sql** - Crear tabla de recompensas
2. **005_redemptions.sql** - Crear tabla de canjes
3. **006_achievements.sql** - Crear tablas de logros
4. **007_streaks.sql** - Crear tabla de rachas
5. **008_rls_rewards.sql** - Políticas RLS para todas las nuevas tablas

### 10.2 Scripts de Población Inicial

```sql
-- Script: seed_rewards.sql
-- Poblar recompensas iniciales para demo

INSERT INTO public.rewards (name, description, points_cost, stock, min_tier, category, is_limited) VALUES
('Café gratis', 'Un café de grano recién molido', 100, 50, 'explorador', 'drink', true),
('Desayuno buffet', 'Buffet de desayuno para 1 persona', 500, 20, 'explorador', 'food', true),
('Cena romantica', 'Cena para 2 personas con vista panorámica', 2000, 10, 'conocedor', 'experience', true),
('Masaje relajante', 'Sesión de masaje de 60 minutos', 1500, 15, 'conocedor', 'experience', true),
('Noche gratis', 'Alojamiento 1 noche en suite junior', 5000, 5, 'embajador', 'experience', true),
('Taza personalizada', 'Taza de cerámica con tu nombre', 300, 100, 'explorador', 'merchandise', true),
('Experiencia tequila', 'Catálogo de 5 tequilas artesanales', 1000, 25, 'conocedor', 'drink', true),
('Tour guiado', 'Tour histórico por San Cristóbal', 800, 30, 'explorador', 'experience', false);
```

### 10.3 Plan de Rollout

**Semana 1-2**:
- Implementar backend (migraciones + servicios)
- Crear componentes UI base
- Tests unitarios de servicios core

**Semana 3-4**:
- Integrar con frontend existente
- Pruebas de integración
- Beta testing con staff

**Semana 5**:
- Deploy a producción
- Monitoreo de errores y performance
- Recolección de feedback inicial

**Semana 6+**:
- Iteraciones basadas en feedback
- Implementar features de Fase 3
- Analytics de usage

---

## 11. Dependencies

### Externas

| Package | Version | Purpose |
|---------|---------|---------|
| @supabase/supabase-js | ^2.45.0 | Database client |
| @tanstack/react-query | ^5.0.0 | Server state management |
| zod | ^3.23.0 | Schema validation |
| react-qr-code | ^2.0.0 | QR code generation |
| date-fns | ^3.0.0 | Date utilities (streaks) |

### Internas

| Módulo | Dependencia |
|--------|-------------|
| rewards | auth, transactions |
| gamification | auth, rewards |
| achievements | rewards, auth |

---

## 12. Traceability Matrix

| Requirement ID | Implementación |
|----------------|----------------|
| U-01 | `/src/features/rewards/components/RewardCatalog.tsx` |
| U-02 | `/src/features/rewards/services/redemptionService.ts` (líneas 45-52) |
| U-03 | `/supabase/migrations/005_redemptions.sql` (tabla redemptions) |
| U-04 | `/src/features/transactions/services/transactionService.ts` (trigger process_transaction) |
| U-05 | `/src/features/rewards/components/RewardCard.tsx` (validación tier) |
| E-01 | `/src/features/rewards/components/RewardDetailModal.tsx` |
| E-02 | `/src/features/rewards/services/redemptionService.ts` (método redeemReward) |
| E-03 | `/supabase/migrations/006_achievements.sql` (trigger achievement_first_visit) |
| E-04, E-05 | `/supabase/migrations/002_tier_trigger.sql` (existente) |
| E-06 | `/supabase/migrations/007_streaks.sql` (función update_streak) |
| S-01 | `/src/features/rewards/components/RewardCard.tsx` (líneas 45-48) |
| S-02 | `/src/features/rewards/components/RewardCard.tsx` (líneas 50-52) |
| S-03 | `/src/features/rewards/components/RewardCard.tsx` (líneas 36-42) |
| N-01 | `/src/features/rewards/services/redemptionService.ts` (líneas 85-89) |
| C-01 | Feature opcional (lista de espera) - Fase 4 |
| C-02 | `/supabase/migrations/007_streaks.sql` (trigger update_streak) |
| C-03 | Lógica existente en `/supabase/migrations/002_tier_trigger.sql` |

---

## 13. Success Metrics

### Métricas de Usuario

| Metric | Target | Measurement |
|--------|--------|-------------|
| Tasa de canje | 20% de usuarios activos | % usuarios con >=1 canje/mes |
| Promedio de canjes | 2 canjes/mes | Media de canjes por usuario |
| Logros desbloqueados | 5 logros/usuario al mes | Media de logros por usuario |
| Rachas activas | 30% de usuarios | % usuarios con streak >=3 |

### Métricas de Negocio

| Metric | Target | Measurement |
|--------|--------|-------------|
| Puntos redimidos | 60% de puntos emitidos | Ratio puntos canjados/puntos ganados |
| Stock rotation | 80% de recompensas rotadas | % recompensas canjadas/mes |
| Tiempo hasta primer canje | 7 días | Media días desde registro hasta primer canje |

### Métricas Técnicas

| Metric | Target | Measurement |
|--------|--------|-------------|
| Latencia de canje | < 2s | Tiempo respuesta mutation redeem |
| Uptime de catálogo | 99.9% | Disponibilidad endpoint /rewards |
| Error rate de canje | < 0.5% | % transacciones fallidas |

---

## 14. Documentación de Usuario

**Sección: Cómo Canjear Recompensas**

1. **Acceder al Catálogo**
   - Ve a `/rewards` desde tu wallet
   - Navega por categorías: Comida, Bebidas, Merchandise, Experiencias

2. **Ver Detalles de Recompensa**
   - Toca cualquier recompensa para ver descripción completa
   - Verifica costo en puntos y requisitos de nivel
   - Revisa stock disponible (si aplica)

3. **Canjear Recompensa**
   - Presiona "Canjear" si tienes puntos suficientes
   - Confirma el canje en el modal
   - Recibirás un código único (ej: LV-ABC1-DEF2-GHI3)

4. **Reclamar Recompensa**
   - Presenta tu código en el establecimiento participante
   - El personal validará el código con el escáner
   - ¡Disfruta tu recompensa!

5. **Historial de Canjes**
   - Ve a la sección "Mis Canjes" en tu perfil
   - Verifica estado: Pendiente, Reclamado, Expirado
   - Los canjes expiran después de 30 días

**Sección: Sistema de Logros**

- **Primera Visita** (🎉): Completa tu primera transacción (+50 pts)
- **Conocedor** (⭐): Alcanza nivel Conocedor (+100 pts)
- **Embajador** (👑): Alcanza nivel Embajador (+200 pts)
- **Primer Canje** (🎁): Canjea tu primera recompensa (+75 pts)
- **Racha Semanal** (🔥): 3 visitas en una semana (+150 pts)
- **Visitante Devoto** (💚): 7 días consecutivos de visita (+300 pts)
- **Acumulador** (💰): Acumula 10,000 puntos en total (+500 pts)

---

## Appendix A: SQL Completo de Migraciones

See `/supabase/migrations/004_rewards.sql`, `005_redemptions.sql`, `006_achievements.sql`, `007_streaks.sql`, `008_rls_rewards.sql` for complete DDL statements.

---

## Appendix B: API Reference

### POST /api/rewards/redeem

**Request**:
```json
{
  "reward_id": "uuid",
  "user_id": "uuid"
}
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "redemption_code": "LV-ABC1-DEF2-GHI3",
  "status": "pending",
  "expires_at": "2026-03-05T12:00:00Z",
  "reward": {
    "name": "Café gratis",
    "points_cost": 100
  }
}
```

**Error** (400 Bad Request):
```json
{
  "error": "Puntos insuficientes",
  "required": 500,
  "available": 250
}
```

### GET /api/rewards

**Query Params**: `?category=food&tier=conocedor`

**Response** (200 OK):
```json
{
  "rewards": [
    {
      "id": "uuid",
      "name": "Desayuno buffet",
      "description": "Buffet de desayuno...",
      "points_cost": 500,
      "stock": 20,
      "min_tier": "explorador",
      "category": "food",
      "is_limited": true
    }
  ]
}
```

---

**FIN DEL DOCUMENTO SPEC-GAMIFICATION-002**

**Próximos Pasos**:
1. Revisar y aprobar SPEC
2. Ejecutar `/moai:1-plan SPEC-GAMIFICATION-002` para crear plan de implementación
3. Ejecutar `/moai:2-run SPEC-GAMIFICATION-002` para iniciar desarrollo con DDD
4. Ejecutar `/moai:3-sync SPEC-GAMIFICATION-002` para generar documentación
