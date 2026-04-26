## Plan: Upgrade Liquid Glass Components to kube.io-Style Refraction

The kube.io article demonstrates Apple-quality "Liquid Glass" using **SVG displacement-map filters as `backdrop-filter`** to bend the pixels behind a panel, plus a **specular rim highlight** for a wet-glass edge. Today our `LiquidGlassCard`, `LiquidGlassButton`, and `GlassEffect` rely on plain `backdrop-blur` + radial gradients — they look flat compared to kube.io's refractive look.

This upgrade reworks our three glass primitives to use real SVG-filter refraction, a convex bezel highlight, and a soft inner specular shine, while keeping the existing turquoise tint (`hsl(183 63% 47%)`) and all current props/sizes so nothing else has to change.

### What will look different

- **Edges bend the background** behind the glass (visible warp on text, photos, the 3D background)
- **Bright specular rim** runs along the top-left edge, fading around the shape (signature Apple look)
- **Convex "lip" feel** — center looks slightly magnified, edges refract
- **Turquoise tint stays** — only the lensing/highlights are new
- Subtle hover: rim brightens, refraction strength ticks up, existing tilt preserved

Browsers without SVG-filter `backdrop-filter` (Safari/Firefox) automatically fall back to the current blur + tint look — no broken UI.

### Technical changes

**1. New file: `src/components/ui/liquid-glass-filter.tsx`**
A single mounted-once component holding a hidden `<svg>` with the reusable filters:
- `#lg-displacement` — `feImage` of a procedurally-generated displacement map (radial bezel gradient encoded into R/G channels) + `feDisplacementMap` for refraction
- `#lg-specular` — `feGaussianBlur` + `feSpecularLighting` with a `feDistantLight` from top-left for the rim highlight
- `#lg-glass` — composite of the two above via `feComposite`/`feBlend`

Mounted once in `src/App.tsx` (next to existing providers) so all glass elements can reference the filter IDs.

**2. Rewrite `src/components/ui/liquid-glass-card.tsx`**
- Add a new absolute layer `.lg-refraction` with `backdrop-filter: url(#lg-glass) blur(2px) saturate(140%)` (Chrome) and graceful fallback to today's `backdrop-blur-xl` via `@supports`
- Replace the radial highlight with an SVG-driven specular rim layer
- Keep: turquoise border, mouse-tracked tilt, bottom ambient glow, intensity prop
- Tint stays `hsl(183 63% 47%)` — just lowered to ~12% so refraction reads through

**3. Rewrite `src/components/ui/liquid-glass-button.tsx`**
- Same refraction layer scaled for buttons (smaller blur, higher refraction strength)
- Keep all 4 size variants (`default | sm | lg | xl`), tilt, mouse-glow, drop shadow
- Hover boosts displacement scale via CSS variable for a subtle "press into glass" feel

**4. Update `src/components/ui/liquid-glass.tsx` (`GlassEffect` / `GlassFilter`)**
- Point `GlassEffect` to the new shared `#lg-glass` filter instead of the local `#glass-distortion`
- Keep `GlassFilter` exported for backward compatibility but make it a no-op (filters now live in the shared mount)
- Tint layer stays turquoise (`rgba(44, 187, 195, 0.08)`)

**5. Mount filters once in `src/App.tsx`**
Add `<LiquidGlassFilter />` near the top of the tree so every glass element on every page can `url(#lg-glass)`.

### Files to create
- `src/components/ui/liquid-glass-filter.tsx`

### Files to modify
- `src/components/ui/liquid-glass-card.tsx` — refraction + specular layers
- `src/components/ui/liquid-glass-button.tsx` — refraction + specular layers
- `src/components/ui/liquid-glass.tsx` — use shared filter
- `src/App.tsx` — mount `<LiquidGlassFilter />` once
- `src/index.css` — small `@supports (backdrop-filter: url(#x))` fallback rules

### What does NOT change
- All consumer components (`ProductCard`, `Hero`, `Newsletter`, `FAQ`, `Reviews`, `SpotGameShowcase`, `SpotTeeGenerator`, `Footer`, `GlassDock`, `BirthdayCountdown`, `PhotoScanner`, `ProductQuickView`) — they keep using the same `<LiquidGlassCard>` / `<LiquidGlassButton>` / `<GlassEffect>` props
- Turquoise brand color
- The combined 3D background (it'll actually look better — you'll see it bend through the glass)
- Theme toggle, mobile layout, accessibility