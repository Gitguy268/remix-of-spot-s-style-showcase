

## Plan: PWA Support, Multi-language, and Theme-aware Product Images

### 1. PWA Support — Make site installable with offline caching

**Install** `vite-plugin-pwa` package.

**Create** `public/manifest.json` with app name "Blacklabspotsshop", theme color `#2cbbc3`, icons (reuse existing favicon URL as a starting point, plus generate 192x192 and 512x512 placeholder icons).

**Update** `vite.config.ts` to add VitePWA plugin with:
- `registerType: 'autoUpdate'`
- Workbox runtime caching for images and fonts
- `navigateFallbackDenylist: [/^\/~oauth/]`
- Manifest configuration inline

**Update** `index.html` with PWA meta tags (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, manifest link).

**Create** `src/components/PWAInstallPrompt.tsx` — a dismissible banner/button that appears on mobile when the `beforeinstallprompt` event fires, prompting users to install. Add it to `App.tsx`.

---

### 2. Multi-language Support — Translate UI strings

The language switcher already exists in `CurrencyContext.tsx` with 6 languages (EN, ES, FR, DE, JA, ZH), but it only saves a preference — no actual translations happen.

**Create** `src/i18n/translations.ts` — a translations dictionary keyed by language code, covering all major UI strings (nav labels, hero heading/subheading, product section titles, FAQ questions, footer text, button labels like "Shop Now", "Quick View", "View All Products", etc.).

**Create** `src/hooks/useTranslation.ts` — a hook that reads the current `language` from `useCurrency()` and returns a `t(key)` function that looks up the translation.

**Update key components** to use `t()` instead of hardcoded English strings:
- `Navbar.tsx` — nav link labels, "Shop Now" button
- `Hero.tsx` — heading, subheading, trust badges
- `Products.tsx` — section title, category labels, CTA button
- `FAQ.tsx` — questions and answers
- `Footer.tsx` — footer text and links
- `Newsletter.tsx` — heading and placeholder text
- `Reviews.tsx` — section title

---

### 3. Dark/Light Mode-aware Product Images

**Approach**: Add a CSS class-based background treatment to product cards so the product image container adapts to the theme.

**Update** `src/components/ProductCard.tsx`:
- Change the image container background from `bg-muted/5` to a theme-aware class: light mode gets a bright white/light gray background, dark mode gets a dark charcoal background.

**Add CSS** in `src/index.css`:
- `.product-image-bg` class with light/dark variants that provide a subtle gradient or solid background matching the theme, so product photos look natural in both modes.

**Update** `src/components/ProductQuickView.tsx` similarly for the quick view modal image area.

---

### Files to create
- `public/manifest.json`
- `src/i18n/translations.ts`
- `src/hooks/useTranslation.ts`
- `src/components/PWAInstallPrompt.tsx`

### Files to modify
- `vite.config.ts` (add PWA plugin)
- `index.html` (PWA meta tags)
- `src/App.tsx` (add PWAInstallPrompt)
- `src/components/Navbar.tsx` (translations)
- `src/components/Hero.tsx` (translations)
- `src/components/Products.tsx` (translations)
- `src/components/ProductCard.tsx` (theme-aware image bg)
- `src/components/FAQ.tsx` (translations)
- `src/components/Footer.tsx` (translations)
- `src/components/Newsletter.tsx` (translations)
- `src/components/Reviews.tsx` (translations)
- `src/index.css` (product image bg classes)

### Package to install
- `vite-plugin-pwa`

