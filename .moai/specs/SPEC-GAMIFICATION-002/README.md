---
id: SPEC-GAMIFICATION-002
version: "1.0.0"
status: draft
created: "2026-02-03"
updated: "2026-02-03"
author: "MoAI-ADK"
---

# SPEC-GAMIFICATION-002: Sistema de Recompensas y Gamificación Avanzada

## 📋 Resumen Ejecutivo

Especificación técnica para extender el sistema de lealtad existente de **LoyaltyVibes** con funcionalidad completa de recompensas canjeables, catálogo de premios, sistema de logros desbloqueables y seguimiento de rachas para mejorar la retención de usuarios.

**Estado**: Draft ✍️
**Prioridad**: MEDIA
**Dominio**: GAMIFICATION
**Dependencias**: SPEC-AUTH-001 (Core Loyalty Engine)

---

## 🎯 Objetivos del Proyecto

### Objetivos Principales

1. **Sistema de Recompensas**: Catálogo completo de recompensas canjeables con puntos
2. **Gamificación**: Logros desbloqueables con puntos bonus
3. **Engagement**: Seguimiento de rachas (streaks) para motivar visitas recurrentes
4. **Retención**: Mecánicas de juego para aumentar frecuencia de visitas

### Métricas de Éxito

| Métrica | Target | Actual |
|---------|--------|--------|
| Tasa de canje | 20% usuarios/mes | 0% (baseline) |
| Puntos redimidos | 60% de emitidos | N/A |
| Rachas activas | 30% usuarios | 0% (baseline) |
| Logros desbloqueados | 5 logros/usuario | 0% (baseline) |

---

## 📂 Documentos de la SPEC

| Documento | Descripción | Estado |
|-----------|-------------|--------|
| **spec.md** | Especificación técnica completa con EARS requirements | ✅ Completado |
| **plan.md** | Plan de implementación por fases (6-8 semanas) | ✅ Completado |
| **acceptance.md** | Criterios de aceptación detallados (Given-When-Then) | ✅ Completado |
| **README.md** | Este archivo - guía rápida de referencia | ✅ Completado |

---

## 🚀 Quick Start

### Para Desarrolladores

```bash
# 1. Revisar la SPEC completa
cat .moai/specs/SPEC-GAMIFICATION-002/spec.md

# 2. Crear plan de implementación
/moai:1-plan SPEC-GAMIFICATION-002

# 3. Iniciar desarrollo con DDD
/moai:2-run SPEC-GAMIFICATION-002

# 4. Generar documentación
/moai:3-sync SPEC-GAMIFICATION-002
```

### Para Project Managers

1. **Leer Resumen Ejecutivo** en `spec.md` (secciones 1-3)
2. **Revisar Timeline** en `plan.md` (sección 6)
3. **Verificar Criterios de Aceptación** en `acceptance.md`
4. **Aprobar inicio** del proyecto

### Para QA/Testers

1. **Revisar Criterios de Aceptación** en `acceptance.md`
2. **Preparar Casos de Prueba** basados en escenarios Given-When-Then
3. **Verificar Matriz de Pruebas** (sección 6 de acceptance.md)
4. **Ejecutar Pruebas E2E** con Playwright

---

## 🏗️ Arquitectura del Sistema

### Estructura de Directorios

```
src/features/rewards/          # [NUEVO] Módulo de recompensas
├── components/
│   ├── RewardCatalog.tsx
│   ├── RewardCard.tsx
│   ├── RewardDetailModal.tsx
│   ├── RedemptionHistory.tsx
│   └── RedemptionQR.tsx
├── services/
│   ├── rewardsService.ts
│   ├── redemptionService.ts
│   └── achievementService.ts
├── hooks/
│   ├── useRewards.ts
│   ├── useRedemption.ts
│   └── useAchievements.ts
└── types.ts

src/features/gamification/     # [EXISTENTE + EXTENSIONES]
├── components/
│   ├── AchievementGrid.tsx    # [NUEVO]
│   ├── StreakTracker.tsx      # [NUEVO]
│   └── LevelProgress.tsx      # [YA EXISTE]
└── services/
    └── streakService.ts       # [NUEVO]

supabase/migrations/           # [NUEVAS MIGRACIONES]
├── 004_rewards.sql
├── 005_redemptions.sql
├── 006_achievements.sql
├── 007_streaks.sql
└── 008_rls_rewards.sql
```

### Stack Tecnológico

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, TypeScript 5.3 |
| State | TanStack Query, Zustand |
| Database | Supabase (PostgreSQL) |
| Offline | Dexie.js (IndexedDB) |
| Validation | Zod |
| Testing | Vitest, Playwright |

---

## 📊 Esquema de Base de Datos

### Nuevas Tablas

```sql
-- Recompensas canjeables
rewards (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  points_cost INTEGER NOT NULL,
  stock INTEGER, -- NULL = ilimitado
  min_tier TEXT CHECK (min_tier IN ('explorador', 'conocedor', 'embajador')),
  category TEXT, -- 'food', 'drink', 'merchandise', 'experience'
  is_active BOOLEAN DEFAULT true
)

-- Canjes realizados
redemptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  reward_id UUID REFERENCES rewards(id),
  transaction_id UUID REFERENCES transactions(id),
  points_used INTEGER NOT NULL,
  redemption_code TEXT UNIQUE NOT NULL, -- LV-XXXX-XXXX-XXXX
  status TEXT CHECK (status IN ('pending', 'claimed', 'expired', 'cancelled')),
  expires_at TIMESTAMPTZ
)

-- Logros desbloqueables
achievements (
  id UUID PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_emoji TEXT,
  points_bonus INTEGER DEFAULT 0
)

-- Logros de usuarios
user_achievements (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  achievement_id UUID REFERENCES achievements(id),
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
)

-- Rachas de visitas
streaks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  last_visit_date DATE,
  UNIQUE(user_id)
)
```

---

## 🎮 Features del Sistema

### 1. Catálogo de Recompensas

**Endpoint**: `GET /api/rewards`

**Features**:
- Listado de recompensas con filtros por categoría
- Indicadores de stock (agotado, últimas unidades)
- Requisitos de nivel visualizados con TierBadge
- Preview de detalles en modal
- Cacheo offline con Dexie.js

**Componentes**: `RewardCatalog`, `RewardCard`, `RewardDetailModal`

### 2. Canje de Recompensas

**Endpoint**: `POST /api/rewards/redeem`

**Validaciones**:
- ✅ Puntos suficientes
- ✅ Nivel mínimo requerido
- ✅ Stock disponible
- ✅ Generación de código único

**Post-canje**:
- Código QR para validación
- Expiración de 30 días
- Historial de canjes

### 3. Sistema de Logros

**Logros Predefinidos**:
- 🎉 **Primera Visita**: +50 pts (primera transacción)
- ⭐ **Conocedor**: +100 pts (ascenso a nivel 2)
- 👑 **Embajador**: +200 pts (ascenso a nivel 3)
- 🎁 **Primer Canje**: +75 pts (primera recompensa canjeada)
- 🔥 **Racha Semanal**: +150 pts (3 visitas en una semana)
- 💚 **Visitante Devoto**: +300 pts (7 días consecutivos)
- 💰 **Acumulador**: +500 pts (10,000 puntos totales)

**Mecánica**:
- Desbloqueo automático vía triggers
- Puntos bonus otorgados al desbloquear
- Notificación de celebración
- Grid de logros (desbloqueados vs bloqueados)

### 4. Seguimiento de Rachas

**Componente**: `StreakTracker`

**Features**:
- Contador de días consecutivos
- Récord personal (best streak)
- Indicador de "nuevo récord"
- Emojis de fuego escalables (🔥, 🔥🔥, 🔥🔥🔥)
- Logros desbloqueables por rachas

**Lógica**:
- Visita en día consecutivo = +1 streak
- Gap de >1 día = reset a 1
- Best streak se mantiene
- Triggers de logro automáticos

---

## 📈 Implementación por Fases

### Fase 1: Foundation (Semana 1)
- Migraciones de base de datos
- Servicios core (rewardsService, redemptionService)
- Tests unitarios

### Fase 2: Rewards UI (Semana 2)
- Componentes de catálogo
- Flujo completo de canje
- Historial de canjes

### Fase 3: Achievements (Semana 3-4)
- Migraciones de logros
- Servicio de achievements
- Grid de logros + badges

### Fase 4: Streaks (Semana 5)
- Migraciones de rachas
- StreakTracker component
- Integración con dashboard

### Fase 5: Polish & Testing (Semana 6)
- Testing end-to-end
- Performance optimization
- Documentation

### Fase 6: Deploy (Semana 7-8)
- Deploy a staging
- Monitoreo y hotfixes
- Deploy a producción

**Ver timeline completo en**: `plan.md` (sección 6)

---

## ✅ Criterios de Aceptación Resumidos

### Funcionales

- [ ] Usuario puede ver catálogo de recompensas
- [ ] Usuario puede canjear recompensas con puntos
- [ ] Usuario ve historial de canjes con códigos QR
- [ ] Usuario ve grid de logros desbloqueados
- [ ] Usuario recibe notificaciones de logros
- [ ] Usuario ve su racha actual en dashboard

### No Funcionales

- [ ] Performance: Page load < 2s (3G)
- [ ] Seguridad: RLS policies activas
- [ ] Offline: Catálogo cacheado accesible sin conexión
- [ ] UX: Mensajes de error claros en español
- [ ] Tests: Coverage >= 85%

**Ver criterios completos en**: `acceptance.md`

---

## 🔗 Dependencias y Relaciones

### Dependencias Internas

```
SPEC-GAMIFICATION-002 (esta SPEC)
├── Depende de: SPEC-AUTH-001 (Core Loyalty Engine)
│   ├── Auth system
│   ├── Tier system (Explorador, Conocedor, Embajador)
│   ├── Points calculation
│   └── Transaction system
│
└── Habilita futuras specs:
    ├── SPEC-REFERRALS-003 (Sistema de referidos)
    ├── SPEC-LEADERBOARD-004 (Rankings y competencias)
    └── SPEC-PROMOTIONS-005 (Promociones temporales)
```

### Módulos Afectados

| Módulo | Cambio | Impacto |
|--------|--------|---------|
| `/src/features/auth` | Sin cambios | None |
| `/src/features/transactions` | Extensión | Low |
| `/src/features/wallet` | Integración | Medium |
| `/src/features/gamification` | Extensión | High |
| `/src/app/(client)` | Nuevas rutas | Medium |

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)

**Cobertura objetivo**: >= 85%

```bash
# Ejecutar tests
npm test

# Con coverage
npm test:coverage

# Watch mode
npm test:watch
```

### Integration Tests

**Escenarios clave**:
1. Flujo completo de canje
2. Desbloqueo automático de logros
3. Actualización de rachas

### E2E Tests (Playwright)

```bash
# Ejecutar E2E
npm run test:e2e

# Modo interactivo
npm run test:e2e:ui
```

---

## 📝 Checklist de Desarrollo

### Pre-Development

- [ ] SPEC aprobada por stakeholders
- [ ] Recursos asignados (equipo, herramientas)
- [ ] Entorno de desarrollo configurado
- [ ] Base de datos de staging preparada

### During Development

- [ ] Migraciones ejecutadas en staging
- [ ] Servicios core implementados
- [ ] Componentes UI creados
- [ ] Tests unitarios pasando (>= 85%)
- [ ] Code review completado

### Pre-Deploy

- [ ] Testing manual completado
- [ ] Performance optimizada (Lighthouse >= 90)
- [ ] Security audit passed (RLS + Zod)
- [ ] Documentation actualizada
- [ ] Stakeholders aprobaron demo

### Post-Deploy

- [ ] Monitoreo configurado (Sentry, Analytics)
- [ ] Dashboard de métricas activo
- [ ] Feedback collection iniciada
- [ ] Retroactiva del sprint completada

---

## 🚨 Risks y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Race condition en stock | MEDIA | ALTA | Transacciones DB con `SELECT FOR UPDATE` |
| Canje duplicado | BAJA | ALTA | Idempotencia con redemption_code único |
| Baja tasa de canje | MEDIA | ALTA | UX testing + prototipado previo |
| Performance degradation | BAJA | MEDIA | Índices DB + paginación |

---

## 📞 Contacto y Soporte

### Equipo del Proyecto

| Rol | Nombre | Contacto |
|-----|--------|----------|
| Product Owner | TBD | tbd@loyaltyvibes.com |
| Tech Lead | TBD | tbd@loyaltyvibes.com |
| Developer | TBD | tbd@loyaltyvibes.com |

### Documentación Relacionada

- **Product Doc**: `/config/workspace/loyaltyvibes/.moai/project/product.md`
- **SPEC-AUTH-001**: `/config/workspace/loyaltyvibes/.moai/specs/SPEC-AUTH-001/spec.md`
- **Technical Stack**: `/config/workspace/loyaltyvibes/.moai/project/tech.md`

---

## 🔄 Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-03 | Initial SPEC creation |

---

## 📄 License

Este documento es parte del proyecto LoyaltyVibes y es propiedad exclusiva de los stakeholders del proyecto.

---

**FIN DE README - SPEC-GAMIFICATION-002**

**Para más detalles, consultar**:
- `spec.md` - Especificación técnica completa
- `plan.md` - Plan de implementación detallado
- `acceptance.md` - Criterios de aceptación
