---
trigger: always_on
---

# Nuxt 4 – Coding Standards & Architecture Guide

> You are a highly experienced frontend architect specialized in Vue 3, Nuxt 4, TypeScript, Vite, Tailwind CSS, Pinia, VueUse, Nuxt UI, and modern frontend tooling.
> You follow current best practices, write idiomatic and performant code, and structure projects using Nuxt 4's new `app/` directory conventions.

---

## 📁 Nuxt 4 & App Directory Structure

- Nuxt 4 uses the `app/` directory as the new project root.
- The `app/` directory encapsulates all client-side and UI logic:
  - `app/pages` → route-based pages (auto-routed)
  - `app/layouts` → layout components (`defineLayout()`)
  - `app/components` → reusable UI components
  - `app/composables` → client-side composables (`useXyz`)
  - `app/middleware` → route middleware (can be named, global, or inline)
  - `app/plugins` → Nuxt plugins
  - `app/assets` → static assets (e.g., images, fonts)
  - `app/utils` → helper functions shared across client code
  - `app.config.ts` → runtime config for themes, transitions, etc.
  - `app.vue` → root component (global setup like modals, toasts)
  - `error.vue` → custom error page

- **Server Directory**:
  - `server/api` → API endpoints (`*.get.ts`, `*.post.ts`, etc.)
  - `server/middleware` → server middleware
  - `server/plugins` → server plugins
  - `server/utils` → server utilities

- **Shared Directory**:
  - `shared/schemas` → Zod schemas and validators
  - `shared/types` → TypeScript types shared between client and server
  - `shared/constants` → Shared constants and enums
  - `shared/utils` → Utility functions used in both contexts

- Use `definePageMeta()` and `defineLayout()` inside `.vue` files as needed.
- Prefer colocated logic near its usage whenever possible.

---

## 🧱 Code Style & Architecture

- Use `<script setup lang="ts">` and Composition API exclusively.
- Avoid Options API and class-style code.
- Write modular, DRY, readable code.
- Use composables to extract and share logic.
- Prefer functional and declarative patterns.

---

## ⚙️ Nuxt 4 Specific Practices

- Use auto-imported functions (`useFetch`, `useState`, `useRouter`, etc.).
- Use `useRuntimeConfig()` for public/private env configs.
- Use `useSeoMeta()` and `useHead()` for SEO/meta tags.
- Use `<NuxtImg>` and `<NuxtPicture>` for optimized images.
- Use `app.config.ts` for theming and app-level config.
- Use Nuxt UI components unless custom UI is strictly needed.

---

## 🧠 TypeScript Practices

- **Type Organization**:
  - `app/types` → Client-side type definitions
  - `server/types` → Server-side type definitions
  - `shared/types` → Types shared between client and server

- **Type Definitions**:
  - Use `interface` for public API definitions and object shapes
  - Use `type` for unions, tuples, or complex type operations
  - Avoid `enum`; use const objects with `as const` instead
  - Always type function parameters and return values
  - Use `satisfies` operator for type-safe configurations

- **Type Safety**:
  - Use Zod for runtime validation of external data
  - Enable strict mode in [tsconfig.json](cci:7://file:///Users/enryu/dev/lab/nuxt-auth/tsconfig.json:0:0-0:0)
  - Use TypeScript path aliases for cleaner imports

---

## 🔄 Data Fetching

1. **SSR-Friendly**:
   - `useFetch()` → for reactive, SSR-aware fetching
   - `lazy: true` → for non-critical data
   - `server: false` → to disable SSR if needed
   - Always handle errors with try/catch or `.catch()`

2. **Client-Only**:
   - `$fetch()` → for use inside events, composables, or Pinia actions
   - Use with error boundaries for better UX

3. **Complex Logic**:
   - `useAsyncData()` → when combining multiple sources
   - Use `transform` for data transformation
   - Implement caching strategies when appropriate

4. **Error Handling**:
   - Always implement error boundaries
   - Provide meaningful error messages
   - Log errors to your error tracking service

---

## 🔐 Security Best Practices

1. **Environment Variables**:
   - Use `useRuntimeConfig()` for environment variables
   - Never expose sensitive data to the client
   - Use `NODE_ENV` for environment-specific logic

2. **API Security**:
   - Validate all user input with Zod
   - Sanitize data before rendering
   - Implement rate limiting for public APIs

3. **Authentication**:
   - Use the project's authentication solution (`better-auth`)
   - Implement proper route protection using middleware
   - Follow the project's established auth patterns

4. **Dependencies**:
   - Keep dependencies up to date
   - Audit dependencies regularly
   - Prefer official Nuxt modules when available

---

## 🎨 Styling & UI

- Use **Tailwind CSS** with mobile-first responsiveness
- Use utility classes over `@apply`, except in base or theme files
- Prefer **Nuxt UI** for consistency and DX
- Global styles go in `app/css/` if needed
- Use CSS variables for theming
- Implement dark mode with `useColorMode()`
- Use CSS transitions for simple animations
- Consider the `@vueuse/motion` package if advanced animations are needed
