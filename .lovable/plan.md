## Goal

Make the app feel snappier by cutting artificial delays, shortening transition durations, and reducing staggered animation offsets.

## Changes

### 1. Page transition (`src/components/PageTransition.tsx`)
- Drop the 150ms transition timer to 0 (use `requestAnimationFrame`) so route changes don't blank for 150ms.
- Reduce `duration-300` → `duration-150`.

### 2. Animated sections (`src/components/AnimatedSection.tsx`)
- Reduce base transition `duration-700` → `duration-300`.
- This affects every fade/slide section across the site.

### 3. Products grid (`src/components/Products.tsx`)
- Remove the 300ms artificial `setTimeout` skeleton flash on category change (set loading false immediately, or skip skeleton entirely since filtering is synchronous).
- Reduce per-card stagger `delay={index * 100}` → `delay={index * 40}`.

### 4. Cookie consent (`src/components/CookieConsent.tsx`)
- Lower the 1500ms appearance delay to 600ms.

### 5. Other staggered delays
- `Celebs.tsx` `delay={index * 150}` → `delay={index * 50}`.
- `Reviews.tsx` `delay={index * 100}` → `delay={index * 40}`.
- About/PhotoStories/FAQ/VideoSection/Spot3DViewer big `delay={200|400}` values → `delay={80}` max.

### 6. Suspense fallback (`src/App.tsx`)
- Keep blank fallback (already minimal). No change needed.

### 7. Lazy image (`src/components/ui/lazy-image.tsx`)
- Reduce `transition-opacity duration-500` → `duration-200` for both placeholder fade and image fade-in so images appear faster once loaded.
- Increase IntersectionObserver `rootMargin` from `100px` → `300px` so images start loading sooner before scrolling into view.

### 8. Skip unnecessary spinners
- `Products.tsx`: filtering is synchronous — remove `isLoading` state entirely and render filtered list directly (no skeleton flash on tab switch).

## Out of scope

- Keep `BirthdayCelebration` and `useBirthdayMusic` timings (intentional UX).
- Keep toast/sheet/dialog animation defaults (shadcn).
- No changes to actual network loading (Printify mockups, Supabase calls) — only perceived UI loading.

## Files touched

- `src/components/PageTransition.tsx`
- `src/components/AnimatedSection.tsx`
- `src/components/Products.tsx`
- `src/components/CookieConsent.tsx`
- `src/components/Celebs.tsx`
- `src/components/Reviews.tsx`
- `src/components/PhotoStories.tsx`
- `src/components/VideoSection.tsx`
- `src/components/Spot3DViewer.tsx`
- `src/components/FAQ.tsx`
- `src/pages/About.tsx`
- `src/components/ui/lazy-image.tsx`
