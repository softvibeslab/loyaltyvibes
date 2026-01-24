---
id: SPEC-AUTH-001
version: "1.0.0"
status: draft
created: "2026-01-24"
updated: "2026-01-24"
author: "MoAI-ADK"
priority: HIGH
---

# HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-24 | MoAI-ADK | Initial SPEC creation |

---

# SPEC-AUTH-001: Core Loyalty Engine

## Overview

| Field | Value |
|-------|-------|
| **SPEC ID** | SPEC-AUTH-001 |
| **Title** | Core Loyalty Engine - Authentication, Profile, Tier & Points System |
| **Priority** | HIGH (Foundational System) |
| **Domain** | AUTH |
| **Lifecycle** | spec-anchored (Level 2) |

## Description

Core Loyalty Engine provides the foundational infrastructure for the LoyaltyVibes PWA, including user authentication via Supabase Auth, profile management with tier tracking, gamification system with three loyalty tiers (Explorador, Conocedor, Embajador), and points calculation with offline-first architecture.

---

## 1. Environment

### 1.1 Technical Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Frontend | Next.js | 14+ (App Router) | Hybrid rendering |
| Frontend | React | 18.2+ | UI components |
| Frontend | TypeScript | 5.3+ | Type safety |
| Frontend | Tailwind CSS | 3.4+ | Styling |
| State | TanStack Query | Latest | Server state |
| State | Zustand | Latest | Client state |
| Offline | Dexie.js | Latest | IndexedDB |
| Backend | Supabase | Latest | PostgreSQL + Auth |
| Validation | Zod | Latest | Schema validation |

### 1.2 User Roles

| Role | Access | Permissions |
|------|--------|-------------|
| admin | Full system | Manage all resources |
| staff | Scanner terminal | Create transactions, scan QR |
| customer | Wallet app | View points, redeem rewards |

### 1.3 Tier Configuration

| Tier | Name | Requirement | Multiplier |
|------|------|-------------|------------|
| explorador | Bronze | Registration | 1.0x |
| conocedor | Silver | 5 visits OR $5,000 MXN | 1.2x |
| embajador | Gold | 15 visits OR $15,000 MXN | 1.5x |

---

## 2. Assumptions

### 2.1 Technical Assumptions

| ID | Assumption | Confidence |
|----|------------|------------|
| A-01 | Supabase Auth handles email/password authentication | HIGH |
| A-02 | RLS policies provide sufficient security | HIGH |
| A-03 | IndexedDB can store offline data (~50MB+) | HIGH |
| A-04 | TanStack Query handles sync | MEDIUM |

### 2.2 Business Assumptions

| ID | Assumption | Confidence |
|----|------------|------------|
| B-01 | Users accept email-based authentication | HIGH |
| B-02 | Tier thresholds are fixed | MEDIUM |
| B-03 | Points formula is static | HIGH |
| B-04 | Tier progression is one-way | MEDIUM |

---

## 3. Requirements (EARS Format)

### 3.1 Ubiquitous Requirements

| ID | Requirement |
|----|-------------|
| U-01 | The system **shall** require authentication for all protected routes |
| U-02 | The system **shall** validate all user inputs using Zod schemas |
| U-03 | The system **shall** log all authentication events with timestamps |
| U-04 | The system **shall** enforce role-based access control |
| U-05 | The system **shall** maintain session state across page refreshes |
| U-06 | The system **shall** display user tier information on authenticated pages |

### 3.2 Event-Driven Requirements

| ID | Event | Action |
|----|-------|--------|
| E-01 | **WHEN** user submits registration form **THEN** create auth.users and profiles record with default customer role and explorador tier |
| E-02 | **WHEN** user submits login credentials **THEN** authenticate via Supabase Auth and redirect to role-appropriate dashboard |
| E-03 | **WHEN** user clicks logout **THEN** clear session and redirect to landing page |
| E-04 | **WHEN** staff creates EARN transaction **THEN** calculate points as `amount_mxn * points_per_peso * tier_multiplier` |
| E-05 | **WHEN** transaction is created **THEN** increment visit_count and update total_spent |
| E-06 | **WHEN** user reaches tier threshold **THEN** automatically promote to next tier |
| E-07 | **WHEN** authentication fails **THEN** display error and log attempt |
| E-08 | **WHEN** session expires **THEN** redirect to login with return URL |
| E-09 | **WHEN** offline transaction queued **THEN** sync when connection restored |

### 3.3 State-Driven Requirements

| ID | Condition | Action |
|----|-----------|--------|
| S-01 | **IF** user.role is 'admin' **THEN** grant access to /admin/* routes |
| S-02 | **IF** user.role is 'staff' **THEN** grant access to /scanner/* and deny /admin/* |
| S-03 | **IF** user.role is 'customer' **THEN** grant access to /wallet/* only |
| S-04 | **IF** user.tier is 'explorador' **THEN** apply 1.0x multiplier |
| S-05 | **IF** user.tier is 'conocedor' **THEN** apply 1.2x multiplier |
| S-06 | **IF** user.tier is 'embajador' **THEN** apply 1.5x multiplier |
| S-07 | **IF** device is offline **THEN** queue transactions in IndexedDB |
| S-08 | **IF** user is authenticated **THEN** display greeting with tier badge |

### 3.4 Optional Requirements

| ID | Feature |
|----|---------|
| O-01 | **WHERE** possible, provide social login (Google, Apple) |
| O-02 | **WHERE** possible, enable biometric authentication |
| O-03 | **WHERE** possible, show progress bar to next tier |
| O-04 | **WHERE** possible, provide tier promotion animation |

### 3.5 Unwanted Behavior Requirements

| ID | Prohibition |
|----|-------------|
| N-01 | The system **shall NOT** store passwords in plaintext |
| N-02 | The system **shall NOT** allow customers to access staff/admin routes |
| N-03 | The system **shall NOT** allow modification of transactions (immutable) |
| N-04 | The system **shall NOT** expose PII in logs |
| N-05 | The system **shall NOT** allow tier demotion without admin |
| N-06 | The system **shall NOT** process negative point balances |

### 3.6 Complex Requirements

| ID | Requirement |
|----|-------------|
| C-01 | **WHILE** tier is 'explorador' **AND WHEN** visit_count >= 5 **OR** total_spent >= 5000 **THEN** promote to 'conocedor' |
| C-02 | **WHILE** tier is 'conocedor' **AND WHEN** visit_count >= 15 **OR** total_spent >= 15000 **THEN** promote to 'embajador' |
| C-03 | **WHILE** offline **AND WHEN** transaction created **THEN** calculate points locally and sync when online |

---

## 4. Database Schema

### profiles

```sql
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
```

### transactions

```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    staff_id UUID REFERENCES profiles(id),
    establishment_id UUID REFERENCES establishments(id),
    amount_mxn DECIMAL(10,2) NOT NULL,
    points_change INTEGER NOT NULL,
    transaction_type TEXT CHECK (transaction_type IN ('EARN', 'REDEEM')) NOT NULL,
    multiplier DECIMAL(3,2) DEFAULT 1.0,
    sync_id TEXT,
    synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### RLS Policies

```sql
-- Users read own transactions
CREATE POLICY "Users read own transactions"
ON transactions FOR SELECT
USING (auth.uid() = user_id);

-- Staff insert transactions
CREATE POLICY "Staff insert transactions"
ON transactions FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'staff')
    )
);
```

---

## 5. Points Calculation

```typescript
const calculatePoints = (
  amount_mxn: number,
  points_per_peso: number, // default: 0.1
  tier_multiplier: number  // 1.0 | 1.2 | 1.5
): number => {
  return Math.floor(amount_mxn * points_per_peso * tier_multiplier);
};

// Example: $800 MXN * 0.1 * 1.5 (Embajador) = 120 points
```

---

## 6. Dependencies

### External

| Package | Version | Purpose |
|---------|---------|---------|
| @supabase/supabase-js | ^2.45.0 | Supabase client |
| @supabase/auth-helpers-nextjs | ^0.10.0 | Next.js auth |
| @tanstack/react-query | ^5.0.0 | Server state |
| zustand | ^4.5.0 | Client state |
| dexie | ^4.0.0 | IndexedDB |
| zod | ^3.23.0 | Validation |

### Internal

| Module | Depends On |
|--------|------------|
| wallet | auth |
| gamification | auth |
| transactions | auth, gamification |

---

## 7. Quality Gates (TRUST 5)

| Pillar | Target | Method |
|--------|--------|--------|
| Tested | >= 85% coverage | Vitest |
| Readable | TypeScript strict | ESLint |
| Unified | Feature modules | Structure check |
| Secured | RLS + Zod | Audit |
| Trackable | Event logging | Console |

---

## 8. Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Offline queue overflow | MEDIUM | HIGH | Queue limits with eviction |
| Tier race condition | LOW | MEDIUM | Database triggers |
| Token expiration offline | MEDIUM | MEDIUM | Token refresh on reconnect |

---

## Traceability

| Requirement | Implementation |
|-------------|----------------|
| U-01 | `/src/features/auth/hooks/useAuth.ts` |
| E-01 | `/src/features/auth/services/authService.ts` |
| E-04 | `/src/features/transactions/services/transactionService.ts` |
| C-01, C-02 | `/src/features/gamification/hooks/useTierCalculation.ts` |
| S-07 | `/src/features/transactions/hooks/useOfflineMutation.ts` |
