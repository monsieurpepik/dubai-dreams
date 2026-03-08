

# Demand Engine — Flagship Feature

## Overview

Transform the existing `/discover` page into a premium multi-step **Investor Intent Builder** that feeds into an **AI Deal Matching Dashboard**. This becomes the platform's hero feature — the entry point from the homepage hero and navigation.

## What We're Building

### 1. Multi-Step Intent Builder (replaces InvestmentQuiz)

A 5-step onboarding flow (Notion/Linear style) at `/discover`:

| Step | Input | UI |
|------|-------|----|
| 1. Budget | Dual-thumb range slider (AED 500K – 10M) | Slider component |
| 2. Location | Multi-select grid of areas (from `area_market_data`) | Pill/chip selector |
| 3. Goal | Single select: Highest Yield / Capital Growth / Holiday Home / Primary Residence | Card selector |
| 4. Risk Tolerance | Single select: Conservative / Balanced / Aggressive | Card selector with descriptions |
| 5. Property Type | Multi-select: Apartment / Villa / Townhouse / Branded Residence | Icon cards |

Each step has smooth slide animations, a progress bar, and back/next navigation. The flow is visually premium — large typography, generous whitespace, glassmorphic containers.

### 2. AI Deal Matching Dashboard

After completing the intent flow, a new edge function (`match-deals`) receives the investor profile and uses Lovable AI to score and rank properties from the database. The response includes:

- **Deal Score** (0-100) computed via AI based on price vs area avg, yield, demand, completion timeline
- **Fair Value Estimate** derived from `area_market_data` avg_price_sqft × property size
- **Rental Yield Estimate** from `roi_estimate` field
- **Liquidity Score** (based on area demand/trend)
- **Verdict**: "Undervalued" / "Fair Price" / "Premium"

The dashboard displays results as premium property cards with a **Deal Meter** (circular gauge), sortable by deal score, yield, or price.

### 3. Property Truth Card Enhancement

On each result card (and optionally on PropertyDetail), show a compact "Truth Card" with:
- Market price estimate vs listing price (progress bar)
- Rental yield potential
- Area demand score (from trend data)
- 5-year appreciation forecast (from trend_12m extrapolation)

### 4. Investor Mode Toggle

A toggle in the dashboard header that switches between:
- **Explorer Mode**: lifestyle-first presentation (images, descriptions, amenities)
- **Investor Mode**: data-first (yield, deal score, undervalued badges, charts)

### 5. Deal Radar (Alerts)

A simple CTA at the bottom of the dashboard: "Activate Deal Radar" — saves the investor profile + email to `saved_searches` with the intent filters, so the existing `check-saved-searches` function can notify them.

### 6. Homepage Integration

Replace the hero headline and primary CTA to funnel into the demand engine:
- Secondary CTA button: **"Find Your Deal →"** linking to `/discover`
- The existing search bar remains as the primary action

## Architecture

### New Files
- `src/components/demand/IntentBuilder.tsx` — 5-step flow component
- `src/components/demand/DealDashboard.tsx` — results dashboard with deal cards
- `src/components/demand/DealCard.tsx` — individual property card with deal score, truth metrics
- `src/components/demand/DealMeter.tsx` — circular score gauge (SVG)
- `src/components/demand/InvestorModeToggle.tsx` — toggle component
- `src/components/demand/DealRadarCTA.tsx` — alert signup
- `supabase/functions/match-deals/index.ts` — edge function that fetches properties + area data, sends to Lovable AI with investor profile, returns scored results

### Modified Files
- `src/pages/Discover.tsx` — complete rewrite to host IntentBuilder → DealDashboard flow
- `src/components/sections/HeroSection.tsx` — add "Find Your Deal" secondary CTA
- `src/components/layout/MenuOverlay.tsx` — rename "Discover" nav item to "Deal Finder" or similar

### Edge Function: `match-deals`
- Receives: `{ budget: [min, max], locations: string[], goal: string, risk: string, propertyTypes: string[] }`
- Fetches all matching properties + area_market_data from DB
- Sends to Lovable AI (gemini-3-flash-preview) with a scoring prompt
- Uses **tool calling** to extract structured JSON (deal_score, fair_value, verdict, yield_estimate, liquidity_score per property)
- Returns scored + ranked property array

### No Database Changes
All data comes from existing `properties`, `area_market_data`, and `developers` tables. Deal Radar saves to existing `saved_searches` table.

## Technical Details

- Budget slider uses the existing Radix `Slider` component (dual thumb)
- Deal Meter is a lightweight SVG arc gauge colored by score tier (green >70, amber 40-70, red <40)
- Dashboard uses `useQuery` with the edge function, showing skeleton cards during loading
- Investor Mode toggle persists in `localStorage`
- All animations via Framer Motion, consistent with existing luxury aesthetic

