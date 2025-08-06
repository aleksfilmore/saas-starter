# 🔧 COMPREHENSIVE CLEANUP ANALYSIS & ACTION PLAN

## 🚨 CRITICAL ISSUES IDENTIFIED

### 1. **Authentication System Problems**
- **Missing API**: `/api/signup-local` doesn't exist but is used in quiz signup
- **Dashboard Error**: "Application error: a client-side exception has occurred"
- **Inconsistent Auth**: Multiple auth systems (lucia vs local) causing conflicts

### 2. **Duplicate Files & Confusion**
- **Quiz vs Scan**: Both exist but serve same purpose
- **Multiple Dashboards**: `app/dashboard/`, `app/(dashboard)/`, `app/dashboard/staged/`
- **Auth Endpoints**: `/api/auth/` vs `/api/login` vs `/api/login-local` vs `/api/signup`

### 3. **Button Text Issues**
- Quiz signup button says "Start My Healing Journey" instead of "CREATE ACCOUNT"
- Network error on final signup step

## 📁 DUPLICATE FILES TO CONSOLIDATE

### Dashboard Duplicates
```
✅ KEEP: app/dashboard/page.tsx (main dashboard)
❌ REMOVE: app/dashboard/staged/page.tsx (duplicate/test)
❌ REMOVE: app/(dashboard)/* (old grouped routes)
```

### Quiz/Scan Duplicates  
```
✅ KEEP: app/quiz/page.tsx (attachment quiz)
❌ REMOVE: app/scan/page.tsx (duplicate of quiz)
❌ REMOVE: app/(dashboard)/onboarding-quiz/page.tsx (duplicate)
```

### Auth API Duplicates
```
✅ KEEP: app/api/auth/* (lucia-based production auth)
❌ REMOVE: app/api/login-local/ (old/test)
❌ REMOVE: app/api/signup/ (old endpoint)
⚠️  FIX: Create missing /api/signup-local for quiz
```

## 🛠 REQUIRED FIXES

### 1. Create Missing API Endpoint
- Create `/api/signup-local/route.ts` for quiz signup

### 2. Fix Button Text
- Change "Start My Healing Journey" to "CREATE ACCOUNT" in quiz signup

### 3. Fix Dashboard Error
- Investigate and fix client-side exception in dashboard
- Likely auth-related issue

### 4. Consolidate Auth System
- Use consistent auth throughout (lucia-based)
- Remove conflicting auth implementations

## 🗂 FILE CLEANUP PLAN

### Phase 1: Remove Clear Duplicates
1. Remove `app/scan/` (duplicate of quiz)
2. Remove `app/dashboard/staged/` (test dashboard)
3. Remove `app/(dashboard)/` entire folder (old structure)

### Phase 2: Auth System Cleanup
1. Create missing `/api/signup-local`
2. Remove conflicting auth endpoints
3. Standardize on lucia auth

### Phase 3: UI Fixes
1. Fix button text in quiz
2. Fix dashboard errors
3. Test complete auth flow

## 🎯 IMMEDIATE ACTION ITEMS

1. **Create `/api/signup-local/route.ts`** - Fix quiz signup
2. **Fix button text** - Change to "CREATE ACCOUNT"  
3. **Debug dashboard error** - Find root cause
4. **Remove duplicate files** - Clean up confusion
5. **Test auth flow** - Ensure signup→login→dashboard works

## 📊 CURRENT AUTH ENDPOINTS

### ✅ Working (lucia-based)
- `/api/auth/signin` - Production login
- `/api/auth/signup` - Production signup  
- `/api/auth/me` - Get current user
- `/api/auth/logout` - Logout

### ❌ Missing/Broken
- `/api/signup-local` - Used by quiz (MISSING)
- `/api/login` - Inconsistent with lucia

### 🗑 To Remove
- `/api/login-local` - Old test endpoint
- `/api/signup` - Conflicts with `/api/auth/signup`

This analysis provides the roadmap to fix all authentication issues and clean up the codebase.
