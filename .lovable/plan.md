

## Plan: Create PhotoScanner Component

The previous attempt was interrupted after copying images. Now I need to create `PhotoScanner.tsx` and add it to `Index.tsx` after `VideoSection`.

### What it does
A horizontally auto-scrolling card stream on a black background. A glowing purple scanner line sits at the center. As photo cards scroll through, the scanner reveals ASCII/code text on one side while showing the photo on the other. Includes canvas-based particle effects and a glass reset button.

### Implementation

**1. Create `src/components/PhotoScanner.tsx`**

A single large React component that converts the vanilla JS to imperative DOM/canvas logic inside `useEffect`:

- **Section wrapper**: `<section>` with `py-24`, black background, section header "Spot Scanner" with subtitle
- **SVG filter**: Inline the `glass-distortion` filter with a unique ID (`scanner-glass-distortion`) to avoid conflicts with existing glass filters
- **Scoped CSS**: Inject via `<style>` tag in the component for all the scanner-specific classes (`.ps-card-stream`, `.ps-card-wrapper`, etc.) — prefixed with `ps-` to avoid global conflicts with the site's existing `.container`, `.card`, etc. classes
- **Three layers via refs**:
  - `particleCanvasRef` — background star-field canvas
  - `scannerCanvasRef` — glowing scanner bar + spark particles canvas  
  - `cardLineRef` — DOM-based card stream container
- **Card stream controller**: Imperative class instantiated in `useEffect`, managing auto-scroll, drag/touch interactions, momentum, and scanner clip-path logic. Creates 30 card DOM elements using the 6 Spot images (imported from `src/assets/`)
- **Particle systems**: Two canvas-based systems (background stars + scanner sparks) using `requestAnimationFrame`, with typed arrays for performance
- **Cleanup**: All RAF loops, intervals, and event listeners cleaned up on unmount
- **IntersectionObserver**: Pause all animations when section is off-screen
- **Reset button**: Uses the site's existing liquid glass button style pattern
- **Images**: Import the 6 already-copied images from `src/assets/spot-scanner-{1-6}`

**2. Update `src/pages/Index.tsx`**
- Import `PhotoScanner`
- Place `<PhotoScanner />` after `<VideoSection />` and before `<PhotoStories />`

### Files to create
- `src/components/PhotoScanner.tsx`

### Files to modify
- `src/pages/Index.tsx` (add import + place component)

