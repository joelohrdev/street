---
paths:
  - 'resources/js/pages/**'
---

# Pages

## Layouts are assigned centrally in app.tsx, not per page
Every Inertia page gets AppLayout by default. The switch in `resources/js/app.tsx` decides otherwise: `auth/*` gets AuthLayout, `settings/*` gets AppLayout + SettingsLayout, and `gallery` returns `null` because the public site has its own chrome (`components/site-header.tsx`).

Add a case there when a new page must not sit inside the authenticated shell. Pages only set layout *props* (e.g. `Photos.layout = { breadcrumbs: [...] }`), never the layout itself.
