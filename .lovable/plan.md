

# Elevated Mobile Experience + Social Presence

Inspired by the Uptown reference, here are the key patterns we can adopt while staying true to the existing Apple-level minimalist aesthetic:

---

## 1. Premium Full-Screen Mobile Menu

The current mobile menu is centered text links on a plain background. The reference shows a much richer experience with:
- **Left-aligned, large serif typography** with staggered opacity (active item bold/white, others dimmed)
- **Social media links** at the bottom of the menu
- **A contextual CTA** ("Get a project in mind?") pinned to the bottom

**Implementation:**
- Redesign the mobile menu in `Header.tsx` with left-aligned nav items, editorial typography hierarchy, and staggered entrance animations
- Add social media icons (Instagram, Facebook/X) at the bottom of the menu
- Add a bottom CTA bar: "Have a project in mind?" linking to `/contact`
- Active route highlighting with bold weight

---

## 2. Social Media Links in Footer

The footer currently has no social media presence. Add social icons (Instagram, Facebook, X/Twitter) to the footer, sourced from tenant config.

**Implementation:**
- Add social media icon links to `Footer.tsx`
- Pull URLs from tenant config (with sensible defaults)

---

## 3. Hero Section -- Geometric Accent Element

The reference uses a decorative diamond/geometric shape overlaid on the hero. A subtle geometric accent can add visual sophistication.

**Implementation:**
- Add a subtle animated geometric line element (diamond or angular frame) to `HeroSection.tsx`, rendered as SVG with a fade-in animation
- Keeps the premium feel without cluttering

---

## Technical Details

### Files to modify:
- `src/components/layout/Header.tsx` -- Redesign mobile menu with left-aligned layout, social links, bottom CTA
- `src/components/layout/Footer.tsx` -- Add social media icon row
- `src/components/sections/HeroSection.tsx` -- Add subtle geometric accent overlay
- `src/types/tenant.ts` -- Add optional `social_links` to tenant type if not present

### No new dependencies needed. Uses existing `framer-motion` and `lucide-react`.

