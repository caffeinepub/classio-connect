# Classio Connect

## Current State
Full-stack Classio Connect platform with 15 learning modules, three user roles (Admin, Teacher, Student), and Motoko backend. No PWA support.

## Requested Changes (Diff)

### Add
- `manifest.json` with app name, icons, theme color, standalone display mode
- `sw.js` service worker with cache-first static assets, network-first for API calls, offline fallback to index.html
- PWA meta tags in index.html (theme-color, apple-mobile-web-app, manifest link)
- Service worker registration script in index.html
- App icon (512x512) for installable PWA

### Modify
- `index.html`: Add title, meta tags, manifest link, SW registration

### Remove
- Nothing

## Implementation Plan
1. Generate 512x512 PWA icon
2. Write manifest.json to public/
3. Write sw.js service worker to public/
4. Update index.html with all PWA meta tags and SW registration
