# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm start        # Start production server
```

Environment variable required: `NEXT_PUBLIC_API_URL` pointing to the Django backend.

## Architecture

This is a Next.js 15 (App Router) e-commerce frontend for a clothing shop, backed by a Django REST API.

### Route Groups

- `src/app/(main)/` — Public shopping interface with shared layout (navbar, footer)
- `src/app/(checkout)/` — Multi-step checkout flow with its own layout
- `src/app/admin/` — Admin product management

Key routes: `/items`, `/items/[cat-id]`, `/items-detail/[item-id]`, `/upload`, `/myaccount`, `/checkout`

### Data Layer

**RTK Query** handles all server state. The base API is configured in `src/services/api.ts` — it reads `access_token` from localStorage and attaches it as a Bearer token. Endpoints are split across:
- `src/services/endpoints/items-endpoints.ts` — product queries/mutations
- `src/services/endpoints/account-endpoints.ts` — auth, cart, user profile
- `src/services/endpoints/admin-endpoints.ts` — admin CRUD

Cache tags: `Items`, `Cart`, `User`, `AdminItems`

### Auth

`AuthContext` (`src/contexts/auth-context.tsx`) manages auth state. On login, JWT tokens (`access_token`, `refresh_token`) and serialized `user` are stored in localStorage. The context calls `useVerifyQuery` on mount to validate the token and refresh user data.

### Cart (Guest + Authenticated)

Guest cart is stored in localStorage via utilities in `src/lib/cart-utils.ts`. On login, the guest cart is sent to the backend for merging (`guest_cart` field in login payload), and the local cart is cleared after a successful merge. The cart state dispatches a `localCartUpdated` CustomEvent so components can reactively update.

### Backend Item Shape

Items have: `id`, `name`, `price`, `description`, `categories[]`, `details.color`, `details.detail` (markdown), `sizes[]` (id, size, quantity), `images[]` (image_url, is_primary), `detail_images[]`.

### Styling

Tailwind CSS with HSL CSS variables for theming, dark mode via `next-themes` (class-based). Component variants use `class-variance-authority`. Utility: `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge). Font: Maven Pro (Google Fonts).

### UI Patterns

- Toast notifications: `sonner`
- Forms: React Hook Form + Zod schemas
- Animations: Framer Motion
- Carousels: Embla Carousel with autoplay
- Images: `next/image` with Cloudinary remote pattern; uploads via `next-cloudinary`
- Markdown rendering: `react-markdown` (used for item detail descriptions)
- Path alias: `@/` maps to `src/`
