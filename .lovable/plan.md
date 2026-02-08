

# The 10/10 Roadmap -- From Great to Unmatchable

After a thorough audit, the site is currently strong on **brand, storytelling, and visual design** but weak on **search, data depth, property detail richness, and retention mechanics**. Here is exactly what separates a 7.5 from a 10.

---

## 1. Global Search with Instant Results (Header)

**The gap:** Property Finder and Bayut both have a search bar front-and-center. Currently there is zero way to search -- users must browse or filter. This is the single biggest missing feature.

**What we build:**
- Add a search input to `Header.tsx` (magnifying glass icon that expands on click)
- Searches across property names, areas, developers, and communities
- Shows instant dropdown results grouped by category (Properties, Areas, Developers)
- Keyboard-navigable (arrow keys + Enter)
- On mobile, tapping search opens a full-screen search overlay

**Files:** `Header.tsx` (modify), new `SearchOverlay.tsx` component

---

## 2. "Similar Properties" on Property Detail

**The gap:** When a user finishes reading a property page, there is nothing else to do except go back. Bayut and Property Finder always show "You might also like" at the bottom.

**What we build:**
- Query properties in the same area OR same price range (+/- 30%)
- Show a horizontal scroll of 4-6 `CleanPropertyCard` components below the inquiry form
- Exclude the current property from results

**Files:** `PropertyDetail.tsx` (add section at bottom)

---

## 3. Price Per Sqft + Neighborhood Context on Detail Page

**The gap:** Serious investors always compare price per square foot. The detail page currently shows starting price but no price/sqft, no area average comparison, and no neighborhood walkability or amenity data.

**What we build:**
- If property has `price_from` and size data, show price per sqft
- Show area market context inline: "Average in [Area]: AED X/sqft" (already have `area_market_data` table)
- Add a "Neighborhood" section with proximity to key landmarks (schools, metro, beach) -- hardcoded data per area initially
- Simple visual bar comparing this property's price/sqft to the area average

**Files:** `PropertyDetail.tsx` (add section), new `NeighborhoodContext.tsx`

---

## 4. Social Proof on Property Cards + Detail

**The gap:** No sense of demand or activity. Bayut shows "Popular" badges. Property Finder shows view counts. We have a `property_views` table but don't surface it anywhere.

**What we build:**
- Query `property_views` count per property
- On cards: show "X people viewed this week" if views > 5, as a subtle text line
- On detail page: show "Viewed X times this month" near the top
- Add a "Trending" badge to properties with above-average views

**Files:** `CleanPropertyCard.tsx`, `PropertyDetail.tsx`, new query hook `usePropertyPopularity.ts`

---

## 5. Floor Plans + Documents Section on Detail

**The gap:** The properties table already has `brochure_url` and components exist (`FloorPlans.tsx`, `DocumentDownload.tsx`) but they are not wired into `PropertyDetail.tsx`.

**What we build:**
- Wire existing `FloorPlans` component into `PropertyDetail.tsx` if floor plan data exists
- Wire existing `DocumentDownload` component for brochure downloads (gated behind email capture)
- Add a `PaymentPlanBreakdown` visual (already exists as component) showing the payment schedule timeline

**Files:** `PropertyDetail.tsx` (add 3 existing components)

---

## 6. "Why This Project" Summary (AI-Powered)

**The gap:** Property descriptions are generic. A short, punchy "Why invest here" summary would differentiate from every portal.

**What we build:**
- Auto-generate a 3-bullet "Why This Project" card using property attributes (ROI, area trend, Golden Visa eligibility, payment plan, completion timeline)
- Pure logic -- no AI API needed. Use conditional templates:
  - If ROI > 7%: "Above-average projected yield of X%"
  - If Golden Visa eligible: "Qualifies for 10-year UAE residency"
  - If completion < 12 months: "Near handover -- minimal wait time"
  - If area trend > 10%: "Located in [Area], up X% in 12 months"
- Show as a highlighted card above the inquiry form

**Files:** New `WhyThisProject.tsx` component, added to `PropertyDetail.tsx`

---

## 7. Saved Search Alerts (Email Notifications)

**The gap:** Users can save individual properties but cannot save a search criteria and get notified when new matching properties are added. This is the #1 retention mechanic on Bayut and Property Finder.

**What we build:**
- New `saved_searches` database table (filters JSON, email, created_at)
- "Save this search" button on the Properties page when filters are active
- Simple email capture modal
- Backend function that checks new properties against saved searches and sends email via existing Resend integration

**Files:** New `SaveSearchButton.tsx`, new DB table, new edge function `check-saved-searches`

---

## 8. Property Detail -- Payment Timeline Visualization

**The gap:** The payment plan shows "60/40" as text. Investors need to see when each payment is due relative to construction milestones.

**What we build:**
- Wire existing `PaymentPlanBreakdown.tsx` component into PropertyDetail
- Show a visual timeline: booking %, during construction %, on handover %
- Include post-handover payment plan if `post_handover_percent` and `post_handover_years` data exists

**Files:** `PropertyDetail.tsx` (add component)

---

## 9. Area Guide Enhancement -- Map + Stats

**The gap:** Area Guide pages have text descriptions and property listings but no visual map context and no comparative data (how this area compares to others).

**What we build:**
- Add an area map showing approximate location using existing Leaflet integration
- Add a "How [Area] Compares" section showing price/sqft vs city average
- Add a "Best For" tag section (e.g., "Families", "Investors", "Nightlife")

**Files:** `AreaGuide.tsx` (enhance)

---

## 10. Mobile-First Polish Pass

**The gap:** The desktop experience is premium but mobile hasn't been specifically audited for touch targets, scroll behavior, and form usability.

**What we build:**
- `MobileCTABar.tsx` on PropertyDetail -- fixed bottom bar with "Request Report" + "WhatsApp" buttons (already exists, needs wiring)
- Ensure CategoryBar on Properties page scrolls smoothly with momentum on iOS
- Touch-friendly filter chips with 44px minimum tap targets
- Contact form step indicators larger on mobile

**Files:** `PropertyDetail.tsx`, `CategoryBar.tsx`, `PropertyFilters.tsx`, `Contact.tsx`

---

## Priority Order (Impact vs Effort)

| Priority | Feature | Impact | Effort |
|----------|---------|--------|--------|
| 1 | Global Search | Critical | Medium |
| 2 | Similar Properties | High | Low |
| 3 | Wire Existing Components (Floor Plans, Payment, Docs) | High | Low |
| 4 | "Why This Project" Card | High | Low |
| 5 | Social Proof (View Counts) | High | Medium |
| 6 | Price/Sqft + Neighborhood | High | Medium |
| 7 | Mobile CTA Bar + Polish | High | Low |
| 8 | Area Guide Enhancement | Medium | Medium |
| 9 | Saved Search Alerts | Medium | High |
| 10 | Payment Timeline Visual | Medium | Low |

Items 1-7 would push the rating to **9/10**. Adding items 8-10 completes the **10/10**.

---

## Technical Notes

- **No new dependencies needed** -- Leaflet, Framer Motion, embla-carousel, and all UI primitives are already installed
- **Database changes needed** for item 7 only (new `saved_searches` table + edge function)
- **Existing unused components** that just need wiring: `FloorPlans.tsx`, `DocumentDownload.tsx`, `PaymentPlanBreakdown.tsx`, `MobileCTABar.tsx`, `PropertyMortgageCalculator.tsx`
- Items 2-4 and 6 leverage the existing `area_market_data` and `property_views` tables already in the schema

