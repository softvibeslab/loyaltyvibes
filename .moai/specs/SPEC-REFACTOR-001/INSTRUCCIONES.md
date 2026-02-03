# Instrucciones de Ejecución - SPEC-REFACTOR-001

## Estado Actual: FASE PRESERVE COMPLETADA ✅

Todos los archivos de prueba han sido creados y configurados. El siguiente paso es ejecutar las pruebas para validar que todo funciona correctamente.

---

## Paso 1: Instalar Dependencias

La primera vez que ejecute las pruebas, necesita instalar las nuevas dependencias de testing:

```bash
cd /config/workspace/loyaltyvibes
npm install
```

**Dependencias nuevas instaladas:**
- vitest@^2.1.2 (framework de pruebas)
- @testing-library/react@^16.0.1 (testing para React)
- @testing-library/jest-dom@^6.6.0 (matchers para tests)
- @testing-library/user-event@^14.5.2 (simulación de eventos de usuario)
- @vitejs/plugin-react@^4.3.0 (plugin de React para Vitest)
- jsdom@^25.0.0 (implementación de DOM para tests)

**Si npm install falla:**
```bash
# Limpiar e intentar de nuevo
rm -rf node_modules package-lock.json
npm install
```

---

## Paso 2: Ejecutar Todas las Pruebas

### Opción A: Modo Watch (Desarrollo)
```bash
npm test
```
Esto ejecutará las pruebas en modo watch, reejecutando automáticamente cuando cambie el código.

### Opción B: Una Sola Vez (CI/CD)
```bash
npm test -- --run
```
Esto ejecutará todas las pruebas una sola vez y saldrá.

### Opción C: Con Reporte de Cobertura
```bash
npm run test:coverage
```

Esto generará un reporte de cobertura en:
- **Terminal:** Resumen de cobertura
- **Archivo HTML:** `coverage/index.html` (ábralo en su navegador)
- **Archivo LCOV:** `coverage/lcov.info` (para herramientas de CI)

---

## Paso 3: Verificar Resultados

### Resultados Esperados

**Todas las pruebas deben pasar:**
```
 ✓ src/features/auth/__tests__/types.test.ts (30+ tests)
 ✓ src/features/auth/services/__tests__/authService.test.ts (35+ tests)
 ✓ src/features/auth/hooks/__tests__/useAuth.test.ts (40+ tests)
 ✓ src/features/auth/__tests__/auth.integration.test.ts (25+ tests)

Test Files  4 passed (4)
     Tests  130+ passed (130)
  Start at  <timestamp>
  Duration  <tiempo de ejecución>
```

**Cobertura esperada:**
```
 % Coverage report from v8
--------------------|---------|---------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|---------|---------|---------|-------------------
All files           |   >85   |   >80   |   >85   |   >85   |
 auth               |   >90   |   >85   |   >90   |   >90   |
  types.ts          |   100   |   100   |   100   |   100   |
  authService.ts    |   >90   |   >85   |   >90   |   >90   |
  useAuth.ts        |   >85   |   >80   |   >85   |   >85   |
--------------------|---------|---------|---------|---------|-------------------
```

---

## Paso 4: Validar TypeScript

```bash
npx tsc --noEmit
```

**Resultado esperado:** Sin errores de TypeScript

---

## Paso 5: Validar Linting

```bash
npm run lint
```

**Resultado esperado:** Sin errores de ESLint (warnings aceptados)

---

## Archivos de Prueba Creados

### 1. Configuración
- `vitest.config.ts` - Configuración principal de Vitest
- `src/test/setup.ts` - Setup global de mocks

### 2. Pruebas Unitarias
- `src/features/auth/__tests__/types.test.ts`
  - 30+ tests de validación Zod
  - Tests de constantes (USER_ROLES, TIER_LEVELS, etc.)
  - Tests de type inference

- `src/features/auth/services/__tests__/authService.test.ts`
  - 35+ tests del servicio de autenticación
  - Tests de register, login, logout
  - Tests de manejo de errores

- `src/features/auth/hooks/__tests__/useAuth.test.ts`
  - 40+ tests del hook useAuth
  - Tests de estado de React
  - Tests de redirecciones

### 3. Pruebas de Integración
- `src/features/auth/__tests__/auth.integration.test.ts`
  - 25+ tests de flujos completos
  - Tests de registro end-to-end
  - Tests de login end-to-end
  - Tests de logout end-to-end

**Total: 130+ casos de prueba**

---

## Troubleshooting

### Error: "Cannot find module 'vitest'"
**Solución:**
```bash
npm install
```

### Error: "JSDOM not configured"
**Solución:**
Verificar que `vitest.config.ts` tenga `environment: 'jsdom'`

### Error: "Supabase client mock not working"
**Solución:**
Verificar que `src/test/setup.ts` esté correctamente importado en `vitest.config.ts`

### Error: "ReferenceError: document is not defined"
**Solución:**
Esto indica que jsdom no está configurado. Revisar `vitest.config.ts`

### Tests fallan con "Timeout"
**Solución:**
Aumentar el timeout en `vitest.config.ts`:
```ts
test: {
  testTimeout: 10000, // 10 segundos
  hookTimeout: 10000,
}
```

### Cobertura es menor al 85%
**Solución:**
1. Revisar el reporte HTML en `coverage/index.html`
2. Identificar líneas no cubiertas (marcadas en rojo)
3. Agregar tests para esas líneas específicas
4. Re-ejecutar `npm run test:coverage`

---

## Métricas de Éxito

### ✅ Fase PRESERVE Completada
- [ ] Todas las pruebas pasan (130+ tests)
- [ ] Cobertura >= 85%
- [ ] TypeScript sin errores
- [ ] ESLint sin errores
- [ ] Comportamiento preservado (no regresiones)

### ⏳ Fase IMPROVE (Pendiente)
Una vez validadas las pruebas de caracterización, puede proceder con mejoras:
- Rate limiting
- Password strength indicator
- Recuperación de contraseña
- AuthGuard components
- useProfile hook

---

## Comandos Rápidos

```bash
# Instalar dependencias
npm install

# Ejecutar tests (modo watch)
npm test

# Ejecutar tests (una vez)
npm test -- --run

# Ejecutar tests con coverage
npm run test:coverage

# Verificar TypeScript
npx tsc --noEmit

# Verificar linting
npm run lint

# Verificar linting y corregir automáticamente
npm run lint -- --fix
```

---

## Próximos Pasos

### Inmediato (Validación)
1. Ejecutar `npm install`
2. Ejecutar `npm test -- --run`
3. Ejecutar `npm run test:coverage`
4. Validar cobertura >= 85%

### Corto Plazo (Fase IMPROVE)
1. Implementar rate limiting
2. Implementar password strength indicator
3. Implementar AuthGuard components
4. Implementar useProfile hook con realtime

### Largo Plazo (Mejoras)
1. Implementar recuperación de contraseña
2. Implementar verificación de email
3. Optimizaciones de performance
4. Tests E2E con Playwright o Cypress

---

## Contacto

Si tiene problemas o preguntas sobre la ejecución de las pruebas, revise:
1. El reporte detallado: `EXECUTION_REPORT.md`
2. La especificación: `spec.md`
3. El plan de implementación: `implementation.md`

---

**Última Actualización:** 2026-02-02
**Estado:** Listo para ejecutar
**Versión de MoAI-ADK:** 1.0.0
