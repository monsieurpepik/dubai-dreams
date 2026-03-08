

# Airbnb + LuxuryProperty.com + JamesEdition Meets Hermes -- The Final Layer

## The Gap Analysis

The site now has Hermes-level restraint (good). But comparing it to Airbnb, LuxuryProperty.com, and JamesEdition reveals specific functional and experiential gaps.

### What Airbnb Does That This Site Does Not
- **Image carousel on property cards** -- hover or swipe to preview multiple photos without clicking through. This is the single highest-impact UX pattern in property browsing. Currently cards show one static image.
- **Wishlist/Save with visual feedback** -- a heart icon on the card image with an animation on click. Currently save functionality exists but is not on the card.
- **Instant category filtering** -- the horizontal scrolling category bar with icons on the listing page works, but the homepage has no visual category browsing. The QuickCategories are text-only links at the bottom -- invisible.
- **Map + list split view** -- the Properties page has grid/map toggle. Airbnb shows them side by side. A split view where hovering a card highlights on the map is the gold standard.

### What LuxuryProperty.com Does That This Site Does Not
- **Property card multi-image preview** -- LuxuryProperty shows image count and allows browsing on the card level
- **"Exclusive" and "Featured" labels** -- visual hierarchy to distinguish premium listings from standard
- **Developer page** -- clicking a developer name leads to a dedicated page showing their portfolio, track record, and active projects. Currently developer names are just text.
- **Area guide links from cards** -- the area name on a card is clickable, leading to an area guide

### What JamesEdition Does That This Site Does Not
- **Lifestyle-first imagery** -- JamesEdition property cards feel like editorial photography. The image aspect ratio is taller (closer to 4:5 or 1:1) rather than the standard 3:2 landscape, making each card feel more like a magazine spread.
- **Price as a statement** -- JamesEdition shows price in a larger, more confident type treatment. Currently the price is `text-sm text-foreground/80` -- too shy for a luxury platform.
- **"Request Info" on every card** -- a subtle CTA on hover, not requiring users to navigate to the detail page to take action
- **Curated editorial sections** -- "Most viewed this week", "Recently added", "Price reduced" -- dynamic content sections that make the platform feel alive

---

## Changes to Implement

### 1. Property Card -- Multi-Image Hover Carousel (Airbnb Pattern)
The single biggest upgrade. Replace the static single image with the existing `ImageHoverCarousel` component that is already built but not used on CleanPropertyCard. On desktop, moving the mouse across the image reveals different photos. On mobile, dot indicators allow swiping.

Also add a subtle save/heart icon in the top-right corner of the image (Airbnb style).

**File:** `src/components/properties/CleanPropertyCard.tsx`
- Replace the static `<img>` with the `ImageHoverCarousel` component, passing all `property_images`
- Add a heart/save button overlaid on the image top-right
- Make the area name a clickable link to `/areas/{area-slug}`

### 2. Property Card -- Price as a Statement (JamesEdition)
The price is currently `text-sm text-foreground/80`. On a luxury platform, price is confidence. Make it larger, serif, and full opacity.

**File:** `src/components/properties/CleanPropertyCard.tsx`
- Change price to `font-serif text-lg text-foreground` instead of `text-sm text-foreground/80`
- This single change makes the card feel JamesEdition-level

### 3. Property Card -- Hover CTA (JamesEdition)
Add a "View Project" text that appears on hover below the card content. Subtle, not a button -- just text that fades in. This signals interactivity without adding visual noise.

**File:** `src/components/properties/CleanPropertyCard.tsx`
- Add a `group-hover:opacity-100 opacity-0` text line at the bottom of the card content

### 4. Homepage -- Promote QuickCategories to a Visual Section
Currently QuickCategories are near-invisible text links at the bottom. Move them up to sit directly below the SearchEntry, styled as Airbnb-like pills with subtle borders (not icons -- that would break the Hermes feel). Make them horizontally scrollable on mobile.

**File:** `src/pages/Index.tsx` -- reorder sections: Hero -> Search -> Categories -> Editorial -> Properties -> Footer
**File:** `src/components/sections/QuickCategories.tsx` -- restyle as horizontal pill bar with border styling and scrollable overflow

### 5. Homepage -- Add "Recently Added" Dynamic Section
Below the main "Selected works" grid, add a smaller horizontal scroll section titled "Recently added" showing the 4 newest properties in a horizontal scroll. This makes the homepage feel alive (Airbnb "trending" pattern) without breaking the Hermes restraint because it is a single row, not a grid.

**File:** `src/pages/Index.tsx` -- add new section
**File:** `src/components/sections/RecentlyAddedSection.tsx` -- **New** -- horizontal scroll of 4 latest properties using a compact card variant

### 6. Property Grid -- Asymmetric Editorial Layout (JamesEdition)
The current 3-column equal grid is functional but generic. For the homepage "Selected works" section, make the first 2 cards larger (spanning 2 columns on desktop) and the remaining 4 standard size. This creates visual hierarchy and the editorial magazine feel that JamesEdition and LuxuryProperty use.

**File:** `src/components/sections/OffPlanProjectsSection.tsx` -- replace CleanPropertyGrid with a custom asymmetric layout
- First row: 2 large cards (each taking 50% width, taller aspect ratio)
- Second row: 4 standard cards in a 4-column grid
- This creates a "featured + browse" hierarchy

### 7. Listing Page -- Split Map View (Airbnb)
Replace the grid/map toggle with a side-by-side split view option. Left side: property list (scrollable). Right side: map (sticky). Hovering a card highlights its pin on the map.

**File:** `src/pages/Properties.tsx`
- Add a third view mode: `split`
- When split is active, render a `grid grid-cols-2` with the left side scrollable and the right side sticky with the map
- The existing PropertyMap component can be reused

### 8. Developer Name as Link (LuxuryProperty)
On property cards and detail pages, the developer name should link to `/properties?developer={slug}` to filter by that developer. Currently it is plain text.

**File:** `src/components/properties/CleanPropertyCard.tsx` -- wrap developer name in a Link (with `e.stopPropagation()` to prevent card navigation)
**File:** `src/pages/PropertyDetail.tsx` -- wrap developer name in a Link

### 9. Area Name as Link on Cards
Same pattern as developer -- make the area name on property cards clickable, linking to the area guide page.

**File:** `src/components/properties/CleanPropertyCard.tsx` -- wrap area in a Link to `/areas/{area-slug}`

### 10. Property Detail -- Full-Width Hero Image (LuxuryProperty/JamesEdition)
The current bento grid gallery on the detail page is good. But LuxuryProperty and JamesEdition both start with a single full-bleed cinematic image before showing the gallery grid. Add a hero-height primary image at the top, with the bento grid accessible via "View all photos."

**File:** `src/pages/PropertyDetail.tsx`
- Before the ImmersiveGallery bento grid, show the primary image full-width at `h-[60vh]` with a gradient overlay and the property name overlaid at the bottom-left
- The "View all photos" button transitions to the existing lightbox/grid view

### 11. Footer -- Add "Explore" Section (LuxuryProperty SEO Pattern)
LuxuryProperty's footer has "Popular Searches" that improve SEO. Add a row of dynamic links: "Studios under AED 1M", "3BR in Dubai Marina", "Golden Visa Properties" -- these link to pre-filtered search results.

**File:** `src/components/layout/Footer.tsx`
- Add a "Popular Searches" row between the area links and the brand line
- Each link maps to a `/properties?collection=X` or `/properties?area=X&bedrooms=Y` URL

### 12. Custom Cursor -- Add "View" Text on Property Card Hover
JamesEdition-level touch: when hovering a property card image, the custom cursor expands to show a small "View" text inside the circle. This is a subtle but high-craft detail.

**File:** `src/components/ui/CustomCursor.tsx`
- Track whether the user is hovering a `[data-cursor="view"]` element
- When true, expand cursor to 48px and show "View" text inside
- Add `data-cursor="view"` attribute to property card image containers

---

## Technical Summary

| Change | File(s) | Inspiration | Effort |
|--------|---------|-------------|--------|
| Multi-image hover carousel on cards | CleanPropertyCard.tsx | Airbnb | Medium |
| Price as serif statement | CleanPropertyCard.tsx | JamesEdition | Trivial |
| Hover CTA text on cards | CleanPropertyCard.tsx | JamesEdition | Trivial |
| QuickCategories as pill bar | Index.tsx, QuickCategories.tsx | Airbnb | Low |
| "Recently Added" horizontal scroll | Index.tsx, new RecentlyAddedSection.tsx | Airbnb | Medium |
| Asymmetric editorial grid | OffPlanProjectsSection.tsx | JamesEdition | Medium |
| Split map view on listings | Properties.tsx | Airbnb | Medium |
| Developer name as link | CleanPropertyCard.tsx, PropertyDetail.tsx | LuxuryProperty | Trivial |
| Area name as link on cards | CleanPropertyCard.tsx | LuxuryProperty | Trivial |
| Full-width hero on detail page | PropertyDetail.tsx | LuxuryProperty/JamesEdition | Low |
| Popular Searches in footer | Footer.tsx | LuxuryProperty | Low |
| Cursor "View" text on card hover | CustomCursor.tsx, CleanPropertyCard.tsx | JamesEdition | Low |

**Total:** 8 files modified, 1 new file. No new dependencies. All changes use existing framer-motion, react-router-dom, and component library.

