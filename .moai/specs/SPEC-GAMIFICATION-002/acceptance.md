---
id: SPEC-GAMIFICATION-002
version: "1.0.0"
status: draft
created: "2026-02-03"
updated: "2026-02-03"
author: "MoAI-ADK"
---

# Criterios de Aceptación - SPEC-GAMIFICATION-002

## Overview

Este documento define los **criterios de aceptación detallados** para cada feature del Sistema de Recompensas y Gamificación Avanzada. Los criterios están organizados por fase y siguiendo el formato **Given-When-Then** para escenarios de prueba.

---

## 1. Fase 1: Catálogo de Recompensas

### Feature 1.1: Listado de Recompensas

**User Story**: Como cliente, quiero ver un catálogo de recompensas disponibles para poder decidir qué canjear.

#### Escenario 1.1.1: Ver catálogo completo
**Given** el usuario está autenticado como "customer"
**When** navega a `/rewards`
**Then** ve un grid de recompensas activas
**And** las recompensas están ordenadas por costo de puntos (ascendente)
**And** cada recompensa muestra: nombre, descripción corta, costo, stock (si aplica)

#### Escenario 1.1.2: Filtrar por categoría
**Given** el usuario está en el catálogo de recompensas
**When** selecciona el filtro "Comida"
**Then** solo ve recompensas con categoría "food"
**And** el filtro activo está destacado visualmente

#### Escenario 1.1.3: Recompensas agotadas
**Given** existe una recompensa con stock = 0
**When** el catálogo carga
**Then** la recompensa muestra badge "Agotado"
**And** el botón de canje está deshabilitado
**And** la tarjeta tiene opacidad reducida

#### Escenario 1.1.4: Últimas unidades
**Given** existe una recompensa con stock <= 5
**When** el catálogo carga
**Then** la recompensa muestra badge "¡Últimas X unidades!"
**And** el badge es color naranja para urgencia

#### Escenario 1.1.5: Offline - catálogo cacheado
**Given** el usuario visitó el catálogo anteriormente (online)
**When** navega a `/rewards` estando offline
**Then** ve la versión cacheada del catálogo
**And** aparece indicador "Contenido puede no estar actualizado"
**And** los botones de canje están deshabilitados con mensaje "Conexión requerida"

---

### Feature 1.2: Detalle de Recompensa

**User Story**: Como cliente, quiero ver detalles completos de una recompensa antes de canjearla.

#### Escenario 1.2.1: Ver detalles completos
**Given** el usuario está en el catálogo
**When** hace clic en una recompensa
**Then** se abre un modal con:
  - Nombre completo
  - Descripción detallada
  - Imagen (si disponible)
  - Costo exacto en puntos
  - Stock actual
  - Categoría
  - Requisito de nivel (TierBadge)

#### Escenario 1.2.2: Recompensa exclusiva de nivel
**Given** el usuario es "Explorador"
**When** ve una recompensa exclusiva para "Conocedor"
**Then** el modal muestra mensaje "Disponible para nivel Conocedor"
**And** la recompensa aparece con filtro gris
**And** el botón dice "Nivel insuficiente" (deshabilitado)

#### Escenario 1.2.3: Puntos insuficientes
**Given** el usuario tiene 200 puntos
**When** ve una recompensa que cuesta 500 puntos
**Then** el botón de canje dice "Puntos insuficientes" (deshabilitado)
**And** aparece mensaje "Te faltan 300 puntos para canjear esta recompensa"

---

### Feature 1.3: Canje de Recompensas

**User Story**: Como cliente, quiero canjear mis puntos por recompensas de manera sencilla y segura.

#### Escenario 1.3.1: Canje exitoso
**Given** el usuario tiene suficientes puntos
**And** cumple con el requisito de nivel
**And** la recompensa tiene stock disponible
**When** confirma el canje
**Then** se crea una transacción tipo 'redeem'
**And** los puntos se descontaron de su balance
**And** se genera un código único (formato: LV-XXXX-XXXX-XXXX)
**And** se muestra modal de confirmación con el código
**And** aparece notificación "¡Canje exitoso! Código generado"

#### Escenario 1.3.2: Validación de puntos
**Given** el usuario tiene 300 puntos
**When** intenta canjear recompensa de 500 puntos
**Then** el canje es rechazado
**And** aparece error "Puntos insuficientes. Tienes 300 puntos y necesitas 500"
**And** no se crea ninguna transacción

#### Escenario 1.3.3: Validación de nivel
**Given** el usuario es "Explorador" (tier 1)
**When** intenta canjear recompensa exclusiva "Conocedor"
**Then** el canje es rechazado
**And** aparece error "Esta recompensa requiere nivel Conocedor"
**And** no se descuentan puntos

#### Escenario 1.3.4: Stock agotado durante canje
**Given** la recompensa tenía 1 unidad
**And** otro usuario canjeó la última unidad hace 1 segundo
**When** el usuario intenta canjear
**Then** el canje es rechazado
**And** aparece error "Recompensa agotada"
**And** el catálogo se actualiza mostrando "Agotado"

#### Escenario 1.3.5: Código único por canje
**Given** el usuario canjea la misma recompensa dos veces
**When** se generan los códigos
**Then** cada código es único
**And** los códigos siguen formato LV-XXXX-XXXX-XXXX
**And** no hay duplicados en la base de datos

#### Escenario 1.3.6: Expiración de canje
**Given** el usuario canjeó una recompensa
**When** pasan 30 días
**Then** el estado del canje cambia a "expired"
**And** el código ya no es válido
**And** el historial muestra "Expirado" con icono de reloj

---

## 2. Fase 2: Historial de Canjes

### Feature 2.1: Lista de Canjes

**User Story**: Como cliente, quiero ver mi historial de canjes para recordar qué he obtenido.

#### Escenario 2.1.1: Ver historial completo
**Given** el usuario ha canjeado 5 recompensas
**When** navega a la sección "Mis Canjes"
**Then** ve una lista cronológica de todos sus canjes
**And** cada item muestra: nombre de recompensa, fecha, estado, puntos usados
**And** la lista está ordenada por fecha (más reciente primero)

#### Escenario 2.1.2: Estados de canje
**Given** el usuario tiene múltiples canjes
**When** ve el historial
**Then** los estados están diferenciados visualmente:
  - **Pending**: Badge verde "Pendiente"
  - **Claimed**: Badge azul "Reclamado"
  - **Expired**: Badge gris "Expirado"
  - **Cancelled**: Badge rojo "Cancelado"

#### Escenario 2.1.3: Filtro por estado
**Given** el usuario tiene 10 canjes con diferentes estados
**When** selecciona filtro "Pendientes"
**Then** solo ve canjes con estado "pending"
**And** puede filtrar por cualquier estado

---

### Feature 2.2: Código QR de Canje

**User Story**: Como cliente, quiero mostrar un código QR para que el personal valide mi canje.

#### Escenario 2.2.1: Generar QR
**Given** el usuario tiene un canje pendiente
**When** hace clic en el canje
**Then** ve un código QR generado
**And** el QR contiene el código único de canje
**And** también ve el código en formato texto (ej: LV-ABC1-DEF2-GHI3)

#### Escenario 2.2.2: Validación por personal
**Given** el personal escanea el QR del cliente
**When** el código es válido
**Then** el estado cambia a "Claimed"
**And** se registra timestamp de reclamación
**And** el cliente ve notificación "¡Recompensa reclamada!"

#### Escenario 2.2.3: Código inválido
**Given** el personal intenta validar un código ya reclamado
**When** escanea el QR
**Then** aparece error "Este código ya fue reclamado"
**And** no se permite validación duplicada

---

## 3. Fase 3: Sistema de Logros

### Feature 3.1: Grid de Logros

**User Story**: Como cliente, quiero ver qué logros he desbloqueado y cuáles faltan.

#### Escenario 3.1.1: Ver logros desbloqueados
**Given** el usuario ha desbloqueado 3 logros
**When** navega a la sección "Logros"
**Then** ve un grid con todos los logros disponibles
**And** los logros desbloqueados están a color
**And** los logros bloqueados están en gris con icono de candado

#### Escenario 3.1.2: Detalle de logro
**Given** el usuario ve un logro bloqueado
**When** hace clic en él
**Then** aparece modal con:
  - Nombre del logro
  - Descripción
  - Requisitos para desbloquearlo
  - Puntos bonus que otorga

#### Escenario 3.1.3: Logro secreto
**Given** existe un logro secreto "Sorpresa"
**When** el usuario no lo ha desbloqueado
**Then** aparece en el grid como "???" con icono de interrogación
**And** no muestra requisitos hasta desbloquearse

---

### Feature 3.2: Desbloqueo Automático de Logros

**User Story**: Como cliente, quiero recibir notificaciones cuando desbloqueo nuevos logros.

#### Escenario 3.2.1: Primera visita
**Given** el usuario se acaba de registrar
**When** completa su primera transacción (earn)
**Then** se desbloquea automáticamente el logro "Primera Visita"
**And** se le otorgan 50 puntos bonus
**And** aparece notificación: "🎉 ¡Logro desbloqueado! Primera Visita +50 pts"

#### Escenario 3.2.2: Ascenso a Conocedor
**Given** el usuario es "Explorador"
**When** cumple requisitos (5 visitas Y $5,000 gastados)
**Then** asciende a nivel "Conocedor"
**And** se desbloquea el logro "Conocedor"
**And** se le otorgan 100 puntos bonus
**And** aparece modal de celebración con confeti

#### Escenario 3.2.3: Primer canje
**Given** el usuario nunca ha canjeado recompensas
**When** canjea su primera recompensa
**Then** se desbloquea el logro "Primer Canje"
**And** se le otorgan 75 puntos bonus
**And** aparece notificación "🎁 ¡Primer canje completado! +75 pts"

#### Escenario 3.2.4: No duplicar logros
**Given** el usuario ya tiene el logro "Primera Visita"
**When** completa otra transacción
**Then** no se desbloquea el logro nuevamente
**And** no se otorgan puntos bonus duplicados

---

### Feature 3.3: Bonus de Puntos por Logros

**User Story**: Como cliente, quiero recibir puntos extra cuando desbloqueo logros.

#### Escenario 3.3.1: Puntos bonus otorgados
**Given** el logro "Embajador" otorga 200 puntos bonus
**When** el usuario desbloquea este logro
**Then** su balance de puntos aumenta en 200
**And** se crea una transacción tipo 'adjustment'
**And** la descripción dice "Logro: Embajador (+200 pts)"

#### Escenario 3.3.2: Transacción de ajuste
**Given** el usuario desbloquea un logro con 150 puntos bonus
**When** se otorgan los puntos
**Then** la transacción tiene:
  - type: 'adjustment'
  - points: +150
  - multiplier_applied: 1.0
  - description: "Logro: [Nombre del logro]"

---

## 4. Fase 4: Sistema de Rachas (Streaks)

### Feature 4.1: Contador de Rachas

**User Story**: Como cliente, quiero ver mi racha actual de visitas para mantenerme motivado.

#### Escenario 4.1.1: Iniciar racha
**Given** el usuario nunca ha visitado el establecimiento
**When** completa su primera transacción
**Then** su racha actual se establece en 1
**And** su mejor racha también es 1
**And** no aparece el StreakTracker (racha < 3)

#### Escenario 4.1.2: Incrementar racha
**Given** el usuario tiene racha de 2 días
**When** visita el establecimiento al día siguiente
**Then** su racha actual incrementa a 3
**And** aparece el componente StreakTracker en el dashboard
**And** muestra "🔥 Racha actual: 3 días"

#### Escenario 4.1.3: Romper racha
**Given** el usuario tiene racha de 5 días
**When** pasa más de 1 día sin visitar
**Then** su racha actual se resetea a 1
**And** su mejor racha se mantiene en 5
**And** aparece mensaje "Racha interrumpida. ¡Comienza de nuevo!"

#### Escenario 4.1.4: Nuevo récord
**Given** el usuario tiene mejor racha de 7 días
**When** alcanza racha de 8 días
**Then** su mejor racha se actualiza a 8
**And** aparece badge "¡Nuevo récord!" en StreakTracker
**And** se muestra confeti en el dashboard

---

### Feature 4.2: Logros de Rachas

**User Story**: Como cliente, quiero desbloquear logros especiales por mantener rachas.

#### Escenario 4.2.1: Racha semanal
**Given** el usuario visita el establecimiento 3 días en una semana
**When** completa la tercera visita consecutiva
**Then** se desbloquea el logro "Racha Semanal"
**And** recibe 150 puntos bonus
**And** aparece notificación "🔥 ¡Racha de 3 días! +150 pts"

#### Escenario 4.2.2: Visitante devoto
**Given** el usuario visita 7 días consecutivos
**When** completa la séptima visita
**Then** se desbloquea el logro "Visitante Devoto"
**And** recibe 300 puntos bonus
**And** aparece celebración especial con animación de fuego

#### Escenario 4.2.3: Acumulador
**Given** el usuario ha acumulado 10,000 puntos en total
**When** su balance total alcanza 10,000
**Then** se desbloquea el logro "Acumulador"
**And** recibe 500 puntos bonus
**And** aparece mensaje "💰 ¡Has acumulado 10,000 puntos! +500 pts"

---

## 5. Criterios de Aceptación No Funcionales

### Performance

#### NF-PERF-001: Tiempo de carga del catálogo
**Given** el catálogo tiene 50 recompensas
**When** el usuario navega a `/rewards`
**Then** el page load time es < 2 segundos (3G)
**And** el Time to Interactive es < 3 segundos

#### NF-PERF-002: Latencia de canje
**Given** el usuario confirma un canje
**When** se procesa la transacción
**Then** el response time es < 1 segundo
**And** la UI actualiza inmediatamente sin refresh

#### NF-PERF-003: Offline cache
**Given** el usuario visitó el catálogo estando online
**When** se va offline y navega a `/rewards`
**Then** el catálogo carga desde cache en < 500ms
**And** muestra indicador de "versión cacheada"

### Seguridad

#### NF-SEC-001: RLS policies
**Given** existen múltiples usuarios en el sistema
**When** un usuario intenta ver canjes de otro usuario
**Then** la API retorna 403 Forbidden
**And** no se exponen datos de otros usuarios

#### NF-SEC-002: Validación de nivel
**Given** un usuario "Explorador" intenta canjear recompensa exclusiva "Embajador"
**When** envía solicitud a la API
**Then** la API valida el nivel antes de crear transacción
**And** retorna error 400 "Nivel insuficiente"
**And** no se crean registros en la base de datos

#### NF-SEC-003: Idempotencia de canje
**Given** un usuario envía dos solicitudes de canje idénticas simultáneamente
**When** se procesan las solicitudes
**Then** solo se crea un canje
**And** los puntos se descontaron una sola vez
**And** la segunda solicitud retorna error "Ya canjeado"

### Usabilidad

#### NF-UX-001: Mensajes de error claros
**Given** ocurre un error durante canje
**When** se muestra el error al usuario
**Then** el mensaje está en español claro
**And** indica la causa exacta del problema
**And** sugiere acción correctiva si aplica

**Ejemplo**:
- ❌ "Error en canje"
- ✅ "Puntos insuficientes. Tienes 200 puntos y necesitas 500 para esta recompensa."

#### NF-UX-002: Estados visuales
**Given** un componente tiene múltiples estados
**When** el usuario interactúa con él
**Then** los estados están visualmente diferenciados:
  - Loading: Spinner o skeleton
  - Success: Color verde + checkmark
  - Error: Color rojo + mensaje explicativo
  - Disabled: Opacidad reducida + cursor not-allowed

#### NF-UX-003: Responsive design
**Given** el usuario accede desde un móvil
**When** ve el catálogo de recompensas
**Then** el grid se adapta a 1 columna
**And** los botones son touch-friendly (>= 44px de altura)
**And** el texto es legible sin zoom

### Compatibilidad

#### NF-COMP-001: Backward compatibility
**Given** existe código de cliente utilizando la API actual
**When** se deployan las nuevas features
**Then** no hay breaking changes en endpoints existentes
**And** los nuevos endpoints son opcionles
**And** el cliente antiguo sigue funcionando

#### NF-COMP-002: Offline-first
**Given** el usuario está offline
**When** interactúa con la app
**Then** puede ver el catálogo cacheado
**And** puede navegar entre secciones
**And** los intentos de canje muestran "Conexión requerida"

---

## 6. Matriz de Pruebas

### Pruebas Unitarias

| Componente | Test Case | Expected Result |
|------------|-----------|-----------------|
| rewardsService.getActiveRewards() | Filtrar por tier 'conocedor' | Retorna solo recompensas con min_tier <= conocedor |
| redemptionService.redeemReward() | Puntos insuficientes | Lanza error "Puntos insuficientes" |
| redemptionService.redeemReward() | Stock = 0 | Lanza error "Recompensa agotada" |
| achievementService.unlockAchievement() | Logro ya desbloqueado | Retorna false (no duplica) |
| streakService.updateStreak() | Visita consecutiva | Incrementa current_streak en 1 |

### Pruebas de Integración

| Flujo | Pasos | Expected Result |
|-------|-------|-----------------|
| Canje completo | 1. Ver catálogo<br>2. Seleccionar recompensa<br>3. Confirmar canje<br>4. Ver código QR | Canje exitoso con código único |
| Desbloqueo logro | 1. Usuario nuevo se registra<br>2. Completa primera transacción | Logro "Primera Visita" desbloqueado |
| Racha de 3 días | 1. Día 1: visita<br>2. Día 2: visita<br>3. Día 3: visita | Logro "Racha Semanal" desbloqueado |

### Pruebas E2E (Playwright)

| Scenario | Steps | Assertions |
|----------|-------|------------|
| Usuario canjea café | 1. Login como customer<br>2. Navega a /rewards<br>3. Busca "Café gratis"<br>4. Confirma canje | - Modal de confirmación visible<br>- Código QR generado<br>- Puntos descontados |
| Staff valida canje | 1. Login como staff<br>2. Escanea QR code<br>3. Verifica datos | - Estado cambia a "Claimed"<br>- Timestamp registrado |

---

## 7. Definición de Done

### Feature está "Done" cuando:

- [ ] Todos los criterios de aceptación funcionales pasan
- [ ] Todos los criterios no funcionales se cumplen
- [ ] Tests unitarios tienen coverage >= 85%
- [ ] Tests de integración pasan
- [ ] Pruebas E2E manuales pasan
- [ ] Code review completado y aprobado
- [ ] Documentación actualizada
- [ ] No errores de TypeScript (`npm run type-check`)
- [ ] No errores de ESLint (`npm run lint`)
- [ ] Build exitoso (`npm run build`)
- [ ] Deploy a staging completado
- [ ] Monitoreo configurado (Sentry, Analytics)

### Sprint está "Done" cuando:

- [ ] Todos los features planificados están "Done"
- [ ] Retroactiva del sprint completada
- [ ] Acciones de mejora documentadas
- [ ] Stakeholders notificados del progreso

---

## 8. Sign-Off Criteria

### Para Business Owner:

- [ ] He visto demo de la funcionalidad
- [ ] Los criterios de aceptación se cumplen
- [ ] La UX es intuitiva para usuarios finales
- [ ] El valor de negocio está claro

### Para Tech Lead:

- [ ] El código sigue estándares del equipo
- [ ] La arquitectura es mantenible
- [ ] No hay deuda técnica significativa
- [ ] La performance es aceptable

### Para QA:

- [ ] Todos los escenarios de prueba pasan
- [ ] No bugs críticos conocidos
- [ ] Los edge cases están manejados
- [ ] La documentación de testing está completa

---

**FIN DE CRITERIOS DE ACEPTACIÓN**

**Uso**:
1. Antes de empezar cada feature, revisar criterios correspondientes
2. Durante desarrollo, verificar cada escenario
3. Al finalizar cada feature, confirmar que todo está "Done"
4. Para sign-off, obtener aprobación de Business, Tech y QA
