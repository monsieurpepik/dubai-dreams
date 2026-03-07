

# Redesign Full-Screen Menu Overlay

## Problem
The current menu is a plain white full-screen overlay with large serif text links stacked vertically. It lacks the luxury editorial quality of the rest of the site — no texture, no visual hierarchy beyond font size, no brand presence, and no sophisticated animation. It feels like a placeholder.

## Design Direction
Elevate to a **split-panel editorial menu** inspired by luxury hospitality sites (Aman, Four Seasons) that matches the Hermès-level design system already in use.

## Layout

```text
┌─────────────────────────────────────────────────┐
│  [Brand]                              [Close X] │
├────────────────────┬────────────────────────────┤
│                    │                            │
│  Navigation        │  Context Panel             │
│                    │  (hovered item shows        │
│  · Properties      │   a relevant image or       │
│  · Developers      │   description that fades    │
│  · Intelligence    │   in/out on hover)          │
│  · Private Advisor │                            │
│  · Calculator      │                            │
│  · About           │                            │
│  · How It Works    │                            │
│  · Contact         │                            │
│                    │                            │
├────────────────────┴────────────────────────────┤
│  [Search]    [Currency]    [Get in touch →]     │
│  © OwningDubai · Dubai, UAE                     │
└─────────────────────────────────────────────────┘
```

On **mobile**, the right panel is hidden; the menu stays single-column but with refined spacing and staggered slide-up animations.

## Key Design Elements

1. **Split layout** (desktop): Left 45% navigation, right 55% contextual image panel with crossfade on hover
2. **Staggered entrance**: Nav items slide up individually with `y: 30 → 0` and opacity fade, not just opacity
3. **Hover interaction**: Each nav item reveals a corresponding curated image on the right panel (Dubai skyline, properties, etc.) with a smooth crossfade
4. **Numbering**: Small `01 — 08` index numbers before each link in muted foreground for editorial feel
5. **Subtle grain texture**: Same background grain overlay used elsewhere in the site
6. **Bottom bar**: Brand tagline, social links or secondary nav, currency switcher
7. **Typography**: Keep serif font but reduce size slightly (3xl-5xl instead of 4xl-6xl), add letter-spacing for refinement
8. **Active state**: Subtle left accent line instead of just color change

## Files to Edit
- `src/components/layout/Header.tsx` — Replace the menu overlay section (lines 131-196) with the new split-panel design

## Image Mapping
Each nav item will have an associated Unsplash image URL that displays on the right panel on hover. These are decorative and loaded lazily.

