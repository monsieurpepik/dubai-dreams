

# Cinematic Split-Text Hero Layout

Inspired by the Uptown reference, here are the key patterns we can adopt for the hero section to create a more dramatic, editorial feel:

---

## 1. Split-Text Hero Typography

The current hero has centered text. The reference uses a **staggered split layout** where headline words are placed at opposite corners -- "BUILDING" top-left, "VISIONS" bottom-right -- creating visual tension and a cinematic feel.

**Implementation:**
- Rework the hero content layout in `HeroSection.tsx` from centered to a full-screen split composition
- Place a small subtitle ("CREATING REALITIES" equivalent -- we'd use the tenant tagline or "INVEST WITH CONFIDENCE") top-left above the main word
- First headline word left-aligned, second headline word right-aligned lower, with the geometric diamond centered between them
- Supporting description text pinned to bottom-left
- CTA button pinned to bottom-right with a small diamond accent

---

## 2. "Scroll to Explore" Indicator

Replace the current minimal vertical line scroll indicator with a labeled "SCROLL TO EXPLORE" text + downward arrow, centered at the bottom.

---

## 3. Enhanced Geometric Diamond

The existing diamond SVG is already in place but can be refined to sit between the split headline words as a focal centerpiece, matching the reference's more prominent diamond element.

---

## Technical Details

### File to modify:
- `src/components/sections/HeroSection.tsx` -- Rework layout to split-text composition with repositioned CTAs and scroll indicator

### Layout structure:
```text
+-----------------------------------------------+
| [subtitle small caps]                          |
| TURN AED 500K                                  |
|                                                |
|              [diamond SVG]                     |
|                                                |
|                        INTO A PORTFOLIO        |
| [description text]          [See Your Returns] |
|            SCROLL TO EXPLORE                   |
+-----------------------------------------------+
```

### No new dependencies needed. Uses existing `framer-motion` for staggered entrance animations.

