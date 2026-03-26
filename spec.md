# Classio Connect

## Current State
Single LoginPage at `/` with 3 role tabs (Student/Teacher/Admin) in one card. Login errors shown only via toast notifications. Routes: `/admin`, `/teacher`, `/student` for dashboards.

## Requested Changes (Diff)

### Add
- `StudentLoginPage` at `/login/student` — 2-tile split-screen layout (left: branded panel with logo/tagline/visuals, right: login form with inline error messages)
- `TeacherLoginPage` at `/login/teacher` — same 2-tile split-screen layout
- `AdminLoginPage` at `/login/admin` — same 2-tile split-screen layout
- Role selection landing page at `/` — a professional portal selector with 3 cards (Student, Teacher, Admin) that routes to respective login pages
- Inline error display below each field (red error text) in addition to/instead of only toast on wrong credentials

### Modify
- `App.tsx` — add routes for `/login/student`, `/login/teacher`, `/login/admin`; keep `/` as the role selection page; keep dashboard routes
- Login error handling — show inline error messages (e.g., "Invalid credentials" under the form) with a red alert box, not just toast

### Remove
- Old single `LoginPage` with tabs (replace entirely)

## Implementation Plan
1. Create `RoleSelectPage.tsx` at `/` — 3 large clickable cards for Student / Teacher / Admin, each linking to the respective login page
2. Create `StudentLoginPage.tsx` — 2-tile: left tile branded with logo + motivational tagline + decorative element; right tile has School Name, Student Name, Mobile Number fields with inline validation errors
3. Create `TeacherLoginPage.tsx` — 2-tile: left branded; right tile has Teacher ID + Email with inline errors
4. Create `AdminLoginPage.tsx` — 2-tile: left branded; right tile has Email + Password with inline errors
5. Update `App.tsx` — register all 4 new routes, remove old LoginPage import
6. Each login page: on wrong credentials show a red alert box inside the form (not just toast), mobile-responsive (stack tiles vertically on small screens)
