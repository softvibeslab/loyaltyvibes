# SPEC-AUTH-001: Implementation Plan

## Overview

| Field | Value |
|-------|-------|
| **SPEC ID** | SPEC-AUTH-001 |
| **Title** | Core Loyalty Engine Implementation |
| **Phases** | 6 |
| **Priority** | HIGH |

---

## Phase 1: Authentication Foundation

**Objective:** Establish core authentication infrastructure

### Tasks

| Task | File | Description |
|------|------|-------------|
| 1.1 | `/src/shared/lib/supabase/client.ts` | Create Supabase browser client |
| 1.2 | `/src/shared/lib/supabase/server.ts` | Create Supabase server client |
| 1.3 | `/src/features/auth/services/authService.ts` | Auth operations (login, register, logout) |
| 1.4 | `/src/features/auth/hooks/useAuth.ts` | Session management hook |
| 1.5 | `/src/features/auth/types.ts` | TypeScript types and Zod schemas |
| 1.6 | `/src/app/(auth)/register/page.tsx` | Registration page |
| 1.7 | `/src/app/(auth)/login/page.tsx` | Login page |
| 1.8 | `/src/app/(auth)/layout.tsx` | Auth layout with guards |
| 1.9 | `/supabase/migrations/001_profiles.sql` | Profiles table and RLS |

### Dependencies
- None (foundational)

### Deliverables
- Working login/register flows
- Session persistence
- Role-based redirect

---

## Phase 2: Profile Management

**Objective:** User profile CRUD and tier display

### Tasks

| Task | File | Description |
|------|------|-------------|
| 2.1 | `/src/features/auth/services/profileService.ts` | Profile CRUD operations |
| 2.2 | `/src/features/auth/hooks/useProfile.ts` | Profile query hook |
| 2.3 | `/src/app/(client)/profile/page.tsx` | Profile page |
| 2.4 | `/src/shared/components/ui/TierBadge.tsx` | Tier badge component |
| 2.5 | `/src/features/wallet/components/TierProgress.tsx` | Tier progress bar |

### Dependencies
- Phase 1 (auth infrastructure)

### Deliverables
- Profile viewing/editing
- Tier badge display
- Progress visualization

---

## Phase 3: Tier System

**Objective:** Automatic tier progression logic

### Tasks

| Task | File | Description |
|------|------|-------------|
| 3.1 | `/src/features/gamification/constants/tiers.ts` | Tier constants and thresholds |
| 3.2 | `/src/features/gamification/hooks/useTierCalculation.ts` | Tier calculation hook |
| 3.3 | `/supabase/migrations/002_tier_trigger.sql` | Database trigger for promotion |
| 3.4 | `/src/features/gamification/components/LevelProgress.tsx` | Level progress component |
| 3.5 | `/src/features/gamification/services/tierService.ts` | Tier promotion service |

### Dependencies
- Phase 2 (profile management)

### Tier Thresholds

```typescript
export const TIER_THRESHOLDS = {
  explorador: { visits: 0, spent: 0, multiplier: 1.0 },
  conocedor: { visits: 5, spent: 5000, multiplier: 1.2 },
  embajador: { visits: 15, spent: 15000, multiplier: 1.5 },
} as const;
```

### Deliverables
- Automatic tier promotion
- Realtime notifications
- Progress tracking

---

## Phase 4: Points Calculation

**Objective:** Points earning and balance management

### Tasks

| Task | File | Description |
|------|------|-------------|
| 4.1 | `/src/features/transactions/types.ts` | Transaction types and schemas |
| 4.2 | `/src/features/transactions/services/pointsService.ts` | Points calculation |
| 4.3 | `/src/features/transactions/services/transactionService.ts` | Transaction CRUD |
| 4.4 | `/src/features/wallet/components/PointsDashboard.tsx` | Points display |
| 4.5 | `/src/features/transactions/components/TransactionHistory.tsx` | History view |
| 4.6 | `/supabase/migrations/003_transactions.sql` | Transactions table |

### Dependencies
- Phase 3 (tier system for multipliers)

### Points Formula

```typescript
const calculatePoints = (
  amount: number,
  pointsPerPeso: number,
  multiplier: number
): number => Math.floor(amount * pointsPerPeso * multiplier);
```

### Deliverables
- Points earning logic
- Balance tracking
- Transaction history

---

## Phase 5: Offline Support

**Objective:** Offline-first transaction capability

### Tasks

| Task | File | Description |
|------|------|-------------|
| 5.1 | `/src/shared/lib/db/dexie.ts` | Dexie.js database schema |
| 5.2 | `/src/shared/hooks/useOnlineStatus.ts` | Online status hook |
| 5.3 | `/src/features/transactions/hooks/useOfflineMutation.ts` | Offline mutation hook |
| 5.4 | `/src/features/transactions/services/syncService.ts` | Background sync |
| 5.5 | `/src/shared/components/ui/OfflineIndicator.tsx` | Offline UI indicator |
| 5.6 | `/public/sw.js` | Service worker registration |

### Dependencies
- Phase 4 (transaction service)

### IndexedDB Schema

```typescript
const db = new Dexie('LoyaltyVibesDB');
db.version(1).stores({
  offlineTransactions: '++id, sync_id, user_id, created_at, synced',
  cachedProfiles: 'id, updated_at',
});
```

### Deliverables
- Offline transaction queue
- Automatic sync
- Status indicators

---

## Phase 6: Route Protection

**Objective:** Role-based access control

### Tasks

| Task | File | Description |
|------|------|-------------|
| 6.1 | `/src/app/(client)/layout.tsx` | Customer layout with guards |
| 6.2 | `/src/app/(staff)/layout.tsx` | Staff layout with guards |
| 6.3 | `/src/app/(admin)/layout.tsx` | Admin layout with guards |
| 6.4 | `/src/middleware.ts` | Next.js middleware for routes |
| 6.5 | `/src/features/auth/components/AuthGuard.tsx` | Auth guard component |

### Dependencies
- Phase 1 (auth hooks)

### Route Matrix

| Route | admin | staff | customer |
|-------|-------|-------|----------|
| /admin/* | YES | NO | NO |
| /scanner/* | YES | YES | NO |
| /wallet/* | YES | YES | YES |

### Deliverables
- Role-based routing
- Unauthorized redirects
- Protected layouts

---

## Implementation Order

```
Phase 1 (Foundation)
    │
    ├── Phase 2 (Profile)
    │       │
    │       └── Phase 3 (Tier)
    │               │
    │               └── Phase 4 (Points)
    │                       │
    │                       └── Phase 5 (Offline)
    │
    └── Phase 6 (Routes) [parallel with Phase 2+]
```

---

## Resource Requirements

### Development Environment
- Node.js 20 LTS
- pnpm (recommended)
- Supabase CLI for local development

### External Services
- Supabase Project (configured)
- Supabase Auth (email enabled)

---

## Risk Mitigation

| Phase | Risk | Mitigation |
|-------|------|------------|
| 1 | Auth config errors | Test with Supabase local |
| 3 | Trigger race conditions | Use SERIALIZABLE transactions |
| 5 | Queue overflow | Implement size limits |
| 6 | Route bypass | Test all role combinations |

---

## Success Criteria

- [ ] All 6 phases completed
- [ ] Unit test coverage >= 85%
- [ ] All acceptance criteria passing
- [ ] Offline transactions sync correctly
- [ ] Tier promotions trigger automatically
- [ ] RLS policies prevent unauthorized access
