---
id: SPEC-GAMIFICATION-002
version: "1.0.0"
status: draft
created: "2026-02-03"
updated: "2026-02-03"
author: "MoAI-ADK"
---

# Plan de Implementación - SPEC-GAMIFICATION-002

## Resumen Ejecutivo

Este documento detalla el plan de implementación para el **Sistema de Recompensas y Gamificación Avanzada** de LoyaltyVibes. El proyecto extiende el sistema de lealtad existente (SPEC-AUTH-001) añadiendo catálogo de recompensas canjeables, sistema de logros, seguimiento de rachas y mecánicas de engagement para mejorar la retención de usuarios.

**Horizonte de Temporal**: 6-8 semanas
**Equipo Sugerido**: 1-2 desarrolladores full-stack
**Metodología**: Domain-Driven Development (DDD) con ANALYZE-PRESERVE-IMPROVE

---

## 1. Estrategia de Desarrollo

### 1.1 Enfoque DDD

Aplicaremos el ciclo **ANALYZE-PRESERVE-IMPROVE**:

1. **ANALYZE**: Analizar código existente en `/src/features/wallet/` y `/src/features/gamification/`
2. **PRESERVE**: Crear characterization tests para comportamiento existente
3. **IMPROVE**: Extender funcionalidad preservando compatibilidad

### 1.2 Principios de Diseño

- **Backward Compatibility**: No breaking changes en API existente
- **Incremental Delivery**: Features funcionan independientemente
- **Offline-First**: Nuevas features respetan arquitectura offline existente
- **Feature Modules**: Estructura por dominios (`/src/features/rewards/`)

---

## 2. Fases de Implementación

### Fase 1: Foundation (Semana 1)

**Objetivo**: Infraestructura de base de datos y servicios core

#### 2.1 Migraciones de Base de Datos

**Archivos**:
- `/supabase/migrations/004_rewards.sql`
- `/supabase/migrations/005_redemptions.sql`
- `/supabase/migrations/008_rls_rewards.sql`

**Tareas**:
1. Crear tabla `rewards` con índices
2. Crear tabla `redemptions` con relaciones foráneas
3. Configurar RLS policies para seguridad
4. Crear funciones SQL de soporte
5. Script de seed con recompensas iniciales

**Acceptance Criteria**:
- [ ] Migraciones ejecutan sin errores en Supabase
- [ ] RLS policies previenen acceso no autorizado
- [ ] Índices creados correctamente (verificar con `\d rewards`)
- [ ] Datos de prueba insertados exitosamente

#### 2.2 Servicios Core - Rewards

**Archivos**:
- `/src/features/rewards/types.ts`
- `/src/features/rewards/services/rewardsService.ts`
- `/src/features/rewards/services/redemptionService.ts`

**Tareas**:
1. Definir TypeScript types + Zod schemas
2. Implementar `rewardsService.getActiveRewards()`
3. Implementar `rewardsService.getRewardById()`
4. Implementar `redemptionService.redeemReward()`
5. Implementar `redemptionService.generateRedemptionCode()`
6. Manejo robusto de errores con mensajes en español

**Acceptance Criteria**:
- [ ] Todos los métodos tienen TypeScript types estrictos
- [ ] Zod schemas validan entradas correctamente
- [ ] Manejo de errores cubre edge cases (stock, puntos, nivel)
- [ ] Servicios retornan datos tipados correctamente

#### 2.3 Tests Unitarios

**Archivos**:
- `/src/features/rewards/__tests__/rewardsService.test.ts`
- `/src/features/rewards/__tests__/redemptionService.test.ts`

**Tareas**:
1. Tests para `getActiveRewards()` con filtros
2. Tests para `redeemReward()` con validaciones
3. Tests de edge cases (stock = 0, puntos insuficientes)
4. Tests de error handling
5. Cobertura >= 85%

**Acceptance Criteria**:
- [ ] Todos los métodos críticos tienen tests
- [ ] Tests cubren happy path y edge cases
- [ ] Coverage report muestra >= 85%
- [ ] Tests pasan consistentemente (`npm test`)

---

### Fase 2: UI de Recompensas (Semana 2)

**Objetivo**: Interfaz de usuario para catálogo y canje

#### 2.4 Componentes Base

**Archivos**:
- `/src/features/rewards/components/RewardCatalog.tsx`
- `/src/features/rewards/components/RewardCard.tsx`
- `/src/features/rewards/components/RewardDetailModal.tsx`

**Tareas**:
1. `RewardCatalog`: Grid con filtros por categoría
2. `RewardCard`: Tarjeta con preview de recompensa
3. `RewardDetailModal`: Modal con detalles y botón de canje
4. Integración con TanStack Query (`useRewards`, `useRedemption`)
5. Loading states y error handling

**Acceptance Criteria**:
- [ ] Catálogo muestra recompensas filtradas por categoría
- [ ] Tarjetas muestran stock, puntos, requisito de nivel
- [ ] Modal muestra detalles completos antes de canjear
- [ ] Loading skeletons durante carga de datos
- [ ] Mensajes de error claros en español

#### 2.5 Integración con Routing

**Archivos**:
- `/src/app/(client)/rewards/page.tsx`
- `/src/app/(client)/rewards/[id]/page.tsx` (opcional)

**Tareas**:
1. Crear ruta `/rewards` en app router
2. Layout con navbar y footer consistentes
3. Protección de ruta con middleware de auth
4. Integración con `useAuth` hook

**Acceptance Criteria**:
- [ ] Ruta `/rewards` accesible solo para usuarios autenticados
- [ ] Layout consistente con resto de la app
- [ ] Redirección a login si no autenticado

#### 2.6 Historial de Canjes

**Archivos**:
- `/src/features/rewards/components/RedemptionHistory.tsx`
- `/src/features/rewards/components/RedemptionQR.tsx`

**Tareas**:
1. Lista de canjes del usuario con estado
2. Código QR para cada canje
3. Filtros por estado (pending, claimed, expired)
4. Indicador visual de expiración

**Acceptance Criteria**:
- [ ] Historial muestra todos los canjes del usuario
- [ ] QR code generado correctamente con código único
- [ ] Estados visualmente diferenciados con colores
- [ ] Explicación clara de proceso de reclamación

---

### Fase 3: Gamification - Achievements (Semana 3-4)

**Objetivo**: Sistema de logros desbloqueables

#### 3.1 Migraciones de Logros

**Archivos**:
- `/supabase/migrations/006_achievements.sql`

**Tareas**:
1. Crear tabla `achievements`
2. Crear tabla `user_achievements`
3. Crear trigger para bonus de puntos
4. Insertar logros predefinidos
5. Configurar RLS policies

**Acceptance Criteria**:
- [ ] Tablas creadas con constraints correctos
- [ ] Trigger otorga puntos bonus automáticamente
- [ ] 7 logros iniciales insertados
- [ ] RLS previene acceso cruzado entre usuarios

#### 3.2 Servicio de Logros

**Archivos**:
- `/src/features/rewards/services/achievementService.ts`

**Tareas**:
1. `getAllAchievements()`: Listar todos los logros
2. `getUserAchievements()`: Logros desbloqueados por usuario
3. `unlockAchievement()`: Desbloquear logro manualmente
4. `hasAchievement()`: Verificar si usuario tiene logro

**Acceptance Criteria**:
- [ ] Todos los métodos retornan datos tipados
- [ ] `unlockAchievement` es idempotente (no duplica)
- [ ] Logros secretos filtrados correctamente

#### 3.3 Componentes de Logros

**Archivos**:
- `/src/features/gamification/components/AchievementGrid.tsx`
- `/src/features/gamification/components/AchievementBadge.tsx`

**Tareas**:
1. Grid de logros desbloqueados vs bloqueados
2. Badge con icono emoji y nombre
3. Indicador visual de progreso
4. Animación al desbloquear nuevo logro

**Acceptance Criteria**:
- [ ] Grid muestra estado de cada logro
- [ ] Logros bloqueados muestran icono de candado
- [ ] Animación suave al desbloquear
- [ ] Responsive en mobile y desktop

#### 3.4 Triggers Automáticos

**Archivos**:
- `/supabase/migrations/009_achievement_triggers.sql`

**Tareas**:
1. Trigger para "Primera Visita" (al crear primera transacción)
2. Trigger para "Conocedor" (al ascender de nivel)
3. Trigger para "Embajador" (al ascender a nivel máximo)
4. Trigger para "Primer Canje" (al crear primer redemption)

**Acceptance Criteria**:
- [ ] Logros se desbloquean automáticamente
- [ ] No hay duplicados de logros
- [ ] Timestamps registrados correctamente

---

### Fase 4: Streaks & Engagement (Semana 5)

**Objetivo**: Seguimiento de rachas y engagement

#### 4.1 Migraciones de Rachas

**Archivos**:
- `/supabase/migrations/007_streaks.sql`

**Tareas**:
1. Crear tabla `streaks`
2. Crear función `update_streak()`
3. Crear trigger para actualizar racha en cada transacción
4. Implementar lógica de días consecutivos
5. Lógica de romper racha si pasa >1 día sin visita

**Acceptance Criteria**:
- [ ] Streak se incrementa en visitas consecutivas
- [ ] Streak se rompe si hay gap de >1 día
- [ ] Best streak se actualiza automáticamente
- [ ] Logros de racha se desbloquean correctamente

#### 4.2 Componente StreakTracker

**Archivos**:
- `/src/features/gamification/components/StreakTracker.tsx`

**Tareas**:
1. Visualización de racha actual con emoji de fuego
2. Comparación con récord personal
3. Indicador de "nuevo récord" cuando aplica
4. Integración con hooks de TanStack Query

**Acceptance Criteria**:
- [ ] Muestra streak actual y best streak
- [ ] Emojis de fuego escalan (1🔥, 2🔥, 3🔥🔥🔥)
- [ ] Badge de "nuevo récord" aparece cuando corresponde
- [ ] Se oculta si streak = 0

#### 4.3 Integración con Dashboard

**Archivos**:
- `/src/app/(client)/wallet/page.tsx` (modificación)

**Tareas**:
1. Añadir `StreakTracker` a dashboard de wallet
2. Añadir sección de "Logros Recientes"
3. Mostrar próximos logros a desbloquear
4. Notificaciones de logros desbloqueados

**Acceptance Criteria**:
- [ ] Dashboard incluye tracker de rachas
- [ ] Sección de logros muestra últimos 3 desbloqueados
- [ ] Progresos visuales para logros cercanos
- [ ] Notificaciones no intrusivas (toast notifications)

---

### Fase 5: Polish & Testing (Semana 6)

**Objetivo**: Integración final, testing y deploy

#### 5.1 Integración End-to-End

**Tareas**:
1. Verificar flujo completo: registro → puntos → canje
2. Testear offline behavior (catálogo cacheado)
3. Testear concurrencia (dos usuarios canjeando misma recompensa)
4. Testear expiración de canjes (30 días)
5. Verificar que no haya memory leaks en React components

**Acceptance Criteria**:
- [ ] Flujo completo funciona sin errores
- [ ] Catálogo se cachea correctamente en IndexedDB
- [ ] Race conditions manejadas con transacciones DB
- [ ] Canjes expiran después de 30 días
- [ ] No memory leaks (verificar con React DevTools)

#### 5.2 Testing Manual

**Escenarios**:
1. **Usuario Explorador**: Canjear café (100 pts)
2. **Usuario Conocedor**: Canjear cena (2000 pts) con stock limitado
3. **Usuario Embajador**: Canjear noche gratis (5000 pts) exclusiva
4. **Stock agotado**: Intentar canjear recompensa sin stock
5. **Puntos insuficientes**: Intentar canjear sin puntos suficientes
6. **Logros automáticos**: Desbloquear "Primera Visita", "Conocedor", "Embajador"
7. **Rachas**: Visitar 3 días consecutivos y verificar logro

**Acceptance Criteria**:
- [ ] Todos los escenarios pasan sin errores
- [ ] Mensajes de error claros y amigables
- [ ] Notificaciones de logros aparecen correctamente
- [ ] UI responde correctamente a cada acción

#### 5.3 Performance Optimization

**Tareas**:
1. Optimizar queries con índices apropiados
2. Implementar paginación si catálogo > 50 items
3. Lazy loading de imágenes de recompensas
4. Code splitting para componentes pesados
5. Verificar Time to Interactive (TTI) < 3s

**Acceptance Criteria**:
- [ ] Queries ejecutan en < 100ms (verificar con Supabase logs)
- [ ] Lighthouse score >= 90 para performance
- [ ] Imágenes cargan con lazy loading
- [ ] Bundle size incrementa < 100KB gzipped

#### 5.4 Documentation

**Archivos**:
- `/docs/rewards-system.md` (guía de usuario)
- `/docs/rewards-api.md` (referencia de API)
- Actualizar `/README.md` con nuevas features

**Tareas**:
1. Documentar flujo de canje para usuarios
2. Documentar API endpoints para desarrolladores
3. Crear guía de administración (crear recompensas)
4. Actualizar README con screenshots

**Acceptance Criteria**:
- [ ] Documentación clara en español
- [ ] Screenshots de flujo completo
- [ ] Ejemplos de código para integraciones
- [ ] Guía de troubleshooting común

---

### Fase 6: Deploy & Monitoring (Semana 7-8)

**Objetivo**: Deploy a producción y monitoreo

#### 6.1 Pre-Deploy Checklist

**Base de Datos**:
- [ ] Migraciones probadas en staging
- [ ] Backups de base de datos realizados
- [ ] RLS policies verificadas
- [ ] Datos de prueba preparados

**Código**:
- [ ] Todos los tests pasan (`npm test`)
- [ ] Build exitoso sin errores (`npm run build`)
- [ ] Linting limpio (`npm run lint`)
- [ ] TypeScript sin errores (`npm run type-check`)

**Configuración**:
- [ ] Variables de entorno configuradas
- [ ] Supabase connection verified
- [ ] Dominios de producción configurados

#### 6.2 Deploy Strategy

**Enfoque**: Blue-Green Deployment

1. **Despliegue a Staging**
   - Crear branch `release/rewards-system`
   - Deploy a Vercel staging
   - Testing completo en staging
   - Corregir issues encontrados

2. **Despliegue a Producción**
   - Merge a `main` después de aprobación
   - Deploy automático a Vercel production
   - Monitoreo de logs en tiempo real
   - Ready para rollback si hay problemas críticos

3. **Post-Deploy**
   - Verificar funcionalidad crítica
   - Monitorear errores por 24 horas
   - Recopilar feedback inicial
   - Iterar sobre issues encontrados

#### 6.3 Monitoring & Analytics

**Métricas a Monitorear**:

| Metric | Tool | Alert Threshold |
|--------|------|-----------------|
| Error rate | Sentry | > 1% |
| API latency | Supabase logs | > 500ms |
| Page load time | Vercel Analytics | > 3s |
| Redemption success rate | Custom dashboard | < 95% |

**Dashboards**:
1. **Errores en tiempo real** (Sentry)
2. **Performance de API** (Supabase dashboard)
3. **Métricas de negocio** (Vercel Analytics + custom)
4. **Feedback de usuarios** (form tipo Typeform)

---

## 3. Matriz de Riesgos

### Riesgos Técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Race condition en stock | MEDIA | ALTA | Transacciones DB con `SELECT FOR UPDATE` |
| Canje duplicado | BAJA | ALTA | Idempotencia con redemption_code único |
| Performance degradation | BAJA | MEDIA | Índices DB + paginación |
| Memory leaks en React | MEDIA | MEDIA | Testing con React DevTools Profiler |

### Riesgos de Producto

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Baja tasa de canje | MEDIA | ALTA | UX testing + prototipado antes de implementar |
| Stock management complejo | MEDIA | MEDIA | Sistema simple (sin reservas) en MVP |
| Logros no motivadores | MEDIA | BAJA | Iterar basado en feedback |

---

## 4. Recursos Necesarios

### Equipo

| Rol | FTE | Responsabilidades |
|-----|-----|-------------------|
| Full-stack Developer | 1-2 | Implementación de features + testing |
| UI/UX Designer | 0.5 | Diseño de componentes + screenshots |
| Product Manager | 0.25 | Priorización + feedback |

### Herramientas

| Herramienta | Uso | Costo |
|-------------|-----|-------|
| Supabase (Pro) | Base de datos + Auth | $25/mes |
| Vercel (Pro) | Hosting + Analytics | $20/mes |
| Sentry | Error tracking | Free tier |
| Figma | Diseño UI | Free tier |

---

## 5. Success Criteria

### Criteria de Éxito Técnico

- [ ] Coverage de tests >= 85%
- [ ] Zero errores críticos en producción (Sentry)
- [ ] Lighthouse score >= 90
- [ ] Build time < 60 segundos
- [ ] API response time < 200ms (p95)

### Criteria de Éxito de Negocio

- [ ] 20% de usuarios activos canjean al menos 1 recompensa/mes
- [ ] 60% de puntos emitidos son redimidos
- [ ] Tiempo promedio hasta primer canje < 7 días
- [ ] 30% de usuarios tienen streak activo (>=3 días)
- [ ] NPS (Net Promoter Score) >= 40

---

## 6. Timeline Detallado

### Semana 1: Foundation
- **Día 1-2**: Migraciones de base de datos (rewards, redemptions)
- **Día 3-4**: Servicios core (rewardsService, redemptionService)
- **Día 5**: Tests unitarios + revisión de código

### Semana 2: Rewards UI
- **Día 1-2**: Componentes base (RewardCatalog, RewardCard)
- **Día 3-4**: RewardDetailModal + integración con routing
- **Día 5**: RedemptionHistory + RedemptionQR

### Semana 3: Achievements (Part 1)
- **Día 1-2**: Migraciones de achievements
- **Día 3-4**: achievementService + triggers automáticos
- **Día 5**: AchievementGrid component

### Semana 4: Achievements (Part 2)
- **Día 1-2**: AchievementBadge + animaciones
- **Día 3-4**: Integración con dashboard
- **Día 5**: Testing de logros + fixes

### Semana 5: Streaks
- **Día 1-2**: Migraciones de streaks + triggers
- **Día 3-4**: StreakTracker component
- **Día 5**: Integración con dashboard

### Semana 6: Polish & Testing
- **Día 1-2**: Testing end-to-end manual
- **Día 3-4**: Performance optimization
- **Día 5**: Documentation + screenshots

### Semana 7: Pre-Deploy
- **Día 1-2**: Pre-deploy checklist + staging deploy
- **Día 3-4**: Staging testing + fixes
- **Día 5**: Aprobación para producción

### Semana 8: Deploy & Monitoring
- **Día 1**: Deploy a producción
- **Día 2-5**: Monitoreo + hotfixes si necesarios
- **Día 7**: Análisis post-deploy + retrospective

---

## 7. Comunicación & Stakeholders

### Stakeholders

| Stakeholder | Rol | Intereses |
|-------------|-----|-----------|
| Business Owner | Cliente | Métricas de éxito |
| Restaurant Staff | Usuario final | Facilidad de uso |
| Customers | Usuario final | Valor percibido |
| Dev Team | Implementación | Mantenibilidad |

### Plan de Comunicación

- **Semanal**: Status update al equipo (email)
- **Quincenal**: Demo de progreso a stakeholders (meet)
- **Post-deploy**: Encuesta de satisfacción a usuarios (Typeform)

---

## 8. Post-Launch Roadmap

### Iteración 1 (Mes 2)
- Sistema de lista de espera para recompensas agotadas
- Recompensas recomendadas basadas en historial
- Notificaciones push de canjes exitosos

### Iteración 2 (Mes 3)
- Leaderboard de usuarios top
- Sistema de referidos con bonificación
- Integración con redes sociales (compartir logros)

### Iteración 3 (Mes 4+)
- Recompensas personalizables
- Experiencias exclusivas subastables
- Gamificación avanzada (misiones, challenges)

---

## 9. Retrospective Format

Post-deploy, ejecutar retrospective con template:

**What Went Well**:
- [ ]
- [ ]

**What Could Be Improved**:
- [ ]
- [ ]

**Action Items for Next Iteration**:
1. [ ] - [Owner] - [Due Date]
2. [ ] - [Owner] - [Due Date]

---

**FIN DEL PLAN DE IMPLEMENTACIÓN**

**Próximos Pasos**:
1. Aprobar plan y timeline
2. Asignar recursos y equipo
3. Ejecutar `/moai:2-run SPEC-GAMIFICATION-002` para iniciar desarrollo
4. Reunión semanal de seguimiento
