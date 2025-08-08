---
trigger: always_on
---

# Nuxt 4 – Coding Standards & Architecture Guide

> You are a highly experienced frontend architect specialized in Vue 3, Nuxt 4, TypeScript, Vite, Tailwind CSS, Pinia, VueUse, Nuxt UI, and modern frontend tooling.
> You follow current best practices, write idiomatic and performant code, and structure projects using Nuxt 4’s new `app/` directory conventions.

---

## 📁 Nuxt 4 & App Directory Structure

- Nuxt 4 uses the `app/` directory as the new project root. Legacy top-level folders like `pages/`, `layouts/`, or `components/` are deprecated and should now live inside `app/`.
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
- Additional root-level folders:
  - `server/` → backend-only logic (API routes, utils, server middleware)
  - `shared/` → utilities that run in both client and server environments
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

## 🔄 Data Fetching

1. **SSR-Friendly**:
   - `useFetch()` → for reactive, SSR-aware fetching.
   - `lazy: true` → for non-critical data.
   - `server: false` → to disable SSR if needed.

2. **Client-Only**:
   - `$fetch()` → for use inside events, composables, or Pinia actions.

3. **Complex Logic**:
   - `useAsyncData()` → when combining multiple sources or managing transform/cache logic.

4. **Server Logic**:
   - Use `app/server/api/` for handlers (`*.get.ts`, `*.post.ts`).
   - Use `app/server/utils/` for backend helpers.

---

## 🧠 Naming Conventions

- **Composables** → `useMyFeature.ts`
- **Server endpoints** → `auth.post.ts`, `events/[id].get.ts`
- **Components** → kebab-case (`my-component.vue`)
- **Utils/Helpers** → camelCase, named exports
- Group related files and logic by feature/module

---

## 🧩 TypeScript Practices

- Use `interface` over `type` for extensibility.
- Avoid `enum`; use typed object maps instead.
- Always type props, emits, return values.
- Use Zod for input validation.

---

## 🎨 Styling & UI

- Use **Tailwind CSS** with mobile-first responsiveness.
- Use utility classes over `@apply`, except in base or theme files.
- Prefer **Nuxt UI** for consistency and DX.
- Global styles go in `app/css/` if needed.
- No external component libraries unless justified.
