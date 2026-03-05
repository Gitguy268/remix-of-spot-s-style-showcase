

## Four Enhancements: Axolotl Pet, Product Links, Minecraft Mode, and Yeezy Grill Easter Egg

---

### 1. Interactive Axolotl Pet on Terms & Conditions Page

A reactive, animated axolotl SVG pet that follows the user's mouse cursor and bounces with floating hearts when clicked. It will be placed in the bottom-right corner of the Terms page, overlaying the content as a floating element.

**How it works:**
- The full SVG axolotl (head, body, gills, eyes) is rendered as a React component
- The head and pupils track the mouse position using `mousemove` events with smooth lerp-based animation via `requestAnimationFrame`
- Clicking the axolotl triggers a CSS bounce animation and spawns floating heart elements that fade upward
- The background is transparent (no white rectangle) -- the axolotl sits naturally on the page's themed background
- Positioned as a fixed/sticky element in the bottom-right so it doesn't interfere with reading the terms

**Files to create:**
- `src/components/AxolotlPet.tsx` -- React component converting the provided HTML/CSS/SVG/JS into a self-contained React component with `useRef`, `useEffect`, and `useState`

**Files to modify:**
- `src/pages/Terms.tsx` -- Add the `AxolotlPet` component at the bottom of the page
- `src/index.css` -- Add the axolotl-specific CSS (bounce animation, floating hearts keyframes)

---

### 2. Product-Specific Links to Printify Store

Currently, every product card and the Quick View modal link to the generic store homepage (`https://blacklabspotsshop.printify.me/`). Each product should link to its own specific page on the Printify store.

**How it works:**
- Add a `shopUrl` field to each product definition in `Products.tsx`
- Each product gets a unique URL pointing to its Printify product page (using Printify's slug-based URL format: `https://blacklabspotsshop.printify.me/product/SLUG`)
- The `shopUrl` is passed through to `ProductCard` and `ProductQuickView` so all "Shop Now" and card-click actions navigate to the correct product
- Since exact Printify slugs may need adjustment, each URL is configured per-product and easy to update

**Files to modify:**
- `src/components/Products.tsx` -- Add `shopUrl` field to the `Product` interface and each product object
- `src/components/ProductCard.tsx` -- Accept `shopUrl` prop and use it instead of the generic `SHOP_URL` constant
- `src/components/ProductQuickView.tsx` -- Accept `shopUrl` prop and use it in the "Shop Now" CTA link

---

### 3. Enhanced Minecraft Mode

The current Minecraft mode applies pixel fonts, removes border-radius, and shifts colors. This enhancement makes it feel significantly more Minecraft-like.

**Additions:**
- **Dirt block background texture**: A CSS-generated repeating pattern that mimics the iconic Minecraft dirt texture using layered gradients
- **Block-breaking cursor**: A custom pickaxe-style cursor (via CSS `cursor: url(...)` or `crosshair` refinement)
- **Hotbar-style footer**: The payment method badges in the footer are styled to look like Minecraft inventory slots (dark grey squares with lighter borders, like the hotbar UI)
- **Health/hunger bar decorations**: Subtle pixel-art heart and drumstick icons in the footer area using CSS pseudo-elements
- **Creeper face favicon/icon hint**: A tiny creeper face rendered via CSS box-shadow pixel art near the Minecraft toggle
- **Tooltip styling**: Minecraft-style dark purple/grey tooltips with pixelated borders
- **Thicker, stepped borders**: 3px solid borders with hard pixel shadows on more elements
- **Button hover effect**: Buttons lighten in color on hover (like Minecraft menu buttons) instead of scaling

**Files to modify:**
- `src/index.css` -- Expand the `.minecraft-mode` CSS section with new rules for dirt background, hotbar slots, tooltip overrides, and enhanced button/card styling
- `src/components/MinecraftModeToggle.tsx` -- Add a small creeper face pixel art next to the toggle, and a fun "Survival Mode" or "Creative Mode" label variation

---

### 4. Yeezy Grill Paper Cutout Easter Egg on Contact Page

An interactive, slightly tilted image of the Yeezy grill paper cutout placed in the bottom-right corner of the Contact page.

**How it works:**
- The uploaded PNG (`yzygrillpaper1.png`) is copied into `src/assets/`
- A new `YeezyGrillEasterEgg` component renders the image with:
  - Fixed positioning in the bottom-right corner
  - A slight CSS tilt (`rotate(8deg)`) for a "paper cutout" feel
  - Interactive hover effects: the image scales up slightly, removes tilt (flattens), and applies a subtle glow/shadow
  - Click interaction: triggers a fun wobble animation and maybe a brief sparkle effect
  - Drag-to-reposition: users can drag the cutout around the page for a playful feel
  - The image uses `mix-blend-mode: multiply` to remove the white background from the PNG, making it blend naturally

**Files to create:**
- `src/components/YeezyGrillEasterEgg.tsx` -- Interactive component with tilt, hover, click, and optional drag behavior

**Files to modify:**
- `src/pages/Contact.tsx` -- Import and render the `YeezyGrillEasterEgg` component inside the page layout
- Copy `user-uploads://yzygrillpaper1.png` to `src/assets/yeezy-grill.png`

---

### Technical Details

**Axolotl mouse tracking (React conversion):**

```text
useEffect:
  - addEventListener('mousemove') on document
  - Calculate dx/dy from component center
  - Lerp currentX/Y toward targetX/Y in rAF loop
  - Apply transform to head SVG group via ref
  - Move pupil cx/cy attributes for "looking" effect

onClick:
  - Add 'joy-bounce' class to head group
  - Spawn heart div elements that animate upward and self-remove
```

**Product URL strategy:**

```text
Product Interface:
  + shopUrl: string  (new field)

Each product definition includes:
  shopUrl: "https://blacklabspotsshop.printify.me/product/spot-tee"
  (URL format follows Printify slug convention -- easy to update if slugs differ)
```

**Minecraft Mode CSS additions:**

```text
.minecraft-mode body {
  background-image: repeating dirt-block pattern (CSS gradients);
}

.minecraft-mode [class*="payment"] {
  Minecraft hotbar slot styling (dark bg, inset borders)
}

.minecraft-mode [data-radix-tooltip] {
  Dark purple tooltip with pixel border
}
```

**Yeezy Grill interaction:**

```text
- Position: fixed, bottom: 2rem, right: 2rem
- Transform: rotate(8deg)
- Hover: scale(1.1) rotate(0deg)
- Click: wobble keyframe animation
- mix-blend-mode: multiply (removes white background)
- Optional: draggable via mousedown/mousemove/mouseup
```

**No new npm dependencies** are needed. All features use CSS animations, vanilla React state/refs, and SVG.

