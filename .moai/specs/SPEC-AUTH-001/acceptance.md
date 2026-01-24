# SPEC-AUTH-001: Acceptance Criteria

## Overview

| Field | Value |
|-------|-------|
| **SPEC ID** | SPEC-AUTH-001 |
| **Title** | Core Loyalty Engine |
| **Scenarios** | 15 |
| **Format** | Given/When/Then (Gherkin) |

---

## 1. Authentication Scenarios

### AC-01: Successful User Registration

```gherkin
Feature: User Registration

Scenario: Customer registers successfully
  Given the user is on the registration page
  And the user enters valid email "turista@example.com"
  And the user enters valid password meeting complexity requirements
  And the user selects role "customer"
  When the user submits the registration form
  Then a new auth.users entry is created
  And a new profiles record is created with:
    | field | value |
    | role | customer |
    | tier | explorador |
    | points_balance | 0 |
  And the user is redirected to /wallet
  And a welcome notification is displayed
```

### AC-02: Successful Login

```gherkin
Scenario: Staff member logs in successfully
  Given the user is on the login page
  And the user has an existing account with email "staff@example.com"
  And the user has role "staff"
  When the user enters correct email and password
  And the user submits the login form
  Then the user session is established
  And the user is redirected to /scanner
  And the session persists across page refreshes
```

### AC-03: Failed Login - Invalid Credentials

```gherkin
Scenario: Login fails with wrong password
  Given the user is on the login page
  When the user enters incorrect email or password
  And the user submits the login form
  Then an error message "Invalid email or password" is displayed
  And the user remains on the login page
  And the failed attempt is logged with timestamp
```

### AC-04: Session Expiration

```gherkin
Scenario: Session expires and user is redirected
  Given the user is authenticated
  And the user session expires after inactivity
  When the user attempts to access a protected route
  Then the user is redirected to the login page
  And the original route is preserved as return URL
  And a message "Your session has expired" is displayed
```

---

## 2. Profile Management Scenarios

### AC-05: View Profile Information

```gherkin
Scenario: Customer views their profile
  Given the user is authenticated as a customer
  When the user navigates to /wallet/profile
  Then the profile page displays:
    | field | description |
    | Name | User's display name |
    | Email | User's email address |
    | Tier | Current tier with badge |
    | Points | Current points balance |
    | Total Spent | Cumulative MXN amount |
    | Visit Count | Number of visits |
```

### AC-06: Tier Badge Display

```gherkin
Scenario: Silver tier badge is displayed
  Given the user has tier "conocedor"
  When the user views any authenticated page
  Then a silver tier badge is displayed in the header
  And the tier name "Conocedor" is visible
  And the 1.2x multiplier is indicated
```

---

## 3. Tier Progression Scenarios

### AC-07: Automatic Tier Promotion by Visits

```gherkin
Scenario: User promoted to Silver after 5 visits
  Given the user has tier "explorador"
  And the user has visit_count = 4
  When a new EARN transaction is created
  And visit_count becomes 5
  Then the user tier is automatically updated to "conocedor"
  And a Realtime notification is sent to the user
  And a celebration animation is displayed
```

### AC-08: Automatic Tier Promotion by Spending

```gherkin
Scenario: User promoted to Silver after spending threshold
  Given the user has tier "explorador"
  And the user has total_spent = $4,500 MXN
  When a new EARN transaction of $600 MXN is created
  And total_spent becomes $5,100 MXN
  Then the user tier is automatically updated to "conocedor"
  And the new 1.2x multiplier applies to future transactions
```

### AC-09: Tier Progress Display

```gherkin
Scenario: Progress towards Gold tier is shown
  Given the user has tier "conocedor"
  And the user has visit_count = 10
  And the user has total_spent = $8,000 MXN
  When the user views the wallet dashboard
  Then the progress bar shows:
    | metric | current | target | progress |
    | Visits | 10 | 15 | 66% |
    | Spending | $8,000 | $15,000 | 53% |
  And the message "5 more visits or $7,000 more to reach Embajador" is displayed
```

---

## 4. Points Calculation Scenarios

### AC-10: Points Earned at Bronze Tier

```gherkin
Scenario: Bronze tier earns base points
  Given the user has tier "explorador" (1.0x multiplier)
  And the establishment has points_per_peso = 0.1
  When a staff member creates an EARN transaction of $500 MXN
  Then points_change = floor(500 * 0.1 * 1.0) = 50
  And the user's points_balance increases by 50
  And the transaction is recorded with multiplier = 1.0
```

### AC-11: Points Earned at Gold Tier

```gherkin
Scenario: Gold tier earns bonus points
  Given the user has tier "embajador" (1.5x multiplier)
  And the establishment has points_per_peso = 0.1
  When a staff member creates an EARN transaction of $800 MXN
  Then points_change = floor(800 * 0.1 * 1.5) = 120
  And the user's points_balance increases by 120
  And the transaction is recorded with multiplier = 1.5
```

---

## 5. Offline Scenarios

### AC-12: Offline Transaction Queueing

```gherkin
Scenario: Transaction is queued when offline
  Given the staff device is offline
  And the staff has scanned a customer QR code
  When the staff creates an EARN transaction
  Then the transaction is stored in IndexedDB with a unique sync_id
  And the offline indicator shows "1 pending transaction"
  And points are calculated locally for display
```

### AC-13: Automatic Sync on Reconnection

```gherkin
Scenario: Queued transactions sync when online
  Given the staff device has 3 offline transactions queued
  When the device reconnects to the internet
  Then all queued transactions are synced to Supabase
  And the synced_at timestamp is updated for each transaction
  And the offline indicator shows "All synced"
  And customer balances are updated in real-time
```

---

## 6. Role-Based Access Scenarios

### AC-14: Customer Access Restriction

```gherkin
Scenario: Customer cannot access admin routes
  Given the user is authenticated with role "customer"
  When the user attempts to access /admin/dashboard
  Then the user is redirected to /wallet
  And a message "You don't have permission to access this page" is displayed
```

### AC-15: Staff Access Scope

```gherkin
Scenario: Staff can access scanner but not admin
  Given the user is authenticated with role "staff"
  When the user navigates the application
  Then /scanner/* routes are accessible
  And /wallet/* routes are accessible (as customer view)
  And /admin/* routes are NOT accessible
```

---

## Validation Checklist

### Authentication
- [ ] Registration creates profile with correct defaults
- [ ] Login redirects to role-appropriate dashboard
- [ ] Failed login shows error and logs attempt
- [ ] Session persists and expires correctly

### Profile
- [ ] Profile displays all required fields
- [ ] Tier badge shows correct tier
- [ ] Progress bar calculates correctly

### Tier System
- [ ] Promotion triggers at visit threshold
- [ ] Promotion triggers at spending threshold
- [ ] Multiplier applies to future transactions
- [ ] Notification sent on promotion

### Points
- [ ] Points calculated with correct formula
- [ ] Multiplier applied based on tier
- [ ] Balance updates after transaction

### Offline
- [ ] Transactions queue when offline
- [ ] Indicator shows pending count
- [ ] Sync occurs on reconnection
- [ ] synced_at timestamp updated

### Access Control
- [ ] Customers blocked from admin routes
- [ ] Staff blocked from admin routes
- [ ] Redirect shows permission message
