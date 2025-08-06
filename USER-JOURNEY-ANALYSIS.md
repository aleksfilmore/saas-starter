# User Journey Analysis - Current vs. Specification

## ❌ DISCREPANCIES FOUND

### A. ENTRY TREE ISSUES

**Current State:**
- Homepage has "Try Beta Scan" button pointing to `/scan` (doesn't exist)
- No clear entry tree with Login vs New User paths
- Current homepage is a marketing/coming soon page, not the main platform entry

**Specification Requires:**
```
Homepage → "Start Free Scan" CTA → /scan (8Q lightning quiz)
         → "Sign-in" link → /login → DASHBOARD
```

### B. NEW-USER PATH ISSUES

| Step | Current | Specification | Status |
|------|---------|--------------|--------|
| 1 | `/quiz` exists but not `/scan` | `/scan` with 8Q lightning quiz | ❌ MISSING |
| 2 | No results splash | `/welcome` - Archetype reveal + teaser | ❌ PARTIAL |
| 3 | `/sign-up/from-quiz` exists | `/signup?from=scan` | ⚠️ DIFFERENT ROUTE |
| 4 | No alias generator | `/username` - codename picker | ❌ MISSING |
| 5 | No auto-login flow | Session cookie set | ❌ MISSING |
| 6 | Dashboard exists | `/dashboard` starter stage | ✅ EXISTS |
| 7 | LUMO in dashboard only | Auto-opening checklist | ✅ LUMO PLACED |

### C. SPECIFIC MISSING COMPONENTS

1. **`/scan` Route**: Lightning 8-question quiz (currently have `/quiz` instead)
2. **`/username` Route**: Alias generator with dice button  
3. **Auto-Login Flow**: After signup, set session cookie
4. **LUMO Onboarding**: Auto-opening checklist with specific copy
5. **Homepage Routing**: Need proper "Start Free Scan" CTA

### D. API ENDPOINTS STATUS

**Existing:**
- ✅ `/api/auth/signup` 
- ✅ `/api/dashboard`
- ✅ `/api/auth/me`

**Missing/Need Verification:**
- ❌ `/api/user/alias` (PATCH endpoint)
- ❌ `/api/onboard/optional` (break-up date, emotions)
- ❌ `/api/checkin` (no-contact logging)
- ❌ `/api/lumo/notifications`
- ❌ `/api/tour/state` and PATCH `/api/tour`

## 🔧 REQUIRED FIXES

### 1. Route Structure Updates
```
CREATE: /app/scan/page.tsx           # Lightning 8Q quiz
CREATE: /app/username/page.tsx       # Alias generator  
UPDATE: /app/page.tsx               # Fix homepage CTAs
VERIFY: /app/welcome/page.tsx       # Ensure archetype reveal works
```

### 2. User Flow Integration
- Fix homepage CTA to point to `/scan` not `/quiz`
- Ensure `/scan` → `/welcome` → `/signup?from=scan` → `/username` → dashboard flow
- Implement auto-login after alias selection

### 3. LUMO Integration
- Verify LUMO auto-opens on first dashboard visit
- Implement onboarding checklist inside bubble
- Add break-up date picker and emotion slider

### 4. API Completeness
- Create missing user alias endpoint
- Create onboarding data endpoints
- Verify authentication flow completeness

## 🎯 PRIORITY ORDER

1. **HIGH**: Fix homepage CTA routing
2. **HIGH**: Create `/scan` route (8Q quiz)
3. **HIGH**: Create `/username` route (alias generator)  
4. **MEDIUM**: Verify LUMO onboarding checklist
5. **MEDIUM**: Create missing API endpoints
6. **LOW**: Analytics events implementation

The current implementation has good bones but doesn't match the specified user journey flow.
