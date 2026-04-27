## Plan: Sync site product imagery with the live Printify shop

The Printify shop (`blacklabspotsshop.printify.me`) now lists 32 products with new names, mockup images, and prices. The site still references a small set of hardcoded local PNGs (`spot-tee-product.png`, `spot-hoodie.png`, `spot-cap.png`, `spot-necklace.png`, `spot-cozy.png`, `spot-festive.png`, `spot-sweater.png`). This plan refreshes those product images — and the catalog around them — using the official Printify mockups so the website stays in sync with what's actually for sale.

### What changes (visible to users)

- **Spot Collection grid** (`Products.tsx`) — Replaced with a curated set of 8 real products pulled directly from the Printify catalog. Each card uses the official Printify mockup image, real product name, real price, and a direct link to that product's page on the Printify shop. Categories (T-Shirts, Hoodies, Accessories, Kids, Home) match the new lineup.
- **Spot in Motion section** (`VideoSection.tsx`) — Hero product image and video poster updated from `spot-tee-product.png` to the new Printify "Spot TEE" front mockup.
- **Meet Spot in 3D** (`Spot3DViewer.tsx`) — Showcase image and lightbox preview updated to the new Printify Spot TEE mockup.
- **Spot's Photo Book** (`PhotoStories.tsx`) — The three lifestyle stills currently shown (`spotCozy`, `spotFestive`, `spotSweater`) are swapped to matching Printify lifestyle/product mockups (warm spot, festive sweater equivalent, cozy hoodie) so the imagery is consistent with the merch you can actually buy.
- **About page** product photos updated to match the new Spot TEE and warm-spot mockups.

### Featured products that will populate the new grid

Pulled from the live Printify shop, with image URL, name, price, and shop URL preserved as-is:

1. Spot TEE — $41.47 — T-Shirts
2. Minimal Black Labrador Embroidered Hoodie — $40.60 — Hoodies
3. Spot Polo — $37.90 — T-Shirts
4. Dad Hat Embroidered Black Lab Dog Portrait — $36.43 — Accessories
5. Personalised Spot Necklace — $28.37 — Accessories
6. Spot Funny Kids T-Shirt — $14.98 — Kids
7. warm spot :) (sweater) — $29.24 — Hoodies
8. Spot Pillow — $16.10 — Home

(All other Printify products remain reachable via the existing "View All" CTA that already points at the Printify storefront root.)

### Technical changes

- **`src/components/Products.tsx`**: Replace the local PNG imports (`spotTeeProduct`, `spotHoodie`, `spotCap`, `spotNecklace`) and the hardcoded `products` array with the 8 entries above. Each entry uses the absolute Printify mockup URL (e.g. `https://images-api.printify.com/mockup/.../spot-tee.jpg?...&s=1024`) directly as `image`, the real `shopUrl`, and price strings exactly as displayed on Printify. Keep the existing `Product` interface, category tabs, filter logic, quick-view, comparison, and mobile carousel untouched.
- **`src/components/VideoSection.tsx`**: Remove the `spot-tee-product.png` import; reference the new Spot TEE Printify mockup URL via a top-level `const SPOT_TEE_IMAGE = "https://images-api.printify.com/mockup/.../spot-tee.jpg?...&s=1024";` and use it for both the `<img>` and the `<video poster>`.
- **`src/components/Spot3DViewer.tsx`**: Same swap — remove the local PNG import, point the showcase `<img>` and lightbox `<img>` at the new Printify mockup URL.
- **`src/components/PhotoStories.tsx`**: Replace the 3 local PNG imports with 3 Printify lifestyle mockup URLs (warm spot, hoodie, polo). Keep captions but tighten alt text to reflect the actual product.
- **`src/pages/About.tsx`**: Replace `spotTeeModel` and `spotCozy` imports with the same Printify URLs used elsewhere so imagery stays consistent.
- **No changes** to `PhotoScanner.tsx`, `SpotBook.tsx` (those already use curated lifestyle photos), `SpotGameShowcase.tsx`, `Celebs.tsx`, or any other section.

### Loading & performance notes

- Printify mockup URLs serve responsive sizes (`?s=1024`); we'll keep `?s=1024` for hero shots and `?s=512` for grid thumbnails to keep page weight reasonable.
- All `<img>` tags retain `loading="lazy"` (or already do via `ProductCard`).
- No new dependencies, no build/config changes.

### Files to modify

- `src/components/Products.tsx`
- `src/components/VideoSection.tsx`
- `src/components/Spot3DViewer.tsx`
- `src/components/PhotoStories.tsx`
- `src/pages/About.tsx`

### Files NOT touched

- Local PNG assets in `src/assets/` are left in place (not deleted) as a fallback; nothing will reference them after the swap.
