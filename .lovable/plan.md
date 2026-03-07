

# Airbnb-Inspired Search and Navigation Upgrades

Looking at Airbnb's current design, there are three key patterns we're missing that would significantly improve search access and discoverability:

## 1. Persistent Search Bar in Header (Airbnb's "Where / When / Who" bar)

Airbnb's most iconic pattern: a **compact search pill in the header** that's always visible and expands on click. Currently our search is buried behind "Menu > Search" or a homepage-only `SearchEntry` section.

**Implementation:**
- Add a compact **search pill** to the `Header` component (visible when scrolled or on non-homepage pages): a rounded container showing "Area · Bedrooms · Budget" as placeholder segments
- Clicking it opens the existing `SearchOverlay`, but enhanced with **segmented search** (tabs for Area, Bedrooms, Price range) below the text input
- On mobile: a single search icon in the header that opens the overlay

**Files:** `Header.tsx`, `SearchOverlay.tsx`

## 2. Enhanced Search Overlay with Quick Suggestions and Recent Searches

Airbnb shows **trending destinations** and **recent searches** before you type anything. Our overlay currently shows "Start typing to search" which is a dead state.

**Implementation:**
- **Before typing** (empty state): Show "Popular Areas" as clickable cards (Palm Jumeirah, Business Bay, Dubai Marina, etc.) with small thumbnail images, plus "Trending Searches" as pill links
- **Recent searches**: Store last 5 searches in `localStorage`, display them with a clock icon when overlay opens
- **Flexible matching**: Add price-range quick filters as horizontal pills ("Under 2M", "2-5M", "5-10M", "10M+") that link directly to `/properties?collection=...`

**Files:** `SearchOverlay.tsx`

## 3. Airbnb-Style Icon Category Bar on Homepage

Airbnb's homepage has a horizontally scrollable **icon + label category bar** right below the header. We have `QuickCategories` (plain text pills) and `CategoryBar` (on Properties page only). The homepage deserves a more visual version.

**Implementation:**
- Replace the plain `QuickCategories` section on the homepage with a new **visual icon category bar** similar to Airbnb's: each category gets a small icon stacked above its label, with an underline on active/hover
- Categories: Waterfront, Golden Visa, High Yield, Penthouse, Townhouse, Villa, Studio, New Launch, Handover 2025
- Clicking navigates to `/properties?collection=xxx`
- Horizontally scrollable with subtle left/right fade masks

**Files:** `QuickCategories.tsx`

---

### Summary of Changes

| File | Change |
|------|--------|
| `Header.tsx` | Add compact search pill visible on scroll |
| `SearchOverlay.tsx` | Add popular areas, recent searches, price quick-filters in empty state |
| `QuickCategories.tsx` | Redesign as Airbnb-style stacked icon+label bar with underline |

