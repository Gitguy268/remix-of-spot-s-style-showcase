

## Two New Features: Custom Pull-to-Refresh Loader and Minecraft Mode

### Feature 1: Yeezus CD Loader on Pull-to-Refresh

A custom pull-to-refresh experience that shows the "Yeezus Minimal Loader" (spinning CD with red tape and BLSS branding) on a grey background when the user swipes down to reload.

**How it works:**

- A new `PullToRefresh` component wraps the entire app content
- On touch devices: detects downward swipe gestures when scrolled to the top
- On desktop: detects mousedown + drag-down gestures when scrolled to the top
- When the user pulls past a threshold (~80px), the loader appears on a grey overlay at the top of the screen
- Upon release past the threshold, the page reloads after a brief animation showing the spinning CD
- The spinning CD loader is built entirely with CSS (matching the provided HTML/CSS exactly), rendered as a React component

**Files to create:**
- `src/components/YeezusLoader.tsx` -- The spinning CD component (converted from the provided HTML/CSS)
- `src/components/PullToRefresh.tsx` -- Touch/mouse gesture handler that shows the loader and triggers reload

**Files to modify:**
- `src/App.tsx` -- Wrap the app content with the `PullToRefresh` component
- `src/index.css` -- Add the loader-specific CSS (spin animation, disc styling, tape block, branding text)

**Technical approach:**
- Use `touchstart`, `touchmove`, `touchend` events for mobile, and equivalent mouse events for desktop
- Only activate when `window.scrollY === 0` (user is at the top of the page)
- Show a grey (`#888`) full-width bar at the top with the CD loader centered inside
- After release past threshold, show a brief loading state, then call `window.location.reload()`
- The loader CSS variables will be scoped under a `.yeezus-loader` class to avoid conflicts with the site's design system

---

### Feature 2: Minecraft Mode Toggle

A fun toggle switch at the bottom of the website that transforms the entire site into a pixelated, blocky Minecraft aesthetic.

**How it works:**

- A toggle switch is placed in the footer area (above the copyright line)
- When enabled, a `minecraft-mode` class is added to the `<html>` element
- CSS rules under `.minecraft-mode` apply the following transformations:
  - **Pixelated rendering**: `image-rendering: pixelated` on all images
  - **Blocky font**: Swap to a pixel/bitmap font (using the free "Press Start 2P" Google Font or "Silkscreen")
  - **Sharp corners**: Override all `border-radius` to `0px` (no rounded corners)
  - **Stepped borders**: Thicker, solid borders on cards and buttons
  - **Color palette shift**: Earthy, Minecraft-inspired greens and browns applied via CSS variable overrides
  - **Pixelate filter**: A subtle CSS `filter` or SVG filter to give backgrounds a blocky feel
  - **Cursor**: Custom crosshair or pickaxe-style cursor
- State is persisted in `localStorage` so it survives page reloads
- A React context (`MinecraftModeContext`) manages the state globally so any component can check if Minecraft mode is active

**Files to create:**
- `src/contexts/MinecraftModeContext.tsx` -- Context provider with toggle state and localStorage persistence
- `src/components/MinecraftModeToggle.tsx` -- The toggle switch UI placed in the footer, styled with a Minecraft grass block icon and label

**Files to modify:**
- `src/App.tsx` -- Wrap with `MinecraftModeProvider`
- `src/components/Footer.tsx` -- Add the `MinecraftModeToggle` component above the bottom bar
- `src/index.css` -- Add comprehensive `.minecraft-mode` CSS rules that override typography, borders, colors, image rendering, and cursors
- `index.html` -- Add a `<link>` for the "Press Start 2P" Google Font (preconnect already exists)

---

### Technical Details

**Pull-to-Refresh gesture detection logic:**

```text
touchstart -> record startY
touchmove  -> if scrollY === 0 and deltaY > 0:
                show loader overlay
                translate overlay by min(deltaY, maxPull)
touchend   -> if deltaY > threshold:
                trigger reload animation, then window.location.reload()
              else:
                snap overlay back to hidden
```

**Minecraft Mode CSS strategy (scoped under `.minecraft-mode`):**

```text
.minecraft-mode {
  * { border-radius: 0 !important; }
  font-family: "Press Start 2P", monospace;
  img { image-rendering: pixelated; }
  --primary: green tones;
  --background: dirt-brown tones;
  cursor: crosshair;
}
```

**Dependency changes:** None -- both features use only CSS and vanilla React (no new npm packages needed). The "Press Start 2P" font loads from Google Fonts CDN via a `<link>` tag.

