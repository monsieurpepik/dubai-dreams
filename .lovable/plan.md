

# City Guide, Neighborhood Index & DLD Market Trends

## What We're Building

Three new features across 2 new pages and 1 new homepage section:

### 1. Neighborhood Index Page — `/areas`
A grid of all neighborhoods with at-a-glance market stats. Each card links to the existing `/areas/:slug` detail page.

**Page structure:**
- Hero: "Dubai Neighborhood Guide" with subtitle
- Sort/filter bar: sort by price (high/low), trend (strongest growth), or alphabetical
- Grid of area cards, each showing:
  - Area name
  - Avg price/sqft from `area_market_data`
  - 12-month trend percentage with up/down indicator
  - Property count (from properties table)
  - Off-plan discount badge (if available)
  - Description snippet (from existing `areaDescriptions` in AreaGuide.tsx)
  - "Best for" tags (from existing `areaTags`)
- SEO content block at the bottom

### 2. DLD Market Trends Section — new homepage section + dedicated `/market` page

**Homepage section** (inserted between WhyDubaiStrip and ThemedCollections):
- "Dubai Market Pulse" heading
- 3-4 key city-wide stats computed from `area_market_data`: city avg price/sqft, avg 12-month growth, top-performing area, average off-plan discount
- A horizontal bar chart (recharts) showing all areas ranked by price/sqft
- "Explore full market data →" link to `/market`

**`/market` page:**
- City-wide summary stats
- Recharts bar chart: all areas by avg price/sqft (horizontal)
- Recharts bar chart: all areas by 12-month trend %
- Table view of all areas with sortable columns (area, price/sqft, trend, off-plan delta)
- Each area name links to its `/areas/:slug` guide
- Editorial note about data sources (DLD/RERA)

### 3. Route & Navigation Updates
- Add `/areas` and `/market` routes in App.tsx
- Add "Areas" and "Market" to the menu overlay navigation

## Files to Create
- `src/pages/Areas.tsx` — neighborhood index
- `src/pages/Market.tsx` — DLD market trends page
- `src/components/sections/MarketPulseSection.tsx` — homepage market pulse strip

## Files to Edit
- `src/App.tsx` — add 2 new routes
- `src/pages/Index.tsx` — add MarketPulseSection
- `src/components/layout/MenuOverlay.tsx` — add Areas & Market nav items
- `src/pages/AreaGuide.tsx` — extract shared constants (area descriptions, tags, coordinates) into a shared file `src/data/areas.ts` so both AreaGuide and the new Areas index can use them

## Data
All data comes from the existing `area_market_data` and `properties` tables — no new database tables or migrations needed. The DLD trends are derived from the `trend_percentage` and `trend_12m` fields already in `area_market_data`.

