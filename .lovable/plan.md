

# Fix: Search Overlay Navigates Immediately Instead of Letting Users Build Filters

## Problem
When you open the search overlay (from the header pill or search entry), clicking a popular area or budget filter immediately navigates to `/properties?area=...` and closes the overlay. There's no way to combine filters — e.g. pick "Palm Jumeirah" AND "Under 2M" AND "2 BR" before searching.

## Solution
Turn the search overlay into a multi-step filter builder:

1. **Accumulate selections instead of navigating** — clicking a popular area, budget range, or trending tag adds it as a selected chip (highlighted state) rather than closing the overlay and navigating.

2. **Add a bedroom selector row** — a new "Bedrooms" section with chips (Studio, 1 BR, 2 BR, 3 BR, 4+) matching the hero search bar options.

3. **Show selected filters as removable chips** — a horizontal row below the search input showing active selections (e.g. `Palm Jumeirah ×`, `Under 2M ×`, `2 BR ×`).

4. **Add a "Show Results" button** — a prominent CTA at the bottom that navigates to `/properties` with all accumulated query params. Shows the count if possible, or just "Show Results".

5. **Typing still works as before** — the live search results (properties, areas, developers) still navigate on click since those are direct links to specific items.

## Changes

**File: `src/components/properties/SearchOverlay.tsx`**
- Add state for `selectedArea`, `selectedBedrooms`, `selectedPriceRange`
- Popular area buttons toggle selection (highlighted) instead of calling `navigate()`
- Budget buttons toggle selection instead of navigating
- Add a bedrooms chip row
- Add selected filters chip bar with × remove buttons
- Add "Show Results" sticky button at bottom that builds the URL from all selections and navigates
- Direct search results (property/developer links) still navigate immediately on click

