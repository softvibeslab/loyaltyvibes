# LoyaltyVibes - Ecosistema Digital de Lealtad

## Nombre del Proyecto
**LoyaltyVibes** - Plataforma de Lealtad Gamificada Offline-First para el Sector Hospitalario

## Descripción
LoyaltyVibes es una Progressive Web Application (PWA) diseñada para devolver la soberanía de datos y relaciones con clientes a los negocios de hospitalidad en San Cristóbal de Las Casas, Chiapas. La plataforma combate la dependencia de intermediarios digitales (OTAs como Booking.com, Expedia) que erosionan márgenes del 15-25% y "secuestran" los datos del cliente final.

## Contexto del Mercado

### Problema
- Dependencia excesiva de plataformas intermediarias (OTAs)
- Erosión de márgenes de beneficio (15-25% por transacción)
- Pérdida de acceso directo a datos del cliente
- Incapacidad para construir relaciones de lealtad a largo plazo
- Infraestructura de internet inestable en la región

### Oportunidad
Crear una "infraestructura de conversión directa" que devuelva la soberanía de marca e ingresos al empresario local, con arquitectura resiliente para zonas con conectividad intermitente.

## Audiencia Objetivo

### Usuarios Primarios

**Clientes/Turistas**
- Visitantes nacionales e internacionales
- Comensales frecuentes
- Usuarios de la Wallet digital para acumular y canjear puntos

**Personal de Establecimiento (Staff)**
- Meseros y cajeros
- Operadores del escáner/POS
- Procesamiento de transacciones en modo offline/online

**Administradores**
- Dueños de restaurantes y hoteles
- Gerentes de marketing
- Acceso al dashboard analítico

### Establecimientos Objetivo
- Hotelería boutique (Hotel Bo, Casa del Alma)
- Gastronomía de autor (Sol y Luna, La Lupe)
- Negocios de "Lujo Experiencial"
- Comercios locales en San Cristóbal de Las Casas

## Características Principales

### 1. Wallet del Cliente
- Código QR dinámico firmado criptográficamente (JWT)
- Regeneración automática cada 30 segundos
- Visualización de progreso hacia siguiente nivel
- Catálogo de recompensas filtrable por nivel

### 2. Terminal de Staff (Escáner)
- Escaneo de QR con validación instantánea
- Procesamiento offline con sincronización posterior
- Pantalla siempre activa (wake lock) para escaneo continuo
- Registro de transacciones por monto

### 3. Dashboard Administrativo
- Métricas de engagement y retención
- Activación de promociones temporales
- Gestión de catálogo de recompensas
- Reportes de ROI

### 4. Sistema de Gamificación por Niveles

| Nivel | Requisito | Multiplicador | Beneficios |
|-------|-----------|---------------|------------|
| **Explorador (Bronce)** | Registro | 1x | Acumulación base, promociones generales |
| **Conocedor (Plata)** | 5 visitas o $5,000 MXN | 1.2x | Prioridad en reservas, postre cumpleaños |
| **Embajador (Oro)** | 15 visitas o $15,000 MXN | 1.5x | Menú secreto, mesas exclusivas, catas privadas |

### 5. Arquitectura Offline-First
- Operación sin conexión a internet
- Cola de sincronización automática
- Validación local de códigos QR
- Resiliencia para infraestructura inestable de Chiapas

## Propuesta de Valor

### Para Negocios
- Recuperación de márgenes (elimina comisiones de OTAs)
- Soberanía de datos del cliente
- Construcción de relaciones directas de lealtad
- Herramienta de retención en temporadas bajas

### Para Clientes
- Experiencia fluida sin fricciones de red
- Progresión de estatus con beneficios tangibles
- Acceso a experiencias exclusivas (no solo descuentos)
- Extensión de la narrativa de marca (bienestar, exclusividad)

## Casos de Uso

### Registro de Visita (Cliente)
1. Usuario abre la app
2. App muestra QR dinámico automáticamente
3. Usuario presenta pantalla al mesero
4. App recibe confirmación y celebra con animación
5. Saldo de puntos actualizado

### Procesamiento Offline (Staff)
1. Mesero escanea QR del cliente (sin internet)
2. App valida firma criptográfica localmente
3. Mesero ingresa monto ($800 MXN)
4. App guarda transacción en cola local
5. Sincronización automática al recuperar conexión

## Mecánicas de Retención

### Efecto de Gradiente de Meta
- Barras de progreso visuales ("Faltan $200 para nivel Plata")
- Acelera consumo al acercarse a metas

### Bonificaciones Temporales
- "Horas Felices de Puntos" para temporadas bajas
- Doble puntos en días específicos
- Incentivos para momentos de baja demanda

## Métricas de Éxito (KPIs)

### Técnicos
- Tiempo de carga (FCP): < 1.5 segundos en 4G
- Velocidad de escaneo: < 2 segundos
- Resiliencia offline: 100% sincronización exitosa

### Negocio
- Tasa de conversión Bronce→Plata: 15% en 3 meses
- Cero fraudes por Replay Attack
- Incremento en visitas recurrentes

## Diferenciadores Competitivos
- Arquitectura Offline-First (crítico para Chiapas)
- Seguridad anti-fraude con QR dinámico firmado
- Gamificación enfocada en experiencias, no solo descuentos
- Soberanía de datos para el comerciante local

---
*Generado por MoAI-ADK - Análisis de Dataset*
