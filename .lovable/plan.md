

## Plan: Add Photo Scanner Effect Section

The user wants to add a "Photo Scanner" interactive section below the VideoSection ("Spot in Motion"), using their 6 uploaded photos of Spot the black Labrador. The provided code is a vanilla HTML/CSS/JS implementation that needs to be converted to a React component.

### What it does
A horizontally auto-scrolling card stream with a glowing scanner line in the center. As cards pass through the scanner, one side shows the photo and the other side reveals ASCII/code text. Includes particle effects in the background and a reset button.

### Implementation

**1. Copy uploaded images to `src/assets/`**
- `IMG_4690.jpeg` → `src/assets/spot-scanner-1.jpeg`
- `spotgrillsmacmono.png` → `src/assets/spot-scanner-2.png`
- `IMG_4765.jpeg` → `src/assets/spot-scanner-3.jpeg`
- `IMG_2778.jpeg` → `src/assets/spot-scanner-4.jpeg`
- `IMG_2739.jpeg` → `src/assets/spot-scanner-5.jpeg`
- `IMG_2610.jpeg` → `src/assets/spot-scanner-6.jpeg`

**2. Create `src/components/PhotoScanner.tsx`**
Convert the vanilla JS to a single React component:
- Use `useRef` for the three canvases (particle background, scanner line, card container)
- Use `useEffect` to initialize the card stream controller, particle background, and scanner — all the JS logic from `script.js`
- Import the 6 Spot photos as the card images (replacing the external URLs)
- Embed the CSS as scoped styles (either inline or in a dedicated CSS module / Tailwind classes where possible, with a `<style>` tag for the complex animations like `@keyframes glitch` and `scanEffect`)
- Include the SVG filter inline in the component JSX
- Add the glass reset button using the existing `GlassEffect` component pattern
- Use `AnimatedSection` wrapper for the heading
- Add a section header: "Spot **Scanner**" with subtitle "Drag to explore, watch Spot get decoded."
- Wrap in a `<section>` with the same spacing pattern as other sections (`py-24`)

Key adaptations from vanilla to React:
- Replace `document.getElementById` with refs
- Replace `DOMContentLoaded` with `useEffect`
- Use `requestAnimationFrame` loops with cleanup on unmount
- Use IntersectionObserver to only run animations when visible (performance)
- The card stream class logic stays imperative (DOM manipulation for performance with 30 cards), managed inside useEffect

**3. Update `src/pages/Index.tsx`**
- Import `PhotoScanner`
- Place it after `<VideoSection />` and before `<PhotoStories />`

### Files to create
- `src/components/PhotoScanner.tsx`

### Files to modify
- `src/pages/Index.tsx` (add import + component)

### Assets to copy
- 6 uploaded images → `src/assets/`

