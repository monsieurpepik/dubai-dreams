

# Property Finder + LuxuryProperty.com Executive Fix

Restore functional real estate UX while preserving the Hermes aesthetic. The brand stays — but the platform needs to actually help people find and evaluate property.

---

## Changes

### 1. Homepage: Add a Minimal Search Entry Point
The hero stays as-is (the "Possess" moment is a brand signature), but immediately below it — before the editorial statement — add a single-line search bar. Think Apple's search: a thin, centered input with ghost text "Search by area, developer, or project name..." that opens the existing SearchOverlay on focus.

This gives Property Finder's "instant search" without breaking the Hermes aesthetic.

**File:** `src/pages/Index.tsx` — add SearchEntry component between HeroSection and EditorialStatement

**File:** `src/components/properties/SearchEntry.tsx` — new minimal component: a styled input that triggers the existing SearchOverlay

### 2. Editorial Statement: Shrink from Full Viewport to Interstitial
Currently py-32 md:py-44 lg:py-56 — an entire screen for one sentence. Reduce to py-16 md:py-24. The statement stays, but it becomes a breath between sections, not a destination.

**File:** `src/components/sections/EditorialStatement.tsx` — reduce vertical padding

### 3. Property Cards: Show Price + Developer + Bedrooms (Always Visible)
The "price on hover only" pattern breaks real estate UX. Restore:
- Developer name (small, above property name)
- Price (always visible, not hover-only)
- Bedrooms + Completion date (small, muted, below area)
- Keep the clean Hermes aesthetic — no badges, no icons, just typography hierarchy

The card stays minimal but informative. Think LuxuryProperty.com's card layout: image, then a clean text stack of developer / name / location / price / specs.

**File:** `src/components/properties/CleanPropertyCard.tsx`

### 4. Homepage: Show 6 Properties Instead of 3
3 is too few — it doesn't give enough variety for a user to understand your inventory. 6 in a 3x2 grid (or 2 large + 4 small) provides proper browsing. Add a property count: "6 of 24 projects" with a "View all" link.

**File:** `src/components/sections/OffPlanProjectsSection.tsx` — change slice from 3 to 6, add count

### 5. Homepage: Add Quick Category Pills Below Properties
After the 6 property cards, add a row of text links for quick filtering: "Golden Visa | Waterfront | Handover 2025 | High Yield | Studios | 3BR+" — each links to /properties?collection=X. This gives Property Finder's categorical browsing without adding visual clutter.

**File:** `src/pages/Index.tsx` — add CategoryLinks section
**File:** `src/components/sections/QuickCategories.tsx` — new component: horizontal row of minimal text links

### 6. Footer: Add SEO-Friendly Area + Developer Links
The single-line footer kills SEO. Add two rows above the copyright line:
- Row 1: Popular areas as text links (Dubai Marina, Palm Jumeirah, Downtown, etc.)
- Row 2: Featured developers as text links
Keep the Hermes aesthetic — no grid columns, just flowing inline text separated by dots.

**File:** `src/components/layout/Footer.tsx`

### 7. Property Cards: Add Subtle "New" Indicator
Not a badge or icon — just the word "New" in small muted text next to the developer name for properties added in the last 14 days. LuxuryProperty.com marks new listings; Property Finder marks them. This is table stakes.

**File:** `src/components/properties/CleanPropertyCard.tsx` — add date check + "New" text

---

## What Does NOT Change
- Hero section ("Possess" + Ken Burns image)
- Header (centered brand + Menu)
- Custom cursor
- Page transitions
- Grain texture overlay
- Color palette (grayscale with restraint)
- Property detail page (already strong)
- Contact page conversational form

---

## Technical Summary

| Change | File | Effort |
|--------|------|--------|
| Search entry point | Index.tsx + new SearchEntry.tsx | Low |
| Editorial statement spacing | EditorialStatement.tsx | Trivial |
| Property card info restore | CleanPropertyCard.tsx | Low |
| 6 properties on homepage | OffPlanProjectsSection.tsx | Trivial |
| Quick category pills | Index.tsx + new QuickCategories.tsx | Low |
| SEO footer links | Footer.tsx | Low |
| "New" indicator on cards | CleanPropertyCard.tsx | Trivial |

7 changes. 2 new components. 5 modified files. No new dependencies. Preserves the Hermes brand layer while restoring the functional real estate UX that Property Finder and LuxuryProperty.com expect.
