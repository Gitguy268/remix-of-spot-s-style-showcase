# Remix of Spot’s Style Showcase

An interactive product showcase for Spot’s dog-inspired apparel brand, built with Vite, React, TypeScript, Tailwind CSS, and shadcn-ui.  
The app focuses on smooth animations, performant scrolling, and a premium “style lookbook” experience for browsing products, saving favorites, and exploring different styles.

---

## Features

- **Product cards & quick view**  
  Browse products with rich cards, then open a Quick View modal for more details, sizing, and styling info.

- **Wishlist**  
  Add/remove items from a wishlist and see how many favourites you’ve saved. Uses a dedicated Wishlist context and memoized logic to keep the UI snappy.

- **Rating display**  
  Shared `RatingDisplay` component for consistent star ratings and review counts across product cards and quick view.

- **Smart badges**  
  Centralized badge logic (e.g. “New”) so visual variants stay consistent across the app.

- **Scroll-driven UI**  
  - Scroll progress bar  
  - Back‑to‑top button  
  - Floating “Shop” button  
  All powered by shared scroll hooks with throttling and passive listeners for smooth performance.

- **Minecraft mode**  
  A playful “Minecraft mode” toggle that changes the visual style/theme via its own context.

- **Animated particle background**  
  A Three.js‑style particle background (in `ParticleBackground`) optimized to reduce CPU usage by sorting less frequently.

- **Performance‑focused refactor**  
  - ~135 lines of duplicated code removed  
  - Context values and heavy components memoized  
  - Scroll handlers throttled and made passive  
  - Animation constants centralized for easier tuning

---

## Tech Stack

- **Frontend:** React, TypeScript, Vite  
- **Styling:** Tailwind CSS, custom CSS, shadcn-ui  
- **State & Context:** React Context API with memoized providers  
- **Utilities & Hooks:**
  - `useScrollUtils` (scroll progress & visibility)
  - `useLocalStorage` (reusable localStorage state)
  - `badgeUtils` & `animationConfig` for UI consistency  
- **Backend / Data:** Supabase (project scaffolding present in `/supabase`)

---

## Project Structure

Key directories and files:

- `src/`
  - `assets/` — Images and static assets
  - `components/`
    - `ProductCard.tsx` — Main product tile component
    - `ProductQuickView.tsx` — Modal for detailed product view
    - `WishlistButton.tsx` — “Add to wishlist” / toggle button
    - `RatingDisplay.tsx` — Shared rating UI
    - `ScrollProgress.tsx`, `BackToTop.tsx`, `FloatingShopButton.tsx` — Scroll‑based UI elements
    - `ParticleBackground.tsx` — Animated background
  - `contexts/`
    - `CurrencyContext.tsx` — Currency & price formatting
    - `WishlistContext.tsx` — Wishlist state and actions
    - `MinecraftModeContext.tsx` — Minecraft mode toggle
  - `hooks/`
    - `useScrollUtils.ts` — `useScrollProgress` & `useScrollVisibility`
    - `useLocalStorage.ts` — Generic localStorage hook
  - `lib/`
    - `animationConfig.ts` — Durations, easings, and transition presets
  - `types/`
    - `product.ts` — Shared `Product` and `WishlistProduct` types
  - `utils/`
    - `badgeUtils.ts` — `getBadgeVariant` helper for badges
  - `pages/` — Top‑level page components
  - `main.tsx`, `App.tsx` — App entry and root layout

- `supabase/` — Supabase configuration & SQL (if used)
- `SUMMARY.md` — High‑level summary of the refactoring work
- `REFACTORING_REPORT.md` — Detailed technical report of all refactors and optimizations

---

## Getting Started

### 1. Prerequisites

- Node.js and npm installed  
  (Node 18+ recommended)

### 2. Clone the repository

```bash
git clone <YOUR_GIT_URL>
cd remix-of-spot-s-style-showcase
```

### 3. Install dependencies

```bash
npm install
# or
npm i
```

### 4. Run the development server

```bash
npm run dev
```

Then open the URL shown in your terminal (typically `http://localhost:5173`) in your browser.

---

## Available Scripts

In the project directory, you can run:

- `npm run dev`  
  Start the Vite dev server with hot reload.

- `npm run build`  
  Create a production build.

- `npm run preview`  
  Preview the production build locally.

- `npm run lint`  
  Run ESLint over the codebase (if configured in `package.json`).

Exact scripts may vary slightly depending on `package.json`.

---

## Editing the Project

You can work with the project in several ways:

- **Lovable UI**  
  Open the project in Lovable and use AI‑powered prompts to modify the app. Changes are automatically committed back to this repo.

- **Local IDE (VS Code, WebStorm, etc.)**  
  Edit the code locally after cloning. Push commits, and Lovable will pick them up.

- **GitHub web editor / Codespaces**  
  - Edit files directly via the GitHub web editor, or  
  - Open a Codespace for a full cloud dev environment.

---

## Performance & Architecture Notes

This repo includes a dedicated refactor focused on:

- Removing duplicated scroll logic via `useScrollProgress` and `useScrollVisibility`
- Centralising product types in `src/types/product.ts`
- Sharing rating UI with `RatingDisplay`
- Memoising:
  - Currency, wishlist, and Minecraft mode context values
  - Wishlist actions and computed helpers
  - `WishlistButton` via `React.memo`
- Reducing scroll events from ~60/sec to ~7/sec using throttling and passive listeners
- Cutting ParticleBackground sorting frequency by ~90% to reduce CPU usage

For the full breakdown, see:

- `SUMMARY.md` — Executive summary  
- `REFACTORING_REPORT.md` — Detailed before/after code examples and measurements

---

## Future Improvements

Some recommended next steps (also listed in the refactor docs):

- Use `useLocalStorage` inside Currency/Wishlist/Minecraft contexts for persistent state
- Add a `useScrollFadeIn` hook wired to `animationConfig` for reusable scroll animations
- Code‑split heavy visual components (like the particle background and any 3D/Three.js code)
- Optimise large images and use responsive formats (e.g. WebP + `srcset`)

---

## License

Add your chosen license here (e.g., MIT, Apache 2.0).  
If you haven’t decided yet, this section can be updated later.
