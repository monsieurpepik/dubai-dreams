

# Hero Redesign: Floating Property Card Style

The reference image shows a hero with: full-bleed cinematic photo, large left-aligned headline, subtitle text, a floating featured property card on the right, category label at bottom-left, and navigation arrows for cycling featured properties.

## What Changes

### 1. HeroSection.tsx — Complete Redesign
- **Layout**: Keep full-screen hero with Ken Burns background, but shift from centered single-word ("Possess") to left-aligned multi-line headline
- **Headline**: "Dubai's Premier Off-Plan Platform" (or similar) — large serif, bottom-left aligned
- **Subtitle**: One line beneath: "Curated investment-grade projects from Dubai's most trusted developers"
- **Floating property card**: Bottom-right, a glassmorphic card showing a featured property thumbnail, price, name, and "View Project →" CTA. Fetches the latest/featured property from the database
- **Category pill**: Bottom-left label "OFF-PLAN PROPERTIES" beneath the subtitle
- **Navigation arrows**: Left/right arrows to cycle through 3-4 featured properties in the floating card
- **Scroll indicator**: Keep existing but slightly adjusted positioning

### 2. Data Fetching
- Query 3-4 latest properties with images from Supabase (same pattern as OffPlanProjectsSection)
- Cycle through them with state + arrow buttons or auto-rotate

### 3. Design Constraints
- Maintain the Hermès-level restraint: no bold colors, glassmorphic card with `backdrop-blur`, serif typography
- Keep the Ken Burns slow zoom on the background image
- Dark gradient overlay stays (bottom-heavy for text legibility)
- The floating card uses `bg-white/10 backdrop-blur-xl border border-white/10` styling

### Files Modified
- `src/components/sections/HeroSection.tsx` — full rewrite with new layout, property card, data fetching

### Implementation Detail
The hero will use `useState` for the active featured property index, with `useQuery` to fetch 4 properties. The floating card shows the property image (small thumbnail), price, name, and a link. Arrow buttons cycle through properties. Auto-advance every 5 seconds. Progress dots show which property is active.

